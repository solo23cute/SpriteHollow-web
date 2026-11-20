/* Hollow Health: one place to see whether the save on this device is readable,
   make a restore point, roll back to an earlier copy, and inspect anything that
   was quarantined. The normal panel reads and writes only through SaveIntegrity;
   the boot recovery screen is the one place that deliberately replaces or
   clears the live key, and only after the player chooses Restore or Start over. */

function healthBytes(bytes) {
  const n = Math.max(0, Number(bytes) || 0);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function healthWhen(at) {
  const when = Number(at) || 0;
  if (!when) return 'unknown time';
  const diff = Date.now() - when;
  if (diff < 0) return new Date(when).toLocaleString();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(when).toLocaleDateString();
}

function healthSummary(entry) {
  if (!entry) return 'empty';
  if (!entry.ok) return `unreadable · ${entry.status}`;
  const bits = [`${entry.sprites} sprite${entry.sprites === 1 ? '' : 's'}`];
  if (entry.eggs) bits.push(`${entry.eggs} egg${entry.eggs === 1 ? '' : 's'}`);
  if (entry.hollowName) bits.push(esc(entry.hollowName));
  bits.push(`${entry.coins} coins`);
  return bits.join(' · ');
}

function healthStatusLine(lastLoad) {
  if (!lastLoad) return { tone: 'ok', text: 'No load recorded yet on this device.' };
  if (lastLoad.status === 'needs-recovery') {
    return { tone: 'bad', text: `The live save could not be read (${esc(lastLoad.message || 'damaged')}). It is waiting for recovery.` };
  }
  const blocked = typeof SaveIntegrity !== 'undefined' ? SaveIntegrity.blockedState(lastLoad) : null;
  if (blocked) return { tone: 'bad', text: `${esc(blocked.title)}: ${esc(blocked.message)}` };
  return { tone: 'ok', text: 'The live save read back cleanly.' };
}

function healthRows(list, kind) {
  if (!list.length) {
    return `<p class="tiny muted" style="margin:4px 2px 0;line-height:1.5">${kind === 'quarantine'
      ? 'Nothing has been quarantined. A damaged save would be kept here instead of being erased.'
      : 'Nothing here yet.'}</p>`;
  }
  return `<div class="health-list">${list.map((entry) => `
    <div class="health-row">
      <div class="health-row-main">
        <b>${healthWhen(entry.at)}</b>
        <span class="tiny muted">${healthSummary(entry)}</span>
        <span class="tiny muted">${healthBytes(entry.bytes)}${entry.label ? ` · ${esc(entry.label)}` : ''}${entry.reason && kind === 'quarantine' ? ` · ${esc(entry.reason)}` : ''}</span>
      </div>
      ${kind === 'quarantine'
        ? `<span class="chip health-chip">kept</span>`
        : `<div class="health-row-actions">
            <button class="btn btn-soft btn-sm" data-health-restore="${esc(entry.key)}">Restore</button>
            ${kind === 'restore' ? `<button class="btn btn-ghost btn-sm" data-health-forget="${esc(entry.key)}" aria-label="Delete restore point">✕</button>` : ''}
          </div>`}
    </div>`).join('')}</div>`;
}

function openHollowHealth() {
  if (typeof SaveIntegrity === 'undefined') {
    toast('Save recovery is not available in this build.', '⚠️');
    return;
  }
  const sheet = openSheet({
    key: 'hollow-health',
    title: '🩺 Hollow Health',
    sub: 'Every copy here lives on this device, beside your save.',
    body: '<div data-health-body></div>',
    onMount: (overlay, close) => {
      const body = overlay.querySelector('[data-health-body]');

      const paint = () => {
        const info = SaveIntegrity.health();
        const last = info.lastLoad;
        const status = healthStatusLine(last);
        const handoff = typeof SaveHandoff !== 'undefined' ? SaveHandoff.read() : null;
        body.innerHTML = `
          <div class="card health-status ${status.tone}" style="padding:12px">
            <div class="between"><b>${status.tone === 'ok' ? 'Save looks healthy' : 'Needs attention'}</b>
              <span class="chip health-chip">v${SaveIntegrity.VERSION}</span></div>
            <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">${status.text}</p>
            ${last && last.at ? `<p class="tiny muted" style="margin:4px 0 0">Last checked ${healthWhen(last.at)}</p>` : ''}
          </div>

          <div class="health-stats">
            <div><b>${healthBytes(info.saveBytes)}</b><span>live save</span></div>
            <div><b>${info.backups.length + info.restorePoints.length}</b><span>copies kept</span></div>
            <div><b>${healthBytes(info.bytes)}</b><span>Hollow data</span></div>
          </div>

          <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">
            <button class="btn btn-primary btn-sm" data-health-point>Save a restore point</button>
            <button class="btn btn-soft btn-sm" data-health-codes>Save &amp; restore codes</button>
            <button class="btn btn-soft btn-sm" data-health-handoff>📲 New phone</button>
            ${info.bytes > 3 * 1024 * 1024 ? '<button class="btn btn-ghost btn-sm" data-health-room>Free space</button>' : ''}
          </div>
          <p class="tiny muted" style="margin:8px 2px 0;line-height:1.5">A restore point is a copy you make now. Backups rotate automatically every few minutes as you play, and the three newest are kept.</p>
          <p class="tiny muted" style="margin:6px 2px 0;line-height:1.5">${handoff && handoff.lastExportAt
            ? `Last save copy sent ${healthWhen(handoff.lastExportAt)}.`
            : 'No save copy has left this device yet. A new-phone handoff is the copy that survives a lost, wiped or replaced phone.'}</p>

          <div class="section-title health-section"><h2>Restore points</h2><span>${info.restorePoints.length} of ${SaveIntegrity.RESTORE_LIMIT}</span></div>
          ${healthRows(info.restorePoints, 'restore')}

          <div class="section-title health-section"><h2>Automatic backups</h2><span>${info.backups.length} of ${SaveIntegrity.RING_SIZE}</span></div>
          ${healthRows(info.backups, 'backup')}

          <div class="section-title health-section"><h2>Quarantined</h2><span>damaged saves are kept, not erased</span></div>
          ${healthRows(info.quarantine, 'quarantine')}

          <p class="tiny muted" style="margin:14px 2px 0;line-height:1.5">Save slots and save codes work as before. Restoring here never touches the other slots on this device.</p>`;
      };

      const restoreFrom = async (key) => {
        let raw = null;
        try {
          raw = typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.readCopy === 'function'
            ? SaveIntegrity.readCopy(key)
            : localStorage.getItem(key);
        } catch (err) { raw = null; }
        let check = null;
        try {
          check = raw && typeof SaveSchema !== 'undefined' ? SaveSchema.parse(raw) : null;
        } catch (err) {
          check = null;
        }
        if (!check || !check.ok) {
          toast('That copy cannot be read, so it was left alone.', '⚠️');
          return;
        }
        const sprites = Array.isArray(check.save.sprites) ? check.save.sprites.length : 0;
        const ok = await confirmModal(
          'Restore this copy?',
          `This replaces the Hollow on this device with ${sprites} sprite${sprites === 1 ? '' : 's'} and ${Number(check.save.coins) || 0} coins. The Hollow here now is saved as a restore point first.`,
          'Restore this copy',
          { danger: true }
        );
        if (!ok) return;
        try {
          const current = typeof state !== 'undefined' ? saveStorageString(state) : localStorage.getItem(SaveIntegrity.SAVE_KEY);
          if (current && !SaveIntegrity.createRestorePoint(current, 'before restore')) {
            toast('Could not keep a copy of the current Hollow, so it was not replaced.', '⚠️');
            return;
          }
          if (typeof SaveJournal !== 'undefined') SaveJournal.abort();
          localStorage.setItem(SaveIntegrity.SAVE_KEY, raw);
        } catch (err) {
          toast('This device could not store that copy.', '⚠️');
          return;
        }
        if (typeof lockSaves === 'function') lockSaves();
        toast('Copy restored. Waking the Hollow…', '💾');
        setTimeout(() => location.reload(), 320);
      };

      /* The sheet stops clicks from reaching the overlay, so delegate on the
         body that survives every repaint. */
      body.addEventListener('click', (event) => {
        const restore = event.target.closest('[data-health-restore]');
        if (restore) { restoreFrom(restore.dataset.healthRestore); return; }
        const forget = event.target.closest('[data-health-forget]');
        if (forget) {
          SaveIntegrity.deleteRestorePoint(forget.dataset.healthForget);
          toast('Restore point deleted.', '🗑️');
          paint();
          return;
        }
        if (event.target.closest('[data-health-point]')) {
          const raw = typeof state !== 'undefined' && state.started ? saveStorageString(state) : null;
          const made = raw ? SaveIntegrity.createRestorePoint(raw, 'manual') : null;
          toast(made ? `Restore point saved · ${healthWhen(made.at)}` : 'There is no save to copy yet.', made ? '🩺' : '⚠️');
          paint();
          return;
        }
        if (event.target.closest('[data-health-codes]')) {
          close();
          if (typeof openSaveBackup === 'function') setTimeout(() => openSaveBackup(), 160);
          return;
        }
        if (event.target.closest('[data-health-handoff]')) {
          close();
          if (typeof openSaveHandoff === 'function') setTimeout(() => openSaveHandoff({ mode: 'send' }), 160);
          return;
        }
        if (event.target.closest('[data-health-room]')) {
          let freed = 0;
          while (freed < 4 && SaveIntegrity.makeRoom()) freed += 1;
          toast(freed ? 'Old recovery copies cleared.' : 'Nothing left to clear.', freed ? '🧹' : '⚠️');
          paint();
        }
      });

      paint();
    },
  });
  return sheet;
}

/* The boot-time recovery screen.

   It is deliberately not a sheet over the game: boot has not rendered the shell
   and must not run its first save. The damaged bytes stay untouched until the
   player chooses Restore or Start over; Retry only re-inspects the same live
   key, and Download works without changing it. */
function recoveryReadableCopy() {
  if (typeof SaveIntegrity === 'undefined') return null;
  const candidates = [];

  const recovered = SaveIntegrity.recover();
  if (recovered && recovered.raw) candidates.push(recovered);

  /* A missing live save is often a failed slot switch. Only the active slot
     belongs to the live Hollow; inactive slots are deliberately left alone
     so Start over cannot bounce back into recovery from an unrelated slot. */
  const active = typeof activeSaveSlot === 'function' ? activeSaveSlot() : 0;
  if (active) {
    const index = active;
    const slotKey = typeof saveSlotKey === 'function' ? saveSlotKey(index) : `sprite-hollow.slot.${index}`;
    let raw = null;
    try { raw = localStorage.getItem(slotKey); } catch (err) { raw = null; }
    if (raw) {
      const info = SaveIntegrity.describe(raw);
      if (info.ok) {
        candidates.push({
          source: 'active-slot',
          key: slotKey,
          at: Number(info.savedAt) || 0,
          raw,
          info,
        });
      }
    }
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const byTime = (Number(b.at) || 0) - (Number(a.at) || 0);
    if (byTime) return byTime;
    if (a.source === 'active-slot' && b.source !== 'active-slot') return -1;
    if (b.source === 'active-slot' && a.source !== 'active-slot') return 1;
    return 0;
  });
  return candidates[0];
}

function downloadRecoveryBundle(inspection, copy) {
  const lines = [
    'Sprite Hollow save recovery',
    `Saved ${new Date().toISOString()}`,
    `Reason: ${inspection.status}${inspection.message ? ` — ${inspection.message}` : ''}`,
    '',
    '--- damaged live save ---',
    inspection.raw || '(empty)',
  ];
  if (copy && copy.raw) {
    lines.push('', `--- newest readable copy (${copy.source}) ---`, copy.raw);
  }
  const text = lines.join('\n');
  const stamp = new Date().toISOString().slice(0, 10);
  try {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `sprite-hollow-recovery-${stamp}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (err) {
    console.warn('Could not offer the recovery file.', err);
    return false;
  }
}

function showSaveRecovery(initialInspection) {
  if (typeof document === 'undefined') return;
  const app = document.getElementById('app');
  if (!app) return;
  if (typeof lockSaves === 'function') lockSaves();

  let inspection = initialInspection;
  let copy = recoveryReadableCopy();
  let quarantined = false;
  if (typeof SaveIntegrity !== 'undefined' && inspection.raw && inspection.status !== 'journal-unresolved') {
    quarantined = !!SaveIntegrity.quarantine(inspection.raw, inspection.status);
    SaveIntegrity.setLastLoad({
      status: 'needs-recovery',
      message: inspection.message || inspection.status,
      warnings: inspection.warnings || [],
    });
  }

  const root = document.createElement('div');
  root.className = 'save-recovery';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'save-recovery-title');
  root.setAttribute('data-save-recovery', '1');
  app.innerHTML = '';
  app.appendChild(root);
  document.documentElement.setAttribute('data-save-recovery', '1');

  const paint = () => {
    const copyInfo = copy && copy.info;
    const storageBlocked = inspection.status === 'storage-unavailable';
    root.innerHTML = `
      <div class="save-recovery-card">
        <div class="save-recovery-mark" aria-hidden="true">🩺</div>
        <p class="save-recovery-kicker">HOLLOW HEALTH</p>
        <h1 id="save-recovery-title">Your Hollow needs a hand</h1>
        <p class="save-recovery-lede">The save on this device could not be found or read. Nothing has been overwritten.</p>

        <div class="save-recovery-reason">
          <b>${esc(storageBlocked ? 'Storage unavailable' : inspection.status === 'missing-live-save' ? 'Missing live save' : inspection.status === 'journal-unresolved' ? 'Save operation interrupted' : inspection.status)}</b>
          <span>${esc(inspection.message || 'The save could not be opened.')}</span>
        </div>

        <div class="save-recovery-copy">
          ${copyInfo
            ? `<b>Newest readable copy</b><span>${healthSummary(copyInfo)} · ${healthWhen(copy.at)}</span>`
            : '<b>No readable backup yet</b><span>Download the damaged save before starting over.</span>'}
        </div>

        <div class="save-recovery-actions">
          <button class="btn btn-soft" type="button" data-recovery-retry data-health-retry>Retry</button>
          <button class="btn btn-primary" type="button" data-recovery-restore data-health-restore${copy && !storageBlocked ? '' : ' disabled'}>Restore last good copy</button>
          <button class="btn btn-soft" type="button" data-recovery-download data-health-download${(inspection.raw || copy) && !storageBlocked ? '' : ' disabled'}>Download save</button>
          <button class="btn btn-ghost" type="button" data-recovery-start-over data-health-start-over${storageBlocked ? ' disabled' : ''}>Start over</button>
          <button class="btn btn-ghost" type="button" data-recovery-diagnostics style="grid-column:1/-1">Download diagnostics</button>
        </div>

        <p class="save-recovery-note">${storageBlocked
          ? 'This browser is blocking access to its storage, so nothing can be read or written. Allow site storage, then choose Retry. Your save has not been touched.'
          : inspection.status === 'missing-live-save' && copy
            ? 'The live save is gone, but a readable copy is still on this device. Restoring it keeps the damaged or missing live slot from turning into a fresh Hollow.'
          : inspection.status === 'missing-live-save'
            ? 'The live save is gone and no readable copy could be opened. Starting over keeps the inactive save slots on this device untouched.'
          : quarantined
            ? 'A copy of the damaged save is kept in Hollow Health. Save slots and cloud copies were not touched.'
            : 'The damaged save could not be copied to Hollow Health. Download it now if you want to keep it.'}</p>
        <p class="save-recovery-version">Sprite Hollow v${esc(typeof APP_VERSION !== 'undefined' ? APP_VERSION : '')}</p>
      </div>`;

    root.querySelector('[data-recovery-retry]').addEventListener('click', () => {
      const checked = typeof inspectStoredSave === 'function' ? inspectStoredSave() : null;
      if (!checked) return;
      if (checked.ok) {
        /* Retry found a readable save, so hand control back to the normal boot
           path. The page reload is intentional: state was never hydrated from
           the damaged bytes. */
        location.reload();
        return;
      }
      inspection = checked;
      copy = recoveryReadableCopy();
      paint();
    });

    root.querySelector('[data-recovery-restore]').addEventListener('click', async () => {
      if (!copy) return;
      const info = copy.info || {};
      const sure = await confirmModal(
        'Restore this copy?',
        `This replaces the unreadable save with ${Number(info.sprites) || 0} sprite${Number(info.sprites) === 1 ? '' : 's'} and ${Number(info.coins) || 0} coins. The damaged save is kept in Hollow Health first.`,
        'Restore this copy',
        { danger: true }
      );
      if (!sure) return;
      if (!quarantined && inspection.raw) {
        quarantined = !!SaveIntegrity.quarantine(inspection.raw, inspection.status);
      }
      try {
        if (typeof SaveJournal !== 'undefined') SaveJournal.abort();
        localStorage.setItem(SaveIntegrity.SAVE_KEY, copy.raw);
      } catch (err) {
        console.error(err);
        inspection = Object.assign({}, inspection, {
          status: 'write-failed',
          message: 'This device could not store the readable copy.',
        });
        paint();
        return;
      }
      if (typeof lockSaves === 'function') lockSaves();
      location.reload();
    });

    root.querySelector('[data-recovery-download]').addEventListener('click', () => {
      if (!downloadRecoveryBundle(inspection, copy)) {
        inspection = Object.assign({}, inspection, { message: 'This device could not offer the recovery file. Copy the code from Hollow Health instead.' });
        paint();
      }
    });

    root.querySelector('[data-recovery-diagnostics]').addEventListener('click', () => {
      if (typeof Diagnostics === 'undefined' || typeof Diagnostics.download !== 'function') {
        if (typeof toast === 'function') toast('Diagnostics are not available in this build.', '⚠️');
        return;
      }
      const ok = Diagnostics.download();
      if (typeof toast === 'function') toast(ok ? 'Diagnostics file downloaded.' : 'This device could not save the diagnostics file.', ok ? '🧰' : '⚠️');
    });

    root.querySelector('[data-recovery-start-over]').addEventListener('click', async () => {
      const sure = await confirmModal(
        'Start over?',
        'This begins a brand-new Hollow. The damaged save stays in Hollow Health, and your other save slots and cloud copies are not changed.',
        'Start over',
        { danger: true }
      );
      if (!sure) return;
      if (inspection.raw && !quarantined && typeof SaveIntegrity !== 'undefined') {
        SaveIntegrity.quarantine(inspection.raw, `start-over:${inspection.status}`);
      }
      try {
        const liveKey = typeof SaveIntegrity !== 'undefined' ? SaveIntegrity.SAVE_KEY : SAVE_KEY;
        /* Write the fresh envelope rather than leaving a missing live key.
           Otherwise the backup ring or the active slot would reopen recovery
           on the next boot and Start over could never finish. */
        const fresh = typeof freshState === 'function' ? freshState() : null;
        if (typeof SaveJournal !== 'undefined') SaveJournal.abort();
        if (fresh) localStorage.setItem(liveKey, saveStorageString(fresh));
        else localStorage.removeItem(liveKey);
        /* Do not make the first fresh autosave mirror over the slot that held
           the damaged Hollow. The slot itself is left intact for later. */
        localStorage.removeItem('sprite-hollow.slot.active');
      } catch (err) {
        console.error('Could not write the fresh Hollow save', err);
        inspection = Object.assign({}, inspection, {
          status: 'write-failed',
          message: 'This device could not write a fresh Hollow. The damaged save is still untouched.',
        });
        paint();
        return;
      }
      if (typeof lockSaves === 'function') lockSaves();
      location.reload();
    });
  };

  paint();
}
