/* Content-addressed storage for title images.

   The live save and every copy of it used to carry the same base64 title image.
   This module keeps the image bytes once in IndexedDB under a SHA-256 address
   and writes a short `idb-image:sha256:<hex>` reference into local saves. Boot
   resolves that reference back to a data URL before anything paints.

   `storageString()` is the only serializer local save paths should use: it
   replaces an already-stored data URL with its reference and leaves the data
   URL alone while an IndexedDB write is still pending, so a save never points
   at an image that has not landed. Save codes and cloud uploads use
   `exportSave()`, which does the reverse and always carries the actual image. */

(function (root) {
  'use strict';

  const DB_NAME = 'sprite-hollow.images.v1';
  const DB_VERSION = 1;
  const STORE = 'images';
  const REF_PREFIX = 'idb-image:';
  const REF_RE = /^idb-image:(sha256:[0-9a-f]{64}|fnv1a:[0-9a-f]{16})$/;

  let db = null;
  let mode = 'idle';
  let readyPromise = null;
  const refByData = new Map();
  const dataByRef = new Map();
  const inflight = new Map();

  function isReference(value) {
    return typeof value === 'string' && REF_RE.test(value);
  }

  function isDataUrl(value) {
    return typeof value === 'string' && /^data:image\//i.test(value);
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
          upgrade.createObjectStore(STORE, { keyPath: 'ref' });
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
        reject(new Error('IndexedDB image storage is blocked by another tab'));
      };
    });
  }

  function dbPut(record) {
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
      tx.objectStore(STORE).put(record);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB image write failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB image write aborted'));
    });
  }

  function dbGet(ref) {
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
      const request = tx.objectStore(STORE).get(ref);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('IndexedDB image read failed'));
      tx.onerror = () => reject(tx.error || new Error('IndexedDB image read failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB image read aborted'));
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
      tx.onerror = () => reject(tx.error || new Error('IndexedDB image clear failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB image clear aborted'));
    });
  }

  function dbCount() {
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
      const request = tx.objectStore(STORE).count();
      request.onsuccess = () => resolve(Number(request.result) || 0);
      request.onerror = () => reject(request.error || new Error('IndexedDB image count failed'));
      tx.onerror = () => reject(tx.error || new Error('IndexedDB image count failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB image count aborted'));
    });
  }

  function bytesFromDataUrl(value) {
    const comma = value.indexOf(',');
    if (comma < 0) return new TextEncoder().encode(value);
    const meta = value.slice(0, comma);
    const body = value.slice(comma + 1);
    try {
      if (/;base64/i.test(meta)) {
        const binary = atob(body);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }
      return new TextEncoder().encode(decodeURIComponent(body));
    } catch (err) {
      return new TextEncoder().encode(value);
    }
  }

  function hex(buffer) {
    return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function fnv1a(bytes, seed) {
    let hash = seed >>> 0;
    for (let i = 0; i < bytes.length; i += 1) {
      hash ^= bytes[i];
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  async function digest(value) {
    const bytes = bytesFromDataUrl(value);
    if (root.crypto && root.crypto.subtle && typeof root.crypto.subtle.digest === 'function') {
      try {
        const buffer = await root.crypto.subtle.digest('SHA-256', bytes);
        return `sha256:${hex(buffer)}`;
      } catch (err) { /* fall through to the deterministic local hash */ }
    }
    return `fnv1a:${fnv1a(bytes, 2166136261)}${fnv1a(bytes, 2246822519)}`;
  }

  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      try {
        const opened = await Promise.race([
          openDb(),
          new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
        ]);
        if (!opened) throw new Error('IndexedDB image storage timed out');
        db = opened;
        mode = 'ready';
        return status();
      } catch (err) {
        db = null;
        mode = 'unavailable';
        throw err;
      }
    })();
    return readyPromise;
  }

  function refFor(dataUrl) {
    return refByData.get(String(dataUrl || '')) || '';
  }

  async function put(dataUrl) {
    const value = String(dataUrl || '');
    if (!isDataUrl(value)) return '';
    /* Keep the existing title-image budget even when a save code or cloud
       copy brings the bytes in. An oversize image stays inline for the normal
       hydration check to drop instead of hiding behind a short reference. */
    if (typeof root.SaveIntegrity !== 'undefined'
        && typeof root.SaveIntegrity.titleImageLimit === 'function'
        && value.length > root.SaveIntegrity.titleImageLimit().maxStoredChars) {
      return '';
    }
    const known = refFor(value);
    if (known) return known;
    if (inflight.has(value)) return inflight.get(value);
    const work = (async () => {
      await ready();
      const address = await digest(value);
      const ref = `${REF_PREFIX}${address}`;
      let existing = dataByRef.get(ref) || null;
      if (!existing) {
        const stored = await dbGet(ref);
        existing = stored && stored.data ? String(stored.data) : null;
      }
      if (!existing) {
        await dbPut({ ref, data: value, bytes: value.length, at: Date.now() });
        const check = await dbGet(ref);
        if (!check || check.data !== value) throw new Error('IndexedDB image readback mismatch');
      }
      dataByRef.set(ref, existing || value);
      refByData.set(value, ref);
      return ref;
    })();
    inflight.set(value, work);
    try {
      return await work;
    } finally {
      inflight.delete(value);
    }
  }

  async function get(ref) {
    if (!isReference(ref)) return '';
    if (dataByRef.has(ref)) return dataByRef.get(ref);
    await ready();
    const record = await dbGet(ref);
    if (!record || !isDataUrl(record.data)) return '';
    dataByRef.set(ref, record.data);
    refByData.set(record.data, ref);
    return record.data;
  }

  /* Drop a reference that cannot be resolved. Keeping it in state would pass a
     storage address to the renderer as if it were an image URL. */
  function dropReference(theme) {
    if (!theme || typeof theme !== 'object' || !isReference(theme.titleImage)) return false;
    theme.titleImage = '';
    if (theme.titleBackdrop === 'image') theme.titleBackdrop = 'theme';
    return true;
  }

  /* Resolve a stored reference before the first paint. A missing record is
     cleared from the theme so CSS never receives a reference as an image URL. */
  async function resolveTheme(theme) {
    if (!theme || typeof theme !== 'object') return false;
    const value = String(theme.titleImage || '');
    if (!value) return true;
    if (isReference(value)) {
      let data = '';
      try { data = await get(value); } catch (err) { data = ''; }
      if (data) {
        theme.titleImage = data;
        return true;
      }
      dropReference(theme);
      return false;
    }
    if (isDataUrl(value)) {
      try { await put(value); } catch (err) { /* keep the inline image as fallback */ }
      return true;
    }
    return true;
  }

  function storageString(source) {
    return JSON.stringify(source, (key, value) => {
      if (key === 'titleImage' && isDataUrl(value)) {
        return refFor(value) || value;
      }
      return value;
    });
  }

  /* Best-effort migration of save copies that predate the store. Rewriting a
     valid save to a reference is safe even if boot stops midway: both shapes
     remain readable, and the next boot simply retries. Quarantine is left
     byte-for-byte alone because it is recovery evidence, not a live copy. */
  function migrateRaw(raw) {
    if (typeof raw !== 'string' || raw.indexOf('data:image/') < 0) return null;
    let parsed;
    try { parsed = JSON.parse(raw); } catch (err) { return null; }
    if (!parsed || !parsed.theme || !isDataUrl(parsed.theme.titleImage)) return null;
    return parsed;
  }

  async function migrateLocalSaves() {
    const box = root.localStorage;
    if (!box) return { migrated: 0 };
    const hotKeys = [];
    try {
      for (let i = 0; i < box.length; i += 1) {
        const key = box.key(i);
        if (key === 'sprite-hollow.save.v2'
            || /^sprite-hollow\.slot\.[1-9][0-9]*$/.test(key)
            || /^sprite-hollow\.(backup|restore)\.[^.]/.test(key)) {
          hotKeys.push(key);
        }
      }
    } catch (err) { /* storage unavailable */ }
    let archiveKeys = [];
    try {
      if (root.SaveArchive && typeof root.SaveArchive.debugKeys === 'function') {
        archiveKeys = root.SaveArchive.debugKeys();
      }
    } catch (err) { /* archive unavailable */ }
    const targets = hotKeys.map((key) => ({ key, archive: false }))
      .concat(archiveKeys
        .filter((key) => /^sprite-hollow\.(backup|restore)\./.test(key))
        .map((key) => ({ key, archive: true })));
    let migrated = 0;
    for (const target of targets) {
      let raw = null;
      try {
        raw = target.archive && root.SaveArchive && typeof root.SaveArchive.storage === 'function'
          ? root.SaveArchive.storage().getItem(target.key)
          : box.getItem(target.key);
      } catch (err) { raw = null; }
      const parsed = migrateRaw(raw);
      if (!parsed) continue;
      let ref = '';
      try { ref = await put(parsed.theme.titleImage); } catch (err) { ref = ''; }
      if (!ref) continue;
      parsed.theme.titleImage = ref;
      const next = JSON.stringify(parsed);
      try {
        if (target.archive) {
          if (root.SaveArchive.storage().setItem(target.key, next) === false) continue;
        } else {
          box.setItem(target.key, next);
        }
        migrated += 1;
      } catch (err) { /* keep the inline copy */ }
    }
    return { migrated };
  }

  /* Save codes and cloud exports must be portable without this device's
     IndexedDB, so replace a reference with the image data they carry. */
  async function exportSave(source) {
    if (!source || typeof source !== 'object' || !source.theme || !isReference(source.theme.titleImage)) {
      return source;
    }
    let data = '';
    try { data = await get(source.theme.titleImage); } catch (err) { data = ''; }
    if (!data) return source;
    const copy = JSON.parse(JSON.stringify(source));
    copy.theme.titleImage = data;
    return copy;
  }

  async function flush() {
    try { await ready(); } catch (err) { return false; }
    const pending = Array.from(inflight.values());
    if (pending.length) await Promise.allSettled(pending);
    return true;
  }

  async function count() {
    try {
      await ready();
      return await dbCount();
    } catch (err) {
      return 0;
    }
  }

  async function clear() {
    refByData.clear();
    dataByRef.clear();
    inflight.clear();
    try {
      await ready();
      await dbClear();
      return true;
    } catch (err) {
      return false;
    }
  }

  function status() {
    return {
      version: DB_VERSION,
      mode,
      ready: mode === 'ready',
      cached: dataByRef.size,
    };
  }

  root.TitleImageStore = Object.freeze({
    VERSION: DB_VERSION,
    DB_NAME,
    isReference,
    isDataUrl,
    ready,
    put,
    get,
    refFor,
    resolveTheme,
    dropReference,
    storageString,
    migrateLocalSaves,
    exportSave,
    flush,
    count,
    clear,
    status,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);