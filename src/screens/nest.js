/* The Nest: warm eggs, fuse sprites, and buy wild eggs. */

/* A type sheet can deep-link here: open the Nest on that apex rank with the
   species pinned first, so one tap from Types lands on the egg itself. The
   last jump is remembered, so coming back from another tab keeps the egg in
   focus until the player clears the pin. */
const NEST_FOCUS_KEY = 'sprite-hollow.nest-focus.v1';
/* A 'base' focus means the species' ordinary band egg rather than an apex
   premium egg, so one deep link can point at either the plain card or an
   apex-rank one. */
const BASE_EGG_FOCUS_RANK = 'base';
const TYPE_EGG_STARTER_PATH = ['normal', 'splash', 'rock', 'mushroom', 'snow', 'pc_breeze', 'evo_spark', 'pa_shadow_dusky_puffle'];
/* The type shelf's Owned badge and filter mean a species has a hatched,
   non-retired sprite at home right now. The starter path asks a different
   question: whether the species has ever joined the Nest, including as a
   waiting egg or a retired friend. Keep the two answers separate. */
function ownedTypeEggSpecies() {
  return new Set(state.sprites
    .filter((s) => s && s.stage !== 'egg' && !s.retired)
    .map((s) => s.element));
}
function collectedTypeEggSpecies() {
  return new Set(state.sprites.map((s) => s.element));
}
const TYPE_FILTER_DEFAULTS = Object.freeze({ q: '', rarity: 'all', owned: 'all', affordable: false, family: '', pin: null });
const TYPE_EGG_SPECIES_SET = new Set(TYPE_EGG_SPECIES);
/* The taxonomy script loads after the screen script, so build this table when
   the Nest mounts. Keep only families that currently expose a type egg. */
let TYPE_FAMILY_ROWS = [];
let TYPE_FAMILY_BY_ID = new Map();
function loadTypeFamilyRows() {
  if (TYPE_FAMILY_ROWS.length) return;
  const groups = typeof SPECIES_FAMILY_GROUPS !== 'undefined' ? SPECIES_FAMILY_GROUPS : [];
  TYPE_FAMILY_ROWS = groups.map((family) => {
    const species = (Array.isArray(family.species) ? family.species : [])
      .filter((key) => TYPE_EGG_SPECIES_SET.has(key));
    const names = species.map((key) => ELEMENTS[key]?.name || key);
    return {
      id: family.id,
      label: family.label || family.id,
      species,
      speciesSet: new Set(species),
      count: species.length,
      description: typeof family.description === 'string' ? family.description : '',
      preview: names.slice(0, 3).join(' · '),
      icon: ELEMENTS[species[0]]?.icon || '🧬',
      color: ELEMENTS[species[0]]?.primary || BRAND.accent,
      search: `${family.label || family.id} ${family.id} ${names.join(' ')}`.toLowerCase(),
    };
  }).filter((family) => family.count > 0);
  TYPE_FAMILY_BY_ID = new Map(TYPE_FAMILY_ROWS.map((family) => [family.id, family]));
}
const TYPE_EGG_SORT_OPTIONS = Object.freeze([
  { key: 'cheapest', label: 'Price · low to high' },
  { key: 'rarest', label: 'Rarity · high to low' },
  { key: 'name', label: 'Name · A to Z' },
  { key: 'missing-first', label: 'Cheapest missing' },
]);
const TYPE_EGG_SORT_DEFAULT = 'cheapest';
const TYPE_EGG_NAME_ORDER = (a, b) => a.name.localeCompare(b.name) || a.key.localeCompare(b.key);
const TYPE_EGG_SORT_COMPARATORS = Object.freeze({
  cheapest: (a, b) => a.price - b.price || TYPE_EGG_NAME_ORDER(a, b),
  rarest: (a, b) => b.rarity - a.rarity || a.price - b.price || TYPE_EGG_NAME_ORDER(a, b),
  name: TYPE_EGG_NAME_ORDER,
  'missing-first': (a, b) => Number(a.owned) - Number(b.owned) || a.price - b.price || TYPE_EGG_NAME_ORDER(a, b),
});
/* Type filters live outside the screen mount so Nest → Hollow → Nest keeps
   the player's current slice instead of rebuilding it from defaults. */
const typeFilter = { ...TYPE_FILTER_DEFAULTS };
let NEST_APEX_FOCUS = null;
function readNestFocus() {
  try {
    const saved = JSON.parse(localStorage.getItem(NEST_FOCUS_KEY) || 'null');
    return saved && typeof saved === 'object'
      && typeof saved.species === 'string' && typeof saved.rank === 'string'
      ? { species: saved.species, rank: saved.rank }
      : null;
  } catch (err) {
    return null;
  }
}
function writeNestFocus(focus) {
  try {
    if (focus && typeof focus.species === 'string' && typeof focus.rank === 'string') {
      localStorage.setItem(NEST_FOCUS_KEY, JSON.stringify({ species: focus.species, rank: focus.rank }));
    } else {
      localStorage.removeItem(NEST_FOCUS_KEY);
    }
  } catch (err) { /* private mode: focus just won't stick */ }
}
function openApexTypeEgg(key, rank) {
  NEST_APEX_FOCUS = { species: key, rank };
  writeNestFocus(NEST_APEX_FOCUS);
  App.go('nest');
}

const HIGH_VALUE_PRICE = 500;
const PURCHASE_UNDO_MS = 8000;

/* One guard for every paid Nest purchase: confirm the spend at HIGH_VALUE_PRICE,
   then offer the same undo window whichever action ran. Permanent unlocks opt
   in regardless of price. The undo callback gets the completed purchase, so a
   refund always uses what was actually charged. */
async function guardedPurchase(label, price, run, undo, {
  verb = 'Buy',
  emoji = '🥚',
  done = `${label} joined the Nest!`,
  alwaysConfirm = false,
} = {}) {
  if (state.coins < price) {
    toast('Not enough coins.', '🪙');
    Sfx.error();
    return null;
  }
  const guarded = alwaysConfirm || price >= HIGH_VALUE_PRICE;
  if (guarded) {
    const cost = price.toLocaleString();
    const safeLabel = esc(label);
    const yes = await confirmModal(
      `${verb} ${safeLabel}?`,
      `${safeLabel} costs ${cost} coins. You can undo this for ${PURCHASE_UNDO_MS / 1000} seconds.`,
      `${verb} for ${cost}`,
    );
    if (!yes) return null;
  }
  const res = run();
  if (!res || !res.ok) return null;
  const shinyEggs = res.eggs
    ? res.eggs.filter((egg) => egg && egg.shiny)
    : (res.egg && res.egg.shiny ? [res.egg] : []);
  if (shinyEggs.length) Sfx.shinyEgg(); else Sfx.coin();
  const doneText = shinyEggs.length
    ? `${done} · ✨ ${shinyEggs.length === 1 ? 'Shiny egg' : `${shinyEggs.length} shiny eggs`}!`
    : done;
  if (!guarded) {
    toast(doneText, shinyEggs.length ? '✨' : emoji);
    return res;
  }
  toastAction(doneText, shinyEggs.length ? '✨' : emoji, 'Undo', () => {
    const undone = undo(res);
    if (!undone || !undone.ok) {
      toast('That purchase can no longer be undone.', '⚠️');
      return;
    }
    Sfx.click();
    toast(`${label} purchase undone — ${(Number(undone.coins) || price).toLocaleString()} coins returned.`, '↩️');
  }, { duration: PURCHASE_UNDO_MS });
  return res;
}

/* Single and bulk egg buys share one undo: close the hatch sheet a single egg
   opened, remove the shells, and refund the price the purchase recorded. */
function undoPurchasedEggs(purchase) {
  closeSheetByKey('hatch-flow');
  const ids = purchase.eggs ? purchase.eggs.map((egg) => egg.id) : [purchase.egg.id];
  return Actions.undoEggPurchase(ids, purchase.price);
}

async function buyEggAndOpen(label, price, run, done, options = {}) {
  const res = await guardedPurchase(label, price, run, undoPurchasedEggs, { done, ...options });
  if (res) App.openHatch(res.egg.id);
  return res;
}

function mergeWhyParentRef(res, from) {
  if (from === 'both') return 'both parents';
  const side = from === 'b' ? 'B' : 'A';
  const parent = side === 'A' ? res.a : res.b;
  return `<b>${side} · ${esc(displayName(parent))}</b>`;
}

function mergeWhyPaletteName(key) {
  return key === 'custom' ? 'Custom colors' : (PALETTES[key]?.name || key);
}

/* A compact, factual account of the rolls that built the preview. Parent names
   make it clear that type/palette are inherited 50/50, while egg merges explain
   why the breed can match neither shell. */
function mergeWhyHTML(res, why) {
  if (!why) return '';
  const rows = [];
  const type = why.type || {};
  const breed = why.breed || {};
  const palette = why.palette || {};

  if (type.element) {
    const typeName = esc(ELEMENTS[type.element]?.name || type.element);
    rows.push({
      label: 'Type',
      detail: type.from === 'both'
        ? `<b>${typeName}</b> · shared by both parents`
        : `<b>${typeName}</b> from ${mergeWhyParentRef(res, type.from)} <em>50/50 type roll</em>`,
    });
  }

  if (breed.breed) {
    const breedName = esc(BREEDS[breed.breed]?.name || breed.breed);
    let detail;
    if (breed.kind === 'new-egg-merge') {
      const excluded = [...new Set(breed.excluded || [])]
        .map((key) => esc(BREEDS[key]?.name || key))
        .join(' or ');
      const pool = Number(breed.pool) > 0 ? ` from ${breed.pool} other breeds` : '';
      detail = `<b>${breedName}</b> · new breed roll${pool}; neither parent supplied it${excluded ? ` (${excluded} excluded)` : ''}`;
    } else if (breed.kind === 'random') {
      detail = `<b>${breedName}</b> · random 8% breed roll`;
    } else if (breed.from === 'both') {
      detail = `<b>${breedName}</b> · shared by both parents`;
    } else {
      detail = `<b>${breedName}</b> from ${mergeWhyParentRef(res, breed.from)} <em>50/50 breed roll</em>`;
    }
    rows.push({ label: 'Breed', detail });
  }

  if (palette.palette) {
    const paletteName = esc(mergeWhyPaletteName(palette.palette));
    let detail;
    if (palette.kind === 'combo') {
      detail = `<b>${paletteName}</b> · combo colors${palette.combo ? ` (${esc(palette.combo)})` : ''}`;
    } else if (palette.kind === 'mutation') {
      detail = `<b>${paletteName}</b> · ${esc(palette.mutation || 'mutation')} mutation roll`;
    } else if (palette.kind === 'blend') {
      detail = `Custom colors blended from ${mergeWhyParentRef(res, 'a')} + ${mergeWhyParentRef(res, 'b')} <em>color blend roll</em>`;
    } else if (palette.kind === 'random') {
      detail = `<b>${paletteName}</b> · random palette roll`;
    } else if (palette.kind === 'parent' && palette.from === 'both') {
      detail = palette.custom
        ? 'Custom colors · shared by both parents'
        : `<b>${paletteName}</b> · shared by both parents`;
    } else if (palette.kind === 'parent') {
      detail = palette.custom
        ? `Custom colors from ${mergeWhyParentRef(res, palette.from)}`
        : `<b>${paletteName}</b> from ${mergeWhyParentRef(res, palette.from)} <em>parent palette roll</em>`;
    } else {
      detail = `<b>${paletteName}</b> · no parent palette matched`;
    }
    rows.push({ label: 'Palette', detail });
  }

  if (!rows.length) return '';
  return `<section class="merge-why" data-merge-why>
    <div class="merge-why-head"><b>Why this result</b><span>A + B · actual rolls</span></div>
    ${rows.map((row) => `<div class="merge-why-row"><b>${row.label}</b><span>${row.detail}</span></div>`).join('')}
    ${res.twins ? '<div class="merge-why-note">The twin result rolled separately from the same parents.</div>' : ''}
  </section>`;
}

function nestScreen(root) {
  loadTypeFamilyRows();
  const picked = { a: null, b: null };
  const TYPE_EGG_GRID_ROW = 148;
  const TYPE_EGG_GRID_OVERSCAN = 2;
  const TYPE_EGG_GRID_MIN_ROWS = 4;
  const TYPE_EGG_GRID_MAX_CARDS = 60;
  const TYPE_EGG_GRID_HYSTERESIS = 1;
  const TYPE_EGG_FEATURED_LIMIT = 6;
  let typeWindowSignature = '';
  let typeWindowOrdered = [];
  let typeWindowPinned = null;
  let typeWindowApexRank = null;
  let typeWindowOwned = new Set();
  let typeShelf = null;
  let familyShelf = null;
  let familyQuery = '';
  let typeScrollFrame = 0;
  let typeScrollBound = false;
  let typeGridWidth = 0;
  let typeGridObserver = null;
  const typeRoster = TYPE_EGG_SPECIES.includes('normal')
    ? ['normal', ...TYPE_EGG_SPECIES.filter((key) => key !== 'normal')]
    : TYPE_EGG_SPECIES;
  const starterEggs = TYPE_EGG_STARTER_PATH.filter((key) => TYPE_EGG_SPECIES.includes(key));

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Life finds a way</div><h1>The Nest</h1><p data-nest-sub>Eggs, merges, and new little legends.</p></div>
      <span class="chip">${icon('coin')} <span data-nest-coins>${state.coins}</span></span>
    </div>
    <div data-flight-card></div>
    <div data-wishlist-panel></div>
    <button class="btn btn-soft btn-block nest-vault-btn" data-open-vault style="margin:8px 0 4px">🔐 Secret Vault · combinations, hybrids & possible children</button>
    <button class="btn btn-gold btn-block" data-open-summon style="margin:8px 0 4px">🌌 Multi-summon · 10× to 100×</button>
    <div class="nest-hub">
      <div class="nest-hub-head">
        <div><div class="eyebrow">🪔 Incubator nursery</div><h3>Warm eggs, hatch faster</h3></div>
        <span class="chip" data-incubator-chip>🪔 Warm Lamp</span>
      </div>
      <p class="tiny muted nest-hub-sub">One warmer applies to every egg. Lava Mode heats Ember shells; Frost Chill steadies frozen and lava-frozen eggs.</p>
      <div class="incubator-row" data-incubators></div>
      <div class="nest-activity-head"><b>Nest activities</b><span data-nest-activity-count></span></div>
      <div class="nest-activities" data-nest-activities></div>
    </div>
    <div class="section-title" style="margin-top:14px"><h2>Tier eggs</h2><span>all ${RARITY_TIER_ORDER.length} tiers</span></div>
    <p class="tiny muted" style="margin:0 2px 8px">Every rank of the ladder, Common → Eternal. A tier egg hatches a random type raised to exactly that rank.</p>
    <div id="nest-tier-shop" class="tier-egg-grid"></div>
    <div id="nest-tier-pins" class="tier-pin-panel" data-tier-pins></div>
    <div id="nest-eggs" style="margin-top:14px"></div>
    <div class="section-title"><h2>Merge sprites &amp; eggs</h2><span>genes, colors &amp; new breeds</span></div>
    <div id="nest-merge"></div>
    <div class="section-title"><h2>Wild eggs</h2><span>fresh bloodlines</span></div>
    <div id="nest-shop" class="list-gap"></div>
    <div class="section-title"><h2>Type eggs</h2><span data-type-count>${TYPE_EGG_SPECIES.length} type eggs</span></div>
    <div class="sr-only" data-type-range-live role="status" aria-live="polite" aria-atomic="true"></div>
    <div class="type-starter" data-type-starter></div>
    <div class="type-tools">
      <input class="type-search" type="search" data-type-search placeholder="Search types…" aria-label="Search type eggs" autocomplete="off">
      <div class="type-filter-row">
        <button class="chip type-family-toggle" type="button" data-type-family-toggle aria-expanded="false" aria-controls="nest-type-family-browser"><span aria-hidden="true">🧬</span> <span data-type-family-toggle-label>All families</span></button>
        <select class="type-sort" id="type-sort" data-type-sort aria-label="Sort type eggs">
          ${TYPE_EGG_SORT_OPTIONS.map((option) => `<option value="${option.key}">${option.label}</option>`).join('')}
        </select>
        <div class="type-filter-group type-filter-show">
          <span class="type-filter-label" data-type-group-label="show" aria-hidden="true">Show</span>
          <div class="type-owned" role="group" aria-label="Filter type eggs by ownership or budget">
            <button class="chip type-owned-btn on" type="button" data-owned="all">All</button>
            <button class="chip type-owned-btn" type="button" data-owned="owned">Owned</button>
            <button class="chip type-owned-btn" type="button" data-owned="missing">Missing</button>
            <button class="chip type-owned-btn type-affordable" type="button" data-type-affordable aria-pressed="false">💰 Affordable</button>
          </div>
        </div>
      </div>
      <div class="type-filter-group type-filter-rank">
        <span class="type-filter-label" data-type-group-label="rank" aria-hidden="true">Rank</span>
        <div class="type-rarities type-rarities-wrap" role="group" aria-label="Filter type eggs by rank">
          <button class="chip type-rarity on" data-rarity="all">All</button>
          ${RARITY_TIER_ORDER.map((key) => { const r = TYPE_EGG_RARITIES[key]; return `<button class="chip type-rarity" data-rarity="${key}" title="${r.name}"><span class="te-dot" style="background:${r.color}"></span><span class="tr-name">${r.name}</span></button>`; }).join('')}
        </div>
      </div>
    </div>
    <div class="type-family-browser" id="nest-type-family-browser" data-type-family-browser hidden>
      <div class="type-family-head">
        <div><b>Browse species families</b><span data-type-family-count role="status" aria-live="polite" aria-atomic="true"></span></div>
        <button class="btn btn-ghost btn-sm" type="button" data-type-family-close>Done</button>
      </div>
      <input class="type-search type-family-search" type="search" data-type-family-search placeholder="Search families or species…" aria-label="Search families or species" aria-controls="nest-type-family-list" autocomplete="off">
      <div class="type-family-list" id="nest-type-family-list" data-type-family-list role="listbox" aria-label="Species families"></div>
      <p class="tiny muted type-family-empty" data-type-family-empty hidden>No family matches that search.</p>
    </div>
    <div class="type-family-overview" data-type-family-overview hidden></div>
    <div class="type-filter-summary" data-type-filter-summary hidden>
      <div class="type-summary-copy">
        <b class="type-summary-count" data-type-summary-count></b>
        <div class="type-summary-chips" data-type-summary-chips></div>
      </div>
      <button class="btn btn-ghost btn-sm type-summary-clear" type="button" data-type-clear hidden>Clear filters</button>
    </div>
    <div class="apex-bundle-row" id="nest-apex-bundle" hidden></div>
    <div class="apex-quickbuy" id="nest-apex-quick" hidden></div>
    <div class="type-featured" data-type-featured hidden>
      <div class="type-featured-head"><b>Featured</b><span>quick picks</span></div>
      <div class="type-featured-strip" id="nest-type-featured"></div>
    </div>
    <div class="type-egg-grid" id="nest-type-shop" aria-label="Type eggs"></div>
    <div class="type-empty" data-type-empty hidden>
      <div class="type-empty-copy">
        <b>No type matches those filters.</b>
        <span class="tiny muted" data-type-empty-count></span>
      </div>
      <button class="btn btn-ghost btn-sm" type="button" data-type-empty-clear>Clear filters</button>
    </div>
    <div class="card" style="padding:12px;margin-top:14px;font-size:11px;color:var(--muted);line-height:1.6">
      <b style="color:var(--text)">How merging works</b><br>
      Two level 3+ sprites can make an egg. The little one inherits an element (or a hybrid like Steam or Twilight), a breed, colors, a personality, and maybe a rare mutation. Higher generations cost more but inherit a small XP bonus. Parents rest for a minute after.
    </div>`;

  function typeShelfIsFiltered() {
    return !!typeFilter.q.trim()
      || typeFilter.rarity !== 'all'
      || typeFilter.owned !== 'all'
      || !!typeFilter.affordable
      || !!typeFilter.family;
  }

  function typeFiltersActive() {
    return typeShelfIsFiltered() || !!typeFilter.pin;
  }

  function activeTypeFilterLabels() {
    const labels = [];
    if (typeFilter.q.trim()) labels.push(`“${typeFilter.q.trim()}”`);
    if (typeFilter.family) labels.push(`Family: ${TYPE_FAMILY_BY_ID.get(typeFilter.family)?.label || typeFilter.family}`);
    if (typeFilter.rarity !== 'all') labels.push(TYPE_EGG_RARITIES[typeFilter.rarity]?.name || typeFilter.rarity);
    if (typeFilter.owned !== 'all') labels.push(typeFilter.owned === 'owned' ? 'Owned' : 'Missing');
    if (typeFilter.affordable) labels.push('Affordable');
    if (typeFilter.pin && ELEMENTS[typeFilter.pin]) labels.push(`Pinned: ${ELEMENTS[typeFilter.pin].name}`);
    return labels;
  }

  function paintTypeFilterSummary(matches) {
    const summary = root.querySelector('[data-type-filter-summary]');
    const active = typeFiltersActive();
    if (summary) {
      summary.hidden = !active;
      if (active) {
        const count = summary.querySelector('[data-type-summary-count]');
        if (count) count.textContent = `Showing ${matches.length.toLocaleString()} of ${TYPE_EGG_SPECIES.length.toLocaleString()} type eggs`;
        const chips = summary.querySelector('[data-type-summary-chips]');
        if (chips) chips.innerHTML = activeTypeFilterLabels()
          .map((label) => `<span class="type-summary-chip">${esc(label)}</span>`).join('');
      }
    }
    const clear = root.querySelector('[data-type-clear]');
    if (clear) clear.hidden = !active;
  }

  function currentTypeSort() {
    const saved = typeof state !== 'undefined' ? state.typeEggSort : null;
    return TYPE_EGG_SORT_OPTIONS.some((option) => option.key === saved) ? saved : TYPE_EGG_SORT_DEFAULT;
  }

  function paintTypeFilterControls() {
    const search = root.querySelector('[data-type-search]');
    if (search) search.value = typeFilter.q;
    const sort = root.querySelector('[data-type-sort]');
    if (sort) sort.value = currentTypeSort();
    const syncChoice = (selector, key, active) => {
      root.querySelectorAll(selector).forEach((button) => {
        const on = button.dataset[key] === active;
        button.classList.toggle('on', on);
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };
    syncChoice('.type-owned [data-owned]', 'owned', typeFilter.owned);
    syncChoice('.type-rarities [data-rarity]', 'rarity', typeFilter.rarity);
    const affordable = root.querySelector('[data-type-affordable]');
    if (affordable) {
      affordable.classList.toggle('on', !!typeFilter.affordable);
      affordable.setAttribute('aria-pressed', typeFilter.affordable ? 'true' : 'false');
    }
    const toggle = root.querySelector('[data-type-family-toggle]');
    if (toggle) {
      const family = typeFilter.family ? TYPE_FAMILY_BY_ID.get(typeFilter.family) : null;
      const label = toggle.querySelector('[data-type-family-toggle-label]');
      if (label) label.textContent = family ? family.label : 'All families';
      toggle.classList.toggle('on', !!family);
      toggle.setAttribute('aria-pressed', family ? 'true' : 'false');
    }
  }

  function setTypeSort(value) {
    if (!TYPE_EGG_SORT_OPTIONS.some((option) => option.key === value)) return;
    if (typeof state !== 'undefined' && state.typeEggSort === value) return;
    if (typeof state !== 'undefined') state.typeEggSort = value;
    resetTypeWindow();
    if (typeof commit === 'function') commit('type-egg-sort', { sort: value });
    else paintTypeShop();
    paintTypeFilterControls();
  }

  function orderedTypeEggs(matches, owned, apexRank = null) {
    const sort = currentTypeSort();
    const rows = matches.map((key) => ({
      key,
      name: String(ELEMENTS[key]?.name || key),
      price: apexRank ? typeEggApexPrice(key, apexRank) : (Number(TYPE_EGG_PRICE[key]) || 120),
      rarity: RARITY_TIER_ORDER.indexOf(typeEggRarity(key)),
      owned: owned.has(key),
    }));
    rows.sort(TYPE_EGG_SORT_COMPARATORS[sort] || TYPE_EGG_SORT_COMPARATORS[TYPE_EGG_SORT_DEFAULT]);
    return rows.map((row) => row.key);
  }

  function clearTypeFilters() {
    Object.assign(typeFilter, TYPE_FILTER_DEFAULTS);
    paintTypeFilterControls();
    resetTypePaging();
    const browser = root.querySelector('[data-type-family-browser]');
    if (browser && !browser.hidden) paintFamilyBrowser(true);
  }

  const typeSearch = root.querySelector('[data-type-search]');
  root.querySelector('[data-open-vault]').addEventListener('click', () => openSecretVault());
  root.querySelector('[data-open-summon]').addEventListener('click', () => App.go('summon'));
  /* Each activity is one tidy tile instead of a wrapping row of buttons, and
     the old duplicate Shell Decorator entry is gone. */
  const NEST_ACTIVITIES = [
    { key: 'eggsort', icon: '🧺', name: 'Egg Sort', tag: 'Match the baskets', tint: '#ffb347' },
    { key: 'nestdefense', icon: '🪺', name: 'Nest Defense', tag: 'Guard the eggs', tint: '#ff5a4a' },
    { key: 'eggtap', icon: '🔥', name: 'Warm the Nest', tag: 'Rapid taps', tint: '#ff8a3a' },
    { key: 'eggpaint', icon: '🎨', name: 'Egg Decorator', tag: 'Paint a game shell', tint: '#b69cff' },
    { key: 'eggmatch', icon: '🧩', name: 'Egg Memory', tag: 'Match the pairs', tint: '#8be9ff' },
    { key: 'shellshine', icon: '✨', name: 'Shell Shine', tag: 'Catch the sparkle', tint: 'var(--gold)' },
    { key: 'emberrush', icon: '🪔', name: 'Incubator Rush', tag: 'Bank hatch warmth', tint: '#ff8a3a' },
    { key: 'egghunt', icon: '🥚', name: 'Egg Hunt', tag: 'Find hidden eggs', tint: 'var(--gold)' },
    { key: 'decorate', icon: '🖌️', name: 'Shell Painting', tag: 'Keep a new look', tint: '#8fe07a' },
    { key: 'dragonnest', icon: '🐉', name: 'Dragon Nest', tag: 'Form every type', tint: '#7c4dff' },
  ];
  const activityBox = root.querySelector('[data-nest-activities]');
  activityBox.innerHTML = NEST_ACTIVITIES.map((a) => `<button class="nest-activity" data-nest-activity="${a.key}" style="--tint:${a.tint}" title="${a.tag}">
      <span class="na-icon">${a.icon}</span>
      <span class="na-copy"><b>${a.name}</b><span>${a.tag}</span></span>
    </button>`).join('');
  activityBox.querySelectorAll('[data-nest-activity]').forEach((b) => {
    b.addEventListener('click', () => {
      Sfx.click();
      if (b.dataset.nestActivity === 'decorate') openEggDecorator();
      else App.startGame(b.dataset.nestActivity);
    });
  });
  const resetTypeWindow = () => {
    typeWindowSignature = '';
    if (typeShelf) typeShelf.resetWindow();
  };
  const resetTypePaging = () => {
    typeFilter.pin = null;
    writeNestFocus(null);
    resetTypeWindow();
    paintTypeShop();
  };
  typeSearch.addEventListener('input', () => {
    typeFilter.q = typeSearch.value;
    resetTypePaging();
  });
  paintTypeFilterControls();
  root.querySelector('[data-type-sort]').addEventListener('change', (event) => setTypeSort(event.target.value));
  root.querySelectorAll('[data-type-clear], [data-type-empty-clear]').forEach((btn) => btn.addEventListener('click', clearTypeFilters));
  const bindTypeFilterGroup = (selector, key, apply) => {
    const group = root.querySelector(selector);
    if (!group) return;
    group.addEventListener('click', (event) => {
      const button = event.target instanceof Element ? event.target.closest(`[data-${key}]`) : null;
      if (!button || !group.contains(button)) return;
      apply(button.dataset[key]);
      paintTypeFilterControls();
      resetTypePaging();
    });
  };
  bindTypeFilterGroup('.type-rarities', 'rarity', (value) => { typeFilter.rarity = value; });
  bindTypeFilterGroup('.type-owned', 'owned', (value) => { typeFilter.owned = value; });
  root.querySelector('[data-type-affordable]')?.addEventListener('click', () => {
    typeFilter.affordable = !typeFilter.affordable;
    paintTypeFilterControls();
    resetTypePaging();
  });

  function showBatchHatchResult(hatched, skipped = []) {
    const summary = NestBatch.summarize(hatched, skipped, (sprite) => typeName(sprite) || displayName(sprite));
    const rows = summary.rows;
    const body = `<div class="batch-hatch-summary" data-batch-summary data-batch-skipped-reveals="${summary.skippedReveals}" data-batch-skipped="${summary.skippedCount}">
      <div class="batch-hatch-total"><b>${summary.hatchedCount} egg${summary.hatchedCount === 1 ? '' : 's'} hatched</b><span>${summary.duplicateCount ? `${summary.duplicateCount} duplicate label${summary.duplicateCount === 1 ? '' : 's'} grouped` : 'Every hatchling is a different species'}${summary.shinyCount ? ` · ${summary.shinyCount} shiny` : ''}</span></div>
      <p class="batch-hatch-note">Individual reveals were skipped so the whole batch lands together. Each hatchling kept its own generated name.</p>
      <div class="batch-hatch-groups">${rows.map((row) => `<div class="batch-hatch-group" data-batch-label="${esc(row.label)}" data-batch-count="${row.count}">
        <span class="batch-hatch-art">${spriteSVG(row.list[0], { expr: 'happy' })}</span>
        <div class="batch-hatch-copy"><b>${esc(row.label)}${row.count > 1 ? ` <span class="batch-hatch-count">×${row.count}</span>` : ''}</b><span>${row.list.map((sprite) => `${esc(displayName(sprite))}${sprite.shiny ? ' ✨' : ''}`).join(' · ')}</span></div>
      </div>`).join('')}</div>
      ${summary.skippedCount ? `<p class="tiny muted batch-hatch-skipped">${summary.skippedCount} egg${summary.skippedCount === 1 ? '' : 's'} stayed in the queue.</p>` : ''}
      <button class="btn btn-primary btn-block" type="button" data-batch-done style="margin-top:12px">Back to the Nest</button>
    </div>`;
    openModal({
      title: '🐣 Batch hatch',
      sub: 'A quick summary instead of one reveal at a time.',
      body,
      onMount: (root, close) => {
        root.querySelector('[data-batch-done]')?.addEventListener('click', close);
      },
    });
  }

  function eggCard(e) {
    const ready = e.hatch >= 100;
    const rarity = typeof spriteRarity === 'function' ? spriteRarity(e) : { color: '#c9cdd2' };
    /* The hatch modal explains the cooling modes, but the rule matters before
       the tap: a frozen or lava-frozen egg shows the same note on its card. */
    const st = typeof getIncubatorState === 'function' ? getIncubatorState() : null;
    const cold = typeof coldHatchEnabled === 'function' && coldHatchEnabled()
      && typeof COLD_HATCH_BREEDS !== 'undefined' && COLD_HATCH_BREEDS.includes(e.breed);
    const cooling = !!st && (st.active === 'chill' || st.active === 'frostchill');
    const needsChill = !!cold && !ready && !!st && !cooling;
    const lavaFrozen = typeof eggIsLavaFrozen === 'function' && eggIsLavaFrozen(e);
    const lavaBoost = !!st && st.active === 'lava' && typeof eggIsLavaType === 'function' && eggIsLavaType(e);
    const frostBoost = !!st && st.active === 'frostchill' && lavaFrozen;
    const shellNote = needsChill
      ? `<div class="ec-chill" role="note" title="This egg only warms under a cooling incubator. Switch the Nest to the Chill Stone or Frost Chill to warm it.">${lavaFrozen ? '🧊 Lava-frozen · needs Frost Chill' : '❄️ Frozen · needs the Chill Stone'}</div>`
      : lavaFrozen
        ? `<div class="ec-chill" role="note" title="A lava-frozen egg: Ember heat inside a frozen shell. Frost Chill stabilizes it.">🧊 Lava-frozen${frostBoost ? ' · Frost Chill' : ''}</div>`
        : lavaBoost
          ? '<div class="ec-lava" role="note" title="Lava Mode is matched to this Ember/lava egg.">🌋 Lava Mode warming</div>'
          : '';
    return `<button class="egg-card ${ready ? 'ready' : ''} ${e.shiny ? 'is-shiny' : ''}" data-hatch="${e.id}" style="--sh-rim-a:${rarity.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2))">
      ${eggSVG(e, { progress: e.hatch })}
      <div class="ec-name">${esc(displayName(e))}</div>
      ${e.shiny ? '<div class="ec-shiny" title="A shiny egg: this hatch is guaranteed to sparkle">✨ Shiny egg</div>' : ''}
      <div class="ec-sub">${ready ? 'Ready to hatch' : `Tap to warm · ${Math.round(e.hatch)}%`}</div>
      ${shellNote}
      <div class="egg-progress"><i style="width:${e.hatch}%"></i></div>
    </button>`;
  }

  function slotHTML(key) {
    const s = picked[key] ? findSprite(picked[key]) : null;
    if (!s) {
      return `<button class="merge-slot" data-slot="${key}">
        <span style="font-size:26px;line-height:1">＋</span>
        <span>Pick a parent</span>
      </button>`;
    }
    const isEgg = s.stage === 'egg';
    const resting = !isEgg && restLeft(s) > 0;
    const detail = isEgg
      ? `Egg · ${BREEDS[s.breed]?.name || 'Puff'} breed · ${Math.round(s.hatch || 0)}%${s.shiny ? ' · ✨ shiny' : ''}`
      : `Lv ${s.level} · Gen ${(s.gen || 0) + 1}${resting ? ' · resting' : ''}`;
    return `<button class="merge-slot filled" data-slot="${key}">
      ${isEgg ? eggSVG(s, { progress: s.hatch || 0 }) : spriteSVG(s, { expr: resting ? 'sleep' : expressionFor(s) })}
      <b style="font-size:11px">${esc(displayName(s))}</b>
      <span class="tiny muted">${detail}</span>
    </button>`;
  }

  function paint() {
    root.querySelector('[data-nest-coins]').textContent = state.coins;
    const eggBox = root.querySelector('#nest-eggs');
    const list = eggs();
    if (list.length) {
      const queue = NestBatch.queueFor(list);
      const ready = queue.readyCount;
      const unready = queue.waitingCount;
      eggBox.innerHTML = `<div class="section-title" style="margin-top:0"><h2>Waiting eggs</h2><span>${list.length} cozy${ready ? ` · ${ready} ready` : ''}</span></div>
        <div class="egg-batch-bar">
          <div class="egg-batch-copy"><b>Egg queue</b><span>Warm the whole clutch, or hatch every ready shell at once.</span></div>
          <div class="egg-batch-actions">
            <button class="btn btn-soft btn-sm" type="button" data-egg-warm-all ${unready ? '' : 'disabled'}>🔥 Warm all${unready ? ` · ${unready}` : ''}</button>
            <button class="btn btn-primary btn-sm" type="button" data-egg-hatch-all ${ready ? '' : 'disabled'}>🐣 Hatch all ready${ready ? ` · ${ready}` : ''}</button>
          </div>
        </div>
        <div class="egg-row">${list.map(eggCard).join('')}</div>`;
      eggBox.querySelectorAll('[data-hatch]').forEach((b) => {
        b.addEventListener('click', () => App.openHatch(b.dataset.hatch));
      });
      eggBox.querySelector('[data-egg-warm-all]')?.addEventListener('click', () => {
        const res = Actions.warmEggs(queue.waitingIds);
        const bits = [];
        if (res.warmed.length) bits.push(`${res.warmed.length} egg${res.warmed.length === 1 ? '' : 's'} warmed`);
        if (res.readyNow) bits.push(`${res.readyNow} ready`);
        if (res.skipped.length) bits.push(`${res.skipped.length} ${res.skipped.length === 1 ? 'needs' : 'need'} the Chill Stone or Frost Chill`);
        toast(bits.join(' · ') || 'Those eggs are already warm.', res.warmed.length ? '🔥' : '❄️');
      });
      eggBox.querySelector('[data-egg-hatch-all]')?.addEventListener('click', () => {
        const res = Actions.hatchEggs(queue.readyIds);
        if (!res.hatched.length) {
          toast('No eggs are ready to hatch yet.', '🐣');
          return;
        }
        showBatchHatchResult(res.hatched, res.skipped);
      });
    } else {
      eggBox.innerHTML = `<div class="card empty-state" style="padding:20px 14px">
        <div style="font-size:30px">🪹</div>
        <p>No eggs right now. Merge two sprites or pick up a wild egg below.</p>
      </div>`;
    }

    const mergeEl = root.querySelector('#nest-merge');
    const a = picked.a ? findSprite(picked.a) : null;
    const b = picked.b ? findSprite(picked.b) : null;
    const cost = a && b ? mergeCost(a, b) : null;
    const bothEggs = !!(a && b && a.stage === 'egg' && b.stage === 'egg');
    const feeWaived = !bothEggs && typeof firstFlightMergeWaived === 'function' && firstFlightMergeWaived();
    const canFuse = !!(a && b);
    const lowLevel = canFuse && !bothEggs && (a.level < 3 || b.level < 3);
    const odds = mergeOdds(a, b);
    let mergeNote = 'Merge two sprites, or two eggs to summon a new breed';
    if (canFuse) {
      if (bothEggs) mergeNote = `Merge two eggs · new breed guaranteed · ${cost} 🪙`;
      else if (lowLevel) mergeNote = 'Both need level 3+';
      else if (feeWaived) mergeNote = 'First Flight · fee waived · hybrid guaranteed';
      else mergeNote = `Cost ${cost} coins · parents rest 60s`;
    }
    const mergeChips = bothEggs
      ? `<span class="chip">🐣 New breed</span><span class="chip chip-shine">✨ ${odds.shine}% shiny</span>`
      : `<span class="chip">🐣 ${odds.twin}% twins</span><span class="chip">✦ ${odds.combo}% special combo</span><span class="chip chip-shine">✨ ${odds.shine}% shiny</span>`;
    const mergeHelp = bothEggs
      ? 'Both shells are consumed. The new puffle hatches instantly with a breed neither parent has.'
      : 'Gene play raises all three odds. Shiny parents, hybrids, mutations, and generations help most.';
    mergeEl.innerHTML = `<div class="card" style="padding:13px">
      <div class="merge-slots">
        ${slotHTML('a')}
        <span class="merge-plus">＋</span>
        ${slotHTML('b')}
      </div>
      <div class="between" style="margin-top:11px">
        <div class="tiny muted">${mergeNote}</div>
      </div>
      <div class="breeding-odds">${mergeChips}</div>
      <div class="tiny muted" style="margin-top:5px">${mergeHelp}</div>
      <button class="btn btn-primary btn-block" data-fuse style="margin-top:10px" ${canFuse ? '' : 'disabled'}>
        ${icon('dna')} ${canFuse ? (bothEggs ? `Merge ${esc(displayName(a))} + ${esc(displayName(b))}` : `Fuse ${esc(displayName(a))} + ${esc(displayName(b))}`) : 'Choose two sprites or eggs'}
      </button>
    </div>`;
    mergeEl.querySelectorAll('[data-slot]').forEach((btn) => {
      btn.addEventListener('click', () => openPicker(btn.dataset.slot));
    });
    mergeEl.querySelector('[data-fuse]').addEventListener('click', fuse);

    const shop = root.querySelector('#nest-shop');
    shop.innerHTML = `<p class="tiny muted nest-shiny-note">✨ Any egg can arrive as a <b>Shiny Egg</b>. Every species and puffle can be inside; a shiny shell is guaranteed to hatch shiny.</p>` + EGG_KEYS.map((key, i) => {
      const t = EGG_TIERS[key];
      const pool = key === 'mythic' ? MYTHIC_EGG_POOL
        : key === 'puffle' ? puffleEggPool()
          : key === 'monthly' ? monthlyEggPool()
            : null;
      const theme = key === 'monthly' ? currentMonthlyEggTheme() : null;
      const special = !!pool;
      const sample = key === 'mythic'
        ? { id: `shop-${key}`, element: 'motherearth', stage: 'egg', palette: 'prism', pattern: 'spots' }
        : key === 'puffle'
          ? { id: `shop-${key}`, element: pool[i % pool.length] || 'bloom', stage: 'egg', palette: 'native', pattern: 'spots' }
          : key === 'monthly'
            ? { id: `shop-${key}`, element: pool[i % pool.length] || 'radiant', stage: 'egg', palette: 'prism', pattern: 'spots' }
            : { id: `shop-${key}`, element: ['tide', 'bloom', 'dusk'][i % 3], stage: 'egg', palette: i === 2 ? 'prism' : 'native', pattern: 'spots' };
      const poolNames = pool ? pool.slice(0, 3).map((k) => ELEMENTS[k]?.name || k).join(' · ') : '';
      const poolRest = pool ? Math.max(0, pool.length - 3) : 0;
      const badge = key === 'mythic'
        ? '✦ MYTHIC POOL'
        : key === 'puffle'
          ? '🐾 PUFFLE POOL'
          : key === 'monthly'
            ? `${theme.icon} ${theme.name.toUpperCase()}`
            : '';
      return `<div class="rowcard${special ? ' mythic-row' : ''}">
        <span class="rc-art">${eggSVG(sample, { progress: 20 })}</span>
        <span style="flex:1;min-width:0"><b style="font-size:12.5px">${t.name}${badge ? ` <span class="mythic-badge">${badge}</span>` : ''}</b><br><span class="tiny muted">${t.desc}</span>${special ? `<span class="mythic-pool">${key === 'monthly' ? `${theme.icon} ${theme.name} · ` : ''}${poolNames}${poolRest ? ` + ${poolRest} more` : ''}</span>` : ''}</span>
        <button class="btn btn-sm btn-gold" data-buy="${key}" ${state.coins < t.price ? 'disabled style="opacity:.5"' : ''}>${t.price} 🪙</button>
      </div>`;
    }).join('');
    shop.querySelectorAll('[data-buy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.buy;
        await buyEggAndOpen(
          EGG_TIERS[key].name,
          EGG_TIERS[key].price,
          () => Actions.buyEgg(key),
          key === 'mythic'
            ? 'A Mythic Egg joined the Nest — a legend is inside.'
            : key === 'puffle'
              ? 'A Puffle Egg joined the Nest — a puffle is inside.'
              : key === 'monthly'
                ? `A ${currentMonthlyEggTheme().name} Monthly Challenge Egg joined the Nest!`
                : 'A new egg joined the Nest!',
        );
      });
    });

    paintIncubators();
    paintTierShop();
    paintTypeShop();
  }

  function paintIncubators() {
    const box = root.querySelector('[data-incubators]');
    if (!box || typeof INCUBATOR_TYPES === 'undefined') return;
    const st = getIncubatorState();
    const heating = INCUBATOR_TYPES[st.active] || INCUBATOR_TYPES.warm;
    const chip = root.querySelector('[data-incubator-chip]');
    if (chip) chip.textContent = `${heating.icon} ${heating.name} · ${heating.speedMult}x`;
    const count = root.querySelector('[data-nest-activity-count]');
    if (count) {
      const warming = eggs().length;
      count.textContent = `${NEST_ACTIVITIES.length} activities · ${warming} egg${warming === 1 ? '' : 's'} warming`;
    }
    box.innerHTML = INCUBATOR_KEYS.map((key) => {
      const inc = INCUBATOR_TYPES[key];
      const unlocked = !!st[key];
      const active = st.active === key;
      const mut = Math.round(inc.mutBonus * 100);
      return `<button class="incubator-chip ${unlocked ? 'on' : ''} ${active ? 'active' : ''}" data-incubator="${key}" style="--ic-tint:${inc.tint || 'var(--gold)'}">
        <span class="ic-icon">${inc.icon}</span>
        <span class="ic-body"><b>${inc.name}</b><span class="ic-meta">${unlocked ? (active ? `heating now · ${inc.speedMult}x` : `${inc.speedMult}x · +${mut}% mut`) : `${inc.cost} 🪙`}</span></span>
      </button>`;
    }).join('');
    box.querySelectorAll('[data-incubator]').forEach((btn) => btn.addEventListener('click', async () => {
      const key = btn.dataset.incubator;
      const now = getIncubatorState();
      if (now[key]) {
        Actions.setIncubator(key);
        Sfx.click();
        const switched = INCUBATOR_TYPES[key];
        toast(key === 'off'
          ? '⭕ The heat is off — eggs will warm at their own slow pace.'
          : key === 'chill'
            ? '❄️ The Chill Stone is cooling the Nest. Frozen eggs warm here.'
            : key === 'frostchill'
              ? '🧊 Frost Chill is steadying the Nest. Frozen and lava-frozen eggs warm here.'
              : key === 'lava'
                ? '🌋 Lava Mode is heating the Nest. Lava eggs warm fastest here.'
                : `${switched.icon} ${switched.name} is warming the Nest.`, switched.icon);
        return;
      }
      const inc = INCUBATOR_TYPES[key];
      await guardedPurchase(
        inc.name,
        inc.cost || 0,
        () => Actions.unlockIncubator(key),
        (purchase) => Actions.undoIncubatorPurchase(key, purchase.cost, purchase.previousActive),
        { verb: 'Install', emoji: inc.icon, done: `${inc.name} installed — every warm tap counts for more.`, alwaysConfirm: true },
      );
    }));
  }

  function openEggDecorator() {
    const list = eggs();
    if (!list.length) {
      toast('Buy or merge an egg first — the decorator needs a shell.', '🎨');
      return;
    }
    let chosen = list[0].id;
    openSheet({
      key: 'egg-decorator',
      title: '🎨 Egg Shell Decorator',
      sub: 'Paint a waiting egg. 40 coins per change, and the shell keeps the new look.',
      body: '<div data-decor-body></div>',
      onMount: (sheet) => {
        const box = sheet.querySelector('[data-decor-body]');
        const render = () => {
          const egg = findSprite(chosen) || list[0];
          const pattern = egg.pattern || 'spots';
          const palette = egg.palette || 'native';
          box.innerHTML = `
            <div class="row" style="gap:5px;flex-wrap:wrap;margin:2px 0 10px">
              ${list.map((e) => `<button class="chip ${e.id === chosen ? 'on' : ''}" data-decor-egg="${e.id}">${esc(displayName(e))} · ${Math.round(e.hatch)}%</button>`).join('')}
            </div>
            <div class="decor-preview">${eggSVG({ ...egg, pattern, palette }, { progress: egg.hatch || 20 })}</div>
            <div class="tiny muted" style="margin-top:10px;font-weight:800;letter-spacing:.08em">PATTERN</div>
            <div class="row" style="gap:5px;flex-wrap:wrap;margin:5px 0 9px">
              ${PATTERN_KEYS.map((k) => `<button class="chip ${pattern === k ? 'on' : ''}" data-decor-pattern="${k}">${esc(PATTERNS[k].name)}</button>`).join('')}
            </div>
            <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">SHELL PALETTE</div>
            <div class="row" style="gap:6px;flex-wrap:wrap;margin:5px 0 11px">
              ${PALETTE_KEYS.map((k) => `<button class="decor-swatch ${palette === k ? 'on' : ''}" data-decor-palette="${k}" title="${esc(PALETTES[k].name || k)}" style="--sw:${resolvePalette({ palette: k }).body}"></button>`).join('')}
            </div>
            <button class="btn btn-primary btn-block" data-decor-apply>Paint this shell · 40 🪙</button>`;
          box.querySelectorAll('[data-decor-egg]').forEach((b) => b.addEventListener('click', () => { chosen = b.dataset.decorEgg; Sfx.click(); render(); }));
          box.querySelectorAll('[data-decor-pattern]').forEach((b) => b.addEventListener('click', () => {
            const target = findSprite(chosen);
            Actions.decorateEgg(chosen, { pattern: b.dataset.decorPattern, palette: target.palette });
            Sfx.click();
            render();
            paint();
          }));
          box.querySelectorAll('[data-decor-palette]').forEach((b) => b.addEventListener('click', () => {
            const target = findSprite(chosen);
            Actions.decorateEgg(chosen, { pattern: target.pattern, palette: b.dataset.decorPalette });
            Sfx.click();
            render();
            paint();
          }));
          box.querySelector('[data-decor-apply]')?.addEventListener('click', () => {
            const target = findSprite(chosen);
            const res = Actions.decorateEgg(chosen, { pattern: target.pattern, palette: target.palette });
            if (!res.ok && res.reason === 'coins') { toast('Decorating costs 40 coins.', '🪙'); return; }
            Sfx.win();
            toast(`${displayName(target)} has a freshly painted shell.`, '🎨');
            paint();
          });
        };
        render();
      },
    });
  }

  /* Each card needs a shell, not an empty span — the ladder read as a plain
     text list of ranks before, which is why the higher tiers looked missing. */
  function tierEggArt(key, tier) {
    const stops = Array.isArray(tier.stops) && tier.stops.length ? tier.stops : ['#ffffff', tier.color, '#1a1030'];
    const stopMarkup = stops.map((color, i) => `<stop offset="${(i / Math.max(1, stops.length - 1)).toFixed(2)}" stop-color="${color}"/>`).join('');
    return `<svg viewBox="0 0 24 30" aria-hidden="true">
      <defs><linearGradient id="tegg-${key}" x1="0" y1="0" x2="1" y2="1">${stopMarkup}</linearGradient></defs>
      <path d="M12 1.6c4.9 0 8.8 6.6 8.8 13.3 0 8-3.9 13.5-8.8 13.5S3.2 22.9 3.2 14.9C3.2 8.2 7.1 1.6 12 1.6z" fill="url(#tegg-${key})" stroke="${tier.color}" stroke-width="1.2"/>
    </svg>`;
  }

  function paintTierShop() {
    const box = root.querySelector('#nest-tier-shop');
    if (!box) return;
    const owned = new Set(state.sprites.map((sprite) => sprite.element).filter(Boolean));
    box.innerHTML = RARITY_TIER_ORDER.map((key) => {
      const meta = TIER_EGG_META[key];
      const tier = TYPE_EGG_RARITIES[key];
      const pool = typeof tierEggBandPool === 'function' ? tierEggBandPool(key) : [];
      const soldOut = pool.length === 0;
      const pinnedKey = typeof bandPinFor === 'function' ? bandPinFor(key) : null;
      const windowPool = typeof tierEggFeaturedPool === 'function' ? tierEggFeaturedPool(key, new Date(), pinnedKey) : pool;
      const pinnedLabel = pinnedKey && windowPool.length < pool.length && ELEMENTS[pinnedKey]
        ? ` · 📌 ${esc(ELEMENTS[pinnedKey].name)}` : '';
      const rotating = windowPool.length < pool.length;
      const left = windowPool.reduce((count, member) => count + (owned.has(member) ? 0 : 1), 0);
      /* An empty band is a content bug the gate catches before it ships, so the
         card only has to say so; buying it refuses without charging. */
      const disabled = soldOut || state.coins < meta.price ? ' disabled' : '';
      const windowLabel = rotating ? 'Featured · ' : '';
      const label = soldOut ? 'No species yet'
        : `${windowLabel}${meta.price.toLocaleString()} 🪙 · ${left ? `${left} of ${windowPool.length} ${rotating ? 'featured today' : 'still unowned'}` : `${rotating ? 'window complete' : 'band complete'} · dupes only`}${pinnedLabel}`;
      const hint = soldOut
        ? `No species owns ${tier.name} rank yet`
        : `${tier.eggName || `${tier.name} egg`} — ${meta.desc} · any of ${pool.length} ${tier.name} species`;
      return `<button class="tier-egg-card${tier.animated ? ' animated-rarity' : ''}" data-buy-tier="${key}" style="--tier:${tier.color};--tier-gradient:${tier.gradient || tier.color};--tier-glow:${tier.frameGlow || tier.color};--sh-rim-a:${tier.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2))" ${disabled} title="${hint}">
        <span class="tegg-art">${tierEggArt(key, tier)}</span>
        <span class="tegg-copy"><b>${tier.name}</b><span>${label}</span></span>
      </button>`;
    }).join('');
    box.querySelectorAll('[data-buy-tier]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.buyTier;
        const name = TYPE_EGG_RARITIES[key].name;
        await buyEggAndOpen(
          `${name} tier egg`,
          TIER_EGG_META[key].price,
          () => Actions.buyTierEgg(key),
          `A ${name} tier egg joined the Nest!`,
        );
      });
    });
    paintTierPins();
  }

  /* A pinned species is in its band's window every day, so the one Secret you
     want does not wait out a 118-day rotation. The window keeps its slots, so
     the ceiling on a named species does not move. */
  function paintTierPins() {
    const box = root.querySelector('#nest-tier-pins');
    if (!box) return;
    const owned = new Set(state.sprites.map((sprite) => sprite.element).filter(Boolean));
    const rows = RARITY_TIER_ORDER.map((key) => {
      const pool = typeof tierEggBandPool === 'function' ? tierEggBandPool(key) : [];
      if (pool.length <= 1) return '';
      const plain = typeof tierEggFeaturedPool === 'function' ? tierEggFeaturedPool(key, new Date(), null) : pool;
      if (plain.length >= pool.length) return '';
      const pinned = typeof bandPinFor === 'function' ? bandPinFor(key) : null;
      const pinName = pinned && ELEMENTS[pinned] ? ELEMENTS[pinned].name : '';
      /* On sale is not the same as yours: the window draw is uniform, so the
         pinned species can also be bought outright for what rolling what is
         left of the window averages, which falls as the band fills. */
      const namedPrice = pinned && !owned.has(pinned) ? tierBandNamedPrice(key) : 0;
      return `<div class="tier-pin-row" data-pin-band="${key}">
        <span class="tier-pin-band">${esc(TYPE_EGG_RARITIES[key].name)}</span>
        <span class="tier-pin-slot">${pinned ? `📌 ${esc(pinName)}${owned.has(pinned) ? ' · owned' : ''}` : 'No pin — the window rotates'}</span>
        <span class="tier-pin-actions">
          ${namedPrice ? `<button class="chip" type="button" data-pin-buy="${key}">Buy ${namedPrice.toLocaleString()} 🪙</button>` : ''}
          <button class="chip" type="button" data-pin-open="${key}">${pinned ? 'Change' : 'Pin'}</button>
          ${pinned ? `<button class="chip" type="button" data-pin-clear="${key}">Clear</button>` : ''}
        </span>
      </div>`;
    }).filter(Boolean).join('');
    box.innerHTML = rows
      ? `<div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:12px 2px 6px">PIN A SPECIES</div>${rows}
        <p class="tiny muted" style="margin:6px 2px 0;line-height:1.5">A pinned species takes one of its band's featured slots, so it is on sale every day. The window roll is still a roll: buy it outright for what rolling what is left averages, so it gets cheaper as you fill the band.</p>`
      : '';
    box.querySelectorAll('[data-pin-open]').forEach((button) => {
      button.addEventListener('click', () => { Sfx.click(); openBandPinSheet(button.dataset.pinOpen); });
    });
    box.querySelectorAll('[data-pin-buy]').forEach((button) => {
      button.addEventListener('click', async () => {
        const tierKey = button.dataset.pinBuy;
        const species = typeof bandPinFor === 'function' ? bandPinFor(tierKey) : null;
        if (!species) return;
        const name = (ELEMENTS[species] && ELEMENTS[species].name) || species;
        await buyEggAndOpen(
          `${name} ${TYPE_EGG_RARITIES[tierKey].name} egg`,
          tierBandNamedPrice(tierKey),
          () => Actions.buyBandNamed(tierKey),
          `${name} joined the Nest!`,
        );
      });
    });
    box.querySelectorAll('[data-pin-clear]').forEach((button) => {
      button.addEventListener('click', () => {
        const tierKey = button.dataset.pinClear;
        Actions.unpinBandSpecies(tierKey);
        Sfx.click();
        toast(`${TYPE_EGG_RARITIES[tierKey].name} window follows its rotation again.`, '📌');
      });
    });
  }

  function openBandPinSheet(tierKey) {
    const pool = typeof tierEggBandPool === 'function' ? tierEggBandPool(tierKey) : [];
    if (!pool.length) { toast('No species owns that rank yet.', '🥚'); return; }
    const owned = new Set(state.sprites.map((sprite) => sprite.element).filter(Boolean));
    const nameOf = (key) => (ELEMENTS[key] && ELEMENTS[key].name) || key;
    const rowsFor = (query) => {
      const needle = String(query || '').trim().toLowerCase();
      const matches = pool
        .filter((key) => !needle || `${nameOf(key)} ${key}`.toLowerCase().includes(needle))
        .slice(0, 60);
      if (!matches.length) return '<p class="tiny muted" style="margin:8px 2px">No species match that name.</p>';
      return matches.map((key) => `<button class="pin-species-row" type="button" data-pin-pick="${esc(key)}">
          <span class="pin-species-name">${esc(nameOf(key))}</span>
          <span class="tiny muted">${owned.has(key) ? 'owned' : 'not owned'}</span>
        </button>`).join('');
    };
    const { close } = openSheet({
      title: `Pin a ${TYPE_EGG_RARITIES[tierKey].name}`,
      sub: `The pinned species is featured every day and can be bought outright for the average cost of rolling what is left of the window. The window keeps its slots, so one named species never costs more than the band allows. ${pool.length} species to choose from.`,
      body: `<input class="type-search" type="search" data-pin-search placeholder="Search ${pool.length} species…" aria-label="Search species to pin" autocomplete="off">
        <div class="pin-list" data-pin-list>${rowsFor('')}</div>`,
      onMount: (sheetRoot) => {
        const list = sheetRoot.querySelector('[data-pin-list]');
        const search = sheetRoot.querySelector('[data-pin-search]');
        if (search && list) {
          search.addEventListener('input', () => { list.innerHTML = rowsFor(search.value); });
        }
        if (!list) return;
        list.addEventListener('click', (event) => {
          const pick = event.target.closest('[data-pin-pick]');
          if (!pick) return;
          const res = Actions.pinBandSpecies(tierKey, pick.dataset.pinPick);
          if (!res.ok) {
            toast('That species cannot be pinned to this band.', '📌');
            Sfx.error();
            return;
          }
          Sfx.click();
          close();
          toast(`📌 ${nameOf(res.species)} is featured every day.`, '📌');
        });
      },
    });
  }

  function paintStarterPath(collected) {
    const box = root.querySelector('[data-type-starter]');
    if (!box) return;
    const filtering = typeShelfIsFiltered();
    box.hidden = filtering;
    if (filtering) return;
    const done = starterEggs.filter((key) => collected.has(key)).length;
    const next = starterEggs.find((key) => !collected.has(key));
    box.innerHTML = `<div class="starter-head"><div><div class="eyebrow">A gentle first lap</div><h3>Starter path</h3></div><span class="chip">${done} / ${starterEggs.length} collected</span></div>
      <p class="tiny muted">Eight common eggs across the elements. Pick any next step; the path ticks off as they join your collection.</p>
      <div class="starter-row">${starterEggs.map((key, index) => {
        const element = ELEMENTS[key];
        const basePrice = TYPE_EGG_PRICE[key] || 120;
        const tier = TYPE_EGG_RARITIES[typeEggRarity(key)];
        const isCollected = collected.has(key);
        const isNext = key === next;
        const canBuy = !isCollected && state.coins >= basePrice;
        return `<button class="starter-card${isCollected ? ' collected' : ''}${isNext ? ' next' : ''}" type="button" data-starter-key="${key}" ${isCollected || !canBuy ? 'disabled' : ''} title="${isCollected ? 'Already collected' : `${tier.name} ${element.name} egg — ${basePrice} coins`}" style="--tier:${tier.color};--egg:${element.primary};--sh-rim-a:${tier.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2))">
          <span class="starter-step">${isCollected ? '✓' : index + 1}</span>
          <span class="te-art"><i></i></span>
          <b>${esc(element.name)}</b>
          <small>${tier.name} · ${basePrice} 🪙</small>
          <span class="starter-state">${isCollected ? 'Collected' : !canBuy ? `Need ${basePrice}` : isNext ? 'Next' : 'Buy'}</span>
        </button>`;
      }).join('')}</div>`;
    box.querySelectorAll('[data-starter-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        /* The row disables collected steps, but a double-tap can still reach
           this listener before the repaint: recheck live state. */
        if (collectedTypeEggSpecies().has(btn.dataset.starterKey)) return;
        buyType(btn.dataset.starterKey, null);
      });
    });
  }

  /* Apex filters also offer random bundles, so a set of high-rank eggs is
     one tap instead of picking every species by hand. */
  function paintApexBundle(apexRank) {
    const box = root.querySelector('#nest-apex-bundle');
    if (!box) return;
    if (!apexRank) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    const tier = TYPE_EGG_RARITIES[apexRank];
    box.hidden = false;
    box.innerHTML = TYPE_EGG_BULK_DEALS.map((deal) => {
      const price = typeEggBulkPrice(apexRank, deal.size);
      const off = Math.round(deal.off * 100);
      return `<button class="apex-bundle" data-buy-bundle="${deal.size}" style="--tier:${tier.color};--tier-gradient:${tier.gradient || tier.color};--tier-glow:${tier.frameGlow || tier.color};--sh-rim-a:${tier.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2))" ${state.coins < price ? 'disabled' : ''} title="${deal.size} random ${tier.name} type eggs at ${off}% off">
        <b>Buy ${deal.size} ${tier.name} eggs</b>
        <span>random types · ${off}% off · ${price.toLocaleString()} 🪙</span>
      </button>`;
    }).join('');
    box.querySelectorAll('[data-buy-bundle]').forEach((btn) => btn.addEventListener('click', async () => {
      const size = Number(btn.dataset.buyBundle);
      const deal = TYPE_EGG_BULK_DEALS.find((entry) => entry.size === size);
      await guardedPurchase(
        `${size} ${tier.name} eggs`,
        typeEggBulkPrice(apexRank, size),
        () => Actions.buyTypeEggBulk(apexRank, size),
        undoPurchasedEggs,
        { done: `${size} ${tier.name} eggs joined the Nest — ${Math.round(deal.off * 100)}% off.` },
      );
    }));
  }

  async function buyType(key, rank) {
    const price = rank ? typeEggApexPrice(key, rank) : (TYPE_EGG_PRICE[key] || 120);
    const label = rank
      ? `${ELEMENTS[key].name} ${TYPE_EGG_RARITIES[rank].name} egg`
      : `${ELEMENTS[key].name} egg`;
    await buyEggAndOpen(
      label,
      price,
      () => Actions.buyTypeEgg(key, rank),
      `${label} joined the Nest.`,
    );
  }

  /* Fill the selected family's cheapest gap with one named egg: always
     confirmed, capped, duplicate-safe, and undoable through the shared
     purchase toast. */
  async function buyFamilyMissing(familyId) {
    const family = familyId ? TYPE_FAMILY_BY_ID.get(familyId) : null;
    if (!family || typeof FamilyCompletion === 'undefined') return;
    const candidate = FamilyCompletion.missingEgg(family, state.sprites);
    if (!candidate) {
      toast('Every type egg in this family is home.', '🧬');
      return;
    }
    if (candidate.overCap) {
      toast(`${candidate.name} costs ${candidate.price.toLocaleString()} coins — over the ${candidate.cap.toLocaleString()} family cap.`, '🪙');
      return;
    }
    const res = await buyEggAndOpen(
      `${candidate.name} egg`,
      candidate.price,
      () => Actions.buyFamilyMissing(family.id),
      `${candidate.name} joined the Nest!`,
      { alwaysConfirm: true },
    );
    if (res) paintTypeShop();
  }

  /* The pinned card also gets a bar of its own, so one tap buys the egg that
     was deep-linked from the Types tab without hunting for the card. */
  function paintQuickBuy(pinnedKey, apexRank) {
    const box = root.querySelector('#nest-apex-quick');
    if (!box) return;
    if (!pinnedKey) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    const rank = apexRank || null;
    const price = rank ? typeEggApexPrice(pinnedKey, rank) : (TYPE_EGG_PRICE[pinnedKey] || 120);
    const rarity = TYPE_EGG_RARITIES[rank || typeEggRarity(pinnedKey)];
    box.hidden = false;
    box.style.setProperty('--tier', rarity.color);
    box.style.setProperty('--tier-gradient', rarity.gradient || rarity.color);
    box.style.setProperty('--tier-glow', rarity.frameGlow || rarity.color);
    box.innerHTML = `<span class="aq-info"><b>${ELEMENTS[pinnedKey].name} ${rarity.name} egg</b><span>pinned from Types · ${price.toLocaleString()} 🪙 · ${typeof window.puffleEconomyChips === 'function' ? window.puffleEconomyChips(pinnedKey, rank) : ''}</span></span>
      <button class="btn btn-primary aq-buy" ${state.coins < price ? 'disabled' : ''}>Quick buy · ${price.toLocaleString()} 🪙</button>
      <button class="aq-close" aria-label="Clear pinned egg" title="Clear pinned egg">✕</button>`;
    box.querySelector('.aq-buy').addEventListener('click', () => buyType(pinnedKey, rank));
    /* Dismissing keeps the rarity filter and search exactly as they are. */
    box.querySelector('.aq-close').addEventListener('click', () => {
      typeFilter.pin = null;
      writeNestFocus(null);
      paintTypeShop();
      toast('Pinned egg cleared.');
    });
  }

  function typeEggCardHTML(key, apexRank, pinned, gridIndex = null) {
    const element = ELEMENTS[key];
    const price = apexRank ? typeEggApexPrice(key, apexRank) : (TYPE_EGG_PRICE[key] || 120);
    const tier = TYPE_EGG_RARITIES[apexRank || typeEggRarity(key)];
    return `<button class="type-egg${apexRank ? ' apex' : ''}" data-buy-type="${key}"${apexRank ? ` data-buy-rank="${apexRank}"` : ''}${gridIndex === null ? '' : ` data-grid-index="${gridIndex}" tabindex="-1" aria-posinset="${gridIndex + 1}" aria-setsize="${typeWindowOrdered.length}"`} title="${tier.name} ${element.name} egg" style="--tier:${tier.color};--tier-gradient:${tier.gradient || tier.color};--tier-glow:${tier.frameGlow || tier.color};--sh-rim-a:${tier.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2));border-color:${apexRank ? `${tier.color}99` : `${element.primary}66`}">
      <span class="te-art" style="--egg:${element.primary}"><i></i></span>
      <b><span class="te-dot" style="background:${tier.gradient || tier.color}"></span>${esc(element.name)}</b>
      ${typeWindowOwned.has(key) ? '<span class="te-owned">✓ Owned</span>' : ''}
      ${apexRank ? `<span class="te-rank">${tier.name}</span>` : ''}
      <span class="te-price">${price.toLocaleString()} 🪙</span>
      ${typeof window.puffleEconomyChips === 'function' ? window.puffleEconomyChips(key, apexRank) : ''}
    </button>`;
  }

  function bindTypeEggCards(container) {
    container.querySelectorAll('[data-buy-type]').forEach((btn) => {
      const key = btn.dataset.buyType;
      const rank = btn.dataset.buyRank || null;
      if (key === typeWindowPinned) btn.classList.add('apex-focus');
      btn.disabled = state.coins < (rank ? typeEggApexPrice(key, rank) : (TYPE_EGG_PRICE[key] || 120));
      btn.addEventListener('click', () => buyType(key, rank));
    });
  }

  function paintFeaturedTypeEggs(keys, apexRank) {
    const box = root.querySelector('[data-type-featured]');
    const strip = root.querySelector('#nest-type-featured');
    if (!box || !strip) return;
    if (!keys.length) {
      box.hidden = true;
      strip.innerHTML = '';
      return;
    }
    box.hidden = false;
    strip.innerHTML = keys.map((key) => typeEggCardHTML(key, apexRank, typeWindowPinned)).join('');
    bindTypeEggCards(strip);
  }

  function typeGridTop(typeShop) {
    return root.scrollTop + typeShop.getBoundingClientRect().top - root.getBoundingClientRect().top;
  }

  /* The flex row is sized from the card's layout width, not its transformed
     bounding box: apex-focus scales the card, but that must not change the
     column step. Spacer widths add the gaps between the cards in a full row. */
  function typeGridMetrics(typeShop) {
    const styles = getComputedStyle(typeShop);
    const rowGap = parseFloat(styles.rowGap) || 0;
    const columnGap = parseFloat(styles.columnGap) || 0;
    const available = Math.max(0, typeShop.clientWidth
      - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0));
    const columns = Math.max(1, Math.floor((available + columnGap) / (112 + columnGap)));
    typeShop.style.setProperty('--type-egg-gap', `${columnGap}px`);
    typeShop.style.setProperty('--type-egg-columns', String(columns));
    const sample = typeShop.querySelector('.type-egg');
    const cardWidth = sample
      ? parseFloat(getComputedStyle(sample).width) || sample.offsetWidth
      : Math.max(0, (available - (columns - 1) * columnGap) / columns);
    const cardHeight = sample ? sample.offsetHeight : TYPE_EGG_GRID_ROW;
    return {
      rowGap,
      columnGap,
      cardWidth,
      cardHeight,
      rowStep: cardHeight + rowGap,
      spacerWidth: columns * cardWidth + (columns - 1) * columnGap,
      columns,
    };
  }

  function scheduleTypeGridPaint() {
    if (typeScrollFrame) return;
    typeScrollFrame = setTimeout(() => {
      typeScrollFrame = 0;
      const shop = root.querySelector('#nest-type-shop');
      if (shop && root.isConnected) paintTypeGrid(shop);
    }, 16);
  }

  function focusTypeEgg(index) {
    if (!typeShelf) return;
    typeShelf.focusIndex(index);
    announceTypeRange();
  }

  function onTypeGridKeydown(event) {
    const card = event.target instanceof Element ? event.target.closest('[data-grid-index]') : null;
    if (!card) return;
    const index = Number(card.dataset.gridIndex);
    if (!Number.isFinite(index)) return;
    const columns = Math.max(1, (typeShelf && typeShelf.columns) || 1);
    let next = null;
    if (event.key === 'ArrowRight') next = index + 1;
    else if (event.key === 'ArrowLeft') next = index - 1;
    else if (event.key === 'ArrowDown') next = index + columns;
    else if (event.key === 'ArrowUp') next = index - columns;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = typeWindowOrdered.length - 1;
    else if (event.key === 'PageDown') next = index + columns * 4;
    else if (event.key === 'PageUp') next = index - columns * 4;
    if (next === null) return;
    event.preventDefault();
    focusTypeEgg(next);
  }

  function bindTypeGridEvents() {
    if (typeScrollBound) return;
    typeScrollBound = true;
    root.addEventListener('scroll', scheduleTypeGridPaint, { passive: true });
    window.addEventListener('resize', scheduleTypeGridPaint);
    const typeShop = root.querySelector('#nest-type-shop');
    if (typeShop) {
      typeShop.addEventListener('keydown', onTypeGridKeydown);
      if (typeof ResizeObserver === 'function') {
        typeGridWidth = typeShop.clientWidth;
        typeGridObserver = new ResizeObserver((entries) => {
          const width = entries[0]?.contentRect.width || 0;
          if (Math.abs(width - typeGridWidth) < 0.5) return;
          typeGridWidth = width;
          scheduleTypeGridPaint();
        });
        typeGridObserver.observe(typeShop);
      }
    }
  }

  function typeRangeParts() {
    const total = typeWindowOrdered.length;
    const start = typeShelf ? typeShelf.start : 0;
    const count = typeShelf ? typeShelf.count : 0;
    return { total, start, end: start + count };
  }

  let typeRangeAnnouncement = '';

  function announceTypeRange() {
    const live = root.querySelector('[data-type-range-live]');
    if (!live) return;
    const { total, start, end } = typeRangeParts();
    const message = total
      ? `Showing type eggs ${start + 1}–${end} of ${total}.`
      : 'No type eggs match the current filters.';
    if (message === typeRangeAnnouncement) return;
    typeRangeAnnouncement = message;
    live.textContent = message;
  }

  function paintTypeGrid(typeShop) {
    const total = typeWindowOrdered.length;
    if (!typeShelf) return;
    typeShelf.setItems(typeWindowOrdered);
    const painted = typeShelf.paint();
    const count = painted ? painted.count : 0;
    const range = typeRangeParts();
    typeShop.setAttribute('aria-label', total
      ? `Type eggs, showing ${range.start + 1}–${range.end} of ${range.total}`
      : 'Type eggs, no matches');
    const countEl = root.querySelector('[data-type-count]');
    if (countEl) {
      const filtered = total === TYPE_EGG_SPECIES.length
        ? `${TYPE_EGG_SPECIES.length} type eggs`
        : `${total} of ${TYPE_EGG_SPECIES.length} type eggs`;
      countEl.textContent = `${filtered} · ${count} shown`;
    }
    bindTypeGridEvents();
  }

  /* A snapshot of the chosen family: what it is, how much of it is home, the
     cheapest gap, and the milestone rewards still to claim. */
  function paintFamilyOverview(family) {
    const box = root.querySelector('[data-type-family-overview]');
    if (!box) return;
    if (!family) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    const sortedNames = family.species
      .map((key) => ELEMENTS[key]?.name || key)
      .sort((a, b) => a.localeCompare(b));
    const description = family.description
      || (family.count === 1
        ? `A single type egg: ${sortedNames[0]}.`
        : `A ${family.count}-egg family, from ${sortedNames[0]} to ${sortedNames[sortedNames.length - 1]}.`);
    const living = ownedTypeEggSpecies();
    const owned = new Set(family.species.filter((key) => living.has(key)));
    const completion = typeof FamilyCompletion !== 'undefined'
      ? FamilyCompletion.status(family, state.sprites, state.familyClaims)
      : null;
    const ownedCount = owned.size;
    const missingCount = family.count - ownedCount;
    const prices = family.species.map((key) => TYPE_EGG_PRICE[key] || 120);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rarities = RARITY_TIER_ORDER.map((key) => ({
      key,
      tier: TYPE_EGG_RARITIES[key],
      count: family.species.filter((species) => typeEggRarity(species) === key).length,
    })).filter((entry) => entry.count > 0);
    const buyGap = typeof FamilyCompletion !== 'undefined'
      ? FamilyCompletion.missingEgg(family, state.sprites)
      : null;
    const buyCap = typeof FamilyCompletion !== 'undefined' ? FamilyCompletion.BUY_CAP : 1000;
    const milestoneRows = completion ? completion.milestones.map((milestone, index) => {
      const claimed = index < completion.claimed;
      const ready = !claimed && index === completion.claimed && ownedCount >= milestone.need;
      const remaining = Math.max(0, milestone.need - ownedCount);
      return `<div class="tfo-milestone${claimed ? ' is-claimed' : ready ? ' is-ready' : ''}">
        <span class="tfo-ms-share">${milestone.percent}%</span>
        <span class="tfo-ms-need">${milestone.need} species · ${milestone.coins.toLocaleString()} 🪙</span>
        ${claimed ? '<em>Claimed</em>' : ready
          ? `<button class="btn btn-primary btn-sm" type="button" data-family-claim="${index}">Claim</button>`
          : `<em>${remaining} to go</em>`}
      </div>`;
    }).join('') : '';
    box.innerHTML = `
      <div class="tfo-head">
        <div><div class="eyebrow">Family overview</div><h3 data-family-title>${esc(family.label)}</h3></div>
        <span class="chip">${ownedCount} / ${family.count} owned</span>
      </div>
      <p class="tiny muted tfo-desc" data-family-description>${esc(description)}</p>
      <div class="health-stats tfo-stats">
        <div><b data-family-owned>${ownedCount}</b><span>owned</span></div>
        <div><b data-family-missing>${missingCount}</b><span>missing</span></div>
        <div><b data-family-price-range>${minPrice.toLocaleString()}–${maxPrice.toLocaleString()}</b><span>coin range</span></div>
      </div>
      <div class="row tfo-rarities">${rarities.map((entry) => `<span class="chip" data-family-rarity="${entry.key}" data-family-rarity-count="${entry.count}" style="border-color:${entry.tier.color}66"><span class="te-dot" style="background:${entry.tier.color}"></span>${entry.tier.name} ${entry.count}</span>`).join('')}</div>
      ${buyGap ? `<div class="tfo-buy${buyGap.overCap ? ' is-locked' : ''}" data-family-cheapest="${buyGap.key}">
        <div class="tfo-buy-copy">
          <b>Cheapest unowned · ${esc(buyGap.name)}</b>
          <span>${buyGap.price.toLocaleString()} 🪙 · no duplicate species${buyGap.overCap ? ` · over the ${buyGap.cap.toLocaleString()} 🪙 family cap` : ''}</span>
        </div>
        ${buyGap.overCap
          ? '<span class="chip">Over cap</span>'
          : `<button class="btn btn-gold btn-sm" type="button" data-family-buy-missing ${state.coins < buyGap.price ? 'disabled' : ''}>Buy · ${buyGap.price.toLocaleString()} 🪙</button>`}
      </div>` : '<p class="tiny muted tfo-cheapest" data-family-cheapest="">Every type egg in this family is home.</p>'}
      <div class="tfo-milestones">${milestoneRows}</div>
      <p class="tiny muted tfo-rule">Only hatched sprites living in the Hollow count — eggs and retired sprites do not. Family buys never repeat a species and cap at ${buyCap.toLocaleString()} 🪙.</p>`;
    box.hidden = false;
  }

  function typeFamilyOptionHTML(row, index) {
    const selected = (typeFilter.family || '') === row.id;
    const total = familyShelf ? familyShelf.items.length : 0;
    const count = row.all ? TYPE_EGG_SPECIES.length : row.count;
    const countLabel = `${count} type egg${count === 1 ? '' : 's'}`;
    const detail = row.all ? 'Every type egg' : row.preview;
    const owned = Number(row.owned) || 0;
    return `<button class="type-family-option${selected ? ' on' : ''}" type="button" role="option" aria-selected="${selected ? 'true' : 'false'}" aria-posinset="${index + 1}" aria-setsize="${total}" data-type-family-option="${row.id}" data-family-index="${index}" style="--family-tint:${row.color || 'var(--accent)'}">
      <span class="tfo-icon" aria-hidden="true">${row.icon || '🧬'}</span>
      <span class="tfo-copy"><b>${esc(row.label)}</b><span>${esc(countLabel)}${detail ? ` · ${esc(detail)}` : ''}</span></span>
      <span class="tfo-owned" aria-label="${owned} of ${count} owned">${owned}/${count}</span>
      <span class="tfo-check" aria-hidden="true">${selected ? '✓' : ''}</span>
    </button>`;
  }

  function familyBrowserItems() {
    const q = familyQuery.trim().toLowerCase();
    /* Completion counts living, hatched species only, matching the overview. */
    const owned = ownedTypeEggSpecies();
    const withOwned = (row) => ({
      ...row,
      owned: row.all
        ? [...owned].filter((key) => TYPE_EGG_SPECIES_SET.has(key)).length
        : row.species.filter((key) => owned.has(key)).length,
    });
    const matches = (q ? TYPE_FAMILY_ROWS.filter((row) => row.search.includes(q)) : TYPE_FAMILY_ROWS)
      .map(withOwned);
    if (q) return matches;
    return [withOwned({
      id: '', label: 'All families', all: true, count: TYPE_EGG_SPECIES.length,
      icon: '🌐', color: 'var(--accent)', preview: 'Every type egg',
    }), ...matches];
  }

  function paintFamilyBrowser(resetScroll = false) {
    if (!familyShelf) return;
    const items = familyBrowserItems();
    familyShelf.setItems(items);
    familyShelf.resetWindow();
    if (resetScroll) familyShelf.scroller.scrollTop = 0;
    familyShelf.paint();
    const count = root.querySelector('[data-type-family-count]');
    if (count) {
      const q = familyQuery.trim();
      count.textContent = q
        ? `${items.length} of ${TYPE_FAMILY_ROWS.length} families`
        : `${TYPE_FAMILY_ROWS.length} families · ${TYPE_EGG_SPECIES.length} type eggs`;
    }
    const empty = root.querySelector('[data-type-family-empty]');
    if (empty) empty.hidden = items.length > 0;
  }

  function revealFamilySelection() {
    if (!familyShelf || !typeFilter.family) return;
    const index = familyShelf.items.findIndex((row) => (row.id || '') === typeFilter.family);
    const step = familyShelf.rowStep || 0;
    const view = familyShelf.scroller?.clientHeight || 0;
    if (index <= 0 || !step || !view) return;
    /* Center the chosen row so the picker reopens where the player left it. */
    familyShelf.scroller.scrollTop = Math.max(0, Math.round(index * step - Math.max(0, (view - step) / 2)));
    familyShelf.paint();
  }

  function openFamilyBrowser() {
    const browser = root.querySelector('[data-type-family-browser]');
    const toggle = root.querySelector('[data-type-family-toggle]');
    const search = root.querySelector('[data-type-family-search]');
    if (!browser) return;
    browser.hidden = false;
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    paintFamilyBrowser(true);
    revealFamilySelection();
    if (search) search.focus({ preventScroll: false });
  }

  function closeFamilyBrowser(restoreFocus = true) {
    const browser = root.querySelector('[data-type-family-browser]');
    const toggle = root.querySelector('[data-type-family-toggle]');
    const search = root.querySelector('[data-type-family-search]');
    if (!browser) return;
    browser.hidden = true;
    familyQuery = '';
    if (search) search.value = '';
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }
  }

  function setTypeFamily(id) {
    typeFilter.family = TYPE_FAMILY_BY_ID.has(id) ? id : '';
    typeFilter.pin = null;
    writeNestFocus(null);
    paintTypeFilterControls();
    resetTypePaging();
    closeFamilyBrowser(true);
  }

  function onFamilyListKeydown(event) {
    const option = event.target instanceof Element ? event.target.closest('[data-type-family-option]') : null;
    if (!option || !familyShelf) return;
    const index = Number(option.dataset.familyIndex);
    if (!Number.isFinite(index)) return;
    let next = null;
    if (event.key === 'ArrowDown') next = index + 1;
    else if (event.key === 'ArrowUp') next = index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = familyShelf.items.length - 1;
    else if (event.key === 'PageDown') next = index + 6;
    else if (event.key === 'PageUp') next = index - 6;
    else if (event.key === 'Escape') {
      event.preventDefault();
      closeFamilyBrowser(true);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    familyShelf.focusIndex(next);
  }

  function onFamilySearchKeydown(event) {
    if (!familyShelf) return;
    if (event.key === 'ArrowDown' && familyShelf.items.length) {
      event.preventDefault();
      familyShelf.focusIndex(0);
    } else if (event.key === 'ArrowUp' && familyShelf.items.length) {
      event.preventDefault();
      familyShelf.focusIndex(familyShelf.items.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      /* A typed search is cheap to lose; clear it before closing the picker. */
      if (familyQuery.trim()) {
        familyQuery = '';
        const search = root.querySelector('[data-type-family-search]');
        if (search) search.value = '';
        paintFamilyBrowser(true);
        return;
      }
      closeFamilyBrowser(true);
    }
  }

  function bindFamilyOptions(container) {
    container.querySelectorAll('[data-type-family-option]').forEach((button) => {
      button.addEventListener('click', () => setTypeFamily(button.dataset.typeFamilyOption || ''));
    });
  }

  function paintTypeShop() {
    const typeShop = root.querySelector('#nest-type-shop');
    if (!typeShop) return;
    const apexRank = RARITY_APEX_KEYS.includes(typeFilter.rarity) ? typeFilter.rarity : null;
    const activeFamily = typeFilter.family ? TYPE_FAMILY_BY_ID.get(typeFilter.family) : null;
    paintApexBundle(apexRank);
    const owned = ownedTypeEggSpecies();
    typeWindowOwned = owned;
    paintFamilyOverview(activeFamily);
    const q = typeFilter.q.trim().toLowerCase();
    const wantsOwned = typeFilter.owned === 'owned';
    const budget = Math.max(0, Number(state.coins) || 0);
    const matches = typeRoster.filter((key) => {
      const searchable = `${ELEMENTS[key]?.name || key} ${key}`.toLowerCase();
      if (q && !searchable.includes(q)) return false;
      if (typeFilter.affordable && (apexRank ? typeEggApexPrice(key, apexRank) : (TYPE_EGG_PRICE[key] || 120)) > budget) return false;
      if (activeFamily && !activeFamily.speciesSet.has(key)) return false;
      if (!apexRank && typeFilter.rarity !== 'all' && typeEggRarity(key) !== typeFilter.rarity) return false;
      if (typeFilter.owned !== 'all' && owned.has(key) !== wantsOwned) return false;
      return true;
    });
    paintStarterPath(collectedTypeEggSpecies());
    /* A deep-linked species stays first so its card is the one in view, even
       when the player changes the shelf's order. */
    const orderedMatches = orderedTypeEggs(matches, owned, apexRank);
    const pinned = typeFilter.pin && matches.includes(typeFilter.pin) ? typeFilter.pin : null;
    const ordered = pinned ? [pinned, ...orderedMatches.filter((key) => key !== pinned)] : orderedMatches;
    const signature = `${apexRank}|${typeFilter.q}|${typeFilter.family}|${typeFilter.rarity}|${typeFilter.owned}|${currentTypeSort()}|${pinned || ''}|${matches.length}`;
    const rangeChanged = signature !== typeWindowSignature;
    if (rangeChanged) {
      typeWindowSignature = signature;
      if (typeShelf) typeShelf.resetWindow();
    }
    typeWindowOrdered = ordered;
    typeWindowPinned = pinned;
    typeWindowApexRank = apexRank;
    paintQuickBuy(pinned, apexRank);
    const featured = [];
    if (pinned) featured.push(pinned);
    for (const key of orderedMatches) {
      if (!featured.includes(key)) featured.push(key);
      if (featured.length >= TYPE_EGG_FEATURED_LIMIT) break;
    }
    paintFeaturedTypeEggs(featured, apexRank);
    paintTypeGrid(typeShop);
    if (rangeChanged) announceTypeRange();
    paintTypeFilterSummary(matches);
    const empty = root.querySelector('[data-type-empty]');
    if (empty) {
      empty.hidden = matches.length !== 0;
      if (matches.length === 0) {
        const emptyCount = empty.querySelector('[data-type-empty-count]');
        if (emptyCount) emptyCount.textContent = `0 of ${TYPE_EGG_SPECIES.length.toLocaleString()} type eggs`;
      }
    }
  }

  function openPicker(key) {
    const options = [...eggs(), ...grownSprites()];
    if (!options.length) {
      toast('Hatch or pick up an egg first.', '🥚');
      return;
    }
    const otherId = picked[key === 'a' ? 'b' : 'a'];
    const other = otherId ? findSprite(otherId) : null;
    const body = `<div class="list-gap" style="margin-top:12px">
      ${options.map((s) => {
        const isEgg = s.stage === 'egg';
        const mismatch = !!other && isEgg !== (other.stage === 'egg');
        const blocked = s.id === otherId || mismatch || (!isEgg && (restLeft(s) > 0 || s.level < 3));
        const note = mismatch
          ? '<br><span class="tiny" style="color:var(--warn)">Pair two eggs or two sprites</span>'
          : restLeft(s) > 0 ? '<br><span class="tiny" style="color:var(--warn)">Resting — ready soon</span>'
            : !isEgg && s.level < 3 ? '<br><span class="tiny" style="color:var(--warn)">Needs level 3</span>' : '';
        return `<button class="rowcard selectable" data-pick="${s.id}" style="${blocked ? 'opacity:.45' : ''}" ${blocked ? 'disabled' : ''}>
          <span class="rc-art">${isEgg ? eggSVG(s, { progress: s.hatch || 0 }) : spriteSVG(s, { expr: expressionFor(s) })}</span>
          <span style="flex:1;min-width:0;text-align:left">
            <b style="font-size:12.5px">${esc(displayName(s))}</b><br>
            <span class="tiny muted">${isEgg ? `Egg · ${BREEDS[s.breed]?.name || 'Puff'} breed · ${Math.round(s.hatch || 0)}% warm${s.shiny ? ' · ✨ shiny' : ''}` : `Lv ${s.level} · ${typeName(s)} · ${BREEDS[s.breed]?.name || ''}`}</span>
            ${note}
          </span>
          ${state.activeId === s.id ? '<span class="chip" style="font-size:8px">active</span>' : ''}
        </button>`;
      }).join('')}
    </div>`;
    openSheet({
      title: 'Choose a merge parent',
      sub: 'Two eggs fuse into one hatched puffle of a new breed. Sprites need level 3 and a rest.',
      body,
      key: 'merge-parent',
      onMount: (root, close) => {
        root.querySelectorAll('[data-pick]').forEach((btn) => {
          btn.addEventListener('click', () => {
            picked[key] = btn.dataset.pick;
            Sfx.pop();
            close();
            paint();
          });
        });
      },
    });
  }

  function fuse() {
    const a = picked.a;
    const b = picked.b;
    if (!a || !b) return;
    const res = Actions.previewMerge(a, b);
    if (res.error) {
      toast(res.error, '🧬');
      Sfx.error();
      return;
    }
    const { child, child2, twins, cost, waived, eggMerge, why: mergeWhy } = res;
    const typeText = child.hybrid || ELEMENTS[child.element].name;
    const hybridOf = child.hybridParents ? hybridParentsLabel(child.hybridParents) : null;
    const mutation = child.mutation ? MUTATIONS.find((m) => m.name === child.mutation) : null;
    const special = child.special ? COMBOS.find((c) => c.id === child.special) : null;
    const anyShiny = child.shiny || child2?.shiny;
    const previewPalette = resolvePalette(child);
    const modal = openModal({
      title: eggMerge
        ? '🥚 Two eggs, one new friend'
        : twins ? (anyShiny ? 'Twins! Two sparkling legends' : 'Twins! Two little legends') : anyShiny ? '✨ A shiny little legend' : 'A new little legend',
      sub: eggMerge ? `A ${BREEDS[child.breed]?.name || 'new'} breed ${typeText} puffle, hatched and ready to meet you.` : twins ? `A double yolk of ${typeText} eggs, each with their own soul.` : `A ${typeText} egg with a whole personality of its own.`,
      body: `<div class="preview-box" style="margin-top:12px">
          <div class="glow" style="position:absolute;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle, ${previewPalette.body}55, transparent 65%);filter:blur(12px)"></div>
          <div class="twin-art" style="${twins ? '' : 'display:block'}">
            ${spriteSVG({ ...child, stage: 'baby' }, { expr: 'happy' })}
            ${twins ? spriteSVG({ ...child2, stage: 'baby' }, { expr: 'happy' }) : ''}
          </div>
          <div class="row" style="flex-wrap:wrap;justify-content:center;gap:4px">
            <span class="chip">${typeText}${hybridOf ? ` · ${hybridOf}` : ''}</span>
            <span class="chip">${BREEDS[child.breed]?.name || 'Puff'} ${eggMerge ? 'breed' : 'line'}</span>
            <span class="chip">${SIZES[child.size]?.name || 'Standard'} size</span>
            ${child.shiny ? '<span class="chip chip-shine">✨ shiny</span>' : ''}
            ${twins && child2?.shiny ? '<span class="chip chip-shine">✨ shiny twin</span>' : ''}
            ${special ? `<span class="chip chip-mut">✦ ${special.name}</span>` : mutation ? `<span class="chip chip-mut">✦ ${mutation.name}</span>` : ''}
            ${twins ? '<span class="chip" style="color:var(--gold)">🐣 twins</span>' : ''}
          </div>
        </div>
        ${mergeWhyHTML(res, mergeWhy)}
        <div class="card" style="padding:12px;margin-top:10px;text-align:left">
          <div class="between"><span class="tiny muted">Lineage</span><span class="small"><b>${esc(displayName(res.a))}</b> × <b>${esc(displayName(res.b))}</b></span></div>
          <div class="between" style="margin-top:6px"><span class="tiny muted">Generation</span><span class="small">${(child.gen || 0) + 1}</span></div>
          <div class="between" style="margin-top:6px"><span class="tiny muted">Personality</span><span class="small">${PERSONALITIES[child.personality]?.name}</span></div>
          <div class="between" style="margin-top:6px"><span class="tiny muted">Look</span><span class="small">${PATTERNS[child.pattern]?.name} · ${ACCESSORIES[child.accessory]?.name}</span></div>
          ${special ? `<div class="between" style="margin-top:6px"><span class="tiny muted">Combo power</span><span class="small">${special.power.icon} ${special.power.name}</span></div>` : ''}
          <div class="between" style="margin-top:6px"><span class="tiny muted">Nursery odds</span><span class="small">${eggMerge ? `${res.odds.shine}% shiny` : `${res.odds.twin}% twins · ${res.odds.combo}% combo · ${res.odds.shine}% shiny`}</span></div>
          <div class="between" style="margin-top:6px"><span class="tiny muted">Merge cost</span><span class="small"><b>${waived ? 'Free · First Flight' : `${cost} 🪙`}</b></span></div>
        </div>
        <div class="actions" style="display:flex;gap:8px;margin-top:12px">
          <button class="btn btn-ghost" data-close>Not yet</button>
          <button class="btn btn-primary" data-fuse-confirm>${eggMerge ? `Merge eggs · ${cost} 🪙` : waived ? 'Fuse · free' : `Fuse · ${cost} 🪙`}</button>
        </div>`,
      onMount: (root, close) => {
        root.querySelector('[data-fuse-confirm]').addEventListener('click', () => {
          if (!Actions.completeMerge(a, b, child, child2).ok) {
            toast('Merge failed — coins or resting parents.', '😵');
            Sfx.error();
            return;
          }
          picked.a = null;
          picked.b = null;
          close();
          Sfx.win();
          paint();
          if (eggMerge) {
            toast(`✨ A ${BREEDS[child.breed]?.name || 'new'} breed ${typeText} puffle answered!`, '🥚');
            return;
          }
          if (anyShiny) toast('A shiny egg joined the Nest!', '✨');
          const art = article(typeText);
          toast(child2
            ? `Twins! Two ${typeText} eggs appeared. Warm them both.`
            : `${art[0].toUpperCase() + art.slice(1)} ${typeText} egg appeared! Warm it to meet them.`, '🥚');
          App.openHatch(child.id);
        });
      },
    });
    return modal;
  }

  /* Applies a deep link from Types or the Hollow Compass once the screen exists. */
  function consumeApexFocus() {
    const fresh = !!NEST_APEX_FOCUS;
    const focus = NEST_APEX_FOCUS || readNestFocus();
    NEST_APEX_FOCUS = null;
    if (!focus) return;

    const base = focus.rank === BASE_EGG_FOCUS_RANK;
    if (!ELEMENTS[focus.species] || !(base || RARITY_APEX_KEYS.includes(focus.rank))) return;
    /* A fresh Types jump resets the shelf to the linked egg. A remembered
       focus only restores the pin, so ordinary Nest navigation keeps the
       player's current filters intact. */
    if (fresh) {
      typeFilter.rarity = base ? 'all' : focus.rank;
      typeFilter.q = '';
      typeFilter.owned = 'all';
      typeFilter.family = '';
      paintTypeFilterControls();
    }
    typeFilter.pin = focus.species;
    if (typeShelf) typeShelf.resetWindow();
    typeWindowSignature = '';
    paintTypeShop();
    requestAnimationFrame(() => {
      const card = root.querySelector(`#nest-type-shop [data-buy-type="${focus.species}"]`);
      if (!card) return;
      card.scrollIntoView({ block: 'center' });
      /* Only announce a jump the player just made, not a remembered one. */
      if (fresh) {
        const label = base ? 'egg' : `${TYPE_EGG_RARITIES[focus.rank].name} egg`;
        toast(`${ELEMENTS[focus.species].name} ${label} — tap to buy.`, '🥚');
      }
    });
  }

  typeShelf = new HorizontalVirtualList(root.querySelector('#nest-type-shop'), {
    key: (key) => String(key),
    renderItem: (key, index) => typeEggCardHTML(key, typeWindowApexRank, typeWindowPinned, index),
    renderSpacer: (rows, height, width) => `<div class="type-egg-grid-spacer" aria-hidden="true" data-grid-rows="${rows}" style="width:${width}px;flex-basis:${width}px;height:${height}px"></div>`,
    measure: (typeShop) => typeGridMetrics(typeShop),
    rowTop: (typeShop) => typeGridTop(typeShop),
    scroller: root,
    itemSelector: '[data-buy-type]',
    limit: TYPE_EGG_GRID_MAX_CARDS,
    overscan: TYPE_EGG_GRID_OVERSCAN,
    minRows: TYPE_EGG_GRID_MIN_ROWS,
    hysteresis: TYPE_EGG_GRID_HYSTERESIS,
    onMount: bindTypeEggCards,
  });
  const familyList = root.querySelector('[data-type-family-list]');
  if (familyList) {
    familyShelf = new HorizontalVirtualList(familyList, {
      key: (row) => row.id || 'all',
      renderItem: typeFamilyOptionHTML,
      renderSpacer: (rows, height, width) => `<div class="type-family-spacer" aria-hidden="true" data-family-rows="${rows}" style="width:${width}px;flex-basis:${width}px;height:${height}px"></div>`,
      measure: (list) => {
        const sample = list.querySelector('[data-type-family-option]');
        const styles = getComputedStyle(list);
        const rowGap = parseFloat(styles.rowGap) || 0;
        const available = Math.max(0, list.clientWidth
          - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0));
        return {
          columns: 1,
          rowGap,
          rowStep: (sample ? sample.offsetHeight : 56) + rowGap,
          spacerWidth: available,
        };
      },
      rowTop: () => 0,
      scroller: familyList,
      itemSelector: '[data-type-family-option]',
      limit: 18,
      overscan: 3,
      minRows: 6,
      hysteresis: 1,
      onMount: bindFamilyOptions,
    });
    familyList.addEventListener('keydown', onFamilyListKeydown);
    const familySearch = root.querySelector('[data-type-family-search]');
    if (familySearch) {
      familySearch.addEventListener('input', () => {
        familyQuery = familySearch.value;
        paintFamilyBrowser(true);
      });
      familySearch.addEventListener('keydown', onFamilySearchKeydown);
    }
    root.querySelector('[data-type-family-overview]')?.addEventListener('click', (event) => {
      if (event.target.closest('[data-family-buy-missing]')) {
        if (typeFilter.family) buyFamilyMissing(typeFilter.family);
        return;
      }
      const button = event.target.closest('[data-family-claim]');
      if (!button || !typeFilter.family) return;
      const res = Actions.claimFamilyMilestone(typeFilter.family);
      if (!res.ok) {
        toast(res.reason === 'complete' ? 'Every milestone here is claimed.' : 'That milestone is still locked.', '🧬');
        return;
      }
      paintTypeShop();
    });
    root.querySelector('[data-type-family-toggle]')?.addEventListener('click', () => {
      const browser = root.querySelector('[data-type-family-browser]');
      if (!browser) return;
      if (browser.hidden) openFamilyBrowser();
      else closeFamilyBrowser(true);
    });
    root.querySelector('[data-type-family-close]')?.addEventListener('click', () => closeFamilyBrowser(true));
  }
  const stopWishlistPanel = typeof Wishlist !== 'undefined'
    ? Wishlist.mount(root.querySelector('[data-wishlist-panel]'))
    : () => {};
  paint();
  consumeApexFocus();
  const stopFlightCard = typeof mountFlightCard === 'function' ? mountFlightCard(root, { completionOnly: true }) : () => {};
  const unsub = subscribeState(() => paint());
  return () => {
    stopFlightCard();
    stopWishlistPanel();
    unsub();
    if (typeScrollFrame) clearTimeout(typeScrollFrame);
    if (typeGridObserver) {
      typeGridObserver.disconnect();
      typeGridObserver = null;
    }
    if (typeScrollBound) {
      root.removeEventListener('scroll', scheduleTypeGridPaint);
      window.removeEventListener('resize', scheduleTypeGridPaint);
      const typeShop = root.querySelector('#nest-type-shop');
      if (typeShop) typeShop.removeEventListener('keydown', onTypeGridKeydown);
    }
    if (typeShelf) {
      typeShelf.destroy();
      typeShelf = null;
    }
    if (familyShelf) {
      familyShelf.destroy();
      familyShelf = null;
    }
  };
}
