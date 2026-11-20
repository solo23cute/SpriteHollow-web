/* Theme showcase wave: video games, TV, memes, and virtual pets that were
   still missing from the roster. Same shape as the other waves: a palette,
   a personality, a gene, a Titan, a price, homes, and a named hybrid. */

const SHOWCASE_SPECIES = {
  roblox: {
    name: 'Robloxian', primary: '#e3453a', light: '#ffd9d6', deep: '#6b1410', accent: '#4aa3ff',
    trait: 'Builds — turns every room into an obstacle course with a checkered floor.',
    blurb: 'A blocky adventurer who has cleared more obbys than anyone can count and still says “oops” at the last jump.',
    greeting: 'Want to try my obby? It is only slightly impossible.', likes: 'Star Cookie',
  },
  fallguys: {
    name: 'Fall Guy', primary: '#ff8fc8', light: '#ffe4f2', deep: '#8a2a52', accent: '#ffd166',
    trait: 'Wobbling — cannot cross a room without a dramatic tumble and a quick recovery.',
    blurb: 'A bean-shaped competitor with a permanent sugar rush and absolutely no sense of balance.',
    greeting: 'I nearly won that one. I will nearly win the next one too.', likes: 'Candyfloss',
  },
  kratos: {
    name: 'Spartan', primary: '#c9b8a3', light: '#f6e9da', deep: '#4a3a2c', accent: '#e3453a',
    trait: 'Unshakeable — meets every setback with a very long pause and a deeper breath.',
    blurb: 'A scarred warrior who speaks in short sentences, carries an unreasonable amount of history, and is unexpectedly gentle with small sprites.',
    greeting: 'Boy. ...We walk.', likes: 'Honeycomb Cake',
  },
  lara: {
    name: 'Raider', primary: '#b98a5a', light: '#f2ddc2', deep: '#4a2f16', accent: '#7ee787',
    trait: 'Explorer — treats a locked door as a personal invitation.',
    blurb: 'An archaeologist with a torch, a rope, and a talent for finding the one tile that was secretly a trap.',
    greeting: 'That tomb was not empty. It was just waiting.', likes: 'Lemonade',
  },
  masterchief: {
    name: 'Spartan Chief', primary: '#4e7a4a', light: '#d6f0d2', deep: '#1d3320', accent: '#ffd166',
    trait: 'Steady — finishes the mission, then asks what the mission was.',
    blurb: 'A green-armoured soldier who never takes the helmet off and is quietly the most reliable sprite in the Hollow.',
    greeting: 'Understood. Where do you need me?', likes: 'Star Cookie',
  },
  wednesday: {
    name: 'Wednesday', primary: '#2f2f38', light: '#d9d9e6', deep: '#101018', accent: '#b69cff',
    trait: 'Deadpan — delivers every compliment like a threat and every threat like a compliment.',
    blurb: 'A gloomy student with two braids, a cello, and a gift for making the Hollow feel wonderfully eerie.',
    greeting: 'I am not smiling. This is my smiling.', likes: 'Black Coffee',
  },
  demogorgon: {
    name: 'Demogorgon', primary: '#8a5a5a', light: '#e6c9c9', deep: '#3a1e1e', accent: '#ff5e8a',
    trait: 'Hungry — opens doors that were not doors and sniffs out snacks from three rooms away.',
    blurb: 'A petal-faced visitor from the wrong side of the wall who is mostly just looking for a warm place to nap.',
    greeting: '...', likes: 'Warm Milk',
  },
  mando: {
    name: 'Mandalorian', primary: '#8f97a8', light: '#e3e8f2', deep: '#2f3442', accent: '#4aa3ff',
    trait: 'Guarding — stands between the Hollow and anything that looks like trouble.',
    blurb: 'A helmeted wanderer with a small green companion and a strict personal code about snacks.',
    greeting: 'This is the way. Also, is that a snack?', likes: 'Honeycomb Cake',
  },
  bluey: {
    name: 'Bluey', primary: '#5aa7e0', light: '#d9ecff', deep: '#1f4a6b', accent: '#ffd166',
    trait: 'Playful — invents a new game before finishing the last one.',
    blurb: 'A blue heeler pup with endless energy, a very patient family, and a genius for turning chores into adventures.',
    greeting: 'Let us play a game! You be the dragon.', likes: 'Star Cookie',
  },
  grimace: {
    name: 'Grimace', primary: '#a56bd9', light: '#eadcff', deep: '#3d2a6b', accent: '#ff8fc8',
    trait: 'Shaking — offers everyone a purple drink and never explains what is in it.',
    blurb: 'A big purple friend with a birthday shake, a suspicious smile, and the best intentions.',
    greeting: 'Happy birthday! Drink this. Trust me.', likes: 'Berry Fizz',
  },
  furby: {
    name: 'Furby', primary: '#d9a86b', light: '#ffe9c9', deep: '#5a3a12', accent: '#8be9ff',
    trait: 'Chattering — learns three words and uses all of them constantly.',
    blurb: 'A fluffy virtual pet that babbles in its own language, opens its eyes when you least expect it, and remembers everything.',
    greeting: 'Dah-ay-loh! You are my favourite. Probably.', likes: 'Candy Apple',
  },
  neopet: {
    name: 'Neopet', primary: '#7ed957', light: '#eaffd6', deep: '#2a5a1e', accent: '#ffd166',
    trait: 'Collecting — hoards paint brushes and dreams of one perfect customisation.',
    blurb: 'A cheerful virtual companion from a browser world of shops, games, and impossible dailies.',
    greeting: 'I found a paint brush! It is not the one I wanted, but still!', likes: 'Star Pop',
  },
};

const SHOWCASE_GENES = {
  roblox: ['Obbymaster', '🧱', 'Games pay +4 coins and goals pay +2 coins.', { gameCoins: 4, taskCoins: 2 }],
  fallguys: ['Wobble', '🫘', 'Joy fades 25% slower and games pay +2 coins.', { joyDecay: 0.75, gameCoins: 2 }],
  kratos: ['Spartan Calm', '🛡️', 'All needs fade 12% slower and +16% XP.', { decay: 0.88, xp: 1.16 }],
  lara: ['Tomb Sense', '🔦', 'Goals pay +4 coins and night games pay +2.', { taskCoins: 4, nightCoins: 2 }],
  masterchief: ['Mission Ready', '🎖️', 'Energy fades 25% slower and all needs fade 8% slower.', { energyDecay: 0.75, decay: 0.92 }],
  wednesday: ['Deadpan', '🖤', 'Chats pay +3 coins and night games pay +3.', { chatCoins: 3, nightCoins: 3 }],
  demogorgon: ['Door Sniff', '🌸', 'Snacks give +40% XP and hunger fades 15% slower.', { snackXp: 1.4, hungerDecay: 0.85 }],
  mando: ['This Is The Way', '🪖', 'Gifts arrive 20% sooner and all needs fade 10% slower.', { giftSpeed: 1.2, decay: 0.9 }],
  bluey: ['Playtime', '🎈', 'Games pay +4 coins and pets build 25% more bond.', { gameCoins: 4, petBond: 1.25 }],
  grimace: ['Birthday Shake', '🥤', 'Snacks give +35% XP and joy fades 20% slower.', { snackXp: 1.35, joyDecay: 0.8 }],
  furby: ['Babble', '👀', 'Chats pay +2 coins and joy fades 30% slower.', { chatCoins: 2, joyDecay: 0.7 }],
  neopet: ['Paint Brush', '🖌️', '+20% XP and tasks pay +2 coins.', { xp: 1.2, taskCoins: 2 }],
};

const SHOWCASE_TITANS = {
  roblox: 'Obby Colossus', fallguys: 'Wobble Titan', kratos: 'Spartan Sovereign',
  lara: 'Tomb Titan', masterchief: 'Chief Colossus', wednesday: 'Deadpan Titan',
  demogorgon: 'Petal Titan', mando: 'Way Titan', bluey: 'Playtime Titan',
  grimace: 'Shake Titan', furby: 'Babble Titan', neopet: 'Paint Titan',
};

const SHOWCASE_PRICES = {
  roblox: 140, fallguys: 135, kratos: 200, lara: 175, masterchief: 190, wednesday: 165,
  demogorgon: 160, mando: 180, bluey: 130, grimace: 150, furby: 120, neopet: 145,
};

const SHOWCASE_HOMES = {
  roblox: ['memecore', 'neon'], fallguys: ['memecore', 'sugar'], kratos: ['memecore', 'ember'],
  lara: ['memecore', 'grove'], masterchief: ['memecore', 'neon'], wednesday: ['memecore', 'night'],
  demogorgon: ['memecore', 'night'], mando: ['memecore', 'neon'], bluey: ['memecore', 'grove'],
  grimace: ['memecore', 'sugar'], furby: ['memecore', 'dream'], neopet: ['memecore', 'grove'],
};

const SHOWCASE_HYBRIDS = {
  'roblox+fallguys': 'Obby Bean',
  'kratos+masterchief': 'Two Soldiers',
  'lara+demogorgon': 'Tomb Bloom',
  'wednesday+furby': 'Deadpan Babble',
  'mando+bluey': 'Way of Play',
  'grimace+neopet': 'Purple Brush',
};

/* Only new species are registered: a key that already exists keeps its
   original palette, gene, and homes. */
const SHOWCASE_THEME_KEYS = Object.keys(SHOWCASE_SPECIES).filter((key) => !ELEMENTS[key]);

SHOWCASE_THEME_KEYS.forEach((key) => {
  const meta = SHOWCASE_SPECIES[key];
  const gene = SHOWCASE_GENES[key] || ['Theme Magic', '✨', '+10% XP.', { xp: 1.1 }];
  ELEMENTS[key] = {
    name: meta.name,
    primary: meta.primary,
    light: meta.light,
    deep: meta.deep,
    accent: meta.accent,
    trait: meta.trait,
    blurb: meta.blurb,
    greeting: meta.greeting,
    likes: meta.likes,
  };
  GENE_POWERS[key] = { name: gene[0], icon: gene[1], desc: gene[2], effect: gene[3] };
  TITAN_NAMES[key] = SHOWCASE_TITANS[key] || `${meta.name} Titan`;
  NAME_START[key] = [meta.name.split(' ')[0], 'Theme', 'Show', 'Screen', 'Arcade', 'Pet'];
  TYPE_EGG_BASE_PRICE[key] = SHOWCASE_PRICES[key] || 140;
  TYPE_EGG_PRICE[key] = discountedEggPrice(TYPE_EGG_BASE_PRICE[key]);
  (SHOWCASE_HOMES[key] || ['memecore']).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});

Object.assign(HYBRID_NAMES, SHOWCASE_HYBRIDS);

ELEMENT_KEYS.push(...SHOWCASE_THEME_KEYS);
SHOWCASE_THEME_KEYS.forEach((key) => {
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
});

/* Extra games, TV and pet additions: registered through the same maps
   as the rest of this wave, so counts, eggs and homes pick them up. */
const EXTRA_SHOWCASE_SPECIES = {
  "speedrunfox": {
    "name": "Speedrun Fox",
    "primary": "#ff8a3c",
    "light": "#ffe6cc",
    "deep": "#6b2f08",
    "accent": "#5ad6ff",
    "trait": "Optimal — takes the shortest route even when it is through a wall.",
    "likes": "Star Pop",
    "blurb": "A fox with a stopwatch, a route plan, and a personal record it will mention unprompted.",
    "greeting": "Any% no glitches. Watch the frame count.",
    "price": 210,
    "homes": [
      "neon",
      "savanna"
    ],
    "titan": "Frame Perfect",
    "gene": {
      "name": "Frame Skip",
      "icon": "⏱️",
      "desc": "Games pay +6 coins and +12% XP.",
      "effect": {
        "gameCoins": 6,
        "xp": 1.12
      }
    }
  },
  "bossrushbear": {
    "name": "Boss Rush Bear",
    "primary": "#a85a5a",
    "light": "#f2d6d6",
    "deep": "#4a1e1e",
    "accent": "#ffd166",
    "trait": "Relentless — treats every room as the penultimate boss.",
    "likes": "Ember Steak",
    "blurb": "A broad-shouldered bear with a gauntlet on one paw and a health bar for a mood ring.",
    "greeting": "One more phase. There is always one more phase.",
    "price": 215,
    "homes": [
      "ember",
      "crystal"
    ],
    "titan": "Final Phase",
    "gene": {
      "name": "Second Wind",
      "icon": "🔥",
      "desc": "Energy fades 20% slower and games pay +3 coins.",
      "effect": {
        "energyDecay": 0.8,
        "gameCoins": 3
      }
    }
  },
  "lootgoblin": {
    "name": "Loot Goblin",
    "primary": "#7ed957",
    "light": "#eaffd6",
    "deep": "#2a5a1e",
    "accent": "#ffd166",
    "trait": "Collecting — anything not nailed down is loot, and nails are negotiable.",
    "likes": "Trail Mix",
    "blurb": "A small green hoarder with a sack of common drops and a suspicious amount of confidence.",
    "greeting": "Rare drop? No. But look at all this stuff.",
    "price": 190,
    "homes": [
      "mycelium",
      "memecore"
    ],
    "titan": "Loot Sovereign",
    "gene": {
      "name": "Drop Rate",
      "icon": "🎁",
      "desc": "Gifts arrive 25% sooner and coins +10%.",
      "effect": {
        "giftSpeed": 1.25,
        "coins": 1.1
      }
    }
  },
  "sitcomcat": {
    "name": "Sitcom Cat",
    "primary": "#d9a86b",
    "light": "#fff0d6",
    "deep": "#5a3a12",
    "accent": "#5ad6ff",
    "trait": "Timing — pauses for a laugh that is not there.",
    "likes": "Honeycomb Cake",
    "blurb": "A TV cat who delivers one-liners to an invisible studio audience and waits for the applause.",
    "greeting": "So no one told you life was gonna be this way. ...Anyone?",
    "price": 195,
    "homes": [
      "sugar",
      "dream"
    ],
    "titan": "Studio Sovereign",
    "gene": {
      "name": "Laugh Track",
      "icon": "🎙️",
      "desc": "Joy fades 25% slower and chats pay +3 coins.",
      "effect": {
        "joyDecay": 0.75,
        "chatCoins": 3
      }
    }
  },
  "petrock": {
    "name": "Pet Rock",
    "primary": "#a8a29a",
    "light": "#e6e2da",
    "deep": "#4a463f",
    "accent": "#8fe07a",
    "trait": "Low maintenance — has needs, just never mentions them.",
    "likes": "Warm Tea",
    "blurb": "A perfectly ordinary rock with a tiny painted face and an unshakeable calm.",
    "greeting": "... (It is very pleased to see you.)",
    "price": 120,
    "homes": [
      "grove",
      "memecore"
    ],
    "titan": "Stone Companion",
    "gene": {
      "name": "Steady Rock",
      "icon": "🪨",
      "desc": "All needs fade 15% slower.",
      "effect": {
        "decay": 0.85
      }
    }
  }
};

Object.entries(EXTRA_SHOWCASE_SPECIES).forEach(([key, meta]) => {
  ELEMENTS[key] = {
    name: meta.name, primary: meta.primary, light: meta.light, deep: meta.deep,
    accent: meta.accent, trait: meta.trait, blurb: meta.blurb, greeting: meta.greeting,
    likes: meta.likes,
  };
  GENE_POWERS[key] = meta.gene;
  TITAN_NAMES[key] = meta.titan;
  NAME_START[key] = [meta.name.split(' ')[0], 'Theme', 'Show', 'Screen', 'Arcade', 'Pet'];
  TYPE_EGG_BASE_PRICE[key] = meta.price;
  TYPE_EGG_PRICE[key] = discountedEggPrice(meta.price);
  meta.homes.forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
  SHOWCASE_THEME_KEYS.push(key);
  ELEMENT_KEYS.push(key);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
});

/* Named hybrids for the extra showcase arrivals. */
const EXTRA_SHOWCASE_HYBRIDS = {
  'speedrunfox+roblox': 'Any% Fox',
  'bossrushbear+kratos': 'Boss Rush Spartan',
  'lootgoblin+neopet': 'Loot Paint',
  'sitcomcat+furby': 'Laugh Track',
  'petrock+grimace': 'Pet Rock Shake',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, EXTRA_SHOWCASE_HYBRIDS);
