/* Cross-device save chooser.

   When a save code, cloud copy or another Hollow arrives, show what changed
   before anything is written. The player can keep the device save, use the
   incoming save, or merge both. The device copy is made into a restore point
   before either destructive action, and merge itself never drops a unique
   sprite, unlock or custom creation. */

const SAVE_CONFLICT_RESTORE_LABEL = 'before save conflict choice';

function saveConflictWhen(at) {
  const stamp = Number(at) || 0;
  if (!stamp) return 'Not recorded';
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function saveConflictNumber(value) {
  return Math.max(0, Math.floor(Number(value) || 0)).toLocaleString();
}

function saveConflictNamed(collection, key) {
  if (typeof collection === 'undefined' || !collection || !collection[key]) return key;
  const item = collection[key];
  return item.name || item.label || key;
}

function saveConflictUnlockName(group, key) {
  if (group === 'scenes' || group === 'biomesVisited') return saveConflictNamed(typeof SCENES !== 'undefined' ? SCENES : null, key);
  if (group === 'wardrobe') return saveConflictNamed(typeof ACCESSORIES !== 'undefined' ? ACCESSORIES : null, key);
  if (group === 'foods') return saveConflictNamed(typeof FOODS !== 'undefined' ? FOODS : null, key);
  if (group === 'vaults' || group === 'guardians' || group === 'secrets') return saveConflictNamed(typeof ELEMENTS !== 'undefined' ? ELEMENTS : null, key);
  return key;
}

function saveConflictUnlockList(group, keys) {
  const names = keys.slice(0, 3).map((key) => saveConflictUnlockName(group, key));
  const rest = keys.length - names.length;
  return `${names.join(', ')}${rest > 0 ? ` +${rest} more` : ''}`;
}

function saveConflictDiffLine(label, left, right, detail = '') {
  const delta = Number(right) - Number(left);
  const trend = delta > 0 ? `+${delta} incoming` : delta < 0 ? `+${Math.abs(delta)} this device` : 'same';
  return `<div class="sc-diff">
    <span class="sc-diff-label">${esc(label)}</span>
    <span class="sc-diff-values"><b>${esc(left)}</b><span aria-hidden="true">→</span><b>${esc(right)}</b></span>
    <span class="sc-diff-trend ${delta ? 'is-different' : ''}">${esc(trend)}${detail ? ` · ${esc(detail)}` : ''}</span>
  </div>`;
}

function saveConflictUnlockRows(comparison) {
  const groups = comparison.unlocks.groups.filter((group) => (
    group.left !== group.right || group.onlyLeft.length || group.onlyRight.length
  ));
  if (!groups.length) return '<p class="tiny muted sc-empty">Unlock lists already match.</p>';
  return groups.map((group) => {
    const bits = [];
    if (group.onlyRight.length) bits.push(`+${group.onlyRight.length} incoming · ${saveConflictUnlockList(group.key, group.onlyRight)}`);
    if (group.onlyLeft.length) bits.push(`+${group.onlyLeft.length} this device · ${saveConflictUnlockList(group.key, group.onlyLeft)}`);
    return `<div class="sc-unlock-row">
      <b>${esc(group.label)}</b>
      <span class="sc-unlock-count">${group.left} → ${group.right}</span>
      <span class="tiny muted">${esc(bits.join(' · ') || 'same list')}</span>
    </div>`;
  }).join('');
}

function saveConflictSpriteDetail(comparison) {
  const bits = [];
  if (comparison.sprites.onlyRight.length) {
    bits.push(`+${comparison.sprites.onlyRight.length} incoming sprite${comparison.sprites.onlyRight.length === 1 ? '' : 's'}`);
  }
  if (comparison.sprites.onlyLeft.length) {
    bits.push(`+${comparison.sprites.onlyLeft.length} this device`);
  }
  if (comparison.species.onlyRight.length) {
    bits.push(`+${comparison.species.onlyRight.length} new species · ${saveConflictUnlockList('secrets', comparison.species.onlyRight)}`);
  }
  if (comparison.species.onlyLeft.length) {
    bits.push(`+${comparison.species.onlyLeft.length} species only here · ${saveConflictUnlockList('secrets', comparison.species.onlyLeft)}`);
  }
  if (comparison.sprites.betterRight) {
    bits.push(`${comparison.sprites.betterRight} shared sprites have more progress`);
  } else if (comparison.sprites.betterLeft) {
    bits.push(`${comparison.sprites.betterLeft} shared sprites are further here`);
  }
  return bits.join(' · ') || 'Both saves contain the same sprite copies.';
}

function saveConflictBody(comparison, source) {
  const left = comparison.left;
  const right = comparison.right;
  const sourceText = source === 'cloud save'
    ? 'This copy came from your cloud account.'
    : 'This copy came from another device or a save code.';
  const newer = comparison.dates.newer === 'right' ? 'incoming'
    : comparison.dates.newer === 'left' ? 'this device' : 'neither';
  return `
    <div class="save-conflict-alert">
      <span class="save-conflict-mark" aria-hidden="true">⚖️</span>
      <div><b>Nothing has changed yet</b><p>${esc(sourceText)} Keep this device, use the incoming save, or merge both. Your current Hollow is saved as a restore point before either replacement.</p></div>
    </div>

    <div class="save-compare-head">
      <span class="sc-head-label">Save</span>
      <span class="sc-side"><span class="tiny muted">This device</span><b>${esc(left.hollowName)}</b></span>
      <span class="sc-side"><span class="tiny muted">Incoming</span><b>${esc(right.hollowName)}</b></span>
    </div>

    <div class="save-compare-table" role="group" aria-label="Differences between the two saves">
      <div class="sc-row"><span class="sc-label">Last saved</span><span class="sc-value">${esc(saveConflictWhen(left.savedAt))}</span><span class="sc-value${comparison.dates.newer === 'right' ? ' is-newer' : ''}">${esc(saveConflictWhen(right.savedAt))}</span></div>
      <div class="sc-row"><span class="sc-label">Hollow since</span><span class="sc-value">${esc(saveConflictWhen(left.createdAt))}</span><span class="sc-value">${esc(saveConflictWhen(right.createdAt))}</span></div>
      <div class="sc-row"><span class="sc-label">Sprites</span><span class="sc-value">${saveConflictNumber(left.sprites)}</span><span class="sc-value${right.sprites > left.sprites ? ' is-newer' : ''}">${saveConflictNumber(right.sprites)}</span></div>
      <div class="sc-row"><span class="sc-label">Species</span><span class="sc-value">${saveConflictNumber(left.species)}</span><span class="sc-value${right.species > left.species ? ' is-newer' : ''}">${saveConflictNumber(right.species)}</span></div>
      <div class="sc-row"><span class="sc-label">Eggs</span><span class="sc-value">${saveConflictNumber(left.eggs)}</span><span class="sc-value">${saveConflictNumber(right.eggs)}</span></div>
      <div class="sc-row"><span class="sc-label">Coins</span><span class="sc-value">${saveConflictNumber(left.coins)}</span><span class="sc-value${comparison.coins.winner === 'right' ? ' is-newer' : ''}">${saveConflictNumber(right.coins)}</span></div>
      <div class="sc-row"><span class="sc-label">Unlocks</span><span class="sc-value">${saveConflictNumber(left.unlocks.total)}</span><span class="sc-value${right.unlocks.total > left.unlocks.total ? ' is-newer' : ''}">${saveConflictNumber(right.unlocks.total)}</span></div>
    </div>
    <p class="tiny muted sc-newer-note">Newer save: <b>${esc(newer)}</b>. Merge uses the newer save for settings and daily state.</p>

    <div class="section-title"><h2>What differs</h2><span>sprites, coins, dates and unlocks</span></div>
    ${saveConflictDiffLine('Sprites', left.sprites, right.sprites, saveConflictSpriteDetail(comparison))}
    ${saveConflictDiffLine('Coins', left.coins, right.coins, comparison.coins.winner === 'right' ? 'incoming has more' : comparison.coins.winner === 'left' ? 'this device has more' : 'same balance')}
    ${saveConflictDiffLine('Unlocks', left.unlocks.total, right.unlocks.total)}
    <div class="sc-unlocks">${saveConflictUnlockRows(comparison)}</div>

    <div class="save-merge-card">
      <b>What merging keeps</b>
      <ul>
        <li>Every unique sprite from both saves.</li>
        <li>For a shared sprite, the copy with the most level, XP, bond and hatch progress.</li>
        <li>The larger coin balance, plus both saves' unlock lists, badges, homes and stats. Custom creations are unioned as far as their existing saved limits allow.</li>
        <li>Newer settings and daily check-in state.</li>
      </ul>
      <p>Coin balances are not added together, so merging cannot mint extra coins. Your current Hollow is kept as a restore point first.</p>
    </div>

    <div class="save-conflict-actions">
      <button class="btn btn-ghost btn-sm" type="button" data-save-conflict-keep>Keep this device</button>
      <button class="btn btn-soft btn-sm" type="button" data-save-conflict-use>Use incoming</button>
      <button class="btn btn-primary" type="button" data-save-conflict-merge>Merge both saves</button>
    </div>
    <p class="tiny muted sc-footnote">Keep this device changes nothing. Use incoming replaces this device's Hollow after saving a restore point. Merge writes the combined save after saving that same restore point.</p>`;
}

async function installConflictSave(next, mode) {
  let normalized = next;
  if (typeof SaveSchema !== 'undefined') {
    const checked = SaveSchema.parse(JSON.stringify(next));
    if (!checked.ok) {
      toast(checked.error || 'That combined save could not be read.', '⚠️');
      return false;
    }
    normalized = checked.save;
  }

  const key = typeof SaveIntegrity !== 'undefined' ? SaveIntegrity.SAVE_KEY : SAVE_KEY;
  try {
    /* Use the in-memory state, not the live key: the last autosave may still
       be sitting in its short debounce when the chooser opens. */
    const current = typeof state !== 'undefined' && state && state.started
      ? (typeof saveStorageString === 'function' ? saveStorageString(state) : JSON.stringify(state))
      : localStorage.getItem(key);
    if (current && (typeof SaveIntegrity === 'undefined' || typeof SaveIntegrity.createRestorePoint !== 'function')) {
      toast('Save recovery is unavailable, so nothing was replaced.', '⚠️');
      return false;
    }
    if (current) {
      const made = SaveIntegrity.createRestorePoint(
        current,
        mode === 'merge' ? 'before save merge' : SAVE_CONFLICT_RESTORE_LABEL,
      );
      if (!made) {
        toast('Could not keep a restore point, so nothing was replaced.', '⚠️');
        return false;
      }
    }
    if (typeof TitleImageStore !== 'undefined' && normalized.theme && normalized.theme.titleImage) {
      try { await TitleImageStore.put(normalized.theme.titleImage); } catch (err) { /* inline fallback */ }
    }
    localStorage.setItem(key, typeof saveStorageString === 'function' ? saveStorageString(normalized) : JSON.stringify(normalized));
  } catch (err) {
    console.error('Could not apply the chosen save', err);
    toast('This device could not store the chosen save. Nothing was replaced.', '⚠️');
    return false;
  }
  if (typeof lockSaves === 'function') lockSaves();
  toast(mode === 'merge' ? 'Both Hollows merged. Waking the Hollow…' : 'Incoming save restored. Waking the Hollow…', '💾');
  setTimeout(() => location.reload(), 320);
  return true;
}

function openSaveConflictChooser(incoming, options = {}) {
  const current = typeof state !== 'undefined' && state ? state : {};
  if (typeof SaveCompare === 'undefined') {
    toast('Save comparison is not available in this build.', '⚠️');
    return Promise.resolve(false);
  }
  const comparison = SaveCompare.compare(current, incoming);
  const source = options.source || 'save code';
  const onCommit = typeof options.onCommit === 'function' ? options.onCommit : installConflictSave;
  let resolveChoice;
  const choice = new Promise((resolve) => { resolveChoice = resolve; });
  let settled = false;
  let busy = false;
  let sheetRoot = null;
  let closeSheet = null;
  const finish = (value) => {
    if (settled) return;
    settled = true;
    resolveChoice(value);
  };
  const setBusy = (on) => {
    busy = on;
    if (!sheetRoot) return;
    sheetRoot.querySelectorAll('[data-save-conflict-keep], [data-save-conflict-use], [data-save-conflict-merge]').forEach((button) => {
      button.disabled = on;
    });
  };
  const choose = async (mode) => {
    if (busy) return;
    if (mode === 'keep') {
      finish(false);
      if (closeSheet) closeSheet();
      return;
    }
    busy = true;
    setBusy(true);
    try {
      const next = mode === 'merge' ? SaveCompare.merge(current, incoming).save : incoming;
      const applied = await onCommit(next, mode);
      if (applied) {
        finish(true);
        if (closeSheet) closeSheet();
      } else {
        setBusy(false);
      }
    } catch (err) {
      console.error('Save conflict choice failed', err);
      toast(err && err.message ? err.message : 'That save choice did not work.', '⚠️');
      setBusy(false);
    }
  };

  openSheet({
    key: 'save-conflict',
    title: '⚖️ Choose a save',
    sub: 'Compare both Hollows before anything changes.',
    body: `<div data-save-conflict>${saveConflictBody(comparison, source)}</div>`,
    onClose: () => finish(false),
    onMount: (root, close) => {
      sheetRoot = root;
      closeSheet = close;
      root.querySelector('[data-save-conflict-keep]').addEventListener('click', () => choose('keep'));
      root.querySelector('[data-save-conflict-use]').addEventListener('click', () => choose('replace'));
      root.querySelector('[data-save-conflict-merge]').addEventListener('click', () => choose('merge'));
    },
  });
  return choice;
}

if (typeof globalThis !== 'undefined') {
  globalThis.openSaveConflictChooser = openSaveConflictChooser;
  globalThis.installConflictSave = installConflictSave;
}
