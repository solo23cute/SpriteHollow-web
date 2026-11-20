/* Hollow Compass: a pure, deterministic "what next" planner.

   build(save, env) returns at most three cards, one for each track:
     collection finish the nearest incomplete constellation
     care       check in with the resident whose lowest need is running low
     discovery  visit the next chart habitat or open the next vault door

   There is deliberately no clock, random source, DOM, storage or timer here.
   The caller supplies a save snapshot and an environment adapter; the planner
   only reads them and returns fresh, deeply frozen data. */

(function (root) {
  'use strict';

  const NEEDS = Object.freeze([
    Object.freeze({ key: 'hunger', label: 'Food' }),
    Object.freeze({ key: 'energy', label: 'Rest' }),
    Object.freeze({ key: 'joy', label: 'Joy' }),
    Object.freeze({ key: 'clean', label: 'Clean' }),
  ]);
  const CARE_THRESHOLD = 60;

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  }

  function finite(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function numberOr(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function plain(value) {
    return String(value);
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    return Object.freeze(value);
  }

  /* Higher scores win. Costs only break ties, so a completed-but-cheap route
     cannot outrank a nearly finished one. */
  function compareCandidates(a, b) {
    const aScore = finite(a.score) ? a.score : 0;
    const bScore = finite(b.score) ? b.score : 0;
    if (aScore !== bScore) return bScore - aScore;
    const aCost = finite(a.cost) ? a.cost : Infinity;
    const bCost = finite(b.cost) ? b.cost : Infinity;
    if (aCost !== bCost) return aCost - bCost;
    if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  }

  function careCandidate(save, env) {
    const sprites = Array.isArray(object(save) && save.sprites) ? save.sprites : [];
    const nameOf = typeof env.displayNameOf === 'function' ? env.displayNameOf : (sprite) => text(sprite.name) || 'your sprite';
    const candidates = [];

    sprites.forEach((sprite) => {
      if (!object(sprite) || !text(sprite.id)) return;
      if (sprite.stage === 'egg' || sprite.retired || sprite.atHome) return;
      const needs = object(sprite.needs);
      if (!needs) return;

      const readings = NEEDS
        .map((need) => ({ ...need, value: Number(needs[need.key]) }))
        .filter((need) => Number.isFinite(need.value));
      if (!readings.length) return;

      const lowest = readings.reduce((best, need) => (need.value < best.value ? need : best), readings[0]);
      const lowestValue = Math.max(0, Math.min(100, lowest.value));
      if (lowestValue >= CARE_THRESHOLD) return;

      const average = readings.reduce((sum, need) => sum + Math.max(0, Math.min(100, need.value)), 0) / readings.length;
      const name = text(nameOf(sprite)) || 'your sprite';
      candidates.push({
        track: 'care',
        kind: 'care',
        id: sprite.id,
        title: `Check in with ${name}`,
        meta: `${lowest.label} ${Math.round(lowestValue)}/100 · ${lowestValue < 30 ? 'running low' : 'worth a check-in'}`,
        note: 'Open the care dock · +bond',
        score: 100 - lowestValue,
        remaining: (100 - lowestValue) / 100,
        cost: 0,
        progress: { value: Math.round(lowestValue), total: 100 },
        need: { key: lowest.key, label: lowest.label, value: Math.round(lowestValue), average: Math.round(average) },
        target: { type: 'care', spriteId: sprite.id },
      });
    });

    return candidates.sort(compareCandidates)[0] || null;
  }

  function constellationCandidate(save, env) {
    const constellations = object(env.constellations);
    if (!constellations || typeof constellations.analyze !== 'function' || typeof constellations.seedById !== 'function') return null;

    let analysis;
    try {
      analysis = constellations.analyze(save);
    } catch (err) {
      return null;
    }
    const nearest = object(analysis) && Array.isArray(analysis.nearest) ? analysis.nearest[0] : null;
    const seed = nearest && constellations.seedById(nearest.id);
    if (!object(nearest) || !object(seed) || nearest.complete) return null;

    const priceOf = typeof env.priceOf === 'function' ? env.priceOf : () => null;
    const nameOf = typeof env.nameOf === 'function' ? env.nameOf : (key) => key;
    const ownership = typeof constellations.ownershipFromSave === 'function'
      ? constellations.ownershipFromSave(save)
      : null;
    const missing = Array.isArray(seed.members)
      ? seed.members.find((member) => !ownership || typeof constellations.ownsMember !== 'function'
        || !constellations.ownsMember(ownership, member))
      : null;
    const nextName = missing ? (missing.kind === 'species' ? nameOf(missing.key) : text(missing.key) || 'a fusion form') : '';
    const nextPrice = missing && missing.kind === 'species' ? priceOf(missing.key) : null;
    const cost = finite(nextPrice) && nextPrice >= 0 ? nextPrice : null;
    const total = Math.max(1, Number(nearest.total) || 1);
    const owned = Math.max(0, Math.min(total, Number(nearest.owned) || 0));
    const ratio = finite(nearest.ratio) ? Math.max(0, Math.min(1, nearest.ratio)) : owned / total;
    const note = cost !== null
      ? `Next egg ${nextName} · 🪙 ${plain(cost)}`
      : nextName
        ? `Next ${nextName} · fusion route`
        : 'Open the chart';

    return {
      track: 'collection',
      kind: 'constellation',
      id: nearest.id,
      title: `Chart ${nearest.name}`,
      meta: `${owned}/${total} members · ${Math.max(0, total - owned)} missing`,
      note,
      score: ratio * 100,
      remaining: ratio,
      cost,
      progress: { owned, total },
      target: { type: 'constellation', seedId: nearest.id },
    };
  }

  function biomeCandidate(save, env, constellations) {
    const currentScene = text(object(save) && object(save.theme) && save.theme.scene);
    const scenes = object(env.scenes) || {};
    const visited = new Set(Array.isArray(object(save) && save.biomesVisited) ? save.biomesVisited : []);
    let chartCandidate = null;

    if (constellations && typeof constellations.analyze === 'function' && typeof constellations.seedById === 'function') {
      let analysis;
      try {
        analysis = constellations.analyze(save);
      } catch (err) {
        analysis = null;
      }
      const incomplete = object(analysis) && Array.isArray(analysis.all)
        ? analysis.all
          .filter((progress) => object(progress) && progress.completable && !progress.complete)
          .map((progress) => ({ progress, seed: constellations.seedById(progress.id) }))
          .filter((entry) => object(entry.seed) && text(entry.seed.scene) && entry.seed.scene !== currentScene && scenes[entry.seed.scene])
          .sort((a, b) => {
            const aRatio = finite(a.progress.ratio) ? a.progress.ratio : 0;
            const bRatio = finite(b.progress.ratio) ? b.progress.ratio : 0;
            if (aRatio !== bRatio) return bRatio - aRatio;
            return a.progress.id < b.progress.id ? -1 : a.progress.id > b.progress.id ? 1 : 0;
          })
        : [];
      const best = incomplete[0];
      if (best) {
        const scene = scenes[best.seed.scene];
        const total = Math.max(1, Number(best.progress.total) || 1);
        const owned = Math.max(0, Math.min(total, Number(best.progress.owned) || 0));
        const ratio = finite(best.progress.ratio) ? Math.max(0, Math.min(1, best.progress.ratio)) : owned / total;
        chartCandidate = {
          track: 'discovery',
          kind: 'biome',
          id: best.seed.scene,
          title: `Visit ${text(scene.name) || best.seed.scene}`,
          meta: `${owned}/${total} chart members · ${best.progress.name}`,
          note: `Free travel · +${Math.round(numberOr(scene.bonus, 0.4) * 100)}% XP`,
          score: ratio * 100,
          remaining: ratio,
          cost: 0,
          progress: { owned, total },
          target: { type: 'biome', scene: best.seed.scene, seedId: best.seed.id },
        };
      }
    }

    const fallback = (Array.isArray(env.biomes) ? env.biomes : [])
      .filter((biome) => object(biome) && text(biome.scene) && biome.scene !== currentScene
        && !visited.has(biome.scene) && scenes[biome.scene])
      .sort((a, b) => (a.scene < b.scene ? -1 : a.scene > b.scene ? 1 : 0))[0];
    if (!fallback) return chartCandidate;

    const scene = scenes[fallback.scene];
    const fallbackCandidate = {
      track: 'discovery',
      kind: 'biome',
      id: fallback.scene,
      title: `Explore ${text(scene.name) || fallback.scene}`,
      meta: `${text(fallback.label) || 'Biome'} · not visited yet`,
      note: `Free travel · +${Math.round(numberOr(scene.bonus, 0.4) * 100)}% XP`,
      score: 0,
      remaining: 0,
      cost: 0,
      progress: { owned: 0, total: 1 },
      target: { type: 'biome', scene: fallback.scene },
    };
    return chartCandidate || fallbackCandidate;
  }

  function vaultCandidate(save, env) {
    const doors = Array.isArray(env.vaultDoors) ? env.vaultDoors : [];
    const opened = new Set(Array.isArray(object(save) && save.vaultDoors) ? save.vaultDoors : []);
    const travels = Math.max(0, numberOr(object(save) && object(save.stats) && save.stats.travels, env.travels));
    const next = doors
      .filter((door) => object(door) && text(door.id) && !opened.has(door.id))
      .sort((a, b) => {
        const aTravels = Math.max(0, numberOr(a.travels, 0));
        const bTravels = Math.max(0, numberOr(b.travels, 0));
        if (aTravels !== bTravels) return aTravels - bTravels;
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      })[0];
    if (!next) return null;

    const needed = Math.max(0, numberOr(next.travels, 0));
    const cost = Math.max(0, needed - travels);
    const remaining = needed ? Math.min(1, travels / needed) : 1;
    return {
      track: 'discovery',
      kind: 'vault',
      id: next.id,
      title: `Open the ${text(next.name) || next.id}`,
      meta: `Secret door · ${travels}/${needed} travels`,
      note: cost
        ? `${cost} more travel${cost === 1 ? '' : 's'}${next.coins ? ` · 🪙 ${plain(next.coins)}` : ''}`
        : `Ready to open${next.coins ? ` · 🪙 ${plain(next.coins)}` : ''}`,
      score: remaining * 100,
      remaining,
      cost,
      progress: { owned: Math.min(travels, needed), total: needed },
      target: { type: 'vault', doorId: next.id },
    };
  }

  function build(save, env) {
    const snapshot = object(save);
    const data = object(env);
    if (!snapshot || !data) return deepFreeze({ cards: [] });

    const constellations = object(data.constellations) || null;
    const collection = constellationCandidate(snapshot, data);
    const care = careCandidate(snapshot, data);
    const biome = biomeCandidate(snapshot, data, constellations);
    const vault = vaultCandidate(snapshot, data);
    const discovery = biome && vault ? (compareCandidates(biome, vault) <= 0 ? biome : vault) : (biome || vault);
    const cards = [collection, care, discovery].filter(Boolean).slice(0, 3);
    return deepFreeze({ cards });
  }

  root.HollowCompass = Object.freeze({ build });
})(typeof globalThis !== 'undefined' ? globalThis : this);
