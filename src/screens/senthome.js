/* Sent Home: a room of their own where a sprite relaxes, eats, recovers,
   earns coins, sleeps long, and can share a house with a friend. */

const HOME_COIN_BASE_CAP = 320;
const HOUSE_BOND_MAX = 600;
const HOUSE_PLAY_COOLDOWN = 45 * 1000;
/* Room upgrades are a folded section; the open state survives repaints. */
let shUpgradesOpen = false;
/* Shared-house cards can unfold their room decor; open houses are remembered. */
const shHouseDecorOpen = new Set();
/* In-place decor picker: which house card shows it, and for which piece. */
let shDecorPicker = null;

/* Room upgrades: permanent buys that change how Sent Home works. */
const HOME_UPGRADES = {
  sunroom: {
    id: 'sunroom', name: 'Sunroom Bed', icon: '🛏️', price: 0,
    blurb: 'A proper bed by the window. Recovery and coin earning speed up for everyone at home.',
    rarity: 'uncommon', category: 'Bedroom',
    cap: 160, recovery: 1.25, coins: 1.2,
  },
  pantry: {
    id: 'pantry', name: 'Hearth Pantry', icon: '🧺', price: 0,
    blurb: 'A stocked pantry: sent-home sprites eat better, recover faster, and bank more coins.',
    rarity: 'uncommon', category: 'Kitchen',
    cap: 220, recovery: 1.45, coins: 1.4,
  },
  playroom: {
    id: 'playroom', name: 'Playroom Rug', icon: '🧶', price: 0,
    blurb: 'A soft rug and a toy basket. Shared-house hangouts pay more bond, joy, and coins.',
    rarity: 'uncommon', category: 'Playroom',
    recovery: 1.1, coins: 1.1, hangout: 1.4,
  },
  spareRoom: {
    id: 'spareRoom', name: 'Spare Bedroom', icon: '🚪', price: 0,
    blurb: 'A third bed in every shared house, so three sprites can build one family bond.',
    rarity: 'rare', category: 'Bedroom',
    slots: 3,
  },
  /* Tier two: bigger effects and visible decor in every room. */
  disco: {
    id: 'disco', name: 'Mirror Ball', icon: '🪩', price: 0, requires: 'playroom',
    blurb: 'A mirror ball over the rug. Hangouts pay much more bond, and every room throws a little light.',
    rarity: 'epic', category: 'Feature',
    hangout: 1.5, coins: 1.1,
  },
  aquarium: {
    id: 'aquarium', name: 'Glow Aquarium', icon: '🐠', price: 0, requires: 'sunroom',
    blurb: 'A glowing tank beside the bed. Sprites at home recover faster and bank more coins.',
    rarity: 'rare', category: 'Feature',
    cap: 90, recovery: 1.3,
  },
  garden: {
    id: 'garden', name: 'Rooftop Garden', icon: '🌿', price: 0, requires: 'pantry',
    blurb: 'A little green rooftop. Home coins arrive faster and the cap rises again.',
    rarity: 'epic', category: 'Feature',
    cap: 140, coins: 1.5,
  },
};


/* ---------- Species homes ---------- */
/* Every supported species grows its home inside the shared-room system:
   a theme, three tiers and two taps on separate cooldowns. Adding a species
   is a data entry here — no new screen, storage key or decor model. */
const SPECIES_HOMES = {
  sp_forest: {
    element: 'sp_forest', name: 'Leaf Puffle', title: 'Leaf Puffle home', icon: '🌳',
    wall: '#dff3d8', floor: '#9ac98a',
    facade: { icon: '🌳', name: 'Treehouse' },
    tiers: [
      { id: 'sapling', name: 'Sapling Grove', icon: '🌱', price: 0, blurb: 'A young grove with a moss bed and a first crop of berries.', tapCoins: 12, tapJoy: 7 },
      { id: 'heartwood', name: 'Heartwood Den', icon: '🌿', price: 850, requires: 'sapling', blurb: 'A hollow trunk with room to curl up. Fruit ripens faster and pays more.', tapCoins: 24, tapJoy: 9 },
      { id: 'worldtree', name: 'World Tree', icon: '🌳', price: 2800, requires: 'heartwood', blurb: 'A tree that reaches the sky. Every room in the Hollow feels it growing.', tapCoins: 42, tapJoy: 12 },
    ],
    taps: {
      fruit: { id: 'fruit', name: 'Harvest fruit', icon: '🍎', cooldown: 3 * 60 * 1000, coins: 2, hunger: 22, joy: 6 },
      canopy: { id: 'canopy', name: 'Shake the canopy', icon: '🍃', cooldown: 45 * 1000, coins: 1, hunger: 0, joy: 8, xp: 2 },
    },
  },
  sp_blossom: {
    element: 'sp_blossom', name: 'Blossom Puffle', title: 'Blossom Puffle home', icon: '🌸',
    wall: '#ffe6f2', floor: '#f3a9c9',
    facade: { icon: '🌸', name: 'Petal home' },
    tiers: [
      { id: 'bud', name: 'Petal Bud', icon: '🌷', price: 0, blurb: 'A warm windowsill and a first handful of petals.', tapCoins: 10, tapJoy: 8 },
      { id: 'garden', name: 'Blossom Garden', icon: '🌸', price: 780, requires: 'bud', blurb: 'A walled garden where every flower leans toward the door.', tapCoins: 22, tapJoy: 10 },
      { id: 'court', name: 'Petal Court', icon: '🌺', price: 2600, requires: 'garden', blurb: 'A little court of blossom trees, petals on every path.', tapCoins: 38, tapJoy: 13 },
    ],
    taps: {
      water: { id: 'water', name: 'Water the blooms', icon: '💧', cooldown: 2 * 60 * 1000, coins: 2, hunger: 0, joy: 9, xp: 2 },
      petals: { id: 'petals', name: 'Gather petals', icon: '🌸', cooldown: 60 * 1000, coins: 1, hunger: 12, joy: 5 },
    },
  },
  sp_frost: {
    element: 'sp_frost', name: 'Frost Puffle', title: 'Frost Puffle home', icon: '❄️',
    wall: '#e8f6ff', floor: '#a7d8f0',
    facade: { icon: '🏔️', name: 'Snow lodge' },
    tiers: [
      { id: 'snowdrift', name: 'Snowdrift Den', icon: '❄️', price: 0, blurb: 'A snug burrow under fresh powder, with a bed of packed snow.', tapCoins: 11, tapJoy: 7 },
      { id: 'glacier', name: 'Glacier Hollow', icon: '🧊', price: 900, requires: 'snowdrift', blurb: 'A blue cave of old ice. Snow gathers faster and pays better.', tapCoins: 23, tapJoy: 10 },
      { id: 'aurora', name: 'Aurora Palace', icon: '🌌', price: 3000, requires: 'glacier', blurb: 'A hall of ice under dancing lights. The whole Hollow feels the chill.', tapCoins: 41, tapJoy: 13 },
    ],
    taps: {
      snow: { id: 'snow', name: 'Gather snowflakes', icon: '🌨️', cooldown: 60 * 1000, coins: 1, hunger: 6, joy: 7 },
      spring: { id: 'spring', name: 'Meltwater spring', icon: '💧', cooldown: 3 * 60 * 1000, coins: 2, hunger: 20, joy: 6, xp: 2 },
    },
  },
  sp_moonmist: {
    element: 'sp_moonmist', name: 'Moonmist Puffle', title: 'Moonmist Puffle home', icon: '🌙',
    wall: '#eceaff', floor: '#b3b2ee',
    facade: { icon: '🌙', name: 'Moon temple' },
    tiers: [
      { id: 'burrow', name: 'Moonlit Burrow', icon: '🌙', price: 0, blurb: 'A soft burrow that catches the first of the moonlight.', tapCoins: 10, tapJoy: 8 },
      { id: 'glade', name: 'Silver Glade', icon: '🌫️', price: 820, requires: 'burrow', blurb: 'A misty clearing where moonbeams pool on the grass.', tapCoins: 22, tapJoy: 10 },
      { id: 'crescent', name: 'Crescent Court', icon: '🌜', price: 2700, requires: 'glade', blurb: 'A quiet court under a crescent moon, silver on every stone.', tapCoins: 39, tapJoy: 13 },
    ],
    taps: {
      dew: { id: 'dew', name: 'Collect moonfall dew', icon: '💧', cooldown: 60 * 1000, coins: 1, hunger: 14, joy: 6 },
      rise: { id: 'rise', name: 'Watch the moonrise', icon: '🌙', cooldown: 2.5 * 60 * 1000, coins: 2, hunger: 0, joy: 10, xp: 2 },
    },
  },
  sp_sunbeam: {
    element: 'sp_sunbeam', name: 'Sunbeam Puffle', title: 'Sunbeam Puffle home', icon: '☀️',
    wall: '#fff4d8', floor: '#f3c877',
    facade: { icon: '🌻', name: 'Sunmeadow' },
    tiers: [
      { id: 'sunspot', name: 'Sunspot Nook', icon: '☀️', price: 0, blurb: 'A warm patch of floor that never loses the light.', tapCoins: 11, tapJoy: 8 },
      { id: 'meadow', name: 'Sunmeadow', icon: '🌻', price: 860, requires: 'sunspot', blurb: 'A little meadow that turns to face the morning.', tapCoins: 23, tapJoy: 10 },
      { id: 'halo', name: 'Sunhalo Court', icon: '🌞', price: 2900, requires: 'meadow', blurb: 'A court of brass and gold, warm long after sunset.', tapCoins: 40, tapJoy: 13 },
    ],
    taps: {
      bask: { id: 'bask', name: 'Bask in the sun', icon: '☀️', cooldown: 60 * 1000, coins: 1, hunger: 0, joy: 9, xp: 1 },
      nectar: { id: 'nectar', name: 'Gather sun nectar', icon: '🍯', cooldown: 3 * 60 * 1000, coins: 2, hunger: 16, joy: 7, xp: 2 },
    },
  },
};
/* Legacy aliases: older state guards and the first slice still reference these. */
const LEAF_HOME_ELEMENT = 'sp_forest';
const LEAF_HOME_TIERS = SPECIES_HOMES.sp_forest.tiers;
const LEAF_HOME_TAPS = SPECIES_HOMES.sp_forest.taps;

function speciesHomeDef(element) {
  return SPECIES_HOMES[element] || null;
}

function speciesHomeSprite(s) {
  return !!s && !!speciesHomeDef(s.element) && s.stage !== 'egg' && !s.retired;
}

function speciesHomeTierFor(def, id) {
  return def.tiers.find((tier) => tier.id === id) || def.tiers[0];
}

function speciesHomeRecord(def, id) {
  const raw = state.speciesHomes && state.speciesHomes[id];
  if (raw && typeof raw === 'object') {
    return { tier: speciesHomeTierFor(def, raw.tier).id, taps: { ...(raw.taps || {}) } };
  }
  /* Saves written before the registry kept leaf cooldowns in leafHomes. */
  const legacy = def.element === 'sp_forest' ? state.leafHomes && state.leafHomes[id] : null;
  if (legacy && typeof legacy === 'object') {
    return { tier: speciesHomeTierFor(def, legacy.tier).id, taps: { fruit: Number(legacy.lastFruit) || 0, canopy: Number(legacy.lastCanopy) || 0 } };
  }
  return { tier: def.tiers[0].id, taps: {} };
}

function speciesHomeReadyIn(rec, tap) {
  return Math.max(0, (Number(rec.taps && rec.taps[tap.id]) || 0) + tap.cooldown - Date.now());
}

function leafCooldownLabel(ms) {
  const total = Math.ceil(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return min ? `${min}m ${String(sec).padStart(2, '0')}s` : `${sec}s`;
}

function speciesHomeCard(s, def) {
  const rec = speciesHomeRecord(def, s.id);
  const tier = speciesHomeTierFor(def, rec.tier);
  const away = !s.atHome;
  const ownedIndex = def.tiers.findIndex((step) => step.id === rec.tier);
  const taps = Object.values(def.taps).map((tap) => {
    const left = speciesHomeReadyIn(rec, tap);
    return `<button class="btn btn-sm ${left ? 'btn-ghost' : 'btn-gold'}" type="button" data-leaf-tap="${tap.id}" data-leaf-id="${s.id}" ${away ? 'disabled' : ''}>${tap.icon} ${tap.name}${left ? ` · ${leafCooldownLabel(left)}` : ''}</button>`;
  }).join('');
  const tiers = def.tiers.map((step, index) => {
    if (index <= ownedIndex) return `<span class="chip sh-leaf-owned">${step.icon} ${esc(step.name)} ✓</span>`;
    const next = index === ownedIndex + 1;
    return `<button class="btn btn-sm ${next && state.coins >= step.price ? 'btn-gold' : 'btn-ghost'}" type="button" data-leaf-buy="${step.id}" data-leaf-id="${s.id}" ${next ? '' : 'disabled'} title="${esc(step.blurb)}">${step.icon} ${esc(step.name)} · 🪙 ${step.price.toLocaleString()}</button>`;
  }).join('');
  return `<article class="sh-leaf ${away ? 'is-away' : ''}">
    <div class="sh-leaf-art" style="background:linear-gradient(180deg, ${def.wall}, ${def.floor})">
      <span class="room-wash" aria-hidden="true"></span>
      ${homeDecorLayer()}
      <span class="sh-leaf-tree" aria-hidden="true">${tier.icon}</span>
      <span class="sh-leaf-badge">${tier.icon} ${esc(tier.name)}</span>
      <span class="sh-sprite">${spriteSVG(s, { expr: away ? expressionFor(s) : 'happy' })}</span>
    </div>
    <div class="sh-leaf-body">
      <div class="between"><b>${esc(displayName(s))}</b><span class="tiny muted">${away ? 'Out in the Hollow' : 'At home'} · ${def.icon} ${esc(def.name)}</span></div>
      <p class="tiny muted">${esc(tier.blurb)}</p>
      <div class="sh-leaf-taps">${taps}</div>
      <div class="sh-leaf-tiers">${tiers}</div>
    </div>
  </article>`;
}

function speciesHomeSection() {
  const residents = state.sprites.filter(speciesHomeSprite);
  if (!residents.length) return '';
  const groups = new Map();
  residents.forEach((s) => {
    const def = speciesHomeDef(s.element);
    if (!groups.has(def.element)) groups.set(def.element, { def, members: [] });
    groups.get(def.element).members.push(s);
  });
  return [...groups.values()].map(({ def, members }) => {
    const home = members.filter((s) => s.atHome).length;
    return `<div class="sh-section-head"><h2>${def.icon} ${esc(def.title)}</h2><span>${home ? `${home} at home · ${def.tiers.length} tiers` : `Send a ${esc(def.name)} home to tend it`}</span></div>
      <div class="sh-leaf-grid">${members.map((s) => speciesHomeCard(s, def)).join('')}</div>`;
  }).join('');
}

function homeUpgradeOwned(id) {
  return !!(state.homeUpgrades && state.homeUpgrades[id]);
}

function homeUpgradeOwnedList() {
  return Object.values(HOME_UPGRADES).filter((up) => homeUpgradeOwned(up.id));
}

function homeCoinCap() {
  return HOME_COIN_BASE_CAP + homeUpgradeOwnedList().reduce((sum, up) => sum + (up.cap || 0), 0);
}

function homeRecoveryMult() {
  return homeUpgradeOwnedList().reduce((mult, up) => mult * (up.recovery || 1), 1);
}

function homeCoinRateMult() {
  return homeUpgradeOwnedList().reduce((mult, up) => mult * (up.coins || 1), 1);
}

function homeHangoutMult() {
  return homeUpgradeOwnedList().reduce((mult, up) => mult * (up.hangout || 1), 1);
}

function houseMaxMembers() {
  return homeUpgradeOwned('spareRoom') ? 3 : 2;
}

const HOME_DECOR_PIECES = [
  { id: 'sunroom', cls: 'deco-bed', text: '' },
  { id: 'pantry', cls: 'deco-shelf', text: '' },
  { id: 'playroom', cls: 'deco-rug', text: '' },
  { id: 'spareRoom', cls: 'deco-bed3', text: '' },
  { id: 'disco', cls: 'deco-ball', text: '🪩' },
  { id: 'aquarium', cls: 'deco-tank', text: '🐠' },
  { id: 'garden', cls: 'deco-planter', text: '🌿' },
];
const ROOM_SPOT_X = [18, 50, 82];
const HOME_DECOR_DEFAULT_SPOT = { sunroom: 0, pantry: 0, playroom: 1, spareRoom: 2, disco: 1, aquarium: 2, garden: 2 };

function homeDecorSpot(id) {
  const layout = state.roomLayout && state.roomLayout[id];
  if (layout) {
    const spot = Number(layout.spot);
    return Math.max(0, Math.min(2, Number.isFinite(spot) ? Math.round(spot) : 1));
  }
  const free = typeof freeDecorPiece === 'function' ? freeDecorPiece(id) : null;
  const fallback = free ? free.spot : HOME_DECOR_DEFAULT_SPOT[id];
  return Math.max(0, Math.min(2, Number.isFinite(fallback) ? Math.round(fallback) : 1));
}

function homeDecorHidden(id) {
  return !!(state.roomLayout && state.roomLayout[id] && state.roomLayout[id].hidden);
}

/* Visible room decor: bought furniture plus the always-free pieces. */
const HOUSE_TINT_SWATCHES = [BRAND.gold, '#8fe0c0', '#b69cff', '#ff9ec7', '#5ad6ff', '#8fe07a', '#ff9a3c', '#e8e6f0'];

function houseTint(houseId) {
  const value = state.houseTints && state.houseTints[houseId];
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '';
}

const HOUSE_TINT_DEFAULT_STRENGTH = 70;

function houseTintStrength(houseId) {
  const value = state.houseTintStrengths && state.houseTintStrengths[houseId];
  const pct = Math.round(Number(value));
  return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : HOUSE_TINT_DEFAULT_STRENGTH;
}

function houseTintVars(houseId) {
  const tint = houseTint(houseId);
  return tint ? `--house-tint:${tint};--house-tint-strength:${(houseTintStrength(houseId) / 100).toFixed(2)}` : '';
}

function spriteHouseTint(spriteId) {
  const house = houseForSprite(spriteId);
  return house ? houseTint(house.id) : '';
}

function decorPieceName(id) {
  const up = HOME_UPGRADES[id];
  if (up && up.name) return up.name;
  const free = typeof HOME_FREE_DECOR !== 'undefined' ? HOME_FREE_DECOR.find((item) => item.id === id) : null;
  return (free && free.name) || 'Decor';
}

function houseDecorPicker() {
  const id = shDecorPicker.pieceId;
  const spot = homeDecorSpot(id);
  const hidden = homeDecorHidden(id);
  const spots = ['Left', 'Centre', 'Right'];
  const tint = houseTint(shDecorPicker.houseId).toLowerCase();
  const strength = houseTintStrength(shDecorPicker.houseId);
  return `<div class="sh-decor-pop" data-sh-decor-pop role="group" aria-label="${esc(decorPieceName(id))} options">
    <div class="sh-decor-pop-head">
      <b>${esc(decorPieceName(id))}</b>
      <span class="tiny muted">${['Left wall', 'Centre', 'Right wall'][spot]}${hidden ? ' · tucked away' : ''}</span>
      <button class="sh-decor-pop-close" type="button" data-sh-decor-pop-close aria-label="Close decor picker">✕</button>
    </div>
    <div class="sh-decor-pop-row">
      ${spots.map((label, index) => `<button class="btn btn-sm ${index === spot ? 'btn-gold' : 'btn-ghost'}" type="button" data-sh-decor-spot="${index}" aria-pressed="${index === spot}">${label}</button>`).join('')}
      <button class="btn btn-sm btn-soft" type="button" data-sh-decor-hide-pop>${hidden ? 'Show' : 'Hide'}</button>
    </div>
    <div class="sh-decor-tint">
      <span class="tiny muted">Room tint</span>
      <input type="color" data-sh-house-tint-input value="${tint || BRAND.gold}" aria-label="Pick a room tint for this house">
      ${tint ? '<button class="btn btn-ghost btn-sm sh-tint-clear" type="button" data-sh-house-tint-clear>Clear</button>' : ''}
      <div class="sh-decor-tint-presets">
        ${HOUSE_TINT_SWATCHES.map((color) => `<button class="sh-tint-dot ${tint === color ? 'on' : ''}" type="button" style="background:${color}" data-sh-house-tint="${color}" aria-label="Tint this room ${color}" aria-pressed="${tint === color}"></button>`).join('')}
      </div>
      <div class="sh-decor-tint-strength ${tint ? '' : 'is-off'}">
        <span class="tiny muted">Stage</span>
        <input type="range" min="0" max="100" step="5" value="${strength}" data-sh-tint-strength aria-label="How strong this house's tint reads on hangouts and visits" ${tint ? '' : 'disabled'}>
        <b data-sh-tint-strength-out>${strength}%</b>
      </div>
    </div>
    <button class="btn btn-ghost btn-sm sh-decor-pop-more" type="button" data-sh-decor-full>All decor options →</button>
  </div>`;
}

function homeDecorLayer(interactive = false) {
  const bought = HOME_DECOR_PIECES
    .filter((piece) => homeUpgradeOwned(piece.id))
    .map((piece) => ({ id: piece.id, cls: piece.cls, text: piece.text, free: false }));
  const free = (typeof HOME_FREE_DECOR !== 'undefined' ? HOME_FREE_DECOR : [])
    .map((piece) => ({ id: piece.id, cls: piece.cls, text: piece.icon, free: true }));
  return [...bought, ...free].map((piece) => {
    if (homeDecorHidden(piece.id)) return '';
    const cls = `room-deco ${piece.cls}${piece.free ? ' free-deco' : ''}`;
    const style = `--x:${ROOM_SPOT_X[homeDecorSpot(piece.id)]}%`;
    if (!interactive) return `<span class="${cls}" style="${style}" aria-hidden="true">${piece.text}</span>`;
    const label = decorPieceName(piece.id);
    return `<button type="button" class="${cls} room-deco-tap" style="${style}" data-sh-decor-piece="${piece.id}" title="Edit ${esc(label)}" aria-label="Edit ${esc(label)}">${piece.text}</button>`;
  }).join('');
}

function sentHomeSprites() {
  return state.sprites
    .filter((s) => s.stage !== 'egg' && !s.retired && s.atHome)
    .sort((a, b) => (a.homeSince || 0) - (b.homeSince || 0));
}

function hollowSprites() {
  return awakeSprites().sort((a, b) => (b.born || 0) - (a.born || 0));
}

function homeCoinsFor(s) {
  return Math.max(0, Math.floor(Number(s.homeCoins) || 0));
}

function housesList() {
  return Object.values(state.houses || {})
    .map((house) => ({
      ...house,
      members: (house.members || []).map((id) => findSprite(id)).filter((m) => m && m.stage !== 'egg'),
    }))
    .filter((house) => house.members.length > 1);
}

function houseForSprite(id) {
  return Object.values(state.houses || {}).find((house) => (house.members || []).includes(id)) || null;
}

function houseScene(house) {
  const key = house?.scene && SCENES[house.scene] ? house.scene : homeSceneFor(house?.members?.[0] || {});
  return SCENES[key] ? key : 'grove';
}

function houseBondTier(bond) {
  const value = Math.max(0, Number(bond) || 0);
  if (value >= 500) return { name: 'Family', icon: '💞' };
  if (value >= 300) return { name: 'Best friends', icon: '💖' };
  if (value >= 150) return { name: 'Close friends', icon: '💗' };
  if (value >= 60) return { name: 'Friends', icon: '💛' };
  return { name: 'Getting to know each other', icon: '🤝' };
}

function houseChapterInfo(house) {
  if (typeof BondChapters === 'undefined' || !house) return { unlocked: 0, total: 0, next: null, shelf: [] };
  const shelf = BondChapters.shelfForHouse(state.storyShelf, house.id);
  return {
    unlocked: shelf.length,
    total: BondChapters.CHAPTERS.length,
    next: BondChapters.nextAt(house.bond),
    shelf,
  };
}

function storyShelfCard(entry) {
  const story = typeof BondChapters !== 'undefined' ? BondChapters.renderEntry(entry) : '';
  const memberNames = (entry.members || []).join(' & ');
  const houseLine = memberNames && memberNames !== entry.houseName
    ? `${entry.houseName} · ${memberNames}`
    : entry.houseName;
  return `<article class="sh-story-card" data-story-entry="${esc(entry.key)}" data-story-tone="${esc(entry.tone.id)}" data-story-members="${esc(memberNames)}">
    <div class="sh-story-head">
      <span class="sh-story-icon" aria-hidden="true">${entry.chapterIcon}</span>
      <span class="sh-story-copy"><b>${esc(entry.chapterName)}</b><span class="tiny muted">${esc(houseLine)}</span></span>
      <span class="chip">${entry.tone.icon} ${esc(entry.tone.name)}</span>
    </div>
    <p>${esc(story)}</p>
    <div class="sh-story-keepsake" data-story-keepsake="${esc(entry.keepsake.id)}">
      <span class="sh-story-keepsake-icon" aria-hidden="true">${entry.keepsake.icon}</span>
      <span><b>${esc(entry.keepsake.name)}</b><span class="tiny muted">${esc(entry.keepsake.blurb)}</span></span>
    </div>
  </article>`;
}

function storyShelfSection() {
  const entries = typeof BondChapters !== 'undefined'
    ? BondChapters.normalizeShelf(state.storyShelf)
    : [];
  const next = typeof BondChapters !== 'undefined'
    ? BondChapters.CHAPTERS.find((chapter) => !entries.some((entry) => entry.chapterId === chapter.id)) || null
    : null;
  return `<section class="sh-story-shelf" data-story-shelf>
    <div class="sh-section-head"><h2>📖 Story shelf</h2><span>${entries.length
      ? `${entries.length} keepsake${entries.length === 1 ? '' : 's'} · reusable tone templates`
      : 'Chapters unlock at 150 / 300 / 450 house bond'}</span></div>
    ${entries.length
      ? `<div class="sh-story-list">${entries.map(storyShelfCard).join('')}</div>`
      : `<div class="sh-story-empty"><span>📖</span><p>No chapters yet. A shared house writes its first at 150 bond; each chapter leaves a keepsake here.</p>${next ? `<span class="chip">Next at ${next.threshold} · ${esc(next.name)}</span>` : ''}</div>`}
  </section>`;
}

function homeNeedBars(s) {
  return ['hunger', 'energy', 'joy', 'clean'].map((key) => {
    const value = Math.round(Number(s.needs?.[key]) || 0);
    const label = key === 'hunger' ? 'Food' : key === 'energy' ? 'Rest' : key === 'joy' ? 'Joy' : 'Clean';
    return `<span class="home-need ${key}" title="${label} ${value}/100"><i style="width:${value}%"></i></span>`;
  }).join('');
}

function sentHomeCard(s) {
  const key = homeSceneFor(s);
  const scene = SCENES[key] || SCENES.grove;
  const tint = sceneTint(key);
  const coins = homeCoinsFor(s);
  const house = houseForSprite(s.id);
  const bond = Math.round(Number(s.bond) || 0);
  const houseTag = house
    ? `<span class="sh-tag">🏠 Shares with ${esc(house.members.filter((id) => id !== s.id).map((id) => { const m = findSprite(id); return m ? displayName(m) : ''; }).filter(Boolean).join(' & ') || 'a friend')}</span>`
    : '';
  return `<article class="sh-card" style="--sh-a:${tint.b1};--sh-b:${tint.b2}">
    <div class="sh-art" style="background:linear-gradient(180deg, ${tint.b2}, ${tint.b1});${typeof homeRoomThemeStyle === 'function' ? homeRoomThemeStyle() : ''}">
      <span class="room-wash" aria-hidden="true"></span>
      <div class="scene-decor">${buildSceneDecor(key)}</div>
      ${homeDecorLayer()}
      <span class="sh-scene">${scene.emoji} ${esc(scene.name)}</span>
      ${s.asleep ? '<span class="sh-zzz">💤</span>' : ''}
      <span class="sh-sprite">${spriteSVG(s, { expr: s.asleep ? 'sleep' : expressionFor(s) })}</span>
    </div>
    <div class="sh-plate">
      <div class="sh-name"><b>${esc(displayName(s))}</b><span class="tiny muted">Lv ${s.level} · 💗 ${bond}</span></div>
      ${s.asleep ? '<div class="tiny muted sh-status">Sleeping long — recovering energy</div>' : ''}
      <div class="home-needs">${homeNeedBars(s)}</div>
      ${houseTag}
      <div class="sh-coins"><span>🪙 ${coins} waiting</span><button class="btn btn-soft btn-sm" data-sh-collect="${s.id}" ${coins ? '' : 'disabled'}>Collect</button></div>
      <div class="home-care" role="group" aria-label="Care for ${esc(displayName(s))}">
        <button class="home-care-btn" data-sh-care="rub" data-sh-id="${s.id}" title="Belly rub">🤲</button>
        <button class="home-care-btn" data-sh-care="feed" data-sh-id="${s.id}" title="Feed">🍎</button>
        <button class="home-care-btn" data-sh-care="bath" data-sh-id="${s.id}" title="Bath">🛁</button>
        <button class="home-care-btn" data-sh-care="longsleep" data-sh-id="${s.id}" title="Long sleep">🛌</button>
      </div>
      <div class="sh-actions">
        <button class="btn btn-primary btn-sm" data-sh-one="${s.id}">💞 One on one</button>
        <button class="btn btn-soft btn-sm" data-sh-share="${s.id}" title="${house ? 'Change housemate' : 'Share house'}" aria-label="${house ? 'Change housemate' : 'Share house'}">${house ? 'Housemate' : 'Share house'}</button>
        <button class="btn btn-ghost btn-sm" data-sh-call="${s.id}" title="Back to the Hollow" aria-label="Back to the Hollow">↩ Hollow</button>
      </div>
    </div>
  </article>`;
}

function awayRow(s) {
  return `<div class="sh-row">
    <span class="sh-row-art">${spriteSVG(s, { expr: expressionFor(s) })}</span>
    <span class="sh-row-copy">
      <b>${esc(displayName(s))}</b>
      <span class="tiny muted">${moodOf(s).icon} ${moodOf(s).label} · Food ${Math.round(s.needs.hunger)} · Rest ${Math.round(s.needs.energy)} · 💗 ${Math.round(s.bond)}</span>
    </span>
    <button class="btn btn-primary btn-sm" data-sh-send="${s.id}">Send home</button>
  </div>`;
}

function houseCard(house) {
  const key = houseScene(house);
  const scene = SCENES[key] || SCENES.grove;
  const tint = sceneTint(key);
  const bond = Math.round(Number(house.bond) || 0);
  const tier = houseBondTier(bond);
  const pct = Math.min(100, Math.round((bond / HOUSE_BOND_MAX) * 100));
  const ready = Date.now() - (Number(house.lastBondAt) || 0) > 30 * 60 * 1000;
  const decorOpen = shHouseDecorOpen.has(house.id);
  const chapters = houseChapterInfo(house);
  return `<article class="sh-house${decorOpen ? ' decor-open' : ''}" style="--sh-a:${tint.b1};--sh-b:${tint.b2}">
    <div class="sh-house-head">
      <span>🏠</span>
      <b>${esc(house.name || `${house.members[0] ? displayName(house.members[0]) : 'A'} & ${house.members[1] ? displayName(house.members[1]) : 'friend'}`)}</b>
      <span class="chip">${scene.emoji} ${esc(scene.name)}</span>
      <button class="sh-house-decor" type="button" data-sh-house-decor="${house.id}" aria-expanded="${decorOpen ? 'true' : 'false'}" title="${decorOpen ? 'Hide room decor' : 'Show room decor'}" aria-label="${decorOpen ? 'Hide room decor' : 'Show room decor'}">🛋️</button>
    </div>
    <div class="sh-house-members">
      ${house.members.map((m) => `<span class="sh-house-member">${spriteSVG(m, { expr: 'happy' })}<b>${esc(displayName(m))}</b></span>`).join('')}
    </div>
    <div class="sh-house-room" data-sh-house-room="${house.id}" title="Tap the room to decorate it"><div class="sh-house-room-inner" style="${typeof homeRoomThemeStyle === 'function' ? homeRoomThemeStyle() : ''};${houseTintVars(house.id)}"><span class="room-wash" aria-hidden="true"></span>${houseTint(house.id) ? '<span class="sh-house-tint" aria-hidden="true"></span>' : ''}<span class="sh-house-room-edit" aria-hidden="true">✎</span>${homeDecorLayer(true)}</div></div>
    ${shDecorPicker && shDecorPicker.houseId === house.id ? houseDecorPicker() : ''}
    <div class="sh-house-bond">
      <div class="between tiny"><span>${tier.icon} ${tier.name}</span><span>${bond} / ${HOUSE_BOND_MAX}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>
    <div class="sh-house-chapters" data-house-chapters="${house.id}" data-house-chapter-count="${chapters.unlocked}">
      <span>📖 ${chapters.unlocked}/${chapters.total} chapters</span>
      <span>${chapters.next ? `next at ${chapters.next.threshold}` : 'all chapters told'}</span>
    </div>
    ${chapters.shelf.length ? `<div class="sh-house-keepsakes" aria-label="Keepsakes from this house">${chapters.shelf.map((entry) => `<span title="${esc(entry.keepsake.name)}">${entry.keepsake.icon}</span>`).join('')}</div>` : ''}
    <div class="sh-house-actions">
      <button class="btn btn-primary btn-sm" data-sh-hangout="${house.id}">🎮 Hang out</button>
      <button class="btn btn-gold btn-sm" data-sh-bond="${house.id}" ${ready ? '' : 'disabled'}>${ready ? '💞 Snuggle' : 'Snuggled out'}</button>
      <button class="btn btn-ghost btn-sm" data-sh-leave="${house.members[0]?.id || ''}" title="Split the house" aria-label="Split the house">Split</button>
    </div>
    <p class="tiny muted sh-house-note">${house.members.length}/${houseMaxMembers()} beds${houseMaxMembers() > 2 ? ' · family house' : ''} · bond grows every minute, faster on hangouts.</p>
  </article>`;
}

function homeUpgradeCards() {
  return Object.values(HOME_UPGRADES).map((up) => {
    const owned = homeUpgradeOwned(up.id);
    const tier = up.requires ? 2 : 1;
    const req = up.requires ? HOME_UPGRADES[up.requires] : null;
    const reqMet = !req || homeUpgradeOwned(req.id);
    const free = !up.price;
    const can = reqMet && (free || state.coins >= up.price);
    const effect = [
      up.cap ? `+${up.cap} coin cap` : '',
      up.recovery ? `×${up.recovery} recovery` : '',
      up.coins ? `×${up.coins} home coins` : '',
      up.slots ? `${up.slots} beds per house` : '',
      up.hangout ? `+${Math.round((up.hangout - 1) * 100)}% hangout bond` : '',
    ].filter(Boolean).join(' · ');
    return `<article class="sh-upgrade ${owned ? 'owned' : ''} ${tier === 2 ? 'tier2' : ''}">
      <span class="sh-upgrade-icon">${up.icon}</span>
      <span class="sh-upgrade-copy"><b>${esc(up.name)}</b><span class="tiny muted">${esc(up.blurb)}</span><span class="sh-upgrade-effect">${free ? 'Free · ' : ''}${effect}${tier === 2 ? ' · adds decor' : ''}</span></span>
      ${owned
        ? '<span class="chip">✓ Owned</span>'
        : reqMet
          ? `<button class="btn ${can ? 'btn-gold' : 'btn-ghost'} btn-sm" data-sh-buy="${up.id}" ${can ? '' : 'disabled'}>${free ? 'Free' : `🪙 ${up.price.toLocaleString()}`}</button>`
          : `<span class="chip locked">Needs ${esc(req.name)}</span>`}
    </article>`;
  }).join('');
}

/* Housemates play together on screen: a short scored round grows the bond. */
const HANGOUT_ROUND_MS = 12000;

function openHouseHangout(houseId, repaint) {
  const house = state.houses && state.houses[houseId];
  if (!house) { toast('That house is no longer together.', '🏠'); return; }
  const sceneKey = houseScene(house);
  const scene = SCENES[sceneKey] || SCENES.grove;
  const tint = sceneTint(sceneKey);
  const members = (house.members || []).map((id) => findSprite(id)).filter(Boolean);
  const tier = houseBondTier(house.bond);
  const ready = Date.now() - (Number(house.lastPlayAt) || 0) > HOUSE_PLAY_COOLDOWN;
  const games = [
    { id: 'chase', icon: '🍃', name: 'Leaf chase', toy: '🍃', line: 'They tear around the room after one very brave leaf.' },
    { id: 'picnic', icon: '🧺', name: 'Snack picnic', toy: '🍓', line: 'They split a snack and negotiate very hard over the last bite.' },
    { id: 'nap', icon: '😴', name: 'Nap pile', toy: '💤', line: 'They curl into one warm, snoring pile.' },
    { id: 'music', icon: '🎶', name: 'Kitchen dance', toy: '🎵', line: 'Someone starts a beat on a cupboard. It escalates quickly.' },
  ];

  let roundTimer = null;
  let countdown = null;
  let hopTimer = null;
  let refreshTimer = null;
  let running = false;
  let score = 0;
  let left = HANGOUT_ROUND_MS / 1000;

  const stopTimers = () => {
    if (countdown) clearInterval(countdown);
    if (hopTimer) clearTimeout(hopTimer);
    if (roundTimer) clearTimeout(roundTimer);
    if (refreshTimer) clearTimeout(refreshTimer);
    countdown = null; hopTimer = null; roundTimer = null; refreshTimer = null;
  };

  openSheet({
    title: `🏠 ${esc(house.name || 'Shared house')}`,
    sub: `${scene.emoji} ${esc(scene.name)} · ${members.length} housemates · ${tier.icon} ${tier.name}`,
    body: `<div class="hangout-stage" data-hangout-stage style="background:linear-gradient(180deg, ${tint.b2}, ${tint.b1});${typeof homeRoomThemeStyle === 'function' ? homeRoomThemeStyle() : ''};${houseTintVars(houseId)}">
        <span class="room-wash" aria-hidden="true"></span>${houseTint(houseId) ? '<span class="house-tint-wash" aria-hidden="true"></span>' : ''}
        <div class="scene-decor">${buildSceneDecor(sceneKey)}</div>
        ${homeDecorLayer()}
        <div class="hangout-actors">${members.map((m) => `<span class="hangout-actor" data-hangout-actor="${m.id}">${spriteSVG(m, { expr: 'happy' })}<b>${esc(displayName(m))}</b></span>`).join('')}</div>
        <div class="hg-hud" data-hg-hud hidden><span>🫶 <b data-hg-score>0</b> catches</span><span>⏱ <b data-hg-time>${left}</b>s</span></div>
        <button class="hg-target" data-hg-target hidden aria-label="Tap the toy"></button>
        <div class="hangout-line" data-hangout-line>Pick a game, then tap the toy as it hops around the room.</div>
        <div class="hangout-hearts" data-hangout-hearts></div>
      </div>
      <div class="sh-house-bond" style="margin-top:10px">
        <div class="between tiny"><span>${tier.icon} ${tier.name}</span><span data-hangout-bond>${Math.round(Number(house.bond) || 0)} / ${HOUSE_BOND_MAX}</span></div>
        <div class="bar"><i data-hangout-bar style="width:${Math.min(100, Math.round(((Number(house.bond) || 0) / HOUSE_BOND_MAX) * 100))}%"></i></div>
      </div>
      <div class="hangout-grid" data-hangout-games>
        ${games.map((g) => `<button class="oo-btn hangout-btn" data-hangout-play="${g.id}" ${ready ? '' : 'disabled'}>${g.icon}<b>${g.name}</b><span>${ready ? 'tap the toy · 12s round' : 'catching their breath'}</span></button>`).join('')}
      </div>
      <div class="hg-result" data-hg-result hidden></div>
      <p class="tiny muted" style="margin-top:8px;line-height:1.5">Every catch grows house bond, lifts everyone’s joy, and pays a coin or two. Housemates who play together also bond faster every minute.</p>`,
    onClose: () => { running = false; stopTimers(); },
    onMount: (overlay) => {
      const root = overlay.querySelector('.sheet') || overlay;
      const stage = overlay.querySelector('[data-hangout-stage]');
      const target = overlay.querySelector('[data-hg-target]');
      const hud = overlay.querySelector('[data-hg-hud]');
      const scoreEl = overlay.querySelector('[data-hg-score]');
      const timeEl = overlay.querySelector('[data-hg-time]');
      const lineEl = overlay.querySelector('[data-hangout-line]');
      const hearts = overlay.querySelector('[data-hangout-hearts]');
      const bondEl = overlay.querySelector('[data-hangout-bond]');
      const barEl = overlay.querySelector('[data-hangout-bar]');
      const resultEl = overlay.querySelector('[data-hg-result]');
      const gameButtons = () => root.querySelectorAll('[data-hangout-play]');

      const setBond = () => {
        const fresh = state.houses[houseId];
        if (!fresh) return;
        if (bondEl) bondEl.textContent = `${Math.round(Number(fresh.bond) || 0)} / ${HOUSE_BOND_MAX}`;
        if (barEl) barEl.style.width = `${Math.min(100, Math.round(((Number(fresh.bond) || 0) / HOUSE_BOND_MAX) * 100))}%`;
      };

      const hop = () => {
        if (!running || !target) return;
        if (hopTimer) clearTimeout(hopTimer);
        target.style.left = `${rand(10, 76)}%`;
        target.style.top = `${rand(28, 62)}%`;
        hopTimer = setTimeout(hop, rand(620, 1000));
      };

      const finish = (game) => {
        if (!running) return;
        running = false;
        stopTimers();
        if (target) target.hidden = true;
        if (hud) hud.hidden = true;
        const res = Actions.housePlay(houseId, game.id, score);
        if (!res.ok) {
          if (lineEl) lineEl.textContent = res.reason === 'cooling' ? 'They need a moment to catch their breath.' : 'They need a housemate to play with.';
          return;
        }
        setBond();
        if (lineEl) lineEl.textContent = `${game.line} ${score} catch${score === 1 ? '' : 'es'}!`;
        if (resultEl) {
          const chapter = res.storyChapters && res.storyChapters[0];
          resultEl.hidden = false;
          resultEl.innerHTML = `<b>+${res.bond} house bond</b><span>🪙 +${res.coins} coins · 💗 everyone’s joy up · ${score} catches</span>${chapter ? `<span>📖 ${esc(chapter.chapterName)} unlocked · ${chapter.keepsake.icon} ${esc(chapter.keepsake.name)} added to the Story shelf</span>` : ''}`;
        }
        if (hearts) {
          hearts.innerHTML = '<span>💗</span><span>💞</span><span>💗</span>';
          setTimeout(() => { if (hearts) hearts.innerHTML = ''; }, 2400);
        }
        overlay.querySelectorAll('.hangout-actor').forEach((actor) => {
          actor.classList.add('playing');
          setTimeout(() => actor.classList.remove('playing'), 1500);
        });
        burstOn(stage, ['💗', '💞', '✨'], 10);
        Sfx.win();
        toast(`${res.names}: ${score} catches · house bond +${res.bond} · +${res.coins} coins`, '💞');
        gameButtons().forEach((b) => { b.disabled = true; const sub = b.querySelector('span'); if (sub) sub.textContent = 'catching their breath'; });
        refreshTimer = setTimeout(() => {
          gameButtons().forEach((b) => { b.disabled = false; const sub = b.querySelector('span'); if (sub) sub.textContent = 'tap the toy · 12s round'; });
        }, HOUSE_PLAY_COOLDOWN + 1000);
        if (repaint) repaint();
      };

      const start = (game) => {
        if (running) return;
        if (Date.now() - (Number(state.houses[houseId]?.lastPlayAt) || 0) < HOUSE_PLAY_COOLDOWN) {
          toast('They just played. Give them a minute to catch their breath.', '🏠');
          return;
        }
        score = 0;
        left = HANGOUT_ROUND_MS / 1000;
        running = true;
        if (resultEl) { resultEl.hidden = true; resultEl.innerHTML = ''; }
        if (target) { target.hidden = false; target.textContent = game.toy; }
        if (hud) hud.hidden = false;
        if (scoreEl) scoreEl.textContent = '0';
        if (timeEl) timeEl.textContent = String(left);
        if (lineEl) lineEl.textContent = `${game.name} — tap the ${game.toy} before it hops away!`;
        gameButtons().forEach((b) => { b.disabled = true; });
        hop();
        countdown = setInterval(() => {
          left -= 1;
          if (timeEl) timeEl.textContent = String(Math.max(0, left));
          if (left <= 0) finish(game);
        }, 1000);
        roundTimer = setTimeout(() => finish(game), HANGOUT_ROUND_MS);
      };

      root.addEventListener('click', (event) => {
        const playBtn = event.target.closest('[data-hangout-play]');
        if (playBtn) {
          event.stopPropagation();
          if (playBtn.disabled) return;
          const game = games.find((g) => g.id === playBtn.dataset.hangoutPlay);
          if (game) start(game);
          return;
        }
        if (event.target.closest('[data-hg-target]')) {
          event.stopPropagation();
          if (!running) return;
          score += 1;
          if (scoreEl) scoreEl.textContent = String(score);
          if (score % 4 === 0) Sfx.coin(); else Sfx.pop();
          burstOn(target, ['✨'], 3);
          hop();
        }
      });
    },
  });
}

function roomDecorRows() {
  const owned = Object.values(HOME_UPGRADES).filter((up) => homeUpgradeOwned(up.id));
  const row = (id, icon, name, free) => {
    const spot = homeDecorSpot(id);
    const hidden = homeDecorHidden(id);
    return `<div class="decor-row">
      <span class="decor-row-icon">${icon}</span>
      <span class="decor-row-copy"><b>${esc(name)}</b><span class="tiny muted">${['Left wall', 'Centre', 'Right wall'][spot]}${hidden ? ' · tucked away' : ''}${free ? ' · free' : ''}</span></span>
      <button class="btn btn-ghost btn-sm" data-decor-move="${id}" aria-label="Move ${esc(name)}">↔️</button>
      <button class="btn btn-soft btn-sm" data-decor-hide="${id}">${hidden ? 'Show' : 'Hide'}</button>
    </div>`;
  };
  const boughtRows = owned.length
    ? owned.map((up) => row(up.id, up.icon, up.name, false)).join('')
    : '<p class="tiny muted">Buy a room upgrade and its furniture appears here. The free pieces below are always yours.</p>';
  const freeRows = (typeof HOME_FREE_DECOR !== 'undefined' ? HOME_FREE_DECOR : [])
    .map((piece) => row(piece.id, piece.icon, piece.name, true)).join('');
  const themes = (typeof HOME_ROOM_THEMES !== 'undefined' ? Object.entries(HOME_ROOM_THEMES) : [])
    .map(([key, theme]) => `<button class="theme-swatch ${state.roomTheme === key ? 'on' : ''}" type="button" data-room-theme="${key}" title="${esc(theme.name)} — free">
      <span class="theme-dot" style="background:${theme.glow};box-shadow:inset 0 0 0 6px ${theme.wall}"></span>
      <span class="tiny">${esc(theme.name)}</span>
    </button>`).join('');
  return `${boughtRows}
    <div class="decor-split">Free decor · always yours</div>
    ${freeRows}
    <div class="decor-split">Room colours · all free</div>
    <div class="theme-swatches">${themes}</div>`;
}

function roomDecorPreview() {
  const decor = homeDecorLayer();
  return `<div class="decor-preview room-themed" style="${typeof homeRoomThemeStyle === 'function' ? homeRoomThemeStyle() : ''}"><span class="room-wash" aria-hidden="true"></span>${decor}${decor ? '' : '<span class="decor-empty tiny muted">No furniture placed yet</span>'}</div>`;
}

function openRoomDecorator(repaint, opts = {}) {
  const houseLabel = opts.houseName ? String(opts.houseName) : '';
  openSheet({
    title: houseLabel ? `🛋️ ${houseLabel}’s room` : '🛋️ Decorate the room',
    sub: houseLabel
      ? 'Tap a piece in the room, then move it between the left wall, the centre and the right wall or tuck it away. Furniture and colours are shared by every room in your Hollow.'
      : 'Every upgrade you own is furniture, and the free pieces and room colours cost nothing. Move each piece between the left wall, the centre, and the right wall, or tuck it away.',
    body: `<div data-decor-preview>${roomDecorPreview()}</div>
      <div class="decor-list" data-decor-list>${roomDecorRows()}</div>
      <p class="tiny muted" style="margin-top:8px;line-height:1.5">Your arrangement shows in every room: home cards, shared-house strips, hangout stages, and one-on-one visits. It is saved with your Hollow.</p>`,
    onMount: (overlay) => {
      const root = overlay.querySelector('.sheet') || overlay;
      const preview = overlay.querySelector('[data-decor-preview]');
      const list = overlay.querySelector('[data-decor-list]');
      const paint = () => {
        if (preview) preview.innerHTML = roomDecorPreview();
        if (list) list.innerHTML = roomDecorRows();
      };
      if (opts.focusId) {
        const row = list && list.querySelector(`[data-decor-move="${opts.focusId}"]`);
        const line = row && row.closest('.decor-row');
        if (line) {
          line.classList.add('decor-row-focus');
          line.scrollIntoView({ block: 'center', behavior: 'smooth' });
          setTimeout(() => line.classList.remove('decor-row-focus'), 2400);
        }
      }
      root.addEventListener('click', (event) => {
        const move = event.target.closest('[data-decor-move]');
        const hide = event.target.closest('[data-decor-hide]');
        const theme = event.target.closest('[data-room-theme]');
        if (!move && !hide && !theme) return;
        event.stopPropagation();
        if (theme) {
          Actions.setRoomTheme(theme.dataset.roomTheme);
          Sfx.click();
          paint();
          if (repaint) repaint();
          return;
        }
        if (move) {
          const id = move.dataset.decorMove;
          Actions.setRoomPiece(id, { spot: (homeDecorSpot(id) + 1) % 3 });
          Sfx.click();
        } else {
          const id = hide.dataset.decorHide;
          Actions.setRoomPiece(id, { hidden: !homeDecorHidden(id) });
          Sfx.pop();
        }
        paint();
        if (repaint) repaint();
      });
    },
  });
}

function sentHomeBody() {
  const home = sentHomeSprites();
  const away = hollowSprites();
  const houses = housesList();
  const coins = home.reduce((sum, s) => sum + homeCoinsFor(s), 0);
  const chips = [
    `🏠 ${home.length} sent home`,
    `🪙 ${coins.toLocaleString()} waiting`,
    houses.length ? `💞 ${houses.length} shared house${houses.length === 1 ? '' : 's'}` : '',
    `🐾 ${away.length} in the Hollow`,
  ].filter(Boolean).map((label) => `<span class="chip">${label}</span>`).join('');

  if (!home.length && !away.length && !houses.length) {
    return `<div class="card empty-state">
      <div style="font-size:36px">🏠</div>
      <h3 style="font-size:15px;margin:8px 0 4px">No one home yet</h3>
      <p class="small muted">Hatch a sprite and send them home for a long rest, a warm meal, and a little pocket money.</p>
    </div>`;
  }

  const owned = homeUpgradeOwnedList().length;
  const total = Object.keys(HOME_UPGRADES).length;

  return `<div class="sh-intro">${chips}<button class="btn btn-soft btn-sm sh-decorate" data-sh-decorate>🛋️ Decorate</button></div>

    <div class="sh-section-head"><h2>🏠 At home</h2><span>${home.length ? `${home.length} relaxing · recovering all needs` : 'Nobody home right now'}</span></div>
    ${home.length
      ? '<div class="sh-grid" data-sh-home-grid></div>'
      : '<div class="sh-void"><span>🌙</span><p>Nobody is home. Pick a sprite below and send them home to rest, eat and earn.</p></div>'}

    ${speciesHomeSection()}

    <div class="sh-section-head"><h2>💞 Shared houses</h2><span>${houses.length ? `${houses.length} household${houses.length === 1 ? '' : 's'} building a bond` : `${houseMaxMembers()} beds per house`}</span></div>
    ${houses.length
      ? `<div class="sh-house-grid">${houses.map(houseCard).join('')}</div>`
      : '<div class="sh-void"><span>💞</span><p>Send two sprites home, then tap <b>Share house</b> on one. Housemates bond every minute, even while you are away.</p></div>'}

    ${storyShelfSection()}

    <div class="sh-section-head"><h2>🐾 In the Hollow</h2><span>${away.length} sprite${away.length === 1 ? '' : 's'} out and about</span></div>
    <div class="sh-list" data-sh-away-list>
      ${away.length ? '' : '<div class="sh-void"><span>🐾</span><p>Everyone is home. The Hollow is quiet.</p></div>'}
    </div>

    <details class="sh-fold" data-sh-upgrades${shUpgradesOpen ? ' open' : ''}>
      <summary><span>🛠️ Room upgrades</span><span class="sh-fold-meta">${owned}/${total} owned · 🪙 ${homeCoinCap()} cap · ${houseMaxMembers()} beds</span><b class="sh-fold-chev">▾</b></summary>
      <div class="sh-upgrades">${homeUpgradeCards()}</div>
    </details>

    <p class="tiny muted sh-foot">At home sprites recover all four needs and bank coins while you are away. Collect any time, or bring them back to the Hollow to play.</p>`;
}

function mountSentHomeCards(body) {
  let grids = [];
  const clear = () => {
    grids.forEach((grid) => grid.clear());
    grids = [];
  };
  const paint = () => {
    clear();
    body.innerHTML = sentHomeBody();
    const home = sentHomeSprites();
    const away = hollowSprites();
    const homeBox = body.querySelector('[data-sh-home-grid]');
    const awayBox = body.querySelector('[data-sh-away-list]');
    if (homeBox && home.length) {
      const grid = new LazyGrid(homeBox, { batchSize: 8, rootMargin: '700px 0px', virtual: true, windowSize: 32, key: (s) => s.id });
      grid.reset(home, sentHomeCard);
      grids.push(grid);
    }
    if (awayBox && away.length) {
      const grid = new LazyGrid(awayBox, { batchSize: 24, rootMargin: '700px 0px', virtual: true, windowSize: 96, key: (s) => s.id });
      grid.reset(away, awayRow);
      grids.push(grid);
    }
  };
  paint();
  return { paint, clear };
}

function sentHomeScreen(root) {
  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Their own room</div><h1>Homes</h1><p>Set a sprite down at home to rest, eat, and earn. Visit for one-on-one time.</p></div>
      <button class="icon-btn" data-sh-goto-hollow aria-label="Back to the Hollow">${icon('hollow')}</button>
    </div>
    <div data-sh-body></div>`;

  const body = root.querySelector('[data-sh-body]');
  const cards = mountSentHomeCards(body);
  const repaint = () => { cards.paint(); };
  body.addEventListener('toggle', (event) => {
    if (event.target.matches && event.target.matches('[data-sh-upgrades]')) shUpgradesOpen = event.target.open;
  }, true);

  root.querySelector('[data-sh-goto-hollow]')?.addEventListener('click', () => App.go('hollow'));

  const onClick = (event) => {
    const send = event.target.closest('[data-sh-send]');
    if (send) {
      const res = Actions.sendHome(send.dataset.shSend);
      if (res.ok) {
        Sfx.pop();
        toast('They are home now. They will rest, eat, and earn coins until you call them back.', '🏠');
      } else {
        toast('They are already home.', '🏠');
      }
      repaint();
      return;
    }
    const collect = event.target.closest('[data-sh-collect]');
    if (collect) {
      const res = Actions.collectHome(collect.dataset.shCollect);
      if (res.ok && res.coins) {
        Sfx.coin();
        toast(`+${res.coins.toLocaleString()} coins collected from home.`, '🪙');
      }
      repaint();
      return;
    }
    const buy = event.target.closest('[data-sh-buy]');
    if (buy) {
      const res = Actions.buyHomeUpgrade(buy.dataset.shBuy);
      if (!res.ok) {
        toast(res.reason === 'requires' ? `That needs ${HOME_UPGRADES[res.missing]?.name || 'another upgrade'} first.` : res.reason === 'coins' ? `You need ${(res.need || 0).toLocaleString()} more coins for that upgrade.` : 'That upgrade is already yours.', '🛠️');
        Sfx.error();
      } else {
        Sfx.level();
        burstOn(buy, ['🛠️', '✨', '🪙'], 9);
        toast(`${res.upgrade.name} installed in every room.`, '🛠️');
      }
      repaint();
      return;
    }
    const leafTap = event.target.closest('[data-leaf-tap]');
    if (leafTap) {
      const res = Actions.tapSpeciesHome(leafTap.dataset.leafId, leafTap.dataset.leafTap);
      if (!res.ok) {
        if (res.reason === 'cooldown') toast(`Still growing — ready in ${leafCooldownLabel(res.wait)}.`, '🌱');
        else if (res.reason === 'home') toast('Send them home first to tend the grove.', '🌳');
        else toast('That tap is not ready.', '🌳');
        Sfx.error();
      } else {
        Sfx.coin();
        burstOn(leafTap, ['🍃', '🍎', '✨'], 7);
        toast(`${res.name}: +${res.coins} coins${res.hunger ? ' and a good meal' : ''}${res.joy ? ' · joy up' : ''}.`, '🌳');
      }
      repaint();
      return;
    }
    const leafBuy = event.target.closest('[data-leaf-buy]');
    if (leafBuy) {
      const res = Actions.buySpeciesHomeTier(leafBuy.dataset.leafId, leafBuy.dataset.leafBuy);
      if (!res.ok) {
        toast(res.reason === 'coins' ? `You need ${(res.need || 0).toLocaleString()} more coins for that tier.` : 'That tier is already yours, or needs the one before it.', '🌳');
        Sfx.error();
      } else {
        Sfx.level();
        burstOn(leafBuy, ['🌿', '🌳', '✨'], 9);
        toast(`${res.tier.name} is growing.`, '🌳');
      }
      repaint();
      return;
    }
    const pieceTap = event.target.closest('[data-sh-decor-piece]');
    if (pieceTap) {
      Sfx.click();
      const houseId = pieceTap.closest('[data-sh-house-room]')?.dataset.shHouseRoom;
      shDecorPicker = houseId ? { houseId, pieceId: pieceTap.dataset.shDecorPiece } : null;
      repaint();
      return;
    }
    const spotPick = event.target.closest('[data-sh-decor-spot]');
    if (spotPick && shDecorPicker) {
      Actions.setRoomPiece(shDecorPicker.pieceId, { spot: Number(spotPick.dataset.shDecorSpot) });
      Sfx.click();
      repaint();
      return;
    }
    const hidePop = event.target.closest('[data-sh-decor-hide-pop]');
    if (hidePop && shDecorPicker) {
      Actions.setRoomPiece(shDecorPicker.pieceId, { hidden: !homeDecorHidden(shDecorPicker.pieceId) });
      Sfx.pop();
      shDecorPicker = null;
      repaint();
      return;
    }
    const fullDecor = event.target.closest('[data-sh-decor-full]');
    if (fullDecor && shDecorPicker) {
      Sfx.click();
      const pickerHouse = housesList().find((item) => item.id === shDecorPicker.houseId);
      const pickerName = pickerHouse && (pickerHouse.name || pickerHouse.members.map((m) => displayName(m)).filter(Boolean).join(' & '));
      const focusId = shDecorPicker.pieceId;
      shDecorPicker = null;
      openRoomDecorator(repaint, { houseName: pickerName || '', focusId });
      return;
    }
    const closePicker = event.target.closest('[data-sh-decor-pop-close]');
    if (closePicker) {
      Sfx.click();
      shDecorPicker = null;
      repaint();
      return;
    }
    const tintPick = event.target.closest('[data-sh-house-tint]');
    if (tintPick && shDecorPicker) {
      Actions.setHouseTint(shDecorPicker.houseId, tintPick.dataset.shHouseTint);
      Sfx.click();
      repaint();
      return;
    }
    const tintClear = event.target.closest('[data-sh-house-tint-clear]');
    if (tintClear && shDecorPicker) {
      Actions.setHouseTint(shDecorPicker.houseId, null);
      Sfx.pop();
      repaint();
      return;
    }
    const room = event.target.closest('[data-sh-house-room]');
    if (room) {
      Sfx.click();
      const house = housesList().find((h) => h.id === room.dataset.shHouseRoom);
      const name = house && (house.name || house.members.map((m) => displayName(m)).filter(Boolean).join(' & '));
      const piece = event.target.closest('[data-sh-decor-piece]');
      openRoomDecorator(repaint, { houseName: name || '', focusId: piece ? piece.dataset.shDecorPiece : null });
      return;
    }
    const decor = event.target.closest('[data-sh-house-decor]');
    if (decor) {
      Sfx.click();
      const id = decor.dataset.shHouseDecor;
      const card = decor.closest('.sh-house');
      const open = card ? card.classList.toggle('decor-open') : false;
      if (open) shHouseDecorOpen.add(id); else shHouseDecorOpen.delete(id);
      if (!open && card) {
        card.querySelector('[data-sh-decor-pop]')?.remove();
        if (shDecorPicker && shDecorPicker.houseId === id) shDecorPicker = null;
      }
      decor.setAttribute('aria-expanded', open ? 'true' : 'false');
      decor.title = open ? 'Hide room decor' : 'Show room decor';
      decor.setAttribute('aria-label', decor.title);
      return;
    }
    const hangout = event.target.closest('[data-sh-hangout]');
    if (hangout) {
      Sfx.click();
      openHouseHangout(hangout.dataset.shHangout, repaint);
      return;
    }
    const decorate = event.target.closest('[data-sh-decorate]');
    if (decorate) {
      Sfx.click();
      openRoomDecorator(repaint);
      return;
    }
    const care = event.target.closest('[data-sh-care]');
    if (care) {
      sentHomeCare(care.dataset.shId, care.dataset.shCare, repaint);
      return;
    }
    const one = event.target.closest('[data-sh-one]');
    if (one) {
      Sfx.click();
      openOneOnOne(one.dataset.shOne, repaint);
      return;
    }
    const share = event.target.closest('[data-sh-share]');
    if (share) {
      Sfx.click();
      openShareHousePicker(share.dataset.shShare, repaint);
      return;
    }
    const call = event.target.closest('[data-sh-call]');
    if (call) {
      const res = Actions.callBack(call.dataset.shCall);
      if (res.ok) {
        Sfx.win();
        toast(`${res.coins ? `+${res.coins.toLocaleString()} coins, and ` : ''}they are back in the Hollow.`, '🐾');
      }
      repaint();
      return;
    }
    const bond = event.target.closest('[data-sh-bond]');
    if (bond) {
      const res = Actions.bondHouse(bond.dataset.shBond);
      if (res.ok) {
        Sfx.win();
        burstOn(bond, ['💞', '✨', '💗'], 8);
        const chapter = res.storyChapters && res.storyChapters[0];
        toast(`${res.names} snuggle up. House bond +${res.bond}${res.coins ? ` · +${res.coins} coins` : ''}${chapter ? ` · 📖 ${chapter.chapterName} unlocked` : ''}.`, chapter ? '📖' : '💞');
      } else {
        toast('They just had a cuddle. Give them a little while.', '💞');
      }
      repaint();
      return;
    }
    const leave = event.target.closest('[data-sh-leave]');
    if (leave) {
      const res = Actions.leaveHouse(leave.dataset.shLeave);
      if (res.ok) toast('The house is split. Both sprites keep their own rooms.', '🏠');
      repaint();
    }
  };
  /* Live tint preview while the colour wheel is open, saved on change. */
  const onTintInput = (event) => {
    const input = event.target.closest('[data-sh-house-tint-input]');
    if (!input || !shDecorPicker) return;
    const inner = input.closest('.sh-house')?.querySelector('.sh-house-room-inner');
    if (!inner) return;
    let stripe = inner.querySelector('.sh-house-tint');
    if (!stripe) {
      stripe = document.createElement('span');
      stripe.className = 'sh-house-tint';
      stripe.setAttribute('aria-hidden', 'true');
      inner.insertBefore(stripe, inner.firstChild);
    }
    inner.style.setProperty('--house-tint', input.value);
  };
  const onTintChange = (event) => {
    const input = event.target.closest('[data-sh-house-tint-input]');
    if (!input || !shDecorPicker) return;
    Actions.setHouseTint(shDecorPicker.houseId, input.value);
    Sfx.click();
    repaint();
  };
  /* Stage strength: the readout follows the thumb, the save happens on release. */
  const onStrengthInput = (event) => {
    const input = event.target.closest('[data-sh-tint-strength]');
    if (!input) return;
    const out = input.closest('.sh-decor-tint-strength')?.querySelector('[data-sh-tint-strength-out]');
    if (out) out.textContent = `${input.value}%`;
  };
  const onStrengthChange = (event) => {
    const input = event.target.closest('[data-sh-tint-strength]');
    if (!input || !shDecorPicker) return;
    Actions.setHouseTintStrength(shDecorPicker.houseId, input.value);
    Sfx.click();
    repaint();
  };
  root.addEventListener('click', onClick);
  root.addEventListener('input', onTintInput);
  root.addEventListener('change', onTintChange);
  root.addEventListener('input', onStrengthInput);
  root.addEventListener('change', onStrengthChange);

  return () => {
    cards.clear();
    root.removeEventListener('click', onClick);
    root.removeEventListener('input', onTintInput);
    root.removeEventListener('change', onTintChange);
    root.removeEventListener('input', onStrengthInput);
    root.removeEventListener('change', onStrengthChange);
  };
}

function sentHomeCare(spriteId, kind, repaint) {
  const s = findSprite(spriteId);
  if (!s) return;
  if (kind === 'feed') {
    openHomeFeedPicker(spriteId, repaint);
    return;
  }
  if (kind === 'rub') {
    const res = Actions.rubBelly(spriteId);
    toast(res && res.cooled ? `${displayName(s)} is still blissed out.` : `${displayName(s)} rolls over for a belly rub.`, '🤲');
    if (!(res && res.cooled)) {
      fluffShed(document.querySelector('.oo-art') || document.querySelector('.sh-art'), s, 'rub');
      wagTail(document.querySelector('.oo-art') || document.querySelector('.sh-art'), s);
    }
  } else if (kind === 'bath') {
    const bath = Actions.bathe(spriteId);
    if (bath && bath.cooled) {
      toast(`${displayName(s)} is still fresh from the last bath.`, '🫧');
    } else {
      soapBubbles(document.querySelector('.oo-art') || document.querySelector('.sh-art'), 14);
      fluffShed(document.querySelector('.oo-art') || document.querySelector('.sh-art'), s, 'bath');
      toast(`${displayName(s)} is squeaky clean.`, '🛁');
    }
  } else if (kind === 'longsleep') {
    if (s.asleep) {
      Actions.wake(spriteId);
      napPropFade(document.querySelector('.oo-art') || document.querySelector('.sh-art'));
      toast(`${displayName(s)} blinks awake.`, '☀️');
    } else {
      Actions.homeLongSleep(spriteId);
      toast(`${displayName(s)} curls up for a long, long sleep.`, '🛌');
    }
  }
  Sfx.click();
  if (repaint) repaint();
}

function openOneOnOne(spriteId, repaint) {
  const s = findSprite(spriteId);
  if (!s) return;
  const sceneKey = homeSceneFor(s);
  const scene = SCENES[sceneKey] || SCENES.grove;
  const tint = sceneTint(sceneKey);
  const house = houseForSprite(s.id);
  const { close } = openSheet({
    title: `💞 ${esc(displayName(s))}`,
    sub: `One on one at home · ${scene.emoji} ${esc(scene.name)}${house ? ' · shared house' : ''}`,
    body: `<div class="oo-hero" style="background:linear-gradient(180deg, ${tint.b2}, ${tint.b1});${spriteHouseTint(s.id) ? `--house-tint:${spriteHouseTint(s.id)}` : ''}">
        ${spriteHouseTint(s.id) ? '<span class="house-tint-wash" aria-hidden="true"></span>' : ''}
        <div class="scene-decor">${buildSceneDecor(sceneKey)}</div>
        ${homeDecorLayer()}
        <span class="oo-art">${spriteSVG(s, { expr: s.asleep ? 'sleep' : expressionFor(s) })}</span>
        <span class="oo-status">${s.asleep ? '😴 Fast asleep' : `${moodOf(s).icon} ${moodOf(s).label}`} · 💗 ${Math.round(s.bond)} bond</span>
      </div>
      <div class="home-needs" style="margin-top:10px">${homeNeedBars(s)}</div>
      <div class="oo-grid">
        <button class="oo-btn" data-oo="rub">🤲<b>Belly rub</b><span>+joy, +bond</span></button>
        <button class="oo-btn" data-oo="feed">🍎<b>Feed</b><span>from the pantry</span></button>
        <button class="oo-btn" data-oo="bath">🛁<b>Bath</b><span>clean + joy</span></button>
        <button class="oo-btn" data-oo="fetch">🎾<b>Play fetch</b><span>coins + bond</span></button>
        <button class="oo-btn" data-oo="talk">💬<b>Talk</b><span>a quiet moment</span></button>
        <button class="oo-btn" data-oo="sleep">${s.asleep ? '☀️' : '🛌'}<b>${s.asleep ? 'Wake up' : 'Long sleep'}</b><span>${s.asleep ? 'start the day' : 'deep recovery'}</span></button>
        <button class="oo-btn" data-oo-game="catch">🍓<b>Treat Catch</b><span>one-on-one game</span></button>
        <button class="oo-btn" data-oo-game="pulse">🎯<b>Pulse Match</b><span>one-on-one game</span></button>
      </div>
      <div class="oo-house">${house
        ? `🏠 Sharing with ${esc(house.members.filter((m) => m.id !== s.id).map((m) => displayName(m)).join(' & ') || 'a friend')} · ${houseBondTier(house.bond).icon} ${houseBondTier(house.bond).name}`
        : 'Send a housemate home and share a house to start a bond.'}</div>
      <div class="row" style="gap:8px;margin-top:10px">
        <button class="btn btn-soft btn-block" data-oo-share>${house ? 'Change housemate' : '🏠 Share house'}</button>
        <button class="btn ${s.atHome ? 'btn-ghost' : 'btn-primary'} btn-block" data-oo-toggle>${s.atHome ? 'Back to the Hollow' : 'Send home'}</button>
      </div>`,
    onMount: (overlay) => {
      const sheet = overlay.querySelector('.sheet') || overlay;
      sheet.addEventListener('click', (event) => {
        const action = event.target.closest('[data-oo]');
        if (action) {
          event.stopPropagation();
          const kind = action.dataset.oo;
          const sprite = findSprite(spriteId);
          if (!sprite) return;
          if (kind === 'rub') {
            const res = Actions.rubBelly(spriteId);
            toast(res && res.cooled ? `${displayName(sprite)} is still blissed out.` : `${displayName(sprite)} melts into the floor.`, '🤲');
            if (!(res && res.cooled)) {
              fluffShed(document.querySelector('.oo-art'), sprite, 'rub');
              wagTail(document.querySelector('.oo-art'), sprite);
            }
          } else if (kind === 'feed') {
            openHomeFeedPicker(spriteId, () => { close(); openOneOnOne(spriteId, repaint); if (repaint) repaint(); });
            return;
          } else if (kind === 'bath') {
            const bath = Actions.bathe(spriteId);
            if (bath && bath.cooled) {
              toast(`${displayName(sprite)} is still fresh from the last bath.`, '🫧');
            } else {
              fluffShed(document.querySelector('.oo-art'), sprite, 'bath');
              toast(`${displayName(sprite)} is squeaky clean.`, '🛁');
            }
          } else if (kind === 'fetch') {
            const res = Actions.playCatch(spriteId, 'throw', 4);
            if (res.ok) {
              toast(`+${res.coins} coins · +${res.xp} XP · a very good game of fetch.`, '🎾');
              Sfx.win();
              burstOn(action, ['🎾', '💗', '🪙'], 7);
            }
          } else if (kind === 'talk') {
            const res = Actions.chat(spriteId, 'hi');
            const greeting = (ELEMENTS[sprite.element] || ELEMENTS.bloom).greeting || 'They chirp happily at you.';
            toast(`${displayName(sprite)}: “${greeting}”${res.coins ? ` · +${res.coins} coins` : ''}`, '💬');
          } else if (kind === 'sleep') {
            if (sprite.asleep) {
              Actions.wake(spriteId);
              napPropFade(document.querySelector('.oo-art'));
              toast(`${displayName(sprite)} wakes up slowly.`, '☀️');
            } else {
              Actions.homeLongSleep(spriteId);
              toast(`${displayName(sprite)} curls up for a long sleep.`, '🛌');
            }
          }
          Sfx.click();
          close();
          setTimeout(() => openOneOnOne(spriteId, repaint), 40);
          if (repaint) repaint();
          return;
        }
        const game = event.target.closest('[data-oo-game]');
        if (game) {
          event.stopPropagation();
          const kind = game.dataset.ooGame;
          close();
          if (spriteId !== state.activeId) Actions.setActive(spriteId);
          setTimeout(() => App.startGame(kind), 60);
          return;
        }
        if (event.target.closest('[data-oo-share]')) {
          event.stopPropagation();
          close();
          setTimeout(() => openShareHousePicker(spriteId, repaint), 40);
          return;
        }
        if (event.target.closest('[data-oo-toggle]')) {
          event.stopPropagation();
          if (s.atHome) {
            const res = Actions.callBack(spriteId);
            if (res.ok) toast(`${res.coins ? `+${res.coins} coins, and ` : ''}back in the Hollow.`, '🐾');
          } else {
            Actions.sendHome(spriteId);
            toast('They are home for a long rest.', '🏠');
          }
          close();
          if (repaint) repaint();
          if (App.tab === 'senthome') App.refresh();
        }
      });
    },
  });
}

function shareHouseRow(other, current) {
  const selected = !!(current && current.members.includes(other.id));
  return `<button class="sh-share-row${selected ? ' on' : ''}" type="button" data-sh-pick="${other.id}">
      <span class="sh-share-art">${spriteSVG(other, { expr: 'happy' })}</span>
      <span class="sh-share-copy"><b>${esc(displayName(other))}</b><span class="tiny muted">${moodOf(other).icon} ${moodOf(other).label} · 💗 ${Math.round(other.bond)} · ${esc(SCENES[homeSceneFor(other)]?.name || 'Home')}</span></span>
      ${selected ? '<span class="chip">Housemate</span>' : '<span class="chip">Pick</span>'}
    </button>`;
}

function openShareHousePicker(spriteId, repaint) {
  const s = findSprite(spriteId);
  if (!s) return;
  if (!s.atHome) {
    toast('Send them home first, then pick a housemate.', '🏠');
    return;
  }
  const candidates = sentHomeSprites().filter((other) => other.id !== spriteId);
  const current = houseForSprite(spriteId);
  let picker = null;
  openSheet({
    title: '🏠 Share a house',
    sub: candidates.length
      ? `Pick who shares ${esc(displayName(s))}’s room. Housemates build a bond every minute, even while you are away.${houseMaxMembers() > 2 ? ' The free Spare Bedroom upgrade allows a third housemate.' : ' The free Spare Bedroom upgrade adds a third housemate.'}`
      : 'A shared house needs at least two sprites sent home.',
    body: candidates.length
      ? '<div class="sh-share-list" data-sh-share-list></div>'
      : `<div class="card empty-state"><div style="font-size:30px">🛏️</div><p class="small muted" style="margin:8px 0 0">Send another sprite home first — the room is more fun with a friend.</p></div>`,
    onClose: () => { picker?.clear(); picker = null; },
    onMount: (overlay, close) => {
      const list = overlay.querySelector('[data-sh-share-list]');
      list?.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-sh-pick]');
        if (!btn) return;
        const res = Actions.shareHouse(spriteId, btn.dataset.shPick);
        if (res.ok) {
          Sfx.win();
          toast(`${displayName(s)} and ${displayName(findSprite(btn.dataset.shPick))} now share a house.`, '🏠');
        } else {
          toast('That pair already shares a house.', '🏠');
        }
        close();
        if (repaint) repaint();
        if (App.tab === 'senthome') App.refresh();
      });
      if (list) {
        picker = new LazyGrid(list, { batchSize: 20, rootMargin: '500px 0px', virtual: true, windowSize: 80, key: (other) => other.id });
        picker.reset(candidates, (other) => shareHouseRow(other, current));
      }
    },
  });
}

function openSentHomeSheet() {
  let cards = null;
  openSheet({
    title: '🏠 Homes',
    sub: 'Every sprite can go home to relax, eat, recover, sleep long, and earn coins — or share a house and grow a bond.',
    body: '<div data-sh-sheet-body></div>',
    onClose: () => { cards?.clear(); cards = null; },
    onMount: (overlay, close) => {
      const sheet = overlay.querySelector('.sheet') || overlay;
      const body = overlay.querySelector('[data-sh-sheet-body]');
      cards = body ? mountSentHomeCards(body) : null;
      const repaint = () => { cards?.paint(); };
      sheet.addEventListener('click', (event) => {
        const send = event.target.closest('[data-sh-send]');
        if (send) {
          event.stopPropagation();
          Actions.sendHome(send.dataset.shSend);
          toast('They are home for a long rest.', '🏠');
          repaint();
          return;
        }
        const collect = event.target.closest('[data-sh-collect]');
        if (collect) {
          event.stopPropagation();
          const res = Actions.collectHome(collect.dataset.shCollect);
          if (res.ok && res.coins) {
            Sfx.coin();
            toast(`+${res.coins.toLocaleString()} coins collected from home.`, '🪙');
          }
          repaint();
          return;
        }
        const care = event.target.closest('[data-sh-care]');
        if (care) {
          event.stopPropagation();
          sentHomeCare(care.dataset.shId, care.dataset.shCare, repaint);
          return;
        }
        const one = event.target.closest('[data-sh-one]');
        if (one) {
          event.stopPropagation();
          close();
          setTimeout(() => openOneOnOne(one.dataset.shOne, null), 40);
          return;
        }
        const share = event.target.closest('[data-sh-share]');
        if (share) {
          event.stopPropagation();
          close();
          setTimeout(() => openShareHousePicker(share.dataset.shShare, null), 40);
          return;
        }
        const bond = event.target.closest('[data-sh-bond]');
        if (bond) {
          event.stopPropagation();
          const res = Actions.bondHouse(bond.dataset.shBond);
          if (res.ok) {
            Sfx.win();
            const chapter = res.storyChapters && res.storyChapters[0];
            toast(`${res.names} snuggle up. House bond +${res.bond}${res.coins ? ` · +${res.coins} coins` : ''}${chapter ? ` · 📖 ${chapter.chapterName} unlocked` : ''}.`, chapter ? '📖' : '💞');
          }
          repaint();
          return;
        }
        const leave = event.target.closest('[data-sh-leave]');
        if (leave) {
          event.stopPropagation();
          const res = Actions.leaveHouse(leave.dataset.shLeave);
          if (res.ok) toast('The house is split. Both sprites keep their own rooms.', '🏠');
          repaint();
          return;
        }
        const buy = event.target.closest('[data-sh-buy]');
        if (buy) {
          event.stopPropagation();
          const res = Actions.buyHomeUpgrade(buy.dataset.shBuy);
          if (res.ok) toast(`${res.upgrade.name} installed in every room.`, '🛠️');
          else toast(res.reason === 'requires' ? `That needs ${HOME_UPGRADES[res.missing]?.name || 'another upgrade'} first.` : res.reason === 'coins' ? `You need ${(res.need || 0).toLocaleString()} more coins.` : 'That upgrade is already yours.', '🛠️');
          repaint();
          return;
        }
        const hangout = event.target.closest('[data-sh-hangout]');
        if (hangout) {
          event.stopPropagation();
          close();
          setTimeout(() => openHouseHangout(hangout.dataset.shHangout, null), 40);
          return;
        }
        const decorate = event.target.closest('[data-sh-decorate]');
        if (decorate) {
          event.stopPropagation();
          close();
          setTimeout(() => openRoomDecorator(null), 40);
          return;
        }
        const call = event.target.closest('[data-sh-call]');
        if (call) {
          event.stopPropagation();
          const res = Actions.callBack(call.dataset.shCall);
          if (res.ok) toast(`${res.coins ? `+${res.coins} coins, and ` : ''}back in the Hollow.`, '🐾');
          repaint();
          return;
        }
      });
    },
  });
}
