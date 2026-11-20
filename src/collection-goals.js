/* Collection goals: the nearest completion target in each collection track.

   build(save, env) returns one compact card for:
     family       the species family closest to complete
     constellation the chart closest to complete
     biome        the type-biome roster closest to complete
     egg          the purchasable type-egg catalog

   There is no DOM, storage, clock or random source here. The caller supplies
   the live tables and name/price lookups; the result is plain, frozen data. */

(function (root) {
  'use strict';

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    return Object.freeze(value);
  }

  function ownedSpecies(save) {
    const owned = new Set();
    const sprites = Array.isArray(object(save) && save.sprites) ? save.sprites : [];
    sprites.forEach((sprite) => {
      if (object(sprite) && text(sprite.element)) owned.add(sprite.element);
    });
    return owned;
  }

  function knownSpecies(keys, hasSpecies) {
    const seen = new Set();
    return (Array.isArray(keys) ? keys : []).filter((key) => {
      if (!text(key) || seen.has(key)) return false;
      if (typeof hasSpecies === 'function' && !hasSpecies(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function nameOf(env, key) {
    return (typeof env.nameOf === 'function' && text(env.nameOf(key))) || key;
  }

  function priceOf(env, key) {
    const price = typeof env.priceOf === 'function' ? env.priceOf(key) : null;
    if (price === null || price === undefined || price === '') return null;
    const value = Number(price);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  function nextMissing(keys, env) {
    const priced = keys
      .map((key) => ({ key, price: priceOf(env, key) }))
      .filter((entry) => entry.price !== null)
      .sort((a, b) => a.price - b.price || nameOf(env, a.key).localeCompare(nameOf(env, b.key)));
    return priced[0] || { key: keys[0], price: null };
  }

  function noteFor(next, env) {
    const name = nameOf(env, next.key);
    return next.price === null ? `Next: ${name}` : `Next: ${name} · ${next.price.toLocaleString()} 🪙`;
  }

  function betterCandidate(candidate, best) {
    if (!best) return true;
    if (candidate.ratio !== best.ratio) return candidate.ratio > best.ratio;
    if (candidate.missing.length !== best.missing.length) return candidate.missing.length < best.missing.length;
    return candidate.title.localeCompare(best.title) < 0;
  }

  function familyCandidate(owned, env) {
    const families = Array.isArray(env.families) ? env.families : [];
    let best = null;

    families.forEach((family) => {
      if (!object(family) || !text(family.id) || !Array.isArray(family.species)) return;
      const species = knownSpecies(family.species, env.hasSpecies);
      if (!species.length) return;
      const got = species.filter((key) => owned.has(key)).length;
      if (got >= species.length) return;
      const missing = species.filter((key) => !owned.has(key));
      const candidate = {
        ratio: got / species.length,
        missing,
        total: species.length,
        got,
        title: text(family.label) || family.id,
        id: family.id,
      };
      if (betterCandidate(candidate, best)) best = candidate;
    });

    if (!best) return null;
    const next = nextMissing(best.missing, env);
    return {
      kind: 'family',
      title: best.title,
      meta: `${best.got}/${best.total} species · ${best.missing.length} missing`,
      note: noteFor(next, env),
      progress: { owned: best.got, total: best.total },
      target: { type: 'family', familyId: best.id, species: next.key },
    };
  }

  function constellationCandidate(save, env) {
    const constellations = object(env.constellations);
    if (!constellations || typeof constellations.analyze !== 'function'
      || typeof constellations.seedById !== 'function' || typeof constellations.ownershipFromSave !== 'function') return null;

    let analysis;
    try {
      analysis = constellations.analyze(save);
    } catch (err) {
      return null;
    }
    const nearest = Array.isArray(analysis && analysis.nearest)
      ? analysis.nearest.find((entry) => object(entry) && !entry.complete && entry.completable !== false)
      : null;
    if (!nearest) return null;
    const seed = constellations.seedById(nearest.id);
    if (!object(seed) || !Array.isArray(seed.members)) return null;

    const ownership = constellations.ownershipFromSave(save);
    const missing = seed.members.find((member) => !constellations.ownsMember(ownership, member));
    const total = Math.max(1, Number(nearest.total) || seed.members.length);
    const got = Math.max(0, Math.min(total, Number(nearest.owned) || 0));
    const nextName = missing
      ? (typeof env.memberName === 'function' ? env.memberName(missing) : missing.key)
      : '';
    const nextPrice = missing && missing.kind === 'species' ? priceOf(env, missing.key) : null;
    const note = missing
      ? (nextPrice === null ? `Next: ${nextName}` : `Next: ${nextName} · ${nextPrice.toLocaleString()} 🪙`)
      : 'Open the chart';

    return {
      kind: 'constellation',
      title: text(nearest.name) || nearest.id,
      meta: `${got}/${total} members · ${Math.max(0, total - got)} missing`,
      note,
      progress: { owned: got, total },
      target: { type: 'constellation', seedId: nearest.id },
    };
  }

  function biomeCandidate(owned, env) {
    const biomes = Array.isArray(env.biomes) ? env.biomes : [];
    let best = null;

    biomes.forEach((biome) => {
      if (!object(biome) || !text(biome.scene)) return;
      const species = knownSpecies(biome.species, env.hasSpecies);
      if (!species.length) return;
      const got = species.filter((key) => owned.has(key)).length;
      if (got >= species.length) return;
      const missing = species.filter((key) => !owned.has(key));
      const candidate = {
        ratio: got / species.length,
        missing,
        total: species.length,
        got,
        scene: biome.scene,
        title: text(biome.name) || biome.scene,
      };
      if (betterCandidate(candidate, best)) best = candidate;
    });

    if (!best) return null;
    const next = nextMissing(best.missing, env);
    return {
      kind: 'biome',
      title: best.title,
      meta: `${best.got}/${best.total} species · ${best.missing.length} missing`,
      note: noteFor(next, env),
      progress: { owned: best.got, total: best.total },
      target: { type: 'biome', scene: best.scene, species: next.key },
    };
  }

  function eggCandidate(owned, env) {
    const eggs = knownSpecies(env.typeEggs, env.hasSpecies)
      .filter((key) => priceOf(env, key) !== null);
    if (!eggs.length) return null;
    const missing = eggs.filter((key) => !owned.has(key));
    if (!missing.length) return null;
    const got = eggs.length - missing.length;
    const next = nextMissing(missing, env);

    return {
      kind: 'egg',
      title: 'Type egg shelf',
      meta: `${got}/${eggs.length} bought · ${missing.length} missing`,
      note: noteFor(next, env),
      progress: { owned: got, total: eggs.length },
      target: { type: 'egg', species: next.key },
    };
  }

  function build(save, env) {
    const snapshot = object(save);
    const data = object(env);
    if (!snapshot || !data) return deepFreeze({ cards: [] });
    const owned = ownedSpecies(snapshot);
    const cards = [
      familyCandidate(owned, data),
      constellationCandidate(snapshot, data),
      biomeCandidate(owned, data),
      eggCandidate(owned, data),
    ].filter(Boolean);
    return deepFreeze({ cards });
  }

  root.CollectionGoals = Object.freeze({ build });
})(typeof globalThis !== 'undefined' ? globalThis : this);
