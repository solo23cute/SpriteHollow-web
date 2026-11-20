/* Small write-ahead journal for the live save and save slots.

   localStorage writes are individually atomic, but several of the save paths
   are not: a live overwrite also mirrors the active slot, a slot write may also
   move the active pointer, and a slot switch writes the live key and the
   pointer before reloading. A crash or reload between those writes used to be
   invisible.

   Before an operation changes anything, begin() records one small intent and
   the phase reached. The live save is also copied into two alternating
   generation keys, gen.0 and gen.1: the older copy is the rollback image, the
   newer one can finish an interrupted overwrite. On boot resolveOnBoot() reads
   the journal and either completes the operation or restores the previous live
   save and pointer. No payloads are stored in the journal itself. */

(function (root) {
  'use strict';

  const VERSION = 1;
  const JOURNAL_KEY = 'sprite-hollow.save.journal.v1';
  const SAVE_KEY = 'sprite-hollow.save.v2';
  const GEN_PREFIX = 'sprite-hollow.save.gen.';
  const GEN_META_KEY = 'sprite-hollow.save.gen.meta';
  const SLOT_PREFIX = 'sprite-hollow.slot.';
  const POINTER_KEY = 'sprite-hollow.slot.active';
  const SLOT_COUNT = 4;

  let lastAction = null;
  let isUnresolved = false;

  function box() {
    try { return root.localStorage || null; } catch (err) { return null; }
  }

  function read(key) {
    const store = box();
    if (!store) return null;
    try { return store.getItem(key); } catch (err) { return null; }
  }

  function write(key, value) {
    const store = box();
    if (!store) return false;
    try {
      store.setItem(key, String(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function remove(key) {
    const store = box();
    if (!store) return false;
    try {
      store.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  /* A fast, non-cryptographic identity for "these bytes". Length plus FNV-1a
     is enough to tell the two generations apart in a journal that never holds
     more than one payload. */
  function checksum(raw) {
    if (typeof raw !== 'string' || !raw) return '';
    let hash = 2166136261;
    for (let i = 0; i < raw.length; i += 1) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `${(hash >>> 0).toString(16)}:${raw.length}`;
  }

  function readable(raw) {
    if (typeof raw !== 'string' || !raw) return false;
    try {
      if (typeof root.SaveSchema !== 'undefined' && typeof root.SaveSchema.parse === 'function') {
        return !!root.SaveSchema.parse(raw).ok;
      }
      const data = JSON.parse(raw);
      return !!data && data.v === 2 && Array.isArray(data.sprites)
        && !!data.theme && typeof data.theme === 'object';
    } catch (err) {
      return false;
    }
  }

  function savedAt(raw) {
    try {
      return Number(JSON.parse(raw).savedAt) || 0;
    } catch (err) {
      return 0;
    }
  }

  function readMeta() {
    const raw = read(GEN_META_KEY);
    if (!raw) return null;
    try {
      const meta = JSON.parse(raw);
      return meta && (meta.current === 0 || meta.current === 1) ? meta : null;
    } catch (err) {
      return null;
    }
  }

  function readGeneration(index) {
    if (index !== 0 && index !== 1) return null;
    const raw = read(`${GEN_PREFIX}${index}`);
    if (!raw) return null;
    return { index, raw, checksum: checksum(raw) };
  }

  function currentGeneration() {
    const meta = readMeta();
    if (meta) {
      /* A committed generation was verified before this checksum was written.
         Begin only needs its index; avoid reading or hashing the full payload
         on every autosave. Boot re-reads and validates the payload itself. */
      return { index: meta.current, raw: null, checksum: meta.checksum || '' };
    }
    const live = read(SAVE_KEY);
    const gens = [readGeneration(0), readGeneration(1)]
      .filter((gen) => gen && readable(gen.raw));
    if (!gens.length) return null;
    const matching = gens.find((gen) => gen.raw === live);
    if (matching) return matching;
    gens.sort((a, b) => savedAt(b.raw) - savedAt(a.raw));
    return gens[0];
  }

  function readJournal() {
    const raw = read(JOURNAL_KEY);
    if (!raw) return null;
    try {
      const entry = JSON.parse(raw);
      if (!entry || entry.v !== VERSION || typeof entry.op !== 'string') return null;
      return entry;
    } catch (err) {
      return null;
    }
  }

  function writeJournal(entry) {
    return write(JOURNAL_KEY, JSON.stringify(entry));
  }

  /* Begin one operation. Only live overwrites and slot switches use the
     alternating generation; slot copies/pointer moves do not need a new live
     generation. */
  function begin(op, detail) {
    const from = currentGeneration();
    const usesGeneration = op === 'live' || op === 'slot-switch';
    const toGen = usesGeneration ? (from ? (from.index === 0 ? 1 : 0) : 0) : null;
    const entry = Object.assign({
      v: VERSION,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      op,
      phase: 'begin',
      at: Date.now(),
      fromGen: from ? from.index : null,
      toGen,
      pointerBefore: read(POINTER_KEY),
    }, detail || {});
    if (!writeJournal(entry)) return null;
    lastAction = null;
    isUnresolved = false;
    return entry;
  }

  function phase() {
    const entry = readJournal();
    return entry ? entry.phase : null;
  }

  function writeGeneration(raw) {
    const entry = readJournal();
    if (!entry || entry.toGen === null) return null;
    const key = `${GEN_PREFIX}${entry.toGen}`;
    if (!write(key, raw)) return null;
    if (read(key) !== raw) return null;
    entry.phase = 'generation-written';
    entry.generationChecksum = entry.toChecksum || checksum(raw);
    writeJournal(entry);
    return { index: entry.toGen, raw, checksum: entry.generationChecksum };
  }

  function mark(nextPhase, extra) {
    const entry = readJournal();
    if (!entry) return null;
    entry.phase = nextPhase;
    Object.assign(entry, extra || {});
    writeJournal(entry);
    return entry;
  }

  function commit() {
    const entry = readJournal();
    if (!entry) {
      isUnresolved = false;
      return null;
    }
    if (entry.toGen !== null) {
      /* writeGeneration() already verified this payload and recorded its
         checksum. Do not read the full generation back again on every save. */
      const checksumValue = entry.generationChecksum
        || (readGeneration(entry.toGen) || {}).checksum;
      if (checksumValue) {
        write(GEN_META_KEY, JSON.stringify({
          v: VERSION,
          current: entry.toGen,
          checksum: checksumValue,
          at: Date.now(),
        }));
      }
    }
    remove(JOURNAL_KEY);
    isUnresolved = false;
    lastAction = { action: 'finished', op: entry.op, at: Date.now() };
    return lastAction;
  }

  function abort() {
    const entry = readJournal();
    remove(JOURNAL_KEY);
    isUnresolved = false;
    lastAction = entry ? { action: 'rolled-back', op: entry.op, at: Date.now() } : null;
    return lastAction;
  }

  function activeSlot() {
    const value = Number(read(POINTER_KEY));
    return value >= 1 && value <= SLOT_COUNT ? value : 0;
  }

  function slotKey(index) {
    return `${SLOT_PREFIX}${index}`;
  }

  function restorePointer(value) {
    if (value === null || value === undefined) remove(POINTER_KEY);
    else write(POINTER_KEY, String(value));
  }

  function finish(entry, genIndex, raw, extra) {
    if (raw) write(SAVE_KEY, raw);
    if (genIndex !== null && genIndex !== undefined) {
      const gen = readGeneration(genIndex);
      if (gen) {
        write(GEN_META_KEY, JSON.stringify({
          v: VERSION,
          current: genIndex,
          checksum: gen.checksum,
          at: Date.now(),
        }));
      }
    }
    if (entry.pointerAfter !== undefined) restorePointer(entry.pointerAfter);
    remove(JOURNAL_KEY);
    isUnresolved = false;
    lastAction = Object.assign({ action: 'finished', op: entry.op, at: Date.now() }, extra || {});
    return lastAction;
  }

  function rollback(entry, raw, extra) {
    if (raw) write(SAVE_KEY, raw);
    if (entry.pointerBefore !== undefined) restorePointer(entry.pointerBefore);
    remove(JOURNAL_KEY);
    isUnresolved = false;
    lastAction = Object.assign({ action: 'rolled-back', op: entry.op, at: Date.now() }, extra || {});
    return lastAction;
  }

  function resolveLive(entry) {
    const to = readGeneration(entry.toGen);
    const toOk = !!to
      && readable(to.raw)
      && (!entry.toChecksum || entry.toChecksum === to.checksum);
    if (toOk) {
      const active = activeSlot();
      if (active) write(slotKey(active), to.raw);
      return finish(entry, entry.toGen, to.raw);
    }

    const live = read(SAVE_KEY);
    const liveTarget = readable(live) && entry.toChecksum && checksum(live) === entry.toChecksum;
    if (liveTarget) {
      /* The live key landed but its generation is missing: keep the readable
         live save and simply retire the journal. */
      const active = activeSlot();
      if (active) write(slotKey(active), live);
      remove(JOURNAL_KEY);
      isUnresolved = false;
      lastAction = { action: 'finished', op: entry.op, at: Date.now() };
      return lastAction;
    }

    const from = readGeneration(entry.fromGen);
    if (!readable(live) && from && readable(from.raw)) return rollback(entry, from.raw);
    if (readable(live)) return rollback(entry, null);
    isUnresolved = true;
    lastAction = { action: 'unresolved', op: entry.op, at: Date.now() };
    return lastAction;
  }

  function resolveSlot(entry) {
    const index = Number(entry.targetSlot);
    const raw = index ? read(slotKey(index)) : null;
    const slotOk = readable(raw)
      && (!entry.slotChecksum || entry.slotChecksum === checksum(raw));
    const wroteSlot = entry.phase === 'slot-written' || entry.phase === 'pointer-written';
    if (slotOk && wroteSlot) {
      if (entry.pointerAfter !== undefined) restorePointer(entry.pointerAfter);
      remove(JOURNAL_KEY);
      isUnresolved = false;
      lastAction = { action: 'finished', op: entry.op, at: Date.now() };
      return lastAction;
    }
    return rollback(entry, null);
  }

  function resolveSwitch(entry) {
    const to = readGeneration(entry.toGen);
    const toOk = !!to
      && readable(to.raw)
      && (!entry.targetChecksum || entry.targetChecksum === to.checksum);
    const live = read(SAVE_KEY);
    const liveTarget = readable(live)
      && !!entry.targetChecksum
      && checksum(live) === entry.targetChecksum;
    if (toOk || liveTarget) {
      const raw = toOk ? to.raw : live;
      if (entry.targetSlot) {
        write(slotKey(Number(entry.targetSlot)), raw);
        write(POINTER_KEY, String(entry.targetSlot));
      }
      return finish(entry, toOk ? entry.toGen : null, raw);
    }

    const from = readGeneration(entry.fromGen);
    if (from && readable(from.raw)) return rollback(entry, from.raw);
    if (readable(live)) return rollback(entry, null);
    isUnresolved = true;
    lastAction = { action: 'unresolved', op: entry.op, at: Date.now() };
    return lastAction;
  }

  /* Called synchronously before boot inspection. It is intentionally the only
     place that interprets an interrupted journal, so a normal save can never
     "finish" an old intent in the middle of gameplay. */
  function resolveOnBoot() {
    isUnresolved = false;
    const raw = read(JOURNAL_KEY);
    if (!raw) {
      /* Generations are rollback images for an unfinished operation, not a
         second recovery system. Without a journal, leave intentional damage or
         a deliberately missing live key to Hollow Health. */
      lastAction = null;
      return { action: 'none' };
    }
    const entry = readJournal();
    if (!entry) {
      remove(JOURNAL_KEY);
      lastAction = { action: 'discarded', at: Date.now() };
      return lastAction;
    }
    try {
      if (entry.op === 'live') return resolveLive(entry);
      if (entry.op === 'slot-write') return resolveSlot(entry);
      if (entry.op === 'slot-switch') return resolveSwitch(entry);
      remove(JOURNAL_KEY);
      lastAction = { action: 'discarded', op: entry.op, at: Date.now() };
      return lastAction;
    } catch (err) {
      isUnresolved = true;
      lastAction = { action: 'unresolved', op: entry.op, at: Date.now(), error: err && err.message };
      return lastAction;
    }
  }

  root.SaveJournal = Object.freeze({
    VERSION,
    JOURNAL_KEY,
    SAVE_KEY,
    GEN_PREFIX,
    GEN_META_KEY,
    SLOT_PREFIX,
    POINTER_KEY,
    begin,
    writeGeneration,
    mark,
    phase,
    commit,
    abort,
    resolveOnBoot,
    unresolved: () => isUnresolved,
    last: () => lastAction,
    checksum,
    readable,
    currentGeneration,
    readGeneration,
    readJournal,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
