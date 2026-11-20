/* Three more mini games: steering, spelling and a reflex grid.

   Ember Balance keeps a flame inside a drifting glow band, Word Sprout grows a
   word out of shuffled letters, and Glimmer Grid asks for quick taps on lights
   while thorns cost a heart. They register through GAME_INFO like every other
   game, so Activities, achievements and the daily first-play bonus all pick
   them up without extra wiring. */

Object.assign(GAME_INFO, {
  emberbalance: { title: 'Ember Balance', icon: '🔥', tag: 'Steering', desc: 'Tap left and right to hold the ember inside the drifting glow.', g1: '#ff9a5a', g2: '#ffd84d' },
  wordsprout: { title: 'Word Sprout', icon: '🌱', tag: 'Words', desc: 'Tap the letters in order and grow the hidden word.', g1: '#7ee787', g2: '#38bdf8' },
  glimmer: { title: 'Glimmer Grid', icon: '✨', tag: 'Reflexes', desc: 'Tap the glimmers before they fade. Skip the thorns.', g1: '#c084fc', g2: '#8b7bff' },
});

const GLIMMER_GAME_KEYS = ['emberbalance', 'wordsprout', 'glimmer'];

function openGlimmerWaveGame(kind) {
  if (kind === 'emberbalance') openEmberBalanceGame();
  else if (kind === 'wordsprout') openWordSproutGame();
  else if (kind === 'glimmer') openGlimmerGridGame();
}

/* ---------------- EMBER BALANCE ---------------- */

const EMBER_DURATION = 25;
const EMBER_BAND_HALF = 11;

function openEmberBalanceGame() {
  const shell = gameOverlayShell('emberbalance');
  const { board } = shell;
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px">
      <div data-track style="position:relative;width:min(94%,400px);height:66px;border-radius:33px;background:rgba(255,255,255,.07);border:1px solid var(--line);overflow:hidden">
        <div data-band style="position:absolute;top:4px;bottom:4px;border-radius:26px;background:linear-gradient(180deg,rgba(255,216,77,.42),rgba(255,122,74,.34));border:1px solid rgba(255,216,77,.75);box-shadow:0 0 18px rgba(255,190,80,.35)"></div>
        <div data-ember style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;line-height:1;filter:drop-shadow(0 0 10px rgba(255,180,80,.95))">🔥</div>
      </div>
      <div class="row" style="gap:10px;width:100%;max-width:400px">
        <button class="btn" data-left style="flex:1;min-width:0">◀</button>
        <button class="btn" data-right style="flex:1;min-width:0">▶</button>
      </div>
      <div class="tiny muted" data-msg style="text-align:center;min-height:20px">Hold a side to steer. Steady time scores.</div>
      <div class="tiny muted" data-streak>Steady 0.0s</div>
    </div>${gameMiniSprite()}`;

  const track = board.querySelector('[data-track]');
  const bandEl = board.querySelector('[data-band]');
  const emberEl = board.querySelector('[data-ember]');
  const leftBtn = board.querySelector('[data-left]');
  const rightBtn = board.querySelector('[data-right]');
  const msg = board.querySelector('[data-msg]');
  const streakEl = board.querySelector('[data-streak]');

  let pos = 50;
  let vel = 0;
  let held = 0;
  let elapsed = 0;
  let steady = 0;
  let best = 0;
  let score = 0;
  let running = true;
  let last = performance.now();
  let loop = 0;

  function bandCenter() {
    return 50 + Math.sin(elapsed * 0.8) * 30 + Math.sin(elapsed * 0.33) * 7;
  }

  function paintBand() {
    const center = bandCenter();
    bandEl.style.left = `${center - EMBER_BAND_HALF}%`;
    bandEl.style.width = `${EMBER_BAND_HALF * 2}%`;
    emberEl.style.left = `${pos}%`;
  }

  function finish() {
    running = false;
    clearInterval(loop);
    showGameResult(shell, {
      kind: 'emberbalance',
      score: Math.round(score),
      coins: 12 + Math.round(score),
      xp: 8 + Math.round(score / 2),
      blurb: score >= 45 ? 'Perfectly balanced!' : score >= 25 ? 'Steady flame!' : score > 0 ? 'The ember wobbled but held.' : 'The ember rolled away.',
    });
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    if (running) {
      elapsed += dt;
      vel += held * 135 * dt;
      vel *= Math.pow(0.985, dt * 60);
      pos = Math.max(2, Math.min(98, pos + vel * dt));
      const inside = Math.abs(pos - bandCenter()) <= EMBER_BAND_HALF;
      if (inside) {
        score += dt * 2.4;
        steady += dt;
        best = Math.max(best, steady);
      } else {
        steady = 0;
      }
      paintBand();
      streakEl.textContent = `Steady ${steady.toFixed(1)}s · best ${best.toFixed(1)}s`;
      shell.scoreEl.textContent = String(Math.round(score));
      const left = Math.max(0, EMBER_DURATION - elapsed);
      shell.timerEl.textContent = `${Math.ceil(left)}s`;
      shell.timerBar.style.width = `${(left / EMBER_DURATION) * 100}%`;
      if (elapsed >= EMBER_DURATION) finish();
    }
  }

  function steer(dir) {
    held = dir;
    if (dir < 0) leftBtn.classList.add('btn-gold');
    else rightBtn.classList.add('btn-gold');
  }
  function release() {
    held = 0;
    leftBtn.classList.remove('btn-gold');
    rightBtn.classList.remove('btn-gold');
  }

  [leftBtn, rightBtn].forEach((btn) => {
    const dir = btn === leftBtn ? -1 : 1;
    btn.addEventListener('pointerdown', (event) => { event.preventDefault(); steer(dir); });
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
    btn.addEventListener('pointercancel', release);
  });

  /* Dragging on the lane is a direct steering shortcut for touch players. */
  track.addEventListener('pointerdown', (event) => {
    const rect = track.getBoundingClientRect();
    if (!rect.width) return;
    pos = Math.max(2, Math.min(98, ((event.clientX - rect.left) / rect.width) * 100));
    vel = 0;
    msg.textContent = 'Nudged!';
  });

  const onKey = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') steer(-1);
    else if (event.key === 'ArrowRight' || event.key === 'd') steer(1);
    else return;
    event.preventDefault();
  };
  const onKeyUp = (event) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key)) release();
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);

  shell.addCleanup(() => {
    running = false;
    clearInterval(loop);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('keyup', onKeyUp);
  });

  paintBand();
  loop = setInterval(frame, 50);
}

/* ---------------- WORD SPROUT ---------------- */

const WORD_SPROUT_WORDS = [
  'MOSS', 'FERN', 'DEW', 'HIVE', 'BLOOM', 'SPRIG', 'PETAL', 'EMBER', 'ACORN',
  'PEBBLE', 'RIPPLE', 'CLOVER', 'BREEZE', 'WILLOW', 'HOLLOW', 'LANTERN',
  'GLIMMER', 'SAPLING', 'MUSHROOM', 'THISTLE', 'MEADOW', 'DRIFT', 'SPARK',
];
const WORD_SPROUT_TIME = 45;

function wordSproutShuffle(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  /* A shuffle can land back on the answer; rotate one step instead of retrying. */
  return letters.join('') === word && letters.length > 1 ? letters.slice(1).concat(letters[0]) : letters;
}

function openWordSproutGame() {
  const shell = gameOverlayShell('wordsprout');
  const { board } = shell;
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px">
      <div class="tiny muted" data-round>Word 1 · find the hidden word</div>
      <div data-slots style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;min-height:44px"></div>
      <div data-letters style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap;max-width:min(94%,360px)"></div>
      <div class="row" style="gap:8px">
        <button class="btn btn-soft btn-sm" data-back>⌫ Back</button>
        <button class="btn btn-ghost btn-sm" data-clear>Clear</button>
      </div>
      <div class="tiny muted" data-msg style="text-align:center;min-height:20px">Tap letters in order. Wrong guesses reset the word.</div>
    </div>${gameMiniSprite()}`;

  const slotsEl = board.querySelector('[data-slots]');
  const lettersEl = board.querySelector('[data-letters]');
  const roundEl = board.querySelector('[data-round]');
  const msg = board.querySelector('[data-msg]');
  const backBtn = board.querySelector('[data-back]');
  const clearBtn = board.querySelector('[data-clear]');

  let target = '';
  let letters = [];
  let built = [];
  let round = 0;
  let score = 0;
  let streak = 0;
  let running = true;
  let locked = false;
  const endAt = Date.now() + WORD_SPROUT_TIME * 1000;
  const timers = [];

  function pickWord() {
    const pool = WORD_SPROUT_WORDS.filter((word) => word !== target);
    return pool[Math.floor(Math.random() * pool.length)] || 'MOSS';
  }

  function paint() {
    roundEl.textContent = `Word ${round} · ${target.length} letters · streak ${streak}`;
    slotsEl.innerHTML = target
      .split('')
      .map((_, i) => `<span style="display:grid;place-items:center;width:34px;height:40px;border-radius:9px;border:1px solid var(--line);background:${built[i] ? 'rgba(126,231,135,.16)' : 'rgba(255,255,255,.06)'};font-weight:800;letter-spacing:.04em">${built[i] != null ? letters[built[i]].ch : ''}</span>`)
      .join('');
    lettersEl.innerHTML = letters
      .map((entry, i) => `<button class="btn ${entry.used ? 'btn-ghost' : ''}" data-letter="${i}" ${entry.used || locked ? 'disabled' : ''} style="min-width:42px;padding:11px 0;font-weight:800;letter-spacing:.03em">${entry.ch}</button>`)
      .join('');
    backBtn.disabled = locked || !built.length;
    clearBtn.disabled = locked || !built.length;
  }

  function resetWord() {
    round += 1;
    target = pickWord();
    letters = wordSproutShuffle(target).map((ch) => ({ ch, used: false }));
    built = [];
    locked = false;
    paint();
  }

  function nextWord(delay = 650) {
    timers.push(setTimeout(() => {
      if (!running || shell.isClosed()) return;
      msg.textContent = 'Tap letters in order. Wrong guesses reset the word.';
      resetWord();
    }, delay));
  }

  function judge() {
    const guess = built.map((i) => letters[i].ch).join('');
    if (guess === target) {
      const points = target.length * 12 + streak * 15;
      score += points;
      streak += 1;
      shell.scoreEl.textContent = String(score);
      msg.textContent = `${target}! +${points}${streak > 1 ? ` · streak ×${streak}` : ''}`;
      Sfx.coin();
      burstOn(slotsEl, ['🌱', '✨'], 7);
      locked = true;
      paint();
      nextWord(700);
      return;
    }
    streak = 0;
    locked = true;
    msg.textContent = `Not quite — ${target} was hiding.`;
    Sfx.error();
    paint();
    timers.push(setTimeout(() => {
      if (!running || shell.isClosed()) return;
      msg.textContent = 'Try the next word.';
      resetWord();
    }, 900));
  }

  lettersEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-letter]');
    if (!btn || locked || !running) return;
    const index = Number(btn.dataset.letter);
    const entry = letters[index];
    if (!entry || entry.used) return;
    entry.used = true;
    built.push(index);
    Sfx.tick();
    paint();
    if (built.length === target.length) judge();
  });

  backBtn.addEventListener('click', () => {
    if (locked) return;
    const index = built.pop();
    if (index != null && letters[index]) letters[index].used = false;
    Sfx.click();
    paint();
  });

  clearBtn.addEventListener('click', () => {
    if (locked) return;
    built.forEach((index) => { if (letters[index]) letters[index].used = false; });
    built = [];
    Sfx.click();
    paint();
  });

  const clock = setInterval(() => {
    const left = Math.max(0, (endAt - Date.now()) / 1000);
    shell.timerEl.textContent = `${Math.ceil(left)}s`;
    shell.timerBar.style.width = `${(left / WORD_SPROUT_TIME) * 100}%`;
    if (left <= 0) {
      running = false;
      clearInterval(clock);
      showGameResult(shell, {
        kind: 'wordsprout',
        score,
        coins: 10 + score,
        xp: 8 + Math.round(score / 4),
        blurb: score >= 220 ? 'Word garden in full bloom!' : score >= 100 ? 'The words grew fast.' : score > 0 ? 'A few sprouts.' : 'The letters stayed buried.',
      });
    }
  }, 150);

  shell.addCleanup(() => {
    running = false;
    clearInterval(clock);
    timers.forEach(clearTimeout);
  });

  resetWord();
}

/* ---------------- GLIMMER GRID ---------------- */

const GLIMMER_SIZE = 4;
const GLIMMER_CELLS = GLIMMER_SIZE * GLIMMER_SIZE;
const GLIMMER_TIME = 30;
const GLIMMER_LIFE = 1250;

function openGlimmerGridGame() {
  const shell = gameOverlayShell('glimmer');
  const { board } = shell;
  const tiles = Array.from({ length: GLIMMER_CELLS }, (_, i) =>
    `<button data-cell="${i}" style="aspect-ratio:1;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.06);font-size:clamp(18px,5vw,26px);line-height:1;display:grid;place-items:center;cursor:pointer;transition:background .15s ease,transform .15s ease"></button>`
  ).join('');
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px">
      <div class="between" style="width:min(94%,340px);gap:8px">
        <span class="tiny muted" data-lives>❤️❤️❤️</span>
        <span class="tiny muted" data-combo>Combo ×1</span>
      </div>
      <div data-grid style="display:grid;grid-template-columns:repeat(${GLIMMER_SIZE},1fr);gap:7px;width:min(94%,340px)">${tiles}</div>
      <div class="tiny muted" data-msg style="text-align:center;min-height:20px">Tap ✨ glimmers. Thorns 🌵 cost a heart.</div>
    </div>${gameMiniSprite()}`;

  const grid = board.querySelector('[data-grid]');
  const livesEl = board.querySelector('[data-lives]');
  const comboEl = board.querySelector('[data-combo]');
  const msg = board.querySelector('[data-msg]');
  const tilesEls = Array.from(grid.querySelectorAll('[data-cell]'));

  const cells = Array(GLIMMER_CELLS).fill(null);
  let score = 0;
  let combo = 0;
  let lives = 3;
  let elapsed = 0;
  let running = true;
  let lastSpawn = 0;
  let spawnEvery = 620;
  let last = performance.now();
  let loop = 0;

  function paintCell(i) {
    const tile = tilesEls[i];
    const cell = cells[i];
    if (!tile) return;
    if (!cell) {
      tile.textContent = '';
      tile.style.background = 'rgba(255,255,255,.06)';
      tile.style.borderColor = 'var(--line)';
      tile.style.transform = 'scale(1)';
      return;
    }
    tile.textContent = cell.kind === 'thorn' ? '🌵' : '✨';
    tile.style.background = cell.kind === 'thorn' ? 'rgba(255,94,138,.26)' : 'rgba(192,132,252,.3)';
    tile.style.borderColor = cell.kind === 'thorn' ? 'rgba(255,120,150,.8)' : 'rgba(192,132,252,.85)';
    tile.style.transform = 'scale(1.04)';
  }

  function end() {
    if (!running) return;
    running = false;
    clearInterval(loop);
    showGameResult(shell, {
      kind: 'glimmer',
      score,
      coins: 10 + score,
      xp: 8 + Math.round(score / 2),
      blurb: score >= 90 ? 'Glimmer storm!' : score >= 45 ? 'Quick hands!' : score > 0 ? 'A few bright taps.' : 'The glimmers slipped by.',
    });
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.2, Math.max(0, (now - last) / 1000));
    last = now;
    if (running) {
      elapsed += dt;
      cells.forEach((cell, i) => {
        if (!cell) return;
        if (now - cell.at > GLIMMER_LIFE) {
          if (cell.kind === 'glimmer' && combo > 0) {
            combo = 0;
            comboEl.textContent = 'Combo ×1';
          }
          cells[i] = null;
          paintCell(i);
        }
      });
      if (now - lastSpawn > spawnEvery) {
        lastSpawn = now;
        const free = [];
        cells.forEach((cell, i) => { if (!cell) free.push(i); });
        if (free.length) {
          const index = free[Math.floor(Math.random() * free.length)];
          cells[index] = { kind: Math.random() < 0.2 ? 'thorn' : 'glimmer', at: now };
          paintCell(index);
        }
        spawnEvery = Math.max(320, 640 - elapsed * 7);
      }
      shell.scoreEl.textContent = String(score);
      const left = Math.max(0, GLIMMER_TIME - elapsed);
      shell.timerEl.textContent = `${Math.ceil(left)}s`;
      shell.timerBar.style.width = `${(left / GLIMMER_TIME) * 100}%`;
      if (left <= 0) end();
    }
  }

  grid.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-cell]');
    if (!tile || !running) return;
    const index = Number(tile.dataset.cell);
    const cell = cells[index];
    if (!cell) return;
    cells[index] = null;
    paintCell(index);
    if (cell.kind === 'thorn') {
      lives -= 1;
      combo = 0;
      livesEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💔';
      comboEl.textContent = 'Combo ×1';
      msg.textContent = 'A thorn. That cost a heart.';
      Sfx.error();
      burstOn(tile, ['🌵', '💔'], 4);
      if (lives <= 0) end();
      return;
    }
    combo += 1;
    const points = 6 + Math.min(14, combo * 2);
    score += points;
    comboEl.textContent = `Combo ×${combo}`;
    msg.textContent = `+${points} · nice and bright`;
    Sfx.coin();
    burstOn(tile, ['✨', '💜'], 3);
  });

  shell.addCleanup(() => {
    running = false;
    clearInterval(loop);
  });

  loop = setInterval(frame, 80);
}
