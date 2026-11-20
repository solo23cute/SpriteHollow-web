/* Hybrid rarity ladder: hybrids carry their own collectible tier progression.
   Five elemental pairs have six-stage lines from Common to Divine. Secret,
   Celestial, and Creator fusions are catalogued as special forms. */

const HYBRID_RARITY_TIERS = [
  { key: 'common', name: 'Common Hybrid', short: 'Common', icon: '🟢', color: '#5ee0a0', stars: 1, blurb: 'Simple elemental mixes with minor traits from both elements.' },
  { key: 'rare', name: 'Rare Hybrid', short: 'Rare', icon: '🔵', color: '#4c8dff', stars: 2, blurb: 'Balanced elemental fusion with stronger abilities.' },
  { key: 'epic', name: 'Epic Hybrid', short: 'Epic', icon: '🟣', color: '#a46bff', stars: 3, blurb: 'The elements merge into unique blended powers.' },
  { key: 'legendary', name: 'Legendary Hybrid', short: 'Legendary', icon: '🟠', color: '#ffab5e', stars: 4, blurb: 'Rare elemental guardians that protect Sprite Hollow.' },
  { key: 'mythic', name: 'Mythic Hybrid', short: 'Mythic', icon: '🔴', color: '#ff6fa8', stars: 5, blurb: 'Ancient rulers embodying two powerful elements.' },
  { key: 'divine', name: 'Divine Hybrid', short: 'Divine', icon: '✨', color: '#ffe08a', stars: 6, blurb: 'Perfect elemental fusion with celestial wings and halos.' },
  { key: 'secret', name: 'Secret Hybrid', short: 'Secret', icon: '🌈', color: '#8fe3ff', stars: 7, blurb: 'Ultra-rare combinations unlocked through special breeding or events.' },
  { key: 'celestial', name: 'Celestial Hybrid', short: 'Celestial', icon: '🌌', color: '#b18cff', stars: 8, blurb: 'Three-element fusions with animated constellation particles.' },
  { key: 'creator', name: 'Creator Hybrid', short: 'Creator', icon: '👑', color: '#f4f1ff', stars: 9, blurb: 'Origin-tier beings that hold every element at once.' },
];

HYBRID_RARITY_TIERS.forEach((tier) => {
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[tier.key] : null;
  if (!style) return;
  tier.color = style.color;
  tier.gradient = style.gradient;
  tier.glow = style.glow;
  tier.frameTheme = style.frameTheme;
  tier.frameGlow = style.frameGlow;
  tier.framePrompt = style.framePrompt;
});

const HYBRID_RARITY_BY_KEY = HYBRID_RARITY_TIERS.reduce((map, tier) => {
  map[tier.key] = tier;
  return map;
}, {});

const HYBRID_TIER_WEIGHTS = {
  common: 54, rare: 24, epic: 11, legendary: 6, mythic: 3.5, divine: 1.5,
};

const HYBRID_LINES = [
  {
    id: 'fire-earth', pair: ['earth', 'fire'], parents: ['Fire', 'Earth'],
    stages: [
      ['Emberstone Puffle', 'common', 'Small dual-colored aura, one earth and one fire trait, and a basic hybrid emblem.'],
      ['Lava Puffle', 'rare', 'Enhanced elemental markings, floating hybrid particles, and a dual-element crest.'],
      ['Magma Puffle', 'epic', 'Blended molten rock effects, heat shimmer, and an epic rarity glow.'],
      ['Volcano Puffle', 'legendary', 'Massive crown, volcanic elemental armor, and legendary aura rings.'],
      ['Caldera Puffle', 'mythic', 'Floating elemental islands, ancient runes, and a mythic particle storm.'],
      ['Worldforge Puffle', 'divine', 'Celestial wings, a cosmic elemental halo, and a divine rarity frame.'],
    ],
  },
  {
    id: 'water-ice', pair: ['frost', 'tide'], parents: ['Water', 'Ice'],
    stages: [
      ['Snowdrop Puffle', 'common', 'A tiny frozen droplet aura, one water trait and one ice trait, and a simple hybrid emblem.'],
      ['Chillwave Puffle', 'rare', 'Frosted wave markings, floating ice particles, and a dual-element crest.'],
      ['Frosttide Puffle', 'epic', 'Blended tide and blizzard effects with an epic rarity glow.'],
      ['Glacierwave Puffle', 'legendary', 'A frozen crown, ice armor, and sweeping legendary aura rings.'],
      ['Polar King Puffle', 'mythic', 'Floating ice islands, ancient runes, and a mythic snowstorm.'],
      ['Eternal Tide Puffle', 'divine', 'Celestial ice wings, a cosmic tide halo, and a divine rarity frame.'],
    ],
  },
  {
    id: 'electric-wind', pair: ['gale', 'volt'], parents: ['Electric', 'Wind'],
    stages: [
      ['Static Breeze Puffle', 'common', 'A small crackling breeze, one electric trait and one wind trait, and a basic hybrid emblem.'],
      ['Thunder Gust Puffle', 'rare', 'Charged wind markings, floating spark particles, and a dual-element crest.'],
      ['Tempest Puffle', 'epic', 'A blended storm aura, lightning gusts, and an epic rarity glow.'],
      ['Cyclostorm Puffle', 'legendary', 'A storm crown, wind armor, and legendary aura rings.'],
      ['Skybreaker Puffle', 'mythic', 'Floating storm islands, ancient runes, and a mythic lightning tempest.'],
      ['Tempest God Puffle', 'divine', 'Celestial storm wings, a cosmic thunder halo, and a divine rarity frame.'],
    ],
  },
  {
    id: 'nature-light', pair: ['bloom', 'radiant'], parents: ['Nature', 'Light'],
    stages: [
      ['Glowseed Puffle', 'common', 'A tiny glowing seed, one nature trait and one light trait, and a basic hybrid emblem.'],
      ['Dawnpetal Puffle', 'rare', 'Sunlit petals, floating pollen sparkles, and a dual-element crest.'],
      ['Sunbloom Puffle', 'epic', 'Blended flower and sunlight effects with an epic rarity glow.'],
      ['Radiant Grove Puffle', 'legendary', 'A living flower crown, radiant bark armor, and legendary aura rings.'],
      ['Solstice King Puffle', 'mythic', 'Floating garden islands, ancient runes, and a mythic light bloom.'],
      ['Worldlight Puffle', 'divine', 'Celestial leaf wings, a cosmic sun halo, and a divine rarity frame.'],
    ],
  },
  {
    id: 'crystal-metal', pair: ['puffle_crystal', 'puffle_alloy'], parents: ['Crystal', 'Metal'],
    stages: [
      ['Gemgear Puffle', 'common', 'A small gem-and-gear aura, one crystal trait and one metal trait, and a basic hybrid emblem.'],
      ['Steel Quartz Puffle', 'rare', 'Faceted metal markings, floating crystal dust, and a dual-element crest.'],
      ['Alloy Crystal Puffle', 'epic', 'Blended prism beams and magnetic effects with an epic rarity glow.'],
      ['Titanium Gemlord Puffle', 'legendary', 'A gemstone crown, alloy armor, and legendary aura rings.'],
      ['Forge Emperor Puffle', 'mythic', 'Floating forge islands, ancient runes, and a mythic crystal storm.'],
      ['Celestial Forge Monarch Puffle', 'divine', 'Celestial metal wings, a cosmic gem halo, and a divine rarity frame.'],
    ],
  },
];

const HYBRID_SPECIALS = [
  { key: 'eclipse', name: 'Eclipse Puffle', tier: 'secret', parents: ['Light', 'Shadow'], pair: ['radiant', 'shadow'], look: 'Gold and black cosmic wings with a solar eclipse halo.' },
  { key: 'stormfire', name: 'Stormfire Puffle', tier: 'secret', parents: ['Fire', 'Electric'], pair: ['fire', 'puffle_volt'], look: 'Plasma flames wrapped in lightning armor.' },
  { key: 'bloomtide', name: 'Bloomtide Puffle', tier: 'secret', parents: ['Nature', 'Water'], pair: ['bloom', 'water'], look: 'Coral flowers and living ocean vines.' },
  { key: 'ironroot', name: 'Ironroot Puffle', tier: 'secret', parents: ['Metal', 'Nature'], pair: ['puffle_alloy', 'puffle_bloom'], look: 'A mechanical tree guardian with crystal wood armor.' },
  { key: 'venomfrost', name: 'Venomfrost Puffle', tier: 'secret', parents: ['Poison', 'Ice'], pair: ['puffle_venom', 'ice'], look: 'Toxic snowstorms and frozen venom crystals.' },
  { key: 'nova', name: 'Nova Puffle', tier: 'celestial', parents: ['Fire', 'Light', 'Electric'], parts: ['ember', 'radiant', 'puffle_volt'], look: 'Triple-element stellar flare with a celestial rarity border and constellation particles.' },
  { key: 'tempest-bloom', name: 'Tempest Bloom Puffle', tier: 'celestial', parents: ['Wind', 'Nature', 'Water'], parts: ['gale', 'bloom', 'water'], look: 'A living storm garden with rain-petal wings and constellation particles.' },
  { key: 'eclipse-crystal', name: 'Eclipse Crystal Puffle', tier: 'celestial', parents: ['Shadow', 'Light', 'Crystal'], parts: ['dusk', 'radiant', 'crystal'], look: 'A black-and-white prism halo with animated eclipse facets.' },
  { key: 'forge-titan', name: 'Forge Titan Puffle', tier: 'celestial', parents: ['Metal', 'Earth', 'Fire'], parts: ['puffle_alloy', 'earth', 'fire'], look: 'A walking celestial foundry with molten stone armor.' },
  { key: 'toxic-abyss', name: 'Toxic Abyss Puffle', tier: 'celestial', parents: ['Poison', 'Shadow', 'Water'], parts: ['dusk', 'tide', 'venom'], look: 'A deep-sea toxic nebula with bioluminescent venom currents.' },
  {
    key: 'origin-nexus', name: 'Origin Nexus Puffle', tier: 'creator',
    parents: ['Fire', 'Water', 'Nature', 'Electric', 'Ice', 'Wind', 'Earth', 'Poison', 'Metal', 'Crystal', 'Light', 'Shadow'],
    parts: ['crystal', 'dusk', 'radiant'],
    look: 'Galaxy fur, rainbow crystal wings, floating elemental crowns, constellation eyes, orbiting elemental spirits, and a reality-shaping aura.',
    prompt: 'Origin Nexus Puffle, ultimate Sprite Hollow creator creature, combines Fire, Water, Nature, Electric, Ice, Wind, Earth, Poison, Metal, Crystal, Light and Shadow powers, enormous rainbow crystal wings, galaxy fur, constellation eyes, floating elemental crowns, cosmic aura, celestial guardian, legendary fantasy mascot, collectible RPG creature, Disney-Pixar-inspired style, magical lighting, highly detailed fur, vibrant colors, premium mobile game artwork, 8K, no empty space.',
  },
];

/* Split borders for two-element hybrids; three-element forms use their tier gradient. */
const HYBRID_SPLIT_GRADIENTS = {
  'Earth+Fire': 'linear-gradient(135deg, #8B5A2B, #FF7A2E)',
  'Ice+Water': 'linear-gradient(135deg, #9BE8FF, #1467C8)',
  'Electric+Wind': 'linear-gradient(135deg, #FFE45C, #6DC8FF)',
  'Light+Nature': 'linear-gradient(135deg, #7BE08A, #FFD166)',
  'Crystal+Metal': 'linear-gradient(135deg, #D9E2EC, #B18CFF, #6FFFE0)',
  'Light+Shadow': 'linear-gradient(135deg, #FFE58A, #4B2A6B)',
  'Electric+Fire': 'linear-gradient(135deg, #FFB62E, #FF4B5C)',
  'Nature+Water': 'linear-gradient(135deg, #42D97C, #2ED9D0)',
  'Metal+Nature': 'linear-gradient(135deg, #AEB8C2, #42D97C)',
  'Ice+Poison': 'linear-gradient(135deg, #9BE8FF, #8BFF6A)',
  'Shadow+Poison': 'linear-gradient(135deg, #4B2A6B, #8BFF6A)',
  'Fire+Water': 'linear-gradient(135deg, #FF4B4B, #3E89FF)',
};

/* Screen and toon hybrids fuse two shows rather than two classic elements, so
   their cards carry their own split frame instead of the generic hybrid rail:
   the two parent palettes meet on a hard 50/50 seam under a round fluff halo,
   which keeps the puffle reading as one soft circle on the card. */
const HYBRID_SPLIT_WAVE_SOURCES = [
  { wave: 'screen', source: () => (typeof SCREEN_WAVE_SPECIES !== 'undefined' ? SCREEN_WAVE_SPECIES : null) },
  { wave: 'toon', source: () => (typeof TOON_DRAMA_SPECIES !== 'undefined' ? TOON_DRAMA_SPECIES : null) },
  { wave: 'toon', source: () => (typeof RETRO_SPECIES !== 'undefined' ? RETRO_SPECIES : null) },
];

function hybridSplitFrame(sprite) {
  const parents = sprite && Array.isArray(sprite.hybridParents) ? sprite.hybridParents : null;
  if (!parents || parents.length !== 2) return null;
  const wave = HYBRID_SPLIT_WAVE_SOURCES.find((entry) => {
    const source = entry.source();
    return !!source && parents.some((key) => !!source[key]);
  });
  if (!wave) return null;
  const colors = parents.map((key) => {
    const el = typeof ELEMENTS !== 'undefined' ? ELEMENTS[key] : null;
    return el ? (el.primary || el.accent || el.light || null) : null;
  });
  if (!colors[0] || !colors[1]) return null;
  return { wave: wave.wave, a: colors[0], b: colors[1] };
}

/* Split-element frame briefs for the two-element hybrid cards. */
const HYBRID_FRAME_PROMPT = 'Hybrid rarity fantasy creature frame, split elemental border, dual energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background';
const HYBRID_FRAME_EXAMPLES = {
  'Fire + Water': {
    gradient: HYBRID_SPLIT_GRADIENTS['Fire+Water'],
    prompt: 'Hybrid rarity fantasy creature frame, split lava red and ocean blue border, dual fire and water energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
  'Electric + Wind': {
    gradient: HYBRID_SPLIT_GRADIENTS['Electric+Wind'],
    prompt: 'Hybrid rarity fantasy creature frame, split lightning yellow and sky blue border, dual electric and wind energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
  'Nature + Light': {
    gradient: HYBRID_SPLIT_GRADIENTS['Light+Nature'],
    prompt: 'Hybrid rarity fantasy creature frame, split emerald and gold border, dual nature and light energy effects, glowing leaf and sun symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
  'Shadow + Poison': {
    gradient: HYBRID_SPLIT_GRADIENTS['Shadow+Poison'],
    prompt: 'Hybrid rarity fantasy creature frame, split dark purple and toxic green border, dual shadow and poison energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
  'Earth + Fire': {
    gradient: HYBRID_SPLIT_GRADIENTS['Earth+Fire'],
    prompt: 'Hybrid rarity fantasy creature frame, split stone brown and molten orange border, dual earth and fire energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
  'Metal + Crystal': {
    gradient: HYBRID_SPLIT_GRADIENTS['Crystal+Metal'],
    prompt: 'Hybrid rarity fantasy creature frame, split silver chrome and rainbow diamond border, dual metal and crystal energy effects, glowing elemental symbols in corners, premium mobile RPG UI, magical fusion aura, highly detailed, transparent background',
  },
};

const HYBRID_FRAME_ANIMATION_PROMPT = 'Hybrid elemental fantasy frame animation, dual-element energy effects, split-color border, animated fusion particles, magical power collision effects, rotating elemental symbols, premium collectible creature card frame, transparent background, highly detailed';
const HYBRID_FRAME_ANIMATION_EXAMPLES = {
  Stormfire: { effect: 'Plasma lightning flames', prompt: 'Hybrid frame animation, Stormfire plasma lightning flames, split electric yellow and fire orange border, colliding storm and flame particles, rotating elemental symbols, premium collectible card frame, transparent background' },
  Frosttide: { effect: 'Frozen waves', prompt: 'Hybrid frame animation, Frosttide frozen waves, split ice blue and ocean teal border, drifting snow and rising bubbles, rotating elemental symbols, premium collectible card frame, transparent background' },
  Sunbloom: { effect: 'Glowing flowers and sunlight', prompt: 'Hybrid frame animation, Sunbloom glowing flowers and sunlight, split emerald and gold border, blooming petals and radiant motes, rotating elemental symbols, premium collectible card frame, transparent background' },
  Venomshade: { effect: 'Toxic shadow mist', prompt: 'Hybrid frame animation, Venomshade toxic shadow mist, split dark purple and toxic green border, creeping shadow vapor and venom bubbles, rotating elemental symbols, premium collectible card frame, transparent background' },
  Forgecrystal: { effect: 'Rotating crystal gears', prompt: 'Hybrid frame animation, Forgecrystal rotating crystal gears, split chrome and rainbow diamond border, mechanical gears and prism shards, rotating elemental symbols, premium collectible card frame, transparent background' },
};

const hybridSlug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const HYBRID_SPECIES = [];
const HYBRID_LINES_BY_PAIR = {};

HYBRID_LINES.forEach((line) => {
  const key = pairKey(line.pair[0], line.pair[1]);
  const stages = line.stages.map(([name, tier, look]) => ({
    key: `hy_${hybridSlug(name)}`,
    name,
    tier,
    parents: line.parents,
    pair: key,
    line: line.id,
    look,
    breedable: true,
  }));
  HYBRID_LINES_BY_PAIR[key] = stages;
  HYBRID_SPECIES.push(...stages);
});

HYBRID_SPECIALS.forEach((entry) => {
  HYBRID_SPECIES.push({
    ...entry,
    key: `hy_${entry.key}`,
    pair: entry.pair ? pairKey(entry.pair[0], entry.pair[1]) : null,
    breedable: false,
  });
});

const HYBRID_BY_NAME = HYBRID_SPECIES.reduce((map, entry) => {
  map[entry.name] = entry;
  return map;
}, {});

const HYBRID_BY_KEY = HYBRID_SPECIES.reduce((map, entry) => {
  map[entry.key] = entry;
  return map;
}, {});

const HYBRID_SECRETS_BY_PAIR = HYBRID_SPECIES.reduce((map, entry) => {
  if (entry.tier === 'secret' && entry.pair) map[entry.pair] = entry;
  return map;
}, {});

/* The five elemental lines use their Common form as the live pair name. */
if (typeof HYBRID_NAMES !== 'undefined') {
  Object.entries(HYBRID_LINES_BY_PAIR).forEach(([key, stages]) => {
    if (stages[0]) HYBRID_NAMES[key] = stages[0].name;
  });
}

/* Celestial fusions join the existing three-parent tribrid recipes. */
if (typeof TRIBRID_RECIPES !== 'undefined' && typeof TRIBRID_NAMES !== 'undefined' && typeof TRIBRID_BY_KEY !== 'undefined') {
  HYBRID_SPECIALS.filter((entry) => (entry.tier === 'celestial' || entry.tier === 'creator') && Array.isArray(entry.parts)).forEach((entry) => {
    const parts = [...entry.parts].sort();
    const key = parts.join('+');
    TRIBRID_RECIPES.push({ parts, name: entry.name });
    TRIBRID_NAMES[key] = entry.name;
    TRIBRID_BY_KEY[key] = { name: entry.name, parents: parts, rarity: entry.tier };
  });
}

window.hybridRarityFor = function hybridRarityFor(name) {
  const species = HYBRID_BY_NAME[name];
  if (!species) return null;
  return { species, tier: HYBRID_RARITY_BY_KEY[species.tier] };
};

window.hybridRollFor = function hybridRollFor(a, b) {
  const key = pairKey(a, b);
  const secret = HYBRID_SECRETS_BY_PAIR[key];
  const merges = typeof state !== 'undefined' && state.stats ? state.stats.merges || 0 : 0;
  if (secret && Math.random() < Math.min(0.12, 0.02 + merges * 0.002)) return secret.name;
  const line = HYBRID_LINES_BY_PAIR[key];
  if (!line || !line.length) return hybridFor(a, b);
  const luck = Math.min(0.16, merges * 0.003);
  const weights = {
    common: Math.max(0, 54 - luck * 40),
    rare: 24,
    epic: 11 + luck * 15,
    legendary: 6 + luck * 12,
    mythic: 3.5 + luck * 8,
    divine: 1.5 + luck * 5,
  };
  let total = 0;
  const rows = line.map((entry) => {
    const weight = weights[entry.tier] || 0;
    total += weight;
    return { entry, weight };
  });
  let roll = Math.random() * total;
  for (const row of rows) {
    roll -= row.weight;
    if (roll <= 0) return row.entry.name;
  }
  return line[0].name;
};

function hybridRaritySectionHTML() {
  const tierCards = HYBRID_RARITY_TIERS.map((tier) => `<div class="hybrid-rarity-tier" title="${esc(tier.framePrompt || '')}" style="--hybrid:${tier.color};--hybrid-gradient:${tier.gradient || tier.color};--hybrid-glow:${tier.frameGlow || tier.color}">
    <div class="between" style="gap:6px"><b>${tier.icon} ${tier.name}</b><span class="tiny muted">${'★'.repeat(tier.stars)}</span></div>
    <p>${tier.blurb}</p>
  </div>`).join('');
  const cards = HYBRID_SPECIES.map((entry) => {
    const tier = HYBRID_RARITY_BY_KEY[entry.tier];
    const split = entry.parents.length === 2 ? HYBRID_SPLIT_GRADIENTS[[...entry.parents].sort().join('+')] : null;
    const tag = entry.breedable ? 'Breedable line' : entry.tier === 'creator' ? 'Creator fusion' : 'Special fusion';
    return `<article class="hybrid-rarity-card" style="--hybrid:${tier.color};--hybrid-gradient:${tier.gradient || tier.color};--hybrid-glow:${tier.frameGlow || tier.color};--hybrid-split:${split || tier.gradient || tier.color}">
      <div class="between" style="gap:6px;align-items:flex-start"><b>${entry.name}</b><span class="hybrid-rarity-chip" style="border-color:${tier.color};color:${tier.color}">${tier.icon} ${tier.short}</span></div>
      <p>${entry.look}</p>
      <span class="tiny muted">${entry.parents.join(' + ')} · ${tag}</span>
      ${entry.prompt ? `<details class="hybrid-rarity-prompt"><summary>Creator prompt</summary><p>${entry.prompt}</p></details>` : ''}
    </article>`;
  }).join('');
  return `<details class="hybrid-rarity-section">
    <summary><span>🌈 Hybrid rarity ladder</span><span>${HYBRID_RARITY_TIERS.length} tiers · ${HYBRID_SPECIES.length} forms</span></summary>
    <p class="tiny muted" style="margin:8px 0 10px;line-height:1.5">Hybrids now have their own Common → Creator progression. The five elemental lines can roll a higher tier during a merge; Secret, Celestial, and Creator forms are special fusions.</p>
    <details class="hybrid-rarity-prompt"><summary>🔥💧 Hybrid frame prompt</summary><p>${esc(HYBRID_FRAME_PROMPT)}</p></details>
    <details class="hybrid-rarity-prompt"><summary>✨ Hybrid animation prompt</summary><p>${esc(HYBRID_FRAME_ANIMATION_PROMPT)}</p></details>
    <div class="hybrid-rarity-tier-grid">${tierCards}</div>
    <div class="hybrid-rarity-grid">${cards}</div>
  </details>`;
}

window.HYBRID_RARITY_TIERS = HYBRID_RARITY_TIERS;
window.HYBRID_RARITY_BY_KEY = HYBRID_RARITY_BY_KEY;
window.HYBRID_TIER_WEIGHTS = HYBRID_TIER_WEIGHTS;
window.HYBRID_SPECIES = HYBRID_SPECIES;
window.HYBRID_LINES_BY_PAIR = HYBRID_LINES_BY_PAIR;
window.HYBRID_SECRETS_BY_PAIR = HYBRID_SECRETS_BY_PAIR;
window.HYBRID_SPLIT_GRADIENTS = HYBRID_SPLIT_GRADIENTS;
window.HYBRID_FRAME_PROMPT = HYBRID_FRAME_PROMPT;
window.HYBRID_FRAME_EXAMPLES = HYBRID_FRAME_EXAMPLES;
window.HYBRID_FRAME_ANIMATION_PROMPT = HYBRID_FRAME_ANIMATION_PROMPT;
window.HYBRID_FRAME_ANIMATION_EXAMPLES = HYBRID_FRAME_ANIMATION_EXAMPLES;
window.HYBRID_BY_NAME = HYBRID_BY_NAME;
window.HYBRID_BY_KEY = HYBRID_BY_KEY;
window.hybridRaritySectionHTML = hybridRaritySectionHTML;
