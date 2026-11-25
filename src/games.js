/* Touch-first minigames, all built from DOM so they work anywhere. */

const GAME_INFO = {
  catch: { title: 'Treat Catch', icon: '🍓', tag: 'Reflexes', desc: 'Tap falling treats. Dodge the pebbles.', g1: '#ff9a5a', g2: '#ff5e8a' },
  pulse: { title: 'Pulse Match', icon: '🎯', tag: 'Timing', desc: 'Tap when the rings line up. Chase perfects.', g1: '#8b7bff', g2: '#56c8e8' },
  copycat: { title: 'Sprite Says', icon: '🎵', tag: 'Memory', desc: 'Watch the pads, then repeat the pattern.', g1: '#ffd84d', g2: '#ff8a4c' },
  nectar: { title: 'Nectar Pop', icon: '🌸', tag: 'Reflexes', desc: 'Tap blooming flowers. Dodge grumpy bees.', g1: '#ff8fc8', g2: '#a3e635', unlock: 4 },
  match: { title: 'Moon Match', icon: '🌙', tag: 'Memory', desc: 'Flip moon cards and find every pair.', g1: '#8b7bff', g2: '#38bdf8', unlock: 12 },
  dig: { title: 'Coin Dig', icon: '🪙', tag: 'Reflexes & risk', desc: 'Tap buried coins and gems. Dodge the bombs.', g1: '#ffd166', g2: '#f2a23c' },
  cardclash: { title: 'Element Card Duel', icon: '🃏', tag: 'Cards', desc: 'Play elemental cards. Win rounds and fill the pantry.', g1: '#8b7bff', g2: '#38bdf8' },
  guardian: { title: 'Guardian Duel', icon: '⚔️', tag: 'Guardian bout', desc: 'Tap Strike before the guardian’s resolve breaks.', g1: '#8b7bff', g2: '#ffd166' },
};

/* Each shelf gets its own opening gesture. The palette and icon come from the
   game itself, so two reflex games still feel related while a card game, a
   trail and a sport do not arrive with the same pop. */
function gameIntroStyle(kind, info) {
  const tag = String(info && info.tag || '').toLowerCase();
  if (info && info.sportGame) return 'bounce';
  if (info && info.walkGame) return 'trail';
  if (/card|duel/.test(tag)) return 'fan';
  if (/memory/.test(tag)) return 'flip';
  if (/timing/.test(tag)) return 'pulse';
  if (/reflex/.test(tag)) return 'burst';
  return 'pop';
}

/* `overrideInfo` lets a game whose theming changes with the world (the event
   vigil takes the live preset's name, colour and mote) use this shell without
   parking a card in GAME_INFO that the Play screen would list all year. */
function gameOverlayShell(kind, overrideInfo = null) {
  const info = overrideInfo || GAME_INFO[kind] || { title: 'Mini Game', icon: '🎮', tag: 'Arcade', desc: 'Play and win rewards.', g1: '#8b7bff', g2: '#ffd166' };
  const introStyle = gameIntroStyle(kind, info);
  const intro = `<div class="game-intro game-intro--${introStyle}" data-game-intro="${esc(kind)}" style="--game-a:${info.g1 || '#8b7bff'};--game-b:${info.g2 || '#ffd166'}" aria-hidden="true">
    <span class="game-intro__halo"></span>
    <span class="game-intro__icon">${info.icon || '🎮'}</span>
    <span class="game-intro__title">${esc(info.title || 'Mini Game')}</span>
  </div>`;
  const app = document.getElementById('app');
  const wrap = document.createElement('div');
  wrap.className = 'game-overlay';
  wrap.innerHTML = `
    <div class="game-top">
      <button class="icon-btn" data-quit aria-label="Quit game">${icon('close')}</button>
      <div class="game-head">
        <h2>${info.title}</h2>
        <div class="tiny muted">${info.tag}</div>
      </div>
      <button class="icon-btn" data-fav aria-label="Favourite game" title="Favourite game" aria-pressed="false">☆</button>
      <button class="icon-btn layout-toggle" data-layout-toggle aria-label="Layout debug" title="Layout debug">⤢</button>
      <button class="icon-btn" data-fullscreen aria-label="Fullscreen" title="Fullscreen">⛶</button>
      <div class="gstat" aria-live="polite" aria-label="Current score"><b data-score>0</b><span>Score</span></div>
      <div class="gstat gstat-best" title="Best score" aria-label="Best score"><b data-best>0</b><span>Best</span></div>
    </div>
    <div class="game-board" data-board></div>
    ${intro}
    <div class="game-foot">
      <div class="between tiny muted" style="margin-bottom:6px"><span data-hint>${info.desc}</span><span data-timer>—</span></div>
      <div class="game-timer"><i data-timerbar style="width:100%"></i></div>
    </div>`;
  app.appendChild(wrap);
  app.classList.add('game-open');
  /* One star per game, in the shared shell so every mini game has it. The list
     lives in the save, so the short list survives a reload and a merge. */
  const favBtn = wrap.querySelector('[data-fav]');
  const syncFavBtn = () => {
    const on = typeof isFavoriteGame === 'function' && isFavoriteGame(kind);
    favBtn.textContent = on ? '★' : '☆';
    favBtn.classList.toggle('on', on);
    favBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  syncFavBtn();
  favBtn.addEventListener('click', () => {
    if (typeof toggleFavoriteGame !== 'function') return;
    const res = toggleFavoriteGame(kind);
    if (!res.ok) return;
    syncFavBtn();
    if (typeof toast === 'function') {
      toast(res.on ? `★ ${info.title} added to favourites.` : `${info.title} removed from favourites.`, '★');
    }
  });
  const layoutBtn = wrap.querySelector('[data-layout-toggle]');
  const syncLayoutBtn = () => layoutBtn.classList.toggle('on', layoutDebugEnabled());
  syncLayoutBtn();
  mountLayoutDebug(wrap, layoutDebugEnabled());
  layoutBtn.addEventListener('click', () => {
    toggleLayoutDebug();
    syncLayoutBtn();
  });
  let closed = false;
  let cleanup = [];
  /* Fullscreen lives in the shared shell, so every mini game gets it. */
  const fsBtn = wrap.querySelector('[data-fullscreen]');
  const fsActive = () => document.fullscreenElement === wrap || document.webkitFullscreenElement === wrap;
  const syncFs = () => {
    const on = fsActive();
    fsBtn.classList.toggle('on', on);
    fsBtn.textContent = on ? '⤡' : '⛶';
    fsBtn.setAttribute('aria-label', on ? 'Leave fullscreen' : 'Fullscreen');
  };
  if (!(wrap.requestFullscreen || wrap.webkitRequestFullscreen)) fsBtn.style.display = 'none';
  fsBtn.addEventListener('click', () => {
    try {
      if (fsActive()) {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else if (wrap.requestFullscreen) {
        wrap.requestFullscreen().catch(() => toast('This device would not go fullscreen.', '⛶'));
      } else if (wrap.webkitRequestFullscreen) {
        wrap.webkitRequestFullscreen();
      }
    } catch { toast('This device would not go fullscreen.', '⛶'); }
  });
  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('webkitfullscreenchange', syncFs);
  cleanup.push(() => {
    document.removeEventListener('fullscreenchange', syncFs);
    document.removeEventListener('webkitfullscreenchange', syncFs);
    if (fsActive()) {
      try {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } catch { /* ignore */ }
    }
  });
  const close = () => {
    if (closed) return;
    closed = true;
    cleanup.forEach((fn) => { try { fn(); } catch {} });
    wrap.remove();
    if (!app.querySelector('.game-overlay')) app.classList.remove('game-open');
  };
  wrap.querySelector('[data-quit]').addEventListener('click', () => {
    close();
    toast('Game ended early — no reward this time.', '🎮');
  });
  const bestEl = wrap.querySelector('[data-best]');
  if (bestEl && typeof GameScores !== 'undefined' && typeof state !== 'undefined') {
    bestEl.textContent = GameScores.best(state, kind).toLocaleString('en-US');
  }
  return {
    wrap,
    board: wrap.querySelector('[data-board]'),
    scoreEl: wrap.querySelector('[data-score]'),
    bestEl,
    timerEl: wrap.querySelector('[data-timer]'),
    timerBar: wrap.querySelector('[data-timerbar]'),
    hintEl: wrap.querySelector('[data-hint]'),
    addCleanup: (fn) => cleanup.push(fn),
    close,
    isClosed: () => closed,
  };
}

function gameMiniSprite() {
  const s = activeSprite();
  if (!s) return '';
  return `<div class="game-pet-mini">${spriteSVG(s, { expr: 'happy' })}</div>`;
}

/* The result card's best line, as one definition: the arcade card, the sports
   panels, the trail summary and the duel all end a run with it. `record` is the
   GameScores.card the caller read before collecting the run. Pass the run's
   score where that path pays a record bonus; omit it where it pays none, and
   the line still names the best without promising coins. */
function bestChips(record, score) {
  if (!record) return '';
  const bonus = record.isBest && Number.isFinite(Number(score)) ? GameScores.bonus(score) : 0;
  return `<span class="chip" style="background:#fef3c7;color:#92400e">🏅 Best ${record.bestLine}</span>`
    + (record.isBest ? '<span class="chip" style="background:#dcfce7;color:#166534">✨ New best!</span>' : '')
    + (bonus ? `<span class="chip" style="background:#fef3c7;color:#92400e">🏆 +${bonus} for the record</span>` : '');
}

/* `event` is the fortnight the run is paid under; the default is the live one,
   and passing it explicitly is how a caller (or a test) names the boost that
   the payout preview has to include. */
function showGameResult(shell, { kind, score, coins, xp, blurb, perfect = 0, event = null, foodKeys = [], distinctFoods = false, rewardHtml = '', collect = null, onCollected = null }) {
  const s = activeSprite();
  const used = shell.wrap.querySelector('.game-result');
  if (used) return;
  const bonusFoodKeys = [...new Set(Array.isArray(foodKeys) ? foodKeys : [])]
    .filter((key) => typeof FOODS !== 'undefined' && FOODS[key]);
  const finalScore = Number.isFinite(Number(score))
    ? Number(score).toLocaleString('en-US')
    : String(score == null ? 0 : score);
  /* The best is read before the run is collected, so the card can name the
     record this run just set instead of reading it back afterwards. */
  const record = typeof GameScores !== 'undefined' && typeof state !== 'undefined'
    ? GameScores.card(state, kind, score)
    : null;
  if (shell.scoreEl) shell.scoreEl.textContent = finalScore;
  if (typeof Sfx !== 'undefined') Sfx[score > 0 ? 'chime' : 'pop']();
  const preview = typeof gameCoinPayout === 'function'
    ? gameCoinPayout(coins)
    : { payout: typeof gameCoinBase === 'function' ? gameCoinBase(coins) : 300, rarityBonus: 0 };
  /* The action applies the live fortnight's boost and then the coin cap; the
     preview has to use the same two rules or it promises a number the toast
     and the wallet then contradict. */
  const liveEvent = event || (typeof WeeklyChallenge !== 'undefined' && typeof WeeklyChallenge.eventFor === 'function'
    ? WeeklyChallenge.eventFor()
    : null);
  const boost = liveEvent && liveEvent.game === kind ? liveEvent : null;
  const previewCoins = Math.round(preview.payout * (boost ? boost.coinBoost : 1));
  const boostedXp = Math.round(Math.max(120, (Number(xp) || 25) * 4) * (boost ? boost.xpBoost : 1));
  /* The puffle's favourite game is a comfort that names a real minigame, so the
     result card says when this run was that game. */
  const favourites = s && typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const lovedGame = !!(favourites && favourites.game && favourites.game.game === kind);
  const result = document.createElement('div');
  result.className = 'game-result';
  result.innerHTML = `
    <div class="gr-inner">
      <div class="gr-emoji">${score > 0 ? '🎉' : '🌱'}</div>
      <div class="gr-score" data-final-score><span>Final score</span><b>${finalScore}</b></div>
      <h3>${blurb || 'Nice run!'}</h3>
      <p class="muted small">${s ? `${displayName(s)} had a great time.` : 'The Hollow cheers for you.'}${perfect ? ` ${perfect} perfect${perfect > 1 ? 's' : ''}!` : ''}</p>
      <div class="gr-rewards">${rewardHtml || `
        <span class="chip" style="background:#fef08a;color:#854d0e;font-weight:700">🪙 +${previewCoins.toLocaleString()} coins</span>
        ${boost ? `<span class="chip" style="background:#fef3c7;color:#92400e" title="${esc(boost.blurb)}">${boost.icon} ${esc(boost.name)}</span>` : ''}
        ${preview.rarityBonus ? `<span class="chip chip-mut">✦ +${preview.rarityBonus.toLocaleString()} rarity</span>` : ''}
        <span class="chip">⭐ +${boostedXp} XP</span>
        <span class="chip" style="background:#e0e7ff;color:#3730a3">🌟 +1 Starpath Feast</span>
        <span class="chip" style="background:#dcfce7;color:#166534">🍱 +2-3 Pantry Foods</span>
        ${bonusFoodKeys.map((key) => `<span class="chip" style="background:#dcfce7;color:#166534">${FOODS[key].emoji} +1 ${esc(FOODS[key].name)}</span>`).join('')}
        <span class="chip" style="background:#fce7f3;color:#9d174d">🎁 +2 Snack Gifts</span>
        <span class="chip">💗 +bond${boost && boost.bondBonus ? ` +${boost.bondBonus}` : ''}</span>
        ${lovedGame ? `<span class="chip" style="background:#fce7f3;color:#9d174d" title="This puffle's favourite game">${favourites.game.icon} ${esc(favourites.game.name)} · +4 Joy +2 bond</span>` : ''}
        ${bestChips(record, score)}
        ${typeof arcadeGameKind === 'function' && arcadeGameKind(kind) ? `<span class="chip">🏟️ +${previewCoins.toLocaleString()} arcade progress</span>` : ''}
        ${typeof waveRewardChips === 'function' ? waveRewardChips(kind, score) : ''}
      `}</div>
      <button class="btn btn-gold btn-block" data-collect style="margin-top:14px">Collect rewards</button>
    </div>`;
  shell.board.appendChild(result);
  let collected = false;
  result.querySelector('[data-collect]').addEventListener('click', () => {
    if (collected) return;
    collected = true;
    const res = typeof collect === 'function'
      ? collect()
      : Actions.finishGame({ game: kind, score, coins, xp, joy: 16, foodKeys: bonusFoodKeys, distinctFoods });
    Sfx.win();
    if (typeof collect === 'function') {
      if (typeof onCollected === 'function') onCollected(res);
      shell.close();
      if (typeof App !== 'undefined' && App.refresh) App.refresh();
      return;
    }
    const madeFoods = (res?.recipeFoods || []).map((key) => `${FOODS[key].emoji} ${FOODS[key].name}`).join(' · ');
    toast(`+${(res?.coins || previewCoins).toLocaleString()} coins · 🌟 Starpath Feast · 🍱 Pantry Foods!${madeFoods ? ` · ${madeFoods}` : ''}${res?.bestBonus ? ` · 🏆 +${res.bestBonus} record bonus` : ''}`, '🏆');
    burstOn(result.querySelector('[data-collect]'), ['🪙', '✨', '🌟', '🍱', '💗'], 10);
    /* A win is the manifest's victory animation: its frame count over its fps
       sets how long the result emoji celebrates. */
    const winArt = result.querySelector('.gr-emoji');
    if (winArt && typeof spriteAnimationDuration === 'function') {
      winArt.style.animationDuration = `${spriteAnimationDuration('victory', 900)}ms`;
    }
    shell.close();
    const snackKeys = Array.isArray(res?.snacks) ? res.snacks.filter((key) => SNACKS[key]) : [];
    if (res?.careGift) {
      gameGiftPop({
        kind: 'care',
        icon: '🌈',
        title: 'Care Package!',
        detail: `+${res.careGift.coins} coins · +${res.careGift.xp} XP · ${SNACKS[res.careGift.snackKey]?.name || 'a snack'}`,
      });
    } else if (snackKeys.length) {
      gameGiftPop({
        kind: 'snack',
        icon: SNACKS[snackKeys[0]].emoji,
        title: 'Snack Gift!',
        detail: `${SNACKS[snackKeys[0]].name}${snackKeys[1] ? ` & ${SNACKS[snackKeys[1]].name}` : ''}`,
      });
    }
    if (typeof App !== 'undefined' && App.refresh) App.refresh();
  });
  shell.addCleanup(() => {});
}

/* A short, non-blocking present-opening beat for gifts won inside a game.
   The caller names the gift family, which picks the motion and the palette. */
function gameGiftPop({ kind = 'snack', icon = '🎁', title = 'A gift!', detail = '' } = {}) {
  const tone = /^[a-z]+$/.test(String(kind)) ? kind : 'snack';
  const pop = document.createElement('div');
  pop.className = `game-gift-pop game-gift-pop--${tone}`;
  pop.setAttribute('role', 'status');
  pop.setAttribute('aria-live', 'polite');
  pop.innerHTML = `<span class="game-gift-pop__halo" aria-hidden="true"></span>
    <span class="game-gift-pop__icon" aria-hidden="true">${esc(icon)}</span>
    <b>${esc(title)}</b>
    <span class="game-gift-pop__detail">${esc(detail)}</span>`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 2400);
}

/* ---------------- TREAT CATCH ---------------- */
function openCatchGame() {
  const shell = gameOverlayShell('catch');
  const { board } = shell;
  board.innerHTML = `<div class="game-msg"><div><h3>Catch the treats!</h3><p>Slide the basket under the snacks. Chained catches are worth more.</p></div></div>
    <div class="catch-zone" data-catch-zone></div>
    <div class="catch-basket" data-catch-basket aria-hidden="true"><span>🧺</span></div>
    <div class="catch-move">
      <button class="catch-arrow" type="button" data-catch-left aria-label="Move the basket left">◀</button>
      <span class="tiny muted" data-catch-combo>Combo ×1</span>
      <button class="catch-arrow" type="button" data-catch-right aria-label="Move the basket right">▶</button>
    </div>${gameMiniSprite()}`;
  const zone = board.querySelector('[data-catch-zone]');
  const basket = board.querySelector('[data-catch-basket]');
  const comboEl = board.querySelector('[data-catch-combo]');
  const treats = ['🍓', '🍯', '🍭', '🍰', '🍒', '🥝'];
  const bombs = ['🪨', '🌰', '🦴'];
  const DURATION = 20000;
  const CATCH_LINE = 84;
  const HALF_WIDTH = 12;
  let score = 0;
  let running = true;
  let items = [];
  let lastSpawn = 0;
  let startedAt = performance.now();
  let basketX = 50;
  let targetX = 50;
  let combo = 0;
  let longest = 0;
  let raf = 0;
  let last = performance.now();

  setTimeout(() => {
    const msg = board.querySelector('.game-msg');
    if (msg) msg.remove();
  }, 1600);

  function multiplier() {
    return Math.min(4, 1 + Math.floor(combo / 2));
  }

  function paintCombo() {
    comboEl.textContent = `Combo ×${multiplier()}`;
    comboEl.classList.toggle('hot', combo >= 4);
  }

  function nudge(delta) {
    targetX = Math.max(8, Math.min(92, targetX + delta));
  }

  function point(clientX) {
    const rect = board.getBoundingClientRect();
    if (!rect.width) return;
    targetX = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
  }

  function pop(text, x, y, tone) {
    const float = document.createElement('div');
    float.className = `float-score catch-float ${tone || ''}`;
    float.style.left = `${x}%`;
    float.style.top = `${y}%`;
    float.textContent = text;
    board.appendChild(float);
    setTimeout(() => float.remove(), 800);
  }

  function collect(item) {
    if (item.dead) return;
    item.dead = true;
    combo += 1;
    longest = Math.max(longest, combo);
    const points = multiplier();
    score += points;
    Sfx.coin();
    pop(`+${points}`, item.x, item.y, 'good');
    item.el.style.transform = 'translate(-50%, -50%) scale(1.4)';
    item.el.style.opacity = '0';
    setTimeout(() => item.el.remove(), 240);
    paintCombo();
    shell.scoreEl.textContent = score;
  }

  function bust(item) {
    item.dead = true;
    score = Math.max(0, score - 2);
    combo = 0;
    paintCombo();
    Sfx.error();
    tapHaptic(20);
    pop('-2', item.x, item.y, 'bad');
    basket.classList.add('shaken');
    setTimeout(() => basket.classList.remove('shaken'), 320);
    item.el.remove();
    shell.scoreEl.textContent = score;
  }

  function spawn() {
    const isBomb = score >= 3 && chance(0.26);
    const el = document.createElement('button');
    el.className = `falling${isBomb ? ' bomb' : ''}`;
    el.type = 'button';
    el.textContent = isBomb ? pick(bombs) : pick(treats);
    const x = rand(12, 88);
    el.style.left = `${x}%`;
    el.style.top = '-8%';
    const item = { el, x, y: -8, speed: rand(24, 36), drift: rand(-5, 5), bomb: isBomb, dead: false };
    el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!running || item.dead || item.bomb) return;
      collect(item);
    });
    zone.appendChild(el);
    items.push(item);
    lastSpawn = performance.now();
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    basketX += (targetX - basketX) * Math.min(1, dt * 14);
    basket.style.left = `${basketX}%`;
    if (now - lastSpawn > Math.max(340, 700 - score * 16)) spawn();
    items.forEach((item) => {
      if (item.dead) return;
      item.y += item.speed * dt;
      item.x = Math.max(8, Math.min(92, item.x + item.drift * dt));
      item.el.style.top = `${item.y}%`;
      item.el.style.left = `${item.x}%`;
      if (item.y >= CATCH_LINE) {
        if (Math.abs(item.x - basketX) <= HALF_WIDTH) {
          if (item.bomb) bust(item);
          else collect(item);
        } else if (item.bomb) {
          item.dead = true;
          item.el.remove();
        } else {
          item.dead = true;
          combo = 0;
          paintCombo();
          pop('miss', item.x, CATCH_LINE, 'bad');
          item.el.remove();
        }
      }
    });
    items = items.filter((item) => !item.dead);
    const left = Math.max(0, DURATION - (now - startedAt));
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;
    if (left <= 0) {
      running = false;
      shell.timerEl.textContent = '0.0s';
      finish();
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function finish() {
    const coins = Math.min(90, 8 + score * 3);
    const xp = 10 + score * 2;
    showGameResult(shell, {
      kind: 'catch', score, coins, xp, perfect: Math.max(0, longest - 1),
      blurb: score >= 24 ? 'Basket legend!' : score >= 14 ? 'Great catching!' : score > 0 ? 'Not bad!' : 'The treats won this time.',
    });
  }

  zone.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    point(event.clientX);
  });
  zone.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse') point(event.clientX);
  });
  board.querySelector('[data-catch-left]').addEventListener('click', () => nudge(-9));
  board.querySelector('[data-catch-right]').addEventListener('click', () => nudge(9));
  const onKey = (event) => {
    if (!running) return;
    if (event.key === 'ArrowLeft' || event.key === 'a') { nudge(-8); event.preventDefault(); }
    else if (event.key === 'ArrowRight' || event.key === 'd') { nudge(8); event.preventDefault(); }
  };
  document.addEventListener('keydown', onKey);

  paintCombo();
  raf = requestAnimationFrame((t) => {
    startedAt = t;
    last = t;
    loop(t);
  });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    items.forEach((item) => item.el.remove());
  });
}

/* ---------------- PULSE MATCH ---------------- */
function openPulseGame() {
  const shell = gameOverlayShell('pulse');
  const { board } = shell;
  const TARGET = 62;
  const ROUNDS = 8;
  board.innerHTML = `<div class="pulse-wrap">
      <div class="pulse-ring" style="width:${TARGET * 2}px;height:${TARGET * 2}px"></div>
      <div class="pulse-fill" data-fill></div>
      <div class="pulse-core" style="width:30px;height:30px"></div>
      <div class="pulse-label" data-label>Get ready…</div>
      <div class="pulse-judge" data-judge aria-live="polite"></div>
      <div class="pulse-tap" data-taps>Tap or press Space</div>
    </div>${gameMiniSprite()}`;
  const fill = board.querySelector('[data-fill]');
  const label = board.querySelector('[data-label]');
  const judge = board.querySelector('[data-judge]');
  const tapsEl = board.querySelector('[data-taps]');
  const PERFECT = ['PERFECT!!', 'PERFECT!!', 'PERFECT!!'];
  const GREAT = ['GREAT!', 'GREAT!'];
  let round = 0;
  let score = 0;
  let running = true;
  let radius = 132;
  let shrinking = false;
  let raf = 0;
  let paused = false;
  let last = 0;
  let combo = 0;
  let bestCombo = 0;
  let perfects = 0;

  function setRing(r) {
    radius = r;
    fill.style.width = `${r * 2}px`;
    fill.style.height = `${r * 2}px`;
  }

  function showJudge(text, tone) {
    judge.textContent = text;
    judge.className = `pulse-judge ${tone}`;
  }

  function startRound() {
    if (!running) return;
    paused = false;
    shrinking = true;
    setRing(132);
    tapsEl.textContent = 'Tap or press Space';
    label.textContent = `Pulse ${round + 1} / ${ROUNDS}`;
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    if (!running) return;
    if (!paused && shrinking) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const next = radius - 92 * dt;
      setRing(next);
      if (next <= 18) {
        shrinking = false;
        paused = true;
        combo = 0;
        label.textContent = `Pulse ${round + 1} / ${ROUNDS}`;
        showJudge('MISS', 'miss');
        tapsEl.textContent = 'Too slow — combo lost';
        Sfx.error();
        setTimeout(nextRound, 550);
        return;
      }
    }
    raf = requestAnimationFrame(loop);
  }

  function tap() {
    if (!running || paused || !shrinking) return;
    const diff = Math.abs(radius - TARGET);
    let base = 0;
    let tone = 'miss';
    let text = 'MISS';
    if (diff <= 8) {
      base = 3;
      tone = 'perfect';
      text = pick(PERFECT);
      perfects += 1;
      combo += 1;
      Sfx.coin();
    } else if (diff <= 18) {
      base = 2;
      tone = 'great';
      text = pick(GREAT);
      combo += 1;
      Sfx.click();
    } else if (diff <= 30) {
      base = 1;
      tone = 'good';
      text = 'GOOD';
      combo = 0;
      Sfx.tick();
    } else {
      combo = 0;
      Sfx.error();
    }
    bestCombo = Math.max(bestCombo, combo);
    const mult = 1 + Math.min(3, Math.floor(combo / 2));
    const points = base * mult;
    score += points;
    shell.scoreEl.textContent = score;
    showJudge(text, tone);
    tapsEl.textContent = points ? `+${points}${mult > 1 ? ` · ×${mult}` : ''}` : 'Off the ring';
    shrinking = false;
    paused = true;
    setTimeout(nextRound, 420);
  }

  function nextRound() {
    if (!running) return;
    round += 1;
    if (round >= ROUNDS) {
      finish();
      return;
    }
    startRound();
  }

  const onKey = (event) => {
    if (event.code === 'Space' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      tap();
    }
  };
  document.addEventListener('keydown', onKey);
  board.addEventListener('pointerdown', tap);

  function finish() {
    running = false;
    cancelAnimationFrame(raf);
    const coins = Math.min(70, 8 + score * 3);
    const xp = 10 + score * 2;
    showGameResult(shell, {
      kind: 'pulse', score, coins, xp, perfect: perfects,
      blurb: perfects >= 5 ? 'Timing wizard!' : bestCombo >= 3 ? 'Locked in!' : 'Keep practicing!',
    });
  }

  setTimeout(() => { if (running) startRound(); }, 650);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
  });
}

/* ---------------- SPRITE SAYS ---------------- */
function openCopycatGame() {
  const shell = gameOverlayShell('copycat');
  const { board } = shell;
  const PAD_TONES = [392, 523, 659, 784];
  board.innerHTML = `<div class="pads">
      <button class="pad" data-pad="0" aria-label="Rose pad"></button>
      <button class="pad" data-pad="1" aria-label="Tide pad"></button>
      <button class="pad" data-pad="2" aria-label="Leaf pad"></button>
      <button class="pad" data-pad="3" aria-label="Sun pad"></button>
    </div>
    <div class="game-msg" data-msg><div><h3>Watch closely…</h3><p>The sprite will play a pattern. Repeat it.</p></div></div>
    ${gameMiniSprite()}`;
  const pads = [...board.querySelectorAll('.pad')];
  const msg = board.querySelector('[data-msg]');
  let sequence = [];
  let inputIndex = 0;
  let round = 0;
  let running = true;
  let accepting = false;
  const timers = [];
  const MAX_ROUNDS = 7;

  function later(fn, ms) {
    const id = setTimeout(() => { if (running) fn(); }, ms);
    timers.push(id);
    return id;
  }

  function flash(padIndex, duration = 420) {
    const pad = pads[padIndex];
    pad.classList.add('lit');
    Sfx.tone(PAD_TONES[padIndex], 0.22, 'sine', 0.05, 0, 40);
    later(() => pad.classList.remove('lit'), duration);
  }

  function playback() {
    accepting = false;
    msg.innerHTML = '<div><h3>Watch…</h3><p>Round ' + (round + 1) + '</p></div>';
    sequence.forEach((val, i) => {
      later(() => flash(val), 480 + i * 540);
    });
    later(() => {
      msg.innerHTML = '<div><h3>Your turn</h3><p>Repeat the pattern</p></div>';
      accepting = true;
      inputIndex = 0;
    }, 480 + sequence.length * 540 + 180);
  }

  function nextRound() {
    round += 1;
    sequence.push(randInt(0, 3));
    shell.scoreEl.textContent = round - 1;
    playback();
  }

  function press(idx) {
    if (!running || !accepting) return;
    flash(idx, 220);
    if (sequence[inputIndex] !== idx) {
      accepting = false;
      pads[idx].classList.add('wrong');
      later(() => pads[idx].classList.remove('wrong'), 350);
      msg.innerHTML = '<div><h3>Oops!</h3><p>Wrong pad. The sprite is very forgiving.</p></div>';
      Sfx.error();
      later(() => finish(false), 800);
      return;
    }
    inputIndex += 1;
    if (inputIndex >= sequence.length) {
      accepting = false;
      shell.scoreEl.textContent = round;
      if (round >= MAX_ROUNDS) {
        msg.innerHTML = '<div><h3>Flawless!</h3><p>You remembered everything.</p></div>';
        later(() => finish(true), 700);
        return;
      }
      msg.innerHTML = '<div><h3>Nice!</h3><p>Next pattern…</p></div>';
      later(nextRound, 750);
    }
  }

  pads.forEach((pad, idx) => {
    pad.addEventListener('pointerdown', (e) => { e.preventDefault(); press(idx); });
  });

  function finish(won) {
    if (!running) return;
    running = false;
    timers.forEach(clearTimeout);
    const score = sequence.length - 1 + (won ? 1 : 0);
    const coins = Math.min(80, 10 + score * 8);
    const xp = 12 + score * 4;
    showGameResult(shell, {
      kind: 'copycat', score, coins, xp,
      blurb: won ? 'Perfect memory!' : score >= 4 ? 'Sharp memory!' : 'Good start!',
    });
  }

  later(() => {
    msg.innerHTML = '';
    nextRound();
  }, 1200);

  shell.addCleanup(() => {
    running = false;
    timers.forEach(clearTimeout);
  });
}

/* ---------------- NECTAR POP ---------------- */
function openNectarGame() {
  const shell = gameOverlayShell('nectar');
  const { board } = shell;
  board.innerHTML = `<div class="nectar-grid">
      ${Array.from({ length: 12 }, (_, i) => `<button class="nectar-pad" data-pad="${i}" aria-label="Nectar flower"></button>`).join('')}
    </div>${gameMiniSprite()}`;
  const pads = [...board.querySelectorAll('.nectar-pad')];
  const timers = new Set();
  let score = 0;
  let running = true;
  let remaining = 22;

  function clearPad(pad) {
    if (pad._bloomTimer) clearTimeout(pad._bloomTimer);
    pad._bloomTimer = null;
    pad.className = 'nectar-pad';
    pad.textContent = '';
    delete pad.dataset.state;
  }

  function spawn() {
    if (!running) return;
    const idle = pads.filter((p) => !p.dataset.state);
    for (let n = 0; n < 2 && idle.length; n++) {
      const index = randInt(0, idle.length - 1);
      const pad = idle.splice(index, 1)[0];
      const bee = score >= 6 && chance(0.18);
      pad.dataset.state = bee ? 'bee' : 'flower';
      pad.classList.add(bee ? 'bee' : 'lit');
      pad.textContent = bee ? '🐝' : pick(['🌸', '🌼', '🌺', '💠']);
      pad._bloomTimer = setTimeout(() => { if (running) clearPad(pad); }, rand(720, 1180));
    }
  }

  pads.forEach((pad) => {
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (!running || !pad.dataset.state) return;
      if (pad.dataset.state === 'flower') {
        score += 1;
        Sfx.pop();
        burstOn(pad, ['✨', '🌼', '💛'], 4);
      } else {
        score = Math.max(0, score - 1);
        Sfx.error();
        tapHaptic(18);
      }
      shell.scoreEl.textContent = score;
      clearPad(pad);
    });
  });

  const spawnTimer = setInterval(spawn, 520);
  const clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / 22) * 100}%`;
    if (remaining <= 0) finish();
  }, 100);
  timers.add(spawnTimer);
  timers.add(clock);
  spawn();

  function finish() {
    if (!running) return;
    running = false;
    timers.forEach(clearInterval);
    pads.forEach(clearPad);
    const coins = Math.min(90, 8 + score * 4);
    const xp = 10 + score * 2;
    showGameResult(shell, {
      kind: 'nectar', score, coins, xp,
      blurb: score >= 18 ? 'Nectar everywhere!' : score >= 10 ? 'Pollinator pro!' : score >= 4 ? 'Sweet reflexes!' : 'The bees win this one.',
    });
  }

  shell.addCleanup(() => {
    running = false;
    timers.forEach(clearInterval);
    pads.forEach(clearPad);
  });
}

/* ---------------- MOON MATCH ---------------- */
function openMatchGame() {
  const shell = gameOverlayShell('match');
  const { board } = shell;
  const faces = ['🌙', '⭐', '🌸', '🍓', '💧'];
  const deck = shuffle([...faces, ...faces]);
  board.innerHTML = `<div class="match-grid">
      ${deck.map((face, i) => `<button class="match-card" data-card="${i}" data-face="${face}" aria-label="Moon card ${i + 1}"><span>✦</span></button>`).join('')}
    </div>${gameMiniSprite()}`;
  const cards = [...board.querySelectorAll('.match-card')];
  const timers = new Set();
  let first = null;
  let locked = false;
  let pairs = 0;
  let remaining = 40;
  let running = true;

  function later(fn, ms) {
    const id = setTimeout(() => { if (running) fn(); }, ms);
    timers.add(id);
    return id;
  }

  function hide(card) {
    card.classList.remove('flipped');
    card.innerHTML = '<span>✦</span>';
  }

  cards.forEach((card) => {
    card.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (!running || locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      card.textContent = card.dataset.face;
      Sfx.tone(520, 0.1, 'sine', 0.04, 0, 30);
      if (!first) {
        first = card;
        return;
      }
      if (first.dataset.face === card.dataset.face) {
        first.classList.add('matched');
        card.classList.add('matched');
        first = null;
        pairs += 1;
        shell.scoreEl.textContent = pairs;
        Sfx.pop();
        burstOn(card, ['✨', '🌙', '💛'], 4);
        if (pairs === faces.length) finish(true);
      } else {
        locked = true;
        const a = first;
        const b = card;
        first = null;
        later(() => {
          hide(a);
          hide(b);
          locked = false;
        }, 720);
      }
    });
  });

  const clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / 40) * 100}%`;
    if (remaining <= 0) finish(false);
  }, 100);
  timers.add(clock);

  function finish(won) {
    if (!running) return;
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
    const coins = 10 + pairs * 7;
    const xp = 8 + pairs * 4;
    showGameResult(shell, {
      kind: 'match', score: pairs, coins, xp,
      blurb: won ? 'Every pair found!' : pairs >= 3 ? 'A sharp moon-memory!' : 'The cards are shy today.',
    });
  }

  shell.addCleanup(() => {
    running = false;
    timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
  });
}

/* ---------------- COIN DIG ---------------- */
function openDigGame() {
  const shell = gameOverlayShell('dig');
  const { board } = shell;
  const SIZE = 4;
  const CELLS = SIZE * SIZE;
  board.innerHTML = `<div class="dig-wrap">
      <div class="dig-hud">
        <span data-dig-hearts class="dig-hearts">💛💛💛</span>
        <span class="tiny muted" data-dig-bank>Banked 0</span>
      </div>
      <div class="dig-grid" data-dig-grid></div>
      <button class="btn btn-gold btn-block" type="button" data-dig-cash>💰 Cash out</button>
      <div class="tiny muted dig-hint">Numbers count the bombs touching a tile. Three hearts: cash out before the last one goes.</div>
    </div>${gameMiniSprite()}`;
  const grid = board.querySelector('[data-dig-grid]');
  const heartsEl = board.querySelector('[data-dig-hearts]');
  const bankEl = board.querySelector('[data-dig-bank]');
  const cashBtn = board.querySelector('[data-dig-cash]');
  const DURATION = 45;
  let score = 0;
  let hearts = 3;
  let running = true;
  let remaining = DURATION;
  let opened = 0;
  let clock = 0;

  const kinds = [];
  for (let i = 0; i < 4; i++) kinds.push('bomb');
  for (let i = 0; i < 3; i++) kinds.push('gem');
  for (let i = 0; i < 3; i++) kinds.push('key');
  while (kinds.length < CELLS) kinds.push('coin');
  const layout = shuffle(kinds);
  const bombs = new Set();
  layout.forEach((kind, index) => { if (kind === 'bomb') bombs.add(index); });

  function neighbours(index) {
    const x = index % SIZE;
    const y = Math.floor(index / SIZE);
    const out = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        out.push(ny * SIZE + nx);
      }
    }
    return out;
  }

  function bombNeighbours(index) {
    return neighbours(index).filter((near) => bombs.has(near)).length;
  }

  grid.innerHTML = layout.map((_, index) => `<button class="dig-tile" type="button" data-dig="${index}" aria-label="Dig tile ${index + 1}"></button>`).join('');
  const tiles = [...grid.querySelectorAll('[data-dig]')];

  function paintHud() {
    heartsEl.textContent = '💛'.repeat(Math.max(0, hearts)) + '🖤'.repeat(Math.max(0, 3 - hearts));
    bankEl.textContent = `Banked ${score}`;
    shell.scoreEl.textContent = score;
  }

  function reveal(tile, index) {
    tile.classList.add('dug');
    tile.disabled = true;
    opened += 1;
    const kind = layout[index];
    if (kind === 'bomb') {
      hearts -= 1;
      tile.classList.add('boom');
      tile.textContent = '💥';
      Sfx.error();
      tapHaptic(24);
      paintHud();
      if (hearts <= 0) finish('The last heart popped. Everything you banked is yours.');
      return;
    }
    const value = kind === 'gem' ? 3 : kind === 'key' ? 2 : 1;
    score += value;
    tile.classList.add(kind);
    tile.innerHTML = `<span class="dig-icon">${kind === 'gem' ? '💎' : kind === 'key' ? '🗝️' : '🪙'}</span><span class="dig-radar">${bombNeighbours(index)}</span>`;
    if (kind === 'gem') Sfx.win();
    else Sfx.coin();
    paintHud();
    if (opened >= CELLS - 1) finish('Every safe tile is turned over. Masterful.');
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      if (!running || tile.classList.contains('dug')) return;
      reveal(tile, Number(tile.dataset.dig));
    });
  });

  function finish(blurb) {
    if (!running) return;
    running = false;
    clearInterval(clock);
    tiles.forEach((tile) => { tile.disabled = true; });
    cashBtn.disabled = true;
    const coins = Math.min(100, 10 + score * 5);
    const xp = 10 + score * 3;
    showGameResult(shell, { kind: 'dig', score, coins, xp, blurb });
  }

  cashBtn.addEventListener('click', () => {
    if (!running) return;
    Sfx.coin();
    finish(score > 0 ? 'You cashed out with the chest still full.' : 'You cashed out before finding anything.');
  });

  shell.timerEl.textContent = `${DURATION}s`;
  shell.timerBar.style.width = '100%';
  paintHud();
  clock = setInterval(() => {
    if (!running) return;
    remaining = Math.max(0, remaining - 0.1);
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / DURATION) * 100}%`;
    if (remaining <= 0) finish('The lamp burned out. You kept what you banked.');
  }, 100);

  shell.addCleanup(() => {
    running = false;
    clearInterval(clock);
  });
}

/* ---------------- ELEMENT CARD DUEL ---------------- */
/* A small three-round card duel: five cards, three elements, a hidden
   opponent card, and a higher power only matters when the elements match. */
const DUEL_ELEMENTS = {
  ember: { name: 'Ember', icon: '🔥', color: '#ff8a5c' },
  frost: { name: 'Frost', icon: '❄️', color: '#8be9ff' },
  tide: { name: 'Tide', icon: '💧', color: '#5ee0a0' },
};
const DUEL_BEATS = { ember: 'frost', frost: 'tide', tide: 'ember' };
const DUEL_COUNTERS = Object.fromEntries(
  Object.entries(DUEL_BEATS).map(([element, target]) => [target, element]),
);
const DUEL_ROUNDS = 3;
const DUEL_HAND_SIZE = 5;
const DUEL_TIP = 'Pick a card. Ember beats Frost, Frost beats Tide, and Tide beats Ember. '
  + 'Same element: higher power wins. The opponent reads only your played cards; '
  + 'every hand holds all three elements.';
const DUEL_OUTCOME_LABELS = { win: 'W', loss: 'L', draw: 'D' };

function cardDuelDeck() {
  const elements = Object.keys(DUEL_ELEMENTS);
  const deck = [];
  for (let index = 0; index < elements.length * 3; index += 1) {
    deck.push({ element: elements[index % elements.length], power: index + 1 });
  }
  /* Every hand gets one card of each element before the two flex slots. Without
     that guarantee a random five-card hand could have no answer to a read. */
  const hand = [];
  elements.forEach((element) => {
    const choices = deck.filter((card) => card.element === element);
    const card = pick(choices);
    hand.push(card);
    deck.splice(deck.indexOf(card), 1);
  });
  while (hand.length < DUEL_HAND_SIZE) {
    const card = pick(deck);
    deck.splice(deck.indexOf(card), 1);
    hand.push(card);
  }
  return shuffle(hand);
}

/* The opponent only reads cards the player has already revealed. It counts the
   elements played, uses the latest one to break a tie, and tries to answer that
   favourite with its beating element. If it has no counter, it falls back to the
   strongest card of the same element, then to any remaining card. It never sees
   the player's current pick. */
function cardDuelReadTarget(history = []) {
  if (!history.length) return null;
  const counts = {};
  history.forEach((element) => { counts[element] = (counts[element] || 0) + 1; });
  let target = history[history.length - 1];
  Object.keys(counts).forEach((element) => {
    if (counts[element] > (counts[target] || 0)) target = element;
  });
  return target;
}

function cardDuelOpponentPick(hand, history = []) {
  const available = hand.map((card, index) => card.used ? -1 : index).filter((index) => index >= 0);
  if (!available.length) return -1;
  const randomIndex = () => pick(available);
  const target = cardDuelReadTarget(history);
  if (!target) return randomIndex();

  const counter = DUEL_COUNTERS[target];
  const answers = available.filter((index) => hand[index].element === counter);
  if (answers.length) return pick(answers);

  const sameElement = available.filter((index) => hand[index].element === target);
  if (sameElement.length) {
    return sameElement.reduce((best, index) => (hand[index].power > hand[best].power ? index : best), sameElement[0]);
  }
  return randomIndex();
}

function openCardDuelGame() {
  const shell = gameOverlayShell('cardclash');
  const { board } = shell;
  const player = cardDuelDeck();
  const opponent = cardDuelDeck();
  let running = true;
  let resolving = false;
  let finishTimer = 0;
  const roundHistory = [];

  board.innerHTML = `<div class="card-duel">
    <div class="between" style="align-items:flex-start;gap:8px">
      <div><div class="eyebrow">Elemental card duel</div><h3 style="margin:3px 0 0">Best of three</h3></div>
      <span class="chip" data-duel-round>Round 1 / ${DUEL_ROUNDS}</span>
    </div>
    <div class="duel-score">
      <span>You <b data-duel-wins>0</b></span>
      <span>Opponent <b data-duel-losses>0</b></span>
      <span>Draws <b data-duel-draws>0</b></span>
    </div>
    <div class="duel-arena" data-duel-arena></div>
    <div class="duel-history" data-duel-history aria-label="Round history"></div>
    <p class="tiny muted" data-duel-reveal style="margin:4px 0;line-height:1.5;min-height:32px"></p>
    <div class="duel-hand" data-duel-hand></div>
  </div>`;

  const roundEl = board.querySelector('[data-duel-round]');
  const winsEl = board.querySelector('[data-duel-wins]');
  const lossesEl = board.querySelector('[data-duel-losses]');
  const drawsEl = board.querySelector('[data-duel-draws]');
  const arenaEl = board.querySelector('[data-duel-arena]');
  const historyEl = board.querySelector('[data-duel-history]');
  const revealEl = board.querySelector('[data-duel-reveal]');
  const handEl = board.querySelector('[data-duel-hand]');

  function cardHTML(card, side = 'Your card') {
    if (!card) return `<div class="duel-slot"><small>${side}</small><b>?</b><span>${side === 'Opponent' ? 'Hidden' : 'Pick a card'}</span></div>`;
    const element = DUEL_ELEMENTS[card.element];
    return `<div class="duel-slot" style="--duel-color:${element.color}">
      <small>${side}</small>
      <b>${element.icon}</b>
      <span>${element.name} · ${card.power}</span>
    </div>`;
  }

  function renderHand() {
    handEl.innerHTML = player.map((card, index) => {
      const element = DUEL_ELEMENTS[card.element];
      return `<button class="duel-card" data-duel-card="${index}" ${card.used || !running || resolving ? 'disabled' : ''} style="--duel-color:${element.color}" aria-label="${element.name} card, power ${card.power}">
        <span class="duel-card-icon">${element.icon}</span>
        <b>${element.name}</b>
        <span class="duel-card-power">${card.power}</span>
      </button>`;
    }).join('');
  }

  function duelTally() {
    const wins = roundHistory.filter((entry) => entry.outcome === 'win').length;
    const losses = roundHistory.filter((entry) => entry.outcome === 'loss').length;
    const round = roundHistory.length;
    return {
      wins,
      losses,
      draws: roundHistory.filter((entry) => entry.outcome === 'draw').length,
      power: roundHistory.reduce((total, entry) => total + entry.playerPower, 0),
      counters: roundHistory.filter((entry) => entry.countered).length,
      round,
      complete: round >= DUEL_ROUNDS || wins >= 2 || losses >= 2,
    };
  }

  function renderScore() {
    const { wins, losses, draws, round, complete } = duelTally();
    winsEl.textContent = wins;
    lossesEl.textContent = losses;
    drawsEl.textContent = draws;
    roundEl.textContent = complete ? 'Match complete' : `Round ${round + 1} / ${DUEL_ROUNDS}`;
    shell.timerEl.textContent = complete ? 'Duel complete' : `Round ${round + 1} / ${DUEL_ROUNDS}`;
    shell.timerBar.style.width = complete ? '100%' : `${(round / DUEL_ROUNDS) * 100}%`;
  }

  function renderHistory() {
    historyEl.innerHTML = Array.from({ length: DUEL_ROUNDS }, (_, index) => {
      const entry = roundHistory[index];
      if (!entry) {
        return `<span class="duel-history-slot is-pending"><small>R${index + 1}</small><span class="dh-pair">· · ·</span><b>—</b></span>`;
      }
      const playerElement = DUEL_ELEMENTS[entry.player];
      const opponentElement = DUEL_ELEMENTS[entry.opponent];
      return `<span class="duel-history-slot is-${entry.outcome}" title="Round ${index + 1}: ${playerElement.name} vs ${opponentElement.name} — ${entry.outcome}">
        <small>R${index + 1}</small>
        <span class="dh-pair">${playerElement.icon}<i>vs</i>${opponentElement.icon}</span>
        <b>${DUEL_OUTCOME_LABELS[entry.outcome]}</b>
      </span>`;
    }).join('');
  }

  function finishDuel() {
    if (!running) return;
    running = false;
    const { wins, losses, draws, power, counters, round } = duelTally();
    const score = wins * 30 + round * 3 + power;
    const flawless = wins >= 2 && losses === 0 && draws === 0;
    const blurb = (flawless ? 'Flawless elemental victory!' : wins >= 2 ? 'The duel is yours!' : wins === 1 ? 'A close elemental duel.' : 'Good practice — the pantry still gets a treat!') + ` The opponent played its counter in ${counters} of ${round} rounds.`;
    showGameResult(shell, { kind: 'cardclash', score, coins: score, xp: 32, blurb, distinctFoods: true });
  }

  function resetArena() {
    arenaEl.innerHTML = `${cardHTML(null, 'Your card')}<div class="duel-vs">VS</div>${cardHTML(null, 'Opponent')}`;
    revealEl.textContent = DUEL_TIP;
    renderScore();
    renderHistory();
    renderHand();
  }

  function resolveRound(playerIndex) {
    if (!running || resolving || player[playerIndex].used) return;
    resolving = true;
    const playerCard = player[playerIndex];
    const readHistory = roundHistory.map((entry) => entry.player);
    const readTarget = cardDuelReadTarget(readHistory);
    const readCounter = readTarget ? DUEL_COUNTERS[readTarget] : null;
    playerCard.used = true;
    const opponentIndex = cardDuelOpponentPick(opponent, readHistory);
    const opponentCard = opponent[opponentIndex];
    const playerElement = DUEL_ELEMENTS[playerCard.element];
    const opponentElement = DUEL_ELEMENTS[opponentCard.element];
    const countered = !!readCounter && opponentCard.element === readCounter;
    opponentCard.used = true;
    const outcome = playerCard.element === opponentCard.element
      ? (playerCard.power === opponentCard.power ? 'draw' : playerCard.power > opponentCard.power ? 'win' : 'loss')
      : (DUEL_BEATS[playerCard.element] === opponentCard.element ? 'win' : 'loss');
    roundHistory.push({ player: playerCard.element, opponent: opponentCard.element, playerPower: playerCard.power, outcome, countered });
    arenaEl.innerHTML = `${cardHTML(playerCard)}<div class="duel-vs">VS</div>${cardHTML(opponentCard, 'Opponent')}`;
    const outcomeText = outcome === 'win'
      ? `<b style="color:var(--good)">You win the round!</b> ${playerElement.name} beats ${opponentElement.name}.`
      : outcome === 'loss'
        ? `<b style="color:var(--bad)">The opponent takes the round.</b> ${opponentElement.name} beats ${playerElement.name}.`
        : `<b style="color:var(--gold)">A draw.</b> Same element, same power.`;
    const readNote = readTarget
      ? `<span class="duel-read-note">${countered
        ? `It read your ${DUEL_ELEMENTS[readTarget].name} and answered with ${DUEL_ELEMENTS[readCounter].name}.`
        : `It read your ${DUEL_ELEMENTS[readTarget].name}, but had no ${DUEL_ELEMENTS[readCounter].name} left; it played ${opponentElement.name}.`}</span>`
      : '';
    revealEl.innerHTML = readNote ? `${outcomeText} ${readNote}` : outcomeText;
    renderScore();
    renderHistory();
    renderHand();
    finishTimer = setTimeout(() => {
      if (!running) return;
      if (duelTally().complete) {
        finishDuel();
      } else {
        resolving = false;
        resetArena();
      }
    }, 900);
  }

  handEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-duel-card]');
    if (!button || button.disabled) return;
    resolveRound(Number(button.dataset.duelCard));
  });

  shell.addCleanup(() => {
    running = false;
    clearTimeout(finishTimer);
  });
  resetArena();
}

function openGame(kind) {
  Sfx.init();
  if (typeof SPORT_GAME_KEYS !== 'undefined' && SPORT_GAME_KEYS.includes(kind)) {
    openSportGame(kind);
    return;
  }
  if (typeof WALK_GAME_KEYS !== 'undefined' && WALK_GAME_KEYS.includes(kind)) {
    openWalkGame(kind);
    return;
  }
  if (!activeSprite()) {
    toast('Hatch a sprite first to play together.', '🥚');
    return;
  }
  const info = GAME_INFO[kind];
  if (info?.unlock && (state.stats.checkins || 0) < info.unlock) {
    toast(`Check in ${info.unlock - (state.stats.checkins || 0)} more time${info.unlock - (state.stats.checkins || 0) === 1 ? '' : 's'} to unlock ${info.title}.`, '🔒');
    Sfx.error();
    return;
  }
  if (kind === 'catch') openCatchGame();
  else if (kind === 'pulse') openPulseGame();
  else if (kind === 'copycat') openCopycatGame();
  else if (kind === 'nectar') openNectarGame();
  else if (kind === 'match') openMatchGame();
  else if (kind === 'dig') openDigGame();
  else if (kind === 'cardclash') openCardDuelGame();
  else if (kind === 'temple') openElementalTempleGame();
  else if (kind === 'rune') openRuneSlideGame();
  else if (kind === 'zombie') openZombieSiegeGame();
  else if (kind === 'duel') openHollowDuelGame();
  else if (kind === 'guardian') openGuardianDuel(state.theme && SCENES[state.theme.scene] ? state.theme.scene : 'grove', null, { practice: true });
  else if (kind === 'beat') openBeatGame();
  else if (kind === 'race') openRaceGame();
  else if (kind === 'petquest') openPetAdventureGame();
  else if (kind === 'maze') openMazeGame();
  else if (kind === 'tower') openTowerGame();
  else if (typeof GLIMMER_GAME_KEYS !== 'undefined' && GLIMMER_GAME_KEYS.includes(kind)) openGlimmerWaveGame(kind);
  else if (typeof CLASSIC_GAME_KEYS !== 'undefined' && CLASSIC_GAME_KEYS.includes(kind)) openClassicGame(kind);
  else if (typeof CASH_GAME_KEYS !== 'undefined' && CASH_GAME_KEYS.includes(kind)) openCashGame(kind);
  else if (kind === 'kitchen') openKitchenGame();
  else if (kind === 'hotelrush') openHotelServiceGame();
  else if (kind === 'smoothie') openSmoothieGame();
  else if (kind === 'musicjam') openMusicJamGame();
  else if (kind === 'eggarcade') openEggArcadeGame();
  else if (kind === 'barrage') openBarrageGame();
  else if (kind === 'spa') openSpaGame();
  else if (kind === 'starlane') openStarLaneGame();
  else if (kind === 'portalmatch') openPortalPairGame();
  else if (String(kind).startsWith('vigil-')) openEventVigilGame(String(kind).slice(6));
  else if (typeof openSeasonalGame === 'function') openSeasonalGame(kind);
}
