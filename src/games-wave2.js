/* Three more mini-game types with mechanics the collection did not have yet:
   1. Beat Lane   — four-lane falling notes, tap on the line
   2. Brick Bash  — paddle and ball, clear the brick wall
   3. Coin Cliff  — push your luck, bank before the cliff gives way */

const WAVE2_GAME_INFO = {
  beatlane: { title: 'Beat Lane', icon: '🎹', tag: 'Rhythm lanes', desc: 'Tap the lane as each note crosses the line and keep the combo alive.', g1: '#8be9ff', g2: '#ff8f6b' },
  brickbash: { title: 'Brick Bash', icon: '🧱', tag: 'Paddle & ball', desc: 'Drag the paddle and clear every brick without dropping the ball.', g1: '#ff8f6b', g2: '#ffd166' },
  coincliff: { title: 'Coin Cliff', icon: '🪙', tag: 'Push your luck', desc: 'Every dig adds coins and raises the risk. Bank before the cliff gives way.', g1: '#ffd166', g2: '#c084fc' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, WAVE2_GAME_INFO);

/* ---------------- 1. BEAT LANE ---------------- */
function openBeatLane() {
  const shell = gameOverlayShell('beatlane');
  const { board } = shell;
  const COLORS = ['#ff8f6b', '#8be9ff', '#ffd166', '#c084fc'];
  const KEYS = ['D', 'F', 'J', 'K'];
  const LINE = 0.72;
  let score = 0;
  let hits = 0;
  let combo = 0;
  let bestCombo = 0;
  let running = true;
  let finished = false;
  let raf = 0;
  let last = 0;
  const notes = [];

  board.innerHTML = `<div data-field style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#0f1730,#1c1030 70%)">
      ${COLORS.map((c, i) => `<div style="position:absolute;top:0;bottom:0;left:${i * 25}%;width:25%;border-right:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(0,0,0,.16))"></div>`).join('')}
      <div style="position:absolute;left:0;right:0;top:${LINE * 100}%;height:3px;background:rgba(255,255,255,.5);box-shadow:0 0 18px rgba(139,233,255,.7)"></div>
      <div class="tiny" style="position:absolute;left:0;right:0;top:5%;text-align:center;color:#fff;opacity:.7">Tap the lane as each note crosses the line.</div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;display:flex">
      ${COLORS.map((c, i) => `<button data-lane="${i}" style="flex:1;height:76px;border:0;border-top:4px solid ${c};background:${c}22;color:#fff;font-weight:900;font-size:19px;touch-action:manipulation">${KEYS[i]}</button>`).join('')}
    </div>`;

  const field = board.querySelector('[data-field]');

  function spawn() {
    if (!running) return;
    const lane = Math.floor(Math.random() * 4);
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:${lane * 25 + 12.5}%;top:-4%;width:44px;height:14px;margin-left:-22px;border-radius:99px;background:${COLORS[lane]};box-shadow:0 0 14px ${COLORS[lane]}`;
    field.appendChild(el);
    notes.push({ el, lane, y: 0, done: false, spawnedAt: performance.now() });
  }

  function frame(now) {
    if (!running) return;
    if (!last) last = now;
    const dt = Math.min(48, now - last);
    last = now;
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n.done) { notes.splice(i, 1); continue; }
      n.y = (now - n.spawnedAt) / 1500;
      n.el.style.top = `${n.y * 100}%`;
      if (n.y > 0.94) {
        n.done = true;
        n.el.remove();
        notes.splice(i, 1);
        combo = 0;
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    cancelAnimationFrame(raf);
    notes.forEach((n) => n.el.remove());
    showGameResult(shell, {
      kind: 'beatlane',
      score,
      coins: Math.min(120, 14 + score * 3),
      xp: 12 + score * 2,
      blurb: hits >= 14 ? 'The whole Hollow is on beat!' : hits >= 7 ? 'A steady groove.' : 'The notes ran away with it.',
    });
  }

  function tap(lane) {
    if (!running) return;
    let pickNote = null;
    let bestDist = 0.22;
    notes.forEach((n) => {
      if (n.done || n.lane !== lane) return;
      const d = Math.abs((performance.now() - n.spawnedAt) / 1500 - LINE);
      if (d < bestDist) { bestDist = d; pickNote = n; }
    });
    const btn = board.querySelector(`[data-lane="${lane}"]`);
    if (pickNote) {
      pickNote.done = true;
      pickNote.el.remove();
      combo += 1;
      hits += 1;
      bestCombo = Math.max(bestCombo, combo);
      score += 3 + Math.min(6, combo);
      shell.scoreEl.textContent = score;
      Sfx.coin();
      if (btn) {
        btn.style.background = `${COLORS[lane]}66`;
        setTimeout(() => { if (btn.isConnected) btn.style.background = `${COLORS[lane]}22`; }, 110);
      }
    } else {
      combo = 0;
      Sfx.pop();
    }
  }

  board.querySelectorAll('[data-lane]').forEach((btn) => {
    btn.addEventListener('click', () => tap(Number(btn.dataset.lane)));
  });

  raf = requestAnimationFrame(frame);
  const spawner = setInterval(spawn, 640);
  waveCountdown(shell, 24, finish);
  shell.addCleanup(() => {
    running = false;
    clearInterval(spawner);
    cancelAnimationFrame(raf);
  });
}

/* ---------------- 2. BRICK BASH ---------------- */
function openBrickBash() {
  const shell = gameOverlayShell('brickbash');
  const { board } = shell;
  const COLORS = ['#ff8f6b', '#ffd166', '#7ee787', '#8be9ff', '#c084fc'];
  let score = 0;
  let lives = 3;
  let running = true;
  let finished = false;
  let raf = 0;
  let last = 0;
  let paddleX = 0;
  let W = 0;
  let H = 0;
  let paddleY = 0;
  let ball = { x: 0, y: 0, vx: 0, vy: 0 };
  let bricks = [];

  board.innerHTML = `<div data-field style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#121a2e,#241436);touch-action:none">
      <div data-bricks style="position:absolute;left:6%;right:6%;top:9%;display:grid;grid-template-columns:repeat(5,1fr);gap:8px"></div>
      <div data-paddle style="position:absolute;bottom:15%;left:50%;width:92px;height:14px;border-radius:99px;background:linear-gradient(90deg,#8be9ff,#c084fc);transform:translateX(-50%);box-shadow:0 0 16px rgba(139,233,255,.6)"></div>
      <div data-ball style="position:absolute;left:50%;top:70%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#fff;box-shadow:0 0 12px #8be9ff"></div>
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:6%;color:#fff;text-align:center;opacity:.7">Drag to move the paddle. Clear every brick.</div>
    </div>`;

  const field = board.querySelector('[data-field]');
  const grid = board.querySelector('[data-bricks]');
  const paddle = board.querySelector('[data-paddle]');
  const ballEl = board.querySelector('[data-ball]');

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    const c = COLORS[i % COLORS.length];
    el.style.cssText = `height:22px;border-radius:6px;background:${c};opacity:.92;box-shadow:0 0 10px ${c}55`;
    grid.appendChild(el);
  }

  function measure() {
    const fr = field.getBoundingClientRect();
    const pr = paddle.getBoundingClientRect();
    W = fr.width;
    H = fr.height;
    paddleY = pr.top - fr.top;
    if (!paddleX) paddleX = W / 2;
    bricks = Array.from(grid.children).map((el) => {
      if (el.dataset.dead === '1') return { el, x: 0, y: 0, w: 0, h: 0, alive: false };
      const r = el.getBoundingClientRect();
      return { el, x: r.left - fr.left, y: r.top - fr.top, w: r.width, h: r.height, alive: true };
    });
  }

  function resetBall() {
    ball = { x: W / 2, y: Math.max(24, paddleY - 46), vx: (Math.random() < 0.5 ? -1 : 1) * 0.24, vy: -0.32 };
    ballEl.style.left = `${ball.x}px`;
    ballEl.style.top = `${ball.y}px`;
  }

  function finish(won) {
    if (finished) return;
    finished = true;
    running = false;
    cancelAnimationFrame(raf);
    showGameResult(shell, {
      kind: 'brickbash',
      score,
      coins: Math.min(130, 12 + score * 3),
      xp: 12 + score * 2,
      blurb: won ? 'Every brick down. Perfect rally.' : lives > 1 ? 'Good rally — the wall held.' : 'The ball found the floor.',
    });
  }

  function frame(now) {
    if (!running) return;
    if (!last) last = now;
    const dt = Math.min(40, now - last);
    last = now;
    const r = 6;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x < r) { ball.x = r; ball.vx = Math.abs(ball.vx); }
    if (ball.x > W - r) { ball.x = W - r; ball.vx = -Math.abs(ball.vx); }
    if (ball.y < r) { ball.y = r; ball.vy = Math.abs(ball.vy); }

    const half = 46;
    if (ball.vy > 0 && ball.y + r >= paddleY && ball.y - r <= paddleY + 14 && Math.abs(ball.x - paddleX) < half + r) {
      ball.y = paddleY - r;
      ball.vx = Math.max(-0.36, Math.min(0.36, ((ball.x - paddleX) / half) * 0.34));
      ball.vy = -Math.abs(ball.vy);
      Sfx.pop();
    }

    for (let i = 0; i < bricks.length; i++) {
      const b = bricks[i];
      if (!b.alive) continue;
      if (ball.x + r > b.x && ball.x - r < b.x + b.w && ball.y + r > b.y && ball.y - r < b.y + b.h) {
        b.alive = false;
        b.el.dataset.dead = '1';
        b.el.remove();
        score += 4;
        shell.scoreEl.textContent = score;
        ball.vy *= -1;
        Sfx.coin();
      }
    }

    if (!bricks.some((b) => b.alive)) { finish(true); return; }
    if (ball.y - r > H) {
      lives -= 1;
      shell.hintEl.textContent = `${lives} ${lives === 1 ? 'life' : 'lives'} left`;
      if (lives <= 0) { finish(false); return; }
      resetBall();
    }

    ballEl.style.left = `${ball.x}px`;
    ballEl.style.top = `${ball.y}px`;
    raf = requestAnimationFrame(frame);
  }

  function movePaddle(e) {
    if (!running) return;
    const fr = field.getBoundingClientRect();
    paddleX = Math.max(46, Math.min(W - 46, e.clientX - fr.left));
    paddle.style.left = `${paddleX}px`;
  }

  field.addEventListener('pointermove', movePaddle);
  field.addEventListener('pointerdown', movePaddle);

  measure();
  resetBall();
  raf = requestAnimationFrame(frame);
  waveCountdown(shell, 35, () => finish(false));
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
  });
}

/* ---------------- 3. COIN CLIFF ---------------- */
function openCoinCliff() {
  const shell = gameOverlayShell('coincliff');
  const { board } = shell;
  let pot = 0;
  let digs = 0;
  let risk = 0.05;
  let running = true;
  let finished = false;

  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:18px;background:linear-gradient(180deg,#2b1c0f,#4a2f14 55%,#120b06)">
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#fff">
        <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.7">Pot</div>
        <div data-pot style="font-size:46px;font-weight:900;line-height:1;color:#ffd166">🪙 0</div>
        <div data-risk class="tiny" style="opacity:.78">Cliff risk: 5%</div>
        <div data-dug class="tiny" style="opacity:.6">0 digs</div>
      </div>
      <div style="display:flex;gap:10px">
        <button data-dig style="flex:1.4;padding:16px;border-radius:18px;border:2px solid #ffd166;background:#ffd16622;color:#fff;font-weight:900;font-size:16px;touch-action:manipulation">⛏️ Dig</button>
        <button data-bank style="flex:1;padding:16px;border-radius:18px;border:2px solid #7ee787;background:#7ee78722;color:#fff;font-weight:900;font-size:16px;touch-action:manipulation">🏦 Bank</button>
      </div>
    </div>`;

  const potEl = board.querySelector('[data-pot]');
  const riskEl = board.querySelector('[data-risk]');
  const dugEl = board.querySelector('[data-dug]');
  const digBtn = board.querySelector('[data-dig]');
  const bankBtn = board.querySelector('[data-bank]');

  function paint() {
    potEl.textContent = `🪙 ${pot}`;
    riskEl.textContent = `Cliff risk: ${Math.round(risk * 100)}%`;
    dugEl.textContent = `${digs} dig${digs === 1 ? '' : 's'}`;
  }

  function finish(how) {
    if (finished) return;
    finished = true;
    running = false;
    const kept = how === 'bust' ? 0 : pot;
    showGameResult(shell, {
      kind: 'coincliff',
      score: kept,
      coins: kept,
      xp: 10 + Math.round(kept / 2),
      blurb: how === 'bust' ? 'The cliff gave way and the whole pot went with it.' : how === 'time' ? 'Time ran out — the pot stayed in the ground.' : kept > 40 ? 'Banked it all. Clean nerve.' : 'Banked. Small, but yours.',
    });
  }

  digBtn.addEventListener('click', () => {
    if (!running) return;
    if (Math.random() < risk) { finish('bust'); return; }
    digs += 1;
    pot += 4 + Math.floor(Math.random() * 7);
    risk = Math.min(0.72, risk + 0.05);
    paint();
    Sfx.coin();
  });

  bankBtn.addEventListener('click', () => {
    if (!running) return;
    finish('bank');
  });

  paint();
  waveCountdown(shell, 30, () => finish('time'));
  shell.addCleanup(() => { running = false; });
}

/* Hook openGame so the new game types launch from the Activities menu. */
if (typeof openGame !== 'undefined') {
  const prevOpenGameWave2 = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'beatlane') return openBeatLane();
    if (kind === 'brickbash') return openBrickBash();
    if (kind === 'coincliff') return openCoinCliff();
    return prevOpenGameWave2(kind);
  };
}
