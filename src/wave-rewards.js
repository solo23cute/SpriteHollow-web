/* Daily first-play bonuses and achievements for every mini-game.

   The three newest games keep their hand-written score milestones; every other
   game gets a play-based shelf that works whatever its score scale is, so no
   game is left without a reason to come back the next day. */

const WAVE_GAME_DAILY_BONUS = 1200;

const WAVE_GAME_ACHIEVEMENTS = {
  beatlane: [
    { id: 'beat-20', at: 20, label: 'On the Beat', icon: '🥁', coins: 600, desc: 'Score 20 in Beat Lane.' },
    { id: 'beat-45', at: 45, label: 'Full Chorus', icon: '🎶', coins: 1400, desc: 'Score 45 in Beat Lane.' },
    { id: 'beat-5', plays: 5, label: 'Lane Regular', icon: '🎹', coins: 900, desc: 'Play Beat Lane five times.' },
  ],
  brickbash: [
    { id: 'brick-24', at: 24, label: 'First Wall', icon: '🧱', coins: 700, desc: 'Score 24 in Brick Bash.' },
    { id: 'brick-60', at: 60, label: 'Clean Sweep', icon: '🏗️', coins: 1600, desc: 'Score 60 in Brick Bash.' },
    { id: 'brick-5', plays: 5, label: 'Paddle Pro', icon: '🏓', coins: 900, desc: 'Play Brick Bash five times.' },
  ],
  coincliff: [
    { id: 'cliff-40', at: 40, label: 'Steady Nerve', icon: '🪙', coins: 700, desc: 'Bank 40 coins in one run.' },
    { id: 'cliff-90', at: 90, label: 'Cliffhanger', icon: '⛰️', coins: 1800, desc: 'Bank 90 coins in one run.' },
    { id: 'cliff-5', plays: 5, label: 'Miner’s Habit', icon: '⛏️', coins: 900, desc: 'Play Coin Cliff five times.' },
  ],
};

const WAVE_GENERATED_SHELVES = {};

/* Play-count tiers for everything without a hand-written shelf. */
function waveGeneratedShelf(kind, title) {
  if (!WAVE_GENERATED_SHELVES[kind]) {
    WAVE_GENERATED_SHELVES[kind] = [
      { id: `${kind}-3`, plays: 3, label: 'Warming Up', icon: '🎮', coins: 400, desc: `Play ${title} three times.` },
      { id: `${kind}-10`, plays: 10, label: 'Regular', icon: '🎟️', coins: 900, desc: `Play ${title} ten times.` },
      { id: `${kind}-25`, plays: 25, label: 'Devoted', icon: '🏅', coins: 1800, desc: `Play ${title} twenty-five times.` },
    ];
  }
  return WAVE_GENERATED_SHELVES[kind];
}

function waveGameShelf(kind) {
  if (!kind) return null;
  if (WAVE_GAME_ACHIEVEMENTS[kind]) return WAVE_GAME_ACHIEVEMENTS[kind];
  if (typeof GAME_INFO === 'undefined' || !GAME_INFO[kind]) return null;
  const title = GAME_INFO[kind].title || 'this game';
  return waveGeneratedShelf(kind, title);
}

function waveGameTitle(kind) {
  return (typeof GAME_INFO !== 'undefined' && GAME_INFO[kind] && GAME_INFO[kind].title) || 'Mini game';
}

function gameMedalTiers(kind) {
  const tiers = typeof GAME_INFO !== 'undefined' && GAME_INFO[kind]
    ? GAME_INFO[kind].medals : null;
  return Array.isArray(tiers)
    ? tiers.slice().sort((a, b) => (Number(a.at) || 0) - (Number(b.at) || 0))
    : [];
}

function gameMedalForScore(kind, score) {
  const value = Math.max(0, Number(score) || 0);
  return gameMedalTiers(kind).reduce((earned, tier) => (value >= tier.at ? tier : earned), null);
}

function gameNextMedal(kind, score) {
  const value = Math.max(0, Number(score) || 0);
  return gameMedalTiers(kind).find((tier) => value < tier.at) || null;
}

function gameMedalThresholdText(kind) {
  return gameMedalTiers(kind).map((tier) => `${tier.icon}${tier.at}`).join(' · ');
}

function waveGameRecord(kind) {
  if (!state.waveGames || typeof state.waveGames !== 'object') state.waveGames = {};
  const rec = state.waveGames[kind];
  if (!rec || typeof rec !== 'object') {
    state.waveGames[kind] = { plays: 0, best: 0 };
  } else {
    rec.plays = Number(rec.plays) || 0;
    rec.best = Number(rec.best) || 0;
  }
  return state.waveGames[kind];
}

function waveGameDaily(kind) {
  const day = typeof dayKey === 'function' ? dayKey() : new Date().toISOString().slice(0, 10);
  if (!state.waveDaily || typeof state.waveDaily !== 'object' || state.waveDaily.day !== day) {
    state.waveDaily = { day, games: [] };
  }
  if (!Array.isArray(state.waveDaily.games)) state.waveDaily.games = [];
  return { day, claimed: state.waveDaily.games.includes(kind) };
}

function waveAchievementsFor(kind) {
  if (!state.waveAchievements || typeof state.waveAchievements !== 'object') state.waveAchievements = {};
  if (!Array.isArray(state.waveAchievements[kind])) state.waveAchievements[kind] = [];
  return state.waveAchievements[kind];
}

/* Cafe recipes are the first Club-game progression hook. A finished run teaches
   one recipe, stocks one free serving, and opens the food in the market. */
function grantCafeRecipe(kind) {
  if (typeof cafeRecipeForGame !== 'function' || typeof FOODS === 'undefined') return null;
  const recipe = cafeRecipeForGame(kind);
  if (!recipe || !FOODS[recipe.food]) return null;
  if (!Array.isArray(state.cafeRecipes)) state.cafeRecipes = [];
  if (state.cafeRecipes.includes(recipe.food)) return null;
  state.cafeRecipes.push(recipe.food);
  if (typeof addFoodRaw === 'function') addFoodRaw(recipe.food, 1);
  if (typeof saveState === 'function') saveState();
  return recipe;
}

function waveRecordResult(kind, score) {
  const shelf = waveGameShelf(kind);
  if (!shelf) return null;
  const rec = waveGameRecord(kind);
  rec.plays += 1;
  rec.best = Math.max(rec.best, Number(score) || 0);
  const earned = waveAchievementsFor(kind);
  const unlocked = [];
  shelf.forEach((a) => {
    const met = a.plays ? rec.plays >= a.plays : rec.best >= a.at;
    if (!met || earned.includes(a.id)) return;
    earned.push(a.id);
    if (typeof addCoinsRaw === 'function') addCoinsRaw(a.coins);
    unlocked.push(a);
  });
  let dailyBonus = 0;
  const daily = waveGameDaily(kind);
  if (!daily.claimed) {
    state.waveDaily.games.push(kind);
    dailyBonus = WAVE_GAME_DAILY_BONUS;
    if (typeof addCoinsRaw === 'function') addCoinsRaw(dailyBonus);
  }
  if (typeof saveState === 'function') saveState();
  return { dailyBonus, unlocked, best: rec.best, plays: rec.plays };
}

function waveNextTier(kind) {
  const shelf = waveGameShelf(kind);
  if (!shelf) return null;
  const earned = waveAchievementsFor(kind);
  return shelf.find((a) => !earned.includes(a.id)) || null;
}

function waveRewardChips(kind, score) {
  const shelf = waveGameShelf(kind);
  if (!shelf) return '';
  const daily = waveGameDaily(kind);
  const rec = waveGameRecord(kind);
  const best = Math.max(rec.best, Number(score) || 0);
  const next = waveNextTier(kind);
  const nextChip = next
    ? `<span class="chip">${next.icon} ${next.label} · ${next.plays ? `${rec.plays + 1}/${next.plays} plays` : `${best}/${next.at}`}</span>`
    : '<span class="chip">🏅 Every milestone earned</span>';
  const recipe = typeof cafeRecipeForGame === 'function' ? cafeRecipeForGame(kind) : null;
  const recipeChip = recipe && typeof cafeRecipeUnlocked === 'function' && !cafeRecipeUnlocked(recipe.food)
    ? `<span class="chip">☕ Recipe: ${FOODS[recipe.food].name}</span>`
    : '';
  const tiers = gameMedalTiers(kind);
  const earnedMedal = gameMedalForScore(kind, best);
  const nextMedal = gameNextMedal(kind, best);
  const medalChip = tiers.length
    ? `<span class="chip">${earnedMedal ? `${earnedMedal.icon} ${earnedMedal.label}` : `${tiers[0].icon} ${tiers[0].label} at ${tiers[0].at}`}${nextMedal ? ` · next ${nextMedal.icon} ${nextMedal.at}` : ' · all medals'}</span>`
    : '';
  /* The best and new-best chips belong to the shared best line (bestChips), so
     this only adds what the score record does not know: the daily bonus, the
     medals, the next milestone and the cafe recipe. */
  return `<span class="chip">🎁 ${daily.claimed ? 'Daily bonus claimed' : `+${WAVE_GAME_DAILY_BONUS.toLocaleString()} first game today`}</span>${medalChip}${nextChip}${recipeChip}`;
}

function waveGameCardInfo(kind) {
  const shelf = waveGameShelf(kind);
  if (!shelf) return '';
  const daily = waveGameDaily(kind);
  const rec = state.waveGames && state.waveGames[kind];
  const bits = [];
  const recipe = typeof cafeRecipeForGame === 'function' ? cafeRecipeForGame(kind) : null;
  if (recipe) {
    const food = FOODS[recipe.food];
    bits.push(typeof cafeRecipeUnlocked === 'function' && cafeRecipeUnlocked(recipe.food)
      ? `☕ ${food.name} recipe`
      : `☕ recipe: ${food.name}`);
  }
  if (rec && rec.best) bits.push(`🏅 best ${rec.best}`);
  const medalThresholds = gameMedalThresholdText(kind);
  if (medalThresholds) bits.push(medalThresholds);
  bits.push(daily.claimed ? '🎁 daily claimed' : `🎁 +${WAVE_GAME_DAILY_BONUS.toLocaleString()} today`);
  return bits.join(' · ');
}

/* The Activities achievement panel: every earned milestone and the next one. */
function achievementsPanelHTML() {
  if (typeof GAME_INFO === 'undefined') return '';
  const rows = Object.keys(GAME_INFO)
    .filter((kind) => GAME_INFO[kind] && waveGameShelf(kind))
    .map((kind) => {
      const shelf = waveGameShelf(kind);
      const earned = waveAchievementsFor(kind);
      const rec = (state.waveGames && state.waveGames[kind]) || { plays: 0, best: 0 };
      const got = shelf.filter((a) => earned.includes(a.id));
      return {
        kind,
        title: waveGameTitle(kind),
        icon: (GAME_INFO[kind] && GAME_INFO[kind].icon) || '🎮',
        got,
        total: shelf.length,
        next: shelf.find((a) => !earned.includes(a.id)) || null,
        missing: shelf.filter((a) => !earned.includes(a.id)),
        plays: Number(rec.plays) || 0,
        best: Number(rec.best) || 0,
      };
    });
  const earnedTotal = rows.reduce((n, r) => n + r.got.length, 0);
  const slotTotal = rows.reduce((n, r) => n + r.total, 0);
  const coinsLeft = rows.reduce((n, r) => n + r.missing.reduce((m, a) => m + (Number(a.coins) || 0), 0), 0);
  const pct = slotTotal ? Math.round((earnedTotal / slotTotal) * 100) : 0;
  const played = rows.filter((r) => r.plays > 0).sort((a, b) => b.got.length - a.got.length || b.plays - a.plays);
  const untouched = rows.filter((r) => !r.plays).sort((a, b) => a.title.localeCompare(b.title));
  const rowHTML = (r) => {
    const earnedText = r.got.length ? r.got.map((a) => `${a.icon} ${a.label}`).join(' · ') : 'No milestones yet';
    const nextText = r.next
      ? `Next: ${r.next.icon} ${r.next.label} · ${r.next.plays ? `${r.plays}/${r.next.plays} plays` : `best ${r.best}/${r.next.at}`}`
      : 'Every milestone earned';
    const search = [r.title, ...r.got.map((a) => a.label), r.next ? r.next.label : ''].join(' ').toLowerCase();
    return `<div class="ach-row" data-played="${r.plays > 0 ? '1' : '0'}" data-search="${esc(search)}">
      <span class="ach-icon">${r.icon}</span>
      <span class="ach-row-main"><b>${esc(r.title)}${r.plays ? ` <span class="ach-plays">${r.plays} played</span>` : ''}</b><span>${earnedText}</span><span>${nextText}</span></span>
      <span class="chip">${r.got.length}/${r.total}</span>
    </div>`;
  };
  const body = played.map(rowHTML).join('') + untouched.map(rowHTML).join('');
  return `<details class="ach-fold" data-achievements data-played-only="0">
    <summary><span>🏅 Achievements</span><span class="chip">${pct}%</span><span class="chip">${earnedTotal}/${slotTotal}</span><span class="chip">🪙 ${coinsLeft.toLocaleString()} left</span><span class="ach-chev">▾</span></summary>
    <div class="ach-tools">
      <input class="ach-search" data-ach-search type="search" placeholder="Search games or milestones" aria-label="Search achievements" oninput="filterAchievementRows()">
      <button class="btn btn-ghost btn-sm ach-only" data-ach-only onclick="toggleAchievementPlayed(this)" aria-pressed="false">Played only</button>
    </div>
    <div class="ach-list">${body}</div>
    <p class="tiny muted ach-empty" data-ach-empty hidden style="padding:10px 0">No games match that search.</p>
  </details>`;
}

/* Search and the played-only filter for the panel. */
function filterAchievementRows() {
  document.querySelectorAll('[data-achievements]').forEach((fold) => {
    const input = fold.querySelector('[data-ach-search]');
    const query = ((input && input.value) || '').trim().toLowerCase();
    const onlyPlayed = fold.getAttribute('data-played-only') === '1';
    let shown = 0;
    fold.querySelectorAll('.ach-row').forEach((row) => {
      const hit = (!query || (row.getAttribute('data-search') || '').indexOf(query) >= 0) && (!onlyPlayed || row.getAttribute('data-played') === '1');
      row.hidden = !hit;
      if (hit) shown += 1;
    });
    const empty = fold.querySelector('[data-ach-empty]');
    if (empty) empty.hidden = shown > 0;
  });
}

function toggleAchievementPlayed(btn) {
  const fold = btn.closest('[data-achievements]');
  if (!fold) return;
  const on = fold.getAttribute('data-played-only') !== '1';
  fold.setAttribute('data-played-only', on ? '1' : '0');
  btn.classList.toggle('on', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  filterAchievementRows();
}

/* Award the bonus and milestones at collect time, alongside the normal payout. */
if (typeof Actions !== 'undefined' && typeof Actions.finishGame === 'function') {
  const baseFinishGame = Actions.finishGame.bind(Actions);
  Actions.finishGame = function (opts = {}) {
    const result = baseFinishGame(opts);
    if (!waveGameShelf(opts.game)) return result;
    const extra = waveRecordResult(opts.game, opts.score);
    const recipe = grantCafeRecipe(opts.game);
    if (extra && extra.unlocked.length && typeof toast === 'function') {
      extra.unlocked.forEach((a, i) => {
        setTimeout(() => toast(`🏅 ${a.label} — +${a.coins.toLocaleString()} coins`, a.icon), 240 + i * 280);
      });
    }
    if (recipe && typeof toast === 'function' && FOODS[recipe.food]) {
      setTimeout(() => toast(`☕ Recipe unlocked: ${FOODS[recipe.food].name} — +1 free serving.`, '☕'), 420);
    }
    return result && typeof result === 'object' ? { ...result, wave: extra, recipe } : result;
  };
}
