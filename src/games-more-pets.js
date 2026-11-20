/* Additional Virtual Pet Mini-Games:
   1. Flappy Pet (Flappy Bird style tap-to-fly runner)
   2. Memory Pairs (Pou memory card match)
   3. Suds & Soap (Bathing & cleaning mini-game)
   4. Snack Slice (Fruit Ninja style food slicing for pet meals) */

const MORE_PET_GAMES_INFO = {
  flappypet: { title: 'Flappy Pet', icon: '🐥', tag: 'Tap to Fly', desc: 'Tap to flap wings and fly through cloud gates!', g1: '#4fa8ff', g2: '#ffe066' },
  petpairs: { title: 'Memory Pairs', icon: '🎴', tag: 'Memory Match', desc: 'Flip cards and match virtual pet pairs!', g1: '#b69cff', g2: '#5ad6ff' },
  petclean: { title: 'Suds & Soap', icon: '🫧', tag: 'Bath & Clean', desc: 'Rub soap suds and rinse your pet squeaky clean!', g1: '#5ad6ff', g2: '#ff9ec7' },
  petslice: { title: 'Snack Slice', icon: '🍉', tag: 'Food Slice', desc: 'Slice falling fruits and snacks for your sprite!', g1: '#ff5a4a', g2: '#a3e635' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, MORE_PET_GAMES_INFO);

/* ---------------- 1. FLAPPY PET ---------------- */
function openFlappyPetGame() {
  const shell = gameOverlayShell('flappypet');
  const { board } = shell;
  board.innerHTML = `<div class="flappy-stage" style="background:linear-gradient(180deg,#87ceeb,#e0f6ff)">
      <div class="flappy-bird" style="position:absolute;left:20%;top:40%;transition:top .08s">🐥</div>
      <div class="tiny muted" style="position:absolute;bottom:8px;left:12px">Tap anywhere to flap!</div>
    </div>${gameMiniSprite()}`;

  const bird = board.querySelector('.flappy-bird');
  const stage = board.querySelector('.flappy-stage');
  let y = 40;
  let score = 0;
  let running = true;
  let pipes = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 20000;
  /* The mini sprite flaps through the fly clip for the whole run. */
  if (typeof lumiPlayClip === 'function') lumiPlayClip(board.querySelector('.game-pet-mini'), 'fly', DURATION + 2000);

  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!running) return;
    y = Math.max(5, y - 18);
    bird.style.top = `${y}%`;
    Sfx.tick();
  });

  function spawnPipe() {
    const gap = rand(25, 45);
    const topPipe = document.createElement('div');
    topPipe.style.cssText = `position:absolute;right:-15%;top:0;width:12%;height:${gap}%;background:#4caf50;border-radius:0 0 8px 8px`;
    const botPipe = document.createElement('div');
    botPipe.style.cssText = `position:absolute;right:-15%;bottom:0;width:12%;height:${80 - gap - 25}%;background:#4caf50;border-radius:8px 8px 0 0`;
    stage.appendChild(topPipe);
    stage.appendChild(botPipe);
    pipes.push({ topPipe, botPipe, x: 115, gap, dead: false });
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Gravity
    y = Math.min(90, y + 25 * dt);
    bird.style.top = `${y}%`;

    if (now - lastSpawn > 1400) {
      spawnPipe();
      lastSpawn = now;
    }

    pipes.forEach((p) => {
      if (p.dead) return;
      p.x -= 35 * dt;
      p.topPipe.style.right = `${100 - p.x}%`;
      p.botPipe.style.right = `${100 - p.x}%`;

      if (p.x <= 25 && p.x >= 15) {
        if (y < p.gap || y > p.gap + 25) {
          p.dead = true;
          Sfx.error();
          score = Math.max(0, score - 1);
        } else if (!p.passed) {
          p.passed = true;
          score += 1;
          Sfx.coin();
        }
      }

      if (p.x < -15) {
        p.dead = true;
        p.topPipe.remove();
        p.botPipe.remove();
      }
    });
    pipes = pipes.filter((p) => !p.dead);

    shell.scoreEl.textContent = score;

    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'flappypet', score, coins: Math.min(80, 10 + score * 4), xp: 20 + score * 2,
        blurb: score >= 10 ? 'Flappy Master!' : 'Nice flying!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); pipes.forEach((p) => { p.topPipe.remove(); p.botPipe.remove(); }); });
}

/* ---------------- 2. MEMORY PAIRS ---------------- */
function openPetPairsGame() {
  const shell = gameOverlayShell('petpairs');
  const { board } = shell;

  const icons = ['🐱', '🐸', '👾', '🐉', '🦊', '🛹'];
  const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

  board.innerHTML = `<div class="pairs-grid">
      ${deck.map((item, idx) => `<button class="btn btn-ghost pair-card" data-idx="${idx}" data-val="${item}">❓</button>`).join('')}
    </div>${gameMiniSprite()}`;

  let first = null;
  let second = null;
  let score = 0;
  let matches = 0;
  let lock = false;

  board.querySelectorAll('.pair-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (lock || card.classList.contains('matched') || card === first) return;
      card.textContent = card.dataset.val;

      if (!first) {
        first = card;
      } else {
        second = card;
        lock = true;
        if (first.dataset.val === second.dataset.val) {
          Sfx.coin();
          first.classList.add('matched');
          second.classList.add('matched');
          matches += 1;
          score += 10;
          first = null;
          second = null;
          lock = false;

          if (matches === icons.length) {
            showGameResult(shell, {
              kind: 'petpairs', score, coins: 70, xp: 35,
              blurb: 'Perfect Memory Match!',
            });
          }
        } else {
          Sfx.error();
          setTimeout(() => {
            first.textContent = '❓';
            second.textContent = '❓';
            first = null;
            second = null;
            lock = false;
          }, 600);
        }
      }
      shell.scoreEl.textContent = score;
    });
  });
}

/* ---------------- 3. SUDS & SOAP ---------------- */
function openPetCleanGame() {
  const shell = gameOverlayShell('petclean');
  /* A sheet-skinned pet washes through the wash clip for the whole game. */
  queueMicrotask(() => {
    if (typeof lumiPlayClip === 'function') lumiPlayClip(shell.board.querySelector('[data-dirty-pet]'), 'wash', 120000);
  });
  const { board } = shell;
  const s = activeSprite();
  board.innerHTML = `<div class="petclean-wrap" style="text-align:center;padding:16px">
      <div style="font-size:64px;margin:12px 0;cursor:pointer" data-dirty-pet>${spriteSVG(s, { expr: 'happy' })}</div>
      <div class="tiny muted" style="margin-bottom:12px">Rub soap suds and rinse your pet clean!</div>
      <div class="row" style="gap:8px;justify-content:center">
        <button class="btn btn-gold" data-act="soap">🧼 Soap Suds</button>
        <button class="btn btn-primary" data-act="rinse">🚿 Water Rinse</button>
      </div>
    </div>`;

  let score = 0;
  const pet = board.querySelector('[data-dirty-pet]');

  board.querySelectorAll('[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      score += 1;
      shell.scoreEl.textContent = score;
      if (btn.dataset.act === 'soap') {
        Sfx.bath();
        burstOn(pet, ['🫧', '🧼'], 6);
      } else {
        Sfx.bath();
        burstOn(pet, ['💧', '✨'], 6);
      }

      if (score >= 10) {
        showGameResult(shell, {
          kind: 'petclean', score, coins: 60, xp: 30,
          blurb: 'Squeaky Clean Pet!',
        });
      }
    });
  });
}

/* ---------------- 4. SNACK SLICE ---------------- */
function openSnackSliceGame() {
  const shell = gameOverlayShell('petslice');
  const { board } = shell;
  board.innerHTML = `<div class="slice-field" style="background:rgba(255,255,255,.05)">
      <div class="tiny muted" style="position:absolute;top:8px;left:12px">Slice falling snacks!</div>
    </div>${gameMiniSprite()}`;

  const field = board.querySelector('.slice-field');
  const snacks = ['🍉', '🍎', '🍌', '🍓', '🍒', '🍇'];
  let score = 0;
  let running = true;
  let items = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 20000;

  function spawnSnack() {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = pick(snacks);
    el.style.cssText = `position:absolute;top:-10%;left:${rand(15, 85)}%;font-size:36px;background:none;border:none;cursor:pointer`;
    const item = { el, y: -10, speed: rand(25, 40), dead: false };

    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!running || item.dead) return;
      item.dead = true;
      score += 1;
      Sfx.pop();
      burstOn(el, ['⚔️', '✨', '🍉'], 6);
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

    if (now - lastSpawn > 450) {
      spawnSnack();
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
        kind: 'petslice', score, coins: Math.min(80, 10 + score * 3), xp: 20 + score * 2,
        blurb: score >= 18 ? 'Master Snack Slicer!' : 'Delicious snack slice!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); items.forEach((i) => i.el.remove()); });
}

/* ---------------- 5. ROUND UP ---------------- */
const ROUNDUP_INFO = {
  roundup: { title: 'Round Up', icon: '🟣', tag: 'Tap & herd', desc: 'Tap the rolling puffs to pen them before they bounce away!', g1: '#b69cff', g2: '#5ad6ff' },
};
if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, ROUNDUP_INFO);

function openRoundUpGame() {
  const shell = gameOverlayShell('roundup');
  const { board } = shell;
  board.innerHTML = `<div data-field style="position:relative;height:100%;min-height:280px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 30% 18%,#2b2350,#140f2b 72%)">
      <div data-pen style="position:absolute;left:50%;bottom:10px;transform:translateX(-50%);width:150px;height:52px;border:2px dashed rgba(182,156,255,.55);border-radius:26px;display:grid;place-items:center;font-size:11px;font-weight:700;color:#cfc2ff">pen 0</div>
    </div>`;
  const field = board.querySelector('[data-field]');
  const pen = board.querySelector('[data-pen]');
  const DURATION = 20000;
  const COLORS = ['#b69cff', '#5ad6ff', '#8fe07a', '#ffd166', '#ff9ec7'];
  let score = 0;
  let running = true;
  let startedAt = performance.now();
  let raf = 0;

  const spawn = () => {
    if (!running) return;
    const puff = document.createElement('button');
    puff.type = 'button';
    puff.setAttribute('aria-label', 'Round up this puff');
    puff.dataset.puff = '1';
    const tint = pick(COLORS);
    puff.style.cssText = `position:absolute;left:${rand(5, 82)}%;top:${rand(5, 70)}%;width:46px;height:46px;border:0;border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff,${tint});box-shadow:0 8px 16px rgba(0,0,0,.35);cursor:pointer;transition:transform .16s ease-out,opacity .16s`;
    puff.addEventListener('click', () => {
      if (!running || puff.dataset.done) return;
      puff.dataset.done = '1';
      score += 1;
      shell.scoreEl.textContent = score;
      pen.textContent = `pen ${score}`;
      Sfx.pop();
      burstOn(puff, ['✨'], 3);
      puff.style.transform = 'scale(.2)';
      puff.style.opacity = '0';
      setTimeout(() => puff.remove(), 200);
    });
    field.appendChild(puff);
    setTimeout(() => {
      if (puff.dataset.done) return;
      puff.style.opacity = '0';
      setTimeout(() => puff.remove(), 200);
    }, 2400);
  };

  const timer = setInterval(spawn, 620);
  for (let i = 0; i < 3; i += 1) spawn();

  const finish = () => {
    if (!running) return;
    running = false;
    clearInterval(timer);
    field.querySelectorAll('[data-puff]').forEach((el) => el.remove());
    showGameResult(shell, {
      kind: 'roundup', score,
      coins: Math.min(80, 12 + score * 2), xp: 16 + score * 2,
      blurb: score >= 18 ? 'Every puff penned — the roundest herd in the Hollow!' : 'The pen is warm and the puffs are sleepy.',
    });
  };

  const loop = (t) => {
    if (!running) return;
    const left = Math.max(0, DURATION - (t - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) return finish();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; clearInterval(timer); cancelAnimationFrame(raf); });
}

if (typeof openGame !== 'undefined') {
  const prevOpenGame2 = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'roundup') openRoundUpGame();
    else if (kind === 'flappypet') openFlappyPetGame();
    else if (kind === 'petpairs') openPetPairsGame();
    else if (kind === 'petclean') openPetCleanGame();
    else if (kind === 'petslice') openSnackSliceGame();
    else if (typeof prevOpenGame2 === 'function') prevOpenGame2(kind);
  };
}
