/* Ability upgrade paths.
   Every element has one signature ability that branches three ways. A branch
   is chosen per sprite and saved on the sprite itself, so two Puffles of the
   same species can grow into different builds. Branch mods use the same
   vocabulary as personality traits (atk, mag, def, spd, crit, dodge,
   winChance, xp, bond), so they flow straight into duels and care maths
   through window.spriteTraitMods.

   Tier 2 replaces tier 1 at ABILITY_PATH_EVOLVE_LEVEL. Rarity then layers on
   top: Legendary+ adds a mastery, Secret a mutation, Celestial the Star Core
   ladder, and Creator its three endgame paths plus Creation Burst. */

const ABILITY_PATH_EVOLVE_LEVEL = 40;
/* Switching an already-chosen branch costs coins, so a build is a commitment
   without being a trap. The first pick is always free. */
const AP_PATH_CHANGE_COST = 60;
const ABILITY_PATH_MASTERY_RANK = 4; /* legendary and above */
const ABILITY_SECRET_RANK = 7;
const ABILITY_CELESTIAL_RANK = 8;
const ABILITY_CREATOR_RANK = 9;

const ABILITY_RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine', 'secret', 'celestial', 'creator', 'master'];

const ABILITY_PATHS = {
  fire: {
    base: { name: 'Ember Toss', icon: '🔥' },
    branches: [
      { key: 'inferno', t1: { name: 'Fireball', icon: '💥', blurb: '+50% damage and a wider blast.', mods: { atk: 1.2, mag: 1.08 }, tags: ['Damage', 'AoE'] },
        t2: { name: 'Inferno Bomb', icon: '☄️', blurb: 'Massive blast that burns over time.', mods: { atk: 1.38, mag: 1.18 }, tags: ['Damage', 'Burn'] } },
      { key: 'scorch', t1: { name: 'Scorch Mark', icon: '🩹', blurb: 'Lower hit, applies burn stacks.', mods: { atk: 1.04, mag: 1.12, crit: 0.04 }, tags: ['Burn', 'Stacks'] },
        t2: { name: 'Wildfire', icon: '🔥', blurb: 'Burn spreads between enemies.', mods: { atk: 1.12, mag: 1.26, crit: 0.08 }, tags: ['Burn', 'Spread'] } },
      { key: 'warmth', t1: { name: 'Warmth Aura', icon: '🫧', blurb: 'Team healing near a Fire Puffle.', mods: { def: 1.14, bond: 1.08, mag: 1.04 }, tags: ['Heal', 'Aura'] },
        t2: { name: 'Phoenix Blessing', icon: '🐦‍🔥', blurb: 'Allies regenerate HP over time.', mods: { def: 1.26, bond: 1.14, mag: 1.16 }, tags: ['Heal', 'Regen'] } },
    ],
  },
  water: {
    base: { name: 'Aqua Jet', icon: '💧' },
    branches: [
      { key: 'rain', t1: { name: 'Healing Rain', icon: '🌧', blurb: 'Restores ally health.', mods: { mag: 1.16, def: 1.06 }, tags: ['Heal'] },
        t2: { name: 'Ocean Blessing', icon: '🌊', blurb: 'Team-wide healing over time.', mods: { mag: 1.3, def: 1.14 }, tags: ['Heal', 'Team', 'Cleanse'] } },
      { key: 'prison', t1: { name: 'Water Prison', icon: '🫧', blurb: 'Traps enemies in place.', mods: { mag: 1.12, def: 1.1 }, tags: ['Control'] },
        t2: { name: 'Whirlpool Cage', icon: '🌀', blurb: 'Pulls enemies inward.', mods: { mag: 1.24, def: 1.16 }, tags: ['Control', 'Pull'] } },
      { key: 'tidal', t1: { name: 'Tidal Dash', icon: '🌊', blurb: 'Mobility skill: closes the gap.', mods: { spd: 1.2, dodge: 0.03 }, tags: ['Speed'] },
        t2: { name: 'Leviathan Surge', icon: '🐋', blurb: 'Huge rushing wave attack.', mods: { spd: 1.3, atk: 1.14, dodge: 0.05 }, tags: ['Wave', 'Damage'] } },
    ],
  },
  electric: {
    base: { name: 'Spark Shot', icon: '⚡' },
    branches: [
      { key: 'chain', t1: { name: 'Chain Bolt', icon: '🔗', blurb: 'Jumps to extra enemies.', mods: { atk: 1.12, crit: 0.04 }, tags: ['Chain'] },
        t2: { name: 'Storm Network', icon: '🌩', blurb: 'Unlimited chain range.', mods: { atk: 1.26, crit: 0.09 }, tags: ['Chain', 'Range'] } },
      { key: 'overcharge', t1: { name: 'Overcharge', icon: '🔋', blurb: 'Faster attacks.', mods: { spd: 1.18, atk: 1.06 }, tags: ['Speed'] },
        t2: { name: 'Plasma Rush', icon: '💫', blurb: 'Massive attack speed boost.', mods: { spd: 1.34, atk: 1.16 }, tags: ['Speed', 'Burst'] } },
      { key: 'static', t1: { name: 'Static Shield', icon: '🛡', blurb: 'Reflects damage taken.', mods: { def: 1.18, mag: 1.04 }, tags: ['Defence', 'Reflect'] },
        t2: { name: 'Thunder Barrier', icon: '⚡', blurb: 'Reflects elemental attacks.', mods: { def: 1.3, mag: 1.14 }, tags: ['Defence', 'Reflect'] } },
    ],
  },
  nature: {
    base: { name: 'Vine Lash', icon: '🌿' },
    branches: [
      { key: 'root', t1: { name: 'Root Snare', icon: '🪢', blurb: 'Immobilizes enemies.', mods: { mag: 1.12, def: 1.06 }, tags: ['Control'] },
        t2: { name: 'Ancient Roots', icon: '🌳', blurb: 'Area-wide crowd control.', mods: { mag: 1.26, def: 1.14 }, tags: ['Control', 'Area'] } },
      { key: 'bloom', t1: { name: 'Bloom Shield', icon: '🌸', blurb: 'Temporary shields for the team.', mods: { def: 1.2, bond: 1.04 }, tags: ['Shield'] },
        t2: { name: 'Living Forest', icon: '🌲', blurb: 'Continuous team shielding.', mods: { def: 1.34, bond: 1.08 }, tags: ['Shield', 'Team'] } },
      { key: 'sprout', t1: { name: 'Sprout Companion', icon: '🌱', blurb: 'Summons a mini plant ally.', mods: { mag: 1.14, xp: 1.05 }, tags: ['Summon'] },
        t2: { name: 'Worldtree Guardian', icon: '🌳', blurb: 'Summons a giant nature spirit.', mods: { mag: 1.28, def: 1.12, xp: 1.1 }, tags: ['Summon', 'Guardian'] } },
    ],
  },
  ice: {
    base: { name: 'Frost Bite', icon: '❄️' },
    branches: [
      { key: 'chains', t1: { name: 'Ice Chains', icon: '⛓', blurb: 'Slows enemies down.', mods: { mag: 1.12, spd: 1.06 }, tags: ['Slow'] },
        t2: { name: 'Absolute Zero', icon: '🧊', blurb: 'Full freeze effect.', mods: { mag: 1.28, crit: 0.06 }, tags: ['Freeze'] } },
      { key: 'armor', t1: { name: 'Ice Armor', icon: '🛡', blurb: 'Damage reduction.', mods: { def: 1.2 }, tags: ['Defence'] },
        t2: { name: 'Glacier Fortress', icon: '🏔', blurb: 'Massive defensive boost.', mods: { def: 1.36, mag: 1.04 }, tags: ['Defence', 'Team'] } },
      { key: 'storm', t1: { name: 'Snowstorm', icon: '🌨', blurb: 'Area damage around it.', mods: { mag: 1.16, atk: 1.06 }, tags: ['AoE'] },
        t2: { name: 'Eternal Winter', icon: '🥶', blurb: 'Battlefield-wide freeze zone.', mods: { mag: 1.32, atk: 1.14 }, tags: ['AoE', 'Freeze'] } },
    ],
  },
  poison: {
    base: { name: 'Toxic Spore', icon: '☠️' },
    branches: [
      { key: 'venom', t1: { name: 'Venom Stack', icon: '🧪', blurb: 'Damage grows each turn.', mods: { atk: 1.14, mag: 1.04, crit: 0.05 }, tags: ['Damage over time'] },
        t2: { name: 'Deadly Infection', icon: '🦠', blurb: 'Poison jumps between enemies.', mods: { atk: 1.3, mag: 1.16, crit: 0.1 }, tags: ['DoT', 'Spread'] } },
      { key: 'cloud', t1: { name: 'Corruption Cloud', icon: '☁️', blurb: 'Area poison.', mods: { mag: 1.18 }, tags: ['AoE'] },
        t2: { name: 'Noxious Realm', icon: '🌫', blurb: 'Covers the whole battlefield.', mods: { mag: 1.34, def: 1.08 }, tags: ['AoE', 'Realm'] } },
      { key: 'leech', t1: { name: 'Toxic Leech', icon: '🪱', blurb: 'Turns poison into healing.', mods: { mag: 1.1, def: 1.12 }, tags: ['Drain'] },
        t2: { name: 'Plague Lord', icon: '👑', blurb: 'Heals from every poison effect.', mods: { mag: 1.24, def: 1.22 }, tags: ['Drain', 'Heal'] } },
    ],
  },
  metal: {
    base: { name: 'Steel Strike', icon: '⚙️' },
    branches: [
      { key: 'plating', t1: { name: 'Reinforced Plating', icon: '🛡', blurb: 'Armor increase.', mods: { def: 1.2 }, tags: ['Defence'] },
        t2: { name: 'Titanium Fortress', icon: '🏰', blurb: 'Team armor buffs.', mods: { def: 1.36, bond: 1.04 }, tags: ['Defence', 'Team', 'Immunity'] } },
      { key: 'magnet', t1: { name: 'Magnetic Pull', icon: '🧲', blurb: 'Moves enemies where you want.', mods: { spd: 1.12, mag: 1.1 }, tags: ['Control'] },
        t2: { name: 'Gravity Engine', icon: '🌌', blurb: 'Pulls every enemy at once.', mods: { mag: 1.28, spd: 1.18 }, tags: ['Control', 'AoE'] } },
      { key: 'drone', t1: { name: 'Gear Drone', icon: '🤖', blurb: 'Summons a support drone.', mods: { atk: 1.12, def: 1.08 }, tags: ['Summon'] },
        t2: { name: 'Forge Construct', icon: '🦾', blurb: 'Summons a battle mech.', mods: { atk: 1.28, def: 1.18 }, tags: ['Summon', 'Mech'] } },
    ],
  },
  crystal: {
    base: { name: 'Prism Beam', icon: '💎' },
    branches: [
      { key: 'diamond', t1: { name: 'Diamond Shot', icon: '🔷', blurb: 'Increased critical damage.', mods: { crit: 0.09, atk: 1.12 }, tags: ['Crit'] },
        t2: { name: 'Crystal Nova', icon: '✨', blurb: 'Multiple laser beams.', mods: { crit: 0.15, atk: 1.26 }, tags: ['Crit', 'Multi'] } },
      { key: 'wall', t1: { name: 'Crystal Shield', icon: '🛡', blurb: 'Absorbs incoming damage.', mods: { def: 1.18, mag: 1.04 }, tags: ['Shield'] },
        t2: { name: 'Diamond Wall', icon: '🧱', blurb: 'Area-wide protection.', mods: { def: 1.32, mag: 1.1 }, tags: ['Shield', 'Team'] } },
      { key: 'resonance', t1: { name: 'Gem Resonance', icon: '🎶', blurb: 'Team stat buffs.', mods: { mag: 1.14, winChance: 0.03, bond: 1.04 }, tags: ['Buff'] },
        t2: { name: 'Crystal Symphony', icon: '🎼', blurb: 'Raises every party stat.', mods: { mag: 1.28, winChance: 0.06, bond: 1.08 }, tags: ['Buff', 'Team'] } },
    ],
  },
  light: {
    base: { name: 'Holy Beam', icon: '☀️' },
    branches: [
      { key: 'blessing', t1: { name: 'Blessing Aura', icon: '🕊', blurb: 'Heals allies steadily.', mods: { mag: 1.16, bond: 1.06 }, tags: ['Heal'] },
        t2: { name: 'Seraph Grace', icon: '👼', blurb: 'Massive team healing.', mods: { mag: 1.32, bond: 1.12 }, tags: ['Heal', 'Team', 'Cleanse'] } },
      { key: 'sanctuary', t1: { name: 'Radiant Shield', icon: '🔆', blurb: 'Prevents damage before it lands.', mods: { def: 1.2, mag: 1.04 }, tags: ['Shield'] },
        t2: { name: 'Divine Sanctuary', icon: '⛪', blurb: 'Temporary invulnerability.', mods: { def: 1.36, mag: 1.1 }, tags: ['Shield', 'Immunity'] } },
      { key: 'inspire', t1: { name: 'Inspire', icon: '🌟', blurb: 'Stat boosts for the party.', mods: { xp: 1.08, winChance: 0.04 }, tags: ['Buff'] },
        t2: { name: 'Celestial Ascension', icon: '🌌', blurb: 'Entire team power boost.', mods: { xp: 1.16, winChance: 0.07, atk: 1.12, mag: 1.12 }, tags: ['Buff', 'Team'] } },
    ],
  },
  shadow: {
    base: { name: 'Shadow Step', icon: '🌑' },
    branches: [
      { key: 'phantom', t1: { name: 'Phantom Strike', icon: '🗡', blurb: 'Critical attack from stealth.', mods: { crit: 0.1, spd: 1.1 }, tags: ['Crit', 'Stealth'] },
        t2: { name: 'Abyss Execution', icon: '🩸', blurb: 'Huge single-target damage.', mods: { crit: 0.17, atk: 1.24, spd: 1.12 }, tags: ['Crit', 'Execution'] } },
      { key: 'nightmare', t1: { name: 'Nightmare Veil', icon: '😱', blurb: 'Lowers enemy accuracy.', mods: { mag: 1.12, dodge: 0.05 }, tags: ['Debuff'] },
        t2: { name: 'Endless Dread', icon: '🕷', blurb: 'Mass fear effect.', mods: { mag: 1.26, dodge: 0.1 }, tags: ['Debuff', 'Fear'] } },
      { key: 'clone', t1: { name: 'Void Clone', icon: '👥', blurb: 'Creates a shadow duplicate.', mods: { atk: 1.1, dodge: 0.04 }, tags: ['Summon'] },
        t2: { name: 'Shadow Legion', icon: '🥷', blurb: 'Multiple clones attack at once.', mods: { atk: 1.24, dodge: 0.09 }, tags: ['Summon', 'Legion'] } },
    ],
  },
  wind: {
    base: { name: 'Gust Slash', icon: '🌀' },
    branches: [
      { key: 'sickle', t1: { name: 'Wind Sickle', icon: '🌬', blurb: 'Fast sweeping cuts.', mods: { spd: 1.18, atk: 1.08 }, tags: ['Speed'] },
        t2: { name: 'Cyclone Reaper', icon: '🍃', blurb: 'Spins through the whole line.', mods: { spd: 1.34, atk: 1.18 }, tags: ['Speed', 'AoE'] } },
      { key: 'mist', t1: { name: 'Mist Veil', icon: '🌫', blurb: 'Harder to hit while drifting.', mods: { dodge: 0.07, def: 1.08 }, tags: ['Evade'] },
        t2: { name: 'Sky Sanctuary', icon: '☁️', blurb: 'Wraps the team in cloud cover.', mods: { dodge: 0.11, def: 1.2 }, tags: ['Evade', 'Team'] } },
      { key: 'feather', t1: { name: 'Feather Ally', icon: '🪶', blurb: 'A small wind familiar.', mods: { spd: 1.1, xp: 1.06 }, tags: ['Summon'] },
        t2: { name: 'Storm Falcon', icon: '🦅', blurb: 'The familiar grows into a storm.', mods: { spd: 1.26, atk: 1.16, xp: 1.08 }, tags: ['Summon', 'Damage'] } },
    ],
  },
  earth: {
    base: { name: 'Stone Toss', icon: '🪨' },
    branches: [
      { key: 'quake', t1: { name: 'Quake Slam', icon: '💥', blurb: 'Heavy ground damage.', mods: { atk: 1.18, def: 1.06 }, tags: ['Damage'] },
        t2: { name: 'Tectonic Crush', icon: '🏔', blurb: 'Splits the ground underfoot.', mods: { atk: 1.32, def: 1.16 }, tags: ['Damage', 'AoE'] } },
      { key: 'wall', t1: { name: 'Stone Wall', icon: '🧱', blurb: 'Raises cover for the team.', mods: { def: 1.22 }, tags: ['Defence'] },
        t2: { name: 'Mountain Aegis', icon: '⛰', blurb: 'A mountain stands with you.', mods: { def: 1.38, mag: 1.06 }, tags: ['Defence', 'Team'] } },
      { key: 'guardian', t1: { name: 'Clay Guardian', icon: '🗿', blurb: 'A stoic clay sentinel.', mods: { def: 1.12, mag: 1.1 }, tags: ['Summon'] },
        t2: { name: 'Earth Titan', icon: '🦣', blurb: 'The sentinel becomes a titan.', mods: { def: 1.26, mag: 1.2, atk: 1.1 }, tags: ['Summon', 'Titan'] } },
    ],
  },
};

/* Legendary mastery: one per element, granted on top of the chosen branch. */
const ABILITY_MASTERIES = {
  fire: { name: 'Solar Inferno', icon: '☀️', blurb: 'The blast carries the heat of a small sun.', mods: { atk: 1.1, mag: 1.1 } },
  water: { name: 'Ocean Emperor', icon: '🌊', blurb: 'Commands every current on the field.', mods: { mag: 1.12, def: 1.08 } },
  electric: { name: 'Thunder Sovereign', icon: '🌩', blurb: 'The storm answers before you call it.', mods: { atk: 1.1, spd: 1.1 } },
  nature: { name: 'Worldtree Eternal', icon: '🌳', blurb: 'Roots reach further than the eye can see.', mods: { mag: 1.1, def: 1.1 } },
  ice: { name: 'Glacier Crown', icon: '🧊', blurb: 'Winter bends to a single thought.', mods: { def: 1.12, mag: 1.1 } },
  poison: { name: 'Plague Sovereign', icon: '☠️', blurb: 'Every toxin in the Hollow is yours.', mods: { atk: 1.1, mag: 1.1 } },
  metal: { name: 'Forge Sovereign', icon: '⚙️', blurb: 'Machines assemble at your word.', mods: { def: 1.12, atk: 1.08 } },
  crystal: { name: 'Crystal Sovereign', icon: '💎', blurb: 'Light splits exactly where you aim it.', mods: { crit: 0.06, mag: 1.1 } },
  light: { name: 'Seraph Ascendant', icon: '👼', blurb: 'Wings of light answer the call.', mods: { mag: 1.12, bond: 1.1 } },
  shadow: { name: 'Abyss Sovereign', icon: '🌑', blurb: 'The dark moves a half-step ahead of you.', mods: { crit: 0.06, dodge: 0.06 } },
  wind: { name: 'Sky Sovereign', icon: '🌀', blurb: 'The air itself takes your side.', mods: { spd: 1.12, dodge: 0.06 } },
  earth: { name: 'Terra Sovereign', icon: '🪨', blurb: 'Stone remembers who woke it.', mods: { def: 1.12, atk: 1.08 } },
};

/* Secret tier: the ability mutates into a single named variant. */
const SECRET_MUTATIONS = {
  fire: { name: 'Ashen Nova', icon: '🌋', blurb: 'The ability collapses into a second, silent explosion.', mods: { atk: 1.14, mag: 1.12 } },
  water: { name: 'Maelstrom Heart', icon: '🌀', blurb: 'A tide that never finishes turning.', mods: { mag: 1.16, def: 1.1 } },
  electric: { name: 'Plasma Thunder', icon: '⚡', blurb: 'Lightning that stays where it struck.', mods: { atk: 1.14, crit: 0.06 } },
  nature: { name: 'Verdant Apocalypse', icon: '🌿', blurb: 'The forest arrives all at once.', mods: { mag: 1.14, def: 1.12 } },
  ice: { name: 'Absolute Winter', icon: '❄️', blurb: 'A season that refuses to end.', mods: { mag: 1.16, crit: 0.05 } },
  poison: { name: 'Rotcrown', icon: '☠️', blurb: 'Everything it touches keeps decaying.', mods: { atk: 1.14, mag: 1.12 } },
  metal: { name: 'Omnigear', icon: '⚙️', blurb: 'A mechanism with no visible input.', mods: { def: 1.14, atk: 1.12 } },
  crystal: { name: 'Infinity Spectrum', icon: '🌈', blurb: 'Colours that should not exist.', mods: { crit: 0.08, mag: 1.12 } },
  light: { name: 'Eclipse Ray', icon: '🌗', blurb: 'A beam with a shadow inside it.', mods: { mag: 1.16, crit: 0.05 } },
  shadow: { name: 'Void Sovereign', icon: '🌑', blurb: 'It steps out of somewhere else.', mods: { crit: 0.07, dodge: 0.07 } },
  wind: { name: 'Eye of the Storm', icon: '🌪', blurb: 'The calm in the middle is the weapon.', mods: { spd: 1.16, dodge: 0.06 } },
  earth: { name: 'Worldbreaker', icon: '🪨', blurb: 'The ground remembers being molten.', mods: { atk: 1.16, def: 1.1 } },
};

/* Celestial tier: five cores, unlocked by level, each stacking on the last. */
const CELESTIAL_CORES = [
  { name: 'Star Core I', icon: '✦', level: 10, blurb: 'A single star settles in the chest.', mods: { atk: 1.04, mag: 1.04 } },
  { name: 'Star Core II', icon: '✦✦', level: 25, blurb: 'A second star answers the first.', mods: { atk: 1.08, mag: 1.08 } },
  { name: 'Nebula Core', icon: '🌌', level: 40, blurb: 'A nebula spins where the heart should be.', mods: { atk: 1.13, mag: 1.13 } },
  { name: 'Galaxy Core', icon: '🌀', level: 55, blurb: 'An entire galaxy turns slowly inside.', mods: { atk: 1.18, mag: 1.18, def: 1.06 } },
  { name: 'Supernova Core', icon: '💥', level: 70, blurb: 'One held breath away from going off.', mods: { atk: 1.24, mag: 1.24, def: 1.1 } },
];

/* Creator tier: three endgame paths plus the final unlock. */
const CREATOR_PATHS = [
  { key: 'sovereign', name: 'Elemental Sovereign', icon: '👑', blurb: 'Every affinity at once: the strongest elemental attacks in the Hollow.', mods: { atk: 1.12, mag: 1.12, def: 1.06 } },
  { key: 'creator', name: 'World Creator', icon: '🌍', blurb: 'Summons elemental guardians that keep fighting after you stop.', mods: { mag: 1.12, def: 1.12, bond: 1.08 } },
  { key: 'architect', name: 'Cosmic Architect', icon: '🏗', blurb: 'Alters battlefield rules in your favour before the first hit.', mods: { winChance: 0.1, spd: 1.1, crit: 0.05 } },
];
const CREATOR_FINAL = {
  name: 'Creation Burst EX', icon: '🌠', level: 60,
  blurb: 'Twelve elemental crowns, a galaxy behind them, and one rainbow singularity.',
  mods: { atk: 1.2, mag: 1.2, def: 1.12, crit: 0.08 },
};

function abilityRarityIndex(sprite) {
  const key = typeof spriteRarityKey === 'function' && sprite ? spriteRarityKey(sprite) : 'common';
  const index = ABILITY_RARITY_ORDER.indexOf(key);
  return index < 0 ? 0 : index;
}

function abilityPathElement(sprite) {
  if (!sprite) return null;
  return typeof elementFrameKey === 'function' ? elementFrameKey(sprite.element) : null;
}

function abilityPathTree(sprite) {
  const key = abilityPathElement(sprite);
  return key ? ABILITY_PATHS[key] || null : null;
}

/* The branch this sprite picked, validated against its element: an evolved or
   re-elemented sprite keeps a path only if it still belongs. */
function abilityPathChoice(sprite) {
  const key = abilityPathElement(sprite);
  const tree = key ? ABILITY_PATHS[key] : null;
  const saved = sprite && sprite.abilityPath;
  if (!tree || !saved || saved.element !== key) return null;
  return tree.branches.find((branch) => branch.key === saved.branch) || null;
}

function abilityPathTier(sprite) {
  if (!abilityPathChoice(sprite)) return 0;
  return (Number(sprite && sprite.level) || 1) >= ABILITY_PATH_EVOLVE_LEVEL ? 2 : 1;
}

function abilityPathAbility(sprite) {
  const branch = abilityPathChoice(sprite);
  if (!branch) return null;
  const tier = abilityPathTier(sprite);
  const form = tier === 2 ? branch.t2 : branch.t1;
  const rank = abilityRarityIndex(sprite);
  const element = abilityPathElement(sprite);
  const mutation = rank >= ABILITY_SECRET_RANK && SECRET_MUTATIONS[element] ? SECRET_MUTATIONS[element] : null;
  return { branch, tier, form, mutation, name: mutation ? mutation.name : form.name, icon: mutation ? mutation.icon : form.icon };
}

/* Everything the choice adds to a fight or a care tick, in trait-mod shape. */
function abilityPathMods(sprite) {
  if (!sprite) return null;
  const choice = abilityPathAbility(sprite);
  if (!choice) return null;
  const rank = abilityRarityIndex(sprite);
  const element = abilityPathElement(sprite);
  const mods = { atk: 1, mag: 1, def: 1, spd: 1, xp: 1, bond: 1, crit: 0, dodge: 0, winChance: 0 };
  const merge = (effect) => {
    if (!effect) return;
    ['atk', 'mag', 'def', 'spd', 'xp', 'bond'].forEach((key) => { if (effect[key]) mods[key] *= effect[key]; });
    ['crit', 'dodge', 'winChance'].forEach((key) => { if (effect[key]) mods[key] += effect[key]; });
  };
  merge(choice.form.mods);
  if (choice.mutation) merge(choice.mutation.mods);
  if (rank >= ABILITY_PATH_MASTERY_RANK && ABILITY_MASTERIES[element]) merge(ABILITY_MASTERIES[element].mods);
  if (rank >= ABILITY_CELESTIAL_RANK) {
    CELESTIAL_CORES.forEach((core) => { if ((Number(sprite.level) || 1) >= core.level) merge(core.mods); });
  }
  if (rank >= ABILITY_CREATOR_RANK) {
    const chosen = CREATOR_PATHS.find((path) => path.key === (sprite.creatorPath || ''));
    if (chosen) merge(chosen.mods);
    if ((Number(sprite.level) || 1) >= CREATOR_FINAL.level) merge(CREATOR_FINAL.mods);
  }
  return mods;
}

function abilityCoreTier(sprite) {
  if (abilityRarityIndex(sprite) < ABILITY_CELESTIAL_RANK) return 0;
  const level = Number(sprite && sprite.level) || 1;
  return CELESTIAL_CORES.filter((core) => level >= core.level).length;
}

window.ABILITY_PATHS = ABILITY_PATHS;
window.ABILITY_MASTERIES = ABILITY_MASTERIES;
window.SECRET_MUTATIONS = SECRET_MUTATIONS;
window.CELESTIAL_CORES = CELESTIAL_CORES;
window.CREATOR_PATHS = CREATOR_PATHS;
window.CREATOR_FINAL = CREATOR_FINAL;
window.ABILITY_PATH_EVOLVE_LEVEL = ABILITY_PATH_EVOLVE_LEVEL;
window.AP_PATH_CHANGE_COST = AP_PATH_CHANGE_COST;
window.abilityPathElement = abilityPathElement;
window.abilityPathTree = abilityPathTree;
window.abilityPathChoice = abilityPathChoice;
window.abilityPathTier = abilityPathTier;
window.abilityPathAbility = abilityPathAbility;
window.abilityPathMods = abilityPathMods;
window.abilityCoreTier = abilityCoreTier;
window.abilityRarityIndex = abilityRarityIndex;
