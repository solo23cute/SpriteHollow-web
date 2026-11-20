/* Multi-summon gates: 10x, 25x, 50x, 100x, event banners, pity, results. */

const SUMMON_PITY_KEY = 'sprite-hollow.summon-pity.v1';
const SUMMON_PITY_LIMIT = 40;
const SUMMON_JACKPOT_TIERS = ['secret', 'celestial', 'creator'];
const SUMMON_RARITY_ORDER = typeof RARITY_LADDER !== 'undefined'
  ? RARITY_LADDER
  : (typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER : []);

const SUMMON_ELEMENT_PORTALS = [
  { icon: '🔥', color: '#ff8a3a' }, { icon: '💧', color: '#58b8ff' },
  { icon: '🌿', color: '#67d98b' }, { icon: '⚡', color: '#ffe06a' },
  { icon: '❄️', color: '#8fe3ff' }, { icon: '🌪️', color: '#b8f0e8' },
  { icon: '🪨', color: '#c49b6b' }, { icon: '☠️', color: '#b18cff' },
  { icon: '⚙️', color: '#c9d2de' }, { icon: '💎', color: '#ff8fd6' },
  { icon: '☀️', color: '#fff4c4' }, { icon: '🌑', color: BRAND.accent },
  { icon: '🫧', color: '#8fe3ff' }, { icon: '🍬', color: '#ff8fd6' },
];

/* summonPickElement rolls two independent bonuses: +1 at 8% and another +1
   at 2%. The resulting lift is 0.9016 / 0.0968 / 0.0016 for +0 / +1 / +2. */
const SUMMON_RATE_STEPS = [
  { weight: 0.92 * 0.98, bump: 0 },
  { weight: 0.08 * 0.98 + 0.92 * 0.02, bump: 1 },
  { weight: 0.08 * 0.02, bump: 2 },
];

const SUMMON_PITY_ANIMATION = {
  prompt: 'lucky summon jackpot animation, screen shake effects, rapidly changing rarity colors, magical energy overload, unexpected ultra rare creature reveal, celebration effects, premium mobile game reward moment',
};

const SUMMON_BANNERS = [
  {
    key: 'single', group: 'multi', count: 1, min: 'common', price: 0, gen: 1, mutation: 0.08,
    name: '1× Starfall', icon: '✦', color: '#c9cdd2', color2: '#ffe9a3',
    subtitle: 'One egg, one answer', blurb: 'The single pull. A quick hello from the Hollow.',
    phases: ['One egg descends.', 'The summoning circle turns.', 'The shell cracks.', 'A new friend answers.'],
    prompt: 'Single creature summon animation, one magical egg descending into a softly glowing summoning circle, premium fantasy RPG collectible reveal',
  },
  {
    key: 'starfall', group: 'multi', count: 10, min: 'common', price: 0, gen: 1, mutation: 0.1,
    name: '10× Starfall', icon: '⭐', color: '#ffe9a3', color2: '#b18cff',
    subtitle: 'Ten eggs descend into the circle', blurb: 'The standard multi-summon. Highest rarity reveals last.',
    phases: ['Ten eggs descend from the sky.', 'The eggs spin into a summoning circle.', 'Rarity colours ignite beneath every shell.', 'Common cracks first. The rarest light lands last.'],
    prompt: 'Fantasy mobile RPG 10x summon animation, ten magical eggs floating above summoning circle, rarity colors glowing beneath each egg, crystal particles, magical explosions, collectible creature hatch sequence, premium fantasy game cinematic, vibrant visual effects',
  },
  {
    key: 'elemental', group: 'multi', count: 25, min: 'rare', price: 0, gen: 2, mutation: 0.14,
    name: '25× Elemental Convergence', icon: '🌟', color: '#58b8ff', color2: '#67d98b',
    subtitle: 'Twelve portals charge one crystal core', blurb: 'The 25× elemental cinematic. Every element answers together.',
    phases: ['Twelve elemental portals open around the core.', 'Energy beams pour into the giant crystal.', 'The crystal shatters into twenty-five shells.', 'Creatures emerge in a single elemental burst.'],
    prompt: 'Massive elemental creature summon animation, twelve magical elemental portals channeling energy into enormous crystal core, crystal explosion releasing twenty five creature eggs, premium fantasy RPG summoning cinematic, highly detailed magical effects, no empty space',
  },
  {
    key: 'astral', group: 'multi', count: 50, min: 'epic', price: 0, gen: 2, mutation: 0.18,
    name: '50× Astral Cascade', icon: '🌠', color: '#b18cff', color2: '#8fe3ff',
    subtitle: 'Twin eclipse rings open above the Hollow', blurb: 'A designed 50× cascade: two rings, fifty shells, one sky-wide reveal.',
    phases: ['Twin eclipse rings turn above the Hollow.', 'Fifty eggs spiral down the starlight.', 'The shells crack in a rolling constellation.', 'The rarest light lands on the final ring.'],
    prompt: 'Epic 50x astral summon cinematic, twin eclipse rings above a fantasy sky, fifty magical eggs spiraling down starlight, constellation crack effects, premium RPG gacha animation, ultra detailed, no empty space',
  },
  {
    key: 'omni', group: 'multi', count: 100, min: 'legendary', price: 0, gen: 3, mutation: 0.22,
    name: '100× Omni Genesis', icon: '🌌', color: '#fff4c4', color2: '#ff8fd6',
    subtitle: 'A galaxy collapses into one hundred eggs', blurb: 'The grand finale. Twelve portals, a singularity, and a hundred reveals.',
    phases: ['Twelve element portals open across the void.', 'The Creator Crown appears above the galaxy.', 'One hundred eggs orbit the collapsing core.', 'The singularity blooms into a rainbow sky.', 'Rarity reveals begin. The Creator tier pauses everything.'],
    prompt: 'Ultimate 100x summon animation, one hundred magical eggs orbiting giant galaxy core, twelve elemental portals channeling energy into cosmic singularity, rainbow universe explosion, premium fantasy creature collection cinematic, legendary RPG gacha animation, Creator tier reveal, ultra detailed, no empty space, blockbuster game trailer quality.',
  },
  {
    key: 'worldforge', group: 'event', featured: true, count: 10, min: 'legendary', price: 0, gen: 2, mutation: 0.28,
    name: 'Worldforge Puffle', icon: '🔥', color: '#ffb62e', color2: '#ff8fd6',
    subtitle: 'Featured event · Legendary or higher', blurb: 'The Worldforge is awake. Ten legendary shells, one shared sky.',
    phases: ['The Worldforge banner unfolds.', 'A ring of hammered gold circles the portal.', 'Ten legendary shells take shape.', 'The forge answers in light.'],
    prompt: 'Worldforge Puffle event summon cinematic, legendary golden forge portal, molten metal and cosmic sparks, ten magical eggs forming in a ring, premium fantasy RPG banner animation, ultra detailed',
  },
  {
    key: 'squishy', group: 'event', count: 10, min: 'uncommon', price: 0, gen: 2, mutation: 0.24, families: ['squishy'],
    name: 'Squishy Tide', icon: '🫧', color: '#8fe3ff', color2: '#ff9ec7',
    subtitle: 'Featured event · Squishy evolution types', blurb: 'A soft wave rolls in, carrying ten wobbling shells and their jelly-bright futures.',
    phases: ['A jelly tide rises through the Hollow.', 'Ten soft shells bob in the shimmer.', 'Bubblegum light fills every shell.', 'The wobble settles into a new friend.'],
    prompt: 'Squishy puffle summon cinematic, translucent jelly tide, bubblegum pastel portal, ten soft magical eggs bobbing in shimmering water, cute fantasy RPG creature reveal, premium mobile game animation',
  },
  {
    key: 'gummy', group: 'event', count: 10, min: 'rare', price: 0, gen: 2, mutation: 0.28, families: ['gummy'],
    name: 'Gummy Galaxy', icon: '🍬', color: '#ff8fd6', color2: '#8fe3ff',
    subtitle: 'Featured event · Gummy evolution types', blurb: 'Sugar stars align and ten translucent shells arrive with fruit-sweet light inside.',
    phases: ['A candy constellation appears.', 'Gummy stars align into a portal.', 'Ten translucent eggs catch the sugar light.', 'The galaxy tastes like a new beginning.'],
    prompt: 'Gummy puffle summon cinematic, candy galaxy portal, translucent sugar stars, ten gummy magical eggs, colorful fruit-sweet light, cute fantasy RPG creature reveal, premium mobile game animation',
  },
  {
    key: 'lunar', group: 'event', world: true, count: 10, min: 'rare', price: 0, gen: 2, mutation: 0.24,
    elements: ['moon', 'cosmic', 'crystal', 'water'], color: '#8fb8ff', color2: '#b18cff',
    portal: '🪐',
    portals: [{ icon: '🌙', color: '#b18cff' }, { icon: '🪐', color: '#8fb8ff' }, { icon: '💧', color: '#58b8ff' }, { icon: '💎', color: '#ff8fd6' }],
    name: 'Lunar Lowlands', icon: '🌙',
    subtitle: 'World gate · Moon, cosmic and crystal eggs', blurb: 'A quiet moon-path opens over the lowlands. Ten eggs roll in on silver tides.',
    phases: ['The moon-path unfolds.', 'Four world portals lean in close.', 'Silver shells gather in the grass.', 'The lowlands answer with a new friend.'],
    prompt: 'Lunar world gate summon cinematic, moonlit lowlands, four orbiting planet portals, silver and crystal eggs, soft cosmic light, premium fantasy RPG creature reveal',
  },
  {
    key: 'solar', group: 'event', world: true, count: 10, min: 'rare', price: 0, gen: 2, mutation: 0.25,
    elements: ['fire', 'light', 'earth'], color: '#ffb62e', color2: '#ff8a5c',
    portal: '☀️',
    portals: [{ icon: '☀️', color: '#fff4c4' }, { icon: '🔥', color: '#ff8a3a' }, { icon: '🪨', color: '#c49b6b' }, { icon: '⚡', color: '#ffe06a' }],
    name: 'Solar Foundry', icon: '☀️',
    subtitle: 'World gate · Sun, fire and earth eggs', blurb: 'The foundry sun leans close and ten warm shells are hammered into being.',
    phases: ['The foundry sun rises.', 'Four molten portals ring the anvil.', 'Warm shells take shape.', 'The forge gifts a new friend.'],
    prompt: 'Solar world gate summon cinematic, golden foundry sun, molten planet portals, fire and earth eggs, warm hammered light, premium fantasy RPG creature reveal',
  },
  {
    key: 'terra', group: 'event', world: true, count: 10, min: 'epic', price: 0, gen: 2, mutation: 0.3,
    elements: ['nature', 'earth', 'water'], color: '#67d98b', color2: '#8fe3ff',
    portal: '🌍',
    portals: [{ icon: '🌍', color: '#67d98b' }, { icon: '🌿', color: '#67d98b' }, { icon: '💧', color: '#58b8ff' }, { icon: '🪨', color: '#c49b6b' }],
    name: 'Terra Verde', icon: '🌍',
    subtitle: 'World gate · Nature, earth and water eggs', blurb: 'A living world turns its green face toward the Hollow and offers ten rooted eggs.',
    phases: ['A green world turns close.', 'Roots and rivers form four portals.', 'Ten mossy shells settle in.', 'The worldheart opens.'],
    prompt: 'Terra world gate summon cinematic, living green planet, root and river portals, mossy eggs, natural worldheart light, premium fantasy RPG creature reveal',
  },
  {
    key: 'frost', group: 'event', world: true, count: 10, min: 'rare', price: 0, gen: 2, mutation: 0.24,
    elements: ['ice', 'wind', 'crystal'], color: '#8fe3ff', color2: '#d7f6ff',
    portal: '🧊',
    portals: [{ icon: '❄️', color: '#8fe3ff' }, { icon: '🌪️', color: '#b8f0e8' }, { icon: '💎', color: '#ff8fd6' }, { icon: '🌑', color: BRAND.accent }],
    name: 'Frost Expanse', icon: '❄️',
    subtitle: 'World gate · Ice, wind and crystal eggs', blurb: 'A frozen world cracks open at the edge of the sky. Ten bright shells drift through.',
    phases: ['The frozen sky splits.', 'Four cold portals breathe out.', 'Bright shells drift on the wind.', 'The expanse settles around a new friend.'],
    prompt: 'Frost world gate summon cinematic, frozen planet edge, icy wind portals, crystal eggs drifting in snow light, premium fantasy RPG creature reveal',
  },
  {
    key: 'epic', group: 'event', count: 10, min: 'epic', price: 0, gen: 2, mutation: 0.2,
    name: 'Epic Burst', icon: '🟣', color: '#9a5cff', color2: '#d9c2ff',
    subtitle: 'Guaranteed Epic or higher', blurb: 'Purple runes, an arcane eye, and ten books opening at once.',
    phases: ['Purple runes cover the screen.', 'A massive arcane eye opens.', 'Eggs emerge from floating magic books.', 'Epic creatures descend.'],
    prompt: 'Epic rarity summon cinematic, giant arcane eye, glowing purple runes, magical books opening portals, epic fantasy creature reveals, premium RPG animation, highly detailed visual effects',
  },
  {
    key: 'legendary', group: 'event', count: 10, min: 'legendary', price: 0, gen: 2, mutation: 0.26,
    name: 'Legendary Festival', icon: '🟠', color: '#ffb62e', color2: '#ffe1a0',
    subtitle: 'Guaranteed Legendary or higher', blurb: 'The golden sky opens and crowns rain down.',
    phases: ['A golden sky appears.', 'Celestial trumpets sound.', 'A crown constellation forms.', 'Legendary eggs land on golden pedestals.'],
    prompt: 'Legendary creature festival summon animation, golden celestial sky, floating crowns, magical sunlight beams, legendary fantasy creatures emerging from sacred eggs, luxury monster collector cinematic',
  },
  {
    key: 'mythic', group: 'event', count: 10, min: 'mythic', price: 0, gen: 2, mutation: 0.32,
    name: 'Mythic Rift', icon: '🔴', color: '#ff4b5c', color2: '#ffb8c0',
    subtitle: 'Guaranteed Mythic or higher', blurb: 'Space cracks apart and dragon spirits circle the portal.',
    phases: ['Space cracks apart.', 'A crimson rift opens.', 'Dragon spirits circle the vortex.', 'Mythic eggs erupt from the void.'],
    prompt: 'Mythic fantasy summon cinematic, crimson dimensional rift, dragon spirit energy swirling around cosmic portal, ultimate creature reveal sequence, premium RPG summon animation, highly detailed',
  },
  {
    key: 'divine', group: 'event', count: 10, min: 'divine', price: 0, gen: 3, mutation: 0.4,
    name: 'Divine Gateway', icon: '✨', color: '#fff4c4', color2: '#ffffff',
    subtitle: 'Guaranteed Divine or higher', blurb: 'Sacred gates and a halo wide enough to fill the screen.',
    phases: ['Sacred gates appear.', 'A halo expands across the screen.', 'Divine eggs descend from the heavens.', 'Light beams reveal the creatures.'],
    prompt: 'Divine summon gateway animation, celestial golden gates opening, heavenly halos, holy light rays, divine creature reveal cinematic, fantasy RPG gacha sequence, premium mobile game animation',
  },
  {
    key: 'secret', group: 'event', count: 10, min: 'secret', price: 0, gen: 3, mutation: 0.46,
    name: 'Secret Prism', icon: '🌈', color: '#ff8fd6', color2: '#67f5d4',
    subtitle: 'Guaranteed Secret or higher', blurb: 'The screen glitches. Colours reverse. The prism answers.',
    phases: ['The screen glitches.', 'Colours reverse.', 'A rainbow prism erupts.', 'Secret Puffles materialise from the fragments.'],
    prompt: 'Secret rarity reveal animation, rainbow prism explosion, holographic fantasy energy, reality distortion effects, ultra rare creature summon cinematic, premium collector game animation',
  },
  {
    key: 'celestial', group: 'event', count: 10, min: 'celestial', price: 0, gen: 4, mutation: 0.5,
    name: 'Celestial Constellation', icon: '🌌', color: '#8f7cff', color2: '#8fe3ff',
    subtitle: 'Guaranteed Celestial or higher', blurb: 'Constellations connect and every creature gets its own star.',
    phases: ['The night sky forms.', 'Constellations connect across the galaxy.', 'Galaxies spin together.', 'Star eggs descend, one per constellation.'],
    prompt: 'Celestial summon cinematic, animated constellations connecting across galaxy sky, cosmic eggs descending from stars, premium fantasy creature reveal animation, ultra detailed universe effects',
  },
  {
    key: 'creator', group: 'event', count: 1, min: 'creator', price: 0, gen: 5, mutation: 0.6,
    name: 'Creator World Creation', icon: '👑', color: '#fff4c4', color2: '#ff8fd6',
    subtitle: 'One Origin Egg · guaranteed Creator', blurb: 'The void ignites, galaxies form, and the Origin Egg is written into being.',
    phases: ['An empty void.', 'The first star ignites.', 'Galaxies form and twelve element symbols appear.', 'The universe is created in real time. The Origin Egg forms.'],
    prompt: 'Creator tier creature summon cinematic, universe creation sequence, galaxies forming from nothing, elemental symbols orbiting cosmic egg, rainbow nebula explosion, Origin Nexus Puffle reveal, god-tier fantasy RPG animation, ultra detailed, no empty space',
  },
];

function summonPriceLabel(price) {
  const value = Number(price) || 0;
  return value > 0 ? `${value.toLocaleString('en-US')} 🪙` : 'Free';
}

function summonRank(key) {
  const index = SUMMON_RARITY_ORDER.indexOf(String(key || 'common'));
  return index >= 0 ? index : 0;
}

function summonRarityName(key) {
  return (typeof TYPE_EGG_RARITIES !== 'undefined' && TYPE_EGG_RARITIES[key]?.name) || String(key || 'Common');
}

function summonReadPity() {
  try {
    const raw = JSON.parse(localStorage.getItem(SUMMON_PITY_KEY) || 'null');
    return { pulls: Math.max(0, Number(raw?.pulls) || 0), best: raw?.best || null };
  } catch (err) {
    return { pulls: 0, best: null };
  }
}

function summonWritePity(pity) {
  try {
    localStorage.setItem(SUMMON_PITY_KEY, JSON.stringify(pity || { pulls: 0, best: null }));
  } catch (err) { /* private mode: pity meter resets next session */ }
}

function summonReducedMotion() {
  return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    || document.body.classList.contains('reduce-motion');
}

/* The exact element roster a gate rolls from. The rate table reads this same
   helper, so displayed odds cannot drift from the actual summon pool. */
function summonBannerPool(minKey, families = null, elements = null, exclude = null) {
  let roster = (typeof TYPE_EGG_SPECIES !== 'undefined' && TYPE_EGG_SPECIES.length)
    ? TYPE_EGG_SPECIES
    : (typeof ELEMENT_KEYS !== 'undefined' ? ELEMENT_KEYS : []);
  if (!roster.length) return { roster: [], pool: [], minIndex: Math.max(0, summonRank(minKey)) };
  const familyOf = (key) => (typeof window.puffleEvolutionLine === 'function'
    ? window.puffleEvolutionLine(key)?.family
    : null);
  if (Array.isArray(families) && families.length && typeof window.puffleEvolutionLine === 'function') {
    const familyRoster = roster.filter((key) => {
      const chain = window.puffleEvolutionLine(key);
      return chain && families.includes(chain.family);
    });
    if (familyRoster.length) roster = familyRoster;
  }
  /* World gates draw from a themed slice of the egg pool. Evolution-line roots
     are matched through their family so a Terra gate can offer Nature puffle
     eggs, not just the base nature element. */
  if (Array.isArray(elements) && elements.length) {
    const themed = roster.filter((key) => elements.includes(key) || elements.includes(familyOf(key)));
    if (themed.length) roster = themed;
  }
  const minIndex = Math.max(0, summonRank(minKey));
  const qualified = roster.filter((key) => ELEMENTS[key] && summonRank(typeEggRarity(key)) <= minIndex);
  const base = qualified.length ? qualified : roster;
  const pool = exclude && typeof exclude.has === 'function'
    ? base.filter((key) => !exclude.has(key))
    : base;
  return { roster, minIndex, pool };
}

/* One sprite per species: every sprite, egg and retired resident counts, so a
   type that is already home can never be summoned a second time. Duplicates
   that existed before this rule stay untouched. */
function summonOwnedTypes() {
  const owned = new Set();
  const sprites = Array.isArray(state?.sprites) ? state.sprites : [];
  sprites.forEach((sprite) => {
    if (sprite?.element && ELEMENTS[sprite.element]) owned.add(sprite.element);
  });
  return owned;
}

function summonGatePool(banner, exclude = null) {
  if (!banner) return [];
  return summonBannerPool(banner.min, banner.families, banner.elements, exclude).pool;
}

function summonPickElement(minKey, forceIndex = null, families = null, elements = null, exclude = null) {
  const { pool, minIndex } = summonBannerPool(minKey, families, elements, exclude);
  if (!pool.length) return { element: null, boost: 0 };
  const element = pick(pool);
  const base = Math.max(0, summonRank(typeEggRarity(element)));
  let target = Math.max(minIndex, base);
  if (chance(0.08)) target += 1;
  if (chance(0.02)) target += 1;
  if (forceIndex != null) target = Math.max(target, forceIndex);
  target = Math.min(SUMMON_RARITY_ORDER.length - 1, target);
  return { element, boost: Math.max(0, target - base) };
}

function summonTierOrder() {
  return typeof RARITY_TIER_ORDER !== 'undefined' && Array.isArray(RARITY_TIER_ORDER)
    ? RARITY_TIER_ORDER
    : SUMMON_RARITY_ORDER.filter((key) => key !== 'ultra_secret');
}

function summonRatePercent(value) {
  const pct = Number(value) * 100;
  if (!Number.isFinite(pct) || pct <= 0) return '0%';
  if (pct < 0.0001) return '<0.0001%';
  if (pct < 0.01) return `${pct.toFixed(4)}%`;
  if (pct < 0.1) return `${pct.toFixed(3)}%`;
  if (pct < 1) return `${pct.toFixed(2)}%`;
  return `${pct.toFixed(1).replace(/\.0$/, '')}%`;
}

function summonCostLine(banner) {
  const count = Math.max(1, Number(banner.count) || 1);
  const total = Number(banner.price) || 0;
  if (!total) return `Free · ${count} egg${count === 1 ? '' : 's'}`;
  return `${total.toLocaleString('en-US')} 🪙 per gate · ${Math.round(total / count).toLocaleString('en-US')} 🪙 per egg`;
}

function summonPityReady(banner, pity) {
  return (Number(pity?.pulls) || 0) >= SUMMON_PITY_LIMIT
    && summonRank(banner.min) < summonRank('mythic');
}

function summonBannerRateData(banner, pityState = null, exclude = null) {
  const info = summonBannerPool(banner.min, banner.families, banner.elements, exclude);
  const order = summonTierOrder();
  const dist = new Map(order.map((key) => [key, 0]));
  const pool = info.pool || [];
  if (pool.length) {
    const share = 1 / pool.length;
    pool.forEach((key) => {
      const base = Math.max(0, order.indexOf(typeEggRarity(key)));
      const start = Math.max(info.minIndex, base);
      SUMMON_RATE_STEPS.forEach((step) => {
        const finalKey = order[Math.min(order.length - 1, Math.max(0, start + step.bump))];
        dist.set(finalKey, (dist.get(finalKey) || 0) + share * step.weight);
      });
    });
  }
  const total = order.reduce((sum, key) => sum + (dist.get(key) || 0), 0);
  if (total > 0) order.forEach((key) => dist.set(key, (dist.get(key) || 0) / total));
  const count = Math.max(1, Number(banner.count) || 1);
  const rows = order.map((key) => {
    const rate = dist.get(key) || 0;
    const gate = rate <= 0 ? 0 : count === 1 ? rate : 1 - Math.pow(1 - rate, count);
    const tier = TYPE_EGG_RARITIES[key] || {};
    return {
      key,
      name: tier.name || summonRarityName(key),
      color: tier.color || 'var(--muted)',
      rate,
      gate,
    };
  });
  return { pool, minIndex: info.minIndex, rows, count, pity: pityState || summonReadPity() };
}

function summonRatesLinkHTML(banner, data = null) {
  const rates = data || summonBannerRateData(banner, null, summonOwnedTypes());
  const top = rates.rows.filter((row) => row.rate > 0).sort((a, b) => b.rate - a.rate).slice(0, 3);
  const ready = summonPityReady(banner, rates.pity);
  const pityLabel = ready ? 'Pity ready' : `${Math.min(Number(rates.pity.pulls) || 0, SUMMON_PITY_LIMIT)}/${SUMMON_PITY_LIMIT} pity`;
  return `<button class="summon-rates-link" type="button" data-summon-rates="${banner.key}" style="--banner:${banner.color};--banner-2:${banner.color2 || banner.color}" aria-label="Rates, pity and drops for ${esc(banner.name)}">
    <span class="srl-preview">${top.length
      ? top.map((row) => `<span class="srl-rate" style="--rarity:${row.color}"><i aria-hidden="true"></i><span>${esc(row.name)}</span><b>${summonRatePercent(row.rate)}</b></span>`).join('')
      : '<span class="srl-rate"><span>No eligible pool</span></span>'}</span>
    <span class="srl-action"><span class="srl-pity${ready ? ' is-ready' : ''}">${pityLabel}</span><b>Rates &amp; drops ›</b></span>
  </button>`;
}

function summonRateTableHTML(banner, data) {
  const ready = summonPityReady(banner, data.pity);
  return `<section class="summon-rate-card" aria-label="Rarity rates">
    <div class="summon-rate-card-head"><div><div class="eyebrow">Per-egg odds</div><h3>Rarity rates</h3></div><span class="chip">${data.count}× gate</span></div>
    ${ready ? '<p class="summon-pity-live">Pity is ready: the first egg is guaranteed Mythic or higher. The normal rates below are shown for comparison.</p>' : ''}
    <div class="summon-rate-table" role="table" aria-label="Rarity odds per egg and per gate">
      <div class="srt-head" role="row"><span>Rarity</span><span>Per egg</span><span>At least 1</span></div>
      ${data.rows.map((row) => `<div class="srt-row${row.rate > 0 ? '' : ' is-empty'}" role="row">
        <span class="srt-name"><i style="background:${row.color}" aria-hidden="true"></i>${esc(row.name)}</span>
        <b>${summonRatePercent(row.rate)}</b>
        <span>${summonRatePercent(row.gate)}</span>
      </div>`).join('')}
    </div>
    <p class="summon-rates-note">Per-egg rates total 100%. “At least 1” is the chance that this ${data.count}× gate contains one or more of that rarity.</p>
  </section>`;
}

function summonPityRuleHTML(banner, data) {
  const floorAlready = summonRank(banner.min) >= summonRank('mythic');
  const ready = summonPityReady(banner, data.pity);
  return `<section class="summon-rate-card summon-pity-rule">
    <div class="between"><div><div class="eyebrow">Pity rule</div><h3>${data.pity.pulls} / ${SUMMON_PITY_LIMIT}</h3></div><span class="chip">Mythic+</span></div>
    <p>Every egg without a <b>Mythic or higher</b> adds to the meter. At <b>${SUMMON_PITY_LIMIT}</b>, the <b>first egg</b> of the next gate is forced to <b>Mythic or higher</b>. Any Mythic+ resets the meter; the rest of a multi-pull keeps normal rates.</p>
    ${floorAlready ? `<p class="summon-rates-note">This gate already guarantees ${esc(summonRarityName(banner.min))}+ on every egg, so pity does not change its floor.</p>` : ''}
    ${ready ? '<p class="summon-pity-live">Pity ready: the first egg of this gate is guaranteed Mythic+.</p>' : ''}
  </section>`;
}

function summonDropGroups(banner, data) {
  const groups = new Map();
  data.pool.forEach((key) => {
    const tier = typeEggRarity(key);
    if (!groups.has(tier)) groups.set(tier, []);
    groups.get(tier).push(key);
  });
  const order = summonTierOrder();
  return Array.from(groups.entries()).sort((a, b) => {
    const ai = order.indexOf(a[0]);
    const bi = order.indexOf(b[0]);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

function summonDropListHTML(banner, data) {
  const groups = summonDropGroups(banner, data);
  const filterBits = [];
  if (Array.isArray(banner.families) && banner.families.length) filterBits.push(`families: ${banner.families.join(', ')}`);
  if (Array.isArray(banner.elements) && banner.elements.length) filterBits.push(`elements: ${banner.elements.join(', ')}`);
  if (!filterBits.length) filterBits.push('all non-Vault types');
  return `<section class="summon-rate-card">
    <div class="between"><div><div class="eyebrow">What can drop</div><h3>${data.pool.length.toLocaleString('en-US')} types</h3></div><span class="chip">${filterBits.join(' · ')}</span></div>
    <p class="summon-rates-note">Base rarity is listed. The gate's +0/+1/+2 rarity roll can raise any drop by up to two tiers, which is already included in the rates above. Types already home are skipped, so every gate offers one of each type only.</p>
    <div class="summon-drop-groups">${groups.map(([tier, keys]) => {
      const meta = TYPE_EGG_RARITIES[tier] || { name: summonRarityName(tier), color: 'var(--muted)' };
      const names = keys.slice().sort((a, b) => (ELEMENTS[a]?.name || a).localeCompare(ELEMENTS[b]?.name || b))
        .map((key) => esc(ELEMENTS[key]?.name || key)).join(' · ');
      return `<details class="summon-drop-group">
        <summary><span class="sdg-title"><i style="background:${meta.color}" aria-hidden="true"></i>${esc(meta.name)} <em>${keys.length.toLocaleString('en-US')}</em></span><span class="sdg-open">Show</span></summary>
        <p class="summon-drop-names">${names}</p>
      </details>`;
    }).join('')}</div>
  </section>`;
}

function summonRatesSheetHTML(banner) {
  const data = summonBannerRateData(banner, null, summonOwnedTypes());
  return `<div class="summon-rates-sheet">
    <div class="summon-rate-meta"><span class="chip">${banner.count}×</span><span class="chip">${summonCostLine(banner)}</span><span class="chip">${data.pool.length.toLocaleString('en-US')} types</span></div>
    ${summonRateTableHTML(banner, data)}
    ${summonPityRuleHTML(banner, data)}
    ${summonDropListHTML(banner, data)}
  </div>`;
}

function openSummonRates(key) {
  const banner = SUMMON_BANNERS.find((entry) => entry.key === key);
  if (!banner) return;
  openSheet({
    title: `${banner.icon} ${banner.name}`,
    sub: `${banner.count}× gate · ${summonCostLine(banner)}`,
    body: summonRatesSheetHTML(banner),
    key: `summon-rates-${banner.key}`,
  });
}

function summonNewSprite(banner, forceIndex = null, exclude = null) {
  const picked = summonPickElement(banner.min, forceIndex, banner.families, banner.elements, exclude);
  if (!picked.element) return null;
  const sprite = rollEgg('common', {
    element: picked.element,
    eggLabel: `${banner.name} Egg`,
    rarityBoost: picked.boost,
    mutation: banner.mutation,
    gen: banner.gen,
    shinyEgg: false,
  });
  sprite.stage = 'baby';
  sprite.level = 1;
  sprite.xp = 0;
  sprite.hatch = 100;
  sprite.bond = 10;
  sprite.born = Date.now();
  sprite.needs = { hunger: 72, energy: 78, joy: 76, clean: 88 };
  sprite.name = makeName(picked.element);
  if (!sprite.shiny && chance(0.035)) sprite.shiny = true;
  return sprite;
}

function summonPerform(banner) {
  if (!banner) return null;
  const owned = summonOwnedTypes();
  const available = summonGatePool(banner, owned);
  if (!available.length) {
    toast(`${banner.name} has no new types left — every type in that gate is already home.`, '🧬');
    Sfx.error();
    return null;
  }
  /* A pull can never repeat a type, so the last few unowned types make a
     shorter gate instead of handing back duplicates. */
  const pullCount = Math.min(Math.max(1, Number(banner.count) || 1), available.length);
  const price = banner.price > 0
    ? Math.round(banner.price * pullCount / Math.max(1, Number(banner.count) || 1))
    : 0;
  if (price > 0 && state.coins < price) {
    toast(`You need ${price - state.coins} more coins for ${banner.name}.`, '🪙');
    Sfx.error();
    return null;
  }
  const before = summonReadPity();
  const pity = before.pulls >= SUMMON_PITY_LIMIT && summonRank(banner.min) < summonRank('mythic');
  if (price > 0) addCoinsRaw(-price);
  const results = [];
  for (let i = 0; i < pullCount; i += 1) {
    const sprite = summonNewSprite(banner, pity && i === 0 ? summonRank('mythic') : null, owned);
    if (!sprite) break;
    state.sprites.push(sprite);
    owned.add(sprite.element);
    if (sprite.shiny) state.stats.shinies = (state.stats.shinies || 0) + 1;
    results.push(sprite);
  }
  if (!results.length) return null;
  results.sort((a, b) => summonRank(spriteRarityKey(a)) - summonRank(spriteRarityKey(b)));
  if (!state.activeId) state.activeId = results[0]?.id || null;
  const top = results[results.length - 1] || null;
  const hitMythic = results.some((sprite) => summonRank(spriteRarityKey(sprite)) >= summonRank('mythic'));
  const pityAfter = hitMythic ? 0 : before.pulls + results.length;
  summonWritePity({ pulls: pityAfter, best: top ? spriteRarityKey(top) : before.best });
  state.stats.summons = (state.stats.summons || 0) + results.length;
  commit('summon', { banner: banner.key, count: results.length, spriteId: results[0]?.id || null });
  return { banner, results, pity, pityBefore: before.pulls, pityAfter, requestedCount: banner.count, short: results.length < banner.count };
}

function summonOrbsHTML(results) {
  const radius = results.length >= 100 ? 178 : results.length >= 50 ? 158 : results.length >= 25 ? 132 : 112;
  return results.map((sprite, i) => {
    const rarity = spriteRarity(sprite);
    const angle = (i * 360 / Math.max(1, results.length)).toFixed(2);
    return `<i class="summon-orb" style="--angle:${angle}deg;--radius:${radius}px;--rarity:${rarity.color};--delay:${Math.min(620, i * 10)}ms"></i>`;
  }).join('');
}

function openSummonFlow(key) {
  const banner = SUMMON_BANNERS.find((entry) => entry.key === key);
  const run = summonPerform(banner);
  if (!run) return;
  Sfx.summonOpen(run.results.length);
  if (summonReducedMotion()) showSummonResults(run);
  else openSummonCinematic(run);
}

/* Last few pulls, newest first, so the hub can show a history panel. */
const SUMMON_HISTORY_KEY = 'sprite-hollow.summon-history.v1';

function summonReadHistory() {
  try {
    const raw = localStorage.getItem(SUMMON_HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((entry) => entry && entry.banner).slice(0, 8) : [];
  } catch (err) {
    return [];
  }
}

function summonWriteHistory(entry) {
  try {
    localStorage.setItem(SUMMON_HISTORY_KEY, JSON.stringify([entry, ...summonReadHistory()].slice(0, 8)));
  } catch (err) {
    /* A blocked localStorage only costs us the history panel. */
  }
}

function summonHistoryHTML() {
  const entries = summonReadHistory();
  if (!entries.length) {
    return '<section class="summon-history"><h3>Summon history</h3><p class="sh-empty">No pulls yet. The first gate is waiting.</p></section>';
  }
  return `<section class="summon-history"><h3>Summon history</h3><ol>${entries.map((entry) => {
    const color = TYPE_EGG_RARITIES[entry.top]?.color || '#fff';
    const mins = Math.max(0, Math.round((Date.now() - Number(entry.at || 0)) / 60000));
    const when = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`;
    return `<li style="--rarity:${color}"><i class="sh-dot"></i><b>${esc(entry.banner)}</b><span>${Number(entry.count) || 0}× ${esc(summonRarityName(entry.top || 'common'))}</span><small>${esc(when)}</small></li>`;
  }).join('')}</ol></section>`;
}

function openSummonCinematic(run) {
  const { banner, results } = run;
  const phases = banner.phases && banner.phases.length ? banner.phases : ['The summoning circle opens.', 'The eggs descend.', 'The shells crack.', 'The rarest light lands last.'];
  const top = results[results.length - 1];
  const topKey = top ? spriteRarityKey(top) : 'common';
  const topTier = top ? spriteRarity(top) : TYPE_EGG_RARITIES.common;
  const detected = summonRank(topKey) >= summonRank('legendary')
    ? `${topTier.icon} ${topTier.name} presence detected`
    : 'Rare presence detected';
  const portalSet = banner.portals || (banner.key === 'elemental' ? SUMMON_ELEMENT_PORTALS : null);
  const portals = portalSet && portalSet.length
    ? `<div class="summon-portals" aria-hidden="true">${portalSet.map((portal, i) => `<span style="--angle:${i * 360 / portalSet.length}deg;--portal:${portal.color}">${portal.icon}</span>`).join('')}</div>`
    : '';
  const markup = `<div class="summon-cinema${run.pity ? ' is-pity' : ''}" data-summon-banner="${banner.key}" style="--summon-accent:${banner.color};--summon-accent-2:${banner.color2 || banner.color}">
    <div class="summon-controls">
      <span class="summon-phase-label">${run.pity ? 'PITY BREAK' : 'SUMMONING'}</span>
      <div class="summon-control-buttons">
        <button class="btn btn-ghost btn-sm" type="button" data-summon-ff>⏩ Fast-forward</button>
        <button class="btn btn-gold btn-sm" type="button" data-summon-skip>Skip</button>
      </div>
    </div>
    <div class="summon-energy" aria-hidden="true"><i data-summon-energy></i></div>
    <div class="summon-cinema-stage" data-phase="0" role="button" tabindex="0" aria-label="Tap to skip the summon animation">
      <div class="summon-cinema-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      ${portals}
      <div class="summon-orbs" aria-hidden="true">${summonOrbsHTML(results)}</div>
      <div class="summon-cinema-core">
        <span class="summon-core-mark">${banner.icon}</span>
        <span class="summon-egg" aria-hidden="true">🥚</span>
        <b>${results.length}</b>
        <small>${esc(banner.name)}</small>
      </div>
      <div class="summon-energy-signature" aria-hidden="true"><span>Energy signature</span><i data-summon-signature></i></div>
      <div class="summon-seq-label" data-summon-seq>Summoning...</div>
      <div class="summon-cinema-copy"><b data-summon-title>${esc(banner.name)}</b><span data-summon-caption>${esc(phases[0])}</span></div>
    </div>
    <div class="summon-cinema-foot"><span>Tap the stage to skip.</span><span>Fast-forward plays the rest at 2.5×.</span></div>
  </div>`;
  let timer = null;
  let phase = 0;
  let speed = 1;
  let done = false;
  let keyHandler = null;
  const { overlay, close } = buildOverlay(markup, {
    center: true,
    dismissible: false,
    key: 'summon-cinema',
    onClose: () => {
      if (timer) clearTimeout(timer);
      if (keyHandler) window.removeEventListener('keydown', keyHandler);
    },
  });
  const cinema = overlay.querySelector('.summon-cinema');
  const stage = overlay.querySelector('.summon-cinema-stage');
  const caption = overlay.querySelector('[data-summon-caption]');
  const signature = overlay.querySelector('[data-summon-signature]');
  const energy = overlay.querySelector('[data-summon-energy]');
  const seq = overlay.querySelector('[data-summon-seq]');
  const ffButton = overlay.querySelector('[data-summon-ff]');
  const skipButton = overlay.querySelector('[data-summon-skip]');
  if (run.pity) setTimeout(() => Sfx.summonPity(), 140);

  function showPhase() {
    if (!caption) return;
    caption.textContent = phases[Math.min(phase, phases.length - 1)];
    stage.dataset.phase = String(phase);
    if (seq) {
      const last = phase >= phases.length - 1;
      seq.textContent = last ? detected : phase >= 2 ? 'Analyzing energy signature...' : 'Summoning...';
      seq.classList.toggle('is-detected', last);
    }
    const pct = Math.round(((phase + 1) / phases.length) * 100);
    if (signature) signature.style.width = `${Math.min(100, pct)}%`;
    if (energy) energy.style.width = `${Math.min(100, pct)}%`;
  }
  function finish() {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    close();
    Sfx.summonCue(topKey);
    showSummonResults(run);
  }
  function schedule() {
    if (done) return;
    if (phase >= phases.length - 1) {
      timer = setTimeout(finish, Math.max(180, 900 / speed));
      return;
    }
    timer = setTimeout(() => {
      phase += 1;
      showPhase();
      schedule();
    }, Math.max(120, (620 + phase * 110) / speed));
  }
  function fastForward() {
    if (done) return;
    speed = 3;
    cinema.classList.add('is-fast');
    ffButton.textContent = '⏩ Fast-forwarding';
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (phase < phases.length - 1) {
          phase += 1;
          showPhase();
        }
        schedule();
      }, 90);
    }
  }
  keyHandler = (event) => {
    if (event.key === 'Escape') finish();
    if (event.key === 'f' || event.key === 'F') fastForward();
  };
  window.addEventListener('keydown', keyHandler);
  ffButton.addEventListener('click', fastForward);
  skipButton.addEventListener('click', finish);
  stage.addEventListener('click', finish);
  stage.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    finish();
  });
  showPhase();
  schedule();
}

function summonPowerOf(sprite) {
  if (!sprite || typeof window.puffleBattleProfile !== 'function') return null;
  try {
    const profile = window.puffleBattleProfile(sprite);
    const total = profile && Number(profile.total);
    return total && total > 0 ? Math.round(total) : null;
  } catch (err) {
    return null;
  }
}

function openSummonPreview(sprite) {
  if (!sprite) return;
  const tier = spriteRarity(sprite);
  const power = summonPowerOf(sprite);
  const markup = `<div class="summon-preview" style="--rarity:${tier.color};--rarity-gradient:${tier.gradient || tier.color};--rarity-glow:${tier.frameGlow || tier.color}">
    <button class="icon-btn summon-preview-close" type="button" data-close aria-label="Close preview">${icon('close')}</button>
    <div class="summon-preview-art">${spriteSVG(sprite, { expr: 'love' })}</div>
    <div class="summon-preview-copy">
      <span class="summon-preview-tier">${tier.icon} ${esc(tier.name)}</span>
      <h3>${esc(displayName(sprite))}</h3>
      <p>${esc(typeName(sprite))} · ${esc(stageLabel(sprite))}${sprite.shiny ? ' · ✨ Shiny' : ''}</p>
      ${power ? `<span class="chip">⚔️ ${power} power</span>` : ''}
      <div class="summon-preview-actions">
        <button class="btn btn-gold btn-sm" type="button" data-preview-detail>Open details</button>
        <button class="btn btn-soft btn-sm" type="button" data-close>Back to results</button>
      </div>
      <p class="tiny muted">Tap a card once to flip it. Hold a card to open its full creature file.</p>
    </div>
  </div>`;
  const { overlay } = buildOverlay(markup, { center: true, dismissible: true, key: 'summon-preview' });
  const detail = overlay.querySelector('[data-preview-detail]');
  if (detail) detail.addEventListener('click', () => {
    if (typeof App !== 'undefined' && App.openDetail) App.openDetail(sprite.id);
  });
}

function summonResultCardHTML(sprite, opts) {
  const options = opts || {};
  const tier = spriteRarity(sprite);
  const key = spriteRarityKey(sprite);
  const owned = options.owned || 0;
  const lazyArt = !!options.lazyArt;
  const coversResults = !!options.covers;
  const special = typeof options.specialOf === 'function' ? options.specialOf(sprite) : summonRank(key) >= summonRank('secret');
  const hybridFrame = !!(sprite.hybrid || sprite.hybridParents);
  const splitFrame = typeof hybridSplitFrame === 'function' ? hybridSplitFrame(sprite) : null;
  return `<button class="summon-result-card" type="button" data-summon-result="${sprite.id}" data-rarity-key="${key}" data-rank="${summonRank(key)}" data-name="${esc(displayName(sprite))}" data-new="${owned === 0 ? '1' : '0'}" data-special="${special ? '1' : '0'}" data-revealed="${coversResults ? '0' : '1'}"${hybridFrame ? ' data-frame-hybrid="1"' : ''}${splitFrame ? ` data-frame-split="${splitFrame.wave}"` : ''} style="--rarity:${tier.color};--rarity-gradient:${tier.gradient || tier.color};--rarity-glow:${tier.frameGlow || tier.color}${splitFrame ? `;--split-a:${splitFrame.a};--split-b:${splitFrame.b}` : ''}">
      <span class="src-art"${lazyArt ? ` data-summon-art="${sprite.id}"` : ''}>${lazyArt ? '<span class="src-art-ph" aria-hidden="true">✦</span>' : spriteSVG(sprite, { expr: 'love', still: true })}</span>
      <span class="src-cover" aria-hidden="true"><span>✦</span><small>${esc(tier.name)}</small></span>
      <span class="src-rarity">${esc(tier.name)}</span>
      <b>${esc(displayName(sprite))}</b>
      <span class="src-meta">${esc(typeName(sprite))} · ${esc(stageLabel(sprite))}</span>
      ${owned ? `<span class="src-dup" title="${owned + 1} owned">×${owned + 1}</span>` : '<span class="src-new">NEW</span>'}
      ${sprite.shiny ? '<span class="src-shiny">✨</span>' : ''}
    </button>`;
}

function showSummonResults(run) {
  const { banner, results } = run;
  const counts = {};
  results.forEach((sprite) => {
    const key = spriteRarityKey(sprite);
    counts[key] = (counts[key] || 0) + 1;
  });
  const top = results[results.length - 1];
  const topTier = top ? spriteRarity(top) : TYPE_EGG_RARITIES.common;
  const topKey = top ? spriteRarityKey(top) : 'common';
  const isMobile = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 599px)').matches;
  const isSingle = results.length === 1;
  const isTen = results.length === 10;
  const isBig = results.length >= 50;
  /* Wide phone pulls land face-up by default, including 25x, 50x and 100x.
     The Studio switch restores the old tap-to-reveal covers on phones. */
  const coversResults = isMobile && results.length >= 25 && state.theme && state.theme.summonCovers === true;
  /* Large pulls build their card art lazily. Fifty full sprite SVGs in one
     innerHTML parse (plus a 4,000px grid) is what froze the results sheet on
     low-end phones; a wide 100-card pull is just as heavy and was blowing the
     smoke gate's skip budget. The cards below mount instantly and fill in as
     they scroll, on phones and on wide screens alike. */
  const lazyArt = isMobile ? results.length >= 25 : isBig;
  const jackpot = SUMMON_JACKPOT_TIERS.includes(topKey);
  const power = top ? summonPowerOf(top) : null;
  const elementName = top ? (ELEMENTS[top.element]?.name || typeName(top)) : '';
  const resultIds = new Set(results.map((sprite) => sprite.id));
  const ownedByElement = {};
  state.sprites.forEach((sprite) => {
    if (!sprite || resultIds.has(sprite.id)) return;
    ownedByElement[sprite.element] = (ownedByElement[sprite.element] || 0) + 1;
  });
  const specialOf = (sprite) => summonRank(spriteRarityKey(sprite)) >= summonRank('secret');
  const summary = Object.entries(counts)
    .sort((a, b) => summonRank(b[0]) - summonRank(a[0]))
    .map(([key, count]) => `<span class="chip" style="border-color:${TYPE_EGG_RARITIES[key]?.color || '#fff'}">${count}× ${esc(summonRarityName(key))}</span>`)
    .join('');
  const ordered = isMobile ? [...results].reverse() : results;
  const cards = ordered.map((sprite) => summonResultCardHTML(sprite, {
    owned: ownedByElement[sprite.element] || 0,
    lazyArt,
    covers: coversResults,
    specialOf,
  })).join('');
  const present = Object.keys(counts).sort((a, b) => summonRank(b) - summonRank(a));
  const newCount = ordered.filter((sprite) => !(ownedByElement[sprite.element] || 0)).length;
  const specialCount = ordered.filter(specialOf).length;
  const filters = results.length > 1
    ? `<div class="summon-result-filters" data-summon-filters>
        <button type="button" class="summon-filter is-active" data-summon-filter="all" style="--rarity:var(--gold)">All ${results.length}</button>
        ${newCount ? `<button type="button" class="summon-filter" data-summon-filter="new" style="--rarity:#6fd6ff">New ${newCount}</button>` : ''}
        ${present.map((key) => `<button type="button" class="summon-filter" data-summon-filter="${key}" style="--rarity:${TYPE_EGG_RARITIES[key]?.color || '#fff'}">${esc(summonRarityName(key))} ${counts[key]}</button>`).join('')}
        ${specialCount ? `<button type="button" class="summon-filter" data-summon-filter="special" style="--rarity:var(--gold)">Special ${specialCount}</button>` : ''}
      </div>`
    : '';
  const statsPanel = isBig
    ? `<details class="summon-stats">
        <summary>${results.length} summons completed · statistics</summary>
        <div class="summon-stats-grid">
          <div style="--rarity:#6fd6ff"><span>New species</span><b>${newCount}</b></div>
          ${present.map((key) => `<div style="--rarity:${TYPE_EGG_RARITIES[key]?.color || '#fff'}"><span>${esc(summonRarityName(key))}</span><b>${counts[key]}</b></div>`).join('')}
          ${specialCount ? `<div style="--rarity:var(--gold)"><span>Special</span><b>${specialCount}</b></div>` : ''}
        </div>
      </details>`
    : '';
  const canSummonAgain = summonGatePool(banner, summonOwnedTypes()).length > 0;
  const singlePanel = isSingle && top ? `<div class="summon-single${jackpot ? ' is-jackpot' : ''}" style="--rarity:${topTier.color};--rarity-gradient:${topTier.gradient || topTier.color};--rarity-glow:${topTier.frameGlow || topTier.color}">
      <div class="ss-kicker">Puffle found!</div>
      <div class="ss-art">${spriteSVG(top, { expr: 'love' })}</div>
      <h3>${esc(displayName(top))}</h3>
      <div class="ss-stats">
        <div><small>Rarity</small><b style="color:${topTier.color}">${esc(topTier.name)}</b></div>
        <div><small>Power</small><b>${power ? power.toLocaleString('en-US') : '—'}</b></div>
        <div><small>Element</small><b>${esc(elementName)}</b></div>
      </div>
      <div class="ss-actions">
        <button class="btn btn-gold btn-sm" type="button" data-summon-equip>Equip</button>
        <button class="btn btn-soft btn-sm" type="button" data-summon-share>Share</button>
      </div>
      ${top.shiny ? '<span class="ss-shiny">✨ Shiny</span>' : ''}
    </div>` : '';
  const jackpotPanel = jackpot && !isSingle && top ? `<section class="summon-creator-reveal" data-jackpot="${topKey}" data-creator-id="${top.id}" style="--rarity:${topTier.color};--rarity-gradient:${topTier.gradient || topTier.color}">
      <div class="scr-kicker">✦ New ${esc(topTier.name)} Puffle ✦</div>
      <div class="scr-body">
        <div class="scr-art">${spriteSVG(top, { expr: 'love', still: true })}</div>
        <div class="scr-copy">
          <span class="scr-tier">${topTier.icon} ${esc(topTier.name)}</span>
          <h3>${esc(displayName(top))}</h3>
          <p class="scr-power"><b>Power</b><span>${power ? power.toLocaleString('en-US') : '—'}</span></p>
          <p class="scr-meta">${esc(typeName(top))} · ${esc(stageLabel(top))}</p>
          <div class="scr-actions">
            <button class="btn btn-gold btn-sm" type="button" data-summon-equip>Equip</button>
            <button class="btn btn-soft btn-sm" type="button" data-summon-share>Share</button>
            <button class="btn btn-soft btn-sm" type="button" data-summon-shot>Screenshot</button>
          </div>
        </div>
      </div>
    </section>` : '';
  const markup = `<div class="summon-results${isMobile ? ' is-mobile' : ''}${isSingle ? ' is-single' : ''}${isTen ? ' is-ten' : ''}${isBig ? ' is-big' : ''}${jackpot ? ' is-jackpot' : ''}" data-summon-results data-count="${results.length}" style="--summon-accent:${banner.color};--summon-accent-2:${banner.color2 || banner.color}">
    <div class="summon-results-head">
      <div><div class="eyebrow">${isSingle ? 'Puffle found' : 'Summon complete'}</div><h2>${isSingle ? (top ? esc(displayName(top)) : 'New friend') : `${results.length} new friend${results.length === 1 ? '' : 's'}`}</h2><p class="sub">${esc(banner.name)} · ${esc(banner.subtitle)}</p></div>
      <button class="icon-btn" data-close aria-label="Close">${icon('close')}</button>
    </div>
    ${isSingle ? '' : `<div class="summon-result-tools">
      ${coversResults ? '<button class="summon-tool" type="button" data-summon-reveal-all>👁 Reveal all</button>' : ''}
      <button class="summon-tool" type="button" data-summon-sort>⇅ ${isMobile ? 'High → Low' : 'Low → High'}</button>
      <button class="summon-tool is-primary" type="button" data-summon-continue>Continue →</button>
    </div>`}
    ${singlePanel}
    ${jackpotPanel}
    ${isSingle ? '' : `<div class="summon-result-highlight" style="--rarity:${topTier.color};--rarity-gradient:${topTier.gradient || topTier.color}">
      <span class="srh-icon">${topTier.icon}</span>
      <span><small>Best this pull</small><b>${esc(topTier.name)}</b><span>${top ? esc(displayName(top)) : ''}</span></span>
      ${run.pity ? '<span class="chip" style="border-color:var(--gold)">🎰 Pity broken</span>' : ''}
    </div>
    <div class="summon-result-chips">${summary}</div>
    ${filters}
    ${statsPanel}
    <div class="summon-result-grid">${cards}</div>`}
    <div class="summon-result-actions">
      <button class="btn btn-gold" type="button" data-summon-again ${canSummonAgain ? '' : 'disabled'}>${canSummonAgain ? `Summon again · ${summonPriceLabel(banner.price)}` : 'Every type already home'}</button>
      <button class="btn btn-soft" type="button" data-summon-collection>View collection</button>
      <button class="btn btn-ghost" type="button" data-summon-done>Done</button>
    </div>
    <p class="tiny muted" style="margin:10px 2px 0;text-align:center">Pity meter: ${run.pityAfter} / ${SUMMON_PITY_LIMIT} pulls until a guaranteed Mythic.</p>
  </div>`;
  summonWriteHistory({ at: Date.now(), banner: banner.name, count: results.length, top: topKey, name: top ? displayName(top) : '' });
  let artCleanup = null;
  const { overlay, close } = buildOverlay(markup, {
    center: true,
    dismissible: true,
    key: 'summon-results',
    onClose: () => {
      if (artCleanup) artCleanup();
      Sfx.stopSummonCue();
    },
  });
  const grid = overlay.querySelector('.summon-result-grid');
  const cardsEls = [...overlay.querySelectorAll('[data-summon-result]')];
  if (lazyArt) {
    const spriteById = new Map(results.map((sprite) => [sprite.id, sprite]));
    const queue = [];
    const paintArt = (card) => {
      const host = card.querySelector('[data-summon-art]');
      if (!host || host.dataset.artReady === '1') return;
      const sprite = spriteById.get(card.dataset.summonResult);
      if (!sprite) return;
      host.dataset.artReady = '1';
      host.innerHTML = spriteSVG(sprite, { expr: 'love', still: true });
    };
    /* The first screenful gets its art before the sheet paints; the rest fills
       in during ~6ms slices, so no single task can freeze the results screen. */
    const pump = () => {
      const start = performance.now();
      while (queue.length && performance.now() - start < 6) paintArt(queue.shift());
      if (queue.length) setTimeout(pump, 0);
    };
    cardsEls.slice(0, 8).forEach(paintArt);
    queue.push(...cardsEls.slice(8));
    if (queue.length) setTimeout(pump, 0);
    artCleanup = () => {
      queue.length = 0;
    };
  }
  const sortBtn = overlay.querySelector('[data-summon-sort]');
  let sortDesc = isMobile;

  const revealCard = (button, quiet) => {
    if (button.dataset.revealed === '1') return false;
    button.dataset.revealed = '1';
    button.classList.add('is-flipping');
    setTimeout(() => button.classList.remove('is-flipping'), 440);
    if (!quiet) Sfx.summonCue(button.dataset.rarityKey);
    return true;
  };

  cardsEls.forEach((button) => {
    let pressTimer = null;
    let longPressed = false;
    const clearPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };
    button.addEventListener('pointerdown', () => {
      longPressed = false;
      pressTimer = setTimeout(() => {
        longPressed = true;
        if (typeof App !== 'undefined' && App.openDetail) App.openDetail(button.dataset.summonResult);
      }, 520);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((evt) => button.addEventListener(evt, clearPress));
    button.addEventListener('contextmenu', (event) => event.preventDefault());
    button.addEventListener('click', () => {
      if (longPressed) {
        longPressed = false;
        return;
      }
      const sprite = results.find((entry) => entry.id === button.dataset.summonResult);
      if (!sprite) return;
      if (button.dataset.revealed !== '1') {
        revealCard(button, false);
        return;
      }
      openSummonPreview(sprite);
    });
  });

  const revealAll = overlay.querySelector('[data-summon-reveal-all]');
  if (revealAll) {
    revealAll.addEventListener('click', () => {
      const hidden = cardsEls.filter((button) => button.dataset.revealed === '0');
      if (!hidden.length) {
        toast('Every card is already face up.', '👁');
        return;
      }
      hidden.forEach((button, i) => setTimeout(() => revealCard(button, i !== hidden.length - 1), Math.min(700, i * 45)));
      revealAll.classList.add('is-done');
      revealAll.textContent = '👁 Revealed';
      Sfx.summonResults();
    });
  }

  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortDesc = !sortDesc;
      [...cardsEls]
        .sort((a, b) => (sortDesc ? Number(b.dataset.rank) - Number(a.dataset.rank) : Number(a.dataset.rank) - Number(b.dataset.rank)))
        .forEach((card) => grid.appendChild(card));
      sortBtn.textContent = `⇅ ${sortDesc ? 'High → Low' : 'Low → High'}`;
    });
  }

  const continueBtn = overlay.querySelector('[data-summon-continue]');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      close();
      if (typeof App !== 'undefined') App.go('summon');
    });
  }

  const filterWrap = overlay.querySelector('[data-summon-filters]');
  if (filterWrap) {
    filterWrap.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-summon-filter]');
      if (!chip) return;
      filterWrap.querySelectorAll('[data-summon-filter]').forEach((entry) => entry.classList.toggle('is-active', entry === chip));
      const want = chip.dataset.summonFilter;
      cardsEls.forEach((card) => {
        const match = want === 'all'
          || (want === 'new' && card.dataset.new === '1')
          || (want === 'special' && card.dataset.special === '1')
          || card.dataset.rarityKey === want;
        card.classList.toggle('is-filtered', !match);
      });
    });
  }

  const equipBtn = overlay.querySelector('[data-summon-equip]');
  if (equipBtn && top) {
    equipBtn.addEventListener('click', () => {
      if (typeof Actions !== 'undefined' && Actions.setActive) Actions.setActive(top.id);
      equipBtn.textContent = 'Equipped ✓';
      equipBtn.disabled = true;
      toast(`${displayName(top)} is now your active companion.`, '👑');
    });
  }
  const shareBtn = overlay.querySelector('[data-summon-share]');
  if (shareBtn && top) {
    shareBtn.addEventListener('click', async () => {
      const text = `${displayName(top)} — ${topTier.name} tier in Sprite Hollow${power ? ` · ${power.toLocaleString('en-US')} power` : ''}.`;
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Sprite Hollow', text });
          toast('Friend shared.', '📤');
          return;
        }
        await navigator.clipboard.writeText(text);
        toast('Copied to your clipboard.', '📋');
      } catch (err) {
        toast('Sharing was cancelled.', '📤');
      }
    });
  }
  const shotBtn = overlay.querySelector('[data-summon-shot]');
  if (shotBtn && top) {
    shotBtn.addEventListener('click', () => {
      if (typeof pufflePhotoBlob === 'function' && typeof pufflePhotoSave === 'function') {
        Promise.resolve()
          .then(() => pufflePhotoBlob(top))
          .then((blob) => {
            if (!blob) throw new Error('no image');
            pufflePhotoSave(blob, typeof pufflePhotoFilename === 'function' ? pufflePhotoFilename(top) : 'sprite-hollow-reveal.png');
            toast('Card screenshot saved.', '📸');
          })
          .catch(() => toast('That screenshot could not be saved on this device.', '📸'));
        return;
      }
      toast('Screenshot: use your device capture shortcut.', '📸');
    });
  }

  overlay.querySelector('[data-summon-again]').addEventListener('click', () => {
    if (banner.price > 0 && state.coins < banner.price) {
      toast(`You need ${banner.price - state.coins} more coins to summon again.`, '🪙');
      Sfx.error();
      return;
    }
    close();
    openSummonFlow(banner.key);
  });
  overlay.querySelector('[data-summon-collection]').addEventListener('click', () => {
    close();
    if (typeof App !== 'undefined') App.go('collection');
  });
  overlay.querySelector('[data-summon-done]').addEventListener('click', () => {
    close();
    if (typeof App !== 'undefined') App.go('summon');
  });
  if (summonRank(topKey) < summonRank('legendary')) Sfx.summonResults();
  /* The cinematic already started this tier's cue before opening the results;
     starting it again here restarted the arrangement mid-phrase. Only kick a
     cue off when nothing for this tier is playing. */
  if (typeof Sfx.summonCuePlaying !== 'function' || !Sfx.summonCuePlaying(topKey)) Sfx.summonCue(topKey);
}

function summonBannerCard(banner) {
  const data = summonBannerRateData(banner, null, summonOwnedTypes());
  const exhausted = data.pool.length === 0;
  const locked = exhausted || (banner.price > 0 && state.coins < banner.price);
  return `<article class="summon-banner-card" style="--banner:${banner.color};--banner-2:${banner.color2 || banner.color}">
    <button class="summon-banner${locked ? ' is-locked' : ''}" type="button" data-summon-banner="${banner.key}" ${exhausted ? 'disabled' : ''} aria-label="${esc(banner.name)} · ${exhausted ? 'every type already home' : summonPriceLabel(banner.price)}">
      <span class="sb-icon">${banner.icon}</span>
      <span class="sb-copy"><b>${esc(banner.name)}</b><span>${esc(banner.subtitle)}</span></span>
      <span class="sb-meta"><span class="chip">${banner.count}×</span><span class="chip">${esc(summonRarityName(banner.min))}+</span></span>
      <span class="sb-desc">${esc(banner.blurb)}</span>
      <span class="sb-price">${exhausted ? 'Every type already home' : summonPriceLabel(banner.price)}</span>
    </button>
    ${summonRatesLinkHTML(banner, data)}
  </article>`;
}

function summonWorldGateCard(banner) {
  const data = summonBannerRateData(banner, null, summonOwnedTypes());
  const exhausted = data.pool.length === 0;
  const locked = exhausted || (banner.price > 0 && state.coins < banner.price);
  return `<article class="summon-world-card" style="--banner:${banner.color};--banner-2:${banner.color2 || banner.color}">
    <button class="summon-world-gate${locked ? ' is-locked' : ''}" type="button" data-summon-quick="${banner.key}" ${exhausted ? 'disabled' : ''} aria-label="${esc(banner.name)} world gate · ${exhausted ? 'every type already home' : summonPriceLabel(banner.price)}">
      <span class="swg-orbit" aria-hidden="true"><i></i><i></i><b>${banner.portal || '🪐'}</b></span>
      <span class="swg-copy"><b>${esc(banner.name)}</b><small>${esc(banner.subtitle)}</small><span class="swg-chips"><span class="chip">${banner.count}×</span><span class="chip">${esc(summonRarityName(banner.min))}+</span></span></span>
      <span class="swg-cta">${exhausted ? 'Every type home' : `${summonPriceLabel(banner.price)} →`}</span>
    </button>
    ${summonRatesLinkHTML(banner, data)}
  </article>`;
}

/* The featured gate resets with the weekly rotation, so its countdown reads
   from the same Monday boundary the rest of the Hollow uses. */
function summonEventDaysLeft() {
  const now = new Date();
  const days = ((8 - now.getDay()) % 7) || 7;
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return Math.max(1, Math.ceil((next - now) / 86400000));
}

function summonScreen(root) {
  const pity = summonReadPity();
  const multi = SUMMON_BANNERS.filter((banner) => banner.group === 'multi');
  const events = SUMMON_BANNERS.filter((banner) => banner.group === 'event' && !banner.world);
  const worlds = SUMMON_BANNERS.filter((banner) => banner.group === 'event' && banner.world);
  const feature = SUMMON_BANNERS.find((banner) => banner.featured) || events[0] || multi[0];
  const ownedTypes = summonOwnedTypes();
  const featureExhausted = summonGatePool(feature, ownedTypes).length === 0;
  const quick = [
    { key: 'single', label: 'Single', hint: '1 pull' },
    { key: 'starfall', label: '10×', hint: 'starfall' },
    { key: 'elemental', label: '25×', hint: 'elemental' },
    { key: 'omni', label: '100×', hint: 'omni' },
  ].map((item) => {
    const banner = SUMMON_BANNERS.find((entry) => entry.key === item.key);
    if (!banner) return '';
    const exhausted = summonGatePool(banner, ownedTypes).length === 0;
    return `<button class="summon-quick${item.key === 'single' ? ' q-single' : item.key === 'starfall' ? ' q-ten' : item.key === 'omni' ? ' q-hundred' : ''}" type="button" data-summon-quick="${banner.key}" ${exhausted ? 'disabled' : ''} style="--banner:${banner.color};--banner-2:${banner.color2 || banner.color}"><b>${item.label}</b><span>${item.hint}</span><small>${exhausted ? 'all home' : summonPriceLabel(banner.price)}</small></button>`;
  }).join('');
  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Call the Hollow</div><h1>The Summoning</h1><p>One of each type. Pulls skip every type already home.</p></div>
      <span class="chip">${icon('coin')} <span data-summon-coins>${state.coins}</span></span>
    </div>
    <div class="summon-hub">
      <section class="summon-feature" data-summon-feature="${feature.key}" style="--banner:${feature.color};--banner-2:${feature.color2 || feature.color}">
        <div class="summon-feature-kicker">✦ Event banner ✦</div>
        <div class="summon-feature-icon">${feature.icon}</div>
        <h2>${esc(feature.name)}</h2>
        <p>${esc(feature.subtitle)}</p>
        <div class="summon-feature-badges"><span class="chip sb-rateup">★ Rate up</span><span class="chip sb-countdown">Ends in ${summonEventDaysLeft()} day${summonEventDaysLeft() === 1 ? '' : 's'}</span></div>
        <div class="summon-feature-meta"><span class="chip">${feature.count}×</span><span class="chip">${esc(summonRarityName(feature.min))}+</span></div>
        <button class="btn btn-gold btn-block" type="button" data-summon-quick="${feature.key}" ${featureExhausted ? 'disabled' : ''}>${featureExhausted ? 'Every type already home' : `Summon event · ${summonPriceLabel(feature.price)}`}</button>
        ${summonRatesLinkHTML(feature)}
      </section>
      <div class="summon-side">
        <section class="summon-portal-card">
          <div class="summon-portal-preview" data-summon-portal-preview role="button" tabindex="0" aria-label="Preview the summoning portal">
            <span class="summon-portal-aura"></span><span class="summon-portal-core">✦</span>
          </div>
          <b>Portal preview</b><p>Tap the portal to wake it.</p>
        </section>
        <div class="summon-quick-actions">${quick}</div>
        <details class="summon-featured-rates">
          <summary>Featured rates ↑</summary>
          <div><span>Guaranteed event floor</span><b>${esc(summonRarityName(feature.min))}+</b></div>
          <div><span>Every pull</span><b>${feature.count} new friends</b></div>
          <div><span>Pity</span><b>${pity.pulls} / ${SUMMON_PITY_LIMIT}</b></div>
        </details>
      </div>
      ${summonHistoryHTML()}
    </div>
    <div class="summon-pity-card">
      <div><div class="eyebrow">Pity meter</div><b>${pity.pulls} / ${SUMMON_PITY_LIMIT}</b><p>Every egg without a Mythic+ adds to the meter. At ${SUMMON_PITY_LIMIT}, the first egg of the next gate is guaranteed Mythic+; any Mythic+ resets it.</p></div>
      <span class="summon-pity-ring" style="--pity:${Math.min(100, pity.pulls / SUMMON_PITY_LIMIT * 100)}%">🎰</span>
    </div>
    <div class="section-title"><h2>Multi-summon</h2><span>swipe the gates</span></div>
    <div class="summon-banner-grid is-carousel">${multi.map(summonBannerCard).join('')}</div>
    <div class="section-title"><h2>Event gates</h2><span>guaranteed rarity</span></div>
    <div class="summon-banner-grid is-carousel">${events.map(summonBannerCard).join('')}</div>
    <div class="section-title"><h2>Planet &amp; world gates</h2><span>${worlds.length} worlds · new egg pools</span></div>
    <div class="summon-world-grid">${worlds.map(summonWorldGateCard).join('')}</div>
    <div class="card summon-rules">
      <b>Skip & fast-forward rules</b>
      <p><b>Skip</b> is available from the first frame and jumps straight to the results screen. The pull is already committed, so skipping never loses a friend.</p>
      <p><b>Fast-forward</b> plays the remaining cinematic at 2.5× and still shows the final rarity reveal. Press <b>F</b> for fast-forward or <b>Esc</b> to skip.</p>
      <p>Reduced-motion settings open results immediately. Every gate can be replayed from its results screen.</p>
      <p><b>Pity:</b> ${SUMMON_PITY_LIMIT} eggs without a Mythic+ guarantees Mythic+ on the first egg of the next gate. Any Mythic+ resets the counter; only that first egg is forced.</p>
      <p><b>One of each type:</b> a summon never creates a second sprite of a type already in your Hollow, and a multi-pull never repeats a type. If only a few unowned types remain, the gate brings home only those remaining types.</p>
      <p><b>Rates &amp; drops:</b> every banner and world gate has a <b>Rates &amp; drops</b> button with per-rarity odds, the current pity count, and the available type pool.</p>
    </div>`;
  root.querySelectorAll('[data-summon-banner]').forEach((button) => {
    button.addEventListener('click', () => openSummonFlow(button.dataset.summonBanner));
  });
  root.querySelectorAll('[data-summon-quick]').forEach((button) => {
    button.addEventListener('click', () => openSummonFlow(button.dataset.summonQuick));
  });
  root.querySelectorAll('[data-summon-rates]').forEach((button) => {
    button.addEventListener('click', () => openSummonRates(button.dataset.summonRates));
  });
  const portal = root.querySelector('[data-summon-portal-preview]');
  if (portal) {
    const preview = () => {
      portal.classList.toggle('is-previewing');
      Sfx.summonOpen(10);
      toast('Portal preview woken. Tap again to quiet it.', '🌌');
    };
    portal.addEventListener('click', preview);
    portal.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); preview(); }
    });
  }
  const coin = root.querySelector('[data-summon-coins]');
  if (coin) coin.textContent = state.coins;
}
