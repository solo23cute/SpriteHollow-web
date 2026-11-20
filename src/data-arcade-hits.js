/* Arcade & Mobile Hits Wave:
   1. Paper.io (paperio - Territory Painter)
   2. Galaxia (galaxia - Galaga / Galaxia Starfighter)
   3. Cookie Run Classic (cookierun - Ginger Brave Runner)
   4. Dancing Road Color Match (dancingroad - Dancing Road Ball)
   5. Run Sausage Run (sausagerun - Run Sausage Hotdog) */

const ARCADE_HITS_SPECIES = {
  paperio: {
    name: 'Territory Painter', primary: '#06b6d4', light: '#cffafe', deep: '#0891b2', accent: '#f43f5e',
    trait: 'Paper Fold — loops colorful trails and expands territory grids with sharp precision.',
    blurb: 'A geometric origami sprite in a paper fold crown who captures vibrant territory grids and cuts rival trails.',
    greeting: 'Draw the boundary and claim the map! Watch your tail!',
    likes: 'Star Cookie',
  },
  galaxia: {
    name: 'Galaxia Starfighter', primary: '#3b82f6', light: '#dbeafe', deep: '#1d4ed8', accent: '#eab308',
    trait: 'Star Blaster — swoops into deep space formations firing twin photon lasers at alien insects.',
    blurb: 'A vintage arcade starfighter sprite with laser blasters, retro thruster trails, and radar antennas.',
    greeting: 'Prepare for launch! Alien fleet detected in sector 7 — lock lasers!',
    likes: 'Sun Nectar',
  },
  cookierun: {
    name: 'Ginger Brave Runner', primary: '#d97706', light: '#fef3c7', deep: '#78350f', accent: '#ef4444',
    trait: 'Oven Escape — dashes through fiery kitchens sliding under candy forks and collecting jelly beans.',
    blurb: 'A spirited gingerbread runner with a candy cane baton, sugar glaze icing, and an unstoppable escape sprint.',
    greeting: 'The witch’s oven can’t hold me! Jump, slide, and grab every rainbow jelly!',
    likes: 'Honeycomb Cake',
  },
  dancingroad: {
    name: 'Dancing Road Ball', primary: '#ec4899', light: '#fce7f3', deep: '#9d174d', accent: '#8b5cf6',
    trait: 'Color Match — rolls down neon rhythm tracks matching glowing balls of identical color.',
    blurb: 'A musical roller ball sprite that shifts between neon red, blue, and yellow to match beat gates down the road.',
    greeting: 'Feel the beat! Roll into matching color balls and never touch the wrong hue!',
    likes: 'Star Pop',
  },
  sausagerun: {
    name: 'Run Sausage Hotdog', primary: '#ea580c', light: '#ffedd5', deep: '#9a3412', accent: '#eab308',
    trait: 'Sizzling Bend — bends and dips backward to duck under guillotine knives, spinning saws, and scorching grills.',
    blurb: 'A hilarious hotdog runner wearing a squirt of mustard and running sneakers who survives dangerous kitchens.',
    greeting: 'Don’t slice me! Don’t grill me! Bend backwards and run for freedom!',
    likes: 'Ember Steak',
  },
};

const ARCADE_HITS_GENES = {
  paperio: { name: 'Territory Conquest', icon: '📐', desc: 'Reflex & arena games pay +12 bonus coins and XP gains +25%.', effect: { gameCoins: 12, xp: 1.25 } },
  galaxia: { name: 'Dual Photon Laser', icon: '🚀', desc: 'Shooter & arcade games pay +14 bonus coins and bond builds +30%.', effect: { gameCoins: 14, petBond: 1.3 } },
  cookierun: { name: 'Ginger Escape Surge', icon: '🍪', desc: 'Runner & food games pay +15 bonus coins and gifts arrive 30% faster.', effect: { gameCoins: 15, giftSpeed: 1.3 } },
  dancingroad: { name: 'Harmonic Color Beat', icon: '🎵', desc: 'Rhythm & music games pay +15 bonus coins and day tasks pay +8 coins.', effect: { gameCoins: 15, dayCoins: 8 } },
  sausagerun: { name: 'Sausage Bend Reflex', icon: '🌭', desc: 'Obstacle & action games pay +14 bonus coins and check-ins pay +8 coins.', effect: { gameCoins: 14, checkinCoins: 8 } },
};

const ARCADE_HITS_TITANS = {
  paperio: 'Sovereign Monarch of the Paper Realm',
  galaxia: 'Supreme Fleet Admiral of the Galaxia Nebula',
  cookierun: 'Grand Hero of the Cookie Kingdom',
  dancingroad: 'Virtuoso of the Infinite Neon Road',
  sausagerun: 'Undefeated Master of the Kitchen Gauntlet',
};

const ARCADE_HITS_PRICES = {
  paperio: 135,
  galaxia: 140,
  cookierun: 140,
  dancingroad: 135,
  sausagerun: 135,
};

const ARCADE_HITS_HYBRIDS = {
  'paperio+volt': 'Neon Origami',
  'galaxia+dusk': 'Deep Space Corsair',
  'cookierun+candy': 'Rainbow Gingerbread',
  'dancingroad+crystal': 'Harmonic Roller',
  'sausagerun+ember': 'Grillmaster Sausage',
};

const ARCADE_HITS_HABITATS = {
  paperio: ['crystal', 'neon'],
  galaxia: ['night', 'aurora'],
  cookierun: ['sugar', 'grove'],
  dancingroad: ['neon', 'crystal'],
  sausagerun: ['ember', 'savanna'],
};

function signatureArcadeHits(el, c) {
  switch (el) {
    case 'paperio':
      return `
        <!-- Paper.io Geometric Fold Crown & Grid Trail -->
        <path d="M42 22l18-12 18 12-8 10-10-6-10 6z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M50 16l10-7 10 7" fill="none" stroke="${c.light}" stroke-width="1.4"/>
        <rect x="22" y="74" width="16" height="16" rx="2" fill="${c.light}" stroke="${c.deep}" stroke-width="1" opacity=".85"/>
        <path d="M26 78h8v8h-8z" fill="${c.accent}" opacity=".8"/>
        <rect x="82" y="74" width="16" height="16" rx="2" fill="${c.accent}" stroke="${c.deep}" stroke-width="1" opacity=".85"/>
        <path d="M86 78h8v8h-8z" fill="${c.light}" opacity=".8"/>`;
    case 'galaxia':
      return `
        <!-- Galaxia Starfighter Wings, Blasters & Antenna -->
        <path d="M60 12v12M57 14h6" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="11" r="2.5" fill="${c.light}"/>
        <path d="M20 65l16-6 4 12-18 2z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M100 65l-16-6-4 12 18 2z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <rect x="22" y="52" width="4" height="14" rx="1" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <rect x="94" y="52" width="4" height="14" rx="1" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="24" cy="48" r="2" fill="#ef4444"/>
        <circle cx="96" cy="48" r="2" fill="#ef4444"/>`;
    case 'cookierun':
      return `
        <!-- GingerBrave Candy Cane Baton & Sugar Glaze Swirls -->
        <path d="M92 45c0-8-6-14-14-14s-14 6-14 14v35" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
        <path d="M92 45c0-8-6-14-14-14s-14 6-14 14v35" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 7"/>
        <circle cx="60" cy="20" r="4.5" fill="#ef4444"/>
        <circle cx="48" cy="24" r="3.5" fill="#facc15"/>
        <circle cx="72" cy="24" r="3.5" fill="#22c55e"/>
        <path d="M50 82c5 4 15 4 20 0" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`;
    case 'dancingroad':
      return `
        <!-- Dancing Road Concentric Rhythm Spheres & Color Beats -->
        <circle cx="30" cy="38" r="7" fill="#ef4444" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="60" cy="18" r="8" fill="#3b82f6" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="90" cy="38" r="7" fill="#eab308" stroke="${c.deep}" stroke-width="1"/>
        <ellipse cx="60" cy="68" rx="44" ry="12" fill="none" stroke="${c.light}" stroke-width="2" stroke-dasharray="6 4" opacity=".85"/>
        <text x="20" y="78" font-size="14" fill="${c.accent}" font-family="sans-serif">♫</text>
        <text x="92" y="78" font-size="14" fill="${c.light}" font-family="sans-serif">♪</text>`;
    case 'sausagerun':
      return `
        <!-- Run Sausage Mustard Swirl & Running Sneakers -->
        <path d="M55 16c6-4 12 3 9 7-3 4-8-1-11 5s3 8 7 7" fill="none" stroke="#eab308" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M48 12h24v7H48z" fill="#ffffff" stroke="${c.deep}" stroke-width="1"/>
        <path d="M52 12c-4-8 16-12 16 0" fill="#ffffff"/>
        <!-- Chef Hat & Sneakers -->
        <ellipse cx="40" cy="98" rx="8" ry="4.5" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
        <ellipse cx="80" cy="98" rx="8" ry="4.5" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M36 98h8M76 98h8" stroke="#ef4444" stroke-width="1.5"/>`;
    default:
      return '';
  }
}

if (typeof ELEMENTS !== 'undefined') Object.assign(ELEMENTS, ARCADE_HITS_SPECIES);
if (typeof GENE_POWERS !== 'undefined') Object.assign(GENE_POWERS, ARCADE_HITS_GENES);
if (typeof TITAN_NAMES !== 'undefined') Object.assign(TITAN_NAMES, ARCADE_HITS_TITANS);
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, ARCADE_HITS_HYBRIDS);
if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') Object.assign(TYPE_EGG_BASE_PRICE, ARCADE_HITS_PRICES);
if (typeof TYPE_EGG_PRICE !== 'undefined') {
  Object.keys(ARCADE_HITS_PRICES).forEach((key) => {
    TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(ARCADE_HITS_PRICES[key]) : ARCADE_HITS_PRICES[key];
  });
}
if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...Object.keys(ARCADE_HITS_SPECIES));
if (typeof SCENES !== 'undefined') {
  Object.entries(ARCADE_HITS_HABITATS).forEach(([key, scenes]) => {
    scenes.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
}
