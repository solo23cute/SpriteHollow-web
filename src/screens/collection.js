/* Collection: every sprite you've raised, plus the detail sheet. */

/* The Puffle palette a sprite carries. Older saves predate the field, so resolve
   the species style first; unthemed species get no badge rather than a fallback. */
function puffleVariantOf(s) {
  if (!s) return '';
  if (s.puffleVariant) return s.puffleVariant;
  const meta = typeof ELEMENTS !== 'undefined' ? ELEMENTS[s.element] : null;
  return (meta && meta.puffleStyle) || '';
}

function puffleVariantCounts() {
  const counts = {};
  (state.sprites || []).forEach((s) => {
    const key = puffleVariantOf(s);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function puffleVariantBadge(s) {
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const key = puffleVariantOf(s);
  const variant = table && table[key];
  if (!variant) return '';
  return `<span class="chip" data-variant-badge="${key}" title="${esc(variant.name)} · ${esc(variant.theme || '')}" style="border-color:${variant.primary}"><i style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${variant.primary};margin-right:4px"></i>${esc(variant.name.replace(' Puffle', ''))}</span>`;
}

/* Owned finishes count every grown sprite, including the retirement home. Eggs
   are excluded because they have not hatched into a finished shell yet. */
function finishOwnedCounts() {
  const keys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  const table = typeof FINISHES !== 'undefined' ? FINISHES : null;
  const counts = {};
  keys.forEach((key) => { counts[key] = 0; });
  if (!table || typeof state === 'undefined' || !Array.isArray(state.sprites)) return counts;
  state.sprites.forEach((s) => {
    if (!s || s.stage === 'egg' || !table[s.variant]) return;
    counts[s.variant] = (counts[s.variant] || 0) + 1;
  });
  return counts;
}

/* Exact share of finish drops, derived from the same weights rollFinish uses. */
function finishDropPercent(key) {
  const keys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  const weights = typeof FINISH_WEIGHTS !== 'undefined' ? FINISH_WEIGHTS : {};
  const total = keys.reduce((sum, finishKey) => sum + (Number(weights[finishKey]) || 0), 0);
  const weight = Number(weights[key]) || 0;
  if (!total || !weight) return '0%';
  const percent = (weight / total) * 100;
  const text = Number.isInteger(percent)
    ? String(percent)
    : percent.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${text}%`;
}

/* The four named forms of this sprite's evolution line, with the form it has
   reached lit up and the ones still ahead dimmed. */
function puffleEvolutionCardHTML(s) {
  if (!s || s.stage === 'egg') return '';
  const line = typeof window.puffleEvolutionLine === 'function' ? window.puffleEvolutionLine(s.element) : null;
  if (!line || !Array.isArray(line.stages) || line.stages.length < 2) return '';
  const index = typeof window.puffleEvolutionStageIndex === 'function' ? window.puffleEvolutionStageIndex(s.stage) : 0;
  const family = String(line.family || '').replace(/^./, (ch) => ch.toUpperCase());
  const rarities = typeof window.puffleRarityForChain === 'function' ? window.puffleRarityForChain(line.key) : [];
  const current = rarities[index] || null;
  /* One live thumbnail per form: the real sprite drawn at a representative age
     for that form, and a button so the form can be inspected without evolving. */
  const FORM_STAGE = ['baby', 'sprite', 'youngadult', 'elder', 'apex'];
  const stageSwatch = (i) => {
    const stage = FORM_STAGE[i] || 'baby';
    /* A Club Penguin puffle keeps the coat it rolled at every stage, so its
       thumbnails must not paint the old stage colours over it. */
    const ownColour = typeof cpPuffleColourOfStyle === 'function' ? cpPuffleColourOfStyle(s.puffleVariant) : null;
    const stageStyle = ownColour
      ? `cp_color_${ownColour}`
      : (typeof window.puffleEvolutionColour === 'function' ? window.puffleEvolutionColour(line.key, stage) : null);
    const sample = stageStyle ? { ...s, stage, puffleVariant: stageStyle } : { ...s, stage };
    if (typeof spriteSVG === 'function') {
      try {
        const svg = spriteSVG(sample, { still: true })
          .replace('<svg ', '<svg width="18" height="18" ')
          .replace('class="sprite-motion', 'class="evo-thumb-art sprite-motion');
        return `<button type="button" class="evo-thumb" data-evo-form="${i}" data-evo-owned="${index}" data-evo-chain="${esc(line.key)}" data-evo-element="${esc(s.element)}" title="Stage ${i + 1} · ${esc(stage)} · tap to preview" style="display:inline-flex;width:18px;height:18px;margin-right:4px;vertical-align:-4px;border-radius:50%;overflow:hidden;padding:0;border:0;background:transparent;cursor:pointer">${svg}</button>`;
      } catch (e) { /* fall through to the colour dot */ }
    }
    const t = typeof window.lumiStageTint === 'function' ? window.lumiStageTint(i) : { hue: 0, sat: 1, bright: 1 };
    const bodyHex = (typeof ELEMENTS !== 'undefined' && ELEMENTS[s.element] && ELEMENTS[s.element].primary) || '#cfd8e3';
    return `<i class="evo-swatch" title="Stage ${i + 1} colourway" style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px;background:${bodyHex};filter:hue-rotate(${t.hue}deg) saturate(${t.sat}) brightness(${t.bright})"></i>`;
  };
  const chainBadge = (tier, seed) => (tier && typeof window.puffleBadgeFor === 'function' ? window.puffleBadgeFor(tier.key, seed) : (tier ? tier.badge : ''));
  /* The whole card is a preview affordance: tapping it opens the line at the
     form this sprite has actually reached, while the per-stage buttons keep
     opening their own stage. */
  return `<div class="card" style="padding:12px;margin-top:10px;cursor:pointer" data-evo-line="${esc(line.key)}" data-evo-card-line="${esc(line.key)}" data-evo-card-element="${esc(s.element)}" data-evo-card-form="${index}" title="Open this line at ${esc(line.stages[index] || line.stages[0])}">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">EVOLUTION LINE</div><span class="chip" ${current ? `style="border-color:${current.color}" title="${esc(current.name)} ${current.stars}★ · ${esc(chainBadge(current, line.key + ':' + index))}"` : ''}>${current ? `${current.icon} ${esc(current.name)} ${'★'.repeat(current.stars)}` : `Form ${index + 1} of ${line.stages.length}`}</span></div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:9px">
      ${line.stages.map((name, i) => `<span class="chip" ${i === index ? 'data-evo-current' : ''} style="opacity:${i === index ? 1 : i < index ? 0.62 : 0.4};border-color:${i === index ? 'var(--accent)' : 'var(--line)'}" title="${esc(name)}${rarities[i] ? ` · ${esc(rarities[i].name)} ${rarities[i].stars}★ ${esc(chainBadge(rarities[i], line.key + ':' + i))}${rarities[i].chance ? ` · ${rarities[i].chance}%` : ''}` : ''}">${i === index ? '✦ ' : ''}${stageSwatch(i)}${rarities[i] ? `${rarities[i].icon} ` : ''}${esc(name)}</span>${i < line.stages.length - 1 ? '<span class="tiny muted">➜</span>' : ''}`).join('')}
    </div>
    <p class="tiny muted" style="margin:9px 0 0;line-height:1.5">${esc(family)} line · hatches as ${esc(line.stages[0])} and ascends to ${esc(line.stages[line.stages.length - 1])}. <b style="color:var(--accent)">Tap the card to open it at ${esc(line.stages[index] || line.stages[0])}.</b></p>
    ${(function () {
      const power = typeof window.puffleFamilyPower === 'function' ? window.puffleFamilyPower(s.element) : null;
      return power ? `<p class="tiny" style="margin:4px 0 0;line-height:1.5;color:var(--accent);font-weight:700">✦ ${esc(power)}</p>` : '';
    })()}
    ${(function () {
      const t = typeof spriteTraits === 'function' ? spriteTraits(s) : null;
      if (!t || !t.ability) return '';
      return `<p class="tiny" data-trait-skill style="margin:5px 0 0;line-height:1.5;color:var(--text)">${t.ability.icon} <b>${esc(t.ability.name)}</b> — ${esc(t.ability.desc)} <span class="muted">(${esc(t.ears)} ears · ${esc(t.head)} head · ${esc(t.mouth)} mouth · iris ${esc(t.iris)})</span></p>`;
    })()}
    ${(function () {
      if (typeof window.pufflePersonalityFor !== 'function') return '';
      const p = window.pufflePersonalityFor(s);
      if (!p || !p.primary || !p.secondary) return '';
      const chip = (t) => `<span class="chip" data-personality-trait="${esc(t.key)}" title="${esc(t.bonus)}" style="border-color:${t.color}">${t.icon} ${esc(t.name)}</span>`;
      return `<div data-personality style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;align-items:center">
        <span class="tiny muted" style="font-weight:800;letter-spacing:.08em">PERSONALITY</span>${chip(p.primary)}${chip(p.secondary)}
        <span class="tiny muted">${esc(p.lore.name)} · ${esc(p.lore.personality.join(' / '))}</span>
      </div>
      <p class="tiny muted" style="margin:5px 0 0;line-height:1.5">${esc(p.lore.signature)} Likes ${esc(p.lore.likes.join(', '))}.</p>`;
    })()}
    ${(function () {
      if (typeof window.puffleThemeFor !== 'function') return '';
      const theme = window.puffleThemeFor(s);
      if (!theme) return '';
      const swatches = theme.colors.map((hex) => `<i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${esc(hex)};border:1px solid rgba(0,0,0,.28)"></i>`).join('');
      return `<div data-puffle-theme="${esc(theme.key)}" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;align-items:center">
        <span class="tiny muted" style="font-weight:800;letter-spacing:.08em">THEME</span>
        <span class="chip" title="${esc(theme.desc)}" style="border-color:${esc(theme.colors[0])};gap:5px">${theme.icon} ${esc(theme.name)} <span style="display:inline-flex;gap:2px">${swatches}</span></span>
        <span class="tiny muted">${esc(theme.familyName)} coat story · ${esc(theme.desc)}</span>
      </div>`;
    })()}
    ${(function () {
      /* The chain's actual painted palette, so the colourway is readable as
         hexes instead of only being visible on the sprite. */
      if (typeof basePalette !== 'function') return '';
      let pal = null;
      try { pal = basePalette({ element: s.element }); } catch (e) { return ''; }
      if (!pal) return '';
      const way = typeof chainColourway === 'function' ? chainColourway(s.element) : null;
      const slots = [['body', pal.body], ['light', pal.light], ['deep', pal.deep], ['accent', pal.accent]]
        .filter(([, hex]) => !!hex);
      if (!slots.length) return '';
      const shift = way ? `${way.hueShift > 0 ? '+' : ''}${way.hueShift}° hue` : '';
      const plain = slots.map(([slot, hex]) => `${slot} ${hex}`).join(' ');
      return `<div data-colourway style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:9px">
        <span class="tiny muted" style="font-weight:800;letter-spacing:.08em">COLOURWAY${shift ? ` · ${esc(shift)}` : ''}</span>
        ${slots.map(([slot, hex]) => `<button type="button" class="chip" data-colourway-slot="${esc(slot)}" data-colourway-hex="${esc(hex)}" title="Copy ${esc(slot)} ${esc(hex)}" style="gap:5px;padding:3px 7px;cursor:pointer"><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${esc(hex)};border:1px solid rgba(0,0,0,.28);flex:0 0 auto"></i><span style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:9.5px;letter-spacing:0">${esc(hex)}</span></button>`).join('')}
        <button type="button" class="chip" data-colourway-copy="${esc(plain)}" title="Copy all four hexes" style="border-color:var(--accent);font-weight:800;cursor:pointer">⧉ Copy hexes</button>
      </div>`;
    })()}
  </div>`;
}

function puffleVariantCollectionHTML() {
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const keys = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANT_KEYS : null;
  if (!table || !keys || !keys.length) return '';
  const counts = puffleVariantCounts();
  const owned = keys.filter((key) => counts[key]);
  /* The collection sheet stacks its puffles by rarity tier, so every style is
     listed under the tier it belongs to. */
  const groups = typeof window.lumiPuffleTierGroups === 'function'
    ? window.lumiPuffleTierGroups()
    : [{ tier: { key: 'common', name: 'Styles', color: '#8FA8B8', motto: '' }, keys }];
  return `<div class="section-title"><h2>Puffle styles</h2><span>${owned.length} of ${keys.length} collected</span></div>
    <div class="card" style="padding:12px;margin-bottom:12px">
      ${groups.map((group) => `<div class="puffle-tier" data-puffle-tier="${group.tier.key}" style="border-left:3px solid ${group.tier.color};padding-left:9px;margin-bottom:11px">
        <div class="between" style="margin-bottom:6px;gap:8px"><span class="tiny" style="font-weight:800;letter-spacing:.08em;color:${group.tier.color}">${esc(group.tier.name.toUpperCase())}</span><span class="tiny muted">${esc(group.tier.motto)}</span></div>
        <div class="style-picker" data-variant-collection="${group.tier.key}">
          ${group.keys.map((key) => {
            const variant = table[key];
            const count = counts[key] || 0;
            return `<span class="chip" data-variant-owned="${key}" title="${esc(variant.name)} · ${esc(variant.theme || '')}" style="border-color:${variant.primary};${count ? '' : 'opacity:.42'}"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg, ${variant.primary}, ${variant.secondary});margin-right:5px"></i>${esc(variant.name.replace(' Puffle', ''))}${count ? ` × ${count}` : ''}</span>`;
          }).join('')}
        </div>
      </div>`).join('')}
      <div class="style-picker" data-rarity-share style="margin:4px 0 8px">${(window.PUFFLE_RARITY_TIERS || []).map((tier) => `<span class="chip" title="${esc(tier.name)} · ${tier.chance}% of the collection" style="border-color:${tier.color}"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${tier.color};margin-right:5px"></i>${esc(tier.name)} ${tier.chance}%</span>`).join('')}</div>
      <p class="tiny muted" style="margin:2px 0 0">Each sprite keeps its own style; pick one in the Studio.</p>
    </div>`;
}

function finishCollectionHTML() {
  const table = typeof FINISHES !== 'undefined' ? FINISHES : null;
  const keys = typeof FINISH_KEYS !== 'undefined' ? FINISH_KEYS : [];
  if (!table || !keys.length) return '';
  const counts = finishOwnedCounts();
  const grown = typeof grownSprites === 'function' ? grownSprites() : [];
  const finished = keys.reduce((sum, key) => sum + (counts[key] || 0), 0);
  const none = grown.filter((s) => !table[s.variant]).length;
  const collected = keys.filter((key) => counts[key] > 0).length;
  return `<div class="section-title"><h2>Finishes</h2><span>${collected} of ${keys.length} collected · ${finished} finished</span></div>
    <div class="card finish-collection">
      <div class="style-picker finish-filters" data-finish-filters>
        <button type="button" class="chip finish-filter on" data-finish-filter="all" data-finish-owned="${grown.length}"><span>All</span><span class="finish-filter-count">× ${grown.length}</span></button>
        <button type="button" class="chip finish-filter${none ? '' : ' is-unowned'}" data-finish-filter="none" data-finish-owned="${none}"><span>No finish</span><span class="finish-filter-count">× ${none}</span></button>
        ${keys.map((key) => {
          const f = table[key];
          const count = counts[key] || 0;
          const odds = finishDropPercent(key);
          return `<button type="button" class="chip finish-filter${count ? '' : ' is-unowned'}" data-finish-filter="${key}" data-finish-owned="${count}" title="${esc(f.desc)} · ${odds} of finish drops">
            <i class="finish-filter-mark" style="background:${f.body}" aria-hidden="true"></i>
            <span>${f.icon} ${esc(f.name)}</span>
            <span class="finish-filter-count">× ${count}</span>
            <span class="finish-filter-odds" data-finish-odds="${key}">${odds}</span>
          </button>`;
        }).join('')}
      </div>
      <p class="tiny muted" style="margin:8px 0 0;line-height:1.5">Counts include active and retired sprites. Percentages are exact shares when a finish drops.</p>
    </div>`;
}

/* The elemental roster is a species guide: it lists every painted form from the
   atlas, whether or not one is currently in the Hollow. */
function elementalRosterHTML() {
  const roster = typeof window !== 'undefined' ? window.LUMI_ELEMENT_ROSTER : null;
  if (!Array.isArray(roster) || !roster.length) return '';
  return `<div class="section-title"><h2>Elemental species</h2><span>${roster.length} forms</span></div>
    <div class="card" style="padding:12px;margin-bottom:12px">
      <div class="style-picker" data-element-roster>
        ${roster.map((entry) => `<span class="chip" data-element-chip="${entry.key}" title="${esc(entry.name)} · ${esc(entry.element)}" style="border-color:${entry.palette.body}"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg, ${entry.palette.body}, ${entry.palette.wing});margin-right:5px"></i>${esc(entry.name.replace(' Puffle', ''))}</span>`).join('')}
      </div>
      <p class="tiny muted" style="margin:9px 0 0">Every element painted for the puffle atlas. How many of each you've raised is counted by the type filters above.</p>
    </div>`;
}

const COLLECTION_GOAL_META = Object.freeze({
  family: { icon: '🌿', label: 'Family', cta: 'Open next' },
  constellation: { icon: '🌌', label: 'Chart', cta: 'Open chart' },
  biome: { icon: '🧭', label: 'Biome', cta: 'Open atlas' },
  egg: { icon: '🥚', label: 'Egg shelf', cta: 'Buy next' },
});

function collectionGoalEnv() {
  const scenes = typeof SCENES !== 'undefined' ? SCENES : {};
  const biomes = typeof BIOME_KEYS !== 'undefined' && typeof TYPE_BIOMES !== 'undefined'
    ? BIOME_KEYS.map((type) => {
      const biome = TYPE_BIOMES[type];
      const scene = biome && scenes[biome.key];
      return scene ? { scene: biome.key, name: scene.name, species: scene.species || [] } : null;
    }).filter(Boolean)
    : [];

  return {
    families: typeof SPECIES_FAMILY_GROUPS !== 'undefined' ? SPECIES_FAMILY_GROUPS : [],
    constellations: typeof Constellations !== 'undefined' ? Constellations : null,
    biomes,
    typeEggs: typeof TYPE_EGG_SPECIES !== 'undefined' ? TYPE_EGG_SPECIES : [],
    hasSpecies: (key) => typeof ELEMENTS !== 'undefined' && !!ELEMENTS[key],
    nameOf: (key) => (typeof ELEMENTS !== 'undefined' && ELEMENTS[key] && ELEMENTS[key].name) || key,
    priceOf: (key) => {
      const price = typeof TYPE_EGG_PRICE !== 'undefined' ? TYPE_EGG_PRICE[key] : null;
      if (price === null || price === undefined || price === '') return null;
      const value = Number(price);
      return Number.isFinite(value) && value >= 0 ? value : null;
    },
    memberName: (member) => (typeof constellationMemberName === 'function'
      ? constellationMemberName(member)
      : (member && member.key) || ''),
  };
}

function collectionGoalCardHTML(card) {
  const meta = COLLECTION_GOAL_META[card.kind] || COLLECTION_GOAL_META.family;
  const total = Math.max(1, Number(card.progress && card.progress.total) || 1);
  const owned = Math.max(0, Math.min(total, Number(card.progress && card.progress.owned) || 0));
  const percent = Math.round((owned / total) * 100);
  const id = !card.target ? ''
    : card.kind === 'constellation' ? card.target.seedId
      : card.kind === 'biome' ? card.target.scene
        : card.target.species;
  return `<button class="goal-card goal-${esc(card.kind)}" type="button" data-goal-kind="${esc(card.kind)}" data-goal-id="${esc(id || '')}" aria-label="${esc(`${meta.label}: ${card.title}. ${card.meta}`)}">
    <span class="gc-top"><span class="gc-icon" aria-hidden="true">${meta.icon}</span><span class="gc-kicker">${esc(meta.label)}</span><span class="gc-count">${owned}/${total}</span></span>
    <b class="gc-title">${esc(card.title)}</b>
    <span class="gc-bar"><i style="width:${percent}%"></i></span>
    <span class="gc-meta">${esc(card.meta)}</span>
    <span class="gc-note">${esc(card.note)}</span>
    <span class="gc-cta">${esc(meta.cta)} <span aria-hidden="true">→</span></span>
  </button>`;
}

function collectionGoalRailBodyHTML() {
  if (typeof CollectionGoals === 'undefined') return '';
  const built = CollectionGoals.build(state, collectionGoalEnv());
  const cards = Array.isArray(built.cards) ? built.cards : [];
  if (!cards.length) return '';
  return `<section class="collection-goal-rail" aria-label="Next collection goals">
    <div class="cgr-head"><div><div class="eyebrow">🎯 Next goals</div><h2>Closest completions</h2></div><span class="tiny muted">Family · Chart · Biome · Egg</span></div>
    <div class="cgr-cards">${cards.map(collectionGoalCardHTML).join('')}</div>
  </section>`;
}

function collectionScreen(root) {
  /* The rarity lens travels with the save, so leaving the Collection no longer
     throws away the tier you were browsing. */
  const savedPrefs = state.collection && typeof state.collection === 'object' ? state.collection : {};
  let filter = 'all';
  let finishFilter = 'all';
  let tierFilter = typeof savedPrefs.tier === 'string' ? savedPrefs.tier : 'all';
  let sortMode = savedPrefs.sort === 'rarity-desc' ? 'rarity-desc' : 'level';
  let query = '';
  /* The rarity ladder is the order authority: filters and sorts both read it,
     so a tier added to RARITY_TIER_ORDER shows up here without another list. */
  const tierOrder = typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER : [];
  /* Recomputed on every paint instead of once at mount: a sprite hatching into
     a tier you did not own adds its chip while the screen is open. */
  function ownedTierList() {
    const keys = new Set(state.sprites.filter((s) => s.stage !== 'egg').map(spriteRarityKey));
    return tierOrder.filter((key) => keys.has(key));
  }
  function writeTierPrefs() {
    state.collection = { ...(state.collection || {}), tier: tierFilter, sort: sortMode };
    if (typeof saveState === 'function') saveState();
  }
  function tierBarHTML(ownedTiers) {
    if (!ownedTiers.length) return '';
    return `<div class="collection-tier-bar">
      <div class="style-picker tier-filters" data-tier-filters>
        <button class="style-opt${tierFilter === 'all' ? ' on' : ''}" data-tier-filter="all">All tiers</button>
        ${ownedTiers.map((key) => {
          const tier = TYPE_EGG_RARITIES[key] || TYPE_EGG_RARITIES.common;
          return `<button class="style-opt${tierFilter === key ? ' on' : ''}" data-tier-filter="${key}">
            <span class="sw" style="background:${tier.gradient || tier.color}"></span>
            ${esc(tier.name)}</button>`;
        }).join('')}
      </div>
      <label class="tier-sort"><span>Sort</span>
        <select data-tier-sort aria-label="Sort sprites">
          <option value="level"${sortMode === 'level' ? ' selected' : ''}>Level</option>
          <option value="rarity-desc"${sortMode === 'rarity-desc' ? ' selected' : ''}>Rarity · high first</option>
        </select>
      </label>
    </div>`;
  }
  /* Only offer filters for elements you actually own. */
  const owned = new Set(state.sprites.map((s) => s.element));
  const ownedCount = new Map();
  state.sprites.forEach((s) => ownedCount.set(s.element, (ownedCount.get(s.element) || 0) + 1));
  /* The types you keep most are the ones you reach for first. */
  const elKeys = ['all', ...ELEMENT_KEYS
    .filter((k) => owned.has(k))
    .sort((a, b) => (ownedCount.get(b) || 0) - (ownedCount.get(a) || 0)
      || ELEMENT_KEYS.indexOf(a) - ELEMENT_KEYS.indexOf(b))];
  const dragonFound = Array.isArray(state.stats && state.stats.dragonTypes) ? state.stats.dragonTypes : [];

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Your collection</div><h1>Sprites</h1><p data-count></p></div>
      <div class="row" style="gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-soft" data-goto-roster>🧭 Roster</button>
        <button class="btn btn-sm btn-soft" data-goto-foods>🍱 Food guide</button>
        <button class="btn btn-sm btn-soft" data-goto-nest>${icon('nest')} Nest</button>
      </div>
    </div>
    <div data-collection-goals></div>
    <div data-wishlist-panel></div>
    <div data-constellation-strip style="margin-bottom:6px"></div>
    <div class="type-tools" style="margin-bottom:10px">
      <input class="type-search" type="search" data-sprite-search placeholder="Search sprites, types, secret, exotic…" aria-label="Search your sprites" autocomplete="off">
    </div>
    <div class="style-picker" data-filters style="margin-bottom:12px">
      ${elKeys.map((k) => `<button class="style-opt ${k === 'all' ? 'on' : ''}" data-filter="${k}">
        <span class="sw" style="${k === 'all' ? 'background:linear-gradient(135deg,var(--accent),var(--accent-2))' : `background:${ELEMENTS[k].primary}`}"></span>
        ${k === 'all' ? 'All' : ELEMENTS[k].name}</button>`).join('')}
    </div>
    <div data-tier-bar></div>
    ${finishCollectionHTML()}
    <div class="collection-grid" data-grid></div>
    <div data-eggs></div>
    <div data-retired hidden>
      <div class="section-title" style="margin-top:18px"><h2>Retirement home</h2><span data-retired-count></span></div>
      <div class="collection-grid retired-grid" data-retired-grid></div>
      <div class="card" style="padding:12px;margin-top:8px;font-size:11px;line-height:1.6;color:var(--muted)">Retired elderly sprites stay home. Their needs stop fading and they stop earning XP, but you can still pet, feed, and visit them. Tap one to bring them back.</div>
    </div>
    ${puffleVariantCollectionHTML()}
    ${elementalRosterHTML()}
    ${typeof puffleArchiveHTML === 'function' ? puffleArchiveHTML() : ''}
    <div class="section-title"><h2>Dragon types</h2><span>${dragonFound.length} of ${DRAGON_NEST_TYPES.length} formed</span></div>
    <div class="card" style="padding:12px;margin-bottom:12px">
      <p class="tiny muted" style="margin:0 0 9px">Every dragon formed in the Dragon Nest is kept here permanently, even after the mini game closes or the app restarts.</p>
      <div class="style-picker">
        ${DRAGON_NEST_TYPES.map((t) => {
          const found = dragonFound.includes(t.key);
          return `<span class="chip" style="${found ? '' : 'opacity:.45'}">${found ? t.icon : '🥚'} ${found ? esc(t.name) : '???'}</span>`;
        }).join('')}
      </div>
    </div>
    <div class="section-title"><h2>Hollow notes</h2></div>
    <div class="card" style="padding:13px;font-size:11.5px;line-height:1.6;color:var(--muted)">
      Sprites are born from eggs and grow through <b style="color:var(--text)">${['Egg', ...STAGE_ORDER.map((stage) => STAGE_LABELS[stage])].join(' → ')}</b>. Retirement unlocks at <b style="color:var(--text)">${STAGE_LABELS.elder} level ${STAGE_LEVEL.elder}</b>, and the level cap is <b style="color:var(--text)">${MAX_LEVEL.toLocaleString()}</b>. Open any sprite to see its next stage and the exact level it needs.
      Merge two level-3+ sprites in the Nest to blend their elements, colors and personalities into a brand new egg.
    </div>`;

  const stopWishlistPanel = typeof Wishlist !== 'undefined'
    ? Wishlist.mount(root.querySelector('[data-wishlist-panel]'))
    : () => {};
  const stopPuffleArchive = typeof bindPuffleArchive === 'function' ? bindPuffleArchive(root) : () => {};
  root.querySelector('[data-goto-roster]').onclick = () => {
    App.rosterReturn = 'collection';
    App.go('roster');
  };
  root.querySelector('[data-goto-nest]').onclick = () => App.go('nest');
  root.querySelector('[data-goto-foods]').onclick = () => App.go('foods');
  const goalsBox = root.querySelector('[data-collection-goals]');
  goalsBox?.addEventListener('click', (event) => {
    const card = event.target instanceof Element ? event.target.closest('[data-goal-kind]') : null;
    if (!card) return;
    const kind = card.dataset.goalKind;
    const id = card.dataset.goalId;
    if (!id) return;
    Sfx.click();
    if (kind === 'family') {
      if (typeof openTypeDetail === 'function') openTypeDetail(id);
      return;
    }
    if (kind === 'constellation') {
      if (typeof openConstellationSheet === 'function') openConstellationSheet(id);
      return;
    }
    if (kind === 'biome') {
      if (typeof openBiomeAtlas === 'function') openBiomeAtlas(id);
      return;
    }
    if (kind === 'egg' && typeof openApexTypeEgg === 'function') {
      openApexTypeEgg(id, 'base');
      if (typeof toast === 'function') toast(`${ELEMENTS[id] ? ELEMENTS[id].name : id} egg pinned in the Nest.`, '🥚');
    }
  });
  /* The creature roster sits above the grid it summarises. */
  if (typeof cpCreatureDexHTML === 'function') {
    const creatureDex = cpCreatureDexHTML();
    const dexAnchor = root.querySelector('[data-count]')?.closest('.section-title');
    if (creatureDex && dexAnchor) dexAnchor.insertAdjacentHTML('afterend', creatureDex);
  }
  const search = root.querySelector('[data-sprite-search]');
  let resetGrid = false;
  search.addEventListener('input', () => {
    query = search.value;
    resetGrid = true;
    paint();
  });

  root.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      root.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('on', b === btn));
      resetGrid = true;
      paint();
      Sfx.click();
    });
  });

  root.querySelectorAll('[data-finish-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      finishFilter = btn.dataset.finishFilter;
      root.querySelectorAll('[data-finish-filter]').forEach((b) => b.classList.toggle('on', b === btn));
      resetGrid = true;
      paint();
      Sfx.click();
    });
  });

  /* Delegated, because the chip row is rebuilt whenever the owned tiers change. */
  root.addEventListener('click', (event) => {
    const btn = event.target instanceof Element ? event.target.closest('[data-tier-filter]') : null;
    if (!btn) return;
    tierFilter = btn.dataset.tierFilter;
    resetGrid = true;
    writeTierPrefs();
    paint();
    commit('collection-tier');
    Sfx.click();
  });

  root.addEventListener('change', (event) => {
    const select = event.target instanceof Element ? event.target.closest('[data-tier-sort]') : null;
    if (!select) return;
    sortMode = select.value === 'rarity-desc' ? 'rarity-desc' : 'level';
    resetGrid = true;
    writeTierPrefs();
    paint();
    commit('collection-sort');
  });

  const grid = root.querySelector('[data-grid]');
  const retiredGridEl = root.querySelector('[data-retired-grid]');
  const retiredSection = root.querySelector('[data-retired]');
  const activeLazy = new LazyGrid(grid, { batchSize: 24, rootMargin: '700px 0px', key: (s) => s.id });
  const retiredLazy = new LazyGrid(retiredGridEl, { batchSize: 24, rootMargin: '500px 0px', key: (s) => s.id });
  const bindCardClicks = (box) => box.addEventListener('click', (event) => {
    const card = event.target instanceof Element ? event.target.closest('[data-sprite]') : null;
    if (card) openSpriteDetail(card.dataset.sprite);
  });
  bindCardClicks(grid);
  bindCardClicks(retiredGridEl);

  let lastTierBar = '';

  function paint() {
    const ownedTiers = ownedTierList();
    if (tierFilter !== 'all' && !ownedTiers.includes(tierFilter)) {
      /* The tier's last sprite left the collection, so its chip is gone; fall
         back to all tiers rather than filtering to something unclickable. */
      tierFilter = 'all';
      writeTierPrefs();
    }
    const nextTierBar = tierBarHTML(ownedTiers);
    const tierBar = root.querySelector('[data-tier-bar]');
    if (tierBar && nextTierBar !== lastTierBar) {
      tierBar.innerHTML = nextTierBar;
      lastTierBar = nextTierBar;
    }
    if (goalsBox) goalsBox.innerHTML = collectionGoalRailBodyHTML();
    const rankOf = (s) => tierOrder.indexOf(spriteRarityKey(s));
    const sorts = {
      level: (a, b) => b.level - a.level || rankOf(b) - rankOf(a),
      'rarity-desc': (a, b) => rankOf(b) - rankOf(a) || b.level - a.level,
    };
    const grown = grownSprites().slice().sort(sorts[sortMode] || sorts.level);
    const active = grown.filter((s) => !s.retired);
    const retired = grown.filter((s) => s.retired);
    const allEggs = eggs();
    const q = query.trim().toLowerCase();
    const matchesQuery = (s) => {
      if (!q) return true;
      const text = spriteSearchText(s);
      return q.split(/\s+/).filter(Boolean).every((part) => text.includes(part));
    };
    const matchesFinish = (s) => finishFilter === 'all'
      || (finishFilter === 'none' ? !FINISHES[s.variant] : s.variant === finishFilter);
    const matchesTier = (s) => tierFilter === 'all' || spriteRarityKey(s) === tierFilter;
    const matchesElement = (s) => filter === 'all' || s.element === filter;
    /* One chain for every list. The active grid, the retirement home and the
       egg row narrow together, so a filter can never leave a matching Master
       sitting in a section the strip above claims is empty. */
    const matches = (s) => matchesElement(s) && matchesFinish(s) && matchesTier(s) && matchesQuery(s);
    const filtered = active.filter(matches);
    const retiredFiltered = retired.filter(matches);
    const eggsShown = allEggs.filter(matches);
    const finishLabel = finishFilter === 'none' ? 'no finish' : (FINISHES[finishFilter]?.name || finishFilter);
    const filtersOn = filter !== 'all' || finishFilter !== 'all' || tierFilter !== 'all' || !!q;
    /* A filtered header says how much of the total is showing; an unfiltered one
       just counts. */
    const rowCount = (shown, total, word) => (filtersOn && shown !== total ? `${shown} of ${total} ${word}` : `${total} ${word}`);
    root.querySelector('[data-count]').textContent = `${rowCount(filtered.length, active.length, active.length === 1 ? 'sprite' : 'sprites')} · ${rowCount(retiredFiltered.length, retired.length, 'retired')} · ${rowCount(eggsShown.length, allEggs.length, allEggs.length === 1 ? 'egg' : 'eggs')}`;
    /* The grid is the active half of the collection, but the copy must not read
       like a split any more: if a filter matches only resting sprites, say so
       and point at them rather than denying they exist. */
    const resting = retiredFiltered.length
      ? ` ${retiredFiltered.length} resting ${retiredFiltered.length === 1 ? 'sprite matches' : 'sprites match'} below.`
      : '';
    const emptyCopy = q
      ? `No sprites match “${esc(query.trim())}”. Try a name, a type, or “exotic”.${resting}`
      : tierFilter !== 'all'
        ? `No ${esc((TYPE_EGG_RARITIES[tierFilter] || {}).name || tierFilter)} sprites yet.${resting}`
        : finishFilter !== 'all'
          ? `No sprites with ${finishLabel} yet.${resting}`
          : filter !== 'all'
            ? `No ${esc(ELEMENTS[filter]?.name || 'such')} sprites yet.${resting || ' Try merging for hybrids!'}`
            : grown.length
              ? 'Everyone is retired right now. Bring someone back from the retirement home below.'
              : 'No sprites yet. Warm an egg in the Nest to meet your first friend.';
    if (!filtered.length) {
      activeLazy.clear();
      grid.innerHTML = `<div class="card empty-state" style="grid-column:1/-1">
        <div style="font-size:30px">🫧</div>
        <p>${emptyCopy}</p>
        <button class="btn btn-primary" data-empty-nest style="margin-top:12px">Open the Nest</button>
      </div>`;
      grid.querySelector('[data-empty-nest]')?.addEventListener('click', () => App.go('nest'));
    } else if (resetGrid) {
      activeLazy.reset(filtered, spriteCardHTML);
    } else {
      activeLazy.refresh(filtered, spriteCardHTML);
    }
    resetGrid = false;
    const eggBox = root.querySelector('[data-eggs]');
    if (eggsShown.length) {
      eggBox.innerHTML = `<div class="section-title" style="margin-top:18px"><h2>Eggs</h2><span>${filtersOn && eggsShown.length !== allEggs.length ? `${eggsShown.length} of ${allEggs.length} · tap to warm` : 'tap to warm'}</span></div>
        <div class="egg-row">${eggsShown.map((e) => {
          const rarity = spriteRarity(e);
          return `<button class="egg-card ${e.shiny ? 'is-shiny' : ''}" data-egg="${e.id}" data-rarity="${spriteRarityKey(e)}" style="--rarity:${rarity.color};--rarity-gradient:${rarity.gradient || rarity.color};--rarity-glow:${rarity.frameGlow || rarity.color};--sh-rim-a:${rarity.color};--sh-rim-b:var(--gold);--sh-rim-c:var(--sh-frame-b, var(--accent-2))" title="${esc(rarity.name)} · ${esc(rarity.eggName || 'egg')} · ${esc(rarity.frameTheme || '')}${e.shiny ? ' · ✨ Shiny egg' : ''}">
          ${eggSVG(e, { progress: e.hatch })}
          <div class="ec-name">${esc(displayName(e))}</div>
          ${e.shiny ? '<div class="ec-shiny">✨ Shiny egg</div>' : ''}
          <div class="ec-sub">${e.hatch >= 100 ? 'Ready to hatch!' : `${Math.round(e.hatch)}% warm`}</div>
          <div class="egg-progress"><i style="width:${e.hatch}%"></i></div>
        </button>`;
        }).join('')}</div>`;
      eggBox.querySelectorAll('[data-egg]').forEach((b) => {
        b.addEventListener('click', () => App.openHatch(b.dataset.egg));
      });
    } else {
      eggBox.innerHTML = '';
    }
    retiredSection.hidden = !retiredFiltered.length;
    if (retiredFiltered.length) {
      const retiredCount = retiredSection.querySelector('[data-retired-count]');
      if (retiredCount) retiredCount.textContent = `${retiredFiltered.length} resting`;
      retiredLazy.refresh(retiredFiltered, spriteCardHTML);
    } else {
      retiredLazy.clear();
    }
  }

  /* The constellation strip keeps its own subscription so its three nearest
     charts repaint after a hatch, merge, claim, or purchase. */
  const stopConstellationStrip = typeof mountConstellationStrip === 'function'
    ? mountConstellationStrip(root.querySelector('[data-constellation-strip]'))
    : () => {};

  const unsub = subscribeState(() => paint());
  paint();
  return () => {
    unsub();
    stopWishlistPanel();
    stopPuffleArchive();
    stopConstellationStrip();
    activeLazy.clear();
    retiredLazy.clear();
  };
}

/* Everything the collection search reads, in one place: a coated creature has to
   be findable by the coat in its name as well as by its element. */
function spriteSearchText(s) {
  const el = ELEMENTS[s.element] || ELEMENTS.bloom;
  return [
    displayName(s), s.name, s.element, el.name, el.trait, el.blurb, typeName(s), formName(s),
    GENE_POWERS[s.element]?.name,
    isExoticSpecies(s.element) ? 'exotic signature' : '',
    isSecretSpecies(s.element) ? 'secret vault' : '',
  ].join(' ').toLowerCase();
}

function spriteCardHTML(s) {
  const el = ELEMENTS[s.element] || ELEMENTS.bloom;
  const active = state.activeId === s.id;
  const combo = specialCombo(s);
  const form = formOf(s);
  const finish = finishOf(s);
  // Very dark palettes (the Master Cheat's galaxy shell, a few deep-red or
  // midnight species) vanish on the dark card, so flag them for a lift.
  const dark = typeof paletteIsDark === 'function' && paletteIsDark(s);
  const rarity = spriteRarity(s);
  const ascended = s.stage !== 'egg' && (s.stage === 'sensei' || s.level >= MAX_LEVEL);
  const frameElement = typeof elementFrameKey === 'function' ? (elementFrameKey(s.element) || '') : '';
  const elementIdle = typeof elementIdleAnimation === 'function' ? elementIdleAnimation(s.element) : null;
  const hybridFrame = !!(s.hybrid || s.hybridParents);
  const splitFrame = typeof hybridSplitFrame === 'function' ? hybridSplitFrame(s) : null;
  const rarityKey = spriteRarityKey(s);
  const orbit = ['secret', 'celestial', 'creator'].includes(rarityKey)
    ? `<span class="sc-orbit" aria-hidden="true">${['🔥', '💧', '🌿', '⚡', '❄️', '🌪️'].map((icon, i) => `<i style="--orbit:${i * 60}deg">${icon}</i>`).join('')}</span>`
    : '';
  return `<button class="sprite-card ${active ? 'is-active' : ''} ${s.retired ? 'is-retired' : ''} ${dark ? 'is-dark' : ''} ${ascended ? 'is-ascended' : ''}" data-sprite="${s.id}" data-rarity="${spriteRarityKey(s)}" data-idle="${spriteRarityKey(s)}" data-frame-element="${frameElement}"${hybridFrame ? ' data-frame-hybrid="1"' : ''}${splitFrame ? ` data-frame-split="${splitFrame.wave}"` : ''} style="--card-accent:${el.primary};--rarity:${rarity.color};--rarity-gradient:${rarity.gradient || rarity.color};--rarity-glow:${rarity.frameGlow || rarity.color}${splitFrame ? `;--split-a:${splitFrame.a};--split-b:${splitFrame.b}` : ''}">
    <div class="sc-top">
      <span class="lv">Lv ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}</span>
      <div class="sc-badges">
        <span class="chip chip-tier" style="--tier:${rarity.color};--tier-gradient:${rarity.gradient || rarity.color}">${rarity.name}</span>
        ${puffleVariantBadge(s)}
      ${isExoticSpecies(s.element) ? '<span class="chip" title="Exotic signature">✦ Exotic</span>' : ''}
      ${isSecretSpecies(s.element) ? '<span class="chip" title="Secret Vault">🔐 Secret</span>' : ''}
      ${s.shiny ? '<span class="chip chip-shine" title="A rare, permanent sparkle">✨ Shiny</span>' : ''}
      ${finish ? `<span class="chip" title="${esc(finish.desc)}">${finish.icon} ${esc(finish.name)}</span>` : ''}
      ${combo ? `<span class="chip chip-mut" title="${esc(combo.name)}">✦ ${esc(combo.name)}</span>` : s.mutation ? `<span class="chip chip-mut" title="${esc(s.mutation)} mutation">✦ ${esc(s.mutation)}</span>` : ''}
      ${form ? `<span class="chip chip-form">${form.icon} ${esc(formName(s))}</span>` : ''}
      ${s.retired ? '<span class="chip">🏡 Retired</span>' : ''}
      ${active ? '<span class="chip"><span class="active-dot"></span>Active</span>' : ''}
      </div>
    </div>
    <div class="sc-art"><span class="sc-bg-fx" aria-hidden="true"></span>${orbit}${spriteSVG(s, { expr: expressionFor(s) })}<span class="sc-element-fx" data-icon="${esc(elementIdle?.icon || '')}" aria-hidden="true"></span></div>
    <div class="sc-name">${esc(displayName(s))} <span class="gender-mark" style="color:${genderOf(s).color}" title="${esc(genderOf(s).name)}">${genderOf(s).symbol}</span> ${s.asleep ? '<span class="tiny muted">💤</span>' : ''}</div>
    <div class="sc-meta">${typeName(s)} · ${BREEDS[s.breed]?.name || 'Puff'}<br>${stageLabel(s)} · ${SIZES[s.size]?.name || 'Standard'} · ${bondTier(s)}</div>
    ${restLeft(s) > 0 ? '<span class="chip" style="position:absolute;bottom:8px;right:8px;font-size:8px">resting</span>' : ''}
  </button>`;
}

/* The one ladder strip. Every screen that lists sprites reuses it, so the order
   is stated in one place: master above ancient, ancient above exotic.

   target may be a sprite (its computed tier), a tier key (a species' base tier)
   or nothing at all — a browsing screen with no single subject shows the ladder
   as a legend with no rung lit. Built from RARITY_TIER_ORDER every time. */
/* The rung numbers are read from the rarity tables, never restated: the wild
   share is RARITY_SPAWN_WEIGHT (already a percent, not a normalized weight) and
   the coin line is RARITY_COIN_BONUS. A tier the tables have not filled in yet
   shows a dash rather than a made-up number. The weights are authored to two
   significant digits and every listed coin bonus is in the thousands, so neither
   label needs a rounding rule of its own. */
function ladderWildShare(tierKey) {
  return (typeof RARITY_SPAWN_WEIGHT !== 'undefined' && RARITY_SPAWN_WEIGHT[tierKey]) || 0;
}
function ladderCoinBonus(tierKey) {
  return (typeof RARITY_COIN_BONUS !== 'undefined' && RARITY_COIN_BONUS[tierKey]) || 0;
}
function ladderShareLabel(share) {
  return share ? `${share}%` : '—';
}
function ladderCoinLabel(coins) {
  return coins ? `${Number((coins / 1000).toFixed(2))}k` : '—';
}

function rarityLadderHTML(target) {
  const order = typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER : [];
  if (!order.length) return '';
  const key = typeof target === 'string' ? target : target ? spriteRarityKey(target) : '';
  const index = order.indexOf(key);
  return `<div class="rarity-ladder" role="list" aria-label="Rarity ladder: wild hatch odds and coin bonus per tier">
    <div class="rarity-ladder-head"><span>Rarity ladder</span><span>${index >= 0 ? `${index + 1} of ${order.length}` : `${order.length} tiers`}</span></div>
    <div class="rarity-ladder-legend" aria-hidden="true">Wild odds · coin bonus</div>
    <div class="rarity-ladder-track">
      ${order.map((tierKey) => {
        const tier = TYPE_EGG_RARITIES[tierKey] || TYPE_EGG_RARITIES.common;
        const on = index >= 0 && tierKey === key;
        const share = ladderWildShare(tierKey);
        const coins = ladderCoinBonus(tierKey);
        const shareLabel = ladderShareLabel(share);
        const coinLabel = ladderCoinLabel(coins);
        const label = `${tier.name}: ${share ? `${shareLabel} wild odds` : 'no wild odds listed'}, ${coins ? `${coinLabel} coin bonus` : 'no coin bonus listed'}`;
        return `<span class="rl-step${on ? ' on' : ''}" role="listitem"${on ? ' aria-current="true"' : ''} style="--tier:${tier.color}" data-ladder-tier="${tierKey}" data-ladder-odds="${share}" data-ladder-coins="${coins}" aria-label="${esc(label)}">
          <i aria-hidden="true"></i><span>${esc(tier.name)}</span><b class="rl-num">${shareLabel}</b><b class="rl-num rl-coin">${coinLabel} 🪙</b></span>`;
      }).join('')}
    </div>
  </div>`;
}

/* The colour a Club Penguin puffle wears brings the rest of its canon kit with
   it: the ability that colour is known for, the skill it practises, the
   temperament, the snack, and the habitat it was observed in. The colour follows
   the family's evolution line, so this card grows with the puffle. */
function cpPuffleDetailHTML(s) {
  const profile = typeof cpPuffleProfileForSprite === 'function' ? cpPuffleProfileForSprite(s) : null;
  if (!profile) return '';
  const t = profile.type;
  const scenes = (profile.habitat.biomes || [])
    .map((key) => (typeof SCENES !== 'undefined' && SCENES[key] ? SCENES[key] : null))
    .filter(Boolean);
  /* The care loop reads puffleComfortsFor, so the chip names that dish: a card
     built from the type table can point at a dish that pays nothing. */
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const food = comforts && comforts.food && typeof FOODS !== 'undefined'
    ? FOODS[comforts.food.id]
    : (t.likesFood && typeof FOODS !== 'undefined' ? FOODS[t.likesFood] : null);
  const chip = (icon, text) => `<span class="chip">${icon} ${esc(text)}</span>`;
  /* Dark coats (black, and anything void-dark) disappear against the card, so
     the tint falls back to the colour's light step when the primary is too
     dark to read as a border. */
  const tintOf = (type) => {
    const hex = String(type.primary || '').replace('#', '');
    if (hex.length !== 6) return type.primary || 'var(--line)';
    const lum = (0.2126 * parseInt(hex.slice(0, 2), 16) + 0.7152 * parseInt(hex.slice(2, 4), 16) + 0.0722 * parseInt(hex.slice(4, 6), 16)) / 255;
    return lum < 0.3 ? (type.light || type.primary) : type.primary;
  };
  const tint = tintOf(t);
  const skill = t.skill;
  /* The ability and the skill are gameplay, so their numbers share one "in
     play" row instead of dangling inside a wrapped flavour sentence. */
  const playChips = [t.ability, skill]
    .map((entry) => {
      const text = entry && typeof cpPuffleEffectText === 'function' ? cpPuffleEffectText(entry.effect) : '';
      return text ? `<span class="chip" data-cp-effect style="border-color:${esc(tint)}66">⚙️ ${esc(entry.name)}: ${esc(text)}</span>` : '';
    })
    .filter(Boolean)
    .join('');
  return `<div class="card" data-cp-puffle="${esc(profile.colour)}" style="padding:12px;margin-top:12px;border-color:${esc(tint)}66">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">CLUB PENGUIN · ${esc(t.label.toUpperCase())}</div><span class="chip" style="border-color:${esc(tint)}">${t.icon} ${esc(t.label.replace(/ Puffle$/, ''))}</span></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
      ${chip(profile.bodyIcon, `${profile.bodyName} body`)}
      ${(t.personality || []).map((word) => `<span class="chip" data-cp-personality="${esc(word)}">💭 ${esc(word)}</span>`).join('')}
    </div>
    <div class="tiny" data-cp-ability style="margin-top:9px;line-height:1.55">${t.ability.icon} <b>${esc(t.ability.name)}</b> — ${esc(t.ability.desc)}</div>
    ${skill ? `<div class="tiny muted" data-cp-skill style="margin-top:4px;line-height:1.55">${skill.icon} Skill: <b style="color:var(--text)">${esc(skill.name)}</b> — ${esc(skill.desc)}</div>` : ''}
    ${playChips ? `<div class="row" data-cp-effects style="gap:5px;flex-wrap:wrap;margin-top:8px">${playChips}</div>` : ''}
    <div class="tiny muted" data-cp-habitat style="margin-top:6px;line-height:1.55">🗺️ <b style="color:var(--text)">${esc(profile.habitat.label)}</b>${scenes.length ? ` · ${scenes.map((sc) => `${sc.emoji} ${esc(sc.name)}`).join(' · ')}` : ''}</div>
    ${t.wild ? `<div class="tiny muted" style="margin-top:2px;line-height:1.5">Observed in the wild: ${esc(t.wild)}</div>` : ''}
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
      ${t.toy ? chip('🪀', t.toy) : ''}
      ${t.snack ? chip('🍽', t.snack) : ''}
      ${food ? chip(food.emoji || '🍴', `Hollow favourite: ${food.name}`) : ''}
    </div>
  </div>`;
}

/* A creature's canon coats ship with its species, but the only way to wear one
   used to be the evolution roll: the family sheet lists Sprite Puffle styles,
   which a creature cannot wear. This card offers the species' own coats and
   repaints the portrait as soon as one is picked. */
function creatureCoatCardHTML(s) {
  const form = s && s.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[s.form] : null;
  const creature = form && form.creature;
  const species = creature && typeof CP_PUFFLE_CREATURES !== 'undefined' ? CP_PUFFLE_CREATURES[creature] : null;
  if (!species) return '';
  /* Only a real creature coat counts as current. A creature in a classic puffle
     colour wears none of these, and marking the species coat as worn pointed
     players at a look the portrait was not showing. */
  const current = typeof cpCreatureStyleKey === 'function' ? cpCreatureStyleKey(s.form, s.puffleVariant) : null;
  /* A classic puffle colour repaints the whole body but belongs to no species, so
     it is never a canon coat and never marks one. It gets its own entry below,
     and so does any other look the sprite can wear (a shiny finish), so the card
     always has exactly one entry for the portrait. */
  const variantTable = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const wornVariant = String((s && s.puffleVariant) || '');
  const wornOther = !current && variantTable && variantTable[wornVariant] ? wornVariant : null;
  const wornLook = wornOther ? variantTable[wornOther] : null;
  /* The style palette already names and colours every coat, so the card only
     has to pick the chips. */
  const rows = [`pc_${creature}`, ...cpCreatureCoats(creature).map((coat) => `pc_${creature}_${coat.key}`)].map((key) => {
    const look = typeof cpCreatureStylePalette === 'function' ? cpCreatureStylePalette(key) : null;
    const name = (look && look.name) || key;
    return { key, name, hex: (look && look.primary) || species.primary };
  });
  /* Counted from what this puffle has worn, plus whatever it wears now, so an
     old save never opens on "0 of 3 worn" while showing a coat. */
  const wornKeys = Array.isArray(state.stats && state.stats.coats) ? state.stats.coats : [];
  const wornCount = rows.filter((row) => wornKeys.includes(row.key) || row.key === current).length;
  return `<div class="card" data-creature-coats="${esc(creature)}" style="padding:12px;margin-top:10px">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">CANON COATS</div>
      <div class="row" style="gap:6px;flex-wrap:wrap;justify-content:flex-end">
        <span class="chip" data-creature-coat-count aria-live="polite">${wornCount} of ${rows.length} worn</span>
        <button type="button" class="chip" data-creature-coat-shuffle title="Pick a random canon coat">🎲 Surprise me</button>
      </div>
    </div>
    <p class="tiny muted" style="margin:7px 0 9px;line-height:1.55">Every ${esc(species.label.toLowerCase())} coat is part of the species. Pick one and the portrait repaints: form, size and stats stay the same.</p>
    ${wornOther ? `<p class="tiny muted" data-creature-coat-note style="margin:0 0 9px;line-height:1.55">This one is wearing ${wornLook.classic ? `the classic ${esc(wornLook.colorLabel || wornLook.name.replace(' Puffle', ''))} puffle colour` : 'a look outside its canon coats'}, so no canon coat is on. Pick a coat to bring its ${esc(species.label.toLowerCase())} back.</p>` : ''}
    <div class="family-chip-row" role="group" aria-label="Canon coats for ${esc(species.label)}">${wornOther ? `<span class="chip" data-creature-coat-worn="${esc(wornOther)}" aria-current="true" title="${esc(wornLook.name)} — what it wears now, which is not one of its canon coats" style="display:inline-flex;align-items:center;gap:5px;border-color:var(--accent);font-weight:800"><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${esc(wornLook.primary)};border:1px solid rgba(0,0,0,.3);flex:0 0 auto"></i>${esc(wornLook.colorLabel || wornLook.name.replace(' Puffle', ''))}${wornLook.classic ? ' <span class="tiny muted">· classic</span>' : ''}</span>` : ''}${rows.map((row) => `<button type="button" class="chip" data-creature-coat="${esc(row.key)}" data-creature-coat-name="${esc(row.name)}" aria-pressed="${row.key === current}" style="display:inline-flex;align-items:center;gap:5px;cursor:pointer${row.key === current ? ';border-color:var(--accent);font-weight:800' : ''}"><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${esc(row.hex)};border:1px solid rgba(0,0,0,.3);flex:0 0 auto"></i>${esc(row.name)}</button>`).join('')}</div>
  </div>`;
}

/* A creature has no Club Penguin profile card, so nothing on its sheet ever
   named the dish, toy or game the care loop actually rewards. Every value here
   comes from the same puffleComfortsFor table the feed, fetch and play actions
   read, so the copy cannot drift from the bonus. */
function cpCreatureFavouritesHTML(s) {
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const form = s && s.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[s.form] : null;
  if (!comforts || !form || !form.creature) return '';
  const chip = (icon, key, text) => `<span class="chip" data-creature-favourite="${esc(key)}">${icon} ${esc(text)}</span>`;
  return `<div class="card" data-creature-favourites="${esc(form.creature)}" style="padding:12px;margin-top:10px">
    <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">FAVOURITE THINGS</div>
    <div class="family-chip-row" style="margin-top:8px">
      ${chip(comforts.food.icon || '🍴', 'food', `Favourite dish: ${comforts.food.name}`)}
      ${chip(comforts.drink.icon || '🥤', 'drink', `Favourite drink: ${comforts.drink.name}`)}
      ${chip(comforts.treat.icon || '🍬', 'treat', `Favourite treat: ${comforts.treat.name}`)}
      ${chip(comforts.toy.icon || '🎾', 'toy', `Fetch toy: ${comforts.toy.name}`)}
      ${chip(comforts.game.icon || '🎮', 'game', `Favourite game: ${comforts.game.name}`)}
      ${chip('🏡', 'biome', `Prefers: ${comforts.biome}`)}
    </div>
    <p class="tiny muted" style="margin:8px 0 0">Feeding this dish restores extra joy and bond.</p>
  </div>`;
}

/* The fifteen species are a set to finish, not fifteen separate surprises, so the
   roster names every one: grown or not, and how many of its coats the Hollow has
   worn. */
function cpCreatureDexHTML() {
  if (typeof CP_PUFFLE_CREATURES === 'undefined' || typeof cpCreatureCoats !== 'function') return '';
  const worn = Array.isArray(state.stats && state.stats.coats) ? state.stats.coats : [];
  const types = Object.keys(CP_PUFFLE_CREATURES);
  const chips = types.map((type) => {
    const species = CP_PUFFLE_CREATURES[type];
    const coats = [`pc_${type}`, ...cpCreatureCoats(type).map((coat) => `pc_${type}_${coat.key}`)];
    const wornCount = coats.filter((key) => worn.includes(key)).length;
    const owned = state.sprites.some((sprite) => sprite.form === `pc_${type}`);
    const label = `${species.label}: ${owned ? 'in the Hollow' : 'not grown yet'}, ${wornCount} of ${coats.length} coats worn`;
    return `<span class="chip" data-creature-dex="${type}" data-dex-owned="${owned ? 1 : 0}" data-dex-coats="${wornCount}/${coats.length}" title="${esc(label)}">${owned ? species.icon : '◻️'} ${esc(species.label.replace(/ Puffle$/, ''))} · ${wornCount}/${coats.length}</span>`;
  }).join('');
  return `<div class="card" data-creature-dex-card style="padding:12px;margin-top:10px">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">PUFFLE CREATURES</div><span class="chip">${types.length} species</span></div>
    <p class="tiny muted" style="margin:7px 0 9px;line-height:1.55">Every species has its own coats. The count is how many of that species' coats this Hollow has worn.</p>
    <div class="family-chip-row">${chips}</div>
  </div>`;
}

function openSpriteDetail(id) {
  const s = findSprite(id);
  if (!s) return;
  Sfx.spriteBabble(s);
  const el = ELEMENTS[s.element] || ELEMENTS.bloom;
  const tier = spriteRarity(s);
  const hybridInfo = s.hybrid && typeof window.hybridRarityFor === 'function' ? window.hybridRarityFor(s.hybrid) : null;
  const breed = BREEDS[s.breed];
  const weight = typeof PuffleWeight !== 'undefined' ? PuffleWeight.forSprite(s) : null;
  const persona = PERSONALITIES[s.personality];
  const isActive = state.activeId === s.id && !s.retired;
  const xp = s.stage === 'egg' ? 0 : s.level >= MAX_LEVEL ? 100 : Math.min(100, (s.xp / xpNeeded(s.level)) * 100);
  const powers = spritePowers(s);
  const combo = specialCombo(s);
  const form = formOf(s);
  const finish = finishOf(s);
  const diet = dietInfo(s);
  const readyDiet = diet.filter((d) => d.points >= d.need);
  const cuisine = cuisineInfo(s);
  const readyCuisine = cuisine.filter((d) => d.points >= d.need);
  const evo = stageEvolutionInfo(s);
  const ascendedFrame = !evo.egg && (evo.final || s.level >= MAX_LEVEL);
  const bondRank = bondRankFor(s.bond || 0);
  const formsForDiet = (key) => Object.values(EVOLUTION_FORMS).filter((f) => f.diet === key);
  const formsForCuisine = (key) => cuisineEvolutionForms(key);
  const evolutionLabel = (f) => f.id === 'titan' ? (TITAN_NAMES[s.element] || 'Titan') : `${el.name} ${f.label}`;
  const body = `
    <div class="detail-hero${ascendedFrame ? ' is-ascended' : ''}" data-rarity="${spriteRarityKey(s)}" data-frame-element="${typeof elementFrameKey === 'function' ? (elementFrameKey(s.element) || '') : ''}" style="--rarity:${tier.color};--rarity-gradient:${tier.gradient || tier.color};--rarity-glow:${tier.frameGlow || tier.color}"><div class="glow" style="background:radial-gradient(circle, ${el.primary}66, transparent 65%)"></div>
      ${s.stage === 'egg' ? eggSVG(s, { progress: s.hatch }) : spriteSVG(s, { expr: expressionFor(s) })}
    </div>
    <div style="text-align:center">
      <h2 style="font-size:22px">${esc(displayName(s))}</h2>
      <p class="sub" style="margin-top:2px">${typeName(s)} · ${breed?.name || 'Puff'} · ${stageLabel(s)}</p>
      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px;margin-top:8px">
        <span class="chip">Lv ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}</span>
        <span class="chip gender-chip" style="color:${genderOf(s).color}" title="${esc(genderOf(s).blurb)}">${genderOf(s).symbol} ${esc(genderOf(s).name)}</span>
        <span class="chip"${hybridInfo ? ` style="border-color:${hybridInfo.tier.color}" title="${esc(hybridInfo.species.look)}"` : ''}>${hybridInfo ? `${hybridInfo.tier.icon} ${esc(hybridInfo.tier.name)}` : s.hybrid ? 'Hybrid' : ELEMENTS[s.element].name}</span>
        <span class="chip">${SIZES[s.size]?.name || 'Standard'}</span>
        ${weight ? `<span class="chip" data-sprite-weight="${weight.lb.toFixed(1)}" title="Breed base ${weight.baseLb.toFixed(1)} lb · ${esc(weight.stageName)} · ${esc(weight.sizeName)}">⚖️ ${weight.lb.toFixed(1)} lb</span>` : ''}
        <span class="chip">Gen ${(s.gen || 0) + 1}</span>
        <span class="chip chip-tier" style="--tier:${tier.color};--tier-gradient:${tier.gradient || tier.color}">${tier.name}</span>
        ${s.rarityBoost ? `<span class="chip" title="A permanent rarity boost — from trails or a tier egg">✦ Rarity +${s.rarityBoost}</span>` : ''}
        ${s.sugar ? `<span class="chip">🍬 Sugar ${s.sugar}/3</span>` : ''}
        ${s.shiny ? '<span class="chip chip-shine" title="A rare, permanent sparkle">✨ Shiny</span>' : ''}
        ${finish ? `<span class="chip" title="${esc(finish.desc)}">${finish.icon} ${esc(finish.name)} finish</span>` : ''}
        ${form ? `<span class="chip chip-form">${form.icon} ${esc(formName(s))}</span>` : ''}
        ${s.retired ? '<span class="chip">🏡 Retired</span>' : ''}
        ${combo ? `<span class="chip chip-mut">✦ ${esc(combo.name)}</span>` : s.mutation ? `<span class="chip chip-mut">✦ ${esc(s.mutation)}</span>` : ''}
      </div>
      ${rarityLadderHTML(s)}
      <details class="rarity-frame-prompt" style="--rarity:${tier.color}">
        <summary>🎨 ${tier.name} frame · ${esc(tier.frameTheme || 'Rarity frame')}</summary>
        <p>${esc(tier.framePrompt || '')}</p>
      </details>
      <details class="rarity-frame-prompt" style="--rarity:${tier.color}">
        <summary>✨ ${tier.name} animation · ${esc(tier.frameAnimationSpeed || 'Looping')}</summary>
        <p>${esc(tier.frameAnimationPrompt || '')}</p>
        ${tier.frameAnimationSpecial ? `<p><b>Special:</b> ${esc(tier.frameAnimationSpecial)}</p>` : ''}
        ${tier.idlePrompt ? `<p><b>Idle card:</b> ${esc(tier.idlePrompt)}</p>` : ''}
        ${tier.idleBackgroundPrompt ? `<p><b>Background layer:</b> ${esc(tier.idleBackgroundPrompt)}</p>` : ''}
      </details>
    </div>
    ${(() => {
      const traits = breed && typeof BREED_TRAITS !== 'undefined' ? BREED_TRAITS[s.breed] : null;
      if (!traits) return '';
      const fav = typeof FOODS !== 'undefined' && FOODS[traits.favorite] ? FOODS[traits.favorite] : null;
      return `<div class="card" style="padding:12px;margin-top:12px">
        <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">${esc(breed.name).toUpperCase()} TEMPERAMENT</div>
        <p style="margin:7px 0 0;font-size:12px;line-height:1.55">${esc(traits.behavior)}</p>
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:9px">
          ${fav ? `<span class="chip">${fav.icon || '🍽'} Favorite: ${esc(fav.name)}</span>` : ''}
          <span class="chip">💚 Likes ${esc(traits.likes)}</span>
          <span class="chip">🚫 Dislikes ${esc(traits.dislikes)}</span>
        </div>
        <p class="tiny muted" style="margin:8px 0 0">Feeding its favourite food restores extra Joy and bond.</p>
      </div>`;
    })()}
    ${(() => {
      const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
      if (!comforts) return '';
      /* The temperament card names the dish its breed feeds and what that feed
         does, so this card keeps the rest of the comforts and only repeats the
         food when no temperament card is there to name it. */
      const temperament = breed && typeof BREED_TRAITS !== 'undefined' ? BREED_TRAITS[s.breed] : null;
      const temperamentDish = temperament && temperament.favorite && typeof FOODS !== 'undefined' && FOODS[temperament.favorite] ? temperament.favorite : null;
      const ownDish = !temperamentDish;
      /* A used favourite rests for a minute; the card says so instead of
         letting the player find out from a refusal. */
      const toyWait = Math.max(0, 60000 - (Date.now() - (Number(s.lastFavToy) || 0)));
      const gameWait = Math.max(0, 60000 - (Date.now() - (Number(s.lastFavGame) || 0)));
      const restLabel = (wait) => (wait > 0 ? ` · ready in ${Math.ceil(wait / 1000)}s` : '');
      const gameInfo = typeof GAME_INFO !== 'undefined' ? GAME_INFO[comforts.game.game] : null;
      const gameTitle = (gameInfo && gameInfo.title) || 'a garden game';
      return `<div class="card" style="padding:12px;margin-top:12px">
        <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">FAVOURITE THINGS</div>
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:9px">
          ${ownDish ? `<span class="chip">${comforts.food.icon} Eats ${esc(comforts.food.name)}</span>` : ''}
          <span class="chip">${comforts.drink.icon} Drinks ${esc(comforts.drink.name)}</span>
          <span class="chip">${comforts.treat.icon} Treat ${esc(comforts.treat.name)}</span>
          <span class="chip">${comforts.toy.icon} Toy ${esc(comforts.toy.name)}</span>
          <span class="chip">${comforts.game.icon} Game ${esc(comforts.game.name)}</span>
        </div>
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:9px">
          <button class="btn btn-ghost" type="button" data-comfort-play="toy"${toyWait > 0 ? ' disabled' : ''}>${comforts.toy.icon} Play with the ${esc(comforts.toy.name.toLowerCase())}${restLabel(toyWait)}</button>
          <button class="btn btn-ghost" type="button" data-comfort-play="game"${gameWait > 0 ? ' disabled' : ''}>${comforts.game.icon} Play ${esc(comforts.game.name)}${restLabel(gameWait)}</button>
        </div>
        <p class="tiny muted" style="margin:8px 0 0">Its own toy and game are worth a little more Joy and bond.</p>
        <p class="tiny muted" style="margin:5px 0 0" data-comfort-like>🎮 ${esc(comforts.game.name)} plays like ${esc(gameTitle)}.</p>
        <p style="margin:9px 0 0;font-size:12px;line-height:1.55">🏡 <b>${esc(comforts.biome)}</b>${comforts.scenes.length ? ` · thrives in ${comforts.scenes.map((scene) => esc(scene)).join(', ')}` : ''}</p>
        <p class="tiny muted" style="margin:6px 0 0">✨ Favourite nook: ${esc(comforts.nook)}</p>
        ${ownDish ? `<p class="tiny muted" style="margin:6px 0 0">Feeding its favourite food restores extra Joy and bond.</p>` : ''}
      </div>`;
    })()}
    ${cpPuffleDetailHTML(s)}
    ${s.retired ? `<div class="card" style="padding:10px;margin-top:10px;font-size:11px;line-height:1.55;color:var(--muted)">🏡 <b style="color:var(--text)">Retired.</b> Needs are paused and XP is off. Petting, feeding, and visits still work.</div>` : ''}
    ${s.stage === 'egg' ? `
      <div class="card" style="padding:12px;margin-top:14px">
        <div class="between"><span class="small"><b>${s.hatch >= 100 ? 'Ready to hatch' : 'Warm this egg'}</b></span><span class="tiny muted">${Math.round(s.hatch)}%</span></div>
        <div class="egg-progress" style="margin-top:8px"><i style="width:${s.hatch}%"></i></div>
        <button class="btn btn-primary btn-block" data-warm style="margin-top:12px">${s.hatch >= 100 ? 'Hatch now' : 'Warm it'}</button>
        <div style="margin-top:8px">${typeof Wishlist !== 'undefined' ? Wishlist.pinButtonHTML(s.element, { block: true, short: true }) : ''}</div>
      </div>`
      : `
      <div class="detail-stats">
        <div class="dstat"><span class="lbl">Bond</span><div class="bar bond"><i style="width:${s.bond}%"></i></div><b>${Math.round(s.bond)}</b></div>
        ${needBlock('hunger', s.needs.hunger)}
        ${needBlock('energy', s.needs.energy)}
        ${needBlock('joy', s.needs.joy)}
        ${needBlock('clean', s.needs.clean)}
        <div class="dstat"><span class="lbl">XP</span><div class="bar" style="background:rgba(255,255,255,.1)"><i style="width:${xp}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div><b>${Math.round(xp)}%</b></div>
      </div>
      <div class="card evolution-next-card" style="padding:12px;margin-top:12px">
        <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">NEXT EVOLUTION</div><span class="chip">${evo.final ? `Lv ${MAX_LEVEL.toLocaleString()} cap` : `Lv ${evo.required}`}</span></div>
        <div class="evo-next-main">
          <span class="evo-next-icon">${evo.final ? '🏆' : evo.ready ? '🌟' : '🌱'}</span>
          <div><b>${evo.final ? `${STAGE_LABELS[STAGE_ORDER[STAGE_ORDER.length - 1]]} is the final stage` : `${STAGE_LABELS[s.stage]} → ${evo.nextLabel}`}</b><p>${evo.final ? `Every age tier is complete. Keep growing toward level ${MAX_LEVEL.toLocaleString()}.` : evo.ready ? `${esc(displayName(s))} is ready to become a ${evo.nextLabel}.` : `${evo.levelsLeft} level${evo.levelsLeft === 1 ? '' : 's'} and ${Math.max(0, Math.ceil(xpNeeded(s.level) - (s.xp || 0))).toLocaleString()} XP to ${evo.nextLabel}.`}</p></div>
        </div>
        <div class="bar" style="height:8px;margin-top:9px"><i style="width:${Math.round(evo.progress * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div>
        <div class="between tiny muted" style="margin-top:6px"><span>${bondRank.icon} ${esc(bondRank.name)} · ${Math.round(s.bond)} bond</span><span>${Math.round(evo.progress * 100)}%</span></div>
        <button class="btn btn-soft btn-block" data-evo-open style="margin-top:9px">View full evolution path</button>
      </div>
      <div class="card" style="padding:12px;margin-top:12px">
        <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">BREED PERK</div>
        <div class="small" style="margin-top:3px"><b>${breed?.perk || ''}</b></div>
        <div class="tiny muted" style="margin-top:6px">Personality: <b style="color:var(--text)">${persona?.name || 'Sunny'}</b> — ${persona?.desc || ''}</div>
        ${s.lineage ? `<div class="tiny muted" style="margin-top:6px">Merged from <b style="color:var(--text)">${esc(s.lineage[0])}</b> + <b style="color:var(--text)">${esc(s.lineage[1])}</b></div>` : ''}
      </div>
      <div class="card power-card" style="padding:12px;margin-top:10px">
        <div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin-bottom:7px">GENES, HABITS & POWERS</div>
        ${powers.map((p) => `<div class="power-row">
          <span class="power-ico">${p.icon || '✨'}</span>
          <span style="flex:1;min-width:0"><b>${esc(p.name || p.kind)}</b><span class="power-kind">${p.kind}</span><div class="tiny muted" style="margin-top:1px">${esc(p.desc || '')}</div></span>
        </div>`).join('')}
      </div>
      ${typeof spriteSeasonBonusHTML === 'function' ? spriteSeasonBonusHTML(s) : ''}
      <div class="card" style="padding:12px;margin-top:10px">
        <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">PARENTS &amp; BREEDING</div><span class="chip">${breedingPairsFor(s.element).length} pairs</span></div>
        ${s.hybridParents ? `<div class="tiny muted" style="margin-top:6px">${s.hybridParents.length > 2 ? 'Tribrid of' : 'Hybrid of'} <b style="color:var(--text)">${esc(s.hybridParents.map((el) => ELEMENTS[el]?.name || el).join('</b> × <b style="color:var(--text)">'))}</b></div>` : ''}
        ${hybridInfo ? `<div class="tiny muted" style="margin-top:4px">Hybrid rarity: <b style="color:${hybridInfo.tier.color}">${hybridInfo.tier.icon} ${esc(hybridInfo.tier.name)}</b> — ${esc(hybridInfo.species.look)}</div>` : ''}
        <div class="tiny muted" style="margin-top:6px">Gene power: <b style="color:var(--text)">${GENE_POWERS[s.element]?.icon || ''} ${esc(GENE_POWERS[s.element]?.name || 'None')}</b></div>
        <div class="tiny muted" style="margin-top:2px">Breed habit: <b style="color:var(--text)">${HABITS[s.breed]?.icon || ''} ${esc(HABITS[s.breed]?.name || 'None')}</b></div>
        <button class="btn btn-soft btn-block" data-breed-open style="margin-top:9px">See ${esc(el.name)} breeding pairs</button>
      </div>
      <div class="card evolution-card${ascendedFrame ? ' ascended-frame' : ''}" data-rarity="${spriteRarityKey(s)}" style="--rarity:${tier.color};--rarity-gradient:${tier.gradient || tier.color};--rarity-glow:${tier.frameGlow || tier.color};padding:12px;margin-top:10px">
        <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">EVOLUTION</div><span class="chip">${form ? `${form.icon} evolved` : `Level ${EVOLUTION_LEVEL}+`}</span></div>
        ${form ? `
          <div class="evo-current"><span class="evo-icon">${form.icon}</span><div><b>${esc(formName(s))}</b><div class="tiny muted">${esc(form.desc)}</div>${form.favorite && FOODS[form.favorite] ? `<div class="tiny muted" style="margin-top:2px">Favourite: ${FOODS[form.favorite].emoji} ${esc(FOODS[form.favorite].name)}</div>` : ''}<div class="tiny" style="color:var(--accent);margin-top:3px">${form.power.icon} ${esc(form.power.name)} — ${esc(form.power.desc)}</div></div></div>
        ` : `
          <p class="tiny muted" style="margin:7px 0 8px;line-height:1.55">Food builds four diet affinities and eight World Kitchen cuisines. At level 10, fill a path to 12 and choose an evolution.</p>
          <div class="diet-list">${diet.map((d) => `<div class="diet-row ${d.points >= d.need ? 'ready' : ''}">
            <span class="dr-ico">${d.icon}</span>
            <span style="flex:1;min-width:0"><div class="between" style="margin-bottom:4px"><span class="tiny">${d.label}</span><b class="tiny">${d.points}/${d.need}</b></div><div class="bar" style="height:6px"><i style="width:${Math.min(100, (d.points / d.need) * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div></span>
          </div>`).join('')}</div>
          ${s.level >= EVOLUTION_LEVEL && readyDiet.length ? readyDiet.map((d) => {
            return formsForDiet(d.key).map((f) => `<button class="btn btn-gold btn-block" data-evolve="${f.id}" style="margin-top:7px">${f.icon} Evolve into ${evolutionLabel(f)}</button>`).join('');
          }).join('') : s.level < EVOLUTION_LEVEL ? `<div class="tiny muted" style="margin-top:8px">Reach level ${EVOLUTION_LEVEL} to take a path. Keep feeding to prepare.</div>` : `<div class="tiny muted" style="margin-top:8px">Fill any affinity bar to 12 to unlock its evolution.</div>`}
        `}
      </div>
      <div class="card" style="padding:12px;margin-top:10px">
        <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">WORLD KITCHEN EVOLUTIONS</div><span class="chip">${form?.cuisine ? '🌍 evolved' : `Level ${EVOLUTION_LEVEL}+`}</span></div>
        <p class="tiny muted" style="margin:7px 0 8px;line-height:1.55">Every World Kitchen dish builds its region's cuisine. At level ${EVOLUTION_LEVEL}, fill a region to ${EVOLUTION_AFFINITY} to take its regional form. A favourite dish adds an extra affinity point, and the form keeps your sprite's custom colours, stripes, and accessories.</p>
        <details class="cuisine-paths">
          <summary><b>🌍 Regional cuisine paths</b><span class="tiny muted">${readyCuisine.length} ready · ${cuisine.length} regions</span></summary>
          <div class="diet-list" style="margin-top:8px">${cuisine.map((d) => `<div class="diet-row ${d.points >= d.need ? 'ready' : ''}">
            <span class="dr-ico">${d.icon}</span>
            <span style="flex:1;min-width:0"><div class="between" style="margin-bottom:4px"><span class="tiny">${d.label}</span><b class="tiny">${d.points}/${d.need}</b></div><div class="bar" style="height:6px"><i style="width:${Math.min(100, (d.points / d.need) * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div></span>
          </div>`).join('')}</div>
        </details>
        ${!form && s.level >= EVOLUTION_LEVEL && readyCuisine.length ? readyCuisine.map((d) => {
          return formsForCuisine(d.key).map((f) => `<button class="btn btn-gold btn-block" data-evolve="${f.id}" style="margin-top:7px">${f.icon} Evolve into ${evolutionLabel(f)}</button>`).join('');
        }).join('') : !form ? `<div class="tiny muted" style="margin-top:8px">${s.level < EVOLUTION_LEVEL ? `Reach level ${EVOLUTION_LEVEL} to take a regional form. Keep tasting dishes to prepare.` : 'Keep eating World Kitchen dishes to fill a region.'}</div>` : ''}
      </div>
      ${s.stage !== 'egg' ? `<div class="card" style="padding:12px;margin-top:10px;font-size:11.5px;line-height:1.6;color:var(--muted)">🍬 <b style="color:var(--text)">Candy sugar ${s.sugar || 0}/3.</b> Feeding candy treats builds sugar. At 3, this sprite transforms into a random candy species.</div>` : ''}
      ${abilityPathCardHTML(s)}
      ${puffleEvolutionCardHTML(s)}
      ${creatureCoatCardHTML(s)}
      ${typeof cpCreatureFavouritesHTML === 'function' ? cpCreatureFavouritesHTML(s) : ''}
      ${typeof spritePuffleFamilyPanelHTML === 'function' ? spritePuffleFamilyPanelHTML(s) : ''}
      <div class="detail-actions">
        <button class="btn ${isActive ? 'btn-ghost' : 'btn-primary'}" data-set-active ${isActive || s.retired ? 'disabled' : ''}>${s.retired ? 'Retired' : isActive ? 'Currently active' : 'Set active'}</button>
        ${s.level >= STAGE_LEVEL.elder && STAGE_ORDER.indexOf(s.stage) >= STAGE_ORDER.indexOf('elder') && s.element !== MASTER_CHEAT_SPECIES ? `<button class="btn btn-soft" data-retire>${s.retired ? 'Bring back' : 'Retire'}</button>` : ''}
        ${s.stage !== 'egg' && s.level >= MAX_LEVEL ? `<button class="btn btn-gold" data-rebirth>🌱 Rebirth (${foodCount('rebirthmeal')})</button>` : ''}
        ${typeof Wishlist !== 'undefined' ? Wishlist.pinButtonHTML(s.element, { short: true }) : ''}
        <button class="btn btn-soft" data-talk>${icon('chat')} Talk</button>
        <button class="btn" data-style>${icon('palette')} Style</button>
        <button class="btn" data-rename>${icon('dice')} Rename</button>
      </div>
      <button class="btn btn-ghost btn-block" data-pet style="margin-top:8px">${icon('heart')} Pet ${esc(displayName(s))}</button>
    `}
  `;

  const { overlay } = openSheet({
    title: s.stage === 'egg' ? 'Egg' : 'Sprite details',
    sub: s.stage === 'egg' ? 'Warm it with taps or leave it cozy in the nest.' : 'Everything you’ve grown together.',
    body,
    onMount: (root, close) => {
      root.querySelector('[data-warm]')?.addEventListener('click', () => { close(); App.openHatch(s.id); });
      root.querySelector('[data-wishlist-toggle]')?.addEventListener('click', () => {
        if (typeof Wishlist !== 'undefined') Wishlist.toggleWithUI(s.element);
      });
      root.querySelector('[data-set-active]')?.addEventListener('click', () => {
        Actions.setActive(s.id);
        Sfx.pop();
        toast(`${displayName(s)} is now exploring the Hollow.`, '🏡');
        close();
        App.refresh();
      });
      root.querySelector('[data-talk]')?.addEventListener('click', () => { close(); App.openChat(s.id); });
      root.querySelector('[data-style]')?.addEventListener('click', () => { close(); App.openStudio({ spriteId: s.id }); });

      /* A canon coat saves at once and repaints the portrait, because the sheet
         stays open so coats can be compared in place. */
      root.querySelectorAll('[data-creature-coat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          Actions.customize(s.id, { puffleVariant: btn.dataset.creatureCoat });
          root.querySelectorAll('[data-creature-coat]').forEach((other) => {
            const on = other === btn;
            other.setAttribute('aria-pressed', on ? 'true' : 'false');
            other.style.borderColor = on ? 'var(--accent)' : '';
            other.style.fontWeight = on ? '800' : '';
          });
          /* The worn classic colour and its note described the look that was
             on, so they go out with the pick instead of leaving two entries
             marked as current. */
          root.querySelector('[data-creature-coat-worn]')?.remove();
          root.querySelector('[data-creature-coat-note]')?.remove();
          const countEl = root.querySelector('[data-creature-coat-count]');
          if (countEl) {
            const keys = Array.from(root.querySelectorAll('[data-creature-coat]')).map((chip) => chip.dataset.creatureCoat);
            const worn = new Set(Array.isArray(state.stats && state.stats.coats) ? state.stats.coats : []);
            worn.add(btn.dataset.creatureCoat);
            countEl.textContent = `${keys.filter((key) => worn.has(key)).length} of ${keys.length} worn`;
          }
          const hero = root.querySelector('.detail-hero');
          if (hero && typeof spriteSVG === 'function') {
            const next = spriteSVG(s, { expr: typeof expressionFor === 'function' ? expressionFor(s) : 'idle' });
            const svg = hero.querySelector('svg');
            if (svg) svg.outerHTML = next;
            else hero.insertAdjacentHTML('beforeend', next);
          }
          /* The name is the colourway itself ("Black Dog Puffle", "Golden
             Retriever Puffle"), so the toast names it rather than appending a
             second noun: "...the Black Dog Puffle coat" reads as a coat made of
             puffle. */
          const colourway = btn.dataset.creatureCoatName;
          toast(`${displayName(s)} now wears ${colourway ? `the ${colourway} colourway` : 'its species colourway'}.`, '🎨');
          Sfx.pop();
        });
      });
      /* The roster is a collection, not a menu: one press rolls a coat for a
         player who would rather be surprised than compare chips. */
      root.querySelector('[data-creature-coat-shuffle]')?.addEventListener('click', () => {
        const speciesKey = root.querySelector('[data-creature-coats]')?.dataset.creatureCoats;
        if (!speciesKey || typeof cpCreatureColourwayRoll !== 'function') return;
        const rolled = cpCreatureColourwayRoll(speciesKey);
        const chip = rolled ? root.querySelector(`[data-creature-coat="${rolled}"]`) : null;
        if (chip) chip.click();
      });
      root.querySelector('[data-evo-open]')?.addEventListener('click', () => { close(); setTimeout(() => openEvolutionForecast(s.id), 160); });
      root.querySelector('[data-breed-open]')?.addEventListener('click', () => { close(); setTimeout(() => openBreedingCodex(s.element), 40); });
      root.querySelector('[data-retire]')?.addEventListener('click', () => {
        const wasRetired = s.retired;
        const res = wasRetired ? Actions.unretire(s.id) : Actions.retire(s.id);
        if (res && res.ok === false) { toast(res.reason === 'elder' ? 'Only elderly sprites can retire.' : 'That did not work.', '🏡'); Sfx.error(); return; }
        close();
        toast(wasRetired ? `${displayName(s)} is back in the Hollow.` : `${displayName(s)} retired to a cozy home.`, '🏡');
        Sfx.pop();
        App.refresh();
      });
      root.querySelector('[data-rebirth]')?.addEventListener('click', () => {
        const res = Actions.feedStock(s.id, 'rebirthmeal');
        if (!res.ok) {
          toast(res.reason === 'empty' ? 'A Rebirth Meal is waiting in the market for 600 coins.' : res.reason === 'level' ? 'Only a MAX sprite can reincarnate.' : 'The rebirth could not begin.', '🌱');
          Sfx.error();
          return;
        }
        close();
        App.refresh();
      });
      bindAbilityPathCard(root, s, close);
      root.querySelector('[data-rename]')?.addEventListener('click', () => {
        close();
        openRenameModal(s.id);
      });
      root.querySelectorAll('[data-evolve]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const res = Actions.evolve(s.id, btn.dataset.evolve);
          if (!res.ok) {
            toast(res.reason === 'level' ? `Reach level ${EVOLUTION_LEVEL} first.` : res.reason === 'diet' ? 'That diet path is not full yet.' : res.reason === 'cuisine' ? 'That World Kitchen region is not full yet.' : 'That evolution is not available.', '🧬');
            Sfx.error();
            return;
          }
          close();
          toast(`${displayName(s)} evolved into ${cpCreatureLookName(res.sprite) || formName(res.sprite)}!`, res.form.icon);
          Sfx.win();
          /* The reveal waits for the manifest's evolve animation to finish. */
          const evolveMs = typeof spriteAnimationDuration === 'function' ? spriteAnimationDuration('evolve', 380) : 380;
          setTimeout(() => openSpriteDetail(s.id), Math.max(380, Math.min(1400, evolveMs)));
        });
      });
      root.querySelectorAll('[data-comfort-play]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const r = typeof Actions.playFavourite === 'function' ? Actions.playFavourite(s.id, btn.dataset.comfortPlay) : { ok: false, reason: 'missing' };
          if (!r.ok) {
            toast(r.reason === 'cooldown'
              ? `${displayName(s)} just played that. Give it ${Math.max(1, Math.ceil((r.wait || 0) / 1000))}s.`
              : 'That puffle has no favourites yet.', '⏳');
            Sfx.error();
            return;
          }
          burstOn(e.currentTarget, r.kind === 'game' ? ['🎮', '✨'] : ['💛', '✨'], 5);
          toast(`${displayName(s)} loves ${r.item.name}! +${r.joy} Joy${r.coins ? ` · +${r.coins} coins` : ''}.`, r.item.icon);
          /* Both favourites share the rest rule, so both buttons go quiet. */
          root.querySelectorAll('[data-comfort-play]').forEach((other) => {
            other.disabled = true;
            if (other === btn) other.textContent = `${btn.textContent.replace(/ · ready in [0-9]+s$/, '')} · ready in 60s`;
          });
        });
      });
      root.querySelector('[data-pet]')?.addEventListener('click', (e) => {
        const r = Actions.pet(s.id);
        Sfx.spriteCry(s);
        if (r.coins) coinFly(e.currentTarget, 1);
        burstOn(e.currentTarget, ['💛', '💗'], 5);
        toast(reactionLine(s, 'pet'), '💗');
      });
      /* Family Puffles get their own interactive sheet: real petting and
         feeding, play catch, variant previews and the after-a-while notice. */
      const familyRow = typeof spritePuffleFamilyFor === 'function' ? spritePuffleFamilyFor(s) : null;
      if (familyRow) {
        root.querySelector('[data-family-pet]')?.addEventListener('click', (e) => {
          const r = Actions.pet(s.id);
          Sfx.spriteCry(s);
          if (r && r.coins) coinFly(e.currentTarget, 1);
          burstOn(e.currentTarget, ['💛', '💗'], 5);
          toast(reactionLine(s, 'pet'), '💗');
        });
        root.querySelector('[data-family-feed]')?.addEventListener('click', () => {
          if (typeof openHomeFeedPicker === 'function') openHomeFeedPicker(s.id, () => { App.refresh(); });
          else toast('Open the Nest to feed this Puffle.', '🍽');
        });
        root.querySelector('[data-family-play]')?.addEventListener('click', (e) => {
          if (typeof Actions.playCatch !== 'function') return;
          const r = Actions.playCatch(s.id, 'throw', 4);
          if (!r || r.ok === false) {
            toast('This Puffle is too tired to play right now.', '🎾');
            Sfx.error();
            return;
          }
          Sfx.pop();
          const fetchToy = r.toy || { name: 'ball', icon: '🎾' };
          burstOn(e.currentTarget, [fetchToy.icon, '✨'], 5);
          toast(`${displayName(s)} pounces on the ${fetchToy.name.toLowerCase()}!${r.favouriteToy ? ' Its favourite!' : ''}`, fetchToy.icon);
        });
        root.querySelector('[data-family-home]')?.addEventListener('click', () => {
          if (typeof openHomesSheet !== 'function') return;
          close();
          setTimeout(() => openHomesSheet(), 140);
        });
        root.querySelector('[data-family-photo]')?.addEventListener('click', () => {
          /* Photo Mode reads the sprite's saved look, so unsaved previews never
             leak into a portrait. Apply first to photograph new choices. */
          close();
          setTimeout(() => {
            if (typeof openPufflePhoto === 'function') openPufflePhoto(s);
          }, 140);
        });
        const familyPreview = root.querySelector('[data-family-variant-preview]');
        /* Which variant the sheet saves when no chip is on: a creature falls
           back to its species coat, never to a Sprite Puffle style. */
        const familyDefaultVariant = root.querySelector('[data-family-card]')?.dataset.familyDefault || familyRow.key;
        const paintFamilyPreview = (puffleVariant) => {
          if (!familyPreview || typeof spriteSVG !== 'function') return;
          const accessory = familyPreview.dataset.accessory || s.accessory || 'none';
          const finish = familyPreview.dataset.finish || '';
          familyPreview.innerHTML = spriteSVG({ ...s, puffleVariant, variant: finish || null, accessory }, { still: true })
            .replace('<svg ', '<svg width="108" height="108" ');
        };
        root.querySelectorAll('[data-family-variant]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.familyVariant;
            paintFamilyPreview(key);
            root.querySelectorAll('[data-family-variant]').forEach((other) => other.classList.toggle('on', other === btn));
          });
        });
        root.querySelectorAll('[data-family-finish]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.familyFinish;
            if (familyPreview) familyPreview.dataset.finish = key;
            const puffleVariant = (root.querySelector('[data-family-variant].on')?.dataset.familyVariant) || familyRow.key;
            paintFamilyPreview(puffleVariant);
            root.querySelectorAll('[data-family-finish]').forEach((other) => other.classList.toggle('on', other === btn));
            Sfx.pop();
          });
        });
        root.querySelectorAll('[data-family-cosmetic]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const accessory = btn.dataset.familyCosmetic;
            const variant = (root.querySelector('[data-family-variant].on')?.dataset.familyVariant) || familyRow.key;
            if (familyPreview) {
              familyPreview.dataset.accessory = accessory;
              paintFamilyPreview(variant);
            }
            root.querySelectorAll('[data-family-cosmetic]').forEach((other) => other.classList.toggle('on', other === btn));
            Sfx.pop();
          });
        });
        root.querySelector('[data-family-apply]')?.addEventListener('click', () => {
          const variant = root.querySelector('[data-family-variant].on')?.dataset.familyVariant || familyRow.key;
          const finish = familyPreview ? familyPreview.dataset.finish || '' : '';
          const accessory = familyPreview ? familyPreview.dataset.accessory || 'none' : 'none';
          const result = typeof Actions.applyPuffleLook === 'function'
            ? Actions.applyPuffleLook(s.id, { puffleVariant: variant, finish, accessory })
            : { ok: false, reason: 'unsupported' };
          const status = root.querySelector('[data-family-apply-status]');
          if (!result || result.ok === false) {
            if (result && result.reason === 'locked') toast(`${FINISHES[result.finish]?.name || 'That finish'} is not owned yet.`, '🔒');
            else if (result && result.reason === 'forced') toast(`${FINISHES[result.finish]?.name || 'This'} is this species' innate finish.`, '🔒');
            else toast('That look could not be saved.', '⚠️');
            if (status) status.textContent = 'Not saved';
            Sfx.pop();
            return;
          }
          if (status) status.textContent = 'Saved';
          toast('Look saved for this Sprite Puffle.', '✨');
          Sfx.pop();
        });
        const bubble = root.querySelector('[data-family-bubble]');
        const calm = document.documentElement.classList.contains('reduce-motion')
          || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        if (bubble && !calm) {
          root._familyNotice = setTimeout(() => {
            if (!root.isConnected) return;
            bubble.hidden = false;
            root.querySelector('[data-family-showcase]')?.classList.add('family-noticed');
            const art = root.querySelector('.detail-hero .sprite-motion');
            if (art) {
              art.classList.add('puffle-wave');
              setTimeout(() => art.classList.remove('puffle-wave'), 1400);
            }
          }, 6500);
        }
      }
    },
  });
  return overlay;
}

function openEvolutionForecast(id) {
  const s = findSprite(id);
  if (!s) return;
  const evo = stageEvolutionInfo(s);
  const rank = bondRankFor(s.bond || 0);
  const diet = dietInfo(s);
  const cuisine = cuisineInfo(s);
  const form = formOf(s);
  const forms = Object.values(EVOLUTION_FORMS);
  const stageRows = STAGE_ORDER.map((stage, index) => {
    const reached = STAGE_ORDER.indexOf(s.stage) >= index;
    const current = s.stage === stage;
    return `<div class="evo-stage ${reached ? 'reached' : ''} ${current ? 'on' : ''}">
      <span class="evo-stage-dot">${reached ? '✓' : index + 1}</span>
      <span><b>${STAGE_LABELS[stage]}</b><span class="tiny muted">Level ${STAGE_LEVEL[stage]}+</span></span>
      ${current ? '<span class="chip">CURRENT</span>' : ''}
    </div>`;
  }).join('');
  const dietRows = diet.map((d) => {
    const ready = s.level >= EVOLUTION_LEVEL && d.points >= d.need && !form;
    const options = forms.filter((item) => item.diet === d.key);
    const labels = options.map((item) => item.label).join(' / ');
    return `<div class="evo-diet ${ready ? 'ready' : ''}">
      <span class="evo-next-icon">${d.icon}</span>
      <span style="flex:1;min-width:0"><span class="between"><b>${esc(d.label)}</b><span class="chip">${d.points}/${d.need}</span></span><span class="tiny muted">${labels ? esc(labels) : 'Diet path'} · ${ready ? 'Ready to evolve' : `Reach level ${EVOLUTION_LEVEL} and ${d.need} points`}</span><div class="bar" style="height:6px;margin-top:5px"><i style="width:${Math.min(100, (d.points / d.need) * 100)}%"></i></div></span>
    </div>`;
  }).join('');
  const cuisineRows = cuisine.map((d) => {
    const ready = s.level >= EVOLUTION_LEVEL && d.points >= d.need && !form;
    const options = cuisineEvolutionForms(d.key);
    const labels = options.map((item) => item.label).join(' / ');
    return `<div class="evo-diet ${ready ? 'ready' : ''}">
      <span class="evo-next-icon">${d.icon}</span>
      <span style="flex:1;min-width:0"><span class="between"><b>${esc(d.label)} World Kitchen</b><span class="chip">${d.points}/${d.need}</span></span><span class="tiny muted">${labels ? esc(labels) : 'Regional cuisine'} · ${ready ? 'Ready to evolve' : `Reach level ${EVOLUTION_LEVEL} and ${d.need} points`}</span><div class="bar" style="height:6px;margin-top:5px"><i style="width:${Math.min(100, (d.points / d.need) * 100)}%"></i></div></span>
    </div>`;
  }).join('');
  openSheet({
    title: '🌟 Evolution path',
    sub: `${displayName(s)} · ${evo.final ? STAGE_LABELS[s.stage] : `${STAGE_LABELS[s.stage]} → ${evo.nextLabel}`}`,
    body: `<div class="card evolution-next-card">
        <div class="between"><span class="tiny muted" style="font-weight:800;letter-spacing:.08em">NEXT STAGE</span><span class="chip">Level ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}</span></div>
        <div class="evo-next-main"><span class="evo-next-icon">${evo.final ? '🏆' : evo.ready ? '🌟' : '🌱'}</span><div><b>${evo.final ? `${STAGE_LABELS[STAGE_ORDER[STAGE_ORDER.length - 1]]} is the final stage` : `${STAGE_LABELS[s.stage]} → ${evo.nextLabel}`}</b><p>${evo.final ? `Every age tier is complete. The long road runs to level ${MAX_LEVEL.toLocaleString()}.` : evo.ready ? `Ready now: ${esc(displayName(s))} can become a ${evo.nextLabel}.` : `Needs ${evo.levelsLeft} more level${evo.levelsLeft === 1 ? '' : 's'} (level ${evo.required}) to reach ${evo.nextLabel}.`}</p></div></div>
        <div class="bar" style="height:8px;margin-top:9px"><i style="width:${Math.round(evo.progress * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div>
      </div>
      <h3>Life stages</h3>
      <div class="evo-stage-list">${stageRows}</div>
      <h3>Bond rank</h3>
      <div class="card bond-now-card" style="padding:11px"><div class="between"><span class="tiny muted">${rank.icon} ${esc(rank.name)}</span><span class="chip">${Math.round(s.bond)} / 100</span></div><p class="tiny muted" style="margin:6px 0 0;line-height:1.5">${esc(rank.blurb)} · ${esc(bondEffectBits(rank.effect))}</p><button class="btn btn-soft btn-block" data-evo-bond style="margin-top:8px">Open Bond Codex</button></div>
      <h3>Diet evolutions</h3>
      <p class="tiny muted">At level ${EVOLUTION_LEVEL}, fill any diet path to ${EVOLUTION_AFFINITY} for a permanent form.</p>
      <div class="evo-diet-list">${dietRows}</div>
      <h3>World Kitchen evolutions</h3>
      <p class="tiny muted">World Kitchen dishes build the cuisine of their region. Fill one to ${EVOLUTION_AFFINITY} at level ${EVOLUTION_LEVEL} for that region's form. Favourites add an extra point.</p>
      <div class="evo-diet-list">${cuisineRows}</div>
      <button class="btn btn-soft btn-block" data-evo-world style="margin-top:9px">🧬 World evolution atlas for ${esc(s.element)}</button>
      ${form ? `<div class="card" style="padding:11px;margin-top:10px"><b>${form.icon} ${esc(formName(s))}</b><p class="tiny muted" style="margin:4px 0 0">${esc(form.desc)}</p></div>` : ''}
      <button class="btn btn-ghost btn-block" data-evo-back style="margin-top:10px">Back to sprite details</button>`,
    onMount: (sheet, close) => {
      sheet.querySelector('[data-evo-bond]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openBondCodex({ spriteId: s.id }), 160);
      });
      sheet.querySelector('[data-evo-world]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openWorldEvolutionAtlas({ speciesKey: s.element, form: s.form || 'all' }), 160);
      });
      sheet.querySelector('[data-evo-back]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openSpriteDetail(s.id), 160);
      });
    },
  });
}

function openRenameModal(id) {
  const s = findSprite(id);
  if (!s) return;
  const modal = openModal({
    title: 'Rename sprite',
    sub: 'Up to 16 characters. Names are forever (unless you rename again).',
    body: `<div style="margin-top:14px"><input id="rename-input" maxlength="16" value="${esc(s.name || '')}" placeholder="Name your sprite" style="width:100%;padding:13px 15px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--text);outline:none;font-size:15px;font-weight:800"></div>
      <div class="actions" style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary" data-save>Save name</button>
      </div>`,
    onMount: (root, close) => {
      const input = root.querySelector('#rename-input');
      setTimeout(() => input.focus(), 120);
      root.querySelector('[data-save]').addEventListener('click', () => {
        Actions.rename(id, input.value);
        close();
        toast('Name saved.', '✍️');
        App.refresh();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') root.querySelector('[data-save]').click();
      });
    },
  });
  return modal;
}


/* A read-only look at one named form: its sprite, its rarity rung and the stats
   it would carry. Every form is rendered into the same sheet and Prev/Next just
   swaps panels, so stepping never stacks overlays or loses the scroll position. */
/* The evolution preview draws the line's own colours, so a Club Penguin Puffle's
   five forms read as five classic colours instead of one colour five times. */
function evolutionStageSample(elementKey, chainKey, stage) {
  const sample = { element: elementKey, stage };
  const style = typeof window.puffleEvolutionColour === 'function' ? window.puffleEvolutionColour(chainKey, stage) : null;
  if (style) {
    sample.puffleVariant = style;
    if (typeof BREEDS !== 'undefined' && BREEDS[elementKey]) sample.breed = elementKey;
  }
  return sample;
}

function openEvolutionFormPreview(chainKey, elementKey, formIndex, ownedIndex) {
  const chain = window.PUFFLE_EVOLUTION_CHAINS ? window.PUFFLE_EVOLUTION_CHAINS[chainKey] : null;
  if (!chain || typeof openSheet !== 'function') return;
  const count = chain.stages.length;
  const clampIndex = (i) => Math.max(0, Math.min(count - 1, Number(i) || 0));
  /* The form this sprite has actually reached, if the caller knows it: it is
     marked so the preview makes clear which one is already yours. */
  const mine = (ownedIndex !== null && ownedIndex !== undefined && ownedIndex !== '' && Number.isFinite(Number(ownedIndex)))
    ? clampIndex(ownedIndex) : null;
  const ladder = typeof window.puffleRarityForChain === 'function' ? (window.puffleRarityForChain(chainKey) || []) : [];
  const panel = (i) => {
    const stage = ['baby', 'sprite', 'youngadult', 'elder', 'apex'][i] || 'baby';
    const tier = ladder[i] || null;
    const stats = typeof puffleStatsFor === 'function' ? puffleStatsFor(elementKey, Math.min(3, i)) : null;
    const isMine = mine !== null && i === mine;
    return `<div data-evo-panel="${i}"${isMine ? ' data-evo-mine="1"' : ''} style="${isMine ? 'border:1px solid var(--accent);border-radius:16px;padding:10px;margin:-10px' : ''}">
      <div style="text-align:center;margin-bottom:10px">${typeof spriteSVG === 'function' ? spriteSVG(evolutionStageSample(elementKey, chainKey, stage), { still: true }).replace('<svg ', '<svg width="156" height="156" shape-rendering="geometricPrecision" ') : ''}</div>
      <div class="row" style="justify-content:center;gap:6px;margin-bottom:10px">
        ${tier ? `<span class="chip" style="border-color:${tier.color}">${tier.icon} ${esc(tier.name)} ${'★'.repeat(tier.stars)}</span><span class="chip" style="border-color:${tier.color}">${esc(typeof window.puffleBadgeFor === 'function' ? window.puffleBadgeFor(tier.key, chainKey + ':' + i) : tier.badge)}</span>` : ''}
        <span class="chip">${esc(stage)}</span>
        ${isMine ? '<span class="chip" style="border-color:var(--accent);font-weight:800">★ Yours</span>' : ''}
      </div>
      ${stats ? `<div class="card" style="padding:12px">${['hp', 'atk', 'mag', 'def', 'res', 'spd'].filter((k) => typeof stats[k] === 'number').map((k) => `<div class="between" style="margin-bottom:5px"><span class="tiny muted">${k.toUpperCase()}</span><b>${stats[k].toLocaleString()}</b></div>`).join('')}<div class="between" style="margin-top:8px;border-top:1px solid var(--line);padding-top:6px"><span class="tiny muted">TOTAL</span><b>${(stats.total || 0).toLocaleString()}</b></div></div>` : ''}
    </div>`;
  };
  const start = clampIndex(formIndex);
  const body = `${chain.stages.map((_, i) => panel(i)).join('')}
    <p class="tiny muted" data-evo-form-label style="margin:10px 0 0;line-height:1.5"></p>
    <div class="row" style="gap:8px;margin-top:12px;justify-content:center">
      <button class="btn btn-soft" type="button" data-evo-step="-1">◀ Previous</button>
      <button class="btn btn-soft" type="button" data-evo-step="1">Next ▶</button>
    </div>`;
  openSheet({
    title: chain.stages[start],
    sub: `${chain.family} line · form ${start + 1} of ${count}`,
    body,
    key: 'evo-form',
    onMount: (sheet, close) => {
      let current = start;
      const host = sheet.querySelector('[data-evo-panel="0"]') ? sheet : (sheet.closest('.sheet') || document);
      const panels = [...host.querySelectorAll('[data-evo-panel]')];
      const prev = sheet.querySelector('[data-evo-step="-1"]');
      const next = sheet.querySelector('[data-evo-step="1"]');
      const label = sheet.querySelector('[data-evo-form-label]');
      /* The sheet body sits inside the overlay, so climb to the overlay root
         before looking for the heading — the page's own h2 is a different node. */
      const overlayRoot = sheet.closest('.game-overlay, .sheet, .overlay') || sheet;
      const heading = overlayRoot.querySelector('h2, .sheet-title, .sheet-head h2');
      const paint = () => {
        panels.forEach((node) => { node.hidden = Number(node.dataset.evoPanel) !== current; });
        if (prev) prev.disabled = current === 0;
        if (next) next.disabled = current === count - 1;
        if (label) {
          label.textContent = mine !== null
            ? `Form ${current + 1} of ${count} · your sprite is on form ${mine + 1}${current === mine ? ' (this one)' : ''}. Preview only.`
            : `Form ${current + 1} of ${count} · preview only. Your sprite keeps its current stage.`;
        }
        if (heading) heading.textContent = chain.stages[current];
      };
      const step = (delta) => {
        const target = current + delta;
        if (target < 0 || target > count - 1) return;
        current = target;
        paint();
      };
      if (prev) prev.addEventListener('click', () => step(-1));
      if (next) next.addEventListener('click', () => step(1));
      paint();
    },
  });
}

/* Colourway copy: the hexes are what the Studio dye wheel takes, so the card can
   hand them over in one tap. Clipboard access can be refused (older browsers,
   insecure contexts), so there is a textarea fallback before giving up. */
function copyColourwayText(text, label) {
  const ok = () => { if (typeof toast === 'function') toast(`${label} — paste it into the Studio dye wheel.`, '🎨'); };
  const fallback = () => {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      if (copied) ok();
      else if (typeof toast === 'function') toast('The browser blocked the copy.', '⚠️');
    } catch (e) {
      if (typeof toast === 'function') toast('The browser blocked the copy.', '⚠️');
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(fallback);
  } else {
    fallback();
  }
}

if (typeof window !== 'undefined' && !window.__evoFormPreviewBound) {
  window.__evoFormPreviewBound = true;
  document.addEventListener('click', (event) => {
    const copyBtn = event.target && event.target.closest ? event.target.closest('[data-colourway-copy]') : null;
    if (copyBtn) {
      event.preventDefault();
      copyColourwayText(copyBtn.dataset.colourwayCopy, 'Colourway copied');
      return;
    }
    const swatch = event.target && event.target.closest ? event.target.closest('[data-colourway-hex]') : null;
    if (swatch) {
      event.preventDefault();
      copyColourwayText(swatch.dataset.colourwayHex, `${swatch.dataset.colourwayHex} copied`);
      return;
    }
    const target = event.target && event.target.closest ? event.target.closest('[data-evo-form]') : null;
    if (target) {
      event.preventDefault();
      openEvolutionFormPreview(target.dataset.evoChain, target.dataset.evoElement, Number(target.dataset.evoForm) || 0, target.dataset.evoOwned);
      return;
    }
    /* Tapping the card away from a stage button opens the line at the form the
       sprite has reached, so the preview starts where the player already is. */
    const card = event.target && event.target.closest ? event.target.closest('[data-evo-card-line]') : null;
    if (!card) return;
    event.preventDefault();
    openEvolutionFormPreview(card.dataset.evoCardLine, card.dataset.evoCardElement, Number(card.dataset.evoCardForm) || 0, card.dataset.evoCardForm);
  });
}
/* Ability paths: one signature ability, three branches, then the rarity extras
   (mastery, mutation, Star Cores, Creator paths) that layer on top. */
function abilityPathCardHTML(s) {
  if (!s || s.stage === 'egg' || typeof abilityPathTree !== 'function') return '';
  const tree = abilityPathTree(s);
  if (!tree) return '';
  const element = abilityPathElement(s);
  const elementName = (typeof ELEMENTS !== 'undefined' && ELEMENTS[s.element] && ELEMENTS[s.element].name) || 'Element';
  const rank = abilityRarityIndex(s);
  const choice = abilityPathChoice(s);
  const picked = abilityPathAbility(s);
  const tier = abilityPathTier(s);
  const level = Number(s.level) || 1;
  const toEvolve = Math.max(1, ABILITY_PATH_EVOLVE_LEVEL - level);
  const mastery = rank >= 4 && ABILITY_MASTERIES[element] ? ABILITY_MASTERIES[element] : null;
  const coreCount = typeof abilityCoreTier === 'function' ? abilityCoreTier(s) : 0;
  const isCreator = rank >= 9;
  const labels = { atk: 'ATK', mag: 'MAG', def: 'DEF', spd: 'SPD', crit: 'CRIT', dodge: 'DODGE', winChance: 'WIN', xp: 'XP', bond: 'BOND' };
  const pills = (mods) => Object.keys(mods || {}).slice(0, 3).map((key) => {
    const value = mods[key];
    const pct = key === 'crit' || key === 'dodge' || key === 'winChance' ? Math.round(value * 100) : Math.round((value - 1) * 100);
    return `<span>${labels[key] || key} +${pct}%</span>`;
  }).join('');
  return `<div class="card ap-card" style="margin-top:10px">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">ABILITY PATH</div><span class="chip">${tree.base.icon} ${esc(tree.base.name)}</span></div>
    <div class="tiny muted" style="margin-top:5px">${esc(elementName)} branch — pick one path. Another ${esc(elementName)} Puffle can pick a different one.</div>
    ${picked ? `<div class="ap-signature"><span class="ap-sig-icon">${picked.icon}</span><div style="flex:1;min-width:0"><b>${esc(picked.name)}</b><div class="tiny muted">${esc(picked.form.blurb)}</div><div class="ap-pills">${pills(picked.form.mods)}</div>${mastery ? `<div class="ap-mastery">${mastery.icon} ${esc(mastery.name)} — ${esc(mastery.blurb)}</div>` : ''}${picked.mutation ? `<div class="ap-mutation">🌈 ${esc(picked.mutation.blurb)}</div>` : ''}</div></div>` : ''}
    <div class="ap-branches">${tree.branches.map((branch) => {
      const chosen = !!(choice && choice.key === branch.key);
      return `<div class="ap-branch${chosen ? ' is-chosen' : ''}">
        <span class="ap-b-icon">${branch.t1.icon}</span>
        <div class="ap-b-main"><div class="ap-b-name">${esc(branch.t1.name)}<span class="ap-arrow">→</span>${esc(branch.t2.name)}</div><div class="tiny muted">${esc(branch.t1.blurb)}</div><div class="ap-pills">${pills(branch.t1.mods)}</div></div>
        ${chosen ? '<span class="chip ap-on">Chosen</span>' : `<button class="btn btn-soft ap-pick" data-path-pick="${branch.key}">${choice ? `Change · ${AP_PATH_CHANGE_COST}🪙` : 'Choose'}</button>`}
      </div>`;
    }).join('')}</div>
    <div class="tiny muted ap-foot">${picked ? (tier === 1 ? `Evolves into <b style="color:var(--text)">${esc(picked.branch.t2.name)}</b> at level ${ABILITY_PATH_EVOLVE_LEVEL} — ${toEvolve} to go.` : 'Evolved form active.') : 'The first path is free. Changing it later costs ${AP_PATH_CHANGE_COST} coins.'}</div>
    ${coreCount || rank >= 8 ? `<div class="ap-cores">${CELESTIAL_CORES.map((core, i) => `<span class="ap-core${i < coreCount ? ' is-on' : ''}" title="${esc(core.name)} — level ${core.level}">${core.icon}</span>`).join('')}<span class="tiny muted" style="align-self:center;margin-left:4px">${coreCount}/${CELESTIAL_CORES.length} Star Cores</span></div>` : ''}
    ${isCreator ? `<div class="ap-creator"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin-top:10px">CREATOR PATH</div><div class="ap-branches">${CREATOR_PATHS.map((path) => `<div class="ap-branch${s.creatorPath === path.key ? ' is-chosen' : ''}"><span class="ap-b-icon">${path.icon}</span><div class="ap-b-main"><div class="ap-b-name">${esc(path.name)}</div><div class="tiny muted">${esc(path.blurb)}</div><div class="ap-pills">${pills(path.mods)}</div></div>${s.creatorPath === path.key ? '<span class="chip ap-on">Chosen</span>' : `<button class="btn btn-soft ap-pick" data-creator-pick="${path.key}">Choose</button>`}</div>`).join('')}</div><div class="tiny muted ap-foot">${level >= CREATOR_FINAL.level ? `<b style="color:var(--gold)">${CREATOR_FINAL.icon} ${esc(CREATOR_FINAL.name)}</b> unlocked — ${esc(CREATOR_FINAL.blurb)}` : `${CREATOR_FINAL.icon} ${esc(CREATOR_FINAL.name)} unlocks at level ${CREATOR_FINAL.level} — ${CREATOR_FINAL.level - level} to go.`}</div></div>` : ''}
  </div>`;
}

function bindAbilityPathCard(root, s, close) {
  root.querySelectorAll('[data-path-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tree = abilityPathTree(s);
      const branch = tree && tree.branches.find((b) => b.key === btn.dataset.pathPick);
      if (!branch) return;
      const changing = !!(s.abilityPath && s.abilityPath.branch);
      if (changing) {
        const cost = typeof AP_PATH_CHANGE_COST === 'number' ? AP_PATH_CHANGE_COST : 60;
        if ((state.coins || 0) < cost) {
          toast(`Changing a path costs ${cost} coins — you have ${Math.floor(state.coins || 0)}.`, '🪙');
          Sfx.error();
          return;
        }
        state.coins -= cost;
      }
      s.abilityPath = { element: abilityPathElement(s), branch: branch.key, at: Date.now() };
      if (typeof saveState === 'function') saveState(true);
      Sfx.win();
      burstOn(btn, [branch.t1.icon], 6);
      toast(`${displayName(s)} now follows ${branch.t1.name}.`, branch.t1.icon);
      close();
      setTimeout(() => openSpriteDetail(s.id), 180);
    });
  });
  root.querySelectorAll('[data-creator-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const path = CREATOR_PATHS.find((p) => p.key === btn.dataset.creatorPick);
      if (!path) return;
      const cost = typeof AP_PATH_CHANGE_COST === 'number' ? AP_PATH_CHANGE_COST : 60;
      if (s.creatorPath && s.creatorPath !== path.key && (state.coins || 0) < cost) {
        toast(`Changing a Creator path costs ${cost} coins — you have ${Math.floor(state.coins || 0)}.`, '🪙');
        Sfx.error();
        return;
      }
      if (s.creatorPath && s.creatorPath !== path.key) state.coins -= cost;
      s.creatorPath = path.key;
      if (typeof saveState === 'function') saveState(true);
      Sfx.win();
      burstOn(btn, [path.icon], 6);
      toast(`${displayName(s)} walks the ${path.name} path.`, path.icon);
      close();
      setTimeout(() => openSpriteDetail(s.id), 180);
    });
  });
}
