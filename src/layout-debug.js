/* Layout debug: tiny readouts of the viewport, the current screen (padding and
   safe-area insets) and, inside a mini-game, the play board and its stage.
   Toggle with the ⤢ button in the top bar or a game's header, or call
   toggleLayoutDebug(). The choice is remembered between sessions. */

const LAYOUT_DEBUG_KEY = 'sprite-hollow.layout-debug.v1';

function layoutDebugEnabled() {
  try {
    return localStorage.getItem(LAYOUT_DEBUG_KEY) === '1';
  } catch (err) {
    return false;
  }
}

function setLayoutDebug(on) {
  try {
    if (on) localStorage.setItem(LAYOUT_DEBUG_KEY, '1');
    else localStorage.removeItem(LAYOUT_DEBUG_KEY);
  } catch (err) { /* private mode: the readout just won't persist */ }
  document.querySelectorAll('.game-overlay').forEach((ov) => mountLayoutDebug(ov, !!on));
  document.querySelectorAll('[data-layout-app-toggle]').forEach((btn) => btn.classList.toggle('on', !!on));
  mountAppLayoutDebug();
  return !!on;
}

function toggleLayoutDebug() {
  const on = setLayoutDebug(!layoutDebugEnabled());
  if (typeof toast === 'function') toast(on ? 'Layout debug on.' : 'Layout debug off.', '📐');
  return on;
}

if (typeof window !== 'undefined') window.toggleLayoutDebug = toggleLayoutDebug;

function layoutDebugSafe(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseFloat(raw);
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function layoutDebugSize(el) {
  if (!el) return '—';
  const r = el.getBoundingClientRect();
  return `${Math.round(r.width)}×${Math.round(r.height)}`;
}

function layoutDebugLine(ov) {
  const board = ov.querySelector('.game-board');
  const stage = board ? board.firstElementChild : null;
  const br = board ? board.getBoundingClientRect() : null;
  const sr = stage ? stage.getBoundingClientRect() : null;
  const fill = br && sr && br.height ? Math.round((sr.height / br.height) * 100) : null;
  const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
  return `vp ${Math.round(window.innerWidth)}×${Math.round(window.innerHeight)}`
    + ` · dpr ${dpr}`
    + ` · board ${layoutDebugSize(board)}`
    + ` · stage ${layoutDebugSize(stage)}`
    + (fill === null ? '' : ` (${fill}%)`);
}

function layoutDebugAppLine() {
  const screen = document.getElementById('screen');
  const tabbar = document.querySelector('.tabbar');
  const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
  const pad = (() => {
    if (!screen) return '—';
    const s = getComputedStyle(screen);
    return [s.paddingTop, s.paddingRight, s.paddingBottom]
      .map((v) => Math.round(parseFloat(v) || 0))
      .join('/');
  })();
  return `vp ${Math.round(window.innerWidth)}×${Math.round(window.innerHeight)}`
    + ` · dpr ${dpr}`
    + ` · screen ${layoutDebugSize(screen)}`
    + ` · pad ${pad}`
    + ` · safe ${layoutDebugSafe('--safe-t')}/${layoutDebugSafe('--safe-b')}`
    + ` · tab ${layoutDebugSize(tabbar)}`;
}

/* ---- the always-on badge for every screen ---- */
function mountAppLayoutDebug() {
  const shell = document.querySelector('.shell');
  const existing = document.querySelector('[data-layout-app]');
  if (!layoutDebugEnabled() || !shell) {
    if (existing) existing.remove();
    return;
  }
  let line = existing;
  if (!line) {
    line = document.createElement('div');
    line.className = 'layout-debug layout-debug-app';
    line.dataset.layoutApp = '';
    line.setAttribute('aria-hidden', 'true');
    shell.appendChild(line);
  }
  if (line._layoutTimer) clearInterval(line._layoutTimer);
  line._layoutTimer = 0;
  const paint = () => {
    if (!line.isConnected) {
      clearInterval(line._layoutTimer);
      line._layoutTimer = 0;
      return;
    }
    line.textContent = layoutDebugAppLine();
  };
  paint();
  line._layoutTimer = setInterval(paint, 500);
}

/* ---- the per-game readout between header and board ---- */
function mountLayoutDebug(ov, on) {
  const existing = ov.querySelector('[data-layout-debug]');
  if (!on) {
    if (existing) existing.remove();
    return;
  }
  if (existing || !ov.querySelector('.game-top')) return;
  const line = document.createElement('div');
  line.className = 'layout-debug';
  line.dataset.layoutDebug = '';
  ov.querySelector('.game-top').insertAdjacentElement('afterend', line);
  let timer = 0;
  let observer = null;
  const paint = () => {
    if (!line.isConnected) {
      clearInterval(timer);
      if (observer) observer.disconnect();
      return;
    }
    line.textContent = layoutDebugLine(ov);
  };
  paint();
  /* The shell exists before the game fills its board, so repaint as soon as
     the stage element appears and keep it current if the game swaps it. */
  requestAnimationFrame(paint);
  const board = ov.querySelector('.game-board');
  if (board && typeof MutationObserver === 'function') {
    observer = new MutationObserver(paint);
    observer.observe(board, { childList: true });
  }
  timer = setInterval(paint, 500);
}
