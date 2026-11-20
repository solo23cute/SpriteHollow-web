/* Seaside & garden wave: nine new sprites with their own genes, titans, hybrids, egg prices, and habitats.
   Loaded after the other data waves so the shared tables already exist. */

const MORE_SPRITE_SPECIES = {
  koi: {
    name: 'Koi', primary: '#ff8a5c', light: '#ffe3d1', deep: '#7a2e16', accent: '#fff3b0',
    trait: 'Lucky — swims in circles and always finds a coin.',
    blurb: 'A painted pond fish with orange and white patches and a habit of showing up exactly when you need it.',
    greeting: 'Make a wish. Not that one. The other one.',
    likes: 'River Fillet',
  },
  owlet: {
    name: 'Owlet', primary: '#a68bd6', light: '#eee6ff', deep: '#3d2d66', accent: '#ffd166',
    trait: 'Wise — hoots once and knows the answer.',
    blurb: 'A round-eyed night bird who sits very still and remembers everyone’s birthday.',
    greeting: 'Who’s there? Oh, it’s you. Hoo-hoo, of course.',
    likes: 'Moon Blueberries',
  },
  tortoise: {
    name: 'Tortoise', primary: '#8cb36b', light: '#eef8dc', deep: '#3b5a2a', accent: '#f2d27a',
    trait: 'Steady — never hurries, never loses the race.',
    blurb: 'A patient shell-carrier with a mossy back and a slow, cheerful smile.',
    greeting: 'Hello. I was just getting there. Hello again.',
    likes: 'Honey Drop',
  },
  jellyfish: {
    name: 'Jellyfish', primary: '#9ff0ff', light: '#effdff', deep: '#24697a', accent: '#ff9ad5',
    trait: 'Glowing — drifts softly and lights up when happy.',
    blurb: 'A translucent dreamer with ribbon tentacles that pulse in time with your heartbeat.',
    greeting: 'I’m not floating. I’m drifting with style.',
    likes: 'Coconut Water',
  },
  honeybee: {
    name: 'Honeybee', primary: '#ffd44d', light: '#fff7cc', deep: '#6b4a06', accent: '#ffffff',
    trait: 'Busy — hums a happy tune and collects nectar for everyone.',
    blurb: 'A fuzzy striped bee with a tiny crown of pollen and an unstoppable work ethic.',
    greeting: 'Bzzz! Hi! Hold still, you have pollen on your nose.',
    likes: 'Sun Nectar',
  },
  seahorse: {
    name: 'Seahorse', primary: '#f29ac0', light: '#ffe6f2', deep: '#7a2452', accent: '#9ae6ff',
    trait: 'Gentle — holds on tight and never lets go of a friend.',
    blurb: 'A curly-tailed sea dancer who bobs upright and blushes at every compliment.',
    greeting: 'Oh, you noticed my tail? Thank you, it’s curly on purpose.',
    likes: 'River Fillet',
  },
  bluebird: {
    name: 'Bluebird', primary: '#4fa8ff', light: '#dcefff', deep: '#1d4f8a', accent: '#ffe066',
    trait: 'Cheerful — sings the first note of every morning.',
    blurb: 'A small sky-blue songbird whose tune gets stuck in your head for the rest of the day.',
    greeting: 'Good morning, good morning, good morning! That’s the whole song.',
    likes: 'Sun Nectar',
  },
  ladybug: {
    name: 'Ladybug', primary: '#ff5a4a', light: '#ffd9d3', deep: '#6e1a14', accent: '#1f1f2e',
    trait: 'Lucky — spots are good luck, and it has a lot of spots.',
    blurb: 'A polka-dotted red beetle who climbs everything and counts every dot out loud.',
    greeting: 'Seven, eight, nine… oh! Hello. You’re the tenth friend today.',
    likes: 'Honey Drop',
  },
  pufferfish: {
    name: 'Pufferfish', primary: '#ffd08a', light: '#fff4e0', deep: '#6b4416', accent: '#58c7ff',
    trait: 'Puffy — swells up when startled, then deflates into a giggle.',
    blurb: 'A round, spiky reef friend with big eyes and a very short temper that lasts about one second.',
    greeting: 'BOO! …Sorry. Reflex. Hi!',
    likes: 'Coconut Water',
  },
};

const MORE_SPRITE_GENES = {
  koi: { name: 'Good Fortune', icon: '🍀', desc: 'Games pay +3 coins and bond grows 20% faster.', effect: { gameCoins: 3, petBond: 1.2 } },
  owlet: { name: 'Night Wisdom', icon: '🦉', desc: 'Night games pay +4 coins and XP gains +15%.', effect: { nightCoins: 4, xp: 1.15 } },
  tortoise: { name: 'Slow & Steady', icon: '🐢', desc: 'Gifts arrive 10% sooner and chats pay +1 coin.', effect: { giftSpeed: 1.1, chatCoins: 1 } },
  jellyfish: { name: 'Glow', icon: '✨', desc: 'Pets build +15% bond and XP gains +10%.', effect: { petBond: 1.15, xp: 1.1 } },
  honeybee: { name: 'Pollen Trail', icon: '🐝', desc: 'Games pay +1 coin and gifts arrive 15% sooner.', effect: { gameCoins: 1, giftSpeed: 1.15 } },
  seahorse: { name: 'Hold Tight', icon: '🫧', desc: 'Pets and hugs build +30% bond.', effect: { petBond: 1.3 } },
  bluebird: { name: 'Morning Song', icon: '🎶', desc: 'Day games pay +4 coins and chats pay +1.', effect: { dayCoins: 4, chatCoins: 1 } },
  ladybug: { name: 'Lucky Spots', icon: '🔴', desc: 'Every game pays +2 coins and gifts arrive 10% sooner.', effect: { gameCoins: 2, giftSpeed: 1.1 } },
  pufferfish: { name: 'Puff Up', icon: '🐡', desc: 'Games pay +3 coins and XP gains +10%.', effect: { gameCoins: 3, xp: 1.1 } },
};

const MORE_SPRITE_TITANS = {
  koi: 'Lotus Dragon of the Pond',
  owlet: 'Hushwing Sage',
  tortoise: 'Everlong Shellkeeper',
  jellyfish: 'Lumen Drifter',
  honeybee: 'Queen of a Thousand Blooms',
  seahorse: 'Tidecurl Mare',
  bluebird: 'Dawnsong Herald',
  ladybug: 'Seven-Spot Sovereign',
  pufferfish: 'Thunderpuff Warden',
};

const MORE_SPRITE_PRICES = {
  koi: 120,
  owlet: 125,
  tortoise: 110,
  jellyfish: 130,
  honeybee: 115,
  seahorse: 120,
  bluebird: 105,
  ladybug: 100,
  pufferfish: 115,
};

const MORE_SPRITE_HYBRIDS = {
  'koi+tide': 'Pondrunner',
  'dusk+owlet': 'Moonwatch',
  'bloom+tortoise': 'Mossback',
  'dream+jellyfish': 'Starlit Bell',
  'bloom+honeybee': 'Clover Hive',
  'seahorse+tide': 'Coralcurl',
  'gale+bluebird': 'Skyhymn',
  'ember+ladybug': 'Emberspot',
  'pufferfish+tide': 'Reefbloat',
};

const MORE_SPRITE_HABITATS = {
  koi: ['tide', 'grove'],
  owlet: ['night', 'grove'],
  tortoise: ['grove', 'savanna'],
  jellyfish: ['tide', 'dream'],
  honeybee: ['grove', 'savanna'],
  seahorse: ['tide', 'crystal'],
  bluebird: ['aurora', 'savanna'],
  ladybug: ['grove', 'ember'],
  pufferfish: ['tide', 'ember'],
};

Object.assign(ELEMENTS, MORE_SPRITE_SPECIES);
Object.assign(GENE_POWERS, MORE_SPRITE_GENES);
Object.assign(TITAN_NAMES, MORE_SPRITE_TITANS);
Object.assign(HYBRID_NAMES, MORE_SPRITE_HYBRIDS);
Object.assign(TYPE_EGG_BASE_PRICE, MORE_SPRITE_PRICES);
Object.keys(MORE_SPRITE_PRICES).forEach((key) => {
  TYPE_EGG_PRICE[key] = discountedEggPrice(MORE_SPRITE_PRICES[key]);
});
ELEMENT_KEYS.push(...Object.keys(MORE_SPRITE_SPECIES));
Object.entries(MORE_SPRITE_HABITATS).forEach(([key, scenes]) => {
  scenes.forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});
