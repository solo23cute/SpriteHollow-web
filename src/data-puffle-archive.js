/* Canonical Sprite Puffle rarity archive.

   This is the design roster behind the collection: ten rarity tiers, the
   Baby -> Ascended stage track, and every elemental family. Every form is
   registered as a playable species while existing saves, egg pools, and
   evolution chains stay intact. The six-stage track remains archive metadata;
   species keep their own existing evolution forms. */

const PUFFLE_ARCHIVE_TIER_KEYS = [
  'common', 'uncommon', 'rare', 'epic', 'legendary',
  'mythic', 'secret', 'ancient', 'divine', 'creator',
];

const PUFFLE_ARCHIVE_SIGNATURES = {
  common: 'Seed Puffle',
  uncommon: 'Moss Puffle',
  rare: 'Aqua Puffle',
  epic: 'Storm Puffle',
  legendary: 'Solar Puffle',
  mythic: 'Celestial Puffle',
  secret: 'Rainbow Puffle',
  ancient: 'Ancient Shadow Puffle',
  divine: 'Crystal Emperor Puffle',
  creator: 'Sprite Hollow Origin Puffle',
};

const PUFFLE_ARCHIVE_STAGES = [
  { key: 'baby', name: 'Baby Puffle', icon: '🥚', note: 'First fluff, tiny paws, enormous eyes.' },
  { key: 'teen', name: 'Teen Puffle', icon: '🐣', note: 'Elemental markings appear and the coat fills in.' },
  { key: 'adult', name: 'Adult Puffle', icon: '🌱', note: 'The family silhouette and signature power settle.' },
  { key: 'elite', name: 'Elite Puffle', icon: '✨', note: 'Armour, crowns, and controlled elemental auras.' },
  { key: 'ancient', name: 'Ancient Puffle', icon: '🌌', note: 'Floating relics, runes, and old magic wake up.' },
  { key: 'ascended', name: 'Ascended Puffle', icon: '👑', note: 'The final radiant form, trailing its element behind it.' },
];

/* Kept as source material for future art passes. The archive is code-native, so
   these prompts are reference data rather than generated raster art. */
const PUFFLE_ARCHIVE_PROMPTS = {
  collection: 'Sprite Hollow complete Sprite Puffle collection, Common Moss Puffle, Uncommon Breeze Puffle, Rare Aqua Puffle, Epic Storm Puffle, Legendary Solar Puffle, Mythic Celestial Puffle, Secret Rainbow Puffle, Ancient Shadow Puffle, Divine Crystal Emperor Puffle, Creator Origin Puffle, evolution stages from baby to ascended, cute fluffy magical creatures, large expressive eyes, fantasy RPG monster collection, rarity borders, crowns, gems, stars, elemental powers, vibrant colors, Disney-Pixar inspired style, highly detailed fur, magical particle effects, premium mobile game artwork, collectible creature roster, fantasy world, 4K, highly detailed, no empty space.',
  families: 'Massive Sprite Hollow creature roster featuring Fire, Water, Nature, Electric, Ice, Shadow, Light, Crystal, and Wind Sprite Puffle families. Every family includes Common, Uncommon, Rare, Epic, Legendary, and Mythic evolutions. Cute fluffy magical creatures with large expressive eyes, elemental powers, glowing effects, magical crowns, rarity icons, fantasy RPG creature collection screen, colorful particle effects, highly detailed fur, Disney-Pixar-inspired style, mobile game artwork, legendary phoenix puffles, celestial cosmic puffles, ancient forest puffles, crystal monarch puffles, abyssal shadow puffles, hurricane titan puffles, rainbow and galaxy puffles, professional game splash art, vibrant fantasy world, 4K, highly detailed, no empty space.',
  crystalWind: 'Sprite Hollow Crystal and Wind Sprite Puffle evolution roster, Pebble Crystal Puffle, Quartz Puffle, Crystal Puffle, Diamond Puffle, Gem Emperor Puffle, Crystal Monarch Puffle, Breeze Puffle, Gust Puffle, Zephyr Puffle, Cyclone Puffle, Sky King Puffle, Hurricane Titan Puffle, cute fluffy fantasy creatures, huge expressive eyes, magical crystal armor, floating gemstones, cloud wings, wind currents, rarity tiers, collectible monster game, fantasy RPG artwork, vibrant magical effects, Disney-Pixar-inspired style, highly detailed fur, cinematic lighting, premium mobile game creature collection, 4K, no empty space.',
  ultimate: 'Massive Sprite Hollow universe featuring Fire, Water, Nature, Electric, Ice, Wind, Earth, Poison, Metal, Crystal, Light, Shadow, Rainbow, Celestial, Galaxy, and Origin Sprite Puffle families. Cute fluffy magical creatures with huge expressive eyes, elemental powers, glowing markings, rarity tiers from Common to Mythic, evolution stages Baby, Teen, Adult, Elite, Ancient, Ascended. Phoenix fire puffles, leviathan water puffles, worldtree nature puffles, tempest titan lightning puffles, eternal winter ice puffles, gaia earth puffles, nox poison puffles, celestial forge metal puffles, crystal monarch puffles, cosmic galaxy puffles, and the Origin Creator Puffle. Fantasy RPG creature roster, collectible monster game, magical crowns, rarity icons, vibrant particle effects, highly detailed fur, Disney-Pixar-inspired style, premium mobile game artwork, colorful fantasy world, 4K, highly detailed, no empty space.',
};

/* Six-stage art-direction prompts for every elemental family. The ten families
   supplied in the roster are preserved here; Crystal, Wind, and Special are
   completed from their archive forms so every family has the same track. */
const PUFFLE_ARCHIVE_EVOLUTION_PROMPTS = {
  fire: [
    { name: 'Baby Ember Puffle', prompt: 'Cute baby fire Sprite Puffle, tiny fluffy orange-red body, glowing ember cheeks, oversized sparkling eyes, small flickering flame tail, adorable fantasy creature, soft fur, magical fire particles, mobile game mascot, vibrant colors, Pixar-inspired, highly detailed, no empty space.' },
    { name: 'Teen Flare Puffle', prompt: 'Teen fire Sprite Puffle, fluffy scarlet fur, brighter flame tail, glowing fire markings, confident expression, floating sparks, magical fire aura, fantasy creature collectible, polished mobile game art, highly detailed fur, no empty space.' },
    { name: 'Adult Blaze Puffle', prompt: 'Adult Blaze Sprite Puffle, muscular fluffy fire creature, blazing mane, molten markings, fiery paws, intense glowing eyes, swirling fire vortex effects, fantasy RPG monster, premium game art, highly detailed.' },
    { name: 'Elite Inferno Puffle', prompt: 'Elite Inferno Sprite Puffle, powerful fire guardian, flaming wings, volcanic armor plates, lava cracks glowing beneath fur, epic magical flames, fantasy creature boss design, cinematic lighting, highly detailed.' },
    { name: 'Ancient Phoenix Puffle', prompt: 'Ancient Phoenix Sprite Puffle, majestic fiery bird-like puffle hybrid, golden flames, radiant fire feathers, phoenix crown, rebirth energy, legendary fantasy companion, ultra detailed, magical atmosphere.' },
    { name: 'Ascended Solarflare Puffle', prompt: 'Ascended Solarflare Sprite Puffle, mythical sun-powered creature, celestial fire wings, solar corona aura, gold and crimson fur, floating sun crystals, divine fantasy mascot, legendary RPG artwork, 4K.' },
  ],
  water: [
    { name: 'Baby Splash Puffle', prompt: 'Tiny blue baby Sprite Puffle, water droplet tail, fluffy aquatic fur, oversized eyes, floating bubbles, magical water sparkles, adorable game mascot.' },
    { name: 'Teen Ripple Puffle', prompt: 'Cute water Sprite Puffle, flowing aqua fur, crystal fins, bubble effects, playful fantasy creature, magical river spirit aesthetic.' },
    { name: 'Adult Aqua Puffle', prompt: 'Majestic Aqua Sprite Puffle, glowing ocean markings, crystal water crown, shimmering blue fur, swirling streams around body.' },
    { name: 'Elite Tsunami Puffle', prompt: 'Powerful Tsunami Sprite Puffle, crashing wave aura, water dragon energy, glowing blue eyes, magical aquatic guardian.' },
    { name: 'Ancient Leviathan Puffle', prompt: 'Ancient Leviathan Sprite Puffle, deep sea ruler, glowing abyssal markings, ocean crown, whirlpool magic, legendary creature.' },
    { name: 'Ascended Oceanheart Puffle', prompt: 'Divine Oceanheart Sprite Puffle, celestial ocean spirit, floating water rings, sapphire aura, god-like aquatic magic.' },
  ],
  nature: [
    { name: 'Baby Seed Puffle', prompt: 'Tiny green Sprite Puffle, leaf sprout on head, flower petals, fluffy moss fur, adorable fantasy companion.' },
    { name: 'Teen Moss Puffle', prompt: 'Green fluffy creature with vines and flowers, magical woodland spirit, nature particles.' },
    { name: 'Adult Bloom Puffle', prompt: 'Beautiful Bloom Sprite Puffle, flowers across fur, glowing vines, magical forest aura.' },
    { name: 'Elite Forest Puffle', prompt: 'Forest guardian Sprite Puffle, wooden armor, blooming antlers, glowing nature energy.' },
    { name: 'Ancient Grove Puffle', prompt: 'Ancient forest king Sprite Puffle, giant flower crown, magical roots, powerful druid aesthetic.' },
    { name: 'Ascended Worldtree Puffle', prompt: 'Mythical Worldtree Sprite Puffle, floating islands, sacred branches, glowing life energy, divine nature guardian.' },
  ],
  electric: [
    { name: 'Baby Spark Puffle', prompt: 'Tiny yellow electric puffle, static fur, lightning tail, cute glowing cheeks.' },
    { name: 'Teen Volt Puffle', prompt: 'Bright electric Sprite Puffle, crackling sparks, glowing blue-yellow markings.' },
    { name: 'Adult Shock Puffle', prompt: 'Lightning-charged Sprite Puffle, electric mane, storm cloud particles.' },
    { name: 'Elite Storm Puffle', prompt: 'Powerful Storm Sprite Puffle, thunder aura, lightning wings, glowing eyes.' },
    { name: 'Ancient Thunderlord Puffle', prompt: 'Legendary thunder king Sprite Puffle, storm crown, floating lightning crystals.' },
    { name: 'Ascended Tempest Titan Puffle', prompt: 'Divine electric titan Sprite Puffle, celestial lightning armor, cosmic storm energy.' },
  ],
  ice: [
    { name: 'Baby Snow Puffle', prompt: 'Cute white baby Sprite Puffle, snowflake ears, frosty cheeks.' },
    { name: 'Teen Frost Puffle', prompt: 'Fluffy ice creature, crystal fur accents, glowing snow particles.' },
    { name: 'Adult Glacier Puffle', prompt: 'Crystal ice Sprite Puffle, frozen armor, shimmering blue-white fur.' },
    { name: 'Elite Blizzard Puffle', prompt: 'Blizzard guardian Sprite Puffle, icy wings, frozen mist aura.' },
    { name: 'Ancient Arctic King Puffle', prompt: 'Legendary ice monarch Sprite Puffle, snow crystal crown.' },
    { name: 'Ascended Eternal Winter Puffle', prompt: 'Divine frozen Sprite Puffle, celestial ice magic, aurora effects.' },
  ],
  earth: [
    { name: 'Baby Pebble Puffle', prompt: 'Tiny brown fluffy Sprite Puffle, pebble armor, moss patches, adorable fantasy creature.' },
    { name: 'Teen Terra Puffle', prompt: 'Stone-backed puffle, crystal growths, earth magic glow.' },
    { name: 'Adult Boulder Puffle', prompt: 'Rocky armored Sprite Puffle, emerald crystals, mountain guardian style.' },
    { name: 'Elite Mountain Puffle', prompt: 'Giant earth creature, floating boulders, canyon markings.' },
    { name: 'Ancient Titanearth Puffle', prompt: 'Ancient stone king Sprite Puffle, mountain crown, powerful earth aura.' },
    { name: 'Ascended Gaia Puffle', prompt: 'Divine earth Sprite Puffle, forests and crystals growing on body, floating islands orbiting around.' },
  ],
  poison: [
    { name: 'Baby Spore Puffle', prompt: 'Tiny purple puffle, glowing mushrooms, cute poisonous fantasy creature.' },
    { name: 'Teen Toxin Puffle', prompt: 'Neon green markings, toxic bubbles, mischievous magical appearance.' },
    { name: 'Adult Viper Puffle', prompt: 'Poison crystal spikes, glowing venom patterns, fantasy RPG creature.' },
    { name: 'Elite Plague Puffle', prompt: 'Toxic mist aura, bio-luminescent fur, dark magical poison spirit.' },
    { name: 'Ancient Venomlord Puffle', prompt: 'Poison king Sprite Puffle, toxic crown, bright green energy.' },
    { name: 'Ascended Nox Puffle', prompt: 'Mythical poison deity Sprite Puffle, shadow-poison fusion, radiant green and purple aura.' },
  ],
  metal: [
    { name: 'Baby Iron Puffle', prompt: 'Tiny silver fluffy Sprite Puffle, metallic fur shine, cute mechanical details.' },
    { name: 'Teen Steel Puffle', prompt: 'Armored fluffy creature, glowing gears, polished steel fur.' },
    { name: 'Adult Alloy Puffle', prompt: 'Gold and silver armor plates, magnetic energy effects.' },
    { name: 'Elite Titanium Puffle', prompt: 'Futuristic armored puffle, floating metallic blades, advanced magical technology.' },
    { name: 'Ancient Mecha Puffle', prompt: 'Mechanical legendary Sprite Puffle, energy core chest, robotic wings.' },
    { name: 'Ascended Celestial Forge Puffle', prompt: 'Divine machine spirit, cosmic metal armor, starlight machinery, legendary artifact creator.' },
  ],
  shadow: [
    { name: 'Baby Dusky Puffle', prompt: 'Baby Dusky Sprite Puffle, tiny dark fluffy creature, purple-black fur, glowing red eyes, soft shadow energy, floating runes, cute fantasy mascot, magical lighting, highly detailed, no empty space.' },
    { name: 'Teen Shade Puffle', prompt: 'Teen Shade Sprite Puffle, purple-black spectral fur, brighter red eyes, smoke-like tail, shadow runes, dark magic aura, fantasy creature collectible, highly detailed.' },
    { name: 'Adult Shadow Puffle', prompt: 'Adult Shadow Sprite Puffle, spectral purple-black fur, floating red runes, smoke-like tail, shadow magic, intense glowing eyes, fantasy RPG creature, highly detailed.' },
    { name: 'Elite Nightmare Puffle', prompt: 'Elite Nightmare Sprite Puffle, dream-dark mane, burning red eyes, shadow tendrils, floating runes, dark magic aura, fantasy creature boss design, cinematic lighting.' },
    { name: 'Ancient Void Emperor Puffle', prompt: 'Ancient Void Emperor Sprite Puffle, void crown, gravity shadow, ancient runes, abyssal purple-black fur, legendary shadow guardian, ultra detailed, magical atmosphere.' },
    { name: 'Ascended Abyssal Puffle', prompt: 'Ascended Abyssal Sprite Puffle, abyssal shadow deity, deep-sea pressure aura, radiant purple-black energy, floating runes, legendary RPG artwork, 4K.' },
  ],
  light: [
    { name: 'Baby Glow Puffle', prompt: 'Baby Glow Sprite Puffle, tiny golden-white fluffy creature, soft halo, radiant eyes, gentle light particles, adorable holy mascot, highly detailed, no empty space.' },
    { name: 'Teen Radiant Puffle', prompt: 'Teen Radiant Sprite Puffle, sun-kissed golden-white fur, warm aura, glowing markings, angelic sparkles, fantasy creature collectible, highly detailed.' },
    { name: 'Adult Lumen Puffle', prompt: 'Adult Lumen Sprite Puffle, glowing white-gold markings, prism sparkle, radiant aura, holy light magic, premium fantasy game art, highly detailed.' },
    { name: 'Elite Aurora Puffle', prompt: 'Elite Aurora Sprite Puffle, aurora ribbons, sky-colored wings, radiant halo, celestial light magic, fantasy creature guardian, cinematic lighting.' },
    { name: 'Ancient Seraph Puffle', prompt: 'Ancient Seraph Sprite Puffle, feathered halo, six light wings, golden-white fur, heavenly magic, divine fantasy creature, ultra detailed.' },
    { name: 'Ascended Celestial Puffle', prompt: 'Ascended Celestial Sprite Puffle, galaxy eyes, star wings, constellation trail, white-gold cosmic fur, divine light aura, legendary RPG artwork, 4K.' },
  ],
  crystal: [
    { name: 'Baby Pebble Crystal Puffle', prompt: 'Tiny crystal Sprite Puffle, fluffy white and pale blue fur, small sparkling gemstone on forehead, oversized adorable eyes, tiny floating crystal shards, magical glitter particles, cute fantasy creature companion, Pixar-inspired, highly detailed fur, vibrant colors, no empty space.' },
    { name: 'Teen Quartz Puffle', prompt: 'Teen crystal Sprite Puffle, soft crystal growths on ears and tail, glowing quartz markings, sparkling gemstone fur, magical crystal dust, fantasy RPG creature, collectible monster design, highly detailed.' },
    { name: 'Adult Crystal Puffle', prompt: 'Adult Crystal Sprite Puffle, radiant crystal armor, glowing blue and pink gemstones embedded in fluffy fur, floating crystal fragments orbiting body, magical aura, premium fantasy creature artwork, highly detailed.' },
    { name: 'Elite Diamond Puffle', prompt: 'Elite Diamond Sprite Puffle, brilliant diamond crown, crystalline wings, radiant rainbow reflections, powerful gemstone guardian, sparkling magical energy, epic RPG creature design, cinematic lighting, ultra detailed.' },
    { name: 'Ancient Gem Emperor Puffle', prompt: 'Ancient Gem Emperor Sprite Puffle, majestic crystal monarch, enormous gemstone crown, floating crystal throne shards, glowing royal markings, legendary earth and crystal guardian, fantasy masterpiece, highly detailed.' },
    { name: 'Ascended Crystal Monarch Puffle', prompt: 'Ascended Crystal Monarch Sprite Puffle, divine crystal deity, celestial gemstone wings, floating diamond constellations, radiant rainbow crystal aura, god-like guardian of gemstones, legendary fantasy creature, ultra detailed, 4K.' },
  ],
  wind: [
    { name: 'Baby Breeze Puffle', prompt: 'Tiny wind Sprite Puffle, fluffy sky-blue fur, floating feather ears, oversized sparkling eyes, light breeze effects, adorable fantasy creature, magical air particles, Pixar-inspired mascot, highly detailed.' },
    { name: 'Teen Gust Puffle', prompt: 'Teen wind Sprite Puffle, flowing fur animated by invisible winds, floating feathers, swirling cloud particles, magical sky spirit, fantasy RPG companion, highly detailed.' },
    { name: 'Adult Zephyr Puffle', prompt: 'Adult Zephyr Sprite Puffle, graceful floating creature, glowing wind markings, cloud-like tail, swirling air currents surrounding body, magical wind effects, premium creature artwork.' },
    { name: 'Elite Cyclone Puffle', prompt: 'Elite Cyclone Sprite Puffle, powerful whirlwind guardian, floating above the ground, spinning wind ring aura, storm clouds and glowing air magic, epic fantasy RPG creature.' },
    { name: 'Ancient Sky King Puffle', prompt: 'Ancient Sky King Sprite Puffle, legendary ruler of the skies, majestic feather crown, glowing cloud wings, heavenly wind currents, floating sky crystals, ultra detailed fantasy creature.' },
    { name: 'Ascended Hurricane Titan Puffle', prompt: 'Ascended Hurricane Titan Sprite Puffle, divine storm deity, colossal cloud wings, celestial cyclone aura, lightning and wind fusion magic, floating sky islands orbiting body, god-like fantasy guardian, ultra detailed, 4K.' },
  ],
  special: [
    { name: 'Baby Prism Puffle', prompt: 'Cute baby Prism Sprite Puffle, tiny prism-colored fluffball, first rainbow spark, oversized sparkling eyes, soft spectrum particles, adorable fantasy mascot, highly detailed, no empty space.' },
    { name: 'Teen Rainbow Puffle', prompt: 'Teen Rainbow Sprite Puffle, dynamic color-shifting fur, rainbow particle explosions, bright playful eyes, spectrum magic, fantasy creature collectible, polished game art.' },
    { name: 'Adult Galaxy Puffle', prompt: 'Adult Galaxy Sprite Puffle, cosmic fur, orbiting stars, galaxy eyes, constellation trail, deep-space aura, premium fantasy game artwork, highly detailed.' },
    { name: 'Elite Prism Ascendant Puffle', prompt: 'Elite Prism Ascendant Sprite Puffle, prism wings, spectrum crown, radiant rainbow armor, floating light crystals, fantasy creature guardian, cinematic lighting.' },
    { name: 'Ancient Origin Puffle', prompt: 'Ancient Origin Sprite Puffle, all elements swirling together, rainbow galaxy fur, origin runes, massive magical aura, legendary creator guardian, ultra detailed.' },
    { name: 'Ascended Sprite Hollow Origin Puffle', prompt: 'Ascended Sprite Hollow Origin Puffle, embodies all elements, rainbow galaxy fur, massive magical aura, divine creator mascot, nature fire water storm ice shadow light and crystal combined, legendary RPG artwork, 4K.' },
  ],
};

const PUFFLE_ARCHIVE_EVOLUTION_PROMPT_COUNT = Object.values(PUFFLE_ARCHIVE_EVOLUTION_PROMPTS)
  .reduce((sum, list) => sum + list.length, 0);

const PUFFLE_ARCHIVE_TIER_FALLBACK = {
  common: { name: 'Common', icon: '◇', stars: 1, color: '#B9C6D4', blurb: 'Small beginner Puffle with a simple elemental feature.' },
  uncommon: { name: 'Uncommon', icon: '◆', stars: 2, color: '#46C46E', blurb: 'A more developed elemental look with a little extra magic.' },
  rare: { name: 'Rare', icon: '💎', stars: 3, color: '#4C8DFF', blurb: 'Crystal formations, elemental armour, and floating effects.' },
  epic: { name: 'Epic', icon: '👑', stars: 4, color: '#A46BFF', blurb: 'Large transformations and stacked magical effects.' },
  legendary: { name: 'Legendary', icon: '⭐', stars: 5, color: '#FFC94D', blurb: 'Massive wings, crowns, and advanced particle work.' },
  mythic: { name: 'Mythic', icon: '✨', stars: 6, color: '#FF6FA8', blurb: 'Celestial beings with reality-altering elemental power.' },
  secret: { name: 'Secret', icon: '🌈', stars: 7, color: '#8FE3FF', blurb: 'Hidden creatures that rarely appear at all.' },
  ancient: { name: 'Ancient', icon: '🌑', stars: 8, color: '#6B5C9B', blurb: 'Old-world forms carrying runes, relics, and deep elemental memory.' },
  divine: { name: 'Divine', icon: '💠', stars: 9, color: '#FFE08A', blurb: 'Sacred armour and halo-light reserved for the hollow’s guardians.' },
  creator: { name: 'Creator', icon: '🌠', stars: 10, color: '#F4F1FF', blurb: 'Origin-tier beings that hold every element at once.' },
};

/* [name, tier, visual signature, signature power] */
const PUFFLE_ARCHIVE_FAMILIES = [
  {
    key: 'fire', label: 'Fire', icon: '🔥', role: 'Bruiser',
    colors: ['#FF6B35', '#FFB347', '#FFD166', '#C73E1D'],
    power: 'Burn damage, phoenix rebirth, and solar heat.',
    members: [
      ['Cinder Puffle', 'common', 'Ember whiskers and a soot-soft coat.', 'Spark sneeze'],
      ['Flare Puffle', 'uncommon', 'Flame-tipped ears and warm pawprints.', 'Kindle step'],
      ['Blaze Puffle', 'rare', 'A controlled fire mane and ash flowers.', 'Cinder trail'],
      ['Inferno Puffle', 'epic', 'Molten core with floating cinders.', 'Eruption'],
      ['Phoenix Puffle', 'legendary', 'Feathered fire wings and a rebirth flame.', 'Rebirth'],
      ['Solarflare Puffle', 'mythic', 'A miniature sun wrapped in fluff.', 'Solar wind'],
    ],
  },
  {
    key: 'water', label: 'Water', icon: '💧', role: 'Support',
    colors: ['#3FA6D9', '#A8DFF5', '#9FFFF0', '#0F5F8A'],
    power: 'Healing tides, wave attacks, and floating barriers.',
    members: [
      ['Splash Puffle', 'common', 'Puddle paws and a bubble trail.', 'Puddle hop'],
      ['Ripple Puffle', 'uncommon', 'Wave-crest ears that ring when happy.', 'Ripple ring'],
      ['Aqua Puffle', 'rare', 'Crystal-blue fur, water-drop tail, glowing aquatic marks.', 'Healing spring'],
      ['Tsunami Puffle', 'epic', 'Tidal mane and a crashing wave aura.', 'Tidal crash'],
      ['Leviathan Puffle', 'legendary', 'Deep-sea crown and a coiled water tail.', 'Abyss current'],
      ['Oceanheart Puffle', 'mythic', 'Heart of the ocean with a floating reef halo.', 'Ocean pulse'],
    ],
  },
  {
    key: 'nature', label: 'Nature', icon: '🌿', role: 'Healer',
    colors: ['#5FC24B', '#9BE07A', '#E2FFC6', '#17501F'],
    power: 'Healing vines, regeneration, and living shields.',
    members: [
      ['Seed Puffle', 'common', 'A tiny leaf sprout and a seed pouch.', 'Seed burst'],
      ['Moss Puffle', 'uncommon', 'Moss patches and deep green fluff.', 'Moss cushion'],
      ['Bloom Puffle', 'rare', 'Flower crown and a petal trail.', 'Petal bloom'],
      ['Forest Puffle', 'epic', 'Mushroom grove fur and root armor.', 'Root snare'],
      ['Ancient Grove Puffle', 'legendary', 'Bark plates and a halo of floating leaves.', 'Grove ward'],
      ['Worldtree Puffle', 'mythic', 'A miniature world tree with orbiting islands.', 'Worldroot'],
    ],
  },
  {
    key: 'electric', label: 'Electric', icon: '⚡', role: 'Assassin',
    colors: ['#FFE05C', '#FFF3A8', '#5E7CE2', '#6B4A00'],
    power: 'Chain lightning, speed bursts, and critical strikes.',
    members: [
      ['Spark Puffle', 'common', 'Static tufts and tiny sparks.', 'Static pop'],
      ['Volt Puffle', 'uncommon', 'Charged ears and lightning freckles.', 'Volt step'],
      ['Shock Puffle', 'rare', 'Electric horn tufts and a crackle aura.', 'Chain spark'],
      ['Storm Puffle', 'epic', 'Storm-cloud mane and a thunder purr.', 'Thundercloud'],
      ['Thunderlord Puffle', 'legendary', 'A thunder crown and a bolt-shaped tail.', 'Thunder reign'],
      ['Tempest Titan Puffle', 'mythic', 'A hurricane core and storm wings.', 'Tempest eye'],
    ],
  },
  {
    key: 'ice', label: 'Ice', icon: '❄️', role: 'Controller',
    colors: ['#A9E4FF', '#E8FAFF', '#5FD8FF', '#1F6E9B'],
    power: 'Freeze effects, slowing fields, and crystal armour.',
    members: [
      ['Snow Puffle', 'common', 'Snowflake freckles and a cold nose.', 'Snow puff'],
      ['Frost Puffle', 'uncommon', 'Rime tips and frost prints.', 'Frost step'],
      ['Glacier Puffle', 'rare', 'Ice plates and a slow, steady aura.', 'Glacier wall'],
      ['Blizzard Puffle', 'epic', 'Snowstorm mane and whiteout wings.', 'Whiteout'],
      ['Arctic King Puffle', 'legendary', 'An ice crown and an aurora cape.', 'Arctic decree'],
      ['Eternal Winter Puffle', 'mythic', 'A frozen constellation and endless snowfall.', 'Everwinter'],
    ],
  },
  {
    key: 'shadow', label: 'Shadow', icon: '🌑', role: 'Assassin',
    colors: ['#2A2438', '#5C4C7A', '#FF006A', '#1B0F33'],
    power: 'Stealth, lifesteal, curses, and shadow travel.',
    members: [
      ['Dusky Puffle', 'common', 'Dusk-dark fur and a shy second shadow.', 'Dusk veil'],
      ['Shade Puffle', 'uncommon', 'Smoke-like tail that dims nearby lamps.', 'Shade slip'],
      ['Shadow Puffle', 'rare', 'Spectral fur with floating red runes.', 'Shadow bind'],
      ['Nightmare Puffle', 'epic', 'Dream-dark mane and burning red eyes.', 'Night terror'],
      ['Void Emperor Puffle', 'legendary', 'A void crown and a gravity shadow.', 'Void decree'],
      ['Abyssal Puffle', 'mythic', 'Abyss fur with deep-sea pressure.', 'Abyss fall'],
      ['Ancient Shadow Puffle', 'ancient', 'Ancient shadow form with a rune halo and a smoke tail.', 'Ancient shadow bind'],
    ],
  },
  {
    key: 'light', label: 'Light', icon: '☀️', role: 'Healer',
    colors: ['#FFD65C', '#FFF0B0', '#FFB800', '#8A5A00'],
    power: 'Purification, radiant shields, and holy damage.',
    members: [
      ['Glow Puffle', 'common', 'A soft halo and nightlight fur.', 'Soft glow'],
      ['Radiant Puffle', 'uncommon', 'Sun-kissed tufts and a warm aura.', 'Radiant pulse'],
      ['Lumen Puffle', 'rare', 'Glowing markings and prism sparkle.', 'Lumen beam'],
      ['Aurora Puffle', 'epic', 'Aurora ribbons and sky-colored wings.', 'Aurora veil'],
      ['Seraph Puffle', 'legendary', 'A feathered halo and six light wings.', 'Seraph song'],
      ['Celestial Puffle', 'mythic', 'Galaxy eyes, star wings, and a constellation trail.', 'Starfall'],
    ],
  },
  {
    key: 'crystal', label: 'Crystal', icon: '💎', role: 'Tank',
    colors: ['#8FE9FF', '#E6FFFF', '#7FB8FF', '#2E5C8C'],
    power: 'Prism beams, reflection shields, and crystal barriers.',
    members: [
      ['Pebble Crystal Puffle', 'common', 'Crystal-veined pebble plates over soft fluff.', 'Stone chime'],
      ['Quartz Puffle', 'uncommon', 'Quartz ears that chime with every step.', 'Quartz ring'],
      ['Crystal Puffle', 'rare', 'Crystal leaves and a rainbow caught inside.', 'Prism hide'],
      ['Diamond Puffle', 'epic', 'Faceted armor and prism beams.', 'Diamond guard'],
      ['Gem Emperor Puffle', 'legendary', 'Gem crown and floating shards.', 'Gem decree'],
      ['Crystal Monarch Puffle', 'mythic', 'A living crystal court and refracted wings.', 'Monarch facet'],
      ['Crystal Emperor Puffle', 'divine', 'Diamond armor, a floating gemstone crown, and radiant crystal wings.', 'Ultimate facet'],
    ],
  },
  {
    key: 'wind', label: 'Wind', icon: '🌪️', role: 'Assassin',
    colors: ['#CFEAFF', '#F4FBFF', '#5FA8D8', '#2A5C82'],
    power: 'Evasion, tornado attacks, and speed buffs.',
    members: [
      ['Breeze Puffle', 'common', 'Mint-green fur and floating feather ears.', 'Wind swirl'],
      ['Gust Puffle', 'uncommon', 'Puff cheeks and rings of moving air.', 'Gust ring'],
      ['Zephyr Puffle', 'rare', 'A ribbon tail and a soft gale.', 'Zephyr step'],
      ['Cyclone Puffle', 'epic', 'Spiral mane and orbiting debris.', 'Cyclone spin'],
      ['Sky King Puffle', 'legendary', 'Cloud crown and open-sky wings.', 'Sky decree'],
      ['Hurricane Titan Puffle', 'mythic', 'A storm eye and a spinning halo.', 'Hurricane eye'],
    ],
  },
  {
    key: 'earth', label: 'Earth', icon: '🪨', role: 'Tank',
    colors: ['#B9AFA2', '#E4DCD2', '#7A6A58', '#4A3B2E'],
    power: 'Stone armour, taunts, tremors, and seismic attacks.',
    members: [
      ['Pebble Puffle', 'common', 'Moss-backed rock plates over warm earth-brown fluff.', 'Pebble roll'],
      ['Terra Puffle', 'uncommon', 'Crystal-studded ears and small stone armor.', 'Dig'],
      ['Boulder Puffle', 'rare', 'Large rock plates, emerald crystals, and tremor steps.', 'Tremor'],
      ['Mountain Puffle', 'epic', 'Glowing canyon markings and floating earth shards.', 'Mountain guard'],
      ['Titanearth Puffle', 'legendary', 'Ancient stone crown and a living-mountain body.', 'Earthquake'],
      ['Gaia Puffle', 'mythic', 'Forests and crystals with floating islands in orbit.', 'Gaia ward'],
    ],
  },
  {
    key: 'poison', label: 'Poison', icon: '☠️', role: 'Controller',
    colors: ['#8A2BE2', '#ADFF2F', '#7FFF00', '#4B0082'],
    power: 'Toxic clouds, spores, corrosive strikes, and decay.',
    members: [
      ['Spore Puffle', 'common', 'Purple fuzz, tiny mushrooms, and drifting pollen.', 'Spore cloud'],
      ['Toxin Puffle', 'uncommon', 'Neon-green markings and venom droplets.', 'Toxic drip'],
      ['Viper Puffle', 'rare', 'Poison crystal spikes and bright glowing eyes.', 'Corrosive strike'],
      ['Plague Puffle', 'epic', 'Floating toxic mist and bioluminescent fur.', 'Plague mist'],
      ['Venomlord Puffle', 'legendary', 'Toxic crystal crown and a poison-dragon aura.', 'Venom reign'],
      ['Nox Puffle', 'mythic', 'Shadow-poison fusion with green-purple energy.', 'Decay and rebirth'],
    ],
  },
  {
    key: 'metal', label: 'Metal', icon: '⚙️', role: 'Tank',
    colors: ['#C0C0C0', '#E5E4E2', '#5DADEC', '#4A4A55'],
    power: 'Armour, magnets, energy cores, and relic forging.',
    members: [
      ['Iron Puffle', 'common', 'Silver fluff with tiny metal plates.', 'Iron hide'],
      ['Steel Puffle', 'uncommon', 'Reinforced armor ears and gear markings.', 'Steel guard'],
      ['Alloy Puffle', 'rare', 'Gold-silver highlights and a mechanical tail.', 'Magnetic pull'],
      ['Titanium Puffle', 'epic', 'Futuristic armor and floating metal blades.', 'Blade orbit'],
      ['Mecha Puffle', 'legendary', 'Mechanical wings and an energy-core chest.', 'Core burst'],
      ['Celestial Forge Puffle', 'mythic', 'Cosmic metal armor and living starlight machinery.', 'Forge star'],
    ],
  },
  {
    key: 'special', label: 'Special', icon: '🌈', role: 'Mage',
    colors: ['#B18CFF', '#FFD1F0', '#8CFFF2', '#4A2A7A'],
    power: 'Spectrum magic, cosmic travel, and origin-tier creation.',
    members: [
      ['Prism Puffle', 'legendary', 'Prism-colored fur that splits light.', 'Spectrum split'],
      ['Rainbow Puffle', 'secret', 'Dynamic color-shifting fur and rainbow explosions.', 'Rainbow burst'],
      ['Galaxy Puffle', 'secret', 'Cosmic fur with orbiting stars.', 'Galaxy pull'],
      ['Sprite Hollow Origin Puffle', 'creator', 'All elements, rainbow galaxy fur, and a massive magical aura.', 'Origin light'],
    ],
  },
].map((family) => ({
  ...family,
  members: family.members.map(([name, tier, look, power]) => ({ name, tier, look, power })),
}));

const PUFFLE_ARCHIVE_TIERS = PUFFLE_ARCHIVE_TIER_KEYS.map((key) => {
  const live = typeof window !== 'undefined' && window.PUFFLE_RARITY_BY_KEY
    ? window.PUFFLE_RARITY_BY_KEY[key]
    : null;
  const tier = live || PUFFLE_ARCHIVE_TIER_FALLBACK[key];
  return { ...tier, key, example: PUFFLE_ARCHIVE_SIGNATURES[key] };
});

PUFFLE_ARCHIVE_TIERS.forEach((tier) => {
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[tier.key] : null;
  if (!style) return;
  tier.color = style.color;
  tier.gradient = style.gradient;
  tier.glow = style.glow;
  tier.eggName = style.eggName;
});

const PUFFLE_ARCHIVE_TIER_BY_KEY = PUFFLE_ARCHIVE_TIERS.reduce((map, tier) => {
  map[tier.key] = tier;
  return map;
}, {});

const PUFFLE_ARCHIVE_TOTAL = PUFFLE_ARCHIVE_FAMILIES.reduce((sum, family) => sum + family.members.length, 0);

const PUFFLE_ARCHIVE_ELEMENTS = [
  { key: 'fire', label: 'Fire', icon: '🔥', family: 'fire' },
  { key: 'water', label: 'Water', icon: '💧', family: 'water' },
  { key: 'nature', label: 'Nature', icon: '🌿', family: 'nature' },
  { key: 'electric', label: 'Electric', icon: '⚡', family: 'electric' },
  { key: 'ice', label: 'Ice', icon: '❄️', family: 'ice' },
  { key: 'wind', label: 'Wind', icon: '🌪️', family: 'wind' },
  { key: 'earth', label: 'Earth', icon: '🪨', family: 'earth' },
  { key: 'poison', label: 'Poison', icon: '☠️', family: 'poison' },
  { key: 'metal', label: 'Metal', icon: '⚙️', family: 'metal' },
  { key: 'crystal', label: 'Crystal', icon: '💎', family: 'crystal' },
  { key: 'light', label: 'Light', icon: '☀️', family: 'light' },
  { key: 'shadow', label: 'Shadow', icon: '🌑', family: 'shadow' },
  { key: 'rainbow', label: 'Rainbow', icon: '🌈', family: 'special' },
  { key: 'celestial', label: 'Celestial', icon: '✨', family: 'light' },
  { key: 'galaxy', label: 'Galaxy', icon: '🌌', family: 'special' },
  { key: 'origin', label: 'Origin / Creator', icon: '🌠', family: 'special' },
].map((element) => {
  const family = PUFFLE_ARCHIVE_FAMILIES.find((entry) => entry.key === element.family);
  return { ...element, color: family ? family.colors[0] : '#B9C6D4' };
});

function puffleArchiveEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function puffleArchiveTierFor(key) {
  return PUFFLE_ARCHIVE_TIER_BY_KEY[key] || PUFFLE_ARCHIVE_TIER_FALLBACK.common;
}

function puffleArchiveOwnedSet() {
  const sprites = typeof state !== 'undefined' && state && Array.isArray(state.sprites) ? state.sprites : [];
  return new Set(sprites.map((sprite) => sprite && sprite.element).filter(Boolean));
}

function puffleArchiveFamilyProgress(family, owned = puffleArchiveOwnedSet()) {
  const members = Array.isArray(family && family.members) ? family.members : [];
  const have = members.filter((member) => member.key && owned.has(member.key)).length;
  return { owned: have, total: members.length, complete: members.length > 0 && have === members.length };
}

function puffleArchiveTierProgress(owned = puffleArchiveOwnedSet()) {
  const progress = new Map();
  PUFFLE_ARCHIVE_FAMILIES.forEach((family) => {
    family.members.forEach((member) => {
      const row = progress.get(member.tier) || { owned: 0, total: 0 };
      row.total += 1;
      if (member.key && owned.has(member.key)) row.owned += 1;
      progress.set(member.tier, row);
    });
  });
  return progress;
}

function puffleArchiveHTML() {
  if (!PUFFLE_ARCHIVE_FAMILIES.length) return '';
  const tierChip = (key) => {
    const tier = puffleArchiveTierFor(key);
    return `<span class="puffle-archive-tier-chip" style="border-color:${tier.color};color:${tier.color}" title="${puffleArchiveEsc(tier.name)} · ${puffleArchiveEsc(tier.blurb)}">${tier.icon} ${puffleArchiveEsc(tier.name)}</span>`;
  };
  const stageStrip = PUFFLE_ARCHIVE_STAGES.map((stage, index) => `<span class="puffle-archive-stage" title="${puffleArchiveEsc(stage.note)}"><b>${stage.icon} ${puffleArchiveEsc(stage.name)}</b><span>${puffleArchiveEsc(stage.note)}</span></span>${index < PUFFLE_ARCHIVE_STAGES.length - 1 ? '<i class="puffle-archive-arrow" aria-hidden="true">→</i>' : ''}`).join('');
  const owned = puffleArchiveOwnedSet();
  const tierProgress = puffleArchiveTierProgress(owned);
  const tierCards = PUFFLE_ARCHIVE_TIERS.map((tier) => {
    const progress = tierProgress.get(tier.key) || { owned: 0, total: 0 };
    return `<div class="puffle-archive-tier-card" style="--tier:${tier.color}">
    <div class="between" style="gap:6px"><b>${tier.icon} ${puffleArchiveEsc(tier.name)}</b><span class="tiny muted">${'★'.repeat(Math.min(10, tier.stars || 1))}</span></div>
    <p>${puffleArchiveEsc(tier.blurb)}</p>
    <span class="tiny muted" data-puffle-tier-progress="${tier.key}">${progress.owned}/${progress.total} owned</span>
    <span class="tiny muted">Signature: ${puffleArchiveEsc(tier.example)}</span>
  </div>`;
  }).join('');
  const families = PUFFLE_ARCHIVE_FAMILIES.map((family, index) => {
    const top = puffleArchiveTierFor(family.members[family.members.length - 1].tier);
    const progress = puffleArchiveFamilyProgress(family, owned);
    const evolution = PUFFLE_ARCHIVE_EVOLUTION_PROMPTS[family.key] || [];
    const promptCards = evolution.map((entry, promptIndex) => {
      const stage = PUFFLE_ARCHIVE_STAGES[promptIndex] || {};
      return `<article class="puffle-archive-prompt">
        <div class="between" style="gap:6px;align-items:flex-start"><b>${stage.icon || '✦'} ${puffleArchiveEsc(entry.name)}</b><span class="puffle-archive-prompt-stage">${puffleArchiveEsc((stage.name || 'Stage').replace(' Puffle', ''))}</span></div>
        <p>${puffleArchiveEsc(entry.prompt)}</p>
      </article>`;
    }).join('');
    const members = family.members.map((member, memberIndex) => {
      const tier = puffleArchiveTierFor(member.tier);
      return `<article class="puffle-archive-member" data-puffle-member="${puffleArchiveEsc(member.name)}" data-puffle-member-index="${memberIndex}" style="--member:${tier.color}">
        <div class="between" style="gap:6px;align-items:flex-start"><b>${puffleArchiveEsc(member.name)}</b>${tierChip(member.tier)}</div>
        <p>${puffleArchiveEsc(member.look)}</p>
        <span class="tiny muted">✦ ${puffleArchiveEsc(member.power)}</span>
      </article>`;
    }).join('');
    return `<details class="puffle-archive-family${progress.complete ? ' is-complete' : ''}"${index === 0 ? ' open' : ''} data-puffle-family-row="${family.key}" data-complete="${progress.complete ? '1' : '0'}">
      <summary>
        <span class="puffle-archive-family-name">${family.icon} ${puffleArchiveEsc(family.label)} <span class="puffle-archive-family-meta">${family.members.length} forms · ${puffleArchiveEsc(family.role)}</span></span>
        <span class="puffle-archive-family-right">
          <span class="puffle-archive-family-count" data-puffle-family-count="${family.key}" title="${family.members.length} forms">${family.members.length} forms</span>
          <span class="puffle-archive-family-progress" data-puffle-family-progress="${family.key}" title="${progress.owned} of ${progress.total} owned">${progress.owned}/${progress.total} owned</span>
          <span class="puffle-archive-tier-chip" style="border-color:${top.color};color:${top.color}">${top.icon} ${puffleArchiveEsc(top.name)}</span>
        </span>
        <span class="puffle-archive-family-match" data-puffle-family-match="${family.key}" hidden></span>
      </summary>
      <p class="tiny muted" style="margin:7px 0 0;line-height:1.5">${puffleArchiveEsc(family.power)}</p>
      <div class="puffle-archive-members">${members}</div>
      ${promptCards ? `<details class="puffle-archive-prompt-block"><summary>✨ Evolution prompts <span>${evolution.length} stages</span></summary><div class="puffle-archive-prompt-grid">${promptCards}</div></details>` : ''}
    </details>`;
  }).join('');
  return `<div class="section-title" data-puffle-archive><h2>Puffle rarity archive</h2><span>${PUFFLE_ARCHIVE_TIERS.length} tiers · ${PUFFLE_ARCHIVE_FAMILIES.length} families · ${PUFFLE_ARCHIVE_TOTAL} forms · ${PUFFLE_ARCHIVE_EVOLUTION_PROMPT_COUNT} stage prompts</span></div>
    <div class="card puffle-archive">
      <div class="between" style="align-items:flex-start;gap:8px;flex-wrap:wrap">
        <div><div class="eyebrow">CANON ROSTER</div><b style="font-size:13px">Every tier, element, and evolution stage in one place.</b></div>
        <div class="row" style="gap:5px;flex-wrap:wrap;justify-content:flex-end">
          <button class="chip puffle-archive-missing-toggle" type="button" data-puffle-archive-missing aria-pressed="false">Missing only</button>
          <span class="chip">🌠 ${PUFFLE_ARCHIVE_TOTAL} forms</span>
        </div>
      </div>
      <input class="type-search puffle-archive-search" type="search" data-puffle-archive-search placeholder="Search families or forms…" aria-label="Search Puffle families and forms" autocomplete="off">
      <div class="type-filter-row puffle-archive-filters">
        <div class="type-filter-group puffle-archive-show">
          <span class="type-filter-label" aria-hidden="true">Show</span>
          <div class="type-owned" role="group" aria-label="Filter Puffle forms by ownership">
            <button class="chip type-owned-btn on" type="button" data-puffle-show="all">All</button>
            <button class="chip type-owned-btn" type="button" data-puffle-show="owned">Owned</button>
            <button class="chip type-owned-btn" type="button" data-puffle-show="missing">Missing</button>
          </div>
        </div>
        <div class="type-filter-group puffle-archive-rank">
          <span class="type-filter-label" aria-hidden="true">Rank</span>
          <div class="type-rarities type-rarities-wrap" role="group" aria-label="Filter Puffle forms by rank">
            <button class="chip type-rarity on" type="button" data-puffle-rank="all">All</button>
            ${PUFFLE_ARCHIVE_TIERS.map((tier) => `<button class="chip type-rarity" type="button" data-puffle-rank="${tier.key}" title="${puffleArchiveEsc(tier.name)}"><span class="te-dot" style="background:${tier.color}"></span><span class="tr-name">${puffleArchiveEsc(tier.name)}</span></button>`).join('')}
          </div>
        </div>
      </div>
      <p class="tiny muted" style="margin:8px 0 10px;line-height:1.5">The full Sprite Puffle design canon: ten rarity tiers, thirteen elemental families, and the Baby → Ascended stage track. All ${PUFFLE_ARCHIVE_TOTAL} archive forms are registered as playable species, and every family panel includes its six-stage art prompt track.</p>
      <div class="puffle-archive-stages">${stageStrip}</div>
      <div class="puffle-archive-tier-grid">${tierCards}</div>
      <div class="puffle-archive-elements">${PUFFLE_ARCHIVE_ELEMENTS.map((element) => `<span class="puffle-archive-element" style="--element:${element.color}" title="${puffleArchiveEsc(element.label)} · ${puffleArchiveEsc(element.family)} family"><i aria-hidden="true">${element.icon}</i> ${puffleArchiveEsc(element.label)}</span>`).join('')}</div>
      <div class="section-title" style="margin-top:15px"><h3 style="margin:0">Elemental families</h3><span>tap to open</span></div>
      ${families}
      <p class="tiny muted puffle-archive-empty" data-puffle-archive-empty hidden>No family or form matches that search.</p>
      <p class="tiny muted puffle-archive-note">Every roster form is registered as a playable species. Existing names reuse their current species key, while the second Pebble morph gets its own key so both families stay intact. Open a family, then open “Evolution prompts” to copy its six-stage art direction.</p>
    </div>`;
}

/* Playable species registration. Every archive form becomes a real ELEMENT.
   Existing names reuse their current key; the second Pebble morph gets its own
   key and display name so the Crystal and Earth families stay distinct. */
const PUFFLE_ARCHIVE_PLAYABLE_META = {
  fire: { battle: 'fire', element: 'Fire', habitats: ['ember', 'grove'], likes: 'Ember Steak', greeting: 'I am warm. Come be warm too.', motif: 'flame', gene: { name: 'Ember Heart', icon: '🔥', desc: 'Games pay +3 coins and pets build +10% bond.', effect: { gameCoins: 3, petBond: 1.1 } } },
  water: { battle: 'water', element: 'Water', habitats: ['shore', 'rainpool'], likes: 'Kelp Crisps', greeting: 'Every tide comes back. So do I.', motif: 'wave', gene: { name: 'Tide Memory', icon: '💧', desc: 'Exploration restores +4 stamina and pets build +10% bond.', effect: { exploreStamina: 4, petBond: 1.1 } } },
  nature: { battle: 'nature', element: 'Nature', habitats: ['grove', 'meadow'], likes: 'Berry Mash', greeting: 'Something is always growing here.', motif: 'leaf', gene: { name: 'Green Thumb', icon: '🌿', desc: 'Exploration restores +4 stamina and petting builds +14% bond.', effect: { exploreStamina: 4, petBond: 1.14 } } },
  electric: { battle: 'electric', element: 'Electric', habitats: ['storm', 'grove'], likes: 'Volt Fruit', greeting: 'Touch my tuft. I dare you.', motif: 'spark', gene: { name: 'Live Wire', icon: '⚡', desc: 'Games pay +6 coins and pets bond 10% faster.', effect: { gameCoins: 6, petBond: 1.1 } } },
  ice: { battle: 'ice', element: 'Ice', habitats: ['glacier', 'tundra'], likes: 'Frost Berry', greeting: 'You are late. The ice kept your place.', motif: 'snow', gene: { name: 'Cold Snap', icon: '❄️', desc: 'Games pay +4 coins and pets build +10% bond.', effect: { gameCoins: 4, petBond: 1.1 } } },
  wind: { battle: 'wind', element: 'Wind', habitats: ['meadow', 'cliff'], likes: 'Feather Fluff', greeting: 'Catch me if the wind lets you.', motif: 'swirl', gene: { name: 'Tailwind', icon: '🌪️', desc: 'Exploration restores +5 stamina and pets build +10% bond.', effect: { exploreStamina: 5, petBond: 1.1 } } },
  earth: { battle: 'earth', element: 'Earth', habitats: ['cave', 'grove'], likes: 'Root Crunch', greeting: 'The ground remembers every step.', motif: 'crystal', gene: { name: 'Bedrock', icon: '🪨', desc: 'Games pay +4 coins and petting builds +14% bond.', effect: { gameCoins: 4, petBond: 1.14 } } },
  poison: { battle: 'poison', element: 'Poison', habitats: ['swamp', 'cave'], likes: 'Spore Cake', greeting: 'Do not worry. The green glow is friendly.', motif: 'spore', gene: { name: 'Toxic Bloom', icon: '☠️', desc: 'Games pay +5 coins and pets bond 10% faster.', effect: { gameCoins: 5, petBond: 1.1 } } },
  metal: { battle: 'metal', element: 'Metal', habitats: ['forge', 'cave'], likes: 'Iron Biscuit', greeting: 'Everything can be fixed. Even you.', motif: 'gear', gene: { name: 'Alloy Core', icon: '⚙️', desc: 'Games pay +5 coins and exploration restores +3 stamina.', effect: { gameCoins: 5, exploreStamina: 3 } } },
  crystal: { battle: 'crystal', element: 'Crystal', habitats: ['crystal', 'cave'], likes: 'Gem Tart', greeting: 'You are looking at a very shiny future.', motif: 'crystal', gene: { name: 'Prism Heart', icon: '💎', desc: 'Games pay +5 coins and pets build +10% bond.', effect: { gameCoins: 5, petBond: 1.1 } } },
  light: { battle: 'light', element: 'Light', habitats: ['meadow', 'temple'], likes: 'Sun Drop', greeting: 'I brought the morning with me.', motif: 'star', gene: { name: 'Dawnlight', icon: '☀️', desc: 'Games pay +4 coins and pets bond 14% faster.', effect: { gameCoins: 4, petBond: 1.14 } } },
  shadow: { battle: 'shadow', element: 'Shadow', habitats: ['night', 'cave'], likes: 'Moon Morsel', greeting: 'The dark is softer than it looks.', motif: 'moon', gene: { name: 'Night Step', icon: '🌑', desc: 'Games pay +6 coins and pets bond 10% faster.', effect: { gameCoins: 6, petBond: 1.1 } } },
  special: { battle: 'rainbow', element: 'Rainbow', habitats: ['starlit', 'night'], likes: 'Cloud Feast', greeting: 'You are made of star stuff. I checked.', motif: 'rainbow', gene: { name: 'Spectrum Soul', icon: '🌈', desc: 'Games pay +7 coins, exploration restores +3 stamina, and pets bond 10% faster.', effect: { gameCoins: 7, exploreStamina: 3, petBond: 1.1 } } },
};

const PUFFLE_ARCHIVE_SPECIAL_BATTLE = {
  'Prism Puffle': { battle: 'rainbow', element: 'Rainbow' },
  'Rainbow Puffle': { battle: 'rainbow', element: 'Rainbow' },
  'Galaxy Puffle': { battle: 'cosmic', element: 'Cosmic' },
  'Sprite Hollow Origin Puffle': { battle: 'secret', element: 'Creator' },
};

const PUFFLE_ARCHIVE_TIER_PRICES = {
  common: 70, uncommon: 90, rare: 105, epic: 130, legendary: 175,
  mythic: 215, secret: 250, ancient: 300, divine: 400, creator: 600,
};

const PUFFLE_ARCHIVE_PLAYABLE = (() => {
  if (typeof ELEMENTS === 'undefined' || !ELEMENTS) return [];
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const byName = new Map();
  Object.keys(ELEMENTS).forEach((key) => {
    const name = String((ELEMENTS[key] && ELEMENTS[key].name) || '').trim().toLowerCase();
    if (!name) return;
    if (!byName.has(name)) byName.set(name, key);
    const short = name.replace(/\s+puffle$/, '');
    if (short && !byName.has(short)) byName.set(short, key);
  });
  const preferred = {
    'moss puffle': 'puffle_moss',
    'breeze puffle': 'pc_breeze',
    'frost puffle': 'sp_frost',
    'storm puffle': 'sp_storm',
    'rainbow puffle': 'sp_rainbow',
    'forest puffle': 'sp_forest',
    'bloom puffle': 'puffle_bloom',
    'crystal puffle': 'puffle_crystal',
    'celestial puffle': 'puffle_celestial',
    'shadow puffle': 'puffle_shadow',
    'solar puffle': 'puffle_solar',
    'lumen puffle': 'sp_lumen',
    'aurora puffle': 'pc_aurora',
  };
  const used = new Set();
  const keys = [];
  const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const findExisting = (name) => {
    const lower = String(name).toLowerCase();
    const preferredKey = preferred[lower];
    if (preferredKey && ELEMENTS[preferredKey] && !used.has(preferredKey)) return preferredKey;
    const exact = byName.get(lower);
    if (exact && !used.has(exact)) return exact;
    const short = lower.replace(/\s+puffle$/, '');
    const shortKey = byName.get(short);
    return shortKey && !used.has(shortKey) ? shortKey : null;
  };

  PUFFLE_ARCHIVE_FAMILIES.forEach((family) => {
    const meta = PUFFLE_ARCHIVE_PLAYABLE_META[family.key] || PUFFLE_ARCHIVE_PLAYABLE_META.nature;
    const topName = family.members[family.members.length - 1].name;
    family.members.forEach((member) => {
      const tier = puffleArchiveTierFor(member.tier);
      const override = family.key === 'crystal' && member.name === 'Pebble Crystal Puffle'
        ? { key: 'pa_crystal_pebble_puffle', name: member.name }
        : null;
      let key = override ? override.key : findExisting(member.name);
      if (!key || used.has(key)) key = `pa_${family.key}_${slug(member.name)}`;
      if (used.has(key)) key = `${key}_${family.members.indexOf(member)}`;
      const displayName = override ? override.name : member.name;
      const special = family.key === 'special' ? PUFFLE_ARCHIVE_SPECIAL_BATTLE[member.name] : null;
      const battleFamily = special ? special.battle : meta.battle;
      const puffleElement = special ? special.element : meta.element;
      const price = PUFFLE_ARCHIVE_TIER_PRICES[member.tier] || PUFFLE_ARCHIVE_TIER_PRICES.common;

      if (!ELEMENTS[key]) {
        ELEMENTS[key] = {
          name: displayName,
          primary: family.colors[0],
          light: family.colors[1],
          deep: family.colors[3],
          accent: family.colors[2],
          trait: `${family.label} ${tier.name} — ${member.look}`,
          blurb: `${displayName} is a ${tier.name} ${family.label} Puffle from the rarity archive — ${member.look}`,
          greeting: meta.greeting,
          likes: meta.likes,
          puffleStyle: key,
          puffleElement,
        };
      }
      const entry = ELEMENTS[key];
      entry.name = displayName;
      entry.puffleStyle = entry.puffleStyle || key;
      entry.puffleElement = puffleElement;
      entry.archiveFamily = family.key;
      entry.archiveFamilyLabel = family.label;
      entry.archiveTier = member.tier;
      entry.archivePower = member.power;
      entry.archiveLook = member.look;
      entry.archiveBattleFamily = battleFamily;
      entry.archiveStageTrack = PUFFLE_ARCHIVE_STAGES.map((stage) => stage.name);
      entry.collectionTier = member.tier;
      entry.collectionTierName = tier.name;
      entry.rarity = member.tier;
      entry.eggRarity = member.tier;

      if (typeof GENE_POWERS !== 'undefined' && !GENE_POWERS[key]) GENE_POWERS[key] = meta.gene;
      if (typeof TITAN_NAMES !== 'undefined' && !TITAN_NAMES[key]) TITAN_NAMES[key] = topName;
      if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[key] = price;
      if (typeof TYPE_EGG_PRICE !== 'undefined') TYPE_EGG_PRICE[key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(price) : price;
      if (typeof NAME_START !== 'undefined' && !NAME_START[key]) NAME_START[key] = [displayName.split(' ')[0], 'Puffle', 'Puff', 'Tuft'];
      if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
      if (typeof TYPE_EGG_SPECIES !== 'undefined' && Array.isArray(TYPE_EGG_SPECIES) && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
      if (typeof WILD_SPECIES !== 'undefined' && Array.isArray(WILD_SPECIES) && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
      if (typeof SCENES !== 'undefined' && SCENES) {
        meta.habitats.forEach((sceneKey) => {
          if (SCENES[sceneKey] && Array.isArray(SCENES[sceneKey].species) && !SCENES[sceneKey].species.includes(key)) {
            SCENES[sceneKey].species.push(key);
          }
        });
      }
      if (table) {
        if (!table[key]) {
          table[key] = {
            hidden: true,
            tier: member.tier,
            name: displayName,
            theme: `${tier.name} ${family.label} Puffle — ${member.look}`,
            primary: family.colors[0],
            secondary: family.colors[1],
            belly: family.colors[1],
            ear: family.colors[1],
            iris: family.colors[2],
            eyeShadow: family.colors[3],
            leaf: family.colors[0],
            leafGlow: family.colors[2],
            pads: family.colors[1],
            motif: meta.motif,
            ...(member.tier === 'legendary' || member.tier === 'mythic' || member.tier === 'ancient' || member.tier === 'divine' || member.tier === 'creator' ? { gold: family.colors[2] } : {}),
          };
        } else if (table[key].hidden) {
          table[key].tier = member.tier;
          table[key].name = displayName;
          table[key].theme = `${tier.name} ${family.label} Puffle — ${member.look}`;
          if (!table[key].motif) table[key].motif = meta.motif;
        }
      }
      member.key = key;
      used.add(key);
      keys.push(key);
    });
  });

  if (table && typeof window.lumiPuffleSortKeys === 'function') {
    window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
  }
  window.PUFFLE_ARCHIVE_PLAYABLE = keys;
  return keys;
})();

window.PUFFLE_ARCHIVE = {
  tiers: PUFFLE_ARCHIVE_TIERS,
  stages: PUFFLE_ARCHIVE_STAGES,
  families: PUFFLE_ARCHIVE_FAMILIES,
  elements: PUFFLE_ARCHIVE_ELEMENTS,
  signatures: PUFFLE_ARCHIVE_SIGNATURES,
  prompts: PUFFLE_ARCHIVE_PROMPTS,
  evolutionPrompts: PUFFLE_ARCHIVE_EVOLUTION_PROMPTS,
  evolutionPromptCount: PUFFLE_ARCHIVE_EVOLUTION_PROMPT_COUNT,
  total: PUFFLE_ARCHIVE_TOTAL,
  playable: PUFFLE_ARCHIVE_PLAYABLE,
};
window.puffleArchiveHTML = puffleArchiveHTML;
window.puffleArchiveTierFor = puffleArchiveTierFor;
window.puffleArchiveFamilyProgress = puffleArchiveFamilyProgress;
window.puffleArchiveTierProgress = puffleArchiveTierProgress;
window.bindPuffleArchive = function bindPuffleArchive(root) {
  const archive = root && (root.querySelector('.puffle-archive') || root.querySelector('[data-puffle-archive]'));
  const toggle = archive && archive.querySelector('[data-puffle-archive-missing]');
  if (!archive || !toggle) return () => {};
  const search = archive.querySelector('[data-puffle-archive-search]');
  const empty = archive.querySelector('[data-puffle-archive-empty]');
  const showGroup = archive.querySelector('.puffle-archive-show');
  const rankGroup = archive.querySelector('.puffle-archive-rank');
  let show = 'all';
  let rank = 'all';
  const normalise = (value) => String(value == null ? '' : value).toLowerCase();
  const rows = Array.from(archive.querySelectorAll('[data-puffle-family-row]')).map((row) => {
    const family = PUFFLE_ARCHIVE_FAMILIES.find((entry) => entry.key === row.dataset.puffleFamilyRow) || null;
    return {
      row,
      family,
      match: row.querySelector(`[data-puffle-family-match="${row.dataset.puffleFamilyRow}"]`),
      count: row.querySelector(`[data-puffle-family-count="${row.dataset.puffleFamilyRow}"]`),
    };
  });
  const syncControls = () => {
    archive.querySelectorAll('[data-puffle-show]').forEach((button) => {
      const on = button.dataset.puffleShow === show;
      button.classList.toggle('on', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    archive.querySelectorAll('[data-puffle-rank]').forEach((button) => {
      const on = button.dataset.puffleRank === rank;
      button.classList.toggle('on', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const missingOnly = show === 'missing';
    toggle.setAttribute('aria-pressed', missingOnly ? 'true' : 'false');
    toggle.classList.toggle('on', missingOnly);
  };
  const apply = () => {
    const terms = search ? normalise(search.value).trim().split(/\s+/).filter(Boolean) : [];
    const filtering = terms.length > 0 || show !== 'all' || rank !== 'all';
    const owned = puffleArchiveOwnedSet();
    let shown = 0;
    rows.forEach(({ row, family, match, count }) => {
      const members = family && Array.isArray(family.members) ? family.members : [];
      const relevant = members.filter((member) => {
        if (rank !== 'all' && member.tier !== rank) return false;
        const have = !!(member.key && owned.has(member.key));
        if (show === 'owned' && !have) return false;
        if (show === 'missing' && have) return false;
        return true;
      });
      const familyText = normalise(`${family ? family.label : ''} ${family ? family.key : row.dataset.puffleFamilyRow}`);
      const familyHit = terms.length > 0 && terms.every((term) => familyText.includes(term));
      const memberHits = terms.length > 0 && !familyHit
        ? relevant.filter((member) => terms.every((term) => normalise(member.name).includes(term)))
        : [];
      const matched = terms.length === 0 || familyHit ? relevant : memberHits;
      const visible = matched.length > 0;
      row.hidden = !visible;
      row.classList.toggle('has-member-match', visible && memberHits.length > 0);
      if (count) {
        count.textContent = filtering ? `${matched.length}/${members.length} forms` : `${members.length} forms`;
        count.title = filtering
          ? `${matched.length} of ${members.length} forms match the active filters`
          : `${members.length} forms`;
      }
      if (match) {
        match.hidden = !visible || memberHits.length === 0;
        match.textContent = memberHits.length === 0
          ? ''
          : memberHits.length === 1
            ? `Matched form: ${memberHits[0].name}`
            : `Matched forms: ${memberHits.map((member) => member.name).join(', ')}`;
      }
      const matchedNames = new Set(matched.map((member) => member.name));
      row.querySelectorAll('[data-puffle-member]').forEach((card) => {
        const hit = matchedNames.has(card.dataset.puffleMember);
        card.hidden = filtering && !hit;
        card.classList.toggle('has-match', filtering && hit);
      });
      if (visible) shown += 1;
    });
    if (empty) {
      empty.hidden = shown !== 0;
      empty.textContent = show === 'missing' && !terms.length && rank === 'all'
        ? 'Every form is owned — nothing is missing here.'
        : 'No family or form matches those filters.';
    }
  };
  const onToggle = () => {
    show = show === 'missing' ? 'all' : 'missing';
    syncControls();
    apply();
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
  };
  const onShow = (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-puffle-show]') : null;
    if (!button || !showGroup || !showGroup.contains(button)) return;
    show = button.dataset.puffleShow;
    syncControls();
    apply();
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
  };
  const onRank = (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-puffle-rank]') : null;
    if (!button || !rankGroup || !rankGroup.contains(button)) return;
    rank = button.dataset.puffleRank;
    syncControls();
    apply();
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
  };
  const onSearch = () => apply();
  toggle.addEventListener('click', onToggle);
  if (showGroup) showGroup.addEventListener('click', onShow);
  if (rankGroup) rankGroup.addEventListener('click', onRank);
  if (search) search.addEventListener('input', onSearch);
  syncControls();
  apply();
  return () => {
    toggle.removeEventListener('click', onToggle);
    if (showGroup) showGroup.removeEventListener('click', onShow);
    if (rankGroup) rankGroup.removeEventListener('click', onRank);
    if (search) search.removeEventListener('input', onSearch);
  };
};
