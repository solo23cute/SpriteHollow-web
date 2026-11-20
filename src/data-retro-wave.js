/* Retro, emote, cartoon/anime, and legendary-pet wave.
   Same registration shape as the other waves so the Nest, Wiki, Codex and
   tour pick these up without extra wiring. Art stays original vector work. */

const RETRO_SPECIES = {
  flossdancer: {
    name: 'Floss Dancer', primary: '#4aa3ff', light: '#d9ecff', deep: '#1f3a6b', accent: '#ffd166',
    trait: 'Swinging — celebrates absolutely everything with the same two-arm sweep.',
    blurb: 'A victory-obsessed dancer who treats every snack, nap, and trail as a reason to celebrate.',
    greeting: 'We won! What did we win? Does not matter — we won.', likes: 'Star Pop',
  },
  orangejustice: {
    name: 'Orange Justice', primary: '#ff8a3c', light: '#ffe3cc', deep: '#6b2f10', accent: '#8b7bff',
    trait: 'Bouncing — cannot stand still for more than a second and a half.',
    blurb: 'A bright orange show-off with a signature bounce and an unshakeable belief that dancing solves problems.',
    greeting: 'Watch this. No, watch this. Okay, now watch this.', likes: 'Candy Apple',
  },
  takethel: {
    name: 'Take the L', primary: '#b69cff', light: '#efe6ff', deep: '#3d2a6b', accent: '#ff8fc8',
    trait: 'Smug — wins gracefully and then celebrates for a very long time.',
    blurb: 'A theatrical winner who has never once lost a game and refuses to discuss the evidence.',
    greeting: 'You played well. I played better. Shall we go again?', likes: 'Berry Fizz',
  },
  llamabell: {
    name: 'Llama Bell', primary: '#ffd166', light: '#fff6cc', deep: '#7a5a12', accent: '#7ee787',
    trait: 'Ringing — announces every arrival, departure, and snack with a chime.',
    blurb: 'A festive little bell-shaped friend who genuinely believes the Hollow needs a soundtrack.',
    greeting: 'Ding! I am here. Ding! Still here.', likes: 'Honeycomb Cake',
  },
  pixelinvader: {
    name: 'Pixel Invader', primary: '#7ee787', light: '#e2ffe6', deep: '#1d4a24', accent: '#b69cff',
    trait: 'Marching — moves in tidy rows and refuses to break formation for anyone.',
    blurb: 'An eight-bit visitor that descends a little each day, hums in square waves, and is secretly very polite.',
    greeting: 'We come in peace. Also in rows.', likes: 'Star Cookie',
  },
  tetromino: {
    name: 'Tetromino', primary: '#56c8e8', light: '#dff7ff', deep: '#12485a', accent: '#ffd166',
    trait: 'Stacking — sees every empty space as a shape that needs filling.',
    blurb: 'A four-block friend that fits into any corner, clears whole rows of mess, and disappears when embarrassed.',
    greeting: 'There is a gap. I will handle the gap.', likes: 'Warm Tea',
  },
  paddlepong: {
    name: 'Paddle Pong', primary: '#f2efe8', light: '#ffffff', deep: '#4a4a4a', accent: '#7ee787',
    trait: 'Rallying — never lets a conversation drop, ever.',
    blurb: 'A blocky competitor from the first era of games, still keeping the ball in play after all these years.',
    greeting: 'Your turn. My turn. Your turn. My turn.', likes: 'Lemonade',
  },
  hopperfrog: {
    name: 'Hopper Frog', primary: '#7ed957', light: '#eaffd6', deep: '#2a5a1e', accent: '#ffd166',
    trait: 'Crossing — treats every road like a puzzle with a very short timer.',
    blurb: 'A brave little frog who has crossed more lanes than anyone and still looks both ways twice.',
    greeting: 'One hop at a time. That is the whole strategy.', likes: 'Star Pop',
  },
  starscout: {
    name: 'Star Scout', primary: '#ff8fc8', light: '#ffe4f2', deep: '#7a2a52', accent: '#ffd166',
    trait: 'Transforming — has a dramatic speech ready for every minor inconvenience.',
    blurb: 'A magical guardian with a star wand, a strict sense of justice, and a homework deadline she keeps ignoring.',
    greeting: 'By starlight, I will fix this! After a snack.', likes: 'Candyfloss',
  },
  ninjaleaf: {
    name: 'Ninja Leaf', primary: '#4a9a5a', light: '#dcf5e0', deep: '#173d1d', accent: '#f2efe8',
    trait: 'Silent — appears behind you, says one line, and vanishes again.',
    blurb: 'A leaf-cloaked shinobi who moves without a sound and leaves a perfectly folded note behind.',
    greeting: 'You did not see me. That was the point.', likes: 'Warm Tea',
  },
  toonanvil: {
    name: 'Toon Anvil', primary: '#8f97a8', light: '#e3e8f2', deep: '#2f3442', accent: '#ff8a3c',
    trait: 'Heavy — falls from a great height at exactly the wrong moment.',
    blurb: 'A cartoon prop with impeccable comic timing, a flat top, and no memory of how it got up there.',
    greeting: 'I am fine. Everything is fine. Look up.', likes: 'Star Cookie',
  },
  rubberhose: {
    name: 'Rubber Hose', primary: '#d9c9a3', light: '#fbf3e0', deep: '#4a3f2c', accent: '#e3453a',
    trait: 'Bendy — every limb moves in a cheerful arc that ignores anatomy.',
    blurb: 'A 1930s cartoon troublemaker with pie eyes, a whistle, and a talent for surviving falling pianos.',
    greeting: 'Well, hello there! (That was my catchphrase.)', likes: 'Berry Fizz',
  },
  frostkitten: {
    name: 'Frost Kitten', primary: '#bfe9ff', light: '#f2fbff', deep: '#2a5a7a', accent: '#8b7bff',
    trait: 'Frosty — leaves tiny snowprints and naps inside the freezer.',
    blurb: 'A rare winter kitten with ice-tipped ears and a purr that sounds like cracking ice.',
    greeting: 'Mew. It is cold. I am perfect.', likes: 'Warm Milk',
  },
  emberpup: {
    name: 'Ember Pup', primary: '#ff8a5c', light: '#ffe0d2', deep: '#7a2a10', accent: '#ffd166',
    trait: 'Smouldering — runs hot, naps in sunbeams, and sneezes sparks.',
    blurb: 'A rare fire pup with a coal-dark nose and a tail that wags like a small campfire.',
    greeting: 'Bark! I found a warm spot. It is mine. You may share.', likes: 'Honeycomb Cake',
  },
  auroradrake: {
    name: 'Aurora Drake', primary: '#8be9ff', light: '#e8fbff', deep: '#1f3d6b', accent: '#b69cff',
    trait: 'Shimmering — its wings shift colour with every mood.',
    blurb: 'A legendary sky drake that only hatches under a clear night, trailing green and violet light.',
    greeting: 'The sky was boring. I improved it.', likes: 'Star Cookie',
  },
  lunarmoth: {
    name: 'Lunar Moth', primary: '#e6dcff', light: '#fbf7ff', deep: '#3d2a6b', accent: '#ffd166',
    trait: 'Dreaming — sleeps through the day and reads the night sky like a book.',
    blurb: 'An epic moon moth with dusty wings, a lantern glow, and a habit of landing on sleeping sprites.',
    greeting: 'Shh. The moon is telling a story.', likes: 'Warm Milk',
  },
  obsidiantortoise: {
    name: 'Obsidian Tortoise', primary: '#3a3440', light: '#b8b2c2', deep: '#15121a', accent: '#ff8a5c',
    trait: 'Unhurried — has finished every race it ever started, eventually.',
    blurb: 'A legendary stone tortoise with a shell like polished volcanic glass and the patience of a mountain.',
    greeting: 'I will get there. I always get there.', likes: 'Honeycomb Cake',
  },
  cloudhamster: {
    name: 'Cloud Hamster', primary: '#f2f6ff', light: '#ffffff', deep: '#7a86a8', accent: '#8be9ff',
    trait: 'Floating — stores snacks in cheeks and weather in its fur.',
    blurb: 'A legendary pocket-sized hamster that drifts a little above the ground and rains when it sneezes.',
    greeting: 'I am mostly fluff. Some of it is weather.', likes: 'Star Pop',
  },
};

const RETRO_GENES = {
  flossdancer: ['Victory Sweep', '💃', 'Games pay +4 coins and joy fades 20% slower.', { gameCoins: 4, joyDecay: 0.8 }],
  orangejustice: ['Bounce', '🧡', 'Energy fades 25% slower and pets build 20% more bond.', { energyDecay: 0.75, petBond: 1.2 }],
  takethel: ['Smug Win', '🅻', 'Goals pay +4 coins and +12% XP.', { taskCoins: 4, xp: 1.12 }],
  llamabell: ['Chime In', '🔔', 'Gifts arrive 20% sooner and chats pay +2 coins.', { giftSpeed: 1.2, chatCoins: 2 }],
  pixelinvader: ['Eight Bit', '👾', 'Night games pay +4 coins and +10% XP.', { nightCoins: 4, xp: 1.1 }],
  tetromino: ['Perfect Fit', '🧱', 'All needs fade 12% slower and goals pay +2 coins.', { decay: 0.88, taskCoins: 2 }],
  paddlepong: ['Long Rally', '🏓', 'Games pay +3 coins and bond builds 25% faster.', { gameCoins: 3, petBond: 1.25 }],
  hopperfrog: ['Quick Hop', '🐸', 'Energy fades 20% slower and games pay +2 coins.', { energyDecay: 0.8, gameCoins: 2 }],
  starscout: ['Starlight', '🌟', '+18% XP and snacks give +25% XP.', { xp: 1.18, snackXp: 1.25 }],
  ninjaleaf: ['Silent Step', '🍃', 'Chats pay +3 coins and night games pay +3.', { chatCoins: 3, nightCoins: 3 }],
  toonanvil: ['Comic Timing', '🧨', 'Joy fades 30% slower and games pay +2 coins.', { joyDecay: 0.7, gameCoins: 2 }],
  rubberhose: ['Rubber Limbs', '🎩', 'All needs fade 10% slower and pets pay +2 coins.', { decay: 0.9, petCoins: 2 }],
  frostkitten: ['Frost Purr', '❄️', 'Joy fades 30% slower and hunger fades 15% slower.', { joyDecay: 0.7, hungerDecay: 0.85 }],
  emberpup: ['Warm Heart', '🔥', 'Snacks give +45% XP and energy fades 20% slower.', { snackXp: 1.45, energyDecay: 0.8 }],
  auroradrake: ['Sky Shimmer', '🌌', '+28% XP and gifts arrive 25% sooner.', { xp: 1.28, giftSpeed: 1.25 }],
  lunarmoth: ['Moon Read', '🌙', 'Night games pay +6 coins and chats pay +2.', { nightCoins: 6, chatCoins: 2 }],
  obsidiantortoise: ['Stone Patience', '🪨', 'All needs fade 20% slower and +15% XP.', { decay: 0.8, xp: 1.15 }],
  cloudhamster: ['Weather Cheeks', '☁️', 'Gifts arrive 25% sooner and joy fades 25% slower.', { giftSpeed: 1.25, joyDecay: 0.75 }],
};

const RETRO_TITANS = {
  flossdancer: 'Floss Colossus', orangejustice: 'Justice Titan', takethel: 'Victory Sovereign',
  llamabell: 'Bell Titan', pixelinvader: 'Invader Prime', tetromino: 'Block Titan',
  paddlepong: 'Rally Titan', hopperfrog: 'Crossing Titan', starscout: 'Star Sovereign',
  ninjaleaf: 'Leaf Shadow', toonanvil: 'Anvil Titan', rubberhose: 'Hose Titan',
  frostkitten: 'Frost Feline', emberpup: 'Ember Hound', auroradrake: 'Aurora Sovereign',
  lunarmoth: 'Moon Moth Titan', obsidiantortoise: 'Obsidian Sovereign', cloudhamster: 'Weather Titan',
};

const RETRO_PRICES = {
  flossdancer: 165, orangejustice: 170, takethel: 155, llamabell: 150,
  pixelinvader: 130, tetromino: 125, paddlepong: 120, hopperfrog: 135,
  starscout: 185, ninjaleaf: 180, toonanvil: 160, rubberhose: 175,
  frostkitten: 240, emberpup: 245, auroradrake: 320, lunarmoth: 290,
  obsidiantortoise: 310, cloudhamster: 300,
};

const RETRO_HOMES = {
  flossdancer: ['memecore', 'neon'], orangejustice: ['memecore', 'ember'], takethel: ['memecore', 'sakura'],
  llamabell: ['memecore', 'sugar'], pixelinvader: ['memecore', 'cybergrid'], tetromino: ['memecore', 'neon'],
  paddlepong: ['memecore', 'neon'], hopperfrog: ['memecore', 'tide'], starscout: ['memecore', 'sakura'],
  ninjaleaf: ['memecore', 'grove'], toonanvil: ['memecore', 'neon'], rubberhose: ['memecore', 'dream'],
  frostkitten: ['memecore', 'tide'], emberpup: ['memecore', 'ember'], auroradrake: ['memecore', 'skyisles'],
  lunarmoth: ['memecore', 'night'], obsidiantortoise: ['memecore', 'ember'], cloudhamster: ['memecore', 'skyisles'],
};

const RETRO_HYBRIDS = {
  'pixelinvader+tetromino': 'Block Invader',
  'paddlepong+hopperfrog': 'Rally Hop',
  'starscout+ninjaleaf': 'Shadow Star',
  'toonanvil+rubberhose': 'Slapstick Duo',
  'frostkitten+emberpup': 'Steam Pup',
  'auroradrake+lunarmoth': 'Night Aurora',
  'obsidiantortoise+cloudhamster': 'Stone Weather',
  'flossdancer+orangejustice': 'Double Victory',
  'takethel+championstar': 'Victory Lap',
  'llamabell+cozybuilder': 'Cozy Chime',
};

const RETRO_THEME_KEYS = Object.keys(RETRO_SPECIES).filter((key) => !ELEMENTS[key]);

RETRO_THEME_KEYS.forEach((key) => {
  const meta = RETRO_SPECIES[key];
  const gene = RETRO_GENES[key] || ['Retro Magic', '✨', '+10% XP.', { xp: 1.1 }];
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
  TITAN_NAMES[key] = RETRO_TITANS[key] || `${meta.name} Titan`;
  NAME_START[key] = [meta.name.split(' ')[0], 'Retro', 'Arcade', 'Emote', 'Legend'];
  TYPE_EGG_BASE_PRICE[key] = RETRO_PRICES[key] || 160;
  TYPE_EGG_PRICE[key] = discountedEggPrice(TYPE_EGG_BASE_PRICE[key]);
  (RETRO_HOMES[key] || ['memecore']).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});

Object.assign(HYBRID_NAMES, RETRO_HYBRIDS);

ELEMENT_KEYS.push(...RETRO_THEME_KEYS);
RETRO_THEME_KEYS.forEach((key) => {
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
});

/* Extra retro, emote and legendary-pet additions: registered through the same maps
   as the rest of this wave, so counts, eggs and homes pick them up. */
const EXTRA_RETRO_SPECIES = {
  "boomboxbear": {
    "name": "Boombox Bear",
    "primary": "#e8c07a",
    "light": "#fff2d2",
    "deep": "#5a3a0a",
    "accent": "#ff7ac8",
    "trait": "Bass-heavy — carries a stereo and a strong opinion about volume.",
    "likes": "Berry Fizz",
    "blurb": "A bear with a boombox on one shoulder and a mixtape for every possible mood.",
    "greeting": "This one is for the Hollow. Turn it up.",
    "price": 200,
    "homes": [
      "neon",
      "memecore"
    ],
    "titan": "Boombox Sovereign",
    "gene": {
      "name": "Bass Drop",
      "icon": "📻",
      "desc": "Games pay +5 coins and joy +12%.",
      "effect": {
        "gameCoins": 5,
        "joy": 1.12
      }
    }
  },
  "vaporwaveviper": {
    "name": "Vaporwave Viper",
    "primary": "#8fe3ff",
    "light": "#eefbff",
    "deep": "#1f3d6b",
    "accent": "#ff8fc8",
    "trait": "Aesthetic — everything it touches gains a sunset gradient.",
    "likes": "Moon Cake",
    "blurb": "A pastel snake that moves in smooth slow waves and leaves a soft grid behind it.",
    "greeting": "A E S T H E T I C. Come sit in the gradient.",
    "price": 205,
    "homes": [
      "dream",
      "neon"
    ],
    "titan": "Vaporwave Sovereign",
    "gene": {
      "name": "Sunset Grid",
      "icon": "🌅",
      "desc": "+16% XP and gifts arrive 15% sooner.",
      "effect": {
        "xp": 1.16,
        "giftSpeed": 1.15
      }
    }
  },
  "emotegremlin": {
    "name": "Emote Gremlin",
    "primary": "#b69cff",
    "light": "#f0e9ff",
    "deep": "#33204a",
    "accent": "#ffd166",
    "trait": "Expressive — has an emote for every emotion and three for winning.",
    "likes": "Candy Apple",
    "blurb": "A tiny purple gremlin that communicates entirely in dances and victory poses.",
    "greeting": "GG! GG! Look at this one — it is called “well played”.",
    "price": 175,
    "homes": [
      "memecore",
      "neon"
    ],
    "titan": "Emote Prime",
    "gene": {
      "name": "Emote Chain",
      "icon": "💃",
      "desc": "Chats pay +4 coins and bond builds 20% faster.",
      "effect": {
        "chatCoins": 4,
        "petBond": 1.2
      }
    }
  },
  "griddygremlin": {
    "name": "Griddy Gremlin",
    "primary": "#7ee787",
    "light": "#e2ffe6",
    "deep": "#1d4a24",
    "accent": "#8be9ff",
    "trait": "Celebrating — performs the same victory slide after every minor success.",
    "likes": "Star Pop",
    "blurb": "A grinning gremlin with a signature sidestep and absolutely no sense of occasion.",
    "greeting": "We won! We won a snack! This calls for the move.",
    "price": 170,
    "homes": [
      "memecore",
      "neon"
    ],
    "titan": "Griddy Titan",
    "gene": {
      "name": "Victory Slide",
      "icon": "🕺",
      "desc": "Tasks pay +4 coins and joy fades 20% slower.",
      "effect": {
        "taskCoins": 4,
        "joyDecay": 0.8
      }
    }
  },
  "cassettekitten": {
    "name": "Cassette Kitten",
    "primary": "#ffb35c",
    "light": "#fff0d6",
    "deep": "#5a3a08",
    "accent": "#5ad6ff",
    "trait": "Rewinding — insists on playing the B-side first.",
    "likes": "Warm Milk",
    "blurb": "A legendary pocket kitten with a cassette for a tail and a purr that hisses like tape.",
    "greeting": "Side B is better. Trust me, I have listened to both.",
    "price": 300,
    "homes": [
      "dream",
      "neon"
    ],
    "titan": "Mixtape Kitten",
    "gene": {
      "name": "Side B",
      "icon": "📼",
      "desc": "+22% XP and gifts arrive 20% sooner.",
      "effect": {
        "xp": 1.22,
        "giftSpeed": 1.2
      }
    }
  },
  "neonaxolotl": {
    "name": "Neon Axolotl",
    "primary": "#5ad6ff",
    "light": "#e6fbff",
    "deep": "#123a4a",
    "accent": "#ff7ac8",
    "trait": "Glowing — frills light up in time with the arcade cabinet.",
    "likes": "Lemonade",
    "blurb": "A legendary arcade axolotl that only hatches beside a humming cabinet at closing time.",
    "greeting": "One more credit. Then we go home. Probably.",
    "price": 310,
    "homes": [
      "neon",
      "tide"
    ],
    "titan": "Neon Axolotl Prime",
    "gene": {
      "name": "High Score",
      "icon": "🕹️",
      "desc": "Games pay +8 coins and night games +3.",
      "effect": {
        "gameCoins": 8,
        "nightCoins": 3
      }
    }
  }
};

Object.entries(EXTRA_RETRO_SPECIES).forEach(([key, meta]) => {
  ELEMENTS[key] = {
    name: meta.name, primary: meta.primary, light: meta.light, deep: meta.deep,
    accent: meta.accent, trait: meta.trait, blurb: meta.blurb, greeting: meta.greeting,
    likes: meta.likes,
  };
  GENE_POWERS[key] = meta.gene;
  TITAN_NAMES[key] = meta.titan;
  NAME_START[key] = [meta.name.split(' ')[0], 'Retro', 'Arcade', 'Emote', 'Legend'];
  TYPE_EGG_BASE_PRICE[key] = meta.price;
  TYPE_EGG_PRICE[key] = discountedEggPrice(meta.price);
  meta.homes.forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
  RETRO_THEME_KEYS.push(key);
  ELEMENT_KEYS.push(key);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
});

/* Named hybrids for the extra retro, emote and legendary arrivals. */
const EXTRA_RETRO_HYBRIDS = {
  'boomboxbear+rubberhose': 'Boombox Toon',
  'vaporwaveviper+flossdancer': 'Vapor Floss',
  'emotegremlin+orangejustice': 'Emote Justice',
  'griddygremlin+flossdancer': 'Griddy Floss',
  'cassettekitten+frostkitten': 'Mixtape Kitten',
  'neonaxolotl+tetromino': 'Neon Block',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, EXTRA_RETRO_HYBRIDS);
