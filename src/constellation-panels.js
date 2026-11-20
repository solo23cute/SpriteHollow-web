/* Collection Constellations panels.

   The strip lives on the Collection screen, the atlas opens from Collection and
   from a Codex tile, and every card opens one detail sheet. Routing buttons in
   the sheet call the same actions the rest of the game uses: openApexTypeEgg for
   a base egg, Actions.setTheme + App.go for travel, and openBreedingEntry for
   a preselected pair. Charts are progress records only; they pay no reward. */

const CONSTELLATION_FAMILY_META = {
  habitat: { icon: '🏞️', label: 'Habitat' },
  bloodline: { icon: '🧬', label: 'Bloodline' },
  signature: { icon: '✦', label: 'Signature' },
  secret: { icon: '🌈', label: 'Secret' },
  celestial: { icon: '🌌', label: 'Celestial' },
};

function constellationFamilyMeta(family) {
  return CONSTELLATION_FAMILY_META[family] || { icon: '✦', label: family || 'Chart' };
}

function constellationMemberName(member) {
  if (!member) return '';
  if (member.kind === 'species') return constellationElementName(member.key);
  if (member.kind === 'combo') {
    const combo = typeof COMBOS !== 'undefined' ? COMBOS.find((entry) => entry.id === member.key) : null;
    return combo ? combo.name : member.key;
  }
  return member.key;
}

function constellationElementName(key) {
  return (ELEMENTS[key] && ELEMENTS[key].name) || key;
}

/* The route layer only receives the game lookups it needs. Keeping this here
   means the pure routing module has no game dependency of its own. */
function constellationEnv() {
  if (typeof ELEMENTS === 'undefined' || typeof SCENES === 'undefined' || typeof TYPE_EGG_PRICE === 'undefined') return null;
  return {
    priceOf(key) {
      const price = TYPE_EGG_PRICE[key];
      return Number.isFinite(Number(price)) ? Number(price) : null;
    },
    nameOf(key) {
      return constellationElementName(key);
    },
    rarityOf(key) {
      return typeof typeEggRarity === 'function' ? typeEggRarity(key) : null;
    },
    scene(key) {
      const scene = SCENES[key];
      return scene ? { name: scene.name, species: Array.isArray(scene.species) ? scene.species : [] } : null;
    },
  };
}

function constellationSnapshot() {
  if (typeof Constellations === 'undefined') {
    return { all: [], nearest: [], totals: { seeds: 0, complete: 0 } };
  }
  return Constellations.analyze(state);
}

function constellationAtlasSummary() {
  const totals = constellationSnapshot().totals;
  return `${totals.complete} of ${totals.seeds} charts lit`;
}

/* ---- strip ---- */

function constellationCardHTML(progress) {
  const meta = constellationFamilyMeta(progress.family);
  const completable = progress.completable !== false;
  const pct = progress.ratio === null || progress.ratio === undefined ? 0 : Math.round(progress.ratio * 100);
  const status = !completable
    ? 'luck tier · cannot be completed'
    : progress.complete
      ? 'complete'
      : `${progress.total - progress.owned} to find`;
  return `<button class="constellation-card ${progress.complete ? 'is-complete' : ''} ${!completable ? 'is-uncompletable' : ''}" data-constellation="${progress.id}" title="${esc(progress.name)} · ${esc(meta.label)} · ${progress.owned}/${progress.total}">
    <span class="cc-top"><b>${esc(progress.name)}</b><span class="cc-family">${meta.icon} ${esc(meta.label)}</span></span>
    ${completable ? `<span class="constellation-bar" role="progressbar" aria-label="${esc(progress.name)} progress" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.owned}"><i style="width:${pct}%"></i></span>` : ''}
    <span class="cc-meta">${progress.owned}/${progress.total} ${completable ? 'members' : 'forms seen'} · ${esc(status)}</span>
  </button>`;
}

function constellationStripBodyHTML() {
  if (typeof Constellations === 'undefined') return '';
  const snapshot = constellationSnapshot();
  const shown = snapshot.nearest.length
    ? snapshot.nearest
    : snapshot.all.filter((progress) => progress.completable).slice(0, 3);
  const cards = shown.map(constellationCardHTML).join('');
  return `<div class="constellation-strip-head">
      <div class="section-title" style="margin:0"><h2>Constellations</h2><span>${snapshot.totals.complete} lit</span></div>
      <button class="btn btn-sm btn-soft" data-constellation-atlas>🗺️ Atlas</button>
    </div>
    <div class="constellation-strip" data-constellation-cards>${cards}</div>
    <p class="tiny muted" style="margin:6px 2px 0;line-height:1.5">The three charts nearest completion. Secret Fusions is a luck tier and is not counted. Tap one to see its exact egg, habitat, and fusion pair.</p>`;
}

function mountConstellationStrip(container) {
  if (!container) return () => {};
  const paint = () => { container.innerHTML = constellationStripBodyHTML(); };
  paint();
  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const card = target.closest('[data-constellation]');
    if (card) {
      if (typeof Sfx !== 'undefined') Sfx.click();
      openConstellationSheet(card.dataset.constellation);
      return;
    }
    if (target.closest('[data-constellation-atlas]')) {
      if (typeof Sfx !== 'undefined') Sfx.click();
      openConstellationAtlas();
    }
  };
  container.addEventListener('click', onClick);
  const unsubscribe = typeof subscribeState === 'function' ? subscribeState(paint) : () => {};
  return () => {
    container.removeEventListener('click', onClick);
    unsubscribe();
  };
}

/* ---- detail sheet ---- */

function constellationBlockedLabel(entry) {
  if (!entry) return '';
  if (entry === 'hybrid-parent') return 'a two-element hybrid of two parts';
  if (entry === 'plain-third') return 'the plain third element';
  if (entry.indexOf('no-') === 0) return `a ${constellationElementName(entry.slice(3))} sprite`;
  if (entry.indexOf('level-') === 0) return `${constellationElementName(entry.slice(6))} at level 3`;
  if (entry.indexOf('resting-') === 0) return `${constellationElementName(entry.slice(8))} rested`;
  return entry;
}

function constellationRouteHTML(plan) {
  if (!plan) return '';
  const blocks = [];

  if (plan.habitat) {
    const travelling = plan.habitat.needsTravel === true;
    blocks.push(`<div class="card" style="padding:11px;margin-top:10px">
      <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">HABITAT FOCUS</div><span class="chip">${esc(plan.habitat.sceneName)}</span></div>
      <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">${plan.habitat.owned} of ${plan.habitat.total} members belong to ${esc(plan.habitat.sceneName)} (${plan.habitat.sceneRosterSize.toLocaleString()} species in the scene).</p>
      ${travelling
        ? `<button class="btn btn-soft btn-block" data-c-travel style="margin-top:8px">🧭 Travel to ${esc(plan.habitat.sceneName)}</button>`
        : `<p class="tiny muted" style="margin:8px 0 0">You are already in ${esc(plan.habitat.sceneName)}.</p>`}
    </div>`);
  }

  if (plan.egg && plan.egg.missing) {
    const price = plan.egg.price === null || plan.egg.price === undefined ? '' : ` · ${plan.egg.price.toLocaleString()} 🪙`;
    blocks.push(`<div class="card" style="padding:11px;margin-top:10px">
      <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">BASE TYPE EGG</div><span class="chip">${esc(plan.egg.rarity || 'base')}</span></div>
      <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">The next exact egg is <b style="color:var(--text)">${esc(constellationElementName(plan.egg.species))}</b>${price}. It opens the plain band card in the Nest, not an apex premium.</p>
      <button class="btn btn-primary btn-block" data-c-buy ${plan.egg.affordable === false ? 'disabled' : ''} style="margin-top:8px">🥚 ${esc(constellationElementName(plan.egg.species))} egg${price}</button>
    </div>`);
  }

  if (plan.fusion) {
    const fusion = plan.fusion;
    const probability = fusion.probability || {};
    const pairText = fusion.pair
      ? fusion.pair.map(constellationElementName).join(' + ')
      : (fusion.parts || []).map(constellationElementName).join(' + ');
    const odds = probability.percent === undefined || probability.percent === null ? 'a roll' : `${probability.percent}% roll`;
    const readiness = fusion.blocked && fusion.blocked.length
      ? `<p class="tiny" style="margin:6px 0 0;color:var(--warn,#ffb86b)">Needs ${esc(fusion.blocked.map(constellationBlockedLabel).join(', '))}.</p>`
      : '<p class="tiny" style="margin:6px 0 0;color:var(--accent,#8be9ff)">Both parents are ready to merge.</p>';
    blocks.push(`<div class="card" style="padding:11px;margin-top:10px">
      <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">FUSION PAIR</div><span class="chip" title="Fusion results are rolled, never guaranteed">${esc(odds)}</span></div>
      <p style="margin:6px 0 0;font-size:12px"><b>${esc(constellationMemberName({ kind: 'form', key: fusion.product }))}</b> from ${esc(pairText)}</p>
      <p class="tiny muted" style="margin:5px 0 0;line-height:1.5">${esc(probability.note || 'The merge action is exact; which form it rolls is not.')}</p>
      ${readiness}
      ${fusion.pairKey
        ? `<button class="btn btn-soft btn-block" data-c-pair style="margin-top:8px">🧬 Open the ${esc(pairText)} pair</button>`
        : `<p class="tiny muted" style="margin:8px 0 0">Needs a two-element hybrid of two of those parts plus the plain third before the merge can roll it.</p>`}
    </div>`);
  }

  return blocks.join('');
}

function openConstellationSheet(seedId) {
  if (typeof Constellations === 'undefined') return;
  const seed = Constellations.seedById(seedId);
  if (!seed) return;
  const ownership = Constellations.ownershipFromSave(state);
  const progress = Constellations.progressFor(seedId, ownership);
  const complete = !!(progress && progress.complete);
  const completable = !progress || progress.completable !== false;
  const meta = constellationFamilyMeta(seed.family);
  const plan = !complete && typeof ConstellationRoutes !== 'undefined'
    ? ConstellationRoutes.planFor(state, seedId, {
      merges: (state.stats && state.stats.merges) || 0,
      now: Date.now(),
      env: constellationEnv(),
    })
    : null;
  const pct = progress && progress.ratio !== null && progress.ratio !== undefined
    ? Math.round(progress.ratio * 100)
    : null;
  const body = `
    <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px">
      <span class="chip">${meta.icon} ${esc(meta.label)}</span>
      <span class="chip">${progress ? progress.owned : 0}/${progress ? progress.total : seed.members.length} ${completable ? 'members' : 'forms seen'}</span>
      ${seed.scene ? `<span class="chip">${esc((SCENES[seed.scene] && SCENES[seed.scene].name) || seed.scene)}</span>` : ''}
      ${progress && progress.complete ? '<span class="chip chip-tier">Complete</span>' : ''}
      ${!completable ? '<span class="chip">Luck tier · cannot be completed</span>' : ''}
    </div>
    ${pct === null ? '' : `<div class="constellation-bar" style="margin-top:12px"><i style="width:${pct}%"></i></div>
    <div class="between tiny muted" style="margin-top:6px"><span>${pct}% charted</span><span>${progress ? progress.owned : 0}/${progress ? progress.total : seed.members.length}</span></div>`}
    <div class="card" style="padding:11px;margin-top:10px">
      <div class="tiny muted" style="font-weight:800;letter-spacing:.08em">MEMBERS</div>
      <div style="margin-top:4px">
        ${seed.members.map((member) => {
          const owned = Constellations.ownsMember(ownership, member);
          const kind = member.kind === 'species' ? 'type egg' : member.kind === 'combo' ? 'combo' : 'fusion form';
          return `<div class="constellation-member ${owned ? 'is-owned' : ''}">
            <span class="cm-dot">${owned ? '✓' : '○'}</span>
            <span class="cm-name">${esc(constellationMemberName(member))}</span>
            <span class="cm-kind">${esc(kind)}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
    ${complete
      ? '<p class="tiny muted" style="margin:10px 2px 0;line-height:1.5">Every member is in the Hollow. Nothing left to route.</p>'
      : !completable
        ? `${constellationRouteHTML(plan)}
    <p class="tiny muted" style="margin:10px 2px 0;line-height:1.5">${esc(progress && progress.completionNote ? progress.completionNote : 'This seed cannot be completed.')} It is excluded from completion totals and ratios.</p>`
      : `${constellationRouteHTML(plan)}
    <p class="tiny muted" style="margin:10px 2px 0;line-height:1.5">Fusion members are rolled by the existing merge action, so a chart can sit at 5/6 for a while. Only the pair and the action are fixed.</p>`}`;

  const { close } = openSheet({
    title: `${meta.icon} ${esc(seed.name)}`,
    sub: `${meta.label} constellation · ${progress ? progress.owned : 0}/${progress ? progress.total : seed.members.length} ${completable ? 'collected' : 'forms seen'}${completable ? '' : ' · luck tier'}`,
    body,
    onMount: (root) => {
      root.querySelector('[data-c-buy]')?.addEventListener('click', () => {
        if (!plan || !plan.egg) return;
        close();
        if (typeof openApexTypeEgg === 'function') openApexTypeEgg(plan.egg.species, 'base');
        if (typeof toast === 'function') toast(`${constellationElementName(plan.egg.species)} egg pinned in the Nest.`, '🥚');
      });
      root.querySelector('[data-c-travel]')?.addEventListener('click', () => {
        if (!plan || !plan.habitat) return;
        const trip = Actions.setTheme({ scene: plan.habitat.scene });
        close();
        if (typeof App !== 'undefined') App.go('hollow');
        if (typeof toast === 'function') {
          toast(`${SCENES[plan.habitat.scene] ? SCENES[plan.habitat.scene].name : plan.habitat.scene}${trip && trip.coins ? ` · +${trip.coins} coins` : ''}.`, '🧭');
        }
      });
      root.querySelector('[data-c-pair]')?.addEventListener('click', () => {
        if (!plan || !plan.fusion || !plan.fusion.pairKey) return;
        const key = plan.fusion.pairKey;
        close();
        setTimeout(() => { if (typeof openBreedingEntry === 'function') openBreedingEntry(key); }, 140);
      });
    },
  });
  return { close };
}

/* ---- atlas ---- */

function constellationAtlasRowHTML(progress) {
  const meta = constellationFamilyMeta(progress.family);
  const completable = progress.completable !== false;
  const pct = progress.ratio === null || progress.ratio === undefined ? 0 : Math.round(progress.ratio * 100);
  const status = !completable
    ? 'luck tier · cannot be completed'
    : progress.complete
      ? '✓ complete'
      : `${progress.total - progress.owned} missing`;
  return `<button class="constellation-row ${progress.complete ? 'is-complete' : ''} ${!completable ? 'is-uncompletable' : ''}" data-constellation-row="${progress.id}">
    <span class="cr-head"><b>${meta.icon} ${esc(progress.name)}</b><span class="cr-status">${esc(status)}</span></span>
    ${completable ? `<span class="constellation-bar"><i style="width:${pct}%"></i></span>` : ''}
    <span class="cr-status">${progress.owned}/${progress.total} ${completable ? 'members' : 'forms seen'} · ${esc(meta.label)}</span>
  </button>`;
}

function openConstellationAtlas() {
  if (typeof Constellations === 'undefined') return;
  const snapshot = constellationSnapshot();
  const all = snapshot.all;
  const group = (segment, label) => {
    const rows = all.filter((progress) => progress.segment === segment);
    if (!rows.length) return '';
    return `<div class="section-title" style="margin:14px 0 8px"><h2>${label}</h2><span>${rows.filter((row) => row.complete).length} lit</span></div>
      ${rows.map(constellationAtlasRowHTML).join('')}`;
  };

  const { close } = openSheet({
    title: '🗺️ Constellation Atlas',
    sub: `${snapshot.totals.complete} of ${snapshot.totals.seeds} charts lit`,
    body: `${group('habitat', 'Habitat charts')}${group('fusion', 'Fusion charts')}
      <div class="card" style="padding:12px;margin-top:12px;font-size:11px;line-height:1.6;color:var(--muted)">
        Habitat charts are type eggs plus a scene roster; fusion charts reuse the Nest merge, where the pair and action are exact but the form is rolled. Secret Fusions is a luck tier at 2%–12% and is excluded from completion totals.
      </div>`,
    onMount: (root) => {
      root.querySelectorAll('[data-constellation-row]').forEach((row) => {
        row.addEventListener('click', () => {
          const id = row.dataset.constellationRow;
          close();
          setTimeout(() => openConstellationSheet(id), 120);
        });
      });
    },
  });
  return { close };
}
