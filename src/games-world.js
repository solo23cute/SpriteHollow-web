/* World-tour mini games: a reflex lane and a portal memory board. Both use the
   shared game shell so they inherit payouts, quest credit and result cards. */

Object.assign(GAME_INFO, {
  starlane: {
    icon: '🌠',
    title: 'Star Lane',
    tag: 'Reflex',
    desc: 'Catch the falling starlight. Tap a lane while it glows.',
    g1: '#8fb8ff',
    g2: '#b18cff',
  },
  portalmatch: {
    icon: '🪐',
    title: 'Portal Pairs',
    tag: 'Memory',
    desc: 'Open the world portals and remember where every pair hides.',
    g1: '#67d98b',
    g2: '#8fe3ff',
  },
});

function openStarLaneGame() {
  const shell = gameOverlayShell('starlane');
  const { board } = shell;
  board.innerHTML = `<div class="starlane">
      <div class="starlane-sky" data-starlane-sky>
        ${[0, 1, 2].map((lane) => `<button class="starlane-lane" type="button" data-lane="${lane}" aria-label="Star lane ${lane + 1}"><span>✦</span></button>`).join('')}
      </div>
      <div class="starlane-hud"><span data-starlane-streak>Streak 0</span><span data-starlane-best>Best 0</span></div>
      <p class="tiny muted">Tap the lane when a star lands. A miss costs a point and resets the streak.</p>
    </div>${gameMiniSprite()}`;
  const lanes = [...board.querySelectorAll('[data-lane]')];
  const streakEl = board.querySelector('[data-starlane-streak]');
  const bestEl = board.querySelector('[data-starlane-best]');
  const DURATION = 24;
  let score = 0;
  let streak = 0;
  let best = 0;
  let remaining = DURATION;
  let running = true;
  let active = null;
  let activeTimer = null;
  let spawnTimer = null;
  let clock = null;

  function paintHud() {
    shell.scoreEl.textContent = score;
    streakEl.textContent = `Streak ${streak}`;
    bestEl.textContent = `Best ${best}`;
  }

  function retireLane() {
    if (activeTimer) clearTimeout(activeTimer);
    activeTimer = null;
    if (active) active.classList.remove('is-lit');
    active = null;
  }

  function spawn() {
    if (!running || active) return;
    const lane = lanes[randInt(0, lanes.length - 1)];
    active = lane;
    lane.classList.add('is-lit');
    lane.classList.remove('is-miss');
    const lifetime = Math.max(430, 880 - score * 14);
    activeTimer = setTimeout(() => {
      if (!running || active !== lane) return;
      lane.classList.remove('is-lit');
      active = null;
      streak = 0;
      paintHud();
    }, lifetime);
  }

  lanes.forEach((lane) => {
    lane.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!running) return;
      if (lane === active) {
        retireLane();
        score += 1;
        streak += 1;
        best = Math.max(best, streak);
        lane.classList.add('is-hit');
        setTimeout(() => lane.classList.remove('is-hit'), 220);
        shell.scoreEl.classList.add('is-bump');
        setTimeout(() => shell.scoreEl.classList.remove('is-bump'), 220);
        Sfx.pop();
        burstOn(lane, ['✨', '⭐', '💫'], 5);
        paintHud();
        setTimeout(spawn, 110);
      } else {
        lane.classList.add('is-miss');
        setTimeout(() => lane.classList.remove('is-miss'), 220);
        score = Math.max(0, score - 1);
        streak = 0;
        Sfx.error();
        tapHaptic(14);
        paintHud();
      }
    });
  });

  shell.timerEl.textContent = `${DURATION}s`;
  shell.timerBar.style.width = '100%';
  paintHud();
  spawnTimer = setInterval(spawn, 520);
  clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    if (remaining <= 0) finish();
  }, 100);

  function finish() {
    if (!running) return;
    running = false;
    clearInterval(spawnTimer);
    clearInterval(clock);
    retireLane();
    lanes.forEach((lane) => { lane.disabled = true; });
    const coins = Math.min(110, 12 + score * 5);
    const xp = 10 + score * 3;
    showGameResult(shell, {
      kind: 'starlane', score, coins, xp,
      blurb: score >= 24 ? 'A perfect constellation!' : score >= 16 ? 'The sky knows your name.' : score >= 8 ? 'Bright footwork!' : 'The stars got away this time.',
    });
  }

  shell.addCleanup(() => {
    running = false;
    clearInterval(spawnTimer);
    clearInterval(clock);
    retireLane();
  });
}

function openPortalPairGame() {
  const shell = gameOverlayShell('portalmatch');
  const { board } = shell;
  const faces = ['🪐', '🌙', '☄️', '🌍', '✨', '🛰️'];
  const deck = shuffle([...faces, ...faces]);
  board.innerHTML = `<div class="portal-pairs">
      <div class="portal-pair-grid">
        ${deck.map((face, index) => `<button class="portal-pair-card" type="button" data-portal-card="${index}" data-face="${face}" aria-label="World portal card ${index + 1}"><span>✦</span></button>`).join('')}
      </div>
      <p class="tiny muted">Six worlds, twelve portals. Match every pair before the gate closes.</p>
    </div>${gameMiniSprite()}`;
  const cards = [...board.querySelectorAll('[data-portal-card]')];
  const DURATION = 42;
  const timers = new Set();
  let first = null;
  let locked = false;
  let pairs = 0;
  let remaining = DURATION;
  let running = true;

  function later(fn, ms) {
    const id = setTimeout(() => { if (running) fn(); }, ms);
    timers.add(id);
    return id;
  }

  function hide(card) {
    card.classList.remove('is-flipped');
    card.innerHTML = '<span>✦</span>';
  }

  cards.forEach((card) => {
    card.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!running || locked || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;
      card.classList.add('is-flipped');
      card.textContent = card.dataset.face;
      Sfx.tone(540, 0.1, 'sine', 0.035, 0, 30);
      if (!first) {
        first = card;
        return;
      }
      if (first.dataset.face === card.dataset.face) {
        first.classList.add('is-matched');
        card.classList.add('is-matched');
        first = null;
        pairs += 1;
        shell.scoreEl.textContent = pairs;
        shell.scoreEl.classList.add('is-bump');
        setTimeout(() => shell.scoreEl.classList.remove('is-bump'), 220);
        Sfx.pop();
        burstOn(card, ['✨', '🪐', '💫'], 5);
        if (pairs === faces.length) finish(true);
      } else {
        locked = true;
        const a = first;
        const b = card;
        first = null;
        later(() => {
          hide(a);
          hide(b);
          locked = false;
        }, 680);
      }
    });
  });

  const clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    if (remaining <= 0) finish(false);
  }, 100);
  timers.add(clock);

  function finish(won) {
    if (!running) return;
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
    cards.forEach((card) => { card.disabled = true; });
    const coins = 10 + pairs * 8;
    const xp = 8 + pairs * 4;
    showGameResult(shell, {
      kind: 'portalmatch', score: pairs, coins, xp,
      blurb: won ? 'Every world found its pair!' : pairs >= 4 ? 'A steady portal memory.' : pairs >= 2 ? 'A few worlds remembered.' : 'The portals shuffled away.',
    });
  }

  shell.addCleanup(() => {
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
  });
}

/* The event vigil: the playable half of a Hollow event preset. The live event's
   own motes surface in a nine-light grid; enough of them keeps the badge for
   the day. The shell is themed from the preset rather than GAME_INFO, so the
   Play screen never lists a vigil for an event that is not up. */
function openEventVigilGame(presetKey) {
  const liveKey = (state.world && state.world.eventPreset) || null;
  const key = presetKey || liveKey;
  const preset = key && typeof EVENT_PRESETS !== 'undefined' ? EVENT_PRESETS[key] : null;
  /* The vigil belongs to the sky that is up, so a stale button or an old link
     cannot play a vigil for an event the Hollow is not hosting. */
  if (!preset || liveKey !== preset.key) {
    if (typeof toast === 'function') toast('No event is up — light one in the Hollow sky sheet first.', '✨');
    return null;
  }
  const vig = typeof EVENT_VIGIL !== 'undefined' ? EVENT_VIGIL : { duration: 30, target: 18 };
  const DURATION = Math.max(10, Number(vig.duration) || 30);
  const TARGET = Math.max(1, Number(vig.target) || 18);
  const kind = `vigil-${preset.key}`;
  const shell = gameOverlayShell(kind, {
    icon: preset.icon,
    title: preset.name,
    tag: 'Event vigil',
    desc: `Tap each ${preset.mote} while it glows.`,
    g1: preset.tint,
    g2: preset.tint2,
  });
  const { board } = shell;
  board.innerHTML = `<div class="event-vigil" style="--vigil:${preset.tint};--vigil-2:${preset.tint2}">
      <div class="event-vigil-grid" data-vigil-grid>
        ${Array.from({ length: 9 }, (_, index) => `<button class="vigil-mote" type="button" data-vigil-mote="${index}" aria-label="Vigil light ${index + 1}"><span aria-hidden="true">${preset.mote}</span></button>`).join('')}
      </div>
      <div class="starlane-hud"><span data-vigil-caught>Caught 0 / ${TARGET}</span><span data-vigil-streak>Streak 0</span></div>
      <p class="tiny muted">${esc(preset.vigilBlurb || '')}</p>
    </div>${gameMiniSprite()}`;
  const motes = [...board.querySelectorAll('[data-vigil-mote]')];
  const caughtEl = board.querySelector('[data-vigil-caught]');
  const streakEl = board.querySelector('[data-vigil-streak]');
  let score = 0;
  let streak = 0;
  let remaining = DURATION;
  let running = true;
  let lit = null;
  let litTimer = null;

  function paintHud() {
    shell.scoreEl.textContent = score;
    caughtEl.textContent = `Caught ${score} / ${TARGET}`;
    streakEl.textContent = `Streak ${streak}`;
  }

  function unlight() {
    if (litTimer) clearTimeout(litTimer);
    litTimer = null;
    if (lit) lit.classList.remove('is-lit');
    lit = null;
  }

  function surface() {
    if (!running || lit) return;
    lit = motes[randInt(0, motes.length - 1)];
    lit.classList.add('is-lit');
    lit.classList.remove('is-miss');
    const life = Math.max(520, 960 - score * 16);
    litTimer = setTimeout(() => {
      if (!running || !lit) return;
      lit.classList.remove('is-lit');
      lit = null;
      streak = 0;
      paintHud();
    }, life);
  }

  motes.forEach((mote) => {
    mote.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!running) return;
      if (mote === lit) {
        unlight();
        score += 1;
        streak += 1;
        mote.classList.add('is-hit');
        setTimeout(() => mote.classList.remove('is-hit'), 220);
        shell.scoreEl.classList.add('is-bump');
        setTimeout(() => shell.scoreEl.classList.remove('is-bump'), 220);
        Sfx.pop();
        burstOn(mote, [preset.mote, '✨'], 4);
        tapHaptic(8);
        paintHud();
        setTimeout(surface, 120);
      } else {
        mote.classList.add('is-miss');
        setTimeout(() => mote.classList.remove('is-miss'), 220);
        score = Math.max(0, score - 1);
        streak = 0;
        Sfx.error();
        paintHud();
      }
    });
  });

  shell.timerEl.textContent = `${DURATION}s`;
  shell.timerBar.style.width = '100%';
  paintHud();
  const spawn = setInterval(surface, 560);
  const clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    if (remaining <= 0) finish();
  }, 100);

  function finish() {
    if (!running) return;
    running = false;
    clearInterval(spawn);
    clearInterval(clock);
    unlight();
    motes.forEach((mote) => { mote.disabled = true; });
    /* The badge is filed by the run, not by opening the game, so quitting early
       cannot keep a vigil. It pays nothing: the run's own coins stand alone. */
    const kept = typeof Actions !== 'undefined' && typeof Actions.recordVigil === 'function'
      ? Actions.recordVigil(preset.key, score)
      : { ok: false, reason: 'missing' };
    const coins = Math.min(150, 14 + score * 6);
    const xp = 12 + score * 4;
    const blurb = kept.ok
      ? (kept.already
        ? `${preset.badge} vigil kept again — today's badge was already filed.`
        : `${preset.badge} vigil kept. The badge is on the shelf.`)
      : score >= TARGET
        ? `${preset.badge} vigil reached, but the event had already ended.`
        : `The vigil needs ${TARGET} motes to be kept — you caught ${score}.`;
    showGameResult(shell, { kind, score, coins, xp, blurb });
  }

  shell.addCleanup(() => {
    running = false;
    clearInterval(spawn);
    clearInterval(clock);
    unlight();
  });
  return { kind, preset: preset.key, target: TARGET };
}
