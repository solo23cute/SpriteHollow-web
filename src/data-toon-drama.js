/* Toon & drama wave: classic cartoon and television archetypes, each with a
   palette, gene, Titan and a home scene built around its genre. */

const TOON_DRAMA_SPECIES = {
  rubberhose: {
    name: 'Rubberhose', primary: '#1b1b1b', light: '#f5f5f5', deep: '#000000', accent: '#ffd166',
    trait: 'Elastic — bends around corners and snaps back with a whistle.',
    blurb: 'A black-and-white cartoon with noodle arms, pie-cut eyes and an inexplicable pair of gloves.',
    greeting: 'Boop! Careful, my arms are longer than they look.', likes: 'Star Cookie',
    gene: ['Slapstick', '🥧', '+12% XP from play.', { xp: 1.12 }],
  },
  pieeye: {
    name: 'Pie-Eye', primary: '#ffe1c4', light: '#fff7ef', deep: '#8a5a3a', accent: '#ff7a3c',
    trait: 'Bright-eyed — everything is the most exciting thing that has ever happened.',
    blurb: 'A cheerful toon whose enormous eyes take up half its face and all of its expression.',
    greeting: 'Oh boy oh boy oh boy! What are we doing?', likes: 'Cereal Bowl',
    gene: ['Goggle Eyes', '👀', '+10% gift chance.', { gift: 1.1 }],
  },
  slapstick: {
    name: 'Slapstick', primary: '#ff8f6b', light: '#ffd9c9', deep: '#7a2a12', accent: '#8be9ff',
    trait: 'Chaotic — owns one anvil and uses it socially.',
    blurb: 'A comedy toon that falls down stairs on purpose and takes a bow at the bottom.',
    greeting: 'Watch this! ...Okay, that one hurt.', likes: 'Candy Apple',
    gene: ['Anvil Drop', '🪨', '+15% coins from games.', { coins: 1.15 }],
  },
  cerealmascot: {
    name: 'Cereal Mascot', primary: '#ffd166', light: '#fff3c4', deep: '#7a5300', accent: '#7ee787',
    trait: 'Branded — has a catchphrase and will use it every single morning.',
    blurb: 'A bouncing breakfast-cereal cartoon that arrives with a jingle and a bowl already poured.',
    greeting: 'Part of a balanced breakfast! Me. I am the breakfast.', likes: 'Honeycomb Cake',
    gene: ['Sugar Rush', '🥣', '+12% energy recovery.', { energy: 1.12 }],
  },
  toonvillain: {
    name: 'Toon Villain', primary: '#8b2a52', light: '#ffb3d1', deep: '#3d0f22', accent: '#ffd166',
    trait: 'Theatrical — monologues long enough for the hero to escape.',
    blurb: 'A moustache-twirling cartoon schemer who loses every plan in the last thirty seconds.',
    greeting: 'You have not seen the last of me! ...I will be in the hallway.', likes: 'Berry Fizz',
    gene: ['Evil Laugh', '😈', '+14% quest rewards.', { quest: 1.14 }],
  },
  sitcomdad: {
    name: 'Sitcom Dad', primary: '#5b7c99', light: '#cfdded', deep: '#22384b', accent: '#ffd166',
    trait: 'Well-meaning — solves every problem with a short speech and a hug.',
    blurb: 'A cardigan-wearing television father with a laugh track and a lesson for every episode.',
    greeting: 'Gather round, everybody. I have learned something today.', likes: 'Warm Milk',
    gene: ['Very Special Episode', '📺', '+12% bond from care.', { bond: 1.12 }],
  },
  sitcomroomie: {
    name: 'Sitcom Roommate', primary: '#b06bff', light: '#e9d8ff', deep: '#3d1670', accent: '#7ee787',
    trait: 'Unreliable — eats the leftovers and denies it while holding the fork.',
    blurb: 'A chaotic roommate who leaves the fridge open and delivers a punchline in the doorway.',
    greeting: 'I did not eat your cake. The cake ate itself.', likes: 'Pizza Slice',
    gene: ['Running Gag', '🎭', '+10% XP from rest.', { xp: 1.1 }],
  },
  soapbaron: {
    name: 'Soap Baron', primary: '#c9a227', light: '#ffeeb8', deep: '#5c4700', accent: '#ff8fc8',
    trait: 'Melodramatic — every family dinner is a three-part event.',
    blurb: 'A slow-panning soap-opera magnate with a secret twin and a very long-lost will.',
    greeting: 'There is something I must tell you. But first — a close-up.', likes: 'Star Pop',
    gene: ['Cliffhanger', '🫧', '+13% coin gifts.', { coins: 1.13 }],
  },
  telenovela: {
    name: 'Telenovela Star', primary: '#ff5e8a', light: '#ffd2dd', deep: '#7a1430', accent: '#ffd166',
    trait: 'Passionate — whispers, then shouts, then faints on a chaise.',
    blurb: 'A dramatic star who has been betrayed at least twice this week, possibly by the same twin.',
    greeting: 'Mi amor! You came back... for the snack, I know.', likes: 'Candy Apple',
    gene: ['Slow Zoom', '🎬', '+12% egg find chance.', { egg: 1.12 }],
  },
  primedoctor: {
    name: 'Prime Doctor', primary: '#6ee7a8', light: '#d4ffe8', deep: '#155c39', accent: '#8be9ff',
    trait: 'Steady — delivers the diagnosis while walking very fast down a hallway.',
    blurb: 'A television physician with perfect hair, a clipboard, and an unshakable bedside manner.',
    greeting: 'It is not good. But it is not the worst I have seen this week.', likes: 'Warm Milk',
    gene: ['Second Opinion', '🩺', '+12% feathers and scales.', { feathers: 1.12 }],
  },
  courtqueen: {
    name: 'Courtroom Queen', primary: '#c084fc', light: '#f0e2ff', deep: '#4b1f70', accent: '#ffd166',
    trait: 'Unstoppable — cross-examines the snack table itself.',
    blurb: 'A courtroom drama icon who wins the case in the last four minutes of every episode.',
    greeting: 'Objection. To the empty bowl. Sustained.', likes: 'Honeycomb Cake',
    gene: ['Sustained', '⚖️', '+15% coins from quests.', { coins: 1.15 }],
  },
  noirdetective: {
    name: 'Noir Detective', primary: '#4a5568', light: '#cbd5e0', deep: '#1a202c', accent: '#ffd166',
    trait: 'Weathered — narrates his own life and it is always raining.',
    blurb: 'A rainy-street detective in a long coat, three forms of evidence, one very cold cup of coffee.',
    greeting: 'The Hollow is quiet tonight. Too quiet for a Tuesday.', likes: 'Trail Mix',
    gene: ['Hard Boiled', '🕵️', '+14% coins from games.', { coins: 1.14 }],
  },
};

const TOON_DRAMA_SCENES = {
  toontown: {
    name: 'Toon Town', habitat: 'Cartoon', emoji: '🎨', bonus: 0.45,
    blurb: 'A wobbling little town of ink outlines, rubber doorways and a permanent sound effect.',
    tint: { b1: '#ff8f6b', b2: '#47182a', b3: '#ffd166' },
    species: ['rubberhose', 'pieeye', 'slapstick', 'cerealmascot', 'toonvillain', 'toonster'],
  },
  primestudio: {
    name: 'Prime Studio', habitat: 'Soundstage', emoji: '🎬', bonus: 0.45,
    blurb: 'A warm old television studio with a laugh track, three cameras and a very long sofa.',
    tint: { b1: '#c9a227', b2: '#3d2a12', b3: '#ff9ec7' },
    species: ['sitcomdad', 'sitcomroomie', 'soapbaron', 'telenovela', 'laughtrack'],
  },
  dramalane: {
    name: 'Drama Lane', habitat: 'Soundstage', emoji: '🎭', bonus: 0.45,
    blurb: 'A rain-slicked street set where every doorway hides a diagnosis and a closing argument.',
    tint: { b1: '#4a5568', b2: '#111827', b3: '#8be9ff' },
    species: ['primedoctor', 'courtqueen', 'noirdetective', 'serialsleuth'],
  },
};

/* A second home for each toon so it also turns up outside its genre set. */
const TOON_DRAMA_HOMES = {
  rubberhose: ['memecore'], pieeye: ['sugar'], slapstick: ['neon'],
  cerealmascot: ['sugar'], toonvillain: ['night'], sitcomdad: ['memecore'],
  sitcomroomie: ['memecore'], soapbaron: ['night'], telenovela: ['sugar'],
  primedoctor: ['memecore'], courtqueen: ['night'], noirdetective: ['night'],
};

/* Named hybrids that cross the toon wave into the screen, retro and showcase
   waves, so these sprites breed into the wider roster. */
const TOON_DRAMA_HYBRIDS = {
  'pieeye+toonster': 'Pie Toon',
  'slapstick+toonanvil': 'Anvil Slap',
  'cerealmascot+sitcomcat': 'Cereal Sitcom',
  'toonvillain+starscout': 'Villain Star',
  'sitcomdad+primetime': 'Prime Dad',
  'sitcomroomie+binge': 'Roomie Binge',
  'soapbaron+reelranger': 'Soap Reel',
  'telenovela+gaggle': 'Telenovela Gag',
  'primedoctor+serialsleuth': 'Prime Sleuth',
  'courtqueen+wednesday': 'Court Deadpan',
  'noirdetective+serialsleuth': 'Noir Sleuth',
};

if (typeof ELEMENTS !== 'undefined') {
  const keys = Object.keys(TOON_DRAMA_SPECIES);
  keys.forEach((key) => {
    const meta = TOON_DRAMA_SPECIES[key];
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
      screen: true,
    };
    if (typeof GENE_POWERS !== 'undefined' && meta.gene) {
      GENE_POWERS[key] = { name: meta.gene[0], icon: meta.gene[1], desc: meta.gene[2], effect: meta.gene[3] };
    }
    if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[key] = `${meta.name} Titan`;
    if (typeof NAME_START !== 'undefined') {
      NAME_START[key] = [meta.name.split(' ')[0], 'Toon', 'Prime', 'Studio', 'Reel', 'Noir'];
    }
    if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[key] = 150;
    if (typeof TYPE_EGG_PRICE !== 'undefined' && typeof discountedEggPrice === 'function') {
      TYPE_EGG_PRICE[key] = discountedEggPrice(150);
    }
  });
  if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...keys);

  if (typeof SCENES !== 'undefined' && typeof SCENE_KEYS !== 'undefined') {
    Object.entries(TOON_DRAMA_SCENES).forEach(([sceneKey, def]) => {
      if (SCENES[sceneKey]) return;
      SCENES[sceneKey] = {
        name: def.name,
        habitat: def.habitat,
        emoji: def.emoji,
        bonus: def.bonus,
        blurb: def.blurb,
        unlocked: false,
        worldHabitat: true,
        tint: def.tint,
        species: def.species.filter((k) => ELEMENTS[k]),
      };
      SCENE_KEYS.push(sceneKey);
    });
  }

  keys.forEach((key) => {
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
    if (typeof SCENES !== 'undefined') {
      (TOON_DRAMA_HOMES[key] || []).forEach((scene) => {
        if (SCENES[scene] && Array.isArray(SCENES[scene].species) && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
      });
    }
  });
  if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, TOON_DRAMA_HYBRIDS);
}

/* ---------- unlock conditions for the three new homes ---------- */

const TOON_DRAMA_UNLOCKS = {
  toontown: { name: 'Toon Town', need: 2, hint: 'cartoon species', species: ['rubberhose', 'pieeye', 'slapstick', 'cerealmascot', 'toonvillain', 'toonster'] },
  primestudio: { name: 'Prime Studio', need: 2, hint: 'sitcom or soap species', species: ['sitcomdad', 'sitcomroomie', 'soapbaron', 'telenovela', 'laughtrack'] },
  dramalane: { name: 'Drama Lane', need: 2, hint: 'drama species', species: ['primedoctor', 'courtqueen', 'noirdetective', 'serialsleuth'] },
};

function sceneUnlockProgress(key) {
  const def = TOON_DRAMA_UNLOCKS[key];
  if (!def) return null;
  const owned = new Set((state.sprites || []).map((s) => s.element));
  const have = def.species.filter((k) => owned.has(k)).length;
  return { name: def.name, have, need: def.need, hint: def.hint, met: have >= def.need };
}

function tryUnlockScene(key) {
  const progress = sceneUnlockProgress(key);
  if (!progress) return { ok: false, reason: 'unknown' };
  if (!progress.met) return { ok: false, reason: 'locked', progress };
  state.unlockedScenes = Array.from(new Set([...(state.unlockedScenes || []), key]));
  if (typeof saveState === 'function') saveState();
  return { ok: true, progress };
}
