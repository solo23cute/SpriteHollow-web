/* Compare and conservatively merge two Hollow saves.

   The save code path is the cross-device boundary: a player may paste a code
   from a phone that has been played separately for weeks. This module never
   touches storage or the DOM. It answers two questions for the chooser:

     compare(device, incoming)  what is different?
     merge(device, incoming)    how do we keep both collections safely?

   Merge rules are intentionally conservative:
     - every unique sprite id survives;
     - a shared sprite keeps the copy with the most progress;
     - coins keep the larger balance rather than being added together;
     - unlock lists, custom creations, badges, homes and stats are unioned;
     - settings, dailies and check-in state follow the newer save.

   The caller is responsible for writing the merged save and for making a
   restore point first. */

(function (root) {
  'use strict';

  const VERSION = 1;

  const UNLOCK_GROUPS = Object.freeze({
    scenes: 'Biomes',
    wardrobe: 'Wardrobe',
    foods: 'Foods',
    vaults: 'Vault doors',
    guardians: 'Guardians',
    secrets: 'Secret species',
    customScenes: 'Custom biomes',
    customClothes: 'Custom outfits',
    looks: 'Saved looks',
    genes: 'Gene species',
    badges: 'Event badges',
    houses: 'Houses',
    homeUpgrades: 'Home upgrades',
    biomesVisited: 'Biomes visited',
  });

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function array(value) {
    return Array.isArray(value) ? value : [];
  }

  function number(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function uniqueStrings(values) {
    const seen = new Set();
    return array(values).filter((value) => {
      if (typeof value !== 'string' || !value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  function idOf(item, index) {
    if (typeof item === 'string' && item) return item;
    if (object(item) && typeof item.id === 'string' && item.id) return item.id;
    if (object(item) && typeof item.key === 'string' && item.key) return item.key;
    return `entry-${index}`;
  }

  function spriteId(sprite, index) {
    return object(sprite) && typeof sprite.id === 'string' && sprite.id
      ? sprite.id
      : `sprite-${index}`;
  }

  function spriteMap(save) {
    const map = new Map();
    array(save.sprites).forEach((sprite, index) => {
      if (!object(sprite)) return;
      const id = spriteId(sprite, index);
      if (!map.has(id)) map.set(id, sprite);
    });
    return map;
  }

  function speciesSet(save) {
    const set = new Set();
    array(save.sprites).forEach((sprite) => {
      if (object(sprite) && typeof sprite.element === 'string' && sprite.element) set.add(sprite.element);
    });
    return set;
  }

  function unlockKeys(save) {
    const guardians = object(save.guardiansBeaten);
    return {
      scenes: uniqueStrings(save.unlockedScenes),
      wardrobe: uniqueStrings(save.wardrobe),
      foods: uniqueStrings(save.foodUnlocks),
      vaults: uniqueStrings(save.vaultDoors),
      guardians: Object.keys(guardians).filter((key) => number(guardians[key]) > 0),
      secrets: uniqueStrings(save.secretUnlocks),
      finishes: uniqueStrings(save.finishUnlocks),
      customScenes: array(save.customScenes).map(idOf).filter((id) => !id.startsWith('entry-')),
      customClothes: array(save.customClothes).map(idOf).filter((id) => !id.startsWith('entry-')),
      looks: array(save.looks).map(idOf).filter((id) => !id.startsWith('entry-')),
      genes: array(save.geneDesigns).map(idOf).filter((id) => !id.startsWith('entry-')),
      badges: array(object(save.world).badges).map((badge) => object(badge).key).filter(Boolean),
      houses: Object.keys(object(save.houses)),
      homeUpgrades: Object.keys(object(save.homeUpgrades)).filter((key) => save.homeUpgrades[key]),
      biomesVisited: uniqueStrings(save.biomesVisited),
    };
  }

  function summary(save) {
    const sprites = array(save.sprites).filter((sprite) => object(sprite));
    const unlocks = unlockKeys(save);
    const counts = {};
    let total = 0;
    Object.keys(unlocks).forEach((key) => {
      counts[key] = unlocks[key].length;
      total += counts[key];
    });
    return {
      hollowName: typeof save.hollowName === 'string' && save.hollowName.trim()
        ? save.hollowName.trim()
        : 'Mosslight Hollow',
      coins: number(save.coins),
      savedAt: number(save.savedAt),
      createdAt: number(save.createdAt),
      sprites: sprites.length,
      eggs: sprites.filter((sprite) => sprite.stage === 'egg').length,
      species: speciesSet(save).size,
      unlocks: { total, counts },
    };
  }

  function compareSpriteProgress(a, b) {
    const fields = ['level', 'xp', 'bond', 'hatch', 'rebirths', 'evolvedAt'];
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];
      const av = number(a && a[field]);
      const bv = number(b && b[field]);
      if (av !== bv) return av > bv ? 1 : -1;
    }
    return 0;
  }

  function compare(device, incoming) {
    const left = object(device);
    const right = object(incoming);
    const leftSummary = summary(left);
    const rightSummary = summary(right);
    const leftSprites = spriteMap(left);
    const rightSprites = spriteMap(right);
    const onlyLeft = [...leftSprites.keys()].filter((id) => !rightSprites.has(id));
    const onlyRight = [...rightSprites.keys()].filter((id) => !leftSprites.has(id));
    const shared = [...leftSprites.keys()].filter((id) => rightSprites.has(id));
    let betterLeft = 0;
    let betterRight = 0;
    shared.forEach((id) => {
      const result = compareSpriteProgress(leftSprites.get(id), rightSprites.get(id));
      if (result > 0) betterLeft += 1;
      else if (result < 0) betterRight += 1;
    });

    const leftSpecies = speciesSet(left);
    const rightSpecies = speciesSet(right);
    const leftUnlocks = unlockKeys(left);
    const rightUnlocks = unlockKeys(right);
    const groups = Object.keys(UNLOCK_GROUPS).map((key) => {
      const leftKeys = leftUnlocks[key] || [];
      const rightKeys = rightUnlocks[key] || [];
      const leftSet = new Set(leftKeys);
      const rightSet = new Set(rightKeys);
      return {
        key,
        label: UNLOCK_GROUPS[key],
        left: leftKeys.length,
        right: rightKeys.length,
        onlyLeft: leftKeys.filter((value) => !rightSet.has(value)),
        onlyRight: rightKeys.filter((value) => !leftSet.has(value)),
      };
    });

    return {
      left: leftSummary,
      right: rightSummary,
      sprites: {
        onlyLeft,
        onlyRight,
        shared: shared.length,
        betterLeft,
        betterRight,
      },
      species: {
        onlyLeft: [...leftSpecies].filter((key) => !rightSpecies.has(key)),
        onlyRight: [...rightSpecies].filter((key) => !leftSpecies.has(key)),
        shared: [...leftSpecies].filter((key) => rightSpecies.has(key)).length,
      },
      coins: {
        left: leftSummary.coins,
        right: rightSummary.coins,
        delta: rightSummary.coins - leftSummary.coins,
        winner: rightSummary.coins > leftSummary.coins ? 'right'
          : leftSummary.coins > rightSummary.coins ? 'left' : 'same',
      },
      dates: {
        savedAt: { left: leftSummary.savedAt, right: rightSummary.savedAt },
        createdAt: { left: leftSummary.createdAt, right: rightSummary.createdAt },
        newer: rightSummary.savedAt > leftSummary.savedAt ? 'right'
          : leftSummary.savedAt > rightSummary.savedAt ? 'left' : 'same',
      },
      unlocks: {
        left: leftSummary.unlocks.total,
        right: rightSummary.unlocks.total,
        groups,
      },
    };
  }

  function mergeUniqueArrays(a, b) {
    return [...new Set([...array(a), ...array(b)].filter((value) => typeof value === 'string' && value))];
  }

  function mergeNumericMaps(a, b) {
    const out = Object.assign({}, object(a));
    Object.keys(object(b)).forEach((key) => {
      out[key] = Math.max(number(out[key]), number(b[key]));
    });
    return out;
  }

  function mergeBooleanMaps(a, b) {
    const out = Object.assign({}, object(a));
    Object.keys(object(b)).forEach((key) => {
      out[key] = !!out[key] || !!b[key];
    });
    return out;
  }

  function mergeSpriteLists(baseList, otherList) {
    const out = [];
    const index = new Map();
    array(baseList).forEach((sprite, i) => {
      if (!object(sprite)) return;
      const id = spriteId(sprite, i);
      if (index.has(id)) return;
      index.set(id, out.length);
      out.push(sprite);
    });
    array(otherList).forEach((sprite, i) => {
      if (!object(sprite)) return;
      const id = spriteId(sprite, i);
      if (!index.has(id)) {
        index.set(id, out.length);
        out.push(sprite);
        return;
      }
      const at = index.get(id);
      if (compareSpriteProgress(sprite, out[at]) > 0) out[at] = sprite;
    });
    return out;
  }

  function mergeCollections(baseList, otherList) {
    const out = [];
    const index = new Map();
    const add = (item, sourceIndex, prefer) => {
      if (!object(item)) return;
      const id = idOf(item, sourceIndex);
      if (!index.has(id)) {
        index.set(id, out.length);
        out.push(item);
        return;
      }
      if (prefer) {
        const at = index.get(id);
        const oldAt = number(out[at].savedAt) || number(out[at].at) || number(out[at].createdAt);
        const newAt = number(item.savedAt) || number(item.at) || number(item.createdAt);
        if (newAt > oldAt) out[at] = item;
      }
    };
    array(baseList).forEach((item, i) => add(item, i, false));
    array(otherList).forEach((item, i) => add(item, i, true));
    return out;
  }

  function mergeHouses(baseHouses, otherHouses) {
    const out = Object.assign({}, object(otherHouses), object(baseHouses));
    Object.keys(object(otherHouses)).forEach((id) => {
      const base = object(baseHouses)[id];
      const other = object(otherHouses)[id];
      if (!base) {
        out[id] = other;
        return;
      }
      out[id] = Object.assign({}, other, base, {
        members: uniqueStrings([...array(base.members), ...array(other.members)]),
        bond: Math.max(number(base.bond), number(other.bond)),
        milestone: Math.max(number(base.milestone), number(other.milestone)),
        lastBondAt: Math.max(number(base.lastBondAt), number(other.lastBondAt)),
        lastPlayAt: Math.max(number(base.lastPlayAt), number(other.lastPlayAt)),
        formedAt: Math.min(
          number(base.formedAt) || Infinity,
          number(other.formedAt) || Infinity,
        ) || 0,
      });
    });
    return out;
  }

  function mergeSpeciesHomes(baseHomes, otherHomes) {
    const out = Object.assign({}, object(otherHomes), object(baseHomes));
    Object.keys(object(otherHomes)).forEach((id) => {
      const base = object(baseHomes)[id];
      const other = object(otherHomes)[id];
      if (!base) {
        out[id] = other;
        return;
      }
      out[id] = {
        tier: base.tier || other.tier || 'sapling',
        taps: mergeNumericMaps(other.taps, base.taps),
      };
    });
    return out;
  }

  function mergeBadges(baseBadges, otherBadges) {
    const out = [];
    const index = new Map();
    const add = (badge) => {
      if (!object(badge) || !badge.key) return;
      if (!index.has(badge.key)) {
        index.set(badge.key, out.length);
        out.push(badge);
        return;
      }
      const at = index.get(badge.key);
      const old = out[at];
      out[at] = Object.assign({}, old, badge, {
        count: Math.max(number(old.count), number(badge.count), 1),
        first: Math.min(number(old.first) || Infinity, number(badge.first) || Infinity) || 0,
        last: Math.max(number(old.last), number(badge.last)),
      });
    };
    array(baseBadges).forEach(add);
    array(otherBadges).forEach(add);
    return out;
  }

  function mergeInventory(baseInventory, otherInventory) {
    const base = object(baseInventory);
    const other = object(otherInventory);
    return {
      ...other,
      ...base,
      snacks: mergeNumericMaps(other.snacks, base.snacks),
      foods: mergeNumericMaps(other.foods, base.foods),
    };
  }

  function mergeWaveGames(baseGames, otherGames) {
    const base = object(baseGames);
    const other = object(otherGames);
    const out = {};
    [...new Set([...Object.keys(other), ...Object.keys(base)])].forEach((kind) => {
      const left = object(base[kind]);
      const right = object(other[kind]);
      out[kind] = {
        plays: Math.max(number(left.plays), number(right.plays)),
        best: Math.max(number(left.best), number(right.best)),
      };
    });
    return out;
  }

  function mergeArcade(baseArcade, otherArcade) {
    const base = object(baseArcade);
    const other = object(otherArcade);
    return {
      ...other,
      ...base,
      coins: Math.max(number(base.coins), number(other.coins)),
      bonusClaims: Math.max(number(base.bonusClaims), number(other.bonusClaims)),
      monthCoins: Math.max(number(base.monthCoins), number(other.monthCoins)),
      monthClaims: uniqueStrings([...array(base.monthClaims), ...array(other.monthClaims)]),
    };
  }

  function mergeFlight(baseFlight, otherFlight) {
    const base = object(baseFlight);
    const other = object(otherFlight);
    return {
      ...other,
      ...base,
      startedAt: Math.min(
        number(base.startedAt) || Infinity,
        number(other.startedAt) || Infinity,
      ) || 0,
      claimed: !!base.claimed || !!other.claimed,
      skipped: !!base.skipped || !!other.skipped,
      migrated: !!base.migrated || !!other.migrated,
      giftClaimed: !!base.giftClaimed || !!other.giftClaimed,
      waiverUsed: !!base.waiverUsed || !!other.waiverUsed,
      fusionId: base.fusionId || other.fusionId || null,
    };
  }

  function merge(device, incoming) {
    const left = object(clone(device));
    const right = object(clone(incoming));
    const leftStamp = number(left.savedAt);
    const rightStamp = number(right.savedAt);
    const base = rightStamp >= leftStamp ? right : left;
    const other = base === right ? left : right;
    const baseSide = base === right ? 'incoming' : 'device';
    const leftSprites = spriteMap(left);
    const rightSprites = spriteMap(right);
    const baseSprites = spriteMap(base);
    const otherSprites = spriteMap(other);
    const shared = [...baseSprites.keys()].filter((id) => otherSprites.has(id));
    const onlyDevice = [...leftSprites.keys()].filter((id) => !rightSprites.has(id));
    const onlyIncoming = [...rightSprites.keys()].filter((id) => !leftSprites.has(id));
    let betterFromOther = 0;
    shared.forEach((id) => {
      if (compareSpriteProgress(otherSprites.get(id), baseSprites.get(id)) > 0) betterFromOther += 1;
    });

    const merged = Object.assign({}, base);
    merged.v = base.v || 2;
    merged.started = !!left.started || !!right.started;
    merged.createdAt = Math.min(
      number(left.createdAt) || Infinity,
      number(right.createdAt) || Infinity,
    ) || 0;
    merged.savedAt = Math.max(leftStamp, rightStamp);
    merged.coins = Math.max(number(left.coins), number(right.coins));
    merged.sprites = mergeSpriteLists(base.sprites, other.sprites);
    merged.stats = mergeNumericMaps(other.stats, base.stats);
    merged.guardiansBeaten = mergeNumericMaps(other.guardiansBeaten, base.guardiansBeaten);
    merged.arcade = mergeArcade(base.arcade, other.arcade);
    merged.inventory = mergeInventory(base.inventory, other.inventory);
    merged.waveGames = mergeWaveGames(base.waveGames, other.waveGames);
    merged.seen = mergeBooleanMaps(other.seen, base.seen);
    merged.homeUpgrades = mergeBooleanMaps(other.homeUpgrades, base.homeUpgrades);
    merged.codeRedeems = Object.assign({}, object(other.codeRedeems), object(base.codeRedeems));
    merged.unlockedScenes = mergeUniqueArrays(base.unlockedScenes, other.unlockedScenes);
    merged.wardrobe = mergeUniqueArrays(base.wardrobe, other.wardrobe);
    merged.foodUnlocks = mergeUniqueArrays(base.foodUnlocks, other.foodUnlocks);
    merged.favoriteGames = mergeUniqueArrays(base.favoriteGames, other.favoriteGames);
    merged.cafeRecipes = mergeUniqueArrays(base.cafeRecipes, other.cafeRecipes);
    merged.vaultDoors = mergeUniqueArrays(base.vaultDoors, other.vaultDoors);
    merged.customGuardians = mergeUniqueArrays(base.customGuardians, other.customGuardians);
    merged.secretUnlocks = mergeUniqueArrays(base.secretUnlocks, other.secretUnlocks);
    merged.finishUnlocks = mergeUniqueArrays(base.finishUnlocks, other.finishUnlocks);
    merged.biomesVisited = mergeUniqueArrays(base.biomesVisited, other.biomesVisited);
    merged.customScenes = mergeCollections(base.customScenes, other.customScenes);
    merged.customClothes = mergeCollections(base.customClothes, other.customClothes);
    merged.looks = mergeCollections(base.looks, other.looks);
    merged.geneDesigns = mergeCollections(base.geneDesigns, other.geneDesigns);
    merged.storyShelf = mergeCollections(base.storyShelf, other.storyShelf);
    merged.roomPresets = mergeCollections(base.roomPresets, other.roomPresets);
    merged.houses = mergeHouses(base.houses, other.houses);
    merged.speciesHomes = mergeSpeciesHomes(base.speciesHomes, other.speciesHomes);
    merged.homes = Object.assign({}, object(other.homes), object(base.homes));
    merged.roomLayout = Object.assign({}, object(other.roomLayout), object(base.roomLayout));
    merged.houseTints = Object.assign({}, object(other.houseTints), object(base.houseTints));
    merged.houseTintStrengths = Object.assign({}, object(other.houseTintStrengths), object(base.houseTintStrengths));
    merged.furnitureFavorites = mergeUniqueArrays(base.furnitureFavorites, other.furnitureFavorites);
    merged.world = Object.assign({}, object(other.world), object(base.world), {
      badges: mergeBadges(object(base.world).badges, object(other.world).badges),
    });
    merged.flight = mergeFlight(base.flight, other.flight);
    merged.familyClaims = mergeNumericMaps(other.familyClaims, base.familyClaims);

    const ids = new Set(merged.sprites.map((sprite, i) => spriteId(sprite, i)));
    if (!merged.activeId || !ids.has(merged.activeId)) {
      const first = merged.sprites.find((sprite) => sprite.stage !== 'egg' && !sprite.retired)
        || merged.sprites.find((sprite) => sprite.stage !== 'egg')
        || merged.sprites[0];
      merged.activeId = first ? first.id : null;
    }

    const leftUnlocks = unlockKeys(left);
    const rightUnlocks = unlockKeys(right);
    const addedFromDevice = Object.keys(leftUnlocks).reduce((sum, key) => {
      const rightSet = new Set(rightUnlocks[key] || []);
      return sum + leftUnlocks[key].filter((value) => !rightSet.has(value)).length;
    }, 0);
    const addedFromIncoming = Object.keys(rightUnlocks).reduce((sum, key) => {
      const leftSet = new Set(leftUnlocks[key] || []);
      return sum + rightUnlocks[key].filter((value) => !leftSet.has(value)).length;
    }, 0);

    return {
      save: merged,
      report: {
        base: baseSide,
        sprites: {
          total: merged.sprites.length,
          shared: shared.length,
          onlyDevice: onlyDevice.length,
          onlyIncoming: onlyIncoming.length,
          betterFromOther,
        },
        coins: merged.coins,
        unlocks: { addedFromDevice, addedFromIncoming },
        savedAt: merged.savedAt,
      },
    };
  }

  root.SaveCompare = Object.freeze({
    VERSION,
    UNLOCK_GROUPS,
    summary,
    compare,
    merge,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
