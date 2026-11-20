/* Turns the sprite-data files into playable content.
   Every species becomes a breed, so it shows up in the Studio breed list, the
   Gene Lab, breeding, the wiki and the collection the moment it loads. Its
   first ability supplies the breed perk, its second one the flavour line, and
   its rarity supplies the glow the renderer paints. */

const SPRITE_SPECIES_META = {
  baby_sprite: { icon: '🍼', kind: 'baby', shape: 'pompom', palette: 'aurora' },
  basic_sprite: { icon: '🟣', kind: 'starter', shape: 'round', palette: 'lavender', color: 'purple' },
  crystal_sprite: { icon: '💎', kind: 'crystal', shape: 'pebble', palette: 'glacier' },
  ember_sprite: { icon: '🔥', kind: 'ember', shape: 'drop', palette: 'hellfire' },
  frost_sprite: { icon: '❄️', kind: 'frost', shape: 'penguin', palette: 'glacier' },
  galaxy_sprite: { icon: '🌌', kind: 'cosmic', shape: 'bigball', palette: 'prism' },
  nature_sprite: { icon: '🌿', kind: 'nature', shape: 'dumpling', palette: 'vineglow' },
  royal_sprite: { icon: '👑', kind: 'royal', shape: 'cushion', palette: 'rosegold' },
  shadow_sprite: { icon: '🌑', kind: 'shadow', shape: 'ghost', palette: 'abyssal' },
  storm_sprite: { icon: '⛈️', kind: 'storm', shape: 'dandelion', palette: 'stormgrey' },
  halloween_sprite: { icon: '🎃', kind: 'hollow', shape: 'ghost', palette: 'hellfire' },
  christmas_sprite: { icon: '🎄', kind: 'winterlight', shape: 'penguin', palette: 'glacier' },
  valentine_sprite: { icon: '💝', kind: 'sweetheart', shape: 'cushion', palette: 'bubblegum' },
  summer_sprite: { icon: '🌞', kind: 'summer', shape: 'dandelion', palette: 'sunset' },
  spring_sprite: { icon: '🌱', kind: 'spring', shape: 'dumpling', palette: 'matcha' },
  neon_sprite: { icon: '🟪', kind: 'neon', shape: 'pompom', palette: 'prism' },
  cyber_sprite: { icon: '🤖', kind: 'cyber', shape: 'slab', palette: 'stormgrey' },
  gold_sprite: { icon: '🪙', kind: 'gold', shape: 'cushion', palette: 'rosegold' },
  diamond_sprite: { icon: '🔷', kind: 'diamond', shape: 'pebble', palette: 'glacier' },
  rainbow_sprite: { icon: '🌈', kind: 'rainbow', shape: 'round', palette: 'candy' },
  mini_crystal: { icon: '🔮', kind: 'crystal', shape: 'pebble', palette: 'aurora' },
  baby_dragon: { icon: '🐲', kind: 'dragon', shape: 'dragon', palette: 'ember' },
  cloud_bunny: { icon: '🐰', kind: 'cloud', shape: 'muff', palette: 'aurora' },
  star_fox: { icon: '🦊', kind: 'star', shape: 'drop', palette: 'sunset' },
  ghost_sprite: { icon: '👻', kind: 'ghost', shape: 'ghost', palette: 'mono' },
  cosmic_cat: { icon: '🐈‍⬛', kind: 'cosmic', shape: 'bigball', palette: 'abyssal' },
  moon_owl: { icon: '🦉', kind: 'moon', shape: 'muff', palette: 'charcoal' },
  lightning_chick: { icon: '🐤', kind: 'storm', shape: 'dandelion', palette: 'stormgrey' },
};

/* Species files may name a colour ("purple") instead of a palette key, so the
   renderer reads the colour first and falls back to the species default. */
const SPRITE_COLOR_PALETTES = {
  purple: 'lavender',
  violet: 'lavender',
  pink: 'bubblegum',
  blue: 'ocean',
  green: 'vineglow',
  red: 'hellfire',
  gold: 'rosegold',
  white: 'mono',
  black: 'abyssal',
  silver: 'stormgrey',
  rainbow: 'prism',
};

function spriteSpeciesName(id) {
  const words = String(id || '').replace(/_sprite$/, '').replace(/_/g, ' ').trim();
  const titled = words.split(' ').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return titled ? `${titled} Sprite` : 'Sprite';
}

function spriteSpeciesPalette(id, data) {
  const meta = SPRITE_SPECIES_META[id] || {};
  const color = data && typeof data.color === 'string' ? data.color.trim().toLowerCase() : (meta.color || '');
  if (color && SPRITE_COLOR_PALETTES[color]) return SPRITE_COLOR_PALETTES[color];
  if (color && typeof PALETTES !== 'undefined' && PALETTES[color]) return color;
  return meta.palette || 'native';
}

/* Both abilities count, not just the first: multiplicative perks multiply and
   every aura is kept, so two species cannot end up identical by accident. */
function speciesAbilityMods(primary, secondary) {
  const mods = {};
  [primary, secondary].forEach((info) => {
    if (!info || !info.mods) return;
    Object.keys(info.mods).forEach((key) => {
      const value = Number(info.mods[key]);
      if (!isFinite(value)) return;
      mods[key] = mods[key] ? Number((mods[key] * value).toFixed(3)) : value;
    });
  });
  return mods;
}

function speciesAbilityAuras(primary, secondary) {
  return [...new Set([primary, secondary]
    .map((info) => (info && info.aura ? info.aura : null))
    .filter(Boolean))];
}

function spriteSpeciesBreed(id, data) {
  const meta = SPRITE_SPECIES_META[id] || {};
  const primary = abilityInfo(data.abilities[0]) || null;
  const secondary = abilityInfo(data.abilities[1]) || null;
  const tier = typeof TYPE_EGG_RARITIES !== 'undefined' ? TYPE_EGG_RARITIES[data.rarity] : null;
  return {
    name: spriteSpeciesName(id),
    kicker: `${tier ? tier.name : data.rarity} ${meta.kind || 'sprite'} breed`,
    icon: meta.icon || '✨',
    perk: primary ? `${primary.name} — ${primary.blurb}` : 'A quiet little species with no tricks yet.',
    desc: secondary ? `${secondary.icon} ${secondary.name} — ${secondary.blurb}` : 'A species from the sprite sheet.',
    species: id,
    rarity: data.rarity,
    abilities: Array.isArray(data.abilities) ? data.abilities.slice() : [],
    spriteShape: meta.shape || null,
    speciesPalette: spriteSpeciesPalette(id, data),
    wings: typeof data.wings === 'boolean' ? data.wings : undefined,
    auras: speciesAbilityAuras(primary, secondary),
    ...speciesAbilityMods(primary, secondary),
  };
}

/* Every breed carries two abilities, species or not, so no sprite is left
   without perks: the mods their abilities describe are exactly the keys the
   care maths already reads (bond, xp, joy, hunger, clean, energy). */
function assignBreedAbilities() {
  if (typeof BREEDS === 'undefined' || typeof ABILITY_TABLE === 'undefined') return 0;
  const pool = Object.keys(ABILITY_TABLE).sort();
  let assigned = 0;
  Object.keys(BREEDS).forEach((key) => {
    const breed = BREEDS[key];
    if (!breed || (Array.isArray(breed.abilities) && breed.abilities.length)) return;
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) % 9973;
    const first = pool[hash % pool.length];
    const second = pool[(hash * 7 + 13) % pool.length];
    const ids = second === first ? [first] : [first, second];
    breed.abilities = ids;
    breed.auras = [...new Set(ids.map((id) => abilityAura(id)).filter(Boolean))];
    ids.forEach((id) => {
      const info = abilityInfo(id);
      if (!info || !info.mods) return;
      Object.keys(info.mods).forEach((modKey) => {
        const value = Number(info.mods[modKey]);
        if (!isFinite(value)) return;
        breed[modKey] = breed[modKey] ? Number((breed[modKey] * value).toFixed(3)) : value;
      });
    });
    assigned += 1;
  });
  return assigned;
}

if (typeof BREEDS !== 'undefined' && typeof ABILITY_TABLE !== 'undefined') assignBreedAbilities();

/* Unique ability mechanics: coin and bond effects that sit outside the six
   decay/XP modifiers, merged into spriteEffects alongside genes and habits. */
function abilityEffectsFor(sprite) {
  const breed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const ids = breed && Array.isArray(breed.abilities) ? breed.abilities : [];
  const merged = {};
  const addEffect = (effect) => {
    if (!effect) return;
    Object.keys(effect).forEach((key) => {
      const value = Number(effect[key]);
      if (!isFinite(value)) return;
      if (/Coins$/.test(key)) merged[key] = (merged[key] || 0) + value;
      else merged[key] = (merged[key] || 1) * value;
    });
  };
  ids.forEach((id) => {
    const info = typeof abilityInfo === 'function' ? abilityInfo(id) : null;
    addEffect(info && info.effect);
  });
  /* The Lumi body kit carries a real ability of its own, so its mods feed the
     same care maths instead of being a label on the sprite. */
  if (typeof lumiKitAbilityId === 'function' && typeof abilityInfo === 'function') {
    const info = abilityInfo(lumiKitAbilityId(sprite));
    if (info) {
      const modKeys = { bondMod: 'petBond', xpMod: 'xp', joyMod: 'joyDecay', hungerMod: 'hungerDecay', energyMod: 'energyDecay', cleanMod: 'cleanDecay' };
      Object.keys(info.mods || {}).forEach((modKey) => {
        const key = modKeys[modKey];
        const value = Number(info.mods[modKey]);
        if (key && isFinite(value)) merged[key] = (merged[key] || 1) * value;
      });
      addEffect(info.effect);
    }
  }
  return merged;
}

/* Breeds are the game's unit of identity, so registering a species here is what
   makes it playable: Studio, Gene Lab, breeding and the wiki all read BREEDS. */
function registerSpriteSpecies(data) {
  const species = data && data.species ? data.species : {};
  let added = 0;
  Object.keys(species).forEach((id) => {
    const def = species[id];
    if (!def || !def.id) return;
    if (!BREEDS[id]) {
      BREEDS[id] = spriteSpeciesBreed(id, def);
      added += 1;
    }
    if (typeof BREED_TRAITS !== 'undefined' && !BREED_TRAITS[id]) {
      const primary = abilityInfo(def.abilities[0]);
      const secondary = abilityInfo(def.abilities[1]);
      BREED_TRAITS[id] = {
        favorite: (def.rarity === 'mythic' || def.rarity === 'legendary') ? 'feast' : 'pop',
        likes: primary ? primary.name.toLowerCase() : 'quiet corners',
        dislikes: 'being forgotten',
        behavior: secondary ? `${secondary.name}: ${secondary.blurb}` : (primary ? primary.blurb : 'Keeps to itself, mostly.'),
      };
    }
  });
  if (added && typeof BREED_KEYS !== 'undefined') {
    Object.keys(BREEDS).forEach((key) => {
      if (!BREED_KEYS.includes(key)) BREED_KEYS.push(key);
    });
  }
  return added;
}

/* Which sheet effect a sprite wears: its species' first ability, unless the
   loaded effects file switches that effect off. */
function spriteAuraEnabled(effect) {
  if (!effect) return false;
  if (typeof SPRITE_DATA !== 'undefined' && SPRITE_DATA.effects && SPRITE_DATA.effects[effect] === false) return false;
  return true;
}

/* Every aura a species can wear: its breed keeps both ability auras, with the
   effects file able to switch any of them off. */
function spriteAurasFor(sprite) {
  const breed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const abilities = breed && Array.isArray(breed.abilities) ? breed.abilities : [];
  const listed = breed && Array.isArray(breed.auras) && breed.auras.length
    ? breed.auras
    : abilities.map((name) => abilityAura(name));
  return [...new Set(listed)].filter(spriteAuraEnabled);
}

function spriteAuraFor(sprite) {
  const list = spriteAurasFor(sprite);
  return list.length ? list[0] : null;
}

const SPRITE_AURA_SHAPES = {
  sparkles: (a, l) => `<path d="M26 30l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4Z" fill="${l}"/>
    <path d="M94 44l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2Z" fill="${a}"/>
    <circle cx="88" cy="86" r="2" fill="${l}"/><circle cx="30" cy="80" r="1.6" fill="${a}"/>`,
  wingGlow: (a, l) => `<ellipse cx="60" cy="60" rx="50" ry="44" fill="${a}" opacity=".16"/>
    <ellipse cx="60" cy="60" rx="44" ry="38" fill="none" stroke="${l}" stroke-width="1" opacity=".35"/>`,
  trailEffect: (a, l) => `<path d="M14 76c8 6 18 8 28 6" stroke="${a}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M10 88c10 7 22 9 34 6" stroke="${l}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".5"/>
    <circle cx="16" cy="66" r="1.8" fill="${a}"/>`,
  shadowAura: (a, l) => `<ellipse cx="60" cy="62" rx="50" ry="44" fill="${a}" opacity=".2"/>
    <ellipse cx="60" cy="62" rx="50" ry="44" fill="none" stroke="${l}" stroke-width="1.2" opacity=".4" stroke-dasharray="3 6"/>`,
  lightningAura: (a, l) => `<path d="M22 30l10 18-6 2 9 16" stroke="${a}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M98 34l-9 17 6 2-8 15" stroke="${l}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  snowAura: (a, l) => `<g stroke="${l}" stroke-width="1.4" stroke-linecap="round" opacity=".8">
      <path d="M28 34v10M23 39h10M24 35l8 8M32 35l-8 8"/><path d="M92 74v8M88 78h8"/></g>
    <circle cx="84" cy="30" r="1.8" fill="${a}"/>`,
  fireAura: (a, l) => `<path d="M24 84c-6-8-4-16 2-22 1 6 4 8 6 10 0-8 3-13 8-16-1 8 4 12 4 20 0 7-5 12-11 12s-8-2-9-4Z" fill="${a}" opacity=".5"/>
    <path d="M96 84c6-8 4-16-2-22-1 6-4 8-6 10 0-8-3-13-8-16 1 8-4 12-4 20 0 7 5 12 11 12s8-2 9-4Z" fill="${l}" opacity=".35"/>`,
  rainbowAura: () => `<path d="M18 96c0-24 19-42 42-42s42 18 42 42" stroke="#ff9ec7" stroke-width="3" fill="none" opacity=".45"/>
    <path d="M24 96c0-20 16-36 36-36s36 16 36 36" stroke="#ffd166" stroke-width="3" fill="none" opacity=".45"/>
    <path d="M30 96c0-16 13-30 30-30s30 14 30 30" stroke="#8be9ff" stroke-width="3" fill="none" opacity=".45"/>`,
};

function spriteAuraMarkup(sprite, c) {
  const effects = spriteAurasFor(sprite).filter((effect) => SPRITE_AURA_SHAPES[effect]);
  if (!effects.length) return '';
  const accent = (c && c.accent) || '#b69cff';
  const light = (c && c.light) || '#ffffff';
  return effects
    .map((effect) => `<g class="sprite-aura fx-${effect}">${SPRITE_AURA_SHAPES[effect](accent, light)}</g>`)
    .join('');
}

/* Rarity colour, drawn as a soft glow behind a species sprite. */
function spriteRarityColor(sprite) {
  const breed = sprite && typeof BREEDS !== 'undefined' ? BREEDS[sprite.breed] : null;
  const rarity = breed && breed.rarity;
  const tier = rarity && typeof TYPE_EGG_RARITIES !== 'undefined' ? TYPE_EGG_RARITIES[rarity] : null;
  return tier ? tier.color : null;
}

/* Animation manifest lookups: fps drives the float, frame count drives a
   one-shot length, and pose maps a manifest name onto an atlas pose. */
function spriteAnimation(name) {
  if (typeof spriteConfig !== 'undefined' && spriteConfig.animations && spriteConfig.animations[name]) return spriteConfig.animations[name];
  if (typeof SPRITE_DATA !== 'undefined' && SPRITE_DATA.animations) return SPRITE_DATA.animations[name] || null;
  return null;
}

function spriteAnimationFps(name, fallback = 10) {
  const anim = spriteAnimation(name);
  return anim && anim.fps ? anim.fps : fallback;
}

function spriteAnimationDuration(name, fallback = 900) {
  const anim = spriteAnimation(name);
  if (!anim || !anim.frames || !anim.fps) return fallback;
  return Math.max(240, Math.round((anim.frames.length / anim.fps) * 1000));
}

const SPRITE_ANIMATION_POSES = {
  idle: 'idle', blink: 'idle', walk: 'curious', run: 'curious',
  jumpStart: 'jump', jumpLoop: 'jump', fall: 'jump', land: 'jump',
  wave: 'curious', dance: 'rare', celebrate: 'rare', victory: 'rare',
  float: 'idle', fly: 'galaxy',
};

function spritePoseFor(name) {
  return SPRITE_ANIMATION_POSES[name] || 'idle';
}

/* Studio presets: one per species, so a species is one tap from playable. */
function spriteSpeciesPresets() {
  const species = typeof SPRITE_DATA !== 'undefined' && SPRITE_DATA.species ? SPRITE_DATA.species : {};
  return Object.keys(species)
    .map((id) => {
      const meta = SPRITE_SPECIES_META[id] || {};
      return {
        key: `species_${id}`,
        label: spriteSpeciesName(id),
        icon: meta.icon || '✨',
        breed: id,
        /* Every species preset spawns on the circular puffle body. The
           per-species silhouettes (ghost, drop, slab, pebble) made species read
           as their own creature, but the Sprite and Sprite Puffle roster is
           round now, so the preset never carries a non-round outline. */
        shape: 'round',
        palette: spriteSpeciesPalette(id, species[id]),
        species: id,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function applySpriteDataToGame(data) {
  const source = data || (typeof SPRITE_DATA !== 'undefined' ? SPRITE_DATA : null);
  if (!source) return 0;
  const added = registerSpriteSpecies(source);
  if (typeof SPRITE_DATA !== 'undefined') SPRITE_DATA.breeds = added;
  return added;
}

if (typeof window !== 'undefined') {
  window.ABILITY_TABLE = ABILITY_TABLE;
  window.spriteSpeciesPresets = spriteSpeciesPresets;
  window.spriteAuraMarkup = spriteAuraMarkup;
  window.spriteAnimationFps = spriteAnimationFps;
  window.spriteAnimationDuration = spriteAnimationDuration;
  window.spritePoseFor = spritePoseFor;
  window.applySpriteDataToGame = applySpriteDataToGame;
  if (typeof spriteDataLoad === 'function') {
    spriteDataLoad().then((loaded) => { applySpriteDataToGame(loaded); }).catch(() => {});
  }
}
