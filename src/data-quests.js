/* District quests: a three-step story line for every GTA district and every
   Hollow exotic biome. Steps advance only while you are actually there, and
   each step pays coins, XP, and bond. The update makes every step a single
   action so a district can be finished in one short visit. Loaded after the
   biome data files. */

const BIOME_QUEST_DEFS = {
  'gta-libertycity': {
    title: 'Dockside Debts', icon: '🗽',
    steps: [
      ['Walk the rain-slick docks', 'travel', 1, 60, 0],
      ['Win 2 games under the neon', 'game', 2, 110, 40],
      ['Care for a sprite dockside twice', 'care', 2, 220, 80],
    ],
  },
  'gta-vicecity': {
    title: 'Sunset Radio', icon: '🌴',
    steps: [
      ['Watch the sun drop over Vice Beach', 'travel', 1, 60, 0],
      ['Win 2 games to that synth station', 'game', 2, 110, 40],
      ['Share a snack with a sprite twice', 'care', 2, 220, 80],
    ],
  },
  'gta-sanandreas': {
    title: 'Backroad Mile', icon: '🌵',
    steps: [
      ['Ride out to the backroads', 'travel', 1, 60, 0],
      ['Win 2 games in the dust', 'game', 2, 110, 40],
      ['Patch a sprite up twice', 'care', 2, 220, 80],
    ],
  },
  'gta-losantos': {
    title: 'Hillside Signal', icon: '🌇',
    steps: [
      ['Take the hillside overlook', 'travel', 1, 60, 0],
      ['Win 2 games above the city', 'game', 2, 110, 40],
      ['Bathe a sprite twice after the smog', 'care', 2, 220, 80],
    ],
  },
  'gta-london': {
    title: 'Fog on the Cobbles', icon: '☂️',
    steps: [
      ['Step out into the fog', 'travel', 1, 60, 0],
      ['Win 2 games in the wet', 'game', 2, 110, 40],
      ['Rub a sprite warm twice', 'care', 2, 220, 80],
    ],
  },
  'gta-chinatown': {
    title: 'Lantern Ledger', icon: '🏮',
    steps: [
      ['Slip into the lantern alleys', 'travel', 1, 60, 0],
      ['Win 2 games in the back rooms', 'game', 2, 110, 40],
      ['Feed a sprite twice from the market', 'care', 2, 220, 80],
    ],
  },
  'gta-anywhere': {
    title: 'Retro Grid Run', icon: '🚧',
    steps: [
      ['Ride the retro grid', 'travel', 1, 60, 0],
      ['Win 2 games in the future-past', 'game', 2, 110, 40],
      ['Clean up a sprite twice', 'care', 2, 220, 80],
    ],
  },
  'exotic-backstage': {
    title: 'Soundcheck', icon: '🎧',
    steps: [
      ['Get behind the stage', 'travel', 1, 60, 0],
      ['Win 2 games to the monitors', 'game', 2, 110, 40],
      ['Hype a sprite up twice', 'care', 2, 220, 80],
    ],
  },
  'exotic-supernova': {
    title: 'Red Carpet Comet', icon: '🌟',
    steps: [
      ['Walk the starlight carpet', 'travel', 1, 60, 0],
      ['Win 2 games on the comet', 'game', 2, 110, 40],
      ['Feed a sprite twice before the gala', 'care', 2, 220, 80],
    ],
  },
  'exotic-jester': {
    title: 'Card Trick', icon: '🃏',
    steps: [
      ['Follow the crooked lane', 'travel', 1, 60, 0],
      ['Win 2 games in the mirror maze', 'game', 2, 110, 40],
      ['Cheer a sprite up twice', 'care', 2, 220, 80],
    ],
  },
  'exotic-litlair': {
    title: 'Velvet Rope', icon: '🔥',
    steps: [
      ['Get past the velvet rope', 'travel', 1, 60, 0],
      ['Win 2 games in the lounge', 'game', 2, 110, 40],
      ['Bathe a sprite twice before the show', 'care', 2, 220, 80],
    ],
  },
  'exotic-rift': {
    title: 'Storm Ring', icon: '👑',
    steps: [
      ['Enter the storm ring', 'travel', 1, 60, 0],
      ['Win 2 games inside the arena', 'game', 2, 110, 40],
      ['Patch a sprite up twice', 'care', 2, 220, 80],
    ],
  },
  'exotic-grandslam': {
    title: 'Title Night', icon: '🏆',
    steps: [
      ['Walk into the coliseum', 'travel', 1, 60, 0],
      ['Win 2 games under the lights', 'game', 2, 110, 40],
      ['Rub a sprite down twice', 'care', 2, 220, 80],
    ],
  },
};

/* ---------------- Sprite Hollow quest sheet ----------------
   One named quest per region, each a three-step chain the biome quest engine
   already runs: travel somewhere, win a game, care for a sprite. The spec's
   objectives and rewards sit on the same record so the wiki can print them. */
const SPRITE_HOLLOW_QUESTS = [
  {
    id: 'first-steps', title: 'First Steps', icon: '🥚', giver: 'Mama Hootle', tier: 'Beginner', region: 'bloomroot',
    objectives: ['Hatch your first Sprite Puffle', 'Feed your Puffle', 'Play a mini-game', 'Visit the village square'],
    rewards: ['100 Hollow Coins', 'Beginner Backpack', 'Friendship Badge'],
    steps: [
      ['Hatch an egg at the Bloomroot hatchery', 'care', 1, 60, 0],
      ['Play a mini-game with your hatchling', 'game', 1, 110, 40],
      ['Walk the village square together', 'travel', 1, 220, 80],
    ],
  },
  {
    id: 'growing-together', title: 'Growing Together', icon: '🌱', giver: 'Nova', tier: 'Beginner', region: 'celestial',
    objectives: ['Reach Child Stage', 'Learn your first elemental ability', 'Make 3 friends'],
    rewards: ['Evolution Crystal', 'Decorative Flower Pot', 'Rare Egg Fragment'],
    steps: [
      ['Bring a sprite up to Child Stage', 'care', 1, 60, 0],
      ['Win a game while it learns its ability', 'game', 1, 110, 40],
      ['Introduce it to the meadow', 'travel', 1, 220, 80],
    ],
  },
  {
    id: 'lost-crystal-cave', title: 'Lost Crystal Cave', icon: '🕳️', giver: 'Princess Prismatic', tier: 'Explorer', region: 'prismcaverns',
    objectives: ['Find 10 crystal shards', 'Defeat cave creatures', 'Discover the hidden treasure room'],
    rewards: ['Crystal Wings', 'Epic Gemstone', 'Crystal Puffle Egg'],
    steps: [
      ['Follow the tunnels under the caverns', 'travel', 1, 60, 0],
      ['Clear a nest of cave creatures', 'game', 1, 110, 40],
      ['Open the treasure room', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'forgotten-ruins', title: 'The Forgotten Ruins', icon: '🏛️', giver: 'Atlas', tier: 'Explorer', region: 'stoneheart',
    objectives: ['Solve the canyon puzzles', 'Restore the runes', 'Unlock the sealed door'],
    rewards: ['Ancient Artifact', 'Explorer Title', 'Legendary Map Piece'],
    steps: [
      ['Walk the red canyon walls', 'travel', 1, 60, 0],
      ['Win the rune puzzle', 'game', 1, 110, 40],
      ['Steady the sealed door', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'elemental-trials', title: 'Elemental Trials', icon: '🛡️', giver: 'Grand Guardian Lumora', tier: 'Guardian', region: 'worldheart',
    objectives: ['Complete a trial in every biome', 'Reach Adult Stage', 'Master 3 abilities'],
    rewards: ['Guardian Cloak', 'Legendary Evolution Crystal', 'Guardian Rank'],
    steps: [
      ['Reach the Worldheart roots', 'travel', 1, 60, 0],
      ['Master a trial of the tree', 'game', 1, 110, 40],
      ['Receive the Guardian cloak', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'defender-of-hollow', title: 'Defender of Hollow', icon: '⚔️', giver: 'Umbrix', tier: 'Guardian', region: 'shadowveil',
    objectives: ['Protect a village from an invasion', 'Purify a Shadow Wisp', 'Raise the village statue'],
    rewards: ['Guardian Armor', 'Legendary Egg', 'Village Statue'],
    steps: [
      ['Patrol the violet treeline', 'travel', 1, 60, 0],
      ['Drive back the Eclipse', 'game', 1, 110, 40],
      ['Settle the village afterwards', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'cinder-ascent', title: 'Cinder Ascent', icon: '🔥', giver: 'Queen Emberflare', tier: 'Explorer', region: 'emberpeak',
    objectives: ['Climb to the glowing seams', 'Face a Cinder Beast', 'Bring back an ember crystal'],
    rewards: ['Inferno Armor Set', 'Fire Essence', 'Ember Crown'],
    steps: [
      ['Climb the highland ridges', 'travel', 1, 60, 0],
      ['Win a heat trial', 'game', 1, 110, 40],
      ['Cool down a wounded sprite', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'tide-ledger', title: 'The Tide Ledger', icon: '🌊', giver: 'Captain Tidewhisk', tier: 'Explorer', region: 'crystaltide',
    objectives: ['Chart the coast', 'Recover the lost ledger', 'Calm an Abyssal Serpent'],
    rewards: ['Ocean Pearl', 'Abyss Essence', 'Ocean Guardian Armor'],
    steps: [
      ['Walk the glassy surf', 'travel', 1, 60, 0],
      ['Win the tide chart race', 'game', 1, 110, 40],
      ['Dry off a soaked sprite', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'aurora-vigil', title: 'Aurora Vigil', icon: '❄️', giver: 'Lady Aurorafrost', tier: 'Explorer', region: 'auroraglacier',
    objectives: ['Watch the lights from the ice shelf', 'Calm a Frost Specter', 'Recover a Frozen Core'],
    rewards: ['Aurora Crystal Wings', 'Ice Guardian Staff', 'Frozen Core'],
    steps: [
      ['Cross the blue ice', 'travel', 1, 60, 0],
      ['Win the snowfall trial', 'game', 1, 110, 40],
      ['Warm a frozen sprite', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'storm-cup', title: 'Storm Cup', icon: '🏁', giver: 'Stormbolt Junior', tier: 'Explorer', region: 'thundercloud',
    objectives: ['Enter the storm race', 'Place on the thunder stairs', 'Charge a Charged Crystal'],
    rewards: ['Storm Wings', 'Lightning Guardian Set', 'Charged Crystal'],
    steps: [
      ['Take the cloud stairs', 'travel', 1, 60, 0],
      ['Win a heat of the cup', 'game', 1, 110, 40],
      ['Rest a sparking sprite', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'chasing-clouds', title: 'Chasing Clouds', icon: '🌪️', giver: 'Breezetail', tier: 'Beginner', region: 'whisperwind',
    objectives: ['Catch a cloud', 'Ride the plain winds', 'Meet the neighbours'],
    rewards: ['Cloud Cape', 'Seed Pouch', 'Wind Charm'],
    steps: [
      ['Walk out onto the pale grass', 'travel', 1, 60, 0],
      ['Win a wind game', 'game', 1, 110, 40],
      ['Feed a passing sprite', 'care', 1, 220, 80],
    ],
  },
  {
    id: 'genesis-key', title: 'The Genesis Key', icon: '🌌', giver: 'Grand Guardian Lumora', tier: 'Guardian', region: 'genesiscore',
    objectives: ['Open the old room under the roots', 'Learn the first element\'s name', 'Awaken the Omnitype'],
    rewards: ['Creator Relic', 'Omnitype Fragment', 'Genesis Relic'],
    steps: [
      ['Descend to the Genesis Core', 'travel', 1, 60, 0],
      ['Win the trial of first light', 'game', 1, 110, 40],
      ['Hold the Worldheart steady', 'care', 1, 220, 80],
    ],
  },
];

/* A region keeps its own quest if one already exists; the sheet only fills gaps. */
SPRITE_HOLLOW_QUESTS.forEach((quest) => {
  if (!quest.region || !SCENES[quest.region] || BIOME_QUEST_DEFS[quest.region]) return;
  BIOME_QUEST_DEFS[quest.region] = { title: quest.title, icon: quest.icon, steps: quest.steps };
});

/* Enemies are corrupted creatures, and every one of them can be purified back
   into the Hollow rather than destroyed. */
const SPRITE_HOLLOW_ENEMIES = [
  { id: 'shadow-wisp', name: 'Shadow Wisp', icon: '🌑', region: 'shadowveil', about: 'Small floating corruption spirits.', abilities: ['Darkness Orb', 'Fear Pulse'], drops: ['Shadow Dust', 'Wisp Core'] },
  { id: 'eclipse-crawler', name: 'Eclipse Crawler', icon: '🕷️', region: 'prismcaverns', about: 'Corrupted cave creatures that nest in the ruins and the caverns.', abilities: ['Crystal Corruption', 'Poison Bite'], drops: ['Crystal Fragment', 'Rare Craft Materials'] },
  { id: 'cinder-beast', name: 'Cinder Beast', icon: '🔥', region: 'emberpeak', about: 'Living magma monsters.', abilities: ['Lava Burst', 'Flame Roar'], drops: ['Fire Essence', 'Ember Crystal'] },
  { id: 'frost-specter', name: 'Frost Specter', icon: '❄️', region: 'auroraglacier', about: 'Corrupted ice spirits.', abilities: ['Freeze Touch', 'Ice Storm'], drops: ['Frozen Core', 'Ice Shard'] },
  { id: 'storm-phantom', name: 'Storm Phantom', icon: '⚡', region: 'thundercloud', about: 'Lightning entities born from unstable weather.', abilities: ['Thunder Strike', 'Electric Surge'], drops: ['Charged Crystal', 'Lightning Core'] },
  { id: 'stone-titan', name: 'Stone Titan', icon: '🪨', region: 'stoneheart', about: 'Ancient rock guardians awakened by corruption.', abilities: ['Rock Quake', 'Boulder Crash'], drops: ['Titan Stone', 'Ancient Relic'] },
  { id: 'abyssal-serpent', name: 'Abyssal Serpent', icon: '🌊', region: 'crystaltide', about: 'Massive ocean creatures corrupted by Eclipse magic.', abilities: ['Whirlpool', 'Abyss Breath'], drops: ['Ocean Pearl', 'Abyss Essence'] },
];

/* Dungeon bosses and the raid that closes the story. */
const SPRITE_HOLLOW_BOSSES = [
  { id: 'infernal-colossus', name: 'Infernal Colossus', icon: '🔥', location: 'Molten Core Volcano', region: 'emberpeak', rewards: ['Legendary Fire Egg', 'Inferno Armor Set', 'Ember Crown'] },
  { id: 'queen-frostfang', name: 'Queen Frostfang', icon: '❄️', location: 'Frozen Crystal Palace', region: 'auroraglacier', rewards: ['Aurora Crystal Wings', 'Ice Guardian Staff'] },
  { id: 'leviathan-deep', name: 'Leviathan of the Deep', icon: '🌊', location: 'Sunken Temple', region: 'crystaltide', rewards: ['Ocean Guardian Armor', 'Mythic Water Egg'] },
  { id: 'storm-king-tempest', name: 'Storm King Tempest', icon: '⚡', location: 'Thundercloud Citadel', region: 'thundercloud', rewards: ['Storm Wings', 'Lightning Guardian Set'] },
  { id: 'void-emperor', name: 'Void Emperor', icon: '🌑', location: 'Eclipse Fortress', region: 'shadowveil', rewards: ['Void Crystal Evolution', 'Shadow Guardian Cape'] },
  {
    id: 'hollow-eclipse', name: 'The Hollow Eclipse', icon: '🌌', location: 'Eclipse Fortress', region: 'genesiscore', final: true,
    about: 'Ancient corruption consuming elemental harmony: a cosmic shadow in dark crystal armour, with eclipse wings and void energy storms.',
    phases: ['Shadow Form', 'Crystal Corruption Form', 'Eclipse Titan Form', 'Cosmic Void Form'],
    battle: '10-player Guardian Raid · multiplayer event · seasonal challenge',
    rewards: ['Creator Relic', 'Mythic Evolution Materials', 'Cosmic Egg', 'Omnitype Fragment'],
  },
];

/* Loot follows the same seven rungs as rarity, so a drop always reads at a
   glance: what tier it is and what kind of thing it is. */
const SPRITE_HOLLOW_LOOT_TIERS = [
  { key: 'common', name: 'Common', icon: '⚪', items: ['Food', 'Seeds', 'Basic toys'] },
  { key: 'uncommon', name: 'Uncommon', icon: '🟢', items: ['Furniture', 'Clothing', 'Ability books'] },
  { key: 'rare', name: 'Rare', icon: '🔵', items: ['Mounts', 'Rare decorations', 'Special eggs'] },
  { key: 'epic', name: 'Epic', icon: '🟣', items: ['Wings', 'Legendary materials', 'Hybrid evolution stones'] },
  { key: 'legendary', name: 'Legendary', icon: '🟡', items: ['Guardian armour', 'Legendary eggs', 'Ancient relics'] },
  { key: 'mythic', name: 'Mythic', icon: '🔴', items: ['Mythic Puffles', 'Mythic transformations', 'Worldheart artifacts'] },
  { key: 'creator', name: 'Creator', icon: '🌌', items: ['Omnitype evolution', 'Creator wings', 'Genesis relics'] },
];

const SPRITE_HOLLOW_ACHIEVEMENTS = [
  { id: 'hatch-100', name: 'Hatch 100 Puffles', icon: '🥚' },
  { id: 'every-element', name: 'Discover every element', icon: '🌈' },
  { id: 'every-hybrid', name: 'Unlock every hybrid', icon: '🧬' },
  { id: 'max-friendship', name: 'Max friendship with a Puffle', icon: '💞' },
  { id: 'village-leader', name: 'Become a village leader', icon: '🏡' },
  { id: 'guardian-trials', name: 'Complete all Guardian Trials', icon: '🛡️' },
  { id: 'all-bosses', name: 'Defeat all bosses', icon: '👑' },
  { id: 'restore-biomes', name: 'Restore every biome', icon: '🌍' },
  { id: 'genesis-core', name: 'Discover Genesis Core', icon: '🌌' },
  { id: 'meet-lumora', name: 'Meet Lumora', icon: '👑' },
  { id: 'omnitype', name: 'Unlock the Omnitype Puffle', icon: '✨' },
  { id: 'save-hollow', name: 'Save Sprite Hollow', icon: '🏆' },
];

const BIOME_QUESTS = {};

Object.entries(BIOME_QUEST_DEFS).forEach(([sceneKey, def]) => {
  if (!SCENES[sceneKey]) return;
  BIOME_QUESTS[sceneKey] = {
    scene: sceneKey,
    title: def.title,
    icon: def.icon,
    steps: def.steps.map(([text, kind, , coins, xp], index) => ({
      text: text.replace(/\b2 games\b/g, '1 game').replace(/\btwice\b/g, 'once'),
      kind,
      need: 1,
      reward: { coins, xp, bond: index === 2 ? 8 : 2 },
    })),
  };
});

const BIOME_QUEST_KEYS = Object.keys(BIOME_QUESTS);

function biomeQuestState(sceneKey) {
  const q = state.biomeQuests && state.biomeQuests[sceneKey];
  return q && typeof q === 'object' ? q : { step: 0, progress: 0, done: false };
}

function biomeQuestStep(sceneKey) {
  const def = BIOME_QUESTS[sceneKey];
  if (!def) return null;
  const q = biomeQuestState(sceneKey);
  if (q.done) return null;
  const step = def.steps[q.step];
  return step ? { def, q, step, index: q.step } : null;
}

function biomeQuestProgress(sceneKey) {
  const info = biomeQuestStep(sceneKey);
  if (!info) return { done: true, have: 0, need: 0 };
  return {
    done: false,
    have: Math.min(info.step.need, Math.max(0, Number(info.q.progress) || 0)),
    need: info.step.need,
  };
}
