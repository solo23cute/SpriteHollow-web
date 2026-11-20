/* New mini-game types:
   1. Sort Sprint — send each item to the right basket (categorising)
   2. Orbit Tap — tap the moment the spark crosses the gate (timing) */

const WAVE_GAME_INFO = {
  sortsprint: { title: 'Sort Sprint', icon: '🧺', tag: 'Sort & Match', desc: 'Send each item to the right basket before the clock runs out.', g1: '#ffd166', g2: '#7ee787' },
  orbittap: { title: 'Orbit Tap', icon: '🛰️', tag: 'Precision Timing', desc: 'Tap the moment the orbiting spark crosses the glowing gate.', g1: '#8be9ff', g2: '#c084fc' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, WAVE_GAME_INFO);

function waveCountdown(shell, seconds, onEnd) {
  const total = seconds * 1000;
  const startedAt = performance.now();
  const tick = setInterval(() => {
    const left = Math.max(0, total - (performance.now() - startedAt));
    shell.timerEl.textContent = `${Math.ceil(left / 1000)}s`;
    shell.timerBar.style.width = `${Math.max(0, (left / total) * 100)}%`;
    if (left <= 0) onEnd();
  }, 100);
  shell.addCleanup(() => clearInterval(tick));
  return tick;
}

function wavePick(list) {
  if (typeof pick === 'function') return pick(list);
  return list[Math.floor(Math.random() * list.length)];
}

/* ---------------- 1. SORT SPRINT ---------------- */
function openSortSprint() {
  const shell = gameOverlayShell('sortsprint');
  const { board } = shell;
  const BINS = [
    { key: 'fruit', label: 'Fruit', icon: '🍎', tint: '#ff8f6b' },
    { key: 'treat', label: 'Treat', icon: '🍬', tint: '#8be9ff' },
  ];
  const ITEMS = [
    { icon: '🍎', bin: 'fruit' }, { icon: '🍌', bin: 'fruit' }, { icon: '🍇', bin: 'fruit' },
    { icon: '🍓', bin: 'fruit' }, { icon: '🍊', bin: 'fruit' }, { icon: '🍐', bin: 'fruit' },
    { icon: '🍬', bin: 'treat' }, { icon: '🍪', bin: 'treat' }, { icon: '🧁', bin: 'treat' },
    { icon: '🍩', bin: 'treat' }, { icon: '🍫', bin: 'treat' }, { icon: '🍭', bin: 'treat' },
  ];
  let score = 0;
  let sorted = 0;
  let wrong = 0;
  let combo = 0;
  let current = null;
  let running = true;
  let finished = false;

  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:16px;background:linear-gradient(180deg,#2a1c3f,#3b2a58 60%,#241a33)">
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
        <div data-item style="font-size:64px;line-height:1;filter:drop-shadow(0 8px 18px rgba(0,0,0,.35));transition:transform .16s ease">🍎</div>
        <div class="tiny" style="color:#fff;opacity:.72">Which basket does this belong in?</div>
        <div data-combo class="tiny" style="color:#ffd166;min-height:14px"></div>
      </div>
      <div style="display:flex;gap:12px">
        ${BINS.map((b) => `<button data-bin="${b.key}" style="flex:1;padding:16px 8px;border-radius:18px;border:2px solid ${b.tint};background:${b.tint}22;color:#fff;font-weight:800;font-size:15px;cursor:pointer;touch-action:manipulation">${b.icon} ${b.label}</button>`).join('')}
      </div>
    </div>`;

  const itemEl = board.querySelector('[data-item]');
  const comboEl = board.querySelector('[data-combo]');

  function next() {
    current = wavePick(ITEMS);
    itemEl.textContent = current.icon;
    itemEl.style.transform = 'scale(.82)';
    requestAnimationFrame(() => { itemEl.style.transform = 'scale(1)'; });
  }

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    showGameResult(shell, {
      kind: 'sortsprint',
      score,
      coins: Math.min(110, 14 + score * 4),
      xp: 12 + score * 2,
      blurb: sorted >= 12 ? 'Baskets perfectly balanced!' : sorted >= 6 ? 'Tidy work at the counter.' : 'A few items rolled under the shelf.',
    });
  }

  board.querySelectorAll('[data-bin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!running || !current) return;
      if (btn.dataset.bin === current.bin) {
        combo += 1;
        sorted += 1;
        score += 2 + Math.min(4, combo);
        shell.scoreEl.textContent = score;
        comboEl.textContent = combo >= 2 ? `${combo}x combo · +${Math.min(4, combo)} bonus` : '';
        Sfx.coin();
        burstOn(itemEl, ['✨', '✅'], 3);
        next();
      } else {
        combo = 0;
        wrong += 1;
        comboEl.textContent = 'Wrong basket — try the next one.';
        Sfx.pop();
        itemEl.style.transform = 'translateX(-6px)';
        setTimeout(() => { if (running) itemEl.style.transform = 'translateX(0)'; }, 160);
      }
    });
  });

  next();
  waveCountdown(shell, 24, finish);
  shell.addCleanup(() => { running = false; });
}

/* ---------------- 2. ORBIT TAP ---------------- */
function openOrbitTap() {
  const shell = gameOverlayShell('orbittap');
  const { board } = shell;
  const TAU = Math.PI * 2;
  const GATE = -Math.PI / 2;
  const WINDOW = 0.34;
  let score = 0;
  let hits = 0;
  let angle = Math.random() * TAU;
  let speed = 2.1;
  let running = true;
  let finished = false;
  let lastTap = 0;
  let raf = 0;

  board.innerHTML = `<div data-field style="position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 50% 45%,#1b2b4a,#0d1424 72%);touch-action:manipulation">
      <div style="position:absolute;left:50%;top:47%;width:min(68vw,300px);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:2px dashed rgba(139,233,255,.28)"></div>
      <div data-gate style="position:absolute;left:50%;top:47%;width:min(68vw,300px);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 26px rgba(192,132,252,.0);transition:box-shadow .12s ease"></div>
      <div data-gate-dot style="position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#c084fc;box-shadow:0 0 16px #c084fc;transform:translate(-50%,-50%)"></div>
      <div data-spark style="position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:radial-gradient(circle,#fff,#8be9ff 60%,rgba(139,233,255,0));transform:translate(-50%,-50%);transition:transform .1s ease"></div>
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:7%;color:#fff;text-align:center;opacity:.8">Tap anywhere as the spark passes the purple gate.</div>
    </div>`;

  const field = board.querySelector('[data-field]');
  const gateDot = board.querySelector('[data-gate-dot]');
  const gate = board.querySelector('[data-gate]');
  const spark = board.querySelector('[data-spark]');

  function place(node, a, pct) {
    node.style.left = `${50 + Math.cos(a) * pct}%`;
    node.style.top = `${47 + Math.sin(a) * pct}%`;
  }

  place(gateDot, GATE, 34);

  function frame(now) {
    if (!running) return;
    angle = (angle + 0.016 * speed) % TAU;
    place(spark, angle, 34);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    cancelAnimationFrame(raf);
    showGameResult(shell, {
      kind: 'orbittap',
      score,
      coins: Math.min(110, 16 + score * 4),
      xp: 14 + score * 2,
      blurb: hits >= 10 ? 'Laser-perfect timing!' : hits >= 5 ? 'Nice steady rhythm.' : 'The spark kept slipping past.',
    });
  }

  field.addEventListener('pointerdown', () => {
    if (!running) return;
    const now = performance.now();
    if (now - lastTap < 150) return;
    lastTap = now;
    let diff = Math.abs(((angle - GATE + Math.PI) % TAU) - Math.PI);
    diff = Math.abs(((angle - GATE + TAU) % TAU));
    if (diff > Math.PI) diff = TAU - diff;
    if (diff <= WINDOW) {
      hits += 1;
      score += 3;
      speed = Math.min(4.6, speed + 0.16);
      shell.scoreEl.textContent = score;
      Sfx.coin();
      gate.style.boxShadow = '0 0 30px rgba(192,132,252,.85)';
      spark.style.transform = 'translate(-50%,-50%) scale(1.5)';
      setTimeout(() => {
        gate.style.boxShadow = '0 0 26px rgba(192,132,252,.0)';
        spark.style.transform = 'translate(-50%,-50%) scale(1)';
      }, 140);
    } else {
      Sfx.pop();
    }
  });

  waveCountdown(shell, 20, finish);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
  });
}

/* Hook openGame so the new game types launch from the Activities menu. */
if (typeof openGame !== 'undefined') {
  const prevOpenGameWave = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'sortsprint') return openSortSprint();
    if (kind === 'orbittap') return openOrbitTap();
    return prevOpenGameWave(kind);
  };
}
