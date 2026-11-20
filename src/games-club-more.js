/* Two more Club Penguin-style games: a three-lane sled run and a rhythm
   dance call. They use the shared shell, timer and reward screen so payouts
   and cleanup match the rest of the arcade. */

Object.assign(GAME_INFO, {
  sledracing: {
    title: 'Sled Racing',
    icon: '🛷',
    tag: 'Sled',
    desc: 'Steer between three lanes, grab coins, and dodge trees and rocks.',
    g1: '#8be9ff',
    g2: '#ffffff',
  },
  danceathon: {
    title: 'Dance-A-Thon',
    icon: '💃',
    tag: 'Rhythm',
    desc: 'Tap the arrow sequence in time and build a combo on the dance floor.',
    g1: '#ff9ec7',
    g2: '#b69cff',
  },
});

/* ---------------- SLED RACING ---------------- */

const SLED_LANES = [16.66, 50, 83.34];

function openSledRacingGame() {
  const shell = clubGameShell('sledracing', 'Tap a lane or use the arrow keys. Collect coins and dodge the trees.', `
    <div data-sled-track style="position:absolute;inset:0;overflow:hidden;border-radius:14px;background:linear-gradient(180deg,#bfe9ff,#eefaff 55%,#ffffff);touch-action:none">
      <div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 32.8%,rgba(120,170,200,.45) 33.1% 33.6%,transparent 33.9% 65.8%,rgba(120,170,200,.45) 66.1% 66.6%,transparent 66.9%)"></div>
      <div aria-hidden="true" style="position:absolute;left:0;right:0;top:0;height:22%;background:linear-gradient(180deg,rgba(255,255,255,.9),transparent)"></div>
      <div data-sled-items></div>
      <span data-sled-player style="position:absolute;left:50%;bottom:13%;transform:translate(-50%,50%);font-size:34px;z-index:2;filter:drop-shadow(0 3px 4px rgba(30,60,90,.3))" aria-hidden="true">🛷</span>
      <div data-sled-lanes style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);z-index:3">
        ${[0, 1, 2].map((lane) => `<button type="button" data-sled-lane="${lane}" aria-label="Steer to lane ${lane + 1}" style="border:0;background:transparent;cursor:pointer"></button>`).join('')}
      </div>
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:8px;text-align:center;color:#31506b;font-weight:800;z-index:4;pointer-events:none">Tap a lane to steer</div>
    </div>`);
  const track = shell.board.querySelector('[data-sled-track]');
  const itemsEl = shell.board.querySelector('[data-sled-items]');
  const playerEl = shell.board.querySelector('[data-sled-player]');
  const buttons = [...shell.board.querySelectorAll('[data-sled-lane]')];
  const items = [];
  const timer = clubGameTimer(shell, 30);
  let lane = 1;
  let score = 0;
  let elapsed = 0;
  let running = true;
  let last = performance.now();
  let raf = 0;

  function steer(next) {
    if (!running) return;
    lane = Math.max(0, Math.min(SLED_LANES.length - 1, next));
    playerEl.style.left = `${SLED_LANES[lane]}%`;
    Sfx.tick();
  }
  buttons.forEach((button) => button.addEventListener('click', () => steer(Number(button.dataset.sledLane))));
  clubGameEvents(shell, [[document, 'keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); steer(lane - 1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); steer(lane + 1); }
  }]]);

  function spawn() {
    if (!running) return;
    const laneIndex = Math.floor(Math.random() * SLED_LANES.length);
    const roll = Math.random();
    const type = roll < 0.32 ? 'coin' : roll < 0.64 ? 'tree' : 'rock';
    const el = document.createElement('span');
    el.textContent = type === 'coin' ? '🪙' : type === 'tree' ? '🎄' : '🪨';
    el.style.cssText = `position:absolute;left:${SLED_LANES[laneIndex]}%;top:-9%;transform:translate(-50%,-50%);font-size:${type === 'coin' ? '22px' : '28px'};z-index:1;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(30,60,90,.25))`;
    itemsEl.appendChild(el);
    items.push({ el, lane: laneIndex, y: -9, speed: 42 + Math.min(34, elapsed * 1.1), type });
  }

  function removeItem(item) {
    item.el.remove();
    const index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
  }

  const spawnTimer = setInterval(spawn, 620);
  const stop = () => {
    running = false;
    clearInterval(spawnTimer);
    cancelAnimationFrame(raf);
    items.splice(0).forEach((item) => item.el.remove());
  };

  function finish() {
    if (!running) return;
    stop();
    const final = Math.floor(score);
    showGameResult(shell, {
      kind: 'sledracing', score: final,
      coins: Math.min(150, 22 + Math.floor(final / 2)),
      xp: Math.min(90, 16 + Math.round(final / 4)),
      blurb: final >= 180 ? 'A clean run down the mountain!' : final >= 90 ? 'A fast little slide.' : 'The sled is still finding its feet.',
    });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += dt;
    if (timer.tick(dt)) { finish(); return; }
    score += dt * 3.2;
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const item = items[i];
      item.y += item.speed * dt;
      item.el.style.top = `${item.y}%`;
      if (item.y > 78 && item.lane === lane) {
        if (item.type === 'coin') {
          score += 12;
          Sfx.coin();
          burstOn(playerEl, ['🪙', '✨'], 4);
        } else {
          score = Math.max(0, score - 8);
          Sfx.error();
          if (track.animate) track.animate([{ filter: 'brightness(1.8)' }, { filter: 'brightness(1)' }], { duration: 220 });
        }
        removeItem(item);
        continue;
      }
      if (item.y > 108) removeItem(item);
    }
    shell.scoreEl.textContent = Math.floor(score);
    raf = requestAnimationFrame(frame);
  }
  shell.addCleanup(stop);
  spawn();
  raf = requestAnimationFrame((now) => { last = now; frame(now); });
}

/* ---------------- DANCE-A-THON ---------------- */

const DANCE_ARROWS = [
  { key: 'up', icon: '⬆️', label: 'Up' },
  { key: 'left', icon: '⬅️', label: 'Left' },
  { key: 'down', icon: '⬇️', label: 'Down' },
  { key: 'right', icon: '➡️', label: 'Right' },
];

function openDanceAThonGame() {
  const shell = clubGameShell('danceathon', 'Tap the arrows in the same order as the dance call. Build a combo!', `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;padding:14px;overflow:auto;background:radial-gradient(circle at 50% 0%,#3b245e,#170f2a 72%)">
      <div class="between" style="align-items:center"><span class="chip" data-dance-combo>Combo ×0</span><span class="chip">🕺 Dance floor</span></div>
      <div data-dance-sequence style="display:flex;justify-content:center;gap:10px;min-height:54px;align-items:center;font-size:30px"></div>
      <div data-dance-pad style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;flex:1;min-height:0;max-width:340px;width:100%;margin:auto">
        ${DANCE_ARROWS.map((arrow) => `<button type="button" class="chip" data-dance-arrow="${arrow.key}" aria-label="${arrow.label}" style="min-height:76px;font-size:34px;border-radius:18px;background:linear-gradient(145deg,rgba(255,158,199,.22),rgba(182,156,255,.12));border:1px solid rgba(255,255,255,.2)">${arrow.icon}</button>`).join('')}
      </div>
      <div class="tiny muted" style="text-align:center" data-dance-note>Follow the call, one arrow at a time.</div>
    </div>`);
  const sequenceEl = shell.board.querySelector('[data-dance-sequence]');
  const comboEl = shell.board.querySelector('[data-dance-combo]');
  const note = shell.board.querySelector('[data-dance-note]');
  const buttons = [...shell.board.querySelectorAll('[data-dance-arrow]')];
  let sequence = [];
  let step = 0;
  let combo = 0;
  let score = 0;
  let running = true;

  function paintSequence() {
    sequenceEl.innerHTML = sequence.map((arrow, index) => `<span style="opacity:${index < step ? '.28' : index === step ? '1' : '.6'};transform:scale(${index === step ? '1.18' : '1'});transition:transform .12s,opacity .12s">${arrow.icon}</span>`).join('');
    comboEl.textContent = `Combo ×${combo}`;
    shell.scoreEl.textContent = score;
  }

  function newSequence() {
    sequence = Array.from({ length: 4 }, () => DANCE_ARROWS[Math.floor(Math.random() * DANCE_ARROWS.length)]);
    step = 0;
    paintSequence();
  }

  function tap(key) {
    if (!running || !sequence[step]) return;
    if (key === sequence[step].key) {
      step += 1;
      score += 3 + combo;
      combo += 1;
      Sfx.pop();
      if (step >= sequence.length) {
        score += 10;
        Sfx.win();
        burstOn(sequenceEl, ['✨', '💃', '🎵'], 6);
        note.textContent = 'Perfect phrase! Here comes the next call.';
        newSequence();
      } else {
        note.textContent = `${sequence.length - step} more to finish the phrase.`;
        paintSequence();
      }
    } else {
      combo = 0;
      score = Math.max(0, score - 3);
      Sfx.error();
      note.textContent = 'Wrong arrow — the combo reset. Follow the call.';
      paintSequence();
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => tap(button.dataset.danceArrow)));
  clubGameEvents(shell, [[document, 'keydown', (event) => {
    const map = { ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right' };
    if (map[event.key]) { event.preventDefault(); tap(map[event.key]); }
  }]]);

  const countdown = clubGameCountdown(shell, 26, () => {
    if (!running) return;
    running = false;
    countdown.stop();
    showGameResult(shell, {
      kind: 'danceathon', score,
      coins: Math.min(145, 20 + Math.floor(score / 2)),
      xp: Math.min(88, 16 + Math.round(score / 4)),
      blurb: score >= 120 ? 'The whole floor is watching!' : score >= 55 ? 'A solid routine.' : 'A few moves still to learn.',
    });
  });
  newSequence();
}

if (typeof openGame !== 'undefined') {
  const prevOpenGameClubMore = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'sledracing') return openSledRacingGame();
    if (kind === 'danceathon') return openDanceAThonGame();
    return prevOpenGameClubMore(kind);
  };
}
