/* Game state, persistence, real-time simulation, and all player actions. */

const SAVE_KEY = 'sprite-hollow.save.v2';
const MAX_LEVEL = 10000;
/* The Puffle Hotel floor. Declared up here because hydrateSave() runs at module
   load and repairs a saved floor before any hotel helper has been defined. */
const HOTEL_ROOM_COUNT = 6;
const HOTEL_STAY_COINS = 30;
/* A stay is one night, not an open-ended spa pass. The floor serves the room
   until dawn, eight in-game hours after check-in, and then the guest leaves on
   their own with a tip. In-game hours track wall-clock hours (the save's days
   do too), so dawn arrives the same way whether the keeper is watching or the
   save is reopened the next morning. */
const HOTEL_STAY_HOURS = 8;
const HOTEL_STAY_MS = HOTEL_STAY_HOURS * 60 * 60 * 1000;
const HOTEL_TIP_SHARE = 0.6;
const TRAVEL_COINS = 10;
const SEASON_CHARGE_GOAL = 3;
/* Phase 0 economy values live in data-first-flight.js so the booted-frame
   regression and the runtime cannot drift apart. */
const FF_RULES = typeof FIRST_FLIGHT_RULES !== 'undefined' ? FIRST_FLIGHT_RULES : Object.freeze({
  STARTING_COINS: 215,
  GAME_COIN_BASE: 100,
  GAME_COIN_SCORE_VALUE: 10,
  GAME_COIN_CAP: 200,
  BATH_XP: 8,
  BATH_COINS: 3,
  BATH_COOLDOWN_MS: 20000,
  WALK_TARGET_COINS: 200,
});
const STARTING_COINS = FF_RULES.STARTING_COINS;
const GAME_COIN_BASE = FF_RULES.GAME_COIN_BASE;
const GAME_COIN_SCORE_VALUE = FF_RULES.GAME_COIN_SCORE_VALUE;
const GAME_COIN_CAP = FF_RULES.GAME_COIN_CAP;
const GAME_COIN_BASE_CAP = GAME_COIN_CAP;
const BATH_XP = FF_RULES.BATH_XP;
const BATH_COINS = FF_RULES.BATH_COINS;
const BATH_COOLDOWN_MS = FF_RULES.BATH_COOLDOWN_MS;

const CUSTOM_CLOTH_STYLES = {
  cape: { name: 'Cape', icon: '🦸' },
  scarf: { name: 'Scarf', icon: '🧣' },
  hoodie: { name: 'Hoodie', icon: '🧥' },
  vest: { name: 'Vest', icon: '🎽' },
  dress: { name: 'Dress', icon: '👗' },
  armor: { name: 'Armor', icon: '🛡️' },
  hat: { name: 'Hat', icon: '🎩' },
  boots: { name: 'Boots', icon: '👢' },
  crown: { name: 'Crown', icon: '👑' },
  bowtie: { name: 'Bow tie', icon: '🎀' },
  glasses: { name: 'Glasses', icon: '🤓' },
  overalls: { name: 'Overalls', icon: '👖' },
  kimono: { name: 'Kimono', icon: '🥋' },
  backpack: { name: 'Backpack', icon: '🎒' },
};
const CUSTOM_CLOTH_STYLE_KEYS = Object.keys(CUSTOM_CLOTH_STYLES);

/* Patterns are stitched onto a garment, so two outfits in the same style can
   still look different. */
const CUSTOM_CLOTH_PATTERNS = {
  plain: 'Plain',
  stripes: 'Striped',
  dots: 'Dotted',
  checks: 'Checkered',
  stars: 'Starry',
  hearts: 'Hearts',
  zigzag: 'Zigzag',
  trim: 'Trimmed',
};
const CUSTOM_CLOTH_PATTERN_KEYS = Object.keys(CUSTOM_CLOTH_PATTERNS);

/* Stitch size sets how densely a pattern is drawn. The motif is scaled about the
   chest, so a fine stitch stays legible on a small sprite instead of swallowing
   the whole garment. `ink` is the pattern's resting opacity. */
const CUSTOM_CLOTH_SIZES = {
  fine: { name: 'Fine', scale: 0.66, ink: 0.24 },
  medium: { name: 'Medium', scale: 1, ink: 0.3 },
  bold: { name: 'Bold', scale: 1.34, ink: 0.36 },
};
const CUSTOM_CLOTH_SIZE_KEYS = Object.keys(CUSTOM_CLOTH_SIZES);

function safeHexColor(value, fallback) {
  const text = String(value || '').trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function normalizeCustomCloth(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const name = String(s.name || '').trim().slice(0, 24);
  return {
    id: String(s.id || uid('cloth')).replace(/[^a-zA-Z0-9_-]/g, '') || uid('cloth'),
    name: name || 'Custom outfit',
    style: CUSTOM_CLOTH_STYLES[s.style] ? s.style : 'cape',
    primary: safeHexColor(s.primary, BRAND.accent),
    secondary: safeHexColor(s.secondary, BRAND.gold),
    pattern: CUSTOM_CLOTH_PATTERNS[s.pattern] ? s.pattern : 'plain',
    stitch: CUSTOM_CLOTH_SIZES[s.stitch] ? s.stitch : 'medium',
    createdAt: Number(s.createdAt) || Date.now(),
  };
}

/* Frame presets sit beside the active frame palette. A preset is a named
   snapshot of the three colours and the three motion choices; applying one
   always uses the existing Custom colours mode, leaving Daily auto intact. */
const FRAME_PRESET_LIMIT = 24;
const FRAME_PRESET_MOTIONS = ['sweep', 'breathe', 'pulse', 'still'];
const FRAME_INTENSITY_MIN = 0.35;
const FRAME_INTENSITY_MAX = 1;

/* Old saves and share codes predate intensity. They open at full strength; a
   hand-edited value outside the slider's range is clamped rather than trusted. */
function normalizeFrameIntensity(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return FRAME_INTENSITY_MAX;
  return Math.min(FRAME_INTENSITY_MAX, Math.max(FRAME_INTENSITY_MIN, Math.round(number * 100) / 100));
}

function normalizeFramePreset(raw) {
  const p = raw && typeof raw === 'object' ? raw : {};
  const name = String(p.name || '').trim().slice(0, 24);
  const id = String(p.id || uid('frame')).replace(/[^a-zA-Z0-9_-]/g, '') || uid('frame');
  const motion = (value) => (FRAME_PRESET_MOTIONS.includes(value) ? value : 'sweep');
  return {
    id,
    name: name || 'Saved frame',
    a: safeHexColor(p.a, '#ff9f43'),
    b: safeHexColor(p.b, BRAND.accent2),
    c: safeHexColor(p.c, '#6c8bff'),
    intensity: normalizeFrameIntensity(p.intensity),
    entry: motion(p.entry),
    loading: motion(p.loading),
    menu: motion(p.menu),
    createdAt: Number(p.createdAt) || Date.now(),
  };
}

function normalizeFramePresets(raw) {
  const seen = new Set();
  return (Array.isArray(raw) ? raw : []).slice(0, FRAME_PRESET_LIMIT).map(normalizeFramePreset).filter((preset) => {
    if (seen.has(preset.id)) return false;
    seen.add(preset.id);
    return true;
  });
}

function normalizeLook(raw) {
  const l = raw && typeof raw === 'object' ? raw : {};
  const name = String(l.name || '').trim().slice(0, 28);
  const colors = l.colors && typeof l.colors === 'object' ? l.colors : {};
  return {
    id: String(l.id || uid('look')).replace(/[^a-zA-Z0-9_-]/g, '') || uid('look'),
    name: name || 'Saved look',
    setId: String(l.setId || '').trim().slice(0, 40) || null,
    pieces: Array.isArray(l.pieces) ? l.pieces.filter((piece) => typeof piece === 'string').slice(0, 16) : [],
    spriteId: l.spriteId ? String(l.spriteId) : null,
    style: CUSTOM_CLOTH_STYLES[l.style] ? l.style : 'cape',
    pattern: CUSTOM_CLOTH_PATTERNS[l.pattern] ? l.pattern : 'plain',
    colors: {
      primary: safeHexColor(colors.primary, '#ffb3d1'),
      secondary: safeHexColor(colors.secondary, BRAND.gold),
      glow: safeHexColor(colors.glow, '#bde8ff'),
      particle: safeHexColor(colors.particle, '#ffe58a'),
    },
    effects: Array.isArray(l.effects) ? l.effects.filter((e) => typeof e === 'string').slice(0, 12) : [],
    scene: typeof l.scene === 'string' && SCENES[l.scene] ? l.scene : null,
    weather: typeof l.weather === 'string' ? l.weather : null,
    photo: l.photo && typeof l.photo === 'object' ? {
      pose: String(l.photo.pose || 'Happy').slice(0, 20),
      filter: String(l.photo.filter || 'Soft glow').slice(0, 20),
      time: String(l.photo.time || 'Golden hour').slice(0, 20),
      background: String(l.photo.background || 'Verdant Hollow').slice(0, 30),
    } : null,
    puffle: normalizePuffleLook(l.puffle),
    createdAt: Number(l.createdAt) || Date.now(),
  };
}

/* The Puffle half of a matching look: which collection is worn, the cloth that
   draws it, the pieces the wardrobe should tick, and the shared effects. */
function normalizePuffleLook(raw) {
  const p = raw && typeof raw === 'object' ? raw : null;
  if (!p) return null;
  const colors = p.colors && typeof p.colors === 'object' ? p.colors : {};
  return {
    setId: String(p.setId || '').trim().slice(0, 40) || null,
    name: String(p.name || '').trim().slice(0, 28) || 'Pufflea look',
    clothId: p.clothId ? String(p.clothId) : null,
    style: CUSTOM_CLOTH_STYLES[p.style] ? p.style : 'cape',
    pattern: CUSTOM_CLOTH_PATTERNS[p.pattern] ? p.pattern : 'plain',
    colors: {
      primary: safeHexColor(colors.primary, '#ffb3d1'),
      secondary: safeHexColor(colors.secondary, BRAND.gold),
    },
    effects: Array.isArray(p.effects) ? p.effects.filter((e) => typeof e === 'string').slice(0, 12) : [],
    pieces: Array.isArray(p.pieces) ? p.pieces.filter((piece) => typeof piece === 'string').slice(0, 16) : [],
    at: Number(p.at) || 0,
  };
}

/* A worn collection or a mixed look; the piece list is what lets a mix keep
   its score (and therefore its seasonal bonus) across a reload. */
function normalizeWardrobeLook(raw) {
  const w = raw && typeof raw === 'object' ? raw : null;
  if (!w) return null;
  const colors = w.colors && typeof w.colors === 'object' ? w.colors : {};
  return {
    setId: String(w.setId || '').trim().slice(0, 40) || null,
    pieces: Array.isArray(w.pieces) ? w.pieces.filter((piece) => typeof piece === 'string').slice(0, 16) : [],
    colors: {
      primary: safeHexColor(colors.primary, '#ffb3d1'),
      secondary: safeHexColor(colors.secondary, BRAND.gold),
      glow: safeHexColor(colors.glow, '#bde8ff'),
      particle: safeHexColor(colors.particle, '#ffe58a'),
    },
    effects: Array.isArray(w.effects) ? w.effects.filter((effect) => typeof effect === 'string').slice(0, 12) : [],
    photo: w.photo && typeof w.photo === 'object' ? w.photo : null,
    at: Number(w.at) || 0,
  };
}

function normalizeCustomScene(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const name = String(s.name || '').trim().slice(0, 28);
  const habitat = String(s.habitat || '').trim().slice(0, 20);
  const id = String(s.id || uid('scene')).replace(/[^a-zA-Z0-9_-]/g, '') || uid('scene');
  return {
    id,
    name: name || 'My Biome',
    habitat: habitat || 'Custom',
    emoji: String(s.emoji || '🌍').trim().slice(0, 4) || '🌍',
    sky: safeHexColor(s.sky, '#3b2f6b'),
    ground: safeHexColor(s.ground, '#35603d'),
    accent: safeHexColor(s.accent, BRAND.gold),
    bonus: s.bonus === 0.4 || s.bonus === 0.45 ? s.bonus : 0.5,
    custom: true,
    allSprites: true,
    unlocked: true,
    species: [],
    blurb: 'A custom environment made by you. Every sprite is welcome here, without a resident limit.',
    createdAt: Number(s.createdAt) || Date.now(),
  };
}

function registerCustomScene(raw) {
  const scene = normalizeCustomScene(raw);
  if (!scene || !scene.id) return null;
  SCENES[scene.id] = scene;
  if (!SCENE_KEYS.includes(scene.id)) SCENE_KEYS.push(scene.id);
  return scene;
}

function unregisterCustomScene(id) {
  delete SCENES[id];
  const idx = SCENE_KEYS.indexOf(id);
  if (idx >= 0) SCENE_KEYS.splice(idx, 1);
}

function freshState() {
  return {
    v: 2,
    started: false,
    createdAt: Date.now(),
    hollowName: 'Mosslight Hollow',
    coins: STARTING_COINS,
    sprites: [],
    activeId: null,
    theme: { ui: 'prism', scene: 'grove', font: 'rounded', glow: 'soft', loader: 'stars', title: 'Sprite Hollow', tagline: 'A tiny creature sanctuary', titleBackdrop: 'theme', titleColor1: '#1b1740', titleColor2: '#0b0a16', titleAngle: 145, titleImage: '', titleDim: 45, frame: { mode: 'daily', a: '#ff9f43', b: BRAND.accent2, c: '#6c8bff', intensity: 1, entry: 'sweep', loading: 'sweep', menu: 'sweep', presets: [] }, sound: true, motion: true, haptics: true, voice: true, voiceType: 'female', language: 'en', captions: true, fluff: 'soft', elementFx: 'soft', motion: 'full', musicVolume: 65, weatherVolume: 45, speciesFacades: true, summonVolume: 100, reminders: true, spriteVoice: true, coldHatch: true, summonCovers: false },
    /* The Collection's rarity lens travels with the save: the tier chip and the
       sort survive a tab change and an app restart, like the Nest's egg sort. */
    collection: { tier: 'all', sort: 'level' },
    world: { climate: 'temperate', weather: null, eventPreset: null, badges: [] },
    wardrobe: [],
    customClothes: [],
    looks: [],
    customScenes: [],
    foodUnlocks: [],
    cafeRecipes: [],
    daily: null,
    weekly: null,
    monthly: null,
    weeklyEvents: { weekKey: null, claims: [] },
    weeklyTreats: { week: null, claimed: [] },
    quiz: { date: null, readyAt: 0, doneDate: null },
    waveGames: {},
    favoriteGames: [],
    /* One pinned species per band, used by the windowed tier bands. */
    tierPins: {},
    arcade: { coins: 0, bonusClaims: 0, monthKey: null, monthCoins: 0, monthClaims: [] },
    checkin: {
      last: null, streak: 0,
      slotsDate: null, slots: [],
      weekKey: null, weekSlots: 0, weekClaims: [], weekStreak: 0,
      monthKey: null, monthDays: 0, monthSlots: 0, monthClaims: [], monthStreak: 0,
      yearKey: null, yearDays: 0, yearSlots: 0, yearClaims: [], yearStreak: 0,
      monthCrateKey: null,
    },
    inventory: { snacks: { water: 5 }, foods: {} },
    unlockedScenes: SCENE_KEYS.filter((k) => SCENES[k].unlocked),
    homes: {},
    houses: {},
    storyShelf: [],
    homeUpgrades: {},
    leafHomes: {},
    speciesHomes: {},
    biomeQuests: {},
    seasonCharge: { points: 0, eggs: 0 },
    roomLayout: {},
    roomPresets: [],
    furnitureFavorites: [],
    roomTheme: 'honey',
    typeEggSort: 'cheapest',
    /* Per family id: how many completion milestones have been claimed. */
    familyClaims: {},
    wishlist: [],
    houseTints: {},
    houseTintStrengths: {},
    customGuardians: [],
    geneDesigns: [],
    vaultDoors: [],
    guardiansBeaten: {},
    /* Hollow Eclipse enemies are purified, not beaten: this is their own credit,
       so a wisp never counts as a win over its element's guardian. */
    enemiesPurified: {},
    gift: null,
    care: { tokens: 0, gifts: 0 },
    /* Puffle Hotel care moments fill their own counter, so spa visits earn
       hotel treats and meals without changing the Care Bear package track. */
    hotel: { careTokens: 0, careGifts: 0, lastStay: null, guests: [] },
    /* The Daily Wheel: today's free spin and paid allowance, plus lifetime
       winnings. Reset hands over a new wheel; the coins stay banked. */
    wheel: { day: null, free: false, paid: 0, won: 0, lifetime: 0 },
    journal: [],
    stats: {
      pets: 0, feeds: 0, baths: 0, naps: 0, chats: 0, games: 0,
      merges: 0, hatches: 0, earned: 0, spent: 0, bestStreak: 0,
      checkins: 0, twins: 0, specials: 0, evolves: 0, gifts: 0, wild: 0, tucks: 0, shinies: 0, candyMorphs: 0,
      walks: 0, walkDistance: 0, bestWalk: 0, walkGifts: 0, sports: 0, sportGifts: 0,
      arcadeCoins: 0, arcadeGifts: 0, arcadeMonthGifts: 0, careGifts: 0, quests: 0, duels: 0, purified: 0, travels: 0,
      rubs: 0, throws: 0, catches: 0, tasksClaimed: 0, rebirths: 0,
      hotelCareGifts: 0, hotelStays: 0, hotelCheckOuts: 0, hotelDawnCheckOuts: 0,
      hairBrushes: 0, teethBrushes: 0, mouthwashes: 0, grooms: 0,
      dailyEggs: 0, holidayGifts: 0, weekendGifts: 0, seasonEggs: 0,
      temps: 0, medicines: 0, doctorVisits: 0, colds: 0, cured: 0,
      /* voice key -> first time that voice spoke, for the wiki's voice guide. */
      voiceHeard: {},
    },
    seen: { intro: false, tour: false, worldheartFinale: false },
    /* The induction tour's last open step, kept even after the sheet closes so
       Studio can resume it. completeTour and Skip reset it to the first step. */
    tourStep: 0,
    secretUnlocks: [],
    /* Finishes are permanent account-wide unlocks once a hatched sprite has
       carried one. Applying a finish never consumes it or its ownership. */
    finishUnlocks: [],
    codeRedeems: {},
    /* Second Flight: the one path picked after First Flight is claimed. Only
       the pick and the dismissal are stored; the action is derived. */
    flight2: { picked: null, dismissed: false, startedAt: 0 },
    /* Weekly challenge: the week key and the local best only. Medals are
       derived, so nothing here can claim a score it did not earn. */
    challenge: { week: '', best: 0 },
    /* Per-game score records: best, plays and the last run. Written by
       Actions.finishGame, so every mini game has one. */
    gameScores: {},
    /* First Flight: the guided first session. Only flags and the start stamp
       are stored; which step is next is always derived from the save. */
    flight: {
      startedAt: 0,
      claimed: false,
      skipped: false,
      migrated: false,
      giftClaimed: false,
      fusionId: null,
      waiverUsed: false,
    },
    biomesVisited: [],
    eggGift: null,
    holidayGift: null,
    weekendGift: null,
    lastTick: Date.now(),
  };
}

// Sprite names are typed by the player and then placed into HTML templates,
// so angle brackets are removed before a name is stored or loaded.
function cleanSpriteName(value) {
  return String(value || '').replace(/[<>]/g, '');
}

/* Rename and adopt both store the same trimmed, 16-character name. */
function applySpriteName(sprite, name) {
  const clean = cleanSpriteName(name).trim().slice(0, 16);
  sprite.name = clean || sprite.name || makeName(sprite.element);
}

function normalizeSprite(raw) {
  const s = raw || {};
  // The Master Cheat is unlisted and ignores the normal rules: it always loads
  // fully grown and awake, even from an old save that stored a low level or
  // had it retired (retirement freezes XP, so that state could never recover).
  const elementKey = ELEMENTS[s.element] ? s.element : 'bloom';
  const isMasterCheat = typeof MASTER_CHEAT_SPECIES !== 'undefined' && elementKey === MASTER_CHEAT_SPECIES;
  const level = isMasterCheat ? MAX_LEVEL : clamp(Number(s.level) || 1, 1, MAX_LEVEL);
  const sprite = {
    id: s.id || uid('sp'),
    name: cleanSpriteName(s.name) || null,
    element: elementKey,
    hybrid: s.hybrid || null,
    hybridParents: s.hybridParents || null,
    breed: BREEDS[s.breed] ? s.breed : 'puff',
    skin: typeof s.skin === 'string' && s.skin ? s.skin : null,
    palette: s.palette || 'native',
    custom: s.custom && typeof s.custom === 'object' ? s.custom : null,
    head: typeof HEAD_SHAPES !== 'undefined' && HEAD_SHAPES[s.head] ? s.head : 'breed',
    shape: typeof BODY_SHAPES !== 'undefined' && BODY_SHAPES[s.shape] ? s.shape : 'breed',
    ears: typeof EAR_STYLES !== 'undefined' && EAR_STYLES[s.ears] ? s.ears : 'breed',
    hair: typeof HAIR_STYLES !== 'undefined' && HAIR_STYLES[s.hair] ? s.hair : 'none',
    fur: typeof FUR_STYLES !== 'undefined' && FUR_STYLES[s.fur] ? s.fur : 'puffle',
    furTip: typeof s.furTip === 'string' && /^#[0-9a-f]{6}$/i.test(s.furTip) ? s.furTip : null,
    furAccent: typeof s.furAccent === 'string' && /^#[0-9a-f]{6}$/i.test(s.furAccent) ? s.furAccent : null,
    furCover: Number.isFinite(Number(s.furCover)) ? Math.round(clamp(Number(s.furCover), 0, 100)) : (typeof FUR_COVER_DEFAULT !== 'undefined' ? FUR_COVER_DEFAULT : 65),
    wings: typeof WING_STYLES !== 'undefined' && WING_STYLES[s.wings] ? s.wings : null,
    wingColor: typeof s.wingColor === 'string' && /^#[0-9a-f]{6}$/i.test(s.wingColor) ? s.wingColor : null,
    hue: Number.isFinite(Number(s.hue)) ? ((Math.round(Number(s.hue)) % 360) + 360) % 360 : 0,
    hat: typeof HAT_STYLES !== 'undefined' && HAT_STYLES[s.hat] ? s.hat : 'none',
    scarf: typeof SCARF_STYLES !== 'undefined' && SCARF_STYLES[s.scarf] ? s.scarf : 'none',
    arms: typeof ARM_STYLES !== 'undefined' && ARM_STYLES[s.arms] ? s.arms : 'nub',
    legs: typeof LEG_STYLES !== 'undefined' && LEG_STYLES[s.legs] ? s.legs : 'breed',
    eyes: s.eyes === 'breed' || (typeof EYE_STYLES !== 'undefined' && EYE_STYLES[s.eyes]) ? s.eyes : 'breed',
    mouth: typeof MOUTH_STYLES !== 'undefined' && MOUTH_STYLES[s.mouth] ? s.mouth : 'breed',
    iris: typeof s.iris === 'string' && /^#[0-9a-f]{6}$/i.test(s.iris) ? s.iris : null,
    faceCustom: !!s.faceCustom,
    nose: typeof NOSE_STYLES !== 'undefined' && NOSE_STYLES[s.nose] ? s.nose : 'none',
    pattern: PATTERNS[s.pattern] ? s.pattern : 'plain',
    accessory: ACCESSORIES[s.accessory] ? s.accessory : 'none',
    outfit: typeof s.outfit === 'string' && s.outfit ? s.outfit : null,
    wardrobeLook: normalizeWardrobeLook(s.wardrobeLook),
    puffleOutfit: typeof s.puffleOutfit === 'string' && s.puffleOutfit ? s.puffleOutfit : null,
    puffleWardrobeLook: normalizePuffleLook(s.puffleWardrobeLook),
    personality: PERSONALITIES[s.personality] ? s.personality : 'sunny',
    gender: GENDERS[s.gender] ? s.gender : genderFromId(s.id),
    mutation: s.mutation || null,
    variant: FINISHES[s.variant] ? s.variant
      : FINISHES[ELEMENTS[s.element]?.forcedVariant] ? ELEMENTS[s.element].forcedVariant
      : null,
    /* The picked puffle style survives a reload; an unknown key is dropped so
       the species' own elemental style shows instead. */
    /* Classic colours live in the palette table; a Puffle Creature's canon coat is
       resolved by its own species table, so both survive a save. The check reads
       the saved key alone: `form` is still the raw id here, and a legacy
       `pc_dinosaur` save is only mapped to `pc_trex` further down this literal. */
    puffleVariant: typeof s.puffleVariant === 'string' && (
      (typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS && window.LUMI_PUFFLE_VARIANTS[s.puffleVariant])
      || (typeof cpCreatureStylePalette === 'function' && cpCreatureStylePalette(s.puffleVariant))
    ) ? s.puffleVariant : null,
    shiny: !!s.shiny,
    shinyRolled: !!s.shinyRolled,
    size: SIZES[s.size] ? s.size : 'standard',
    diet: {
      hearty: Math.max(0, Number(s.diet?.hearty) || 0),
      sweet: Math.max(0, Number(s.diet?.sweet) || 0),
      eerie: Math.max(0, Number(s.diet?.eerie) || 0),
      wild: Math.max(0, Number(s.diet?.wild) || 0),
    },
    cuisine: Object.keys(CUISINE_PATHS).reduce((out, key) => {
      out[key] = Math.max(0, Number(s.cuisine?.[key]) || 0);
      return out;
    }, {}),
    sugar: Math.min(2, Math.max(0, Number(s.sugar) || 0)),
    rarityBoost: Math.max(0, Math.min(RARITY_BOOST_MAX, Math.floor(Number(s.rarityBoost) || 0))),
    form: EVOLUTION_FORMS[s.form] ? s.form : (typeof LEGACY_EVOLUTION_FORMS !== 'undefined' ? LEGACY_EVOLUTION_FORMS[s.form] : null) || null,
    /* A picked ability branch outlives reloads; a malformed pick is dropped so
       the sprite simply offers the choice again. */
    abilityPath: s.abilityPath && typeof s.abilityPath === 'object' && typeof s.abilityPath.branch === 'string'
      ? { element: typeof s.abilityPath.element === 'string' ? s.abilityPath.element : null, branch: s.abilityPath.branch, at: Number(s.abilityPath.at) || 0 }
      : null,
    creatorPath: typeof s.creatorPath === 'string' && CREATOR_PATHS.some((path) => path.key === s.creatorPath) ? s.creatorPath : null,
    special: COMBOS.some((c) => c.id === s.special) ? s.special : null,
    evolvedAt: Number(s.evolvedAt) || 0,
    stage: s.stage === 'egg' ? 'egg' : stageForLevel(level),
    level,
    xp: level >= MAX_LEVEL ? 0 : Math.max(0, Number(s.xp) || 0),
    bond: clamp(Number(s.bond) || 0),
    gen: Number(s.gen) || 0,
    needs: {
      hunger: clamp(Number(s.needs?.hunger) ?? 70),
      energy: clamp(Number(s.needs?.energy) ?? 72),
      joy: clamp(Number(s.needs?.joy) ?? 70),
      clean: clamp(Number(s.needs?.clean) ?? 78),
    },
    illness: normalizeIllness(s.illness),
    hatch: isMasterCheat ? 100 : clamp(Number(s.hatch) || 0),
    born: s.born || Date.now(),
    asleep: !!s.asleep,
    sleepUntil: Number(s.sleepUntil) || 0,
    sleepStart: Number(s.sleepStart) || (s.asleep ? Math.max(0, (Number(s.sleepUntil) || 0) - NAP_MS) : 0),
    sleepCycles: s.asleep ? clamp(Number(s.sleepCycles) || 1, 1, SLEEP_CYCLES) : 0,
    lastDream: s.lastDream && typeof s.lastDream === 'object' && s.lastDream.text
      ? { text: String(s.lastDream.text), at: Number(s.lastDream.at) || Date.now(), cycles: Math.max(1, Number(s.lastDream.cycles) || 1) }
      : null,
    lastPet: Number(s.lastPet) || 0,
    lastChatReward: Number(s.lastChatReward) || 0,
    /* When this puffle last spoke, when it last gave a gift, the quest total it
       had heard about, and the topic it was last asked about, so chat can tell a
       returning friend from someone who has been away and pick the conversation
       back up. A retired `voice.gifts` count is dropped here. */
    voice: {
      at: Number(s.voice && s.voice.at) || 0,
      giftAt: Number(s.voice && s.voice.giftAt) || 0,
      quests: Number(s.voice && s.voice.quests) || 0,
      topic: s.voice && typeof s.voice.topic === 'string' ? s.voice.topic.slice(0, 16) : null,
      topicAt: Number(s.voice && s.voice.topicAt) || 0,
    },
    lastBath: Number(s.lastBath) || 0,
    hygiene: {
      hair: clamp(Number(s.hygiene?.hair ?? 72)),
      teeth: clamp(Number(s.hygiene?.teeth ?? 70)),
      breath: clamp(Number(s.hygiene?.breath ?? 74)),
    },
    lastHairBrush: Number(s.lastHairBrush) || 0,
    lastTeethBrush: Number(s.lastTeethBrush) || 0,
    lastFloss: Number(s.lastFloss) || 0,
    lastMouthwash: Number(s.lastMouthwash) || 0,
    pendingXp: Math.max(0, Number(s.pendingXp) || 0),
    restUntil: Number(s.restUntil) || 0,
    lineage: s.lineage || null,
    starter: !!s.starter,
    retired: isMasterCheat ? false : !!s.retired,
    retiredAt: isMasterCheat ? 0 : Number(s.retiredAt) || 0,
    eggLabel: s.eggLabel || null,
    rebirths: Math.max(0, Number(s.rebirths) || 0),
    atHome: !!s.atHome,
    homeSince: Number(s.homeSince) || 0,
    homeCoins: Math.max(0, Number(s.homeCoins) || 0),
    sharedHouse: typeof s.sharedHouse === 'string' && s.sharedHouse ? s.sharedHouse : null,
  };
  /* A Club Penguin Puffle wears the colour its own evolution line has reached. */
  if (typeof syncCpPuffleEvolutionColour === 'function') syncCpPuffleEvolutionColour(sprite);
  return sprite;
}

/* A missing live key is only a first run when there is no other copy on this
   device. A slot or recovery copy means the live save vanished after a failed
   switch/write, so boot must recover instead of adopting a fresh Hollow. */
function hasBootRecoveryCopy() {
  try {
    const index = Number(localStorage.getItem('sprite-hollow.slot.active'));
    if (index >= 1 && index <= 4) {
      if (localStorage.getItem(`sprite-hollow.slot.${index}`)) return true;
    }
  } catch (err) { /* unavailable storage is handled by the caller */ }
  return typeof SaveIntegrity !== 'undefined'
    && typeof SaveIntegrity.hasRecoverableCopy === 'function'
    && SaveIntegrity.hasRecoverableCopy();
}

/* Inspect the live save without hydrating it or writing anything.

   Boot needs to know whether the bytes are readable before it calls saveState()
   for the first time. Keeping this step pure means a damaged save is never
   overwritten by the fresh fallback state just because boot needed a state
   object to render its first screen. Hydration is a separate step below. */
function inspectStoredSave(raw) {
  let source = raw;
  let readError = null;
  if (arguments.length === 0) {
    try { source = localStorage.getItem(SAVE_KEY); } catch (err) { readError = err; }
  }
  const info = {
    raw: typeof source === 'string' ? source : '',
    ok: true,
    empty: !source,
    status: 'empty',
    message: '',
    warnings: [],
    save: null,
    at: Date.now(),
  };
  if (readError) {
    return Object.assign(info, {
      ok: false,
      status: 'storage-unavailable',
      message: readError && readError.message ? readError.message : 'storage access is blocked',
    });
  }
  /* An interrupted multi-key save that could neither finish nor roll back is
     never allowed to boot into the normal shell and overwrite its evidence. */
  if (!arguments.length && typeof SaveJournal !== 'undefined'
      && typeof SaveJournal.unresolved === 'function' && SaveJournal.unresolved()) {
    return Object.assign(info, {
      ok: false,
      status: 'journal-unresolved',
      message: 'A save operation was interrupted and could not be safely finished or rolled back.',
    });
  }
  if (!source) {
    if (arguments.length === 0 && hasBootRecoveryCopy()) {
      return Object.assign(info, {
        ok: false,
        status: 'missing-live-save',
        message: 'No live save was found, but another copy is still on this device.',
      });
    }
    return info;
  }

  /* SaveSchema is the only parse boundary. It checks JSON, the v2 envelope and
     the required shape; boot does not need a second, weaker parser above it. */
  const parsed = SaveSchema.parse(source);
  if (!parsed.ok) {
    return Object.assign(info, {
      ok: false,
      empty: false,
      status: parsed.status,
      message: parsed.error,
      warnings: (parsed.warnings || []).slice(0, 8),
    });
  }
  return Object.assign(info, {
    empty: false,
    save: parsed.save,
    status: parsed.status,
    warnings: parsed.warnings.slice(0, 8),
  });
}

function hydrateSave(parsed) {
  const base = freshState();
  try {
    if (!parsed) return base;
    const merged = { ...base, ...parsed };
    /* Collection Constellations no longer mint rewards. Drop the retired
       claims map so an older save loses it on the next write. */
    delete merged.constellationClaims;
    merged.theme = { ...base.theme, ...(parsed.theme || {}) };
    /* Frame settings arrived after v2 was already in players' hands. Normalise
       them at the same boundary as the other theme choices so an older save
       gets the daily palette, and a hand-edited colour or motion name cannot
       leave a frame that never paints. */
    const savedFrame = parsed.theme && parsed.theme.frame
      && typeof parsed.theme.frame === 'object' ? parsed.theme.frame : {};
    const defaultFrame = base.theme.frame;
    const frameHex = (value, fallback) => (/^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value).toLowerCase() : fallback);
    const frameMotion = (value) => (['sweep', 'breathe', 'pulse', 'still'].includes(value) ? value : 'sweep');
    merged.theme.frame = {
      mode: savedFrame.mode === 'custom' ? 'custom' : 'daily',
      a: frameHex(savedFrame.a, defaultFrame.a),
      b: frameHex(savedFrame.b, defaultFrame.b),
      c: frameHex(savedFrame.c, defaultFrame.c),
      intensity: normalizeFrameIntensity(savedFrame.intensity),
      entry: frameMotion(savedFrame.entry),
      loading: frameMotion(savedFrame.loading),
      menu: frameMotion(savedFrame.menu),
      presets: normalizeFramePresets(savedFrame.presets),
    };
    /* Incubators are additive: an older save has no map, and a partial one may
       only know the free modes. Normalise here so the repaired values are in the
       first save rather than waiting for the Nest screen to be opened. */
    merged.incubators = typeof normalizeIncubators === 'function'
      ? normalizeIncubators(parsed.incubators)
      : parsed.incubators;
    const savedCollection = parsed.collection && typeof parsed.collection === 'object' ? parsed.collection : {};
    merged.collection = {
      tier: typeof savedCollection.tier === 'string' ? savedCollection.tier : base.collection.tier,
      sort: savedCollection.sort === 'rarity-desc' ? 'rarity-desc' : base.collection.sort,
    };
    merged.typeEggSort = ['cheapest', 'rarest', 'name', 'missing-first'].includes(merged.typeEggSort)
      ? merged.typeEggSort : 'cheapest';
    merged.familyClaims = typeof FamilyCompletion !== 'undefined'
      ? FamilyCompletion.sanitizeClaims(merged.familyClaims)
      : {};
    merged.theme.voiceType = ['female', 'male'].includes(merged.theme.voiceType) ? merged.theme.voiceType : 'female';
    merged.theme.language = ['en', 'es', 'fr'].includes(merged.theme.language) ? merged.theme.language : 'en';
    merged.theme.captions = merged.theme.captions !== false;
    if (typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.titleImageLimit === 'function'
        && typeof merged.theme.titleImage === 'string'
        && merged.theme.titleImage.length > SaveIntegrity.titleImageLimit().maxStoredChars) {
      /* Older builds accepted a 900 KB image. It cannot fit the retained-copy
         budget, so keep the Hollow but drop the image with a one-time notice. */
      merged.theme.titleImage = '';
      if (merged.theme.titleBackdrop === 'image') merged.theme.titleBackdrop = 'theme';
      titleImageDropped = true;
    }
    if (!['off', 'soft', 'strong'].includes(merged.theme.fluff)) merged.theme.fluff = 'soft';
    if (!['off', 'soft', 'full'].includes(merged.theme.elementFx)) merged.theme.elementFx = 'soft';
    if (!['full', 'calm'].includes(merged.theme.motion)) merged.theme.motion = 'full';
    if (typeof UI_FONTS !== 'undefined' && !UI_FONTS[merged.theme.font]) merged.theme.font = 'rounded';
    if (typeof THEME_GLOWS !== 'undefined' && !THEME_GLOWS[merged.theme.glow]) merged.theme.glow = 'soft';
    if (typeof THEME_LOADERS !== 'undefined' && !THEME_LOADERS[merged.theme.loader]) merged.theme.loader = 'stars';
    merged.customClothes = (Array.isArray(parsed.customClothes) ? parsed.customClothes : []).map(normalizeCustomCloth);
    merged.customScenes = (Array.isArray(parsed.customScenes) ? parsed.customScenes : []).map(normalizeCustomScene);
    merged.customScenes.forEach(registerCustomScene);
    /* Gene-lab species are rebuilt before sprites are normalised: a saved
       sprite whose element is missing would fall back to Bloom and lose its
       whole look. */
    merged.geneDesigns = (Array.isArray(parsed.geneDesigns) ? parsed.geneDesigns : [])
      .map((design) => (typeof normalizeGeneDesign === 'function' ? normalizeGeneDesign(design) : null))
      .filter(Boolean)
      .slice(0, typeof GENE_DESIGN_LIMIT === 'number' ? GENE_DESIGN_LIMIT : 12);
    if (typeof syncGeneDesigns === 'function') syncGeneDesigns(merged.geneDesigns);
    if (!SCENES[merged.theme.scene]) merged.theme.scene = 'grove';
    merged.stats = { ...base.stats, ...(parsed.stats || {}) };
    const savedWheel = parsed.wheel && typeof parsed.wheel === 'object' ? parsed.wheel : {};
    merged.wheel = {
      day: typeof savedWheel.day === 'string' ? savedWheel.day : null,
      free: !!savedWheel.free,
      paid: Math.max(0, Math.floor(Number(savedWheel.paid) || 0)),
      won: Math.max(0, Math.floor(Number(savedWheel.won) || 0)),
      lifetime: Math.max(0, Math.floor(Number(savedWheel.lifetime) || 0)),
    };
    merged.checkin = { ...base.checkin, ...(parsed.checkin || {}) };
    merged.checkin.slots = Array.isArray(parsed.checkin?.slots) ? parsed.checkin.slots : [];
    merged.checkin.weekClaims = Array.isArray(parsed.checkin?.weekClaims) ? parsed.checkin.weekClaims : [];
    merged.checkin.monthClaims = Array.isArray(parsed.checkin?.monthClaims) ? parsed.checkin.monthClaims : [];
    merged.checkin.yearClaims = Array.isArray(parsed.checkin?.yearClaims) ? parsed.checkin.yearClaims : [];
    merged.seen = { ...base.seen, ...(parsed.seen || {}) };
    merged.tourStep = Math.max(0, Math.floor(Number(parsed.tourStep) || 0));
    merged.secretUnlocks = Array.from(new Set((Array.isArray(parsed.secretUnlocks) ? parsed.secretUnlocks : [])
      .filter((k) => SECRET_SPECIES_META[k])));
    merged.codeRedeems = parsed.codeRedeems && typeof parsed.codeRedeems === 'object' ? parsed.codeRedeems : {};
    /* First Flight is additive. A Hollow that predates it is marked migrated
       so an established save never receives the tutorial. */
    merged.flight = typeof FirstFlight !== 'undefined' ? FirstFlight.sanitize(parsed.flight) : Object.assign({}, base.flight);
    merged.flight2 = typeof SecondFlight !== 'undefined' ? SecondFlight.sanitize(parsed.flight2) : Object.assign({}, base.flight2);
    merged.challenge = typeof WeeklyChallenge !== 'undefined' ? WeeklyChallenge.sanitize(parsed.challenge) : Object.assign({}, base.challenge);
    merged.gameScores = typeof GameScores !== 'undefined' ? GameScores.sanitize(parsed.gameScores) : {};
    if (!parsed.flight && parsed.started) {
      merged.flight.migrated = true;
    }
    merged.biomesVisited = Array.from(new Set((Array.isArray(parsed.biomesVisited) ? parsed.biomesVisited : [])
      .filter((k) => isTypeBiomeScene(k))));
    merged.wishlist = Array.from(new Set((Array.isArray(parsed.wishlist) ? parsed.wishlist : [])
      .filter((key) => typeof key === 'string' && ELEMENTS[key]))).slice(0, typeof WISHLIST_LIMIT === 'number' ? WISHLIST_LIMIT : 12);
    merged.eggGift = parsed.eggGift && typeof parsed.eggGift === 'object' && parsed.eggGift.date
      ? { date: String(parsed.eggGift.date), key: ELEMENTS[parsed.eggGift.key] ? parsed.eggGift.key : null }
      : null;
    merged.holidayGift = parsed.holidayGift && typeof parsed.holidayGift === 'object' && parsed.holidayGift.date
      ? {
        date: String(parsed.holidayGift.date),
        holiday: HOLIDAYS[parsed.holidayGift.holiday] ? parsed.holidayGift.holiday : null,
        key: ELEMENTS[parsed.holidayGift.key] ? parsed.holidayGift.key : null,
      }
      : null;
    merged.weekendGift = parsed.weekendGift && typeof parsed.weekendGift === 'object' && parsed.weekendGift.week
      ? {
        week: String(parsed.weekendGift.week),
        event: typeof WEEKEND_ADMIN_EVENTS !== 'undefined' && WEEKEND_ADMIN_EVENTS.some((e) => e.key === parsed.weekendGift.event) ? parsed.weekendGift.event : null,
        key: ELEMENTS[parsed.weekendGift.key] ? parsed.weekendGift.key : null,
      }
      : null;
    merged.inventory = {
      snacks: { ...(parsed.inventory?.snacks || {}) },
      foods: { ...(parsed.inventory?.foods || {}) },
    };
    /* Cafe recipes are permanent. Old saves predate the recipe field, so their
       existing cafe access is grandfathered instead of suddenly market-locked. */
    const savedCafeRecipes = Array.isArray(parsed.cafeRecipes) ? parsed.cafeRecipes : null;
    const legacyCafeRecipes = savedCafeRecipes === null && parsed.started
      && typeof CAFE_RECIPE_FOODS !== 'undefined' ? CAFE_RECIPE_FOODS : [];
    const stockedCafeRecipes = typeof CAFE_RECIPE_BY_FOOD !== 'undefined'
      ? Object.keys(merged.inventory.foods).filter((key) => merged.inventory.foods[key] > 0 && CAFE_RECIPE_BY_FOOD[key])
      : [];
    merged.cafeRecipes = Array.from(new Set([
      ...(savedCafeRecipes || []),
      ...legacyCafeRecipes,
      ...stockedCafeRecipes,
    ])).filter((key) => typeof CAFE_RECIPE_BY_FOOD === 'undefined' || CAFE_RECIPE_BY_FOOD[key]);
    merged.waveGames = {};
    Object.entries(parsed.waveGames && typeof parsed.waveGames === 'object' ? parsed.waveGames : {}).forEach(([kind, raw]) => {
      if (typeof GAME_INFO !== 'undefined' && !GAME_INFO[kind]) return;
      if (!raw || typeof raw !== 'object') return;
      const plays = Math.max(0, Math.floor(Number(raw.plays) || 0));
      const best = Math.max(0, Number(raw.best) || 0);
      if (Object.prototype.hasOwnProperty.call(raw, 'plays') || Object.prototype.hasOwnProperty.call(raw, 'best')) {
        merged.waveGames[kind] = { plays, best };
      }
    });
    /* Water is a staple rather than a rare drop: every save keeps a bottle or
       three in the pantry so the drink clip is always reachable. */
    merged.inventory.snacks.water = Math.max(3, Number(merged.inventory.snacks.water) || 0);
    merged.world = {
      climate: CLIMATES[parsed.world?.climate] ? parsed.world.climate : 'temperate',
      /* "off" is a sky choice, not a separate switch. Legacy weatherOff flags
         are folded into this field by SaveSchema before hydration. */
      weather: parsed.world?.weather === 'off'
        ? 'off'
        : WEATHERS[parsed.world?.weather] ? parsed.world.weather : null,
      season: SEASONS[parsed.world?.season] ? parsed.world.season : null,
      eventPreset: EVENT_PRESETS[parsed.world?.eventPreset] ? parsed.world.eventPreset : null,
      /* Event badges are keepsakes: they outlive the preset that earned them. */
      badges: (Array.isArray(parsed.world?.badges) ? parsed.world.badges : [])
        .filter((badge) => badge && EVENT_PRESETS[badge.key])
        .map((badge) => ({
          key: badge.key,
          count: Math.max(1, Math.min(9999, Number(badge.count) || 1)),
          first: Number(badge.first) || 0,
          last: Number(badge.last) || 0,
        }))
        .slice(0, EVENT_PRESET_KEYS.length),
      /* A kept vigil is a day stamp, so an old or hand-edited save cannot claim
         today's vigil without a run today. */
      vigils: Object.fromEntries(
        Object.entries(parsed.world?.vigils && typeof parsed.world.vigils === 'object' ? parsed.world.vigils : {})
          .filter(([key, row]) => EVENT_PRESETS[key] && row && typeof row === 'object')
          .map(([key, row]) => [key, {
            day: /^\d{4}-\d{2}-\d{2}$/.test(String(row.day || '')) ? String(row.day) : '',
            best: Math.max(0, Math.min(9999, Number(row.best) || 0)),
            runs: Math.max(0, Math.min(9999, Number(row.runs) || 0)),
            last: Number(row.last) || 0,
          }])
      ),
    };
    /* A pin is only a species id; bandPinFor decides at draw time whether it
       still belongs to that band. */
    merged.tierPins = {};
    Object.entries(parsed.tierPins && typeof parsed.tierPins === 'object' ? parsed.tierPins : {}).forEach(([tierKey, speciesKey]) => {
      if (!TIER_EGG_META[tierKey] || typeof speciesKey !== 'string' || !speciesKey) return;
      merged.tierPins[tierKey] = speciesKey;
    });
    merged.homes = {};
    Object.entries(parsed.homes && typeof parsed.homes === 'object' ? parsed.homes : {}).forEach(([spriteId, sceneKey]) => {
      if (SCENES[sceneKey]) merged.homes[spriteId] = sceneKey;
    });
    merged.houses = {};
    Object.entries(parsed.houses && typeof parsed.houses === 'object' ? parsed.houses : {}).forEach(([houseId, house]) => {
      if (!house || typeof house !== 'object') return;
      const members = Array.isArray(house.members) ? house.members.filter((id) => typeof id === 'string') : [];
      if (members.length < 2) return;
      merged.houses[houseId] = {
        id: houseId,
        name: house.name ? String(house.name).slice(0, 48) : null,
        scene: SCENES[house.scene] ? house.scene : null,
        members: members.slice(0, 4),
        bond: Math.max(0, Number(house.bond) || 0),
        milestone: Math.max(100, Number(house.milestone) || 100),
        lastBondAt: Number(house.lastBondAt) || 0,
        lastPlayAt: Number(house.lastPlayAt) || 0,
        formedAt: Number(house.formedAt) || Date.now(),
      };
    });
    merged.storyShelf = typeof BondChapters !== 'undefined'
      ? BondChapters.normalizeShelf(parsed.storyShelf)
      : [];
    merged.homeUpgrades = {};
    Object.entries(parsed.homeUpgrades && typeof parsed.homeUpgrades === 'object' ? parsed.homeUpgrades : {}).forEach(([id, on]) => {
      if (on && /^[a-z][a-zA-Z0-9_]{1,30}$/.test(id)) merged.homeUpgrades[id] = true;
    });
    merged.speciesHomes = {};
    Object.entries(parsed.speciesHomes && typeof parsed.speciesHomes === 'object' ? parsed.speciesHomes : {}).forEach(([spriteId, raw]) => {
      if (!raw || typeof raw !== 'object') return;
      const taps = {};
      Object.entries(raw.taps && typeof raw.taps === 'object' ? raw.taps : {}).forEach(([key, value]) => {
        if (/^[a-z][a-zA-Z0-9]{1,20}$/.test(key)) taps[key] = Math.max(0, Number(value) || 0);
      });
      merged.speciesHomes[spriteId] = {
        tier: typeof raw.tier === 'string' && /^[a-z][a-zA-Z0-9]{1,20}$/.test(raw.tier) ? raw.tier : 'sapling',
        taps,
      };
    });
    /* Legacy leaf-home cooldowns are folded into speciesHomes by
       SaveSchema normalization before this hydration step. */
    merged.leafHomes = {};
    merged.furnitureFavorites = Array.isArray(parsed.furnitureFavorites)
      ? Array.from(new Set(parsed.furnitureFavorites.filter((id) => typeof id === 'string' && /^[a-z][a-zA-Z0-9_]{1,24}$/.test(id))))
      : [];
    merged.guardiansBeaten = {};
    Object.entries(parsed.guardiansBeaten && typeof parsed.guardiansBeaten === 'object' ? parsed.guardiansBeaten : {}).forEach(([id, count]) => {
      if (!ELEMENTS[id]) return;
      merged.guardiansBeaten[id] = Math.max(0, Math.floor(Number(count) || 0));
    });
    /* Only real Hollow Eclipse ids survive, so a renamed enemy cannot leave a
       phantom row in the purification record. */
    merged.enemiesPurified = {};
    Object.entries(parsed.enemiesPurified && typeof parsed.enemiesPurified === 'object' ? parsed.enemiesPurified : {}).forEach(([id, count]) => {
      const known = typeof SPRITE_HOLLOW_VOICES !== 'undefined' && Array.isArray(SPRITE_HOLLOW_VOICES)
        && SPRITE_HOLLOW_VOICES.some((entry) => entry.enemy && entry.id === id);
      if (!known) return;
      merged.enemiesPurified[id] = Math.max(0, Math.floor(Number(count) || 0));
    });
    merged.roomTheme = typeof HOME_ROOM_THEME_KEYS !== 'undefined' && HOME_ROOM_THEME_KEYS.includes(parsed.roomTheme) ? parsed.roomTheme : 'honey';
    /* Looks only exist for houses that still do: drop keys left by older splits. */
    const savedHouseIds = new Set(Object.keys(merged.houses));
    merged.houseTints = {};
    Object.entries(parsed.houseTints && typeof parsed.houseTints === 'object' ? parsed.houseTints : {}).forEach(([id, tint]) => {
      const hex = String(tint || '').replace('#', '');
      if (savedHouseIds.has(id) && /^[0-9a-f]{6}$/i.test(hex)) merged.houseTints[id] = `#${hex.toLowerCase()}`;
    });
    merged.houseTintStrengths = {};
    Object.entries(parsed.houseTintStrengths && typeof parsed.houseTintStrengths === 'object' ? parsed.houseTintStrengths : {}).forEach(([id, value]) => {
      const pct = Math.round(Number(value));
      if (savedHouseIds.has(id) && Number.isFinite(pct) && pct >= 0 && pct <= 100) merged.houseTintStrengths[id] = pct;
    });
    merged.customGuardians = Array.from(new Set((Array.isArray(parsed.customGuardians) ? parsed.customGuardians : [])
      .filter((key) => typeof customGuardianDef === 'function' && customGuardianDef(key))));
    merged.vaultDoors = Array.from(new Set((Array.isArray(parsed.vaultDoors) ? parsed.vaultDoors : [])
      .filter((id) => typeof guardianVaultDoor === 'function' && guardianVaultDoor(id))));
    if (typeof syncCustomGuardians === 'function') syncCustomGuardians(merged.customGuardians);
    merged.roomLayout = {};
    Object.entries(parsed.roomLayout && typeof parsed.roomLayout === 'object' ? parsed.roomLayout : {}).forEach(([id, raw]) => {
      if (!raw || typeof raw !== 'object' || !/^[a-z][a-zA-Z0-9_]{1,30}$/.test(id)) return;
      merged.roomLayout[id] = {
        spot: Math.max(0, Math.min(2, Math.floor(Number(raw.spot) || 0))),
        hidden: !!raw.hidden,
      };
    });
    merged.roomPresets = [];
    (Array.isArray(parsed.roomPresets) ? parsed.roomPresets : []).slice(0, 8).forEach((raw) => {
      if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !/^preset_[a-z0-9]{4,20}$/.test(raw.id)) return;
      if (merged.roomPresets.some((preset) => preset.id === raw.id)) return;
      const layout = {};
      Object.entries(raw.layout && typeof raw.layout === 'object' ? raw.layout : {}).forEach(([pieceId, piece]) => {
        if (!/^[a-z][a-zA-Z0-9_]{1,30}$/.test(pieceId) || !piece || typeof piece !== 'object') return;
        layout[pieceId] = {
          spot: Math.max(0, Math.min(2, Math.floor(Number(piece.spot) || 0))),
          hidden: !!piece.hidden,
        };
      });
      merged.roomPresets.push({
        id: raw.id,
        name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 24) : 'Layout',
        savedAt: Math.max(0, Number(raw.savedAt) || 0),
        layout,
      });
    });
    merged.wardrobe = Array.from(new Set((Array.isArray(parsed.wardrobe) ? parsed.wardrobe : []).filter((k) => ACCESSORIES[k]?.price)));
    merged.looks = (Array.isArray(parsed.looks) ? parsed.looks : []).map(normalizeLook).slice(0, 40);
    merged.biomeQuests = {};
    Object.entries(parsed.biomeQuests && typeof parsed.biomeQuests === 'object' ? parsed.biomeQuests : {}).forEach(([sceneKey, raw]) => {
      if (typeof BIOME_QUESTS === 'undefined' || !BIOME_QUESTS[sceneKey] || !raw || typeof raw !== 'object') return;
      const total = BIOME_QUESTS[sceneKey].steps.length;
      const step = Math.max(0, Math.min(total, Math.floor(Number(raw.step) || 0)));
      merged.biomeQuests[sceneKey] = {
        step,
        progress: Math.max(0, Math.floor(Number(raw.progress) || 0)),
        done: !!raw.done || step >= total,
        beaten: !!raw.beaten,
      };
    });
    const savedSeasonCharge = parsed.seasonCharge && typeof parsed.seasonCharge === 'object' ? parsed.seasonCharge : {};
    merged.seasonCharge = {
      points: Math.max(0, Math.floor(Number(savedSeasonCharge.points) || 0)) % SEASON_CHARGE_GOAL,
      eggs: Math.max(0, Math.floor(Number(savedSeasonCharge.eggs) || 0)),
    };
    merged.foodUnlocks = Array.isArray(parsed.foodUnlocks) ? parsed.foodUnlocks.filter((k) => FOODS[k]?.monthly) : [];
    merged.checkin.monthCrateKey = parsed.checkin?.monthCrateKey || null;
    const savedQuiz = parsed.quiz && typeof parsed.quiz === 'object' ? parsed.quiz : {};
    merged.quiz = {
      date: /^\d{4}-\d{2}-\d{2}$/.test(savedQuiz.date || '') ? savedQuiz.date : null,
      readyAt: Math.max(0, Number(savedQuiz.readyAt) || 0),
      doneDate: /^\d{4}-\d{2}-\d{2}$/.test(savedQuiz.doneDate || '') ? savedQuiz.doneDate : null,
    };
    merged.weeklyEvents = {
      weekKey: parsed.weeklyEvents?.weekKey || null,
      claims: Array.isArray(parsed.weeklyEvents?.claims)
        ? Array.from(new Set(parsed.weeklyEvents.claims.filter((key) => WEEKLY_EVENT_BY_KEY[key])))
        : [],
    };
    merged.weeklyTreats = typeof WeeklyChallenge !== 'undefined'
      ? WeeklyChallenge.sanitizeTreat(parsed.weeklyTreats)
      : { week: null, claimed: [] };
    const savedArcade = parsed.arcade && typeof parsed.arcade === 'object' ? parsed.arcade : {};
    merged.arcade = {
      coins: Math.max(0, Number(savedArcade.coins) || 0),
      bonusClaims: Math.max(0, Number(savedArcade.bonusClaims) || 0),
      monthKey: savedArcade.monthKey || null,
      monthCoins: Math.max(0, Number(savedArcade.monthCoins) || 0),
      monthClaims: Array.isArray(savedArcade.monthClaims)
        ? Array.from(new Set(savedArcade.monthClaims.filter((id) => ARCADE_MONTH_GIFTS.some((gift) => gift.id === id))))
        : [],
    };
    merged.unlockedScenes = Array.from(new Set([
      ...base.unlockedScenes,
      ...SCENE_KEYS.filter((k) => SCENES[k].unlocked),
      ...(Array.isArray(parsed.unlockedScenes) ? parsed.unlockedScenes : []),
      ...merged.customScenes.map((scene) => scene.id),
    ]))
      .filter((k) => SCENES[k]);
    merged.gift = parsed.gift && typeof parsed.gift === 'object' ? parsed.gift : null;
    if (merged.gift && !merged.unlockedScenes.includes(merged.gift.scene)) delete merged.gift.scene;
    const savedCare = parsed.care && typeof parsed.care === 'object' ? parsed.care : {};
    merged.care = {
      tokens: Math.max(0, Number(savedCare.tokens) || 0),
      gifts: Math.max(0, Number(savedCare.gifts) || 0),
    };
    const savedHotel = parsed.hotel && typeof parsed.hotel === 'object' ? parsed.hotel : {};
    merged.hotel = {
      careTokens: Math.max(0, Number(savedHotel.careTokens) || 0),
      careGifts: Math.max(0, Number(savedHotel.careGifts) || 0),
      lastStay: typeof savedHotel.lastStay === 'string' ? savedHotel.lastStay : null,
      /* Only a floor's worth of stays can survive, so the work is capped before
         the rooms are repaired below. */
      guests: (Array.isArray(savedHotel.guests) ? savedHotel.guests : [])
        .filter((entry) => entry && typeof entry.id === 'string')
        .slice(0, HOTEL_ROOM_COUNT * 4)
        .map((entry) => ({
          id: entry.id,
          since: Number(entry.since) || 0,
          room: Math.floor(Number(entry.room) || 0),
        })),
    };
    merged.journal = (Array.isArray(parsed.journal) ? parsed.journal : [])
      .filter((e) => e && e.text)
      .slice(0, 100)
      .map((e) => ({
        id: e.id || uid('dr'),
        spriteId: e.spriteId || null,
        spriteName: String(e.spriteName || 'Sprite'),
        element: ELEMENTS[e.element] ? e.element : 'bloom',
        text: String(e.text),
        at: Number(e.at) || Date.now(),
        cycles: Math.max(1, Number(e.cycles) || 1),
      }));
    merged.sprites = Array.isArray(parsed.sprites) ? parsed.sprites.map(normalizeSprite) : [];
    /* A saved floor can name a room twice, a room that is not on it (older
       builds wrote 0 when the hotel was full), or a guest whose sprite is
       gone. Repair it now that both the stays and the sprites are known. */
    merged.hotel.guests = normalizeHotelStays(merged.hotel.guests, merged.sprites);
    /* Finish ownership is permanent, and older saves did not store it. Seed it
       from every hatched sprite so existing collections keep their shells. */
    merged.finishUnlocks = Array.from(new Set([
      ...(Array.isArray(parsed.finishUnlocks) ? parsed.finishUnlocks : []),
      ...merged.sprites
        .filter((sprite) => sprite.stage !== 'egg' && FINISHES[sprite.variant])
        .map((sprite) => sprite.variant),
    ])).filter((key) => FINISHES[key]);
    /* Sheet skins are also kept in their own map, so the art comes back even if a
       save path ever drops the per-sprite field. */
    if (merged.lumiSkins && typeof merged.lumiSkins === 'object') {
      merged.sprites.forEach((sprite) => {
        const form = String(merged.lumiSkins[sprite.id] || '').replace(/^lumi:/, '');
        if (form) sprite.skin = `lumi:${form}`;
      });
    }
    const outfitIds = new Set(merged.customClothes.map((cloth) => cloth.id));
    merged.sprites.forEach((sprite) => {
      if (sprite.outfit && !outfitIds.has(sprite.outfit)) sprite.outfit = null;
      if (sprite.puffleOutfit && !outfitIds.has(sprite.puffleOutfit)) sprite.puffleOutfit = null;
      /* Legacy creatures in classic colours take the species coat of that colour. */
      const legacyCoat = typeof cpCreatureCoatForClassic === 'function'
        ? cpCreatureCoatForClassic(sprite.form, sprite.puffleVariant) : null;
      if (legacyCoat) sprite.puffleVariant = legacyCoat;
    });
    merged.activeId = merged.sprites.some((s) => s.id === merged.activeId && s.stage !== 'egg' && !s.retired)
      ? merged.activeId
      : merged.sprites.find((s) => s.stage !== 'egg' && !s.retired)?.id || null;
    return merged;
  } catch (err) {
    console.warn('Save could not be read, starting fresh.', err);
    return base;
  }
}

function loadState(raw) {
  const inspected = arguments.length ? inspectStoredSave(raw) : inspectStoredSave();
  return inspected.ok ? hydrateSave(inspected.save) : freshState();
}

let saveTimer = null;
/* Set while a restored save is loading, so the pagehide/beforeunload writers
   do not put the old Hollow back over the one that was just imported. Boot also
   sets this before rendering a recovery screen, which keeps every automatic
   save, slot mirror and cloud flush away from the bytes the player is trying
   to recover. */
let saveLocked = false;
function lockSaves() { saveLocked = true; }
function savesLocked() { return saveLocked; }

/* The journal is synchronous and must be resolved before the live key is
   inspected. This is the one point where an interrupted slot switch, pointer
   write, or live overwrite is finished or rolled back. */
if (typeof SaveJournal !== 'undefined' && typeof SaveJournal.resolveOnBoot === 'function') {
  SaveJournal.resolveOnBoot();
}

const bootSaveInspection = inspectStoredSave();
if (!bootSaveInspection.ok) lockSaves();
let titleImageDropped = false;
const state = bootSaveInspection.ok ? hydrateSave(bootSaveInspection.save) : freshState();

/* A deleted, damaged or missing save starts a new Hollow, but the wallet lives
   outside the save: the coins the keeper already earned come back with it.
   A healthy save simply refreshes the bank to its current balance. */
let coinBankRestored = 0;
if (typeof CoinBank !== 'undefined') {
  if (bootSaveInspection.ok && !bootSaveInspection.empty) {
    CoinBank.keep(state.coins);
  } else {
    const opening = CoinBank.openingCoins(state.coins);
    if (opening > state.coins) {
      state.coins = opening;
      coinBankRestored = opening;
    }
    CoinBank.keep(state.coins);
  }
}

/* Backfill chapters for old saves that already had a bonded house but no
   story shelf. New fields stay optional, so older saves load unchanged. */
if (typeof BondChapters !== 'undefined') syncHouseStories();

function houseStorySource(house) {
  const members = (house && Array.isArray(house.members) ? house.members : [])
    .map((id) => findSprite(id))
    .filter((sprite) => sprite && sprite.stage !== 'egg')
    .map((sprite) => displayName(sprite));
  const fallbackName = members.join(' & ');
  return {
    houseId: house && house.id,
    houseName: house && house.name ? house.name : fallbackName,
    members,
    bond: Math.max(0, Number(house && house.bond) || 0),
  };
}

/* Record any newly crossed chapter on the additive shelf. Returns only the
   entries added by this call so the caller can announce them. */
function syncHouseStory(house) {
  if (typeof BondChapters === 'undefined' || !house || !house.id) return [];
  const existing = new Set((state.storyShelf || []).map((entry) => entry.key));
  const merged = BondChapters.mergeEntries(state.storyShelf, houseStorySource(house), Date.now());
  const added = merged.filter((entry) => !existing.has(entry.key));
  state.storyShelf = merged;
  return added;
}

function syncHouseStories() {
  const added = [];
  Object.values(state.houses || {}).forEach((house) => {
    added.push(...syncHouseStory(house));
  });
  return added;
}

/* Ultra and dream coats are earned, not picked freely: the Hollow hands them
   over once a keeper has done enough hands-on care. */
const FUR_UNLOCK_RULES = {
  ultra: { stat: 'rubs', need: 25, blurb: 'Rub 25 bellies' },
  dream: { stat: 'naps', need: 60, blurb: 'Nap 60 times' },
};

function furUnlockInfo(key) {
  const rule = FUR_UNLOCK_RULES[key];
  if (!rule) return { unlocked: true, have: 0, need: 0, blurb: '' };
  const have = Math.max(0, Number(state.stats && state.stats[rule.stat]) || 0);
  return { unlocked: have >= rule.need, have, need: rule.need, blurb: rule.blurb };
}

function furUnlocked(key) { return furUnlockInfo(key).unlocked; }

/* Award the earned coats exactly once, with a celebration the first time the
   milestone is crossed. The seen flags live on the save as furUnlockSeen. */
function grantFurUnlocks() {
  if (!state.furUnlockSeen || typeof state.furUnlockSeen !== 'object' || Array.isArray(state.furUnlockSeen)) state.furUnlockSeen = {};
  const gained = [];
  Object.keys(FUR_UNLOCK_RULES).forEach((key) => {
    const info = furUnlockInfo(key);
    if (info.unlocked && !state.furUnlockSeen[key]) {
      state.furUnlockSeen[key] = true;
      gained.push({ key, ...info });
    }
  });
  if (!gained.length) return gained;
  commit('furUnlock', { keys: gained.map((g) => g.key) });
  if (typeof celebrateFurUnlock === 'function') gained.forEach((g) => celebrateFurUnlock(g));
  return gained;
}
/* A failed live or slot write blocks the visible save state until a later
   write actually lands. Keep an in-memory copy as well as the persisted
   health record: a full disk can make the health record unwritable too. */
let saveBlockedInfo = null;
function setSaveBlocked(status, message) {
  const copy = typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.blockedState === 'function'
    ? SaveIntegrity.blockedState({ status, message })
    : null;
  saveBlockedInfo = Object.assign({ at: Date.now() }, copy || { status, message: message || 'saving is blocked' });
  if (typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.setLastLoad === 'function') {
    SaveIntegrity.setLastLoad({ status, message: message || 'saving is blocked' });
  }
  if (typeof refreshSaveBlockedNotice === 'function') refreshSaveBlockedNotice();
}
function clearSaveBlocked(...statuses) {
  const targets = statuses.length ? statuses : SaveIntegrity.BLOCKED_STATUSES;
  if (saveBlockedInfo && targets.includes(saveBlockedInfo.status)) saveBlockedInfo = null;
  if (typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.lastLoad === 'function') {
    const last = SaveIntegrity.lastLoad();
    if (last && targets.includes(last.status)) SaveIntegrity.setLastLoad({ status: 'ok', message: '' });
  }
  if (typeof refreshSaveBlockedNotice === 'function') refreshSaveBlockedNotice();
}
function currentSaveBlocked() {
  if (saveBlockedInfo) return saveBlockedInfo;
  if (typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.blockedState === 'function') {
    return SaveIntegrity.blockedState();
  }
  return null;
}

/* A failed live write is cleared once a later write lands. Slot failures are
   recorded by save-slots.js and deliberately left visible there. */
function markSaveWriteHealthy() {
  clearSaveBlocked('write-failed', 'cloud-restore-blocked');
}
function syncFinishUnlocks() {
  if (typeof state === 'undefined' || !state) return [];
  const table = typeof FINISHES !== 'undefined' ? FINISHES : null;
  if (!table) return [];
  const unlocked = new Set((Array.isArray(state.finishUnlocks) ? state.finishUnlocks : [])
    .filter((key) => table[key]));
  (state.sprites || []).forEach((sprite) => {
    if (sprite && sprite.stage !== 'egg' && table[sprite.variant]) unlocked.add(sprite.variant);
  });
  state.finishUnlocks = Array.from(unlocked);
  return state.finishUnlocks;
}

function finishIsOwned(key) {
  if (typeof FINISHES === 'undefined' || !FINISHES[key]) return false;
  syncFinishUnlocks();
  return Array.isArray(state.finishUnlocks) && state.finishUnlocks.includes(key);
}

/* Local saves store a short content address for the title image when the
   image is already in IndexedDB. While that write is pending, the data URL is
   kept in the payload so a save can never point at an image that is not there. */
function saveStorageString(source = state) {
  if (typeof TitleImageStore !== 'undefined' && typeof TitleImageStore.storageString === 'function') {
    try { return TitleImageStore.storageString(source); } catch (err) { /* fall back to inline data */ }
  }
  return JSON.stringify(source);
}

function saveState(immediate = false) {
  if (saveLocked) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  const write = () => {
    if (saveLocked) return;
    const payload = saveStorageString(state);
    /* Snapshot the save that is about to be replaced before overwriting it.
       Hand autoBackup a lazy reader so a throttled rotation does not read,
       parse, migrate, or validate the previous payload. */
    if (typeof SaveIntegrity !== 'undefined') {
      SaveIntegrity.autoBackup(() => localStorage.getItem(SAVE_KEY));
    }
    /* Write the next alternating generation before the live key. If the page
       dies after this and before the live key, boot finishes from the verified
       generation; if it dies earlier, the old generation is the rollback. */
    let journal = null;
    if (typeof SaveJournal !== 'undefined' && typeof SaveJournal.begin === 'function') {
      journal = SaveJournal.begin('live', { toChecksum: SaveJournal.checksum(payload) });
      if (journal && typeof SaveJournal.writeGeneration === 'function'
          && !SaveJournal.writeGeneration(payload)) {
        SaveJournal.abort();
        journal = null;
      }
    }
    try {
      localStorage.setItem(SAVE_KEY, payload);
    } catch (err) {
      /* Out of room: drop the oldest recovery copy and try once more. */
      if (typeof SaveIntegrity !== 'undefined' && SaveIntegrity.makeRoom()) {
        try {
          localStorage.setItem(SAVE_KEY, payload);
        } catch (retryErr) {
          if (journal) SaveJournal.abort();
          setSaveBlocked('write-failed', err && err.message ? err.message : 'storage is full');
          console.warn('Could not save', err);
          return;
        }
      } else {
        if (journal) SaveJournal.abort();
        setSaveBlocked('write-failed', err && err.message ? err.message : 'storage is full');
        console.warn('Could not save', err);
        return;
      }
    }
    if (journal) SaveJournal.mark('live-written');
    markSaveWriteHealthy();
    if (typeof mirrorActiveSaveSlot === 'function') mirrorActiveSaveSlot(payload);
    if (journal) SaveJournal.commit();
  };
  state.savedAt = Date.now();
  /* Every scheduled save refreshes the wallet record too, so a save that is
     deleted later still hands the earned coins back on the next boot. */
  if (typeof CoinBank !== 'undefined') CoinBank.keep(state.coins);
  if (typeof scheduleCloudBackup === 'function') scheduleCloudBackup();
  if (immediate) write();
  else saveTimer = setTimeout(write, 160);
}

const stateListeners = new Set();
function subscribeState(fn) {
  stateListeners.add(fn);
  return () => stateListeners.delete(fn);
}
function commit(type = 'change', detail = {}) {
  syncFinishUnlocks();
  saveState();
  /* Actions settle coins immediately; mirror them into the bank now so a save
     deleted a moment later still restores the exact wallet. */
  if (typeof CoinBank !== 'undefined') CoinBank.keep(state.coins);
  if (typeof FirstFlightFunnel !== 'undefined') {
    try { FirstFlightFunnel.sync(state); } catch (err) { console.warn('First Flight funnel event failed', err); }
  }
  stateListeners.forEach((fn) => {
    try { fn({ type, ...detail }); } catch (err) { console.error(err); }
  });
}

/* ---------------- first flight ---------------- */
/* The step list lives in src/first-flight.js and reads the save, so progress
   cannot be faked by a click. These helpers only persist the small set of flags
   the model needs. */
function firstFlightData() {
  return state.flight && typeof state.flight === 'object' ? state.flight : null;
}
function firstFlightProgress() {
  return typeof FirstFlight !== 'undefined' ? FirstFlight.progressFromSave(state) : null;
}
function firstFlightMergeWaived() {
  const flight = firstFlightData();
  return !!flight && !!flight.startedAt && !flight.migrated && !flight.skipped && !flight.claimed && !flight.waiverUsed;
}

/* ---------------- derived helpers ---------------- */
function findSprite(id) {
  return state.sprites.find((s) => s.id === id) || null;
}
function customClothFor(id) {
  return (state.customClothes || []).find((cloth) => cloth.id === id) || null;
}
function customSceneFor(id) {
  return (state.customScenes || []).find((scene) => scene.id === id) || null;
}
function activeSprite() {
  return findSprite(state.activeId) || state.sprites.find((s) => s.stage !== 'egg' && !s.retired) || null;
}
function grownSprites() {
  return state.sprites.filter((s) => s.stage !== 'egg');
}
/* Every sprite out in the Hollow: not an egg, not retired, not home. The
   Hollow roster, the duel roster and send-all-home all read this list. */
function awakeSprites() {
  return state.sprites.filter((s) => s && s.stage !== 'egg' && !s.retired && !s.atHome);
}
/* The one definition of a tuck-in, for one sprite or the whole Hollow. */
function tuckIn(sprite, now) {
  sprite.atHome = true;
  sprite.homeSince = now;
  sprite.asleep = false;
  sprite.sleepUntil = 0;
  sprite.sleepStart = 0;
  sprite.sleepCycles = 0;
}
function isCareBearElement(key) {
  return !!(ELEMENTS[key] && ELEMENTS[key].careBearGroup);
}
function isCareBearSprite(s) {
  return !!(s && s.stage !== 'egg' && isCareBearElement(s.element));
}
function careBearCount() {
  return new Set(state.sprites.filter((s) => isCareBearElement(s.element)).map((s) => s.element)).size;
}
function carePackageIn() {
  const every = typeof CARE_PACKAGE_EVERY === 'number' ? CARE_PACKAGE_EVERY : 3;
  const tokens = Math.max(0, Number(state.care?.tokens) || 0);
  const left = tokens % every;
  return left === 0 ? every : every - left;
}
function grantCarePackageRaw(s) {
  if (!isCareBearSprite(s)) return null;
  const every = typeof CARE_PACKAGE_EVERY === 'number' ? CARE_PACKAGE_EVERY : 3;
  if (!state.care || typeof state.care !== 'object') state.care = { tokens: 0, gifts: 0 };
  const care = state.care;
  care.tokens = Math.max(0, Number(care.tokens) || 0) + 1;
  if (care.tokens % every !== 0) return null;
  const coins = 120 + Math.min(120, care.tokens * 8);
  const xp = 24 + Math.min(60, care.tokens * 2);
  const snackKey = pick(SNACK_KEYS);
  const foodPool = unlockedFoodKeys();
  const foodKey = foodPool.length ? pick(foodPool) : null;
  addCoinsRaw(coins);
  addXpRaw(s, xp);
  addSnackRaw(snackKey, 1);
  if (foodKey) addFoodRaw(foodKey, 1);
  care.gifts = Math.max(0, Number(care.gifts) || 0) + 1;
  state.stats.careGifts = (Number(state.stats.careGifts) || 0) + 1;
  const gift = { coins, xp, snackKey, foodKey, tokens: care.tokens };
  toast(`🌈 Care Package! +${coins} coins · +${xp} XP · ${SNACKS[snackKey].name}${foodKey ? ` · ${FOODS[foodKey].name}` : ''}`, '🌈');
  return gift;
}
const HOTEL_CARE_EVERY = 3;

function hygieneOf(s) {
  if (!s) return { hair: 0, teeth: 0, breath: 0 };
  if (!s.hygiene || typeof s.hygiene !== 'object') s.hygiene = {};
  s.hygiene.hair = clamp(Number(s.hygiene.hair ?? 72));
  s.hygiene.teeth = clamp(Number(s.hygiene.teeth ?? 70));
  s.hygiene.breath = clamp(Number(s.hygiene.breath ?? 74));
  return s.hygiene;
}
function hotelCareIn() {
  const tokens = Math.max(0, Number(state.hotel?.careTokens) || 0);
  const left = tokens % HOTEL_CARE_EVERY;
  return left === 0 ? HOTEL_CARE_EVERY : HOTEL_CARE_EVERY - left;
}
function grantHotelCareBonusRaw(s) {
  if (!s || s.stage === 'egg') return null;
  if (!state.hotel || typeof state.hotel !== 'object') state.hotel = { careTokens: 0, careGifts: 0, lastStay: null };
  state.hotel.careTokens = Math.max(0, Number(state.hotel.careTokens) || 0) + 1;
  if (state.hotel.careTokens % HOTEL_CARE_EVERY !== 0) return null;
  const meals = typeof HOTEL_CARE_KEYS !== 'undefined'
    ? HOTEL_CARE_KEYS.filter((key) => HOTEL_FOODS[key]?.hotelKind === 'meal')
    : [];
  const foodKey = meals.length ? pick(meals) : null;
  const coins = 70 + Math.min(80, state.hotel.careTokens * 6);
  const xp = 18 + Math.min(30, state.hotel.careTokens);
  addCoinsRaw(coins);
  addXpRaw(s, xp);
  if (foodKey) addFoodRaw(foodKey, 1);
  state.hotel.careGifts = Math.max(0, Number(state.hotel.careGifts) || 0) + 1;
  state.stats.hotelCareGifts = (Number(state.stats.hotelCareGifts) || 0) + 1;
  const gift = { coins, xp, foodKey, tokens: state.hotel.careTokens };
  toast(`🏨 Hotel Care Bonus! +${coins} coins · +${xp} XP${foodKey ? ` · ${FOODS[foodKey].emoji} ${FOODS[foodKey].name}` : ''}`, '🏨');
  return gift;
}
function grantHotelCareItemRaw(kind = 'any') {
  if (typeof HOTEL_CARE_KEYS === 'undefined') return null;
  const pool = HOTEL_CARE_KEYS.filter((key) => {
    const item = HOTEL_FOODS[key];
    if (!item) return false;
    if (kind === 'meal') return item.hotelKind === 'meal';
    if (kind === 'drink') return item.hotelKind === 'drink';
    if (kind === 'treat') return item.hotelKind === 'treat';
    return item.hotelKind !== 'meal';
  });
  const keys = pool.length ? pool : HOTEL_CARE_KEYS;
  if (!keys.length) return null;
  const foodKey = pick(keys);
  addFoodRaw(foodKey, 1);
  return foodKey;
}

/* ---------------- hotel stays ---------------- */

/* A save can carry a room twice, a room outside the floor, or a guest whose
   sprite is gone. Every real guest keeps a room the save got right; the rest
   take the lowest free room, so the lobby never shows two Room 03s or a room
   that does not exist. */
function normalizeHotelStays(rows, sprites) {
  const entries = Array.isArray(rows) ? rows : [];
  const wanted = new Set(entries.map((entry) => (entry && typeof entry.id === 'string' ? entry.id : null)).filter(Boolean));
  const byId = new Map();
  (Array.isArray(sprites) ? sprites : []).forEach((sprite) => {
    if (sprite && wanted.has(sprite.id)) byId.set(sprite.id, sprite);
  });
  const seen = new Set();
  const taken = new Set();
  const kept = [];
  entries.forEach((entry) => {
    if (!entry || typeof entry.id !== 'string' || seen.has(entry.id)) return;
    const sprite = byId.get(entry.id);
    if (!sprite || sprite.stage === 'egg' || sprite.retired) return;
    seen.add(entry.id);
    const room = Math.floor(Number(entry.room) || 0);
    const row = { ...entry, id: entry.id, since: Number(entry.since) || 0, room: 0 };
    if (room >= 1 && room <= HOTEL_ROOM_COUNT && !taken.has(room)) {
      taken.add(room);
      row.room = room;
    }
    kept.push(row);
  });
  kept.forEach((row) => {
    if (row.room) return;
    for (let room = 1; room <= HOTEL_ROOM_COUNT; room += 1) {
      if (taken.has(room)) continue;
      taken.add(room);
      row.room = room;
      return;
    }
  });
  return kept.filter((row) => row.room >= 1).slice(0, HOTEL_ROOM_COUNT);
}

/* A stay is a room assignment, not a spa visit: the guest is checked in until
   the keeper checks them out, and the simulation feeds, rests and washes them
   while the badge is up. The floor is capped so the lobby stays believable. */
function hotelGuests() {
  if (!state.hotel || typeof state.hotel !== 'object') state.hotel = { careTokens: 0, careGifts: 0, lastStay: null, guests: [] };
  if (!Array.isArray(state.hotel.guests)) state.hotel.guests = [];
  const seen = new Set();
  state.hotel.guests = state.hotel.guests.filter((entry) => {
    if (!entry || typeof entry.id !== 'string' || seen.has(entry.id)) return false;
    const s = findSprite(entry.id);
    if (!s || s.stage === 'egg' || s.retired) return false;
    /* Older builds stamped no check-in time. Give them a fresh night instead of
       reading a missing stamp as a stay that ended long ago. */
    if (!(Number(entry.since) > 0)) entry.since = Date.now();
    seen.add(entry.id);
    return true;
  });
  return state.hotel.guests;
}

function isHotelGuest(sprite) {
  if (!sprite || !sprite.id) return false;
  return hotelGuests().some((entry) => entry.id === sprite.id);
}

/* How far into the night a stay is, and what it owes at the door. A tip is a
   share of the stay price, prorated by the hours actually spent in the room, so
   an early check-out still tips a little and a full night tips the most. */
function hotelStayHours(entry) {
  const since = Number(entry && entry.since) || 0;
  if (!since) return 0;
  return Math.max(0, (Date.now() - since) / 3600000);
}
function hotelStayDue(entry) {
  const since = Number(entry && entry.since) || 0;
  return !!since && Date.now() - since >= HOTEL_STAY_MS;
}
function hotelStayTip(hours) {
  const stayed = Math.max(0, Math.min(HOTEL_STAY_HOURS, Number(hours) || 0));
  return Math.max(1, Math.round(HOTEL_STAY_COINS * HOTEL_TIP_SHARE * stayed / HOTEL_STAY_HOURS));
}

/* One exit path for the desk button and for dawn: the room frees, the guest is
   handed back rested, and the stay pays its tip. */
function finishHotelStay(entry, { dawn = false } = {}) {
  if (!entry) return { ok: false, reason: 'not-staying' };
  const s = findSprite(entry.id);
  state.hotel.guests = hotelGuests().filter((row) => row.id !== entry.id);
  if (!s) return { ok: false, reason: 'missing' };
  s.needs.hunger = 100;
  s.needs.energy = 100;
  s.needs.joy = 100;
  s.needs.clean = 100;
  const hyg = hygieneOf(s);
  hyg.hair = 100;
  hyg.teeth = 100;
  hyg.breath = 100;
  addBondRaw(s, 3);
  addXpRaw(s, 10);
  const minutes = Math.max(1, Math.round((Date.now() - (Number(entry.since) || Date.now())) / 60000));
  const tip = hotelStayTip(minutes / 60);
  addCoinsRaw(tip);
  const room = String(entry.room).padStart(2, '0');
  state.stats.hotelCheckOuts = (Number(state.stats.hotelCheckOuts) || 0) + 1;
  if (dawn) state.stats.hotelDawnCheckOuts = (Number(state.stats.hotelDawnCheckOuts) || 0) + 1;
  commit('hotelCheckOut', { spriteId: s.id, room: entry.room, minutes, tip, dawn });
  toast(dawn
    ? `🌅 Dawn checkout — ${displayName(s)} leaves room ${room} with a tip of ${tip} coins.`
    : `🏨 ${displayName(s)} checks out of room ${room} — rested, fed and gleaming. Tip of ${tip} coins.`, dawn ? '🌅' : '🏨');
  return { ok: true, room: entry.room, minutes, tip, dawn };
}

function hotelFreeRoom() {
  const taken = new Set(hotelGuests().map((entry) => entry.room));
  for (let room = 1; room <= HOTEL_ROOM_COUNT; room += 1) if (!taken.has(room)) return room;
  return 0;
}

function eggs() {
  return state.sprites.filter((s) => s.stage === 'egg');
}
function displayName(s) {
  if (!s) return 'Sprite';
  if (s.stage === 'egg') {
    const finish = finishOf(s)?.name || '';
    const elementName = (ELEMENTS[s.element] || ELEMENTS.bloom).name;
    const base = s.starter ? `${elementName} Egg` : (s.eggLabel || s.name || 'Mystery Egg');
    const prefix = finish && !base.startsWith(finish) && !elementName.startsWith(finish) ? `${finish} ` : '';
    return `${prefix}${base}`;
  }
  return s.name || 'Sprite';
}
/* A creature's coat is part of its name, not only its portrait: the sheet,
   chat, studio search and evolution results all read typeName, so a Green
   T-Rex should say so everywhere. Null for everything that is not a creature. */
function cpCreatureLookName(s) {
  if (!s || typeof cpCreatureStylePalette !== 'function' || typeof cpCreatureStyleKey !== 'function') return '';
  const key = cpCreatureStyleKey(s.form, s.puffleVariant);
  const look = key ? cpCreatureStylePalette(key) : null;
  if (look && look.name) return look.name;
  /* A creature keeps its species in its name even when the curated coat is not
     what it wears: a pink Dog Puffle is not a plain Pink Puffle, and a creature
     carrying no style at all still has to read as its species. */
  const form = s.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[s.form] : null;
  const creature = form && form.creature && typeof CP_PUFFLE_CREATURES !== 'undefined' ? CP_PUFFLE_CREATURES[form.creature] : null;
  if (!creature) return '';
  const variant = s.puffleVariant && typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS
    ? window.LUMI_PUFFLE_VARIANTS[s.puffleVariant] : null;
  const colour = variant && variant.name
    ? String(variant.name).replace(/^Classic /, '').replace(/ Puffle$/, '').trim()
    : '';
  return colour ? `${colour} ${creature.label}` : creature.label;
}
/* Every canon coat a creature has been dressed in. Coats are the one part of a
   species a player collects by choice, so the list is what the coat card counts
   instead of a static roster nobody can finish. */
function recordCreatureCoat(s, bag) {
  if (!s || typeof cpCreatureStyleKey !== 'function') return false;
  const key = cpCreatureStyleKey(s.form, s.puffleVariant);
  if (!key) return false;
  const target = bag || (typeof state !== 'undefined' ? state : null);
  if (!target) return false;
  if (!target.stats || typeof target.stats !== 'object') target.stats = {};
  if (!Array.isArray(target.stats.coats)) target.stats.coats = [];
  if (target.stats.coats.includes(key)) return false;
  target.stats.coats.push(key);
  return true;
}
/* Older saves dress creatures in classic puffle colours (cp_color_purple and
   friends). Where the species carries that colour as a canon coat, the coat is
   the same look with a name and a palette the roster knows, so the load maps it
   rather than leaving the creature in a state no coat chip can describe. */
function cpCreatureCoatForClassic(formId, variantKey) {
  if (typeof cpCreatureStyleKey !== 'function' || typeof cpCreatureCoats !== 'function') return null;
  const form = formId && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[formId] : null;
  const creature = form && form.creature;
  if (!creature || !variantKey) return null;
  if (cpCreatureStyleKey(formId, variantKey)) return null;
  const match = /^cp_color_([a-z_]+)$/.exec(String(variantKey));
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  const colour = match
    ? match[1]
    : (table && table[variantKey] && (table[variantKey].color || table[variantKey].colour)) || '';
  if (!colour) return null;
  const coat = cpCreatureCoats(creature).find((entry) => entry.color === colour);
  return coat ? `pc_${creature}_${coat.key}` : null;
}
/* The twelve classic colour forms are species too: a Pink Puffle that reads
   "Bloom" everywhere is a recolour with no name of its own. */
function cpPuffleFormName(s) {
  const form = s?.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[s.form] : null;
  const type = form?.puffle && typeof CP_PUFFLE_TYPES !== 'undefined' ? CP_PUFFLE_TYPES[form.puffle] : null;
  return type?.label || '';
}
function typeName(s) {
  if (!s) return 'Unknown';
  const creature = cpCreatureLookName(s);
  if (creature) return creature;
  const colour = cpPuffleFormName(s);
  if (colour) return colour;
  return s.hybrid || (ELEMENTS[s.element] || ELEMENTS.bloom).name;
}
function spriteRarityKey(s) {
  if (!s) return 'common';
  return rarityTierWithBoost(s.element, s.rarityBoost);
}
function spriteRarity(s) {
  return TYPE_EGG_RARITIES[spriteRarityKey(s)] || TYPE_EGG_RARITIES.common;
}
function spriteRarityBonus(s) {
  return s ? rarityCoinBonus(s.element, s.rarityBoost) : 0;
}
function stageForLevel(level) {
  if (level >= 10000) return 'celestial';
  if (level >= 5000) return 'omni';
  if (level >= 2500) return 'apex';
  if (level >= 1000) return 'sensei';
  if (level >= 500) return 'ancient';
  if (level >= 100) return 'elder';
  if (level >= 35) return 'highadult';
  if (level >= 25) return 'midadult';
  if (level >= 18) return 'youngadult';
  if (level >= 10) return 'sprite';
  if (level >= 5) return 'juvenile';
  if (level >= 3) return 'child';
  if (level >= 2) return 'toddler';
  return 'baby';
}
function xpNeeded(level) {
  return 50 + level * 18;
}
/* The early years run baby, toddler, child, then Juvenile and Teen. The levels
   below Juvenile keep their shipped values, so a save that already grew up
   does not change stage when toddler and child are inserted ahead of it. */
const STAGE_ORDER = ['baby', 'toddler', 'child', 'juvenile', 'sprite', 'youngadult', 'midadult', 'highadult', 'elder', 'ancient', 'sensei', 'apex', 'omni', 'celestial'];
const STAGE_LABELS = { baby: 'Baby', toddler: 'Toddler', child: 'Child', juvenile: 'Juvenile', sprite: 'Teen', youngadult: 'Young Adult', midadult: 'Mid-Adult', highadult: 'High Adult', elder: 'Elderly', ancient: 'Ancient', sensei: 'Sensei', apex: 'Apex Cosmic', omni: 'Omni Immortal', celestial: 'Celestial Mythic' };
const STAGE_LEVEL = { baby: 1, toddler: 2, child: 3, juvenile: 5, sprite: 10, youngadult: 18, midadult: 25, highadult: 35, elder: 100, ancient: 500, sensei: 1000, apex: 2500, omni: 5000, celestial: 10000 };
const GROWTH_MILESTONES = [2, 3, 5, 10, 18, 25, 35, 100, 250, 500, 1000, 2500, 5000, 10000];
function stageEvolutionInfo(s) {
  if (!s || s.stage === 'egg') return { egg: true, current: 'egg', next: null, nextLabel: 'Egg', required: 1, levelsLeft: 0, ready: false, final: false, progress: 0 };
  const index = STAGE_ORDER.indexOf(s.stage);
  const next = index >= 0 && index < STAGE_ORDER.length - 1 ? STAGE_ORDER[index + 1] : null;
  if (!next) return { egg: false, current: s.stage, next: null, nextLabel: 'Final stage', required: MAX_LEVEL, levelsLeft: Math.max(0, MAX_LEVEL - s.level), ready: false, final: true, progress: s.level >= MAX_LEVEL ? 1 : Math.min(1, (s.xp || 0) / xpNeeded(s.level)) };
  const required = STAGE_LEVEL[next];
  const start = STAGE_LEVEL[s.stage] || 1;
  const xpPart = s.level >= required ? 0 : Math.min(1, (s.xp || 0) / xpNeeded(s.level));
  const raw = required > start ? (s.level - start + xpPart) / (required - start) : 1;
  return { egg: false, current: s.stage, next, nextLabel: STAGE_LABELS[next] || next, required, levelsLeft: Math.max(0, required - s.level), ready: s.level >= required, final: false, progress: Math.max(0, Math.min(1, raw)) };
}
function moodOf(s) {
  if (!s) return { key: 'content', label: 'Content', icon: '🙂' };
  if (s.stage === 'egg') return { key: 'egg', label: 'Cracking', icon: '🥚' };
  if (s.asleep) return { key: 'sleep', label: 'Dreaming', icon: '😴' };
  const n = s.needs;
  const avg = (n.hunger + n.energy + n.joy + n.clean) / 4;
  if (n.hunger < 14) return { key: 'starving', label: 'Starving', icon: '🍽️' };
  if (n.clean < 14) return { key: 'filthy', label: 'Grubby', icon: '🫧' };
  if (n.energy < 14) return { key: 'exhausted', label: 'Sleepy', icon: '💤' };
  /* The warm end of the scale, then the quiet end: a cared-for sprite gets
     names for how it *feels* about the care, not just how full it is. */
  if (avg >= 92 && s.bond >= 55) return { key: 'pampered', label: 'Pampered', icon: '🛁' };
  if (n.joy >= 93 && avg >= 60) return { key: 'giddy', label: 'Giddy', icon: '🤩' };
  if (typeof warmScore === 'function' && warmScore(s) >= 2 && avg >= 55) return { key: 'cozy', label: 'Cozy', icon: '🧣' };
  if (s.bond <= 18 && avg >= 55) return { key: 'lonely', label: 'Lonely', icon: '🫥' };
  if (n.hunger < 35) return { key: 'peckish', label: 'Peckish', icon: '🍪' };
  if (n.clean < 35) return { key: 'muddy', label: 'Muddy', icon: '🐾' };
  if (s.bond >= 85 && avg >= 66) return { key: 'bonded', label: 'Bonded', icon: '💖' };
  if (avg >= 78) return { key: 'radiant', label: 'Radiant', icon: '✨' };
  if (avg >= 62) return { key: 'happy', label: 'Happy', icon: '😊' };
  if (avg >= 45) return { key: 'content', label: 'Content', icon: '🙂' };
  if (avg >= 30) return { key: 'restless', label: 'Restless', icon: '😕' };
  return { key: 'grumpy', label: 'Grumpy', icon: '😾' };
}
function bondTier(s) {
  return bondRankFor(s?.bond || 0).name;
}
function spriteSubtitle(s) {
  if (!s) return '';
  if (s.stage === 'egg') return s.hatch >= 100 ? 'Ready to hatch' : 'Warm it with taps';
  const base = formName(s) || typeName(s);
  const finish = finishOf(s) ? `${finishOf(s).name} · ` : '';
  return `${s.shiny ? '✨ Shiny · ' : ''}${finish}${base} · ${BREEDS[s.breed]?.name || 'Puff'} · Gen ${(s.gen || 0) + 1}`;
}
function restLeft(s) {
  return Math.max(0, (s.restUntil || 0) - Date.now());
}

/* ---------------- bedtime & sleep cycles ---------------- */
function isBedtime(d = new Date()) {
  return timePhase(d).key === 'night';
}

function sleepInfo(s) {
  if (!s || !s.asleep) return null;
  const now = Date.now();
  const end = s.sleepUntil || now;
  const start = s.sleepStart || Math.max(0, end - NAP_MS);
  const total = Math.max(1000, end - start);
  const elapsed = clamp(now - start, 0, total);
  const cycles = Math.max(1, s.sleepCycles || 1);
  const cycleLen = total / cycles;
  const cycle = Math.min(cycles, Math.floor(elapsed / cycleLen) + 1);
  return {
    cycles,
    cycle,
    progress: elapsed / total,
    cycleProgress: cycleLen > 0 ? (elapsed % cycleLen) / cycleLen : 0,
    left: Math.max(0, end - now),
    total,
  };
}

function recordDream(s, cycles) {
  const text = pick(DREAM_LINES);
  const at = Date.now();
  const entry = {
    id: uid('dr'),
    spriteId: s.id,
    spriteName: s.name || (ELEMENTS[s.element] || ELEMENTS.bloom).name,
    element: s.element || 'bloom',
    text,
    at,
    cycles,
  };
  s.lastDream = { text, at, cycles };
  state.journal = [entry, ...(Array.isArray(state.journal) ? state.journal : [])].slice(0, 100);
  return entry;
}

function finishSleep(s) {
  const cycles = Math.max(1, s.sleepCycles || 1);
  s.asleep = false;
  s.sleepUntil = 0;
  s.sleepStart = 0;
  s.sleepCycles = 0;
  s.needs.energy = 100;
  s.needs.joy = clamp(s.needs.joy + 3 * cycles);
  addBondRaw(s, 1.5 * cycles);
  addXpRaw(s, 4 * cycles);
  const dream = recordDream(s, cycles);
  return { cycles, dream };
}

/* ---------------- gender, size, powers & evolution ---------------- */
function rollGender() {
  const r = Math.random();
  return r < 0.46 ? 'female' : r < 0.92 ? 'male' : 'neutral';
}
function genderOf(s) {
  return GENDERS[s && s.gender] ? GENDERS[s.gender] : GENDERS.neutral;
}
/* Older saves have no gender stored, so derive a stable one from the sprite id
   instead of rolling a new one on every load. */
function genderFromId(id) {
  const text = String(id || 'sprite');
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 99991;
  const roll = hash % 100;
  return roll < 46 ? 'female' : roll < 92 ? 'male' : 'neutral';
}

function rollSize() {
  const r = Math.random();
  return r < 0.28 ? 'small' : r < 0.8 ? 'standard' : 'large';
}

function specialCombo(s) {
  return s?.special ? COMBOS.find((c) => c.id === s.special) || null : null;
}
function gameCoinBase(baseCoins = 0) {
  const score = Math.max(0, Number(baseCoins) || 0);
  return Math.min(GAME_COIN_BASE_CAP, GAME_COIN_BASE + score * GAME_COIN_SCORE_VALUE);
}
function gameCoinPayout(baseCoins = 0) {
  const s = activeSprite();
  let payout = gameCoinBase(baseCoins);
  let effectCoins = 0;
  if (s) {
    const fx = spriteEffects(s);
    effectCoins = fx.gameCoins || 0;
    const phase = timePhase().key;
    if (phase === 'night') effectCoins += fx.nightCoins || 0;
    if (phase === 'day') effectCoins += fx.dayCoins || 0;
  }
  const rarityBonus = s ? spriteRarityBonus(s) : 0;
  const holiday = typeof holidayCoinMult === 'function' ? holidayCoinMult() : 1;
  const weekly = weeklyEventCoinMult();
  const outfit = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('gameCoins') : 1;
  payout = Math.round((payout + effectCoins + rarityBonus) * holiday * weekly * outfit);
  payout = Math.min(GAME_COIN_CAP, Math.max(0, payout));
  return { payout, effectCoins, rarityBonus, holiday, weekly, outfit };
}
/* The nominal rarity bonus is much larger than GAME_COIN_CAP, so every payout
   above the base lands on the cap. UI copy quotes this ceiling instead of the
   raw table, so the advertised payout is one the game can actually pay. */
function gamePayoutCeiling(rarityKey = 'common') {
  return Math.min(GAME_COIN_CAP, gameCoinBase(0) + rarityCoinBonus(rarityKey, 0));
}

function formOf(s) {
  return s?.form ? EVOLUTION_FORMS[s.form] || null : null;
}
function formName(s) {
  const form = formOf(s);
  if (!form) return null;
  if (form.id === 'titan') return TITAN_NAMES[s.element] || form.label;
  return `${(ELEMENTS[s.element] || ELEMENTS.bloom).name} ${form.label}`;
}
/* The two buckets every effect bag has to land in. A key in neither is copied
   through untouched and quietly does nothing, so the gate asserts the data only
   uses these — a typo should fail a test, not ship. */
const EFFECT_COIN_KEYS = ['gameCoins', 'petCoins', 'chatCoins', 'nightCoins', 'dayCoins', 'checkinCoins', 'taskCoins'];
const EFFECT_MULTIPLIER_KEYS = ['xp', 'petBond', 'giftSpeed', 'decay', 'joyDecay', 'hungerDecay', 'energyDecay', 'cleanDecay', 'snackXp'];

function spriteEffects(s) {
  if (!s) return {};
  const merged = {};
  const add = (effect = {}) => {
    Object.entries(effect).forEach(([key, value]) => {
      if (EFFECT_COIN_KEYS.includes(key)) {
        merged[key] = (merged[key] || 0) + value;
      } else if (EFFECT_MULTIPLIER_KEYS.includes(key)) {
        merged[key] = (merged[key] || 1) * value;
      } else {
        merged[key] = value;
      }
    });
  };
  add(GENE_POWERS[s.element]?.effect);
  add(typeof abilityEffectsFor === 'function' ? abilityEffectsFor(s) : {});
  /* The colour a Club Penguin puffle wears is its gameplay kit too: its canon
     ability and discipline each carry numbers this merge reads directly. */
  const cpProfile = typeof cpPuffleProfileForSprite === 'function' ? cpPuffleProfileForSprite(s) : null;
  if (cpProfile) {
    add(cpProfile.type.ability?.effect);
    add(cpProfile.type.skill?.effect);
  }
  add(HABITS[s.breed]?.effect);
  add(FINISHES[s.variant]?.effect);
  add(specialCombo(s)?.power.effect);
  add(formOf(s)?.power.effect);
  add(bondRankFor(s?.bond || 0).effect);
  /* Personality + rolled skill: real multipliers on XP, bond and need decay. */
  add(typeof window.spriteTraitMods === 'function' ? window.spriteTraitMods(s) : null);
  if (['common', 'uncommon'].includes(spriteRarityKey(s))) {
    merged.giftSpeed = (merged.giftSpeed || 1) * 1.25;
  }
  const rebirths = Math.max(0, Number(s.rebirths) || 0);
  if (rebirths) {
    merged.xp = (merged.xp || 1) * (1 + 0.08 * rebirths);
    merged.gameCoins = (merged.gameCoins || 0) + rebirths;
    merged.giftSpeed = (merged.giftSpeed || 1) * (1 + 0.03 * rebirths);
  }
  return merged;
}
function habitatFor(s, sceneKey = state.theme.scene) {
  const scene = SCENES[sceneKey] || SCENES.grove;
  const match = !!s && (scene.allSprites || (scene.species || []).includes(s.element));
  const bonus = match ? (scene.bonus || 0.4) : 0.1;
  return { scene, match, bonus, percent: Math.round(bonus * 100) };
}
function spritePowers(s) {
  const list = [
    { kind: 'Gene', ...(GENE_POWERS[s.element] || {}) },
    { kind: 'Habit', ...(HABITS[s.breed] || {}) },
  ];
  const combo = specialCombo(s);
  if (combo) list.push({ kind: 'Combo', ...combo.power });
  const form = formOf(s);
  if (form) list.push({ kind: 'Evolution', ...form.power });
  const finish = finishOf(s);
  if (finish) list.push({ kind: 'Finish', name: `${finish.name} finish`, icon: finish.icon, desc: finish.bonus });
  return list;
}
function dietInfo(s) {
  return Object.keys(DIET_PATHS).map((key) => ({
    key,
    ...DIET_PATHS[key],
    points: Math.max(0, s?.diet?.[key] || 0),
    need: EVOLUTION_AFFINITY,
    ready: (s?.diet?.[key] || 0) >= EVOLUTION_AFFINITY,
  }));
}
function cuisineInfo(s) {
  return Object.keys(CUISINE_PATHS).map((key) => ({
    key,
    ...CUISINE_PATHS[key],
    points: Math.max(0, Number(s?.cuisine?.[key]) || 0),
    need: EVOLUTION_AFFINITY,
    ready: (Number(s?.cuisine?.[key]) || 0) >= EVOLUTION_AFFINITY,
  }));
}
/* A meal can disagree with a sprite. The Sickness module owns the odds and
   the cause; this wrapper keeps all three feed paths announcing it the same
   way and lets the commit carry the new illness with the rest of the meal. */
function catchFoodSickness(s, food) {
  if (!s || !food || typeof Sickness === 'undefined' || typeof Sickness.foodCheck !== 'function') return null;
  const illness = Sickness.foodCheck(s, food);
  if (!illness) return null;
  const info = typeof ILLNESSES !== 'undefined' ? ILLNESSES[illness.key] : null;
  toast(`${displayName(s)} has ${info ? `${info.icon} ${info.name}` : 'a poorly tummy'} after ${food.name}.`, info ? info.icon : '🤒');
  return illness;
}

/* One source of truth: the dish the sheet names is the dish that pays, and the
   resolver already prefers the form, then the breed, then the family's likes. */
function isFavoriteFood(s, foodId) {
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  return !!(comforts && comforts.food.id === foodId);
}
function dietGainRaw(s, foodId, bonus = 0) {
  const diet = FOOD_DIET[foodId];
  if (!s || !diet) return null;
  s.diet = s.diet || {};
  const before = s.diet[diet.path] || 0;
  const gain = Math.max(1, Number(diet.gain) || 1) + bonus;
  s.diet[diet.path] = before + gain;
  return { path: diet.path, before, after: s.diet[diet.path], gain };
}
function cuisineGainRaw(s, foodId, bonus = 0) {
  const food = FOODS[foodId];
  const region = food && food.region;
  if (!s || !region || !CUISINE_PATHS[region]) return null;
  s.cuisine = s.cuisine || {};
  const before = Math.max(0, Number(s.cuisine[region]) || 0);
  const gain = Math.max(1, Number(food.cuisine) || 1) + bonus;
  s.cuisine[region] = before + gain;
  return { region, before, after: s.cuisine[region], gain };
}
function announceEvolutionReady(s, diet, cuisine) {
  if (!s || s.form || s.level < EVOLUTION_LEVEL) return;
  const dietReady = diet && diet.before < EVOLUTION_AFFINITY && diet.after >= EVOLUTION_AFFINITY;
  const cuisineReady = cuisine && cuisine.before < EVOLUTION_AFFINITY && cuisine.after >= EVOLUTION_AFFINITY;
  if (dietReady || cuisineReady) toast(`${displayName(s)} is ready to evolve! Check their details.`, '🧬');
}
function snackCount(key) {
  return Math.max(0, Number(state.inventory?.snacks?.[key]) || 0);
}
function snackTotal() {
  return SNACK_KEYS.reduce((n, key) => n + snackCount(key), 0);
}
function addSnackRaw(key, count = 1) {
  if (!SNACKS[key]) return 0;
  state.inventory = state.inventory || { snacks: {}, foods: {} };
  state.inventory.snacks = state.inventory.snacks || {};
  state.inventory.snacks[key] = Math.max(0, (state.inventory.snacks[key] || 0) + count);
  return state.inventory.snacks[key];
}
function foodCount(key) {
  return Math.max(0, Number(state.inventory?.foods?.[key]) || 0);
}
function foodTotal() {
  return FOOD_KEYS.reduce((n, key) => n + foodCount(key), 0);
}
function unlockedFoodKeys() {
  return FOOD_KEYS.filter((k) => !FOODS[k].giftOnly
    && (!FOODS[k].monthly || (state.foodUnlocks || []).includes(k))
    && !(typeof cafeFoodLocked === 'function' && cafeFoodLocked(k)));
}
function candyMorphRaw(s, itemKey) {
  if (!s || s.stage === 'egg' || typeof CANDY_ITEMS === 'undefined' || !CANDY_ITEMS.includes(itemKey)) return null;
  s.sugar = (Number(s.sugar) || 0) + 1;
  if (s.sugar < 3) return null;
  s.sugar = 0;
  const choices = CANDY_SPECIES.filter((key) => key !== s.element);
  if (!choices.length) return null;
  s.element = pick(choices);
  s.hybrid = null;
  s.hybridParents = null;
  state.stats.candyMorphs = (state.stats.candyMorphs || 0) + 1;
  toast(`${displayName(s)} transformed into ${ELEMENTS[s.element].name}!`, '🍬');
  return s.element;
}
function addFoodRaw(key, count = 1) {
  if (!FOODS[key]) return 0;
  state.inventory = state.inventory || { snacks: {}, foods: {} };
  state.inventory.foods = state.inventory.foods || {};
  state.inventory.foods[key] = Math.max(0, (state.inventory.foods[key] || 0) + count);
  return state.inventory.foods[key];
}

/* ---------------- gifts ---------------- */
function scheduleGiftRaw(first = false) {
  if (!state.started) return;
  const candidates = grownSprites();
  if (!candidates.length) {
    state.gift = null;
    return;
  }
  const sprite = activeSprite() || pick(candidates);
  const speed = (spriteEffects(sprite).giftSpeed || 1) * (typeof holidayGiftSpeed === 'function' ? holidayGiftSpeed() : 1) * weeklyEventGiftSpeed();
  const seconds = (first ? rand(45, 110) : rand(150, 360)) / speed;
  state.gift = {
    spriteId: sprite.id,
    createdAt: Date.now(),
    readyAt: Date.now() + seconds * 1000,
    notified: false,
  };
}
function ensureGift() {
  if (!state.started || !grownSprites().length) {
    state.gift = null;
    return;
  }
  if (!state.gift || !findSprite(state.gift.spriteId)) {
    scheduleGiftRaw(!state.stats?.gifts);
    return;
  }
  if (!state.gift.notified && Date.now() >= state.gift.readyAt) {
    state.gift.notified = true;
    const s = findSprite(state.gift.spriteId);
    if (s) toast(`${displayName(s)} has a gift for you in the Hollow.`, '🎁');
    saveState();
  }
}
function giftReady() {
  return !!(state.gift && Date.now() >= state.gift.readyAt && findSprite(state.gift.spriteId));
}

/* ---------------- check-in & calendar periods ---------------- */
/* The type quiz is a small standalone event: it appears every other local
   calendar day, at one random morning-to-night time chosen when that day first
   opens. The ready time is saved, so a reload cannot reroll it. */
function quizDaySerial(date = new Date()) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}
function isQuizDay(date = new Date()) {
  return Math.abs(quizDaySerial(date)) % 2 === 0;
}
function nextQuizDay(date = new Date()) {
  for (let offset = 1; offset <= 2; offset += 1) {
    const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
    if (isQuizDay(candidate)) return candidate;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
}
function ensureQuizPeriods() {
  if (!state.quiz || typeof state.quiz !== 'object') {
    state.quiz = { date: null, readyAt: 0, doneDate: null };
  }
  const today = dayKey();
  if (isQuizDay() && state.quiz.date !== today) {
    const startMinute = 8 * 60;
    const endMinute = 22 * 60;
    const minute = startMinute + Math.floor(Math.random() * (endMinute - startMinute));
    const ready = new Date();
    ready.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
    state.quiz = {
      date: today,
      readyAt: ready.getTime(),
      doneDate: state.quiz.doneDate || null,
    };
    saveState();
  }
  return state.quiz;
}
function quizStatus(now = Date.now()) {
  const today = dayKey();
  const eligible = isQuizDay();
  const quiz = ensureQuizPeriods();
  const scheduled = eligible && quiz.date === today;
  const done = scheduled && quiz.doneDate === today;
  return {
    eligible,
    scheduled,
    done,
    ready: scheduled && !done && now >= quiz.readyAt,
    readyAt: scheduled ? quiz.readyAt : 0,
    date: quiz.date,
    next: nextQuizDay().getTime(),
  };
}
function ensureCheckinPeriods() {
  const c = state.checkin;
  const today = dayKey();
  const week = weekKey();
  const month = monthKey();
  const year = yearKey();
  if (!c.weekKey) c.weekKey = week;
  else if (c.weekKey !== week) {
    c.weekStreak = (c.weekSlots || 0) >= 7 ? (c.weekStreak || 0) + 1 : 0;
    c.weekKey = week;
    c.weekSlots = 0;
    c.weekClaims = [];
  }
  if (!c.monthKey) c.monthKey = month;
  else if (c.monthKey !== month) {
    c.monthStreak = (c.monthDays || 0) >= 12 ? (c.monthStreak || 0) + 1 : 0;
    c.monthKey = month;
    c.monthDays = 0;
    c.monthSlots = 0;
    c.monthClaims = [];
  }
  if (!c.yearKey) c.yearKey = year;
  else if (c.yearKey !== year) {
    c.yearStreak = (c.yearDays || 0) >= 120 ? (c.yearStreak || 0) + 1 : 0;
    c.yearKey = year;
    c.yearDays = 0;
    c.yearSlots = 0;
    c.yearClaims = [];
  }
  if (c.slotsDate !== today) {
    c.slotsDate = today;
    c.slots = [];
  }
  if (c.last && c.last !== today && c.last !== yesterdayKey()) c.streak = 0;
  return c;
}
function ensureArcadePeriods() {
  if (!state.arcade) state.arcade = { coins: 0, bonusClaims: 0, monthKey: null, monthCoins: 0, monthClaims: [] };
  const a = state.arcade;
  const month = monthKey();
  a.coins = Math.max(0, Number(a.coins) || 0);
  a.bonusClaims = Math.max(0, Number(a.bonusClaims) || 0);
  a.monthCoins = Math.max(0, Number(a.monthCoins) || 0);
  if (!Array.isArray(a.monthClaims)) a.monthClaims = [];
  if (a.monthKey !== month) {
    a.monthKey = month;
    a.monthCoins = 0;
    a.monthClaims = [];
    saveState();
  }
  return a;
}
function currentCheckinSlot() {
  ensureCheckinPeriods();
  const win = currentCheckinWindow();
  const claimed = state.checkin.slots.includes(win.id);
  return { ...win, claimed };
}

/* ---------------- wild sprite rewards ---------------- */
/* A species can pin the body it hatches with (the Club Penguin type keeps its
   own breed), while every other type continues to roll a random breed. */
function defaultBreedFor(element) {
  const forced = element && typeof ELEMENTS !== 'undefined' && ELEMENTS[element]
    ? ELEMENTS[element].forcedBreed
    : null;
  return forced && typeof BREEDS !== 'undefined' && BREEDS[forced] ? forced : pick(BREED_KEYS);
}

function randomWildRaw({ rare = false, mythic = false } = {}) {
  const stage = mythic ? 'elder' : pick(rare ? ['juvenile', 'sprite', 'youngadult', 'midadult', 'highadult', 'elder'] : ['baby', 'juvenile', 'sprite', 'youngadult', 'midadult', 'highadult', 'elder']);
  const level = {
    baby: randInt(1, 4),
    juvenile: randInt(5, 9),
    sprite: randInt(10, 17),
    youngadult: randInt(18, 24),
    midadult: randInt(25, 34),
    highadult: randInt(35, 99),
    elder: randInt(100, 149),
  }[stage];
  const combo = rare && chance(0.55) ? pick(COMBOS) : null;
  const mutation = chance(rare ? 0.5 : 0.08) ? pick(MUTATIONS) : null;
  const variant = rollFinish(rare ? 0.4 : 0.12);
  const element = (window.wildSpeciesRoll ? window.wildSpeciesRoll() : pick(WILD_SPECIES));
  const size = mythic || (rare && chance(0.55)) ? 'large' : rollSize();
  const sprite = makeSprite({
    element,
    breed: defaultBreedFor(element),
    palette: combo ? combo.palette : mutation ? mutation.palette : chance(0.3) ? pick(PALETTE_KEYS.filter((k) => k !== 'native')) : 'native',
    pattern: combo ? combo.pattern : pick(PATTERN_KEYS),
    accessory: combo ? combo.accessory : chance(0.3) ? pick(FREE_ACCESSORY_KEYS) : 'none',
    personality: pick(PERSONALITY_KEYS),
    mutation: mutation ? mutation.name : null,
    variant,
    special: combo ? combo.id : null,
    stage,
    level,
    size,
    form: mythic ? pick(Object.keys(EVOLUTION_FORMS)) : null,
    gen: randInt(0, 3),
    bond: randInt(8, 34),
    needs: { hunger: randInt(70, 96), energy: randInt(70, 96), joy: randInt(72, 98), clean: randInt(76, 100) },
    hatch: 100,
  });
  sprite.name = makeName(element);
  state.sprites.push(sprite);
  if (!state.activeId) state.activeId = sprite.id;
  return sprite;
}

function grantMilestoneRaw(m) {
  if (!m) return null;
  if (m.kind === 'snacks') {
    const names = [];
    for (let i = 0; i < (m.amount || 2); i++) {
      const key = pick(SNACK_KEYS);
      addSnackRaw(key, 1);
      names.push(SNACKS[key].name);
    }
    return { kind: 'snacks', icon: '🍬', title: m.label, text: names.join(' · ') };
  }
  if (m.kind === 'wild' || m.kind === 'rare' || m.kind === 'mythic') {
    const s = randomWildRaw({ rare: m.kind === 'rare' || m.kind === 'mythic', mythic: m.kind === 'mythic' });
    return { kind: 'sprite', icon: m.icon, title: m.label, text: `${formName(s) || typeName(s)} · ${stageLabel(s)} · ${SIZES[s.size].name}`, spriteId: s.id };
  }
  if (m.kind === 'scene') {
    const locked = GIFT_SCENES.filter((k) => !state.unlockedScenes.includes(k));
    if (!locked.length) {
      addCoinsRaw(80);
      return { kind: 'coins', icon: '🪙', title: m.label, text: '+80 coins' };
    }
    const key = pick(locked);
    state.unlockedScenes.push(key);
    return { kind: 'scene', icon: '🏞️', title: m.label, text: SCENES[key].name, sceneKey: key };
  }
  return null;
}

/* ---------------- daily tasks ---------------- */
function ensureDaily() {
  const today = dayKey();
  if (state.daily && state.daily.date === today) return false;
  const rnd = seedRandom(`hollow-${today}-${state.sprites.length}`);
  const shuffled = TASK_POOL.slice()
    .map((t) => ({ t, k: rnd() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.t)
    .slice(0, 4);
  state.daily = {
    date: today,
    counters: {},
    tasks: shuffled.map((t) => ({ ...t, claimed: false })),
  };
  saveState();
  return true;
}
function makePeriodTasks(count, goalScale, rewardScale, seed) {
  const rnd = seedRandom(seed);
  const tasks = TASK_POOL.slice()
    .map((t) => ({ t, k: rnd() }))
    .sort((a, b) => a.k - b.k)
    .slice(0, count)
    .map(({ t }) => t);
  return tasks.map((t) => ({
    ...t,
    id: `${seed.startsWith('weekly') ? 'w' : 'm'}-${t.id}`,
    goal: Math.max(2, Math.round(t.goal * goalScale)),
    reward: Math.round(t.reward * rewardScale),
    xp: Math.round(t.xp * rewardScale * 0.7),
    claimed: false,
  }));
}
function ensureQuests() {
  const week = weekKey();
  const month = monthKey();
  if (!state.weekly || state.weekly.key !== week) {
    state.weekly = { key: week, counters: {}, tasks: makePeriodTasks(3, 3, 3, `weekly-${week}`) };
    saveState();
  }
  if (!state.monthly || state.monthly.key !== month) {
    state.monthly = { key: month, counters: {}, tasks: makePeriodTasks(2, 10, 7, `monthly-${month}`) };
    saveState();
  }
}
/* The arcade's favourites are a plain list of game keys. A key is dropped when
   the game no longer exists, so a removed mini game cannot leave a dead star. */
function favoriteGames() {
  return (Array.isArray(state.favoriteGames) ? state.favoriteGames : [])
    .filter((kind) => typeof GAME_INFO === 'undefined' || GAME_INFO[kind]);
}

/* A pin is the species the player asked to see in a windowed band. It is read
   at draw time and dropped the moment it stops being a member of that band, so
   a stale save or a renamed species cannot pin something that is not on sale. */
function bandPinFor(tierKey) {
  const key = tierKey && state.tierPins ? state.tierPins[tierKey] : null;
  if (!key || typeof tierEggBandPool !== 'function') return null;
  return tierEggBandPool(tierKey).includes(key) ? key : null;
}

function isFavoriteGame(kind) {
  return favoriteGames().includes(kind);
}

function toggleFavoriteGame(kind) {
  if (typeof GAME_INFO !== 'undefined' && !GAME_INFO[kind]) return { ok: false, reason: 'missing' };
  const list = favoriteGames();
  const on = !list.includes(kind);
  state.favoriteGames = on ? [...list, kind] : list.filter((key) => key !== kind);
  commit('favoriteGames', { kind, on });
  return { ok: true, on, count: state.favoriteGames.length };
}

function bump(stat, n = 1) {
  if (typeof biomeQuestNote === 'function' && (stat === 'games' || stat === 'pets' || stat === 'feeds' || stat === 'baths' || stat === 'rubs')) biomeQuestNote(stat === 'games' ? 'game' : 'care');
  /* Stories watch the same counters the daily tasks do: one care action can
     advance the running story and, when nothing is running, start a new one. */
  if (typeof storyNote === 'function') storyNote(stat);
  if (typeof maybeStartStory === 'function') maybeStartStory();
  ensureDaily();
  ensureQuests();
  state.daily.counters[stat] = (state.daily.counters[stat] || 0) + n;
  state.weekly.counters[stat] = (state.weekly.counters[stat] || 0) + n;
  state.monthly.counters[stat] = (state.monthly.counters[stat] || 0) + n;
}
function taskCounter(task) {
  return state.daily?.counters?.[task.stat] || 0;
}
function periodCounter(task, period = 'daily') {
  const bucket = period === 'weekly' ? state.weekly : period === 'monthly' ? state.monthly : state.daily;
  return bucket?.counters?.[task.stat] || 0;
}

/* ---------------- weekly events ---------------- */
function ensureWeeklyEvents() {
  const key = weekKey();
  if (!state.weeklyEvents || state.weeklyEvents.weekKey !== key) {
    state.weeklyEvents = { weekKey: key, claims: [] };
  }
  state.weeklyEvents.claims = Array.isArray(state.weeklyEvents.claims)
    ? state.weeklyEvents.claims.filter((claim) => WEEKLY_EVENT_BY_KEY[claim])
    : [];
  return state.weeklyEvents;
}
function activeWeeklyEvent() {
  return weeklyEventForDate();
}
function weeklyEventClaimed(event = activeWeeklyEvent()) {
  return !!event && ensureWeeklyEvents().claims.includes(event.key);
}
function weeklyEventEffects(event = activeWeeklyEvent()) {
  return event?.effects || {};
}
function weeklyEventXpMult() { return weeklyEventEffects().xp || 1; }
function weeklyEventCoinMult() { return weeklyEventEffects().coins || 1; }
function weeklyEventGiftSpeed() { return weeklyEventEffects().giftSpeed || 1; }
function weeklyEventBondMult() { return weeklyEventEffects().bond || 1; }
function weeklyEventMissingVaultKeys() {
  const unlocked = Array.isArray(state.secretUnlocks) ? state.secretUnlocks : [];
  return SECRET_SPECIES.filter((key) => !unlocked.includes(key));
}
function weeklyEventFoodKeys(event = activeWeeklyEvent()) {
  const cats = event?.reward?.foodCats || [];
  if (!cats.length) return [];
  return FOOD_KEYS.filter((key) => {
    const food = FOODS[key];
    return food && cats.includes(food.cat) && !food.rebirth && !food.stageBoost && !food.giftOnly;
  });
}
function weeklyEventMissingCrates(event = activeWeeklyEvent()) {
  const index = WEEKLY_EVENTS.findIndex((item) => item.key === event?.key);
  if (index < 0) return 0;
  const claims = ensureWeeklyEvents().claims;
  let count = 0;
  for (let i = 0; i < index; i++) {
    if (!claims.includes(WEEKLY_EVENTS[i].key)) count += 1;
  }
  return count;
}

/* ---------------- economy & growth (raw, no commit) ---------------- */
function addCoinsRaw(n) {
  state.coins = Math.max(0, state.coins + n);
  if (n > 0) state.stats.earned += n;
  else state.stats.spent += -n;
}
/* Undoing a purchase returns the coins without counting them as new earnings. */
function refundCoinsRaw(n) {
  const amount = Math.max(0, Number(n) || 0);
  if (!amount) return;
  state.coins = Math.max(0, state.coins + amount);
  state.stats.spent = Math.max(0, (Number(state.stats.spent) || 0) - amount);
}
function addBondRaw(s, amount) {
  const mod = BREEDS[s.breed]?.bondMod || 1;
  const outfit = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('bond', s) : 1;
  const before = typeof relationshipTierFor === 'function' ? relationshipTierFor(s.bond) : null;
  s.bond = clamp(s.bond + amount * mod * weeklyEventBondMult() * outfit);
  /* A rung reached is worth a line: the chat tiers otherwise only show up on
     the collection sheet, never at the moment they are earned. */
  const after = typeof relationshipTierFor === 'function' ? relationshipTierFor(s.bond) : null;
  if (before && after && after.key !== before.key && after.min > before.min && typeof toast === 'function') {
    toast(`${displayName(s)} now sees you as ${after.name}.`, '💞');
  }
  if (s.bond >= 100) unlockSecret('heartkeeper');
}
/* A Starpath Feast is deliberately stage-based rather than a flat XP item. */
function stageFeastRaw(s) {
  if (!s || s.stage === 'egg' || s.retired) return { ok: false, reason: 'missing' };
  if (s.level >= MAX_LEVEL) return { ok: false, reason: 'max' };
  const target = GROWTH_MILESTONES.find((n) => n > s.level) || MAX_LEVEL;
  let need = Math.max(0, xpNeeded(s.level) - s.xp);
  for (let level = s.level + 1; level < target; level++) need += xpNeeded(level);
  const factor = (BREEDS[s.breed]?.xpMod || 1)
    * (1 + (s.gen || 0) * 0.05)
    * (spriteEffects(s).xp || 1)
    * (1 + habitatFor(s).bonus);
  const from = s.level;
  addXpRaw(s, Math.max(1, Math.ceil(need / Math.max(0.05, factor))));
  return { ok: true, target, from, to: s.level };
}

function canGainXp(s) {
  return !!s && s.stage !== 'egg' && !s.retired && s.level < MAX_LEVEL;
}
/* Tasks and games should move both halves of the next fusion forward, not just
   whichever sprite happens to be active. The partner is the sprite closest to
   the MERGE_LEVEL merge gate; once nothing is below it there is no pair left to
   raise, so the award is not split. */
function mergePartnerFor(primary) {
  const candidates = state.sprites.filter((s) => s !== primary && canGainXp(s) && s.level < MERGE_LEVEL);
  candidates.sort(FirstFlight.gateOrder);
  return candidates[0] || null;
}
/* Tasks, games, and hatch rewards should not be lost just because the active
   sprite is an egg, retired, or already at max level. Prefer the requested
   sprite, then the active sprite, then any grown sprite. If the Hollow only
   contains eggs, return an egg so addXpRaw can queue the reward for hatching. */
function xpRecipient(preferred = null) {
  const candidates = [preferred, findSprite(state.activeId), ...state.sprites];
  for (const s of candidates) {
    if (canGainXp(s)) return s;
  }
  return candidates.find((s) => s && s.stage === 'egg') || null;
}
/* Half of a task, game, walk, or sport award follows the other merge partner.
   The primary keeps the remainder, an only-egg Hollow still banks the full
   reward on that egg for hatching, and the primary's level-ups are returned
   for the result toast. */
function awardXpWithPartner(preferred, amount) {
  const primary = xpRecipient(preferred);
  if (!primary) return 0;
  const total = Math.max(0, Number(amount) || 0);
  const partner = mergePartnerFor(primary);
  const partnerXp = partner ? Math.floor(total / 2) : 0;
  const ups = addXpRaw(primary, total - partnerXp);
  if (partnerXp > 0) addXpRaw(partner, partnerXp);
  return ups;
}
function addXpRaw(s, amount) {
  if (!s) return 0;
  if (s.stage === 'egg') {
    s.pendingXp = Math.max(0, Number(s.pendingXp) || 0) + Math.max(0, Number(amount) || 0);
    return 0;
  }
  if (s.retired) return 0;
  if (s.level >= MAX_LEVEL) {
    s.xp = 0;
    unlockSecret('summitspirit');
    unlockSecret('elderkeeper');
    return 0;
  }
  const breed = BREEDS[s.breed] || {};
  const habitat = habitatFor(s);
  const holidayXp = typeof holidayXpMult === 'function' ? holidayXpMult() : 1;
  const weekendXp = typeof weekendAdminXpMult === 'function' ? weekendAdminXpMult() : 1;
  const total = amount * weeklyEventXpMult() * holidayXp * weekendXp * (breed.xpMod || 1) * (1 + (s.gen || 0) * 0.05) * (spriteEffects(s).xp || 1) * (1 + habitat.bonus);
  s.xp += total;
  let ups = 0;
  while (s.level < MAX_LEVEL && s.xp >= xpNeeded(s.level)) {
    s.xp -= xpNeeded(s.level);
    s.level += 1;
    ups += 1;
  }
  if (s.level >= MAX_LEVEL) {
    s.xp = 0;
    unlockSecret('summitspirit');
  }
  if (ups > 0) {
    if (s.level >= MAX_LEVEL) unlockSecret('elderkeeper');
    addCoinsRaw(12 * ups);
    s.needs.joy = clamp(s.needs.joy + 8);
    s.bond = clamp(s.bond + 3);
    const nextStage = stageForLevel(s.level);
    const prevStage = s.stage;
    if (nextStage !== s.stage) {
      s.stage = nextStage;
      const names = STAGE_LABELS;
      toast(`${displayName(s)} grew into a ${names[nextStage]}!`, '🌟');
      if (typeof announceStageEvolution === 'function') announceStageEvolution(s, prevStage, nextStage);
      Sfx.level();
    } else {
      toast(`${displayName(s)} reached level ${s.level}`, '⭐');
      Sfx.level();
    }
    commit('levelup', { spriteId: s.id });
  }
  return ups;
}
function pushLog() { /* reserved for future event history */ }

/* ---------------- genetics ---------------- */
function blendPalettes(pa, pb) {
  const t = rand(0.36, 0.64);
  const body = mix(pa.body, pb.body, t);
  return {
    body,
    light: mix(pa.light, pb.light, 0.5),
    deep: darken(body, 0.28),
    accent: pick([pa.accent, pb.accent, mix(pa.accent, pb.accent, 0.5)]),
    belly: lighten(body, 0.6),
  };
}
function shineChanceForMerge(a, b) {
  let p = 0.16 + Math.min(0.08, (state.stats.merges || 0) * 0.004);
  if (!!a?.shiny !== !!b?.shiny) p += 0.12;
  if (a?.shiny && b?.shiny) p += 0.22;
  if (a && b && hybridFor(a.element, b.element)) p += 0.06;
  if (a?.mutation) p += 0.02;
  if (b?.mutation) p += 0.02;
  p += Math.min(0.04, ((a?.gen || 0) + (b?.gen || 0)) * 0.005);
  return clamp(p, 0, 0.55);
}

function shineChanceForHatch(s) {
  let p = 0.06;
  p += Math.min(0.03, (s.gen || 0) * 0.01);
  if (s.hybrid) p += 0.02;
  if (s.special) p += 0.02;
  if (s.mutation) p += 0.02;
  if (finishOf(s)) p += 0.01;
  return clamp(p, 0, 0.2);
}

function buildChild(a, b, eggMerge = false, why = null) {
  /* Egg merges trade two shells for one hatched puffle of a new breed, so they
     never inherit a parent breed and skip the egg stage entirely. */
  const notes = why && typeof why === 'object' ? why : null;
  const note = (key, value) => { if (notes) notes[key] = value; };
  const tri = typeof tribridFor === 'function' ? tribridFor(a, b) : null;
  const triChance = !!tri && chance(0.4);
  /* While the First Flight waiver is unspent, the first fusion always lands a
     hybrid when the pair has one. The flag is consumed in completeMerge. */
  const guaranteedHybrid = !eggMerge && firstFlightMergeWaived() && typeof hybridFor === 'function'
    ? hybridFor(a.element, b.element)
    : null;
  const hybridName = guaranteedHybrid || (triChance ? tri.name : (typeof hybridRollFor === 'function' ? hybridRollFor(a.element, b.element) : hybridFor(a.element, b.element)));
  const mergeCount = state.stats.merges || 0;
  const comboChance = Math.min(0.34, 0.04 + mergeCount * 0.012);
  let combo = null;
  if (chance(comboChance)) {
    const pair = [a.element, b.element].sort().join('+');
    combo = COMBOS.find((c) => c.pair && [c.pair[0], c.pair[1]].sort().join('+') === pair)
      || pick(COMBOS.filter((c) => !c.pair));
  }
  const useHybrid = !!guaranteedHybrid || triChance || (!!hybridName && (!!combo || chance(0.45)));
  const typeRoll = chance(0.5) ? 'a' : 'b';
  const element = typeRoll === 'a' ? a.element : b.element;
  note('type', { from: a.element === b.element ? 'both' : typeRoll, element });
  const pa = resolvePalette(a);
  const pb = resolvePalette(b);
  let palette = 'native';
  let custom = null;
  let mutation = null;
  let paletteSource = { kind: 'native' };
  const mutationChance = 0.1 + (hybridName ? 0.08 : 0) + (a.mutation ? 0.04 : 0) + (b.mutation ? 0.04 : 0) + Math.min(0.06, mergeCount * 0.004);
  if (combo) {
    palette = combo.palette;
    paletteSource = { kind: 'combo', combo: combo.name };
  } else if (chance(mutationChance)) {
    const m = pick(MUTATIONS);
    mutation = m.name;
    palette = m.palette;
    paletteSource = { kind: 'mutation', mutation: m.name };
  } else if (chance(0.4)) {
    palette = 'custom';
    custom = blendPalettes(pa, pb);
    paletteSource = { kind: 'blend' };
  } else if (chance(0.22)) {
    const randomPalette = pick(['aurora', 'candy', 'matcha', 'deepsea', 'sunset', 'midnight', 'mono']);
    palette = randomPalette;
    paletteSource = { kind: 'random', palette: randomPalette };
  } else {
    const parentPaletteRoll = chance(0.5) ? 'a' : 'b';
    const parentPalette = parentPaletteRoll === 'a' ? a.palette : b.palette;
    const paletteFrom = a.palette === b.palette ? 'both' : parentPaletteRoll;
    if (parentPalette === 'custom') {
      palette = 'custom';
      custom = chance(0.5) ? { ...a.custom } : { ...b.custom };
      paletteSource = { kind: 'parent', from: paletteFrom, custom: true };
    } else if (PALETTES[parentPalette]) {
      palette = parentPalette;
      paletteSource = { kind: 'parent', from: paletteFrom };
    }
  }
  note('palette', Object.assign({}, paletteSource, { palette }));
  let breed;
  if (eggMerge) {
    const excluded = [a.breed, b.breed].filter(Boolean);
    const pool = BREED_KEYS.filter((key) => !excluded.includes(key));
    breed = pick(pool);
    note('breed', { kind: 'new-egg-merge', breed, excluded, pool: pool.length });
  } else {
    const breedRoll = chance(0.5) ? 'a' : 'b';
    breed = breedRoll === 'a' ? a.breed : b.breed;
    note('breed', { kind: 'parent', from: a.breed === b.breed ? 'both' : breedRoll, breed });
    if (chance(0.08)) {
      breed = pick(BREED_KEYS);
      note('breed', { kind: 'random', breed });
    }
  }
  const pattern = combo ? combo.pattern : chance(0.45) ? a.pattern : chance(0.72) ? b.pattern : pick(PATTERN_KEYS);
  const accessory = combo ? combo.accessory : chance(0.3) ? (chance(0.5) ? a.accessory : b.accessory) : 'none';
  const personality = chance(0.4) ? a.personality : chance(0.62) ? b.personality : pick(PERSONALITY_KEYS);
  const size = chance(0.2) ? pick(SIZE_KEYS) : chance(0.5) ? a.size || 'standard' : b.size || 'standard';
  const parentFinish = a.variant || b.variant;
  const variant = parentFinish && chance(0.45)
    ? (a.variant && b.variant ? (chance(0.5) ? a.variant : b.variant) : parentFinish)
    : rollFinish(0.07);
  const shiny = chance(shineChanceForMerge(a, b));
  const newborn = eggMerge
    ? { stage: 'baby', hatch: 100, bond: 12, needs: { hunger: 78, energy: 82, joy: 84, clean: 92 } }
    : { stage: 'egg', hatch: 0, needs: { hunger: 72, energy: 76, joy: 74, clean: 90 } };
  const child = makeSprite({
    element,
    hybrid: useHybrid ? hybridName : null,
    hybridParents: useHybrid ? (triChance ? tri.parents : [a.element, b.element]) : null,
    breed,
    palette,
    custom,
    pattern,
    accessory,
    personality,
    size,
    variant,
    shiny,
    shinyRolled: !eggMerge,
    special: combo ? combo.id : null,
    gen: Math.max(a.gen || 0, b.gen || 0) + 1,
    mutation,
    rarityBoost: typeof window.rarityBreedShift === 'function' ? window.rarityBreedShift(a.element, b.element) : 0,
    lineage: [a.name || typeName(a), b.name || typeName(b)],
    ...newborn,
  });
  child.name = null;
  if (guaranteedHybrid) child.firstFlightGuaranteed = true;
  if (child.hybrid && typeof window.hybridRarityFor === 'function') {
    const hybridInfo = window.hybridRarityFor(child.hybrid);
    if (hybridInfo) child.hybridRarity = hybridInfo.tier.key;
  }
  return child;
}
function mergeCost(a, b) {
  return 70 + ((a.gen || 0) + (b.gen || 0)) * 25;
}
function mergeOdds(a = null, b = null) {
  const merges = state.stats.merges || 0;
  const baseShine = 0.16 + Math.min(0.08, merges * 0.004);
  return {
    twin: Math.min(38, Math.round((0.05 + merges * 0.015) * 100)),
    combo: Math.min(34, Math.round((0.04 + merges * 0.012) * 100)),
    shine: a && b ? Math.round(shineChanceForMerge(a, b) * 100) : Math.round(baseShine * 100),
  };
}
function makeSprite(opts = {}) {
  const element = opts.element || (window.wildSpeciesRoll ? window.wildSpeciesRoll() : pick(WILD_SPECIES));
  const forcedFinish = ELEMENTS[element]?.forcedVariant;
  const variant = FINISHES[forcedFinish] ? forcedFinish : FINISHES[opts.variant] ? opts.variant : null;
  const breed = opts.breed || defaultBreedFor(element);
  /* A Club Penguin puffle no longer arrives painted blue. Its colour is rolled
     when the egg is laid or the puffle is caught, so the twelve colour kits are
     something a player meets. The ten Penguin Puffle breeds keep their own
     colour, because that colour is the breed. */
  const rolledPuffleStyle = !opts.puffleVariant && breed === 'cp_puffle' && typeof cpPuffleRollStyle === 'function'
    ? cpPuffleRollStyle()
    : null;
  return {
    id: opts.id || uid('sp'),
    name: opts.name || null,
    eggLabel: opts.eggLabel || null,
    element,
    /* A species that names a puffle style wears it from birth, so every
       elemental type keeps its own painted eyes. */
    puffleVariant: opts.puffleVariant || rolledPuffleStyle || (ELEMENTS[element] && ELEMENTS[element].puffleStyle) || null,
    hybrid: opts.hybrid || null,
    hybridParents: opts.hybridParents || null,
    breed,
    palette: opts.palette || 'native',
    custom: opts.custom || null,
    head: opts.head || 'breed',
    ears: opts.ears || 'breed',
    eyes: opts.eyes || 'classic',
    pattern: opts.pattern || 'plain',
    accessory: opts.accessory || 'none',
    personality: opts.personality || pick(PERSONALITY_KEYS),
    gender: GENDERS[opts.gender] ? opts.gender : rollGender(),
    mutation: opts.mutation || null,
    variant,
    shiny: !!(opts.shiny || ELEMENTS[element]?.alwaysShiny),
    shinyRolled: !!opts.shinyRolled,
    size: SIZES[opts.size] ? opts.size : rollSize(),
    diet: opts.diet || { hearty: 0, sweet: 0, eerie: 0, wild: 0 },
    cuisine: opts.cuisine || {},
    sugar: 0,
    rarityBoost: Math.max(0, Math.min(RARITY_BOOST_MAX, Math.floor(Number(opts.rarityBoost) || 0))),
    form: EVOLUTION_FORMS[opts.form] ? opts.form : (typeof LEGACY_EVOLUTION_FORMS !== 'undefined' ? LEGACY_EVOLUTION_FORMS[opts.form] : null) || null,
    special: COMBOS.some((c) => c.id === opts.special) ? opts.special : null,
    evolvedAt: opts.evolvedAt || 0,
    stage: opts.stage || 'baby',
    level: clamp(opts.level || 1, 1, MAX_LEVEL),
    xp: 0,
    bond: opts.bond ?? 0,
    gen: opts.gen || 0,
    needs: opts.needs || { hunger: 68, energy: 72, joy: 70, clean: 78 },
    hygiene: opts.hygiene || { hair: 72, teeth: 70, breath: 74 },
    illness: null,
    hatch: opts.hatch ?? 0,
    born: opts.born || Date.now(),
    asleep: false,
    sleepUntil: 0,
    sleepStart: 0,
    sleepCycles: 0,
    lastPet: 0,
    lastChatReward: 0,
    lastBath: 0,
    lastHairBrush: 0,
    lastTeethBrush: 0,
    lastFloss: 0,
    lastMouthwash: 0,
    pendingXp: 0,
    restUntil: 0,
    lineage: opts.lineage || null,
    starter: !!opts.starter,
  };
}

/* ---------------- secrets & biome progression ---------------- */
function unlockSecretRaw(key) {
  const meta = SECRET_SPECIES_META[key];
  if (!meta || state.secretUnlocks.includes(key)) return null;
  state.secretUnlocks.push(key);
  const existing = state.sprites.find((s) => s.element === key);
  if (existing) return existing;
  const sprite = makeSprite({
    element: key,
    name: meta.name,
    stage: meta.master ? 'sensei' : 'baby',
    level: meta.master ? MAX_LEVEL : 1,
    bond: meta.master ? 100 : 55,
    gen: meta.master ? 5 : 0,
    palette: 'native',
    pattern: meta.master ? 'sparkle' : 'star',
    accessory: meta.master ? 'crown' : 'none',
    variant: meta.master ? 'galaxy' : null,
    shiny: !!meta.master,
    needs: meta.master ? { hunger: 100, energy: 100, joy: 100, clean: 100 } : { hunger: 84, energy: 84, joy: 88, clean: 92 },
    hatch: 100,
  });
  sprite.name = meta.name;
  state.sprites.push(sprite);
  if (!state.activeId) state.activeId = sprite.id;
  return sprite;
}

function unlockSecret(key) {
  const sprite = unlockSecretRaw(key);
  if (!sprite) return null;
  commit('secret', { spriteId: sprite.id, secretKey: key });
  toast(`Secret found: ${sprite.name}!`, '🔐');
  return sprite;
}

function checkProgressSecrets() {
  const found = [];
  if (state.sprites.some((s) => s.level >= MAX_LEVEL)) {
    const s = unlockSecret('summitspirit');
    if (s) found.push(s);
  }
  if (state.sprites.some((s) => s.bond >= 100)) {
    const s = unlockSecret('heartkeeper');
    if (s) found.push(s);
  }
  if ((state.stats.hatches || 0) >= 25) {
    const s = unlockSecret('shelloracle');
    if (s) found.push(s);
  }
  if (state.sprites.some((s) => s.retired)) {
    const s = unlockSecret('elderkeeper');
    if (s) found.push(s);
  }
  if (typeof guardianVaultTravels === 'function' && guardianVaultTravels() >= 100) {
    const s = unlockSecret('vaultwanderer');
    if (s) found.push(s);
  }
  if (typeof guardianVaultWins === 'function' && guardianVaultWins() >= 25) {
    const s = unlockSecret('vaultchampion');
    if (s) found.push(s);
  }
  const collected = state.sprites.filter((s) => s.stage !== 'egg');
  const ownedWithFlag = (flag) => new Set(collected
    .filter((s) => ELEMENTS[s.element]?.[flag])
    .map((s) => s.element)).size;
  Object.entries(SECRET_SPECIES_META).forEach(([key, meta]) => {
    if (!meta.collectionSecret || state.secretUnlocks.includes(key)) return;
    if (ownedWithFlag(meta.collectionSecret.flag) < meta.collectionSecret.count) return;
    const s = unlockSecret(key);
    if (s) found.push(s);
  });
  return found;
}

function recordBiomeVisit(sceneKey) {
  if (!isTypeBiomeScene(sceneKey)) return;
  if (!state.biomesVisited.includes(sceneKey)) state.biomesVisited.push(sceneKey);
  if (BIOME_SCENE_KEYS.every((key) => state.biomesVisited.includes(key))) unlockSecret('atlaskeeper');
}
function rollEgg(tierId, opts = {}) {
  const tier = EGG_TIERS[tierId] || EGG_TIERS.common;
  const mutationChance = typeof opts.mutation === 'number' ? opts.mutation : tier.mutation;
  const mutation = chance(mutationChance) ? pick(MUTATIONS) : null;
  const palette = mutation
    ? mutation.palette
    : chance(0.32)
      ? pick(['aurora', 'candy', 'matcha', 'deepsea', 'sunset', 'midnight',
        'godlight', 'nebularose', 'emberglass', 'tidefrost', 'mossveil', 'crownrose'])
      : 'native';
  const element = opts.element || (window.wildSpeciesRoll ? window.wildSpeciesRoll() : pick(WILD_SPECIES));
  const egg = makeSprite({
    element,
    eggLabel: opts.eggLabel || null,
    breed: defaultBreedFor(element),
    palette,
    pattern: pick(PATTERN_KEYS),
    accessory: chance(0.32) ? pick(FREE_ACCESSORY_KEYS) : 'none',
    personality: pick(PERSONALITY_KEYS),
    variant: rollFinish(0.16),
    size: rollSize(),
    gen: typeof opts.gen === 'number' ? opts.gen : (tier.gen || 0),
    rarityBoost: Math.max(0, Math.floor(Number(opts.rarityBoost) || 0)),
    mutation: mutation ? mutation.name : null,
    stage: 'egg',
    hatch: 0,
    needs: { hunger: 70, energy: 74, joy: 72, clean: 88 },
  });
  /* A shiny egg is decided when the shell arrives, not when it breaks. Any
     species can roll one, and the same hatch bonuses apply up front so the
     sparkle is an honest promise instead of a cosmetic preview. Summons pass
     shinyEgg:false because they arrive already hatched. */
  if (opts.shinyEgg !== false) {
    if (!egg.shiny && chance(shineChanceForHatch(egg))) egg.shiny = true;
    egg.shinyRolled = true;
  }
  return egg;
}

const TRAIL_STAGE_ORDER = STAGE_ORDER;
const TRAIL_STAGE_LABELS = STAGE_LABELS;
const TRAIL_STAGE_LEVEL = { toddler: 2, child: 3, juvenile: 5, sprite: 10, youngadult: 18, midadult: 25, highadult: 35, elder: 100, ancient: 500, sensei: 1000 };

/* Every finished trail resolves one visible reward: a type-tier rise, a stage
   evolution, or a generous coin bonus. Higher trails roll the rare outcomes more often. */
function rollTrailBonus(s, info, payout) {
  if (!s || s.stage === 'egg') return { kind: 'coins', coins: 0 };
  const tierKey = spriteRarityKey(s);
  const tierIndex = RARITY_TIER_ORDER.indexOf(tierKey);
  const stageIndex = TRAIL_STAGE_ORDER.indexOf(s.stage);
  const canTier = tierIndex >= 0 && tierIndex < RARITY_TIER_ORDER.length - 1;
  const canEvolve = stageIndex >= 0 && stageIndex < TRAIL_STAGE_ORDER.length - 1 && !s.retired;
  const find = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('find', s) : 1;
  const evolveChance = Math.min(1, Math.max(0, Number(info?.trailEvolveChance) || 0) * find);
  const tierChance = Math.min(1, Math.max(0, Number(info?.trailTierChance) || 0) * find);
  const roll = Math.random();
  if (canEvolve && roll < evolveChance) {
    const fromStage = s.stage;
    /* The trail advances one age, but never below the age the sprite's level has
       already earned: a level-40 baby that takes a trail stage-up lands on High
       Adult, instead of dropping to toddler and walking the whole ladder back. */
    const earnedStage = typeof stageForLevel === 'function' ? stageForLevel(s.level) : fromStage;
    const earnedIndex = STAGE_ORDER.indexOf(earnedStage);
    const toIndex = Math.min(TRAIL_STAGE_ORDER.length - 1, Math.max(stageIndex + 1, earnedIndex));
    const toStage = TRAIL_STAGE_ORDER[toIndex];
    s.stage = toStage;
    s.level = Math.max(s.level, TRAIL_STAGE_LEVEL[toStage] || s.level);
    if (typeof announceStageEvolution === 'function') announceStageEvolution(s, fromStage, toStage);
    return { kind: 'evolve', from: TRAIL_STAGE_LABELS[fromStage] || fromStage, to: TRAIL_STAGE_LABELS[toStage] || toStage, stage: toStage };
  }
  if (canTier && roll < evolveChance + tierChance) {
    const fromRarity = TYPE_EGG_RARITIES[tierKey];
    s.rarityBoost = Math.max(0, Math.min(RARITY_BOOST_MAX, Math.floor(Number(s.rarityBoost) || 0) + 1));
    const toKey = spriteRarityKey(s);
    const toRarity = TYPE_EGG_RARITIES[toKey];
    return { kind: 'tier', from: fromRarity?.name || tierKey, to: toRarity?.name || toKey, tier: toRarity };
  }
  const coins = Math.max(1, Math.round(Math.max(1, Number(payout) || 0) * (Number(info?.trailCoinMult) || 1.5)));
  addCoinsRaw(coins);
  return { kind: 'coins', coins };
}

/* ---------------- egg actions ---------------- */
/* Warm and hatch one egg without saving or playing feedback. The single-egg
   and batch actions below both use these so their rules cannot drift apart. */
function warmEggRaw(s, amount) {
  if (!s || s.stage !== 'egg' || s.hatch >= 100) return { ok: false, reason: 'ready' };
  const inc = typeof activeIncubator === 'function' ? activeIncubator() : null;
  /* Frozen breeds only warm under a cooling incubator; a heat source stalls
     them. Frost Chill is the stronger cooling mode, Chill Stone is the free
     one. Lava-frozen eggs count as both, so they follow the same rule. */
  if (typeof coldHatchEnabled === 'function' && coldHatchEnabled()
      && typeof COLD_HATCH_BREEDS !== 'undefined' && COLD_HATCH_BREEDS.includes(s.breed)
      && inc && !(typeof incubatorAllowsCold === 'function' ? incubatorAllowsCold(inc) : (inc.key === 'chill' || inc.key === 'frostchill'))) {
    return { ok: false, reason: 'cold' };
  }
  const boost = typeof incubatorWarmMultiplier === 'function'
    ? incubatorWarmMultiplier(s, inc)
    : (inc ? (inc.speedMult || 1) : 1);
  const gain = Math.min(75, Math.round((amount ?? randInt(7, 12)) * boost));
  s.hatch = clamp(s.hatch + gain);
  bump('warms');
  const readyNow = s.hatch >= 100 && !s.readyAnnounced;
  if (readyNow) s.readyAnnounced = true;
  return { ok: true, hatch: s.hatch, readyNow };
}

function hatchEggRaw(s) {
  if (!s || s.stage !== 'egg' || s.hatch < 100) return { ok: false, reason: 'not-ready' };
  const pendingXp = Math.max(0, Number(s.pendingXp) || 0);
  s.stage = 'baby';
  s.level = 1;
  s.xp = 0;
  s.pendingXp = 0;
  s.bond = 10;
  s.born = Date.now();
  s.needs = { hunger: 72, energy: 78, joy: 74, clean: 88 };
  if (!s.name) s.name = makeName(s.element);
  s.hatch = 100;
  const wasShiny = !!s.shiny;
  if (!wasShiny && !s.shinyRolled && chance(shineChanceForHatch(s))) {
    s.shiny = true;
    state.stats.shinies = (state.stats.shinies || 0) + 1;
  }
  if (!state.activeId) state.activeId = s.id;
  addCoinsRaw(10);
  /* Hatch XP belongs to the hatchling, not whichever sprite happened to be
     active; any task XP banked while this was the only egg also lands now. */
  addXpRaw(s, 20 + pendingXp);
  bump('hatches');
  state.stats.hatches += 1;
  /* The first thing a hatchling says, in its own role voice. */
  const firstWords = typeof window.puffleVoiceLine === 'function' ? window.puffleVoiceLine(s, 'hatch') : null;
  return { ok: true, sprite: s, newShine: !wasShiny && !!s.shiny, firstWords };
}

/* ---------------- actions ---------------- */
/* The last Send all home, kept out of the save: it is a one-tap undo, not a
   setting, and a reload should not be able to replay it. */
let lastSendHome = null;

const Actions = {
  startGame(element, breed) {
    state.started = true;
    state.seen.intro = true;
    state.coins = Math.max(STARTING_COINS, Math.floor(Number(state.coins) || 0));
    const egg = makeSprite({
      element,
      breed,
      stage: 'egg',
      hatch: 0,
      starter: true,
      palette: 'native',
      pattern: 'spots',
      accessory: 'none',
      personality: pick(['sunny', 'goofy', 'shy', 'dreamy']),
    });
    state.sprites.push(egg);
    Actions.flightBegin();
    commit('start', { spriteId: egg.id });
    return egg;
  },

  setActive(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg' || s.retired) return;
    state.activeId = id;
    commit('active', { spriteId: id });
  },

  /* Adoption is one change: the name and the active slot are written before a
     single commit, so the Hollow never saves or paints them apart. */
  adoptHatch(id, name) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg' || s.retired) return { ok: false };
    applySpriteName(s, name);
    state.activeId = id;
    commit('adopt', { spriteId: id });
    return { ok: true, sprite: s };
  },

  retire(id) {
    const s = findSprite(id);
    if (!s || s.level < STAGE_LEVEL.elder || STAGE_ORDER.indexOf(s.stage) < STAGE_ORDER.indexOf('elder')) return { ok: false, reason: 'elder' };
    if (s.element === MASTER_CHEAT_SPECIES) {
      toast('The Master Cheat cannot retire — it is already at the end of the road.', '🕹️');
      return { ok: false, reason: 'master' };
    }
    s.retired = true;
    unlockSecret('elderkeeper');
    s.retiredAt = Date.now();
    s.asleep = false;
    s.sleepUntil = 0;
    s.sleepStart = 0;
    s.sleepCycles = 0;
    if (state.activeId === s.id) {
      state.activeId = state.sprites.find((x) => x.id !== s.id && x.stage !== 'egg' && !x.retired)?.id || null;
    }
    commit('retire', { spriteId: s.id });
    return { ok: true };
  },

  unretire(id) {
    const s = findSprite(id);
    if (!s || !s.retired) return { ok: false };
    s.retired = false;
    s.retiredAt = 0;
    commit('unretire', { spriteId: s.id });
    return { ok: true };
  },

  reincarnate(id, foodId = 'rebirthmeal') {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.level < MAX_LEVEL) {
      toast(`${displayName(s)} must reach MAX level before a Rebirth Meal can begin a new life.`, '🌱');
      return { ok: false, reason: 'level' };
    }
    if (foodCount(foodId) < 1) {
      toast('You need a Rebirth Meal in the pantry. Stock one from the market.', '🌱');
      return { ok: false, reason: 'empty' };
    }
    addFoodRaw(foodId, -1);
    const cycle = (s.rebirths || 0) + 1;
    const carriedBond = Math.max(20, Math.round((s.bond || 0) * 0.5));
    s.rebirths = cycle;
    s.stage = 'egg';
    s.level = 1;
    s.xp = 0;
    s.hatch = 0;
    s.eggLabel = `Rebirth ${cycle} Egg`;
    s.retired = false;
    s.retiredAt = 0;
    s.asleep = false;
    s.sleepUntil = 0;
    s.sleepStart = 0;
    s.sleepCycles = 0;
    s.bond = carriedBond;
    s.needs = { hunger: 78, energy: 82, joy: 86, clean: 95 };
    s.hygiene = { hair: 88, teeth: 84, breath: 90 };
    s.form = null;
    s.special = null;
    s.evolvedAt = 0;
    s.diet = { hearty: 0, sweet: 0, eerie: 0, wild: 0 };
    s.sugar = 0;
    s.restUntil = 0;
    s.born = Date.now();
    const coins = 500 + cycle * 150;
    const pool = FOOD_KEYS.filter((key) => !FOODS[key].rebirth && !FOODS[key].monthly && !FOODS[key].giftOnly);
    const foodKey = pick(pool);
    const snackKey = pick(SNACK_KEYS);
    addCoinsRaw(coins);
    addFoodRaw(foodKey, 2);
    addSnackRaw(snackKey, 2);
    state.stats.rebirths = (state.stats.rebirths || 0) + 1;
    unlockSecret('rebirthkeeper');
    Sfx.win();
    toast(`${displayName(s)} reincarnated into a Rebirth ${cycle} Egg · +${coins} coins, ${FOODS[foodKey].name} ×2, ${SNACKS[snackKey].name} ×2`, '🌱');
    commit('rebirth', { spriteId: s.id, rebirths: cycle, coins });
    return { ok: true, sprite: s, rebirths: cycle, coins, foodKey, snackKey };
  },

  pet(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
      Sfx.pop();
      toast(`${displayName(s)} woke up.`, '👀');
      commit('wake', { spriteId: id });
      return { ok: true, woke: true, coins: 0 };
    }
    const now = Date.now();
    const cooled = now - (s.lastPet || 0) < 3200;
    if (cooled) {
      commit('pet-warm', { spriteId: id });
      return { ok: true, coins: 0, cooled: true };
    }
    s.lastPet = now;
    const fx = spriteEffects(s);
    s.needs.joy = clamp(s.needs.joy + 3.5);
    addBondRaw(s, 2 * (fx.petBond || 1));
    bump('pets');
    state.stats.pets += 1;
    const coins = 1 + (fx.petCoins || 0);
    addCoinsRaw(coins);
    addXpRaw(s, 1);
    Sfx.purr();
    commit('pet', { spriteId: id, coins });
    return { ok: true, coins, cooled: false };
  },

  feed(id, foodId) {
    const s = findSprite(id);
    const food = FOODS[foodId];
    if (!s || s.stage === 'egg' || !food) return { ok: false, reason: 'missing' };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    if (state.coins < food.price) {
      toast('Not enough coins — try an activity!', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    if (s.needs.hunger >= 97 && food.hunger > 0) {
      toast(`${displayName(s)} is too full for that.`, '😅');
      return { ok: false, reason: 'full' };
    }
    addCoinsRaw(-food.price);
    s.needs.hunger = clamp(s.needs.hunger + (food.hunger || 0));
    s.needs.energy = clamp(s.needs.energy + (food.energy || 0));
    s.needs.joy = clamp(s.needs.joy + (food.joy || 0));
    s.needs.clean = clamp(s.needs.clean + (food.clean || 0));
    if (food.bond) addBondRaw(s, food.bond);
    addBondRaw(s, 1.2);
    addXpRaw(s, food.xp || 4);
    const loved = isFavoriteFood(s, foodId);
    const diet = dietGainRaw(s, foodId, loved ? 1 : 0);
    const cuisine = cuisineGainRaw(s, foodId, loved ? 1 : 0);
    const candy = candyMorphRaw(s, foodId);
    bump('feeds');
    state.stats.feeds += 1;
    Sfx.eat();
    if (food.clean && food.clean < 0) toast('A little messy, but worth it.', '🍲');
    if (loved) {
      s.needs.joy = clamp(s.needs.joy + 8);
      addBondRaw(s, 3);
      addXpRaw(s, 6);
      toast(`${displayName(s)} loves ${food.name}!`, '💛');
    }
    announceEvolutionReady(s, diet, cuisine);
    const illness = catchFoodSickness(s, food);
    commit('feed', { spriteId: id, foodId });
    return { ok: true, food, diet, cuisine, candy, loved, illness };
  },

  buyFoodStock(foodId) {
    const food = FOODS[foodId];
    if (!food) return { ok: false, reason: 'missing' };
    if (food.giftOnly) return { ok: false, reason: 'gift-only' };
    if (typeof cafeFoodLocked === 'function' && cafeFoodLocked(foodId)) {
      return { ok: false, reason: 'recipe', recipe: typeof cafeRecipeForFood === 'function' ? cafeRecipeForFood(foodId) : null };
    }
    if (state.coins < food.price) {
      toast('Not enough coins for that.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    addCoinsRaw(-food.price);
    addFoodRaw(foodId, 1);
    commit('stockFood', { foodId });
    return { ok: true, food };
  },

  feedStock(id, foodId) {
    const s = findSprite(id);
    const food = FOODS[foodId];
    if (!s || s.stage === 'egg' || !food) return { ok: false, reason: 'missing' };
    if (foodCount(foodId) < 1) return { ok: false, reason: 'empty' };
    if (food.rebirth) return this.reincarnate(id, foodId);
    if (food.stageBoost && s.level >= MAX_LEVEL) {
      toast(`${displayName(s)} is already at MAX level. Save the feast for someone else.`, '🌟');
      return { ok: false, reason: 'max' };
    }
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    if (!food.stageBoost && s.needs.hunger >= 97 && food.hunger > 0) {
      toast(`${displayName(s)} is too full for that.`, '😅');
      return { ok: false, reason: 'full' };
    }
    const fx = spriteEffects(s);
    addFoodRaw(foodId, -1);
    s.needs.hunger = clamp(s.needs.hunger + (food.hunger || 0));
    s.needs.energy = clamp(s.needs.energy + (food.energy || 0));
    s.needs.joy = clamp(s.needs.joy + (food.joy || 0));
    s.needs.clean = clamp(s.needs.clean + (food.clean || 0));
    if (food.bond) addBondRaw(s, food.bond);
    addBondRaw(s, 1.2);
    addXpRaw(s, (food.xp || 4) * (fx.xp || 1));
    const stageBoost = food.stageBoost ? stageFeastRaw(s) : null;
    const loved = isFavoriteFood(s, foodId);
    const diet = dietGainRaw(s, foodId, loved ? 1 : 0);
    const cuisine = cuisineGainRaw(s, foodId, loved ? 1 : 0);
    const candy = candyMorphRaw(s, foodId);
    bump('feeds');
    state.stats.feeds += 1;
    Sfx.eat();
    if (loved) {
      s.needs.joy = clamp(s.needs.joy + 8);
      addBondRaw(s, 3);
      addXpRaw(s, 6);
      toast(`${displayName(s)} loves ${food.name}!`, '💛');
    }
    announceEvolutionReady(s, diet, cuisine);
    const illness = catchFoodSickness(s, food);
    commit('feedStock', { spriteId: id, foodId });
    return { ok: true, food, diet, cuisine, candy, stageBoost, loved, illness };
  },

  /* Stock the whole Hollow in one go: every favourite dish the pantry is out
     of, hungriest puffle first, bought only while the wallet allows. Secret
     species are not puffles, so their dish is not part of the list. */
  stockFavourites() {
    const hungerOf = (row) => Number(row.needs?.hunger) || 0;
    const byFood = new Map();
    state.sprites
      .filter((s) => s.stage !== 'egg' && !s.retired
        && !(typeof SECRET_SPECIES_META !== 'undefined' && SECRET_SPECIES_META[s.element]))
      .forEach((s) => {
        const food = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s)?.food : null;
        if (!food) return;
        const entry = byFood.get(food.id) || { id: food.id, hunger: hungerOf(s) };
        entry.hunger = Math.min(entry.hunger, hungerOf(s));
        byFood.set(food.id, entry);
      });
    const wanted = [...byFood.values()]
      .filter((entry) => foodCount(entry.id) === 0)
      .sort((a, b) => a.hunger - b.hunger);
    const bought = [];
    let spent = 0;
    wanted.forEach((entry) => {
      const food = FOODS[entry.id];
      if (!food || state.coins < food.price) return;
      const res = this.buyFoodStock(entry.id);
      if (!res.ok) return;
      bought.push(entry.id);
      spent += food.price;
    });
    return { ok: bought.length > 0, bought, spent, missed: wanted.length - bought.length };
  },

  /* The market's favourites rows are one tap: stock the dish if the pantry has
     none, then put it in front of the puffle who loves it. Nothing is bought
     for a guest who cannot eat, and a stocked dish never charges twice. */
  feedFavourite(id, foodId) {
    const s = findSprite(id);
    const food = FOODS[foodId];
    if (!s || s.stage === 'egg' || s.retired || !food) return { ok: false, reason: 'missing' };
    if (!food.stageBoost && s.needs.hunger >= 97 && (food.hunger || 0) > 0) {
      toast(`${displayName(s)} is too full for that.`, '😅');
      return { ok: false, reason: 'full' };
    }
    const stocked = foodCount(foodId) > 0;
    if (!stocked) {
      const bought = this.buyFoodStock(foodId);
      if (!bought.ok) return bought;
    }
    const fed = this.feedStock(id, foodId);
    if (!fed.ok) return fed;
    return { ...fed, bought: !stocked, sprite: s };
  },

  feedSnack(id, snackId) {
    const s = findSprite(id);
    const snack = SNACKS[snackId];
    if (!s || s.stage === 'egg' || !snack) return { ok: false, reason: 'missing' };
    if (snackCount(snackId) < 1) return { ok: false, reason: 'empty' };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    if (s.needs.hunger >= 97 && snack.hunger > 0) {
      toast(`${displayName(s)} is too full for that.`, '😅');
      return { ok: false, reason: 'full' };
    }
    const fx = spriteEffects(s);
    addSnackRaw(snackId, -1);
    s.needs.hunger = clamp(s.needs.hunger + (snack.hunger || 0));
    s.needs.energy = clamp(s.needs.energy + (snack.energy || 0));
    s.needs.joy = clamp(s.needs.joy + (snack.joy || 0));
    s.needs.clean = clamp(s.needs.clean + (snack.clean || 0));
    if (snack.bond) addBondRaw(s, snack.bond);
    addBondRaw(s, 1.2);
    addXpRaw(s, (snack.xp || 6) * (fx.snackXp || 1));
    const loved = isFavoriteFood(s, snackId);
    const diet = dietGainRaw(s, snackId, loved ? 1 : 0);
    const cuisine = cuisineGainRaw(s, snackId, loved ? 1 : 0);
    const candy = candyMorphRaw(s, snackId);
    bump('feeds');
    state.stats.feeds += 1;
    Sfx.eat();
    if (loved) {
      s.needs.joy = clamp(s.needs.joy + 8);
      addBondRaw(s, 3);
      addXpRaw(s, 6);
      toast(`${displayName(s)} loves ${snack.name}!`, '💛');
    }
    announceEvolutionReady(s, diet, cuisine);
    const illness = catchFoodSickness(s, snack);
    commit('feedSnack', { spriteId: id, snackId });
    return { ok: true, snack, diet, cuisine, candy, loved, illness };
  },

  bathe(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false };
    const now = Date.now();
    const cooldown = Math.max(0, BATH_COOLDOWN_MS - (now - (Number(s.lastBath) || 0)));
    if (cooldown > 0) return { ok: true, cooled: true, cooldown, coins: 0, xp: 0 };
    s.lastBath = now;
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    s.needs.clean = clamp(s.needs.clean + 36);
    s.needs.joy = clamp(s.needs.joy + 5);
    addBondRaw(s, 2.5);
    addXpRaw(s, BATH_XP);
    addCoinsRaw(BATH_COINS);
    bump('baths');
    state.stats.baths += 1;
    Sfx.bath();
    commit('bath', { spriteId: id });
    return { ok: true, cooled: false, coins: BATH_COINS, xp: BATH_XP };
  },

  brushHair(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    const now = Date.now();
    const cooldown = Math.max(0, 16000 - (now - (Number(s.lastHairBrush) || 0)));
    if (cooldown > 0) return { ok: true, cooled: true, cooldown };
    s.lastHairBrush = now;
    const hyg = hygieneOf(s);
    hyg.hair = clamp(hyg.hair + 44);
    s.needs.clean = clamp(s.needs.clean + 8);
    s.needs.joy = clamp(s.needs.joy + 8);
    addBondRaw(s, 2);
    addXpRaw(s, 6);
    addCoinsRaw(4);
    state.stats.hairBrushes = (Number(state.stats.hairBrushes) || 0) + 1;
    bump('grooms');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.pop();
    commit('brushHair', { spriteId: id, careGift: !!careGift });
    return { ok: true, coins: 4, xp: 6, bond: 2, hygiene: { ...hyg }, careGift };
  },

  brushTeeth(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    const now = Date.now();
    const cooldown = Math.max(0, 16000 - (now - (Number(s.lastTeethBrush) || 0)));
    if (cooldown > 0) return { ok: true, cooled: true, cooldown };
    s.lastTeethBrush = now;
    const hyg = hygieneOf(s);
    hyg.teeth = clamp(hyg.teeth + 46);
    hyg.breath = clamp(hyg.breath + 18);
    s.needs.clean = clamp(s.needs.clean + 7);
    s.needs.joy = clamp(s.needs.joy + 6);
    addBondRaw(s, 2);
    addXpRaw(s, 6);
    addCoinsRaw(4);
    state.stats.teethBrushes = (Number(state.stats.teethBrushes) || 0) + 1;
    bump('grooms');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.pop();
    commit('brushTeeth', { spriteId: id, careGift: !!careGift });
    return { ok: true, coins: 4, xp: 6, bond: 2, hygiene: { ...hyg }, careGift };
  },

  flossTeeth(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    const now = Date.now();
    const cooldown = Math.max(0, 24000 - (now - (Number(s.lastFloss) || 0)));
    if (cooldown > 0) return { ok: true, cooled: true, cooldown };
    s.lastFloss = now;
    const hyg = hygieneOf(s);
    hyg.teeth = clamp(hyg.teeth + 20);
    hyg.breath = clamp(hyg.breath + 6);
    s.needs.clean = clamp(s.needs.clean + 6);
    s.needs.joy = clamp(s.needs.joy + 3);
    addBondRaw(s, 1.5);
    addXpRaw(s, 5);
    addCoinsRaw(3);
    state.stats.teethBrushes = (Number(state.stats.teethBrushes) || 0) + 1;
    bump('grooms');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.pop();
    commit('floss', { spriteId: id, careGift: !!careGift });
    return { ok: true, coins: 3, xp: 5, bond: 1.5, hygiene: { ...hyg }, careGift };
  },

  mouthwash(id, flavorKey = 'mint') {
    const s = findSprite(id);
    const flavor = typeof HOTEL_FLAVORS !== 'undefined' ? HOTEL_FLAVORS[flavorKey] : null;
    if (!s || s.stage === 'egg' || !flavor) return { ok: false, reason: 'missing' };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    const now = Date.now();
    const cooldown = Math.max(0, 30000 - (now - (Number(s.lastMouthwash) || 0)));
    if (cooldown > 0) return { ok: true, cooled: true, cooldown };
    s.lastMouthwash = now;
    const hyg = hygieneOf(s);
    hyg.breath = clamp(hyg.breath + 42 + (flavor.clean || 0));
    hyg.teeth = clamp(hyg.teeth + 12);
    s.needs.clean = clamp(s.needs.clean + 5 + (flavor.clean || 0));
    s.needs.joy = clamp(s.needs.joy + 6 + (flavor.joy || 0));
    s.needs.energy = clamp(s.needs.energy + (flavor.energy || 0));
    addBondRaw(s, 1.5 + (flavor.bond || 0));
    addXpRaw(s, 5);
    addCoinsRaw(3);
    state.stats.mouthwashes = (Number(state.stats.mouthwashes) || 0) + 1;
    bump('grooms');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.bath();
    commit('mouthwash', { spriteId: id, flavor: flavorKey, careGift: !!careGift });
    return { ok: true, coins: 3, xp: 5, flavor, hygiene: { ...hyg }, careGift };
  },

  hotelCare(id, serviceKey) {
    const s = findSprite(id);
    const service = typeof HOTEL_SERVICES !== 'undefined' ? HOTEL_SERVICES[serviceKey] : null;
    if (!s || s.stage === 'egg' || !service) return { ok: false, reason: 'missing' };
    if (state.coins < service.price) return { ok: false, reason: 'coins', need: service.price - state.coins };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    addCoinsRaw(-service.price);
    const hyg = hygieneOf(s);
    const fx = service.effects || {};
    if (fx.clean) s.needs.clean = clamp(s.needs.clean + fx.clean);
    if (fx.joy) s.needs.joy = clamp(s.needs.joy + fx.joy);
    if (fx.energy) s.needs.energy = clamp(s.needs.energy + fx.energy);
    if (fx.hair) hyg.hair = clamp(hyg.hair + fx.hair);
    if (fx.teeth) hyg.teeth = clamp(hyg.teeth + fx.teeth);
    if (fx.breath) hyg.breath = clamp(hyg.breath + fx.breath);
    if (fx.bond) addBondRaw(s, fx.bond);
    if (fx.xp) addXpRaw(s, fx.xp);
    state.stats.grooms = (Number(state.stats.grooms) || 0) + 1;
    bump('grooms');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.win();
    commit('hotelCare', { spriteId: id, service: serviceKey, careGift: !!careGift });
    return { ok: true, service, coins: service.price, hygiene: { ...hyg }, careGift };
  },

  /* Room service takes anything the kitchen can send up, not only the hotel's
     own menu. A stocked dish costs the tray fee; an unstocked one is bought in
     at shelf price first, and a refused feed refunds both. */
  orderHotelFood(id, foodKey) {
    const s = findSprite(id);
    const entry = typeof hotelMenuEntry === 'function' ? hotelMenuEntry(foodKey) : null;
    if (!s || s.stage === 'egg' || !entry) return { ok: false, reason: 'missing' };
    const price = hotelServePrice(foodKey);
    if (!Number.isFinite(price) || price <= 0) return { ok: false, reason: 'missing' };
    const item = entry.item;
    if (state.coins < price) return { ok: false, reason: 'coins', need: price - state.coins };
    if (item.hunger > 0 && s.needs.hunger >= 97) return { ok: false, reason: 'full' };
    if (s.asleep) { s.asleep = false; s.sleepUntil = 0; }
    const stocked = entry.kind === 'snack' ? snackCount(foodKey) > 0 : foodCount(foodKey) > 0;
    addCoinsRaw(-price);
    if (!stocked) {
      if (entry.kind === 'snack') addSnackRaw(foodKey, 1);
      else addFoodRaw(foodKey, 1);
    }
    const fed = entry.kind === 'snack' ? this.feedSnack(id, foodKey) : this.feedStock(id, foodKey);
    if (!fed?.ok) {
      addCoinsRaw(price);
      if (!stocked) {
        if (entry.kind === 'snack') addSnackRaw(foodKey, -1);
        else addFoodRaw(foodKey, -1);
      }
      return { ok: false, reason: fed?.reason || 'feed', refund: price };
    }
    const careGift = grantHotelCareBonusRaw(s);
    commit('hotelOrder', { spriteId: id, foodKey, kind: entry.kind, course: entry.course, price, careGift: !!careGift });
    return { ok: true, food: item, entry, entryKey: foodKey, price, fromPantry: stocked, fed, careGift };
  },

  checkInHotel(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg' || s.retired) return { ok: false, reason: 'missing' };
    if (isHotelGuest(s)) return { ok: false, reason: 'staying' };
    const room = hotelFreeRoom();
    if (!room) return { ok: false, reason: 'full' };
    if (state.coins < HOTEL_STAY_COINS) return { ok: false, reason: 'coins', need: HOTEL_STAY_COINS - state.coins };
    addCoinsRaw(-HOTEL_STAY_COINS);
    s.asleep = false;
    s.sleepUntil = 0;
    s.needs.hunger = 100;
    s.needs.energy = 100;
    s.needs.joy = 100;
    s.needs.clean = 100;
    const hyg = hygieneOf(s);
    hyg.hair = 100;
    hyg.teeth = 100;
    hyg.breath = 100;
    addBondRaw(s, 4);
    addXpRaw(s, 12);
    hotelGuests().push({ id: s.id, since: Date.now(), room });
    state.hotel.lastStay = new Date().toISOString();
    const meal = grantHotelCareItemRaw('meal');
    state.stats.hotelStays = (Number(state.stats.hotelStays) || 0) + 1;
    commit('hotelCheckIn', { spriteId: id, room, meal });
    toast(`🏨 ${displayName(s)} checks into room ${String(room).padStart(2, '0')} until dawn. Every need seen to.`, '🏨');
    return { ok: true, room, meal, coins: HOTEL_STAY_COINS };
  },

  checkOutHotel(id) {
    const s = findSprite(id);
    if (!s) return { ok: false, reason: 'missing' };
    const entry = hotelGuests().find((row) => row.id === id);
    if (!entry) return { ok: false, reason: 'not-staying' };
    /* A stay never moves the guest: check-in leaves atHome alone, so check-out
       must too. Restoring the value captured at check-in would undo a home move
       the keeper made while the room was theirs. */
    return finishHotelStay(entry);
  },

  /* The hotel service mini-game pays the run in coins, XP and bond, and the
     dishes actually carried to the tables come home as pantry stock. */
  finishHotelService({ score = 0, served = 0, perfect = 0, dishes = [] } = {}) {
    const s = activeSprite();
    if (!s || s.stage === 'egg') return { ok: false, reason: 'sprite' };
    const points = Math.max(0, Math.floor(Number(score) || 0));
    const plates = Math.max(0, Math.floor(Number(served) || 0));
    const keys = [...new Set(Array.isArray(dishes) ? dishes : [])]
      .filter((key) => (typeof FOODS !== 'undefined' && FOODS[key]) || (typeof SNACKS !== 'undefined' && SNACKS[key]))
      .slice(0, 4);
    const coins = Math.min(200, 24 + points * 3 + plates * 2);
    const xp = 22 + Math.min(96, points * 3);
    const bond = 5 + Math.min(8, Math.floor(plates / 2));
    keys.forEach((key) => {
      if (FOODS[key]) addFoodRaw(key, 1);
      else addSnackRaw(key, 1);
    });
    addCoinsRaw(coins);
    addXpRaw(s, xp);
    addBondRaw(s, bond);
    state.stats.games = (Number(state.stats.games) || 0) + 1;
    state.stats.hotelPlatesServed = (Number(state.stats.hotelPlatesServed) || 0) + plates;
    bump('games');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.win();
    commit('hotelServiceGame', { spriteId: s.id, score: points, plates, foodKeys: keys, careGift: !!careGift });
    return { ok: true, coins, xp, bond, foodKeys: keys, plates, careGift };
  },

  finishGroomGame({ score = 0, hair = 0, teeth = 0, perfect = 0 } = {}) {
    const s = activeSprite();
    if (!s || s.stage === 'egg') return { ok: false, reason: 'sprite' };
    const points = Math.max(0, Math.floor(Number(score) || 0));
    const coins = Math.min(180, 22 + points * 3);
    const xp = 18 + Math.min(80, points * 2);
    const bond = 6 + Math.min(6, Math.floor(Number(perfect) || 0));
    const hyg = hygieneOf(s);
    hyg.hair = clamp(hyg.hair + 18 + Math.min(24, Number(hair) || 0) * 3);
    hyg.teeth = clamp(hyg.teeth + 18 + Math.min(24, Number(teeth) || 0) * 3);
    hyg.breath = clamp(hyg.breath + 20);
    s.needs.clean = clamp(s.needs.clean + 10);
    s.needs.joy = clamp(s.needs.joy + 16);
    addCoinsRaw(coins);
    addXpRaw(s, xp);
    addBondRaw(s, bond);
    state.stats.grooms = (Number(state.stats.grooms) || 0) + 1;
    bump('grooms');
    const foodKey = grantHotelCareItemRaw('any');
    const careGift = grantHotelCareBonusRaw(s);
    Sfx.win();
    commit('groomGame', { spriteId: s.id, score: points, foodKey, careGift: !!careGift });
    return { ok: true, coins, xp, bond, foodKey, careGift, hygiene: { ...hyg } };
  },

  nap(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false };
    if (s.asleep) return { ok: false, reason: 'asleep' };
    const start = Date.now();
    s.asleep = true;
    s.sleepStart = start;
    s.sleepCycles = 1;
    s.sleepUntil = start + NAP_MS;
    addBondRaw(s, 2);
    addXpRaw(s, 4);
    bump('naps');
    state.stats.naps += 1;
    Sfx.sleep();
    toast('Shhh… nap time for 30 seconds.', '😴');
    commit('nap', { spriteId: id });
    grantFurUnlocks();
    return { ok: true };
  },

  rubBelly(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    const now = Date.now();
    if (now - (s.lastRub || 0) < 5000) return { ok: true, cooled: true, coins: 0 };
    s.lastRub = now;
    const fx = spriteEffects(s);
    s.needs.joy = clamp(s.needs.joy + 10);
    addBondRaw(s, 6 * (fx.petBond || 1));
    addXpRaw(s, 6);
    const coins = 2 + (fx.petCoins || 0);
    addCoinsRaw(coins);
    bump('rubs');
    state.stats.rubs = (state.stats.rubs || 0) + 1;
    Sfx.purr();
    commit('rub', { spriteId: id, coins });
    grantFurUnlocks();
    return { ok: true, coins };
  },

  playCatch(id, mode = 'throw', catches = 5, opts = {}) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    const n = clamp(Math.round(Number(catches) || 5), 1, 8);
    const fx = spriteEffects(s);
    /* Fetch throws the puffle's own toy. A caller can pass a different one (a
       plain ball), and only the puffle's favourite pays the extra Joy and bond. */
    const ownToy = typeof puffleFetchToy === 'function' ? puffleFetchToy(s) : { name: 'Ball', icon: '🎾' };
    const toy = opts.toy && typeof opts.toy === 'object' ? opts.toy : ownToy;
    const favouriteToy = !!toy && toy.name === ownToy.name;
    const coins = 8 + n * 4 + (fx.gameCoins || 0);
    const xp = 7 + n * 3;
    const joy = 14 + (favouriteToy ? 6 : 0);
    s.needs.joy = clamp(s.needs.joy + joy);
    s.needs.energy = clamp(s.needs.energy - 4);
    s.needs.hunger = clamp(s.needs.hunger - 2);
    addBondRaw(s, 3 + n * (fx.petBond || 1) + (favouriteToy ? 2 : 0));
    addXpRaw(s, xp);
    addCoinsRaw(coins);
    bump('games');
    state.stats.games = (Number(state.stats.games) || 0) + 1;
    if (mode === 'catch') state.stats.catches = (Number(state.stats.catches) || 0) + 1;
    else state.stats.throws = (Number(state.stats.throws) || 0) + 1;
    const careGift = grantCarePackageRaw(s);
    Sfx.win();
    commit('fetch', { spriteId: id, mode, catches: n, coins, joy, toy: toy.name, favouriteToy, careGift: !!careGift });
    return { ok: true, coins, xp, joy, catches: n, toy: { name: toy.name, icon: toy.icon }, favouriteToy, careGift };
  },

  /* A puffle's favourite toy and game are hashed comforts, so they used to be
     labels on the sheet and nothing more. Using one is a small piece of care:
     it pays extra Joy and bond for that puffle, and a favourite game also pays
     a few coins and XP. One use a minute per puffle and kind, so the sheet
     button is a top-up rather than a coin press. */
  playFavourite(id, kind = 'toy') {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false, reason: 'missing' };
    const isGame = kind === 'game';
    const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
    const item = comforts && (isGame ? comforts.game : comforts.toy);
    if (!item) return { ok: false, reason: 'comforts' };
    if (s.asleep) {
      s.asleep = false;
      s.sleepUntil = 0;
    }
    const stampKey = isGame ? 'lastFavGame' : 'lastFavToy';
    const wait = 60000 - (Date.now() - (Number(s[stampKey]) || 0));
    if (wait > 0) return { ok: false, reason: 'cooldown', wait, item };
    s[stampKey] = Date.now();
    const fx = spriteEffects(s);
    const joy = isGame ? 10 : 8;
    const xp = isGame ? 6 : 3;
    const bond = (isGame ? 4 : 3) * (fx.petBond || 1);
    s.needs.joy = clamp(s.needs.joy + joy);
    addBondRaw(s, bond);
    let coins = 0;
    if (isGame) {
      coins = 2 + (fx.gameCoins || 0);
      addCoinsRaw(coins);
      state.stats.games = (Number(state.stats.games) || 0) + 1;
    }
    addXpRaw(s, xp);
    Sfx.pop();
    commit('favourite-play', { spriteId: id, kind, item: item.name, joy, coins });
    return { ok: true, kind, item, joy, bond: Math.round(bond), coins, xp };
  },

  tuckIn(id, opts = {}) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false };
    if (s.asleep) return { ok: false, reason: 'asleep' };
    const start = Date.now();
    const bedtime = isBedtime();
    s.asleep = true;
    s.sleepStart = start;
    s.sleepCycles = SLEEP_CYCLES;
    s.sleepUntil = start + SLEEP_CYCLE_MS * SLEEP_CYCLES;
    s.needs.joy = clamp(s.needs.joy + 5);
    addBondRaw(s, bedtime ? 5 : 2.5);
    addXpRaw(s, bedtime ? 8 : 4);
    bump('naps');
    state.stats.naps += 1;
    state.stats.tucks = (state.stats.tucks || 0) + 1;
    if (!opts.silent) {
      Sfx.sleep();
      toast(`${displayName(s)} is tucked in${bedtime ? ' for the night' : ''}. ${SLEEP_CYCLES} sleep cycles.`, '🛏️');
    }
    commit('tuck', { spriteId: id });
    return { ok: true, bedtime };
  },

  tuckAllNight() {
    const list = grownSprites().filter((s) => !s.asleep);
    if (!list.length) return { ok: false, reason: 'allAsleep' };
    list.forEach((s) => this.tuckIn(s.id, { silent: true }));
    Sfx.sleep();
    toast(`${list.length === 1 ? displayName(list[0]) + ' is' : list.length + ' sprites are'} tucked in. Goodnight.`, '🌙');
    commit('tuckAll');
    return { ok: true, count: list.length };
  },

  wake(id) {
    const s = findSprite(id);
    if (!s || !s.asleep) return { ok: false };
    const info = sleepInfo(s);
    const res = finishSleep(s);
    commit('wake', { spriteId: id });
    return { ok: true, cycles: res.cycles, dream: res.dream, cyclesBeforeWake: info?.cycle || 1 };
  },

  chat(id, text) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { coins: 0 };
    addBondRaw(s, 0.9);
    addXpRaw(s, 3);
    bump('chats');
    state.stats.chats += 1;
    let coins = 0;
    if (Date.now() - (s.lastChatReward || 0) > 25000) {
      s.lastChatReward = Date.now();
      coins = 2 + (spriteEffects(s).chatCoins || 0);
      addCoinsRaw(coins);
    }
    commit('chat', { spriteId: id });
    return { coins };
  },

  finishGame({ game = 'catch', score = 0, coins = 0, xp = 0, joy = 12, foodKeys = [], distinctFoods = false } = {}) {
    const s = activeSprite();
    const reward = gameCoinPayout(coins);
    /* The biweekly challenge event only touches the challenge's own game. */
    const biweekly = typeof WeeklyChallenge !== 'undefined' ? WeeklyChallenge.eventFor(Date.now()) : null;
    const liveEvent = biweekly && biweekly.game === game ? biweekly : null;
    /* The live fortnight is the one boost applied after the cap, and only for
       the challenge's own game; the reward copy and the result preview say so. */
    const payout = Math.round(reward.payout * (liveEvent ? liveEvent.coinBoost : 1));
    const boostedXp = Math.round(Math.max(120, (Number(xp) || 25) * 4) * (liveEvent ? liveEvent.xpBoost : 1));
    /* The puffle's favourite game is a comfort, and each comfort game names the
       minigame it shows up in. Finishing that one is worth a little extra Joy
       and bond for that puffle; the sheet action stays the bigger use. */
    const favourites = s && typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
    const favouriteGame = !!(favourites && favourites.game && favourites.game.game === game);
    if (s) {
      s.needs.joy = clamp(s.needs.joy + joy + 8 + (favouriteGame ? 4 : 0));
      s.needs.energy = clamp(s.needs.energy - 2);
      addBondRaw(s, 10 + (liveEvent ? liveEvent.bondBonus : 0) + (favouriteGame ? 2 : 0));
      awardXpWithPartner(s, boostedXp);
    }
    addCoinsRaw(payout);
    state.stats.games += 1;
    /* One record per game, so the shell can show a best while you play and the
       result card can name a new one. */
    const scoreRecord = typeof GameScores !== 'undefined'
      ? GameScores.record(state, game, score)
      : { best: Math.max(0, Math.floor(Number(score) || 0)), previous: 0, isBest: false, plays: 1, last: 0 };
    /* The weekly challenge only listens to its own game, and only raises its
       best inside the current week. */
    /* A new record pays once, capped, so the number is worth chasing without
       making practice runs a coin printer. */
    const bestBonus = scoreRecord.isBest && typeof GameScores !== 'undefined'
      ? GameScores.bonus(scoreRecord.last) : 0;
    if (bestBonus) addCoinsRaw(bestBonus);
    if (typeof WeeklyChallenge !== 'undefined') {
      const weekly = WeeklyChallenge.progressFromSave(state);
      if (weekly.game === game) {
        const earned = WeeklyChallenge.recordFor(state.challenge, score);
        if (earned.best > weekly.best) state.challenge = earned;
      }
    }
    const careGift = grantCarePackageRaw(s);

    const pantryFoods = [];
    const availableFoods = typeof unlockedFoodKeys === 'function' ? unlockedFoodKeys() : (typeof FOOD_KEYS !== 'undefined' ? FOOD_KEYS : []);
    if (availableFoods.length) {
      const foodCount = 2 + (chance(0.5) ? 1 : 0);
      const foodPool = distinctFoods ? availableFoods.slice() : null;
      for (let i = 0; i < foodCount; i++) {
        /* Card Duel asks for a distinct set so two picks cannot land on the
           same pantry food. Other games keep their existing random payout. */
        const fk = distinctFoods
          ? (foodPool.length ? foodPool.splice(Math.floor(Math.random() * foodPool.length), 1)[0] : null)
          : pick(availableFoods);
        if (fk) {
          addFoodRaw(fk, 1);
          pantryFoods.push(fk);
        }
      }
    }

    /* A recipe game can name the exact foods it made. Keep them unique and
       only accept keys that still exist, so an old save cannot add junk. */
    const recipeFoods = [];
    if (Array.isArray(foodKeys) && typeof FOODS !== 'undefined') {
      for (const key of [...new Set(foodKeys)]) {
        if (FOODS[key]) {
          addFoodRaw(key, 1);
          pantryFoods.push(key);
          recipeFoods.push(key);
        }
      }
    }

    const snacks = [];
    if (typeof SNACK_KEYS !== 'undefined' && SNACK_KEYS.length) {
      const s1 = pick(SNACK_KEYS);
      const s2 = pick(SNACK_KEYS);
      addSnackRaw(s1, 1);
      addSnackRaw(s2, 1);
      snacks.push(s1, s2);
    }

    const feastKey = typeof STARPATH_FOOD_ID !== 'undefined' ? STARPATH_FOOD_ID : 'starpath';
    addFoodRaw(feastKey, 1);

    let arcade = null;
    if (arcadeGameKind(game)) {
      const a = ensureArcadePeriods();
      a.coins += payout;
      a.monthCoins += payout;
      state.stats.arcadeCoins = (state.stats.arcadeCoins || 0) + payout;
      arcade = { coins: payout, lifetime: a.coins, monthCoins: a.monthCoins, nextBonusAt: arcadeNextBonusAt(a) };
    }
    bump('games');
    commit('game', { game, score, rarityBonus: reward.rarityBonus, arcade, careGift: !!careGift, feasts: 1, foods: pantryFoods, recipeFoods, snacks, bestBonus, favouriteGame });
    return {
      sprite: s,
      favouriteGame,
      favouriteGameName: favouriteGame ? favourites.game.name : '',
      coins: payout,
      rarityBonus: reward.rarityBonus,
      effectCoins: reward.effectCoins,
      arcade,
      careGift,
      feasts: 1,
      foods: pantryFoods,
      recipeFoods,
      snacks,
      xp: boostedXp,
      score: scoreRecord.last,
      bestScore: scoreRecord.best,
      newBest: scoreRecord.isBest,
      bestBonus,
      event: liveEvent ? liveEvent.key : null,
    };
  },

  claimPassTier({ coins = 0, xp = 0, joy = 0, food = 0, snack = 0, feast = 0 } = {}) {
    const s = activeSprite();
    const payout = Math.max(0, Math.floor(Number(coins) || 0));
    addCoinsRaw(payout);
    const foods = [];
    const availableFoods = typeof unlockedFoodKeys === 'function' ? unlockedFoodKeys() : (typeof FOOD_KEYS !== 'undefined' ? FOOD_KEYS : []);
    for (let i = 0; i < (Number(food) || 0) && availableFoods.length; i += 1) {
      const key = pick(availableFoods);
      if (key) { addFoodRaw(key, 1); foods.push(key); }
    }
    const snacks = [];
    if (typeof SNACK_KEYS !== 'undefined' && SNACK_KEYS.length) {
      for (let i = 0; i < (Number(snack) || 0); i += 1) {
        const key = pick(SNACK_KEYS);
        addSnackRaw(key, 1);
        snacks.push(key);
      }
    }
    const feasts = Math.max(0, Math.floor(Number(feast) || 0));
    if (feasts && typeof STARPATH_FOOD_ID !== 'undefined') addFoodRaw(STARPATH_FOOD_ID, feasts);
    if (s) {
      s.needs.joy = clamp(s.needs.joy + Math.max(0, Number(joy) || 0));
      if (xp) addXpRaw(s, Math.max(1, Number(xp) || 0) * 4);
    }
    commit('passTier', { coins: payout, foods, snacks, feasts });
    return { coins: payout, foods, snacks, feasts };
  },

  finishWalk({ route = 'walk', score = 0, distance = 0, coins = 0, xp = 0, bond = 0, joy = 12, giftTokens = 0 } = {}) {
    const s = activeSprite();
    if (!s || s.stage === 'egg') return { ok: false, reason: 'sprite' };
    const info = typeof WALK_ROUTES !== 'undefined' ? WALK_ROUTES[route] : null;
    if (!info) return { ok: false, reason: 'route' };
    const before = Math.max(0, Number(state.stats.walks) || 0);
    if (before < (info.walkUnlock || 0)) return { ok: false, reason: 'locked' };
    const reward = gameCoinPayout(coins || info.baseCoins);
    const payout = reward.payout;
    const steps = Math.max(0, Math.floor(Number(distance) || Number(score) * (info.stride || 1)));
    const bondGain = Math.max(1, Number(bond) || 1);
    s.needs.joy = clamp(s.needs.joy + Number(joy || 0));
    s.needs.energy = clamp(s.needs.energy - 5);
    s.needs.hunger = clamp(s.needs.hunger - 2);
    s.needs.clean = clamp(s.needs.clean - 3);
    addBondRaw(s, bondGain);
    const trailXpMult = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('trailXp', s) : 1;
    const trailXp = Math.max(1, Math.round((Number(xp) || 1) * trailXpMult));
    const ups = awardXpWithPartner(s, trailXp);
    addCoinsRaw(payout);
    const trail = rollTrailBonus(s, info, payout);
    const forage = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('forage', s) : 1;
    const foodChance = Math.max(0, Math.min(1, (Number(info.foodChance) || 0) * forage));
    const foodKey = foodChance && chance(foodChance) ? pick(unlockedFoodKeys()) : null;
    if (foodKey) addFoodRaw(foodKey, 1);
    const walks = before + 1;
    state.stats.walks = walks;
    state.stats.walkDistance = (Number(state.stats.walkDistance) || 0) + steps;
    state.stats.bestWalk = Math.max(Number(state.stats.bestWalk) || 0, steps);
    state.stats.games = (state.stats.games || 0) + 1;
    /* Trails are scored on the same table too, keyed by their route. */
    const walkRecord = typeof GameScores !== 'undefined'
      ? GameScores.record(state, route, score || steps)
      : { best: Math.max(0, Math.floor(Number(score) || 0)), isBest: false };
    /* A trail best pays the same record bonus the arcade pays. */
    const bestBonus = walkRecord.isBest && typeof GameScores !== 'undefined'
      ? GameScores.bonus(score || steps) : 0;
    if (bestBonus) addCoinsRaw(bestBonus);
    bump('walks');
    bump('games');
    const every = typeof WALK_GIFT_EVERY === 'number' ? WALK_GIFT_EVERY : 3;
    let gift = null;
    if (walks % every === 0) {
      const snackKey = pick(SNACK_KEYS);
      const giftCoins = 45 + Math.min(45, walks * 3);
      addSnackRaw(snackKey, 1);
      addCoinsRaw(giftCoins);
      state.stats.walkGifts = (Number(state.stats.walkGifts) || 0) + 1;
      gift = { snackKey, coins: giftCoins, tokens: Math.max(0, Number(giftTokens) || 0) };
    }
    const unlocked = typeof WALK_ROUTES !== 'undefined'
      ? Object.keys(WALK_ROUTES).filter((key) => WALK_ROUTES[key].walkUnlock === walks)
      : [];
    const careGift = grantCarePackageRaw(s);
    commit('walk', { route, distance: steps, walks, gift: !!gift, careGift: !!careGift });
    return {
      ok: true, sprite: s, coins: payout, xp: trailXp, bond: bondGain,
      distance: steps, walks, foodKey, gift, unlocked, leveled: ups, rarityBonus: reward.rarityBonus, careGift, trail,
      score: Math.max(0, Math.floor(Number(score) || steps)),
      bestScore: walkRecord.best,
      newBest: walkRecord.isBest,
      bestBonus,
    };
  },

  finishSport({ game = 'hoop', score = 0, coins = 0, xp = 0, bond = 0, joy = 14 } = {}) {
    const s = activeSprite();
    if (!s || s.stage === 'egg') return { ok: false, reason: 'sprite' };
    const info = typeof SPORT_GAMES !== 'undefined' ? SPORT_GAMES[game] : null;
    if (!info) return { ok: false, reason: 'game' };
    const reward = gameCoinPayout(coins || info.baseCoins);
    const payout = reward.payout;
    const bondGain = Math.max(1, Number(bond) || 1);
    s.needs.joy = clamp(s.needs.joy + Number(joy || 0));
    s.needs.energy = clamp(s.needs.energy - 6);
    s.needs.hunger = clamp(s.needs.hunger - 3);
    s.needs.clean = clamp(s.needs.clean - 3);
    addBondRaw(s, bondGain);
    const sportXp = Math.max(1, Number(xp) || 1);
    const ups = awardXpWithPartner(s, sportXp);
    addCoinsRaw(payout);
    const sports = (Number(state.stats.sports) || 0) + 1;
    state.stats.sports = sports;
    state.stats.games = (state.stats.games || 0) + 1;
    /* Sports are scored on the same table as the arcade games. */
    const sportRecord = typeof GameScores !== 'undefined'
      ? GameScores.record(state, game, score)
      : { best: Math.max(0, Math.floor(Number(score) || 0)), isBest: false };
    /* A sport best pays the same record bonus the arcade pays. */
    const bestBonus = sportRecord.isBest && typeof GameScores !== 'undefined'
      ? GameScores.bonus(score) : 0;
    if (bestBonus) addCoinsRaw(bestBonus);
    const foodChance = Math.max(0, Math.min(1, Number(info.foodChance) || 1));
    const foodKey = chance(foodChance) ? pick(unlockedFoodKeys()) : null;
    if (foodKey) addFoodRaw(foodKey, 1);
    const every = typeof SPORT_GIFT_EVERY === 'number' ? SPORT_GIFT_EVERY : 2;
    let gift = null;
    if (sports % every === 0) {
      const snackKey = pick(SNACK_KEYS);
      const giftCoins = 60 + Math.min(60, sports * 4);
      addSnackRaw(snackKey, 1);
      addCoinsRaw(giftCoins);
      state.stats.sportGifts = (Number(state.stats.sportGifts) || 0) + 1;
      gift = { snackKey, coins: giftCoins };
    }
    bump('sports');
    bump('games');
    const careGift = grantCarePackageRaw(s);
    commit('sport', { game, score, sports, gift: !!gift, careGift: !!careGift });
    return {
      ok: true, sprite: s, coins: payout, xp: sportXp, bond: bondGain,
      foodKey, gift, sports, leveled: ups, rarityBonus: reward.rarityBonus, careGift,
      score: Math.max(0, Math.floor(Number(score) || 0)),
      bestScore: sportRecord.best,
      newBest: sportRecord.isBest,
      bestBonus,
    };
  },

  /* A duel ends with a score like every other game, but its line already pays
     coins and season charges; the table entry is display only, so this records
     the best without paying a record bonus. */
  recordDuel(score = 0) {
    if (typeof GameScores === 'undefined') return { ok: false, reason: 'scores' };
    const record = GameScores.record(state, 'duel', score);
    commit('game', { game: 'duel', score: record.last });
    return { ok: true, best: record.best, isBest: record.isBest };
  },

  claimArcadeBonus() {
    const a = ensureArcadePeriods();
    const nextAt = arcadeNextBonusAt(a);
    if (a.coins < nextAt) return { ok: false, reason: 'progress', nextAt, progress: a.coins };
    const index = a.bonusClaims + 1;
    const coins = 150 + Math.min(300, index * 25);
    const foodPool = FOOD_KEYS.filter((k) => !FOODS[k].giftOnly && !FOODS[k].monthly);
    const foodKey = pick(foodPool);
    const snackKey = pick(SNACK_KEYS);
    const feast = index % ARCADE_BONUS_FEAST_EVERY === 0;
    addCoinsRaw(coins);
    addFoodRaw(foodKey, 1);
    addSnackRaw(snackKey, 1);
    if (feast) addFoodRaw(STARPATH_FOOD_ID, 1);
    a.bonusClaims = index;
    state.stats.arcadeGifts = (state.stats.arcadeGifts || 0) + 1;
    const nextBonusAt = arcadeNextBonusAt(a);
    Sfx.win();
    commit('arcadeBonus', { index, feast, nextAt: nextBonusAt });
    return { ok: true, index, coins, foodKey, snackKey, feast, nextAt: nextBonusAt };
  },

  claimArcadeMonthGift(id) {
    const a = ensureArcadePeriods();
    const gift = arcadeMonthGift(id);
    if (!gift) return { ok: false, reason: 'missing' };
    if (a.monthClaims.includes(gift.id)) return { ok: false, reason: 'claimed' };
    if (a.monthCoins < gift.at) return { ok: false, reason: 'progress', need: gift.at - a.monthCoins };
    const foodPool = FOOD_KEYS.filter((k) => !FOODS[k].giftOnly && !FOODS[k].monthly);
    const foods = [];
    const snacks = [];
    for (let i = 0; i < gift.foods; i++) {
      const key = pick(foodPool);
      foods.push(key);
      addFoodRaw(key, 1);
    }
    for (let i = 0; i < gift.snacks; i++) {
      const key = pick(SNACK_KEYS);
      snacks.push(key);
      addSnackRaw(key, 1);
    }
    if (gift.feasts) addFoodRaw(STARPATH_FOOD_ID, gift.feasts);
    addCoinsRaw(gift.coins);
    a.monthClaims.push(gift.id);
    state.stats.arcadeMonthGifts = (state.stats.arcadeMonthGifts || 0) + 1;
    Sfx.win();
    commit('arcadeMonthGift', { id: gift.id, coins: gift.coins });
    return { ok: true, gift, foods, snacks, feasts: gift.feasts, coins: gift.coins };
  },

  warmEgg(id, amount) {
    const s = findSprite(id);
    const res = warmEggRaw(s, amount);
    if (!res.ok) {
      if (res.reason === 'cold') {
        toast(`${BREEDS[s.breed]?.name || 'This egg'} only warms under the Chill Stone or Frost Chill.`, '❄️');
        Sfx.error();
      }
      return { ok: false, reason: res.reason };
    }
    if (res.readyNow) {
      toast('The egg is ready to hatch!', '🐣');
      Sfx.pop();
    }
    commit('egg', { spriteId: id });
    return { ok: true, hatch: res.hatch };
  },

  /* Warm every waiting egg once. Cold eggs are reported instead of toasted one
     by one, and the whole batch shares a single save/repaint. */
  warmEggs(ids) {
    const warmed = [];
    const skipped = [];
    [...new Set(Array.isArray(ids) ? ids : [])].forEach((id) => {
      const s = findSprite(id);
      const res = warmEggRaw(s);
      if (res.ok) warmed.push({ id, hatch: res.hatch, readyNow: res.readyNow });
      else if (s && s.stage === 'egg') skipped.push({ id, reason: res.reason });
    });
    if (warmed.length) commit('eggsWarmed', { spriteIds: warmed.map((entry) => entry.id) });
    return { ok: warmed.length > 0, warmed, skipped, readyNow: warmed.filter((entry) => entry.readyNow).length };
  },

  hatchEgg(id) {
    const s = findSprite(id);
    const res = hatchEggRaw(s);
    if (!res.ok) return res;
    checkProgressSecrets();
    Sfx.hatch();
    commit('hatch', { spriteId: s.id });
    return res;
  },

  /* Batch hatch deliberately skips the individual reveal overlay. Every egg
     still goes through hatchEggRaw, keeps its own generated name, and survives
     as an independent sprite; duplicates are never renamed or merged. */
  hatchEggs(ids) {
    const hatched = [];
    const skipped = [];
    [...new Set(Array.isArray(ids) ? ids : [])].forEach((id) => {
      const s = findSprite(id);
      const res = hatchEggRaw(s);
      if (res.ok) hatched.push(res.sprite);
      else if (s && s.stage === 'egg') skipped.push({ id, reason: res.reason });
    });
    if (!hatched.length) return { ok: false, hatched, skipped };
    checkProgressSecrets();
    Sfx.hatch();
    commit('hatchBatch', { spriteIds: hatched.map((sprite) => sprite.id) });
    return { ok: true, hatched, skipped };
  },

  buyEgg(tierId) {
    const tier = EGG_TIERS[tierId];
    if (!tier) return { ok: false, reason: 'missing' };
    if (state.coins < tier.price) {
      toast('Not enough coins for that egg.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    addCoinsRaw(-tier.price);
    let rollOptions = null;
    if (tier.id === 'mythic') {
      rollOptions = { element: rollMythicEggElement(), eggLabel: 'Mythic Egg' };
    } else if (tier.id === 'puffle') {
      rollOptions = { element: rollPuffleEggElement(), eggLabel: 'Puffle Egg' };
    } else if (tier.id === 'monthly') {
      const element = rollMonthlyEggElement();
      const rank = RARITY_TIER_ORDER.indexOf(typeEggRarity(element));
      rollOptions = {
        element,
        eggLabel: 'Monthly Challenge Egg',
        rarityBoost: Math.max(0, RARITY_TIER_ORDER.indexOf('rare') - rank),
      };
    }
    const egg = rollOptions ? rollEgg(tierId, rollOptions) : rollEgg(tierId);
    state.sprites.push(egg);
    commit('buyEgg', { spriteId: egg.id });
    return { ok: true, egg, price: tier.price };
  },

  /* A windowed band can only sell 32 species a day, so the one you want could be
     weeks away. Pinning takes one of those slots for it. The window keeps its
     length, so the ceiling on a named species does not move. A pin is a place in
     the shop, not a weighting: the draw is still uniform over the window's
     unowned species, so buyBandNamed is what actually buys the pet. */
  pinBandSpecies(tierKey, speciesKey) {
    const pool = typeof tierEggBandPool === 'function' ? tierEggBandPool(tierKey) : [];
    if (!pool.length) return { ok: false, reason: 'empty' };
    const windowed = typeof tierEggFeaturedPool === 'function'
      && tierEggFeaturedPool(tierKey, new Date(), null).length < pool.length;
    if (!windowed) return { ok: false, reason: 'not-windowed' };
    if (!speciesKey || !pool.includes(speciesKey)) return { ok: false, reason: 'missing' };
    if (bandPinFor(tierKey) === speciesKey) return { ok: true, already: true, tier: tierKey, species: speciesKey };
    state.tierPins = { ...(state.tierPins || {}), [tierKey]: speciesKey };
    commit('tierPins', { tier: tierKey, species: speciesKey });
    return { ok: true, tier: tierKey, species: speciesKey };
  },

  unpinBandSpecies(tierKey) {
    const pins = { ...(state.tierPins || {}) };
    if (!pins[tierKey]) return { ok: true, already: true };
    delete pins[tierKey];
    state.tierPins = pins;
    commit('tierPins', { tier: tierKey, species: null });
    return { ok: true, tier: tierKey };
  },

  /* Pinning keeps a species on sale; it does not make the roll land on it. From
     an unowned window the pinned species is one of 32 drawn without replacement,
     so rolling for it costs 16.5 eggs on average, and one egg once it is the
     last one missing. Buying it outright costs the same — price x (left + 1) / 2
     — with no variance and none of the other species. The pin is still required,
     so this can never sell a species the band does not own. */
  buyBandNamed(tierKey) {
    const meta = typeof TIER_EGG_META !== 'undefined' ? TIER_EGG_META[tierKey] : null;
    const species = meta && typeof bandPinFor === 'function' ? bandPinFor(tierKey) : null;
    if (!species) return { ok: false, reason: meta ? 'no-pin' : 'missing' };
    /* Duplicates are what the band egg sells, at one egg each; a named purchase
       of something already owned would undercut that roll, so it is refused. */
    if (state.sprites.some((sprite) => sprite.element === species)) {
      return { ok: false, reason: 'owned' };
    }
    const price = typeof tierBandNamedPrice === 'function' ? tierBandNamedPrice(tierKey) : 0;
    if (state.coins < price) {
      toast('Not enough coins for that species.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins', price };
    }
    addCoinsRaw(-price);
    /* The pin is a member of its own band, so it already owns the band's rank;
       no rarity boost is needed to hatch it at that rank. */
    const egg = rollEgg('wild', {
      element: species,
      eggLabel: meta.name,
      mutation: meta.mutation,
      gen: meta.gen,
    });
    state.sprites.push(egg);
    commit('buyEgg', { spriteId: egg.id, tier: tierKey });
    return { ok: true, egg, tier: tierKey, price };
  },

  /* A band egg draws only from species that own that rank. Drawing from every
     species at or below the band made one specific Ultra a 1-in-4,000 roll:
     1,550 coins per egg against a pool of thousands is 6.2M coins for the pet
     you actually wanted. Same-rank pools make a rank findable, and a band no
     species owns is simply not sold.
  */
  buyTierEgg(tierKey) {
    const meta = typeof TIER_EGG_META !== 'undefined' ? TIER_EGG_META[tierKey] : null;
    const target = typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER.indexOf(tierKey) : -1;
    if (!meta || target < 0) return { ok: false, reason: 'missing' };
    if (state.coins < meta.price) {
      toast('Not enough coins for that egg.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    const band = typeof tierEggBandPool === 'function' ? tierEggBandPool(tierKey) : [];
    if (!band.length) {
      toast('No species owns that rank yet.', '🥚');
      return { ok: false, reason: 'empty' };
    }
    /* The band is a collection, so the egg fills it: a species the player
       does not own yet is drawn first and duplicates only start once the
       band is complete. Without this the last Ultra is 1-in-4 but the last
       Secret is 1-in-3,763 no matter how many you already have. */
    const pool = typeof tierEggFeaturedPool === 'function' ? tierEggFeaturedPool(tierKey) : band;
    const owned = new Set(state.sprites.map((sprite) => sprite.element).filter(Boolean));
    const fresh = pool.filter((key) => !owned.has(key));
    const element = pick(fresh.length ? fresh : pool);
    const boost = Math.max(0, target - RARITY_TIER_ORDER.indexOf(typeEggRarity(element)));
    addCoinsRaw(-meta.price);
    const egg = rollEgg('wild', {
      element,
      eggLabel: meta.name,
      rarityBoost: boost,
      mutation: meta.mutation,
      gen: meta.gen,
    });
    state.sprites.push(egg);
    commit('buyEgg', { spriteId: egg.id, tier: tierKey });
    return { ok: true, egg, tier: tierKey, boost, price: meta.price };
  },

  buyTypeEgg(elementKey, rankKey) {
    const ranked = typeof TYPE_EGG_APEX_PREMIUM !== 'undefined' && !!TYPE_EGG_APEX_PREMIUM[rankKey];
    const price = ranked ? typeEggApexPrice(elementKey, rankKey) : TYPE_EGG_PRICE[elementKey];
    if (!price || !ELEMENTS[elementKey]) return { ok: false, reason: 'missing' };
    if (state.coins < price) {
      toast('Not enough coins for that egg.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    addCoinsRaw(-price);
    const tierName = ranked ? TYPE_EGG_RARITIES[rankKey].name : '';
    const egg = rollEgg('common', {
      element: elementKey,
      eggLabel: ranked ? `${ELEMENTS[elementKey].name} ${tierName} Egg` : `${ELEMENTS[elementKey].name} Egg`,
      ...(ranked ? { rarityBoost: typeEggRarityBoost(elementKey, rankKey), mutation: 0.42 } : {}),
    });
    state.sprites.push(egg);
    commit('buyEgg', { spriteId: egg.id, tier: ranked ? rankKey : undefined });
    return { ok: true, egg, price, tier: ranked ? rankKey : null };
  },

  undoEggPurchase(spriteIds, price) {
    const ids = [...new Set((Array.isArray(spriteIds) ? spriteIds : [spriteIds]).filter(Boolean))];
    if (!ids.length) return { ok: false, reason: 'missing' };
    const eggs = ids.map((id) => findSprite(id));
    if (eggs.some((egg) => !egg || egg.stage !== 'egg')) return { ok: false, reason: 'changed' };
    const refund = Math.max(0, Number(price) || 0);
    const remove = new Set(ids);
    for (let i = state.sprites.length - 1; i >= 0; i -= 1) {
      if (remove.has(state.sprites[i].id)) state.sprites.splice(i, 1);
    }
    refundCoinsRaw(refund);
    commit('undoEggPurchase', { spriteIds: ids, coins: refund });
    return { ok: true, spriteIds: ids, coins: refund };
  },

  buyTypeEggBulk(rankKey, size) {
    const deal = typeof TYPE_EGG_BULK_DEALS !== 'undefined' ? TYPE_EGG_BULK_DEALS.find((d) => d.size === size) : null;
    if (!deal || !TYPE_EGG_APEX_PREMIUM[rankKey]) return { ok: false, reason: 'missing' };
    const roster = TYPE_EGG_SPECIES.filter((key) => ELEMENTS[key]);
    if (!roster.length) return { ok: false, reason: 'empty' };
    const price = typeEggBulkPrice(rankKey, size);
    if (state.coins < price) {
      toast('Not enough coins for that bundle.', '🪙');
      Sfx.error();
      return { ok: false, reason: 'coins' };
    }
    addCoinsRaw(-price);
    const tierName = TYPE_EGG_RARITIES[rankKey].name;
    const eggs = [];
    for (let i = 0; i < size; i += 1) {
      const element = pick(roster);
      const egg = rollEgg('common', {
        element,
        eggLabel: `${ELEMENTS[element].name} ${tierName} Egg`,
        rarityBoost: typeEggRarityBoost(element, rankKey),
        mutation: 0.42,
      });
      state.sprites.push(egg);
      eggs.push(egg);
    }
    commit('buyEgg', { spriteId: eggs[0].id, tier: rankKey, bulk: size });
    return { ok: true, eggs, price, off: deal.off };
  },

  previewMerge(aId, bId) {
    const a = findSprite(aId);
    const b = findSprite(bId);
    if (!a || !b) return { error: 'Pick two sprites first.' };
    if (a.id === b.id) return { error: 'Two different sprites, please.' };
    const aEgg = a.stage === 'egg';
    const bEgg = b.stage === 'egg';
    if (aEgg !== bEgg) return { error: 'Merge two eggs or two hatched sprites.' };
    const eggMerge = aEgg && bEgg;
    if (!eggMerge && (a.level < MERGE_LEVEL || b.level < MERGE_LEVEL)) return { error: `Both sprites must be level ${MERGE_LEVEL} to merge.` };
    if (!eggMerge && (restLeft(a) > 0 || restLeft(b) > 0)) return { error: 'One of them is still resting.' };
    /* First Flight waives the first fusion fee and guarantees its hybrid. */
    const waived = !eggMerge && firstFlightMergeWaived();
    const cost = waived ? 0 : mergeCost(a, b);
    if (!waived && state.coins < cost) return { error: `You need ${cost} coins to merge.` };
    const why = {};
    const child = buildChild(a, b, eggMerge, why);
    const twins = !eggMerge && chance(Math.min(0.38, 0.05 + (state.stats.merges || 0) * 0.015));
    let child2 = null;
    let twinsWhy = null;
    if (twins) {
      twinsWhy = {};
      child2 = buildChild(a, b, false, twinsWhy);
    }
    return { error: null, cost, waived, eggMerge, child, child2, twins, odds: mergeOdds(a, b), a, b, why, twinsWhy };
  },

  completeMerge(aId, bId, child, child2 = null) {
    const a = findSprite(aId);
    const b = findSprite(bId);
    if (!a || !b || !child) return { ok: false };
    const eggMerge = a.stage === 'egg' && b.stage === 'egg';
    const waived = !eggMerge && firstFlightMergeWaived();
    const cost = waived ? 0 : mergeCost(a, b);
    if (!waived && state.coins < cost) return { ok: false, reason: 'coins' };
    if (cost) addCoinsRaw(-cost);
    state.sprites.push(child);
    if (child2) state.sprites.push(child2);
    const flight = firstFlightData();
    if (!eggMerge && flight && flight.startedAt && !flight.migrated && !flight.skipped && !flight.fusionId) {
      flight.fusionId = child.id;
    }
    if (eggMerge) {
      /* The two shells are spent on the summon. */
      for (let i = state.sprites.length - 1; i >= 0; i -= 1) {
        if (state.sprites[i].id === a.id || state.sprites[i].id === b.id) state.sprites.splice(i, 1);
      }
      if (!state.activeId || state.activeId === a.id || state.activeId === b.id) state.activeId = child.id;
    } else {
      a.restUntil = Date.now() + 60000;
      b.restUntil = Date.now() + 60000;
      addXpRaw(a, 12);
      addXpRaw(b, 12);
    }
    state.stats.merges += 1;
    if (child.shiny) state.stats.shinies = (state.stats.shinies || 0) + 1;
    if (child2?.shiny) state.stats.shinies = (state.stats.shinies || 0) + 1;
    if (child2) state.stats.twins = (state.stats.twins || 0) + 1;
    if (child.special) state.stats.specials = (state.stats.specials || 0) + 1;
    if (child2?.special) state.stats.specials = (state.stats.specials || 0) + 1;
    bump('merges');
    if (flight && flight.startedAt && waived) flight.waiverUsed = true;
    if (!eggMerge && (child.shiny || child2?.shiny)) Sfx.shinyEgg();
    else Sfx.hatch();
    commit('merge', { spriteId: child.id, twins: !!child2 });
    return { ok: true, child, child2, eggMerge, eggs: child2 ? [child, child2] : [child], cost };
  },

  /* ---------------- First Flight ---------------- */
  /* The gift egg removes the one purchase that could strand a new player:
     the second sprite needed for a fusion is free and already half warm. */
  flightGiftEgg() {
    const flight = firstFlightData();
    if (!flight) return { ok: false, reason: 'missing' };
    if (flight.giftClaimed) return { ok: false, reason: 'claimed' };
    if (!flight.startedAt || flight.migrated || flight.skipped) return { ok: false, reason: 'inactive' };
    const starter = state.sprites.find((s) => s.starter) || null;
    const roster = (SCENES[state.theme && state.theme.scene] && SCENES[state.theme.scene].species) || [];
    /* Only ordinary, buyable species: a tutorial gift must never hand out a
       secret or admin species. */
    const pool = roster.filter((key) => ELEMENTS[key]
      && key !== (starter && starter.element)
      && !(typeof isSecretSpecies === 'function' && isSecretSpecies(key))
      && key !== (typeof MASTER_CHEAT_SPECIES !== 'undefined' ? MASTER_CHEAT_SPECIES : null)
      && !(typeof TYPE_EGG_PRICE !== 'undefined' && TYPE_EGG_PRICE[key] === undefined));
    const element = pool.length ? pick(pool) : undefined;
    const egg = rollEgg('common', { element, eggLabel: 'First Flight Gift Egg' });
    egg.hatch = FirstFlight.GIFT_EGG_HATCH;
    state.sprites.push(egg);
    flight.giftClaimed = true;
    if (egg.shiny) Sfx.shinyEgg(); else Sfx.win();
    toast('Your gift egg is waiting in the Nest · tap to warm it', '🎁');
    commit('flightGift', { spriteId: egg.id, element: egg.element });
    return { ok: true, egg, element: egg.element };
  },

  flightBegin() {
    const flight = firstFlightData();
    if (!flight) return { ok: false, reason: 'missing' };
    if (flight.startedAt) return { ok: false, reason: 'started' };
    const progress = firstFlightProgress();
    if (!progress || !progress.eligible) return { ok: false, reason: 'ineligible' };
    flight.startedAt = Date.now();
    commit('flightBegin');
    return { ok: true, progress: firstFlightProgress() };
  },

  flightSkip() {
    const flight = firstFlightData();
    if (!flight) return { ok: false, reason: 'missing' };
    if (flight.skipped) return { ok: false, reason: 'skipped' };
    flight.skipped = true;
    commit('flightSkip');
    return { ok: true };
  },

  flightClaim() {
    const flight = firstFlightData();
    if (!flight) return { ok: false, reason: 'missing' };
    if (flight.claimed) return { ok: false, reason: 'claimed' };
    const progress = firstFlightProgress();
    if (!progress || !progress.done) return { ok: false, reason: 'incomplete' };
    if (!progress.eligible) return { ok: false, reason: 'ineligible' };
    const reward = FirstFlight.REWARD;
    const snackKey = typeof SNACK_KEYS !== 'undefined' && SNACK_KEYS.length ? pick(SNACK_KEYS) : null;
    addCoinsRaw(reward.coins);
    if (snackKey) addSnackRaw(snackKey, reward.snacks);
    flight.claimed = true;
    Sfx.win();
    const snackName = snackKey && typeof SNACKS !== 'undefined' && SNACKS[snackKey] ? SNACKS[snackKey].name : '';
    toast('First Flight complete · +' + reward.coins + ' coins' + (snackName ? ' · ' + snackName : ''), '🕊️');
    commit('flightClaim', { coins: reward.coins, snack: snackKey });
    return { ok: true, coins: reward.coins, snackKey };
  },

  claimFamilyMilestone(familyId) {
    const family = typeof SPECIES_FAMILY_GROUPS !== 'undefined'
      ? SPECIES_FAMILY_GROUPS.find((entry) => entry.id === familyId)
      : null;
    if (!family) return { ok: false, reason: 'family' };
    if (typeof FamilyCompletion === 'undefined') return { ok: false, reason: 'unavailable' };
    if (!state.familyClaims || typeof state.familyClaims !== 'object') state.familyClaims = {};
    const res = FamilyCompletion.claim(family, state.sprites, state.familyClaims);
    if (!res.ok) return res;
    addCoinsRaw(res.coins);
    state.familyClaims[family.id] = Math.max(0, Number(state.familyClaims[family.id]) || 0) + 1;
    Sfx.coin();
    toast(`${family.label} milestone · +${res.coins} coins`, '🧬');
    commit('familyMilestone', { familyId: family.id, index: res.index, coins: res.coins });
    return res;
  },

  /* Fill the cheapest gap in one family without a random roll. The candidate
     is recomputed here, so a stale card cannot buy a species that arrived in
     the Hollow between render and tap. */
  buyFamilyMissing(familyId) {
    const family = typeof SPECIES_FAMILY_GROUPS !== 'undefined'
      ? SPECIES_FAMILY_GROUPS.find((entry) => entry.id === familyId)
      : null;
    if (!family) return { ok: false, reason: 'family' };
    if (typeof FamilyCompletion === 'undefined') return { ok: false, reason: 'unavailable' };
    const candidate = FamilyCompletion.missingEgg(family, state.sprites);
    if (!candidate) return { ok: false, reason: 'complete' };
    if (candidate.overCap) {
      return { ok: false, reason: 'cap', price: candidate.price, cap: candidate.cap };
    }
    if (state.coins < candidate.price) return { ok: false, reason: 'coins', price: candidate.price };
    if (state.sprites.some((sprite) => sprite.element === candidate.key)) {
      return { ok: false, reason: 'duplicate' };
    }
    const res = Actions.buyTypeEgg(candidate.key);
    if (!res.ok) return res;
    return { ok: true, egg: res.egg, price: res.price, key: candidate.key, name: candidate.name };
  },

  /* ---------------- Second Flight ---------------- */
  /* One path, one derived action, and a dismissal. Nothing here rewards the
     player, so the pick can be changed or put away at any time. */
  flight2Pick(pathId) {
    const path = typeof SecondFlight !== 'undefined' ? SecondFlight.pathById(pathId) : null;
    if (!path) return { ok: false, reason: 'missing' };
    if (!state.flight || !state.flight.claimed) return { ok: false, reason: 'locked' };
    const current = SecondFlight.sanitize(state.flight2);
    state.flight2 = SecondFlight.sanitize({ ...current, picked: path.id, dismissed: false, startedAt: current.startedAt || Date.now() });
    commit('flight2Pick', { path: path.id });
    return { ok: true, path };
  },

  flight2Clear() {
    if (typeof SecondFlight === 'undefined') return { ok: false, reason: 'missing' };
    const current = SecondFlight.sanitize(state.flight2);
    state.flight2 = SecondFlight.sanitize({ ...current, picked: null });
    commit('flight2Clear', {});
    return { ok: true };
  },

  flight2Dismiss() {
    if (!state.flight || !state.flight.claimed) return { ok: false, reason: 'locked' };
    const current = typeof SecondFlight !== 'undefined'
      ? SecondFlight.sanitize(state.flight2)
      : { picked: null, dismissed: false, startedAt: 0 };
    state.flight2 = Object.assign({}, current, { dismissed: true });
    commit('flight2Dismiss', {});
    return { ok: true };
  },

  claimTask(taskId, period = 'daily') {
    ensureQuests();
    const bucket = period === 'weekly' ? state.weekly : period === 'monthly' ? state.monthly : state.daily;
    const task = bucket?.tasks.find((t) => t.id === taskId);
    if (!task) return { ok: false };
    if (task.claimed) return { ok: false, reason: 'claimed' };
    if (periodCounter(task, period) < task.goal) return { ok: false, reason: 'progress' };
    task.claimed = true;
    const active = activeSprite();
    const bonusCoins = active && active.stage !== 'egg' && !active.retired ? (spriteEffects(active).taskCoins || 0) : 0;
    const totalReward = task.reward + bonusCoins;
    addCoinsRaw(totalReward);
    state.stats.tasksClaimed = (state.stats.tasksClaimed || 0) + 1;
    if (state.stats.tasksClaimed >= 10) unlockSecret('taskkeeper');
    awardXpWithPartner(active, task.xp || 15);
    Sfx.coin();
    toast(`${period === 'daily' ? 'Task' : period === 'weekly' ? 'Weekly goal' : 'Monthly quest'} complete +${totalReward} coins${bonusCoins ? ` · pony +${bonusCoins}` : ''}`, '✅');
    commit('task', { taskId, period, reward: totalReward, bonusCoins });
    return { ok: true, reward: totalReward, bonusCoins };
  },

  checkIn() {
    const c = ensureCheckinPeriods();
    const today = dayKey();
    const win = currentCheckinWindow();
    if (c.slots.includes(win.id)) {
      return { ok: false, reason: 'window', window: win, slots: c.slots.slice() };
    }
    const firstToday = c.slots.length === 0;
    let streak = c.streak || 0;
    if (firstToday) {
      streak = c.last === today ? Math.max(1, streak) : c.last === yesterdayKey() ? streak + 1 : 1;
      c.streak = streak;
      c.last = today;
      c.monthDays = (c.monthDays || 0) + 1;
      c.yearDays = (c.yearDays || 0) + 1;
    }
    c.slots.push(win.id);
    c.weekSlots = (c.weekSlots || 0) + 1;
    c.monthSlots = (c.monthSlots || 0) + 1;
    c.yearSlots = (c.yearSlots || 0) + 1;
    state.stats.checkins = (state.stats.checkins || 0) + 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak || 0, streak);
    if (state.stats.checkins >= 7) unlockSecret('dailykeeper');
    const holiday = typeof activeHoliday === 'function' ? activeHoliday() : null;
    const s = activeSprite();
    const bonusCoins = s ? (spriteEffects(s).checkinCoins || 0) : 0;
    const baseReward = firstToday ? 20 + Math.min(streak, 7) * 5 : 8 + Math.min(streak, 7) * 2;
    const reward = Math.round(baseReward * (typeof holidayCoinMult === 'function' ? holidayCoinMult() : (holiday?.coinMult || 1)) * weeklyEventCoinMult()) + bonusCoins;
    addCoinsRaw(reward);
    if (s) addXpRaw(s, firstToday ? 12 : 5);
    const snackKey = chance(firstToday ? 0.45 : 0.3) ? pick(SNACK_KEYS) : null;
    if (snackKey) addSnackRaw(snackKey, 1);
    const foodKey = firstToday ? pick(unlockedFoodKeys()) : null;
    if (foodKey) addFoodRaw(foodKey, 1);
    const holidayFood = firstToday && holiday?.treat && FOODS[holiday.treat] ? holiday.treat : null;
    if (holidayFood) addFoodRaw(holidayFood, 1);
    const milestones = [];
    WEEK_MILESTONES.forEach((m) => {
      if (c.weekSlots >= m.n && !c.weekClaims.includes(m.id)) {
        c.weekClaims.push(m.id);
        const rewardInfo = grantMilestoneRaw(m);
        if (rewardInfo) milestones.push(rewardInfo);
      }
    });
    MONTH_MILESTONES.forEach((m) => {
      if ((c.monthSlots || 0) >= m.n && !c.monthClaims.includes(m.id)) {
        c.monthClaims.push(m.id);
        const rewardInfo = grantMilestoneRaw(m);
        if (rewardInfo) milestones.push(rewardInfo);
      }
    });
    if ((c.yearSlots || 0) >= YEAR_MILESTONE.n && !c.yearClaims.includes(YEAR_MILESTONE.id)) {
      c.yearClaims.push(YEAR_MILESTONE.id);
      const rewardInfo = grantMilestoneRaw(YEAR_MILESTONE);
      if (rewardInfo) milestones.push(rewardInfo);
    }
    ensureGift();
    Sfx.coin();
    commit('checkin', { streak, reward, window: win.id });
    /* The claim just made drops its own pending alarm; the care reminder stays. */
    if (typeof Notifier !== 'undefined' && typeof Notifier.refreshCheckins === 'function') Notifier.refreshCheckins();
    return {
      ok: true, reward, bonusCoins, streak, window: win, firstToday,
      snackKey, foodKey, holidayFood, holiday: holiday?.key || null, milestones, slots: c.slots.slice(), weekSlots: c.weekSlots,
    };
  },

  claimWeeklyEvent(secretKey = '') {
    const event = activeWeeklyEvent();
    if (!event) return { ok: false, reason: 'event' };
    const weekly = ensureWeeklyEvents();
    if (weekly.claims.includes(event.key)) return { ok: false, reason: 'claimed', event };
    const reward = event.reward || {};
    const result = { ok: true, event, coins: reward.coins || 0, snacks: [], foods: [], vault: [], crates: 0, monthly: null, fridayCrate: false, secret: null };
    if (reward.kind === 'vault') {
      const missing = weeklyEventMissingVaultKeys();
      missing.forEach((key) => {
        const sprite = unlockSecretRaw(key);
        if (sprite) result.vault.push(sprite);
      });
      if (!missing.length) result.coins += 250;
    } else if (reward.kind === 'crates') {
      const index = WEEKLY_EVENTS.findIndex((item) => item.key === event.key);
      const missed = WEEKLY_EVENTS.slice(0, Math.max(0, index)).filter((item) => !weekly.claims.includes(item.key));
      result.crates = missed.length;
      missed.forEach(() => {
        result.coins += 80;
        const snack = pick(SNACK_KEYS);
        addSnackRaw(snack, 1);
        result.snacks.push(snack);
      });
    } else if (reward.kind === 'friday-crate') {
      const c = ensureCheckinPeriods();
      const month = monthKey();
      const monthlyDue = c.monthCrateKey !== month;
      const unlocked = Array.isArray(state.secretUnlocks) ? state.secretUnlocks : [];
      const locked = SECRET_SPECIES.filter((key) => !unlocked.includes(key));
      /* The first Friday crate opened each month carries the free Vault
         choice. Validate the pick before granting anything so a stale or
         forged key cannot consume the crate without a secret. When every
         secret is home the crate claims normally with an empty key. */
      if (monthlyDue && locked.length) {
        if (!secretKey) return { ok: false, reason: 'secret', event };
        if (!SECRET_SPECIES.includes(secretKey) || unlocked.includes(secretKey)) {
          return { ok: false, reason: 'secret', event };
        }
      }
      result.fridayCrate = true;
      result.crates = 1;
      for (let i = 0; i < 2; i += 1) {
        const key = pick(unlockedFoodKeys());
        if (!key) break;
        addFoodRaw(key, 1);
        result.foods.push(key);
      }
      if (monthlyDue) {
        const coins = 100 + Math.min(50, (c.monthDays || 0) * 5);
        const lockedFoods = MONTHLY_FOOD_KEYS.filter((key) => !(state.foodUnlocks || []).includes(key));
        const newFood = lockedFoods[0] || null;
        if (newFood) {
          state.foodUnlocks = state.foodUnlocks || [];
          state.foodUnlocks.push(newFood);
          addFoodRaw(newFood, 2);
        }
        const bundle = [];
        for (let i = 0; i < 3; i += 1) {
          const key = pick(unlockedFoodKeys());
          if (!key) break;
          bundle.push(key);
          addFoodRaw(key, 1);
        }
        const secret = secretKey ? unlockSecretRaw(secretKey) : null;
        if (secret) {
          result.secret = secret;
          result.vault.push(secret);
        }
        c.monthCrateKey = month;
        state.stats.monthCrates = (state.stats.monthCrates || 0) + 1;
        result.monthly = { coins, newFood, bundle, secret: secretKey || null };
        result.coins += coins;
      }
    } else if (reward.foodCats?.length) {
      const keys = weeklyEventFoodKeys(event);
      keys.forEach((key) => {
        addFoodRaw(key, 1);
        result.foods.push(key);
      });
    }
    const snacks = Math.max(0, Number(reward.snacks) || 0);
    for (let i = 0; i < snacks; i++) {
      const snack = pick(SNACK_KEYS);
      addSnackRaw(snack, 1);
      result.snacks.push(snack);
    }
    addCoinsRaw(result.coins);
    weekly.claims.push(event.key);
    state.stats.weeklyEventClaims = (state.stats.weeklyEventClaims || 0) + 1;
    commit('weekly-event', {
      event: event.key,
      coins: result.coins,
      vault: result.vault.length,
      foods: result.foods.length,
      crates: result.crates,
      fridayCrate: result.fridayCrate,
      monthly: !!result.monthly,
      secret: result.secret ? result.secret.element : null,
    });
    return result;
  },

  /* The Friday event owns the crate and the monthly secret choice. */
  claimFridayCrate(secretKey = '') {
    return Actions.claimWeeklyEvent(secretKey);
  },

  claimWeeklyTreat(now = Date.now()) {
    if (typeof WeeklyChallenge === 'undefined') return { ok: false, reason: 'unavailable' };
    const info = WeeklyChallenge.treatProgressFromSave(state, now);
    if (!info.week.active) return { ok: false, reason: 'inactive', info };
    if (info.claimed) return { ok: false, reason: 'claimed', info };
    if (!info.key || !info.food) return { ok: false, reason: 'food', info };
    const date = new Date(Number(now) || 0);
    const today = dayKey(date);
    const record = WeeklyChallenge.sanitizeTreat(state.weeklyTreats);
    const claimed = record.week === info.week.key ? record.claimed : [];
    addFoodRaw(info.key, 1);
    state.weeklyTreats = {
      week: info.week.key,
      claimed: Array.from(new Set([...claimed, today])).slice(0, 7),
    };
    commit('weeklyTreat', { food: info.key, day: today, week: info.week.key, favorite: info.favorite });
    return {
      ok: true,
      key: info.key,
      food: info.food,
      favorite: info.favorite,
      spriteName: info.spriteName,
      day: info.day,
      week: info.week,
    };
  },

  finishQuiz() {
    const status = quizStatus();
    if (!status.ready) return { ok: false, reason: status.done ? 'done' : 'locked' };
    state.quiz.doneDate = dayKey();
    commit('quiz', { date: state.quiz.date });
    return { ok: true, date: state.quiz.date };
  },

  claimWeekendGift() {
    if (typeof weekendAdminActive !== 'function' || !weekendAdminActive()) return { ok: false, reason: 'weekend' };
    const event = weekendAdminEvent();
    const week = weekendAdminDateKey();
    if (weekendAdminClaimed()) return { ok: false, reason: 'claimed', event };
    const pool = weekendAdminEggPool();
    const key = pool.includes(event.egg) ? event.egg : (pool.length ? pick(pool) : dailyEggFeatured());
    const egg = rollEgg('wild', { element: key, eggLabel: `${ELEMENTS[key].name} Event Egg` });
    egg.hatch = 40;
    state.sprites.push(egg);
    const coins = Math.round((event.coins || 300) * (1 + Math.min(0.5, (state.stats.weekendGifts || 0) * 0.02)));
    addCoinsRaw(coins);
    state.weekendGift = { week, event: event.key, key };
    state.stats.weekendGifts = (state.stats.weekendGifts || 0) + 1;
    if (egg.shiny) Sfx.shinyEgg(); else Sfx.win();
    commit('weekendGift', { event: event.key, element: key, coins });
    return { ok: true, event, egg, element: key, coins, week };
  },

  claimDailyEgg(elementKey) {
    const today = dayKey();
    if (state.eggGift?.date === today) return { ok: false, reason: 'claimed' };
    const pool = dailyEggPool();
    const key = pool.includes(elementKey) ? elementKey : dailyEggFeatured();
    const egg = rollEgg('wild', { element: key, eggLabel: `${ELEMENTS[key].name} Gift Egg` });
    egg.hatch = 40;
    state.sprites.push(egg);
    state.eggGift = { date: today, key };
    state.stats.dailyEggs = (state.stats.dailyEggs || 0) + 1;
    if (egg.shiny) Sfx.shinyEgg(); else Sfx.hatch();
    commit('dailyEgg', { element: key, spriteId: egg.id });
    return { ok: true, egg, element: key };
  },

  claimHolidayGift() {
    const holiday = typeof activeHoliday === 'function' ? activeHoliday() : null;
    if (!holiday) return { ok: false, reason: 'event' };
    const today = dayKey();
    if (state.holidayGift?.date === today && state.holidayGift.holiday === holiday.key) {
      return { ok: false, reason: 'claimed', holiday };
    }
    const pool = holidayEggPool(holiday);
    const key = pool.length ? pick(pool) : dailyEggFeatured();
    const egg = rollEgg('wild', { element: key, eggLabel: `${ELEMENTS[key].name} ${holiday.name} Egg` });
    egg.hatch = 40;
    state.sprites.push(egg);
    const coins = Math.round(80 * (typeof holidayCoinMult === 'function' ? holidayCoinMult() : (holiday.coinMult || 1))) + 40;
    addCoinsRaw(coins);
    const snack = pick(SNACK_KEYS);
    addSnackRaw(snack, 1);
    state.holidayGift = { date: today, holiday: holiday.key, key };
    state.stats.holidayGifts = (state.stats.holidayGifts || 0) + 1;
    if (egg.shiny) Sfx.shinyEgg(); else Sfx.win();
    commit('holidayGift', { holiday: holiday.key, element: key, coins });
    return { ok: true, holiday, egg, element: key, coins, snack };
  },

  claimGift() {
    if (!giftReady()) return { ok: false, reason: 'waiting' };
    const gift = state.gift;
    const s = findSprite(gift.spriteId) || activeSprite();
    if (!s) return { ok: false, reason: 'missing' };
    const lockedScenes = GIFT_SCENES.filter((k) => !state.unlockedScenes.includes(k));
    const roll = Math.random();
    let reward;
    if (lockedScenes.length && roll < 0.24) {
      const key = pick(lockedScenes);
      state.unlockedScenes.push(key);
      reward = { kind: 'scene', icon: '🏞️', title: 'A new environment!', text: `${SCENES[key].name} is now available in the Studio.`, sceneKey: key };
    } else if (roll < 0.44) {
      const key = pick(SNACK_KEYS);
      const amount = randInt(1, 2);
      addSnackRaw(key, amount);
      reward = { kind: 'snack', icon: SNACKS[key].emoji, title: 'A snack gift', text: `${SNACKS[key].name} ×${amount}` };
    } else if (roll < 0.7) {
      const xp = randInt(24, 55);
      addXpRaw(s, xp);
      reward = { kind: 'xp', icon: '⭐', title: 'A burst of XP', text: `+${xp} XP for ${displayName(s)}` };
    } else {
      const coins = randInt(25, 65);
      addCoinsRaw(coins);
      reward = { kind: 'coins', icon: '🪙', title: 'A little coin gift', text: `+${coins} coins` };
    }
    /* Only the puffle who actually gave the gift may mention it in chat. The
       stamp lives on that sprite's voice state so it survives a reload; the
       normalizer fills the other voice fields on save. */
    if (!s.voice || typeof s.voice !== 'object') s.voice = {};
    s.voice.giftAt = Date.now();
    state.stats.gifts = (state.stats.gifts || 0) + 1;
    if (state.stats.gifts >= 20) unlockSecret('giftkeeper');
    state.gift = null;
    scheduleGiftRaw(false);
    Sfx.win();
    commit('gift', { kind: reward.kind, spriteId: s.id });
    return { ok: true, reward, sprite: s, nextAt: state.gift?.readyAt || 0 };
  },

  evolve(id, formId) {
    const s = findSprite(id);
    const form = EVOLUTION_FORMS[formId];
    if (!s || s.stage === 'egg' || !form) return { ok: false, reason: 'missing' };
    if (s.form) return { ok: false, reason: 'already' };
    if (s.level < EVOLUTION_LEVEL) return { ok: false, reason: 'level' };
    if (form.cuisine) {
      if ((s.cuisine?.[form.cuisine] || 0) < EVOLUTION_AFFINITY) return { ok: false, reason: 'cuisine' };
    } else if ((s.diet?.[form.diet] || 0) < EVOLUTION_AFFINITY) {
      return { ok: false, reason: 'diet' };
    }
    s.form = form.id;
    /* A creature meets its coat as it evolves: one of its species' canon
       colourways, the species' own coat included. */
    if (form.creature && typeof cpCreatureColourwayRoll === 'function') {
      s.puffleVariant = cpCreatureColourwayRoll(form.creature);
    }
    s.size = form.size;
    s.evolvedAt = Date.now();
    s.bond = clamp(s.bond + 8);
    addXpRaw(s, 45);
    addCoinsRaw(25);
    state.stats.evolves = (state.stats.evolves || 0) + 1;
    Sfx.level();
    toast(`${displayName(s)} evolved into ${formName(s)}!`, form.icon);
    if (typeof celebrateFormEvolution === 'function') setTimeout(() => celebrateFormEvolution(s, form), 320);
    commit('evolve', { spriteId: s.id, form: form.id });
    return { ok: true, form, sprite: s };
  },

  /* The six Dragon Nest forms are permanent collection entries, so progress
     survives closing the mini game or reloading the Hollow. */
  recordDragonType(key) {
    if (!Array.isArray(state.stats.dragonTypes)) state.stats.dragonTypes = [];
    if (!key || state.stats.dragonTypes.includes(key)) return { ok: true, isNew: false };
    state.stats.dragonTypes.push(key);
    addCoinsRaw(15);
    commit('dragonType', { key });
    return { ok: true, isNew: true };
  },

  customize(id, patch) {
    const s = findSprite(id);
    if (!s) return;
    /* Puffle colour variant, from the exact palette table. */
    if (patch.puffleVariant !== undefined) {
      const key = String(patch.puffleVariant || '');
      const known = typeof window !== 'undefined' && window.LUMI_PUFFLE_VARIANTS && window.LUMI_PUFFLE_VARIANTS[key];
      const creature = s.form && typeof EVOLUTION_FORMS !== 'undefined' && EVOLUTION_FORMS[s.form] ? EVOLUTION_FORMS[s.form].creature : null;
      const creatureKey = creature && typeof cpCreatureStyleKey === 'function' ? cpCreatureStyleKey(s.form, key) : null;
      if (creatureKey) s.puffleVariant = creatureKey;
      else if (creature) s.puffleVariant = `pc_${creature}`;
      else s.puffleVariant = known ? key : 'common';
      recordCreatureCoat(s);
    }
    /* Wardrobe slot for the baked Lumi garment (0-2). */
    if (patch.garment !== undefined) {
      const slot = Number(patch.garment);
      s.garment = Number.isInteger(slot) ? Math.max(0, Math.min(5, slot)) : 0;
    }
    if (patch.palette && (PALETTES[patch.palette] || patch.palette === 'native' || patch.palette === 'custom')) {
      s.palette = patch.palette;
    }
    if (patch.custom && typeof patch.custom === 'object') {
      const clean = { ...(s.custom || {}) };
      ['body', 'light', 'deep', 'accent', 'belly'].forEach((k) => {
        const hex = safeHexColor(patch.custom[k], null);
        if (hex) clean[k] = hex;
      });
      s.custom = Object.keys(clean).length ? clean : null;
      if (s.custom) s.palette = 'custom';
    }
    if (patch.fur !== undefined) {
      if (patch.fur === null) delete s.fur;
      else if (typeof FUR_STYLES !== 'undefined' && FUR_STYLES[patch.fur] && (typeof furUnlocked !== 'function' || furUnlocked(patch.fur))) s.fur = patch.fur;
    }
    if (patch.hue !== undefined) {
      const hue = Math.round(Number(patch.hue));
      if (Number.isFinite(hue)) s.hue = ((hue % 360) + 360) % 360;
    }
    if (patch.head && typeof HEAD_SHAPES !== 'undefined' && HEAD_SHAPES[patch.head]) s.head = patch.head;
    if (patch.shape && typeof BODY_SHAPES !== 'undefined' && BODY_SHAPES[patch.shape]) s.shape = patch.shape;
    if (patch.ears && typeof EAR_STYLES !== 'undefined' && EAR_STYLES[patch.ears]) s.ears = patch.ears;
    if (patch.wings !== undefined) {
      if (patch.wings === null || patch.wings === 'breed') delete s.wings;
      else if (typeof WING_STYLES !== 'undefined' && WING_STYLES[patch.wings]) s.wings = patch.wings;
    }
    if (patch.wingColor !== undefined) {
      const wing = safeHexColor(patch.wingColor, null);
      if (wing) s.wingColor = wing; else delete s.wingColor;
    }
    if (patch.furTip !== undefined) {
      const fTip = safeHexColor(patch.furTip, null);
      if (fTip) s.furTip = fTip; else delete s.furTip;
    }
    if (patch.furAccent !== undefined) {
      const fAcc = safeHexColor(patch.furAccent, null);
      if (fAcc) s.furAccent = fAcc; else delete s.furAccent;
    }
    if (patch.furCover !== undefined) {
      const fCover = Number(patch.furCover);
      if (Number.isFinite(fCover)) s.furCover = Math.round(clamp(fCover, 0, 100));
    }
    if (patch.hair && typeof HAIR_STYLES !== 'undefined' && HAIR_STYLES[patch.hair]) s.hair = patch.hair;
    if (patch.hat && typeof HAT_STYLES !== 'undefined' && HAT_STYLES[patch.hat]) s.hat = patch.hat;
    if (patch.scarf && typeof SCARF_STYLES !== 'undefined' && SCARF_STYLES[patch.scarf]) s.scarf = patch.scarf;
    if (patch.arms && typeof ARM_STYLES !== 'undefined' && ARM_STYLES[patch.arms]) s.arms = patch.arms;
    if (patch.legs && typeof LEG_STYLES !== 'undefined' && LEG_STYLES[patch.legs]) s.legs = patch.legs;
    if (patch.eyes !== undefined) {
      if (patch.eyes === null || patch.eyes === 'breed') delete s.eyes;
      else if (typeof EYE_STYLES !== 'undefined' && EYE_STYLES[patch.eyes]) s.eyes = patch.eyes;
    }
    if (patch.mouth !== undefined) {
      if (patch.mouth === null || patch.mouth === 'breed') delete s.mouth;
      else if (typeof MOUTH_STYLES !== 'undefined' && MOUTH_STYLES[patch.mouth]) s.mouth = patch.mouth;
    }
    if (patch.iris !== undefined) {
      const iris = safeHexColor(patch.iris, null);
      if (iris) s.iris = iris;
      else delete s.iris;
    }
    /* A customized face gets its own generated sheet, so the chosen eyes,
       mouth and iris are drawn instead of a baked face. Clearing all three
       returns the pet to the painted atlas. */
    if (patch.eyes !== undefined || patch.mouth !== undefined || patch.iris !== undefined) {
      const hasEyes = s.eyes && s.eyes !== 'breed' && s.eyes !== 'classic' && typeof EYE_STYLES !== 'undefined' && !!EYE_STYLES[s.eyes];
      const hasMouth = s.mouth && s.mouth !== 'breed';
      if (hasEyes || hasMouth || s.iris) s.faceCustom = true;
      else delete s.faceCustom;
    }
    if (patch.nose && typeof NOSE_STYLES !== 'undefined' && NOSE_STYLES[patch.nose]) s.nose = patch.nose;
    if (patch.skin !== undefined) {
      const skin = String(patch.skin || '');
      const form = skin.indexOf('lumi:') === 0 && typeof LUMI_SHEET_FORMS !== 'undefined' && LUMI_SHEET_FORMS[skin.slice(5)] ? skin.slice(5) : null;
      s.skin = form ? `lumi:${form}` : null;
      state.lumiSkins = state.lumiSkins && typeof state.lumiSkins === 'object' ? state.lumiSkins : {};
      if (form) state.lumiSkins[s.id] = form;
      else delete state.lumiSkins[s.id];
    }
    if (patch.pattern && PATTERNS[patch.pattern]) s.pattern = patch.pattern;
    if (patch.accessory && ACCESSORIES[patch.accessory]) s.accessory = patch.accessory;
    if (patch.breed && BREEDS[patch.breed] && s.stage !== 'egg') s.breed = patch.breed;
    if (patch.element && ELEMENTS[patch.element] && s.stage !== 'egg') {
      s.element = patch.element;
      s.hybrid = null;
      s.hybridParents = null;
    }
    commit('customize', { spriteId: id });
  },

  /* Saves the family-sheet look on one sprite. Style and cosmetic use the same
     per-sprite fields as the Studio; finish is guarded by the permanent
     ownership rule above. */
  applyPuffleLook(id, look = {}) {
    const sprite = findSprite(id);
    if (!sprite || sprite.stage === 'egg') return { ok: false, reason: 'sprite' };
    const next = {};
    if (look.puffleVariant !== undefined) {
      const key = String(look.puffleVariant || '');
      const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
      /* Creature coats live outside the Sprite Puffle style table. */
      const creatureKey = typeof cpCreatureStyleKey === 'function' ? cpCreatureStyleKey(sprite.form, key) : null;
      if (!creatureKey && (!table || !table[key])) return { ok: false, reason: 'style' };
      next.puffleVariant = creatureKey || key;
    }
    if (look.accessory !== undefined) {
      const key = String(look.accessory || 'none');
      if (key !== 'none' && !ACCESSORIES[key]) return { ok: false, reason: 'accessory' };
      next.accessory = key;
    }
    if (look.finish !== undefined) {
      const key = String(look.finish || '');
      if (key && !FINISHES[key]) return { ok: false, reason: 'finish' };
      const forced = ELEMENTS[sprite.element]?.forcedVariant;
      const forcedFinish = forced && FINISHES[forced] ? forced : null;
      if (forcedFinish && key !== forcedFinish) {
        return { ok: false, reason: 'forced', finish: forcedFinish };
      }
      if (key && !finishIsOwned(key)) return { ok: false, reason: 'locked', finish: key };
      next.variant = key || null;
    }
    Object.assign(sprite, next);
    recordCreatureCoat(sprite);
    commit('puffleLook', { spriteId: id, ...next });
    return { ok: true, sprite, look: { ...next } };
  },

  /* Wears a whole matching look: the custom outfit carries the set's colours,
     while sprite.wardrobeLook remembers which collection and effects are on.
     `target` dresses the Sprite, the Puffle or both; each half keeps its own
     cloth and piece list, so a matching set really is two outfits. */
  wearLook(data = {}) {
    const sprite = findSprite(data.spriteId) || activeSprite();
    if (!sprite || sprite.stage === 'egg') return { ok: false, reason: 'sprite' };
    const target = data.target === 'puffle' || data.target === 'both' ? data.target : 'sprite';
    const name = String(data.name || 'Look').trim().slice(0, 24) || 'Look';
    const payload = {
      name,
      style: CUSTOM_CLOTH_STYLES[data.style] ? data.style : 'cape',
      pattern: CUSTOM_CLOTH_PATTERNS[data.pattern] ? data.pattern : 'plain',
      primary: safeHexColor(data.primary, BRAND.accent),
      secondary: safeHexColor(data.secondary, BRAND.gold),
      stitch: 'medium',
    };
    let cloth = null;
    if (target !== 'puffle') {
      cloth = (state.customClothes || []).find((entry) => entry.name.toLowerCase() === name.toLowerCase()) || null;
      if (cloth) {
        const updated = Actions.updateCustomClothes(cloth.id, payload);
        if (!updated.ok) return updated;
        cloth = updated.cloth;
      } else {
        const made = Actions.addCustomClothes(payload);
        if (!made.ok) return made;
        cloth = made.cloth;
      }
      sprite.outfit = cloth.id;
      sprite.wardrobeLook = {
        setId: data.setId || null,
        pieces: Array.isArray(data.pieces) ? data.pieces.filter((piece) => typeof piece === 'string').slice(0, 16) : [],
        colors: {
          primary: payload.primary,
          secondary: payload.secondary,
          glow: safeHexColor(data.glow, '#bde8ff'),
          particle: safeHexColor(data.particle, '#ffe58a'),
        },
        effects: Array.isArray(data.effects) ? data.effects.slice(0, 12) : [],
        photo: data.photo || null,
        at: Date.now(),
      };
    }
    let puffleCloth = null;
    if (target !== 'sprite') {
      const puffle = data.puffle && typeof data.puffle === 'object' ? data.puffle : {};
      const puffleName = String(puffle.name || `${name} Pufflea`).trim().slice(0, 24) || `${name} Pufflea`;
      const pufflePayload = {
        name: puffleName,
        style: CUSTOM_CLOTH_STYLES[puffle.style] ? puffle.style : payload.style,
        pattern: CUSTOM_CLOTH_PATTERNS[puffle.pattern] ? puffle.pattern : payload.pattern,
        primary: safeHexColor(puffle.primary, payload.secondary),
        secondary: safeHexColor(puffle.secondary, payload.primary),
        stitch: 'medium',
      };
      puffleCloth = (state.customClothes || []).find((entry) => entry.name.toLowerCase() === puffleName.toLowerCase()) || null;
      if (puffleCloth) {
        const updated = Actions.updateCustomClothes(puffleCloth.id, pufflePayload);
        if (!updated.ok) return updated;
        puffleCloth = updated.cloth;
      } else {
        const made = Actions.addCustomClothes(pufflePayload);
        if (!made.ok) return made;
        puffleCloth = made.cloth;
      }
      sprite.puffleOutfit = puffleCloth.id;
      sprite.puffleWardrobeLook = normalizePuffleLook({
        setId: data.setId || puffle.setId || null,
        name: puffleName,
        clothId: puffleCloth.id,
        style: pufflePayload.style,
        pattern: pufflePayload.pattern,
        colors: {
          primary: pufflePayload.primary,
          secondary: pufflePayload.secondary,
        },
        effects: Array.isArray(puffle.effects) ? puffle.effects : data.effects,
        pieces: Array.isArray(puffle.pieces) ? puffle.pieces : [],
        at: Date.now(),
      });
    }
    commit('wardrobeLook', { spriteId: sprite.id, clothId: cloth ? cloth.id : null, puffleClothId: puffleCloth ? puffleCloth.id : null, target });
    return { ok: true, cloth, puffleCloth, spriteId: sprite.id, target };
  },

  saveLook(data = {}) {
    const look = normalizeLook({ ...data, id: uid('look'), createdAt: Date.now() });
    if (!look.name) return { ok: false, reason: 'name' };
    state.looks = state.looks || [];
    state.looks.unshift(look);
    state.looks = state.looks.slice(0, 40);
    commit('look', { id: look.id });
    return { ok: true, look };
  },

  /* One tap: clothes, colours, effects and the home theme the look was saved in. */
  applyLook(id) {
    const look = (state.looks || []).find((entry) => entry.id === id);
    if (!look) return { ok: false, reason: 'missing' };
    /* A saved mixed look follows the builder's pair rule even when no Pufflea
       pieces were saved: wearing it always replaces the companion's outfit,
       so an older collection cannot remain on the other half. */
    const mixed = look.setId === 'mixed';
    const paired = !!look.puffle || mixed;
    const worn = Actions.wearLook({
      spriteId: look.spriteId || state.activeId,
      name: look.name,
      style: look.style,
      pattern: look.pattern,
      primary: look.colors.primary,
      secondary: look.colors.secondary,
      glow: look.colors.glow,
      particle: look.colors.particle,
      effects: look.effects,
      setId: look.setId,
      pieces: Array.isArray(look.pieces) ? look.pieces : [],
      puffle: look.puffle ? {
        name: look.puffle.name,
        style: look.puffle.style,
        pattern: look.puffle.pattern,
        primary: look.puffle.colors.primary,
        secondary: look.puffle.colors.secondary,
        effects: look.puffle.effects,
        pieces: look.puffle.pieces,
        setId: look.puffle.setId,
      } : mixed ? {
        setId: 'mixed',
        name: 'Mixed Pufflea',
        style: look.style,
        pattern: look.pattern,
        primary: look.colors.secondary,
        secondary: look.colors.primary,
        effects: look.effects,
        pieces: [],
      } : null,
      target: paired ? 'both' : 'sprite',
      photo: look.photo,
    });
    if (!worn.ok) return worn;
    /* A Sprite-only saved look still clears the companion's old wardrobe, so
       applying it can never leave the pair split across collections. */
    if (!paired) {
      const paired = findSprite(worn.spriteId || look.spriteId || state.activeId) || activeSprite();
      if (paired) {
        paired.puffleOutfit = null;
        paired.puffleWardrobeLook = null;
      }
    }
    if (look.scene && SCENES[look.scene]) state.theme.scene = look.scene;
    if (look.weather === 'off' || (look.weather && typeof WEATHERS !== 'undefined' && WEATHERS[look.weather])) {
      state.world.weather = look.weather;
    }
    commit('lookApplied', { id: look.id, spriteId: worn.spriteId });
    return { ok: true, look, ...worn };
  },

  deleteLook(id) {
    const before = (state.looks || []).length;
    state.looks = (state.looks || []).filter((look) => look.id !== id);
    if (state.looks.length === before) return { ok: false, reason: 'missing' };
    commit('look', { removed: id });
    return { ok: true };
  },

  addCustomClothes(data = {}) {
    const name = String(data.name || '').trim();
    if (!name) return { ok: false, reason: 'name' };
    const cloth = normalizeCustomCloth({ ...data, id: uid('cloth') });
    state.customClothes = state.customClothes || [];
    state.customClothes.unshift(cloth);
    commit('customClothes', { id: cloth.id });
    return { ok: true, cloth };
  },

  /* A copy is a full outfit of its own, named "<name> copy" (or "copy 2",
     "copy 3"…) so two variations of one design never share a name. */
  duplicateCustomClothes(id) {
    const source = (state.customClothes || []).find((cloth) => cloth.id === id);
    if (!source) return { ok: false, reason: 'missing' };
    const taken = new Set((state.customClothes || []).map((cloth) => cloth.name.toLowerCase()));
    /* Trim the source rather than the suffix, so a 24-character name still
       produces distinct copies instead of two identical "…copy" rows. */
    const named = (n) => {
      const suffix = n === 1 ? ' copy' : ` copy ${n}`;
      return `${source.name.slice(0, Math.max(1, 24 - suffix.length))}${suffix}`.trim();
    };
    let name = named(1);
    for (let n = 2; taken.has(name.toLowerCase()) && n < 100; n++) name = named(n);
    const cloth = normalizeCustomCloth({ ...source, id: uid('cloth'), name, createdAt: Date.now() });
    state.customClothes.unshift(cloth);
    commit('customClothes', { id: cloth.id, duplicated: id });
    return { ok: true, cloth };
  },

  /* Restyling keeps the id, so every sprite already wearing the outfit picks
     the change up without being re-dressed. */
  updateCustomClothes(id, data = {}) {
    const index = (state.customClothes || []).findIndex((cloth) => cloth.id === id);
    if (index < 0) return { ok: false, reason: 'missing' };
    const name = String(data.name ?? '').trim();
    if (!name) return { ok: false, reason: 'name' };
    const before = state.customClothes[index];
    const cloth = normalizeCustomCloth({ ...before, ...data, id: before.id, createdAt: before.createdAt });
    state.customClothes[index] = cloth;
    commit('customClothes', { id: cloth.id, updated: true });
    return { ok: true, cloth };
  },

  wearCustomClothes(spriteId, id) {
    const s = findSprite(spriteId);
    if (!s) return { ok: false, reason: 'missing' };
    if (id && !customClothFor(id)) return { ok: false, reason: 'missing' };
    s.outfit = id || null;
    commit('outfit', { spriteId });
    return { ok: true, outfit: s.outfit };
  },

  deleteCustomClothes(id) {
    const before = (state.customClothes || []).length;
    state.customClothes = (state.customClothes || []).filter((cloth) => cloth.id !== id);
    if (state.customClothes.length === before) return { ok: false, reason: 'missing' };
    state.sprites.forEach((sprite) => {
      if (sprite.outfit === id) sprite.outfit = null;
    });
    commit('customClothes', { removed: id });
    return { ok: true };
  },

  addCustomScene(data = {}) {
    const name = String(data.name || '').trim();
    if (!name) return { ok: false, reason: 'name' };
    const scene = normalizeCustomScene({ ...data, id: uid('scene') });
    registerCustomScene(scene);
    /* The new scene joins the ring, so its two neighbour transitions are built
       now rather than on the first travel into it. */
    if (typeof syncSceneTransitions === 'function') syncSceneTransitions();
    state.customScenes = state.customScenes || [];
    state.customScenes.unshift(scene);
    state.unlockedScenes = Array.from(new Set([...(state.unlockedScenes || []), scene.id]));
    if (data.travel !== false) state.theme.scene = scene.id;
    commit('customScene', { id: scene.id });
    return { ok: true, scene };
  },

  deleteCustomScene(id) {
    const before = (state.customScenes || []).length;
    state.customScenes = (state.customScenes || []).filter((scene) => scene.id !== id);
    if (state.customScenes.length === before) return { ok: false, reason: 'missing' };
    state.unlockedScenes = (state.unlockedScenes || []).filter((key) => key !== id);
    unregisterCustomScene(id);
    if (state.theme.scene === id) state.theme.scene = 'grove';
    commit('customScene', { removed: id });
    return { ok: true };
  },

  rename(id, name) {
    const s = findSprite(id);
    if (!s) return;
    applySpriteName(s, name);
    commit('rename', { spriteId: id });
  },

  saveFramePreset(data = {}) {
    const frame = state.theme.frame && typeof state.theme.frame === 'object' ? state.theme.frame : {};
    const presets = normalizeFramePresets(frame.presets);
    const name = String(data.name || '').trim().slice(0, 24);
    if (!name) return { ok: false, reason: 'name' };
    if (presets.some((preset) => preset.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, reason: 'duplicate' };
    }
    if (presets.length >= FRAME_PRESET_LIMIT) return { ok: false, reason: 'limit' };
    const preset = normalizeFramePreset({ ...data, id: uid('frame'), name, createdAt: Date.now() });
    state.theme = { ...state.theme, frame: { ...frame, presets: [preset, ...presets] } };
    commit('framePreset', { id: preset.id });
    return { ok: true, preset, presets: state.theme.frame.presets };
  },

  renameFramePreset(id, name) {
    const frame = state.theme.frame && typeof state.theme.frame === 'object' ? state.theme.frame : {};
    const presets = normalizeFramePresets(frame.presets);
    const clean = String(name || '').trim().slice(0, 24);
    if (!clean) return { ok: false, reason: 'name' };
    const target = presets.find((preset) => preset.id === id);
    if (!target) return { ok: false, reason: 'missing' };
    if (presets.some((preset) => preset.id !== id && preset.name.toLowerCase() === clean.toLowerCase())) {
      return { ok: false, reason: 'duplicate' };
    }
    const renamed = presets.map((preset) => (preset.id === id ? { ...preset, name: clean } : preset));
    state.theme = { ...state.theme, frame: { ...frame, presets: renamed } };
    commit('framePreset', { id, action: 'rename' });
    return { ok: true, preset: renamed.find((preset) => preset.id === id), presets: renamed };
  },

  deleteFramePreset(id) {
    const frame = state.theme.frame && typeof state.theme.frame === 'object' ? state.theme.frame : {};
    const presets = normalizeFramePresets(frame.presets);
    const remaining = presets.filter((preset) => preset.id !== id);
    if (remaining.length === presets.length) return { ok: false, reason: 'missing' };
    state.theme = { ...state.theme, frame: { ...frame, presets: remaining } };
    commit('framePreset', { id });
    return { ok: true, presets: remaining };
  },

  setTheme(patch) {
    if (patch && Object.prototype.hasOwnProperty.call(patch, 'titleImage')
        && typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.titleImageLimit === 'function'
        && String(patch.titleImage || '').length > SaveIntegrity.titleImageLimit().maxStoredChars) {
      return { ok: false, reason: 'title-image-too-large' };
    }
    /* Start the content-addressed write immediately. Studio awaits the same
       promise before committing, and every other caller still falls back to
       the inline data URL if IndexedDB cannot take it. */
    if (patch && typeof patch.titleImage === 'string'
        && typeof TitleImageStore !== 'undefined' && typeof TitleImageStore.put === 'function'
        && TitleImageStore.isDataUrl(patch.titleImage)) {
      try { TitleImageStore.put(patch.titleImage).catch(() => null); } catch (err) { /* inline fallback */ }
    }
    const previousScene = state.theme && state.theme.scene;
    let travelled = false;
    state.theme = { ...state.theme, ...patch };
    if (patch.scene) {
      if (!SCENES[patch.scene]) state.theme.scene = 'grove';
      else {
        travelled = previousScene !== patch.scene;
        state.unlockedScenes = Array.from(new Set([...(state.unlockedScenes || []), patch.scene]));
        recordBiomeVisit(patch.scene);
        if (typeof biomeQuestNote === 'function') biomeQuestNote('travel');
      }
    }
    if (travelled) {
      state.stats.travels = (Number(state.stats.travels) || 0) + 1;
      addCoinsRaw(TRAVEL_COINS);
      if (previousScene && typeof queueSceneTransition === 'function') {
        queueSceneTransition(previousScene, state.theme.scene);
      }
    }
    commit('theme');
    if (travelled) return { ok: true, coins: TRAVEL_COINS, travels: state.stats.travels, scene: state.theme.scene };
    return undefined;
  },

  setHouseTint(houseId, tint) {
    if (!houseId) return { ok: false, reason: 'house' };
    const raw = typeof tint === 'string' ? tint.trim() : '';
    const clean = /^#?[0-9a-f]{6}$/i.test(raw) ? `#${raw.replace('#', '').toLowerCase()}` : null;
    state.houseTints = { ...(state.houseTints || {}) };
    if (clean) state.houseTints[houseId] = clean;
    else delete state.houseTints[houseId];
    commit('houseTint', { houseId, tint: clean });
    return { ok: true, tint: clean };
  },

  setHouseTintStrength(houseId, value) {
    if (!houseId) return { ok: false, reason: 'house' };
    const pct = Math.max(0, Math.min(100, Math.round(Number(value))));
    if (!Number.isFinite(pct)) return { ok: false, reason: 'value' };
    state.houseTintStrengths = { ...(state.houseTintStrengths || {}) };
    state.houseTintStrengths[houseId] = pct;
    commit('houseTintStrength', { houseId, strength: pct });
    return { ok: true, strength: pct };
  },

  setHome(spriteId, sceneKey) {
    const s = findSprite(spriteId);
    if (!s) return;
    state.homes = { ...(state.homes || {}) };
    if (sceneKey && SCENES[sceneKey]) state.homes[spriteId] = sceneKey;
    else delete state.homes[spriteId];
    commit('homes', { spriteId });
  },

  /* ---------- sent home & shared houses ---------- */
  sendHome(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg' || s.retired) return { ok: false, reason: 'missing' };
    if (s.atHome) return { ok: false, reason: 'home' };
    tuckIn(s, Date.now());
    if (state.activeId === id) state.activeId = awakeSprites()[0]?.id || null;
    commit('sentHome', { spriteId: id });
    return { ok: true };
  },

  /* The whole Hollow at once: every awake sprite goes home in one commit, and
     the active slot moves to whatever is left awake (or clears). */
  sendAllHome() {
    const awake = awakeSprites();
    if (!awake.length) return { ok: true, sent: 0, skipped: state.sprites.length };
    /* Remembered so one mis-tap can be taken back; only the last send. */
    lastSendHome = { ids: awake.map((s) => s.id), activeId: state.activeId };
    const now = Date.now();
    awake.forEach((s) => tuckIn(s, now));
    if (state.activeId && awake.some((s) => s.id === state.activeId)) {
      state.activeId = awakeSprites()[0]?.id || null;
    }
    commit('sentHome', { spriteId: null, all: true, count: awake.length });
    return { ok: true, sent: awake.length, skipped: state.sprites.length - awake.length };
  },

  canUndoSendAllHome() {
    return !!lastSendHome;
  },

  /* Puts the last batch back out, without restarting their timers or paying
     anything: exactly the sprites the send moved, and the slot they held. */
  undoSendAllHome() {
    const token = lastSendHome;
    if (!token) return { ok: false, reason: 'none' };
    lastSendHome = null;
    const restored = [];
    token.ids.forEach((id) => {
      const s = findSprite(id);
      if (!s || !s.atHome) return;
      s.atHome = false;
      s.homeSince = 0;
      restored.push(id);
    });
    if (!restored.length) return { ok: false, reason: 'moved' };
    if (token.activeId && findSprite(token.activeId)) state.activeId = token.activeId;
    commit('sentHome', { spriteId: state.activeId || null, undo: true, count: restored.length });
    return { ok: true, restored: restored.length, activeId: state.activeId };
  },

  callBack(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg' || s.retired) return { ok: false, reason: 'missing' };
    const coins = Math.max(0, Math.floor(Number(s.homeCoins) || 0));
    s.atHome = false;
    s.homeSince = 0;
    s.homeCoins = 0;
    if (coins) addCoinsRaw(coins);
    if (!state.activeId || !findSprite(state.activeId)) state.activeId = s.id;
    commit('sentHome', { spriteId: id, coins });
    return { ok: true, coins };
  },

  collectHome(id) {
    const s = findSprite(id);
    if (!s) return { ok: false, reason: 'missing' };
    const coins = Math.max(0, Math.floor(Number(s.homeCoins) || 0));
    if (!coins) return { ok: false, reason: 'empty' };
    s.homeCoins = 0;
    addCoinsRaw(coins);
    commit('sentHome', { spriteId: id, coins, collected: true });
    return { ok: true, coins };
  },

  homeLongSleep(id) {
    const s = findSprite(id);
    if (!s || s.stage === 'egg') return { ok: false };
    if (s.asleep) return { ok: false, reason: 'asleep' };
    const start = Date.now();
    s.asleep = true;
    s.sleepStart = start;
    s.sleepCycles = 6;
    s.sleepUntil = start + 45 * 60 * 1000;
    s.needs.joy = clamp(s.needs.joy + 4);
    addBondRaw(s, 4);
    addXpRaw(s, 6);
    bump('naps');
    state.stats.naps += 1;
    Sfx.sleep();
    commit('nap', { spriteId: id, long: true });
    return { ok: true, cycles: 6 };
  },

  shareHouse(id, otherId) {
    const a = findSprite(id);
    const b = findSprite(otherId);
    if (!a || !b || a.id === b.id || a.stage === 'egg' || b.stage === 'egg') return { ok: false, reason: 'sprite' };
    state.houses = { ...(state.houses || {}) };
    const existing = Object.values(state.houses).find((h) => (h.members || []).includes(a.id) && (h.members || []).includes(b.id));
    if (existing) return { ok: false, reason: 'together' };
    /* With the Spare Bedroom upgrade a house can hold a third member. */
    const maxBeds = typeof houseMaxMembers === 'function' ? houseMaxMembers() : 2;
    const currentHouse = Object.values(state.houses).find((h) => (h.members || []).includes(a.id));
    if (currentHouse && (currentHouse.members || []).length < maxBeds) {
      const bHouse = Object.values(state.houses).find((h) => h.id !== currentHouse.id && (h.members || []).includes(b.id));
      if (bHouse) {
        bHouse.members = (bHouse.members || []).filter((m) => m !== b.id);
        if (bHouse.members.length < 2) delete state.houses[bHouse.id];
        else bHouse.members.forEach((m) => { const member = findSprite(m); if (member) member.sharedHouse = bHouse.id; });
      }
      currentHouse.members = [...currentHouse.members, b.id];
      currentHouse.name = currentHouse.members
        .map((m) => { const member = findSprite(m); return member ? displayName(member) : ''; })
        .filter(Boolean).join(' & ');
      b.sharedHouse = currentHouse.id;
      b.atHome = true;
      b.homeSince = b.homeSince || Date.now();
      b.asleep = false;
      b.sleepUntil = 0;
      addBondRaw(a, 2);
      addBondRaw(b, 2);
      commit('houseBond', { houseId: currentHouse.id });
      return { ok: true, houseId: currentHouse.id, joined: true };
    }
    Object.keys(state.houses).forEach((key) => {
      const house = state.houses[key];
      if (!(house.members || []).includes(a.id) && !(house.members || []).includes(b.id)) return;
      house.members = (house.members || []).filter((m) => m !== a.id && m !== b.id);
      if (house.members.length < 2) delete state.houses[key];
    });
    const houseId = uid('house');
    state.houses[houseId] = {
      id: houseId,
      name: `${displayName(a)} & ${displayName(b)}`,
      scene: homeSceneFor(a),
      members: [a.id, b.id],
      bond: 0,
      milestone: 100,
      lastBondAt: 0,
      formedAt: Date.now(),
    };
    [a, b].forEach((m) => {
      m.sharedHouse = houseId;
      m.atHome = true;
      m.homeSince = m.homeSince || Date.now();
      m.asleep = false;
      m.sleepUntil = 0;
      addBondRaw(m, 3);
    });
    commit('houseBond', { houseId });
    return { ok: true, houseId };
  },

  leaveHouse(spriteId) {
    state.houses = { ...(state.houses || {}) };
    let removed = false;
    Object.entries(state.houses).forEach(([key, house]) => {
      if (!(house.members || []).includes(spriteId)) return;
      house.members = house.members.filter((m) => m !== spriteId);
      removed = true;
      const left = findSprite(spriteId);
      if (left) left.sharedHouse = null;
      if (house.members.length < 2) {
        delete state.houses[key];
        /* The house no longer exists: drop its stored looks so the save doesn't grow dead keys. */
        ['houseTints', 'houseTintStrengths'].forEach((field) => {
          if (state[field] && key in state[field]) {
            state[field] = { ...state[field] };
            delete state[field][key];
          }
        });
      } else house.members.forEach((m) => { const member = findSprite(m); if (member) member.sharedHouse = key; });
    });
    if (!removed) return { ok: false, reason: 'missing' };
    commit('houseBond', { spriteId });
    return { ok: true };
  },

  buyHomeUpgrade(id) {
    const up = typeof HOME_UPGRADES !== 'undefined' ? HOME_UPGRADES[id] : null;
    if (!up) return { ok: false, reason: 'missing' };
    state.homeUpgrades = { ...(state.homeUpgrades || {}) };
    if (state.homeUpgrades[id]) return { ok: false, reason: 'owned' };
    if (up.requires && !state.homeUpgrades[up.requires]) return { ok: false, reason: 'requires', missing: up.requires };
    if (state.coins < up.price) return { ok: false, reason: 'coins', need: up.price - state.coins };
    state.coins -= up.price;
    state.stats.spent = (state.stats.spent || 0) + up.price;
    state.homeUpgrades[id] = true;
    commit('homeUpgrade', { id, price: up.price });
    return { ok: true, upgrade: up };
  },


  buySpeciesHomeTier(spriteId, tierId) {
    const s = findSprite(spriteId);
    const def = typeof speciesHomeDef === 'function' ? speciesHomeDef(s && s.element) : null;
    if (!s || !def) return { ok: false, reason: 'sprite' };
    const index = def.tiers.findIndex((t) => t.id === tierId);
    if (index < 0) return { ok: false, reason: 'missing' };
    const rec = { tier: def.tiers[0].id, taps: {}, ...(state.speciesHomes?.[spriteId] || {}) };
    if (def.tiers.findIndex((t) => t.id === rec.tier) < 0) rec.tier = def.tiers[0].id;
    const owned = Math.max(0, def.tiers.findIndex((t) => t.id === rec.tier));
    if (index <= owned) return { ok: false, reason: 'owned' };
    if (index !== owned + 1) return { ok: false, reason: 'requires' };
    const tier = def.tiers[index];
    if (state.coins < tier.price) return { ok: false, reason: 'coins', need: tier.price - state.coins };
    state.coins -= tier.price;
    state.stats.spent = (state.stats.spent || 0) + tier.price;
    state.speciesHomes = { ...(state.speciesHomes || {}), [spriteId]: { ...rec, tier: tier.id } };
    commit('speciesHome', { spriteId, element: s.element, tier: tier.id, price: tier.price });
    return { ok: true, tier };
  },

  tapSpeciesHome(spriteId, tapId) {
    const s = findSprite(spriteId);
    const def = typeof speciesHomeDef === 'function' ? speciesHomeDef(s && s.element) : null;
    if (!s || !def) return { ok: false, reason: 'sprite' };
    if (!s.atHome) return { ok: false, reason: 'home' };
    const tap = def.taps[tapId];
    if (!tap) return { ok: false, reason: 'missing' };
    const rec = { tier: def.tiers[0].id, taps: {}, ...(state.speciesHomes?.[spriteId] || {}) };
    rec.taps = { ...(rec.taps || {}) };
    if (def.tiers.findIndex((t) => t.id === rec.tier) < 0) rec.tier = def.tiers[0].id;
    const left = Math.max(0, (Number(rec.taps[tapId]) || 0) + tap.cooldown - Date.now());
    if (left > 0) return { ok: false, reason: 'cooldown', wait: left };
    const tier = def.tiers.find((t) => t.id === rec.tier) || def.tiers[0];
    const garden = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('garden', s) : 1;
    const coins = Math.round((Number(tier.tapCoins) || 10) * (tap.coins || 1) * garden);
    addCoinsRaw(coins);
    s.needs.hunger = clamp(s.needs.hunger + (tap.hunger || 0));
    s.needs.joy = clamp(s.needs.joy + (tap.joy || 0));
    if (tap.xp) addXpRaw(s, tap.xp);
    addBondRaw(s, 1);
    state.stats.games = (state.stats.games || 0) + 1;
    rec.taps[tapId] = Date.now();
    state.speciesHomes = { ...(state.speciesHomes || {}), [spriteId]: rec };
    commit('speciesHomeTap', { spriteId, tapId, element: s.element, coins });
    return { ok: true, coins, name: tap.name, hunger: tap.hunger || 0, joy: tap.joy || 0 };
  },

  /* Legacy entry points used by the first slice. */
  buyLeafHomeTier(spriteId, tierId) { return this.buySpeciesHomeTier(spriteId, tierId); },
  tapLeafHome(spriteId, tapId) { return this.tapSpeciesHome(spriteId, tapId); },

  toggleFurnitureFavorite(id) {
    if (typeof HOME_UPGRADES === 'undefined') return { ok: false, reason: 'missing' };
    const free = typeof freeDecorPiece === 'function' ? freeDecorPiece(id) : null;
    if (!HOME_UPGRADES[id] && !free) return { ok: false, reason: 'missing' };
    const list = Array.isArray(state.furnitureFavorites) ? state.furnitureFavorites.slice() : [];
    const at = list.indexOf(id);
    if (at >= 0) list.splice(at, 1); else list.push(id);
    state.furnitureFavorites = list;
    commit('furnitureFavorite', { id, favorite: at < 0 });
    return { ok: true, favorite: at < 0 };
  },

  setRoomTheme(id) {
    if (typeof HOME_ROOM_THEME_KEYS === 'undefined' || !HOME_ROOM_THEME_KEYS.includes(id)) return { ok: false, reason: 'missing' };
    state.roomTheme = id;
    commit('roomTheme', { id });
    return { ok: true, id };
  },

  openGuardianVault(doorId) {
    const door = typeof guardianVaultDoor === 'function' ? guardianVaultDoor(doorId) : null;
    if (!door) return { ok: false, reason: 'missing' };
    state.vaultDoors = Array.isArray(state.vaultDoors) ? state.vaultDoors.slice() : [];
    if (state.vaultDoors.includes(door.id)) return { ok: false, reason: 'opened' };
    const travels = typeof guardianVaultTravels === 'function' ? guardianVaultTravels() : 0;
    if (travels < door.travels) return { ok: false, reason: 'travels', need: door.travels - travels };
    state.vaultDoors.push(door.id);
    const sprite = typeof unlockSecretRaw === 'function' ? unlockSecretRaw(door.secret) : null;
    if (door.coins) addCoinsRaw(door.coins);
    commit('guardianVault', { id: door.id, coins: door.coins || 0 });
    return { ok: true, coins: door.coins || 0, secret: sprite ? sprite.name : null, spriteId: sprite ? sprite.id : null };
  },

  /* A Hollow Eclipse bout is its own credit path: bond, joy and XP, a per-enemy
     purification count, and nothing on the guardian record or the Season Charge. */
  purifyEnemy(enemyId) {
    const enemy = typeof SPRITE_HOLLOW_VOICES !== 'undefined' && Array.isArray(SPRITE_HOLLOW_VOICES)
      ? SPRITE_HOLLOW_VOICES.find((entry) => entry.enemy && entry.id === enemyId) || null
      : null;
    if (!enemy) return { ok: false, reason: 'enemy' };
    const s = typeof activeSprite === 'function' ? activeSprite() : null;
    if (s) {
      s.needs.joy = clamp(s.needs.joy + 12);
      addBondRaw(s, 3);
      addXpRaw(s, 8);
    }
    state.enemiesPurified = { ...(state.enemiesPurified || {}) };
    const total = (Number(state.enemiesPurified[enemyId]) || 0) + 1;
    state.enemiesPurified[enemyId] = total;
    state.stats.purified = (Number(state.stats.purified) || 0) + 1;
    commit('purify', { enemy: enemyId, total });
    return { ok: true, bond: 3, joy: 12, xp: 8, total, enemy };
  },

  guardianWin(sceneKey, guardianKey) {
    if (typeof ELEMENTS === 'undefined' || !ELEMENTS[guardianKey]) return { ok: false, reason: 'guardian' };
    const s = typeof activeSprite === 'function' ? activeSprite() : null;
    if (s) {
      s.needs.joy = clamp(s.needs.joy + 12);
      addBondRaw(s, 3);
      addXpRaw(s, 8);
    }
    state.guardiansBeaten = { ...(state.guardiansBeaten || {}) };
    const total = (Number(state.guardiansBeaten[guardianKey]) || 0) + 1;
    state.guardiansBeaten[guardianKey] = total;
    state.stats.duels = (Number(state.stats.duels) || 0) + 1;
    const eventEggs = typeof addSeasonChargeRaw === 'function' ? addSeasonChargeRaw(1) : [];
    state.customGuardians = Array.isArray(state.customGuardians) ? state.customGuardians.slice() : [];
    const wins = Object.values(state.guardiansBeaten).reduce((sum, n) => sum + (Number(n) || 0), 0);
    const unlocked = [];
    if (typeof customGuardianUnlocksFor === 'function') {
      customGuardianUnlocksFor(wins).forEach((key) => {
        if (state.customGuardians.includes(key)) return;
        state.customGuardians.push(key);
        unlocked.push(key);
      });
      if (unlocked.length && typeof syncCustomGuardians === 'function') syncCustomGuardians(state.customGuardians);
    }
    commit('guardian', { scene: sceneKey, guardian: guardianKey, total, unlocked: unlocked.length, eventEggs: eventEggs.length });
    return { ok: true, bond: 3, joy: 12, xp: 8, total, unlocked, eventEggs, season: seasonChargeInfo() };
  },

  setRoomPiece(id, patch = {}) {
    if (typeof HOME_UPGRADES === 'undefined') return { ok: false, reason: 'missing' };
    const free = typeof freeDecorPiece === 'function' ? freeDecorPiece(id) : null;
    if (!HOME_UPGRADES[id] && !free) return { ok: false, reason: 'missing' };
    state.roomLayout = { ...(state.roomLayout || {}) };
    const cur = state.roomLayout[id] || {};
    const next = {
      spot: patch.spot != null ? Math.max(0, Math.min(2, Math.round(Number(patch.spot) || 0))) : Math.max(0, Math.min(2, Math.round(Number(cur.spot) || 0))),
      hidden: patch.hidden != null ? !!patch.hidden : !!cur.hidden,
    };
    state.roomLayout[id] = next;
    commit('roomLayout', { id, ...next });
    return { ok: true, ...next };
  },

  /* A preset snapshots every piece's spot and tucked-away state, so applying
     one restores the whole room rather than merging into the current layout. */
  saveRoomPreset(name, opts = {}) {
    const layout = {};
    Object.entries(state.roomLayout && typeof state.roomLayout === 'object' ? state.roomLayout : {}).forEach(([id, raw]) => {
      if (!/^[a-z][a-zA-Z0-9_]{1,30}$/.test(id) || !raw || typeof raw !== 'object') return;
      layout[id] = {
        spot: Math.max(0, Math.min(2, Math.round(Number(raw.spot) || 0))),
        hidden: !!raw.hidden,
      };
    });
    if (!Object.keys(layout).length) return { ok: false, reason: 'empty' };
    const presets = Array.isArray(state.roomPresets) ? state.roomPresets.slice() : [];
    const trimmed = typeof name === 'string' ? name.trim().slice(0, 24) : '';
    /* Overwriting keeps the slot (and its name) and swaps the snapshot, so a
       room can be re-saved under an existing layout instead of running out of
       the eight slots. */
    const overwriteId = opts && typeof opts.overwriteId === 'string' ? opts.overwriteId : '';
    if (overwriteId) {
      const index = presets.findIndex((entry) => entry && entry.id === overwriteId);
      if (index < 0) return { ok: false, reason: 'missing' };
      const existing = presets[index];
      const preset = { ...existing, name: trimmed || existing.name, savedAt: Date.now(), layout };
      presets[index] = preset;
      state.roomPresets = presets;
      commit('roomPresetOverwrite', { id: preset.id, pieces: Object.keys(layout).length });
      return { ok: true, preset, overwrote: true };
    }
    if (presets.length >= 8) return { ok: false, reason: 'full' };
    const preset = {
      id: `preset_${Date.now().toString(36)}`,
      name: trimmed || `Layout ${presets.length + 1}`,
      savedAt: Date.now(),
      layout,
    };
    state.roomPresets = [...presets, preset];
    commit('roomPresetSave', { id: preset.id, pieces: Object.keys(layout).length });
    return { ok: true, preset };
  },

  renameRoomPreset(id, name) {
    const trimmed = typeof name === 'string' ? name.trim().slice(0, 24) : '';
    if (!trimmed) return { ok: false, reason: 'empty' };
    const presets = Array.isArray(state.roomPresets) ? state.roomPresets.slice() : [];
    const index = presets.findIndex((entry) => entry && entry.id === id);
    if (index < 0) return { ok: false, reason: 'missing' };
    presets[index] = { ...presets[index], name: trimmed };
    state.roomPresets = presets;
    commit('roomPresetRename', { id, name: trimmed });
    return { ok: true, preset: presets[index] };
  },

  applyRoomPreset(id) {
    const preset = (Array.isArray(state.roomPresets) ? state.roomPresets : []).find((entry) => entry && entry.id === id);
    if (!preset) return { ok: false, reason: 'missing' };
    const layout = {};
    Object.entries(preset.layout && typeof preset.layout === 'object' ? preset.layout : {}).forEach(([pieceId, raw]) => {
      if (!/^[a-z][a-zA-Z0-9_]{1,30}$/.test(pieceId) || !raw || typeof raw !== 'object') return;
      layout[pieceId] = {
        spot: Math.max(0, Math.min(2, Math.round(Number(raw.spot) || 0))),
        hidden: !!raw.hidden,
      };
    });
    state.roomLayout = layout;
    commit('roomPresetApply', { id, pieces: Object.keys(layout).length });
    return { ok: true, preset };
  },

  deleteRoomPreset(id) {
    const presets = Array.isArray(state.roomPresets) ? state.roomPresets : [];
    const next = presets.filter((entry) => entry && entry.id !== id);
    if (next.length === presets.length) return { ok: false, reason: 'missing' };
    state.roomPresets = next;
    commit('roomPresetDelete', { id });
    return { ok: true };
  },

  housePlay(houseId, activity = 'chase', score = 0) {
    const house = state.houses && state.houses[houseId];
    if (!house) return { ok: false, reason: 'missing' };
    const members = (house.members || []).map((id) => findSprite(id)).filter((m) => m && m.stage !== 'egg');
    if (members.length < 2) return { ok: false, reason: 'members' };
    if (Date.now() - (Number(house.lastPlayAt) || 0) < 45 * 1000) return { ok: false, reason: 'cooling' };
    house.lastPlayAt = Date.now();
    const mult = typeof homeHangoutMult === 'function' ? homeHangoutMult() : 1;
    const hits = clamp(Math.round(Number(score) || 0), 0, 30);
    const bondGain = Math.round((5 + hits) * mult);
    const cap = typeof HOUSE_BOND_MAX === 'number' ? HOUSE_BOND_MAX : 600;
    house.bond = Math.min(cap, (Number(house.bond) || 0) + bondGain);
    members.forEach((m) => {
      addBondRaw(m, 2.5 * mult);
      addXpRaw(m, 4);
      m.needs.joy = clamp(m.needs.joy + 10);
    });
    const coins = 8 + Math.floor(hits / 2);
    addCoinsRaw(coins);
    state.stats.games = (Number(state.stats.games) || 0) + 1;
    const storyChapters = syncHouseStory(house);
    commit('houseBond', { houseId, activity, score: hits, storyChapters: storyChapters.length });
    return { ok: true, bond: bondGain, coins, joy: 10, score: hits, names: members.map((m) => displayName(m)).join(' & '), storyChapters };
  },

  claimBiomeQuest(sceneKey, opts = {}) {
    const def = typeof BIOME_QUESTS !== 'undefined' ? BIOME_QUESTS[sceneKey] : null;
    if (!def) return { ok: false, reason: 'missing' };
    const info = typeof biomeQuestStep === 'function' ? biomeQuestStep(sceneKey) : null;
    if (!info) return { ok: false, reason: 'done' };
    const q = biomeQuestState(sceneKey);
    const have = Math.min(info.step.need, Math.max(0, Number(q.progress) || 0));
    if (have < info.step.need) return { ok: false, reason: 'progress', need: info.step.need - have };
    const finalStep = info.index >= def.steps.length - 1;
    if (finalStep && !opts.won && !q.beaten) return { ok: false, reason: 'guardian' };
    const reward = info.step.reward || {};
    const coins = Math.max(0, Math.floor(Number(reward.coins) || 0));
    const bonus = opts.won ? 150 : 0;
    if (bonus) addCoinsRaw(bonus);
    if (coins) addCoinsRaw(coins);
    const target = (typeof activeSprite === 'function' ? activeSprite() : null)
      || (typeof sentHomeSprites === 'function' ? sentHomeSprites()[0] : null);
    if (target) {
      if (reward.xp) addXpRaw(target, reward.xp);
      if (reward.bond) addBondRaw(target, reward.bond);
    }
    const nextStep = info.index + 1;
    const finished = nextStep >= def.steps.length;
    /* A finished region leaves a relic with the family that walked it, on top of
       the quest's own coins and XP. */
    let relic = null;
    if (finished && target && typeof window.puffleRelicFor === 'function') {
      const entry = window.puffleRelicFor(target);
      if (entry) {
        const relicCoins = Math.max(0, Math.floor(Number(entry.coins) || 0));
        if (relicCoins) addCoinsRaw(relicCoins);
        addBondRaw(target, Math.max(0, Number(entry.bond) || 0));
        relic = { item: entry.item, line: entry.line, coins: relicCoins, sprite: displayName(target) };
      }
    }
    state.biomeQuests = { ...(state.biomeQuests || {}) };
    state.biomeQuests[sceneKey] = { step: finished ? def.steps.length : nextStep, progress: 0, done: finished, beaten: finalStep ? true : !!q.beaten };
    if (finished) state.stats.quests = (Number(state.stats.quests) || 0) + 1;
    const eventEggs = finished && typeof addSeasonChargeRaw === 'function' ? addSeasonChargeRaw(1) : [];
    commit('biomeQuest', { scene: sceneKey, finished, coins, eventEggs: eventEggs.length });
    return { ok: true, coins, bonus, xp: reward.xp || 0, finished, title: def.title, eventEggs, relic, season: seasonChargeInfo() };
  },

  bondHouse(houseId) {
    const house = state.houses && state.houses[houseId];
    if (!house) return { ok: false, reason: 'missing' };
    const members = (house.members || []).map((id) => findSprite(id)).filter(Boolean);
    if (members.length < 2) return { ok: false, reason: 'members' };
    if (Date.now() - (Number(house.lastBondAt) || 0) < 30 * 60 * 1000) return { ok: false, reason: 'cooling' };
    house.lastBondAt = Date.now();
    const cap = typeof HOUSE_BOND_MAX === 'number' ? HOUSE_BOND_MAX : 600;
    house.bond = Math.min(cap, (Number(house.bond) || 0) + 8);
    members.forEach((m) => {
      addBondRaw(m, 3);
      m.needs.joy = clamp(m.needs.joy + 6);
    });
    addCoinsRaw(6);
    const storyChapters = syncHouseStory(house);
    commit('houseBond', { houseId, storyChapters: storyChapters.length });
    return { ok: true, bond: 8, coins: 6, names: members.map((m) => displayName(m)).join(' & '), storyChapters };
  },

  setClimate(key) {
    if (!CLIMATES[key]) return;
    state.world = { ...(state.world || {}), climate: key };
    commit('world', { climate: key });
  },

  setWeather(key) {
    /* 'off' is a real choice, not Auto: it keeps the climate and season but
       suppresses every weather effect until a sky is picked again. */
    const weather = key === 'off' ? 'off' : key && WEATHERS[key] ? key : null;
    /* Picking a sky by hand ends the event that was tinting the stage. */
    state.world = { ...(state.world || {}), weather, eventPreset: null };
    commit('world', { weather, eventPreset: null });
    return { ok: true, weather };
  },

  applyEventPreset(key) {
    const preset = key && typeof EVENT_PRESETS !== 'undefined' ? EVENT_PRESETS[key] : null;
    if (!preset) return { ok: false, reason: 'missing' };
    /* Each press files the badge on the shelf; repeats bump the count instead
       of adding a duplicate slot. */
    const now = Date.now();
    const badges = Array.isArray(state.world?.badges) ? state.world.badges.map((badge) => ({ ...badge })) : [];
    const existing = badges.find((badge) => badge && badge.key === preset.key);
    if (existing) {
      existing.count = (Number(existing.count) || 1) + 1;
      existing.last = now;
      if (!existing.first) existing.first = now;
    } else {
      badges.push({ key: preset.key, count: 1, first: now, last: now });
    }
    state.world = { ...(state.world || {}), weather: preset.weather, eventPreset: preset.key, badges };
    commit('world', { weather: preset.weather, eventPreset: preset.key, badges });
    return { ok: true, preset, badge: badges.find((badge) => badge.key === preset.key) };
  },

  clearEventPreset() {
    state.world = { ...(state.world || {}), eventPreset: null };
    commit('world', { eventPreset: null });
    return { ok: true };
  },

  /* Keeping a vigil is the playable half of an event preset: a run that reaches
     the target files the badge for the day. It pays no coins of its own — the
     run already pays like any mini game — so the result card never promises
     money the wallet does not also gain. */
  recordVigil(key, score) {
    const preset = key && typeof EVENT_PRESETS !== 'undefined' ? EVENT_PRESETS[key] : null;
    const target = typeof EVENT_VIGIL !== 'undefined' ? Number(EVENT_VIGIL.target) || 1 : 1;
    if (!preset) return { ok: false, reason: 'missing', target };
    /* The vigil belongs to the sky that is up right now, not to a key a caller
       names, so a stale button cannot file a badge for a preset that ended. */
    if (state.world?.eventPreset !== preset.key) return { ok: false, reason: 'no-event', target };
    if (!(Number(score) >= target)) return { ok: false, reason: 'short', score: Math.max(0, Number(score) || 0), target };
    const day = dayKey();
    const vigils = { ...(state.world?.vigils || {}) };
    const previous = vigils[preset.key] || null;
    const best = Math.max(Number(previous?.best) || 0, Number(score) || 0);
    if (previous && previous.day === day) {
      vigils[preset.key] = { ...previous, best, runs: (Number(previous.runs) || 1) + 1 };
      state.world = { ...(state.world || {}), vigils };
      commit('world', { vigils });
      return { ok: true, already: true, best, target, day };
    }
    /* The badge is the keepsake, so a kept vigil counts on the shelf exactly the
       way applying the preset does. */
    const now = Date.now();
    const badges = Array.isArray(state.world?.badges) ? state.world.badges.map((badge) => ({ ...badge })) : [];
    const existing = badges.find((badge) => badge && badge.key === preset.key);
    if (existing) {
      existing.count = (Number(existing.count) || 1) + 1;
      existing.last = now;
      if (!existing.first) existing.first = now;
    } else {
      badges.push({ key: preset.key, count: 1, first: now, last: now });
    }
    vigils[preset.key] = { day, best, runs: (Number(previous?.runs) || 0) + 1, last: now };
    state.world = { ...(state.world || {}), vigils, badges };
    commit('world', { vigils, badges });
    return { ok: true, kept: true, day, best, target, badge: badges.find((badge) => badge.key === preset.key) };
  },

  setSeason(key) {
    const season = key === 'off' ? 'off' : (key && SEASONS[key] ? key : null);
    state.world = { ...(state.world || {}), season };
    commit('world', { season });
    return { ok: true, season };
  },

  unlockIncubator(key) {
    const inc = typeof INCUBATOR_TYPES !== 'undefined' ? INCUBATOR_TYPES[key] : null;
    if (!inc) return { ok: false, reason: 'missing' };
    const st = getIncubatorState();
    const previousActive = st.active;
    if (st[key]) return { ok: true, already: true, key, cost: 0, previousActive };
    if (state.coins < (inc.cost || 0)) return { ok: false, reason: 'coins' };
    if (inc.cost) addCoinsRaw(-inc.cost);
    st[key] = true;
    st.active = key;
    commit('incubator', { key, cost: inc.cost || 0 });
    return { ok: true, key, cost: inc.cost || 0, previousActive };
  },

  undoIncubatorPurchase(key, cost, previousActive) {
    const inc = typeof INCUBATOR_TYPES !== 'undefined' ? INCUBATOR_TYPES[key] : null;
    if (!inc) return { ok: false, reason: 'missing' };
    const st = getIncubatorState();
    if (!st[key]) return { ok: false, reason: 'changed' };
    st[key] = false;
    if (st.active === key) {
      st.active = previousActive && INCUBATOR_TYPES[previousActive] && st[previousActive] ? previousActive : 'warm';
    }
    refundCoinsRaw(cost);
    commit('undoIncubatorPurchase', { key, cost: Number(cost) || 0, active: st.active });
    return { ok: true, key, coins: Number(cost) || 0 };
  },

  setIncubator(key) {
    if (typeof INCUBATOR_TYPES === 'undefined' || !INCUBATOR_TYPES[key]) return { ok: false, reason: 'missing' };
    const st = getIncubatorState();
    if (!st[key]) return { ok: false, reason: 'locked' };
    st.active = key;
    commit('incubator', { active: key });
    return { ok: true, key };
  },

  decorateEgg(id, opts = {}) {
    const s = findSprite(id);
    if (!s || s.stage !== 'egg') return { ok: false, reason: 'egg' };
    const pattern = PATTERNS[opts.pattern] ? opts.pattern : (s.pattern || 'spots');
    const palette = PALETTES[opts.palette] ? opts.palette : (s.palette || 'native');
    if (s.pattern === pattern && s.palette === palette) return { ok: true, unchanged: true, cost: 0 };
    const cost = 40;
    if (state.coins < cost) return { ok: false, reason: 'coins' };
    addCoinsRaw(-cost);
    s.pattern = pattern;
    s.palette = palette;
    commit('eggDecor', { spriteId: s.id, pattern, palette });
    return { ok: true, cost, pattern, palette };
  },

  buyGear(key) {
    const item = ACCESSORIES[key];
    if (!item || !item.price) return { ok: true };
    if (state.wardrobe.includes(key)) return { ok: true };
    if (state.coins < item.price) {
      Sfx.error();
      toast(`That costs ${item.price} coins. A few more pets and games will cover it.`, '🪙');
      return { ok: false };
    }
    state.coins -= item.price;
    state.stats.spent = (state.stats.spent || 0) + item.price;
    state.wardrobe.push(key);
    Sfx.coin();
    toast(`${item.name} added to the wardrobe!`, item.icon);
    commit('wardrobe', { key });
    return { ok: true };
  },

  setHollowName(name) {
    const clean = String(name || '').trim().slice(0, 22);
    if (clean) state.hollowName = clean;
    commit('hollowName');
  },

  markTourSeen() {
    if (state.seen.tour) return [];
    state.seen.tour = true;
    const found = checkProgressSecrets();
    commit('tourSeen', { found: found.length });
    return found;
  },

  setTourStep(index) {
    const step = Math.max(0, Math.floor(Number(index) || 0));
    if (state.tourStep === step) return step;
    state.tourStep = step;
    commit('tourStep', { step });
    return step;
  },

  clearTourStep() {
    if (!state.tourStep) return 0;
    state.tourStep = 0;
    commit('tourStep', { step: 0 });
    return 0;
  },

  completeTour() {
    if (!state.seen.tour) state.seen.tour = true;
    state.tourStep = 0;
    const guide = unlockSecret('hollowguide');
    checkProgressSecrets();
    commit('tour', { spriteId: guide?.id || null });
    return guide;
  },

  redeemCode(code) {
    const clean = String(code || '').trim().toUpperCase();
    if (clean === 'MASTER') {
      if (!state.seen.tour) return { ok: false, reason: 'tour' };
      if (state.secretUnlocks.includes(MASTER_CHEAT_SPECIES)) {
        return { ok: true, already: true, sprite: state.sprites.find((s) => s.element === MASTER_CHEAT_SPECIES) || null };
      }
      const sprite = unlockSecret(MASTER_CHEAT_SPECIES);
      return { ok: true, already: false, sprite };
    }
    const dailyCodes = {
      HOLLOW: { coins: 150, snacks: 1, label: 'Hollow supply drop' },
      REBIRTH: { food: 'rebirthmeal', label: 'Rebirth Meal', requiresRebirth: true },
      STARS: { coins: 80, snacks: 2, label: 'Starlight snack pack' },
    };
    const reward = dailyCodes[clean];
    if (!reward) return { ok: false, reason: 'unknown' };
    if (reward.requiresRebirth && !(state.stats.rebirths > 0)) {
      return { ok: false, reason: 'rebirth' };
    }
    const today = dayKey();
    state.codeRedeems = state.codeRedeems || {};
    if (state.codeRedeems[clean] === today) {
      return { ok: true, already: true, daily: true, code: clean };
    }
    state.codeRedeems[clean] = today;
    if (reward.coins) addCoinsRaw(reward.coins);
    if (reward.food) addFoodRaw(reward.food, 1);
    for (let i = 0; i < (reward.snacks || 0); i++) addSnackRaw(pick(SNACK_KEYS), 1);
    commit('code', { code: clean, reward });
    return { ok: true, already: false, daily: true, code: clean, reward };
  },

  ambientBond(ids, amount = 0.4) {
    (ids || []).forEach((id) => {
      const s = findSprite(id);
      if (s && s.stage !== 'egg') addBondRaw(s, amount);
    });
    saveState();
    stateListeners.forEach((fn) => { try { fn({ type: 'ambient' }); } catch {} });
  },

  /* Start a brand-new Hollow but bank the coins: everything else is rebuilt from
     scratch (eggs, sprites, unlocks, streaks, journal), so the player picks a
     starter egg again with the coins they already earned still in their pocket. */
  reset() {
    if (typeof savesLocked === 'function' && savesLocked()) {
      if (typeof toast === 'function') toast('Finish save recovery before starting over.', '🩺');
      return;
    }
    /* Lock the old Hollow's saves before reloading: pagehide/beforeunload would
       otherwise write it back over the fresh save and undo the reset. */
    if (typeof lockSaves === 'function') lockSaves();
    /* Release the active slot before the fresh save boots. The old Hollow stays
       in that slot, and without the pointer the new Hollow's first autosave
       cannot mirror over it; the new Hollow adopts a free slot on its next
       save instead of consuming the one it just left. */
    if (typeof releaseActiveSlot === 'function') releaseActiveSlot();
    const banked = Math.max(0, Math.floor(Number(state.coins) || 0));
    if (typeof CoinBank !== 'undefined') CoinBank.keep(banked);
    const fresh = freshState();
    fresh.coins = banked;
    state.coins = banked;
    try {
      if (typeof SaveJournal !== 'undefined') SaveJournal.abort();
      localStorage.setItem(SAVE_KEY, saveStorageString(fresh));
    } catch (err) {
      console.warn('Could not write the fresh Hollow save', err);
      try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
    }
    location.reload();
  },
};

/* District quest progress: only counts inside the biome you are standing in,
   and only for the step currently in front of you. */
/* Season Charge is a small, visible reward track shared by both halves of the
   district loop. Guardian practice wins and completed district lines each add
   one charge; three charges hatch a random event or Admin egg. */
function seasonChargeInfo() {
  const charge = state.seasonCharge && typeof state.seasonCharge === 'object' ? state.seasonCharge : {};
  const points = Math.max(0, Math.floor(Number(charge.points) || 0)) % SEASON_CHARGE_GOAL;
  return {
    have: points,
    need: SEASON_CHARGE_GOAL,
    next: SEASON_CHARGE_GOAL - points,
    eggs: Math.max(0, Math.floor(Number(charge.eggs) || 0)),
    progress: (points / SEASON_CHARGE_GOAL) * 100,
  };
}

function grantSeasonEventEggRaw() {
  if (typeof weekendAdminEggPool !== 'function' || typeof rollEgg !== 'function') return null;
  const pool = weekendAdminEggPool();
  if (!pool.length) return null;
  const key = pick(pool);
  const egg = rollEgg('wild', { element: key, eggLabel: `${ELEMENTS[key].name} Season Event Egg` });
  egg.hatch = 40;
  state.sprites.push(egg);
  state.stats.seasonEggs = (Number(state.stats.seasonEggs) || 0) + 1;
  return { key, egg, name: ELEMENTS[key].name };
}

function addSeasonChargeRaw(amount = 1) {
  const gain = Math.max(0, Math.floor(Number(amount) || 0));
  if (!gain) return [];
  state.seasonCharge = state.seasonCharge && typeof state.seasonCharge === 'object'
    ? { ...state.seasonCharge }
    : { points: 0, eggs: 0 };
  state.seasonCharge.points = Math.max(0, Math.floor(Number(state.seasonCharge.points) || 0)) + gain;
  state.seasonCharge.eggs = Math.max(0, Math.floor(Number(state.seasonCharge.eggs) || 0));
  const earned = [];
  while (state.seasonCharge.points >= SEASON_CHARGE_GOAL) {
    const egg = grantSeasonEventEggRaw();
    if (!egg) break;
    state.seasonCharge.points -= SEASON_CHARGE_GOAL;
    state.seasonCharge.eggs += 1;
    earned.push(egg);
  }
  return earned;
}

function biomeQuestNote(kind) {
  if (typeof BIOME_QUESTS === 'undefined' || typeof biomeQuestStep !== 'function') return;
  const sceneKey = state.theme && state.theme.scene;
  const info = biomeQuestStep(sceneKey);
  if (!info || info.step.kind !== kind) return;
  const have = Math.min(info.step.need, Math.max(0, Number(info.q.progress) || 0));
  if (have >= info.step.need) return;
  state.biomeQuests = { ...(state.biomeQuests || {}) };
  state.biomeQuests[sceneKey] = { step: info.q.step, progress: have + 1, done: !!info.q.done };
  commit('biomeQuestProgress', { scene: sceneKey, kind, progress: have + 1, need: info.step.need });
  if (have + 1 >= info.step.need) toast(`${BIOME_QUESTS[sceneKey].title}: step ready to claim.`, '🗺️');
}

/* ---------------- real-time simulation ---------------- */
let lastAutosave = Date.now();
function tick(force = false) {
  const t = Date.now();
  let sec = (t - (state.lastTick || t)) / 1000;
  if (sec < 0.9 && !force) return;
  sec = Math.min(sec, 4 * 3600);
  state.lastTick = t;
  ensureDaily();
  ensureQuests();
  ensureCheckinPeriods();
  ensureArcadePeriods();
  ensureGift();
  const min = sec / 60;
  let changed = false;
  let woke = [];
  const healed = [];
  /* Dawn checkout runs before the floor serves anyone: a stay that has run its
     eight hours ends here, so an abandoned room cannot keep a guest topped up
     at 100 forever. */
  if (typeof hotelGuests === 'function' && typeof finishHotelStay === 'function') {
    hotelGuests().filter((entry) => hotelStayDue(entry)).forEach((entry) => finishHotelStay(entry, { dawn: true }));
  }
  /* One stay lookup for the whole tick; isHotelGuest() rebuilds the guest list. */
  const stayingIds = new Set(typeof hotelGuests === 'function' ? hotelGuests().map((entry) => entry.id) : []);
  state.sprites.forEach((s) => {
    if (s.stage === 'egg' || s.retired) return;
    const hyg = hygieneOf(s);
    /* A checked-in guest is being looked after on site: the hotel feeds, rests,
       washes and entertains them instead of letting the bars drain. */
    if (stayingIds.has(s.id)) {
      s.needs.hunger = clamp(s.needs.hunger + 1.6 * min);
      s.needs.energy = clamp(s.needs.energy + 1.4 * min);
      s.needs.joy = clamp(s.needs.joy + 1.1 * min);
      s.needs.clean = clamp(s.needs.clean + 0.9 * min);
      hyg.hair = clamp(hyg.hair + 0.14 * min);
      hyg.teeth = clamp(hyg.teeth + 0.1 * min);
      hyg.breath = clamp(hyg.breath + 0.12 * min);
      s.bond = clamp(s.bond + 0.05 * min);
      changed = true;
      return;
    }
    if (s.atHome) {
      /* A sprite sent home grazes, relaxes, recovers every need, sleeps long,
         and tucks a few coins away while the keeper is busy. */
      const boost = typeof homeRecoveryMult === 'function' ? homeRecoveryMult() : 1;
      s.needs.hunger = clamp(s.needs.hunger + 3.4 * min * boost);
      s.needs.energy = clamp(s.needs.energy + (s.asleep ? 4.5 : 2.2) * min * boost);
      s.needs.joy = clamp(s.needs.joy + 2.8 * min * boost);
      s.needs.clean = clamp(s.needs.clean + 1.4 * min * boost);
      hyg.hair = clamp(hyg.hair + 0.08 * min * boost);
      hyg.teeth = clamp(hyg.teeth + 0.06 * min * boost);
      hyg.breath = clamp(hyg.breath + 0.05 * min * boost);
      s.bond = clamp(s.bond + 0.06 * min);
      const coinCap = typeof homeCoinCap === 'function' ? homeCoinCap() : 320;
      const coinBoost = typeof homeCoinRateMult === 'function' ? homeCoinRateMult() : 1;
      const rate = (sec / 42) * coinBoost * (1 + Math.min(3, (Number(s.level) || 1) * 0.01));
      s.homeCoins = Math.min(coinCap, Math.max(0, Number(s.homeCoins) || 0) + rate);
      if (typeof Sickness !== 'undefined' && Sickness.tick(s, min, { home: true })) {
        healed.push(s.id);
        changed = true;
      }
      if (s.asleep && t >= (s.sleepUntil || 0)) {
        finishSleep(s);
        woke.push(s.id);
      }
      changed = true;
      return;
    }
    const breed = BREEDS[s.breed] || {};
    const fx = spriteEffects(s);
    const wx = weatherEffects(s);
    const globalDecay = fx.decay || 1;
    const comfort = typeof fashionSeasonMod === 'function' ? fashionSeasonMod('comfort', s) : 1;
    if (s.asleep) {
      if (t >= (s.sleepUntil || 0)) {
        finishSleep(s);
        woke.push(s.id);
        changed = true;
      } else {
        s.needs.energy = clamp(s.needs.energy + (100 / 30) * sec);
        changed = true;
      }
      return;
    }
    s.needs.hunger = clamp(s.needs.hunger - 0.42 * min * (breed.hungerMod || 1) * (fx.hungerDecay || 1) * wx.hunger * globalDecay * comfort);
    s.needs.energy = clamp(s.needs.energy - 0.3 * min * (breed.energyMod || 1) * (fx.energyDecay || 1) * wx.energy * globalDecay * comfort);
    s.needs.joy = clamp(s.needs.joy - 0.38 * min * (breed.joyMod || 1) * (fx.joyDecay || 1) * wx.joy * globalDecay * comfort);
    s.needs.clean = clamp(s.needs.clean - 0.2 * min * (breed.cleanMod || 1) * (fx.cleanDecay || 1) * wx.clean * globalDecay * comfort);
    hyg.hair = clamp(hyg.hair - 0.055 * min * globalDecay);
    hyg.teeth = clamp(hyg.teeth - 0.085 * min * globalDecay);
    hyg.breath = clamp(hyg.breath - 0.12 * min * globalDecay);
    /* Weather is its own exposure: a worn-down sprite outside in harsh air can
       pick something up even before neglect would. At-home sprites return above
       and never collect it. */
    const weatherNow = typeof currentWeather === 'function' ? currentWeather() : null;
    const weatherIllness = typeof Sickness !== 'undefined' && typeof Sickness.weatherCheck === 'function'
      ? Sickness.weatherCheck(s, weatherNow, min)
      : null;
    if (weatherIllness) {
      const info = typeof ILLNESSES !== 'undefined' ? ILLNESSES[weatherIllness.key] : null;
      const weatherName = weatherNow && typeof weatherNow.name === 'string' ? weatherNow.name.toLowerCase() : 'the weather';
      toast(`${displayName(s)} caught ${info ? `${info.icon} ${info.name}` : 'a chill'} from ${weatherName}.`, info ? info.icon : '🌦️');
      changed = true;
    }
    /* Colds and other illnesses are part of the same sim: neglect for a while
       can make a sprite ill, and a sick sprite's fever climbs down with medicine
       or rest. */
    if (typeof Sickness !== 'undefined' && Sickness.tick(s, min)) healed.push(s.id);
    const avg = (s.needs.hunger + s.needs.energy + s.needs.joy + s.needs.clean) / 4;
    if (avg < 30) s.bond = clamp(s.bond - 0.04 * min);
    changed = true;
  });
  Object.values(state.houses || {}).forEach((house) => {
    const members = (house.members || []).map((id) => findSprite(id)).filter((m) => m && m.stage !== 'egg' && !m.retired);
    if (members.length < 2) return;
    const homeTogether = members.filter((m) => m.atHome).length >= 2;
    const gain = 0.02 * min * (homeTogether ? 1.6 : 1) * members.length;
    const cap = typeof HOUSE_BOND_MAX === 'number' ? HOUSE_BOND_MAX : 600;
    house.bond = Math.min(cap, (Number(house.bond) || 0) + gain);
    members.forEach((m) => { m.bond = clamp(m.bond + 0.02 * min); });
    const milestone = Math.max(100, Number(house.milestone) || 100);
    if (house.bond >= milestone) {
      house.milestone = milestone + 100;
      members.forEach((m) => { addBondRaw(m, 3); addXpRaw(m, 5); });
      addCoinsRaw(10);
      const names = members.map((m) => displayName(m)).join(' & ');
      toast(`${names} share a house bond! +10 coins · house bond ${Math.floor(house.bond)}.`, '💞');
    }
    const storyChapters = syncHouseStory(house);
    if (storyChapters.length) {
      const chapter = storyChapters[0];
      toast(`📖 ${chapter.chapterName} unlocked for ${chapter.houseName}. ${chapter.keepsake.icon} ${chapter.keepsake.name} joins the Story shelf.`, '📖');
    }
    changed = true;
  });
  healed.forEach((id) => {
    const sprite = findSprite(id);
    if (sprite) toast(`${displayName(sprite)} is feeling better.`,'🌈');
  });
  if (woke.length && sec < 180) {
    const s = findSprite(woke[0]);
    if (s) {
      const dream = s.lastDream?.text || pick(DREAM_LINES);
      toast(`${displayName(s)} woke up from a dream about ${dream}.`, '🌙');
    }
  }
  if (changed && t - lastAutosave > 15000) {
    lastAutosave = t;
    saveState();
  }
}

function applyTheme() {
  setThemeVars(state.theme);
  /* The calm setting is a document-level class so the CSS can stop the idle
     bob, the drifting motes and the ambient orbs without touching the art. */
  const calm = state.theme.motion === 'calm';
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.toggle('reduce-motion', calm);
  }
  if (typeof refreshBiomeAmbience === 'function') refreshBiomeAmbience();
}
