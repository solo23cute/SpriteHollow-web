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
    likes: 'Cloud Cupcake', price: 70, titan: 'Cloudsoft Sovereign',
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
    likes: 'Honeycomb Cake', price: 90, titan: 'Blossomheart Guardian',
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
    likes: 'Moon Berry', price: 130, titan: 'Deeproot Colossus',
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
    likes: 'Moon Berry', price: 175, titan: 'Slumberland Warden',
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
    likes: 'Lava Cookie', price: 300, titan: 'Dawnsong Archon',
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
  "likes": "Lava Cookie",
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
  "likes": "Cotton Candy",
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
    likes: 'Moon Berry', price: 120, titan: 'Goldenhorn Sovereign',
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
    likes: 'Honeycomb Cake', price: 150, titan: 'Wheatlight Sovereign',
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
    likes: 'Lava Cookie', price: 195, titan: 'Stararcher Sovereign',
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
    likes: 'Berry Cheesecake', price: 195, titan: 'Summitcrown Sovereign',
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
    likes: 'Cloud Cupcake', price: 195, titan: 'Rainbearer Sovereign',
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
    likes: 'Crunch Crisps', price: 195, titan: 'Dreamtide Sovereign',
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
  {
    key: 'sp_hedgehog', element: 'sp_hedgehog', name: 'Hedgehog Puffle', short: 'Hedgehog', icon: '🦔',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#C9CDD2',
    puffleElement: 'Earth', habitatLabel: 'Rustleleaf Thicket', habitats: ['mycelium', 'grove'],
    likes: 'Berry Cheesecake', price: 70, titan: 'Hushquill Warden',
    style: { primary: '#E8D3B8', secondary: '#FFF3E2', belly: '#FFF9F0', ear: '#D8BC9C', iris: '#7A5A3C', eyeShadow: '#4A3423', leaf: '#B08A5E', leafGlow: '#FFE8C9', pads: '#F4C9D4' },
    personality: ['🦔 Shy', '🍂 Rustly', '🌰 Snacker', '💤 Curls up'],
    lore: 'A round brown burr that rustles when it walks. Hedgehog Puffles hoard exactly four leaves at a time, arrange them into a nest they then refuse to leave, and go completely still if anyone looks at them too quickly. The quills are far softer than they look, which is the only secret they guard.',
    stats: { fluffiness: 74, cuddliness: 68, magic: 46, joy: 76, luck: 62 },
    gene: { name: 'Soft Quill', icon: '🦔', desc: 'Needs fade 8% slower and gifts arrive 10% sooner.', effect: { needSlow: 0.92, giftSpeed: 1.1 } },
    traits: [
      { name: 'Curl Up', icon: '🦔', level: 1, bond: 0 },
      { name: 'Quill Rustle', icon: '🍂', level: 5, bond: 10 },
      { name: 'Leaf Cache', icon: '🌰', level: 12, bond: 30 },
      { name: 'Quiet Snuffle', icon: '💤', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Bramble Roll', icon: '🌀', level: 30, bond: 0 },
      { name: 'Harvest Burr', icon: '🍁', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_griffin', element: 'sp_griffin', name: 'Griffin Puffle', short: 'Griffin', icon: '🦅',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#46C46E',
    puffleElement: 'Wind', habitatLabel: 'Golden Cliffs', habitats: ['savanna', 'aurora'],
    likes: 'Honeycomb Cake', price: 95, titan: 'Skyward Sovereign',
    style: { primary: '#FFE7C2', secondary: '#FFF6E4', belly: '#FFFDF6', ear: '#F5D8A8', iris: '#D9A03C', eyeShadow: '#6B4A12', leaf: '#C9A15B', leafGlow: '#FFF0C4', pads: '#F4C9D4' },
    personality: ['🦅 Proud', '🪶 Sky-minded', '🛡️ Guardian', '✨ Curious'],
    lore: 'A lion-soft puff with eagle plumes for ears and a beak-bright crest. Griffin Puffles perch on the highest ledge they can find, watch over the nest below them, and take the long way home purely for the view.',
    stats: { fluffiness: 86, cuddliness: 78, magic: 68, joy: 86, luck: 82 },
    gene: { name: 'Skyward', icon: '🪶', desc: 'Gifts arrive 12% sooner and XP gains +8%.', effect: { giftSpeed: 1.12, xp: 1.08 } },
    traits: [
      { name: 'Feather Ears', icon: '🪶', level: 1, bond: 0 },
      { name: 'Cliff Watch', icon: '🦅', level: 5, bond: 10 },
      { name: 'Proud Purr', icon: '🎵', level: 12, bond: 30 },
      { name: 'Skyguard', icon: '🛡️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Sunwing', icon: '☀️', level: 30, bond: 0 },
      { name: 'Aerie Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_dragon', element: 'sp_dragon', name: 'Dragon Puffle', short: 'Dragon', icon: '🐉',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Fire', habitatLabel: 'Emberpeak Roost', habitats: ['ember', 'crystal'],
    likes: 'Ember Steak', price: 120, titan: 'Emberhoard Sovereign',
    style: { primary: '#FFC9B8', secondary: '#FFE8DC', belly: '#FFF6F0', ear: '#F5A894', iris: '#E4572E', eyeShadow: '#6E2318', leaf: '#FF8A5C', leafGlow: '#FFE0C2', pads: '#FFC9C2' },
    personality: ['🐉 Bold', '🔥 Warm-blooded', '💎 Hoarder', '😴 Nap expert'],
    lore: 'A crimson pom-pom with two polished horns and wings far too small for the job. Dragon Puffles hoard exactly one treasure at a time, usually a spoon, and defend it with a purr that rattles the windows.',
    stats: { fluffiness: 84, cuddliness: 76, magic: 88, joy: 90, luck: 74 },
    gene: { name: 'Emberhoard', icon: '🔥', desc: 'Day games pay +4 coins and XP gains +8%.', effect: { dayCoins: 4, xp: 1.08 } },
    traits: [
      { name: 'Tiny Horns', icon: '🐉', level: 1, bond: 0 },
      { name: 'Bat Wings', icon: '🦇', level: 5, bond: 10 },
      { name: 'Hoard Sniff', icon: '💎', level: 12, bond: 30 },
      { name: 'Warm Purr', icon: '🔥', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Flame Breath', icon: '🔥', level: 30, bond: 0 },
      { name: 'Hoard Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_basilisk', element: 'sp_basilisk', name: 'Basilisk Puffle', short: 'Basilisk', icon: '🐍',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#4C8DFF',
    puffleElement: 'Earth', habitatLabel: 'Emerald Hollow', habitats: ['mycelium', 'crystal'],
    likes: 'Crunch Crisps', price: 120, titan: 'Gorgon Crown Warden',
    style: { primary: '#D8F0C2', secondary: '#F0FFE4', belly: '#FAFFF2', ear: '#BEE0A0', iris: '#4C8A3F', eyeShadow: '#2F4A24', leaf: '#7FB36A', leafGlow: '#D8FFC4', pads: '#C9D8A8' },
    personality: ['🐍 Composed', '👁️ Watchful', '🌿 Grounded', '🤫 Quiet'],
    lore: 'An emerald sphere with a frill of soft spikes and a stare that stops sprites mid-step. Basilisk Puffles are extremely polite about it, and generally keep their eyes politely closed.',
    stats: { fluffiness: 82, cuddliness: 72, magic: 92, joy: 70, luck: 78 },
    gene: { name: 'Stonegaze', icon: '👁️', desc: 'Needs fade 10% slower and night games pay +3 coins.', effect: { needSlow: 0.9, nightCoins: 3 } },
    traits: [
      { name: 'Frill Crest', icon: '🐍', level: 1, bond: 0 },
      { name: 'Still Gaze', icon: '👁️', level: 5, bond: 10 },
      { name: 'Scale Fluff', icon: '✨', level: 12, bond: 30 },
      { name: 'Patient Coil', icon: '🌀', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Petrify Puff', icon: '🪨', level: 30, bond: 0 },
      { name: 'Gorgon Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_unicorn', element: 'sp_unicorn', name: 'Unicorn Puffle', short: 'Unicorn', icon: '🦄',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Light', habitatLabel: 'Rainbow Meadows', habitats: ['aurora', 'sugar'],
    likes: 'Cloud Cupcake', price: 145, titan: 'Prismhorn Sovereign',
    style: { primary: '#FFF0FA', secondary: '#FFD8F0', belly: '#FFFFFF', ear: '#F5E0FF', iris: '#B48CFF', eyeShadow: '#5C3F8C', leaf: '#FFB8E6', leafGlow: '#FFE4F6', pads: '#FFD9F0' },
    personality: ['🦄 Gentle', '🌈 Sparkly', '✨ Dreamy', '💗 Affectionate'],
    lore: 'A snow-soft ball with a crystal horn and a rainbow tuft that never quite settles. Unicorn Puffles leave glitter on everything they brush past and consider this a gift.',
    stats: { fluffiness: 94, cuddliness: 92, magic: 88, joy: 94, luck: 90 },
    gene: { name: 'Prismhorn', icon: '🦄', desc: 'Gifts arrive 15% sooner and joy fades 10% slower.', effect: { giftSpeed: 1.15, joyMod: 0.9 } },
    traits: [
      { name: 'Crystal Horn', icon: '🦄', level: 1, bond: 0 },
      { name: 'Rainbow Tuft', icon: '🌈', level: 5, bond: 10 },
      { name: 'Glitter Step', icon: '✨', level: 12, bond: 30 },
      { name: 'Gentle Heart', icon: '💗', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Purify', icon: '💎', level: 30, bond: 0 },
      { name: 'Wish Horn', icon: '🌟', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_kitsune', element: 'sp_kitsune', name: 'Kitsune Puffle', short: 'Kitsune', icon: '🦊',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A46BFF',
    puffleElement: 'Spirit', habitatLabel: 'Sakura Spirit Forest', habitats: ['sakura', 'night'],
    likes: 'Moon Berry', price: 145, titan: 'Ninefold Sovereign',
    style: { primary: '#FFD9B8', secondary: '#FFF0E4', belly: '#FFF9F2', ear: '#F5C9A0', iris: '#E08A3C', eyeShadow: '#6E3A12', leaf: '#FF9F5C', leafGlow: '#FFE0C4', pads: '#FFD1C2' },
    personality: ['🦊 Playful', '🌀 Trickster', '🔥 Spirit-touched', '🌙 Night-loving'],
    lore: 'A fox-eared fluffball with three small tails orbiting it like very pleased moons. Kitsune Puffles are honest about everything except where they were five minutes ago.',
    stats: { fluffiness: 90, cuddliness: 84, magic: 94, joy: 92, luck: 88 },
    gene: { name: 'Foxfire', icon: '🦊', desc: 'Night games pay +4 coins and XP gains +8%.', effect: { nightCoins: 4, xp: 1.08 } },
    traits: [
      { name: 'Fox Ears', icon: '🦊', level: 1, bond: 0 },
      { name: 'Orbiting Tails', icon: '🌀', level: 5, bond: 10 },
      { name: 'Spirit Flame', icon: '🔥', level: 12, bond: 30 },
      { name: 'Trickster Grin', icon: '😼', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Nine Tails', icon: '✨', level: 30, bond: 0 },
      { name: 'Shrine Wish', icon: '⛩️', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_phoenix', element: 'sp_phoenix', name: 'Phoenix Puffle', short: 'Phoenix', icon: '🔥',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Fire', habitatLabel: 'Ashfire Nest', habitats: ['ember', 'aurora'],
    likes: 'Sun Nectar', price: 180, titan: 'Dawnflare Sovereign',
    style: { primary: '#FFD1A8', secondary: '#FFE9C2', belly: '#FFF7E8', ear: '#FFB877', iris: '#E8701E', eyeShadow: '#6E2E08', leaf: '#FF9F3C', leafGlow: '#FFE8B8', pads: '#FFC2A8' },
    personality: ['🔥 Radiant', '🌅 Hopeful', '🎭 Dramatic', '💫 Reborn'],
    lore: 'A round little firebird whose crest burns without heat. Phoenix Puffles sneeze out embers, nap in warm ash, and come back from every bath looking faintly triumphant.',
    stats: { fluffiness: 92, cuddliness: 82, magic: 96, joy: 98, luck: 84 },
    gene: { name: 'Rebirth', icon: '🔥', desc: 'Energy fades 18% slower and joy fades 8% slower.', effect: { energyDecay: 0.82, joyMod: 0.92 } },
    traits: [
      { name: 'Flame Crest', icon: '🔥', level: 1, bond: 0 },
      { name: 'Feather Wings', icon: '🪶', level: 5, bond: 10 },
      { name: 'Ember Trail', icon: '✨', level: 12, bond: 30 },
      { name: 'Warm Heart', icon: '💛', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Rebirth', icon: '🌅', level: 30, bond: 0 },
      { name: 'Sunflare', icon: '☀️', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_fenrir', element: 'sp_fenrir', name: 'Fenrir Puffle', short: 'Fenrir', icon: '🐺',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFC94D',
    puffleElement: 'Ice', habitatLabel: 'Moonpine Fen', habitats: ['biome-ice', 'night'],
    likes: 'Ember Steak', price: 180, titan: 'Frostmaw Sovereign',
    style: { primary: '#D8E8F5', secondary: '#F0F8FF', belly: '#FBFFFF', ear: '#C2D8E8', iris: '#5C9ED8', eyeShadow: '#2F4A6E', leaf: '#8FC2E8', leafGlow: '#E0F4FF', pads: '#C9D8E8' },
    personality: ['🐺 Loyal', '🗡️ Protective', '🌨️ Stoic', '🌙 Nightwatch'],
    lore: 'A silver wolf-sphere with rune-marked fur and a howl that starts brave and ends as a squeak. Fenrir Puffles guard the door, the snacks, and whoever is smallest in the room.',
    stats: { fluffiness: 96, cuddliness: 84, magic: 90, joy: 80, luck: 82 },
    gene: { name: 'Runefrost', icon: '🐺', desc: 'Needs fade 15% slower and night games pay +4 coins.', effect: { needSlow: 0.85, nightCoins: 4 } },
    traits: [
      { name: 'Wolf Ears', icon: '🐺', level: 1, bond: 0 },
      { name: 'Rune Fur', icon: '🔯', level: 5, bond: 10 },
      { name: 'Ice Aura', icon: '❄️', level: 12, bond: 30 },
      { name: 'Pack Howl', icon: '🌙', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Fenrir Bite', icon: '🗡️', level: 30, bond: 0 },
      { name: 'Winter Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_kirin', element: 'sp_kirin', name: 'Lunar Kirin Puffle', short: 'Lunar Kirin', icon: '🌙',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF6FA8',
    puffleElement: 'Moon', habitatLabel: 'Sacred Bamboo Peaks', habitats: ['starlit', 'sugar'],
    likes: 'Moon Berry', price: 220, titan: 'Moonhorn Sovereign',
    style: { primary: '#EEF0FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#DCE2FF', iris: '#8C9EFF', eyeShadow: '#3F4A8C', leaf: '#B8C4FF', leafGlow: '#E8ECFF', pads: '#E0D8FF' },
    personality: ['🌙 Serene', '✨ Celestial', '🦌 Gentle', '🌌 Dreamy'],
    lore: 'A moon-white sphere with crystal antlers and a halo of sleepy stars. Lunar Kirin Puffles walk on tiptoe across the sky and leave small constellations where they sat.',
    stats: { fluffiness: 96, cuddliness: 90, magic: 98, joy: 90, luck: 94 },
    gene: { name: 'Lunar Grace', icon: '🌙', desc: 'Night games pay +5 coins and energy fades 15% slower.', effect: { nightCoins: 5, energyDecay: 0.85 } },
    traits: [
      { name: 'Crystal Antlers', icon: '🦌', level: 1, bond: 0 },
      { name: 'Star Motes', icon: '✨', level: 5, bond: 10 },
      { name: 'Cloud Step', icon: '☁️', level: 12, bond: 30 },
      { name: 'Serene Wish', icon: '🌠', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Moonfall', icon: '🌙', level: 30, bond: 0 },
      { name: 'Kirin Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_leviathan', element: 'sp_leviathan', name: 'Leviathan Puffle', short: 'Leviathan', icon: '🌊',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF6FA8',
    puffleElement: 'Water', habitatLabel: 'Abyssal Lagoon', habitats: ['tide', 'reef'],
    likes: 'Crunch Crisps', price: 220, titan: 'Deepcrown Sovereign',
    style: { primary: '#B8E8FF', secondary: '#E4F9FF', belly: '#F6FEFF', ear: '#9FD8F5', iris: '#2E9EC9', eyeShadow: '#1F4A6E', leaf: '#5CC8E8', leafGlow: '#D8F8FF', pads: '#B8E0F0' },
    personality: ['🌊 Deep-voiced', '🐚 Patient', '🪸 Coral-hearted', '🎵 Singer'],
    lore: 'An ocean-blue orb with tiny fins and a coral crown that grows a new branch every birthday. Leviathan Puffles sing to the tide and are convinced the tide sings back.',
    stats: { fluffiness: 94, cuddliness: 86, magic: 96, joy: 88, luck: 86 },
    gene: { name: 'Tidedeep', icon: '🌊', desc: 'Games pay +5 coins and needs fade 10% slower.', effect: { gameCoins: 5, needSlow: 0.9 } },
    traits: [
      { name: 'Tiny Fins', icon: '🐟', level: 1, bond: 0 },
      { name: 'Coral Crown', icon: '🪸', level: 5, bond: 10 },
      { name: 'Water Rings', icon: '💧', level: 12, bond: 30 },
      { name: 'Deep Song', icon: '🎵', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Tidal Roar', icon: '🌊', level: 30, bond: 0 },
      { name: 'Abyss Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_seraph', element: 'sp_seraph', name: 'Celestial Seraph Puffle', short: 'Celestial Seraph', icon: '👼',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF6FA8',
    puffleElement: 'Light', habitatLabel: 'Celestial Reach', habitats: ['starlit', 'aurora'],
    likes: 'Lava Cookie', price: 225, titan: 'Halo Sovereign',
    style: { primary: '#FFF7E4', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#FFF0C9', iris: '#FFD166', eyeShadow: '#8A6A1E', leaf: '#FFE08A', leafGlow: '#FFF8DC', pads: '#FFE8D8' },
    personality: ['👼 Gentle', '🌟 Radiant', '🕊️ Peaceful', '🎶 Humming'],
    lore: 'A pure white puffball ringed by six small wings and a warm halo. Celestial Seraph Puffles hum in their sleep, and the whole nest sleeps better for it.',
    stats: { fluffiness: 98, cuddliness: 94, magic: 98, joy: 96, luck: 90 },
    gene: { name: 'Halo Song', icon: '👼', desc: 'Pets build +20% bond and joy fades 12% slower.', effect: { petBond: 1.2, joyMod: 0.88 } },
    traits: [
      { name: 'Six Wings', icon: '🪶', level: 1, bond: 0 },
      { name: 'Floating Halo', icon: '😇', level: 5, bond: 10 },
      { name: 'Golden Glow', icon: '🌟', level: 12, bond: 30 },
      { name: 'Choir Hum', icon: '🎶', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Ascension', icon: '🕊️', level: 30, bond: 0 },
      { name: 'Seraph Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_voiddragon', element: 'sp_voiddragon', name: 'Void Dragon Puffle', short: 'Void Dragon', icon: '🌌',
    tier: 'secret', rarity: 'secret', rarityLabel: 'Secret', stars: 7, color: '#FF8FD6',
    puffleElement: 'Void', habitatLabel: 'Shadow Rift', habitats: ['night', 'starlit'],
    likes: 'Star Pop', price: 280, titan: 'Nullstar Sovereign',
    style: { primary: '#3A3466', secondary: '#6B5FD8', belly: '#8C7FF0', ear: '#2E2A57', iris: '#7AFFD8', eyeShadow: '#0E0A24', leaf: '#B18CFF', leafGlow: '#E8DCFF', pads: '#8C7FF0' },
    personality: ['🌌 Cosmic', '🐉 Hungry', '🌑 Quiet', '✨ Star-touched'],
    lore: 'A midnight sphere with galaxy fur and two small horns full of stars. Void Dragon Puffles swallowed a piece of the sky once and have been politely carrying it around ever since.',
    stats: { fluffiness: 96, cuddliness: 82, magic: 100, joy: 86, luck: 96 },
    gene: { name: 'Nullstar', icon: '🌌', desc: 'Night games pay +6 coins and XP gains +12%.', effect: { nightCoins: 6, xp: 1.12 } },
    traits: [
      { name: 'Void Horns', icon: '🐉', level: 1, bond: 0 },
      { name: 'Galaxy Fur', icon: '🌌', level: 5, bond: 10 },
      { name: 'Star Orbit', icon: '✨', level: 12, bond: 30 },
      { name: 'Quiet Hunger', icon: '🕳️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Dark Nova', icon: '💥', level: 30, bond: 0 },
      { name: 'Void Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_eclipse', element: 'sp_eclipse', name: 'Eclipse Sovereign Puffle', short: 'Eclipse', icon: '🌗',
    tier: 'secret', rarity: 'divine', rarityLabel: 'Divine', stars: 8, color: '#FFE08A',
    puffleElement: 'Light', habitatLabel: 'Eclipse Throne', habitats: ['starlit', 'night'],
    likes: 'Lava Cookie', price: 320, titan: 'Eclipse Archon',
    style: { primary: '#FFE9B8', secondary: '#DCE4F5', belly: '#FFFFFF', ear: '#FFD98A', iris: '#FFD166', eyeShadow: '#5A4A6E', leaf: '#C9B8F0', leafGlow: '#FFF2C4', pads: '#E8D8FF' },
    personality: ['🌞 Radiant', '🌙 Serene', '👑 Sovereign', '⚖️ Balanced'],
    lore: 'Half sun-gold fur, half moon-silver fur, and a crown that floats just above the fluff. Eclipse Sovereign Puffles are calm, enormous, and absolutely certain that both halves of the day belong to them.',
    stats: { fluffiness: 100, cuddliness: 94, magic: 100, joy: 98, luck: 100 },
    gene: { name: 'Twin Dawn', icon: '🌗', desc: 'Day and night games pay +4 coins and XP gains +10%.', effect: { dayCoins: 4, nightCoins: 4, xp: 1.1 } },
    traits: [
      { name: 'Sunhalf Fur', icon: '🌞', level: 1, bond: 0 },
      { name: 'Moonhalf Fur', icon: '🌙', level: 5, bond: 10 },
      { name: 'Floating Crown', icon: '👑', level: 12, bond: 30 },
      { name: 'Twin Gaze', icon: '⚖️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Perfect Eclipse', icon: '🌗', level: 30, bond: 0 },
      { name: 'Sovereign Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  /* The elemental line: one species per base element, then the hybrids that
     combine two, the mythic hybrids, and the creator tier. Each carries its
     spec's passive, two actives and ultimate as bond traits, and its special
     trait as the first unlock. */
  {
    key: 'sp_fire', element: 'sp_fire', name: 'Fire Puffle', short: 'Fire', icon: '🔥',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#FF7A4D',
    puffleElement: 'Fire', habitatLabel: 'Emberpeak Highlands', habitats: ['emberpeak', 'stoneheart'],
    likes: 'Star Pop', price: 130, titan: 'Inferno Monarch',
    style: { primary: '#D2354B', secondary: '#FFC94D', belly: '#FFE7D0', ear: '#E8596C', iris: '#FF9A3C', eyeShadow: '#5A0F1E', leaf: '#FF6B4A', leafGlow: '#FFD98A', pads: '#F7B4A0' },
    personality: ['🔥 Passionate', '💥 Bold', '🫧 Warm', '🎯 Driven'],
    lore: 'Crimson fur with a gold belly and a crest that smoulders when it is pleased. A Fire Puffle burns brighter the closer it gets to trouble, which is also the closest it gets to you.',
    stats: { fluffiness: 74, cuddliness: 66, magic: 88, joy: 90, luck: 58 },
    gene: { name: 'Flame Body', icon: '🔥', desc: 'Day games pay +3 coins and joy fades 6% slower.', effect: { dayCoins: 3, joyMod: 0.94 } },
    traits: [
      { name: 'Flame Body', icon: '🔥', level: 1, bond: 0 },
      { name: 'Ember Burst', icon: '💥', level: 5, bond: 10 },
      { name: 'Fire Dash', icon: '🏃', level: 12, bond: 30 },
      { name: 'Inferno Nova', icon: '☄️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Low-HP Blaze', icon: '❤️‍🔥', level: 30, bond: 0 },
      { name: 'Inferno Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_water', element: 'sp_water', name: 'Water Puffle', short: 'Water', icon: '🌊',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#4FC8E8',
    puffleElement: 'Water', habitatLabel: 'Crystal Tide Coast', habitats: ['crystaltide', 'auroraglacier'],
    likes: 'Moon Berry', price: 100, titan: 'Tsunami Warden',
    style: { primary: '#1E6FA8', secondary: '#7FE3E0', belly: '#D8F7FF', ear: '#3E93C8', iris: '#8FF2E4', eyeShadow: '#0E3A5C', leaf: '#5ED0C8', leafGlow: '#BFFAF2', pads: '#A8E6F5' },
    personality: ['🌊 Calm', '🫧 Gentle', '💙 Steady', '🐚 Patient'],
    lore: 'Ocean-blue fur that never quite dries, with aqua ripples along the belly. Water Puffles hum to themselves in the bath and heal a little faster every time it rains.',
    stats: { fluffiness: 84, cuddliness: 88, magic: 76, joy: 82, luck: 66 },
    gene: { name: 'Water Veil', icon: '💧', desc: 'Bond grows 15% faster and needs slow by 10%.', effect: { petBond: 1.15, needSlow: 1.1 } },
    traits: [
      { name: 'Water Veil', icon: '💧', level: 1, bond: 0 },
      { name: 'Splash Cannon', icon: '💦', level: 5, bond: 10 },
      { name: 'Healing Rain', icon: '🌧️', level: 12, bond: 30 },
      { name: 'Tsunami Wave', icon: '🌊', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Tidal Recovery', icon: '🫧', level: 30, bond: 0 },
      { name: 'Deep Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_nature', element: 'sp_nature', name: 'Nature Puffle', short: 'Nature', icon: '🌿',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#5FBF6E',
    puffleElement: 'Nature', habitatLabel: 'Bloomroot Valley', habitats: ['bloomroot', 'worldheart'],
    likes: 'Moon Berry', price: 110, titan: 'Worldtree Guardian',
    style: { primary: '#2E9E5B', secondary: '#A8E06A', belly: '#F2FFE4', ear: '#57BE7C', iris: '#F7D34A', eyeShadow: '#14512F', leaf: '#8FD46B', leafGlow: '#D8FFB0', pads: '#F4C9D4' },
    personality: ['🌿 Grounded', '🌸 Kind', '🍃 Easygoing', '🐝 Busy'],
    lore: 'Emerald fur with leaf-green tips that grow a new sprout every birthday. Nature Puffles nap in flowerbeds and wake up with bees politely waiting for them to move.',
    stats: { fluffiness: 88, cuddliness: 84, magic: 72, joy: 86, luck: 74 },
    gene: { name: 'Green Thumb', icon: '🌱', desc: 'Gifts arrive 12% sooner and joy fades 8% slower.', effect: { giftSpeed: 1.12, joyMod: 0.92 } },
    traits: [
      { name: "Nature's Blessing", icon: '🌱', level: 1, bond: 0 },
      { name: 'Vine Whip', icon: '🌿', level: 5, bond: 10 },
      { name: 'Bloom Heal', icon: '🌸', level: 12, bond: 30 },
      { name: 'Worldtree Awakening', icon: '🌳', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Forest Healing', icon: '🍃', level: 30, bond: 0 },
      { name: 'Grove Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_lightning', element: 'sp_lightning', name: 'Lightning Puffle', short: 'Lightning', icon: '⚡',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#FFD84D',
    puffleElement: 'Lightning', habitatLabel: 'Thundercloud Heights', habitats: ['thundercloud', 'emberpeak'],
    likes: 'Star Pop', price: 140, titan: 'Stormbreaker Prime',
    style: { primary: '#F8D33A', secondary: '#59C8FF', belly: '#FFFBD8', ear: '#FFE873', iris: '#3EA9FF', eyeShadow: '#7A5A00', leaf: '#FFE873', leafGlow: '#BFEFFF', pads: '#E8D8A0' },
    personality: ['⚡ Restless', '💥 Loud', '🎮 Competitive', '🩵 Loyal'],
    lore: 'Electric yellow fur with blue sparks caught in the curls. A Lightning Puffle cannot walk anywhere, only arrive, and it always arrives slightly singed.',
    stats: { fluffiness: 70, cuddliness: 62, magic: 86, joy: 94, luck: 62 },
    gene: { name: 'Charged Fur', icon: '⚡', desc: 'XP gains +12% and games pay +3 coins.', effect: { xp: 1.12, gameCoins: 3 } },
    traits: [
      { name: 'Charged Fur', icon: '⚡', level: 1, bond: 0 },
      { name: 'Spark Bolt', icon: '🌩️', level: 5, bond: 10 },
      { name: 'Thunder Dash', icon: '🏃', level: 12, bond: 30 },
      { name: 'Stormbreaker', icon: '🌪️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Static Speed', icon: '👟', level: 30, bond: 0 },
      { name: 'Volt Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_ice', element: 'sp_ice', name: 'Ice Puffle', short: 'Ice', icon: '❄️',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#A8D8F0',
    puffleElement: 'Ice', habitatLabel: 'Aurora Glacier', habitats: ['auroraglacier', 'prismcaverns'],
    likes: 'Snow Cone', price: 135, titan: 'Aurora Warden',
    style: { primary: '#BFE6FF', secondary: '#D9E2EC', belly: '#F5FBFF', ear: '#D6EEFF', iris: '#7FB8D8', eyeShadow: '#3A6B86', leaf: '#A8D8F0', leafGlow: '#EAF8FF', pads: '#D8E8F2' },
    personality: ['❄️ Cool', '🧊 Quiet', '✨ Precise', '🩵 Steady'],
    lore: 'Frost-blue fur with silver tips that frost over when it sleeps. Ice Puffles are unbothered by cold, heat, or being told they are cold.',
    stats: { fluffiness: 82, cuddliness: 70, magic: 80, joy: 74, luck: 70 },
    gene: { name: 'Frozen Core', icon: '❄️', desc: 'Energy fades 10% slower and needs slow by 8%.', effect: { energyDecay: 0.9, needSlow: 1.08 } },
    traits: [
      { name: 'Frozen Core', icon: '🧊', level: 1, bond: 0 },
      { name: 'Ice Shard', icon: '❄️', level: 5, bond: 10 },
      { name: 'Frost Armor', icon: '🛡️', level: 12, bond: 30 },
      { name: 'Aurora Blizzard', icon: '🌌', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Freeze Chance', icon: '🧊', level: 30, bond: 0 },
      { name: 'Glacier Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_air', element: 'sp_air', name: 'Air Puffle', short: 'Air', icon: '🌪️',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#CFEFFF',
    puffleElement: 'Air', habitatLabel: 'Whisperwind Plains', habitats: ['whisperwind', 'celestial'],
    likes: 'Cloud Cupcake', price: 80, titan: 'Tempest Sovereign',
    style: { primary: '#BFE9FF', secondary: '#FFFFFF', belly: '#F7FDFF', ear: '#D8F2FF', iris: '#6FC8EE', eyeShadow: '#2F6E8A', leaf: '#9FDDF5', leafGlow: '#E8FBFF', pads: '#E0F2FA' },
    personality: ['🌪️ Flighty', '☁️ Dreamy', '🍃 Light', '✨ Curious'],
    lore: 'Sky-blue fur that weighs almost nothing and floats a finger-width off the ground on windy days. Air Puffles lose track of conversations, rooms, and occasionally the floor.',
    stats: { fluffiness: 90, cuddliness: 72, magic: 66, joy: 84, luck: 78 },
    gene: { name: 'Wind Glide', icon: '🍃', desc: 'Gifts arrive 15% sooner and energy fades 8% slower.', effect: { giftSpeed: 1.15, energyDecay: 0.92 } },
    traits: [
      { name: 'Wind Glide', icon: '🍃', level: 1, bond: 0 },
      { name: 'Tornado Toss', icon: '🌪️', level: 5, bond: 10 },
      { name: 'Gust Dash', icon: '💨', level: 12, bond: 30 },
      { name: 'Tempest Fury', icon: '🌬️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Light Step', icon: '🪶', level: 30, bond: 0 },
      { name: 'Sky Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_earth', element: 'sp_earth', name: 'Earth Puffle', short: 'Earth', icon: '🌱',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#B8834C',
    puffleElement: 'Earth', habitatLabel: 'Stoneheart Canyon', habitats: ['stoneheart', 'bloomroot'],
    likes: 'Honeycomb Cake', price: 75, titan: 'Titan Smash Prime',
    style: { primary: '#8C5A33', secondary: '#E0A54A', belly: '#F7E6C8', ear: '#A8703F', iris: '#D9A441', eyeShadow: '#3F2410', leaf: '#C08A4A', leafGlow: '#FFDFA8', pads: '#D8B08A' },
    personality: ['🌱 Patient', '🪨 Sturdy', '🍯 Warm', '🕰️ Slow'],
    lore: 'Brown fur with amber patches and paws that leave little craters in soft ground. Earth Puffles are the calmest creature in the hollow until a snack is late.',
    stats: { fluffiness: 86, cuddliness: 90, magic: 58, joy: 76, luck: 60 },
    gene: { name: 'Stone Skin', icon: '🪨', desc: 'Bond grows 15% faster and energy fades 6% slower.', effect: { bond: 1.15, energyDecay: 0.94 } },
    traits: [
      { name: 'Stone Skin', icon: '🪨', level: 1, bond: 0 },
      { name: 'Rock Throw', icon: '🪨', level: 5, bond: 10 },
      { name: 'Earthquake Step', icon: '💥', level: 12, bond: 30 },
      { name: 'Titan Smash', icon: '🌋', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Grounded Guard', icon: '🛡️', level: 30, bond: 0 },
      { name: 'Bedrock Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_light', element: 'sp_light', name: 'Light Puffle', short: 'Light', icon: '☀️',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#FFD76E',
    puffleElement: 'Light', habitatLabel: 'Celestial Meadows', habitats: ['celestial', 'worldheart'],
    likes: 'Lava Cookie', price: 115, titan: 'Solaris Judgement',
    style: { primary: '#FFF7E8', secondary: '#FFC94D', belly: '#FFFFFF', ear: '#FFF0D0', iris: '#FFB800', eyeShadow: '#7A5A11', leaf: '#FFE1A0', leafGlow: '#FFF6D8', pads: '#FFE8D8' },
    personality: ['☀️ Bright', '💛 Kind', '✨ Hopeful', '🕊️ Gentle'],
    lore: 'Warm white fur edged in gold, and a glow that never quite switches off at night. Light Puffles sit beside whoever looks saddest and simply stay there.',
    stats: { fluffiness: 92, cuddliness: 96, magic: 78, joy: 92, luck: 80 },
    gene: { name: 'Holy Aura', icon: '✨', desc: 'Bond grows 20% faster and bond needs slow by 10%.', effect: { bond: 1.2, petBond: 1.1 } },
    traits: [
      { name: 'Holy Aura', icon: '✨', level: 1, bond: 0 },
      { name: 'Light Beam', icon: '🔆', level: 5, bond: 10 },
      { name: 'Blessing Pulse', icon: '💛', level: 12, bond: 30 },
      { name: 'Solaris Judgement', icon: '☀️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Ally Mending', icon: '🕊️', level: 30, bond: 0 },
      { name: 'Dawn Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_shadow', element: 'sp_shadow', name: 'Shadow Puffle', short: 'Shadow', icon: '🌑',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#7A54A8',
    puffleElement: 'Shadow', habitatLabel: 'Shadowveil Woods', habitats: ['shadowveil', 'prismcaverns'],
    likes: 'Moon Berry', price: 145, titan: 'Umbra Eclipse',
    style: { primary: '#4A2B6B', secondary: '#140E1F', belly: '#8A6BB0', ear: '#5C3A80', iris: '#C9A0FF', eyeShadow: '#0B0812', leaf: '#7A54A8', leafGlow: '#C9A0FF', pads: '#6B4A8A' },
    personality: ['🌑 Quiet', '🖤 Loyal', '🕯️ Watchful', '😼 Smug'],
    lore: 'Purple-black fur that drinks the light around it, leaving only two violet eyes. Shadow Puffles follow you room to room without ever being seen doing it.',
    stats: { fluffiness: 80, cuddliness: 74, magic: 92, joy: 68, luck: 72 },
    gene: { name: 'Shadow Cloak', icon: '🌑', desc: 'Night games pay +5 coins and chats pay +3.', effect: { nightCoins: 5, chatCoins: 3 } },
    traits: [
      { name: 'Shadow Cloak', icon: '🌑', level: 1, bond: 0 },
      { name: 'Dark Slash', icon: '🗡️', level: 5, bond: 10 },
      { name: 'Night Drift', icon: '🌘', level: 12, bond: 30 },
      { name: 'Umbra Eclipse', icon: '🌑', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Unseen Step', icon: '👣', level: 30, bond: 0 },
      { name: 'Dusk Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_crystal', element: 'sp_crystal', name: 'Crystal Puffle', short: 'Crystal', icon: '💎',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#F4A8D8',
    puffleElement: 'Crystal', habitatLabel: 'Prism Caverns', habitats: ['prismcaverns', 'shadowveil'],
    likes: 'Lava Cookie', price: 150, titan: 'Celestial Prism Storm',
    style: { primary: '#F4A8D8', secondary: '#B8E8FF', belly: '#FFF0FA', ear: '#FBC8E4', iris: '#B98CFF', eyeShadow: '#7A2E5C', leaf: '#A8E8FF', leafGlow: '#FFD8F0', pads: '#FFD8EC' },
    personality: ['💎 Sparkly', '🔮 Mysterious', '✨ Vain', '🌈 Playful'],
    lore: 'Pink fur shot through with rainbow refraction, so a Crystal Puffle throws little spectra across the room when it walks. They know exactly how good that looks.',
    stats: { fluffiness: 84, cuddliness: 80, magic: 94, joy: 82, luck: 88 },
    gene: { name: 'Crystal Shield', icon: '💎', desc: 'Games pay +4 coins and XP gains +8%.', effect: { gameCoins: 4, xp: 1.08 } },
    traits: [
      { name: 'Crystal Shield', icon: '💎', level: 1, bond: 0 },
      { name: 'Prism Shot', icon: '🌈', level: 5, bond: 10 },
      { name: 'Gem Armor', icon: '🛡️', level: 12, bond: 30 },
      { name: 'Celestial Prism Storm', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Magic Reflect', icon: '🔮', level: 30, bond: 0 },
      { name: 'Prism Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_plasma', element: 'sp_plasma', name: 'Plasma Puffle', short: 'Plasma', icon: '🔆',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#FF8A3C',
    puffleElement: 'Plasma', habitatLabel: 'Emberpeak Highlands', habitats: ['emberpeak', 'thundercloud'],
    likes: 'Star Pop', price: 175, titan: 'Solar Overload Prime',
    style: { primary: '#FF7A2E', secondary: '#FFD35A', belly: '#FFE8C8', ear: '#FF9A5A', iris: '#FFE873', eyeShadow: '#7A2A00', leaf: '#FFB347', leafGlow: '#FFF0B8', pads: '#FFC8A0' },
    personality: ['🔆 Intense', '⚡ Fast', '🔥 Fierce', '🎆 Showy'],
    lore: 'Neon-orange fur crackling with gold lightning, the first hybrid of fire and storm. Plasma Puffles leave scorch marks in the shape of their own paw prints.',
    stats: { fluffiness: 76, cuddliness: 64, magic: 96, joy: 92, luck: 70 },
    gene: { name: 'Plasma Core', icon: '🔆', desc: 'Games pay +5 coins and XP gains +12%.', effect: { gameCoins: 5, xp: 1.12 } },
    traits: [
      { name: 'Plasma Burst', icon: '💥', level: 1, bond: 0 },
      { name: 'Lightning Flame Dash', icon: '🏃', level: 5, bond: 10 },
      { name: 'Solar Overload', icon: '☀️', level: 12, bond: 30 },
      { name: 'Arc Nova', icon: '🌩️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Overcharge', icon: '⚡', level: 30, bond: 0 },
      { name: 'Plasma Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_frostwave', element: 'sp_frostwave', name: 'Frostwave Puffle', short: 'Frostwave', icon: '🌊',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#7FD8F0',
    puffleElement: 'Frostwave', habitatLabel: 'Aurora Glacier', habitats: ['auroraglacier', 'crystaltide'],
    likes: 'Snow Cone', price: 180, titan: 'Arctic Tsunami Prime',
    style: { primary: '#7FD8F0', secondary: '#BFF7F0', belly: '#EAFEFF', ear: '#A8E8F5', iris: '#4FC8D8', eyeShadow: '#1E5A6B', leaf: '#8FE8E0', leafGlow: '#D8FFFA', pads: '#C8F0F5' },
    personality: ['🌊 Serene', '🧊 Cool', '🎐 Musical', '🩵 Deep'],
    lore: 'Crystal-blue fur that ripples like open water and freezes into little waves where it sits. Frostwave Puffles sing in a register only other water types can hear.',
    stats: { fluffiness: 88, cuddliness: 82, magic: 90, joy: 78, luck: 74 },
    gene: { name: 'Frozen Tide', icon: '🌊', desc: 'Needs slow by 12% and energy fades 10% slower.', effect: { needSlow: 1.12, energyDecay: 0.9 } },
    traits: [
      { name: 'Frozen Torrent', icon: '🌊', level: 1, bond: 0 },
      { name: 'Glacier Wave', icon: '🧊', level: 5, bond: 10 },
      { name: 'Arctic Tsunami', icon: '🌊', level: 12, bond: 30 },
      { name: 'Icewater Crown', icon: '👑', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Snowmelt Mend', icon: '🫧', level: 30, bond: 0 },
      { name: 'Tidefrost Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_bloomlight', element: 'sp_bloomlight', name: 'Bloomlight Puffle', short: 'Bloomlight', icon: '🌸',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#7FD39A',
    puffleElement: 'Bloomlight', habitatLabel: 'Bloomroot Valley', habitats: ['bloomroot', 'celestial'],
    likes: 'Honeycomb Cake', price: 185, titan: 'Paradise Awakening Prime',
    style: { primary: '#3FAE6B', secondary: '#FFF6D8', belly: '#FFFDF0', ear: '#6BD08F', iris: '#FFD35A', eyeShadow: '#14512F', leaf: '#A8E06A', leafGlow: '#FFF0B8', pads: '#FFE8D8' },
    personality: ['🌸 Nurturing', '☀️ Cheerful', '🌿 Patient', '✨ Gracious'],
    lore: 'Emerald fur with gold-lit flowers growing along the spine. Bloomlight Puffles leave a faint smell of cut grass and warm honey wherever they sleep.',
    stats: { fluffiness: 94, cuddliness: 90, magic: 84, joy: 94, luck: 82 },
    gene: { name: 'Sunbloom', icon: '🌸', desc: 'Gifts arrive 20% sooner and bond grows 10% faster.', effect: { giftSpeed: 1.2, bond: 1.1 } },
    traits: [
      { name: 'Solar Bloom', icon: '🌻', level: 1, bond: 0 },
      { name: 'Healing Garden', icon: '🌿', level: 5, bond: 10 },
      { name: 'Paradise Awakening', icon: '🌺', level: 12, bond: 30 },
      { name: 'Golden Canopy', icon: '🌳', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Petal Mending', icon: '🌸', level: 30, bond: 0 },
      { name: 'Bloom Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_voidcrystal', element: 'sp_voidcrystal', name: 'Void Crystal Puffle', short: 'Void Crystal', icon: '🔮',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#9A5CFF',
    puffleElement: 'Voidcrystal', habitatLabel: 'Shadowveil Woods', habitats: ['shadowveil', 'prismcaverns'],
    likes: 'Lava Cookie', price: 215, titan: 'Void Collapse Prime',
    style: { primary: '#2A1A3F', secondary: '#9A5CFF', belly: '#4A2E6B', ear: '#3A2454', iris: '#D9A0FF', eyeShadow: '#0B0812', leaf: '#6B3FA8', leafGlow: '#C9A0FF', pads: '#5A3A80' },
    personality: ['🔮 Enigmatic', '🌑 Still', '💜 Proud', '🕳️ Hungry'],
    lore: 'Black-purple fur with amethyst shards orbiting an inch above the fluff. Void Crystal Puffles are ancient, patient, and absolutely certain the room is theirs.',
    stats: { fluffiness: 86, cuddliness: 70, magic: 100, joy: 72, luck: 84 },
    gene: { name: 'Prism Rift', icon: '🔮', desc: 'Night games pay +6 coins and XP gains +14%.', effect: { nightCoins: 6, xp: 1.14 } },
    traits: [
      { name: 'Crystal Rift', icon: '💠', level: 1, bond: 0 },
      { name: 'Shadow Prism', icon: '🔮', level: 5, bond: 10 },
      { name: 'Void Collapse', icon: '🕳️', level: 12, bond: 30 },
      { name: 'Null Shards', icon: '💎', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Dimensional Step', icon: '🌌', level: 30, bond: 0 },
      { name: 'Rift Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_titanroot', element: 'sp_titanroot', name: 'Titanroot Puffle', short: 'Titanroot', icon: '🌳',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#6B9450',
    puffleElement: 'Titanroot', habitatLabel: 'Bloomroot Valley', habitats: ['bloomroot', 'stoneheart'],
    likes: 'Honeycomb Cake', price: 220, titan: "Worldtree Colossus Prime",
    style: { primary: '#4E7A3A', secondary: '#A8703F', belly: '#E8DCC0', ear: '#6B9450', iris: '#D9A441', eyeShadow: '#22381A', leaf: '#7FB35A', leafGlow: '#D8FFB0', pads: '#C8A882' },
    personality: ['🌳 Immovable', '🪵 Patient', '🍯 Warm', '🛡️ Protective'],
    lore: 'Moss-green fur threaded with amber roots that grow straight through gemstone plating. Titanroot Puffles take a decade to cross a room and arrive exactly on time.',
    stats: { fluffiness: 96, cuddliness: 88, magic: 86, joy: 80, luck: 74 },
    gene: { name: 'Deep Root', icon: '🌱', desc: 'Bond grows 20% faster and energy fades 15% slower.', effect: { bond: 1.2, energyDecay: 0.85 } },
    traits: [
      { name: 'Living Roots', icon: '🌱', level: 1, bond: 0 },
      { name: "Earth's Embrace", icon: '🪨', level: 5, bond: 10 },
      { name: 'Worldtree Colossus', icon: '🌳', level: 12, bond: 30 },
      { name: 'Gemstone Bark', icon: '💎', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Root Ward', icon: '🛡️', level: 30, bond: 0 },
      { name: 'Colossus Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_abyssal', element: 'sp_abyssal', name: 'Abyssal Tide Puffle', short: 'Abyssal Tide', icon: '🌊',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#3A6B8A',
    puffleElement: 'Abyssal', habitatLabel: 'Crystal Tide Coast', habitats: ['crystaltide', 'shadowveil'],
    likes: 'Moon Berry', price: 300, titan: 'Abyssal Singularity Prime',
    style: { primary: '#0E2E4A', secondary: '#5A2A7A', belly: '#1A3A52', ear: '#12354F', iris: '#7FE8FF', eyeShadow: '#040C16', leaf: '#2A6B8A', leafGlow: '#8FE8FF', pads: '#1E4055' },
    personality: ['🌊 Ancient', '🌑 Silent', '🫧 Vast', '✨ Patient'],
    lore: 'Deep-ocean blue bleeding into void purple, with eyes that glow like something far below the light. Abyssal Puffles have been around longer than the hollow and see no reason to mention it.',
    stats: { fluffiness: 88, cuddliness: 74, magic: 100, joy: 66, luck: 88 },
    gene: { name: 'Abyssal Pull', icon: '🌊', desc: 'Night games pay +7 coins and chats pay +4.', effect: { nightCoins: 7, chatCoins: 4 } },
    traits: [
      { name: 'Abyssal Gaze', icon: '👁️', level: 1, bond: 0 },
      { name: 'Trench Surge', icon: '🌊', level: 5, bond: 10 },
      { name: 'Singularity Coil', icon: '🌀', level: 12, bond: 30 },
      { name: 'Abyssal Singularity', icon: '🌌', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Deep Pressure', icon: '🫧', level: 30, bond: 0 },
      { name: 'Trench Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_celestialprism', element: 'sp_celestialprism', name: 'Celestial Prism Puffle', short: 'Celestial Prism', icon: '💠',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#B8A8FF',
    puffleElement: 'Celestial', habitatLabel: 'Celestial Meadows', habitats: ['celestial', 'prismcaverns'],
    likes: 'Lava Cookie', price: 320, titan: 'Cosmic Prism Storm Prime',
    style: { primary: '#B8A8FF', secondary: '#FFD35A', belly: '#FFF3FF', ear: '#C9C0FF', iris: '#6FC8FF', eyeShadow: '#4A2E7A', leaf: '#A8E8FF', leafGlow: '#FFF0B8', pads: '#E8D8FF' },
    personality: ['💠 Radiant', '⚡ Precise', '🌌 Serene', '✨ Grand'],
    lore: 'Rainbow-crystal fur crackling with gold lightning, wings of floating shard-light folded neatly against its back. Celestial Prism Puffles are what a thunderstorm looks like when it is being polite.',
    stats: { fluffiness: 92, cuddliness: 78, magic: 100, joy: 86, luck: 94 },
    gene: { name: 'Prism Charge', icon: '💠', desc: 'XP gains +18% and games pay +6 coins.', effect: { xp: 1.18, gameCoins: 6 } },
    traits: [
      { name: 'Shard Wings', icon: '💠', level: 1, bond: 0 },
      { name: 'Prism Lance', icon: '⚡', level: 5, bond: 10 },
      { name: 'Heavenly Arc', icon: '🌩️', level: 12, bond: 30 },
      { name: 'Cosmic Prism Storm', icon: '🌌', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Light Refraction', icon: '✨', level: 30, bond: 0 },
      { name: 'Prism Halo', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_lifeheart', element: 'sp_lifeheart', name: 'Lifeheart Puffle', short: 'Lifeheart', icon: '🌺',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#F4A8D8',
    puffleElement: 'Lifeheart', habitatLabel: 'Worldheart Tree', habitats: ['worldheart', 'bloomroot'],
    likes: 'Honeycomb Cake', price: 340, titan: 'Genesis Bloom Prime',
    style: { primary: '#3FAE6B', secondary: '#FFD35A', belly: '#FFFDF0', ear: '#7FD39A', iris: '#F4A8D8', eyeShadow: '#14512F', leaf: '#A8E06A', leafGlow: '#FFF0B8', pads: '#FFD8EC' },
    personality: ['🌺 Devoted', '☀️ Warm', '💗 Gentle', '🌱 Hopeful'],
    lore: 'Emerald fur blooming with crystal-pink flowers that open when it is happy. Lifeheart Puffles are said to have grown the first garden in the hollow, and they still water it.',
    stats: { fluffiness: 98, cuddliness: 100, magic: 94, joy: 96, luck: 90 },
    gene: { name: 'Heartbloom', icon: '🌺', desc: 'Bond grows 25% faster and gifts arrive 25% sooner.', effect: { bond: 1.25, giftSpeed: 1.25 } },
    traits: [
      { name: 'Bloom Pulse', icon: '💗', level: 1, bond: 0 },
      { name: 'Crystal Petal', icon: '🌸', level: 5, bond: 10 },
      { name: 'Garden Warden', icon: '🌿', level: 12, bond: 30 },
      { name: 'Genesis Bloom', icon: '🌺', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Lifebond', icon: '💞', level: 30, bond: 0 },
      { name: 'Heart Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_omnitype', element: 'sp_omnitype', name: 'Omnitype Sprite Puffle', short: 'Omnitype', icon: '🌌',
    tier: 'creator', rarity: 'creator', rarityLabel: 'Creator', stars: 9, color: '#C9A0FF',
    puffleElement: 'Omni', habitatLabel: 'Genesis Core', habitats: ['genesiscore', 'worldheart'],
    likes: 'Lava Cookie', price: 600, titan: 'Genesis Ascension Ascendant',
    style: { primary: '#8B6FE8', secondary: '#FFD35A', belly: '#F0E8FF', ear: '#F4A8D8', iris: '#FFD35A', eyeShadow: '#2A1A54', leaf: '#8FE0A8', leafGlow: '#FFF0B8', pads: '#FFD8F0' },
    personality: ['🌌 Boundless', '✨ Divine', '🪐 Ancient', '☁️ Gentle'],
    lore: 'Aurora fur with nebula accents drifting through it, and every element turning slowly around the fluff like weather around a small warm planet. Omnitype Sprite Puffles are the ones the other elements listen to.',
    stats: { fluffiness: 100, cuddliness: 100, magic: 100, joy: 100, luck: 100 },
    gene: { name: 'Master of Elements', icon: '🌌', desc: 'XP gains +30% and day and night games pay +8 coins.', effect: { xp: 1.3, dayCoins: 8, nightCoins: 8 } },
    traits: [
      { name: 'Origin Pulse', icon: '🌌', level: 1, bond: 0 },
      { name: 'Elemental Chorus', icon: '🎼', level: 5, bond: 10 },
      { name: 'Aurora Mantle', icon: '🌈', level: 12, bond: 30 },
      { name: 'Genesis Ascension', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Creator Authority', icon: '👑', level: 30, bond: 0 },
      { name: 'Nebula Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_signal', element: 'sp_signal', name: 'Signal Puffle', short: 'Signal', icon: '📡',
    tier: 'ultra', rarity: 'ultra', rarityLabel: 'Ultra', stars: 7, color: '#B6F2FF',
    puffleElement: 'Signal', habitatLabel: 'Signal Spire', habitats: ['aurora', 'grove'],
    likes: 'Star Pop', price: 1450, titan: 'Carrier Wave Sovereign',
    style: { primary: '#CFF6FF', secondary: '#8FE8FF', belly: '#F4FEFF', ear: '#B6F2FF', iris: '#3FA9D8', eyeShadow: '#124A63', leaf: '#7FE3D0', leafGlow: '#DFFFF8', pads: '#FFD7E6' },
    personality: ['📡 Broadcasting', '⚡ Overcharged', '💠 Clear', '☁️ Gentle'],
    lore: "Signal Puffles hum at a frequency only the Hollow's older lamps answer. Their fluff carries a standing wave, so their curls never quite settle and the air around them tastes faintly of rain. They find lost things by listening for the room they are in.",
    stats: { fluffiness: 94, cuddliness: 88, magic: 97, joy: 90, luck: 92 },
    gene: { name: 'Carrier Wave', icon: '📡', desc: 'Tuned to the right frequency: XP gains +16% and energy fades 10% slower.', effect: { xp: 1.16, energyMod: 0.9 } },
    traits: [
      { name: 'Frequency Hum', icon: '📡', level: 1, bond: 0 },
      { name: 'Clear Channel', icon: '💠', level: 5, bond: 10 },
      { name: 'Signal Boost', icon: '📢', level: 12, bond: 30 },
      { name: 'Quiet Carrier', icon: '☁️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Crystal Broadcast', icon: '📡', level: 30, bond: 0 },
      { name: 'Spire Sovereign', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_overdrive', element: 'sp_overdrive', name: 'Overdrive Puffle', short: 'Overdrive', icon: '⚡',
    tier: 'ultra', rarity: 'ultra', rarityLabel: 'Ultra', stars: 7, color: '#B6F2FF',
    puffleElement: 'Overdrive', habitatLabel: 'Overclock Warren', habitats: ['grove', 'biome-ice'],
    likes: 'Cloud Cupcake', price: 1550, titan: 'Redline Sovereign',
    style: { primary: '#E6DFFF', secondary: '#A9B6FF', belly: '#FBF8FF', ear: '#D6CDFF', iris: '#FFD35A', eyeShadow: '#2A2154', leaf: '#9FE8FF', leafGlow: '#F0FBFF', pads: '#FFD8F0' },
    personality: ['⚡ Relentless', '💜 Driven', '🔮 Overclocked', '☁️ Devoted'],
    lore: "Overdrive Puffles run a little hotter than the rest of the family, and their fur carries a faint lattice of light where the extra energy leaks out. They will not stop until the game is finished, the snack is eaten and the whole room has been checked twice.",
    stats: { fluffiness: 88, cuddliness: 92, magic: 95, joy: 99, luck: 86 },
    gene: { name: 'Redline', icon: '⚡', desc: 'Keeps the pace without the crash: games pay +12 coins and joy fades 12% slower.', effect: { gameCoins: 12, joyMod: 0.88 } },
    traits: [
      { name: 'Fast Start', icon: '⚡', level: 1, bond: 0 },
      { name: 'Hot Lattice', icon: '🔮', level: 5, bond: 10 },
      { name: 'Second Wind', icon: '💨', level: 12, bond: 30 },
      { name: 'Finisher', icon: '🏁', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Redline Aura', icon: '💜', level: 30, bond: 0 },
      { name: 'Overclock Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_pulse', element: 'sp_pulse', name: 'Pulse Puffle', short: 'Pulse', icon: '💠',
    tier: 'ultra', rarity: 'ultra', rarityLabel: 'Ultra', stars: 7, color: '#B6F2FF',
    puffleElement: 'Pulse', habitatLabel: 'Pulse Garden', habitats: ['aurora', 'sugar'],
    likes: 'Sweet Heart', price: 1500, titan: 'Heartbeat Sovereign',
    style: { primary: '#FFF6D9', secondary: '#FFE08A', belly: '#FFFDF2', ear: '#FFEDB8', iris: '#E8875A', eyeShadow: '#6B3A1E', leaf: '#FFD9A8', leafGlow: '#FFF6E0', pads: '#FFD2DE' },
    personality: ['💠 Steady', '💛 Warm', '✨ Bright', '🌼 Patient'],
    lore: "Pulse Puffles glow in time with whoever is holding them, and their light settles into a slow rhythm when the room is calm. Keepers say a Pulse Puffle is the surest way to know how somebody is really doing.",
    stats: { fluffiness: 96, cuddliness: 99, magic: 90, joy: 94, luck: 88 },
    gene: { name: 'Heartbeat', icon: '💠', desc: 'Settles the whole room: pets build +18% bond and every need fades 8% slower.', effect: { petBond: 1.18, needSlow: 0.92 } },
    traits: [
      { name: 'Steady Glow', icon: '💠', level: 1, bond: 0 },
      { name: 'Warm Rhythm', icon: '💛', level: 5, bond: 10 },
      { name: 'Calm Room', icon: '✨', level: 12, bond: 30 },
      { name: 'Long Beat', icon: '🌼', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Golden Pulse', icon: '✨', level: 30, bond: 0 },
      { name: 'Garden Heart', icon: '👑', level: 45, bond: 90 },
    ],
  },
  /* The Hollow-Born line: one new Sprite Puffle for every rung of the ladder,
     from the moss on the forest floor to the light above it. Each carries its
     own coat colours, so its shell does not need a palette to look new. */
  {
    key: 'sp_mossmallow', element: 'sp_mossmallow', name: 'Mossmallow Puffle', short: 'Mossmallow', icon: '🌿',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#C9CDD2',
    puffleElement: 'Moss', habitatLabel: 'Dewmoss Hollow', habitats: ['grove', 'mycelium'],
    likes: 'Cloud Cupcake', price: 70, titan: 'Dewmoss Sovereign',
    style: { primary: '#DDF3C8', secondary: '#F6FFE8', belly: '#FFFDF2', ear: '#C8E8A8', iris: '#7FB35A', eyeShadow: '#33511F', leaf: '#9FDC7A', leafGlow: '#E9FFD2', pads: '#F4D9C8' },
    personality: ['🌿 Grounded', '🍃 Shy', '💧 Dewy', '🌸 Gentle'],
    lore: 'Mossmallow Puffles grow a green coat of soft moss and groom it like hair, which is why they always look faintly windswept. They sleep under fallen leaves, wake at the first drip of dew, and smell like rain for hours afterwards.',
    stats: { fluffiness: 76, cuddliness: 78, magic: 52, joy: 70, luck: 58 },
    gene: { name: 'Dewmoss', icon: '🌿', desc: 'Snacks give +8% XP and needs fade 8% slower.', effect: { snackXp: 1.08, needSlow: 0.92 } },
    traits: [
      { name: 'Moss Nap', icon: '🍃', level: 1, bond: 0 },
      { name: 'Dew Drink', icon: '💧', level: 5, bond: 10 },
      { name: 'Leaf Blanket', icon: '🍂', level: 12, bond: 30 },
      { name: 'Quiet Patch', icon: '🌿', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Hollow Moss', icon: '🌱', level: 30, bond: 0 },
      { name: 'Dewmoss Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_honeybell', element: 'sp_honeybell', name: 'Honeybell Puffle', short: 'Honeybell', icon: '🍯',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#42D97C',
    puffleElement: 'Honey', habitatLabel: 'Bellflower Hive', habitats: ['sugar', 'grove'],
    likes: 'Honeycomb Cake', price: 90, titan: 'Bellflower Sovereign',
    style: { primary: '#FFD98A', secondary: '#FFF3C9', belly: '#FFFDF4', ear: '#FFE7A8', iris: '#E09A2A', eyeShadow: '#6B4208', leaf: '#FFD166', leafGlow: '#FFF6D2', pads: '#FFD9C8' },
    personality: ['🍯 Sweet', '🐝 Busy', '🔔 Chatty', '🌼 Warm'],
    lore: 'Each ear ends in a tiny bell that rings when a Honeybell is happy, which is often enough that the hive has learned to sleep through it. They carry pollen in their fluff and trade it for snacks with anyone who asks politely.',
    stats: { fluffiness: 82, cuddliness: 84, magic: 60, joy: 86, luck: 64 },
    gene: { name: 'Bell Song', icon: '🔔', desc: 'XP gains +8% and gifts arrive 12% sooner.', effect: { xp: 1.08, giftSpeed: 1.12 } },
    traits: [
      { name: 'Bell Jingle', icon: '🔔', level: 1, bond: 0 },
      { name: 'Pollen Pockets', icon: '🌼', level: 5, bond: 10 },
      { name: 'Hive Hum', icon: '🐝', level: 12, bond: 30 },
      { name: 'Sweet Trade', icon: '🍯', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Bellflower Bloom', icon: '🌷', level: 30, bond: 0 },
      { name: 'Honey Throne', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_glasswing', element: 'sp_glasswing', name: 'Glasswing Puffle', short: 'Glasswing', icon: '🪽',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E89FF',
    puffleElement: 'Glass', habitatLabel: 'Clearwater Steps', habitats: ['tide', 'crystal'],
    likes: 'Warm Soup', price: 110, titan: 'Clearwater Sovereign',
    style: { primary: '#D6F6FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#C2ECFF', iris: '#5AA8D8', eyeShadow: '#1F4A66', leaf: '#8FD8F0', leafGlow: '#EAFBFF', pads: '#E8D8FF' },
    personality: ['🪽 Fragile', '💧 Clear', '✨ Careful', '🫧 Quiet'],
    lore: 'Glasswing fur is translucent at the edges, so the light comes through in pale blue bands. They stand very still on wet stones for minutes at a time, watching the water go by, and startle at the sound of their own name.',
    stats: { fluffiness: 68, cuddliness: 72, magic: 70, joy: 66, luck: 74 },
    gene: { name: 'Clearcoat', icon: '🪽', desc: 'Energy fades 10% slower and games pay +3 coins.', effect: { energyMod: 0.9, gameCoins: 3 } },
    traits: [
      { name: 'Glass Step', icon: '🪽', level: 1, bond: 0 },
      { name: 'Still Water', icon: '💧', level: 5, bond: 10 },
      { name: 'Prism Edge', icon: '✨', level: 12, bond: 30 },
      { name: 'Clear Sight', icon: '🔍', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Ripple Wing', icon: '🌊', level: 30, bond: 0 },
      { name: 'Clearwater Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_emberquill', element: 'sp_emberquill', name: 'Emberquill Puffle', short: 'Emberquill', icon: '🪶',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#9A5CFF',
    puffleElement: 'Ember', habitatLabel: 'Cinder Roost', habitats: ['ember', 'aurora'],
    likes: 'Ember Steak', price: 145, titan: 'Cinder Roost Sovereign',
    style: { primary: '#FFB48A', secondary: '#FFE2CE', belly: '#FFF6EE', ear: '#FFC6A0', iris: '#FF7A3D', eyeShadow: '#7A2A10', leaf: '#FF9E5C', leafGlow: '#FFEAD6', pads: '#FFD3C2' },
    personality: ['🪶 Proud', '🔥 Warm', '🌋 Dramatic', '💤 Dozy'],
    lore: 'A plume of warm feathers runs from an Emberquill’s ears to the tip of its tail, and every one of them glows a little brighter when it is being admired. They roost in cold ash, wake up scorching, and sneeze small sparks when startled.',
    stats: { fluffiness: 80, cuddliness: 84, magic: 82, joy: 88, luck: 66 },
    gene: { name: 'Ember Plume', icon: '🪶', desc: 'Games pay +4 coins and joy fades 10% slower.', effect: { gameCoins: 4, joyMod: 0.9 } },
    traits: [
      { name: 'Warm Plume', icon: '🪶', level: 1, bond: 0 },
      { name: 'Ash Nap', icon: '💤', level: 5, bond: 10 },
      { name: 'Spark Sneeze', icon: '✨', level: 12, bond: 30 },
      { name: 'Roost Glow', icon: '🔥', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Cinder Fan', icon: '🌋', level: 30, bond: 0 },
      { name: 'Ember Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_sunmane', element: 'sp_sunmane', name: 'Sunmane Puffle', short: 'Sunmane', icon: '🌞',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#FFB62E',
    puffleElement: 'Sun', habitatLabel: 'Golden Meadow', habitats: ['savanna', 'aurora'],
    likes: 'Sun Nectar', price: 185, titan: 'Golden Meadow Sovereign',
    style: { primary: '#FFE38A', secondary: '#FFF6C2', belly: '#FFFDF0', ear: '#FFDD6E', iris: '#F2A23C', eyeShadow: '#8A5A00', leaf: '#FFD166', leafGlow: '#FFF7D6', pads: '#FFD9B8' },
    personality: ['🌞 Bright', '🌻 Generous', '☀️ Bold', '🎵 Cheerful'],
    lore: 'The mane is the point: a Sunmane’s fur grows outward in slow golden waves that catch the light like wheat. They follow the sun across the meadow all day without ever seeming to walk, and they hum when they are proud of you.',
    stats: { fluffiness: 90, cuddliness: 88, magic: 86, joy: 94, luck: 80 },
    gene: { name: 'Sungrown', icon: '🌞', desc: 'Day games pay +5 coins and XP gains +12%.', effect: { dayCoins: 5, xp: 1.12 } },
    traits: [
      { name: 'Golden Wave', icon: '🌾', level: 1, bond: 0 },
      { name: 'Sun Follow', icon: '🌞', level: 5, bond: 10 },
      { name: 'Warm Pride', icon: '🎵', level: 12, bond: 30 },
      { name: 'Meadow Mantle', icon: '🌻', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Nooning', icon: '☀️', level: 30, bond: 0 },
      { name: 'Sunmane Diadem', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_starlace', element: 'sp_starlace', name: 'Starlace Puffle', short: 'Starlace', icon: '🌟',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#FF4B5C',
    puffleElement: 'Star', habitatLabel: 'Lacewing Night', habitats: ['night', 'starlit'],
    likes: 'Star Pop', price: 240, titan: 'Lacewing Sovereign',
    style: { primary: '#8B93D8', secondary: '#D8DEFF', belly: '#F4F6FF', ear: '#A8B0F0', iris: '#FFE08A', eyeShadow: '#232A54', leaf: '#B9C2FF', leafGlow: '#EAF0FF', pads: '#FFD6EC' },
    personality: ['🌟 Dreamy', '🌙 Nocturnal', '🕸️ Precise', '💫 Distant'],
    lore: 'Thin silver threads lace through a Starlace’s fur and hold a scatter of tiny stars that only light up after dark. They weave these threads into patterns while they think, and a patient keeper can read a whole mood off the shape.',
    stats: { fluffiness: 88, cuddliness: 82, magic: 96, joy: 84, luck: 92 },
    gene: { name: 'Lacework', icon: '🌟', desc: 'Night games pay +5 coins and pets build +15% bond.', effect: { nightCoins: 5, petBond: 1.15 } },
    traits: [
      { name: 'Star Thread', icon: '🌟', level: 1, bond: 0 },
      { name: 'Night Weave', icon: '🕸️', level: 5, bond: 10 },
      { name: 'Pattern Read', icon: '🔍', level: 12, bond: 30 },
      { name: 'Lace Crown', icon: '👑', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Constellation Lace', icon: '🌌', level: 30, bond: 0 },
      { name: 'Starlace Diadem', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_echofrost', element: 'sp_echofrost', name: 'Echofrost Puffle', short: 'Echofrost', icon: '🧊',
    tier: 'ultra', rarity: 'ultra', rarityLabel: 'Ultra', stars: 7, color: '#B6F2FF',
    puffleElement: 'Echo', habitatLabel: 'Hollow Sounding Ice', habitats: ['biome-ice', 'aurora'],
    likes: 'Warm Soup', price: 320, titan: 'Sounding Ice Sovereign',
    style: { primary: '#C8F0FF', secondary: '#EFFBFF', belly: '#FFFFFF', ear: '#B0E4FF', iris: '#3FA9D8', eyeShadow: '#174A63', leaf: '#8FE0F0', leafGlow: '#E6FAFF', pads: '#DCE8FF' },
    personality: ['🧊 Precise', '🔊 Resonant', '❄️ Calm', '🫧 Watchful'],
    lore: 'Echofrost fur rings like struck ice, and the sound carries further than it should. They answer calls a beat late, on purpose, because they like hearing the room reply. Their breath leaves perfect little rings in the cold.',
    stats: { fluffiness: 92, cuddliness: 86, magic: 98, joy: 82, luck: 88 },
    gene: { name: 'Resonance', icon: '🧊', desc: 'XP gains +16% and energy fades 10% slower.', effect: { xp: 1.16, energyMod: 0.9 } },
    traits: [
      { name: 'Ice Ring', icon: '🧊', level: 1, bond: 0 },
      { name: 'Late Echo', icon: '🔊', level: 5, bond: 10 },
      { name: 'Frost Chime', icon: '❄️', level: 12, bond: 30 },
      { name: 'Sounding Coat', icon: '🫧', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Deep Chime', icon: '🔔', level: 30, bond: 0 },
      { name: 'Sounding Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_prismscale', element: 'sp_prismscale', name: 'Prismscale Puffle', short: 'Prismscale', icon: '🐚',
    tier: 'secret', rarity: 'secret', rarityLabel: 'Secret', stars: 7, color: '#FF8FD6',
    puffleElement: 'Prism', habitatLabel: 'Shelllight Shallows', habitats: ['tide', 'crystal'],
    likes: 'Cloud Feast', price: 360, titan: 'Shelllight Sovereign',
    style: { primary: '#9FF0E0', secondary: '#FFD1EC', belly: '#FFFDFF', ear: '#B8F2E8', iris: '#FF8FD6', eyeShadow: '#1F5C55', leaf: '#7FF0D8', leafGlow: '#FFF0FA', pads: '#FFD8EC' },
    personality: ['🐚 Shimmering', '🌈 Vain', '💧 Tidy', '✨ Secretive'],
    lore: 'Overlapping scales run from a Prismscale’s brow to the tip of its tail, and no two catch light the same way twice. They comb them obsessively, hide the dull ones, and will refuse a snack if the light in the room is not flattering.',
    stats: { fluffiness: 86, cuddliness: 84, magic: 96, joy: 90, luck: 96 },
    gene: { name: 'Scale Sheen', icon: '🐚', desc: 'Games pay +6 coins and gifts arrive 20% sooner.', effect: { gameCoins: 6, giftSpeed: 1.2 } },
    traits: [
      { name: 'Scale Comb', icon: '🐚', level: 1, bond: 0 },
      { name: 'Sheen Shift', icon: '🌈', level: 5, bond: 10 },
      { name: 'Tide Mirror', icon: '💧', level: 12, bond: 30 },
      { name: 'Prism Coat', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Shelllight', icon: '🌊', level: 30, bond: 0 },
      { name: 'Prismscale Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_cometwisp', element: 'sp_cometwisp', name: 'Cometwisp Puffle', short: 'Cometwisp', icon: '☄️',
    tier: 'secret', rarity: 'exotic', rarityLabel: 'Exotic', stars: 9, color: '#7AF0D0',
    puffleElement: 'Comet', habitatLabel: 'Falling Star Field', habitats: ['starlit', 'aurora'],
    likes: 'Star Pop', price: 430, titan: 'Falling Star Sovereign',
    style: { primary: '#FFC49A', secondary: '#9FD8FF', belly: '#FFF6EE', ear: '#FFD9BE', iris: '#5AD6FF', eyeShadow: '#3A2418', leaf: '#FFAD7A', leafGlow: '#FFF0DC', pads: '#FFD8E8' },
    personality: ['☄️ Restless', '🌠 Hopeful', '💫 Fast', '🫧 Soft-spoken'],
    lore: 'A Cometwisp leaves a trail of cooling sparks wherever it runs, and the trail fades in the order it was made, so a keeper can tell how long ago it passed. They only ever slow down when somebody is watching the sky with them.',
    stats: { fluffiness: 90, cuddliness: 86, magic: 98, joy: 94, luck: 98 },
    gene: { name: 'Falling Trail', icon: '☄️', desc: 'Night games pay +6 coins and XP gains +15%.', effect: { nightCoins: 6, xp: 1.15 } },
    traits: [
      { name: 'Spark Trail', icon: '☄️', level: 1, bond: 0 },
      { name: 'Cooling Tail', icon: '🌠', level: 5, bond: 10 },
      { name: 'Sky Watch', icon: '🔭', level: 12, bond: 30 },
      { name: 'Falling Light', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Comet Arc', icon: '🌌', level: 30, bond: 0 },
      { name: 'Falling Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_crownquill', element: 'sp_crownquill', name: 'Crownquill Puffle', short: 'Crownquill', icon: '🖋️',
    tier: 'secret', rarity: 'master', rarityLabel: 'Master', stars: 9, color: '#FFE9A3',
    puffleElement: 'Quill', habitatLabel: 'Ledger Keep', habitats: ['starlit', 'night'],
    likes: 'Honeycomb Cake', price: 480, titan: 'Ledger Keep Sovereign',
    style: { primary: '#E8D48A', secondary: '#FFF6D2', belly: '#FFFDF2', ear: '#F0DE9E', iris: '#8A6BD8', eyeShadow: '#4A3A12', leaf: '#F2D166', leafGlow: '#FFF7DA', pads: '#E8D8FF' },
    personality: ['🖋️ Meticulous', '👑 Proud', '📚 Patient', '⚖️ Fair'],
    lore: 'A single stiff quill grows from a Crownquill’s brow, and it taps the ground when the puffle is thinking. They keep the Hollow’s small records in their head, remember every keeper who ever fed them, and correct your spelling with a look.',
    stats: { fluffiness: 88, cuddliness: 82, magic: 99, joy: 86, luck: 94 },
    gene: { name: 'Ledger', icon: '🖋️', desc: 'Games pay +8 coins and joy fades 12% slower.', effect: { gameCoins: 8, joyMod: 0.88 } },
    traits: [
      { name: 'Quill Tap', icon: '🖋️', level: 1, bond: 0 },
      { name: 'Small Records', icon: '📚', level: 5, bond: 10 },
      { name: 'Fair Measure', icon: '⚖️', level: 12, bond: 30 },
      { name: 'Ledger Crown', icon: '👑', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Ink Signature', icon: '✒️', level: 30, bond: 0 },
      { name: 'Crownquill Diadem', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_runebloom', element: 'sp_runebloom', name: 'Runebloom Puffle', short: 'Runebloom', icon: '🔮',
    tier: 'secret', rarity: 'ancient', rarityLabel: 'Ancient', stars: 9, color: '#6B5C9B',
    puffleElement: 'Rune', habitatLabel: 'Oldroot Circle', habitats: ['grove', 'night'],
    likes: 'Honeycomb Cake', price: 520, titan: 'Oldroot Sovereign',
    style: { primary: '#B49AE0', secondary: '#E6DBFF', belly: '#FBF7FF', ear: '#C6B0EC', iris: '#8FE07A', eyeShadow: '#2A1C46', leaf: '#9FE07A', leafGlow: '#EDFFDE', pads: '#E8D6FF' },
    personality: ['🔮 Ancient', '🌱 Patient', '🪨 Unhurried', '✨ Kind'],
    lore: 'Runes bloom out of a Runebloom’s fur in slow green flowers, one every season, and each one spells a word nobody has finished reading. They sit in the old stone circles for hours and seem to be listening to something under the ground.',
    stats: { fluffiness: 94, cuddliness: 88, magic: 100, joy: 88, luck: 96 },
    gene: { name: 'Old Rune', icon: '🔮', desc: 'Snacks give +25% XP and needs fade 10% slower.', effect: { snackXp: 1.25, needSlow: 0.9 } },
    traits: [
      { name: 'Rune Bloom', icon: '🔮', level: 1, bond: 0 },
      { name: 'Stone Listen', icon: '🪨', level: 5, bond: 10 },
      { name: 'Slow Season', icon: '🌱', level: 12, bond: 30 },
      { name: 'Circle Keeper', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Deep Root Word', icon: '🌳', level: 30, bond: 0 },
      { name: 'Runebloom Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_aureate', element: 'sp_aureate', name: 'Aureate Puffle', short: 'Aureate', icon: '🌕',
    tier: 'secret', rarity: 'divine', rarityLabel: 'Divine', stars: 10, color: '#FFF4C4',
    puffleElement: 'Gold', habitatLabel: 'Halo Terrace', habitats: ['starlit', 'aurora'],
    likes: 'Cloud Feast', price: 560, titan: 'Halo Terrace Sovereign',
    style: { primary: '#FFF0BE', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#FFE6A8', iris: '#FFD166', eyeShadow: '#8A6E1E', leaf: '#FFE08A', leafGlow: '#FFFCE8', pads: '#FFE8D2' },
    personality: ['🌕 Serene', '🕊️ Merciful', '✨ Radiant', '🤍 Steady'],
    lore: 'An Aureate carries a thin gold ring above its head that widens when it is content and tightens when it worries. They stand at the edge of the terrace at dawn, wait for the light, and then come back inside to check on everyone.',
    stats: { fluffiness: 96, cuddliness: 94, magic: 100, joy: 96, luck: 98 },
    gene: { name: 'Aureole', icon: '🌕', desc: 'Pets build +20% bond and day games pay +7 coins.', effect: { petBond: 1.2, dayCoins: 7 } },
    traits: [
      { name: 'Gold Ring', icon: '🌕', level: 1, bond: 0 },
      { name: 'Dawn Wait', icon: '🌅', level: 5, bond: 10 },
      { name: 'Gentle Check', icon: '🤍', level: 12, bond: 30 },
      { name: 'Halo Bright', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Terrace Light', icon: '🕊️', level: 30, bond: 0 },
      { name: 'Aureate Diadem', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_nebulace', element: 'sp_nebulace', name: 'Nebulace Puffle', short: 'Nebulace', icon: '🌌',
    tier: 'creator', rarity: 'celestial', rarityLabel: 'Celestial', stars: 10, color: '#8F7CFF',
    puffleElement: 'Nebula', habitatLabel: 'Lace Nebula', habitats: ['starlit', 'night'],
    likes: 'Star Pop', price: 600, titan: 'Lace Nebula Sovereign',
    style: { primary: '#8A6BE8', secondary: '#FF9FD0', belly: '#F6EEFF', ear: '#A88CF0', iris: '#6FE0FF', eyeShadow: '#2A1854', leaf: '#8FD8FF', leafGlow: '#FFDFF2', pads: '#FFD6EC' },
    personality: ['🌌 Vast', '🪐 Quiet', '💫 Wandering', '✨ Tender'],
    lore: 'A Nebulace’s coat holds a slow swirl of violet cloud with pink light moving through it, and the swirl never repeats. They drift between rooms without announcing it, and the ones who notice say the room feels larger afterwards.',
    stats: { fluffiness: 98, cuddliness: 92, magic: 100, joy: 94, luck: 99 },
    gene: { name: 'Nebula Drift', icon: '🌌', desc: 'Night games pay +8 coins and XP gains +18%.', effect: { nightCoins: 8, xp: 1.18 } },
    traits: [
      { name: 'Slow Swirl', icon: '🌌', level: 1, bond: 0 },
      { name: 'Quiet Drift', icon: '💫', level: 5, bond: 10 },
      { name: 'Room Largeness', icon: '🪐', level: 12, bond: 30 },
      { name: 'Nebula Mantle', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Lace Light', icon: '🌠', level: 30, bond: 0 },
      { name: 'Nebulace Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_aeonpuff', element: 'sp_aeonpuff', name: 'Aeonpuff Puffle', short: 'Aeonpuff', icon: '⏳',
    tier: 'creator', rarity: 'eternal', rarityLabel: 'Eternal', stars: 11, color: '#F4F1FF',
    puffleElement: 'Time', habitatLabel: 'Long Hour Garden', habitats: ['night', 'dream'],
    likes: 'Star Pop', price: 640, titan: 'Long Hour Sovereign',
    style: { primary: '#E8E8FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#DCD8FF', iris: '#B9A8FF', eyeShadow: '#3A3560', leaf: '#C9C2FF', leafGlow: '#F4F2FF', pads: '#E8E0FF' },
    personality: ['⏳ Patient', '🕰️ Exact', '🌙 Calm', '💤 Unhurried'],
    lore: 'Thin silver rings orbit an Aeonpuff’s head, each turning at its own speed, and keepers swear they slow down when the mood is good. They arrive exactly when they are needed and never once seem to hurry to get there.',
    stats: { fluffiness: 98, cuddliness: 96, magic: 100, joy: 98, luck: 100 },
    gene: { name: 'Long Hour', icon: '⏳', desc: 'Needs fade 15% slower and gifts arrive 25% sooner.', effect: { needSlow: 0.85, giftSpeed: 1.25 } },
    traits: [
      { name: 'Ring Turn', icon: '⏳', level: 1, bond: 0 },
      { name: 'Exact Arrival', icon: '🕰️', level: 5, bond: 10 },
      { name: 'Slow Mood', icon: '🌙', level: 12, bond: 30 },
      { name: 'Long Patience', icon: '💤', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Hour Garden', icon: '🌿', level: 30, bond: 0 },
      { name: 'Aeon Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_cosmocrown', element: 'sp_cosmocrown', name: 'Cosmocrown Puffle', short: 'Cosmocrown', icon: '👑',
    tier: 'creator', rarity: 'creator', rarityLabel: 'Creator', stars: 11, color: '#FFF4C4',
    puffleElement: 'Creation', habitatLabel: 'Firstlight Garden', habitats: ['genesiscore', 'worldheart'],
    likes: 'Honeycomb Cake', price: 680, titan: 'Firstlight Sovereign',
    style: { primary: '#D8B8FF', secondary: '#FFD166', belly: '#FFFCEF', ear: '#E6CCFF', iris: '#6FE0FF', eyeShadow: '#33204F', leaf: '#B9FFD6', leafGlow: '#FFF7D6', pads: '#FFD8EC' },
    personality: ['👑 Sovereign', '🌱 Inventive', '✨ Grand', '☁️ Gentle'],
    lore: 'A Cosmocrown wears a small crown of braided light that it grew itself, and beneath it a fresh idea is always half-finished. They build tiny worlds in the corners of the garden and invite everyone to live in them.',
    stats: { fluffiness: 100, cuddliness: 98, magic: 100, joy: 100, luck: 100 },
    gene: { name: 'Firstlight', icon: '👑', desc: 'XP gains +30% and day and night games pay +8 coins.', effect: { xp: 1.3, dayCoins: 8, nightCoins: 8 } },
    traits: [
      { name: 'Light Crown', icon: '👑', level: 1, bond: 0 },
      { name: 'Half Idea', icon: '🌱', level: 5, bond: 10 },
      { name: 'Corner World', icon: '🌍', level: 12, bond: 30 },
      { name: 'Opening Invite', icon: '☁️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'First Word', icon: '✨', level: 30, bond: 0 },
      { name: 'Cosmocrown', icon: '🌌', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_godspark', element: 'sp_godspark', name: 'Godspark Puffle', short: 'Godspark', icon: '🌟',
    tier: 'creator', rarity: 'god', rarityLabel: 'God', stars: 12, color: '#FFDD88',
    puffleElement: 'Godlight', habitatLabel: 'Throne of First Light', habitats: ['genesiscore', 'starlit'],
    likes: 'Lava Cookie', price: 720, titan: 'First Light Sovereign',
    style: { primary: '#FFF6D6', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#FFEBB8', iris: '#FFB347', eyeShadow: '#7A5410', leaf: '#FFD166', leafGlow: '#FFFBE6', pads: '#FFE2C2' },
    personality: ['🌟 Blinding', '🤍 Kind', '⚡ Decisive', '🕊️ Still'],
    lore: 'No coat, just light held in the shape of a puffle. A Godspark arrives quietly, sits with whoever needs it most, and leaves a warm patch on the floor that lasts until morning. The Hollow has never counted more than one at a time, and never needed to.',
    stats: { fluffiness: 100, cuddliness: 100, magic: 100, joy: 100, luck: 100 },
    gene: { name: 'Godlight', icon: '🌟', desc: 'XP gains +34%, games pay +12 coins, and gifts arrive 30% sooner.', effect: { xp: 1.34, gameCoins: 12, giftSpeed: 1.3 } },
    traits: [
      { name: 'Warm Patch', icon: '🌟', level: 1, bond: 0 },
      { name: 'Quiet Arrival', icon: '🕊️', level: 5, bond: 10 },
      { name: 'True Light', icon: '🤍', level: 12, bond: 30 },
      { name: 'First Light', icon: '✨', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Godspark Halo', icon: '👑', level: 30, bond: 0 },
      { name: 'Throne of Light', icon: '🌟', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_naptime', element: 'sp_naptime', name: 'Naptime Puffle', short: 'Naptime', icon: '🛏️',
    tier: 'common', rarity: 'common', rarityLabel: 'Common', stars: 1, color: '#C9CDD2',
    puffleElement: 'Drowse', habitatLabel: 'Cuddleburrow', habitats: ['grove', 'dream'],
    likes: 'Cloud Cupcake', favoriteToy: 'Plush Star', price: 75, titan: 'Hushblanket Sovereign',
    style: { primary: '#E7E1FA', secondary: '#FBF8FF', belly: '#FFFFFF', ear: '#D9D2F5', iris: '#8B7BD8', eyeShadow: '#40366F', leaf: '#C9BDF2', leafGlow: '#F1ECFF', pads: '#F6DCE6' },
    personality: ['😴 Dozy', '🛏️ Cozy', '🌙 Quiet', '💤 Late'],
    lore: 'Naptime Puffles sleep about eighteen hours a day and drag a corner of blanket everywhere they go. Waking one is a negotiation: it opens one eye, sighs, and goes back to sleep holding your sleeve.',
    stats: { fluffiness: 80, cuddliness: 88, magic: 44, joy: 74, luck: 52 },
    gene: { name: 'Hushfall', icon: '😴', desc: 'XP gains +6% and the coat stays clean 6% longer.', effect: { xp: 1.06, cleanDecay: 0.94 } },
    traits: [
      { name: 'Blanket Drag', icon: '🛏️', level: 1, bond: 0 },
      { name: 'Yawn Bubble', icon: '💤', level: 5, bond: 10 },
      { name: 'Nap Alarm', icon: '⏰', level: 12, bond: 30 },
      { name: 'Dream Doze', icon: '🌙', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Pillow Fort', icon: '🏕️', level: 30, bond: 0 },
      { name: 'Hushblanket Halo', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_rattle', element: 'sp_rattle', name: 'Rattle Puffle', short: 'Rattle', icon: '🍼',
    tier: 'uncommon', rarity: 'uncommon', rarityLabel: 'Uncommon', stars: 2, color: '#42D97C',
    puffleElement: 'Rattle', habitatLabel: 'Nursery Nook', habitats: ['sugar', 'dream'],
    likes: 'Honeycomb Cake', favoriteToy: 'Shell Rattle', price: 95, titan: 'Lullaby Chorus',
    style: { primary: '#FFE5D0', secondary: '#FFF8F0', belly: '#FFFFFF', ear: '#FFD7B8', iris: '#E08A3C', eyeShadow: '#5B3312', leaf: '#FFC58F', leafGlow: '#FFF0DF', pads: '#FFD9C2' },
    personality: ['🍼 Loud', '🎶 Musical', '👶 Small', '💫 Curious'],
    lore: 'Every Rattle Puffle is born with a seed pod in each paw and no concept of quiet. They shake in time with footsteps, which the Hollow has decided is charming and the library has decided is not.',
    stats: { fluffiness: 70, cuddliness: 80, magic: 52, joy: 90, luck: 60 },
    gene: { name: 'Shaker Song', icon: '🍼', desc: 'Gifts arrive 15% sooner and joy fades 8% slower.', effect: { giftSpeed: 1.15, joyDecay: 0.92 } },
    traits: [
      { name: 'First Shake', icon: '🍼', level: 1, bond: 0 },
      { name: 'Wobble Beat', icon: '🥁', level: 5, bond: 10 },
      { name: 'Hush Rattle', icon: '🤐', level: 12, bond: 30 },
      { name: 'Chorus Hum', icon: '🎶', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Bell Bundle', icon: '🔔', level: 30, bond: 0 },
      { name: 'Lullaby Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_stuffie', element: 'sp_stuffie', name: 'Stuffie Puffle', short: 'Stuffie', icon: '🧸',
    tier: 'rare', rarity: 'rare', rarityLabel: 'Rare', stars: 3, color: '#3E7BD6',
    puffleElement: 'Patchwork', habitatLabel: 'Stitched Hollow', habitats: ['grove', 'bloomroot'],
    likes: 'Warm Soup', favoriteToy: 'Yarn Tangle', price: 115, titan: 'Buttonheart Guardian',
    style: { primary: '#F6D9C4', secondary: '#FFF4EA', belly: '#FFFFFF', ear: '#EAC3A8', iris: '#B4713F', eyeShadow: '#4A2A14', leaf: '#E8B58F', leafGlow: '#FFF0E2', pads: '#F3D2C0' },
    personality: ['🧸 Soft', '🪡 Patient', '🧵 Mended', '🤍 Loyal'],
    lore: 'Stuffie Puffles are sewn from leftovers and know it. Each one keeps a tin of thread behind its ear and will quietly mend a torn blanket, a sleeve or another puffle while its keeper looks away.',
    stats: { fluffiness: 86, cuddliness: 92, magic: 48, joy: 80, luck: 58 },
    gene: { name: 'Soft Mending', icon: '🪡', desc: 'Care builds 12% more bond and naps restore 5% more energy.', effect: { petBond: 1.12, energyDecay: 0.95 } },
    traits: [
      { name: 'Button Eye', icon: '🧸', level: 1, bond: 0 },
      { name: 'Seam Mend', icon: '🪡', level: 5, bond: 10 },
      { name: 'Cotton Hug', icon: '☁️', level: 12, bond: 30 },
      { name: 'Loose Thread', icon: '🧵', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Patchwork Armor', icon: '🛡️', level: 30, bond: 0 },
      { name: 'Buttonheart Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_puppet', element: 'sp_puppet', name: 'Puppet Puffle', short: 'Puppet', icon: '🎭',
    tier: 'epic', rarity: 'epic', rarityLabel: 'Epic', stars: 4, color: '#A855F7',
    puffleElement: 'Puppetry', habitatLabel: 'Stringstage Hollow', habitats: ['neon', 'dream'],
    likes: 'Crunch Crisps', favoriteToy: 'Twig Boomerang', price: 150, titan: 'Marionette Maestro',
    style: { primary: '#FFD9E8', secondary: '#FFF6FA', belly: '#FFFFFF', ear: '#F3BFD2', iris: '#C9527F', eyeShadow: '#5E1F38', leaf: '#E88FA9', leafGlow: '#FFEAF1', pads: '#F8D3DE' },
    personality: ['🎭 Theatrical', '🪡 Precise', '✨ Dramatic', '🎪 Playful'],
    lore: 'A Puppet Puffle moves like it is being worked from above, even when nothing is holding the strings. It bows before meals, rehearses in doorways, and will not walk anywhere in a straight line if a dramatic arc is available.',
    stats: { fluffiness: 74, cuddliness: 78, magic: 70, joy: 88, luck: 66 },
    gene: { name: 'String Pull', icon: '🎭', desc: 'Tasks pay +10 coins and XP gains +5%.', effect: { taskCoins: 10, xp: 1.05 } },
    traits: [
      { name: 'String Step', icon: '🎭', level: 1, bond: 0 },
      { name: 'Stage Voice', icon: '🎤', level: 5, bond: 10 },
      { name: 'Curtain Bow', icon: '🎪', level: 12, bond: 30 },
      { name: 'Wooden Wink', icon: '😉', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Marionette Rig', icon: '🧵', level: 30, bond: 0 },
      { name: 'Maestro Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_kite', element: 'sp_kite', name: 'Kite Puffle', short: 'Kite', icon: '🪁',
    tier: 'legendary', rarity: 'legendary', rarityLabel: 'Legendary', stars: 5, color: '#F59E0B',
    puffleElement: 'Updraft', habitatLabel: 'Windloft Meadow', habitats: ['grove', 'whisperwind'],
    likes: 'Star Pop', favoriteToy: 'Wind Kite', price: 190, titan: 'Highwind Sovereign',
    style: { primary: '#CFE9FF', secondary: '#F2FAFF', belly: '#FFFFFF', ear: '#AFD6F5', iris: '#3F7FBF', eyeShadow: '#173A5E', leaf: '#8FC4EC', leafGlow: '#E6F5FF', pads: '#D8E6F2' },
    personality: ['🪁 Airborne', '🌬️ Restless', '☁️ Dreamy', '🏏 Bright'],
    lore: 'Kite Puffles cannot resist an open sky. Their tail ribbons catch every breeze, and on a good day they will tow a keeper across the meadow by the sleeve rather than walk home.',
    stats: { fluffiness: 78, cuddliness: 76, magic: 72, joy: 92, luck: 70 },
    gene: { name: 'Tailwind', icon: '🪁', desc: 'Games pay +12 coins and gifts arrive 10% sooner.', effect: { gameCoins: 12, giftSpeed: 1.1 } },
    traits: [
      { name: 'Tail Catch', icon: '🪁', level: 1, bond: 0 },
      { name: 'String Climb', icon: '🧵', level: 5, bond: 10 },
      { name: 'Cloud Cut', icon: '☁️', level: 12, bond: 30 },
      { name: 'Sky Loop', icon: '🌀', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Paper Ribbon', icon: '🎀', level: 30, bond: 0 },
      { name: 'Highwind Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_marble', element: 'sp_marble', name: 'Marble Puffle', short: 'Marble', icon: '🔮',
    tier: 'mythic', rarity: 'mythic', rarityLabel: 'Mythic', stars: 6, color: '#EC4899',
    puffleElement: 'Glasswork', habitatLabel: 'Marble Run Deep', habitats: ['crystal', 'prismcaverns'],
    likes: 'Sweet Heart', favoriteToy: 'Pebble Puzzle', price: 245, titan: 'Glasswhirl Monarch',
    style: { primary: '#CDEBE6', secondary: '#F1FCFA', belly: '#FFFFFF', ear: '#A8DCD4', iris: '#2E8C80', eyeShadow: '#0F3F3A', leaf: '#7CC9BE', leafGlow: '#E2FBF7', pads: '#CFE7E2' },
    personality: ['🔮 Glassy', '🌀 Spinning', '💠 Clear', '🎯 Keen'],
    lore: 'Marble Puffles are half glass and roll more than they walk, tucking in their paws to coast down any slope. Look closely and a second swirl turns inside the first, always a little behind.',
    stats: { fluffiness: 70, cuddliness: 74, magic: 86, joy: 76, luck: 84 },
    gene: { name: 'Glass Spin', icon: '🔮', desc: 'XP gains +10% and games pay +8 coins.', effect: { xp: 1.1, gameCoins: 8 } },
    traits: [
      { name: 'Marble Roll', icon: '🔮', level: 1, bond: 0 },
      { name: 'Glass Clink', icon: '💠', level: 5, bond: 10 },
      { name: 'Spiral Cut', icon: '🌀', level: 12, bond: 30 },
      { name: 'Cats Eye', icon: '👁️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Prism Sphere', icon: '🔮', level: 30, bond: 0 },
      { name: 'Glasswhirl Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_musicbox', element: 'sp_musicbox', name: 'Musicbox Puffle', short: 'Musicbox', icon: '🎶',
    tier: 'ultra', rarity: 'ultra', rarityLabel: 'Ultra', stars: 7, color: '#14B8A6',
    puffleElement: 'Clockwork', habitatLabel: 'Brasslullaby Attic', habitats: ['sugar', 'night'],
    likes: 'Snow Cone', favoriteToy: 'Acorn Drum', price: 330, titan: 'Woundspring Sovereign',
    style: { primary: '#F3E2C2', secondary: '#FFF9EE', belly: '#FFFFFF', ear: '#E2C69B', iris: '#9E6B2F', eyeShadow: '#3E2710', leaf: '#D9B67C', leafGlow: '#FFF3DE', pads: '#F0DCC4' },
    personality: ['🎶 Tuned', '⏳ Patient', '🩰 Graceful', '🔔 Gentle'],
    lore: 'A Musicbox Puffle has a small brass key between its shoulders and a song wound into its bones. It plays only when it thinks nobody is listening, which is why the attic is always faintly humming.',
    stats: { fluffiness: 76, cuddliness: 80, magic: 90, joy: 86, luck: 80 },
    gene: { name: 'Wound Key', icon: '🎶', desc: 'XP gains +14% and gifts arrive 8% sooner.', effect: { xp: 1.14, giftSpeed: 1.08 } },
    traits: [
      { name: 'Key Turn', icon: '🔑', level: 1, bond: 0 },
      { name: 'Tiny Dancer', icon: '🩰', level: 5, bond: 10 },
      { name: 'Music Memory', icon: '🎼', level: 12, bond: 30 },
      { name: 'Sleep Song', icon: '🎵', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Brass Lid', icon: '🎹', level: 30, bond: 0 },
      { name: 'Woundspring Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_lullaby', element: 'sp_lullaby', name: 'Lullaby Puffle', short: 'Lullaby', icon: '🌙',
    tier: 'secret', rarity: 'secret', rarityLabel: 'Secret', stars: 8, color: '#8B5CF6',
    puffleElement: 'Nightfall', habitatLabel: 'Hushwater Cove', habitats: ['dream', 'night'],
    likes: 'Moon Berry', favoriteToy: 'Balloon Bud', price: 375, titan: 'Quietsong Keeper',
    style: { primary: '#D9DDF5', secondary: '#F4F6FF', belly: '#FFFFFF', ear: '#BFC5EC', iris: '#5A63B8', eyeShadow: '#22264F', leaf: '#9BA4DE', leafGlow: '#EDF0FF', pads: '#DDE1F3' },
    personality: ['🌙 Hushed', '💤 Sleepy', '✨ Soothing', '🤫 Secret'],
    lore: 'Lullaby Puffles keep every song they have ever heard and give them back at the exact moment someone needs to sleep. Sailors on the Hushwater say the cove goes quiet when one arrives, and stays quiet for a week.',
    stats: { fluffiness: 82, cuddliness: 86, magic: 88, joy: 84, luck: 86 },
    gene: { name: 'Quietsong', icon: '🌙', desc: 'Joy fades 12% slower and XP gains +12%.', effect: { joyDecay: 0.88, xp: 1.12 } },
    traits: [
      { name: 'Hush Note', icon: '🎵', level: 1, bond: 0 },
      { name: 'Drift Under', icon: '🌊', level: 5, bond: 10 },
      { name: 'Star Blanket', icon: '🌟', level: 12, bond: 30 },
      { name: 'Sleep Ward', icon: '🛡️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Moon Lullaby', icon: '🌙', level: 30, bond: 0 },
      { name: 'Quietsong Halo', icon: '✨', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_thorncrown', element: 'sp_thorncrown', name: 'Thorncrown Puffle', short: 'Thorncrown', icon: '🌵',
    tier: 'secret', rarity: 'exotic', rarityLabel: 'Exotic', stars: 9, color: '#84CC16',
    puffleElement: 'Bramble', habitatLabel: 'Throne of Thorns', habitats: ['savanna', 'stoneheart'],
    likes: 'Ember Steak', favoriteToy: 'Twig Boomerang', price: 445, titan: 'Brambleking',
    style: { primary: '#D8E8C4', secondary: '#F5FFEC', belly: '#FFFFFF', ear: '#B9D49A', iris: '#4F7A32', eyeShadow: '#24390F', leaf: '#9CC47B', leafGlow: '#ECFFD9', pads: '#DCE8CE' },
    personality: ['🌵 Prickly', '👑 Regal', '🪵 Stubborn', '⚔️ Bold'],
    lore: 'Thorncrown Puffles grow a briar circlet in the first month and never lose it. They hold court on the dry ridges, settle disputes by standing very still, and are the only species that has ever made the savanna fence back down.',
    stats: { fluffiness: 84, cuddliness: 72, magic: 88, joy: 78, luck: 82 },
    gene: { name: 'Thorn Oath', icon: '🌵', desc: 'Games pay +14 coins and XP gains +8%.', effect: { gameCoins: 14, xp: 1.08 } },
    traits: [
      { name: 'Briar Guard', icon: '🌵', level: 1, bond: 0 },
      { name: 'Crown Cut', icon: '✂️', level: 5, bond: 10 },
      { name: 'Thorn Salute', icon: '👑', level: 12, bond: 30 },
      { name: 'Root Claim', icon: '🌿', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Bramble Diadem', icon: '👑', level: 30, bond: 0 },
      { name: 'Thorncrown Regalia', icon: '🌿', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_gilded', element: 'sp_gilded', name: 'Gilded Puffle', short: 'Gilded', icon: '🥇',
    tier: 'secret', rarity: 'master', rarityLabel: 'Master', stars: 10, color: '#EAB308',
    puffleElement: 'Gilding', habitatLabel: 'Goldleaf Court', habitats: ['genesiscore', 'sugar'],
    likes: 'Honeycomb Cake', favoriteToy: 'Plush Star', price: 485, titan: 'Goldmantle Sovereign',
    style: { primary: '#FFEFC2', secondary: '#FFFBF0', belly: '#FFFFFF', ear: '#FFE19A', iris: '#B08422', eyeShadow: '#4A3306', leaf: '#F2CE7A', leafGlow: '#FFF7DF', pads: '#F5E3C0' },
    personality: ['🥇 Polished', '👑 Proud', '💰 Generous', '✨ Gleaming'],
    lore: 'Gilded Puffles sweat a thin gold leaf that hardens into a mantle by their third year. They shed it every spring and leave the flakes in the Hollow for whoever needs a little luck.',
    stats: { fluffiness: 86, cuddliness: 80, magic: 86, joy: 88, luck: 90 },
    gene: { name: 'Gilt Touch', icon: '🥇', desc: 'Check-ins pay +20 coins and XP gains +10%.', effect: { checkinCoins: 20, xp: 1.1 } },
    traits: [
      { name: 'Gold Glance', icon: '🥇', level: 1, bond: 0 },
      { name: 'Coin Sneeze', icon: '🪙', level: 5, bond: 10 },
      { name: 'Polished Coat', icon: '✨', level: 12, bond: 30 },
      { name: 'Tribute Bow', icon: '🙇', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Gilded Scepter', icon: '🔱', level: 30, bond: 0 },
      { name: 'Goldmantle Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_obsidian', element: 'sp_obsidian', name: 'Obsidian Puffle', short: 'Obsidian', icon: '🗿',
    tier: 'secret', rarity: 'ancient', rarityLabel: 'Ancient', stars: 11, color: '#22D3EE',
    puffleElement: 'Obsidian', habitatLabel: 'Blackglass Vault', habitats: ['crystal', 'shadowveil'],
    likes: 'Lava Cookie', favoriteToy: 'Pebble Puzzle', price: 545, titan: 'Blackglass Sovereign',
    style: { primary: '#D5D2DE', secondary: '#F4F2F8', belly: '#FFFFFF', ear: '#B5B0C2', iris: '#5C5470', eyeShadow: '#221E2C', leaf: '#8F89A3', leafGlow: '#EDEAF3', pads: '#D9D4E0' },
    personality: ['🗿 Ancient', '🖤 Still', '🔥 Volcanic', '🛡️ Unmoved'],
    lore: 'Obsidian Puffles cooled too fast and kept the heat inside. Their coat rings like a struck bell and shows a seam of old fire when they yawn, which is the only time they ever look surprised.',
    stats: { fluffiness: 80, cuddliness: 74, magic: 94, joy: 76, luck: 88 },
    gene: { name: 'Obsidian Shell', icon: '🗿', desc: 'XP gains +16% and naps last 10% longer.', effect: { xp: 1.16, energyDecay: 0.9 } },
    traits: [
      { name: 'Glass Armor', icon: '🛡️', level: 1, bond: 0 },
      { name: 'Echo Knock', icon: '🔔', level: 5, bond: 10 },
      { name: 'Volcanic Edge', icon: '🔥', level: 12, bond: 30 },
      { name: 'Vault Guard', icon: '🔐', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Obsidian Helm', icon: '⛑️', level: 30, bond: 0 },
      { name: 'Blackglass Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_cometkin', element: 'sp_cometkin', name: 'Cometkin Puffle', short: 'Cometkin', icon: '☄️',
    tier: 'creator', rarity: 'celestial', rarityLabel: 'Celestial', stars: 12, color: '#38BDF8',
    puffleElement: 'Cometfall', habitatLabel: 'Cometfall Perch', habitats: ['celestial', 'aurora'],
    likes: 'Star Pop', favoriteToy: 'Spark Wand', price: 600, titan: 'Comettail Sovereign',
    style: { primary: '#D9E8FF', secondary: '#F5FAFF', belly: '#FFFFFF', ear: '#B4CDF0', iris: '#4A6FA8', eyeShadow: '#1B2C4A', leaf: '#93B4DE', leafGlow: '#EDF5FF', pads: '#DCE8F7' },
    personality: ['☄️ Swift', '🌌 Vast', '✨ Bright', '🛰️ Wandering'],
    lore: 'A Cometkin arrives on a trail of cold sparks and leaves one behind. They cross the whole Hollow in a night, always in the same arc, and never once land in the same spot twice.',
    stats: { fluffiness: 88, cuddliness: 80, magic: 96, joy: 88, luck: 94 },
    gene: { name: 'Comet Trail', icon: '☄️', desc: 'XP gains +20% and games pay +16 coins.', effect: { xp: 1.2, gameCoins: 16 } },
    traits: [
      { name: 'Tail Streak', icon: '☄️', level: 1, bond: 0 },
      { name: 'Starfall Step', icon: '🌠', level: 5, bond: 10 },
      { name: 'Orbit Nap', icon: '🛰️', level: 12, bond: 30 },
      { name: 'Comet Call', icon: '📣', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Comet Halo', icon: '✨', level: 30, bond: 0 },
      { name: 'Comettail Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_halokin', element: 'sp_halokin', name: 'Halokin Puffle', short: 'Halokin', icon: '🕊️',
    tier: 'secret', rarity: 'divine', rarityLabel: 'Divine', stars: 12, color: '#FBBF24',
    puffleElement: 'Halo', habitatLabel: 'Halodome', habitats: ['celestial', 'genesiscore'],
    likes: 'Sun Nectar', favoriteToy: 'Balloon Bud', price: 620, titan: 'Halolight Sovereign',
    style: { primary: '#FFF1D0', secondary: '#FFFDF4', belly: '#FFFFFF', ear: '#FFE3A8', iris: '#C99333', eyeShadow: '#55390B', leaf: '#F5D488', leafGlow: '#FFFAE6', pads: '#F7E7C6' },
    personality: ['😇 Serene', '🕊️ Kind', '✨ Radiant', '🙏 Steady'],
    lore: 'A ring of warm light circles every Halokin and brightens when it is thanked. They hold the doors of the Halodome open for anyone, and they have never been seen to eat anything except sunlight and the occasional nectar drop.',
    stats: { fluffiness: 90, cuddliness: 90, magic: 94, joy: 92, luck: 92 },
    gene: { name: 'Halolight', icon: '😇', desc: 'XP gains +24% and care builds 15% more bond.', effect: { xp: 1.24, petBond: 1.15 } },
    traits: [
      { name: 'Halo Glow', icon: '😇', level: 1, bond: 0 },
      { name: 'Wing Hush', icon: '🕊️', level: 5, bond: 10 },
      { name: 'Vow of Light', icon: '💫', level: 12, bond: 30 },
      { name: 'Prayer Nap', icon: '🙏', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Seraph Halo', icon: '✨', level: 30, bond: 0 },
      { name: 'Halolight Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_everstar', element: 'sp_everstar', name: 'Everstar Puffle', short: 'Everstar', icon: '✨',
    tier: 'creator', rarity: 'eternal', rarityLabel: 'Eternal', stars: 12, color: '#F472B6',
    puffleElement: 'Evershine', habitatLabel: 'Everlit Court', habitats: ['celestial', 'worldheart'],
    likes: 'Cloud Feast', favoriteToy: 'Wind Kite', price: 660, titan: 'Everlight Sovereign',
    style: { primary: '#FFF6D2', secondary: '#FFFBEA', belly: '#FFFFFF', ear: '#FFE9AE', iris: '#C79A2E', eyeShadow: '#4E3508', leaf: '#F6DB8C', leafGlow: '#FFFCEB', pads: '#F8EAC8' },
    personality: ['✨ Everlit', '🌞 Warm', '♾️ Endless', '🌟 Certain'],
    lore: 'Everstar Puffles burn without consuming themselves, which the Hollows old books list under mysteries rather than species. They keep the Everlit Court lit through the winter and have never been seen to sleep through a dawn.',
    stats: { fluffiness: 92, cuddliness: 88, magic: 98, joy: 90, luck: 96 },
    gene: { name: 'Evershine', icon: '✨', desc: 'XP gains +28% and gifts arrive 20% sooner.', effect: { xp: 1.28, giftSpeed: 1.2 } },
    traits: [
      { name: 'Ever Glow', icon: '✨', level: 1, bond: 0 },
      { name: 'Timeless Nap', icon: '♾️', level: 5, bond: 10 },
      { name: 'Star Vow', icon: '🌟', level: 12, bond: 30 },
      { name: 'Dawn Return', icon: '🌅', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Everstar Halo', icon: '🌟', level: 30, bond: 0 },
      { name: 'Everlight Crown', icon: '👑', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_crownforge', element: 'sp_crownforge', name: 'Crownforge Puffle', short: 'Crownforge', icon: '🔨',
    tier: 'creator', rarity: 'creator', rarityLabel: 'Creator', stars: 12, color: '#F97316',
    puffleElement: 'Forgefire', habitatLabel: 'Crownforge Deep', habitats: ['ember', 'emberpeak'],
    likes: 'Ember Steak', favoriteToy: 'Acorn Drum', price: 700, titan: 'Forgecrown Sovereign',
    style: { primary: '#FBD9C0', secondary: '#FFF4EA', belly: '#FFFFFF', ear: '#F0BC97', iris: '#B45B2A', eyeShadow: '#4A210C', leaf: '#E59B69', leafGlow: '#FFEFE0', pads: '#F7DDC8' },
    personality: ['🔨 Industrious', '🔥 Fiery', '👑 Proud', '🛠️ Skilled'],
    lore: 'Crownforge Puffles were made in the forge and never left it. They hammer out crowns for the other courts, wear none of their own, and keep a coal warm under the tongue for the day someone needs one.',
    stats: { fluffiness: 94, cuddliness: 86, magic: 98, joy: 90, luck: 94 },
    gene: { name: 'Forgefire', icon: '🔨', desc: 'Games pay +20 coins and XP gains +30%.', effect: { gameCoins: 20, xp: 1.3 } },
    traits: [
      { name: 'Anvil Tap', icon: '🔨', level: 1, bond: 0 },
      { name: 'Spark Spit', icon: '✨', level: 5, bond: 10 },
      { name: 'Crown Cast', icon: '👑', level: 12, bond: 30 },
      { name: 'Molten Nap', icon: '🔥', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Forge Crown', icon: '👑', level: 30, bond: 0 },
      { name: 'Forgefire Regalia', icon: '🏆', level: 45, bond: 90 },
    ],
  },
  {
    key: 'sp_firstword', element: 'sp_firstword', name: 'Firstword Puffle', short: 'Firstword', icon: '📖',
    tier: 'creator', rarity: 'god', rarityLabel: 'God', stars: 12, color: '#FFDD88',
    puffleElement: 'Firstword', habitatLabel: 'Library of First Light', habitats: ['genesiscore', 'night'],
    likes: 'Cloud Feast', favoriteToy: 'Plush Star', price: 730, titan: 'Firstword Sovereign',
    style: { primary: '#FFFBE6', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#FFEFC0', iris: '#C9A23C', eyeShadow: '#59400C', leaf: '#FBE7A8', leafGlow: '#FFFDF0', pads: '#FBF0D8' },
    personality: ['📖 Wise', '🤍 Quiet', '✨ True', '🕰️ Old'],
    lore: 'The Firstword Puffle was here before the first name was given, and it has been reading ever since. It answers questions by opening to a page, and the page is always the one you needed, even when you did not know you had asked.',
    stats: { fluffiness: 96, cuddliness: 94, magic: 100, joy: 94, luck: 100 },
    gene: { name: 'Firstword', icon: '📖', desc: 'XP gains +34% and tasks pay +24 coins.', effect: { xp: 1.34, taskCoins: 24 } },
    traits: [
      { name: 'First Letter', icon: '📖', level: 1, bond: 0 },
      { name: 'Naming Breath', icon: '💬', level: 5, bond: 10 },
      { name: 'Story Ward', icon: '🛡️', level: 12, bond: 30 },
      { name: 'Quiet Reading', icon: '🕯️', level: 20, bond: 60 },
    ],
    locked: [
      { name: 'Firstword Halo', icon: '✨', level: 30, bond: 0 },
      { name: 'Library Crown', icon: '👑', level: 45, bond: 90 },
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
  sp_hedgehog: 'hedgehogquill', sp_griffin: 'griffinplume', sp_dragon: 'dragoncrest', sp_basilisk: 'basiliskfrill',
  sp_unicorn: 'unicornhorn', sp_kitsune: 'kitsunefox', sp_phoenix: 'phoenixcrest',
  sp_fenrir: 'fenrirwolf', sp_kirin: 'kirinantler', sp_leviathan: 'leviathanfin',
  sp_seraph: 'seraphhalo', sp_voiddragon: 'voiddragoncrest', sp_eclipse: 'eclipsecrown',
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
  /* The elemental line reuses headpiece motifs that already draw: ten base
     elements, their hybrids, the mythic hybrids and the creator tier. */
  sp_fire: 'flame', sp_water: 'drop', sp_nature: 'leaf', sp_lightning: 'bolt',
  sp_ice: 'ice', sp_air: 'cloud', sp_earth: 'pebble', sp_light: 'sun',
  sp_shadow: 'moon', sp_crystal: 'crystal', sp_plasma: 'bolt', sp_frostwave: 'ice',
  sp_bloomlight: 'petal', sp_voidcrystal: 'crystal', sp_titanroot: 'leaf',
  sp_abyssal: 'wisp', sp_celestialprism: 'rainbow', sp_lifeheart: 'petal',
  sp_omnitype: 'rainbow',
  sp_signal: 'bolt', sp_overdrive: 'crystal', sp_pulse: 'star',
  sp_mossmallow: 'leaf', sp_honeybell: 'petal', sp_glasswing: 'crystal',
  sp_emberquill: 'flame', sp_sunmane: 'sun', sp_starlace: 'star',
  sp_echofrost: 'ice', sp_prismscale: 'rainbow', sp_cometwisp: 'wisp',
  sp_crownquill: 'crown', sp_runebloom: 'pebble', sp_aureate: 'halo',
  sp_nebulace: 'moon', sp_aeonpuff: 'crystal', sp_cosmocrown: 'rainbow',
  sp_godspark: 'crown',
  sp_naptime: 'moon', sp_rattle: 'music', sp_stuffie: 'petal', sp_puppet: 'star',
  sp_kite: 'cloud', sp_marble: 'crystal', sp_musicbox: 'music', sp_lullaby: 'moon',
  sp_thorncrown: 'leaf', sp_gilded: 'crown', sp_obsidian: 'crystal', sp_cometkin: 'star',
  sp_halokin: 'halo', sp_everstar: 'sun', sp_crownforge: 'flame', sp_firstword: 'star',
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
  const voiceType = typeof window.puffleVoiceOf === 'function' ? window.puffleVoiceOf(sprite) : null;
  const relationship = typeof window.relationshipTierFor === 'function' ? window.relationshipTierFor(bond) : null;
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
  /* A creature's looks are its canon coats, not Sprite Puffle styles. Offering
     "Normal" and the classic colours here let the family sheet strip a coat the
     detail card had just applied, so creatures get their own list. */
  const creatureForm = sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  const creature = creatureForm && creatureForm.creature && typeof CP_PUFFLE_CREATURES !== 'undefined'
    ? CP_PUFFLE_CREATURES[creatureForm.creature] : null;
  const speciesKey = creature ? `pc_${creatureForm.creature}` : row.key;
  const savedStyle = creature
    ? (typeof cpCreatureStyleKey === 'function' ? cpCreatureStyleKey(sprite.form, sprite.puffleVariant) : null)
    : ((typeof lumiPuffleStyleOfSprite === 'function' ? lumiPuffleStyleOfSprite(sprite) : sprite.puffleVariant) || row.key);
  const classicKeys = !creature && typeof window !== 'undefined' && Array.isArray(window.LUMI_CLASSIC_PUFFLE_COLOR_KEYS)
    ? window.LUMI_CLASSIC_PUFFLE_COLOR_KEYS
    : [];
  const variants = creature
    ? [speciesKey, ...(typeof cpCreatureCoats === 'function'
        ? cpCreatureCoats(creatureForm.creature).map((coat) => `pc_${creatureForm.creature}_${coat.key}`)
        : [])].map((key) => {
        const look = typeof cpCreatureStylePalette === 'function' ? cpCreatureStylePalette(key) : null;
        return { key, label: (look && look.name) || key };
      })
    : [
        { key: row.key, label: 'Normal' },
        ...classicKeys.map((key) => ({
          key,
          label: (styleTable && styleTable[key] && (styleTable[key].colorLabel || styleTable[key].name.replace(' Puffle', ''))) || key,
        })),
        { key: 'golden_guardian', label: 'Shiny' },
        { key: 'blossom', label: 'Seasonal' },
        { key: 'aurora', label: 'Event' },
      ];
  /* Whatever it actually wears stays selectable and marked, so the sheet never
     previews a look the sprite is not in. */
  const wornStyle = creature ? (sprite.puffleVariant || speciesKey) : savedStyle;
  if (wornStyle && !variants.some((v) => v.key === wornStyle)) {
    variants.push({
      key: wornStyle,
      label: styleTable && styleTable[wornStyle] ? styleTable[wornStyle].name.replace(' Puffle', '') : wornStyle,
    });
  }
  const currentStyle = wornStyle || speciesKey;
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
  return `<div class="card family-card" data-family-card="${row.key}" data-family-default="${esc(speciesKey)}">
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
      <div class="family-chip-row" style="margin-top:6px">
        <span class="chip" style="border-color:var(--accent);font-weight:800" title="How this puffle speaks in chat">${voiceType ? `${voiceType.icon} ${esc(voiceType.name)} voice` : '🗣️ Voice'}</span>
        ${relationship ? `<span class="chip" title="Bond tier">💗 ${esc(relationship.name)}</span>` : ''}
      </div>
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
        <span>Form <b>${esc((typeof puffleFormName === 'function' && puffleFormName(sprite)) || '—')}</b></span>
      </div>
    </div>

    <div class="family-section">
      <div class="family-section-title">FAMILY LADDER</div>
      <div class="family-lineage">${SPRITE_PUFFLE_FAMILY.map((entry) => `<span class="chip family-lineage-chip ${entry.key === row.key ? 'on' : ''}" title="${esc(entry.rarityLabel)}">${entry.icon} ${esc(entry.short)}</span>`).join('')}</div>
    </div>
  </div>`;
}

/* A finished region quest leaves something behind for the family that walked it.
   These are the 19 elemental families' relics: a named find and a line in the
   puffle's own voice, awarded on top of the quest's coins and XP. */
window.SPRITE_PUFFLE_FAMILY_RELICS = {
  sp_fire: { item: 'Ember Shard', line: 'The heat leans toward me. Take this.', coins: 45, bond: 3 },
  sp_water: { item: 'Tide Pearl', line: 'It was humming at the bottom of the pool. It likes you.', coins: 45, bond: 3 },
  sp_nature: { item: 'Seedheart', line: 'Something in the grove handed this to me. I did not ask.', coins: 45, bond: 3 },
  sp_lightning: { item: 'Spark Coil', line: 'I caught it mid-strike. Do not shake it.', coins: 45, bond: 3 },
  sp_ice: { item: 'Frost Facet', line: 'Cold, clear, and worth carrying home.', coins: 45, bond: 3 },
  sp_air: { item: 'Gale Feather', line: 'The wind owed me a favour. This is it.', coins: 45, bond: 3 },
  sp_earth: { item: 'Rootstone', line: 'Heavy. Honest. It knows a lot of old things.', coins: 45, bond: 3 },
  sp_light: { item: 'Dawnmote', line: 'It only glows when you are nearby. Make of that what you will.', coins: 45, bond: 3 },
  sp_shadow: { item: 'Duskglass', line: 'Found in a corner that was not there before.', coins: 45, bond: 3 },
  sp_crystal: { item: 'Prism Chip', line: 'One facet, kept. The rest of the cave can keep its secrets.', coins: 45, bond: 3 },
  sp_plasma: { item: 'Plasma Filament', line: 'It crackles when I hold it. I think it is happy.', coins: 55, bond: 4 },
  sp_frostwave: { item: 'Rime Current', line: 'Cold moving water. The best kind, obviously.', coins: 55, bond: 4 },
  sp_bloomlight: { item: 'Bloomflare', line: 'A flower that decided to be a lantern instead.', coins: 55, bond: 4 },
  sp_voidcrystal: { item: 'Null Facet', line: 'It reflects a room that is not this one. I am keeping it.', coins: 55, bond: 4 },
  sp_titanroot: { item: 'Titan Bark', line: 'Bark from something very old. It is warm.', coins: 55, bond: 4 },
  sp_abyssal: { item: 'Abyss Pearl', line: 'From the bottom of somewhere with no bottom.', coins: 55, bond: 4 },
  sp_celestialprism: { item: 'Star Prism', line: 'A star, folded small. It hums when I walk.', coins: 55, bond: 4 },
  sp_lifeheart: { item: 'Life Seed', line: 'It is beating. Softly. Do not put it in a drawer.', coins: 55, bond: 4 },
  sp_omnitype: { item: 'Allshard', line: 'Every element at once, all arguing politely.', coins: 60, bond: 5 },
  sp_signal: { item: 'Wave Keeper', line: 'It hums when the lamps are on. I hold it up to listen.', coins: 65, bond: 5 },
  sp_overdrive: { item: 'Redline Filament', line: 'Still warm. It has been warm all week.', coins: 65, bond: 5 },
  sp_pulse: { item: 'Heart Amber', line: 'It beats a little. Only when I am holding it.', coins: 65, bond: 5 },
};

/* A family relic by species, not only by the `sp_*` chart key: most species do
   not carry a puffleElement, so the art motif a species already draws with is
   what places it in a family. */
window.puffleRelicFor = function puffleRelicFor(sprite) {
  const table = window.SPRITE_PUFFLE_FAMILY_RELICS;
  if (!sprite || !table) return null;
  if (table[sprite.element]) return table[sprite.element];
  const style = typeof lumiPuffleStyleOfSprite === 'function'
    ? lumiPuffleStyleOfSprite(sprite)
    : sprite.puffleVariant;
  const motif = typeof window.puffleStyleMotifOf === 'function'
    ? window.puffleStyleMotifOf(style, sprite.element)
    : null;
  const byMotif = {
    flame: 'sp_fire', drop: 'sp_water', leaf: 'sp_nature', bolt: 'sp_lightning',
    ice: 'sp_ice', cloud: 'sp_air', pebble: 'sp_earth', sun: 'sp_light',
    wisp: 'sp_shadow', crystal: 'sp_crystal', star: 'sp_celestialprism',
  };
  return (motif && table[byMotif[motif]]) || null;
};

/* Every Sprite Puffle style keeps its own ears and eyes, so two families read
   as different creatures even before colour. `ear` and `eye` name entries in
   EAR_STYLES and EYE_STYLES; sprites.js uses them when the player has not
   picked a face in Studio. */
window.SPRITE_PUFFLE_FACES = {
  sp_signal: { ear: 'antenna', eye: 'glow' },
  sp_overdrive: { ear: 'horn', eye: 'flame' },
  sp_pulse: { ear: 'tuft', eye: 'heart' },
  sp_sprite: { ear: 'tuft', eye: 'sparkle' },
  sp_blossom: { ear: 'petal', eye: 'heart' },
  sp_frost: { ear: 'tall', eye: 'lens' },
  sp_sunbeam: { ear: 'tuft', eye: 'glow' },
  sp_moonmist: { ear: 'curl', eye: 'sleepy' },
  sp_forest: { ear: 'leaf', eye: 'dot' },
  sp_bubble: { ear: 'gill', eye: 'wide' },
  sp_storm: { ear: 'antenna', eye: 'sparkle' },
  sp_dream: { ear: 'floppy', eye: 'sleepy' },
  sp_rainbow: { ear: 'petal', eye: 'galaxy' },
  sp_ancient: { ear: 'deer', eye: 'ring' },
  sp_minimiku: { ear: 'bunny', eye: 'star' },
  sp_squiplash: { ear: 'frill', eye: 'wink' },
  sp_siroscar: { ear: 'horn', eye: 'flame' },
  sp_zee: { ear: 'antenna', eye: 'glow' },
  sp_liluzi: { ear: 'coral', eye: 'heart' },
  sp_aries: { ear: 'horn', eye: 'flame' },
  sp_taurus: { ear: 'deer', eye: 'ring' },
  sp_gemini: { ear: 'bunny', eye: 'sparkle' },
  sp_cancer: { ear: 'coral', eye: 'gleam' },
  sp_leo: { ear: 'tuft', eye: 'glow' },
  sp_virgo: { ear: 'petal', eye: 'dot' },
  sp_libra: { ear: 'wing', eye: 'star' },
  sp_scorpio: { ear: 'bat', eye: 'lens' },
  sp_sagittarius: { ear: 'pointy', eye: 'star' },
  sp_capricorn: { ear: 'goat', eye: 'ring' },
  sp_aquarius: { ear: 'gill', eye: 'galaxy' },
  sp_pisces: { ear: 'fin', eye: 'gleam' },
  sp_hedgehog: { ear: 'spike', eye: 'dot' },
  sp_griffin: { ear: 'wing', eye: 'star' },
  sp_dragon: { ear: 'horn', eye: 'flame' },
  sp_basilisk: { ear: 'frill', eye: 'cat' },
  sp_unicorn: { ear: 'bunny', eye: 'heart' },
  sp_kitsune: { ear: 'pointy', eye: 'flame' },
  sp_phoenix: { ear: 'wing', eye: 'flame' },
  sp_fenrir: { ear: 'bat', eye: 'void' },
  sp_kirin: { ear: 'deer', eye: 'glow' },
  sp_leviathan: { ear: 'fin', eye: 'lens' },
  sp_seraph: { ear: 'wing', eye: 'star' },
  sp_voiddragon: { ear: 'bat', eye: 'void' },
  sp_eclipse: { ear: 'horn', eye: 'half' },
  sp_fire: { ear: 'spike', eye: 'flame' },
  sp_water: { ear: 'fin', eye: 'gleam' },
  sp_nature: { ear: 'leaf', eye: 'wide' },
  sp_lightning: { ear: 'antenna', eye: 'sparkle' },
  sp_ice: { ear: 'tall', eye: 'lens' },
  sp_air: { ear: 'wing', eye: 'sleepy' },
  sp_earth: { ear: 'deer', eye: 'dot' },
  sp_light: { ear: 'tuft', eye: 'star' },
  sp_shadow: { ear: 'bat', eye: 'void' },
  sp_crystal: { ear: 'petal', eye: 'gleam' },
  sp_plasma: { ear: 'antenna', eye: 'flame' },
  sp_frostwave: { ear: 'fin', eye: 'lens' },
  sp_bloomlight: { ear: 'petal', eye: 'glow' },
  sp_voidcrystal: { ear: 'bat', eye: 'galaxy' },
  sp_titanroot: { ear: 'deer', eye: 'ring' },
  sp_abyssal: { ear: 'gill', eye: 'void' },
  sp_celestialprism: { ear: 'wing', eye: 'galaxy' },
  sp_lifeheart: { ear: 'petal', eye: 'heart' },
  sp_omnitype: { ear: 'tuft', eye: 'galaxy' },
  sp_admin: { ear: 'antenna', eye: 'lens' },
  sp_festival: { ear: 'pompom', eye: 'sparkle' },
  sp_retro: { ear: 'floppy', eye: 'pixel' },
  sp_meme: { ear: 'bunny', eye: 'wide' },
  sp_showcase: { ear: 'petal', eye: 'star' },
  sp_mossmallow: { ear: 'leaf', eye: 'dot' },
  sp_honeybell: { ear: 'pompom', eye: 'heart' },
  sp_glasswing: { ear: 'wing', eye: 'gleam' },
  sp_emberquill: { ear: 'spike', eye: 'flame' },
  sp_sunmane: { ear: 'tuft', eye: 'glow' },
  sp_starlace: { ear: 'curl', eye: 'star' },
  sp_echofrost: { ear: 'antenna', eye: 'lens' },
  sp_prismscale: { ear: 'fin', eye: 'galaxy' },
  sp_cometwisp: { ear: 'pointy', eye: 'sparkle' },
  sp_crownquill: { ear: 'horn', eye: 'ring' },
  sp_runebloom: { ear: 'deer', eye: 'cat' },
  sp_aureate: { ear: 'wing', eye: 'glow' },
  sp_nebulace: { ear: 'petal', eye: 'void' },
  sp_aeonpuff: { ear: 'bunny', eye: 'half' },
  sp_cosmocrown: { ear: 'coral', eye: 'galaxy' },
  sp_godspark: { ear: 'deer', eye: 'star' },
  sp_naptime: { ear: 'floppy', eye: 'sleepy' },
  sp_rattle: { ear: 'curl', eye: 'wide' },
  sp_stuffie: { ear: 'floppy', eye: 'dot' },
  sp_puppet: { ear: 'tall', eye: 'wink' },
  sp_kite: { ear: 'wing', eye: 'sparkle' },
  sp_marble: { ear: 'gill', eye: 'gleam' },
  sp_musicbox: { ear: 'curl', eye: 'star' },
  sp_lullaby: { ear: 'floppy', eye: 'sleepy' },
  sp_thorncrown: { ear: 'horn', eye: 'lens' },
  sp_gilded: { ear: 'tall', eye: 'glow' },
  sp_obsidian: { ear: 'spike', eye: 'void' },
  sp_cometkin: { ear: 'antenna', eye: 'galaxy' },
  sp_halokin: { ear: 'wing', eye: 'glow' },
  sp_everstar: { ear: 'tuft', eye: 'ring' },
  sp_crownforge: { ear: 'horn', eye: 'flame' },
  sp_firstword: { ear: 'deer', eye: 'star' },
};

/* Named hybrids for the Sprite Puffle breeds. Each of the five event and arcade
   breeds pairs with a founding breed and with an existing wave, and the six
   founding breeds that had no pair get one with an existing wave too, so every
   member of the family is reachable from the wider breeder codex. */
const SPRITE_PUFFLE_FAMILY_HYBRIDS = {
  /* The six ultra-rare hybrids: two elemental families breed into one named
     hybrid species. Pairs are written in the sorted order `pairKey` uses. */
  'sp_fire+sp_lightning': 'Plasma Puffle',
  'sp_ice+sp_water': 'Frostwave Puffle',
  'sp_light+sp_nature': 'Bloomlight Puffle',
  'sp_crystal+sp_shadow': 'Void Crystal Puffle',
  'sp_earth+sp_nature': 'Titanroot Puffle',
  'sp_air+sp_lightning': 'Storm Puffle',
  'sp_dragon+ember': 'Emberhoard Dragon',
  'sp_unicorn+bloom': 'Prismbloom Unicorn',
  'sp_kitsune+dusk': 'Moonlit Kitsune',
  'sp_phoenix+radiant': 'Sunflare Phoenix',
  'sp_leviathan+tide': 'Deepcrown Leviathan',
  'sp_seraph+angel': 'Halo Seraph',
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

/* Favourite things. Every puffle — family, coat, breed or creature — keeps a
   stable set of comforts: what it eats, drinks, treats itself to, plays with,
   and the corner of the Hollow it calls home. Games also name the real minigame
   they point at, so finishing that minigame is worth extra for the puffle. The picks are hashed from the
   puffle's own look key, so they never change for that puffle, and two coats of
   one species want different things. Foods and drinks come from the real
   pantry, so feeding a favourite is a care choice rather than a label. */
const PUFFLE_TOYS = [
  { name: 'Plush Star', icon: '🧸' },
  { name: 'Moss Yo-yo', icon: '🪀' },
  { name: 'Squish Ball', icon: '🎾' },
  { name: 'Wind Kite', icon: '🪁' },
  { name: 'Pebble Puzzle', icon: '🧩' },
  { name: 'Twig Boomerang', icon: '🪃' },
  { name: 'Balloon Bud', icon: '🎈' },
  { name: 'Spark Wand', icon: '🪄' },
  { name: 'Yarn Tangle', icon: '🧶' },
  { name: 'Pond Frisbee', icon: '🥏' },
  { name: 'Acorn Drum', icon: '🪘' },
  { name: 'Shell Rattle', icon: '🐚' },
];

const PUFFLE_GAMES = [
  { name: 'Bubble Bounce', icon: '🫧', game: 'nectar' },
  { name: 'Leaf Drift', icon: '🍃', game: 'pulse' },
  { name: 'Pebble Stack', icon: '🪨', game: 'match' },
  { name: 'Hide-and-Puff', icon: '🫥', game: 'copycat' },
  { name: 'Hum-Along', icon: '🎵', game: 'copycat' },
  { name: 'Spin-and-Flop', icon: '🌀', game: 'pulse' },
  { name: 'Puddle Hop', icon: '🐾', game: 'catch' },
  { name: 'Bell Chase', icon: '🔔', game: 'catch' },
  { name: 'Cloud Gaze', icon: '☁️', game: 'match' },
  { name: 'Burrow Dive', icon: '🕳️', game: 'dig' },
  { name: 'Snow Roll', icon: '⛄', game: 'pulse' },
  { name: 'Star Counting', icon: '🌟', game: 'match' },
];

/* The little spot inside a biome that belongs to one puffle. */
const PUFFLE_NOOKS = [
  'the mossy stones by the north brook',
  'a hollow under the oldest fern',
  'the warm flat rock above the tidepools',
  'the second shelf of the cloud cupboard',
  'the quiet corner behind the forge',
  'a nest of borrowed scarves',
  'the lantern post at the meadow gate',
  'a snowdrift shaped like a sofa',
  'the echo spot in the crystal cave',
  'the sweet-shop windowsill',
  'the conservatory sunbeam',
  'the tall grass past the savanna fence',
  'a burrow lined with moonberry leaves',
  'the hollow log where the fireflies gather',
];

/* Last resort for a sprite with no family row and no Hollow scene: one
   biome name each, so every entry has the same chance of being picked. */
const PUFFLE_BIOMES = [
  'Meadow', 'Moonlit', 'Tidal', 'Arcade', 'Aurora', 'Cavern',
  'Ember', 'Sugar', 'Dream', 'Reef', 'Savanna',
];

const PUFFLE_FOOD_CATEGORIES = ['produce', 'meal', 'veg', 'meat'];
const PUFFLE_DRINK_CATEGORIES = ['drink'];
const PUFFLE_TREAT_CATEGORIES = ['dessert', 'treat'];

function puffleComfortsHash(text) {
  let hash = 2166136261;
  const value = String(text || 'puffle');
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function puffleFamilyRowFor(sprite) {
  if (!sprite) return null;
  const rows = typeof SPRITE_PUFFLE_FAMILY !== 'undefined' ? SPRITE_PUFFLE_FAMILY : [];
  return rows.find((row) => (sprite.element && (row.key === sprite.element || row.element === sprite.element))
    || (sprite.breed && row.key === sprite.breed)) || null;
}

/* Scenes where this puffle thrives: the family's own homes first, then any
   Hollow scene that lists its element. */
function puffleHomeScenes(sprite, row) {
  if (typeof SCENES === 'undefined') return [];
  const listed = row && Array.isArray(row.habitats) ? row.habitats.filter((key) => SCENES[key]) : [];
  if (listed.length) return listed;
  const element = sprite && sprite.element;
  if (!element) return [];
  return Object.keys(SCENES).filter((key) => (SCENES[key].species || []).includes(element));
}

function pufflePantryIds(categories) {
  return FOOD_KEYS.filter((id) => FOODS[id] && !FOODS[id].rebirth && categories.includes(FOODS[id].cat));
}

function puffleComfortsFor(sprite) {
  if (!sprite || sprite.stage === 'egg') return null;
  const row = puffleFamilyRowFor(sprite);
  /* Look keys are the puffle's identity: a coat or creature form first, then
     the element family, and only then the breed (a generic 'puff' breed would
     otherwise give every family the same favourites). */
  const key = String(sprite.puffleVariant || sprite.form || sprite.element || sprite.breed || 'puffle');
  /* Every field gets its own salt. Without one the twelve toys and twelve games
     would share a hash and land on the same index, so a puffle's toy and game
     would always be the matching pair. */
  const pick = (list, salt) => list[puffleComfortsHash(`${key}#${salt}`) % list.length];
  const foods = pufflePantryIds(PUFFLE_FOOD_CATEGORIES);
  const drinks = pufflePantryIds(PUFFLE_DRINK_CATEGORIES);
  const treats = pufflePantryIds(PUFFLE_TREAT_CATEGORIES);
  if (!foods.length || !drinks.length || !treats.length) return null;
  /* Its dish is the most specific thing that names one: the form, then the
     breed's temperament, then the family's `likes`. isFavoriteFood reads this
     one list, so the sheet and the feeding bonus cannot disagree. */
  const traits = BREED_TRAITS[sprite.breed] || null;
  const form = sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  const named = row && row.likes ? FOOD_KEYS.find((id) => FOODS[id].name === String(row.likes)) : null;
  const foodId = [form && form.favorite, traits && traits.favorite].find((id) => id && FOODS[id])
    || named
    || pick(foods, 'food');
  const scenes = puffleHomeScenes(sprite, row);
  const sceneKey = scenes.length ? scenes[puffleComfortsHash(`${key}#scene`) % scenes.length] : null;
  const namedToy = row && row.favoriteToy
    ? PUFFLE_TOYS.find((toy) => toy.name === row.favoriteToy)
    : null;
  const item = (id) => ({ id, name: FOODS[id].name, icon: FOODS[id].emoji });
  return {
    food: item(foodId),
    drink: item(pick(drinks, 'drink')),
    treat: item(pick(treats, 'treat')),
    /* A family that names a favourite toy always brings that one. */
    toy: namedToy || pick(PUFFLE_TOYS, 'toy'),
    game: pick(PUFFLE_GAMES, 'game'),
    /* The family names its habitat; a scene can supply one; the table is last. */
    biome: (row && row.habitatLabel) || (sceneKey && SCENES[sceneKey] ? SCENES[sceneKey].habitat : pick(PUFFLE_BIOMES, 'biome')),
    scenes: scenes.map((scene) => SCENES[scene].name),
    nook: pick(PUFFLE_NOOKS, 'nook'),
  };
}

/* Fetch and the pet minigames ask the comforts table rather than guessing by
   species: the toy a puffle brings to fetch is its own favourite, and the game
   it likes names the real minigame that pays for it (see PUFFLE_GAMES). */
function puffleFetchToy(sprite) {
  const comforts = puffleComfortsFor(sprite);
  return comforts ? comforts.toy : { name: 'Ball', icon: '🎾' };
}
