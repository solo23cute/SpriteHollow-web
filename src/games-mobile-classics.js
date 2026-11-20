/* Mobile Game Classics Mini-Games:
   1. Temple Escape (Temple Run obstacle runner)
   2. 8-Ball Billiards (Aim and sink cue balls)
   3. Slingshot Fling (Angry Birds launcher)
   4. Snake Slither (Snake.io orb collector)
   5. Plant Defense (PvZ peashooter lawn guardian) */

const MOBILE_CLASSIC_GAMES_INFO = {
  templeescape: { title: 'Temple Escape', icon: '🗿', tag: 'Temple Run', desc: 'Jump over root traps and slide under stone archways!', g1: '#c6a052', g2: '#38bdf8' },
  eightballpool: { title: '8-Ball Billiards', icon: '🎱', tag: 'Cue Sports', desc: 'Aim and sink cue balls into the corner pockets!', g1: '#1e293b', g2: '#38bdf8' },
  slingshot: { title: 'Slingshot Fling', icon: '🎯', tag: 'Bird Fling', desc: 'Pull back and launch angry birds into pig towers!', g1: '#b91c1c', g2: '#facc15' },
  snakeslither: { title: 'Snake Slither', icon: '🐍', tag: 'Slither Arena', desc: 'Eat glowing orbs to grow your slither serpent longer!', g1: '#10b981', g2: '#a855f7' },
  plantdefense: { title: 'Plant Defense', icon: '🌱', tag: 'Lawn Guard', desc: 'Tap lawn lanes to shoot peas at advancing zombies!', g1: '#22c55e', g2: '#84cc16' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, MOBILE_CLASSIC_GAMES_INFO);

/* ---------------- 1. TEMPLE ESCAPE (Temple Run style) ---------------- */
function openTempleEscapeGame() {
  const shell = gameOverlayShell('templeescape');
  const { board } = shell;
  board.innerHTML = `<div class="temple-track" style="position:relative;height:240px;background:linear-gradient(180deg,#3a2e1e,#1a130b);border-radius:12px;overflow:hidden">
      <div class="temple-runner" style="position:absolute;left:20%;bottom:20%;font-size:36px;transition:bottom .12s">🏃</div>
      <div class="tiny muted" style="position:absolute;top:8px;left:12px">Demon monkeys are chasing you!</div>
      <div class="row" style="position:absolute;bottom:8px;right:12px;gap:6px">
        <button class="btn btn-gold btn-sm" data-act="jump">⬆️ Jump</button>
        <button class="btn btn-soft btn-sm" data-act="slide">⬇️ Slide</button>
      </div>
    </div>${gameMiniSprite()}`;

  const runner = board.querySelector('.temple-runner');
  const track = board.querySelector('.temple-track');
  let score = 0;
  let running = true;
  let obstacles = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 22000;

  board.querySelector('[data-act="jump"]').addEventListener('click', () => {
    if (!running) return;
    runner.style.bottom = '55%';
    Sfx.tick();
    setTimeout(() => runner.style.bottom = '20%', 350);
  });

  board.querySelector('[data-act="slide"]').addEventListener('click', () => {
    if (!running) return;
    runner.style.bottom = '5%';
    Sfx.tick();
    setTimeout(() => runner.style.bottom = '20%', 350);
  });

  function spawnObstacle() {
    const isHigh = chance(0.5);
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;right:-15%;${isHigh ? 'bottom:50%' : 'bottom:20%'};font-size:32px`;
    el.textContent = isHigh ? '🪵' : '🪨';
    track.appendChild(el);
    obstacles.push({ el, x: 115, isHigh, dead: false });
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (now - lastSpawn > 1300) {
      spawnObstacle();
      lastSpawn = now;
    }

    obstacles.forEach((obs) => {
      if (obs.dead) return;
      obs.x -= 40 * dt;
      obs.el.style.right = `${100 - obs.x}%`;

      if (obs.x <= 25 && obs.x >= 15) {
        const curBottom = parseInt(runner.style.bottom || '20', 10);
        if (obs.isHigh && curBottom !== 5) {
          obs.dead = true;
          Sfx.error();
          score = Math.max(0, score - 2);
        } else if (!obs.isHigh && curBottom !== 55) {
          obs.dead = true;
          Sfx.error();
          score = Math.max(0, score - 2);
        } else if (!obs.passed) {
          obs.passed = true;
          score += 3;
          Sfx.coin();
        }
      }

      if (obs.x < -15) {
        obs.dead = true;
        obs.el.remove();
      }
    });
    obstacles = obstacles.filter((o) => !o.dead);

    shell.scoreEl.textContent = score;

    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'templeescape', score, coins: Math.min(85, 12 + score * 4), xp: 20 + score * 2,
        blurb: score >= 15 ? 'Escaped the Temple!' : 'Golden Idol Run!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); obstacles.forEach((o) => o.el.remove()); });
}

/* ---------------- 2. 8-BALL BILLIARDS ---------------- */
function openEightBallGame() {
  const shell = gameOverlayShell('eightballpool');
  const { board } = shell;
  board.innerHTML = `<div class="pool-table" style="position:relative;height:240px;background:#0d5c2e;border:10px solid #5c3a1e;border-radius:16px;overflow:hidden">
      <div style="position:absolute;top:6px;left:6px;font-size:24px">🕳️</div>
      <div style="position:absolute;top:6px;right:6px;font-size:24px">🕳️</div>
      <div style="position:absolute;bottom:6px;left:6px;font-size:24px">🕳️</div>
      <div style="position:absolute;bottom:6px;right:6px;font-size:24px">🕳️</div>
      <div class="pool-cueball" style="position:absolute;left:30%;top:50%;transform:translate(-50%,-50%);font-size:32px;cursor:pointer">⚪</div>
      <div class="pool-eightball" style="position:absolute;left:70%;top:50%;transform:translate(-50%,-50%);font-size:32px" data-target-ball>🎱</div>
    </div>${gameMiniSprite()}`;

  const cueBall = board.querySelector('.pool-cueball');
  const targetBall = board.querySelector('[data-target-ball]');
  let score = 0;

  cueBall.addEventListener('click', () => {
    cueBall.style.left = '65%';
    Sfx.pop();
    setTimeout(() => {
      targetBall.style.left = '90%';
      targetBall.style.top = '15%';
      Sfx.coin();
      score += 10;
      shell.scoreEl.textContent = score;
      burstOn(targetBall, ['🎱', '✨'], 8);

      setTimeout(() => {
        showGameResult(shell, {
          kind: 'eightballpool', score, coins: 75, xp: 40,
          blurb: 'Sunk the 8-Ball in the corner pocket!',
        });
      }, 700);
    }, 200);
  });
}

/* ---------------- 3. SLINGSHOT FLING (Angry Birds style) ---------------- */
function openSlingshotGame() {
  const shell = gameOverlayShell('slingshot');
  const { board } = shell;
  board.innerHTML = `<div class="sling-stage" style="position:relative;height:240px;background:linear-gradient(180deg,#7ec850,#3b8216);border-radius:12px;overflow:hidden">
      <div class="sling-bird" style="position:absolute;left:15%;bottom:30%;font-size:36px;cursor:pointer">🐦</div>
      <div class="sling-pig" style="position:absolute;right:15%;bottom:30%;font-size:42px" data-pig>🐷</div>
    </div>${gameMiniSprite()}`;

  const bird = board.querySelector('.sling-bird');
  const pig = board.querySelector('[data-pig]');
  let score = 0;

  bird.addEventListener('click', () => {
    bird.style.left = '80%';
    bird.style.bottom = '30%';
    Sfx.pop();
    setTimeout(() => {
      Sfx.win();
      score += 25;
      shell.scoreEl.textContent = score;
      burstOn(pig, ['💥', '🐷', '✨'], 10);
      pig.style.transform = 'scale(1.4) rotate(45deg)';
      pig.style.opacity = '0';

      setTimeout(() => {
        showGameResult(shell, {
          kind: 'slingshot', score, coins: 80, xp: 45,
          blurb: 'Direct Hit! Pig Fortress Tumbled!',
        });
      }, 700);
    }, 250);
  });
}

/* ---------------- 4. SNAKE SLITHER (Snake.io style) ---------------- */
function openSnakeSlitherGame() {
  const shell = gameOverlayShell('snakeslither');
  const { board } = shell;
  board.innerHTML = `<div class="snake-arena" style="position:relative;height:240px;background:#0f172a;border-radius:12px;overflow:hidden">
      <div class="snake-head" style="position:absolute;left:50%;top:50%;font-size:32px;transform:translate(-50%,-50%)">🐍</div>
    </div>${gameMiniSprite()}`;

  const arena = board.querySelector('.snake-arena');
  const head = board.querySelector('.snake-head');
  let score = 0;
  let running = true;
  let orbs = [];
  let startedAt = performance.now();
  const DURATION = 20000;

  function spawnOrb() {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:${rand(10, 90)}%;top:${rand(10, 90)}%;font-size:20px;cursor:pointer`;
    el.textContent = pick(['🔮', '✨', '🟡', '🟣']);
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!running) return;
      score += 1;
      Sfx.coin();
      burstOn(el, ['✨', '🔮'], 4);
      el.remove();
      shell.scoreEl.textContent = score;
    });
    arena.appendChild(el);
    orbs.push(el);
  }

  for (let i = 0; i < 6; i++) spawnOrb();

  let raf = 0;
  let lastSpawn = 0;
  function loop(now) {
    if (!running) return;
    if (now - lastSpawn > 800) {
      spawnOrb();
      lastSpawn = now;
    }
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'snakeslither', score, coins: Math.min(85, 12 + score * 3), xp: 20 + score * 2,
        blurb: score >= 15 ? 'Giant Slither Serpent!' : 'Great orb collection!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); orbs.forEach((o) => o.remove()); });
}

/* ---------------- 5. PLANT DEFENSE (PvZ style) ---------------- */
function openPlantDefenseGame() {
  const shell = gameOverlayShell('plantdefense');
  const { board } = shell;
  board.innerHTML = `<div class="pvz-lawn" style="position:relative;height:240px;background:linear-gradient(180deg,#15803d,#166534);border-radius:12px;overflow:hidden">
      <div style="position:absolute;left:10%;top:50%;transform:translateY(-50%);font-size:42px">🌱</div>
    </div>${gameMiniSprite()}`;

  const lawn = board.querySelector('.pvz-lawn');
  const zombies = ['🧟', '🧟‍♂️', '🧟‍♀️'];
  let score = 0;
  let running = true;
  let items = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  const DURATION = 22000;

  function spawnZombie() {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = pick(zombies);
    el.style.cssText = `position:absolute;right:-10%;top:${rand(20, 80)}%;font-size:36px;background:none;border:none;cursor:pointer`;
    const item = { el, x: 110, dead: false };

    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      if (!running || item.dead) return;
      item.dead = true;
      score += 1;
      Sfx.pop();
      burstOn(el, ['🫛', '💥', '✨'], 5);
      el.remove();
      shell.scoreEl.textContent = score;
    });
    lawn.appendChild(el);
    items.push(item);
  }

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (now - lastSpawn > 550) {
      spawnZombie();
      lastSpawn = now;
    }

    items.forEach((item) => {
      if (item.dead) return;
      item.x -= 30 * dt;
      item.el.style.right = `${100 - item.x}%`;
      if (item.x < 15) {
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
        kind: 'plantdefense', score, coins: Math.min(85, 12 + score * 3), xp: 20 + score * 2,
        blurb: score >= 15 ? 'Lawn Defended!' : 'The zombies were held off!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame((t) => { startedAt = t; last = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); items.forEach((i) => i.el.remove()); });
}

if (typeof openGame !== 'undefined') {
  const prevOpenGame3 = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'templeescape') openTempleEscapeGame();
    else if (kind === 'eightballpool') openEightBallGame();
    else if (kind === 'slingshot') openSlingshotGame();
    else if (kind === 'snakeslither') openSnakeSlitherGame();
    else if (kind === 'plantdefense') openPlantDefenseGame();
    else if (typeof prevOpenGame3 === 'function') prevOpenGame3(kind);
  };
}
