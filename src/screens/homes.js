/* Sprite Homes: a multi-window neighbourhood where every sprite has its own
   room in its own biome — including retired elders and sprites that went back
   to their egg after a Rebirth Meal. The main Hollow keeps everyone together. */

/* Scenes that can hold a window. Locked scenes stay out of the picker until
   their gift/unlock lands, but an already-assigned home keeps working. */
function homeScenePool() {
  return SCENE_KEYS.filter((key) => {
    const scene = SCENES[key];
    if (!scene) return false;
    return scene.unlocked !== false || (state.unlockedScenes || []).includes(key);
  });
}

/* Every species leans toward one type biome: the first type biome whose
   species list already holds it, so a fire sprite wakes up in the caldera. */
function defaultHomeScene(s) {
  const element = s && s.element;
  /* A Hollow exotic wakes up in its own signature biome before any type biome. */
  if (element && typeof exoticBiomeFor === 'function') {
    const exotic = exoticBiomeFor(element);
    if (exotic) return exotic;
  }
  /* GTA sprites start in the district their game belongs to. */
  const gtaHome = element && ELEMENTS[element] && ELEMENTS[element].gtaHome;
  if (gtaHome && SCENES[gtaHome]) return gtaHome;
  if (element) {
    const type = Object.keys(TYPE_BIOMES || {}).find((key) => {
      const biome = TYPE_BIOMES[key];
      const scene = biome && SCENES[biome.key];
      return !!(scene && (scene.species || []).includes(element));
    });
    if (type) return TYPE_BIOMES[type].key;
    const habitat = SCENE_KEYS.find((key) => SCENES[key] && (SCENES[key].species || []).includes(element));
    if (habitat) return habitat;
  }
  return 'grove';
}

/* The default biome depends only on the species, so cache its scene lookup.
   Assigned homes still win in homeSceneFor and are not cached. */
const DEFAULT_HOME_SCENE_CACHE = new Map();
function defaultHomeSceneCached(s) {
  const element = s && s.element;
  if (!element) return defaultHomeScene(s);
  if (!DEFAULT_HOME_SCENE_CACHE.has(element)) DEFAULT_HOME_SCENE_CACHE.set(element, defaultHomeScene(s));
  return DEFAULT_HOME_SCENE_CACHE.get(element);
}

function homeSceneFor(s) {
  const assigned = state.homes && state.homes[s.id];
  if (assigned && SCENES[assigned]) return assigned;
  return defaultHomeSceneCached(s);
}

function homeIsCustom(s) {
  return !!(state.homes && state.homes[s.id] && SCENES[state.homes[s.id]]);
}

/* ---------- the three shelves of the neighbourhood ---------- */

function homesLiving() {
  return state.sprites
    .filter((s) => s.stage !== 'egg' && !s.retired)
    .sort((a, b) => {
      if (a.id === state.activeId) return -1;
      if (b.id === state.activeId) return 1;
      if (!!a.atHome !== !!b.atHome) return a.atHome ? -1 : 1;
      return (a.born || 0) - (b.born || 0);
    });
}

function homesAtHome() {
  return homesLiving().filter((s) => s.atHome);
}

function homesAway() {
  return homesLiving().filter((s) => !s.atHome);
}

function homesRetired() {
  return state.sprites
    .filter((s) => s.stage !== 'egg' && s.retired)
    .sort((a, b) => (b.retiredAt || 0) - (a.retiredAt || 0));
}

/* Sprites that finished a life and came back as a Rebirth egg. */
function homesReturning() {
  return state.sprites
    .filter((s) => s.stage === 'egg' && (Number(s.rebirths) || 0) > 0)
    .sort((a, b) => (Number(b.rebirths) || 0) - (Number(a.rebirths) || 0) || (a.born || 0) - (b.born || 0));
}

function homesOtherEggs() {
  return state.sprites.filter((s) => s.stage === 'egg' && !(Number(s.rebirths) > 0));
}

/* ---------- one window ---------- */

/* Optional species facade: a small exterior badge drawn from the species home
   theme. It reads speciesHomes and room state but never writes either. */
function homeSpeciesFacade(s) {
  if (!s || typeof state === 'undefined') return null;
  const def = typeof speciesHomeDef === 'function' ? speciesHomeDef(s.element) : null;
  if (!def || !def.facade) return null;
  const rec = typeof speciesHomeRecord === 'function' ? speciesHomeRecord(def, s.id) : { tier: def.tiers[0].id };
  const tier = def.tiers.find((step) => step.id === rec.tier) || def.tiers[0];
  return { def, tier };
}

function speciesFacadeHTML(s) {
  if (state && state.theme && state.theme.speciesFacades === false) return '';
  const info = homeSpeciesFacade(s);
  if (!info) return '';
  return `<span class="species-facade facade-${info.def.element}" aria-hidden="true"><span class="sf-shape"></span><span class="sf-sign">${info.def.facade.icon} ${esc(info.tier.name)}</span></span>`;
}

function homeWindowHTML(s) {
  const key = homeSceneFor(s);
  const scene = SCENES[key] || SCENES.grove;
  const tint = sceneTint(key);
  const custom = homeIsCustom(s);
  const isEgg = s.stage === 'egg';
  const rebirths = Math.max(0, Number(s.rebirths) || 0);
  const expr = typeof expressionFor === 'function' ? expressionFor(s) : 'happy';
  const stage = typeof stageLabel === 'function' ? stageLabel(s) : '';
  const art = isEgg ? eggSVG(s, { progress: s.hatch }) : spriteSVG(s, { expr });
  const ribbon = isEgg
    ? `<span class="home-ribbon">🥚 ${rebirths ? `Rebirth ${rebirths}` : 'Egg'}</span>`
    : s.retired ? '<span class="home-ribbon">🌿 Retired</span>' : '';
  /* The carried-over bond and the permanent rebirth multipliers are what a
     reborn sprite brings back with it when it hatches again. */
  const bonus = isEgg && rebirths
    ? `<span class="home-bonus" title="Carried over from their last life">Welcome back · ⚡ +${8 * rebirths}% XP · 🪙 +${rebirths} per game · 🎁 +${3 * rebirths}% gifts · 💗 ${Math.round(s.bond || 0)} bond kept</span>`
    : '';
  const sub = isEgg
    ? `${Math.round(s.hatch)}% warm · ${rebirths ? `life ${rebirths + 1}` : 'new life'}`
    : `${esc(stage)} · Lv ${s.level}${s.retired ? ' · resting' : ''}`;
  const action = isEgg
    ? `<button class="home-visit" type="button" data-home-warm="${s.id}">Warm this egg</button>`
    : `<button class="home-visit" type="button" data-home-visit="${s.id}">Visit ${esc(scene.habitat || 'biome')}</button>`;
  const care = isEgg ? '' : homeCareHTML(s);
  const kind = isEgg ? 'egg' : s.retired ? 'retired' : 'living';
  const tier = typeof spriteRarity === 'function' ? spriteRarity(s) : null;
  const ascended = !isEgg && (s.stage === 'sensei' || s.level >= MAX_LEVEL);
  const frameElement = typeof elementFrameKey === 'function' ? (elementFrameKey(s.element) || '') : '';
  const hybridFrame = !!(s.hybrid || s.hybridParents);
  const splitFrame = typeof hybridSplitFrame === 'function' ? hybridSplitFrame(s) : null;
  const tierChip = tier ? `<span class="home-tier" style="--tier:${tier.color};--tier-gradient:${tier.gradient || tier.color};--tier-glow:${tier.frameGlow || tier.color}">${tier.name}</span>` : '';
  const status = isEgg ? '' : s.retired ? 'Retired' : s.atHome ? 'At home' : 'Out in the Hollow';
  const toggle = isEgg || s.retired
    ? ''
    : `<button class="home-visit home-toggle" type="button" data-home-toggle="${s.id}">${s.atHome ? 'Back to the Hollow' : 'Send home'}</button>`;
  return `<article class="home-window ${isEgg ? 'is-egg' : ''} ${s.retired ? 'is-retired' : ''} ${!isEgg && !s.atHome ? 'is-away' : ''} ${ascended ? 'is-ascended' : ''} ${s.id === state.activeId ? 'active' : ''}" data-home-card="${s.id}" data-home-kind="${kind}" data-rarity="${tier ? spriteRarityKey(s) : ''}" data-frame-element="${frameElement}"${hybridFrame ? ' data-frame-hybrid="1"' : ''}${splitFrame ? ` data-frame-split="${splitFrame.wave}"` : ''} style="--home-a:${tint.b1};--home-b:${tint.b2};--rarity:${tier ? tier.color : 'var(--line)'};--rarity-gradient:${tier ? (tier.gradient || tier.color) : 'var(--line)'};--rarity-glow:${tier ? (tier.frameGlow || tier.color) : 'var(--line)'}${splitFrame ? `;--split-a:${splitFrame.a};--split-b:${splitFrame.b}` : ''}">
    <div class="home-pane scene-${key}" style="background:linear-gradient(180deg, ${tint.b2} 0%, ${tint.b1} 56%, ${tint.b2} 100%)">
      <div class="scene-decor">${buildSceneDecor(key)}</div>
      <span class="home-window-shine"></span>
      ${speciesFacadeHTML(s)}
      ${ribbon}
      <div class="home-actor">${art}</div>
      <button class="home-change" type="button" data-home-change="${s.id}"${custom ? ' data-custom="1"' : ''} title="Change ${esc(displayName(s))}’s biome" aria-label="Change ${esc(displayName(s))}’s biome">${scene.emoji}</button>
    </div>
    <div class="home-plate">
      <b><span class="home-name">${esc(displayName(s))}</span> <span class="gender-mark" style="color:${genderOf(s).color}" title="${esc(genderOf(s).name)}">${genderOf(s).symbol}</span> ${tierChip}</b>
      <span class="home-biome">${scene.emoji} ${esc(scene.name)}</span>
      <span class="home-sub">${sub}${status ? ` · ${status}` : ''}</span>
      ${bonus}
      ${care}
      ${action}
      ${toggle}
    </div>
  </article>`;
}

/* Care controls live inside each window, so a sprite can be rubbed, fed,
   bathed or tucked in without leaving its own room. */
function homeCareHTML(s) {
  const needs = ['hunger', 'energy', 'joy', 'clean'].map((key) => {
    const value = Math.round(Number(s.needs?.[key]) || 0);
    const label = key === 'hunger' ? 'Food' : key === 'energy' ? 'Rest' : key === 'joy' ? 'Joy' : 'Clean';
    return `<span class="home-need ${key}" title="${label} ${value}/100" aria-label="${label} ${value} of 100"><i style="width:${value}%"></i></span>`;
  }).join('');
  const name = esc(displayName(s));
  const napLabel = s.asleep ? 'Wake up' : 'Nap';
  return `<div class="home-needs" title="Food · Rest · Joy · Clean">${needs}</div>
    <div class="home-care" role="group" aria-label="Care for ${name}">
      <button class="home-care-btn" type="button" data-home-care="rub" data-home-id="${s.id}" title="Rub belly" aria-label="Rub ${name}’s belly">🤲</button>
      <button class="home-care-btn" type="button" data-home-care="feed" data-home-id="${s.id}" title="Feed" aria-label="Feed ${name}">🍎</button>
      <button class="home-care-btn" type="button" data-home-care="bath" data-home-id="${s.id}" title="Bath" aria-label="Bathe ${name}">🛁</button>
      <button class="home-care-btn" type="button" data-home-care="nap" data-home-id="${s.id}" title="${napLabel}" aria-label="${napLabel} ${name}">${s.asleep ? '☀️' : '🌙'}</button>
    </div>`;
}

function homeCareAction(spriteId, kind, repaint) {
  const s = findSprite(spriteId);
  if (!s || s.stage === 'egg') return;
  if (kind === 'feed') {
    openHomeFeedPicker(spriteId, repaint);
    return;
  }
  const card = document.querySelector(`[data-home-card="${spriteId}"]`);
  if (kind === 'rub') {
    const res = Actions.rubBelly(spriteId);
    if (res && res.cooled) toast(`${displayName(s)} is still blissed out from the last belly rub.`, '💗');
    else {
      toast(`${displayName(s)} flops over in their window for a belly rub.`, '🤲');
      fluffShed(card && card.querySelector('.home-actor'), s, 'rub');
      wagTail(card && card.querySelector('.home-actor'), s);
    }
  } else if (kind === 'bath') {
    const bath = Actions.bathe(spriteId);
    if (bath && bath.cooled) {
      toast(`${displayName(s)} is still fresh from the last bath.`, '🫧');
    } else {
      soapBubbles(document.querySelector('.home-pane'), 12);
      fluffShed(card && card.querySelector('.home-actor'), s, 'bath');
      toast(`${displayName(s)} is squeaky clean again.`, '🛁');
    }
  } else if (kind === 'nap') {
    if (s.asleep) {
      Actions.wake(spriteId);
      napPropFade(card && card.querySelector('.home-actor'));
      toast(`${displayName(s)} blinks awake in their window.`, '☀️');
    } else {
      Actions.nap(spriteId);
      toast(`${displayName(s)} curls up among their own hills.`, '😴');
    }
  }
  Sfx.click();
  if (repaint) repaint();
}

/* A pantry-only feed picker: enough to care for a sprite from its window
   without walking back to the Hollow's market. */
function openHomeFeedPicker(spriteId, onDone) {
  const s = findSprite(spriteId);
  if (!s) return;
  const snacks = Object.keys(state.inventory?.snacks || {}).filter((k) => SNACKS[k] && state.inventory.snacks[k] > 0);
  const foods = Object.keys(state.inventory?.foods || {}).filter((k) => FOODS[k] && state.inventory.foods[k] > 0);
  const row = (kind, key, item, count) => `<button class="home-feed-row" type="button" data-home-feed="${kind}" data-feed-key="${key}">
      <span class="hfr-emoji">${item.emoji || (kind === 'snack' ? '🍬' : '🍲')}</span>
      <span class="hfr-copy"><b>${esc(item.name)}</b><span>${count} in the pantry${kind === 'snack' ? (item.joy ? ` · joy +${item.joy}` : '') : ''}</span></span>
    </button>`;
  const rows = [
    ...snacks.map((key) => row('snack', key, SNACKS[key], state.inventory.snacks[key])),
    ...foods.map((key) => row('stock', key, FOODS[key], state.inventory.foods[key])),
  ].join('');
  const { close } = openSheet({
    title: `Feed ${esc(displayName(s))}`,
    sub: `Food ${Math.round(s.needs.hunger)}/100 · Joy ${Math.round(s.needs.joy)}/100 — straight from the pantry.`,
    body: rows
      ? `<div class="home-feed-grid">${rows}</div>`
      : `<div class="card empty-state"><div style="font-size:32px">🧺</div><h3 style="font-size:14px;margin:6px 0 4px">The pantry is empty</h3><p class="small muted">Stock snacks and meals from the Hollow’s Feed sheet, then come back to this window.</p></div>`,
    onMount: (root) => {
      root.querySelectorAll('[data-home-feed]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const res = btn.dataset.homeFeed === 'snack'
            ? Actions.feedSnack(spriteId, btn.dataset.feedKey)
            : Actions.feedStock(spriteId, btn.dataset.feedKey);
          close();
          if (res && res.ok) {
            Sfx.click();
            fluffShed(document.querySelector('.oo-art, .sh-art') || document.querySelector(`[data-home-card="${spriteId}"] .home-actor`), s, 'feed');
            wagTail(document.querySelector('.oo-art, .sh-art') || document.querySelector(`[data-home-card="${spriteId}"] .home-actor`), s);
          }
          if (onDone) onDone();
        });
      });
    },
  });
}

function homesSection(title, note, list, key) {
  if (!list.length) return '';
  return `<div class="section-title homes-section"><h2>${title}</h2><span>${note}</span></div>
    <div class="homes-grid" data-home-grid="${key}"></div>`;
}

function homesView(filter = 'all') {
  const living = homesLiving();
  const retired = homesRetired();
  const returning = homesReturning();
  const total = living.length + retired.length + returning.length;
  const all = [...living, ...retired, ...returning];
  const biomes = new Map();
  all.forEach((s) => {
    const key = homeSceneFor(s);
    const scene = SCENES[key] || SCENES.grove;
    const entry = biomes.get(key) || { key, scene, count: 0 };
    entry.count += 1;
    biomes.set(key, entry);
  });
  const available = [...biomes.values()].sort((a, b) => b.count - a.count || a.scene.name.localeCompare(b.scene.name));
  const chosen = filter !== 'all' && biomes.has(filter) ? filter : 'all';
  const inView = (s) => chosen === 'all' || homeSceneFor(s) === chosen;
  const viewLiving = living.filter(inView);
  const viewRetired = retired.filter(inView);
  const viewReturning = returning.filter(inView);
  return {
    living, retired, returning, total, available, chosen,
    viewLiving, viewRetired, viewReturning,
    atHomeList: viewLiving.filter((s) => s.atHome),
    awayList: viewLiving.filter((s) => !s.atHome),
    atHome: living.filter((s) => s.atHome).length,
    away: living.length - living.filter((s) => s.atHome).length,
    otherEggs: homesOtherEggs(),
  };
}

function homesBody(filter = 'all') {
  const view = homesView(filter);
  const { total, retired, returning, available, chosen, viewLiving, viewRetired, viewReturning, atHomeList, awayList, atHome, away, otherEggs } = view;
  if (!total) {
    return `<div class="card empty-state">
      <div style="font-size:38px">🪟</div>
      <h3 style="font-size:15px;margin:8px 0 4px">No windows yet</h3>
      <p class="small muted">Hatch a sprite and its own room appears here, ready in the biome it belongs to.</p>
    </div>`;
  }
  const viewTotal = viewLiving.length + viewRetired.length + viewReturning.length;
  const chips = [
    `🪟 ${total} window${total === 1 ? '' : 's'}`,
    `🏡 ${atHome} at home`,
    `🐾 ${away} in the Hollow`,
    retired.length ? `🌿 ${retired.length} retired` : '',
    returning.length ? `🥚 ${returning.length} returning` : '',
    `🌍 ${available.length} biome${available.length === 1 ? '' : 's'}`,
  ].filter(Boolean).map((label) => `<span class="chip">${label}</span>`).join('');
  const filterBar = `<div class="home-filter" role="group" aria-label="Filter homes by biome">
    <button class="home-filter-btn ${chosen === 'all' ? 'on' : ''}" type="button" data-home-filter="all">All · ${total}</button>
    ${available.map(({ key, scene, count }) => `<button class="home-filter-btn ${chosen === key ? 'on' : ''}" type="button" data-home-filter="${key}">${scene.emoji} ${esc(scene.name)} · ${count}</button>`).join('')}
  </div>`;
  return `<div class="homes-intro">${chips}</div>
    ${filterBar}
    ${viewTotal ? '' : '<div class="card empty-state" style="padding:14px"><p class="small muted">No windows in this biome yet.</p></div>'}
    ${homesSection('At home', `${atHomeList.length} resting in their own biome`, atHomeList, 'at-home')}
    ${homesSection('Out in the Hollow', `${awayList.length} exploring together`, awayList, 'hollow')}
    ${homesSection('Retirement home', `${viewRetired.length} resting on past glories`, viewRetired, 'retired')}
    ${homesSection('Returning', `${viewReturning.length} back in an egg, with their old life still in them`, viewReturning, 'returning')}
    <p class="tiny muted homes-foot">Tap a window to open that sprite${returning.length ? ', or to warm a returning egg' : ''}. Tap the biome badge in a window’s corner to move them somewhere else. Sprites at home stay out of the Hollow; sprites out in the Hollow share the scene together.${otherEggs.length ? ` ${otherEggs.length} other egg${otherEggs.length === 1 ? '' : 's'} still warming in the Nest will get a window once hatched.` : ''}</p>`;
}

function mountHomesBody(body, filter = 'all') {
  const view = homesView(filter);
  const lists = {
    'at-home': view.atHomeList,
    hollow: view.awayList,
    retired: view.viewRetired,
    returning: view.viewReturning,
  };
  const grids = [];
  body.querySelectorAll('[data-home-grid]').forEach((el) => {
    const lazy = new LazyGrid(el, { batchSize: 12, rootMargin: '600px 0px' });
    lazy.reset(lists[el.dataset.homeGrid] || [], homeWindowHTML);
    grids.push(lazy);
  });
  return grids;
}

function openHomeScenePicker(spriteId, onDone) {
  const s = findSprite(spriteId);
  if (!s) return;
  const current = homeSceneFor(s);
  const auto = defaultHomeSceneCached(s);
  const autoScene = SCENES[auto] || SCENES.grove;
  const pool = homeScenePool();
  const cards = pool.map((key) => {
    const scene = SCENES[key];
    const tint = sceneTint(key);
    return `<button class="home-pick ${key === current ? 'on' : ''}" data-home-scene="${key}" style="--pick-a:${tint.b1};--pick-b:${tint.b2}">
      <span class="home-pick-art">${scene.emoji}</span>
      <span class="home-pick-copy"><b>${esc(scene.name)}</b><span>${esc(scene.habitat || 'Biome')}</span></span>
    </button>`;
  }).join('');
  const { close } = openSheet({
    title: `Move ${esc(displayName(s))}`,
    sub: 'Pick the biome behind their window. The room stays theirs alone either way.',
    body: `<div class="home-pick-actions">
        <button class="btn btn-soft btn-sm" data-home-auto>${autoScene.emoji} Type home · ${esc(autoScene.name)}</button>
      </div>
      <div class="home-pick-grid">${cards}</div>`,
    onMount: (root) => {
      root.querySelector('[data-home-auto]')?.addEventListener('click', () => {
        Actions.setHome(spriteId, null);
        Sfx.click();
        close();
        if (onDone) onDone();
      });
      root.querySelectorAll('[data-home-scene]').forEach((btn) => {
        btn.addEventListener('click', () => {
          Actions.setHome(spriteId, btn.dataset.homeScene);
          Sfx.click();
          close();
          if (onDone) onDone();
        });
      });
    },
  });
}

function openHomesSheet() {
  const total = homesLiving().length + homesRetired().length + homesReturning().length;
  let homeFilter = 'all';
  let homeGrids = [];
  const clearGrids = () => {
    homeGrids.forEach((grid) => grid.clear());
    homeGrids = [];
  };
  const { close } = openSheet({
    title: '🪟 Sprite Homes',
    sub: total
      ? `${total} window${total === 1 ? '' : 's'} — sprites at home keep their own room and biome, while everyone not at home shares the Hollow.`
      : 'Every sprite gets its own room and biome here.',
    body: `<div class="hv-enter"><button class="btn btn-primary btn-block" data-homes-view>🏡 Home view</button><button class="btn btn-soft btn-block" data-homes-senthome>🏠 Sent home</button><button class="btn btn-ghost btn-block" data-home-facades>🏡 Species facades: ${state.theme.speciesFacades === false ? 'off' : 'on'}</button></div>
      <div data-homes-body>${homesBody()}</div>`,
    onMount: (root) => {
      const repaint = () => {
        const body = root.querySelector('[data-homes-body]');
        if (!body) return;
        clearGrids();
        body.innerHTML = homesBody(homeFilter);
        homeGrids = mountHomesBody(body, homeFilter);
      };
      root.querySelector('[data-homes-senthome]')?.addEventListener('click', () => { close(); App.go('senthome'); });
      root.querySelector('[data-homes-view]')?.addEventListener('click', () => { close(); App.go('home'); });
      root.querySelector('[data-home-facades]')?.addEventListener('click', (event) => {
        const show = state.theme.speciesFacades === false;
        Actions.setTheme({ speciesFacades: show });
        Sfx.click();
        event.currentTarget.textContent = `🏡 Species facades: ${show ? 'on' : 'off'}`;
        repaint();
      });
      // The sheet element stops propagation, so delegate from it, not the overlay.
      const sheetEl = root.querySelector('.sheet') || root;
      sheetEl.addEventListener('click', (e) => {
        const filter = e.target.closest('[data-home-filter]');
        if (filter) {
          e.stopPropagation();
          homeFilter = filter.dataset.homeFilter;
          Sfx.click();
          repaint();
          return;
        }
        const toggle = e.target.closest('[data-home-toggle]');
        if (toggle) {
          e.stopPropagation();
          const sprite = findSprite(toggle.dataset.homeToggle);
          if (!sprite) return;
          if (sprite.atHome) {
            const res = Actions.callBack(sprite.id);
            if (res.ok) toast(`${res.coins ? `+${res.coins} coins, and ` : ''}${displayName(sprite)} is back in the Hollow.`, '🐾');
          } else {
            Actions.sendHome(sprite.id);
            toast(`${displayName(sprite)} is home in ${SCENES[homeSceneFor(sprite)]?.name || 'their biome'}.`, '🏡');
          }
          Sfx.click();
          repaint();
          if (App.tab === 'hollow') App.refresh();
          return;
        }
        const change = e.target.closest('[data-home-change]');
        if (change) {
          e.stopPropagation();
          openHomeScenePicker(change.dataset.homeChange, repaint);
          return;
        }
        const care = e.target.closest('[data-home-care]');
        if (care) {
          e.stopPropagation();
          homeCareAction(care.dataset.homeId, care.dataset.homeCare, repaint);
          return;
        }
        const warm = e.target.closest('[data-home-warm]');
        if (warm) {
          e.stopPropagation();
          const id = warm.dataset.homeWarm;
          close();
          setTimeout(() => App.openHatch(id), 40);
          return;
        }
        const visit = e.target.closest('[data-home-visit]');
        if (visit) {
          e.stopPropagation();
          const sprite = findSprite(visit.dataset.homeVisit);
          if (!sprite) return;
          const key = homeSceneFor(sprite);
          const scene = SCENES[key];
          if (!scene) return;
          if (!homeScenePool().includes(key) && !(state.unlockedScenes || []).includes(key)) {
            toast(`${scene.name} has not opened yet.`, '🔒');
            return;
          }
          /* A home visit is one sprite, one environment at a time. The main
             Hollow is only for sprites that are not at home. */
          close();
          setTimeout(() => openOneOnOne(sprite.id, null), 40);
          toast(`${scene.emoji} ${scene.name} · visiting ${displayName(sprite)} at home.`, '🪟');
          return;
        }
        const card = e.target.closest('[data-home-card]');
        if (card) {
          const id = card.dataset.homeCard;
          close();
          if (card.dataset.homeKind === 'egg') {
            setTimeout(() => App.openHatch(id), 40);
            return;
          }
          setTimeout(() => App.openDetail(id), 40);
        }
      });
      repaint();
    },
    onClose: clearGrids,
  });
}
