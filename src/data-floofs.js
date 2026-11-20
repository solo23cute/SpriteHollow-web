/* Original round fluffball companions: six soft, tufty pets built on the floof
   body breed. Registered like the other species waves so they join the wild egg
   pool, the type eggs, the habitats and the hybrid table. */

const FLOOF_SPECIES = {
  mallowfloof: {
    name: 'Mallow Floof', primary: '#ffe0d6', light: '#fff8f4', deep: '#b07a6a', accent: '#ffb3d1',
    trait: 'Squishy — compresses into a perfect circle when picked up.',
    blurb: 'A marshmallow-soft ball of fluff with a tiny curl on top and firm opinions about naps.',
    greeting: 'I have been thinking about pillows. Extensively.',
    likes: 'Moon Berry',
  },
  toastfloof: {
    name: 'Toast Floof', primary: '#f0b47a', light: '#ffe8cf', deep: '#7a4a1f', accent: '#ffd166',
    trait: 'Warm — smells faintly of breakfast at all times.',
    blurb: 'A golden, slightly toasted fluffball who considers every blanket a bed and every lap a heater.',
    greeting: 'I am warm. You are welcome. Sit.',
    likes: 'Honey Drop',
  },
  tidefloof: {
    name: 'Tide Floof', primary: '#9be8f0', light: '#effdff', deep: '#2a6b7a', accent: '#b69cff',
    trait: 'Buoyant — floats exactly one finger above any puddle.',
    blurb: 'A sea-glass fluffball with a soapy sheen and a habit of collecting very small shells.',
    greeting: 'I found a shell. It is mine. You may look at it.',
    likes: 'Coconut Water',
  },
  sproutfloof: {
    name: 'Sprout Floof', primary: '#b6e39a', light: '#f0ffe0', deep: '#3f7030', accent: '#ffd166',
    trait: 'Mossy — grows a fresh tuft whenever it is happy.',
    blurb: 'A meadow-green puff with a leaf curl and dirt under its (barely visible) feet.',
    greeting: 'I have been outside. It was excellent. There was a stick.',
    likes: 'Moon Berry',
  },
  duskfloof: {
    name: 'Dusk Floof', primary: '#c3a8f0', light: '#f0e8ff', deep: '#4a2a7a', accent: '#ff8ad8',
    trait: 'Sleepy — yawns in a minor key.',
    blurb: 'A violet fluffball that wakes at dusk, hums at the moon, and falls asleep mid-hum.',
    greeting: 'The moon and I are on the same schedule. It is a good schedule.',
    likes: 'Warm Soup',
  },
  snowfloof: {
    name: 'Snow Floof', primary: '#d9f1ff', light: '#ffffff', deep: '#4a7a92', accent: '#9ad7ff',
    trait: 'Powdery — leaves a soft white print wherever it rolls.',
    blurb: 'A pale, impossibly soft fluffball that drifts in with the first snow and refuses to melt.',
    greeting: 'I brought the cold. It is a gift. You are shivering. Good.',
    likes: 'Warm Soup',
  },
};

const FLOOF_GENES = {
  mallowfloof: { name: 'Cloud Nap', icon: '☁️', desc: 'Energy fades 20% slower and bond grows 10% faster.', effect: { energyDecay: 0.8, petBond: 1.1 } },
  toastfloof: { name: 'Warm Crumb', icon: '🍞', desc: 'Games pay +3 coins and gifts arrive 10% sooner.', effect: { gameCoins: 3, giftSpeed: 1.1 } },
  tidefloof: { name: 'Bubble Bath', icon: '🫧', desc: 'Stays clean 25% longer and joy fades 10% slower.', effect: { cleanDecay: 0.75, joyDecay: 0.9 } },
  sproutfloof: { name: 'Soft Moss', icon: '🌿', desc: 'XP gains +12% and pets build +15% bond.', effect: { xp: 1.12, petBond: 1.15 } },
  duskfloof: { name: 'Moon Fluff', icon: '🌙', desc: 'Night games pay +4 coins and energy fades 15% slower.', effect: { nightCoins: 4, energyDecay: 0.85 } },
  snowfloof: { name: 'Powder Puff', icon: '❄️', desc: 'Needs fade 15% slower and XP gains +10%.', effect: { decay: 0.85, xp: 1.1 } },
};

const FLOOF_TITANS = {
  mallowfloof: 'Marshmallow Monarch',
  toastfloof: 'Golden Crust Sovereign',
  tidefloof: 'Foamcap Tidelord',
  sproutfloof: 'Mosscloud Warden',
  duskfloof: 'Velvet Nightball',
  snowfloof: 'First-Snow Flufflord',
};

const FLOOF_PRICES = {
  mallowfloof: 95, toastfloof: 100, tidefloof: 100,
  sproutfloof: 105, duskfloof: 105, snowfloof: 110,
};

const FLOOF_HABITATS = {
  mallowfloof: ['sugar', 'grove'],
  toastfloof: ['ember', 'grove'],
  tidefloof: ['tide', 'crystal'],
  sproutfloof: ['grove', 'mycelium'],
  duskfloof: ['night', 'dream'],
  snowfloof: ['frost', 'aurora'],
};

const FLOOF_HYBRIDS = {
  'mallowfloof+radiant': 'Sun Mallow',
  'toastfloof+ember': 'Crumpet Spark',
  'tidefloof+tide': 'Bubblebay',
  'sproutfloof+bloom': 'Mossmallow',
  'duskfloof+dusk': 'Moonmallow',
  'snowfloof+frost': 'Snowmallow',
  'mallowfloof+snowfloof': 'Marshmallow Drift',
  'toastfloof+mallowfloof': 'Campfire Floof',
};

Object.assign(ELEMENTS, FLOOF_SPECIES);
Object.assign(GENE_POWERS, FLOOF_GENES);
Object.assign(TITAN_NAMES, FLOOF_TITANS);
Object.assign(HYBRID_NAMES, FLOOF_HYBRIDS);
Object.assign(TYPE_EGG_BASE_PRICE, FLOOF_PRICES);
Object.entries(FLOOF_SPECIES).forEach(([key, meta]) => {
  TYPE_EGG_PRICE[key] = discountedEggPrice(FLOOF_PRICES[key]);
  NAME_START[key] = [meta.name.split(' ')[0], 'Floof', 'Tuft', 'Puff'];
  if (!ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
  (FLOOF_HABITATS[key] || ['starlit']).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});
