/* Three coin-only Play games: Lucky Spin, Guess the Number, Fruit Blast.
   Every reward is in-game coins (the same currency as the other Play games).
   Nothing here pays out real money. Loaded after games.js so GAME_INFO exists. */

Object.assign(GAME_INFO, {
  lucky: { title: 'Lucky Spin', icon: '🎡', tag: 'Arcade wheel', desc: 'Three spins per game for coins and XP — the arcade take on the Daily Wheel.', g1: '#ffd84d', g2: '#ff5e8a' },
  guess: { title: 'Guess the Number', icon: '🔢', tag: 'Guessing', desc: 'Find the hidden number from 1 to 10 in three tries.', g1: '#56c8e8', g2: '#8b7bff' },
  fruitblast: { title: 'Fruit Blast', icon: '🍉', tag: 'Matching', desc: 'Blast groups of matching fruit before time runs out.', g1: '#7ee787', g2: '#ff7a7a' },
});

const CASH_GAME_KEYS = ['lucky', 'guess', 'fruitblast', 'candyswap'];

function openCashGame(kind) {
  if (kind === 'lucky') openLuckySpinGame();
  else if (kind === 'guess') openGuessGame();
  else if (kind === 'fruitblast') openFruitBlastGame();
  else if (kind === 'candyswap') openCandySwapGame();
}

/* ---------------- LUCKY SPIN ---------------- */

const LUCKY_PRIZES = [
  { label: '10', coins: 10, color: '#ff9a5a' },
  { label: 'Oops', coins: 0, color: '#56c8e8' },
  { label: '25', coins: 25, color: '#ffd84d' },
  { label: '5', coins: 5, color: '#8b7bff' },
  { label: '60', coins: 60, color: '#ff5e8a' },
  { label: 'Oops', coins: 0, color: '#7ee787' },
  { label: '15', coins: 15, color: '#38bdf8' },
  { label: '100', coins: 100, color: '#f2a23c' },
];
const LUCKY_SPINS = 3;
const LUCKY_SLICE = 360 / LUCKY_PRIZES.length;
const LUCKY_SPIN_MS = 3200;

function openLuckySpinGame() {
  const shell = gameOverlayShell('lucky');
  const { board } = shell;
  const gradient = LUCKY_PRIZES
    .map((p, i) => `${p.color} ${i * LUCKY_SLICE}deg ${(i + 1) * LUCKY_SLICE}deg`)
    .join(',');
  const labels = LUCKY_PRIZES
    .map((p, i) => `<span style="position:absolute;left:calc(50% - 24px);top:0;width:48px;height:50%;transform-origin:50% 100%;transform:rotate(${i * LUCKY_SLICE + LUCKY_SLICE / 2}deg);display:flex;justify-content:center;padding-top:16px;font-size:13px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.6)">${p.label}</span>`)
    .join('');
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:12px">
      <div style="position:relative;width:min(62vw,220px);height:min(62vw,220px)">
        <div style="position:absolute;left:50%;top:-8px;transform:translateX(-50%);z-index:2;width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;border-top:20px solid #fff;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))"></div>
        <div data-wheel style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(${gradient});border:4px solid rgba(255,255,255,.85);box-shadow:0 10px 30px rgba(0,0,0,.35);transition:transform ${LUCKY_SPIN_MS}ms cubic-bezier(.12,.7,.1,1)">${labels}</div>
      </div>
      <button class="btn btn-gold btn-block" data-spin style="max-width:230px">Spin</button>
      <div class="tiny muted" data-msg>Three spins. Every prize is coins.</div>
    </div>${gameMiniSprite()}`;

  const wheel = board.querySelector('[data-wheel]');
  const spinBtn = board.querySelector('[data-spin]');
  const msg = board.querySelector('[data-msg]');
  let angle = 0;
  let spinsLeft = LUCKY_SPINS;
  let total = 0;
  let spinning = false;
  let timers = [];

  shell.timerEl.textContent = `Spins ${spinsLeft}`;
  shell.timerBar.style.width = '100%';

  function finish() {
    if (shell.isClosed()) return;
    showGameResult(shell, {
      kind: 'lucky',
      score: total,
      coins: total,
      xp: 6 + Math.round(total / 6),
      blurb: total >= 100 ? 'Jackpot energy!' : total >= 40 ? 'The wheel loved you!' : total > 0 ? 'Some coins for the Hollow.' : 'The wheel was shy today.',
    });
  }

  spinBtn.addEventListener('click', () => {
    if (spinning || spinsLeft <= 0) return;
    spinning = true;
    spinBtn.disabled = true;
    const idx = Math.floor(Math.random() * LUCKY_PRIZES.length);
    const center = idx * LUCKY_SLICE + LUCKY_SLICE / 2;
    const base = angle - (angle % 360);
    angle = base + 360 * 5 + (360 - center);
    wheel.style.transform = `rotate(${angle}deg)`;
    Sfx.tick();
    timers.push(setTimeout(() => {
      if (shell.isClosed()) return;
      const prize = LUCKY_PRIZES[idx];
      spinsLeft -= 1;
      total += prize.coins;
      shell.scoreEl.textContent = total;
      shell.timerEl.textContent = `Spins ${spinsLeft}`;
      shell.timerBar.style.width = `${(spinsLeft / LUCKY_SPINS) * 100}%`;
      msg.textContent = prize.coins ? `${prize.coins} coins!` : 'So close. Nothing this time.';
      if (prize.coins) Sfx.coin(); else Sfx.error();
      burstOn(board, prize.coins ? ['🪙', '✨'] : ['💨'], prize.coins ? 6 : 3);
      spinning = false;
      if (spinsLeft <= 0) {
        msg.textContent = `Wheel done: ${total} coins in total.`;
        timers.push(setTimeout(finish, 600));
      } else {
        spinBtn.disabled = false;
      }
    }, LUCKY_SPIN_MS + 50));
  });

  shell.addCleanup(() => timers.forEach(clearTimeout));
}

/* ---------------- GUESS THE NUMBER ---------------- */

const GUESS_ROUNDS = 5;
const GUESS_TRIES = 3;
const GUESS_MAX = 10;

function openGuessGame() {
  const shell = gameOverlayShell('guess');
  const { board } = shell;
  const buttons = Array.from({ length: GUESS_MAX }, (_, i) => i + 1)
    .map((n) => `<button class="btn" data-n="${n}" style="min-width:0;padding:12px 0">${n}</button>`)
    .join('');
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px">
      <div class="tiny muted" data-round>Round 1 of ${GUESS_ROUNDS}</div>
      <div data-clue style="font-size:18px;font-weight:700;text-align:center;min-height:24px">Pick a number from 1 to ${GUESS_MAX}</div>
      <div data-numbers style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;width:min(92%,320px)">${buttons}</div>
      <div class="tiny muted" data-msg></div>
    </div>${gameMiniSprite()}`;

  const roundEl = board.querySelector('[data-round]');
  const clueEl = board.querySelector('[data-clue]');
  const msgEl = board.querySelector('[data-msg]');
  const numWrap = board.querySelector('[data-numbers]');
  let round = 0;
  let score = 0;
  let target = 0;
  let tries = 0;
  let locked = false;
  let timers = [];

  function startRound() {
    round += 1;
    target = 1 + Math.floor(Math.random() * GUESS_MAX);
    tries = 0;
    locked = false;
    roundEl.textContent = `Round ${round} of ${GUESS_ROUNDS}`;
    clueEl.textContent = `Pick a number from 1 to ${GUESS_MAX}`;
    msgEl.textContent = `${GUESS_TRIES} tries. Hints say higher or lower.`;
    numWrap.querySelectorAll('button').forEach((b) => { b.disabled = false; });
    shell.timerEl.textContent = `Round ${round} / ${GUESS_ROUNDS}`;
    shell.timerBar.style.width = `${((round - 1) / GUESS_ROUNDS) * 100}%`;
  }

  function endRound() {
    locked = true;
    numWrap.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    shell.timerBar.style.width = `${(round / GUESS_ROUNDS) * 100}%`;
    timers.push(setTimeout(() => {
      if (shell.isClosed()) return;
      if (round >= GUESS_ROUNDS) finish();
      else startRound();
    }, 1100));
  }

  function finish() {
    if (shell.isClosed()) return;
    showGameResult(shell, {
      kind: 'guess',
      score,
      coins: 8 + score * 5,
      xp: 8 + score * 2,
      blurb: score >= 12 ? 'Mind reader!' : score >= 7 ? 'Sharp guessing!' : score > 0 ? 'A few good guesses.' : 'The numbers hid well.',
    });
  }

  numWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn || locked || btn.disabled) return;
    const n = Number(btn.dataset.n);
    tries += 1;
    btn.disabled = true;
    shell.timerBar.style.width = `${((round - 1 + 0.5) / GUESS_ROUNDS) * 100}%`;
    if (n === target) {
      const pts = GUESS_TRIES - tries + 1;
      score += pts;
      shell.scoreEl.textContent = score;
      clueEl.textContent = `Yes! It was ${target}.`;
      msgEl.textContent = pts === 3 ? 'First try, wow!' : pts === 2 ? 'Nice, second try.' : 'Just in time.';
      Sfx.coin();
      burstOn(btn, ['✨', '🪙'], 6);
      endRound();
    } else if (tries >= GUESS_TRIES) {
      clueEl.textContent = `It was ${target}.`;
      msgEl.textContent = 'Out of tries. No points this round.';
      Sfx.error();
      endRound();
    } else {
      const left = GUESS_TRIES - tries;
      clueEl.textContent = n < target ? 'Higher!' : 'Lower!';
      msgEl.textContent = `${left} ${left === 1 ? 'try' : 'tries'} left.`;
      Sfx.tick();
    }
  });

  shell.addCleanup(() => timers.forEach(clearTimeout));
  startRound();
}

/* ---------------- FRUIT BLAST ---------------- */

const FB_FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓'];
const FB_COLS = 7;
const FB_ROWS = 7;
const FB_TIME = 30;

function fbRandomFruit() {
  return FB_FRUITS[Math.floor(Math.random() * FB_FRUITS.length)];
}

function fbGroup(grid, r, c) {
  const kind = grid[r][c];
  if (!kind) return [];
  const seen = new Set([`${r},${c}`]);
  const queue = [[r, c]];
  const out = [];
  while (queue.length) {
    const [y, x] = queue.shift();
    out.push([y, x]);
    for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ny = y + dy;
      const nx = x + dx;
      if (ny < 0 || nx < 0 || ny >= FB_ROWS || nx >= FB_COLS) continue;
      const key = `${ny},${nx}`;
      if (seen.has(key) || grid[ny][nx] !== kind) continue;
      seen.add(key);
      queue.push([ny, nx]);
    }
  }
  return out;
}

function fbHasMove(grid) {
  for (let r = 0; r < FB_ROWS; r++) {
    for (let c = 0; c < FB_COLS; c++) {
      if (fbGroup(grid, r, c).length >= 2) return true;
    }
  }
  return false;
}

function fbMakeBoard() {
  let grid;
  do {
    grid = Array.from({ length: FB_ROWS }, () => Array.from({ length: FB_COLS }, fbRandomFruit));
  } while (!fbHasMove(grid));
  return grid;
}

function fbCollapse(grid, cells) {
  cells.forEach(([r, c]) => { grid[r][c] = null; });
  for (let c = 0; c < FB_COLS; c++) {
    const column = [];
    for (let r = FB_ROWS - 1; r >= 0; r--) if (grid[r][c]) column.push(grid[r][c]);
    for (let r = FB_ROWS - 1; r >= 0; r--) grid[r][c] = column.length ? column.shift() : fbRandomFruit();
  }
}

function openFruitBlastGame() {
  const shell = gameOverlayShell('fruitblast');
  const { board } = shell;
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px">
      <div data-grid style="display:grid;grid-template-columns:repeat(${FB_COLS},1fr);gap:4px;width:min(94%,360px)"></div>
      <div class="tiny muted" data-msg>Tap a group of 2 or more matching fruit.</div>
    </div>${gameMiniSprite()}`;

  const grid = board.querySelector('[data-grid]');
  const msgEl = board.querySelector('[data-msg]');
  let cells = fbMakeBoard();
  let score = 0;
  let running = true;
  const endAt = Date.now() + FB_TIME * 1000;

  function render() {
    grid.innerHTML = cells
      .flatMap((row, r) => row.map((fruit, c) => `<button data-r="${r}" data-c="${c}" style="aspect-ratio:1;font-size:clamp(18px,6vw,26px);line-height:1;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.07);padding:0;cursor:pointer">${fruit}</button>`))
      .join('');
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn || !running) return;
    const r = Number(btn.dataset.r);
    const c = Number(btn.dataset.c);
    const fruit = cells[r][c];
    const group = fbGroup(cells, r, c);
    if (group.length < 2) {
      msgEl.textContent = 'Need 2 or more in a row. Try another group.';
      Sfx.error();
      return;
    }
    const pts = group.length * group.length;
    score += pts;
    shell.scoreEl.textContent = score;
    fbCollapse(cells, group);
    if (!fbHasMove(cells)) {
      cells = fbMakeBoard();
      msgEl.textContent = 'No moves left, so the fruit reshuffled!';
    } else {
      msgEl.textContent = `+${pts} · ${group.length} blasted`;
    }
    Sfx.pop();
    burstOn(btn, [fruit, '✨'], 5);
    render();
  });

  const tick = setInterval(() => {
    const left = Math.max(0, (endAt - Date.now()) / 1000);
    shell.timerEl.textContent = `${Math.ceil(left)}s`;
    shell.timerBar.style.width = `${(left / FB_TIME) * 100}%`;
    if (left <= 0) {
      running = false;
      clearInterval(tick);
      setTimeout(finish, 350);
    }
  }, 200);

  function finish() {
    if (shell.isClosed()) return;
    showGameResult(shell, {
      kind: 'fruitblast',
      score,
      coins: Math.min(150, Math.round(score / 3)),
      xp: Math.min(60, 8 + Math.round(score / 10)),
      blurb: score >= 300 ? 'Fruit frenzy!' : score >= 120 ? 'Juicy combos!' : score > 0 ? 'Some sweet blasts.' : 'The fruit stayed put.',
    });
  }

  shell.addCleanup(() => { running = false; clearInterval(tick); });
  render();
}
