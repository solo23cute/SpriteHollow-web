/* Sprite Hollow creature stats.

   Two axes decide a creature's spread: its rarity sets the total power budget,
   and its family decides how that budget is spent. A Common Nature puffle and a
   Common Electric puffle are worth the same 170 points, but one is a wall and
   the other is a blur. Signature bosses override both. */

const PUFFLE_RARITY_STATS = {
  common: { hp: 80, atk: 25, def: 20, mag: 20, spd: 25 },
  uncommon: { hp: 120, atk: 40, def: 35, mag: 35, spd: 40 },
  rare: { hp: 180, atk: 70, def: 60, mag: 60, spd: 70 },
  epic: { hp: 260, atk: 110, def: 95, mag: 95, spd: 110 },
  legendary: { hp: 350, atk: 150, def: 130, mag: 130, spd: 140 },
  mythic: { hp: 420, atk: 185, def: 165, mag: 165, spd: 165 },
  secret: { hp: 500, atk: 220, def: 200, mag: 220, spd: 200 },
  ultra_secret: { hp: 600, atk: 250, def: 230, mag: 250, spd: 220 },
  ancient: { hp: 700, atk: 290, def: 280, mag: 300, spd: 250 },
  divine: { hp: 820, atk: 340, def: 330, mag: 350, spd: 300 },
  creator: { hp: 1000, atk: 420, def: 400, mag: 430, spd: 380 },
};

/* Family identity, written as the reference spreads from the design doc. */
const PUFFLE_FAMILY_STATS = {
  nature: { hp: 160, atk: 90, def: 140, mag: 120, spd: 60 },
  fire: { hp: 120, atk: 170, def: 70, mag: 130, spd: 120 },
  water: { hp: 140, atk: 120, def: 120, mag: 120, spd: 100 },
  electric: { hp: 90, atk: 150, def: 80, mag: 120, spd: 180 },
  ice: { hp: 120, atk: 80, def: 140, mag: 170, spd: 70 },
  moon: { hp: 130, atk: 90, def: 100, mag: 180, spd: 100 },
  light: { hp: 150, atk: 140, def: 140, mag: 140, spd: 140 },
  shadow: { hp: 90, atk: 180, def: 70, mag: 180, spd: 150 },
  cosmic: { hp: 170, atk: 170, def: 170, mag: 170, spd: 170 },
  crystal: { hp: 150, atk: 100, def: 190, mag: 130, spd: 80 },
  dragon: { hp: 190, atk: 180, def: 120, mag: 120, spd: 90 },
  spirit: { hp: 100, atk: 80, def: 90, mag: 200, spd: 150 },
  time: { hp: 130, atk: 120, def: 120, mag: 180, spd: 180 },
  rainbow: { hp: 180, atk: 160, def: 160, mag: 160, spd: 160 },
  earth: { hp: 190, atk: 95, def: 175, mag: 100, spd: 55 },
  wind: { hp: 100, atk: 130, def: 85, mag: 130, spd: 195 },
  mushroom: { hp: 150, atk: 85, def: 110, mag: 165, spd: 90 },
  poison: { hp: 110, atk: 80, def: 100, mag: 170, spd: 120 },
  metal: { hp: 180, atk: 110, def: 180, mag: 90, spd: 70 },
  secret: { hp: 175, atk: 175, def: 175, mag: 175, spd: 175 },
};

const PUFFLE_STAT_KEYS = ['hp', 'atk', 'def', 'mag', 'spd'];
const PUFFLE_STAT_LABELS = { hp: 'HP', atk: 'Attack', def: 'Defense', mag: 'Magic', spd: 'Speed' };

/* Signature lines, one stat block per evolution form. */
const PUFFLE_SIGNATURE_STATS = {
  pc_sprite_hollow_prime: [
    { hp: 650, atk: 300, def: 280, mag: 320, spd: 250 },
    { hp: 650, atk: 300, def: 280, mag: 320, spd: 250 },
    { hp: 650, atk: 300, def: 280, mag: 320, spd: 250 },
    { hp: 750, atk: 350, def: 350, mag: 350, spd: 350 },
  ],
  pc_hollow_king: [
    { hp: 800, atk: 340, def: 330, mag: 220, spd: 180 },
    { hp: 800, atk: 340, def: 330, mag: 220, spd: 180 },
    { hp: 800, atk: 340, def: 330, mag: 220, spd: 180 },
    { hp: 800, atk: 340, def: 330, mag: 220, spd: 180 },
  ],
  pc_hollow_queen: [
    { hp: 620, atk: 220, def: 250, mag: 380, spd: 320 },
    { hp: 620, atk: 220, def: 250, mag: 380, spd: 320 },
    { hp: 620, atk: 220, def: 250, mag: 380, spd: 320 },
    { hp: 620, atk: 220, def: 250, mag: 380, spd: 320 },
  ],
};

function puffleStatTotal(stats) {
  return PUFFLE_STAT_KEYS.reduce((sum, key) => sum + (Number(stats && stats[key]) || 0), 0);
}

/* Small deterministic wobble so two species in one family and tier differ
   without ever leaving the rarity's budget. */
function puffleStatJitter(key) {
  let hash = 0;
  const text = String(key || 'puffle');
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 9973;
  return (hash % 9) - 4; /* -4..4 percent */
}

/* Scale the family's reference spread onto the rarity's budget: the shape is
   the family's, the size is the tier's. */
function puffleStatsFor(elementKey, formIndex = 0) {
  const index = Math.max(0, Math.min(3, Number(formIndex) || 0));
  const signature = PUFFLE_SIGNATURE_STATS[elementKey];
  if (signature) return { ...signature[index], total: puffleStatTotal(signature[index]), tier: 'signature' };

  const chain = typeof window !== 'undefined' && window.PUFFLE_EVOLUTION_CHAINS ? window.PUFFLE_EVOLUTION_CHAINS[elementKey] : null;
  const ladder = chain && typeof window.puffleRarityForChain === 'function' ? window.puffleRarityForChain(elementKey) : [];
  const directTier = typeof typeEggRarity === 'function' ? typeEggRarity(elementKey) : null;
  const tier = ladder[index] || ladder[0] || (directTier ? { key: directTier } : null);
  const budget = puffleStatTotal(PUFFLE_RARITY_STATS[(tier && tier.key) || 'common']);
  const family = typeof window.puffleFamilyOf === 'function'
    ? window.puffleFamilyOf(elementKey)
    : (chain && chain.family);
  const profile = PUFFLE_FAMILY_STATS[family || 'cosmic'] || PUFFLE_FAMILY_STATS.water;
  const profileTotal = puffleStatTotal(profile);
  const jitter = 1 + puffleStatJitter(`${elementKey}:${index}`) / 100;

  const stats = {};
  PUFFLE_STAT_KEYS.forEach((key) => {
    stats[key] = Math.max(1, Math.round((profile[key] / profileTotal) * budget * jitter));
  });
  /* Fold the rounding drift into HP so the total always lands on the budget. */
  stats.hp += budget - puffleStatTotal(stats);
  return { ...stats, total: puffleStatTotal(stats), tier: (tier && tier.key) || 'common' };
}

/* ---------------- battle maths ----------------
   Duels read these instead of fixed damage. A creature's pool is its HP and
   Defence, its power is its Attack, Magic and a little Speed, and the family
   chart decides whether that power lands at 150%, 100% or 70%. Everything is
   expressed as a percentage of the defender's pool, so the UI bars stay 0-100. */
window.PUFFLE_BRUTE_PROFILE = { hp: 200, atk: 44, def: 30, mag: 24, spd: 30, family: null, level: 8, tier: 'brute', crit: 0.14, dodge: 0.08, winChance: 0 };

window.puffleBattleProfile = function puffleBattleProfile(target) {
  const elementKey = typeof target === 'string' ? target : (target && target.element);
  const stage = typeof target === 'string' ? 'baby' : ((target && target.stage) || 'baby');
  const level = typeof target === 'string' ? 1 : Math.max(1, Number(target && target.level) || 1);
  const form = typeof window.puffleEvolutionStageIndex === 'function' ? window.puffleEvolutionStageIndex(stage) : 0;
  const stats = puffleStatsFor(elementKey, Math.min(3, form));
  /* Level lifts a creature's own numbers, but gently and with a ceiling, so a
     level-57 pet and a level-1000 pet stay in the same fight. */
  const scale = Math.min(5, 1 + Math.min(level, 10000) / 300);
  const profile = { element: elementKey, level, tier: stats.tier, family: typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(elementKey) : null };
  PUFFLE_STAT_KEYS.forEach((key) => { profile[key] = Math.round(stats[key] * scale); });
  /* Personality and rolled skills fight here: Brave hits harder and crits more,
     Gentle soaks more, Playful dodges, Keen Eye nudges the odds. */
  const mods = (target && typeof target === 'object' && typeof window.spriteTraitMods === 'function')
    ? window.spriteTraitMods(target) : null;
  if (mods) {
    ['atk', 'mag', 'def', 'spd', 'hp'].forEach((key) => {
      if (mods[key] && mods[key] !== 1 && typeof profile[key] === 'number') {
        profile[key] = Math.round(profile[key] * mods[key]);
      }
    });
    profile.crit = Number(mods.crit) || 0;
    profile.dodge = Number(mods.dodge) || 0;
    profile.winChance = Number(mods.winChance) || 0;
  }
  profile.total = puffleStatTotal(profile);
  return profile;
};

window.puffleTypeMultiplier = function puffleTypeMultiplier(attackerFamily, defenderFamily) {
  const table = window.PUFFLE_MATCHUPS;
  if (!table || !attackerFamily || !defenderFamily || attackerFamily === defenderFamily) return 1;
  if (table[attackerFamily] && table[attackerFamily].strong.includes(defenderFamily)) return 1.5;
  if (table[defenderFamily] && table[defenderFamily].strong.includes(attackerFamily)) return 0.7;
  return 1;
};

/* A rough pre-fight win chance: how hard you hit them versus how hard they hit
   you, folded into 5-95% so no card ever reads as a certainty. */
window.puffleWinChance = function puffleWinChance(mine, theirs) {
  if (!mine || !theirs) return 50;
  /* Compare unclamped hit ratios: strike percentages saturate at 70, which would
     flatten every comfortable matchup into the same 50%. */
  const mineScore = (window.pufflePower(mine) * window.puffleTypeMultiplier(mine.family, theirs.family)) / window.puffleResolvePool(theirs);
  const theirScore = (window.pufflePower(theirs) * window.puffleTypeMultiplier(theirs.family, mine.family)) / window.puffleResolvePool(mine);
  if (!mineScore && !theirScore) return 50;
  const base = (mineScore / (mineScore + theirScore)) * 100;
  /* Trait sway moves the odds a few points, so a Keen Eye puffle reads and is
     genuinely more likely to win than an identical one without it. */
  const sway = ((Number(mine.winChance) || 0) - (Number(theirs.winChance) || 0)) * 100;
  return Math.max(5, Math.min(95, Math.round(base + sway)));
};

window.pufflePower = function pufflePower(profile) {
  return (profile.atk || 1) + (profile.mag || 0) * 0.6 + (profile.spd || 0) * 0.15;
};

window.puffleResolvePool = function puffleResolvePool(profile) {
  return Math.max(40, (profile.hp || 0) * 0.8 + (profile.def || 0) * 0.5);
};

/* Percentage of the defender's bar removed by one clean hit, 8-70 so no duel is
   a one-shot and no duel drags. */
window.puffleStrikePercent = function puffleStrikePercent(attacker, defender) {
  if (!attacker || !defender) return 20;
  const mult = window.puffleTypeMultiplier(attacker.family, defender.family);
  const raw = (window.pufflePower(attacker) / window.puffleResolvePool(defender)) * 100 * mult;
  return Math.max(8, Math.min(70, Math.round(raw)));
};

/* Chance-based traits, clamped so no build is ever automatic. The duel rolls
   these on every strike (crit) and every incoming attack (dodge). */
window.puffleCritChance = function puffleCritChance(profile) {
  return Math.max(0, Math.min(0.6, Number(profile && profile.crit) || 0));
};
window.puffleDodgeChance = function puffleDodgeChance(profile) {
  return Math.max(0, Math.min(0.4, Number(profile && profile.dodge) || 0));
};

/* Pre-fight odds: how much of the opponent's bar one clean strike removes, and
   what the elemental chart does to it. Shown in the duel picker and on the
   guardian screen before the first strike. */
window.puffleOddsHTML = function puffleOddsHTML(attackerProfile, defenderProfile) {
  if (!attackerProfile || !defenderProfile || typeof window.puffleStrikePercent !== 'function') return '';
  const percent = window.puffleStrikePercent(attackerProfile, defenderProfile);
  const mult = window.puffleTypeMultiplier(attackerProfile.family, defenderProfile.family);
  const tone = mult > 1 ? '#46C46E' : mult < 1 ? '#FF6B6B' : 'var(--line)';
  const typeText = mult > 1 ? `⚡ +${Math.round((mult - 1) * 100)}% type` : mult < 1 ? `🛡️ −${Math.round((1 - mult) * 100)}% type` : '➖ neutral type';
  return `<span class="chip" style="border-color:${tone}" title="Each clean strike takes this much of their bar">⚔️ ${percent}% strike</span><span class="chip" style="border-color:${tone}" title="Elemental chart: your family against theirs">${typeText}</span>`;
};

window.PUFFLE_RARITY_STATS = PUFFLE_RARITY_STATS;
window.PUFFLE_FAMILY_STATS = PUFFLE_FAMILY_STATS;
window.PUFFLE_SIGNATURE_STATS = PUFFLE_SIGNATURE_STATS;
window.puffleStatsFor = puffleStatsFor;

/* A compact block for the Codex sheet: one bar per stat, scaled to the top of
   the Ultra Secret budget so a Common and a boss can be compared at a glance. */
window.puffleStatsHTML = function puffleStatsHTML(elementKey, formIndex = 0) {
  if (typeof ELEMENTS === 'undefined' || !ELEMENTS[elementKey]) return '';
  const stats = puffleStatsFor(elementKey, formIndex);
  const ceiling = Math.max(...PUFFLE_STAT_KEYS.map((key) => Number(PUFFLE_RARITY_STATS.creator[key]) || 0));
  const rows = PUFFLE_STAT_KEYS.map((key) => {
    const width = Math.max(2, Math.min(100, (stats[key] / ceiling) * 100));
    return `<div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
      <span class="tiny muted" style="width:56px;flex:0 0 56px">${PUFFLE_STAT_LABELS[key]}</span>
      <span style="flex:1;height:6px;border-radius:3px;background:var(--line);overflow:hidden;display:block"><i style="display:block;height:100%;width:${width.toFixed(1)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></span>
      <b class="tiny" style="width:34px;text-align:right">${stats[key]}</b>
    </div>`;
  }).join('');
  const tier = typeof window.puffleRarityAt === 'function' ? window.puffleRarityAt(elementKey, formIndex) : null;
  return `<div class="card" style="padding:12px;margin-top:10px;text-align:left" data-stats="${elementKey}:${formIndex}">
    <div class="between" style="margin-bottom:8px"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">COMBAT STATS</div><span class="chip">${tier ? `${tier.icon} ${tier.name} ` : ''}· ${stats.total} total</span></div>
    ${rows}
  </div>`;
};
