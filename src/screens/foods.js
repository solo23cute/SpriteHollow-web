/* Pantry field guide: every food and snack, how to get it, and what it does. */

function foodsScreen(root) {
  let cat = 'all';
  let query = '';
  let stockOnly = false;
  const items = [
    ...FOOD_KEYS.map((key) => ({ kind: 'food', key, item: FOODS[key] })),
    ...SNACK_KEYS.map((key) => ({ kind: 'snack', key, item: SNACKS[key] })),
  ];
  const categoryStock = (id) => items.reduce((total, entry) => total
    + (entry.kind === 'food' && entry.item.cat === id ? foodCount(entry.key) : 0), 0);
  const categoryOrder = Object.keys(FOOD_CATEGORIES)
    .sort((a, b) => categoryStock(b) - categoryStock(a));
  const snackStock = SNACK_KEYS.reduce((total, key) => total + snackCount(key), 0);
  const categoryButtons = [
    { id: 'snack', icon: '🍪', name: 'Snacks', stock: snackStock },
    ...categoryOrder.map((id) => ({ id, ...FOOD_CATEGORIES[id], stock: categoryStock(id) })),
  ].sort((a, b) => b.stock - a.stock || (a.id === 'snack' ? -1 : b.id === 'snack' ? 1 : 0));

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Pantry field guide</div><h1>Food &amp; snacks</h1><p data-food-count></p></div>
      <button class="btn btn-sm btn-soft" data-back-sprites>${icon('sprites')} Sprites</button>
    </div>
    <div class="type-tools" style="margin-top:2px">
      <input class="type-search" type="search" data-food-search placeholder="Search food, regions, snacks…" aria-label="Search food, regions, and snacks" autocomplete="off">
      <div class="type-rarities" style="margin-top:8px">
        <button class="chip type-rarity on" data-food-cat="all">All</button>
        ${categoryButtons.map((c) => `<button class="chip type-rarity" data-food-cat="${c.id}">${c.icon} ${c.name}</button>`).join('')}
        <button class="chip type-rarity" data-food-cat="world">🌍 World</button>
        <button class="chip type-rarity" data-food-cat="anime">🍥 Anime</button>
        <button class="chip type-rarity" data-food-cat="trainer">⚡ Trainer</button>
      </div>
      <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">
        <button class="chip type-rarity" data-food-stock>🧺 In pantry</button>
        <span class="tiny muted" data-food-shown style="align-self:center"></span>
      </div>
    </div>
    <div class="list-gap" data-food-list style="margin-top:12px"></div>
    <p class="tiny muted" data-food-empty hidden style="text-align:center;margin:16px 4px">No food or snack matches that search.</p>
    <div class="card" style="padding:12px;margin-top:16px;font-size:11px;line-height:1.6;color:var(--muted)">
      <b style="color:var(--text)">Where things come from.</b> Market foods are bought with coins in the Hollow feed sheet. Monthly foods unlock one at a time from the first Friday crate you open each month. Snacks are always free — the first check-in each day stocks a pantry food, and check-ins and gifts can drop snacks.
    </div>`;

  const list = root.querySelector('[data-food-list]');
  const empty = root.querySelector('[data-food-empty]');
  const count = root.querySelector('[data-food-count]');
  const shown = root.querySelector('[data-food-shown]');
  const search = root.querySelector('[data-food-search]');
  const foodLazy = new LazyGrid(list, { batchSize: 18, rootMargin: '700px 0px', virtual: true, windowSize: 90 });
  list.addEventListener('click', (event) => {
    const btn = event.target instanceof Element ? event.target.closest('[data-food-item]') : null;
    if (btn) openFoodDetail(btn.dataset.kind, btn.dataset.foodItem);
  });

  const stockOf = (entry) => entry.kind === 'snack' ? snackCount(entry.key) : foodCount(entry.key);
  const catName = (entry) => entry.kind === 'snack'
    ? `Snack · ${entry.item.cat ? entry.item.cat[0].toUpperCase() + entry.item.cat.slice(1) : 'Free'}`
    : FOOD_CATEGORIES[entry.item.cat]?.name || 'Food';
  const themeName = (entry) => entry.item.anime ? 'Anime menu' : entry.item.trainer ? 'Trainer pantry' : '';
  const regionName = (entry) => entry.kind === 'food' && entry.item.region
    ? WORLD_FOOD_REGIONS[entry.item.region]?.name || ''
    : '';
  const recipeOf = (entry) => entry.kind === 'food' && typeof cafeRecipeForFood === 'function'
    ? cafeRecipeForFood(entry.key) : null;
  const recipeLocked = (entry) => {
    const recipe = recipeOf(entry);
    return !!recipe && !cafeRecipeUnlocked(entry.key);
  };
  const isLocked = (entry) => (entry.kind === 'food' && entry.item.monthly && !(state.foodUnlocks || []).includes(entry.key))
    || recipeLocked(entry);
  const sourceOf = (entry) => {
    if (entry.kind === 'snack') return 'check-ins & gifts';
    if (entry.item.giftOnly) return 'arcade bonus & month gifts';
    if (recipeLocked(entry)) return `recipe · finish ${recipeOf(entry).title}`;
    if (isLocked(entry)) return 'first Friday crate · locked';
    if (entry.item.monthly) return 'first Friday crate';
    return `${entry.item.price} coins · market`;
  };
  const dietTag = (key) => {
    const diet = FOOD_DIET[key];
    return diet ? ` · ${DIET_PATHS[diet.path].icon} ${DIET_PATHS[diet.path].label}` : '';
  };
  const cuisineTag = (key) => FOODS[key]?.region ? ' · 🌍 World Kitchen' : '';

  function matches(entry) {
    const q = query.trim().toLowerCase();
    if (q && !`${entry.item.name} ${entry.item.desc} ${catName(entry)} ${regionName(entry)}`.toLowerCase().includes(q)) return false;
    if (cat === 'snack' && entry.kind !== 'snack') return false;
    if (cat === 'world' && (entry.kind !== 'food' || !entry.item.region)) return false;
    if (cat === 'anime' && !entry.item.anime) return false;
    if (cat === 'trainer' && !entry.item.trainer) return false;
    if (cat !== 'all' && cat !== 'snack' && cat !== 'world' && cat !== 'anime' && cat !== 'trainer' && (entry.kind !== 'food' || entry.item.cat !== cat)) return false;
    if (stockOnly && stockOf(entry) < 1) return false;
    return true;
  }

  function cardHTML(entry) {
    const item = entry.item;
    const stock = stockOf(entry);
    const locked = isLocked(entry);
    return `<button class="food-card" data-food-item="${entry.key}" data-kind="${entry.kind}" style="text-align:left">
      <span class="food-emoji">${locked ? '🔒' : item.emoji}</span>
      <span style="flex:1;min-width:0">
        <h4>${esc(item.name)}</h4>
        <p>${esc(item.desc)}${dietTag(entry.key)}${entry.kind === 'food' ? cuisineTag(entry.key) : ''}</p>
        <div class="tiny muted" style="margin-top:3px">${catName(entry)}${themeName(entry) ? ` · ${themeName(entry)}` : ''}${regionName(entry) ? ` · ${regionName(entry)}` : ''} · ${sourceOf(entry)}${stock ? ` · pantry ×${stock}` : ''}</div>
      </span>
      ${stock ? `<span class="price snack-count">×${stock}</span>` : ''}
    </button>`;
  }

  function paint() {
    const listItems = items.filter(matches);
    foodLazy.reset(listItems, cardHTML);
    empty.hidden = listItems.length !== 0;
    shown.textContent = `${listItems.length} match${listItems.length === 1 ? '' : 'es'}`;
    count.textContent = `${FOOD_KEYS.length} foods · ${SNACK_KEYS.length} snacks · ${foodTotal() + snackTotal()} in pantry`;
  }

  root.querySelector('[data-back-sprites]').addEventListener('click', () => App.go('collection'));
  search.addEventListener('input', () => {
    query = search.value;
    paint();
  });
  root.querySelectorAll('[data-food-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      cat = btn.dataset.foodCat;
      root.querySelectorAll('[data-food-cat]').forEach((b) => b.classList.toggle('on', b === btn));
      paint();
    });
  });
  root.querySelector('[data-food-stock]').addEventListener('click', (e) => {
    stockOnly = !stockOnly;
    e.currentTarget.classList.toggle('on', stockOnly);
    paint();
  });

  paint();
  return () => foodLazy.clear();
}

function openFoodDetail(kind, key) {
  const item = kind === 'snack' ? SNACKS[key] : FOODS[key];
  if (!item) return;
  const isSnack = kind === 'snack';
  const stock = isSnack ? snackCount(key) : foodCount(key);
  const recipe = !isSnack && typeof cafeRecipeForFood === 'function' ? cafeRecipeForFood(key) : null;
  const recipeLocked = !!recipe && !cafeRecipeUnlocked(key);
  const locked = (!isSnack && item.monthly && !(state.foodUnlocks || []).includes(key)) || recipeLocked;
  const isCandy = !isSnack && typeof CANDY_ITEMS !== 'undefined' && CANDY_ITEMS.includes(key);
  const diet = FOOD_DIET[key];
  const active = typeof activeSprite === 'function' ? activeSprite() : null;
  const favorite = !!active && isFavoriteFood(active, key);
  const cuisine = !isSnack && item.region ? CUISINE_PATHS[item.region] : null;
  const category = isSnack
    ? `Snack · ${item.cat ? item.cat[0].toUpperCase() + item.cat.slice(1) : 'Free'}`
    : FOOD_CATEGORIES[item.cat]?.name || 'Food';
  const theme = item.anime ? 'Anime menu' : item.trainer ? 'Trainer pantry' : '';
  const region = !isSnack && item.region ? WORLD_FOOD_REGIONS[item.region]?.name || '' : '';
  const effectChips = [
    item.hunger ? `<span class="chip">🍽️ +${item.hunger} food</span>` : '',
    item.energy ? `<span class="chip">⚡ +${item.energy} rest</span>` : '',
    item.joy ? `<span class="chip">💛 +${item.joy} joy</span>` : '',
    item.clean ? `<span class="chip">🫧 ${item.clean > 0 ? '+' : ''}${item.clean} clean</span>` : '',
    item.bond ? `<span class="chip">🔗 +${item.bond} bond</span>` : '',
    item.xp ? `<span class="chip">✨ +${item.xp} XP</span>` : '',
    item.stageBoost ? '<span class="chip chip-exotic">🌟 next growth stage</span>' : '',
    cuisine ? `<span class="chip">${cuisine.icon} ${esc(cuisine.label)} cuisine +${Number(item.cuisine) || 1}</span>` : '',
    favorite ? '<span class="chip">💛 favourite · extra point</span>' : '',
  ].filter(Boolean).join('');
  const source = isSnack
    ? 'Snacks are free. Check-ins and gifts can drop them, and the first check-in each day always stocks a pantry food.'
    : item.stageBoost
      ? 'A Starpath Feast is awarded by the arcade bonus track and month gifts. Feed it from the pantry to carry the active sprite to its next growth milestone (5, 10, 100, 250, 500, or 1,000). It is not sold in the market.'
    : recipeLocked
      ? `${recipe.hint} The first clear stocks one free ${esc(item.name)}; after that, buy more for ${item.price} coins in the market.`
      : locked
        ? 'This monthly food is still sealed. Open the first Friday crate of the month on Today — one crate per calendar month unlocks the next food and stocks two of it.'
        : item.monthly
          ? `${esc(item.name)} is unlocked. Buy more for ${item.price} coins from the market in the Hollow feed sheet.`
          : `Buy it for ${item.price} coins from the market in the Hollow feed sheet. It keeps in the pantry until you feed it to someone.`;
  const action = item.stageBoost ? 'Open Play' : recipeLocked ? 'Open Play' : isSnack || locked ? 'Open Today' : 'Open the Hollow';

  openSheet({
    title: `${item.emoji} ${esc(item.name)}`,
    sub: `${category}${theme ? ` · ${theme}` : ''}${region ? ` · ${region}` : ''}${diet ? ` · ${DIET_PATHS[diet.path].icon} ${DIET_PATHS[diet.path].label} affinity +${diet.gain}` : ''}${cuisine ? ` · World Kitchen +${Number(item.cuisine) || 1}` : ''}`,
    body: `<div style="text-align:center;font-size:56px;margin:4px 0 10px">${item.emoji}</div>
      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px">
        <span class="chip">${category}</span>
        ${theme ? `<span class="chip">${theme}</span>` : ''}
        ${region ? `<span class="chip">🌍 ${region}</span>` : ''}
        <span class="chip">${stock ? `pantry ×${stock}` : 'not in pantry'}</span>
        ${locked ? '<span class="chip">🔒 locked</span>' : ''}
        ${recipe ? `<span class="chip">☕ recipe ${recipeLocked ? 'locked' : 'unlocked'}</span>` : ''}
        ${isCandy ? '<span class="chip">🍬 candy</span>' : ''}
      </div>
      <p class="small" style="text-align:center;color:var(--muted);margin:10px 4px 2px;line-height:1.55">${esc(item.desc)}</p>
      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px;margin-top:10px">${effectChips}</div>
      <div class="card" style="padding:12px;margin-top:12px;font-size:11.5px;line-height:1.6;color:var(--muted)">${source}</div>
      ${isCandy ? '<div class="card" style="padding:10px;margin-top:8px;font-size:11px;line-height:1.55;color:var(--muted)">🍬 <b style="color:var(--text)">Candy.</b> Feeding this builds sugar. At 3 sugar, it transforms into a candy species.</div>' : ''}
      ${cuisine ? `<div class="card" style="padding:10px;margin-top:8px;font-size:11px;line-height:1.55;color:var(--muted)">🌍 <b style="color:var(--text)">World Kitchen.</b> Every dish from ${esc(cuisine.label)} builds its cuisine. At level ${EVOLUTION_LEVEL}, ${EVOLUTION_AFFINITY} points unlocks the regional form${favorite ? '; this is the active sprite’s favourite, so it adds one extra point' : ''}.</div>` : ''}
      <button class="btn btn-primary btn-block" data-food-go style="margin-top:14px">${action}</button>`,
    onMount: (sheet, close) => {
      sheet.querySelector('[data-food-go]').addEventListener('click', () => {
        close();
        if (item.stageBoost || recipeLocked) {
          App.go('play');
        } else if (isSnack || locked) {
          App.go('today');
        } else {
          App.go('hollow');
          toast('Open the feed sheet from the care dock to shop the market.', '🧺');
        }
      });
    },
  });
}
