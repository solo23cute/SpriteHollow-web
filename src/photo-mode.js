/* Photo Mode for the Sprite Puffle family.

   The portrait is assembled as one standalone SVG, then rasterised on demand to
   a PNG. It uses the same spriteSVG markup as the game, with the currently
   previewed family variant, accessory, backdrop and expression, so a shared
   portrait matches what the player sees in the detail sheet. No external images
   or fonts are required. */

const PUFFLE_PHOTO_WIDTH = 800;
const PUFFLE_PHOTO_HEIGHT = 1000;

const PUFFLE_PHOTO_BACKGROUNDS = {
  mosslight: {
    name: 'Mosslight', icon: '🌿', sky: ['#F6FFF1', '#C8EFCF', '#5F9E7B'],
    glow: '#FFF7C9', ground: '#7FC49D', accent: '#4F9B78', ink: '#284A3A', spark: '#F8FFD8',
  },
  moonlit: {
    name: 'Moonlit Grove', icon: '🌙', sky: ['#201B44', '#4A3C7C', '#9D89CF'],
    glow: '#FFF1C9', ground: '#33285C', accent: '#B8A0E8', ink: '#282044', spark: '#FFF4D6',
  },
  frost: {
    name: 'Frostmere', icon: '❄️', sky: ['#F4FDFF', '#CBEFFF', '#77B9D9'],
    glow: '#FFFFFF', ground: '#E8FAFF', accent: '#4F9FC4', ink: '#294F66', spark: '#FFFFFF',
  },
  sunset: {
    name: 'Sunmeadow', icon: '☀️', sky: ['#FFF8E7', '#FFD6A3', '#D98A62'],
    glow: '#FFF3B0', ground: '#D99A6A', accent: '#C97945', ink: '#593A24', spark: '#FFF2B8',
  },
  cosmic: {
    name: 'Celestial Reach', icon: '⭐', sky: ['#17112F', '#3D286E', '#8A5BFF'],
    glow: '#FFE9A8', ground: '#2A1B4A', accent: '#C9A8FF', ink: '#241A3A', spark: '#FFF6D8',
  },
};

const PUFFLE_PHOTO_POSES = [
  { key: 'idle', name: 'Idle', icon: '☁️', expr: 'idle' },
  { key: 'happy', name: 'Happy', icon: '😊', expr: 'happy' },
  { key: 'love', name: 'Love', icon: '💗', expr: 'love' },
  { key: 'sleep', name: 'Sleepy', icon: '😴', expr: 'sleep' },
  { key: 'eat', name: 'Snacky', icon: '🍪', expr: 'eat' },
  { key: 'grump', name: 'Grumpy', icon: '😤', expr: 'grump' },
];

const PUFFLE_PHOTO_FRAMES = {
  storybook: {
    name: 'Storybook', icon: '📖', stroke: '#C9A96A', detail: '#F3E2B8', ink: '#5B4327', motif: 'corner',
  },
  cloud: {
    name: 'Cloud', icon: '☁️', stroke: '#8FCFDF', detail: '#E8FBFF', ink: '#2F6170', motif: 'cloud',
  },
  petal: {
    name: 'Petal', icon: '🌸', stroke: '#E88FB4', detail: '#FFD6E7', ink: '#7A3553', motif: 'petal',
  },
  starlight: {
    name: 'Starlight', icon: '✨', stroke: '#C9A8FF', detail: '#FFE9A8', ink: '#2A1B4A', motif: 'star', dark: true,
  },
  prism: {
    name: 'Prism', icon: '🌈', stroke: '#B18CFF', detail: '#8CFFF2', ink: '#3B2A5A', motif: 'prism',
  },
};

function pufflePhotoText(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* A Club Penguin puffle is photographed in its canon habitat, not the generic
   Hollow label. One helper so the portrait SVG and the chip row agree. */
function cpHabitatLabel(sprite, row) {
  const profile = typeof cpPuffleProfileForSprite === 'function' ? cpPuffleProfileForSprite(sprite) : null;
  return pufflePhotoText((profile && profile.habitat.label) || (row && row.habitatLabel) || 'Mosslight Hollow');
}

function pufflePhotoName(sprite) {
  return typeof displayName === 'function' ? displayName(sprite) : ((sprite && sprite.name) || 'Puffle');
}

function pufflePhotoFilename(sprite) {
  const slug = String(pufflePhotoName(sprite) || 'puffle')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'puffle';
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `sprite-hollow-${slug}-${stamp}.png`;
}

function pufflePhotoDefaultBackground(row) {
  const key = row && row.key;
  if (key === 'sp_frost') return 'frost';
  if (key === 'sp_moonmist' || key === 'sp_dream') return 'moonlit';
  if (key === 'sp_sunbeam') return 'sunset';
  if (key === 'sp_rainbow' || key === 'sp_ancient') return 'cosmic';
  return 'mosslight';
}

function pufflePhotoDefaultFrame(row) {
  const key = row && row.key;
  if (key === 'sp_frost' || key === 'sp_bubble') return 'cloud';
  if (key === 'sp_blossom' || key === 'sp_forest') return 'petal';
  if (key === 'sp_moonmist' || key === 'sp_dream' || key === 'sp_ancient') return 'starlight';
  if (key === 'sp_rainbow') return 'prism';
  return 'storybook';
}

function pufflePhotoLook(sprite, options) {
  const opts = options || {};
  const row = typeof spritePuffleFamilyFor === 'function' ? spritePuffleFamilyFor(sprite) : null;
  const variant = opts.variant || (sprite && sprite.puffleVariant) || (row && row.key) || 'common';
  const accessory = opts.accessory || (sprite && sprite.accessory) || 'none';
  const finish = opts.finish !== undefined
    ? (typeof FINISHES !== 'undefined' && FINISHES[opts.finish] ? opts.finish : '')
    : ((sprite && sprite.variant) || '');
  const meta = (typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS && window.LUMI_PUFFLE_VARIANTS[variant]) || {};
  const fallback = (row && row.style) || {};
  const backgroundKey = opts.background && PUFFLE_PHOTO_BACKGROUNDS[opts.background]
    ? opts.background
    : pufflePhotoDefaultBackground(row);
  const pose = PUFFLE_PHOTO_POSES.find((entry) => entry.key === opts.pose) || PUFFLE_PHOTO_POSES[0];
  const frameKey = opts.frame && PUFFLE_PHOTO_FRAMES[opts.frame]
    ? opts.frame
    : pufflePhotoDefaultFrame(row);
  return {
    row,
    variant,
    accessory,
    finish,
    body: meta.primary || fallback.primary || '#FFF3DC',
    light: meta.secondary || meta.belly || fallback.secondary || '#FFFFFF',
    deep: meta.eyeShadow || fallback.eyeShadow || '#2F4A3E',
    accent: meta.iris || meta.leaf || fallback.iris || '#6FD3B5',
    backgroundKey,
    background: PUFFLE_PHOTO_BACKGROUNDS[backgroundKey],
    poseKey: pose.key,
    pose,
    frameKey,
    frame: PUFFLE_PHOTO_FRAMES[frameKey],
  };
}

/* The border is part of the portrait SVG, so Save PNG and Share both carry the
   chosen frame. Each corner is the same ornament mirrored into its quadrant. */
function pufflePhotoFrameMarkup(look) {
  const frame = look.frame || PUFFLE_PHOTO_FRAMES.storybook;
  const stroke = frame.stroke;
  const detail = frame.detail;
  const ink = frame.ink;
  let ornament = '';
  if (frame.motif === 'cloud') {
    ornament = `<g fill="${detail}" stroke="${stroke}" stroke-width="1.6">
      <circle cx="10" cy="18" r="7"/><circle cx="19" cy="12" r="9"/><circle cx="29" cy="18" r="7"/>
    </g>`;
  } else if (frame.motif === 'petal') {
    ornament = `<g fill="${detail}" stroke="${stroke}" stroke-width="1.5">
      <ellipse cx="19" cy="9" rx="5" ry="8"/><ellipse cx="28" cy="17" rx="7" ry="5"/>
      <ellipse cx="19" cy="26" rx="7" ry="5"/><ellipse cx="10" cy="17" rx="7" ry="5"/>
      <circle cx="19" cy="17" r="3.4" fill="${ink}" stroke="none"/>
    </g>`;
  } else if (frame.motif === 'star') {
    ornament = `<g fill="${detail}" stroke="${stroke}" stroke-width="1.2">
      <path d="M19 3l3.2 9.8 9.8 3.2-9.8 3.2L19 29l-3.2-9.8L6 16l9.8-3.2Z"/>
      <circle cx="31" cy="31" r="2.4" fill="${stroke}" stroke="none"/>
    </g>`;
  } else if (frame.motif === 'prism') {
    ornament = `<g fill="none" stroke-width="3" stroke-linecap="round">
      <path d="M4 28c0-13 10-23 23-23" stroke="#FF9ECB"/>
      <path d="M8 32c1-11 9-19 20-20" stroke="${detail}"/>
      <path d="M13 35c2-8 7-13 15-14" stroke="#B18CFF"/>
    </g>`;
  } else {
    ornament = `<g fill="none" stroke="${stroke}" stroke-linecap="round">
      <path d="M2 31V2h29" stroke-width="4"/>
      <path d="M9 22l11-11 4 4-11 11Z" fill="${detail}" stroke-width="1.4"/>
    </g>`;
  }
  const corner = (x, y, sx, sy) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${ornament}</g>`;
  return `<g data-photo-frame="${look.frameKey}">
    <rect x="26" y="26" width="748" height="948" rx="46" fill="none" stroke="${stroke}" stroke-width="4.5" opacity=".9"/>
    <rect x="41" y="41" width="718" height="918" rx="38" fill="none" stroke="${detail}" stroke-width="1.8" opacity="${frame.dark ? '.8' : '.72'}"/>
    ${corner(42, 42, 1, 1)}${corner(758, 42, -1, 1)}${corner(42, 958, 1, -1)}${corner(758, 958, -1, -1)}
    <path d="M400 20l5 10 10 5-10 5-5 10-5-10-10-5 10-5Z" fill="${detail}" stroke="${stroke}" stroke-width="1.2"/>
  </g>`;
}

function pufflePhotoScenery(key, bg) {
  const stars = [
    [90, 132, 2.2], [164, 218, 1.7], [248, 108, 2.8], [342, 194, 1.6],
    [452, 112, 2.1], [512, 238, 1.5], [604, 146, 2.4], [714, 236, 1.8],
  ].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${bg.spark}" opacity=".85"/>`).join('');
  const snow = [
    [102, 174, 3.5], [172, 300, 2.4], [278, 138, 2.8], [356, 244, 2.1],
    [478, 148, 3.1], [562, 268, 2.3], [666, 120, 2.7], [704, 330, 3.4],
    [218, 430, 2.1], [612, 438, 2.5],
  ].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".72"/>`).join('');
  const leaves = [[112, 286, -20], [158, 344, 26], [650, 246, 18], [704, 326, -26], [102, 470, 8]]
    .map(([x, y, rot]) => `<path d="M0 0c-13-9-24-2-25 8 10 8 22 4 25-8Z" fill="${bg.glow}" opacity=".7" transform="translate(${x} ${y}) rotate(${rot})"/>`).join('');

  if (key === 'moonlit') {
    return `<g data-photo-scene="moonlit">
      <circle cx="638" cy="154" r="72" fill="${bg.glow}" opacity=".96"/>
      <circle cx="660" cy="140" r="64" fill="${bg.sky[1]}" opacity=".78"/>
      <g>${stars}</g>
      <path d="M0 592c104-54 196-62 302-22 104 40 190 26 270-8 76-32 158-22 228 22v180H0Z" fill="${bg.ground}" opacity=".62"/>
      <path d="M0 648c128-34 248-22 362 18 108 38 248 30 438-26v190H0Z" fill="${bg.sky[0]}" opacity=".38"/>
      <g fill="${bg.glow}" opacity=".62"><circle cx="202" cy="532" r="3"/><circle cx="566" cy="506" r="2.4"/><circle cx="326" cy="574" r="2"/><circle cx="694" cy="572" r="2.8"/></g>
    </g>`;
  }
  if (key === 'frost') {
    return `<g data-photo-scene="frost">
      <g>${snow}</g>
      <g stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity=".72">
        <path d="M118 222v24M106 234h24M110 226l16 16M126 226l-16 16"/>
        <path d="M668 206v20M658 216h20M661 209l14 14M675 209l-14 14"/>
        <path d="M232 472v18M223 481h18M226 475l12 12M238 475l-12 12"/>
      </g>
      <path d="M0 586c110-38 224-42 330-8 108 35 218 26 310-8 72-27 128-20 160 0v190H0Z" fill="${bg.ground}" opacity=".82"/>
      <path d="M0 650c136-40 258-22 380 16 112 35 246 26 420-20v180H0Z" fill="#FFFFFF" opacity=".62"/>
    </g>`;
  }
  if (key === 'sunset') {
    return `<g data-photo-scene="sunset">
      <circle cx="628" cy="156" r="96" fill="${bg.glow}" opacity=".72"/>
      <circle cx="628" cy="156" r="60" fill="#FFD166" opacity=".78"/>
      <g fill="#FFFFFF" opacity=".55">
        <ellipse cx="168" cy="220" rx="92" ry="24"/><ellipse cx="226" cy="202" rx="55" ry="18"/>
        <ellipse cx="668" cy="306" rx="82" ry="20"/><ellipse cx="610" cy="292" rx="46" ry="15"/>
      </g>
      <path d="M0 594c104-48 200-50 302-8 104 43 190 30 274-2 78-30 154-18 224 28v180H0Z" fill="${bg.ground}" opacity=".65"/>
      <path d="M0 654c130-34 242-18 358 20 116 38 256 30 442-26v180H0Z" fill="${bg.sky[2]}" opacity=".35"/>
      <g fill="${bg.spark}" opacity=".8"><circle cx="198" cy="388" r="2.4"/><circle cx="544" cy="356" r="2"/><circle cx="704" cy="412" r="2.6"/></g>
    </g>`;
  }
  if (key === 'cosmic') {
    return `<g data-photo-scene="cosmic">
      <ellipse cx="570" cy="270" rx="230" ry="122" fill="#8A5BFF" opacity=".2"/>
      <ellipse cx="236" cy="352" rx="190" ry="102" fill="#4FC8FF" opacity=".14"/>
      <g>${stars}</g>
      <g fill="${bg.glow}" opacity=".86">
        <path d="M146 186l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/>
        <path d="M690 382l2.4 6.4 6.4 2.4-6.4 2.4-2.4 6.4-2.4-6.4-6.4-2.4 6.4-2.4Z"/>
        <path d="M300 430l2 5.2 5.2 2-5.2 2-2 5.2-2-5.2-5.2-2 5.2-2Z"/>
      </g>
      <circle cx="654" cy="176" r="48" fill="none" stroke="${bg.glow}" stroke-width="2.2" opacity=".52" transform="rotate(-18 654 176)"/>
      <circle cx="654" cy="176" r="35" fill="#B18CFF" opacity=".35"/>
      <path d="M0 582c108-44 206-46 308-6 104 41 188 28 272-4 78-30 154-18 220 26v190H0Z" fill="${bg.ground}" opacity=".66"/>
      <path d="M0 654c136-34 250-16 368 22 116 38 252 28 432-28v180H0Z" fill="#120C26" opacity=".35"/>
    </g>`;
  }
  return `<g data-photo-scene="mosslight">
    <path d="M0 592c104-58 196-64 302-22 104 42 192 26 270-8 76-32 158-22 228 22v180H0Z" fill="${bg.ground}" opacity=".58"/>
    <path d="M0 650c124-38 240-22 356 18 112 38 252 30 444-26v190H0Z" fill="${bg.sky[2]}" opacity=".34"/>
    <g>${leaves}</g>
    <g fill="${bg.glow}" opacity=".82"><circle cx="212" cy="352" r="3"/><circle cx="566" cy="300" r="2.4"/><circle cx="686" cy="456" r="2.8"/><circle cx="128" cy="512" r="2.2"/></g>
    <g fill="#FFFFFF" opacity=".34"><ellipse cx="140" cy="240" rx="84" ry="32"/><ellipse cx="202" cy="220" rx="52" ry="24"/><ellipse cx="676" cy="382" rx="72" ry="28"/></g>
  </g>`;
}

function pufflePhotoBuildSVG(sprite, options) {
  if (!sprite || typeof spriteSVG !== 'function') return '';
  const look = pufflePhotoLook(sprite, options);
  const row = look.row;
  const bg = look.background;
  const rarity = row && typeof spritePuffleFamilyRarity === 'function'
    ? spritePuffleFamilyRarity(row)
    : { name: '', stars: 0, color: look.accent };
  const name = pufflePhotoText(pufflePhotoName(sprite));
  const family = pufflePhotoText(row ? row.name : 'Sprite Hollow Puffle');
  const habitat = cpHabitatLabel(sprite, row);
  const level = Math.max(1, Number(sprite.level) || 1);
  const bond = Math.max(0, Math.min(100, Math.round(Number(sprite.bond) || 0)));
  const stars = rarity && rarity.stars ? '★'.repeat(Math.min(8, rarity.stars)) : '';
  const rarityName = pufflePhotoText((rarity && rarity.name) || 'Puffle');
  const spriteArt = spriteSVG({ ...sprite, puffleVariant: look.variant, variant: look.finish || null, accessory: look.accessory }, { still: true, expr: look.pose.expr });
  const nested = spriteArt.replace('<svg ', '<svg x="136" y="136" width="528" height="528" preserveAspectRatio="xMidYMid meet" ');
  const sparkles = [
    [122, 178, 5.5], [684, 222, 4], [116, 426, 3.4], [692, 482, 5.8],
    [168, 596, 3.8], [638, 620, 3.2], [94, 304, 2.8], [714, 360, 3.1],
  ].map(([x, y, r], index) => `<path d="M${x} ${y - r}l${r * 0.55} ${r * 1.45} ${r * 1.45} ${r * 0.55}-${r * 1.45} ${r * 0.55}-${r * 0.55} ${r * 1.45}-${r * 0.55}-${r * 1.45}-${r * 1.45}-${r * 0.55} ${r * 1.45}-${r * 0.55}Z" fill="${index % 2 ? bg.spark : bg.glow}" opacity="${index % 2 ? '.5' : '.7'}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PUFFLE_PHOTO_WIDTH}" height="${PUFFLE_PHOTO_HEIGHT}" viewBox="0 0 ${PUFFLE_PHOTO_WIDTH} ${PUFFLE_PHOTO_HEIGHT}" data-photo-bg="${look.backgroundKey}" data-photo-pose="${look.poseKey}" data-photo-frame="${look.frameKey}">
    <defs>
      <linearGradient id="pp-bg" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stop-color="${bg.sky[0]}"/>
        <stop offset="0.55" stop-color="${bg.sky[1]}"/>
        <stop offset="1" stop-color="${bg.sky[2]}"/>
      </linearGradient>
      <radialGradient id="pp-glow" cx=".5" cy=".4" r=".6">
        <stop offset="0" stop-color="${bg.glow}" stop-opacity=".85"/>
        <stop offset="0.72" stop-color="${bg.glow}" stop-opacity=".14"/>
        <stop offset="1" stop-color="${bg.glow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="pp-card" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffdf7" stop-opacity=".98"/>
        <stop offset="1" stop-color="#fff7ea" stop-opacity=".96"/>
      </linearGradient>
    </defs>
    <rect width="${PUFFLE_PHOTO_WIDTH}" height="${PUFFLE_PHOTO_HEIGHT}" fill="url(#pp-bg)"/>
    <circle cx="400" cy="396" r="300" fill="url(#pp-glow)"/>
    ${pufflePhotoScenery(look.backgroundKey, bg)}
    <ellipse cx="400" cy="664" rx="190" ry="26" fill="#1c1230" opacity=".18"/>
    ${sparkles}
    ${pufflePhotoFrameMarkup(look)}
    <g transform="translate(60 88)">
      <rect x="0" y="0" width="${Math.max(182, 54 + family.length * 9.4)}" height="34" rx="17" fill="#ffffff" opacity=".8"/>
      <text x="18" y="23" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="13" font-weight="700" letter-spacing="2.4" fill="${bg.ink}">SPRITE PUFFLE FAMILY</text>
    </g>
    ${nested}
    <ellipse cx="400" cy="678" rx="150" ry="23" fill="${look.light}" opacity=".6"/>
    <g fill="#ffffff" opacity=".9">
      <ellipse cx="330" cy="684" rx="46" ry="22"/>
      <ellipse cx="388" cy="676" rx="58" ry="27"/>
      <ellipse cx="452" cy="686" rx="42" ry="20"/>
    </g>
    <rect x="64" y="704" width="672" height="238" rx="38" fill="url(#pp-card)" stroke="${bg.accent}" stroke-width="1.4" opacity=".985"/>
    <text x="400" y="744" text-anchor="middle" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${bg.accent}">A COZY COMPANION FROM THE HOLLOW</text>
    <text x="400" y="795" text-anchor="middle" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="42" font-weight="700" fill="#2a2038">${name}</text>
    <text x="400" y="829" text-anchor="middle" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="18" fill="#6a5c7a">${family} · ${rarityName} ${stars}</text>
    <g font-family="'Trebuchet MS', Verdana, sans-serif" font-size="16" font-weight="700" fill="#4a3f5c">
      <rect x="148" y="852" width="150" height="38" rx="19" fill="${look.light}" opacity=".78"/>
      <text x="223" y="877" text-anchor="middle">Lv ${level}</text>
      <rect x="312" y="852" width="176" height="38" rx="19" fill="${look.light}" opacity=".78"/>
      <text x="400" y="877" text-anchor="middle">💗 ${bond} bond</text>
      <rect x="502" y="852" width="150" height="38" rx="19" fill="${look.light}" opacity=".78"/>
      <text x="577" y="877" text-anchor="middle">${habitat}</text>
    </g>
    <text x="400" y="916" text-anchor="middle" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="13" letter-spacing="2" fill="#8a7b9c">${look.pose.name.toUpperCase()} · ${bg.name.toUpperCase()} · ${new Date().getFullYear()}</text>
  </svg>`;
}

function pufflePhotoDataURI(sprite, options) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pufflePhotoBuildSVG(sprite, options))}`;
}

function pufflePhotoBlob(sprite, options) {
  return new Promise((resolve, reject) => {
    const svg = pufflePhotoBuildSVG(sprite, options);
    if (!svg) {
      reject(new Error('No portrait art available.'));
      return;
    }
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      try {
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = PUFFLE_PHOTO_WIDTH * scale;
        canvas.height = PUFFLE_PHOTO_HEIGHT * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is unavailable.');
        ctx.fillStyle = '#fffdf7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('The portrait could not be encoded.'));
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error('The portrait art could not be loaded.'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

function pufflePhotoSave(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function pufflePhotoOptionsHTML(look) {
  const frames = Object.keys(PUFFLE_PHOTO_FRAMES).map((key) => {
    const item = PUFFLE_PHOTO_FRAMES[key];
    return `<button type="button" class="chip photo-choice ${key === look.frameKey ? 'on' : ''}" data-photo-frame="${key}"><span class="photo-frame-swatch" style="--frame-stroke:${item.stroke};--frame-detail:${item.detail}"></span>${item.icon} ${item.name}</button>`;
  }).join('');
  const backgrounds = Object.keys(PUFFLE_PHOTO_BACKGROUNDS).map((key) => {
    const item = PUFFLE_PHOTO_BACKGROUNDS[key];
    return `<button type="button" class="chip photo-choice ${key === look.backgroundKey ? 'on' : ''}" data-photo-bg="${key}">${item.icon} ${item.name}</button>`;
  }).join('');
  const poses = PUFFLE_PHOTO_POSES.map((pose) => (
    `<button type="button" class="chip photo-choice ${pose.key === look.poseKey ? 'on' : ''}" data-photo-pose="${pose.key}">${pose.icon} ${pose.name}</button>`
  )).join('');
  return `<div class="photo-options">
    <div class="photo-option-block"><div class="photo-option-label">FRAME</div><div class="family-chip-row">${frames}</div></div>
    <div class="photo-option-block"><div class="photo-option-label">BACKDROP</div><div class="family-chip-row">${backgrounds}</div></div>
    <div class="photo-option-block"><div class="photo-option-label">POSE</div><div class="family-chip-row">${poses}</div></div>
  </div>`;
}

function openPufflePhoto(sprite, options) {
  if (!sprite || typeof openSheet !== 'function') return null;
  const initialLook = pufflePhotoLook(sprite, options);
  const current = {
    ...(options || {}),
    variant: initialLook.variant,
    accessory: initialLook.accessory,
    background: initialLook.backgroundKey,
    pose: initialLook.poseKey,
    frame: initialLook.frameKey,
  };
  const row = initialLook.row;
  const rarity = row && typeof spritePuffleFamilyRarity === 'function' ? spritePuffleFamilyRarity(row) : null;
  const name = pufflePhotoName(sprite);
  const filename = pufflePhotoFilename(sprite);
  const preview = pufflePhotoDataURI(sprite, current);
  const { overlay } = openSheet({
    title: '📸 Photo Mode',
    sub: `${esc(name)} · ${esc(row ? row.name : 'Puffle')} · choose a frame, backdrop and pose`,
    body: `<div class="photo-portrait-frame"><img src="${preview}" alt="Portrait of ${esc(name)}" data-photo-preview></div>
      ${pufflePhotoOptionsHTML(initialLook)}
      <div class="family-chip-row photo-chips">
        ${rarity ? `<span class="chip" style="border-color:${rarity.color}">${rarity.icon} ${esc(rarity.name)}</span>` : ''}
        <span class="chip">Lv ${Math.max(1, Number(sprite.level) || 1)}</span>
        <span class="chip">💗 ${Math.max(0, Math.min(100, Math.round(Number(sprite.bond) || 0)))} bond</span>
        <span class="chip">${cpHabitatLabel(sprite, row)}</span>
        ${initialLook.accessory !== 'none' && typeof ACCESSORIES !== 'undefined' && ACCESSORIES[initialLook.accessory] ? `<span class="chip">${ACCESSORIES[initialLook.accessory].icon} ${esc(ACCESSORIES[initialLook.accessory].name)}</span>` : ''}
      </div>
      <div class="actions photo-actions">
        <button type="button" class="btn btn-primary" data-photo-save>⬇️ Save PNG</button>
        <button type="button" class="btn btn-soft" data-photo-share>📤 Share</button>
      </div>
      <p class="tiny muted photo-note" data-photo-status>${initialLook.frame.name} frame · ${initialLook.background.name} · ${initialLook.pose.name}. Saved at 1600 × 2000. Share opens your device's share sheet when it supports images.</p>`,
    onMount: (root) => {
      const status = root.querySelector('[data-photo-status]');
      const previewImage = root.querySelector('[data-photo-preview]');
      const buttons = [...root.querySelectorAll('[data-photo-save], [data-photo-share]')];
      const refresh = () => {
        const live = pufflePhotoLook(sprite, current);
        if (previewImage) previewImage.src = pufflePhotoDataURI(sprite, current);
        if (status) status.textContent = `${live.frame.name} frame · ${live.background.name} · ${live.pose.name}. Saved at 1600 × 2000. Share opens your device's share sheet when it supports images.`;
        root.querySelectorAll('[data-photo-frame]').forEach((btn) => btn.classList.toggle('on', btn.dataset.photoFrame === current.frame));
        root.querySelectorAll('[data-photo-bg]').forEach((btn) => btn.classList.toggle('on', btn.dataset.photoBg === current.background));
        root.querySelectorAll('[data-photo-pose]').forEach((btn) => btn.classList.toggle('on', btn.dataset.photoPose === current.pose));
      };
      root.querySelectorAll('[data-photo-frame]').forEach((btn) => {
        btn.addEventListener('click', () => {
          current.frame = btn.dataset.photoFrame;
          refresh();
          if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
        });
      });
      root.querySelectorAll('[data-photo-bg]').forEach((btn) => {
        btn.addEventListener('click', () => {
          current.background = btn.dataset.photoBg;
          refresh();
          if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
        });
      });
      root.querySelectorAll('[data-photo-pose]').forEach((btn) => {
        btn.addEventListener('click', () => {
          current.pose = btn.dataset.photoPose;
          refresh();
          if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
        });
      });
      const run = async (mode) => {
        buttons.forEach((btn) => { btn.disabled = true; });
        if (status) status.textContent = 'Making your portrait…';
        try {
          const blob = await pufflePhotoBlob(sprite, current);
          const file = new File([blob], filename, { type: 'image/png' });
          let shared = false;
          if (mode === 'share' && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
            try {
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: `${name} · Sprite Hollow`, text: `${name} from the Sprite Puffle family.` });
                shared = true;
              }
            } catch (error) {
              if (error && error.name === 'AbortError') {
                if (status) status.textContent = 'Share cancelled. Your portrait is still here.';
                return;
              }
            }
          }
          if (!shared) pufflePhotoSave(blob, filename);
          if (status) status.textContent = shared ? 'Portrait shared.' : 'Portrait saved as a PNG.';
          if (typeof toast === 'function') toast(shared ? 'Portrait shared.' : 'Portrait saved to your downloads.', '📸');
          if (typeof Sfx !== 'undefined' && Sfx.pop) Sfx.pop();
        } catch (error) {
          if (status) status.textContent = 'This browser could not make the PNG. The preview is still shareable as an image.';
          if (typeof toast === 'function') toast('The portrait could not be encoded in this browser.', '⚠️');
          if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
        } finally {
          buttons.forEach((btn) => { btn.disabled = false; });
        }
      };
      root.querySelector('[data-photo-save]')?.addEventListener('click', () => run('save'));
      root.querySelector('[data-photo-share]')?.addEventListener('click', () => run('share'));
    },
  });
  return overlay;
}

if (typeof window !== 'undefined') {
  window.pufflePhotoBuildSVG = pufflePhotoBuildSVG;
  window.pufflePhotoDataURI = pufflePhotoDataURI;
  window.pufflePhotoBlob = pufflePhotoBlob;
  window.PUFFLE_PHOTO_BACKGROUNDS = PUFFLE_PHOTO_BACKGROUNDS;
  window.PUFFLE_PHOTO_POSES = PUFFLE_PHOTO_POSES;
  window.PUFFLE_PHOTO_FRAMES = PUFFLE_PHOTO_FRAMES;
  window.openPufflePhoto = openPufflePhoto;
}
