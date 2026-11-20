/* Shared UI: icons, sheets, modals, toasts, particles. */

const ICONS = {
  hollow: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h5v-5h3v5h5v-9.5"/>',
  sprites: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  types: '<path d="M12 6.5C10.3 5.2 8 4.5 5 4.5v13c3 0 5.3.7 7 2 1.7-1.3 4-2 7-2v-13c-3 0-5.3.7-7 2Z" stroke-linejoin="round"/><path d="M12 6.5v13" stroke-linecap="round"/>',
  nest: '<path d="M12 3c4.2 0 7 4.4 7 9.2C19 17 16 20 12 20s-7-3-7-7.8C5 7.4 7.8 3 12 3Z"/><path d="M9 12.5c1.6 1.5 4.4 1.5 6 0" stroke-linecap="round"/>',
  play: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M8 11v3M6.5 12.5h3" stroke-linecap="round"/><circle cx="16" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="18" cy="13.8" r="1.1" fill="currentColor" stroke="none"/>',
  today: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m8.5 15 2.3 2.3 4.5-4.4" stroke-linecap="round" stroke-linejoin="round"/>',
  palette: '<path d="M12 3c5 0 9 3.6 9 8 0 2.8-2.2 4-4 4h-1.6c-1 0-1.7.7-1.7 1.6 0 .5.2.9.5 1.3.3.4.4.8.4 1.2 0 .5-.4.9-1.4.9-5.2 0-9.2-4-9.2-9S7 3 12 3Z"/><circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9" r="1" fill="currentColor" stroke="none"/>',
  settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9" stroke-linecap="round"/><circle cx="15" cy="7" r="2.4"/><circle cx="9" cy="17" r="2.4"/>',
  coin: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6v8.8M14.6 9.4c0-1-1.2-1.7-2.6-1.7-1.6 0-2.6.8-2.6 1.9 0 2.7 5.2 1.4 5.2 4 0 1.1-1.1 1.9-2.6 1.9-1.5 0-2.6-.7-2.6-1.8" stroke-linecap="round"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-9.4C4.5 7.4 6.7 5 9.6 5c1.7 0 3 .9 2.4 2 .6-1.1 1.7-2 3.4-2 2.9 0 5.1 2.4 5.1 5.6C20.5 15.4 12 20 12 20Z"/>',
  food: '<path d="M6 3.5v7.2c0 1.7 1.1 2.8 2.5 2.8v6.8M8.5 3.5v6M11 3.5v6"/><path d="M17.5 3.5c-2 0-3.5 2.5-3.5 5.5s1.5 4 3.5 4 3.5-1 3.5-4-1.5-5.5-3.5-5.5ZM17.5 13v7.5" stroke-linecap="round"/>',
  bath: '<path d="M4 13h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z"/><path d="M6.5 13V6.2A2.2 2.2 0 0 1 8.7 4c1.2 0 2 .7 2.4 1.8M8 17.5v2M16 17.5v2" stroke-linecap="round"/><circle cx="9" cy="9.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14" cy="8" r="1.6" fill="currentColor" stroke="none"/>',
  moon: '<path d="M20 14.3A8.4 8.4 0 0 1 9.7 4 8.5 8.5 0 1 0 20 14.3Z"/>',
  chat: '<path d="M20.5 11.8c0 4-3.8 7.2-8.5 7.2-1 0-2-.2-2.9-.5L4 20.5l1.4-4A6.7 6.7 0 0 1 3.5 11.8C3.5 7.9 7.3 4.6 12 4.6s8.5 3.3 8.5 7.2Z"/>',
  send: '<path d="M21 3 10.5 13.5M21 3l-6.6 18-3.9-7.5L3 9.6 21 3Z" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke-linecap="round"/>',
  chevron: '<path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>',
  dna: '<path d="M7 3c0 5 10 5 10 9S7 16 7 21M17 3c0 5-10 5-10 9s10 5 10 9" stroke-linecap="round"/><path d="M8.6 7h6.8M9 17h6.5M9.4 12h5.2" stroke-linecap="round"/>',
  star: '<path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.3l6-.8L12 3Z" stroke-linejoin="round"/>',
  sparkle: '<path d="m12 3 1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" stroke-linejoin="round"/>',
  arrow: '<path d="M19 12H5m6-6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.6 6M20 4.5V11h-6.2" stroke-linecap="round" stroke-linejoin="round"/>',
  sound: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" stroke-linejoin="round"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.4 8.4 0 0 1 0 12" stroke-linecap="round"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10" rx="3"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 13h9l1-13M10 11v5M14 11v5" stroke-linecap="round" stroke-linejoin="round"/>',
  pencil: '<path d="M4 20h4.2L20 8.2 15.8 4 4 15.8V20Z" stroke-linejoin="round"/><path d="m14.2 5.6 4.2 4.2" stroke-linecap="round"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="3"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" stroke-linecap="round"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.3" fill="currentColor" stroke="none"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/>',
};

function icon(name, cls = '') {
  const path = ICONS[name] || ICONS.sparkle;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${path}</svg>`;
}

function portalRoot() {
  return document.getElementById('portal');
}

function ensureToastWrap() {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.getElementById('app').appendChild(wrap);
  }
  return wrap;
}

function toast(message, emoji = '✨') {
  const wrap = ensureToastWrap();
  while (wrap.children.length >= 3) wrap.firstElementChild.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  // Messages often include player-chosen names (sprites, outfits), so escape them.
  el.innerHTML = `<span class="t-ico">${esc(emoji)}</span><span>${esc(message)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 2200);
}

/* A blocked save is a session state, not a transient toast: keep it visible
   until a real write succeeds, even if the save itself cannot be persisted. */
function refreshSaveBlockedNotice() {
  const host = document.getElementById('app');
  if (!host) return;
  const info = currentSaveBlocked();
  let notice = document.getElementById('save-blocked-notice');
  if (!info) {
    if (notice) notice.remove();
    return;
  }
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'save-blocked-notice';
    notice.className = 'save-blocked-notice';
    notice.setAttribute('role', 'alert');
    notice.setAttribute('aria-live', 'assertive');
    notice.setAttribute('data-save-blocked', '');
    notice.innerHTML = `<div class="save-blocked-copy"><b data-save-blocked-title></b><span data-save-blocked-message></span></div>
      <button class="btn btn-soft btn-sm" type="button" data-save-blocked-health>Open Hollow Health</button>`;
    notice.querySelector('[data-save-blocked-health]').addEventListener('click', () => {
      if (typeof openHollowHealth === 'function') openHollowHealth();
    });
    host.appendChild(notice);
  }
  const title = notice.querySelector('[data-save-blocked-title]');
  const message = notice.querySelector('[data-save-blocked-message]');
  if (title) title.textContent = info.title || 'Saving is blocked';
  if (message) message.textContent = info.message || 'Your latest changes are not saved.';
}

/* A toast with one action. It lives in the portal above sheets and modals,
   so an undo remains tappable even when the purchase opened the hatch flow. */
function toastAction(message, emoji, actionLabel, onAction, { duration = 8000 } = {}) {
  const wrap = (() => {
    let el = document.getElementById('toast-action-wrap');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-action-wrap';
      el.className = 'toast-action-wrap';
      portalRoot().appendChild(el);
    }
    return el;
  })();
  while (wrap.children.length >= 2) wrap.firstElementChild.remove();
  const el = document.createElement('div');
  el.className = 'toast with-action';
  el.innerHTML = `<span class="t-ico">${esc(emoji)}</span><span class="toast-action-copy">${esc(message)}</span><button class="toast-action" type="button" data-toast-action>${esc(actionLabel)}</button>`;
  const remove = () => {
    if (!el.isConnected) return;
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  };
  const timer = setTimeout(remove, duration);
  el.querySelector('[data-toast-action]').addEventListener('click', async () => {
    clearTimeout(timer);
    remove();
    try {
      if (onAction) await onAction();
    } catch (err) {
      console.error(err);
    }
  });
  wrap.appendChild(el);
  return remove;
}

const overlayStack = [];
function closeTopOverlay() {
  const el = overlayStack.pop();
  if (el) {
    if (typeof el._closeCleanup === 'function') {
      try { el._closeCleanup(); } catch (err) { console.error(err); }
    }
    el.remove();
  }
}
function closeAllOverlays() {
  while (overlayStack.length) closeTopOverlay();
}

/* A sheet can be opened from several places, so it opts into a key: opening it
   again replaces the copy already on screen instead of leaving an unreachable
   one underneath. Different sheets still stack the way the flows expect. */
function closeSheetByKey(key) {
  if (!key) return;
  for (let i = overlayStack.length - 1; i >= 0; i--) {
    const el = overlayStack[i];
    if (!el.dataset || el.dataset.sheetKey !== key) continue;
    if (typeof el._closeCleanup === 'function') {
      try { el._closeCleanup(); } catch (err) { console.error(err); }
    } else {
      el.remove();
    }
  }
}

function buildOverlay(inner, { center = false, dismissible = true, onClose, key = '' } = {}) {
  if (key) closeSheetByKey(key);
  const overlay = document.createElement('div');
  overlay.className = `overlay${center ? ' center' : ''}`;
  if (key) overlay.dataset.sheetKey = key;
  overlay.innerHTML = inner;
  portalRoot().appendChild(overlay);
  overlayStack.push(overlay);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    const idx = overlayStack.indexOf(overlay);
    if (idx >= 0) overlayStack.splice(idx, 1);
    overlay.remove();
    if (typeof onClose === 'function') {
      try { onClose(); } catch (err) { console.error(err); }
    }
  };
  overlay._closeCleanup = close;
  if (dismissible) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  }
  return { overlay, close };
}

function openSheet({ title, sub = '', body = '', onMount, dismissible = true, onClose, key = '' }) {
  const inner = `<div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <div class="between" style="align-items:flex-start">
      <div><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}</div>
      <button class="icon-btn" data-close aria-label="Close">${icon('close')}</button>
    </div>
    <div class="sheet-body">${body}</div>
  </div>`;
  const { overlay, close } = buildOverlay(inner, { dismissible, onClose, key });
  overlay.querySelector('.sheet')?.addEventListener('click', (e) => e.stopPropagation());
  if (onMount) onMount(overlay, close);
  return { overlay, close };
}

/* One virtual grid plus the status/empty plumbing shared by picker sheets.
   Callers own the count and empty copy; empty rows still go through reset so
   the grid tears down its observer and sentinels. */
function createPickerGrid({ container, options, renderItem, count, empty }) {
  const grid = new LazyGrid(container, options);
  return {
    update(rows, countText, emptyText) {
      count.textContent = countText;
      empty.hidden = rows.length > 0;
      if (!rows.length) empty.textContent = emptyText;
      container.scrollTop = 0;
      grid.reset(rows, renderItem);
    },
    clear() { grid.clear(); },
  };
}

function openModal({ title = '', sub = '', body = '', onMount, dismissible = true, onClose }) {
  const inner = `<div class="modal" onclick="event.stopPropagation()">
    <div class="between" style="align-items:flex-start;text-align:left">
      <div>${title ? `<h2>${title}</h2>` : ''}${sub ? `<p>${sub}</p>` : ''}</div>
      ${dismissible ? `<button class="icon-btn" data-close aria-label="Close">${icon('close')}</button>` : ''}
    </div>
    <div class="modal-body">${body}</div>
  </div>`;
  const { overlay, close } = buildOverlay(inner, { center: true, dismissible, onClose });
  overlay.querySelector('.modal')?.addEventListener('click', (e) => e.stopPropagation());
  if (onMount) onMount(overlay, close);
  return { overlay, close };
}

function confirmModal(title, body, confirmLabel = 'Confirm', { danger = false, cancelLabel = 'Not now' } = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const { close } = openModal({
      title,
      body: `<p>${body}</p><div class="actions" style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-ghost" data-no>${cancelLabel}</button>
        <button class="btn ${danger ? 'btn-primary' : 'btn-gold'}" data-yes>${confirmLabel}</button></div>`,
      onMount: (root) => {
        root.querySelector('[data-no]').onclick = () => { finish(false); close(); };
        root.querySelector('[data-yes]').onclick = () => { finish(true); close(); };
      },
      onClose: () => finish(false),
    });
  });
}

function burstAt(x, y, chars = ['💛'], count = 6) {
  if (document.documentElement.classList.contains('reduce-motion')) return;
  const app = document.getElementById('app');
  const rect = app.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = typeof chars === 'string' ? chars : pick(chars);
    p.style.left = `${x - rect.left + rand(-8, 8)}px`;
    p.style.top = `${y - rect.top + rand(-6, 6)}px`;
    p.style.setProperty('--dx', `${rand(-50, 50)}px`);
    p.style.setProperty('--dy', `${rand(-70, -30)}px`);
    p.style.setProperty('--rot', `${rand(-40, 40)}deg`);
    p.style.fontSize = `${rand(12, 22)}px`;
    p.style.animationDelay = `${i * 0.035}s`;
    app.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

function burstOn(el, chars = ['💛'], count = 6) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burstAt(r.left + r.width / 2, r.top + r.height / 2, chars, count);
}

/* A fluffy coat sheds a puff of soft motes when it is rubbed, fed or bathed. */
function fluffShed(target, sprite, kind = 'rub', count = 9) {
  if (!target || document.documentElement.classList.contains('reduce-motion')) return;
  const app = document.getElementById('app');
  if (!app) return;
  const c = typeof resolvePalette === 'function' ? resolvePalette(sprite || {}) : { light: '#f4ecff', accent: '#d9c7f2' };
  const rect = target.getBoundingClientRect();
  const appRect = app.getBoundingClientRect();
  const tones = [c.light, c.accent, '#ffffff'];
  const n = kind === 'bath' ? count + 4 : count;
  for (let i = 0; i < n; i += 1) {
    const p = document.createElement('span');
    p.className = 'fluff-shed';
    p.style.left = `${rect.left - appRect.left + rand(rect.width * 0.18, rect.width * 0.82)}px`;
    p.style.top = `${rect.top - appRect.top + rand(rect.height * 0.3, rect.height * 0.72)}px`;
    p.style.width = `${rand(4, 10)}px`;
    p.style.height = p.style.width;
    p.style.background = tones[i % tones.length];
    p.style.setProperty('--dx', `${rand(-46, 46)}px`);
    p.style.setProperty('--dy', `${rand(-64, -18)}px`);
    p.style.animationDelay = `${i * 0.04}s`;
    app.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
}

/* The giant tail wags on its own; when a wag completes, a few loose puffs
   drift off it. One delegated listener covers every ultra and dream sprite,
   and Calm, hidden tabs, sleeping sprites and off-screen actors are skipped. */
function tailWagPuff(tail) {
  if (!tail || document.visibilityState === 'hidden') return;
  if (document.documentElement.classList.contains('reduce-motion')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (tail.closest('.sleeping')) return;
  const rect = tail.getBoundingClientRect();
  if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return;
  const tones = ['#f7f2ff', '#d9c7f2', '#c9f0e2', '#ffffff'];
  for (let i = 0; i < 3; i += 1) {
    const p = document.createElement('span');
    p.className = 'tail-puff';
    p.style.left = `${rect.right - rect.width * 0.3 + rand(-5, 5)}px`;
    p.style.top = `${rect.top + rect.height * 0.5 + rand(-rect.height * 0.18, rect.height * 0.18)}px`;
    p.style.width = `${rand(5, 10)}px`;
    p.style.height = p.style.width;
    p.style.background = tones[i % tones.length];
    p.style.setProperty('--dx', `${rand(14, 46)}px`);
    p.style.setProperty('--dy', `${rand(-48, -14)}px`);
    p.style.animationDelay = `${i * 0.06}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}

document.addEventListener('animationiteration', (event) => {
  if (event.animationName !== 'ultraTailWag') return;
  const target = event.target;
  const tail = target && target.closest ? target.closest('.ultra-tail') : null;
  if (tail) tailWagPuff(tail);
});

/* A small heart pops from the tail tip as the extra wag lands. */
function tailHeart(tip, sprite) {
  if (!tip || !tip.isConnected || document.visibilityState === 'hidden') return;
  if (document.documentElement.classList.contains('reduce-motion')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = tip.getBoundingClientRect();
  if (!rect.width) return;
  /* Draw the heart instead of using the pink emoji, so it can wear the
     sprite's own accent and read as part of its coat. */
  const palette = sprite && typeof resolvePalette === 'function' ? resolvePalette(sprite) : null;
  const fill = palette ? palette.accent : '#ff9ec4';
  const edge = palette ? palette.deep : '#d9648f';
  const size = rand(11, 15);
  const heart = document.createElement('span');
  heart.className = 'tail-heart';
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 21S3.5 15.6 3.5 9.7C3.5 6.4 6 4 9.1 4c1.7 0 2.9.9 2.9 2.2C12 4.9 13.2 4 14.9 4 18 4 20.5 6.4 20.5 9.7 20.5 15.6 12 21 12 21Z" fill="${fill}" stroke="${edge}" stroke-width="1.2"/><g class="tail-heart-core" transform="translate(12 12.6) scale(.5) translate(-12 -12.6)"><path d="M12 21S3.5 15.6 3.5 9.7C3.5 6.4 6 4 9.1 4c1.7 0 2.9.9 2.9 2.2C12 4.9 13.2 4 14.9 4 18 4 20.5 6.4 20.5 9.7 20.5 15.6 12 21 12 21Z" fill="#ffffff" opacity=".9"/></g><path d="M8.1 7.3c-1.3.6-2 1.8-2 3.1" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".65"/></svg>`;
  heart.style.left = `${rect.left + rect.width * 0.55}px`;
  heart.style.top = `${rect.top + rect.height * 0.42}px`;
  /* Drift toward the face, not just upward, so the heart reads as aimed at
     the sprite rather than floating off the tail. */
  const svg = tip.ownerSVGElement || (tip.closest ? tip.closest('svg') : null);
  const box = svg ? svg.getBoundingClientRect() : null;
  let dx = 6;
  let dy = -20;
  if (box && box.width) {
    const startX = rect.left + rect.width * 0.55;
    const startY = rect.top + rect.height * 0.42;
    const vx = box.left + box.width * 0.5 - startX;
    const vy = box.top + box.height * 0.42 - startY;
    const len = Math.hypot(vx, vy) || 1;
    const travel = Math.min(110, Math.max(14, len * 0.8));
    dx = (vx / len) * travel;
    dy = (vy / len) * travel;
  }
  heart.style.setProperty('--hx', `${dx.toFixed(1)}px`);
  heart.style.setProperty('--hy', `${dy.toFixed(1)}px`);
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1600);
}

/* The heart's arrival flushes both cheeks and lifts a tiny smile for a beat. */
function cheekBlush(svg) {
  if (!svg || !svg.isConnected) return;
  if (document.documentElement.classList.contains('reduce-motion')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ns = 'http://www.w3.org/2000/svg';
  /* A second pet replaces the first reaction rather than stacking faces. */
  const previous = svg.querySelector('.tail-blush');
  if (previous) previous.remove();
  clearTimeout(svg._petFaceTimer);
  const group = document.createElementNS(ns, 'g');
  group.setAttribute('class', 'tail-blush');
  group.setAttribute('pointer-events', 'none');
  [38, 82].forEach((cx) => {
    const cheek = document.createElementNS(ns, 'ellipse');
    cheek.setAttribute('cx', String(cx));
    cheek.setAttribute('cy', '72');
    cheek.setAttribute('rx', '8');
    cheek.setAttribute('ry', '4.6');
    group.appendChild(cheek);
  });
  /* The resting mouth fades out for the same beat, so the lifted smile reads
     as one expression instead of a second mouth. */
  const smile = document.createElementNS(ns, 'path');
  smile.setAttribute('class', 'tail-smile');
  smile.setAttribute('d', 'M52.5 74.5q7.5 7.5 15 0');
  group.appendChild(smile);
  svg.classList.add('is-petting');
  svg.appendChild(group);
  svg._petFaceTimer = setTimeout(() => {
    group.remove();
    svg.classList.remove('is-petting');
  }, 1000);
}

/* A belly rub or a snack earns a quick double wag on top of the idle rhythm. */
function wagTail(target, sprite) {
  const svg = target && target.tagName && target.tagName.toLowerCase() === 'svg'
    ? target
    : (target && target.querySelector ? target.querySelector('svg') : null);
  if (!svg) return;
  const tails = [svg.querySelector('.ultra-tail'), svg.querySelector('.ultra-tail-tip')].filter(Boolean);
  if (!tails.length) return;
  tails.forEach((node) => {
    node.classList.remove('tail-wag-extra');
    /* Force a style flush so a second pet restarts the animation. */
    void node.getBoundingClientRect();
    node.classList.add('tail-wag-extra');
    clearTimeout(node._wagTimer);
    node._wagTimer = setTimeout(() => node.classList.remove('tail-wag-extra'), 1000);
  });
  const tip = tails.find((node) => node.classList.contains('ultra-tail-tip')) || tails[tails.length - 1];
  if (tip) {
    clearTimeout(tip._heartTimer);
    tip._heartTimer = setTimeout(() => tailHeart(tip, sprite), 930);
    clearTimeout(tip._blushTimer);
    tip._blushTimer = setTimeout(() => cheekBlush(svg), 1730);
  }
}

/* First-time coat unlock: a burst, a named toast and a short centre card. */
function celebrateFurUnlock(info) {
  const label = info.key === 'dream' ? 'Ancient Dream' : info.key === 'ultra' ? 'Ultra fluff' : 'New coat';
  const source = document.querySelector('.sprite-actor.active') || document.querySelector('.home-window.active .home-actor') || document.getElementById('app');
  if (source) burstOn(source, ['✨', '🌟', '💫', '☁️'], 14);
  const flash = document.createElement('div');
  flash.className = 'fur-unlock-flash';
  flash.innerHTML = `<span>${info.key === 'dream' ? '🌌' : '☁️'}</span><b>${label} unlocked</b><i>${info.blurb} · now in Studio</i>`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 2700);
  toast(`${label} unlocked — a new coat is waiting in Studio.`, '✨');
  Sfx.win();
}

/* Ancient Dream sheds a temporary trail of constellation dots behind it as it
   moves around the Hollow. One sampler per stage, so the number of dream
   sprites never adds timers. */
function startDreamTrails(container) {
  if (!container || container.dataset.dreamTrails === '1') return;
  container.dataset.dreamTrails = '1';
  /* An interval rather than rAF: the stage should keep its trail rhythm even
     when the window is in the background, and it stops with the stage. */
  const timer = setInterval(() => {
    if (!container.isConnected) { clearInterval(timer); return; }
    if (document.documentElement.classList.contains('reduce-motion') || document.visibilityState === 'hidden') return;
    container.querySelectorAll('.sprite-actor').forEach((actor) => {
      if (actor.classList.contains('sleeping')) return;
      const svg = actor.querySelector('svg[data-dream="1"]');
      if (!svg) return;
      const ar = actor.getBoundingClientRect();
      if (!ar.width) return;
      const dot = document.createElement('span');
      dot.className = 'constellation-dot';
      dot.textContent = '✦';
      dot.style.left = `${ar.left + ar.width * 0.3 + rand(-8, 8)}px`;
      dot.style.top = `${ar.top + ar.height * 0.72 + rand(-6, 6)}px`;
      dot.style.fontSize = `${rand(8, 14)}px`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 1250);
    });
  }, 320);
}

/* Waking up: leave a fading copy of the nap blanket and Z's behind, so the
   props drift away instead of vanishing with the redraw. */
function napPropFade(target) {
  if (!target) return;
  const svg = target.tagName && target.tagName.toLowerCase() === 'svg' ? target : target.querySelector('svg');
  const props = svg && svg.querySelector('.sleep-props');
  if (!svg || !props) return;
  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ghost = document.createElement('div');
  ghost.className = 'sleep-props-ghost';
  ghost.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
  const clone = svg.cloneNode(true);
  const keep = clone.querySelector('.sleep-props');
  if (!keep) return;
  let node = keep;
  while (node && node !== clone) {
    const parent = node.parentNode;
    if (!parent) break;
    Array.from(parent.children).forEach((child) => {
      if (child !== node && child.tagName.toLowerCase() !== 'defs') child.style.display = 'none';
    });
    node = parent;
  }
  clone.removeAttribute('class');
  clone.style.width = '100%';
  clone.style.height = '100%';
  ghost.appendChild(clone);
  document.body.appendChild(ghost);
  setTimeout(() => ghost.remove(), 760);
}

function coinFly(el, amount = 1) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const app = document.getElementById('app');
  const ar = app.getBoundingClientRect();
  const node = document.createElement('span');
  node.className = 'coin-fly';
  node.textContent = `+${amount} 🪙`;
  node.style.left = `${r.left - ar.left + r.width / 2 - 16}px`;
  node.style.top = `${r.top - ar.top - 4}px`;
  node.style.fontSize = '12px';
  node.style.fontWeight = '900';
  node.style.color = '#ffe9ac';
  app.appendChild(node);
  setTimeout(() => node.remove(), 900);
}

function pct(n) { return Math.round(clamp(n, 0, 100)); }

/* Task labels carry their base goal in the text; period goals scale, so re-render the number. */
function taskLabel(t) {
  if (!t) return '';
  return String(t.label).replace(/\d+/, t.goal);
}

function needRow(key, label, value) {
  return `<div class="need">
    <div class="need-label"><span>${label}</span><b>${pct(value)}</b></div>
    <div class="bar ${key}"><i style="width:${pct(value)}%"></i></div>
  </div>`;
}

function needBlock(key, value) {
  return `<div class="dstat">
    <span class="lbl">${key}</span>
    <div class="bar ${key}"><i style="width:${pct(value)}%"></i></div>
    <b>${pct(value)}</b>
  </div>`;
}

/* App-wide font choices. The personaliser swaps --font/--display, and every
   screen already draws its type from those two variables. */
const UI_FONTS = {
  rounded: { name: 'Rounded', stack: 'ui-rounded, "Segoe UI", "SF Pro Rounded", system-ui, sans-serif' },
  clean: { name: 'Clean', stack: '"Segoe UI", Inter, system-ui, -apple-system, sans-serif' },
  storybook: { name: 'Storybook', stack: 'Georgia, "Iowan Old Style", "Palatino Linotype", serif' },
  terminal: { name: 'Terminal', stack: '"Cascadia Mono", Consolas, ui-monospace, monospace' },
  soft: { name: 'Soft', stack: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif' },
  loud: { name: 'Loud', stack: '"Arial Black", "Segoe UI Black", system-ui, sans-serif' },
  pixel: { name: 'Pixel', stack: '"Courier New", ui-monospace, monospace', spaced: true },
  hand: { name: 'Handwritten', stack: '"Comic Sans MS", "Chalkboard SE", "Segoe Print", cursive' },
  elegant: { name: 'Elegant', stack: '"Didot", "Playfair Display", "Times New Roman", serif' },
  condensed: { name: 'Condensed', stack: '"Arial Narrow", "Roboto Condensed", "Segoe UI", sans-serif' },
};

/* Glow styles: how much light the accent throws around buttons, cards and the
   loading screen. `none` keeps everything flat. */
const THEME_GLOWS = {
  soft: { name: 'Soft glow', strength: 0.45 },
  neon: { name: 'Neon', strength: 1 },
  aurora: { name: 'Aurora', strength: 0.75 },
  ember: { name: 'Ember', strength: 0.6 },
  none: { name: 'No glow', strength: 0 },
};

/* Loading patterns. The boot splash and the Hollow loading card both use the
   chosen pattern, painted with the player's own colours. */
const THEME_LOADERS = {
  stars: { name: 'Starlight', icon: '✦' },
  rain: { name: 'Pixel rain', icon: '🌧' },
  orbit: { name: 'Orbit rings', icon: '🪐' },
  confetti: { name: 'Confetti', icon: '🎉' },
  pulse: { name: 'Pulse', icon: '💫' },
};

const UI_PRESET_COLOURS = [BRAND.accent, '#5ad6ff', '#38bdf8', '#2dd4bf', '#4ade80', '#a3e635', BRAND.gold, '#ff9a3c', '#f97362', '#ff6bc1', '#ff7ac8', '#e8e6f0'];

function themeHex(value, fallback) {
  const text = String(value || '').trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

/* A near-white backdrop or panel paints the whole frame and buries the text
   under it, so custom picks are capped at a dark luminance when they are
   applied. Mixing toward the app base keeps the hue the player chose. */
function themeLum(hex) {
  const { r, g, b } = hexToRgb(hex);
  const ch = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function themeDarken(hex, maxLum) {
  if (themeLum(hex) <= maxLum) return hex;
  let out = hex;
  for (let t = 0.05; t <= 1 && themeLum(out) > maxLum; t += 0.05) out = mix(hex, '#0a0817', t);
  return out;
}

function setThemeVars(theme) {
  const t = THEMES[theme.ui] || THEMES.prism;
  const custom = theme.custom && typeof theme.custom === 'object' ? theme.custom : {};
  const accent = themeHex(custom.accent, t.accent);
  const accent2 = themeHex(custom.accent2, t.accent2);
  const bg = themeDarken(themeHex(custom.bg, t.bg), 0.02);
  const bg2 = themeDarken(themeHex(custom.bg2, t.bg2), 0.04);
  const font = UI_FONTS[theme.font] || UI_FONTS.rounded;
  const glow = THEME_GLOWS[theme.glow] || THEME_GLOWS.soft;
  const loader = THEME_LOADERS[theme.loader] || THEME_LOADERS.stars;
  const root = document.documentElement.style;
  root.setProperty('--accent', accent);
  root.setProperty('--accent-2', accent2);
  root.setProperty('--bg', bg);
  root.setProperty('--bg-2', bg2);
  root.setProperty('--text', t.text);
  root.setProperty('--muted', t.muted);
  root.setProperty('--panel', `color-mix(in srgb, ${bg2} 78%, transparent)`);
  root.setProperty('--font', font.stack);
  root.setProperty('--display', font.stack);
  root.setProperty('--glow', accent);
  root.setProperty('--glow-2', accent2);
  root.setProperty('--glow-strength', String(glow.strength));
  root.setProperty('--letter-spacing', font.spaced ? '0.04em' : '0em');
  document.body.dataset.glow = THEME_GLOWS[theme.glow] ? theme.glow : 'soft';
  document.body.dataset.loader = THEME_LOADERS[theme.loader] ? theme.loader : 'stars';
  document.body.classList.toggle('reduce-motion', theme.motion === 'calm' || theme.motion === false);
  document.body.dataset.haptics = theme.haptics === false ? 'off' : 'on';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}

/* Real soap bubbles for baths and washing. They rise out of whatever stage
   element is passed in, then clean themselves up. */
function soapBubbles(target, count = 12) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el || document.documentElement.classList.contains('reduce-motion')) return;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('span');
    const size = 7 + (i * 7 + 5) % 13;
    bubble.className = 'soap-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${8 + (i * 29 + 11) % 82}%`;
    bubble.style.bottom = `${4 + (i * 17) % 26}%`;
    bubble.style.animationDelay = `${(i * 0.045).toFixed(2)}s`;
    bubble.style.animationDuration = `${(0.85 + (i % 5) * 0.16).toFixed(2)}s`;
    el.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1900);
  }
}

function spriteTag(sprite) {
  if (!sprite) return '';
  if (sprite.stage === 'egg') return `<span class="chip chip-egg">Egg</span>`;
  const el = ELEMENTS[sprite.element] || ELEMENTS.bloom;
  const label = sprite.hybrid || el.name;
  return `<span class="chip" style="color:${lighten(el.primary, 0.28)};border-color:${el.primary}55;background:${el.primary}1f">
    <span class="dot" style="background:${el.primary}"></span>${label}</span>`;
}

function moodChip(sprite) {
  if (!sprite) return '';
  if (sprite.stage === 'egg') return `<span class="mood-pill">Egg</span>`;
  if (typeof Sickness !== 'undefined' && Sickness.isSick(sprite)) {
    return `<span class="mood-pill sick">${Sickness.info(sprite).icon} Sick</span>`;
  }
  const m = moodOf(sprite);
  return `<span class="mood-pill">${m.icon} ${m.label}</span>`;
}

function stageLabel(sprite) {
  if (!sprite) return '';
  return { egg: 'Egg', baby: 'Baby', juvenile: 'Juvenile', sprite: 'Teen', youngadult: 'Young Adult', midadult: 'Mid-Adult', highadult: 'High Adult', elder: 'Elderly', ancient: 'Ancient', sensei: 'Sensei', apex: 'Apex Cosmic', omni: 'Omni Immortal', celestial: 'Celestial Mythic' }[sprite.stage] || 'Baby';
}

/* Resolve the active theme into the flat colours the boot and loading screens
   paint with, so both always match the app the player chose. */
function themePalette(theme) {
  const t = (typeof THEMES !== 'undefined' && THEMES[theme && theme.ui]) || (typeof THEMES !== 'undefined' ? THEMES.prism : null);
  const custom = theme && theme.custom && typeof theme.custom === 'object' ? theme.custom : {};
  if (!t) return { bg: '#0b0a16', bg2: '#1b1740', accent: BRAND.accent, accent2: BRAND.accent2, glowKey: 'soft', loaderKey: 'stars' };
  return {
    bg: themeDarken(themeHex(custom.bg, t.bg), 0.02),
    bg2: themeDarken(themeHex(custom.bg2, t.bg2), 0.04),
    accent: themeHex(custom.accent, t.accent),
    accent2: themeHex(custom.accent2, t.accent2),
    glowKey: THEME_GLOWS[theme && theme.glow] ? theme.glow : 'soft',
    loaderKey: THEME_LOADERS[theme && theme.loader] ? theme.loader : 'stars',
  };
}

function themeLoaderHTML(kind, count) {
  const key = typeof THEME_LOADERS !== 'undefined' && THEME_LOADERS[kind] ? kind : 'stars';
  const n = count || 24;
  const seq = Array.from({ length: n }, (_, i) => i);
  if (key === 'rain') {
    return seq.map((i) => `<span class="load-rain" style="left:${(i * 41 + 3) % 99}%;height:${9 + (i % 5) * 4}px;animation-delay:${((i * 0.19) % 1.4).toFixed(2)}s;animation-duration:${(0.75 + (i % 4) * 0.18).toFixed(2)}s"></span>`).join('');
  }
  if (key === 'confetti') {
    const tints = ['var(--load-accent)', 'var(--load-accent2)', 'var(--load-glow)'];
    return seq.map((i) => `<span class="load-confetti" style="left:${(i * 37 + 5) % 97}%;background:${tints[i % 3]};animation-delay:${((i * 0.13) % 2).toFixed(2)}s;animation-duration:${(1.6 + (i % 5) * 0.3).toFixed(2)}s"></span>`).join('');
  }
  if (key === 'orbit') {
    return [0, 1, 2, 3].map((i) => `<span class="load-orbit" style="--ring:${64 + i * 30}px;animation-delay:${(i * 0.45).toFixed(2)}s"></span>`).join('');
  }
  if (key === 'pulse') {
    return [0, 1, 2].map((i) => `<span class="load-pulse" style="animation-delay:${(i * 0.75).toFixed(2)}s"></span>`).join('');
  }
  return seq.map((i) => {
    const glyph = i % 3 === 0 ? '✦' : i % 3 === 1 ? '✧' : '·';
    return `<span class="load-star" style="left:${(i * 37 + 11) % 96}%;top:${(i * 53 + 7) % 92}%;font-size:${7 + (i % 4) * 2}px;animation-delay:${((i * 0.37) % 3).toFixed(2)}s">${glyph}</span>`;
  }).join('');
}

/* Surprise me: pick a theme, font, glow, loading pattern and a fresh pair of
   accent colours, then apply the whole look at once. */
function surpriseTheme() {
  const themeKeys = typeof THEME_KEYS !== 'undefined' ? THEME_KEYS : ['prism'];
  const fontKeys = Object.keys(UI_FONTS);
  const glowKeys = Object.keys(THEME_GLOWS);
  const loaderKeys = Object.keys(THEME_LOADERS);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const ui = pick(themeKeys);
  const base = THEMES[ui] || THEMES.prism;
  const accent = pick(UI_PRESET_COLOURS);
  const accent2 = pick(UI_PRESET_COLOURS.filter((hex) => hex !== accent));
  const custom = {
    accent,
    accent2,
    bg: mix(base.bg, accent, 0.14),
    bg2: mix(base.bg2, accent2, 0.12),
  };
  const font = pick(fontKeys);
  const glow = pick(glowKeys);
  const loader = pick(loaderKeys);
  if (typeof Actions !== 'undefined' && Actions.setTheme) Actions.setTheme({ ui, font, glow, loader, custom });
  if (typeof applyTheme === 'function') applyTheme();
  if (typeof toast === 'function') {
    toast(`Surprise! ${base.name} · ${UI_FONTS[font].name} · ${THEME_GLOWS[glow].name}`, '🎲');
  }
  return { ui, font, glow, loader, custom };
}
