/* Sprite Hollow Matching Fashion Collection.
   Every set dresses a Sprite and its companion Sprite Puffle in the same theme,
   so a pair reads as one look. Ten seasonal collections, three legendary
   Pufflea sets and three secret collections, plus the seasonal rotation. */

const FASHION_GROUPS = [
  { id: 'seasonal', name: 'Matching collections', icon: '🌿', blurb: 'Sprite and Puffle pieces sharing one palette, one motif and one aura.' },
  { id: 'pufflea', name: 'Legendary Pufflea collections', icon: '⭐', blurb: 'Show sets for the legendary Pufflea, cut to match their Sprite partner.' },
  { id: 'secret', name: 'Secret collections', icon: '⚫', blurb: 'Cosmic and heartlight sets that only appear at the top of the roster.' },
];

const FASHION_COLLECTIONS = [
  /* ---- seasonal ---- */
  {
    id: 'springbloom', group: 'seasonal', name: 'Spring Bloom', icon: '🌿', season: 'Spring', tone: '#7FD8A0',
    sprite: ['Blossom Crown', 'Petal Cape', 'Floral Tunic', 'Bloom Boots', 'Butterfly Wristbands'],
    puffle: ['Mini Blossom Crown', 'Petal Collar', 'Flower Tail Ribbon', 'Bloom Aura'],
    effects: ['Falling petals', 'Butterflies follow player', 'Friendship bonus'],
  },
  {
    id: 'sunflare', group: 'seasonal', name: 'Summer Sunflare', icon: '☀️', season: 'Summer', tone: '#FFC24B',
    sprite: ['Sunflower Hat', 'Golden Adventure Vest', 'Beach Shorts', 'Sunflare Sandals'],
    puffle: ['Golden Flower Crown', 'Sun Charm Necklace', 'Tiny Solar Cape'],
    effects: ['Sun rays sparkle', 'Sand particles', 'Bloom animations'],
  },
  {
    id: 'harvest', group: 'seasonal', name: 'Autumn Harvest', icon: '🍂', season: 'Autumn', tone: '#E08A3C',
    sprite: ['Acorn Hood', 'Woodland Jacket', 'Pumpkin Satchel', 'Maple Boots'],
    puffle: ['Tiny Acorn Cap', 'Maple Collar', 'Harvest Tail Wrap'],
    effects: ['Falling leaves', 'Pumpkin glow', 'Acorn particles'],
  },
  {
    id: 'frostveil', group: 'seasonal', name: 'Winter Frostveil', icon: '❄️', season: 'Winter', tone: '#93C9FF',
    sprite: ['Snowflake Crown', 'Frost Cape', 'Crystal Gloves', 'Ice Boots'],
    puffle: ['Snowflake Tiara', 'Crystal Bell Collar', 'Frost Ribbon'],
    effects: ['Snowfall particles', 'Aurora shimmer', 'Frozen footprints'],
  },
  {
    id: 'rainbowfestival', group: 'seasonal', name: 'Rainbow Festival', icon: '🌈', season: 'Summer', tone: '#FF9AD5',
    sprite: ['Rainbow Hoodie', 'Prism Cape', 'Aurora Leggings', 'Festival Sneakers'],
    puffle: ['Rainbow Bow', 'Prism Collar', 'Color-Changing Aura'],
    effects: ['Rainbow trails', 'Confetti sparkles', 'Festival fireworks'],
  },
  {
    id: 'galaxydream', group: 'seasonal', name: 'Galaxy Dream', icon: '🌌', season: 'Any season', tone: '#8F7CFF',
    sprite: ['Nebula Robe', 'Constellation Cape', 'Star Boots', 'Planet Backpack'],
    puffle: ['Galaxy Crown', 'Nebula Scarf', 'Star Halo'],
    effects: ['Orbiting stars', 'Cosmic dust', 'Mini planets orbit'],
  },
  {
    id: 'royalblossom', group: 'seasonal', name: 'Royal Blossom', icon: '👑', season: 'Spring', tone: '#FFD36B',
    sprite: ['Royal Blossom Crown', 'Golden Garden Cape', 'Royal Tunic', 'Crystal Boots'],
    puffle: ['Mini Royal Crown', 'Gold Ribbon Collar', 'Blossom Wings'],
    effects: ['Royal sparkles', 'Petal storm', 'Golden butterflies'],
  },
  {
    id: 'dragonfestival', group: 'seasonal', name: 'Dragon Festival', icon: '🐉', season: 'Summer', tone: '#FF7A5C',
    sprite: ['Dragon Horn Headband', 'Rune Armor', 'Scale Cloak', 'Dragon Boots'],
    puffle: ['Dragon Wings', 'Crystal Horn', 'Rune Collar'],
    effects: ['Dragon fire particles', 'Ancient runes', 'Spirit dragon animations'],
  },
  {
    id: 'spiritmoon', group: 'seasonal', name: 'Spirit Moon', icon: '🌙', season: 'Autumn', tone: '#A9B6FF',
    sprite: ['Moon Hood', 'Spirit Robe', 'Wisp Lantern', 'Dream Shoes'],
    puffle: ['Moon Halo', 'Wisp Pendant', 'Spirit Cape'],
    effects: ['Moonlight glow', 'Spirit wisps', 'Dream particles'],
  },
  {
    id: 'crystalkingdom', group: 'seasonal', name: 'Crystal Kingdom', icon: '💎', season: 'Winter', tone: '#7AF0E0',
    sprite: ['Diamond Crown', 'Crystal Armor', 'Gemstone Belt', 'Prism Boots'],
    puffle: ['Crystal Tiara', 'Gem Collar', 'Prism Tail Band'],
    effects: ['Crystal reflections', 'Sparkle bursts', 'Prism beams'],
  },

  /* ---- legendary Pufflea ---- */
  {
    id: 'springqueen', group: 'pufflea', name: 'Pufflea Spring Queen', icon: '🌸', season: 'Spring', tone: '#FFB3D1',
    sprite: ['Cherry Blossom Crown', 'Pink Petal Dress', 'Vine Sandals'],
    puffle: ['Royal Flower Crown', 'Blossom Collar', 'Petal Wings'],
    effects: ['Sakura storm'],
  },
  {
    id: 'bloomqueen', group: 'pufflea', name: 'Bloom Queen', icon: '👑', season: 'Spring', tone: '#FF8FB0',
    sprite: ['Bloom Queen Crown', 'Royal Garden Robes', 'Flower Crystal Staff'],
    puffle: ['Bloom Queen Crown', 'Garden Aura', 'Royal Blossom Wings'],
    effects: ['Blooming kingdom aura'],
  },
  {
    id: 'celestialbloom', group: 'pufflea', name: 'Celestial Bloom', icon: '🌌', season: 'Any season', tone: '#B18CFF',
    sprite: ['Galaxy Flower Crown', 'Constellation Cloak', 'Cosmic Boots'],
    puffle: ['Star Blossom Halo', 'Galaxy Wings', 'Cosmic Flower Trail'],
    effects: ['Blossom constellations'],
  },

  /* ---- secret ---- */
  {
    id: 'genesis', group: 'secret', name: 'Genesis', icon: '✨', season: 'Any season', tone: '#FFF0B8',
    sprite: ['White-Gold Crown', 'Creation Robes', 'Universe Sandals'],
    puffle: ['Genesis Halo', 'Creation Collar', 'Light Wings'],
    effects: ['Creation energy', 'Floating stars', 'Reality sparkles'],
  },
  {
    id: 'heartlight', group: 'secret', name: 'Heartlight', icon: '💖', season: 'Any season', tone: '#FF8FB6',
    sprite: ['Heartlight Tiara', 'Friendship Cape', 'Love Crystal Jewelry'],
    puffle: ['Heart Halo', 'Friendship Ribbon', 'Heart Aura'],
    effects: ['Floating hearts', 'Friend particles'],
  },
  {
    id: 'creator', group: 'secret', name: 'Creator', icon: '🌌', season: 'Any season', tone: '#FFE08A',
    sprite: ['Creator Crown', 'Reality Robes', 'Universe Mantle'],
    puffle: ['Creator Halo', 'Cosmic Wings', 'Creation Tail Ring'],
    effects: ['Universe fragments', 'Reality glyphs', 'Creation particles'],
  },
];

const FASHION_SEASONS = [
  { name: 'Spring', months: 'March–May', icon: '🌸', sets: ['Bloom Collection', 'Butterfly Collection', 'Nature Collection'] },
  { name: 'Summer', months: 'June–August', icon: '☀️', sets: ['Sunflare Collection', 'Beach Collection', 'Festival Collection'] },
  { name: 'Autumn', months: 'September–November', icon: '🍂', sets: ['Harvest Collection', 'Pumpkin Collection', 'Woodland Collection'] },
  { name: 'Winter', months: 'December–February', icon: '❄️', sets: ['Frostveil Collection', 'Holiday Collection', 'Aurora Collection'] },
];

const FASHION_ITEM_COUNT = FASHION_COLLECTIONS.reduce((total, set) => total + set.sprite.length + set.puffle.length, 0);

function fashionEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* The wiki page: one card per set, with the Sprite outfit and the Puffle
   outfit side by side so the pairing is visible at a glance. */
function wikiFashionMarkup() {
  const sets = typeof FASHION_COLLECTIONS !== 'undefined' ? FASHION_COLLECTIONS : [];
  const groups = typeof FASHION_GROUPS !== 'undefined' ? FASHION_GROUPS : [];
  const items = typeof FASHION_ITEM_COUNT !== 'undefined' ? FASHION_ITEM_COUNT : sets.reduce((n, s) => n + s.sprite.length + s.puffle.length, 0);
  const sections = groups.map((group) => {
    const list = sets.filter((set) => set.group === group.id);
    if (!list.length) return '';
    return `<section class="fs-group">
      <div class="fs-group-head"><h3>${group.icon} ${fashionEsc(group.name)}</h3><span>${list.length} sets</span></div>
      <p class="tiny muted" style="margin:-2px 0 8px">${fashionEsc(group.blurb)}</p>
      <div class="fs-grid">${list.map((set) => `<article class="fs-card" style="--fs-tone:${set.tone}">
        <div class="fs-head"><span class="fs-badge" aria-hidden="true">${set.icon}</span><span class="fs-name"><b>${fashionEsc(set.name)}</b><small>${fashionEsc(set.season)} · ${set.sprite.length + set.puffle.length} pieces</small></span></div>
        <div class="fs-pair">
          <div class="fs-side"><span class="fs-label">Sprite outfit</span><ul>${set.sprite.map((piece) => `<li>${fashionEsc(piece)}</li>`).join('')}</ul></div>
          <div class="fs-side"><span class="fs-label">Puffle outfit</span><ul>${set.puffle.map((piece) => `<li>${fashionEsc(piece)}</li>`).join('')}</ul></div>
        </div>
        <div class="fs-effects">${set.effects.map((effect) => `<span class="fs-effect">${fashionEsc(effect)}</span>`).join('')}</div>
      </article>`).join('')}</div>
    </section>`;
  }).join('');
  const calendar = (typeof FASHION_SEASONS !== 'undefined' ? FASHION_SEASONS : []).map((season) => `<div class="fs-season">
      <div class="fs-season-head"><b>${season.icon} ${fashionEsc(season.name)}</b><span>${fashionEsc(season.months)}</span></div>
      <ul>${season.sets.map((set) => `<li>${fashionEsc(set)}</li>`).join('')}</ul>
    </div>`).join('');
  return `<p class="wiki-lede">Every Sprite can dress to match its companion Sprite Puffle. Each set pairs the Sprite pieces with the Puffle pieces cut from the same cloth, then hangs one effect layer over both so the look moves as a single outfit.</p>
    <p class="tiny muted">${sets.length} sets · ${items} pieces · ten seasonal, three legendary Pufflea, three secret</p>
    <button class="btn btn-primary btn-block" type="button" data-wardrobe-open style="margin:8px 0 12px">👗 Open the seasonal wardrobe</button>
    ${sections}
    <h3>Seasonal rotation</h3>
    <p>Three collections are featured each season. Rotation changes what the wardrobe shelves first; owned pieces never leave the closet.</p>
    <div class="fs-seasons">${calendar}</div>`;
}

/* ---- Seasonal wardrobe metadata ---- */

const FASHION_TABS = [
  { id: 'spring', name: 'Spring', icon: '🌸', sets: ['springbloom', 'royalblossom'], bonuses: ['Friendship +10%', 'Garden Growth +15%'] },
  { id: 'summer', name: 'Summer', icon: '☀️', sets: ['sunflare', 'galaxydream'], bonuses: ['Exploration +10%', 'Beach Events +15%'] },
  { id: 'autumn', name: 'Autumn', icon: '🍂', sets: ['harvest', 'spiritmoon'], bonuses: ['Foraging +15%', 'Resource Find +10%'] },
  { id: 'winter', name: 'Winter', icon: '❄️', sets: ['frostveil', 'crystalkingdom'], bonuses: ['Winter Event Rewards +15%', 'Comfort +10%'] },
  { id: 'events', name: 'Events', icon: '🌈', sets: ['rainbowfestival', 'dragonfestival', 'spiritmoon'], bonuses: [] },
  { id: 'legendary', name: 'Legendary', icon: '👑', sets: ['springqueen', 'bloomqueen', 'celestialbloom'], bonuses: [] },
  { id: 'secret', name: 'Secret', icon: '⚫', sets: ['genesis', 'heartlight', 'creator'], bonuses: [] },
];

/* Seasonal bonuses are real modifiers rather than labels. They apply while the
   active Sprite wears a set from the matching season; an "Any season" set takes
   whichever season the Hollow is currently in. Every hook is optional at the
   call site, so nothing changes when no set is worn. */
const FASHION_SEASON_EFFECTS = {
  spring: { bond: 1.10, garden: 1.15 },
  summer: { trailXp: 1.10, gameCoins: 1.15 },
  autumn: { forage: 1.15, find: 1.10 },
  winter: { eventCoins: 1.15, comfort: 0.90 },
};

function fashionWornSet(sprite) {
  const s = sprite || (typeof activeSprite === 'function' ? activeSprite() : null);
  const mixed = fashionMixSet(s);
  if (mixed) return mixed;
  const id = s && s.wardrobeLook && s.wardrobeLook.setId;
  return id ? FASHION_COLLECTIONS.find((set) => set.id === id) || null : null;
}

/* The season a set's bonus counts for right now: its own season, the current
   season for an "Any season" set, or null when the set is out of season. */
function fashionSetSeason(set, season) {
  if (!set) return null;
  const current = season || (typeof seasonOf === 'function' ? seasonOf().key : null);
  const label = String(set.season || '').toLowerCase();
  if (label === 'any season') return current;
  if (label === current) return label;
  return null;
}

/* One hook's multiplier: 'bond', 'garden', 'trailXp', 'gameCoins', 'forage',
   'find', 'eventCoins' or 'comfort'. Returns 1 when the worn set is off-season. */
function fashionSeasonMod(kind, sprite) {
  const season = fashionSetSeason(fashionWornSet(sprite));
  const mods = season ? FASHION_SEASON_EFFECTS[season] : null;
  return mods && Number.isFinite(mods[kind]) ? mods[kind] : 1;
}

function fashionSeasonBonusActive(season, sprite) {
  return fashionSetSeason(fashionWornSet(sprite)) === season;
}

/* Human labels for each hook, so the sheet and the wardrobe can never disagree
   with FASHION_SEASON_EFFECTS. Percentages are read from the same table. */
const FASHION_BONUS_TEXT = {
  bond: ['💞', 'Friendship'], garden: ['🌿', 'Garden Growth'],
  trailXp: ['🧭', 'Exploration'], gameCoins: ['🏖️', 'Beach Events'],
  forage: ['🍄', 'Foraging'], find: ['💎', 'Resource Find'],
  eventCoins: ['🎉', 'Event Rewards'], comfort: ['🛋️', 'Comfort'],
};

function fashionSeasonBonusChips(season) {
  const tab = (typeof FASHION_TABS !== 'undefined' ? FASHION_TABS : []).find((entry) => entry.id === season);
  const bonuses = tab && Array.isArray(tab.bonuses) ? tab.bonuses : [];
  return bonuses.map((bonus) => `<span class="chip">${fashionEsc(bonus)}</span>`).join('');
}

function fashionSeasonModList(season, active) {
  const key = String(season || '').toLowerCase();
  const mods = FASHION_SEASON_EFFECTS[key];
  if (!mods) return [];
  return Object.keys(mods).map((kind) => {
    const meta = FASHION_BONUS_TEXT[kind] || ['✨', kind];
    return { kind, icon: meta[0], label: meta[1], value: mods[kind], active: !!active };
  });
}

function fashionSeasonModChipsFor(season, active) {
  return fashionSeasonModList(season, active).map((mod) => `<span class="wd-season-mod ${mod.active ? 'is-active' : 'is-inactive'}" data-wd-season-mod="${fashionEsc(mod.kind)}" data-wd-active="${mod.active}">${mod.icon} ${fashionEsc(mod.label)} \u00d7${mod.value.toFixed(2)} ${mod.active ? 'active' : 'inactive'}</span>`).join('');
}

/* The actual multiplier a worn collection is paying right now. An off-season
   set still reports its own season's numbers, marked inactive, so the card
   explains what will switch on instead of only saying that it is off. */
function fashionSeasonModInfo(set, sprite) {
  const current = typeof seasonOf === 'function' ? seasonOf().key : null;
  const own = String(set && set.season || '').toLowerCase();
  /* The live bonus belongs to the active Sprite. A set worn only by the
     companion still lists its own numbers, but not as active. */
  const worn = sprite && typeof fashionWornSet === 'function' ? fashionWornSet(sprite) : null;
  const carriedBySprite = !sprite || !!(worn && set && worn.id === set.id);
  const active = !!current && !!set && carriedBySprite && fashionSetSeason(set, current) === current;
  const key = FASHION_SEASON_EFFECTS[own] ? own : active ? current : null;
  return { active, season: key, mods: key ? fashionSeasonModList(key, active) : [] };
}

function fashionSeasonModChips(set, sprite) {
  const info = fashionSeasonModInfo(set, sprite);
  return fashionSeasonModChipsFor(info.season, info.active);
}

/* The wardrobe shelf a collection sits on, so a card can open right at it. */
function fashionTabForSet(set) {
  const tabs = typeof FASHION_TABS !== 'undefined' ? FASHION_TABS : [];
  if (!set) return null;
  const own = tabs.find((tab) => (tab.sets || []).includes(set.id));
  if (own) return own.id;
  const bySeason = tabs.find((tab) => tab.id === String(set.season || '').toLowerCase());
  return bySeason ? bySeason.id : null;
}

/* The sprite detail sheet's seasonal card: what the worn look actually pays,
   whether it is live, and how to switch it on. */
function spriteSeasonBonusHTML(sprite) {
  if (!sprite || sprite.stage === 'egg') return '';
  const set = fashionWornSet(sprite);
  const rawLook = sprite.wardrobeLook;
  const mixed = rawLook && rawLook.setId === 'mixed'
    ? fashionMixInfo(rawLook.pieces, sprite.puffleWardrobeLook && sprite.puffleWardrobeLook.setId === 'mixed' ? sprite.puffleWardrobeLook.pieces : [])
    : null;
  const currentKey = typeof seasonOf === 'function' ? seasonOf().key : null;
  const season = FASHION_SEASON_EFFECTS[currentKey] ? currentKey : 'spring';
  const meta = typeof SEASONS !== 'undefined' ? SEASONS[season] : null;
  /* The chips mirror the shelf this card links to: a worn off-season set
     keeps its own season's bonuses instead of borrowing today's. */
  const bonusSeason = set && String(set.season || '').toLowerCase() !== 'any season' && FASHION_SEASON_EFFECTS[String(set.season).toLowerCase()]
    ? String(set.season).toLowerCase()
    : season;
  const live = !!set && fashionSetSeason(set, currentKey) === currentKey;
  const status = live ? 'active' : mixed ? `mix ${mixed.score}%` : set ? 'off-season' : 'no set worn';
  const currentName = meta ? meta.name : season;
  const wornName = set ? `${set.icon} ${fashionEsc(set.name)}` : mixed ? '\u{1F9E9} Mixed look' : 'No outfit worn';
  const wornChip = set ? `<span class="chip">${fashionEsc(set.season)} set</span>` : mixed ? `<span class="chip">${mixed.sets.length} collections</span>` : '';
  const note = live
    ? 'These modifiers are applied right now.'
    : mixed
      ? `Harmonise this mix to ${FASHION_MIX_HARMONY}% to switch the seasonal bonus on.`
      : set
        ? `This ${fashionEsc(set.season)} set only pays out during ${fashionEsc(set.season)}.`
        : `Wear a ${fashionEsc(currentName)} set to switch these on.`;
  /* The card's link opens the wardrobe on the worn collection's own shelf, so
     the matching set is already selected; with no whole set worn it falls back
     to the shelf of the season the chips describe. */
  const collection = set && typeof FASHION_COLLECTIONS !== 'undefined'
    ? FASHION_COLLECTIONS.find((entry) => entry.id === set.id) || null
    : null;
  const linkTab = (collection && fashionTabForSet(collection)) || (FASHION_SEASON_EFFECTS[bonusSeason] ? bonusSeason : '');
  const linkSet = collection ? collection.id : '';
  return `<div class="card wd-season-card${live ? ' is-live' : ''}" style="padding:12px;margin-top:10px">
    <div class="between"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">SEASONAL OUTFIT BONUS</div><span class="chip">${meta ? `${meta.icon} ${fashionEsc(currentName)}` : fashionEsc(currentName)} \u00b7 ${status}</span></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
      <b style="font-size:12px">${wornName}</b>
      ${wornChip}
    </div>
    <div class="row" style="gap:5px;flex-wrap:wrap;margin-top:7px">${fashionSeasonBonusChips(bonusSeason)}</div>
    <p class="tiny muted" style="margin:7px 0 0;line-height:1.5">${note}</p>
    <button class="btn btn-soft btn-block" data-wardrobe-open data-sprite-id="${fashionEsc(sprite.id)}" data-wardrobe-tab="${fashionEsc(linkTab)}"${linkSet ? ` data-wardrobe-set="${fashionEsc(linkSet)}"` : ''} style="margin-top:8px">${collection ? `Open ${fashionEsc(collection.name)} in the wardrobe` : 'Open wardrobe'}</button>
  </div>`;
}

const FASHION_SPECIAL_DYES = [
  { id: 'metallic', name: 'Metallic Gold', primary: '#F0C24B', secondary: '#FFF2C4', glow: '#FFD166', particle: '#FFF4C4' },
  { id: 'prism', name: 'Crystal Prism', primary: '#8FE3FF', secondary: '#FF8FD6', glow: '#B18CFF', particle: '#FFFFFF' },
  { id: 'galaxy', name: 'Galaxy Gradient', primary: '#3A2268', secondary: '#A34C9E', glow: '#8F7CFF', particle: '#F4F1FF' },
  { id: 'genesis', name: 'Genesis White', primary: '#FFFFFF', secondary: '#FFF4C4', glow: '#FFF4C4', particle: '#FFFFFF' },
  { id: 'void', name: 'Void Black', primary: '#141026', secondary: '#3A2A5C', glow: '#8B7BFF', particle: '#B18CFF' },
];

const FASHION_BACKDROPS = ['Verdant Hollow', 'Crystalbrook Springs', 'Galaxy Gardens', 'Royal Blossom Kingdom', 'Creation Nexus'];
const FASHION_FILTERS = ['Soft glow', 'Warm bloom', 'Cool moon', 'Prism pop', 'Dreamy haze'];
const FASHION_POSES = ['Happy', 'Sleepy', 'Proud'];
const FASHION_TIMES = ['Dawn', 'Golden hour', 'Night'];

/* Which garment silhouette a set is cut from, so the worn custom outfit reads
   like the collection rather than a generic cape. */
const FASHION_GARMENTS = {
  springbloom: 'dress', sunflare: 'vest', harvest: 'hoodie', frostveil: 'cape',
  rainbowfestival: 'hoodie', galaxydream: 'kimono', royalblossom: 'crown',
  dragonfestival: 'armor', spiritmoon: 'kimono', crystalkingdom: 'armor',
  springqueen: 'dress', bloomqueen: 'dress', celestialbloom: 'kimono',
  genesis: 'cape', heartlight: 'dress', creator: 'cape',
};

/* The brief names effect layers with an icon; match the first keyword so the
   chips stay readable without storing an icon on every effect. */
const FASHION_EFFECT_ICONS = [
  [/petal|sakura|bloom/i, '🌸'], [/butterfl/i, '🦋'], [/sun/i, '☀️'], [/sand/i, '🏖️'],
  [/leaf|leaves/i, '🍁'], [/pumpkin/i, '🎃'], [/acorn/i, '🌰'], [/snow/i, '❄️'],
  [/aurora/i, '🌌'], [/footprint/i, '💎'], [/rainbow/i, '🌈'], [/confetti/i, '✨'],
  [/firework/i, '🎆'], [/planet/i, '🪐'], [/royal|kingdom|queen/i, '👑'],
  [/dragon/i, '🐉'], [/rune/i, '⚡'], [/moon/i, '🌙'], [/spirit|wisp/i, '👻'],
  [/crystal|gem|prism/i, '💎'], [/heart/i, '💖'], [/creation|reality|universe/i, '✨'],
  [/star|cosmic|galax|constellation/i, '⭐'], [/friend/i, '💫'], [/dream/i, '✨'],
];

function fashionEffectIcon(text) {
  const match = FASHION_EFFECT_ICONS.find(([pattern]) => pattern.test(text));
  return match ? match[1] : '✨';
}

/* Collection rarity drives the item-card frame, so the wardrobe uses the same
   palette as creature cards instead of inventing a second one. */
const FASHION_SET_RARITY = {
  springbloom: 'common', sunflare: 'uncommon', harvest: 'uncommon', frostveil: 'rare',
  rainbowfestival: 'rare', galaxydream: 'epic', royalblossom: 'legendary', dragonfestival: 'mythic',
  spiritmoon: 'rare', crystalkingdom: 'epic',
  springqueen: 'legendary', bloomqueen: 'legendary', celestialbloom: 'celestial',
  genesis: 'divine', heartlight: 'celestial', creator: 'creator',
};

const FASHION_WEATHERS = ['☀️ Clear', '🌧️ Rain', '❄️ Snow', '🌈 Rainbow', '⚡ Storm', '🌌 Galaxy'];

/* Puffle wardrobe slots, matched from the piece names the collections already
   list so the counts are real rather than invented. */
const FASHION_PUFFLE_SLOTS = [
  { name: 'Headwear', icon: '👑', words: ['crown', 'tiara', 'halo', 'cap', 'hat', 'horn'] },
  { name: 'Neckwear', icon: '🎀', words: ['collar', 'bow', 'ribbon', 'necklace', 'scarf', 'pendant'] },
  { name: 'Back items', icon: '🎒', words: ['cape', 'shell', 'backpack'] },
  { name: 'Wings', icon: '🦋', words: ['wings'] },
  { name: 'Costumes', icon: '👗', words: ['dress', 'robe', 'tunic', 'gown', 'mantle'] },
  { name: 'Auras', icon: '✨', words: ['aura', 'trail', 'glow'] },
  { name: 'Special', icon: '💎', words: ['crystal', 'cosmic', 'creation', 'star', 'galaxy'] },
];

/* ---- Mix & match: single pieces across collections ---- */

/* A mixed look earns the seasonal bonus only once the builder calls it
   harmonised; below this it is still wearable, just not a modifier. */
const FASHION_MIX_HARMONY = 80;

const FASHION_SPRITE_SLOTS = [
  { key: 'head', name: 'Headwear', icon: '\u{1F451}', words: ['crown', 'tiara', 'hat', 'hood', 'headband', 'horns', 'halo'] },
  { key: 'body', name: 'Garment', icon: '\u{1F457}', words: ['cape', 'tunic', 'dress', 'vest', 'jacket', 'hoodie', 'armor', 'cloak', 'mantle', 'robe', 'robes'] },
  { key: 'feet', name: 'Footwear', icon: '\u{1F463}', words: ['boots', 'sandals', 'shoes', 'sneakers', 'slippers'] },
  { key: 'extra', name: 'Accessory', icon: '\u{1F392}', words: ['satchel', 'wristbands', 'lantern', 'staff', 'backpack', 'gloves', 'belt', 'jewelry', 'shorts', 'leggings', 'necklace'] },
];

function fashionWords(name) {
  return String(name || '').toLowerCase().split(/[^a-z]+/).filter(Boolean);
}

/* Whole-word matching keeps "hood" from swallowing "hoodie" and "cap" from
   swallowing "cape"; the last slot is the catch-all for unusual pieces. */
function fashionSpriteSlot(name) {
  const words = fashionWords(name);
  return FASHION_SPRITE_SLOTS.find((slot) => slot.words.some((word) => words.includes(word))) || FASHION_SPRITE_SLOTS[FASHION_SPRITE_SLOTS.length - 1];
}

function fashionPuffleSlot(name) {
  const words = fashionWords(name);
  return FASHION_PUFFLE_SLOTS.find((slot) => slot.words.some((word) => words.includes(word))) || FASHION_PUFFLE_SLOTS[FASHION_PUFFLE_SLOTS.length - 1];
}

/* Sprite and Puffle pieces can share a name, so the side is always explicit. */
function fashionPieceEntry(name, side) {
  const field = side === 'puffle' ? 'puffle' : 'sprite';
  for (const set of FASHION_COLLECTIONS) {
    if (set[field].includes(name)) return { name, side: field, set, slot: field === 'puffle' ? fashionPuffleSlot(name) : fashionSpriteSlot(name) };
  }
  return null;
}

function fashionMixEntries(spritePieces, pufflePieces) {
  return []
    .concat((Array.isArray(spritePieces) ? spritePieces : []).map((name) => fashionPieceEntry(name, 'sprite')))
    .concat((Array.isArray(pufflePieces) ? pufflePieces : []).map((name) => fashionPieceEntry(name, 'puffle')))
    .filter(Boolean);
}

function fashionToneRgb(hex) {
  const value = String(hex || '').replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const num = parseInt(full, 16);
  return Number.isFinite(num) ? { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 } : { r: 177, g: 140, b: 255 };
}

function fashionToneDistance(a, b) {
  return Math.min(1, Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2) / 441.7);
}

/* The matching builder's score: palette closeness (35), season agreement (25),
   shared effects (20) and Sprite/Puffle pairing (20). One whole collection
   always scores 100; a cross-collection mix has to earn its harmony. */
function fashionMixInfo(spritePieces = [], pufflePieces = []) {
  const entries = fashionMixEntries(spritePieces, pufflePieces);
  if (!entries.length) {
    return { score: 0, entries, sets: [], season: null, tone: '#b18cff', effects: [], palette: 0, seasonScore: 0, effectScore: 0, pairingScore: 0, spriteCount: 0, puffleCount: 0, harmonised: false };
  }
  const sets = [...new Set(entries.map((entry) => entry.set))];

  const rugs = entries.map((entry) => fashionToneRgb(entry.set.tone));
  const average = rugs.reduce((acc, rgb) => ({ r: acc.r + rgb.r / rugs.length, g: acc.g + rgb.g / rugs.length, b: acc.b + rgb.b / rugs.length }), { r: 0, g: 0, b: 0 });
  const spread = rugs.reduce((sum, rgb) => sum + fashionToneDistance(rgb, average), 0) / rugs.length;
  const palette = Math.round(35 * Math.max(0, 1 - spread));

  const explicit = entries.filter((entry) => String(entry.set.season || '') !== 'Any season');
  const counts = {};
  explicit.forEach((entry) => {
    const key = String(entry.set.season).toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const bestKey = ranked[0] || null;
  const bestCount = bestKey ? counts[bestKey] : 0;
  const tied = ranked.length > 1 && counts[ranked[1]] === bestCount;
  const anyCount = entries.length - explicit.length;
  const seasonScore = Math.round(25 * ((bestCount + anyCount) / entries.length));
  const currentKey = typeof seasonOf === 'function' ? seasonOf().key : null;
  let seasonKey = null;
  if (bestKey && !tied && bestCount >= explicit.length / 2) seasonKey = bestKey;
  else if (!explicit.length && currentKey) seasonKey = currentKey;
  const season = seasonKey ? seasonKey.charAt(0).toUpperCase() + seasonKey.slice(1) : null;

  const effectCounts = {};
  sets.forEach((set) => [...new Set(set.effects)].forEach((effect) => { effectCounts[effect] = (effectCounts[effect] || 0) + 1; }));
  const union = Object.keys(effectCounts);
  const shared = union.filter((effect) => effectCounts[effect] > 1);
  const effectScore = sets.length === 1 ? 20 : 10 + Math.round(10 * (shared.length / Math.max(1, union.length)));
  const effects = union.slice(0, 4);

  const spriteCount = entries.filter((entry) => entry.side === 'sprite').length;
  const puffleCount = entries.length - spriteCount;
  const slots = new Set(entries.map((entry) => `${entry.side}:${entry.slot.name}`));
  const pairingScore = (spriteCount && puffleCount ? 10 : 0) + Math.round(10 * Math.min(1, slots.size / 7));

  const score = Math.max(0, Math.min(100, palette + seasonScore + effectScore + pairingScore));
  const tone = '#' + [average.r, average.g, average.b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('');
  return { score, entries, sets, season, tone, effects, palette, seasonScore, effectScore, pairingScore, spriteCount, puffleCount, harmonised: score >= FASHION_MIX_HARMONY };
}

/* Surprise-me rank. Palette fit comes first, then how much of the mix agrees on
   a season, then whether that season is the one the Hollow is in right now. */
function fashionSurpriseTheme(info, currentSeason) {
  const seasonMatch = !!(info.season && currentSeason && info.season.toLowerCase() === String(currentSeason).toLowerCase());
  return {
    season: info.season || '',
    palette: info.palette || 0,
    seasonScore: info.seasonScore || 0,
    score: info.score || 0,
    collections: (info.sets || []).length,
    currentSeason: seasonMatch,
    rank: (info.palette || 0) * 3 + (info.seasonScore || 0) * 2 + (info.season ? 6 : 0) + (seasonMatch ? 8 : 0),
  };
}

/* Pick a harmonised cross-collection mix without touching the DOM.

   Every pair of collections is searched exhaustively: start from one full set
   and choose either its piece or the matching second-set piece in every slot.
   That covers every possible two-collection mix, so a harmonised result is not
   left to a lucky one-swap retry. If no pair reaches the harmony threshold, a
   short beam explores a third collection before giving up.

   The strongest palette/season theme wins. A few equally strong candidates are
   kept so repeated rolls still vary, but a weaker palette or vague season never
   displaces the best theme. */
function fashionSurpriseMix(opts = {}) {
  const sets = (Array.isArray(opts.sets) ? opts.sets : FASHION_COLLECTIONS).filter(Boolean);
  const harmony = Number.isFinite(opts.harmony) ? opts.harmony : FASHION_MIX_HARMONY;
  const currentSeason = opts.currentSeason ? String(opts.currentSeason).toLowerCase() : null;
  const random = typeof opts.random === 'function' ? opts.random : Math.random;
  if (sets.length < 2) return null;

  const slots = [
    ...FASHION_SPRITE_SLOTS.map((slot) => ({ side: 'sprite', slot })),
    ...FASHION_PUFFLE_SLOTS.map((slot) => ({ side: 'puffle', slot })),
  ];
  const slotOf = (side, name) => side === 'puffle' ? fashionPuffleSlot(name) : fashionSpriteSlot(name);
  const pieceFor = (set, side, slot) => (set[side] || []).find((name) => slotOf(side, name).name === slot.name) || '';
  const keyFor = (sprite, puffle) => `${sprite.slice().sort().join('\u0001')}\u0002${puffle.slice().sort().join('\u0001')}`;
  const seen = new Set();
  const all = [];
  const valid = [];

  const recordFor = (sprite, puffle) => {
    const key = keyFor(sprite, puffle);
    if (seen.has(key)) return null;
    seen.add(key);
    const info = fashionMixInfo(sprite, puffle);
    if (!info.entries.length) return null;
    const record = { sprite: sprite.slice(), puffle: puffle.slice(), info, theme: fashionSurpriseTheme(info, currentSeason) };
    all.push(record);
    if (info.sets.length >= 2 && info.score >= harmony) valid.push(record);
    return record;
  };

  /* Exhaustive two-collection pass. `base` fills the slots; the second set can
     replace any subset of them. The base set is never completely removed, so
     every result is genuinely cross-collection. */
  for (let first = 0; first < sets.length - 1; first += 1) {
    for (let second = first + 1; second < sets.length; second += 1) {
      const base = sets[first];
      const other = sets[second];
      const choices = slots.map(({ side, slot }) => {
        const own = pieceFor(base, side, slot);
        const guest = pieceFor(other, side, slot);
        return { side, own, guest: guest && guest !== own ? guest : '' };
      });
      const walk = (index, sprite, puffle, hasGuest) => {
        if (index >= choices.length) {
          if (hasGuest) recordFor(sprite, puffle);
          return;
        }
        const { side, own, guest } = choices[index];
        if (own) walk(index + 1, side === 'sprite' ? [...sprite, own] : sprite, side === 'puffle' ? [...puffle, own] : puffle, hasGuest);
        if (guest) walk(index + 1, side === 'sprite' ? [...sprite, guest] : sprite, side === 'puffle' ? [...puffle, guest] : puffle, true);
        /* Not every collection fills every optional slot; an empty slot must
           still let the search reach the slots after it. */
        if (!own && !guest) walk(index + 1, sprite, puffle, hasGuest);
      };
      walk(0, [], [], false);
    }
  }

  /* A third collection usually lowers palette harmony, but it can rescue a mix
     when two same-season sets are just short. Keep this bounded. */
  if (!valid.length) {
    let frontier = all.slice().sort((a, b) => b.theme.rank - a.theme.rank || b.info.score - a.info.score).slice(0, 120);
    for (let depth = 0; depth < 2 && !valid.length && frontier.length; depth += 1) {
      const before = all.length;
      frontier.forEach((record) => {
        const used = new Set(record.info.sets.map((set) => set.id));
        slots.forEach(({ side, slot }) => {
          const current = (side === 'sprite' ? record.sprite : record.puffle).find((name) => slotOf(side, name).name === slot.name) || '';
          sets.forEach((set) => {
            if (used.has(set.id)) return;
            const name = pieceFor(set, side, slot);
            if (!name || name === current) return;
            const next = { sprite: record.sprite.slice(), puffle: record.puffle.slice() };
            const target = side === 'sprite' ? next.sprite : next.puffle;
            const at = target.findIndex((piece) => slotOf(side, piece).name === slot.name);
            if (at >= 0) target.splice(at, 1, name);
            else target.push(name);
            recordFor(next.sprite, next.puffle);
          });
        });
      });
      frontier = all.slice(before).sort((a, b) => b.theme.rank - a.theme.rank || b.info.score - a.info.score).slice(0, 160);
    }
  }

  if (!valid.length) return null;
  valid.sort((a, b) => b.theme.rank - a.theme.rank || b.info.palette - a.info.palette || b.info.score - a.info.score);
  const best = valid[0];
  const finalists = valid.filter((record) => record.theme.rank >= best.theme.rank - 2
    && record.theme.palette >= best.theme.palette - 1
    && record.theme.seasonScore >= best.theme.seasonScore - 1);
  const shortlist = finalists.length ? finalists : [best];
  const index = Math.min(shortlist.length - 1, Math.floor(Math.max(0, Math.min(0.999999, Number(random()) || 0)) * shortlist.length));
  const chosen = shortlist[index];
  return {
    sprite: chosen.sprite.slice(),
    puffle: chosen.puffle.slice(),
    info: chosen.info,
    collections: chosen.info.sets.length,
    theme: {
      ...chosen.theme,
      bestPalette: best.theme.palette,
      bestSeasonScore: best.theme.seasonScore,
      bestRank: best.theme.rank,
    },
  };
}

/* A worn mix behaves like a set only when the builder harmonised it and the
   pieces agree on a season; otherwise there is nothing to apply. */
function fashionMixSet(sprite) {
  const s = sprite || (typeof activeSprite === 'function' ? activeSprite() : null);
  const look = s && s.wardrobeLook;
  if (!look || look.setId !== 'mixed') return null;
  const pufflePieces = s.puffleWardrobeLook && s.puffleWardrobeLook.setId === 'mixed' ? s.puffleWardrobeLook.pieces : [];
  const info = fashionMixInfo(look.pieces, pufflePieces);
  if (info.score < FASHION_MIX_HARMONY || !info.season) return null;
  return {
    id: 'mixed', name: 'Mixed look', icon: '\u{1F9E9}', group: 'mix', mixed: true,
    season: info.season, tone: info.tone, effects: info.effects,
    sprite: Array.isArray(look.pieces) ? look.pieces.slice() : [],
    puffle: Array.isArray(pufflePieces) ? pufflePieces.slice() : [],
    score: info.score,
  };
}
