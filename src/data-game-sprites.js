/* Game Genres Wave: 14 new sprites representing every major video game genre.
   Loaded after base data so all global maps exist. */

const GAME_SPRITE_SPECIES = {
  arcadebot: {
    name: 'Pixel Arcade', primary: '#ff007f', light: '#ffcce6', deep: '#800040', accent: '#00ffff',
    trait: 'Classic — 8-bit sounds and high scores forever.',
    blurb: 'A glowing retro console sprite who feeds on quarters and plays a celebratory chime on victory.',
    greeting: 'INSERT COIN TO CONTINUE! Just kidding, we can play for free.',
    likes: 'Star Pop',
  },
  questknight: {
    name: 'Quest Knight', primary: '#e6b800', light: '#fff5cc', deep: '#806600', accent: '#3399ff',
    trait: 'Heroic — always ready for an epic boss fight.',
    blurb: 'A armored sprite carrying a tiny wooden sword and a shield forged from pure courage.',
    greeting: 'It’s dangerous to go alone! Take me with you.',
    likes: 'Honeycomb Cake',
  },
  blasterzombie: {
    name: 'Zombie Blaster', primary: '#00cc66', light: '#ccffea', deep: '#006633', accent: '#ff3300',
    trait: 'Action — rapid laser fire against zombie hordes.',
    blurb: 'A laser-wielding hero with tactical goggles who specializes in clearing out zombie waves.',
    greeting: 'Zombies in the Hollow? Not on my watch!',
    likes: 'Trail Mix',
  },
  brawler: {
    name: 'Combo Brawler', primary: '#ff3333', light: '#ffcccc', deep: '#800000', accent: '#ffff00',
    trait: 'Fighter — executes 10-hit combos in milliseconds.',
    blurb: 'A fierce martial arts sprite wrapped in a red headband who practices dragon kicks at dawn.',
    greeting: 'READY? FIGHT! High five for good luck.',
    likes: 'Ember Steak',
  },
  speedracer: {
    name: 'Turbo Racer', primary: '#ff6600', light: '#ffe6cc', deep: '#803300', accent: '#00e676',
    trait: 'Fast — drifts around corners at breakneck speed.',
    blurb: 'A helmeted racer with racing stripes who treats every path through the Hollow as a lap.',
    greeting: '3… 2… 1… GO! Catch me if you can!',
    likes: 'Star Pop',
  },
  pixeljumper: {
    name: 'Platform Jumper', primary: '#3399ff', light: '#cce6ff', deep: '#004080', accent: '#ffcc00',
    trait: 'Bouncy — double jumps over any obstacle.',
    blurb: 'A overalls-clad jumper who loves collecting gold coins and bouncing off mushrooms.',
    greeting: 'Yahoo! Let’s leap over that wall!',
    likes: 'Star Cookie',
  },
  blockmaster: {
    name: 'Puzzle Master', primary: '#9933ff', light: '#f0ccff', deep: '#4b0082', accent: '#00ffff',
    trait: 'Clever — clears lines and solves puzzles effortlessly.',
    blurb: 'A grid-patterned sprite who arranges colorful blocks into perfect combos.',
    greeting: 'Every problem has a solution if you rotate your perspective.',
    likes: 'Moon Cake',
  },
  tactician: {
    name: 'Grand Tactician', primary: '#4a6572', light: '#d9e2ec', deep: '#232f34', accent: '#f9aa33',
    trait: 'Strategic — plans twenty moves ahead.',
    blurb: 'A crown-wearing strategist carrying a mini chessboard and an atlas of the realm.',
    greeting: 'Checkmate in three moves. Shall we test your strategy?',
    likes: 'Honeycomb Cake',
  },
  cozybuilder: {
    name: 'Cozy Builder', primary: '#ff9999', light: '#ffe6e6', deep: '#993333', accent: '#99ff99',
    trait: 'Wholesome — plants gardens and decorates homes.',
    blurb: 'A gentle town-builder with a tiny watering can and a passion for cozy sanctuary design.',
    greeting: 'Welcome home! I planted fresh flowers by the doorway.',
    likes: 'Honey Drop',
  },
  cubebuilder: {
    name: 'Voxel Crafter', primary: '#8b5a2b', light: '#e8d8c8', deep: '#4a2e11', accent: '#55ff55',
    trait: 'Crafty — mines rare blocks and builds castles.',
    blurb: 'A blocky voxel sprite with a diamond pickaxe who builds towering structures.',
    greeting: 'Never dig straight down! Let’s build something amazing today.',
    likes: 'Trail Mix',
  },
  beatdancer: {
    name: 'Rhythm Beats', primary: '#ff00cc', light: '#ffccf5', deep: '#800066', accent: '#00ffff',
    trait: 'Groovy — syncs every step to the beat.',
    blurb: 'A neon headphone-wearing dancer who turns every song into a perfect combo streak.',
    greeting: 'Feel the rhythm! Keep the beat going.',
    likes: 'Star Pop',
  },
  deckmaster: {
    name: 'Deck Master', primary: '#6600cc', light: '#e6ccff', deep: '#330066', accent: '#ffd700',
    trait: 'Tactical — draws the perfect card every turn.',
    blurb: 'A cape-wearing card duelist with a golden deck box and a surprise counter-play.',
    greeting: 'I place my faith in the heart of the cards!',
    likes: 'Moon Cake',
  },
  shadowfright: {
    name: 'Nightmare Fright', primary: '#33334d', light: '#d1d1e0', deep: '#14141f', accent: '#ff0033',
    trait: 'Spooky — thrives in survival horror darkness.',
    blurb: 'A shadow sprite with glowing red eyes who carries a tiny flashlight through dark hallways.',
    greeting: 'Did you hear that noise? Don’t look behind you…',
    likes: 'Ember Steak',
  },
  championstar: {
    name: 'Sports Star', primary: '#ffaa00', light: '#fff0cc', deep: '#805500', accent: '#0099ff',
    trait: 'Athletic — scores goals and wins trophies.',
    blurb: 'A star athlete sprite wearing a golden medal who loves playing sports games in the Hollow.',
    greeting: 'Pass the ball! Let’s score another goal!',
    likes: 'Star Cookie',
  },
};

const GAME_SPRITE_GENES = {
  arcadebot: { name: 'High Score', icon: '🕹️', desc: 'Arcade games pay +5 bonus coins and XP +15%.', effect: { gameCoins: 5, xp: 1.15 } },
  questknight: { name: 'Heroic Valor', icon: '⚔️', desc: 'All games pay +4 coins and bond builds +20%.', effect: { gameCoins: 4, petBond: 1.2 } },
  blasterzombie: { name: 'Zombie Hunter', icon: '🧟', desc: 'Zombie shooter pays +8 bonus coins per run.', effect: { gameCoins: 8, xp: 1.2 } },
  brawler: { name: 'Combo Chain', icon: '🥊', desc: 'Fight and action games pay +6 bonus coins.', effect: { gameCoins: 6 } },
  speedracer: { name: 'Nitro Boost', icon: '🏎️', desc: 'Gifts arrive 25% faster and day games pay +4 coins.', effect: { giftSpeed: 1.25, dayCoins: 4 } },
  pixeljumper: { name: 'Double Jump', icon: '🍄', desc: 'Chats pay +2 coins and games pay +3 bonus coins.', effect: { chatCoins: 2, gameCoins: 3 } },
  blockmaster: { name: 'Line Clear', icon: '🧩', desc: 'Puzzle games pay +6 bonus coins.', effect: { gameCoins: 6 } },
  tactician: { name: 'Mastermind', icon: '♟️', desc: 'XP gains +25% and completed tasks pay +5 coins.', effect: { xp: 1.25, taskCoins: 5 } },
  cozybuilder: { name: 'Cozy Haven', icon: '🏡', desc: 'Check-ins pay +6 bonus coins and bond builds +25%.', effect: { checkinCoins: 6, petBond: 1.25 } },
  cubebuilder: { name: 'Diamond Miner', icon: '⛏️', desc: 'Coin dig and games pay +5 extra coins.', effect: { gameCoins: 5 } },
  beatdancer: { name: 'Perfect Rhythm', icon: '🎧', desc: 'Rhythm games pay +7 bonus coins.', effect: { gameCoins: 7 } },
  deckmaster: { name: 'Top Deck', icon: '🃏', desc: 'Gifts arrive 20% faster and games pay +4 coins.', effect: { giftSpeed: 1.2, gameCoins: 4 } },
  shadowfright: { name: 'Survival Instinct', icon: '🔦', desc: 'Night games pay +6 coins and XP gains +20%.', effect: { nightCoins: 6, xp: 1.2 } },
  championstar: { name: 'MVP Trophy', icon: '🏆', desc: 'Sports games pay +6 bonus coins and snacks drop +20%.', effect: { gameCoins: 6 } },
};

const GAME_SPRITE_TITANS = {
  arcadebot: 'Grand Sovereign of the 8-Bit Arcade',
  questknight: 'Paladin of the Eternal Quest',
  blasterzombie: 'Vanguard Zombie Destroyer',
  brawler: 'Undefeated Arena Champion',
  speedracer: 'Apex Turbo Grand Prix Legend',
  pixeljumper: 'Ascended Sky Leap Master',
  blockmaster: 'Architect of the Endless Grid',
  tactician: 'Grandmaster of World Strategy',
  cozybuilder: 'Keeper of the Warm Sanctuary',
  cubebuilder: 'Overlord of the Voxel Realm',
  beatdancer: 'Maestro of Neon Beats',
  deckmaster: 'Archmage of the Golden Deck',
  shadowfright: 'Phantom of the Midnight Hour',
  championstar: 'Hall of Fame All-Star MVP',
};

const GAME_SPRITE_PRICES = {
  arcadebot: 135,
  questknight: 140,
  blasterzombie: 145,
  brawler: 130,
  speedracer: 135,
  pixeljumper: 125,
  blockmaster: 130,
  tactician: 140,
  cozybuilder: 120,
  cubebuilder: 135,
  beatdancer: 130,
  deckmaster: 140,
  shadowfright: 135,
  championstar: 130,
};

const GAME_SPRITE_HYBRIDS = {
  'arcadebot+volt': 'Synthwave',
  'questknight+ember': 'Dragon Slayer',
  'blasterzombie+dusk': 'Night Ops',
  'brawler+crystal': 'Iron Fist',
  'speedracer+ember': 'Dune Buggy',
  'pixeljumper+bloom': 'Forest Jumper',
  'blockmaster+gale': 'Prism Grid',
  'tactician+dream': 'Mind Realm',
  'cozybuilder+candy': 'Candy Cottage',
  'cubebuilder+ember': 'Magma Block',
  'beatdancer+volt': 'Cyber Beat',
  'deckmaster+dusk': 'Shadow Duelist',
  'shadowfright+dusk': 'Abyssal Terror',
  'championstar+ember': 'Golden Trophy',
};

const GAME_SPRITE_HABITATS = {
  arcadebot: ['neon', 'dream'],
  questknight: ['ember', 'grove'],
  blasterzombie: ['night', 'neon'],
  brawler: ['ember', 'savanna'],
  speedracer: ['savanna', 'neon'],
  pixeljumper: ['grove', 'aurora'],
  blockmaster: ['crystal', 'dream'],
  tactician: ['crystal', 'night'],
  cozybuilder: ['grove', 'sugar'],
  cubebuilder: ['ember', 'savanna'],
  beatdancer: ['neon', 'aurora'],
  deckmaster: ['night', 'dream'],
  shadowfright: ['night', 'ember'],
  championstar: ['savanna', 'aurora'],
};

if (typeof ELEMENTS !== 'undefined') Object.assign(ELEMENTS, GAME_SPRITE_SPECIES);
if (typeof GENE_POWERS !== 'undefined') Object.assign(GENE_POWERS, GAME_SPRITE_GENES);
if (typeof TITAN_NAMES !== 'undefined') Object.assign(TITAN_NAMES, GAME_SPRITE_TITANS);
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, GAME_SPRITE_HYBRIDS);
if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') Object.assign(TYPE_EGG_BASE_PRICE, GAME_SPRITE_PRICES);
if (typeof TYPE_EGG_PRICE !== 'undefined') {
  Object.keys(GAME_SPRITE_PRICES).forEach((key) => {
    TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(GAME_SPRITE_PRICES[key]) : GAME_SPRITE_PRICES[key];
  });
}
if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...Object.keys(GAME_SPRITE_SPECIES));
if (typeof SCENES !== 'undefined') {
  Object.entries(GAME_SPRITE_HABITATS).forEach(([key, scenes]) => {
    scenes.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
}

/* Extra game-genre additions: registered through the same maps
   as the rest of this wave, so counts, eggs and homes pick them up. */
const EXTRA_GAME_SPRITE_SPECIES = {
  "stealthrogue": {
    "name": "Stealth Rogue",
    "primary": "#5a6a7a",
    "light": "#dbe4ee",
    "deep": "#1d2430",
    "accent": "#7ee787",
    "trait": "Unseen — completes the objective without ever entering the room.",
    "likes": "Warm Tea",
    "blurb": "A hooded sneak who treats every locked door as a suggestion and every shadow as a doorway.",
    "greeting": "You did not see me. That is how you know it went well.",
    "price": 155,
    "homes": [
      "night",
      "neon"
    ],
    "titan": "Shadow Step",
    "gene": {
      "name": "Sneak",
      "icon": "🥷",
      "desc": "Night games pay +5 coins and joy fades 15% slower.",
      "effect": {
        "nightCoins": 5,
        "joyDecay": 0.85
      }
    }
  },
  "farmingfriend": {
    "name": "Farm Friend",
    "primary": "#9ed96b",
    "light": "#f2ffe0",
    "deep": "#33521e",
    "accent": "#ffd166",
    "trait": "Patient — plants in spring, celebrates in autumn.",
    "likes": "Honey Drop",
    "blurb": "A little overalls-wearing friend with a watering can and a four-season plan.",
    "greeting": "The turnips are up! Well. One turnip. It counts.",
    "price": 135,
    "homes": [
      "grove",
      "savanna"
    ],
    "titan": "Harvest Sovereign",
    "gene": {
      "name": "Good Harvest",
      "icon": "🌾",
      "desc": "Snacks give +25% XP and needs fade 10% slower.",
      "effect": {
        "snackXp": 1.25,
        "decay": 0.9
      }
    }
  },
  "survivorscout": {
    "name": "Survivor Scout",
    "primary": "#b8a06b",
    "light": "#f5ebd6",
    "deep": "#4a3a1e",
    "accent": "#ff5e5e",
    "trait": "Prepared — has three plans and a backup snack for each.",
    "likes": "Trail Mix",
    "blurb": "A resourceful scout with a map, a torch, and a calm approach to very bad weather.",
    "greeting": "Storm coming. I have shelter, water, and crackers. Sit.",
    "price": 160,
    "homes": [
      "mycelium",
      "ember"
    ],
    "titan": "Last Light",
    "gene": {
      "name": "Ration",
      "icon": "🎒",
      "desc": "Needs fade 18% slower and gifts arrive 15% sooner.",
      "effect": {
        "needSlow": 0.82,
        "giftSpeed": 1.15
      }
    }
  },
  "racingrival": {
    "name": "Racing Rival",
    "primary": "#ff5e5e",
    "light": "#ffe0e0",
    "deep": "#5a1212",
    "accent": "#5ad6ff",
    "trait": "Competitive — turns a walk to the shops into a grudge match.",
    "likes": "Star Pop",
    "blurb": "A helmeted rival with a go-kart and a running tally of every race you have ever had.",
    "greeting": "Best of three? Best of five. Best of seven.",
    "price": 175,
    "homes": [
      "savanna",
      "neon"
    ],
    "titan": "Final Lap",
    "gene": {
      "name": "Slipstream",
      "icon": "🏁",
      "desc": "Games pay +6 coins and energy fades 15% slower.",
      "effect": {
        "gameCoins": 6,
        "energyDecay": 0.85
      }
    }
  },
  "horrorhollow": {
    "name": "Horror Hollow",
    "primary": "#5a4a6b",
    "light": "#e0d9ea",
    "deep": "#1a1220",
    "accent": "#8be9ff",
    "trait": "Eerie — the lights flicker when it is happy, which is often.",
    "likes": "Moon Cake",
    "blurb": "A quiet survival-horror sprite that collects flashlight batteries and stories about the basement.",
    "greeting": "Do you hear that? ...No? Good. That is good.",
    "price": 185,
    "homes": [
      "night",
      "dream"
    ],
    "titan": "Nightmare Sovereign",
    "gene": {
      "name": "Low Battery",
      "icon": "🔦",
      "desc": "Night games pay +7 coins and gifts arrive 20% sooner.",
      "effect": {
        "nightCoins": 7,
        "giftSpeed": 1.2
      }
    }
  }
};

Object.entries(EXTRA_GAME_SPRITE_SPECIES).forEach(([key, meta]) => {
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


/* Named hybrids for the extra game-genre arrivals. */
const EXTRA_GAME_SPRITE_HYBRIDS = {
  'stealthrogue+shadowfright': 'Shadow Stealth',
  'farmingfriend+cozybuilder': 'Cozy Harvest',
  'survivorscout+blasterzombie': 'Survivor Ops',
  'racingrival+speedracer': 'Rival Race',
  'horrorhollow+championstar': 'Horror All-Star',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, EXTRA_GAME_SPRITE_HYBRIDS);
