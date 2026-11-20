/* Elemental Puffle types: every painted form from the elemental atlas becomes a
   playable species with its own type egg, gene, titan, habitat and eyes.

   The palettes are not repeated here — src/lumi-elements.js is the single source
   of truth for the painted colours, so each species reads its hexes from the
   roster and carries the matching puffle style (`el_<key>`), which is what gives
   it the eyes painted on the reference sheet. */

const PUFFLE_TYPE_SPECIES = [
  {
    roster: 'ember', price: 190, habitats: ['ember', 'grove'], likes: 'Ember Steak',
    trait: 'Cinderfur — warms the whole nest just by sitting in it.',
    blurb: 'A fire-puff with ember whiskers and a habit of sneezing sparks when it gets excited.',
    greeting: 'I am warm. Come be warm too.',
    gene: { name: 'Cinder Coat', icon: '🔥', desc: 'Games pay +3 coins and pets build +10% bond.', effect: { gameCoins: 3, petBond: 1.1 } },
    titan: 'Cinder Crown Warden',
  },
  {
    roster: 'bloom', price: 165, habitats: ['grove', 'mycelium'], likes: 'Moon Berry',
    trait: 'Petal Fur — grows a new leaf wherever it naps.',
    blurb: 'A meadow puff with flowers braided into its crest and a little dirt on every paw.',
    greeting: 'I brought you a flower. It was on my head.',
    gene: { name: 'Spring Bloom', icon: '🌸', desc: 'XP gains +12% and joy fades 10% slower.', effect: { xp: 1.12, joyMod: 0.9 } },
    titan: 'Blossomheart Guardian',
  },
  {
    roster: 'tideflit', price: 170, habitats: ['tide', 'crystal'], likes: 'Coconut Water',
    trait: 'Tidebound — never quite dries off.',
    blurb: 'A wave puff with fins for ears and a trail of bubbles wherever it swims.',
    greeting: 'The puddle missed you. So did I.',
    gene: { name: 'Riptide', icon: '🌊', desc: 'Games pay +3 coins and needs fade 8% slower.', effect: { gameCoins: 3, needSlow: 0.92 } },
    titan: 'Tidelight Sovereign',
  },
  {
    roster: 'whisp', price: 150, habitats: ['aurora', 'grove'], likes: 'Cloud Feast',
    trait: 'Drifting — floats three centimetres above the floor.',
    blurb: 'A cloud puff spun from warm wind and impossibly soft white fur.',
    greeting: 'I followed a breeze. It was yours.',
    gene: { name: 'Fair Wind', icon: '🍃', desc: 'Gifts arrive 15% sooner and XP gains +10%.', effect: { giftSpeed: 1.15, xp: 1.1 } },
    titan: 'Highwind Whisperer',
  },
  {
    roster: 'volt', price: 175, habitats: ['ember', 'aurora'], likes: 'Star Pop',
    trait: 'Charged — static makes its fur stand up when it is happy.',
    blurb: 'A spark puff with lightning for whiskers and absolutely no indoor voice.',
    greeting: 'I have SO much energy and it is all for you!',
    gene: { name: 'Live Wire', icon: '⚡', desc: 'Games pay +4 coins and night games pay +2.', effect: { gameCoins: 4, nightCoins: 2 } },
    titan: 'Stormspark Warden',
  },
  {
    roster: 'frost', price: 175, habitats: ['frost', 'aurora'], likes: 'Warm Soup',
    trait: 'Rimefur — leaves little frost prints behind.',
    blurb: 'An ice puff with crystal shards for a crest and famously cold paws.',
    greeting: 'Hold still. I made you a snowflake.',
    gene: { name: 'Deep Freeze', icon: '❄️', desc: 'Needs fade 15% slower and pets build +15% bond.', effect: { needSlow: 0.85, petBond: 1.15 } },
    titan: 'Winterlight Sovereign',
  },
  {
    roster: 'terra', price: 150, habitats: ['grove', 'savanna'], likes: 'Warm Soup',
    trait: 'Mossback — collects pebbles in its fur and knows each one.',
    blurb: 'A stone-soft earth puff with a leaf sprout and stubborn little feet.',
    greeting: 'I found a rock. It is the best rock.',
    gene: { name: 'Bedrock', icon: '🪨', desc: 'Energy fades 20% slower and games pay +2.', effect: { energyDecay: 0.8, gameCoins: 2 } },
    titan: 'Deeproot Colossus',
  },
  {
    roster: 'venom', price: 195, habitats: ['mycelium', 'grove'], likes: 'Moon Cake',
    trait: 'Toxic Tuft — smells faintly of green apples and danger.',
    blurb: 'A violet poison puff with spore blossoms in its fur and a very proud grin.',
    greeting: 'Do not lick me. I am serious. Please.',
    gene: { name: 'Spore Cloud', icon: '☠️', desc: 'Chats pay +2 coins and joy fades 15% slower.', effect: { chatCoins: 2, joyMod: 0.85 } },
    titan: 'Bloombane Sovereign',
  },
  {
    roster: 'alloy', price: 195, habitats: ['crystal', 'frost'], likes: 'Honeycomb Cake',
    trait: 'Chromecoat — fur clinks when it runs.',
    blurb: 'A steel puff with plated ears and a shine that never dulls.',
    greeting: 'I am polished. You are welcome to look.',
    gene: { name: 'Hard Shell', icon: '🛡️', desc: 'Energy fades 25% slower and games pay +2.', effect: { energyDecay: 0.75, gameCoins: 2 } },
    titan: 'Forgeheart Sentinel',
  },
  {
    roster: 'shadow', price: 240, habitats: ['night', 'dream'], likes: 'Warm Soup',
    trait: 'Umbrafur — dims the lamp it naps beside.',
    blurb: 'A dusk-dark puff with magenta fire in its eyes and a shadow a second behind it.',
    greeting: 'I am not hiding. I am being mysterious.',
    gene: { name: 'Nightfall', icon: '🌑', desc: 'Night games pay +5 coins and XP gains +8%.', effect: { nightCoins: 5, xp: 1.08 } },
    titan: 'Eclipseborn Warden',
  },
  {
    roster: 'celestial', price: 250, habitats: ['aurora', 'starlit'], likes: 'Cloud Feast',
    trait: 'Halo Fur — glows brighter when someone is kind to it.',
    blurb: 'A dawn-white puff with feathered ears and a ring of soft light.',
    greeting: 'You are doing better than you think.',
    gene: { name: 'Blessing', icon: '✨', desc: 'Games pay +3 coins and bond grows 20% faster.', effect: { gameCoins: 3, bond: 1.2 } },
    titan: 'Dawnsong Archon',
  },
  {
    roster: 'mystic', price: 210, habitats: ['crystal', 'dream'], likes: 'Moon Cake',
    trait: 'Rune Fur — the sigils in its coat rearrange when it reads.',
    blurb: 'A violet arcane puff with glowing marks circling its crest.',
    greeting: 'I read your future. It has snacks in it.',
    gene: { name: 'Sigilcraft', icon: '🔮', desc: 'XP gains +15% and chats pay +1 coin.', effect: { xp: 1.15, chatCoins: 1 } },
    titan: 'Runeweaver Prime',
  },
  {
    roster: 'spirit', price: 200, habitats: ['night', 'dream'], likes: 'Warm Soup',
    trait: 'Half Here — fades at the edges when startled.',
    blurb: 'A gentle ghost puff, pale as moonlight, who drifts through walls very politely.',
    greeting: 'Boo. Sorry. Force of habit.',
    gene: { name: 'Phase Step', icon: '👻', desc: 'Pets build +30% bond and needs fade 10% slower.', effect: { petBond: 1.3, needSlow: 0.9 } },
    titan: 'Hollowveil Warden',
  },
  {
    roster: 'crystal', price: 215, habitats: ['crystal', 'dream'], likes: 'Star Cookie',
    trait: 'Shardcoat — its fur chimes in a light wind.',
    blurb: 'A glass-bright puff with crystal leaves and a rainbow caught inside it.',
    greeting: 'I am mostly sparkle. Some fur.',
    gene: { name: 'Prism Hide', icon: '💎', desc: 'Games pay +3 coins and gifts arrive 15% sooner.', effect: { gameCoins: 3, giftSpeed: 1.15 } },
    titan: 'Prismheart Sovereign',
  },
  {
    roster: 'storm', price: 205, habitats: ['aurora', 'ember'], likes: 'Trail Mix',
    trait: 'Thunderfur — rumbles when it purrs.',
    blurb: 'A storm-blue puff with a crackling crest and one small cloud that follows it',
    greeting: 'It might rain. That is my fault.',
    gene: { name: 'Stormhead', icon: '⛈️', desc: 'Night games pay +4 coins and joy fades 10% slower.', effect: { nightCoins: 4, joyMod: 0.9 } },
    titan: 'Tempest Crown Warden',
  },
  {
    roster: 'lunar', price: 200, habitats: ['night', 'dream'], likes: 'Moon Berry',
    trait: 'Moonfur — sleeps through the day and hums at night.',
    blurb: 'A silver-lit puff wearing a crescent of moonlight and a very sleepy face.',
    greeting: 'The moon says hello. I am translating.',
    gene: { name: 'Moon Tide', icon: '🌙', desc: 'Night games pay +5 coins and energy fades 15% slower.', effect: { nightCoins: 5, energyDecay: 0.85 } },
    titan: 'Crescent Sovereign',
  },
  {
    roster: 'solar', price: 205, habitats: ['ember', 'savanna'], likes: 'Sun Nectar',
    trait: 'Suncoat — warm enough to dry a towel.',
    blurb: 'A golden puff with a halo of sunrays and an infectious grin.',
    greeting: 'Good morning! It is always morning somewhere.',
    gene: { name: 'Daybreak', icon: '🌞', desc: 'Day games pay +5 coins and XP gains +8%.', effect: { dayCoins: 5, xp: 1.08 } },
    titan: 'Sunhalo Emperor',
  },
  {
    roster: 'floral', price: 160, habitats: ['grove', 'sugar'], likes: 'Honey Drop',
    trait: 'Petalpuff — drops blossom wherever it walks.',
    blurb: 'A pink flower puff with a crown of cherry blossoms and very proud petals.',
    greeting: 'Do you like my petals? I grew them myself.',
    gene: { name: 'Petalfall', icon: '🌺', desc: 'Pets build +20% bond and joy fades 10% slower.', effect: { petBond: 1.2, joyMod: 0.9 } },
    titan: 'Blossomcrown Lady',
  },
  {
    roster: 'sand', price: 145, habitats: ['savanna', 'ember'], likes: 'Coconut Water',
    trait: 'Dunefur — never carries sand home. Somehow.',
    blurb: 'A warm tan puff with sun-bleached fur and a cactus sprout for a crest.',
    greeting: 'It is warm. Sit. Drink something.',
    gene: { name: 'Desert Bloom', icon: '🌵', desc: 'Energy fades 20% slower and games pay +3.', effect: { energyDecay: 0.8, gameCoins: 3 } },
    titan: 'Dunelord Sentinel',
  },
  {
    roster: 'magma', price: 220, habitats: ['ember', 'crystal'], likes: 'Ember Steak',
    trait: 'Embercore — its paws are always warm, never hot.',
    blurb: 'A lava puff stitched with cooling cracks of orange light.',
    greeting: 'I am cooled off. Mostly. Hug carefully.',
    gene: { name: 'Volcanic', icon: '🌋', desc: 'Games pay +4 coins and XP gains +8%.', effect: { gameCoins: 4, xp: 1.08 } },
    titan: 'Cinderforge Titan',
  },
  {
    roster: 'cosmic', price: 240, habitats: ['night', 'starlit'], likes: 'Star Pop',
    trait: 'Starfur — constellations move slowly across its back.',
    blurb: 'A night-sky puff with a nebula in its fur and stars for freckles.',
    greeting: 'You are made of the same stuff as the stars. I checked.',
    gene: { name: 'Stardust', icon: '🌌', desc: 'XP gains +18% and gifts arrive 10% sooner.', effect: { xp: 1.18, giftSpeed: 1.1 } },
    titan: 'Voidlight Emperor',
  },
  {
    roster: 'time', price: 230, habitats: ['crystal', 'sugar'], likes: 'Honeycomb Cake',
    trait: 'Clockfur — always exactly on time, even when it is late.',
    blurb: 'A brass-and-cream puff with a pocket watch ticking in its chest.',
    greeting: 'You are right on time. You always are.',
    gene: { name: 'Second Wind', icon: '⏳', desc: 'Gifts arrive 25% sooner and energy fades 10% slower.', effect: { giftSpeed: 1.25, energyDecay: 0.9 } },
    titan: 'Hourglass Sovereign',
  },
  {
    roster: 'dream', price: 180, habitats: ['dream', 'sugar'], likes: 'Moon Cake',
    trait: 'Dozefur — yawns in colours.',
    blurb: 'A pastel dream puff with cloud-soft fur and sleepy star freckles.',
    greeting: 'I dreamed about you. You had a hat.',
    gene: { name: 'Sweet Dreams', icon: '💤', desc: 'Energy fades 25% slower and bond grows 10% faster.', effect: { energyDecay: 0.75, bond: 1.1 } },
    titan: 'Slumberland Warden',
  },
  {
    roster: 'sound', price: 190, habitats: ['sugar', 'aurora'], likes: 'Star Pop',
    trait: 'Tonefur — hums harmonies in its sleep.',
    blurb: 'A neon music puff with glowing headphones and a real taste for bass.',
    greeting: 'Everything is better with a soundtrack.',
    gene: { name: 'Encore', icon: '🎧', desc: 'Games pay +3 coins and chats pay +2.', effect: { gameCoins: 3, chatCoins: 2 } },
    titan: 'Bassline Archon',
  },
  {
    roster: 'aether', price: 260, habitats: ['starlit', 'aurora'], likes: 'Star Cookie',
    trait: 'Aetherfur — leaves a shimmer where it steps.',
    blurb: 'A prismatic myth puff with translucent wings and eyes full of sky.',
    greeting: 'I am made of the part of the world you cannot see.',
    gene: { name: 'Aether Gift', icon: '✨', desc: 'Games pay +4 coins and XP gains +10%.', effect: { gameCoins: 4, xp: 1.1 } },
    titan: 'Aetherflame Prime',
  },
  {
    roster: 'hollow', price: 300, habitats: ['night', 'starlit'], likes: 'Warm Soup',
    trait: 'Voidfur — quietly edits the shadows around it.',
    blurb: 'A deep-space puff with a violet core and a hunger for quiet corners.',
    greeting: 'There is a lot of nothing in here. I like it.',
    gene: { name: 'Nullspace', icon: '🕳️', desc: 'Night games pay +6 coins and XP gains +10%.', effect: { nightCoins: 6, xp: 1.1 } },
    titan: 'Hollowheart Sovereign',
  },
];

const PUFFLE_TYPE_HYBRIDS = {
  'puffle_ember+ember': 'Cinderpuff',
  'puffle_bloom+bloom': 'Blossom Puff',
  'puffle_tideflit+tide': 'Tidepuff',
  'puffle_whisp+gale': 'Cloudpuff',
  'puffle_volt+volt': 'Sparkpuff',
  'puffle_frost+frost': 'Rimepuff',
  'puffle_terra+earth': 'Mossrock Puffle',
  'puffle_cosmic+radiant': 'Starpuff',
  'puffle_lunar+dusk': 'Moonpuff',
  'puffle_solar+radiant': 'Sunpuff',
  'puffle_floral+bloom': 'Petal Puff',
  'puffle_magma+ember': 'Lavapuff',
  'puffle_aether+gale': 'Prism Puff',
  'puffle_hollow+shadow': 'Voidpuff',
};

/* Registered like the other species waves, so these join the type eggs, the wild
   pool, the habitats, the breeding table and the wiki the moment they load. */
(function registerPuffleTypeSpecies() {
  if (typeof ELEMENTS === 'undefined' || !Array.isArray(window.LUMI_ELEMENT_ROSTER)) return;
  const roster = window.LUMI_ELEMENT_ROSTER;
  PUFFLE_TYPE_SPECIES.forEach((row) => {
    const art = roster.find((entry) => entry.key === row.roster);
    if (!art) return;
    const key = `puffle_${row.roster}`;
    if (ELEMENTS[key]) return;
    const palette = art.palette || {};
    ELEMENTS[key] = {
      name: art.name,
      primary: palette.body,
      light: palette.wing,
      deep: palette.deep,
      accent: palette.eye,
      trait: row.trait,
      blurb: row.blurb,
      greeting: row.greeting,
      likes: row.likes,
      /* The link the renderer reads for this type's own eyes. */
      puffleStyle: `el_${row.roster}`,
      puffleElement: art.element,
    };
    GENE_POWERS[key] = row.gene;
    TITAN_NAMES[key] = row.titan;
    TYPE_EGG_BASE_PRICE[key] = row.price;
    TYPE_EGG_PRICE[key] = discountedEggPrice(row.price);
    NAME_START[key] = [String(art.name).split(' ')[0], 'Puffle', 'Puff', 'Tuft'];
    if (!ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
    (row.habitats || ['starlit']).forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
  if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, PUFFLE_TYPE_HYBRIDS);
})();

/* The classic Club Penguin puffle is also its own playable type. The breed is
   registered in data.js; this entry gives that breed a type egg, a wild pool,
   habitats, a gene and a titan. Its base style is the classic blue preset, and
   because the Studio reads the shared variant table it can wear every puffle
   colour. Evolution stays on the shared registry, so all existing forms remain
   available rather than being locked to a Club Penguin-only list. */
const CP_PUFFLE_SPECIES_KEY = 'cp_puffle';
(function registerClassicCpPuffleSpecies() {
  if (typeof ELEMENTS === 'undefined' || !ELEMENTS || ELEMENTS[CP_PUFFLE_SPECIES_KEY]) return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const blue = (table && table.cp_color_blue) || null;
  ELEMENTS[CP_PUFFLE_SPECIES_KEY] = {
    name: 'Club Penguin Puffle',
    primary: blue ? blue.primary : '#4A9FF5',
    light: blue ? blue.secondary : '#A9D6FF',
    deep: blue ? blue.eyeShadow : '#1E5FA8',
    accent: blue ? blue.leafGlow : '#A9D6FF',
    trait: 'Classic — carries every Club Penguin colour with the same round, cheerful heart.',
    blurb: 'A round classic puffle with a propeller-cap grin and a wardrobe of familiar colours. It hatches as a Club Penguin Puffle, then grows through the same evolution forms as every other type in the Hollow.',
    greeting: 'I brought my propeller cap. And every colour I could carry.',
    likes: 'Cloud Feast',
    puffleStyle: 'cp_color_blue',
    puffleElement: 'Classic',
    forcedBreed: CP_PUFFLE_SPECIES_KEY,
    classicColors: true,
    allPuffleColors: true,
    collectionTier: 'classic',
    collectionTierName: 'Classic',
    eggRarity: 'rare',
  };
  if (typeof GENE_POWERS !== 'undefined') {
    GENE_POWERS[CP_PUFFLE_SPECIES_KEY] = {
      name: 'Classic Cheer', icon: '🐧',
      desc: 'Bond grows 20% faster and gifts arrive 12% sooner.',
      effect: { petBond: 1.2, giftSpeed: 1.12 },
    };
  }
  if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[CP_PUFFLE_SPECIES_KEY] = 'Puffle Parade Titan';
  if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[CP_PUFFLE_SPECIES_KEY] = 105;
  if (typeof TYPE_EGG_PRICE !== 'undefined') {
    TYPE_EGG_PRICE[CP_PUFFLE_SPECIES_KEY] = typeof discountedEggPrice === 'function'
      ? discountedEggPrice(105)
      : 70;
  }
  if (typeof NAME_START !== 'undefined') NAME_START[CP_PUFFLE_SPECIES_KEY] = ['Puffle', 'Pud', 'Blue', 'Tuft'];
  if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(CP_PUFFLE_SPECIES_KEY)) ELEMENT_KEYS.push(CP_PUFFLE_SPECIES_KEY);
  if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(CP_PUFFLE_SPECIES_KEY)) TYPE_EGG_SPECIES.push(CP_PUFFLE_SPECIES_KEY);
  if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(CP_PUFFLE_SPECIES_KEY)) WILD_SPECIES.push(CP_PUFFLE_SPECIES_KEY);
  if (typeof SCENES !== 'undefined' && SCENES) {
    ['grove', 'tide', 'aurora'].forEach((sceneKey) => {
      if (SCENES[sceneKey] && Array.isArray(SCENES[sceneKey].species) && !SCENES[sceneKey].species.includes(CP_PUFFLE_SPECIES_KEY)) {
        SCENES[sceneKey].species.push(CP_PUFFLE_SPECIES_KEY);
      }
    });
  }
})();

/* The ten classic Club Penguin penguin colours, each hatched as its own breed.
   The breed records live in data.js; this wave gives every one a playable type
   egg, wild roll, habitat pair, gene, titan and its own colour style. The skill
   carried in GENE_POWERS is the penguin's Club Penguin discipline (puffle care,
   pizza chef, Card-Jitsu, surfing, secret agent, mining, and so on). */
(function registerCpPenguinPuffleSpecies() {
  if (typeof ELEMENTS === 'undefined' || typeof CP_PENGUIN_PUFFLES === 'undefined') return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  CP_PENGUIN_PUFFLES.forEach((row) => {
    const key = `cp_penguin_${row.color}`;
    if (ELEMENTS[key]) return;
    const style = (table && table[`cp_color_${row.color}`]) || {};
    const tierName = `${row.rarity.charAt(0).toUpperCase()}${row.rarity.slice(1)}`;
    ELEMENTS[key] = {
      name: row.breedName,
      primary: style.primary,
      light: style.secondary,
      deep: style.eyeShadow,
      accent: style.leafGlow || style.secondary,
      trait: row.trait,
      blurb: `${row.blurb} Its ${row.skill.name} skill comes straight from Club Penguin.`,
      greeting: row.greeting,
      likes: row.likes,
      puffleStyle: `cp_color_${row.color}`,
      puffleElement: 'Penguin',
      forcedBreed: key,
      classicColors: true,
      allPuffleColors: true,
      collectionTier: row.rarity,
      collectionTierName: tierName,
      eggRarity: row.rarity,
      skill: row.skill.name,
    };
    if (typeof GENE_POWERS !== 'undefined') GENE_POWERS[key] = row.skill;
    if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[key] = row.titan;
    if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[key] = row.price;
    if (typeof TYPE_EGG_PRICE !== 'undefined') {
      TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function'
        ? discountedEggPrice(row.price)
        : Math.round(row.price * 0.7);
    }
    if (typeof NAME_START !== 'undefined') NAME_START[key] = [row.label, 'Penguin', 'Puffle', 'Waddles'];
    if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
    (row.habitats || []).forEach((scene) => {
      if (typeof SCENES !== 'undefined' && SCENES[scene] && Array.isArray(SCENES[scene].species) && !SCENES[scene].species.includes(key)) {
        SCENES[scene].species.push(key);
      }
    });
  });
})();
