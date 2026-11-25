/* Rarity economy.

   The archive's rarity tiers are not just a label: they set what a species' egg
   costs, how often that species shows up in the wild, and how far a merge can
   push a child up the ladder. Loaded after every wave file so the complete egg
   table exists, and once only — the applied set keeps a reload from compounding
   the multipliers. */

const RARITY_PRICE_MULT = Object.fromEntries(RARITY_SPEC_KEYS
  .filter((key) => Number(RARITY_SPEC[key].priceMult) > 0)
  .map((key) => [key, RARITY_SPEC[key].priceMult]));

/* Relative wild weights: a Common is 60,000x likelier to wander in than an
   Ultra Secret, which is the collection sheet's own 60% / 0.001% spread.

   Every ladder tier must be strictly rarer than the one below it. Exotic and
   secret were transposed (exotic read 0.02 against secret's 0.01), and the
   three apex shares were entered out of order — ancient was the rarest of the
   three at 0.0001 while celestial sat at 0.0005. The values are the same
   numbers, reassigned to the tiers the ladder actually puts in that order;
   tests/rarity-tier-coverage.test.js fails if that slips again. */
const RARITY_SPAWN_WEIGHT = Object.fromEntries(RARITY_SPEC_KEYS
  .filter((key) => Number(RARITY_SPEC[key].spawnWeight) > 0)
  .map((key) => [key, RARITY_SPEC[key].spawnWeight]));
const RARITY_LADDER = RARITY_SPEC_KEYS.slice();
/* Idempotent: the first pass snapshots the untouched price, so a second call
   (or a hot reload) scales from the original instead of compounding. */
const RARITY_ECONOMY_ORIGINAL = {};

function applyRarityEggPrices() {
  if (typeof TYPE_EGG_PRICE === 'undefined' || typeof TYPE_EGG_BASE_PRICE === 'undefined') return 0;
  let scaled = 0;
  Object.keys(TYPE_EGG_BASE_PRICE).forEach((key) => {
    if (!RARITY_ECONOMY_ORIGINAL[key]) {
      RARITY_ECONOMY_ORIGINAL[key] = { price: TYPE_EGG_PRICE[key] || TYPE_EGG_BASE_PRICE[key] };
    }
    /* The base price stays untouched: it is what typeEggRarity() reads, so the
       tier a species belongs to never drifts as its sale price moves. */
    const tier = typeof typeEggRarity === 'function' ? typeEggRarity(key) : 'common';
    const mult = RARITY_PRICE_MULT[tier] || 1;
    const original = RARITY_ECONOMY_ORIGINAL[key];
    const next = Math.round((original.price * mult) / 5) * 5;
    if (TYPE_EGG_PRICE[key] !== next) scaled += 1;
    TYPE_EGG_PRICE[key] = next;
  });
  return scaled;
}

window.applyRarityEggPrices = applyRarityEggPrices;
applyRarityEggPrices();
/* Again once the app has booted: wave and save-migration code can add species
   rows during start-up, and those arrive after the first pass. */
if (typeof setTimeout === 'function') setTimeout(applyRarityEggPrices, 0);

/* A wild encounter rolled on rarity weights instead of uniformly, so a walk in
   the Hollow still mostly turns up starter species. */
window.wildSpeciesRoll = function wildSpeciesRoll() {
  const list = (typeof WILD_SPECIES !== 'undefined' && Array.isArray(WILD_SPECIES) ? WILD_SPECIES : [])
    .filter((key) => typeof ELEMENTS === 'undefined' || ELEMENTS[key]);
  if (!list.length) return typeof pick === 'function' && typeof ELEMENTS !== 'undefined' ? pick(Object.keys(ELEMENTS)) : null;
  /* Weights are shared out inside each tier, so a tier with forty species does
     not swamp a tier with six: the tier's total share is what the sheet says. */
  const tierCount = {};
  const tiers = list.map((key) => {
    const tier = typeof typeEggRarity === 'function' ? typeEggRarity(key) : 'common';
    tierCount[tier] = (tierCount[tier] || 0) + 1;
    return tier;
  });
  const rows = list.map((key, i) => {
    const tier = tiers[i];
    return { key, weight: (RARITY_SPAWN_WEIGHT[tier] || 1) / (tierCount[tier] || 1) };
  });
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < rows.length; i += 1) {
    roll -= rows[i].weight;
    if (roll <= 0) return rows[i].key;
  }
  return rows[rows.length - 1].key;
};

window.puffleSpawnWeight = function puffleSpawnWeight(key) {
  const tier = typeof typeEggRarity === 'function' ? typeEggRarity(key) : 'common';
  return RARITY_SPAWN_WEIGHT[tier] || 1;
};

/* Merging two rare parents lifts the child's rarity roll instead of leaving it
   to the base egg table: rare pairs +1, legendary pairs +1 or +2. */
window.rarityBreedShift = function rarityBreedShift(a, b) {
  const index = (key) => (typeof typeEggRarity === 'function' ? RARITY_LADDER.indexOf(typeEggRarity(key)) : 0);
  const low = Math.min(index(a), index(b));
  if (low < RARITY_LADDER.indexOf('rare')) return 0;
  if (low < RARITY_LADDER.indexOf('legendary')) return 1;
  return 2;
};

window.RARITY_PRICE_MULT = RARITY_PRICE_MULT;
window.RARITY_SPAWN_WEIGHT = RARITY_SPAWN_WEIGHT;


/* Shop-card explainer: why this egg costs what it does, and how often its
   species turns up in the wild. */
window.puffleEconomyChips = function puffleEconomyChips(key, rank) {
  const tier = rank || (typeof typeEggRarity === 'function' ? typeEggRarity(key) : 'common');
  const mult = RARITY_PRICE_MULT[tier] || 1;
  const weight = RARITY_SPAWN_WEIGHT[tier] || 0;
  /* Reads like a rarity card, not a spreadsheet: anything under a tenth of a
     percent is "under 0.1%" rather than 0.010%. */
  const share = weight >= 1 ? weight.toFixed(0) + '%'
    : weight >= 0.5 ? weight.toFixed(1) + '%'
      : weight >= 0.005 ? 'under 0.1%'
        : 'under 0.01%';
  const label = rank ? rank.replace(/_/g, ' ') : tier.replace(/_/g, ' ');
  return `<span class="te-eco" title="Rarity ${label}: price ×${mult}, wild share ${share}">×${mult} price · ${share} wild</span>`;
};
