/* Screen wave: twelve species drawn from cartoons, sitcoms, dramas,
   superhero shows, movies and retro cartridges. Each one gets original
   procedural art from its palette, a gene power, a Titan name and an egg. */

const SCREEN_WAVE_SPECIES = {
  toonster: {
    name: 'Toonster', primary: '#ff8f6b', light: '#ffd9c9', deep: '#8a2f13', accent: '#ffd166',
    trait: 'Bouncy — has never obeyed the laws of physics and does not plan to start.',
    blurb: 'A rubber-limbed cartoon critter who pulls anvils out of nowhere and springs straight back up.',
    greeting: 'Boing! Did somebody say snack break?', likes: 'Star Cookie',
    gene: ['Squash & Stretch', '🎈', '+12% XP from play.', { xp: 1.12 }],
  },
  gaggle: {
    name: 'Gaggle Gag', primary: '#ffd166', light: '#fff3c4', deep: '#7a5300', accent: '#ff9ec7',
    trait: 'Jokey — cannot let a quiet moment go unpunished.',
    blurb: 'A feathery comedian who delivers a punchline, pauses for a laugh track that never comes, and continues anyway.',
    greeting: 'Okay okay — a sprite walks into a bakery...', likes: 'Honeycomb Cake',
    gene: ['Rimshot', '🥁', '+10% bond from gifts.', { bond: 1.1 }],
  },
  primetime: {
    name: 'Prime Time', primary: '#8b7bff', light: '#ddd6ff', deep: '#2f2470', accent: '#ffd166',
    trait: 'Dramatic — every snack is a season finale.',
    blurb: 'A brooding, well-dressed sprite with a slow piano theme following it around the Hollow.',
    greeting: 'You came back. Nobody ever comes back.', likes: 'Warm Milk',
    gene: ['Cliffhanger', '📺', '+15% coins from quests.', { coins: 1.15 }],
  },
  pixelknight: {
    name: 'Pixel Knight', primary: '#6ee7a8', light: '#d4ffe8', deep: '#155c39', accent: '#8be9ff',
    trait: 'Blocky — moves in four directions and refuses to acknowledge diagonals.',
    blurb: 'A 16-bit knight who still patrols a castle that was deleted three decades ago.',
    greeting: 'PRESS START. ...Thank you. The castle is safe.', likes: 'Berry Fizz',
    gene: ['Extra Life', '💚', '+8% energy recovery.', { energy: 1.08 }],
  },
  capecrash: {
    name: 'Cape Crasher', primary: '#f45b69', light: '#ffd2d6', deep: '#7a1522', accent: '#ffd166',
    trait: 'Heroic — saves the day first and asks what happened later.',
    blurb: 'A cape-wearing sprite with a heroic landing and absolutely no plan for getting back up.',
    greeting: 'Never fear! I have arrived. Somewhere. Probably.', likes: 'Candy Apple',
    gene: ['Hero Landing', '🦸', '+12% XP from care.', { xp: 1.12 }],
  },
  celshade: {
    name: 'Cel Shade', primary: '#8be9ff', light: '#e6fbff', deep: '#1d5568', accent: '#c084fc',
    trait: 'Stylised — outlined in ink and lit by a sun that only exists in the drawing.',
    blurb: 'A hand-drawn sprite whose shading arrives one flat colour at a time, always slightly late.',
    greeting: 'Give me a moment — my outline is still loading.', likes: 'Star Pop',
    gene: ['Ink Lines', '🖊️', '+10% feathers and scales.', { feathers: 1.1 }],
  },
  reelranger: {
    name: 'Reel Ranger', primary: '#c9a227', light: '#ffeeb8', deep: '#5c4700', accent: '#ff8f6b',
    trait: 'Cinematic — narrates its own life in trailer voice.',
    blurb: 'A dusty ranger who rides in on a projector beam and leaves on a slow fade to black.',
    greeting: 'In a world... one sprite needed a nap.', likes: 'Honeycomb Cake',
    gene: ['Montage', '🎬', '+14% quest rewards.', { quest: 1.14 }],
  },
  binge: {
    name: 'Binge Bug', primary: '#b06bff', light: '#e9d8ff', deep: '#3d1670', accent: '#7ee787',
    trait: 'Insatiable — one more episode has never once been true.',
    blurb: 'A sleepy little bug who has watched eleven seasons standing up and will not sit down.',
    greeting: 'Just one more. Then I will sleep. Probably.', likes: 'Warm Milk',
    gene: ['Autoplay', '⏭️', '+10% XP from rest.', { xp: 1.1 }],
  },
  cartkid: {
    name: 'Cartridge Kid', primary: '#ffb347', light: '#ffe3bd', deep: '#7a4400', accent: '#8be9ff',
    trait: 'Blowy — the only way to make it work is to blow on it.',
    blurb: 'A chunky little sprite that rattles when picked up and boots with a cheerful jingle.',
    greeting: 'Insert coin. Or a snack. Either works.', likes: 'Star Cookie',
    gene: ['Save Slot', '💾', '+12% coins from care.', { coins: 1.12 }],
  },
  laughtrack: {
    name: 'Laugh Track', primary: '#ff9ec7', light: '#ffe3ef', deep: '#8a2450', accent: '#ffd166',
    trait: 'Canned — laughs on cue, whether or not anything happened.',
    blurb: 'A studio-audience sprite that lives in the walls of a very old living room set.',
    greeting: 'Ha. Ha ha. Ha. (That was my cue.)', likes: 'Berry Fizz',
    gene: ['Cue Card', '📇', '+8% gift chance.', { gift: 1.08 }],
  },
  serialsleuth: {
    name: 'Serial Sleuth', primary: '#5b7c99', light: '#cfdded', deep: '#22384b', accent: '#ffd166',
    trait: 'Observant — notices the one detail everyone else needed.',
    blurb: 'A raincoat-wearing sprite with a notebook full of clues and a case that keeps reopening.',
    greeting: 'The mud on your boot. The cookie in your hand. I have questions.', likes: 'Honeycomb Cake',
    gene: ['Cold Case', '🔍', '+15% egg find chance.', { egg: 1.15 }],
  },
  arcadeghost: {
    name: 'Arcade Ghost', primary: '#7ee787', light: '#d9ffe0', deep: '#14512a', accent: '#c084fc',
    trait: 'Haunted — lives in the high-score table and refuses to be beaten.',
    blurb: 'A glowing ghost that flickers between cabinets, still guarding a score nobody can read.',
    greeting: 'You beat my record? ...We will see.', likes: 'Star Pop',
    gene: ['High Score', '👾', '+10% arcade coins.', { arcade: 1.1 }],
  },
};

/* Two homes per species, same as the other waves, so a screen sprite turns up
   in the wild where its theme reads: arcade cabinets, moon hollows, ovens. */
const SCREEN_WAVE_HOMES = {
  toonster: ['memecore', 'neon'],
  gaggle: ['memecore', 'sugar'],
  primetime: ['memecore', 'night'],
  pixelknight: ['memecore', 'neon'],
  capecrash: ['memecore', 'neon'],
  celshade: ['memecore', 'dream'],
  reelranger: ['memecore', 'grove'],
  binge: ['memecore', 'dream'],
  cartkid: ['memecore', 'neon'],
  laughtrack: ['memecore', 'sugar'],
  serialsleuth: ['memecore', 'night'],
  arcadeghost: ['memecore', 'neon'],
};

/* Named hybrids: six pairs inside the screen wave plus six that cross it with
   the retro, showcase and classic waves, so these sprites breed into the rest
   of the roster instead of only among themselves. */
const SCREEN_WAVE_HYBRIDS = {
  'toonster+gaggle': 'Toon Gag',
  'primetime+celshade': 'Prime Ink',
  'pixelknight+cartkid': 'Cartridge Knight',
  'capecrash+reelranger': 'Cape Reel',
  'binge+laughtrack': 'Binge Track',
  'serialsleuth+arcadeghost': 'Sleuth Score',
  'toonster+toonanvil': 'Anvil Toon',
  'gaggle+sitcomcat': 'Canned Gag',
  'primetime+wednesday': 'Prime Deadpan',
  'pixelknight+pixelinvader': 'Pixel Squire',
  'capecrash+bossrushbear': 'Cape Boss',
  'reelranger+mando': 'Reel Way',
};

if (typeof ELEMENTS !== 'undefined') {
  const keys = Object.keys(SCREEN_WAVE_SPECIES);
  keys.forEach((key) => {
    const meta = SCREEN_WAVE_SPECIES[key];
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
      NAME_START[key] = [meta.name.split(' ')[0], 'Toon', 'Prime', 'Retro', 'Reel', 'Binge'];
    }
    if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[key] = 140;
    if (typeof TYPE_EGG_PRICE !== 'undefined' && typeof discountedEggPrice === 'function') {
      TYPE_EGG_PRICE[key] = discountedEggPrice(140);
    }
    if (typeof SCENES !== 'undefined') {
      (SCREEN_WAVE_HOMES[key] || ['memecore']).forEach((scene) => {
        if (SCENES[scene] && Array.isArray(SCENES[scene].species) && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
      });
    }
  });
  if (typeof ELEMENT_KEYS !== 'undefined') ELEMENT_KEYS.push(...keys);
  keys.forEach((key) => {
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
  });
  if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, SCREEN_WAVE_HYBRIDS);
}
