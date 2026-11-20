/* IndexedDB archive for rolling backups, restore points, and quarantine.

   The live save and the save slots stay in localStorage: they are the hot path
   and must remain synchronous. This archive owns the cold copies that used to
   sit beside them, so one 256 KB title image no longer has to share the 5 MB
   localStorage quota with a backup ring, five restore points, and quarantine.

   Boot awaits ready(). Legacy localStorage archive keys are copied into
   IndexedDB one at a time, read back, compared byte-for-byte, and only then
   removed. A failed copy keeps its legacy key and leaves the image cap at
   96 KB so the old budget still holds. The synchronous storage() shim is backed
   by the hydrated cache, which keeps SaveIntegrity's recovery and health APIs
   synchronous after boot. */

(function (root) {
  'use strict';

  const DB_NAME = 'sprite-hollow.archive.v1';
  const DB_VERSION = 1;
  const STORE = 'entries';
  const META_PREFIX = '__meta:';
  const MIGRATION_META = META_PREFIX + 'migration';
  const CAP_META = META_PREFIX + 'imageCap';

  const SAVE_KEY = 'sprite-hollow.save.v2';
  const MARKER_KEY = 'sprite-hollow.archive.v1';
  const ARCHIVE_PREFIXES = [
    'sprite-hollow.backup.',
    'sprite-hollow.restore.',
    'sprite-hollow.quarantine.',
  ];
  const SMALL_IMAGE_BYTES = 96 * 1024;
  const LARGE_IMAGE_BYTES = 256 * 1024;
  /* The live save plus four slots and their labels stay comfortably below this
     before a 256 KB image is allowed. Archive bytes no longer count here. */
  const HOT_USAGE_LIMIT = 3 * 1024 * 1024;

  let db = null;
  let mode = 'idle';
  let readyPromise = null;
  let migration = null;
  let capBytes = SMALL_IMAGE_BYTES;
  let cache = new Map();
  let meta = new Map();
  let queue = Promise.resolve();

  function isArchiveKey(key) {
    return typeof key === 'string' && ARCHIVE_PREFIXES.some((prefix) => key.indexOf(prefix) === 0);
  }

  function safeStorage() {
    try {
      return root.localStorage || null;
    } catch (err) {
      return null;
    }
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) {
        reject(new Error('IndexedDB is unavailable'));
        return;
      }
      let settled = false;
      const request = root.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const upgrade = request.result;
        if (!upgrade.objectStoreNames.contains(STORE)) {
          upgrade.createObjectStore(STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => {
        if (settled) return;
        settled = true;
        resolve(request.result);
      };
      request.onerror = () => {
        if (settled) return;
        settled = true;
        reject(request.error || new Error('IndexedDB could not be opened'));
      };
      request.onblocked = () => {
        if (settled) return;
        settled = true;
        reject(new Error('IndexedDB upgrade is blocked by another tab'));
      };
    });
  }

  function dbPut(key, value) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB is not open'));
        return;
      }
      let tx;
      try {
        tx = db.transaction(STORE, 'readwrite');
      } catch (err) {
        reject(err);
        return;
      }
      tx.objectStore(STORE).put({ key, value, at: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB write failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB write aborted'));
    });
  }

  function dbGet(key) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB is not open'));
        return;
      }
      let tx;
      try {
        tx = db.transaction(STORE, 'readonly');
      } catch (err) {
        reject(err);
        return;
      }
      const request = tx.objectStore(STORE).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('IndexedDB read failed'));
      tx.onerror = () => reject(tx.error || new Error('IndexedDB read failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB read aborted'));
    });
  }

  function dbDelete(key) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB is not open'));
        return;
      }
      let tx;
      try {
        tx = db.transaction(STORE, 'readwrite');
      } catch (err) {
        reject(err);
        return;
      }
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB delete failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB delete aborted'));
    });
  }

  function dbClear() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB is not open'));
        return;
      }
      let tx;
      try {
        tx = db.transaction(STORE, 'readwrite');
      } catch (err) {
        reject(err);
        return;
      }
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB clear failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB clear aborted'));
    });
  }

  function dbAll() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB is not open'));
        return;
      }
      let tx;
      try {
        tx = db.transaction(STORE, 'readonly');
      } catch (err) {
        reject(err);
        return;
      }
      const request = tx.objectStore(STORE).getAll();
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => reject(request.error || new Error('IndexedDB read failed'));
      tx.onerror = () => reject(tx.error || new Error('IndexedDB read failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB read aborted'));
    });
  }

  /* Copy every legacy archive key, verify the stored value, then delete only
     that key. If anything fails, the legacy key survives and the cap stays at
     96 KB. */
  async function migrateLegacy() {
    const box = safeStorage();
    const result = { status: 'complete', total: 0, migrated: 0, failed: 0, at: Date.now() };
    if (!box) {
      result.status = 'unavailable';
      return result;
    }
    const keys = [];
    try {
      for (let i = 0; i < box.length; i += 1) {
        const key = box.key(i);
        if (isArchiveKey(key)) keys.push(key);
      }
    } catch (err) {
      result.status = 'unavailable';
      return result;
    }
    for (const key of keys) {
      let value = null;
      try {
        value = box.getItem(key);
      } catch (err) {
        value = null;
      }
      if (typeof value !== 'string') continue;
      result.total += 1;
      try {
        await dbPut(key, value);
        const stored = await dbGet(key);
        if (!stored || stored.value !== value) throw new Error('readback mismatch');
        box.removeItem(key);
        result.migrated += 1;
      } catch (err) {
        result.failed += 1;
      }
    }
    if (result.failed) result.status = 'partial';
    try {
      await dbPut(MIGRATION_META, result);
    } catch (err) { /* ready() still keeps the legacy keys and the small cap */ }
    return result;
  }

  async function loadCache() {
    cache = new Map();
    meta = new Map();
    const records = await dbAll();
    for (const record of records) {
      if (!record || typeof record.key !== 'string') continue;
      if (record.key.indexOf(META_PREFIX) === 0) {
        meta.set(record.key.slice(META_PREFIX.length), record.value);
      } else if (isArchiveKey(record.key)) {
        cache.set(record.key, String(record.value));
      }
    }
    /* A partial migration can leave keys that are still valid. Keep them
       readable until the next boot retries the copy. */
    const box = safeStorage();
    if (box) {
      try {
        for (let i = 0; i < box.length; i += 1) {
          const key = box.key(i);
          if (!isArchiveKey(key) || cache.has(key)) continue;
          const value = box.getItem(key);
          if (typeof value === 'string') cache.set(key, value);
        }
      } catch (err) { /* cache stays with the verified IDB copies */ }
    }
  }

  function hasRecoverableKeys() {
    for (const key of cache.keys()) {
      if (key.indexOf('sprite-hollow.backup.') === 0 || key.indexOf('sprite-hollow.restore.') === 0) return true;
    }
    return false;
  }

  /* A tiny hot marker says cold recovery copies are expected on this device.
     If IndexedDB later fails to open, boot must recover instead of adopting a
     fresh Hollow over the only remaining copies. */
  function markExpected() {
    const box = safeStorage();
    if (!box) return;
    try {
      if (hasRecoverableKeys()) box.setItem(MARKER_KEY, '1');
      else box.removeItem(MARKER_KEY);
    } catch (err) { /* the marker is best effort */ }
  }

  function expected() {
    const box = safeStorage();
    if (!box) return false;
    try {
      return box.getItem(MARKER_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  function hotUsage() {
    const box = safeStorage();
    if (!box) return Infinity;
    let bytes = 0;
    try {
      for (let i = 0; i < box.length; i += 1) {
        const key = box.key(i);
        if (!key || key.indexOf('sprite-hollow.') !== 0) continue;
        if (isArchiveKey(key)) continue;
        if (key === SAVE_KEY || key.indexOf('sprite-hollow.save.gen.') === 0 || key.indexOf('sprite-hollow.slot.') === 0) {
          const value = box.getItem(key);
          bytes += key.length + (value ? value.length : 0);
        }
      }
    } catch (err) {
      return Infinity;
    }
    return bytes;
  }

  /* The archive and the hot save share one device budget only until the cold
     copies move. Once migration is verified and the live save plus slots fit,
     a 256 KB image is safe. */
  function evaluateImageCap(overriddenHotBytes) {
    const measured = typeof overriddenHotBytes === 'number' ? overriddenHotBytes : hotUsage();
    const migrated = !!(migration && migration.status === 'complete');
    capBytes = migrated && measured <= HOT_USAGE_LIMIT ? LARGE_IMAGE_BYTES : SMALL_IMAGE_BYTES;
    const record = { bytes: capBytes, hotBytes: measured, at: Date.now() };
    meta.set('imageCap', record);
    if (db) {
      queue = queue.then(() => dbPut(CAP_META, record)).catch(() => null);
    }
    return capBytes;
  }

  function persist(key, value) {
    /* Write the legacy key synchronously first. A slot switch or close can
       navigate before the IndexedDB transaction commits; boot then migrates
       this pending key with the same readback check. The key is removed only
       after the IDB copy verifies. */
    const box = safeStorage();
    if (box) {
      try { box.setItem(key, value); } catch (err) { /* IDB still gets a copy */ }
    }
    if (box && (key.indexOf('sprite-hollow.backup.') === 0 || key.indexOf('sprite-hollow.restore.') === 0)) {
      try { box.setItem(MARKER_KEY, '1'); } catch (err) { /* best effort */ }
    }
    queue = queue.then(async () => {
      if (!db) return;
      try {
        await dbPut(key, value);
        const stored = await dbGet(key);
        if (!stored || stored.value !== value) throw new Error('readback mismatch');
        if (box) {
          try { box.removeItem(key); } catch (err) { /* the IDB copy is verified */ }
        }
      } catch (err) {
        /* The pending legacy key remains for the next boot migration. */
      }
    });
    return queue;
  }

  function removePersisted(key) {
    queue = queue.then(async () => {
      const box = safeStorage();
      if (box) {
        try { box.removeItem(key); } catch (err) { /* best effort */ }
      }
      if (!db) return;
      try {
        await dbDelete(key);
      } catch (err) { /* already gone from the cache */ }
    });
    return queue;
  }

  const shim = {
    getItem(key) {
      return cache.has(key) ? cache.get(key) : null;
    },
    setItem(key, value) {
      if (!isArchiveKey(key)) return false;
      const text = String(value);
      /* Without IndexedDB the legacy key is the only durable copy, so a failed
         localStorage write must be reported to callers such as the cloud
         restore safety check. With IndexedDB open, persist() starts the
         transactional copy and keeps the legacy handoff until readback. */
      if (!db) {
        const box = safeStorage();
        if (!box) return false;
        try { box.setItem(key, text); } catch (err) { return false; }
      }
      cache.set(key, text);
      persist(key, text);
      return true;
    },
    removeItem(key) {
      if (!isArchiveKey(key)) return false;
      cache.delete(key);
      markExpected();
      removePersisted(key);
      return true;
    },
    key(index) {
      return Array.from(cache.keys())[index] || null;
    },
    get length() {
      return cache.size;
    },
  };

  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      try {
        /* A wedged IndexedDB open must not hold boot forever. If it does not
           answer in four seconds, keep the legacy fallback and the 96 KB cap. */
        const opened = await Promise.race([
          openDb(),
          new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
        ]);
        if (!opened) throw new Error('IndexedDB open timed out');
        db = opened;
        migration = await migrateLegacy();
        await loadCache();
        mode = 'idb';
        markExpected();
        evaluateImageCap();
      } catch (err) {
        db = null;
        mode = 'legacy';
        migration = {
          status: 'unavailable',
          total: 0,
          migrated: 0,
          failed: 0,
          at: Date.now(),
          error: err && err.message ? err.message : String(err),
        };
        capBytes = SMALL_IMAGE_BYTES;
      }
      return status();
    })();
    return readyPromise;
  }

  function flush() {
    return queue.then(() => true);
  }

  async function verify() {
    if (!db) return { ok: false, mode, mismatches: ['IndexedDB is not open'] };
    const mismatches = [];
    for (const [key, value] of cache.entries()) {
      try {
        const stored = await dbGet(key);
        if (!stored || stored.value !== value) mismatches.push(key);
      } catch (err) {
        mismatches.push(key);
      }
    }
    return { ok: mismatches.length === 0, mode, entries: cache.size, mismatches };
  }

  /* Used by the save-integrity scenarios to start each recovery case from an
     empty archive. It is not wired to a player-facing reset: Start over keeps
     the player's cold copies, exactly as before. */
  async function clearArchive() {
    /* A wedged write under a paused/virtual clock must not hold the recovery
       scenarios. The cache and legacy keys are cleared below either way. */
    try {
      await Promise.race([
        queue,
        new Promise((resolve) => setTimeout(resolve, 200)),
      ]);
    } catch (err) { /* clear anyway */ }
    if (db) {
      try {
        await Promise.race([
          dbClear(),
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);
      } catch (err) { /* cache is still cleared below */ }
    }
    cache.clear();
    meta.clear();
    const box = safeStorage();
    if (box) {
      try { box.removeItem(MARKER_KEY); } catch (err) { /* best effort */ }
    }
    if (box) {
      try {
        const keys = [];
        for (let i = 0; i < box.length; i += 1) {
          if (isArchiveKey(box.key(i))) keys.push(box.key(i));
        }
        keys.forEach((key) => box.removeItem(key));
      } catch (err) { /* best effort */ }
    }
    migration = { status: 'complete', total: 0, migrated: 0, failed: 0, at: Date.now() };
    capBytes = SMALL_IMAGE_BYTES;
    if (db) {
      queue = queue.then(() => dbPut(MIGRATION_META, migration)).catch(() => null);
    }
    return status();
  }

  function status() {
    const box = safeStorage();
    let legacyKeys = 0;
    if (box) {
      try {
        for (let i = 0; i < box.length; i += 1) {
          if (isArchiveKey(box.key(i))) legacyKeys += 1;
        }
      } catch (err) { /* unavailable */ }
    }
    return {
      version: DB_VERSION,
      mode,
      ready: mode === 'idb',
      migration,
      imageCapBytes: capBytes,
      smallImageBytes: SMALL_IMAGE_BYTES,
      largeImageBytes: LARGE_IMAGE_BYTES,
      hotUsageLimit: HOT_USAGE_LIMIT,
      entries: cache.size,
      legacyKeys,
      expected: expected(),
      cacheKeys: Array.from(cache.keys()),
    };
  }

  root.SaveArchive = Object.freeze({
    VERSION: DB_VERSION,
    SMALL_IMAGE_BYTES,
    LARGE_IMAGE_BYTES,
    HOT_USAGE_LIMIT,
    isArchiveKey,
    ready,
    flush,
    verify,
    status,
    readyState: () => (mode === 'idb' ? 'ready' : mode),
    imageCapBytes: () => capBytes,
    expected,
    evaluateImageCap,
    clear: clearArchive,
    storage: () => shim,
    debugKeys: () => Array.from(cache.keys()),
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
