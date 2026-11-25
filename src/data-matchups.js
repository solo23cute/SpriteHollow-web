/* Elemental effectiveness and combat classes.

   `PUFFLE_STRONG_VS` is the archive's own chart: a family's list is what it hits
   for bonus damage. Weaknesses are derived by inverting it, so the two halves can
   never fall out of sync. The Creator family (stored as the `secret` family)
   transcends the chart instead of taking part in it.

   These numbers are data only today: no fight reads them yet, so they are safe to
   inspect and safe to leave idle until combat is wired to them. */

const PUFFLE_STRONG_VS = {
  fire: ['nature', 'ice', 'mushroom'],
  water: ['fire', 'shadow'],
  electric: ['water', 'wind'],
  earth: ['electric', 'wind'],
  ice: ['nature', 'wind'],
  light: ['shadow', 'spirit'],
  shadow: ['spirit', 'moon'],
  moon: ['fire', 'shadow'],
  cosmic: ['moon', 'light'],
  crystal: ['electric', 'dragon'],
  dragon: ['fire', 'nature'],
  spirit: ['dragon', 'moon'],
  mushroom: ['earth', 'water'],
  poison: ['nature', 'water', 'mushroom'],
  metal: ['crystal', 'ice', 'earth'],
  music: ['time', 'spirit'],
  time: ['cosmic', 'light'],
  rainbow: ['cosmic', 'crystal', 'time'],
};

const PUFFLE_ELEMENT_FAMILIES = ['nature', 'fire', 'water', 'ice', 'electric', 'earth', 'wind', 'moon', 'light', 'shadow', 'cosmic', 'crystal', 'dragon', 'spirit', 'mushroom', 'poison', 'metal', 'music', 'time', 'rainbow', 'secret'];

const PUFFLE_MATCHUPS = (() => {
  const table = {};
  PUFFLE_ELEMENT_FAMILIES.forEach((family) => {
    table[family] = { strong: [], weak: [] };
  });
  Object.keys(PUFFLE_STRONG_VS).forEach((attacker) => {
    if (!table[attacker]) return;
    table[attacker].strong = PUFFLE_STRONG_VS[attacker].filter((target) => table[target]);
    PUFFLE_STRONG_VS[attacker].forEach((target) => {
      if (table[target] && !table[target].weak.includes(attacker)) table[target].weak.push(attacker);
    });
  });
  /* The Creator family answers to nothing and reaches everything. */
  table.secret = { strong: PUFFLE_ELEMENT_FAMILIES.filter((f) => f !== 'secret'), weak: [] };
  return table;
})();

/* One combat class per family, from the archive's class list. */
const PUFFLE_FAMILY_CLASS = {
  nature: { name: 'Healer', icon: '🌿', note: 'Healing vines, regeneration, shields.' },
  fire: { name: 'Bruiser', icon: '🔥', note: 'Burn damage, explosions, phoenix rebirth.' },
  water: { name: 'Support', icon: '💧', note: 'Healing tides, wave attacks, barriers.' },
  ice: { name: 'Controller', icon: '❄️', note: 'Freeze effects, slowing enemies, crystal armour.' },
  electric: { name: 'Assassin', icon: '⚡', note: 'Chain lightning, speed boosts, critical strikes.' },
  earth: { name: 'Tank', icon: '🌎', note: 'Stone armour, taunts, seismic attacks.' },
  wind: { name: 'Assassin', icon: '🌪️', note: 'Evasion, tornado attacks, speed buffs.' },
  moon: { name: 'Support', icon: '🌙', note: 'Healing, buffs, celestial blessings.' },
  light: { name: 'Healer', icon: '☀️', note: 'Purification, radiant shields, holy damage.' },
  shadow: { name: 'Assassin', icon: '🌑', note: 'Stealth, lifesteal, curse effects.' },
  cosmic: { name: 'Mage', icon: '🌌', note: 'Gravity manipulation, constellations, meteor attacks.' },
  crystal: { name: 'Tank', icon: '💎', note: 'Prism beams, reflection shields, crystal barriers.' },
  dragon: { name: 'Bruiser', icon: '🐉', note: 'Devastating breath attacks, flight, brute strength.' },
  spirit: { name: 'Assassin', icon: '👻', note: 'Soul damage, astral projection, execution abilities.' },
  mushroom: { name: 'Controller', icon: '🍄', note: 'Poison clouds, spores, debuffs.' },
  poison: { name: 'Controller', icon: '☠️', note: 'Toxic clouds, venom, corrosion, and decay.' },
  metal: { name: 'Tank', icon: '⚙️', note: 'Armour, magnets, blades, and energy cores.' },
  music: { name: 'Support', icon: '🎵', note: 'Team buffs, rhythm magic, harmony effects.' },
  time: { name: 'Controller', icon: '⏳', note: 'Extra turns, speed control, timeline manipulation.' },
  rainbow: { name: 'Mage', icon: '🌈', note: 'Adaptive elemental powers, spectrum magic.' },
  secret: { name: 'Guardian', icon: '👑', note: 'Reality manipulation, universal energy, creator powers.' },
  classic: { name: 'Performer', icon: '🐧', note: 'Colour-shifting tricks, party buffs, and unshakeable cheer.' },
};

const PUFFLE_FAMILY_LABELS = {
  nature: 'Nature', fire: 'Fire', water: 'Water', ice: 'Ice', electric: 'Electric', earth: 'Earth',
  wind: 'Wind', moon: 'Moon', light: 'Light', shadow: 'Shadow', cosmic: 'Cosmic', crystal: 'Crystal',
  dragon: 'Dragon', spirit: 'Spirit', mushroom: 'Mushroom', poison: 'Poison', metal: 'Metal',
  music: 'Music', time: 'Time', rainbow: 'Rainbow', secret: 'Creator',
  classic: 'Classic',
};

window.PUFFLE_MATCHUPS = PUFFLE_MATCHUPS;
window.PUFFLE_FAMILY_CLASS = PUFFLE_FAMILY_CLASS;

/* A species can be a chart species rather than a chain root, so fall back to the
   element it was registered with before giving up. */
window.puffleFamilyOf = function puffleFamilyOf(elementKey) {
  const chain = typeof window.PUFFLE_EVOLUTION_CHAINS === 'object' && window.PUFFLE_EVOLUTION_CHAINS
    ? window.PUFFLE_EVOLUTION_CHAINS[elementKey]
    : null;
  if (chain && chain.family) return chain.family;
  const element = typeof ELEMENTS !== 'undefined' ? ELEMENTS[elementKey] : null;
  const tag = element && element.puffleElement ? String(element.puffleElement).toLowerCase() : null;
  if (!tag) return null;
  const family = tag === 'creator' ? 'secret' : tag;
  return PUFFLE_ELEMENT_FAMILIES.includes(family) ? family : null;
};

window.puffleMatchupFor = function puffleMatchupFor(elementKey) {
  const family = window.puffleFamilyOf(elementKey);
  return family ? { family, ...(PUFFLE_MATCHUPS[family] || { strong: [], weak: [] }) } : null;
};

window.puffleClassFor = function puffleClassFor(elementKey) {
  const family = window.puffleFamilyOf(elementKey);
  return family ? PUFFLE_FAMILY_CLASS[family] || null : null;
};

const puffleFamilyName = (key) => PUFFLE_FAMILY_LABELS[key] || key;

/* Chips for the Codex: class, what the family beats, and what it fears. */
window.puffleMatchupHTML = function puffleMatchupHTML(elementKey) {
  const matchup = window.puffleMatchupFor(elementKey);
  if (!matchup) return '';
  const cls = window.puffleClassFor(elementKey);
  const strong = matchup.strong.map(puffleFamilyName);
  const weak = matchup.weak.map(puffleFamilyName);
  return `<div class="card" style="padding:12px;margin-top:10px;text-align:left" data-matchup="${matchup.family}">
    <div class="between" style="margin-bottom:8px"><div class="tiny muted" style="font-weight:800;letter-spacing:.08em">BATTLE PROFILE</div>${cls ? `<span class="chip" title="${esc(cls.note)}">${cls.icon} ${esc(cls.name)}</span>` : ''}</div>
    <div class="row" style="flex-wrap:wrap;gap:5px;justify-content:flex-start">
      ${strong.length ? `<span class="chip" style="border-color:#46C46E" title="Bonus damage against these families">⚔️ Beats ${esc(strong.join(' · '))}</span>` : '<span class="chip" style="border-color:#46C46E">⚔️ Beats every family</span>'}
      ${weak.length ? `<span class="chip" style="border-color:#FF6B6B" title="Takes bonus damage from these families">🛡️ Fears ${esc(weak.join(' · '))}</span>` : '<span class="chip" style="border-color:#FFD166">🛡️ No weaknesses</span>'}
    </div>
    ${cls ? `<p class="tiny muted" style="margin:8px 0 0;line-height:1.5">${esc(cls.name)} — ${esc(cls.note)}</p>` : ''}
  </div>`;
};

/* One-line elemental power per family, taken from the universe-poster brief so
   the Codex can name what a family actually does in battle. */
const PUFFLE_FAMILY_POWERS = {
  nature: 'Healing vines and regeneration',
  fire: 'Burns and phoenix flames',
  water: 'Tidal magic and barriers',
  ice: 'Freezing storms and crystal armour',
  electric: 'Chain lightning and speed boosts',
  earth: 'Seismic attacks and stone armour',
  wind: 'Tornadoes and evasion',
  moon: 'Blessings and healing',
  light: 'Holy magic and radiant shields',
  shadow: 'Curses and lifesteal',
  cosmic: 'Gravity and meteors',
  crystal: 'Prism beams and reflective barriers',
  dragon: 'Breath attacks and brute strength',
  spirit: 'Soul magic and astral powers',
  mushroom: 'Spores and poison clouds',
  music: 'Rhythm energy and team buffs',
  time: 'Time manipulation and extra turns',
  rainbow: 'Adaptive spectrum magic',
  secret: 'Reality-bending universal energy',
  classic: 'Classic colour-shifting and party magic',
};
window.PUFFLE_FAMILY_POWERS = PUFFLE_FAMILY_POWERS;
window.puffleFamilyPower = function puffleFamilyPower(elementKey) {
  const family = typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(elementKey) : elementKey;
  return (family && PUFFLE_FAMILY_POWERS[family]) || null;
};
