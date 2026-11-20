/* Virtual Pet Classics Mini-Games:
   1. Hollow Surfer (Subway Surfers style 3-lane endless runner)
   2. Candy Drop (Om Nom / Pou feeding mini-game)
   3. Talking Echo (Talking Tom voice/sound reaction loop)
   4. Gene Hatchery (OviPets / Dragon Hatch incubator) */

const PET_CLASSIC_GAMES_INFO = {
  surfer: { title: 'Hollow Surfer', icon: '🛹', tag: 'Endless Runner', desc: 'Swipe left/right to change lanes, dodge barriers, and collect coins!', g1: '#2979ff', g2: '#ffea00' },
  candydrop: { title: 'Candy Catch', icon: '🍬', desc: 'Tap and catch falling candies into Om Nom’s mouth!', tag: 'Feed & Catch', g1: '#76ff03', g2: '#ff3d00' },
  talkecho: { title: 'Talking Friend', icon: '🎤', tag: 'Voice & Echo', desc: 'Tap your sprite to chat, hear funny pitch-shifted echoes and sound reactions!', g1: '#b0b8c0', g2: '#ff80ab' },
  genehatch: { title: 'Dragon Incubator', icon: '🥚', tag: 'Genetic Hatchery', desc: 'Tap genetic eggs to warm them and reveal rare mutations!', g1: '#7c4dff', g2: '#ffd700' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, PET_CLASSIC_GAMES_INFO);

/* ---------------- 1. HOLLOW SURFER (Subway Surfer 3-Lane Runner) ---------------- */
function openSurferGame() {
  const shell = gameOverlayShell('surfer');
  const { board } = shell;
  board.innerHTML = `<div class="surfer-track">
      <div class="surfer-hud"><span data-score-sub>0 m</span><span class="tiny muted">Dodge obstacles!</span></div>
      <div class="surfer-lanes">
        <div class="surfer-lane" data-lane="0"></div>
        <div class="surfer-lane" data-lane="1"><div class="surfer-runner">🛹</div></div>
        <div class="surfer-lane" data-lane="2"></div>
      </div>
      <div class="surfer-controls">
        <button class="btn btn-ghost" data-left>⬅️ Left</button>
        <button class="btn btn-ghost" data-right>Right ➡️</button>
      </div>
    </div>`;

  const runnerEl = board.querySelector('.surfer-runner');
  const lanes = [...board.querySelectorAll('.surfer-lane')];
  let currentLane = 1;
  let score = 0;
  let coins = 0;
  let running = true;
  let obstacles = [];
  let coinItems = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 25000;

  function setLane(laneIdx) {
    currentLane = Math.max(0, Math.min(2, laneIdx));
    lanes.forEach((l, i) => {
      l.innerHTML = i === currentLane ? '<div class="surfer-runner">🛹</div>' : '';
    });
  }

  board.querySelector('[data-left]').onclick = () => setLane(currentLane - 1);
  board.querySelector('[data-right]').onclick = () => setLane(currentLane + 1);

  // Swipe gesture support
  let touchStartX = 0;
  board.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  board.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) setLane(currentLane + 1);
    else if (diff < -40) setLane(currentLane - 1);
  });

  function spawnItem() {
    const laneIdx = randInt(0, 2);
    const isObstacle = chance(0.5);
    const el = document.createElement('div');
    el.className = isObstacle ? 'surfer-obs' : 'surfer-coin';
    el.textContent = isObstacle ? pick(['🚧', '🚂', '📦']) : '🪙';
    el.style.top = '-10%';
    lanes[laneIdx].appendChild(el);
    (isObstacle ? obstacles : coinItems).push({ el, lane: laneIdx, y: -10, dead: false });
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (now - lastSpawn > 500) {
      spawnItem();
      lastSpawn = now;
    }

    // Move obstacles
    obstacles.forEach((obs) => {
      if (obs.dead) return;
      obs.y += 35 * dt;
      obs.el.style.top = `${obs.y}%`;
      if (obs.y >= 75 && obs.y <= 95 && obs.lane === currentLane) {
        obs.dead = true;
        obs.el.remove();
        Sfx.error();
        score = Math.max(0, score - 5);
        toast('Crash! -5 distance', '💥');
      } else if (obs.y > 105) {
        obs.dead = true;
        obs.el.remove();
      }
    });

    // Move coins
    coinItems.forEach((c) => {
      if (c.dead) return;
      c.y += 35 * dt;
      c.el.style.top = `${c.y}%`;
      if (c.y >= 75 && c.y <= 95 && c.lane === currentLane) {
        c.dead = true;
        c.el.remove();
        coins += 1;
        score += 2;
        Sfx.coin();
      } else if (c.y > 105) {
        c.dead = true;
        c.el.remove();
      }
    });

    obstacles = obstacles.filter((o) => !o.dead);
    coinItems = coinItems.filter((c) => !c.dead);

    const elapsed = Math.floor((now - startedAt) / 100);
    score += 1;
    shell.scoreEl.textContent = score;

    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'surfer', score, coins: Math.min(85, 10 + coins * 4), xp: 20 + score,
        blurb: score >= 200 ? 'Subway Surfer Legend!' : 'Great run through the Hollow tracks!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

/* ---------------- 2. CANDY CATCH (Om Nom / Pou style) ---------------- */
function openCandyDropGame() {
  const shell = gameOverlayShell('candydrop');
  const { board } = shell;
  board.innerHTML = `<div class="candydrop-field">
      <div class="candydrop-mouth">🐸</div>
      <div class="tiny muted" style="text-align:center;margin-top:8px">Tap falling candies into Om Nom’s mouth!</div>
    </div>${gameMiniSprite()}`;

  const candies = ['🍬', '🍭', '🍩', '🍫', '🧁', '🍓'];
  let score = 0;
  let running = true;
  let lastSpawn = 0;
  let items = [];
  let startedAt = performance.now();
  const DURATION = 20000;

  function spawnCandy() {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'falling-candy';
    el.textContent = pick(candies);
    el.style.left = `${rand(15, 85)}%`;
    el.style.top = '-10%';
    const item = { el, y: -10, speed: rand(20, 32), dead: false };

    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!running || item.dead) return;
      item.dead = true;
      score += 1;
      Sfx.eat();
      el.style.transform = 'scale(1.6)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
      shell.scoreEl.textContent = score;
    });

    board.appendChild(el);
    items.push(item);
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (now - lastSpawn > 450) {
      spawnCandy();
      lastSpawn = now;
    }

    items.forEach((item) => {
      if (item.dead) return;
      item.y += item.speed * dt;
      item.el.style.top = `${item.y}%`;
      if (item.y > 105) {
        item.dead = true;
        item.el.remove();
      }
    });
    items = items.filter((i) => !i.dead);

    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'candydrop', score, coins: Math.min(75, 12 + score * 3), xp: 15 + score * 2,
        blurb: score >= 20 ? 'Nom Nom Champion!' : 'Tasty candy catch!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); items.forEach((i) => i.el.remove()); });
}

/* ---------------- 3. TALKING ECHO (Talking Tom style) ---------------- */
function openTalkEchoGame() {
  const shell = gameOverlayShell('talkecho');
  const { board } = shell;
  const s = activeSprite();
  board.innerHTML = `<div class="talkecho-stage" style="text-align:center;padding:20px">
      <div style="font-size:72px;margin-bottom:12px" data-pet-avatar>${spriteSVG(s, { expr: 'happy' })}</div>
      <h3>${s ? displayName(s) : 'Talking Friend'}</h3>
      <p class="muted small" data-echo-status>Tap any button to trigger hilarious sound reactions!</p>
      <div class="row" style="gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap">
        <button class="btn btn-gold" data-act="meow">🐱 Meow</button>
        <button class="btn btn-primary" data-act="giggle">🤭 Giggle</button>
        <button class="btn btn-soft" data-act="sing">🎶 Sing</button>
        <button class="btn btn-gold" data-act="poke">👉 Poke</button>
      </div>
    </div>`;

  let score = 0;
  const avatar = board.querySelector('[data-pet-avatar]');
  const status = board.querySelector('[data-echo-status]');

  board.querySelectorAll('[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.act;
      score += 1;
      shell.scoreEl.textContent = score;

      if (act === 'meow') {
        Sfx.cry(s, { force: true });
        status.textContent = 'Meow! Echoing back!';
      } else if (act === 'giggle') {
        Sfx.purr();
        status.textContent = 'Hehehe! That tickles!';
      } else if (act === 'sing') {
        Sfx.level();
        status.textContent = 'La la la! High pitch song!';
      } else if (act === 'poke') {
        Sfx.pop();
        status.textContent = 'Boop! Hey, stop poking me!';
      }
      burstOn(btn, ['✨', '🎶', '💛'], 5);

      if (score >= 10) {
        showGameResult(shell, {
          kind: 'talkecho', score, coins: 50, xp: 30,
          blurb: 'Talking Star! Your friend loved chatting!',
        });
      }
    });
  });
}

/* The Hatchery's own creature. The screen used to end with gameMiniSprite(),
   which paints the player's active pet, so it showed an unrelated sprite.
   This little dragon belongs to the game and appears when the egg opens. */
function geneHatchlingArt() {
  const body = '#7c4dff';
  const light = '#c9b6ff';
  const deep = '#2b1a6b';
  const gold = '#ffd700';
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A newly hatched dragon">
    <ellipse cx="60" cy="104" rx="24" ry="5" fill="#000" opacity=".22"/>
    <path d="M60 34c18 0 30 13 30 30 0 16-13 26-30 26S30 80 30 64c0-17 12-30 30-30Z" fill="${body}" stroke="${deep}" stroke-width="1.4"/>
    <path d="M38 42c-8-10-6-18 2-18 5 0 8 6 9 12Z" fill="${light}" stroke="${deep}" stroke-width="1.2"/>
    <path d="M82 42c8-10 6-18-2-18-5 0-8 6-9 12Z" fill="${light}" stroke="${deep}" stroke-width="1.2"/>
    <path d="M60 26l6 10H54Z" fill="${gold}" stroke="${deep}" stroke-width="1.2"/>
    <ellipse cx="50" cy="62" rx="6" ry="8" fill="#1d1734"/><ellipse cx="70" cy="62" rx="6" ry="8" fill="#1d1734"/>
    <circle cx="52" cy="59" r="2.2" fill="#fff"/><circle cx="72" cy="59" r="2.2" fill="#fff"/>
    <path d="M52 80c5 4 11 4 16 0" stroke="${deep}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30 74c-6 2-9 7-8 12 5 1 9-2 11-6Z" fill="${light}" opacity=".7"/>
    <path d="M90 74c6 2 9 7 8 12-5 1-9-2-11-6Z" fill="${light}" opacity=".7"/>
  </svg>`;
}

/* ---------------- 4. GENE HATCHERY (Dragon Hatch / OviPets style) ---------------- */
function openGeneHatchGame() {
  const shell = gameOverlayShell('genehatch');
  const { board } = shell;
  board.innerHTML = `<div class="genehatch-wrap" style="text-align:center;padding:16px">
      <div class="eyebrow">Dragon Hatchery</div>
      <div style="font-size:64px;margin:16px 0;cursor:pointer" data-egg>🥚</div>
      <p class="muted small" data-hatch-info>Tap the genetic egg 10 times to warm and hatch it!</p>
      <div class="arcade-bar" style="margin:12px 0"><i data-hatch-progress style="width:0%"></i></div>
      <div data-hatchling style="width:86px;margin:10px auto 0"></div>
    </div>`;

  const eggEl = board.querySelector('[data-egg]');
  const infoEl = board.querySelector('[data-hatch-info]');
  const barEl = board.querySelector('[data-hatch-progress]');
  let taps = 0;
  const GOAL = 10;
  const eggTypes = ['🥚', '🐣', '🐉', '✨', '🐲'];

  eggEl.addEventListener('click', () => {
    taps += 1;
    const pct = Math.min(100, (taps / GOAL) * 100);
    barEl.style.width = `${pct}%`;
    shell.scoreEl.textContent = taps;

    if (taps < GOAL) {
      Sfx.pop();
      eggEl.textContent = pick(['🥚', '🐣']);
      infoEl.textContent = `Warming egg… ${GOAL - taps} more taps!`;
      burstOn(eggEl, ['✨', '💛'], 4);
    } else {
      Sfx.hatch();
      eggEl.textContent = '🐲';
      infoEl.textContent = 'A rare Genetic Dragon hatched!';
      const hatchlingEl = board.querySelector('[data-hatchling]');
      if (hatchlingEl) hatchlingEl.innerHTML = geneHatchlingArt();
      burstOn(eggEl, ['🐉', '✨', '🌟'], 12);

      setTimeout(() => {
        showGameResult(shell, {
          kind: 'genehatch', score: taps, coins: 65, xp: 40,
          blurb: 'Genetic Dragon Hatched!',
        });
      }, 700);
    }
  });
}

if (typeof openGame !== 'undefined') {
  // Wire up mini-game openers
  const origOpenGame = openGame;
  window.openGame = function (kind) {
    if (kind === 'surfer') openSurferGame();
    else if (kind === 'candydrop') openCandyDropGame();
    else if (kind === 'talkecho') openTalkEchoGame();
    else if (kind === 'genehatch') openGeneHatchGame();
    else origOpenGame(kind);
  };
}
