/* Mobile Game Classics Wave: 14 iconic mobile game sprites.
   Loaded after base data so all global maps exist. */

const MOBILE_CLASSICS_SPECIES = {
  templerun: {
    name: 'Temple Runner', primary: '#c6a052', light: '#f9f1e1', deep: '#6d5423', accent: '#38bdf8',
    trait: 'Ancient — escapes demon monkeys and sliding traps in ruined temples.',
    blurb: 'An ancient gold idol runner who dashes along narrow stone ledges collecting coins and golden idols.',
    greeting: 'Keep running! Don’t turn around, the demon monkeys are right behind us!',
    likes: 'Star Cookie',
  },
  eightball: {
    name: '8-Ball Cue', primary: '#1e293b', light: '#f1f5f9', deep: '#0f172a', accent: '#38bdf8',
    trait: 'Precision — lines up bank shots and sinks the 8-ball with ease.',
    blurb: 'A sleek black cue ball sprite with a chalked tip and an eye for trick shots across green felt.',
    greeting: 'Chalk your cue! Corner pocket, call your shot.',
    likes: 'Moon Cake',
  },
  mariorun: {
    name: 'Plumber Runner', primary: '#ef4444', light: '#fee2e2', deep: '#991b1b', accent: '#3b82f6',
    trait: 'Super Jump — auto-runs through Mushroom Kingdoms collecting gold stars.',
    blurb: 'A red-capped overalls jumper who vaults over Goombas and leaps into green pipes.',
    greeting: 'It’s-a me! Let’s sprint through the course and grab every coin!',
    likes: 'Honeycomb Cake',
  },
  jumanji: {
    name: 'Jungle Explorer', primary: '#15803d', light: '#dcfce7', deep: '#14532d', accent: '#eab308',
    trait: 'Safari — leaps over rhinos and outruns jungle stampedes.',
    blurb: 'A rugged safari explorer in khaki and boots who retrieves golden jaguar statues from ancient jungle ruins.',
    greeting: 'Welcome to the jungle! Watch out for the charging rhinos!',
    likes: 'River Fillet',
  },
  candyrun: {
    name: 'Tom Candy Runner', primary: '#ec4899', light: '#fce7f3', deep: '#9d174d', accent: '#facc15',
    trait: 'Sugar Sprint — chases candy robbers and collects sweet treats.',
    blurb: 'A pink-and-white running feline who slides under barriers and scoops up stolen candy bars.',
    greeting: 'Stop that robber! Save the candy bars!',
    likes: 'Star Pop',
  },
  mergedragon: {
    name: 'Merge Dragon', primary: '#8b5cf6', light: '#f3e8ff', deep: '#5b21b6', accent: '#10b981',
    trait: 'Mystic Merge — combines three eggs into legendary dragons.',
    blurb: 'A winged dragon of Dragonia who merges life flowers, dead land, and dragon eggs into mystical wonder.',
    greeting: 'Merge three to create something greater! Healing energy surrounds us.',
    likes: 'Sun Nectar',
  },
  dragoncity: {
    name: 'City Dragon Breeder', primary: '#f97316', light: '#ffedd5', deep: '#9a3412', accent: '#06b6d4',
    trait: 'Floating Island — breeds Flame, Terra, and Sea elemental dragons.',
    blurb: 'A noble dragon from the floating islands of Dragon City, decorated with elemental jewels and flame wings.',
    greeting: 'Welcome to my floating island habitat! Ready to breed an Flame-Terra hybrid?',
    likes: 'Ember Steak',
  },
  monsterlegend: {
    name: 'Mythic Brawler', primary: '#dc2626', light: '#fee2e2', deep: '#7f1d1d', accent: '#f59e0b',
    trait: 'Arena Titan — unleashes devastating element skills in monster battles.',
    blurb: 'A muscular mythic monster with fiery horns who reigns supreme in the Monster Arena.',
    greeting: 'Step into the arena! My elemental strike is unstoppable!',
    likes: 'Ember Steak',
  },
  snakeio: {
    name: 'Slither Serpent', primary: '#10b981', light: '#d1fae5', deep: '#065f46', accent: '#a855f7',
    trait: 'Slither — grows longer with every glowing energy orb eaten.',
    blurb: 'A neon glowing serpent that slithers through glowing arenas, growing longer and encircling rivals.',
    greeting: 'Slither along! Eat those glowing mass orbs and grow huge!',
    likes: 'Honey Drop',
  },
  unocard: {
    name: 'Wild Card UNO', primary: '#eab308', light: '#fef9c3', deep: '#854d0e', accent: '#ef4444',
    trait: 'Wild Draw 4 — flips color suits and reverses play order.',
    blurb: 'A colorful card sprite wearing a Wild Card visor who shouts "UNO!" whenever a single card remains.',
    greeting: 'UNO! Play your Draw 4 card and reverse the turn!',
    likes: 'Star Cookie',
  },
  angrybird: {
    name: 'Slingshot Fling', primary: '#b91c1c', light: '#fee2e2', deep: '#7f1d1d', accent: '#facc15',
    trait: 'Slingshot — launches into piggy fortresses with a fierce battle cry.',
    blurb: 'A round red bird with thick eyebrows who loves loading into giant slingshots to tumble wood and stone towers.',
    greeting: 'ROAAR! Load the slingshot and aim for those green pigs!',
    likes: 'Trail Mix',
  },
  plantzombie: {
    name: 'Peashooter Defender', primary: '#22c55e', light: '#dcfce7', deep: '#15803d', accent: '#84cc16',
    trait: 'Lawn Guard — shoots peas at incoming lawn-zombies.',
    blurb: 'A green leafy peashooter plant that stands firm on front lawns, firing steady green peas at conehead zombies.',
    greeting: 'Plant your sun-flowers! The zombies are coming!',
    likes: 'Sun Nectar',
  },
  fruitninja: {
    name: 'Master Slicer', primary: '#0ea5e9', light: '#e0f2fe', deep: '#0369a1', accent: '#f43f5e',
    trait: 'Blade Master — slices combos through flying watermelon and pineapples.',
    blurb: 'A ninja wearing a shiny headband who slices thrown fruit mid-air while dodging explosive bombs.',
    greeting: 'Juicy combo! Slice the watermelon, dodge the bombs!',
    likes: 'Coconut Water',
  },
  angrygran: {
    name: 'Angry Granny', primary: '#a855f7', light: '#f3e8ff', deep: '#6b21a8', accent: '#ec4899',
    trait: 'Unstoppable — smashes through city streets with a slipper.',
    blurb: 'A fierce granny in a floral gown and slippers who escapes the asylum and dashes through city streets.',
    greeting: 'Out of my way! Granny’s got a slipper and she’s not stopping!',
    likes: 'Honey Drop',
  },
};

const MOBILE_CLASSICS_GENES = {
  templerun: { name: 'Idol Escape', icon: '🗿', desc: 'Runner games pay +8 bonus coins and gifts arrive 20% sooner.', effect: { gameCoins: 8, giftSpeed: 1.2 } },
  eightball: { name: 'Bank Shot', icon: '🎱', desc: 'Precision and pool games pay +6 bonus coins.', effect: { gameCoins: 6 } },
  mariorun: { name: 'Mushroom Sprint', icon: '🍄', desc: 'Day games pay +5 coins and chats pay +2 coins.', effect: { dayCoins: 5, chatCoins: 2 } },
  jumanji: { name: 'Jungle Stampede', icon: '🦏', desc: 'All games pay +4 coins and bond builds +25%.', effect: { gameCoins: 4, petBond: 1.25 } },
  candyrun: { name: 'Candy Robber', icon: '🍬', desc: 'Candy and food games pay +7 bonus coins.', effect: { gameCoins: 7 } },
  mergedragon: { name: 'Dragonia Merge', icon: '🐉', desc: 'Hatching and breeding pay +8 bonus coins.', effect: { gameCoins: 8, xp: 1.25 } },
  dragoncity: { name: 'Floating Island', icon: '🌋', desc: 'XP gains +20% and elemental tasks pay +5 coins.', effect: { xp: 1.2, taskCoins: 5 } },
  monsterlegend: { name: 'Arena Strike', icon: '⚔️', desc: 'Action and fight games pay +7 bonus coins.', effect: { gameCoins: 7 } },
  snakeio: { name: 'Orb Slither', icon: '🐍', desc: 'Snake and arcade games pay +8 bonus coins.', effect: { gameCoins: 8 } },
  unocard: { name: 'Wild Card Draw', icon: '🃏', desc: 'Check-ins pay +6 bonus coins and gifts arrive 20% sooner.', effect: { checkinCoins: 6, giftSpeed: 1.2 } },
  angrybird: { name: 'Slingshot Launch', icon: '🎯', desc: 'Slingshot and action games pay +8 bonus coins.', effect: { gameCoins: 8 } },
  plantzombie: { name: 'Pea Barrage', icon: '🌱', desc: 'Defense games pay +8 bonus coins and snacks drop +25%.', effect: { gameCoins: 8 } },
  fruitninja: { name: 'Juicy Combo', icon: '🍉', desc: 'Slice games pay +7 bonus coins and XP gains +15%.', effect: { gameCoins: 7, xp: 1.15 } },
  angrygran: { name: 'Granny Slipper', icon: '👵', desc: 'Runner games pay +8 bonus coins and check-ins pay +5 coins.', effect: { gameCoins: 8, checkinCoins: 5 } },
};

const MOBILE_CLASSICS_TITANS = {
  templerun: 'Grand Monarch of the Sun Temple',
  eightball: 'Undefeated Master of the 8-Ball Cue',
  mariorun: 'Sovereign of the Mushroom Kingdom',
  jumanji: 'High Explorer of the Jumanji Realm',
  candyrun: 'Champion of the Stolen Candy Dash',
  mergedragon: 'Overlord of Dragonia Merge',
  dragoncity: 'Supreme Emperor of Dragon City',
  monsterlegend: 'Grand Arena Mythic Titan',
  snakeio: 'Celestial Slither Serpent of the Void',
  unocard: 'Archduke of the Wild Card Deck',
  angrybird: 'Commander of the Slingshot Fowl',
  plantzombie: 'High Warden of the Front Lawn',
  fruitninja: 'Supreme Blade Master of the Dojo',
  angrygran: 'Unstoppable Granny of the City Streets',
};

const MOBILE_CLASSICS_PRICES = {
  templerun: 145,
  eightball: 130,
  mariorun: 140,
  jumanji: 135,
  candyrun: 130,
  mergedragon: 150,
  dragoncity: 145,
  monsterlegend: 140,
  snakeio: 135,
  unocard: 130,
  angrybird: 140,
  plantzombie: 145,
  fruitninja: 135,
  angrygran: 130,
};

const MOBILE_CLASSICS_HYBRIDS = {
  'templerun+ember': 'Jungle Runner',
  'eightball+dusk': 'Billiard Cue',
  'mariorun+candy': 'Star Jumper',
  'jumanji+bloom': 'Safari Explorer',
  'candyrun+candy': 'Sugar Runner',
  'mergedragon+crystal': 'Starlight Merge',
  'dragoncity+ember': 'Flame Island Dragon',
  'monsterlegend+ember': 'Arena Brawler',
  'snakeio+volt': 'Cyber Slither',
  'unocard+dream': 'Wild Draw 4',
  'angrybird+ember': 'Red Launcher',
  'plantzombie+bloom': 'Lawn Peashooter',
  'fruitninja+tide': 'Watermelon Slicer',
  'angrygran+volt': 'City Granny',
};

const MOBILE_CLASSICS_HABITATS = {
  templerun: ['savanna', 'ember'],
  eightball: ['night', 'crystal'],
  mariorun: ['sugar', 'grove'],
  jumanji: ['savanna', 'grove'],
  candyrun: ['sugar', 'neon'],
  mergedragon: ['crystal', 'dream'],
  dragoncity: ['ember', 'tide'],
  monsterlegend: ['ember', 'night'],
  snakeio: ['neon', 'night'],
  unocard: ['dream', 'sugar'],
  angrybird: ['ember', 'grove'],
  plantzombie: ['grove', 'tide'],
  fruitninja: ['tide', 'aurora'],
  angrygran: ['neon', 'savanna'],
};

if (typeof ELEMENTS !== 'undefined') Object.assign(ELEMENTS, MOBILE_CLASSICS_SPECIES);
if (typeof GENE_POWERS !== 'undefined') Object.assign(GENE_POWERS, MOBILE_CLASSICS_GENES);
if (typeof TITAN_NAMES !== 'undefined') Object.assign(TITAN_NAMES, MOBILE_CLASSICS_TITANS);
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, MOBILE_CLASSICS_HYBRIDS);
if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') Object.assign(TYPE_EGG_BASE_PRICE, MOBILE_CLASSICS_PRICES);
if (typeof TYPE_EGG_PRICE !== 'undefined') {
  Object.keys(MOBILE_CLASSICS_PRICES).forEach((key) => {
    TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(MOBILE_CLASSICS_PRICES[key]) : MOBILE_CLASSICS_PRICES[key];
  });
}
if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...Object.keys(MOBILE_CLASSICS_SPECIES));
if (typeof SCENES !== 'undefined') {
  Object.entries(MOBILE_CLASSICS_HABITATS).forEach(([key, scenes]) => {
    scenes.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
}
