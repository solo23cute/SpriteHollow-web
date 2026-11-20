/* Rolling local backups, restore points, and corruption quarantine.

   Cold copies live in the IndexedDB archive (save-archive.js). The live save
   and every save-slot key stay in localStorage, so slots, save codes, and
   cloud copies keep working exactly as before. This module never hydrates a
   save: it only stores raw strings, inspects them through SaveSchema, and hands
   the best readable copy to the boot recovery screen. The normal load path only
   calls it after the live save has been inspected and found readable.

   SaveArchive hydrates a synchronous cache at boot and migrates legacy
   localStorage copies only after verifying their IndexedDB readback. Before
   that boot completes, and whenever the archive is unavailable, the helpers
   fall back to localStorage so no recovery copy is lost.

   Budgets are deliberately small. A save can carry a title image, so the ring
   keeps three rotating copies, five manual restore points, and three
   quarantined payloads. The 96 KB image cap remains until the migration and
   hot-usage checks allow 256 KB. makeRoom() sheds quarantine first, then the
   oldest backup, then the oldest restore point when quota bites. */

(function (root) {
  'use strict';

  const VERSION = 1;
  const RING_SIZE = 3;
  const RESTORE_LIMIT = 5;
  const QUARANTINE_LIMIT = 3;
  const AUTO_BACKUP_MS = 5 * 60 * 1000;

  /* Every retained save carries the title image, so keep one small enough that
     the live save, four slots, the backup ring, a cloud safety point, quarantine
     and five restore points can coexist on a typical 5 MB localStorage quota. */
  const TITLE_IMAGE_MAX_BYTES = 96 * 1024;
  const LARGE_TITLE_IMAGE_MAX_BYTES = 256 * 1024;
  const TITLE_IMAGE_MAX_STORED_CHARS = Math.ceil(TITLE_IMAGE_MAX_BYTES * 4 / 3) + 64;

  const RING_PREFIX = 'sprite-hollow.backup.';
  const RING_META = 'sprite-hollow.backup.meta';
  const RESTORE_PREFIX = 'sprite-hollow.restore.';
  const RESTORE_META = 'sprite-hollow.restore.meta';
  const QUARANTINE_PREFIX = 'sprite-hollow.quarantine.';
  const QUARANTINE_META = 'sprite-hollow.quarantine.meta';
  const LAST_LOAD_KEY = 'sprite-hollow.health.last';
  const SAVE_KEY = 'sprite-hollow.save.v2';

  const BLOCKED_COPY = {
    'write-failed': {
      title: 'Saving is blocked',
      message: 'Your latest changes are not saved. Keep this tab open, free some device storage, then try again.',
    },
    'slot-write-failed': {
      title: 'Active slot not updated',
      message: 'Your live save is intact, but the active save slot could not be updated.',
    },
    'cloud-restore-blocked': {
      title: 'Cloud restore stopped',
      message: 'A local safety copy could not be written, so nothing from the cloud was restored.',
    },
  };
  const BLOCKED_STATUSES = Object.keys(BLOCKED_COPY);

  /* 96 KB stays the floor until SaveArchive has verified the legacy migration
     and the live save plus slots pass its hot-usage check. Before archive boot
     resolves, and on any archive failure, the old budget continues to apply. */
  function titleImageLimit() {
    const archiveReady = root.SaveArchive
      && typeof root.SaveArchive.readyState === 'function'
      && root.SaveArchive.readyState() === 'ready';
    const maxBytes = archiveReady && typeof root.SaveArchive.imageCapBytes === 'function'
      ? root.SaveArchive.imageCapBytes()
      : TITLE_IMAGE_MAX_BYTES;
    return {
      maxBytes,
      maxStoredChars: Math.ceil(maxBytes * 4 / 3) + 64,
    };
  }

  function store(storage) {
    if (storage) return storage;
    try {
      return root.localStorage || null;
    } catch (err) {
      return null;
    }
  }

  function readKey(key, storage) {
    const box = store(storage);
    if (!box) return null;
    try {
      return box.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeKey(key, value, storage) {
    const box = store(storage);
    if (!box) return false;
    try {
      box.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function removeKey(key, storage) {
    const box = store(storage);
    if (!box) return false;
    try {
      box.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  /* Cold copies live in IndexedDB after SaveArchive boot. A caller that passes
     its own storage (the pure integrity tests) keeps using that fake box. */
  function archiveStore(storage) {
    if (storage) return storage;
    if (root.SaveArchive
        && typeof root.SaveArchive.readyState === 'function'
        && root.SaveArchive.readyState() === 'ready'
        && typeof root.SaveArchive.storage === 'function') {
      return root.SaveArchive.storage();
    }
    return store();
  }

  function archiveReadKey(key, storage) {
    const box = archiveStore(storage);
    if (!box) return null;
    try {
      return box.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function archiveWriteKey(key, value, storage) {
    const box = archiveStore(storage);
    if (!box) return false;
    try {
      box.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function archiveRemoveKey(key, storage) {
    const box = archiveStore(storage);
    if (!box) return false;
    try {
      box.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  function readMeta(key, storage) {
    const raw = archiveReadKey(key, storage);
    if (!raw) return [];
    try {
      const list = JSON.parse(raw);
      return Array.isArray(list)
        ? list.filter((entry) => entry && typeof entry.key === 'string' && entry.key)
        : [];
    } catch (err) {
      return [];
    }
  }

  function writeMeta(key, list, storage) {
    return archiveWriteKey(key, JSON.stringify(list), storage);
  }

  function number(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  /* Inspect without trusting. Readable means the schema layer can parse and
     normalize it, which is exactly what loadState() accepts; shape warnings are
     reported but never make a copy look damaged. The parsed result is kept so
     recovery can use the same inspection instead of parsing twice. */
  function inspect(raw) {
    const bytes = typeof raw === 'string' ? raw.length : 0;
    const info = { bytes, ok: false, status: 'empty', sprites: 0, eggs: 0, hollowName: '', coins: 0, savedAt: 0, version: null };
    if (!raw) return { info, result: null };
    /* This is also the gate for recovery candidates. Use the schema's full parse
       boundary so a version-only envelope with missing sprites or theme can
       never masquerade as a readable copy. */
    const result = SaveSchema.parse(raw);
    if (!result.ok) {
      return {
        info: Object.assign(info, {
          status: result.status,
          version: result.fromVersion,
          message: result.error,
        }),
        result,
      };
    }
    const save = result.save;
    const sprites = Array.isArray(save.sprites) ? save.sprites : [];
    return {
      info: Object.assign(info, {
        ok: true,
        status: SaveSchema.STATUS.OK,
        sprites: sprites.length,
        eggs: sprites.filter((sprite) => sprite && sprite.stage === 'egg').length,
        hollowName: String(save.hollowName || ''),
        coins: number(save.coins),
        savedAt: number(save.savedAt),
        version: result.fromVersion,
        warnings: result.warnings || [],
      }),
      result,
    };
  }

  function describe(raw) {
    return inspect(raw).info;
  }

  function stamp(raw, entry) {
    return Object.assign({}, entry, describe(raw));
  }

  function inspectList(metaKey, storage) {
    return readMeta(metaKey, storage)
      .sort((a, b) => number(b.at) - number(a.at))
      .map((entry) => stamp(archiveReadKey(entry.key, storage), entry))
      .filter((entry) => entry.bytes > 0);
  }

  /* Quarantine is a damaged payload, not a recovery candidate. */
  function hasRecoverableCopy(storage) {
    return [RING_META, RESTORE_META]
      .some((metaKey) => readMeta(metaKey, storage).some((entry) => !!archiveReadKey(entry.key, storage)));
  }

  /* Store one payload and keep its metadata list newest-first. The shared
     path makes restore points and quarantine identical at the boundary. */
  function keepCopy(prefix, metaKey, limit, raw, entry, storage) {
    const key = `${prefix}${entry.at}`;
    if (!archiveWriteKey(key, raw, storage)) return null;
    const meta = readMeta(metaKey, storage).filter((item) => item.key !== key);
    meta.push(Object.assign({ key }, entry));
    meta.sort((a, b) => number(b.at) - number(a.at));
    const kept = meta.slice(0, limit);
    if (!writeMeta(metaKey, kept, storage)) {
      archiveRemoveKey(key, storage);
      return null;
    }
    meta.slice(limit).forEach((item) => archiveRemoveKey(item.key, storage));
    return Object.assign({ key }, entry);
  }

  /* One rotating copy of the save, at most once every five minutes. Accepts a
     raw string or a lazy reader so a throttled autosave never touches the
     previous payload at all. */
  function autoBackup(raw, options) {
    /* A recovery screen locks every automatic write, including this ring. */
    if (typeof savesLocked === 'function' && savesLocked()) return false;
    const opts = options || {};
    const storage = opts.storage;
    const now = number(opts.now) || Date.now();
    const meta = readMeta(RING_META, storage);
    /* Check the cheap rotation throttle before parsing, migrating or
       validating the previous save. */
    if (!opts.force) {
      const latest = meta.reduce((max, entry) => Math.max(max, number(entry.at)), 0);
      if (latest && now - latest < AUTO_BACKUP_MS) return false;
    }
    let payload;
    try {
      payload = typeof raw === 'function' ? raw() : raw;
    } catch (err) {
      return false;
    }
    if (typeof payload !== 'string' || payload.length < 20) return false;
    /* Never rotate a payload that cannot be read into the ring: a corrupt live
       save must not evict a good copy. */
    if (!describe(payload).ok) return false;
    const used = new Set(meta.map((entry) => entry.slot));
    let slot = 0;
    while (slot < RING_SIZE && used.has(slot)) slot += 1;
    if (slot === RING_SIZE) {
      const oldest = meta.reduce((pick, entry) => (number(entry.at) < number(pick.at) ? entry : pick), meta[0]);
      slot = oldest.slot;
    }
    const key = `${RING_PREFIX}${slot}`;
    if (!archiveWriteKey(key, payload, storage)) return false;
    const next = meta.filter((entry) => entry.key !== key);
    next.push({ key, slot, at: now, reason: String(opts.reason || 'auto') });
    next.sort((a, b) => number(b.at) - number(a.at));
    if (!writeMeta(RING_META, next.slice(0, RING_SIZE), storage)) {
      archiveRemoveKey(key, storage);
      return false;
    }
    return true;
  }

  function backups(storage) {
    return inspectList(RING_META, storage);
  }

  function createRestorePoint(raw, label, options) {
    if (typeof raw !== 'string' || !describe(raw).ok) return null;
    const opts = options || {};
    const now = number(opts.now) || Date.now();
    const entry = { at: now, label: String(label || 'Restore point').slice(0, 60) };
    const kept = keepCopy(RESTORE_PREFIX, RESTORE_META, RESTORE_LIMIT, raw, entry, opts.storage);
    return kept ? { id: String(now), key: kept.key, at: now, label: entry.label } : null;
  }

  function restorePoints(storage) {
    return inspectList(RESTORE_META, storage);
  }

  function deleteRestorePoint(key, storage) {
    const meta = readMeta(RESTORE_META, storage).filter((entry) => entry.key !== key);
    return writeMeta(RESTORE_META, meta, storage) && archiveRemoveKey(key, storage);
  }

  /* Read one archived payload for health/diagnostics and the recovery tests.
     The live save key is deliberately not exposed here. */
  function readCopy(key, storage) {
    return archiveReadKey(key, storage);
  }

  function quarantine(raw, reason, options) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const opts = options || {};
    const now = number(opts.now) || Date.now();
    const entry = { at: now, reason: String(reason || 'unreadable').slice(0, 60) };
    const kept = keepCopy(QUARANTINE_PREFIX, QUARANTINE_META, QUARANTINE_LIMIT, raw, entry, opts.storage);
    return kept ? { id: String(now), key: kept.key, at: now } : null;
  }

  function quarantined(storage) {
    return inspectList(QUARANTINE_META, storage);
  }

  /* Newest readable copy from the ring or manual restore points. Read and
     parse candidates newest-first so recovery stops at the first good copy
     instead of describing every backup the player has. */
  function recover(storage) {
    const candidates = readMeta(RING_META, storage)
      .map((entry) => Object.assign({ source: 'backup' }, entry))
      .concat(readMeta(RESTORE_META, storage)
        .map((entry) => Object.assign({ source: 'restore-point' }, entry)))
      .sort((a, b) => number(b.at) - number(a.at));
    for (const entry of candidates) {
      const raw = archiveReadKey(entry.key, storage);
      if (!raw) continue;
      const inspected = inspect(raw);
      if (!inspected.info.ok || !inspected.result) continue;
      return {
        source: entry.source,
        key: entry.key,
        at: entry.at,
        raw,
        info: inspected.info,
        save: inspected.result.save,
        result: inspected.result,
      };
    }
    return null;
  }

  /* Shed damaged quarantine first, then the oldest automatic backup, and only
     then a manual restore point. A save write should never cost the player a
     deliberate restore point while automatic copies are still available. */
  function makeRoom(storage) {
    const groups = [QUARANTINE_META, RING_META, RESTORE_META]
      .map((metaKey) => ({ metaKey, list: readMeta(metaKey, storage) }))
      .filter((group) => group.list.length);
    if (!groups.length) return false;
    const { metaKey, list } = groups[0];
    const victim = list.reduce((pick, entry) => (number(entry.at) < number(pick.at) ? entry : pick), list[0]);
    writeMeta(metaKey, list.filter((entry) => entry.key !== victim.key), storage);
    archiveRemoveKey(victim.key, storage);
    return true;
  }

  function usage(storage) {
    const box = store(storage);
    let bytes = 0;
    const liveKeys = new Set();
    if (box) {
      try {
        for (let i = 0; i < box.length; i += 1) {
          const key = box.key(i);
          if (!key || key.indexOf('sprite-hollow.') !== 0) continue;
          if (key === 'sprite-hollow.archive.outbox') continue;
          const value = box.getItem(key);
          bytes += key.length + (value ? value.length : 0);
          liveKeys.add(key);
        }
      } catch (err) { /* return the bytes counted so far */ }
    }
    if (!storage) {
      const archive = archiveStore();
      if (archive && archive !== box) {
        try {
          for (let i = 0; i < archive.length; i += 1) {
            const key = archive.key(i);
            if (!key || liveKeys.has(key)) continue;
            const value = archive.getItem(key);
            bytes += key.length + (value ? value.length : 0);
          }
        } catch (err) { /* return the bytes counted so far */ }
      }
    }
    return bytes;
  }

  function setLastLoad(info) {
    const entry = Object.assign({ at: Date.now() }, info || {});
    writeKey(LAST_LOAD_KEY, JSON.stringify(entry));
    return entry;
  }

  function lastLoad(storage) {
    const raw = readKey(LAST_LOAD_KEY, storage);
    if (!raw) return null;
    try {
      const entry = JSON.parse(raw);
      return entry && typeof entry === 'object' ? entry : null;
    } catch (err) {
      return null;
    }
  }

  /* The one user-facing interpretation of a blocked save. Hollow Health and
     the persistent notice both read this, so a failed write cannot be shown
     as healthy in one place and broken in another. */
  function blockedState(info, storage) {
    const last = info || lastLoad(storage);
    const copy = last && BLOCKED_COPY[last.status];
    return copy ? Object.assign({ status: last.status, at: last.at || 0 }, copy) : null;
  }

  function health(storage) {
    const rings = backups(storage);
    const points = restorePoints(storage);
    const held = quarantined(storage);
    return {
      version: VERSION,
      saveBytes: (readKey(SAVE_KEY, storage) || '').length,
      bytes: usage(storage),
      lastLoad: lastLoad(storage),
      backups: rings,
      restorePoints: points,
      quarantine: held,
      recoverable: rings.some((entry) => entry.ok) || points.some((entry) => entry.ok),
      imageCapBytes: titleImageLimit().maxBytes,
      archive: root.SaveArchive && typeof root.SaveArchive.status === 'function'
        ? root.SaveArchive.status()
        : null,
    };
  }

  root.SaveIntegrity = Object.freeze({
    VERSION,
    RING_SIZE,
    RESTORE_LIMIT,
    QUARANTINE_LIMIT,
    AUTO_BACKUP_MS,
    TITLE_IMAGE_MAX_BYTES,
    LARGE_TITLE_IMAGE_MAX_BYTES,
    TITLE_IMAGE_MAX_STORED_CHARS,
    SAVE_KEY,
    RING_META,
    RESTORE_META,
    QUARANTINE_META,
    BLOCKED_STATUSES,
    describe,
    autoBackup,
    backups,
    createRestorePoint,
    restorePoints,
    deleteRestorePoint,
    readCopy,
    quarantine,
    quarantined,
    recover,
    makeRoom,
    usage,
    hasRecoverableCopy,
    titleImageLimit,
    setLastLoad,
    lastLoad,
    blockedState,
    health,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
