/* Single loader and validator for the sprite data under assets/.
   The game runs offline from the APK, so each listed file is fetched once at
   startup and checked against its own rules. A broken file is recorded in
   SPRITE_DATA.errors rather than thrown, so one bad JSON cannot stop the game
   while a release gate can still read exactly which file and field failed. */

const SPRITE_DATA_INDEX = 'assets/sprite_hollow_index.json';
const SPRITE_DATA_RARITIES = ['common', 'rare', 'epic', 'legendary', 'mythic'];

const SPRITE_DATA = {
  ready: false,
  loading: null,
  sheet: null,
  effects: {},
  animations: {},
  pending: {},
  species: {},
  lists: {},
  frameBudget: 0,
  config: null,
  layout: null,
  files: [],
  expected: 0,
  completed: 0,
  errors: [],
};

/* The animation config under one stable name: sprite code and the app console
   can read spriteConfig.animations.<name>.frames before, during or after the
   load finishes, without waiting on the promise. */
const spriteConfig = {
  version: null,
  frameSize: { width: 256, height: 256 },
  animations: {},
  pending: {},
};

/* Frames are packed row by row, so on an 8-column sheet frame 9 is the second
   cell of row 1. Columns come from the sheet's own width when the atlas says
   how wide it is, and fall back to 8 otherwise. */
function spriteFrameColumns() {
  const width = SPRITE_DATA.sheet && SPRITE_DATA.sheet.meta && SPRITE_DATA.sheet.meta.size
    ? Number(SPRITE_DATA.sheet.meta.size.w)
    : 0;
  const cell = Number(spriteConfig.frameSize && spriteConfig.frameSize.width) || 256;
  return width > 0 ? Math.max(1, Math.round(width / cell)) : 8;
}

/* Pixel rectangle of one frame index on the sheet, plus where it landed so a
   caller can tell whether the index still fits inside the shipped PNG. */
function getFrameRect(frame) {
  const index = Number(frame);
  if (!Number.isInteger(index) || index < 0) return null;
  const size = spriteConfig.frameSize || {};
  const w = Number(size.width) || 256;
  const h = Number(size.height) || 256;
  const columns = spriteFrameColumns();
  const column = index % columns;
  const row = Math.floor(index / columns);
  const meta = SPRITE_DATA.sheet && SPRITE_DATA.sheet.meta && SPRITE_DATA.sheet.meta.size;
  return {
    index,
    column,
    row,
    x: column * w,
    y: row * h,
    w,
    h,
    insideSheet: meta ? column * w + w <= meta.w && row * h + h <= meta.h : null,
  };
}

function spriteDataErrors() {
  return SPRITE_DATA.errors.slice();
}

function spriteDataOk() {
  return SPRITE_DATA.ready && SPRITE_DATA.errors.length === 0;
}

/* Counted progress, so the boot splash can show real work instead of a
   wall-clock animation. The index counts as the first completed file; the
   expected total grows once that index names the files it will load. */
function spriteDataProgress() {
  const total = Math.max(0, Number(SPRITE_DATA.expected) || 0);
  const completed = Math.max(0, Math.min(total, Number(SPRITE_DATA.completed) || 0));
  return {
    ready: !!SPRITE_DATA.ready,
    percent: SPRITE_DATA.ready ? 100 : (total ? Math.round((completed / total) * 100) : 0),
    completed,
    total,
    files: SPRITE_DATA.files.length,
    errors: SPRITE_DATA.errors.length,
  };
}

function spriteDataFetchJson(path) {
  if (typeof fetch !== 'function') return Promise.reject(new Error('fetch is unavailable'));
  return fetch(path, { cache: 'no-cache' }).then((res) => {
    if (!res || !res.ok) throw new Error('HTTP ' + (res ? res.status : '?'));
    return res.json();
  });
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/* sprite_hollow_baby_sprite.json defines the species whose id is baby_sprite,
   so the filename is the prefix plus the id. */
function speciesIdFromPath(path) {
  const match = /sprite_hollow_(.+)\.json$/.exec(String(path || ''));
  return match ? match[1] : null;
}

function validateSpeciesFile(data, path) {
  const problems = [];
  if (!isPlainObject(data)) return ['not a JSON object'];
  if (typeof data.id !== 'string' || !data.id.trim()) problems.push('id must be a non-empty string');
  const expected = speciesIdFromPath(path);
  if (expected && data.id !== expected) problems.push(`id "${data.id}" does not match the filename (${expected})`);
  if (SPRITE_DATA_RARITIES.indexOf(data.rarity) < 0) problems.push(`rarity "${data.rarity}" is not one of ${SPRITE_DATA_RARITIES.join(', ')}`);
  if (!Array.isArray(data.abilities) || !data.abilities.length) problems.push('abilities must be a non-empty array');
  else data.abilities.forEach((ability, index) => {
    if (typeof ability !== 'string' || !ability.trim()) problems.push(`abilities[${index}] must be a non-empty string`);
    else if (typeof ABILITY_TABLE !== 'undefined' && !ABILITY_TABLE[ability]) problems.push(`abilities[${index}] "${ability}" is not in the ability table`);
  });
  if (data.color !== undefined && (typeof data.color !== 'string' || !data.color.trim())) problems.push('color must be a non-empty string when present');
  return problems;
}

function validateEffectsFile(data) {
  const problems = [];
  if (!isPlainObject(data) || !isPlainObject(data.effects)) return ['effects must be an object'];
  const keys = Object.keys(data.effects);
  if (!keys.length) problems.push('effects is empty');
  keys.forEach((key) => {
    if (typeof data.effects[key] !== 'boolean') problems.push(`effects.${key} must be true or false`);
  });
  return problems;
}

function validateAnimationFile(data) {
  const problems = [];
  if (!isPlainObject(data)) return ['not a JSON object'];
  if (!isPlainObject(data.animations)) return ['animations must be an object'];
  const names = Object.keys(data.animations);
  if (!names.length) problems.push('animations is empty');
  let budget = 0;
  names.forEach((name) => {
    const anim = data.animations[name];
    if (!isPlainObject(anim)) {
      problems.push(`${name} must be an object`);
      return;
    }
    if (typeof anim.fps !== 'number' || !(anim.fps > 0)) problems.push(`${name}.fps must be a positive number`);
    if (typeof anim.loop !== 'boolean') problems.push(`${name}.loop must be true or false`);
    if (!Array.isArray(anim.frames) || !anim.frames.length) {
      problems.push(`${name}.frames must be a non-empty array`);
      return;
    }
    anim.frames.forEach((frame, index) => {
      if (!Number.isInteger(frame) || frame < 0) problems.push(`${name}.frames[${index}] must be a whole frame index`);
      else budget = Math.max(budget, frame + 1);
    });
    if (anim.truncated === true && !(anim.expectedFrames > 0)) problems.push(`${name} is truncated but has no expectedFrames`);
  });
  if (data.pending !== undefined) {
    if (!isPlainObject(data.pending)) problems.push('pending must be an object');
    else Object.keys(data.pending).forEach((name) => {
      const entry = data.pending[name];
      if (!isPlainObject(entry) || !Number.isInteger(entry.frameCount) || entry.frameCount < 1) {
        problems.push(`pending.${name}.frameCount must be a positive whole number`);
      }
    });
  }
  if (data.frameSize !== undefined
    && (!isPlainObject(data.frameSize) || !(data.frameSize.width > 0) || !(data.frameSize.height > 0))) {
    problems.push('frameSize must have a positive width and height');
  }
  if (Number.isInteger(data.frameBudget) && data.frameBudget < budget) {
    problems.push(`frameBudget ${data.frameBudget} is smaller than the highest frame (${budget})`);
  }
  return problems;
}

function validateListFile(data) {
  const problems = [];
  if (!Array.isArray(data)) return ['must be a JSON array'];
  if (!data.length) problems.push('list is empty');
  const seen = new Set();
  data.forEach((id, index) => {
    if (typeof id !== 'string' || !id.trim()) problems.push(`[${index}] must be a non-empty string`);
    else if (seen.has(id)) problems.push(`[${index}] repeats "${id}"`);
    seen.add(id);
  });
  return problems;
}

function validateSheetFile(data) {
  const problems = [];
  if (!isPlainObject(data)) return ['not a JSON object'];
  if (!isPlainObject(data.meta) || typeof data.meta.image !== 'string' || !data.meta.image.trim()) problems.push('meta.image must name the PNG');
  if (!isPlainObject(data.frames) || !Object.keys(data.frames).length) problems.push('frames must list at least one frame');
  return problems;
}

function validateLayoutFile(data) {
  const problems = [];
  if (!isPlainObject(data)) return ['not a JSON object'];
  if (!Number.isInteger(data.columns) || data.columns < 1) problems.push('columns must be a positive whole number');
  if (!Array.isArray(data.rows) || !data.rows.length) problems.push('rows must be a non-empty array');
  else data.rows.forEach((row, index) => {
    if (!isPlainObject(row) || typeof row.animation !== 'string' || !row.animation.trim()) problems.push(`rows[${index}].animation must name an animation`);
    else if (!Number.isInteger(row.frameCount) || row.frameCount < 1) problems.push(`rows[${index}].frameCount must be a positive whole number`);
  });
  return problems;
}

function validateIndexFile(data) {
  const problems = [];
  if (!isPlainObject(data)) return ['not a JSON object'];
  if (!Array.isArray(data.species) || !data.species.length) problems.push('species must be a non-empty array of paths');
  ['species', 'lists'].forEach((key) => {
    if (data[key] !== undefined && !Array.isArray(data[key])) problems.push(`${key} must be an array`);
  });
  ['effects', 'animations', 'sheet'].forEach((key) => {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || !data[key].trim())) problems.push(`${key} must be a file path`);
  });
  return problems;
}

function spriteDataRecord(path, problems) {
  problems.forEach((problem) => SPRITE_DATA.errors.push(`${path}: ${problem}`));
}

async function spriteDataLoad(options = {}) {
  if (SPRITE_DATA.loading) return SPRITE_DATA.loading;
  SPRITE_DATA.loading = (async () => {
    /* The index is always the first file. Keep the count at zero while it is
       in flight; the real total is only known after it arrives. If it fails,
       it is also the only file, and readiness below still releases the
       splash. */
    SPRITE_DATA.expected = 0;
    SPRITE_DATA.completed = 0;
    let index = null;
    try {
      index = await spriteDataFetchJson(options.index || SPRITE_DATA_INDEX);
      SPRITE_DATA.completed = 1;
    } catch (err) {
      SPRITE_DATA.errors.push(`${options.index || SPRITE_DATA_INDEX}: ${err && err.message ? err.message : err}`);
      SPRITE_DATA.expected = 1;
      SPRITE_DATA.completed = 1;
      SPRITE_DATA.ready = true;
      return SPRITE_DATA;
    }
    const indexProblems = validateIndexFile(index);
    spriteDataRecord(options.index || SPRITE_DATA_INDEX, indexProblems);
    if (indexProblems.length) {
      SPRITE_DATA.expected = 1;
      SPRITE_DATA.completed = 1;
      SPRITE_DATA.ready = true;
      return SPRITE_DATA;
    }

    /* Count each file fetch, including optional data. The progress total is
       fixed before the parallel loads begin, so the bar never jumps backwards. */
    const extraPaths = [index.effects, index.animations, index.sheet, index.layout]
      .filter((path) => typeof path === 'string' && path);
    SPRITE_DATA.expected = 1 + (index.species || []).length
      + (index.lists || []).length + extraPaths.length;

    const load = async (path, validate) => {
      SPRITE_DATA.files.push(path);
      try {
        const data = await spriteDataFetchJson(path);
        const problems = validate(data, path);
        spriteDataRecord(path, problems);
        return problems.length ? null : data;
      } catch (err) {
        SPRITE_DATA.errors.push(`${path}: ${err && err.message ? err.message : err}`);
        return null;
      } finally {
        SPRITE_DATA.completed += 1;
      }
    };

    await Promise.all([
      ...(index.species || []).map(async (path) => {
        const data = await load(path, validateSpeciesFile);
        if (data) SPRITE_DATA.species[data.id] = data;
      }),
      ...(index.lists || []).map(async (path) => {
        const data = await load(path, validateListFile);
        if (data) SPRITE_DATA.lists[path] = data;
      }),
      (async () => {
        if (!index.effects) return;
        const data = await load(index.effects, validateEffectsFile);
        if (data) SPRITE_DATA.effects = data.effects;
      })(),
      (async () => {
        if (!index.animations) return;
        const data = await load(index.animations, validateAnimationFile);
        if (data) {
          SPRITE_DATA.config = data;
          SPRITE_DATA.animations = data.animations;
          SPRITE_DATA.pending = data.pending || {};
          SPRITE_DATA.frameBudget = Number.isInteger(data.frameBudget) ? data.frameBudget : 0;
          Object.assign(spriteConfig, data);
        }
      })(),
      (async () => {
        if (!index.sheet) return;
        const data = await load(index.sheet, validateSheetFile);
        if (data) SPRITE_DATA.sheet = data;
      })(),
      (async () => {
        if (!index.layout) return;
        const data = await load(index.layout, validateLayoutFile);
        if (data) SPRITE_DATA.layout = data;
      })(),
    ]);

    /* The id lists are only labels unless a definition backs each one, so a
       name without a species file is reported rather than silently dropped. */
    Object.keys(SPRITE_DATA.lists).forEach((listPath) => {
      SPRITE_DATA.lists[listPath].forEach((id) => {
        if (!SPRITE_DATA.species[id]) SPRITE_DATA.errors.push(`${listPath}: "${id}" has no species definition in the index`);
      });
    });

    SPRITE_DATA.ready = true;
    return SPRITE_DATA;
  })();
  return SPRITE_DATA.loading;
}

/* Everything the load produced, in one object, for the app or the console. */
function spriteDataReport() {
  return {
    ready: SPRITE_DATA.ready,
    clean: SPRITE_DATA.ready && !SPRITE_DATA.errors.length,
    files: SPRITE_DATA.files.length,
    progress: spriteDataProgress(),
    species: Object.keys(SPRITE_DATA.species).length,
    lists: Object.keys(SPRITE_DATA.lists).length,
    effects: Object.keys(SPRITE_DATA.effects).length,
    animations: Object.keys(SPRITE_DATA.animations).length,
    pending: Object.keys(SPRITE_DATA.pending).length,
    frameBudget: SPRITE_DATA.frameBudget,
    errors: SPRITE_DATA.errors.slice(),
  };
}

/* A clean build stays silent. A broken one says so on screen once, with the
   first problem, instead of failing somewhere far away from the bad file. */
function reportSpriteDataProblems() {
  if (!SPRITE_DATA.errors.length) return null;
  const count = SPRITE_DATA.errors.length;
  const message = `${count} sprite data problem${count === 1 ? '' : 's'} — ${SPRITE_DATA.errors[0]}`;
  if (typeof toast === 'function') toast(message, '⚠️');
  return message;
}

if (typeof window !== 'undefined') {
  window.spriteDataLoad = spriteDataLoad;
  window.SPRITE_DATA = SPRITE_DATA;
  window.spriteConfig = spriteConfig;
  window.getFrameRect = getFrameRect;
  window.spriteFrameColumns = spriteFrameColumns;
  window.spriteDataProgress = spriteDataProgress;
  window.spriteDataReport = spriteDataReport;
  window.reportSpriteDataProblems = reportSpriteDataProblems;
  /* Start once: a failure is recorded and then shown, never thrown. */
  spriteDataLoad().then(() => {
    if (typeof document === 'undefined') return reportSpriteDataProblems();
    const show = () => reportSpriteDataProblems();
    if (document.readyState === 'complete') setTimeout(show, 300);
    else window.addEventListener('load', () => setTimeout(show, 300), { once: true });
    return null;
  }).catch(() => {});
}
