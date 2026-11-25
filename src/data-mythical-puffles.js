/* The Mythical Sprite Puffle roster.

   Twelve themed wings of the bestiary, every creature written as a cute,
   perfectly round Sprite Puffle with its own habitat, three signature powers
   and a one-line design note. Pure data plus the Codex renderer below; auras
   are read from RARITY_TIER_STYLES so this page can never drift from the
   colours the cards, eggs and summons already paint. */

const MYTH_PUFFLE_TIERS = ['epic', 'legendary', 'mythic', 'secret', 'ultra_secret'];

const MYTH_PUFFLE_GROUPS = [
  {
    id: 'fae', name: 'Fairy & Fae', icon: '🧚', tier: 'epic',
    blurb: 'The smallest wings in the Hollow, and the ones the forest listens to first.',
    creatures: [
      { name: 'Pixie Puffle', habitat: 'Glowcap Forest',
        powers: ['Fairy Dust', 'Nature Blessing', 'Flight Boost'],
        design: 'Tiny emerald fluffy sphere with leaf wings and a glowing flower crown.' },
      { name: 'Fairy Queen Puffle', habitat: 'Crystal Blossom Palace',
        powers: ['Mass Healing', 'Enchantment Aura', 'Luck Blessing'],
        design: 'Large luxurious pink-white puffle with crystal butterfly wings and floral jewels.' },
      { name: 'Sylph Puffle', habitat: 'Sky Gardens',
        powers: ['Wind Control', 'Feather Dash', 'Air Shield'],
        design: 'Cloud-like fluffy body with floating feathers and glowing sky-blue eyes.' },
    ],
  },
  {
    id: 'divinebeast', name: 'Divine Beasts', icon: '🦄', tier: 'mythic',
    blurb: 'Horned, haloed and impossible to groom: the crowned beasts of the high places.',
    creatures: [
      { name: 'Unicorn Puffle', habitat: 'Rainbow Meadows',
        powers: ['Healing Magic', 'Purify Status Effects', 'Rainbow Beam'],
        design: 'Snow white fluffy ball with a rainbow mane and a glowing crystal horn.' },
      { name: 'Alicorn Puffle', habitat: 'Celestial Kingdom',
        powers: ['Divine Healing', 'Flight', 'Star Blessing'],
        design: 'Fluffy white-gold sphere with angelic wings and a crystal horn.' },
      { name: 'Kirin Puffle', habitat: 'Sacred Bamboo Peaks',
        powers: ['Divine Light', 'Thunder Hooves', 'Fortune Aura'],
        design: 'Golden fluffy puffle with glowing antlers and floating clouds.' },
      { name: 'Griffin Puffle', habitat: 'Golden Cliffs',
        powers: ['Sky Dive', 'Treasure Sense', 'Guardian Roar'],
        design: 'Round fluffy lion-eagle hybrid with oversized feathered ears.' },
    ],
  },
  {
    id: 'dragon', name: 'Dragons', icon: '🐉', tier: 'mythic',
    blurb: 'Six hoards of round little dragons, each one certain it is enormous.',
    creatures: [
      { name: 'Fire Dragon Puffle', habitat: 'Ember Volcano',
        powers: ['Flame Burst', 'Lava Shield', 'Heat Aura'],
        design: 'Round crimson fluffball with tiny dragon wings and glowing horns.' },
      { name: 'Ice Dragon Puffle', habitat: 'Frozen Caverns',
        powers: ['Snowstorm', 'Ice Armor', 'Freeze Touch'],
        design: 'Fluffy icy-blue sphere covered in crystal snowflakes.' },
      { name: 'Storm Dragon Puffle', habitat: 'Thunder Peaks',
        powers: ['Lightning Breath', 'Storm Summon', 'Static Charge'],
        design: 'Purple-blue fluffy puffle with lightning-shaped horns.' },
      { name: 'Crystal Dragon Puffle', habitat: 'Crystal Caves',
        powers: ['Gem Barrage', 'Crystal Wall', 'Light Refraction'],
        design: 'Transparent fluffy body with embedded glowing crystals.' },
      { name: 'Celestial Dragon Puffle', habitat: 'Star Temples',
        powers: ['Cosmic Beam', 'Starfall', 'Divine Blessing'],
        design: 'Galaxy-furred fluffy dragon sphere with constellation scales.' },
      { name: 'Void Dragon Puffle', habitat: 'Shadow Rift',
        powers: ['Dark Nova', 'Shadow Warp', 'Void Pulse'],
        design: 'Midnight-black fluffy puffle with glowing purple stars inside its fur.' },
    ],
  },
  {
    id: 'phoenix', name: 'Phoenixes', icon: '🔥', tier: 'mythic',
    blurb: 'Three birds that keep coming back, each one warmer than the last.',
    creatures: [
      { name: 'Phoenix Puffle', habitat: 'Ashfire Nest',
        powers: ['Rebirth', 'Flame Wave', 'Healing Fire'],
        design: 'Round fluffy firebird with a rainbow feather tail.' },
      { name: 'Solar Phoenix Puffle', habitat: 'Sunspire Sanctuary',
        powers: ['Solar Flare', 'Sunbeam Blast', 'Radiance Aura'],
        design: 'Golden-orange fluffy bird radiating sunlight.' },
      { name: 'Lunar Phoenix Puffle', habitat: 'Moonlit Valley',
        powers: ['Moonlight Healing', 'Eclipse Flare', 'Night Blessing'],
        design: 'Silver-blue fluffy bird with crescent wings.' },
    ],
  },
  {
    id: 'spiritbeast', name: 'Spirit Beasts', icon: '🦊', tier: 'mythic',
    blurb: 'Tail-heavy tricksters that are only ever exactly where they want to be seen.',
    creatures: [
      { name: 'Kitsune Puffle', habitat: 'Sakura Spirit Forest',
        powers: ['Illusions', 'Spirit Flame', 'Charm Magic'],
        design: 'Orange fluffy puffle with multiple tiny fluffy tails.' },
      { name: 'Nine-Tailed Kitsune Puffle', habitat: 'Celestial Sakura Shrine',
        powers: ['Divine Illusions', 'Foxfire Storm', 'Wisdom Aura'],
        design: 'Large fluffy fox sphere with nine glowing tails.' },
      { name: 'Spirit Wolf Puffle', habitat: 'Moonpine Forest',
        powers: ['Lunar Howl', 'Shadow Sprint', 'Pack Blessing'],
        design: 'Round silver-blue fluffball with wolf ears and moon markings.' },
    ],
  },
  {
    id: 'forestguardian', name: 'Forest Guardians', icon: '🌳', tier: 'epic',
    blurb: 'The grove keeps them, and they keep the grove.',
    creatures: [
      { name: 'Dryad Puffle', habitat: 'Ancient Groves',
        powers: ['Plant Growth', 'Nature Shield', 'Healing Roots'],
        design: 'Fluffy moss-covered puffle with flowers blooming from its fur.' },
      { name: 'Treant Puffle', habitat: 'Elderwood Forest',
        powers: ['Root Slam', 'Forest Fortress', 'Bark Armor'],
        design: 'Round wooden fluffy creature with glowing leaves.' },
      { name: 'Spirit Deer Puffle', habitat: 'Emerald Meadows',
        powers: ['Forest Blessing', 'Sprint', 'Nature Light'],
        design: 'Cute fluffy deer sphere with crystal antlers.' },
    ],
  },
  {
    id: 'oceanmyth', name: 'Ocean Myths', icon: '🌊', tier: 'mythic',
    blurb: 'Everything below the reef line, from the singing shallows to the trenches.',
    creatures: [
      { name: 'Mermaid Puffle', habitat: 'Coral Reef Lagoon',
        powers: ['Water Healing', 'Bubble Shield', 'Ocean Song'],
        design: 'Round aqua fluffball with a glittering fish tail.' },
      { name: 'Siren Puffle', habitat: 'Moonlit Sea Caves',
        powers: ['Charm Song', 'Water Current', 'Dream Melody'],
        design: 'Cute pastel ocean puffle with pearl ornaments.' },
      { name: 'Leviathan Puffle', habitat: 'Abyssal Ocean',
        powers: ['Tsunami', 'Abyssal Wave', 'Deep Sea Aura'],
        design: 'Massive fluffy sea serpent orb with glowing fins.' },
      { name: 'Kraken Puffle', habitat: 'Deep Trench',
        powers: ['Tentacle Storm', 'Whirlpool', 'Ocean Crush'],
        design: 'Round purple fluffball covered in tiny adorable tentacles.' },
    ],
  },
  {
    id: 'egyptian', name: 'Egyptian Myths', icon: '🏺', tier: 'legendary',
    blurb: 'Sun-warm guardians of the ruins, wearing their gold like a promise.',
    creatures: [
      { name: 'Sphinx Puffle', habitat: 'Golden Desert Ruins',
        powers: ['Wisdom Aura', 'Sandstorm', 'Ancient Blessing'],
        design: 'Golden fluffy lion sphere with a royal headdress.' },
      { name: 'Anubis Puffle', habitat: 'Spirit Oasis',
        powers: ['Soul Protection', 'Shadow Guide', 'Ancient Judgment'],
        design: 'Black fluffy jackal puffle with glowing gold markings.' },
      { name: 'Bastet Puffle', habitat: 'Moon Temples',
        powers: ['Grace Buff', 'Lunar Protection', 'Lucky Charm'],
        design: 'Elegant cat puffle covered in gold jewellery.' },
    ],
  },
  {
    id: 'greekmyth', name: 'Greek Myths', icon: '⚡', tier: 'legendary',
    blurb: 'The loud wing: winged horses, three-headed puppies and too many heads.',
    creatures: [
      { name: 'Pegasus Puffle', habitat: 'Cloud Kingdom',
        powers: ['Sky Dash', 'Wind Burst', 'Flight Aura'],
        design: 'White fluffy horse sphere with giant feather wings.' },
      { name: 'Cerberus Puffle', habitat: 'Underworld Gates',
        powers: ['Triple Bite', 'Guardian Shield', 'Spirit Detection'],
        design: 'Three-headed fluffy puppy puffle.' },
      { name: 'Hydra Puffle', habitat: 'Mystic Swamps',
        powers: ['Regeneration', 'Poison Breath', 'Head Multiplication'],
        design: 'Round emerald fluffball with multiple adorable snake heads.' },
      { name: 'Chimera Puffle', habitat: 'Lost Highlands',
        powers: ['Element Fusion', 'Beast Roar', 'Chaos Aura'],
        design: 'Fluffy lion-goat-dragon hybrid sphere.' },
    ],
  },
  {
    id: 'yokai', name: 'Yokai', icon: '👹', tier: 'epic',
    blurb: 'Mountain spirits with tiny horns, big opinions and excellent manners.',
    creatures: [
      { name: 'Oni Puffle', habitat: 'Spirit Mountains',
        powers: ['Strength Boost', 'Earth Smash', 'Fearless Aura'],
        design: 'Cute chunky fluffy oni with tiny horns.' },
      { name: 'Tengu Puffle', habitat: 'Sacred Peaks',
        powers: ['Wind Slash', 'Flight', 'Storm Call'],
        design: 'Round red fluffy bird-yokai with a feather cloak.' },
      { name: 'Kodama Puffle', habitat: 'Ancient Trees',
        powers: ['Nature Echo', 'Forest Teleport', 'Healing Light'],
        design: 'Tiny glowing forest spirit puffball.' },
    ],
  },
  {
    id: 'cosmic', name: 'Cosmic', icon: '🌌', tier: 'secret',
    blurb: 'Fur made of the parts of the sky that are too far away to argue with.',
    creatures: [
      { name: 'Starborn Puffle', habitat: 'Starlight Fields',
        powers: ['Starfall', 'Energy Burst', 'Cosmic Shield'],
        design: 'Deep blue fluffy sphere covered in stars.' },
      { name: 'Nebula Puffle', habitat: 'Cosmic Gardens',
        powers: ['Nebula Cloud', 'Cosmic Dust', 'Gravity Pulse'],
        design: 'Fluffy cloud body filled with colourful galaxies.' },
      { name: 'Constellation Puffle', habitat: 'Celestial Observatory',
        powers: ['Star Mapping', 'Cosmic Wisdom', 'Astral Beam'],
        design: 'Dark blue fluffy puffle connected by glowing constellation lines.' },
      { name: 'Cosmic Whale Puffle', habitat: 'Astral Ocean',
        powers: ['Galaxy Wave', 'Cosmic Song', 'Star Blessing'],
        design: 'Gigantic floating whale-shaped fluffy puffle made of galaxies.' },
    ],
  },
  {
    id: 'divinetier', name: 'Divine Tier', icon: '👑', tier: 'ultra_secret',
    blurb: 'The four that hold the Hollow up, and the one the whole game is named after.',
    creatures: [
      { name: 'Time Keeper Puffle', habitat: 'Eternal Clock Sanctuary',
        powers: ['Time Slow', 'Time Rewind', 'Chrono Shield'],
        design: 'Fluffy celestial puffle surrounded by floating clock gears.' },
      { name: 'Dream Weaver Puffle', habitat: 'Dream Realm',
        powers: ['Dream Creation', 'Sleep Blessing', 'Reality Warp'],
        design: 'Pastel cloud-like puffle weaving glowing dream ribbons.' },
      { name: 'World Serpent Puffle', habitat: 'Cosmic Void Ocean',
        powers: ['Planetary Coil', 'Cosmic Tide', 'Reality Shift'],
        design: 'Massive adorable serpent puffle wrapped in galaxies.' },
      { name: 'Hollow Guardian Puffle', habitat: 'Heart of Sprite Hollow',
        powers: ['Nature Mastery', 'Light & Shadow Balance', 'Universal Protection'],
        design: 'Ultimate mascot: an enormous fluffy celestial puffle combining dragon, fox, deer, phoenix, unicorn and fairy traits under a rainbow cosmic aura.' },
    ],
  },
];

const MYTH_PUFFLE_COUNT = MYTH_PUFFLE_GROUPS.reduce((total, group) => total + group.creatures.length, 0);

function mythEsc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const MYTH_PUFFLE_GROUP_ICONS = {
  fae: '🧚', divinebeast: '🦄', dragon: '🐉', phoenix: '🔥', spiritbeast: '🦊',
  forestguardian: '🌳', oceanmyth: '🌊', egyptian: '🏺', greekmyth: '⚡',
  yokai: '👹', cosmic: '🌌', divinetier: '👑',
};

/* One card per creature, one section per themed wing. The aura comes from the
   rarity palette, so a mythic puffle reads the same colour here as it does on
   its summon card. */
function wikiMythicalPufflesMarkup() {
  const groups = typeof MYTH_PUFFLE_GROUPS !== 'undefined' ? MYTH_PUFFLE_GROUPS : [];
  const styles = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES : {};
  const auraFor = (tier) => styles[tier] || { name: tier, color: '#C9CDD2', glow: 'rgba(201,205,210,.5)', icon: '⚪' };
  const legend = MYTH_PUFFLE_TIERS
    .map((tier) => ({ tier, style: auraFor(tier), count: groups.filter((g) => g.tier === tier).length }))
    .filter((row) => row.count)
    .map((row) => `<span class="mp-legend" style="--mp-aura:${row.style.color}">${row.style.icon} ${mythEsc(row.style.name)} · ${row.count} wings</span>`)
    .join('');
  const sections = groups.map((group) => {
    const style = auraFor(group.tier);
    return `<section class="mp-group" style="--mp-aura:${style.color};--mp-glow:${style.glow || style.color}">
      <div class="mp-group-head"><h3>${MYTH_PUFFLE_GROUP_ICONS[group.id] || group.icon || '✨'} ${mythEsc(group.name)} Puffles</h3><span>${group.creatures.length} creatures · ${mythEsc(style.name)}</span></div>
      <p class="tiny muted" style="margin:0 0 7px">${mythEsc(group.blurb)}</p>
      <div class="mp-grid">${group.creatures.map((creature) => `<article class="mp-card" data-mp-creature="${mythEsc(creature.name)}">
        <div class="mp-head"><span class="mp-orb" aria-hidden="true">${MYTH_PUFFLE_GROUP_ICONS[group.id] || '✨'}</span>
          <span class="mp-head-copy"><b class="mp-name">${mythEsc(creature.name)}</b><span class="mp-habitat">${mythEsc(creature.habitat)}</span></span></div>
        <div class="mp-powers">${creature.powers.map((power) => `<span class="mp-power">${mythEsc(power)}</span>`).join('')}</div>
        <p class="mp-design">${mythEsc(creature.design)}</p>
      </article>`).join('')}</div>
    </section>`;
  }).join('');
  return `<p class="wiki-lede">Every mythical creature in the Hollow arrives rewritten as a <b>Sprite Puffle</b>: a perfectly round, cloud-soft puffball with oversized eyes, tiny paws, and just enough horns, wings or tails to say what it is. ${MYTH_PUFFLE_COUNT} creatures, twelve wings, one silhouette.</p>
    <div class="mp-legend-row">${legend}</div>
    <p class="tiny muted">${groups.length} wings · ${MYTH_PUFFLE_COUNT} creatures · habitat, three powers and a design note each</p>
    ${sections}
    <h3>House style</h3>
    <p>Adorable fantasy collectible art: round fluffy body, ultra-soft fur, oversized sparkling eyes, chibi proportion, plush-toy finish, glowing aura and floating particles, bright fantasy colour, expressive and family friendly. No realistic anatomy, no horror, no aggressive expressions: a Void Dragon Puffle still looks like it wants a snack and a nap.</p>`;
}
