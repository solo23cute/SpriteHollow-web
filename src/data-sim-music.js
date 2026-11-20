/* Sim & Rhythm Legends Wave: 4 simulation & music/reflex icons.
   1. Life Sim Architect (Family Life Sim)
   2. Magic Piano Tiles Maestro (Magic Tiles 1-3)
   3. Rolling Ball Balancer (Rolling Ball Slope Rush)
   4. Tap Tiles Speedster (Tap Tiles 1-3 Triple Stage) */

const SIM_MUSIC_SPECIES = {
  lifesim: {
    name: 'Life Sim Architect', primary: '#0284c7', light: '#e0f2fe', deep: '#0369a1', accent: '#f59e0b',
    trait: 'Family Architect — guides generations through life milestones, dream careers, and loving homes.',
    blurb: 'A wise, friendly family architect wearing a blueprint visor and golden house badge who cultivates generational joy and cozy homes.',
    greeting: 'Welcome to the family! Ready to build a wonderful life, choose our careers, and decorate our dream home?',
    likes: 'Honeycomb Cake',
  },
  magictiles: {
    name: 'Magic Piano Tiles Maestro', primary: '#6366f1', light: '#e0e7ff', deep: '#3730a3', accent: '#ec4899',
    trait: 'Rhythm Maestro — glides across piano keys with perfect pitch and rhythmic flow.',
    blurb: 'A musical virtuoso sprite wearing a conductor bowtie with floating piano key runes and glowing soundwaves.',
    greeting: 'Listen to the melody! Let your fingers dance across the keys and never miss a beat!',
    likes: 'Star Pop',
  },
  rollingball: {
    name: 'Rolling Ball Balancer', primary: '#10b981', light: '#d1fae5', deep: '#065f46', accent: '#3b82f6',
    trait: 'Slope Balancer — navigates steep slopes, jumps neon ramps, and dodges track hazards.',
    blurb: 'A dynamic gyroscopic roller sprite crowned with an orbital ring that rushes down neon slopes at breakneck speeds.',
    greeting: 'Gravity is just a suggestion! Lean into the curve and roll down the neon slope!',
    likes: 'Sun Nectar',
  },
  taptiles: {
    name: 'Tap Tiles Speedster', primary: '#f43f5e', light: '#ffe4e6', deep: '#9f1239', accent: '#eab308',
    trait: 'Speed Rush — taps colorful grids with lightning-fast reflexes and unbreakable combos.',
    blurb: 'An energetic speedster sprite adorned with glowing tile badges that clears tile stages faster than lightning.',
    greeting: 'On your marks, get set, TAP! Can you beat all three tile stages without missing?',
    likes: 'Star Cookie',
  },
};

const SIM_MUSIC_GENES = {
  lifesim: { name: 'Family Hearth', icon: '🏡', desc: 'Life sim & care games pay +12 bonus coins, bond builds +30%, and gifts arrive 25% sooner.', effect: { gameCoins: 12, petBond: 1.3, giftSpeed: 1.25 } },
  magictiles: { name: 'Piano Fortissimo', icon: '🎹', desc: 'Rhythm and music games pay +15 bonus coins and XP gains +25%.', effect: { gameCoins: 15, xp: 1.25 } },
  rollingball: { name: 'Gyro Momentum', icon: '🌀', desc: 'Slope and runner games pay +12 bonus coins and day tasks pay +8 coins.', effect: { gameCoins: 12, dayCoins: 8 } },
  taptiles: { name: 'Speed Combo Rush', icon: '⚡', desc: 'Reflex and tile games pay +14 bonus coins and check-ins pay +8 coins.', effect: { gameCoins: 14, checkinCoins: 8 } },
};

const SIM_MUSIC_TITANS = {
  lifesim: 'Grand Patriarch Architect of Generations',
  magictiles: 'Supreme Virtuoso of the Celestial Keyboard',
  rollingball: 'Infinite Slope Velocity Overlord',
  taptiles: 'Unstoppable Blitz Master of the Triple Stage',
};

const SIM_MUSIC_PRICES = {
  lifesim: 140,
  magictiles: 145,
  rollingball: 135,
  taptiles: 135,
};

const SIM_MUSIC_HYBRIDS = {
  'lifesim+candy': 'Home Sim Baker',
  'magictiles+crystal': 'Starlight Pianist',
  'rollingball+volt': 'Neon Slope Roller',
  'taptiles+ember': 'Rapid Fire Tapper',
};

const SIM_MUSIC_HABITATS = {
  lifesim: ['grove', 'sugar'],
  magictiles: ['crystal', 'night'],
  rollingball: ['neon', 'aurora'],
  taptiles: ['ember', 'savanna'],
};

function signatureSimMusic(el, c) {
  switch (el) {
    case 'lifesim':
      return `
        <!-- Life Sim Blueprint Crest & House Emblem -->
        <path d="M44 26L60 14L76 26" fill="none" stroke="${c.accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="68" y="13" width="4" height="6" fill="${c.deep}"/>
        <circle cx="71" cy="9" r="1.8" fill="${c.light}" opacity=".8"/>
        <circle cx="74" cy="5" r="2.4" fill="${c.light}" opacity=".6"/>
        <rect x="52" y="80" width="16" height="13" rx="2" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M54 85l6-4 6 4M57 93v-5h6v5" fill="none" stroke="${c.accent}" stroke-width="1.2"/>
        <path d="M28 42l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="${c.accent}" opacity=".85"/>
        <path d="M92 46l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="${c.light}" opacity=".8"/>`;
    case 'magictiles':
      return `
        <!-- Floating Piano Keyboard Arc & Musical Notes -->
        <g opacity=".95">
          <rect x="36" y="15" width="48" height="15" rx="2" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
          <line x1="44" y1="15" x2="44" y2="30" stroke="${c.deep}" stroke-width="1"/>
          <line x1="52" y1="15" x2="52" y2="30" stroke="${c.deep}" stroke-width="1"/>
          <line x1="60" y1="15" x2="60" y2="30" stroke="${c.deep}" stroke-width="1"/>
          <line x1="68" y1="15" x2="68" y2="30" stroke="${c.deep}" stroke-width="1"/>
          <line x1="76" y1="15" x2="76" y2="30" stroke="${c.deep}" stroke-width="1"/>
          <rect x="42" y="15" width="4" height="8" fill="#1e1e24"/>
          <rect x="50" y="15" width="4" height="8" fill="#1e1e24"/>
          <rect x="66" y="15" width="4" height="8" fill="#1e1e24"/>
          <rect x="74" y="15" width="4" height="8" fill="#1e1e24"/>
        </g>
        <path d="M53 78l7 4-7 4zm14 0l-7 4 7 4z" fill="${c.accent}"/>
        <circle cx="60" cy="82" r="2.5" fill="${c.light}"/>
        <text x="22" y="44" font-size="14" fill="${c.accent}" opacity=".9" font-family="sans-serif">♪</text>
        <text x="89" y="42" font-size="16" fill="${c.light}" opacity=".9" font-family="sans-serif">♫</text>`;
    case 'rollingball':
      return `
        <!-- Gyroscopic Orbital Rings & Slope Speed Arrows -->
        <ellipse cx="60" cy="68" rx="42" ry="14" fill="none" stroke="${c.accent}" stroke-width="2.6" transform="rotate(-25 60 68)" opacity=".85"/>
        <ellipse cx="60" cy="68" rx="42" ry="14" fill="none" stroke="${c.light}" stroke-width="1.2" stroke-dasharray="4 4" transform="rotate(-25 60 68)"/>
        <circle cx="27" cy="81" r="3.6" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="93" cy="55" r="3.6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M42 22l6 6-6 6M56 22l6 6-6 6" fill="none" stroke="${c.light}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
    case 'taptiles':
      return `
        <!-- Lightning Bolt & 4 Luminous Speed Tiles -->
        <g opacity=".9">
          <rect x="22" y="32" width="11" height="11" rx="2" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
          <rect x="87" y="32" width="11" height="11" rx="2" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
          <rect x="23" y="73" width="11" height="11" rx="2" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
          <rect x="86" y="73" width="11" height="11" rx="2" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        </g>
        <path d="M60 12l-6 12h6l-3 10 9-14h-6z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 18c-6 3-10 10-9 16M82 18c6 3 10 10 9 16" fill="none" stroke="${c.light}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
    default:
      return '';
  }
}

if (typeof ELEMENTS !== 'undefined') Object.assign(ELEMENTS, SIM_MUSIC_SPECIES);
if (typeof GENE_POWERS !== 'undefined') Object.assign(GENE_POWERS, SIM_MUSIC_GENES);
if (typeof TITAN_NAMES !== 'undefined') Object.assign(TITAN_NAMES, SIM_MUSIC_TITANS);
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, SIM_MUSIC_HYBRIDS);
if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') Object.assign(TYPE_EGG_BASE_PRICE, SIM_MUSIC_PRICES);
if (typeof TYPE_EGG_PRICE !== 'undefined') {
  Object.keys(SIM_MUSIC_PRICES).forEach((key) => {
    TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(SIM_MUSIC_PRICES[key]) : SIM_MUSIC_PRICES[key];
  });
}
if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...Object.keys(SIM_MUSIC_SPECIES));
if (typeof SCENES !== 'undefined') {
  Object.entries(SIM_MUSIC_HABITATS).forEach(([key, scenes]) => {
    scenes.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
}
