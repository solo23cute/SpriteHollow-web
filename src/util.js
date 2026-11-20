const APP_VERSION = '4.9.74';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

let seedState = 0;
function seedRandom(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  seedState = h >>> 0;
  return () => {
    seedState ^= seedState << 13;
    seedState ^= seedState >>> 17;
    seedState ^= seedState << 5;
    seedState >>>= 0;
    return seedState / 4294967296;
  };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }) {
  const c = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
function mix(a, b, t = 0.5) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}
const lighten = (hex, t = 0.3) => mix(hex, '#ffffff', t);
const darken = (hex, t = 0.3) => mix(hex, '#0a0614', t);

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}
function weekKey(d = new Date()) {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return `W${dayKey(copy)}`;
}
function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function yearKey(d = new Date()) {
  return String(d.getFullYear());
}
function currentCheckinWindow(d = new Date()) {
  const hour = d.getHours();
  return CHECKIN_WINDOWS.find((w) => (w.from < w.to ? hour >= w.from && hour < w.to : hour >= w.from || hour < w.to)) || CHECKIN_WINDOWS[0];
}
/* Day length follows the season, so winter nights really are longer. */
function timePhase(d = new Date()) {
  const season = typeof seasonOf === 'function' ? seasonOf(d).key : 'spring';
  const hours = {
    winter: { dawn: 7, day: 9, dusk: 17, night: 19 },
    spring: { dawn: 6, day: 8, dusk: 19, night: 21 },
    summer: { dawn: 5, day: 7, dusk: 21, night: 22 },
    autumn: { dawn: 6, day: 8, dusk: 18, night: 20 },
  }[season] || { dawn: 5, day: 8, dusk: 17, night: 20 };
  const h = d.getHours();
  if (h >= hours.dawn && h < hours.day) return { key: 'dawn', label: 'Dawn', icon: '🌅' };
  if (h >= hours.day && h < hours.dusk) return { key: 'day', label: 'Day', icon: '☀️' };
  if (h >= hours.dusk && h < hours.night) return { key: 'dusk', label: 'Dusk', icon: '🌇' };
  return { key: 'night', label: 'Night', icon: '🌙' };
}
const now = () => Date.now();

/* ---------- season & weather helpers ---------- */

function hash01(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Avalanche the bits so neighbouring time slots pick unrelated weather.
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function seasonOf(d = new Date()) {
  if (typeof state !== 'undefined' && state.world && state.world.season === 'off') return SEASON_OFF;
  const manual = (typeof state !== 'undefined' && state.world && SEASONS[state.world.season]) ? state.world.season : null;
  if (manual) return SEASONS[manual];
  const month = d.getMonth();
  return CALENDAR_SEASONS.find((s) => s.months.includes(month)) || SEASONS.spring;
}

/* Weather holds for a three-hour stretch so it feels like real weather. */
function weatherSlot(d = new Date()) {
  return Math.floor(d.getTime() / (3 * 60 * 60 * 1000));
}

function weatherFor(seasonKey, climateKey, slot) {
  const season = SEASONS[seasonKey] || SEASONS.spring;
  const climate = CLIMATES[climateKey] || CLIMATES.temperate;
  const pool = Array.from(new Set([...season.weather, ...Object.keys(climate.extra || {})])).filter((k) => WEATHERS[k]);
  const weights = pool.map((k) => {
    const boost = WEATHERS[k].seasonBoost?.[season.key] ?? 1;
    if (!season.weather.includes(k)) return Math.max(0, boost * (climate.extra?.[k] || 0));
    const bias = climate.bias?.[k];
    return bias === 0 ? 0 : Math.max(0, boost * (bias ?? 1));
  });
  const total = weights.reduce((a, b) => a + b, 0);
  if (!total) return WEATHERS.clear;
  let roll = hash01(`${season.key}:${climate.key}:${slot}`) * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return WEATHERS[pool[i]];
  }
  return WEATHERS[pool[pool.length - 1]];
}

/* Off is a sky of its own, but it applies no weather modifiers: needs decay
   at their normal rates while it is selected. */
const WEATHER_OFF = { key: 'off', name: 'Off', icon: '🚫', blurb: 'Weather effects are switched off. The climate and season still change the light.', chill: 0, off: true };

function currentWeather(d = new Date()) {
  const weather = typeof state !== 'undefined' && state.world ? state.world.weather : null;
  if (weather === 'off') return WEATHER_OFF;
  if (WEATHERS[weather]) return WEATHERS[weather];
  const climate = (typeof state !== 'undefined' && state.world && CLIMATES[state.world.climate])
    ? state.world.climate
    : 'temperate';
  return weatherFor(seasonOf(d).key, climate, weatherSlot(d));
}

function seasonLabel(season, climateKey) {
  const climate = CLIMATES[climateKey] || CLIMATES.temperate;
  if (climate.key === 'tropical') {
    if (season.key === 'winter') return 'Wet season';
    if (season.key === 'summer') return 'Dry season';
  }
  if (climate.key === 'arctic' && season.key === 'summer') return 'Midnight sun';
  if (climate.key === 'arid' && season.key === 'winter') return 'Cold nights';
  return season.name;
}

function warmScore(s) {
  const gear = s ? ACCESSORIES[s.accessory] : null;
  return gear?.warm || 0;
}

function weatherEffects(s) {
  const wx = currentWeather();
  const chill = wx.chill || 0;
  const warm = warmScore(s);
  const comfort = Math.max(0.25, 1 - warm * 0.22);
  const fx = { joy: 1, energy: 1, clean: 1, hunger: 1 };
  if (chill > 0) {
    fx.energy *= 1 + 0.07 * chill * comfort;
    fx.joy *= 1 + 0.08 * chill * comfort;
    if (wx.wet) fx.clean *= 1 + 0.16 * comfort;
  }
  if (wx.hot) {
    fx.hunger *= 1.08;
    fx.energy *= 1.05;
  }
  if (wx.sunny) fx.joy *= 0.95;
  if (warm >= 2 && chill > 0) fx.energy *= 0.94;
  const element = s?.element;
  if (chill > 0 && (element === 'frost' || element === 'ice' || element === 'snow')) {
    fx.joy *= 0.86;
    fx.energy *= 0.92;
  }
  if (chill >= 2 && (element === 'ember' || element === 'fire')) fx.joy *= 1.12;
  return fx;
}

const esc = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function fmtTime(ts) {
  const s = Math.max(0, Math.ceil(ts / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, '0')}s`;
}

function article(word = '') {
  return /^[aeiou]/i.test(String(word).trim()) ? 'an' : 'a';
}

function tapHaptic(ms = 8) {
  try {
    if (navigator.vibrate && document.body.dataset.haptics !== 'off') navigator.vibrate(ms);
  } catch { /* ignore */ }
}

/* Progressive grid rendering for long sprite lists. The first batch mounts
   immediately; an intersection sentinel appends the next batch as the player
   scrolls, with the button as a no-observer fallback. Virtual mode keeps only
   a bounded window in the DOM and restores earlier batches from a top sentinel. */
function LazyGrid(container, options = {}) {
  this.container = container;
  /* This grid owns its viewport preservation; browser scroll anchoring fights
     the top/bottom pinning when a virtual batch trims. */
  if (container && container.style) container.style.overflowAnchor = 'none';
  this.batchSize = Math.max(1, Number(options.batchSize) || 24);
  this.rootMargin = options.rootMargin || '700px 0px';
  this.virtual = options.virtual === true;
  this.windowSize = Math.max(this.batchSize * 4, Number(options.windowSize) || 96);
  this.keyOf = typeof options.key === 'function' ? options.key : null;
  this.items = [];
  this.renderItem = null;
  this.start = 0;
  this.rendered = 0;
  this.observer = null;
  this.topObserver = null;
  this.sentinel = null;
  this.topSentinel = null;
  this.more = null;
  this.topMore = null;
  this.fallbackTimer = null;
  this.fallbackDelay = 1200;
  this.generation = 0;
  /* Original source HTML per card. Runtime decorators add classes and inline
     state after mount, so the live DOM is not a reliable render signature. */
  this.sourceHTML = new WeakMap();
}

/* Sheets scroll their body, not the outer `.sheet` flex column. Root the
   observer at that scroller even before its first batch overflows it: a
   picker list is still the scrollport that clips its sentinel. */
LazyGrid.prototype._scrollRoot = function () {
  let node = this.container;
  while (node && node !== document.body && node !== document.documentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return node;
    node = node.parentElement;
  }
  return null;
};

LazyGrid.prototype._scroller = function () {
  return this._scrollRoot() || document.scrollingElement || document.documentElement;
};

LazyGrid.prototype._viewport = function () {
  const scroller = this._scroller();
  const page = scroller === document.scrollingElement || scroller === document.documentElement || scroller === document.body;
  if (page) return { scroller, root: null, top: 0, bottom: window.innerHeight };
  const rect = scroller.getBoundingClientRect();
  return { scroller, root: scroller, top: rect.top, bottom: rect.bottom };
};

LazyGrid.prototype._clearFallback = function () {
  if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
  this.fallbackTimer = null;
};

LazyGrid.prototype._disconnect = function () {
  this._clearFallback();
  if (this.observer) this.observer.disconnect();
  if (this.topObserver) this.topObserver.disconnect();
  this.observer = null;
  this.topObserver = null;
  this.generation += 1;
};

LazyGrid.prototype._finishBottom = function () {
  this._clearFallback();
  if (this.observer) this.observer.disconnect();
  this.observer = null;
  if (this.sentinel) this.sentinel.remove();
  this.sentinel = null;
  this.more = null;
};

LazyGrid.prototype._finishTop = function () {
  if (this.topSentinel) this.topSentinel.remove();
  this.topSentinel = null;
  this.topMore = null;
};

LazyGrid.prototype._finish = function () {
  this._disconnect();
  this._finishBottom();
  this._finishTop();
};

LazyGrid.prototype._loadMore = function () {
  if (!this.sentinel || !this.renderItem) return;
  const end = this.start + this.rendered;
  const next = this.items.slice(end, end + this.batchSize);
  if (!next.length) {
    if (this.virtual) this._updateBottom();
    else this._finish();
    return;
  }
  const html = next.map((item) => this.renderItem(item));
  this.sentinel.insertAdjacentHTML('beforebegin', html.join(''));
  this._trackCards(html);
  this.rendered += next.length;
  if (this.virtual) {
    this._trimStartIfNeeded();
    this._updateBottom();
    /* Appending moves the sentinel. Re-observing gives it a fresh intersection
       callback, so a short batch that still fits inside the margin keeps
       filling instead of waiting for a scroll transition that never comes. */
    this._observe();
    return;
  }
  const left = this.items.length - this.rendered;
  if (!left) {
    this._finish();
    return;
  }
  this._updateMore(left);
};

LazyGrid.prototype._updateMore = function (left, forceVisible = false) {
  if (!this.more) return;
  /* The observer loads batches automatically. Keep the button hidden unless
     there is no observer, or the observer has gone quiet for too long. */
  this.more.hidden = left <= 0 || (!!this.observer && !forceVisible);
  this.more.textContent = left > 0 ? `Show ${Math.min(this.batchSize, left)} more · ${left} left` : '';
};

LazyGrid.prototype._updateTop = function () {
  if (!this.topSentinel) return;
  const earlier = this.start;
  this.topSentinel.hidden = earlier <= 0;
  if (this.topMore) this.topMore.hidden = earlier <= 0 || !!this.topObserver;
  if (earlier > 0 && this.topMore) {
    this.topMore.textContent = `Show ${Math.min(this.batchSize, earlier)} earlier · ${earlier} above`;
  }
};

LazyGrid.prototype._cardElements = function () {
  return Array.from(this.container.children)
    .filter((element) => element !== this.sentinel && element !== this.topSentinel);
};

/* Remember the HTML each card was created from. Appending tracks the new tail;
   loading earlier cards tracks the new head. */
LazyGrid.prototype._trackCards = function (html, fromStart = false) {
  const cards = this._cardElements();
  const slice = fromStart ? cards.slice(0, html.length) : cards.slice(-html.length);
  slice.forEach((card, index) => this.sourceHTML.set(card, html[index]));
};

LazyGrid.prototype._keyFor = function (item, index) {
  if (!this.keyOf) return null;
  const key = this.keyOf(item, index);
  return key == null ? null : String(key);
};

/* Map the loaded cards to stable item keys. A duplicate or missing key means
   the grid cannot safely patch in place, so refresh falls back to a rebuild. */
LazyGrid.prototype._keyedCards = function () {
  const cards = this._cardElements();
  if (!this.keyOf || cards.length !== this.rendered) return null;
  const byKey = new Map();
  for (let i = 0; i < cards.length; i += 1) {
    const index = this.start + i;
    const item = this.items[index];
    const key = item == null ? null : this._keyFor(item, index);
    if (key == null || byKey.has(key)) return null;
    byKey.set(key, cards[i]);
  }
  return byKey;
};

LazyGrid.prototype._captureView = function (cardsByKey) {
  if (!cardsByKey) return null;
  const entries = [...cardsByKey.entries()];
  const { scroller, top: viewTop } = this._viewport();
  let anchorKey = null;
  let anchorTop = null;
  for (const [key, card] of entries) {
    const rect = card.getBoundingClientRect();
    if (rect.bottom > viewTop) {
      anchorKey = key;
      anchorTop = rect.top;
      break;
    }
  }
  const focused = document.activeElement;
  let focusKey = null;
  let focusIndex = -1;
  if (focused && this.container.contains(focused)) {
    focusIndex = entries.findIndex(([, card]) => card === focused || card.contains(focused));
    if (focusIndex >= 0) focusKey = entries[focusIndex][0];
  }
  return { scroller, anchorKey, anchorTop, focusKey, focusIndex, focusKeys: entries.map(([key]) => key) };
};

/* A removed focused card should not strand focus on the body. Use the next
   surviving card from the old order, then the previous one, then the first
   mounted card. */
LazyGrid.prototype._focusTarget = function (view, cardsByKey) {
  if (!view || view.focusKey == null) return null;
  const current = cardsByKey.get(view.focusKey);
  if (current) return current;
  const keys = view.focusKeys || [];
  for (let i = view.focusIndex + 1; i < keys.length; i += 1) {
    const card = cardsByKey.get(keys[i]);
    if (card) return card;
  }
  for (let i = view.focusIndex - 1; i >= 0; i -= 1) {
    const card = cardsByKey.get(keys[i]);
    if (card) return card;
  }
  return cardsByKey.values().next().value || null;
};

LazyGrid.prototype._restoreFocus = function (view, cardsByKey) {
  if (!view || !cardsByKey || view.focusKey == null) return;
  const card = this._focusTarget(view, cardsByKey);
  if (!card || typeof card.focus !== 'function') return;
  try { card.focus({ preventScroll: true }); } catch (err) { try { card.focus(); } catch (e) { /* focus is optional */ } }
};

LazyGrid.prototype._restoreView = function (view, cardsByKey) {
  if (!view) return;
  this._restoreFocus(view, cardsByKey);
  if (view.anchorKey == null || view.anchorTop == null) return;
  const anchor = cardsByKey.get(view.anchorKey);
  if (!anchor) return;
  const drift = anchor.getBoundingClientRect().top - view.anchorTop;
  if (Math.abs(drift) >= 0.5) view.scroller.scrollTop += drift;
};

LazyGrid.prototype._cardFromHTML = function (html) {
  const template = document.createElement('template');
  template.innerHTML = String(html || '').trim();
  const card = template.content.firstElementChild;
  return card && !card.nextElementSibling ? card : null;
};

LazyGrid.prototype._fallbackLoadedRefresh = function (items, renderItem, keep) {
  const scroller = this._scroller();
  const scrollTop = scroller.scrollTop;
  this._finish();
  const html = items.slice(0, keep).map(renderItem);
  this.container.innerHTML = html.join('');
  this._trackCards(html, true);
  this.items = items;
  this.renderItem = renderItem;
  this.start = 0;
  this.rendered = keep;
  if (keep < items.length) {
    this._createSentinel();
    this._observe();
  }
  scroller.scrollTop = scrollTop;
};

LazyGrid.prototype._captureVisibleAnchor = function (cards) {
  const view = this._viewport();
  const node = cards.find((card) => {
    const rect = card.getBoundingClientRect();
    return rect.bottom > view.top && rect.top < view.bottom;
  }) || null;
  return {
    node,
    top: node ? node.getBoundingClientRect().top : null,
    scroller: view.scroller,
    scrollTop: view.scroller.scrollTop,
  };
};

LazyGrid.prototype._restoreAnchor = function (anchor) {
  if (!anchor.node || anchor.top === null) {
    /* No card from this grid is visible (the player is reading another
       section). Restore the exact position instead of letting browser scroll
       anchoring chase a removed card. */
    anchor.scroller.scrollTop = anchor.scrollTop;
    return;
  }
  const after = anchor.node.getBoundingClientRect().top;
  if (Math.abs(after - anchor.top) >= 0.5) anchor.scroller.scrollTop += after - anchor.top;
};

LazyGrid.prototype._trimStart = function (count) {
  const cards = this._cardElements();
  const { top: viewTop } = this._viewport();
  const limit = Math.min(count, cards.length);
  let remove = 0;
  while (remove < limit && cards[remove].getBoundingClientRect().bottom <= viewTop + 0.5) remove += 1;
  if (!remove) return 0;
  const anchor = this._captureVisibleAnchor(cards.slice(remove));
  cards.slice(0, remove).forEach((card) => card.remove());
  this.start += remove;
  this.rendered -= remove;
  this._updateTop();
  this._restoreAnchor(anchor);
  return remove;
};

LazyGrid.prototype._trimEnd = function (count) {
  const cards = this._cardElements();
  const remove = Math.min(count, cards.length);
  if (!remove) return;
  cards.slice(-remove).forEach((card) => card.remove());
  this.rendered -= remove;
};

LazyGrid.prototype._trimStartIfNeeded = function () {
  if (!this.virtual) return;
  while (this.rendered > this.windowSize) {
    const remove = this._trimStart(Math.min(this.batchSize, this.rendered - this.windowSize));
    if (!remove) break;
  }
};

LazyGrid.prototype._updateBottom = function () {
  if (!this.virtual) return;
  const left = this.items.length - (this.start + this.rendered);
  if (left <= 0) {
    this._finishBottom();
    return;
  }
  if (!this.sentinel) this._createSentinel();
};

LazyGrid.prototype._loadEarlier = function () {
  if (!this.virtual || !this.start || !this.renderItem) return;
  const count = Math.min(this.batchSize, this.start);
  const previous = this.items.slice(this.start - count, this.start);
  if (!previous.length) return;
  const cards = this._cardElements();
  const scroller = this._scroller();
  const atTop = scroller.scrollTop <= 2;
  const anchor = atTop ? null : this._captureVisibleAnchor(cards);
  const html = previous.map((item) => this.renderItem(item));
  if (this.topSentinel) this.topSentinel.insertAdjacentHTML('afterend', html.join(''));
  else this.container.insertAdjacentHTML('afterbegin', html.join(''));
  this._trackCards(html, true);
  this.start -= count;
  this.rendered += count;
  this._updateTop();
  if (atTop) scroller.scrollTop = 0;
  else this._restoreAnchor(anchor);
  const excess = this.rendered - this.windowSize;
  if (excess > 0) this._trimEnd(excess);
  this._updateBottom();
  this._observe();
};

LazyGrid.prototype._observe = function () {
  this._disconnect();
  if (!this.renderItem) return;
  const left = this.items.length - (this.start + this.rendered);
  if (typeof IntersectionObserver !== 'function') {
    this._updateMore(left);
    this._updateTop();
    return;
  }
  const generation = this.generation;
  const root = this._scrollRoot();
  if (this.sentinel) {
    this.observer = new IntersectionObserver((entries) => {
      if (generation !== this.generation) return;
      if (entries.some((entry) => entry.isIntersecting)) this._loadMore();
    }, { root, rootMargin: this.rootMargin });
    this.observer.observe(this.sentinel);
  }
  if (this.virtual && this.topSentinel) {
    this.topObserver = new IntersectionObserver((entries) => {
      if (generation !== this.generation) return;
      if (entries.some((entry) => entry.isIntersecting)) this._loadEarlier();
    }, { root, rootMargin: '120px 0px 0px 0px' });
    this.topObserver.observe(this.topSentinel);
  }
  this._updateMore(left);
  this._updateTop();
  if (this.observer && left > 0) {
    this.fallbackTimer = setTimeout(() => {
      this.fallbackTimer = null;
      if (generation !== this.generation) return;
      this._updateMore(this.items.length - (this.start + this.rendered), true);
    }, this.fallbackDelay);
  }
};

LazyGrid.prototype._createSentinel = function () {
  const sentinel = document.createElement('div');
  sentinel.className = 'lazy-grid-sentinel';
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'btn btn-soft btn-sm lazy-grid-more';
  more.addEventListener('click', () => this._loadMore());
  sentinel.appendChild(more);
  this.container.appendChild(sentinel);
  this.sentinel = sentinel;
  this.more = more;
};

LazyGrid.prototype._createTopSentinel = function () {
  const sentinel = document.createElement('div');
  sentinel.className = 'lazy-grid-sentinel lazy-grid-top';
  sentinel.hidden = true;
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'btn btn-soft btn-sm lazy-grid-more';
  more.textContent = 'Show earlier';
  more.addEventListener('click', () => this._loadEarlier());
  sentinel.appendChild(more);
  this.container.insertBefore(sentinel, this.container.firstChild);
  this.topSentinel = sentinel;
  this.topMore = more;
};

LazyGrid.prototype.reset = function (items, renderItem) {
  const focusView = this._captureView(this._keyedCards());
  this.destroy();
  this.container.innerHTML = '';
  this.items = Array.isArray(items) ? items.slice() : [];
  this.renderItem = typeof renderItem === 'function' ? renderItem : null;
  this.start = 0;
  this.rendered = 0;
  if (!this.items.length || !this.renderItem) return;
  if (this.virtual) {
    this._createTopSentinel();
    this._createSentinel();
    this._loadMore();
    this._restoreFocus(focusView, this._keyedCards());
    return;
  }
  this._createSentinel();
  this._loadMore();
  this._observe();
  this._restoreFocus(focusView, this._keyedCards());
};

/* Refresh the loaded, non-virtual cards in place. Unchanged cards keep their
   DOM node and animations; changed cards are replaced, while focus and the
   first visible card stay put. Virtual grids use reset because their window is
   rebuilt around a different start index. */
LazyGrid.prototype.refresh = function (items, renderItem) {
  const nextItems = Array.isArray(items) ? items.slice() : [];
  const nextRender = typeof renderItem === 'function' ? renderItem : null;
  if (!nextItems.length || !nextRender) {
    this.clear();
    return;
  }
  if (this.virtual || !this.rendered || !this.renderItem) {
    this.reset(nextItems, nextRender);
    return;
  }
  /* A fully mounted grid absorbs up to one batch of new cards; a partial one
     stays put and lets its sentinel catch up. */
  const added = this.rendered < this.items.length
    ? 0
    : Math.max(0, nextItems.length - this.items.length);
  const keep = Math.min(nextItems.length, this.rendered + Math.min(added, this.batchSize));
  const oldCards = this._keyedCards();
  const view = this._captureView(oldCards);
  if (!oldCards) {
    this._fallbackLoadedRefresh(nextItems, nextRender, keep);
    return;
  }
  const nextCards = new Map();
  const ordered = [];
  for (let i = 0; i < keep; i += 1) {
    const item = nextItems[i];
    const key = this._keyFor(item, i);
    if (key == null || nextCards.has(key)) {
      this._fallbackLoadedRefresh(nextItems, nextRender, keep);
      return;
    }
    const html = nextRender(item);
    const fresh = this._cardFromHTML(html);
    if (!fresh) {
      this._fallbackLoadedRefresh(nextItems, nextRender, keep);
      return;
    }
    const oldCard = oldCards.get(key);
    const unchanged = oldCard && this.sourceHTML.get(oldCard) === html;
    const card = unchanged ? oldCard : fresh;
    if (!unchanged) {
      if (oldCard) oldCard.replaceWith(fresh);
      this.sourceHTML.set(card, html);
    }
    nextCards.set(key, card);
    ordered.push(card);
  }
  const keepCards = new Set(ordered);
  this._cardElements().forEach((card) => { if (!keepCards.has(card)) card.remove(); });
  let cursor = this.container.firstChild;
  ordered.forEach((card) => {
    while (cursor && (cursor === this.sentinel || cursor === this.topSentinel)) cursor = cursor.nextSibling;
    if (cursor === card) {
      cursor = cursor.nextSibling;
      return;
    }
    this.container.insertBefore(card, cursor || this.sentinel || null);
  });
  this.items = nextItems;
  this.renderItem = nextRender;
  this.start = 0;
  this.rendered = keep;
  const left = nextItems.length - keep;
  if (!left) {
    if (this.sentinel) this._finishBottom();
  } else if (!this.sentinel) {
    this._createSentinel();
    this._updateMore(left);
    this._observe();
  } else {
    this._updateMore(left);
  }
  this._restoreView(view, nextCards);
};

LazyGrid.prototype.clear = function () {
  this.destroy();
  this.container.innerHTML = '';
};

LazyGrid.prototype.destroy = function () {
  this._finish();
  this.items = [];
  this.renderItem = null;
  this.start = 0;
  this.rendered = 0;
};

/* A keyed, row-virtualized list for horizontally flowing cards. The container
   is a flex-wrap row: cards fill each row and spacers reserve the rows outside
   the current window. Focus, visible-card anchoring and stable item keys follow
   the same capture/restore pattern as LazyGrid. */
function HorizontalVirtualList(container, options = {}) {
  this.container = container;
  if (container && container.style) container.style.overflowAnchor = 'none';
  this.keyOf = typeof options.key === 'function' ? options.key : (item, index) => String(index);
  this.renderItem = typeof options.renderItem === 'function' ? options.renderItem : null;
  this.renderSpacer = typeof options.renderSpacer === 'function' ? options.renderSpacer : null;
  this.measure = typeof options.measure === 'function' ? options.measure : null;
  this.rowTop = typeof options.rowTop === 'function' ? options.rowTop : () => 0;
  this.scroller = options.scroller || document.scrollingElement || document.documentElement;
  this.itemSelector = options.itemSelector || '[data-virtual-item]';
  this.limit = Math.max(1, Number(options.limit) || 60);
  this.overscan = Math.max(0, Number(options.overscan) || 0);
  this.minRows = Math.max(1, Number(options.minRows) || 1);
  this.hysteresis = Math.max(0, Number(options.hysteresis) || 0);
  this.onMount = typeof options.onMount === 'function' ? options.onMount : null;
  this.items = [];
  this.keys = [];
  this.start = 0;
  this.count = 0;
  this.columns = 1;
  this.rowStep = 1;
  this.lead = 0;
  this.focusKey = null;
  this.rovingKey = null;
  this.pendingFocusKey = null;
  this.handleFocusIn = (event) => {
    const card = event.target instanceof Element ? event.target.closest(this.itemSelector) : null;
    if (!card || !this.container.contains(card) || card.dataset.virtualKey == null) return;
    this.focusKey = card.dataset.virtualKey;
    this.rovingKey = this.focusKey;
    this._applyRoving(this.rovingKey);
  };
  if (container) container.addEventListener('focusin', this.handleFocusIn);
}

HorizontalVirtualList.prototype._keyFor = function (item, index) {
  const key = this.keyOf(item, index);
  return key == null ? null : String(key);
};

HorizontalVirtualList.prototype._cardElements = function () {
  if (!this.container) return [];
  return Array.from(this.container.children).filter((node) => node.matches(this.itemSelector));
};

HorizontalVirtualList.prototype._captureView = function () {
  const cards = this._cardElements();
  const scroller = this.scroller;
  const view = scroller.getBoundingClientRect ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
  let anchorKey = null;
  let anchorTop = null;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    if (rect.bottom > view.top) {
      anchorKey = card.dataset.virtualKey || null;
      anchorTop = rect.top;
      break;
    }
  }
  let focusKey = null;
  let focusIndex = -1;
  const active = document.activeElement;
  if (active instanceof Element && this.container.contains(active)) {
    const activeCard = active.closest(this.itemSelector);
    if (activeCard) {
      focusKey = activeCard.dataset.virtualKey || null;
      focusIndex = cards.indexOf(activeCard);
    }
  }
  return {
    anchorKey,
    anchorTop,
    focusKey,
    focusIndex,
    focusKeys: cards.map((card) => card.dataset.virtualKey).filter((key) => key != null),
  };
};

HorizontalVirtualList.prototype._visibleCard = function (entries) {
  const view = this.scroller.getBoundingClientRect ? this.scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
  return entries.find(([, card]) => {
    const rect = card.getBoundingClientRect();
    return rect.bottom > view.top && rect.top < view.bottom;
  }) || null;
};

HorizontalVirtualList.prototype._focusTarget = function (view, byKey, desiredKey) {
  if (desiredKey == null && (!view || view.focusKey == null)) return null;
  const enabled = (card) => !!card && !card.disabled;
  const exact = desiredKey != null ? byKey.get(desiredKey) : null;
  if (enabled(exact)) return exact;
  if (view && view.focusKey != null) {
    const current = byKey.get(view.focusKey);
    if (enabled(current)) return current;
  }
  const entries = [...byKey.entries()];
  const visible = this._visibleCard(entries);
  if (visible && enabled(visible[1])) return visible[1];
  /* When the old row is gone, use the next surviving card from the old order,
     then the previous one, before falling back to the first mounted card. */
  if (view && view.focusKey != null) {
    const keys = view.focusKeys || [];
    for (let i = view.focusIndex + 1; i < keys.length; i += 1) {
      const card = byKey.get(keys[i]);
      if (enabled(card)) return card;
    }
    for (let i = view.focusIndex - 1; i >= 0; i -= 1) {
      const card = byKey.get(keys[i]);
      if (enabled(card)) return card;
    }
  }
  const first = entries.find(([, card]) => enabled(card));
  return first ? first[1] : null;
};

HorizontalVirtualList.prototype._applyRoving = function (preferredKey) {
  const cards = this._cardElements();
  if (!cards.length) {
    this.rovingKey = null;
    return null;
  }
  const byKey = new Map(cards.map((card) => [card.dataset.virtualKey, card]));
  const enabledEntries = [...byKey.entries()].filter(([, card]) => !card.disabled);
  const preferred = preferredKey != null ? byKey.get(String(preferredKey)) : null;
  let target = preferred && !preferred.disabled ? preferred : null;
  if (!target) {
    const visible = this._visibleCard(enabledEntries);
    target = visible ? visible[1] : (enabledEntries[0] ? enabledEntries[0][1] : null);
  }
  if (!target) target = cards[0];
  cards.forEach((card) => { card.tabIndex = card === target ? 0 : -1; });
  this.rovingKey = target.dataset.virtualKey || null;
  return target;
};

HorizontalVirtualList.prototype.setItems = function (items) {
  this.items = Array.isArray(items) ? items.slice() : [];
};

HorizontalVirtualList.prototype.resetWindow = function () {
  this.lead = 0;
  this.start = 0;
};

HorizontalVirtualList.prototype.focusIndex = function (index) {
  const total = this.items.length;
  if (!total) return null;
  const target = Math.max(0, Math.min(total - 1, index));
  const key = this._keyFor(this.items[target], target);
  const columns = Math.max(1, this.columns);
  const row = Math.floor(target / columns);
  const rowTop = this.rowTop(this.container) + row * this.rowStep;
  const viewTop = this.scroller.scrollTop;
  const viewBottom = viewTop + this.scroller.clientHeight;
  this.pendingFocusKey = key;
  if (rowTop < viewTop + 8 || rowTop + this.rowStep > viewBottom - 8) {
    this.scroller.scrollTop = Math.max(0, rowTop - Math.max(0, (this.scroller.clientHeight - this.rowStep) / 2));
  }
  this.paint();
  return key;
};

HorizontalVirtualList.prototype.paint = function () {
  if (!this.container || !this.renderItem) return null;
  const total = this.items.length;
  const metrics = this.measure ? this.measure(this.container) : null;
  const columns = Math.max(1, Number(metrics && metrics.columns) || 1);
  const rowStep = Math.max(1, Number(metrics && metrics.rowStep) || 1);
  const rowGap = Math.max(0, Number(metrics && metrics.rowGap) || 0);
  const spacerWidth = Number(metrics && metrics.spacerWidth) || 0;
  this.columns = columns;
  this.rowStep = rowStep;
  const totalRows = Math.ceil(total / columns);
  const viewportRows = Math.max(1, Math.ceil(this.scroller.clientHeight / rowStep));
  const maxRows = Math.max(1, Math.floor(this.limit / columns));
  const windowRows = Math.min(totalRows, Math.min(maxRows,
    Math.max(this.minRows, viewportRows + this.overscan * 2)));
  const rowTop = this.rowTop(this.container);
  const visibleRow = Math.max(0, Math.floor((this.scroller.scrollTop - rowTop) / rowStep));
  const maxLead = Math.max(0, totalRows - windowRows);
  const lead = Math.max(0, Math.min(maxLead, visibleRow - this.overscan));
  const coversViewport = this.lead <= visibleRow
    && this.lead + windowRows >= visibleRow + viewportRows;
  const keepLead = coversViewport && Math.abs(lead - this.lead) <= this.hysteresis;
  const firstRow = keepLead ? this.lead : lead;
  const lastRow = Math.min(totalRows, firstRow + windowRows);
  const start = firstRow * columns;
  const count = Math.max(0, Math.min(total, lastRow * columns) - start);
  const beforeRows = firstRow;
  const afterRows = Math.max(0, totalRows - lastRow);
  const beforeHeight = beforeRows ? Math.max(0, beforeRows * rowStep - rowGap) : 0;
  const afterHeight = afterRows ? Math.max(0, afterRows * rowStep - rowGap) : 0;
  const view = this._captureView();
  const shown = this.items.slice(start, start + count);
  const keys = shown.map((item, index) => this._keyFor(item, start + index));
  const spacer = (rows, height) => this.renderSpacer
    ? this.renderSpacer(rows, height, spacerWidth)
    : `<div data-virtual-spacer="${rows}" aria-hidden="true" style="width:${spacerWidth}px;flex-basis:${spacerWidth}px;height:${height}px"></div>`;
  const html = `${beforeRows ? spacer(beforeRows, beforeHeight) : ''}
    ${shown.map((item, index) => this.renderItem(item, start + index)).join('')}
    ${afterRows ? spacer(afterRows, afterHeight) : ''}`;
  this.lead = firstRow;
  this.start = start;
  this.count = count;
  this.keys = keys;
  this.container.innerHTML = html;
  const cards = this._cardElements();
  cards.forEach((card, index) => { card.dataset.virtualKey = keys[index] || ''; });
  this.container.dataset.windowStart = String(start);
  this.container.dataset.windowSize = String(count);
  this.container.dataset.columns = String(columns);
  if (this.onMount) this.onMount(this.container);
  const byKey = new Map(cards.map((card) => [card.dataset.virtualKey, card]));
  const desiredKey = this.pendingFocusKey != null ? this.pendingFocusKey : (view ? view.focusKey : null);
  const focusCard = this._focusTarget(view, byKey, desiredKey);
  if (focusCard && typeof focusCard.focus === 'function') {
    try { focusCard.focus({ preventScroll: true }); } catch (err) { try { focusCard.focus(); } catch (e) { /* focus is optional */ } }
  }
  this.pendingFocusKey = null;
  const active = document.activeElement instanceof Element && this.container.contains(document.activeElement)
    ? document.activeElement.closest(this.itemSelector) : null;
  this.focusKey = active ? active.dataset.virtualKey || null : null;
  this._applyRoving(active ? active.dataset.virtualKey : this.rovingKey);
  if (view && view.anchorKey != null && view.anchorTop != null) {
    const anchor = byKey.get(view.anchorKey);
    if (anchor) {
      const drift = anchor.getBoundingClientRect().top - view.anchorTop;
      if (Math.abs(drift) >= 0.5) this.scroller.scrollTop += drift;
    }
  }
  return { start, count, columns, rowStep, focusKey: this.focusKey };
};

HorizontalVirtualList.prototype.destroy = function () {
  if (this.container) this.container.removeEventListener('focusin', this.handleFocusIn);
  this.items = [];
  this.keys = [];
  this.start = 0;
  this.count = 0;
  this.focusKey = null;
  this.rovingKey = null;
  this.pendingFocusKey = null;
};
