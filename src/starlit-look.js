/* Starlit look: the fluffy winged style from the master atlas art.
   Original vector work built on the reference traits: round violet fluff,
   broad layered feathers, a curled crest, big glossy eyes with a star
   catchlight, heart paw pads, sparkles and a drifting star ribbon. */

const STARLIT = {
  deep: '#3b1f74',
  mid: '#8b5cf6',
  soft: '#b58bff',
  tip: '#7fb2ff',
  light: '#e6dbff',
  pink: '#ff9ec7',
};

function starlitId(sprite) {
  return String((sprite && sprite.id) || 'spr').replace(/[^a-zA-Z0-9_-]/g, '');
}

/* Wing and sparkle colours come from the species' own palette, so two species
   never share the same feathers even though the body reads as one family. */
function starlitPalette(sprite) {
  const breed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const key = breed && breed.speciesPalette;
  const p = key && key !== 'native' && typeof PALETTES !== 'undefined' ? PALETTES[key] : null;
  if (!p) return { deep: STARLIT.deep, mid: STARLIT.mid, soft: STARLIT.soft, tip: STARLIT.tip, light: STARLIT.light };
  return { deep: p.deep, mid: p.body, soft: p.accent, tip: p.light, light: p.belly || p.light };
}

/* Wings are a breed trait, not a uniform. Ground-dwelling species and heavy
   body plans go without them, so the roster splits into two silhouettes. */
const STARLIT_WINGLESS_SHAPES = ['ghost', 'slab', 'pebble', 'dumpling', 'cushion', 'drop', 'muff', 'long', 'blocky'];
const STARLIT_WINGLESS_BREEDS = ['slab', 'ghost', 'pebble', 'shell', 'bean', 'urchin', 'lantern', 'lanky', 'drop', 'muff', 'blob', 'slab', 'star'];

function starlitHasWings(sprite) {
  const breed = (sprite && sprite.breed) || '';
  /* The species file owns the decision when it declares one. */
  const record = typeof BREEDS !== 'undefined' ? BREEDS[breed] : null;
  if (record && typeof record.wings === 'boolean') return record.wings;
  const meta = typeof SPRITE_SPECIES_META !== 'undefined' ? SPRITE_SPECIES_META[breed] : null;
  const shape = (sprite && sprite.shape) || (meta && meta.shape) || '';
  if (STARLIT_WINGLESS_SHAPES.indexOf(shape) >= 0) return false;
  if (STARLIT_WINGLESS_BREEDS.indexOf(breed) >= 0) return false;
  return true;
}

/* Soft 3D pass: a light pool top-left, a cooler shade bottom-right, a rim
   light and a blurred cast shadow, so every sprite reads as a lit volume
   rather than a flat sticker. */
function starlitShadeMarkup(sprite, c, body, clipId) {
  const gid = `starlit-shade-${starlitId(sprite)}`;
  const light = `<radialGradient id="${gid}-light" cx="0.32" cy="0.26" r="0.72">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`;
  const dark = `<radialGradient id="${gid}-dark" cx="0.62" cy="1" r="0.85">
      <stop offset="0" stop-color="${c.deep}" stop-opacity="0.55"/>
      <stop offset="0.6" stop-color="${c.deep}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${c.deep}" stop-opacity="0"/>
    </radialGradient>`;
  const rim = `<linearGradient id="${gid}-rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.35"/>
    </linearGradient>`;
  const shade = clipId && body
    ? `<g clip-path="url(#${clipId})" pointer-events="none">
        <ellipse cx="52" cy="50" rx="42" ry="36" fill="url(#${gid}-light)"/>
        <ellipse cx="62" cy="102" rx="54" ry="38" fill="url(#${gid}-dark)"/>
      </g>`
    : '';
  const rimPath = body
    ? `<path d="${body}" fill="url(#${gid}-rim)" opacity=".14" pointer-events="none"/>
       <path d="${body}" fill="none" stroke="#ffffff" stroke-width="1.1" opacity=".18" pointer-events="none"/>`
    : '';
  return `<defs>${light}${dark}${rim}</defs>${shade}${rimPath}`;
}

/* Left wing: a broad membrane with four fanned feather blades on top of it. */
function starlitWingPaths() {
  return {
    membrane: 'M52 80C33 76 17 64 7 46 1 35-2 22 2 10 16 16 31 28 42 45 49 57 53 70 52 80Z',
    blades: [
      'M2 10c8 4 16 11 22 19-4 3-9 3-13 1-5-4-8-10-9-20Z',
      'M4 26c7 4 14 10 19 18-4 3-9 2-12 0-4-4-6-9-7-18Z',
      'M10 43c6 4 12 9 17 16-4 2-9 2-12-1-3-4-4-9-5-15Z',
      'M18 59c5 4 10 8 14 14-4 2-8 1-10-1-3-3-4-7-4-13Z',
    ],
  };
}

function starlitWingsMarkup(sprite, c, id) {
  const gid = `starlit-wing-${id || starlitId(sprite)}`;
  const w = starlitWingPaths();
  const p = starlitPalette(sprite);
  const blades = w.blades
    .map((d, i) => `<path d="${d}" fill="${p.light}" opacity="${(0.62 - i * 0.1).toFixed(2)}" stroke="${p.soft}" stroke-width=".6"/>`)
    .join('');
  const wing = `
        <path d="${w.membrane}" fill="url(#${gid})" stroke="${p.deep}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="${w.membrane}" fill="#000" opacity=".07" transform="translate(0 2)"/>
        ${blades}
        <path d="M48 74C32 70 18 60 9 45" stroke="${p.light}" stroke-width="1.2" fill="none" opacity=".65"/>
        <path d="M44 62C33 58 23 51 16 40" stroke="${p.light}" stroke-width=".9" fill="none" opacity=".45"/>`;
  return `<defs>
      <linearGradient id="${gid}" x1="0.05" y1="1" x2="0.95" y2="0">
        <stop offset="0" stop-color="${p.deep}"/>
        <stop offset="0.38" stop-color="${p.mid}"/>
        <stop offset="0.75" stop-color="${p.soft}"/>
        <stop offset="1" stop-color="${p.tip}"/>
      </linearGradient>
    </defs>
    <g class="starlit-wings">
      <g>${wing}</g>
      <g transform="translate(120 0) scale(-1 1)">${wing}</g>
    </g>`;
}

/* A dotted stroke around the body outline reads as fur tufts at any size. */
function starlitFluffMarkup(body, c) {
  if (!body) return '';
  return `<g class="starlit-fluff" pointer-events="none">
      <path d="${body}" fill="none" stroke="${c.light}" stroke-width="6" stroke-dasharray="0.5 3.8" stroke-linecap="round" opacity=".95"/>
      <path d="${body}" fill="none" stroke="${c.deep}" stroke-width="2.2" stroke-dasharray="0.4 3.8" stroke-linecap="round" opacity=".28"/>
    </g>`;
}

/* The curled crest at the crown, sweeping to one side like the reference. */
function starlitCrestMarkup(c) {
  /* The crest is nudged 12 units down so its tip clears the top edge at the
     Sensei stage scale. */
  /* The sway animates CSS `transform` on this group, which overrides a
     transform attribute, so the 12-unit drop is baked into the coordinates and
     the crest tip still clears the top edge at the Sensei stage scale. */
  return `<g class="starlit-crest">
      <path d="M62 40c-6-11-1-19 9-22-2 5-1 8 3 10-2 6-5 8-5 13 0 3-5 2-7-1Z" fill="${STARLIT.mid}" stroke="${STARLIT.deep}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M65 34c-3-6 1-11 6-13-1 4 0 6 2 7-3 1-6 3-8 6Z" fill="${STARLIT.light}" opacity=".9"/>
    </g>`;
}

/* Tall glossy eyes: white sclera, violet iris, star catchlight. */
function starlitEyesMarkup(expr, baby, delay, c, style) {
  const st = style || 'classic';
  const rx = baby ? 9 : 8.4;
  const ry = baby ? 11.4 : 10.8;
  const ink = '#241540';
  const mid = STARLIT.mid;
  const light = STARLIT.light;
  const sclera = (x, w = rx, h = ry) => `<ellipse cx="${x}" cy="59.5" rx="${w}" ry="${h}" fill="#fdfbff"/>`;
  const rim = (x, w = rx, h = ry) => `<ellipse cx="${x}" cy="59.5" rx="${w}" ry="${h}" fill="none" stroke="${ink}" stroke-width="1.7"/>`;
  const glossy = (x) => `<ellipse cx="${x}" cy="60.4" rx="${rx - 2.2}" ry="${ry - 2}" fill="${mid}"/>`
    + `<ellipse cx="${x}" cy="61.4" rx="${rx - 4.2}" ry="${ry - 4}" fill="#1c1030"/>`
    + `<circle cx="${x + 2.8}" cy="54" r="${baby ? 3.2 : 2.9}" fill="#ffffff"/>`
    + `<circle cx="${x - 2.8}" cy="65.2" r="1.6" fill="${light}" opacity=".8"/>`;
  const spark = (x) => `<path d="M${x + 5.6} 49.6l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8Z" fill="#ffffff" opacity=".95"/>`;
  const white = (x) => sclera(x) + glossy(x) + rim(x) + spark(x);
  /* Every Studio eye style is drawn here, because this is the face the vector
     sprites actually wear. A style the studio does not know falls back to the
     glossy default rather than drawing nothing. */
  const shape = (x) => {
    switch (st) {
      case 'button':
        return sclera(x) + `<circle cx="${x}" cy="60" r="${rx - 1.9}" fill="${mid}"/><circle cx="${x + 2.3}" cy="55.8" r="2" fill="#fff"/>` + rim(x);
      case 'dot':
        return `<circle cx="${x}" cy="60" r="3.2" fill="${ink}"/><circle cx="${x + 1}" cy="58.6" r=".9" fill="#fff" opacity=".9"/>`;
      case 'spiral':
        return sclera(x) + `<path d="M${x} 60a5 5 0 1 0 4-4 3 3 0 1 0 2 3" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round"/>` + rim(x);
      case 'glow':
        return `<ellipse cx="${x}" cy="59.5" rx="${rx + 1.6}" ry="${ry + 1.4}" fill="${light}" opacity=".22"/>`
          + `<ellipse cx="${x}" cy="59.5" rx="${rx - .6}" ry="${ry - .4}" fill="${light}" opacity=".92"/>`
          + `<ellipse cx="${x}" cy="59.8" rx="${rx - 3.6}" ry="${ry - 3.4}" fill="#fff"/>` + rim(x);
      case 'ring':
        return sclera(x) + `<ellipse cx="${x}" cy="60" rx="${rx - 2.6}" ry="${ry - 2.4}" fill="none" stroke="${mid}" stroke-width="2.8"/>`
          + `<circle cx="${x}" cy="60.2" r="1.9" fill="${ink}"/><circle cx="${x + 1.6}" cy="56.6" r="1.5" fill="#fff"/>` + rim(x);
      case 'wink':
        return x < 60 ? white(x) : `<path d="M${x - 6} 60q6 6 12 0" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x + 6} 58.6l3.4-2.4" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
      case 'sparkle':
        return white(x) + `<path d="M${x - 6.4} 53.4l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" fill="#fff"/>`;
      case 'sleepy':
        return sclera(x) + `<ellipse cx="${x}" cy="62.5" rx="${rx - 2.6}" ry="${ry - 4.4}" fill="${mid}"/><circle cx="${x}" cy="62.5" r="2.4" fill="#1c1030"/>`
          + `<path d="M${x - rx - .4} 57.6q${rx + .4} ${-ry * .9} ${rx * 2 + .8} 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>` + rim(x);
      case 'wide':
        return sclera(x, rx + 1.3, ry + 1.1) + glossy(x) + `<circle cx="${x - 1.6}" cy="63" r="2.2" fill="#fff" opacity=".5"/>` + rim(x, rx + 1.3, ry + 1.1);
      case 'star':
        return sclera(x) + `<path d="M${x} 52.4l2.9 5.4 5.9.7-4.3 4.1 1.1 5.9-5.6-2.9-5.6 2.9 1.1-5.9-4.3-4.1 5.9-.7Z" fill="${mid}" stroke="${ink}" stroke-width="1.2"/>` + rim(x);
      case 'heart':
        return sclera(x) + `<path d="M${x} 56.2c-3.4-4.6-9.4-2-9.4 2.7 0 4.6 9.4 9.3 9.4 9.3s9.4-4.7 9.4-9.3c0-4.7-6-7.3-9.4-2.7Z" fill="${STARLIT.pink}" stroke="${ink}" stroke-width="1.5"/><circle cx="${x + 2.6}" cy="56" r="1.5" fill="#fff" opacity=".9"/>` + rim(x);
      case 'anime':
        return sclera(x, rx + .6, ry + .8) + glossy(x) + `<path d="M${x - rx} 50.6q${rx} -4.4 ${rx * 2} .8" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>` + rim(x, rx + .6, ry + .8);
      case 'lashes':
        return white(x) + `<path d="M${x + 6.4} 51.4l3.6-2.2M${x + 7.6} 55.4l3.8-1M${x + 7.4} 59.6l3.6 2" stroke="${ink}" stroke-width="1.7" stroke-linecap="round"/>`;
      case 'pixel':
        return `<rect x="${x - 5}" y="54" width="10" height="11" fill="${ink}"/><rect x="${x - 3}" y="56" width="4" height="4" fill="#fff"/><rect x="${x + 1}" y="61" width="2" height="2" fill="${light}"/>`;
      case 'teary':
        return white(x) + `<path d="M${x - 3} 70c-2.4 3.2-2.2 5.4.2 5.4s2.8-2.2.2-5.4Z" fill="#9fdcff" opacity=".9" stroke="${ink}" stroke-width=".7"/>`;
      case 'cross':
        return `<path d="M${x - 5.4} 55.4l10.8 9.2M${x + 5.4} 55.4l-10.8 9.2" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>`;
      case 'galaxy':
        return `<ellipse cx="${x}" cy="60" rx="${rx - 1}" ry="${ry - 1.4}" fill="#1b0f3a"/><circle cx="${x - 2.6}" cy="56.4" r="1" fill="#fff"/><circle cx="${x + 2.8}" cy="62.6" r=".9" fill="${light}"/><circle cx="${x + .8}" cy="59" r=".7" fill="${STARLIT.tip}"/>` + rim(x);
      case 'flame':
        return `<path d="M${x} 51.6c3.6 4 5 6.6 5 9.2a5 5 0 0 1-10 0c0-2.2 1-3.4 2-4.6.4 1.4 1 2 2 2.2-.6-2.4-.4-4.4 1-6.8Z" fill="${STARLIT.tip}" stroke="${ink}" stroke-width="1.3"/><path d="M${x} 60.8c1.6 1.6 2 2.6 2 3.6a2 2 0 0 1-4 0c0-1 .4-1.8 1-2.6Z" fill="#fff" opacity=".8"/>` + rim(x);
      case 'lens':
        return sclera(x) + `<ellipse cx="${x}" cy="60.4" rx="${rx - 2.2}" ry="${ry - 2}" fill="${mid}"/><circle cx="${x}" cy="60.4" r="3.4" fill="#1c1030"/><circle cx="${x}" cy="60.4" r="6" fill="none" stroke="${light}" stroke-width="1" opacity=".8"/><circle cx="${x}" cy="60.4" r="8" fill="none" stroke="${light}" stroke-width=".8" opacity=".5"/><circle cx="${x + 3.4}" cy="55.2" r="2" fill="#fff"/>` + rim(x);
      case 'half':
        return white(x) + `<path d="M${x - rx - .4} 57.2q${rx + .4} -4.6 ${rx * 2 + .8} 0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
      case 'cat':
        return sclera(x) + `<ellipse cx="${x}" cy="60.2" rx="${rx - 3.6}" ry="${ry - 2.4}" fill="${mid}"/><ellipse cx="${x}" cy="60.4" rx="1.7" ry="${ry - 3.2}" fill="#0b0618"/><circle cx="${x + 2.4}" cy="53.8" r="2.2" fill="#fff"/>` + rim(x);
      case 'gleam':
        return `<ellipse cx="${x}" cy="59.4" rx="${rx - .6}" ry="3.4" fill="${ink}"/><ellipse cx="${x - 1}" cy="58.2" rx="3.2" ry="1.5" fill="#fff" opacity=".92"/><circle cx="${x + 5.6}" cy="52" r="1.5" fill="#fff" opacity=".8"/>`;
      default:
        return white(x);
    }
  };
  const eye = (x) => `<g class="b-eye" style="animation-delay:${delay}s">${shape(x)}</g>`;
  if (expr === 'sleep') {
    return `<path d="M38 59q9 7 17 0" stroke="#241540" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M65 59q9 7 17 0" stroke="#241540" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  }
  if (expr === 'love') {
    const heart = (x) => `<path d="M${x} 53.5c-4-5.3-11-2.3-11 3.2 0 5.4 11 10.9 11 10.9s11-5.5 11-10.9c0-5.5-7-8.5-11-3.2Z" fill="${STARLIT.pink}" stroke="#241540" stroke-width="1.6"/>`;
    return heart(47) + heart(73);
  }
  return eye(47) + eye(73);
}

/* Heart paw pads on the front feet. */
function starlitPadsMarkup() {
  const pad = (x, y) => `<path d="M${x} ${y + 1.4}c-1.9-2.5-5.2-1.1-5.2 1.5 0 2.5 5.2 5.1 5.2 5.1s5.2-2.6 5.2-5.1c0-2.6-3.3-4-5.2-1.5Z" fill="${STARLIT.pink}" stroke="#8a2f56" stroke-width=".8"/>`;
  return `<g class="starlit-pads">${pad(49, 94)}${pad(71, 94)}</g>`;
}

/* Sparkles plus the curling star ribbon that trails behind. */
function starlitSparkleMarkup(sprite) {
  const p = starlitPalette(sprite);
  const star = (x, y, s, o) => `<path d="M${x} ${y - s}l${s * 0.32} ${s * 0.68} ${s * 0.68} ${s * 0.32}-${s * 0.68} ${s * 0.32}-${s * 0.32} ${s * 0.68}-${s * 0.32}-${s * 0.68}-${s * 0.68}-${s * 0.32} ${s * 0.68}-${s * 0.32}Z" fill="${p.light}" opacity="${o}"/>`;
  return `<g class="starlit-sparkle" pointer-events="none">
      <path d="M14 100c11 6 26 7 36 0" stroke="${p.soft}" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".5"/>
      <path d="M16 95c10 4 22 5 31 0" stroke="${p.tip}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6" stroke-dasharray="2 5"/>
      ${star(20, 30, 6.5, '1')}
      ${star(102, 38, 5.2, '.9')}
      ${star(94, 92, 4, '.8')}
      ${star(26, 82, 3.6, '.7')}
      <circle cx="16" cy="54" r="1.4" fill="${p.accent || p.soft}" opacity=".8"/>
      <circle cx="104" cy="70" r="1.1" fill="${p.light}" opacity=".7"/>
    </g>`;
}
