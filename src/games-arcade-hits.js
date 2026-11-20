/* Arcade & Mobile Hits Mini-Games:
   1. Paper.io Territory (paperio)
   2. Galaxia Starfighter (galaxia)
   3. Cookie Run Classic (cookierun)
   4. Dancing Road Color Match (dancingroad)
   5. Run Sausage Run! (sausagerun) */

const ARCADE_HITS_GAMES_INFO = {
  paperio: { title: 'Paper.io Territory', icon: '📐', tag: 'Paper Expansion', desc: 'Swipe or tap arrows to expand your territory! Complete loops back home!', g1: '#06b6d4', g2: '#f43f5e' },
  galaxia: { title: 'Galaxia Starfighter', icon: '🚀', tag: 'Space Arcade', desc: 'Steer starship, blast diving alien swarms with dual lasers, dodge plasma bombs!', g1: '#3b82f6', g2: '#eab308' },
  cookierun: { title: 'Cookie Run Classic', icon: '🍪', tag: 'Oven Escape', desc: 'Jump over fiery kitchen burners and slide under swinging spatulas!', g1: '#d97706', g2: '#ef4444' },
  dancingroad: { title: 'Dancing Road Color', icon: '🎵', tag: 'Color Match Run', desc: 'Steer the rolling ball into SAME-COLOR balls! Switch hues at color gates!', g1: '#ec4899', g2: '#8b5cf6' },
  sausagerun: { title: 'Run Sausage Run!', icon: '🌭', tag: 'Kitchen Gauntlet', desc: 'Tap & hold to BEND backwards and duck under swinging meat cleavers & saws!', g1: '#ea580c', g2: '#eab308' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, ARCADE_HITS_GAMES_INFO);

/* ---------------- 1. PAPER.IO TERRITORY (paperio) ---------------- */
function openPaperIoGame() {
  const shell = gameOverlayShell('paperio');
  const { board } = shell;

  const COLS = 12;
  const ROWS = 12;
  // 0 = neutral, 1 = player territory, 2 = player trail, 3 = bonus coin
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  // Starting territory in center
  for (let r = 5; r <= 6; r++) {
    for (let c = 5; c <= 6; c++) {
      grid[r][c] = 1;
    }
  }

  // Spawn some bonus gems
  for (let i = 0; i < 6; i++) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (grid[r][c] === 0) grid[r][c] = 3;
  }

  let playerR = 5;
  let playerC = 5;
  let dirR = 0;
  let dirC = 1;
  let trail = [];
  let score = 0;
  let running = true;
  let startedAt = performance.now();
  let raf = null;
  let lastStep = 0;
  const DURATION = 24000;

  board.innerHTML = `
    <div style="padding:10px;height:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box">
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700">
        <span style="color:#06b6d4" data-pct-lbl>Territory: 3%</span>
        <span style="color:#f43f5e" data-trail-lbl>Trail: 0</span>
      </div>

      <!-- Arena Grid -->
      <div class="paper-grid" style="display:grid;grid-template-columns:repeat(12,1fr);gap:2px;max-width:270px;margin:0 auto;width:100%;background:rgba(255,255,255,0.06);padding:4px;border-radius:10px;border:1px solid rgba(6,182,212,0.3)">
        ${Array.from({ length: ROWS * COLS }).map((_, idx) => `
          <div data-cell="${idx}" style="aspect-ratio:1;border-radius:2px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;font-size:10px"></div>
        `).join('')}
      </div>

      <!-- Direction Pad Controls -->
      <div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,40px);gap:6px;justify-content:center;margin:6px auto 0">
        <div></div>
        <button class="btn btn-outline btn-sm" data-dir="up" style="padding:0;font-size:16px">⬆️</button>
        <div></div>
        <button class="btn btn-outline btn-sm" data-dir="left" style="padding:0;font-size:16px">⬅️</button>
        <button class="btn btn-outline btn-sm" data-dir="down" style="padding:0;font-size:16px">⬇️</button>
        <button class="btn btn-outline btn-sm" data-dir="right" style="padding:0;font-size:16px">➡️</button>
      </div>
      <div class="tiny muted" style="text-align:center">Loop outside and return home to claim land!</div>
    </div>
    ${gameMiniSprite()}`;

  const pctLbl = board.querySelector('[data-pct-lbl]');
  const trailLbl = board.querySelector('[data-trail-lbl]');
  const cells = board.querySelectorAll('[data-cell]');

  function updateVisuals() {
    let owned = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const cell = cells[idx];
        const val = grid[r][c];
        const isPlayer = (r === playerR && c === playerC);

        if (isPlayer) {
          cell.style.background = '#f43f5e';
          cell.textContent = '📐';
        } else if (val === 1) {
          cell.style.background = 'rgba(6,182,212,0.45)';
          cell.textContent = '';
          owned++;
        } else if (val === 2) {
          cell.style.background = 'rgba(244,63,94,0.6)';
          cell.textContent = '·';
        } else if (val === 3) {
          cell.style.background = 'transparent';
          cell.textContent = '💎';
        } else {
          cell.style.background = 'rgba(255,255,255,0.03)';
          cell.textContent = '';
        }
      }
    }
    const pct = Math.round((owned / (ROWS * COLS)) * 100);
    pctLbl.textContent = `Territory: ${pct}%`;
    trailLbl.textContent = `Trail: ${trail.length}`;
    shell.scoreEl.textContent = `${score}`;
  }

  function setDir(r, c) {
    if (!running) return;
    if (r !== -dirR || c !== -dirC) {
      dirR = r;
      dirC = c;
      if (typeof Sfx !== 'undefined') Sfx.tick();
    }
  }

  board.querySelector('[data-dir="up"]').addEventListener('click', () => setDir(-1, 0));
  board.querySelector('[data-dir="down"]').addEventListener('click', () => setDir(1, 0));
  board.querySelector('[data-dir="left"]').addEventListener('click', () => setDir(0, -1));
  board.querySelector('[data-dir="right"]').addEventListener('click', () => setDir(0, 1));

  const onKey = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setDir(-1, 0);
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setDir(1, 0);
    else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setDir(0, -1);
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setDir(0, 1);
  };
  window.addEventListener('keydown', onKey);

  function stepPlayer() {
    const nextR = Math.max(0, Math.min(ROWS - 1, playerR + dirR));
    const nextC = Math.max(0, Math.min(COLS - 1, playerC + dirC));
    playerR = nextR;
    playerC = nextC;

    const currentVal = grid[playerR][playerC];
    if (currentVal === 3) {
      // Bonus gem
      score += 150;
      burstOn(cells[playerR * COLS + playerC], ['💎', '✨'], 3);
      if (typeof Sfx !== 'undefined') Sfx.pop();
    }

    if (currentVal === 1) {
      // Returned home! Claim all trail!
      if (trail.length > 0) {
        let claimedCount = trail.length;
        trail.forEach(([tr, tc]) => {
          grid[tr][tc] = 1;
        });
        // Bonus points for claiming
        score += claimedCount * 80;
        trail = [];
        if (typeof Sfx !== 'undefined') Sfx.chime ? Sfx.chime() : Sfx.tone(600, 0.2, 'sine', 0.15);
      }
    } else {
      // Stepping in wild: leave trail
      grid[playerR][playerC] = 2;
      trail.push([playerR, playerC]);
    }
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (now - lastStep > 220) {
      stepPlayer();
      updateVisuals();
      lastStep = now;
    }

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'paperio',
        score,
        coins: Math.round(score * 1.3),
        xp: 130,
        blurb: score >= 1200 ? 'Territory Master of Paper Hollow!' : 'Grand Paper Expedition!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  updateVisuals();
  raf = requestAnimationFrame((t) => { startedAt = t; lastStep = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
  });
}

/* ---------------- 2. GALAXIA STARFIGHTER (galaxia) ---------------- */
function openGalaxiaGame() {
  const shell = gameOverlayShell('galaxia');
  const { board } = shell;

  board.innerHTML = `
    <div class="galaxia-field" style="position:relative;height:260px;background:radial-gradient(circle at center,#0b1536 0%,#030717 100%);border-radius:12px;overflow:hidden;border:1px solid rgba(59,130,246,0.3);user-select:none">
      <div style="position:absolute;top:8px;left:10px;font-size:12px;color:#60a5fa;font-weight:700" data-gal-wave>Wave 1: Insect Swarm</div>
      <div style="position:absolute;top:8px;right:10px;font-size:12px;color:#facc15;font-weight:700" data-gal-kills>Kills: 0</div>

      <!-- Player Ship -->
      <div class="gal-ship" style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);font-size:26px;pointer-events:none;transition:left .08s ease-out">
        🚀
      </div>

      <!-- Touch Controls -->
      <div style="position:absolute;bottom:8px;left:8px;right:8px;display:flex;justify-content:space-between;pointer-events:none">
        <button class="btn btn-soft btn-sm" data-act="left" style="pointer-events:auto;font-size:16px;padding:6px 16px">◀️ Left</button>
        <button class="btn btn-soft btn-sm" data-act="right" style="pointer-events:auto;font-size:16px;padding:6px 16px">Right ▶️</button>
      </div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Dual photon lasers auto-fire! Steer to blast diving Galaga alien bugs!</span>
    </div>
    ${gameMiniSprite()}`;

  const field = board.querySelector('.galaxia-field');
  const ship = board.querySelector('.gal-ship');
  const waveLbl = board.querySelector('[data-gal-wave]');
  const killsLbl = board.querySelector('[data-gal-kills]');

  let shipX = 50; // percentage
  let score = 0;
  let kills = 0;
  let running = true;
  let startedAt = performance.now();
  let lastShot = 0;
  let lastSpawn = 0;
  let bullets = [];
  let enemies = [];
  let raf = null;
  const DURATION = 24000;

  function move(delta) {
    if (!running) return;
    shipX = Math.max(10, Math.min(90, shipX + delta));
    ship.style.left = `${shipX}%`;
  }

  board.querySelector('[data-act="left"]').addEventListener('click', () => move(-12));
  board.querySelector('[data-act="right"]').addEventListener('click', () => move(12));

  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move(-10);
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') move(10);
  };
  window.addEventListener('keydown', onKey);

  function shoot() {
    // Twin lasers
    const offsets = [-8, 8];
    offsets.forEach(off => {
      const b = document.createElement('div');
      b.style.cssText = `position:absolute;bottom:42px;left:calc(${shipX}% + ${off}px);width:3px;height:12px;background:#38bdf8;border-radius:2px;box-shadow:0 0 6px #38bdf8;pointer-events:none`;
      field.appendChild(b);
      bullets.push({ el: b, x: shipX, y: 42, dead: false });
    });
    if (typeof Sfx !== 'undefined') Sfx.tone(850, 0.06, 'sawtooth', 0.08);
  }

  function spawnEnemy() {
    const isBoss = Math.random() < 0.25;
    const icons = isBoss ? ['🛸', '👾'] : ['🐝', '🪲', '🦟'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const el = document.createElement('div');
    const startX = 15 + Math.random() * 70;
    el.style.cssText = `position:absolute;top:-30px;left:${startX}%;font-size:${isBoss ? '26px' : '20px'};pointer-events:none;transform:translateX(-50%)`;
    el.textContent = icon;
    field.appendChild(el);
    enemies.push({ el, x: startX, y: -30, isBoss, speed: isBoss ? 65 : 85, dead: false });
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    // Waves
    if (elapsed > 16000) waveLbl.textContent = 'Stage 3: Challenging Stage!';
    else if (elapsed > 8000) waveLbl.textContent = 'Stage 2: Boss Swarm!';

    // Auto shoot
    if (now - lastShot > 280) {
      shoot();
      lastShot = now;
    }

    // Spawn aliens
    if (now - lastSpawn > 550) {
      spawnEnemy();
      lastSpawn = now;
    }

    const dt = 0.016;

    // Bullets upward
    bullets.forEach(b => {
      if (b.dead) return;
      b.y += 320 * dt;
      b.el.style.bottom = `${b.y}px`;
      if (b.y > 270) {
        b.dead = true;
        b.el.remove();
      }
    });

    // Enemies downward
    enemies.forEach(e => {
      if (e.dead) return;
      e.y += e.speed * dt;
      e.el.style.top = `${e.y}px`;

      // Check collision with bullets
      const eBottomPx = 260 - e.y;
      bullets.forEach(b => {
        if (b.dead || e.dead) return;
        if (Math.abs(b.x - e.x) < 8 && Math.abs(b.y - eBottomPx) < 18) {
          b.dead = true;
          b.el.remove();
          e.dead = true;
          e.el.remove();
          kills++;
          killsLbl.textContent = `Kills: ${kills}`;
          const pts = e.isBoss ? 200 : 90;
          score += pts;
          shell.scoreEl.textContent = `${score}`;
          burstOn(field, ['💥', '✨'], 4);
          if (typeof Sfx !== 'undefined') Sfx.tone(400, 0.12, 'square', 0.14, 0, -100);
        }
      });

      if (e.y > 270) {
        e.dead = true;
        e.el.remove();
      }
    });

    bullets = bullets.filter(b => !b.dead);
    enemies = enemies.filter(e => !e.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'galaxia',
        score,
        coins: Math.round(score * 1.4),
        xp: 140,
        blurb: kills >= 20 ? 'Galaxia Fleet Legend!' : 'Heroic Space Defense!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; lastShot = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    bullets.forEach(b => b.el.remove());
    enemies.forEach(e => e.el.remove());
  });
}

/* ---------------- 3. COOKIE RUN CLASSIC (cookierun) ---------------- */
function openCookieRunGame() {
  const shell = gameOverlayShell('cookierun');
  const { board } = shell;

  board.innerHTML = `
    <div class="cookie-track" style="position:relative;height:240px;background:linear-gradient(180deg,#78350f,#291004);border-radius:12px;overflow:hidden;border:1px solid rgba(217,119,6,0.3);user-select:none">
      <div style="position:absolute;top:8px;left:10px;font-size:12px;color:#fde047;font-weight:700">Witch’s Fiery Oven Escape</div>

      <!-- Floor -->
      <div style="position:absolute;bottom:0;width:100%;height:35px;background:#451a03;border-top:2px solid #d97706"></div>

      <!-- GingerBrave -->
      <div class="cookie-runner" style="position:absolute;bottom:35px;left:18%;font-size:32px;transition:bottom .12s, transform .1s;pointer-events:none">
        🍪
      </div>

      <!-- Jump & Slide Controls -->
      <div style="position:absolute;bottom:8px;right:10px;display:flex;gap:8px">
        <button class="btn btn-gold btn-sm" data-act="jump" style="padding:6px 14px;font-weight:700">⬆️ Jump</button>
        <button class="btn btn-soft btn-sm" data-act="slide" style="padding:6px 14px;font-weight:700">⬇️ Slide</button>
      </div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Jump over kitchen fires and slide under spatulas! Collect jelly beans!</span>
    </div>
    ${gameMiniSprite()}`;

  const track = board.querySelector('.cookie-track');
  const runner = board.querySelector('.cookie-runner');

  let score = 0;
  let running = true;
  let isJumping = false;
  let isSliding = false;
  let obstacles = [];
  let items = [];
  let startedAt = performance.now();
  let lastSpawn = 0;
  let raf = null;
  const DURATION = 24000;

  function doJump() {
    if (!running || isJumping) return;
    isJumping = true;
    runner.style.bottom = '115px';
    if (typeof Sfx !== 'undefined') Sfx.tone(550, 0.2, 'sine', 0.15, 0, 100);
    setTimeout(() => {
      runner.style.bottom = '35px';
      setTimeout(() => { isJumping = false; }, 180);
    }, 400);
  }

  function doSlide() {
    if (!running || isSliding || isJumping) return;
    isSliding = true;
    runner.style.transform = 'scaleY(0.5) translateY(16px)';
    if (typeof Sfx !== 'undefined') Sfx.tick();
    setTimeout(() => {
      runner.style.transform = 'scaleY(1) translateY(0)';
      isSliding = false;
    }, 450);
  }

  board.querySelector('[data-act="jump"]').addEventListener('click', doJump);
  board.querySelector('[data-act="slide"]').addEventListener('click', doSlide);

  const onKey = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') doJump();
    else if (e.key === 'ArrowDown' || e.key === 's') doSlide();
  };
  window.addEventListener('keydown', onKey);

  function spawnObjects() {
    // Spawns jellies or obstacles
    const r = Math.random();
    if (r < 0.45) {
      // Jelly bean item
      const jType = Math.random() < 0.3 ? 'bear' : 'jelly';
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;bottom:${jType === 'bear' ? '90px' : '45px'};right:-10%;font-size:22px;pointer-events:none`;
      el.textContent = jType === 'bear' ? '🐻' : '🍬';
      track.appendChild(el);
      items.push({ el, x: 110, pts: jType === 'bear' ? 140 : 60, dead: false });
    } else {
      // Obstacle: high (spatula, slide under) or low (fire, jump over)
      const isHigh = Math.random() < 0.5;
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;bottom:${isHigh ? '95px' : '35px'};right:-10%;font-size:26px;pointer-events:none`;
      el.textContent = isHigh ? '🍴' : '🔥';
      track.appendChild(el);
      obstacles.push({ el, x: 110, isHigh, dead: false });
    }
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    score += 1;
    shell.scoreEl.textContent = `${score}`;

    if (now - lastSpawn > 550) {
      spawnObjects();
      lastSpawn = now;
    }

    const dt = 0.016;

    // Move jellies
    items.forEach(it => {
      if (it.dead) return;
      it.x -= 70 * dt;
      it.el.style.right = `${100 - it.x}%`;
      // Check collection
      if (it.x >= 14 && it.x <= 24) {
        it.dead = true;
        it.el.remove();
        score += it.pts;
        burstOn(runner, ['✨', '🍬'], 3);
        if (typeof Sfx !== 'undefined') Sfx.pop();
      }
      if (it.x < 0) {
        it.dead = true;
        it.el.remove();
      }
    });

    // Move obstacles
    obstacles.forEach(ob => {
      if (ob.dead) return;
      ob.x -= 70 * dt;
      ob.el.style.right = `${100 - ob.x}%`;
      // Check collision
      if (ob.x >= 15 && ob.x <= 22) {
        let hit = false;
        if (ob.isHigh && !isSliding) hit = true;
        if (!ob.isHigh && !isJumping) hit = true;
        if (hit) {
          ob.dead = true;
          ob.el.remove();
          score = Math.max(0, score - 80);
          if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
        }
      }
      if (ob.x < 0) {
        ob.dead = true;
        ob.el.remove();
      }
    });

    items = items.filter(i => !i.dead);
    obstacles = obstacles.filter(o => !o.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'cookierun',
        score,
        coins: Math.round(score * 1.3),
        xp: 130,
        blurb: score >= 1500 ? 'Epic Cookie Oven Escape!' : 'Spirited Cookie Sprint!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    items.forEach(i => i.el.remove());
    obstacles.forEach(o => o.el.remove());
  });
}

/* ---------------- 4. DANCING ROAD COLOR MATCH (dancingroad) ---------------- */
function openDancingRoadGame() {
  const shell = gameOverlayShell('dancingroad');
  const { board } = shell;

  const COLORS = [
    { name: 'Red', hex: '#ef4444', emoji: '🔴' },
    { name: 'Blue', hex: '#3b82f6', emoji: '🔵' },
    { name: 'Yellow', hex: '#eab308', emoji: '🟡' },
  ];

  let playerColorIdx = 0; // Starts Red
  let laneIdx = 1; // 0, 1, 2
  const LANES_PCT = [20, 50, 80];

  board.innerHTML = `
    <div class="dr-road" style="position:relative;height:260px;background:radial-gradient(ellipse at bottom,#1e112a 0%,#0c0612 100%);border-radius:12px;overflow:hidden;border:1px solid rgba(236,72,153,0.3);user-select:none">
      <div style="position:absolute;top:8px;left:10px;font-size:12px;color:#ec4899;font-weight:700" data-dr-color>Color: 🔴 Red Ball</div>
      <div style="position:absolute;top:8px;right:10px;font-size:12px;color:#a855f7;font-weight:700" data-dr-combo>Combo: 0</div>

      <!-- 3 Lane Guidelines -->
      <div style="position:absolute;inset:0;pointer-events:none;display:flex;opacity:0.25">
        <div style="flex:1;border-right:1px dashed #ec4899"></div>
        <div style="flex:1;border-right:1px dashed #ec4899"></div>
        <div style="flex:1"></div>
      </div>

      <!-- Player Ball -->
      <div class="dr-ball" style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);width:36px;height:36px;border-radius:50%;background:#ef4444;box-shadow:0 0 16px #ef4444;transition:left .1s ease-out, background .2s;display:flex;align-items:center;justify-content:center;font-size:16px;pointer-events:none">
        🔴
      </div>

      <!-- Controls -->
      <div style="position:absolute;bottom:8px;left:8px;right:8px;display:flex;justify-content:space-between;pointer-events:none">
        <button class="btn btn-soft btn-sm" data-act="left" style="pointer-events:auto;font-size:16px;padding:6px 16px">◀️ Left</button>
        <button class="btn btn-soft btn-sm" data-act="right" style="pointer-events:auto;font-size:16px;padding:6px 16px">Right ▶️</button>
      </div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Hit matching colored balls! Color Gates switch your ball’s hue!</span>
    </div>
    ${gameMiniSprite()}`;

  const road = board.querySelector('.dr-road');
  const ball = board.querySelector('.dr-ball');
  const colorLbl = board.querySelector('[data-dr-color]');
  const comboLbl = board.querySelector('[data-dr-combo]');

  let score = 0;
  let combo = 0;
  let running = true;
  let startedAt = performance.now();
  let lastSpawn = 0;
  let items = [];
  let raf = null;
  const DURATION = 24000;

  function updatePlayerVisual() {
    const c = COLORS[playerColorIdx];
    ball.style.background = c.hex;
    ball.style.boxShadow = `0 0 16px ${c.hex}`;
    ball.textContent = c.emoji;
    colorLbl.textContent = `Color: ${c.emoji} ${c.name} Ball`;
  }

  function moveLeft() {
    if (!running) return;
    if (laneIdx > 0) {
      laneIdx--;
      ball.style.left = `${LANES_PCT[laneIdx]}%`;
      if (typeof Sfx !== 'undefined') Sfx.tick();
    }
  }

  function moveRight() {
    if (!running) return;
    if (laneIdx < LANES_PCT.length - 1) {
      laneIdx++;
      ball.style.left = `${LANES_PCT[laneIdx]}%`;
      if (typeof Sfx !== 'undefined') Sfx.tick();
    }
  }

  board.querySelector('[data-act="left"]').addEventListener('click', moveLeft);
  board.querySelector('[data-act="right"]').addEventListener('click', moveRight);

  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
  };
  window.addEventListener('keydown', onKey);

  function spawnItem() {
    // 25% chance of color gate across lanes, else color ball
    if (Math.random() < 0.22) {
      // Color Gate
      const targetColor = (playerColorIdx + 1 + Math.floor(Math.random() * 2)) % 3;
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;top:-25px;left:5%;width:90%;height:14px;background:linear-gradient(90deg,transparent,${COLORS[targetColor].hex},transparent);border-top:2px solid ${COLORS[targetColor].hex};border-bottom:2px solid ${COLORS[targetColor].hex};pointer-events:none;text-align:center;font-size:10px;color:#fff;font-weight:700`;
      el.textContent = `GATE ➔ ${COLORS[targetColor].emoji}`;
      road.appendChild(el);
      items.push({ el, isGate: true, colorIdx: targetColor, y: -25, dead: false });
    } else {
      // Color ball
      const lane = Math.floor(Math.random() * 3);
      // Biased to create matches
      const isMatch = Math.random() < 0.55;
      const colorIdx = isMatch ? playerColorIdx : Math.floor(Math.random() * 3);
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;top:-30px;left:${LANES_PCT[lane]}%;transform:translateX(-50%);font-size:20px;pointer-events:none`;
      el.textContent = COLORS[colorIdx].emoji;
      road.appendChild(el);
      items.push({ el, isGate: false, lane, colorIdx, y: -30, dead: false });
    }
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (now - lastSpawn > 500) {
      spawnItem();
      lastSpawn = now;
    }

    const dt = 0.016;
    items.forEach(it => {
      if (it.dead) return;
      it.y += 180 * dt;
      it.el.style.top = `${it.y}px`;

      // Check collision
      if (it.isGate) {
        if (it.y >= 200 && it.y <= 225) {
          it.dead = true;
          it.el.remove();
          playerColorIdx = it.colorIdx;
          updatePlayerVisual();
          burstOn(ball, ['🌈', '✨'], 6);
          if (typeof Sfx !== 'undefined') Sfx.chime ? Sfx.chime() : Sfx.tone(700, 0.2, 'sine', 0.15);
        }
      } else {
        if (it.y >= 195 && it.y <= 235 && it.lane === laneIdx) {
          it.dead = true;
          it.el.remove();
          if (it.colorIdx === playerColorIdx) {
            combo++;
            score += 100 + combo * 15;
            comboLbl.textContent = `Combo: ${combo}`;
            shell.scoreEl.textContent = `${score}`;
            burstOn(ball, ['⭐', '✨'], 4);
            if (typeof Sfx !== 'undefined') Sfx.tone(440 + (combo % 8) * 55, 0.12, 'triangle', 0.15);
          } else {
            combo = 0;
            comboLbl.textContent = `Combo: 0`;
            if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
          }
        }
      }

      if (it.y > 270) {
        it.dead = true;
        it.el.remove();
      }
    });

    items = items.filter(it => !it.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'dancingroad',
        score,
        coins: Math.round(score * 1.3),
        xp: 130,
        blurb: score >= 1400 ? 'Dancing Road Rhythm Master!' : 'Harmonic Color Roller!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  updatePlayerVisual();
  raf = requestAnimationFrame((t) => { startedAt = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    items.forEach(it => it.el.remove());
  });
}

/* ---------------- 5. RUN SAUSAGE RUN! (sausagerun) ---------------- */
function openSausageRunGame() {
  const shell = gameOverlayShell('sausagerun');
  const { board } = shell;

  board.innerHTML = `
    <div class="sausage-track" style="position:relative;height:240px;background:linear-gradient(180deg,#451a03,#1a0902);border-radius:12px;overflow:hidden;border:1px solid rgba(234,88,12,0.3);user-select:none">
      <div style="position:absolute;top:8px;left:10px;font-size:12px;color:#f97316;font-weight:700">Kitchen Gauntlet · Run for Your Life!</div>

      <!-- Countertop Floor -->
      <div style="position:absolute;bottom:0;width:100%;height:35px;background:#78350f;border-top:2px solid #ea580c"></div>

      <!-- Hotdog Runner -->
      <div class="sausage-runner" style="position:absolute;bottom:35px;left:20%;font-size:34px;transition:transform .1s;transform-origin:bottom center;pointer-events:none">
        🌭
      </div>

      <!-- Bend & Duck Hold Button -->
      <div style="position:absolute;bottom:8px;right:10px">
        <button class="btn btn-gold btn-sm" data-bend-btn style="padding:8px 18px;font-weight:800;font-size:14px">
          ↩️ HOLD TO BEND!
        </button>
      </div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Hold button to BEND backwards and duck under meat cleavers & spinning saws!</span>
    </div>
    ${gameMiniSprite()}`;

  const track = board.querySelector('.sausage-track');
  const runner = board.querySelector('.sausage-runner');
  const bendBtn = board.querySelector('[data-bend-btn]');

  let score = 0;
  let isBending = false;
  let running = true;
  let obstacles = [];
  let condiments = [];
  let startedAt = performance.now();
  let lastSpawn = 0;
  let raf = null;
  const DURATION = 24000;

  function setBend(val) {
    if (!running) return;
    isBending = val;
    if (val) {
      runner.style.transform = 'rotate(-55deg) scaleY(0.7) translateY(8px)';
      if (typeof Sfx !== 'undefined') Sfx.tick();
    } else {
      runner.style.transform = 'rotate(0deg) scaleY(1) translateY(0)';
    }
  }

  bendBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); setBend(true); });
  bendBtn.addEventListener('pointerup', (e) => { e.preventDefault(); setBend(false); });
  bendBtn.addEventListener('pointerleave', () => setBend(false));

  const onKeyDown = (e) => { if (e.key === ' ' || e.key === 'ArrowDown') setBend(true); };
  const onKeyUp = (e) => { if (e.key === ' ' || e.key === 'ArrowDown') setBend(false); };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  function spawnObjects() {
    if (Math.random() < 0.45) {
      // Mustard condiment drop
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;bottom:42px;right:-10%;font-size:22px;pointer-events:none`;
      el.textContent = '⭐';
      track.appendChild(el);
      condiments.push({ el, x: 110, dead: false });
    } else {
      // Hazard: swinging cleaver (high) or floor grill (low)
      const isHigh = Math.random() < 0.6;
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;${isHigh ? 'bottom:85px' : 'bottom:35px'};right:-10%;font-size:28px;pointer-events:none`;
      el.textContent = isHigh ? '🔪' : '🔥';
      track.appendChild(el);
      obstacles.push({ el, x: 110, isHigh, dead: false });
    }
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    score += 1;
    shell.scoreEl.textContent = `${score}`;

    if (now - lastSpawn > 550) {
      spawnObjects();
      lastSpawn = now;
    }

    const dt = 0.016;

    // Move condiments
    condiments.forEach(c => {
      if (c.dead) return;
      c.x -= 70 * dt;
      c.el.style.right = `${100 - c.x}%`;
      if (c.x >= 16 && c.x <= 24) {
        c.dead = true;
        c.el.remove();
        score += 90;
        burstOn(runner, ['🌭', '✨'], 3);
        if (typeof Sfx !== 'undefined') Sfx.pop();
      }
      if (c.x < 0) {
        c.dead = true;
        c.el.remove();
      }
    });

    // Move obstacles
    obstacles.forEach(ob => {
      if (ob.dead) return;
      ob.x -= 70 * dt;
      ob.el.style.right = `${100 - ob.x}%`;
      if (ob.x >= 16 && ob.x <= 23) {
        let hit = false;
        // Cleavers hit if upright (not bending!)
        if (ob.isHigh && !isBending) hit = true;
        if (!ob.isHigh && isBending) hit = true;
        if (hit) {
          ob.dead = true;
          ob.el.remove();
          score = Math.max(0, score - 80);
          if (typeof Sfx !== 'undefined') Sfx.error();
        }
      }
      if (ob.x < 0) {
        ob.dead = true;
        ob.el.remove();
      }
    });

    condiments = condiments.filter(c => !c.dead);
    obstacles = obstacles.filter(o => !o.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'sausagerun',
        score,
        coins: Math.round(score * 1.3),
        xp: 130,
        blurb: score >= 1300 ? 'Kitchen Gauntlet Survivor!' : 'Sizzling Sausage Runner!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    condiments.forEach(c => c.el.remove());
    obstacles.forEach(o => o.el.remove());
  });
}

/* ---------------- 6. CART SURFER ---------------- */
const CARTSURFER_INFO = {
  cartsurfer: { title: 'Cart Surfer', icon: '🛒', tag: 'Lane run', desc: 'Swap rails to scoop coins and dodge crates. Three hits ends the ride.', g1: '#ff8a3a', g2: '#ffd166' },
};
if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, CARTSURFER_INFO);

function openCartSurferGame() {
  const shell = gameOverlayShell('cartsurfer');
  const { board } = shell;
  board.innerHTML = `<div data-track style="position:relative;height:100%;min-height:300px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#2a1d3f,#171029 55%,#0d0a18)">
      <div style="position:absolute;inset:40% 0 0 0;background:repeating-linear-gradient(90deg,transparent 0 32%,rgba(255,255,255,.07) 32% 33%)"></div>
      <div data-cart style="position:absolute;bottom:52px;left:50%;transform:translateX(-50%);font-size:36px;transition:left .1s">🛒</div>
      <div data-hits style="position:absolute;left:12px;top:10px;font-size:12px;color:#ffd166">hits 0 / 3</div>
      <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:space-between;padding:0 12px">
        <button data-left style="width:72px;height:38px;border-radius:999px;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:16px" aria-label="Move left">◀</button>
        <button data-right style="width:72px;height:38px;border-radius:999px;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:16px" aria-label="Move right">▶</button>
      </div>
    </div>`;
  const track = board.querySelector('[data-track]');
  const cart = board.querySelector('[data-cart]');
  const hitsEl = board.querySelector('[data-hits]');
  const LANES = [22, 50, 78];
  const DURATION = 22000;
  let lane = 1;
  let hits = 0;
  let coins = 0;
  let running = true;
  let startedAt = performance.now();
  let raf = 0;
  let last = 0;
  let spawnAt = 0;
  let items = [];

  const move = (dir) => {
    if (!running) return;
    lane = Math.max(0, Math.min(LANES.length - 1, lane + dir));
    cart.style.left = `${LANES[lane]}%`;
    Sfx.click();
  };
  board.querySelector('[data-left]').addEventListener('click', () => move(-1));
  board.querySelector('[data-right]').addEventListener('click', () => move(1));

  const spawn = () => {
    const isCoin = Math.random() < 0.6;
    const laneIdx = Math.floor(rand(0, LANES.length));
    const el = document.createElement('div');
    el.textContent = isCoin ? '🪙' : pick(['🧊', '📦', '🛢️']);
    el.style.cssText = `position:absolute;left:104%;bottom:${44 + Math.round(rand(0, 46))}px;font-size:24px;transition:left .05s linear`;
    track.appendChild(el);
    items.push({ el, coin: isCoin, lane: laneIdx, x: 104 });
  };

  const finish = (crashed) => {
    if (!running) return;
    running = false;
    items.forEach((it) => it.el.remove());
    items = [];
    showGameResult(shell, {
      kind: 'cartsurfer', score: coins,
      coins: Math.min(90, 12 + coins * 3), xp: 18 + coins * 3,
      blurb: crashed ? `The cart tipped over after ${coins} coins.` : 'A clean run down the whole track!',
    });
  };

  const loop = (t) => {
    if (!running) return;
    const dt = last ? Math.min(70, t - last) : 16;
    last = t;
    const left = Math.max(0, DURATION - (t - startedAt));
    if (left <= 0) return finish(false);
    if (t - spawnAt > 640) { spawnAt = t; spawn(); }
    items.forEach((it) => {
      it.x -= dt * 0.058;
      it.el.style.left = `${it.x}%`;
      if (!it.done && it.x <= 26 && it.x >= 14 && it.lane === lane) {
        it.done = true;
        if (it.coin) {
          coins += 1;
          Sfx.coin();
          burstOn(it.el, ['✨'], 3);
        } else {
          hits += 1;
          hitsEl.textContent = `hits ${hits} / 3`;
          Sfx.error();
          burstOn(it.el, ['💥'], 4);
        }
        it.el.remove();
      }
      if (it.x < -10) { it.done = true; it.el.remove(); }
    });
    items = items.filter((it) => !it.done);
    shell.scoreEl.textContent = coins;
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (hits >= 3) return finish(true);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); items.forEach((it) => it.el.remove()); });
}

/* Hook openGame for all 5 new arcade & mobile hit mini-games */
if (typeof openGame !== 'undefined') {
  const prevOpenGameArcadeHits = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'cartsurfer') openCartSurferGame();
    else if (kind === 'paperio') openPaperIoGame();
    else if (kind === 'galaxia') openGalaxiaGame();
    else if (kind === 'cookierun') openCookieRunGame();
    else if (kind === 'dancingroad') openDancingRoadGame();
    else if (kind === 'sausagerun') openSausageRunGame();
    else if (typeof prevOpenGameArcadeHits === 'function') prevOpenGameArcadeHits(kind);
  };
}
