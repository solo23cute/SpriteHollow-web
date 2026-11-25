/* The Sprite Puffle Turtle collection: eight elemental lines, each with the full
   evolution ladder (hatchling -> shelled -> guardian), every rarity tier, and a
   mythic form, plus the two fusion guardians that combine all eight bloodlines.
   Pure data plus the wiki renderer, so the encyclopedia reads from the same
   rarity palette as the rest of the Hollow.

   The Dark and Light lines are also playable: each registers a species with a
   type egg, gene, Titan and habitats, while the other six stay field-guide
   entries in the encyclopedia. */

const SPRITE_PUFFLE_TURTLE_ROLES = ['hatchling', 'shelled', 'guardian'];

const SPRITE_PUFFLE_TURTLE_TIERS = [
  { id: 'common', slot: '0', note: 'Basic elemental shell · simple markings', magic: 'The shell keeps a single clean marking and a soft ambient glimmer.' },
  { id: 'rare', slot: '1', note: 'Glowing patterns · enhanced magic', magic: 'Elemental patterns light up along the shell and the fluff carries a faint trail.' },
  { id: 'epic', slot: '3', note: 'Floating crystals · radiant eyes', magic: 'Crystals orbit the shell, the aura brightens, and the eyes shine from within.' },
  { id: 'legendary', slot: '5', note: 'Ancient guardian form · elemental runes', magic: 'Runes circle the shell, the limbs carry guardian mass, and the aura settles into a crown of light.' },
];

const SPRITE_PUFFLE_TURTLES = [
  {
    id: 'nature', name: 'Nature', icon: '🌿', element: 'Nature',
    effect: 'Falling leaves', habitat: 'Mosslight Grove',
    palette: { primary: '#D6EFC2', secondary: '#7FB36A', shell: '#4F7A3F', glow: '#C9F0B8' },
    stages: ['Sproutlet', 'Mossback', 'Eldergrove Turtle'],
    lore: 'Moss cushions the shell, leaves unfurl along the rim, and emerald crystals push up between the plates. Eldergrove guardians plant themselves at the edge of a grove and simply refuse to let it come to harm.',
    mythic: { name: 'Cosmic Forest Guardian', shell: 'Galaxy tree-shell', note: 'A tree of stars grows out of the shell, its celestial vines trailing nebula light across the ground.' },
    shells: {
      common: { note: 'Plain moss shell · one leaf marking', magic: 'A smooth mossy shell keeps a single curled leaf pressed into the plate, with a soft green glimmer along the rim.' },
      rare: { note: 'Sprouting vines · glowing leaves', magic: 'Vines creep between the plates and the leaf markings glow, dropping a faint trail of pollen wherever the turtle walks.' },
      epic: { note: 'Blooming crystals · floating seeds', magic: 'Emerald buds orbit the shell and the moss brightens to spring green, with tiny flowers opening and closing as it breathes.' },
      legendary: { note: 'Eldergrove shell · root runes', magic: 'Bark plates lock into an ancient grove, root runes circle the rim, and a crown of leaf-light settles above the guardian.' },
    },
  },
  {
    id: 'fire', name: 'Fire', icon: '🔥', element: 'Fire',
    effect: 'Floating sparks', habitat: 'Emberpeak',
    palette: { primary: '#FFD9B8', secondary: '#FF7A3C', shell: '#8C2E14', glow: '#FFE58A' },
    stages: ['Emberpuff', 'Blazeback', 'Infernogrove Turtle'],
    lore: 'Volcanic plates crack open into molten seams, ember-red fluff curls off the neck, and sparks drift upward whenever the turtle breathes. The shell stays warm for days after a nap in the sun.',
    mythic: { name: 'Solar Guardian', shell: 'Miniature sun shell', note: 'A small sun burns at the centre of the shell, ringed by stellar flames that never quite touch the ground.' },
    shells: {
      common: { note: 'Warm ember shell · one scorch mark', magic: 'The shell stays comfortably warm and carries a single dark scorch mark, with sparks puffing out at each breath.' },
      rare: { note: 'Cracked lava seams · glowing fluff', magic: 'Molten seams split the plates in a slow glow while ember-red fluff curls off the neck and trails sparks behind it.' },
      epic: { note: 'Orbiting cinders · burning eyes', magic: 'Cinders orbit the shell in a lazy ring, the aura climbs to a furnace glow, and the eyes burn like coals from inside.' },
      legendary: { note: 'Infernogrove shell · flame runes', magic: 'The plates rise into volcanic ridges, flame runes ring the shell, and a crown of firelight hangs above the guardian without scorching the ground.' },
    },
  },
  {
    id: 'ice', name: 'Ice', icon: '❄️', element: 'Ice',
    effect: 'Frozen motes', habitat: 'Frostmere Shelf',
    palette: { primary: '#E8F8FF', secondary: '#8FD9FF', shell: '#3F7FB8', glow: '#E8FBFF' },
    stages: ['Snowpuff', 'Frostback', 'Glaciergrove Turtle'],
    lore: 'Frost crystals knit the shell into a single pane of blue ice, snowflakes hang in the air around it, and frozen gems catch the winter light. It walks slowly because the ground is always a little slippery beneath it.',
    mythic: { name: 'Aurora Guardian', shell: 'Frozen star shell', note: 'Frozen stars turn inside the shell while ribbons of northern light spill from the rim and drift upward.' },
    shells: {
      common: { note: 'Frosted shell · one snowflake', magic: 'A pale rime coats the shell and a single snowflake marking sits at its centre, with cold motes drifting off the rim.' },
      rare: { note: 'Ice pane shell · drifting flakes', magic: 'Frost crystals knit the plates into one blue pane, snowflakes hang in the air, and the fluff sparkles with frozen dust.' },
      epic: { note: 'Orbiting shards · glacier eyes', magic: 'Shards of blue ice circle the shell, the aura sharpens to a winter glare, and the eyes shine like light moving through a glacier.' },
      legendary: { note: 'Glaciergrove shell · frost runes', magic: 'The shell thickens into a glacier ridge, frost runes circle the rim, and a crown of icicles hangs above the guardian without melting.' },
    },
  },
  {
    id: 'water', name: 'Water', icon: '💧', element: 'Water',
    effect: 'Bubble rings', habitat: 'Tideglass Reef',
    palette: { primary: '#C9F2FF', secondary: '#3FAED0', shell: '#1F5F7A', glow: '#D8F8FF' },
    stages: ['Ripplepuff', 'Tideback', 'Oceancrest Turtle'],
    lore: 'Coral grows along a shell of layered turquoise and sapphire, pearls sit in the seams, and droplets orbit the flippers without falling. Oceancrest guardians can hold a whole tide pool in the hollow of their backs.',
    mythic: { name: 'Abyssal Tide Guardian', shell: 'Ocean galaxy shell', note: 'A glowing ocean swirls inside the shell, complete with celestial waves and tiny constellations of plankton light.' },
    shells: {
      common: { note: 'Tidewashed shell · one ripple', magic: 'A smooth blue-green shell holds a single ripple marking, and droplets bead along the rim without ever falling.' },
      rare: { note: 'Coral seams · orbiting droplets', magic: 'Coral threads the seams between plates, pearl glints show at the cracks, and droplets orbit the flippers in a slow ring.' },
      epic: { note: 'Tideglass shell · floating pearls', magic: 'The shell turns to layered turquoise glass, pearls float free of the seams, and the aura ripples like a pool lit from below.' },
      legendary: { note: 'Oceancrest shell · current runes', magic: 'Ocean ridges rise across the shell, current runes circle the body, and a crown of sea-light arcs above the guardian like a breaking wave.' },
    },
  },
  {
    id: 'earth', name: 'Earth', icon: '🪨', element: 'Earth',
    effect: 'Floating stones', habitat: 'Titanroot Basin',
    palette: { primary: '#E8D6BE', secondary: '#A9855C', shell: '#5E4A32', glow: '#C9E8B8' },
    stages: ['Pebblepuff', 'Stoneback', 'Titanroot Turtle'],
    lore: 'Roots thread through a shell of stacked rock, emerald minerals glint in the cracks, and small stones hover in a slow ring. Titanroot guardians carry the patience of a mountain and the temperament of a very old garden.',
    mythic: { name: 'Worldroot Guardian', shell: 'Crystal continent shell', note: 'Miniature mountains and crystal continents ride across the shell, with rivers of light running between them.' },
    shells: {
      common: { note: 'Stone plate shell · one pebble ring', magic: 'The shell is stacked grey stone with a single ring of pebbles pressed into the top, and dust drifts off it in slow puffs.' },
      rare: { note: 'Rooted seams · mineral glints', magic: 'Roots thread the cracks and emerald minerals catch the light, while a few small stones hover just above the shell.' },
      epic: { note: 'Floating boulders · crystal veins', magic: 'Crystal veins split the plates, boulders orbit the shell in a heavy ring, and the aura settles like dust in a sunbeam.' },
      legendary: { note: 'Titanroot shell · mountain runes', magic: 'Mountain ridges stack into a titan shell, runes of old stone circle the rim, and a crown of standing stones rises above the guardian.' },
    },
  },
  {
    id: 'lightning', name: 'Lightning', icon: '⚡', element: 'Lightning',
    effect: 'Energy arcs', habitat: 'Thunderpeak',
    palette: { primary: '#FFF4C4', secondary: '#FFC94D', shell: '#4C5470', glow: '#8FE8FF' },
    stages: ['Sparkpuff', 'Thunderback', 'Stormcrest Turtle'],
    lore: 'Electric crystals stand up from the shell, lightning markings crawl across the plates, and energy arcs jump between the flippers. A storm cloud gathers overhead wherever a Stormcrest settles, whether or not anyone asked for rain.',
    mythic: { name: 'Tempest Guardian', shell: 'Storm-core shell', note: 'A storm core spins inside the shell, plasma wings unfold from the rim, and celestial lightning rings circle overhead.' },
    shells: {
      common: { note: 'Static shell · one bolt mark', magic: 'A slate shell holds a single white bolt marking, and static lifts the fluff into tiny sparks whenever the turtle moves.' },
      rare: { note: 'Charged seams · arcing sparks', magic: 'Energy crawls along the seams as thin arcs, the markings flash with each breath, and the fluff stands on end.' },
      epic: { note: 'Orbiting coils · storm eyes', magic: 'Coils of plasma circle the shell, the aura crackles into a storm glare, and the eyes flash like lightning seen through cloud.' },
      legendary: { note: 'Stormcrest shell · thunder runes', magic: 'Lightning ridges crown the shell, thunder runes circle the body, and a storm ring spins overhead wherever the guardian settles.' },
    },
  },
  {
    id: 'dark', name: 'Dark', icon: '🌑', element: 'Dark',
    effect: 'Dark wisps', habitat: 'Eclipse Hollow',
    palette: { primary: '#D9C8F0', secondary: '#6B4A8C', shell: '#211A33', glow: '#B18CFF' },
    stages: ['Shadepuff', 'Nightback', 'Eclipsecrest Turtle'],
    lore: 'Shadow crystals darken the shell until it drinks the light, deep violet fluff fades to black at the tips, and crimson eyes catch every glow in the hollow. Dark wisps circle the flippers while moonlit runes drift across the plates like slow constellations.',
    mythic: { name: 'Void Eclipse Guardian', shell: 'Black-hole shell', note: 'A black hole turns at the centre of the shell, shadow moons drifting around it through a haze of purple nebula energy.' },
    shells: {
      common: { note: 'Dusk shell · one shadow marking', magic: 'A deep violet shell keeps one faint shadow marking, and wisps of dark fluff curl off the rim without drifting away.' },
      rare: { note: 'Veiled plates · violet wisps', magic: 'Shadow veils the plates until they drink the light, violet wisps circle the flippers, and crimson eyes catch every nearby glow.' },
      epic: { note: 'Orbiting shards · eclipse eyes', magic: 'Shards of shadow orbit the shell, the aura dims to a purple haze, and the eyes burn like a small eclipse held in the fluff.' },
      legendary: { note: 'Eclipsecrest shell · moon runes', magic: 'The shell becomes a ringed eclipse, moonlit runes drift across the plates, and a crown of black starlight hangs above the guardian.' },
    },
  },
  {
    id: 'light', name: 'Light', icon: '☀️', element: 'Light',
    effect: 'Radiant feathers', habitat: 'Dawnreach',
    palette: { primary: '#FFF6D8', secondary: '#FFD166', shell: '#C9A23A', glow: '#FFF2B8' },
    stages: ['Lumipuff', 'Radiantback', 'Celestcrest Turtle'],
    lore: 'Golden crystals set into a shell of warm white, celestial patterns tracing every plate, and feathers of light drifting loose around it. A soft halo gathers above the shell whenever a Celestcrest is content, and it is almost always content.',
    mythic: { name: 'Seraphic Dawn Guardian', shell: 'Radiant star-shell', note: 'Angelic light wings fold out of the shell around a radiant star, miniature suns orbiting through a divine golden aura.' },
    shells: {
      common: { note: 'Sunwashed shell · one ray marking', magic: 'A warm white shell holds a single ray marking, and a soft glow gathers along the rim whenever the turtle is content.' },
      rare: { note: 'Golden seams · drifting feathers', magic: 'Gold threads the seams, celestial patterns trace every plate, and feathers of light drift loose around the shell.' },
      epic: { note: 'Orbiting motes · radiant eyes', magic: 'Golden motes orbit the shell, the aura brightens to a dawn glare, and the eyes shine like small suns set in gold.' },
      legendary: { note: 'Celestcrest shell · dawn runes', magic: 'The shell hardens into a radiant star-plate, dawn runes circle the rim, and a halo crown settles above the guardian.' },
    },
  },
];

const SPRITE_PUFFLE_TURTLE_FUSIONS = [
  {
    id: 'eternalharmony', icon: '👑', tier: 'Legendary fusion',
    name: 'Eternal Harmony Guardian',
    shell: 'World-shell · eight elemental regions',
    note: 'Nature forests, fire lava, ice glaciers, water reefs, earth mountains, lightning storms, dark eclipse and light halos blend seamlessly across one enormous shell. A glowing Elemental Core Crystal burns at its centre, and elemental rings for all eight bloodlines orbit the body.',
  },
  {
    id: 'omniverse', icon: '🌈', tier: 'Mythic ascended',
    name: 'Omniverse Guardian',
    shell: 'Elemental-world shell',
    note: 'The form beyond mythic: whole elemental worlds ride the shell — miniature suns, galaxies, oceans, forests, mountains, storms, eclipses and auroras — with rainbow starlight fur and floating elemental crowns.',
  },
];

const SPRITE_PUFFLE_TURTLE_TIER_FORMS = SPRITE_PUFFLE_TURTLES.length * SPRITE_PUFFLE_TURTLE_TIERS.length * SPRITE_PUFFLE_TURTLE_ROLES.length;
const SPRITE_PUFFLE_TURTLE_MYTHICS = SPRITE_PUFFLE_TURTLES.filter((line) => line.mythic).length;
const SPRITE_PUFFLE_TURTLE_FUSION_COUNT = SPRITE_PUFFLE_TURTLE_FUSIONS.length;
const SPRITE_PUFFLE_TURTLE_TOTAL = SPRITE_PUFFLE_TURTLE_TIER_FORMS + SPRITE_PUFFLE_TURTLE_MYTHICS + SPRITE_PUFFLE_TURTLE_FUSION_COUNT;

function sptEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sptTierStyle(tier) {
  const styles = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES : {};
  return styles[tier.id] || { name: tier.id, icon: '⚪', color: '#C9CDD2', glow: 'rgba(201,205,210,.5)' };
}

/* Turtle portraits are the same round, furry puffle body the game draws, with a
   shell plate over the belly, flippers at the sides and tier regalia on top; the
   turtle reads from the shell, not from a different creature shape. */
const SPRITE_PUFFLE_TURTLE_FALLBACK_PALETTE = { primary: '#DCE9F7', secondary: '#8FB6D9', shell: '#4F7FA8', glow: '#BFE3FF' };

function sptPuffleArtSVG(line, tier, label) {
  const palette = line.palette || SPRITE_PUFFLE_TURTLE_FALLBACK_PALETTE;
  const slot = Number(tier.slot) || 0;
  const sprite = {
    id: `spt-${line.id}-${tier.id}`,
    element: 'bloom',
    palette: 'custom',
    custom: {
      body: palette.primary,
      light: mix(palette.primary, '#ffffff', 0.45),
      deep: palette.shell,
      accent: palette.glow,
      belly: mix(palette.primary, palette.secondary, 0.28),
    },
    breed: 'basic_sprite',
    stage: slot >= 4 ? 'elder' : slot >= 2 ? 'sprite' : 'baby',
    /* Every turtle line is furry, so the fur ring is part of the silhouette. */
    fur: slot >= 3 ? 'shaggy' : 'tufty',
    name: label,
  };
  const flippers = '<ellipse cx="13" cy="45" rx="6" ry="9" transform="rotate(-18 13 45)"/><ellipse cx="51" cy="45" rx="6" ry="9" transform="rotate(18 51 45)"/>';
  const plate = mix(palette.shell, palette.primary, 0.32);
  const seams = '<g fill="none" stroke="' + palette.shell + '" stroke-width=".65" opacity=".5"><path d="M32 43v14"/><path d="M24 46l-1.2 8"/><path d="M40 46l1.2 8"/><path d="M21 50h22"/></g>';
  const crystals = slot >= 2 ? `<path d="M21 49l2.6-5 2.6 5-2.6 3Z" fill="${palette.glow}" stroke="${palette.shell}" stroke-width=".6"/><path d="M37.8 49l2.6-5 2.6 5-2.6 3Z" fill="${palette.glow}" stroke="${palette.shell}" stroke-width=".6"/>` : '';
  const runes = slot >= 3 ? `<g fill="${palette.glow}" opacity=".9"><circle cx="24" cy="55" r="1.2"/><circle cx="32" cy="56.8" r="1.2"/><circle cx="40" cy="55" r="1.2"/></g>` : '';
  const crown = slot >= 4 ? `<path d="M26 14l2.4 4.6 3.6-6 3.6 6 2.4-4.6 1.2 7H24.8Z" fill="${mix(palette.glow, '#ffffff', 0.3)}" stroke="${palette.shell}" stroke-width=".7" stroke-linejoin="round"/>` : '';
  const flippersGroup = `<g transform="translate(60 61) scale(1.95) translate(-32 -37)" fill="${palette.primary}" stroke="${palette.shell}" stroke-width=".7" stroke-linejoin="round">${flippers}</g>`;
  const shellGroup = `<g transform="translate(60 61) scale(1.95) translate(-32 -37)">
          ${crown}${crystals}
          <ellipse cx="32" cy="50" rx="11" ry="7.6" fill="${palette.shell}" stroke="${mix(palette.shell, '#000000', 0.35)}" stroke-width=".8"/>
          <ellipse cx="32" cy="49.6" rx="7.6" ry="4.9" fill="${plate}"/>
          ${seams}
          <circle cx="32" cy="49.6" r="1.9" fill="${palette.glow}"/>${runes}
        </g>`;
  return pufflePortraitMarkup(sprite, flippersGroup, shellGroup);
}

function sptPortrait(line, tier, label) {
  return `<span class="ap-portrait spt-portrait" role="img" aria-label="${sptEsc(label)} portrait" data-spt-art="puffle" data-spt-line="${line.id}">${sptPuffleArtSVG(line, tier, label)}</span>`;
}

function wikiSpritePuffleTurtlesMarkup() {
  const tiers = typeof SPRITE_PUFFLE_TURTLE_TIERS !== 'undefined' ? SPRITE_PUFFLE_TURTLE_TIERS : [];
  const lines = typeof SPRITE_PUFFLE_TURTLES !== 'undefined' ? SPRITE_PUFFLE_TURTLES : [];
  const fusions = typeof SPRITE_PUFFLE_TURTLE_FUSIONS !== 'undefined' ? SPRITE_PUFFLE_TURTLE_FUSIONS : [];
  const total = typeof SPRITE_PUFFLE_TURTLE_TOTAL !== 'undefined' ? SPRITE_PUFFLE_TURTLE_TOTAL : 0;
  const forms = typeof SPRITE_PUFFLE_TURTLE_TIER_FORMS !== 'undefined' ? SPRITE_PUFFLE_TURTLE_TIER_FORMS : 0;
  const mythicCount = typeof SPRITE_PUFFLE_TURTLE_MYTHICS !== 'undefined' ? SPRITE_PUFFLE_TURTLE_MYTHICS : lines.length;
  const legend = tiers.map((tier) => {
    const style = sptTierStyle(tier);
    return `<span class="ap-legend" style="--ap-aura:${style.color}">${style.icon} ${sptEsc(style.name)} · ${lines.length} lines</span>`;
  }).join('');
  const stageRow = (line) => `<ol class="ap-line">${line.stages.map((name, index) => `<li class="ap-stage${index === line.stages.length - 1 ? ' is-guardian' : ''}"><span class="ap-orb" aria-hidden="true">${index === line.stages.length - 1 ? '👑' : index === 1 ? '✦' : '•'}</span><span>${sptEsc(name)} <span class="tiny muted">${sptEsc(SPRITE_PUFFLE_TURTLE_ROLES[index] || '')}</span></span></li>`).join('')}</ol>`;
  const shellCopy = (line, tier) => (line.shells && line.shells[tier.id]) || tier;
  const sections = lines.map((line) => {
    const hatch = typeof SPRITE_PUFFLE_TURTLE_SPECIES !== 'undefined' ? SPRITE_PUFFLE_TURTLE_SPECIES.find((def) => def.line === line.id) : null;
    const cards = tiers.map((tier) => {
      const style = sptTierStyle(tier);
      const shell = shellCopy(line, tier);
      return `<article class="ap-card" data-spt-line="${line.id}" data-spt-tier="${tier.id}" style="--ap-aura:${style.color};--ap-glow:${style.glow || style.color}">
        <div class="ap-card-head">${sptPortrait(line, tier, `${line.name} ${style.name} ${line.stages[2]}`)}<span class="ap-family"><b>${line.icon} ${sptEsc(line.name)} · ${sptEsc(style.name)}</b><small>${sptEsc(shell.note)}</small></span></div>
        ${stageRow(line)}
        <p class="ap-note">${sptEsc(shell.magic)}</p>
        <span class="ap-effect">${sptEsc(line.effect)}</span>
      </article>`;
    }).join('');
    return `<section class="ap-tier spt-element" data-spt-element="${line.id}" style="--ap-aura:${line.palette.secondary};--ap-glow:${line.palette.glow}">
      <div class="ap-tier-head"><h3>${line.icon} ${sptEsc(line.name)} Turtles <span class="spt-swatches" aria-hidden="true"><i style="--spt-c:${line.palette.primary}"></i><i style="--spt-c:${line.palette.secondary}"></i><i style="--spt-c:${line.palette.shell}"></i><i style="--spt-c:${line.palette.glow}"></i></span></h3><span>4 tiers · ${tiers.length * line.stages.length} forms${hatch ? ' · hatchable' : ''}</span></div>
      <p class="ap-note">${sptEsc(line.lore)}</p>
      ${hatch ? `<div class="family-chip-row"><span class="chip">🥚 ${hatch.price} coin type egg</span><span class="chip">🏷️ ${sptEsc(hatch.name)}</span><span class="chip">🧬 ${sptEsc(hatch.gene.name)}</span><span class="chip">🏛️ ${sptEsc(hatch.titan)}</span><span class="chip">🗺️ ${sptEsc(hatch.habitatLabel)}</span></div>` : ''}
      <div class="ap-grid">${cards}</div>
    </section>`;
  }).join('');
  const mythics = lines.filter((line) => line.mythic).map((line) => `<article class="ap-card spt-mythic-card" data-spt-mythic="${line.id}" style="--ap-aura:#FFD166;--ap-glow:rgba(255,209,102,.45)">
      <div class="ap-card-head">${sptPortrait(line, { slot: '5' }, `${line.mythic.name}`)}<span class="ap-family"><b>${line.icon} ${sptEsc(line.mythic.name)}</b><small>Mythic ${sptEsc(line.name)} · ${sptEsc(line.mythic.shell)}</small></span></div>
      ${stageRow(line)}
      <p class="ap-note">${sptEsc(line.mythic.note)}</p>
      <span class="ap-effect">Mythic form</span>
    </article>`).join('');
  const fusionCards = fusions.map((fusion, index) => `<article class="ap-card spt-fusion-card" data-spt-fusion="${fusion.id}" style="--ap-aura:${index ? '#8FE8FF' : '#FFD166'};--ap-glow:${index ? 'rgba(143,232,255,.45)' : 'rgba(255,209,102,.45)'}">
      <div class="ap-card-head">${sptPortrait(fusion, { slot: '5' }, fusion.name)}<span class="ap-family"><b>${fusion.icon} ${sptEsc(fusion.name)}</b><small>${sptEsc(fusion.tier)} · ${sptEsc(fusion.shell)}</small></span></div>
      <div class="family-chip-row">${lines.map((line) => `<span class="chip">${line.icon} ${sptEsc(line.name)}</span>`).join('')}</div>
      ${fusion.id === 'eternalharmony' ? `<div class="family-chip-row"><span class="chip">🔐 Secret · collect all ${lines.length} turtle lines</span><span class="chip">🧬 Worldshell</span><span class="chip">🏛️ Worldshell Titan</span></div>` : ''}
      <p class="ap-note">${sptEsc(fusion.note)}</p>
      <span class="ap-effect">${sptEsc(fusion.tier)}</span>
    </article>`).join('');
  return `<p class="wiki-lede">The <b>Sprite Puffle Turtle</b> collection is one species wearing <b>${lines.length} elemental shells</b>. Every line is the same round, furry puffle body the game draws, with a shell plate, flippers and elemental regalia added, so the eight portraits read as puffles wearing shells rather than as a different creature in a different hue.</p>
    <p>Each element runs a three-stage evolution (<b>hatchling → shelled → guardian</b>) through all four tiers, for <b>${forms} tier forms</b>, plus a <b>mythic form</b> per element (<b>${mythicCount}</b>) and <b>${fusions.length} fusion guardians</b> that blend every bloodline: <b>${total} creature entries</b> in one lineup.</p>
    <p><b>Dark</b> and <b>Light</b> are real species as well as catalogue lines: their type eggs hatch a <b>Shadepuff Turtle</b> or <b>Lumipuff Turtle</b>, each with its own gene, Titan and habitats, and both grow through the normal life stages. The other six lines stay field-guide entries.</p>
    <div class="ap-legend-row">${legend}</div>
    <p class="tiny muted">${lines.length} elements · ${forms} tier forms · ${mythicCount} mythic forms · ${fusions.length} fusion forms · grouped by element and rarity tier</p>
    ${sections}
    <section class="ap-tier spt-mythic" style="--ap-aura:#FFD166;--ap-glow:rgba(255,209,102,.42)">
      <div class="ap-tier-head"><h3>🌌 Mythic forms · ${mythicCount}</h3><span>one per element · cosmic shells</span></div>
      <p class="ap-note">The top of every line leaves the hollow behind: galaxy tree-shells, miniature suns, frozen stars, ocean galaxies, crystal continents, storm cores, a black-hole eclipse and a radiant star-shell, each wearing its own elemental kit and guardian frame.</p>
      <div class="ap-grid">${mythics}</div>
    </section>
    <section class="ap-tier spt-fusion" style="--ap-aura:#FFD166;--ap-glow:rgba(255,209,102,.42)">
      <div class="ap-tier-head"><h3>👑 Fusion guardians · ${fusions.length}</h3><span>all ${lines.length} bloodlines · legendary &amp; ascended</span></div>
      <p class="ap-note">The Eternal Harmony Guardian is the legendary fusion of all ${lines.length} elemental bloodlines: one enormous world-shell split into eight blended regions around a glowing Elemental Core Crystal, with an elemental ring for each power orbiting its body. It is obtainable, too: raise every one of the ${lines.length} lines and the Secret Vault opens it as a collection-reward exotic. Beyond it, the Omniverse Guardian is the mythic ascended form, carrying whole elemental worlds — suns, galaxies, oceans, forests, mountains, storms, eclipses and auroras — on a single cosmic shell.</p>
      <div class="ap-grid">${fusionCards}</div>
    </section>
    ${typeof eternalHarmonyCardMarkup === 'function' ? eternalHarmonyCardMarkup() : ''}
    <h3>How the tiers read</h3>
    <p><b>Common</b> keeps a basic elemental shell with simple markings. <b>Rare</b> adds glowing patterns and a stronger magic trail. <b>Epic</b> floats crystals around the shell, brightens the aura and lights the eyes. <b>Legendary</b> is the ancient guardian: elemental runes, majestic shell structures and a full crown of light. Each line carries its own shell text at every tier, so a Common Water shell and a Common Fire shell read nothing alike, and the four steps inside one element build on each other. Every tier is a complete <b>${lines.length * 3}-creature</b> row of the same three stages, so the whole collection reads as one species rather than ${total} separate mascots.</p>
    <p class="wiki-footnote">Element, stage and mythic names as catalogued above · shells painted onto the game's round puffle body · Dark and Light hatch from type eggs · no imported creature art</p>`;
}

/* Dark and Light are playable: each hatches from a type egg as its first form,
   then grows through the normal life stages with its own gene, Titan and
   habitats. The other six lines remain encyclopedia-only. */
const SPRITE_PUFFLE_TURTLE_SPECIES = [
  {
    key: 'sp_turtle_dark', line: 'dark', name: 'Shadepuff Turtle', short: 'Shadepuff',
    rarity: 'legendary', rarityLabel: 'Legendary', price: 175,
    puffleElement: 'Dark', likes: 'Moon Morsel', titan: 'Eclipse Sovereign Turtle',
    habitats: ['night', 'dream'], habitatLabel: 'Moon Hollow · Dream Conservatory',
    greeting: 'The dark is warmer than it looks. Sit with me a while.',
    gene: { name: 'Eclipse Veil', icon: '🌑', desc: 'Night games pay +6 coins and needs fade 10% slower.', effect: { nightCoins: 6, needSlow: 0.9 } },
  },
  {
    key: 'sp_turtle_light', line: 'light', name: 'Lumipuff Turtle', short: 'Lumipuff',
    rarity: 'legendary', rarityLabel: 'Legendary', price: 175,
    puffleElement: 'Light', likes: 'Sun Drop', titan: 'Dawn Sovereign Turtle',
    habitats: ['aurora', 'dream'], habitatLabel: 'Aurora Ridge · Dream Conservatory',
    greeting: 'I brought the morning with me. It is yours if you want it.',
    gene: { name: 'Dawnmantle', icon: '☀️', desc: 'Day games pay +6 coins and pets build +15% bond.', effect: { dayCoins: 6, petBond: 1.15 } },
  },
  {
    key: 'sp_turtle_nature', line: 'nature', name: 'Sproutlet Turtle', short: 'Sproutlet',
    rarity: 'rare', rarityLabel: 'Rare', price: 130,
    puffleElement: 'Nature', likes: 'Moon Berry', titan: 'Eldergrove Sovereign Turtle',
    habitats: ['grove', 'dream'], habitatLabel: 'Sunny Grove · Dream Conservatory',
    greeting: 'Everything here is growing. Including me, slowly.',
    gene: { name: 'Groveback', icon: '🌿', desc: 'Snacks give +25% XP and joy fades 10% slower.', effect: { snackXp: 1.25, joyMod: 0.9 } },
  },
  {
    key: 'sp_turtle_fire', line: 'fire', name: 'Emberpuff Turtle', short: 'Emberpuff',
    rarity: 'epic', rarityLabel: 'Epic', price: 145,
    puffleElement: 'Fire', likes: 'Ember Steak', titan: 'Infernogrove Sovereign Turtle',
    habitats: ['ember', 'savanna'], habitatLabel: 'Ember Forge · Golden Savanna',
    greeting: 'The shell is warm. That is not a warning, it is an invitation.',
    gene: { name: 'Ember Shell', icon: '🔥', desc: 'Games pay +4 coins and hunger fades 10% slower.', effect: { gameCoins: 4, hungerDecay: 0.9 } },
  },
  {
    key: 'sp_turtle_ice', line: 'ice', name: 'Snowpuff Turtle', short: 'Snowpuff',
    rarity: 'epic', rarityLabel: 'Epic', price: 145,
    puffleElement: 'Ice', likes: 'Warm Soup', titan: 'Glaciergrove Sovereign Turtle',
    habitats: ['aurora', 'crystal'], habitatLabel: 'Aurora Ridge · Crystal Caverns',
    greeting: 'Mind the flippers. The whole floor is a little slippery.',
    gene: { name: 'Glacier Plate', icon: '❄️', desc: 'All needs fade 10% slower and energy fades 15% slower.', effect: { decay: 0.9, energyDecay: 0.85 } },
  },
  {
    key: 'sp_turtle_water', line: 'water', name: 'Ripplepuff Turtle', short: 'Ripplepuff',
    rarity: 'rare', rarityLabel: 'Rare', price: 130,
    puffleElement: 'Water', likes: 'Coconut Water', titan: 'Oceancrest Sovereign Turtle',
    habitats: ['tide', 'reef'], habitatLabel: 'Tidepool · Coral Reef',
    greeting: 'Every tide comes back. So do I.',
    gene: { name: 'Tideglass', icon: '💧', desc: 'Gifts arrive 20% sooner and energy fades 12% slower.', effect: { giftSpeed: 1.2, energyDecay: 0.88 } },
  },
  {
    key: 'sp_turtle_earth', line: 'earth', name: 'Pebblepuff Turtle', short: 'Pebblepuff',
    rarity: 'rare', rarityLabel: 'Rare', price: 130,
    puffleElement: 'Earth', likes: 'Moon Cake', titan: 'Titanroot Sovereign Turtle',
    habitats: ['grove', 'crystal'], habitatLabel: 'Sunny Grove · Crystal Caverns',
    greeting: 'I have been sitting here for an hour. It was a good hour.',
    gene: { name: 'Titanroot', icon: '🪨', desc: 'Energy fades 18% slower and games pay +3 coins.', effect: { energyDecay: 0.82, gameCoins: 3 } },
  },
  {
    key: 'sp_turtle_lightning', line: 'lightning', name: 'Sparkpuff Turtle', short: 'Sparkpuff',
    rarity: 'epic', rarityLabel: 'Epic', price: 145,
    puffleElement: 'Lightning', likes: 'Star Pop', titan: 'Stormcrest Sovereign Turtle',
    habitats: ['neon', 'aurora'], habitatLabel: 'Neon Den · Aurora Ridge',
    greeting: 'Touch the shell. Actually, do not touch the shell.',
    gene: { name: 'Stormcrest', icon: '⚡', desc: 'Night games pay +4 coins and +15% XP.', effect: { nightCoins: 4, xp: 1.15 } },
  },
];

(function registerSpritePuffleTurtleSpecies() {
  if (typeof ELEMENTS === 'undefined' || !ELEMENTS) return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  SPRITE_PUFFLE_TURTLE_SPECIES.forEach((def) => {
    const line = SPRITE_PUFFLE_TURTLES.find((entry) => entry.id === def.line) || {};
    const palette = line.palette || { primary: '#E8E8F5', secondary: '#B9C6D4', shell: '#4A4A66', glow: '#FFFFFF' };
    if (!ELEMENTS[def.key]) {
      ELEMENTS[def.key] = {
        name: def.name,
        primary: palette.primary,
        light: palette.secondary,
        deep: palette.shell,
        accent: palette.glow,
        trait: `${line.icon || '🐢'} ${def.name} — ${String(line.effect || 'Turtle magic').toLowerCase()} on a shell that grows into ${line.stages ? line.stages[line.stages.length - 1] : def.titan}.`,
        blurb: line.lore || `${def.name} is the first form of the ${line.name || def.line} turtle line.`,
        greeting: def.greeting,
        likes: def.likes,
        puffleStyle: def.key,
        puffleElement: def.puffleElement,
        collectionTier: def.rarity,
        collectionTierName: def.rarityLabel,
        spritePuffleTurtle: def.line,
        turtleLine: def.line,
        rarity: def.rarity,
        eggRarity: def.rarity,
      };
    }
    if (table && !table[def.key]) {
      table[def.key] = {
        hidden: true,
        tier: def.rarity,
        name: def.name,
        theme: `${def.rarityLabel} ${line.name || def.line} Turtle — ${line.effect || 'elemental shell'}`,
        primary: palette.primary,
        secondary: palette.secondary,
        belly: palette.primary,
        ear: palette.secondary,
        iris: palette.glow,
        eyeShadow: palette.shell,
        leaf: palette.shell,
        leafGlow: palette.glow,
        pads: palette.secondary,
      };
    }
    if (typeof GENE_POWERS !== 'undefined') GENE_POWERS[def.key] = def.gene;
    if (typeof TITAN_NAMES !== 'undefined') TITAN_NAMES[def.key] = def.titan;
    if (typeof TYPE_EGG_BASE_PRICE !== 'undefined') TYPE_EGG_BASE_PRICE[def.key] = def.price;
    if (typeof TYPE_EGG_PRICE !== 'undefined') TYPE_EGG_PRICE[def.key] = typeof discountedEggPrice === 'function' ? discountedEggPrice(def.price) : def.price;
    if (typeof NAME_START !== 'undefined') NAME_START[def.key] = [def.short, 'Turtle', 'Shell', 'Puff'];
    if (typeof ELEMENT_KEYS !== 'undefined' && !ELEMENT_KEYS.includes(def.key)) ELEMENT_KEYS.push(def.key);
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(def.key)) TYPE_EGG_SPECIES.push(def.key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(def.key)) WILD_SPECIES.push(def.key);
    if (typeof SCENES !== 'undefined') {
      def.habitats.forEach((scene) => {
        if (SCENES[scene] && Array.isArray(SCENES[scene].species) && !SCENES[scene].species.includes(def.key)) SCENES[scene].species.push(def.key);
      });
    }
  });
  if (table && typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
  if (typeof window !== 'undefined') window.SPRITE_PUFFLE_TURTLE_SPECIES = SPRITE_PUFFLE_TURTLE_SPECIES;
})();
