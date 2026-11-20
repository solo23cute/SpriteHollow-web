/* Three more Club Penguin–style games: bean sorting, thin ice, and a puffle
   roundup. They use the shared game shell, countdown, and reward screen from
   games.js and games-club-wave.js, so payouts and cleanup stay consistent. */

Object.assign(GAME_INFO, {
  beancounters: {
    title: 'Bean Counters',
    icon: '🫘',
    tag: 'Reflexes',
    desc: 'Tap falling coins and gems. Leave the bombs where they are.',
    g1: '#8b5e3c',
    g2: '#ffd166',
  },
  thinice: {
    title: 'Thin Ice',
    icon: '🧊',
    tag: 'Risk',
    desc: 'Cross the pond one tile at a time. Cracked ice costs a life.',
    g1: '#8be9ff',
    g2: '#5a9eff',
  },
  puffleroundup: {
    title: 'Puffle Roundup',
    icon: '🐾',
    tag: 'Reflexes',
    desc: 'Tap puffles before they wander off. Avoid the decoy snowballs.',
    g1: '#ff9ec7',
    g2: '#b69cff',
  },
});

/* ---------------- BEAN COUNTERS ---------------- */

function openBeanCountersGame() {
  const shell = clubGameShell('beancounters', 'Tap coins and gems as they drop. A bomb costs points.', `
    <div data-bean-track style="position:absolute;inset:0;overflow:hidden;border-radius:14px;background:radial-gradient(circle at 50% 8%,#5c3a22,#24140d 72%);touch-action:none">
      <span style="position:absolute;left:14px;bottom:10px;font-size:30px">🧺</span>
      <span style="position:absolute;right:14px;top:10px;font-size:12px;color:#ffe6a3;font-weight:800" data-bean-count>0 caught</span>
    </div>`);
  const track = shell.board.querySelector('[data-bean-track]');
  const countEl = shell.board.querySelector('[data-bean-count]');
  let score = 0;
  let caught = 0;
  let running = true;
  let raf = 0;
  let last = 0;
  const items = [];

  const spawn = () => {
    if (!running) return;
    const roll = Math.random();
    const type = roll < 0.16 ? 'bomb' : roll < 0.28 ? 'gem' : 'coin';
    const el = document.createElement('span');
    el.dataset.beanItem = '1';
    el.dataset.type = type;
    el.textContent = type === 'bomb' ? '💣' : type === 'gem' ? '💎' : '🪙';
    el.style.cssText = `position:absolute;left:${rand(6, 88)}%;top:-10%;font-size:${type === 'gem' ? 30 : 28}px;cursor:pointer;user-select:none;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))`;
    track.appendChild(el);
    items.push({ el, type, y: -10, speed: rand(24, 40) });
  };

  const removeItem = (item) => {
    item.el.remove();
    const index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    clearInterval(spawnTimer);
    items.splice(0).forEach((item) => item.el.remove());
  };

  const finish = () => {
    if (!running) return;
    stop();
    const coins = Math.min(160, 22 + Math.floor(score / 2));
    const xp = Math.min(95, 16 + Math.round(score / 5));
    showGameResult(shell, {
      kind: 'beancounters', score, coins, xp,
      blurb: score >= 220 ? 'The bean counter is spotless.' : score >= 100 ? 'A tidy little haul.' : 'A few beans escaped the basket.',
    });
  };

  const frame = (now) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const item = items[i];
      item.y += item.speed * dt;
      item.el.style.top = `${item.y}%`;
      if (item.y > 108) removeItem(item);
    }
    raf = requestAnimationFrame(frame);
  };

  clubGameEvents(shell, [[track, 'pointerdown', (event) => {
    if (!running) return;
    const el = event.target.closest('[data-bean-item]');
    if (!el) return;
    event.preventDefault();
    const item = items.find((entry) => entry.el === el);
    if (!item) return;
    if (item.type === 'bomb') {
      score = Math.max(0, score - 7);
      Sfx.error();
      el.textContent = '💥';
      setTimeout(() => el.remove(), 120);
    } else {
      score += item.type === 'gem' ? 30 : 12;
      caught += 1;
      Sfx.coin();
      el.remove();
    }
    const index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
    shell.scoreEl.textContent = score;
    countEl.textContent = `${caught} caught`;
  }]]);

  const spawnTimer = setInterval(spawn, 650);
  shell.addCleanup(stop);
  for (let i = 0; i < 3; i += 1) spawn();
  clubGameCountdown(shell, 26, finish);
  raf = requestAnimationFrame((now) => { last = now; frame(now); });
}

/* ---------------- THIN ICE ---------------- */

function openThinIceGame() {
  const shell = clubGameShell('thinice', 'Step only on solid ice. Cracked tiles break underfoot.', `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:9px;padding:12px;overflow:auto">
      <div class="between" style="align-items:center">
        <span class="chip" data-thin-lives>3 lives</span>
        <span class="chip">Cross carefully</span>
      </div>
      <div data-thin-grid style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;flex:1;min-height:0"></div>
    </div>`);
  const board = shell.board;
  const grid = board.querySelector('[data-thin-grid]');
  const livesEl = board.querySelector('[data-thin-lives]');
  const tiles = Array.from({ length: 25 }, (_, index) => ({ index, cracked: false, done: false }));
  const cracked = new Set();
  while (cracked.size < 7) cracked.add(Math.floor(Math.random() * tiles.length));
  cracked.forEach((index) => { tiles[index].cracked = true; });
  tiles.forEach((tile) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.thinTile = tile.index;
    button.textContent = '🧊';
    button.setAttribute('aria-label', `Ice tile ${tile.index + 1}`);
    button.style.cssText = 'aspect-ratio:1;min-width:0;border-radius:12px;border:2px solid rgba(220,245,255,.6);background:linear-gradient(145deg,#dff8ff,#8bd8ff);font-size:clamp(16px,4vw,28px);cursor:pointer;box-shadow:inset 0 -4px 0 rgba(47,92,140,.2)';
    grid.appendChild(button);
  });
  let score = 0;
  let lives = 3;
  let safeLeft = 18;
  let running = true;
  let countdown = null;

  const paintLives = () => { livesEl.textContent = `${lives} ${lives === 1 ? 'life' : 'lives'}`; };

  const finish = () => {
    if (!running) return;
    running = false;
    countdown?.stop();
    const coins = Math.min(150, 20 + Math.floor(score / 2));
    const xp = Math.min(90, 15 + Math.round(score / 6));
    showGameResult(shell, {
      kind: 'thinice', score, coins, xp,
      blurb: lives > 0 ? 'You crossed the whole pond.' : 'The ice had other plans.',
    });
  };

  clubGameEvents(shell, [[grid, 'click', (event) => {
    if (!running) return;
    const button = event.target.closest('[data-thin-tile]');
    if (!button) return;
    const tile = tiles[Number(button.dataset.thinTile)];
    if (!tile || tile.done) return;
    tile.done = true;
    if (tile.cracked) {
      lives -= 1;
      paintLives();
      button.textContent = '💥';
      button.style.background = 'linear-gradient(145deg,#ffb4a8,#d94b3b)';
      Sfx.error();
      if (lives <= 0) finish();
      return;
    }
    safeLeft -= 1;
    score += 12;
    button.disabled = true;
    button.textContent = '❄️';
    button.style.background = 'linear-gradient(145deg,#f2fdff,#a9e4ff)';
    Sfx.coin();
    shell.scoreEl.textContent = score;
    if (safeLeft <= 0) {
      score += 50;
      shell.scoreEl.textContent = score;
      finish();
    }
  }]]);

  countdown = clubGameCountdown(shell, 34, finish);
}

/* ---------------- PUFFLE ROUNDUP ---------------- */

function openPuffleRoundupGame() {
  const shell = clubGameShell('puffleroundup', 'Tap puffles to round them up. Snowball decoys cost points.', `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:9px;padding:12px;overflow:auto">
      <div class="between" style="align-items:center">
        <span class="chip" data-round-count>0 rounded up</span>
        <span class="chip">🐾 Roundup</span>
      </div>
      <div data-round-grid style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;flex:1;min-height:0"></div>
    </div>`);
  const board = shell.board;
  const grid = board.querySelector('[data-round-grid]');
  const countEl = board.querySelector('[data-round-count]');
  const cells = Array.from({ length: 9 }, (_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.roundCell = index;
    button.style.cssText = 'aspect-ratio:1;min-width:0;border-radius:14px;border:2px solid rgba(255,158,199,.4);background:linear-gradient(145deg,#3a2350,#221631);font-size:clamp(20px,7vw,40px);cursor:pointer;box-shadow:inset 0 0 24px rgba(182,156,255,.18)';
    button.setAttribute('aria-label', `Roundup pen ${index + 1}`);
    grid.appendChild(button);
    return button;
  });
  const timers = new Map();
  let score = 0;
  let rounded = 0;
  let running = true;

  const clearCell = (cell) => {
    const timer = timers.get(cell);
    if (timer) clearTimeout(timer);
    timers.delete(cell);
    delete cell.dataset.kind;
    cell.textContent = '';
    cell.style.background = 'linear-gradient(145deg,#3a2350,#221631)';
  };

  const spawn = () => {
    if (!running) return;
    const free = cells.filter((cell) => !cell.dataset.kind);
    if (free.length < 2) return;
    const pickCell = () => free.splice(Math.floor(Math.random() * free.length), 1)[0];
    const puffle = pickCell();
    const decoy = pickCell();
    const place = (cell, kind) => {
      cell.dataset.kind = kind;
      cell.textContent = kind === 'puffle' ? '🐾' : '❄️';
      cell.style.background = kind === 'puffle'
        ? 'linear-gradient(145deg,#ff9ec7,#b65cff)'
        : 'linear-gradient(145deg,#dff8ff,#8bd8ff)';
      timers.set(cell, setTimeout(() => clearCell(cell), rand(850, 1450)));
    };
    place(puffle, 'puffle');
    place(decoy, 'decoy');
  };

  const stop = () => {
    running = false;
    clearInterval(spawnTimer);
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  };

  const finish = () => {
    if (!running) return;
    stop();
    const coins = Math.min(155, 22 + Math.floor(score / 2));
    const xp = Math.min(92, 16 + Math.round(score / 5));
    showGameResult(shell, {
      kind: 'puffleroundup', score, coins, xp,
      blurb: rounded >= 18 ? 'Every puffle accounted for.' : rounded >= 9 ? 'A good little roundup.' : 'The puffles are still giggling somewhere.',
    });
  };

  clubGameEvents(shell, [[grid, 'click', (event) => {
    if (!running) return;
    const cell = event.target.closest('[data-round-cell]');
    if (!cell || !cell.dataset.kind) return;
    const kind = cell.dataset.kind;
    clearCell(cell);
    if (kind === 'puffle') {
      score += 12;
      rounded += 1;
      Sfx.coin();
      countEl.textContent = `${rounded} rounded up`;
    } else {
      score = Math.max(0, score - 5);
      Sfx.error();
    }
    shell.scoreEl.textContent = score;
  }]]);

  const spawnTimer = setInterval(spawn, 680);
  shell.addCleanup(stop);
  spawn();
  clubGameCountdown(shell, 28, finish);
}

const CLUB_EXTRA_GAME_OPENERS = {
  beancounters: openBeanCountersGame,
  thinice: openThinIceGame,
  puffleroundup: openPuffleRoundupGame,
};

if (typeof openGame !== 'undefined') {
  const prevOpenGameClubExtra = window.openGame;
  window.openGame = function (kind) {
    return Object.prototype.hasOwnProperty.call(CLUB_EXTRA_GAME_OPENERS, kind)
      ? CLUB_EXTRA_GAME_OPENERS[kind]()
      : prevOpenGameClubExtra(kind);
  };
}
