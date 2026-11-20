/* Elemental Puffle roster, mirroring tools/puffle_elements.py.
   The atlas in assets/lumi/art is generated from the same table, so these hexes
   are the source of truth for any element art shown in the app.

   Every elemental form is also a puffle style (`el_<key>`): fur from the painted
   body and wings, iris from the painted eye, so each element keeps its own eyes
   wherever its sprite is drawn. data-puffles.js turns the same roster into the
   playable type species. */

window.LUMI_ELEMENT_ROSTER = [
  { key: 'ember', name: 'Ember Puffle', element: 'Fire', effect: 'fire', palette: { body: '#FF6B35', wing: '#FFB347', eye: '#FFD166', deep: '#C73E1D' } },
  { key: 'bloom', name: 'Bloom Puffle', element: 'Grass', effect: 'grass', palette: { body: '#7FD36C', wing: '#B9F19F', eye: '#4CAF50', deep: '#4CAF50' } },
  { key: 'tideflit', name: 'Tideflit Puffle', element: 'Water', effect: 'water', palette: { body: '#00CFFF', wing: '#A0F6FF', eye: '#0077B6', deep: '#0077B6' } },
  { key: 'whisp', name: 'Whisp Puffle', element: 'Air', effect: 'air', palette: { body: '#FFFFFF', wing: '#DDF7FF', eye: '#4BC8FF', deep: '#89DBFF' } },
  { key: 'volt', name: 'Volt Puffle', element: 'Electric', effect: 'electric', palette: { body: '#FFE600', wing: '#FFF066', eye: '#FFB700', deep: '#FFB700' } },
  { key: 'frost', name: 'Frost Puffle', element: 'Ice', effect: 'ice', palette: { body: '#FFFFFF', wing: '#DDF7FF', eye: '#6EB5FF', deep: '#8FD3FF' } },
  { key: 'terra', name: 'Terra Puffle', element: 'Earth', effect: 'earth', palette: { body: '#6B8E23', wing: '#D2B48C', eye: '#8FBC8F', deep: '#556B2F' } },
  { key: 'venom', name: 'Venom Puffle', element: 'Poison', effect: 'poison', palette: { body: '#8A2BE2', wing: '#ADFF2F', eye: '#7FFF00', deep: '#6A0DAD' } },
  { key: 'alloy', name: 'Alloy Puffle', element: 'Metal', effect: 'metal', palette: { body: '#C0C0C0', wing: '#E5E4E2', eye: '#5DADEC', deep: '#7F8C8D' } },
  { key: 'shadow', name: 'Shadow Puffle', element: 'Dark', effect: 'dark', palette: { body: '#1F1F2E', wing: '#363650', eye: '#FF006A', deep: '#8F00FF' } },
  { key: 'celestial', name: 'Celestial Puffle', element: 'Light', effect: 'light', palette: { body: '#FFFFFF', wing: '#F4F7FF', eye: '#6EF5FF', deep: '#DDF7FF' } },
  { key: 'mystic', name: 'Mystic Puffle', element: 'Arcane', effect: 'arcane', palette: { body: '#7D6CFF', wing: '#B897FF', eye: '#C294FF', deep: '#6B46FF' } },
  { key: 'spirit', name: 'Spirit Puffle', element: 'Ghost', effect: 'ghost', palette: { body: '#D8D8FF', wing: '#AFAFFF', eye: '#8B8BFF', deep: '#F2F2FF' } },
  { key: 'crystal', name: 'Crystal Puffle', element: 'Crystal', effect: 'crystal', palette: { body: '#6EEBFF', wing: '#D7FFFF', eye: '#B7AFFF', deep: '#FFFFFF' } },
  { key: 'storm', name: 'Storm Puffle', element: 'Storm', effect: 'storm', palette: { body: '#5E7CE2', wing: '#8EB8FF', eye: '#DDEBFF', deep: '#A4A4A4' } },
  { key: 'lunar', name: 'Lunar Puffle', element: 'Moon', effect: 'moon', palette: { body: '#EDF2FF', wing: '#D6DCFF', eye: '#BCCAFF', deep: '#FFFFFF' } },
  { key: 'solar', name: 'Solar Puffle', element: 'Sun', effect: 'sun', palette: { body: '#FFD74F', wing: '#FFE57A', eye: '#FFB800', deep: '#FFF5B8' } },
  { key: 'floral', name: 'Floral Puffle', element: 'Flower', effect: 'flower', palette: { body: '#FFB6D9', wing: '#FFD6EA', eye: '#D6FFDA', deep: '#FFF2F8' } },
  { key: 'sand', name: 'Sand Puffle', element: 'Desert', effect: 'sand', palette: { body: '#E2C290', wing: '#F4D7A3', eye: '#A97142', deep: '#D2A679' } },
  { key: 'magma', name: 'Magma Puffle', element: 'Lava', effect: 'magma', palette: { body: '#FF4D00', wing: '#FF7A00', eye: '#FFD166', deep: '#A61B00' } },
  { key: 'cosmic', name: 'Cosmic Puffle', element: 'Space', effect: 'cosmic', palette: { body: '#1B1B3A', wing: '#4E4EBD', eye: '#8FE3FF', deep: '#7B68EE' } },
  { key: 'time', name: 'Time Puffle', element: 'Time', effect: 'time', palette: { body: '#D4AF37', wing: '#FFF3B0', eye: '#B8860B', deep: '#FFD700' } },
  { key: 'dream', name: 'Dream Puffle', element: 'Dream', effect: 'dream', palette: { body: '#FFD6F6', wing: '#D6E4FF', eye: '#FFC8E8', deep: '#E2D6FF' } },
  { key: 'sound', name: 'Sound Puffle', element: 'Sound', effect: 'sound', palette: { body: '#FF71CE', wing: '#01CDFE', eye: '#05FFA1', deep: '#B967FF' } },
  { key: 'aether', name: 'Aether Puffle', element: 'Mythic', effect: 'aether', palette: { body: '#FFFFFF', wing: '#A8FFFF', eye: '#00FFF7', deep: '#E6D5FF' } },
  { key: 'hollow', name: 'Hollow Puffle', element: 'Void', effect: 'void', palette: { body: '#150C2E', wing: '#3A2A66', eye: '#8F00FF', deep: '#0B0618' } },
];

window.LUMI_ELEMENT_KEYS = window.LUMI_ELEMENT_ROSTER.map((entry) => entry.key);

window.lumiElementOf = function lumiElementOf(key) {
  return window.LUMI_ELEMENT_ROSTER.find((entry) => entry.key === key) || null;
};

/* The roster doubles as a style table: one puffle style per element, with the
   painted eye hex as its iris. Runs after lumi-palettes.js has built the table. */
(function registerElementalPuffleStyles() {
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  if (!table) return;
  window.LUMI_ELEMENT_ROSTER.forEach((entry) => {
    const key = `el_${entry.key}`;
    if (table[key]) return;
    table[key] = {
      tier: 'elemental',
      element: entry.key,
      name: `${entry.element} Puffle`,
      theme: `${entry.name} — ${entry.element.toLowerCase()} magic in puffle form.`,
      primary: entry.palette.body,
      secondary: entry.palette.wing,
      belly: entry.palette.wing,
      ear: entry.palette.wing,
      iris: entry.palette.eye,
      leaf: entry.palette.deep,
      leafGlow: entry.palette.eye,
      pads: entry.palette.wing,
    };
  });
  if (typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
})();

/* The style a sprite wears: its own pick wins, then its species' elemental
   style, then the plain common forest look. */
window.lumiPuffleStyleOfSprite = function lumiPuffleStyleOfSprite(sprite) {
  if (!sprite) return 'common';
  if (sprite.puffleVariant) return sprite.puffleVariant;
  const meta = typeof ELEMENTS !== 'undefined' && ELEMENTS ? ELEMENTS[sprite.element] : null;
  return (meta && meta.puffleStyle) || 'common';
};
