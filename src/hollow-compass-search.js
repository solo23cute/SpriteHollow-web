/* Hollow Compass: one search box over the Hollow's own catalogues.

   Species, scenes, and games come from the live data the game already ships.
   Wiki guides live in the lazy codex chunk, so that chunk is fetched on the
   first keystroke and the results repaint when it lands. Every hit carries the
   action the rest of the game already uses for it: a species file, a scene
   trip, a game, or a Wiki guide. */

const COMPASS_LIMIT = 8;

let compassCatalogCache = null;
let compassWikiRequested = false;

function compassKindOrder(kind) {
  if (kind === 'species') return 0;
  if (kind === 'scene') return 1;
  if (kind === 'game') return 2;
  return 3;
}

function compassCatalog() {
  if (compassCatalogCache) return compassCatalogCache;
  const entries = [];

  if (typeof ELEMENTS !== 'undefined') {
    const keys = typeof ELEMENT_KEYS !== 'undefined' ? ELEMENT_KEYS : Object.keys(ELEMENTS);
    keys.forEach((key) => {
      const el = ELEMENTS[key];
      if (!el) return;
      entries.push({
        kind: 'species',
        id: key,
        label: el.name || key,
        sub: String(el.trait || 'Species').split('—')[0].trim(),
        icon: el.icon || '🧬',
        hay: `${el.name || ''} ${key} ${el.trait || ''} ${el.blurb || ''}`.toLowerCase(),
      });
    });
  }

  if (typeof SCENES !== 'undefined') {
    Object.keys(SCENES).forEach((key) => {
      const scene = SCENES[key];
      if (!scene) return;
      const bonus = Math.round((Number(scene.bonus) || 0.4) * 100);
      entries.push({
        kind: 'scene',
        id: key,
        label: scene.name || key,
        sub: `${scene.habitat || 'Habitat'} · +${bonus}% XP`,
        icon: scene.emoji || '🗺️',
        hay: `${scene.name || ''} ${key} ${scene.habitat || ''} ${scene.blurb || ''}`.toLowerCase(),
      });
    });
  }

  if (typeof GAME_INFO !== 'undefined') {
    Object.keys(GAME_INFO).forEach((kind) => {
      const game = GAME_INFO[kind];
      if (!game) return;
      entries.push({
        kind: 'game',
        id: kind,
        label: game.title || kind,
        sub: game.tag || 'Mini game',
        icon: game.icon || '🎮',
        hay: `${game.title || ''} ${kind} ${game.tag || ''} ${game.desc || ''}`.toLowerCase(),
      });
    });
  }

  compassCatalogCache = entries;
  return entries;
}

/* WIKI_GUIDES only exists once the codex chunk has run. */
function compassWikiEntries() {
  if (typeof WIKI_GUIDES === 'undefined' || !Array.isArray(WIKI_GUIDES)) return [];
  return WIKI_GUIDES.map((guide) => ({
    kind: 'wiki',
    id: guide.id,
    label: guide.title,
    sub: guide.summary || 'Wiki guide',
    icon: guide.icon || '📖',
    hay: `${guide.title} ${guide.summary || ''} ${guide.id}`.toLowerCase(),
  }));
}

/* Whole names first, then whole words, then partial words, then tag-only hits.
   A word start beats a mid-word prefix, so "grove" offers the Sunny Grove
   scene ahead of a species that only begins with the same letters. */
function compassScore(entry, query) {
  const label = String(entry.label || '').toLowerCase();
  if (label === query) return 0;
  let partial = false;
  let at = label.indexOf(query);
  while (at !== -1) {
    const before = at === 0 || !/[a-z0-9]/i.test(label.charAt(at - 1));
    const end = at + query.length;
    const after = end >= label.length || !/[a-z0-9]/i.test(label.charAt(end));
    if (before && after) return at === 0 ? 1 : 2;
    if (at === 0) partial = true;
    at = label.indexOf(query, at + 1);
  }
  if (partial) return 3;
  return label.indexOf(query) === -1 ? 5 : 4;
}

function compassSearch(query, limit = COMPASS_LIMIT) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const hits = [];
  compassCatalog().concat(compassWikiEntries()).forEach((entry) => {
    if (entry.hay.indexOf(q) === -1) return;
    hits.push({ entry, score: compassScore(entry, q) });
  });
  hits.sort((a, b) => a.score - b.score
    || a.entry.label.length - b.entry.label.length
    || compassKindOrder(a.entry.kind) - compassKindOrder(b.entry.kind)
    || a.entry.label.localeCompare(b.entry.label));
  return hits.slice(0, Math.max(1, limit)).map((hit) => hit.entry);
}

function compassActionLabel(kind) {
  if (kind === 'species') return 'Species file';
  if (kind === 'scene') return 'Travel';
  if (kind === 'game') return 'Play';
  if (kind === 'wiki') return 'Wiki guide';
  return 'Open';
}

function compassRequestWiki(paint) {
  if (compassWikiRequested) return;
  if (typeof WIKI_GUIDES !== 'undefined') return;
  if (typeof ensureRoute !== 'function') return;
  compassWikiRequested = true;
  ensureRoute('codex').then(paint).catch(() => { compassWikiRequested = false; });
}

function compassRowHTML(entry) {
  return `<button class="compass-row" type="button" data-compass-kind="${esc(entry.kind)}" data-compass-id="${esc(entry.id)}">
    <span class="compass-icon" aria-hidden="true">${entry.icon}</span>
    <span class="compass-copy"><b>${esc(entry.label)}</b><small>${esc(entry.sub)}</small></span>
    <span class="compass-go">${esc(compassActionLabel(entry.kind))}</span>
  </button>`;
}

/* The one action per kind. Scenes reuse the biome travel the atlas uses. */
function compassGo(entry) {
  if (!entry) return;
  if (entry.kind === 'species') {
    if (typeof openWikiArticle === 'function') openWikiArticle(entry.id);
    return;
  }
  if (entry.kind === 'wiki') {
    if (typeof openWikiGuide === 'function') openWikiGuide(entry.id);
    return;
  }
  if (entry.kind === 'game') {
    if (typeof openGame === 'function') openGame(entry.id);
    return;
  }
  if (entry.kind === 'scene') {
    const scene = typeof SCENES !== 'undefined' ? SCENES[entry.id] : null;
    if (!scene) return;
    const trip = Actions.setTheme({ scene: entry.id });
    App.go('hollow');
    toast(`${scene.emoji || '🧭'} ${scene.name} active${trip && trip.coins ? ` · +${trip.coins} coins` : ''}.`, '🧭');
  }
}

function openHollowCompassSearch() {
  const { close } = openSheet({
    title: '🧭 Hollow Compass',
    sub: 'Species, scenes, games, and Wiki entries.',
    body: `<div class="compass">
      <label class="resident-search"><span aria-hidden="true">🔍</span><input type="search" data-compass-input placeholder="Search the Hollow…" aria-label="Search species, scenes, games, and Wiki entries" autocomplete="off"></label>
      <div class="compass-results" data-compass-results></div>
      <p class="tiny muted" data-compass-hint style="margin:0;text-align:center">Type a species, a place, a game, or a Wiki topic.</p>
    </div>`,
    onMount: (sheet, closeSheet) => {
      const input = sheet.querySelector('[data-compass-input]');
      const results = sheet.querySelector('[data-compass-results]');
      const hint = sheet.querySelector('[data-compass-hint]');

      const paint = () => {
        const query = input.value.trim();
        const hits = compassSearch(query);
        results.innerHTML = hits.map(compassRowHTML).join('');
        hint.hidden = hits.length > 0;
        hint.textContent = !query
          ? 'Type a species, a place, a game, or a Wiki topic.'
          : 'Nothing in the Hollow matches that yet.';
        compassRequestWiki(paint);
      };

      const openRow = (row) => {
        const kind = row.dataset.compassKind;
        const id = row.dataset.compassId;
        const entry = compassCatalog().concat(compassWikiEntries())
          .find((item) => item.kind === kind && item.id === id) || { kind, id };
        Sfx.click();
        closeSheet();
        compassGo(entry);
      };

      input.addEventListener('input', paint);
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        const first = results.querySelector('[data-compass-id]');
        if (first) openRow(first);
      });
      results.addEventListener('click', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-compass-id]') : null;
        if (row) openRow(row);
      });
      paint();
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => input.focus());
      else input.focus();
    },
  });
  return { close };
}

const HollowCompassSearch = Object.freeze({
  LIMIT: COMPASS_LIMIT,
  catalog: compassCatalog,
  wikiEntries: compassWikiEntries,
  search: compassSearch,
  actionLabel: compassActionLabel,
  go: compassGo,
  open: openHollowCompassSearch,
});
