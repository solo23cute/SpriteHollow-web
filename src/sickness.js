/* Colds, temperatures, medicine and the clinic.

   A sprite can fall ill when its needs are neglected for a while. Once ill it
   runs a fever, shows up on the Hollow screen as sick, and stays sick until it
   is treated: three doses of medicine, a trip to the clinic, or enough rest at
   home (which is slower). Everything here is driven by plain sprite fields, so it survives a
   save and can be reasoned about without the DOM:

     s.illness = { key, temp, doses }

   The games that deliver the doses live in src/screens/sickbay.js. */

/* Weighted choice used by both causes. The roll is supplied by the caller so
   a test can force a cause without waiting on Math.random. */
function pickIllnessWeighted(entries, roll) {
  const list = (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && ILLNESSES[entry.key] && Number(entry.weight) > 0);
  const total = list.reduce((sum, entry) => sum + Number(entry.weight), 0);
  if (!total) return null;
  let left = Math.max(0, Math.min(0.999999, Number(roll) || 0)) * total;
  for (let i = 0; i < list.length; i += 1) {
    left -= Number(list[i].weight);
    if (left <= 0) return list[i].key;
  }
  return list[list.length - 1].key;
}

const Sickness = {
  isSick(sprite) {
    return !!(sprite && sprite.stage !== 'egg' && !sprite.retired && sprite.illness && ILLNESSES[sprite.illness.key]);
  },

  info(sprite) {
    return Sickness.isSick(sprite) ? ILLNESSES[sprite.illness.key] : null;
  },

  temperature(sprite) {
    if (!Sickness.isSick(sprite)) return SICKNESS_RULES.NORMAL_TEMP;
    return Math.round((Number(sprite.illness.temp) || SICKNESS_RULES.NORMAL_TEMP) * 10) / 10;
  },

  reading(sprite) {
    return tempReading(Sickness.temperature(sprite));
  },

  dosesLeft(sprite) {
    if (!Sickness.isSick(sprite)) return 0;
    return Math.max(0, SICKNESS_RULES.CURE_DOSES - (Number(sprite.illness.doses) || 0));
  },

  /* Used by the tick, the tests, and the debug console. */
  infect(sprite, key) {
    if (!sprite || sprite.stage === 'egg' || sprite.retired) return null;
    /* With no cause given, the season picks which cold is going around. */
    const chosen = key && ILLNESSES[key] ? key : pickIllness(Sickness.seasonKey(), Math.random());
    const info = ILLNESSES[chosen];
    const span = info.tempMax - info.tempMin;
    const temp = info.tempMin + Math.random() * span;
    sprite.illness = {
      key: chosen,
      temp: Math.round(temp * 10) / 10,
      doses: 0,
    };
    sprite.riskMinutes = 0;
    sprite.weatherExposure = 0;
    state.stats.colds = (Number(state.stats.colds) || 0) + 1;
    return sprite.illness;
  },

  /* Raw cure: no commit and no toast, so the tick and the Actions can share it. */
  cure(sprite) {
    if (!Sickness.isSick(sprite)) return null;
    const info = ILLNESSES[sprite.illness.key];
    sprite.illness = null;
    sprite.riskMinutes = 0;
    sprite.weatherExposure = 0;
    return info;
  },

  /* Which food traits matter. Plain produce and ordinary meals have no tags and
     therefore no food-sickness chance at all. */
  foodTags(food) {
    if (!food) return { hot: false, cold: false, questionable: false, rich: false };
    const text = `${food.name || ''} ${food.desc || ''}`;
    const cat = String(food.cat || '').toLowerCase();
    const candy = !!food.candy || cat === 'dessert' || cat === 'treat';
    return {
      hot: FOOD_SICKNESS_PATTERNS.hot.test(text),
      cold: FOOD_SICKNESS_PATTERNS.cold.test(text),
      questionable: FOOD_SICKNESS_PATTERNS.questionable.test(text),
      rich: candy || FOOD_SICKNESS_PATTERNS.rich.test(text)
        || Number(food.clean) < 0 || Number(food.joy) >= 22,
    };
  },

  /* The food-safety odds and the causes those odds can produce. This is pure:
     foodCheck() does the roll, so the table can be inspected in tests. */
  foodRisk(sprite, food) {
    if (!sprite || !food || sprite.stage === 'egg' || sprite.retired || Sickness.isSick(sprite)) return null;
    const tags = Sickness.foodTags(food);
    const weather = typeof currentWeather === 'function' ? currentWeather() : null;
    const season = Sickness.seasonKey();
    const hotWeather = !!(weather && weather.hot);
    const chill = weather ? Number(weather.chill) || 0 : 0;
    let chance = 0;
    if (tags.questionable) chance += 0.07;
    if (tags.hot) chance += 0.035;
    if (tags.cold) chance += 0.035;
    if (tags.rich) chance += 0.02;
    if (hotWeather && tags.hot) chance += 0.05;
    if (chill > 0 && tags.cold) chance += 0.04;
    if (season === 'summer' && tags.hot) chance += 0.02;
    if ((Number(sprite.needs?.clean) || 0) < 50) chance += 0.015;
    if ((Number(sprite.needs?.energy) || 0) < 40) chance += 0.015;
    const choices = [];
    if (tags.questionable) choices.push({ key: 'tummy', weight: 5 });
    if (tags.rich) choices.push({ key: 'tummy', weight: 2 });
    if (tags.hot) choices.push({ key: hotWeather || season === 'summer' ? 'heatstroke' : 'fever', weight: 3 });
    if (tags.cold) choices.push({ key: chill > 0 ? 'chills' : 'sniffles', weight: 3 });
    if (hotWeather) choices.push({ key: 'heatstroke', weight: 1 });
    if (chill >= 2) choices.push({ key: 'chills', weight: 1 });
    return {
      chance: Math.min(0.24, chance),
      choices,
      tags,
      weather,
      season,
    };
  },

  /* Eat something and let the food have its say. Returns the new illness with
     its food name when the roll lands, otherwise null. */
  foodCheck(sprite, food) {
    const risk = Sickness.foodRisk(sprite, food);
    if (!risk || !risk.chance || !risk.choices.length) return null;
    if (Math.random() >= risk.chance) return null;
    const key = pickIllnessWeighted(risk.choices, Math.random());
    if (!key) return null;
    const illness = Sickness.infect(sprite, key);
    return illness ? { ...illness, cause: 'food', foodName: food.name || 'that food' } : null;
  },

  /* Harsh weather is an exposure, not an instant illness. It only builds when
     the sprite is outside and already a little worn down; well-kept sprites
     shrug it off. Returns the weather type and chance, not the roll. */
  weatherRisk(sprite, weather, minutes) {
    if (!sprite || sprite.stage === 'egg' || sprite.retired || Sickness.isSick(sprite)) return null;
    const wx = weather || (typeof currentWeather === 'function' ? currentWeather() : null);
    if (!wx || wx.off) { sprite.weatherExposure = 0; return null; }
    const chill = Number(wx.chill) || 0;
    const key = wx.hot ? 'heatstroke' : (wx.storm || chill >= 2 ? 'chills' : wx.wet ? 'sniffles' : '');
    if (!key) { sprite.weatherExposure = 0; return null; }
    const needs = sprite.needs || {};
    const avg = ((Number(needs.hunger) || 0) + (Number(needs.energy) || 0)
      + (Number(needs.joy) || 0) + (Number(needs.clean) || 0)) / 4;
    const vulnerable = avg < 70 || (Number(needs.clean) || 0) < 55 || (Number(needs.energy) || 0) < 45;
    if (!vulnerable) { sprite.weatherExposure = 0; return null; }
    const span = Math.max(0, Math.min(SICKNESS_RULES.TICK_CAP_MINUTES, Number(minutes) || 0));
    sprite.weatherExposure = Math.max(0, Number(sprite.weatherExposure) || 0) + span;
    if (sprite.weatherExposure < SICKNESS_RULES.WEATHER_EXPOSURE_MINUTES) return null;
    const chance = Math.min(0.35, SICKNESS_RULES.WEATHER_ONSET_CHANCE * span * (wx.hot ? 1.4 : 1));
    return { key, chance, weather: wx, exposure: sprite.weatherExposure };
  },

  weatherCheck(sprite, weather, minutes) {
    const risk = Sickness.weatherRisk(sprite, weather, minutes);
    if (!risk || !risk.chance) return null;
    if (Math.random() >= risk.chance) return null;
    const illness = Sickness.infect(sprite, risk.key);
    return illness ? { ...illness, cause: 'weather', weatherName: (risk.weather && risk.weather.name) || 'the weather' } : null;
  },

  /* Runs every tick for one sprite. Returns the illness info when this tick
     cured the sprite, so the caller can tell the player. */
  tick(sprite, minutes, opts = {}) {
    if (!sprite || sprite.stage === 'egg' || sprite.retired) return null;
    const span = Math.max(0, Math.min(SICKNESS_RULES.TICK_CAP_MINUTES, Number(minutes) || 0));
    if (!span) return null;

    if (Sickness.isSick(sprite)) {
      const info = ILLNESSES[sprite.illness.key];
      const home = !!opts.home;
      const rate = home ? 0.08 : sprite.asleep ? 0.05 : 0.02;
      const next = Math.max(SICKNESS_RULES.NORMAL_TEMP, (Number(sprite.illness.temp) || info.tempMin) - rate * span);
      sprite.illness.temp = Math.round(next * 10) / 10;
      if (!home) sprite.needs.joy = clamp(sprite.needs.joy - 0.1 * span);
      /* Three doses settle it anywhere; a sprite recovering at home can also
         sleep a fever off without medicine, just more slowly. */
      const settled = sprite.illness.temp <= SICKNESS_RULES.NORMAL_TEMP + 0.1
        && (home || (Number(sprite.illness.doses) || 0) >= SICKNESS_RULES.CURE_DOSES);
      return settled ? Sickness.cure(sprite) : null;
    }

    /* A recovery at home makes a sprite immune while it grazes. */
    if (sprite.atHome) {
      sprite.riskMinutes = 0;
      sprite.weatherExposure = 0;
      return null;
    }
    const needs = sprite.needs || {};
    const avg = ((Number(needs.hunger) || 0) + (Number(needs.energy) || 0)
      + (Number(needs.joy) || 0) + (Number(needs.clean) || 0)) / 4;
    if (avg > 55 && (Number(needs.clean) || 0) > 40) {
      sprite.riskMinutes = 0;
      return null;
    }

    sprite.riskMinutes = Math.max(0, Number(sprite.riskMinutes) || 0) + span;
    if (sprite.riskMinutes < SICKNESS_RULES.ONSET_MINUTES) return null;

    /* The weather and the rest of the Hollow both get a say in the dice. The
       weather read used to be missing here, which made the chill branch below
       a ReferenceError the moment a sprite was neglected without a dirty or
       hungry cause. */
    const weather = typeof currentWeather === 'function' ? currentWeather() : null;
    const chill = weather ? Number(weather.chill) || 0 : 0;
    if (Math.random() >= Sickness.onsetChance(span, Sickness.seasonKey(), chill, Sickness.sickCount(sprite.id))) {
      return null;
    }

    /* The needs point at a cause when one stands out; otherwise the season
       picks which cold is going around. */
    let key = '';
    if ((Number(needs.clean) || 0) < 25) key = 'tummy';
    else if ((Number(needs.hunger) || 0) < 30) key = 'sniffles';
    else if (chill > 0) key = 'chills';
    else if (weather && weather.hot) key = 'heatstroke';
    return Sickness.infect(sprite, key);
  },

  /* Which season's air this is, and how much it helps a cold along. Both fall
     back to a neutral 1 when the season system is not loaded (the page tests
     boot the full game, but the module is also read from the console). */
  seasonKey() {
    return typeof seasonOf === 'function' ? seasonOf().key : '';
  },

  seasonRisk(season) {
    const key = season || Sickness.seasonKey();
    const risk = SICKNESS_RULES.SEASON_RISK[key];
    return Number.isFinite(risk) ? risk : 1;
  },

  /* How many sprites are ill right now. Left out of the count when an id is
     given, so a sprite never catches its own cold. Read from the save so the
     tick and the sheet agree about what is going around. */
  sickCount(excludeId) {
    const sprites = (typeof state !== 'undefined' && Array.isArray(state.sprites)) ? state.sprites : [];
    return sprites.filter((other) => other && other.id !== excludeId && Sickness.isSick(other)).length;
  },

  /* The multiplier the onset dice take from a sick Hollow. Pure, so the tests
     can ask for one, two or a crowd. */
  contagionRisk(count) {
    const sick = Math.max(0, Math.min(SICKNESS_RULES.CONTAGION_CAP, Math.floor(Number(count) || 0)));
    return 1 + SICKNESS_RULES.CONTAGION_RISK * sick;
  },

  /* The onset dice, pulled out of tick() so the season's share is testable
     without waiting on Math.random: same minutes, two seasons. `chill`,
     `season` and the count of other sick sprites are explicit overrides for
     those tests; in play they default to the live weather, season and Hollow. */
  onsetChance(minutes, season, chill, contagion = 0) {
    const span = Math.max(0, Math.min(SICKNESS_RULES.TICK_CAP_MINUTES, Number(minutes) || 0));
    const cold = Number.isFinite(chill)
      ? chill
      : (typeof currentWeather === 'function' ? (currentWeather().chill || 0) : 0);
    const chance = SICKNESS_RULES.ONSET_CHANCE * span * (1 + cold)
      * Sickness.seasonRisk(season) * Sickness.contagionRisk(contagion);
    return Math.max(0, Math.min(1, chance));
  },

  /* The loading card's status line while a sprite is unwell. The card's copy
     must stay on one line, so this is deliberately short. */
  cardLine(sprite) {
    const info = Sickness.info(sprite);
    if (!info) return '';
    return `${info.icon} ${displayName(sprite)} has ${info.name} · ${tempText(Sickness.temperature(sprite))}`;
  },

};

/* The clinic scale. Breed sets the grown weight, and the stage and size carry
   it to whatever body is standing on the platform today. The tiny id-seeded
   variation keeps two Puffs from being identical without making the number
   jump around between visits. */
const PuffleWeight = {
  forSprite(sprite) {
    const breed = (sprite && sprite.breed) || 'puff';
    const baseLb = (typeof BREED_WEIGHTS !== 'undefined' && Number(BREED_WEIGHTS[breed])) || 3;
    const stage = (sprite && sprite.stage) || 'baby';
    const stageMult = (typeof WEIGHT_STAGE_MULT !== 'undefined' && WEIGHT_STAGE_MULT[stage]) || 1;
    const sizeKey = (sprite && sprite.size) || 'standard';
    const sizeMult = (typeof SIZES !== 'undefined' && SIZES[sizeKey] && Number(SIZES[sizeKey].scale)) || 1;
    let h = 2166136261;
    const text = String(sprite && sprite.id != null ? sprite.id : 'puffle');
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    const personal = 0.95 + (h % 11) / 100;
    const lb = Math.max(0.1, Math.round(baseLb * stageMult * sizeMult * personal * 10) / 10);
    const breedName = (typeof BREEDS !== 'undefined' && BREEDS[breed] && BREEDS[breed].name) || 'Puff';
    const stageName = typeof stageLabel === 'function' ? stageLabel(sprite) : stage;
    const sizeName = (typeof SIZES !== 'undefined' && SIZES[sizeKey] && SIZES[sizeKey].name) || 'Standard';
    return {
      lb,
      kg: Math.round(lb * 0.45359237 * 10) / 10,
      baseLb: Math.round(baseLb * 10) / 10,
      breedName,
      stageName,
      sizeName,
    };
  },

  range(sprite) {
    const { lb } = PuffleWeight.forSprite(sprite);
    const spread = Math.max(0.2, lb * 0.08);
    return {
      low: Math.max(0.1, Math.round((lb - spread) * 10) / 10),
      high: Math.round((lb + spread) * 10) / 10,
    };
  },
};

if (typeof window !== 'undefined') window.PuffleWeight = PuffleWeight;

/* The three care actions. Each is one commit, so a dose and its cost are
   written together and the Hollow repaints once. */
Object.assign(Actions, {
  checkTemperature(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    const now = Date.now();
    const cooldown = Math.max(0, SICKNESS_RULES.TEMP_COOLDOWN_MS - (now - (Number(s.lastTempAt) || 0)));
    if (cooldown > 0) {
      return { ok: true, cooled: true, cooldown, temp: Sickness.temperature(s), reading: Sickness.reading(s) };
    }
    s.lastTempAt = now;
    state.stats.temps = (Number(state.stats.temps) || 0) + 1;
    const temp = Sickness.temperature(s);
    const reading = Sickness.reading(s);
    commit('temperature', { spriteId: s.id, temp });
    return {
      ok: true,
      cooled: false,
      sick: Sickness.isSick(s),
      temp,
      reading,
      info: Sickness.info(s),
      dosesLeft: Sickness.dosesLeft(s),
    };
  },

  medicine(id, quality = 1) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (!Sickness.isSick(s)) return { ok: false, reason: 'well' };
    if (state.coins < SICKNESS_RULES.MEDICINE_COST) {
      return { ok: false, reason: 'coins', cost: SICKNESS_RULES.MEDICINE_COST };
    }
    const info = ILLNESSES[s.illness.key];
    const pour = Math.max(0.25, Math.min(1, Number(quality) || 1));
    addCoinsRaw(-SICKNESS_RULES.MEDICINE_COST);
    s.illness.doses = Math.min(9, (Number(s.illness.doses) || 0) + 1);
    s.illness.temp = Math.max(
      SICKNESS_RULES.NORMAL_TEMP,
      Math.round((Sickness.temperature(s) - info.doseDrop * pour) * 10) / 10,
    );
    /* The pour pays for its timing: a clean spoonful is worth more than one
       that mostly missed the cup. The temperature already depends on it. */
    const xp = Math.round(3 + 3 * pour);
    const bond = Math.round((1 + 1.5 * pour) * 10) / 10;
    addBondRaw(s, bond);
    addXpRaw(s, xp);
    state.stats.medicines = (Number(state.stats.medicines) || 0) + 1;
    bump('medicines');
    let cured = null;
    if (s.illness.temp <= SICKNESS_RULES.NORMAL_TEMP + 0.1 && s.illness.doses >= SICKNESS_RULES.CURE_DOSES) {
      cured = Sickness.cure(s);
      state.stats.cured = (Number(state.stats.cured) || 0) + 1;
    }
    Sfx.pop();
    commit('medicine', { spriteId: s.id, cost: SICKNESS_RULES.MEDICINE_COST, cured: !!cured });
    return {
      ok: true,
      cost: SICKNESS_RULES.MEDICINE_COST,
      xp,
      bond,
      temp: Sickness.temperature(s),
      reading: Sickness.reading(s),
      doses: s.illness ? s.illness.doses : SICKNESS_RULES.CURE_DOSES,
      dosesLeft: Sickness.dosesLeft(s),
      cured: !!cured,
      info,
    };
  },

  doctorVisit(id, quality = 1) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (!Sickness.isSick(s)) return { ok: false, reason: 'well' };
    const now = Date.now();
    const cooldown = Math.max(0, SICKNESS_RULES.DOCTOR_COOLDOWN_MS - (now - (Number(s.lastDoctorAt) || 0)));
    if (cooldown > 0) return { ok: false, reason: 'cooled', cooldown };
    if (state.coins < SICKNESS_RULES.DOCTOR_COST) {
      return { ok: false, reason: 'coins', cost: SICKNESS_RULES.DOCTOR_COST };
    }
    const info = ILLNESSES[s.illness.key];
    const care = Math.max(0, Math.min(1, Number(quality) || 0));
    addCoinsRaw(-SICKNESS_RULES.DOCTOR_COST);
    s.lastDoctorAt = now;
    Sickness.cure(s);
    ['hunger', 'energy', 'joy', 'clean'].forEach((need) => {
      s.needs[need] = clamp(Math.max(Number(s.needs[need]) || 0, 60 + 25 * care));
    });
    const xp = Math.round(10 + 8 * care);
    const bond = Math.round(5 + 4 * care);
    addBondRaw(s, bond);
    addXpRaw(s, xp);
    state.stats.doctorVisits = (Number(state.stats.doctorVisits) || 0) + 1;
    state.stats.cured = (Number(state.stats.cured) || 0) + 1;
    bump('doctorVisits');
    Sfx.chime();
    commit('doctorVisit', { spriteId: s.id, cost: SICKNESS_RULES.DOCTOR_COST });
    return {
      ok: true,
      cost: SICKNESS_RULES.DOCTOR_COST,
      xp,
      bond,
      info,
      temp: SICKNESS_RULES.NORMAL_TEMP,
      reading: tempReading(SICKNESS_RULES.NORMAL_TEMP),
    };
  },
});

/* The page tests and the console read the module from the window; top-level
   `const` alone is a realm binding, not a property. */
if (typeof window !== 'undefined') window.Sickness = Sickness;
