/* Wave three: an egg arcade, a zombie shooter, a pet spa, and the weekly pass.
   Games follow the same shell/payout contract as the rest of the arcade:
   build into shell.board, then hand the score to showGameResult(). */

Object.assign(GAME_INFO, {
  eggarcade: {
    title: 'Egg Arcade',
    icon: '🥚',
    tag: 'Physics',
    group: 'arcade',
    desc: 'Drop eggs into the moving nest. Golden eggs bounce, rocks crack the streak.',
    g1: '#ffd166',
    g2: '#ff9ec7',
  },
  barrage: {
    title: 'Zombie Barrage',
    icon: '🧟',
    tag: 'Shooter',
    group: 'arcade',
    desc: 'Tap the horde to fire. Three lanes, growing waves, one long freeze.',
    g1: '#7ee787',
    g2: '#4f6b3a',
  },
  spa: {
    title: 'Pet Spa Day',
    icon: '🛁',
    tag: 'Pet care',
    group: 'pets',
    desc: 'Keep Food, Rest, Joy and Clean topped up by tapping the right station.',
    g1: '#8be9ff',
    g2: '#ff9ec7',
  },
});

/* ---------------- EGG ARCADE ---------------- */
function openEggArcadeGame() {
  const shell = gameOverlayShell('eggarcade');
  const { board } = shell;
  board.innerHTML = `<div class="eggdrop" data-eggdrop>
      <div class="eggdrop-sky" data-sky></div>
      <div class="eggdrop-nest" data-nest><span>🪺</span></div>
      <div class="eggdrop-hud">
        <span class="chip" data-caught>0 eggs</span>
        <span class="chip" data-combo>×1</span>
      </div>
    </div>${gameMiniSprite()}`;
  const stage = board.querySelector('[data-eggdrop]');
  const sky = board.querySelector('[data-sky]');
  const nest = board.querySelector('[data-nest]');
  const caughtEl = board.querySelector('[data-caught]');
  const comboEl = board.querySelector('[data-combo]');
  const KINDS = [
    { key: 'egg', label: '🥚', points: 1, weight: 62 },
    { key: 'gold', label: '🌟', points: 3, weight: 22 },
    { key: 'rock', label: '🪨', points: -2, weight: 16 },
  ];
  const DURATION = 25000;
  const GRAVITY = 0.00035;
  let items = [];
  let nestX = 50;
  let targetX = 50;
  let score = 0;
  let combo = 0;
  let best = 0;
  let caught = 0;
  let running = true;
  let raf = 0;
  let last = 0;
  let spawnAt = 0;
  let remaining = DURATION;

  const pickKind = () => {
    const total = KINDS.reduce((sum, k) => sum + k.weight, 0);
    let roll = rand(0, total);
    for (const kind of KINDS) {
      roll -= kind.weight;
      if (roll <= 0) return kind;
    }
    return KINDS[0];
  };

  function paintNest() {
    nest.style.left = `${nestX}%`;
  }

  function pop(text, x, y, tone) {
    const float = document.createElement('div');
    float.className = `float-score eggdrop-float ${tone || ''}`;
    float.style.left = `${x}%`;
    float.style.top = `${y}%`;
    float.textContent = text;
    stage.appendChild(float);
    setTimeout(() => float.remove(), 760);
  }

  function spawn() {
    const kind = pickKind();
    const el = document.createElement('span');
    el.className = `eggdrop-item ${kind.key}`;
    el.textContent = kind.label;
    sky.appendChild(el);
    items.push({
      kind,
      el,
      x: rand(10, 90),
      y: -6,
      vy: rand(0.02, 0.04),
      drift: rand(-0.004, 0.004),
      bob: rand(0, Math.PI * 2),
    });
  }

  function resolve(item) {
    const near = Math.abs(item.x - nestX) < 11;
    const landed = item.y >= 84;
    if (!landed) return false;
    if (near) {
      caught += 1;
      combo += 1;
      best = Math.max(best, combo);
      const bonus = item.kind.points > 0 ? Math.min(4, 1 + Math.floor(combo / 3)) : 1;
      const gain = item.kind.points * bonus;
      score = Math.max(0, score + gain);
      Sfx.coin();
      pop(`${gain >= 0 ? '+' : ''}${gain}`, item.x, 80, item.kind.key === 'rock' ? 'bad' : 'good');
      el_flash(item.el, 'caught');
    } else if (item.kind.points > 0) {
      combo = 0;
      pop('miss', item.x, 86, 'bad');
    }
    caughtEl.textContent = `${caught} egg${caught === 1 ? '' : 's'}`;
    comboEl.textContent = `×${Math.min(4, 1 + Math.floor(combo / 3))}`;
    comboEl.classList.toggle('hot', combo >= 6);
    shell.scoreEl.textContent = score;
    setTimeout(() => item.el.remove(), 240);
    return true;
  }

  function el_flash(el, cls) {
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.remove(), 300);
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(48, now - last || 16);
    last = now;
    remaining = Math.max(0, remaining - dt);
    shell.timerEl.textContent = `${Math.ceil(remaining / 1000)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    nestX += (targetX - nestX) * Math.min(1, dt / 90);
    paintNest();
    spawnAt += dt;
    if (spawnAt > 620) {
      spawnAt = 0;
      spawn();
    }
    const alive = [];
    for (const item of items) {
      item.vy += GRAVITY * dt;
      item.y += item.vy * dt * 0.045;
      item.x = clamp(item.x + item.drift * dt, 6, 94);
      item.bob += dt / 260;
      item.el.style.left = `${item.x}%`;
      item.el.style.top = `${item.y}%`;
      item.el.style.transform = `rotate(${Math.sin(item.bob) * 14}deg)`;
      if (!resolve(item)) alive.push(item);
    }
    items = alive;
    if (remaining <= 0) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    items.forEach((item) => item.el.remove());
    items = [];
    const coins = Math.min(160, 12 + score * 4);
    const xp = 10 + score * 2;
    showGameResult(shell, {
      kind: 'eggarcade',
      score,
      coins,
      xp,
      blurb: `${caught} eggs landed in the nest${best > 1 ? `, best streak ×${best}` : ''}.`,
    });
  }

  function point(clientX) {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    targetX = clamp(((clientX - rect.left) / rect.width) * 100, 8, 92);
  }

  stage.addEventListener('pointerdown', (event) => { point(event.clientX); });
  stage.addEventListener('pointermove', (event) => { if (event.buttons) point(event.clientX); });
  const onKey = (event) => {
    if (event.key === 'ArrowLeft') targetX = clamp(targetX - 9, 8, 92);
    else if (event.key === 'ArrowRight') targetX = clamp(targetX + 9, 8, 92);
    else return;
    event.preventDefault();
  };
  window.addEventListener('keydown', onKey);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
  });

  shell.timerEl.textContent = `${Math.ceil(DURATION / 1000)}s`;
  shell.timerBar.style.width = '100%';
  paintNest();
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

/* ---------------- ZOMBIE BARRAGE ---------------- */
function openBarrageGame() {
  const shell = gameOverlayShell('barrage');
  const { board } = shell;
  board.innerHTML = `<div class="barrage" data-barrage>
      <div class="barrage-hud">
        <span class="barrage-hearts" data-hearts>❤️❤️❤️</span>
        <span class="chip" data-wave>Wave 1</span>
        <span class="chip" data-kills>0</span>
      </div>
      <div class="barrage-lanes">
        <div class="barrage-lane" data-lane="0"></div>
        <div class="barrage-lane" data-lane="1"></div>
        <div class="barrage-lane" data-lane="2"></div>
        <span class="barrage-gunner" data-gunner>${spriteSVG(activeSprite(), { expr: expressionFor(activeSprite()) })}</span>
      </div>
      <div class="barrage-actions">
        <button class="btn btn-soft btn-sm" data-freeze>❄️ Freeze <b data-freeze-left>1</b></button>
        <span class="tiny muted">Tap a zombie to shoot. Keys 1-3 fire a lane.</span>
      </div>
    </div>${gameMiniSprite()}`;
  const lanes = Array.from(board.querySelectorAll('[data-lane]'));
  const heartsEl = board.querySelector('[data-hearts]');
  const waveEl = board.querySelector('[data-wave]');
  const killsEl = board.querySelector('[data-kills]');
  const freezeBtn = board.querySelector('[data-freeze]');
  const freezeLeftEl = board.querySelector('[data-freeze-left]');
  const DURATION = 30000;
  let hearts = 3;
  let kills = 0;
  let marks = 0;
  let wave = 1;
  let frozenUntil = 0;
  let freezes = 1;
  let running = true;
  let raf = 0;
  let last = 0;
  let spawnAt = 0;
  let remaining = DURATION;
  let units = [];

  function paintMeta() {
    heartsEl.textContent = '❤️'.repeat(Math.max(0, hearts)) + '🖤'.repeat(Math.max(0, 3 - hearts));
    waveEl.textContent = `Wave ${wave}`;
    killsEl.textContent = `${kills} down`;
    freezeLeftEl.textContent = String(freezes);
    freezeBtn.disabled = freezes <= 0;
    shell.scoreEl.textContent = marks;
  }

  function shoot(laneIndex, unit) {
    const lane = lanes[laneIndex];
    if (!lane) return;
    const shot = document.createElement('span');
    shot.className = 'barrage-shot';
    shot.textContent = '✦';
    shot.style.left = `${unit ? unit.x : 50}%`;
    shot.style.bottom = '6%';
    lane.appendChild(shot);
    setTimeout(() => shot.remove(), 260);
    if (!unit) {
      /* A lane tap still fires, so it can clear a zombie in that lane. */
      const target = units.filter((u) => u.lane === laneIndex && !u.dead).sort((a, b) => b.y - a.y)[0];
      if (target) hit(target);
      return;
    }
  }

  function hit(unit) {
    if (unit.dead) return;
    unit.hp -= 1;
    unit.el.classList.add('hit');
    setTimeout(() => unit.el.classList.remove('hit'), 180);
    if (unit.hp > 0) return;
    unit.dead = true;
    kills += 1;
    marks += unit.boss ? 9 : 3;
    Sfx.coin();
    tapHaptic(12);
    const splat = document.createElement('span');
    splat.className = 'barrage-blast';
    splat.textContent = unit.boss ? '💥' : '💫';
    splat.style.left = `${unit.x}%`;
    splat.style.top = `${unit.y}%`;
    lanes[unit.lane].appendChild(splat);
    setTimeout(() => splat.remove(), 420);
    unit.el.remove();
    if (kills > 0 && kills % 6 === 0) {
      wave += 1;
      toast(`Wave ${wave} — they are faster now.`, '🧟');
    }
    paintMeta();
  }

  function spawn() {
    const lane = Math.floor(rand(0, 3));
    const el = document.createElement('button');
    const boss = wave >= 3 && chance(0.18);
    el.className = `barrage-z${boss ? ' boss' : ''}`;
    el.type = 'button';
    el.textContent = boss ? '🧟‍♂️' : '🧟';
    el.setAttribute('aria-label', 'Zombie');
    lanes[lane].appendChild(el);
    const unit = {
      lane,
      el,
      x: rand(28, 72),
      y: -8,
      speed: (boss ? 0.0048 : 0.0075) + wave * 0.0009,
      hp: boss ? 3 : 1,
      boss,
      dead: false,
    };
    el.style.left = `${unit.x}%`;
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      shoot(lane, unit);
      hit(unit);
    });
    units.push(unit);
  }

  lanes.forEach((lane, index) => {
    lane.addEventListener('click', () => shoot(index, null));
  });

  function freeze() {
    if (!running || freezes <= 0) return;
    freezes -= 1;
    frozenUntil = performance.now() + 4000;
    lanes.forEach((lane) => lane.classList.add('frozen'));
    setTimeout(() => lanes.forEach((lane) => lane.classList.remove('frozen')), 4000);
    Sfx.click();
    paintMeta();
  }
  freezeBtn.addEventListener('click', freeze);

  const onKey = (event) => {
    if (event.key === '1' || event.key === '2' || event.key === '3') {
      const index = Number(event.key) - 1;
      shoot(index, null);
      event.preventDefault();
    } else if (event.key === ' ') {
      freeze();
      event.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey);

  function frame(now) {
    if (!running) return;
    const dt = Math.min(48, now - last || 16);
    last = now;
    remaining = Math.max(0, remaining - dt);
    shell.timerEl.textContent = `${Math.ceil(remaining / 1000)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    const frozen = now < frozenUntil;
    spawnAt += dt;
    if (spawnAt > Math.max(680, 1500 - wave * 90)) {
      spawnAt = 0;
      spawn();
    }
    const alive = [];
    for (const unit of units) {
      if (unit.dead) continue;
      if (!frozen) unit.y += unit.speed * dt;
      unit.el.style.top = `${unit.y}%`;
      if (unit.y >= 88) {
        unit.dead = true;
        unit.el.remove();
        hearts -= 1;
        Sfx.error();
        tapHaptic(30);
        lanes[unit.lane].classList.add('breached');
        setTimeout(() => lanes[unit.lane].classList.remove('breached'), 320);
        paintMeta();
        if (hearts <= 0) {
          finish('The horde broke through. The lantern went out.');
          return;
        }
        continue;
      }
      alive.push(unit);
    }
    units = alive;
    if (remaining <= 0) {
      finish(`${kills} zombies down across ${wave} wave${wave === 1 ? '' : 's'}.`);
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function finish(blurb) {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    units.forEach((unit) => unit.el.remove());
    units = [];
    const coins = Math.min(220, 20 + marks * 6);
    showGameResult(shell, {
      kind: 'barrage',
      score: marks,
      coins,
      xp: 12 + marks * 2,
      blurb,
    });
  }

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
  });

  shell.timerEl.textContent = `${Math.ceil(DURATION / 1000)}s`;
  shell.timerBar.style.width = '100%';
  paintMeta();
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

/* ---------------- PET SPA DAY ---------------- */
function openSpaGame() {
  const shell = gameOverlayShell('spa');
  const { board } = shell;
  const sprite = activeSprite();
  const NEEDS = [
    { key: 'hunger', label: 'Food', icon: '🍱', station: 'Feed', stationIcon: '🍲', color: '#ffb86b' },
    { key: 'energy', label: 'Rest', icon: '💤', station: 'Nap', stationIcon: '🛏️', color: '#8b7bff' },
    { key: 'joy', label: 'Joy', icon: '🎾', station: 'Play', stationIcon: '🎾', color: '#ff9ec7' },
    { key: 'clean', label: 'Clean', icon: '🫧', station: 'Bathe', stationIcon: '🛁', color: '#8be9ff' },
  ];
  board.innerHTML = `<div class="spa" data-spa>
      <div class="spa-pet" data-spa-pet>${sprite ? spriteSVG(sprite, { expr: expressionFor(sprite) }) : '🥚'}</div>
      <div class="spa-ask" data-ask>Tap the station your sprite needs.</div>
      <div class="spa-bars">
        ${NEEDS.map((need) => `<div class="spa-bar" data-bar="${need.key}">
          <b>${need.icon} ${need.label}</b>
          <span><i style="width:70%;background:${need.color}" data-fill="${need.key}"></i></span>
        </div>`).join('')}
      </div>
      <div class="spa-stations">
        ${NEEDS.map((need) => `<button class="spa-station" type="button" data-station="${need.station}">
          <b>${need.stationIcon}</b><span>${need.station}</span>
        </button>`).join('')}
      </div>
    </div>${gameMiniSprite()}`;
  const askEl = board.querySelector('[data-ask]');
  const DURATION = 30000;
  const values = {};
  const fills = {};
  NEEDS.forEach((need) => {
    values[need.key] = rand(34, 62);
    fills[need.key] = board.querySelector(`[data-fill="${need.key}"]`);
  });
  let score = 0;
  let streak = 0;
  let running = true;
  let raf = 0;
  let last = 0;
  let remaining = DURATION;
  let wanted = null;

  function paintBars() {
    NEEDS.forEach((need) => {
      const bar = fills[need.key];
      if (bar) bar.style.width = `${clamp(values[need.key], 0, 100)}%`;
    });
  }

  function nextWant() {
    const low = NEEDS.slice().sort((a, b) => values[a.key] - values[b.key]);
    wanted = low[chance(0.72) ? 0 : Math.floor(rand(0, NEEDS.length))];
    askEl.innerHTML = `${wanted.icon} <b>${wanted.label}</b> — tap <b>${wanted.station}</b>`;
    askEl.classList.remove('pulse');
    void askEl.offsetWidth;
    askEl.classList.add('pulse');
  }

  function float(text, x, tone) {
    const el = document.createElement('div');
    el.className = `float-score spa-float ${tone || ''}`;
    el.style.left = `${x}%`;
    el.style.top = '42%';
    el.textContent = text;
    board.querySelector('[data-spa]').appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  function act(station) {
    if (!running || !wanted) return;
    if (station !== wanted.station) {
      streak = 0;
      score = Math.max(0, score - 1);
      values[wanted.key] = clamp(values[wanted.key] - 6, 0, 100);
      Sfx.error();
      float('oops', rand(30, 70), 'bad');
      paintBars();
      shell.scoreEl.textContent = score;
      return;
    }
    streak += 1;
    const gain = 3 + Math.min(4, Math.floor(streak / 2));
    score += gain;
    values[wanted.key] = clamp(values[wanted.key] + 34, 0, 100);
    NEEDS.forEach((need) => {
      if (need.key !== wanted.key) values[need.key] = clamp(values[need.key] - 4, 0, 100);
    });
    Sfx.coin();
    tapHaptic(10);
    float(`+${gain}`, rand(30, 70), 'good');
    paintBars();
    shell.scoreEl.textContent = score;
    nextWant();
  }

  board.querySelectorAll('[data-station]').forEach((btn) => {
    btn.addEventListener('click', () => act(btn.dataset.station));
  });

  const KEYS = { f: 'Feed', n: 'Nap', p: 'Play', b: 'Bathe' };
  const onKey = (event) => {
    const station = KEYS[event.key.toLowerCase()];
    if (station) {
      act(station);
      event.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey);

  function frame(now) {
    if (!running) return;
    const dt = Math.min(48, now - last || 16);
    last = now;
    remaining = Math.max(0, remaining - dt);
    shell.timerEl.textContent = `${Math.ceil(remaining / 1000)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    NEEDS.forEach((need) => { values[need.key] = clamp(values[need.key] - dt * 0.0045, 0, 100); });
    paintBars();
    if (remaining <= 0) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    showGameResult(shell, {
      kind: 'spa',
      score,
      coins: Math.min(150, 14 + score * 4),
      xp: 10 + score * 2,
      blurb: `${streak > 1 ? `Best streak ${streak}. ` : ''}${NEEDS.map((n) => `${n.label} ${Math.round(values[n.key])}`).join(' · ')}`,
    });
  }

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
  });

  shell.timerEl.textContent = `${Math.ceil(DURATION / 1000)}s`;
  shell.timerBar.style.width = '100%';
  paintBars();
  nextWant();
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

/* ---------------- WEEKLY BATTLE PASS ----------------
   Ten tiers that reshuffle every ISO week, so the track is different each
   Monday without shipping new data. Progress is games finished since the week
   began; claims live in localStorage next to the other per-device flags. */
const PASS_TIER_COUNT = 10;
const PASS_GAMES_PER_TIER = 2;
const PASS_PASS_KEY = 'sprite-hollow.pass.v1';

function passWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function passSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function passRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function passTiersForWeek(week = passWeekKey()) {
  const roll = passRandom(passSeed(week));
  const shapes = [
    { kind: 'coins', label: 'Coin purse', icon: '🪙' },
    { kind: 'food', label: 'Pantry bundle', icon: '🍱' },
    { kind: 'snack', label: 'Snack pair', icon: '🍬' },
    { kind: 'feast', label: 'Starpath Feast', icon: '🌟' },
  ];
  return Array.from({ length: PASS_TIER_COUNT }, (_, index) => {
    const shape = index === PASS_TIER_COUNT - 1
      ? shapes[3]
      : shapes[Math.floor(roll() * 3)];
    const coins = Math.round((60 + index * 35) * (0.85 + roll() * 0.4));
    return {
      index,
      kind: shape.kind,
      icon: shape.icon,
      label: shape.label,
      need: (index + 1) * PASS_GAMES_PER_TIER,
      coins,
      food: shape.kind === 'food' ? 2 : 0,
      snack: shape.kind === 'snack' ? 2 : 0,
      feast: shape.kind === 'feast' ? 1 : 0,
      xp: 20 + index * 6,
    };
  });
}

function passStoredRecord() {
  try {
    const raw = JSON.parse(localStorage.getItem(PASS_PASS_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return null;
    return { week: String(raw.week || ''), base: Number(raw.base) || 0, claimed: Array.isArray(raw.claimed) ? raw.claimed : [] };
  } catch (err) {
    return null;
  }
}

function passSaveRecord(record) {
  try {
    localStorage.setItem(PASS_PASS_KEY, JSON.stringify(record));
  } catch (err) {
    console.warn('Battle pass progress could not be saved', err);
  }
}

function battlePassState() {
  const week = passWeekKey();
  const games = Number(state && state.stats && state.stats.games) || 0;
  let record = passStoredRecord();
  if (!record || record.week !== week) {
    /* A new week starts the track from the games count at this moment. */
    record = { week, base: games, claimed: [] };
    passSaveRecord(record);
  }
  const played = Math.max(0, games - record.base);
  const tiers = passTiersForWeek(week).map((tier) => ({
    ...tier,
    claimed: record.claimed.includes(tier.index),
    ready: played >= tier.need && !record.claimed.includes(tier.index),
  }));
  const next = tiers.find((tier) => !tier.claimed) || null;
  return { week, played, tiers, next, perTier: PASS_GAMES_PER_TIER };
}

function claimBattlePassTier(index) {
  const pass = battlePassState();
  const tier = pass.tiers.find((entry) => entry.index === Number(index));
  if (!tier) return { ok: false, reason: 'missing' };
  if (tier.claimed) return { ok: false, reason: 'claimed' };
  if (pass.played < tier.need) return { ok: false, reason: 'locked', need: tier.need, played: pass.played };
  const record = passStoredRecord() || { week: pass.week, base: 0, claimed: [] };
  if (!record.claimed.includes(tier.index)) record.claimed.push(tier.index);
  passSaveRecord(record);
  const payout = typeof Actions !== 'undefined' && typeof Actions.claimPassTier === 'function'
    ? Actions.claimPassTier({ coins: tier.coins, xp: tier.xp, joy: 10, food: tier.food, snack: tier.snack, feast: tier.feast })
    : { coins: 0 };
  return { ok: true, tier, payout };
}

function battlePassHTML() {
  if (typeof battlePassState !== 'function') return '';
  const pass = battlePassState();
  const done = pass.tiers.filter((tier) => tier.claimed).length;
  const pct = Math.min(100, (pass.played / (PASS_TIER_COUNT * PASS_GAMES_PER_TIER)) * 100);
  const nextNeed = pass.next ? pass.next.need : PASS_TIER_COUNT * PASS_GAMES_PER_TIER;
  return `<div class="arcade-hub pass-hub">
      <div class="between" style="align-items:flex-start;gap:8px">
        <div>
          <div class="arcade-kicker">🎟️ Weekly battle pass</div>
          <h3>Week ${esc(pass.week.split('-W')[1] || '')} track</h3>
          <p>Ten tiers that reshuffle every Monday. Every <b>${PASS_GAMES_PER_TIER}</b> finished games unlock the next tier — ${pass.next ? `${Math.max(0, nextNeed - pass.played)} to the next one` : 'every tier is yours this week'}.</p>
        </div>
        <span class="chip">${done} / ${PASS_TIER_COUNT}</span>
      </div>
      <div class="arcade-bar"><i style="width:${pct}%"></i></div>
      <div class="pass-tiers">
        ${pass.tiers.map((tier) => `<button class="pass-tier ${tier.claimed ? 'claimed' : ''} ${tier.ready ? 'ready' : ''}" type="button" data-pass-claim="${tier.index}" ${tier.ready ? '' : 'disabled'}>
          <b>${tier.claimed ? '✓' : tier.icon}</b>
          <span>${tier.label}</span>
          <i>+${tier.coins}🪙${tier.feast ? ' · 🌟' : tier.food ? ' · 🍱' : tier.snack ? ' · 🍬' : ''}</i>
          <em>${tier.claimed ? 'claimed' : tier.ready ? 'claim' : `${tier.need} games`}</em>
        </button>`).join('')}
      </div>
    </div>`;
}
