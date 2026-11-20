/* Ember & Tide Temple: a two-character puzzle platformer. Both elemental
   sprites must reach their own door. Each can cross its own pool, the other
   pool sends both back to the start, and a pressure plate opens the gate. */

Object.assign(GAME_INFO, {
  temple: {
    title: 'Ember & Tide Temple',
    icon: '🏛️',
    tag: 'Co-op puzzle',
    desc: 'Switch between ember and tide sprites, cross your element, and reach both doors.',
    g1: '#ff8a5c',
    g2: '#38bdf8',
  },
});

const TEMPLE_LEVEL_ROWS = [
  [
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#...*..o...#',
    '#...####...#',
    '#E.......T.#',
    '#t..wwff.e.#',
    '############',
  ],
  [
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#....=.....#',
    '#....=.....#',
    '#E.*.=..o.T#',
    '#t.S.=...e.#',
    '############',
  ],
  [
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#...*.=o...#',
    '#...##=##..#',
    '#E........T#',
    '#t.Sww=ff.e#',
    '############',
  ],
];
const TEMPLE_LEVEL_NAMES = ['Twin Doors', 'The Sealed Gate', 'Crossed Elements'];
const TEMPLE_ELEMENTS = {
  ember: { name: 'Ember', icon: '🔥', color: '#ff8a5c', soft: '#ffd0b8' },
  tide: { name: 'Tide', icon: '💧', color: '#5ad6ff', soft: '#c2f0ff' },
};
const TEMPLE_GEM_TOTAL = 6;

function templeParse(rows) {
  const level = {
    rows,
    width: rows[0].length,
    height: rows.length,
    emberStart: null,
    tideStart: null,
    doors: {},
    gems: [],
    pools: [],
    switchTile: null,
    gateTiles: [],
  };
  rows.forEach((line, row) => {
    [...line].forEach((tile, col) => {
      if (tile === 'E') level.emberStart = { col, row };
      else if (tile === 'T') level.tideStart = { col, row };
      else if (tile === 'e') level.doors.ember = { col, row };
      else if (tile === 't') level.doors.tide = { col, row };
      else if (tile === '*') level.gems.push({ element: 'ember', col, row, got: false });
      else if (tile === 'o') level.gems.push({ element: 'tide', col, row, got: false });
      else if (tile === 'f') level.pools.push({ element: 'ember', col, row });
      else if (tile === 'w') level.pools.push({ element: 'tide', col, row });
      else if (tile === 'S') level.switchTile = { col, row };
      else if (tile === '=') level.gateTiles.push({ col, row });
    });
  });
  return level;
}

function templeSolidAt(level, col, row, gateOpen) {
  if (col < 0 || col >= level.width || row < 0 || row >= level.height) return true;
  const tile = level.rows[row][col];
  return tile === '#' || (tile === '=' && !gateOpen);
}

function templeOverlap(c, col, row) {
  return c.x < col + 1 && c.x + c.w > col && c.y < row + 1 && c.y + c.h > row;
}

function templeMakeChar(element, start) {
  const w = 0.62;
  const h = 0.86;
  return {
    element,
    w,
    h,
    x: start.col + 0.5 - w / 2,
    y: start.row + 1 - h,
    vx: 0,
    vy: 0,
    onGround: false,
    atDoor: false,
  };
}

function templeMove(c, level, gateOpen, dt) {
  c.onGround = false;
  c.x += c.vx * dt;
  const top = Math.floor(c.y + 0.001);
  const bottom = Math.floor(c.y + c.h - 0.001);
  if (c.vx > 0) {
    const col = Math.floor(c.x + c.w - 0.001);
    for (let row = top; row <= bottom; row += 1) {
      if (templeSolidAt(level, col, row, gateOpen)) {
        c.x = col - c.w;
        c.vx = 0;
        break;
      }
    }
  } else if (c.vx < 0) {
    const col = Math.floor(c.x);
    for (let row = top; row <= bottom; row += 1) {
      if (templeSolidAt(level, col, row, gateOpen)) {
        c.x = col + 1;
        c.vx = 0;
        break;
      }
    }
  }
  c.x = Math.max(0, Math.min(level.width - c.w, c.x));

  c.y += c.vy * dt;
  const left = Math.floor(c.x + 0.001);
  const right = Math.floor(c.x + c.w - 0.001);
  if (c.vy > 0) {
    const row = Math.floor(c.y + c.h - 0.001);
    for (let col = left; col <= right; col += 1) {
      if (templeSolidAt(level, col, row, gateOpen)) {
        c.y = row - c.h;
        c.vy = 0;
        c.onGround = true;
        break;
      }
    }
  } else if (c.vy < 0) {
    const row = Math.floor(c.y);
    for (let col = left; col <= right; col += 1) {
      if (templeSolidAt(level, col, row, gateOpen)) {
        c.y = row + 1;
        c.vy = 0;
        break;
      }
    }
  }
  c.y = Math.max(0, Math.min(level.height - c.h, c.y));
}

function openElementalTempleGame() {
  const shell = gameOverlayShell('temple');
  const { board } = shell;
  const canvas = document.createElement('canvas');
  canvas.className = 'temple-canvas';
  canvas.setAttribute('data-temple-canvas', '');
  canvas.setAttribute('aria-label', 'Ember and Tide temple puzzle');
  board.innerHTML = `<div class="temple-wrap">
    <canvas class="temple-canvas" data-temple-canvas aria-label="Ember and Tide temple puzzle"></canvas>
    <div class="temple-hud">
      <span class="chip temple-level" data-temple-level>Level 1 / 3</span>
      <span class="chip" data-temple-gems>💎 0 / ${TEMPLE_GEM_TOTAL}</span>
      <span class="chip" data-temple-gate>Gate sealed</span>
      <div class="temple-switch-row">
        <button class="temple-active is-active" type="button" data-temple-active="ember">🔥 Ember</button>
        <button class="temple-active" type="button" data-temple-active="tide">💧 Tide</button>
        <button class="temple-restart" type="button" data-temple-restart aria-label="Restart this room" title="Restart room">↻</button>
      </div>
    </div>
    <div class="temple-banner" data-temple-banner></div>
    <div class="temple-controls">
      <div class="temple-dpad">
        <button type="button" data-temple-left aria-label="Move left">◀</button>
        <button type="button" data-temple-right aria-label="Move right">▶</button>
      </div>
      <button class="temple-jump" type="button" data-temple-jump>Jump</button>
      <button class="temple-swap" type="button" data-temple-swap>Switch</button>
    </div>
  </div>`;
  board.querySelector('.temple-canvas')?.remove();
  board.querySelector('.temple-wrap')?.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const levelEl = board.querySelector('[data-temple-level]');
  const gemsEl = board.querySelector('[data-temple-gems]');
  const gateEl = board.querySelector('[data-temple-gate]');
  const bannerEl = board.querySelector('[data-temple-banner]');
  const activeButtons = [...board.querySelectorAll('[data-temple-active]')];

  const keys = { left: false, right: false };
  const chars = {};
  let levelIndex = 0;
  let level = templeParse(TEMPLE_LEVEL_ROWS[levelIndex]);
  let active = 'ember';
  let gateOpen = false;
  let switches = 0;
  let falls = 0;
  let gems = 0;
  let completed = 0;
  let phase = 'playing';
  let running = true;
  let jumpQueued = false;
  let tile = 32;
  let offX = 0;
  let offY = 0;
  let raf = 0;
  let lastFrame = 0;
  let bannerTimer = 0;
  let advanceTimer = 0;
  let resizeObserver = null;

  function scoreNow() {
    return Math.max(0, completed * 250 + gems * 40 + switches * 20 - falls * 15);
  }

  function showBanner(text, ms = 1600) {
    if (!bannerEl) return;
    bannerEl.textContent = text;
    bannerEl.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => bannerEl.classList.remove('show'), ms);
  }

  function updateHud() {
    levelEl.textContent = `Level ${levelIndex + 1} / ${TEMPLE_LEVEL_ROWS.length}`;
    gemsEl.textContent = `💎 ${gems} / ${TEMPLE_GEM_TOTAL}`;
    gateEl.textContent = gateOpen ? 'Gate open' : 'Gate sealed';
    gateEl.classList.toggle('is-open', gateOpen);
    activeButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.templeActive === active));
    shell.scoreEl.textContent = scoreNow().toLocaleString('en-US');
    shell.timerEl.textContent = `Level ${levelIndex + 1} / ${TEMPLE_LEVEL_ROWS.length}`;
    shell.timerBar.style.width = `${(levelIndex / TEMPLE_LEVEL_ROWS.length) * 100}%`;
  }

  function placeChars() {
    chars.ember = templeMakeChar('ember', level.emberStart);
    chars.tide = templeMakeChar('tide', level.tideStart);
    chars.ember.atDoor = false;
    chars.tide.atDoor = false;
  }

  function restartRoom(message = 'Back to the start.') {
    placeChars();
    keys.left = false;
    keys.right = false;
    jumpQueued = false;
    showBanner(message, 1200);
    updateHud();
  }

  function loadLevel(index) {
    levelIndex = index;
    level = templeParse(TEMPLE_LEVEL_ROWS[levelIndex]);
    phase = 'playing';
    gateOpen = false;
    active = 'ember';
    keys.left = false;
    keys.right = false;
    jumpQueued = false;
    placeChars();
    resize();
    updateHud();
    showBanner(`Level ${levelIndex + 1} · ${TEMPLE_LEVEL_NAMES[levelIndex]}`, 2200);
  }

  function finishRun() {
    phase = 'result';
    running = false;
    keys.left = false;
    keys.right = false;
    shell.timerEl.textContent = 'Temple cleared';
    shell.timerBar.style.width = '100%';
    const score = scoreNow();
    const blurb = falls === 0 ? 'A flawless run through the temple!' : 'The temple is cleared — the pantry is yours.';
    showGameResult(shell, { kind: 'temple', score, coins: score, xp: 55, blurb });
  }

  function completeLevel() {
    if (phase !== 'playing') return;
    phase = 'clear';
    completed += 1;
    keys.left = false;
    keys.right = false;
    updateHud();
    shell.timerEl.textContent = 'Room clear';
    shell.timerBar.style.width = `${(completed / TEMPLE_LEVEL_ROWS.length) * 100}%`;
    showBanner(`Room clear! ${gems} gems found`, 1200);
    if (typeof Sfx !== 'undefined') Sfx.win();
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => {
      if (!running) return;
      if (levelIndex + 1 < TEMPLE_LEVEL_ROWS.length) loadLevel(levelIndex + 1);
      else finishRun();
    }, 1150);
  }

  function update(dt) {
    if (phase !== 'playing') return;
    const activeChar = chars[active];
    if (jumpQueued && activeChar.onGround) {
      activeChar.vy = -15;
      activeChar.onGround = false;
    }
    jumpQueued = false;

    for (const element of ['ember', 'tide']) {
      const c = chars[element];
      const direction = element === active ? (keys.right ? 1 : 0) - (keys.left ? 1 : 0) : 0;
      c.vx = direction * 5.2;
      c.vy = Math.min(25, c.vy + 33 * dt);
      templeMove(c, level, gateOpen, dt);
    }

    let hitWrongPool = false;
    for (const element of ['ember', 'tide']) {
      const c = chars[element];
      for (const pool of level.pools) {
        if (pool.element !== element && templeOverlap(c, pool.col, pool.row)) {
          hitWrongPool = true;
          break;
        }
      }
      if (hitWrongPool) break;
    }
    if (hitWrongPool) {
      falls += 1;
      restartRoom('Wrong element! Both sprites return to the start.');
      return;
    }

    for (const gem of level.gems) {
      if (gem.got) continue;
      const c = chars[gem.element];
      if (c && templeOverlap(c, gem.col, gem.row)) {
        gem.got = true;
        gems += 1;
        if (typeof Sfx !== 'undefined') Sfx.chime();
        showBanner(`${TEMPLE_ELEMENTS[gem.element].name} gem found!`, 900);
        updateHud();
      }
    }

    if (level.switchTile && !gateOpen) {
      const onSwitch = ['ember', 'tide'].some((element) => templeOverlap(chars[element], level.switchTile.col, level.switchTile.row));
      if (onSwitch) {
        gateOpen = true;
        switches += 1;
        if (typeof Sfx !== 'undefined') Sfx.chime();
        showBanner('The sealed gate opens!', 1300);
        updateHud();
      }
    }

    for (const element of ['ember', 'tide']) {
      const door = level.doors[element];
      chars[element].atDoor = !!door && templeOverlap(chars[element], door.col, door.row);
    }
    if (chars.ember.atDoor && chars.tide.atDoor) completeLevel();
  }

  function resize() {
    const rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const padX = 8;
    const padTop = 58;
    const padBottom = 94;
    const usableW = Math.max(1, rect.width - padX * 2);
    const usableH = Math.max(1, rect.height - padTop - padBottom);
    tile = Math.max(12, Math.min(usableW / level.width, usableH / level.height));
    offX = (rect.width - tile * level.width) / 2;
    offY = padTop + Math.max(0, (usableH - tile * level.height) / 2);
  }

  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawCharacter(c, time) {
    const def = TEMPLE_ELEMENTS[c.element];
    const x = c.x * tile;
    const y = c.y * tile;
    const w = c.w * tile;
    const h = c.h * tile;
    const isActive = c.element === active;
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#05030c';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 1, w * 0.52, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (isActive) {
      ctx.strokeStyle = def.color;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h * 0.52, w * 0.78, h * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 1, x + w / 2, y + h / 2, w * 1.5);
    glow.addColorStop(0, def.color + '55');
    glow.addColorStop(1, def.color + '00');
    ctx.fillStyle = glow;
    ctx.fillRect(x - w, y - h * 0.5, w * 3, h * 2);

    const body = ctx.createLinearGradient(x, y, x, y + h);
    body.addColorStop(0, def.soft);
    body.addColorStop(1, def.color);
    ctx.fillStyle = body;
    roundedRect(x, y + h * 0.1, w, h * 0.9, w * 0.42);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#141024';
    const eyeY = y + h * 0.42;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.36, eyeY, w * 0.075, h * 0.075, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.64, eyeY, w * 0.075, h * 0.075, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + w * 0.34, eyeY - 1, w * 0.026, 0, Math.PI * 2);
    ctx.arc(x + w * 0.62, eyeY - 1, w * 0.026, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `900 ${Math.max(10, Math.round(tile * 0.34))}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(def.icon, x + w / 2, y - tile * 0.36 + Math.sin(time * 2.5) * 2);
    ctx.restore();
  }

  function draw(time) {
    const width = board.clientWidth;
    const height = board.clientHeight;
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#100b22');
    bg.addColorStop(0.55, '#18112e');
    bg.addColorStop(1, '#080612');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 24; i += 1) {
      const sx = (i * 71.3) % width;
      const sy = (i * 47.9) % height;
      ctx.fillStyle = `rgba(196,176,255,${0.05 + (i % 4) * 0.018})`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    ctx.save();
    ctx.translate(offX, offY);
    for (let row = 0; row < level.height; row += 1) {
      for (let col = 0; col < level.width; col += 1) {
        const ch = level.rows[row][col];
        const x = col * tile;
        const y = row * tile;
        if (ch === '#') {
          ctx.fillStyle = '#251d40';
          ctx.fillRect(x, y, tile, tile);
          ctx.fillStyle = 'rgba(255,255,255,.06)';
          ctx.fillRect(x + 1, y + 1, tile - 2, Math.max(2, tile * 0.14));
          ctx.strokeStyle = 'rgba(139,123,255,.13)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, tile - 1, tile - 1);
        }
      }
    }

    for (const pool of level.pools) {
      const def = TEMPLE_ELEMENTS[pool.element];
      const x = pool.col * tile;
      const y = pool.row * tile + tile * 0.26;
      const h = tile * 0.74;
      const liquid = ctx.createLinearGradient(x, y, x, y + h);
      liquid.addColorStop(0, def.color + 'cc');
      liquid.addColorStop(1, def.color + '55');
      ctx.fillStyle = liquid;
      ctx.beginPath();
      ctx.moveTo(x, y + Math.sin(time * 2.2 + pool.col) * 1.8);
      ctx.quadraticCurveTo(x + tile / 2, y - 2 + Math.sin(time * 2.2 + pool.col + 1) * 2, x + tile, y);
      ctx.lineTo(x + tile, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.fillRect(x + tile * 0.16, y + 3, tile * 0.34, 1);
    }

    for (const element of ['ember', 'tide']) {
      const door = level.doors[element];
      if (!door) continue;
      const def = TEMPLE_ELEMENTS[element];
      const x = door.col * tile;
      const y = door.row * tile;
      const open = chars[element] && chars[element].atDoor;
      ctx.save();
      if (open) {
        const glow = ctx.createRadialGradient(x + tile / 2, y + tile / 2, 2, x + tile / 2, y + tile / 2, tile);
        glow.addColorStop(0, def.color + '99');
        glow.addColorStop(1, def.color + '00');
        ctx.fillStyle = glow;
        ctx.fillRect(x - tile * 0.5, y - tile * 0.5, tile * 2, tile * 2);
      }
      ctx.fillStyle = open ? def.color + '55' : 'rgba(8,6,20,.55)';
      roundedRect(x + tile * 0.08, y + tile * 0.04, tile * 0.84, tile * 0.94, tile * 0.3);
      ctx.fill();
      ctx.strokeStyle = def.color;
      ctx.lineWidth = open ? 2 : 1.3;
      ctx.stroke();
      ctx.font = `900 ${Math.max(11, Math.round(tile * 0.46))}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = def.soft;
      ctx.fillText(def.icon, x + tile / 2, y + tile * 0.52);
      ctx.restore();
    }

    if (level.switchTile) {
      const x = level.switchTile.col * tile;
      const y = level.switchTile.row * tile + tile * 0.55;
      ctx.fillStyle = gateOpen ? '#5ee0a0' : '#ffd166';
      roundedRect(x + tile * 0.14, y, tile * 0.72, tile * 0.28, tile * 0.1);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (gateOpen) {
        ctx.fillStyle = 'rgba(94,224,160,.16)';
        ctx.beginPath();
        ctx.arc(x + tile / 2, y + tile * 0.14, tile * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const gem of level.gems) {
      if (gem.got) continue;
      const def = TEMPLE_ELEMENTS[gem.element];
      const x = gem.col * tile + tile / 2;
      const y = gem.row * tile + tile / 2 + Math.sin(time * 2.8 + gem.col) * 2;
      const size = tile * 0.2;
      ctx.save();
      ctx.shadowColor = def.color;
      ctx.shadowBlur = tile * 0.35;
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.55);
      ctx.lineTo(x + size * 0.28, y);
      ctx.lineTo(x, y + size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if (!gateOpen) {
      for (const gate of level.gateTiles) {
        const x = gate.col * tile;
        const y = gate.row * tile;
        ctx.fillStyle = 'rgba(139,123,255,.2)';
        ctx.fillRect(x + tile * 0.12, y, tile * 0.76, tile);
        ctx.fillStyle = '#8b7bff';
        for (let bar = 0; bar < 3; bar += 1) {
          ctx.fillRect(x + tile * (0.24 + bar * 0.22), y + 2, Math.max(1, tile * 0.055), tile - 4);
        }
      }
    } else {
      for (const gate of level.gateTiles) {
        ctx.fillStyle = 'rgba(139,123,255,.09)';
        ctx.fillRect(gate.col * tile + tile * 0.12, gate.row * tile, tile * 0.76, tile);
      }
    }

    for (const element of ['tide', 'ember']) drawCharacter(chars[element], time);
    ctx.restore();
  }

  function frame(now) {
    if (!running) return;
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(0.033, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    update(dt);
    draw(now / 1000);
    raf = requestAnimationFrame(frame);
  }

  function setActive(element) {
    if (phase !== 'playing' || !chars[element]) return;
    active = element;
    jumpQueued = false;
    updateHud();
  }

  function swapActive() {
    setActive(active === 'ember' ? 'tide' : 'ember');
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      keys.left = true;
      event.preventDefault();
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      keys.right = true;
      event.preventDefault();
    } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W' || event.key === ' ' || event.code === 'Space') {
      jumpQueued = true;
      event.preventDefault();
    } else if (event.key === 'q' || event.key === 'Q') {
      swapActive();
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') keys.left = false;
    else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') keys.right = false;
  }

  function clearKeys() {
    keys.left = false;
    keys.right = false;
  }

  function bindHold(selector, key) {
    const button = board.querySelector(selector);
    if (!button) return;
    const down = (event) => {
      event.preventDefault();
      keys[key] = true;
      button.classList.add('is-down');
      if (button.setPointerCapture) {
        try { button.setPointerCapture(event.pointerId); } catch { /* ignore */ }
      }
    };
    const up = (event) => {
      if (event) event.preventDefault();
      keys[key] = false;
      button.classList.remove('is-down');
    };
    button.addEventListener('pointerdown', down);
    button.addEventListener('pointerup', up);
    button.addEventListener('pointercancel', up);
    button.addEventListener('pointerleave', up);
  }

  bindHold('[data-temple-left]', 'left');
  bindHold('[data-temple-right]', 'right');

  const jumpButton = board.querySelector('[data-temple-jump]');
  jumpButton?.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    jumpQueued = true;
    jumpButton.classList.add('is-down');
  });
  jumpButton?.addEventListener('pointerup', (event) => {
    event.preventDefault();
    jumpButton.classList.remove('is-down');
  });
  jumpButton?.addEventListener('pointercancel', () => jumpButton.classList.remove('is-down'));

  board.querySelector('[data-temple-swap]')?.addEventListener('click', swapActive);
  board.querySelector('[data-temple-restart]')?.addEventListener('click', () => restartRoom());
  activeButtons.forEach((button) => {
    button.addEventListener('click', () => setActive(button.dataset.templeActive));
  });

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left - offX) / tile;
    const py = (event.clientY - rect.top - offY) / tile;
    for (const element of ['ember', 'tide']) {
      const c = chars[element];
      if (px >= c.x && px <= c.x + c.w && py >= c.y && py <= c.y + c.h) {
        setActive(element);
        break;
      }
    }
  });

  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', clearKeys);

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(board);
  } else {
    window.addEventListener('resize', resize);
  }

  const debugApi = {
    state: () => ({
      level: levelIndex + 1,
      phase,
      active,
      gateOpen,
      gems,
      totalGems: TEMPLE_GEM_TOTAL,
      levelGems: level.gems.filter((gem) => gem.got).length,
      falls,
      switches,
      completed,
      atDoor: { ember: !!chars.ember?.atDoor, tide: !!chars.tide?.atDoor },
      characters: {
        ember: chars.ember ? { x: chars.ember.x, y: chars.ember.y } : null,
        tide: chars.tide ? { x: chars.tide.x, y: chars.tide.y } : null,
      },
    }),
    place: (element, col, row) => {
      const c = chars[element];
      if (!c || !Number.isFinite(col) || !Number.isFinite(row)) return false;
      c.x = Number(col) + 0.5 - c.w / 2;
      c.y = Number(row) + 1 - c.h;
      c.vx = 0;
      c.vy = 0;
      c.onGround = false;
      c.atDoor = false;
      return true;
    },
    restart: () => restartRoom(),
  };
  window.__templeTest = debugApi;

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(bannerTimer);
    clearTimeout(advanceTimer);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', clearKeys);
    if (resizeObserver) resizeObserver.disconnect();
    else window.removeEventListener('resize', resize);
    if (window.__templeTest === debugApi) delete window.__templeTest;
  });

  loadLevel(0);
  resize();
  raf = requestAnimationFrame(frame);
}
