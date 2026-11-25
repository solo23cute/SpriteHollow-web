/* Parametric creature art. Everything is drawn from the sprite's genetics. */

function paletteLuminance(hex) {
  const m = String(hex || '').trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  const channel = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
/* WCAG relative contrast, used only where a palette's own fill has to prove
   it can be seen against the body it is drawn on. */
function paletteContrast(a, b) {
  const x = paletteLuminance(a);
  const y = paletteLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/* A handful of shells are nearly black by design (the Master Cheat's galaxy
   body is #2f2a33) and disappear on dark cards. Lift only those, so the body
   and its outline stay readable without repainting the rest of the roster. */
function liftForDisplay(p) {
  const lum = paletteLuminance(p.body);
  if (lum >= 0.15) return p;
  const lift = Math.min(0.55, 0.3 + (0.15 - lum) * 1.8);
  return {
    body: lighten(p.body, lift),
    light: lighten(p.light, lift * 0.35),
    deep: lighten(p.deep, lift * 0.8),
    accent: p.accent,
    belly: lighten(p.belly, lift * 0.3),
  };
}

/* ---------- per-chain colourways ---------- */
/* Every evolution chain gets its own small, deterministic shift of its element
   palette, so two chains that share an element never render in the same
   colours. The shift is deliberately gentle (hue ±18°, mild saturation and
   brightness nudges) so the element still reads at a glance. Custom dyes and
   named palettes are applied later in basePalette and therefore still win. */
function chainColourwaySeed(key) {
  let h = 2166136261;
  const text = String(key || '');
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function hexToHslComponents(hex) {
  const raw = String(hex || '').replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

function hslComponentsToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360 / 360;
  const sat = Math.max(0, Math.min(1, s));
  const lum = Math.max(0, Math.min(1, l));
  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r;
  let g;
  let b;
  if (sat === 0) {
    r = lum; g = lum; b = lum;
  } else {
    const q = lum < 0.5 ? lum * (1 + sat) : lum + sat - lum * sat;
    const p = 2 * lum - q;
    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }
  const to2 = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function shiftChainHex(hex, way) {
  if (!way) return hex;
  const { h, s, l } = hexToHslComponents(hex);
  /* Near-greys (white ice, pale air) carry no hue to rotate, so they get their
     own tint instead of a shift that would do nothing. */
  if (s < 0.14) {
    const tintHue = (way.seed >>> 3) % 360;
    /* Keep the original lightness: a near-black or near-white sprite must stay
       dark or pale, only picking up a hint of its own hue. */
    return hslComponentsToHex(tintHue, 0.18, Math.min(0.96, Math.max(0.08, l)));
  }
  return hslComponentsToHex(h + way.hueShift, s * way.satScale, l * way.lightScale);
}

function chainColourway(element) {
  const line = typeof window.puffleEvolutionLine === 'function' ? window.puffleEvolutionLine(element) : null;
  /* Chained species seed from their chain; species with no chain still get a
     colourway of their own rather than borrowing the element at face value. */
  const key = (line && line.key) || String(element || '');
  if (!key) return null;
  const seed = chainColourwaySeed(key);
  return {
    key,
    seed,
    hueShift: (seed % 37) - 18,
    satScale: 0.9 + ((seed >>> 8) % 13) / 100,
    lightScale: 0.97 + ((seed >>> 16) % 7) / 100,
  };
}

function nativePalette(sprite) {
  const finish = finishOf(sprite);
  if (finish) {
    return { body: finish.body, light: finish.light, deep: finish.deep, accent: finish.accent, belly: finish.belly };
  }
  const el = ELEMENTS[sprite.element] || ELEMENTS.bloom;
  const way = chainColourway(sprite.element);
  const base = {
    body: shiftChainHex(el.primary, way),
    light: shiftChainHex(el.light, way),
    deep: shiftChainHex(el.deep, way),
    accent: shiftChainHex(el.accent, way),
    belly: lighten(shiftChainHex(el.primary, way), 0.55),
  };
  if (sprite.palette === 'custom' && sprite.custom) {
    return {
      body: sprite.custom.body || base.body,
      light: sprite.custom.light || base.light,
      deep: sprite.custom.deep || base.deep,
      accent: sprite.custom.accent || base.accent,
      belly: sprite.custom.belly || lighten(sprite.custom.body || base.body, 0.55),
    };
  }
  if (sprite.palette && sprite.palette !== 'native' && PALETTES[sprite.palette]) {
    const p = PALETTES[sprite.palette];
    return { body: p.body, light: p.light, deep: p.deep, accent: p.accent, belly: p.belly };
  }
  /* Classic Sprite Puffle colourways repaint the whole round body, not only a
     headpiece. Finished/custom/named palettes above still win, so a dye or a
     finish keeps its own colours. */
  /* A Club Penguin puffle with no colour of its own reads the colourway stored
     in its body type, so the family always paints in classic colours. */
  const variantKey = sprite.puffleVariant
    || (typeof cpPuffleStyleForSprite === 'function' ? cpPuffleStyleForSprite(sprite) : null);
  const variant = variantKey
    ? (typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS ? window.LUMI_PUFFLE_VARIANTS[variantKey] : null)
      || (typeof cpCreatureStylePalette === 'function' ? cpCreatureStylePalette(variantKey) : null)
    : null;
  if (variant && (variant.classic || String(sprite.breed || '').startsWith('cp_penguin_') || sprite.breed === 'cp_puffle')) {
    return {
      body: variant.primary,
      light: variant.secondary || variant.primary,
      deep: variant.eyeShadow || variant.primary,
      /* A creature style carries a coat-tinted accent; leaves are the puffle
         fallback. */
      accent: variant.accent || variant.leafGlow || variant.leaf || variant.secondary || variant.primary,
      belly: variant.belly || lighten(variant.primary, 0.55),
    };
  }
  /* Species carry their own palette in the breed record; it has to outrank the
     element, or every new sprite renders in its starter element's colours. */
  const breed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const speciesPalette = breed && breed.speciesPalette;
  if (speciesPalette && speciesPalette !== 'native' && PALETTES[speciesPalette]) {
    /* The breed's own palette wins over the element, so vector art and the
       painted atlas agree instead of every species turning atlas violet. */
    const p = PALETTES[speciesPalette];
    return { body: p.body, light: p.light, deep: p.deep, accent: p.accent, belly: p.belly };
  }
  return base;
}

/* A hue shift moves the whole colourway at once. It is applied after every
   other palette source, so a custom dye, a named palette and a species' own
   colours all turn together and the look survives personalisation. */
function rotatePaletteHue(p, degrees) {
  const deg = Number(degrees) || 0;
  if (!deg) return p;
  const turn = (hex) => {
    const { h, s, l } = hexToHslComponents(hex);
    return hslComponentsToHex(h + deg, s, l);
  };
  return {
    body: turn(p.body),
    light: turn(p.light),
    deep: turn(p.deep),
    accent: turn(p.accent),
    belly: turn(p.belly),
  };
}

/* A player-picked colour still follows the hue dial: the chosen fur pair turns
   with the rest of the sprite instead of staying frozen. */
function rotateHexHue(hex, degrees) {
  const deg = Number(degrees) || 0;
  if (!deg || typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const { h, s, l } = hexToHslComponents(hex);
  return hslComponentsToHex(h + deg, s, l);
}

function basePalette(sprite) {
  return rotatePaletteHue(nativePalette(sprite), sprite && sprite.hue);
}

function resolvePalette(sprite) {
  return liftForDisplay(basePalette(sprite));
}
function paletteIsDark(sprite) {
  return paletteLuminance(basePalette(sprite).body) < 0.15;
}

function elementOf(sprite) {
  return ELEMENTS[sprite.element] || ELEMENTS.bloom;
}

function bodyPath(breed) {
  /* Kept for older callers that still ask for a breed path. Every breed now
     returns the same round puffle body as the live renderer. */
  return 'M60 20c22 0 40 18 40 41s-18 41-40 41-40-18-40-41 18-41 40-41Z';
}

/* The signature Sprite Hollow silhouette: a round, furry puffle ball. Every
   Sprite, Sprite Puffle and guardian wears this exact path. */
const PUFFLE_BODY_PATH = 'M60 20c22 0 40 18 40 41s-18 41-40 41-40-18-40-41 18-41 40-41Z';

/* Toddler and child sit between the swaddled baby and the teen, so the early
   years read as four sizes instead of one jump. */
const STAGE_SCALE = { baby: 0.78, toddler: 0.82, child: 0.86, juvenile: 0.9, sprite: 1, youngadult: 1.025, midadult: 1.045, highadult: 1.06, elder: 1.07, ancient: 1.12, sensei: 1.12 };

/* Optional silhouette shaping, extra ears, and eye styles. All three are
   per-sprite and default to the breed's own art. */
const HEAD_SHAPES = {
  breed: { name: 'Breed', sx: 1, sy: 1 },
  round: { name: 'Round', sx: 1.04, sy: 0.96 },
  wide: { name: 'Wide', sx: 1.12, sy: 0.93 },
  tall: { name: 'Tall', sx: 0.96, sy: 1.1 },
  point: { name: 'Pointed', sx: 0.92, sy: 1.06 },
  blocky: { name: 'Blocky', sx: 1.08, sy: 1.02 },
  mochi: { name: 'Mochi', sx: 1.1, sy: 0.88, dy: 4 },
  long: { name: 'Long', sx: 0.88, sy: 1.18, dy: -3 },
  chibi: { name: 'Chibi', sx: 1.02, sy: 1.05, dy: 5 },
  petite: { name: 'Petite', sx: 0.86, sy: 0.9, dy: 3 },
  grand: { name: 'Grand', sx: 1.18, sy: 1.12, dy: -2 },
  jelly: { name: 'Jelly', sx: 1.06, sy: 1, dy: 2 },
};
const HEAD_SHAPE_KEYS = Object.keys(HEAD_SHAPES);

/* One body for the whole roster. The named entries stay as save-compatible
   aliases, but every one paints the same round puffle outline; breed, family,
   dye, fur and markings are what make two pets read apart. The common path
   covers the face region (roughly x 34-86, y 40-84), so every face stays inside
   the body whatever a saved pet still has in its shape field. */
const BODY_SHAPES = {
  breed: { name: 'Round puffle', icon: '🐾', path: 'M60 20c22 0 40 18 40 41s-18 41-40 41-40-18-40-41 18-41 40-41Z' },
  puff: {
    name: 'Puffball', icon: '☁️',
    path: 'M60 24c8 0 13 5 17 10 6-2 13 0 16 6 3 5 2 10 4 15 2 6 4 12 0 17-4 5-10 4-13 9-3 5-9 8-15 8H51c-6 0-12-3-15-8-3-5-9-4-13-9-4-5-2-11 0-17 2-5 1-10 4-15 3-6 10-8 16-6 4-5 9-10 17-10Z',
  },
  bean: {
    name: 'Bean', icon: '🫘',
    path: 'M60 22c14 0 24 11 24 27 0 10-5 15-5 22 0 16-8 26-19 26s-19-10-19-26c0-7-5-12-5-22 0-16 10-27 24-27Z',
  },
  slab: {
    name: 'Slab', icon: '🧱',
    path: 'M52 26h16c12 0 20 8 20 20v22c0 12-8 20-20 20H52c-12 0-20-8-20-20V46c0-12 8-20 20-20Z',
  },
  drop: {
    name: 'Teardrop', icon: '💧',
    path: 'M60 20c5 0 8 5 11 12 5 11 17 20 17 34 0 15-12 24-28 24S32 81 32 66c0-14 12-23 17-34 3-7 6-12 11-12Z',
  },
  dumpling: {
    name: 'Dumpling', icon: '🥟',
    path: 'M60 28c22 0 38 14 38 30 0 13-8 21-20 24-6 1-12 3-18 3s-12-2-18-3c-12-3-20-11-20-24 0-16 16-30 38-30Z',
  },
  pebble: {
    name: 'Pebble', icon: '🪨',
    path: 'M60 24c19 0 33 12 33 28 0 9-3 15-9 20-6 5-15 8-24 8s-18-3-24-8c-6-5-9-11-9-20 0-16 14-28 33-28Z',
  },
  cushion: {
    name: 'Cushion', icon: '🛋️',
    path: 'M36 40c6-6 16-9 24-9s18 3 24 9c5 5 8 12 8 20 0 10-5 17-13 21-6 3-12 5-19 5s-13-2-19-5c-8-4-13-11-13-21 0-8 3-15 8-20Z',
  },
  /* Fluff-family silhouettes. These are the puffle-type bodies: rounded,
     fur-edged outlines with no visible neck, drawn from scratch so every
     variant reads as its own creature rather than a recolour. */
  cloudpuff: {
    name: 'Cloudpuff', icon: '🌥️',
    path: 'M60 22c9 0 15 4 19 10 7-3 15 1 17 8 2 6-1 11-4 15 4 5 4 12 0 17-4 6-11 6-15 10-4 4-10 8-17 8s-13-4-17-8c-4-4-11-4-15-10-4-5-4-12 0-17-3-4-6-9-4-15 2-7 10-11 17-8 4-6 10-10 19-10Z',
  },
  pompom: {
    name: 'Pom-pom', icon: '⚪',
    path: 'M60 22c6 0 10 3 13 7 5-3 12-1 14 4 3 4 1 9 3 12 5 2 8 8 5 13-2 4-7 5-9 8 0 6-5 11-11 11-3 0-6-1-8-3-2 3-5 5-9 5s-7-2-9-5c-2 2-5 3-8 3-6 0-11-5-11-11-2-3-7-4-9-8-3-5 0-11 5-13 2-3 0-8 3-12 2-5 9-7 14-4 3-4 7-7 13-7Z',
  },
  shaggy: {
    name: 'Shaggy', icon: '🐑',
    path: 'M60 24c5-1 8 3 12 4 5-2 10 1 11 6 1 4 6 6 7 10 1 5-3 8-3 12 0 5 3 9 1 13-2 5-8 4-10 8-2 4-7 8-13 8s-11-4-13-8c-2-4-8-3-10-8-2-4 1-8 1-13 0-4-4-7-3-12 1-4 6-6 7-10 1-5 6-8 11-6 4-1 7-5 12-4Z',
  },
  longfur: {
    name: 'Long fur', icon: '🧸',
    path: 'M60 20c12 0 21 9 23 20 2 10 8 18 8 28 0 16-13 26-31 26S29 84 29 68c0-10 6-18 8-28 2-11 11-20 23-20Z',
  },
  dandelion: {
    name: 'Dandelion', icon: '🌼',
    path: 'M60 22c11 0 19 7 21 16 2 7 8 12 8 20 0 12-9 20-20 22-4 1-6 3-9 3s-5-2-9-3c-11-2-20-10-20-22 0-8 6-13 8-20 2-9 10-16 21-16Z',
  },
  muff: {
    name: 'Muff', icon: '🍡',
    path: 'M40 34c5-6 12-9 20-9s15 3 20 9c4 3 8 3 11 7 2 4 0 8-2 11 2 4 2 9 0 13-3 5-9 4-12 8-3 4-10 6-17 6s-14-2-17-6c-3-4-9-3-12-8-2-4-2-9 0-13-2-3-4-7-2-11 3-4 7-4 11-7Z',
  },
  /* Round family and creature silhouettes. */
  round: {
    name: 'Round puff', icon: '🟣',
    path: 'M60 24c20 0 36 16 36 38S80 102 60 102 24 84 24 62 40 24 60 24Z',
  },
  bigball: {
    name: 'Big puffball', icon: '⚪',
    path: 'M60 18c24 0 42 19 42 43s-18 43-42 43-42-19-42-43S36 18 60 18Z',
  },
  ghost: {
    name: 'Ghost', icon: '👻',
    path: 'M60 22c18 0 32 14 32 33v28c0 6-6 8-9 4-3-3-6-3-9 1-3 4-7 4-10 0-3-4-6-4-9 0-3 4-7 4-10-1-2-3-4-3-8-1-3 4-9 2-9-4V55c0-19 14-33 32-33Z',
  },
  dragon: {
    name: 'Dragon', icon: '🐉',
    path: 'M60 24c9 0 15 4 20 11 6 2 11 8 12 16 2 10 2 19 0 27-3 11-15 20-32 20S31 89 28 78c-2-8-2-17 0-27 1-8 6-14 12-16 5-7 11-11 20-11Z',
  },
  penguin: {
    name: 'Penguin', icon: '🐧',
    path: 'M60 22c15 0 26 13 27 32 1 16 1 30-1 39-3 10-13 15-26 15s-23-5-26-15c-2-9-2-23-1-39 1-19 12-32 27-32Z',
  },
  /* Club Penguin-inspired puffle silhouettes. These are original drawn bodies
     that follow the familiar puffle proportions: round, no neck, soft feet and
     a face that stays inside every outline. The Studio's Puffle shape picker
     offers this list; the aliases above remain round for old saves. */
  cp_classic: {
    name: 'Classic Puffle', icon: '🔵',
    path: 'M60 20c22 0 40 18 40 41s-18 41-40 41-40-18-40-41 18-41 40-41Z',
  },
  cp_chubby: {
    name: 'Chubby Puffle', icon: '🟠',
    path: 'M60 30c24 0 43 15 43 35 0 21-19 35-43 35S17 86 17 65c0-20 19-35 43-35Z',
  },
  cp_tall: {
    name: 'Tall Puffle', icon: '🟡',
    path: 'M60 16c17 0 29 17 29 42 0 25-12 43-29 43S31 83 31 58c0-25 12-42 29-42Z',
  },
  cp_bean: {
    name: 'Bean Puffle', icon: '🫘',
    path: 'M60 20c15 0 26 12 26 29 0 10-4 16-4 23 0 15-9 26-22 26s-22-11-22-26c0-7-4-13-4-23 0-17 11-29 26-29Z',
  },
  cp_fluff: {
    name: 'Fluff Puffle', icon: '☁️',
    path: 'M60 22c9 0 15 4 19 10 7-3 15 1 17 8 2 6-1 11-4 15 4 5 4 12 0 17-4 6-11 6-15 10-4 4-10 8-17 8s-13-4-17-8c-4-4-11-4-15-10-4-5-4-12 0-17-3-4-6-9-4-15 2-7 10-11 17-8 4-6 10-10 19-10Z',
  },
  cp_ghost: {
    name: 'Ghost Puffle', icon: '👻',
    path: 'M60 22c18 0 32 14 32 33v28c0 6-6 8-9 4-3-3-6-3-9 1-3 4-7 4-10 0-3-4-6-4-9 0-3 4-7 4-10-1-2-3-4-3-8-1-3 4-9 2-9-4V55c0-19 14-33 32-33Z',
  },
  cp_alien: {
    name: 'Alien Puffle', icon: '🛸',
    path: 'M60 18c20 0 35 17 35 40 0 25-15 44-35 44S25 83 25 58c0-23 15-40 35-40Z',
  },
  cp_bunny: {
    name: 'Bunny Puffle', icon: '🐰',
    path: 'M60 14c15 0 26 19 26 45 0 25-11 43-26 43S34 84 34 59c0-26 11-45 26-45Z',
  },
  cp_pup: {
    name: 'Pup Puffle', icon: '🐶',
    path: 'M60 26c22 0 40 12 40 31 0 20-18 34-40 34S20 77 20 57c0-19 18-31 40-31Z',
  },
  cp_kitty: {
    name: 'Kitty Puffle', icon: '🐱',
    path: 'M60 24c21 0 37 14 37 34 0 19-16 33-37 33S23 77 23 58c0-20 16-34 37-34Z',
  },
  cp_dino: {
    name: 'Dino Puffle', icon: '🦖',
    path: 'M60 22c19 0 32 13 33 30 1 15-7 28-17 34-5 3-10 5-16 5s-11-2-16-5c-10-6-18-19-17-34 1-17 14-30 33-30Z',
  },
  cp_snow: {
    name: 'Snow Puffle', icon: '⛄',
    path: 'M60 18c12 0 22 8 24 19 10 4 16 13 16 24 0 20-18 34-40 34S20 81 20 61c0-11 6-20 16-24 2-11 12-19 24-19Z',
  },
};
const CP_PUFFLE_SHAPE_KEYS = [
  'cp_classic', 'cp_chubby', 'cp_tall', 'cp_bean', 'cp_fluff', 'cp_ghost',
  'cp_alien', 'cp_bunny', 'cp_pup', 'cp_kitty', 'cp_dino', 'cp_snow',
];
/* Older saves can still name any of the alias shapes above; those continue to
   paint the shared round body. The explicit Club Penguin silhouettes below are
   the only shape keys that change the outline. */
Object.keys(BODY_SHAPES).forEach((key) => {
  if (!CP_PUFFLE_SHAPE_KEYS.includes(key)) BODY_SHAPES[key].path = PUFFLE_BODY_PATH;
});
const BODY_SHAPE_KEYS = Object.keys(BODY_SHAPES);

function bodyPathFor(sprite) {
  const key = sprite && sprite.shape;
  if (key && CP_PUFFLE_SHAPE_KEYS.includes(key)) {
    return BODY_SHAPES[key]?.path || PUFFLE_BODY_PATH;
  }
  /* A Club Penguin puffle's body type carries its Club Penguin silhouette, so
     the family hatches on a classic body without the Studio shape picker. */
  if (typeof cpPuffleShapeForSprite === 'function') {
    const cpShape = cpPuffleShapeForSprite(sprite);
    if (cpShape && CP_PUFFLE_SHAPE_KEYS.includes(cpShape) && BODY_SHAPES[cpShape]) {
      return BODY_SHAPES[cpShape].path;
    }
  }
  /* Every ordinary Sprite, Sprite Puffle and guardian keeps the shared round
     silhouette. Breed, family, dye, fur and markings still supply the colours
     and surface detail. */
  return PUFFLE_BODY_PATH;
}

const EAR_STYLES = {
  breed: { name: 'Breed ears', icon: '🧬' },
  pointy: { name: 'Pointy', icon: '🐱' },
  tall: { name: 'Tall', icon: '🐰' },
  round: { name: 'Round', icon: '🐻' },
  floppy: { name: 'Floppy', icon: '🐶' },
  fin: { name: 'Fin', icon: '🐟' },
  antenna: { name: 'Antennae', icon: '🐛' },
  curl: { name: 'Curled', icon: '🌀' },
  leaf: { name: 'Leaf', icon: '🍃' },
  spike: { name: 'Spiked', icon: '🌵' },
  shell: { name: 'Shell', icon: '🐚' },
  pompom: { name: 'Pom-pom', icon: '🧶' },
  bunny: { name: 'Bunny', icon: '🐇' },
  deer: { name: 'Antlers', icon: '🦌' },
  horn: { name: 'Horns', icon: '😈' },
  bat: { name: 'Bat', icon: '🦇' },
  frill: { name: 'Frill', icon: '🦎' },
  gill: { name: 'Gills', icon: '🫧' },
};
Object.assign(EAR_STYLES, {
  axolotl: { name: 'Axolotl frills', icon: '🦎' },
  goat: { name: 'Goat ears', icon: '🐐' },
  seal: { name: 'Seal nubs', icon: '🦭' },
  tulip: { name: 'Tulip cups', icon: '🌷' },
  coral: { name: 'Coral', icon: '🪸' },
  wing: { name: 'Wing tufts', icon: '🪽' },
  tuft: { name: 'Puff tufts', icon: '☁️' },
  petal: { name: 'Petal crown', icon: '🌼' },
});
const EAR_STYLE_KEYS = Object.keys(EAR_STYLES);

/* Round puffle wings. Every type is built from circles and soft ellipses, so a
   wing never breaks the round silhouette. Colours come from the sprite palette
   unless the player picks a wing colour of their own. */
const WING_STYLES = {
  none: { name: 'No wings', icon: '🚫' },
  round: { name: 'Round', icon: '⚪' },
  butterfly: { name: 'Butterfly', icon: '🦋' },
  fairy: { name: 'Fairy', icon: '🧚' },
  bat: { name: 'Bat', icon: '🦇' },
  leaf: { name: 'Leaf', icon: '🍃' },
  cloud: { name: 'Cloud', icon: '☁️' },
};
const WING_STYLE_KEYS = Object.keys(WING_STYLES);

function wingMarkup(style, c, sprite) {
  const key = WING_STYLES[style] ? style : 'round';
  if (!sprite || key === 'none') return '';
  const picked = sprite.wingColor && /^#[0-9a-f]{6}$/i.test(sprite.wingColor) ? sprite.wingColor : null;
  /* A chosen wing colour still turns with the sprite's hue dial. */
  const own = picked ? rotateHexHue(picked, sprite.hue) : null;
  const fill = own || c.light;
  const fill2 = own ? mix(own, '#ffffff', 0.35) : c.accent;
  const rim = mix(own || c.deep, '#1a1030', 0.25);
  const shade = mix(fill, c.deep, 0.3);
  const spot = mix(fill2, '#ffffff', 0.45);
  /* Wing lobes sit 4 units inward, so the outer edge still fits the 120 frame
     when the largest stages scale the whole drawing by 1.19 around (60,70). */
  const sides = (inner) => `<g transform="translate(6 0)">${inner}</g><g transform="translate(120 0) scale(-1 1)"><g transform="translate(6 0)">${inner}</g></g>`;
  if (key === 'butterfly') {
    const lobe = `<circle cx="24" cy="52" r="15" fill="${fill}" stroke="${rim}" stroke-width="1.3"/><circle cx="26" cy="52" r="7" fill="${fill2}" opacity=".85"/><circle cx="24" cy="78" r="10" fill="${fill2}" stroke="${rim}" stroke-width="1.3"/><circle cx="21" cy="50" r="3" fill="${spot}" opacity=".9"/>`;
    return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
  }
  if (key === 'fairy') {
    const lobe = `<circle cx="23" cy="50" r="14" fill="${fill}" opacity=".92" stroke="${rim}" stroke-width="1.2"/><circle cx="23" cy="50" r="6" fill="${fill2}" opacity=".55"/><circle cx="31" cy="66" r="9" fill="${fill}" opacity=".85" stroke="${rim}" stroke-width="1.1"/><path d="M23 36v28M9 50h28" stroke="${spot}" stroke-width="1" opacity=".7"/>`;
    return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
  }
  if (key === 'bat') {
    const lobe = `<path d="M52 44c-9-9-21-9-28-2-6 5-14 9-16 16-2 6 4 10 10 10 5 0 9-3 13-6 5-4 11-6 16-6 4 0 7-3 5-12Z" fill="${fill}" stroke="${rim}" stroke-width="1.3"/><circle cx="15" cy="50" r="4" fill="${fill2}"/><circle cx="28" cy="42" r="3" fill="${fill2}" opacity=".8"/>`;
    return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
  }
  if (key === 'leaf') {
    const lobe = `<path d="M54 48c-12-14-30-16-38-6-7 9 2 26 18 30 12 3 20-4 20-24Z" fill="${fill}" stroke="${rim}" stroke-width="1.3"/><path d="M20 46c6 8 14 16 22 22" stroke="${spot}" stroke-width="1.6" fill="none" opacity=".85"/>`;
    return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
  }
  if (key === 'cloud') {
    const lobe = `<g fill="${fill}" stroke="${rim}" stroke-width="1.2"><circle cx="20" cy="56" r="12"/><circle cx="30" cy="46" r="9"/><circle cx="32" cy="62" r="10"/></g><circle cx="19" cy="55" r="4" fill="${spot}" opacity=".7"/>`;
    return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
  }
  const lobe = `<circle cx="29" cy="56" r="17" fill="${fill}" stroke="${rim}" stroke-width="1.4"/><circle cx="29" cy="56" r="10" fill="${fill2}" opacity=".75"/><circle cx="26" cy="50" r="3.4" fill="${spot}"/><path d="M29 39a17 17 0 0 0 0 34" stroke="${shade}" stroke-width="1.4" fill="none" opacity=".5"/>`;
  return `<g class="sprite-wings" pointer-events="none">${sides(lobe)}</g>`;
}

const ARM_STYLES = {
  none: { name: 'No arms', icon: '🚫' },
  nub: { name: 'Nubs', icon: '🫧' },
  paw: { name: 'Paws', icon: '🐾' },
  reach: { name: 'Reach', icon: '🙌' },
  wave: { name: 'Wave', icon: '👋' },
  fin: { name: 'Fins', icon: '🐬' },
  wing: { name: 'Wings', icon: '🪽' },
  mitten: { name: 'Mittens', icon: '🧤' },
  claw: { name: 'Claws', icon: '🦞' },
  tentacle: { name: 'Tentacles', icon: '🐙' },
  hoof: { name: 'Hooves', icon: '🐴' },
};
const ARM_STYLE_KEYS = Object.keys(ARM_STYLES);

const LEG_STYLES = {
  breed: { name: 'Breed feet', icon: '🧬' },
  stub: { name: 'Stubs', icon: '🦶' },
  long: { name: 'Long legs', icon: '🦵' },
  boot: { name: 'Boots', icon: '🥾' },
  hopper: { name: 'Hopper', icon: '🐇' },
  flipper: { name: 'Flippers', icon: '🐟' },
};
Object.assign(LEG_STYLES, {
  wheel: { name: 'Roller wheels', icon: '🛼' },
  crab: { name: 'Crab legs', icon: '🦀' },
  stilt: { name: 'Stilts', icon: '🥢' },
  slipper: { name: 'Slippers', icon: '🩴' },
});
const LEG_STYLE_KEYS = Object.keys(LEG_STYLES);

const EYE_STYLES = {
  classic: { name: 'Classic', icon: '👀' },
  button: { name: 'Button', icon: '⚫' },
  spiral: { name: 'Spiral', icon: '🌀' },
  glow: { name: 'Glow', icon: '🔆' },
  ring: { name: 'Ringed', icon: '⭕' },
  wink: { name: 'Wink', icon: '😉' },
  sparkle: { name: 'Sparkle', icon: '✨' },
  sleepy: { name: 'Sleepy', icon: '😌' },
  wide: { name: 'Wide', icon: '😳' },
  star: { name: 'Star', icon: '⭐' },
  heart: { name: 'Heart', icon: '💗' },
  dot: { name: 'Dots', icon: '⚪' },
  anime: { name: 'Anime', icon: '🌠' },
  lashes: { name: 'Lashes', icon: '💅' },
  pixel: { name: 'Pixel', icon: '🟪' },
  teary: { name: 'Teary', icon: '💧' },
  cross: { name: 'Dizzy', icon: '✖' },
};
Object.assign(EYE_STYLES, {
  galaxy: { name: 'Galaxy', icon: '🌌' },
  flame: { name: 'Flame', icon: '🔥' },
  lens: { name: 'Lens', icon: '🔭' },
  half: { name: 'Half-lidded', icon: '😐' },
  cat: { name: 'Cat', icon: '🐈' },
  void: { name: 'Void', icon: '🕳️' },
  gleam: { name: 'Gleam', icon: '✦' },
});
const EYE_STYLE_KEYS = Object.keys(EYE_STYLES);

/* Hair sits on the crown, in front of the body outline and behind the eyes, so
   it never covers the face. Every style is drawn for this game. */
const HAIR_STYLES = {
  none: { name: 'No hair', icon: '—' },
  waves: { name: 'Wavy fringe', icon: '🌊' },
  curls: { name: 'Curly mop', icon: '🌀' },
  rag: { name: 'Ragged mop', icon: '🧵' },
  long: { name: 'Long waves', icon: '🎐' },
  spikes: { name: 'Spiky', icon: '⚡' },
  bob: { name: 'Bob', icon: '💇' },
  /* Fur styles for the fluff bodies: sculpted tufts rather than hairstyles. */
  crest: { name: 'Crest tuft', icon: '🌾' },
  tufts: { name: 'Little tufts', icon: '🌱' },
  fringe: { name: 'Side fringe', icon: '🍃' },
  mane: { name: 'Long mane', icon: '🦁' },
  ruff: { name: 'Fluff ruff', icon: '🧣' },
  topknot: { name: 'Top knot', icon: '🎀' },
};
const HAIR_STYLE_KEYS = Object.keys(HAIR_STYLES);

/* Fur coats. Each style hugs the body outline, so it reads as a puffle coat on
   the round ball and on every other body type the Studio offers. */
const FUR_STYLES = {
  puffle: { name: 'Puffle fluff', icon: '🐾' },
  cloud: { name: 'Cloud curl', icon: '☁️' },
  tufty: { name: 'Short tufts', icon: '🌿' },
  silky: { name: 'Silky', icon: '✨' },
  shaggy: { name: 'Shaggy', icon: '🧸' },
  curly: { name: 'Curly bobble', icon: '🌀' },
  speckled: { name: 'Speckled', icon: '🔸' },
  plush: { name: 'Plush', icon: '🧶' },
  wavy: { name: 'Wavy', icon: '🌊' },
  smooth: { name: 'Smooth', icon: '⚪' },
  ultra: { name: 'Ultra fluff', icon: '☁️' },
  dream: { name: 'Dream nebula', icon: '✨' },
};
const FUR_STYLE_KEYS = Object.keys(FUR_STYLES);
const FUR_COVER_DEFAULT = 65;

function furMarkup(style, body, c, clipId, sprite, view, expr) {
  const key = FUR_STYLES[style] ? style : 'puffle';
  if (!body || key === 'smooth') return '';
  /* Ultra and dream coats push past the Sprite Puffle into cloud-creature
     territory: the body all but disappears under layered fluff. */
  const ultra = key === 'ultra' || key === 'dream';
  const dream = key === 'dream';
  /* Coverage dial: 0 is a light coat, 100 a shaggy one. It scales tuft
     thickness, tuft size, and how much of the body the coat fills. */
  const coverRaw = sprite && sprite.furCover !== null && sprite.furCover !== undefined ? Number(sprite.furCover) : FUR_COVER_DEFAULT;
  const cover = Math.max(0, Math.min(100, Number.isFinite(coverRaw) ? coverRaw : FUR_COVER_DEFAULT)) / 100;
  /* The Sprite Puffle silhouette carries 30-40% more volume than the old
     coat; the ultra and dream coats go far past that. */
  const tuftScale = (0.55 + cover * 0.7) * (ultra ? 1.92 : 1.32);
  const circleScale = (0.7 + cover * 0.45) * (ultra ? 1.3 : 1);
  const washOpacity = (0.02 + cover * 0.1).toFixed(2);
  const tuftBase = 0.05 + cover * 0.13;
  const ring = (width, dash, color, opacity, offset) => `<path d="${body}" fill="none" stroke="${color}" stroke-width="${(width * tuftScale).toFixed(2)}"${dash ? ` stroke-dasharray="${dash}"` : ''}${offset ? ` stroke-dashoffset="${offset}"` : ''} stroke-linecap="round" opacity="${opacity}"/>`;
  /* Multi-colour fur: every coat is built from the sprite's own light, accent
     and deep tones plus a pale tip, so a custom dye or hue turn colours the
     whole coat. Alternating tufts sit half a dash apart, giving two-tone tips
     around the outline. */
  /* A player-chosen fur pair replaces the palette tints, so the coat can be
     coloured independently of the body. */
  const ownTip = sprite && typeof sprite.furTip === 'string' && /^#[0-9a-f]{6}$/i.test(sprite.furTip) ? sprite.furTip : null;
  const ownAccent = sprite && typeof sprite.furAccent === 'string' && /^#[0-9a-f]{6}$/i.test(sprite.furAccent) ? sprite.furAccent : null;
  const spin = (hex) => rotateHexHue(hex, sprite && sprite.hue);
  const tip = ownTip ? spin(ownTip) : mix(c.light, '#ffffff', 0.5);
  const alt = ownAccent ? spin(ownAccent) : mix(c.accent, c.light, 0.38);
  const two = (width, dash, period, a, b, opA) => ring(width, dash, a, opA) + ring(width, dash, b, '.9', (period / 2).toFixed(2));
  const halo = (width, gap) => ring(width, `0.5 ${gap}`, tip, '.26') + ring(width * 0.72, `0.5 ${gap}`, alt, '.2', ((gap + 0.5) / 2).toFixed(2));
  const mintSoft = mix(tip, '#7fd6ad', 0.76);
  const lilacSoft = mix(tip, '#a98fe0', 0.8);
  const creamHi = mix(tip, '#ffffff', 0.4);
  /* One curl: a round lock with a mint underside, a lavender shadow and a
     white top highlight. Stacking these gives the coat real scalloped locks
     instead of a smooth pale ring. */
  const curl = (x, y, r, fill, rot = 0) => `<g transform="rotate(${rot.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})">
      <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="${fill}" stroke="${mix(c.accent, c.deep, 0.28)}" stroke-width="1.05"/>
      <path d="M${(x - r * 0.74).toFixed(2)} ${(y + r * 0.16).toFixed(2)}a${(r * 0.84).toFixed(2)} ${(r * 0.84).toFixed(2)} 0 0 0 ${(r * 0.9).toFixed(2)} ${(r * 0.42).toFixed(2)}" fill="none" stroke="${mintSoft}" stroke-width="${(r * 0.3).toFixed(2)}" stroke-linecap="round" opacity=".5"/>
      <path d="M${(x - r * 0.52).toFixed(2)} ${(y + r * 0.52).toFixed(2)}a${(r * 0.62).toFixed(2)} ${(r * 0.62).toFixed(2)} 0 0 0 ${(r * 0.8).toFixed(2)} ${(-r * 0.16).toFixed(2)}" fill="none" stroke="${lilacSoft}" stroke-width="${(r * 0.22).toFixed(2)}" stroke-linecap="round" opacity=".55"/>
      <path d="M${(x + r * 0.04).toFixed(2)} ${(y + r * 0.08).toFixed(2)}c${(r * 0.44).toFixed(2)} ${(-r * 0.2).toFixed(2)} ${(r * 0.6).toFixed(2)} ${(r * 0.2).toFixed(2)} ${(r * 0.22).toFixed(2)} ${(r * 0.46).toFixed(2)}c${(-r * 0.32).toFixed(2)} ${(r * 0.24).toFixed(2)} ${(-r * 0.64).toFixed(2)} ${(-r * 0.04).toFixed(2)} ${(-r * 0.42).toFixed(2)} ${(-r * 0.34).toFixed(2)}" fill="none" stroke="${lilacSoft}" stroke-width="${(r * 0.16).toFixed(2)}" stroke-linecap="round" opacity=".8"/>
      <path d="M${(x - r * 0.46).toFixed(2)} ${(y - r * 0.36).toFixed(2)}a${(r * 0.62).toFixed(2)} ${(r * 0.62).toFixed(2)} 0 0 1 ${(r * 0.58).toFixed(2)} ${(-r * 0.04).toFixed(2)}" fill="none" stroke="#ffffff" stroke-width="${(r * 0.13).toFixed(2)}" stroke-linecap="round" opacity=".6"/>
    </g>`;
  /* Full-body coat: a soft wash and scattered hairy circles clipped to the
     silhouette, so the fur covers every body type and every body shape. The
     tuft rings above it are the outer layer of the same coat. */
  const furCircles = [
    [40, 40, 11], [62, 34, 12], [84, 44, 10], [30, 58, 12], [54, 54, 13],
    [78, 60, 12], [42, 74, 12], [66, 72, 13], [88, 78, 10], [26, 80, 10],
    [58, 90, 11], [80, 92, 9], [34, 96, 8], [92, 96, 8], [60, 104, 8],
  ];
  const furDots = [
    [46, 46, 3.4], [70, 42, 3], [58, 64, 3.6], [34, 68, 3], [82, 70, 3.2],
    [48, 86, 3.4], [72, 84, 3], [62, 100, 3], [38, 54, 2.6], [88, 58, 2.6],
  ];
  const texture = clipId
    ? `<g class="fur-coat" clip-path="url(#${clipId})" pointer-events="none">
        <ellipse cx="60" cy="64" rx="42" ry="45" fill="${tip}" opacity="${washOpacity}"/>
        <g>${furCircles.slice(0, Math.round(4 + cover * 14)).map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${(r * circleScale).toFixed(1)}" fill="${i % 2 ? alt : tip}" stroke="${alt}" stroke-width=".7" opacity="${(tuftBase + (i % 3) * 0.04).toFixed(2)}"/>`).join('')}</g>
        <g fill="${alt}">${furDots.slice(0, Math.round(cover * 10)).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${(r * circleScale).toFixed(1)}" opacity="${(0.08 + cover * 0.12).toFixed(2)}"/>`).join('')}</g>
      </g>`
    : '';
  /* Layered rounded tufts: crown, cheeks, chest, paws and tail. Soft circles
     over the coat, never spikes, so the silhouette stays huggable. */
  const puff = (x, y, r, op, fill = tip) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${alt}" stroke-width="1" opacity="${op}"/>`;
  /* Ultra and dream wear a pile of separate curls: a scalloped cream outer
     ring, a pastel mint/lavender underlayer and a few crown and hem locks, so
     the coat reads as stacked curls instead of one smooth pale disc. */
  const ultraCurls = ultra ? `<g class="ultra-curls">
      ${Array.from({ length: 11 }, (_, i) => {
        const a = ((-90 + i * (360 / 11)) * Math.PI) / 180;
        const r = (10.8 + (i % 4) * 1.1) * (0.9 + cover * 0.18);
        const fill = i % 4 === 0 ? creamHi : i % 4 === 2 ? mix(tip, lilacSoft, 0.42) : tip;
        return curl(60 + Math.cos(a) * 33 + (i % 2 ? 1.6 : -1.6), 62 + Math.sin(a) * 35, r, fill, i % 2 ? 9 : -9);
      }).join('')}
      ${Array.from({ length: 8 }, (_, i) => {
        const a = ((-67.5 + i * 45) * Math.PI) / 180;
        return curl(60 + Math.cos(a) * 26, 62 + Math.sin(a) * 28, 8.8, mix(tip, i % 2 ? mintSoft : lilacSoft, 0.52), i % 2 ? -12 : 12);
      }).join('')}
      ${curl(50, 24, 8.2, creamHi, -14)}${curl(69, 22, 9, tip, 10)}
      ${curl(45, 108, 6.4, tip, 8)}${curl(75, 108, 6.4, tip, -8)}${curl(60, 111, 6, creamHi, 0)}
    </g>` : '';
  const puffs = ultra ? '' : `<g class="puff-tufts" pointer-events="none">
      ${puff(46, 27, 7.4, '.95')}${puff(60, 23, 8.4, '.97')}${puff(74, 27, 7.4, '.95')}
      ${puff(32, 80, 8.6, '.92')}${puff(88, 80, 8.6, '.92')}
      ${puff(60, 95, 8.2, '.92')}
      ${puff(45, 106, 5.4, '.88')}${puff(75, 106, 5.4, '.88')}
      ${view === 'side' || view === 'back' ? puff(22, 88, 7.6, '.9') : ''}
    </g>`;
  let coat = '';
  if (key === 'puffle') coat = halo(19, 9.6) + two(12.5, '0.5 7.4', 7.9, c.light, alt, '.99') + ring(5, '0.4 7.4', c.deep, '.4', '1.9');
  else if (key === 'cloud') coat = halo(21, 13) + two(14.5, '0.5 10.4', 10.9, c.light, alt, '.98') + ring(5.4, '0.6 10.4', c.deep, '.32', '2.6');
  else if (key === 'tufty') coat = halo(18, 9) + two(12.6, '3 6.6', 9.6, c.light, alt, '.99') + ring(4.2, '2.8 6.8', c.deep, '.34', '1.6');
  else if (key === 'silky') coat = ring(12, '', alt, '.32') + ring(6.8, '', c.light, '.96') + ring(3, '10 18', tip, '.55', '4') + ring(2, '', c.deep, '.36');
  else if (key === 'shaggy') coat = halo(22, 12) + two(19, '1.6 5.8', 7.4, c.light, alt, '.92') + ring(7, '1.2 6', c.deep, '.26', '2.4');
  else if (key === 'curly') coat = halo(18, 11) + two(11.2, '0.5 8.6', 9.1, c.light, alt, '.99') + ring(4.8, '0.5 8.6', c.deep, '.3', '2.2');
  else if (key === 'speckled') {
    /* A thick dotted rim plus flecks inside the coat in three tones. */
    const dots = [[34, 42], [50, 32], [68, 40], [84, 52], [40, 58], [58, 50], [78, 66], [30, 74], [50, 82], [72, 84], [90, 74], [60, 94], [44, 36], [74, 34], [62, 62], [36, 88], [82, 88], [56, 44], [66, 76], [42, 68]];
    const speckles = clipId ? `<g clip-path="url(#${clipId})" opacity=".7">${dots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${(1.2 + (i % 3) * 0.7).toFixed(1)}" fill="${i % 3 === 0 ? tip : i % 3 === 1 ? alt : c.light}"/>`).join('')}</g>` : '';
    coat = halo(19, 8.4) + two(10, '0.5 4.9', 5.4, c.light, alt, '.97') + ring(4, '0.5 4.9', c.deep, '.3', '1.5') + speckles;
  } else if (key === 'plush') {
    /* A wide velvet halo around a neat clipped edge rather than spikes. */
    coat = ring(21, '', alt, '.42') + ring(13, '', tip, '.34') + two(11, '0.5 6.6', 7.1, c.light, alt, '.99') + ring(4.4, '0.5 6.6', c.deep, '.3', '1.8');
  } else if (key === 'wavy') {
    /* Two offset scalloped rings weave along the outline like combed waves. */
    coat = halo(20, 10) + two(10, '3.6 3.4', 7, c.light, alt, '.99') + ring(5.2, '3.6 3.4', c.deep, '.38', '3.5') + ring(2.2, '3.2 3.8', tip, '.6', '1.7');
  }
  /* Woodland sparkle dust for the ultra coat; the dream coat wears stars. */
  const magic = ultra ? `<g class="puff-magic" pointer-events="none" fill="${tip}" opacity=".9">
      ${dream
        ? `<path d="M16 44l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8Z"/><path d="M101 30l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4Z"/><path d="M104 74l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2Z"/>`
        : `<circle cx="20" cy="48" r="2"/><circle cx="99" cy="62" r="1.7"/><circle cx="88" cy="20" r="1.4"/><circle cx="31" cy="22" r="1.6"/>`}
    </g>` : '';
  const mood = expr === 'sleep' ? ' is-asleep' : (expr === 'happy' || expr === 'eat' || expr === 'love') ? ' is-puffy' : '';
  return `<g class="starlit-fluff${mood}" pointer-events="none">${texture}${ultraCurls}${puffs}${coat}${magic}</g>`;
}

/* Soft fluff brows and a tiny button nose peeking through the coat. */
function puffleFaceMarkup(c, sprite) {
  if (!sprite || sprite.fur === 'smooth') return '';
  const brow = `<g stroke="${c.light}" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".95"><path d="M38 46c4-3 9-3 13 0"/><path d="M69 46c4-3 9-3 13 0"/></g>`;
  const nose = !sprite.nose || sprite.nose === 'none'
    ? `<ellipse cx="60" cy="73" rx="3.1" ry="2.4" fill="${c.deep}" opacity=".72"/>`
    : '';
  return `<g class="puffle-face" pointer-events="none">${brow}${nose}</g>`;
}

/* One oversized forelock droops over an eye on the ultra coats. */
function ultraForelockMarkup(c) {
  return `<g class="ultra-forelock" pointer-events="none">
      <path d="M31 45c2-9 12-15 21-13 6 1 8 5 5 8-3 3-9 2-13 4-4 2-6 5-7 9-2 4-7 4-9 1-1-2-1-5 3-9Z" fill="${mix(c.light, '#ffffff', 0.55)}" stroke="${mix(c.accent, c.deep, 0.3)}" stroke-width=".9" opacity=".97"/>
    </g>`;
}

/* The ultra tail is a second body: a chain of cloud lobes curving down the
   right side, so it keeps its own silhouette clear of the coat. The dream
   coat fills the same lobes with a nebula and a small constellation. */
function ultraTailMarkup(c, dream, id) {
  const rim = mix(c.deep, c.accent, 0.26);
  const base = dream ? `url(#neb-${id})` : mix(c.accent, '#ffffff', 0.38);
  const under = dream ? mix(c.accent, c.deep, 0.45) : mix(c.deep, c.accent, 0.32);
  const star = (x, y, r) => `<path d="M${x} ${(y - r).toFixed(2)}l${(r * 0.42).toFixed(2)} ${(r * 0.9).toFixed(2)}${(r * 0.9).toFixed(2)} ${(r * 0.34).toFixed(2)}-${(r * 0.9).toFixed(2)} ${(r * 0.34).toFixed(2)}-${(r * 0.42).toFixed(2)} ${(r * 0.9).toFixed(2)}-${(r * 0.42).toFixed(2)}-${(r * 0.9).toFixed(2)}-${(r * 0.9).toFixed(2)}-${(r * 0.34).toFixed(2)}${(r * 0.9).toFixed(2)}-${(r * 0.34).toFixed(2)}Z" fill="#fff" opacity=".92"/>`;
  const lobe = (x, y, r) => `<g>
      <circle cx="${x}" cy="${y}" r="${r}" fill="${base}" stroke="${rim}" stroke-width="1.3" opacity=".98"/>
      <path d="M${(x - r * 0.62).toFixed(2)} ${(y + r * 0.24).toFixed(2)}a${(r * 0.78).toFixed(2)} ${(r * 0.78).toFixed(2)} 0 0 0 ${(r * 0.9).toFixed(2)} ${(r * 0.3).toFixed(2)}" fill="none" stroke="${under}" stroke-width="${(r * 0.26).toFixed(1)}" stroke-linecap="round" opacity=".55"/>
      <path d="M${(x - r * 0.4).toFixed(2)} ${(y - r * 0.34).toFixed(2)}a${(r * 0.62).toFixed(2)} ${(r * 0.62).toFixed(2)} 0 0 1 ${(r * 0.58).toFixed(2)} ${(-r * 0.02).toFixed(2)}" fill="none" stroke="#ffffff" stroke-width="${(r * 0.12).toFixed(1)}" stroke-linecap="round" opacity=".5"/>
    </g>`;
  const stars = dream
    ? `${star(112, 58, 1.9)}${star(104, 68, 1.3)}${star(116, 88, 1.6)}${star(99, 98, 1.2)}${star(92, 110, 1.4)}
       <path d="M104 68L112 58L116 88L99 98" stroke="#ffffff" stroke-width=".5" fill="none" opacity=".35" stroke-linejoin="round"/>`
    : `<g fill="${mix(c.light, '#ffffff', 0.5)}" opacity=".7"><circle cx="112" cy="62" r="1.7"/><circle cx="108" cy="92" r="1.4"/><circle cx="101" cy="108" r="1.5"/></g>`;
  return `<g class="ultra-tail" pointer-events="none">
      ${lobe(95, 58, 11)}${lobe(106, 65, 10)}${lobe(110, 78, 9)}${lobe(106, 92, 10)}${lobe(96, 103, 11)}
      ${stars}
    </g>`;
}

/* A single giant curl sweeps around the right hip, so the tail keeps a
   readable outline even where the coat would otherwise swallow it. */
function ultraTailTipMarkup(c, dream, id) {
  const rim = mix(c.deep, c.accent, 0.26);
  const base = dream ? `url(#neb-${id})` : mix(c.accent, '#ffffff', 0.35);
  const mint = mix(base, '#7fd6ad', 0.45);
  const lilac = mix(c.accent, c.deep, 0.32);
  const stars = dream
    ? `<g fill="#fff" opacity=".9"><circle cx="104" cy="84" r="1.4"/><circle cx="110" cy="98" r="1.1"/><circle cx="97" cy="106" r="1"/></g>`
    : '';
  return `<g class="ultra-tail-tip" pointer-events="none">
      <path d="M80 82c6-6 16-7 24-2 8 5 12 15 9 24-3 8-12 13-20 10-6-2-9-8-7-13 2-4 7-5 10-2 3 2 3 6 1 8Z" fill="${base}" opacity=".99"/>
      <path d="M80 82c6-6 16-7 24-2 8 5 12 15 9 24-3 8-12 13-20 10" fill="none" stroke="${rim}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M83 94c2-9 11-15 20-13" fill="none" stroke="${mint}" stroke-width="5" stroke-linecap="round" opacity=".55"/>
      <path d="M92 104c-4-2-5-7-2-10 3-3 8-2 9 2 1 3-1 6-4 6" fill="none" stroke="${lilac}" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>
      <path d="M84 86c5-4 12-5 18-2" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity=".6"/>
      ${stars}
    </g>`;
}

/* Ancient Dream leaves a trail of constellation dots behind it. The dots
   pulse in sequence so the trail reads as fresh starlight, not a static decal. */
function dreamTrailMarkup(c) {
  const star = (x, y, r, cls) => `<path class="dream-star ${cls}" d="M${x} ${(y - r).toFixed(2)}l${(r * 0.5).toFixed(2)} ${(r * 0.9).toFixed(2)}${(r * 0.9).toFixed(2)} ${(r * 0.5).toFixed(2)}-${(r * 0.9).toFixed(2)} ${(r * 0.5).toFixed(2)}-${(r * 0.5).toFixed(2)} ${(r * 0.9).toFixed(2)}-${(r * 0.5).toFixed(2)}-${(r * 0.9).toFixed(2)}-${(r * 0.9).toFixed(2)}-${(r * 0.5).toFixed(2)}${(r * 0.9).toFixed(2)}-${(r * 0.5).toFixed(2)}Z" fill="${c.light}"/>`;
  return `<g class="dream-trail" pointer-events="none">
      <path class="trail-line" d="M21 99L11 91L4 81L12 72L4 63" stroke="${mix(c.light, '#ffffff', 0.4)}" stroke-width=".7" fill="none" opacity=".22"/>
      ${star(21, 99, 2.6, 't1')}${star(11, 91, 2.1, 't2')}${star(4, 81, 1.7, 't3')}${star(12, 72, 1.9, 't4')}${star(4, 63, 1.4, 't5')}
    </g>`;
}

/* Napping props: a blanket tucked around the body and drifting Z's. */
function napPropsMarkup(c) {
  const cloth = mix(c.accent, c.light, 0.42);
  return `<g class="sleep-props" pointer-events="none">
      <path class="nap-blanket" d="M25 90c9-6 22-9 35-9s26 3 35 9c5 3 7 7 7 11 0 4-3 7-7 7H25c-4 0-7-3-7-7 0-4 2-8 7-11Z" fill="${cloth}" stroke="${c.deep}" stroke-width="1.2" opacity=".95"/>
      <path d="M31 97c11-4 21-5 29-5s18 1 29 5" stroke="#fff" stroke-width="2.2" fill="none" opacity=".5" stroke-linecap="round"/>
      <path class="nap-z nap-z1" d="M86 42h9l-9 8h9" stroke="${c.light}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="nap-z nap-z2" d="M98 31h6.5l-6.5 5.6h6.5" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
      <circle class="nap-star" cx="28" cy="42" r="1.6" fill="${c.light}" opacity=".8"/>
    </g>`;
}

/* Hair covers the body as a soft undercoat too: tufts and strands clipped to
   the silhouette, with the chosen hair style layered on top of it. */
function hairCoverMarkup(body, clipId, c) {
  if (!body || !clipId) return '';
  return `<g class="hair-coat" clip-path="url(#${clipId})" pointer-events="none">
      <g fill="${c.body}" opacity=".3">
        <circle cx="34" cy="48" r="10"/><circle cx="52" cy="40" r="11"/><circle cx="70" cy="38" r="11"/><circle cx="88" cy="50" r="9"/>
        <circle cx="44" cy="66" r="11"/><circle cx="62" cy="64" r="12"/><circle cx="80" cy="70" r="10"/>
        <circle cx="54" cy="86" r="10"/><circle cx="72" cy="90" r="9"/><circle cx="60" cy="102" r="8"/>
      </g>
      <g stroke="${c.deep}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".32">
        <path d="M30 40c6 14 4 30 2 42"/><path d="M46 32c5 16 3 34 1 48"/><path d="M62 30c5 18 3 36 1 50"/>
        <path d="M78 34c4 16 2 32 0 46"/><path d="M92 42c3 12 1 26-1 38"/>
      </g>
      <g stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5">
        <path d="M38 46c5 12 4 26 2 38"/><path d="M54 40c4 14 3 28 1 42"/><path d="M70 38c4 16 2 30 1 44"/><path d="M86 46c3 12 2 24 0 34"/>
      </g>
    </g>`;
}

function hairMarkup(style, c) {
  if (!style || style === 'none') return '';
  const edge = `stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"`;
  if (style === 'waves') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M33 52c0-15 11-25 27-25s27 10 27 25c-5-5-8 0-12-3-4-3-7 3-12-1-5-4-8 2-12-2-4-4-7 2-11 0-3-2-5 2-7 6Z"/>
      <path d="M38 42c5-6 12-9 22-9" stroke="${c.light}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M36 50c6-3 10 1 14-2M64 48c5-3 9 1 14-1" stroke="${c.light}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".55"/>
    </g>`;
  }
  if (style === 'curls') {
    return `<g fill="${c.body}" ${edge}>
      <circle cx="40" cy="37" r="9"/><circle cx="52" cy="30" r="8"/><circle cx="60" cy="28" r="9"/>
      <circle cx="68" cy="30" r="8"/><circle cx="80" cy="37" r="9"/>
      <circle cx="46" cy="33" r="2.4" fill="${c.light}" stroke="none" opacity=".75"/>
      <circle cx="66" cy="31" r="2" fill="${c.light}" stroke="none" opacity=".65"/>
    </g>`;
  }
  if (style === 'rag') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M33 50c0-14 11-24 27-24s27 10 27 24l-6 7-5-9-6 10-5-10-5 10-5-10-6 10-6-9-5 7Z"/>
      <path d="M42 38l-3 9M54 32l-2 10M66 32l2 10M78 38l3 9" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'long') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M33 50c0-15 11-25 27-25s27 10 27 25v33c-4 4-9 0-9-6V53c-5-5-11-8-18-8s-13 3-18 8v24c0 6-5 10-9 6Z"/>
      <path d="M40 44c4-5 10-8 20-8" stroke="${c.light}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
    </g>`;
  }
  if (style === 'spikes') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M32 53c2-9 5-13 9-15l2 9 6-15 5 11 7-15 6 14 6-12 5 13 4-9c4 4 5 10 5 19-6-4-10 0-14-3-4-3-8 2-12-1-4-3-8 2-12 0-4-2-8 3-12 4Z"/>
    </g>`;
  }
  if (style === 'bob') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M32 51c0-15 12-25 28-25s28 10 28 25v11c-3 2-6 0-7-4-4-7-11-10-21-10s-17 3-21 10c-1 4-4 6-7 4Z"/>
      <path d="M40 44c6-5 12-7 20-7s14 2 20 7" stroke="${c.light}" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'crest') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M52 34c-4-9 0-17 7-19 4-1 7 1 7 4 0 3-3 4-5 5-4 2-6 6-5 10Z"/>
      <path d="M66 29c1-6 6-10 11-8 3 1 4 4 3 6-1 2-4 2-6 2-3 0-5 2-6 5Z"/>
      <path d="M56 30c-1-5 1-9 4-11" stroke="${c.light}" stroke-width="1.8" fill="none" opacity=".6" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'tufts') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M34 46c-4-7-2-13 4-14 3-1 5 1 5 4 0 2-2 3-3 5-2 2-2 4-1 6Z"/>
      <path d="M53 34c-4-9-1-15 6-15 4 0 6 2 6 5 0 3-3 4-5 5-2 2-3 4-2 6Z"/>
      <path d="M74 42c-3-7-1-12 4-13 3-1 5 1 5 4 0 2-2 3-3 5-1 1-1 3 0 5Z"/>
    </g>`;
  }
  if (style === 'fringe') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M34 52c0-16 12-27 28-26 9 1 15 4 19 9-9-1-15 2-19 7-3 4-6 6-10 5-5-1-9 1-11 5-2 3-4 4-7 0Z"/>
      <path d="M42 41c7-7 15-10 24-9" stroke="${c.light}" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'mane') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M33 42c-5 13-4 24 2 33-6 5-10 13-8 20 4 1 8-2 9-6 1-4 3-7 6-9 1 5 4 9 8 11-2-6-3-12-2-18-3-9-6-19-5-31Z"/>
      <path d="M87 42c5 13 4 24-2 33 6 5 10 13 8 20-4 1-8-2-9-6-1-4-3-7-6-9-1 5-4 9-8 11 2-6 3-12 2-18 3-9 6-19 5-31Z"/>
      <path d="M38 54c-2 8-1 15 2 21M82 54c2 8 1 15-2 21" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'ruff') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M41 79c-6-3-7-11-1-14 3-1 6 0 8 3 1-6 5-10 10-10-2-4 1-8 5-8s7 4 5 8c5 0 9 4 10 10 2-3 5-4 8-3 6 3 5 11-1 14-8 6-17 9-22 9s-14-3-22-9Z"/>
      <path d="M40 76c7 5 14 7 20 7s13-2 20-7" stroke="${c.light}" stroke-width="1.7" fill="none" opacity=".5" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'topknot') {
    return `<g fill="${c.body}" ${edge}>
      <path d="M52 30c-2-8 2-14 8-14s10 6 8 14c-2 4-4 6-8 6s-6-2-8-6Z"/>
      <rect x="48" y="28" width="24" height="5" rx="2.5" fill="${c.accent}" stroke="none"/>
    </g>`;
  }
  return '';
}

/* Noses sit between the eyes and the mouth, so they read on every expression. */
const NOSE_STYLES = {
  none: { name: 'No nose', icon: '—' },
  button: { name: 'Button', icon: '•' },
  heart: { name: 'Heart', icon: '♥' },
  star: { name: 'Star', icon: '★' },
  snout: { name: 'Snout', icon: '🐽' },
  beak: { name: 'Beak', icon: '🐤' },
  whisker: { name: 'Whiskers', icon: '🐱' },
  gem: { name: 'Gem', icon: '💎' },
};
const NOSE_STYLE_KEYS = Object.keys(NOSE_STYLES);

function noseMarkup(style, c) {
  if (!style || style === 'none') return '';
  if (style === 'button') return `<ellipse cx="60" cy="69" rx="3.2" ry="2.4" fill="${c.deep}" opacity=".85"/>`;
  if (style === 'heart') return `<path d="M60 72c-2.4-3.2-6.4-1.4-6.4 1.8 0 3.2 6.4 6.2 6.4 6.2s6.4-3 6.4-6.2c0-3.2-4-5-6.4-1.8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".8"/>`;
  if (style === 'star') return `<path d="M60 66l1.7 3.3 3.7.5-2.7 2.6.6 3.7-3.3-1.8-3.3 1.8.6-3.7-2.7-2.6 3.7-.5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".7"/>`;
  if (style === 'snout') return `<g><ellipse cx="60" cy="70" rx="8.4" ry="5.6" fill="${c.light}" stroke="${c.deep}" stroke-width=".9" opacity=".95"/><ellipse cx="57.2" cy="69.4" rx="1.4" ry="1.9" fill="${c.deep}"/><ellipse cx="62.8" cy="69.4" rx="1.4" ry="1.9" fill="${c.deep}"/></g>`;
  if (style === 'beak') return `<path d="M53 68h14l-7 7Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".9" stroke-linejoin="round"/>`;
  if (style === 'whisker') return `<g stroke="${c.deep}" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"><path d="M52 68.5 40 66M52 71l-12 .4M68 68.5 80 66M68 71l12 .4"/><ellipse cx="60" cy="69.6" rx="2.4" ry="1.8" fill="${c.accent}" stroke="none"/></g>`;
  if (style === 'gem') return `<path d="M60 65l4.2 4.4L60 74.6 55.8 69.4Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".8"/>`;
  return '';
}

/* Wearables: original headwear and neckwear, drawn over hair and body so any
   breed, body type or hairstyle can carry them. */
const HAT_STYLES = {
  none: { name: 'No hat', icon: '—' },
  crown: { name: 'Crown', icon: '👑' },
  beanie: { name: 'Beanie', icon: '🧶' },
  bow: { name: 'Bow', icon: '🎀' },
  leafcrown: { name: 'Crystal leaf crown', icon: '👑' },
  headphones: { name: 'Headphones', icon: '🎧' },
  cap: { name: 'Cap', icon: '🧢' },
  wizard: { name: 'Wizard hat', icon: '🧙' },
};
const HAT_STYLE_KEYS = Object.keys(HAT_STYLES);

function hatMarkup(style, c) {
  if (!style || style === 'none') return '';
  /* Royal Puffle: a crown of enchanted crystal leaves. */
  if (style === 'leafcrown') {
    return `<g class="hat-leafcrown" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round">
      <path d="M43 28 L49 15 L55 28 Z" fill="${c.accent}" opacity=".95"/>
      <path d="M54 27 L60 9 L66 27 Z" fill="${c.light}"/>
      <path d="M65 28 L71 15 L77 28 Z" fill="${c.accent}" opacity=".95"/>
      <path d="M42 27 H78" stroke="${c.light}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="49" cy="20" r="1.4" fill="#ffffff" opacity=".85"/>
      <circle cx="71" cy="20" r="1.4" fill="#ffffff" opacity=".85"/>
    </g>`;
  }
  if (style === 'crown') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M44 36l-4-16 10 7 10-11 10 11 10-7-4 16Z" fill="${c.accent}"/>
      <rect x="44" y="35" width="32" height="6" rx="2.6" fill="${c.light}"/>
      <circle cx="60" cy="30" r="2.6" fill="${c.light}"/><circle cx="49" cy="33" r="1.8" fill="${c.light}"/><circle cx="71" cy="33" r="1.8" fill="${c.light}"/>
    </g>`;
  }
  if (style === 'beanie') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M40 34c0-9 9-15 20-15s20 6 20 15Z" fill="${c.accent}"/>
      <rect x="38" y="32" width="44" height="7" rx="3.5" fill="${c.light}"/>
      <circle cx="60" cy="14" r="5" fill="${c.light}"/>
      <path d="M46 34c0-6 4-10 9-12" stroke="${c.deep}" stroke-width="1" fill="none" opacity=".4"/>
    </g>`;
  }
  if (style === 'bow') {
    return `<g transform="rotate(-12 44 30)" stroke="${c.deep}" stroke-width="1.1">
      <path d="M44 30c-9-7-15-2-15 0s6 7 15 0Z" fill="${c.accent}"/>
      <path d="M44 30c9-7 15-2 15 0s-6 7-15 0Z" fill="${c.accent}"/>
      <circle cx="44" cy="30" r="3.4" fill="${c.light}"/>
    </g>`;
  }
  if (style === 'headphones') {
    return `<g fill="none" stroke="${c.deep}" stroke-width="4" stroke-linecap="round">
      <path d="M32 50c0-16 12-27 28-27s28 11 28 27"/>
    </g>
    <g stroke="${c.deep}" stroke-width="1.1">
      <rect x="26" y="44" width="11" height="17" rx="5.5" fill="${c.accent}"/>
      <rect x="83" y="44" width="11" height="17" rx="5.5" fill="${c.accent}"/>
      <circle cx="31.5" cy="52.5" r="2" fill="${c.light}" stroke="none"/><circle cx="88.5" cy="52.5" r="2" fill="${c.light}" stroke="none"/>
    </g>`;
  }
  if (style === 'cap') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M38 36c0-10 10-17 22-17s22 7 22 17Z" fill="${c.accent}"/>
      <path d="M60 36h24c5 0 8 3 8 6H60Z" fill="${c.light}"/>
      <circle cx="60" cy="19" r="2.4" fill="${c.light}"/>
    </g>`;
  }
  if (style === 'wizard') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M60 6l16 30H44Z" fill="${c.accent}"/>
      <path d="M39 36h42" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="55" cy="24" r="1.7" fill="${c.light}"/><circle cx="65" cy="31" r="1.3" fill="${c.light}"/>
    </g>`;
  }
  return '';
}

const SCARF_STYLES = {
  none: { name: 'None', icon: '—' },
  scarf: { name: 'Scarf', icon: '🧣' },
  bandana: { name: 'Bandana', icon: '🔺' },
  bowtie: { name: 'Bow tie', icon: '🎗️' },
};
const SCARF_STYLE_KEYS = Object.keys(SCARF_STYLES);

function scarfMarkup(style, c) {
  if (!style || style === 'none') return '';
  if (style === 'scarf') {
    return `<g stroke="${c.deep}" stroke-width="1">
      <path d="M38 84c0-5 9-8 22-8s22 3 22 8-9 8-22 8-22-3-22-8Z" fill="${c.accent}"/>
      <path d="M73 88l7 15-10 2-5-14Z" fill="${c.accent}"/>
      <path d="M52 90c5 2 11 2 16 0" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  if (style === 'bandana') {
    return `<g stroke="${c.deep}" stroke-width="1">
      <path d="M38 86c0-4 10-6 22-6s22 2 22 6-10 6-22 6-22-2-22-6Z" fill="${c.accent}"/>
      <path d="M60 92l7 12H53Z" fill="${c.accent}"/>
    </g>`;
  }
  if (style === 'bowtie') {
    return `<g stroke="${c.deep}" stroke-width="1">
      <path d="M44 87l14 5-14 5Z" fill="${c.accent}"/>
      <path d="M76 87l-14 5 14 5Z" fill="${c.accent}"/>
      <circle cx="60" cy="92" r="3" fill="${c.light}"/>
    </g>`;
  }
  return '';
}

function eyeMarkup(expr, baby, delay, style = 'classic', c = { accent: '#8be9ff' }) {
  const rx = baby ? 7.4 : 6.5;
  const ry = baby ? 9.2 : 8;
  const eye = (x) => {
    if (style === 'star') return `<path d="M${x} 52l2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9Z" fill="#1d1734"/>`;
    if (style === 'heart') return `<path d="M${x} 56.5c-3.6-4.8-9.8-2-9.8 2.8 0 4.8 9.8 9.7 9.8 9.7s9.8-4.9 9.8-9.7c0-4.8-6.2-7.6-9.8-2.8Z" fill="#1d1734"/>`;
    if (style === 'sleepy') return `<g><path d="M${x - 7.5} 59q7.5 5.5 15 0" stroke="#1d1734" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x - 8} 53.5h16" stroke="#1d1734" stroke-width="3" stroke-linecap="round"/></g>`;
    if (style === 'wide') return `<g><ellipse cx="${x}" cy="60" rx="${rx + 1.8}" ry="${ry + 1.5}" fill="#ffffff"/><ellipse cx="${x}" cy="60.6" rx="${rx - 2.5}" ry="${ry - 2.1}" fill="#1d1734"/><circle cx="${x + 2}" cy="56.4" r="2" fill="#ffffff"/><circle cx="${x - 2}" cy="63.6" r="1.1" fill="#ffffff" opacity=".55"/></g>`;
    if (style === 'button') return `<g><ellipse cx="${x}" cy="60" rx="${rx + 1.6}" ry="${ry + 1.4}" fill="#1d1734"/><circle cx="${x + 2.4}" cy="56" r="${baby ? 3 : 2.6}" fill="#ffffff"/><circle cx="${x - 2.4}" cy="63.4" r="1.2" fill="#ffffff" opacity=".5"/></g>`;
    if (style === 'ring') return `<g><ellipse cx="${x}" cy="60" rx="${rx + 1.4}" ry="${ry + 1.2}" fill="#ffffff"/><ellipse cx="${x}" cy="60" rx="${rx - 1.2}" ry="${ry - 1}" fill="none" stroke="#1d1734" stroke-width="2.4"/><circle cx="${x}" cy="60" r="${baby ? 2.6 : 2.2}" fill="#1d1734"/></g>`;
    if (style === 'glow') return `<g><circle cx="${x}" cy="60" r="${ry + 3.4}" fill="${c.accent}" opacity=".22"/><circle cx="${x}" cy="60" r="${ry - 0.5}" fill="${c.accent}"/><circle cx="${x + 2}" cy="56.6" r="2.2" fill="#ffffff" opacity=".9"/></g>`;
    if (style === 'spiral') return `<g><ellipse cx="${x}" cy="60" rx="${rx + 1.2}" ry="${ry + 1}" fill="#ffffff"/><path d="M${x + 1} 54a6.5 6.5 0 1 0-5.8 9.4" stroke="#1d1734" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${x + 1} 57.5a3 3 0 1 0-2.6 4.4" stroke="#1d1734" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;
    if (style === 'wink') return x < 60
      ? `<path d="M${x - 7.5} 61q7.5 -8 15 0" stroke="#1d1734" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      : `<g class="b-eye" style="animation-delay:${delay}s"><ellipse cx="${x}" cy="60" rx="${rx}" ry="${ry}" fill="#1d1734"/><circle cx="${x + 2}" cy="56.6" r="${baby ? 2.9 : 2.4}" fill="#ffffff"/></g>`;
    if (style === 'dot') return `<g class="b-eye" style="animation-delay:${delay}s"><circle cx="${x}" cy="60" r="${baby ? 3.6 : 3.1}" fill="#1d1734"/><circle cx="${x + 1}" cy="58.6" r="1" fill="#ffffff" opacity=".85"/></g>`;
    if (style === 'anime') return `<g class="b-eye" style="animation-delay:${delay}s"><ellipse cx="${x}" cy="60" rx="${rx + 1.6}" ry="${ry + 1.4}" fill="#1d1734"/><ellipse cx="${x + 1.6}" cy="56" rx="${baby ? 4.2 : 3.6}" ry="${baby ? 4.8 : 4.2}" fill="#ffffff"/><circle cx="${x - 2.8}" cy="63.8" r="${baby ? 2.2 : 1.8}" fill="${c.accent}"/></g>`;
    if (style === 'lashes') return `<g class="b-eye" style="animation-delay:${delay}s"><ellipse cx="${x}" cy="60" rx="${rx}" ry="${ry}" fill="#1d1734"/><circle cx="${x + 2}" cy="56.6" r="${baby ? 2.9 : 2.4}" fill="#ffffff"/><path d="M${x - 8} 52.5l-3.4-2.6M${x - 4} 50.6l-2-3.2M${x + 4} 50.6l2-3.2" stroke="#1d1734" stroke-width="1.5" stroke-linecap="round" fill="none"/></g>`;
    if (style === 'pixel') return `<g class="b-eye" style="animation-delay:${delay}s" fill="#1d1734"><rect x="${x - 6}" y="55" width="5" height="5"/><rect x="${x + 1}" y="55" width="5" height="5"/><rect x="${x - 2}" y="59" width="5" height="5"/><rect x="${x - 6}" y="63" width="5" height="3"/><rect x="${x + 1}" y="62" width="5" height="3"/></g>`;
    if (style === 'teary') return `<g class="b-eye" style="animation-delay:${delay}s"><ellipse cx="${x}" cy="60" rx="${rx + 1}" ry="${ry + 1}" fill="#ffffff"/><ellipse cx="${x}" cy="60.6" rx="${rx - 1.4}" ry="${ry - 1.2}" fill="#1d1734"/><circle cx="${x + 2}" cy="56" r="${baby ? 3 : 2.4}" fill="#ffffff"/><path d="M${x + 4} 66c-1.8 3 0 5.4 2 5.4s3.8-2.4 2-5.4Z" fill="${c.accent}" opacity=".75"/></g>`;
    if (style === 'galaxy') return `<g><circle cx="${x}" cy="60" r="${ry + 2.4}" fill="#131a3a"/><circle cx="${x}" cy="60" r="${ry + 2.4}" fill="none" stroke="${c.accent}" stroke-width="1.4" opacity=".8"/><circle cx="${x - 2}" cy="57" r="1.2" fill="#ffffff"/><circle cx="${x + 3}" cy="61" r=".9" fill="${c.accent}"/><circle cx="${x}" cy="64" r=".7" fill="#ffffff" opacity=".8"/></g>`;
    if (style === 'flame') return `<g><ellipse cx="${x}" cy="60" rx="${rx}" ry="${ry}" fill="#1d1734"/><path d="M${x} 53c3.4 4 5 6.4 5 9.2 0 3.4-2.6 6-5 6s-5-2.6-5-6c0-2.8 1.6-5.2 5-9.2Z" fill="${c.accent}"/><circle cx="${x + 1.6}" cy="62" r="1.6" fill="#fff6cc"/></g>`;
    if (style === 'lens') return `<g><circle cx="${x}" cy="60" r="${ry + 2.6}" fill="#ffffff"/><circle cx="${x}" cy="60" r="${ry + 1.4}" fill="none" stroke="${c.deep}" stroke-width="1.8"/><circle cx="${x}" cy="60" r="${ry - 1.2}" fill="#1d1734"/><circle cx="${x + 2}" cy="56.4" r="2.2" fill="#ffffff"/></g>`;
    if (style === 'half') return `<g><ellipse cx="${x}" cy="61" rx="${rx + 1}" ry="${ry}" fill="#1d1734"/><path d="M${x - 8} 56h16" stroke="${c.body}" stroke-width="4.6" stroke-linecap="round"/><circle cx="${x + 2}" cy="62.4" r="2" fill="#ffffff"/></g>`;
    if (style === 'cat') return `<g><path d="M${x - 8} 60q8-8 16 0-8 8-16 0Z" fill="#1d1734"/><ellipse cx="${x}" cy="60" rx="1.5" ry="5" fill="${c.accent}"/><circle cx="${x + 3}" cy="57.4" r="1.1" fill="#ffffff"/></g>`;
    if (style === 'void') return `<g><circle cx="${x}" cy="60" r="${ry + 2.2}" fill="#07050c"/><circle cx="${x}" cy="60" r="${ry + 2.2}" fill="none" stroke="${c.accent}" stroke-width="1.2" opacity=".7"/><circle cx="${x - 3}" cy="57" r=".9" fill="#ffffff" opacity=".8"/><circle cx="${x + 3}" cy="63" r=".8" fill="${c.accent}"/></g>`;
    if (style === 'cross') return `<g class="b-eye" style="animation-delay:${delay}s" stroke="#1d1734" stroke-width="3" stroke-linecap="round"><path d="M${x - 6} 54l12 12M${x + 6} 54l-12 12"/></g>`;
    if (style === 'gleam') return `<g class="b-eye" style="animation-delay:${delay}s"><ellipse cx="${x}" cy="60" rx="${rx + 1.2}" ry="${ry + 1.2}" fill="#1d1734"/><path d="M${x - 5} 58.5a6 6 0 0 1 9-3.5" stroke="${c.accent}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="${x + 2.6}" cy="63.6" r="1.6" fill="#ffffff" opacity=".9"/></g>`;
    const sparkle = style === 'sparkle' ? `<path d="M${x + 6} 49.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z" fill="#fff6cc"/>` : '';
    return `
    <g class="b-eye" style="animation-delay:${delay}s">
      <ellipse cx="${x}" cy="60" rx="${rx}" ry="${ry}" fill="#1d1734"/>
      <circle cx="${x + 2}" cy="56.6" r="${baby ? 2.9 : 2.4}" fill="#ffffff"/>
      <circle cx="${x - 2.2}" cy="63.4" r="1.25" fill="#ffffff" opacity=".5"/>
      ${sparkle}
    </g>`;
  };
  if (expr === 'sleep') {
    return `
      <path d="M40 59.5q7 6.5 14 0" stroke="#1d1734" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M66 59.5q7 6.5 14 0" stroke="#1d1734" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M42 55.5l-2.5-2M78 55.5l2.5-2" stroke="#1d1734" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
  }
  if (expr === 'happy' || expr === 'eat') {
    if (['star', 'heart', 'wide', 'sparkle', 'anime', 'teary', 'pixel', 'lashes', 'dot', 'cross', 'galaxy', 'flame', 'lens', 'half', 'cat', 'void', 'gleam'].includes(style)) return `${eye(47)}${eye(73)}`;
    return `
      <path d="M40 61q7 -9 14 0" stroke="#1d1734" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M66 61q7 -9 14 0" stroke="#1d1734" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  }
  if (expr === 'love') {
    const heart = (x) => `
      <path d="M${x} 55c-3.4-4.6-9.4-2-9.4 2.7 0 4.6 9.4 9.3 9.4 9.3s9.4-4.7 9.4-9.3c0-4.7-6-7.3-9.4-2.7Z" fill="#ff5e8a" stroke="#1d1734" stroke-width="1.6"/>`;
    return heart(47) + heart(73);
  }
  if (expr === 'angry') {
    return `
      <path d="M39 52l13 4" stroke="#1d1734" stroke-width="3" stroke-linecap="round"/>
      <path d="M81 52l-13 4" stroke="#1d1734" stroke-width="3" stroke-linecap="round"/>
      ${eye(47)}${eye(73)}`;
  }
  if (expr === 'sad') {
    return `
      <path d="M39 51q6-4 12-1" stroke="#1d1734" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M81 51q-6-4-12-1" stroke="#1d1734" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      ${eye(47)}${eye(73)}`;
  }
  if (expr === 'grump') {
    return `
      <g class="b-eye" style="animation-delay:${delay}s">
        <rect x="40.5" y="55" width="13" height="10" rx="5.5" fill="#1d1734"/>
        <circle cx="49" cy="58" r="1.8" fill="#fff" opacity=".85"/>
      </g>
      <g class="b-eye" style="animation-delay:${delay}s">
        <rect x="66.5" y="55" width="13" height="10" rx="5.5" fill="#1d1734"/>
        <circle cx="75" cy="58" r="1.8" fill="#fff" opacity=".85"/>
      </g>`;
  }
  return eye(47) + eye(73);
}

function mouthMarkup(expr) {
  if (expr === 'sleep') return `<ellipse cx="60" cy="76" rx="2.6" ry="3" fill="#1d1734" opacity=".75"/>`;
  if (expr === 'eat') return `<path d="M51 73q9 13 18 0z" fill="#1d1734"/><path d="M56 79q4 4 8 0" fill="#ff8fa3"/>`;
  if (expr === 'happy' || expr === 'love') {
    return `<path d="M51 73q9 12 18 0z" fill="#1d1734"/><path d="M56 79.5q4 3.5 8 0" fill="#ff8fa3"/>`;
  }
  if (expr === 'sad') return `<path d="M53 80q7-6 14 0" stroke="#1d1734" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  if (expr === 'grump') return `<path d="M54 78h12" stroke="#1d1734" stroke-width="2.8" stroke-linecap="round"/>`;
  if (expr === 'dirty') return `<path d="M53 75q3.5 3 7 0 3.5 3 7 0" stroke="#1d1734" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  return `<path d="M54 74q6 6 12 0" stroke="#1d1734" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
}

/* Signature silhouettes for the named character sprites. */
function signatureFeature(el, c) {
  return (typeof signatureArcadeHits === 'function' ? signatureArcadeHits(el, c) : '') ||
    (typeof signatureSimMusic === 'function' ? signatureSimMusic(el, c) : '') ||
    (typeof signatureCollectionSecret === 'function' ? signatureCollectionSecret(el, c) : '') ||
    (typeof signaturePony === 'function' ? signaturePony(el, c) : '') ||
    (typeof signatureMedicalTV === 'function' ? signatureMedicalTV(el, c) : '') ||
    (typeof signatureNetflix === 'function' ? signatureNetflix(el, c) : '') ||
    (typeof signatureTVLegacy === 'function' ? signatureTVLegacy(el, c) : '') ||
    (typeof signatureRealmWave === 'function' ? signatureRealmWave(el, c) : '') ||
    (typeof signatureKingdomHearts === 'function' ? signatureKingdomHearts(el, c) : '') ||
    (typeof signatureGTA === 'function' ? signatureGTA(el, c) : '') ||
    (typeof signatureFortniteLegacy === 'function' ? signatureFortniteLegacy(el, c) : '') ||
    (typeof signatureWWE === 'function' ? signatureWWE(el, c) : '') ||
    (typeof signatureBiome === 'function' ? signatureBiome(el, c) : '') || signatureAnimal(el, c) || signatureCrossover(el, c) || signatureDC(el, c) || signatureWave(el, c) || (typeof signatureCareBear === 'function' ? signatureCareBear(el, c) : '') ||    (typeof signatureHero === 'function' ? signatureHero(el, c) : '') || signaturePokedex(el, c) || signatureFortnite(el, c) || signatureSeasonal(el, c) || (typeof signatureTrick === 'function' ? signatureTrick(el, c) : '') || (typeof signatureBase === 'function' ? signatureBase(el, c) : '') || (typeof signatureVariant === 'function' ? signatureVariant(el, c) : '') || (typeof signatureLegend === 'function' ? signatureLegend(el, c) : '') || (typeof signatureCatalog === 'function' ? signatureCatalog(el, c) : '') || signatureA(el, c) || signatureB(el, c);
}

function signatureA(el, c) {
  switch (el) {
    case 'fishy':
      return `
        <path d="M48 28c-1-10 5-18 14-20 1 9-2 16-8 20Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M54 24c1-6 5-10 9-12-1 6-3 11-6 14Z" fill="${c.light}" opacity=".8"/>
        <path d="M31 62c-9-6-14 2-9 10 4 5 9 2 12-3Z" fill="${c.light}" opacity=".8"/>
        <path d="M86 78c11 2 17 9 16 19-8 0-14-6-17-13Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M94 88c4 1 7 4 8 8" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".6"/>
        <circle cx="94" cy="40" r="3.4" fill="none" stroke="${c.light}" stroke-width="1.2" opacity=".7"/>
        <circle cx="101" cy="31" r="2.2" fill="none" stroke="${c.light}" stroke-width="1" opacity=".55"/>
        <path d="M90 54a5 5 0 1 1-7-5 4 4 0 0 0 7 5Z" fill="${c.light}" opacity=".65"/>`;
    case 'striker':
      return `
        <path d="M39 38q21-8 42 0" stroke="${c.accent}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="31" cy="95" r="9" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M27 91l4 3-2 5 5 1" fill="none" stroke="${c.deep}" stroke-width="1.1"/>
        <circle cx="31" cy="95" r="2.2" fill="${c.deep}"/>
        <path d="M92 50l7-2M93 58l7 1M89 66l6 3" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
    case 'aura':
      return `
        <circle cx="60" cy="62" r="52" fill="none" stroke="${c.accent}" stroke-width="1.2" opacity=".3"/>
        <circle cx="60" cy="62" r="45" fill="none" stroke="${c.light}" stroke-width="1" stroke-dasharray="3 8" opacity=".45"/>
        <path d="M60 2l2.2 6.4 6.4 2.2-6.4 2.2L60 19l-2.2-6.2-6.4-2.2 6.4-2.2Z" fill="${c.light}"/>
        <circle cx="26" cy="40" r="2" fill="${c.accent}" opacity=".8"/>
        <circle cx="96" cy="84" r="2.4" fill="${c.light}" opacity=".8"/>
        <path d="M95 26l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2Z" fill="${c.accent}" opacity=".7"/>`;
    case 'six':
      return `
        <path d="M60 1l13 7.5v15L60 31l-13-7.5v-15Z" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity=".85"/>
        <text x="60" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="${c.accent}">6</text>
        <circle cx="60" cy="33" r="1.8" fill="${c.accent}"/>`;
    case 'seven':
      return `
        <path d="M60 1l12 13-12 13-12-13Z" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity=".85"/>
        <text x="60" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="${c.accent}">7</text>
        <path d="M60 31v4" stroke="${c.accent}" stroke-width="1.6" stroke-linecap="round"/>`;
    case 'king':
      return `
        <path d="M38 28l5-18 9 9 8-14 8 14 9-9 5 18Z" fill="#ffd166" stroke="#a86a00" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="60" cy="20" r="2.4" fill="#ff5e8a"/>
        <circle cx="47" cy="23" r="1.8" fill="#8be9ff"/>
        <circle cx="73" cy="23" r="1.8" fill="#b69cff"/>
        <path d="M31 86c9 5 19 7 29 7s20-2 29-7l3 9c-10 5-20 8-32 8s-22-3-32-8Z" fill="${c.accent}" opacity=".9"/>
        <path d="M31 86c9 5 19 7 29 7s20-2 29-7" stroke="#ffd166" stroke-width="1.6" fill="none"/>`;
    case 'queen':
      return `
        <path d="M42 26l4-14 7 7 7-11 7 11 7-7 4 14Z" fill="#ffd166" stroke="#a86a00" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="60" cy="15" r="2" fill="#ff5e8a"/>
        <circle cx="30" cy="80" r="2.6" fill="#ffd166"/><circle cx="90" cy="80" r="2.6" fill="#ffd166"/>
        <path d="M40 90q20 10 40 0" stroke="#ffd166" stroke-width="1.8" fill="none" stroke-dasharray="2 4"/>
        <path d="M88 34c6 2 8 8 5 12" stroke="${c.light}" stroke-width="1.2" fill="none" opacity=".7"/>`;
    case 'ghost':
      return `
        <path d="M30 52c0-16 13-27 30-27s30 11 30 27v42c0 5-6 6-9 3-3-3-7-3-10 0s-7 3-10 0-7-3-10 0-6 2-6-3Z" fill="${c.light}" opacity=".16" stroke="${c.light}" stroke-width="1" stroke-dasharray="4 5"/>
        <circle cx="27" cy="50" r="2.4" fill="${c.accent}" opacity=".8"/>
        <circle cx="95" cy="72" r="1.8" fill="${c.accent}" opacity=".7"/>
        <path d="M90 36l1.2 3.2 3.2 1.2-3.2 1.2L90 45l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".8"/>`;
    case 'skull':
      return `
        <path d="M39 80c-2 6 2 11 9 11h24c7 0 11-5 9-11" fill="${c.light}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M49 84v7M60 84v7M71 84v7" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M35 40c4-3 9-4 13-2M85 40c-4-3-9-4-13-2" stroke="${c.light}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>
        <path d="M60 30l-4 6 4 4M87 58l4 5-3 5" stroke="${c.deep}" stroke-width="1.3" fill="none" opacity=".5"/>
        <circle cx="28" cy="66" r="2" fill="${c.light}" opacity=".6"/>`;
    case 'death':
      return `
        <path d="M35 54c-5-20 5-34 17-38 2 10 3 22 1 32Z" fill="${c.deep}" opacity=".9"/>
        <path d="M85 54c5-20-5-34-17-38-2 10-3 22-1 32Z" fill="${c.deep}" opacity=".9"/>
        <path d="M96 20l8 82" stroke="#8a6a4a" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M96 20c-11 0-18 6-20 15 8-3 16-1 21 4Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/>
        <circle cx="60" cy="13" r="2" fill="${c.accent}"/>`;
    case 'lootllama':
      return `
        <path d="M44 30c-6-12-6-22-1-26 5 2 8 11 9 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M76 30c6-12 6-22 1-26-5 2-8 11-9 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M46 24c-3-8-3-14-1-16 2 2 4 8 5 14Z" fill="${c.accent}" opacity=".7"/>
        <path d="M74 24c3-8 3-14 1-16-2 2-4 8-5 14Z" fill="${c.accent}" opacity=".7"/>
        <path d="M30 84h60l-5 11H35Z" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width="1"/>
        <path d="M37 95v6M49 95v6M71 95v6M83 95v6" stroke="${c.accent}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M92 42l1.6 4.4 4.4 1.6-4.4 1.6L92 54l-1.6-4.4-4.4-1.6 4.4-1.6Z" fill="${c.accent}" opacity=".9"/>`;
    case 'duck':
      return `
        <ellipse cx="60" cy="78" rx="16" ry="6.2" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="54" cy="76" r="1.1" fill="${c.deep}" opacity=".7"/><circle cx="66" cy="76" r="1.1" fill="${c.deep}" opacity=".7"/>
        <path d="M30 68c-8 5-7 15 2 18 5 2 9-1 10-6" fill="${c.light}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
        <path d="M20 96q20-7 40 0t40 0" stroke="${c.light}" stroke-width="1.8" fill="none" opacity=".55"/>
        <path d="M44 24c-4-5-2-10 3-10 3 0 5 3 4 6" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".55"/>`;
    case 'peely':
      return `
        <path d="M45 34c-9-12-9-25-2-30 6 4 8 15 9 25Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M60 32c-3-14 0-26 6-30 5 5 3 18 2 28Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M75 34c9-12 9-25 2-30-6 4-8 15-9 25Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="43" cy="6" r="2.2" fill="${c.accent}"/><circle cx="67" cy="3" r="2.2" fill="${c.accent}"/><circle cx="78" cy="6" r="2.2" fill="${c.accent}"/>
        <path d="M53 40c5 3 10 3 15 0" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".5"/>`;
    case 'dream':
      return `
        <path d="M32 24c-6 0-8-6-4-9 3-3 7-1 8 2 1-5 7-7 10-3 3-3 8-1 8 4 4-1 6 4 3 7-2 2-5 2-7 1H34Z" fill="${c.light}" opacity=".9" stroke="${c.deep}" stroke-width=".9"/>
        <text x="88" y="24" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="${c.accent}">z</text>
        <text x="94" y="17" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="${c.light}">z</text>
        <path d="M92 52l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2Z" fill="${c.light}" opacity=".8"/>
        <circle cx="27" cy="48" r="1.8" fill="${c.accent}" opacity=".7"/>`;
    case 'zeropoint':
      return `
        <circle cx="60" cy="15" r="12" fill="${c.accent}" opacity=".22"/>
        <circle cx="60" cy="15" r="6" fill="${c.light}"/>
        <ellipse cx="60" cy="15" rx="19" ry="5" fill="none" stroke="${c.accent}" stroke-width="1.2" transform="rotate(-18 60 15)"/>
        <ellipse cx="60" cy="15" rx="15" ry="4" fill="none" stroke="${c.light}" stroke-width=".9" transform="rotate(24 60 15)" opacity=".7"/>
        <path d="M36 44l5 6-5 6M84 52l-5 6 5 6M44 94l4-5" stroke="${c.accent}" stroke-width="1.4" fill="none" opacity=".65"/>
        <circle cx="96" cy="80" r="1.8" fill="${c.light}" opacity=".8"/>`;
    case 'punk':
      return `
        <path d="M49 31l-3-15 9 8 5-16 5 16 9-8-3 15Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M33 88h54l3 9H30Z" fill="${c.deep}" opacity=".9"/>
        <circle cx="40" cy="92" r="1.5" fill="${c.light}"/><circle cx="52" cy="92" r="1.5" fill="${c.light}"/><circle cx="68" cy="92" r="1.5" fill="${c.light}"/><circle cx="80" cy="92" r="1.5" fill="${c.light}"/>
        <path d="M93 46l7 7-4 10" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".8"/>
        <circle cx="93" cy="46" r="1.4" fill="${c.light}"/>`;
    case 'batman':
      return `
        <path d="M38 40c0-14 10-22 22-22s22 8 22 22c-5-2-9-5-12-8-2 5-6 8-10 10-4-2-8-5-10-10-3 3-7 6-12 8Z" fill="#1d1734" opacity=".95"/>
        <path d="M39 32L34 6l13 9Z" fill="#1d1734"/>
        <path d="M81 32L86 6 73 15Z" fill="#1d1734"/>
        <path d="M33 66c-8 4-11 12-9 22l9-4Z" fill="#1d1734" opacity=".9"/>
        <path d="M87 66c8 4 11 12 9 22l-9-4Z" fill="#1d1734" opacity=".9"/>
        <ellipse cx="60" cy="89" rx="11" ry="6.5" fill="${c.accent}"/>
        <path d="M52 89c3-3 5-1 8 0 3-1 5-3 8 0-2 3-5 4-8 4s-6-1-8-4Z" fill="#1d1734"/>
        <ellipse cx="47" cy="60" rx="7.2" ry="4.6" fill="#e8f4ff" transform="rotate(-8 47 60)"/>
        <ellipse cx="73" cy="60" rx="7.2" ry="4.6" fill="#e8f4ff" transform="rotate(8 73 60)"/>
        <circle cx="47" cy="60" r="2.2" fill="#14141c"/><circle cx="73" cy="60" r="2.2" fill="#14141c"/>`;
    case 'superman':
      return `
        <path d="M61 31c-3-6 1-10 5-9-2 2-1 5 2 6" stroke="${c.deep}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M32 64c-9 5-12 14-9 24l10-4Z" fill="${c.accent}"/>
        <path d="M88 64c9 5 12 14 9 24l-10-4Z" fill="${c.accent}"/>
        <path d="M60 78l9 4-2 10-7 5-7-5-2-10Z" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
        <path d="M60 82c3 0 4 2 3 4 2 0 3 2 1 4-1 1-3 1-4 0-1 1-3 1-4 0-2-2-1-4 1-4-1-2 0-4 3-4Z" fill="${c.accent}"/>`;
    case 'ironmouse':
      return `
        <circle cx="37" cy="30" r="12" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="83" cy="30" r="12" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="37" cy="30" r="6" fill="${c.accent}" opacity=".85"/>
        <circle cx="83" cy="30" r="6" fill="${c.accent}" opacity=".85"/>
        <path d="M30 54c0-8 12-14 30-14s30 6 30 14" stroke="${c.accent}" stroke-width="2.6" fill="none"/>
        <path d="M32 54c-5 0-7 4-5 7 2 2 5 1 6-1" stroke="${c.deep}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M87 58c5 2 7 8 3 12" stroke="${c.deep}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="89" cy="71" r="3" fill="${c.deep}" opacity=".85"/>
        <circle cx="91" cy="70" r="1" fill="${c.light}"/>
        <path d="M73 68c2-4 7-4 9 0 2 4-2 7-4.5 9-2.5-2-6.5-5-4.5-9Z" fill="${c.accent}" opacity=".9"/>`;
    case 'bullet':
      return `
        <path d="M42 33c0-15 8-25 18-25s18 10 18 25Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M42 33h36" stroke="${c.deep}" stroke-width="2"/>
        <path d="M36 40l-8-2M34 48l-8 1M38 56l-7 3" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <path d="M88 82c5 2 7 7 5 11-4-1-6-5-5-11Z" fill="${c.accent}" opacity=".85"/>
        <circle cx="93" cy="60" r="2" fill="${c.light}" opacity=".7"/>`;
    case 'burntpb':
      return `
        <path d="M37 32c0-9 7-15 16-15h14c9 0 16 6 16 15Z" fill="${c.light}" opacity=".5" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 30c2-5 7-8 13-8 3 0 5 1 7 3 3-3 8-2 10 2 4-1 7 1 8 4" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".7"/>
        <circle cx="42" cy="24" r="4" fill="${c.accent}" opacity=".75"/><circle cx="78" cy="23" r="5" fill="${c.accent}" opacity=".7"/>
        <path d="M43 14c-3-5 2-8 0-12M60 12c-3-5 2-8 0-12M75 14c-3-5 2-8 0-12" stroke="${c.light}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".4"/>
        <circle cx="60" cy="88" r="2" fill="${c.accent}" opacity=".5"/><circle cx="48" cy="72" r="1.4" fill="${c.accent}" opacity=".5"/>`;
    case 'headshot':
      return `
        <circle cx="60" cy="52" r="36" fill="none" stroke="${c.accent}" stroke-width="1.2" opacity=".7"/>
        <path d="M60 12v8M60 84v8M20 52h8M92 52h8" stroke="${c.accent}" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>
        <circle cx="60" cy="52" r="2.4" fill="${c.accent}"/>
        <path d="M28 30l6 6M92 30l-6 6" stroke="${c.light}" stroke-width="1.4" opacity=".6"/>`;
    case 'cube':
      return `
        <path d="M60 2l12 7-12 7-12-7Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M48 9l12 7v15l-12-7Z" fill="${c.accent}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
        <path d="M72 9l-12 7v15l12-7Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M25 55h6v6h-6Z" fill="${c.accent}" opacity=".5"/><path d="M92 74h5v5h-5Z" fill="${c.light}" opacity=".6"/>
        <path d="M31 82h4v4h-4Z" fill="${c.accent}" opacity=".4"/>`;
    case 'bombjr':
      return `
        <circle cx="60" cy="22" r="16" fill="${c.deep}" stroke="${c.light}" stroke-width="1.2"/>
        <path d="M46 27h28" stroke="${c.light}" stroke-width="2" opacity=".7"/>
        <path d="M68 9c5-6 12-5 14 1-4 3-9 2-11-1" stroke="${c.accent}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M85 5l2.4 5 5 2.4-5 2.4L85 20l-2.4-5.2-5-2.4 5-2.4Z" fill="${c.accent}"/>
        <path d="M88 40c5 2 7 7 4 11-4-1-6-5-4-11Z" fill="${c.light}" opacity=".35"/>`;
    case 'grim':
      return `
        <path d="M34 56c-6-22 6-38 19-42 1 12 2 24 0 36Z" fill="${c.deep}" opacity=".9"/>
        <path d="M86 56c6-22-6-38-19-42-1 12-2 24 0 36Z" fill="${c.deep}" opacity=".9"/>
        <path d="M96 20l8 82" stroke="#8a6a4a" stroke-width="3" stroke-linecap="round"/>
        <path d="M96 20c-11 0-18 6-20 15 8-3 16-1 21 4Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/>
        <circle cx="60" cy="13" r="2" fill="${c.accent}"/>
        <path d="M84 16l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="${c.accent}" opacity=".7"/>`;
    case 'squibbly':
      return `
        <path d="M32 28c0-12 10-21 22-21 4-6 12-6 16 0 11 0 20 9 20 21 0 5-6 8-9 4-3-4-8-4-11 0-3 4-8 4-11 0-4-4-9-4-12 0-4 4-10 1-10-4Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="43" cy="15" r="7" fill="${c.light}" opacity=".55"/>
        <circle cx="66" cy="9" r="8" fill="${c.light}" opacity=".4"/>
        <circle cx="80" cy="18" r="6" fill="${c.light}" opacity=".45"/>
        <path d="M40 30c-3 12 0 24 4 32M80 30c3 12 0 24-4 32M53 32c-1 9 0 17 2 24M67 32c1 9 0 17-2 24" stroke="${c.deep}" stroke-width="1.5" fill="none" opacity=".55"/>
        <path d="M32 70c-5 2-7 8-4 12 3-1 6-5 7-8" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M89 66c5 2 7 8 3 11-3-1-5-4-5-7" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M44 20c3-3 7-3 9 0M64 16c3-3 7-2 8 1" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".8"/>`;
    case 'wrixel':
      return `
        <rect x="76" y="8" width="10" height="10" rx="2" fill="${c.accent}" opacity=".85"/>
        <rect x="90" y="22" width="6" height="6" rx="1" fill="${c.light}" opacity=".7"/>
        <rect x="30" y="16" width="8" height="8" rx="2" fill="${c.light}" opacity=".5"/>
        <path d="M44 26h32" stroke="${c.accent}" stroke-width="2" stroke-dasharray="3 3" opacity=".8"/>
        <path d="M38 44h10v10H38zM72 44h10v10H72z" fill="${c.deep}" opacity=".22"/>`;
    case 'phantom':
      return `
        <path d="M34 44c0-16 12-28 26-28s26 12 26 28c-6-4-13-6-26-6s-20 2-26 6Z" fill="${c.deep}" opacity=".5"/>
        <path d="M38 30c4-8 12-13 22-13s18 5 22 13" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".8"/>
        <path d="M42 42c-6 6-9 14-9 22M78 42c6 6 9 14 9 22" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".4"/>
        <circle cx="92" cy="34" r="3" fill="${c.accent}" opacity=".6"/>`;
    case 'mali':
      return `
        <path d="M34 32c7-9 16-14 26-14s19 5 26 14" stroke="${c.accent}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="12" r="5" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M92 46l6 10-6 10-6-10Z" fill="${c.accent}" opacity=".85"/>
        <path d="M28 74c8 5 16 7 24 7" stroke="${c.deep}" stroke-width="2" fill="none" opacity=".5"/>`;
    case 'bastian':
      return `
        <path d="M60 2l6 12h-12Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M36 30c5-11 13-17 24-17s19 6 24 17" fill="${c.light}" opacity=".35"/>
        <path d="M94 58c8 3 12 10 12 18-6 0-11-3-14-8Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M96 66l4 6-4 6" stroke="${c.accent}" stroke-width="1.6" fill="none"/>`;
    case 'k1ttyw1ns':
      return `
        <path d="M42 30L38 8l18 13Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M78 30L82 8 64 21Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M45 25l-1-9 7 6Z" fill="${c.accent}" opacity=".7"/>
        <path d="M75 25l1-9-7 6Z" fill="${c.accent}" opacity=".7"/>
        <path d="M84 62c8 0 12 4 12 9" stroke="${c.deep}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="96" cy="72" r="4" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>`;
    case 'gracecrowne':
      return `
        <path d="M38 26l6-18 10 10 6-14 6 14 10-10 6 18Z" fill="#ffd166" stroke="#a86a00" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="60" cy="8" r="2.4" fill="#ff5e8a"/>
        <path d="M32 90c6 6 14 9 28 9s22-3 28-9" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".7"/>`;
    case 'geno':
      return `
        <path d="M32 30c8-10 18-15 28-15s20 5 28 15" fill="${c.deep}" opacity=".8"/>
        <path d="M38 34l8-6M82 34l-8-6" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="70" y="38" width="20" height="7" rx="3.5" fill="${c.accent}" opacity=".85"/>
        <path d="M20 92l10-10M100 92l-10-10" stroke="${c.deep}" stroke-width="2" opacity=".6"/>`;
    case 'nicorobin':
      return `
        <path d="M32 26h56l-8-14H40Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M28 26h64" stroke="${c.deep}" stroke-width="3" stroke-linecap="round"/>
        <path d="M44 30c-2 16 0 28 4 38M76 30c2 16 0 28-4 38" stroke="${c.deep}" stroke-width="2" fill="none" opacity=".45"/>
        <path d="M84 60c8-2 13 2 14 8-6 3-12 2-16-2Z" fill="${c.body}" opacity=".7"/>`;
    case 'ace':
      return `
        <path d="M38 26h44l-5-14H43Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M32 26h56" stroke="${c.deep}" stroke-width="3" stroke-linecap="round"/>
        <path d="M60 4c2 4 5 6 8 6-2 3-5 4-8 4s-6-1-8-4c3 0 6-2 8-6Z" fill="${c.light}" opacity=".9"/>
        <path d="M30 70c6 8 14 13 24 15M90 62c5 7 7 14 6 22" stroke="${c.accent}" stroke-width="2.4" fill="none" opacity=".7"/>`;
    case 'cuddle':
      return `
        <circle cx="38" cy="22" r="11" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="82" cy="22" r="11" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="38" cy="22" r="5" fill="${c.accent}" opacity=".7"/>
        <circle cx="82" cy="22" r="5" fill="${c.accent}" opacity=".7"/>
        <path d="M60 84c-5-6-14-3-14 3 0 6 14 12 14 12s14-6 14-12c0-6-9-9-14-3Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>`;
    case 'charlotte':
      return `
        <path d="M84 16c6-6 14-4 14 2 0 6-8 10-14 6-6 4-14 0-14-6 0-6 8-8 14-2Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M30 34c8-6 18-7 27-4M90 34c-8-6-18-7-27-4" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".6"/>
        <circle cx="96" cy="82" r="3" fill="${c.light}" opacity=".8"/>`;
    case 'captainx':
      return `
        <path d="M26 28l10-16 24 10 24-10 10 16Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.3"/>
        <path d="M26 28h68" stroke="${c.accent}" stroke-width="2.4"/>
        <path d="M44 42h32" stroke="${c.deep}" stroke-width="2" opacity=".5"/>
        <path d="M88 50l10 4-10 4" fill="none" stroke="${c.accent}" stroke-width="2"/>`;
    case 'kirby':
      return `
        <path d="M60 2l3 8 8 1-6 6 2 8-7-4-7 4 2-8-6-6 8-1Z" fill="#ffe066" stroke="#a86a00" stroke-width="1"/>
        <circle cx="36" cy="70" r="6" fill="${c.accent}" opacity=".28"/>
        <circle cx="84" cy="70" r="6" fill="${c.accent}" opacity=".28"/>
        <path d="M40 96c5 4 11 6 20 6s15-2 20-6" stroke="${c.deep}" stroke-width="2" fill="none" opacity=".4"/>`;
    default:
      return '';
  }
}

function signatureB(el, c) {
  switch (el) {
    case 'onewish':
      return `
        <path d="M30 30c0-15 13-27 30-27s30 12 30 27c0 5-6 7-9 3-3-4-8-4-11 0-3 4-8 4-11 0-4-4-9-4-12 0-3 4-9 2-9-3Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 13c4-5 10-7 17-7s13 2 17 7" stroke="${c.light}" stroke-width="2" fill="none" opacity=".6"/>
        <path d="M40 31c-3 14-1 27 3 39M80 31c3 14 1 27-3 39M53 34c-1 11 0 21 2 30M67 34c1 11 0 21-2 30" stroke="${c.deep}" stroke-width="1.3" fill="none" opacity=".5"/>
        <circle cx="60" cy="12" r="8" fill="${c.accent}" opacity=".25"/>
        <path d="M60 3l2.2 6L68 11l-5.8 2L60 19l-2.2-6L52 11l5.8-2Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".8"/>
        <path d="M60 19v10" stroke="${c.accent}" stroke-width="1.4" opacity=".7"/>
        <path d="M44 92c10 5 22 5 32 0" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".8"/>`;
    case 'klombo':
      return `
        <path d="M36 38c-8-5-9-13-3-17 4 6 9 8 15 9Z" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width="1"/>
        <path d="M84 38c8-5 9-13 3-17-4 6-9 8-15 9Z" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width="1"/>
        <path d="M46 30c-3-8 0-14 3-17M74 30c3-8 0-14-3-17" stroke="${c.light}" stroke-width="3" stroke-linecap="round"/>
        <path d="M90 82c10 4 14 12 12 20-7-1-12-7-14-14Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
        <circle cx="39" cy="56" r="3" fill="${c.accent}" opacity=".55"/><circle cx="80" cy="70" r="2.4" fill="${c.accent}" opacity=".5"/>
        <path d="M48 30l3 4 4-4 3 4 4-4" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".7"/>`;
    case 'crown':
      return `
        <path d="M28 30l6-24 11 12 15-18 15 18 11-12 6 24Z" fill="#ffd166" stroke="#a86a00" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cx="60" cy="8" r="2.6" fill="#ff5e8a"/>
        <circle cx="39" cy="17" r="1.8" fill="#8be9ff"/><circle cx="81" cy="17" r="1.8" fill="#8be9ff"/>
        <path d="M28 30h64v6H28Z" fill="${c.accent}" opacity=".8"/>
        <path d="M22 44l1.4 3.8 3.8 1.4-3.8 1.4L22 54l-1.4-3.8-3.8-1.4 3.8-1.4Z" fill="${c.light}" opacity=".8"/>
        <path d="M98 52l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1Z" fill="${c.light}" opacity=".7"/>`;
    case 'spookydash':
      return `
        <path d="M24 60c-8 4-11 12-8 18 5-1 8-5 10-10" fill="${c.light}" opacity=".3"/>
        <path d="M28 74c-7 5-8 13-4 18 4-2 7-6 8-11" fill="${c.light}" opacity=".22"/>
        <path d="M34 86c-5 6-4 13 0 17 3-3 5-7 5-12" fill="${c.light}" opacity=".16"/>
        <path d="M92 42l8-2M94 50l8 1M90 58l7 3" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
        <path d="M38 55c3-3 7-3 10 0M72 55c3-3 7-3 10 0" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".8"/>
        <path d="M60 2l1.6 4.4L66 8l-4.4 1.6L60 14l-1.6-4.4L54 8l4.4-1.6Z" fill="${c.light}" opacity=".9"/>`;
    case 'jazz':
      return `
        <path d="M44 32c-9-17-9-31-2-33 7 3 11 17 12 30Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M76 32c9-17 9-31 2-33-7 3-11 17-12 30Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M46 24c-5-11-5-19-2-21 4 2 6 10 7 18Z" fill="${c.accent}" opacity=".7"/>
        <path d="M74 24c5-11 5-19 2-21-4 2-6 10-7 18Z" fill="${c.accent}" opacity=".7"/>
        <path d="M38 40h44" stroke="${c.deep}" stroke-width="5" opacity=".75"/>
        <circle cx="48" cy="40" r="6" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="72" cy="40" r="6" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M54 40h12" stroke="${c.deep}" stroke-width="2"/>
        <path d="M91 82l4-8 2 7-5 4M95 62l2-6 1 5-3 3" fill="${c.accent}" opacity=".9"/>`;
    case 'crash':
      return `
        <path d="M42 30L38 4l15 12Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M78 30L82 4 67 16Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M43 25l-2-13 7 6Z" fill="${c.accent}" opacity=".7"/>
        <path d="M77 25l2-13-7 6Z" fill="${c.accent}" opacity=".7"/>
        <path d="M34 40c4-4 9-4 12 0M74 40c3-4 8-4 12 0" stroke="${c.deep}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M22 58a42 42 0 0 0 76 26M28 82a38 38 0 0 0 64 10" fill="none" stroke="${c.accent}" stroke-width="2.2" stroke-dasharray="4 6" opacity=".7"/>
        <path d="M52 20l4-6 4 6" fill="${c.accent}" opacity=".85"/>
        <path d="M90 54l8-3M92 62l8 2" stroke="${c.light}" stroke-width="2" stroke-linecap="round" opacity=".75"/>`;
    case 'blinky':
      return `
        <path d="M31 56c0-16 13-28 29-28s29 12 29 28v40c0 5-6 6-9 3-3-3-7-3-10 0s-7 3-10 0-7-3-10 0-6 2-6-3Z" fill="${c.light}" opacity=".18" stroke="${c.light}" stroke-width="1" stroke-dasharray="3 4"/>
        <path d="M18 48h7v7h-7ZM8 40h5v5H8ZM13 32h4v4h-4Z" fill="${c.accent}" opacity=".5"/>
        <circle cx="37" cy="70" r="2" fill="${c.accent}" opacity=".7"/><circle cx="83" cy="44" r="1.6" fill="${c.accent}" opacity=".6"/>`;
    case 'deer':
      return `
        <path d="M42 30c-6-10-7-19-3-23 3 2 5 8 7 14 2-6 4-11 6-13 1 6 0 13-2 20Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M78 30c6-10 7-19 3-23-3 2-5 8-7 14-2-6-4-11-6-13-1 6 0 13 2 20Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="39" cy="52" r="2" fill="${c.light}" opacity=".75"/><circle cx="81" cy="66" r="1.8" fill="${c.light}" opacity=".7"/><circle cx="47" cy="84" r="1.5" fill="${c.light}" opacity=".6"/>
        <path d="M32 88c8 5 18 7 28 7s20-2 28-7" stroke="${c.accent}" stroke-width="2" fill="none" stroke-dasharray="2 4" opacity=".8"/>
        <path d="M52 34l3-5 3 5M62 34l3-5 3 5" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".6"/>`;
    case 'sonic':
      return `
        <path d="M42 36L22 26l14 18ZM46 28L32 8l18 8ZM58 26L56 2l11 13ZM70 30L82 8l2 18Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M34 48l-9-4M33 55l-9 0M36 62l-8 4" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <path d="M24 96c3-6 10-9 17-6l-1 9c-5-1-10 0-13 3Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M24 99h18" stroke="#ffffff" stroke-width="2.2" opacity=".9"/>
        <path d="M79 96c3-4 9-5 13-2l-1 8c-4-1-8 0-11 2Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M79 99h14" stroke="#ffffff" stroke-width="2" opacity=".85"/>
        <path d="M36 44l10-3M72 40l8 2" stroke="${c.deep}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`;
    case 'honeypot':
      return `
        <path d="M30 84h60l-4 13H34Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1"/>
        <path d="M35 91c5 8 16 10 25 4 9 6 20 4 25-4" stroke="${c.light}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>
        <path d="M40 95c4 5 9 7 14 6M80 95c-4 5-9 7-14 6" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".7"/>
        <path d="M91 52c7 0 10 7 5 12" stroke="${c.deep}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M88 42c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M84 44l-3-2 3-1M92 44l3-2-3-1" fill="${c.light}" opacity=".8"/>
        <path d="M79 38c-2-3 1-6 4-4" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".6"/>`;
    case 'dumpster':
      return `
        <ellipse cx="60" cy="22" rx="26" ry="6" fill="${c.light}" opacity=".55" stroke="${c.deep}" stroke-width="1"/>
        <path d="M50 16c0-6 4-10 10-10s10 4 10 10" stroke="${c.deep}" stroke-width="2" fill="none"/>
        <path d="M34 56c4-4 9-4 12 0-3 3-9 3-12 0ZM74 56c3-4 8-4 12 0-3 3-9 3-12 0Z" fill="${c.deep}" opacity=".55"/>
        <path d="M28 92c4 2 8 2 12 0M80 92c4 2 8 2 12 0" stroke="${c.light}" stroke-width="2" fill="none" opacity=".5"/>
        <path d="M84 84l8 0M92 80v8M88 82l4 4M92 82l-4 4" stroke="${c.light}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
    case 'tails':
      return `
        <path d="M38 78C18 68 6 78 12 92c4 10 16 11 24 2 5-6 5-11 2-16Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M82 78c20-10 32 0 26 14-4 10-16 11-24 2-5-6-5-11-2-16Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M18 88c-3 3-3 7-1 10 3-1 5-4 5-7M102 88c3 3 3 7 1 10-3-1-5-4-5-7" fill="${c.light}" opacity=".95"/>
        <path d="M41 30l-4-14 10 8 4-10 4 12" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M81 30l4-14-10 8-4-10-4 12" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M46 28l-2-7 4 4M74 28l2-7-4 4" stroke="${c.light}" stroke-width="1.2" fill="none" opacity=".8"/>`;
    case 'shadow':
      return `
        <path d="M42 38L16 26l16 18ZM46 26L30 6l20 8ZM76 30L96 10l-4 20ZM80 40l22-8-18 18Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M28 30l10 8M88 22l-6 10" stroke="${c.accent}" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>
        <path d="M40 52c-4 6-4 12 0 18M84 48c5 6 5 13 1 20" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".8"/>
        <path d="M32 94c4-4 10-4 14 0M74 94c4-4 10-4 14 0" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".6"/>
        <path d="M92 62l4 6-4 6-4-6Z" fill="#7affd8" stroke="${c.deep}" stroke-width="1"/>
        <path d="M89 80c5 1 7 5 4 8" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>`;
    case 'killswitch':
      return `
        <circle cx="60" cy="20" r="14" fill="none" stroke="${c.accent}" stroke-width="1.8"/>
        <path d="M60 2v8M60 30v8M38 20h8M74 20h8" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="20" r="2.6" fill="${c.accent}"/>
        <path d="M92 52h12v9H92Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.2"/>
        <circle cx="98" cy="56.5" r="2.8" fill="${c.accent}"/>
        <path d="M98 61v9" stroke="${c.deep}" stroke-width="2.4"/>
        <path d="M90 48l-4-4M104 48l4-4" stroke="${c.light}" stroke-width="1.4" opacity=".7"/>`;
    case 'morgana':
      return `
        <path d="M40 32L36 10l17 11Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.2"/>
        <path d="M80 32L84 10 67 21Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.2"/>
        <path d="M43 27l-1-9 7 5Z" fill="${c.accent}" opacity=".75"/>
        <path d="M77 27l1-9-7 5Z" fill="${c.accent}" opacity=".75"/>
        <path d="M38 56c4-4 10-4 14 0M68 56c4-4 10-4 14 0" stroke="${c.accent}" stroke-width="1.6" fill="none" opacity=".8"/>
        <path d="M92 82c8 1 11 7 8 13-5-1-8-6-9-10Z" fill="${c.accent}" opacity=".8"/>
        <path d="M96 88c3-2 6 0 5 3-1 2-4 2-5 1" fill="${c.accent}"/>`;
    case 'vampire':
      return `
        <path d="M40 32c2-8 0-14-4-18 7 0 12 4 15 10ZM80 32c-2-8 0-14 4-18-7 0-12 4-15 10Z" fill="${c.deep}" opacity=".9"/>
        <path d="M33 74l-7 24 12-6 6 8 5-22Z" fill="${c.deep}" opacity=".85"/>
        <path d="M87 74l7 24-12-6-6 8-5-22Z" fill="${c.deep}" opacity=".85"/>
        <path d="M55 82l3 7 3-7M63 82l3 7 3-7" fill="#ffffff" stroke="${c.deep}" stroke-width=".6"/>
        <circle cx="60" cy="90" r="3" fill="${c.accent}"/>
        <path d="M60 89l1 2 2 .4-1.6 1.4.4 2-1.8-1-1.8 1 .4-2L57 91.4l2-.4Z" fill="${c.light}" opacity=".9"/>`;
    case 'onigiri':
      return `
        <path d="M60 2L82 34H38Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M49 24h22v12H49Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="54" cy="16" r="1.3" fill="${c.deep}" opacity=".5"/><circle cx="66" cy="13" r="1.2" fill="${c.deep}" opacity=".5"/><circle cx="70" cy="20" r="1" fill="${c.deep}" opacity=".4"/>
        <path d="M89 42l1.2 3.2 3.2 1.2-3.2 1.2L89 51l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".6"/>`;
    case 'bushranger':
      return `
        <ellipse cx="60" cy="34" rx="30" ry="7" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 30c0-10 10-18 22-18s22 8 22 18Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M45 20c4-5 9-7 15-7s11 2 15 7" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".7"/>
        <path d="M50 86c4 5 8 6 12 3M58 86c3 4 7 5 11 2" stroke="${c.accent}" stroke-width="1.4" fill="none" opacity=".7"/>
        <path d="M32 78c-4 3-5 8-2 11 3 2 6-1 6-4" fill="${c.accent}" opacity=".55"/>
        <path d="M87 62l6-2M88 69l6 2" stroke="${c.light}" stroke-width="1.4" opacity=".6"/>`;
    case 'jonesy':
      return `
        <path d="M40 34c0-10 9-17 20-17s20 7 20 17Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M34 34h52l8 6H28Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M54 20h12v6H54Z" fill="${c.deep}" opacity=".2"/>
        <path d="M33 52c-7 1-11 7-9 14l9-2" fill="${c.body}" stroke="${c.deep}" stroke-width="1" opacity=".9"/>
        <path d="M36 64c14 5 34 5 48 0" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".35"/>
        <path d="M88 82l5-3" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>`;
    case 'blaster':
      return `
        <path d="M22 44h8v8h-8ZM16 56h6v6h-6ZM92 44h8v8h-8Z" fill="${c.accent}" opacity=".55"/>
        <path d="M96 64h14v9H96Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M110 66h4v5h-4Z" fill="${c.accent}"/>
        <path d="M60 4v8M56 8h8" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="4" r="2" fill="${c.light}"/>
        <path d="M28 84h6v6h-6ZM90 78h5v5h-5Z" fill="${c.light}" opacity=".5"/>`;
    case 'adventure':
      return `
        <ellipse cx="60" cy="30" rx="30" ry="6" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width="1"/>
        <path d="M42 29c0-9 8-16 18-16s18 7 18 16Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="60" cy="88" r="11" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M60 80l4 10-4-3-4 3Z" fill="${c.accent}"/>
        <circle cx="60" cy="88" r="2" fill="${c.deep}"/>
        <path d="M90 70l8-4v14l-8 4Z" fill="${c.light}" opacity=".5" stroke="${c.deep}" stroke-width=".8"/>`;
    case 'stormscout':
      return `
        <path d="M32 56c-6-22 7-39 22-41 1 11 1 23-1 34Z" fill="${c.deep}" opacity=".9"/>
        <path d="M88 56c6-22-7-39-22-41-1 11-1 23 1 34Z" fill="${c.deep}" opacity=".9"/>
        <path d="M28 21c-8 0-11-7-5-11 4-3 9-1 10 3 1-6 8-8 11-3 4-3 9 0 8 5 5 0 7 6 2 8-3 1-6 1-8 0H30Z" fill="${c.light}" opacity=".9"/>
        <path d="M58 8l-5 9h6l-4 10" stroke="${c.accent}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
        <path d="M60 40l7-7 7 7-7 7Z" fill="${c.accent}" opacity=".9"/>
        <path d="M34 38c4-4 9-4 13 0M73 38c4-4 9-4 13 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".5"/>
        <path d="M34 68l-6 4M86 68l6 4" stroke="${c.accent}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`;
    case 'overshield':
      return `
        <circle cx="60" cy="62" r="54" fill="${c.accent}" opacity=".08" stroke="${c.accent}" stroke-width="1.4" stroke-dasharray="5 6"/>
        <path d="M95 72l7 4v7l-7 4-7-4v-7Z" fill="${c.accent}" opacity=".35" stroke="${c.accent}" stroke-width="1"/>
        <path d="M31 88l1 2.8 2.8 1-2.8 1L31 97l-1-2.8L27 93l3-1Z" fill="${c.light}" opacity=".7"/>
        <path d="M34 36l1.2 3.2 3.2 1.2-3.2 1.2L34 45l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".7"/>`;
    case 'megaman':
      return `
        <path d="M38 34c0-12 10-20 22-20s22 8 22 20Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M56 16h8v16h-8Z" fill="${c.light}" opacity=".8"/>
        <path d="M60 4l4 12h-8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="34" cy="40" r="6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="86" cy="40" r="6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M92 74h16v12H92Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="108" cy="80" r="6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M96 74v-6h8v6" fill="${c.light}" opacity=".8"/>`;
    case 'birthday':
      return `
        <path d="M52 30L60 2l8 28Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M54 22h12M55 14h10" stroke="${c.light}" stroke-width="2.4" opacity=".8"/>
        <circle cx="60" cy="3" r="3.4" fill="${c.light}"/>
        <circle cx="28" cy="46" r="1.8" fill="${c.accent}"/><circle cx="93" cy="58" r="1.6" fill="${c.light}"/><circle cx="32" cy="70" r="1.4" fill="${c.accent}"/>
        <path d="M82 86h20v12H82Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M82 92h20M88 98v-6M96 98v-6" stroke="${c.accent}" stroke-width="1.8"/>
        <circle cx="88" cy="84" r="1.6" fill="${c.accent}"/><circle cx="96" cy="84" r="1.6" fill="${c.accent}"/>`;
    case 'meowscles':
      return `
        <path d="M42 32L38 10l17 12Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M78 32L82 10 65 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M45 27l-1-9 7 6Z" fill="${c.accent}" opacity=".75"/>
        <path d="M75 27l1-9-7 6Z" fill="${c.accent}" opacity=".75"/>
        <path d="M38 43h44" stroke="${c.accent}" stroke-width="4" stroke-linecap="round"/>
        <path d="M26 78c-5-3-8-8-7-13 5 1 8 5 9 10M94 78c5-3 8-8 7-13-5 1-8 5-9 10" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M22 86h12M26 82v8M86 86h12M90 82v8" stroke="${c.deep}" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 34l4-2M70 34l-4-2" stroke="${c.deep}" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>`;
    case 'boss':
      return `
        <path d="M34 62l20 26H38l-8-20Z" fill="#4a4a5c" stroke="${c.light}" stroke-width=".8" opacity=".95"/>
        <path d="M86 62L66 88h16l8-20Z" fill="#4a4a5c" stroke="${c.light}" stroke-width=".8" opacity=".95"/>
        <path d="M52 58l8 14 8-14" fill="#f7f4ff" opacity=".96"/>
        <path d="M60 72l4 11-4 4-4-4Z" fill="${c.accent}"/>
        <path d="M44 82q16 10 32 0" stroke="${c.accent}" stroke-width="2.4" fill="none"/>
        <circle cx="60" cy="88" r="2.2" fill="${c.accent}"/>
        <rect x="88" y="86" width="18" height="14" rx="2" fill="#8a5a2b" stroke="${c.deep}" stroke-width="1"/>
        <path d="M94 86v-4h6v4" fill="none" stroke="${c.deep}" stroke-width="1.4"/>`;
    case 'vini':
      return `
        <path d="M43 32c5-5 11-7 17-7s12 2 17 7" stroke="${c.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M34 78h52v12H34Z" fill="${c.accent}" opacity=".9"/>
        <text x="60" y="88" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="${c.light}">7</text>
        <circle cx="30" cy="94" r="8" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M26 90l4 3-2 5 5 1" fill="none" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="30" cy="94" r="2" fill="${c.deep}"/>
        <path d="M90 48l7-2M92 56l7 1M88 64l6 3" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".85"/>`;
    case 'pollo':
      return `
        <path d="M52 28c-3-8 1-13 5-14 1 5 3 7 5 4 3-4 8-2 8 3 0 3-2 5-4 7Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M52 76l8 7 8-7" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M30 68c-8 4-9 13-1 17 5 2 9 0 11-5" fill="${c.light}" opacity=".95" stroke="${c.deep}" stroke-width="1"/>
        <path d="M90 82c8 0 12 5 10 11-6 0-10-4-11-9Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M42 92l-3 7M52 94l-2 7M68 94l2 7M78 92l3 7" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>`;
    case 'wick':
      return `
        <path d="M34 62l20 26H38l-8-20Z" fill="${c.deep}" opacity=".95"/>
        <path d="M86 62L66 88h16l8-20Z" fill="${c.deep}" opacity=".95"/>
        <path d="M52 58l8 15 8-15" fill="#ffffff" opacity=".88"/>
        <path d="M60 71l3 10-3 4-3-4Z" fill="#14141c"/>
        <path d="M46 48c4-3 9-3 13 0M74 48c-4-3-9-3-13 0" stroke="${c.deep}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M50 74c2 6 5 9 10 9s8-3 10-9" fill="${c.deep}" opacity=".22"/>
        <path d="M50 84v4M70 84v4" stroke="${c.accent}" stroke-width="1.4"/>
        <circle cx="60" cy="88" r="2" fill="${c.accent}"/>`;
    case 'pumpkin':
      return `
        <path d="M56 28c-1-8 0-13 3-16 4 3 5 9 4 16Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M64 25c6-4 11-3 13 1-5 2-9 1-13-1Z" fill="${c.accent}"/>
        <path d="M38 56l10 3-3 9Z" fill="${c.deep}"/>
        <path d="M82 56l-10 3 3 9Z" fill="${c.deep}"/>
        <path d="M46 74l4 6 5-6 5 6 5-6 5 6" fill="none" stroke="${c.deep}" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M34 44c-4 10-2 22 4 30M86 44c4 10 2 22-4 30M48 38c-3 12-2 24 1 32M72 38c3 12 2 24-1 32" stroke="${c.deep}" stroke-width="1.4" fill="none" opacity=".35"/>
        <path d="M92 38c2-3 5-3 7 0 2-3 5-3 7 0-2 4-5 6-7 8-2-2-5-4-7-8Z" fill="${c.deep}" opacity=".5"/>`;
    case 'santa':
      return `
        <path d="M40 30c2-18 11-27 22-27 11 0 17 8 18 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M38 30h46" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
        <circle cx="86" cy="10" r="5" fill="#ffffff" stroke="${c.deep}" stroke-width=".8"/>
        <path d="M38 60c2 18 10 28 22 28s20-10 22-28c-8 6-14 8-22 8s-14-2-22-8Z" fill="#ffffff" stroke="${c.deep}" stroke-width="1"/>
        <path d="M32 84h56l3 12H29Z" fill="#2f2a33"/>
        <path d="M52 84h16v12H52Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <rect x="57" y="87" width="6" height="7" rx="1" fill="none" stroke="${c.deep}" stroke-width="1"/>
        <path d="M92 76c9-2 15 4 14 12-1 7-9 10-16 6Z" fill="#8a5a2b" stroke="${c.deep}" stroke-width="1"/>
        <path d="M96 76c0-4 3-6 6-5" stroke="${c.accent}" stroke-width="2" fill="none"/>`;
    case 'cupid':
      return `
        <ellipse cx="60" cy="9" rx="15" ry="4" fill="none" stroke="${c.accent}" stroke-width="2.4"/>
        <path d="M32 54c-12-10-19 0-13 9 4 7 11 4 14-1ZM88 54c12-10 19 0 13 9-4 7-11 4-14-1Z" fill="#ffffff" opacity=".85" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M26 58c-10 8-10 18 0 22" fill="none" stroke="#8a5a2b" stroke-width="2.4"/>
        <path d="M26 58v22" stroke="#f2efe8" stroke-width="1.2"/>
        <path d="M26 69l26-9" stroke="#8a5a2b" stroke-width="2"/>
        <path d="M52 60l-3-6M52 60l5-5" stroke="${c.deep}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M70 60l5-4 4 6-6 2Z" fill="${c.accent}" opacity=".9"/>
        <path d="M91 74c2-4 7-4 9 0 2 4-2 7-4.5 9-2.5-2-6.5-5-4.5-9Z" fill="${c.accent}" opacity=".9"/>`;
    case 'charm':
      return `
        <path d="M30 74q30 20 60 0" stroke="#ffd166" stroke-width="2.6" fill="none"/>
        <circle cx="38" cy="82" r="2" fill="#ffd166"/><circle cx="48" cy="87" r="1.8" fill="#ffd166"/><circle cx="60" cy="89" r="2" fill="#ffd166"/><circle cx="72" cy="87" r="1.8" fill="#ffd166"/><circle cx="82" cy="82" r="2" fill="#ffd166"/>
        <path d="M60 89l1.4 3.6 3.6 1.4-3.6 1.4L60 99l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="#ffd166"/>
        <path d="M76 88l4 6 6-2-3 6-5-1Z" fill="${c.accent}" opacity=".9"/>
        <path d="M42 88c2-3 6-3 8 0 2 3-2 6-4 8-2-2-6-5-4-8Z" fill="${c.accent}" opacity=".9"/>
        <path d="M90 38l1.4 3.6 3.6 1.4-3.6 1.4L90 48l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="${c.light}" opacity=".8"/>
        <path d="M26 48l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8L22 52l3-1Z" fill="${c.light}" opacity=".7"/>`;
    case 'snow':
      return `
        <path d="M39 31c2-10 9-16 21-16s19 6 21 16c-8-4-14-5-21-5s-13 1-21 5Z" fill="#ffffff" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M35 33c9 4 17 5 25 5s16-1 25-5" fill="none" stroke="${c.deep}" stroke-width="1" opacity=".32"/>
        <path d="M31 62c-9 0-13 5-11 12 6 0 10-3 12-7Z" fill="#8a5a2b" stroke="#5a3818" stroke-width="1.1"/>
        <path d="M89 62c9 0 13 5 11 12-6 0-10-3-12-7Z" fill="#8a5a2b" stroke="#5a3818" stroke-width="1.1"/>
        <path d="M22 65l-6-4M21 71l-7 2M98 65l6-4M99 71l7 2" stroke="#8a5a2b" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M60 17l1.3 3.4 3.4 1.3-3.4 1.3L60 26.4l-1.3-3.4-3.4-1.3 3.4-1.3Z" fill="${c.accent}" opacity=".9"/>
        <path d="M59 66l14 4-14 4-2-4Z" fill="#ff9a5a" stroke="#a63516" stroke-width=".8"/>
        <circle cx="60" cy="88" r="2.6" fill="${c.deep}"/>
        <circle cx="60" cy="97" r="2.2" fill="${c.deep}" opacity=".85"/>
        <path d="M22 36l1.4 3.6 3.6 1.4-3.6 1.4L22 46l-1.4-3.6L17 41l3.6-1.4Z" fill="${c.light}" opacity=".85"/>
        <path d="M99 66l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1Z" fill="${c.light}" opacity=".85"/>
        <circle cx="94" cy="38" r="1.8" fill="${c.accent}" opacity=".7"/>`;
    case 'zombie':
      return `
        <path d="M55 29c2-8 8-13 15-12-1 7-5 11-10 13Z" fill="#7fbf4a" stroke="${c.deep}" stroke-width="1"/>
        <path d="M35 35l-3-5M32 41l-5-2" stroke="${c.deep}" stroke-width="1.2" opacity=".55" stroke-linecap="round"/>
        <g transform="rotate(-16 44 42)">
          <rect x="32" y="37" width="25" height="9" rx="4.5" fill="#f4f0e2" stroke="${c.deep}" stroke-width="1"/>
          <path d="M38 38v7M45 38v7M52 38v7" stroke="${c.deep}" stroke-width=".8" opacity=".5"/>
        </g>
        <path d="M77 86h15M80 82v8M85 82v8M90 82v8" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
        <path d="M92 71c4-2 8 0 8 3 2 0 3 3 1 4-2 1-4 1-5-1-2 1-4 1-5-1-1-2 0-4 1-5Z" fill="#f4f0e2" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M26 78c-3 2-4 6-2 8 3 0 5-2 5-5Z" fill="${c.accent}" opacity=".8"/>
        <circle cx="94" cy="45" r="1.6" fill="${c.accent}" opacity=".75"/>`;
    case 'undead':
      return `
        <path d="M35 31c2 4 5 6 9 6M85 31c-2 4-5 6-9 6" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M42 20c3-6 10-9 16-7M78 20c-3-6-10-9-16-7" fill="none" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".85"/>
        <path d="M56 16c2-2 6-2 8 0" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".45"/>
        <path d="M41 93c-5 7-2 14 4 14 4 0 5-4 3-8M79 93c5 7 2 14-4 14-4 0-5-4-3-8" fill="${c.accent}" opacity=".35"/>
        <path d="M50 92c-2 8 1 14 10 14s12-6 10-14c-3 4-6 6-10 6s-7-2-10-6Z" fill="${c.accent}" opacity=".45"/>
        <path d="M40 68q7 4 14 0M66 68q7 4 14 0" stroke="${c.deep}" stroke-width="1" fill="none" opacity=".28"/>
        <circle cx="30" cy="54" r="2" fill="${c.light}" opacity=".7"/><circle cx="94" cy="66" r="1.6" fill="${c.accent}" opacity=".7"/>
        <path d="M90 38l1.2 3.2 3.2 1.2-3.2 1.2L90 47l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".8"/>`;
    case 'starfish':
      return `
        <path d="M34 54c-13-4-22 2-22 10 0 7 8 9 14 5 5-4 7-9 8-15Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M86 54c13-4 22 2 22 10 0 7-8 9-14 5-5-4-7-9-8-15Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M55 33c-3-12 0-21 6-24 6 5 7 14 3 24Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M43 90c-9 3-14 10-10 16 6 1 11-2 13-8M77 90c9 3 14 10 10 16-6 1-11-2-13-8" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="20" cy="62" r="1.5" fill="${c.light}"/><circle cx="25" cy="69" r="1.3" fill="${c.light}"/><circle cx="100" cy="62" r="1.5" fill="${c.light}"/><circle cx="95" cy="69" r="1.3" fill="${c.light}"/>
        <circle cx="57" cy="20" r="1.4" fill="${c.light}"/><circle cx="60" cy="14" r="1.2" fill="${c.light}"/>
        <circle cx="39" cy="99" r="1.2" fill="${c.light}"/><circle cx="81" cy="99" r="1.2" fill="${c.light}"/>
        <circle cx="94" cy="42" r="3" fill="none" stroke="${c.light}" stroke-width="1.2" opacity=".7"/>
        <circle cx="101" cy="34" r="1.9" fill="none" stroke="${c.light}" stroke-width="1" opacity=".55"/>
        <path d="M26 44l1.2 3.2 3.2 1.2-3.2 1.2L26 53l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.accent}" opacity=".8"/>`;
    case 'pika':
      return `
        <path d="M45 34C39 22 40 10 46 4c7 6 10 18 8 30Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M75 34c6-12 5-24-1-30-7 6-10 18-8 30Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M47 15c-3-4-2-8 1-9 3 3 4 6 3 9Z" fill="#2b2440"/>
        <path d="M73 15c3-4 2-8-1-9-3 3-4 6-3 9Z" fill="#2b2440"/>
        <path d="M47 25c0-6 1-11 3-15M73 25c0-6-1-11-3-15" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".55"/>
        <ellipse cx="37" cy="70" rx="6.4" ry="4.8" fill="${c.accent}" opacity=".6"/>
        <ellipse cx="83" cy="70" rx="6.4" ry="4.8" fill="${c.accent}" opacity=".6"/>
        <path d="M91 79l19-11-7 13 11 2-21 13 7-12Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M94 86l9-5-4 7 6 1-9 6 3-6Z" fill="${c.light}" opacity=".55"/>
        <path d="M27 44l2-6 2 5 5-1-3 4" stroke="${c.accent}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M96 30l1.2 3.2 3.2 1.2-3.2 1.2L96 39l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".8"/>`;
    case 'unicorn':
      return `
        <path d="M55 32c1-10 3-20 5-29 3 9 5 19 5 29Z" fill="#ffe9a8" stroke="#a87900" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M59 32c0-9 1-18 1-26M60 25c1-1 2-2 2-4M60 18c-1 0-2-1-2-2M60 11c1 0 1-1 1-2" fill="none" stroke="#a87900" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
        <path d="M57 29c1-8 2-16 3-23" stroke="#fff7d6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>
        <path d="M42 33c-9-2-14 3-12 8-5 2-5 7 0 9-3 4 1 8 6 7 0-8 3-16 6-24Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M78 33c9-2 14 3 12 8 5 2 5 7 0 9 3 4-1 8-6 7 0-8-3-16-6-24Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M45 31c-2-6 0-10 3-12 3 4 3 8 2 12M75 31c2-6 0-10-3-12-3 4-3 8-2 12" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M26 46l1.4 3.8 3.8 1.4-3.8 1.4L26 56l-1.4-3.8-3.8-1.4 3.8-1.4Z" fill="#ffe9a8" opacity=".9"/>
        <path d="M95 36l1.2 3.2 3.2 1.2-3.2 1.2L95 45l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".9"/>
        <circle cx="91" cy="60" r="1.8" fill="${c.accent}" opacity=".8"/>`;
    case 'devil':
      return `
        <path d="M43 33c-10-2-16-10-15-22 10 3 17 10 21 19Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M77 33c10-2 16-10 15-22-10 3-17 10-21 19Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M43 27c-4-4-7-9-7-14M77 27c4-4 7-9 7-14" stroke="${c.light}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".5"/>
        <circle cx="33" cy="15" r="2.2" fill="${c.accent}"/><circle cx="87" cy="15" r="2.2" fill="${c.accent}"/>
        <path d="M30 62c-9-3-14 2-12 8 4-1 6 1 6 5 2-3 5-3 7-1 1-4 1-8-1-12Z" fill="${c.accent}" opacity=".85"/>
        <path d="M90 62c9-3 14 2 12 8-4-1-6 1-6 5-2-3-5-3-7-1-1-4-1-8 1-12Z" fill="${c.accent}" opacity=".85"/>
        <path d="M91 82c9 3 12 9 10 15" fill="none" stroke="${c.deep}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M100 94l7-1-4 8-2-3-4 1Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".9" stroke-linejoin="round"/>
        <path d="M60 82l-3 8 3-2 3 2Z" fill="${c.accent}" opacity=".95"/>
        <path d="M40 50l11-3M80 50l-11-3" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
        <path d="M28 44l1.2 3.2 3.2 1.2-3.2 1.2L28 53l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".75"/>`;
    case 'yoga':
      return `
        <path d="M38 20a28 28 0 0 1 44 0" fill="none" stroke="${c.accent}" stroke-width="1.6" opacity=".45"/>
        <path d="M33 25a34 34 0 0 1 54 0" fill="none" stroke="${c.accent}" stroke-width="1.2" opacity=".28"/>
        <path d="M42 89c-11 6-14 13-6 15 7 2 16-2 24-7 8 5 17 9 24 7 8-2 5-9-6-15" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M35 68c-4 9-1 17 7 20M85 68c4 9 1 17-7 20" fill="none" stroke="${c.deep}" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="42" cy="88" r="3.4" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="78" cy="88" r="3.4" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M55 42c2-3 8-3 10 0-2 4-8 4-10 0Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="60" cy="41" r="1.5" fill="${c.accent}"/>
        <path d="M91 80c2-4 6-5 8-2 2 2 0 5-3 5-3 0-5-1-7 2-3 4-8 3-10 0 3-1 6-1 8-3Z" fill="${c.accent}" opacity=".9"/>
        <path d="M27 48l1.2 3.2 3.2 1.2-3.2 1.2L27 57l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".8"/>`;
    case 'shark':
      return `
        <path d="M52 33c1-11 8-19 16-24-1 10-1 18 2 24Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M56 30c2-7 6-12 9-15" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".45"/>
        <path d="M30 73c-7 1-12 6-10 12 6 2 12-2 15-7Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M90 73c7 1 12 6 10 12-6 2-12-2-15-7Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M90 78c10-4 17 0 20 7-7 1-11-1-15-4 4 4 3 8-1 10-4-3-6-8-4-13Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M84 56c0 4 3 6 5 5M88 54c0 4 2 6 5 5M92 53c0 3 2 5 4 4" fill="none" stroke="${c.deep}" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
        <path d="M58 30c2-5 5-8 8-9" stroke="${c.light}" stroke-width="1.2" fill="none" opacity=".5"/>
        <circle cx="94" cy="40" r="2.6" fill="none" stroke="${c.accent}" stroke-width="1.2" opacity=".7"/>
        <circle cx="101" cy="32" r="1.7" fill="none" stroke="${c.accent}" stroke-width="1" opacity=".55"/>`;
    case 'whitewhale':
      return `
        <ellipse cx="60" cy="31" rx="8" ry="3" fill="${c.deep}" opacity=".35"/>
        <path d="M59 28c-3-8-1-15 3-21M63 28c1-7 4-12 8-15M62 20c-3-2-5-5-5-8M65 16c3-1 5-3 6-6" fill="none" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="54" cy="7" r="2" fill="${c.accent}" opacity=".8"/><circle cx="72" cy="10" r="1.6" fill="${c.accent}" opacity=".7"/><circle cx="63" cy="3" r="1.4" fill="${c.light}" opacity=".9"/>
        <path d="M30 76c-7 2-10 8-7 13 6 1 11-3 13-8Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M90 78c9-5 17-1 20 6-7 2-12 0-16-3 3 4 2 8-2 10-4-3-6-8-2-13Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M40 89q20 8 40 0M45 95q15 6 30 0" fill="none" stroke="${c.accent}" stroke-width="1.3" opacity=".65"/>
        <path d="M88 52c0 4 3 6 5 5M92 50c0 4 2 6 5 5" fill="none" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>
        <path d="M27 46l1.4 3.8 3.8 1.4-3.8 1.4L27 56l-1.4-3.8-3.8-1.4 3.8-1.4Z" fill="${c.light}" opacity=".8"/>`;
    case 'dragon':
      return `
        <path d="M44 31c-6-9-4-18 2-23 4 6 6 15 6 23Z" fill="#ffd166" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M76 31c6-9 4-18-2-23-4 6-6 15-6 23Z" fill="#ffd166" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M34 52c-14-4-22 6-17 15 3 5 9 4 12 1-3 6 1 10 6 9-1-8 0-17-1-25Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M86 52c14-4 22 6 17 15-3 5-9 4-12 1 3 6-1 10-6 9 1-8 0-17 1-25Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M90 84c9-2 15 4 14 10-7 1-12-2-16-6Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M88 92c6 0 9 4 8 8-5 1-9-2-10-6Z" fill="${c.light}" opacity=".8"/>
        <path d="M52 19l4 8 4-4 4 4 4-8" fill="none" stroke="${c.light}" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/>`;
    case 'darkjoker':
      return `
        <path d="M42 33 25 15l17 4 5-15 6 15 15-4-13 19Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="25" cy="13" r="3" fill="#ffd166"/><circle cx="60" cy="3" r="3" fill="#ffd166"/><circle cx="86" cy="12" r="3" fill="#ffd166"/>
        <path d="M39 36q21 7 42 0" stroke="#ffd166" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M28 60l6-4 6 4-6 4Z" fill="${c.light}" opacity=".9"/>
        <path d="M92 62l10-4 2 5-8 6Z" fill="#f4f0e2" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M96 64l2 2-1 2-2-1Z" fill="${c.accent}"/>
        <path d="M88 78c4-2 7 0 8 3" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".6"/>`;
    case 'jackskull':
      return `
        <path d="M38 32l5-14 8 9 9-12 9 12 8-9 5 14Z" fill="#ff9f43" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <ellipse cx="47" cy="60" rx="10" ry="12" fill="${c.deep}" opacity=".16"/>
        <ellipse cx="73" cy="60" rx="10" ry="12" fill="${c.deep}" opacity=".16"/>
        <path d="M57 58l3 5h-6Z" fill="${c.deep}" opacity=".7"/>
        <path d="M42 84q18 11 36 0" stroke="${c.deep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M48 88l3 4M55 90l3 4M62 90l3 4M69 88l3 4" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
        <path d="M52 95l8-4 8 4-8 5Z" fill="#ff9f43" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M90 58c5-2 8 2 6 6-1 3-4 3-5 0-2 2-4 1-4-1s1-4 3-5Z" fill="#ff9f43" opacity=".9"/>`;
    case 'sally':
      return `
        <path d="M42 34c-9-3-14 3-11 9-5 4-2 10 4 9-2 5 3 8 7 5" fill="${c.accent}" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M78 34c9-3 14 3 11 9 5 4 2 10-4 9 2 5-3 8-7 5" fill="${c.accent}" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M40 44c-3 8-2 16 2 22M80 44c3 8 2 16-2 22" fill="none" stroke="${c.accent}" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M34 86h11M32 91h9M76 88h13" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>
        <rect x="66" y="82" width="14" height="12" rx="2" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M68 84l10 8M78 84l-10 8" stroke="${c.deep}" stroke-width="1" opacity=".7"/>
        <path d="M26 66l5-3 5 3-5 3Z" fill="${c.accent}" opacity=".85"/>
        <path d="M60 94v10" stroke="${c.deep}" stroke-width="1.2" stroke-dasharray="3 2.5" opacity=".65"/>
        <path d="M40 99l8-3M72 96l8-3" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>`;
    case 'keke':
      return `
        <path d="M44 33c-4-9 0-16 7-18 2 6 2 12 0 18Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M76 33c4-9 0-16-7-18-2 6-2 12 0 18Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <circle cx="60" cy="27" r="6" fill="#ffd166" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M93 49l3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" fill="#ffd166" stroke="${c.deep}" stroke-width=".9" stroke-linejoin="round"/>
        <path d="M92 62l-9 12" stroke="#ffd166" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M28 42l1.4 3.6 3.6 1.4-3.6 1.4L28 52l-1.4-3.6L23 47l3.6-1.4Z" fill="${c.light}" opacity=".85"/>
        <path d="M36 80l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" fill="${c.light}" opacity=".7"/>`;
    case 'bestie':
      return `
        <path d="M88 44c8-6 17 0 15 8-1 6-8 10-15 15-7-5-14-9-15-15-2-8 7-14 15-8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M88 68c0 9-4 16-9 21" stroke="${c.deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M46 31c-4-6 4-10 8-6 4-4 12 0 8 6l-8 8Z" fill="#ffd166" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M33 88c7-4 13-4 20 0M33 93c7-4 13-4 20 0" stroke="${c.accent}" stroke-width="1.6" fill="none" opacity=".8"/>
        <path d="M76 84c5 0 8 3 7 7-5 1-8-2-9-5" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>`;
    case 'dog':
      return `
        <path d="M38 35c-8-1-13 6-12 15 1 7 6 10 11 6 2-6 2-14 1-21Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M82 35c8-1 13 6 12 15-1 7-6 10-11 6-2-6-2-14-1-21Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M85 84c9-5 15 0 14 8-7 2-12 0-16-4 4 4 3 8-1 10-4-3-5-8-2-12Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <rect x="36" y="84" width="48" height="7" rx="3.5" fill="${c.accent}"/>
        <circle cx="60" cy="88" r="4" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
        <path d="M55 80q5 7 10 0" fill="#ff8fa3" opacity=".9"/>
        <path d="M42 38c2-4 4-6 7-7M78 38c-2-4-4-6-7-7" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".6"/>`;
    case 'karen':
      return `
        <path d="M39 34c0-11 9-18 21-18s21 7 21 18c-7-5-14-7-21-7s-14 2-21 7Z" fill="#e8c48a" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 35c-4 9-3 18 2 24M82 35c4 9 3 18-2 24" fill="none" stroke="#e8c48a" stroke-width="7" stroke-linecap="round"/>
        <path d="M39 45c4-3 8-3 12 0M69 45c4-3 8-3 12 0" stroke="#e8c48a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
        <circle cx="29" cy="68" r="5.5" fill="none" stroke="#ffd166" stroke-width="2"/>
        <circle cx="91" cy="68" r="5.5" fill="none" stroke="#ffd166" stroke-width="2"/>
        <path d="M92 80h12v10H92Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M93 80c1-5 10-5 11 0" fill="none" stroke="${c.deep}" stroke-width="1.6"/>
        <path d="M94 88h8" stroke="#ffd166" stroke-width="1.2" opacity=".8"/>`;
    case 'motherearth':
      return `
        <path d="M38 33c0-11 9-19 22-19s22 8 22 19c-7-4-14-5-22-5s-15 1-22 5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M45 28c-8-7-7-16-1-20 5 5 7 13 5 20M75 28c8-7 7-16 1-20-5 5-7 13-5 20" fill="#8fe07a" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <circle cx="60" cy="94" r="14" fill="#8be9ff" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M50 90c4-4 8-2 10 2 2 3 7 2 9 6-3 3-8 1-10 4-4 3-9 1-10-2-1-3 0-7 1-10Z" fill="#7fc9a3"/>
        <path d="M30 61c-6-3-9 2-5 6M90 61c6-3 9 2 5 6" stroke="${c.accent}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
        <circle cx="26" cy="79" r="3" fill="${c.accent}"/><circle cx="95" cy="84" r="2.5" fill="${c.accent}"/>`;
    case 'werewolf':
      return `
        <path d="M42 32 37 18l11 7Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M78 32 83 18 72 25Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M54 24l3-7 2 6 2-6 3 7" fill="none" stroke="${c.deep}" stroke-width="1.4" stroke-linejoin="round" opacity=".6"/>
        <path d="M60 24a7 7 0 1 0 0 14 5.5 5.5 0 1 1 0-14Z" fill="${c.accent}" opacity=".95"/>
        <path d="M34 66l-8 3 7 4-7 4 9 2M86 66l8 3-7 4 7 4-9 2" fill="none" stroke="${c.deep}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>
        <path d="M49 78l4 6-4-1M71 78l-4 6 4-1" fill="#fff" stroke="${c.deep}" stroke-width=".8" stroke-linejoin="round"/>
        <path d="M60 70l-4 5h8Z" fill="${c.deep}" opacity=".85"/>
        <path d="M46 78q14 13 28 0" fill="none" stroke="${c.light}" stroke-width="2" opacity=".65"/>
        <path d="M57 74q3 3 6 0" stroke="${c.deep}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M35 88q9 8 18 5M85 88q-9 8-18 5" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/>`;
    case 'normal':
      return `
        <path d="M52 18c0-5 4-8 9-8M61 10c-1 4-3 7-7 9" fill="none" stroke="${c.deep}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
        <circle cx="47" cy="60" r="10.5" fill="none" stroke="${c.deep}" stroke-width="1.4" opacity=".55"/>
        <circle cx="73" cy="60" r="10.5" fill="none" stroke="${c.deep}" stroke-width="1.4" opacity=".55"/>
        <path d="M57.5 60h5" stroke="${c.deep}" stroke-width="1.4" opacity=".55"/>
        <path d="M60 84v5M56 88h8" stroke="${c.deep}" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>
        <path d="M60 93l6-5-6-3-6 3Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <circle cx="94" cy="41" r="1.7" fill="${c.deep}" opacity=".35"/><circle cx="99" cy="41" r="1.7" fill="${c.deep}" opacity=".35"/><circle cx="104" cy="41" r="1.7" fill="${c.deep}" opacity=".35"/>`;
    case 'gummybear':
      return `
        <circle cx="37" cy="36" r="11.5" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="37" cy="36" r="5.5" fill="${c.light}" opacity=".65"/>
        <circle cx="83" cy="36" r="11.5" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <circle cx="83" cy="36" r="5.5" fill="${c.light}" opacity=".65"/>
        <ellipse cx="60" cy="91" rx="17" ry="12" fill="${c.light}" opacity=".28"/>
        <path d="M43 84c4-5 10-4 12 1" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
        <path d="M74 45l2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#ffffff" opacity=".6"/>
        <path d="M35 82l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" fill="#ffffff" opacity=".5"/>
        <path d="M84 89l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" fill="#ffffff" opacity=".55"/>`;
    case 'muddy':
      return `
        <path d="M48 32c-3-7 0-14 5-17 3 5 3 12 1 17M64 32c2-8 7-13 12-13 2 6 0 11-4 15" fill="none" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <path d="M54 16c-4-5-1-10 4-10 3 0 5 3 4 6-1 3-4 4-8 4ZM76 20c-1-5 3-9 7-8 2 3 0 6-2 8-1 1-3 1-5 0Z" fill="#8fe07a" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M31 84c-5-1-8 2-7 6 2 4 6 3 8 0 2-2 2-4-1-6M90 80c5-1 8 2 7 6-2 4-6 3-8 0-2-2-2-4 1-6Z" fill="${c.accent}" opacity=".75"/>
        <path d="M33 58c2-4 5-6 8-4M79 54c3-2 6-1 8 2" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".4" stroke-linecap="round"/>
        <circle cx="41" cy="78" r="5" fill="${c.deep}" opacity=".22"/><circle cx="80" cy="82" r="6.5" fill="${c.deep}" opacity=".18"/><circle cx="66" cy="95" r="4" fill="${c.deep}" opacity=".2"/>
        <circle cx="88" cy="62" r="2" fill="${c.deep}" opacity=".35"/><circle cx="34" cy="68" r="1.6" fill="${c.deep}" opacity=".3"/><circle cx="74" cy="36" r="2.2" fill="${c.deep}" opacity=".25"/>
        <path d="M30 76c3 1 4 4 2 6M86 74c-3 1-4 4-2 6M54 88c2 1 3 3 2 5" stroke="${c.deep}" stroke-width="1.5" fill="none" opacity=".4" stroke-linecap="round"/>`;
    case 'spot':
      return `
        <path d="M38 37c-9-4-14 2-13 10 1 7 5 11 9 9 3-5 5-13 4-19Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M80 34l10-13 1 17Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M82 38c4-2 7-1 8 2" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".7"/>
        <ellipse cx="73" cy="59" rx="13" ry="11" fill="${c.accent}" opacity=".95"/>
        <circle cx="73" cy="59" r="3.6" fill="${c.deep}"/><circle cx="74" cy="58" r="1.2" fill="#fff" opacity=".85"/>
        <circle cx="45" cy="82" r="5.2" fill="${c.accent}" opacity=".75"/><circle cx="80" cy="88" r="4.2" fill="${c.accent}" opacity=".7"/><circle cx="56" cy="93" r="3" fill="${c.accent}" opacity=".65"/>
        <path d="M84 81c8-3 14 2 13 8-1 5-6 7-10 5 3-1 4-3 3-5-2 1-4 0-5-2 2-1 3-2 3-4-2 1-3 0-4-2Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M34 86h52" stroke="${c.accent}" stroke-width="5" opacity=".9"/>
        <circle cx="60" cy="88" r="4.2" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
        <path d="M55 78q5 6 10 0" fill="#ff8fa3"/>
        <path d="M90 71l5-1M90 76l5 2" stroke="${c.light}" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>`;
    case 'frozen':
      return `
        <path d="M36 36 33 20l7 8 2-14 5 12 4-13 4 13 5-12 2 14 7-8-3 16Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M40 29v-6M60 25v-8M80 29v-6" stroke="#ffffff" stroke-width="1.2" opacity=".7" stroke-linecap="round"/>
        <path d="M29 58c-7 1-10 6-8 11 2 3 6 3 8 1 2-2 2-5 1-7M91 58c7 1 10 6 8 11-2 3-6 3-8 1-2-2-2-5-1-7Z" fill="${c.accent}" opacity=".35"/>
        <path d="M83 31l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5ZM31 41l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1Z" fill="#ffffff" opacity=".85"/>
        <path d="M37 83h46l3 5v10H34V88Z" fill="${c.light}" opacity=".38" stroke="#ffffff" stroke-width="1.2"/>
        <path d="M34 88h52M49 83l-6 15M66 83l4 15M79 83l-3 15" stroke="#ffffff" stroke-width="1" opacity=".55"/>
        <path d="M42 86l6 6-3 5M76 85l-4 7 3 5" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".7" stroke-linejoin="round"/>
        <path d="M47 79c3 2 6 2 9 0M64 79c3 2 6 2 9 0" stroke="${c.light}" stroke-width="1.2" fill="none" opacity=".7"/>
        <path d="M94 72l1.4 3.6 3.6 1.4-3.6 1.4L94 82l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="${c.accent}" opacity=".8"/>
        <circle cx="27" cy="78" r="1.8" fill="#ffffff" opacity=".65"/><circle cx="91" cy="48" r="1.5" fill="#ffffff" opacity=".55"/>`;
    case 'sixtyseven':
      return `
        <rect x="43" y="1" width="34" height="21" rx="6" fill="#1d1734" stroke="${c.accent}" stroke-width="1.5"/>
        <text x="60" y="17" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="${c.accent}">67</text>
        <path d="M60 22v8" stroke="${c.deep}" stroke-width="1.4" opacity=".55"/>
        <path d="M37 35c0-6 5-10 11-11M83 35c0-6-5-10-11-11" fill="none" stroke="${c.accent}" stroke-width="4" stroke-linecap="round"/>
        <path d="M38 37h44" stroke="${c.accent}" stroke-width="3.6" stroke-linecap="round" opacity=".9"/>
        <path d="M42 82h36v14H42Z" fill="#f6f2e9" stroke="${c.deep}" stroke-width="1"/>
        <text x="60" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="${c.deep}">67</text>
        <path d="M37 85h5v10h-5M78 85h5v10h-5" fill="${c.accent}" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M28 64l-7-4M92 64l7-4" stroke="${c.accent}" stroke-width="2.2" stroke-linecap="round" opacity=".75"/>
        <path d="M85 88c8-2 13 2 13 8-4 1-7-1-9-4 2 3 0 6-3 6-3-1-4-4-1-10Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1" opacity=".85"/>`;
    case 'creeper':
      return `
        <path d="M77 31l3-10 5 4-2 9" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M83 22c1-4 4-6 7-4 3 2 2 6-1 7" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="91" cy="17" r="2.6" fill="#ffd166"/><circle cx="91" cy="17" r="1.2" fill="#fff6cc"/>
        <rect x="45" y="52" width="11" height="11" rx="1" fill="${c.deep}"/>
        <rect x="64" y="52" width="11" height="11" rx="1" fill="${c.deep}"/>
        <path d="M52 68h16v10h-5v7h-6v-7h-5Z" fill="${c.deep}"/>
        <path d="M44 74h5v5h-5M71 74h5v5h-5" fill="${c.deep}" opacity=".9"/>
        <rect x="30" y="42" width="5" height="5" fill="${c.accent}" opacity=".45"/><rect x="85" y="42" width="5" height="5" fill="${c.accent}" opacity=".45"/>
        <rect x="28" y="70" width="5" height="5" fill="${c.light}" opacity=".38"/><rect x="87" y="70" width="5" height="5" fill="${c.light}" opacity=".38"/>
        <path d="M34 92h8v6h-8ZM78 92h8v6h-8Z" fill="${c.deep}" opacity=".8"/>
        <path d="M39 38c8-4 15-4 22 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".45"/>`;
    case 'lion':
      return `
        <path fill-rule="evenodd" d="M60 21a39 39 0 1 0 0 78 39 39 0 1 0 0-78Zm0 10a29 29 0 1 1 0 58 29 29 0 1 1 0-58Z" fill="${c.accent}" opacity=".82" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M38 32l-2-10 9 5 4-8 3 9M82 32l2-10-9 5-4-8-3 9" fill="${c.body}" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round"/>
        <ellipse cx="60" cy="78" rx="15" ry="11" fill="${c.light}" opacity=".6"/>
        <path d="M56 74l4-3 4 3-4 3Z" fill="${c.deep}"/>
        <path d="M60 77v4M54 81q6 5 12 0" stroke="${c.deep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M32 84c6-3 11-1 14 3M88 84c-6-3-11-1-14 3" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    case 'panda':
      return `
        <circle cx="37" cy="31" r="11" fill="${c.deep}"/><circle cx="37" cy="31" r="5" fill="${c.deep}" opacity=".55"/>
        <circle cx="83" cy="31" r="11" fill="${c.deep}"/><circle cx="83" cy="31" r="5" fill="${c.deep}" opacity=".55"/>
        <ellipse cx="47" cy="59" rx="12.5" ry="14" fill="${c.deep}" opacity=".62" transform="rotate(-12 47 59)"/>
        <ellipse cx="73" cy="59" rx="12.5" ry="14" fill="${c.deep}" opacity=".62" transform="rotate(12 73 59)"/>
        <path d="M56 70l4-3 4 3-4 3Z" fill="${c.deep}"/>
        <path d="M60 73v4M53 78q7 6 14 0" stroke="${c.deep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M88 44c8-9 15-11 20-8-4 6-9 11-16 15Z" fill="#8fe07a" stroke="${c.deep}" stroke-width="1"/>
        <path d="M90 49c5-3 9-6 12-9M92 44l1-6M97 41l3-5" stroke="#5f9e48" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M34 84c5-2 9-1 12 2M80 88c4-2 7-1 9 1" stroke="${c.deep}" stroke-width="1.4" fill="none" opacity=".3" stroke-linecap="round"/>`;
    case 'penguin':
      return `
        <ellipse cx="60" cy="84" rx="24" ry="16" fill="${c.light}" opacity=".95"/>
        <path d="M29 66c-8 8-8 18-1 24 4 3 8 0 9-5l1-13Z" fill="${c.deep}" opacity=".85"/>
        <path d="M91 66c8 8 8 18 1 24-4 3-8 0-9-5l-1-13Z" fill="${c.deep}" opacity=".85"/>
        <ellipse cx="47" cy="56" rx="11.5" ry="14" fill="${c.light}" stroke="${c.deep}" stroke-width=".9"/>
        <ellipse cx="73" cy="56" rx="11.5" ry="14" fill="${c.light}" stroke="${c.deep}" stroke-width=".9"/>
        <circle cx="47" cy="56" r="3.4" fill="${c.deep}"/><circle cx="48" cy="55" r="1.2" fill="#ffffff"/>
        <circle cx="73" cy="56" r="3.4" fill="${c.deep}"/><circle cx="74" cy="55" r="1.2" fill="#ffffff"/>
        <path d="M60 63l11 8-11 5-11-5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M49 96c3-3 8-3 11 0M60 96c3-3 8-3 11 0" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
        <path d="M38 44c4-3 8-4 12-2M70 42c4-2 8-1 12 2" stroke="${c.light}" stroke-width="1.5" fill="none" opacity=".5" stroke-linecap="round"/>`;
    case 'owl':
      return `
        <path d="M38 34L31 17l13 7 5-10 5 10 13-7-7 17Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="47" cy="57" r="15" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4"/>
        <circle cx="73" cy="57" r="15" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4"/>
        <circle cx="47" cy="57" r="6.2" fill="${c.deep}"/><circle cx="49" cy="55" r="2" fill="#ffffff" opacity=".85"/>
        <circle cx="73" cy="57" r="6.2" fill="${c.deep}"/><circle cx="75" cy="55" r="2" fill="#ffffff" opacity=".85"/>
        <path d="M60 62l7 8-7 7-7-7Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M30 66c-4 9-2 20 5 26M90 66c4 9 2 20-5 26" fill="none" stroke="${c.deep}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
        <g fill="${c.accent}" opacity=".65"><circle cx="52" cy="84" r="1.2"/><circle cx="60" cy="88" r="1"/><circle cx="68" cy="84" r="1.2"/><circle cx="56" cy="92" r=".9"/><circle cx="64" cy="92" r=".9"/></g>
        <path d="M88 26l1.4 3.6 3.6 1.4-3.6 1.4L88 36l-1.4-3.6L83 31l3.6-1.4Z" fill="${c.accent}" opacity=".9"/>`;
    case 'snake':
      return `
        <path d="M84 90c10-1 16 4 18 10 2 7-4 10-9 6-4-3-3-8 1-9" fill="none" stroke="${c.body}" stroke-width="7" stroke-linecap="round"/>
        <path d="M84 90c10-1 16 4 18 10 2 7-4 10-9 6-4-3-3-8 1-9" fill="none" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>
        <path d="M34 44l8-8 8 8-8 8ZM70 44l8-8 8 8-8 8ZM52 32l8-8 8 8-8 8ZM42 72l8-8 8 8-8 8ZM66 72l8-8 8 8-8 8Z" fill="${c.deep}" opacity=".12"/>
        <ellipse cx="60" cy="87" rx="20" ry="11" fill="${c.light}" opacity=".55"/>
        <path d="M48 84q12 6 24 0M48 89q12 6 24 0M48 94q12 5 24 0" stroke="${c.deep}" stroke-width=".8" fill="none" opacity=".22"/>
        <path d="M54 78l4 5-4-1M66 78l-4 5 4-1" fill="#ffffff" stroke="${c.deep}" stroke-width=".7" stroke-linejoin="round"/>
        <path d="M60 83c0 6 1 10 4 13M64 96l-4 4M64 96l4 4" stroke="#ff5e8a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M47 58v5M73 58v5" stroke="${c.deep}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>`;
    case 'spider':
      return `
        <path d="M28 52c-8-4-14-2-18 4M28 64c-10 0-16 3-19 9M30 76c-9 2-14 7-16 13M33 86c-7 4-10 9-10 14M92 52c8-4 14-2 18 4M92 64c10 0 16 3 19 9M90 76c9 2 14 7 16 13M87 86c7 4 10 9 10 14" fill="none" stroke="${c.deep}" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
        <path d="M18 20l12 8M14 32l16 2M26 14l4 14" stroke="${c.light}" stroke-width="1.1" opacity=".45"/>
        <circle cx="60" cy="60" r="34" fill="none" stroke="${c.light}" stroke-width="1.8" stroke-dasharray="2 4" opacity=".25"/>
        <g fill="${c.light}"><circle cx="43" cy="47" r="2.4"/><circle cx="53" cy="45" r="2.1"/><circle cx="67" cy="45" r="2.1"/><circle cx="77" cy="47" r="2.4"/></g>
        <g fill="${c.deep}"><circle cx="43" cy="47" r="1.1"/><circle cx="53" cy="45" r=".9"/><circle cx="67" cy="45" r=".9"/><circle cx="77" cy="47" r="1.1"/></g>
        <path d="M60 78l-8 8h16Z" fill="${c.accent}" opacity=".9"/>
        <path d="M88 28c4-3 8-3 11 0M91 34c4-2 7-1 9 2" stroke="${c.light}" stroke-width="1.1" fill="none" opacity=".5"/>`;
    case 'crab':
      return `
        <path d="M32 68c-10-3-18 3-19 12 0 8 8 12 14 8 4-3 4-8 1-10-3-2-7 0-7 4M88 68c10-3 18 3 19 12 0 8-8 12-14 8-4-3-4-8-1-10 3-2 7 0 7 4" fill="${c.body}" stroke="${c.deep}" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M30 86c-8 2-13 6-14 12M36 92c-6 3-9 7-9 12M90 86c8 2 13 6 14 12M84 92c6 3 9 7 9 12" fill="none" stroke="${c.deep}" stroke-width="2" stroke-linecap="round" opacity=".75"/>
        <path d="M38 38c10-7 34-7 44 0" fill="none" stroke="${c.accent}" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>
        <path d="M44 44c5-3 11-4 16-4s11 1 16 4" fill="none" stroke="${c.deep}" stroke-width="1" opacity=".25"/>
        <circle cx="25" cy="78" r="3" fill="${c.light}" opacity=".65"/><circle cx="21" cy="69" r="2" fill="${c.light}" opacity=".5"/><circle cx="95" cy="72" r="2.4" fill="${c.light}" opacity=".6"/>
        <path d="M46 90q14 7 28 0" stroke="${c.deep}" stroke-width="1.3" fill="none" opacity=".35" stroke-linecap="round"/>`;
    case 'sheep':
      return `
        <g fill="${c.light}" stroke="${c.deep}" stroke-width="1">
          <circle cx="38" cy="34" r="12"/><circle cx="52" cy="27" r="13"/><circle cx="68" cy="27" r="13"/><circle cx="82" cy="34" r="12"/>
          <circle cx="30" cy="46" r="9"/><circle cx="90" cy="46" r="9"/>
        </g>
        <ellipse cx="37" cy="48" rx="11" ry="5.5" fill="${c.body}" stroke="${c.deep}" stroke-width="1" transform="rotate(18 37 48)"/>
        <ellipse cx="83" cy="48" rx="11" ry="5.5" fill="${c.body}" stroke="${c.deep}" stroke-width="1" transform="rotate(-18 83 48)"/>
        <ellipse cx="60" cy="78" rx="15" ry="10" fill="${c.body}" stroke="${c.deep}" stroke-width=".9" opacity=".9"/>
        <path d="M56 76v2M64 76v2M58 82q2 2 4 0" stroke="${c.deep}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M73 31c4-4 8-3 9 1" stroke="${c.accent}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <circle cx="84" cy="33" r="3.4" fill="${c.accent}"/>
        <path d="M28 74c2-5 6-8 11-9M92 74c-2-5-6-8-11-9" stroke="${c.light}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`;
    case 'bull':
      return `
        <path d="M35 40C21 33 12 21 15 11c8 0 17 9 24 22" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M85 40c14-7 23-19 20-29-8 0-17 9-24 22" fill="${c.light}" stroke="${c.deep}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M31 39c-6-6-9-12-8-18M89 39c6-6 9-12 8-18" stroke="${c.accent}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".65"/>
        <ellipse cx="60" cy="80" rx="18" ry="12" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/>
        <ellipse cx="51" cy="78" rx="2.6" ry="2" fill="${c.deep}"/><ellipse cx="69" cy="78" rx="2.6" ry="2" fill="${c.deep}"/>
        <path d="M49 85q11 8 22 0" stroke="${c.deep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="94" r="5.2" fill="none" stroke="#ffd166" stroke-width="2"/>
        <path d="M60 90v-4" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M29 70c-3 7-2 14 2 19M91 70c3 7 2 14-2 19" stroke="${c.deep}" stroke-width="2.2" fill="none" opacity=".35" stroke-linecap="round"/>`;
    case 'bossbaby':
      return `
        <path d="M37 30c5-12 20-17 32-13 9 3 14 10 13 15-2 6-7 5-12 2-10-5-22-3-29 2-5 3-7-1-4-6Z" fill="${c.deep}" opacity=".9"/>
        <path d="M42 47c-3 2-4 6-3 9M78 47c3 2 4 6 3 9" stroke="${c.deep}" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/>
        <path d="M43 78l17 10 17-10 7 25H36Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M52 79l8-4 8 4-8 7Z" fill="${c.light}"/>
        <path d="M60 86l5 6-5 12-5-12Z" fill="${c.accent}"/>
        <path d="M45 94h7M68 94h7" stroke="${c.light}" stroke-width="1.3" opacity=".45" stroke-linecap="round"/>
        <rect x="86" y="82" width="18" height="13" rx="3" fill="#7a5a3a" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M95 82v-3a3 3 0 0 1 3-1" stroke="#ffd166" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M55 34c2-2 5-2 7 0" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`;
    case 'hero6':
      return `
        <path d="M37 39c9-10 37-10 46 0 4 4 2 9-2 7-13-5-29-5-42 0-4 2-6-3-2-7Z" fill="${c.deep}"/>
        <path d="M35 38l-11-8 4 12ZM85 38l11-8-4 12Z" fill="${c.deep}"/>
        <path d="M87 74c11 6 13 20 9 28h-9Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M33 74c-11 6-13 20-9 28h9Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
        <path d="M47 82l13 7 13-7 4 19H43Z" fill="${c.accent}" opacity=".92" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M60 88v12M53 95h14" stroke="${c.deep}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <path d="M60 84l-2 5h4Z" fill="${c.light}"/>
        <path d="M29 60c-5 10-4 19 1 26M91 60c5 10 4 19-1 26" stroke="${c.light}" stroke-width="2.2" fill="none" opacity=".5" stroke-linecap="round"/>`;
    case 'dolphin':
      return `
        <path d="M52 33c0-12 6-20 14-23-1 10-4 18-9 24Z" fill="${c.deep}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M88 84c8-8 15-9 20-4-4 4-7 9-7 15-5-4-9-4-14-1Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M90 76c8-2 12 2 12 8-4 1-8-1-11-4" fill="${c.accent}" opacity=".8" stroke="${c.deep}" stroke-width=".9"/>
        <ellipse cx="60" cy="86" rx="22" ry="12" fill="${c.light}" opacity=".75"/>
        <path d="M86 64c9-2 15 2 17 8-6 4-13 4-19 0Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M90 67c6 0 9 2 10 5" stroke="${c.deep}" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"/>
        <path d="M56 30c-2-8 0-15 4-20M62 28c0-7 3-12 7-15" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="61" cy="7" r="1.8" fill="${c.light}"/><circle cx="70" cy="11" r="1.4" fill="${c.light}"/>
        <path d="M30 86q30 11 60 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".5"/>
        <path d="M34 52c-5 3-7 7-7 12" stroke="${c.accent}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`;
    default:
      return '';
  }
}

function elementFeature(sprite, c) {
  const el = sprite.element;
  const signature = signatureFeature(el, c);
  if (signature) return signature;
  if (el === 'ember') {
    return `
      <path d="M60 27c7-11 15-7 11 3 5-3 8 4 1 9-5 4-14 4-18-1-3-5 2-9 6-11Z" fill="${c.accent}"/>
      <path d="M61 30c3-5 7-3 5 2 3-1 3 3 0 5-2 2-6 2-8 0-1-3 1-5 3-7Z" fill="${c.light}"/>
      <circle cx="35" cy="38" r="2.4" fill="${c.accent}" opacity=".8"/>
      <circle cx="88" cy="45" r="2" fill="${c.light}" opacity=".85"/>`;
  }
  if (el === 'tide') {
    return `
      <path d="M60 30c-2-12 8-19 15-17-1 8-4 14-9 18Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2" opacity=".95"/>
      <path d="M62 29c0-6 4-10 8-11" stroke="${c.deep}" stroke-width="1.4" fill="none" opacity=".5"/>
      <circle cx="91" cy="43" r="3.4" fill="none" stroke="${c.light}" stroke-width="1.6" opacity=".8"/>
      <circle cx="97" cy="34" r="2.1" fill="none" stroke="${c.light}" stroke-width="1.4" opacity=".65"/>
      <circle cx="30" cy="49" r="1.8" fill="${c.light}" opacity=".7"/>`;
  }
  if (el === 'gale') {
    return `
      <path d="M45 27c-2-8 6-12 11-8 3-6 12-4 12 3 6-1 8 6 3 9H47c-4 0-5-2-2-4Z" fill="${c.light}" opacity=".95"/>
      <path d="M42 41c-6 1-9 6-6 9" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M90 50c4 0 6 3 5 5" stroke="${c.light}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>`;
  }
  if (el === 'bloom') {
    return `
      <path d="M60 29c0-8 0-12 1-16" stroke="${c.deep}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M61 17c-7-6-14-2-12 4 2 4 8 5 12 2Z" fill="${c.accent}"/>
      <path d="M61 21c6-6 13-3 12 3-1 4-8 6-12 2Z" fill="${c.light}"/>
      <circle cx="61" cy="16" r="2.6" fill="#ffe066"/>`;
  }
  if (el === 'volt') {
    return `
      <path d="M60 30l-3-10 7 3-2-10" stroke="${c.deep}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="61" cy="9" r="4" fill="${c.accent}"/>
      <circle cx="61" cy="9" r="2" fill="${c.light}"/>
      <path d="M89 42l-4 7h4l-3 7" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (el === 'frost') {
    return `
      <path d="M60 27l-8-12 6-1 4 8 4-8 6 1z" fill="${c.light}" stroke="${c.accent}" stroke-width="1.2"/>
      <path d="M41 33l-5-9 5-1 3 8z" fill="${c.light}" stroke="${c.accent}" stroke-width="1"/>
      <path d="M79 33l5-9-5-1-3 8z" fill="${c.light}" stroke="${c.accent}" stroke-width="1"/>
      <path d="M91 55v6M88 58h6" stroke="${c.light}" stroke-width="1.4" opacity=".8"/>`;
  }
  if (el === 'dusk') {
    return `
      <path d="M47 30c-4-6-2-11 3-13 2 4 3 8 1 13Z" fill="${c.deep}"/>
      <path d="M85 24a9 9 0 1 0 6 16 8 8 0 1 1-6-16Z" fill="${c.light}" opacity=".9"/>
      <circle cx="35" cy="42" r="1.7" fill="${c.accent}"/>
      <circle cx="95" cy="46" r="1.4" fill="${c.light}"/>`;
  }
  if (el === 'radiant') {
    return `
      <ellipse cx="60" cy="17" rx="15" ry="4.4" fill="none" stroke="${c.accent}" stroke-width="2.4" opacity=".9"/>
      <path d="M60 7l1.6 4.2L66 13l-4.4 1.8L60 19l-1.6-4.2L54 13l4.4-1.8z" fill="${c.light}"/>
      <path d="M92 38l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="${c.light}" opacity=".85"/>`;
  }
  if (el === 'demon') {
    return `
      <path d="M44 31c-6-9-6-16-1-19 5 2 8 9 7 17Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.1"/>
      <path d="M76 31c6-9 6-16 1-19-5 2-8 9-7 17Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.1"/>
      <path d="M92 84c10 2 14 10 10 18-3 6-10 5-11-1" stroke="${c.deep}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M92 84l8-3-4 9Z" fill="${c.accent}"/>`;
  }
  if (el === 'angel') {
    return `
      <ellipse cx="60" cy="14" rx="15" ry="4" fill="none" stroke="${c.accent}" stroke-width="2.6"/>
      <path d="M31 52c-12-9-19 0-14 8 4 7 11 5 15 0Z" fill="${c.light}" stroke="${c.accent}" stroke-width="1"/>
      <path d="M89 52c12-9 19 0 14 8-4 7-11 5-15 0Z" fill="${c.light}" stroke="${c.accent}" stroke-width="1"/>
      <circle cx="60" cy="7" r="2" fill="${c.accent}"/>`;
  }
  if (el === 'air') {
    return `
      <g stroke="${c.deep}" fill="none" stroke-linecap="round" opacity=".75">
        <path d="M41 24c-7-5-4-13 3-13 6 0 8 6 5 10" stroke-width="2.2"/>
        <path d="M78 21c8-4 14 1 11 7-2 4-8 4-11 1" stroke-width="2"/>
        <path d="M93 45c5 0 7 4 4 7M25 62c-5 0-7 4-4 7" stroke-width="1.6" opacity=".6"/>
      </g>`;
  }
  if (el === 'water') {
    return `
      <path d="M60 24c-6-8-9-12-9-16 0-4 4-7 9-7s9 3 9 7c0 4-3 8-9 16Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2" opacity=".95"/>
      <circle cx="30" cy="50" r="6" fill="none" stroke="${c.light}" stroke-width="1.6" opacity=".6"/>
      <circle cx="92" cy="74" r="4" fill="none" stroke="${c.light}" stroke-width="1.4" opacity=".5"/>`;
  }
  if (el === 'earth') {
    return `
      <circle cx="60" cy="14" r="11" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M52 10c3-3 7-2 9 2 2 3 6 2 8 5-3 3-7 1-9 4-3 3-8 2-10-1-2-3 0-7 2-10Z" fill="${c.body}" opacity=".9"/>
      <circle cx="91" cy="54" r="3" fill="${c.accent}" opacity=".8"/>
      <circle cx="28" cy="76" r="2.4" fill="${c.deep}" opacity=".45"/>`;
  }
  if (el === 'honey') {
    return `
      <path d="M60 5l7 5v9l-7 5-7-5v-9Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M60 11l3.4 2.4v5L60 21l-3.4-2.6v-5Z" fill="${c.light}" opacity=".8"/>
      <path d="M89 37c3 5 3 9 0 13-3-4-3-8 0-13Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="30" cy="60" r="2" fill="${c.accent}" opacity=".7"/>`;
  }
  if (el === 'pond') {
    return `
      <ellipse cx="44" cy="23" rx="13" ry="5" fill="${c.accent}" stroke="${c.deep}" stroke-width="1" transform="rotate(-8 44 23)"/>
      <path d="M37 23h14" stroke="${c.light}" stroke-width="1.2" opacity=".7"/>
      <path d="M68 17c0 6-4 11-9 13 8 1 14-4 15-10-2-1-4-2-6-3Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="92" cy="66" r="5" fill="none" stroke="${c.light}" stroke-width="1.4" opacity=".65"/>
      <circle cx="92" cy="66" r="9" fill="none" stroke="${c.light}" stroke-width="1" opacity=".35"/>`;
  }
  if (el === 'hero') {
    return `
      <path d="M60 73l2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M29 40l-7 3M30 50l-7 2M91 40l7 3M90 50l7 2" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".85"/>`;
  }
  if (el === 'ants') {
    return `
      <path d="M47 27c-3-9-7-13-11-14M73 27c3-9 7-13 11-14" stroke="${c.deep}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <circle cx="35" cy="12" r="2.6" fill="${c.accent}"/><circle cx="85" cy="12" r="2.6" fill="${c.accent}"/>
      <g fill="${c.deep}" opacity=".8">
        <circle cx="18" cy="106" r="2.4"/><circle cx="23" cy="107" r="1.8"/><circle cx="27" cy="107" r="1.3"/>
        <path d="M18 104l-3-3M18 108l-3 3M24 105l2-3M24 109l2 3" stroke="${c.deep}" stroke-width="1"/>
        <circle cx="96" cy="103" r="2"/><circle cx="101" cy="104" r="1.5"/>
        <path d="M96 102l2-3M96 104l-3 2" stroke="${c.deep}" stroke-width="1"/>
      </g>`;
  }
  if (el === 'fire') {
    return `
      <path d="M60 29c-3-9 2-15 6-19 1 7 6 8 8 4 4 7 2 13-2 16-3 2-9 2-12-1Z" fill="${c.accent}" opacity=".95"/>
      <path d="M61 28c-1-5 2-9 4-11 1 4 4 5 5 2 2 4 0 8-2 10-2 1-6 1-7-1Z" fill="${c.light}"/>
      <circle cx="29" cy="54" r="2.2" fill="${c.accent}" opacity=".8"/>
      <circle cx="93" cy="42" r="1.8" fill="${c.light}" opacity=".8"/>`;
  }
  if (el === 'splash') {
    return `
      <path d="M44 23c-3-7 0-12 4-14 1 5 4 6 6 3 2 5 1 9-2 11-2 2-6 2-8 0Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M76 19c-2-6 0-10 3-11 1 4 3 4 4 2 2 4 0 7-2 9-1 1-4 1-5 0Z" fill="${c.accent}" opacity=".9"/>
      <path d="M24 86q18-10 36 0t36 0" stroke="${c.light}" stroke-width="2.4" fill="none" opacity=".8" stroke-linecap="round"/>
      <circle cx="92" cy="58" r="2.2" fill="${c.light}" opacity=".8"/>`;
  }
  if (el === 'slime') {
    return `
      <path d="M90 77c5 2 8 6 6 12-3-1-5-3-6-6" fill="${c.accent}" opacity=".8"/>
      <path d="M30 81c-4 4-4 11-1 16 4-3 5-7 4-11" fill="${c.accent}" opacity=".7"/>
      <circle cx="95" cy="44" r="3" fill="${c.light}" opacity=".65"/>
      <circle cx="26" cy="56" r="2.4" fill="${c.light}" opacity=".6"/>
      <circle cx="60" cy="16" r="2" fill="${c.light}" opacity=".8"/>`;
  }
  if (el === 'rock') {
    return `
      <path d="M44 31l6-13 9 5 6-9 7 9 8-4 5 12Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M33 46l-7 6 3 8 7-4Z" fill="${c.deep}" opacity=".75"/>
      <path d="M94 63l8 3-2 8-7-3Z" fill="${c.deep}" opacity=".7"/>`;
  }
  if (el === 'stone') {
    return `
      <path d="M42 29h36v12H42Z" fill="${c.accent}" opacity=".5" stroke="${c.deep}" stroke-width="1"/>
      <path d="M57 29v12M72 29v12M42 35h36" stroke="${c.deep}" stroke-width="1" opacity=".65"/>
      <path d="M60 45l-4 7 4 4M60 13l3 6-3 3" stroke="${c.accent}" stroke-width="1.6" fill="none" opacity=".8"/>
      <circle cx="90" cy="72" r="2.2" fill="${c.accent}" opacity=".6"/>`;
  }
  if (el === 'bug') {
    return `
      <path d="M51 26c-4-8-8-12-13-13M69 26c4-8 8-12 13-13" stroke="${c.deep}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <circle cx="37" cy="12" r="2.2" fill="${c.accent}"/><circle cx="83" cy="12" r="2.2" fill="${c.accent}"/>
      <ellipse cx="31" cy="66" rx="8" ry="12" fill="${c.accent}" opacity=".35" transform="rotate(-18 31 66)"/>
      <ellipse cx="89" cy="66" rx="8" ry="12" fill="${c.accent}" opacity=".35" transform="rotate(18 89 66)"/>
      <circle cx="60" cy="21" r="2" fill="${c.accent}"/>`;
  }
  if (el === 'bunny') {
    return `
      <path d="M44 32c-5-12-7-23-3-28 5 2 9 11 11 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M76 32c5-12 7-23 3-28-5 2-9 11-11 22Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M45 27c-3-8-4-15-2-18 3 2 5 8 6 15Z" fill="${c.accent}" opacity=".7"/>
      <path d="M75 27c3-8 4-15 2-18-3 2-5 8-6 15Z" fill="${c.accent}" opacity=".7"/>
      <circle cx="96" cy="82" r="6" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/>`;
  }
  if (el === 'cloud') {
    return `
      <path d="M36 25c-6 0-9-5-6-10 3-4 8-2 9 1 1-6 8-8 11-3 3-3 8-1 8 4 4-1 7 3 4 7-2 3-6 3-8 2H38Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1" opacity=".95"/>
      <path d="M47 32l-2 6M57 33l-2 7M67 32l-2 6" stroke="${c.accent}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
      <circle cx="94" cy="56" r="4" fill="${c.light}" opacity=".6"/>`;
  }
  if (el === 'crystal') {
    return `
      <path d="M60 4l7 12-7 14-7-14Z" fill="${c.light}" stroke="${c.accent}" stroke-width="1.1"/>
      <path d="M44 16l4 8-4 11-5-11Z" fill="${c.light}" opacity=".85" stroke="${c.accent}" stroke-width=".9"/>
      <path d="M76 16l5 8-5 11-4-11Z" fill="${c.light}" opacity=".85" stroke="${c.accent}" stroke-width=".9"/>
      <circle cx="61" cy="14" r="1.4" fill="#ffffff"/>
      <path d="M93 62l1.4 3.6L98 67l-3.6 1.4L93 72l-1.4-3.6L88 67l3.6-1.4Z" fill="${c.accent}" opacity=".8"/>`;
  }
  if (el === 'mushroom') {
    return `
      <path d="M42 22c0-8 8-14 18-14s18 6 18 14c0 3-4 4-8 3-3 2-7 2-10 0-4 2-8 1-11-1-3 1-7 0-7-2Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.3"/>
      <circle cx="51" cy="15" r="2.6" fill="${c.light}" opacity=".85"/>
      <circle cx="67" cy="12" r="2" fill="${c.light}" opacity=".8"/>
      <circle cx="72" cy="19" r="1.7" fill="${c.light}" opacity=".7"/>
      <circle cx="94" cy="48" r="1.6" fill="${c.accent}"/>
      <circle cx="26" cy="66" r="1.4" fill="${c.accent}"/>`;
  }
  if (el === 'candy') {
    return `
      <path d="M35 18l-9-6v17l9-5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M85 18l9-6v17l-9-5Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <rect x="35" y="10" width="50" height="17" rx="8.5" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M50 10c-6 8-6 12 0 17M70 10c6 8 6 12 0 17" stroke="${c.accent}" stroke-width="2" fill="none" opacity=".8"/>
      <circle cx="94" cy="72" r="1.8" fill="${c.accent}"/><circle cx="27" cy="50" r="1.5" fill="${c.accent}"/>`;
  }
  if (el === 'wolf') {
    return `
      <path d="M37 30L39 4l16 14Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1.2"/>
      <path d="M83 30L81 4 65 18Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1.2"/>
      <path d="M41 24l1-11 8 7Z" fill="${c.light}" opacity=".75"/>
      <path d="M79 24l-1-11-8 7Z" fill="${c.light}" opacity=".75"/>
      <ellipse cx="60" cy="79" rx="14" ry="10" fill="${c.light}" opacity=".9"/>
      <path d="M55 72h10l-5 5Z" fill="${c.deep}"/>
      <path d="M60 77v3M56 82q4 3 8 0" stroke="${c.deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M54 86l2 4 2-4M66 86l-2 4-2-4" fill="#ffffff" stroke="${c.light}" stroke-width=".5"/>
      <path d="M94 86c6 2 7 8 4 12-3-2-4-5-4-8" fill="${c.deep}" opacity=".8"/>`;
  }
  if (el === 'tiger') {
    return `
      <circle cx="38" cy="27" r="9" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="82" cy="27" r="9" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="38" cy="27" r="4.5" fill="${c.accent}" opacity=".45"/>
      <circle cx="82" cy="27" r="4.5" fill="${c.accent}" opacity=".45"/>
      <path d="M52 37l-3 7M60 35v8M68 37l3 7" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>
      <path d="M30 68l-7 3M32 74l-7 1M90 68l7 3M88 74l7 1" stroke="${c.accent}" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="60" cy="79" rx="12" ry="9" fill="${c.light}" opacity=".85"/>
      <path d="M56 74h8l-4 4Z" fill="${c.deep}"/>
      <path d="M60 78v3M56 82q4 3 8 0" stroke="${c.deep}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  }
  if (el === 'bear') {
    return `
      <circle cx="38" cy="24" r="9" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="82" cy="24" r="9" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="38" cy="24" r="4.6" fill="${c.light}" opacity=".8"/>
      <circle cx="82" cy="24" r="4.6" fill="${c.light}" opacity=".8"/>
      <ellipse cx="60" cy="78" rx="15" ry="11" fill="${c.light}" opacity=".9"/>
      <ellipse cx="60" cy="72" rx="4.5" ry="3.4" fill="${c.deep}"/>
      <path d="M60 76v3M56 81q4 3 8 0" stroke="${c.deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  }
  if (el === 'frog') {
    return `
      <path d="M51 38q-4-9 3-10M69 38q4-9-3-10" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>
      <circle cx="53" cy="65" r="1.2" fill="${c.deep}"/><circle cx="67" cy="65" r="1.2" fill="${c.deep}"/>
      <path d="M64 81q13 4 19-3" stroke="${c.accent}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <g transform="translate(86 34)">
        <ellipse cx="0" cy="0" rx="3.2" ry="2.2" fill="${c.deep}"/>
        <path d="M-2 -2l-2-3M2 -2l2-3" stroke="${c.deep}" stroke-width=".9"/>
        <path d="M4 -5q4-3 6 0" stroke="${c.deep}" stroke-width=".7" fill="none" opacity=".5"/>
      </g>`;
  }
  if (el === 'pig') {
    return `
      <path d="M38 30c-8 4-9 12-4 16 4 3 9-1 10-7" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M82 30c8 4 9 12 4 16-4 3-9-1-10-7" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <ellipse cx="60" cy="77" rx="13" ry="9.5" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      <ellipse cx="60" cy="77" rx="13" ry="9.5" fill="${c.deep}" opacity=".16"/>
      <circle cx="55" cy="76" r="1.8" fill="${c.deep}"/><circle cx="65" cy="76" r="1.8" fill="${c.deep}"/>
      <path d="M95 84c5 1 5 6 1 7-2 0-3-2-1-3" stroke="${c.deep}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (el === 'cat') {
    return `
      <path d="M39 31L36 7l19 12Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1.2"/>
      <path d="M81 31L84 7 65 19Z" fill="${c.deep}" stroke="${c.light}" stroke-width="1.2"/>
      <path d="M42 26l-1-11 8 6Z" fill="${c.accent}" opacity=".7"/>
      <path d="M78 26l1-11-8 6Z" fill="${c.accent}" opacity=".7"/>
      <ellipse cx="60" cy="79" rx="11" ry="8" fill="${c.light}" opacity=".9"/>
      <path d="M57 76h6l-3 3Z" fill="${c.deep}"/>
      <path d="M30 74l-9 2M30 80l-9 1M90 74l9 2M90 80l9 1" stroke="${c.deep}" stroke-width="1.2" opacity=".7" stroke-linecap="round"/>`;
  }
  if (el === 'cow') {
    return `
      <path d="M45 26c-5-7-3-12 2-12 3 3 3 7 2 11Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M75 26c5-7 3-12-2-12-3 3-3 7-2 11Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <ellipse cx="40" cy="44" rx="9" ry="7" fill="${c.deep}" opacity=".55"/>
      <ellipse cx="82" cy="55" rx="7" ry="6" fill="${c.deep}" opacity=".5"/>
      <ellipse cx="60" cy="78" rx="11" ry="8" fill="${c.accent}" opacity=".85"/>
      <circle cx="56" cy="77" r="1.4" fill="${c.deep}"/><circle cx="64" cy="77" r="1.4" fill="${c.deep}"/>
      <path d="M54 92h12l-2 5H56Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="60" cy="96" r="1.4" fill="${c.deep}"/>`;
  }
  if (el === 'fish') {
    return `
      <path d="M60 26c-2-10 4-16 10-18-1 8-4 14-9 18Z" fill="${c.accent}" opacity=".9" stroke="${c.deep}" stroke-width="1"/>
      <path d="M32 62c-10-6-14 2-9 9 4 5 9 2 12-3Z" fill="${c.light}" opacity=".8"/>
      <path d="M88 62c10-6 14 2 9 9-4 5-9 2-12-3Z" fill="${c.light}" opacity=".8"/>
      <path d="M91 76c9 1 14 7 13 14-7-1-11-6-13-10Z" fill="${c.accent}" opacity=".85" stroke="${c.deep}" stroke-width=".9"/>
      <circle cx="93" cy="42" r="3.4" fill="none" stroke="${c.light}" stroke-width="1.2" opacity=".75"/>
      <circle cx="99" cy="31" r="2.2" fill="none" stroke="${c.light}" stroke-width="1" opacity=".6"/>
      <circle cx="42" cy="46" r="1.6" fill="${c.light}" opacity=".7"/><circle cx="52" cy="86" r="1.4" fill="${c.light}" opacity=".6"/>`;
  }
  if (el === 'bat') {
    return `
      <path d="M32 60C16 44 8 46 6 56c10-2 14 6 12 14 6-6 12-6 16-2Z" fill="${c.light}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M88 60c16-16 24-14 26-4-10-2-14 6-12 14-6-6-12-6-16-2Z" fill="${c.light}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M46 30l-4-14 12 8Z" fill="${c.deep}"/>
      <path d="M74 30l4-14-12 8Z" fill="${c.deep}"/>
      <path d="M55 85l2 5 2-5M65 85l-2 5-2-5" fill="#ffffff" stroke="${c.light}" stroke-width=".5"/>`;
  }
  if (el === 'butterfly') {
    return `
      <path d="M32 56c-14-14-24-8-22 2 2 9 13 12 22 9 4-1 5-7 0-11Z" fill="${c.light}" opacity=".75" stroke="${c.deep}" stroke-width="1"/>
      <path d="M88 56c14-14 24-8 22 2-2 9-13 12-22 9-4-1-5-7 0-11Z" fill="${c.light}" opacity=".75" stroke="${c.deep}" stroke-width="1"/>
      <ellipse cx="30" cy="82" rx="10" ry="11" fill="${c.light}" opacity=".6" stroke="${c.deep}" stroke-width=".8" transform="rotate(-16 30 82)"/>
      <ellipse cx="90" cy="82" rx="10" ry="11" fill="${c.light}" opacity=".6" stroke="${c.deep}" stroke-width=".8" transform="rotate(16 90 82)"/>
      <circle cx="22" cy="58" r="3" fill="${c.accent}" opacity=".7"/><circle cx="98" cy="58" r="3" fill="${c.accent}" opacity=".7"/>
      <circle cx="30" cy="82" r="2.2" fill="${c.accent}" opacity=".7"/><circle cx="90" cy="82" r="2.2" fill="${c.accent}" opacity=".7"/>
      <path d="M52 28c-4-8-8-11-12-12M68 28c4-8 8-11 12-12" stroke="${c.deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <circle cx="39" cy="15" r="1.8" fill="${c.accent}"/><circle cx="81" cy="15" r="1.8" fill="${c.accent}"/>`;
  }
  if (el === 'pillow') {
    return `
      <path d="M26 42l-6-6M94 42l6-6M26 86l-6 6M94 86l6 6" stroke="${c.deep}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>
      <path d="M88 28h3v3M84 34h3v3M80 40h3v3" stroke="${c.accent}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <path d="M35 96q10 5 20 1" stroke="${c.light}" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M28 52q32-8 64 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".6"/>`;
  }
  if (el === 'dreameater') {
    return `
      <path d="M75 16a8 8 0 1 0 5 14 7 7 0 1 1-5-14Z" fill="${c.accent}" opacity=".9"/>
      <circle cx="34" cy="30" r="1.8" fill="${c.light}"/><circle cx="44" cy="18" r="1.2" fill="${c.light}"/>
      <path d="M97 54l1.4 3.6L102 59l-3.6 1.4L97 64l-1.4-3.6L92 59l3.6-1.4Z" fill="${c.light}" opacity=".8"/>
      <path d="M32 80c-7 6-9 16-4 20 3 2 6-1 5-5-1-4 1-8 4-10" fill="${c.accent}" opacity=".35"/>
      <path d="M88 80c7 6 9 16 4 20-3 2-6-1-5-5 1-4-1-8-4-10" fill="${c.accent}" opacity=".3"/>`;
  }
  if (el === 'lucky') {
    return `
      <g transform="translate(60 16)">
        <circle cx="-5" cy="-3" r="5.4" fill="${c.accent}"/><circle cx="5" cy="-3" r="5.4" fill="${c.accent}"/>
        <circle cx="-5" cy="6" r="5.4" fill="${c.accent}"/><circle cx="5" cy="6" r="5.4" fill="${c.accent}"/>
        <circle cx="0" cy="1.5" r="2" fill="${c.light}"/>
        <path d="M0 8v8" stroke="${c.deep}" stroke-width="2" stroke-linecap="round"/>
      </g>
      <path d="M88 44l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="${c.light}"/>
      <circle cx="31" cy="56" r="2.2" fill="${c.accent}"/>`;
  }
  if (el === 'banana') {
    return `
      <path d="M60 25c0-7 4-11 9-12-1 5-4 9-7 12" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M58 26c-3-5-2-10 2-12" stroke="${c.deep}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M29 90c-4 6-2 11 3 11 2-4 2-8 1-11M91 90c4 6 2 11-3 11-2-4-2-8-1-11" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M36 99c4 3 8 4 12 4M84 99c-4 3-8 4-12 4" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".7"/>`;
  }
  if (el === 'apple') {
    return `
      <path d="M60 25c0-6 1-9 3-12" stroke="${c.deep}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M64 16c5-6 12-4 12 2-4 4-9 4-12 0Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M86 70a10 10 0 1 0 0 20 12 12 0 0 1 0-20Z" fill="${c.light}" opacity=".8"/>
      <circle cx="34" cy="46" r="3" fill="${c.light}" opacity=".4"/>`;
  }
  if (el === 'ice') {
    return `
      <path d="M39 30l4-16 5 16M55 27l4-13 5 13M71 29l4-15 5 15" fill="${c.light}" stroke="${c.accent}" stroke-width="1"/>
      <path d="M32 68l8 7-8 7M88 62l-8 7 8 7" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".7"/>
      <path d="M44 90l4 11M58 93l3 10M74 90l-4 11" stroke="${c.light}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <circle cx="93" cy="42" r="2" fill="${c.light}" opacity=".8"/>`;
  }
  if (el === 'cherry') {
    return `
      <path d="M52 28c-2-9 4-15 12-17M68 28c2-9-4-15-12-17" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="47" cy="19" r="7" fill="${c.deep}" stroke="${c.light}" stroke-width="1"/>
      <circle cx="73" cy="16" r="6" fill="${c.deep}" stroke="${c.light}" stroke-width="1"/>
      <path d="M66 8c4-5 10-4 12 1-4 3-9 3-12-1Z" fill="${c.accent}" stroke="${c.deep}" stroke-width=".8"/>
      <circle cx="45" cy="17" r="2" fill="${c.light}" opacity=".8"/>`;
  }
  if (el === 'cocoa') {
    return `
      <path d="M43 22c-4-6 4-9 0-15M60 19c-4-6 4-9 0-15M77 22c-4-6 4-9 0-15" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".65"/>
      <rect x="44" y="22" width="12" height="9" rx="3" fill="${c.accent}" stroke="${c.deep}" stroke-width=".8"/>
      <rect x="62" y="20" width="10" height="8" rx="3" fill="#ffffff" stroke="${c.deep}" stroke-width=".8"/>
      <path d="M93 62c8 0 10 7 4 11-2 2-5 1-7 0" stroke="${c.deep}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M40 90c3 4 7 6 12 6" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".5"/>`;
  }
  if (el === 'pizza') {
    return `
      <path d="M28 86c2 7 7 11 14 12" stroke="${c.deep}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".3"/>
      <circle cx="32" cy="50" r="5" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="88" cy="58" r="4.4" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="43" cy="90" r="4" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <circle cx="77" cy="92" r="3.6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M46 33c8-3 16-2 22 2" stroke="${c.light}" stroke-width="2" fill="none" opacity=".7"/>`;
  }
  return '';
}

function earMarkup(style, c) {
  if (!style || style === 'breed') return '';
  if (style === 'axolotl') {
    return `<g stroke="${c.deep}" stroke-width="1.1" fill="${c.accent}">
      <path d="M40 42c-9-2-13-7-12-12 5 1 8 4 10 8Z"/><path d="M38 50c-10 1-15-2-16-7 5-1 9 1 12 4Z"/><path d="M40 58c-8 3-13 1-15-3 4-2 8-1 11 1Z"/>
      <path d="M80 42c9-2 13-7 12-12-5 1-8 4-10 8Z"/><path d="M82 50c10 1 15-2 16-7-5-1-9 1-12 4Z"/><path d="M80 58c8 3 13 1 15-3-4-2-8-1-11 1Z"/>
    </g>`;
  }
  if (style === 'goat') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M41 44c-13 2-20 10-17 17 6 1 12-3 18-9Z" fill="${c.body}"/>
      <path d="M79 44c13 2 20 10 17 17-6 1-12-3-18-9Z" fill="${c.body}"/>
      <path d="M32 52c3 3 5 6 6 9M88 52c-3 3-5 6-6 9" stroke="${c.light}" stroke-width="1.5" fill="none" opacity=".7"/>
    </g>`;
  }
  if (style === 'seal') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <circle cx="42" cy="43" r="5" fill="${c.body}"/><circle cx="78" cy="43" r="5" fill="${c.body}"/>
      <circle cx="42" cy="43" r="2" fill="${c.light}" opacity=".7"/><circle cx="78" cy="43" r="2" fill="${c.light}" opacity=".7"/>
    </g>`;
  }
  if (style === 'tulip') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M43 40c-4-9-1-15 5-15 2 4 2 10 1 15Z" fill="${c.accent}"/>
      <path d="M50 39c-1-10 2-16 8-16 2 5 0 11-3 16Z" fill="${c.light}"/>
      <path d="M68 39c3-10 6-15 11-13-1 6-4 11-7 14Z" fill="${c.accent}"/>
    </g>`;
  }
  if (style === 'coral') {
    return `<g stroke="${c.deep}" stroke-width="1.1" fill="none" stroke-linecap="round">
      <path d="M42 42V25m0 6-7-8m7 12 7-9" stroke="${c.accent}" stroke-width="3"/>
      <path d="M78 42V25m0 6 7-8m-7 12-7-9" stroke="${c.accent}" stroke-width="3"/>
      <circle cx="35" cy="16" r="2.2" fill="${c.light}" stroke="none"/><circle cx="85" cy="16" r="2.2" fill="${c.light}" stroke="none"/>
    </g>`;
  }
  if (style === 'wing') {
    return `<g stroke="${c.deep}" stroke-width="1.1" opacity=".95">
      <path d="M42 44C29 38 21 41 19 50c6 5 14 5 23 1Z" fill="${c.light}"/>
      <path d="M78 44c13-6 21-3 23 6-6 5-14 5-23 1Z" fill="${c.light}"/>
      <path d="M28 43c4 1 7 3 9 6M92 43c-4 1-7 3-9 6" stroke="${c.accent}" stroke-width="1.4" fill="none"/>
    </g>`;
  }
  if (style === 'tuft') {
    return `<g stroke="${c.deep}" stroke-width="1.1" fill="${c.body}">
      <circle cx="42" cy="40" r="8"/><circle cx="31" cy="34" r="5.6"/><circle cx="51" cy="33" r="5"/>
      <circle cx="78" cy="40" r="8"/><circle cx="89" cy="34" r="5.6"/><circle cx="69" cy="33" r="5"/>
      <circle cx="36" cy="37" r="2.4" fill="${c.light}" stroke="none" opacity=".8"/>
      <circle cx="84" cy="37" r="2.4" fill="${c.light}" stroke="none" opacity=".8"/>
    </g>`;
  }
  if (style === 'petal') {
    const petals = [[60, 20], [43, 27], [77, 27], [37, 41], [83, 41]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="8.4" fill="${c.accent}" stroke="${c.deep}" stroke-width="1" transform="rotate(${x === 60 ? 0 : x < 60 ? -28 : 28} ${x} ${y})"/>`)
      .join('');
    return `<g>${petals}<circle cx="60" cy="33" r="5" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/></g>`;
  }
  const body = c.body;
  const deep = c.deep;
  const inner = c.light;
  if (style === 'pointy') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M41 42C35 30 33 22 37 19c5-3 11 6 13 18Z" fill="${body}"/>
      <path d="M79 42c6-12 8-20 4-23-5-3-11 6-13 18Z" fill="${body}"/>
      <path d="M39 36c-2-6-3-10-1-11 2-1 5 5 7 11Z" fill="${inner}" opacity=".75"/>
      <path d="M81 36c2-6 3-10 1-11-2-1-5 5-7 11Z" fill="${inner}" opacity=".75"/>
    </g>`;
  }
  if (style === 'tall') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M42 42C35 24 37 9 44 8c7-1 9 13 7 33Z" fill="${body}"/>
      <path d="M78 42c7-18 5-33-2-34-7-1-9 13-7 33Z" fill="${body}"/>
      <path d="M45 20c0 6 1 11 2 15" stroke="${inner}" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M75 20c0 6-1 11-2 15" stroke="${inner}" stroke-width="2" fill="none" opacity=".7"/>
    </g>`;
  }
  if (style === 'round') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <circle cx="40" cy="34" r="11" fill="${body}"/><circle cx="80" cy="34" r="11" fill="${body}"/>
      <circle cx="40" cy="34" r="5.5" fill="${inner}" opacity=".7"/><circle cx="80" cy="34" r="5.5" fill="${inner}" opacity=".7"/>
    </g>`;
  }
  if (style === 'floppy') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M40 38C24 34 18 44 21 55c3 10 12 11 19 4 5-6 5-14 0-21Z" fill="${body}"/>
      <path d="M80 38c16-4 22 6 19 17-3 10-12 11-19 4-5-6-5-14 0-21Z" fill="${body}"/>
      <path d="M31 45c-3 5-3 10-1 13M89 45c3 5 3 10 1 13" stroke="${inner}" stroke-width="1.6" fill="none" opacity=".6"/>
    </g>`;
  }
  if (style === 'fin') {
    return `<g stroke="${deep}" stroke-width="1.1" opacity=".95">
      <path d="M40 46C26 40 18 43 15 52c4 7 14 9 25 3Z" fill="${c.accent}"/>
      <path d="M80 46c14-6 22-3 25 6-4 7-14 9-25 3Z" fill="${c.accent}"/>
      <path d="M27 47c5 2 8 4 11 8M93 47c-5 2-8 4-11 8" stroke="${inner}" stroke-width="1.2" fill="none" opacity=".7"/>
    </g>`;
  }
  if (style === 'antenna') {
    return `<g stroke="${deep}" stroke-width="1.1" fill="none" stroke-linecap="round">
      <path d="M48 30C45 20 44 13 46 9" /><path d="M72 30c3-10 4-17 2-21" />
      <circle cx="46" cy="7" r="4.4" fill="${c.accent}"/><circle cx="74" cy="7" r="4.4" fill="${c.accent}"/>
      <circle cx="44.8" cy="5.6" r="1.4" fill="#ffffff" opacity=".8"/><circle cx="72.8" cy="5.6" r="1.4" fill="#ffffff" opacity=".8"/>
    </g>`;
  }
  if (style === 'curl') {
    return `<g stroke="${deep}" stroke-width="1.1" fill="none" stroke-linecap="round">
      <path d="M40 42c-10 2-15 10-11 17 3 5 11 4 12-2" fill="${body}"/>
      <path d="M80 42c10 2 15 10 11 17-3 5-11 4-12-2" fill="${body}"/>
    </g>`;
  }
  if (style === 'leaf') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M42 40c-11-4-17 4-12 12 4 6 11 3 13-4Z" fill="${c.accent}"/>
      <path d="M78 40c11-4 17 4 12 12-4 6-11 3-13-4Z" fill="${c.accent}"/>
      <path d="M33 48c3 1 6 3 8 5M87 48c-3 1-6 3-8 5" stroke="${inner}" stroke-width="1.4" fill="none" opacity=".8"/>
    </g>`;
  }
  if (style === 'spike') {
    return `<g stroke="${deep}" stroke-width="1" fill="${body}">
      <path d="M42 40l-8-14 15 6Z"/><path d="M34 50l-11-8 11-2Z"/><path d="M46 46l-4-16 8 12Z"/>
      <path d="M78 40l8-14-15 6Z"/><path d="M86 50l11-8-11-2Z"/><path d="M74 46l4-16-8 12Z"/>
    </g>`;
  }
  if (style === 'shell') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M40 44c-12 0-18-8-14-14 4-5 12-2 14 6Z" fill="${body}"/>
      <path d="M80 44c12 0 18-8 14-14-4-5-12-2-14 6Z" fill="${body}"/>
      <path d="M30 36c4 0 7 2 9 5M90 36c-4 0-7 2-9 5" stroke="${inner}" stroke-width="1.4" fill="none" opacity=".75"/>
    </g>`;
  }
  if (style === 'pompom') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <circle cx="39" cy="34" r="10" fill="${c.light}"/>
      <circle cx="81" cy="34" r="10" fill="${c.light}"/>
      <circle cx="35" cy="30" r="4" fill="${body}" opacity=".7"/><circle cx="44" cy="38" r="3.4" fill="${body}" opacity=".7"/>
      <circle cx="85" cy="30" r="4" fill="${body}" opacity=".7"/><circle cx="76" cy="38" r="3.4" fill="${body}" opacity=".7"/>
    </g>`;
  }
  if (style === 'bunny') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M43 41C32 32 24 12 31 8c6-3 12 11 15 24Z" fill="${body}"/>
      <path d="M77 41c11-9 19-29 12-33-6-3-12 11-15 24Z" fill="${body}"/>
      <path d="M36 26c0 5 2 10 5 14M84 26c0 5-2 10-5 14" stroke="${inner}" stroke-width="2" fill="none" opacity=".75"/>
    </g>`;
  }
  if (style === 'deer') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M45 38c-5-8-6-16-2-20 2 2 4 7 5 12 2-6 5-10 8-12 0 7-2 14-5 20Z" fill="${c.accent}"/>
      <path d="M75 38c5-8 6-16 2-20-2 2-4 7-5 12-2-6-5-10-8-12 0 7 2 14 5 20Z" fill="${c.accent}"/>
      <circle cx="43" cy="18" r="2.2" fill="${inner}"/><circle cx="77" cy="18" r="2.2" fill="${inner}"/>
    </g>`;
  }
  if (style === 'horn') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M44 40c-4-10-2-18 3-21 3 3 3 11 1 20Z" fill="${inner}"/>
      <path d="M76 40c4-10 2-18-3-21-3 3-3 11-1 20Z" fill="${inner}"/>
      <path d="M48 24c-1 4-1 8 0 11M72 24c1 4 1 8 0 11" stroke="${body}" stroke-width="1.2" fill="none" opacity=".6"/>
    </g>`;
  }
  if (style === 'bat') {
    return `<g stroke="${deep}" stroke-width="1.1">
      <path d="M42 42C30 36 22 26 24 18c6 4 10 9 13 15 2-6 3-11 3-16 3 5 4 11 4 17Z" fill="${body}"/>
      <path d="M78 42c12-6 20-16 18-24-6 4-10 9-13 15-2-6-3-11-3-16-3 5-4 11-4 17Z" fill="${body}"/>
      <path d="M28 22c4 3 6 6 8 10M92 22c-4 3-6 6-8 10" stroke="${inner}" stroke-width="1.3" fill="none" opacity=".65"/>
    </g>`;
  }
  if (style === 'frill') {
    return `<g stroke="${deep}" stroke-width="1">
      <path d="M40 44c-9 2-15-2-15-8 0-5 6-8 11-5 2 1 3 4 3 6 0-6 4-10 9-9 4 1 6 5 5 10Z" fill="${c.accent}" opacity=".92"/>
      <path d="M80 44c9 2 15-2 15-8 0-5-6-8-11-5-2 1-3 4-3 6 0-6-4-10-9-9-4 1-6 5-5 10Z" fill="${c.accent}" opacity=".92"/>
      <path d="M30 32c3 2 5 4 6 7M90 32c-3 2-5 4-6 7" stroke="${inner}" stroke-width="1.2" fill="none" opacity=".7"/>
    </g>`;
  }
  if (style === 'gill') {
    return `<g stroke="${inner}" stroke-width="2" fill="none" opacity=".85" stroke-linecap="round">
      <path d="M36 40c-6 4-9 10-8 16M32 42c-5 5-7 11-5 17M42 46c-4 4-6 9-5 14"/>
      <path d="M84 40c6 4 9 10 8 16M88 42c5 5 7 11 5 17M78 46c4 4 6 9 5 14"/>
      <path d="M38 40c-2-5 0-9 3-11M82 40c2-5 0-9-3-11" stroke="${deep}" stroke-width="1.2"/>
    </g>`;
  }
  return '';
}

function breedMarkup(sprite, c) {
  const b = sprite.breed;
  if (b === 'frozenpuff') {
    return `
      <path d="M60 26l3 8 8-3-4 8 7 4-8 2 2 8-8-4-4 7-4-7-8 4 2-8-8-2 7-4-4-8 8 3Z" fill="${c.light}" opacity=".5"/>
      <path d="M32 44l7 5M88 44l-7 5M34 76l7-5M86 76l-7-5" stroke="${c.light}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>
      <path d="M60 30c-2-4 0-7 3-7s4 4 1 7" stroke="${c.accent}" stroke-width="1.6" fill="none" opacity=".8"/>`;
  }
  if (b === 'firedemonpuff') {
    return `
      <path d="M42 27c-4-7-1-12 4-12 4 1 5 6 4 10Z" fill="${c.deep}"/>
      <path d="M78 27c4-7 1-12-4-12-4 1-5 6-4 10Z" fill="${c.deep}"/>
      <path d="M32 82c-8 5-11 12-8 17 5 0 9-5 11-11Z" fill="${c.accent}" opacity=".8"/>
      <path d="M88 82c8 5 11 12 8 17-5 0-9-5-11-11Z" fill="${c.accent}" opacity=".8"/>
      <path d="M50 42l6 3M70 42l-6 3" stroke="${c.deep}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`;
  }
  if (b === 'frozenangelpuff') {
    return `
      <ellipse cx="60" cy="21" rx="19" ry="5" fill="none" stroke="${c.accent}" stroke-width="2.6" opacity=".9"/>
      <path d="M28 48c-11-8-18 0-13 9 4 6 11 4 14-2Z" fill="${c.light}" opacity=".85"/>
      <path d="M92 48c11-8 18 0 13 9-4 6-11 4-14-2Z" fill="${c.light}" opacity=".85"/>
      <path d="M44 30l3 5M76 30l-3 5M60 12l2 5M40 20l4 3M80 20l-4 3" stroke="${c.light}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
  }
  if (b === 'pufflet') {
    return `
      <path d="M60 26c-4-6-1-10 3-10 5 0 6 5 3 9" fill="${c.light}" opacity=".9"/>
      <circle cx="46" cy="72" r="3" fill="${c.light}" opacity=".55"/>
      <circle cx="74" cy="72" r="3" fill="${c.light}" opacity=".55"/>
      <path d="M34 58c3 3 7 4 10 2M86 58c-3 3-7 4-10 2" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".6"/>`;
  }
  if (b === 'mudpuff') {
    return `
      <path d="M60 27c0-7 4-11 8-11-1 5 2 7 4 10" fill="${c.accent}" opacity=".9"/>
      <path d="M64 24c4-3 8-2 10 1" stroke="${c.accent}" stroke-width="1.4" fill="none"/>
      <path d="M36 80c-2 6 0 9 3 11M84 80c2 6 0 9-3 11" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>
      <circle cx="48" cy="68" r="2.2" fill="${c.deep}" opacity=".35"/>
      <circle cx="70" cy="72" r="2.6" fill="${c.deep}" opacity=".35"/>`;
  }
  if (b === 'sparkpuff') {
    return `
      <path d="M60 26V16M60 16l-5-5M60 16l6-5" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="13" r="3.4" fill="${c.accent}"/>
      <path d="M90 52l8-4-4 8 7 1-9 6" stroke="${c.accent}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M30 52l-8-4 4 8-7 1 9 6" stroke="${c.accent}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"/>`;
  }
  if (b === 'sprig') {
    return `
      <path d="M33 47c-11-8-18 1-13 9 4 7 12 3 15-3Z" fill="${c.accent}" opacity=".9"/>
      <path d="M87 47c11-8 18 1 13 9-4 7-12 3-15-3Z" fill="${c.light}" opacity=".95"/>`;
  }
  if (b === 'flit') {
    return `
      <path d="M34 52c-14-13-24-4-18 8 5 9 14 8 20 2Z" fill="${c.light}" opacity=".75"/>
      <path d="M86 52c14-13 24-4 18 8-5 9-14 8-20 2Z" fill="${c.light}" opacity=".75"/>
      <path d="M23 57c4-3 8-2 10 1" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".5"/>
      <path d="M97 57c-4-3-8-2-10 1" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".5"/>`;
  }
  if (b === 'horn') {
    return `
      <path d="M43 33c-5-9-4-15 2-15 4 1 5 7 4 13Z" fill="${c.deep}"/>
      <path d="M77 33c5-9 4-15-2-15-4 1-5 7-4 13Z" fill="${c.deep}"/>`;
  }
  if (b === 'cp_puffle' || String(b || '').startsWith('cp_penguin_')) {
    return `
      <path d="M50 30c-3-6 0-11 5-10 4 1 4 6 1 9M61 29c-1-6 3-10 7-9 4 1 3 6 0 8M43 33c-4-4-4-9 0-10 4-1 5 3 4 7" fill="${c.light}" stroke="${c.deep}" stroke-width=".8" opacity=".9"/>
      <path d="M35 70c2 2 5 2 7 0M85 70c-2 2-5 2-7 0" stroke="${c.light}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".6"/>`;
  }
  if (b === 'puff') {
    return `<path d="M60 27c-3-5 1-9 6-8 4 1 4 6 1 8" stroke="${c.light}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (b === 'werewolfpuff') {
    return `
      <path d="M40 32c-6-10-4-16 2-15 5 1 7 7 7 13Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M80 32c6-10 4-16-2-15-5 1-7 7-7 13Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M44 30c-3-5-2-8 1-8 3 1 3 4 3 7Z" fill="${c.deep}" opacity=".55"/>
      <path d="M76 30c3-5 2-8-1-8-3 1-3 4-3 7Z" fill="${c.deep}" opacity=".55"/>
      <path d="M36 58c6-4 10-1 12 3M84 58c-6-4-10-1-12 3" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>`;
  }
  if (b === 'zombiepuff') {
    return `
      <path d="M70 44c8-1 12 4 11 9-1 5-6 8-11 7Z" fill="${c.light}" opacity=".45" stroke="${c.deep}" stroke-width="1"/>
      <path d="M72 48l2 2M72 53l4 1M74 58l2 2" stroke="${c.deep}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      <path d="M40 34c-4-6-2-10 2-10 3 0 4 4 4 8Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>`;
  }
  if (b === 'vampirepuff') {
    return `
      <path d="M30 60c6-6 14-9 30-9s24 3 30 9c2 3 1 7-2 8-18 6-38 6-56 0-3-1-4-5-2-8Z" fill="${c.deep}" opacity=".75"/>
      <path d="M36 62c8 4 16 6 24 6s16-2 24-6" stroke="${c.accent}" stroke-width="1.4" fill="none" opacity=".6"/>
      <path d="M52 84l3 6 3-6M62 84l3 6 3-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M60 26c-4-6-2-11 3-11 4 0 5 5 3 8" fill="${c.body}" stroke="${c.deep}" stroke-width="1"/>`;
  }
  if (b === 'demonpuff') {
    return `
      <path d="M42 28c-3-7 0-12 4-12 4 1 5 6 4 10Z" fill="${c.deep}"/>
      <path d="M78 28c3-7 0-12-4-12-4 1-5 6-4 10Z" fill="${c.deep}"/>
      <path d="M92 78c10 4 14 10 12 16-6 1-11-3-14-9Z" fill="${c.deep}" opacity=".85"/>
      <path d="M60 34c-3-4-1-8 3-8s6 4 3 8" stroke="${c.accent}" stroke-width="1.6" fill="none" opacity=".7"/>`;
  }
  if (b === 'angelpuff') {
    return `
      <ellipse cx="60" cy="18" rx="15" ry="4.5" fill="none" stroke="${c.accent}" stroke-width="3" opacity=".9"/>
      <path d="M24 62c-10-4-16-12-14-20 8 0 14 6 18 13Z" fill="${c.light}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M96 62c10-4 16-12 14-20-8 0-14 6-18 13Z" fill="${c.light}" opacity=".8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M44 88c5 3 11 3 16 0" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".6"/>`;
  }
  if (b === 'wisp') {
    return `
      <circle cx="52" cy="96" r="6" fill="${c.body}" opacity=".55"/>
      <circle cx="65" cy="102" r="4.5" fill="${c.body}" opacity=".38"/>
      <circle cx="59" cy="107" r="3" fill="${c.body}" opacity=".22"/>`;
  }
  if (b === 'bun') {
    return `
      <path d="M43 35C36 20 38 8 45 8c7 0 9 11 8 27Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M77 35c7-15 5-27-2-27-7 0-9 11-8 27Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M46 17c0 5 1 9 3 12" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M74 17c0 5-1 9-3 12" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }
  if (b === 'fin') {
    return `
      <path d="M33 63C20 54 12 56 10 65c-2 10 7 16 22 15Z" fill="${c.accent}" opacity=".9"/>
      <path d="M87 63c13-9 21-7 23 2 2 10-7 16-22 15Z" fill="${c.accent}" opacity=".9"/>
      <path d="M78 92c11 4 18 10 22 18-10 0-18-3-24-9Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>`;
  }
  if (b === 'shell') {
    return `
      <path d="M31 67c2-18 14-31 29-31s27 13 29 31c-8 9-18 13-29 13S39 76 31 67Z" fill="${c.light}" opacity=".24" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M43 53c5-7 11-11 17-11s12 4 17 11" stroke="${c.accent}" stroke-width="1.4" fill="none" opacity=".65"/>
      <path d="M38 71c7 5 14 7 22 7s15-2 22-7" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".45"/>`;
  }
  if (b === 'star') {
    return `
      <g fill="${c.light}" opacity=".85">
        <path d="M24 34l1.5 4 4 1.5-4 1.5L24 45l-1.5-4-4-1.5 4-1.5Z"/>
        <path d="M99 64l1.5 4 4 1.5-4 1.5L99 75l-1.5-4-4-1.5 4-1.5Z"/>
      </g>`;
  }
  if (b === 'orb') {
    return `
      <ellipse cx="60" cy="40" rx="16" ry="7" fill="${c.light}" opacity=".32"/>
      <path d="M52 88c5 3 11 3 16 0" stroke="${c.deep}" stroke-width="1" fill="none" opacity=".3"/>`;
  }
  if (b === 'lanky') {
    return `
      <path d="M42 36c-6-9-5-16 1-16 5 1 6 8 5 15Z" fill="${c.deep}" opacity=".85"/>
      <path d="M78 36c6-9 5-16-1-16-5 1-6 8-5 15Z" fill="${c.deep}" opacity=".85"/>
      <path d="M46 96c4 3 9 3 14 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".4"/>`;
  }
  if (b === 'chonk') {
    return `
      <path d="M23 58c-6 3-8 9-5 13 4 4 9 1 11-4Z" fill="${c.light}" opacity=".35"/>
      <path d="M97 58c6 3 8 9 5 13-4 4-9 1-11-4Z" fill="${c.light}" opacity=".35"/>
      <path d="M42 84c11 5 25 5 36 0" stroke="${c.deep}" stroke-width="1.1" fill="none" opacity=".22"/>`;
  }
  if (b === 'tuft') {
    return `
      <path d="M60 24c-4-7-1-12 4-11 4 1 5 6 2 9Z" fill="${c.light}"/>
      <path d="M50 25c-6-4-10-1-9 4 1 4 5 5 8 2Z" fill="${c.light}" opacity=".9"/>
      <path d="M70 25c6-4 10-1 9 4-1 4-5 5-8 2Z" fill="${c.light}" opacity=".9"/>`;
  }
  if (b === 'floof') {
    return `
      <path d="M60 24c-4-7 0-12 5-11 4 1 4 6 1 9" stroke="${c.light}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M30 55c-8-3-13 4-10 10 2 5 8 6 12 2" fill="${c.light}" opacity=".4"/>
      <path d="M90 55c8-3 13 4 10 10-2 5-8 6-12 2" fill="${c.light}" opacity=".4"/>
      <path d="M41 88c-2 5 1 8 5 8s6-3 6-7" fill="${c.light}" opacity=".32"/>
      <path d="M79 88c2 5-1 8-5 8s-6-3-6-7" fill="${c.light}" opacity=".32"/>`;
  }
  if (b === 'ragfluff') {
    return `
      <path d="M60 22c-3-6-9-8-12-4 3 1 5 4 6 7Z" fill="${c.light}"/>
      <path d="M50 24c-7-4-13-2-14 3 4-1 7 1 9 4Z" fill="${c.light}" opacity=".85"/>
      <path d="M70 24c7-4 13-2 14 3-4-1-7 1-9 4Z" fill="${c.light}" opacity=".85"/>
      <path d="M44 82c8 4 24 4 32 0" stroke="${c.accent}" stroke-width="3" fill="none" opacity=".28" stroke-linecap="round"/>
      <path d="M46 88c7 3 21 3 28 0" stroke="${c.accent}" stroke-width="2.4" fill="none" opacity=".22" stroke-linecap="round"/>
    `;
  }
  return '';
}

/* Arms and legs are drawn outside the body path so every breed can wear them.
   Groups carry classes so the stylesheet can make them sway and step. */
function armMarkup(style, c) {
  if (!style || style === 'none') return '';
  const stroke = `stroke="${c.deep}" stroke-width="1.2"`;
  if (style === 'paw') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-arm-l"><ellipse cx="28" cy="72" rx="7.2" ry="9.6" transform="rotate(-16 28 72)"/><circle cx="26" cy="80" r="2.1" fill="${c.light}" stroke="none"/></g>
      <g class="b-arm-r"><ellipse cx="92" cy="72" rx="7.2" ry="9.6" transform="rotate(16 92 72)"/><circle cx="94" cy="80" r="2.1" fill="${c.light}" stroke="none"/></g>
    </g>`;
  }
  if (style === 'reach') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-arm-l"><path d="M31 78c-6-6-9-14-7-20 3-3 7 0 9 5 2 4 4 9 6 12Z"/><circle cx="26" cy="56" r="4.6" fill="${c.light}" stroke="none"/></g>
      <g class="b-arm-r"><path d="M89 78c6-6 9-14 7-20-3-3-7 0-9 5-2 4-4 9-6 12Z"/><circle cx="94" cy="56" r="4.6" fill="${c.light}" stroke="none"/></g>
    </g>`;
  }
  if (style === 'wave') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-arm-l"><ellipse cx="28" cy="73" rx="7" ry="9.4" transform="rotate(-16 28 73)"/></g>
      <g class="b-arm-r"><path d="M89 74c7-4 11-12 10-19 3-3 7-1 7 3 1 7-3 15-9 19Z"/><circle cx="103" cy="54" r="4.8" fill="${c.light}" stroke="none"/></g>
    </g>`;
  }
  if (style === 'fin') {
    return `<g fill="${c.light}" opacity=".85" ${stroke}>
      <g class="b-arm-l"><path d="M33 66c-8 3-13 10-12 17 6 1 12-4 15-11Z"/></g>
      <g class="b-arm-r"><path d="M87 66c8 3 13 10 12 17-6 1-12-4-15-11Z"/></g>
    </g>`;
  }
  if (style === 'wing') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-arm-l"><path d="M33 64c-11 0-17 7-16 16 7 2 14-2 18-9Z"/><path d="M27 68c-3 4-4 8-3 11" stroke="${c.light}" stroke-width="1.4" fill="none"/></g>
      <g class="b-arm-r"><path d="M87 64c11 0 17 7 16 16-7 2-14-2-18-9Z"/><path d="M93 68c3 4 4 8 3 11" stroke="${c.light}" stroke-width="1.4" fill="none"/></g>
    </g>`;
  }
  if (style === 'mitten') {
    return `<g ${stroke}>
      <g class="b-arm-l"><ellipse cx="28" cy="76" rx="8" ry="8.6" fill="${c.accent}"/><path d="M22 82c4 2 8 2 12 0" stroke="${c.light}" stroke-width="2" fill="none"/></g>
      <g class="b-arm-r"><ellipse cx="92" cy="76" rx="8" ry="8.6" fill="${c.accent}"/><path d="M86 82c4 2 8 2 12 0" stroke="${c.light}" stroke-width="2" fill="none"/></g>
    </g>`;
  }
  if (style === 'claw') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-arm-l"><path d="M33 68c-6 2-9 8-9 14 5 0 9-3 11-7Z"/><path d="M22 78l-4 5M27 82l-3 6M32 83l-1 6" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      <g class="b-arm-r"><path d="M87 68c6 2 9 8 9 14-5 0-9-3-11-7Z"/><path d="M98 78l4 5M93 82l3 6M88 83l1 6" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    </g>`;
  }
  if (style === 'tentacle') {
    return `<g fill="none" stroke="${c.body}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <g class="b-arm-l"><path d="M34 70c-8 2-12 8-10 14 1 4 5 5 7 2"/><path d="M30 72c-5 4-6 9-3 12" stroke="${c.accent}" stroke-width="2.4"/></g>
      <g class="b-arm-r"><path d="M86 70c8 2 12 8 10 14-1 4-5 5-7 2"/><path d="M90 72c5 4 6 9 3 12" stroke="${c.accent}" stroke-width="2.4"/></g>
    </g>`;
  }
  if (style === 'hoof') {
    return `<g ${stroke}>
      <g class="b-arm-l"><path d="M33 88c-2-10 1-17 6-18 4 1 6 7 4 15Z" fill="${c.body}"/><path d="M33 92h9" stroke="${c.deep}" stroke-width="3.4" stroke-linecap="round"/></g>
      <g class="b-arm-r"><path d="M87 88c2-10-1-17-6-18-4 1-6 7-4 15Z" fill="${c.body}"/><path d="M78 92h9" stroke="${c.deep}" stroke-width="3.4" stroke-linecap="round"/></g>
    </g>`;
  }
  return `<g fill="${c.body}" ${stroke}>
    <g class="b-arm-l"><ellipse cx="28" cy="72" rx="7" ry="9.5" transform="rotate(-16 28 72)"/></g>
    <g class="b-arm-r"><ellipse cx="92" cy="72" rx="7" ry="9.5" transform="rotate(16 92 72)"/></g>
  </g>`;
}

function legMarkup(style, breed, c) {
  if (!style || style === 'breed') return feetMarkup(breed, c);
  const stroke = `stroke="${c.deep}" stroke-width="1.1"`;
  if (style === 'wheel') {
    return `<g>
      <g class="b-leg-l"><circle cx="46" cy="98" r="8" fill="${c.deep}"/><circle cx="46" cy="98" r="3.4" fill="${c.light}"/><circle cx="46" cy="98" r="8" fill="none" stroke="${c.accent}" stroke-width="1.6"/></g>
      <g class="b-leg-r"><circle cx="74" cy="98" r="8" fill="${c.deep}"/><circle cx="74" cy="98" r="3.4" fill="${c.light}"/><circle cx="74" cy="98" r="8" fill="none" stroke="${c.accent}" stroke-width="1.6"/></g>
    </g>`;
  }
  if (style === 'crab') {
    const legs = (dir) => [-8, 0, 8].map((dy, i) => `<path d="M60 ${92 + dy * 0.6}${dir > 0 ? 'h' : 'H'}${60 + dir * (16 + i * 5)}l${dir * 7} ${8 - i * 3}" fill="none" stroke="${c.deep}" stroke-width="2.2" stroke-linecap="round"/>`).join('');
    return `<g>${legs(-1)}${legs(1)}</g>`;
  }
  if (style === 'stilt') {
    return `<g stroke="${c.deep}" stroke-width="1.1" fill="${c.body}">
      <g class="b-leg-l"><rect x="44" y="82" width="4" height="22" rx="2"/><ellipse cx="44" cy="104" rx="6.4" ry="3.2" fill="${c.accent}"/></g>
      <g class="b-leg-r"><rect x="72" y="82" width="4" height="22" rx="2"/><ellipse cx="76" cy="104" rx="6.4" ry="3.2" fill="${c.accent}"/></g>
    </g>`;
  }
  if (style === 'slipper') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <g class="b-leg-l"><ellipse cx="45" cy="98" rx="11" ry="6.4" fill="${c.light}"/><circle cx="35" cy="95" r="3.2" fill="${c.accent}" stroke="none"/></g>
      <g class="b-leg-r"><ellipse cx="75" cy="98" rx="11" ry="6.4" fill="${c.light}"/><circle cx="85" cy="95" r="3.2" fill="${c.accent}" stroke="none"/></g>
    </g>`;
  }
  if (style === 'stub') {
    return `<g fill="${c.deep}" opacity=".95">
      <ellipse class="b-leg-l" cx="47" cy="99" rx="9.4" ry="6.2"/>
      <ellipse class="b-leg-r" cx="73" cy="99" rx="9.4" ry="6.2"/>
    </g>`;
  }
  if (style === 'long') {
    return `<g fill="${c.body}" ${stroke}>
      <g class="b-leg-l"><rect x="41" y="84" width="8.5" height="17" rx="4.2"/><ellipse cx="45" cy="102" rx="8" ry="4.4" fill="${c.deep}"/></g>
      <g class="b-leg-r"><rect x="70.5" y="84" width="8.5" height="17" rx="4.2"/><ellipse cx="75" cy="102" rx="8" ry="4.4" fill="${c.deep}"/></g>
    </g>`;
  }
  if (style === 'boot') {
    return `<g ${stroke}>
      <g class="b-leg-l"><rect x="42" y="86" width="8" height="12" rx="3" fill="${c.body}"/><path d="M38 96h16c2 0 3 2 3 4 0 2-1 3-3 3H39c-2 0-3-1-3-3 0-2 1-4 2-4Z" fill="${c.accent}"/></g>
      <g class="b-leg-r"><rect x="70" y="86" width="8" height="12" rx="3" fill="${c.body}"/><path d="M66 96h16c1 0 2 2 2 4 0 2-1 3-3 3H67c-2 0-3-1-3-3 0-2 1-4 2-4Z" fill="${c.accent}"/></g>
    </g>`;
  }
  if (style === 'hopper') {
    return `<g fill="${c.body}" ${stroke}>
      <ellipse class="b-leg-l" cx="44" cy="98" rx="11" ry="6.4"/>
      <ellipse class="b-leg-r" cx="76" cy="98" rx="11" ry="6.4"/>
      <ellipse cx="41" cy="97" rx="3.6" ry="2.2" fill="${c.light}" stroke="none"/>
      <ellipse cx="79" cy="97" rx="3.6" ry="2.2" fill="${c.light}" stroke="none"/>
    </g>`;
  }
  return `<g fill="${c.light}" opacity=".85" ${stroke}>
    <ellipse class="b-leg-l" cx="46" cy="100" rx="12" ry="4.6" transform="rotate(-8 46 100)"/>
    <ellipse class="b-leg-r" cx="74" cy="100" rx="12" ry="4.6" transform="rotate(8 74 100)"/>
  </g>`;
}

function feetMarkup(breed, c) {
  if (breed === 'wisp' || breed === 'fin') return '';
  return `
    <g class="b-leg-l"><ellipse cx="46" cy="96" rx="10" ry="5.4" fill="${c.deep}" opacity=".9"/><ellipse cx="44" cy="95" rx="3.6" ry="2.2" fill="${c.light}" opacity=".45"/></g>
    <g class="b-leg-r"><ellipse cx="74" cy="96" rx="10" ry="5.4" fill="${c.deep}" opacity=".9"/><ellipse cx="72" cy="95" rx="3.6" ry="2.2" fill="${c.light}" opacity=".45"/></g>`;
}

/* One boot vocabulary: the profile boot and the back pair share the cuff and
   strap builder, so trim styling cannot drift. The profile foot is a shaped
   toe; back feet are symmetric ovals, since a toe silhouette reads as a fin
   from behind. */
const BOOT_FOOT_PATH = 'M-7 -3h13c1.4 0 2.6.7 3.4 1.8l2.4 3.4c.9 1.3 0 3-1.6 3H-8.2c-1.8 0-3-1.4-2.8-3.2l.3-2.2c.2-1.6 1.2-2.8 2.7-2.8Z';

/* The back pair's cuff/strap geometry; the profile passes its own. */
const BACK_BOOT_TRIM = { cuffX: -5.5, cuffY: 99.2, cuffW: 11, cuffH: 2.8, cuffStroke: 0.9, strapX: -4.4, strapY: 101.6, strapW: 8.8, strapH: 1.6 };

/* Back feet are flat, symmetric pads: the body hem leaves four units to the
   ground. These are the plain pads; styles that need a stronger silhouette
   cue (paw pad, shin, boot, wheel, stilt, crab) branch inside the renderer. */
const BACK_FEET = {
  stub: { rx: 5.8, ry: 2.9, color: 'deep' },
  hopper: { rx: 9.2, ry: 2.4, color: 'body' },
  flipper: { rx: 9.4, ry: 2, color: 'light' },
  slipper: { rx: 8.4, ry: 2.2, color: 'light' },
};

function bootTrimMarkup(c, g) {
  const cuff = `<rect class="turn-cuff" x="${g.cuffX}" y="${g.cuffY}" width="${g.cuffW}" height="${g.cuffH}" rx="${(g.cuffH * 0.45).toFixed(2)}" fill="${c.light}" stroke="${c.deep}" stroke-width="${g.cuffStroke || 1}"/>`;
  const strap = `<rect class="turn-strap" x="${g.strapX}" y="${g.strapY}" width="${g.strapW}" height="${g.strapH}" rx="${(g.strapH * 0.36).toFixed(2)}" fill="${mix(c.accent, c.deep, 0.42)}" stroke="${c.deep}" stroke-width=".8"/>`;
  if (!g.buckleW) return `${cuff}${strap}`;
  const buckleW = g.buckleW;
  const buckleH = g.buckleH;
  const insetW = g.insetW == null ? +(buckleW * 0.45).toFixed(2) : g.insetW;
  const insetH = g.insetH == null ? +(buckleH * 0.6).toFixed(2) : g.insetH;
  const insetX = g.insetX == null ? +(g.buckleX + buckleW * 0.27).toFixed(2) : g.insetX;
  const insetY = g.insetY == null ? +(g.buckleY + buckleH * 0.18).toFixed(2) : g.insetY;
  return `${cuff}${strap}<rect class="turn-buckle" x="${g.buckleX}" y="${g.buckleY}" width="${buckleW}" height="${buckleH}" rx="${(buckleH * 0.23).toFixed(2)}" fill="${c.light}" stroke="${c.deep}" stroke-width=".8"/><rect class="turn-buckle-inset" x="${insetX}" y="${insetY}" width="${insetW}" height="${insetH}" rx="${(insetH * 0.17).toFixed(2)}" fill="${mix(c.accent, c.deep, 0.35)}"/>`;
}

/* A pad fill under 2:1 against the lower body gets one rim: pale on a dark
   backdrop, deepened on a pale one. Legible fills keep the plain pad, and the
   rim stops above the sole line. */
function backFootRim(fill, c) {
  const lower = mix(c.body, c.deep, 0.45);
  if (paletteContrast(fill, lower) >= 2) return '';
  return paletteLuminance(lower) < 0.4 ? mix(c.light, '#ffffff', 0.55) : mix(c.deep, '#0a0614', 0.4);
}

/* Back view: the body covers the front-leg markup, and its hem (102) leaves
   four units to the ground (106). Every leg style therefore gets a compact,
   symmetric pair of feet drawn after the body, soles on 106. A back foot has
   no toe direction: the profile silhouettes read as fins from behind and
   would flip inside out in the mirrored turn frames. */
let backFootClipSeq = 0;

function backWearMarkup(style, c, breed, step, turn) {
  const s = style || 'breed';
  if (s === 'breed' && (breed === 'wisp' || breed === 'fin')) return '';
  const phase = Number.isFinite(step) ? ((step % 1) + 1) % 1 : null;
  const swing = phase == null ? 0 : Math.sin(Math.PI * 2 * phase) * 1.6;
  const angle = Number.isFinite(turn) ? ((turn % 360) + 360) % 360 : 180;
  const depth = Math.sin(((angle - 180) * Math.PI) / 180);
  const near = Math.abs(depth) < 0.1 ? 0 : depth < 0 ? -1 : 1;
  /* Normal gait uses a 1.6-unit lift and a .72 far-foot scale. The chip
     variables widen stance, triple the lift, and strengthen the far-foot
     depth without changing the normal pair. */
  const at = (x, side, inner, far) => {
    const lift = side < 0 ? Math.max(0, swing) : Math.max(0, -swing);
    const shift = -side * lift * 0.55;
    const chipX = (near === 0 ? (side < 0 ? 47 : 73) : 60 + side * (side === near ? 16 : 10)) + shift * 1.4;
    const chipY = -lift * 3;
    const shrink = far ? ' translate(0 106) scale(.72) translate(0 -106)' : '';
    return `<g class="turn-back-side${far ? ' turn-back-far' : ''}" style="--x-chip:${+chipX.toFixed(2)};--y-chip:${+chipY.toFixed(2)}" transform="translate(${+(x + shift).toFixed(2)} ${+(-lift).toFixed(2)})${shrink}">${inner}</g>`;
  };
  const order = near ? [-near, near] : [-1, 1];
  const pair = (inner) => `<g class="turn-back-wear turn-back-${s}">${order.map((side) => {
    const far = near !== 0 && side !== near;
    const x = near === 0 ? (side < 0 ? 50 : 70) : 60 + side * (side === near ? 14 : 12);
    return at(x, side, inner, far);
  }).join('')}</g>`;
  /* Chip glyphs draw the leg idea at 34px, where the normal pair is only a
     few pixels tall. They replace the pair for the styles below and use
     multi-unit silhouettes rather than sub-pixel trim. */
  const chipPair = (inner) => `<g class="turn-chip-glyph" shape-rendering="crispEdges">${order.map((side) => {
    const lift = side < 0 ? Math.max(0, swing) : Math.max(0, -swing);
    const far = near !== 0 && side !== near;
    const x = near === 0 ? (side < 0 ? 47 : 73) : 60 + side * (side === near ? 16 : 10);
    const shift = -side * lift * 1.4;
    const shrink = far ? ' translate(0 106) scale(.52) translate(0 -106)' : '';
    return `<g transform="translate(${+(x + shift).toFixed(2)} ${+(-lift * 3).toFixed(2)})${shrink}">${inner}</g>`;
  }).join('')}</g>`;
  const chipInk = paletteContrast(c.deep, c.body) >= 2 ? c.deep : mix(c.deep, '#0a0614', 0.45);
  const foot = (rx, ry, color) => {
    const cy = 106 - ry;
    const rim = backFootRim(c[color], c);
    const halo = rim
      ? `<path class="turn-back-rim" d="M${+(-rx * 0.94).toFixed(2)} ${+(cy + ry * 0.34).toFixed(2)}A${rx} ${ry} 0 1 1 ${+(rx * 0.94).toFixed(2)} ${+(cy + ry * 0.34).toFixed(2)}" fill="none" stroke="${rim}" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>`
      : '';
    /* The chip ring is drawn over the foot so the edge gets a full-color
       pixel instead of the antialiased outer half of the normal arc. Its
       bottom is clipped at y=106 so the sole line never gains a ring. */
    const clipId = rim ? `back-foot-rim-${++backFootClipSeq}` : '';
    const chipRim = rim
      ? `<defs><clipPath id="${clipId}"><rect x="-24" y="-24" width="48" height="130"/></clipPath></defs><ellipse class="turn-back-rim-chip" cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${rim}" stroke-width="3.2" clip-path="url(#${clipId})"/>`
      : '';
    return `${halo}<ellipse class="turn-back-foot" cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c[color]}" stroke="${c.deep}" stroke-width=".9"/>${chipRim}`;
  };
  const shin = (w, y, h, stroke, cls) => `<rect${cls ? ` class="${cls}"` : ''} x="${-w / 2}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${c.body}" stroke="${c.deep}" stroke-width="${stroke}"/>`;

  if (s === 'boot') {
    return pair(`${foot(7.3, 2, 'accent')}${bootTrimMarkup(c, BACK_BOOT_TRIM)}`);
  }
  if (s === 'breed') {
    return pair(`${foot(9, 1.9, 'deep')}<ellipse class="turn-back-sole" cx="0" cy="104.2" rx="3.6" ry="0.7" fill="${c.light}" opacity=".45"/>`);
  }
  if (s === 'long') {
    const chip = `<rect x="-2.8" y="96.2" width="5.6" height="8.8" rx="2.4" fill="${chipInk}"/><ellipse cy="104.9" rx="3.6" ry="1.1" fill="${chipInk}"/>`;
    return `${chipPair(chip)}${pair(`${shin(4, 97.6, 7.4, 0.7, 'turn-back-shin')}${foot(7.2, 2.2, 'deep')}`)}`;
  }
  if (s === 'wheel') {
    const rim = backFootRim(c.deep, c);
    const chip = `<circle cy="99.4" r="6.6" fill="${chipInk}"/><circle cy="99.4" r="3.1" fill="${c.light}"/>`;
    return `${chipPair(chip)}${pair(`${rim ? `<path class="turn-back-rim" d="M-3.95 103.23A4.2 4.2 0 1 1 3.95 103.23" fill="none" stroke="${rim}" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>` : ''}<circle cy="101.8" r="4.2" fill="${c.deep}"/><circle class="turn-back-hub" cy="101.8" r="1.7" fill="${c.light}"/>`)}`;
  }
  if (s === 'stilt') {
    const chip = `<rect x="-2" y="93.2" width="4" height="10.4" rx="1.4" fill="${chipInk}"/><rect x="-6" y="103.6" width="12" height="2.4" rx="1" fill="${chipInk}"/>`;
    return `${chipPair(chip)}${pair(`${shin(2.2, 99, 5.4, 0.8)}${foot(5.2, 1.7, 'accent')}`)}`;
  }
  if (s === 'crab') {
    const legs = 'M-4 102l-3.4 4M0 102v4M4 102l3.4 4';
    const rim = backFootRim(c.deep, c);
    const rimLegs = 'M-4 102l-2.7 2.7M0 102v2.7M4 102l2.7 2.7';
    const chip = `<path d="M-2.8 99.2L-8.2 105.2M2.8 99.2L8.2 105.2" fill="none" stroke="${chipInk}" stroke-width="3.6" stroke-linecap="round"/>`;
    return `${chipPair(chip)}${pair(`${rim ? `<path class="turn-back-rim" d="${rimLegs}" fill="none" stroke="${rim}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>` : ''}<path d="${legs}" fill="none" stroke="${c.deep}" stroke-width="1.3" stroke-linecap="round"/>`)}`;
  }
  const spec = BACK_FEET[s] || BACK_FEET.stub;
  return pair(foot(spec.rx, spec.ry, spec.color));
}

function patternMarkup(sprite, c, clipId) {
  const p = sprite.pattern || 'plain';
  if (p === 'spots') {
    return `<g clip-path="url(#${clipId})" fill="${c.accent}" opacity=".4">
      <circle cx="36" cy="45" r="6"/><circle cx="87" cy="57" r="8"/><circle cx="47" cy="85" r="5"/>
      <circle cx="80" cy="82" r="4"/><circle cx="30" cy="66" r="3.4"/><circle cx="94" cy="42" r="3.6"/>
    </g>`;
  }
  if (p === 'stripes') {
    return `<g clip-path="url(#${clipId})" fill="${c.deep}" opacity=".16">
      <rect x="20" y="44" width="80" height="5" transform="rotate(-12 60 46)"/>
      <rect x="20" y="59" width="80" height="5" transform="rotate(-12 60 61)"/>
      <rect x="20" y="74" width="80" height="5" transform="rotate(-12 60 76)"/>
      <rect x="20" y="89" width="80" height="5" transform="rotate(-12 60 91)"/>
    </g>`;
  }
  if (p === 'freckles') {
    return `<g fill="${c.accent}" opacity=".65">
      <circle cx="39" cy="69" r="1.5"/><circle cx="44" cy="72" r="1.2"/><circle cx="34" cy="73" r="1.1"/>
      <circle cx="81" cy="69" r="1.5"/><circle cx="76" cy="72" r="1.2"/><circle cx="86" cy="73" r="1.1"/>
    </g>`;
  }
  if (p === 'star') {
    const star = (x, y, s) => `<path d="M${x} ${y - s}l${s * 0.3} ${s * 0.7} ${s * 0.8} 0-${s * 0.65} ${s * 0.5} ${s * 0.25} ${s * 0.8}-${s * 0.7}-${s * 0.45}-${s * 0.7} ${s * 0.45} ${s * 0.25}-${s * 0.8}-${s * 0.65}-${s * 0.5} ${s * 0.8} 0z" fill="${c.light}" opacity=".75"/>`;
    return `<g>${star(38, 42, 5)}${star(82, 51, 4)}${star(46, 86, 3.4)}${star(76, 84, 4.6)}</g>`;
  }
  if (p === 'hearts') {
    const heart = (x, y, s, turn) => `<path transform="translate(${x} ${y}) rotate(${turn}) scale(${s})" d="M0 4C-4-2-11 1-11 7c0 6 11 13 11 13s11-7 11-13c0-6-7-9-11-3Z" fill="${c.accent}"/>`;
    return `<g clip-path="url(#${clipId})" opacity=".55">${heart(38, 44, 0.8, -18)}${heart(82, 55, 0.95, 14)}${heart(46, 84, 0.7, 8)}${heart(77, 84, 0.8, -12)}</g>`;
  }
  if (p === 'clouds') {
    return `<g clip-path="url(#${clipId})" fill="${c.light}" opacity=".52">
      <ellipse cx="38" cy="47" rx="12" ry="6"/><ellipse cx="45" cy="43" rx="7" ry="5"/><ellipse cx="31" cy="43" rx="6" ry="4"/>
      <ellipse cx="83" cy="63" rx="10" ry="5"/><ellipse cx="88" cy="59" rx="6" ry="4"/><ellipse cx="77" cy="59" rx="5" ry="3.5"/>
      <ellipse cx="48" cy="86" rx="9" ry="4.5"/><ellipse cx="54" cy="83" rx="5" ry="3.5"/>
    </g>`;
  }
  if (p === 'swirls') {
    return `<g clip-path="url(#${clipId})" fill="none" stroke="${c.accent}" stroke-width="2.6" stroke-linecap="round" opacity=".5">
      <path d="M31 54c7-8 16-3 12 5s-15 3-13-6 17-12 25-4"/>
      <path d="M79 78c6-7 14-3 11 4s-13 3-11-5 15-10 21-3"/>
      <path d="M42 82c5-6 12-2 9 4s-11 2-9-4"/>
    </g>`;
  }
  if (p === 'flame') {
    return `<g clip-path="url(#${clipId})" opacity=".55">
      <path d="M22 100c2-12 8-15 7-23 6 4 7 9 7 13 2-6 5-9 8-11 0 9 5 13 6 21Z" fill="${c.accent}"/>
      <path d="M74 100c3-14 10-17 9-26 6 5 6 10 6 15 3-5 5-7 8-9 1 9 5 14 6 20Z" fill="${c.accent}"/>
      <path d="M45 101c2-8 6-10 6-16 4 3 5 7 5 10 2-4 4-6 6-7 0 7 3 9 4 13Z" fill="${c.light}" opacity=".8"/>
    </g>`;
  }
  if (p === 'patch') {
    return `<g clip-path="url(#${clipId})" opacity=".42">
      <rect x="24" y="38" width="16" height="14" rx="3" fill="${c.accent}" transform="rotate(-9 32 45)"/>
      <rect x="74" y="60" width="18" height="15" rx="3" fill="${c.deep}" transform="rotate(7 83 67)"/>
      <rect x="37" y="76" width="13" height="11" rx="2" fill="${c.light}" transform="rotate(-5 43 81)"/>
      <rect x="68" y="88" width="12" height="10" rx="2" fill="${c.accent}" transform="rotate(12 74 93)"/>
      <g stroke="${c.deep}" stroke-width="1" stroke-dasharray="2 2" opacity=".7"><path d="M25 38l15-2M75 62l16 1M38 77l12 1"/></g>
    </g>`;
  }
  if (p === 'sparkle') {
    const spark = (x, y, s) => `<path d="M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z" fill="${c.light}"/>`;
    return `<g clip-path="url(#${clipId})" opacity=".78">${spark(35, 43, 5)}${spark(84, 56, 6)}${spark(46, 86, 4)}${spark(78, 88, 3.4)}${spark(55, 50, 2.4)}<circle cx="30" cy="70" r="1.4" fill="${c.accent}"/><circle cx="90" cy="76" r="1.6" fill="${c.accent}"/><circle cx="62" cy="95" r="1.3" fill="${c.accent}"/></g>`;
  }
  if (p === 'belly') {
    return `<ellipse cx="60" cy="79" rx="23" ry="19" fill="${c.belly}" opacity=".95"/>`;
  }
  if (p === 'checkers') {
    const sq = [];
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        if ((row + col) % 2 === 0) sq.push(`<rect x="${26 + col * 18}" y="${38 + row * 16}" width="18" height="16"/>`);
      }
    }
    return `<g clip-path="url(#${clipId})" fill="${c.deep}" opacity=".16">${sq.join('')}</g>`;
  }
  if (p === 'ripple') {
    return `<g clip-path="url(#${clipId})" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".45">
      <ellipse cx="60" cy="78" rx="14" ry="6"/><ellipse cx="60" cy="78" rx="26" ry="11"/><ellipse cx="60" cy="78" rx="38" ry="16"/>
    </g>`;
  }
  if (p === 'petals') {
    const petal = (x, y, s, turn) => `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * 1.7}" fill="${c.accent}" opacity=".5" transform="rotate(${turn} ${x} ${y})"/>`;
    return `<g clip-path="url(#${clipId})">${petal(36, 46, 3.4, -24)}${petal(84, 54, 3.8, 18)}${petal(46, 84, 3, 8)}${petal(76, 88, 3.2, -14)}${petal(62, 40, 2.6, 42)}</g>`;
  }
  if (p === 'snow') {
    const flakes = [[35, 44], [82, 48], [45, 82], [76, 84], [60, 38], [92, 72], [28, 66]].map(([x, y]) =>
      `<g transform="translate(${x} ${y})"><path d="M0-4v8M-3.5-2l7 4M-3.5 2l7-4" stroke="${c.light}" stroke-width="1.4" stroke-linecap="round"/></g>`).join('');
    return `<g clip-path="url(#${clipId})" opacity=".8">${flakes}</g>`;
  }
  if (p === 'zigzag') {
    return `<g clip-path="url(#${clipId})" fill="none" stroke="${c.deep}" stroke-width="3" opacity=".18" stroke-linejoin="round">
      <path d="M18 48l10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8"/>
      <path d="M18 68l10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8"/>
      <path d="M18 88l10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8"/>
    </g>`;
  }
  if (p === 'glitter') {
    const bits = [[34, 42, 3], [80, 50, 2.4], [46, 80, 2.2], [74, 86, 3], [58, 46, 1.8], [92, 68, 2], [27, 64, 1.6]]
      .map(([x, y, s]) => `<path d="M${x} ${y - s}L${x + s * 0.3} ${y - s * 0.3}L${x + s} ${y}L${x + s * 0.3} ${y + s * 0.3}L${x} ${y + s}L${x - s * 0.3} ${y + s * 0.3}L${x - s} ${y}L${x - s * 0.3} ${y - s * 0.3}Z" fill="${c.light}"/>`).join('');
    return `<g clip-path="url(#${clipId})" opacity=".85">${bits}</g>`;
  }
  return `<ellipse cx="60" cy="80" rx="19" ry="15.5" fill="${c.belly}" opacity=".8"/>`;
}

function accessoryMarkup(name, c) {
  if (name === 'bandana') {
    return `<g transform="translate(60 84)">
      <path d="M-24 0c0-4 11-6 24-6s24 2 24 6-11 6-24 6-24-2-24-6Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M2 6l10 14H-8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M-16 0c8 2 24 2 32 0" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>
    </g>`;
  }
  if (name === 'bowtie') {
    return `<g transform="translate(60 88)" stroke="${c.deep}" stroke-width="1">
      <path d="M-12-5 0 0-12 5Z" fill="${c.accent}"/>
      <path d="M12-5 0 0 12 5Z" fill="${c.accent}"/>
      <circle r="3" fill="${c.light}"/>
    </g>`;
  }
  if (name === 'earmuffs') {
    return `<g>
      <path d="M33 52c0-14 12-24 27-24s27 10 27 24" fill="none" stroke="${c.accent}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="31" cy="57" r="8" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="89" cy="57" r="8" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
      <circle cx="31" cy="57" r="3.2" fill="${c.accent}"/><circle cx="89" cy="57" r="3.2" fill="${c.accent}"/>
    </g>`;
  }
  if (name === 'starclip') {
    return `<g transform="translate(39 29)" stroke="${c.deep}" stroke-width="1" stroke-linejoin="round">
      <path d="M0-10l2.9 5.4 5.9.7-4.3 4.1 1.1 5.9L0 3.2l-5.6 2.9 1.1-5.9-4.3-4.1 5.9-.7Z" fill="${c.light}"/>
    </g>`;
  }
  if (name === 'sproutclip') {
    return `<g transform="translate(39 30)">
      <path d="M0 6c0-5 1-9 2-13" stroke="${c.deep}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M2-5c5-6 12-4 13 3-5 2-10 1-13-3Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M1 0c-5-4-11-2-12 3 5 2 9 0 12-3Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
    </g>`;
  }
  if (name === 'goggles') {
    return `<g>
      <path d="M34 56h52" stroke="${c.deep}" stroke-width="4" stroke-linecap="round" opacity=".75"/>
      <circle cx="47" cy="59" r="11" fill="${c.accent}" fill-opacity=".28" stroke="${c.light}" stroke-width="2.6"/>
      <circle cx="73" cy="59" r="11" fill="${c.accent}" fill-opacity=".28" stroke="${c.light}" stroke-width="2.6"/>
      <path d="M41 54c3-3 8-3 11 0" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".85"/>
      <path d="M67 54c3-3 8-3 11 0" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".85"/>
    </g>`;
  }
  if (name === 'tophat') {
    return `<g transform="translate(60 26) rotate(-4)">
      <rect x="-15" y="-26" width="30" height="24" rx="3" fill="#241a3a" stroke="#8b7bff" stroke-width="1.1"/>
      <rect x="-26" y="-4" width="52" height="7" rx="3.5" fill="#241a3a" stroke="#8b7bff" stroke-width="1.1"/>
      <rect x="-15" y="-8" width="30" height="4" fill="${c.accent}" opacity=".9"/>
    </g>`;
  }
  if (name === 'halo') {
    return `<g><ellipse cx="60" cy="22" rx="22" ry="7" fill="none" stroke="#ffe066" stroke-width="4" opacity=".95"/>
      <ellipse cx="60" cy="22" rx="22" ry="7" fill="none" stroke="#fff6c9" stroke-width="1.4" opacity=".9"/>
      <ellipse cx="60" cy="20" rx="30" ry="12" fill="#ffe066" opacity=".12"/></g>`;
  }
  if (name === 'medal') {
    return `<g>
      <path d="M48 66l-6 22M72 66l6 22" stroke="#d94b6b" stroke-width="5" stroke-linecap="round"/>
      <circle cx="60" cy="86" r="9" fill="#ffd166" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M60 80l1.8 4 4.2.4-3.2 2.9 1 4.1-3.8-2.3-3.8 2.3 1-4.1-3.2-2.9 4.2-.4Z" fill="#8a5a0a"/>
    </g>`;
  }
  if (name === 'cowboyhat') {
    return `<g transform="translate(60 28) rotate(-3)">
      <path d="M-30 4c10-4 50-4 60 0-6 6-18 8-30 8S-24 10-30 4Z" fill="#b58455" stroke="#7a5a34" stroke-width="1.1"/>
      <path d="M-14 4c-6-14-2-24 14-24s20 10 14 24Z" fill="#c99a68" stroke="#7a5a34" stroke-width="1.1"/>
      <path d="M-13 0c9-3 17-3 26 0" stroke="#6b4a2a" stroke-width="3" fill="none"/>
      <circle cx="0" cy="-2" r="2" fill="${c.accent}"/>
    </g>`;
  }
  if (name === 'snorkel') {
    return `<g>
      <path d="M36 62c0-8 10-13 24-13s24 5 24 13" fill="none" stroke="#5ad6ff" stroke-width="5" stroke-linecap="round"/>
      <rect x="30" y="56" width="13" height="16" rx="5" fill="#2b7fa8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M84 62c4 0 7 4 7 9v12" stroke="#ffd166" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="91" cy="86" r="4" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
    </g>`;
  }
  if (name === 'monocle') {
    return `<g>
      <circle cx="73" cy="60" r="12" fill="rgba(255,255,255,.16)" stroke="#ffd166" stroke-width="2.4"/>
      <path d="M85 64c7 6 9 16 7 26" stroke="#ffd166" stroke-width="1.6" fill="none"/>
      <path d="M66 54c4-3 9-3 13 0" stroke="#fff6c9" stroke-width="1.6" fill="none" opacity=".8"/>
    </g>`;
  }

  if (name === 'crown') {
    return `<g>
      <path d="M44 26l4-12 7 7 5-10 5 10 7-7 4 12z" fill="#ffd166" stroke="#c98d1a" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="60" cy="23" r="2" fill="#ff8fa3"/>
      <circle cx="48" cy="24" r="1.5" fill="#8be9ff"/>
      <circle cx="72" cy="24" r="1.5" fill="#b69cff"/>
    </g>`;
  }
  if (name === 'bow') {
    return `<g transform="translate(82 30) rotate(12)">
      <path d="M0 0c-9-8-16 0-9 7 4 4 8 1 9-2Z" fill="#ff8fb2"/>
      <path d="M0 0c9-8 16 0 9 7-4 4-8 1-9-2Z" fill="#ff8fb2"/>
      <circle cx="0" cy="3" r="3.6" fill="#ff5e8a"/>
    </g>`;
  }
  if (name === 'scarf') {
    return `<g>
      <path d="M33 82c14 9 40 9 54 0l2 10c-16 9-42 9-58 0z" fill="#ff8fa3"/>
      <path d="M81 89c6 1 9 5 8 12-4 1-8-3-9-7z" fill="#ff6b8f"/>
      <path d="M36 84c10 5 22 6 34 4" stroke="#ffd6e0" stroke-width="1.6" fill="none" opacity=".8"/>
    </g>`;
  }
  if (name === 'glasses') {
    return `<g fill="none" stroke="#2b2440" stroke-width="2.4">
      <circle cx="47" cy="60" r="11" fill="rgba(255,255,255,.14)"/>
      <circle cx="73" cy="60" r="11" fill="rgba(255,255,255,.14)"/>
      <path d="M58 60h4M36 58l-6-2M84 58l6-2"/>
    </g>`;
  }
  if (name === 'leaf') {
    return `<g transform="translate(39 27) rotate(-18)">
      <path d="M0 0c-9-7-16 2-12 9 3 6 11 4 14-2Z" fill="#7ed957" stroke="#357a2e" stroke-width="1.2"/>
      <path d="M-9 8c4-2 7-5 8-8" stroke="#357a2e" stroke-width="1" fill="none"/>
    </g>`;
  }
  if (name === 'flower') {
    return `<g transform="translate(82 27)">
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-7" rx="4" ry="6.5" fill="#ffd1e8" transform="rotate(${a})"/>`).join('')}
      <circle r="3.6" fill="#ffd166"/>
    </g>`;
  }
  if (name === 'headphones') {
    return `<g>
      <path d="M32 58c0-24 12-34 28-34s28 10 28 34" stroke="#3a3358" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      <rect x="25" y="54" width="13" height="19" rx="6" fill="#3a3358"/>
      <rect x="82" y="54" width="13" height="19" rx="6" fill="#3a3358"/>
      <rect x="28" y="58" width="7" height="11" rx="3" fill="${c.accent}"/>
      <rect x="85" y="58" width="7" height="11" rx="3" fill="${c.accent}"/>
    </g>`;
  }
  if (name === 'partyhat') {
    return `<g transform="translate(60 30) rotate(-9)">
      <path d="M0-32L-13 0h26Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-8-10h16M-5-19h10M-2-27h4" stroke="${c.light}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <circle cx="0" cy="-34" r="4.2" fill="${c.light}" stroke="${c.deep}" stroke-width=".9"/>
    </g>`;
  }
  if (name === 'flowercrown') {
    const bloomAt = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5" rx="3" ry="4.6" fill="#ffd1e8" transform="rotate(${a})"/>`).join('')}
      <circle r="2.6" fill="#ffd166"/></g>`;
    return `<g>${bloomAt(37, 31, 0.9)}${bloomAt(49, 27, 0.75)}${bloomAt(61, 27, 0.9)}${bloomAt(73, 27, 0.75)}${bloomAt(84, 32, 0.85)}
      <path d="M30 34c12-8 48-8 60 0" stroke="#7ed957" stroke-width="2.4" fill="none" opacity=".8"/>
      <path d="M41 29l-5-5M78 28l6-5" stroke="#5f9e48" stroke-width="1.6" stroke-linecap="round"/>
    </g>`;
  }
  if (name === 'beret') {
    return `<g transform="rotate(-8 58 30)">
      <path d="M32 32c1-11 11-18 24-17 12 1 20 8 21 17-14-3-31-3-45 0Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M30 33c16-3 38-3 54 0" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".35"/>
      <path d="M61 15c1-4 3-6 6-6" stroke="${c.deep}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  if (name === 'bellcollar') {
    return `<g>
      <path d="M34 83c15 8 37 8 52 0l2 8c-17 8-39 8-56 0Z" fill="#d94b6b" stroke="${c.deep}" stroke-width="1"/>
      <path d="M37 85c13 5 32 5 45 0" stroke="#ffd6e0" stroke-width="1.3" fill="none" opacity=".7"/>
      <circle cx="60" cy="92" r="5.2" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
      <path d="M60 97v3" stroke="${c.deep}" stroke-width="1.2" stroke-linecap="round"/>
    </g>`;
  }
  if (name === 'sunglasses') {
    return `<g>
      <rect x="34" y="53" width="23" height="14" rx="6" fill="#241a3a" opacity=".94"/>
      <rect x="63" y="53" width="23" height="14" rx="6" fill="#241a3a" opacity=".94"/>
      <path d="M57 58h6M34 56l-8-2M86 56l8-2" stroke="#241a3a" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M38 56c4-2 8-2 12 0" stroke="#8be9ff" stroke-width="1.3" fill="none" opacity=".55"/>
      <path d="M67 56c4-2 8-2 12 0" stroke="#ffb3d1" stroke-width="1.3" fill="none" opacity=".45"/>
    </g>`;
  }
  if (name === 'overalls') {
    return `<g>
      <path d="M41 84h38v20H41Z" fill="#5b7fa8" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M44 85V63M76 85V63" stroke="#5b7fa8" stroke-width="5.4" stroke-linecap="round"/>
      <path d="M46 82l4 4M74 82l-4 4" stroke="#ffd166" stroke-width="2" stroke-linecap="round"/>
      <circle cx="46" cy="84" r="1.8" fill="#ffd166"/><circle cx="74" cy="84" r="1.8" fill="#ffd166"/>
      <rect x="53" y="89" width="14" height="10" rx="2" fill="#4a6b8f" stroke="#c9e2ff" stroke-width=".8" opacity=".85"/>
      <path d="M45 98h30" stroke="#c9e2ff" stroke-width="1" opacity=".35" stroke-dasharray="3 3"/>
    </g>`;
  }
  if (name === 'raincoat') {
    return `<g>
      <path d="M33 43c0-17 12-28 27-28s27 11 27 28" fill="none" stroke="#ffd166" stroke-width="7" stroke-linecap="round" opacity=".95"/>
      <path d="M37 78c14-6 32-6 46 0l5 27H32Z" fill="#ffd166" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M60 78v27M40 88l-4 17M80 88l4 17" stroke="${c.deep}" stroke-width="1.1" fill="none" opacity=".35"/>
      <circle cx="60" cy="86" r="2" fill="#8a5a2b"/><circle cx="60" cy="94" r="2" fill="#8a5a2b"/>
      <path d="M44 80c10 3 22 3 32 0" stroke="#fff3c4" stroke-width="1.6" fill="none" opacity=".7"/>
    </g>`;
  }
  if (name === 'boots') {
    return `<g>
      <path d="M32 90h16v12c0 4-3 6-8 6s-8-2-8-6ZM72 90h16v12c0 4-3 6-8 6s-8-2-8-6Z" fill="#4f89c9" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M30 92h20v5H30ZM70 92h20v5H70Z" fill="#7affd8" stroke="${c.deep}" stroke-width=".9"/>
      <path d="M34 98h12M74 98h12" stroke="#ffe066" stroke-width="1.4" stroke-linecap="round"/>
    </g>`;
  }
  if (name === 'cape') {
    return `<g>
      <path d="M38 77C20 84 15 101 22 112h14l5-26Z" fill="#d94b4b" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M82 77c18 7 23 24 16 35H84l-5-26Z" fill="#d94b4b" stroke="${c.deep}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M27 104c5-2 9-3 14-2M93 104c-5-2-9-3-14-2" stroke="#ffb3b3" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/>
      <circle cx="60" cy="78" r="4.4" fill="#ffd166" stroke="${c.deep}" stroke-width="1"/>
    </g>`;
  }
  if (name === 'backpack') {
    return `<g>
      <path d="M42 62c-4 10-4 22 0 32M78 62c4 10 4 22 0 32" stroke="#7a5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="86" y="70" width="22" height="27" rx="7" fill="#7a8f5a" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M88 79c6 2 12 2 18 0" stroke="#c9e2a8" stroke-width="1.4" fill="none"/>
      <rect x="91" y="83" width="12" height="8" rx="2" fill="#5f7045" stroke="#c9e2a8" stroke-width=".7"/>
      <circle cx="63" cy="62" r="2" fill="#ffd166"/><circle cx="57" cy="64" r="1.4" fill="#ffd166" opacity=".7"/>
    </g>`;
  }
  if (name === 'wizardhat') {
    return `<g transform="translate(60 30) rotate(5)">
      <path d="M-27 2c18-5 36-5 54 0-4-10-8-17-11-27-2-7-7-10-12-13 3 7 2 13-1 20-2 6-4 12-3 20Z" fill="#3d2a6b" stroke="${c.deep}" stroke-width="1.2" stroke-linejoin="round"/>
      <ellipse cx="0" cy="2" rx="29" ry="7" fill="#3d2a6b" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M-4-26l1.4 3.6 3.6 1.4-3.6 1.4L-4-16l-1.4-3.6L-9-21l3.6-1.4ZM9-12l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" fill="#ffd166"/>
      <path d="M-19 1c12-3 26-3 38 0" stroke="#b69cff" stroke-width="1.6" fill="none" opacity=".8"/>
    </g>`;
  }
  if (name === 'beanie') {
    return `<g>
      <path d="M36 33c0-14 10-23 24-23s24 9 24 23Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.3"/>
      <path d="M33 33h54l-2 9H35Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/>
      <circle cx="60" cy="8" r="5.6" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
      <path d="M46 14v18M60 12v21M74 14v18" stroke="${c.deep}" stroke-width=".8" opacity=".35"/>
      <path d="M36 34c8 3 16 4 24 4s16-1 24-4" stroke="${c.deep}" stroke-width=".8" fill="none" opacity=".3"/>
    </g>`;
  }
  if (name === 'mittens') {
    return `<g stroke="${c.deep}" stroke-width="1.1">
      <path d="M25 76c-7 0-11 4-11 9 0 5 5 9 11 9 4 0 7-2 8-5l2-6c1-4-3-7-6-6Z" fill="#ff9a5a"/>
      <path d="M95 76c7 0 11 4 11 9 0 5-5 9-11 9-4 0-7-2-8-5l-2-6c-1-4 3-7 6-6Z" fill="#ff9a5a"/>
      <path d="M22 86c2 1 4 1 6 0M98 86c-2 1-4 1-6 0" fill="none" stroke="#ffe9d0" stroke-width="1.4"/>
      <path d="M16 89c-2 2-2 5 0 6M104 89c2 2 2 5 0 6" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".8"/>
    </g>`;
  }
  if (name === 'parka') {
    return `<g>
      <path d="M42 84c4-4 10-6 18-6s14 2 18 6c-3 5-10 7-18 7s-15-2-18-7Z" fill="#f2efe8" stroke="${c.deep}" stroke-width="1"/>
      <path d="M36 87c6 4 15 6 24 6s18-2 24-6c4 3 7 8 8 13 1 6-1 11-1 11-9 4-20 6-31 6s-22-2-31-6c0 0-2-5-1-11 1-5 4-10 8-13Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M36 88c-6 3-9 9-9 16 0 4 3 7 7 6 4-1 6-4 7-8l2-10Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M84 88c6 3 9 9 9 16 0 4-3 7-7 6-4-1-6-4-7-8l-2-10Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M32 102c3 1 6 1 9 0M88 102c-3 1-6 1-9 0" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M60 93v26" stroke="${c.deep}" stroke-width="1.1" opacity=".45"/>
      <circle cx="60" cy="99" r="1.9" fill="#ffd166"/>
      <circle cx="60" cy="107" r="1.9" fill="#ffd166"/>
      <path d="M33 112c8 3 18 4 27 4s19-1 27-4" stroke="#ffffff" stroke-width="2" opacity=".6" fill="none"/>
      <path d="M36 88c5 3 14 5 24 5s19-2 24-5" fill="none" stroke="#ffffff" stroke-width="2.4" opacity=".5"/>
    </g>`;
  }
  return '';
}

/* Player-made garments. These are drawn separately from the fixed accessory list. */
/* A sprite may carry `outfitPreview` with a garment that is not in the wardrobe
   yet, so Studio can draw an outfit before it is added or saved. */
function outfitFor(sprite) {
  if (sprite && sprite.outfitPreview && typeof sprite.outfitPreview === 'object') return sprite.outfitPreview;
  return sprite && sprite.outfit && typeof customClothFor === 'function' ? customClothFor(sprite.outfit) : null;
}
function customOutfitCore(sprite, c, clipId) {
  if (!sprite || !sprite.outfit) return '';
  const outfit = outfitFor(sprite);
  if (!outfit) return '';
  const p = outfit.primary;
  const s = outfit.secondary;
  const deep = c.deep;
  const chest = `<circle cx="60" cy="82" r="3.2" fill="${s}" stroke="${deep}" stroke-width=".8"/>`;
  if (outfit.style === 'cape') {
    return `<g>
      <path d="M36 55 18 102l24-7 7-31M84 55l18 47-24-7-7-31" fill="${p}" opacity=".92" stroke="${s}" stroke-width="1.5"/>
      <path d="M38 58c8 5 36 5 44 0" fill="none" stroke="${s}" stroke-width="2.2" opacity=".8"/>
      ${chest}
    </g>`;
  }
  if (outfit.style === 'scarf') {
    return `<g>
      <path d="M33 79c15 8 39 8 54 0l2 9c-17 8-41 8-58 0Z" fill="${p}" stroke="${deep}" stroke-width="1"/>
      <path d="M82 86c7 2 10 8 7 16-5 0-9-5-10-10Z" fill="${s}" stroke="${deep}" stroke-width="1"/>
      <path d="M38 83c12 5 32 5 44 0" fill="none" stroke="${s}" stroke-width="1.8" opacity=".8"/>
    </g>`;
  }
  if (outfit.style === 'hoodie') {
    return `<g clip-path="url(#${clipId})">
      <path d="M31 70c9-5 20-7 29-7s20 2 29 7c2 1 3 3 2 5l-3 9c-2 8-2 16-2 22-17 5-35 5-52 0 0-6 0-14-2-22l-3-9c-1-2 0-4 2-5Z" fill="${p}"/>
      <path d="M31 70c9-5 20-7 29-7s20 2 29 7" fill="none" stroke="${s}" stroke-width="2.2" opacity=".9"/>
      <path d="M35 101c16 4 34 4 50 0" fill="none" stroke="${s}" stroke-width="2.4" opacity=".7"/>
      <path d="M50 86h20v11H50Z" fill="none" stroke="${s}" stroke-width="1.3" opacity=".8"/>
      <path d="M60 72v13" stroke="${s}" stroke-width="1.2" stroke-dasharray="2 2" opacity=".75"/>
      <path d="M52 73l-2 10M68 73l2 10" stroke="${s}" stroke-width="1.3" stroke-linecap="round" opacity=".8"/>
      <path d="M37 78c-2 6-3 12-3 18M83 78c2 6 3 12 3 18" stroke="${s}" stroke-width="1" fill="none" opacity=".35"/>
    </g>`;
  }
  if (outfit.style === 'vest') {
    return `<g clip-path="url(#${clipId})">
      <path d="M32 68c4-3 9-4 13-4l-2 12c0 8 1 18 3 26-6 4-13 5-19 3 3-12 3-25 5-37Z" fill="${p}" opacity=".95"/>
      <path d="M88 68c-4-3-9-4-13-4l2 12c0 8-1 18-3 26 6 4 13 5 19 3-3-12-3-25-5-37Z" fill="${p}" opacity=".95"/>
      <path d="M42 67l8 10M78 67l-8 10" stroke="${s}" stroke-width="2" fill="none" opacity=".9"/>
      ${chest}
    </g>`;
  }
  if (outfit.style === 'dress') {
    return `<g>
      <path d="M43 72h34l15 32H28Z" fill="${p}" opacity=".93" stroke="${deep}" stroke-width="1.1"/>
      <path d="M40 72c10 7 30 7 40 0" fill="none" stroke="${s}" stroke-width="3"/>
      <path d="M34 96c14 4 38 4 52 0" fill="none" stroke="${s}" stroke-width="1.5" opacity=".75"/>
      ${chest}
    </g>`;
  }
  if (outfit.style === 'armor') {
    return `<g clip-path="url(#${clipId})">
      <path d="M38 68h44l-5 28H43Z" fill="${p}" opacity=".9" stroke="${s}" stroke-width="1.5"/>
      <path d="M30 60l-6 16 15-4 3-13M90 60l6 16-15-4-3-13" fill="${p}" stroke="${s}" stroke-width="1.2"/>
      <path d="M52 76h16M60 69v23M47 88h26" stroke="${s}" stroke-width="1.2" opacity=".8"/>
    </g>`;
  }
  if (outfit.style === 'hat') {
    return `<g>
      <path d="M34 34c1-13 12-22 26-22s25 9 26 22c-15-4-37-4-52 0Z" fill="${p}" stroke="${deep}" stroke-width="1.2"/>
      <path d="M33 34c16-4 38-4 54 0" fill="none" stroke="${s}" stroke-width="4"/>
      <circle cx="60" cy="13" r="4" fill="${s}" stroke="${deep}" stroke-width=".9"/>
      <path d="M41 24c10-5 28-5 38 0" fill="none" stroke="${s}" stroke-width="1.2" opacity=".65"/>
    </g>`;
  }
  if (outfit.style === 'boots') {
    return `<g>
      <path d="M31 88c8-2 15 1 17 8l4 9H24c-2-6 0-12 7-17Z" fill="${p}" stroke="${deep}" stroke-width="1.1"/>
      <path d="M89 88c-8-2-15 1-17 8l-4 9h28c2-6 0-12-7-17Z" fill="${p}" stroke="${deep}" stroke-width="1.1"/>
      <path d="M25 102h26M69 102h26" stroke="${s}" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  }
  if (outfit.style === 'crown') {
    return `<g>
      <path d="M36 34l4-16 10 9 10-13 10 13 10-9 4 16Z" fill="${p}" stroke="${deep}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M36 34c16-4 32-4 48 0l-2 7c-14-3-30-3-44 0Z" fill="${s}" stroke="${deep}" stroke-width="1"/>
      <circle cx="60" cy="21" r="2.6" fill="${s}"/><circle cx="45" cy="27" r="1.8" fill="${s}"/><circle cx="75" cy="27" r="1.8" fill="${s}"/>
    </g>`;
  }
  if (outfit.style === 'bowtie') {
    return `<g>
      <path d="M60 84l-15-7v14Z" fill="${p}" stroke="${deep}" stroke-width="1"/>
      <path d="M60 84l15-7v14Z" fill="${p}" stroke="${deep}" stroke-width="1"/>
      <circle cx="60" cy="84" r="3.6" fill="${s}" stroke="${deep}" stroke-width=".8"/>
      <path d="M38 76l-8-4v20l8-4ZM82 76l8-4v20l-8-4Z" fill="${s}" opacity=".85"/>
    </g>`;
  }
  if (outfit.style === 'glasses') {
    return `<g fill="none" stroke="${s}" stroke-width="2">
      <circle cx="47" cy="59" r="9.5" fill="${p}" fill-opacity=".22"/>
      <circle cx="73" cy="59" r="9.5" fill="${p}" fill-opacity=".22"/>
      <path d="M56.5 59h7M37.5 57l-7-3M82.5 57l7-3" stroke-linecap="round"/>
      <path d="M42 55c3-2 7-2 9 0" stroke="#ffffff" stroke-width="1.4" opacity=".8"/>
    </g>`;
  }
  if (outfit.style === 'overalls') {
    return `<g clip-path="url(#${clipId})">
      <path d="M39 72h42v36H39Z" fill="${p}" opacity=".95"/>
      <path d="M47 72V60M73 72V60" stroke="${p}" stroke-width="6" stroke-linecap="round"/>
      <rect x="51" y="84" width="18" height="14" rx="3" fill="${s}" opacity=".5" stroke="${s}" stroke-width="1"/>
      <circle cx="47" cy="72" r="2" fill="${s}"/><circle cx="73" cy="72" r="2" fill="${s}"/>
    </g>`;
  }
  if (outfit.style === 'kimono') {
    return `<g>
      <path d="M42 68h36l16 34H26Z" fill="${p}" opacity=".94" stroke="${deep}" stroke-width="1"/>
      <path d="M48 68l12 16 12-16" fill="${s}" opacity=".9"/>
      <path d="M40 74l-10 26M80 74l10 26" stroke="${p}" stroke-width="9" stroke-linecap="round"/>
      <path d="M40 74l-10 26M80 74l10 26" stroke="${s}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <path d="M34 92c16 5 36 5 52 0" stroke="${s}" stroke-width="4" fill="none" opacity=".9"/>
    </g>`;
  }
  if (outfit.style === 'backpack') {
    return `<g>
      <path d="M84 66c7 0 11 5 11 12v13c0 5-4 9-9 9h-6c-4 0-7-3-7-7V76c0-6 5-10 11-10Z" fill="${p}" stroke="${deep}" stroke-width="1.2"/>
      <path d="M83 66v-5c0-4 3-6 6-6s6 2 6 6v5" fill="none" stroke="${s}" stroke-width="2.4"/>
      <rect x="80" y="82" width="13" height="9" rx="2" fill="${s}" opacity=".55"/>
      <path d="M80 76c4 2 9 2 13 0" stroke="${s}" stroke-width="1.6" fill="none"/>
      <path d="M42 68l-6 18M78 68l6 18" stroke="${p}" stroke-width="5" stroke-linecap="round"/>
    </g>`;
  }
  return '';
}

/* Garments need two things the flat art lacked: a class so the stylesheet can
   move them like fabric, and stitched patterns so two outfits in one style
   still look different. */
function clothPatternMarkup(outfit, clipId) {
  const pattern = outfit.pattern || 'plain';
  const torso = ['hoodie', 'vest', 'dress', 'armor', 'overalls', 'kimono', 'cape'];
  if (pattern === 'plain' || !torso.includes(outfit.style)) return '';
  const s = outfit.secondary;
  const stitch = (typeof CUSTOM_CLOTH_SIZES !== 'undefined' && CUSTOM_CLOTH_SIZES[outfit.stitch]) || { scale: 1, ink: 0.3 };
  const stain = Number(stitch.scale) || 1;
  const ink = Number(stitch.ink) || 0.3;
  /* Stitches keep a consistent density rather than a fixed size, so a fine
     pattern still reads on a small sprite. The opacity lives in a CSS variable
     so the drift animation can breathe around it instead of overriding it. */
  const wrap = (inner) => `<g clip-path="url(#${clipId})" class="cloth-pattern" style="--cloth-ink:${ink}"><g transform="translate(60 88) scale(${stain}) translate(-60 -88)">${inner}</g></g>`;
  if (pattern === 'stripes') {
    return wrap(`<g fill="${s}"><rect x="18" y="72" width="84" height="3.4" transform="rotate(-5 60 73)"/><rect x="18" y="84" width="84" height="3.4" transform="rotate(-5 60 85)"/><rect x="18" y="96" width="84" height="3.4" transform="rotate(-5 60 97)"/></g>`);
  }
  if (pattern === 'dots') {
    return wrap(`<g fill="${s}"><circle cx="38" cy="76" r="3"/><circle cx="54" cy="86" r="2.6"/><circle cx="70" cy="76" r="3"/><circle cx="82" cy="88" r="2.6"/><circle cx="46" cy="98" r="2.4"/><circle cx="72" cy="100" r="2.4"/></g>`);
  }
  if (pattern === 'checks') {
    return wrap(`<g fill="${s}"><rect x="36" y="76" width="6" height="6"/><rect x="48" y="76" width="6" height="6"/><rect x="60" y="76" width="6" height="6"/><rect x="72" y="76" width="6" height="6"/><rect x="42" y="82" width="6" height="6"/><rect x="54" y="82" width="6" height="6"/><rect x="66" y="82" width="6" height="6"/><rect x="78" y="82" width="6" height="6"/><rect x="36" y="88" width="6" height="6"/><rect x="48" y="88" width="6" height="6"/><rect x="60" y="88" width="6" height="6"/><rect x="72" y="88" width="6" height="6"/><rect x="42" y="94" width="6" height="6"/><rect x="54" y="94" width="6" height="6"/><rect x="66" y="94" width="6" height="6"/><rect x="78" y="94" width="6" height="6"/></g>`);
  }
  if (pattern === 'stars') {
    return wrap(`<g fill="${s}"><path d="M38 72l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.7-3.1 1.7.6-3.4-2.5-2.4 3.4-.5Z"/><path d="M60 80l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.7-3.1 1.7.6-3.4-2.5-2.4 3.4-.5Z"/><path d="M82 72l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.7-3.1 1.7.6-3.4-2.5-2.4 3.4-.5Z"/></g>`);
  }
  if (pattern === 'hearts') {
    return wrap(`<g fill="${s}"><path d="M38 84c-2.6-3.4-6.8-1.4-6.8 2 0 3.4 6.8 6.6 6.8 6.6s6.8-3.2 6.8-6.6c0-3.4-4.2-5.4-6.8-2Z"/><path d="M82 74c-2.2-2.8-5.8-1.2-5.8 1.7 0 2.9 5.8 5.6 5.8 5.6s5.8-2.7 5.8-5.6c0-2.9-3.6-4.5-5.8-1.7Z"/></g>`);
  }
  if (pattern === 'zigzag') {
    return wrap(`<g fill="none" stroke="${s}" stroke-width="2.4" stroke-linejoin="round"><path d="M28 78l8-5 8 5 8-5 8 5 8-5 8 5 8-5"/><path d="M28 94l8-5 8 5 8-5 8 5 8-5 8 5 8-5"/></g>`);
  }
  if (pattern === 'trim') {
    return wrap(`<g stroke="${s}" fill="none"><path d="M30 74c20 5 40 5 60 0" stroke-width="2.6"/><path d="M28 100c21 5 43 5 64 0" stroke-width="4"/><path d="M30 96c20 4 40 4 60 0" stroke-width="1.2" stroke-dasharray="2 3" opacity=".8"/></g>`);
  }
  return '';
}

function customOutfitMarkup(sprite, c, clipId) {
  if (!sprite || !sprite.outfitPreview && !sprite.outfit) return '';
  const outfit = outfitFor(sprite);
  if (!outfit) return '';
  const core = customOutfitCore(sprite, c, clipId);
  if (!core) return '';
  return `<g class="cloth cloth-${outfit.style}">${core}${clothPatternMarkup(outfit, clipId)}</g>`;
}

function finishMarkup(sprite, c, clipId, hasSignature = false) {
  const f = finishOf(sprite);
  if (!f) return '';
  /* A named variant's signature already draws its finish motif. Atlas-skinned
     breeds skip signature art, so they still need the generic layer. */
  if (hasSignature && ELEMENTS[sprite.element]?.variantStyle === sprite.variant) return '';
  if (sprite.variant === 'gold') {
    return `
      <g clip-path="url(#${clipId})" opacity=".35">
        <path d="M8 52L72 112" stroke="#ffffff" stroke-width="12"/>
        <path d="M38 18L98 78" stroke="#fff6cc" stroke-width="5"/>
      </g>
      <path d="M25 35l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5ZM96 44l1.2 3.2 3.2 1.2-3.2 1.2L96 53l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="#fff6cc" opacity=".9"/>`;
  }
  if (sprite.variant === 'gummy') {
    return `
      <g clip-path="url(#${clipId})" opacity=".45">
        <ellipse cx="42" cy="46" rx="12" ry="7" fill="#ffffff" transform="rotate(-24 42 46)"/>
        <ellipse cx="77" cy="84" rx="8" ry="5" fill="#ffffff" transform="rotate(28 77 84)"/>
        <path d="M28 78c8 5 14 5 20 1" stroke="#ffffff" stroke-width="2" fill="none"/>
      </g>
      <path d="M94 38c4 0 6 3 4 6" stroke="#ffffff" stroke-width="1.4" fill="none" opacity=".7"/>`;
  }
  if (sprite.variant === 'galaxy') {
    return `
      <g clip-path="url(#${clipId})" fill="#ffffff">
        <circle cx="38" cy="40" r="1.6" opacity=".9"/><circle cx="73" cy="50" r="1.2" opacity=".8"/>
        <circle cx="52" cy="86" r="1.4" opacity=".7"/><circle cx="86" cy="72" r="1" opacity=".8"/>
        <circle cx="61" cy="34" r=".9" opacity=".7"/><circle cx="31" cy="65" r="1" opacity=".6"/>
      </g>
      <ellipse cx="60" cy="62" rx="46" ry="17" fill="none" stroke="${c.light}" stroke-width="1.2" opacity=".45" transform="rotate(-12 60 62)"/>
      <path d="M96 34l1.4 3.6 3.6 1.4-3.6 1.4L96 44l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="${c.accent}" opacity=".9"/>`;
  }
  if (sprite.variant === 'holofoil') {
    return `
      <g clip-path="url(#${clipId})" opacity=".3">
        <path d="M12 62L58 16h12L24 74Z" fill="#8be9ff"/>
        <path d="M34 86L80 40h10L44 96Z" fill="#ffb3d1"/>
        <path d="M58 104L104 58v10L68 104Z" fill="#ffe066"/>
      </g>
      <path d="M24 46l1.2 3.2 3.2 1.2-3.2 1.2L24 55l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".85"/>`;
  }
  if (sprite.variant === 'cube') {
    return `
      <g clip-path="url(#${clipId})" stroke="${c.light}" stroke-width="1" opacity=".28" fill="none">
        <path d="M20 40h80M20 60h80M20 80h80M40 20v90M60 20v90M80 20v90"/>
      </g>
      <path d="M21 40h7v7h-7ZM92 64h6v6h-6ZM28 84h5v5h-5Z" fill="${c.accent}" opacity=".8"/>
      <path d="M97 30l6 3-6 3Z" fill="${c.light}" opacity=".8"/>`;
  }
  if (sprite.variant === 'quack') {
    const bill = sprite.element === 'duck'
      ? `<path d="M52 26c-3-6 0-10 5-10 3 0 5 2 5 5M68 24c3-6 6-8 9-6" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".6"/>`
      : `<ellipse cx="60" cy="78" rx="15" ry="5.6" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/><circle cx="53" cy="76" r="1" fill="${c.deep}" opacity=".6"/><circle cx="67" cy="76" r="1" fill="${c.deep}" opacity=".6"/>`;
    return `${bill}
      <path d="M30 58c-5 3-6 9-2 12 3 2 7 0 8-4" fill="${c.light}" opacity=".55"/>
      <path d="M92 44c2-4 6-5 9-2" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>`;
  }
  if (sprite.variant === 'gem') {
    return `
      <g clip-path="url(#${clipId})" opacity=".5" stroke="${c.light}" stroke-width=".8" fill="none">
        <path d="M60 20L34 62l26 36 26-36Z"/>
        <path d="M60 20v78M34 62h52M44 42l16 20 16-20"/>
      </g>
      <path d="M25 32l1.4 3.6 3.6 1.4-3.6 1.4L25 42l-1.4-3.6-3.6-1.4 3.6-1.4ZM96 68l1.2 3.2 3.2 1.2-3.2 1.2L96 77l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.light}" opacity=".9"/>`;
  }
  if (sprite.variant === 'cheat') {
    return `
      <g clip-path="url(#${clipId})" opacity=".38" stroke="${c.accent}" stroke-width="1" fill="none">
        <path d="M14 40h92M14 58h92M14 76h92M34 22v76M54 22v76M74 22v76M94 22v76"/>
        <path d="M20 32l8 8-8 8M84 70l-8 8 8 8" stroke-width="2"/>
      </g>
      <g fill="${c.light}" opacity=".85">
        <rect x="27" y="46" width="3" height="3"/><rect x="47" y="64" width="3" height="3"/>
        <rect x="67" y="50" width="3" height="3"/><rect x="87" y="76" width="3" height="3"/>
      </g>
      <path d="M98 28l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" fill="${c.accent}" opacity=".95"/>`;
  }
  if (sprite.variant === 'hacker') {
    return `
      <path d="M29 42h62l-4 17H33Z" fill="${c.deep}" stroke="${c.accent}" stroke-width="1.6" opacity=".9"/>
      <path d="M38 50h9M52 50h14M71 50h11" stroke="${c.light}" stroke-width="2" stroke-linecap="round" opacity=".9"/>
      <g clip-path="url(#${clipId})" fill="${c.accent}" opacity=".5">
        <rect x="22" y="62" width="3" height="9"/><rect x="28" y="74" width="3" height="13"/>
        <rect x="91" y="57" width="3" height="7"/><rect x="85" y="70" width="3" height="12"/>
        <rect x="76" y="84" width="3" height="8"/>
      </g>
      <path d="M98 36l1.4 3.6 3.6 1.4-3.6 1.4L98 46l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="${c.light}" opacity=".9"/>`;
  }
  if (sprite.variant === 'hunter') {
    return `
      <g clip-path="url(#${clipId})" opacity=".65">
        <circle cx="60" cy="62" r="38" fill="none" stroke="${c.accent}" stroke-width="1.2" stroke-dasharray="4 6"/>
        <path d="M60 20v14M60 90v14M18 62h14M88 62h14" stroke="${c.light}" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="60" cy="62" r="3" fill="${c.accent}"/>
      </g>
      <path d="M40 34c8-5 17-6 26-3l-3 8c-7-2-13-1-19 3Z" fill="${c.deep}" opacity=".65"/>
      <path d="M92 82l5 5-7 2Z" fill="${c.light}" opacity=".8"/>`;
  }
  if (sprite.variant === 'trick') {
    return `
      <g clip-path="url(#${clipId})" opacity=".55" fill="${c.accent}">
        <path d="M18 30l5 8 8-4-3 9 8 4-9 2 1 9-7-6-7 6 1-9-9-2 8-4-3-9 8 4Z"/>
        <path d="M96 76l4 6 7-3-2 7 7 3-7 2 1 7-6-5-5 5 1-7-7-2 6-3-2-7 6 3Z"/>
      </g>
      <path d="M39 44l7 5-7 5M81 44l-7 5 7 5" stroke="${c.light}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M43 66c6 9 28 9 34 0" stroke="${c.light}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>`;
  }
  if (sprite.variant === 'fortune') {
    return `
      <g clip-path="url(#${clipId})" opacity=".8">
        <circle cx="95" cy="38" r="11" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M95 31l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6Z" fill="${c.light}"/>
        <path d="M20 74c5-9 12-12 19-8-4 1-7 4-8 8 4-2 8-1 11 2-7 3-14 3-22-2Z" fill="${c.light}" opacity=".65"/>
      </g>
      <path d="M32 34l5 8 8-4-3 9 8 4-9 2 1 9-7-6-7 6 1-9-9-2 8-4-3-9 8 4Z" fill="${c.accent}" opacity=".55"/>`;
  }
  if (sprite.variant === 'cursed') {
    return `
      <g clip-path="url(#${clipId})" opacity=".62" fill="${c.accent}">
        <path d="M22 78c-3-8 1-13 7-15-2 6 1 9 6 11-4 4-8 5-13 4ZM98 64c3-7 0-12-6-14 2 5-1 8-6 10 4 4 8 5 12 4Z" opacity=".7"/>
        <path d="M43 45c4-4 10-4 14 0-3 3-3 7 0 10-5 2-10 1-14-2 3-2 3-5 0-8ZM77 45c-4-4-10-4-14 0 3 3 3 7 0 10 5 2 10 1 14-2-3-2-3-5 0-8Z"/>
      </g>
      <path d="M50 67h5v5h-5ZM65 67h5v5h-5ZM53 77h14" stroke="${c.light}" stroke-width="1.6" fill="none" opacity=".8"/>
      <path d="M28 30l1.4 3.6 3.6 1.4-3.6 1.4L28 40l-1.4-3.6-3.6-1.4 3.6-1.4Z" fill="${c.light}" opacity=".85"/>`;
  }
  return '';
}

/* World Kitchen forms each wear a different regional silhouette. They sit on
   the same puffle body, so a striped, dyed, or heavily customised sprite keeps
   its own colours while the new shape reads clearly. */
function cuisineFormMarkup(cuisine, c, layer) {
  if (layer === 'back') {
    if (cuisine === 'africa') {
      return `<g opacity=".92">
        <circle cx="60" cy="56" r="48" fill="none" stroke="${c.accent}" stroke-width="3" stroke-dasharray="15 9" opacity=".5"/>
        <path d="M25 78c-7 10-4 20 4 26 2-8 7-13 14-15Z" fill="${c.accent}" opacity=".55"/>
        <path d="M95 78c7 10 4 20-4 26-2-8-7-13-14-15Z" fill="${c.accent}" opacity=".55"/>
        <path d="M78 92c13 4 20 12 21 21-11 1-19-4-25-12Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      </g>`;
    }
    if (cuisine === 'asia') {
      return `<g opacity=".9">
        <path d="M71 86c16 11 29 9 41-2-7 18-25 24-43 13Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M30 48C17 36 8 37 3 45c9 13 19 18 28 14Z" fill="${c.light}" opacity=".62"/>
        <path d="M32 78c-11 10-21 13-29 8 9-15 20-20 30-18Z" fill="${c.light}" opacity=".48"/>
        <path d="M77 93c15 2 24 9 27 18-10 1-18-3-26-10Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      </g>`;
    }
    if (cuisine === 'middleeast') {
      return `<g opacity=".92">
        <path d="M38 35C23 19 14 17 10 27c4 15 15 24 28 25Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M82 35c15-16 24-18 28-8-4 15-15 24-28 25Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M79 87c14 5 22 14 26 23-12 0-20-5-28-13Z" fill="${c.accent}" opacity=".6"/>
      </g>`;
    }
    if (cuisine === 'europe') {
      return `<g opacity=".94">
        <path d="M45 35C35 20 26 14 17 18c2 10 8 17 17 22M45 35c-2-18-4-27-10-31" fill="none" stroke="${c.accent}" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M75 35c10-15 19-21 28-17-2 10-8 17-17 22M75 35c2-18 4-27 10-31" fill="none" stroke="${c.accent}" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M29 33l-4-6M91 33l4-6M37 25l-2-8M83 25l2-8" stroke="${c.light}" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>
      </g>`;
    }
    if (cuisine === 'latin') {
      return `<g opacity=".9">
        <path d="M78 92c15 4 24 12 29 22-13 2-23-3-31-11Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <g fill="none" stroke="${c.deep}" stroke-width="1.3" opacity=".65">
          <circle cx="25" cy="61" r="3.4"/><circle cx="32" cy="73" r="2.6"/>
          <circle cx="96" cy="58" r="3.2"/><circle cx="90" cy="75" r="2.5"/>
        </g>
        <path d="M23 48c-3-8-8-12-14-12 2 8 6 13 13 15Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M97 48c3-8 8-12 14-12-2 8-6 13-13 15Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.1"/>
      </g>`;
    }
    if (cuisine === 'northamerica') {
      return `<g opacity=".94">
        <path d="M30 49c-5-14 4-24 18-28 6-10 23-11 30-2 11 1 16 10 14 20 8 7 6 18-2 23-4 18-17 27-31 27S33 78 29 67c-4-5-3-13 1-18Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.4" opacity=".72"/>
        <path d="M29 82c5 12 15 19 31 19s26-7 31-19c-10 5-20 7-31 7s-21-2-31-7Z" fill="${c.deep}" opacity=".45"/>
      </g>`;
    }
    if (cuisine === 'caribbean') {
      return `<g opacity=".94">
        <path d="M73 83c4 17 12 28 24 34-2-14-7-26-15-35ZM64 87c-1 17 3 29 12 36 2-14 1-26-4-36ZM82 78c10 13 20 19 32 18-7-11-16-18-27-21Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
        <path d="M74 92c8 8 15 13 24 16" stroke="${c.light}" stroke-width="1.2" fill="none" opacity=".7"/>
      </g>`;
    }
    if (cuisine === 'oceania') {
      return `<g opacity=".92">
        <path d="M32 65C16 51 4 53 2 68c10 10 23 12 33 4Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M88 65c16-14 28-12 30 3-10 10-23 12-33 4Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M77 91c12 4 20 12 23 22-11 0-19-5-26-13Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M18 68c6 4 11 6 17 7M102 68c-6 4-11 6-17 7" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>
      </g>`;
    }
    return '';
  }

  if (cuisine === 'africa') {
    return `<g>
      <path d="M34 42c-8 8-10 19-5 30M86 42c8 8 10 19 5 30" stroke="${c.accent}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M53 39l7 5 7-5M46 72c8 6 20 6 28 0" stroke="${c.light}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M57 48c2 2 4 2 6 0" stroke="${c.deep}" stroke-width="1.4" fill="none"/>
      <circle cx="96" cy="30" r="2.4" fill="${c.accent}" opacity=".9"/>
    </g>`;
  }
  if (cuisine === 'asia') {
    return `<g>
      <path d="M53 29c-3-5-2-10 2-14M67 29c3-5 2-10-2-14" stroke="${c.accent}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      <path d="M45 72c5 3 10 3 15 0M60 72c5 3 10 3 15 0" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".6"/>
      <path d="M41 51c4-4 8-5 12-3M79 51c-4-4-8-5-12-3" stroke="${c.accent}" stroke-width="1.4" fill="none"/>
      <circle cx="34" cy="42" r="2" fill="${c.light}" opacity=".9"/>
    </g>`;
  }
  if (cuisine === 'middleeast') {
    return `<g>
      <path d="M25 37c4 7 8 11 13 13M95 37c-4 7-8 11-13 13" stroke="${c.accent}" stroke-width="1.5" fill="none" opacity=".75"/>
      <path d="M35 75c10 5 40 5 50 0l-3 9c-14 5-30 5-44 0Z" fill="${c.accent}" opacity=".8"/>
      <path d="M42 51c4 3 8 3 12 0M66 51c4 3 8 3 12 0" stroke="${c.light}" stroke-width="1.3" fill="none"/>
      <path d="M60 78l4 7-4 7-4-7Z" fill="${c.light}" opacity=".75"/>
    </g>`;
  }
  if (cuisine === 'europe') {
    return `<g>
      <path d="M51 43l9 7 9-7" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M55 52c3 3 7 3 10 0" stroke="${c.light}" stroke-width="1.4" fill="none"/>
      <path d="M42 28c3-5 7-7 12-6M78 28c-3-5-7-7-12-6" stroke="${c.light}" stroke-width="1.5" fill="none" opacity=".8"/>
      <circle cx="33" cy="56" r="1.8" fill="${c.accent}"/><circle cx="87" cy="56" r="1.8" fill="${c.accent}"/>
    </g>`;
  }
  if (cuisine === 'latin') {
    return `<g>
      <g fill="none" stroke="${c.deep}" stroke-width="1.5">
        <circle cx="43" cy="43" r="3"/><circle cx="77" cy="43" r="3"/>
        <circle cx="39" cy="68" r="2.4"/><circle cx="81" cy="68" r="2.4"/>
      </g>
      <path d="M54 51c2 2 4 2 6 0M63 51c2 2 4 2 6 0" stroke="${c.accent}" stroke-width="1.5" fill="none"/>
      <path d="M48 76c8 5 16 5 24 0" stroke="${c.light}" stroke-width="1.4" fill="none"/>
      <path d="M28 38l-4-6M92 38l4-6" stroke="${c.light}" stroke-width="1.8" stroke-linecap="round"/>
    </g>`;
  }
  if (cuisine === 'northamerica') {
    return `<g>
      <path d="M36 40c-9-2-14 4-13 13 3-5 7-7 13-5M84 40c9-2 14 4 13 13-3-5-7-7-13-5" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M48 75c8 4 16 4 24 0l-2 9c-7 3-13 3-20 0Z" fill="${c.accent}" opacity=".7"/>
      <path d="M45 51c5 2 10 2 15 0M60 51c5 2 10 2 15 0" stroke="${c.deep}" stroke-width="1.3" fill="none" opacity=".65"/>
      <circle cx="60" cy="31" r="2.2" fill="${c.light}"/>
    </g>`;
  }
  if (cuisine === 'caribbean') {
    return `<g>
      <path d="M51 30c-5-8-4-14 1-19 4 5 6 11 3 19M64 29c1-9 5-14 11-16 1 7-1 13-6 18M58 27c-1-8 1-13 5-17" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/>
      <path d="M50 51l10 7 10-7-10 16Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M42 45c4 3 8 3 12 0M66 45c4 3 8 3 12 0" stroke="${c.deep}" stroke-width="1.3" fill="none"/>
      <circle cx="38" cy="61" r="2" fill="${c.accent}" opacity=".85"/>
    </g>`;
  }
  if (cuisine === 'oceania') {
    return `<g>
      <path d="M45 32c-6-6-12-7-17-3 3 6 8 9 14 9M75 32c6-6 12-7 17-3-3 6-8 9-14 9" fill="${c.light}" stroke="${c.deep}" stroke-width="1.2" opacity=".8"/>
      <path d="M45 43c5-4 10-5 15-1M60 42c5-4 10-3 15 1" stroke="${c.accent}" stroke-width="1.5" fill="none"/>
      <path d="M40 72c7 5 15 7 20 7s13-2 20-7" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".7"/>
      <circle cx="34" cy="54" r="1.8" fill="${c.accent}"/><circle cx="86" cy="54" r="1.8" fill="${c.accent}"/>
      <path d="M60 24l3 5-3 5-3-5Z" fill="${c.accent}"/>
    </g>`;
  }
  return '';
}

/* Club Penguin puffle forms keep the Sprite Puffle body and add a coloured
   crest, chest, tail and a small type motif. The coloured layers are painted
   around the face so custom markings and accessories still read. */
function puffleFormMarkup(type, layer) {
  const meta = typeof CP_PUFFLE_TYPES !== 'undefined' ? CP_PUFFLE_TYPES[type] : null;
  if (!meta) return '';
  const p = meta.primary, l = meta.light, d = meta.deep, b = meta.belly, a = meta.accent || l;
  const bands = Array.isArray(meta.bands) ? meta.bands : [p, l, b];

  if (layer === 'back') {
    return `<g opacity=".95">
      <ellipse cx="60" cy="72" rx="43" ry="42" fill="${p}" opacity=".24"/>
      <path d="M30 78c-11 3-17 10-17 20 10 1 18-3 24-11Z" fill="${p}" stroke="${d}" stroke-width="1.2" opacity=".9"/>
      <path d="M90 78c11 3 17 10 17 20-10 1-18-3-24-11Z" fill="${p}" stroke="${d}" stroke-width="1.2" opacity=".9"/>
      <path d="M79 91c12 3 19 9 21 18-9 1-17-2-24-8Z" fill="${p}" stroke="${d}" stroke-width="1.2" opacity=".9"/>
      ${type === 'rainbow' ? bands.map((color, index) => `<path d="M28 ${48 + index * 4}c9-13 55-13 64 0" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".55"/>`).join('') : ''}
    </g>`;
  }

  const crest = type === 'rainbow'
    ? bands.map((color, index) => `<path d="M${37 + index * 9} 31c2-8 5-14 10-18l5 18Z" fill="${color}" stroke="${d}" stroke-width=".9" stroke-linejoin="round"/>`).join('')
    : `<path d="M43 29c4-9 10-13 17-13s13 4 17 13c-7 4-27 4-34 0Z" fill="${p}" stroke="${d}" stroke-width="1.2"/>
       <path d="M50 24c3-4 7-6 11-6" fill="none" stroke="${l}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>`;

  let motif = '';
  if (type === 'blue') {
    motif = `<g transform="translate(60 14)"><path d="M-13 0h26" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="0" r="3.4" fill="${l}" stroke="${d}" stroke-width="1.2"/></g>`;
  } else if (type === 'red') {
    motif = `<path d="M78 28c4-8 16-8 20 0l-2 4H80Z" fill="${d}" stroke="${l}" stroke-width="1"/><path d="M82 28h12" stroke="${l}" stroke-width="1.6" stroke-linecap="round"/>`;
  } else if (type === 'pink') {
    motif = `<path d="M84 26c-5-4-9-2-9 3s4 7 9 3c5 4 9 2 9-3s-4-7-9-3Z" fill="${p}" stroke="${d}" stroke-width="1"/><circle cx="89" cy="29" r="2" fill="${l}"/>`;
  } else if (type === 'black') {
    motif = `<path d="M89 20c-5 6-7 10-3 14 1-3 3-4 4-6 1 2 3 4 3 7 4-4 2-10-4-15Z" fill="${a}" stroke="${d}" stroke-width="1"/>`;
  } else if (type === 'green') {
    motif = `<g fill="${l}" stroke="${d}" stroke-width=".8"><circle cx="86" cy="26" r="3"/><circle cx="92" cy="26" r="3"/><circle cx="86" cy="32" r="3"/><circle cx="92" cy="32" r="3"/></g>`;
  } else if (type === 'purple') {
    motif = `<path d="M89 20l2.4 5.3 5.6.6-4.2 3.8 1.2 5.6-5-2.8-5 2.8 1.2-5.6-4.2-3.8 5.6-.6Z" fill="${l}" stroke="${d}" stroke-width=".8"/>`;
  } else if (type === 'yellow') {
    motif = `<ellipse cx="89" cy="26" rx="8" ry="4" fill="${a}" stroke="${d}" stroke-width="1"/><path d="M89 22c0-3 2-4 4-4" stroke="${d}" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="93" cy="25" r="1.5" fill="${l}" opacity=".9"/>`;
  } else if (type === 'white') {
    motif = `<g stroke="${a}" stroke-width="1.6" stroke-linecap="round"><path d="M89 20v16M82 24l14 8M96 24l-14 8"/></g>`;
  } else if (type === 'orange') {
    motif = `<circle cx="89" cy="29" r="7" fill="${l}" stroke="${d}" stroke-width="1"/><path d="M89 22v14M82 29h14M84 24l10 10M94 24l-10 10" stroke="${p}" stroke-width="1" opacity=".8"/>`;
  } else if (type === 'brown') {
    motif = `<g fill="none" stroke="${d}" stroke-width="1.5"><circle cx="85" cy="28" r="4"/><circle cx="93" cy="28" r="4"/><path d="M89 28h0" stroke-linecap="round"/></g>`;
  } else if (type === 'rainbow') {
    motif = `<path d="M93 11l1.7 4.5 4.7.5-3.6 3 1 4.6-3.8-2.3-3.8 2.3 1-4.6-3.6-3 4.7-.5Z" fill="${l}" stroke="${d}" stroke-width=".8" stroke-linejoin="round"/>`;
  } else if (type === 'gold') {
    motif = `<path d="M80 29l2-10 5 5 4-8 4 8 5-5 2 10Z" fill="${l}" stroke="${d}" stroke-width="1"/><path d="M80 29h20" stroke="${d}" stroke-width="1.2" stroke-linecap="round"/>`;
  }

  return `<g>
    ${crest}
    <path d="M35 57c-6 4-8 10-5 16 4-1 7-4 9-8M85 57c6 4 8 10 5 16-4-1-7-4-9-8" fill="${p}" opacity=".55"/>
    <ellipse cx="60" cy="86" rx="17" ry="12" fill="${b}" opacity=".9"/>
    ${motif}
  </g>`;
}

/* Paired features are drawn once and mirrored about x=60, so a left ear and a
   right ear can never drift apart in the numbers. */
function mirroredFeature(path, fill, stroke, width = 1.2) {
  const paint = `fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"`;
  return `<path d="${path}" ${paint}/><path d="${path}" transform="translate(120 0) scale(-1 1)" ${paint}/>`;
}

/* Species that draw their own mouth. The shared puffle mouth would otherwise
   show through above a snout, a jaw or a beak. */
const CP_CREATURE_OWN_MOUTH = ['dog', 'collie', 'dragon', 'trex', 'triceratops', 'stegosaurus'];

/* Species whose own ears are the ears. The rolled puffle ears at the crown
   would otherwise give a dog four ears, and half of them would read as paws. */
const CP_CREATURE_OWN_EARS = ['cat', 'crystal', 'dog', 'collie', 'rabbit'];

/* The species a form belongs to, or '' for everything that is not a Puffle
   Creature. Mouth and ears both need it, so it is resolved once. */
function cpCreatureSpeciesOf(sprite) {
  const form = sprite && sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  return (form && form.creature) || '';
}

/* A species that draws its own mouth has to carry its own expressions: the
   shared puffle mouth is hidden for it, so a fixed smile would leave a sleeping
   or eating creature looking pleased with itself. Each species passes its own
   line position, curve, colour and tongue, and the shape changes per mood. */
function creatureMouth(expr, spec) {
  const s = spec || {};
  const cx = s.cx === undefined ? 60 : s.cx;
  const cy = s.cy === undefined ? 84 : s.cy;
  const width = s.width === undefined ? 12 : s.width;
  const sag = s.sag === undefined ? 3 : s.sag;
  const color = s.color || '#1d1734';
  const weight = s.weight === undefined ? 1.8 : s.weight;
  const half = width / 2;
  const curve = (depth) => `<path d="M${cx - half + 1} ${cy}q${half - 1} ${depth} ${width - 2} 0" stroke="${color}" stroke-width="${weight}" fill="none" stroke-linecap="round"/>`;
  const open = (depth) => `<path d="M${cx - half} ${cy}q${half} ${depth} ${width} 0z" fill="${color}"/>`;
  let mark;
  if (expr === 'sleep') {
    mark = `<ellipse cx="${cx}" cy="${cy + 1}" rx="2.6" ry="2.8" fill="${color}" opacity=".75"/>`;
  } else if (expr === 'eat') {
    mark = open(half * 1.4);
  } else if (expr === 'happy' || expr === 'love') {
    mark = open(half * 1.1);
  } else if (expr === 'sad') {
    mark = curve(-sag);
  } else if (expr === 'grump') {
    mark = `<path d="M${cx - half + 1} ${cy}h${width - 2}" stroke="${color}" stroke-width="${weight + 0.4}" stroke-linecap="round"/>`;
  } else if (expr === 'dirty') {
    mark = `<path d="M${cx - half} ${cy}q${half / 2} 3 ${half} 0q${half / 2} 3 ${half} 0" stroke="${color}" stroke-width="${weight}" fill="none" stroke-linecap="round"/>`;
  } else {
    mark = curve(sag);
  }
  /* A tongue belongs to a resting or open face, not to sleep or a sulk. */
  const tongue = ['idle', 'happy', 'love', 'eat'].includes(expr) ? (s.tongue || '') : '';
  return mark + tongue;
}

/* Puffle Creatures keep the same Sprite Puffle body as the colour forms, then
   add species ears, tails, horns, masks, and antlers so each one reads as its
   own creature rather than a recolour. */
function puffleCreatureFormMarkup(type, layer, coat, expr = 'idle') {
  const meta = typeof CP_PUFFLE_CREATURES !== 'undefined' ? CP_PUFFLE_CREATURES[type] : null;
  if (!meta) return '';
  /* A canon colourway repaints the species' features; with no coat the species'
     own hand-tuned palette is used. */
  const pal = coat || meta;
  const p = pal.primary, l = pal.light, d = pal.deep, b = pal.belly, a = pal.accent || l;
  /* The mane bands are the species' own colours unless a colourway repaints the
     puffle, in which case they follow the coat too. */
  const bands = Array.isArray(meta.bands) && !coat ? meta.bands : [p, l, a];
  /* The three prehistoric species differ in their heads, frills and plates, but
     they share a mouth, so it is written once. */
  const dinoMouth = (stroke = d) => creatureMouth(expr, { cx: 60, cy: 84, width: 12, sag: 3, color: stroke, weight: 1.8 });
  let back = '';
  let front = '';

  if (type === 'cat') {
    back = `${mirroredFeature('M37 35 43 11 59 25', p, d, 1.5)}
      <path d="M31 81c-11-2-18 5-16 13 2 8 12 8 17 2 4-5 3-11-1-15Z" fill="${p}" stroke="${d}" stroke-width="1.2"/>
      <path d="M86 95c12-3 16-12 10-18-5-5-13-1-11 5 2 4 7 4 9 1" fill="none" stroke="${p}" stroke-width="5" stroke-linecap="round"/>`;
    front = `<path d="M41 31l4-13 10 9M79 31l-4-13-10 9" fill="${a}" opacity=".65"/>
      <path d="M31 68h16M31 74h14M89 68H73M89 74H75" stroke="${d}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`;
  } else if (type === 'dog') {
    /* Floppy ears hang at the cheeks. Behind the body they were buried under
       the fur ruff, so they sit on the front layer and stop above the cheek
       blush instead of painting over it. */
    back = `<path d="M86 96c10-2 15-8 12-13-3-4-9-3-10 2-1 3 2 5 5 4" fill="none" stroke="${p}" stroke-width="4" stroke-linecap="round"/>`;
    front = `${mirroredFeature('M45 34c-12 3-23 12-28 22-3 6 0 12 5 13 6 1 10-5 12-13 2-9 6-17 11-22Z', p, d)}
      ${mirroredFeature('M38 41c-7 3-13 9-15 16-1 4 1 7 5 7 4 0 6-4 7-9 1-6 2-11 3-14Z', l, d, 0.6)}
      <path d="M41 38c-5 4-9 9-11 15" stroke="${d}" stroke-width="1" fill="none" opacity=".38" stroke-linecap="round"/>
      <ellipse cx="60" cy="75" rx="14" ry="9" fill="${b}" opacity=".65"/>
      ${creatureMouth(expr, { cx: 60, cy: 82, width: 8, sag: 4, color: a, weight: 2,
        tongue: `<path d="M58 87c-3-2-6 0-5 3 1 3 5 3 7 1 2 2 6 2 7-1 1-3-2-5-5-3-1 1-3 1-4 0Z" fill="${b}" stroke="${d}" stroke-width="1"/>` })}`;
  } else if (type === 'dragon') {
    /* The wings used to tuck behind the fur ruff, where only two pale slivers
       survived, and the horns were upright triangles that read as cat ears. The
       wings now spread past the fur on both sides, and the horns are short,
       swept back from the temples, so the head reads as a dragon. */
    back = `<path d="M46 52C33 48 19 41 13 30C22 32 27 36 31 42C31 54 36 64 46 72Z" fill="${p}" stroke="${d}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M74 52c16-4 32-11 39-22-10 2-17 6-23 12 0 12-6 22-16 30Z" fill="${p}" stroke="${d}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M42 50C32 44 22 37 14 31M78 50c10-6 20-13 28-19" stroke="${l}" stroke-width="1" opacity=".55" fill="none" stroke-linecap="round"/>
      <path d="M84 96c12 2 17 6 17 10-9 1-16-3-22-9Z" fill="${p}" stroke="${d}" stroke-width="1.2"/>`;
    front = `${mirroredFeature('M42 34c-8-4-14-12-16-22 7 6 12 12 15 17 1 2 2 4 1 5Z', a, d)}
      <g opacity=".85">${creatureMouth(expr, { cx: 60, cy: 76, width: 16, sag: 3, color: l, weight: 1.6 })}</g>`;
  } else if (type === 'crystal') {
    /* Flat, near-white panes read as glass. The left pair sits well outside the
       ear (see the front layer, which draws that ear from the same crystal), so
       the head keeps an ear shape instead of one crystal mass at 44px. */
    back = `<path d="M14 44 18 16 22 24 21 46Z" fill="${l}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M14 16 21 24 20 47 17 46Z" fill="${a}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M38 50 45 40 49 46 44 54Z" fill="${p}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M86 64 92 40 97 48 94 66Z" fill="${a}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M92 40 99 50 96 68 94 66Z" fill="${p}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M84 98c12-1 18-7 20-16-9 2-15 8-20 16Z" fill="${a}" stroke="${d}" stroke-width="1.2"/>`;
    front = `${mirroredFeature('M43 31 25 11 22 28 34 36Z', l, d, 1.4)}
      ${mirroredFeature('M37 27 27 14 26 24 32 29Z', a, d, 0.6)}
      <path d="M20 57 23 43 28 49 26 60Z" fill="${l}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M23 43 30 50 28 61 26 60Z" fill="${a}" stroke="${d}" stroke-width="1.45" stroke-linejoin="round"/>
      <path d="M94 22l1.8 4.4 4.4 1.8-4.4 1.8L94 34l-1.8-4.4-4.4-1.8 4.4-1.8Z" fill="${a}"/>`;
  } else if (type === 'ghost') {
    /* The sheet tail used to curl behind the hem where the fur ruff hid it.
       Three tatters now hang in front of the body, and the drifting orbs stay
       outside the silhouette, so the species reads at 44px. */
    back = `<path d="M84 96c8 4 12 10 9 16-3 5-11 2-9-3 1-3 5-4 8-2" fill="none" stroke="${p}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <circle cx="26" cy="76" r="2.6" fill="${a}" opacity=".6"/>`;
    front = `<g transform="translate(0 4)" opacity=".45">${mirroredFeature('M34 58c-7 5-7 13 0 18 5 4 10 1 9-5-1-5-5-8-9-7', p, 'none')}</g>
      <path d="M43 96c-3 7 0 12 6 15 5-3 7-8 4-16ZM59 98c-3 7 0 13 6 15 5-3 7-9 3-16ZM75 96c-3 7 0 12 5 15 5-3 7-8 3-15Z" fill="${p}" stroke="${d}" stroke-width="1" stroke-linejoin="round" opacity=".9"/>
      <circle cx="89" cy="34" r="3.2" fill="${a}" opacity=".85"/>`;
  } else if (type === 'raccoon') {
    /* The ear triangles were hidden behind the fur ruff and nothing replaced
       them, so the raccoon keeps the shared ears and the ringed tail carries
       the species on its own. */
    back = `<path d="M24 98c-11-2-15-10-9-16 5-5 13-2 12 4-1 4-5 6-8 4" fill="none" stroke="${p}" stroke-width="7" stroke-linecap="round"/>
      <path d="M13 87c3 2 6 2 9 0M14 92c3 2 6 2 9 0M15 97c3 2 6 2 9 0" stroke="${a}" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>`;
  } else if (type === 'deer') {
    /* The cheek patches sat under the ruff and never showed, so the antlers
       alone carry the species. */
    back = `${mirroredFeature('M45 36c-7-9-6-20 1-26 2 6 5 10 9 13', 'none', d, 2.6)}
      ${mirroredFeature('M46 24l-8-6M48 18l-1-7', 'none', d, 2.2)}`;
  } else if (type === 'rabbit') {
    back = `<ellipse cx="45" cy="24" rx="8" ry="15" fill="${p}" stroke="${d}" stroke-width="1.3" transform="rotate(-8 45 24)"/>
      <ellipse cx="75" cy="24" rx="8" ry="15" fill="${p}" stroke="${d}" stroke-width="1.3" transform="rotate(8 75 24)"/>
      <path d="M89 96c10-1 14-7 12-12-2-5-8-4-10 0" fill="none" stroke="${p}" stroke-width="4" stroke-linecap="round"/>`;
    front = `<ellipse cx="45" cy="25" rx="4" ry="11" fill="${a}" opacity=".55" transform="rotate(-8 45 25)"/>
      <ellipse cx="75" cy="25" rx="4" ry="11" fill="${a}" opacity=".55" transform="rotate(8 75 25)"/>
      <path d="M56 73l4 3 4-3-4-2Z" fill="${a}" opacity=".9"/>`;
  } else if (type === 'unicorn') {
    back = `<path d="M83 38c15 0 22 8 19 18-3 9-13 11-17 4" fill="none" stroke="${p}" stroke-width="6" stroke-linecap="round"/>
      ${bands.map((color, index) => `<path d="M80 ${38 + index * 5}c10 1 15 5 14 11" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".8"/>`).join('')}
      <path d="M87 94c10-1 15-6 13-12-2-5-8-4-10 0" fill="none" stroke="${p}" stroke-width="4" stroke-linecap="round"/>`;
    front = `<path d="M60 8l5 22-5 5-5-5Z" fill="${a}" stroke="${d}" stroke-width="1.2"/>
      <path d="M60 12v18" stroke="#FFFFFF" stroke-width="1.6" opacity=".8"/>
      <path d="M83 38c9-1 13 4 12 10" stroke="${p}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${bands.map((color, index) => `<path d="M84 ${40 + index * 4}c5 1 7 3 7 6" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>`).join('')}
      <path d="M88 28l1.8 4 4.4.4-3.3 3 .9 4.2-3.8-2.2-3.8 2.2.9-4.2-3.3-3 4.4-.4Z" fill="${a}" stroke="${d}" stroke-width=".8"/>`;
  } else if (type === 'alien') {
    back = `<ellipse cx="60" cy="112" rx="30" ry="6" fill="${a}" opacity=".22"/>
      ${mirroredFeature('M45 34c-3-12 0-21 5-26', 'none', d, 2.2)}
      <circle cx="49" cy="12" r="4" fill="${a}" stroke="${d}" stroke-width="1"/>
      <circle cx="71" cy="12" r="4" fill="${a}" stroke="${d}" stroke-width="1"/>`;
    front = `<path d="M34 46c8-18 44-18 52 0" fill="none" stroke="${l}" stroke-width="3" opacity=".85" stroke-linecap="round"/>
      <path d="M36 51c14 6 34 6 48 0" fill="none" stroke="${a}" stroke-width="1.6" opacity=".55"/>
      <path d="M53 84c4 3 10 3 14 0" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="88" cy="30" r="2.4" fill="${a}" opacity=".8"/>`;
  } else if (type === 'snowman') {
    back = `<path d="M34 62L16 50M22 55l-6 3M86 62l18-12M98 55l6 3" stroke="${d}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M40 96c-6 6-6 12 0 15 5 3 10-1 8-6-1-3-4-4-7-3M80 96c6 6 6 12 0 15-5 3-10-1-8-6 1-3 4-4 7-3" fill="${l}" opacity=".85"/>`;
    front = `<path d="M60 58l13-4-13-4Z" fill="${a}" stroke="${d}" stroke-width=".9" stroke-linejoin="round"/>
      <circle cx="60" cy="79" r="2.6" fill="${d}"/>
      <circle cx="60" cy="89" r="2.6" fill="${d}"/>
      <path d="M52 86c4 3 12 3 16 0" stroke="${d}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>`;
  } else if (type === 'trex') {
    /* The T-Rex keeps its tail, its right brow crest and its teeth. The old
       crown fin sat entirely under the fur ruff and never showed. */
    back = `<path d="M88 96c12-2 20-9 20-16" fill="none" stroke="${p}" stroke-width="9" stroke-linecap="round"/>`;
    /* The crest starts on the brow and ends past the head outline, so the
       silhouette keeps a spike at collection size instead of a patch that reads
       as part of the skull. */
    front = `<path d="M80 44 97 17 105 30 92 49Z" fill="${a}" stroke="${d}" stroke-width="1.3" stroke-linejoin="round"/>
      ${dinoMouth()}
      <path d="M52 90l2-4M60 90l2-4M68 90l2-4" stroke="${l}" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`;
  } else if (type === 'triceratops') {
    /* The frill fans out at the sides instead of across the face: the body's fur
       ruff hides anything drawn on the head behind it, and a fan over the eyes
       stops the puffle reading. The nose horn sat under the head crest, so it
       is gone and the two brow horns carry the species. */
    back = `<path d="M88 96c12 0 20-6 22-14" fill="none" stroke="${p}" stroke-width="7" stroke-linecap="round"/>`;
    front = `${mirroredFeature('M31 60c-9-13-7-29 4-37-4 13-2 26 3 37Z', l, d)}
      ${mirroredFeature('M31 40 20 12l20 11Z', a, d, 1.3)}
      ${dinoMouth(a)}`;
  } else if (type === 'stegosaurus') {
    /* Three plates ride the right shoulder on the silhouette itself. Plates
       across the crown read as a coronet and fought the head crest, and plates
       inside the outline were swallowed by the fur. */
    back = `<path d="M86 94c12 2 18 8 20 14-8 1-15-2-21-7" fill="${p}" stroke="${d}" stroke-width="1.2"/>`;
    front = `<path d="M79 26 94 16 91 33Z" fill="${a}" stroke="${d}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M94 38 112 36 100 52Z" fill="${a}" stroke="${d}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M101 52 112 56 101 66Z" fill="${a}" stroke="${d}" stroke-width="1" stroke-linejoin="round"/>
      ${dinoMouth(d)}`;
  } else if (type === 'collie') {
    /* The collie's ears were buried behind the ruff; they now sit at the front
       of the brow where they clear the eyes. */
    back = `<path d="M88 94c12 1 18-4 18-11 0-6-6-8-9-3-2 4 0 8 3 8" fill="none" stroke="${p}" stroke-width="5" stroke-linecap="round"/>`;
    front = `${mirroredFeature('M34 35 39 9 53 29Z', p, d, 1.3)}
      ${mirroredFeature('M38 31 41 16 48 27Z', l, d, 0.6)}
      <path d="M52 36c6 8 10 9 16 0" fill="${b}" opacity=".8"/>
      ${creatureMouth(expr, { cx: 61, cy: 84, width: 11, sag: 4, color: d, weight: 1.6,
        tongue: `<path d="M62 86c3 3 3 6 0 7" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>` })}`;

  }

  if (layer === 'back') {
    return `<g opacity="${type === 'ghost' ? '.72' : '.95'}">
      <ellipse cx="60" cy="72" rx="44" ry="43" fill="${p}" opacity=".2"/>
      ${back}
    </g>`;
  }
  return `<g>
    <path d="M35 57c-5 4-7 9-4 14 3-1 6-4 8-8M85 57c5 4 7 9 4 14-3-1-6-4-8-8" fill="${p}" opacity=".45"/>
    <ellipse cx="60" cy="87" rx="17" ry="11" fill="${b}" opacity="${type === 'ghost' ? '.55' : '.9'}"/>
    ${front}
  </g>`;
}

function formMarkup(sprite, c, layer, expr = 'idle') {
  const form = sprite.form;
  if (!form) return '';
  const formMeta = typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[form] : null;
  if (formMeta?.puffle) return puffleFormMarkup(formMeta.puffle, layer);
  if (formMeta?.creature) {
    const coat = typeof cpCreatureArtPalette === 'function' ? cpCreatureArtPalette(sprite) : null;
    return puffleCreatureFormMarkup(formMeta.creature, layer, coat, expr);
  }
  if (formMeta?.cuisine) return cuisineFormMarkup(formMeta.cuisine, c, layer);
  if (layer === 'back') {
    if (form === 'dragon') {
      return `<g opacity=".95">
        <path d="M32 63C16 47 10 30 15 24c9 2 22 13 28 27Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M88 63c16-16 22-33 17-39-9 2-22 13-28 27Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.3"/>
        <path d="M22 31c6 9 11 17 14 26M98 31c-6 9-11 17-14 26" stroke="${c.light}" stroke-width="1.5" fill="none" opacity=".65"/>
        <path d="M78 92c13 2 20 8 22 16-9 2-17-2-24-8Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
      </g>`;
    }
    if (form === 'fairy') {
      return `<g opacity=".8">
        <ellipse cx="29" cy="58" rx="19" ry="28" fill="${c.light}" opacity=".45" transform="rotate(-18 29 58)"/>
        <ellipse cx="91" cy="58" rx="19" ry="28" fill="${c.light}" opacity=".45" transform="rotate(18 91 58)"/>
        <ellipse cx="36" cy="84" rx="13" ry="18" fill="${c.accent}" opacity=".28" transform="rotate(-28 36 84)"/>
        <ellipse cx="84" cy="84" rx="13" ry="18" fill="${c.accent}" opacity=".28" transform="rotate(28 84 84)"/>
      </g>`;
    }
    if (form === 'ghoul') {
      return `<g opacity=".72">
        <path d="M32 80c-4 15 2 24 12 30 8 5 4 11 0 14 14-4 18-15 15-26-2-8 2-15 8-19Z" fill="${c.light}" opacity=".55"/>
        <path d="M88 78c5 14 0 23-9 29-7 5-3 10 1 13-14-3-19-14-16-25 2-8-1-14-7-18Z" fill="${c.light}" opacity=".45"/>
        <circle cx="24" cy="42" r="2.3" fill="${c.accent}" opacity=".8"/>
        <circle cx="97" cy="56" r="1.8" fill="${c.accent}" opacity=".7"/>
      </g>`;
    }
    if (form === 'leviathan') {
      return `<g opacity=".9">
        <path d="M32 68C17 58 7 64 8 78c10 1 20-2 29-8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M88 68c15-10 25-4 24 10-10 1-20-2-29-8Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M79 92c14 2 23 10 26 18-11 1-19-3-27-10Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2"/>
        <path d="M18 70c5 5 10 8 16 9M102 70c-5 5-10 8-16 9" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".65"/>
      </g>`;
    }
    if (form === 'seraph') {
      return `<g opacity=".82">
        <ellipse cx="28" cy="56" rx="17" ry="30" fill="${c.light}" opacity=".4" transform="rotate(-22 28 56)"/>
        <ellipse cx="92" cy="56" rx="17" ry="30" fill="${c.light}" opacity=".4" transform="rotate(22 92 56)"/>
        <ellipse cx="37" cy="82" rx="10" ry="19" fill="${c.accent}" opacity=".28" transform="rotate(-32 37 82)"/>
        <ellipse cx="83" cy="82" rx="10" ry="19" fill="${c.accent}" opacity=".28" transform="rotate(32 83 82)"/>
        <ellipse cx="44" cy="95" rx="7" ry="12" fill="${c.light}" opacity=".22" transform="rotate(-40 44 95)"/>
        <ellipse cx="76" cy="95" rx="7" ry="12" fill="${c.light}" opacity=".22" transform="rotate(40 76 95)"/>
        <circle cx="60" cy="21" r="16" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".7"/>
      </g>`;
    }
    if (form === 'wraith') {
      return `<g opacity=".68">
        <path d="M34 78c-7 13-4 24 5 32 8 7 3 12-2 16 14-3 20-14 17-25-2-8 2-15 9-19Z" fill="${c.light}" opacity=".5"/>
        <path d="M86 76c8 13 5 24-4 31-8 6-3 12 2 15-14-2-20-13-17-24 2-8-2-14-8-18Z" fill="${c.light}" opacity=".4"/>
        <circle cx="23" cy="46" r="2.4" fill="${c.accent}"/><circle cx="98" cy="60" r="1.8" fill="${c.accent}"/>
      </g>`;
    }
    if (form === 'golem') {
      return `<g opacity=".9">
        <path d="M28 61c-8-4-13-1-15 7 1 8 6 13 15 14Z" fill="${c.deep}" opacity=".65"/>
        <path d="M92 61c8-4 13-1 15 7-1 8-6 13-15 14Z" fill="${c.deep}" opacity=".65"/>
        <path d="M34 91c4 7 12 11 26 11s22-4 26-11c-9 3-17 4-26 4s-17-1-26-4Z" fill="${c.deep}" opacity=".5"/>
      </g>`;
    }
    return `<g opacity=".85">
      <circle cx="60" cy="58" r="48" fill="none" stroke="${c.accent}" stroke-width="1.2" stroke-dasharray="3 7" opacity=".55"/>
      <path d="M31 49c-7-4-12-2-16 4 6 1 9 5 11 11" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M89 49c7-4 12-2 16 4-6 1-9 5-11 11" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="22" cy="76" r="3.5" fill="${c.accent}" opacity=".8"/>
      <circle cx="99" cy="38" r="2.8" fill="${c.light}"/>
      <path d="M97 70l4 8-4 8-4-8Z" fill="${c.light}" opacity=".8"/>
    </g>`;
  }
  if (form === 'dragon') {
    return `<g>
      <path d="M41 33c-3-8 1-14 7-17-2 6 1 9 5 11Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M79 33c3-8-1-14-7-17 2 6-1 9-5 11Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M50 26l5-7 4 8 5-8 4 8" stroke="${c.deep}" stroke-width="1.6" fill="none" opacity=".65"/>
    </g>`;
  }
  if (form === 'fairy') {
    return `<g>
      <ellipse cx="60" cy="22" rx="14" ry="4" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".8"/>
      <path d="M28 39l1.5 4 4 1.5-4 1.5L28 50l-1.5-4-4-1.5 4-1.5Z" fill="${c.light}"/>
      <path d="M93 66l1.2 3.2 3.2 1.2-3.2 1.2L93 75l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.accent}"/>
      <circle cx="60" cy="27" r="2" fill="${c.light}"/>
    </g>`;
  }
  if (form === 'ghoul') {
    return `<g>
      <path d="M60 25l5 7-5 7-5-7Z" fill="${c.accent}" opacity=".9"/>
      <path d="M44 77c4 4 8 4 12 0M64 77c4 4 8 4 12 0" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".45"/>
      <path d="M32 34c-4 3-5 7-3 11M88 34c4 3 5 7 3 11" stroke="${c.deep}" stroke-width="1.2" fill="none" opacity=".5"/>
    </g>`;
  }
  if (form === 'leviathan') {
    return `<g>
      <path d="M41 33c-3-8 1-14 7-17-2 6 1 9 5 11Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M79 33c3-8-1-14-7-17 2 6-1 9-5 11Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.2"/>
      <path d="M45 76c5 3 10 3 15 0M60 76c5 3 10 3 15 0" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".5"/>
    </g>`;
  }
  if (form === 'seraph') {
    return `<g>
      <circle cx="60" cy="22" r="12" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".8"/>
      <path d="M25 40l1.5 4 4 1.5-4 1.5L25 51l-1.5-4-4-1.5 4-1.5Z" fill="${c.light}"/>
      <path d="M96 64l1.2 3.2 3.2 1.2-3.2 1.2L96 73l-1.2-3.2-3.2-1.2 3.2-1.2Z" fill="${c.accent}"/>
      <path d="M53 27l7-5 7 5" stroke="${c.light}" stroke-width="1.5" fill="none" opacity=".8"/>
    </g>`;
  }
  if (form === 'wraith') {
    return `<g>
      <path d="M44 28l16 8 16-8-5 13 5 11-16-6-16 6 5-11Z" fill="${c.deep}" opacity=".55"/>
      <path d="M44 77c4 4 8 4 12 0M64 77c4 4 8 4 12 0" stroke="${c.light}" stroke-width="1.3" fill="none" opacity=".45"/>
    </g>`;
  }
  if (form === 'golem') {
    return `<g>
      <path d="M40 34l8 9-5 10M80 34l-8 9 5 10" stroke="${c.light}" stroke-width="1.4" fill="none" opacity=".55"/>
      <path d="M50 77c6 5 14 5 20 0" stroke="${c.accent}" stroke-width="1.4" fill="none"/>
      <circle cx="36" cy="54" r="2" fill="${c.accent}"/><circle cx="84" cy="75" r="2" fill="${c.accent}"/>
    </g>`;
  }
  return `<g>
    <path d="M60 17l6 9-6 7-6-7Z" fill="${c.light}" stroke="${c.deep}" stroke-width="1"/>
    <path d="M43 37c-8-2-13 1-16 7M77 37c8-2 13 1 16 7" stroke="${c.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M48 32l-4-6M72 32l4-6M38 42l-6-2M82 42l6-2" stroke="${c.light}" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
    <circle cx="60" cy="26" r="2.6" fill="${c.accent}"/>
  </g>`;
}

function shinyMarkup(sprite, c, clipId) {
  if (!sprite.shiny) return '';
  return `
    <g clip-path="url(#${clipId})" opacity=".5">
      <path d="M8 58L58 8h14L18 68Z" fill="#ffffff" opacity=".18"/>
      <path d="M48 112L104 50h8L54 118Z" fill="#fff6cc" opacity=".14"/>
    </g>
    <ellipse cx="60" cy="62" rx="47" ry="44" fill="none" stroke="#fff6cc" stroke-width="1" stroke-dasharray="2 7" opacity=".42"/>
    <g fill="#fff6cc">
      <path class="shiny-spark s1" d="M25 34l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2Z"/>
      <path class="shiny-spark s2" d="M96 46l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6-4.6-1.7 4.6-1.7Z"/>
      <path class="shiny-spark s3" d="M91 91l1.4 3.8 3.8 1.4-3.8 1.4-1.4 3.8-1.4-3.8-3.8-1.4 3.8-1.4Z"/>
      <circle class="shiny-spark s2" cx="30" cy="76" r="1.5"/>
      <circle class="shiny-spark s3" cx="84" cy="28" r="1.3"/>
    </g>`;
}

/* Each breed gets its own idle rhythm: winged types hover, ghosts and wisps
   drift, heavy bodies bob. Eggs and sleeping sprites stay still. */
const SPRITE_MOTION_GROUPS = {
  hover: ['puff', 'flit', 'orb', 'star', 'wisp', 'fin', 'pompom', 'dandelion', 'cloud'],
  float: ['ghost', 'cushion', 'blob', 'muff', 'bean', 'bun', 'sprig'],
  bob: ['bigball', 'slab', 'shell', 'lanky', 'drop', 'penguin', 'urchin', 'lantern'],
};

const SPRITE_MOTIONS = ['hover', 'float', 'bob', 'bounce', 'sway', 'spin'];

function spriteMotionHash(breed) {
  let hash = 0;
  for (let i = 0; i < breed.length; i += 1) hash = (hash * 31 + breed.charCodeAt(i)) % 9973;
  return SPRITE_MOTIONS[hash % SPRITE_MOTIONS.length];
}

const SPRITE_MOTION_BY_BREED = Object.keys(SPRITE_MOTION_GROUPS).reduce((map, motion) => {
  SPRITE_MOTION_GROUPS[motion].forEach((breed) => { map[breed] = motion; });
  return map;
}, {});

function spriteMotionFor(sprite, expr) {
  if (!sprite || sprite.stage === 'egg' || expr === 'sleep') return 'still';
  const breed = sprite.breed || '';
  const record = typeof BREEDS !== 'undefined' ? BREEDS[breed] : null;
  if (record && record.speciesPalette && record.speciesPalette !== 'native') {
    return record.wings === false ? 'bob' : 'hover';
  }
  /* Unlisted breeds still get their own rhythm instead of all sharing one. */
  return SPRITE_MOTION_BY_BREED[breed] || spriteMotionHash(breed);
}

/* ---------- per-sprite care animations ----------
   Six states drive a pet's body: idle, sleep, walk, run, drink and eat. Every
   sprite draws its own rhythm for all six out of a stable hash of its identity
   (id, breed, gene, palette, coat, eyes), so two pets of the same breed still
   move differently. The hash picks a motion family, a tempo band inside that
   state's range, an amplitude, a lean and a prop set; the CSS reads them back
   as custom properties, so the animation lives in one place and the variety
   lives on the sprite. */
const SPRITE_ANIM_STATES = ['idle', 'sleep', 'walk', 'run', 'drink', 'eat'];

/* lift/drop/sway are in the 120-unit portrait space; squash is a scale delta. */
/* Amplitudes are in the 120-unit portrait space. A stage pet is drawn around 90
   CSS px, so these are sized to land as several device pixels of travel: at the
   old values the idle bob was under a pixel and read as a still image. */
const SPRITE_ANIM_FAMILIES = {
  hover: { lift: 8.4, drop: 0.6, sway: 2.0, squash: 0.03 },
  float: { lift: 6.4, drop: 2.2, sway: 3.8, squash: 0.04 },
  bob: { lift: 4.6, drop: 4.0, sway: 1.4, squash: 0.025 },
  bounce: { lift: 11.0, drop: 4.6, sway: 0.8, squash: 0.07 },
  sway: { lift: 3.0, drop: 1.6, sway: 5.2, squash: 0.02 },
  spin: { lift: 4.4, drop: 2.0, sway: 2.8, squash: 0.04 },
};

/* Seconds per cycle. Walk and run are step tempos, so their bands are tight
   enough to read as footsteps rather than as floating. */
const SPRITE_ANIM_TEMPO = {
  idle: [2.8, 5.4], sleep: [4.4, 7.6], walk: [0.66, 0.98],
  run: [0.36, 0.54], drink: [0.92, 1.4], eat: [0.74, 1.12],
};

const SPRITE_ANIM_PROP_SETS = {
  sleep: ['blanket', 'cloud', 'moon', 'bubble'],
  eat: ['crumbs', 'sparkle', 'chew', 'hearts'],
  drink: ['straw', 'fizz', 'slurp', 'cup'],
};

function spriteAnimSeed(sprite) {
  const parts = [sprite && sprite.id, sprite && sprite.breed, sprite && sprite.gene,
    sprite && sprite.palette, sprite && sprite.fur, sprite && sprite.eyes, sprite && sprite.stage];
  const text = parts.map((value) => (value == null ? '' : String(value))).join('|');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 100003;
  return hash;
}

function spriteAnimStateFor(sprite, expr, override) {
  if (override && SPRITE_ANIM_STATES.includes(override)) return override;
  /* A care action parks its state on the sprite for a beat. The stage repaints
     on its own schedule, so a state kept only on the DOM node would be wiped by
     the next render; the sprite is the one thing every render reads. */
  if (sprite && sprite.careAnim && SPRITE_ANIM_STATES.includes(sprite.careAnim)
    && (!sprite.careAnimUntil || Date.now() < sprite.careAnimUntil)) return sprite.careAnim;
  if (sprite && sprite.stage === 'egg') return 'idle';
  if (expr === 'sleep') return 'sleep';
  if (expr === 'eat') return 'eat';
  return 'idle';
}

function spriteAnimFamilyFor(sprite) {
  /* Read the family from the breed, not from the expression: a sleeping pet
     keeps its own body rhythm underneath the sleep cycle. */
  const base = spriteMotionFor({ ...(sprite || {}), stage: 'adult' }, 'idle');
  return SPRITE_ANIM_FAMILIES[base] ? base : 'bob';
}

function spriteAnimProfile(sprite, expr, override) {
  const state = spriteAnimStateFor(sprite, expr, override);
  const seed = spriteAnimSeed(sprite);
  const family = spriteAnimFamilyFor(sprite);
  const tune = SPRITE_ANIM_FAMILIES[family];
  const [min, max] = SPRITE_ANIM_TEMPO[state];
  const band = (seed >> 2) % 5;
  const ramp = min + ((max - min) * band) / 4;
  const dur = Number((ramp * (0.94 + ((seed >> 5) % 7) * 0.02)).toFixed(2));
  const amp = Number((0.78 + ((seed >> 7) % 9) * 0.055).toFixed(2));
  const tilt = Number((((seed >> 11) % 11) - 5) * 0.6).toFixed(1);
  const lean = Number((((seed >> 13) % 9) - 4) * 0.5).toFixed(1);
  /* Every state's prop set is chosen up front, so a sprite rendered while
     idling still has its eat and drink props ready when the feed action
     switches the state on the live node. */
  const propsByState = {};
  Object.keys(SPRITE_ANIM_PROP_SETS).forEach((key) => {
    const set = SPRITE_ANIM_PROP_SETS[key];
    propsByState[key] = set[seed % set.length];
  });
  const props = propsByState[state] || '';
  return {
    state, family, tune, seed, dur, amp, tilt, lean, props, propsByState, band,
    lift: Number((tune.lift * amp).toFixed(2)),
    drop: Number((tune.drop * amp).toFixed(2)),
    sway: Number((tune.sway * amp).toFixed(2)),
    squash: Number((tune.squash * amp).toFixed(3)),
    key: `${family}-${band}-${Math.round(amp * 100)}-${props || 'none'}`,
  };
}

function spriteAnimAttrs(profile) {
  return `data-anim="${profile.state}" data-anim-key="${profile.key}" data-anim-family="${profile.family}" data-anim-prop="${profile.props || 'none'}"
    style="--anim-dur:${profile.dur}s;--anim-amp:${profile.amp};--anim-lift:${profile.lift}px;--anim-drop:${profile.drop}px;--anim-sway:${profile.sway}px;--anim-squash:${profile.squash};--anim-tilt:${profile.tilt}deg;--anim-lean:${profile.lean}deg"`;
}

/* Care props are drawn for every pet but only shown in their own state, so the
   feed action can switch data-anim on a live sprite without re-rendering it.
   The variant itself comes from the sprite's hash. */
function carePropsMarkup(profile, c) {
  const light = c.light;
  const accent = c.accent;
  const deep = c.deep;
  const zs = `<g class="care-z">
      <path class="care-z1" d="M86 40h9l-9 8h9" stroke="${light}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="care-z2" d="M98 29h6.5l-6.5 5.6h6.5" stroke="${light}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
      <circle class="care-z3" cx="28" cy="40" r="1.6" fill="${light}" opacity=".8"/>
    </g>`;
  const sleepArt = {
    /* The blanket keeps the original nap art, so its breath and Z cycles still
       apply underneath the per-sprite sleep state. */
    blanket: napPropsMarkup(c),
    cloud: `<g class="care-pillow"><ellipse cx="60" cy="98" rx="38" ry="12" fill="${mix(light, '#ffffff', 0.4)}" opacity=".9"/>
        <ellipse cx="44" cy="96" rx="13" ry="9" fill="${mix(light, '#ffffff', 0.7)}" opacity=".85"/>
        <ellipse cx="74" cy="97" rx="15" ry="9" fill="${mix(accent, '#ffffff', 0.6)}" opacity=".8"/></g>`,
    moon: `<path class="care-moon" d="M92 34a11 11 0 1 0 0 20 13 13 0 1 1 0-20Z" fill="${light}" opacity=".8"/>
      <circle cx="84" cy="58" r="1.3" fill="${light}" opacity=".7"/>`,
    bubble: `<g class="care-bubble"><circle cx="88" cy="40" r="7" fill="none" stroke="${light}" stroke-width="1.6" opacity=".7"/>
        <circle cx="80" cy="54" r="4" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".8"/>
        <circle cx="92" cy="26" r="2.6" fill="${light}" opacity=".55"/></g>`,
  };
  const eatArt = {
    crumbs: `<g class="care-crumbs"><circle cx="72" cy="84" r="1.8" fill="${deep}" opacity=".6"/>
        <circle cx="78" cy="89" r="1.4" fill="${accent}" opacity=".7"/>
        <circle cx="66" cy="90" r="1.2" fill="${light}" opacity=".65"/></g>`,
    sparkle: `<g class="care-spark"><path d="M88 38l1.6 4.4 4.4 1.6-4.4 1.6L88 50l-1.6-4.4L82 44l4.4-1.6Z" fill="${light}" opacity=".85"/>
        <path d="M96 58l1.1 3 3 1.1-3 1.1L96 66l-1.1-3-3-1.1 3-1.1Z" fill="${accent}" opacity=".8"/></g>`,
    chew: `<g class="care-chew"><path d="M66 76q6 5 12 0" stroke="${deep}" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>
        <path d="M70 84q4 3 8 0" stroke="${deep}" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round"/></g>`,
    hearts: `<g class="care-hearts"><path d="M88 40c2-3 6-2 6 1 0 3-6 6-6 6s-6-3-6-6c0-3 4-4 6-1Z" fill="${accent}" opacity=".75"/>
        <path d="M98 56c1.4-2 4-1.4 4 .7 0 2-4 4-4 4s-4-2-4-4c0-2.1 2.6-2.7 4-.7Z" fill="${light}" opacity=".7"/></g>`,
  };
  const drinkArt = {
    straw: `<g class="care-cup"><path d="M74 72h14l-2 18H76Z" fill="${mix(light, '#ffffff', 0.3)}" stroke="${deep}" stroke-width="1.4"/>
        <path d="M81 72l6-14" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M74 78h14" stroke="#fff" stroke-width="1.6" opacity=".55"/></g>`,
    fizz: `<g class="care-fizz"><circle cx="82" cy="70" r="2" fill="${light}" opacity=".75"/>
        <circle cx="88" cy="60" r="1.6" fill="${accent}" opacity=".7"/>
        <circle cx="80" cy="54" r="1.2" fill="${light}" opacity=".6"/></g>`,
    slurp: `<g class="care-slurp"><path d="M78 74q6-3 10 2" stroke="${accent}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>
        <circle cx="92" cy="70" r="1.8" fill="${light}" opacity=".7"/></g>`,
    cup: `<g class="care-mug"><path d="M72 74h16v14a4 4 0 0 1-4 4H76a4 4 0 0 1-4-4Z" fill="${mix(accent, '#ffffff', 0.5)}" stroke="${deep}" stroke-width="1.4"/>
        <path d="M88 78h3a3 3 0 0 1 0 6h-3" fill="none" stroke="${deep}" stroke-width="1.6"/></g>`,
  };
  const pick = (state) => ((profile.propsByState && profile.propsByState[state]) || profile.props || '');
  /* The variant class is namespaced: care-bubble and care-hearts are the art
     groups that twinkle inside, so the wrapper must not share their names or
     the twinkle animation would drive the wrapper's visibility too. */
  const group = (state, art, prop) => (art
    ? `<g class="care-prop care-prop-${state} care-set-${prop}" data-care-prop="${prop}" pointer-events="none">${art}</g>`
    : '');
  const sleepProp = pick('sleep');
  const eatProp = pick('eat');
  const drinkProp = pick('drink');
  /* The blanket art carries its own drifting Zs; the other sets add ours. */
  return `${group('sleep', sleepArt[sleepProp] || zs, sleepProp)}
    ${group('eat', eatArt[eatProp] || eatArt.crumbs, eatProp)}
    ${group('drink', drinkArt[drinkProp] || drinkArt.cup, drinkProp)}`;
}

if (typeof window !== 'undefined') {
  window.SPRITE_ANIM_STATES = SPRITE_ANIM_STATES;
  window.SPRITE_ANIM_TEMPO = SPRITE_ANIM_TEMPO;
  window.SPRITE_ANIM_PROP_SETS = SPRITE_ANIM_PROP_SETS;
  window.spriteAnimProfile = spriteAnimProfile;
  window.spriteAnimAttrs = spriteAnimAttrs;
}

/* The Animal Puffle and turtle guides paint the live sprite body into the same
   120-unit portrait space, so both wrap spriteSVG's inner markup here instead
   of each keeping a copy of the transforms and the svg envelope. */
const PUFFLE_PORTRAIT_FRAME = 'translate(60 55) scale(.78) translate(-60 -62)';

function pufflePortraitMarkup(sprite, behind = '', over = '') {
  const art = spriteSVG(sprite, { still: true, expr: 'happy', vectorOnly: true });
  const inner = art.slice(art.indexOf('>') + 1, art.lastIndexOf('</svg>'));
  return `<svg class="ap-puffle-art" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><g transform="${PUFFLE_PORTRAIT_FRAME}">${behind}${inner}${over}</g></svg>`;
}

function spriteSVG(sprite, opts = {}) {
  /* Pets wearing a Lumi sheet skin animate straight from the pack's frame
     indices; everything else uses the flat 2D starlit vector art. */
  /* vectorOnly lets the generated-sheet renderer draw this same parametric
     body without bouncing back into the sheet path. */
  if (typeof lumiSkinMarkup === 'function' && !opts.vectorOnly) {
    const wearer = typeof lumiOwnedSpriteFor === 'function' ? lumiOwnedSpriteFor(sprite) : sprite;
    const sheet = lumiSkinMarkup(wearer, opts);
    if (sheet) return sheet;
  }
  const c = resolvePalette(sprite);
  const expr = opts.expr || 'idle';
  const stage = sprite.stage === 'egg' ? 'baby' : (sprite.stage || 'baby');
  const scale = STAGE_SCALE[stage] || 1;
  const baby = stage === 'baby' || stage === 'toddler';
  const id = String(sprite.id || 'spr').replace(/[^a-zA-Z0-9_-]/g, '');
  const delay = (id.length % 7) * 0.4 + 0.4;
  const clipId = `clip-${id}`;
  const gradId = `grad-${id}`;
  const isSleeping = expr === 'sleep';
  /* Turn-around views are drawn as real anatomy, not a squashed front: the
     profile keeps one eye, a muzzle and a tail; the back hides the face. */
  const view = opts.view === 'back' ? 'back' : opts.view === 'side' ? 'side' : 'front';
  const backStep = Number(opts.backStep);
  const backTurn = Number(opts.backTurn);
  const faceOff = !!opts.noFace || view === 'back';
  /* A creature that draws its own mouth keeps the shared one off its face. */
  const creature = cpCreatureSpeciesOf(sprite);
  const creatureOwnMouth = CP_CREATURE_OWN_MOUTH.includes(creature);
  const creatureOwnEars = CP_CREATURE_OWN_EARS.includes(creature);

  /* Face and skill are rolled once per sprite from id + breed + gene. */
  const traits = spriteTraits(sprite);
  const eyeStyle = sprite.eyes && sprite.eyes !== 'breed' ? sprite.eyes : traits.eyeStyle;
  const eyes = eyeMarkup(expr, baby, delay, eyeStyle, c);
  /* Species wear the atlas silhouette: round fluff and no element foliage. */
  const speciesBreed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const speciesArt = !!(speciesBreed && speciesBreed.speciesPalette && speciesBreed.speciesPalette !== 'native');
  /* A chosen mouth belongs to the face, so it stays on every expression
     instead of only the idle one (sleep and love keep their own faces). */
  const customMouth = !!(sprite && sprite.mouth && sprite.mouth !== 'breed');
  const styledMouth = (expr === 'idle' || (customMouth && expr !== 'sleep' && expr !== 'love')) ? mouthStyleMarkup(traits.mouth) : '';
  const mouth = creatureOwnMouth ? '' : (styledMouth || mouthMarkup(expr));
  const features = speciesArt ? '' : elementFeature(sprite, c);
  const breed = breedMarkup(sprite, c);
  const arms = speciesArt ? '' : armMarkup(sprite.arms || 'nub', c);
  const legs = legMarkup(sprite.legs || 'breed', sprite.breed, c);
  const accessory = accessoryMarkup(sprite.accessory || 'none', c);
  const aura = typeof spriteAuraMarkup === 'function' ? spriteAuraMarkup(sprite, c) : '';
  const body = bodyPathFor(sprite);
  /* Starlit look: feathered wings, fur tufts, a curled crest, tall glossy eyes,
     heart pads and sparkles, so every sprite wears the master-atlas style. */
  const winged = typeof starlitHasWings === 'function' ? starlitHasWings(sprite) : true;
  /* Round puffle wings are the default silhouette for every winged sprite;
     the old feather blades are gone unless a saved pet still asks for them. */
  const chosenWings = sprite.wings && WING_STYLES[sprite.wings] ? sprite.wings : (winged ? 'round' : 'none');
  const wings = wingMarkup(chosenWings, c, sprite);
  const fluff = furMarkup(sprite.fur, body, c, clipId, sprite, view, expr);
  /* Drifting fluff motes peel off a fluffy coat while it idles or celebrates;
     still frames, sleep, sad and dirty moods skip them. */
  const fluffMotes = (sprite.fur || 'puffle') !== 'smooth' && !opts.still && !isSleeping && expr !== 'sad' && expr !== 'dirty'
    ? `<g class="puff-motes" pointer-events="none">
        <circle cx="18" cy="76" r="2.6" fill="${c.light}" opacity=".7"/>
        <circle cx="100" cy="52" r="2.1" fill="${c.accent}" opacity=".65"/>
        <circle cx="95" cy="96" r="2.8" fill="${c.light}" opacity=".7"/>
        <circle cx="24" cy="100" r="2" fill="${c.accent}" opacity=".6"/>
        <circle cx="61" cy="14" r="2.3" fill="${c.light}" opacity=".7"/>
      </g>`
    : '';
  const ultraFluff = sprite.fur === 'ultra' || sprite.fur === 'dream';
  const giantTail = ultraFluff ? ultraTailMarkup(c, sprite.fur === 'dream', id) : '';
  const dreamTrail = sprite.fur === 'dream' ? dreamTrailMarkup(c) : '';
  const crest = typeof starlitCrestMarkup === 'function' ? starlitCrestMarkup(c) : '';
  const pads = typeof starlitPadsMarkup === 'function' ? starlitPadsMarkup(c) : '';
  const starlitEyes = typeof starlitEyesMarkup === 'function' ? starlitEyesMarkup(expr, baby, delay, c, eyeStyle) : null;
  const eyesFinal = starlitEyes || eyes;
  /* Iris rings carry the rolled eye colour without redrawing the pupils. */
  const irisRing = `<g fill="none" stroke="${traits.iris}" stroke-width="1.7" opacity=".92"><ellipse cx="47" cy="60" rx="${baby ? 9.4 : 8.4}" ry="${baby ? 11.2 : 10}"/><ellipse cx="73" cy="60" rx="${baby ? 9.4 : 8.4}" ry="${baby ? 11.2 : 10}"/></g>`;
  /* True profile and back pieces. */
  const tail = (view === 'side' || view === 'back')
    ? `<path class="turn-tail" d="M22 82c-10 1-15 8-11 15 4 6 13 5 16-2 2-4 2-8-1-11-2-2-3-2-4-2Z" fill="${c.body}" stroke="${c.deep}" stroke-width="1.2" opacity=".97"/>`
    : '';
  const backFur = view === 'back'
    ? `<g class="turn-back" pointer-events="none">
        <path d="M42 46c6-4 12-5 18-4M46 60c5-3 10-3 15-2M50 74c4-2 8-2 12-1" stroke="${c.light}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".7"/>
        <path d="M60 34c4 4 6 9 5 14" stroke="${c.deep}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".3"/>
      </g>`
    : '';
  /* Far-side limbs sit behind the body in a darker fur so the profile reads as
     two arms and two feet, not a flat cut-out. */
  const farArm = opts.farArm || {};
  const nearArm = opts.nearArm || {};
  const farLeg = opts.farLeg || {};
  const nearLeg = opts.nearLeg || {};
  /* Profile keeps only the near arm of the standard art: the far one is hidden
     (the shaded overlay takes its place) and the near arm counter-swings. Legs
     are drawn as a jointed hip-knee-ankle chain, so a footfall bends at the
     knee and flexes at the ankle instead of sliding as one flat ellipse. */
  const poseNear = (markup, pivot) => {
    if (view !== 'side' || !markup) return markup;
    const move = `translate(${Number(nearArm.dx) || 0} ${Number(nearArm.dy) || 0}) rotate(${Number(nearArm.rot) || 0} ${pivot[0]} ${pivot[1]})`;
    return markup
      .replace('<g class="b-arm-l">', '<g class="b-arm-l" style="display:none">')
      .replace('<g class="b-arm-r">', `<g class="b-arm-r" transform="${move}">`);
  };
  const footWear = (style, fill) => {
    const s = style && style !== 'breed' ? style : 'paw';
    if (s === 'boot') {
      return `<g class="turn-wear turn-wear-boot"><path class="turn-boot-foot" d="${BOOT_FOOT_PATH}" fill="${c.accent}" stroke="${c.deep}" stroke-width="1.1"/></g>`;
    }
    if (s === 'stilt') {
      return `<g class="turn-wear turn-wear-stilt"><rect x="-2" y="-14" width="4" height="16" rx="2" fill="${c.body}" stroke="${c.deep}" stroke-width=".9"/><ellipse cx="0" cy="3.4" rx="6.4" ry="3.2" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/></g>`;
    }
    if (s === 'slipper') {
      return `<g class="turn-wear turn-wear-slipper"><ellipse cx="0" cy="2.4" rx="11" ry="6.4" fill="${c.light}" stroke="${c.deep}" stroke-width="1.1"/><circle cx="-8" cy="-1" r="3.2" fill="${c.accent}"/></g>`;
    }
    if (s === 'wheel') {
      return `<g class="turn-wear turn-wear-wheel"><circle cy="2" r="8" fill="${c.deep}"/><circle cy="2" r="3.4" fill="${c.light}"/><circle cy="2" r="8" fill="none" stroke="${c.accent}" stroke-width="1.6"/></g>`;
    }
    if (s === 'stub') {
      return `<g class="turn-wear turn-wear-stub"><ellipse cy="3" rx="9.4" ry="6.2" fill="${c.deep}"/></g>`;
    }
    if (s === 'hopper') {
      return `<g class="turn-wear turn-wear-hopper"><ellipse cy="2.4" rx="11" ry="6.4" fill="${fill}" stroke="${c.deep}" stroke-width="1.1"/><ellipse cx="-4" cy="0.6" rx="3.6" ry="2.2" fill="${c.light}"/></g>`;
    }
    if (s === 'long') {
      return `<g class="turn-wear turn-wear-long"><ellipse cy="3" rx="8" ry="4.4" fill="${c.deep}"/><path d="M-4 -6 h8" stroke="${c.light}" stroke-width="1.6" opacity=".5"/></g>`;
    }
    if (s === 'crab') {
      return `<g class="turn-wear turn-wear-crab"><path d="M-4 -2 L-11 4 M0 -2 L-6 6 M4 -2 L1 7" stroke="${c.deep}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
    }
    return `<g class="turn-wear turn-wear-paw"><ellipse cy="2.4" rx="8.6" ry="4.8" fill="${fill}" stroke="${c.deep}" stroke-width="1.1"/><ellipse cy="2.6" rx="3.6" ry="2.2" fill="${c.light}" opacity=".45"/></g>`;
  };
  const legChain = (pose, hipX, cls, fill, style) => {
    const thigh = Number(pose.thigh) || 0;
    const shin = Number(pose.shin) || 0;
    const foot = Number(pose.foot) || 0;
    const rad = Math.PI / 180;
    const hipY = 80;
    const kneeX = hipX + Math.sin(thigh * rad) * 10;
    const kneeY = hipY + Math.cos(thigh * rad) * 10;
    const ankleX = kneeX + Math.sin((thigh + shin) * rad) * 9;
    const ankleY = kneeY + Math.cos((thigh + shin) * rad) * 9;
    const path = `M${hipX.toFixed(2)} ${hipY} L${kneeX.toFixed(2)} ${kneeY.toFixed(2)} L${ankleX.toFixed(2)} ${ankleY.toFixed(2)}`;
    const footY = ankleY + 2.2;
    const wear = style && style !== 'breed' ? style : 'paw';
    /* Foot contact. The sole sits on the shadow line instead of inheriting
       the shin's height, and the foot rolls over a heel or toe pivot so a
       heel-strike plants the heel and a toe-off keeps the toe down. */
    const FOOT_SOLE = { boot: 5.2, slipper: 8.8, stilt: 6.6, wheel: 10, stub: 9.2, hopper: 8.8, long: 7.4, crab: 7, paw: 7.2 };
    const soleY = FOOT_SOLE[wear] || 7.2;
    const groundY = 106;
    const planted = ankleY > 94;
    const contactY = planted
      ? footY + Math.max(-4, Math.min(4, (groundY - soleY) - footY))
      : footY;
    const rollPivotX = foot >= 0 ? (wear === 'wheel' ? 8 : 10.6) : -8.5;
    const roll = Math.abs(foot) < 0.5 ? 'flat' : foot > 0 ? 'toe' : 'heel';
    const footTransform = `translate(${ankleX.toFixed(2)} ${contactY.toFixed(2)}) translate(${rollPivotX} ${soleY}) rotate(${foot.toFixed(1)}) translate(${-rollPivotX} ${-soleY})`;
    /* Boots, long legs and stilts cover the shin itself, drawn as a capsule
       along the knee-to-ankle run so they read knee-high rather than a cuff
       floating at the ankle. */
    const shinWear = (s) => {
      if (s !== 'boot' && s !== 'long' && s !== 'stilt') return '';
      const midX = (kneeX + ankleX) / 2;
      const midY = (kneeY + ankleY) / 2;
      const angle = (thigh + shin).toFixed(1);
      if (s === 'boot') {
        return `<g class="turn-shin turn-shin-boot" transform="translate(${midX.toFixed(2)} ${midY.toFixed(2)}) rotate(${angle})">
          <path d="M-3.8 -6.4h7.6c1 2.6 1.4 5.6 1.1 8.2-.2 1.5-1.3 2.3-2.7 2.3h-4.4c-1.4 0-2.5-.8-2.7-2.3-.3-2.6.1-5.6 1.1-8.2Z" fill="${c.accent}" stroke="${c.deep}" stroke-width="1"/>
          <path class="turn-fold" d="M-3.4 1.6c.8.9 1.2 1.7 1 2.5" stroke="${c.deep}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".42"/>
          ${bootTrimMarkup(c, { cuffX: -5.2, cuffY: -8.6, cuffW: 10.4, cuffH: 4.2, strapX: -4.7, strapY: -2.4, strapW: 9.4, strapH: 3.2, buckleX: 1.5, buckleY: -2.4, buckleW: 4.4, buckleH: 4.8 })}
        </g>`;
      }
      if (s === 'long') {
        return `<g class="turn-shin turn-shin-long" transform="translate(${midX.toFixed(2)} ${midY.toFixed(2)}) rotate(${angle})"><rect x="-3.2" y="-5.6" width="6.4" height="11.2" rx="3.2" fill="${fill}" stroke="${c.deep}" stroke-width=".9" opacity=".92"/></g>`;
      }
      return `<g class="turn-shin turn-shin-stilt" transform="translate(${midX.toFixed(2)} ${midY.toFixed(2)}) rotate(${angle})"><rect x="-1.3" y="-5.8" width="2.6" height="11.6" rx="1.3" fill="${fill}" stroke="${c.deep}" stroke-width=".8"/></g>`;
    };
    return `<g class="${cls}" pointer-events="none">
      <path d="${path}" fill="none" stroke="${c.deep}" stroke-width="8.4" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
      <path d="${path}" fill="none" stroke="${fill}" stroke-width="6.6" stroke-linecap="round" stroke-linejoin="round"/>
      ${wear === 'boot' ? '' : `<circle cx="${kneeX.toFixed(2)}" cy="${kneeY.toFixed(2)}" r="3.2" fill="${fill}" stroke="${c.deep}" stroke-width="1"/>`}
      <g class="turn-foot turn-foot-${roll}" data-roll="${roll}" transform="${footTransform}">${footWear(wear, fill)}</g>
      ${shinWear(wear)}
    </g>`;
  };
  const farLegMarkup = view === 'side' ? legChain(farLeg, 56, 'turn-leg-far', mix(c.body, c.deep, 0.38), sprite.legs || 'breed') : '';
  const nearLegMarkup = view === 'side' ? legChain(nearLeg, 65, 'turn-leg-near', c.body, sprite.legs || 'breed') : '';
  const armsFinal = poseNear(arms, [92, 72]);
  const legsFinal = view === 'front' ? `<g class="turn-front-legs">${legs}</g>` : '';
  const farLimbs = view === 'side'
    ? `<g class="turn-far" pointer-events="none">
        <g class="turn-far-arm" transform="translate(${Number(farArm.dx) || 0} ${Number(farArm.dy) || 0}) rotate(${Number(farArm.rot) || 0} 27 76)">
          <ellipse cx="27" cy="76" rx="6.8" ry="9.8" fill="${mix(c.body, c.deep, 0.42)}" stroke="${c.deep}" stroke-width="1.1" opacity=".95"/>
        </g>
      </g>`
    : '';
  /* Back markings: a spine ridge with shoulder and haunch patches, clipped to
     the body so they never spill past the silhouette. */
  const backMarkings = view === 'back'
    ? `<g class="turn-markings" clip-path="url(#${clipId})" pointer-events="none">
        <path d="M60 30c-3 12-3 24 0 36s3 20 0 30" stroke="${mix(c.body, c.deep, 0.35)}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".35"/>
        <ellipse cx="45" cy="57" rx="7" ry="4" fill="${mix(c.body, c.deep, 0.32)}" opacity=".42"/>
        <ellipse cx="76" cy="65" rx="6" ry="3.4" fill="${mix(c.body, c.deep, 0.32)}" opacity=".38"/>
        <ellipse cx="47" cy="84" rx="8" ry="4.6" fill="${mix(c.body, c.deep, 0.28)}" opacity=".38"/>
        <ellipse cx="74" cy="92" rx="6.4" ry="3.6" fill="${mix(c.body, c.deep, 0.28)}" opacity=".34"/>
      </g>`
    : '';
  /* Flank stripes on the profile: the same family of markings as the back. */
  const sideMarkings = view === 'side'
    ? `<g class="turn-flank" clip-path="url(#${clipId})" pointer-events="none">
        <path d="M64 48c7 4 9 10 6 16" stroke="${mix(c.body, c.deep, 0.34)}" stroke-width="4.2" fill="none" stroke-linecap="round" opacity=".32"/>
        <ellipse cx="52" cy="82" rx="11" ry="6" fill="${mix(c.body, c.deep, 0.3)}" opacity=".32"/>
      </g>`
    : '';
  const sideMuzzle = view === 'side' ? `<ellipse cx="84" cy="71" rx="8.6" ry="6.6" fill="${c.light}" opacity=".85"/>` : '';
  const sideEye = `<g class="b-eye" style="animation-delay:${delay}s">
      <ellipse cx="73" cy="59.5" rx="${baby ? 8.4 : 7.6}" ry="${baby ? 10.8 : 9.8}" fill="#fdfbff"/>
      <ellipse cx="73" cy="59.5" rx="${baby ? 8.4 : 7.6}" ry="${baby ? 10.8 : 9.8}" fill="none" stroke="#241540" stroke-width="1.7"/>
      <ellipse cx="73" cy="60.4" rx="${baby ? 5.4 : 4.8}" ry="${baby ? 7.4 : 6.6}" fill="${traits.iris}"/>
      <ellipse cx="73" cy="61.2" rx="${baby ? 2.6 : 2.2}" ry="${baby ? 4 : 3.6}" fill="#1c1030"/>
      <circle cx="75.4" cy="55" r="${baby ? 2.8 : 2.5}" fill="#ffffff"/>
    </g>`;
  const sideMouth = `<ellipse cx="81" cy="74.5" rx="3.4" ry="4" fill="#1d1734"/><ellipse cx="81" cy="76.4" rx="1.9" ry="1.5" fill="#ff8fa3"/>`;
  const sideNose = `<ellipse cx="88" cy="70.5" rx="2.6" ry="1.9" fill="${c.deep}" opacity=".55"/>`;
  const starlitFx = typeof starlitSparkleMarkup === 'function' ? starlitSparkleMarkup(sprite) : '';
  const shade = typeof starlitShadeMarkup === 'function' ? starlitShadeMarkup(sprite, c, body, clipId) : '';
  const motion = spriteMotionFor(sprite, expr);
  const anim = spriteAnimProfile(sprite, expr, opts.anim);
  /* A still render is a list thumbnail: it never switches state, so it carries
     neither the care prop groups nor the inline timing variables. A roster of a
     hundred rows would otherwise hold three extra groups and a style attribute
     per row for motion nobody sees. */
  const stillArt = !!opts.still;
  const earStyle = sprite.ears && sprite.ears !== 'breed' ? sprite.ears : traits.ears;
  const ears = speciesArt || creatureOwnEars ? '' : earMarkup(earStyle, c);
  const headStyle = sprite.head && sprite.head !== 'breed' ? sprite.head : traits.head;
  const head = HEAD_SHAPES[headStyle] || HEAD_SHAPES.breed;
  const headDrop = Number(head.dy) || 0;
  const headTransform = head.sx === 1 && head.sy === 1 && !headDrop ? '' : `translate(60 ${72 + headDrop}) scale(${head.sx} ${head.sy}) translate(-60 -72)`;

  const sparkle = ['highadult', 'elder', 'ancient', 'sensei'].includes(stage)
    ? `<g fill="${c.light}" opacity=".9">
        <path d="M26 29l1.3 3.6L31 34l-3.7 1.4L26 39l-1.3-3.6L21 34l3.7-1.4z"/>
        <path d="M96 68l1 2.8 2.8 1-2.8 1L96 76l-1-2.8-2.8-1 2.8-1z"/>
      </g>` : '';
  /* Collection species keep the chart's signature look: a per-style headpiece,
     aura and element badge, so the 91 sheet styles are not colour swaps of one
     silhouette. Only chart species carry collectionTier; ordinary pets skip it. */
  const styleKey = typeof lumiPuffleStyleOfSprite === 'function' ? lumiPuffleStyleOfSprite(sprite) : (sprite && sprite.puffleVariant);
  const styleMeta = styleKey && typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS ? window.LUMI_PUFFLE_VARIANTS[styleKey] : null;
  const styleElement = ELEMENTS[sprite.element];
  const styleArt = styleMeta && styleElement && styleElement.collectionTier && typeof puffleStyleArt === 'function'
    ? puffleStyleArt(styleKey, c, { view, element: styleElement.puffleElement || styleElement.collectionTier, stage })
    : null;

  const animClass = stillArt ? '' : ` anim-${anim.state} anim-family-${anim.family}`;
  const animAttrs = stillArt ? '' : ` ${spriteAnimAttrs(anim)}`;
  return `<svg class="sprite-motion motion-${motion}${animClass}" data-motion="${motion}"${animAttrs}${sprite.fur === 'dream' ? ' data-dream="1"' : ''} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="${c.light}"/>
        <stop offset="0.45" stop-color="${c.body}"/>
        <stop offset="1" stop-color="${mix(c.body, c.deep, 0.45)}"/>
      </linearGradient>
      <clipPath id="${clipId}"><path d="${body}"/></clipPath>
      ${ultraFluff && sprite.fur === 'dream' ? `<radialGradient id="neb-${id}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${mix(c.light, '#ffffff', 0.6)}"/><stop offset=".55" stop-color="${c.accent}"/><stop offset="1" stop-color="${mix(c.body, c.deep, 0.55)}"/></radialGradient>` : ''}
    </defs>
    <ellipse cx="60" cy="104" rx="${['highadult', 'elder', 'ancient', 'sensei'].includes(stage) ? 31 : 25}" ry="5" fill="#000" opacity=".22"/>
    <g transform="translate(60 70) scale(${scale}) translate(-60 -70)">
      ${isSleeping ? `<g transform="rotate(-6 60 70)">` : '<g>'}
      ${aura}
      ${wings}
      ${styleArt ? styleArt.back : ''}
      ${formMarkup(sprite, c, 'back', expr)}
      ${farLimbs}
      ${farLegMarkup}
      ${tail}
      ${giantTail}
      ${dreamTrail}
      ${ears ? (view === 'side' ? `<g transform="translate(7 10)">${ears}</g>` : `<g transform="translate(60 50) scale(1.14 1) translate(-60 -44)">${ears}</g>`) : ''}
      ${breed}
      ${legsFinal}
      <g${headTransform ? ` transform="${headTransform}"` : ''}>
        <path d="${body}" fill="url(#${gradId})"/>
        ${backMarkings}
        ${sideMarkings}
        ${patternMarkup(sprite, c, clipId)}
        ${shade}
        <path d="${body}" fill="none" stroke="${c.deep}" stroke-width="1.2" opacity=".22"/>
        ${fluff}
        ${fluffMotes}
        ${backFur}
      </g>
      ${view === 'back' ? backWearMarkup(sprite.legs || 'breed', c, sprite.breed, backStep, backTurn) : ''}
      ${nearLegMarkup}
      ${armsFinal}
      ${ultraFluff ? ultraTailTipMarkup(c, sprite.fur === 'dream', id) : ''}
      ${view === 'back' || sprite.legs === 'boot' ? '' : pads}
      ${sprite.hair && sprite.hair !== 'none' ? hairCoverMarkup(body, clipId, c) : ''}
      ${hairMarkup(sprite.hair || 'none', c)}
      ${crest}
      ${styleArt ? styleArt.front : ''}
      ${scarfMarkup(sprite.scarf || 'none', c)}
      ${faceOff ? '' : view === 'side' ? `<ellipse cx="58" cy="72" rx="5.6" ry="3.2" fill="#ff8fb2" opacity=".4"/>` : `<ellipse cx="38" cy="72" rx="6.4" ry="3.6" fill="#ff8fb2" opacity=".4"/><ellipse cx="82" cy="72" rx="6.4" ry="3.6" fill="#ff8fb2" opacity=".4"/>`}
      ${view === 'front' && !faceOff ? puffleFaceMarkup(c, sprite) : ''}
      ${sideMuzzle}
      <g transform="${view === 'side' ? 'translate(4 0)' : 'translate(0 0)'}">${view === 'side' ? sideEye : (faceOff ? '' : eyesFinal)}
      ${view === 'side' || faceOff ? '' : irisRing}
      <g class="sprite-mouth">${view === 'side' ? sideMouth : (faceOff ? '' : mouth)}</g>
      ${view === 'side' ? sideNose : (faceOff ? '' : noseMarkup(sprite.nose || 'none', c))}</g>
      ${ultraFluff ? ultraForelockMarkup(c) : ''}
      ${stillArt ? '' : carePropsMarkup(anim, c)}
      ${features}
      ${finishMarkup(sprite, c, clipId, !!features)}
      ${shinyMarkup(sprite, c, clipId)}
      ${formMarkup(sprite, c, 'front', expr)}
      ${customOutfitMarkup(sprite, c, clipId)}
      ${hatMarkup(sprite.hat || 'none', c)}
      ${accessory}
      ${sparkle}
      ${starlitFx}
      </g>
    </g>
  </svg>`;
}

/* ---------- egg art ---------- */
function eggSVG(sprite, opts = {}) {
  const c = resolvePalette(sprite);
  const progress = clamp(opts.progress || 0, 0, 100);
  const id = String(sprite.id || 'egg').replace(/[^a-zA-Z0-9_-]/g, '');
  const gradId = `egggrad-${id}`;
  const clipId = `eggclip-${id}`;
  const rarityKey = sprite && sprite.element && typeof rarityTierWithBoost === 'function'
    ? rarityTierWithBoost(sprite.element, sprite.rarityBoost)
    : (sprite && (sprite.rarity || sprite.eggRarity)) || null;
  const rarity = rarityKey && typeof TYPE_EGG_RARITIES !== 'undefined' ? TYPE_EGG_RARITIES[rarityKey] : null;
  const rarityColor = rarity ? rarity.color : c.deep;
  const rarityStops = rarity && Array.isArray(rarity.stops) && rarity.stops.length ? rarity.stops : [c.light, c.body, darken(c.body, 0.18)];
  const rarityGradId = `eggrarity-${id}`;
  const shell = 'M60 16c20 0 33 25 33 50 0 21-14 34-33 34S27 87 27 66c0-25 13-50 33-50Z';
  const cracks = progress >= 35 ? `
    <path d="M60 46l-7 9 8 5-5 8" stroke="${c.deep}" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>
  ` : '';
  const cracks2 = progress >= 70 ? `
    <path d="M34 62l9 4-3 7M86 56l-9 6 4 6" stroke="${c.deep}" stroke-width="1.7" fill="none" opacity=".5" stroke-linecap="round"/>
  ` : '';
  const cracks3 = progress >= 92 ? `
    <path d="M42 86l7-7 6 4M78 82l-6-6" stroke="${c.deep}" stroke-width="1.8" fill="none" opacity=".6" stroke-linecap="round"/>
  ` : '';
  return `<svg class="egg-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-rarity="${rarityKey || ''}" data-shiny="${sprite.shiny ? '1' : '0'}">
    <defs>
      <linearGradient id="${gradId}" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="${c.light}"/>
        <stop offset="0.55" stop-color="${c.body}"/>
        <stop offset="1" stop-color="${darken(c.body, 0.18)}"/>
      </linearGradient>
      <linearGradient id="${rarityGradId}" x1="0" y1="0" x2="1" y2="1">
        ${rarityStops.map((stop, i) => `<stop offset="${(i / Math.max(1, rarityStops.length - 1)).toFixed(2)}" stop-color="${stop}"/>`).join('')}
      </linearGradient>
      <clipPath id="${clipId}"><path d="${shell}"/></clipPath>
    </defs>
    <ellipse cx="60" cy="103" rx="26" ry="5" fill="#000" opacity=".22"/>
    <path d="${shell}" fill="url(#${gradId})" stroke="${rarityColor}" stroke-width="1.3" opacity=".98"/>
    ${rarity ? `<path d="${shell}" fill="url(#${rarityGradId})" opacity=".22" pointer-events="none"/>` : ''}
    <g clip-path="url(#${clipId})" opacity=".5">
      ${patternMarkup({ pattern: opts.pattern || sprite.pattern || 'spots' }, c, clipId)}
    </g>
    <ellipse cx="46" cy="40" rx="9" ry="14" fill="#fff" opacity=".4" transform="rotate(-24 46 40)"/>
    <circle cx="76" cy="52" r="3.2" fill="#fff" opacity=".28"/>
    <circle cx="44" cy="78" r="2.2" fill="#fff" opacity=".22"/>
    ${cracks}${cracks2}${cracks3}
    ${progress >= 100 ? `<g><path d="M45 34l8 7-4 6 7 5" stroke="${c.deep}" stroke-width="2.4" fill="none" opacity=".8"/></g>` : ''}
    ${rarity ? `<g opacity=".8"><circle cx="33" cy="53" r="1.8" fill="${rarityColor}"/><circle cx="88" cy="73" r="1.4" fill="${rarityColor}"/><path d="M78 31l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="${rarityColor}"/></g>` : ''}
    ${shinyMarkup(sprite, c, clipId)}
  </svg>`;
}

/* Expression derived from current state, for ambient sprites. */
function expressionFor(sprite) {
  if (!sprite) return 'idle';
  if (sprite.stage === 'egg') return 'idle';
  if (sprite.asleep) return 'sleep';
  /* A sick sprite looks under the weather even when its needs are not low. */
  if (sprite.illness) return 'grump';
  const n = sprite.needs || {};
  const mood = moodOf(sprite);
  if ((n.clean ?? 100) < 25) return 'dirty';
  if ((n.hunger ?? 100) < 18) return 'sad';
  if ((n.energy ?? 100) < 16) return 'grump';
  if (mood.key === 'radiant' || mood.key === 'happy') return 'happy';
  /* Newer care feelings reuse the existing faces: the nose and the eyes are
     drawn per expression, so a new name without new art would look wrong. */
  if (mood.key === 'pampered' || mood.key === 'giddy') return 'happy';
  if (mood.key === 'lonely' || mood.key === 'peckish') return 'sad';
  if (mood.key === 'grumpy') return 'grump';
  if (mood.key === 'restless') return 'sad';
  return 'idle';
}

/* ---------- rolled traits: eyes, ears, head, mouth, skill ---------- */
/* Every sprite rolls its face and skill once from its own id, breed and gene:
   the same sprite always looks the same, while two sprites of one breed differ.
   Chance decides the exact pick, the breed decides the pool. */
const TRAIT_IRISES = ['#F2A33C', '#4FC3F7', '#8BC34A', '#FF6B9D', '#B388FF', '#FFD166',
  '#26C6DA', '#FF5252', '#66BB6A', '#AB47BC', '#FFA726', '#42A5F5', '#EC407A',
  '#9CCC65', '#7E57C2', '#FFCA28', '#26A69A', '#EF6C00'];

const TRAIT_MOUTHS = ['cat', 'open', 'blep', 'fang', 'wave', 'dot'];

/* The mouth is a player choice as well as a roll: 'breed' means "use the
   rolled face", every other key pins that expression until it is reset. */
const MOUTH_STYLES = {
  breed: { name: 'Rolled', icon: '\u{1F3B2}' },
  cat: { name: 'Cat', icon: '\u{1F431}' },
  open: { name: 'Open', icon: '\u{1F62E}' },
  blep: { name: 'Blep', icon: '\u{1F61C}' },
  fang: { name: 'Fangs', icon: '\u{1F9B7}' },
  wave: { name: 'Wavy', icon: '\u{3030}' },
  dot: { name: 'Dot', icon: '\u2022' },
};
const MOUTH_STYLE_KEYS = Object.keys(MOUTH_STYLES);

const TRAIT_SKILLS = [
  { name: 'Keen Eye', icon: '\u{1F441}', desc: 'Reads a rival’s opening move a beat early.' },
  { name: 'Soft Step', icon: '\u{1F43E}', desc: 'Crosses the Hollow without waking anyone.' },
  { name: 'Warm Glow', icon: '\u{2728}', desc: 'Fur gives off a faint, steady light at night.' },
  { name: 'Quick Nose', icon: '\u{1F443}', desc: 'Finds buried treats a full sniff sooner.' },
  { name: 'Sturdy Puff', icon: '\u{1F6E1}', desc: 'Shrugs off a tumble and keeps its shape.' },
  { name: 'Songbird', icon: '\u{1F3B6}', desc: 'Hums a tune that settles nervous neighbours.' },
  { name: 'Lucky Tuft', icon: '\u{1F340}', desc: 'Odd little things tend to happen near it, in its favour.' },
  { name: 'Deep Nap', icon: '\u{1F4A4}', desc: 'Recovers its energy faster than most.' },
  { name: 'Ember Dash', icon: '\u{1F525}', desc: 'Darts forward in a trail of warm sparks.' },
  { name: 'Riptide Roll', icon: '\u{1F30A}', desc: 'Rolls with a current instead of against it.' },
  { name: 'Frost Focus', icon: '\u{2744}', desc: 'Slows the moment down to line up a shot.' },
  { name: 'Static Pounce', icon: '\u{26A1}', desc: 'Bounces on a little stored static.' },
  { name: 'Root Guard', icon: '\u{1F33F}', desc: 'Plants its paws and refuses to move.' },
  { name: 'Gale Glide', icon: '\u{1F343}', desc: 'Catches a breeze and slips sideways.' },
  { name: 'Moonbeam Mend', icon: '\u{1F319}', desc: 'Hums a soft note that settles the whole Hollow.' },
  { name: 'Prism Flash', icon: '\u{1F48E}', desc: 'Scatters light into a dazzling flash.' },
  { name: 'Shade Step', icon: '\u{1F311}', desc: 'Steps between shadows without a sound.' },
  { name: 'Star Song', icon: '\u{2B50}', desc: 'Sings the old star-charts back to life.' },
  { name: 'Spore Bloom', icon: '\u{1F344}', desc: 'Trails spores that make a good snack last longer.' },
  { name: 'Gear Tinker', icon: '\u{2699}', desc: 'Fixes tiny things while nobody is looking.' },
  { name: 'Encore', icon: '\u{1F3B5}', desc: 'Always has one more song ready.' },
  { name: 'Dragon Guard', icon: '\u{1F409}', desc: 'Braces like a tiny fortress.' },
];

function spriteTraitSeed(sprite) {
  const geneSource = sprite && sprite.gene;
  const gene = geneSource ? (typeof geneSource === 'string' ? geneSource : (geneSource.name || '')) : '';
  const text = `${(sprite && sprite.id) || 'spr'}|${(sprite && sprite.breed) || ''}|${gene}`;
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function spriteTraits(sprite) {
  const seed = spriteTraitSeed(sprite);
  const ears = Object.keys(EAR_STYLES).filter((k) => k !== 'breed');
  const heads = HEAD_SHAPE_KEYS.filter((k) => k !== 'breed');
  const eyes = EYE_STYLE_KEYS.slice();
  /* Breeds with a strong silhouette keep their signature feature: a Sprig keeps
     tall ears, a Horn keeps horns — chance varies the rest of the face. */
  const breed = sprite && sprite.breed;
  const earBias = { sprig: 'tall', horn: 'horn', flit: 'fin', floof: 'round', seal: 'round', goat: 'deer' };
  /* Player choices beat the roll. Studio writes eyes, mouth and iris onto the
     sprite, and every face consumer (card, sheet, vector art) reads them back
     through this one function, so a custom face never drifts out of sync. */
  const chosenEyes = sprite && typeof sprite.eyes === 'string' && sprite.eyes !== 'breed' && EYE_STYLE_KEYS.includes(sprite.eyes) ? sprite.eyes : null;
  const chosenMouth = sprite && typeof sprite.mouth === 'string' && TRAIT_MOUTHS.includes(sprite.mouth) ? sprite.mouth : null;
  const chosenIris = sprite && typeof sprite.iris === 'string' && /^#[0-9a-f]{6}$/i.test(sprite.iris) ? sprite.iris : null;
  const puffleVariant = sprite && sprite.puffleVariant
    ? (typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS ? window.LUMI_PUFFLE_VARIANTS[sprite.puffleVariant] : null)
      || (typeof cpCreatureStylePalette === 'function' ? cpCreatureStylePalette(sprite.puffleVariant) : null)
    : null;
  /* Each Sprite Puffle family carries its own ear and eye shape, so families
     read as different creatures before colour. Player picks still win. */
  const familyFace = sprite && typeof window !== 'undefined' && window.SPRITE_PUFFLE_FACES
    ? window.SPRITE_PUFFLE_FACES[sprite.element] || null
    : null;
  const familyEar = familyFace && EAR_STYLES[familyFace.ear] ? familyFace.ear : null;
  const familyEye = familyFace && EYE_STYLES[familyFace.eye] ? familyFace.eye : null;
  /* The family eye is a bias, not a lock: two in three keep the signature and
     the rest roll their own, so a family reads as one face without its puffles
     becoming clones. Ears stay the family signature. */
  const keepsFamilyEye = !!familyEye && (seed >>> 9) % 3 !== 0;
  /* Skills are family-flavoured: the roll picks from this family's pool, so a
     Frost Puffle never turns up with an Ember Dash. Unknown families fall back
     to the whole table, which keeps gene-lab species working. */
  const familyKey = typeof window !== 'undefined' && typeof window.personalityFamilyKey === 'function'
    ? window.personalityFamilyKey(sprite)
    : null;
  const familySkillNames = typeof window !== 'undefined' && window.PUFFLE_FAMILY_SKILL_POOLS
    ? window.PUFFLE_FAMILY_SKILL_POOLS[familyKey] || null
    : null;
  const familySkills = Array.isArray(familySkillNames)
    ? familySkillNames.map((name) => TRAIT_SKILLS.find((skill) => skill.name === name)).filter(Boolean)
    : [];
  const skillPool = familySkills.length ? familySkills : TRAIT_SKILLS;
  return {
    seed,
    iris: chosenIris
      || (puffleVariant && (puffleVariant.classic || (sprite && (String(sprite.breed || '').startsWith('cp_penguin_') || sprite.breed === 'cp_puffle'))) && puffleVariant.iris)
      || TRAIT_IRISES[seed % TRAIT_IRISES.length],
    eyeStyle: chosenEyes || (keepsFamilyEye ? familyEye : null) || eyes[(seed >>> 3) % eyes.length],
    ears: earBias[breed] || familyEar || 'round',
    head: 'breed',
    mouth: chosenMouth || TRAIT_MOUTHS[(seed >>> 5) % TRAIT_MOUTHS.length],
    ability: skillPool[(seed >>> 13) % skillPool.length],
    family: familyKey,
  };
}

/* Breed-flavoured mouths, drawn over the default idle mouth so every breed can
   wear a different expression without touching the expression system. */
function mouthStyleMarkup(style) {
  if (style === 'cat') return '<path d="M52 73q4 4 8 0q4 4 8 0" stroke="#1d1734" stroke-width="2.3" fill="none" stroke-linecap="round"/>';
  if (style === 'open') return '<ellipse cx="60" cy="75" rx="4" ry="4.8" fill="#1d1734"/><ellipse cx="60" cy="77.4" rx="2.3" ry="1.9" fill="#ff8fa3"/>';
  if (style === 'blep') return '<path d="M52 73q8 6 16 0" stroke="#1d1734" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M57 75.5h6v3.2a3 3 0 0 1-6 0Z" fill="#ff8fa3" stroke="#1d1734" stroke-width=".9"/>';
  if (style === 'fang') return '<path d="M52 73q8 7 16 0" stroke="#1d1734" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M56 75l1.6 3.8 1.6-3.8Z" fill="#ffffff" stroke="#1d1734" stroke-width=".8"/><path d="M62.8 75l1.6 3.8 1.6-3.8Z" fill="#ffffff" stroke="#1d1734" stroke-width=".8"/>';
  if (style === 'wave') return '<path d="M53 73q3.5 3 7 0q3.5 3 7 0" stroke="#1d1734" stroke-width="2.1" fill="none" stroke-linecap="round"/>';
  if (style === 'dot') return '<ellipse cx="60" cy="74" rx="1.7" ry="2.1" fill="#1d1734"/>';
  return '';
}


/* What each rolled skill actually does. These feed spriteEffects, the same
   object XP, coins, bond and need-decay already read, so a skill changes real
   outcomes instead of only printing a line. */
window.PUFFLE_SKILL_EFFECTS = {
  'Keen Eye': { crit: 0.05, winChance: 0.03 },
  'Soft Step': { joyDecay: 0.92 },
  'Warm Glow': { energyDecay: 0.94 },
  'Quick Nose': { hungerDecay: 0.92 },
  'Sturdy Puff': { def: 1.05 },
  'Songbird': { petBond: 1.08 },
  'Lucky Tuft': { xp: 1.06 },
  'Deep Nap': { energyDecay: 0.88 },
  'Ember Dash': { spd: 1.07, crit: 0.02 },
  'Riptide Roll': { dodge: 0.04, spd: 1.04 },
  'Frost Focus': { mag: 1.06, winChance: 0.02 },
  'Static Pounce': { spd: 1.08 },
  'Root Guard': { def: 1.07 },
  'Gale Glide': { dodge: 0.05 },
  'Moonbeam Mend': { joyDecay: 0.93 },
  'Prism Flash': { crit: 0.04 },
  'Shade Step': { dodge: 0.06 },
  'Star Song': { xp: 1.08 },
  'Spore Bloom': { hungerDecay: 0.9 },
  'Gear Tinker': { xp: 1.05, def: 1.02 },
  'Encore': { joyDecay: 0.9 },
  'Dragon Guard': { def: 1.06, atk: 1.03 },
};
