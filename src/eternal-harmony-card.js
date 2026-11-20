/* Eternal Harmony Turtle — the Legendary Fusion showcase card.
   This is collector presentation, not a battle unit: the stats and moves below
   are card copy, kept separate from the hatchable species and duel systems. */

/* The eight regions of the world-shell, in the order they ring the card. */
const ETERNAL_HARMONY_ELEMENTS = [
  { key: 'dark', icon: '🌑', name: 'Dark', color: '#4b3370' },
  { key: 'nature', icon: '🌿', name: 'Nature', color: '#4f9b63' },
  { key: 'fire', icon: '🔥', name: 'Fire', color: '#d9562e' },
  { key: 'ice', icon: '❄️', name: 'Ice', color: '#6fc9e8' },
  { key: 'water', icon: '💧', name: 'Water', color: '#2f86c9' },
  { key: 'earth', icon: '🪨', name: 'Earth', color: '#9c7a4c' },
  { key: 'lightning', icon: '⚡', name: 'Lightning', color: '#d8a72e' },
  { key: 'light', icon: '☀️', name: 'Light', color: '#ffd166' },
];

/* Stat corner gems: HP green, attack red, defence gold, magic blue, speed yellow. */
const ETERNAL_HARMONY_GEMS = [
  ['HP', '9,800', '#6fe0a8'],
  ['ATK', '920', '#ff6b6b'],
  ['DEF', '1,100', '#ffd166'],
  ['MAG', '1,050', '#8fb6ff'],
  ['SPD', '680', '#ffe58a'],
];

const ETERNAL_HARMONY_CARD = {
  id: 'eternalharmony',
  number: '#001-LF',
  collection: 'Sprite Hollow Origins',
  name: 'Eternal Harmony Turtle',
  rarity: 'Legendary Fusion',
  element: 'Omni Element',
  className: 'Guardian Titan',
  stage: 'Fusion Mythic',
  power: 4950,
  stars: 10,
  skills: [
    { icon: '⚔️', name: 'Element Burst', power: '250' },
    { icon: '✨', name: 'Harmony Nova', power: '650' },
    { icon: '🌈', name: 'Worldshell Cataclysm', power: '1,800' },
  ],
  stats: [
    ['HP', '9,800'],
    ['Attack', '920'],
    ['Defense', '1,100'],
    ['Magic', '1,050'],
    ['Speed', '680'],
    ['Critical', '25%'],
    ['Crit damage', '200%'],
    ['Resistance', '80%'],
    ['Energy cost', '8'],
  ],
  passive: {
    name: 'Harmony Core',
    text: 'The Elemental Core Crystal contains all eight elements and turns their conflict into balance.',
    effects: [
      'Immune to elemental weakness.',
      '+10% power for each allied element on the field.',
      'Converts incoming elemental damage into healing.',
      'Gains a random elemental shield each turn.',
    ],
  },
  basic: {
    name: 'Element Burst',
    meta: '250 power',
    text: 'Fires a rotating beam of all eight elements. Omni damage that ignores 20% defense and has a 30% chance to inflict a random elemental status.',
  },
  special: {
    name: 'Harmony Nova',
    meta: '650 power · 3-turn cooldown',
    text: 'Releases a pulse from the Elemental Core Crystal, damaging every enemy and mending the whole team.',
    effects: ['Heals all allies by 35%.', 'Clears negative effects.', 'Grants Elemental Blessing for 2 turns.'],
  },
  ultimate: {
    name: 'Worldshell Cataclysm',
    meta: '1,800 power · 8-turn cooldown',
    text: 'Opens the world-shell and releases Nature, Fire, Ice, Water, Earth, Lightning, Dark and Light at once: colossal Omni damage to all enemies, one fallen ally revived, 50% team HP restored, and one turn of invincibility.',
  },
  trait: {
    name: 'Guardian of Balance',
    meta: 'Triggers below 25% HP · once per battle',
    text: 'Fully ascends: Attack and Magic +50%, Defense +30%, Speed +25%, and the secret ultimate unlocks.',
  },
  secret: {
    name: 'Omniverse Genesis',
    meta: '3,000 power · once per battle',
    text: 'Becomes Omniverse Turtle, summons miniature elemental worlds, freezes enemy abilities for 2 turns, strips every enemy buff, deals unavoidable Omni damage, and restores the whole team.',
  },
  flavor: 'Born from the unity of every elemental guardian, the Eternal Harmony Turtle watches over Sprite Hollow. When darkness threatens the balance of the world, its Worldshell awakens and the power of all creation answers its call.',
  collector: [
    ['Finish', 'Rainbow galaxy holo'],
    ['Edition', 'First Guardian Print'],
    ['Pull rate', '1 in 5,000 packs'],
    ['Collector score', 'SSS+'],
  ],
};

function ehcEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

/* One original vector painting: a chibi guardian turtle whose shell is split
   into the eight elemental regions, with the Core Crystal at the centre. */
function eternalHarmonyTurtleArt(uid) {
  const id = String(uid || 'ehc').replace(/[^a-zA-Z0-9_-]/g, '');
  const wedge = (path, color) => `<path d="${path}" fill="${color}" stroke="rgba(255,255,255,.16)" stroke-width=".8"/>`;
  const icon = (x, y, body) => `<g transform="translate(${x} ${y})" opacity=".92">${body}</g>`;
  return `<svg class="ehc-art" viewBox="0 0 360 360" role="img" aria-label="Eternal Harmony Turtle, a fluffy guardian turtle with an eight-element world-shell">
    <defs>
      <radialGradient id="${id}-sky" cx="50%" cy="38%" r="70%">
        <stop offset="0" stop-color="#3b2c68"/><stop offset=".55" stop-color="#17152d"/><stop offset="1" stop-color="#090914"/>
      </radialGradient>
      <radialGradient id="${id}-core" cx="45%" cy="38%" r="62%">
        <stop offset="0" stop-color="#ffffff"/><stop offset=".42" stop-color="#c8fbff"/><stop offset="1" stop-color="#7f8cff"/>
      </radialGradient>
      <radialGradient id="${id}-eye" cx="35%" cy="28%" r="78%">
        <stop offset="0" stop-color="#ffffff"/><stop offset=".28" stop-color="#c8f8ff"/><stop offset=".62" stop-color="#738cff"/><stop offset="1" stop-color="#3a2a78"/>
      </radialGradient>
      <filter id="${id}-glow" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <clipPath id="${id}-shell"><circle cx="180" cy="202" r="78"/></clipPath>
    </defs>
    <rect width="360" height="360" rx="26" fill="url(#${id}-sky)"/>
    <g fill="#fff" opacity=".72">
      <circle cx="35" cy="48" r="1.7"/><circle cx="76" cy="24" r="1.2"/><circle cx="122" cy="42" r="1"/><circle cx="302" cy="42" r="1.6"/><circle cx="330" cy="92" r="1.1"/><circle cx="312" cy="292" r="1.4"/><circle cx="58" cy="300" r="1.2"/><circle cx="27" cy="198" r="1.1"/><circle cx="334" cy="210" r="1"/><circle cx="150" cy="18" r="1.1"/><circle cx="246" cy="28" r="1.3"/><circle cx="288" cy="146" r="1"/><circle cx="72" cy="128" r="1"/><circle cx="322" cy="252" r="1.5"/><circle cx="46" cy="252" r="1"/>
    </g>
    <g fill="none" stroke-linecap="round">
      <ellipse cx="180" cy="206" rx="150" ry="54" stroke="#80e8ff" stroke-width="2" stroke-dasharray="2 7" opacity=".65" transform="rotate(-18 180 206)"/>
      <ellipse cx="180" cy="206" rx="154" ry="58" stroke="#ffd166" stroke-width="1.6" stroke-dasharray="1 9" opacity=".55" transform="rotate(22 180 206)"/>
      <ellipse cx="180" cy="206" rx="142" ry="52" stroke="#ff9ec7" stroke-width="1.5" stroke-dasharray="3 10" opacity=".5" transform="rotate(72 180 206)"/>
    </g>
    <g fill="#fff6e4" opacity=".95">
      <circle cx="180" cy="106" r="18"/><circle cx="135" cy="118" r="17"/><circle cx="225" cy="118" r="17"/><circle cx="108" cy="152" r="17"/><circle cx="252" cy="152" r="17"/><circle cx="96" cy="196" r="17"/><circle cx="264" cy="196" r="17"/><circle cx="98" cy="242" r="17"/><circle cx="262" cy="242" r="17"/><circle cx="116" cy="280" r="16"/><circle cx="244" cy="280" r="16"/><circle cx="150" cy="298" r="15"/><circle cx="210" cy="298" r="15"/>
    </g>
    <g class="ehc-shell">
      <circle cx="180" cy="202" r="82" fill="#241d3d" stroke="#ffd166" stroke-width="3.5"/>
      <g clip-path="url(#${id}-shell)">
        <circle cx="180" cy="202" r="78" fill="#231d3c"/>
        ${wedge('M180 202 L180 124 A78 78 0 0 1 235.15 146.85 Z', '#4f9b63')}
        ${wedge('M180 202 L235.15 146.85 A78 78 0 0 1 258 202 Z', '#d9562e')}
        ${wedge('M180 202 L258 202 A78 78 0 0 1 235.15 257.15 Z', '#6fc9e8')}
        ${wedge('M180 202 L235.15 257.15 A78 78 0 0 1 180 280 Z', '#2f86c9')}
        ${wedge('M180 202 L180 280 A78 78 0 0 1 124.85 257.15 Z', '#9c7a4c')}
        ${wedge('M180 202 L124.85 257.15 A78 78 0 0 1 102 202 Z', '#d8a72e')}
        ${wedge('M180 202 L102 202 A78 78 0 0 1 124.85 146.85 Z', '#4b3370')}
        ${wedge('M180 202 L124.85 146.85 A78 78 0 0 1 180 124 Z', '#d8b04a')}
        <circle cx="180" cy="202" r="72" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="1.2"/>
        <circle cx="180" cy="202" r="62" fill="none" stroke="rgba(255,255,255,.12)" stroke-dasharray="2 4"/>
        ${icon(201, 150, '<path d="M0 8 L-6 -2 L-2 -2 L-7 -9 L0 -16 L7 -9 L2 -2 L6 -2 Z" fill="#dcffd4"/><rect x="-1.5" y="6" width="3" height="7" rx="1" fill="#d8b08a"/>')}
        ${icon(224, 180, '<path d="M0 10 C-9 2 -5 -6 0 -15 C2 -8 8 -5 7 2 C6 8 2 11 0 10 Z" fill="#ffe0a8"/>')}
        ${icon(224, 224, '<g stroke="#e9fdff" stroke-width="2" stroke-linecap="round"><path d="M-12 0H12M0 -12V12M-9 -9L9 9M9 -9L-9 9"/></g>')}
        ${icon(201, 254, '<path d="M-14 2 Q-7 -8 0 0 T14 0" fill="none" stroke="#d9f8ff" stroke-width="2.6" stroke-linecap="round"/><path d="M-11 9 Q-4 1 3 9 T17 9" fill="none" stroke="#8fdcff" stroke-width="2" stroke-linecap="round"/>')}
        ${icon(159, 254, '<path d="M-14 8 L-4 -8 L2 0 L7 -6 L14 8 Z" fill="#e7d2b0"/><path d="M-3 -4 L0 0 L3 -1" fill="none" stroke="#7f6848" stroke-width="1.4"/>')}
        ${icon(136, 224, '<path d="M2 -15 L-9 2 L-1 2 L-4 15 L9 -4 L1 -4 Z" fill="#fff0a8"/>')}
        ${icon(136, 180, '<path d="M4 -12 A13 13 0 1 0 4 12 A10 10 0 1 1 4 -12 Z" fill="#d8c5ff"/>')}
        ${icon(159, 150, '<circle r="7" fill="#fff3b0"/><g stroke="#ffe58a" stroke-width="1.8" stroke-linecap="round"><path d="M0 -12V-9M0 9V12M-12 0H-9M9 0H12M-8.5 -8.5L-6.5 -6.5M6.5 6.5L8.5 8.5M8.5 -8.5L6.5 -6.5M-6.5 6.5L-8.5 8.5"/></g>')}
      </g>
      <circle cx="180" cy="202" r="57" fill="rgba(9,8,22,.58)"/>
      <circle cx="180" cy="202" r="50" fill="none" stroke="rgba(255,255,255,.22)" stroke-dasharray="3 5"/>
      <g filter="url(#${id}-glow)">
        <polygon points="180,171 199,202 180,233 161,202" fill="url(#${id}-core)" stroke="#fff" stroke-width="2"/>
        <polygon points="180,181 191,202 180,223 169,202" fill="#fff" opacity=".72"/>
        <circle cx="180" cy="202" r="5" fill="#fff"/>
      </g>
    </g>
    <g class="ehc-head">
      <circle cx="180" cy="98" r="51" fill="#fff3dc"/>
      <circle cx="180" cy="98" r="53" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="5" stroke-dasharray="1 8"/>
      <circle cx="180" cy="53" r="10" fill="#fff6e4"/><circle cx="163" cy="57" r="9" fill="#fff6e4"/><circle cx="197" cy="57" r="9" fill="#fff6e4"/>
      <ellipse cx="180" cy="107" rx="35" ry="28" fill="#fffdf7"/>
      <ellipse cx="161" cy="98" rx="16" ry="18" fill="url(#${id}-eye)" stroke="#fff" stroke-width="2.5"/>
      <ellipse cx="199" cy="98" rx="16" ry="18" fill="url(#${id}-eye)" stroke="#fff" stroke-width="2.5"/>
      <ellipse cx="155" cy="91" rx="5" ry="7" fill="#fff" opacity=".92"/>
      <ellipse cx="193" cy="91" rx="5" ry="7" fill="#fff" opacity=".92"/>
      <circle cx="157" cy="105" r="3" fill="#fff" opacity=".8"/><circle cx="195" cy="105" r="3" fill="#fff" opacity=".8"/>
      <ellipse cx="146" cy="113" rx="8" ry="5" fill="#ffb4cf" opacity=".75"/><ellipse cx="214" cy="113" rx="8" ry="5" fill="#ffb4cf" opacity=".75"/>
      <path d="M173 119 Q180 125 187 119" fill="none" stroke="#7a4f5e" stroke-width="2.4" stroke-linecap="round"/>
      <g>
        <path d="M163 58 L168 40 L176 50 L180 34 L184 50 L192 40 L197 58 L188 55 L180 64 L172 55 Z" fill="#ffd166" stroke="#b8862a" stroke-width="1.2"/>
        <circle cx="180" cy="47" r="3" fill="#8fe8ff"/><circle cx="171" cy="54" r="2" fill="#ff9ec7"/><circle cx="189" cy="54" r="2" fill="#ff9ec7"/>
      </g>
    </g>
    <g>
      <ellipse cx="132" cy="286" rx="24" ry="14" fill="#fff3dc" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <ellipse cx="228" cy="286" rx="24" ry="14" fill="#fff3dc" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <path d="M120 288 l-4 5 M130 291 l-2 6 M140 290 l1 6 M216 290 l-1 6 M226 291 l2 6 M236 288 l4 5" stroke="#c7a58c" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <g fill="none" stroke-linecap="round" opacity=".8">
      <path d="M51 212 Q70 188 92 207" stroke="#8fe8ff" stroke-width="1.5"/><path d="M268 212 Q288 186 309 207" stroke="#ffd166" stroke-width="1.5"/>
      <path d="M72 128 Q86 110 106 122" stroke="#ff9ec7" stroke-width="1.2"/><path d="M254 124 Q276 108 292 128" stroke="#b18cff" stroke-width="1.2"/>
    </g>
    <g fill="#ffe9a8">
      <circle cx="52" cy="190" r="2.2"/><circle cx="308" cy="190" r="2.2"/><circle cx="82" cy="118" r="1.8"/><circle cx="280" cy="116" r="1.8"/><circle cx="46" cy="240" r="1.6"/><circle cx="314" cy="238" r="1.6"/>
    </g>
  </svg>`;
}

/* The front face: banner, element ring, art window with the stat corner, the
   identity block, ability panel, stars and the bottom collector strip. */
function eternalHarmonyCardFace(uid) {
  const c = ETERNAL_HARMONY_CARD;
  return `<article class="ehc-card" data-eh-card="${c.id}" data-eh-variant="legendary" aria-label="${ehcEsc(c.name)} collectible card">
    <div class="ehc-banner"><b>✨ ${ehcEsc(c.rarity)} ✨</b></div>
    <div class="ehc-element-ring" aria-hidden="true">${ETERNAL_HARMONY_ELEMENTS.map((el) => `<span style="--el:${el.color}" title="${ehcEsc(el.name)}">${el.icon}</span>`).join('')}</div>
    <div class="ehc-art-window">
      ${eternalHarmonyTurtleArt(uid || 'ehc')}
      <span class="ehc-art-holo" aria-hidden="true"></span>
      <span class="ehc-stats-corner" aria-label="Card stats">${ETERNAL_HARMONY_GEMS.map(([label, value, color]) => `<div style="--gem:${color}"><i aria-hidden="true"></i>${label}<b>${value}</b></div>`).join('')}</span>
    </div>
    <div class="ehc-identity">
      <h4>${ehcEsc(c.name)}</h4>
      <div class="ehc-identity-chips"><span>Element: Omni</span><span>Class: ${ehcEsc(c.className)}</span></div>
      <div class="ehc-vitals"><div><small>HP</small><b>9,800</b></div><div><small>Power</small><b>${c.power.toLocaleString('en-US')}</b></div></div>
    </div>
    <div class="ehc-ability-panel">
      <div class="ehc-passive"><span>${ehcEsc(c.passive.name)}<small>Passive</small></span><p>Absorbs elemental energy and converts damage into healing.</p></div>
      <ul class="ehc-skill-list">${c.skills.map((skill) => `<li><i aria-hidden="true">${skill.icon}</i><b>${ehcEsc(skill.name)}</b><em>${ehcEsc(skill.power)}</em></li>`).join('')}</ul>
    </div>
    <div class="ehc-stars" aria-label="Power rating ${c.stars} out of 10">${'★'.repeat(c.stars)}<span aria-hidden="true">${'☆'.repeat(10 - c.stars)}</span></div>
    <div class="ehc-strip"><span>${ehcEsc(c.rarity)}</span><span>${ehcEsc(c.className)}</span><b>${ehcEsc(c.number)}</b><span>First Guardian Print</span></div>
  </article>`;
}

function eternalHarmonyAbilityHTML(label, data) {
  return `<article class="ehc-ability">
    <div class="ehc-ability-head"><span>${ehcEsc(label)}</span><b>${ehcEsc(data.name)}</b>${data.meta ? `<em>${ehcEsc(data.meta)}</em>` : ''}</div>
    <p>${ehcEsc(data.text)}</p>
    ${data.effects ? `<ul>${data.effects.map((item) => `<li>${ehcEsc(item)}</li>`).join('')}</ul>` : ''}
  </article>`;
}

function eternalHarmonyCardMarkup() {
  const c = ETERNAL_HARMONY_CARD;
  return `<section class="ehc-showcase" data-eh-card="${c.id}">
    <div class="ehc-showcase-head">
      <span class="ehc-kicker">${ehcEsc(c.collection)} · ${ehcEsc(c.number)}</span>
      <h3>👑 Legendary Fusion card</h3>
      <p>A collector showcase straight from the world-shell: eight elements, one guardian, and the Elemental Core Crystal holding them together.</p>
      <a class="ehc-gallery-link" href="assets/cards/eternal-harmony-turtle.html" target="_blank" rel="noopener">Open the three-card gallery ↗</a>
    </div>
    <div class="ehc-layout">
      ${eternalHarmonyCardFace('ehc')}
      <div class="ehc-copy">
        <div class="ehc-powerline"><div><span>POWER RATING</span><b>${c.power.toLocaleString()}</b></div><div><span>ELEMENT</span><b>${ehcEsc(c.element)}</b></div><div><span>CLASS</span><b>${ehcEsc(c.className)}</b></div></div>
        <div class="ehc-stats">${c.stats.map(([label, value]) => `<div><span>${ehcEsc(label)}</span><b>${ehcEsc(value)}</b></div>`).join('')}</div>
        <div class="ehc-abilities">
          ${eternalHarmonyAbilityHTML('Passive', c.passive)}
          ${eternalHarmonyAbilityHTML('Basic attack', c.basic)}
          ${eternalHarmonyAbilityHTML('Special', c.special)}
          ${eternalHarmonyAbilityHTML('Ultimate', c.ultimate)}
          ${eternalHarmonyAbilityHTML('Legendary trait', c.trait)}
          ${eternalHarmonyAbilityHTML('Secret ultimate', c.secret)}
        </div>
        <blockquote class="ehc-flavor">“${ehcEsc(c.flavor)}”</blockquote>
        <div class="ehc-collector">${c.collector.map(([label, value]) => `<span><i>${ehcEsc(label)}</i><b>${ehcEsc(value)}</b></span>`).join('')}</div>
        <p class="ehc-note">Collector showcase · card stats are presentation copy. The Eternal Harmony Turtle unlocks as a secret exotic once all eight turtle lines are in your Hollow.</p>
      </div>
    </div>
  </section>`;
}
