/* Activities hub: classic games plus the arcade challenge track. */

/* Every game keeps one record, but each is only visible on its own card. This
   is the overview: what you have played, best first, so a hundred games have a
   leaderboard instead of a hundred scattered chips. */
function openRecordsSheet() {
  const table = state.gameScores && typeof state.gameScores === 'object' ? state.gameScores : {};
  const rows = Object.keys(table).map((key) => {
    const info = typeof GAME_INFO !== 'undefined' ? GAME_INFO[key] : null;
    return {
      key,
      name: (info && (info.title || info.name)) || key,
      icon: (info && info.icon) || '🎮',
      best: GameScores.best(state, key),
      plays: GameScores.plays(state, key),
      last: GameScores.last(state, key),
    };
  }).filter((row) => row.plays > 0)
    .sort((a, b) => b.best - a.best || b.plays - a.plays || a.name.localeCompare(b.name));
  const body = rows.length
    ? `<div class="records-list">${rows.map((row, index) => `<div class="record-row" data-record-row>
        <span class="record-rank">${index + 1}</span>
        <span class="record-name">${row.icon} ${esc(row.name)}${row.last > 0 ? `<small class="record-last">last ${row.last.toLocaleString('en-US')}</small>` : ''}</span>
        <b>${row.best.toLocaleString('en-US')}</b>
        <span class="tiny muted">${row.plays} play${row.plays === 1 ? '' : 's'}</span>
      </div>`).join('')}</div>
      <p class="tiny muted" style="margin:10px 2px 0">Beating a record pays a coin bonus, once per record.</p>`
    : '<p class="muted small">No records yet. Every game you finish lands here.</p>';
  openSheet({
    title: 'Records',
    sub: 'Your best score in every game you have played, on this device.',
    body,
    key: 'records-sheet',
  });
}

function playScreen(root) {
  ensureArcadePeriods();
  const rarityChip = (s) => {
    const key = spriteRarityKey(s);
    const rarity = TYPE_EGG_RARITIES[key];
    const paid = typeof gamePayoutCeiling === 'function' ? gamePayoutCeiling(key) : GAME_COIN_CAP;
    const gift = ['common', 'uncommon'].includes(key) ? ' · gifts +25%' : '';
    return `<span class="chip play-rarity-chip">${rarity.name} · 🪙 up to ${paid} / game${gift}</span>`;
  };
  const rarityPayouts = RARITY_TIER_ORDER.map((key) => {
    const gift = ['common', 'uncommon'].includes(key) ? ' · gifts +25%' : '';
    const nominal = RARITY_COIN_BONUS[key] || 0;
    const paid = typeof gamePayoutCeiling === 'function' ? gamePayoutCeiling(key) : GAME_COIN_CAP;
    return `<span class="chip">${TYPE_EGG_RARITIES[key].name} +${nominal.toLocaleString()} listed → ${paid} paid${gift}</span>`;
  }).join('');

  const cardFor = (key) => {
    const g = GAME_INFO[key];
    if (!g) return '';
    /* A game registered without full metadata (a partial override from another
       file, or a stale cached copy) used to render "undefined" on the card. */
    const gameTitle = g.title || 'Mini Game';
    const gameIcon = g.icon || '🎮';
    const gameTag = g.tag || 'Arcade';
    const gameDesc = g.desc || 'Play and win rewards.';
    const gameG1 = g.g1 || BRAND.accent;
    const gameG2 = g.g2 || BRAND.gold;
    const trail = !!g.walkGame;
    const sport = !!g.sportGame;
    const need = trail ? (g.walkUnlock || 0) : sport ? 0 : (g.unlock || 0);
    const progress = trail ? (state.stats.walks || 0) : (state.stats.checkins || 0);
    const missing = Math.max(0, need - progress);
    const locked = !sport && missing > 0;
    const arcade = arcadeGameKind(key);
    const waveChip = typeof waveGameCardInfo === 'function' ? waveGameCardInfo(key) : '';
    const kindTag = sport ? 'sport' : trail ? 'trail' : arcade ? 'arcade' : '';
    const lockText = trail ? `Take ${missing} more walk${missing === 1 ? '' : 's'} to unlock this trail.` : `Check in ${missing} more time${missing === 1 ? '' : 's'} to unlock this game.`;
    const best = typeof GameScores !== 'undefined' && typeof state !== 'undefined' ? GameScores.best(state, key) : 0;
    const bestChip = best ? `<span class="chip">🏅 best ${best.toLocaleString('en-US')}</span>` : '';
    return `<button class="game-card ${locked ? 'locked' : ''} ${arcade ? 'arcade-card' : ''}" data-game="${key}" style="--sh-rim-a:${gameG1};--sh-rim-b:${gameG2};--sh-rim-c:var(--sh-frame-c, #6c8bff)" ${locked ? 'disabled' : ''}>
      <span class="game-icon" style="--g1:${gameG1};--g2:${gameG2}">${locked ? '🔒' : gameIcon}</span>
      <span style="flex:1;min-width:0">
        <h3>${gameTitle}${kindTag ? ` <span class="arcade-tag">${kindTag}</span>` : ''}</h3>
        <p>${locked ? lockText : gameDesc}</p>
        <span class="g-meta"><span class="chip">${gameTag}</span><span class="chip">🪙 ${GAME_COIN_BASE}–${GAME_COIN_CAP} coins</span><span class="chip">⭐ XP</span>${sport ? '<span class="chip">🍲 food</span><span class="chip">🎁 sport gift</span>' : trail ? '<span class="chip">💗 extra bond</span><span class="chip">🎁 trail gift</span><span class="chip">🎲 tier · evolve · coins</span>' : ''}${arcade ? '<span class="chip">🎁 bonus track</span>' : ''}${bestChip}${waveChip ? `<span class="chip">${waveChip}</span>` : ''}${locked ? `<span class="chip">🔒 ${need} ${trail ? 'walks' : 'check-ins'}</span>` : ''}</span>
      </span>
      <span class="go">${icon(locked ? 'lock' : 'chevron')}</span>
    </button>`;
  };

  const arcadeKeys = ARCADE_GAME_KEYS.filter((key) => GAME_INFO[key]);
  const walkKeys = typeof WALK_GAME_KEYS !== 'undefined' ? WALK_GAME_KEYS.filter((key) => GAME_INFO[key]) : [];
  const sportKeys = typeof SPORT_GAME_KEYS !== 'undefined' ? SPORT_GAME_KEYS.filter((key) => GAME_INFO[key]) : [];
  const petKeys = typeof PET_GAME_KEYS !== 'undefined' ? PET_GAME_KEYS.filter((key) => GAME_INFO[key]) : [];
  const classicKeys = Object.keys(GAME_INFO).filter((key) => !ARCADE_GAME_KEYS.includes(key) && !walkKeys.includes(key) && !sportKeys.includes(key) && !petKeys.includes(key));
  const walkTotal = typeof walkCount === 'function' ? walkCount() : 0;
  const walkGiftWait = typeof walkGiftIn === 'function' ? walkGiftIn() : 3;
  const sportTotal = typeof sportCount === 'function' ? sportCount() : 0;
  const sportGiftWait = typeof sportGiftIn === 'function' ? sportGiftIn() : 2;
  const careTotal = typeof CARE_BEAR_TOTAL === 'number' ? CARE_BEAR_TOTAL : 17;
  const careOwned = typeof careBearCount === 'function' ? careBearCount() : 0;
  const careEvery = typeof CARE_PACKAGE_EVERY === 'number' ? CARE_PACKAGE_EVERY : 3;
  const careTokens = Math.max(0, Number(state.care?.tokens) || 0);
  const careNext = typeof carePackageIn === 'function' ? carePackageIn() : careEvery;
  const careGifts = Math.max(0, Number(state.care?.gifts) || 0);
  const careActive = typeof isCareBearSprite === 'function' && isCareBearSprite(activeSprite());
  const arcade = ensureArcadePeriods();
  const nextAt = arcadeNextBonusAt(arcade);
  const bonusReady = arcade.coins >= nextAt;
  const bonusPct = Math.min(100, (arcade.coins / nextAt) * 100);
  const bonusIndex = (arcade.bonusClaims || 0) + 1;
  const nextBonusFeast = bonusIndex % ARCADE_BONUS_FEAST_EVERY === 0;
  const monthGiftsHTML = ARCADE_MONTH_GIFTS.map((gift) => {
    const claimed = arcade.monthClaims.includes(gift.id);
    const ready = !claimed && arcade.monthCoins >= gift.at;
    const pct = Math.min(100, (arcade.monthCoins / gift.at) * 100);
    const missing = Math.max(0, gift.at - arcade.monthCoins);
    return `<div class="arcade-gift ${ready ? 'ready' : ''} ${claimed ? 'claimed' : ''}">
      <span class="arcade-gift-icon">${claimed ? '✓' : gift.icon}</span>
      <span class="arcade-gift-main">
        <b>${gift.label}</b>
        <span>${claimed ? 'Claimed this month' : ready ? gift.blurb : `${missing.toLocaleString()} arcade coins to go`}</span>
        ${!claimed ? `<span class="arcade-mini-progress"><i style="width:${pct}%"></i></span>` : ''}
      </span>
      ${claimed
        ? '<span class="chip" style="color:var(--good)">✓</span>'
        : `<button class="btn ${ready ? 'btn-gold' : 'btn-ghost'}" data-month-gift="${gift.id}" ${ready ? '' : 'disabled'}>${ready ? 'Claim' : `+${gift.coins}`}</button>`}
    </div>`;
  }).join('');

  /* The weekly challenge reuses the score Treat Catch already reports, so the
     card only has to show the stored best and the derived medal. */
  const weekly = typeof WeeklyChallenge !== 'undefined' ? WeeklyChallenge.progressFromSave(state) : null;
  /* The weekly best resets on Monday; the game's own record does not, so show
     both rather than making this week's zero look like a first run. */
  const weeklyLifetime = weekly && typeof GameScores !== 'undefined' ? GameScores.best(state, weekly.game) : 0;
  const treats = weekly && typeof WeeklyChallenge !== 'undefined' ? WeeklyChallenge.treatProgressFromSave(state) : null;
  const treatNext = treats ? new Date(treats.week.nextStartsAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : '';
  const treatCopy = !treats ? '' : treats.week.active
    ? (treats.claimed
      ? `Today’s ${treats.day.label.toLowerCase()} treat is in the pantry. Come back tomorrow for the next free type.`
      : `Today: ${treats.day.icon} ${treats.day.label}. Free ${treats.food ? `${treats.food.emoji} ${treats.food.name}` : 'pantry treat'}${treats.favorite && treats.spriteName ? ` · ${treats.spriteName}’s favorite` : ''}.`)
    : `Treat Week is resting this week. All seven free treat types return ${treatNext}.`;
  const treatButton = !treats ? '' : !treats.week.active ? `Returns ${treatNext}` : treats.claimed ? '✓ Claimed today' : `Claim free ${treats.food ? treats.food.name : 'treat'}`;
  const treatStrip = !treats ? '' : `<div class="treat-week-strip">${treats.days.map((entry) => {
    const weekday = new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' });
    return `<div class="treat-day ${entry.today ? 'is-today' : ''} ${entry.claimed ? 'is-claimed' : ''}"><span>${entry.icon}</span><b>${esc(entry.short)}</b><small>${entry.claimed ? '✓' : weekday}</small></div>`;
  }).join('')}</div>`;
  const weeklyCardHTML = !weekly ? '' : `<div class="card weekly-challenge" data-weekly-card>
      <div class="between" style="align-items:flex-start;gap:8px">
        <div><div class="arcade-kicker">🧺 Weekly challenge</div><h3 style="margin:3px 0 5px">${esc(weekly.title)}</h3></div>
        <span class="chip">${esc(weekly.week)}</span>
      </div>
      <div class="weekly-medals">${weekly.medals.map((medal) => `<span class="weekly-medal ${weekly.best >= medal.score ? 'is-earned' : ''}">${medal.icon} ${medal.label} · ${medal.score}</span>`).join('')}</div>
      <div class="weekly-event" data-weekly-event>${esc(weekly.event.icon)} ${esc(weekly.event.name)}<span>${esc(weekly.event.blurb)} · ${weekly.event.daysLeft}d ${weekly.event.hoursLeft}h left · then ${esc(weekly.event.next.icon)} ${esc(weekly.event.next.name)}</span></div>
      ${treats ? `<div class="treat-week" data-treat-week>
        <div class="between" style="align-items:flex-start;gap:8px">
          <div><div class="arcade-kicker">🍽️ Free Treat Week</div><b style="font-size:12.5px">${treats.week.active ? 'All seven treat types this week' : 'Rest week · treats return soon'}</b></div>
          <span class="chip">${treats.week.active ? 'one per day' : 'every other week'}</span>
        </div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.5">${esc(treatCopy)}</p>
        ${treatStrip}
        <button class="btn ${treats.week.active && !treats.claimed ? 'btn-gold' : 'btn-ghost'} btn-block btn-sm" data-weekly-treat ${treats.week.active && !treats.claimed ? '' : 'disabled'} style="margin-top:8px">${esc(treatButton)}</button>
      </div>` : ''}
      <p class="tiny muted" style="line-height:1.5;margin:7px 0 0">${weekly.best
        ? `Your best this week: <b style="color:var(--text)">${weekly.best}</b> points${weekly.medal ? ` · ${weekly.medal.icon} ${weekly.medal.label}` : ''}${weeklyLifetime > weekly.best ? ` · lifetime ${weeklyLifetime.toLocaleString('en-US')}` : ''}.`
        : 'No score yet this week. One 20-second run sets your best.'}${weekly.nextMedal ? ` Next: ${weekly.nextMedal.icon} ${weekly.nextMedal.label} at ${weekly.nextMedal.score}.` : ' Every medal earned this week.'}</p>
      <div class="row" style="gap:8px;margin-top:9px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" data-weekly-play>Play ${esc(weekly.title)}</button>
        <button class="btn btn-ghost btn-sm" data-weekly-share ${weekly.best ? '' : 'disabled'}>Share result</button>
      </div>
      <p class="tiny muted" style="margin:6px 0 0">Scores stay on this device and reset on Monday.</p>
    </div>`;

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Play together</div><h1>Activities</h1><p>${Object.keys(GAME_INFO).length} games and trails. Coins, XP, bonds, and gifts.</p></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end">
        <button class="btn btn-ghost btn-sm" data-records>📜 Records</button>
        <span class="chip">${icon('coin')} <span data-play-coins>${state.coins}</span></span>
      </div>
    </div>
    <div class="game-group-label"><b>Daily bonus</b><span>Free once a day · separate from arcade games</span></div>
    ${typeof wheelHubHTML === 'function' ? wheelHubHTML() : ''}
    <div data-play-pet></div>
    ${weeklyCardHTML}
    <div class="card" style="padding:12px;margin-bottom:14px;display:flex;gap:10px;align-items:center;border-color:rgba(255,158,199,.3);background:linear-gradient(135deg,rgba(255,158,199,.08),rgba(139,123,255,.05))">
      <span style="font-size:24px">🏠</span>
      <span style="flex:1;min-width:0"><b style="font-size:12.5px">Home</b><br><span class="tiny muted">Rest, eat, earn coins, and play one on one in their own room.</span></span>
      <button class="btn btn-primary btn-sm" data-play-senthome>Open</button>
    </div>
    <div class="game-group-label"><b>Trail walks</b><span>${walkTotal} walk${walkTotal === 1 ? '' : 's'} · trail gift in ${walkGiftWait}</span></div>
    <div class="game-cards">${walkKeys.map(cardFor).join('')}</div>
    <div class="game-group-label"><b>Sports</b><span>${sportTotal} played · sport gift in ${sportGiftWait}</span></div>
    <div class="game-cards">${sportKeys.map(cardFor).join('')}</div>
    <div class="game-group-label"><b>Virtual pets</b><span>${petKeys.length} pet games · care, feeding, and play</span></div>
    <div class="game-cards">${petKeys.map(cardFor).join('')}</div>
    <div class="game-group-label"><b>Care Bears &amp; Cousins</b><span>${careOwned}/${careTotal} met · ${careGifts} care package${careGifts === 1 ? '' : 's'}</span></div>
    <div class="card" style="padding:14px;margin-bottom:16px;border-color:rgba(255,158,199,.34);background:linear-gradient(135deg,rgba(255,158,199,.10),rgba(139,123,255,.06))">
      <div class="between" style="align-items:flex-start;gap:8px">
        <div><div class="arcade-kicker">🌈 Care Bears &amp; Cousins</div><h3 style="margin:3px 0 5px">Care Packages for every activity</h3></div>
        <span class="chip">${careOwned}/${careTotal} met</span>
      </div>
      <p class="tiny muted" style="line-height:1.55;margin:0 0 9px">Activate a Care Bear or Cousin, then finish any game, trail, or sport. Every <b>${careEvery}</b> activities wraps coins, XP, pantry food, and a snack. Their genes also add game coins and speed up gifts.</p>
      <div class="between tiny muted" style="gap:8px;margin-bottom:5px">
        <span>${careActive ? `🌈 ${displayName(activeSprite())} is filling the package` : careOwned ? 'Activate a Care Bear or Cousin to fill the package' : 'Hatch a Care Bear or Cousin in the Nest to begin'}</span>
        <span>${careTokens % careEvery}/${careEvery} · next in ${careNext}</span>
      </div>
      <div class="arcade-bar"><i style="width:${Math.round(((careTokens % careEvery) / careEvery) * 100)}%"></i></div>
    </div>
    ${typeof battlePassHTML === 'function' ? battlePassHTML() : ''}
    <div class="arcade-hub">
      <div class="between" style="align-items:flex-start">
        <div>
          <div class="arcade-kicker">🏟️ Arcade challenge</div>
          <h3>Coin-powered bonus gifts</h3>
          <p>Puzzle, Zombie, and Fight games earn double-duty coins: spend them anywhere, and every <b>${ARCADE_BONUS_STEP.toLocaleString()}</b> arcade coins fills a bonus gift.</p>
        </div>
        <span class="chip">🪙 ${arcade.coins.toLocaleString()}</span>
      </div>
      <div class="arcade-progress-row"><span>Bonus gift ${bonusIndex}</span><b>${Math.min(arcade.coins, nextAt).toLocaleString()} / ${nextAt.toLocaleString()}</b></div>
      <div class="arcade-bar"><i style="width:${bonusPct}%"></i></div>
      <div class="tiny muted" style="margin-top:5px;line-height:1.45">${bonusReady ? 'Your bonus gift is wrapped and ready.' : `${Math.max(0, nextAt - arcade.coins).toLocaleString()} more arcade coins to the next gift.`} ${nextBonusFeast ? '<b style="color:var(--gold)">This one contains a Starpath Feast.</b>' : 'Every third gift includes a Starpath Feast.'}</div>
      <button class="btn ${bonusReady ? 'btn-gold' : 'btn-ghost'} btn-block arcade-claim" data-arcade-claim ${bonusReady ? '' : 'disabled'}>${bonusReady ? '🎁 Claim bonus gift' : 'Keep playing to fill the gift'}</button>
      <div class="arcade-month">
        <div class="arcade-month-head"><b>Month gifts</b><span>${arcade.monthCoins.toLocaleString()} arcade coins this month</span></div>
        <div class="tiny muted" style="margin-top:3px;line-height:1.45">Monthly tiers reset on the first of each month. Higher tiers include Starpath Feasts, which feed one whole growth stage to the active sprite.</div>
        <div class="arcade-gift-list">${monthGiftsHTML}</div>
      </div>
    </div>
    <div class="game-group-label"><b>Arcade challenges</b><span>${arcadeKeys.length} games · puzzle · zombie · fight · runner · space · territory</span></div>
    <div class="game-cards">${arcadeKeys.map(cardFor).join('')}</div>
    <div class="game-group-label"><b>Hollow classics</b><span>${classicKeys.length} games</span></div>
    <div class="game-cards">${classicKeys.map(cardFor).join('')}</div>
    ${typeof achievementsPanelHTML === 'function' ? achievementsPanelHTML() : ''}
    <div class="section-title"><h2>Play smart</h2></div>
    <div class="card" style="padding:13px;font-size:11.5px;line-height:1.65;color:var(--muted)">
      <div class="row" style="gap:8px;margin-bottom:6px"><b style="color:var(--text)">Rewards scale with score — then stop at the cap.</b></div>
      Every completed game pays <b>${GAME_COIN_BASE} coins + ${GAME_COIN_SCORE_VALUE} per point</b>, and the whole payout is capped at <b>${GAME_COIN_CAP} coins</b>. Rarity, gene, phase, holiday, and outfit bonuses are added <i>before</i> that cap, so every tier today pays the same <b>${GAME_COIN_CAP}</b> coins. The nominal rarity bonus in the list below is a table value, not extra on top of the cap. The live fortnight's event is the one exception: its boost lands after the cap, and only on the challenge's own game. Common and Uncommon sprites still make gifts arrive <b>25% sooner</b>, and feeding, bathing, and naps keep needs high enough to play.
      <div class="row" style="gap:5px;margin-top:9px;flex-wrap:wrap">${rarityPayouts}</div>
      <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap">
        ${Object.entries(GAME_INFO).filter(([, g]) => g && g.title).map(([, g]) => `<span class="chip">${g.icon || '🎮'} ${g.title} = ${(g.tag || 'Arcade').toLowerCase()}</span>`).join('')}
      </div>
    </div>`;

  function paintPet() {
    const s = activeSprite();
    const box = root.querySelector('[data-play-pet]');
    if (!s) {
      box.innerHTML = `<div class="card empty-state" style="padding:16px">Hatch a sprite to play together.</div>`;
      return;
    }
    box.innerHTML = `<div class="rowcard" style="padding:11px">
      <span class="rc-art">${spriteSVG(s, { expr: expressionFor(s) })}</span>
      <span style="flex:1;min-width:0">
        <div class="between"><b style="font-size:13px">${esc(displayName(s))}</b><span class="tiny muted">Lv ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}</span></div>
        <div class="tiny muted" style="margin:1px 0 6px">${typeName(s)} · ${moodOf(s).icon} ${moodOf(s).label}</div>
        <div class="row" style="gap:5px;flex-wrap:wrap">
          <span class="chip">Energy ${Math.round(s.needs.energy)}</span>
          <span class="chip">Joy ${Math.round(s.needs.joy)}</span>
          <span class="chip">Bond ${Math.round(s.bond)}</span>
          ${rarityChip(s)}
        </div>
        ${s.needs.energy < 20 ? '<div class="tiny" style="color:var(--warn);margin-top:6px">Sleepy — a nap in the Hollow will perk them up.</div>' : ''}
      </span>
    </div>`;
  }

  root.querySelectorAll('[data-game]').forEach((btn) => {
    btn.addEventListener('click', () => App.startGame(btn.dataset.game));
  });

  root.querySelector('[data-play-senthome]')?.addEventListener('click', () => { Sfx.click(); App.go('senthome'); });

  root.querySelector('[data-records]')?.addEventListener('click', () => { Sfx.click(); openRecordsSheet(); });

  root.querySelector('[data-weekly-play]')?.addEventListener('click', () => {
    Sfx.click();
    App.startGame(WeeklyChallenge.CHALLENGE.game);
  });
  root.querySelector('[data-weekly-share]')?.addEventListener('click', () => {
    Sfx.click();
    WeeklyChallenge.share();
  });
  root.querySelector('[data-weekly-treat]')?.addEventListener('click', (event) => {
    const res = Actions.claimWeeklyTreat();
    if (!res.ok) {
      toast(res.reason === 'claimed' ? 'Today’s free treat is already in the pantry.' : res.reason === 'inactive' ? 'Treat Week is resting. It returns next week.' : 'No free treat is available right now.', '🍽️');
      return;
    }
    Sfx.pop();
    burstOn(event.currentTarget, ['🍽️', '✨', '💛'], 9);
    toast(res.favorite && res.spriteName
      ? `${res.food.emoji} ${res.food.name} · ${res.spriteName}’s favorite`
      : `Free treat: ${res.food.emoji} ${res.food.name}`, '🍽️');
    App.refresh();
  });

  root.querySelector('[data-open-wheel]')?.addEventListener('click', () => {
    Sfx.tick();
    openWheelSheet();
  });

  root.querySelector('[data-arcade-claim]')?.addEventListener('click', (event) => {
    const res = Actions.claimArcadeBonus();
    if (!res.ok) {
      toast(`That gift needs ${Math.max(0, res.nextAt - res.progress).toLocaleString()} more arcade coins.`, '🎁');
      return;
    }
    Sfx.win();
    burstOn(event.currentTarget, ['🎁', '🪙', '✨'], 10);
    if (typeof gameGiftPop === 'function') {
      gameGiftPop({
        kind: 'arcade',
        icon: '🎁',
        title: 'Arcade Gift!',
        detail: `+${res.coins} coins · ${FOODS[res.foodKey].emoji} ${FOODS[res.foodKey].name}`,
      });
    }
    let message = `+${res.coins} coins · ${FOODS[res.foodKey].emoji} ${FOODS[res.foodKey].name} · ${SNACKS[res.snackKey].emoji} ${SNACKS[res.snackKey].name}`;
    if (res.feast) message += ` · 🌟 ${FOODS[STARPATH_FOOD_ID].name}`;
    toast(message, '🎁');
    App.refresh();
  });

  root.querySelectorAll('[data-pass-claim]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const res = claimBattlePassTier(Number(btn.dataset.passClaim));
      if (!res.ok) {
        toast(res.reason === 'claimed'
          ? 'That tier is already claimed.'
          : `Play ${Math.max(0, (res.need || 0) - (res.played || 0))} more games to unlock this tier.`, '🎟️');
        return;
      }
      Sfx.win();
      burstOn(event.currentTarget, ['🎟️', '🪙', '✨'], 9);
      let message = `+${res.payout.coins} coins · ${res.tier.label}`;
      if (res.payout.feasts) message += ` · 🌟 ${res.payout.feasts} Starpath Feast`;
      toast(message, '🎟️');
      App.refresh();
    });
  });

  root.querySelectorAll('[data-month-gift]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const res = Actions.claimArcadeMonthGift(btn.dataset.monthGift);
      if (!res.ok) {
        toast(res.reason === 'claimed' ? 'That month gift is already yours.' : `You need ${(res.need || 0).toLocaleString()} more arcade coins this month.`, '📅');
        return;
      }
      Sfx.win();
      burstOn(event.currentTarget, ['🌟', '🎁', '✨'], 11);
      if (typeof gameGiftPop === 'function') {
        gameGiftPop({
          kind: 'month',
          icon: '📅',
          title: 'Month Gift!',
          detail: `+${res.coins} coins · ${res.gift.label}`,
        });
      }
      let message = `+${res.coins} coins · ${res.gift.label}`;
      if (res.feasts) message += ` · 🌟 ${res.feasts} Starpath Feast${res.feasts === 1 ? '' : 's'}`;
      toast(message, '📅');
      App.refresh();
    });
  });

  paintPet();
  const unsub = subscribeState((d) => {
    if (d.type === 'game' || d.type === 'arcadeBonus' || d.type === 'arcadeMonthGift') return;
    const coinsEl = root.querySelector('[data-play-coins]');
    if (coinsEl) coinsEl.textContent = state.coins;
    paintPet();
  });
  return () => unsub();
}
