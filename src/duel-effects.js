/* Duel status effects.
   Ability paths already move raw stats. This layer makes the branch tags
   matter inside a fight: burn stacks tick each exchange, poison lingers,
   freeze costs the enemy a turn, shields soak a hit, regen restores resolve
   and reflect sends damage back. The Hollow spar and the guardian bout both
   call these same functions, so a build behaves the same in either arena. */

const DUEL_STATUS_META = {
  burn: { icon: '🔥', name: 'Burn' },
  poison: { icon: '☠️', name: 'Poison' },
  freeze: { icon: '❄️', name: 'Freeze' },
  shield: { icon: '🛡', name: 'Shield' },
  regen: { icon: '💚', name: 'Regen' },
  reflect: { icon: '🪞', name: 'Reflect' },
};

/* Branch tags are written for the player, so several spellings map to the same
   effect. Unmapped tags (Crit, Speed, Summon names) stay flavour only. */
const DUEL_TAG_EFFECTS = {
  Burn: { burn: 2 },
  Spread: { burn: 1, poison: 1 },
  'Damage over time': { poison: 1 },
  DoT: { poison: 2 },
  Freeze: { freeze: 1 },
  Slow: { freeze: 1 },
  Control: { freeze: 1 },
  Shield: { shield: 2 },
  Defence: { shield: 1 },
  Heal: { regen: 2 },
  Regen: { regen: 2 },
  Drain: { regen: 1, reflect: 1 },
  Reflect: { reflect: 1 },
  Chain: { chain: 1 },
  AoE: { chain: 1 },
  Team: { regen: 1 },
  Buff: { regen: 1 },
  Immunity: { resist: 0.35 },
  Cleanse: { cleanse: 1 },
};

/* Even with no branch chosen, an element leans a little way into one effect,
   so two elements do not fight identically from the first duel. */
const DUEL_ELEMENT_EFFECTS = {
  fire: { burn: 1 },
  water: { regen: 1 },
  nature: { regen: 1 },
  electric: { chain: 1 },
  ice: { freeze: 1 },
  wind: { freeze: 1 },
  earth: { shield: 1 },
  poison: { poison: 1 },
  metal: { shield: 1, resist: 0.15 },
  crystal: { shield: 1, resist: 0.15 },
  light: { regen: 1, cleanse: 1 },
  shadow: { poison: 1 },
};

/* Status sounds are cosmetic feedback. The engine still runs headless when
   there is no audio object, so tests and tools can call it safely. */
function duelStatusSound(kind, delay = 0) {
  if (typeof Sfx !== 'undefined' && Sfx && typeof Sfx.duelStatus === 'function') Sfx.duelStatus(kind, delay);
}

function duelEffectsFor(sprite) {
  const out = { burn: 0, poison: 0, freeze: 0, shield: 0, regen: 0, reflect: 0, chain: 0, resist: 0, cleanse: 0, tags: [] };
  const add = (map) => Object.keys(map).forEach((key) => { if (key in out) out[key] += map[key]; });
  const element = sprite && typeof elementFrameKey === 'function' ? elementFrameKey(sprite.element) : null;
  if (element && DUEL_ELEMENT_EFFECTS[element]) add(DUEL_ELEMENT_EFFECTS[element]);
  if (!sprite) return out;
  const choice = typeof abilityPathChoice === 'function' ? abilityPathChoice(sprite) : null;
  if (!choice) return out;
  const tier = typeof abilityPathTier === 'function' ? abilityPathTier(sprite) : 1;
  const tags = (choice.t1.tags || []).concat(choice.t2.tags || []);
  tags.forEach((tag) => {
    if (DUEL_TAG_EFFECTS[tag]) add(DUEL_TAG_EFFECTS[tag]);
    if (out.tags.indexOf(tag) < 0) out.tags.push(tag);
  });
  /* The evolved form leans harder into whatever the branch already does. */
  if (tier === 2) {
    if (out.burn) out.burn += 1;
    if (out.poison) out.poison += 1;
    if (out.shield) out.shield += 1;
  }
  return out;
}

/* Live status state for one combatant. `effects` is static (from the build),
   the counters are what the fight accumulates. */
function duelSide(sprite) {
  return { effects: duelEffectsFor(sprite), burn: 0, poison: 0, freeze: 0, shield: 0 };
}

/* Applies the attacker's build to the defender. Damage is passed through so
   the caller keeps its own strike maths; pass 0 to only apply statuses. */
function duelOnStrike(attacker, defender, raw) {
  const out = { damage: Math.max(0, Math.round(Number(raw) || 0)), heal: 0, log: [] };
  if (!attacker || !defender) return out;
  const fx = attacker.effects || {};
  /* Each status gets its own short voice; a multi-status build staggers them
     so burn, poison and freeze read as three events instead of one blur. */
  let soundAt = 0;
  const ping = (kind) => { duelStatusSound(kind, soundAt); soundAt += 0.09; };
  if (fx.chain) {
    out.damage += fx.chain;
    out.log.push(`🔗 Chain +${fx.chain}.`);
  }
  /* Cleanse wipes this side's own burn, poison and freeze on the exchange. */
  if (fx.cleanse && ((attacker.burn || 0) + (attacker.poison || 0) + (attacker.freeze || 0) > 0)) {
    attacker.burn = 0;
    attacker.poison = 0;
    attacker.freeze = 0;
    out.log.push('✨ Cleansed.');
    ping('cleanse');
  }
  /* Resistance is rolled once per exchange and covers all three statuses. */
  const resisted = !!fx.resist && Math.random() < Math.min(0.6, fx.resist);
  if (resisted && (fx.burn || fx.poison || fx.freeze)) {
    out.log.push('🧿 Statuses resisted.');
    ping('resist');
  } else {
    if (fx.burn) {
      defender.burn = Math.min(6, (defender.burn || 0) + fx.burn);
      out.log.push(`🔥 Burn ${defender.burn}.`);
      ping('burn');
    }
    if (fx.poison) {
      defender.poison = Math.min(9, (defender.poison || 0) + fx.poison);
      out.log.push(`☠️ Poison ${defender.poison}.`);
      ping('poison');
    }
    if (fx.freeze && Math.random() < 0.4) {
      defender.freeze = Math.max(1, defender.freeze || 0);
      out.log.push('❄️ Frozen.');
      ping('freeze');
    }
  }
  if (fx.shield) {
    attacker.shield = Math.min(8, (attacker.shield || 0) + fx.shield);
    ping('shield');
  }
  if (fx.regen) {
    out.heal = fx.regen;
    out.log.push(`💚 Regen +${fx.regen}.`);
    ping('regen');
  }
  if (fx.reflect) {
    out.reflect = fx.reflect;
    ping('reflect');
  }
  return out;
}

/* End-of-exchange damage. Burn fades as it burns; poison fades one stack per
   tick so a long fight cannot snowball into a one-sided finish. */
function duelTickStatuses(side) {
  const out = { damage: 0, log: '' };
  if (!side) return out;
  const logs = [];
  if (side.burn > 0) {
    const damage = side.burn * 2;
    out.damage += damage;
    logs.push(`🔥 Burn deals ${damage}.`);
    duelStatusSound('burn');
    side.burn = Math.max(0, side.burn - 1);
  }
  if (side.poison > 0) {
    const damage = side.poison;
    out.damage += damage;
    logs.push(`☠️ Poison deals ${damage}.`);
    duelStatusSound('poison');
    side.poison = Math.max(0, side.poison - 1);
  }
  out.log = logs.join(' ');
  return out;
}

function duelStatusChips(side, label) {
  if (!side) return '';
  const tag = label ? ` ${esc(label)}` : '';
  const chips = [];
  const push = (key, value) => {
    const meta = DUEL_STATUS_META[key];
    if (meta) chips.push(`<span class="ds-chip ${key}">${meta.icon}${tag} ${meta.name} ${value}</span>`);
  };
  if (side.burn) push('burn', side.burn);
  if (side.poison) push('poison', side.poison);
  if (side.freeze) push('freeze', side.freeze);
  if (side.shield) push('shield', side.shield);
  const fx = side.effects || {};
  if (fx.regen) chips.push(`<span class="ds-chip regen">💚${tag} Regen</span>`);
  if (fx.reflect) chips.push(`<span class="ds-chip reflect">🪞${tag} Reflect</span>`);
  if (fx.resist) chips.push(`<span class="ds-chip resist">🧿${tag} ${Math.round(fx.resist * 100)}% resist</span>`);
  if (fx.cleanse) chips.push(`<span class="ds-chip cleanse">✨${tag} Cleanse</span>`);
  return chips.join('');
}

/* Picker summary: what this build will actually bring to the fight, so an
   opponent can be read before the first strike. */
function duelEffectChips(sprite) {
  const fx = duelEffectsFor(sprite);
  const rows = [];
  if (fx.burn) rows.push(['#ff9a5a', '🔥', `Burn ${fx.burn}`]);
  if (fx.poison) rows.push(['#9ee07a', '☠️', `Poison ${fx.poison}`]);
  if (fx.freeze) rows.push(['#9ad7ff', '❄️', 'Freeze']);
  if (fx.shield) rows.push(['#ffd166', '🛡', 'Shield']);
  if (fx.regen) rows.push(['#7cf0c0', '💚', 'Regen']);
  if (fx.chain) rows.push(['#b3e5ff', '🔗', 'Chain']);
  if (fx.resist) rows.push(['#c9b6ff', '🧿', `${Math.round(fx.resist * 100)}% resist`]);
  if (fx.cleanse) rows.push(['#ffe9a3', '✨', 'Cleanse']);
  return rows.map(([color, icon, label]) => `<span class="chip ds-pick" style="border-color:${color}66;font-size:9.5px;padding:3px 7px">${icon} ${label}</span>`).join('');
}

window.duelEffectsFor = duelEffectsFor;
window.duelSide = duelSide;
window.duelOnStrike = duelOnStrike;
window.duelTickStatuses = duelTickStatuses;
window.duelStatusChips = duelStatusChips;
window.duelEffectChips = duelEffectChips;
window.DUEL_STATUS_META = DUEL_STATUS_META;
