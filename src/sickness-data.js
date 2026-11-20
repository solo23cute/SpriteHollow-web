/* The Hollow's everyday illnesses, and the rules that govern them.

   Loaded before src/state.js: normalizeSprite() runs during boot (the save is
   hydrated at parse time), so the sanitiser for a sprite's illness has to
   exist before the first save is read. The gameplay side — Actions, the tick
   and the doctor's games — lives in src/sickness.js, after state. */

const ILLNESSES = {
  sniffles: {
    key: 'sniffles',
    name: 'Hollow Sniffles',
    icon: '🤧',
    tempMin: 37.8, tempMax: 38.3, doseDrop: 0.45,
    symptom: 'a sniffly nose and tiny sneezes',
    remedies: ['Warm soup', 'A soft blanket', 'Honey tea'],
    decoys: ['A loud trumpet', 'An icy puddle splash', 'A sprinkle of confetti'],
    blurb: 'Settles in after a chilly night. Warm and dry clears it.',
  },
  fever: {
    key: 'fever',
    name: 'Moon Fever',
    icon: '🤒',
    tempMin: 38.6, tempMax: 39.3, doseDrop: 0.7,
    symptom: 'a hot forehead and heavy eyes',
    remedies: ['A cool compress', 'A dark quiet room', 'Small sips of water'],
    decoys: ['A bright lamp', 'A jump on the bed', 'Spicy chili'],
    blurb: 'A hot little fever that needs cooling down before it climbs.',
  },
  tummy: {
    key: 'tummy',
    name: 'Wobble Tummy',
    icon: '🤢',
    tempMin: 37.9, tempMax: 38.4, doseDrop: 0.5,
    symptom: 'a rumbly tummy and no appetite',
    remedies: ['Mint tea', 'A gentle belly rub', 'Plain crackers'],
    decoys: ['A triple sundae', 'A rollercoaster ride', 'Sour candy'],
    blurb: 'Usually a muddy puddle or an over-full snack bowl. Gentle food helps.',
  },
  chills: {
    key: 'chills',
    name: 'Frost Chills',
    icon: '🥶',
    tempMin: 37.5, tempMax: 38.1, doseDrop: 0.4,
    symptom: 'shivers and cold paws',
    remedies: ['A warm blanket', 'Cocoa', 'A warm hug'],
    decoys: ['A snowball fight', 'Ice lollies', 'An open window'],
    blurb: 'The Hollow weather got in. Warmth and company settle it.',
  },
  heatstroke: {
    key: 'heatstroke',
    name: 'Sunstroke',
    icon: '🥵',
    tempMin: 39.0, tempMax: 39.8, doseDrop: 0.65,
    symptom: 'a pounding head and hot, dry fur',
    remedies: ['Cool water', 'A shady spot', 'A gentle fan'],
    decoys: ['Hot soup', 'Direct midday sun', 'A wool blanket'],
    blurb: 'Too much sun, heat or spice. Cool down slowly and keep water close.',
  },
};

const SICKNESS_RULES = Object.freeze({
  CURE_DOSES: 3,
  NORMAL_TEMP: 37.4,
  WARM_TEMP: 38.0,
  HIGH_TEMP: 38.8,
  MEDICINE_COST: 14,
  DOCTOR_COST: 45,
  TEMP_COOLDOWN_MS: 4000,
  DOCTOR_COOLDOWN_MS: 15000,
  /* Six minutes of neglect before a sprite can catch anything, then a chance
     per minute — so a well-kept Hollow never sees a sniffle by accident. */
  ONSET_MINUTES: 6,
  ONSET_CHANCE: 0.18,
  TICK_CAP_MINUTES: 240,
  /* Weather exposure builds while a sprite is outside in harsh air. A sprite
     whose needs are still comfortable shrugs it off; one already worn down
     starts collecting exposure, then rolls against it. */
  WEATHER_EXPOSURE_MINUTES: 20,
  WEATHER_ONSET_CHANCE: 0.0006,
  /* A cold Hollow is a catching Hollow: the season multiplies the onset dice,
     so winter is when the sick bay fills and summer is when it empties. Read
     through seasonOf(), so a manually chosen season in the weather sheet
     counts too rather than only the calendar. Spring sits at 1 so the base
     ONSET_CHANCE stays the number it was balanced against. */
  SEASON_RISK: Object.freeze({ winter: 1.4, autumn: 1.2, spring: 1, summer: 0.8 }),
  /* A sick Hollow is a catching Hollow: every other ill sprite raises the
     onset dice for the sprites still well, up to this many of them. */
  CONTAGION_RISK: 0.3,
  CONTAGION_CAP: 3,
});

const ILLNESS_KEYS = Object.keys(ILLNESSES);

/* Which illness a season favours. Weights, not chances: the season changes what
   a neglected sprite is likeliest to catch, not how likely anything is. Winter
   fills the sick bay with sniffles and chills; summer adds sunstroke and keeps
   tummy trouble common. */
const ILLNESS_SEASON_WEIGHT = Object.freeze({
  winter: Object.freeze({ sniffles: 2, chills: 3, fever: 1, tummy: 0.4, heatstroke: 0 }),
  spring: Object.freeze({ sniffles: 1.2, chills: 0.8, fever: 1, tummy: 1, heatstroke: 0.6 }),
  summer: Object.freeze({ sniffles: 0.5, chills: 0.2, fever: 0.8, tummy: 2.2, heatstroke: 3 }),
  autumn: Object.freeze({ sniffles: 1.8, chills: 1.2, fever: 1, tummy: 0.7, heatstroke: 0.4 }),
});

/* Food is a cause, not just flavour. These patterns are deliberately broad:
   a dish only becomes risky when its name or description reads hot, cold,
   questionable, or rich enough to upset a small tummy. Plain produce and
   ordinary meals stay at zero risk. */
const FOOD_SICKNESS_PATTERNS = Object.freeze({
  hot: /(spicy|chili|chilli|hot\s*pot|heatwave|heat|ember|flame|inferno|solar|pepper|wasabi|sriracha|curry)/i,
  cold: /(iced|ice\s*cream|sorbet|snow\s*cone|frozen|gelato|smoothie|slush|mochi\s*ice|casteliacone|snowflake)/i,
  questionable: /(raw|sushi|sashimi|street|old\s*gateau|grey\s*fish|mystery|expired|dumpster)/i,
  rich: /(cake|candy|sugar|donut|doughnut|pudding|tart|pie|chocolate|sweet|marshmallow|toffee|fudge|brownie)/i,
});

function illnessSeasonWeights(season) {
  const table = ILLNESS_SEASON_WEIGHT[season] || {};
  return ILLNESS_KEYS
    .map((key) => ({ key, weight: Math.max(0, Number(table[key]) || 0) }))
    .filter((entry) => entry.weight > 0);
}

/* Weighted pick with the roll supplied, so which cold a season leans towards
   can be tested without waiting on Math.random. */
function pickIllness(season, roll) {
  const weights = illnessSeasonWeights(season);
  const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) return ILLNESS_KEYS[0];
  let left = Math.max(0, Math.min(0.999999, Number(roll) || 0)) * total;
  for (let i = 0; i < weights.length; i += 1) {
    left -= weights[i].weight;
    if (left <= 0) return weights[i].key;
  }
  return weights[weights.length - 1].key;
}

/* A sprite's illness survives a reload only in the shape this build knows. */
function normalizeIllness(raw) {
  if (!raw || typeof raw !== 'object' || !ILLNESSES[raw.key]) return null;
  const temp = Number(raw.temp);
  return {
    key: raw.key,
    temp: Number.isFinite(temp) ? Math.round(clamp(temp, 35, 42) * 10) / 10 : 38,
    doses: Math.max(0, Math.min(9, Math.floor(Number(raw.doses) || 0))),
  };
}

function tempReading(temp) {
  const t = Number(temp) || SICKNESS_RULES.NORMAL_TEMP;
  if (t >= SICKNESS_RULES.HIGH_TEMP) return { label: 'High fever', tone: 'high' };
  if (t >= SICKNESS_RULES.WARM_TEMP) return { label: 'Fever', tone: 'fever' };
  if (t >= SICKNESS_RULES.NORMAL_TEMP + 0.1) return { label: 'A little warm', tone: 'warm' };
  return { label: 'Normal', tone: 'normal' };
}

/* The save and the illness table stay in Celsius because that is what the
   thresholds and dose maths were balanced against. The Hollow shows Fahrenheit
   everywhere a keeper reads a temperature, which is the scale most players use
   for a fever. One conversion point keeps every screen in agreement. */
function fahrenheit(celsius) {
  const c = Number(celsius);
  return Number.isFinite(c) ? c * 9 / 5 + 32 : 32;
}

function tempText(celsius) {
  return `${fahrenheit(celsius).toFixed(1)}°F`;
}
