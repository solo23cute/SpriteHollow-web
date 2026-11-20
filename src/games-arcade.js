/* Arcade challenges: one puzzle, one zombie siege, and one fight. */

Object.assign(GAME_INFO, {
  rune: {
    title: 'Rune Slide',
    icon: '🧩',
    tag: 'Puzzle',
    group: 'arcade',
    desc: 'Match the order strip. Slide all eight runes home across three boards in two minutes.',
    g1: '#8b7bff',
    g2: '#38bdf8',
  },
  zombie: {
    title: 'Zombie Siege',
    icon: '🧟',
    tag: 'Zombie',
    group: 'arcade',
    desc: 'Tap the horde before it reaches the lantern. Three hearts, thirty seconds.',
    g1: '#7ee787',
    g2: '#4f6b3a',
  },
  duel: {
    title: 'Hollow Duel',
    icon: '⚔️',
    tag: 'Fight',
    group: 'arcade',
    desc: 'Pick another sprite from your Hollow, time your strikes, and guard their counterattack.',
    g1: '#ff8a5c',
    g2: '#c9455c',
  },
});

/* ---------------- RUNE SLIDE ---------------- */
const RUNE_TILES = ['🌙', '🔥', '💧', '🌿', '⚡', '❄️', '🪶', '💎'];
const RUNE_TIME = 120;

function runeShuffledBoard(steps = 22) {
  const board = [...RUNE_TILES, null];
  let blank = 8;
  let previous = -1;
  for (let i = 0; i < steps; i++) {
    const neighbours = [];
    const x = blank % 3;
    const y = Math.floor(blank / 3);
    if (x > 0) neighbours.push(blank - 1);
    if (x < 2) neighbours.push(blank + 1);
    if (y > 0) neighbours.push(blank - 3);
    if (y < 2) neighbours.push(blank + 3);
    const choices = neighbours.filter((n) => n !== previous);
    const next = pick(choices.length ? choices : neighbours);
    [board[blank], board[next]] = [board[next], board[blank]];
    previous = blank;
    blank = next;
  }
  if (board.slice(0, 8).every((v, i) => v === RUNE_TILES[i])) return runeShuffledBoard(steps + 12);
  return board;
}

function openRuneSlideGame() {
  const shell = gameOverlayShell('rune');
  const { board } = shell;
  board.innerHTML = `<div class="rune-wrap">
      <div class="rune-meta"><span data-rune-round>Board 1 / 3</span><span data-rune-moves>0 moves</span></div>
      <div class="rune-goal" aria-label="Target rune order">
        <span class="rune-goal-label">Order</span>
        ${RUNE_TILES.map((rune, i) => `<span>${rune}</span>${i < RUNE_TILES.length - 1 ? '<i>›</i>' : ''}`).join('')}
      </div>
      <div class="rune-board" data-rune-grid></div>
      <div class="tiny muted rune-hint">Tap a rune beside the empty slot. Green runes are already in place.</div>
    </div>${gameMiniSprite()}`;
  const grid = board.querySelector('[data-rune-grid]');
  const roundEl = board.querySelector('[data-rune-round]');
  const movesEl = board.querySelector('[data-rune-moves]');
  const timers = new Set();
  let runeBoard = runeShuffledBoard();
  let round = 1;
  let moves = 0;
  let solved = 0;
  let score = 0;
  let remaining = RUNE_TIME;
  let running = true;
  let locked = false;

  function later(fn, ms) {
    const id = setTimeout(() => { if (running) fn(); }, ms);
    timers.add(id);
    return id;
  }

  function paintRunes() {
    grid.innerHTML = runeBoard.map((rune, i) => rune
      ? `<button class="rune-tile${rune === RUNE_TILES[i] ? ' rune-correct' : ''}" data-rune="${i}" aria-label="Rune ${rune}">${rune}</button>`
      : '<span class="rune-tile rune-blank" aria-hidden="true">✦</span>').join('');
    grid.querySelectorAll('[data-rune]').forEach((tile) => {
      tile.addEventListener('click', () => slideRune(Number(tile.dataset.rune)));
    });
    roundEl.textContent = `Board ${round} / 3`;
    movesEl.textContent = `${moves} move${moves === 1 ? '' : 's'}`;
    shell.scoreEl.textContent = score;
  }

  function adjacentToBlank(index) {
    const blank = runeBoard.indexOf(null);
    const ax = index % 3;
    const ay = Math.floor(index / 3);
    const bx = blank % 3;
    const by = Math.floor(blank / 3);
    return Math.abs(ax - bx) + Math.abs(ay - by) === 1;
  }

  function slideRune(index) {
    if (!running || locked) return;
    if (!adjacentToBlank(index)) {
      const tile = grid.querySelector(`[data-rune="${index}"]`);
      if (tile) {
        tile.classList.add('rune-nudge');
        setTimeout(() => tile.classList.remove('rune-nudge'), 260);
      }
      return;
    }
    const blank = runeBoard.indexOf(null);
    [runeBoard[blank], runeBoard[index]] = [runeBoard[index], runeBoard[blank]];
    moves += 1;
    Sfx.tick();
    paintRunes();
    if (runeBoard.slice(0, 8).every((v, i) => v === RUNE_TILES[i])) {
      locked = true;
      solved += 1;
      const boardScore = Math.max(12, 46 - Math.floor(moves / 4)) + Math.ceil(remaining / 5);
      score += boardScore;
      shell.scoreEl.textContent = score;
      Sfx.win();
      burstOn(grid, ['✨', '🌟', '💎'], 10);
      if (solved >= 3) {
        finish('Every rune is home. Brilliant!');
        return;
      }
      round += 1;
      shell.hintEl.textContent = 'Perfect order! The next board is waking up.';
      later(() => {
        runeBoard = runeShuffledBoard(22 + round * 5);
        moves = 0;
        locked = false;
        shell.hintEl.textContent = 'Slide a rune beside the empty slot.';
        paintRunes();
      }, 720);
    }
  }

  shell.timerEl.textContent = `${RUNE_TIME}s`;
  shell.timerBar.style.width = '100%';
  paintRunes();
  const spawnTimer = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / RUNE_TIME) * 100}%`;
    if (remaining <= 0) finish(solved ? 'The clock caught the last board.' : 'The runes stayed shuffled.');
  }, 100);
  timers.add(spawnTimer);

  function finish(blurb) {
    if (!running) return;
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
    const coins = Math.min(130, 20 + score);
    const xp = Math.min(80, 12 + Math.round(score / 2));
    showGameResult(shell, {
      kind: 'rune', score, coins, xp,
      blurb,
    });
  }

  shell.addCleanup(() => {
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
  });
}

/* ---------------- ZOMBIE SIEGE ---------------- */
function openZombieSiegeGame() {
  const shell = gameOverlayShell('zombie');
  const { board } = shell;
  board.innerHTML = `<div class="zombie-field">
      <div class="zombie-hud">
        <span data-hearts class="zombie-hearts">💛💛💛</span>
        <span class="tiny muted" data-wave>Wave 1</span>
      </div>
      <div class="zombie-lanes">
        ${[0, 1, 2].map((lane) => `<div class="zombie-lane" data-lane="${lane}">
          <span class="zombie-moon">🌙</span>
          <span class="zombie-gate">🏮</span>
        </div>`).join('')}
      </div>
      <div class="zombie-spells">
        <button class="btn btn-soft btn-sm" type="button" data-freeze>❄️ Freeze <b data-freeze-cd></b></button>
        <button class="btn btn-soft btn-sm" type="button" data-bomb>💥 Cherry Bomb</button>
      </div>
      <div class="tiny muted zombie-tip">Tap a zombie, tap a lane, or press [1] [2] [3] to fire.</div>
    </div>${gameMiniSprite()}`;
  const lanes = [...board.querySelectorAll('[data-lane]')];
  const heartsEl = board.querySelector('[data-hearts]');
  const waveEl = board.querySelector('[data-wave]');
  const freezeBtn = board.querySelector('[data-freeze]');
  const freezeCd = board.querySelector('[data-freeze-cd]');
  const bombBtn = board.querySelector('[data-bomb]');
  const zombies = [];
  let score = 0;
  let hearts = 3;
  let running = true;
  let remaining = 30;
  let spawnClock = 0;
  let lastSpawn = 0;
  let raf = 0;
  let last = performance.now();
  let freezeCooldown = 0;
  let frozenUntil = 0;
  let bombUsed = false;
  const faces = ['🧟', '🧟‍♂️', '🧟‍♀️'];

  function updateHud() {
    heartsEl.textContent = '💛'.repeat(Math.max(0, hearts)) + '🖤'.repeat(Math.max(0, 3 - hearts));
    shell.scoreEl.textContent = score;
    waveEl.textContent = `Wave ${1 + Math.floor(score / 7)}`;
    freezeBtn.disabled = freezeCooldown > 0 || frozenUntil > performance.now();
    freezeCd.textContent = freezeCooldown > 0 ? `${Math.ceil(freezeCooldown)}s` : frozenUntil > performance.now() ? '❄️' : '';
    bombBtn.disabled = bombUsed;
    bombBtn.style.opacity = bombUsed ? '.5' : '';
  }

  function spawnZombie() {
    if (!running) return;
    const lane = lanes
      .map((el) => ({ el, count: zombies.filter((z) => z.lane === el).length }))
      .sort((a, b) => a.count - b.count)[0]?.el;
    if (!lane) return;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'zombie';
    el.textContent = pick(faces);
    el.style.left = `${rand(16, 82)}%`;
    el.style.top = '-14%';
    const zombie = { el, lane, y: -14, speed: rand(10, 15) + Math.min(9, score * 0.28), dead: false };
    el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!running || zombie.dead) return;
      kill(zombie);
    });
    lane.appendChild(el);
    zombies.push(zombie);
  }

  function kill(zombie) {
    if (zombie.dead) return;
    zombie.dead = true;
    score += 1;
    Sfx.coin();
    burstOn(zombie.el, ['💥', '✨', '🧟'], 5);
    zombie.el.classList.add('zap');
    setTimeout(() => zombie.el.remove(), 220);
    updateHud();
  }

  function shootLane(index) {
    if (!running) return;
    const lane = lanes[index];
    if (!lane) return;
    const targets = zombies.filter((z) => z.lane === lane && !z.dead).sort((a, b) => b.y - a.y);
    Sfx.tick();
    const shot = document.createElement('span');
    shot.className = 'zombie-shot';
    shot.textContent = '✦';
    lane.appendChild(shot);
    setTimeout(() => shot.remove(), 300);
    if (targets[0]) kill(targets[0]);
  }

  function castFreeze() {
    if (!running || freezeCooldown > 0) return;
    freezeCooldown = 8;
    frozenUntil = performance.now() + 4000;
    Sfx.tone(880, 0.3, 'sine', 0.05, 0, -300);
    lanes.forEach((lane) => lane.classList.add('frozen'));
    shell.hintEl.textContent = 'Frozen solid for four seconds.';
    updateHud();
  }

  function cherryBomb() {
    if (!running || bombUsed) return;
    bombUsed = true;
    const counts = lanes.map((lane) => zombies.filter((z) => z.lane === lane && !z.dead).length);
    const best = counts.indexOf(Math.max(0, ...counts));
    const lane = lanes[best];
    let cleared = 0;
    zombies.forEach((zombie) => {
      if (zombie.lane !== lane || zombie.dead) return;
      zombie.dead = true;
      score += 1;
      cleared += 1;
      burstOn(zombie.el, ['💥', '🍒', '✨'], 6);
      zombie.el.remove();
    });
    Sfx.win();
    if (lane) {
      const flash = document.createElement('span');
      flash.className = 'zombie-blast';
      flash.textContent = '🍒';
      lane.appendChild(flash);
      setTimeout(() => flash.remove(), 460);
    }
    shell.hintEl.textContent = cleared ? `Cherry Bomb cleared ${cleared} zombie${cleared === 1 ? '' : 's'}.` : 'Cherry Bomb cleared an empty lane.';
    updateHud();
  }

  function hurt() {
    hearts -= 1;
    Sfx.error();
    tapHaptic(24);
    const flash = document.createElement('span');
    flash.className = 'zombie-hit';
    flash.textContent = '💥';
    board.querySelector('.zombie-field')?.appendChild(flash);
    setTimeout(() => flash.remove(), 380);
    updateHud();
    if (hearts <= 0) finish('The lantern went dark. The sprites still believe in you.');
  }

  function draw(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    remaining = Math.max(0, remaining - dt);
    freezeCooldown = Math.max(0, freezeCooldown - dt);
    const frozen = now < frozenUntil;
    if (frozen) lanes.forEach((lane) => lane.classList.add('frozen'));
    else lanes.forEach((lane) => lane.classList.remove('frozen'));
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / 30) * 100}%`;
    if (freezeCooldown > 0 || frozen || bombUsed) updateHud();
    spawnClock += dt * 1000;
    if (!frozen && now - lastSpawn > Math.max(380, 760 - score * 17) && spawnClock > 200) {
      spawnZombie();
      lastSpawn = now;
    }
    zombies.forEach((zombie) => {
      if (zombie.dead || frozen) return;
      zombie.y += zombie.speed * dt;
      zombie.el.style.top = `${zombie.y}%`;
      if (zombie.y >= 87) {
        zombie.dead = true;
        zombie.el.remove();
        hurt();
      }
    });
    for (let i = zombies.length - 1; i >= 0; i--) if (zombies[i].dead) zombies.splice(i, 1);
    if (remaining <= 0) finish('You held the lantern until sunrise.');
    if (running) raf = requestAnimationFrame(draw);
  }

  function finish(blurb) {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    zombies.forEach((z) => z.el.remove());
    zombies.length = 0;
    const coins = Math.min(150, 15 + score * 4 + hearts * 8);
    const xp = Math.min(80, 12 + score * 2);
    showGameResult(shell, {
      kind: 'zombie', score, coins, xp,
      blurb,
    });
  }

  const onKey = (event) => {
    if (!running) return;
    if (event.key === '1') shootLane(0);
    else if (event.key === '2') shootLane(1);
    else if (event.key === '3') shootLane(2);
    else if (event.key.toLowerCase() === 'f') castFreeze();
    else if (event.key.toLowerCase() === 'b') cherryBomb();
  };
  document.addEventListener('keydown', onKey);
  lanes.forEach((lane, index) => {
    lane.addEventListener('pointerdown', () => shootLane(index));
  });
  freezeBtn.addEventListener('click', castFreeze);
  bombBtn.addEventListener('click', cherryBomb);

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    zombies.forEach((z) => z.el.remove());
  });

  updateHud();
  spawnZombie();
  raf = requestAnimationFrame((now) => {
    last = now;
    lastSpawn = now;
    draw(now);
  });
}

/* ---------------- HOLLOW DUEL ---------------- */
function openHollowDuelGame(opts = {}) {
  Sfx.init();
  const shell = gameOverlayShell('duel');
  const { board } = shell;
  const active = activeSprite();
  const out = awakeSprites();
  const fallbackHome = active && active.stage !== 'egg' && !active.retired ? active : null;
  const player = active && active.stage !== 'egg' && !active.retired && !active.atHome
    ? active
    : (out[0] || fallbackHome);
  if (!player) {
    shell.close();
    toast('Hatch a sprite first to duel.', '🥚');
    return;
  }
  const roster = out.filter((s) => s.id !== player.id);
  const brute = { id: 'bramble-brute', name: 'Bramble Brute', brute: true };
  const requested = opts.opponentId ? roster.find((s) => s.id === opts.opponentId) : null;
  let running = false;
  let raf = 0;

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
  });

  /* The picker doubles as the odds screen: every opponent shows what one clean
     strike takes off them and whether the elemental chart helps or hurts. */
  const actorProfile = typeof puffleBattleProfile === 'function' ? puffleBattleProfile(player) : null;
  const oddsFor = (profile) => (actorProfile && profile && typeof puffleOddsHTML === 'function'
    ? puffleOddsHTML(actorProfile, profile)
    : '');
  /* Ranked by win chance, so the best-looking target is also the kindest. */
  const winFor = (s) => (actorProfile && typeof puffleWinChance === 'function' && typeof puffleBattleProfile === 'function'
    ? puffleWinChance(actorProfile, puffleBattleProfile(s))
    : 50);
  const ranked = [...roster].sort((a, b) => winFor(b) - winFor(a));
  /* Trait chips for the picker: every rival shows its own crit and dodge so a
     Brave or Playful opponent reads differently before the fight starts. */
  const traitChips = (profile) => {
    const crit = typeof puffleCritChance === 'function' ? puffleCritChance(profile) : 0;
    const dodge = typeof puffleDodgeChance === 'function' ? puffleDodgeChance(profile) : 0;
    return `${crit ? `<span class="chip" style="font-size:10px" title="Chance this rival crits you for double hearts">\u26A1 ${Math.round(crit * 100)}% crit</span>` : ''}`
      + `${dodge ? `<span class="chip" style="font-size:10px" title="Chance this rival slips your clean strike">\u{1F4A8} ${Math.round(dodge * 100)}% dodge</span>` : ''}`;
  };
  const opponentButton = (s) => {
    const tier = typeof spriteRarity === 'function' ? spriteRarity(s) : null;
    const profile = typeof puffleBattleProfile === 'function' ? puffleBattleProfile(s) : null;
    const odds = oddsFor(profile);
    const win = winFor(s);
    return `<button class="duel-pick" type="button" data-duel-opponent="${s.id}">
      <span class="duel-pick-art">${spriteSVG(s, { expr: 'happy' })}</span>
      <span class="duel-pick-copy"><b>${esc(displayName(s))}</b> <span class="chip" style="border-color:${win >= 60 ? 'var(--good)' : win <= 40 ? 'var(--bad)' : 'var(--line)'};font-size:10px">🎯 ${win}% win</span><span>Lv ${s.level} · ${typeName(s)}${tier ? ` · <b style="color:${tier.color}">${tier.name}</b>` : ''}</span><span class="duel-pick-odds" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${odds}${traitChips(profile)}${typeof duelEffectChips === 'function' ? duelEffectChips(s) : ''}</span></span>
      <span class="go">${icon('chevron')}</span>
    </button>`;
  };

  function showPicker() {
    running = false;
    cancelAnimationFrame(raf);
    board.innerHTML = `<div class="duel-picker">
      <div class="duel-picker-head">
        <div class="arcade-kicker">⚔️ Friendly spar</div>
        <h3>Fight another sprite</h3>
        <p>Choose anyone out in your Hollow. Both sides fight for fun, and your active sprite keeps the rewards. Sprites resting at home sit this one out.</p>
      </div>
      ${ranked.length
        ? `<p class="tiny muted" style="margin:0 0 8px">🎯 Best target: <b>${esc(displayName(ranked[0]))}</b> · ${winFor(ranked[0])}% win chance</p><div class="duel-picker-list">${ranked.map(opponentButton).join('')}</div>`
        : `<div class="card empty-state" style="padding:18px">No other sprites are out in the Hollow right now. Bring someone back from Home, or take on the Bramble Brute.</div>`}
      <div class="row" style="justify-content:center;gap:5px;margin-bottom:4px;flex-wrap:wrap" data-duel-brute-odds>${oddsFor(window.PUFFLE_BRUTE_PROFILE)}${traitChips(window.PUFFLE_BRUTE_PROFILE)}${typeof duelEffectChips === 'function' ? duelEffectChips({ element: 'bloom' }) : ''}</div>
      <button class="btn btn-soft btn-block" type="button" data-duel-brute>👹 Fight the Bramble Brute</button>
      <p class="tiny muted" style="text-align:center;margin:0">No coin cost · unlimited retries</p>
    </div>`;
    board.querySelectorAll('[data-duel-opponent]').forEach((button) => button.addEventListener('click', () => {
      const rival = ranked.find((s) => s.id === button.dataset.duelOpponent);
      if (rival) start(rival);
    }));
    board.querySelector('[data-duel-brute]').addEventListener('click', () => start(brute));
  }

  function start(opponent) {
    if (running) return;
    running = true;
    const oppName = opponent.brute ? 'Bramble Brute' : displayName(opponent);
    const oppArt = opponent.brute
      ? '<span class="duel-art duel-brute">👹</span>'
      : `<span class="duel-art duel-rival">${spriteSVG(opponent, { expr: 'happy' })}</span>`;
    /* Profiles are read before the stage is drawn so the HUD can name the
       rival's own crit and dodge chances. */
    const playerProfile = typeof puffleBattleProfile === 'function' ? puffleBattleProfile(player) : null;
    const enemyProfile = opponent.brute ? window.PUFFLE_BRUTE_PROFILE : (typeof puffleBattleProfile === 'function' ? puffleBattleProfile(opponent) : null);
    const critChance = typeof puffleCritChance === 'function' ? puffleCritChance(playerProfile) : 0;
    const dodgeChance = typeof puffleDodgeChance === 'function' ? puffleDodgeChance(playerProfile) : 0;
    const enemyCritChance = typeof puffleCritChance === 'function' ? puffleCritChance(enemyProfile) : 0;
    const enemyDodgeChance = typeof puffleDodgeChance === 'function' ? puffleDodgeChance(enemyProfile) : 0;
    /* Build-driven statuses: the rival keeps its own so a fire opponent burns
       back even when the player has no path chosen. */
    const mineSide = typeof duelSide === 'function' ? duelSide(player) : null;
    const rivalSide = typeof duelSide === 'function' ? duelSide(opponent.brute ? { element: 'bloom' } : opponent) : null;
    board.innerHTML = `<div class="duel-stage">
      <div class="duel-combatants">
        <div class="duel-fighter player">
          <span class="duel-label">${player ? esc(displayName(player)) : 'You'}</span>
          <span class="duel-art">${player ? spriteSVG(player, { expr: 'happy' }) : '✨'}</span>
          <span class="duel-hearts" data-player-hearts>💛💛💛</span>
        </div>
        <span class="duel-vs">VS</span>
        <div class="duel-fighter enemy">
          <span class="duel-telegraph" data-telegraph aria-hidden="true">⚠️</span>
          <span class="duel-label">${esc(oppName)}</span>
          <span class="duel-traits tiny">${enemyCritChance ? `⚡ ${Math.round(enemyCritChance * 100)}% crit` : ''}${enemyCritChance && enemyDodgeChance ? ' · ' : ''}${enemyDodgeChance ? `💨 ${Math.round(enemyDodgeChance * 100)}% dodge` : ''}</span>
          ${oppArt}
          <span class="duel-bar"><i data-enemy-bar style="width:100%"></i></span>
          <span class="duel-effects" data-duel-effects></span>
        </div>
      </div>
      <div class="duel-meter">
        <span class="duel-zone"></span>
        <span class="duel-marker" data-marker></span>
      </div>
      <div class="duel-status" data-duel-status>Find the green window.</div>
      <div class="duel-super"><i data-super style="width:0%"></i><span data-super-label>Super 0%</span></div>
      <div class="duel-actions">
        <button class="btn btn-gold" data-strike>Strike</button>
        <button class="btn btn-soft" data-guard>Guard</button>
      </div>
      <button class="btn btn-primary duel-ult" type="button" data-ultimate disabled>🌟 Ultimate Finisher</button>
      <div class="tiny muted" style="text-align:center;margin-top:5px">Perfect strikes charge the Super. Guard just before ⚠️ lands for a parry stun.</div>
    </div>`;
    const marker = board.querySelector('[data-marker]');
    const status = board.querySelector('[data-duel-status]');
    const enemyBar = board.querySelector('[data-enemy-bar]');
    const effectsEl = board.querySelector('[data-duel-effects]');
    const heartsEl = board.querySelector('[data-player-hearts]');
    const strikeBtn = board.querySelector('[data-strike]');
    const guardBtn = board.querySelector('[data-guard]');
    const telegraph = board.querySelector('[data-telegraph]');
    const superBar = board.querySelector('[data-super]');
    const superLabel = board.querySelector('[data-super-label]');
    const ultBtn = board.querySelector('[data-ultimate]');
    const ENEMY_MAX = 100;
    /* The bar is the opponent's resolve pool, the strike is this sprite's power
       against it, and the family chart decides whether that lands hard. */
    const strikePercent = typeof puffleStrikePercent === 'function' ? puffleStrikePercent(playerProfile, enemyProfile) : 22;
    /* Trait rolls: a Brave puffle's crits land, a Playful one slips hits. */
    const withCrit = (amount) => (Math.random() < critChance ? Math.round(amount * 1.6) : amount);
    /* The rival's own dodge: a clean strike can be slipped entirely. */
    const enemyDodges = () => {
      if (Math.random() >= enemyDodgeChance) return false;
      score += 2;
      charge(4);
      pulse(`${oppName} slips the hit — dodged!`, 'bad');
      Sfx.tick();
      return true;
    };
    let position = 12;
    let direction = 1;
    let enemyHp = ENEMY_MAX;
    let playerHp = 3;
    let score = 0;
    let perfects = 0;
    let parries = 0;
    let blocks = 0;
    let superGauge = 0;
    let last = performance.now();
    let elapsed = 0;
    let nextEnemy = 4.2;
    let guardUntil = 0;
    let guardAt = 0;
    let strikeCooldown = 0;
    let stunUntil = 0;

    function updateHud() {
      shell.scoreEl.textContent = score;
      enemyBar.style.width = `${Math.max(0, (enemyHp / ENEMY_MAX) * 100)}%`;
      heartsEl.textContent = '💛'.repeat(Math.max(0, playerHp)) + '🖤'.repeat(Math.max(0, 3 - playerHp));
      superBar.style.width = `${Math.min(100, superGauge)}%`;
      superLabel.textContent = superGauge >= 100 ? 'Super ready' : `Super ${Math.floor(superGauge)}%`;
      ultBtn.disabled = superGauge < 100 || !running;
      ultBtn.classList.toggle('ready', superGauge >= 100);
      if (effectsEl && typeof duelStatusChips === 'function') {
        effectsEl.innerHTML = duelStatusChips(rivalSide, '') + duelStatusChips(mineSide, 'You');
      }
    }

    function charge(amount) {
      superGauge = Math.min(100, superGauge + amount);
    }

    function pulse(text, tone = 'normal') {
      status.textContent = text;
      status.className = `duel-status ${tone}`;
      setTimeout(() => { if (running) status.className = 'duel-status'; }, 650);
    }

    function damage(amount) {
      const stunned = performance.now() < stunUntil;
      enemyHp -= stunned ? amount * 2 : amount;
      if (typeof duelOnStrike === 'function' && mineSide && rivalSide) {
        const path = duelOnStrike(mineSide, rivalSide, 0);
        if (path.heal) charge(path.heal * 4);
        if (path.log.length) pulse(path.log.join(' '), 'good');
      }
      const tick = typeof duelTickStatuses === 'function' ? duelTickStatuses(rivalSide) : null;
      if (tick && tick.damage) enemyHp -= tick.damage;
      if (enemyHp <= 0) finish(true);
    }

    function strike() {
      if (!running || strikeCooldown > 0) return;
      strikeCooldown = 0.28;
      const dist = Math.abs(position - 50);
      if (dist <= 6) {
        perfects += 1;
        score += 12;
        charge(16);
        pulse(performance.now() < stunUntil ? 'Stunned perfect strike! ⚡' : 'Perfect strike! ⚡', 'good');
        Sfx.win();
        burstOn(strikeBtn, ['⚡', '💥', '✨'], 7);
        const perfectHit = Math.round(strikePercent * 1.4);
        if (enemyDodges()) {
          /* the rival read it and slipped away */
        } else if (Math.random() < critChance) {
          score += 4;
          pulse('Critical strike! 💥', 'good');
          burstOn(strikeBtn, ['💥', '⚡', '🌟'], 9);
          damage(Math.round(perfectHit * 1.6));
        } else {
          damage(perfectHit);
        }
      } else if (dist <= 18) {
        score += 6;
        charge(8);
        pulse('Solid hit!', 'good');
        Sfx.pop();
        burstOn(strikeBtn, ['💥', '✨'], 4);
        if (!enemyDodges()) damage(withCrit(Math.max(6, Math.round(strikePercent * 0.8))));
      } else {
        playerHp -= 1;
        pulse(`Whiff! ${oppName} counters.`, 'bad');
        Sfx.error();
        tapHaptic(22);
      }
      guardUntil = 0;
      updateHud();
      if (playerHp <= 0) finish(false);
    }

    function guard() {
      if (!running) return;
      guardUntil = performance.now() + 900;
      guardAt = performance.now();
      pulse('Guard up — brace for the strike.', 'guard');
      guardBtn.classList.add('guarding');
      setTimeout(() => guardBtn.classList.remove('guarding'), 750);
      Sfx.tick();
    }

    function ultimate() {
      if (!running || superGauge < 100) return;
      superGauge = 0;
      pulse('🌟 ULTIMATE FINISHER!', 'good');
      Sfx.win();
      burstOn(ultBtn, ['🌟', '⚡', '💥'], 12);
      board.querySelector('.duel-stage')?.classList.add('duel-flash');
      setTimeout(() => board.querySelector('.duel-stage')?.classList.remove('duel-flash'), 420);
      damage(Math.round(strikePercent * 3.2));
      updateHud();
    }

    function enemyAttack(now) {
      if (rivalSide && rivalSide.freeze > 0) {
        rivalSide.freeze -= 1;
        score += 6;
        charge(10);
        pulse(`❄️ ${oppName} is frozen and cannot attack.`, 'good');
        nextEnemy = 4.2;
        updateHud();
        return;
      }
      const parried = now - guardAt <= 560 && guardAt > 0;
      if (parried) {
        parries += 1;
        score += 10;
        charge(22);
        stunUntil = now + 2200;
        pulse('⚡ PERFECT PARRY! Stunned!', 'good');
        Sfx.coin();
        telegraph.classList.add('parried');
        setTimeout(() => telegraph.classList.remove('parried'), 400);
      } else if (now < guardUntil) {
        blocks += 1;
        score += 4;
        charge(10);
        pulse('Blocked! Beautiful footwork.', 'guard');
        Sfx.coin();
      } else if (Math.random() < dodgeChance) {
        score += 5;
        charge(8);
        pulse(`Dodged! ${oppName} misses.`, 'guard');
        Sfx.tick();
      } else if (Math.random() < enemyCritChance) {
        /* The rival's crit takes two hearts: fights cut both ways. */
        playerHp -= 2;
        score = Math.max(0, score - 2);
        pulse(`💥 ${oppName} lands a critical hit!`, 'bad');
        burstOn(heartsEl, ['💥', '💔'], 6);
        Sfx.error();
        tapHaptic(34);
      } else if (mineSide && mineSide.shield > 0) {
        mineSide.shield -= 1;
        score += 3;
        charge(6);
        pulse('🛡 Shield soaks the hit.', 'guard');
        Sfx.tick();
      } else {
        playerHp -= 1;
        pulse(`${oppName} lands a heavy hit!`, 'bad');
        Sfx.error();
        tapHaptic(24);
      }
      guardAt = 0;
      updateHud();
      nextEnemy = 4.2;
      if (playerHp <= 0) finish(false);
    }

    function draw(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      strikeCooldown = Math.max(0, strikeCooldown - dt);
      position += direction * 70 * dt;
      if (position >= 88) { position = 88; direction = -1; }
      if (position <= 12) { position = 12; direction = 1; }
      marker.style.left = `${position}%`;
      const remaining = Math.max(0, 60 - elapsed);
      shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
      shell.timerBar.style.width = `${(remaining / 60) * 100}%`;
      const stunned = now < stunUntil;
      telegraph.style.opacity = stunned ? '0' : '0';
      if (!stunned) {
        nextEnemy -= dt;
        if (nextEnemy <= 0.8) {
          telegraph.style.opacity = '1';
          status.textContent = `⚠️ Incoming — guard now!`;
        }
        if (nextEnemy <= 0) enemyAttack(now);
      } else {
        telegraph.style.opacity = '0';
        if (status.textContent.indexOf('PARRY') < 0) status.textContent = 'Stunned — strike twice as hard!';
      }
      if (remaining <= 0) finish(enemyHp <= 0);
      if (running) raf = requestAnimationFrame(draw);
    }

    function finish(won) {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      const coins = won ? Math.min(170, 50 + score * 2 + playerHp * 12) : Math.min(60, 12 + score);
      const xp = won ? Math.min(95, 20 + score * 2) : Math.min(35, 8 + score);
      showGameResult(shell, {
        kind: 'duel', score, coins, xp, perfect: perfects + parries,
        blurb: won ? `${oppName} yields. Victory!` : `${oppName} wins this round. The Hollow is proud.`,
      });
    }

    strikeBtn.addEventListener('click', strike);
    guardBtn.addEventListener('click', guard);
    ultBtn.addEventListener('click', ultimate);
    updateHud();
    raf = requestAnimationFrame((now) => {
      last = now;
      draw(now);
    });
  }

  if (requested) start(requested);
  else if (!roster.length) start(brute);
  else showPicker();
}
