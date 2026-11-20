/* Gene Lab: splice two species into a brand-new one.

   A design is a small record (genes, colours, ancestry) kept in
   state.geneDesigns, which is part of the ordinary Hollow save. Every load
   re-registers each design as a real species, so a spliced sprite keeps its
   name, art, colours and inherited gene power across sessions and exports.
   The record is sanitised on the way in: only known gene keys, six-digit hex
   colours, and a short name survive. */

const GENE_DESIGN_LIMIT = 12;
const GENE_BLUEPRINT_COST = 0;
const GENE_RESUMMON_COST = 0;
const GENE_NAME_MAX = 24;
const GENE_HEX_RE = /^#[0-9a-f]{6}$/i;
const GENE_KEY_RE = /^gene_[a-z0-9]{4,24}$/;

function geneLabKey() {
  const stamp = Date.now().toString(36).replace(/[^a-z0-9]/g, '').slice(-9);
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let tail = '';
  for (let i = 0; i < 3; i += 1) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `gene_${stamp}${tail}`;
}

function geneSeedOf(text) {
  let hash = 2166136261;
  const str = String(text || '');
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function geneColorsFor(key) {
  const el = ELEMENTS[key] || ELEMENTS.bloom;
  return { body: el.primary, light: el.light, deep: el.deep, accent: el.accent };
}

function geneCleanColor(value, fallback) {
  const hex = String(value || '').trim();
  return GENE_HEX_RE.test(hex) ? hex.toLowerCase() : fallback;
}

function geneKnownKey(table, value, fallback) {
  return table && Object.prototype.hasOwnProperty.call(table, value) ? value : fallback;
}

function geneDesignByKey(key) {
  if (!key || typeof state === 'undefined' || !Array.isArray(state.geneDesigns)) return null;
  return state.geneDesigns.find((design) => design && design.key === key) || null;
}

function normalizeGeneDesign(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const base = ELEMENTS[raw.base] ? raw.base : 'bloom';
  const native = geneColorsFor(base);
  const savedColors = raw.colors && typeof raw.colors === 'object' ? raw.colors : {};
  const key = GENE_KEY_RE.test(String(raw.key || '')) ? String(raw.key) : geneLabKey();
  const typedName = String(raw.name || '').replace(/[<>]/g, '').trim().slice(0, GENE_NAME_MAX);
  return {
    key,
    name: typedName || `${ELEMENTS[base].name} Splice`,
    base,
    breed: geneKnownKey(BREEDS, raw.breed, 'puff'),
    head: geneKnownKey(HEAD_SHAPES, raw.head, 'breed'),
    ears: geneKnownKey(EAR_STYLES, raw.ears, 'breed'),
    eyes: geneKnownKey(EYE_STYLES, raw.eyes, 'classic'),
    nose: geneKnownKey(NOSE_STYLES, raw.nose, 'none'),
    arms: geneKnownKey(ARM_STYLES, raw.arms, 'nub'),
    legs: geneKnownKey(LEG_STYLES, raw.legs, 'breed'),
    pattern: geneKnownKey(PATTERNS, raw.pattern, 'plain'),
    accessory: geneKnownKey(ACCESSORIES, raw.accessory, 'none'),
    size: geneKnownKey(SIZES, raw.size, 'standard'),
    colors: {
      body: geneCleanColor(savedColors.body, native.body),
      light: geneCleanColor(savedColors.light, native.light),
      deep: geneCleanColor(savedColors.deep, native.deep),
      accent: geneCleanColor(savedColors.accent, native.accent),
    },
    createdAt: Number(raw.createdAt) || Date.now(),
  };
}

/* Register one design as a species. Idempotent, so loading a save twice (or
   opening the lab) never duplicates anything. */
function installGeneSpecies(rawDesign) {
  const design = rawDesign && GENE_KEY_RE.test(String(rawDesign.key || '')) ? rawDesign : normalizeGeneDesign(rawDesign);
  if (!design || typeof ELEMENTS === 'undefined') return null;
  if (ELEMENTS[design.key]) return ELEMENTS[design.key];
  const baseEl = ELEMENTS[design.base] || ELEMENTS.bloom;
  ELEMENTS[design.key] = {
    name: design.name,
    primary: design.colors.body,
    light: design.colors.light,
    deep: design.colors.deep,
    accent: design.colors.accent,
    trait: `Spliced from ${baseEl.name} genes — ${BREEDS[design.breed]?.perk || 'its own small rules'}.`,
    blurb: `A Gene Lab sprite: ${BREEDS[design.breed]?.name || 'Puff'} build, ${PATTERNS[design.pattern]?.name || 'plain'} markings, ${baseEl.name} ancestry.`,
    greeting: 'The lab said I was a good idea. So here I am.',
    likes: baseEl.likes || 'Star Pop',
    geneLab: true,
    geneBase: design.base,
  };
  if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(design.key)) ELEMENT_KEYS.push(design.key);
  const power = typeof GENE_POWERS !== 'undefined' ? GENE_POWERS[design.base] : null;
  if (power && !GENE_POWERS[design.key]) {
    GENE_POWERS[design.key] = {
      name: `${power.name} Splice`,
      icon: power.icon || '🧬',
      desc: `${power.desc} Inherited from ${baseEl.name} genes.`,
      effect: { ...(power.effect || {}) },
    };
  }
  if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[design.key] = `${design.name} Titan`;
  if (typeof NAME_START !== 'undefined') NAME_START[design.key] = [design.name.split(' ')[0], 'Splice', 'Gene', 'Keeper'];
  return ELEMENTS[design.key];
}

function syncGeneDesigns(list) {
  if (typeof ELEMENTS === 'undefined') return;
  (Array.isArray(list) ? list : []).forEach((design) => installGeneSpecies(design));
}

/* Mix the donors' genes into a starting draft the player can edit. Nonce lets
   the Splice button produce a different mix of the same two parents. */
function geneLabSpliceDraft(aKey, bKey, nonce = 0) {
  const a = ELEMENTS[aKey] || ELEMENTS.bloom;
  const b = ELEMENTS[bKey] || ELEMENTS.bloom;
  const seed = geneSeedOf(`${aKey}|${bKey}|${Math.max(0, Math.floor(Number(nonce) || 0))}`);
  const pickAt = (keys, shift) => keys[(seed >>> shift) % keys.length];
  return {
    base: ELEMENTS[aKey] ? aKey : 'bloom',
    name: `${a.name.split(' ')[0]}${b.name.split(' ')[0]}`.slice(0, GENE_NAME_MAX),
    breed: pickAt(BREED_KEYS, 0),
    head: pickAt(HEAD_SHAPE_KEYS, 3),
    ears: pickAt(EAR_STYLE_KEYS, 5),
    eyes: pickAt(EYE_STYLE_KEYS, 7),
    nose: pickAt(NOSE_STYLE_KEYS, 9),
    arms: pickAt(ARM_STYLE_KEYS, 11),
    legs: pickAt(LEG_STYLE_KEYS, 13),
    pattern: pickAt(PATTERN_KEYS, 15),
    accessory: 'none',
    size: 'standard',
    colors: {
      body: mix(a.primary, b.primary, 0.5),
      light: mix(a.light, b.light, 0.5),
      deep: mix(a.deep, b.deep, 0.5),
      accent: mix(a.accent, b.accent, 0.5),
    },
  };
}

function geneLabPreviewSprite(draft, opts = {}) {
  const base = draft && ELEMENTS[draft.base] ? draft.base : 'bloom';
  const native = geneColorsFor(base);
  const colors = draft && draft.colors && typeof draft.colors === 'object' ? draft.colors : {};
  const color = (name) => geneCleanColor(colors[name], native[name]);
  return {
    id: opts.id || 'gene-lab-preview',
    element: base,
    name: draft?.name || 'Splice preview',
    breed: geneKnownKey(BREEDS, draft?.breed, 'puff'),
    head: geneKnownKey(HEAD_SHAPES, draft?.head, 'breed'),
    ears: geneKnownKey(EAR_STYLES, draft?.ears, 'breed'),
    eyes: geneKnownKey(EYE_STYLES, draft?.eyes, 'classic'),
    nose: geneKnownKey(NOSE_STYLES, draft?.nose, 'none'),
    arms: geneKnownKey(ARM_STYLES, draft?.arms, 'nub'),
    legs: geneKnownKey(LEG_STYLES, draft?.legs, 'breed'),
    pattern: geneKnownKey(PATTERNS, draft?.pattern, 'plain'),
    accessory: geneKnownKey(ACCESSORIES, draft?.accessory, 'none'),
    size: geneKnownKey(SIZES, draft?.size, 'standard'),
    stage: opts.stage || 'sprite',
    level: 12,
    palette: 'custom',
    custom: {
      body: color('body'),
      light: color('light'),
      deep: color('deep'),
      accent: color('accent'),
      belly: lighten(color('body'), 0.55),
    },
  };
}

function geneLabSpriteFor(design) {
  return makeSprite({
    element: design.key,
    name: design.name,
    breed: design.breed,
    head: design.head,
    ears: design.ears,
    eyes: design.eyes,
    nose: design.nose,
    arms: design.arms,
    legs: design.legs,
    pattern: design.pattern,
    accessory: design.accessory,
    size: design.size,
    palette: 'native',
    stage: 'baby',
    hatch: 100,
    level: 1,
    bond: 30,
    personality: pick(['sunny', 'goofy', 'shy', 'dreamy', 'bold', 'sassy']),
    needs: { hunger: 82, energy: 84, joy: 88, clean: 92 },
  });
}

function geneLabCreate(rawDraft) {
  if (typeof state === 'undefined' || !state.started) return { ok: false, reason: 'started' };
  if (!rawDraft || typeof rawDraft !== 'object') return { ok: false, reason: 'draft' };
  const designs = Array.isArray(state.geneDesigns) ? state.geneDesigns : [];
  if (designs.length >= GENE_DESIGN_LIMIT) {
    toast(`The Gene Lab holds ${GENE_DESIGN_LIMIT} saved species. Forget one before splicing another.`, '🧬');
    return { ok: false, reason: 'limit' };
  }
  if (state.coins < GENE_BLUEPRINT_COST) {
    toast(`A new species costs ${GENE_BLUEPRINT_COST} coins — you have ${state.coins}.`, '🪙');
    return { ok: false, reason: 'coins' };
  }
  const design = normalizeGeneDesign({ ...rawDraft, key: geneLabKey(), createdAt: Date.now() });
  if (!design) return { ok: false, reason: 'draft' };
  addCoinsRaw(-GENE_BLUEPRINT_COST);
  state.geneDesigns = designs.concat([design]);
  installGeneSpecies(design);
  const sprite = geneLabSpriteFor(design);
  state.sprites.push(sprite);
  if (!state.activeId) state.activeId = sprite.id;
  state.stats.hatches = (Number(state.stats.hatches) || 0) + 1;
  commit('gene-create', { spriteId: sprite.id, geneKey: design.key });
  Sfx.win();
  toast(`${design.name} joined the Hollow — a new species saved with your Hollow.`, '🧬');
  return { ok: true, design, sprite };
}

function geneLabSummon(key) {
  const design = geneDesignByKey(key);
  if (!design) return { ok: false, reason: 'missing' };
  if (GENE_RESUMMON_COST > 0 && state.coins < GENE_RESUMMON_COST) {
    toast(`Growing another ${design.name} costs ${GENE_RESUMMON_COST} coins — you have ${state.coins}.`, '🪙');
    return { ok: false, reason: 'coins' };
  }
  if (GENE_RESUMMON_COST > 0) addCoinsRaw(-GENE_RESUMMON_COST);
  const sprite = geneLabSpriteFor(design);
  state.sprites.push(sprite);
  commit('gene-summon', { spriteId: sprite.id, geneKey: design.key });
  toast(`${design.name} grew another body — ${GENE_RESUMMON_COST ? `${GENE_RESUMMON_COST} coins` : 'free'}.`, '🧬');
  return { ok: true, sprite };
}

/* Forget a species only when no sprite depends on it; otherwise the sprite
   would lose its art and fall back to Bloom on the next load. */
function geneLabForget(key) {
  const design = geneDesignByKey(key);
  if (!design) return { ok: false, reason: 'missing' };
  if ((state.sprites || []).some((sprite) => sprite.element === key)) {
    return { ok: false, reason: 'inuse' };
  }
  state.geneDesigns = (state.geneDesigns || []).filter((item) => item.key !== key);
  delete ELEMENTS[key];
  if (typeof ELEMENT_KEYS !== 'undefined') {
    const index = ELEMENT_KEYS.indexOf(key);
    if (index >= 0) ELEMENT_KEYS.splice(index, 1);
  }
  if (typeof GENE_POWERS !== 'undefined') delete GENE_POWERS[key];
  if (typeof TITAN_NAMES !== 'undefined') delete TITAN_NAMES[key];
  if (typeof NAME_START !== 'undefined') delete NAME_START[key];
  commit('gene-forget', { geneKey: key });
  return { ok: true };
}
