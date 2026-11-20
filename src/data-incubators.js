/* Incubator Nursery Data & Mechanics.
   Provides heat, cooling, and cosmic incubators for accelerating egg hatching and
   boosting mutation chances. Lava Mode and Frost Chill are the specialty modes. */

const INCUBATOR_TYPES = {
  warm: { key: 'warm', name: 'Warm Lamp', icon: '🪔', speedMult: 1.5, mutBonus: 0.05, cost: 0, desc: 'Cozy lamp warmth. Eggs hatch 50% faster.' },
  lava: { key: 'lava', name: 'Lava Mode', icon: '🌋', tint: '#ff7a3d', speedMult: 3.8, mutBonus: 0.28, cost: 750, desc: 'Molten heat. Ember and lava eggs warm 1.5x faster here.' },
  crystal: { key: 'crystal', name: 'Crystal Prism', icon: '💎', speedMult: 2.5, mutBonus: 0.15, cost: 150, desc: 'Refracts starlight. Eggs hatch 2.5x faster with +15% mutation chance.' },
  cosmic: { key: 'cosmic', name: 'Cosmic Nebula', icon: '🌌', speedMult: 5.0, mutBonus: 0.30, cost: 300, desc: 'Infused with cosmic dust. Eggs hatch 5x faster with +30% mutation chance.' },
  warmer: { key: 'warmer', name: 'Ember Warmer', icon: '🔥', speedMult: 7.5, mutBonus: 0.40, cost: 600, desc: 'A banked ember bed. Eggs hatch 7.5x faster with +40% mutation chance.' },
  chill: { key: 'chill', name: 'Chill Stone', icon: '❄️', speedMult: 1.6, mutBonus: 0.08, cost: 0, desc: 'Cooling stone. Frozen eggs warm here; Frost Chill is stronger.' },
  frostchill: { key: 'frostchill', name: 'Frost Chill', icon: '🧊', tint: '#8be9ff', speedMult: 2.6, mutBonus: 0.18, cost: 750, desc: 'Cinderfrost cradle. Lava-frozen eggs warm 1.8x faster here.' },
  off: { key: 'off', name: 'Heat off', icon: '⭕', speedMult: 1, mutBonus: 0, cost: 0, desc: 'No heat at all. Eggs warm at their own slow pace.' },
};
const INCUBATOR_KEYS = Object.keys(INCUBATOR_TYPES);

/* A lava egg is an Ember elemental or a species whose hybrid carries a fire or
   lava name. A lava-frozen egg is both lava and cold: typically an Ember egg
   inherited from a Frozen Puff, or a Frost hybrid with a fire lineage. */
const LAVA_EGG_PATTERN = /(ember|fire|lava|magma|volcan|caldera)/i;
const FROST_EGG_PATTERN = /(frost|ice|frozen|glacier|snow|chill|cryo)/i;

function eggIsLavaType(s) {
  if (!s) return false;
  const element = String(s.element || '').toLowerCase();
  const hybrid = String(s.hybrid || '');
  return element === 'ember' || element === 'fire' || LAVA_EGG_PATTERN.test(hybrid);
}

function eggIsFrostType(s) {
  if (!s) return false;
  const element = String(s.element || '').toLowerCase();
  const hybrid = String(s.hybrid || '');
  const coldBreed = typeof COLD_HATCH_BREEDS !== 'undefined' && COLD_HATCH_BREEDS.includes(s.breed);
  return coldBreed || element === 'frost' || element === 'ice' || FROST_EGG_PATTERN.test(hybrid);
}

function eggIsLavaFrozen(s) {
  return eggIsLavaType(s) && eggIsFrostType(s);
}

function incubatorAllowsCold(inc) {
  return !!inc && (inc.key === 'chill' || inc.key === 'frostchill');
}

/* The specialty modes are still general-purpose warmers, but matching shells
   get a clear extra push. The hatch gain is clamped by warmEggRaw. */
function incubatorWarmMultiplier(s, inc) {
  if (!inc) return 1;
  let boost = inc.speedMult || 1;
  if (inc.key === 'lava' && eggIsLavaType(s)) boost *= 1.5;
  if (inc.key === 'frostchill') {
    if (eggIsLavaFrozen(s)) boost *= 1.8;
    else if (eggIsFrostType(s)) boost *= 1.25;
  }
  return boost;
}

/* Older saves may predate the specialty modes, hold only part of the map, or
   have been hand-edited into a non-object. Build one complete map from whatever
   survived so the free Warm Lamp can never look locked. Unknown active keys and
   keys the player never bought fall back to the Warm Lamp. */
function normalizeIncubators(raw) {
  const saved = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const st = {
    warm: true, lava: false, crystal: false, cosmic: false, warmer: false,
    chill: true, frostchill: false, off: true, active: 'warm',
    slots: saved.slots && typeof saved.slots === 'object' && !Array.isArray(saved.slots) ? saved.slots : {},
  };
  ['lava', 'crystal', 'cosmic', 'warmer', 'frostchill'].forEach((key) => {
    if (saved[key]) st[key] = true;
  });
  if (Object.prototype.hasOwnProperty.call(INCUBATOR_TYPES, saved.active) && st[saved.active]) {
    st.active = saved.active;
  }
  return st;
}

function coolingIncubatorKey(s) {
  return eggIsLavaFrozen(s)
    && typeof state !== 'undefined'
    && state.incubators
    && state.incubators.frostchill
    ? 'frostchill'
    : 'chill';
}

function getIncubatorState() {
  if (typeof state === 'undefined') return {};
  state.incubators = normalizeIncubators(state.incubators);
  return state.incubators;
}

function activeIncubator() {
  const st = getIncubatorState();
  return INCUBATOR_TYPES[st.active] || INCUBATOR_TYPES.warm;
}
