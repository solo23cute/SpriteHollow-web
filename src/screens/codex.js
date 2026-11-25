/* Type encyclopedia: every element's art, power, egg price, rarity, and hybrids. */

const TYPE_HYBRID_INDEX = {};
Object.entries(HYBRID_NAMES).forEach(([pair, name]) => {
  const [a, b] = pair.split('+');
  if (ELEMENTS[a]) (TYPE_HYBRID_INDEX[a] = TYPE_HYBRID_INDEX[a] || []).push({ name, element: b });
  if (ELEMENTS[b]) (TYPE_HYBRID_INDEX[b] = TYPE_HYBRID_INDEX[b] || []).push({ name, element: a });
});
Object.keys(TYPE_HYBRID_INDEX).forEach((key) => {
  TYPE_HYBRID_INDEX[key].sort((x, y) => x.name.localeCompare(y.name));
});

function hybridsFor(key) {
  return TYPE_HYBRID_INDEX[key] || [];
}
/* Nest type eggs skip Vault keepers, so only those species have apex eggs. */
function hasApexTypeEgg(key) {
  return typeof TYPE_EGG_SPECIES !== 'undefined'
    && typeof TYPE_EGG_APEX_PREMIUM !== 'undefined'
    && TYPE_EGG_SPECIES.includes(key);
}

function codexScreen(root) {
  let query = '';
  let rarity = 'all';
  let category = 'all';
  let finishFilter = 'all';
  const all = ELEMENT_KEYS.slice().sort((a, b) => ELEMENTS[a].name.localeCompare(ELEMENTS[b].name));
  const finishCounts = typeof finishOwnedCounts === 'function' ? finishOwnedCounts() : {};
  const finishKeys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  const grownOwned = state.sprites.filter((s) => s && s.stage !== 'egg');
  const noFinishOwned = grownOwned.filter((s) => !FINISHES[s.variant]).length;

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Field guide</div><h1>Type encyclopedia</h1><p>Art, powers, eggs, and hybrids.</p></div>
      <span class="chip" data-codex-count></span>
    </div>
    <div class="wiki-callout">
      <span class="wc-icon">📖</span>
      <span class="wc-copy"><b>The Sprite Wiki</b><span>Species files, habitats, and guides.</span></span>
      <button class="btn btn-sm btn-soft" data-open-wiki>Open</button>
    </div>
    <div class="type-feature-grid">
      <button class="type-feature" data-open-biomes>
        <span class="tf-icon">🧭</span>
        <span class="tf-copy"><b>Type Biome Atlas</b><span>${BIOME_KEYS.length} environments · ${POKEDEX_SPECIES.length.toLocaleString()} Pokémon · ${EXOTIC_SPECIES.length} exotic signatures</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature finish-lab-feature" data-open-finish-lab>
        <span class="tf-icon">🧪</span>
        <span class="tf-copy"><b>Finish Lab</b><span>${finishKeys.length + 1} finishes × ${finishLabStyleKeys().length} styles · lazy family matrix</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature secret-feature" data-open-secrets>
        <span class="tf-icon">🔐</span>
        <span class="tf-copy"><b>Secret Vault</b><span>${(state.secretUnlocks || []).length} / ${SECRET_SPECIES.length} found · not sold in the Nest</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature gender-feature" data-open-genders>
        <span class="tf-icon">⚥</span>
        <span class="tf-copy"><b>Gender Codex</b><span>${genderCounts().female} ♀ · ${genderCounts().male} ♂ · ${genderCounts().neutral} ⚲ in your Hollow · breeding rules</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature bond-feature" data-open-bonds>
        <span class="tf-icon">💞</span>
        <span class="tf-copy"><b>Bond Codex</b><span>6 bond ranks, passive bonuses, and the full evolution path</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature bond-feature" data-open-evolution>
        <span class="tf-icon">🧬</span>
        <span class="tf-copy"><b>World Evolution Atlas</b><span>${ELEMENT_KEYS.length.toLocaleString()} types × ${EVOLUTION_FORM_KEYS.length} forms · ${BIOME_KEYS.length} biomes · Vault free</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature" data-open-constellations>
        <span class="tf-icon">🌌</span>
        <span class="tf-copy"><b>Collection Constellations</b><span>${typeof constellationAtlasSummary === 'function' ? constellationAtlasSummary() : 'Charts, exact routes, and collection progress'}</span></span>
        <span class="tf-arrow">›</span>
      </button>
      <button class="type-feature" data-open-studio>
        <span class="tf-icon">🎨</span>
        <span class="tf-copy"><b>Studio &amp; personaliser</b><span>${BREED_KEYS.length} body types · head shapes, ears, eyes, dyes, ${CUSTOM_CLOTH_STYLE_KEYS.length} clothing styles · fonts &amp; UI colours</span></span>
        <span class="tf-arrow">›</span>
      </button>
    </div>
    <div class="card" style="padding:11px;margin-top:10px">
      <div class="between"><b style="font-size:12px">Collection waves</b><span class="chip">${collectionWaves().length} live</span></div>
      <div class="wiki-hybrid-list" style="margin-top:7px">${collectionWaveChipsHTML()}</div>
      <p class="tiny muted" style="margin:7px 0 0;line-height:1.5">These counts rebuild from live data, so every new sprite wave shows up here the moment it loads.</p>
    </div>
    <div class="type-tools" style="margin-top:2px">
      <input class="type-search" type="search" data-codex-search placeholder="Search types…" aria-label="Search sprite types" autocomplete="off">
      <div class="type-rarities type-rarities-wrap">
        <button class="chip type-rarity on" data-codex-rarity="all">All</button>
        ${RARITY_TIER_ORDER.map((key) => `<button class="chip type-rarity${RARITY_APEX_KEYS.includes(key) ? ' apex' : ''}" data-codex-rarity="${key}"><span class="te-dot" style="background:${TYPE_EGG_RARITIES[key].color}"></span>${TYPE_EGG_RARITIES[key].name}</button>`).join('')}
      </div>
      <div class="type-rarities" style="margin-top:6px">
        <button class="chip on" data-codex-category="all">All species</button>
        <button class="chip" data-codex-category="exotic">✦ Exotic</button>
        <button class="chip" data-codex-category="secret">🔐 Secret</button>
        <button class="chip" data-codex-category="master">🕹️ Master</button>
        <button class="chip" data-codex-category="base">◻️ Base</button>
        <button class="chip" data-codex-category="prismatic">🌈 Prismatic</button>
      </div>
      <div class="type-rarities finish-codex-filters" data-codex-finish-filters style="margin-top:6px">
        <button class="chip finish-filter on" data-codex-finish="all" data-finish-owned="${grownOwned.length}"><span>All</span><span class="finish-filter-count">× ${grownOwned.length}</span></button>
        <button class="chip finish-filter${noFinishOwned ? '' : ' is-unowned'}" data-codex-finish="none" data-finish-owned="${noFinishOwned}"><span>No finish</span><span class="finish-filter-count">× ${noFinishOwned}</span></button>
        ${finishKeys.map((key) => {
          const f = FINISHES[key];
          const count = finishCounts[key] || 0;
          const odds = typeof finishDropPercent === 'function' ? finishDropPercent(key) : '';
          return `<button class="chip finish-filter${count ? '' : ' is-unowned'}" data-codex-finish="${key}" data-finish-owned="${count}" title="${esc(f.desc)} · ${odds} of finish drops"><i class="finish-filter-mark" style="background:${f.body}" aria-hidden="true"></i><span>${f.icon} ${esc(f.name)}</span><span class="finish-filter-count">× ${count}</span><span class="finish-filter-odds" data-finish-odds="${key}">${odds}</span></button>`;
        }).join('')}
      </div>
    </div>
    <div class="type-grid" data-codex-grid></div>
    <p class="tiny muted" data-codex-empty hidden style="text-align:center;margin:14px 4px">No type matches those filters.</p>
    <div class="section-title" style="margin-top:16px"><h2>Finishes</h2><span>any type can hatch shiny</span></div>
    <div class="finish-strip" data-finish-strip></div>
    <p class="tiny muted" style="text-align:center;margin:6px 4px 0">Finish chance varies by egg source. Percentages are each finish's exact share when a finish drops.</p>
    <div class="section-title" style="margin-top:16px"><h2>Apex trail ranks</h2><span>above Master · earned on trails</span></div>
    <div class="finish-strip" data-apex-strip></div>
    <p class="tiny muted" style="text-align:center;margin:6px 4px 0">${RARITY_APEX_PHRASE} sit above the base bands. Every type sold in the Nest has an egg at each of these ranks — tap an apex rarity chip above to price a species there, or push a Master sprite up on trails.</p>
    <div class="card" style="padding:12px;margin-top:14px;font-size:11px;line-height:1.6;color:var(--muted)">
      Every type can be bought as its own egg in the Nest, including at ${RARITY_APEX_PHRASE} rank. Base tiers follow egg price; Secret, Exotic, and Master outrank them, and the ${RARITY_APEX_KEYS.length} apex ranks sit above Master for an extra premium. The gene power is always active while that sprite is in your Hollow.
    </div>`;

  const grid = root.querySelector('[data-codex-grid]');
  const empty = root.querySelector('[data-codex-empty]');
  const count = root.querySelector('[data-codex-count]');
  const search = root.querySelector('[data-codex-search]');
  const lazyGrid = new LazyGrid(grid, { batchSize: 12, rootMargin: '700px 0px', virtual: true, windowSize: 96 });
  grid.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-type]') : null;
    if (button) openTypeDetail(button.dataset.type);
  });
  root.querySelector('[data-open-wiki]').addEventListener('click', () => App.go('wiki'));
  root.querySelector('[data-open-biomes]').addEventListener('click', openBiomeAtlas);
  root.querySelector('[data-open-finish-lab]')?.addEventListener('click', openFinishLab);
  root.querySelector('[data-open-secrets]').addEventListener('click', openSecretVault);
  root.querySelector('[data-open-genders]').addEventListener('click', () => openGenderCodex());
  root.querySelector('[data-open-bonds]').addEventListener('click', () => openBondCodex());
  root.querySelector('[data-open-evolution]').addEventListener('click', () => openWorldEvolutionAtlas());
  root.querySelector('[data-open-constellations]')?.addEventListener('click', () => {
    if (typeof openConstellationAtlas === 'function') openConstellationAtlas();
  });
  root.querySelector('[data-open-studio]').addEventListener('click', () => openStudioSheet());

  function matches(key) {
    const q = query.trim().toLowerCase();
    const el = ELEMENTS[key];
    const family = typeof speciesFamilyFor === 'function' ? speciesFamilyFor(key)?.label || '' : '';
    const catalog = el.catalogGroup && typeof CATALOG_GROUPS !== 'undefined' ? CATALOG_GROUPS[el.catalogGroup]?.label || '' : '';
    const categoryOk = category === 'all' || category === 'prismatic'
      || (category === 'exotic' && isExoticSpecies(key))
      || (category === 'secret' && ((isSecretSpecies(key) && key !== MASTER_CHEAT_SPECIES) || el.variantFamily === 'secret'))
      || (category === 'master' && (key === MASTER_CHEAT_SPECIES || !!el.masterTier))
      || (category === 'base' && typeof BASE_ROSTER_KEYS !== 'undefined' && BASE_ROSTER_KEYS.includes(key));
    const prismaticOk = category !== 'prismatic' || !!el.alwaysShiny;
    const finishOk = finishFilter === 'all'
      || grownOwned.some((s) => s.element === key && (finishFilter === 'none' ? !FINISHES[s.variant] : s.variant === finishFilter));
    return categoryOk && prismaticOk && finishOk
      && (!q || `${el.name} ${key} ${family} ${catalog} ${el.catalogType || ''} ${el.alwaysShiny ? 'prismatic always shiny multiverse' : ''} celestial divine eternal apex bond codex evolution`.toLowerCase().includes(q))
      && (rarity === 'all'
        || (RARITY_APEX_KEYS.includes(rarity) ? hasApexTypeEgg(key) : typeEggRarity(key) === rarity));
  }

  function cardHTML(key) {
    const el = ELEMENTS[key];
    const exotic = isExoticSpecies(key);
    /* Under an apex filter the card prices that rank's egg instead of the base egg. */
    const apexRank = RARITY_APEX_KEYS.includes(rarity) ? rarity : null;
    const tier = TYPE_EGG_RARITIES[apexRank || typeEggRarity(key)];
    const power = GENE_POWERS[key];
    const price = apexRank ? typeEggApexPrice(key, apexRank) : TYPE_EGG_PRICE[key];
    const hybrids = hybridsFor(key);
    const vaultSecret = isSecretSpecies(key);
    const secretVariant = el.variantFamily === 'secret';
    const secret = vaultSecret || secretVariant;
    const master = key === MASTER_CHEAT_SPECIES || !!el.masterTier;
    const vaulted = vaultSecret || key === MASTER_CHEAT_SPECIES;
    const badge = master ? '<span class="tc-exotic">MASTER</span> ' : secret ? '<span class="tc-exotic">SECRET</span> ' : el.alwaysShiny ? '<span class="tc-exotic">PRISMATIC</span> ' : exotic ? '<span class="tc-exotic">EXOTIC</span> ' : '';
    const sample = {
      id: `codex-${key}`, element: key, breed: 'puff', stage: 'sprite', variant: el.forcedVariant || null,
      pattern: 'plain', palette: 'native', accessory: 'none', name: el.name, level: 3, size: 'standard', shiny: !!el.alwaysShiny,
    };
    return `<button class="type-card" data-type="${key}" style="--sh-rim-a:${el.primary};--sh-rim-b:${el.accent};--sh-rim-c:${tier.color}">
      <span class="tc-art">${spriteSVG(sample, { expr: 'happy' })}</span>
      <span class="tc-top"><b>${el.name}</b><i class="te-dot" style="background:${tier.color}"></i></span>
      <span class="tc-power">${badge}${power.icon} ${power.name}</span>
      <span class="tc-meta">${vaulted ? `${tier.name} · Vault only` : apexRank ? `${tier.name} egg · ${price.toLocaleString()} 🪙` : `${tier.name} · ${price || '—'} 🪙`} · ${hybrids.length} hybrid${hybrids.length === 1 ? '' : 's'}</span>
    </button>`;
  }

  function paint() {
    const list = all.filter(matches);
    lazyGrid.reset(list, cardHTML);
    count.textContent = `${list.length} type${list.length === 1 ? '' : 's'}`;
    empty.hidden = list.length !== 0;
  }

  search.addEventListener('input', () => {
    query = search.value;
    paint();
  });
  root.querySelectorAll('[data-codex-rarity]').forEach((btn) => {
    btn.addEventListener('click', () => {
      rarity = btn.dataset.codexRarity;
      root.querySelectorAll('[data-codex-rarity]').forEach((b) => b.classList.toggle('on', b === btn));
      paint();
    });
  });
  root.addEventListener('click', (event) => {
    const btn = event.target instanceof Element ? event.target.closest('[data-codex-category]') : null;
    if (!btn || !root.contains(btn)) return;
    category = btn.dataset.codexCategory;
    root.querySelectorAll('[data-codex-category]').forEach((b) => b.classList.toggle('on', b === btn));
    paint();
  });
  root.addEventListener('click', (event) => {
    const btn = event.target instanceof Element ? event.target.closest('[data-codex-finish]') : null;
    if (!btn || !root.contains(btn)) return;
    finishFilter = btn.dataset.codexFinish;
    root.querySelectorAll('[data-codex-finish]').forEach((b) => b.classList.toggle('on', b === btn));
    paint();
  });
  const strip = root.querySelector('[data-finish-strip]');
  strip.innerHTML = finishKeys.map((key) => {
    const f = FINISHES[key];
    const count = finishCounts[key] || 0;
    const odds = typeof finishDropPercent === 'function' ? finishDropPercent(key) : '';
    const sample = {
      id: `finish-${key}`, element: 'bloom', breed: 'puff', stage: 'sprite', variant: key,
      pattern: 'plain', palette: 'native', accessory: 'none', name: f.name, level: 3, size: 'standard',
    };
    return `<button class="finish-card" data-finish="${key}" data-finish-card="${key}" style="--sh-rim-a:${f.body};--sh-rim-b:${f.accent};--sh-rim-c:var(--gold)">
      <span class="fc-art">${spriteSVG(sample, { expr: 'happy' })}</span>
      <b>${f.icon} ${f.name}</b>
      <span class="fc-owned" data-finish-owned="${key}">Owned × ${count}</span>
      <span class="fc-odds" data-finish-odds="${key}">${odds} of finish drops</span>
      <span>${f.bonus}</span>
    </button>`;
  }).join('');
  strip.querySelectorAll('[data-finish]').forEach((btn) => {
    btn.addEventListener('click', () => openFinishDetail(btn.dataset.finish));
  });
  const apexStrip = root.querySelector('[data-apex-strip]');
  apexStrip.innerHTML = RARITY_APEX_KEYS.map((key) => {
    const tier = TYPE_EGG_RARITIES[key];
    return `<div class="finish-card apex-card" style="--apex:${tier.color}">
      <span class="apex-symbol">✦</span>
      <b>${tier.name}</b>
      <span>+${(RARITY_COIN_BONUS[key] || 0).toLocaleString()} nominal · ${typeof gamePayoutCeiling === 'function' ? gamePayoutCeiling(key) : GAME_COIN_CAP} paid</span>
      <span class="tiny muted">Trail rank ${RARITY_TIER_ORDER.indexOf(key) + 1} of ${RARITY_TIER_ORDER.length}</span>
    </div>`;
  }).join('');

  paint();
  return () => lazyGrid.clear();
}

function openFinishDetail(key) {
  const f = FINISHES[key];
  if (!f) return;
  const owned = typeof finishOwnedCounts === 'function' ? (finishOwnedCounts()[key] || 0) : 0;
  const odds = typeof finishDropPercent === 'function' ? finishDropPercent(key) : '';
  const sample = {
    id: `finish-detail-${key}`, element: 'bloom', breed: 'puff', stage: 'sprite', variant: key,
    pattern: 'plain', palette: 'native', accessory: 'none', name: f.name, level: 3, size: 'standard',
  };
  openSheet({
    title: `${f.icon} ${f.name} finish`,
    sub: 'A rare shell that can appear on any type.',
    body: `<div class="preview-box" style="margin-top:12px">
        <div style="width:150px;margin:0 auto">${spriteSVG(sample, { expr: 'happy' })}</div>
        <div class="row" style="flex-wrap:wrap;justify-content:center;gap:4px">
          <span class="chip">${f.name}</span>
          <span class="chip">Owned × ${owned}</span>
          ${odds ? `<span class="chip">${odds} of finish drops</span>` : ''}
        </div>
      </div>
      <div class="card" style="padding:12px;margin-top:10px;text-align:left;font-size:12px;line-height:1.6">${f.desc}</div>
      <div class="card" style="padding:12px;margin-top:10px;text-align:left">
        <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">FINISH BONUS</div>
        <div class="small" style="margin-top:4px">${f.icon} <b>${f.bonus}</b></div>
        <div class="tiny muted" style="margin-top:6px">Finishes stack with gene powers, breed habits, combos, and evolution powers.</div>
      </div>
      <div class="actions" style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-primary btn-block" data-finish-nest>Look for one in the Nest</button>
      </div>`,
    onMount: (sheet, close) => {
      sheet.querySelector('[data-finish-nest]').addEventListener('click', () => {
        close();
        App.go('nest');
      });
    },
  });
}

/* Finish Lab: a family x style row matrix with one column per finish. The
   sheet only mounts the rows LazyGrid asks for, and every cell is drawn by the
   same spriteSVG renderer as the Collection and Codex strips. */
function finishLabStyleKeys() {
  const keys = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANT_KEYS : null;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  return Array.isArray(keys) && table ? keys.filter((key) => !!table[key]) : [];
}

function finishLabFamilyRows(scope) {
  if (scope === 'codex' && typeof SPECIES_FAMILY_GROUPS !== 'undefined') {
    return (Array.isArray(SPECIES_FAMILY_GROUPS) ? SPECIES_FAMILY_GROUPS : []).map((family) => {
      const species = (Array.isArray(family.species) ? family.species : []).find((key) => {
        if (!key || !ELEMENTS[key]) return false;
        return typeof isSecretSpecies !== 'function' || !isSecretSpecies(key);
      }) || (Array.isArray(family.species) ? family.species : []).find((key) => !!ELEMENTS[key]);
      if (!species) return null;
      const el = ELEMENTS[species];
      return {
        key: `family:${family.id}`,
        name: family.label || family.id,
        sub: el.name || species,
        element: species,
        nativeStyle: el.puffleStyle || '',
        icon: el.icon || '✦',
        color: el.primary || '#B9C6D4',
      };
    }).filter(Boolean);
  }
  if (typeof SPRITE_PUFFLE_FAMILY === 'undefined' || !Array.isArray(SPRITE_PUFFLE_FAMILY)) return [];
  return SPRITE_PUFFLE_FAMILY.map((row) => ({
    key: `puffle:${row.key}`,
    name: row.name,
    sub: row.short,
    element: row.key,
    nativeStyle: row.key,
    icon: row.icon || '☁️',
    color: row.color || '#B9C6D4',
  }));
}

function finishLabStyleLabel(key) {
  if (key === 'native') return 'Native';
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  return table && table[key] ? String(table[key].name || key).replace(' Puffle', '') : key;
}

function finishLabStyleColor(key, family) {
  if (key === 'native') return family.color || '#B9C6D4';
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  return table && table[key] ? table[key].primary : family.color || '#B9C6D4';
}

function finishLabColumns() {
  const keys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  return [
    { key: '', label: 'None', icon: '∅', mark: 'var(--muted)' },
    ...keys.map((key) => {
      const f = FINISHES[key];
      return { key, label: f ? f.name : key, icon: f ? f.icon : '✦', mark: f ? (f.body || f.primary || 'var(--muted)') : 'var(--muted)' };
    }),
  ];
}

function finishLabRowHTML(item, columns) {
  const { family, styleKey } = item;
  const styleTable = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const previewStyle = styleKey === 'native' ? family.nativeStyle : styleKey;
  const styleLabel = finishLabStyleLabel(styleKey);
  const styleColor = finishLabStyleColor(styleKey, family);
  const cells = columns.map((column) => {
    const sample = {
      id: `finish-lab-${family.key}-${styleKey}-${column.key || 'none'}`.replace(/[^a-zA-Z0-9_-]/g, '-'),
      element: family.element,
      breed: 'puff',
      stage: 'sprite',
      variant: column.key || null,
      puffleVariant: previewStyle || null,
      pattern: 'plain',
      palette: 'native',
      accessory: 'none',
      name: family.name,
      level: 3,
      size: 'standard',
      shiny: false,
    };
    const art = typeof spriteSVG === 'function' ? spriteSVG(sample, { still: true, expr: 'happy' }) : '';
    return `<span class="finish-lab-cell" data-lab-cell="${esc(column.key || 'none')}" title="${esc(family.name)} · ${esc(styleLabel)} · ${esc(column.label)}">${art}</span>`;
  }).join('');
  return `<div class="finish-lab-row" style="--lab-cols:${columns.length}" data-lab-row="${esc(family.key)}:${esc(styleKey)}" data-lab-family="${esc(family.key)}" data-lab-style="${esc(styleKey)}">
    <div class="finish-lab-row-head">
      <i class="finish-lab-family-mark" style="background:${styleColor}" aria-hidden="true"></i>
      <span class="finish-lab-family-copy"><b>${family.icon || '✦'} ${esc(family.name)}</b><small>${esc(styleTable && styleTable[previewStyle] ? styleTable[previewStyle].name : styleLabel)}</small></span>
    </div>${cells}</div>`;
}

function openFinishLab() {
  const columns = finishLabColumns();
  let scope = 'puffle';
  let selectedStyles = ['native'];
  const availableStyles = finishLabStyleKeys();
  ['golden_guardian', 'aurora'].forEach((key) => {
    if (availableStyles.includes(key) && !selectedStyles.includes(key)) selectedStyles.push(key);
  });
  if (selectedStyles.length === 1 && availableStyles.length) selectedStyles.push(availableStyles[0]);
  let grid = null;

  const header = `<div class="finish-lab-head" style="--lab-cols:${columns.length}">
    <span class="finish-lab-corner">Family / style</span>
    ${columns.map((column) => `<span class="finish-lab-column" title="${esc(column.label)}"><i style="background:${column.mark}"></i><b>${column.icon}</b><small>${esc(column.label)}</small></span>`).join('')}
  </div>`;

  const body = `<div class="finish-lab" data-finish-lab>
    <div class="card finish-lab-controls">
      <div class="between" style="gap:8px;align-items:flex-start">
        <div><div class="eyebrow">LIVE PREVIEW</div><b style="font-size:13px">Family × style × finish</b></div>
        <span class="chip" data-lab-summary></span>
      </div>
      <div class="finish-lab-control-row">
        <span class="finish-lab-control-label">Families</span>
        <div class="row" style="gap:5px;flex-wrap:wrap">
          <button type="button" class="chip on" data-lab-scope="puffle">☁️ Sprite Puffle breeds</button>
          <button type="button" class="chip" data-lab-scope="codex">🗂️ All Codex families</button>
        </div>
      </div>
      <div class="finish-lab-control-row">
        <span class="finish-lab-control-label">Styles</span>
        <div class="row" data-lab-style-chips style="gap:5px;flex-wrap:wrap"></div>
        <select class="type-search finish-lab-style-select" data-lab-style-add aria-label="Add a style to the Finish Lab">
          <option value="">Add style…</option>
          ${availableStyles.map((key) => `<option value="${esc(key)}">${esc(finishLabStyleLabel(key))}</option>`).join('')}
        </select>
      </div>
      <p class="tiny muted" style="margin:8px 0 0;line-height:1.5">Every cell is the live sprite renderer. Rows mount as you scroll; the full matrix never renders at once.</p>
    </div>
    <div class="finish-lab-scroll" data-lab-scroll>
      ${header}
      <div class="finish-lab-grid" data-lab-grid></div>
    </div>
    <p class="tiny muted" style="margin:8px 2px 0;line-height:1.5">Scroll sideways for every finish. “Native” uses each family’s own style; “None” removes the finish.</p>
  </div>`;

  openSheet({
    title: '🧪 Finish Lab',
    sub: 'Compare family, style and finish side by side.',
    body,
    key: 'finish-lab',
    onMount: (root) => {
      const lab = root.querySelector('[data-finish-lab]');
      const gridBox = root.querySelector('[data-lab-grid]');
      const summary = root.querySelector('[data-lab-summary]');
      const styleChips = root.querySelector('[data-lab-style-chips]');
      const styleAdd = root.querySelector('[data-lab-style-add]');
      grid = new LazyGrid(gridBox, { batchSize: 4, rootMargin: '500px 0px', virtual: true, windowSize: 20 });

      const paintStyleChips = () => {
        styleChips.innerHTML = selectedStyles.map((key) => `<span class="chip finish-lab-style-chip" data-lab-style-chip="${esc(key)}" style="border-color:${finishLabStyleColor(key, { color: '#B9C6D4' })}">${esc(finishLabStyleLabel(key))}${key === 'native' ? '' : `<button type="button" data-lab-remove-style="${esc(key)}" aria-label="Remove ${esc(finishLabStyleLabel(key))}">×</button>`}</span>`).join('');
        [...styleAdd.options].forEach((option) => {
          option.disabled = !!option.value && selectedStyles.includes(option.value);
        });
      };

      const rebuild = () => {
        const families = finishLabFamilyRows(scope);
        const rows = [];
        families.forEach((family) => {
          selectedStyles.forEach((styleKey) => rows.push({ family, styleKey, key: `${family.key}:${styleKey}` }));
        });
        grid.reset(rows, (item) => finishLabRowHTML(item, columns));
        lab.dataset.labRows = String(rows.length);
        lab.dataset.labVisible = String(grid.rendered);
        summary.textContent = `${families.length} families · ${selectedStyles.length} styles · ${columns.length} finishes`;
        paintStyleChips();
      };

      root.querySelectorAll('[data-lab-scope]').forEach((button) => {
        button.addEventListener('click', () => {
          scope = button.dataset.labScope === 'codex' ? 'codex' : 'puffle';
          root.querySelectorAll('[data-lab-scope]').forEach((other) => other.classList.toggle('on', other === button));
          rebuild();
          if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
        });
      });
      styleChips.addEventListener('click', (event) => {
        const remove = event.target instanceof Element ? event.target.closest('[data-lab-remove-style]') : null;
        if (!remove) return;
        const key = remove.dataset.labRemoveStyle;
        if (selectedStyles.length <= 1) return;
        selectedStyles = selectedStyles.filter((styleKey) => styleKey !== key);
        rebuild();
        if (typeof Sfx !== 'undefined' && Sfx.pop) Sfx.pop();
      });
      styleAdd.addEventListener('change', () => {
        const key = styleAdd.value;
        styleAdd.value = '';
        if (!key || selectedStyles.includes(key)) return;
        if (selectedStyles.length >= 4) {
          if (typeof toast === 'function') toast('Compare up to four styles at a time.', '🎨');
          return;
        }
        selectedStyles.push(key);
        rebuild();
        if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
      });
      rebuild();
    },
    onClose: () => {
      if (grid) grid.clear();
      grid = null;
    },
  });
}

function openTypeDetail(key) {
  const el = ELEMENTS[key];
  if (!el) return;
  const tier = TYPE_EGG_RARITIES[typeEggRarity(key)];
  const power = GENE_POWERS[key];
  const price = TYPE_EGG_PRICE[key];
  const hybrids = hybridsFor(key);
  const exotic = isExoticSpecies(key);
  const vaultSecret = isSecretSpecies(key);
  const secretVariant = el.variantFamily === 'secret';
  const secret = vaultSecret || secretVariant;
  const master = key === MASTER_CHEAT_SPECIES || !!el.masterTier;
  const vaulted = vaultSecret || key === MASTER_CHEAT_SPECIES;
  const baseRoster = typeof BASE_ROSTER_KEYS !== 'undefined' && BASE_ROSTER_KEYS.includes(key);
  const biome = biomeForSpecies(key);
  const pal = resolvePalette({ element: key, palette: 'native' });
  const sample = {
    id: `type-detail-${key}`, element: key, breed: 'puff', stage: 'sprite', variant: el.forcedVariant || null,
    pattern: 'plain', palette: 'native', accessory: 'none', name: el.name, level: 3, size: 'standard',
  };
  openSheet({
    title: el.name,
    sub: `${tier.name} tier · ${el.trait}`,
    body: `<div class="preview-box" style="margin-top:12px">
        <div class="glow" style="position:absolute;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle, ${pal.body}55, transparent 65%);filter:blur(12px)"></div>
        <div style="width:150px;margin:0 auto">${spriteSVG(sample, { expr: 'happy' })}</div>
        <div class="row" style="flex-wrap:wrap;justify-content:center;gap:4px">
          <span class="chip">${tier.name}</span>
          <span class="chip">${vaulted ? 'Vault only' : `${price || '—'} 🪙 egg`}</span>
          ${vaulted ? '' : RARITY_APEX_KEYS.map((rank) => `<button class="chip apex-jump" data-apex-jump="${rank}" style="border-color:${TYPE_EGG_RARITIES[rank].color}66" title="Open this egg in the Nest">${TYPE_EGG_RARITIES[rank].name} egg · ${typeEggApexPrice(key, rank).toLocaleString()} 🪙 ›</button>`).join('')}
          <span class="chip">Titan · ${TITAN_NAMES[key]}</span>
          ${baseRoster ? '<span class="chip">◻️ Base roster</span>' : ''}
          ${master ? `<span class="chip chip-exotic">🕹️ ${vaulted ? 'Master secret' : 'Master tier'}</span>` : secretVariant ? '<span class="chip chip-exotic">🔐 Secret variant</span>' : vaultSecret ? '<span class="chip chip-exotic">🔐 Secret Vault</span>' : el.alwaysShiny ? '<span class="chip chip-exotic">🌈 Prismatic · always shiny</span>' : exotic ? '<span class="chip chip-exotic">✦ Exotic guardian</span>' : ''}
          ${biome ? `<span class="chip">${biome.emoji} ${esc(biome.name)}</span>` : ''}
        </div>
      </div>
      ${typeof rarityLadderHTML === 'function' ? rarityLadderHTML(typeEggRarity(key)) : ''}
      <div class="card" style="padding:12px;margin-top:10px;text-align:left;font-size:12px;line-height:1.6">${el.blurb}</div>
      ${typeof puffleEvolutionCardHTML === 'function' ? puffleEvolutionCardHTML({ element: key, stage: 'baby' }) : ''}
      ${typeof puffleStatsHTML === 'function' ? puffleStatsHTML(key, 0) : ''}
      ${typeof puffleMatchupHTML === 'function' ? puffleMatchupHTML(key) : ''}
      <div class="section-title" style="margin-top:12px"><h2>Gene power</h2></div>
      <div class="card" style="padding:12px;display:flex;gap:10px;align-items:center;text-align:left">
        <span style="font-size:24px">${power.icon}</span>
        <span><b style="font-size:12.5px">${power.name}</b><br><span class="tiny muted">${power.desc}</span></span>
      </div>
      <div class="section-title" style="margin-top:12px"><h2>Hybrids</h2><span>${hybrids.length}</span></div>
      <div class="row" style="flex-wrap:wrap;gap:6px;justify-content:flex-start">
        ${hybrids.length
          ? hybrids.map((h) => {
            const info = typeof window.hybridRarityFor === 'function' ? window.hybridRarityFor(h.name) : null;
            const tier = info ? info.tier : null;
            return `<span class="chip"${tier ? ` style="border-color:${tier.color}66" title="${tier.name}: ${info.species.look}"` : ''}>${h.name} <span class="tiny muted">× ${ELEMENTS[h.element].name}</span>${tier ? ` <span class="tiny" style="color:${tier.color}">${tier.icon} ${tier.short}</span>` : ''}</span>`;
          }).join('')
          : '<span class="tiny muted">No signature hybrids yet — it still blends colors like any parent.</span>'}
      </div>
      <div class="actions" style="display:flex;flex-direction:column;gap:8px;margin-top:14px">
        ${vaulted
          ? '<button class="btn btn-primary btn-block" data-codex-vault>Open the Secret Vault</button>'
          : '<button class="btn btn-primary btn-block" data-codex-nest>Find its egg in the Nest</button>'}
        ${typeof Wishlist !== 'undefined' ? Wishlist.pinButtonHTML(key, { block: true }) : ''}
        <button class="btn btn-soft btn-block" data-codex-wiki>📖 Read the wiki article</button>
      </div>`,
    onMount: (sheet, close) => {
      sheet.querySelector('[data-codex-nest]')?.addEventListener('click', () => {
        close();
        App.go('nest');
      });
      sheet.querySelector('[data-wishlist-toggle]')?.addEventListener('click', () => {
        if (typeof Wishlist !== 'undefined') Wishlist.toggleWithUI(key);
      });
      sheet.querySelector('[data-codex-vault]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openSecretVault(), 30);
      });
      sheet.querySelectorAll('[data-apex-jump]').forEach((btn) => btn.addEventListener('click', () => {
        const rank = btn.dataset.apexJump;
        close();
        openApexTypeEgg(key, rank);
      }));
      sheet.querySelector('[data-codex-wiki]').addEventListener('click', () => {
        close();
        App.go('wiki');
        openWikiArticle(key);
      });
    },
  });
}
