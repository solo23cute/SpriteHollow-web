/* Per-family completion and milestone rewards.

   Counting rule: a species completes a family only once it is a hatched,
   living sprite in the Hollow. Unhatched eggs are inventory, not collection
   progress, and a retired sprite is no longer at home. Duplicates count once,
   so the completion number is always 0..family size. Claims are stored as the
   number of milestones already taken for that family, so a reward already
   received stays received even if a sprite later leaves the Hollow. */

(function (root) {
  'use strict';

  const MILESTONE_SHARES = Object.freeze([0.25, 0.5, 0.75, 1]);
  const MAX_MILESTONES = MILESTONE_SHARES.length;
  const COINS_PER_SPECIES = 20;
  const MIN_REWARD = 25;
  /* A single family shortcut purchase may not exceed this price. It keeps the
     feature from quietly buying an expensive apex egg by accident. */
  const BUY_CAP = 1000;

  function speciesOf(family) {
    return family && Array.isArray(family.species) ? family.species : [];
  }

  function ownedSet(family, sprites) {
    const familyKeys = new Set(speciesOf(family));
    const owned = new Set();
    (Array.isArray(sprites) ? sprites : []).forEach((sprite) => {
      if (!sprite || sprite.stage === 'egg' || sprite.retired) return;
      if (typeof sprite.element !== 'string' || !familyKeys.has(sprite.element)) return;
      owned.add(sprite.element);
    });
    return owned;
  }

  function countOwned(family, sprites) {
    return ownedSet(family, sprites).size;
  }

  function milestones(family) {
    const total = speciesOf(family).length;
    if (!total) return [];
    /* Thresholds are percentages of the family, rounded up. Tiny families
       collapse several shares onto the same count; the biggest share wins so
       the reward is not paid at the smallest tier. */
    const byNeed = new Map();
    MILESTONE_SHARES.forEach((share) => {
      byNeed.set(Math.max(1, Math.ceil(total * share)), share);
    });
    return [...byNeed.entries()].map(([need, share], index) => ({
      index,
      need,
      total,
      share,
      percent: Math.round(share * 100),
      coins: Math.max(MIN_REWARD, Math.round(total * share * COINS_PER_SPECIES)),
    }));
  }

  function elementsTable() {
    if (typeof ELEMENTS !== 'undefined') return ELEMENTS;
    return root.ELEMENTS || {};
  }

  function priceTable() {
    if (typeof TYPE_EGG_PRICE !== 'undefined') return TYPE_EGG_PRICE;
    return root.TYPE_EGG_PRICE || {};
  }

  function eggPrice(key) {
    const value = Number(priceTable()[key]);
    return Number.isFinite(value) && value > 0 ? value : 120;
  }

  /* The cheapest family species not present in the Hollow in any form. Eggs,
     babies, grown sprites, and retired sprites all count as present, so the
     shortcut can never buy a duplicate. */
  function missingEgg(family, sprites, cap = BUY_CAP) {
    const present = new Set((Array.isArray(sprites) ? sprites : [])
      .filter((sprite) => sprite && typeof sprite.element === 'string')
      .map((sprite) => sprite.element));
    const missing = speciesOf(family).filter((key) => !present.has(key));
    if (!missing.length) return null;
    missing.sort((a, b) => eggPrice(a) - eggPrice(b)
      || String(elementsTable()[a]?.name || a).localeCompare(String(elementsTable()[b]?.name || b)));
    const key = missing[0];
    const price = eggPrice(key);
    const limit = Number.isFinite(Number(cap)) ? Number(cap) : BUY_CAP;
    return {
      key,
      name: elementsTable()[key]?.name || key,
      price,
      cap: limit,
      overCap: price > limit,
    };
  }

  function sanitizeClaims(raw) {
    const clean = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return clean;
    Object.keys(raw).slice(0, 400).forEach((id) => {
      if (!/^[a-z0-9][a-z0-9-]{0,80}$/i.test(id)) return;
      const value = Math.floor(Number(raw[id]));
      if (!Number.isFinite(value) || value <= 0) return;
      clean[id] = Math.min(MAX_MILESTONES, value);
    });
    return clean;
  }

  function claimedCount(claims, familyId) {
    if (!familyId || !claims || typeof claims !== 'object') return 0;
    const value = Math.floor(Number(claims[familyId]) || 0);
    return Math.min(MAX_MILESTONES, Math.max(0, value));
  }

  function status(family, sprites, claims) {
    const list = milestones(family);
    const owned = countOwned(family, sprites);
    const claimed = Math.min(claimedCount(claims, family && family.id), list.length);
    const next = list[claimed] && owned >= list[claimed].need ? list[claimed] : null;
    return {
      owned,
      total: list.length ? list[0].total : speciesOf(family).length,
      milestones: list,
      claimed,
      next,
      complete: list.length > 0 && claimed >= list.length,
    };
  }

  function claim(family, sprites, claims) {
    const state = status(family, sprites, claims);
    if (!state.next) {
      return { ok: false, reason: state.complete ? 'complete' : 'locked' };
    }
    return {
      ok: true,
      familyId: family.id,
      index: state.next.index,
      coins: state.next.coins,
      milestone: state.next,
    };
  }

  root.FamilyCompletion = Object.freeze({
    MILESTONE_SHARES,
    MAX_MILESTONES,
    COINS_PER_SPECIES,
    MIN_REWARD,
    BUY_CAP,
    ownedSet,
    countOwned,
    eggPrice,
    missingEgg,
    milestones,
    sanitizeClaims,
    status,
    claim,
  });
})(typeof window !== 'undefined' ? window : globalThis);
