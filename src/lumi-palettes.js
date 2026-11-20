/* Exact Sprite Puffle palettes, from assets/lumi/art/puffle-palettes.md.
   These hexes are the source of truth: the iris and every accent use them
   directly, and the body — which is baked art — is matched to the primary with
   a hue/saturation/brightness filter derived from these same colours.

   The Puffle Collection sheet sorts every puffle into a rarity tier, so each
   style carries its tier here and `LUMI_PUFFLE_TIERS` holds the tier names,
   colours and mottos printed above the sheet's columns. */

window.LUMI_PUFFLE_TIERS = {
  common:    { name: 'Common',    color: '#8FA8B8', motto: 'Every journey has a beginning' },
  /* Club Penguin's twelve classic puffle colours, kept as a colour group of
     their own so they sit together in the Studio and Collection. */
  classic:   { name: 'Classic',   color: '#4A9FF5', motto: 'Twelve familiar colours from Club Penguin' },
  uncommon:  { name: 'Uncommon',  color: '#4FD07A', motto: 'Nature grows brighter together' },
  rare:      { name: 'Rare',      color: '#4FB8FF', motto: 'Beyond the ordinary' },
  epic:      { name: 'Epic',      color: '#A66BFF', motto: 'Magic takes new forms' },
  legendary: { name: 'Legendary', color: '#FFC529', motto: 'Lights the way' },
  mythic:    { name: 'Mythic',    color: '#FF6FA8', motto: 'Born from legends' },
  secret:    { name: 'Secret',    color: '#8CE8FF', motto: 'A once in a lifetime miracle' },
  /* Filled by lumi-elements.js: one style per elemental type. */
  elemental: { name: 'Elemental', color: '#7AF0D0', motto: 'One form for every element' },
};

window.LUMI_PUFFLE_TIER_KEYS = Object.keys(window.LUMI_PUFFLE_TIERS);

window.LUMI_PUFFLE_VARIANTS = {
  common: {
    tier: 'common',
    name: 'Common Puffle', theme: 'Young forest spirit, bright spring colors, cheerful beginner companion.',
    primary: '#7FD36C', secondary: '#A6E887', belly: '#D8F7B5', ear: '#B9F19F',
    iris: '#39B54A', eyeShadow: '#1F6E2B', leaf: '#4CAF50', leafGlow: '#5FE36A', pads: '#EAAE8A',
  },
  forest_sprout: {
    tier: 'common',
    name: 'Forest Sprout Puffle', theme: 'Painted by the collection sheet: leafy green fur with a blossom in the crest.',
    primary: '#5FC24B', secondary: '#9BE07A', belly: '#DFF8BE', ear: '#B4EA8F',
    iris: '#2F8F3C', eyeShadow: '#17501F', leaf: '#3E9B33', leafGlow: '#7FE05A', pads: '#E9A57F',
  },
  cloud_puff: {
    tier: 'common',
    name: 'Cloud Puff Puffle', theme: 'Painted by the collection sheet: soft cloud-white fur with a sunlit blue eye.',
    primary: '#EAF3FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#D7E9FF',
    iris: '#6FA8E8', eyeShadow: '#2E5B8C', leaf: '#BBD8F5', leafGlow: '#EAF6FF', pads: '#F2D7DE',
  },
  /* The twelve classic Club Penguin puffle colours. These are appearance
     presets for any Sprite Puffle, not evolution forms: the matching forms keep
     their own ids (cp_blue, cp_red, ...) and diet paths. */
  cp_color_blue: {
    tier: 'classic', classic: true, colorLabel: 'Blue',
    name: 'Classic Blue Puffle', theme: 'Club Penguin classic: sky-blue fur beneath a spinning propeller cap.',
    primary: '#4A9FF5', secondary: '#A9D6FF', belly: '#E8F5FF', ear: '#A9D6FF',
    iris: '#1E5FA8', eyeShadow: '#1E5FA8', leaf: '#4A9FF5', leafGlow: '#A9D6FF', pads: '#A9D6FF', motif: 'propeller',
  },
  cp_color_red: {
    tier: 'classic', classic: true, colorLabel: 'Red',
    name: 'Classic Red Puffle', theme: 'Club Penguin classic: fearless red fur under a weathered pirate hat.',
    primary: '#E84B4B', secondary: '#FF9A8F', belly: '#FFE1D9', ear: '#FF9A8F',
    iris: '#8F1F25', eyeShadow: '#8F1F25', leaf: '#E84B4B', leafGlow: '#FF9A8F', pads: '#FF9A8F', motif: 'pirate',
  },
  cp_color_pink: {
    tier: 'classic', classic: true, colorLabel: 'Pink',
    name: 'Classic Pink Puffle', theme: 'Club Penguin classic: bright pink fur with a bouncy bow.',
    primary: '#F27FBF', secondary: '#FFC2E1', belly: '#FFF0F7', ear: '#FFC2E1',
    iris: '#9C3A6B', eyeShadow: '#9C3A6B', leaf: '#F27FBF', leafGlow: '#FFC2E1', pads: '#FFC2E1', motif: 'bow',
  },
  cp_color_black: {
    tier: 'classic', classic: true, colorLabel: 'Black',
    name: 'Classic Black Puffle', theme: 'Club Penguin classic: smoky black fur warmed by a little ember.',
    primary: '#35313A', secondary: '#6D6575', belly: '#7A7284', ear: '#6D6575', accent: '#FF9A4C',
    iris: '#FF9A4C', eyeShadow: '#17151B', leaf: '#35313A', leafGlow: '#FF9A4C', pads: '#6D6575', motif: 'flame',
  },
  cp_color_green: {
    tier: 'classic', classic: true, colorLabel: 'Green',
    name: 'Classic Green Puffle', theme: 'Club Penguin classic: spring-green fur and a lucky four-leaf crest.',
    primary: '#55C85A', secondary: '#A7EE9E', belly: '#E4FFD8', ear: '#A7EE9E',
    iris: '#1F6B2C', eyeShadow: '#1F6B2C', leaf: '#55C85A', leafGlow: '#A7EE9E', pads: '#A7EE9E', motif: 'clover',
  },
  cp_color_purple: {
    tier: 'classic', classic: true, colorLabel: 'Purple',
    name: 'Classic Purple Puffle', theme: 'Club Penguin classic: showstopping violet fur beneath a little spotlight star.',
    primary: '#A774F0', secondary: '#D4B6FF', belly: '#F1E4FF', ear: '#D4B6FF',
    iris: '#5B2E99', eyeShadow: '#5B2E99', leaf: '#A774F0', leafGlow: '#D4B6FF', pads: '#D4B6FF', motif: 'star',
  },
  cp_color_yellow: {
    tier: 'classic', classic: true, colorLabel: 'Yellow',
    name: 'Classic Yellow Puffle', theme: 'Club Penguin classic: sunny yellow fur with a painter’s beret.',
    primary: '#F4D64B', secondary: '#FFF2A6', belly: '#FFFAD8', ear: '#FFF2A6', accent: '#E86A8A',
    iris: '#947A18', eyeShadow: '#947A18', leaf: '#F4D64B', leafGlow: '#E86A8A', pads: '#FFF2A6', motif: 'beret',
  },
  cp_color_white: {
    tier: 'classic', classic: true, colorLabel: 'White',
    name: 'Classic White Puffle', theme: 'Club Penguin classic: snow-white fur touched with a frosty snowflake.',
    primary: '#F4F7FF', secondary: '#FFFFFF', belly: '#FFFFFF', ear: '#FFFFFF', accent: '#5FD8FF',
    iris: '#5FD8FF', eyeShadow: '#8B9AB8', leaf: '#F4F7FF', leafGlow: '#FFFFFF', pads: '#FFFFFF', motif: 'ice',
  },
  cp_color_orange: {
    tier: 'classic', classic: true, colorLabel: 'Orange',
    name: 'Classic Orange Puffle', theme: 'Club Penguin classic: goofy orange fur with a juicy orange-slice badge.',
    primary: '#F59A3C', secondary: '#FFCE8A', belly: '#FFF0DA', ear: '#FFCE8A',
    iris: '#A85B12', eyeShadow: '#A85B12', leaf: '#F59A3C', leafGlow: '#FFCE8A', pads: '#FFCE8A', motif: 'orange',
  },
  cp_color_brown: {
    tier: 'classic', classic: true, colorLabel: 'Brown',
    name: 'Classic Brown Puffle', theme: 'Club Penguin classic: cocoa-brown inventor fur and a pair of bright goggles.',
    primary: '#9B6B45', secondary: '#D8B089', belly: '#F1DDC7', ear: '#D8B089',
    iris: '#5D3A22', eyeShadow: '#5D3A22', leaf: '#9B6B45', leafGlow: '#D8B089', pads: '#D8B089', motif: 'goggles',
  },
  cp_color_rainbow: {
    tier: 'classic', classic: true, colorLabel: 'Rainbow',
    name: 'Classic Rainbow Puffle', theme: 'Club Penguin classic: violet fur that breaks into a full rainbow crest.',
    primary: '#B785FF', secondary: '#FFD1F0', belly: '#FFFFFF', ear: '#FFD1F0',
    bands: ['#FF6B6B', '#FFC857', '#5BD6A2', '#5B9DFF', '#B785FF'],
    iris: '#6D3AA8', eyeShadow: '#6D3AA8', leaf: '#B785FF', leafGlow: '#FFD1F0', pads: '#FFD1F0', motif: 'rainbow',
  },
  cp_color_gold: {
    tier: 'classic', classic: true, colorLabel: 'Gold',
    name: 'Classic Gold Puffle', theme: 'Club Penguin classic: lucky golden fur beneath a tiny treasure crown.',
    primary: '#F7C948', secondary: '#FFF0A8', belly: '#FFF8D6', ear: '#FFF0A8',
    iris: '#A87812', eyeShadow: '#A87812', leaf: '#F7C948', leafGlow: '#FFF0A8', pads: '#FFF0A8', motif: 'crown', gold: '#F7C948',
  },
  blossom: {
    tier: 'uncommon',
    name: 'Blossom Puffle', theme: 'Painted by the collection sheet: cherry-blossom pink fur crowned in petals.',
    primary: '#FF9ECB', secondary: '#FFC9E3', belly: '#FFF0F7', ear: '#FFD6EA',
    iris: '#E75FA5', eyeShadow: '#8C2B5F', leaf: '#F47BB8', leafGlow: '#FFC2E2', pads: '#FFD9E6',
  },
  frost: {
    tier: 'uncommon',
    name: 'Frost Puffle', theme: 'Frozen spirit of the winter woods, rime on every leaf.', derived: true,
    primary: '#A9E4FF', secondary: '#DDF4FF', belly: '#F2FBFF', ear: '#C8EEFF',
    iris: '#5FD8FF', eyeShadow: '#1F6E9B', leaf: '#8BD9F2', leafGlow: '#D6F6FF', pads: '#FFDDEB',
  },
  crystal: {
    tier: 'rare',
    name: 'Crystal Puffle', theme: 'Painted by the collection sheet: pale crystal fur with a shard crest of ice.',
    primary: '#8FE9FF', secondary: '#E6FFFF', belly: '#F7FFFF', ear: '#CFF6FF',
    iris: '#7FB8FF', eyeGlow: '#C9F4FF', leaf: '#A9E3F7', leafGlow: '#E8FFFF', pads: '#FFD9EF',
  },
  moonlight: {
    tier: 'rare',
    name: 'Moonlight Puffle', theme: 'Painted by the collection sheet: silver-lilac fur under a crescent moon.',
    primary: '#BFC9F5', secondary: '#E8EDFF', belly: '#F7F9FF', ear: '#D6DDFF',
    iris: '#8FA8FF', eyeGlow: '#C9D6FF', leaf: '#A9B6F0', leafGlow: '#E4EAFF', pads: '#FFDDE8',
  },
  rare: {
    tier: 'rare',
    name: 'Rare Puffle', theme: 'Mystic woodland sprite, magical turquoise energy.',
    primary: '#46D8AB', secondary: '#8BF2D4', belly: '#CFFFF3', ear: '#AAFCEC',
    iris: '#00FFD5', eyeShadow: '#007D70', leaf: '#00D7A4', leafGlow: '#00F7C4', pads: '#FFC7B3',
  },
  epic: {
    tier: 'epic',
    name: 'Epic Puffle', theme: 'Arcane forest familiar with glowing magical aura.',
    primary: '#7D6CFF', secondary: '#B897FF', belly: '#D9CCFF', ear: '#EEE5FF',
    iris: '#C294FF', eyeShadow: '#4B2497', leaf: '#9B6DFF', leafGlow: '#D9B6FF', pads: '#FFBEDD',
  },
  galaxy: {
    tier: 'epic',
    name: 'Galaxy Puffle', theme: 'Painted by the collection sheet: violet nebula fur scattered with stars.',
    primary: '#6B4BD6', secondary: '#C77BFF', belly: '#E2C6FF', ear: '#9F7BFF',
    iris: '#FF7BE5', eyeGlow: '#FFB8F2', leaf: '#8A5BFF', leafGlow: '#E3B8FF', pads: '#FFC2E8',
  },
  spirit_guardian: {
    tier: 'epic',
    name: 'Spirit Guardian Puffle', theme: 'Painted by the collection sheet: lavender-white fur beneath a golden halo.',
    primary: '#E9E4FF', secondary: '#FFFFFF', belly: '#F7F4FF', ear: '#D9D1FF',
    iris: '#9B7BFF', eyeGlow: '#EDE6FF', leaf: '#C9B8FF', leafGlow: '#F2ECFF', pads: '#FFE0F2',
    gold: '#F7D774',
  },
  legendary: {
    tier: 'legendary',
    name: 'Legendary Puffle', theme: 'Royal guardian of Sprite Hollow forests.',
    primary: '#FFD74F', secondary: '#FFF0AA', belly: '#FFF7D6', ear: '#FFF5C8',
    iris: '#FFB800', eyeShadow: '#9D6800', leaf: '#F2C230', leafGlow: '#FFF5B8', pads: '#FFD1A8',
    crown: '#FFE57A', gold: '#FFC107',
  },
  golden_guardian: {
    tier: 'legendary',
    name: 'Golden Guardian Puffle', theme: 'Painted by the collection sheet: radiant gold fur and a ring of holy light.',
    primary: '#FFCE5C', secondary: '#FFF2B8', belly: '#FFF9DF', ear: '#FFE9A3',
    iris: '#FFB020', eyeGlow: '#FFF0B0', leaf: '#F3C23A', leafGlow: '#FFF6C2', pads: '#FFD9A8',
    gold: '#FFC107',
  },
  aurora: {
    tier: 'legendary',
    name: 'Aurora Puffle', theme: 'Painted by the collection sheet: shifting mint and violet fur like a night sky ribbon.',
    primary: '#7BF3D0', secondary: '#B8A8FF', belly: '#E6FFF7', ear: '#A8F2E4',
    iris: '#59E0FF', eyeGlow: '#B8FFF0', leaf: '#6FE8C2', leafGlow: '#CFFFE8', pads: '#FFD9F0',
  },
  mythic: {
    tier: 'mythic',
    name: 'Mythic Puffle', theme: 'Ancient celestial deity of nature and spirit magic.',
    primary: '#00FFF7', secondary: '#A8FFFF', belly: '#EFFFFF', ear: '#D9FFFF',
    iris: '#FFFFFF', innerGlow: '#84FFFF', outerGlow: '#00FFF7',
    leaf: '#4FFFFF', leafGlow: '#A9FFFF', pads: '#FFE6FF',
  },
  celestial_hollow: {
    tier: 'mythic',
    name: 'Celestial Hollow Puffle', theme: 'Painted by the collection sheet: white star-fur held in a ring of starlight.',
    primary: '#CFE8FF', secondary: '#FFFFFF', belly: '#F2FAFF', ear: '#BFE0FF',
    iris: '#79D6FF', eyeGlow: '#E8FBFF', leaf: '#A8D8FF', leafGlow: '#E8F7FF', pads: '#FFE4FF',
    gold: '#FFE28A',
  },
  eclipse: {
    tier: 'mythic',
    name: 'Eclipse Puffle', theme: 'Painted by the collection sheet: split day-and-night fur with a sun corona.',
    primary: '#4A3A78', secondary: '#C7A9FF', belly: '#DCCBFF', ear: '#7B65B8',
    iris: '#FFC24B', eyeGlow: '#FFE8A8', leaf: '#8C6BFF', leafGlow: '#D8B8FF', pads: '#E8B8FF',
    gold: '#FFCF6A',
  },
  shadow: {
    tier: 'secret',
    name: 'Shadow Puffle', theme: 'Corrupted shadow spirit from the Hollow Void.', secret: true,
    primary: '#1F1F2E', secondary: '#363650', belly: '#4B4B75', ear: '#5A5A8C',
    iris: '#FF006A', eyeGlow: '#FF59A8', leaf: '#8F00FF', leafGlow: '#E53CFF', pads: '#A882FF',
  },
  celestial: {
    tier: 'secret',
    name: 'Celestial Puffle', theme: 'Cosmic guardian spirit born from the World Tree.', secret: true,
    primary: '#FFFFFF', secondary: '#F4F7FF', belly: '#EAF8FF', ear: '#DDF7FF',
    iris: '#6EF5FF', eyeGlow: '#FFFFFF', leaf: '#A9FFFF', leafGlow: '#E8FFFF', pads: '#FFDFFF',
  },
  prime: {
    tier: 'secret',
    name: 'Sprite Hollow Prime', theme: 'Painted by the collection sheet: the once-in-a-lifetime prismatic guardian.', secret: true, rainbow: true,
    primary: '#B18CFF', secondary: '#FFD1F0', belly: '#FFFFFF', ear: '#C9E8FF',
    iris: '#8CFFF2', eyeGlow: '#FFFFFF', leaf: '#FFB3E6', leafGlow: '#FFFFFF', pads: '#FFE0FF',
    gold: '#FFF2B8',
  },
};

/* Tier order first, then sheet order inside each tier, so every picker reads
   the collection top to bottom. Run again whenever a later file adds styles. */
window.lumiPuffleSortKeys = function lumiPuffleSortKeys() {
  const rank = (key) => {
    const tier = window.LUMI_PUFFLE_VARIANTS[key].tier || 'common';
    const index = window.LUMI_PUFFLE_TIER_KEYS.indexOf(tier);
    return index < 0 ? 0 : index;
  };
  /* Hidden styles belong to a species and never appear as pickable options. */
  return Object.keys(window.LUMI_PUFFLE_VARIANTS)
    .filter((key) => !window.LUMI_PUFFLE_VARIANTS[key].hidden)
    .sort((a, b) => rank(a) - rank(b));
};
window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
window.LUMI_CLASSIC_PUFFLE_COLOR_KEYS = Object.keys(window.LUMI_PUFFLE_VARIANTS)
  .filter((key) => window.LUMI_PUFFLE_VARIANTS[key].classic);

window.lumiPufflePalette = function lumiPufflePalette(key) {
  return window.LUMI_PUFFLE_VARIANTS[key] || window.LUMI_PUFFLE_VARIANTS.common;
};

/* The tier a style belongs to, with its name, colour and motto. */
window.lumiPuffleTierOf = function lumiPuffleTierOf(key) {
  const style = window.LUMI_PUFFLE_VARIANTS[key];
  const tierKey = (style && style.tier) || 'common';
  const tier = window.LUMI_PUFFLE_TIERS[tierKey];
  return tier ? { key: tierKey, ...tier } : { key: 'common', ...window.LUMI_PUFFLE_TIERS.common };
};

/* Styles grouped by tier, in the sheet's column order. */
window.lumiPuffleTierGroups = function lumiPuffleTierGroups() {
  return window.LUMI_PUFFLE_TIER_KEYS
    .map((key) => ({
      tier: { key, ...window.LUMI_PUFFLE_TIERS[key] },
      keys: window.LUMI_PUFFLE_VARIANT_KEYS.filter((styleKey) => window.lumiPuffleTierOf(styleKey).key === key),
    }))
    .filter((group) => group.keys.length);
};

/* Hue, saturation and luminance of a hex colour. */
window.lumiHslOfHex = function lumiHslOfHex(hex) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length < 6) return { h: 0, s: 0, l: 0.5 };
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
};

/* The sheets are drawn in the common green, so a variant is a rotation away
   from that reference: the body filter is derived, never hard-coded. */
window.lumiPuffleTint = function lumiPuffleTint(key) {
  const base = window.lumiHslOfHex(window.LUMI_PUFFLE_VARIANTS.common.primary);
  const target = window.lumiHslOfHex(window.lumiPufflePalette(key).primary);
  const hue = ((target.h - base.h + 540) % 360) - 180;
  const sat = Math.max(0.35, Math.min(1.7, target.s / Math.max(0.05, base.s)));
  const bright = Math.max(0.55, Math.min(1.4, (0.5 + target.l) / (0.5 + base.l)));
  return { hue: Math.round(hue), sat, bright };
};
