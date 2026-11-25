/* Multiple Hollows on one device.

   The live save stays in SAVE_KEY, which every other part of the game already
   reads and writes. A slot is a copy of that save under its own key, plus a
   pointer naming the active slot. Auto-saves are mirrored into the active slot
   so switching away never loses the current Hollow; switching writes the
   current state into its slot, then loads the target into SAVE_KEY and reloads
   the page with saves locked, so a pagehide write cannot overwrite it. */

const SAVE_SLOT_COUNT = 4;
const SAVE_SLOT_PREFIX = 'sprite-hollow.slot.';
const SAVE_SLOT_POINTER_KEY = 'sprite-hollow.slot.active';
const SAVE_SLOT_LABEL_PREFIX = 'sprite-hollow.slot.label.';

function saveSlotKey(index) { return `${SAVE_SLOT_PREFIX}${index}`; }
function saveSlotLabelKey(index) { return `${SAVE_SLOT_LABEL_PREFIX}${index}`; }
function saveSlotPreviousKey(index) { return `${saveSlotKey(index)}.prev`; }

function activeSaveSlot() {
  try {
    const index = Number(localStorage.getItem(SAVE_SLOT_POINTER_KEY));
    return index >= 1 && index <= SAVE_SLOT_COUNT ? index : 0;
  } catch {
    return 0;
  }
}

function readSaveSlot(index) {
  try {
    const raw = localStorage.getItem(saveSlotKey(index));
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' && Array.isArray(data.sprites) ? data : null;
  } catch {
    return null;
  }
}

function saveSlotLabel(index) {
  try {
    return String(localStorage.getItem(saveSlotLabelKey(index)) || '').replace(/[<>]/g, '').slice(0, 28) || '';
  } catch {
    return '';
  }
}

function saveSlotInfo(index) {
  const data = readSaveSlot(index);
  if (!data) return { index, empty: true, label: '', active: index === activeSaveSlot() };
  const sprites = Array.isArray(data.sprites) ? data.sprites : [];
  return {
    index,
    empty: false,
    active: index === activeSaveSlot(),
    label: saveSlotLabel(index),
    hollowName: String(data.hollowName || 'Mosslight Hollow'),
    coins: Math.max(0, Math.floor(Number(data.coins) || 0)),
    sprites: sprites.length,
    eggs: sprites.filter((sprite) => sprite && sprite.stage === 'egg').length,
    geneSpecies: Array.isArray(data.geneDesigns) ? data.geneDesigns.length : 0,
    savedAt: Number(data.savedAt) || 0,
    previous: !!readSlotPrevious(index),
  };
}

function readSlotPrevious(index) {
  try {
    return localStorage.getItem(saveSlotPreviousKey(index));
  } catch {
    return null;
  }
}

/* A slot is a second write after the live save. A quota error here must not be
   mistaken for a successful mirror: retry once after shedding the oldest
   recovery copy, then record the failure so Hollow Health can report it. */
function markSlotWriteFailure(err) {
  setSaveBlocked('slot-write-failed', err && err.message ? err.message : 'the active slot could not be updated');
  console.warn('Could not write save slot', err);
}

function markSlotWriteHealthy() {
  clearSaveBlocked('slot-write-failed');
}

function writeSlotRaw(index, raw) {
  try {
    localStorage.setItem(saveSlotKey(index), raw);
    markSlotWriteHealthy();
    return true;
  } catch (err) {
    let failure = err;
    if (typeof SaveIntegrity !== 'undefined' && SaveIntegrity.makeRoom()) {
      try {
        localStorage.setItem(saveSlotKey(index), raw);
        markSlotWriteHealthy();
        return true;
      } catch (retryErr) { failure = retryErr; }
    }
    markSlotWriteFailure(failure);
    return false;
  }
}

/* The first time the panel opens, give the Hollow that is already here a home
   in the first empty slot. Never overwrite an existing (or unreadable) slot
   just because no pointer survived a reset or switch failure. `exceptIndex`
   skips a slot the caller is about to replace, so adoption cannot put the
   Hollow somewhere that is already booked for something else. */
function adoptSaveSlot(exceptIndex = 0) {
  if (typeof savesLocked === 'function' && savesLocked()) return 0;
  const active = activeSaveSlot();
  if (active) return active;
  let target = 0;
  for (let index = 1; index <= SAVE_SLOT_COUNT; index += 1) {
    try {
      if (index !== exceptIndex && !localStorage.getItem(saveSlotKey(index))) { target = index; break; }
    } catch (err) {
      markSlotWriteFailure(err);
      return 0;
    }
  }
  if (!target) return 0;
  let journal = null;
  try {
    /* Adopt the live state, not the live key: a failed live write may have
       left the key a generation behind the state the player is looking at. */
    const raw = typeof state !== 'undefined' ? saveStorageString(state) : localStorage.getItem(SAVE_KEY);
    if (!raw) return 0;
    if (typeof SaveJournal !== 'undefined') {
      journal = SaveJournal.begin('slot-write', {
        targetSlot: target,
        slotChecksum: SaveJournal.checksum(raw),
        pointerAfter: target,
      });
    }
    if (!writeSlotRaw(target, raw)) {
      if (journal) SaveJournal.abort();
      return 0;
    }
    if (journal) SaveJournal.mark('slot-written');
    try {
      localStorage.setItem(SAVE_SLOT_POINTER_KEY, String(target));
    } catch (err) {
      try { localStorage.removeItem(saveSlotKey(target)); } catch { /* leave the copy if it cannot be removed */ }
      if (journal) SaveJournal.abort();
      markSlotWriteFailure(err);
      return 0;
    }
    if (journal) SaveJournal.mark('pointer-written');
    if (journal) SaveJournal.commit();
    return target;
  } catch (err) {
    if (journal) SaveJournal.abort();
    markSlotWriteFailure(err);
    return 0;
  }
}

function captureSaveSlot(index) {
  if (!index) return false;
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  return writeSlotRaw(index, saveStorageString(state));
}

/* The Hollow in use has to live somewhere before its live key is replaced. The
   active pointer is its normal home; without one (a lost pointer, an early
   write failure) adoption gives it the first empty slot that is not the one
   about to be overwritten. Returns the slot holding it, or 0 when there is
   nowhere to keep it -- then the caller refuses instead of dropping the Hollow
   the dialog promised to keep. Replacing the active slot itself is the one case
   with nothing to copy: both callers roll the slot back if the replacement
   fails, so the bytes are never lost. */
function keepLiveHollowInSlot(exceptIndex = 0) {
  const active = activeSaveSlot();
  if (active && active === exceptIndex) return active;
  if (active) return captureSaveSlot(active) ? active : 0;
  return adoptSaveSlot(exceptIndex);
}

/* Called after every normal save so the active slot tracks the live Hollow.
   The caller supplies the payload it just wrote. When called without one, the
   live payload must still match the in-memory state; otherwise a failed save
   could copy old live bytes over the active slot. */
function mirrorActiveSaveSlot(payload) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  const index = activeSaveSlot();
  if (!index) return true;
  try {
    let raw = typeof payload === 'string' ? payload : localStorage.getItem(SAVE_KEY);
    if (!raw) return true;
    if (typeof payload !== 'string' && typeof state !== 'undefined' && raw !== saveStorageString(state)) {
      markSlotWriteFailure(new Error('the active slot was not updated because the live save is stale'));
      return false;
    }
    return writeSlotRaw(index, raw);
  } catch (err) {
    markSlotWriteFailure(err);
    return false;
  }
}

function switchToSaveSlot(index) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  const target = readSaveSlot(index);
  if (!target) return false;
  if (!keepLiveHollowInSlot(index)) return false;
  try {
    /* Snapshot the Hollow in memory, not the possibly stale live key. */
    const current = typeof state !== 'undefined' ? saveStorageString(state) : localStorage.getItem(SAVE_KEY);
    if (current && typeof SaveIntegrity !== 'undefined') SaveIntegrity.createRestorePoint(current, 'before slot switch');
  } catch { /* recovery is best effort; the switch still proceeds */ }
  let liveBefore = null;
  let pointerBefore = null;
  let journal = null;
  try {
    liveBefore = localStorage.getItem(SAVE_KEY);
    pointerBefore = localStorage.getItem(SAVE_SLOT_POINTER_KEY);
    const raw = JSON.stringify(target);
    if (typeof SaveJournal !== 'undefined') {
      journal = SaveJournal.begin('slot-switch', {
        targetSlot: index,
        targetChecksum: SaveJournal.checksum(raw),
        liveChecksum: SaveJournal.checksum(raw),
        pointerBefore,
        pointerAfter: index,
      });
      if (journal && !SaveJournal.writeGeneration(raw)) {
        SaveJournal.abort();
        journal = null;
      }
    }
    localStorage.setItem(SAVE_KEY, raw);
    if (journal) SaveJournal.mark('live-written');
    try {
      localStorage.setItem(SAVE_SLOT_POINTER_KEY, String(index));
    } catch (pointerErr) {
      /* The live save must not point at a different Hollow if the pointer
         write failed. Put back both halves before reporting the failure. */
      let rollbackErr = null;
      try {
        if (liveBefore === null) localStorage.removeItem(SAVE_KEY);
        else localStorage.setItem(SAVE_KEY, liveBefore);
      } catch (err) { rollbackErr = err; }
      try {
        if (pointerBefore === null) localStorage.removeItem(SAVE_SLOT_POINTER_KEY);
        else localStorage.setItem(SAVE_SLOT_POINTER_KEY, pointerBefore);
      } catch (err) { rollbackErr = rollbackErr || err; }
      if (journal) SaveJournal.abort();
      markSlotWriteFailure(rollbackErr || pointerErr);
      return false;
    }
    if (journal) SaveJournal.mark('pointer-written');
    if (journal) SaveJournal.commit();
  } catch (err) {
    if (journal) SaveJournal.abort();
    markSlotWriteFailure(err);
    return false;
  }
  if (typeof lockSaves === 'function') lockSaves();
  location.reload();
  return true;
}

/* Overwriting a slot keeps the generation it replaces, so Save here, Overwrite
   and Start over are reversible from the slot card. Only explicit writes rotate
   it: the autosave mirror would otherwise burn the previous copy every few
   seconds. */
function rememberSlotGeneration(index) {
  try {
    const prior = localStorage.getItem(saveSlotKey(index));
    if (prior) localStorage.setItem(saveSlotPreviousKey(index), prior);
    return true;
  } catch (err) {
    markSlotWriteFailure(err);
    return false;
  }
}

function restoreSaveSlotGeneration(index) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  if (!index || index === activeSaveSlot()) return false;
  const previous = readSlotPrevious(index);
  if (!previous || !writeSlotRaw(index, previous)) return false;
  try { localStorage.removeItem(saveSlotPreviousKey(index)); } catch { /* the copy is already back */ }
  return true;
}

/* Start-over keeps the replaced Hollow in its slot, so the pointer must not keep
   aiming at it: the fresh Hollow's first autosave would otherwise mirror over
   the very Hollow the keeper just left. */
function releaseActiveSlot() {
  try {
    localStorage.removeItem(SAVE_SLOT_POINTER_KEY);
    return true;
  } catch {
    return false;
  }
}

function writeSaveSlot(index) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  if (!index || index < 1 || index > SAVE_SLOT_COUNT) return false;
  const raw = typeof state !== 'undefined' ? saveStorageString(state) : localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  if (!rememberSlotGeneration(index)) return false;
  const active = activeSaveSlot();
  let journal = null;
  if (typeof SaveJournal !== 'undefined') {
    journal = SaveJournal.begin('slot-write', {
      targetSlot: index,
      slotChecksum: SaveJournal.checksum(raw),
      /* Undefined means "leave the active pointer alone"; a target means a
         pointer write that boot can finish. */
      pointerAfter: active ? undefined : index,
    });
  }
  if (!writeSlotRaw(index, raw)) {
    if (journal) SaveJournal.abort();
    return false;
  }
  if (journal) SaveJournal.mark('slot-written');
  try {
    if (!active) localStorage.setItem(SAVE_SLOT_POINTER_KEY, String(index));
  } catch (err) {
    if (journal) SaveJournal.abort();
    markSlotWriteFailure(err);
    return false;
  }
  if (journal) SaveJournal.mark('pointer-written');
  if (journal) SaveJournal.commit();
  return true;
}

/* A new Hollow gets a slot of its own: the Hollow you are in stays saved where
   it is, the chosen slot becomes a fresh start, and the app reloads into the
   intro to pick a starter -- exactly like a device that has never played. The
   banked coins go too unless the caller keeps them, so "start over" really
   starts over. */
function startNewSaveSlot(index, opts = {}) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  if (!index || index < 1 || index > SAVE_SLOT_COUNT) return false;
  /* The Hollow in memory gets a slot of its own before the live key is
     replaced; with nowhere to keep it, nothing is changed. */
  if (!keepLiveHollowInSlot(index)) return false;
  let raw;
  try {
    raw = saveStorageString(freshState());
  } catch (err) {
    markSlotWriteFailure(err);
    return false;
  }
  try {
    const current = typeof state !== 'undefined' ? saveStorageString(state) : localStorage.getItem(SAVE_KEY);
    if (current && typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.createRestorePoint === 'function') {
      SaveIntegrity.createRestorePoint(current, 'before a new Hollow');
    }
  } catch { /* recovery is best effort; the new Hollow still proceeds */ }
  /* Keep the Hollow this slot holds now, so Start over can be undone. */
  rememberSlotGeneration(index);
  let before = null;
  try {
    before = {
      live: localStorage.getItem(SAVE_KEY),
      pointer: localStorage.getItem(SAVE_SLOT_POINTER_KEY),
      slot: localStorage.getItem(saveSlotKey(index)),
      label: localStorage.getItem(saveSlotLabelKey(index)),
    };
    localStorage.setItem(saveSlotKey(index), raw);
    localStorage.setItem(saveSlotLabelKey(index), '');
    localStorage.setItem(SAVE_KEY, raw);
    localStorage.setItem(SAVE_SLOT_POINTER_KEY, String(index));
  } catch (err) {
    /* Put the device back exactly as it was: a half-started Hollow must not
       leave the live save pointing at another slot's Hollow. */
    if (before) {
      const restore = (key, value) => {
        try {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        } catch { /* the restore point still holds the old Hollow */ }
      };
      restore(SAVE_KEY, before.live);
      restore(SAVE_SLOT_POINTER_KEY, before.pointer);
      restore(saveSlotKey(index), before.slot);
      restore(saveSlotLabelKey(index), before.label);
    }
    markSlotWriteFailure(err);
    return false;
  }
  if (!opts.keepCoins && typeof CoinBank !== 'undefined' && typeof CoinBank.clear === 'function') CoinBank.clear();
  if (typeof lockSaves === 'function') lockSaves();
  location.reload();
  return true;
}

function clearSaveSlot(index) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  if (!index || index === activeSaveSlot()) return false;
  try {
    localStorage.removeItem(saveSlotKey(index));
    localStorage.removeItem(saveSlotLabelKey(index));
    localStorage.removeItem(saveSlotPreviousKey(index));
    return true;
  } catch {
    return false;
  }
}

function renameSaveSlot(index, label) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  try {
    localStorage.setItem(saveSlotLabelKey(index), String(label || '').replace(/[<>]/g, '').slice(0, 28));
    return true;
  } catch {
    return false;
  }
}

function saveSlotCardHTML(info) {
  const when = info.savedAt ? new Date(info.savedAt).toLocaleString() : 'never saved';
  return `<article class="slot-card${info.active ? ' is-active' : ''}${info.empty ? ' is-empty' : ''}">
    <div class="slot-head">
      <b>${info.empty ? `Slot ${info.index}` : esc(info.label || info.hollowName)}</b>
      ${info.active ? '<span class="chip slot-badge">Active</span>' : info.empty ? '<span class="chip">Empty</span>' : ''}
    </div>
    ${info.empty
      ? '<p class="tiny muted" style="margin:4px 0 0">No Hollow here yet. Start a new one, or save the current one in.</p>'
      : `<p class="tiny muted" style="margin:4px 0 0">${esc(info.hollowName)} · ${info.sprites} sprites · ${info.eggs} eggs${info.geneSpecies ? ` · ${info.geneSpecies} gene species` : ''}</p>
         <p class="tiny muted" style="margin:2px 0 0">${info.coins.toLocaleString()} coins · ${esc(when)}</p>`}
    <div class="row slot-actions">
      <button class="btn btn-primary btn-sm" type="button" data-slot-switch="${info.index}"${info.empty || info.active ? ' disabled' : ''}>${info.active ? 'In use' : 'Switch'}</button>
      <button class="btn btn-soft btn-sm" type="button" data-slot-write="${info.index}">${info.empty ? 'Save here' : 'Overwrite'}</button>
      <button class="btn btn-ghost btn-sm" type="button" data-slot-clear="${info.index}"${info.active || info.empty ? ' disabled' : ''}>Delete</button>
      ${info.previous && !info.active ? `<button class="btn btn-ghost btn-sm" type="button" data-slot-undo="${info.index}">Undo overwrite</button>` : ''}
    </div>
    <button class="btn btn-ghost btn-sm btn-block slot-new" type="button" data-slot-new="${info.index}">${info.active ? '↻ Start this Hollow over' : '＋ Start a new Hollow here'}</button>
  </article>`;
}

function openSaveSlots() {
  if (!state.started) return;
  if (typeof savesLocked === 'function' && savesLocked()) {
    toast('Finish save recovery before changing slots.', '🩺');
    return;
  }
  adoptSaveSlot();
  openSheet({
    key: 'save-slots',
    title: '🗂️ Hollow slots',
    sub: `Keep up to ${SAVE_SLOT_COUNT} Hollows on this device, switch between them, or start a new one from scratch. Switching and starting over reload the app.`,
    body: `<div class="slot-hint card">
        <b>How it works</b>
        <p class="tiny muted" style="margin:4px 0 0;line-height:1.55">The Hollow you are in now saves automatically into its slot. Switch loads the other save, Overwrite copies the current Hollow into a slot, Start a new Hollow begins from the very beginning in that slot, and Delete only clears a slot you are not using.</p>
      </div>
      <div data-slot-list style="margin-top:10px"></div>
      <p class="tiny muted" style="margin:12px 2px 0;line-height:1.55">Slots live in this browser or app's storage, next to your normal save. A save code from Save backup still restores into whichever slot is active.</p>`,
    onMount: (root, closeSheet) => {
      const panel = root.querySelector('.sheet') || root;
      const list = root.querySelector('[data-slot-list]');
      const paint = () => {
        list.innerHTML = Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => saveSlotCardHTML(saveSlotInfo(i + 1))).join('');
      };

      panel.addEventListener('click', async (event) => {
        const switchBtn = event.target.closest('[data-slot-switch]');
        if (switchBtn) {
          const index = Number(switchBtn.dataset.slotSwitch);
          const info = saveSlotInfo(index);
          const sure = await confirmModal(`Switch to ${info.label || info.hollowName}?`, `Your current Hollow is saved to its slot first. The app will reload into ${info.sprites} sprites and ${info.coins.toLocaleString()} coins.`, 'Switch Hollow');
          if (sure && switchToSaveSlot(index)) {
            closeSheet();
            toast('Switching Hollow…', '🗂️');
          } else if (sure) {
            toast('That slot could not be opened. The current Hollow is still here.', '⚠️');
          }
          return;
        }
        const writeBtn = event.target.closest('[data-slot-write]');
        if (writeBtn) {
          const index = Number(writeBtn.dataset.slotWrite);
          const existing = saveSlotInfo(index);
          if (!existing.empty) {
            const sure = await confirmModal(`Overwrite slot ${index}?`, `This replaces ${existing.label || existing.hollowName} (${existing.sprites} sprites) with the Hollow you are in now.`, 'Overwrite slot', { danger: true });
            if (!sure) return;
          }
          if (!writeSaveSlot(index)) {
            toast('That slot could not be written. Free some space and try again.', '⚠️');
            paint();
            return;
          }
          paint();
          Sfx.coin();
          toast(`Saved to slot ${index}.`, '💾');
          return;
        }
        const newBtn = event.target.closest('[data-slot-new]');
        if (newBtn) {
          const index = Number(newBtn.dataset.slotNew);
          const info = saveSlotInfo(index);
          const body = info.active
            ? 'Everything in this Hollow goes back to the start: no sprites, eggs, unlocks, streaks or coins. Save anything you want to keep into another slot first.'
            : `${info.empty ? `Slot ${index} is empty, so the new Hollow starts there.` : `This replaces ${info.label || info.hollowName} in slot ${index}.`} Your current Hollow stays saved in its own slot, and the new one starts with the starter coins and nothing unlocked.`;
          const sure = await confirmModal(
            info.active ? 'Start over with a brand-new Hollow?' : `Start a new Hollow in slot ${index}?`,
            body,
            info.active ? 'Start over' : 'Start new',
            { danger: true },
          );
          if (!sure) return;
          if (startNewSaveSlot(index)) {
            closeSheet();
            toast('Starting a brand-new Hollow…', '🌱');
          } else {
            toast('The new Hollow could not be started. Nothing was changed.', '⚠️');
          }
          return;
        }
        const undoBtn = event.target.closest('[data-slot-undo]');
        if (undoBtn) {
          const index = Number(undoBtn.dataset.slotUndo);
          const sure = await confirmModal(`Bring back the Hollow slot ${index} held before?`, 'This replaces what is in that slot now with the copy kept from the last overwrite.', 'Bring it back');
          if (!sure) return;
          if (restoreSaveSlotGeneration(index)) {
            paint();
            Sfx.coin();
            toast(`Slot ${index} holds its previous Hollow again.`, '↩️');
          } else {
            toast('That previous copy could not be restored.', '⚠️');
          }
          return;
        }
        const clearBtn = event.target.closest('[data-slot-clear]');
        if (clearBtn) {
          const index = Number(clearBtn.dataset.slotClear);
          const info = saveSlotInfo(index);
          const sure = await confirmModal(`Delete slot ${index}?`, `This clears ${info.label || info.hollowName} from this device. Your current Hollow is untouched.`, 'Delete slot', { danger: true });
          if (!sure) return;
          if (clearSaveSlot(index)) {
            paint();
            toast(`Slot ${index} cleared.`, '🗂️');
          } else {
            toast('That slot could not be cleared. It may still be in use.', '⚠️');
          }
        }
      });

      paint();
    },
  });
}

/* The Studio button is inside an open sheet, which stops click propagation, so
   the delegate runs in the capture phase instead of on the bubble. */
document.addEventListener('click', (event) => {
  if (!event.target.closest || !event.target.closest('[data-save-slots]')) return;
  event.preventDefault();
  if (typeof openSaveSlots === 'function' && state.started) openSaveSlots();
}, true);
