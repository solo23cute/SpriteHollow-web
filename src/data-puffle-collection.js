/* The Sprite Hollow Puffle Collection chart: every puffle on the sheet becomes a
   playable species with its own type egg, gene, titan and habitat.

   Each row is [name, tier, element, body, wing, eye, deep] — the hexes are read
   off the chart. A species also gets a hidden puffle style of the same key, which
   is what keeps its fur and eye colour right when it renders; hidden styles never
   show up in the Studio or Collection pickers, so the sheet's 90-odd puffles do
   not bury the 20 hand-written styles.

   Registered like every other species wave, so these join the type eggs, the wild
   pool, the habitats, the breeding table and the wiki as soon as they load. */

const PUFFLE_COLLECTION_ROWS = [
  /* Common — 60% */
  ['Forest Sprout', 'common', 'nature', '#5FC24B', '#9BE07A', '#2F8F3C', '#17501F'],
  ['Cloud Puff', 'common', 'wind', '#EAF3FF', '#FFFFFF', '#6FA8E8', '#2E5B8C'],
  ['Pebble', 'common', 'earth', '#B9AFA2', '#E4DCD2', '#7A6A58', '#4A3B2E'],
  ['Dewdrop', 'common', 'water', '#9FE8FF', '#E6FBFF', '#3FA9D6', '#1F5C7A'],
  ['Acorn', 'common', 'earth', '#C9A15B', '#F0D9A8', '#7A5220', '#4A2F0F'],
  ['Meadow', 'common', 'nature', '#A6E27B', '#E2FFC6', '#4E9B3A', '#26591E'],
  ['Mushroom', 'common', 'nature', '#F09CA8', '#FFD9DE', '#B44E63', '#6B2033'],
  ['Clover', 'common', 'nature', '#7BD48A', '#C9F5CE', '#3B8F4C', '#1C5228'],
  ['Sand', 'common', 'earth', '#E2C290', '#F7E4C2', '#A97142', '#6B4423'],
  ['Stone', 'common', 'earth', '#A8A8B0', '#DADAE2', '#6B6B75', '#3A3A44'],
  ['Stony', 'common', 'earth', '#8F8A84', '#C7C2BA', '#5E574F', '#332E28'],
  ['Breeze', 'common', 'wind', '#CFEAFF', '#F4FBFF', '#5FA8D8', '#2A5C82'],
  ['Sunny', 'common', 'light', '#FFD65C', '#FFF0B0', '#E09A00', '#8A5A00'],

  /* Uncommon — 25% */
  ['Blossom', 'uncommon', 'nature', '#FF9ECB', '#FFD3E5', '#E75FA5', '#8C2B5F'],
  ['Frost', 'uncommon', 'ice', '#A9E4FF', '#E8FAFF', '#5FD8FF', '#1F6E9B'],
  ['Coral', 'uncommon', 'water', '#FF8E7A', '#FFC6B8', '#D1493A', '#7D1F19'],
  ['Honey', 'uncommon', 'nature', '#F2B23C', '#FFE3A6', '#8A5410', '#54300A'],
  ['Bamboo', 'uncommon', 'nature', '#9CD97A', '#D8F5BE', '#5B9B3A', '#2E5A1B'],
  ['Emberbud', 'uncommon', 'fire', '#FF7A3D', '#FFC48A', '#D8461F', '#7A1F08'],
  ['Leafing', 'uncommon', 'nature', '#77C766', '#C2EEAF', '#3F8A34', '#1E4A18'],
  ['Wavelet', 'uncommon', 'water', '#7FD8FF', '#D6F5FF', '#2E8FC0', '#14496A'],
  ['Cactus', 'uncommon', 'nature', '#7FAF6A', '#C7DDBA', '#4A7340', '#2A4523'],
  ['Petalwind', 'uncommon', 'wind', '#F3C4E8', '#FFE6F7', '#B85AA8', '#6B245E'],
  ['Mist', 'uncommon', 'wind', '#D6E4EF', '#F4FAFF', '#7C9DB5', '#3D5566'],
  ['Orchid', 'uncommon', 'nature', '#D89CE8', '#F3CCFA', '#8F3FA8', '#4E1F5C'],
  ['Wisp', 'uncommon', 'spirit', '#D8D8FF', '#F4F2FF', '#8B8BFF', '#4A4A8F'],

  /* Rare — 10% */
  ['Crystal', 'rare', 'crystal', '#8FE9FF', '#E6FFFF', '#7FB8FF', '#2E5C8C'],
  ['Moonlight', 'rare', 'moon', '#BFC9F5', '#E8EDFF', '#8FA8FF', '#3A4A8C'],
  ['Thunder', 'rare', 'electric', '#FFE05C', '#FFF3A8', '#C98A00', '#6B4A00'],
  ['Ocean Tide', 'rare', 'water', '#3FA6D9', '#A8DFF5', '#0F5F8A', '#0A3B57'],
  ['Moss Guardian', 'rare', 'nature', '#7A9A4E', '#C4D9A2', '#46652A', '#26361A'],
  ['Amethyst', 'rare', 'crystal', '#B98CFF', '#E4D2FF', '#7B3FD8', '#3E1B7A'],
  ['Sunbeam', 'rare', 'light', '#FFCF6B', '#FFEFC0', '#D99000', '#7A5000'],
  ['Dusk', 'rare', 'shadow', '#4A3F6B', '#8B7BB8', '#B45CFF', '#5B2A8C'],
  ['Tidal Pearl', 'rare', 'water', '#BFE8F2', '#F2FDFF', '#6FB8C9', '#2E5C66'],
  ['Zephyr', 'rare', 'wind', '#B8E8D9', '#E8FFF6', '#3F9B7A', '#1C4A38'],
  ['Lily', 'rare', 'water', '#D8F0D0', '#F4FFF0', '#5FA85C', '#2E5C2E'],
  ['Water Lily', 'rare', 'water', '#C9E9FF', '#EFFAFF', '#5FA8D8', '#2A4E6B'],
  ['Shadowling', 'rare', 'shadow', '#2A2438', '#5C4C7A', '#A83CFF', '#4A1B7A'],

  /* Epic — 4% */
  ['Galaxy', 'epic', 'cosmic', '#6B4BD6', '#C77BFF', '#FF7BE5', '#3A1F7A'],
  ['Spirit Guardian', 'epic', 'spirit', '#E9E4FF', '#FFFFFF', '#9B7BFF', '#4A3A8C'],
  ['Arcane Rune', 'epic', 'spirit', '#8C6BFF', '#D0B8FF', '#5C2FD8', '#2E146B'],
  ['Phoenix Flame', 'epic', 'fire', '#FF5C2E', '#FFB07A', '#FFC24B', '#8C2A00'],
  ['Aurora', 'epic', 'rainbow', '#7BF3D0', '#B8A8FF', '#59E0FF', '#2A6B6B'],
  ['Stormcaller', 'epic', 'electric', '#5E7CE2', '#A8C8FF', '#FFE05C', '#2A3A7A'],
  ['Blizzard', 'epic', 'ice', '#D6F2FF', '#FFFFFF', '#79C8FF', '#3A6B9B'],
  ['Magma', 'epic', 'fire', '#FF4D00', '#FF9A3D', '#FFD166', '#7A1B00'],
  ['Tempest', 'epic', 'wind', '#7A8CA8', '#C8D8E8', '#C9A23F', '#3A4A5C'],
  ['Verdant Titan', 'epic', 'nature', '#3F8A4A', '#8FD89A', '#C9F56B', '#1B4A22'],
  ['Melody', 'epic', 'music', '#FF71CE', '#FFB8E6', '#05FFA1', '#6B2A5C'],
  ['Moggy', 'epic', 'spirit', '#A88CD8', '#E0D0F5', '#FFD166', '#4A2E6B'],
  ['Nightbloom', 'epic', 'shadow', '#3A2A5C', '#7B5C9B', '#FF6FA8', '#1B0F33'],

  /* Legendary — 0.9% */
  ['Golden Guardian', 'legendary', 'light', '#FFCE5C', '#FFF2B8', '#FFB020', '#8A5A00'],
  ['Chrono', 'legendary', 'time', '#D4AF37', '#FFF3B0', '#B8860B', '#6B4A00'],
  ['Celestial Sun', 'legendary', 'light', '#FFD74F', '#FFF5C8', '#FFB800', '#8A5A00'],
  ['Lunar Queen', 'legendary', 'moon', '#D6DCFF', '#FFFFFF', '#9FB8FF', '#3A4A8C'],
  ['Prism Dragon', 'legendary', 'rainbow', '#C4A8FF', '#E8DDFF', '#FF8AD8', '#4A2A7A'],
  ['Leviathan', 'legendary', 'water', '#2E7FA8', '#8FD0E8', '#9FFFF0', '#123A4A'],
  ['Ember Lord', 'legendary', 'fire', '#FF6B1A', '#FFB86B', '#FFE066', '#7A2200'],
  ['Frost Queen', 'legendary', 'ice', '#CFEFFF', '#FFFFFF', '#8FDCFF', '#3A6B9B'],
  ['Nature Sage', 'legendary', 'nature', '#6BA85C', '#C4E8B8', '#FFE066', '#2A4A22'],
  ['Starforge', 'legendary', 'cosmic', '#FFB85C', '#FFE0B0', '#FFF2B8', '#7A4A1B'],
  ['Sunforge', 'legendary', 'fire', '#FFA53D', '#FFD89A', '#FFF6C9', '#7A3A00'],
  ['Resonance', 'legendary', 'music', '#8FE8FF', '#D6F8FF', '#FF71CE', '#2A5C7A'],
  ['Radiant Angel', 'legendary', 'light', '#FFF2C9', '#FFFFFF', '#FFD166', '#8A6B2A'],

  /* Mythic — 0.09% */
  ['Celestial Hollow', 'mythic', 'light', '#CFE8FF', '#FFFFFF', '#79D6FF', '#2E5C8C'],
  ['Eclipse', 'mythic', 'shadow', '#4A3A78', '#C7A9FF', '#FFC24B', '#1B0F33'],
  ['Void Star', 'mythic', 'void', '#2A1B4A', '#7B4AB8', '#E05CFF', '#0F061B'],
  ['Dreamweaver', 'mythic', 'spirit', '#FFD6F6', '#FFF0FF', '#C48CFF', '#5C2A7A'],
  ['Ancient Worldtree', 'mythic', 'nature', '#4A7A3F', '#A8D89A', '#FFE066', '#1B3A14'],
  ['Inferno King', 'mythic', 'fire', '#E03A00', '#FF8A3D', '#FFD166', '#5C1400'],
  ['Arctic Crown', 'mythic', 'ice', '#BFE8FF', '#EFFBFF', '#9FCBFF', '#2A5C7A'],
  ['Tempest Emperor', 'mythic', 'wind', '#5C6B8C', '#A8B8D8', '#C9D8FF', '#1B2438'],
  ['Abyss Lord', 'mythic', 'void', '#1B1433', '#5C3A8C', '#8F6BFF', '#07030F'],
  ['Timekeeper', 'mythic', 'time', '#C9A85C', '#F2E2B0', '#FFD166', '#5C4A1B'],
  ['Infinity', 'mythic', 'cosmic', '#3A2A6B', '#8C6BC9', '#C9A8FF', '#140A2E'],
  ['Dawn', 'mythic', 'light', '#FFD9B0', '#FFF3E0', '#FFB86B', '#8A5C2A'],
  ['Dawnbringer', 'mythic', 'light', '#FFE8C9', '#FFFFFF', '#FFCE5C', '#8A5C1B'],

  /* Secret — 0.01% */
  ['Rainbow Eternity', 'secret', 'rainbow', '#B18CFF', '#FFD1F0', '#8CFFF2', '#4A2A7A'],
  ['Creator', 'secret', 'cosmic', '#E8D6FF', '#FFFFFF', '#C9A8FF', '#4A2A7A'],
  ['Sprite Hollow Prime', 'secret', 'rainbow', '#B18CFF', '#FFD1F0', '#8CFFF2', '#3A1B6B'],
  ['Hollow King', 'secret', 'void', '#24163F', '#6B3FA8', '#C93CFF', '#0A0414'],
  ['Hollow Queen', 'secret', 'void', '#2A1B4A', '#7B4AB8', '#FF6FA8', '#0F061B'],
  ['Cosmic Sprite Prime', 'secret', 'cosmic', '#5C3FA8', '#B89CFF', '#8FE3FF', '#1B0F3A'],
  ['Divine Titan', 'secret', 'light', '#FFF0C9', '#FFFFFF', '#FFD166', '#8A6B2A'],
  ['Genesis', 'secret', 'nature', '#6BC96B', '#C4F5B8', '#E8FF9A', '#1B4A1B'],
  ['Paradise', 'secret', 'rainbow', '#FFD6A8', '#FFF0DC', '#8CFFF2', '#8A5C2A'],
  ['Pataos', 'secret', 'earth', '#A88C5C', '#E0CCA8', '#C9A23F', '#4A3A14'],
  ['Onicorn', 'secret', 'rainbow', '#E8C9FF', '#FFFFFF', '#FFB8E6', '#4A2A8C'],
  ['Unicorn', 'secret', 'light', '#FFFFFF', '#FFF0FF', '#C9A8FF', '#6B5C8C'],
  ['Cosmic Unicorn', 'secret', 'cosmic', '#8C6BC9', '#E0D0FF', '#8FE3FF', '#2A1B5C'],
];

const PUFFLE_COLLECTION_TIERS = {
  common: { price: 70, likes: 'Moon Berry', suffix: 'Sprout', gene: { name: 'Gather', icon: '🌱', desc: 'Gifts arrive 10% sooner and XP gains +6%.', effect: { giftSpeed: 1.1, xp: 1.06 } } },
  uncommon: { price: 90, likes: 'Honey Drop', suffix: 'Wisp', gene: { name: 'Bloom Step', icon: '🌿', desc: 'XP gains +8% and joy fades 8% slower.', effect: { xp: 1.08, joyMod: 0.92 } } },
  rare: { price: 105, likes: 'Star Cookie', suffix: 'Warden', gene: { name: 'Bright Shard', icon: '💠', desc: 'Games pay +3 coins and needs fade 8% slower.', effect: { gameCoins: 3, needSlow: 0.92 } } },
  epic: { price: 130, likes: 'Moon Cake', suffix: 'Herald', gene: { name: 'Arcane Pulse', icon: '🔮', desc: 'Games pay +3 coins and XP gains +12%.', effect: { gameCoins: 3, xp: 1.12 } } },
  legendary: { price: 175, likes: 'Sun Nectar', suffix: 'Sovereign', gene: { name: 'Royal Aura', icon: '👑', desc: 'Games pay +4 coins and bond grows 15% faster.', effect: { gameCoins: 4, bond: 1.15 } } },
  mythic: { price: 215, likes: 'Star Pop', suffix: 'Deity', gene: { name: 'Starfall', icon: '🌌', desc: 'Night games pay +5 coins and XP gains +15%.', effect: { nightCoins: 5, xp: 1.15 } } },
  secret: { price: 250, likes: 'Cloud Feast', suffix: 'Eternal', gene: { name: 'Worldsong', icon: '✨', desc: 'Games pay +6 coins and gifts arrive 20% sooner.', effect: { gameCoins: 6, giftSpeed: 1.2 } } },
};

const PUFFLE_COLLECTION_ELEMENTS = {
  nature: { label: 'Nature', trait: 'Greenpaw — new leaves sprout where it naps.', blurb: 'a walking garden with a very proud crest.', greeting: 'I grew you a leaf. It is a small leaf but it is yours.', habitats: ['grove', 'mycelium'] },
  fire: { label: 'Fire', trait: 'Warmfur — always exactly as warm as a sunbeam.', blurb: 'a little campfire with legs and a very soft heart.', greeting: 'I am warm. You are warm now too.', habitats: ['ember', 'grove'] },
  water: { label: 'Water', trait: 'Tidefoot — never quite dries off.', blurb: 'a pocket tide that never quite dries.', greeting: 'I brought you a puddle. It is a nice puddle.', habitats: ['tide', 'crystal'] },
  ice: { label: 'Ice', trait: 'Rimecoat — leaves frost prints when it walks.', blurb: 'a snowdrift that refused to melt.', greeting: 'Careful, my paws are cold. Hold them anyway.', habitats: ['frost', 'aurora'] },
  electric: { label: 'Electric', trait: 'Sparkfur — its fur crackles when it is happy.', blurb: 'a spark with absolutely no volume control.', greeting: 'I have been zooming all morning. Want to zoom?', habitats: ['aurora', 'ember'] },
  moon: { label: 'Moon', trait: 'Moonbound — wakes when the sky goes dark.', blurb: 'a sleeper who keeps the moon company.', greeting: 'The moon is up. That is our cue.', habitats: ['night', 'dream'] },
  light: { label: 'Light', trait: 'Halow — glows a little brighter around friends.', blurb: 'a pocket sunrise with a sweet tooth.', greeting: 'You look like a good moment. I am keeping you.', habitats: ['aurora', 'starlit'] },
  cosmic: { label: 'Cosmic', trait: 'Starry — tiny constellations drift across its back.', blurb: 'a nebula in a fur coat.', greeting: 'You are made of star stuff. I checked twice.', habitats: ['night', 'starlit'] },
  void: { label: 'Void', trait: 'Quietfur — the shadows lean toward it.', blurb: 'a quiet corner of the universe that likes you.', greeting: 'It is nice in here. Nobody finds me. You did, though.', habitats: ['night', 'starlit'] },
  crystal: { label: 'Crystal', trait: 'Shardcoat — its fur chimes in a light wind.', blurb: 'a glass-bright sprite with a rainbow inside.', greeting: 'I am mostly sparkle. Some fur.', habitats: ['crystal', 'dream'] },
  music: { label: 'Music', trait: 'Tonecoat — hums a harmony in its sleep.', blurb: 'a song that learned to walk.', greeting: 'Everything is better with a soundtrack.', habitats: ['sugar', 'aurora'] },
  time: { label: 'Time', trait: 'Clockfur — always exactly on time, even when it is late.', blurb: 'a clock that would much rather cuddle.', greeting: 'You are right on time. You always are.', habitats: ['crystal', 'sugar'] },
  earth: { label: 'Earth', trait: 'Mossback — collects pebbles and knows each one.', blurb: 'a handful of warm soil with a garden on it.', greeting: 'I found a rock. It is the best rock.', habitats: ['grove', 'savanna'] },
  wind: { label: 'Wind', trait: 'Driftfur — floats a finger above the floor.', blurb: 'a breeze that forgot to land.', greeting: 'I followed a breeze here. It was yours.', habitats: ['aurora', 'grove'] },
  shadow: { label: 'Shadow', trait: 'Umbrafur — dims the lamp it naps beside.', blurb: 'a shadow that hums when nobody looks.', greeting: 'I am not hiding. I am being mysterious.', habitats: ['night', 'dream'] },
  rainbow: { label: 'Rainbow', trait: 'Prismfur — splits the light wherever it stands.', blurb: 'a prism with paws.', greeting: 'Look what the sun does to me. Look!', habitats: ['starlit', 'aurora'] },
  spirit: { label: 'Spirit', trait: 'Half Here — fades at the edges when startled.', blurb: 'a friendly ghost who drifts through walls politely.', greeting: 'Boo. Sorry. Force of habit.', habitats: ['dream', 'night'] },
};

function puffleCollectionSlug(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

(function registerPuffleCollectionSpecies() {
  if (typeof ELEMENTS === 'undefined') return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  PUFFLE_COLLECTION_ROWS.forEach(([name, tierKey, elementKey, body, wing, eye, deep]) => {
    const key = `pc_${puffleCollectionSlug(name)}`;
    if (ELEMENTS[key]) return;
    const tier = PUFFLE_COLLECTION_TIERS[tierKey] || PUFFLE_COLLECTION_TIERS.common;
    const line = PUFFLE_COLLECTION_ELEMENTS[elementKey] || PUFFLE_COLLECTION_ELEMENTS.nature;

    ELEMENTS[key] = {
      name,
      primary: body,
      light: wing,
      deep,
      accent: eye,
      trait: line.trait,
      blurb: `${name} is a ${tierKey} ${line.label.toLowerCase()} puffle from the collection sheet — ${line.blurb}`,
      greeting: line.greeting,
      likes: tier.likes,
      /* Hidden style of the same key: fur and eyes this species wears. */
      puffleStyle: key,
      puffleElement: line.label,
      collectionTier: tierKey,
      collectionTierName: tierKey.charAt(0).toUpperCase() + tierKey.slice(1),
    };

    if (table && !table[key]) {
      table[key] = {
        hidden: true,
        tier: tierKey,
        name: `${name} Puffle`,
        theme: `${tierKey.charAt(0).toUpperCase() + tierKey.slice(1)} ${line.label} puffle from the collection sheet.`,
        primary: body,
        secondary: wing,
        belly: wing,
        ear: wing,
        iris: eye,
        leaf: deep,
        leafGlow: eye,
        pads: wing,
      };
    }

    GENE_POWERS[key] = tier.gene;
    TITAN_NAMES[key] = `${name} ${tier.suffix}`;
    TYPE_EGG_BASE_PRICE[key] = tier.price;
    TYPE_EGG_PRICE[key] = discountedEggPrice(tier.price);
    NAME_START[key] = [String(name).split(' ')[0], 'Puffle', 'Puff', 'Tuft'];
    if (!ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
    if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
    if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
    line.habitats.forEach((scene) => {
      if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
    });
  });
  if (table && typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
})();
