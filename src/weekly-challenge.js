/* Weekly challenge: one existing game, three medal thresholds, a personal best
   for the current week, and a share line. Scoring stays on this device — there
   is no network call anywhere in this file.

   The week key and every threshold are derived here; the save only stores the
   week and the best score, so an old or hand-edited record can never inflate a
   medal. */

(function (root) {
  'use strict';

  const CHALLENGE = Object.freeze({
    game: 'catch',
    title: 'Treat Catch',
    icon: '🍓',
    medals: Object.freeze([
      Object.freeze({ id: 'bronze', icon: '🥉', label: 'Bronze', score: 12 }),
      Object.freeze({ id: 'silver', icon: '🥈', label: 'Silver', score: 24 }),
      Object.freeze({ id: 'gold', icon: '🥇', label: 'Gold', score: 40 }),
    ]),
  });

  /* Biweekly events: a challenge run is scored the same way all fortnight, but
     the live event changes which part of it pays. Two weeks is the unit the
     Vault's relays already use, so the whole game turns over on one rhythm. */
  const EVENTS = Object.freeze([
    Object.freeze({ key: 'goldrush', icon: '🪙', name: 'Gold Rush', blurb: 'The challenge game pays +25% coins.', coinBoost: 1.25, xpBoost: 1, bondBonus: 0, medalScale: 1 }),
    Object.freeze({ key: 'starlight', icon: '⭐', name: 'Starlight', blurb: '+20% XP from every challenge run.', coinBoost: 1, xpBoost: 1.2, bondBonus: 0, medalScale: 1 }),
    Object.freeze({ key: 'bondfair', icon: '💗', name: 'Bond Fair', blurb: '+4 bond from every challenge run.', coinBoost: 1, xpBoost: 1, bondBonus: 4, medalScale: 1 }),
    Object.freeze({ key: 'goldmedals', icon: '🏅', name: 'Golden Fortnight', blurb: 'Medal thresholds are 20% easier.', coinBoost: 1, xpBoost: 1, bondBonus: 0, medalScale: 0.8 }),
  ]);

  /* Fortnights counted from 1 January, local time. */
  function fortnight(now) {
    const source = new Date(Number(now) || 0);
    const yearStart = new Date(source.getFullYear(), 0, 1);
    const index = Math.floor((source - yearStart) / (14 * 86400000));
    return { source, index, startsAt: new Date(yearStart.getTime() + index * 14 * 86400000) };
  }

  function biweekIndex(now = Date.now()) {
    return fortnight(now).index;
  }

  /* One wrap-around read: a negative index is still a valid event. */
  function at(list, index) {
    return list[((index % list.length) + list.length) % list.length];
  }

  function eventFor(now = Date.now()) {
    const { source, index, startsAt } = fortnight(now);
    const endsAt = new Date(startsAt.getTime() + 14 * 86400000);
    const left = Math.max(0, endsAt - source);
    const next = at(EVENTS, index + 1);
    /* A fortnight reads as a deadline only if it counts down. */
    const daysLeft = Math.ceil(left / 86400000);
    return {
      ...at(EVENTS, index),
      game: CHALLENGE.game,
      index,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      daysLeft,
      hoursLeft: Math.floor((left % 86400000) / 3600000),
      next: { key: next.key, icon: next.icon, name: next.name },
    };
  }

  /* ISO week key in the player's local calendar: 2026-W47. */
  function weekKey(now = Date.now()) {
    const source = new Date(Number(now) || 0);
    const day = new Date(Date.UTC(source.getFullYear(), source.getMonth(), source.getDate()));
    const weekday = day.getUTCDay() || 7;
    day.setUTCDate(day.getUTCDate() + 4 - weekday);
    const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((day - yearStart) / 86400000) + 1) / 7);
    return `${day.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  }

  /* Free Treat Week alternates with rest weeks. Each day of an active week
     gives one free pantry food from a different category, so the whole week
     covers every weekly treat type. The pick prefers the active puffle's breed
     favorite, then another owned sprite's favorite in that category. */
  const TREAT_DAYS = Object.freeze([
    Object.freeze({ day: 1, key: 'produce', label: 'Fresh Produce', short: 'Produce', icon: '🍓' }),
    Object.freeze({ day: 2, key: 'drink', label: 'Drinks', short: 'Drinks', icon: '🥤' }),
    Object.freeze({ day: 3, key: 'dessert', label: 'Desserts', short: 'Desserts', icon: '🍰' }),
    Object.freeze({ day: 4, key: 'treat', label: 'Treats', short: 'Treats', icon: '🍬' }),
    Object.freeze({ day: 5, key: 'meal', label: 'Meals', short: 'Meals', icon: '🍲' }),
    Object.freeze({ day: 6, key: 'meat', label: 'Meat & Fish', short: 'Meat', icon: '🍗' }),
    Object.freeze({ day: 0, key: 'veg', label: 'Vegetables', short: 'Veg', icon: '🥕' }),
  ]);
  const TREAT_EPOCH = Date.UTC(2024, 0, 1);

  function treatWeekFor(now = Date.now()) {
    const source = new Date(Number(now) || 0);
    const monday = new Date(source.getFullYear(), source.getMonth(), source.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const startUtc = Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const index = Math.floor((startUtc - TREAT_EPOCH) / (7 * 86400000));
    const active = ((index % 2) + 2) % 2 === 0;
    const endsAt = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
    const nextStartsAt = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + (active ? 14 : 7));
    return {
      key: weekKey(now),
      index,
      active,
      startsAt: monday.toISOString(),
      endsAt: endsAt.toISOString(),
      nextStartsAt: nextStartsAt.toISOString(),
    };
  }

  function treatDayFor(now = Date.now()) {
    const source = new Date(Number(now) || 0);
    return TREAT_DAYS.find((entry) => entry.day === source.getDay()) || TREAT_DAYS[0];
  }

  function sanitizeTreat(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const week = typeof source.week === 'string' && /^\d{4}-W\d{2}$/.test(source.week) ? source.week : '';
    const claimed = Array.isArray(source.claimed)
      ? Array.from(new Set(source.claimed.filter((date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))).slice(0, 7)
      : [];
    return { week, claimed };
  }

  function treatFoodPool(save, category) {
    const unlocked = Array.isArray(save && save.foodUnlocks) ? save.foodUnlocks : [];
    return FOOD_KEYS.filter((key) => {
      const food = FOODS[key];
      return food && food.cat === category
        && !food.giftOnly && !food.stageBoost && !food.rebirth
        && (!food.monthly || unlocked.includes(key))
        && !(typeof cafeFoodLocked === 'function' && cafeFoodLocked(key));
    });
  }

  function favoriteEntries(save) {
    const activeId = save && save.activeId;
    return (Array.isArray(save && save.sprites) ? save.sprites : [])
      .filter((sprite) => sprite && sprite.stage !== 'egg' && sprite.breed && BREED_TRAITS[sprite.breed])
      .map((sprite) => {
        const key = BREED_TRAITS[sprite.breed].favorite;
        return key && FOODS[key] ? { key, sprite, active: sprite.id === activeId } : null;
      })
      .filter(Boolean);
  }

  function seededPick(list, seed) {
    if (!list.length) return null;
    const rnd = seedRandom(seed);
    return list[Math.floor(rnd() * list.length)] || list[0];
  }

  function treatChoiceForSave(save, now = Date.now()) {
    const day = treatDayFor(now);
    const pool = treatFoodPool(save, day.key);
    const favorites = favoriteEntries(save).filter((entry) => FOODS[entry.key].cat === day.key && pool.includes(entry.key));
    const activeFavorite = favorites.find((entry) => entry.active);
    const chosenFavorite = activeFavorite || (favorites.length
      ? seededPick(favorites, `treat-favorite-${weekKey(now)}-${day.key}`)
      : null);
    const key = chosenFavorite ? chosenFavorite.key : seededPick(pool, `treat-${weekKey(now)}-${day.key}`);
    return {
      day,
      key: key || null,
      food: key ? { ...FOODS[key], key } : null,
      favorite: Boolean(chosenFavorite),
      spriteName: chosenFavorite ? (chosenFavorite.sprite.name || 'a Hollow friend') : null,
    };
  }

  function treatProgressFromSave(save, now = Date.now()) {
    const week = treatWeekFor(now);
    const record = sanitizeTreat(save && save.weeklyTreats);
    const claimedDays = record.week === week.key ? record.claimed : [];
    const choice = treatChoiceForSave(save, now);
    const date = new Date(Number(now) || 0);
    return {
      week,
      ...choice,
      claimed: claimedDays.includes(dayKey(date)),
      claimedDays,
      days: TREAT_DAYS.map((entry, index) => {
        const weekDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7) + index);
        return {
          ...entry,
          date: dayKey(weekDay),
          today: entry.day === date.getDay(),
          claimed: claimedDays.includes(dayKey(weekDay)),
        };
      }),
    };
  }

  function cleanScore(value) {
    const score = Math.floor(Number(value));
    return Number.isFinite(score) && score > 0 ? score : 0;
  }

  function medalFrom(score, medals) {
    const value = cleanScore(score);
    let earned = null;
    (medals || CHALLENGE.medals).forEach((medal) => {
      if (value >= medal.score) earned = medal;
    });
    return earned;
  }

  function nextMedalFrom(score, medals) {
    const value = cleanScore(score);
    return (medals || CHALLENGE.medals).find((medal) => medal.score > value) || null;
  }

  function medalFor(score) {
    return medalFrom(score, CHALLENGE.medals);
  }

  function nextMedalFor(score) {
    return nextMedalFrom(score, CHALLENGE.medals);
  }

  function recordOf(save) {
    return save && typeof save.challenge === 'object' && save.challenge ? save.challenge : {};
  }

  function sanitize(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const week = typeof source.week === 'string' && /^\d{4}-W\d{2}$/.test(source.week) ? source.week : '';
    return { week, best: cleanScore(source.best) };
  }

  /* A best from an older week never carries into this one. The live biweekly
     event can make the medals easier, so the thresholds travel with it. */
  function progressFromSave(save, now = Date.now()) {
    const week = weekKey(now);
    const record = sanitize(recordOf(save));
    const best = record.week === week ? record.best : 0;
    const event = eventFor(now);
    const medals = event.medalScale === 1
      ? CHALLENGE.medals
      : CHALLENGE.medals.map((medal) => ({ ...medal, score: Math.max(1, Math.round(medal.score * event.medalScale)) }));
    return {
      game: CHALLENGE.game,
      title: CHALLENGE.title,
      icon: CHALLENGE.icon,
      week,
      medals,
      best,
      medal: medalFrom(best, medals),
      nextMedal: nextMedalFrom(best, medals),
      played: best > 0,
      event,
    };
  }

  function recordFor(raw, score, now = Date.now()) {
    const week = weekKey(now);
    const current = sanitize(raw);
    const value = cleanScore(score);
    return { week, best: current.week === week ? Math.max(current.best, value) : value };
  }

  function shareText(progress) {
    if (!progress || !progress.best) return '';
    const medal = progress.medal ? `${progress.medal.icon} ${progress.medal.label}` : 'No medal yet';
    return `🧺 ${progress.title} weekly challenge: ${progress.best} points · ${medal}. Beat it in Sprite Hollow!`;
  }

  /* Clipboard or the system share sheet, whichever the device offers. Both are
     local: nothing is uploaded. */
  function copyShareText(text, done) {
    const fallback = () => {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        done('Result copied.');
      } catch (err) {
        done('Could not copy the result.');
      }
    };
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => done('Result copied.')).catch(fallback);
      return text;
    }
    fallback();
    return text;
  }

  function shareWeeklyChallenge() {
    const text = shareText(progressFromSave(typeof state !== 'undefined' ? state : null));
    if (!text) return '';
    const done = (message) => { if (typeof toast === 'function') toast(message, '🧺'); };
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      navigator.share({ text }).then(() => done('Result shared.')).catch(() => copyShareText(text, done));
      return text;
    }
    return copyShareText(text, done);
  }

  root.WeeklyChallenge = Object.freeze({
    CHALLENGE,
    EVENTS,
    TREAT_DAYS,
    eventFor,
    biweekIndex,
    weekKey,
    treatWeekFor,
    treatDayFor,
    treatProgressFromSave,
    sanitizeTreat,
    medalFor,
    nextMedalFor,
    progressFromSave,
    recordFor,
    shareText,
    share: shareWeeklyChallenge,
    sanitize,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
