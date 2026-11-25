/* The official Sprite Hollow rarity palette.

   One source of truth for creature cards, eggs, hatch/summon reveals, nameplates,
   borders, and particle accents. `color` stays a single hex where older styles
   need one; `gradient` and `stops` carry the animated / prism / galaxy looks. */

/* One rarity spec: every per-tier fact the game reads. The tables below and in
   data.js / data-rarity-economy.js / data-ability-paths.js are generated from
   this object, so adding a rank is one entry plus its rank number, not nine
   hand-edited tables. `rank` is stable: a new tier takes a fresh number and
   never renumbers an existing one, which is what keeps stored rarity boosts
   pointing at the same tier after an insertion. */
const RARITY_SPEC = {
  common: {
    rank: 0,
    name: 'Common',
    color: '#C9CDD2',
    glow: 'rgba(201, 205, 210, .55)',
    icon: '⚪',
    gradient: 'linear-gradient(135deg, #F7F8FA, #C9CDD2 50%, #8E949D)',
    stops: ['#F7F8FA', '#C9CDD2', '#8E949D'],
    eggName: 'Gray Shell',
    effects: ['Basic silver sparkle particles', 'Simple silver border'],
    listPrice: 120,
    mutation: 0.06,
    gen: 0,
    desc: 'A plain shell from the meadow. A random type at Common rank.',
    priceMult: 1,
    spawnWeight: 60,
    coinBonus: 1500,
    abilityRank: 0,
    wikiBand: 'under 75 coins',
  },
  uncommon: {
    rank: 10,
    name: 'Uncommon',
    color: '#42D97C',
    glow: 'rgba(66, 217, 124, .5)',
    icon: '🟢',
    gradient: 'linear-gradient(135deg, #B9FFD1, #42D97C 52%, #127A3E)',
    stops: ['#B9FFD1', '#42D97C', '#127A3E'],
    eggName: 'Emerald Shell',
    effects: ['Green magical glow', 'Leaf particles', 'Enhanced border shine'],
    listPrice: 200,
    mutation: 0.1,
    gen: 0,
    desc: 'Freckled shell. A random type raised to Uncommon rank.',
    priceMult: 1.15,
    spawnWeight: 25,
    coinBonus: 2000,
    abilityRank: 1,
    wikiBand: '75–97 coins',
  },
  rare: {
    rank: 20,
    name: 'Rare',
    color: '#3E89FF',
    glow: 'rgba(62, 137, 255, .52)',
    icon: '🔵',
    gradient: 'linear-gradient(135deg, #A9C8FF, #3E89FF 52%, #123C8A)',
    stops: ['#A9C8FF', '#3E89FF', '#123C8A'],
    eggName: 'Blue Crystal Shell',
    effects: ['Blue aura', 'Crystal particles', 'Animated border'],
    listPrice: 320,
    mutation: 0.14,
    gen: 1,
    desc: 'Cool blue veins. A random type raised to Rare rank.',
    priceMult: 1.35,
    spawnWeight: 10,
    coinBonus: 2700,
    abilityRank: 2,
    wikiBand: '98–116 coins',
  },
  epic: {
    rank: 30,
    name: 'Epic',
    color: '#9A5CFF',
    glow: 'rgba(154, 92, 255, .5)',
    icon: '🟣',
    gradient: 'linear-gradient(135deg, #D9C2FF, #9A5CFF 52%, #4A1D8A)',
    stops: ['#D9C2FF', '#9A5CFF', '#4A1D8A'],
    eggName: 'Purple Arcane Shell',
    effects: ['Purple energy waves', 'Floating runes', 'Multi-layer frame'],
    listPrice: 520,
    mutation: 0.2,
    gen: 1,
    desc: 'Rose-lit shell. A random type raised to Epic rank.',
    priceMult: 1.65,
    spawnWeight: 4,
    coinBonus: 4000,
    abilityRank: 3,
    wikiBand: '117–164 coins',
  },
  legendary: {
    rank: 40,
    name: 'Legendary',
    color: '#FFB62E',
    glow: 'rgba(255, 182, 46, .54)',
    icon: '🟠',
    gradient: 'linear-gradient(135deg, #FFE1A0, #FFB62E 52%, #A45A00)',
    stops: ['#FFE1A0', '#FFB62E', '#A45A00'],
    eggName: 'Gold Sun Shell',
    effects: ['Golden flames', 'Radiant rays', 'Animated crown effects'],
    listPrice: 800,
    mutation: 0.26,
    gen: 2,
    desc: 'Gold-flecked and warm. A random type raised to Legendary rank.',
    priceMult: 2.1,
    spawnWeight: 0.9,
    coinBonus: 6750,
    abilityRank: 4,
    wikiBand: '165–209 coins',
  },
  mythic: {
    rank: 50,
    name: 'Mythic',
    color: '#FF4B5C',
    glow: 'rgba(255, 75, 92, .54)',
    icon: '🔴',
    gradient: 'linear-gradient(135deg, #FFB8C0, #FF4B5C 52%, #8A1020)',
    stops: ['#FFB8C0', '#FF4B5C', '#8A1020'],
    eggName: 'Crimson Dragon Shell',
    effects: ['Cosmic fire particles', 'Mythic energy surges', 'Glowing animated wings'],
    listPrice: 1250,
    mutation: 0.32,
    gen: 2,
    desc: 'Nebula swirl. A random type raised to Mythic rank.',
    priceMult: 2.8,
    spawnWeight: 0.09,
    coinBonus: 10000,
    abilityRank: 5,
    wikiBand: '210+ coins',
  },
  ultra: {
    rank: 60,
    name: 'Ultra',
    color: '#B6F2FF',
    glow: 'rgba(182, 242, 255, .56)',
    icon: '🛰',
    gradient: 'linear-gradient(135deg, #EAFDFF, #B6F2FF 48%, #4F8BD6)',
    stops: ['#EAFDFF', '#B6F2FF', '#4F8BD6'],
    eggName: 'Signal Shell',
    effects: ['Light-band shimmer', 'Signal sparkles'],
    listPrice: 1550,
    mutation: 0.34,
    gen: 3,
    desc: 'Signal-bright shell. A random type raised to Ultra rank.',
    priceMult: 3.1,
    spawnWeight: 0.05,
    coinBonus: 11500,
    abilityRank: 6,
    wikiBand: 'Signal rank · above Mythic, below Secret',
  },
  secret: {
    rank: 70,
    name: 'Secret',
    color: '#FF8FD6',
    glow: 'rgba(255, 143, 214, .58)',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #FF8FD6, #B18CFF 22%, #58B8FF 42%, #67F5D4 60%, #FFE58A 80%, #FF9F6E)',
    stops: ['#FF8FD6', '#B18CFF', '#58B8FF', '#67F5D4', '#FFE58A', '#FF9F6E'],
    eggName: 'Rainbow Prism Shell',
    effects: ['Constant color shifting', 'Rainbow trails', 'Prism sparkles', 'Shimmering holographic frame'],
    listPrice: 1900,
    mutation: 0.36,
    gen: 3,
    desc: 'Whispering shell. A random type raised to Secret rank — not a Vault keeper.',
    priceMult: 3.6,
    spawnWeight: 0.02,
    coinBonus: 13500,
    abilityRank: 8,
    wikiBand: 'Secret tier · Vault keepers and Secret variants, above Mythic',
    animated: true,
  },
  exotic: {
    rank: 80,
    name: 'Exotic',
    color: '#7AF0D0',
    glow: 'rgba(122, 240, 208, .5)',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #C9FFF4, #7AF0D0 52%, #117A66)',
    stops: ['#C9FFF4', '#7AF0D0', '#117A66'],
    eggName: 'Guardian Shell',
    effects: ['Guardian shimmer', 'Mint sparkles'],
    listPrice: 2800,
    mutation: 0.4,
    gen: 3,
    desc: 'Guardian-bright shell. A random type raised to Exotic rank.',
    priceMult: 3.1,
    spawnWeight: 0.01,
    coinBonus: 18000,
    wikiBand: 'Hollow exotics · above Secret',
  },
  master: {
    rank: 90,
    name: 'Master',
    color: '#FFE9A3',
    glow: 'rgba(255, 233, 163, .5)',
    icon: '🕹',
    gradient: 'linear-gradient(135deg, #FFF8D8, #FFE9A3 52%, #B8891C)',
    stops: ['#FFF8D8', '#FFE9A3', '#B8891C'],
    eggName: 'Crown Shell',
    effects: ['Crown light', 'Champion sparkles'],
    listPrice: 4000,
    mutation: 0.44,
    gen: 4,
    desc: 'Crown-stamped shell. A random type raised to Master rank.',
    priceMult: 5.2,
    spawnWeight: 0.001,
    coinBonus: 25000,
    abilityRank: 13,
    wikiBand: 'The Master secret · above Exotic',
  },
  ancient: {
    rank: 100,
    name: 'Ancient',
    color: '#6B5C9B',
    glow: 'rgba(107, 92, 155, .5)',
    icon: '🌑',
    gradient: 'linear-gradient(135deg, #C2B2EE, #6B5C9B 52%, #241A3D)',
    stops: ['#C2B2EE', '#6B5C9B', '#241A3D'],
    eggName: 'Rune Shell',
    effects: ['Ancient runes', 'Relic dust'],
    listPrice: 6000,
    mutation: 0.5,
    gen: 4,
    desc: 'Rune-scored shell. A random type raised to Ancient rank.',
    priceMult: 5.8,
    spawnWeight: 0.0005,
    coinBonus: 30000,
    abilityRank: 10,
    wikiBand: 'Rune rank · above Master',
  },
  celestial: {
    rank: 110,
    name: 'Celestial',
    color: '#8F7CFF',
    glow: 'rgba(143, 124, 255, .62)',
    icon: '🌌',
    gradient: 'linear-gradient(135deg, #0B1035, #3A2268 23%, #A34C9E 54%, #D66BB5 76%, #F4F1FF)',
    stops: ['#0B1035', '#3A2268', '#A34C9E', '#D66BB5', '#F4F1FF'],
    eggName: 'Galaxy Nebula Shell',
    effects: ['Constellations moving in border', 'Tiny orbiting stars', 'Nebula particles', 'Cosmic glow'],
    listPrice: 6200,
    mutation: 0.48,
    gen: 4,
    desc: 'Star-fired shell. A random type raised to Celestial rank.',
    priceMult: 6.2,
    spawnWeight: 0.0002,
    coinBonus: 35000,
    abilityRank: 11,
    wikiBand: 'Apex rank · above Master',
    apex: true,
    apexPremium: 8000,
    animated: true,
  },
  divine: {
    rank: 120,
    name: 'Divine',
    color: '#FFF4C4',
    glow: 'rgba(255, 244, 196, .58)',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #FFFFFF, #FFF4C4 50%, #E8C86A)',
    stops: ['#FFFFFF', '#FFF4C4', '#E8C86A'],
    eggName: 'White-Gold Sacred Shell',
    effects: ['Celestial light beams', 'Floating halos', 'Sacred glyph animations'],
    listPrice: 7500,
    mutation: 0.52,
    gen: 4,
    desc: 'Haloed shell. A random type raised to Divine rank.',
    priceMult: 7.5,
    spawnWeight: 0.0001,
    coinBonus: 50000,
    abilityRank: 7,
    wikiBand: 'Apex rank · above Master',
    apex: true,
    apexPremium: 11000,
  },
  eternal: {
    rank: 130,
    name: 'Eternal',
    color: '#F4F1FF',
    glow: 'rgba(244, 241, 255, .55)',
    icon: '💠',
    gradient: 'linear-gradient(135deg, #FFFFFF, #F4F1FF 52%, #B8C8E8)',
    stops: ['#FFFFFF', '#F4F1FF', '#B8C8E8'],
    eggName: 'Eternal Shell',
    effects: ['Endless light', 'Time-ring particles'],
    listPrice: 10000,
    mutation: 0.55,
    gen: 4,
    desc: 'A shell that seems to have always existed. Raises a random type to Eternal rank.',
    priceMult: 10,
    spawnWeight: 5e-05,
    coinBonus: 75000,
    wikiBand: 'Apex rank · above Master',
    apex: true,
    apexPremium: 15000,
  },
  creator: {
    rank: 140,
    name: 'Creator',
    color: '#FFF4C4',
    glow: 'rgba(255, 244, 196, .68)',
    icon: '👑',
    gradient: 'conic-gradient(from 0deg, #FFD166, #FF8FD6, #8B7BFF, #6FD6FF, #8BFFC9, #FFF4C4, #FFD166)',
    stops: ['#FFD166', '#FF8FD6', '#8B7BFF', '#6FD6FF', '#FFF4C4'],
    eggName: 'Living Cosmic Rainbow Shell',
    effects: ['Animated elemental icons orbiting', 'Living constellation frame', 'Reality distortion effect', 'Rainbow cosmic wings', 'Twelve-element energy rings'],
    listPrice: 20000,
    mutation: 0.6,
    gen: 5,
    desc: 'An origin shell holding every element at once. Raises a random type to Creator rank.',
    priceMult: 12,
    spawnWeight: 1e-05,
    coinBonus: 100000,
    abilityRank: 12,
    wikiBand: 'Apex rank · above Master',
    animated: true,
  },
  god: {
    rank: 150,
    name: 'God',
    color: '#FFDD88',
    glow: 'rgba(255, 221, 136, .72)',
    icon: '🌟',
    gradient: 'conic-gradient(from 90deg, #FFFFFF, #FFDD88, #FF8FD6, #8B7BFF, #6FD6FF, #FFF4C4, #FFFFFF)',
    stops: ['#FFFFFF', '#FFDD88', '#FF8FD6', '#8B7BFF', '#FFF4C4'],
    eggName: 'Throne of Creation Shell',
    effects: ['A crown of every element in orbit', 'Godlight beams through the frame', 'Elemental sovereign sigils', 'Reality rewritten at the rim'],
    listPrice: 16000,
    sale: 1,
    mutation: 0.65,
    gen: 5,
    desc: 'A shell no ladder was built to hold. Raises a random type to God rank.',
    priceMult: 15,
    spawnWeight: 5e-06,
    coinBonus: 150000,
    abilityRank: 14,
    wikiBand: 'Apex rank · above Creator',
    apex: true,
    apexPremium: 20000,
    animated: true,
  },
  ultra_secret: {
    rank: 160,
    name: 'Ultra Secret',
    color: '#FFE08A',
    glow: 'rgba(255, 224, 138, .62)',
    icon: '👑',
    gradient: 'linear-gradient(135deg, #FFE08A, #FF8FD6 30%, #B18CFF 58%, #8FE3FF 82%, #FFF4C4)',
    stops: ['#FFE08A', '#FF8FD6', '#B18CFF', '#8FE3FF', '#FFF4C4'],
    eggName: 'Cosmic Throne Shell',
    effects: ['Cosmic throne light', 'Heart sparkles'],
    priceMult: 4.6,
    spawnWeight: 0.001,
    abilityRank: 9,
    wikiBand: 'Cosmic Throne · the rarest rank',
    boostable: false,
    animated: true,
  },
};

const RARITY_SPEC_KEYS = Object.keys(RARITY_SPEC).sort((a, b) => RARITY_SPEC[a].rank - RARITY_SPEC[b].rank);

/* The tier shelf's sale is one lever, like the species-egg discount: every rank
   declares the list price it was designed at and the shelf derives what it
   charges, so the promotion is a number here and not sixteen hand edits. A rank
   that ships outside a promotion sets `sale: 1` and keeps its list price. */
const TIER_EGG_SALE = 0.75;
function tierEggSalePrice(listPrice, sale = TIER_EGG_SALE, step = 5) {
  return Math.max(step, Math.round((listPrice * sale) / step) * step);
}
Object.values(RARITY_SPEC).forEach((tier) => {
  if (!(Number(tier.listPrice) > 0)) return;
  const sale = Number.isFinite(tier.sale) ? tier.sale : TIER_EGG_SALE;
  tier.price = tierEggSalePrice(tier.listPrice, sale);
});

/* The official Sprite Hollow rarity palette, generated per tier. One source of
   truth for creature cards, eggs, hatch/summon reveals, nameplates, borders and
   particle accents. */
const RARITY_TIER_STYLES = {};
RARITY_SPEC_KEYS.forEach((key) => {
  const tier = RARITY_SPEC[key];
  RARITY_TIER_STYLES[key] = {
    name: tier.name, color: tier.color, glow: tier.glow, icon: tier.icon,
    gradient: tier.gradient, stops: tier.stops.slice(),
    eggName: tier.eggName, effects: tier.effects.slice(),
    ...(tier.animated ? { animated: true } : {}),
  };
});


/* Generated frame briefs. The palette drives the CSS frame; these prompts keep
   the same hierarchy available for card art, banners, inventory slots and
   profile borders. */
const RARITY_FRAME_META = {
  common: {
    theme: 'Silver Gray & Soft White', glow: '#EEF1F5',
    prompt: 'Fantasy RPG creature card frame, soft silver border, polished metallic corners, subtle sparkles, clean mobile game UI, elegant gray glow, beginner rarity frame, collectible monster game interface, highly detailed, premium fantasy artwork, transparent background',
  },
  uncommon: {
    theme: 'Emerald Green', glow: '#7FFFAC',
    prompt: 'Fantasy creature card frame, emerald green magical border, glowing leaf ornaments, nature energy particles, polished game UI frame, collectible creature card design, vibrant green aura, fantasy mobile game interface, transparent background',
  },
  rare: {
    theme: 'Sapphire Blue', glow: '#74B4FF',
    prompt: 'Rare fantasy creature frame, sapphire crystal border, glowing blue gemstones, floating crystal particles, magical RPG card frame, premium mobile game UI, elegant animated blue aura, transparent background',
  },
  epic: {
    theme: 'Arcane Purple', glow: '#C8A5FF',
    prompt: 'Epic rarity creature card frame, magical purple energy, floating runes, glowing crystal horns, fantasy RPG UI border, mystical aura effects, premium collectible monster frame, highly detailed, transparent background',
  },
  legendary: {
    theme: 'Solar Gold', glow: '#FFD86D',
    prompt: 'Legendary fantasy card frame, radiant golden border, floating crown ornaments, sun rays, celestial energy effects, premium RPG creature card design, glowing animated gold aura, highly detailed collectible game frame, transparent background',
  },
  mythic: {
    theme: 'Crimson Ruby', glow: '#FF8B96',
    prompt: 'Mythic rarity creature frame, crimson red magical border, dragon wings built into frame corners, floating energy flames, powerful cosmic aura, premium fantasy RPG card frame, ultra detailed game UI design, transparent background',
  },
  divine: {
    theme: 'White Gold', glow: '#FFFFFF',
    prompt: 'Divine rarity fantasy frame, white gold celestial border, halo effects, angelic wings, floating sacred glyphs, heavenly light particles, luxury mobile game UI, mythical creature card frame, transparent background',
  },
  secret: {
    theme: 'Rainbow Prism', glow: '#FFD1F0',
    prompt: 'Secret rarity card frame, rainbow prism energy border, holographic effects, shifting colors, magical crystal light beams, animated rainbow particles, premium collectible game UI, legendary fantasy frame, transparent background',
  },
  celestial: {
    theme: 'Galaxy Nebula', glow: '#D9C8FF',
    prompt: 'Celestial rarity fantasy frame, cosmic nebula border, floating stars and constellations, glowing galaxy crystals, animated space effects, premium RPG interface frame, magical universe energy, transparent background',
  },
  creator: {
    theme: 'Omni-Spectrum', glow: '#FFF4C4',
    prompt: 'Creator rarity fantasy creature frame, ultimate cosmic border, rainbow galaxy energy, floating elemental symbols, divine crown ornaments, universe creation effects, constellation runes, premium legendary RPG frame, god-tier collectible game UI, transparent background',
  },
  ultra: {
    theme: 'Signal Bright', glow: '#B6F2FF',
    prompt: 'Ultra rarity creature frame, signal-bright cyan border, horizontal light bands scanning the edge, drifting data sparkles, clean sci-fi fantasy RPG card frame, premium mobile game UI, transparent background',
  },
  exotic: {
    theme: 'Mint Guardian', glow: '#7AF0D0',
    prompt: 'Exotic rarity creature frame, mint guardian shimmer border, jade relic ornaments, drifting guardian motes, fantasy RPG card frame, premium collectible game UI, transparent background',
  },
  master: {
    theme: 'Champion Crown', glow: '#FFE9A3',
    prompt: 'Master rarity creature frame, champion gold border, arcade crown ornaments, star-burst sparkles, competitive fantasy RPG card frame, premium collectible game UI, transparent background',
  },
  ancient: {
    theme: 'Rune Relic', glow: '#6B5C9B',
    prompt: 'Ancient rarity creature frame, violet rune-carved stone border, relic dust particles, weathered glyph band, deep fantasy RPG card frame, premium game UI, transparent background',
  },
  eternal: {
    theme: 'Endless Light', glow: '#F4F1FF',
    prompt: 'Eternal rarity creature frame, pale white ring border, slow time-ring ornaments, endless soft light, timeless fantasy RPG card frame, premium collectible game UI, transparent background',
  },
  god: {
    theme: 'Godlight Throne', glow: '#FFDD88',
    prompt: 'God tier creature frame, white-gold throne border, a crown of every element in orbit, godlight beams crossing the card, sovereign sigils at the rim, reality-rewritten card edge, premium legendary RPG UI, ultra detailed, transparent background',
  },
};

const RARITY_FRAME_ANIMATIONS = {
  common: {
    style: 'Soft shimmer sweep, small sparkles, gentle glow pulse', speed: 'Slow', special: 'Sparkles drift across the border',
    prompt: 'Fantasy RPG creature card frame animation, silver metallic border, subtle sparkle effects moving across edges, soft white glow pulse, clean premium mobile game UI, beginner rarity frame, smooth looping animation, transparent background',
  },
  uncommon: {
    style: 'Flowing leaves, nature particles, green aura pulse', speed: 'Looping', special: 'Leaves occasionally bloom',
    prompt: 'Emerald green fantasy creature frame animation, glowing leaf particles drifting around border, magical nature aura, flowing vines appearing and fading, collectible mobile game UI, smooth looping animation, transparent background',
  },
  rare: {
    style: 'Crystal sparkles, energy waves, light reflections', speed: 'Looping', special: 'Crystals flash randomly',
    prompt: 'Sapphire blue animated creature frame, crystal particles orbiting border, shimmering gemstone reflections, magical blue energy pulse, fantasy RPG collectible card frame, premium game UI, transparent background',
  },
  epic: {
    style: 'Floating runes, arcane energy rings, magical wisps', speed: 'Looping', special: 'Runes rotate continuously',
    prompt: 'Epic fantasy card frame animation, glowing purple runes rotating around border, arcane energy streams, magical particles, RPG rarity frame, mystical collectible creature UI, ultra detailed, transparent background',
  },
  legendary: {
    style: 'Rotating golden crown, sun rays, sacred flames', speed: 'Looping', special: 'Crown slowly spins',
    prompt: 'Legendary golden rarity frame animation, radiant sunlight effects, rotating floating crown, heavenly golden particles, glowing border energy, premium mobile RPG creature card frame, luxury collectible UI, transparent background',
  },
  mythic: {
    style: 'Dragon energy, crimson flames, power surges', speed: 'Looping', special: 'Energy spikes every few seconds',
    prompt: 'Mythic fantasy creature frame animation, crimson magical flames moving along border, dragon spirit particles, power surges, glowing ancient runes, premium collectible game UI, ultra detailed fantasy effects, transparent background',
  },
  divine: {
    style: 'Halo expansion, angel feathers, sacred light beams', speed: 'Looping', special: 'Halo pulses outward',
    prompt: 'Divine rarity frame animation, white gold celestial border, floating angel feathers, sacred halo expanding and contracting, heavenly light rays, mythological RPG card frame, luxury fantasy game UI, transparent background',
  },
  secret: {
    style: 'Rainbow flow, holographic shifts, prism flashes', speed: 'Looping', special: 'Entire frame cycles colors',
    prompt: 'Secret rarity fantasy frame animation, holographic rainbow border shifting through colors, prism crystal refractions, magical rainbow trails, premium collectible creature card frame, fantasy RPG UI, transparent background',
  },
  celestial: {
    style: 'Constellation movement, orbiting stars, nebula flow', speed: 'Looping', special: 'Shooting stars travel across corners',
    prompt: 'Celestial rarity animated card frame, floating stars orbiting border, moving constellations, galaxy nebula effects, cosmic energy particles, fantasy RPG collectible frame, premium mobile game UI, transparent background',
  },
  creator: {
    style: 'Elemental orbits, galaxy expansion, reality distortions', speed: 'Looping', special: 'Orbiting elemental icons, universe expansion, rainbow nebula motion, constellation lines and rotating crown',
    prompt: 'Creator tier animated fantasy frame, rainbow galaxy border, orbiting elemental symbols, moving constellations, floating creator crown, universe creation effects, cosmic energy streams, god-tier collectible game frame, ultra detailed, transparent background',
  },
  god: {
    style: 'Element crown orbits, godlight beams sweep the rim, sovereign sigils ignite', speed: 'Looping', special: 'The crown completes one slow rotation while the beam sweeps twice',
    prompt: 'God tier animated card frame, a crown of all twelve elements orbiting the border, godlight beams sweeping across it, sovereign sigils igniting at the rim, reality shimmering along the card edge, premium legendary RPG game UI, ultra detailed looping animation, transparent background',
  },
  ultra: {
    style: 'Scanning light bands, data sparkles, signal pulse', speed: 'Looping', special: 'A bright scan line crosses the border every few seconds',
    prompt: 'Ultra rarity animated card frame, scanning cyan light bands crossing the border, drifting data sparkles, a signal pulse sweeping the edges, clean sci-fi fantasy RPG UI, smooth looping animation, transparent background',
  },
  exotic: {
    style: 'Guardian shimmer, drifting motes, jade pulse', speed: 'Looping', special: 'Guardian motes gather at the corners and drift away',
    prompt: 'Exotic rarity animated card frame, mint guardian shimmer moving along the border, jade relic ornaments glowing, guardian motes drifting out of the corners, fantasy RPG card frame, premium collectible game UI, transparent background',
  },
  master: {
    style: 'Crown spin, star bursts, champion glow', speed: 'Looping', special: 'Star bursts pop on the corners between rotations',
    prompt: 'Master rarity animated card frame, arcade champion crown rotating above the card, gold star bursts at the corners, competitive fantasy RPG UI, premium collectible game frame, smooth looping animation, transparent background',
  },
  ancient: {
    style: 'Runed stone breathing, relic dust, glyph crawl', speed: 'Slow', special: 'The glyphs crawl one slot along the border with each breath',
    prompt: 'Ancient rarity animated card frame, rune-carved stone border breathing with violet light, relic dust drifting off it, glyphs crawling along the band, deep fantasy RPG UI, smooth looping animation, transparent background',
  },
  eternal: {
    style: 'Time rings turning, pale light steady, one slow pulse', speed: 'Slow', special: 'The outer ring completes one turn every twelve seconds',
    prompt: 'Eternal rarity animated card frame, pale rings turning slowly around the border, steady timeless light, one slow pulse across the frame, premium collectible game frame, smooth looping animation, transparent background',
  },
};

const RARITY_SUMMON_ANIMATIONS = {
  common: {
    sequence: ['Egg drops from the sky', 'Soft silver glow appears', 'Small crack forms', 'Sparkles burst outward', 'Baby Puffle hops out'],
    prompt: 'Fantasy creature summon animation, silver magical egg cracking open, white sparkles floating upward, cute Sprite Puffle emerging, bright fantasy RPG summon portal, polished mobile game hatch animation, adorable mascot style',
  },
  uncommon: {
    sequence: ['Green rune circle appears', 'Leaves swirl around the egg', 'Nature magic gathers', 'Egg hatches in emerald light'],
    prompt: 'Emerald summon animation, magical leaves swirling around glowing creature egg, nature energy vortex, bright green summoning portal, fantasy mobile RPG hatch animation, premium collectible creature reveal',
  },
  rare: {
    sequence: ['Crystal shards rise', 'Blue portal opens', 'Energy pulses outward', 'Creature silhouette appears', 'Rare Puffle reveal'],
    prompt: 'Sapphire rarity summon animation, floating crystal shards, glowing blue portal explosion, magical creature silhouette reveal, premium fantasy RPG summoning sequence, collectible monster hatch scene',
  },
  epic: {
    sequence: ['Arcane symbols appear', 'Giant magic circle spins', 'Purple lightning strikes', 'Energy explodes', 'Epic Puffle descends'],
    prompt: 'Epic fantasy summoning animation, rotating purple runes, arcane magic circle, violet lightning storm, dramatic creature reveal, premium mobile RPG summon sequence, mystical fantasy effects',
  },
  legendary: {
    sequence: ['Sky darkens', 'Golden sunlight breaks through', 'Crown appears above the egg', 'Massive golden explosion', 'Legendary Puffle emerges'],
    prompt: 'Legendary rarity summon animation, radiant golden sunlight beams, floating celestial crown, powerful holy explosion, majestic creature reveal, luxury fantasy RPG summoning sequence, ultra detailed effects',
  },
  mythic: {
    sequence: ['Reality cracks', 'Crimson energy erupts', 'Dragon spirits circle the portal', 'Giant rune appears', 'Mythic creature awakens'],
    prompt: 'Mythic summon animation, crimson reality fracture effects, dragon spirit energy, ancient magical runes, cosmic creature reveal, premium mythical creature summoning sequence, highly detailed fantasy visuals',
  },
  divine: {
    sequence: ['Screen turns white', 'Celestial choir glow', 'Golden halo expands', 'Divine gates open', 'Puffle descends from the heavens'],
    prompt: 'Divine summoning animation, heavenly white gold light, giant sacred halo, angelic celestial gateway opening, mythological creature reveal, premium fantasy mobile game animation, sacred magical atmosphere',
  },
  secret: {
    sequence: ['Colors distort', 'Rainbow prism erupts', 'Holographic particles fill the screen', 'Portal becomes unstable', 'Secret Puffle appears'],
    prompt: 'Secret rarity summon animation, rainbow prism explosion, holographic crystal reflections, shifting reality effects, premium fantasy creature reveal, animated rainbow energy storm, collectible RPG summon sequence',
  },
  celestial: {
    sequence: ['Stars appear', 'Galaxy spins', 'Constellations ignite', 'Nebula explodes', 'Celestial creature emerges'],
    prompt: 'Celestial summon animation, swirling galaxies, moving constellations, cosmic star explosion, nebula portal opening, divine fantasy creature reveal, premium RPG summoning cinematic',
  },
  creator: {
    sequence: ['Universe fades in', 'All element symbols orbit', 'A cosmic egg forms', 'Big Bang explosion', 'Origin Nexus Puffle appears'],
    prompt: 'Creator tier summon animation, universe creation sequence, orbiting elemental symbols, rainbow galaxy explosion, cosmic creator entity reveal, god-tier fantasy RPG summon cinematic, ultra detailed, legendary mobile game animation',
  },
  eternal: {
    sequence: ['A ring of pale light opens', 'Time folds inward on the shell', 'Every age of the egg shows at once', 'The ring closes', 'Eternal Puffle steps out'],
    prompt: 'Eternal rarity summon animation, a slow ring of pale light, time folding around the egg, overlapping afterimages of every age, timeless fantasy RPG summon cinematic, premium mobile game animation',
  },
  god: {
    sequence: ['Every element symbol orbits at once', 'A throne of light forms', 'Godlight floods the frame', 'The crown settles', 'God Puffle rises'],
    prompt: 'God tier summon animation, orbiting crown of every element, a throne of light assembling, godlight flooding the screen, sovereign creature rising through it, legendary fantasy RPG summon cinematic, ultra detailed',
  },
  ultra: {
    sequence: ['A signal ring opens', 'Data runes scroll around the shell', 'The band locks on', 'Signal Puffle answers'],
    prompt: 'Ultra rarity summon animation, scanning signal ring opening, scrolling data runes around a glowing egg, a lock-on reticle closing, sci-fi fantasy creature reveal, premium mobile game animation',
  },
  exotic: {
    sequence: ['A jade gate appears', 'Guardian motes circle the egg', 'The gate holds steady', 'Exotic Puffle wanders through'],
    prompt: 'Exotic rarity summon animation, a mint jade gate opening, guardian motes circling a glowing egg, a wandering creature stepping through, premium fantasy RPG creature reveal',
  },
  master: {
    sequence: ['An arcade cabinet flickers on', 'A champion crown descends', 'The crowd roar surges', 'Master Puffle takes the podium'],
    prompt: 'Master rarity summon animation, arcade cabinet lights flickering on, a champion crown descending, roaring crowd light pulses, a victor creature taking the podium, retro fantasy RPG reveal',
  },
  ancient: {
    sequence: ['Runes wake along the shell', 'A buried doorway rises', 'Dust pours out of the dark', 'Ancient Puffle remembers you'],
    prompt: 'Ancient rarity summon animation, glowing runes waking across an old shell, a buried stone doorway rising, dust pouring out of the dark, archaic creature reveal, premium fantasy RPG cinematic',
  },
};

const RARITY_IDLE_ANIMATIONS = {
  common: { style: 'Sparkles every 3 seconds, gentle border shimmer, eye blink', prompt: 'Animated creature card, subtle sparkle sweep, gentle idle movement, premium mobile game collectible card' },
  uncommon: { style: 'Leaf particles drift, the border blooms once in a while, gentle sway', prompt: 'Uncommon fantasy creature card animation, drifting leaf particles, an occasional bloom of green light along the border, gentle idle sway, premium mobile collectible card' },
  rare: { style: 'Floating particles, fur movement, soft aura pulse', prompt: 'Fantasy creature card idle animation, floating magical particles, gentle aura pulse, premium collectible monster card' },
  epic: { style: 'Floating runes, orbiting elemental symbols, dynamic lighting', prompt: 'Epic creature card animation, magical runes orbiting creature, dynamic fantasy lighting effects, RPG collection screen' },
  legendary: { style: 'Crown rotation, animated background, halo pulse', prompt: 'Legendary rarity creature card idle animation, floating royal crown, radiant lighting effects, premium fantasy card display' },
  mythic: { style: 'Energy surges, reality distortions, environmental effects', prompt: 'Mythic creature card animation, cosmic energy effects, subtle reality distortion, living fantasy collectible card' },
  divine: { style: 'Feather drift, sacred glyphs, celestial rays', prompt: 'Divine rarity card animation, floating angelic feathers, sacred runes, heavenly light effects, luxury fantasy creature card' },
  secret: { style: 'Holographic shifts, rainbow movement, prism reflections', prompt: 'Secret rarity holographic creature card animation, rainbow prism effects, color-shifting fantasy frame, animated collectible card' },
  celestial: { style: 'Moving constellations, orbiting stars, nebula movement', prompt: 'Celestial fantasy creature card animation, moving galaxy background, orbiting stars and constellations, premium cosmic collectible card' },
  creator: { style: 'Element symbols orbit, wings breathe, constellation flow, galaxy rotation, rainbow streams, crown spin and creature glow', prompt: 'Creator tier animated creature card, galaxy background rotation, orbiting elemental symbols, constellation energy effects, animated rainbow cosmic wings, divine creator crown, living fantasy collectible card, ultra premium mobile game showcase, no empty space' },
  eternal: { style: 'Time rings turn slowly, pale light holds steady, the creature breathes in long slow cycles', prompt: 'Eternal rarity animated creature card, turning rings of pale light, steady timeless glow, long slow breathing motion, premium collectible card' },
  god: { style: 'Element crown orbits, godlight beams sweep, sovereign sigils pulse with the creature glow', prompt: 'God tier animated creature card, orbiting crown of every element, sweeping godlight beams, pulsing sovereign sigils, living legend collectible card, ultra premium mobile game showcase, no empty space' },
  ultra: { style: 'Scan lines sweep, data sparkles drift, the creature blinks in sync with the pulse', prompt: 'Ultra rarity animated creature card, cyan scan lines sweeping the card, drifting data sparkles, a steady signal pulse, premium sci-fi collectible card' },
  exotic: { style: 'Guardian motes circle slowly, jade light breathes with the creature', prompt: 'Exotic rarity animated creature card, guardian motes circling lazily, breathing mint jade light, premium fantasy collectible card' },
  master: { style: 'Crown glints, star bursts blink, a confident champion sway', prompt: 'Master rarity animated creature card, glinting champion crown, blinking star bursts, a victorious idle sway, retro premium game card' },
  ancient: { style: 'Runes pulse slowly, dust drifts, heavy deliberate breathing', prompt: 'Ancient rarity animated creature card, slowly pulsing runes, drifting relic dust, heavy deliberate breathing, archaic premium card' },
};

const RARITY_IDLE_BACKGROUNDS = {
  common: { style: 'Static sparkle', prompt: 'Common creature card, static silver sparkle background, premium collectible card' },
  uncommon: { style: 'Meadow verge', prompt: 'Uncommon creature card, soft meadow verge background, drifting leaves, light green glow' },
  rare: { style: 'Animated backdrop', prompt: 'Rare fantasy creature card, softly animated blue backdrop, floating particles, premium collectible card' },
  epic: { style: 'Floating runes', prompt: 'Epic creature card, floating violet runes, arcane backdrop, dynamic fantasy lighting' },
  legendary: { style: 'Moving environment', prompt: 'Legendary creature card, moving golden environment, radiant crown light, luxury fantasy card' },
  mythic: { style: 'Living environment', prompt: 'Mythic creature card, living crimson cosmic environment, reality distortion, premium collectible card' },
  divine: { style: 'Celestial realm', prompt: 'Divine creature card, celestial realm background, sacred rays and floating feathers' },
  secret: { style: 'Holographic reality', prompt: 'Secret creature card, holographic reality background, rainbow prism reflections' },
  celestial: { style: 'Galaxy panorama', prompt: 'Celestial creature card, galaxy panorama background, moving constellations and nebulae' },
  creator: { style: 'Infinite universe', prompt: 'Creator creature card, infinite universe background, rotating galaxies and elemental symbols' },
  eternal: { style: 'Endless horizon', prompt: 'Eternal creature card, endless pale horizon background, slow turning light rings, timeless atmosphere' },
  god: { style: 'Throne of light', prompt: 'God creature card, throne of light background, an orbiting crown of elements, sovereign godlight across the frame' },
  ultra: { style: 'Signal field', prompt: 'Ultra creature card, cyan signal field background, scanning light bands, clean sci-fi premium card' },
  exotic: { style: 'Guardian garden', prompt: 'Exotic creature card, mint guardian garden background, drifting motes, jade relic light' },
  master: { style: 'Champion arena', prompt: 'Master creature card, arcade champion arena background, star bursts and crown light' },
  ancient: { style: 'Buried hall', prompt: 'Ancient creature card, buried stone hall background, rune light and drifting dust' },
};

/* Elemental idle layer. The card art gets one small moving element motif, so the
   creature reads as part of its element without changing the generated SVG. */
const ELEMENT_IDLE_ANIMATIONS = {
  fire: { icon: '🔥', name: 'Flickering flames', prompt: 'Fire creature card, flickering warm flames, ember motes' },
  water: { icon: '💧', name: 'Flowing droplets', prompt: 'Water creature card, flowing droplets, soft blue ripples' },
  nature: { icon: '🌿', name: 'Growing flowers', prompt: 'Nature creature card, growing flowers, drifting leaves' },
  electric: { icon: '⚡', name: 'Lightning arcs', prompt: 'Electric creature card, tiny lightning arcs, bright sparks' },
  ice: { icon: '❄️', name: 'Falling snowflakes', prompt: 'Ice creature card, falling snowflakes, frosty glints' },
  wind: { icon: '🌪️', name: 'Swirling gusts', prompt: 'Wind creature card, swirling gusts, floating feathers' },
  earth: { icon: '🪨', name: 'Floating rocks', prompt: 'Earth creature card, floating rocks, warm dust motes' },
  poison: { icon: '☠️', name: 'Toxic bubbles', prompt: 'Poison creature card, toxic bubbles, eerie green mist' },
  metal: { icon: '⚙️', name: 'Rotating gears', prompt: 'Metal creature card, rotating gears, polished glints' },
  crystal: { icon: '💎', name: 'Spinning shards', prompt: 'Crystal creature card, spinning shards, prism light' },
  light: { icon: '☀️', name: 'Golden rays', prompt: 'Light creature card, golden rays, floating halo sparks' },
  shadow: { icon: '🌑', name: 'Moving dark mist', prompt: 'Shadow creature card, moving dark mist, violet wisps' },
};

Object.entries(RARITY_FRAME_META).forEach(([key, meta]) => {
  const style = RARITY_TIER_STYLES[key];
  if (!style) return;
  style.frameTheme = meta.theme;
  style.frameGlow = meta.glow;
  style.framePrompt = meta.prompt;
});

Object.entries(RARITY_FRAME_ANIMATIONS).forEach(([key, animation]) => {
  const style = RARITY_TIER_STYLES[key];
  if (!style) return;
  style.frameAnimationStyle = animation.style;
  style.frameAnimationSpeed = animation.speed;
  style.frameAnimationSpecial = animation.special;
  style.frameAnimationPrompt = animation.prompt;
});

Object.entries(RARITY_SUMMON_ANIMATIONS).forEach(([key, animation]) => {
  const style = RARITY_TIER_STYLES[key];
  if (!style) return;
  style.summonSequence = animation.sequence;
  style.summonPrompt = animation.prompt;
});

Object.entries(RARITY_IDLE_ANIMATIONS).forEach(([key, animation]) => {
  const style = RARITY_TIER_STYLES[key];
  if (!style) return;
  style.idleStyle = animation.style;
  style.idlePrompt = animation.prompt;
});

Object.entries(RARITY_IDLE_BACKGROUNDS).forEach(([key, background]) => {
  const style = RARITY_TIER_STYLES[key];
  if (!style) return;
  style.idleBackground = background.style;
  style.idleBackgroundPrompt = background.prompt;
});

/* Keep the extra legacy tiers usable with the same frame and animation API. */
Object.values(RARITY_TIER_STYLES).forEach((style) => {
  if (!style.framePrompt) {
    style.frameTheme = 'Legacy Radiance';
    style.frameGlow = style.color;
    style.framePrompt = `Fantasy RPG creature card frame, ${style.name.toLowerCase()} rarity, ${style.color} border, ${style.effects.join(', ')}, premium collectible monster game UI, highly detailed, transparent background`;
  }
  if (!style.frameAnimationPrompt) {
    style.frameAnimationStyle = 'Legacy radiance pulse, soft sparkles, gentle glow';
    style.frameAnimationSpeed = 'Looping';
    style.frameAnimationSpecial = 'Legacy aura pulse';
    style.frameAnimationPrompt = `Animated ${style.name.toLowerCase()} legacy frame, ${style.color} border, soft sparkles and a gentle rarity pulse, premium collectible monster game UI, smooth looping animation, transparent background`;
  }
});

/* Elemental frame briefs. Aliases cover the legacy type IDs used by the
   sprite, egg and hybrid data. */
const ELEMENT_FRAME_ANIMATIONS = {
  fire: {
    name: 'Fire', icon: '🔥', aliases: ['fire', 'ember'], effect: 'Living fire, embers and volcanic glow',
    prompt: 'Fire elemental frame animation, molten orange border, animated flames licking upward, ember particles drifting, volcanic glow, fantasy RPG creature card frame, transparent background',
  },
  water: {
    name: 'Water', icon: '💧', aliases: ['water', 'tide'], effect: 'Continuous water movement, waves and rising bubbles',
    prompt: 'Water elemental frame animation, flowing aqua border, moving waves, bubbles rising, shimmering water reflections, magical ocean energy, transparent background',
  },
  nature: {
    name: 'Nature', icon: '🌿', aliases: ['nature', 'bloom'], effect: 'Vines grow and retract, flowers bloom',
    prompt: 'Nature elemental frame animation, glowing vines growing around border, flowers blooming, floating pollen particles, magical forest energy, transparent background',
  },
  electric: {
    name: 'Electric', icon: '⚡', aliases: ['electric', 'volt', 'puffle_volt'], effect: 'Random lightning strikes and plasma bursts',
    prompt: 'Electric elemental frame animation, lightning bolts traveling around frame edges, glowing yellow energy arcs, sparks and plasma bursts, premium fantasy game UI, transparent background',
  },
  ice: {
    name: 'Ice', icon: '❄️', aliases: ['ice', 'frost'], effect: 'Frost forms and melts across the frame',
    prompt: 'Ice elemental frame animation, spreading frost patterns, crystalline snowflakes drifting, frozen energy glow, magical blizzard aura, transparent background',
  },
  wind: {
    name: 'Wind', icon: '🌪️', aliases: ['wind', 'gale', 'air'], effect: 'The border appears to float and drift',
    prompt: 'Wind elemental frame animation, swirling air currents, floating feathers, cloud wisps, magical storm breeze, fantasy RPG border, transparent background',
  },
  earth: {
    name: 'Earth', icon: '🪨', aliases: ['earth', 'stone', 'rock'], effect: 'Stone plates shift and settle',
    prompt: 'Earth elemental frame animation, moving stone plates, glowing crystal veins, dust particles, ancient mountain magic, fantasy creature frame, transparent background',
  },
  poison: {
    name: 'Poison', icon: '☠️', aliases: ['poison', 'venom', 'puffle_venom', 'slime'], effect: 'Poison bubbles rise endlessly',
    prompt: 'Poison elemental frame animation, toxic green energy, bubbling venom effects, floating spores, glowing toxins moving through frame, transparent background',
  },
  metal: {
    name: 'Metal', icon: '⚙️', aliases: ['metal', 'alloy', 'puffle_alloy', 'steel'], effect: 'Gears rotate and machinery moves',
    prompt: 'Metal elemental frame animation, rotating gears, moving mechanical pieces, polished chrome energy, glowing machinery effects, steampunk fantasy RPG frame, transparent background',
  },
  crystal: {
    name: 'Crystal', icon: '💎', aliases: ['crystal', 'puffle_crystal', 'gem'], effect: 'Crystal shards orbit the card',
    prompt: 'Crystal elemental frame animation, floating crystal shards orbiting border, rainbow gemstone reflections, magical diamond sparkles, premium fantasy game UI, transparent background',
  },
  light: {
    name: 'Light', icon: '☀️', aliases: ['light', 'radiant'], effect: 'Pulsing radiant burst',
    prompt: 'Light elemental frame animation, radiant golden beams, heavenly glow, floating divine particles, angelic energy waves, fantasy RPG frame, transparent background',
  },
  shadow: {
    name: 'Shadow', icon: '🌑', aliases: ['shadow', 'dusk'], effect: 'Shadows move independently',
    prompt: 'Shadow elemental frame animation, dark mist flowing around border, purple-black energy, glowing red runes, void particles, fantasy creature card frame, transparent background',
  },
};

/* Every Sprite Puffle family carries its own hidden style id as its element, and
   that id is what a saved creature holds. Without an alias a family resolved no
   frame animation, no idle animation and no ability path at all, so each one is
   pointed at the canonical element its puffleElement names. */
const SPRITE_FAMILY_ELEMENT_ALIASES = {
  sp_sprite: 'wind', sp_blossom: 'nature', sp_frost: 'ice', sp_sunbeam: 'light',
  sp_moonmist: 'shadow', sp_forest: 'nature', sp_bubble: 'water', sp_storm: 'electric',
  sp_dream: 'shadow', sp_rainbow: 'crystal', sp_ancient: 'light', sp_minimiku: 'electric',
  sp_squiplash: 'water', sp_siroscar: 'water', sp_zee: 'shadow', sp_aries: 'fire',
  sp_taurus: 'earth', sp_gemini: 'wind', sp_cancer: 'water', sp_leo: 'fire',
  sp_virgo: 'earth', sp_libra: 'wind', sp_scorpio: 'water', sp_sagittarius: 'fire',
  sp_capricorn: 'earth', sp_aquarius: 'wind', sp_pisces: 'water', sp_hedgehog: 'earth',
  sp_griffin: 'wind', sp_dragon: 'fire', sp_basilisk: 'earth', sp_unicorn: 'light',
  sp_kitsune: 'shadow', sp_phoenix: 'fire', sp_fenrir: 'ice', sp_kirin: 'shadow',
  sp_leviathan: 'water', sp_seraph: 'light', sp_voiddragon: 'shadow', sp_eclipse: 'light',
  sp_fire: 'fire', sp_water: 'water', sp_nature: 'nature', sp_lightning: 'electric',
  sp_ice: 'ice', sp_air: 'wind', sp_earth: 'earth', sp_light: 'light',
  sp_shadow: 'shadow', sp_crystal: 'crystal', sp_plasma: 'electric', sp_frostwave: 'ice',
  sp_bloomlight: 'nature', sp_voidcrystal: 'shadow', sp_titanroot: 'earth',
  sp_abyssal: 'water', sp_celestialprism: 'light', sp_lifeheart: 'nature',
  sp_omnitype: 'crystal',
  sp_signal: 'electric', sp_overdrive: 'crystal', sp_pulse: 'light',
  /* These five are themed rather than elemental, so the element follows the
     motif the family already carries: a gear, a lantern, a pixel, a glossy
     screen. */
  sp_admin: 'metal', sp_festival: 'light', sp_retro: 'electric',
  sp_meme: 'crystal', sp_showcase: 'crystal', sp_liluzi: 'electric',
  sp_mossmallow: 'nature', sp_honeybell: 'nature', sp_glasswing: 'crystal',
  sp_emberquill: 'fire', sp_sunmane: 'light', sp_starlace: 'shadow',
  sp_echofrost: 'ice', sp_prismscale: 'crystal', sp_cometwisp: 'wind',
  sp_crownquill: 'metal', sp_runebloom: 'earth', sp_aureate: 'light',
  sp_nebulace: 'shadow', sp_aeonpuff: 'wind', sp_cosmocrown: 'light',
  sp_godspark: 'light',
  sp_naptime: 'shadow', sp_rattle: 'wind', sp_stuffie: 'nature',
  sp_puppet: 'electric', sp_kite: 'wind', sp_marble: 'crystal',
  sp_musicbox: 'electric', sp_lullaby: 'shadow', sp_thorncrown: 'earth',
  sp_gilded: 'light', sp_obsidian: 'shadow', sp_cometkin: 'wind',
  sp_halokin: 'light', sp_everstar: 'light', sp_crownforge: 'fire',
  sp_firstword: 'crystal',
};

const ELEMENT_FRAME_ALIASES = Object.entries(ELEMENT_FRAME_ANIMATIONS).reduce((map, [key, entry]) => {
  (entry.aliases || [key]).forEach((alias) => { map[alias] = key; });
  return map;
}, {});
Object.assign(ELEMENT_FRAME_ALIASES, SPRITE_FAMILY_ELEMENT_ALIASES);

function elementFrameKey(elementKey) {
  return ELEMENT_FRAME_ALIASES[elementKey] || null;
}

function elementFrameAnimation(elementKey) {
  const key = elementFrameKey(elementKey);
  return key ? ELEMENT_FRAME_ANIMATIONS[key] : null;
}

function elementIdleAnimation(elementKey) {
  const key = elementFrameKey(elementKey);
  return key ? ELEMENT_IDLE_ANIMATIONS[key] : null;
}

const EVOLUTION_STAGE_ANIMATIONS = {
  1: {
    from: 'Baby', to: 'Teen', animation: 'Creature jumps, elemental particles appear, size increases',
    prompt: 'Cute fantasy creature evolution animation, magical energy surrounding creature, glowing elemental particles, smooth transformation into stronger form, mobile game evolution scene',
  },
  2: {
    from: 'Teen', to: 'Adult', animation: 'Aura expands, new markings appear, element powers awaken',
    prompt: 'Fantasy creature evolution, glowing elemental aura expansion, magical markings forming across body, premium RPG creature transformation sequence',
  },
  3: {
    from: 'Adult', to: 'Elite', animation: 'Wings, armor, crystals or crowns form while the camera rotates',
    prompt: 'Elite fantasy creature evolution, powerful magical transformation, glowing armor materializing, fantasy RPG upgrade cinematic, detailed elemental energy effects',
  },
  4: {
    from: 'Elite', to: 'Ancient', animation: 'Ancient runes emerge, the environment changes, legendary power awakens',
    prompt: 'Ancient creature evolution cinematic, floating runes, legendary power awakening, magical transformation sequence, premium creature collection RPG animation',
  },
  5: {
    from: 'Ancient', to: 'Ascended', animation: 'Reality bends, elemental rings orbit, celestial wings emerge',
    prompt: 'Ascended fantasy creature evolution, celestial wings manifesting, divine energy explosion, reality bending magical transformation, ultimate creature evolution cinematic, ultra detailed',
  },
};

const EVOLUTION_STAGE_STEP = {
  baby: 1, juvenile: 1, sprite: 2, youngadult: 2, midadult: 3, highadult: 3, elder: 4, ancient: 4, sensei: 5,
};

function evolutionStageAnimationFor(stage) {
  const step = EVOLUTION_STAGE_STEP[stage];
  return step ? { ...EVOLUTION_STAGE_ANIMATIONS[step], step } : null;
}

const ASCENDED_FRAME_STYLE = {
  theme: 'Ascended Evolution',
  glow: '#FFF4C4',
  gradient: 'conic-gradient(from 0deg, #FFF4C4, #FFD166, #FF8FD6, #8B7BFF, #6FD6FF, #FFF4C4)',
  prompt: 'Ascended evolution showcase frame, massive ornate fantasy border, celestial wings extending from card, floating rarity crown, magical energy streams, premium creature evolution screen, legendary mobile game UI, dazzling effects, ultra detailed, transparent background, no empty space',
};
const ASCENDED_FRAME_ANIMATION_PROMPT = 'Ascended evolution frame animation, ornate gold and rainbow border breathing with light, celestial wings flexing, floating crown rotating, magical energy streams moving upward, constellation particles, premium creature evolution screen, legendary mobile game UI, dazzling looping effects, ultra detailed, transparent background';

window.RARITY_TIER_STYLES = RARITY_TIER_STYLES;
window.ASCENDED_FRAME_STYLE = ASCENDED_FRAME_STYLE;
window.ASCENDED_FRAME_PROMPT = ASCENDED_FRAME_STYLE.prompt;
window.ASCENDED_FRAME_ANIMATION_PROMPT = ASCENDED_FRAME_ANIMATION_PROMPT;
window.ELEMENT_FRAME_ANIMATIONS = ELEMENT_FRAME_ANIMATIONS;
window.ELEMENT_FRAME_ALIASES = ELEMENT_FRAME_ALIASES;
window.elementFrameKey = elementFrameKey;
window.elementFrameAnimation = elementFrameAnimation;
window.elementIdleAnimation = elementIdleAnimation;
window.RARITY_SUMMON_ANIMATIONS = RARITY_SUMMON_ANIMATIONS;
window.RARITY_IDLE_ANIMATIONS = RARITY_IDLE_ANIMATIONS;
window.RARITY_IDLE_BACKGROUNDS = RARITY_IDLE_BACKGROUNDS;
window.ELEMENT_IDLE_ANIMATIONS = ELEMENT_IDLE_ANIMATIONS;
window.EVOLUTION_STAGE_ANIMATIONS = EVOLUTION_STAGE_ANIMATIONS;
window.EVOLUTION_STAGE_STEP = EVOLUTION_STAGE_STEP;
window.evolutionStageAnimationFor = evolutionStageAnimationFor;
