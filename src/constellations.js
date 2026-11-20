/* Collection Constellations, phase 1: membership, segments, save-derived
   ownership, and a deterministic nearest-three ranking.

   This file deliberately has no DOM, storage, network, clock, random or game
   dependency. It reads one already-parsed save object and returns plain
   progress records. The panels and routing modules load separately; this file
   owns membership and save-derived ownership only.

   Membership mirrors docs/collection-constellations-validation.md: 19 seeds
   whose every member was confirmed against the live tables. Members are one of
     species  a sprite's `element` key
     form     a sprite's `hybrid` name (line stage, secret or celestial form)
     combo    a sprite's `special` id (COMBOS entry)
   Fusion recipes live in src/constellation-routes.js so a bloodline pair is
   declared once. Parent prerequisites are not counted toward progress. */

(function (root) {
  'use strict';

  const species = (...keys) => keys.map((key) => ({ kind: 'species', key }));
  const forms = (...keys) => keys.map((key) => ({ kind: 'form', key }));
  const combos = (...keys) => keys.map((key) => ({ kind: 'combo', key }));

  /* Seed order is stable and is the last tie-break in the ranking, so a new
     seed must be appended or inserted deliberately rather than sorted away. */
  const SEED_DEFS = [
    {
      id: 'meadow-kin',
      name: 'Meadow Kin',
      segment: 'habitat',
      family: 'habitat',
      scene: 'grove',
      members: species('bunny', 'frog', 'pig', 'cow', 'cat'),
    },
    {
      id: 'moonlit-haunt',
      name: 'Moonlit Haunt',
      segment: 'habitat',
      family: 'habitat',
      scene: 'night',
      members: species('ghost', 'bat', 'owl', 'spider', 'pumpkin'),
    },
    {
      id: 'tidepool-shallows',
      name: 'Tidepool Shallows',
      segment: 'habitat',
      family: 'habitat',
      scene: 'tide',
      members: species('fish', 'crab', 'starfish', 'duck', 'penguin'),
    },
    {
      id: 'ember-forge-kin',
      name: 'Ember Forge Kin',
      segment: 'habitat',
      family: 'habitat',
      scene: 'ember',
      members: species('ember', 'fire', 'ace', 'firefang', 'pumpkin'),
    },
    {
      id: 'sugar-kitchen',
      name: 'Sugar Kitchen',
      segment: 'habitat',
      family: 'habitat',
      scene: 'sugar',
      members: species('candy', 'cocoa', 'cherry', 'banana', 'pizza'),
    },
    {
      id: 'dream-conservatory',
      name: 'Dream Conservatory',
      segment: 'habitat',
      family: 'habitat',
      scene: 'dream',
      members: species('dream', 'pillow', 'panda', 'angel', 'owl'),
    },
    {
      id: 'coral-reef-drifters',
      name: 'Coral Reef Drifters',
      segment: 'habitat',
      family: 'habitat',
      scene: 'reef',
      members: species('shark', 'dolphin', 'starfish', 'crab', 'duck', 'captainx'),
    },
    {
      id: 'cavern-gleam',
      name: 'Cavern Gleam',
      segment: 'habitat',
      family: 'habitat',
      scene: 'crystal',
      members: species('rock', 'stone', 'crystal', 'slime', 'snake'),
    },
    {
      id: 'aurora-ridge-wanderers',
      name: 'Aurora Ridge Wanderers',
      segment: 'habitat',
      family: 'habitat',
      scene: 'aurora',
      members: species('frost', 'ice', 'gale', 'elk', 'penguin'),
    },
    {
      id: 'golden-savanna-herd',
      name: 'Golden Savanna Herd',
      segment: 'habitat',
      family: 'habitat',
      scene: 'savanna',
      members: species('lion', 'tiger', 'deer', 'bull', 'sheep'),
    },
    {
      id: 'fire-and-earth',
      name: 'Fire & Earth',
      segment: 'fusion',
      family: 'bloodline',
      members: forms(
        'Emberstone Puffle', 'Lava Puffle', 'Magma Puffle',
        'Volcano Puffle', 'Caldera Puffle', 'Worldforge Puffle',
      ),
    },
    {
      id: 'water-and-ice',
      name: 'Water & Ice',
      segment: 'fusion',
      family: 'bloodline',
      members: forms(
        'Snowdrop Puffle', 'Chillwave Puffle', 'Frosttide Puffle',
        'Glacierwave Puffle', 'Polar King Puffle', 'Eternal Tide Puffle',
      ),
    },
    {
      id: 'electric-and-wind',
      name: 'Electric & Wind',
      segment: 'fusion',
      family: 'bloodline',
      members: forms(
        'Static Breeze Puffle', 'Thunder Gust Puffle', 'Tempest Puffle',
        'Cyclostorm Puffle', 'Skybreaker Puffle', 'Tempest God Puffle',
      ),
    },
    {
      id: 'nature-and-light',
      name: 'Nature & Light',
      segment: 'fusion',
      family: 'bloodline',
      members: forms(
        'Glowseed Puffle', 'Dawnpetal Puffle', 'Sunbloom Puffle',
        'Radiant Grove Puffle', 'Solstice King Puffle', 'Worldlight Puffle',
      ),
    },
    {
      id: 'crystal-and-metal',
      name: 'Crystal & Metal',
      segment: 'fusion',
      family: 'bloodline',
      members: forms(
        'Gemgear Puffle', 'Steel Quartz Puffle', 'Alloy Crystal Puffle',
        'Titanium Gemlord Puffle', 'Forge Emperor Puffle', 'Celestial Forge Monarch Puffle',
      ),
    },
    {
      id: 'signature-classic',
      name: 'Signature Fusions — Classic Six',
      segment: 'fusion',
      family: 'signature',
      members: combos(
        'steam-sovereign', 'eclipse-crown', 'twilight-halo',
        'storm-chime', 'glacier-bloom', 'solstice-song',
      ),
    },
    {
      id: 'signature-franchise',
      name: 'Signature Fusions — Franchise Four',
      segment: 'fusion',
      family: 'signature',
      members: combos('steam-fist', 'team-hug', 'high-tide', 'blackout'),
    },
    {
      id: 'secret-fusions',
      name: 'Secret Fusions',
      segment: 'fusion',
      family: 'secret',
      /* Odds tier, not a completable checklist: these roll at 2–12% and then
         only on the normal hybrid branch. The UI still lists the forms, but
         completion math and rankings must not treat them as collectable. */
      completable: false,
      completionNote: 'Secret forms roll at 2%–12%, then only on the normal ~45% hybrid branch. This is a luck tier, not a completable checklist.',
      members: forms(
        'Eclipse Puffle', 'Stormfire Puffle', 'Bloomtide Puffle',
        'Ironroot Puffle', 'Venomfrost Puffle',
      ),
    },
    {
      id: 'celestial-triads',
      name: 'Celestial Triads',
      segment: 'fusion',
      family: 'celestial',
      /* Each needs a pre-built two-element hybrid of two of its three parts. */
      members: forms(
        'Nova Puffle', 'Tempest Bloom Puffle', 'Eclipse Crystal Puffle',
        'Forge Titan Puffle', 'Toxic Abyss Puffle',
      ),
    },
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    Object.freeze(value);
    return value;
  }

  const SEEDS = deepFreeze(SEED_DEFS.map((seed) => Object.assign({}, seed, {
    completable: seed.completable !== false,
    members: seed.members.map((member) => Object.assign({}, member)),
  })));

  function seedById(id) {
    if (typeof id !== 'string' || !id) return null;
    return SEEDS.find((seed) => seed.id === id) || null;
  }

  /* A sprite counts once it has a usable element key. Duplicates are collapsed
     by the sets, and egg-stage sprites count: buying the egg already puts the
     species in the Hollow. `hybrid` and `special` are read independently of
     the element, but only for sprites that passed the element check, so a
     malformed record cannot invent a form. */
  function ownershipFromSave(save) {
    const ownership = { species: new Set(), forms: new Set(), combos: new Set() };
    if (!save || typeof save !== 'object' || Array.isArray(save)) return ownership;
    const sprites = save.sprites;
    if (!Array.isArray(sprites)) return ownership;

    sprites.forEach((sprite) => {
      if (!sprite || typeof sprite !== 'object' || Array.isArray(sprite)) return;
      if (typeof sprite.element !== 'string' || !sprite.element) return;
      ownership.species.add(sprite.element);
      if (typeof sprite.hybrid === 'string' && sprite.hybrid) ownership.forms.add(sprite.hybrid);
      if (typeof sprite.special === 'string' && sprite.special) ownership.combos.add(sprite.special);
    });
    return ownership;
  }

  function ownsMember(ownership, member) {
    if (!ownership || !member) return false;
    if (member.kind === 'species') return ownership.species.has(member.key);
    if (member.kind === 'form') return ownership.forms.has(member.key);
    if (member.kind === 'combo') return ownership.combos.has(member.key);
    return false;
  }

  function progressFor(seedId, ownership) {
    const seed = seedById(seedId);
    if (!seed || !Array.isArray(seed.members)) return null;

    let owned = 0;
    seed.members.forEach((member) => {
      if (ownsMember(ownership, member)) owned += 1;
    });

    const total = seed.members.length;
    const completable = seed.completable !== false;
    const progress = {
      id: seed.id,
      name: seed.name,
      segment: seed.segment,
      family: seed.family,
      owned,
      total,
      completable,
      completionNote: seed.completionNote || '',
      /* A luck tier can be fully owned by luck without ever being a finished
         checklist, so it deliberately has no completion ratio. */
      ratio: completable && total ? owned / total : null,
      complete: completable && total > 0 && owned === total,
    };
    return progress;
  }

  function allProgress(ownership) {
    return SEEDS.map((seed) => progressFor(seed.id, ownership));
  }

  /* Nearest first: fewest missing members, then the smaller seed, then seed id.
     Completed seeds are not ranked — there is nothing left to pursue. No
     random, clock or locale-dependent comparison is used. */
  function compareNearest(a, b) {
    const missing = (progress) => progress.total - progress.owned;
    if (missing(a) !== missing(b)) return missing(a) - missing(b);
    if (a.total !== b.total) return a.total - b.total;
    if (a.id === b.id) return 0;
    return a.id < b.id ? -1 : 1;
  }

  function analyze(save) {
    const ownership = ownershipFromSave(save);
    const all = allProgress(ownership);
    const tracked = all.filter((progress) => progress.completable);
    const owned = tracked.reduce((sum, progress) => sum + progress.owned, 0);
    const members = tracked.reduce((sum, progress) => sum + progress.total, 0);
    return {
      all,
      nearest: tracked
        .filter((progress) => !progress.complete)
        .sort(compareNearest)
        .slice(0, 3),
      totals: {
        seeds: tracked.length,
        complete: tracked.filter((progress) => progress.complete).length,
        members,
        owned,
      },
    };
  }

  const Constellations = Object.freeze({
    SEEDS,
    seedById,
    ownershipFromSave,
    ownsMember,
    progressFor,
    analyze,
  });

  root.Constellations = Constellations;
})(typeof globalThis !== 'undefined' ? globalThis : this);
