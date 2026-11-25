/* Additional Wiki guides for the collection gaps and the Home/Hollow split.
   Loaded after wiki-catalog.js so WIKI_GUIDES already exists. */

function gtaWaveBody() {
  if (typeof GTA_BY_GROUP === 'undefined') return '<p class="wiki-lede">The GTA district roster is still loading.</p>';
  const link = (key) => {
    const el = ELEMENTS[key];
    const group = GTA_GROUPS[el.gtaGroup];
    return `<button class="wiki-link" data-wiki-type="${key}"><b>${esc(el.name)}</b><span>${esc(group?.label || 'Grand Theft Auto')} · ${esc(el.gtaGame || 'District')}</span></button>`;
  };
  return `<p class="wiki-lede">The Hollow has <b>${GTA_TOTAL} Grand Theft Auto signatures</b> across <b>${GTA_GROUP_ORDER.length} game groups</b>, from the top-down classics to Liberty City, Vice City, San Andreas, and Los Santos. Every one has its own gene, Titan, type egg, named hybrid, and district home.</p>
    <p>Their home biomes are live environments: Liberty City Docks, Vice Beach, San Andreas Backroads, Los Santos Hills, London Streets, Chinatown Alleys, and Anywhere City. A GTA sprite wakes up in its own district, and you can move it to any unlocked scene from its Home window.</p>
    ${GTA_GROUP_ORDER.map((groupKey) => {
      const group = GTA_GROUPS[groupKey];
      const keys = GTA_BY_GROUP[groupKey] || [];
      return `<h3>${group.icon} ${esc(group.label)} · ${keys.length}</h3><p>${esc(group.blurb)}</p><div class="wiki-hybrid-list">${keys.map(link).join('')}</div>`;
    }).join('')}
    <h3>How they play</h3>
    <p>GTA genes lean into game coins, night payouts, chat coins, gifts, and slower needs. Their district homes count as real habitats for the XP bonus, and every character can breed with any classic element for its named hybrid.</p>`;
}

function homesWikiBody() {
  return `<p class="wiki-lede">A sprite can be <b>at home</b> or <b>out in the Hollow</b>. The two rosters are separate on purpose: sprites at home rest in their own biome and are hidden from the Hollow scene, while every sprite that is not at home shares the Hollow together.</p>
    <h3>At home</h3>
    <p>Open <b>🪟 Homes</b> from the Hollow or use the <b>🏠 Homes</b> screen. Each window shows one sprite in its own biome, with its own care buttons, needs, tier chip, and coin jar. The biome filter shows one environment at a time, so a large collection never turns into a wall of identical rooms.</p>
    <p>A sprite at home recovers all four needs, can sleep long, and earns coins while you are away. <b>Visit room</b> opens a one-on-one visit in that environment. <b>Back to the Hollow</b> returns the sprite to the shared scene and collects its waiting coins.</p>
    <h3>Out in the Hollow</h3>
    <p>Sprites that are not at home appear together in the main Hollow, one shared scene with room for the whole roster. This is the roster used by petting, care, gifts, and the friendly Hollow Duel. A sprite at home is deliberately not a duel opponent until it comes back.</p>
    <h3>Biomes and tiers</h3>
    <p>Every window is a real habitat: the type biomes, the eight biome habitats, the GTA districts, and the Hollow exotic stages all give their matching species the full XP bonus. Every sprite keeps its rarity tier from the type-egg ladder, shown on its Home window and in the collection. Moving a sprite's room changes its biome and window art, not its species, tier, genes, or saves.</p>`;
}

function homeViewWikiBody() {
  return `<p class="wiki-lede"><b>Home</b> is the room you walk into, and <b>Decor mode</b> rearranges it in place. Both read the same house, furniture and tint data as Homes, hangouts and one-on-one visits — decorating here is not a separate room.</p>
    <h3>Home view</h3>
    <p>Open <b>🏡 Home</b> from the bottom navigation. The room belongs to the shared house your active sprite lives in; if you have no shared house yet, it falls back to the first shared house, then to the active or sent-home sprite alone. The stage shows the scene, the room theme, every resident, and the same furniture the Hollow uses.</p>
    <p>The header reads the live house: <b>Home level</b> from house bond and the best resident level, <b>Comfort</b> from bond, every resident's Joy, and owned furniture, plus the resident count. Sleeping sprites show their sleep expression.</p>
    <h3>Decor mode</h3>
    <p>Tap <b>🎨 Decor</b> on the dock. Furniture in the room becomes tappable: choose a piece, then move it to the <b>Left</b>, <b>Centre</b> or <b>Right</b> wall spot, or <b>Hide</b> and <b>Show</b> it again. Free decorations and bought upgrades follow the same rules.</p>
    <p><b>🗂️ Layout presets</b> save where everything sits now, and you can keep up to eight layouts. Apply one to swap the whole arrangement back in one tap, or delete it. <b>📦 Full furniture list</b> opens the inventory if you want to buy or review pieces, and <b>Done decorating</b> returns to the room dock.</p>
    <h3>Tint, Stage and shared houses</h3>
    <p>Room tint is per shared house. Open a piece's options while decorating and use the colour wheel or one of the eight swatches. <b>Stage</b> runs from 0 to 100 and sets how strongly that colour reads: 0 leaves the room almost untouched, 100 is the full wash. The slider previews live and saves when you let go. <b>Clear</b> removes the tint and disables Stage until a new colour is picked.</p>
    <p>A solo room has no tint controls; send a second sprite home and share the house to unlock them. The tint follows the house into its hangout and one-on-one visits, so the room reads the same everywhere.</p>
    <div class="wiki-footnote">Home and Decor mode are cosmetic. Furniture spots, tints and presets never change XP, bond, rarity, or a sprite's species.</div>`;
}

/* Quests, enemies, bosses, loot and achievements, printed from the same tables
   the quest engine and the reward tiers read. */
function adventureWikiBody() {
  const quests = typeof SPRITE_HOLLOW_QUESTS !== 'undefined' ? SPRITE_HOLLOW_QUESTS : [];
  const enemies = typeof SPRITE_HOLLOW_ENEMIES !== 'undefined' ? SPRITE_HOLLOW_ENEMIES : [];
  const bosses = typeof SPRITE_HOLLOW_BOSSES !== 'undefined' ? SPRITE_HOLLOW_BOSSES : [];
  const loot = typeof SPRITE_HOLLOW_LOOT_TIERS !== 'undefined' ? SPRITE_HOLLOW_LOOT_TIERS : [];
  const achievements = typeof SPRITE_HOLLOW_ACHIEVEMENTS !== 'undefined' ? SPRITE_HOLLOW_ACHIEVEMENTS : [];
  const sceneName = (key) => (typeof SCENES !== 'undefined' && SCENES[key] ? `${SCENES[key].emoji} ${esc(SCENES[key].name)}` : esc(key));
  const chip = (text) => `<span class="chip">${esc(text)}</span>`;
  const tiers = ['Beginner', 'Explorer', 'Guardian'];
  const questBlocks = tiers.map((tier) => {
    const rows = quests.filter((quest) => quest.tier === tier);
    if (!rows.length) return '';
    return `<h3>${tier} quests · ${rows.length}</h3>` + rows.map((quest) => `<div class="wiki-quest"><p><b>${quest.icon} ${esc(quest.title)}</b> — ${esc(quest.giver)} · ${sceneName(quest.region)}</p>
      <p class="tiny muted">${quest.objectives.map((objective) => esc(objective)).join(' · ')}</p>
      <p>${quest.rewards.map(chip).join('')}</p></div>`).join('');
  }).join('');
  const enemyRows = enemies.map((enemy) => `<div class="wiki-quest"><p><b>${enemy.icon} ${esc(enemy.name)}</b> · ${sceneName(enemy.region)}</p>
    <p class="tiny muted">${esc(enemy.about)}</p>
    <p class="tiny muted">Abilities: ${enemy.abilities.map((ability) => esc(ability)).join(' · ')}</p>
    <p>${enemy.drops.map(chip).join('')}</p></div>`).join('');
  const bossRows = bosses.map((boss) => boss.final
    ? `<div class="wiki-quest"><p><b>${boss.icon} ${esc(boss.name)}</b> · ${sceneName(boss.region)} · final raid</p>
        <p class="tiny muted">${esc(boss.about)}</p>
        <p class="tiny muted">Phases: ${boss.phases.map((phase) => esc(phase)).join(' · ')}</p>
        <p class="tiny muted">${esc(boss.battle)}</p>
        <p>${boss.rewards.map(chip).join('')}</p></div>`
    : `<div class="wiki-quest"><p><b>${boss.icon} ${esc(boss.name)}</b> · ${esc(boss.location)} · ${sceneName(boss.region)}</p>
        <p>${boss.rewards.map(chip).join('')}</p></div>`).join('');
  const lootRows = loot.map((tier) => `<div class="wiki-quest"><p><b>${tier.icon} ${esc(tier.name)} loot</b></p><p>${tier.items.map((item) => chip(item)).join('')}</p></div>`).join('');
  return `<p class="wiki-lede">Sprite Hollow runs on three kinds of adventure: <b>${quests.length} named quests</b> spread across the regions, <b>${enemies.length} corrupted enemies</b> that can be purified, and <b>${bosses.length} bosses</b> guarding the deepest places. Every region quest is live as a three-step chain on its region page.</p>
    <p>Enemies are not the point. A purified creature goes back to its biome, so a region's roster grows instead of thinning. Loot follows the seven rarity rungs, and achievements mark the long road to the Omnitype.</p>
    ${questBlocks}
    <h3>👾 Enemies · ${enemies.length}</h3>
    ${enemyRows}
    <h3>👑 Bosses · ${bosses.length}</h3>
    ${bossRows}
    <h3>📦 Loot tiers</h3>
    ${lootRows}
    <h3>🏆 Achievements · ${achievements.length}</h3>
    <p>${achievements.map((achievement) => `<span class="chip">${achievement.icon} ${esc(achievement.name)}</span>`).join('')}</p>
    <div class="wiki-footnote">Region quests advance one step at a time by travelling, playing and caring where the step asks. Boss and enemy tables are the canonical names, abilities and drops for the endgame arc.</div>`;
}

/* Every speaking voice, the traits and families that pick it, and the named cast
   of leaders and Hollow Eclipse enemies — printed from the live tables. */
function voicesWikiBody() {
  const voices = typeof window.PUFFLE_VOICE_TYPES !== 'undefined' ? window.PUFFLE_VOICE_TYPES : {};
  const traitMap = window.PUFFLE_VOICE_BY_TRAIT || {};
  const familyMap = window.PUFFLE_VOICE_FAMILIES || {};
  const cast = Array.isArray(window.SPRITE_HOLLOW_VOICES) ? window.SPRITE_HOLLOW_VOICES : [];
  /* Chatting with a puffle records its role voice, so the eight voices are a
     collection goal in their own right. */
  const heard = typeof state !== 'undefined' && state.stats && state.stats.voiceHeard && typeof state.stats.voiceHeard === 'object'
    ? state.stats.voiceHeard
    : {};
  const heardKeys = Object.keys(voices).filter((key) => heard[key]);
  const sceneName = (key) => (typeof SCENES !== 'undefined' && SCENES[key] ? `${SCENES[key].emoji} ${esc(SCENES[key].name)}` : esc(key));
  const voiceRows = Object.keys(voices).map((key) => {
    const voice = voices[key];
    const traits = Object.keys(traitMap).filter((trait) => traitMap[trait] === key);
    const families = Object.keys(familyMap).filter((family) => familyMap[family] === key);
    const says = (beat) => (voice.lines && voice.lines[beat] && voice.lines[beat][0]) || '';
    const heardMark = heard[key]
      ? ' <span style="color:var(--accent);font-weight:800">✓ heard</span>'
      : ' <span class="muted">not heard yet</span>';
    return `<div class="wiki-quest"><p><b>${voice.icon} ${esc(voice.name)}</b>${traits.length ? ` — traits: ${traits.map(esc).join(', ')}` : ''}${families.length ? ` · families: ${families.map(esc).join(', ')}` : ''}${heardMark}</p>
      <p class="tiny muted">Greets: “${esc(says('greet'))}”</p>
      <p class="tiny muted">On a quest: “${esc(says('quest'))}”</p></div>`;
  }).join('');
  const leaders = cast.filter((entry) => entry.leader).map((entry) => `<div class="wiki-quest"><p><b>${entry.icon} ${esc(entry.name)}</b> · ${sceneName(entry.region)}</p><p class="tiny muted">“${esc(entry.beats.greet)}”</p></div>`).join('');
  const enemies = cast.filter((entry) => entry.enemy).map((entry) => `<div class="wiki-quest"><p><b>${entry.icon} ${esc(entry.name)}</b> · ${esc(entry.role || 'Hollow Eclipse')} · ${sceneName(entry.region)}</p><p class="tiny muted">${esc(entry.about || '')}</p><p class="tiny muted">“${esc(entry.beats.encounter)}” → “${esc(entry.beats.defeated || '')}”</p></div>`).join('');
  return `<p class="wiki-lede">Every puffle speaks in one of <b>${Object.keys(voices).length} role voices</b>, chosen by its rolled traits or its family. The same voice answers in chat, on the idle tick, on a quest, and in a guardian bout — and the region leaders and Hollow Eclipse enemies speak on their own regions. Chat with a puffle to hear its voice: <b>${heardKeys.length} of ${Object.keys(voices).length}</b> have spoken so far.</p>
    <h3>🗣️ Voices · ${heardKeys.length} of ${Object.keys(voices).length} heard</h3>
    ${voiceRows}
    <h3>👑 Region leaders · ${cast.filter((entry) => entry.leader).length}</h3>
    ${leaders}
    <h3>🌑 Hollow Eclipse enemies · ${cast.filter((entry) => entry.enemy).length}</h3>
    ${enemies}
    <div class="wiki-footnote">Voices answer greetings, idle chatter, affection, agreement and quest questions in chat, and a puffle picks a conversation back up from the last thing you asked it. Once bond reaches Close Friend it starts saying how it feels about you, and every rung you cross is announced. Leaders greet you in their region and close their quest line; enemies speak on their region's quest card and in that region's guardian bout.</div>`;
}

if (typeof WIKI_GUIDES !== 'undefined') {
  WIKI_GUIDES.push(
    { id: 'gta', icon: '🚗', title: 'Grand Theft Auto districts', summary: 'Every GTA group, district home, gene, and named hybrid.', body: gtaWaveBody },
    { id: 'homes', icon: '🪟', title: 'Homes, Hollow & biomes', summary: 'How the at-home roster, the shared Hollow, and the biome windows work.', body: homesWikiBody },
    { id: 'homeview', icon: '🏡', title: 'Home View & Decor mode', summary: 'Walk into your room, move furniture in place, and tune a shared house tint and Stage.', body: homeViewWikiBody },
    { id: 'voices', icon: '🗣️', title: 'Voices & cast', summary: 'The eight role voices, what picks them, and every region leader and Hollow Eclipse enemy.', body: voicesWikiBody },
    { id: 'adventure', icon: '⚔️', title: 'Quests, enemies & rewards', summary: 'Every region quest, the corrupted enemies and bosses, loot tiers and achievements.', body: adventureWikiBody },
  );
}
