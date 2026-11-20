/* Furniture inventory: the catalogue screen from the home UI wireframes.
   Reads the same decor pieces and room layout the rooms render, and writes
   placements back through Actions.setRoomPiece. */

let fvFilter = 'all';
let fvCategory = 'all';
let fvQuery = '';

/* Newly discovered pieces: a session-only one-shot, so the gold glow never
   re-fires for a duplicate and clears as soon as the card is opened. */
const fvFresh = new Set();

function furnitureFresh(piece) {
  return !!piece && fvFresh.has(piece.id);
}

/* "Upgrade ready": not owned yet, but whatever it needs is already installed. */
function furnitureUpgradeReady(piece) {
  if (!piece || piece.owned) return false;
  if (!piece.requires) return true;
  return typeof homeUpgradeOwned === 'function' && homeUpgradeOwned(piece.requires);
}

function furnitureCatalog() {
  const upgrades = (typeof HOME_UPGRADES !== 'undefined' ? Object.values(HOME_UPGRADES) : []).map((up) => ({
    id: up.id,
    name: up.name,
    icon: up.icon,
    blurb: up.blurb,
    free: !up.price,
    tier: up.requires ? 2 : 1,
    owned: typeof homeUpgradeOwned === 'function' ? homeUpgradeOwned(up.id) : false,
    requires: up.requires || null,
    price: up.price || 0,
    rarity: up.rarity || null,
    category: up.category || null,
  }));
  const free = (typeof HOME_FREE_DECOR !== 'undefined' ? HOME_FREE_DECOR : []).map((piece) => ({
    id: piece.id,
    name: piece.name,
    icon: piece.icon,
    blurb: 'Always yours — no purchase needed.',
    free: true,
    tier: 0,
    owned: true,
    requires: null,
    price: 0,
    rarity: piece.rarity || 'common',
    category: piece.category || 'Free decor',
  }));
  return [...upgrades, ...free];
}

/* Upgrades write the singular 'Feature' and free decor the plural, so both
   spellings collapse into one chip instead of two near-identical filters. */
function furnitureCategory(piece) {
  const name = piece.category || (piece.free ? 'Free decor' : 'Room');
  return name === 'Feature' ? 'Features' : name;
}

function furniturePlaced(piece) {
  const layout = state.roomLayout && state.roomLayout[piece.id];
  return !!(piece.owned && layout && !layout.hidden);
}

function furnitureHidden(piece) {
  const layout = state.roomLayout && state.roomLayout[piece.id];
  return !!(piece.owned && layout && layout.hidden);
}

function furnitureSpotLabel(piece) {
  const layout = state.roomLayout && state.roomLayout[piece.id];
  if (!piece.owned) return 'Locked';
  if (!layout) return 'Not placed';
  if (layout.hidden) return 'Tucked away';
  return ['Left wall', 'Centre', 'Right wall'][homeDecorSpot(piece.id)];
}

function furnitureMatches(piece) {
  const q = fvQuery.trim().toLowerCase();
  if (q && !(`${piece.name} ${furnitureCategory(piece)} ${piece.blurb}`.toLowerCase().includes(q))) return false;
  if (fvCategory !== 'all' && furnitureCategory(piece) !== fvCategory) return false;
  if (fvFilter === 'placed') return furniturePlaced(piece);
  if (fvFilter === 'hidden') return furnitureHidden(piece);
  if (fvFilter === 'owned') return piece.owned;
  if (fvFilter === 'locked') return !piece.owned;
  if (fvFilter === 'free') return piece.free;
  return true;
}

/* Every piece carries a category, so the chip row is built from the catalogue
   rather than a hard-coded list; a new piece's category appears by itself. */
function furnitureCategories() {
  const counts = new Map();
  furnitureCatalog().forEach((piece) => {
    const name = furnitureCategory(piece);
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function furnitureCounts() {
  const all = furnitureCatalog();
  return {
    all: all.length,
    owned: all.filter((p) => p.owned).length,
    placed: all.filter(furniturePlaced).length,
    hidden: all.filter(furnitureHidden).length,
    locked: all.filter((p) => !p.owned).length,
    free: all.filter((p) => p.free).length,
  };
}

/* Rarity frames and card states, from the home UI wireframes (4.14, 4.15).
   Every piece carries its own rarity and category; the fallback only covers
   data written before those fields existed. */
function furnitureRarity(piece) {
  return piece.rarity || (piece.tier === 2 ? 'rare' : piece.free ? 'common' : 'uncommon');
}

function furnitureRarityStyle(piece) {
  const key = furnitureRarity(piece);
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[key] : null;
  return { key, name: style ? style.name : key, icon: style ? style.icon : '⚪', color: style ? style.color : '#C9CDD2' };
}

function furnitureFavorite(piece) {
  return Array.isArray(state.furnitureFavorites) && state.furnitureFavorites.includes(piece.id);
}

/* One function decides the card's state so every surface agrees. Precedence
   follows the wireframe (4.14): ready/locked first, then new, placed, favorite. */
function furnitureCardState(piece) {
  if (!piece.owned) {
    if (furnitureUpgradeReady(piece)) return { key: 'ready', label: 'Upgrade ready', icon: '⬆️' };
    return { key: 'locked', label: 'Locked', icon: '🔒' };
  }
  if (furnitureFresh(piece)) return { key: 'new', label: 'New!', icon: '🌸' };
  if (furniturePlaced(piece)) return { key: 'placed', label: 'Placed', icon: '✅' };
  if (furnitureFavorite(piece)) return { key: 'favorited', label: 'Favorite', icon: '⭐' };
  if (furnitureHidden(piece)) return { key: 'hidden', label: 'Tucked away', icon: '🙈' };
  return { key: 'owned', label: 'Owned', icon: '📦' };
}

/* At most three overlays; the rest belong on the detail card. */
function furnitureOverlays(piece) {
  const list = [];
  if (furnitureFresh(piece)) list.push(['🌸', 'New']);
  if (furniturePlaced(piece)) list.push(['✅', 'Placed']);
  if (furnitureFavorite(piece)) list.push(['⭐', 'Favorite']);
  if (!piece.owned) list.push(furnitureUpgradeReady(piece) ? ['⬆️', 'Upgrade ready'] : ['🔒', 'Locked']);
  else if (furnitureHidden(piece)) list.push(['🙈', 'Tucked away']);
  return list.slice(0, 3);
}

function furnitureCard(piece) {
  const rarity = furnitureRarityStyle(piece);
  const cardState = furnitureCardState(piece);
  const overlays = furnitureOverlays(piece);
  const spots = ['a', 'b', 'c'];
  return `<button class="fv-card is-${cardState.key} fv-r-${rarity.key}" style="--fv-rarity:${rarity.color}" type="button" data-fv-piece="${piece.id}" data-rarity="${rarity.key}" aria-label="${esc(piece.name)}, ${rarity.name}, ${cardState.label}${overlays.length ? `, ${overlays.map(([, label]) => label).join(', ')}` : ''}, ${furnitureSpotLabel(piece)}">
    ${overlays.map(([icon, label], i) => `<span class="fv-badge ${spots[i]}" aria-label="${label}">${icon}</span>`).join('')}
    <span class="fv-art" aria-hidden="true">${piece.icon}</span>
    <span class="fv-name">${esc(piece.name)}</span>
    <span class="fv-meta"><span class="fv-rarity">${rarity.icon} ${rarity.name}</span> · ${furnitureCategory(piece)}</span>
    <span class="fv-tags"><span class="fv-tag ${cardState.key}">${cardState.icon} ${cardState.label}</span><span class="fv-tag spot">${furnitureSpotLabel(piece)}</span></span>
  </button>`;
}

function furnitureGrid() {
  const rows = furnitureCatalog().filter(furnitureMatches);
  if (!rows.length) {
    return `<div class="fv-empty"><span aria-hidden="true">📦</span><p>No furniture matches that filter.</p><button class="btn btn-soft btn-sm" type="button" data-fv-reset>Show everything</button></div>`;
  }
  return `<div class="fv-grid">${rows.map(furnitureCard).join('')}</div>`;
}

function furniturePanel() {
  const counts = furnitureCounts();
  const chips = [
    ['all', 'All'], ['placed', 'Placed'], ['hidden', 'Hidden'],
    ['owned', 'Owned'], ['locked', 'Locked'], ['free', 'Free'],
  ];
  return `<div class="fv-toolbar">
      <label class="fv-search"><span aria-hidden="true">🔍</span><input type="search" data-fv-search value="${esc(fvQuery)}" placeholder="Search furniture, rooms, colours…" aria-label="Search furniture"></label>
      <div class="fv-chips" role="group" aria-label="Filter furniture">
        ${chips.map(([id, label]) => `<button class="chip fv-chip ${fvFilter === id ? 'on' : ''}" type="button" data-fv-filter="${id}" aria-pressed="${fvFilter === id}">${label} · ${counts[id]}</button>`).join('')}
      </div>
      ${furnitureCategories().length > 1 ? `<div class="fv-chips fv-cats" role="group" aria-label="Filter by category">
        <button class="chip fv-chip ${fvCategory === 'all' ? 'on' : ''}" type="button" data-fv-cat="all" aria-pressed="${fvCategory === 'all'}">All categories</button>
        ${furnitureCategories().map(([name, count]) => `<button class="chip fv-chip ${fvCategory === name ? 'on' : ''}" type="button" data-fv-cat="${esc(name)}" aria-pressed="${fvCategory === name}">${esc(name)} · ${count}</button>`).join('')}
      </div>` : ''}
      <p class="tiny muted fv-capacity">📦 ${counts.owned} owned · ✅ ${counts.placed} placed · 🙈 ${counts.hidden} tucked away · 🔒 ${counts.locked} locked</p>
    </div>
    <div data-fv-grid>${furnitureGrid()}</div>`;
}

function openFurniturePiece(id, repaint) {
  const piece = furnitureCatalog().find((p) => p.id === id);
  if (!piece) return;
  /* Opening the card is the cue: locked taps hum, a new piece plays its rarity
     unlock, and the new flag is spent so it never fires twice. */
  if (!piece.owned) Sfx.furniture('locked');
  else if (furnitureFresh(piece)) {
    fvFresh.delete(id);
    Sfx.furniture(`unlock-${furnitureRarity(piece)}`);
  }
  const spot = homeDecorSpot(id);
  const hidden = furnitureHidden(piece);
  const layout = state.roomLayout && state.roomLayout[id];
  const ref = piece.requires ? HOME_UPGRADES[piece.requires] : null;
  openSheet({
    title: `${piece.icon} ${piece.name}`,
    sub: `${furnitureCategory(piece)}${piece.tier === 2 ? ' · tier 2' : ''} · ${furnitureSpotLabel(piece)}`,
    body: `<p class="small muted" style="line-height:1.5">${esc(piece.blurb)}</p>
      ${piece.owned
        ? `<div class="fv-detail">
            <div class="fv-detail-row"><span class="tiny muted">Spot</span>
              ${['Left', 'Centre', 'Right'].map((label, index) => `<button class="btn btn-sm ${!hidden && index === spot ? 'btn-gold' : 'btn-ghost'}" type="button" data-fv-spot="${index}" aria-pressed="${!hidden && index === spot}">${label}</button>`).join('')}
            </div>
            <button class="btn ${hidden ? 'btn-gold' : 'btn-soft'} btn-block" type="button" data-fv-hide>${hidden ? 'Bring back into the room' : 'Tuck away for now'}</button>
            <button class="btn btn-ghost btn-block" type="button" data-fv-fav>${furnitureFavorite(piece) ? '⭐ Favorited — remove' : '⭐ Mark as favorite'}</button>
            <button class="btn btn-ghost btn-block" type="button" data-fv-decorate>🛋️ Open the full decorator</button>
          </div>`
        : `<div class="fv-detail">
            <p class="tiny muted">${ref ? `Buy ${esc(ref.name)} first.` : 'Available from Build.'}</p>
            <button class="btn btn-gold btn-block" type="button" data-fv-buy ${ref ? `data-fv-locked-by="${piece.requires}"` : ''}>${piece.price ? `🪙 ${piece.price.toLocaleString()}` : 'Free'} · Add to my rooms</button>
          </div>`}`,
    onMount: (overlay) => {
      const root = overlay.querySelector('.sheet') || overlay;
      root.addEventListener('click', (event) => {
        const spotBtn = event.target.closest('[data-fv-spot]');
        if (spotBtn) {
          const res = Actions.setRoomPiece(id, { spot: Number(spotBtn.dataset.fvSpot), hidden: false });
          if (res.ok) { Sfx.furniture('placed'); toast(`${piece.name} moved to the ${['left wall', 'centre', 'right wall'][Number(spotBtn.dataset.fvSpot)]}.`, '🛋️'); }
          repaint(); repaintSheet();
          return;
        }
        if (event.target.closest('[data-fv-hide]')) {
          const tucking = !homeDecorHidden(id);
          Actions.setRoomPiece(id, { hidden: tucking });
          Sfx.furniture(tucking ? 'stow' : 'placed');
          repaint(); repaintSheet();
          return;
        }
        if (event.target.closest('[data-fv-fav]')) {
          const res = Actions.toggleFurnitureFavorite(id);
          if (res.ok) { Sfx.furniture('favorite'); const btn = event.target.closest('[data-fv-fav]'); if (btn) btn.textContent = res.favorite ? '⭐ Favorited — remove' : '⭐ Mark as favorite'; }
          repaint();
          return;
        }
        if (event.target.closest('[data-fv-decorate]')) {
          if (typeof closeAllOverlays === 'function') closeAllOverlays();
          if (typeof openRoomDecorator === 'function') openRoomDecorator(repaint);
          return;
        }
        if (event.target.closest('[data-fv-buy]')) {
          const res = Actions.buyHomeUpgrade(id);
          if (!res.ok) {
            toast(res.reason === 'requires' ? `Needs ${HOME_UPGRADES[res.missing]?.name || 'another room upgrade'} first.` : res.reason === 'coins' ? `You need ${(res.need || 0).toLocaleString()} more coins.` : 'That is already yours.', '🛠️');
            Sfx.error();
          } else {
            fvFresh.add(id);
            Sfx.furniture(`unlock-${furnitureRarity(piece)}`);
            toast(`${res.upgrade.name} installed in every room.`, '🛠️');
          }
          repaint(); repaintSheet();
        }
      });
    },
  });
  function repaintSheet() {
    const overlay = document.querySelector('.overlay');
    if (!overlay) return;
    const sub = overlay.querySelector('.sheet-sub');
    const pieceNow = furnitureCatalog().find((p) => p.id === id);
    if (sub && pieceNow) sub.textContent = `${furnitureCategory(pieceNow)}${pieceNow.tier === 2 ? ' · tier 2' : ''} · ${furnitureSpotLabel(pieceNow)}`;
  }
}

function furnitureScreen(root) {
  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Your collection</div><h1>Furniture</h1><p>Everything you own, where it sits, and what is still locked.</p></div>
      <button class="icon-btn" data-fv-home aria-label="Back to Home">🏡</button>
    </div>
    <div data-fv-body>${furniturePanel()}</div>`;

  /* A ready upgrade pings once when the grid opens; Sfx throttles it to 8 s. */
  if (furnitureCatalog().some(furnitureUpgradeReady)) Sfx.furniture('upgrade-ready');

  const body = root.querySelector('[data-fv-body]');
  const paint = () => {
    const grid = body.querySelector('[data-fv-grid]');
    if (grid) grid.innerHTML = furnitureGrid();
    const chips = body.querySelectorAll('[data-fv-filter]');
    chips.forEach((chip) => {
      const id = chip.dataset.fvFilter;
      chip.classList.toggle('on', fvFilter === id);
      chip.setAttribute('aria-pressed', fvFilter === id ? 'true' : 'false');
    });
    body.querySelectorAll('[data-fv-cat]').forEach((chip) => {
      const id = chip.dataset.fvCat;
      chip.classList.toggle('on', fvCategory === id);
      chip.setAttribute('aria-pressed', fvCategory === id ? 'true' : 'false');
    });
    const cap = body.querySelector('.fv-capacity');
    const counts = furnitureCounts();
    if (cap) cap.textContent = `📦 ${counts.owned} owned · ✅ ${counts.placed} placed · 🙈 ${counts.hidden} tucked away · 🔒 ${counts.locked} locked`;
  };

  const onClick = (event) => {
    if (event.target.closest('[data-fv-home]')) { Sfx.click(); App.go('home'); return; }
    const chip = event.target.closest('[data-fv-filter]');
    if (chip) { fvFilter = chip.dataset.fvFilter; Sfx.click(); paint(); return; }
    const catChip = event.target.closest('[data-fv-cat]');
    if (catChip) { fvCategory = catChip.dataset.fvCat; Sfx.click(); paint(); return; }
    if (event.target.closest('[data-fv-reset]')) { fvFilter = 'all'; fvCategory = 'all'; fvQuery = ''; const input = body.querySelector('[data-fv-search]'); if (input) input.value = ''; Sfx.click(); paint(); return; }
    const card = event.target.closest('[data-fv-piece]');
    if (card) { Sfx.click(); openFurniturePiece(card.dataset.fvPiece, paint); }
  };

  const onInput = (event) => {
    const input = event.target.closest('[data-fv-search]');
    if (!input) return;
    fvQuery = input.value;
    paint();
  };

  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('input', onInput);
    Sfx.stopFurniture();
  };
}
