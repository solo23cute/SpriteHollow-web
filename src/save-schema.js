/* Pure save schema and v2 normalization layer.

   This file deliberately has no DOM, storage, network, clock or game-data
   dependencies. It parses and normalizes the serialized save envelope only; the
   existing loadState() hydration still owns sprite normalisation and gameplay
   defaults.

   Version 2 is the only save schema that has ever been written by the game:
   SAVE_KEY is `sprite-hollow.save.v2`, freshState() writes `v: 2`, and every
   archived save fixture is v2. There are no real v0 or v1 payloads, so this
   layer has no invented version-step upgrades. Older or versionless envelopes
   are rejected rather than guessed at.

   Two legacy field shapes still appear inside v2 envelopes: leaf-home cooldowns
   were kept in `leafHomes`, and the weather-off choice was stored as a boolean
   `world.weatherOff`. One pre-v2 compatibility pass folds those fields before
   v2 normalization. It is not a version upgrade and does not run for v0/v1/
   versionless saves. A future schema change must add a captured fixture from a
   real save before introducing a new version and migration step. */

(function (root) {
  'use strict';

  const VERSION = 2;

  const STATUS = Object.freeze({
    OK: 'ok',
    EMPTY: 'empty',
    INVALID_INPUT: 'invalid-input',
    INVALID_JSON: 'invalid-json',
    INVALID_VERSION: 'invalid-version',
    UNSUPPORTED_VERSION: 'unsupported-version',
    FUTURE_VERSION: 'future-version',
    INVALID_SHAPE: 'invalid-shape',
  });

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /* Fold the two legacy v2 field shapes in place on an already-cloned save. This
     is the only compatibility work before normalization; it returns the names
     of the fields it changed so the caller can report whether anything moved. */
  function applyLegacyCompatibility(save) {
    const changes = [];

    /* Old saves stored the sky-off choice as a boolean. A false flag is only
       removed; a true flag becomes the current weather value. */
    if (isPlainObject(save.world) && Object.prototype.hasOwnProperty.call(save.world, 'weatherOff')) {
      if (save.world.weatherOff === true) save.world.weather = 'off';
      delete save.world.weatherOff;
      changes.push('weatherOff');
    }

    /* Old leaf homes stored cooldowns as lastFruit/lastCanopy and had no shared
       speciesHomes table. The normalized speciesHomes entry wins if both exist. */
    if (isPlainObject(save.leafHomes) && Object.keys(save.leafHomes).length) {
      const speciesHomes = isPlainObject(save.speciesHomes) ? save.speciesHomes : {};
      Object.entries(save.leafHomes).forEach(([spriteId, legacy]) => {
        if (speciesHomes[spriteId] || !isPlainObject(legacy)) return;
        speciesHomes[spriteId] = {
          tier: typeof legacy.tier === 'string' ? legacy.tier : 'sapling',
          taps: {
            fruit: Math.max(0, Number(legacy.lastFruit) || 0),
            canopy: Math.max(0, Number(legacy.lastCanopy) || 0),
          },
        };
      });
      save.speciesHomes = speciesHomes;
      delete save.leafHomes;
      changes.push('leafHomes');
    }

    return changes;
  }

  function versionOf(value) {
    if (!isPlainObject(value)) return null;
    const raw = value.v;
    if (raw === undefined || raw === null || raw === '') return 0;
    if (typeof raw === 'number') {
      return Number.isInteger(raw) && raw >= 0 ? raw : null;
    }
    if (typeof raw === 'string' && /^\d+$/.test(raw.trim())) {
      return Number(raw.trim());
    }
    return null;
  }

  function fail(status, error, extra) {
    return Object.assign({
      ok: false,
      status,
      error: String(error || status),
      save: null,
      fromVersion: null,
      toVersion: VERSION,
      changed: false,
      warnings: [],
    }, extra || {});
  }

  function normalize(input) {
    if (!isPlainObject(input)) {
      return fail(STATUS.INVALID_INPUT, 'A save must be a JSON object.');
    }

    const fromVersion = versionOf(input);
    if (fromVersion === null) {
      return fail(STATUS.INVALID_VERSION, 'The save version is not a whole number.');
    }
    if (fromVersion > VERSION) {
      return fail(
        STATUS.FUTURE_VERSION,
        `This save is version ${fromVersion}; this build understands up to version ${VERSION}.`,
        { fromVersion },
      );
    }
    if (fromVersion !== VERSION) {
      return fail(
        STATUS.UNSUPPORTED_VERSION,
        `This save is version ${fromVersion}; this build only reads version ${VERSION} saves.`,
        { fromVersion },
      );
    }

    let save;
    try {
      save = clone(input);
    } catch (error) {
      return fail(STATUS.INVALID_INPUT, error && error.message ? error.message : 'The save could not be copied.', { fromVersion });
    }

    const legacyChanges = applyLegacyCompatibility(save);
    save.v = VERSION;

    return {
      ok: true,
      status: STATUS.OK,
      save,
      fromVersion,
      toVersion: VERSION,
      changed: input.v !== VERSION || legacyChanges.length > 0,
      warnings: [],
    };
  }

  function validate(input) {
    const errors = [];
    const warnings = [];
    const error = (message) => errors.push(message);
    const warn = (message) => warnings.push(message);

    if (!isPlainObject(input)) {
      error('Save root must be a JSON object.');
      return { ok: false, errors, warnings };
    }

    const version = versionOf(input);
    if (version === null) error('Save version must be a whole number.');
    else if (version > VERSION) error(`Save version ${version} is newer than supported version ${VERSION}.`);
    else if (version < VERSION) error(`Save version ${version} is not supported; this build only reads version ${VERSION}.`);

    if (!Array.isArray(input.sprites)) {
      error('sprites must be an array.');
    } else {
      const ids = new Set();
      input.sprites.forEach((sprite, index) => {
        if (!isPlainObject(sprite)) {
          error(`sprites[${index}] must be an object.`);
          return;
        }
        const id = typeof sprite.id === 'string' ? sprite.id.trim() : '';
        if (!id) warn(`sprites[${index}] has no id.`);
        else if (ids.has(id)) warn(`Sprite id "${id}" appears more than once.`);
        else ids.add(id);
      });
    }

    if (!isPlainObject(input.theme)) error('theme must be an object.');

    return { ok: errors.length === 0, errors, warnings };
  }

  function parse(raw) {
    if (typeof raw !== 'string') {
      return fail(STATUS.INVALID_INPUT, 'Raw save data must be a string.');
    }
    if (!raw.trim()) {
      return fail(STATUS.EMPTY, 'There is no save data to read.');
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return fail(STATUS.INVALID_JSON, error && error.message ? error.message : 'The save is not valid JSON.');
    }

    const normalized = normalize(parsed);
    if (!normalized.ok) return normalized;

    const validation = validate(normalized.save);
    if (!validation.ok) {
      return Object.assign({}, normalized, {
        ok: false,
        status: STATUS.INVALID_SHAPE,
        error: validation.errors.join(' '),
        validation,
        warnings: normalized.warnings.concat(validation.warnings),
      });
    }

    return Object.assign({}, normalized, {
      ok: true,
      status: STATUS.OK,
      validation,
      warnings: normalized.warnings.concat(validation.warnings),
    });
  }

  const SaveSchema = Object.freeze({
    VERSION,
    STATUS,
    versionOf,
    normalize,
    validate,
    parse,
    isPlainObject,
  });

  root.SaveSchema = SaveSchema;
})(typeof globalThis !== 'undefined' ? globalThis : this);
