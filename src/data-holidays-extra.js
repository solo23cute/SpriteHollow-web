/* Holiday wave: more calendar events, season gift eggs, holiday XP bonuses, and seasonal species. */

Object.assign(HOLIDAYS, {
  lantern: {
    name: 'Lantern Festival', icon: '🏮', start: [1, 1], end: [1, 6], color: '#ffb347',
    treat: 'mooncake', coinMult: 1.2, giftSpeed: 1.15, xpMult: 1.15,
    blurb: 'Paper lights on the water, sweet mooncakes, and a whole harbor of soft gold.',
  },
  aprilfools: {
    name: 'Prank Day', icon: '🃏', start: [3, 1], end: [3, 5], color: '#b69cff',
    treat: 'candy', coinMult: 1.25, giftSpeed: 1.3, xpMult: 1.2,
    blurb: 'The Hollow gets silly: trickster eggs, suspicious cookies, and very fast gifts.',
  },
  easter: {
    name: 'Spring Egg Hunt', icon: '🥚', start: [3, 6], end: [3, 19], color: '#ffb3d1',
    treat: 'starfruit', coinMult: 1.2, giftSpeed: 1.25, xpMult: 1.2,
    blurb: 'Painted eggs under every bush, a basket by the door, and a bonus egg every day.',
  },
  summer: {
    name: 'Sunfest', icon: '☀️', start: [5, 20], end: [6, 7], color: '#ffd166',
    treat: 'coconutwater', coinMult: 1.15, giftSpeed: 1.15, xpMult: 1.2,
    blurb: 'Long light, cold drinks, and a beach-ball egg waiting in the warm grass.',
  },
  harvest: {
    name: 'Harvest Moon', icon: '🌾', start: [10, 1], end: [10, 30], color: '#e0a44a',
    treat: 'apple', coinMult: 1.15, giftSpeed: 1.15, xpMult: 1.15,
    blurb: 'Golden fields, apple baskets, and a scarecrow who insists the moon is ripe.',
  },
});

/* Bloom Festival now ends in March so Prank Day can open April. */
HOLIDAYS.spring.end = [2, 31];

const HOLIDAY_EGG_POOLS = {
  newyear: ['santa', 'crown', 'radiant', 'lucky', 'onewish'],
  lantern: ['lanternfox', 'lucky', 'crown', 'candy', 'radiant'],
  valentine: ['cupid', 'charm', 'bestie', 'cuddle', 'keke'],
  spring: ['springchick', 'bloom', 'bunny', 'charm', 'moth'],
  aprilfools: ['jester', 'trollface', 'smugfrog', 'cheems', 'sussy'],
  easter: ['egghunt', 'springchick', 'bunny', 'charm', 'holly'],
  summer: ['sunspark', 'beachball', 'tide', 'dolphin', 'splash'],
  candyfest: ['candy', 'gummybear', 'cauldron', 'cocoa', 'cherry'],
  halloween: ['scarecrow', 'witch', 'mummy', 'franken', 'blackcat', 'pumpkin'],
  harvest: ['scarecrow', 'apple', 'pumpkin', 'honey', 'gingerbread'],
  christmas: ['elf', 'reindeer', 'gingerbread', 'nutcracker', 'snowman', 'holly', 'santa'],
};

const HOLIDAY_XP_BONUS = {
  newyear: 1.15, lantern: 1.15, valentine: 1.1, spring: 1.15, aprilfools: 1.2,
  easter: 1.2, summer: 1.2, candyfest: 1.15, halloween: 1.25, harvest: 1.15, christmas: 1.3,
};

Object.entries(HOLIDAY_EGG_POOLS).forEach(([key, eggs]) => {
  if (HOLIDAYS[key]) HOLIDAYS[key].eggs = eggs;
});
Object.entries(HOLIDAY_XP_BONUS).forEach(([key, mult]) => {
  if (HOLIDAYS[key]) HOLIDAYS[key].xpMult = mult;
});

function holidayXpMult() {
  return activeHoliday()?.xpMult || 1;
}

function holidayEggPool(holiday = activeHoliday()) {
  if (!holiday) return [];
  const pool = (holiday.eggs || []).filter((key) => ELEMENTS[key]);
  if (pool.length) return pool;
  return ['bloom', 'lucky', 'candy'].filter((key) => ELEMENTS[key]);
}

function holidayGiftClaimed(holiday = activeHoliday(), date = new Date()) {
  if (!holiday) return false;
  return state?.holidayGift?.date === dayKey(date) && state.holidayGift.holiday === holiday.key;
}

/* Seasonal wave: these six sprites arrive through holiday gift eggs. */
const SEASONAL_KINDS = {
  springchick: {
    name: 'Spring Chick', primary: '#ffe066', light: '#fff8d1', deep: '#8a5a00', accent: '#8fe07a',
    trait: 'Newly hatched — meets every morning like it is the first one ever.',
    blurb: 'A fluffy yellow chick with a tuft of grass on its head and a song for the sunrise.',
    greeting: 'Good morning! I found three seeds and a worm. Big day.', likes: 'Sun Nectar',
  },
  egghunt: {
    name: 'Egg Hunt Bunny', primary: '#ffb3d1', light: '#ffe6f0', deep: '#8a2a52', accent: '#8be9ff',
    trait: 'Hiding — remembers where every single egg went, and refuses to say.',
    blurb: 'A long-eared bunny with a paint-spotted basket and a suspiciously smug smile.',
    greeting: 'You are getting warmer. No, colder. This is fun for me.', likes: 'Candy Apple',
  },
  sunspark: {
    name: 'Sunspark', primary: '#ffb347', light: '#ffe6c2', deep: '#8a4a00', accent: '#8be9ff',
    trait: 'Radiant — charges up in a sunbeam and shares the warmth freely.',
    blurb: 'A small sun-shaped sprite that hums at noon and glows faintly all night.',
    greeting: 'Stand here. The light is perfect. I checked.', likes: 'Lemonade',
  },
  beachball: {
    name: 'Beach Ball', primary: '#ff7a7a', light: '#ffe0e0', deep: '#8a2a2a', accent: '#8be9ff',
    trait: 'Bouncy — arrives at every gathering already mid-jump.',
    blurb: 'A striped, round friend who lives for the beach, the pool, and any excuse to bounce.',
    greeting: 'Throw me! I promise I will come back. Probably.', likes: 'Coconut Water',
  },
  lanternfox: {
    name: 'Lantern Fox', primary: '#ffb347', light: '#ffe6c2', deep: '#6b3a08', accent: '#ffd166',
    trait: 'Guiding — carries a paper lantern and walks the harbor path every evening.',
    blurb: 'A warm orange fox with a lantern tail that lights the way home for everyone.',
    greeting: 'The path is lit. Follow me, I know the good dock.', likes: 'Moon Cake',
  },
  jester: {
    name: 'Jester Prank', primary: '#b69cff', light: '#f0e9ff', deep: '#3d2a6b', accent: '#ffd166',
    trait: 'Playful — every joke is harmless and every harmless thing becomes a joke.',
    blurb: 'A tiny jester with a bell-tipped hat, a deck of joke cards, and perfect timing.',
    greeting: 'Why did the sprite cross the Hollow? To get to your snack drawer.', likes: 'Candyfloss',
  },
};

const SEASONAL_GENES = {
  springchick: ['First Peep', '🐣', '+18% XP and gifts arrive 15% sooner.', { xp: 1.18, giftSpeed: 1.15 }],
  egghunt: ['Hidden Egg', '🥚', 'Games pay +4 coins and gifts arrive 20% sooner.', { gameCoins: 4, giftSpeed: 1.2 }],
  sunspark: ['Sunbeam', '☀️', '+20% XP and day games pay +3 coins.', { xp: 1.2, dayCoins: 3 }],
  beachball: ['Bounce', '🏖️', 'Joy fades 25% slower and games pay +3 coins.', { joyDecay: 0.75, gameCoins: 3 }],
  lanternfox: ['Lantern Light', '🏮', 'Night games pay +4 coins and +12% XP.', { nightCoins: 4, xp: 1.12 }],
  jester: ['Prank Trick', '🃏', 'Games pay +5 coins and chats pay +2 coins.', { gameCoins: 5, chatCoins: 2 }],
};

const SEASONAL_TITANS = {
  springchick: 'Peep Titan',
  egghunt: 'Basket Titan',
  sunspark: 'Solar Titan',
  beachball: 'Bounce Titan',
  lanternfox: 'Lantern Titan',
  jester: 'Jester Titan',
};

const SEASONAL_PRICES = {
  springchick: 120, egghunt: 130, sunspark: 135, beachball: 95, lanternfox: 150, jester: 140,
};

const SEASONAL_HOMES = {
  springchick: ['sakura', 'grove'],
  egghunt: ['sakura', 'sugar'],
  sunspark: ['skyisles', 'tide'],
  beachball: ['tide', 'reef'],
  lanternfox: ['lanternbay', 'night'],
  jester: ['memecore', 'sugar'],
};

const SEASONAL_HYBRIDS = {
  'springchick+bloom': 'Peep Bloom',
  'egghunt+bunny': 'Egg Basket',
  'sunspark+radiant': 'Solar Flare',
  'beachball+tide': 'High Bounce',
  'lanternfox+firefly': 'Harbor Light',
  'jester+trollface': 'Prank Court',
};

Object.entries(SEASONAL_KINDS).forEach(([key, meta]) => {
  const gene = SEASONAL_GENES[key];
  ELEMENTS[key] = {
    name: meta.name,
    primary: meta.primary, light: meta.light, deep: meta.deep, accent: meta.accent,
    trait: meta.trait, blurb: meta.blurb, greeting: meta.greeting, likes: meta.likes,
    seasonal: true,
  };
  GENE_POWERS[key] = { name: gene[0], icon: gene[1], desc: gene[2], effect: gene[3] };
  TITAN_NAMES[key] = SEASONAL_TITANS[key];
  TYPE_EGG_BASE_PRICE[key] = SEASONAL_PRICES[key];
  TYPE_EGG_PRICE[key] = discountedEggPrice(SEASONAL_PRICES[key]);
  NAME_START[key] = [meta.name.split(' ')[0], 'Spring', 'Sun', 'Bounce', 'Glow', 'Prank', 'Gift', 'Season'];
  (SEASONAL_HOMES[key] || []).forEach((scene) => {
    if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
  });
});
Object.assign(HYBRID_NAMES, SEASONAL_HYBRIDS);
ELEMENT_KEYS.push(...Object.keys(SEASONAL_KINDS));

const SEASONAL_KEYS = Object.keys(SEASONAL_KINDS);

/* ---------- world days: national days and international observances ----------
   Fixed Gregorian dates only. Lunar and astronomical holidays (Lunar New Year,
   Diwali, Eid, Hanukkah, Easter) move every year and are already covered by
   their own Hollow festivals; pinning them here would print them on the wrong
   day. Each entry is a real one- or three-day observance with the country or
   body that keeps it, so a national day reads as an event rather than a skin. */

const WORLD_DAYS = {
  australia: { name: 'Australia Day', icon: '🇦🇺', kind: 'national', region: 'Australia', start: [0, 26], end: [0, 26], color: '#ffd166', treat: 'candy', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.1, blurb: 'A late-summer holiday of beach cricket, sausages, and new citizens.' },
  japanfoundation: { name: 'Foundation Day', icon: '🇯🇵', kind: 'national', region: 'Japan', start: [1, 11], end: [1, 11], color: '#ff8fa3', treat: 'mooncake', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.1, blurb: 'Japan remembers its founding with flags, quiet walks, and a long weekend.' },
  stpatricks: { name: 'St Patrick’s Day', icon: '☘️', kind: 'heritage', region: 'Ireland', start: [2, 17], end: [2, 17], color: '#7ee787', treat: 'honeycake', coinMult: 1.12, giftSpeed: 1.1, xpMult: 1.1, blurb: 'Green everywhere, parades in the rain, and a shamrock pinned to every coat.' },
  nowruz: { name: 'Nowruz', icon: '🌱', kind: 'heritage', region: 'Persia & Central Asia', start: [2, 20], end: [2, 21], color: '#a3e635', treat: 'starfruit', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.15, blurb: 'The new year of spring: a table of seven greens, mirrors, and sprouting wheat.' },
  songkran: { name: 'Songkran', icon: '💦', kind: 'national', region: 'Thailand', start: [3, 13], end: [3, 15], color: '#8be9ff', treat: 'coconutwater', coinMult: 1.12, giftSpeed: 1.15, xpMult: 1.12, blurb: 'Water poured over hands and shoulders, then over absolutely everyone else.' },
  earthday: { name: 'Earth Day', icon: '🌍', kind: 'world', region: 'International', start: [3, 22], end: [3, 22], color: '#7ee787', treat: 'apple', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.15, blurb: 'Plant something, mend something, and thank the moss for holding the Hollow up.' },
  worldbook: { name: 'World Book Day', icon: '📚', kind: 'world', region: 'International', start: [3, 23], end: [3, 23], color: '#c084fc', treat: 'hotcocoa', coinMult: 1.08, giftSpeed: 1.1, xpMult: 1.2, blurb: 'A day for stories, borrowed paperbacks, and reading one more chapter.' },
  freedomday: { name: 'Freedom Day', icon: '🇿🇦', kind: 'national', region: 'South Africa', start: [3, 27], end: [3, 27], color: '#ffd166', treat: 'candy', coinMult: 1.12, giftSpeed: 1.1, xpMult: 1.12, blurb: 'South Africa marks its first free election with song, food, and long tables.' },
  mayday: { name: 'May Day', icon: '🎈', kind: 'world', region: 'International', start: [4, 1], end: [4, 1], color: '#ff8fc8', treat: 'candyfloss', coinMult: 1.12, giftSpeed: 1.15, xpMult: 1.1, blurb: 'Ribbons, maypoles, and a basket of flowers left on a neighbour’s step.' },
  cincodemayo: { name: 'Cinco de Mayo', icon: '🇲🇽', kind: 'national', region: 'Mexico', start: [4, 5], end: [4, 5], color: '#ff9f43', treat: 'candyfloss', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Music, papel picado, and a very long table of food in Puebla.' },
  norway: { name: 'Constitution Day', icon: '🇳🇴', kind: 'national', region: 'Norway', start: [4, 17], end: [4, 17], color: '#ff7a7a', treat: 'hotcocoa', coinMult: 1.12, giftSpeed: 1.1, xpMult: 1.12, blurb: 'Children’s parades, bunads, and an unreasonable amount of ice cream.' },
  italy: { name: 'Festa della Repubblica', icon: '🇮🇹', kind: 'national', region: 'Italy', start: [5, 2], end: [5, 2], color: '#7ee787', treat: 'starfruit', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.12, blurb: 'Italy celebrates the republic with flyovers, open gardens, and long lunches.' },
  philippines: { name: 'Independence Day', icon: '🇵🇭', kind: 'national', region: 'Philippines', start: [5, 12], end: [5, 12], color: '#8be9ff', treat: 'coconutwater', coinMult: 1.12, giftSpeed: 1.1, xpMult: 1.12, blurb: 'Flags on every jeepney, parades at dawn, and a feast by noon.' },
  midsummer: { name: 'Midsummer', icon: '🌞', kind: 'heritage', region: 'Nordic countries', start: [5, 21], end: [5, 21], color: '#ffd166', treat: 'starfruit', coinMult: 1.12, giftSpeed: 1.15, xpMult: 1.15, blurb: 'Flower crowns, a maypole, and a sun that refuses to set.' },
  canada: { name: 'Canada Day', icon: '🇨🇦', kind: 'national', region: 'Canada', start: [6, 1], end: [6, 1], color: '#ff7a7a', treat: 'candy', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Maple leaf flags, fireworks over the water, and a very polite crowd.' },
  us: { name: 'Independence Day', icon: '🇺🇸', kind: 'national', region: 'United States', start: [6, 4], end: [6, 4], color: '#8be9ff', treat: 'candyfloss', coinMult: 1.15, giftSpeed: 1.15, xpMult: 1.12, blurb: 'Cookouts, sparklers, and fireworks reflected in every window.' },
  tanabata: { name: 'Tanabata', icon: '🎋', kind: 'heritage', region: 'Japan', start: [6, 7], end: [6, 7], color: '#c084fc', treat: 'mooncake', coinMult: 1.1, giftSpeed: 1.12, xpMult: 1.15, blurb: 'Wishes written on coloured paper and hung from bamboo until the stars meet.' },
  france: { name: 'Bastille Day', icon: '🇫🇷', kind: 'national', region: 'France', start: [7, 14], end: [7, 14], color: '#8be9ff', treat: 'honeycake', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Fireworks, firemen’s balls, and a picnic that runs past midnight.' },
  india: { name: 'Independence Day', icon: '🇮🇳', kind: 'national', region: 'India', start: [7, 15], end: [7, 15], color: '#ff9f43', treat: 'starfruit', coinMult: 1.15, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Kites in the morning, flags on every roof, and sweets passed hand to hand.' },
  indonesia: { name: 'Independence Day', icon: '🇮🇩', kind: 'national', region: 'Indonesia', start: [7, 17], end: [7, 17], color: '#ff7a7a', treat: 'coconutwater', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Three-legged races, flag parades, and a whole village climbing for prizes.' },
  brazil: { name: 'Independence Day', icon: '🇧🇷', kind: 'national', region: 'Brazil', start: [8, 7], end: [8, 7], color: '#7ee787', treat: 'candyfloss', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Green and gold everywhere, military parades, and a long weekend at the beach.' },
  mexicoday: { name: 'Día de la Independencia', icon: '🇲🇽', kind: 'national', region: 'Mexico', start: [8, 16], end: [8, 16], color: '#ff9f43', treat: 'candy', coinMult: 1.15, giftSpeed: 1.12, xpMult: 1.12, blurb: 'The Grito at midnight, chiles en nogada, and fireworks until dawn.' },
  china: { name: 'National Day', icon: '🇨🇳', kind: 'national', region: 'China', start: [9, 1], end: [9, 1], color: '#ff7a7a', treat: 'mooncake', coinMult: 1.15, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Flags along every street and a week of travel, food, and family.' },
  nigeria: { name: 'Independence Day', icon: '🇳🇬', kind: 'national', region: 'Nigeria', start: [9, 1], end: [9, 1], color: '#7ee787', treat: 'starfruit', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Green-white-green bunting, parades, and jollof rice at every table.' },
  germany: { name: 'German Unity Day', icon: '🇩🇪', kind: 'national', region: 'Germany', start: [9, 3], end: [9, 3], color: '#ffd166', treat: 'hotcocoa', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'A national holiday of open doors, street food, and one shared history.' },
  hangul: { name: 'Hangul Day', icon: '🇰🇷', kind: 'national', region: 'South Korea', start: [9, 9], end: [9, 9], color: '#8be9ff', treat: 'mooncake', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.18, blurb: 'A day off to celebrate the alphabet that made everyone a reader.' },
  spain: { name: 'Fiesta Nacional', icon: '🇪🇸', kind: 'national', region: 'Spain', start: [9, 12], end: [9, 12], color: '#ff9f43', treat: 'honeycake', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Parades in Madrid, autumn light, and a very late dinner.' },
  turkey: { name: 'Republic Day', icon: '🇹🇷', kind: 'national', region: 'Türkiye', start: [9, 29], end: [9, 29], color: '#ff7a7a', treat: 'candy', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'Torchlight parades and fireworks over the Bosphorus.' },
  poland: { name: 'Independence Day', icon: '🇵🇱', kind: 'national', region: 'Poland', start: [10, 11], end: [10, 11], color: '#ff8fa3', treat: 'honeycake', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'White-and-red flags, marching bands, and a shared bowl of soup.' },
  worldkindness: { name: 'World Kindness Day', icon: '🤝', kind: 'world', region: 'International', start: [10, 13], end: [10, 13], color: '#ffb3d1', treat: 'honeycake', coinMult: 1.1, giftSpeed: 1.15, xpMult: 1.15, blurb: 'One small kindness, repeated, is the whole point of the day.' },
  humanrights: { name: 'Human Rights Day', icon: '🕊️', kind: 'world', region: 'International', start: [11, 10], end: [11, 10], color: '#8be9ff', treat: 'hotcocoa', coinMult: 1.1, giftSpeed: 1.1, xpMult: 1.18, blurb: 'A day to read the declaration and mean it.' },
  kenya: { name: 'Jamhuri Day', icon: '🇰🇪', kind: 'national', region: 'Kenya', start: [11, 12], end: [11, 12], color: '#ff7a7a', treat: 'starfruit', coinMult: 1.12, giftSpeed: 1.12, xpMult: 1.12, blurb: 'A republic’s birthday, marked with parades, song, and nyama choma.' },
  newyearseve: { name: 'New Year’s Eve', icon: '🎊', kind: 'world', region: 'International', start: [11, 31], end: [11, 31], color: '#c084fc', treat: 'candyfloss', coinMult: 1.2, giftSpeed: 1.2, xpMult: 1.15, blurb: 'Countdowns in every timezone, one at a time, all the way round the world.' },
};

Object.assign(HOLIDAYS, WORLD_DAYS);

