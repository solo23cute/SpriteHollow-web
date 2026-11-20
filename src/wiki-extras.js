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

if (typeof WIKI_GUIDES !== 'undefined') {
  WIKI_GUIDES.push(
    { id: 'gta', icon: '🚗', title: 'Grand Theft Auto districts', summary: 'Every GTA group, district home, gene, and named hybrid.', body: gtaWaveBody },
    { id: 'homes', icon: '🪟', title: 'Homes, Hollow & biomes', summary: 'How the at-home roster, the shared Hollow, and the biome windows work.', body: homesWikiBody },
    { id: 'homeview', icon: '🏡', title: 'Home View & Decor mode', summary: 'Walk into your room, move furniture in place, and tune a shared house tint and Stage.', body: homeViewWikiBody },
  );
}
