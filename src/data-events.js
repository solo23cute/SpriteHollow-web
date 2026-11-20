/* Special event sprites, Admin sprites, and the rotating weekend Admin Event.
   Event and admin species are never sold as normal eggs: they arrive through the
   weekend event gift, the daily egg gift, or a holiday pool. */

const EVENT_SPECIES = {
  meteorpup: {
    name: 'Meteor Pup', primary: '#ff7a4d', light: '#ffe0d0', deep: '#5a1f08', accent: '#ffd166',
    trait: 'Sizzling — leaves a warm trail of stardust behind every step.', likes: 'Star Pop',
    blurb: 'A comet-chasing pup who arrives only while a weekend event is burning bright.',
    greeting: 'I fell out of the sky for the weekend. Worth it.',
  },
  auroraowl: {
    name: 'Aurora Owl', primary: '#5ee0a0', light: '#dbfff0', deep: '#0f4a34', accent: '#8be9ff',
    trait: 'Glowing — feathers shift colour with the sky.', likes: 'Moon Berry',
    blurb: 'A quiet owl wrapped in polar light who appears when the weekend skies open.',
    greeting: 'The lights are out. Come look up.',
  },
  confettigoat: {
    name: 'Confetti Goat', primary: '#ff7ac8', light: '#ffe6f4', deep: '#5a1a3a', accent: '#ffd166',
    trait: 'Celebratory — sheds confetti whenever someone finishes a task.', likes: 'Honeycomb Cake',
    blurb: 'A party goat with paper streamers in its horns and no concept of a quiet room.',
    greeting: 'Party! I brought the party! It is me, I am the party.',
  },
  cometbunny: {
    name: 'Comet Bunny', primary: '#b69cff', light: '#f0e9ff', deep: '#33204a', accent: '#8be9ff',
    trait: 'Fast — outruns its own shadow on event weekends.', likes: 'Candyfloss',
    blurb: 'A long-eared sprinter with a tail like a shooting star and a permanent sugar rush.',
    greeting: 'Race you to the weekend!',
  },
  sundialturtle: {
    name: 'Sundial Turtle', primary: '#e8c07a', light: '#fff2d2', deep: '#5a3a0a', accent: '#8fe07a',
    trait: 'Patient — keeps perfect time and never rushes a celebration.', likes: 'Sun Nectar',
    blurb: 'A shell marked like a sundial that only wakes for long, bright event days.',
    greeting: 'Take your time. The sun is not going anywhere.',
  },
  festivalfox: {
    name: 'Festival Fox', primary: '#ff9a3c', light: '#fff0d6', deep: '#6b3a00', accent: '#ffd166',
    trait: 'Festive — has a paper lantern for every occasion and a spare for yours.', likes: 'Honeycomb Cake',
    blurb: 'A bright-tailed fox who arrives with the lantern parades and leaves confetti in every doorway.',
    greeting: 'The parade started without you. Unacceptable. Follow me.',
  },
  vaultmoth: {
    name: 'Vault Moth', primary: '#b69cff', light: '#f0e9ff', deep: '#33204a', accent: '#ffd166',
    trait: 'Curious — can smell an unopened door from three rooms away.', likes: 'Moon Cake',
    blurb: 'A dusty-winged moth who flutters out of old vaults and insists on showing you what it found.',
    greeting: 'A door! A door that has not been opened! Come on.',
  },
  hollowhart: {
    name: 'Hollow Hart', primary: '#8fe07a', light: '#efffdc', deep: '#2f5a1a', accent: '#8be9ff',
    trait: 'Rooted — grows a tiny flower wherever it sleeps.', likes: 'Trail Mix',
    blurb: 'A gentle antlered event sprite that wanders in when the Hollow is at its greenest.',
    greeting: 'The paths grew over while I was away. Shall we walk them?',
  },
  sparklynx: {
    name: 'Spark Lynx', primary: '#5ad6ff', light: '#e6fbff', deep: '#123a4a', accent: '#ff4fd8',
    trait: 'Charged — sheds static sparks when it is happy, which is often.', likes: 'Berry Fizz',
    blurb: 'A neon-eared lynx that appears during festival weekends and lights up the whole room.',
    greeting: 'Do not touch the ears. Actually — do. It is great.',
  },
};

const ADMIN_SPECIES = {
  adminaura: {
    name: 'Admin Aura', primary: '#8be9ff', light: '#e6fbff', deep: '#123a4a', accent: '#ffd166',
    trait: 'Omniscient — can see the whole save file and politely pretends not to.', likes: 'Star Cookie',
    blurb: 'The Hollow’s quiet operator: a floating icon with a clipboard and root access to the weather.',
    greeting: 'Be right with you. I am patching the sky.',
  },
  rootrabbit: {
    name: 'Root Rabbit', primary: '#8fe07a', light: '#eaffd6', deep: '#1f4a14', accent: '#8be9ff',
    trait: 'Privileged — hops straight past every locked door.', likes: 'Trail Mix',
    blurb: 'A green-eared rabbit that appears only on admin weekends, carrying a tiny terminal.',
    greeting: 'sudo hop. It worked. It always works.',
  },
  devdrake: {
    name: 'Dev Drake', primary: '#b69cff', light: '#f0e9ff', deep: '#2a1040', accent: '#ff7ac8',
    trait: 'Iterative — ships a tiny fix every single day.', likes: 'Berry Fizz',
    blurb: 'A small dragon with a build pipeline for a tail and a habit of breaking things on purpose.',
    greeting: 'Local build passed. Probably. Ship it.',
  },
  patchpup: {
    name: 'Patch Pup', primary: '#ffd166', light: '#fff7d6', deep: '#5a3a00', accent: '#8fe07a',
    trait: 'Repairing — chews up bugs and buries them in the yard.', likes: 'Butter Potato',
    blurb: 'A cheerful pup with a bandage on one ear and a nose for regressions.',
    greeting: 'Found a bug! Ate the bug! You are welcome!',
  },
  loglynx: {
    name: 'Log Lynx', primary: '#8f97a8', light: '#e3e8f2', deep: '#1f2430', accent: '#8be9ff',
    trait: 'Observant — reads every line and remembers the stack trace.', likes: 'Warm Tea',
    blurb: 'A grey lynx with reading glasses who quietly knows exactly what broke and when.',
    greeting: 'Line 412. It is always line 412.',
  },
  cachecat: {
    name: 'Cache Cat', primary: '#ff9ec7', light: '#ffe6f4', deep: '#4a1030', accent: '#8be9ff',
    trait: 'Retentive — remembers everything and refuses to let go.', likes: 'Milk Tea',
    blurb: 'A pink cat curled inside the save file, holding onto data nobody else remembers.',
    greeting: 'I kept that. You may need it in three years.',
  },
};

const EVENT_GENES = {
  meteorpup: ['Meteor Trail', '☄️', 'XP +20% during any weekend event.', { xp: 1.2 }],
  auroraowl: ['Polar Light', '🌌', 'Gifts arrive 25% sooner.', { giftSpeed: 1.25 }],
  confettigoat: ['Celebration', '🎉', 'Coins +20% and joy +10%.', { coins: 1.2, joy: 1.1 }],
  festivalfox: ['Lantern Parade', '🏮', 'Gifts arrive 20% sooner and +15% XP.', { giftSpeed: 1.2, xp: 1.15 }],
  vaultmoth: ['Vault Sense', '🔐', 'Practice bouts pay +3 coins and +10% XP.', { gameCoins: 3, xp: 1.1 }],
  hollowhart: ['Green Path', '🌿', 'Needs fade 15% slower and pets build 15% more bond.', { decay: 0.85, petBond: 1.15 }],
  sparklynx: ['Static Purr', '⚡', 'Games pay +4 coins and joy +10%.', { gameCoins: 4, joy: 1.1 }],
  cometbunny: ['Comet Dash', '💫', 'Trail walks pay +25% coins.', { coins: 1.25 }],
  sundialturtle: ['Sundial', '☀️', 'Needs fade 20% slower.', { needSlow: 0.8 }],
  adminaura: ['Root Access', '🛠️', 'XP +25% and coins +25%.', { xp: 1.25, coins: 1.25 }],
  rootrabbit: ['Sudo Hop', '🐇', 'Every game pays +25 coins.', { gameCoins: 25 }],
  devdrake: ['Hot Reload', '🔥', 'Chats and tasks give +20% XP.', { xp: 1.2 }],
  patchpup: ['Bug Bite', '🐛', 'Feeds give +20% XP and needs fade 10% slower.', { xp: 1.2, needSlow: 0.9 }],
  loglynx: ['Stack Trace', '🔍', 'Gifts arrive 20% sooner and bond +10%.', { giftSpeed: 1.2, bond: 1.1 }],
  cachecat: ['Cache Hit', '💾', 'Check-ins and gifts pay +20% coins.', { coins: 1.2 }],
};

const EVENT_PRICES = {
  meteorpup: 240, auroraowl: 240, confettigoat: 230, cometbunny: 235, sundialturtle: 245,
  festivalfox: 260, vaultmoth: 270, hollowhart: 250, sparklynx: 265,
  adminaura: 400, rootrabbit: 380, devdrake: 390, patchpup: 370, loglynx: 385, cachecat: 395,
};

const EVENT_HOMES = {
  meteorpup: ['ember', 'starlit'], auroraowl: ['starlit', 'skyisles'],
  confettigoat: ['memecore', 'sugar'], cometbunny: ['starlit', 'sakura'],
  sundialturtle: ['grove', 'tide'],
  festivalfox: ['sakura', 'memecore'], vaultmoth: ['cybergrid', 'starlit'],
  hollowhart: ['grove', 'mycelium'], sparklynx: ['neon', 'cybergrid'],
  adminaura: ['cybergrid', 'starlit'], rootrabbit: ['cybergrid', 'mycelium'],
  devdrake: ['cybergrid', 'ember'], patchpup: ['grove', 'cybergrid'],
  loglynx: ['cybergrid', 'night'], cachecat: ['cybergrid', 'neon'],
};

const EVENT_HYBRIDS = {
  'meteorpup+cometbunny': 'Meteor Dash',
  'auroraowl+sundialturtle': 'Polar Noon',
  'confettigoat+cometbunny': 'Party Comet',
  'adminaura+rootrabbit': 'Root Console',
  'devdrake+patchpup': 'Hotfix Pack',
  'loglynx+cachecat': 'Stack Cache',
  'meteorpup+adminaura': 'Deploy Night',
  'confettigoat+patchpup': 'Ship It Party',
  'festivalfox+sparklynx': 'Parade Circuit',
  'vaultmoth+hollowhart': 'Hidden Grove',
  'festivalfox+hollowhart': 'Lantern Path',
  'vaultmoth+sparklynx': 'Live Wire',
};

Object.entries({ ...EVENT_SPECIES, ...ADMIN_SPECIES }).forEach(([key, meta]) => {
  const gene = EVENT_GENES[key] || ['Special Guest', '✨', 'XP +10%.', { xp: 1.1 }];
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
    admin: key in ADMIN_SPECIES,
  };
  GENE_POWERS[key] = { name: gene[0], icon: gene[1], desc: gene[2], effect: gene[3] };
  TITAN_NAMES[key] = `${meta.name} Titan`;
  NAME_START[key] = [meta.name.split(' ')[0], 'Event', 'Weekend', 'Admin', 'Patch', 'Root'];
  TYPE_EGG_BASE_PRICE[key] = EVENT_PRICES[key] || 250;
  TYPE_EGG_PRICE[key] = discountedEggPrice(TYPE_EGG_BASE_PRICE[key]);
  (EVENT_HOMES[key] || ['starlit']).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});

Object.assign(HYBRID_NAMES, EVENT_HYBRIDS);

const EVENT_KEYS = Object.keys(EVENT_SPECIES);
const ADMIN_KEYS = Object.keys(ADMIN_SPECIES);
ELEMENT_KEYS.push(...EVENT_KEYS, ...ADMIN_KEYS);

/* Rotating weekend Admin Event. Runs every Saturday and Sunday. */
const WEEKEND_ADMIN_EVENTS = [
  {
    key: 'root-sprint', name: 'Root Sprint Weekend', icon: '🛠️', color: '#8be9ff',
    blurb: 'The admins open the console for the weekend: bonus XP, extra coins, and an Admin egg.',
    xpMult: 1.4, coins: 320, egg: 'rootrabbit',
  },
  {
    key: 'hotfix-jam', name: 'Hotfix Jam Weekend', icon: '🧩', color: '#8fe07a',
    blurb: 'Patch notes in one paw and a toolbox in the other: double gifts and a special event sprite.',
    xpMult: 1.25, coins: 300, egg: 'patchpup',
  },
  {
    key: 'log-dive', name: 'Log Dive Weekend', icon: '🔍', color: '#b69cff',
    blurb: 'Trace every line with the admins: faster gifts, richer trails, and an Admin egg.',
    xpMult: 1.3, coins: 340, egg: 'loglynx',
  },
  {
    key: 'cache-clear', name: 'Cache Clear Weekend', icon: '💾', color: '#ff9ec7',
    blurb: 'Clear the weekend cache, keep the rewards: extra coins and an event sprite egg.',
    xpMult: 1.35, coins: 330, egg: 'cachecat',
  },
  {
    key: 'ship-weekend', name: 'Ship It Weekend', icon: '🚀', color: '#ffd166',
    blurb: 'The whole admin team deploys at once: big XP, big coins, and an Admin Aura egg.',
    xpMult: 1.5, coins: 400, egg: 'adminaura',
  },
];

function weekendAdminDateKey(date = new Date()) {
  const day = date.getDay();
  const anchor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (day === 0) anchor.setDate(anchor.getDate() - 1);
  if (day !== 0 && day !== 6) return null;
  return `weekend-${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, '0')}-${String(anchor.getDate()).padStart(2, '0')}`;
}

function weekendAdminActive(date = new Date()) {
  return weekendAdminDateKey(date) !== null;
}

function weekendAdminAnchor(date = new Date()) {
  const anchor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (anchor.getDay() === 0) anchor.setDate(anchor.getDate() - 1);
  if (anchor.getDay() !== 6) {
    anchor.setDate(anchor.getDate() + ((6 - anchor.getDay() + 7) % 7));
  }
  return anchor;
}

function weekendAdminEvent(date = new Date()) {
  const index = Math.floor(weekendAdminAnchor(date).getTime() / 86400000);
  return WEEKEND_ADMIN_EVENTS[index % WEEKEND_ADMIN_EVENTS.length] || WEEKEND_ADMIN_EVENTS[0];
}

function weekendAdminXpMult(date = new Date()) {
  if (!weekendAdminActive(date)) return 1;
  return weekendAdminEvent(date).xpMult || 1;
}

function weekendAdminClaimed(date = new Date()) {
  const key = weekendAdminDateKey(date);
  return !!key && state?.weekendGift?.week === key;
}

function weekendAdminEggPool() {
  return [...EVENT_KEYS, ...ADMIN_KEYS].filter((key) => ELEMENTS[key]);
}

/* Extra Admin and special-event additions: registered through the same maps
   as the rest of this wave, so counts, eggs and homes pick them up. */
const EXTRA_EVENT_SPECIES = {
  "adminaegis": {
    "name": "Admin Aegis",
    "primary": "#7fd8ff",
    "light": "#e6f8ff",
    "deep": "#123a4a",
    "accent": "#ffd166",
    "trait": "Shielding — stands between the save file and anything unhandled.",
    "likes": "Star Cookie",
    "blurb": "A floating shield-sprite that guards the console and quietly rolls back a bad afternoon.",
    "greeting": "Nothing got through. Nothing ever gets through.",
    "admin": true,
    "price": 420,
    "homes": [
      "cybergrid",
      "starlit"
    ],
    "titan": "Aegis Console",
    "gene": {
      "name": "Firewall",
      "icon": "🛡️",
      "desc": "Needs fade 20% slower and gifts arrive 15% sooner.",
      "effect": {
        "needSlow": 0.8,
        "giftSpeed": 1.15
      }
    }
  },
  "commitcrow": {
    "name": "Commit Crow",
    "primary": "#5a6a8a",
    "light": "#dbe4f5",
    "deep": "#1d2436",
    "accent": "#8fe07a",
    "trait": "Versioned — narrates every change in one short, tidy line.",
    "likes": "Warm Tea",
    "blurb": "A tidy black bird that keeps the whole Hollow in version control and refuses to commit on a Friday.",
    "greeting": "One logical change. One clear message. That is the whole rule.",
    "admin": true,
    "price": 385,
    "homes": [
      "cybergrid",
      "night"
    ],
    "titan": "Merge Sovereign",
    "gene": {
      "name": "Clean History",
      "icon": "🌿",
      "desc": "Tasks pay +5 coins and +10% XP.",
      "effect": {
        "taskCoins": 5,
        "xp": 1.1
      }
    }
  },
  "scriptsquirrel": {
    "name": "Script Squirrel",
    "primary": "#e0a45a",
    "light": "#fff0d6",
    "deep": "#5a3a12",
    "accent": "#7fd8ff",
    "trait": "Automating — has already done tomorrow’s chores, twice.",
    "likes": "Trail Mix",
    "blurb": "A bushy-tailed squirrel that hoards cron jobs instead of acorns and wakes up before the sun does.",
    "greeting": "It runs at 4am. You do not need to be there. That is the beauty of it.",
    "admin": true,
    "price": 375,
    "homes": [
      "mycelium",
      "cybergrid"
    ],
    "titan": "Daemon Squirrel",
    "gene": {
      "name": "Cron Fluff",
      "icon": "⚙️",
      "desc": "Gifts arrive 25% sooner and checks pay +3 coins.",
      "effect": {
        "giftSpeed": 1.25,
        "checkinCoins": 3
      }
    }
  },
  "uptimeowl": {
    "name": "Uptime Owl",
    "primary": "#b8c6d9",
    "light": "#f2f8ff",
    "deep": "#33404f",
    "accent": "#5ee0a0",
    "trait": "Unblinking — has not missed a night in nine hundred days.",
    "likes": "Moon Berry",
    "blurb": "A night-shift owl with a status page for eyes who only relaxes when everything is green.",
    "greeting": "All systems nominal. Stay a while.",
    "admin": true,
    "price": 400,
    "homes": [
      "night",
      "cybergrid"
    ],
    "titan": "Nines Sovereign",
    "gene": {
      "name": "Five Nines",
      "icon": "🟢",
      "desc": "Night games pay +6 coins and +12% XP.",
      "effect": {
        "nightCoins": 6,
        "xp": 1.12
      }
    }
  },
  "lanternlop": {
    "name": "Lantern Lop",
    "primary": "#ffb35c",
    "light": "#fff2d6",
    "deep": "#6b3a08",
    "accent": "#ff7ac8",
    "trait": "Glowing — carries a paper lantern between its ears.",
    "likes": "Honey Drop",
    "blurb": "A long-eared event rabbit that appears when the lantern parade begins and leaves a warm trail of light.",
    "greeting": "The parade is starting. I brought you a lantern.",
    "admin": false,
    "price": 270,
    "homes": [
      "sakura",
      "starlit"
    ],
    "titan": "Lantern Hare",
    "gene": {
      "name": "Paper Glow",
      "icon": "🏮",
      "desc": "Joy fades 20% slower and gifts arrive 20% sooner.",
      "effect": {
        "joyDecay": 0.8,
        "giftSpeed": 1.2
      }
    }
  },
  "paradepangolin": {
    "name": "Parade Pangolin",
    "primary": "#ffd166",
    "light": "#fff7d6",
    "deep": "#6b4a08",
    "accent": "#5ad6ff",
    "trait": "Sweeping — rolls through the street leaving confetti in its scales.",
    "likes": "Candyfloss",
    "blurb": "A tidy little pangolin with sequinned scales that only unrolls for a festival weekend.",
    "greeting": "Stand back. I am about to make it festive.",
    "admin": false,
    "price": 265,
    "homes": [
      "memecore",
      "sugar"
    ],
    "titan": "Confetti Sovereign",
    "gene": {
      "name": "Scale Shine",
      "icon": "✨",
      "desc": "Coins +15% and joy +12%.",
      "effect": {
        "coins": 1.15,
        "joy": 1.12
      }
    }
  },
  "fireworkferret": {
    "name": "Firework Ferret",
    "primary": "#ff7a8a",
    "light": "#ffe0e6",
    "deep": "#5a1420",
    "accent": "#ffd166",
    "trait": "Sparkling — every sneeze is a small, beautiful explosion.",
    "likes": "Berry Fizz",
    "blurb": "A long event ferret with a sparkler tail that shows up for the closing night and stays for the clean-up.",
    "greeting": "Cover your ears. This one is going to be good.",
    "admin": false,
    "price": 275,
    "homes": [
      "ember",
      "starlit"
    ],
    "titan": "Firework Ferret Prime",
    "gene": {
      "name": "Spark Tail",
      "icon": "🎆",
      "desc": "Games pay +5 coins and joy +10%.",
      "effect": {
        "gameCoins": 5,
        "joy": 1.1
      }
    }
  },
  "masquerademink": {
    "name": "Masquerade Mink",
    "primary": "#b69cff",
    "light": "#f0e9ff",
    "deep": "#33204a",
    "accent": "#ffd166",
    "trait": "Mysterious — wears a mask and refuses to confirm it is the same mink.",
    "likes": "Moon Cake",
    "blurb": "A masked event mink that arrives for the masquerade, bows once, and is gone before the last dance.",
    "greeting": "We have met. You simply do not remember it.",
    "admin": false,
    "price": 285,
    "homes": [
      "dream",
      "sakura"
    ],
    "titan": "Masque Sovereign",
    "gene": {
      "name": "Velvet Mask",
      "icon": "🎭",
      "desc": "Chats pay +5 coins and petting builds +20% bond.",
      "effect": {
        "chatCoins": 5,
        "petBond": 1.2
      }
    }
  }
};

Object.entries(EXTRA_EVENT_SPECIES).forEach(([key, meta]) => {
  ELEMENTS[key] = {
    name: meta.name, primary: meta.primary, light: meta.light, deep: meta.deep,
    accent: meta.accent, trait: meta.trait, blurb: meta.blurb, greeting: meta.greeting,
    likes: meta.likes, eventOnly: true, admin: !!meta.admin,
  };
  GENE_POWERS[key] = meta.gene;
  TITAN_NAMES[key] = meta.titan;
  NAME_START[key] = [meta.name.split(' ')[0], 'Event', 'Weekend', 'Admin', 'Patch', 'Root'];
  TYPE_EGG_BASE_PRICE[key] = meta.price;
  TYPE_EGG_PRICE[key] = discountedEggPrice(meta.price);
  meta.homes.forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
  (meta.admin ? ADMIN_KEYS : EVENT_KEYS).push(key);
  ELEMENT_KEYS.push(key);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
  /* Event and admin arrivals stay out of the wild pool, exactly like the rest
     of the event wave; they come from event eggs and rewards instead. */
});

/* Named hybrids for the extra event and admin arrivals, paired with the event
   wave's established species so they crossbreed like the rest of the roster. */
const EXTRA_EVENT_HYBRIDS = {
  'adminaegis+adminaura': 'Console Aegis',
  'commitcrow+cachecat': 'Commit Cache',
  'scriptsquirrel+rootrabbit': 'Script Root',
  'uptimeowl+auroraowl': 'Always Online',
  'lanternlop+festivalfox': 'Lantern Parade',
  'paradepangolin+confettigoat': 'Parade Confetti',
  'fireworkferret+sparklynx': 'Firework Spark',
  'masquerademink+hollowhart': 'Masquerade Heart',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, EXTRA_EVENT_HYBRIDS);
