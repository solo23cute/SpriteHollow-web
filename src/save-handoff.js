/* New-phone handoff: the smallest local-first way to move a Hollow to a new
   phone. Transport is the save code that already exists, and the restore
   preview is the save comparison chooser that already exists. Nothing in this
   file touches the network, and nothing here changes the save itself.

   A save code is several KB even when compressed, which is far past what one
   QR square can hold, so the handoff uses the share sheet or the clipboard
   instead of a code image. Only bookkeeping lives in localStorage, under its
   own key: last export, last restore, and when the reminder was put away. */

(function (root) {
  'use strict';

  const VERSION = 1;
  const KEY = 'sprite-hollow.handoff.v1';
  const REMIND_AFTER = 14 * 24 * 60 * 60 * 1000;
  const MIN_SPRITES = 3;

  function storageOf(storage) {
    if (storage) return storage;
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch (err) {
      return null;
    }
  }

  function stamp(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  function sanitize(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return {
      lastExportAt: stamp(source.lastExportAt),
      lastRestoreAt: stamp(source.lastRestoreAt),
      dismissedAt: stamp(source.dismissedAt),
    };
  }

  function read(storage) {
    const target = storageOf(storage);
    if (!target) return sanitize(null);
    try {
      return sanitize(JSON.parse(target.getItem(KEY) || 'null'));
    } catch (err) {
      return sanitize(null);
    }
  }

  function write(patch, storage) {
    const target = storageOf(storage);
    const next = Object.assign(read(storage), sanitize(patch));
    if (!target) return next;
    try {
      target.setItem(KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not record the handoff on this device.', err);
    }
    return next;
  }

  function recordExport(now = Date.now(), storage) {
    return write({ lastExportAt: stamp(now) || Date.now() }, storage);
  }

  function recordRestore(now = Date.now(), storage) {
    /* A fresh restore is not a reason to keep nagging about the old phone. */
    return write({ lastRestoreAt: stamp(now) || Date.now(), dismissedAt: 0 }, storage);
  }

  function dismiss(now = Date.now(), storage) {
    return write({ dismissedAt: stamp(now) || Date.now() }, storage);
  }

  function countOf(save) {
    const sprites = save && Array.isArray(save.sprites)
      ? save.sprites.filter((sprite) => sprite && typeof sprite === 'object')
      : [];
    const eggs = sprites.filter((sprite) => sprite.stage === 'egg').length;
    return { total: sprites.length, eggs, grown: sprites.length - eggs };
  }

  function nameOf(save) {
    const name = save && typeof save.hollowName === 'string' ? save.hollowName.trim() : '';
    return name || 'Mosslight Hollow';
  }

  /* The compact restore preview: only what a player needs before deciding,
     read straight off the incoming save, never off the live one. */
  function preview(save) {
    if (!save || typeof save !== 'object' || !Array.isArray(save.sprites)) return null;
    if (!save.theme || typeof save.theme !== 'object') return null;
    const counts = countOf(save);
    /* A Hollow with no sprites in it is not something to hand to a phone. */
    if (!counts.total) return null;
    const species = new Set();
    save.sprites.forEach((sprite) => {
      if (sprite && typeof sprite.element === 'string' && sprite.element) species.add(sprite.element);
    });
    return {
      hollowName: nameOf(save),
      sprites: counts.total,
      eggs: counts.eggs,
      grown: counts.grown,
      species: species.size,
      coins: Math.max(0, Math.floor(Number(save.coins) || 0)),
      savedAt: stamp(save.savedAt) || stamp(save.createdAt),
      version: Number(save.v) || 0,
    };
  }

  /* One tap on the new phone: read whatever is in the box or on the clipboard
     and answer with either a preview or a plain-language reason. */
  async function previewFromCode(text) {
    if (typeof parseSaveCode !== 'function') {
      return { ok: false, preview: null, save: null, error: 'Save codes are not available in this build.' };
    }
    try {
      const parsed = await parseSaveCode(text);
      const view = preview(parsed);
      if (!view) return { ok: false, preview: null, save: null, error: 'That is not a Sprite Hollow save.' };
      return { ok: true, preview: view, save: parsed, error: '' };
    } catch (err) {
      return { ok: false, preview: null, save: null, error: (err && err.message) || 'That save code did not work.' };
    }
  }

  function daysSince(at, now) {
    const diff = Math.max(0, (stamp(now) || Date.now()) - (stamp(at) || 0));
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  }

  function agoLabel(at, now) {
    const days = daysSince(at, now);
    if (!stamp(at)) return '';
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  }

  function blankNote(record, reason) {
    return {
      due: false,
      reason,
      headline: '',
      blurb: '',
      lastExportAt: record.lastExportAt,
      lastRestoreAt: record.lastRestoreAt,
      dismissedAt: record.dismissedAt,
    };
  }

  /* Whether the Hollow should remind the player to make a copy that can move
     phones. A Hollow with nothing but an egg is left alone, an export or a
     put-away is quiet for two weeks, and the wording follows whether a copy
     has ever left the device. */
  function noteFor(save, now = Date.now(), storage) {
    const at = stamp(now) || Date.now();
    const record = read(storage);
    const view = preview(save);
    if (!save || !save.started || !view || view.grown < MIN_SPRITES) {
      return blankNote(record, 'empty');
    }
    if (record.dismissedAt && at - record.dismissedAt < REMIND_AFTER) {
      return blankNote(record, 'dismissed');
    }
    if (record.lastExportAt && at - record.lastExportAt < REMIND_AFTER) {
      return blankNote(record, 'fresh');
    }
    const never = !record.lastExportAt && !record.lastRestoreAt;
    const count = view.sprites === 1 ? '1 sprite' : `${view.sprites} sprites`;
    const note = blankNote(record, never ? 'never' : 'stale');
    note.due = true;
    note.headline = never ? 'Keep a copy off this phone' : 'Time for a fresh save code';
    note.blurb = never
      ? `${count} and every unlock live only on this phone. One tap sends a save code to a new phone, or to yourself.`
      : `The last save copy left ${agoLabel(record.lastExportAt, at)}. Send a fresh one before the old phone goes away.`;
    note.sprites = view.sprites;
    note.eggs = view.eggs;
    return note;
  }

  root.SaveHandoff = Object.freeze({
    VERSION,
    KEY,
    REMIND_AFTER,
    MIN_SPRITES,
    read,
    recordExport,
    recordRestore,
    dismiss,
    preview,
    previewFromCode,
    noteFor,
    sanitize,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
