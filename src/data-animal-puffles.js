/* The Animal Puffle Encyclopedia.
   Eight rarity tiers and fifty-one families, each an evolution line of three
   stages: baby -> sprite -> guardian. Pure data plus the wiki renderer below;
   auras are read from RARITY_TIER_STYLES so the encyclopedia can never drift
   from the card, egg and summon colours the game paints. */

const ANIMAL_PUFFLE_TIERS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret', 'ultra_secret'];

const ANIMAL_PUFFLE_FAMILIES = [
  /* ---- common ---- */
  { id: 'bunny', tier: 'common', name: 'Bunny', icon: '🐰', effect: 'Flower trails', note: 'Long fluffy ears, clover leaves and spring magic.',
    stages: ['Baby Bunny Puffle', 'Bunny Sprite Puffle', 'Moonbloom Hare Guardian'] },
  { id: 'squirrel', tier: 'common', name: 'Squirrel', icon: '🐿️', effect: 'Acorn pouch', note: 'Fluffy tail, woodland explorer, treasure hunter.',
    stages: ['Baby Squirrel Puffle', 'Squirrel Sprite Puffle', 'Great Oak Gatherer Guardian'] },
  { id: 'duck', tier: 'common', name: 'Duck', icon: '🦆', effect: 'Pond magic', note: 'Tiny wings, water ripples and lily pads.',
    stages: ['Baby Duck Puffle', 'Duck Sprite Puffle', 'Golden Pond Guardian'] },
  { id: 'hedgehog', tier: 'common', name: 'Hedgehog', icon: '🦔', effect: 'Crystal spikes', note: 'Soft crystal spikes on a mossy back, garden protector.',
    stages: ['Baby Hedgehog Puffle', 'Hedgehog Sprite Puffle', 'Thornbloom Guardian'] },
  { id: 'robin', tier: 'common', name: 'Robin', icon: '🐦', effect: 'Forest melodies', note: 'Red chest feathers and music notes on the breeze.',
    stages: ['Baby Robin Puffle', 'Robin Sprite Puffle', 'Songbird Guardian'] },
  { id: 'marshmallow', tier: 'common', name: 'Marshmallow', icon: '🍡', effect: 'Toasty bounce', note: 'A pillowy puff that smells faintly of vanilla and campfire.',
    stages: ['Baby Marshmallow Puffle', 'Marshmallow Sprite Puffle', 'Bonfire Mallow Guardian'] },
  { id: 'cloudsheep', tier: 'common', name: 'Cloud Sheep', icon: '☁️', effect: 'Dream wool', note: 'A floating cloud puff with tiny weather charms braided into its wool.',
    stages: ['Baby Cloud Sheep Puffle', 'Cloud Sheep Sprite Puffle', 'Sky Fleece Guardian'] },

  /* ---- uncommon ---- */
  { id: 'fox', tier: 'uncommon', name: 'Fox', icon: '🦊', effect: 'Illusion magic', note: 'Multiple glowing tails and amber eyes.',
    stages: ['Baby Fox Puffle', 'Fox Sprite Puffle', 'Mystic Kitsune Guardian'] },
  { id: 'deer', tier: 'uncommon', name: 'Deer', icon: '🦌', effect: 'Forest blessing', note: 'Crystal antlers and golden markings.',
    stages: ['Baby Deer Puffle', 'Deer Sprite Puffle', 'Elder Stag Guardian'] },
  { id: 'otter', tier: 'uncommon', name: 'Otter', icon: '🦦', effect: 'Water magic', note: 'Floating shells and a playful streak.',
    stages: ['Baby Otter Puffle', 'Otter Sprite Puffle', 'Riverkeeper Guardian'] },
  { id: 'owl', tier: 'uncommon', name: 'Owl', icon: '🦉', effect: 'Moon feathers', note: 'Glowing eyes and ancient wisdom.',
    stages: ['Baby Owl Puffle', 'Owl Sprite Puffle', 'Celestial Owl Guardian'] },
  { id: 'beaver', tier: 'uncommon', name: 'Beaver', icon: '🦫', effect: 'Wood magic', note: 'Floating logs and river engineering.',
    stages: ['Baby Beaver Puffle', 'Beaver Sprite Puffle', 'Damkeeper Guardian'] },
  { id: 'jellybean', tier: 'uncommon', name: 'Jellybean', icon: '🍭', effect: 'Candy sparkles', note: 'A glossy bean-shaped puff with a rainbow sugar shine.',
    stages: ['Baby Jellybean Puffle', 'Jellybean Sprite Puffle', 'Jellybean Rainbow Guardian'] },

  /* ---- rare ---- */
  { id: 'wolf', tier: 'rare', name: 'Wolf', icon: '🐺', effect: 'Pack spirit', note: 'Moon markings over silver fur.',
    stages: ['Baby Wolf Puffle', 'Wolf Sprite Puffle', 'Lunar Alpha Guardian'] },
  { id: 'bear', tier: 'rare', name: 'Bear', icon: '🐻', effect: 'Earth magic', note: 'Honey crystal fur and a forest tank build.',
    stages: ['Baby Bear Puffle', 'Bear Sprite Puffle', 'Ancient Grove Bear Guardian'] },
  { id: 'butterfly', tier: 'rare', name: 'Butterfly', icon: '🦋', effect: 'Fairy dust', note: 'Rainbow wings and a flower aura.',
    stages: ['Baby Butterfly Puffle', 'Butterfly Sprite Puffle', 'Prism Butterfly Queen'] },
  { id: 'bee', tier: 'rare', name: 'Bee', icon: '🐝', effect: 'Honey magic', note: 'Golden stripes and nectar crystals.',
    stages: ['Baby Bee Puffle', 'Bee Sprite Puffle', 'Honeylight Monarch Guardian'] },
  { id: 'tiger', tier: 'rare', name: 'Tiger', icon: '🐯', effect: 'Storm claws', note: 'Electric stripes and a lightning aura.',
    stages: ['Baby Tiger Puffle', 'Tiger Sprite Puffle', 'Thunderfang Guardian'] },
  { id: 'panther', tier: 'rare', name: 'Panther', icon: '🐆', effect: 'Stealth magic', note: 'Dark nebula fur with glowing eyes.',
    stages: ['Baby Panther Puffle', 'Panther Sprite Puffle', 'Shadowclaw Guardian'] },
  { id: 'squishy', tier: 'rare', name: 'Squishy', icon: '🫧', effect: 'Jelly bounce', note: 'A soft, see-through puff that wobbles when it is happy.',
    stages: ['Baby Squishy Puffle', 'Squishy Sprite Puffle', 'Jellybloom Guardian'] },
  { id: 'cinderfox', tier: 'rare', name: 'Cinder Fox', icon: '🦊', effect: 'Ember tails', note: 'A soot-soft fox whose tail tips glow like banked campfire coals.',
    stages: ['Baby Cinder Fox Puffle', 'Cinder Fox Sprite Puffle', 'Ember Tail Guardian'] },

  /* ---- epic ---- */
  { id: 'axolotl', tier: 'epic', name: 'Axolotl', icon: '🦎', effect: 'Healing energy', note: 'Glowing frills and aquatic spirit magic.',
    stages: ['Baby Axolotl Puffle', 'Axolotl Sprite Puffle', 'Spirit Axolotl Guardian'] },
  { id: 'turtle', tier: 'epic', name: 'Turtle', icon: '🐢', effect: 'Crystal shell', note: 'An ancient shell built for defence.',
    stages: ['Baby Turtle Puffle', 'Turtle Sprite Puffle', 'Worldshell Guardian'] },
  { id: 'dolphin', tier: 'epic', name: 'Dolphin', icon: '🐬', effect: 'Coral magic', note: 'Bubble rings and ocean speed.',
    stages: ['Baby Dolphin Puffle', 'Dolphin Sprite Puffle', 'Ocean Guardian Dolphin'] },
  { id: 'peacock', tier: 'epic', name: 'Peacock', icon: '🦚', effect: 'Prism light', note: 'Rainbow feathers and a beauty aura.',
    stages: ['Baby Peacock Puffle', 'Peacock Sprite Puffle', 'Aurora Peacock Guardian'] },
  { id: 'raven', tier: 'epic', name: 'Raven', icon: '🐦‍⬛', effect: 'Magic runes', note: 'Dark feathers carved with runes.',
    stages: ['Baby Raven Puffle', 'Raven Sprite Puffle', 'Arcane Raven Guardian'] },
  { id: 'snowleopard', tier: 'epic', name: 'Snow Leopard', icon: '🐈‍⬛', effect: 'Aurora powers', note: 'Ice crystals and mountain agility.',
    stages: ['Baby Snow Leopard Puffle', 'Snow Leopard Sprite Puffle', 'Frostfang Guardian'] },
  { id: 'geodebear', tier: 'epic', name: 'Geode Bear', icon: '🪨', effect: 'Crystal den', note: 'A sturdy bear with a geode heart and a trail of glittering pebbles.',
    stages: ['Baby Geode Bear Puffle', 'Geode Bear Sprite Puffle', 'Prism Den Guardian'] },
  { id: 'squishygummies', tier: 'epic', name: 'Squishy Gummies', icon: '🍬', effect: 'Gummy bloom', note: 'A translucent gummy puff with fruit-sweet sparkles inside.',
    stages: ['Baby Squishy Gummy Puffle', 'Squishy Gummy Sprite Puffle', 'Gummybloom Guardian'] },

  /* ---- legendary ---- */
  { id: 'starcat', tier: 'legendary', name: 'Star Cat', icon: '🐱', effect: 'Cosmic luck', note: 'A galaxy tail and stardust paws.',
    stages: ['Baby Star Cat Puffle', 'Star Cat Sprite Puffle', 'Nebula Cat Guardian'] },
  { id: 'lion', tier: 'legendary', name: 'Lion', icon: '🦁', effect: 'Sun magic', note: 'A golden mane and a royal roar.',
    stages: ['Baby Lion Puffle', 'Lion Sprite Puffle', 'Solar Lion King Guardian'] },
  { id: 'swan', tier: 'legendary', name: 'Swan', icon: '🦢', effect: 'Light magic', note: 'Crystal wings and a graceful aura.',
    stages: ['Baby Swan Puffle', 'Swan Sprite Puffle', 'Celestial Swan Queen'] },
  { id: 'phoenix', tier: 'legendary', name: 'Phoenix Chick', icon: '🐤', effect: 'Rebirth magic', note: 'Living flames and radiant feathers.',
    stages: ['Baby Phoenix Puffle', 'Phoenix Sprite Puffle', 'Eternal Phoenix Guardian'] },
  { id: 'unicorn', tier: 'legendary', name: 'Unicorn Fawn', icon: '🦄', effect: 'Healing powers', note: 'A rainbow mane and a celestial horn.',
    stages: ['Baby Unicorn Puffle', 'Unicorn Sprite Puffle', 'Starlight Unicorn Guardian'] },
  { id: 'dragonpup', tier: 'legendary', name: 'Dragon Pup', icon: '🐲', effect: 'Dragon fire', note: 'Small dragon wings and crystal scales.',
    stages: ['Baby Dragon Pup Puffle', 'Dragon Sprite Puffle', 'Skyfire Dragon Guardian'] },
  { id: 'nebulaowl', tier: 'legendary', name: 'Nebula Owl', icon: '🦉', effect: 'Star maps', note: 'An owl whose feathers hold a slowly turning map of the sky.',
    stages: ['Baby Nebula Owl Puffle', 'Nebula Owl Sprite Puffle', 'Star Map Guardian'] },

  /* ---- mythic ---- */
  { id: 'griffin', tier: 'mythic', name: 'Griffin', icon: '🦅', effect: 'Sky sovereignty', note: 'Eagle wings over a lion frame.',
    stages: ['Baby Griffin Puffle', 'Griffin Sprite Puffle', 'Royal Griffin Guardian'] },
  { id: 'kirin', tier: 'mythic', name: 'Kirin', icon: '🦒', effect: 'Sacred fire', note: 'Golden scales and heavenly blessings.',
    stages: ['Baby Kirin Puffle', 'Kirin Sprite Puffle', 'Celestial Kirin Guardian'] },
  { id: 'leviathan', tier: 'mythic', name: 'Leviathan', icon: '🐋', effect: 'Tidal magic', note: 'Sea serpent features and abyss energy.',
    stages: ['Baby Leviathan Puffle', 'Leviathan Sprite Puffle', 'Ocean Leviathan Guardian'] },
  { id: 'roc', tier: 'mythic', name: 'Thunder Roc', icon: '🕊️', effect: 'Hurricane mastery', note: 'Storm feathers and lightning wings.',
    stages: ['Baby Roc Puffle', 'Roc Sprite Puffle', 'Tempest Roc Guardian'] },
  { id: 'moondragon', tier: 'mythic', name: 'Moon Dragon', icon: '🐉', effect: 'Constellation energy', note: 'Moonlight scales that hold star maps.',
    stages: ['Baby Moon Dragon Puffle', 'Moon Dragon Sprite Puffle', 'Lunar Dragon Guardian'] },

  /* ---- secret ---- */
  { id: 'cosmickitsune', tier: 'secret', name: 'Cosmic Kitsune', icon: '🌌', effect: 'Cosmic fire', note: 'Nine galaxy tails and reality-bending light.',
    stages: ['Baby Cosmic Kitsune', 'Cosmic Kitsune Sprite', 'Creator Kitsune Guardian'] },
  { id: 'voidlynx', tier: 'secret', name: 'Void Lynx', icon: '🕳️', effect: 'Portal powers', note: 'Dark cosmic fur and dimensional claws.',
    stages: ['Baby Void Lynx', 'Void Lynx Sprite', 'Void Sovereign Guardian'] },
  { id: 'genesisstag', tier: 'secret', name: 'Genesis Stag', icon: '🌳', effect: 'Universal growth', note: 'Creation antlers and life energy.',
    stages: ['Baby Genesis Stag', 'Genesis Stag Sprite', 'Worldtree Stag Guardian'] },
  { id: 'heartlightbunny', tier: 'secret', name: 'Heartlight Bunny', icon: '💗', effect: 'Love magic', note: 'A friendship aura and healing warmth.',
    stages: ['Baby Heartlight Bunny', 'Heartlight Bunny Sprite', 'Heartlight Guardian Rabbit'] },
  { id: 'creatordragon', tier: 'secret', name: 'Creator Dragon', icon: '🌠', effect: 'Creation fire', note: 'Universe-forging power and divine scales.',
    stages: ['Baby Creator Dragon', 'Creator Dragon Sprite', 'Creator Dragon Guardian'] },

  /* ---- ultra secret ---- */
  { id: 'prismchimera', tier: 'ultra_secret', name: 'Prism Chimera', icon: '🦁', effect: 'Rainbow crystal energy', note: 'Lion, dragon, deer and bird fused in one body.',
    stages: ['Baby Chimera Puffle', 'Prism Chimera Puffle', 'Celestial Chimera Guardian'] },
  { id: 'eternalwolf', tier: 'ultra_secret', name: 'Eternal Wolf', icon: '🐺', effect: 'Time magic', note: 'Constellation fur and a celestial pack spirit.',
    stages: ['Baby Eternal Wolf', 'Eternal Wolf Sprite', 'Eternal Star Wolf Guardian'] },
  { id: 'worldphoenix', tier: 'ultra_secret', name: 'World Phoenix', icon: '🔥', effect: 'Rebirth energy', note: 'Creation flames and universe feathers.',
    stages: ['Baby World Phoenix', 'World Phoenix Sprite', 'Genesis Phoenix Guardian'] },
  { id: 'crowngriffin', tier: 'ultra_secret', name: 'Crown Griffin', icon: '👑', effect: 'Kingly aura', note: 'Royal crystals and a throne-guardian frame.',
    stages: ['Baby Crown Griffin', 'Crown Griffin Sprite', 'Throne Guardian Griffin'] },
  { id: 'spriteprime', tier: 'ultra_secret', name: 'Sprite Prime Beast', icon: '🌟', effect: 'Reality shaping', note: 'Every Animal Puffle trait woven into one creator-level body.',
    stages: ['Baby Prime Beast', 'Prime Beast Sprite', 'Sprite Prime Guardian'] },
];

const ANIMAL_PUFFLE_STAGE_COUNT = ANIMAL_PUFFLE_FAMILIES.reduce((total, family) => total + family.stages.length, 0);

const ANIMAL_PUFFLE_TIER_STEP = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, secret: 5, ultra_secret: 5 };
/* Portraits are tinted to each family's own hue; the golden angle keeps
   neighbouring families far apart, and a few pairs with similar silhouettes
   get fixed hues so they never read as recolours of one family. */
const ANIMAL_PUFFLE_HUE_OVERRIDES = {
  griffin: 42, roc: 205,
  marshmallow: 24, cloudsheep: 205, jellybean: 96, squishy: 188, squishygummies: 316,
  cinderfox: 18, geodebear: 268, nebulaowl: 224,
  /* The snow kit is the palest source sheet. Fixed, widely separated hues keep
     Bunny, Wolf and Snow Leopard from reading as three washes of the same blue. */
  bunny: 328, wolf: 212, snowleopard: 174,
};
const ANIMAL_PUFFLE_HUES = new Map(ANIMAL_PUFFLE_FAMILIES.map((family, index) => [family.id,
  ANIMAL_PUFFLE_HUE_OVERRIDES[family.id] ?? Math.round((index * 137.508) % 360)]));

/* Every one of the fifty-one families carries an outline profile: fur, ears,
   crest, wings and tail, drawn around the shared puffle body so every guardian
   has its own silhouette. The painted portrait and the silhouette both read it. */
const ANIMAL_PUFFLE_SILHOUETTES = {
  /* Mammal profiles: fur, ears and tail carry the family. */
  bunny: { fur: 'tufts', ears: 'long', tail: 'puff' },
  marshmallow: { fur: 'fluffy', ears: 'round', tail: 'puff' },
  cloudsheep: { fur: 'fluffy', ears: 'round', tail: 'puff' },
  jellybean: { fur: 'smooth', ears: 'tuft', tail: 'short' },
  squishy: { fur: 'tufts', ears: 'round', tail: 'puff' },
  squishygummies: { fur: 'smooth', ears: 'round', tail: 'heart' },
  cinderfox: { fur: 'tufts', ears: 'pointy', tail: 'bushy' },
  geodebear: { fur: 'fluffy', ears: 'round', tail: 'thin' },
  nebulaowl: { fur: 'feather', ears: 'tuft', tail: 'short' },
  squirrel: { fur: 'spiky', ears: 'tuft', tail: 'bushy', tailHigh: true },
  fox: { fur: 'smooth', ears: 'pointy', tail: 'bushy' },
  beaver: { fur: 'smooth', ears: 'round', tail: 'flat' },
  wolf: { fur: 'tufts', ears: 'pointy', tail: 'curl' },
  bear: { fur: 'fluffy', ears: 'round', tail: 'puff' },
  tiger: { fur: 'fluffy', ears: 'round', crest: 'mane', tail: 'thin' },
  panther: { fur: 'smooth', ears: 'round', tail: 'thin' },
  lion: { fur: 'fluffy', ears: 'round', crest: 'mane', tail: 'tuft' },
  griffin: { fur: 'tufts', ears: 'tuft', wings: 'spread', tail: 'fan' },
  /* Feather kit. */
  duck: { fur: 'smooth', beak: true, wings: 'folded', tail: 'fan' },
  robin: { fur: 'tufts', crest: 'tuft', wings: 'folded', tail: 'short' },
  owl: { fur: 'fluffy', ears: 'tuft', wings: 'folded', tail: 'short' },
  peacock: { fur: 'smooth', crest: 'crown', wings: 'spread', tail: 'fan' },
  raven: { fur: 'smooth', crest: 'spike', wings: 'spread', tail: 'wedge' },
  swan: { fur: 'smooth', neck: 'long', wings: 'spread', tail: 'fan' },
  phoenix: { fur: 'spiky', crest: 'flame', wings: 'spread', tail: 'flame' },
  roc: { fur: 'spiky', crest: 'spike', wings: 'spread', tail: 'storm' },
  worldphoenix: { fur: 'spiky', crest: 'flame', wings: 'spread', tail: 'flame', halo: 'ring' },
  /* Glow kit. */
  starcat: { fur: 'tufts', ears: 'pointy', tail: 'star' },
  cosmickitsune: { fur: 'tufts', ears: 'pointy', tail: 'nine' },
  /* Void Lynx uses the robot kit with portal rifts and cheek tufts; Eternal
     Wolf keeps the glow kit's halo ring on a sleek constellation body. */
  voidlynx: { fur: 'spiky', ears: 'tuft', tail: 'thin', halo: 'rift', cheek: 'lynx' },
  heartlightbunny: { fur: 'fluffy', ears: 'long', tail: 'heart' },
  eternalwolf: { fur: 'fluffy', ears: 'tuft', crest: 'star', tail: 'curl', halo: 'ring' },
  spriteprime: { fur: 'spiky', ears: 'round', crest: 'crown', mane: 'lion', wings: 'spread', halo: 'ring' },
  /* Spike kit. */
  hedgehog: { fur: 'spiky', ears: 'round', tail: 'short' },
  /* Horn kit. */
  deer: { fur: 'smooth', ears: 'tuft', crest: 'antler', tail: 'short' },
  unicorn: { fur: 'tufts', ears: 'pointy', crest: 'horn', tail: 'flow' },
  /* Fin kit. */
  otter: { fur: 'smooth', ears: 'round', tail: 'thick' },
  axolotl: { fur: 'smooth', gills: 'frill', tail: 'fin' },
  dolphin: { fur: 'smooth', beak: true, dorsal: 'fin', tail: 'fluke' },
  leviathan: { fur: 'smooth', crest: 'horns', dorsal: 'spines', tail: 'serpent' },
  /* Flower kit. */
  butterfly: { fur: 'smooth', antennae: true, wings: 'butterfly', tail: 'short' },
  bee: { fur: 'fluffy', antennae: true, wings: 'small', tail: 'sting' },
  /* Shell, snow and leaf kits. */
  turtle: { fur: 'smooth', shell: 'dome', tail: 'short' },
  snowleopard: { fur: 'fluffy', ears: 'tuft', spots: true, tail: 'curl' },
  genesisstag: { fur: 'tufts', ears: 'pointy', crest: 'antler', canopy: 'leaves', tail: 'puff' },
  /* Dragon, glow and crystal profiles. The high-rarity pairs that share a kit
     are separated by body and appendage, not only hue: Creator Dragon is a tall,
     smooth horned serpent, while Sprite Prime Beast is a wide, spiky crown-maned
     beast; Eternal Wolf wears star-crested wolf tufts instead of the kitsune's
     fox ears; Crown Griffin gets a tufted lion tail instead of Prism Chimera's
     matching fan. */
  dragonpup: { fur: 'smooth', crest: 'horns', wings: 'dragon', tail: 'spade' },
  kirin: { fur: 'tufts', crest: 'antler', tail: 'flame' },
  moondragon: { fur: 'smooth', crest: 'crescent', wings: 'dragon', tail: 'serpent', halo: 'ring' },
  creatordragon: { fur: 'smooth', crest: 'horns', wings: 'dragon', tail: 'serpent', dorsal: 'spines' },
  /* Crystal kit. */
  prismchimera: { fur: 'fluffy', crest: 'antler', mane: 'lion', wings: 'dragon', tail: 'fan' },
  crowngriffin: { fur: 'tufts', ears: 'tuft', crest: 'crown', wings: 'spread', tail: 'tuft' },
};
/* The same round body path the live sprite draws, scaled into the 64-unit
   portrait box. Family identity comes from the fringe, ears, crest, wings and
   tail in the profile, which the outline and the painted portrait both read. */
const AP_SILHOUETTE_ROUND = '<path d="M32 17.5c11 0 20 9 20 20.5s-9 20.5-20 20.5-20-9-20-20.5 9-20.5 20-20.5Z"/>';

function apSilhouetteFur(style) {
  if (!style || style === 'smooth') return '';
  const marks = [];
  const cx = 32;
  const cy = 40;
  const count = style === 'fluffy' ? 11 : style === 'spiky' ? 13 : 7;
  const rx = style === 'tufts' ? 23 : 26;
  const ry = style === 'tufts' ? 20 : 23;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    if (style === 'fluffy') {
      const x = (cx + Math.cos(angle) * rx).toFixed(1);
      const y = (cy + Math.sin(angle) * ry).toFixed(1);
      marks.push(`<circle cx="${x}" cy="${y}" r="4.6"/>`);
    } else {
      const reach = style === 'spiky' ? 4.4 : 5.4;
      const tipX = (cx + Math.cos(angle) * (rx + reach)).toFixed(1);
      const tipY = (cy + Math.sin(angle) * (ry + reach)).toFixed(1);
      const a1 = angle + 0.15;
      const a2 = angle - 0.15;
      const p1 = `${(cx + Math.cos(a1) * rx).toFixed(1)} ${(cy + Math.sin(a1) * ry).toFixed(1)}`;
      const p2 = `${(cx + Math.cos(a2) * rx).toFixed(1)} ${(cy + Math.sin(a2) * ry).toFixed(1)}`;
      marks.push(`<path d="M${p1} ${tipX} ${tipY} ${p2}Z"/>`);
    }
  }
  return marks.join('');
}

/* The family's own animal shape: fur fringe, ears, crest, wings, tail, shell
   and the rest, drawn in the 64-unit space the silhouette uses. One list feeds
   both the outline trace and the filled portrait, so the two never drift. */
function apFamilyShapeParts(familyId) {
  const p = ANIMAL_PUFFLE_SILHOUETTES[familyId];
  if (!p) return '';
  const parts = [apSilhouetteFur(p.fur)];
  const add = (markup) => parts.push(markup);
  const high = p.tailHigh ? -8 : 0;
  if (p.ears === 'long') add('<ellipse cx="23" cy="15" rx="5" ry="13" transform="rotate(-7 23 15)"/><ellipse cx="41" cy="15" rx="5" ry="13" transform="rotate(7 41 15)"/>');
  if (p.ears === 'pointy') add('<path d="M18 30 15 12l13 9Z"/><path d="M46 30 49 12 36 21Z"/>');
  if (p.ears === 'tuft') add('<path d="M20 26l-3-11 10 6Z"/><path d="M44 26l3-11-10 6Z"/>');
  if (p.ears === 'round') add('<circle cx="18" cy="28" r="7"/><circle cx="46" cy="28" r="7"/>');
  if (p.cheek === 'lynx') add('<path d="M17 31 8 33l6 6-8 2 9 4Z"/><path d="M47 31l9 2-6 6 8 2-9 4Z"/>');
  if (p.antennae) add('<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M27 17c-1-6-4-9-8-10"/><path d="M37 17c1-6 4-9 8-10"/></g><circle cx="18" cy="6" r="2"/><circle cx="46" cy="6" r="2"/>');
  if (p.gills === 'frill') add('<g fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M18 28c-5-2-8-5-8-9"/><path d="M17 34c-6 0-9-2-10-6"/><path d="M18 40c-5 2-9 2-11-1"/><path d="M46 28c5-2 8-5 8-9"/><path d="M47 34c6 0 9-2 10-6"/><path d="M46 40c5 2 9 2 11-1"/></g>');
  if (p.neck === 'long') add('<rect x="28" y="9" width="8" height="20" rx="4"/>');
  if (p.halo === 'ring') add('<ellipse cx="32" cy="9" rx="13" ry="4" fill="none" stroke="currentColor" stroke-width="2" opacity=".8"/>');
  if (p.halo === 'rift') add('<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".9"><path d="M15 13c4-8 11-12 19-12 8 0 15 4 19 12"/><path d="M18 17c4 4 9 6 15 6 6 0 11-2 15-6"/></g>');
  if (p.mane === 'lion') add('<circle cx="32" cy="35" r="23" fill="none" stroke="currentColor" stroke-width="5.5" opacity=".42"/>');
  if (p.crest === 'mane') add('<circle cx="32" cy="34" r="24" fill="none" stroke="currentColor" stroke-width="7" opacity=".4"/>');
  if (p.crest === 'tuft') add('<path d="M27 22c0-7 3-10 5-12 1 5 1 8 0 12Z"/>');
  if (p.crest === 'spike') add('<path d="M25 24l2-12 5 9 3-11 4 11 3-8 2 11Z"/>');
  if (p.crest === 'crown') add('<path d="M22 24l2-12 5 7 3-10 3 10 5-7 2 12Z"/>');
  if (p.crest === 'flame') add('<path d="M32 8c6 8 8 12 5 16-2 3-6 2-6-2 0 5-5 6-7 2-3-5 0-10 8-16Z"/>');
  if (p.crest === 'star') add('<path d="M32 6l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z"/>');
  if (p.crest === 'antler') add('<g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M24 25c-2-6-5-9-9-11"/><path d="M20 17c-2-3-2-7-1-10"/><path d="M40 25c2-6 5-9 9-11"/><path d="M44 17c2-3 2-7 1-10"/></g>');
  if (p.crest === 'horn') add('<path d="M29 25c1-7 4-13 9-18 0 8-1 14-4 18Z"/>');
  if (p.crest === 'horns') add('<path d="M25 25c-3-4-4-8-3-12 4 2 6 5 7 9Z"/><path d="M39 25c3-4 4-8 3-12-4 2-6 5-7 9Z"/>');
  if (p.crest === 'crescent') add('<path d="M36 4a10 10 0 1 0 5 16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>');
  if (p.beak) add('<path d="M32 44l7 6-7 3-7-3Z" opacity=".9"/>');
  if (p.wings === 'spread') add('<path d="M12 40C4 36 2 28 4 20c6 4 9 10 10 16Z"/><path d="M52 40c8-4 10-12 8-20-6 4-9 10-10 16Z"/>');
  if (p.wings === 'folded') add('<path d="M14 42c-5 0-8-3-8-7 4 1 7 3 9 5Z"/><path d="M50 42c5 0 8-3 8-7-4 1-7 3-9 5Z"/>');
  if (p.wings === 'butterfly') add('<path d="M26 38C16 38 8 30 6 20c8-2 15 3 20 10Z"/><path d="M38 38c10 0 18-8 20-18-8-2-15 3-20 10Z"/><path d="M26 45c-9 2-16 8-17 15 8 2 15-2 18-9Z"/><path d="M38 45c9 2 16 8 17 15-8 2-15-2-18-9Z"/>');
  if (p.wings === 'small') add('<ellipse cx="17" cy="31" rx="9" ry="5.5" transform="rotate(-28 17 31)"/><ellipse cx="47" cy="31" rx="9" ry="5.5" transform="rotate(28 47 31)"/>');
  if (p.wings === 'dragon') add('<path d="M14 37C7 33 4 25 6 17c5 1 9 4 12 9l2-6 4 8c-1 5-4 8-10 9Z"/><path d="M50 37c7-4 10-12 8-20-5 1-9 4-12 9l-2-6-4 8c1 5 4 8 10 9Z"/>');
  if (p.tail === 'puff') add(`<circle cx="53" cy="${46 + high}" r="7"/>`);
  if (p.tail === 'bushy') add(`<circle cx="53" cy="${44 + high}" r="10"/><circle cx="47" cy="${40 + high}" r="6"/>`);
  if (p.tail === 'flat') add('<rect x="50" y="42" width="10" height="12" rx="5" transform="rotate(24 55 48)"/>');
  if (p.tail === 'thin') add('<path d="M52 46c5 2 8 6 8 11" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>');
  if (p.tail === 'curl') add('<path d="M52 46c7 0 10 5 8 9-2 4-7 4-8 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>');
  if (p.tail === 'fan') add('<path d="M50 46l12-8v6l3-2-2 8Z"/><path d="M50 50l13-2-1 6 3 0-4 5Z"/>');
  if (p.tail === 'wedge') add('<path d="M50 44l13 3-10 8Z"/>');
  if (p.tail === 'short') add('<circle cx="51" cy="48" r="5"/>');
  if (p.tail === 'tuft') add('<path d="M51 46c4-4 8-3 9 0 1 3-2 5-4 5Z"/>');
  if (p.tail === 'flame') add('<path d="M51 50c5-3 9-9 8-14 4 6 5 12 1 16-3 3-7 2-9-2Z"/>');
  if (p.tail === 'storm') add('<path d="M50 46l6-6 3 6 4-9 2 10-5 6Z"/>');
  if (p.tail === 'star') add('<path d="M55 40l3 6 7 1-5 4 2 7-6-4-6 4 2-7-5-4 7-1Z"/>');
  if (p.tail === 'heart') add('<path d="M55 55c-6-4-9-7-9-11 0-3 2-5 5-5 2 0 3 1 4 3 1-2 2-3 4-3 3 0 5 2 5 5 0 4-3 7-9 11Z"/>');
  if (p.tail === 'nine') add('<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M50 44c6-4 8-9 7-14"/><path d="M51 48c7-3 9-7 9-12"/><path d="M52 52c7-2 9-5 10-9"/><path d="M52 56c6 0 9-2 11-6"/></g>');
  if (p.tail === 'thick') add('<path d="M50 47c7 1 11 6 12 12-5 0-10-2-14-7Z"/>');
  if (p.tail === 'fin') add('<path d="M47 39c8 2 12 8 12 18-6-1-10-6-13-12Z"/>');
  if (p.tail === 'fluke') add('<path d="M50 45c6-2 9-6 11-11 0 5-1 9-4 11 3 2 4 5 4 10-4-4-7-6-11-6Z"/>');
  if (p.tail === 'serpent') add('<path d="M49 45c8 2 12 7 11 12-1 4-6 5-8 2-2-3 1-5 3-4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>');
  if (p.tail === 'spade') add('<path d="M49 43c5 1 9 4 11 8l-4 2 2 5-7-3-6 2 2-6-4-3Z"/>');
  if (p.tail === 'flow') add('<g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M50 43c6-2 9-7 10-12"/><path d="M50 49c7 0 11-4 13-9"/><path d="M51 55c5 1 9-1 11-5"/></g>');
  if (p.tail === 'sting') add('<path d="M47 49l11 4-8 6Z"/>');
  if (p.dorsal === 'fin') add('<path d="M25 22c4-8 9-11 14-10-3 3-5 7-5 12Z"/>');
  if (p.dorsal === 'spines') add('<path d="M20 26l3-7 4 7Z"/><path d="M27 21l3-7 4 7Z"/><path d="M34 19l3-7 4 7Z"/>');
  if (p.shell === 'dome') add('<path d="M9 42a23 17 0 0 1 46 0Z" fill="none" stroke="currentColor" stroke-width="3"/><g fill="none" stroke="currentColor" stroke-width="2" opacity=".7"><path d="M32 25v17"/><path d="M22 28v14"/><path d="M42 28v14"/></g>');
  if (p.canopy === 'leaves') add('<path d="M11 6c4-1 6 1 7 4-3 2-6 1-7-4Z"/><path d="M53 6c-4-1-6 1-7 4 3 2 6 1 7-4Z"/><path d="M20 1c4 1 5 4 4 7-3 0-5-2-4-7Z"/>');
  if (p.spots) add('<g opacity=".55"><circle cx="22" cy="33" r="2"/><circle cx="30" cy="46" r="1.7"/><circle cx="40" cy="31" r="2"/><circle cx="45" cy="47" r="1.7"/></g>');
  return parts.join('');
}

function apSilhouetteSVG(familyId) {
  const p = ANIMAL_PUFFLE_SILHOUETTES[familyId];
  if (!p) return '';
  /* The dotted rim and the round body are the shared puffball base; the fringe
     and appendages are what make two families read differently. */
  const puffball = '<circle cx="32" cy="38" r="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray=".6 3.6" stroke-linecap="round" opacity=".38"/>';
  return `<svg class="ap-portrait-silhouette" viewBox="-4 -4 72 72" aria-hidden="true" focusable="false"><g fill="currentColor">${puffball}${AP_SILHOUETTE_ROUND}${apFamilyShapeParts(familyId)}</g></svg>`;
}

function apEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* The encyclopedia draws the same round puffle body the live game draws, tinted
   to the family's own hue, with that family's animal shape around it. Features
   are authored in the silhouette's 64-unit space and mapped onto the body, so a
   Bunny keeps long ears and a Fox keeps a bushy tail while both stay puffles. */
const apTint = (hue, sat, light) => hslComponentsToHex(hue, sat / 100, light / 100);

function apPuffleSprite(family, stageIndex) {
  const p = ANIMAL_PUFFLE_SILHOUETTES[family.id] || {};
  const hue = ANIMAL_PUFFLE_HUES.get(family.id) || 0;
  const step = ANIMAL_PUFFLE_TIER_STEP[family.tier] || 0;
  /* Smooth families keep the short coat; every furry one wears the same coats
     the rest of the roster uses, so the fur reads as the same material. */
  const fur = ({ smooth: 'smooth', fluffy: 'cloud', spiky: 'shaggy', feather: 'puffle' })[p.fur] || 'tufty';
  return {
    id: `ap-${family.id}-${stageIndex}`,
    element: 'bloom',
    palette: 'custom',
    custom: {
      body: apTint(hue, 66, 72 + Math.min(4, step)),
      light: apTint(hue, 82, 88),
      deep: apTint(hue, 58, 46),
      accent: apTint(hue + 34, 85, 66),
      belly: apTint(hue, 80, 86),
    },
    breed: 'basic_sprite',
    stage: stageIndex === 0 ? 'baby' : stageIndex === 1 ? 'sprite' : 'elder',
    fur,
    name: family.name,
  };
}

function apPuffleArtSVG(family, stageIndex = 2) {
  const index = Math.max(0, Math.min(family.stages.length - 1, Number(stageIndex) || 0));
  const sprite = apPuffleSprite(family, index);
  const shape = apFamilyShapeParts(family.id);
  const behind = shape
    ? `<g transform="translate(60 61) scale(1.95) translate(-32 -37)" fill="${sprite.custom.body}" stroke="${sprite.custom.deep}" stroke-width=".7" stroke-linejoin="round">${shape}</g>`
    : '';
  /* The outline trace stays the fallback so a page that renders before the
     sprite renderer still shows the family's documented shape. */
  return pufflePortraitMarkup(sprite, behind) || apSilhouetteSVG(family.id);
}

/* One guardian portrait per family, on the shared puffle body. */
function apGuardianPortrait(family) {
  const guardian = family.stages[family.stages.length - 1] || `${family.name} Guardian`;
  return `<span class="ap-portrait" role="img" aria-label="Guardian portrait: ${apEsc(guardian)}" data-ap-silhouette="${family.id}" data-ap-art="puffle">${apPuffleArtSVG(family, 2)}<span class="ap-portrait-tag" aria-hidden="true">GUARDIAN</span></span>`;
}

/* Full-size stage portrait for the comparison sheet, stepping from the baby
   body up to the guardian so the three stages stay visibly different. */
function apStagePortrait(family, stageIndex = 2) {
  const index = Math.max(0, Math.min(family.stages.length - 1, Number(stageIndex) || 0));
  const stage = family.stages[index] || family.name;
  const label = index === 0 ? 'BABY' : index === 1 ? 'SPRITE' : 'GUARDIAN';
  return `<span class="ap-portrait ap-stage-portrait" role="img" aria-label="${label} portrait: ${apEsc(stage)}" data-ap-stage="${label.toLowerCase()}" data-ap-silhouette="${family.id}" data-ap-art="puffle">${apPuffleArtSVG(family, index)}<span class="ap-portrait-tag" aria-hidden="true">${label}</span></span>`;
}

/* Stage rows use the same puffle art in place of emoji orbs, so baby and sprite
   already wear the family shape at the smaller size. */
function apStageMedallion(family, index) {
  return `<span class="ap-orb-slot">${apPuffleArtSVG(family, index)}</span>`;
}

/* The encyclopedia page: one aura-tinted card per family, with the full
   baby -> sprite -> guardian line and the family's signature effect. */
function wikiAnimalPufflesMarkup() {
  const tiers = typeof ANIMAL_PUFFLE_TIERS !== 'undefined' ? ANIMAL_PUFFLE_TIERS : [];
  const families = typeof ANIMAL_PUFFLE_FAMILIES !== 'undefined' ? ANIMAL_PUFFLE_FAMILIES : [];
  const styles = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES : {};
  const groups = tiers
    .map((tier) => ({ tier, style: styles[tier] || { name: tier, color: '#C9CDD2', glow: 'rgba(201,205,210,.5)', icon: '⚪' }, list: families.filter((family) => family.tier === tier) }))
    .filter((group) => group.list.length);
  const legend = groups.map((group) => `<span class="ap-legend" style="--ap-aura:${group.style.color}">${group.style.icon} ${apEsc(group.style.name)} · ${group.list.length} families</span>`).join('');
  const sections = groups.map((group) => `<section class="ap-tier" style="--ap-aura:${group.style.color};--ap-glow:${group.style.glow || group.style.color}">
      <div class="ap-tier-head"><h3>${group.style.icon} ${apEsc(group.style.name)} Animal Puffles</h3><span>${group.list.length} families · ${group.list.length * 3} stages</span></div>
      <div class="ap-grid">${group.list.map((family) => `<article class="ap-card" data-ap-family="${family.id}">
        <div class="ap-card-head">${apGuardianPortrait(family)}<span class="ap-family"><b>${apEsc(family.name)}</b><small>${apEsc(family.effect)}</small></span></div>
        <ol class="ap-line">${family.stages.map((stage, index) => `<li class="ap-stage${index === family.stages.length - 1 ? ' is-guardian' : ''}">${apStageMedallion(family, index)}<span>${apEsc(stage)}</span></li>`).join('')}</ol>
        <p class="ap-note">${apEsc(family.note)}</p>
        <span class="ap-effect">${apEsc(family.effect)}</span>
      </article>`).join('')}</div>
    </section>`).join('');
  return `<p class="wiki-lede">Every Animal Puffle family is a three-stage line: a <b>baby</b> with oversized eyes and tiny paws, a <b>sprite</b> that finds its elemental trick, and a <b>guardian</b> that carries the family's myth. Auras below are read from the same rarity palette as the cards, eggs and summons.</p>
    <div class="ap-legend-row">${legend}</div>
    <p class="tiny muted">${families.length} families · ${typeof ANIMAL_PUFFLE_STAGE_COUNT !== 'undefined' ? ANIMAL_PUFFLE_STAGE_COUNT : families.length * 3} stages · eight rarity tiers</p>
    ${sections}
    <h3>Elemental effects in play</h3>
    <p>Nature leaves and flowers, water ribbons and bubbles, crystals and frost, lightning and embers, honey magic, rainbow trails, spirit wisps, stardust and galaxies, dragon fire, celestial runes, void energy, creation light and heart magic. Each family's effect is the one its guardian is built around.</p>`;
}
