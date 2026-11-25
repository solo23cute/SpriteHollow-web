/* Sprite Hollow rarity framework.

   Twelve tiers, one badge each, with the four named evolution forms of every
   family placed somewhere on the ladder. The tiers are the archive's own scale
   (Common through Creator) and are separate from the puffle *style* tiers
   in lumi-palettes.js: those group cosmetics, these rank creatures.

   Each chain reads its own four-step ladder (baby -> advanced -> ascended ->
   legendary ascension), falling back to its family's default. */

const PUFFLE_RARITY_TIERS = [
  { key: 'common', name: 'Common', stars: 1, icon: '◇', badge: 'Silver Crystal', chance: 60, color: '#B9C6D4', blurb: 'Small beginner Puffle: simple elemental features, no wings.' },
  { key: 'uncommon', name: 'Uncommon', stars: 2, icon: '◆', badge: 'Emerald Gem', chance: 25, color: '#46C46E', blurb: 'More developed elemental look with a little extra magic.' },
  { key: 'rare', name: 'Rare', stars: 3, icon: '💎', badge: 'Sapphire Crystal', chance: 10, color: '#4C8DFF', blurb: 'Crystal formations, elemental armour, floating effects.' },
  { key: 'epic', name: 'Epic', stars: 4, icon: '👑', badge: 'Arcane Crown', chance: 4, color: '#A46BFF', blurb: 'Large transformations, floating magic circles, stacked effects.' },
  { key: 'legendary', name: 'Legendary', stars: 5, icon: '⭐', badge: 'Golden Star', chance: 0.9, color: '#FFC94D', blurb: 'Massive wings, crowns, divine armour, advanced particles.' },
  { key: 'mythic', name: 'Mythic', stars: 6, icon: '✨', badge: 'Mythic Crest', chance: 0.09, color: '#FF6FA8', blurb: 'Celestial beings with reality-altering elemental power.' },
  { key: 'ultra', name: 'Ultra', stars: 7, icon: '🛰', badge: 'Signal Crest', chance: 0.05, color: '#B6F2FF', blurb: 'Overcharged forms that glitch between states.' },
  { key: 'secret', name: 'Secret', stars: 7, icon: '🌈', badge: 'Rainbow Crown', chance: 0.01, color: '#8FE3FF', blurb: 'Ultra-rare hidden creatures that rarely appear at all.' },
  { key: 'ultra_secret', name: 'Ultra Secret', stars: 8, icon: '👑', badge: 'Cosmic Throne', badgeAlt: 'Heart Throne', badgeAltChance: 0.15, chance: 0.001, color: '#FFE08A', blurb: 'The rulers and creators of Sprite Hollow.' },
  { key: 'ancient', name: 'Ancient', stars: 9, icon: '🌑', badge: 'Ancient Relic', chance: 0.0005, color: '#6B5C9B', blurb: 'Old-world forms carrying runes, relics, and deep elemental memory.' },
  { key: 'divine', name: 'Divine', stars: 10, icon: '💠', badge: 'Divine Halo', chance: 0.0001, color: '#FFE08A', blurb: 'Sacred armour and halo-light reserved for the hollow’s guardians.' },
  { key: 'creator', name: 'Creator', stars: 11, icon: '🌠', badge: 'Origin Crown', chance: 0.00001, color: '#F4F1FF', blurb: 'Origin-tier beings that hold every element at once.' },
];

PUFFLE_RARITY_TIERS.forEach((tier) => {
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[tier.key] : null;
  if (!style) return;
  tier.color = style.color;
  tier.gradient = style.gradient;
  tier.glow = style.glow;
  tier.effects = style.effects;
  tier.eggName = style.eggName;
  tier.frameTheme = style.frameTheme;
  tier.frameGlow = style.frameGlow;
  tier.framePrompt = style.framePrompt;
  tier.frameAnimationStyle = style.frameAnimationStyle;
  tier.frameAnimationSpeed = style.frameAnimationSpeed;
  tier.frameAnimationSpecial = style.frameAnimationSpecial;
  tier.frameAnimationPrompt = style.frameAnimationPrompt;
});

const PUFFLE_RARITY_BY_KEY = PUFFLE_RARITY_TIERS.reduce((map, tier) => {
  map[tier.key] = tier;
  return map;
}, {});

/* family -> four form rarities, in evolution order. */
const PUFFLE_FAMILY_RARITY = {
  nature: ['common', 'rare', 'epic', 'legendary'],
  fire: ['common', 'uncommon', 'rare', 'legendary'],
  ice: ['common', 'uncommon', 'rare', 'legendary'],
  electric: ['common', 'uncommon', 'rare', 'epic'],
  water: ['common', 'uncommon', 'rare', 'legendary'],
  earth: ['common', 'uncommon', 'epic', 'legendary'],
  wind: ['common', 'uncommon', 'rare', 'epic'],
  moon: ['common', 'uncommon', 'rare', 'legendary'],
  light: ['common', 'uncommon', 'rare', 'legendary'],
  shadow: ['common', 'uncommon', 'rare', 'mythic'],
  cosmic: ['rare', 'epic', 'legendary', 'mythic'],
  crystal: ['rare', 'epic', 'legendary', 'mythic'],
  music: ['common', 'rare', 'epic', 'mythic'],
  time: ['rare', 'epic', 'legendary', 'mythic'],
  spirit: ['rare', 'epic', 'legendary', 'mythic'],
  mushroom: ['common', 'uncommon', 'epic', 'legendary'],
  dragon: ['rare', 'epic', 'legendary', 'mythic'],
  rainbow: ['uncommon', 'rare', 'legendary', 'secret'],
  secret: ['secret', 'secret', 'ultra_secret', 'ultra_secret'],
};

/* Chains whose own roster climbs a different rung than its family default. */
const PUFFLE_CHAIN_RARITY = {
  pc_blossom: ['uncommon', 'rare', 'epic', 'legendary'],
  pc_bamboo: ['common', 'rare', 'epic', 'legendary'],
  pc_magma: ['common', 'uncommon', 'epic', 'legendary'],
  evo_fire_sprite: ['common', 'rare', 'legendary', 'mythic'],
  evo_snow_spirit: ['uncommon', 'rare', 'epic', 'legendary'],
  evo_lightning_sprite: ['uncommon', 'rare', 'epic', 'mythic'],
  pc_coral: ['uncommon', 'rare', 'legendary', 'mythic'],
  evo_night_sky: ['uncommon', 'rare', 'legendary', 'mythic'],
  pc_radiant: ['uncommon', 'rare', 'epic', 'legendary'],
  evo_phantom: ['uncommon', 'rare', 'legendary', 'mythic'],
  evo_comet: ['rare', 'legendary', 'mythic', 'secret'],
  pc_ruby: ['rare', 'legendary', 'mythic', 'secret'],
  evo_dj: ['common', 'rare', 'legendary', 'mythic'],
  evo_clockwork: ['rare', 'epic', 'mythic', 'secret'],
  evo_dreamwalker: ['rare', 'legendary', 'mythic', 'secret'],
  evo_fairy_spore: ['uncommon', 'rare', 'legendary', 'mythic'],
  evo_prismatic: ['rare', 'epic', 'mythic', 'secret'],
  pc_creator: ['secret', 'secret', 'ultra_secret', 'ultra_secret'],
  pc_sprite_hollow_prime: ['ultra_secret', 'ultra_secret', 'ultra_secret', 'ultra_secret'],
  pc_hollow_king: ['ultra_secret', 'ultra_secret', 'ultra_secret', 'ultra_secret'],
  pc_hollow_queen: ['ultra_secret', 'ultra_secret', 'ultra_secret', 'ultra_secret'],
  pc_cosmic_sprite_prime: ['secret', 'ultra_secret', 'ultra_secret', 'ultra_secret'],
};

window.PUFFLE_RARITY_TIERS = PUFFLE_RARITY_TIERS;
window.PUFFLE_RARITY_BY_KEY = PUFFLE_RARITY_BY_KEY;

window.puffleRarityTier = function puffleRarityTier(key) {
  return PUFFLE_RARITY_BY_KEY[key] || null;
};

/* Four rarity keys for a chain, in evolution order. */
window.puffleRarityForChain = function puffleRarityForChain(chainKey) {
  const chain = typeof window.PUFFLE_EVOLUTION_CHAINS === 'object' && window.PUFFLE_EVOLUTION_CHAINS
    ? window.PUFFLE_EVOLUTION_CHAINS[chainKey]
    : null;
  const keys = (chain && Array.isArray(chain.rarity) && chain.rarity.length)
    ? chain.rarity
    : (PUFFLE_CHAIN_RARITY[chainKey]
      || (chain && PUFFLE_FAMILY_RARITY[chain.family])
      || ['common', 'uncommon', 'rare', 'legendary']);
  const ladder = keys.map((key) => PUFFLE_RARITY_BY_KEY[key]).filter(Boolean);
  /* Five-stage chains pad with their own top rung rather than falling off. */
  const want = chain && Array.isArray(chain.stages) ? chain.stages.length : ladder.length;
  while (ladder.length && ladder.length < want) ladder.push(ladder[ladder.length - 1]);
  return ladder;
};

/* The tier a creature currently sits at, for a chip or a badge. Species that
   are not chain roots fall back to their own egg rarity rather than inheriting
   the default Common ladder. */
window.puffleRarityAt = function puffleRarityAt(chainKey, formIndex) {
  const chain = typeof window.PUFFLE_EVOLUTION_CHAINS === 'object' && window.PUFFLE_EVOLUTION_CHAINS
    ? window.PUFFLE_EVOLUTION_CHAINS[chainKey]
    : null;
  if (!chain) {
    const direct = typeof typeEggRarity === 'function' ? typeEggRarity(chainKey) : null;
    return (direct && PUFFLE_RARITY_BY_KEY[direct]) || null;
  }
  const ladder = window.puffleRarityForChain(chainKey);
  return ladder[Math.max(0, Math.min(ladder.length - 1, Number(formIndex) || 0))] || null;
};

window.puffleRarityBadge = function puffleRarityBadge(key) {
  const tier = window.puffleRarityTier(key);
  if (!tier) return '';
  return `${tier.icon} ${'★'.repeat(tier.stars)}`;
};


/* Ultra Secret rolls either badge: Cosmic Throne normally, Heart Throne on a
   15% of drops. The seed keeps a given sprite's badge stable between renders. */
window.puffleBadgeFor = function puffleBadgeFor(tierKey, seed) {
  const tier = window.puffleRarityTier(tierKey);
  if (!tier) return '';
  if (!tier.badgeAlt) return tier.badge;
  const text = String(seed == null ? '' : seed);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash % 100 < Math.round((tier.badgeAltChance || 0) * 100) ? tier.badgeAlt : tier.badge;
};
