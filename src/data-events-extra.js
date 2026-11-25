/* Second event rotation: four more weekend events and their event-only species.
   Species are registered exactly like data-events.js does it, then the new keys
   join EVENT_KEYS so the weekend gift and egg pools can roll them. */

const EVENT_SPECIES_EXTRA = {
  lanterncarp: {
    name: 'Lantern Carp', primary: '#ffb347', light: '#fff0d6', deep: '#8a4a12', accent: '#ff5e8a',
    trait: 'Glowing — carries a paper lantern that never goes out.', likes: 'Moon Cake',
    blurb: 'A slow, warm carp who swims through festival weekend air as if it were water.',
    greeting: 'Follow the light. It knows the way to the snacks.',
  },
  frostferret: {
    name: 'Frost Ferret', primary: '#c2e8f5', light: '#f0fbff', deep: '#3f6f80', accent: '#b69cff',
    trait: 'Brisk — leaves little snowflakes wherever it argues.', likes: 'Berry Fizz',
    blurb: 'A long, quick ferret who arrives with the cold snap and steals exactly one mitten.',
    greeting: 'I took your mitten. I am keeping it. We are friends now.',
  },
  honeydrone: {
    name: 'Honey Drone', primary: '#ffd166', light: '#fff7d6', deep: '#7a5a14', accent: '#8fe07a',
    trait: 'Busy — hums a different note for every flower it remembers.', likes: 'Honeycomb Cake',
    blurb: 'A tiny round drone who shows up for the blossom weekend and refuses to stop working.',
    greeting: 'Hive business. Very important. Also, hello.',
  },
  embercub: {
    name: 'Ember Cub', primary: '#ff8a5c', light: '#ffdfd0', deep: '#6b2a0a', accent: '#ffd166',
    trait: 'Cozy — radiates exactly enough heat for two.', likes: 'Butter Potato',
    blurb: 'A round little cub with a furnace for a heart who arrives when the nights turn long.',
    greeting: 'Sit here. You are cold. I have decided you are cold.',
  },
  orbitotter: {
    name: 'Orbit Otter', primary: '#8fb8ff', light: '#e4f0ff', deep: '#263a72', accent: '#b18cff',
    trait: 'Tidal orbit — floats in lazy circles around whoever it likes.', likes: 'Moon Cake',
    blurb: 'A sleek otter who rides the ring-wakes of distant planets and brings back wet stardust.',
    greeting: 'I found a new moon. It is small. I named it after you.',
  },
  solarmoth: {
    name: 'Solar Moth', primary: '#ffd166', light: '#fff8dc', deep: '#7a4a08', accent: '#ff8a5c',
    trait: 'Sun-dusted — its wings store a whole afternoon of light.', likes: 'Honeycomb Cake',
    blurb: 'A bright moth who crosses the sky at noon and leaves a warm gold trail.',
    greeting: 'I followed the light here. It was you. Obviously.',
  },
  crystalfawn: {
    name: 'Crystal Fawn', primary: '#b9f5e3', light: '#f0fffa', deep: '#2f6b5f', accent: '#b18cff',
    trait: 'Prism step — every hoofprint catches a different color.', likes: 'Berry Fizz',
    blurb: 'A shy fawn with geode antlers who appears where the ground hums with new crystals.',
    greeting: 'Careful. The moss is singing. It only does that for kind company.',
  },
};

const EVENT_GENES_EXTRA = {
  lanterncarp: ['Lantern Light', '🏮', 'Gifts arrive 20% sooner and +10% XP.', { giftSpeed: 1.2, xp: 1.1 }],
  frostferret: ['Cold Snap', '❄️', 'Needs fade 20% slower and games pay +2 coins.', { needSlow: 0.8, gameCoins: 2 }],
  honeydrone: ['Hive Ledger', '🍯', 'Tasks and check-ins pay +20% coins.', { taskCoins: 2, coins: 1.1 }],
  embercub: ['Hearth Glow', '🔥', 'Bond +15% and cold-weather needs fade slower.', { bond: 1.15, energyDecay: 0.9 }],
  orbitotter: ['Ring Current', '🪐', 'Planet-gate summons grant +12% XP.', { xp: 1.12 }],
  solarmoth: ['Sun Store', '☀️', 'Games pay +3 coins and bond gains +10%.', { gameCoins: 3, bond: 1.1 }],
  crystalfawn: ['Prism Step', '💎', 'Needs fade 10% slower and XP gains +8%.', { needSlow: 0.9, xp: 1.08 }],
};

const EVENT_PRICES_EXTRA = { lanterncarp: 255, frostferret: 250, honeydrone: 245, embercub: 260, orbitotter: 275, solarmoth: 270, crystalfawn: 280 };
const EVENT_HOMES_EXTRA = {
  lanterncarp: ['sakura', 'tide'],
  frostferret: ['frost', 'starlit'],
  honeydrone: ['grove', 'sakura'],
  embercub: ['ember', 'mycelium'],
  orbitotter: ['tide', 'starlit'],
  solarmoth: ['grove', 'ember'],
  crystalfawn: ['frost', 'starlit'],
};
const EVENT_HYBRIDS_EXTRA = {
  'lanterncarp+honeydrone': 'Lantern Hive',
  'frostferret+embercub': 'Thaw Cub',
  'meteorpup+embercub': 'Campfire Trail',
  'auroraowl+frostferret': 'Polar Ferret',
  'confettigoat+honeydrone': 'Party Hive',
  'lanterncarp+festivalfox': 'Parade Lantern',
  'orbitotter+lanterncarp': 'Ring Lantern',
  'solarmoth+honeydrone': 'Sun Hive',
  'crystalfawn+crystal': 'Prism Den',
};

Object.entries(EVENT_SPECIES_EXTRA).forEach(([key, meta]) => {
  if (ELEMENTS[key]) return;
  const gene = EVENT_GENES_EXTRA[key] || ['Special Guest', '✨', 'XP +10%.', { xp: 1.1 }];
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
    eventOnly: true,
    admin: false,
  };
  GENE_POWERS[key] = { name: gene[0], icon: gene[1], desc: gene[2], effect: gene[3] };
  TITAN_NAMES[key] = `${meta.name} Titan`;
  NAME_START[key] = [meta.name.split(' ')[0], 'Event', 'Weekend', 'Festival'];
  TYPE_EGG_BASE_PRICE[key] = EVENT_PRICES_EXTRA[key] || 250;
  TYPE_EGG_PRICE[key] = Math.round((EVENT_PRICES_EXTRA[key] || 250) * 0.9);
  (EVENT_HOMES_EXTRA[key] || ['starlit']).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
  if (!ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
  if (typeof EVENT_KEYS !== 'undefined' && !EVENT_KEYS.includes(key)) EVENT_KEYS.push(key);
});

Object.assign(HYBRID_NAMES, EVENT_HYBRIDS_EXTRA);

if (typeof WEEKEND_ADMIN_EVENTS !== 'undefined') {
  WEEKEND_ADMIN_EVENTS.push(
    {
      key: 'lantern-weekend', name: 'Lantern Weekend', icon: '🏮', color: '#ffb347',
      blurb: 'Paper lanterns over the Hollow: faster gifts, festival coins, and a Lantern Carp egg.',
      xpMult: 1.3, coins: 340, egg: 'lanterncarp',
    },
    {
      key: 'first-snow', name: 'First Snow Weekend', icon: '❄️', color: '#c2e8f5',
      blurb: 'The first snow of the season: slower needs, richer trails, and a Frost Ferret egg.',
      xpMult: 1.32, coins: 350, egg: 'frostferret',
    },
    {
      key: 'blossom-weekend', name: 'Blossom Weekend', icon: '🌸', color: '#ffd166',
      blurb: 'The grove blooms early: task coins, extra XP, and a Honey Drone egg.',
      xpMult: 1.28, coins: 330, egg: 'honeydrone',
    },
    {
      key: 'long-night', name: 'Long Night Weekend', icon: '🔥', color: '#ff8a5c',
      blurb: 'The longest night of the season: warm rewards, slower needs, and an Ember Cub egg.',
      xpMult: 1.4, coins: 360, egg: 'embercub',
    },
    {
      key: 'orbit-weekend', name: 'Orbit Weekend', icon: '🪐', color: '#8fb8ff',
      blurb: 'The Hollow passes through a planet ring: richer XP, portal coins, and an Orbit Otter egg.',
      xpMult: 1.36, coins: 365, egg: 'orbitotter',
    },
    {
      key: 'sunspot-weekend', name: 'Sunspot Weekend', icon: '☀️', color: '#ffd166',
      blurb: 'Bright flares over the grove: game coins, extra XP, and a Solar Moth egg.',
      xpMult: 1.3, coins: 345, egg: 'solarmoth',
    },
    {
      key: 'geode-weekend', name: 'Geode Weekend', icon: '💎', color: '#b9f5e3',
      blurb: 'New crystals split the earth: gathering luck, extra XP, and a Crystal Fawn egg.',
      xpMult: 1.34, coins: 355, egg: 'crystalfawn',
    },
  );
}

/* The nine world events of Sprite Hollow. Each one belongs to a region and
   hands out that region's elemental egg while it runs. */
if (typeof WEEKEND_ADMIN_EVENTS !== 'undefined') {
  WEEKEND_ADMIN_EVENTS.push(
    {
      key: 'hatch-day', name: 'Hatch Day Festival', icon: '🥚', color: '#ffe6a3',
      blurb: 'Every egg in Bloomroot is warm at once: hatchery coins, extra XP, and a Nature Puffle egg.',
      xpMult: 1.28, coins: 330, egg: 'sp_nature',
    },
    {
      key: 'bloomlight-celebration', name: 'Bloomlight Celebration', icon: '🌸', color: '#ffd166',
      blurb: 'The garden flowers all light up together: gift coins, faster bloom, and a Bloomlight egg.',
      xpMult: 1.3, coins: 340, egg: 'sp_bloomlight',
    },
    {
      key: 'crystal-moon-market', name: 'Crystal Moon Market', icon: '🌙', color: '#b9f5e3',
      blurb: 'Stalls of moonlit stone open in the caverns: trade coins, extra XP, and a Crystal Puffle egg.',
      xpMult: 1.32, coins: 350, egg: 'sp_crystal',
    },
    {
      key: 'storm-racing', name: 'Storm Racing Championship', icon: '🏁', color: '#8be9ff',
      blurb: 'Racers climb the thunder stairs for the cup: game coins, extra XP, and a Lightning Puffle egg.',
      xpMult: 1.36, coins: 360, egg: 'sp_lightning',
    },
    {
      key: 'emberpeak-fireworks', name: 'Fireworks of Emberpeak', icon: '🎆', color: '#ff8a5c',
      blurb: 'The highlands light their own sky: rich coins, extra XP, and a Fire Puffle egg.',
      xpMult: 1.34, coins: 355, egg: 'sp_fire',
    },
    {
      key: 'aurora-night', name: 'Aurora Night Festival', icon: '🌌', color: '#bfffe9',
      blurb: 'The glacier sky answers in ribbons: slower needs, extra XP, and an Ice Puffle egg.',
      xpMult: 1.3, coins: 345, egg: 'sp_ice',
    },
    {
      key: 'ocean-treasure-hunt', name: 'Ocean Treasure Hunt', icon: '🗺️', color: '#5ad0e0',
      blurb: 'Chests wash up along the coast all weekend: hunt coins, extra XP, and a Water Puffle egg.',
      xpMult: 1.32, coins: 350, egg: 'sp_water',
    },
    {
      key: 'creators-day', name: "Creator's Day", icon: '👑', color: '#ffe08a',
      blurb: 'The Hollow remembers who named the elements: generous coins, extra XP, and a Light Puffle egg.',
      xpMult: 1.4, coins: 380, egg: 'sp_light',
    },
    {
      key: 'worldheart-gathering', name: 'Worldheart Gathering', icon: '🌳', color: '#8fe07a',
      blurb: 'Every region sends someone to the great tree: bond coins, extra XP, and a Titanroot egg.',
      xpMult: 1.34, coins: 355, egg: 'sp_titanroot',
    },
  );
}

/* A short festival calendar the Hollow can show outside the admin weekends. */
const HOLLOW_FESTIVALS = [
  { key: 'lantern-festival', name: 'Lantern Festival', icon: '🏮', month: 2, color: '#ffb347', species: 'lanterncarp' },
  { key: 'first-snow-fest', name: 'First Snow Festival', icon: '❄️', month: 11, color: '#c2e8f5', species: 'frostferret' },
  { key: 'blossom-fest', name: 'Blossom Festival', icon: '🌸', month: 3, color: '#ffd166', species: 'honeydrone' },
  { key: 'hearth-fest', name: 'Hearth Festival', icon: '🔥', month: 0, color: '#ff8a5c', species: 'embercub' },
  { key: 'orbit-fest', name: 'Orbit Festival', icon: '🪐', month: 8, color: '#8fb8ff', species: 'orbitotter' },
  { key: 'sunspot-fest', name: 'Sunspot Festival', icon: '☀️', month: 6, color: '#ffd166', species: 'solarmoth' },
  { key: 'geode-fest', name: 'Geode Festival', icon: '💎', month: 10, color: '#b9f5e3', species: 'crystalfawn' },
];

function festivalForMonth(date = new Date()) {
  return HOLLOW_FESTIVALS.find((festival) => festival.month === date.getMonth()) || null;
}
