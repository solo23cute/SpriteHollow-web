/* Sprite Hollow family sprite sheet.
   The sheet is one PNG of eight 256px poses in row 0 (2048x1024 at scale 1); the
   frame table mirrors freebuff/assets/sprite-hollow/sprite_hollow_config.json.
   requires the image: until it loads, every caller gets the procedural SVG it
   had before, so a missing or broken PNG cannot blank a sprite. */

const FAMILY_ATLAS = {
  image: 'freebuff/assets/sprite-hollow/sprite_hollow_master_atlas.png',
  meta: 'freebuff/assets/sprite-hollow/sprite_hollow_config.json',
  frame: 256,
  columns: 8,
  poses: ['idle', 'jump', 'curious', 'rare', 'shadow', 'galaxy', 'baby', 'elder'],
  ready: false,
  failed: false,
};

function familyAtlasIndex(pose) {
  const i = FAMILY_ATLAS.poses.indexOf(pose);
  return i < 0 ? 0 : i;
}

function familyAtlasAvailable() {
  return FAMILY_ATLAS.ready && !FAMILY_ATLAS.failed;
}

function familyAtlasPreload() {
  if (FAMILY_ATLAS.ready || FAMILY_ATLAS.failed) return;
  const probe = new Image();
  probe.onload = () => {
    if (FAMILY_ATLAS.failed) return;
    FAMILY_ATLAS.ready = true;
    try { window.dispatchEvent(new CustomEvent('family-atlas-ready')); } catch (err) { /* older WebView */ }
  };
  probe.onerror = () => { FAMILY_ATLAS.failed = true; };
  probe.src = FAMILY_ATLAS.image;
}

/* Resting pose for a sprite. Shinies use the galaxy frame and the two youngest
   and oldest stages have their own, so the sheet's variants are all reachable. */
function familyAtlasPoseFor(sprite) {
  if (!sprite) return 'idle';
  if (sprite.shiny) return 'galaxy';
  if (sprite.stage === 'baby') return 'baby';
  if (sprite.stage === 'elder') return 'elder';
  return 'idle';
}

function familyAtlasFrame(sprite, pose) {
  const col = familyAtlasIndex(pose || familyAtlasPoseFor(sprite));
  const glow = typeof spriteRarityColor === 'function' ? spriteRarityColor(sprite) : null;
  const style = `--fa-col:${col}${glow ? `;--fa-glow:${glow}` : ''}`;
  return `<span class="fa-frame" style="${style}" role="img" aria-label="${esc(displayName(sprite))}"></span>`;
}

/* The single entry point screens use: a sheet pose while the PNG is present, the
   procedural sprite otherwise. */
function familyAtlasBody(sprite, opts = {}) {
  /* A sheet skin wins everywhere this body is drawn: collection, roster, breeding
     and every other card, not just the garden stage. */
  if (typeof lumiSkinMarkup === 'function') {
    const sheet = lumiSkinMarkup(sprite, opts);
    if (sheet) return sheet;
  }
  /* An animation name from the manifest picks the pose, so the sheet renderer
     follows idle, walk, jump and the rest instead of one resting frame. */
  const pose = opts.pose || (opts.anim && typeof spritePoseFor === 'function' ? spritePoseFor(opts.anim) : null);
  if (!familyAtlasAvailable()) {
    const expr = opts.expr || (typeof expressionFor === 'function' ? expressionFor(sprite) : 'happy');
    return spriteSVG(sprite, { expr });
  }
  return familyAtlasFrame(sprite, pose);
}

/* Play a manifest animation on an actor: the pose comes from the sheet, the
   length from the manifest's own fps and frame count. */
function familyAtlasPlay(actor, animName) {
  const ms = typeof spriteAnimationDuration === 'function' ? spriteAnimationDuration(animName, 900) : 900;
  if (!actor) return ms;
  if (familyAtlasAvailable()) familyAtlasFlash(actor, typeof spritePoseFor === 'function' ? spritePoseFor(animName) : 'idle', ms);
  return ms;
}

/* Flash one pose (a hop, a curious turn) and settle back on the resting frame. */
function familyAtlasFlash(actor, pose, ms) {
  if (!actor || !familyAtlasAvailable()) return;
  const frame = actor.querySelector('.fa-frame');
  if (!frame) return;
  if (frame.dataset.faBase === undefined) {
    frame.dataset.faBase = frame.style.getPropertyValue('--fa-col') || '0';
  }
  frame.style.setProperty('--fa-col', String(familyAtlasIndex(pose)));
  clearTimeout(frame._faTimer);
  frame._faTimer = setTimeout(() => {
    frame.style.setProperty('--fa-col', frame.dataset.faBase);
  }, ms || 900);
}

/* The sheet arrives after the first paint, so the open screen is rebuilt once it
   does; screens that already drew fallback art replace themselves. */
window.addEventListener('family-atlas-ready', () => {
  if (typeof state === 'undefined' || !state.started) return;
  if (typeof App !== 'undefined' && App.refresh) App.refresh();
});

familyAtlasPreload();
