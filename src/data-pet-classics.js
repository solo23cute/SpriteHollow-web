/* Virtual Pet Classics Wave: 8 iconic virtual-pet and mobile runner animal sprites.
   Loaded after base data so all global maps exist. */

const PET_CLASSICS_SPECIES = {
  talkingcat: {
    name: 'Talking Tom & Angela', primary: '#b0b8c0', light: '#f0f4f8', deep: '#505860', accent: '#ff80ab',
    trait: 'Chatty — echoes back everything you say in a funny voice.',
    blurb: 'A glamorous gray cat with big green eyes who loves talking, bathtub suds, and singing duets.',
    greeting: 'Say something! I can repeat it right back in my high-pitched voice!',
    likes: 'Star Pop',
  },
  poublob: {
    name: 'Pou Blob', primary: '#a67c52', light: '#f4ece1', deep: '#543b22', accent: '#40c4ff',
    trait: 'Cozy — loves eating candy, taking baths, and wearing tiny hats.',
    blurb: 'A cute triangular brown friend who loves snacks, playing match games, and cozy naps.',
    greeting: 'Bloop! Feed me a pancake or let’s play a mini-game!',
    likes: 'Honeycomb Cake',
  },
  omnomfrog: {
    name: 'Om Nom Candy Monster', primary: '#76ff03', light: '#f1ffe8', deep: '#33b000', accent: '#ff3d00',
    trait: 'Sweet Tooth — catches falling candy stars with a giant gulp.',
    blurb: 'A green candy-obsessed creature with a huge mouth, cute antennae, and an endless appetite for sweets.',
    greeting: 'Nom nom nom! Is that candy in your pocket?',
    likes: 'Star Pop',
  },
  tamagotchi: {
    name: 'Pixel Tamagotchi', primary: '#ff4081', light: '#ffe4ec', deep: '#880e4f', accent: '#00e676',
    trait: 'Digital — lives on a keychain screen andbeeps with joy.',
    blurb: 'A retro egg-shaped digital pet with pixel eyes who beeps whenever it wants a snack or play time.',
    greeting: 'Beep boop! Clean my pixel room and give me a heart!',
    likes: 'Star Cookie',
  },
  ovipetdragon: {
    name: 'OviPets Dragon', primary: '#7c4dff', light: '#ede7f6', deep: '#311b92', accent: '#ffd700',
    trait: 'Genetic — carries dozens of rare mutation genes and rainbow eggs.',
    blurb: 'A magical genetic dragon with iridescent wings who hatches from multi-patterned egg clutches.',
    greeting: 'My scales reflect a hundred genetic combinations! Let’s hatch a new breed.',
    likes: 'Ember Steak',
  },
  gingerfox: {
    name: 'Talking Ginger', primary: '#ff9100', light: '#fff3e0', deep: '#e65100', accent: '#00b0ff',
    trait: 'Playful — loves toilet paper rolls, bubbles, and bedtime stories.',
    blurb: 'A fluffy orange kitten-fox with boundless energy who loves brushing teeth and popping bubbles.',
    greeting: 'Unroll the toilet paper! Let’s make a giant paper fort!',
    likes: 'Honey Drop',
  },
  subwaysurfer: {
    name: 'Subway Surfer Runner', primary: '#2979ff', light: '#e3f2fd', deep: '#0d47a1', accent: '#ffea00',
    trait: 'Dashing — surfs train tracks and dodges obstacles at full sprint.',
    blurb: 'A hoodie-wearing runner with a hoverboard who dashes through subway tracks collecting gold coins.',
    greeting: 'Keep moving! Grinders, guard dogs, and trains can’t stop us!',
    likes: 'Trail Mix',
  },
  booalien: {
    name: 'My Boo Alien', primary: '#d500f9', light: '#fbe9e7', deep: '#4a148c', accent: '#00e5ff',
    trait: 'Cute — round alien pet that loves dress-up and mini-games.',
    blurb: 'A squishy violet alien companion with big sparkling eyes who loves outfits and trampoline jumping.',
    greeting: 'Boo! Pick out a funny hat for me today!',
    likes: 'Moon Cake',
  },
};

const PET_CLASSICS_GENES = {
  talkingcat: { name: 'Voice Echo', icon: '🎤', desc: 'Chats pay +5 bonus coins and bond builds +20%.', effect: { chatCoins: 5, petBond: 1.2 } },
  poublob: { name: 'Blob Feast', icon: '🥞', desc: 'Snacks pay +30% XP and bath/care builds +25% bond.', effect: { xp: 1.3, petBond: 1.25 } },
  omnomfrog: { name: 'Candy Catch', icon: '🍬', desc: 'Candy and food games pay +6 bonus coins.', effect: { gameCoins: 6 } },
  tamagotchi: { name: 'Pixel Beep', icon: '👾', desc: 'Check-ins pay +5 bonus coins and gifts arrive 20% sooner.', effect: { checkinCoins: 5, giftSpeed: 1.2 } },
  ovipetdragon: { name: 'Genetic Clutch', icon: '🥚', desc: 'Hatching and breeding pay +8 bonus coins.', effect: { gameCoins: 8, xp: 1.2 } },
  gingerfox: { name: 'Bubble Pop', icon: '🫧', desc: 'Day games pay +4 coins and chats pay +2 coins.', effect: { dayCoins: 4, chatCoins: 2 } },
  subwaysurfer: { name: 'Subway Dash', icon: '🛹', desc: 'Runner games pay +8 bonus coins and gifts arrive 25% faster.', effect: { gameCoins: 8, giftSpeed: 1.25 } },
  booalien: { name: 'Boo Dressup', icon: '🔮', desc: 'All games pay +4 coins and bond builds +20%.', effect: { gameCoins: 4, petBond: 1.2 } },
};

const PET_CLASSICS_TITANS = {
  talkingcat: 'Sovereign of the Talking Stage',
  poublob: 'Emperor of the Cozy Blob Kingdom',
  omnomfrog: 'Supreme Lord of Sweet Candies',
  tamagotchi: 'Arch-Master of the Pixel Keychain',
  ovipetdragon: 'Grand Genetic Dragon Sovereign',
  gingerfox: 'High Chieftain of Playful Mischief',
  subwaysurfer: 'Legendary Subway Surfer MVP',
  booalien: 'Cosmic Monarch of the Boo Galaxy',
};

const PET_CLASSICS_PRICES = {
  talkingcat: 140,
  poublob: 125,
  omnomfrog: 135,
  tamagotchi: 130,
  ovipetdragon: 150,
  gingerfox: 130,
  subwaysurfer: 140,
  booalien: 125,
};

const PET_CLASSICS_HYBRIDS = {
  'talkingcat+dusk': 'Moon Opera',
  'poublob+candy': 'Pancake Blob',
  'omnomfrog+tide': 'Sugar Frog',
  'tamagotchi+volt': 'Digital Pixel',
  'ovipetdragon+ember': 'Inferno Dragon',
  'gingerfox+bloom': 'Forest Kit',
  'subwaysurfer+volt': 'Hoverboard Surfer',
  'booalien+dream': 'Starlit Boo',
};

const PET_CLASSICS_HABITATS = {
  talkingcat: ['night', 'sugar'],
  poublob: ['sugar', 'grove'],
  omnomfrog: ['tide', 'grove'],
  tamagotchi: ['neon', 'dream'],
  ovipetdragon: ['ember', 'crystal'],
  gingerfox: ['grove', 'aurora'],
  subwaysurfer: ['neon', 'savanna'],
  booalien: ['dream', 'night'],
};

if (typeof ELEMENTS !== 'undefined') Object.assign(ELEMENTS, PET_CLASSICS_SPECIES);
if (typeof GENE_POWERS !== 'undefined') Object.assign(GENE_POWERS, PET_CLASSICS_GENES);
if (typeof TITAN_NAMES !== 'undefined') Object.assign(TITAN_NAMES, PET_CLASSICS_TITANS);
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, PET_CLASSICS_HYBRIDS);
if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') Object.assign(TYPE_EGG_BASE_PRICE, PET_CLASSICS_PRICES);
if (typeof TYPE_EGG_PRICE !== 'undefined') {
  Object.keys(PET_CLASSICS_PRICES).forEach((key) => {
    TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(PET_CLASSICS_PRICES[key]) : PET_CLASSICS_PRICES[key];
  });
}
if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...Object.keys(PET_CLASSICS_SPECIES));

/* Every virtual-pet mini-game, grouped in the Activities hub. Keep this list in
   one place so the menu, the tag rows, and the classic list stay in sync. */
const PET_GAME_KEYS = [
  'spa',
  'surfer', 'candydrop', 'talkecho', 'genehatch',
  'flappypet', 'petpairs', 'petclean', 'petslice',
  'eggsort', 'nestdefense', 'eggpaint', 'eggtap',
  'petfetch', 'petgroom', 'pufflegroom', 'petdance',
  'roundup', 'dragonnest',
];
if (typeof SCENES !== 'undefined') {
  Object.entries(PET_CLASSICS_HABITATS).forEach(([key, scenes]) => {
    scenes.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
}

/* Extra virtual-pet additions: registered through the same maps
   as the rest of this wave, so counts, eggs and homes pick them up. */
const EXTRA_PET_CLASSICS_SPECIES = {
  "neopetfaerie": {
    "name": "Faerie Neopet",
    "primary": "#c9a8ff",
    "light": "#f4ecff",
    "deep": "#3d2a6b",
    "accent": "#8be9ff",
    "trait": "Dreaming — spends its day planning a customisation it will never finish.",
    "likes": "Moon Cake",
    "blurb": "A soft pastel virtual pet with tiny wings and a long list of paint brushes it still wants.",
    "greeting": "I found the perfect background. Now I need the perfect hat.",
    "price": 260,
    "homes": [
      "dream",
      "skyisles"
    ],
    "titan": "Faerie Brush",
    "gene": {
      "name": "Customise",
      "icon": "🎨",
      "desc": "+20% XP and gifts arrive 20% sooner.",
      "effect": {
        "xp": 1.2,
        "giftSpeed": 1.2
      }
    }
  },
  "digipetegg": {
    "name": "Digi Pet Egg",
    "primary": "#8be9ff",
    "light": "#e8fbff",
    "deep": "#123a4a",
    "accent": "#ffd166",
    "trait": "Beeping — asks for a snack in three notes and never in words.",
    "likes": "Star Cookie",
    "blurb": "A keychain egg with a pixel face that beeps when it needs care and hums when it does not.",
    "greeting": "Beep! Beep beep! (That means hello, and also snack.)",
    "price": 230,
    "homes": [
      "neon",
      "sugar"
    ],
    "titan": "Pocket Egg",
    "gene": {
      "name": "Pocket Care",
      "icon": "🥚",
      "desc": "Checks pay +5 coins and needs fade 12% slower.",
      "effect": {
        "checkinCoins": 5,
        "decay": 0.88
      }
    }
  },
  "talkingpup": {
    "name": "Talking Pup",
    "primary": "#d9b06b",
    "light": "#fff0d6",
    "deep": "#5a3a12",
    "accent": "#5ad6ff",
    "trait": "Repeating — echoes your last word with enormous enthusiasm.",
    "likes": "Honey Drop",
    "blurb": "A chatty virtual pup who repeats everything back and genuinely believes it is helping.",
    "greeting": "Hello! Hello! Hello! ...I am very good at this.",
    "price": 220,
    "homes": [
      "grove",
      "sugar"
    ],
    "titan": "Echo Pup",
    "gene": {
      "name": "Echo",
      "icon": "🗣️",
      "desc": "Chats pay +5 coins and bond builds 20% faster.",
      "effect": {
        "chatCoins": 5,
        "petBond": 1.2
      }
    }
  },
  "runnerpanda": {
    "name": "Runner Panda",
    "primary": "#e8e8ee",
    "light": "#ffffff",
    "deep": "#2f2f3a",
    "accent": "#7ee787",
    "trait": "Dashing — treats every hallway as a downhill slope.",
    "likes": "Trail Mix",
    "blurb": "A parkour panda with sneakers, a headband, and no memory of ever slowing down.",
    "greeting": "Jump, slide, jump! Try to keep up!",
    "price": 225,
    "homes": [
      "neon",
      "savanna"
    ],
    "titan": "Endless Runner",
    "gene": {
      "name": "Sprint",
      "icon": "🏃",
      "desc": "Games pay +5 coins and energy fades 20% slower.",
      "effect": {
        "gameCoins": 5,
        "energyDecay": 0.8
      }
    }
  }
};

Object.entries(EXTRA_PET_CLASSICS_SPECIES).forEach(([key, meta]) => {
  ELEMENTS[key] = {
    name: meta.name, primary: meta.primary, light: meta.light, deep: meta.deep,
    accent: meta.accent, trait: meta.trait, blurb: meta.blurb, greeting: meta.greeting,
    likes: meta.likes,
  };
  GENE_POWERS[key] = meta.gene;
  TITAN_NAMES[key] = meta.titan;
  TYPE_EGG_BASE_PRICE[key] = meta.price;
  TYPE_EGG_PRICE[key] = discountedEggPrice(meta.price);
  meta.homes.forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
  ELEMENT_KEYS.push(key);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
});


/* Named hybrids for the extra virtual-pet arrivals. */
const EXTRA_PET_CLASSICS_HYBRIDS = {
  'neopetfaerie+neopet': 'Faerie Paint',
  'digipetegg+tamagotchi': 'Digital Egg',
  'talkingpup+talkingcat': 'Talk Duo',
  'runnerpanda+subwaysurfer': 'Endless Runner',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, EXTRA_PET_CLASSICS_HYBRIDS);
