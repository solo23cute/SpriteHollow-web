/* Nest & Incubator Mini-Games:
   1. Egg Sort (Match & sort eggs by element)
   2. Nest Defense (Protect eggs from pests)
   3. Egg Decorator (Paint & customize egg shells)
   4. Egg Warming Tap (Rapid tap-to-warm challenge) */

const NEST_GAMES_INFO = {
  eggsort: { title: 'Egg Sorting', icon: '🧺', tag: 'Nest Sorting', desc: 'Tap the matching basket for each falling egg!', g1: '#ffb347', g2: '#8fe07a' },
  nestdefense: { title: 'Nest Defense', icon: '🪺', tag: 'Protect Eggs', desc: 'Tap greedy squirrels and crows before they touch the nest!', g1: '#ff5a4a', g2: '#ffd44d' },
  eggpaint: { title: 'Egg Decorator', icon: '🎨', tag: 'Paint & Decorate', desc: 'Decorate the egg shell with colors and sparkles for bonus stats!', g1: '#b69cff', g2: '#ff9ec7' },
  eggtap: { title: 'Egg Tap Warm', icon: '🔥', tag: 'Incubator Tap', desc: 'Tap rapidly to warm the nest before time runs out!', g1: '#ff8a3a', g2: '#ffd166' },
  eggmatch: { title: 'Egg Memory', icon: '🧩', tag: 'Nest Memory', desc: 'Flip egg cards and match every pair before time runs out!', g1: '#8be9ff', g2: '#b69cff' },
  shellshine: { title: 'Shell Shine', icon: '✨', tag: 'Nest Reflex', desc: 'Tap sparkling shells before they fade away!', g1: '#ffd166', g2: '#8fe07a' },
  emberrush: { title: 'Incubator Rush', icon: '🪔', tag: 'Warm the eggs', desc: 'Tap glowing eggs to bank hatch warmth with your active warmer!', g1: '#ff8a3a', g2: '#ffd166' },
  egghunt: { title: 'Egg Hunt', icon: '🥚', tag: 'Nest search', desc: 'Tap the grass to uncover hidden eggs before the hunt ends!', g1: '#ffd166', g2: '#8fe07a' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, NEST_GAMES_INFO);

/* ---------------- 1. EGG SORT ---------------- */
function openEggSortGame() {
  const shell = gameOverlayShell('eggsort');
  const { board } = shell;
  board.innerHTML = `<div class="eggsort-wrap" style="text-align:center;padding:12px">
      <div class="eggsort-egg" style="font-size:64px;margin:12px 0" data-egg-icon>🥚</div>
      <div class="tiny muted" style="margin-bottom:14px">Sort the egg into the right basket!</div>
      <div class="row" style="gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-gold" data-basket="ember">🔥 Ember</button>
        <button class="btn btn-primary" data-basket="tide">💧 Tide</button>
        <button class="btn btn-soft" data-basket="bloom">🌿 Bloom</button>
      </div>
    </div>${gameMiniSprite()}`;

  const iconEl = board.querySelector('[data-egg-icon]');
  const types = ['ember', 'tide', 'bloom'];
  const emojis = { ember: '🥚🔥', tide: '🥚💧', bloom: '🥚🌿' };
  let current = pick(types);
  let score = 0;
  let running = true;
  let startedAt = performance.now();
  const DURATION = 20000;

  function nextEgg() {
    current = pick(types);
    iconEl.textContent = emojis[current];
  }
  nextEgg();

  board.querySelectorAll('[data-basket]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!running) return;
      if (btn.dataset.basket === current) {
        score += 1;
        Sfx.coin();
        burstOn(btn, ['✨', '🥚'], 4);
      } else {
        Sfx.error();
      }
      shell.scoreEl.textContent = score;
      nextEgg();
    });
  });

  let raf = 0;
  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'eggsort', score, coins: Math.min(70, 10 + score * 3), xp: 15 + score * 2,
        blurb: score >= 15 ? 'Master Egg Sorter!' : 'Good sorting in the Nest!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

/* ---------------- 2. NEST DEFENSE ---------------- */
function openNestDefenseGame() {
  const shell = gameOverlayShell('nestdefense');
  const { board } = shell;
  board.innerHTML = `<div class="nestdef-field" style="background:rgba(255,255,255,.05)">
      <div class="nestdef-egg" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%)">🪺</div>
    </div>${gameMiniSprite()}`;

  const field = board.querySelector('.nestdef-field');
  const pests = ['🐿️', '🐦', '🦝', '🐀'];
  let score = 0;
  let running = true;
  let items = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 20000;

  function spawnPest() {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = pick(pests);
    el.style.cssText = `position:absolute;top:-10%;left:${rand(15, 85)}%;font-size:32px;background:none;border:none;cursor:pointer`;
    const item = { el, y: -10, speed: rand(22, 35), dead: false };

    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!running || item.dead) return;
      item.dead = true;
      score += 1;
      Sfx.pop();
      burstOn(el, ['💥', '✨'], 5);
      el.remove();
      shell.scoreEl.textContent = score;
    });
    field.appendChild(el);
    items.push(item);
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (now - lastSpawn > 500) {
      spawnPest();
      lastSpawn = now;
    }

    items.forEach((item) => {
      if (item.dead) return;
      item.y += item.speed * dt;
      item.el.style.top = `${item.y}%`;
      if (item.y > 80) {
        item.dead = true;
        item.el.remove();
        Sfx.error();
      }
    });
    items = items.filter((i) => !i.dead);

    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'nestdefense', score, coins: Math.min(75, 12 + score * 3), xp: 18 + score * 2,
        blurb: score >= 15 ? 'Nest Hero!' : 'The eggs are safe!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); items.forEach((i) => i.el.remove()); });
}

/* ---------------- 3. EGG DECORATOR ---------------- */
function openEggPaintGame() {
  const shell = gameOverlayShell('eggpaint');
  const { board } = shell;
  board.innerHTML = `<div class="eggpaint-wrap" style="text-align:center;padding:12px">
      <div class="eggpaint-canvas" style="font-size:72px;margin:12px 0;transition:transform .2s" data-egg-canvas>🥚</div>
      <div class="tiny muted" style="margin-bottom:12px">Tap colors to paint patterns on the shell!</div>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-gold" data-color="✨ Gold">✨ Gold</button>
        <button class="btn btn-primary" data-color="🌈 Rainbow">🌈 Rainbow</button>
        <button class="btn btn-soft" data-color="🌟 Cosmic">🌟 Cosmic</button>
      </div>
    </div>${gameMiniSprite()}`;

  const canvas = board.querySelector('[data-egg-canvas]');
  let score = 0;
  const eggArt = ['🥚', '🎨', '✨', '🌈', '🌟', '🪺'];

  board.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      score += 1;
      shell.scoreEl.textContent = score;
      canvas.textContent = pick(eggArt);
      canvas.style.transform = 'scale(1.25)';
      setTimeout(() => canvas.style.transform = 'scale(1)', 180);
      Sfx.coin();
      burstOn(canvas, ['🎨', '✨', '💖'], 6);

      if (score >= 8) {
        showGameResult(shell, {
          kind: 'eggpaint', score, coins: 55, xp: 35,
          blurb: 'Masterpiece Egg Decoration! +15% Mutation Boost!',
        });
      }
    });
  });
}

/* ---------------- 4. EGG WARMING TAP ---------------- */
function openEggTapGame() {
  const shell = gameOverlayShell('eggtap');
  const { board } = shell;
  board.innerHTML = `<div class="eggtap-wrap" style="text-align:center;padding:16px">
      <div style="font-size:64px;margin:12px 0;cursor:pointer" data-tap-egg>🔥🥚</div>
      <div class="tiny muted" style="margin-bottom:10px">Tap rapidly to heat the nest!</div>
      <div class="arcade-bar"><i data-heat-bar style="width:0%"></i></div>
    </div>${gameMiniSprite()}`;

  const eggBtn = board.querySelector('[data-tap-egg]');
  const bar = board.querySelector('[data-heat-bar]');
  let taps = 0;
  let running = true;
  let startedAt = performance.now();
  const DURATION = 15000;

  eggBtn.addEventListener('click', () => {
    if (!running) return;
    taps += 1;
    shell.scoreEl.textContent = taps;
    bar.style.width = `${Math.min(100, (taps / 25) * 100)}%`;
    Sfx.pop();
    burstOn(eggBtn, ['🔥', '✨'], 3);
  });

  let raf = 0;
  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'eggtap', score: taps, coins: Math.min(80, 10 + taps * 3), xp: 20 + taps * 2,
        blurb: taps >= 25 ? 'Superheated Nest!' : 'Warm & cozy nest!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

/* ---------------- 5. EGG MEMORY ---------------- */
function openEggMatchGame() {
  const shell = gameOverlayShell('eggmatch');
  const { board } = shell;
  const faces = ['🥚', '🔥', '💧', '🌿', '✨', '🌙'];
  const deck = [...faces, ...faces].sort(() => Math.random() - 0.5);
  board.innerHTML = `<div class="eggm-wrap" style="padding:10px 12px">
      <div class="tiny muted" style="text-align:center">Flip two shells and match all ${faces.length} pairs.</div>
      <div class="eggm-grid">${deck.map((face, i) => `<button class="eggm-card" data-card="${i}" data-face="${face}" aria-label="Shell ${i + 1}"><span>?</span></button>`).join('')}</div>
    </div>${gameMiniSprite()}`;

  const cards = [...board.querySelectorAll('[data-card]')];
  let open = [];
  let pairs = 0;
  let lock = false;
  let running = true;

  const reveal = (card) => {
    card.classList.add('open');
    card.querySelector('span').textContent = card.dataset.face;
  };
  const hide = (card) => {
    card.classList.remove('open');
    card.querySelector('span').textContent = '?';
  };

  let startedAt = performance.now();
  const DURATION = 60000;
  let raf = 0;

  function finish(won) {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    showGameResult(shell, {
      kind: 'eggmatch', score: pairs, coins: Math.min(80, 12 + pairs * 11), xp: 18 + pairs * 6,
      blurb: won ? 'Every shell remembers you!' : `Matched ${pairs} of ${faces.length} pairs.`,
    });
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!running || lock || card.classList.contains('open') || card.classList.contains('matched')) return;
      reveal(card);
      Sfx.click();
      open.push(card);
      if (open.length < 2) return;
      if (open[0].dataset.face === open[1].dataset.face) {
        open.forEach((c) => { c.classList.add('matched'); c.disabled = true; });
        pairs += 1;
        shell.scoreEl.textContent = pairs;
        Sfx.coin();
        burstOn(open[1], ['✨', '🥚'], 5);
        open = [];
        if (pairs === faces.length) finish(true);
        return;
      }
      lock = true;
      const [a, b] = open;
      open = [];
      Sfx.error();
      setTimeout(() => {
        if (!running) return;
        hide(a);
        hide(b);
        lock = false;
      }, 620);
    });
  });

  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) {
      finish(false);
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

/* ---------------- 6. SHELL SHINE ---------------- */
function openShellShineGame() {
  const shell = gameOverlayShell('shellshine');
  const { board } = shell;
  board.innerHTML = `<div class="shine-field"></div>${gameMiniSprite()}`;
  const field = board.querySelector('.shine-field');
  let score = 0;
  let running = true;
  let startedAt = performance.now();
  const DURATION = 15000;

  let live = 0;
  const MAX_LIVE = 3;

  function spawn() {
    if (!running || live >= MAX_LIVE) return;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'shine-spark';
    el.textContent = pick(['✨', '🌟', '💎']);
    el.style.top = `${rand(6, 78)}%`;
    el.style.left = `${rand(4, 82)}%`;
    live += 1;
    let alive = true;
    const clear = () => {
      if (!alive) return;
      alive = false;
      live -= 1;
      el.remove();
    };
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!alive || !running) return;
      score += 1;
      shell.scoreEl.textContent = score;
      Sfx.coin();
      burstOn(el, ['✨', '💫'], 4);
      clear();
    });
    field.appendChild(el);
    setTimeout(clear, 1200);
  }

  /* Three shells are always on screen, so the field stays busy. */
  const spawner = setInterval(spawn, 420);
  spawn();
  spawn();
  spawn();
  let raf = 0;
  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) {
      running = false;
      clearInterval(spawner);
      cancelAnimationFrame(raf);
      field.querySelectorAll('.shine-spark').forEach((el) => el.remove());
      showGameResult(shell, {
        kind: 'shellshine', score, coins: Math.min(80, 10 + score * 4), xp: 16 + score * 3,
        blurb: score >= 10 ? 'Every shell gleams!' : 'A good shine in the Nest.',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; clearInterval(spawner); cancelAnimationFrame(raf); });
}

/* ---------------- 7. INCUBATOR RUSH ---------------- */
function openEmberRushGame() {
  const shell = gameOverlayShell('emberrush');
  const { board } = shell;
  const incubator = typeof activeIncubator === 'function' ? activeIncubator() : { name: 'Warm Lamp', icon: '🪔', speedMult: 1.5 };
  const warming = typeof eggs === 'function' ? eggs().filter((egg) => egg && egg.hatch < 100) : [];
  board.innerHTML = `<div class="ember-field">
      <div class="ember-hint">${incubator.icon} ${incubator.name} · ${warming.length} egg${warming.length === 1 ? '' : 's'} waiting</div>
    </div>${gameMiniSprite()}`;
  const field = board.querySelector('.ember-field');
  let score = 0;
  let running = true;
  let startedAt = performance.now();
  const DURATION = 18000;
  let live = 0;
  const MAX_LIVE = 3;

  function spawn() {
    if (!running || live >= MAX_LIVE) return;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'ember-egg';
    el.textContent = pick(['🥚', '🔥', '🥚']);
    el.style.top = `${rand(16, 78)}%`;
    el.style.left = `${rand(4, 82)}%`;
    live += 1;
    let alive = true;
    const clear = () => {
      if (!alive) return;
      alive = false;
      live -= 1;
      el.remove();
    };
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!alive || !running) return;
      score += 1;
      shell.scoreEl.textContent = score;
      Sfx.pop();
      burstOn(el, ['🔥', '✨'], 4);
      clear();
    });
    field.appendChild(el);
    setTimeout(clear, 1100);
  }

  const spawner = setInterval(spawn, 430);
  spawn();
  spawn();
  spawn();

  let raf = 0;
  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) {
      running = false;
      clearInterval(spawner);
      cancelAnimationFrame(raf);
      field.querySelectorAll('.ember-egg').forEach((el) => el.remove());
      /* Bank the score as hatch progress on every waiting egg; warmEgg already
         applies the active warmer's multiplier. */
      const amount = Math.min(30, 6 + score);
      let warmed = 0;
      warming.forEach((egg) => {
        if (typeof Actions === 'undefined' || !Actions.warmEgg) return;
        const res = Actions.warmEgg(egg.id, amount);
        if (res && res.ok) warmed += 1;
      });
      showGameResult(shell, {
        kind: 'emberrush', score,
        coins: Math.min(85, 12 + score * 3), xp: 18 + score * 2,
        blurb: warmed
          ? `${warmed} egg${warmed === 1 ? '' : 's'} banked ${incubator.speedMult}x warmth from the ${incubator.name}.`
          : 'No eggs were waiting, but the nest is warm.',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; clearInterval(spawner); cancelAnimationFrame(raf); });
}

/* ---------------- 8. EGG HUNT ---------------- */
function openEggHuntGame() {
  const shell = gameOverlayShell('egghunt');
  const { board } = shell;
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:9px;padding:12px;overflow:auto">
      <div class="between" style="align-items:center"><span class="chip" data-hunt-found>0 found</span><span class="chip">🥚 Hidden nest</span></div>
      <div data-hunt-grid style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;flex:1;min-height:210px"></div>
      <div class="tiny muted" data-hunt-note style="text-align:center">Tap the grass. Every egg you find warms the waiting clutch.</div>
    </div>${gameMiniSprite()}`;
  const grid = board.querySelector('[data-hunt-grid]');
  const foundEl = board.querySelector('[data-hunt-found]');
  const note = board.querySelector('[data-hunt-note]');
  const cells = Array(16).fill(false);
  const timers = new Set();
  let score = 0;
  let found = 0;
  let running = true;
  let locked = false;
  let startedAt = performance.now();
  const DURATION = 20000;
  let raf = 0;

  function fillEggs(count) {
    for (let i = 0; i < count; i += 1) {
      const empty = cells.map((hasEgg, index) => hasEgg ? -1 : index).filter((index) => index >= 0);
      if (!empty.length) return;
      cells[pick(empty)] = true;
    }
  }
  fillEggs(5);

  function paint() {
    grid.innerHTML = cells.map((hasEgg, index) => `<button type="button" data-hunt-cell="${index}" aria-label="Grass patch ${index + 1}" style="min-height:42px;border-radius:12px;border:1px solid rgba(143,224,122,.35);background:linear-gradient(145deg,#31472d,#1b2c20);font-size:24px;line-height:1;cursor:pointer">🌿</button>`).join('');
    foundEl.textContent = `${found} found`;
    shell.scoreEl.textContent = score;
  }

  function later(fn, ms) {
    const timer = setTimeout(() => { timers.delete(timer); if (running) fn(); }, ms);
    timers.add(timer);
  }

  function tapCell(button) {
    if (!running || locked) return;
    const index = Number(button.dataset.huntCell);
    if (!Number.isInteger(index) || !cells[index] && cells[index] !== false) return;
    locked = true;
    button.disabled = true;
    if (cells[index]) {
      cells[index] = false;
      found += 1;
      score += 10;
      Sfx.coin();
      button.textContent = '🥚';
      button.style.background = 'linear-gradient(145deg,#ffe6a3,#ffb347)';
      burstOn(button, ['🥚', '✨', '💛'], 5);
      note.textContent = found >= 10 ? 'A basket full! Keep going.' : 'Found one! The next egg moved.';
      fillEggs(1);
      later(paint, 320);
    } else {
      score = Math.max(0, score - 2);
      Sfx.error();
      button.textContent = '🪨';
      button.style.background = 'linear-gradient(145deg,#555,#2c2c34)';
      note.textContent = 'Just a cold stone. Try another patch.';
      later(() => { locked = false; paint(); }, 260);
      return;
    }
    foundEl.textContent = `${found} found`;
    shell.scoreEl.textContent = score;
    later(() => { locked = false; paint(); }, 340);
  }

  grid.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-hunt-cell]') : null;
    if (button) tapCell(button);
  });

  function finish() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    const warming = typeof eggs === 'function' ? eggs().filter((egg) => egg && egg.hatch < 100) : [];
    const amount = Math.min(30, 4 + found);
    let warmed = 0;
    warming.forEach((egg) => {
      if (typeof Actions === 'undefined' || !Actions.warmEgg) return;
      const res = Actions.warmEgg(egg.id, amount);
      if (res && res.ok) warmed += 1;
    });
    showGameResult(shell, {
      kind: 'egghunt', score,
      coins: Math.min(125, 16 + score),
      xp: 20 + found * 2,
      blurb: warmed
        ? `${found} egg${found === 1 ? '' : 's'} found — ${warmed} waiting egg${warmed === 1 ? '' : 's'} banked ${amount} warmth.`
        : `${found} egg${found === 1 ? '' : 's'} found in the grass.`,
    });
  }

  function loop(now) {
    if (!running) return;
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) return finish();
    raf = requestAnimationFrame(loop);
  }
  paint();
  raf = requestAnimationFrame((now) => { startedAt = now; loop(now); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });
}

/* ---------------- 7. DRAGON NEST ---------------- */
const DRAGONNEST_INFO = {
  dragonnest: { title: 'Dragon Nest', icon: '🐉', tag: 'Form every type', desc: 'Match two eggs of a type to form its dragon — collect all six!', g1: '#7c4dff', g2: '#ffd700' },
};
if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, DRAGONNEST_INFO);

function openDragonNestGame() {
  const shell = gameOverlayShell('dragonnest');
  const { board } = shell;
  const TYPES = [
    { key: 'ember', icon: '🔥', name: 'Ember' },
    { key: 'tide', icon: '💧', name: 'Tide' },
    { key: 'bloom', icon: '🌿', name: 'Bloom' },
    { key: 'dusk', icon: '🌙', name: 'Dusk' },
    { key: 'spark', icon: '⚡', name: 'Spark' },
    { key: 'frost', icon: '❄️', name: 'Frost' },
  ];
  board.innerHTML = `<div style="position:relative;height:100%;min-height:300px;padding:10px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 8%,#2b1a5e,#120d26 72%)">
      <div data-set style="text-align:center;font-size:11px;color:#cfc2ff">formed 0 / 6 types</div>
      <div data-eggs style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px"></div>
      <div data-formed style="position:absolute;left:0;right:0;bottom:4px;text-align:center;font-size:22px;letter-spacing:4px"></div>
    </div>`;
  const eggsEl = board.querySelector('[data-eggs]');
  const setEl = board.querySelector('[data-set]');
  const formedEl = board.querySelector('[data-formed]');
  const deck = TYPES.slice();
  while (deck.length < 9) deck.push(pick(TYPES));
  deck.sort(() => Math.random() - 0.5);
  const formed = new Set();
  const DURATION = 30000;
  let score = 0;
  let revealed = [];
  let running = true;
  let startedAt = performance.now();
  let raf = 0;

  const drawSet = () => {
    setEl.textContent = `formed ${formed.size} / ${TYPES.length} types`;
    formedEl.textContent = TYPES.filter((t) => formed.has(t.key)).map((t) => t.icon).join('');
  };

  const finish = (blurb) => {
    if (!running) return;
    running = false;
    showGameResult(shell, {
      kind: 'dragonnest', score,
      coins: Math.min(95, 14 + score * 2), xp: 22 + score * 2,
      blurb: blurb || `${formed.size} of ${TYPES.length} dragon types formed — saved in Collection.`,
    });
  };

  const reveal = (btn, type) => {
    if (!running || btn.dataset.open) return;
    btn.dataset.open = '1';
    btn.textContent = type.icon;
    btn.style.background = 'linear-gradient(180deg,#5b43b8,#33246b)';
    Sfx.pop();
    const match = revealed.find((r) => r.key === type.key && r.btn.isConnected);
    if (match) {
      revealed = revealed.filter((r) => r !== match);
      score += 10;
      if (!formed.has(type.key)) {
        formed.add(type.key);
        score += 5;
        /* Formed types are permanent collection entries, not game-local state. */
        if (typeof Actions !== 'undefined' && Actions.recordDragonType) Actions.recordDragonType(type.key);
      }
      shell.scoreEl.textContent = score;
      drawSet();
      burstOn(btn, ['🐉', '✨'], 6);
      burstOn(match.btn, ['🐉', '✨'], 6);
      setTimeout(() => { btn.remove(); match.btn.remove(); }, 180);
      if (formed.size === TYPES.length) {
        score += 20;
        shell.scoreEl.textContent = score;
        finish('A Great Dragon formed out of all six types!');
      }
      return;
    }
    revealed.push({ key: type.key, btn });
    if (revealed.length > 6) {
      const old = revealed.shift();
      if (old.btn.isConnected) {
        old.btn.textContent = '🥚';
        delete old.btn.dataset.open;
        old.btn.style.background = 'linear-gradient(180deg,#3a2a72,#22184a)';
      }
    }
  };

  deck.forEach((type) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Dragon egg');
    btn.dataset.type = type.key;
    btn.style.cssText = 'position:relative;aspect-ratio:1/1;border:0;border-radius:14px;background:linear-gradient(180deg,#3a2a72,#22184a);color:#fff;font-size:26px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)';
    btn.textContent = '🥚';
    btn.addEventListener('click', () => reveal(btn, type));
    eggsEl.appendChild(btn);
  });
  drawSet();

  const loop = (t) => {
    if (!running) return;
    const left = Math.max(0, DURATION - (t - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) return finish();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

if (typeof openGame !== 'undefined') {
  const prevOpenGame = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'dragonnest') openDragonNestGame();
    else if (kind === 'eggsort') openEggSortGame();
    else if (kind === 'nestdefense') openNestDefenseGame();
    else if (kind === 'eggpaint') openEggPaintGame();
    else if (kind === 'eggtap') openEggTapGame();
    else if (kind === 'eggmatch') openEggMatchGame();
    else if (kind === 'shellshine') openShellShineGame();
    else if (kind === 'emberrush') openEmberRushGame();
    else if (kind === 'egghunt') openEggHuntGame();
    else if (typeof prevOpenGame === 'function') prevOpenGame(kind);
  };
}
