/* Classic-genre arcade wave: the kinds of games the old browser arcades were
   built on — ice fishing timing, bubble popping, and a lane runner. Original
   rules and art, no borrowed characters or names. */

const CLASSIC_GAME_KEYS = ['icefish', 'bubble', 'snowslide'];

Object.assign(GAME_INFO, {
  icefish: {
    title: 'Ice Fishing',
    icon: '🎣',
    tag: 'Timing',
    group: 'arcade',
    desc: 'Tap Strike the moment the bobber dips. Chains pay more; early taps break the chain.',
    g1: '#5ad6ff',
    g2: '#c2f0ff',
  },
  bubble: {
    title: 'Bubble Pop',
    icon: '🫧',
    tag: 'Reflexes',
    group: 'arcade',
    desc: 'Pop drifting bubbles before they float away. Big ones are worth three.',
    g1: '#8be9ff',
    g2: '#b69cff',
  },
  snowslide: {
    title: 'Snowslide Run',
    icon: '🏂',
    tag: 'Runner',
    group: 'arcade',
    desc: 'Swap lanes to dodge the pines. Every tree you pass is a point.',
    g1: '#d6f6ff',
    g2: '#4db8d8',
  },
});

function openClassicGame(kind) {
  if (kind === 'icefish') return openIceFishGame();
  if (kind === 'bubble') return openBubblePopGame();
  if (kind === 'snowslide') return openSnowslideGame();
  return null;
}

function classicClock(shell, seconds, total, onEnd) {
  let left = seconds;
  const paint = () => {
    shell.timerEl.textContent = `${left}s`;
    shell.timerBar.style.width = `${Math.max(0, Math.min(100, (left / total) * 100))}%`;
  };
  paint();
  const id = setInterval(() => {
    left -= 1;
    paint();
    if (left <= 0) {
      clearInterval(id);
      onEnd();
    }
  }, 1000);
  shell.addCleanup(() => clearInterval(id));
}

/* ---------------- ICE FISHING ---------------- */
function openIceFishGame() {
  const shell = gameOverlayShell('icefish');
  shell.board.classList.add('classic-board');
  const { board } = shell;
  board.innerHTML = `<div class="ice-scene">
      <div class="ice-sky" aria-hidden="true"><span>❄</span><span>❄</span><span>❄</span></div>
      <div class="ice-hole"><div class="ice-bobber" data-ice-bobber>🎣</div></div>
      <div class="ice-note tiny muted" data-ice-note>Tap when the bobber dips.</div>
    </div>
    <button class="ice-strike" type="button" data-ice-strike>Strike!</button>
    <div class="ice-catch" data-ice-catch aria-live="polite"></div>${gameMiniSprite()}`;
  const bobber = board.querySelector('[data-ice-bobber]');
  const note = board.querySelector('[data-ice-note]');
  const catchRow = board.querySelector('[data-ice-catch]');
  const strikeBtn = board.querySelector('[data-ice-strike]');
  const DURATION = 40;
  let score = 0;
  let streak = 0;
  let best = 0;
  let catches = 0;
  let running = true;
  let dipping = false;
  let dipTimeout = 0;
  let dipEnd = 0;
  let nextTimeout = 0;

  function say(text) { note.textContent = text; }

  function scheduleDip() {
    if (!running) return;
    nextTimeout = setTimeout(() => {
      if (!running) return;
      dipping = true;
      bobber.classList.add('dip');
      Sfx.tick();
      say('Now! Strike!');
      dipEnd = setTimeout(() => {
        if (!running) return;
        if (dipping) {
          dipping = false;
          bobber.classList.remove('dip');
          if (streak > 0) {
            streak = 0;
            say('It swam off. Chain reset.');
          } else {
            say('Missed one. Wait for the next dip.');
          }
        }
        scheduleDip();
      }, 720);
    }, rand(900, 2200));
  }

  function strike() {
    if (!running) return;
    if (!dipping) {
      streak = 0;
      Sfx.error();
      note.textContent = 'Too early — the line was still.';
      return;
    }
    dipping = false;
    clearTimeout(dipEnd);
    bobber.classList.remove('dip');
    streak += 1;
    catches += 1;
    best = Math.max(best, streak);
    const points = 2 + Math.min(6, streak - 1);
    score += points;
    shell.scoreEl.textContent = score;
    Sfx.coin();
    catchRow.insertAdjacentHTML('beforeend', `<span class="ice-fish">${pick(['🐟', '🐠', '🐡', '🦐', '🦑', '🐙'])}</span>`);
    if (catchRow.children.length > 7) catchRow.firstElementChild.remove();
    note.textContent = `Caught! +${points}${streak > 1 ? ` · chain ${streak}` : ''}`;
    scheduleDip();
  }

  strikeBtn.addEventListener('click', strike);
  board.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-ice-strike]')) strike();
  });
  shell.addCleanup(() => {
    running = false;
    clearTimeout(nextTimeout);
    clearTimeout(dipEnd);
  });
  scheduleDip();
  classicClock(shell, DURATION, DURATION, () => {
    running = false;
    clearTimeout(nextTimeout);
    clearTimeout(dipEnd);
    strikeBtn.disabled = true;
    shell.scoreEl.textContent = score;
    showGameResult(shell, {
      kind: 'icefish',
      score,
      coins: 8 + score + best * 2,
      xp: 22 + score,
      perfect: best > 2 ? best - 2 : 0,
      blurb: catches ? `${catches} fish · best chain ${best}` : 'The fish were shy today.',
    });
  });
}

/* ---------------- BUBBLE POP ---------------- */
function openBubblePopGame() {
  const shell = gameOverlayShell('bubble');
  shell.board.classList.add('classic-board');
  const { board } = shell;
  board.innerHTML = `<div class="bubble-field" data-bubble-field></div>
    <div class="tiny muted bubble-note" data-bubble-note>Pop the drifting bubbles — big ones are worth three.</div>${gameMiniSprite()}`;
  const field = board.querySelector('[data-bubble-field]');
  const note = board.querySelector('[data-bubble-note]');
  const DURATION = 45;
  let score = 0;
  let combo = 0;
  let bestCombo = 0;
  let popped = 0;
  let running = true;
  let raf = 0;
  let spawned = 0;
  let last = performance.now();
  let spawnAcc = 0;
  const bubbles = [];

  function spawn() {
    const size = rand(26, 56);
    // Positions are pixels inside the field. A vh offset measured the screen
    // instead, so every bubble started below the field's bottom edge.
    const height = field.clientHeight || 420;
    const bubble = {
      size,
      x: rand(5, 86),
      y: height - size,
      speed: (innerHeight || height) * rand(0.15, 0.31),
      points: size > 46 ? 3 : size > 36 ? 2 : 1,
      el: document.createElement('button'),
    };
    bubble.el.type = 'button';
    bubble.el.className = 'bubble-dot';
    bubble.el.style.width = `${size}px`;
    bubble.el.style.height = `${size}px`;
    bubble.el.style.left = `${bubble.x}%`;
    bubble.el.innerHTML = '<span></span>';
    bubble.el.addEventListener('click', (event) => {
      event.stopPropagation();
      popBubble(bubble);
    });
    field.appendChild(bubble.el);
    bubbles.push(bubble);
    spawned += 1;
  }

  function removeBubble(bubble) {
    const index = bubbles.indexOf(bubble);
    if (index >= 0) bubbles.splice(index, 1);
    bubble.el.remove();
  }

  function popBubble(bubble) {
    if (!running || !bubbles.includes(bubble)) return;
    combo += 1;
    bestCombo = Math.max(bestCombo, combo);
    popped += 1;
    const points = bubble.points * (1 + Math.floor(combo / 6));
    score += points;
    shell.scoreEl.textContent = score;
    Sfx.pop();
    bubble.el.classList.add('pop');
    setTimeout(() => removeBubble(bubble), 180);
    note.textContent = `+${points}${combo > 3 ? ` · combo ×${1 + Math.floor(combo / 6)}` : ''}`;
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spawnAcc += dt;
    const every = Math.max(0.26, 0.62 - spawned * 0.004);
    if (spawnAcc > every) {
      spawnAcc = 0;
      spawn();
    }
    bubbles.slice().forEach((bubble) => {
      bubble.y -= bubble.speed * dt;
      bubble.el.style.transform = `translate(-50%, ${bubble.y}px)`;
      if (bubble.y < -bubble.size - 8) {
        removeBubble(bubble);
        combo = 0;
      }
    });
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame(loop);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
  });
  classicClock(shell, DURATION, DURATION, () => {
    running = false;
    cancelAnimationFrame(raf);
    bubbles.slice().forEach(removeBubble);
    showGameResult(shell, {
      kind: 'bubble',
      score,
      coins: 8 + score,
      xp: 24 + score,
      perfect: bestCombo > 5 ? Math.floor(bestCombo / 5) : 0,
      blurb: popped ? `${popped} bubbles · best combo ${bestCombo}` : 'The bubbles got away.',
    });
  });
}

/* ---------------- SNOWSLIDE RUN ---------------- */
function openSnowslideGame() {
  const shell = gameOverlayShell('snowslide');
  shell.board.classList.add('classic-board');
  const { board } = shell;
  board.innerHTML = `<div class="slide-track" data-slide-track>
      <div class="slide-lane" style="left:33.3%"></div>
      <div class="slide-lane" style="left:66.6%"></div>
      <div class="slide-obstacles" data-slide-obstacles></div>
      <div class="slide-runner" data-slide-runner>🛷</div>
    </div>
    <div class="slide-controls">
      <button class="slide-arrow" type="button" data-slide-left aria-label="Move left">◀</button>
      <span class="tiny muted" data-slide-note>Dodge the pines</span>
      <button class="slide-arrow" type="button" data-slide-right aria-label="Move right">▶</button>
    </div>${gameMiniSprite()}`;
  const track = board.querySelector('[data-slide-track]');
  const obstaclesWrap = board.querySelector('[data-slide-obstacles]');
  const runner = board.querySelector('[data-slide-runner]');
  const note = board.querySelector('[data-slide-note]');
  const DURATION = 45;
  let lane = 1;
  let score = 0;
  let dodged = 0;
  let running = true;
  let raf = 0;
  let last = performance.now();
  let spawnAcc = 0;
  let spawnEvery = 0.85;
  const obstacles = [];

  function placeRunner() {
    runner.style.left = `${16.6 + lane * 33.3}%`;
  }

  function move(step) {
    if (!running) return;
    const next = Math.max(0, Math.min(2, lane + step));
    if (next === lane) return;
    lane = next;
    placeRunner();
    Sfx.tick();
  }

  function spawn() {
    const obstacleLane = rand(0, 2);
    const el = document.createElement('div');
    el.className = 'slide-tree';
    el.textContent = pick(['🌲', '🌲', '🪨', '⛄']);
    el.style.left = `${16.6 + obstacleLane * 33.3}%`;
    obstaclesWrap.appendChild(el);
    obstacles.push({ el, lane: obstacleLane, y: -12, passed: false });
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spawnAcc += dt;
    if (spawnAcc > spawnEvery) {
      spawnAcc = 0;
      spawn();
      spawnEvery = Math.max(0.42, spawnEvery - 0.012);
    }
    const speed = 34 + Math.min(26, score * 0.55);
    obstacles.slice().forEach((obstacle) => {
      obstacle.y += speed * dt;
      obstacle.el.style.top = `${obstacle.y}%`;
      if (!obstacle.passed && obstacle.y > 84) {
        if (obstacle.lane === lane) {
          running = false;
          cancelAnimationFrame(raf);
          Sfx.error();
          showGameResult(shell, {
            kind: 'snowslide',
            score,
            coins: 6 + score,
            xp: 20 + score,
            blurb: `Crashed into a ${obstacle.el.textContent === '🌲' ? 'pine' : 'snowbank'} after ${dodged} dodges.`,
          });
          return;
        }
        obstacle.passed = true;
        dodged += 1;
        score += 1;
        shell.scoreEl.textContent = score;
        Sfx.tick();
      }
      if (obstacle.y > 118) {
        obstacle.el.remove();
        const index = obstacles.indexOf(obstacle);
        if (index >= 0) obstacles.splice(index, 1);
      }
    });
    note.textContent = `${dodged} dodged`;
    raf = requestAnimationFrame(loop);
  }

  board.querySelector('[data-slide-left]').addEventListener('click', () => move(-1));
  board.querySelector('[data-slide-right]').addEventListener('click', () => move(1));
  track.addEventListener('pointerdown', (event) => {
    const rect = track.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / Math.max(1, rect.width);
    move(ratio < 1 / 3 ? -1 : ratio > 2 / 3 ? 1 : 0);
  });
  const keyHandler = (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  };
  document.addEventListener('keydown', keyHandler);
  shell.addCleanup(() => document.removeEventListener('keydown', keyHandler));
  placeRunner();
  raf = requestAnimationFrame(loop);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
  });
  classicClock(shell, DURATION, DURATION, () => {
    running = false;
    cancelAnimationFrame(raf);
    showGameResult(shell, {
      kind: 'snowslide',
      score,
      coins: 10 + score * 2,
      xp: 26 + score * 2,
      blurb: `${dodged} clean dodges down the slide.`,
    });
  });
}
