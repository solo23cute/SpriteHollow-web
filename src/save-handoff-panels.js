/* New-phone handoff panels: one sheet with two steps, plus the small reminder
   card in the Hollow.

   Step 1 (this phone) hands the existing save code to the share sheet, the
   clipboard or a file. Step 2 (new phone) reads a code, shows a compact
   preview of exactly what would arrive, and then defers to the existing save
   comparison for the final restore. No sheet writes a save on its own. */

function handoffWhen(at) {
  const when = Number(at) || 0;
  if (!when) return 'time not recorded';
  const date = new Date(when);
  if (Number.isNaN(date.getTime())) return 'time not recorded';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function handoffSize(text) {
  const kb = Math.max(1, Math.round(String(text || '').length / 1024));
  return `${kb} KB`;
}

function handoffCount(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function handoffPreviewHTML(view) {
  if (!view) return '';
  return `<div class="handoff-preview">
    <div class="between">
      <b>${esc(view.hollowName)}</b>
      <span class="chip">${view.coins.toLocaleString()} coins</span>
    </div>
    <div class="handoff-facts">
      <div><b>${view.sprites}</b><span>sprites</span></div>
      <div><b>${view.eggs}</b><span>eggs</span></div>
      <div><b>${view.grown}</b><span>grown</span></div>
      <div><b>${view.species}</b><span>species</span></div>
    </div>
    <p class="tiny muted" style="margin:8px 0 0;line-height:1.45">Saved ${esc(handoffWhen(view.savedAt))}${view.version ? ` · save version ${view.version}` : ''}.</p>
  </div>`;
}

function handoffSendHTML() {
  return `
    <div class="card handoff-step" style="padding:12px">
      <b>Send from this phone</b>
      <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">One tap hands your whole Hollow to your phone's share sheet: messages, notes, a file app, or a nearby device. Nothing is uploaded and no account is needed.</p>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-primary btn-sm" type="button" data-handoff-send>Send in one tap</button>
        <button class="btn btn-soft btn-sm" type="button" data-handoff-copy>Copy code</button>
        <button class="btn btn-ghost btn-sm" type="button" data-handoff-download>Save a file</button>
      </div>
      <p class="tiny muted" data-handoff-size style="margin:8px 2px 0">Packing this phone's save…</p>
      <p class="tiny muted" data-handoff-qr style="margin:6px 2px 0;line-height:1.5">Not a QR square: a save code is far larger than one QR picture can hold, and a QR swap would need a server in the middle. The share sheet and clipboard stay between your two phones.</p>
      <p class="tiny muted" data-handoff-note style="margin:6px 2px 0;line-height:1.5"></p>
      <details class="handoff-code-wrap" style="margin-top:8px">
        <summary class="tiny muted" style="cursor:pointer">Show the raw code</summary>
        <textarea data-handoff-code readonly aria-label="Your save code" placeholder="Packing your save code…" style="width:100%;min-height:84px;margin-top:6px;padding:10px 12px;border-radius:13px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--text);font-size:11px;line-height:1.5;word-break:break-all;resize:vertical;outline:none"></textarea>
      </details>
    </div>
    <p class="tiny muted" style="margin:10px 2px 0;line-height:1.5">Send it before the old phone is wiped, sold or lost. On the new phone, open this same screen on step 2.</p>`;
}

function handoffReceiveHTML() {
  const field = 'width:100%;min-height:84px;padding:10px 12px;border-radius:13px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--text);font-size:11px;line-height:1.5;word-break:break-all;resize:vertical;outline:none';
  return `
    <div class="card handoff-step" style="padding:12px">
      <b>Receive on this phone</b>
      <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">Paste the code your other phone sent, or open the save file it saved. You will see what arrives before anything is replaced.</p>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-soft btn-sm" type="button" data-handoff-paste>Paste from clipboard</button>
        <label class="btn btn-ghost btn-sm" style="cursor:pointer;margin:0">Open a file<input type="file" accept=".txt,.json,text/plain,application/json" data-handoff-file hidden></label>
      </div>
      <textarea data-handoff-input aria-label="Paste a save code" placeholder="Paste the save code here…" style="${field};margin-top:8px"></textarea>
      <div data-handoff-preview style="margin-top:8px"></div>
      <p class="tiny muted" data-handoff-note style="margin:8px 2px 0;line-height:1.5">Nothing has changed yet.</p>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-primary" type="button" data-handoff-restore disabled>Review &amp; restore</button>
      </div>
    </div>
    <p class="tiny muted" style="margin:10px 2px 0;line-height:1.5">Review opens the usual save comparison: keep this device, use the incoming save, or merge both. A restore point of this phone's Hollow is written first.</p>`;
}

function openSaveHandoff(options = {}) {
  if (typeof openSheet !== 'function' || typeof SaveHandoff === 'undefined') return null;
  let mode = options.mode === 'receive' ? 'receive' : 'send';
  let code = '';
  let incoming = null;
  let busy = false;

  const sheet = openSheet({
    key: 'save-handoff',
    title: '📲 New phone',
    sub: 'A local handoff: the save code only travels between your two phones.',
    body: `<div data-handoff>
      <div class="handoff-tabs" role="tablist" aria-label="Handoff step">
        <button class="handoff-tab" type="button" role="tab" data-handoff-tab="send">1 · This phone</button>
        <button class="handoff-tab" type="button" role="tab" data-handoff-tab="receive">2 · New phone</button>
      </div>
      <div data-handoff-pane></div>
    </div>`,
    onMount: (root, close) => {
      /* openSheet stops clicks at .sheet, so the delegated listeners below have
         to live inside it; the pane itself is replaced on every step. */
      const shell = root.querySelector('.sheet-body') || root;
      const pane = root.querySelector('[data-handoff-pane]');

      const paint = () => {
        root.querySelectorAll('[data-handoff-tab]').forEach((tab) => {
          const on = tab.dataset.handoffTab === mode;
          tab.classList.toggle('is-on', on);
          tab.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        pane.innerHTML = mode === 'send' ? handoffSendHTML() : handoffReceiveHTML();
        if (mode === 'send' && code) {
          const field = pane.querySelector('[data-handoff-code]');
          if (field) field.value = code;
          const size = pane.querySelector('[data-handoff-size]');
          if (size) size.textContent = `${handoffSize(code)} · carries every sprite, egg, coin and unlock`;
        } else if (mode === 'receive' && incoming) {
          paintIncoming(incoming.view, incoming.save);
        }
      };

      const paintIncoming = (view, save) => {
        pane.querySelector('[data-handoff-preview]').innerHTML = view
          ? handoffPreviewHTML(view)
          : '<p class="tiny muted" style="margin:0">Nothing has changed yet.</p>';
        const note = pane.querySelector('[data-handoff-note]');
        const button = pane.querySelector('[data-handoff-restore]');
        incoming = view ? { view, save } : null;
        if (button) button.disabled = !incoming;
        if (note && view) {
          note.textContent = `${handoffCount(view.sprites, 'sprite', 'sprites')} ready to review. Restoring replaces this phone's Hollow after a restore point is made.`;
        }
      };

      const failPreview = (message) => {
        incoming = null;
        const box = pane.querySelector('[data-handoff-preview]');
        if (box) box.innerHTML = '';
        const note = pane.querySelector('[data-handoff-note]');
        if (note) note.textContent = message;
        const button = pane.querySelector('[data-handoff-restore]');
        if (button) button.disabled = true;
      };

      const readCode = async (text) => {
        const result = await SaveHandoff.previewFromCode(text);
        if (!result.ok) {
          failPreview(result.error);
          toast(result.error, '⚠️');
          return false;
        }
        incoming = { view: result.preview, save: result.save };
        paintIncoming(result.preview, result.save);
        return true;
      };

      const sendNow = async () => {
        if (busy) return;
        if (!code) {
          toast('The save code is still packing. Try again in a moment.', '⏳');
          return;
        }
        busy = true;
        try {
          if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
              await navigator.share({ title: 'Sprite Hollow save', text: code });
              SaveHandoff.recordExport();
              toast('Save code sent. Open it on the new phone.', '📲');
              return;
            } catch (err) {
              if (err && err.name === 'AbortError') return;
              console.warn('Share sheet refused, copying instead.', err);
            }
          }
          const copied = await copyToClipboard(code);
          if (copied || copyFromField(pane.querySelector('[data-handoff-code]'))) {
            SaveHandoff.recordExport();
            toast('Save code copied. Paste it on the new phone.', '📋');
          } else {
            toast('Open "Show the raw code", select it and copy by hand.', '📋');
          }
        } finally {
          busy = false;
        }
      };

      const copyNow = async () => {
        if (!code) return;
        const copied = await copyToClipboard(code);
        if (copied || copyFromField(pane.querySelector('[data-handoff-code]'))) {
          SaveHandoff.recordExport();
          toast('Save code copied.', '📋');
        } else {
          toast('Open "Show the raw code", select it and copy by hand.', '📋');
        }
      };

      const pasteNow = async () => {
        const field = pane.querySelector('[data-handoff-input]');
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
              if (field) field.value = text;
              await readCode(text);
              return;
            }
          }
        } catch (err) {
          console.warn('Clipboard read refused, using the paste box instead.', err);
        }
        if (field) field.focus();
        toast('Paste into the box with a long-press, then review.', '📋');
      };

      const restoreNow = async () => {
        if (!incoming || busy) return;
        busy = true;
        const picked = incoming.save;
        close();
        try {
          const applied = await applySaveCode(picked, { source: 'new phone handoff' });
          if (applied) SaveHandoff.recordRestore();
        } finally {
          busy = false;
        }
      };

      shell.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const tab = target.closest('[data-handoff-tab]');
        if (tab) {
          mode = tab.dataset.handoffTab === 'receive' ? 'receive' : 'send';
          paint();
          return;
        }
        if (target.closest('[data-handoff-send]')) { sendNow(); return; }
        if (target.closest('[data-handoff-copy]')) { copyNow(); return; }
        if (target.closest('[data-handoff-download]')) {
          if (!code) return;
          if (downloadSaveCode(code)) toast('Save file ready to share.', '💾');
          else toast('This device will not save files. Use Copy code instead.', '⚠️');
          return;
        }
        if (target.closest('[data-handoff-paste]')) { pasteNow(); return; }
        if (target.closest('[data-handoff-restore]')) { restoreNow(); }
      });

      shell.addEventListener('input', (event) => {
        const field = event.target;
        if (!field || !field.matches || !field.matches('[data-handoff-input]')) return;
        const text = field.value.trim();
        if (!text) { failPreview('Nothing has changed yet.'); return; }
        /* Paste into the box is a preview, not a restore: the player still has
           to read the card and press the button. */
        readCode(text);
      });

      shell.addEventListener('change', async (event) => {
        const field = event.target;
        if (!field || !field.matches || !field.matches('[data-handoff-file]')) return;
        const file = field.files && field.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const box = pane.querySelector('[data-handoff-input]');
          if (box) box.value = text;
          await readCode(text);
        } catch (err) {
          failPreview((err && err.message) || 'That file could not be read.');
        } finally {
          field.value = '';
        }
      });

      paint();
      buildSaveCode().then((text) => {
        code = text;
        if (mode === 'send') {
          const field = pane.querySelector('[data-handoff-code]');
          const size = pane.querySelector('[data-handoff-size]');
          if (field) field.value = text;
          if (size) size.textContent = `${handoffSize(text)} · carries every sprite, egg, coin and unlock`;
        }
      }).catch((err) => {
        console.error(err);
        const size = pane.querySelector('[data-handoff-size]');
        if (size) size.textContent = 'This device could not pack a save code. Reload the app and try again.';
      });
    },
  });
  return sheet;
}

function handoffNudgeHTML(note) {
  return `<div class="flight-card handoff-card">
    <div class="between">
      <span class="flight-eyebrow">📲 New phone</span>
      <button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:10px" type="button" data-handoff-later>Not now</button>
    </div>
    <b class="flight-title">${esc(note.headline)}</b>
    <p class="flight-blurb">${esc(note.blurb)}</p>
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:2px">
      <button class="btn btn-soft btn-sm" type="button" data-handoff-open>Send this Hollow</button>
    </div>
  </div>`;
}

/* Mounts into a [data-handoff-nudge] host on the Hollow. Delegated once so a
   repaint never stacks handlers. */
function mountHandoffNudge(root) {
  const host = root ? root.querySelector('[data-handoff-nudge]') : null;
  if (!host || typeof SaveHandoff === 'undefined') return () => {};

  const paint = () => {
    const note = SaveHandoff.noteFor(typeof state !== 'undefined' ? state : null);
    host.innerHTML = note && note.due ? handoffNudgeHTML(note) : '';
  };

  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('[data-handoff-open]')) {
      if (typeof Sfx !== 'undefined') Sfx.click();
      openSaveHandoff({ mode: 'send' });
      return;
    }
    if (target.closest('[data-handoff-later]')) {
      SaveHandoff.dismiss();
      toast('Backup reminder put away for two weeks.', '📲');
      App.refresh();
    }
  };

  host.addEventListener('click', onClick);
  paint();
  const unsubscribe = typeof subscribeState === 'function' ? subscribeState(paint) : () => {};

  return () => {
    host.removeEventListener('click', onClick);
    unsubscribe();
  };
}
