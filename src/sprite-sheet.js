/* Sheet animation for pets.
   Plays the Lumi sprite sheets from their frame indices: a pet whose sprite has
   `skin: 'lumi:<form>'` renders the sheet cell by cell through CSS keyframes, so
   idle, walk, fly, blink and celebrate all come straight from sheets.json.
   Frame indices: idle 0-7, walk 8-15, fly 16-23, blink 24,25,26,25,
   celebrate 27-32 on a 6x6 grid of 128px cells. */

const LUMI_SHEET_FORMS = {
  baby_lumi: { name: 'Baby Lumi', icon: '🍼' },
  lumi_sprite: { name: 'Lumi Sprite', icon: '💙' },
  crystal_lumi: { name: 'Crystal Lumi', icon: '💎' },
  royal_lumi: { name: 'Royal Lumi', icon: '👑' },
  shadow_lumi: { name: 'Shadow Lumi', icon: '🌙' },
  storm_lumi: { name: 'Storm Lumi', icon: '⚡' },
  ember_lumi: { name: 'Ember Lumi', icon: '🔥' },
  frost_lumi: { name: 'Frost Lumi', icon: '❄️' },
  nature_lumi: { name: 'Nature Lumi', icon: '🌿' },
  galaxy_lumi: { name: 'Galaxy Lumi', icon: '🌌' },
  void_lumi: { name: 'Void Lumi', icon: '🕳️' },
};
const LUMI_SHEET_KEYS = Object.keys(LUMI_SHEET_FORMS);

/* Index maps straight from assets/lumi/sheets.json. */
const LUMI_SHEET_CLIPS = {
  idle: { indices: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: true },
  walk: { indices: [8, 9, 10, 11, 12, 13, 14, 15], fps: 12, loop: true },
  fly: { indices: [16, 17, 18, 19, 20, 21, 22, 23], fps: 14, loop: true },
  blink: { indices: [24, 25, 26, 25], fps: 10, loop: true },
  celebrate: { indices: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36], fps: 12, loop: true },
  eat: { indices: [37, 38, 39, 40, 41, 42, 43, 44], fps: 10, loop: true },
  drink: { indices: [45, 46, 47, 48, 49, 50, 51, 52], fps: 10, loop: true },
  wash: { indices: [53, 54, 55, 56, 57, 58, 59, 60], fps: 10, loop: true },
  sleep: { indices: [61, 62, 63, 64, 65, 66], fps: 4, loop: true },
  catch: { indices: [67, 68, 69, 70, 71, 72, 73, 74], fps: 12, loop: true },
  throw: { indices: [75, 76, 77, 78, 79, 80, 81, 82], fps: 12, loop: true },
  relax: { indices: [83, 84, 85, 86, 87, 88, 89, 90], fps: 6, loop: true },
  bow: { indices: [91, 92, 93, 94, 95, 96, 97, 98], fps: 9, loop: true },
  speak: { indices: [99, 100, 101, 102, 103, 104, 105, 106], fps: 8, loop: true },
};
/* Action clips for every verb a puffle is asked to perform. Where the atlas has
   no bespoke frames, an action reuses the closest drawn clip at a fitting speed:
   run is walk quicker, bath is wash, play is celebrate, fight is throw, and a
   bathroom trip reuses the low, settled relax frames. */
Object.assign(LUMI_SHEET_CLIPS, {
  run: { indices: LUMI_SHEET_CLIPS.walk.indices, fps: 20, loop: true },
  sit: { indices: LUMI_SHEET_CLIPS.relax.indices, fps: 5, loop: true },
  nap: { indices: LUMI_SHEET_CLIPS.sleep.indices, fps: 3, loop: true },
  bath: { indices: LUMI_SHEET_CLIPS.wash.indices, fps: 9, loop: true },
  play: { indices: LUMI_SHEET_CLIPS.celebrate.indices, fps: 14, loop: true },
  cry: { indices: LUMI_SHEET_CLIPS.speak.indices, fps: 6, loop: true },
  fight: { indices: LUMI_SHEET_CLIPS.throw.indices, fps: 16, loop: true },
  pounce: { indices: LUMI_SHEET_CLIPS.catch.indices, fps: 16, loop: true },
  bathroom: { indices: LUMI_SHEET_CLIPS.relax.indices, fps: 4, loop: true },
});

window.LUMI_ACTION_CLIPS = {
  walk: 'walk', run: 'run', fly: 'fly', sit: 'sit', nap: 'nap', sleep: 'sleep',
  eat: 'eat', drink: 'drink', bath: 'bath', wash: 'wash', play: 'play',
  catch: 'catch', pounce: 'pounce', throw: 'throw', cry: 'cry', sad: 'cry',
  fight: 'fight', battle: 'fight', bathroom: 'bathroom', potty: 'bathroom',
  celebrate: 'celebrate', relax: 'relax', bow: 'bow', speak: 'speak', blink: 'blink',
  turn: 'turn', turnaround: 'turn', spin: 'turn',
  /* The painted puffle atlas has a dedicated special column per element. */
  special: 'special', magic: 'special', cast: 'special', ability: 'special',
};

const LUMI_SHEET_CELL = 128;
/* Resolution tiers: 128px cells for gameplay, 64 and 32 for small screens, and
   512px cells from the 8192 master for the kit slots that ship one. */
const LUMI_HI_CELL = 512;
const LUMI_HI_COLUMNS = 16;
const LUMI_HI_SLOTS = (typeof window !== 'undefined' && Array.isArray(window.LUMI_HI_SLOTS)) ? window.LUMI_HI_SLOTS : [];
/* A trimmed APK carries only the 128 px sheet, so it pins the tier instead of
   asking for absent `sheet@64.png`/`sheet@32.png` files on very small screens. */
const LUMI_MIN_TIER = (typeof window !== 'undefined' && Number(window.LUMI_MIN_TIER)) || 32;
function lumiTierFor(slot) {
  const width = typeof window !== 'undefined' ? (window.innerWidth || 0) : 0;
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  /* A stage sprite is drawn at roughly 40% of the viewport, times the device
     pixel ratio, so this is the pixel width the art has to fill. */
  const drawn = width * dpr * 0.4;
  if (drawn >= 300 && LUMI_HI_SLOTS.indexOf(slot) >= 0) return LUMI_HI_CELL;
  if (drawn >= 128 || LUMI_MIN_TIER >= 128) return 128;
  if (drawn >= 64) return 64;
  return 32;
}
const LUMI_SHEET_COLUMNS = 6;
const LUMI_THUMB_CELL = 48;
/* Body hue per form, so a player's dye can be applied as a hue shift instead of
   hiding their colour choice. */
const LUMI_SHEET_HUES = {
  baby_lumi: 200, lumi_sprite: 200, crystal_lumi: 190, royal_lumi: 219, shadow_lumi: 240,
  storm_lumi: 215, ember_lumi: 19, frost_lumi: 199, nature_lumi: 114, galaxy_lumi: 249, void_lumi: 258,
};

/* Puffle species read their painted elemental row from the 26-row atlas instead
   of hue-rotating a kit sheet. Row order mirrors LUMI_ELEMENT_ROSTER and
   tools/puffle_elements.py: front, three-quarter, side, back, idle, attack and
   the element's own special pose. */
const LUMI_PUFFLE_ATLAS = {
  image: 'assets/lumi/art/puffle-elemental-atlas.png',
  cell: 128,
  columns: 8,
  rows: 26,
};
const LUMI_PUFFLE_ATLAS_ALIASES = {
  air: 'whisp', wind: 'whisp', grass: 'bloom', nature: 'bloom', flower: 'floral', light: 'celestial',
  dark: 'shadow', space: 'cosmic', mythic: 'aether', void: 'hollow', ghost: 'spirit',
  arcane: 'mystic', desert: 'sand', lava: 'magma', sun: 'solar', moon: 'lunar',
  storm: 'storm', ice: 'frost', water: 'tideflit', electric: 'volt', earth: 'terra',
  poison: 'venom', metal: 'alloy', crystal: 'crystal', fire: 'ember', dream: 'dream',
  sound: 'sound', time: 'time', cosmic: 'cosmic', rainbow: 'aether',
};
/* The atlas has seven still poses, so an action picks the closest painted pose
   and the existing motion class supplies the bounce. */
const LUMI_PUFFLE_ATLAS_CLIPS = {
  idle: { seq: [4], fps: 1 },
  blink: { seq: [4], fps: 1 },
  walk: { seq: [2, 1, 2, 1], fps: 6 },
  run: { seq: [2, 1, 2, 1], fps: 10 },
  fly: { seq: [2, 1, 2, 1], fps: 8 },
  jump: { seq: [4, 0], fps: 6 },
  celebrate: { seq: [4, 0, 4, 0], fps: 6 },
  play: { seq: [4, 0, 4, 0], fps: 6 },
  sleep: { seq: [4], fps: 1 },
  nap: { seq: [4], fps: 1 },
  relax: { seq: [4], fps: 1 },
  sit: { seq: [4], fps: 1 },
  eat: { seq: [4], fps: 1 },
  drink: { seq: [4], fps: 1 },
  wash: { seq: [4, 2, 4], fps: 4 },
  bath: { seq: [4, 2, 4], fps: 4 },
  catch: { seq: [5], fps: 1 },
  throw: { seq: [5], fps: 1 },
  attack: { seq: [5], fps: 1 },
  fight: { seq: [5], fps: 1 },
  pounce: { seq: [5], fps: 1 },
  special: { seq: [6], fps: 1 },
  magic: { seq: [6], fps: 1 },
  cast: { seq: [6], fps: 1 },
  ability: { seq: [6], fps: 1 },
  bow: { seq: [0], fps: 1 },
  speak: { seq: [4], fps: 1 },
  cry: { seq: [4], fps: 1 },
  bathroom: { seq: [4], fps: 1 },
  turn: { seq: [0, 1, 2, 3], fps: 5 },
};
/* Rows come from the highest frame index, so a taller sheet is never squashed
   into a square (which used to show two cells at once). */
const LUMI_SHEET_ROWS = (() => {
  let max = 0;
  Object.values(LUMI_SHEET_CLIPS).forEach((clip) => clip.indices.forEach((index) => { max = Math.max(max, index); }));
  return Math.ceil((max + 1) / LUMI_SHEET_COLUMNS);
})();

const SPRITE_SHEET = (() => {
  let styleInjected = false;

  function styleTag() {
    if (styleInjected) return;
    const existing = document.getElementById('lumi-sheet-frames');
    if (existing) { styleInjected = true; return; }
    const rules = Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) => {
      const total = meta.indices.length;
      const steps = meta.indices.map((index, i) => {
        const col = index % LUMI_SHEET_COLUMNS;
        const row = Math.floor(index / LUMI_SHEET_COLUMNS);
        const pct = (i / total) * 100;
        return `${pct.toFixed(4)}%{transform:translate(${-col * LUMI_SHEET_CELL}px,${-row * LUMI_SHEET_CELL}px)}`;
      }).join('');
      return `@keyframes lumi-${clip}{${steps}100%{transform:translate(${-(meta.indices[total - 1] % LUMI_SHEET_COLUMNS) * LUMI_SHEET_CELL}px,${-Math.floor(meta.indices[total - 1] / LUMI_SHEET_COLUMNS) * LUMI_SHEET_CELL}px)}}`;
    }).join('');
    /* 512px tier: the 8192 master lays frames out sixteen across. */
    const hiRules = Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) => {
      const total = meta.indices.length;
      const steps = meta.indices.map((index, i) => {
        const col = index % LUMI_HI_COLUMNS;
        const row = Math.floor(index / LUMI_HI_COLUMNS);
        return `${((i / total) * 100).toFixed(4)}%{transform:translate(${-col * LUMI_HI_CELL}px,${-row * LUMI_HI_CELL}px)}`;
      }).join('');
      return `@keyframes lumi512-${clip}{${steps}}`;
    }).join('');
    const hiClipRules = Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) =>
      `.lumi-sheet[data-tier="512"][data-clip="${clip}"] .lumi-frames{animation:lumi512-${clip} ${(meta.indices.length / meta.fps).toFixed(3)}s steps(1,end) infinite}`).join('\n');
    const css = `${rules}
${hiRules}
${hiClipRules}
.lumi-sheet{overflow:hidden;display:block;width:100%;height:100%}
.lumi-sheet .lumi-frames{transform-origin:0 0;image-rendering:auto}
${Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) =>
      `.lumi-sheet[data-clip="${clip}"] .lumi-frames{animation:lumi-${clip} ${(meta.indices.length / meta.fps).toFixed(3)}s steps(1,end) infinite}`).join('\n')}
.lumi-sheet[data-clip="idle"].is-slow .lumi-frames{animation-duration:${(8 / 4).toFixed(3)}s}
.lumi-sheet.is-paused .lumi-frames{animation-play-state:paused}
.lumi-sheet[data-still] .lumi-frames{animation:none;transform:none}
${wearStyle()}
.lumi-sheet[data-still] .lumi-wear-move{animation:none}
.react-hop .lumi-frames,.sprite-actor.react-hop .lumi-frames{animation-name:lumi-celebrate;animation-duration:${(6 / 10).toFixed(3)}s}`;
    const el = document.createElement('style');
    el.id = 'lumi-sheet-frames';
    el.textContent = css;
    document.head.appendChild(el);
    styleInjected = true;
  }

  /* Resting pets idle and blink; walk, fly and celebrate come from the sprite's
     own clip or from the react-hop class the stage adds when a pet is petted. */
  /* The head moves inside every frame, so a hat or hair style has to follow the
     same per-frame bob and lean or it slides against the face. These keyframes
     repeat the pose maths the sheet was drawn with, one step per frame. */
  /* Sheet cells are drawn from a 128px frame and downscaled to the same 128px
     cell, so one frame unit is one cell pixel. */
  const FRAME_PX = 128;
  const POSE_AMP = 1.9;
  function poseOf(clip, index, count) {
    const phase = (index / Math.max(1, count - 1)) * Math.PI * 2;
    let bob = 0;
    let tilt = 0;
    if (clip === 'idle') bob = Math.sin(phase) * 2.6;
    else if (clip === 'walk') { bob = Math.abs(Math.sin(phase * 2)) * 2.8; tilt = Math.sin(phase) * 8; }
    else if (clip === 'fly') bob = Math.sin(phase) * 3.4 - 4;
    else if (clip === 'blink') bob = Math.sin(phase) * 1.2;
    else if (clip === 'celebrate') bob = -Math.abs(Math.sin(phase * 2)) * 5;
    else if (clip === 'eat') { bob = Math.abs(Math.sin(phase * 3)) * 2.4; tilt = Math.sin(phase * 3) * 4; }
    else if (clip === 'drink') { bob = Math.sin(phase) * 1.8; tilt = -7 + Math.sin(phase) * 2; }
    else if (clip === 'wash') { bob = Math.sin(phase * 4) * 2.2; tilt = Math.sin(phase * 3) * 5; }
    else if (clip === 'sleep') bob = Math.sin(phase) * 1.4 + 2;
    else if (clip === 'catch') { bob = -Math.abs(Math.sin(phase * 2)) * 3.4; tilt = Math.sin(phase * 2) * 5; }
    else if (clip === 'throw') { bob = Math.sin(phase) * 1.2; tilt = -5 + Math.sin(phase * 2) * 4; }
    else if (clip === 'relax') { bob = Math.sin(phase) * 1.2 + 2.6; tilt = Math.sin(phase * 0.5) * 3; }
    else if (clip === 'bow') { bob = Math.sin(phase * 2) * 1.2 + 2; tilt = Math.sin(phase) * 13; }
    else if (clip === 'speak') { bob = Math.sin(phase * 2) * 1.6; tilt = Math.sin(phase) * 3; }
    return { bob, tilt };
  }

  function wearPose(clip, index, count, eye) {
    const { bob, tilt } = poseOf(clip, index, count);
    /* The creature is rotated about its body centre, so the head is not a fixed
       pivot: track where the head cap actually lands each frame and move the
       hat there, then rotate it by the same lean. */
    const deg = Math.max(-18, Math.min(18, tilt * POSE_AMP));
    const rad = (deg * Math.PI) / 180;
    const bobPx = (bob * POSE_AMP * LUMI_SHEET_CELL) / FRAME_PX;
    const headDrop = 0.6 * 0.3 * 0.72 * LUMI_SHEET_CELL;
    /* The eyes sit on the body centre, so they bob and turn without the head
       offset the hat needs. */
    if (eye) return `translate(0.00px, ${bobPx.toFixed(2)}px) rotate(${(-deg).toFixed(2)}deg)`;
    const dx = -headDrop * Math.sin(rad);
    const dy = bobPx + headDrop * (1 - Math.cos(rad));
    return `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${(-deg).toFixed(2)}deg)`;
  }
  function wearStyle() {
    const keyframes = Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) => {
      const total = meta.indices.length;
      const steps = meta.indices.map((_, i) => `${((i / total) * 100).toFixed(4)}%{transform:${wearPose(clip, i, total)}}`).join('');
      return `@keyframes lumi-wear-${clip}{${steps}100%{transform:${wearPose(clip, total - 1, total)}}}`;
    }).join('');
    const rules = Object.entries(LUMI_SHEET_CLIPS).map(([clip, meta]) =>
      `.lumi-sheet[data-clip="${clip}"] .lumi-wear-move{animation:lumi-wear-${clip} ${(meta.indices.length / meta.fps).toFixed(3)}s steps(1,end) infinite}`).join('\n');
    return `${keyframes}
.lumi-wear-move{transform-origin:60px 56.4px}
${rules}`;
  }

  function clipFor(sprite, expr) {
    if (sprite && sprite.clip && LUMI_SHEET_CLIPS[sprite.clip]) return sprite.clip;
    if (expr === 'sleep') return 'sleep';
    return 'idle';
  }

  /* Each sprite gets its own filter ids, and one fluff rim per render. */
  let lumiFluffSeq = 0;

  function sheetMarkup(sprite, opts) {
    if (!sprite || typeof document === 'undefined') return null;
    const form = lumiFormFor(sprite);
    if (!LUMI_SHEET_FORMS[form]) return null;
    styleTag();
    const expr = opts.expr || 'idle';
    const clip = clipFor(sprite, expr);
    const motion = typeof spriteMotionFor === 'function' ? spriteMotionFor(sprite, expr) : 'hover';
    const sleeping = expr === 'sleep' ? ' is-slow' : '';
    const still = !!opts.still;
    /* Cards draw one still frame from the small sheet; the stage uses the full one. */
    const kit = lumiKitFor(sprite);
    let garment = lumiVariantFor(sprite);
    /* A trimmed build ships only some garments, so a pet whose slot was not
       shipped falls back to the kit's own base look instead of a 404. */
    const wardrobe = (typeof window !== 'undefined' && window.LUMI_WARDROBE && window.LUMI_WARDROBE[kit]) || null;
    if (wardrobe && !wardrobe.some((g) => Number(g.slot) === Number(garment))) garment = 0;
    const slot = `${kit}-${garment}`;
    /* Resolution follows the screen: 128px cells by default, 64 or 32 for small
       screens, and the 8192 master's 512px frames where that pack exists. */
    const tier = still ? 128 : lumiTierFor(slot);
    const cell = still ? LUMI_THUMB_CELL : tier;
    const cols = tier === LUMI_HI_CELL ? LUMI_HI_COLUMNS : LUMI_SHEET_COLUMNS;
    const rows = tier === LUMI_HI_CELL ? LUMI_HI_COLUMNS : LUMI_SHEET_ROWS;
    const src = still
      ? lumiKitAsset(slot, 'thumb')
      : tier === LUMI_HI_CELL
        ? `assets/lumi/hi/${slot}@512.png`
        : lumiKitAsset(slot, `sheet${tier === 128 ? '' : `@${tier}`}`);
    const palette = typeof resolvePalette === 'function' ? resolvePalette(sprite) : null;
    /* The species shift keeps every species distinct, the breed shift recolours
       it per breed, and a custom dye adds to both. */
    const tint = lumiTintFor(sprite);
    /* The exact palette paints the eyes and trims; the baked body is matched to
       its primary, so a variant reads as its own colour. */
    /* The style the sprite wears: its own pick, else its species' elemental
       style, so every puffle type keeps the eyes painted for it. */
    const puffleStyle = typeof lumiPuffleStyleOfSprite === 'function' ? lumiPuffleStyleOfSprite(sprite) : (sprite && sprite.puffleVariant);
    const puffle = typeof lumiPufflePalette === 'function' ? lumiPufflePalette(puffleStyle) : null;
    const variantTint = typeof lumiPuffleTint === 'function' ? lumiPuffleTint(puffleStyle) : { hue: 0, sat: 1, bright: 1 };
    let shift = tint.hue + lumiBreedHue(sprite) + variantTint.hue;
    /* Every sprite sits inside the player's current colours, then steps away by
       its species and breed hue so no two are the same shade. */
    const theme = lumiThemePalette();
    if (theme && theme.body) {
      /* Kit sheets are drawn in the neutral Lumi palette, so the theme rotates
         from that hue rather than from the form's own colour. */
      const delta = ((hueOfHex(theme.body) - LUMI_SHEET_HUES.lumi_sprite + 540) % 360) - 180;
      shift += Math.round(delta * 0.45);
    }
    if (palette && sprite.palette && sprite.palette !== 'native') {
      const target = hueOfHex(palette.body);
      shift += Math.round(((target - LUMI_SHEET_HUES[form] + 540) % 360) - 180);
    }
    /* Kit fills use the player's own colours, so the outfit matches the pet. */
    const kitPalette = theme && theme.body
      ? { body: theme.body, light: theme.light || palette.light, deep: theme.deep || palette.deep, accent: theme.accent || palette.accent }
      : palette;
    /* Every named form of a line sits a step further around the colour wheel and
       a little richer, so stage 1 to stage 5 of one species are five visibly
       different colourways instead of the same fur with a new label. */
    const stageForm = typeof window.puffleEvolutionStageIndex === 'function'
      ? window.puffleEvolutionStageIndex(sprite.stage)
      : 0;
    const stageTint = typeof window.lumiStageTint === 'function'
      ? window.lumiStageTint(stageForm)
      : { hue: 0, sat: 1, bright: 1 };
    shift += stageTint.hue;
    const dye = ` style="filter:hue-rotate(${shift}deg) saturate(${(tint.sat * variantTint.sat * stageTint.sat).toFixed(2)}) brightness(${(tint.bright * variantTint.bright * stageTint.bright).toFixed(2)})"`;
    const kitArt = lumiKitMarkup(sprite, kitPalette);
    /* Rolled face traits: the sheet bakes the eyes and mouth, so these are rings
       around each eye (carrying the iris colour) plus a small breed mouth. */
    const traitRoll = typeof spriteTraits === 'function' ? spriteTraits(sprite) : null;
    const traitInk = (kitPalette || palette || {}).deep || '#1d1734';
    const traitArt = traitRoll ? `<g class="lumi-traits" pointer-events="none">
      <ellipse cx="53" cy="61" rx="4.8" ry="5.6" fill="none" stroke="${traitRoll.iris}" stroke-width="1.7" opacity=".9"/>
      <ellipse cx="74" cy="61" rx="4.8" ry="5.6" fill="none" stroke="${traitRoll.iris}" stroke-width="1.7" opacity=".9"/>
      ${lumiTraitEyes(traitRoll.eyeStyle, traitRoll.iris, traitInk)}
      ${lumiTraitMouth(traitRoll.mouth, traitInk)}
    </g>` : '';
    /* Collection styles keep the chart's headpiece and aura on painted frames
       too, using the style's own palette rather than the tinted body. */
    const styleElement = typeof ELEMENTS !== 'undefined' ? ELEMENTS[sprite && sprite.element] : null;
    const styleArt = styleElement && styleElement.collectionTier && typeof puffleStyleArt === 'function'
      ? puffleStyleArt(puffleStyle, {
        body: (puffle && puffle.primary) || (palette && palette.body),
        light: (puffle && puffle.secondary) || (palette && palette.light),
        deep: (puffle && (puffle.eyeShadow || puffle.deep)) || (palette && palette.deep),
        accent: (puffle && (puffle.gold || puffle.iris || puffle.leafGlow || puffle.leaf)) || (palette && palette.accent),
      }, { view: 'front', element: styleElement.puffleElement })
      : null;
    const wear = palette && typeof hairMarkup === 'function'
      ? `<g class="lumi-wear" transform="scale(${(LUMI_SHEET_CELL / 120).toFixed(4)})"><g class="lumi-wear-move">${hairMarkup(sprite.hair, palette)}${styleArt ? styleArt.front : ''}${lumiAccessoryMarkup(sprite, puffle ? { ...(palette || {}), accent: puffle.gold || puffle.leafGlow || puffle.leaf, deep: puffle.eyeShadow || (palette && palette.deep), light: puffle.secondary || (palette && palette.light) } : (kitPalette || palette))}${typeof hatMarkup === 'function' ? hatMarkup(sprite.hat, palette) : ''}</g></g>`
      : '';
    /* One set of eyes only: every sheet frame already draws the face, so the
       old iris overlay is gone. The style tint still rotates the whole frame,
       which carries the eyes with it. */
    const ability = lumiAbilityFor(sprite);
    /* A soft fur rim: the frame's own alpha, grown a little and tinted to the
       body colour, so every kit reads rounder and fluffier without repainting
       the baked sheets. */
    /* Fifth ascension forms outrank the player's rim setting: they are always
       drawn round, extra furry and haloed so they read as a step beyond form 4. */
    const formIndex = stageForm;
    const ascension = formIndex >= 4;
    const fluffLevel = ascension
      ? 'strong'
      : ((typeof state !== 'undefined' && state.theme && state.theme.fluff) || 'soft');
    const fluffOn = fluffLevel !== 'off';
    const fluffStrength = ascension
      ? { radius: 3.6, blur: 0.55 }
      : fluffLevel === 'strong' ? { radius: 3.2, blur: 0.6 } : { radius: 2.2, blur: 0.45 };
    const fluffId = `fluff-${lumiFluffSeq += 1}`;
    /* The rim matches the creature's own fur, not the player's theme, so the
       edge never reads as a different colour from the body. */
    const fluffColor = (palette || kitPalette || {}).body || '#cfd8e3';
    const fluff = !fluffOn ? '' : `<defs><filter id="${fluffId}" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="${fluffStrength.radius}" result="grown"/>
        <feFlood flood-color="${fluffColor}" result="tint"/>
        <feComposite in="tint" in2="grown" operator="in" result="rim"/>
        <feGaussianBlur in="rim" stdDeviation="${fluffStrength.blur}" result="soft"/>
        <feMerge><feMergeNode in="soft"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter></defs>`;
    const fluffAttr = fluffOn ? ` filter="url(#${fluffId})"` : '';
    /* Ascension silhouette: a bigger, rounder fur shape with mantle wings, a
       crown of tufts and a tail puff, all built from circles so the form reads
       as its own creature rather than form 4 with a halo. */
    /* Wings and crown take their colour from the element's own family, so a Fire
       ascension reads hot and a Shadow one reads violet even though both share
       the same sheet art. */
    const ascFamily = typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(sprite.element) : null;
    let famSpec = null;
    try {
      if (typeof PUFFLE_EVOLUTION_FAMILIES !== 'undefined' && ascFamily) famSpec = PUFFLE_EVOLUTION_FAMILIES[ascFamily] || null;
    } catch (e) { famSpec = null; }
    const ascDeep = famSpec ? famSpec.body : ((palette || kitPalette || {}).deep || fluffColor);
    const ascLight = famSpec ? famSpec.wing : ((palette || kitPalette || {}).light || '#ffffff');
    const ascendArt = ascension ? `<g class="lumi-ascend" pointer-events="none">
        <ellipse cx="50" cy="52" rx="46" ry="44" fill="${fluffColor}" fill-opacity="0.10"/>
        ${[-1, 1].map((side) => [0, 1, 2].map((i) => `<circle cx="${(50 + side * (34 + i * 5)).toFixed(1)}" cy="${(51 - i * 4).toFixed(1)}" r="${(11 - i * 2).toFixed(1)}" fill="${ascDeep}" fill-opacity="${(0.42 - i * 0.08).toFixed(2)}"/>`).join('')).join('')}
        <circle cx="73" cy="67" r="7" fill="${ascDeep}" fill-opacity="0.34"/>
        ${[-9, 0, 9].map((dx, i) => `<circle cx="${50 + dx}" cy="${22 - (i === 1 ? 4 : 0)}" r="${i === 1 ? 5 : 4}" fill="${ascLight}" fill-opacity="0.5"/>`).join('')}
        <circle cx="50" cy="50" r="47" fill="none" stroke="${fluffColor}" stroke-opacity="0.30" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="${fluffColor}" stroke-opacity="0.18" stroke-width="1.5" stroke-dasharray="3 5"/>
        ${[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 44;
          const y = 50 + Math.sin(rad) * 44;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="${fluffColor}" fill-opacity="0.75"/>`;
        }).join('')}
      </g>` : '';
    /* Element effects: four families of particle art — fire, vine, bubble and
       spark — so an elemental palette reads as a living element, not a colour. */
    const fxFamily = typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(sprite.element) : null;
    const fxKind = typeof window.lumiElementFx === 'function' && fxFamily ? window.lumiElementFx(fxFamily) : null;
    const fxTint = (palette || kitPalette || {}).accent || (palette || kitPalette || {}).light || fluffColor;
    const FX = fxKind === 'fire'
      ? `<circle cx="78" cy="74" r="2.6" fill="#FFB347" fill-opacity="0.85"/><circle cx="86" cy="62" r="1.8" fill="#FF8C42" fill-opacity="0.75"/><circle cx="72" cy="60" r="1.4" fill="#FFD166" fill-opacity="0.8"/><circle cx="84" cy="80" r="1.1" fill="#FF6B35" fill-opacity="0.7"/>`
      : fxKind === 'vine'
        ? `<ellipse cx="22" cy="70" rx="4.6" ry="2.2" fill="#5FC24B" fill-opacity="0.8" transform="rotate(-32 22 70)"/><ellipse cx="16" cy="58" rx="3.6" ry="1.8" fill="#9BE07A" fill-opacity="0.75" transform="rotate(28 16 58)"/><ellipse cx="84" cy="66" rx="3.2" ry="1.6" fill="#5FC24B" fill-opacity="0.6" transform="rotate(40 84 66)"/>`
        : fxKind === 'bubble'
          ? `<circle cx="20" cy="70" r="4.2" fill="none" stroke="#A8DFF5" stroke-opacity="0.85" stroke-width="1.4"/><circle cx="82" cy="64" r="3" fill="none" stroke="#E8FAFF" stroke-opacity="0.8" stroke-width="1.2"/><circle cx="76" cy="78" r="1.8" fill="#A8DFF5" fill-opacity="0.7"/><circle cx="28" cy="58" r="2.2" fill="#A8DFF5" fill-opacity="0.55"/>`
          : fxKind === 'spark'
            ? `<circle cx="80" cy="70" r="2.2" fill="#FFF3A8" fill-opacity="0.9"/><path d="M74 78 L80 72 L86 78" fill="none" stroke="${fxTint}" stroke-opacity="0.8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="62" r="1.6" fill="#FFF3A8" fill-opacity="0.8"/><path d="M16 70 L20 64 L24 70" fill="none" stroke="${fxTint}" stroke-opacity="0.6" stroke-width="1.3" stroke-linecap="round"/>`
            : '';
    const fxLevel = (typeof state !== 'undefined' && state.theme && state.theme.elementFx) || 'soft';
    const fxArt = FX && fxLevel !== 'off'
      ? `<g class="lumi-fx lumi-fx-${fxKind}" opacity="${fxLevel === 'full' ? 1 : 0.55}" pointer-events="none">${FX}</g>`
      : '';
    return `<svg class="sprite-motion motion-${motion} lumi-sheet${sleeping}" data-tier="${tier}" data-clip="${still ? 'idle' : clip}" data-sheet="${form}" data-kit="${lumiKitFor(sprite)}" data-ability="${ability.name}" data-fx="${fxKind || 'none'}"${still ? ' data-still="1"' : ''} viewBox="0 0 ${LUMI_SHEET_CELL} ${LUMI_SHEET_CELL}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${ability.icon} ${ability.name}">
      <title>${ability.icon} ${ability.name}</title>
      ${fluff}
      ${ascendArt}
      ${fxArt}
      <image class="lumi-frames" href="${src}"${dye}${fluffAttr} x="0" y="0" width="${cols * LUMI_SHEET_CELL}" height="${rows * LUMI_SHEET_CELL}" preserveAspectRatio="none"/>
      ${kitArt}
      ${traitArt}
      ${wear}
    </svg>`;
  }

  /* Generated sheets add clips of their own (turn-around), so the gate accepts
     either registry. */
  function knownClip(clip) {
    return !!(LUMI_SHEET_CLIPS[clip] || LUMI_PUFFLE_ATLAS_CLIPS[clip] || (typeof GENERATED_CLIPS !== 'undefined' && GENERATED_CLIPS[clip]));
  }
  function setClip(el, clip) {
    if (!el || !knownClip(clip)) return;
    if (el.hasAttribute && el.hasAttribute('data-still')) return;
    el.setAttribute('data-clip', clip);
  }

  /* Play one clip for a while, then go back to the pet's resting clip. */
  function play(el, clip, ms = 1600) {
    if (!el || !knownClip(clip)) return;
    const sheet = el.matches && el.matches('.lumi-sheet') ? el : el.querySelector('.lumi-sheet');
    if (!sheet) return;
    const base = sheet.dataset.baseClip || 'idle';
    sheet.dataset.baseClip = base;
    setClip(sheet, clip);
    clearTimeout(sheet._clipTimer);
    sheet._clipTimer = setTimeout(() => { if (sheet.isConnected) setClip(sheet, base); }, ms);
  }

  function setSkin(spriteLike, skin) {
    if (!spriteLike) return;
    spriteLike.skin = skin && LUMI_SHEET_FORMS[String(skin).slice(5)] ? skin : null;
  }

  /* Blink is part of the index map but should not loop over idle, so idle
     sheets drop into the blink clip for one cycle every few seconds. */
  let ticker = null;
  function startBlink() {
    if (ticker || typeof document === 'undefined') return;
    ticker = setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      document.querySelectorAll('.lumi-sheet[data-sheet]').forEach((el) => {
        if (el.classList.contains('is-slow') || el.hasAttribute('data-still')) return;
        const next = Number(el.dataset.blinkAt || 0);
        if (!next) { el.dataset.blinkAt = String(now + 3000 + Math.random() * 3000); return; }
        if (now < next) return;
        const base = el.dataset.baseClip || el.getAttribute('data-clip') || 'idle';
        el.dataset.baseClip = base;
        setClip(el, 'blink');
        el.dataset.blinkAt = String(now + 3000 + Math.random() * 3000);
        setTimeout(() => { if (el.isConnected) setClip(el, base); }, (LUMI_SHEET_CLIPS.blink.indices.length / LUMI_SHEET_CLIPS.blink.fps) * 1000);
      });
    }, 400);
  }

  return { forms: LUMI_SHEET_FORMS, keys: LUMI_SHEET_KEYS, clips: LUMI_SHEET_CLIPS, markup: sheetMarkup, clipFor, setClip, play, setSkin, startBlink, styleTag };
})();

function hueOfHex(hex) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length < 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (!d) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

/* Every sprite wears the Lumi design, not just pets that picked a skin: the
   form comes from the pet's own body colour, so each species keeps its look
   and all of them get the same animated sheet body. An explicit skin wins. */
function lumiHash(text) {
  let h = 2166136261;
  const key = String(text || 'lumi');
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

let lumiKeyCache = null;
function lumiSpeciesKeys() {
  if (lumiKeyCache) return lumiKeyCache;
  lumiKeyCache = (typeof ELEMENTS === 'object' && ELEMENTS) ? Object.keys(ELEMENTS).sort() : [];
  return lumiKeyCache;
}

/* Eleven poses for thousands of species: the species index is laid out in mixed
   radix over form (11), hue (97), saturation (25) and brightness (17), so a
   species gets a combination no other species has while staying near its own
   palette. 11 x 97 x 25 = 26,675 distinct designs before brightness repeats. */
const LUMI_DESIGN_HUES = 97;
const LUMI_DESIGN_SATS = 25;
const LUMI_DESIGN_BRIGHT = 17;
function lumiDesignFor(sprite) {
  const key = String((sprite && sprite.element) || (sprite && sprite.id) || 'lumi');
  const keys = lumiSpeciesKeys();
  let index = keys.indexOf(key);
  if (index < 0) index = lumiHash(key) % 14000;
  const formIndex = index % LUMI_SHEET_KEYS.length;
  return {
    form: LUMI_SHEET_KEYS[formIndex],
    hue: (Math.floor(index / LUMI_SHEET_KEYS.length) % LUMI_DESIGN_HUES) - 48,
    sat: 0.88 + (Math.floor(index / (LUMI_SHEET_KEYS.length * LUMI_DESIGN_HUES)) % LUMI_DESIGN_SATS) / 100,
    bright: 0.92 + (Math.floor(index / (LUMI_SHEET_KEYS.length * LUMI_DESIGN_HUES * LUMI_DESIGN_SATS)) % LUMI_DESIGN_BRIGHT) / 100,
  };
}

function lumiFormFor(sprite) {
  const skin = String((sprite && sprite.skin) || '');
  if (skin.indexOf('lumi:') === 0 && LUMI_SHEET_FORMS[skin.slice(5)]) return skin.slice(5);
  if (!sprite) return 'lumi_sprite';
  return lumiDesignFor(sprite).form;
}

function lumiTintFor(sprite) {
  const design = lumiDesignFor(sprite);
  return { hue: design.hue, sat: design.sat, bright: design.bright };
}

/* The sheet art is one creature, so a breed adds its own build: ears, eyes,
   limbs and garment, plus its own colour shift. Seven kit families cover the
   whole breed list, and unknown breeds fall back to a stable hash pick. */
const LUMI_KIT_FAMILIES = ['round', 'leaf', 'fin', 'horn', 'crystal', 'glow', 'fur', 'spike', 'shell', 'feather', 'flower', 'robot', 'snow', 'dragon'];
const LUMI_KIT_WORDS = [
  ['flower', 'petal flower blossom bloom valentine'],
  ['leaf', 'sprig bun tuft nature spring leaf cloud_bunny'],
  ['shell', 'shell urchin snail'],
  ['feather', 'feather chick bird owl'],
  ['spike', 'spike thorn thistle'],
  ['robot', 'cyber neon robot mech'],
  ['snow', 'frozen frost ice snow'],
  ['dragon', 'dragon demon firedemon'],
  ['fin', 'fin flit tide fish'],
  ['horn', 'horn lanky tower cone wedge'],
  ['crystal', 'crystal gem diamond prism mini_crystal glass'],
  ['glow', 'wisp ghost moon star angel glow lantern orb spark'],
  ['fur', 'cat fox were zombie vampire christmas halloween'],
];

function lumiKitFor(sprite) {
  const breed = String((sprite && sprite.breed) || 'puff').toLowerCase();
  for (let i = 0; i < LUMI_KIT_WORDS.length; i += 1) {
    const words = LUMI_KIT_WORDS[i][1].split(' ');
    if (words.some((word) => breed.indexOf(word) >= 0)) return LUMI_KIT_WORDS[i][0];
  }
  return LUMI_KIT_FAMILIES[lumiHash(breed) % LUMI_KIT_FAMILIES.length];
}

/* Two shape variants per kit: breeds inside a family split across them so two
   breeds rarely share a silhouette. */
const LUMI_VARIANTS = ['0', '1', '2', '3', '4', '5'];
function lumiVariantFor(sprite) {
  /* The wardrobe stores a slot on the pet; each slot has its own baked sheet. */
  const slot = Number(sprite && sprite.garment);
  const safe = Number.isInteger(slot) ? Math.min(LUMI_VARIANTS.length - 1, Math.max(0, slot)) : 0;
  return LUMI_VARIANTS[safe];
}

/* A breed trinket sits on the head with the hat, so two breeds that share a
   kit and variant still read as different creatures. */
const LUMI_ACCESSORIES = ['bow', 'bell', 'gem', 'leaf', 'flower', 'star', 'ribbon', 'heart', 'acorn', 'snowflake'];
/* Only the pet's own choice draws a trinket. Sprites with no accessory — the
   default, and every older save that predates the field — wear nothing, so no
   stray gem floats beside the head. */
function lumiAccessoryFor(sprite) {
  const choice = String((sprite && sprite.accessory) || 'none');
  return LUMI_ACCESSORIES.includes(choice) ? choice : null;
}

function lumiAccessoryMarkup(sprite, palette) {
  const kind = lumiAccessoryFor(sprite);
  if (!kind) return '';
  const accent = (palette && palette.accent) || '#ffcf7a';
  const light = (palette && palette.light) || '#d8fff0';
  const deep = (palette && palette.deep) || '#2d6b5c';
  const at = 'translate(93 41)';
  const wire = `stroke="${deep}" stroke-width="1.2" stroke-linejoin="round"`;
  if (kind === 'bow') {
    return `<g transform="${at}"><path d="M0 0 L-9 -6 L-9 6 Z" fill="${accent}" ${wire}/><path d="M0 0 L9 -6 L9 6 Z" fill="${accent}" ${wire}/><circle r="2.4" fill="${light}" ${wire}/></g>`;
  }
  if (kind === 'bell') {
    return `<g transform="${at}"><path d="M-4 -2 A4.4 4.4 0 0 1 4 -2 Z" fill="${accent}" ${wire}/><circle cy="2.4" r="2" fill="${deep}"/><path d="M0 -9 L0 -6" ${wire}/></g>`;
  }
  if (kind === 'gem') {
    return `<g transform="${at}"><path d="M0 -7 L6 0 L0 8 L-6 0 Z" fill="${accent}" ${wire}/><path d="M0 -7 L0 8" stroke="${light}" stroke-width="1.2"/></g>`;
  }
  if (kind === 'leaf') {
    return `<g transform="${at}"><path d="M0 6 C-8 2 -7 -6 0 -8 C7 -6 8 2 0 6 Z" fill="${light}" ${wire}/><path d="M0 5 L0 -6" ${wire}/></g>`;
  }
  if (kind === 'flower') {
    return `<g transform="${at}"><g fill="${accent}" ${wire}><circle cx="0" cy="-5.4" r="3"/><circle cx="5.1" cy="-1.7" r="3"/><circle cx="3.2" cy="4.3" r="3"/><circle cx="-3.2" cy="4.3" r="3"/><circle cx="-5.1" cy="-1.7" r="3"/></g><circle r="2.2" fill="${light}" ${wire}/></g>`;
  }
  if (kind === 'star') {
    return `<g transform="${at}"><path d="M0 -8 L2.4 -2.4 L8 -1.7 L3.8 2.3 L5 8 L0 4.8 L-5 8 L-3.8 2.3 L-8 -1.7 L-2.4 -2.4 Z" fill="${accent}" ${wire}/></g>`;
  }
  if (kind === 'heart') {
    return `<g transform="${at}"><path d="M0 7 C-8 0 -9 -5 -4.5 -7.5 C-1.5 -9 0 -5.5 0 -3.2 C0 -5.5 1.5 -9 4.5 -7.5 C9 -5 8 0 0 7 Z" fill="${accent}" ${wire}/></g>`;
  }
  if (kind === 'acorn') {
    return `<g transform="${at}"><path d="M-5.5 -2 C-5.5 -6.5 5.5 -6.5 5.5 -2 Z" fill="${deep}"/><path d="M-4 -1 C-4 6 4 6 4 -1 Z" fill="${accent}" ${wire}/><path d="M0 -6 L0 -9" ${wire}/></g>`;
  }
  if (kind === 'snowflake') {
    return `<g transform="${at}"><path d="M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4" ${wire}/><circle r="2" fill="${light}" ${wire}/></g>`;
  }
  return `<g transform="${at}"><path d="M-8 -4 C-4 -8 4 -8 8 -4 L8 3 C4 -1 -4 -1 -8 3 Z" fill="${accent}" ${wire}/><path d="M0 -5 L0 4" ${wire}/></g>`;
}

function lumiBreedHue(sprite) {
  const breed = String((sprite && sprite.breed) || 'puff');
  /* The breed's place in the shared list steps its hue by 37 across a range of
     81: every breed gets its own shade, never a clash with a neighbour. */
  if (typeof BREEDS === 'object' && BREEDS && BREEDS[breed]) {
    const index = Object.keys(BREEDS).sort().indexOf(breed);
    if (index >= 0) return ((index * 37) % 81) - 40;
  }
  return (lumiHash(`breed:${breed}`) % 81) - 40;
}

/* Every kit draws from the shared ability table, so its modifier lands in the
   same care and coin maths every other ability uses. Breeds spread across the
   family's abilities instead of all sharing one, so a breed keeps its own perk. */
const LUMI_KIT_ABILITIES = {
  round: ['float', 'cloud_hop', 'fluff_puff', 'glint_step', 'tiny_jump'],
  leaf: ['vine_heal', 'leaf_storm', 'blossom_burst', 'petal_dance', 'sparkle'],
  fin: ['wave_dash', 'wing_flap', 'moon_glide', 'glint_step', 'cloud_hop'],
  horn: ['dark_dash', 'shadow_blink', 'star_pounce', 'night_eye', 'phase_step'],
  crystal: ['crystal_shield', 'gem_burst', 'crystal_shard', 'prism_cut', 'hard_shine'],
  glow: ['star_trail', 'sparkle', 'supernova', 'neon_glow', 'sunbeam'],
  fur: ['cute_blink', 'star_pounce', 'tail_glow', 'void_purr', 'fluff_puff'],
};

/* Breeds are laid out across the whole ability table from a per-kit offset, so
   every breed in a kit carries a different perk and the pools above are only
   the fallback for a breed the table does not know yet. */
let lumiAbilityPlanCache = null;
let lumiAbilityPlanBreeds = 0;
function lumiAbilityPlan() {
  const breeds = typeof BREEDS === 'object' && BREEDS ? Object.keys(BREEDS).sort() : [];
  /* Species register themselves as the data files load, so the plan is rebuilt
     whenever the breed list grows instead of keeping a stale assignment. */
  if (lumiAbilityPlanCache && lumiAbilityPlanBreeds === breeds.length) return lumiAbilityPlanCache;
  const keys = typeof ABILITY_KEYS !== 'undefined' ? ABILITY_KEYS.slice().sort() : [];
  const plan = new Map();
  const used = new Set();
  let cursor = 0;
  breeds.forEach((breed) => {
    if (!keys.length) { plan.set(breed, 'float'); return; }
    /* First ability after the cursor no other breed already holds, so every
       breed gets its own perk while the table has room for it. */
    for (let step = 0; step < keys.length; step += 1) {
      const index = (cursor + step) % keys.length;
      const candidate = keys[index];
      if (used.has(candidate)) continue;
      used.add(candidate);
      plan.set(breed, candidate);
      cursor = index + 1;
      return;
    }
    plan.set(breed, keys[cursor % keys.length]);
    cursor += 1;
  });
  lumiAbilityPlanCache = plan;
  lumiAbilityPlanBreeds = breeds.length;
  return plan;
}

function lumiKitAbilityId(sprite) {
  const breed = String((sprite && sprite.breed) || 'puff');
  const planned = lumiAbilityPlan().get(breed);
  if (planned) return planned;
  const pool = LUMI_KIT_ABILITIES[lumiKitFor(sprite)] || LUMI_KIT_ABILITIES.round;
  return pool[lumiHash(breed) % pool.length];
}

function lumiAbilityFor(sprite) {
  const id = lumiKitAbilityId(sprite);
  const info = typeof abilityInfo === 'function' ? abilityInfo(id) : null;
  const element = typeof ELEMENTS === 'object' && ELEMENTS && ELEMENTS[sprite && sprite.element];
  const prefix = element ? element.name : 'Lumi';
  if (!info) return { id, icon: '✨', name: `${prefix} Lumi`, blurb: '' };
  return { id, icon: info.icon, name: `${prefix} ${info.name}`, blurb: info.blurb || '', mods: info.mods || {}, effect: info.effect || {} };
}

/* The colours every sprite is tinted toward: the player's custom dye when one
   is set, otherwise the active pet's own palette. */
function lumiThemePalette() {
  if (typeof state === 'undefined' || !state || !Array.isArray(state.sprites)) return null;
  const custom = state.sprites.find((pet) => pet && pet.palette === 'custom' && pet.custom && pet.custom.body);
  if (custom) return custom.custom;
  const active = state.sprites.find((pet) => pet && pet.id === state.activeId) || state.sprites[0];
  if (!active || typeof resolvePalette !== 'function') return null;
  return resolvePalette(active);
}

/* Ears, eyes, limbs and garment, drawn over the sheet in the same 128 cell. */
/* Breed-flavoured mouth for sheet sprites, drawn under the eyes in the same
   128 cell the kit overlay uses. */
function lumiTraitMouth(style, ink) {
  const line = `stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".72"`;
  if (style === 'cat') return `<path d="M57 78q3.5 3.6 7 0q3.5 3.6 7 0" ${line}/>`;
  if (style === 'open') return `<ellipse cx="64" cy="79" rx="3.4" ry="4" fill="${ink}" opacity=".5"/>`;
  if (style === 'blep') return `<path d="M57 78q7 5 14 0" ${line}/><path d="M61.4 79.6h5.2v2.8a2.6 2.6 0 0 1-5.2 0Z" fill="#ff8fa3" opacity=".85"/>`;
  if (style === 'fang') return `<path d="M57 78q7 5.5 14 0" ${line}/><path d="M60.4 79.4l1.4 3.2 1.4-3.2Z" fill="#ffffff" opacity=".9"/>`;
  if (style === 'wave') return `<path d="M58 78q3 2.8 6 0q3 2.8 6 0" ${line}/>`;
  if (style === 'dot') return `<ellipse cx="64" cy="78.4" rx="1.6" ry="2" fill="${ink}" opacity=".55"/>`;
  return '';
}

/* The sheet bakes the face, so a chosen eye style is drawn as a small glyph
   inside the iris ring at each baked eye. Honest overlay: it marks the style
   the player picked instead of pretending the painted frames were redrawn. */
function lumiTraitEyes(style, iris, ink) {
  if (!style || style === 'breed' || style === 'classic') return '';
  const one = (x) => {
    const open = x < 60;
    switch (style) {
      case 'button': return `<circle cx="${x}" cy="61" r="3.1" fill="${ink}" opacity=".78"/><circle cx="${x + 1.1}" cy="59.6" r=".9" fill="#fff" opacity=".9"/>`;
      case 'dot': return `<circle cx="${x}" cy="61" r="2.3" fill="${ink}" opacity=".8"/>`;
      case 'spiral': return `<path d="M${x} 61a2.8 2.8 0 1 0 2.2-2.2 1.6 1.6 0 1 0 1 1.5" fill="none" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" opacity=".8"/>`;
      case 'glow': return `<circle cx="${x}" cy="61" r="3.8" fill="${iris}" opacity=".35"/><circle cx="${x}" cy="61" r="2.1" fill="#fff" opacity=".85"/>`;
      case 'ring': return `<circle cx="${x}" cy="61" r="2.6" fill="none" stroke="${iris}" stroke-width="1.6"/>`;
      case 'wink': return open ? '' : `<path d="M${x - 3.4} 61q3.4 3 6.8 0" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`;
      case 'sparkle': return `<path d="M${x} 57.6l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8Z" fill="#fff" opacity=".95"/>`;
      case 'sleepy': return `<path d="M${x - 4} 59.4q4 2.6 8 0" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`;
      case 'wide': return `<circle cx="${x}" cy="61" r="4.4" fill="none" stroke="${ink}" stroke-width="1.3" opacity=".7"/>`;
      case 'star': return `<path d="M${x} 56.6l1.4 3 3.2.4-2.3 2.3.6 3.2-2.9-1.6-2.9 1.6.6-3.2-2.3-2.3 3.2-.4Z" fill="${iris}" stroke="${ink}" stroke-width=".7" opacity=".9"/>`;
      case 'heart': return `<path d="M${x} 59c-1.4-1.9-4-.8-4 1.2 0 1.9 4 3.9 4 3.9s4-2 4-3.9c0-2-2.6-3.1-4-1.2Z" fill="#ff9ec7" stroke="${ink}" stroke-width=".7" opacity=".95"/>`;
      case 'anime': return `<circle cx="${x + 1.2}" cy="58.6" r="1.5" fill="#fff" opacity=".95"/><path d="M${x - 4.4} 57.4q4.4-2 8.8.4" fill="none" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>`;
      case 'lashes': return `<path d="M${x + 3.2} 57.4l2-1.4M${x + 4} 59.4l2.2-.6" stroke="${ink}" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>`;
      case 'pixel': return `<rect x="${x - 2.6}" y="58.4" width="5.2" height="5.2" fill="${ink}" opacity=".8"/><rect x="${x - 1.6}" y="59.4" width="1.6" height="1.6" fill="#fff"/>`;
      case 'teary': return `<circle cx="${x}" cy="61" r="2.6" fill="${iris}" opacity=".75"/><path d="M${x - 1.4} 66c-1.2 1.8-1 3 .4 3s1.4-1.2 0-3Z" fill="#9fdcff" opacity=".9"/>`;
      case 'cross': return `<path d="M${x - 2.8} 58.2l5.6 5.6M${x + 2.8} 58.2l-5.6 5.6" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`;
      case 'galaxy': return `<circle cx="${x}" cy="61" r="3.2" fill="#1b0f3a" opacity=".85"/><circle cx="${x - 1.1}" cy="59.6" r=".7" fill="#fff"/><circle cx="${x + 1.2}" cy="62.2" r=".6" fill="${iris}"/>`;
      case 'flame': return `<path d="M${x} 57c1.9 2.1 2.7 3.5 2.7 4.9a2.7 2.7 0 0 1-5.4 0c0-1.2.5-1.8 1-2.4.2.7.6 1 1.1 1.1-.4-1.2-.3-2.3.6-3.6Z" fill="${iris}" stroke="${ink}" stroke-width=".7" opacity=".9"/>`;
      case 'lens': return `<circle cx="${x}" cy="61" r="3.2" fill="none" stroke="${iris}" stroke-width="1" opacity=".9"/><circle cx="${x}" cy="61" r="1.6" fill="${ink}" opacity=".7"/>`;
      case 'half': return `<path d="M${x - 4.2} 59q4.2-2.2 8.4 0" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round" opacity=".85"/>`;
      case 'cat': return `<ellipse cx="${x}" cy="61" rx="1" ry="3.4" fill="${ink}" opacity=".85"/>`;
      case 'void': return `<circle cx="${x}" cy="61" r="3.6" fill="#0b0618" opacity=".9"/><circle cx="${x + 1.4}" cy="59.4" r=".7" fill="#fff" opacity=".7"/>`;
      case 'gleam': return `<ellipse cx="${x}" cy="61" rx="3.8" ry="1.5" fill="${ink}" opacity=".8"/><ellipse cx="${x - .6}" cy="60.4" rx="1.8" ry=".7" fill="#fff" opacity=".9"/>`;
      default: return '';
    }
  };
  return one(53) + one(74);
}

function lumiKitMarkup(sprite, palette) {
  /* The outfit is painted into the sheet frames now, so it moves with every
     pose; breathing room is kept for a future per-breed overlay. */
  return '';
}

function lumiKitMarkupLegacy(sprite, palette) {
  if (!palette) return '';
  const kit = lumiKitFor(sprite);
  const edge = `stroke="${palette.deep}" stroke-width="1.4" stroke-linejoin="round"`;
  const body = palette.body;
  const light = palette.light;
  const deep = palette.deep;
  const accent = palette.accent;
  const ears = {
    round: `<circle cx="51" cy="55" r="7" fill="${body}" ${edge}/><circle cx="77" cy="55" r="7" fill="${body}" ${edge}/>`,
    leaf: `<path d="M52 56c-9-17-5-29 2-31 8-2 12 9 10 20-1 6-3 9-4 11Z" fill="${body}" ${edge}/><path d="M76 56c9-17 5-29-2-31-8-2-12 9-10 20 1 6 3 9 4 11Z" fill="${body}" ${edge}/>`,
    fin: `<path d="M38 66c-14-6-21 4-17 14 9 3 16-5 17-14Z" fill="${accent}" ${edge}/><path d="M90 66c14-6 21 4 17 14-9 3-16-5-17-14Z" fill="${accent}" ${edge}/>`,
    horn: `<path d="M64 50c-4-15 0-24 6-24 6 0 7 10 2 18Z" fill="${light}" ${edge}/><circle cx="46" cy="61" r="6" fill="${body}" ${edge}/><circle cx="82" cy="61" r="6" fill="${body}" ${edge}/>`,
    crystal: `<path d="M50 58l5-20 7 20Z" fill="${light}" ${edge}/><path d="M70 58l7-20 5 20Z" fill="${light}" ${edge}/>`,
    glow: `<circle cx="64" cy="46" r="9" fill="${light}" ${edge}/><circle cx="64" cy="46" r="3.6" fill="${accent}"/>`,
    fur: `<path d="M50 57c-6-11-2-19 4-19 5 0 6 6 3 11Z" fill="${body}" ${edge}/><path d="M78 57c6-11 2-19-4-19-5 0-6 6-3 11Z" fill="${body}" ${edge}/><path d="M62 52l2-9 3 9Z" fill="${light}" ${edge}/>`,
  };
  /* Legs, hands and clothes are separate pieces around the measured body box
     (x 30-98, y 43-113), so they read as limbs and a garment instead of a
     second face: the cap sits above the eyes, the vest below the mouth. */
  const legs = `<g class="lumi-legs">
    <path d="M52 100v9M76 100v9" stroke="${body}" stroke-width="8" stroke-linecap="round" ${edge}/>
    <ellipse cx="52" cy="112" rx="8.5" ry="5" fill="${light}" ${edge}/>
    <ellipse cx="76" cy="112" rx="8.5" ry="5" fill="${light}" ${edge}/>
  </g>`;
  const hands = `<g class="lumi-hands">
    <path d="M34 92c-4 2-5 6-3 9M94 92c4 2 5 6 3 9" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none" ${edge}/>
    <circle cx="29" cy="102" r="6.2" fill="${light}" ${edge}/>
    <circle cx="99" cy="102" r="6.2" fill="${light}" ${edge}/>
  </g>`;
  const clothes = `<g class="lumi-clothes">
    <path d="M46 88c5-3 11-4 18-4s13 1 18 4l-3 17c-5 3-10 4-15 4s-10-1-15-4Z" fill="${accent}" ${edge}/>
    <path d="M50 98h28" stroke="${light}" stroke-width="1.6" opacity=".65"/>
    <circle cx="64" cy="103" r="2.4" fill="${light}" ${edge}/>
  </g>`;
  const head = `<g class="lumi-head">
    <path d="M40 60c0-14 10-22 24-22s24 8 24 22c-6-5-14-8-24-8s-18 3-24 8Z" fill="${light}" ${edge}/>
    <path d="M46 58c4-8 10-12 18-12s14 4 18 12" stroke="${deep}" stroke-width="1.3" fill="none" opacity=".4"/>
    ${ears[kit] || ''}
  </g>`;
  /* Lumi eye styling sits above the sheet's own eyes: a lash line, not a
     second pair, so the face never doubles. */
  /* Rolled eye colour and mouth land here: the sheet bakes the face, so the
     iris is a ring around each painted eye rather than a second pupil. */
  const traits = typeof spriteTraits === 'function' ? spriteTraits(sprite) : null;
  const traitIris = traits ? traits.iris : light;
  const traitMouth = traits ? lumiTraitMouth(traits.mouth, deep) : '';
  const traitEyes = traits ? lumiTraitEyes(traits.eyeStyle, traitIris, deep) : '';
  const eyes = `<g class="lumi-eyes">
    <path d="M48 65c3-3.4 8-3.4 11 0M69 65c3-3.4 8-3.4 11 0" stroke="${deep}" stroke-width="2.1" fill="none" stroke-linecap="round" opacity=".5"/>
    <circle cx="53" cy="61" r="1.3" fill="${light}" opacity=".9"/>
    <circle cx="74" cy="61" r="1.3" fill="${light}" opacity=".9"/>
    <ellipse cx="53" cy="61" rx="4.6" ry="5.4" fill="none" stroke="${traitIris}" stroke-width="1.6" opacity=".85"/>
    <ellipse cx="74" cy="61" rx="4.6" ry="5.4" fill="none" stroke="${traitIris}" stroke-width="1.6" opacity=".85"/>
    ${traitEyes}
  </g>${traitMouth}`;
  return `<g class="lumi-kit">${legs}${hands}${clothes}${head}${eyes}</g>`;
}

/* Species cards (roster, breeding, wiki previews) pass sample sprites rather
   than real pets, so they borrow the owned pet's sheet when there is one. */
function lumiOwnedSpriteFor(sprite) {
  if (!sprite || typeof state === 'undefined' || !Array.isArray(state.sprites)) return sprite;
  if (String(sprite.skin || '').indexOf('lumi:') === 0) return sprite;
  if (state.sprites.some((pet) => pet && pet.id === sprite.id)) return sprite;
  return state.sprites.find((pet) => pet && pet.element === sprite.element && String(pet.skin || '').indexOf('lumi:') === 0) || sprite;
}

/* Any screen can flash a clip on a sheet pet: walk, fly, eat, drink, wash. */
function lumiPlayClip(el, clip, ms) {
  const mapped = (window.LUMI_ACTION_CLIPS && window.LUMI_ACTION_CLIPS[clip]) || clip;
  if (typeof SPRITE_SHEET !== 'undefined') SPRITE_SHEET.play(el, mapped, ms);
  return mapped;
}

/* Any action name (run, bath, nap, fight, bathroom…) plays its clip. */
function lumiAnimate(el, action, ms) {
  return lumiPlayClip(el, action, ms);
}


/* ---------------- generated sheets ----------------
   The painted atlas bakes one face and one body, so a player's eyes, mouth,
   ears, head, body type, limbs, clothes or exact dye could never appear on it.
   Any sprite wearing one of those is drawn instead as its own generated sheet:
   the same parametric body the Studio previews, composed in one 128 cell and
   animated by clip. Untouched pets keep the painted atlas. */
function customSheetRequired(sprite) {
  if (!sprite) return false;
  /* An explicitly chosen Lumi sheet stays that sheet. */
  if (String(sprite.skin || '').indexOf('lumi:') === 0) return false;
  if (sprite.faceCustom) return true;
  return !!(sprite.iris)
    || (sprite.mouth && sprite.mouth !== 'breed')
    || (sprite.eyes && sprite.eyes !== 'breed' && sprite.eyes !== 'classic')
    || (sprite.ears && sprite.ears !== 'breed')
    || (sprite.head && sprite.head !== 'breed')
    || (sprite.shape && sprite.shape !== 'breed')
    || (sprite.arms && sprite.arms !== 'nub')
    || (sprite.legs && sprite.legs !== 'breed')
    || (sprite.hair && sprite.hair !== 'none')
    || (sprite.hat && sprite.hat !== 'none')
    || (sprite.scarf && sprite.scarf !== 'none')
    || (sprite.accessory && sprite.accessory !== 'none')
    || (sprite.outfit)
    || sprite.palette === 'custom';
}

/* Seven drawn poses make one generated sheet. They are full parametric bodies,
   not filters: each frame redraws the sprite with its own expression, lean,
   squash and lift, so a custom pet moves through real frames the way the
   painted atlas does. */
const GENERATED_FRAMES = [
  { expr: 'idle' },
  { expr: 'happy', view: 'side', dy: 1.2, rot: 2.4, sx: 1.02, sy: 0.98, farArm: { dx: -3, rot: -8 }, nearArm: { dx: 3, rot: 8 }, farLeg: { thigh: 20, shin: -10, foot: 8 }, nearLeg: { thigh: -20, shin: 4, foot: -4 } },
  { expr: 'happy', view: 'side', dy: 2.2, rot: 1.2, sx: 1.03, sy: 0.96, farArm: { dx: -1, rot: -3 }, nearArm: { dx: 1, rot: 3 }, farLeg: { thigh: 10, shin: -16, foot: 0 }, nearLeg: { thigh: -10, shin: 8, foot: 0 } },
  { expr: 'idle', view: 'side', dy: -2.2, sx: 0.99, sy: 1.02, farArm: { dx: 2, dy: -2, rot: 10 }, nearArm: { dx: -2, dy: -1, rot: -8 }, farLeg: { thigh: -4, shin: -34, foot: -10 }, nearLeg: { thigh: 6, shin: 2, foot: 2 } },
  { expr: 'happy', view: 'side', dy: 1.2, rot: -2.4, sx: 1.02, sy: 0.98, farArm: { dx: 3, rot: 8 }, nearArm: { dx: -3, rot: -8 }, farLeg: { thigh: -20, shin: 4, foot: -4 }, nearLeg: { thigh: 20, shin: -10, foot: 8 } },
  { expr: 'happy', view: 'side', dy: 2.2, rot: -1.2, sx: 1.03, sy: 0.96, farArm: { dx: 1, rot: 3 }, nearArm: { dx: -1, rot: -3 }, farLeg: { thigh: -10, shin: 8, foot: 0 }, nearLeg: { thigh: 10, shin: -16, foot: 0 } },
  { expr: 'idle', view: 'side', dy: -3, sy: 1.03, farArm: { dx: -2, dy: -1, rot: -6 }, nearArm: { dx: 2, dy: -1, rot: 6 }, farLeg: { thigh: 6, shin: 2, foot: 2 }, nearLeg: { thigh: -2, shin: -20, foot: -6 } },
  { expr: 'happy', view: 'side', dy: -8, sx: 1.03, sy: 1.06, farArm: { dx: 3, dy: -3, rot: 14 }, nearArm: { dx: -3, dy: -2, rot: -12 }, farLeg: { thigh: 14, shin: -40, foot: -8 }, nearLeg: { thigh: 26, shin: -46, foot: -12 } },
  { expr: 'grump', view: 'side', dx: -5, rot: -7, sx: 0.98, sy: 0.96, farArm: { dx: -6, rot: -24 }, nearArm: { dx: 5, rot: 18 }, farLeg: { thigh: 10, shin: 0, foot: 0 }, nearLeg: { thigh: -14, shin: 10, foot: 2 } },
  { expr: 'grump', view: 'side', dx: 6, rot: 7, sx: 1.05, sy: 0.96, farArm: { dx: 7, rot: 26 }, nearArm: { dx: -4, rot: -14 }, farLeg: { thigh: -12, shin: 6, foot: -2 }, nearLeg: { thigh: 18, shin: -14, foot: 6 } },
  { expr: 'idle', view: 'side', dx: 1, dy: 2, rot: -2, sy: 0.99, farArm: { dx: 1, rot: 4 }, nearArm: { dx: -1, rot: -2 }, farLeg: { thigh: -2, shin: 2, foot: 0 }, nearLeg: { thigh: 2, shin: 2, foot: 0 } },
  { expr: 'sleep', dy: 4, sy: 0.94 },
  { expr: 'sad', dy: 2, sy: 0.98 },
  /* Turn-around poses: a full 360 loop, with real profile and back anatomy. */
  { expr: 'idle', turn: 0, view: 'front' },
  { expr: 'idle', turn: 60, view: 'side' },
  { expr: 'idle', turn: 120, view: 'back', backStep: 0.25 },
  { expr: 'idle', turn: 180, view: 'back', backStep: 0.75 },
  { expr: 'idle', turn: 240, view: 'back', backStep: 0.75 },
  { expr: 'idle', turn: 300, view: 'side' },
  /* Front-facing beats so clips that should not turn sideways never mix views. */
  { expr: 'happy', dy: -7, sx: 1.03, sy: 1.05 },
  { expr: 'idle', dy: 1.6, sx: 1.02, sy: 0.98 },
  /* Back-facing steps: the pair alternates a lifted and a planted foot, so a
     pet walking away is not gliding on two static pads. */
  { expr: 'happy', view: 'back', dy: 0.8, sx: 1.01, sy: 0.99, backStep: 0.25 },
  { expr: 'happy', view: 'back', dy: 0.2, backStep: 0.75 },
  /* Edge-on bridges at 90/270: the profile at a narrow width, so the pair
     does not jump straight from profile feet to the 3/4 back pair. */
  { expr: 'idle', turn: 90, view: 'side' },
  { expr: 'idle', turn: 270, view: 'side' },
];

/* Which drawn frames each clip plays, and how fast. Walk and run alternate the
   two step poses, sleep holds the settled frame, fight lunges and recovers,
   play hops, eat nods between the two lean frames. */
const GENERATED_CLIPS = {
  idle: { fps: 4, seq: [0, 20, 0, 20, 0] },
  walk: { fps: 10, seq: [1, 2, 3, 4, 5, 6, 1] },
  walkBack: { fps: 10, seq: [21, 22, 21] },
  run: { fps: 18, seq: [1, 7, 4, 7, 2, 7, 1] },
  fly: { fps: 10, seq: [0, 19, 0, 19, 0] },
  blink: { fps: 8, seq: [0, 11, 0] },
  sleep: { fps: 3, seq: [11] },
  nap: { fps: 3, seq: [11] },
  celebrate: { fps: 12, seq: [0, 19, 0, 19, 0] },
  play: { fps: 12, seq: [0, 19, 0, 19, 0] },
  catch: { fps: 12, seq: [19, 0, 19] },
  pounce: { fps: 14, seq: [19, 0, 19] },
  eat: { fps: 7, seq: [20, 0, 20] },
  drink: { fps: 7, seq: [20, 0, 20] },
  wash: { fps: 10, seq: [1, 2, 1, 2, 1] },
  bath: { fps: 9, seq: [1, 2, 1] },
  throw: { fps: 12, seq: [8, 9, 8] },
  fight: { fps: 12, seq: [8, 9, 10, 8] },
  relax: { fps: 4, seq: [11, 20, 11] },
  sit: { fps: 4, seq: [11, 20, 11] },
  bathroom: { fps: 4, seq: [11] },
  bow: { fps: 5, seq: [9, 10, 9] },
  speak: { fps: 6, seq: [0, 20, 0] },
  cry: { fps: 5, seq: [12] },
  turn: { fps: 10, seq: [13, 14, 23, 15, 16, 17, 24, 18, 13] },
};

function generatedClipCSS() {
  const keyframes = Object.entries(GENERATED_CLIPS).map(([clip, meta]) => {
    const total = meta.seq.length;
    const steps = meta.seq.map((frame, i) => `${((i / total) * 100).toFixed(4)}%{transform:translateY(${-frame * 120}px)}`).join('');
    return `@keyframes lumi-gen-${clip}{${steps}100%{transform:translateY(${-meta.seq[total - 1] * 120}px)}}`;
  }).join('\n');
  const rules = Object.entries(GENERATED_CLIPS).map(([clip, meta]) =>
    `.lumi-generated[data-clip="${clip}"] .lumi-gen-frames{animation:lumi-gen-${clip} ${(meta.seq.length / meta.fps).toFixed(3)}s steps(1,end) infinite}`).join('\n');
  return `${keyframes}
.lumi-generated{overflow:hidden;display:block;width:100%;height:100%}
.lumi-generated .lumi-gen-frames{transform-origin:0 0;will-change:transform}
${rules}
.lumi-generated[data-still] .lumi-gen-frames{animation:none !important;transform:translateY(0) !important}`;
}

let lumiGeneratedStyle = false;
function lumiGeneratedStyleTag() {
  if (lumiGeneratedStyle || typeof document === 'undefined') return;
  if (document.getElementById('lumi-generated-frames')) { lumiGeneratedStyle = true; return; }
  const el = document.createElement('style');
  el.id = 'lumi-generated-frames';
  el.textContent = generatedClipCSS();
  document.head.appendChild(el);
  lumiGeneratedStyle = true;
}

/* One rendered pose, minus the outer svg wrapper, so it can sit in a frame. */
function generatedFrameInner(sprite, expr, view, pose) {
  if (typeof spriteSVG !== 'function') return null;
  const svg = spriteSVG(sprite, { expr, vectorOnly: true, view, farArm: pose && pose.farArm, nearArm: pose && pose.nearArm, farLeg: pose && pose.farLeg, nearLeg: pose && pose.nearLeg, backStep: pose && pose.backStep, backTurn: pose && pose.turn });
  if (!svg) return null;
  const defs = (svg.match(/<defs>[\s\S]*?<\/defs>/) || [''])[0];
  const inner = svg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<defs>[\s\S]*?<\/defs>/, '');
  return { defs, inner };
}

function customSheetMarkup(sprite, opts = {}) {
  if (typeof spriteSVG !== 'function') return null;
  /* Frames that share an expression share one rendered pose, so the extra
     stride and fight frames cost no extra drawing work. */
  const poseCache = new Map();
  const pieces = GENERATED_FRAMES.map((pose) => {
    const key = `${pose.expr}|${pose.view || 'front'}|${JSON.stringify(pose.farArm || null)}|${JSON.stringify(pose.nearArm || null)}|${JSON.stringify(pose.farLeg || null)}|${JSON.stringify(pose.nearLeg || null)}|${pose.backStep == null ? '' : pose.backStep}|${pose.turn || 0}`;
    if (!poseCache.has(key)) poseCache.set(key, generatedFrameInner(sprite, pose.expr, pose.view || 'front', pose));
    return poseCache.get(key);
  });
  if (!pieces.length || !pieces[0]) return null;
  lumiGeneratedStyleTag();
  const expr = opts.expr || 'idle';
  const fallback = expr === 'sleep' ? 'sleep' : 'idle';
  const wanted = opts.still ? 'idle' : (sprite.clip && GENERATED_CLIPS[sprite.clip] ? sprite.clip : fallback);
  const clip = GENERATED_CLIPS[wanted] ? wanted : 'idle';
  const kit = typeof lumiKitFor === 'function' ? lumiKitFor(sprite) : 'round';
  const palette = typeof resolvePalette === 'function' ? resolvePalette(sprite) : null;
  const motion = typeof spriteMotionFor === 'function' ? spriteMotionFor(sprite, expr) : 'hover';
  const frames = pieces.map((piece, i) => {
    const pose = GENERATED_FRAMES[i];
    const dx = Number(pose.dx) || 0;
    const dy = Number(pose.dy) || 0;
    const rot = Number(pose.rot) || 0;
    /* A turn pose squashes the body horizontally by cos(angle); past 90 the
       factor goes negative, which mirrors the sprite into its back view. */
    const turn = Number(pose.turn) || 0;
    const turnScale = turn ? Math.cos((turn * Math.PI) / 180) : 1;
    const sx = (pose.sx || 1) * (Math.abs(turnScale) < 0.12 ? (turnScale < 0 ? -0.42 : 0.42) : turnScale);
    const sy = pose.sy || 1;
    const fluff = palette ? `<circle cx="60" cy="72" r="34" fill="${palette.light}" opacity=".15"/><circle cx="60" cy="72" r="31" fill="none" stroke="${palette.light}" stroke-width="6" stroke-dasharray="0.7 4" stroke-linecap="round" opacity=".8"/>` : '';
    return `<g class="lumi-gen-frame" transform="translate(0 ${i * 120})"><g transform="translate(${60 + dx} ${70 + dy}) rotate(${rot}) scale(${sx} ${sy}) translate(-60 -70)">${fluff}${piece.inner}</g></g>`;
  }).join('');
  return `<svg class="sprite-motion motion-${motion} lumi-sheet lumi-generated" data-tier="128" data-clip="${clip}" data-sheet="generated" data-frames="${GENERATED_FRAMES.length}" data-kit="${kit}"${opts.still ? ' data-still="1"' : ''} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    ${pieces[0].defs}
    <g class="lumi-gen-frames">${frames}</g>
  </svg>`;
}

/* Resolve a sprite's element to a painted atlas row. Elemental type species use
   their `el_<key>` style directly; the sprite-puffle family falls back to its
   `puffleElement` (Grass → Bloom, Ice → Frost, Flower → Floral). */
function lumiPuffleAtlasRowFor(sprite) {
  if (!sprite || typeof window === 'undefined' || !Array.isArray(window.LUMI_ELEMENT_ROSTER)) return -1;
  const roster = window.LUMI_ELEMENT_ROSTER;
  const styleKey = typeof lumiPuffleStyleOfSprite === 'function'
    ? lumiPuffleStyleOfSprite(sprite)
    : (sprite.puffleVariant || '');
  const direct = String(styleKey || '').replace(/^el_/, '');
  let index = roster.findIndex((entry) => entry.key === direct);
  if (index >= 0) return index;
  /* Species ids carry their own element name (sp_storm, sp_frost). Match that
     against the roster before falling back to the shared ELEMENTS table, which
     types some species differently (Storm lists as Electric there) and used to
     hand them another element's painted row. */
  const bare = String(sprite.element || '').replace(/^sp_/, '').toLowerCase();
  if (bare) {
    const own = roster.findIndex((entry) => entry.key === bare || String(entry.element).toLowerCase() === bare);
    if (own >= 0) return own;
  }
  const variant = window.LUMI_PUFFLE_VARIANTS && window.LUMI_PUFFLE_VARIANTS[styleKey];
  const elementMeta = typeof ELEMENTS === 'object' && ELEMENTS ? ELEMENTS[sprite.element] : null;
  const raw = (variant && variant.element) || (elementMeta && elementMeta.puffleElement) || '';
  const name = String(raw).toLowerCase();
  index = roster.findIndex((entry) => entry.key === name || String(entry.element).toLowerCase() === name);
  if (index >= 0) return index;
  const alias = LUMI_PUFFLE_ATLAS_ALIASES[name];
  return alias ? roster.findIndex((entry) => entry.key === alias) : -1;
}

function lumiPuffleAtlasClipFor(sprite, expr) {
  const requested = (sprite && sprite.clip) || expr || 'idle';
  const mapped = (window.LUMI_ACTION_CLIPS && window.LUMI_ACTION_CLIPS[requested]) || requested;
  if (LUMI_PUFFLE_ATLAS_CLIPS[mapped]) return mapped;
  return expr === 'sleep' ? 'sleep' : 'idle';
}

let lumiPuffleAtlasStyled = false;
function lumiPuffleAtlasStyleTag() {
  if (lumiPuffleAtlasStyled || typeof document === 'undefined') return;
  if (document.getElementById('lumi-puffle-atlas-frames')) { lumiPuffleAtlasStyled = true; return; }
  const keyframes = Object.entries(LUMI_PUFFLE_ATLAS_CLIPS).map(([clip, meta]) => {
    const total = meta.seq.length;
    const steps = meta.seq.map((col, i) => `${((i / total) * 100).toFixed(4)}%{transform:translateX(${-col * LUMI_PUFFLE_ATLAS.cell}px)}`).join('');
    const last = meta.seq[total - 1];
    return `@keyframes lumi-puffle-atlas-${clip}{${steps}100%{transform:translateX(${-last * LUMI_PUFFLE_ATLAS.cell}px)}}`;
  }).join('\n');
  const rules = Object.entries(LUMI_PUFFLE_ATLAS_CLIPS).map(([clip, meta]) =>
    `.lumi-puffle-atlas[data-clip="${clip}"] .lumi-puffle-atlas-frames{animation:lumi-puffle-atlas-${clip} ${(meta.seq.length / meta.fps).toFixed(3)}s steps(1,end) infinite}`).join('\n');
  const css = `${keyframes}
.lumi-puffle-atlas{overflow:hidden;display:block;width:100%;height:100%}
.lumi-puffle-atlas .lumi-puffle-atlas-frames{transform-origin:0 0;will-change:transform}
${rules}
.lumi-puffle-atlas[data-still] .lumi-puffle-atlas-frames{animation:none !important;transform:translateX(${-4 * LUMI_PUFFLE_ATLAS.cell}px) !important}`;
  const el = document.createElement('style');
  el.id = 'lumi-puffle-atlas-frames';
  el.textContent = css;
  document.head.appendChild(el);
  lumiPuffleAtlasStyled = true;
}

function lumiPuffleAtlasMarkup(sprite, opts = {}) {
  if (!sprite || typeof SPRITE_SHEET === 'undefined') return null;
  const row = lumiPuffleAtlasRowFor(sprite);
  if (row < 0) return null;
  lumiPuffleAtlasStyleTag();
  SPRITE_SHEET.startBlink();
  const expr = opts.expr || 'idle';
  const still = !!opts.still;
  const clip = still ? 'idle' : lumiPuffleAtlasClipFor(sprite, expr);
  const motion = typeof spriteMotionFor === 'function' ? spriteMotionFor(sprite, expr) : 'hover';
  const palette = typeof resolvePalette === 'function' ? resolvePalette(sprite) : null;
  const ability = lumiAbilityFor(sprite);
  const wear = palette && typeof hairMarkup === 'function'
    ? `<g class="lumi-wear" transform="scale(${(LUMI_SHEET_CELL / 120).toFixed(4)})"><g class="lumi-wear-move">${hairMarkup(sprite.hair, palette)}${lumiAccessoryMarkup(sprite, palette)}${typeof hatMarkup === 'function' ? hatMarkup(sprite.hat, palette) : ''}</g></g>`
    : '';
  return `<svg class="sprite-motion motion-${motion} lumi-sheet lumi-puffle-atlas${expr === 'sleep' ? ' is-slow' : ''}" data-tier="atlas" data-clip="${clip}" data-sheet="atlas" data-atlas-row="${row}" data-ability="${ability.name}"${still ? ' data-still="1"' : ''} viewBox="0 0 ${LUMI_PUFFLE_ATLAS.cell} ${LUMI_PUFFLE_ATLAS.cell}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${ability.icon} ${ability.name}">
    <title>${ability.icon} ${ability.name}</title>
    <g transform="translate(0 ${-row * LUMI_PUFFLE_ATLAS.cell})">
      <g class="lumi-puffle-atlas-frames">
        <image href="${LUMI_PUFFLE_ATLAS.image}?v=2026.11.19" x="0" y="0" width="${LUMI_PUFFLE_ATLAS.columns * LUMI_PUFFLE_ATLAS.cell}" height="${LUMI_PUFFLE_ATLAS.rows * LUMI_PUFFLE_ATLAS.cell}" preserveAspectRatio="none"/>
      </g>
    </g>
    ${wear}
  </svg>`;
}

/* Entry point used by spriteSVG for every pet body. */
function lumiSkinMarkup(sprite, opts = {}) {
  if (typeof SPRITE_SHEET === 'undefined') return null;
  if (!sprite) return null;
  /* Floofs are the round fluffball breed: a painted sheet (or an elemental
     atlas row) swaps their circle for a spiky silhouette, so they keep the
     shared round puffle body instead. */
  if (sprite.breed === 'floof') return null;
  /* Unhatched eggs keep their egg art; the Lumi body starts at the hatchling. */
  if (sprite.stage === 'egg' && String(sprite.skin || '').indexOf('lumi:') !== 0) return null;
  /* Customized pets draw their own sheet so every chosen part shows. */
  if (customSheetRequired(sprite)) {
    const custom = customSheetMarkup(sprite, opts);
    if (custom) { SPRITE_SHEET.startBlink(); return custom; }
  }
  /* Painted puffle rows give every element a different silhouette. Normal
     Sprite Puffles now draw the shared round vector body, so their family and
     breed colours still show without the outline drifting between elements.
     The painted row stays available for an explicitly chosen Lumi skin. */
  if (String(sprite.skin || '').indexOf('lumi:') === 0 && lumiPuffleAtlasRowFor(sprite) >= 0) {
    const atlas = lumiPuffleAtlasMarkup(sprite, opts);
    if (atlas) return atlas;
  }
  /* The painted atlas is now opt-in: a pet wears it only when its skin is
     explicitly set to a Lumi sheet. Every other sprite draws the round puffle
     vector body, so the whole roster shares one furry silhouette. */
  if (String(sprite.skin || '').indexOf('lumi:') !== 0) return null;
  SPRITE_SHEET.startBlink();
  return SPRITE_SHEET.markup(sprite, opts);
}


/* The five stage colourways, shared with the Codex so a swatch row and the live
   sprite agree. Each form moves further round the wheel and gets a little
   richer, which is why the forms of one line read as five different furs. */
const LUMI_STAGE_TINTS = [
  { hue: -16, sat: 0.92, bright: 0.96 },
  { hue: -6, sat: 0.99, bright: 1.0 },
  { hue: 4, sat: 1.06, bright: 1.03 },
  { hue: 15, sat: 1.14, bright: 1.06 },
  { hue: 27, sat: 1.22, bright: 1.09 },
];
window.LUMI_STAGE_TINTS = LUMI_STAGE_TINTS;
window.lumiStageTint = function lumiStageTint(form) {
  return LUMI_STAGE_TINTS[Math.max(0, Math.min(4, Number(form) || 0))];
};


/* Which particle art a family wears. Fire-family elements burn, growing
   elements trail vine leaves, fluid elements float bubbles, and everything else
   crackles with spark. */
const LUMI_ELEMENT_FX = {
  fire: 'fire', dragon: 'fire', light: 'fire',
  nature: 'vine', earth: 'vine', mushroom: 'vine', crystal: 'vine',
  water: 'bubble', ice: 'bubble', wind: 'bubble', moon: 'bubble',
  electric: 'spark', shadow: 'spark', cosmic: 'spark', spirit: 'spark',
  music: 'spark', time: 'spark', rainbow: 'spark', secret: 'spark',
};
window.LUMI_ELEMENT_FX = LUMI_ELEMENT_FX;
window.lumiElementFx = function lumiElementFx(family) {
  return LUMI_ELEMENT_FX[family] || null;
};
