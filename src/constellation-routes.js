/* Collection Constellations, phase 2: the routing layer.

   Turns a seed constellation plus the current save into exact calls on the
   actions the game already has:

     base type egg   Actions.buyTypeEgg(key)        focus via openApexTypeEgg(key, 'base')
     habitat travel  Actions.setTheme({ scene })   then App.go('hollow')
     habitat roster  Actions.setHome(spriteId, scene)
     fusion pair     Actions.previewMerge(aId, bId) -> Actions.completeMerge(...)

   No new action, screen, sheet or save field is introduced. Fusion routes are
   always marked `certainty: 'chance'` and carry their odds; the panels open the
   normal breeding entry so the player confirms the merge explicitly.

   Public surface: the frozen route table and planFor(). Helper focuses stay
   private so the UI has one entry point per seed.

   Needs src/constellations.js for seed membership. Everything else is passed
   in through `env`/`options`, so the planner stays clock-, random- and
   DOM-free. */

(function (root) {
  'use strict';

  /* The Nest deep link uses 'base' to mean "this species' ordinary band egg",
     as opposed to the apex 'celestial' | 'divine' | 'eternal' premium eggs. */
  const BASE_FOCUS_RANK = 'base';

  const CERTAINTY = Object.freeze({
    EXACT: 'exact',
    CHANCE: 'chance',
  });

  const FUSION_KINDS = Object.freeze({
    BLOODLINE: 'bloodline',
    COMBO: 'combo',
    SECRET: 'secret',
    CELESTIAL: 'celestial',
  });

  const ACTIONS = Object.freeze({
    BUY: 'Actions.buyTypeEgg',
    TRAVEL: 'Actions.setTheme',
    HOME: 'Actions.setHome',
    PREVIEW_MERGE: 'Actions.previewMerge',
    COMPLETE_MERGE: 'Actions.completeMerge',
    FOCUS_EGG: 'openApexTypeEgg',
    GO: 'App.go',
    BREEDING_ENTRY: 'openBreedingEntry',
  });

  /* The exact merge odds the fusion code already uses (state.js mergeOdds and
     data-hybrids hybridRollFor), expressed as rates rather than display
     percents so a caller can show either. */
  const HYBRID_NAME_CHANCE = 0.45;
  const TRIBRID_ROLL_CHANCE = 0.4;
  const COMBO_BASE = 0.04;
  const COMBO_PER_MERGE = 0.012;
  const COMBO_CAP = 0.34;
  const SECRET_BASE = 0.02;
  const SECRET_PER_MERGE = 0.002;
  const SECRET_CAP = 0.12;

  function pairKey(a, b) {
    return [a, b].sort().join('+');
  }

  const FUSION_KIND_BY_FAMILY = Object.freeze({
    bloodline: FUSION_KINDS.BLOODLINE,
    signature: FUSION_KINDS.COMBO,
    secret: FUSION_KINDS.SECRET,
    celestial: FUSION_KINDS.CELESTIAL,
  });

  /* A route adds only the recipes that are not already in the seed table.
     The habitat scene, anchor egg, fusion kind, product keys and member order
     all come from src/constellations.js. */
  const ROUTE_DEFS = [
    { seedId: 'meadow-kin' },
    { seedId: 'moonlit-haunt' },
    { seedId: 'tidepool-shallows' },
    { seedId: 'ember-forge-kin' },
    { seedId: 'sugar-kitchen' },
    { seedId: 'dream-conservatory' },
    { seedId: 'coral-reef-drifters' },
    { seedId: 'cavern-gleam' },
    { seedId: 'aurora-ridge-wanderers' },
    { seedId: 'golden-savanna-herd' },
    { seedId: 'fire-and-earth', fusion: { pair: ['earth', 'fire'] } },
    { seedId: 'water-and-ice', fusion: { pair: ['frost', 'tide'] } },
    { seedId: 'electric-and-wind', fusion: { pair: ['gale', 'volt'] } },
    { seedId: 'nature-and-light', fusion: { pair: ['bloom', 'radiant'] } },
    { seedId: 'crystal-and-metal', fusion: { pair: ['puffle_crystal', 'puffle_alloy'] } },
    {
      seedId: 'signature-classic',
      fusion: {
        recipes: [
          ['ember', 'tide'], ['dusk', 'ember'], ['dusk', 'radiant'],
          ['tide', 'volt'], ['frost', 'tide'], ['bloom', 'radiant'],
        ],
      },
    },
    {
      seedId: 'signature-franchise',
      fusion: {
        recipes: [
          ['ace', 'tide'], ['cuddle', 'bear'], ['captainx', 'tide'], ['geno', 'shadow'],
        ],
      },
    },
    {
      seedId: 'secret-fusions',
      fusion: {
        recipes: [
          ['radiant', 'shadow'], ['fire', 'puffle_volt'], ['bloom', 'water'],
          ['puffle_alloy', 'puffle_bloom'], ['puffle_venom', 'ice'],
        ],
      },
    },
    {
      seedId: 'celestial-triads',
      fusion: {
        recipes: [
          ['ember', 'radiant', 'puffle_volt'], ['gale', 'bloom', 'water'],
          ['dusk', 'radiant', 'crystal'], ['puffle_alloy', 'earth', 'fire'],
          ['dusk', 'tide', 'venom'],
        ],
      },
    },
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    Object.freeze(value);
    return value;
  }

  function buildRoute(def) {
    const seed = seedOf(def.seedId);
    if (!seed) return { seedId: def.seedId };
    const firstSpecies = seed.members.find((member) => member.kind === 'species');
    const firstRecipe = def.fusion ? (def.fusion.pair || def.fusion.recipes[0]) : null;
    const route = {
      seedId: def.seedId,
      egg: firstRecipe ? firstRecipe[0] : (firstSpecies ? firstSpecies.key : null),
    };
    if (seed.scene) route.habitat = { scene: seed.scene };
    if (def.fusion) {
      const kind = FUSION_KIND_BY_FAMILY[seed.family];
      const members = seed.members.filter((member) => member.kind === 'form' || member.kind === 'combo');
      if (kind === FUSION_KINDS.BLOODLINE) {
        route.fusion = {
          kind,
          products: members.map((member) => ({ key: member.key, pair: def.fusion.pair.slice() })),
        };
      } else if (kind === FUSION_KINDS.CELESTIAL) {
        route.fusion = {
          kind,
          triads: members.map((member, index) => ({ key: member.key, parts: def.fusion.recipes[index].slice() })),
        };
      } else {
        route.fusion = {
          kind,
          products: members.map((member, index) => ({ key: member.key, pair: def.fusion.recipes[index].slice() })),
        };
      }
    }
    return route;
  }

  const ROUTES = deepFreeze(ROUTE_DEFS.map(buildRoute));

  function routeFor(seedId) {
    if (typeof seedId !== 'string' || !seedId) return null;
    return ROUTES.find((route) => route.seedId === seedId) || null;
  }

  function constellations() {
    const api = root.Constellations;
    return api && Array.isArray(api.SEEDS) ? api : null;
  }

  function seedOf(seedId) {
    const api = constellations();
    return api && typeof api.seedById === 'function' ? api.seedById(seedId) : null;
  }

  function ownsMember(ownership, member) {
    const api = constellations();
    if (!api || typeof api.ownsMember !== 'function') return false;
    return api.ownsMember(ownership, member);
  }

  function comboChance(merges) {
    const count = Math.max(0, Number(merges) || 0);
    return Math.min(COMBO_CAP, COMBO_BASE + count * COMBO_PER_MERGE);
  }

  function secretChance(merges) {
    const count = Math.max(0, Number(merges) || 0);
    return Math.min(SECRET_CAP, SECRET_BASE + count * SECRET_PER_MERGE);
  }

  /* ---- type-egg focus ---- */

  /* The fusion parents a seed needs, in seed order, so an egg focus can point
     at whichever parent the player is still missing. */
  function fusionParentSpecies(route) {
    if (!route || !route.fusion) return [];
    const fusion = route.fusion;
    if (fusion.kind === FUSION_KINDS.CELESTIAL) return (fusion.triads[0] || {}).parts || [];
    const first = (fusion.products || [])[0];
    return first && first.pair ? first.pair.slice() : [];
  }

  function eggFocus(route, seed, ownership, env) {
    if (!route || !route.egg) return null;

    const candidates = [];
    if (seed) {
      seed.members.forEach((member) => {
        if (member.kind === 'species') candidates.push(member.key);
      });
    }
    fusionParentSpecies(route).forEach((key) => candidates.push(key));

    const missing = candidates.find((key) => !(ownership && ownership.species.has(key)));
    const species = missing || route.egg;
    const price = env && typeof env.priceOf === 'function' ? env.priceOf(species) : null;
    const rarity = env && typeof env.rarityOf === 'function' ? (env.rarityOf(species) || null) : null;

    return {
      species,
      missing: !(ownership && ownership.species.has(species)),
      price: Number.isFinite(Number(price)) ? Number(price) : null,
      rarity,
      certainty: CERTAINTY.EXACT,
      action: ACTIONS.BUY,
      args: [species],
      ui: ACTIONS.FOCUS_EGG,
      uiArgs: [species, BASE_FOCUS_RANK],
      focusRank: BASE_FOCUS_RANK,
    };
  }

  /* ---- focused habitat roster ---- */

  function habitatFocus(route, seed, ownership, env) {
    if (!route || !route.habitat || !seed) return null;
    const sceneKey = route.habitat.scene;
    const scene = env && typeof env.scene === 'function' ? env.scene(sceneKey) : null;
    const sceneMembers = scene && Array.isArray(scene.species) ? scene.species : [];

    const roster = seed.members
      .filter((member) => member.kind === 'species')
      .map((member) => ({
        key: member.key,
        name: env && typeof env.nameOf === 'function' ? (env.nameOf(member.key) || member.key) : member.key,
        owned: ownsMember(ownership, member),
        inScene: sceneMembers.includes(member.key),
      }));

    const owned = roster.filter((entry) => entry.owned).length;

    return {
      scene: sceneKey,
      sceneName: scene && scene.name ? scene.name : sceneKey,
      sceneRosterSize: sceneMembers.length,
      roster,
      owned,
      total: roster.length,
      allInScene: roster.length > 0 && roster.every((entry) => entry.inScene),
      certainty: CERTAINTY.EXACT,
      travel: {
        action: ACTIONS.TRAVEL,
        args: [{ scene: sceneKey }],
        ui: ACTIONS.GO,
        uiArgs: ['hollow'],
        certainty: CERTAINTY.EXACT,
      },
      placement: {
        action: ACTIONS.HOME,
        scene: sceneKey,
        certainty: CERTAINTY.EXACT,
      },
    };
  }

  /* ---- preselected fusion pair ---- */

  function parentReady(sprite, now) {
    if (!sprite || sprite.stage === 'egg') return false;
    if (Number(sprite.level) < 3) return false;
    if (now !== null && Number(sprite.restUntil) > now) return false;
    return true;
  }

  function parentFor(element, sprites, now) {
    const owned = sprites.filter((sprite) => sprite && sprite.element === element && sprite.stage !== 'egg');
    const ready = owned.filter((sprite) => parentReady(sprite, now));
    const chosen = ready[0] || owned[0] || null;
    return {
      element,
      spriteId: chosen ? chosen.id : null,
      owned: owned.length > 0,
      ready: !!chosen && parentReady(chosen, now),
      resting: !!chosen && now !== null && Number(chosen.restUntil) > now,
      leveled: !!chosen && Number(chosen.level) >= 3,
    };
  }

  /* A celestial form needs a two-element hybrid of two parts plus the plain
     third, exactly as tribridFor matches them. */
  function triadParents(parts, sprites, now) {
    const pairs = [[0, 1], [0, 2], [1, 2]];
    for (const [i, j] of pairs) {
      const pair = [parts[i], parts[j]];
      const key = pairKey(pair[0], pair[1]);
      const third = parts.find((part) => !pair.includes(part));
      const hybrids = sprites.filter((sprite) => (
        sprite && sprite.stage !== 'egg'
        && Array.isArray(sprite.hybridParents) && sprite.hybridParents.length === 2
        && pairKey(sprite.hybridParents[0], sprite.hybridParents[1]) === key
      ));
      if (!hybrids.length) continue;
      const plains = sprites.filter((sprite) => (
        sprite && sprite.stage !== 'egg'
        && sprite.element === third && !Array.isArray(sprite.hybridParents)
      ));
      if (!plains.length) continue;
      const hybrid = hybrids.filter((sprite) => parentReady(sprite, now))[0] || hybrids[0];
      const plain = plains.filter((sprite) => parentReady(sprite, now))[0] || plains[0];
      return {
        pair,
        third,
        hybridSpriteId: hybrid.id,
        plainSpriteId: plain.id,
        ready: parentReady(hybrid, now) && parentReady(plain, now),
      };
    }
    return null;
  }

  function fusionProbability(fusion, merges, parts) {
    if (fusion.kind === FUSION_KINDS.BLOODLINE) {
      return {
        deterministic: false,
        kind: fusion.kind,
        hybridChance: HYBRID_NAME_CHANCE,
        percent: Math.round(HYBRID_NAME_CHANCE * 1000) / 10,
        stages: (fusion.products || []).length,
        note: 'A merge takes a hybrid name on about 45% of merges, then weights one of six stages. No single stage is guaranteed.',
      };
    }
    if (fusion.kind === FUSION_KINDS.COMBO) {
      const chance = comboChance(merges);
      return {
        deterministic: false,
        kind: fusion.kind,
        chance,
        percent: Math.round(chance * 1000) / 10,
        merges: Math.max(0, Number(merges) || 0),
        note: 'Signature combos roll 4%–34% on a merge, rising with your total merges.',
      };
    }
    if (fusion.kind === FUSION_KINDS.SECRET) {
      const roll = secretChance(merges);
      const effective = roll * HYBRID_NAME_CHANCE;
      return {
        deterministic: false,
        kind: fusion.kind,
        chance: roll,
        hybridChance: HYBRID_NAME_CHANCE,
        effective,
        percent: Math.round(effective * 1000) / 10,
        merges: Math.max(0, Number(merges) || 0),
        note: 'Secret forms roll 2%–12%, then only land on the normal ~45% hybrid branch. Treat this as a wildcard, not a checklist.',
      };
    }
    return {
      deterministic: false,
      kind: FUSION_KINDS.CELESTIAL,
      chance: TRIBRID_ROLL_CHANCE,
      percent: Math.round(TRIBRID_ROLL_CHANCE * 1000) / 10,
      requiresHybridParent: true,
      parts: parts ? parts.slice() : [],
      note: 'Needs a two-element hybrid of two parts plus the plain third; the merge that completes the triad is a 40% roll.',
    };
  }

  function fusionPair(route, seed, ownership, options, sprites) {
    if (!route || !route.fusion || !seed) return null;
    const fusion = route.fusion;
    const merges = Math.max(0, Number(options.merges) || 0);
    const now = Number.isFinite(Number(options.now)) ? Number(options.now) : null;
    const pool = Array.isArray(sprites) ? sprites : [];

    const members = seed.members.filter((member) => member.kind === 'form' || member.kind === 'combo');
    const target = members.find((member) => !ownsMember(ownership, member)) || members[members.length - 1];

    if (fusion.kind === FUSION_KINDS.CELESTIAL) {
      const triads = fusion.triads || [];
      const triad = triads.find((entry) => entry.key === (target && target.key)) || triads[0];
      if (!triad) return null;
      const found = triadParents(triad.parts, pool, now);
      return {
        kind: fusion.kind,
        product: triad.key,
        pair: null,
        parts: triad.parts.slice(),
        pairKey: null,
        parents: found
          ? [
            { element: found.pair[0], spriteId: found.hybridSpriteId, owned: true, ready: found.ready, hybridParent: true },
            { element: found.third, spriteId: found.plainSpriteId, owned: true, ready: found.ready, hybridParent: false },
          ]
          : triad.parts.map((part) => parentFor(part, pool, now)),
        ready: !!found && !!found.ready,
        blocked: found ? (found.ready ? [] : ['rest']) : ['hybrid-parent', 'plain-third'],
        certainty: CERTAINTY.CHANCE,
        action: ACTIONS.PREVIEW_MERGE,
        args: found && found.ready ? [found.hybridSpriteId, found.plainSpriteId] : null,
        commit: ACTIONS.COMPLETE_MERGE,
        ui: null,
        uiArgs: null,
        probability: fusionProbability(fusion, merges, triad.parts),
      };
    }

    const products = fusion.products || [];
    const chosen = products.find((entry) => entry.key === (target && target.key)) || products[0];
    if (!chosen) return null;
    const parents = chosen.pair.map((element) => parentFor(element, pool, now));
    const ready = parents.every((parent) => parent.ready);
    const blocked = parents.map((parent) => {
      if (!parent.owned) return `no-${parent.element}`;
      if (!parent.leveled) return `level-${parent.element}`;
      if (parent.resting) return `resting-${parent.element}`;
      return null;
    }).filter(Boolean);

    return {
      kind: fusion.kind,
      product: chosen.key,
      pair: chosen.pair.slice(),
      parts: null,
      pairKey: pairKey(chosen.pair[0], chosen.pair[1]),
      parents,
      ready,
      blocked,
      certainty: CERTAINTY.CHANCE,
      action: ACTIONS.PREVIEW_MERGE,
      args: ready ? [parents[0].spriteId, parents[1].spriteId] : null,
      commit: ACTIONS.COMPLETE_MERGE,
      ui: ACTIONS.BREEDING_ENTRY,
      uiArgs: [pairKey(chosen.pair[0], chosen.pair[1])],
      probability: fusionProbability(fusion, merges),
    };
  }

  /* ---- plans ---- */

  function planFor(save, seedId, options) {
    const route = routeFor(seedId);
    if (!route) return null;
    const opts = Object.assign({ merges: 0, now: null, env: null }, options || {});
    const seed = seedOf(seedId);
    const api = constellations();
    const ownership = api && typeof api.ownershipFromSave === 'function' ? api.ownershipFromSave(save) : null;
    const sprites = save && Array.isArray(save.sprites) ? save.sprites : [];
    const env = opts.env || null;
    const coins = save && Number.isFinite(Number(save.coins)) ? Number(save.coins) : null;

    const egg = eggFocus(route, seed, ownership, env);
    if (egg) egg.affordable = coins === null || egg.price === null ? null : coins >= egg.price;
    const habitat = habitatFocus(route, seed, ownership, env);
    if (habitat) {
      const current = save && save.theme && typeof save.theme.scene === 'string' ? save.theme.scene : null;
      habitat.needsTravel = current !== habitat.scene;
    }
    const fusion = fusionPair(route, seed, ownership, opts, sprites);

    return {
      seedId,
      egg,
      habitat,
      fusion,
    };
  }

  const ConstellationRoutes = Object.freeze({
    ROUTES,
    planFor,
  });

  root.ConstellationRoutes = ConstellationRoutes;
})(typeof globalThis !== 'undefined' ? globalThis : this);
