/* Rotating Secret Vault windows: one monthly keeper and a new two-window
   weekly relay. The Vault itself lives in data-biomes.js; this file supplies
   the calendar entries and the deterministic real-world window logic. */

const VAULT_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const VAULT_MONTH_DEFS = [
  ['vault_jan', 'Firstlight Keeper', 'The year opens', 'first light', ['#ffd166', '#fff8d0', '#6b4b00', '#8be9ff'], 'Hopeful — arrives with the first clean page of the year.', 'First Light', '🌅', '+25% XP and gifts arrive 20% sooner.', { xp: 1.25, giftSpeed: 1.2 }],
  ['vault_feb', 'Ember Valentine', 'A warm note', 'a warm heart', ['#ff7a9e', '#ffe3ec', '#6b1230', '#ffd166'], 'Affectionate — keeps every kind note in a tiny envelope.', 'Warm Heart', '💌', 'Pets build 40% more bond and pay +2 coins.', { petBond: 1.4, petCoins: 2 }],
  ['vault_mar', 'Thaw Warden', 'The ice lets go', 'the first thaw', ['#5ad6b8', '#e0fff8', '#0f5c4a', '#8be9ff'], 'Thawing — hears the river under the snow before anyone else.', 'First Thaw', '💧', 'Energy fades 20% slower and day games pay +3 coins.', { energyDecay: 0.8, dayCoins: 3 }],
  ['vault_apr', 'Bloom Cartographer', 'Every path flowers', 'a flowering map', ['#8fe07a', '#efffdc', '#2f5a1a', '#ff9ec7'], 'Mapping — draws new paths that the garden remembers.', 'Maple Path', '🗺️', 'Gifts arrive 25% sooner and snacks give +30% XP.', { giftSpeed: 1.25, snackXp: 1.3 }],
  ['vault_may', 'Maypole Trickster', 'Ribbons in the wind', 'a ribbon trick', ['#b58ae8', '#f3e8ff', '#4a2a6b', '#ffd166'], 'Playful — turns every festival into a friendly contest.', 'Ribbon Dance', '🎀', 'Games pay +3 coins and pets build 25% more bond.', { gameCoins: 3, petBond: 1.25 }],
  ['vault_jun', 'Solstice Archivist', 'The longest day', 'a solstice record', ['#ffd166', '#fff8d0', '#6b4b00', '#5a9eff'], 'Patient — files every long afternoon under “useful light.”', 'Long Day', '☀️', 'Day games pay +4 coins and +20% XP.', { dayCoins: 4, xp: 1.2 }],
  ['vault_jul', 'Sunmarket Broker', 'A bright bargain', 'a summer bargain', ['#ff9a3c', '#fff0d6', '#6b3a00', '#ffd166'], 'Enterprising — can trade a pebble for a perfect afternoon.', 'Market Luck', '🪙', 'Games pay +5 coins and gifts arrive 15% sooner.', { gameCoins: 5, giftSpeed: 1.15 }],
  ['vault_aug', 'Meteor Miller', 'A grain of sky', 'a meteor grain', ['#5c5a9e', '#e8e6ff', '#1f1d4a', '#8be9ff'], 'Stargazing — grinds starlight into the softest flour.', 'Meteor Grain', '🌠', 'Gain 30% more XP and night games pay +2 coins.', { xp: 1.3, nightCoins: 2 }],
  ['vault_sep', 'Harvest Registrar', 'Every seed counted', 'a harvest ledger', ['#d9a441', '#fff0c2', '#5c3a0a', '#8fe07a'], 'Careful — keeps a ledger of every seed that became a meal.', 'Harvest Count', '🌾', 'Snacks give +40% XP and hunger fades 15% slower.', { snackXp: 1.4, hungerDecay: 0.85 }],
  ['vault_oct', 'Lantern Reaper', 'A light in the dark', 'a lantern vigil', ['#e86a3a', '#ffe0c2', '#5c1a05', '#ffd166'], 'Watchful — lights the path home, even after the last door closes.', 'Lantern Vigil', '🏮', 'Night games pay +4 coins and all needs fade 8% slower.', { nightCoins: 4, decay: 0.92 }],
  ['vault_nov', 'Frostfire Scribe', 'Ink that steams', 'a frost ink', ['#7ad8e8', '#e8fbff', '#1f5c6b', '#e8574a'], 'Expressive — writes warm stories in frost that only melts at dawn.', 'Frost Ink', '🖋️', 'Chats pay +3 coins and +20% XP.', { chatCoins: 3, xp: 1.2 }],
  ['vault_dec', 'Midwinter Host', 'The table is set', 'a midwinter feast', ['#f0f8ff', '#ffffff', '#5c7a9a', '#ffd166'], 'Hospitable — always has one more chair and one more cocoa.', 'Midwinter Table', '🕯️', 'Gifts arrive 40% sooner and pets build 30% more bond.', { giftSpeed: 1.4, petBond: 1.3 }],
];

/* A second keeper for every month: both monthly windows are open in their own
   month, so the Vault has two doors a month instead of one. The first set stays
   the headline keeper; these are listed and installed the same way. */
const VAULT_MONTH_EXTRA_DEFS = [
  ['vault_jan_b', 'Penny Pledge', 'A new ledger', 'a first coin', ['#ffd166', '#fff8d0', '#6b4b00', '#ff9a3c'], 'Frugal — keeps the first coin of the year in a frame.', 'First Coin', '🪙', 'Games pay +2 coins and check-ins pay +2 bonus coins.', { gameCoins: 2, checkinCoins: 2 }],
  ['vault_feb_b', 'Cocoa Courier', 'A warm delivery', 'a cocoa run', ['#ff9ec7', '#ffe3ec', '#6b1230', '#ffd166'], 'Attentive — remembers who takes marshmallows.', 'Cocoa Run', '☕', 'Chats pay +3 coins and energy fades 15% slower.', { chatCoins: 3, energyDecay: 0.85 }],
  ['vault_mar_b', 'Puddle Skipper', 'A clean jump', 'a puddle hop', ['#5ad6b8', '#e0fff8', '#0f5c4a', '#8be9ff'], 'Lightfooted — lands on the dry half of every step.', 'Puddle Hop', '🌦️', 'Day games pay +3 coins and +10% XP.', { dayCoins: 3, xp: 1.1 }],
  ['vault_apr_b', 'Seed Librarian', 'Every packet filed', 'a seed packet', ['#8fe07a', '#efffdc', '#2f5a1a', '#ff9ec7'], 'Organised — can find the one seed you actually wanted.', 'Seed Index', '🌱', 'Snacks give +25% XP and hunger fades 10% slower.', { snackXp: 1.25, hungerDecay: 0.9 }],
  ['vault_may_b', 'Ribbon Referee', 'A fair race', 'a fair start', ['#b58ae8', '#f3e8ff', '#4a2a6b', '#ffd166'], 'Even-handed — starts every race at the same second.', 'Fair Start', '🪢', 'Games pay +3 coins and +10% XP.', { gameCoins: 3, xp: 1.1 }],
  ['vault_jun_b', 'Lantern Lifeguard', 'Watch the water', 'a lantern buoy', ['#ffd166', '#fff8d0', '#6b4b00', '#5a9eff'], 'Watchful — never looks away from the deep end.', 'Lantern Buoy', '🛟', 'Night games pay +3 coins and needs fade 6% slower.', { nightCoins: 3, decay: 0.94 }],
  ['vault_jul_b', 'Lemonade Ledger', 'Count the cups', 'a cold cup', ['#ffe066', '#fffbd1', '#6b5a00', '#ff9a3c'], 'Cheerful — turns a queue into a conversation.', 'Cold Cup', '🍋', 'Check-ins pay +3 coins and chats pay +2 coins.', { checkinCoins: 3, chatCoins: 2 }],
  ['vault_aug_b', 'Night Market Scout', 'Find the stall', 'a market map', ['#5c5a9e', '#e8e6ff', '#1f1d4a', '#ffd166'], 'Curious — knows which stall closes last.', 'Market Map', '🏮', 'Night games pay +4 coins and gifts arrive 15% sooner.', { nightCoins: 4, giftSpeed: 1.15 }],
  ['vault_sep_b', 'Cider Steward', 'Press the apples', 'a cider press', ['#d9a441', '#fff0c2', '#5c3a0a', '#ff8a5c'], 'Steady — keeps the press turning at the right speed.', 'Cider Press', '🍎', 'Snacks give +30% XP and pets build 20% more bond.', { snackXp: 1.3, petBond: 1.2 }],
  ['vault_oct_b', 'Pumpkin Auditor', 'Weigh the harvest', 'a pumpkin weight', ['#e86a3a', '#ffe0c2', '#5c1a05', '#ffd166'], 'Exact — can tell a good pumpkin by the sound it makes.', 'Harvest Weight', '🎃', 'Hunger fades 15% slower and +15% XP.', { hungerDecay: 0.85, xp: 1.15 }],
  ['vault_nov_b', 'Ember Storyteller', 'A tale by the fire', 'an ember tale', ['#e8574a', '#ffd9d4', '#5c1410', '#ffd166'], 'Warm — tells the story that makes the room lean in.', 'Ember Tale', '📖', 'Chats pay +3 coins and pets build 30% more bond.', { chatCoins: 3, petBond: 1.3 }],
  ['vault_dec_b', 'Snowglobe Curator', 'A perfect flake', 'a snow globe', ['#7ad8e8', '#e8fbff', '#1f5c6b', '#ffd166'], 'Careful — shakes the globe exactly once.', 'Snow Globe', '🔮', 'Gifts arrive 30% sooner and energy fades 20% slower.', { giftSpeed: 1.3, energyDecay: 0.8 }],
];

/* A relay row names its window where a monthly keeper has a title and clue.
   The map below normalizes every row to the same ten fields, so one destructure
   installs all three sets and no row can shift a colour into the wrong slot. */
const VAULT_WEEK_DEFS = [
  ['vault_dawn', 'Dawn Relay', 'Monday–Wednesday', ['#ffd166', '#fff8d0', '#6b4b00', '#8be9ff'], 'Early — finishes the first lap while the sky is still deciding.', 'Dawn Baton', '🌅', 'Day games pay +3 coins and gifts arrive 20% sooner.', { dayCoins: 3, giftSpeed: 1.2 }],
  ['vault_dusk', 'Dusk Relay', 'Thursday–Sunday', ['#c9a6f0', '#f7ecff', '#5a3a7e', '#ffe08a'], 'Twilight — hands off the baton just as the stars arrive.', 'Dusk Baton', '🌆', 'Night games pay +3 coins and chats pay +2 coins.', { nightCoins: 3, chatCoins: 2 }],
  ['vault_tide', 'Tide Relay', 'Monday–Wednesday', ['#5ad6ff', '#e8fbff', '#1f5c6b', '#8fe07a'], 'Tidal — never loses the rhythm, even when the route floods.', 'Tide Baton', '🌊', 'Energy fades 20% slower and games pay +2 coins.', { energyDecay: 0.8, gameCoins: 2 }],
  ['vault_ember', 'Ember Relay', 'Thursday–Sunday', ['#ff8a3a', '#ffe8d6', '#6b2a0a', '#ffd166'], 'Hotfooted — runs so fast the baton leaves a little smoke.', 'Ember Baton', '🔥', 'Games pay +3 coins and +15% XP.', { gameCoins: 3, xp: 1.15 }],
  ['vault_bloom', 'Bloom Relay', 'Monday–Wednesday', ['#8fe07a', '#efffdc', '#2f5a1a', '#ff9ec7'], 'Fresh — leaves a trail of small flowers on the practice track.', 'Bloom Baton', '🌿', 'Snacks give +30% XP and pets build 20% more bond.', { snackXp: 1.3, petBond: 1.2 }],
  ['vault_star', 'Star Relay', 'Thursday–Sunday', ['#ffd166', '#fff8d0', '#6b4b00', '#b58ae8'], 'Bright — runs best when the whole crowd is watching.', 'Star Baton', '⭐', 'Gifts arrive 25% sooner and +15% XP.', { giftSpeed: 1.25, xp: 1.15 }],
  ['vault_gear', 'Gear Relay', 'Monday–Wednesday', ['#b7b7ce', '#f0f0f8', '#55556e', '#8be9ff'], 'Mechanical — has a route for every weather and a spare spring.', 'Gear Baton', '⚙️', 'All needs fade 12% slower and energy fades 20% slower.', { decay: 0.88, energyDecay: 0.8 }],
  ['vault_veil', 'Veil Relay', 'Thursday–Sunday', ['#8a76b8', '#e8e0f2', '#2f1f4a', '#7affd8'], 'Quiet — finishes the lap without a single footprint.', 'Veil Baton', '🌙', 'Night games pay +4 coins and needs fade 10% slower.', { nightCoins: 4, decay: 0.9 }],
  /* Four more relays: the twice-weekly rotation is twelve deep now, so a given
     relay returns about a month apart instead of fortnightly. Labels alternate
     by index, which is what vaultCalendar assumes. */
  ['vault_mist', 'Mist Relay', 'Monday–Wednesday', ['#a9c4d8', '#f0f8ff', '#3a5468', '#8be9ff'], 'Soft-footed — runs the first lap before the fog lifts.', 'Mist Baton', '🌫️', 'Chats pay +2 coins and needs fade 10% slower.', { chatCoins: 2, decay: 0.9 }],
  ['vault_prisma', 'Prisma Relay', 'Thursday–Sunday', ['#b58ae8', '#f7ecff', '#4a2a6b', '#7affd8'], 'Colourful — leaves a different shade on every straight.', 'Prisma Baton', '🌈', 'Games pay +3 coins and +20% XP.', { gameCoins: 3, xp: 1.2 }],
  ['vault_quartz', 'Quartz Relay', 'Monday–Wednesday', ['#c7e8f0', '#f4feff', '#3a5a66', '#ffd166'], 'Clear-headed — never trips on the same stone twice.', 'Quartz Baton', '💎', 'Day games pay +3 coins and energy fades 15% slower.', { dayCoins: 3, energyDecay: 0.85 }],
  ['vault_halo', 'Halo Relay', 'Thursday–Sunday', ['#ffd166', '#fff8d0', '#6b4b00', '#f0f8ff'], 'Radiant — the whole track looks brighter behind them.', 'Halo Baton', '✨', 'Night games pay +3 coins and gifts arrive 20% sooner.', { nightCoins: 3, giftSpeed: 1.2 }],
].map(([key, name, slot, palette, trait, geneName, icon, desc, effect]) => [
  key, name, 'Twice-weekly relay', `Open during the ${slot} relay window — claim it before the baton passes.`, palette, trait, geneName, icon, desc, effect,
]);

function installRotatingVaultSecrets(meta) {
  if (!meta || meta.vault_jan) return;
  /* Every def is one shape: [key, name, title, clue, palette, trait, gene,
     icon, desc, effect]. VAULT_WEEK_DEFS normalizes its rows to it when built. */
  const install = (def, window) => {
    const [key, name, title, clue, palette, trait, geneName, icon, desc, effect] = def;
    meta[key] = {
      name,
      title,
      clue,
      palette,
      trait,
      blurb: `${name} is a rotating Vault keeper whose window follows the real-world calendar. ${trait}`,
      greeting: 'You found the window. It will not stay open forever.',
      likes: window.kind === 'month' ? 'Moon Cake' : 'Star Pop',
      gene: [geneName, icon, desc, effect],
      titan: `${name} Titan`,
      vaultWindow: window,
      rotation: true,
    };
  };
  VAULT_MONTH_DEFS.forEach((def, month) => install(def, { kind: 'month', month }));
  VAULT_MONTH_EXTRA_DEFS.forEach((def, month) => install(def, { kind: 'month', month }));
  VAULT_WEEK_DEFS.forEach((def, cycle) => install(def, { kind: 'week', cycle }));
}

const VAULT_MONTHLY_KEYS = VAULT_MONTH_DEFS.map((def) => def[0]);
/* The second door of each month. Both are open in their own month; the first
   set stays the headline keeper and the one the label names. */
const VAULT_MONTH_EXTRA_KEYS = VAULT_MONTH_EXTRA_DEFS.map((def) => def[0]);
const VAULT_WEEKLY_KEYS = VAULT_WEEK_DEFS.map((def) => def[0]);
const VAULT_ROTATION_KEYS = [...VAULT_MONTHLY_KEYS, ...VAULT_MONTH_EXTRA_KEYS, ...VAULT_WEEKLY_KEYS];

function vaultCalendar(date = new Date()) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.floor((date - yearStart) / 604800000);
  const day = date.getDay();
  const slot = day === 0 || day >= 4 ? 1 : 0;
  const base = ((weekNumber * 2) % VAULT_WEEKLY_KEYS.length + VAULT_WEEKLY_KEYS.length) % VAULT_WEEKLY_KEYS.length;
  return {
    date,
    month: date.getMonth(),
    monthName: VAULT_MONTH_NAMES[date.getMonth()],
    weekNumber,
    slot,
    base,
    slotWindow: slot === 0 ? 'Monday–Wednesday' : 'Thursday–Sunday',
    activeCycle: slot === 0 ? base : (base + 1) % VAULT_WEEKLY_KEYS.length,
  };
}

function vaultOpen(key, date = new Date()) {
  const meta = typeof SECRET_SPECIES_META !== 'undefined' ? SECRET_SPECIES_META[key] : null;
  if (!meta || !meta.vaultWindow) return false;
  const cal = vaultCalendar(date);
  if (meta.vaultWindow.kind === 'month') return meta.vaultWindow.month === cal.month;
  if (meta.vaultWindow.kind === 'week') return meta.vaultWindow.cycle === cal.activeCycle;
  return false;
}

/* When a closed relay next opens. Cycles advance by two per week and alternate
   halves, so the offset from the current cycle gives the week and the day; on
   Thursday–Sunday this week's Monday slot is already gone. */
function vaultNextRelay(cal, key) {
  const total = VAULT_WEEKLY_KEYS.length;
  const offset = (VAULT_WEEKLY_KEYS.indexOf(key) - cal.base + total) % total;
  const weeks = cal.slot === 1 && offset === 0 ? total / 2 : Math.floor(offset / 2);
  return { weeks, day: offset % 2 === 0 ? 'Monday' : 'Thursday' };
}

function vaultWindowLabel(key, date = new Date()) {
  const meta = typeof SECRET_SPECIES_META !== 'undefined' ? SECRET_SPECIES_META[key] : null;
  if (!meta || !meta.vaultWindow) return 'Progress secret';
  const cal = vaultCalendar(date);
  if (meta.vaultWindow.kind === 'month') {
    const month = VAULT_MONTH_NAMES[meta.vaultWindow.month];
    if (vaultOpen(key, date)) {
      const lastDay = new Date(date.getFullYear(), cal.month + 1, 0).getDate();
      return `Open now · closes ${lastDay} ${month.slice(0, 3)}`;
    }
    const year = meta.vaultWindow.month < cal.month ? date.getFullYear() + 1 : date.getFullYear();
    return `Opens 1 ${month.slice(0, 3)} ${year}`;
  }
  if (vaultOpen(key, date)) return `Open now · ${cal.slotWindow} window`;
  const next = vaultNextRelay(cal, key);
  const when = next.weeks === 0 ? `this ${next.day}`
    : next.weeks === 1 ? `next ${next.day}`
      : `in ${next.weeks} weeks (${next.day})`;
  return `Opens ${when} · ${meta.name}`;
}

function currentVaultKeys(date = new Date()) {
  const cal = vaultCalendar(date);
  return {
    calendar: cal,
    open: [VAULT_MONTHLY_KEYS[cal.month], VAULT_MONTH_EXTRA_KEYS[cal.month], VAULT_WEEKLY_KEYS[cal.activeCycle]].filter(Boolean),
    label: `${cal.monthName} monthly keepers · ${cal.slotWindow} relay`,
  };
}
