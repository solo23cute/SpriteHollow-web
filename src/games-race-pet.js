/* Two more games from the upgrade list: a lane racer and a pet expedition.
   Both use the shared overlay so rewards, layout debug and cleanup match. */

Object.assign(GAME_INFO, {
  race: {
    title: 'Hollow Grand Prix',
    icon: '🏎️',
    tag: 'Racing',
    group: 'arcade',
    desc: 'Steer between lanes, grab boost rings, and dodge the cones.',
    g1: '#56c8e8',
    g2: '#ffd166',
  },
  petquest: {
    title: 'Pet Adventure',
    icon: '🗺️',
    tag: 'Expedition',
    group: 'arcade',
    desc: 'Guide your sprite to buried treasure and around the thorns.',
    g1: '#7ee787',
    g2: '#8b7bff',
  },
});

/* ---------------- HOLLOW GRAND PRIX ---------------- */
function openRaceGame() {
  const shell = gameOverlayShell('race');
  const { board } = shell;
  const LANES = [20, 50, 80];
  const DURATION = 25;
  const sprite = activeSprite();
  board.innerHTML = `<div class="race-wrap">
      <div class="race-road" data-race-road>
        <span class="race-lane-line" style="left:33.3%"></span>
        <span class="race-lane-line" style="left:66.6%"></span>
        <div class="race-kart" data-race-kart>${sprite ? spriteSVG(sprite, { expr: 'happy' }) : '🏎️'}</div>
      </div>
      <div class="race-move">
        <button class="catch-arrow" type="button" data-race-left aria-label="Steer left">◀</button>
        <span class="tiny muted" data-race-copy>Lane 2 · 0 m</span>
        <button class="catch-arrow" type="button" data-race-right aria-label="Steer right">▶</button>
      </div>
    </div>`;
  const road = board.querySelector('[data-race-road]');
  const kart = board.querySelector('[data-race-kart]');
  const copy = board.querySelector('[data-race-copy]');
  const items = [];
  let lane = 1;
  let distance = 0;
  let speed = 30;
  let boost = 0;
  let combo = 0;
  let running = true;
  let remaining = DURATION;
  let last = performance.now();
  let lastSpawn = 0;
  let raf = 0;

  kart.style.left = `${LANES[lane]}%`;

  function paint() {
    copy.textContent = `Lane ${lane + 1} · ${Math.round(distance)} m`;
  }

  function steer(delta) {
    lane = Math.max(0, Math.min(2, lane + delta));
    kart.style.left = `${LANES[lane]}%`;
    kart.classList.add('steer');
    setTimeout(() => kart.classList.remove('steer'), 180);
    Sfx.tick();
    paint();
  }

  function spawn() {
    const roll = Math.random();
    const kind = roll < 0.24 ? 'boost' : roll < 0.5 ? 'coin' : 'cone';
    const el = document.createElement('span');
    el.className = `race-item ${kind}`;
    el.textContent = kind === 'cone' ? '🚧' : kind === 'boost' ? '💠' : '🪙';
    el.style.top = '-10%';
    const itemLane = randInt(0, 2);
    el.style.left = `${LANES[itemLane]}%`;
    road.appendChild(el);
    items.push({ el, y: -10, lane: itemLane, kind, dead: false });
  }

  function finish(blurb) {
    if (!running) return;
    running = false;
    clearInterval(raf);
    clearInterval(seconds);
    items.forEach((item) => item.el.remove());
    const score = Math.max(0, Math.round(distance) + combo * 4);
    const coins = Math.min(125, 18 + Math.round(score / 3));
    const xp = Math.min(85, 12 + Math.round(score / 5));
    showGameResult(shell, {
      kind: 'race', score, coins, xp,
      blurb,
    });
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    boost = Math.max(0, boost - dt);
    const current = speed + (boost > 0 ? 26 : 0);
    distance += current * dt;
    if (now - lastSpawn > (boost > 0 ? 300 : 480)) {
      spawn();
      lastSpawn = now;
    }
    items.forEach((item) => {
      if (item.dead) return;
      item.y += (current * 0.55 + 26) * dt;
      item.el.style.top = `${item.y}%`;
      if (item.y >= 74 && item.lane === lane) {
        item.dead = true;
        item.el.remove();
        if (item.kind === 'cone') {
          combo = 0;
          boost = 0;
          speed = Math.max(18, speed - 4);
          Sfx.error();
          tapHaptic(18);
          kart.classList.add('hit');
          setTimeout(() => kart.classList.remove('hit'), 320);
        } else if (item.kind === 'boost') {
          boost = 2.4;
          combo += 2;
          Sfx.coin();
        } else {
          combo += 1;
          Sfx.tick();
        }
        paint();
      } else if (item.y > 104) {
        item.dead = true;
        item.el.remove();
      }
    });
    for (let i = items.length - 1; i >= 0; i--) if (items[i].dead) items.splice(i, 1);
    remaining = Math.max(0, remaining - dt);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    shell.scoreEl.textContent = Math.max(0, Math.round(distance) + combo * 4);
    if (remaining <= 0) {
      finish(distance > 520 ? 'Chequered flag. That was a clean lap.' : 'The cones won the day, but the sprites cheered.');
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  const onKey = (event) => {
    if (!running) return;
    if (event.key === 'ArrowLeft' || event.key === 'a') { steer(-1); event.preventDefault(); }
    else if (event.key === 'ArrowRight' || event.key === 'd') { steer(1); event.preventDefault(); }
  };
  board.querySelector('[data-race-left]').addEventListener('click', () => steer(-1));
  board.querySelector('[data-race-right]').addEventListener('click', () => steer(1));
  road.addEventListener('pointerdown', (event) => {
    if (!running) return;
    const rect = road.getBoundingClientRect();
    if (!rect.width) return;
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    const target = Math.abs(pct - LANES[0]) < Math.abs(pct - LANES[1])
      ? (Math.abs(pct - LANES[0]) < Math.abs(pct - LANES[2]) ? 0 : 2)
      : (Math.abs(pct - LANES[1]) < Math.abs(pct - LANES[2]) ? 1 : 2);
    if (target !== lane) steer(target - lane > 0 ? 1 : -1);
  });
  document.addEventListener('keydown', onKey);

  const seconds = setInterval(() => { if (!running) clearInterval(seconds); }, 1000);
  paint();
  raf = setInterval(() => {
    loop(performance.now());
  }, 33);
  shell.addCleanup(() => {
    running = false;
    clearInterval(raf);
    clearInterval(seconds);
    document.removeEventListener('keydown', onKey);
    items.forEach((item) => item.el.remove());
  });
}

/* ---------------- PET ADVENTURE ---------------- */
function openPetAdventureGame() {
  const shell = gameOverlayShell('petquest');
  const { board } = shell;
  const CELLS = 12;
  const TREASURES = 6;
  const DURATION = 35;
  board.innerHTML = `<div class="petquest-wrap">
      <div class="petquest-hud">
        <span data-quest-hearts class="dig-hearts">💛💛💛</span>
        <span class="tiny muted" data-quest-found>Treasure 0 / ${TREASURES}</span>
      </div>
      <div class="pet-grid" data-pet-grid></div>
      <div class="tiny muted dig-hint">Tap a clearing. Thorns cost a heart, treasure banks progress.</div>
    </div>${gameMiniSprite()}`;
  const grid = board.querySelector('[data-pet-grid]');
  const heartsEl = board.querySelector('[data-quest-hearts]');
  const foundEl = board.querySelector('[data-quest-found]');
  const kinds = [];
  for (let i = 0; i < TREASURES; i++) kinds.push('treasure');
  for (let i = 0; i < 3; i++) kinds.push('thorn');
  while (kinds.length < CELLS) kinds.push('empty');
  const layout = shuffle(kinds);
  let hearts = 3;
  let found = 0;
  let score = 0;
  let running = true;
  let remaining = DURATION;
  let clock = 0;

  grid.innerHTML = layout.map((_, index) => `<button class="pet-tile" type="button" data-pet="${index}" aria-label="Clearing ${index + 1}"><span>🌿</span></button>`).join('');
  const tiles = [...grid.querySelectorAll('[data-pet]')];

  function paintHud() {
    heartsEl.textContent = '💛'.repeat(Math.max(0, hearts)) + '🖤'.repeat(Math.max(0, 3 - hearts));
    foundEl.textContent = `Treasure ${found} / ${TREASURES}`;
    shell.scoreEl.textContent = score;
  }

  function finish(blurb) {
    if (!running) return;
    running = false;
    clearInterval(clock);
    tiles.forEach((tile) => { tile.disabled = true; });
    const coins = Math.min(130, 15 + score * 4 + hearts * 6);
    const xp = Math.min(85, 10 + score * 3);
    showGameResult(shell, { kind: 'petquest', score, coins, xp, blurb });
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      if (!running || tile.classList.contains('open')) return;
      tile.classList.add('open');
      tile.disabled = true;
      const kind = layout[Number(tile.dataset.pet)];
      if (kind === 'treasure') {
        found += 1;
        score += 2;
        tile.textContent = '💎';
        tile.classList.add('treasure');
        Sfx.coin();
        burstOn(tile, ['💎', '✨', '🪙'], 4);
        if (found >= TREASURES) {
          paintHud();
          finish(`Every treasure found, with ${hearts} heart${hearts === 1 ? '' : 's'} to spare.`);
          return;
        }
      } else if (kind === 'thorn') {
        hearts -= 1;
        score = Math.max(0, score - 1);
        tile.textContent = '🌵';
        tile.classList.add('thorn');
        Sfx.error();
        tapHaptic(22);
        if (hearts <= 0) {
          paintHud();
          finish('Too many thorns. The expedition heads home — with what it found.');
          return;
        }
      } else {
        tile.textContent = '🍃';
        tile.classList.add('empty');
        Sfx.tick();
      }
      paintHud();
    });
  });

  paintHud();
  shell.timerEl.textContent = `${DURATION}s`;
  shell.timerBar.style.width = '100%';
  clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    if (remaining <= 0) finish('The lanterns dim. Time to head back to the Hollow.');
  }, 100);

  shell.addCleanup(() => {
    running = false;
    clearInterval(clock);
  });
}
