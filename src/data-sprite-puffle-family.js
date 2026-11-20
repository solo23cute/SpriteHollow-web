/* The Sprite Puffle family: a growing lineup of breeds sharing one cloud-soft
   silhouette, from the common woodland companion to the divine Ancient Celestial.

   Each row owns a hidden puffle style, so the chart art gives it a matching
   headpiece and aura while the family keeps its own pastel palette. Species are
   registered like every other wave, which makes them hatchable, breedable,
   placeable and visible in the collection without a second creature system. */

const SPRITE_PUFFLE_FAMILY = [
  {
    key: 'sp_sprite', element: 'sp_sprite', name: 'Sprite Puffle', short: 'Sprite', icon: '☁️',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#B9C6D4',
    puffleElement: 'Wind', habitatLabel: 'Mosslight Hollow', habitats: ['grove', 'mycelium'],
    likes: 'Cloudcakes', price: 70, titan: 'Cloudsoft Sovereign',
    style: { primary: '#FFF3DC', secondary: '#CDEEDD', belly: '#FFFDF5', ear: '#E2F7EE', iris: '#5CBFA0', eyeShadow: '#2F6E5A', leaf: '#8FD8C0', leafGlow: '#D8FFF1', pads: '#F4C9D4' },
    personality: ['🌱 Friendly', '✨ Curious', '☁️ Gentle', '🎾 Playful'],
    lore: 'The original fluffy companion. Sprite Puffles drift through the mosslit hollows on paws that barely touch the ground, collecting warm little sparkles in their cream-white coats. They are the first Puffle most keepers meet, and the one that never quite stops following you home.',
    stats: { fluffiness: 72, cuddliness: 80, magic: 55, joy: 78, luck: 60 },
    gene: { name: 'Cloudsoft', icon: '☁️', desc: 'Joy fades 8% slower and gifts arrive 10% sooner.', effect: { joyMod: 0.92, giftSpeed: 1.1 } },
    traits: [
      { name: 'Cloud Nap', icon: '💤', level: 1, bond: 0 },
      { name: 'Soft Landing', icon: '🍃', level: 5, bond: 10 },
      { name: 'Pocket Fluff', icon: '🧶', level: 12, bond: 30 },
      { name: 'Lucky Companion', icon: '🍀', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Sky Hop', icon: '🌈', level: 30, bond: 0 },
      { name: 'Wish Cloud', icon: '✨', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_blossom', element: 'sp_blossom', name: 'Blossom Puffle', short: 'Blossom', icon: '🌸',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#46C46E',
    puffleElement: 'Flower', habitatLabel: 'Petal Grove', habitats: ['grove', 'sugar'],
    likes: 'Honey Drop', price: 90, titan: 'Blossomheart Guardian',
    style: { primary: '#FFC2DE', secondary: '#FFF0F6', belly: '#FFFFFF', ear: '#FFD8EA', iris: '#E86AA6', eyeShadow: '#8C2B5F', leaf: '#F78FBF', leafGlow: '#FFD0E8', pads: '#FFE1EC' },
    personality: ['🌺 Romantic', '🌿 Garden-hearted', '🐝 Collects flowers', '✨ Gentle'],
    lore: 'Blossom Puffles carry entire springs inside their fluff. Cherry petals catch in the curls behind their ears, and every step leaves a faint petal trail as though the grove is reluctant to see them go. They spend whole afternoons arranging flowers nobody asked them to arrange.',
    stats: { fluffiness: 84, cuddliness: 82, magic: 70, joy: 88, luck: 66 },
    gene: { name: 'Petalfall', icon: '🌸', desc: 'Pets build +20% bond and joy fades 10% slower.', effect: { petBond: 1.2, joyMod: 0.9 } },
    traits: [
      { name: 'Petal Trail', icon: '🌸', level: 1, bond: 0 },
      { name: 'Flower Ears', icon: '🌷', level: 5, bond: 10 },
      { name: 'Blossom Cache', icon: '🌼', level: 12, bond: 30 },
      { name: 'Spring Heart', icon: '💗', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Cherry Veil', icon: '🌸', level: 30, bond: 0 },
      { name: 'Garden Sovereign', icon: '🌺', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_frost', element: 'sp_frost', name: 'Frost Puffle', short: 'Frost', icon: '❄️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Ice', habitatLabel: 'Frostmere', habitats: ['biome-ice', 'aurora'],
    likes: 'Warm Soup', price: 105, titan: 'Winterlight Sovereign',
    style: { primary: '#E8F8FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#D8F3FF', iris: '#5CC8F5', eyeShadow: '#2F6E9B', leaf: '#9FDDF5', leafGlow: '#E8FBFF', pads: '#F4D5E2' },
    personality: ['🌨️ Calm', '💤 Sleepy', '❄️ Patient', '🫧 Quiet'],
    lore: 'A snow cloud that learned to purr. Frost Puffles sleep in the coldest corner they can find and wake with tiny crystals caught in their fur tips. They leave snowflakes behind without meaning to, and seem faintly embarrassed when anyone points it out.',
    stats: { fluffiness: 90, cuddliness: 74, magic: 76, joy: 62, luck: 58 },
    gene: { name: 'Rimecoat', icon: '❄️', desc: 'Needs fade 12% slower and energy fades 10% slower.', effect: { needSlow: 0.88, energyDecay: 0.9 } },
    traits: [
      { name: 'Crystal Tips', icon: '❄️', level: 1, bond: 0 },
      { name: 'Snowprint', icon: '🐾', level: 5, bond: 10 },
      { name: 'Deep Nap', icon: '💤', level: 12, bond: 30 },
      { name: 'Winter Coat', icon: '🧊', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Frozen Halo', icon: '❄️', level: 30, bond: 0 },
      { name: 'Everwinter', icon: '🌨️', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_sunbeam', element: 'sp_sunbeam', name: 'Sunbeam Puffle', short: 'Sunbeam', icon: '☀️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Sun', habitatLabel: 'Sunmeadow', habitats: ['savanna', 'aurora'],
    likes: 'Sun Nectar', price: 105, titan: 'Sunhalo Emperor',
    style: { primary: '#FFE9B8', secondary: '#FFF6D8', belly: '#FFFDF0', ear: '#FFDFA0', iris: '#E89A18', eyeShadow: '#8A5A00', leaf: '#FFC44D', leafGlow: '#FFF0B8', pads: '#FFD9B8' },
    personality: ['☀️ Cheerful', '⚡ Energetic', '🌻 Warm', '✨ Hopeful'],
    lore: 'Sunbeam Puffles are a pocket sunrise with a tail. Their cream coats warm up in direct light until the fur glows softly, and the tip of the tail throws tiny golden sparks when they run. They greet every morning as though it were a personal achievement.',
    stats: { fluffiness: 80, cuddliness: 78, magic: 72, joy: 96, luck: 70 },
    gene: { name: 'Daybreak', icon: '🌞', desc: 'Day games pay +5 coins and XP gains +8%.', effect: { dayCoins: 5, xp: 1.08 } },
    traits: [
      { name: 'Sunlit Fur', icon: '☀️', level: 1, bond: 0 },
      { name: 'Morning Spark', icon: '✨', level: 5, bond: 10 },
      { name: 'Warm Paws', icon: '🌻', level: 12, bond: 30 },
      { name: 'Golden Tail', icon: '🌟', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Noon Halo', icon: '☀️', level: 30, bond: 0 },
      { name: 'Little Sun', icon: '🌞', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_moonmist', element: 'sp_moonmist', name: 'Moonmist Puffle', short: 'Moonmist', icon: '🌙',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Moon', habitatLabel: 'Moonmist Grove', habitats: ['night', 'dream'],
    likes: 'Moon Berry', price: 130, titan: 'Crescent Sovereign',
    style: { primary: '#E6E4F5', secondary: '#C9B8F0', belly: '#F8F6FF', ear: '#D8CDF5', iris: '#9B7BE0', eyeShadow: '#5A3F8C', leaf: '#B8A0E8', leafGlow: '#E8DEFF', pads: '#E8D8F8' },
    personality: ['🌙 Quiet', '🔮 Mysterious', '🌌 Dreamy', '🦉 Night owl'],
    lore: 'Moonmist Puffles only stir when the hollow turns blue. Their silver-white fur holds a lavender glow, and the fluff of their tail curls into a crescent even when they sleep. Floating motes follow them like very small, very sleepy moons.',
    stats: { fluffiness: 86, cuddliness: 70, magic: 92, joy: 68, luck: 76 },
    gene: { name: 'Moon Tide', icon: '🌙', desc: 'Night games pay +5 coins and energy fades 15% slower.', effect: { nightCoins: 5, energyDecay: 0.85 } },
    traits: [
      { name: 'Crescent Tail', icon: '🌙', level: 1, bond: 0 },
      { name: 'Moon Motes', icon: '✨', level: 5, bond: 10 },
      { name: 'Night Eyes', icon: '🦉', level: 12, bond: 30 },
      { name: 'Lavender Glow', icon: '🔮', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Mist Walk', icon: '🌫️', level: 30, bond: 0 },
      { name: 'Eclipse Song', icon: '🌑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_forest', element: 'sp_forest', name: 'Forest Puffle', short: 'Forest', icon: '🌿',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Grass', habitatLabel: 'Mycelium Wilds', habitats: ['grove', 'mycelium'],
    likes: 'Moon Cake', price: 130, titan: 'Deeproot Colossus',
    style: { primary: '#CDE8C0', secondary: '#EAF7DF', belly: '#F7FFF1', ear: '#BCE0AC', iris: '#4C8A3F', eyeShadow: '#2F5C2A', leaf: '#7FB36A', leafGlow: '#C9F0B8', pads: '#D8C0A8' },
    personality: ['🛡️ Protective', '🌱 Patient', '🍄 Grounded', '🌳 Loyal'],
    lore: 'Forest Puffles are the quiet wardens of the undergrowth. Mushrooms nest in their mossy fluff, leaf-shaped tufts fan out along the tail, and woodland sparkles gather where they sit. They plant themselves beside anyone smaller and refuse to move until the danger passes.',
    stats: { fluffiness: 88, cuddliness: 76, magic: 74, joy: 72, luck: 82 },
    gene: { name: 'Wild Growth', icon: '🌿', desc: 'XP gains +8% and joy fades 8% slower.', effect: { xp: 1.08, joyMod: 0.92 } },
    traits: [
      { name: 'Mushroom Fluff', icon: '🍄', level: 1, bond: 0 },
      { name: 'Leaf Tufts', icon: '🍃', level: 5, bond: 10 },
      { name: 'Rooted', icon: '🌳', level: 12, bond: 30 },
      { name: 'Grove Warden', icon: '🛡️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Mycelium Path', icon: '🍄', level: 30, bond: 0 },
      { name: 'Worldroot', icon: '🌳', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_bubble', element: 'sp_bubble', name: 'Bubble Puffle', short: 'Bubble', icon: '🫧',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Water', habitatLabel: 'Tideglass Pool', habitats: ['tide', 'crystal'],
    likes: 'Coconut Water', price: 130, titan: 'Tidelight Sovereign',
    style: { primary: '#BDEFFF', secondary: '#E8FBFF', belly: '#F4FDFF', ear: '#CFF2FF', iris: '#3FAED0', eyeShadow: '#2F7A96', leaf: '#8CDFF5', leafGlow: '#D8F8FF', pads: '#D8F0F8' },
    personality: ['🫧 Playful', '💦 Mischievous', '🌊 Curious', '🐚 Gentle'],
    lore: 'Bubble Puffles are a splash that decided to stay. Their aqua fur has soft, semi-transparent edges, and a thin trail of bubbles follows them across the hollow. They think puddles are for jumping in and have never once been wrong about this.',
    stats: { fluffiness: 82, cuddliness: 80, magic: 78, joy: 90, luck: 72 },
    gene: { name: 'Riptide', icon: '🌊', desc: 'Games pay +3 coins and needs fade 8% slower.', effect: { gameCoins: 3, needSlow: 0.92 } },
    traits: [
      { name: 'Bubble Trail', icon: '🫧', level: 1, bond: 0 },
      { name: 'Splash Step', icon: '💦', level: 5, bond: 10 },
      { name: 'Tide Edges', icon: '🌊', level: 12, bond: 30 },
      { name: 'Pearl Coat', icon: '🐚', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Pool Portal', icon: '🌀', level: 30, bond: 0 },
      { name: 'Tideheart', icon: '💙', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_storm', element: 'sp_storm', name: 'Storm Puffle', short: 'Storm', icon: '⚡',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Storm', habitatLabel: 'Thunderpeak', habitats: ['aurora', 'ember'],
    likes: 'Star Pop', price: 175, titan: 'Tempest Crown Warden',
    style: { primary: '#6B7182', secondary: '#9AA3B8', belly: '#C8D0E0', ear: '#828BA0', iris: '#4FC8FF', eyeShadow: '#2E3442', leaf: '#5C6B85', leafGlow: '#8FE8FF', pads: '#B8C0D0' },
    personality: ['⚡ Hyperactive', '🌩️ Bold', '💥 Loud', '🖤 Loyal'],
    lore: 'Storm Puffles arrive with a crackle and leave with the curtains smoking slightly. Their dark cloud fur is stitched with electric blue, the tail forks like a lightning strike, and tiny sparks jump between the curls when they get excited. They are always excited.',
    stats: { fluffiness: 78, cuddliness: 64, magic: 90, joy: 94, luck: 68 },
    gene: { name: 'Stormhead', icon: '⛈️', desc: 'Night games pay +4 coins and joy fades 10% slower.', effect: { nightCoins: 4, joyMod: 0.9 } },
    traits: [
      { name: 'Spark Curls', icon: '⚡', level: 1, bond: 0 },
      { name: 'Forked Tail', icon: '🌩️', level: 5, bond: 10 },
      { name: 'Static Purr', icon: '🔊', level: 12, bond: 30 },
      { name: 'Storm Charge', icon: '💥', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Thunder Step', icon: '🌩️', level: 30, bond: 0 },
      { name: 'Tempest Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_dream', element: 'sp_dream', name: 'Dream Puffle', short: 'Dream', icon: '✨',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Dream', habitatLabel: 'Slumberland', habitats: ['dream', 'night'],
    likes: 'Moon Cake', price: 175, titan: 'Slumberland Warden',
    style: { primary: '#E8D6FF', secondary: '#C9B8F0', belly: '#FFF0FF', ear: '#DCC8FF', iris: '#D8A8FF', eyeShadow: '#5A3E8C', leaf: '#B8A0E8', leafGlow: '#FFD8FF', pads: '#FFD6F0' },
    personality: ['🌙 Dreamy', '🌿 Gentle', '✨ Curious', '💎 Collector'],
    lore: 'Dream Puffles drift through moonlit forests gathering forgotten wishes into their fur. Tiny stars hide between the tufts, and their nebula-soft tails leave a faint constellation trail when they float. They are excellent listeners and terrible secret-keepers.',
    stats: { fluffiness: 98, cuddliness: 93, magic: 88, joy: 96, luck: 91 },
    gene: { name: 'Sweet Dreams', icon: '💤', desc: 'Energy fades 25% slower and bond grows 10% faster.', effect: { energyDecay: 0.75, bond: 1.1 } },
    traits: [
      { name: 'Star Fur', icon: '⭐', level: 1, bond: 0 },
      { name: 'Soft Landing', icon: '☁️', level: 5, bond: 10 },
      { name: 'Lucky Companion', icon: '🍀', level: 12, bond: 30 },
      { name: 'Floating Floof', icon: '🎈', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Celestial Aura', icon: '🌌', level: 30, bond: 0 },
      { name: 'Wish Weaver', icon: '🪄', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_rainbow', element: 'sp_rainbow', name: 'Rainbow Puffle', short: 'Rainbow', icon: '🌈',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF6FA8',
    puffleElement: 'Rainbow', habitatLabel: 'Prism Sky', habitats: ['starlit', 'aurora'],
    likes: 'Cloud Feast', price: 215, titan: 'Prismheart Sovereign',
    style: { primary: '#FFF7FF', secondary: '#FFD1F0', belly: '#FFFFFF', ear: '#E8D8FF', iris: '#8CFFF2', eyeShadow: '#6B4A8C', leaf: '#B18CFF', leafGlow: '#FFD1F0', pads: '#FFE0FF', gold: '#FFF2B8' },
    personality: ['🌈 Lucky', '🎨 Expressive', '✨ Radiant', '🦋 Social'],
    lore: 'A white cloud wearing every colour at once. Rainbow Puffle fur shifts through soft pastel bands as it moves, the tail changes hue with the light, and prism sparkles scatter whenever it shakes itself dry. Other sprites gravitate toward it and cannot quite explain why.',
    stats: { fluffiness: 94, cuddliness: 88, magic: 96, joy: 92, luck: 99 },
    gene: { name: 'Spectrum', icon: '🌈', desc: 'Games pay +5 coins and gifts arrive 15% sooner.', effect: { gameCoins: 5, giftSpeed: 1.15 } },
    traits: [
      { name: 'Prism Sparkle', icon: '💎', level: 1, bond: 0 },
      { name: 'Colour Shift', icon: '🎨', level: 5, bond: 10 },
      { name: 'Luck Aura', icon: '🍀', level: 12, bond: 30 },
      { name: 'Spectrum Tail', icon: '🌈', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Aurora Veil', icon: '🌌', level: 30, bond: 0 },
      { name: 'Infinite Prism', icon: '💠', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_ancient', element: 'sp_ancient', name: 'Ancient Celestial Puffle', short: 'Ancient Celestial', icon: '⭐',
    tier: 'secret', rarity: 'divine', rarityLabel: 'Divine', stars: 8, color: '#FFE08A',
    puffleElement: 'Light', habitatLabel: 'Celestial Reach', habitats: ['starlit', 'night'],
    likes: 'Star Cookie', price: 300, titan: 'Dawnsong Archon',
    style: { primary: '#FFE9A8', secondary: '#FFF6D8', belly: '#FFFDF0', ear: '#FFE2A8', iris: '#FFD166', eyeShadow: '#8A6A1E', leaf: '#FFC94D', leafGlow: '#FFF2B8', pads: '#FFE8C9', gold: '#FFF2B8' },
    personality: ['🌌 Cosmic', '👑 Serene', '🛡️ Protective', '✨ Divine'],
    lore: 'The oldest Puffle in the hollow, and the largest. Ancient Celestials carry a galaxy in their golden coats, a halo of floating constellations above their heads, and a cosmic tail that sweeps wider than their body. Whole nests grow calmer when one drifts overhead.',
    stats: { fluffiness: 100, cuddliness: 96, magic: 100, joy: 99, luck: 100 },
    gene: { name: 'Worldsong', icon: '⭐', desc: 'Games pay +6 coins and XP gains +15%.', effect: { gameCoins: 6, xp: 1.15 } },
    traits: [
      { name: 'Star Coat', icon: '⭐', level: 1, bond: 0 },
      { name: 'Constellation Halo', icon: '🌌', level: 5, bond: 10 },
      { name: 'Cosmic Tail', icon: '✨', level: 12, bond: 30 },
      { name: 'Ancient Calm', icon: '🕊️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Galaxy Step', icon: '🌠', level: 30, bond: 0 },
      { name: 'Divine Dawn', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
  "key": "sp_admin",
  "element": "sp_admin",
  "name": "Admin Puffle",
  "short": "Admin",
  "icon": "🛠️",
  "tier": "epic",
  "rarity": "epic",
  "rarityLabel": "Epic",
  "stars": 4,
  "color": "#9A5CFF",
  "puffleElement": "Admin",
  "habitatLabel": "Console Grove",
  "habitats": [
    "cybergrid",
    "starlit"
  ],
  "likes": "Star Cookie",
  "price": 210,
  "titan": "Console Sovereign",
  "style": {
    "primary": "#D9C2FF",
    "secondary": "#B8E8FF",
    "belly": "#FFFFFF",
    "ear": "#E6D9FF",
    "iris": "#5AD6FF",
    "eyeShadow": "#2F2A6E",
    "leaf": "#8BE9FF",
    "leafGlow": "#E6FBFF",
    "pads": "#F4C9D4"
  },
  "personality": [
    "🛠️ Watchful",
    "🔐 Careful",
    "📋 Precise",
    "🌙 Night-shift"
  ],
  "lore": "Admin Puffles keep the console warm. They sit on the edge of the save file with a tiny clipboard, watching for anything unhandled, and they will absolutely roll back a bad afternoon if you ask nicely.",
  "stats": {
    "fluffiness": 78,
    "cuddliness": 70,
    "magic": 88,
    "joy": 74,
    "luck": 82
  },
  "gene": {
    "name": "Firewall Fluff",
    "icon": "🛡️",
    "desc": "Needs fade 15% slower and gifts arrive 15% sooner.",
    "effect": {
      "needSlow": 0.85,
      "giftSpeed": 1.15
    }
  },
  "traits": [
    {
      "name": "Console Nap",
      "icon": "💤",
      "level": 1,
      "bond": 0
    },
    {
      "name": "Patch Paw",
      "icon": "🩹",
      "level": 5,
      "bond": 10
    },
    {
      "name": "Root Access",
      "icon": "🔑",
      "level": 12,
      "bond": 30
    },
    {
      "name": "Uptime",
      "icon": "🟢",
      "level": 20,
      "bond": 60
    }
  ],
  "locked": [
    {
      "name": "Rollback",
      "icon": "⏪",
      "level": 30,
      "bond": 0
    },
    {
      "name": "Deploy Night",
      "icon": "🚀",
      "level": 45,
      "bond": 90
    }
  ]
},
  {
  "key": "sp_festival",
  "element": "sp_festival",
  "name": "Festival Puffle",
  "short": "Festival",
  "icon": "🎪",
  "tier": "rare",
  "rarity": "rare",
  "rarityLabel": "Rare",
  "stars": 3,
  "color": "#3E89FF",
  "puffleElement": "Festival",
  "habitatLabel": "Lantern Parade",
  "habitats": [
    "sakura",
    "starlit"
  ],
  "likes": "Candyfloss",
  "price": 150,
  "titan": "Parade Sovereign",
  "style": {
    "primary": "#FFD3E8",
    "secondary": "#FFE9B8",
    "belly": "#FFFFFF",
    "ear": "#FFE0F0",
    "iris": "#FF8FC8",
    "eyeShadow": "#8C2B5F",
    "leaf": "#FFD166",
    "leafGlow": "#FFF4C4",
    "pads": "#FFE1EC"
  },
  "personality": [
    "🎪 Festive",
    "🏮 Glowing",
    "🎆 Loud",
    "💫 Delighted"
  ],
  "lore": "Festival Puffles arrive with the lantern parade and refuse to leave until the last sparkler is out. Their fluff holds confetti for weeks, and shaking one is considered a celebration.",
  "stats": {
    "fluffiness": 86,
    "cuddliness": 84,
    "magic": 68,
    "joy": 94,
    "luck": 72
  },
  "gene": {
    "name": "Parade Glow",
    "icon": "🏮",
    "desc": "Joy fades 20% slower and coins +10%.",
    "effect": {
      "joyDecay": 0.8,
      "coins": 1.1
    }
  },
  "traits": [
    {
      "name": "Confetti Coat",
      "icon": "🎊",
      "level": 1,
      "bond": 0
    },
    {
      "name": "Lantern Ear",
      "icon": "🏮",
      "level": 5,
      "bond": 10
    },
    {
      "name": "Parade Step",
      "icon": "🥁",
      "level": 12,
      "bond": 30
    },
    {
      "name": "Closing Night",
      "icon": "🎆",
      "level": 20,
      "bond": 60
    }
  ],
  "locked": [
    {
      "name": "Grand Finale",
      "icon": "✨",
      "level": 30,
      "bond": 0
    },
    {
      "name": "Carnival Heart",
      "icon": "💖",
      "level": 45,
      "bond": 90
    }
  ]
},
  {
  "key": "sp_retro",
  "element": "sp_retro",
  "name": "Retro Puffle",
  "short": "Retro",
  "icon": "👾",
  "tier": "epic",
  "rarity": "epic",
  "rarityLabel": "Epic",
  "stars": 4,
  "color": "#9A5CFF",
  "puffleElement": "Retro",
  "habitatLabel": "Arcade Corner",
  "habitats": [
    "neon",
    "dream"
  ],
  "likes": "Star Pop",
  "price": 195,
  "titan": "High Score Sovereign",
  "style": {
    "primary": "#8FE3FF",
    "secondary": "#FFB3D1",
    "belly": "#FFFDF5",
    "ear": "#B8F0FF",
    "iris": "#FF7AC8",
    "eyeShadow": "#2A1A5A",
    "leaf": "#B69CFF",
    "leafGlow": "#F0E9FF",
    "pads": "#FFD1E8"
  },
  "personality": [
    "👾 Arcade-raised",
    "🕹️ Competitive",
    "📼 Nostalgic",
    "🔊 Loud"
  ],
  "lore": "Retro Puffles smell faintly of arcade carpet and warm electronics. They queue up for a turn they will not get, cheer at screens nobody else can see, and keep a high-score list in their fluff.",
  "stats": {
    "fluffiness": 74,
    "cuddliness": 72,
    "magic": 76,
    "joy": 90,
    "luck": 78
  },
  "gene": {
    "name": "High Score",
    "icon": "🕹️",
    "desc": "Games pay +6 coins and night games +3.",
    "effect": {
      "gameCoins": 6,
      "nightCoins": 3
    }
  },
  "traits": [
    {
      "name": "Pixel Tuft",
      "icon": "👾",
      "level": 1,
      "bond": 0
    },
    {
      "name": "Coin Op",
      "icon": "🪙",
      "level": 5,
      "bond": 10
    },
    {
      "name": "Combo Fluff",
      "icon": "✨",
      "level": 12,
      "bond": 30
    },
    {
      "name": "Extra Life",
      "icon": "💚",
      "level": 20,
      "bond": 60
    }
  ],
  "locked": [
    {
      "name": "Perfect Run",
      "icon": "🏆",
      "level": 30,
      "bond": 0
    },
    {
      "name": "Arcade Legend",
      "icon": "👑",
      "level": 45,
      "bond": 90
    }
  ]
},
  {
  "key": "sp_meme",
  "element": "sp_meme",
  "name": "Meme Puffle",
  "short": "Meme",
  "icon": "🌐",
  "tier": "legendary",
  "rarity": "legendary",
  "rarityLabel": "Legendary",
  "stars": 5,
  "color": "#FFB62E",
  "puffleElement": "Meme",
  "habitatLabel": "Meme Core",
  "habitats": [
    "memecore",
    "neon"
  ],
  "likes": "Berry Fizz",
  "price": 260,
  "titan": "Viral Sovereign",
  "style": {
    "primary": "#FFE0B8",
    "secondary": "#C9F2FF",
    "belly": "#FFFFFF",
    "ear": "#FFEED6",
    "iris": "#5AD6FF",
    "eyeShadow": "#5A3A12",
    "leaf": "#FFD166",
    "leafGlow": "#FFF7D6",
    "pads": "#FFD1E8"
  },
  "personality": [
    "🌐 Online",
    "😹 Reactive",
    "📈 Trending",
    "🎭 Dramatic"
  ],
  "lore": "Meme Puffles speak in captions. They arrive already aware of the joke, laugh a half-second before the punchline, and are deeply offended when nobody reposts them.",
  "stats": {
    "fluffiness": 80,
    "cuddliness": 78,
    "magic": 84,
    "joy": 96,
    "luck": 88
  },
  "gene": {
    "name": "Trending",
    "icon": "📈",
    "desc": "XP +18% and chats pay +4 coins.",
    "effect": {
      "xp": 1.18,
      "chatCoins": 4
    }
  },
  "traits": [
    {
      "name": "Caption Fluff",
      "icon": "💬",
      "level": 1,
      "bond": 0
    },
    {
      "name": "Reaction Paw",
      "icon": "😹",
      "level": 5,
      "bond": 10
    },
    {
      "name": "Viral Tuft",
      "icon": "📈",
      "level": 12,
      "bond": 30
    },
    {
      "name": "Repost",
      "icon": "🔁",
      "level": 20,
      "bond": 60
    }
  ],
  "locked": [
    {
      "name": "Main Character",
      "icon": "✨",
      "level": 30,
      "bond": 0
    },
    {
      "name": "Timeline Sovereign",
      "icon": "👑",
      "level": 45,
      "bond": 90
    }
  ]
},
  {
  "key": "sp_showcase",
  "element": "sp_showcase",
  "name": "Showcase Puffle",
  "short": "Showcase",
  "icon": "🕹️",
  "tier": "legendary",
  "rarity": "legendary",
  "rarityLabel": "Legendary",
  "stars": 5,
  "color": "#FFB62E",
  "puffleElement": "Showcase",
  "habitatLabel": "Studio Shelf",
  "habitats": [
    "memecore",
    "skyisles"
  ],
  "likes": "Honeycomb Cake",
  "price": 255,
  "titan": "Season Sovereign",
  "style": {
    "primary": "#FFC9A8",
    "secondary": "#C9E8FF",
    "belly": "#FFFFFF",
    "ear": "#FFE0CC",
    "iris": "#7EE787",
    "eyeShadow": "#3A2A10",
    "leaf": "#FFD166",
    "leafGlow": "#FFF4C4",
    "pads": "#FFD1E8"
  },
  "personality": [
    "🕹️ Media-raised",
    "📺 Dramatic",
    "🐾 Pet-hearted",
    "⭐ Ambitious"
  ],
  "lore": "Showcase Puffles grew up between channels. They know the theme song to everything, treat every hallway as a set, and will absolutely hold for applause that is not coming.",
  "stats": {
    "fluffiness": 82,
    "cuddliness": 80,
    "magic": 80,
    "joy": 92,
    "luck": 84
  },
  "gene": {
    "name": "Prime Time",
    "icon": "📺",
    "desc": "+20% XP and gifts arrive 20% sooner.",
    "effect": {
      "xp": 1.2,
      "giftSpeed": 1.2
    }
  },
  "traits": [
    {
      "name": "Theme Song",
      "icon": "🎵",
      "level": 1,
      "bond": 0
    },
    {
      "name": "Studio Light",
      "icon": "💡",
      "level": 5,
      "bond": 10
    },
    {
      "name": "Canned Laugh",
      "icon": "😄",
      "level": 12,
      "bond": 30
    },
    {
      "name": "Season Finale",
      "icon": "🎬",
      "level": 20,
      "bond": 60
    }
  ],
  "locked": [
    {
      "name": "Prime Time",
      "icon": "⭐",
      "level": 30,
      "bond": 0
    },
    {
      "name": "Network Sovereign",
      "icon": "👑",
      "level": 45,
      "bond": 90
    }
  ]
},
  {
    key: 'sp_minimiku', element: 'sp_minimiku', name: 'Mini Miku', short: 'Mini Miku', icon: '🎵',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Music', habitatLabel: 'Encore Meadow', habitats: ['sugar', 'aurora'],
    likes: 'Star Pop', price: 145, titan: 'Twin-Tail Encore',
    style: { primary: '#5CE1E6', secondary: '#B8FAFF', belly: '#EFFFFF', ear: '#7DEBEF', iris: '#FF5FA2', eyeShadow: '#0E6B72', leaf: '#FF71CE', leafGlow: '#FFB8E6', pads: '#FFD1E8' },
    personality: ['🎤 Stage-ready', '💙 Loyal', '✨ Bright', '🎧 Musical'],
    lore: 'A tiny idol Puffle with twin teal tails, a glowing headset, and a song for every room. Mini Miku practices choreography on the way to breakfast and insists every puddle is a stage. When the Hollow gets quiet, a soft synth melody usually means she has found an audience of one.',
    stats: { fluffiness: 82, cuddliness: 86, magic: 78, joy: 96, luck: 84 },
    gene: { name: 'Encore', icon: '🎵', desc: 'Games pay +3 coins and chats pay +2.', effect: { gameCoins: 3, chatCoins: 2 } },
    traits: [
      { name: 'Stage Light', icon: '🎤', level: 1, bond: 0 },
      { name: 'Harmony', icon: '🎶', level: 5, bond: 10 },
      { name: 'Fan Chant', icon: '📣', level: 12, bond: 30 },
      { name: 'Encore Heart', icon: '💗', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Twin-Tail Spin', icon: '🌀', level: 30, bond: 0 },
      { name: 'Hollow Diva', icon: '✨', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_squiplash', element: 'sp_squiplash', name: 'Squiplash', short: 'Squiplash', icon: '🦑',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Water', habitatLabel: 'Inkwell Cove', habitats: ['tide', 'crystal'],
    likes: 'Coconut Water', price: 135, titan: 'Inkwell Sovereign',
    style: { primary: '#8B5CF6', secondary: '#C4B5FD', belly: '#F0E9FF', ear: '#A78BFA', iris: '#2DD4BF', eyeShadow: '#3B1D6E', leaf: '#22D3EE', leafGlow: '#A5F3FC', pads: '#FBCFE8' },
    personality: ['🦑 Curious', '🌊 Dramatic', '💜 Affectionate', '🎨 Messy'],
    lore: 'Squiplash is a soft violet puffle with curling tentacle tufts and a talent for disappearing in a puff of ink. The ink is harmless, faintly sparkly, and almost impossible to get out of a white blanket. Squiplash thinks this is the funniest thing that has ever happened.',
    stats: { fluffiness: 74, cuddliness: 80, magic: 84, joy: 82, luck: 76 },
    gene: { name: 'Ink Trail', icon: '🖋️', desc: 'Night games pay +4 coins and clean fades 15% slower.', effect: { nightCoins: 4, cleanDecay: 0.85 } },
    traits: [
      { name: 'Ink Puff', icon: '🖋️', level: 1, bond: 0 },
      { name: 'Tentacle Curl', icon: '🦑', level: 5, bond: 10 },
      { name: 'Deep Current', icon: '🌊', level: 12, bond: 30 },
      { name: 'Inkwell Heart', icon: '💜', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Cloud of Ink', icon: '🌫️', level: 30, bond: 0 },
      { name: 'Kraken Curl', icon: '🌀', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_siroscar', element: 'sp_siroscar', name: 'Sir Oscar the Second', short: 'Sir Oscar', icon: '🎩',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Water', habitatLabel: 'Coral Court', habitats: ['tide', 'crystal'],
    likes: 'Honeycomb Cake', price: 180, titan: 'Coral Crown Knight',
    style: { primary: '#F4C95D', secondary: '#FFF1C1', belly: '#FFF9E5', ear: '#FFE08A', iris: '#3B82F6', eyeShadow: '#6B4A00', leaf: '#F59E0B', leafGlow: '#FFE8A3', pads: '#FFD1A8' },
    personality: ['🎩 Courtly', '🛡️ Brave', '🐟 Dignified', '🍰 Snack-minded'],
    lore: 'Sir Oscar the Second is a round, gold-sheened puffle who wears his title with enormous seriousness and a tiny monocle. He patrols the shallows, settles disputes over the best sunning rock, and has never once turned down a slice of cake. His cape is mostly for show. Mostly.',
    stats: { fluffiness: 88, cuddliness: 84, magic: 76, joy: 88, luck: 90 },
    gene: { name: 'Noble Bearing', icon: '🎩', desc: 'Gifts arrive 20% sooner and bond grows 15% faster.', effect: { giftSpeed: 1.2, bond: 1.15 } },
    traits: [
      { name: 'Monocle Shine', icon: '🔍', level: 1, bond: 0 },
      { name: 'Courtly Bow', icon: '🎩', level: 5, bond: 10 },
      { name: 'Coral Guard', icon: '🛡️', level: 12, bond: 30 },
      { name: 'Royal Snack', icon: '🍰', level: 20, bond: 60 },
    ],
    locked: [
      { name: "Knight's Charge", icon: '⚔️', level: 30, bond: 0 },
      { name: 'Coral Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_zee', element: 'sp_zee', name: 'Zee (Zero Point Sprite)', short: 'Zee', icon: '🌌',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF6FA8',
    puffleElement: 'Void', habitatLabel: 'Zero Reach', habitats: ['starlit', 'night'],
    likes: 'Star Pop', price: 225, titan: 'Zero Point Zenith',
    style: { primary: '#4A7BFF', secondary: '#C2D6FF', belly: '#EAF2FF', ear: '#8FB0FF', iris: '#7AFFD8', eyeShadow: '#0A1A5C', leaf: '#7A5CFF', leafGlow: '#C2B8FF', pads: '#B8C7FF' },
    personality: ['🌌 Cosmic', '🌀 Strange', '💙 Calm', '✨ Curious'],
    lore: 'Zee is a splinter of the Zero Point that learned to purr. Their fur holds a slow blue orbit, and the air around them hums like a held breath. Zee does not remember where they came from, but they are very interested in where everyone else is going.',
    stats: { fluffiness: 80, cuddliness: 78, magic: 100, joy: 84, luck: 92 },
    gene: { name: 'Zero Drift', icon: '🌌', desc: 'Night games pay +6 coins and XP gains +12%.', effect: { nightCoins: 6, xp: 1.12 } },
    traits: [
      { name: 'Blue Orbit', icon: '🌀', level: 1, bond: 0 },
      { name: 'Void Hum', icon: '🌌', level: 5, bond: 10 },
      { name: 'Zero Step', icon: '✨', level: 12, bond: 30 },
      { name: 'Event Horizon', icon: '🕳️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Point of No Return', icon: '🌠', level: 30, bond: 0 },
      { name: 'Zero Point Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_liluzi', element: 'sp_liluzi', name: "Lil' Uzi Vert Jr.", short: "Lil' Uzi", icon: '🎤',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Music', habitatLabel: 'Neon Verse', habitats: ['sugar', 'neon'],
    likes: 'Star Pop', price: 140, titan: 'Neon Verse Sovereign',
    style: { primary: '#B388FF', secondary: '#FFD1F0', belly: '#FFF0FF', ear: '#D1B3FF', iris: '#FFD166', eyeShadow: '#3A1B6B', leaf: '#FF71CE', leafGlow: '#FFB8E6', pads: '#FFD9E8' },
    personality: ['🎤 Confident', '💎 Flashy', '🎶 Rhythmic', '🌙 Up late'],
    lore: 'A pocket-sized rapper puffle with a diamond chain, a notebook full of bars, and absolutely no indoor voice. Lil\' Uzi Vert Jr. treats every hallway as a runway and every nap as an interlude. The chain is costume jewelry. The confidence is real.',
    stats: { fluffiness: 76, cuddliness: 74, magic: 70, joy: 94, luck: 80 },
    gene: { name: 'Neon Verse', icon: '🎤', desc: 'Games pay +4 coins and chats pay +2.', effect: { gameCoins: 4, chatCoins: 2 } },
    traits: [
      { name: 'Diamond Chain', icon: '💎', level: 1, bond: 0 },
      { name: 'Freestyle', icon: '🎤', level: 5, bond: 10 },
      { name: 'Neon Hook', icon: '🎶', level: 12, bond: 30 },
      { name: 'Verse Drop', icon: '🎧', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Encore Verse', icon: '📣', level: 30, bond: 0 },
      { name: 'Neon Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_aries', element: 'sp_aries', name: 'Aries Puffle', short: 'Aries', icon: '♈️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E89FF',
    puffleElement: 'Fire', habitatLabel: 'Emberpeak Arena', habitats: ['ember', 'savanna'],
    likes: 'Ember Steak', price: 120, titan: 'Ramhorn Sovereign',
    style: { primary: '#FFD1B8', secondary: '#FF8A5C', belly: '#FFF3E8', ear: '#FFB899', iris: '#E4572E', eyeShadow: '#7A2E1A', leaf: '#FF7A45', leafGlow: '#FFD9C2', pads: '#FFC2B8' },
    personality: ['🔥 Bold', '🐏 Headstrong', '🏁 First to try', '💥 Impatient'],
    lore: 'Aries Puffles are always first through the gate and first to regret it. Their curled horns catch the morning light, and a warm spark trails every charge. They headbutt problems, doors, and occasionally a very patient boulder, then look enormously pleased with the result.',
    stats: { fluffiness: 76, cuddliness: 72, magic: 78, joy: 92, luck: 74 },
    gene: { name: 'First Light', icon: '🔥', desc: 'Day games pay +4 coins and XP gains +8%.', effect: { dayCoins: 4, xp: 1.08 } },
    traits: [
      { name: 'Ram Horns', icon: '🐏', level: 1, bond: 0 },
      { name: 'Charge Start', icon: '🏁', level: 5, bond: 10 },
      { name: 'Brave Heart', icon: '❤️', level: 12, bond: 30 },
      { name: 'First to Dawn', icon: '🌅', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Comet Charge', icon: '☄️', level: 30, bond: 0 },
      { name: 'Golden Fleece', icon: '✨', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_taurus', element: 'sp_taurus', name: 'Taurus Puffle', short: 'Taurus', icon: '♉️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E89FF',
    puffleElement: 'Earth', habitatLabel: 'Golden Meadow', habitats: ['grove', 'crystal'],
    likes: 'Moon Cake', price: 120, titan: 'Goldenhorn Sovereign',
    style: { primary: '#E8DFC0', secondary: '#A8C97F', belly: '#F8F4E6', ear: '#D8CEA8', iris: '#6E9E45', eyeShadow: '#3F5C2A', leaf: '#8FB36A', leafGlow: '#D8F0B8', pads: '#C9A8A0' },
    personality: ['🌿 Steady', '🍰 Comfort-loving', '🪨 Stubborn', '💚 Loyal'],
    lore: 'Taurus Puffles treat a good patch of grass as a sacred trust. They settle in for the afternoon, refuse to be moved by weather or persuasion, and keep a small hoard of favourite snacks buried where only they can find it. Their calm is enormous, and so is their appetite.',
    stats: { fluffiness: 88, cuddliness: 86, magic: 70, joy: 76, luck: 72 },
    gene: { name: 'Golden Hoof', icon: '🌾', desc: 'Games pay +4 coins and needs fade 10% slower.', effect: { gameCoins: 4, needSlow: 0.9 } },
    traits: [
      { name: 'Soft Horns', icon: '🐂', level: 1, bond: 0 },
      { name: 'Meadow Nap', icon: '🌾', level: 5, bond: 10 },
      { name: 'Garden Hoard', icon: '🌼', level: 12, bond: 30 },
      { name: 'Unshakable', icon: '🪨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Golden Meadow', icon: '👑', level: 30, bond: 0 },
      { name: 'Earthbound Promise', icon: '💚', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_gemini', element: 'sp_gemini', name: 'Gemini Puffle', short: 'Gemini', icon: '♊️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E89FF',
    puffleElement: 'Air', habitatLabel: 'Twinlight Ridge', habitats: ['aurora', 'sugar'],
    likes: 'Star Pop', price: 120, titan: 'Twinlight Sovereign',
    style: { primary: '#D8E8FF', secondary: '#FFE8A8', belly: '#F8FBFF', ear: '#C2D8FF', iris: '#5A8CD8', eyeShadow: '#2F4A7A', leaf: '#FFD166', leafGlow: '#FFF0B8', pads: '#E8D8FF' },
    personality: ['💬 Chatty', '🌀 Curious', '🎭 Two moods', '✨ Quick'],
    lore: 'Gemini Puffles hold two conversations at once and lose track of both. Their twin tufts swivel toward every new sound, and they change direction mid-step as though a second thought just arrived. Nobody has ever seen one genuinely bored.',
    stats: { fluffiness: 80, cuddliness: 84, magic: 82, joy: 94, luck: 80 },
    gene: { name: 'Double Take', icon: '💬', desc: 'Gifts arrive 20% sooner and chats pay +2 coins.', effect: { giftSpeed: 1.2, chatCoins: 2 } },
    traits: [
      { name: 'Twin Tufts', icon: '👯', level: 1, bond: 0 },
      { name: 'Echo Chat', icon: '💬', level: 5, bond: 10 },
      { name: 'Quick Switch', icon: '🔄', level: 12, bond: 30 },
      { name: 'Two-Way Wish', icon: '🌠', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Mirror Step', icon: '🪞', level: 30, bond: 0 },
      { name: 'Twin Star', icon: '⭐', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_cancer', element: 'sp_cancer', name: 'Cancer Puffle', short: 'Cancer', icon: '♋️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E89FF',
    puffleElement: 'Water', habitatLabel: 'Tideglass Shore', habitats: ['tide', 'reef'],
    likes: 'Coconut Water', price: 120, titan: 'Tideclaw Sovereign',
    style: { primary: '#C2E8F0', secondary: '#FFB8C8', belly: '#F4FDFF', ear: '#D8F0F5', iris: '#3FAED0', eyeShadow: '#2F5F7A', leaf: '#F48FB1', leafGlow: '#FFD1E0', pads: '#FFC9D8' },
    personality: ['🦀 Protective', '🌊 Tender', '🏠 Homebody', '🌙 Sensitive'],
    lore: 'Cancer Puffles carry their homes on their backs and their hearts on their sleeves. They arrange shells into little doorways, fuss over anyone who looks cold, and retreat into their fluff when the day gets loud. The claw is for hugs, mostly.',
    stats: { fluffiness: 86, cuddliness: 90, magic: 76, joy: 82, luck: 70 },
    gene: { name: 'Shellter', icon: '🐚', desc: 'Needs fade 15% slower and pets build +10% bond.', effect: { needSlow: 0.85, petBond: 1.1 } },
    traits: [
      { name: 'Tide Claws', icon: '🦀', level: 1, bond: 0 },
      { name: 'Shell Nap', icon: '🐚', level: 5, bond: 10 },
      { name: 'Home Sense', icon: '🏠', level: 12, bond: 30 },
      { name: 'Moon Pull', icon: '🌙', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Pearl Guard', icon: '🛡️', level: 30, bond: 0 },
      { name: 'Deep Shelter', icon: '🌊', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_leo', element: 'sp_leo', name: 'Leo Puffle', short: 'Leo', icon: '♌️',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Fire', habitatLabel: 'Sunmane Savanna', habitats: ['savanna', 'ember'],
    likes: 'Sun Nectar', price: 150, titan: 'Sunmane Sovereign',
    style: { primary: '#FFE0A8', secondary: '#FFB347', belly: '#FFF7E0', ear: '#FFD180', iris: '#E89A18', eyeShadow: '#7A4A00', leaf: '#FFC44D', leafGlow: '#FFF0B8', pads: '#FFD1A8' },
    personality: ['👑 Proud', '☀️ Warm', '🎭 Dramatic', '💛 Generous'],
    lore: 'Leo Puffles believe every room is improved by their entrance. Their golden mane catches the sun, their purr has a theatrical rumble, and they will share the warmest spot on the rock with anyone who applauds first. The crown is imaginary. The confidence is not.',
    stats: { fluffiness: 90, cuddliness: 86, magic: 84, joy: 96, luck: 88 },
    gene: { name: 'Sunmane', icon: '☀️', desc: 'Day games pay +5 coins and joy fades 10% slower.', effect: { dayCoins: 5, joyMod: 0.9 } },
    traits: [
      { name: 'Sun Mane', icon: '☀️', level: 1, bond: 0 },
      { name: 'Proud Stretch', icon: '🦁', level: 5, bond: 10 },
      { name: 'Warm Roar', icon: '📣', level: 12, bond: 30 },
      { name: 'Golden Heart', icon: '💛', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Solar Crown', icon: '👑', level: 30, bond: 0 },
      { name: 'Lion Dawn', icon: '🌅', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_virgo', element: 'sp_virgo', name: 'Virgo Puffle', short: 'Virgo', icon: '♍️',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Earth', habitatLabel: 'Harvest Grove', habitats: ['grove', 'mycelium'],
    likes: 'Honey Drop', price: 150, titan: 'Wheatlight Sovereign',
    style: { primary: '#E8F0D8', secondary: '#C9D9A8', belly: '#FAFDF2', ear: '#DCE8C8', iris: '#7A9E52', eyeShadow: '#4A5C2F', leaf: '#A8C97A', leafGlow: '#E8F5C9', pads: '#D8C0A0' },
    personality: ['🌾 Precise', '🧺 Helpful', '📋 Neat', '🌱 Quietly kind'],
    lore: 'Virgo Puffles sort the harvest by size, colour, and a system only they understand. A wheat tuft marks the spot behind their ears, and they leave neat little piles of seeds wherever they forage. They will absolutely fix your blanket without being asked.',
    stats: { fluffiness: 84, cuddliness: 82, magic: 80, joy: 78, luck: 90 },
    gene: { name: 'Harvest Hand', icon: '🌾', desc: 'Snacks give +20% XP and pets build +10% bond.', effect: { snackXp: 1.2, petBond: 1.1 } },
    traits: [
      { name: 'Wheat Tuft', icon: '🌾', level: 1, bond: 0 },
      { name: 'Neat Paw', icon: '🧹', level: 5, bond: 10 },
      { name: 'Harvest Eye', icon: '🔍', level: 12, bond: 30 },
      { name: 'Quiet Gift', icon: '🎁', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Golden Harvest', icon: '🌻', level: 30, bond: 0 },
      { name: 'Perfect Bloom', icon: '🌼', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_libra', element: 'sp_libra', name: 'Libra Puffle', short: 'Libra', icon: '♎️',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Air', habitatLabel: 'Balanced Sky', habitats: ['aurora', 'starlit'],
    likes: 'Honeycomb Cake', price: 150, titan: 'Evenhand Sovereign',
    style: { primary: '#F0E0FF', secondary: '#C9B8F0', belly: '#FFF8FF', ear: '#E0D1FF', iris: '#9B7BE0', eyeShadow: '#5A3F8C', leaf: '#B8A0E8', leafGlow: '#F0E8FF', pads: '#FFD6F0' },
    personality: ['⚖️ Fair', '🌸 Charming', '🎨 Aesthetic', '🤝 Peacemaking'],
    lore: 'Libra Puffles cannot leave a room unbalanced. They nudge two uneven cushions into place, split every snack exactly in half, and quietly referee arguments between sprites who did not know they were arguing. Their scales are decorative. Their sense of fairness is not.',
    stats: { fluffiness: 86, cuddliness: 88, magic: 82, joy: 86, luck: 92 },
    gene: { name: 'Fair Trade', icon: '⚖️', desc: 'Gifts arrive 15% sooner and chats pay +2 coins.', effect: { giftSpeed: 1.15, chatCoins: 2 } },
    traits: [
      { name: 'Balanced Ears', icon: '⚖️', level: 1, bond: 0 },
      { name: 'Sweet Reason', icon: '🌸', level: 5, bond: 10 },
      { name: 'Even Step', icon: '🤝', level: 12, bond: 30 },
      { name: 'Harmony Aura', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Scales of Light', icon: '⚖️', level: 30, bond: 0 },
      { name: 'Perfect Balance', icon: '💠', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_scorpio', element: 'sp_scorpio', name: 'Scorpio Puffle', short: 'Scorpio', icon: '♏️',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Water', habitatLabel: 'Nightsting Caverns', habitats: ['night', 'crystal'],
    likes: 'Moon Berry', price: 150, titan: 'Nightsting Sovereign',
    style: { primary: '#E8C8D8', secondary: '#8C4A6B', belly: '#FFF0F6', ear: '#D8B0C2', iris: '#C94A7A', eyeShadow: '#5A1F3A', leaf: '#A85C7A', leafGlow: '#F0C2D8', pads: '#D8A0B8' },
    personality: ['🦂 Intense', '🌑 Secretive', '💜 Devoted', '🔍 Perceptive'],
    lore: 'Scorpio Puffles notice everything and admit nothing. They keep to the cool edges of the cavern, watch the room from under a curved tail, and remember exactly who was kind to them. Once a Scorpio Puffle chooses you, it is for life.',
    stats: { fluffiness: 78, cuddliness: 76, magic: 94, joy: 74, luck: 84 },
    gene: { name: 'Nightsting', icon: '🌑', desc: 'Night games pay +5 coins and energy fades 12% slower.', effect: { nightCoins: 5, energyDecay: 0.88 } },
    traits: [
      { name: 'Sting Curl', icon: '🦂', level: 1, bond: 0 },
      { name: 'Hidden Step', icon: '🌑', level: 5, bond: 10 },
      { name: 'Night Sense', icon: '👁️', level: 12, bond: 30 },
      { name: 'Deep Devotion', icon: '💜', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Shadow Sting', icon: '🗡️', level: 30, bond: 0 },
      { name: 'Star Sting', icon: '🌠', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_sagittarius', element: 'sp_sagittarius', name: 'Sagittarius Puffle', short: 'Sagittarius', icon: '♐️',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Fire', habitatLabel: 'Starfall Range', habitats: ['savanna', 'aurora'],
    likes: 'Star Cookie', price: 195, titan: 'Stararcher Sovereign',
    style: { primary: '#FFE8C2', secondary: '#D88C4A', belly: '#FFF8EC', ear: '#FFD8A8', iris: '#C96A2E', eyeShadow: '#6E3A12', leaf: '#E89A4A', leafGlow: '#FFE0B8', pads: '#E8C2A8' },
    personality: ['🏹 Adventurous', '🌠 Optimistic', '🗺️ Restless', '🔥 Honest'],
    lore: 'Sagittarius Puffles aim at horizons and usually hit the wrong one beautifully. They pack for a short walk and return three biomes later with a story, a new friend, and someone else lunch. Their arrow points wherever the next adventure is.',
    stats: { fluffiness: 82, cuddliness: 78, magic: 88, joy: 94, luck: 90 },
    gene: { name: 'Farflight', icon: '🏹', desc: 'Exploration restores +4 stamina and XP gains +10%.', effect: { exploreStamina: 4, xp: 1.1 } },
    traits: [
      { name: 'Archer Tuft', icon: '🏹', level: 1, bond: 0 },
      { name: 'Trail Sniff', icon: '🐾', level: 5, bond: 10 },
      { name: 'Far Sight', icon: '🔭', level: 12, bond: 30 },
      { name: 'Lucky Flight', icon: '🌠', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Comet Arrow', icon: '☄️', level: 30, bond: 0 },
      { name: 'Endless Horizon', icon: '🌅', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_capricorn', element: 'sp_capricorn', name: 'Capricorn Puffle', short: 'Capricorn', icon: '♑️',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Earth', habitatLabel: 'Summit Hollow', habitats: ['crystal', 'grove'],
    likes: 'Berry Mash', price: 195, titan: 'Summitcrown Sovereign',
    style: { primary: '#D8E0D0', secondary: '#7A9E8C', belly: '#F4F8F0', ear: '#C2D1C2', iris: '#4A8C7A', eyeShadow: '#2F4A3F', leaf: '#6B8C7A', leafGlow: '#D8F0E0', pads: '#C9B8A8' },
    personality: ['⛰️ Determined', '📈 Ambitious', '🪨 Patient', '🖤 Dry humor'],
    lore: 'Capricorn Puffles climb the long way because the long way has the best view. They set a goal, plant their small hooves, and keep going after everyone else has sat down. A sea-goat tail flicks behind them when a plan finally works.',
    stats: { fluffiness: 88, cuddliness: 80, magic: 86, joy: 80, luck: 86 },
    gene: { name: 'Summit Grit', icon: '⛰️', desc: 'Energy fades 18% slower and games pay +3 coins.', effect: { energyDecay: 0.82, gameCoins: 3 } },
    traits: [
      { name: 'Summit Horns', icon: '🐐', level: 1, bond: 0 },
      { name: 'Sure Foot', icon: '🪨', level: 5, bond: 10 },
      { name: 'Long Climb', icon: '⛰️', level: 12, bond: 30 },
      { name: 'Quiet Resolve', icon: '🖤', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Peak Crown', icon: '👑', level: 30, bond: 0 },
      { name: 'Mountain Promise', icon: '🏔️', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_aquarius', element: 'sp_aquarius', name: 'Aquarius Puffle', short: 'Aquarius', icon: '♒️',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Air', habitatLabel: 'Rainveil Springs', habitats: ['tide', 'aurora'],
    likes: 'Cloudcakes', price: 195, titan: 'Rainbearer Sovereign',
    style: { primary: '#C2EFFF', secondary: '#5CBFE8', belly: '#F0FDFF', ear: '#A8E0F5', iris: '#2F9EC9', eyeShadow: '#1F5F7A', leaf: '#5CC8E8', leafGlow: '#D8F8FF', pads: '#B8D8E8' },
    personality: ['💧 Independent', '💡 Inventive', '🌐 Unusual', '🤝 Community-minded'],
    lore: 'Aquarius Puffles carry weather with them and ideas slightly ahead of schedule. Their little water jar never empties, their fur smells faintly of rain, and they will explain a brilliant invention to anyone who stands still long enough. The invention usually works.',
    stats: { fluffiness: 80, cuddliness: 82, magic: 96, joy: 88, luck: 84 },
    gene: { name: 'Rainbearer', icon: '💧', desc: 'Needs fade 10% slower and gifts arrive 20% sooner.', effect: { needSlow: 0.9, giftSpeed: 1.2 } },
    traits: [
      { name: 'Rain Drop', icon: '💧', level: 1, bond: 0 },
      { name: 'Odd Idea', icon: '💡', level: 5, bond: 10 },
      { name: 'Crowd Song', icon: '🎶', level: 12, bond: 30 },
      { name: 'Future Sense', icon: '🔮', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Storm Vessel', icon: '🏺', level: 30, bond: 0 },
      { name: 'Galaxy Current', icon: '🌌', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_pisces', element: 'sp_pisces', name: 'Pisces Puffle', short: 'Pisces', icon: '♓️',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Water', habitatLabel: 'Dreamtide Lagoon', habitats: ['tide', 'dream'],
    likes: 'Kelp Crisps', price: 195, titan: 'Dreamtide Sovereign',
    style: { primary: '#D8D0FF', secondary: '#8C9EFF', belly: '#F8F4FF', ear: '#C2B8FF', iris: '#6B7AD8', eyeShadow: '#3A3F8C', leaf: '#9B8CE8', leafGlow: '#E8E0FF', pads: '#C9C2F0' },
    personality: ['🐟 Dreamy', '🌊 Empathetic', '🎨 Imaginative', '🌙 Escapist'],
    lore: 'Pisces Puffles swim through half-remembered dreams and arrive smelling of salt and starlight. Their twin fish tails flick in opposite directions, their eyes go soft at the sound of rain, and they always know when someone needs a quiet friend. They may also be thinking about lunch.',
    stats: { fluffiness: 94, cuddliness: 92, magic: 90, joy: 90, luck: 88 },
    gene: { name: 'Dream Current', icon: '🌊', desc: 'Night games pay +5 coins and energy fades 15% slower.', effect: { nightCoins: 5, energyDecay: 0.85 } },
    traits: [
      { name: 'Fish Tail', icon: '🐟', level: 1, bond: 0 },
      { name: 'Dream Bubble', icon: '🫧', level: 5, bond: 10 },
      { name: 'Deep Empathy', icon: '💙', level: 12, bond: 30 },
      { name: 'Tide Whisper', icon: '🌊', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Two Fishes', icon: '🐠', level: 30, bond: 0 },
      { name: 'Ocean Dream', icon: '🌌', level: 45, bond: 90 },
    ],
  },
];

SPRITE_PUFFLE_FAMILY.forEach((row) => {
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[row.rarity] : null;
  if (!style) return;
  row.color = style.color;
  row.gradient = style.gradient;
  row.glow = style.glow;
});

/* The family's signature headpieces. Pinning them keeps every breed readable
   even where the shared name rules would pick a neighbouring motif. */
const SPRITE_PUFFLE_FAMILY_MOTIFS = {
  sp_sprite: 'cloud', sp_blossom: 'petal', sp_frost: 'ice', sp_sunbeam: 'sun',
  sp_moonmist: 'moon', sp_forest: 'leaf', sp_bubble: 'drop', sp_storm: 'bolt',
  sp_dream: 'halo', sp_rainbow: 'rainbow', sp_ancient: 'star',
  sp_admin: 'gear', sp_festival: 'lantern', sp_retro: 'pixel',
  sp_meme: 'meme', sp_showcase: 'screen',
  sp_minimiku: 'music', sp_squiplash: 'drop', sp_siroscar: 'crown',
  sp_zee: 'star', sp_liluzi: 'music',
  sp_aries: 'zodiac-aries', sp_taurus: 'zodiac-taurus', sp_gemini: 'zodiac-gemini',
  sp_cancer: 'zodiac-cancer', sp_leo: 'zodiac-leo', sp_virgo: 'zodiac-virgo',
  sp_libra: 'zodiac-libra', sp_scorpio: 'zodiac-scorpio', sp_sagittarius: 'zodiac-sagittarius',
  sp_capricorn: 'zodiac-capricorn', sp_aquarius: 'zodiac-aquarius', sp_pisces: 'zodiac-pisces',
};

const SPRITE_PUFFLE_FAMILY_BY_ELEMENT = SPRITE_PUFFLE_FAMILY.reduce((map, row) => {
  map[row.element] = row;
  return map;
}, {});

(function registerSpritePuffleFamily() {
  if (typeof ELEMENTS === 'undefined' || !ELEMENTS) return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  SPRITE_PUFFLE_FAMILY.forEach((row) => {
    if (!ELEMENTS[row.key]) {
      ELEMENTS[row.key] = {
        name: row.name,
        primary: row.style.primary,
        light: row.style.secondary,
        deep: row.style.eyeShadow,
        accent: row.style.iris,
        trait: `${row.icon} ${row.name} — ${row.personality.join(' · ')}`,
        blurb: row.lore,
        greeting: row.key === 'sp_sprite' ? 'You look like a warm spot. I am sitting here now.' : 'I found you. That was the whole plan.',
        likes: row.likes,
        puffleStyle: row.key,
        puffleElement: row.puffleElement,
        collectionTier: row.tier,
        collectionTierName: row.rarityLabel,
        spritePuffleFamily: row.key,
        rarity: row.rarity,
        eggRarity: row.rarity,
      };
    }
    if (table && !table[row.key]) {
      table[row.key] = {
        hidden: true,
        tier: row.tier,
        name: row.name,
        theme: `${row.rarityLabel} ${row.name} — ${row.icon} ${row.personality.join(' ')}`,
        primary: row.style.primary,
        secondary: row.style.secondary,
        belly: row.style.belly,
        ear: row.style.ear,
        iris: row.style.iris,
        eyeShadow: row.style.eyeShadow,
        leaf: row.style.leaf,
        leafGlow: row.style.leafGlow,
        pads: row.style.pads,
        gold: row.style.gold,
        motif: SPRITE_PUFFLE_FAMILY_MOTIFS[row.key],
      };
    }
    if (typeof GENE_POWERS !== 'undefined') GENE_POWERS[row.key] = row.gene;
    if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[row.key] = row.titan;
    if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[row.key] = row.price;
    if (typeof TYPE_EGG_PRICE !== 'undefined' && typeof discountedEggPrice === 'function') TYPE_EGG_PRICE[row.key] = discountedEggPrice(row.price);
    if (typeof NAME_START !== 'undefined') NAME_START[row.key] = [row.short.split(' ')[0], 'Puffle', 'Puff', 'Tuft'];
    if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(row.key)) ELEMENT_KEYS.push(row.key);
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(row.key)) TYPE_EGG_SPECIES.push(row.key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(row.key)) WILD_SPECIES.push(row.key);
    row.habitats.forEach((scene) => {
      if (typeof SCENES !== 'undefined' && SCENES[scene] && !SCENES[scene].species.includes(row.key)) SCENES[scene].species.push(row.key);
    });
  });
  if (table && typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
})();

function spritePuffleFamilyFor(sprite) {
  if (!sprite || !sprite.element) return null;
  const direct = SPRITE_PUFFLE_FAMILY_BY_ELEMENT[sprite.element];
  if (direct) return direct;
  /* Gold and other finish shells carry the base breed in variantOf. */
  const variantOf = typeof ELEMENTS !== 'undefined' ? ELEMENTS[sprite.element]?.variantOf : null;
  return variantOf ? SPRITE_PUFFLE_FAMILY_BY_ELEMENT[variantOf] || null : null;
}

function spritePuffleFamilyRarity(row) {
  if (!row) return null;
  const tier = typeof window.puffleRarityTier === 'function' ? window.puffleRarityTier(row.rarity) : null;
  return {
    name: row.rarityLabel,
    stars: row.stars,
    icon: row.icon,
    color: row.color,
    blurb: tier ? tier.blurb : '',
  };
}

/* One compact but complete family sheet: the cloud showcase, fluff stats, four
   personality notes, lore, level/bond traits, variant previews, bond progress,
   the real gene power and this Puffle's place on the family ladder. */
function spritePuffleFamilyPanelHTML(sprite) {
  if (!sprite || typeof spritePuffleFamilyFor !== 'function') return '';
  const row = spritePuffleFamilyFor(sprite);
  if (!row) return '';
  const rarity = spritePuffleFamilyRarity(row);
  const level = Math.max(1, Number(sprite.level) || 1);
  const bond = Math.max(0, Math.min(100, Number(sprite.bond) || 0));
  const bondLevel = Math.floor(bond / 10) + 1;
  const gene = (typeof GENE_POWERS !== 'undefined' && GENE_POWERS[sprite.element]) || row.gene;
  const rank = typeof bondRankFor === 'function' ? bondRankFor(bond) : null;
  const weight = typeof PuffleWeight !== 'undefined' ? PuffleWeight.forSprite(sprite) : null;
  const rolled = typeof window.pufflePersonalityFor === 'function' ? window.pufflePersonalityFor(sprite) : null;
  const skill = typeof spriteTraits === 'function' ? spriteTraits(sprite).ability : null;
  const theme = typeof window.puffleThemeFor === 'function' ? window.puffleThemeFor(sprite) : null;
  const traitChip = (trait) => {
    const unlocked = level >= (trait.level || 1) && bond >= (trait.bond || 0);
    const need = trait.bond ? `Lv ${trait.level} · ${trait.bond} bond` : `Lv ${trait.level}`;
    return `<span class="chip family-trait ${unlocked ? 'on' : 'locked'}" title="${unlocked ? 'Unlocked' : `Unlocks at ${need}`}">${unlocked ? '✅' : '🔒'} ${trait.icon || '✦'} ${esc(trait.name)}${unlocked ? '' : ` <span class="tiny muted">${need}</span>`}</span>`;
  };
  const statRows = Object.keys(row.stats).map((key, index) => {
    const value = row.stats[key];
    return `<div class="family-stat" style="--i:${index}"><span class="family-stat-label">${key.toUpperCase()}</span><span class="family-stat-bar"><i style="width:${value}%"></i></span><b>${value}</b></div>`;
  }).join('');
  const styleTable = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const savedStyle = (typeof lumiPuffleStyleOfSprite === 'function' ? lumiPuffleStyleOfSprite(sprite) : sprite.puffleVariant) || row.key;
  const classicKeys = typeof window !== 'undefined' && Array.isArray(window.LUMI_CLASSIC_PUFFLE_COLOR_KEYS)
    ? window.LUMI_CLASSIC_PUFFLE_COLOR_KEYS
    : [];
  const variants = [
    { key: row.key, label: 'Normal' },
    ...classicKeys.map((key) => ({
      key,
      label: (styleTable && styleTable[key] && (styleTable[key].colorLabel || styleTable[key].name.replace(' Puffle', ''))) || key,
    })),
    { key: 'golden_guardian', label: 'Shiny' },
    { key: 'blossom', label: 'Seasonal' },
    { key: 'aurora', label: 'Event' },
  ];
  if (savedStyle && styleTable && styleTable[savedStyle] && !variants.some((v) => v.key === savedStyle)) {
    variants.push({ key: savedStyle, label: styleTable[savedStyle].name.replace(' Puffle', '') });
  }
  const currentStyle = savedStyle || row.key;
  const finishKeys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  const currentFinish = typeof FINISHES !== 'undefined' && FINISHES[sprite.variant] ? sprite.variant : '';
  const finishes = [
    { key: '', label: 'None', owned: true },
    ...finishKeys.map((key) => ({
      key,
      label: `${FINISHES[key].icon} ${FINISHES[key].name}`,
      owned: typeof finishIsOwned === 'function' ? finishIsOwned(key) : true,
    })),
  ];
  const preview = typeof spriteSVG === 'function'
    ? spriteSVG({ ...sprite, puffleVariant: currentStyle, variant: currentFinish || null, accessory: sprite.accessory || 'none' }, { still: true }).replace('<svg ', '<svg width="108" height="108" ')
    : '';
  const cosmeticKeys = ['none', 'flowercrown', 'scarf', 'bow', 'halo', 'starclip'];
  const cosmetics = cosmeticKeys
    .filter((key) => key === 'none' || (typeof ACCESSORIES !== 'undefined' && ACCESSORIES[key]))
    .map((key) => {
      const item = key === 'none' ? { icon: '∅', name: 'None' } : ACCESSORIES[key];
      return `<button type="button" class="chip family-cosmetic ${(sprite.accessory || 'none') === key ? 'on' : ''}" data-family-cosmetic="${key}">${item.icon} ${esc(item.name)}</button>`;
    }).join('');
  const born = Number(sprite.born) || Number(sprite.createdAt) || Date.now();
  const bornLabel = new Date(born).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const inHollow = typeof state !== 'undefined' && Array.isArray(state.sprites)
    ? state.sprites.filter((entry) => entry.element === sprite.element).length : 1;
  return `<div class="card family-card" data-family-card="${row.key}">
    <div class="family-head">
      <div>
        <div class="family-eyebrow">SPRITE PUFFLE FAMILY</div>
        <h3 class="family-name">${row.icon} ${esc(row.name)}</h3>
        <div class="family-meta">${rarity.icon} ${esc(rarity.name)} ${'★'.repeat(Math.min(8, rarity.stars))} · Lv ${level} · ${esc(row.habitatLabel)}${weight ? ` · ⚖️ ${weight.lb.toFixed(1)} lb` : ''}</div>
      </div>
      <div class="family-cloud-seal" aria-hidden="true">☁️</div>
    </div>

    <div class="family-showcase" data-family-showcase>
      <div class="family-bubble" data-family-bubble hidden>“Do you have any snacks?”</div>
      <div class="family-cloud-pedestal" aria-hidden="true"><span>☁️</span></div>
      <div class="family-actions">
        <button type="button" class="btn btn-primary" data-family-pet>❤️ Pet</button>
        <button type="button" class="btn btn-soft" data-family-feed>🍽 Feed</button>
        <button type="button" class="btn btn-soft" data-family-play>🎾 Play</button>
        <button type="button" class="btn btn-soft" data-family-home>🏠 Home</button>
        <button type="button" class="btn btn-soft" data-family-photo>📸 Photo</button>
      </div>
    </div>

    <div class="family-section">
      <div class="family-section-title">FLUFF ATTRIBUTES</div>
      <div class="family-stats">${statRows}</div>
    </div>

    <div class="family-section">
      <div class="family-section-title">PERSONALITY</div>
      <div class="family-chip-row">${row.personality.map((trait) => `<span class="chip">${esc(trait)}</span>`).join('')}</div>
      ${rolled ? `<div class="family-chip-row" data-family-personality style="margin-top:7px">
        <span class="chip" style="border-color:${rolled.primary.color};font-weight:800" title="${esc(rolled.primary.bonus)}">${rolled.primary.icon} ${esc(rolled.primary.name)}</span>
        <span class="chip" style="border-color:${rolled.secondary.color}" title="${esc(rolled.secondary.bonus)}">${rolled.secondary.icon} ${esc(rolled.secondary.name)}</span>
        <span class="tiny muted" style="align-self:center">rolled from the ${esc(row.name)} pool</span>
      </div>` : ''}
      ${skill ? `<div class="family-chip-row" data-family-skill style="margin-top:6px">
        <span class="chip" style="border-color:var(--accent);font-weight:800">${skill.icon} ${esc(skill.name)}</span>
        <span class="tiny muted" style="align-self:center">${esc(skill.desc)}</span>
      </div>` : ''}
      ${theme ? `<div class="family-chip-row" data-family-theme="${esc(theme.key)}" style="margin-top:6px">
        <span class="chip" style="border-color:${esc(theme.colors[0])};font-weight:800">${theme.icon} ${esc(theme.name)} theme</span>
        <span style="display:inline-flex;gap:3px;align-self:center">${theme.colors.map((hex) => `<i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${esc(hex)};border:1px solid rgba(0,0,0,.28)"></i>`).join('')}</span>
        <span class="tiny muted" style="align-self:center">${esc(theme.desc)}</span>
      </div>` : ''}
      <p class="family-lore">${esc(row.lore)}</p>
    </div>

    <div class="family-section">
      <div class="family-section-title">UNIQUE TRAITS</div>
      <div class="family-chip-row">${row.traits.map(traitChip).join('')}${row.locked.map(traitChip).join('')}</div>
    </div>

    <div class="family-section">
      <div class="between"><div class="family-section-title">SPRITE PUFFLE STYLES</div><span class="tiny muted">Apply to save</span></div>
      <div class="family-variant-tabs">${variants.map((v) => `<button type="button" class="chip family-variant ${v.key === currentStyle ? 'on' : ''}" data-family-variant="${v.key}">${esc(v.label)}</button>`).join('')}</div>
      <div class="between" style="margin-top:10px"><div class="family-section-title">FINISHES</div><span class="tiny muted">${finishKeys.length} shells</span></div>
      <div class="family-variant-tabs">${finishes.map((finish) => `<button type="button" class="chip family-variant ${finish.key === currentFinish ? 'on' : ''}${finish.owned ? '' : ' is-locked'}" data-family-finish="${finish.key}"${finish.owned ? '' : ' title="Own this finish on a hatched sprite first"'}>${esc(finish.label)}</button>`).join('')}</div>
      <div class="family-variant-preview" data-family-variant-preview data-accessory="${esc(sprite.accessory || 'none')}" data-finish="${currentFinish}">${preview}</div>
    </div>

    <div class="family-section">
      <div class="between"><div class="family-section-title">COSMETICS</div><span class="tiny muted">Apply to save</span></div>
      <div class="family-chip-row">${cosmetics}</div>
    </div>

    <div class="family-section">
      <div class="between"><div class="family-section-title">SAVED LOOK</div><span class="tiny muted" data-family-apply-status>Preview changes, then apply</span></div>
      <p class="tiny muted" style="margin:6px 0 8px;line-height:1.5">Photo Mode uses this saved look. Only finishes owned on a hatched sprite can be applied; None is always available.</p>
      <button type="button" class="btn btn-primary btn-block" data-family-apply>Apply look</button>
    </div>

    <div class="family-section">
      <div class="between"><div class="family-section-title">BOND LEVEL ${bondLevel}</div><span class="tiny muted">${Math.round(bond)} / 100</span></div>
      <div class="bar bond family-bond-bar"><i style="width:${bond}%"></i></div>
      <div class="between tiny muted" style="margin-top:6px"><span>${rank ? `${rank.icon || '💗'} ${esc(rank.name)}` : 'Bond grows with every pet and meal.'}</span><span>Next at ${Math.min(100, bondLevel * 10)}</span></div>
    </div>

    <div class="family-passive">
      <div class="family-section-title">PASSIVE ABILITY</div>
      <div class="family-passive-name">${gene.icon || '✨'} ${esc(gene.name)}</div>
      <p>${esc(gene.desc)}</p>
    </div>

    <div class="family-section">
      <div class="family-section-title">COLLECTION</div>
      <div class="family-info">
        <span>Owned <b>Yes</b></span>
        <span>Shiny found <b>${sprite.shiny ? 'Yes' : 'No'}</b></span>
        <span>Max level <b>${level >= (typeof MAX_LEVEL !== 'undefined' ? MAX_LEVEL : 100) ? 'Yes' : 'No'}</b></span>
        <span>In your Hollow <b>${inHollow}</b></span>
        <span>First found <b>${esc(bornLabel)}</b></span>
        <span>Stage <b>${typeof stageLabel === 'function' ? esc(stageLabel(sprite)) : esc(sprite.stage || 'baby')}</b></span>
      </div>
    </div>

    <div class="family-section">
      <div class="family-section-title">FAMILY LADDER</div>
      <div class="family-lineage">${SPRITE_PUFFLE_FAMILY.map((entry) => `<span class="chip family-lineage-chip ${entry.key === row.key ? 'on' : ''}" title="${esc(entry.rarityLabel)}">${entry.icon} ${esc(entry.short)}</span>`).join('')}</div>
    </div>
  </div>`;
}

/* Named hybrids for the Sprite Puffle breeds. Each of the five event and arcade
   breeds pairs with a founding breed and with an existing wave, and the six
   founding breeds that had no pair get one with an existing wave too, so every
   member of the family is reachable from the wider breeder codex. */
const SPRITE_PUFFLE_FAMILY_HYBRIDS = {
  'sp_admin+sp_sprite': 'Root Puffle',
  'sp_festival+sp_blossom': 'Lantern Blossom',
  'sp_retro+sp_frost': 'Pixel Frost',
  'sp_meme+sp_dream': 'Meme Dream',
  'sp_showcase+sp_rainbow': 'Showcase Rainbow',
  'sp_admin+arcadebot': 'Console Arcade',
  'sp_festival+lanternlop': 'Festival Lantern',
  'sp_retro+pixelinvader': 'Pixel Retro',
  'sp_meme+ohiocat': 'Meme Cat',
  'sp_showcase+sitcomcat': 'Studio Sitcom',
  'sp_sunbeam+radiant': 'Sunreach Radiant',
  'sp_moonmist+dusk': 'Moonlit Dusk',
  'sp_forest+bloom': 'Deeproot Bloom',
  'sp_bubble+tide': 'Bubble Tide',
  'sp_storm+volt': 'Storm Volt',
  'sp_ancient+angel': 'Ancient Halo',
};
if (typeof HYBRID_NAMES !== 'undefined') Object.assign(HYBRID_NAMES, SPRITE_PUFFLE_FAMILY_HYBRIDS);
