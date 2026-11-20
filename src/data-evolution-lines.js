/* Named evolution lines for the Puffle Collection.

   Every line is five stages — Baby, Advanced, Ascended, Legendary Ascension —
   and those four names cover the twelve life stages the game already has:

     baby / juvenile          -> stage 1
     sprite .. highadult      -> stage 2
     elder .. sensei          -> stage 3
     apex / omni / celestial  -> stage 4

   A line's first name is the species you hatch. Where that species did not exist
   yet it is registered here like any other wave, so every chain in the archive is
   reachable from an egg. The chain is exposed through window.puffleEvolutionLine
   and drawn on the sprite detail sheet. */

const PUFFLE_EVOLUTION_FAMILIES = {
  nature: { body: '#5FC24B', wing: '#9BE07A', eye: '#2F8F3C', deep: '#17501F', habitats: ['grove', 'mycelium'], likes: 'Moon Berry', price: 70, gene: { name: 'Wild Growth', icon: '🌿', desc: 'XP gains +8% and joy fades 8% slower.', effect: { xp: 1.08, joyDecay: 0.92 } } },
  fire: { body: '#FF6B35', wing: '#FFB347', eye: '#FFD166', deep: '#C73E1D', habitats: ['ember', 'grove'], likes: 'Ember Steak', price: 90, gene: { name: 'Kindled', icon: '🔥', desc: 'Games pay +3 coins and hunger fades 10% slower.', effect: { gameCoins: 3, hungerDecay: 0.9 } } },
  ice: { body: '#A9E4FF', wing: '#E8FAFF', eye: '#5FD8FF', deep: '#1F6E9B', habitats: ['biome-ice', 'aurora'], likes: 'Warm Soup', price: 90, gene: { name: 'Rime', icon: '❄️', desc: 'Needs fade 10% slower and pets build +12% bond.', effect: { decay: 0.9, petBond: 1.12 } } },
  electric: { body: '#FFE05C', wing: '#FFF3A8', eye: '#C98A00', deep: '#6B4A00', habitats: ['aurora', 'ember'], likes: 'Star Pop', price: 105, gene: { name: 'Overcharge', icon: '⚡', desc: 'Games pay +4 coins and night games pay +2.', effect: { gameCoins: 4, nightCoins: 2 } } },
  water: { body: '#3FA6D9', wing: '#A8DFF5', eye: '#0F5F8A', deep: '#0A3B57', habitats: ['tide', 'crystal'], likes: 'Coconut Water', price: 70, gene: { name: 'Undertow', icon: '🌊', desc: 'Gifts arrive 15% sooner and energy fades 12% slower.', effect: { giftSpeed: 1.15, energyDecay: 0.88 } } },
  earth: { body: '#B98C5A', wing: '#E4C9A3', eye: '#7A5A32', deep: '#5A3E1F', habitats: ['grove', 'savanna'], likes: 'Moon Cake', price: 90, gene: { name: 'Stoneblood', icon: '🪨', desc: 'Energy fades 18% slower and games pay +2 coins.', effect: { energyDecay: 0.82, gameCoins: 2 } } },
  wind: { body: '#CFE9FF', wing: '#F2FBFF', eye: '#7FB8D9', deep: '#3D6B85', habitats: ['aurora', 'starlit'], likes: 'Cloud Feast', price: 90, gene: { name: 'Updraft', icon: '🌪️', desc: 'Gifts arrive 18% sooner and XP gains +8%.', effect: { giftSpeed: 1.18, xp: 1.08 } } },
  moon: { body: '#BFC9F5', wing: '#E8EDFF', eye: '#8FA8FF', deep: '#3A4A8C', habitats: ['night', 'dream'], likes: 'Moon Berry', price: 90, gene: { name: 'Moonlit', icon: '🌙', desc: 'Night games pay +5 coins and XP gains +8%.', effect: { nightCoins: 5, xp: 1.08 } } },
  light: { body: '#FFD65C', wing: '#FFF0B0', eye: '#E09A00', deep: '#8A5A00', habitats: ['aurora', 'starlit'], likes: 'Sun Nectar', price: 90, gene: { name: 'Sunblessed', icon: '🌞', desc: 'Day games pay +5 coins and bond grows 10% faster.', effect: { dayCoins: 5, petBond: 1.1 } } },
  shadow: { body: '#3A2A5C', wing: '#7B5C9B', eye: '#FF6FA8', deep: '#1B0F33', habitats: ['night', 'dream'], likes: 'Warm Soup', price: 105, gene: { name: 'Umbral', icon: '🌑', desc: 'Night games pay +6 coins and needs fade 8% slower.', effect: { nightCoins: 6, decay: 0.92 } } },
  cosmic: { body: '#6B4BD6', wing: '#C77BFF', eye: '#FF7BE5', deep: '#3A1F7A', habitats: ['night', 'starlit'], likes: 'Star Pop', price: 130, gene: { name: 'Nebulous', icon: '🌌', desc: 'XP gains +15% and gifts arrive 10% sooner.', effect: { xp: 1.15, giftSpeed: 1.1 } } },
  crystal: { body: '#8FE9FF', wing: '#E6FFFF', eye: '#7FB8FF', deep: '#2E5C8C', habitats: ['crystal', 'dream'], likes: 'Star Cookie', price: 130, gene: { name: 'Faceted', icon: '💎', desc: 'Games pay +3 coins and energy fades 15% slower.', effect: { gameCoins: 3, energyDecay: 0.85 } } },
  music: { body: '#FF71CE', wing: '#FFB8E6', eye: '#05FFA1', deep: '#6B2A5C', habitats: ['sugar', 'aurora'], likes: 'Star Pop', price: 90, gene: { name: 'On Beat', icon: '🎧', desc: 'Games pay +3 coins and chats pay +2.', effect: { gameCoins: 3, chatCoins: 2 } } },
  time: { body: '#D4AF37', wing: '#FFF3B0', eye: '#B8860B', deep: '#6B4A00', habitats: ['crystal', 'sugar'], likes: 'Honeycomb Cake', price: 130, gene: { name: 'Second Wind', icon: '⏳', desc: 'Gifts arrive 25% sooner and energy fades 10% slower.', effect: { giftSpeed: 1.25, energyDecay: 0.9 } } },
  spirit: { body: '#D8D8FF', wing: '#F4F2FF', eye: '#8B8BFF', deep: '#4A4A8F', habitats: ['dream', 'night'], likes: 'Warm Soup', price: 130, gene: { name: 'Half Here', icon: '👻', desc: 'Pets build +25% bond and needs fade 10% slower.', effect: { petBond: 1.25, decay: 0.9 } } },
  mushroom: { body: '#E89AC8', wing: '#FFD9EC', eye: '#B44E8C', deep: '#6B2050', habitats: ['mycelium', 'grove'], likes: 'Moon Cake', price: 90, gene: { name: 'Spore Bloom', icon: '🍄', desc: 'Joy fades 12% slower and XP gains +8%.', effect: { joyDecay: 0.88, xp: 1.08 } } },
  squishy: { body: '#8FE3FF', wing: '#E8FFFF', eye: '#3A8FBF', deep: '#1F5C7A', habitats: ['tide', 'sugar'], likes: 'Jelly Cube', price: 100, gene: { name: 'Soft Body', icon: '🫧', desc: 'Needs fade 12% slower and pets build +12% bond.', effect: { decay: 0.88, petBond: 1.12 } } },
  gummy: { body: '#FF8FD6', wing: '#FFE0F2', eye: '#C23A8F', deep: '#7A1F5C', habitats: ['sugar', 'crystal'], likes: 'Gummy Star', price: 120, gene: { name: 'Sugar Shell', icon: '🍬', desc: 'Snacks give +20% XP and joy fades 10% slower.', effect: { snackXp: 1.2, joyDecay: 0.9 } } },
  dragon: { body: '#C25BFF', wing: '#E0A8FF', eye: '#FFD166', deep: '#4A1B7A', habitats: ['crystal', 'ember'], likes: 'Ember Steak', price: 175, gene: { name: 'Dragonheart', icon: '🐉', desc: 'Games pay +5 coins and XP gains +12%.', effect: { gameCoins: 5, xp: 1.12 } } },
  rainbow: { body: '#B18CFF', wing: '#FFD1F0', eye: '#8CFFF2', deep: '#4A2A7A', habitats: ['starlit', 'aurora'], likes: 'Cloud Feast', price: 215, gene: { name: 'Spectrum', icon: '🌈', desc: 'Games pay +5 coins and gifts arrive 15% sooner.', effect: { gameCoins: 5, giftSpeed: 1.15 } } },
  secret: { body: '#B18CFF', wing: '#FFD1F0', eye: '#8CFFF2', deep: '#3A1B6B', habitats: ['starlit', 'night'], likes: 'Cloud Feast', price: 250, gene: { name: 'Worldsong', icon: '✨', desc: 'Games pay +6 coins and XP gains +15%.', effect: { gameCoins: 6, xp: 1.15 } } },
  normal: { body: '#C9C3B6', wing: '#F6F2E9', eye: '#8BE9FF', deep: '#5A544A', habitats: ['grove', 'savanna'], likes: 'Warm Soup', price: 65, gene: { name: 'Everyday Charm', icon: '🙂', desc: 'All needs fade 8% slower and pets pay +1 coin.', effect: { decay: 0.92, petCoins: 1 } } },
  beast: { body: '#C9975E', wing: '#F0D7B0', eye: '#FFD166', deep: '#5C3A1E', habitats: ['grove', 'savanna', 'night'], likes: 'Juicy Drumstick', price: 95, gene: { name: 'Wild Instinct', icon: '🐾', desc: 'Pets build +18% bond and games pay +2 coins.', effect: { petBond: 1.18, gameCoins: 2 } } },
  verdant: { body: '#6FBF5A', wing: '#C8F5A8', eye: '#FFD166', deep: '#1F5C2B', habitats: ['grove', 'mycelium', 'savanna'], likes: 'Moon Berry', price: 85, gene: { name: 'Deep Roots', icon: '🌱', desc: 'Energy fades 14% slower and XP gains +8%.', effect: { energyDecay: 0.86, xp: 1.08 } } },
  aether: { body: '#9AD7FF', wing: '#F0FBFF', eye: '#FFB3F0', deep: '#3A4A8C', habitats: ['starlit', 'dream', 'crystal'], likes: 'Star Pop', price: 140, gene: { name: 'Riftstep', icon: '🌌', desc: 'Gifts arrive 20% sooner and night games pay +3 coins.', effect: { giftSpeed: 1.2, nightCoins: 3 } } },
};

/* [stage 1..5 names, family] */
const vaultEvolutionLine = (family, stages) => ({
  family,
  stages,
  rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'],
});

const PUFFLE_EVOLUTION_LINES = [
  { family: 'nature', stages: ['Forest Sprout', 'Blossom', 'Ancient Grove', 'Worldtree Guardian', 'Eternal Nature Sovereign'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'nature', stages: ['Blossom', 'Sakura Guardian', 'Spirit Blossom Queen', 'Eternal Bloom Goddess', 'Blossom Reverie Sovereign'], rarity: [] },
  { family: 'nature', stages: ['Bamboo', 'Jade Sentinel', 'Emerald Protector', 'Ancient Forest Emperor', 'Verdant Hollow Emperor'], rarity: [] },
  { family: 'fire', stages: ['Ember Puffle', 'Flameheart', 'Phoenix Guardian', 'Magma Emperor', 'Inferno King'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'fire', stages: ['Magma Whelp', 'Volcano Beast', 'Molten Emperor', 'Primordial Fire Titan', 'Magma Worldheart'], rarity: [] },
  { family: 'fire', stages: ['Fire Sprite', 'Solar Flame', 'Celestial Inferno Spirit', 'Eternal Sun Lord', 'Sunforge Ascendant'], rarity: [] },
  { family: 'ice', stages: ['Frost Puffle', 'Glacier', 'Arctic Crown', 'Frozen Celestial Guardian', 'Eternal Winter Monarch'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'ice', stages: ['Snow Spirit', 'Crystal Blizzard', 'Frozen Celestial Guardian', 'Aurora Ice Goddess', 'Aurora Winterlight'], rarity: [] },
  { family: 'electric', stages: ['Spark', 'Thunder', 'Stormcaller', 'Tempest Emperor', 'Cosmic Voltage King'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'electric', stages: ['Lightning Sprite', 'Sky Charger', 'Celestial Thunder Beast', 'Cosmic Voltage King', 'Volt Eternal Warden'], rarity: [] },
  { family: 'water', stages: ['Dewdrop', 'Tide', 'Ocean Guardian', 'Sea Sovereign', 'Leviathan Emperor'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'water', stages: ['Coral', 'Reef Protector', 'Marine Sovereign', 'Pearl Ocean Queen', 'Pearl Reef Eternal'], rarity: [] },
  { family: 'earth', stages: ['Pebble', 'Moss Guardian', 'Stone Warden', 'Mountain Titan', 'Earth Sovereign'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'wind', stages: ['Breeze', 'Cloud Puff', 'Sky Dancer', 'Hurricane Guardian', 'Tempest Sovereign'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'moon', stages: ['Moonlight', 'Crescent Spirit', 'Lunar Guardian', 'Moon Warden', 'Lunar Queen'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'moon', stages: ['Night Sky', 'Eclipse Walker', 'Celestial Moon Warden', 'Eclipse Monarch', 'Nightfall Eternal Moon'], rarity: [] },
  { family: 'light', stages: ['Dawn', 'Sunflare', 'Celestial Sun Guardian', 'Holy Star Sovereign', 'Divine Light Emperor'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'light', stages: ['Radiant', 'Solar Crown', 'Holy Star Sovereign', 'Eternal Luminary', 'Luminary Ascendant'], rarity: [] },
  { family: 'shadow', stages: ['Shadow Puffle', 'Nightmare', 'Abyss Guardian', 'Void Walker', 'Abyss Lord'], rarity: ['common', 'uncommon', 'rare', 'epic', 'mythic'] },
  { family: 'shadow', stages: ['Phantom', 'Dark Spirit', 'Void Walker', 'Void King', 'Void Sovereign Shadow'], rarity: [] },
  { family: 'cosmic', stages: ['Galaxy', 'Nebula', 'Starforge Guardian', 'Celestial Hollow', 'Cosmic Sprite Prime'], rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'] },
  { family: 'cosmic', stages: ['Comet', 'Constellation Spirit', 'Cosmic Warden', 'Starfall Sovereign', 'Starfall Eternal Warden'], rarity: [] },
  { family: 'crystal', stages: ['Crystal', 'Sapphire Guardian', 'Prism Spirit', 'Infinity Crystal'], rarity: ['rare', 'epic', 'legendary', 'mythic'] },
  { family: 'crystal', stages: ['Ruby', 'Crystal Emperor', 'Diamond Sovereign', 'Eternal Crystal God', 'Diamond Eternal Facet'], rarity: [] },
  { family: 'music', stages: ['Melody', 'Symphony', 'Harmony Guardian', 'Harmony Prime'], rarity: ['common', 'rare', 'epic', 'mythic'] },
  { family: 'music', stages: ['DJ', 'Rhythm Master', 'Festival Sovereign', 'Eternal Sound Emperor', 'Soundwave Eternal'], rarity: [] },
  { family: 'time', stages: ['Hourglass', 'Chrono', 'Timekeeper Guardian', 'Infinity'], rarity: ['rare', 'epic', 'legendary', 'mythic'] },
  { family: 'time', stages: ['Clockwork', 'Temporal Spirit', 'Timeline Sovereign', 'Master of Eternity', 'Eternity Unwritten'], rarity: [] },
  { family: 'spirit', stages: ['Spirit Guardian', 'Astral Wanderer', 'Soulfire Protector', 'Elder Sprite Ascendant'], rarity: ['rare', 'epic', 'legendary', 'mythic'] },
  { family: 'spirit', stages: ['Dreamwalker', 'Astral Dream Guardian', 'Celestial Spirit', 'Dream Realm Sovereign', 'Dream Eternal Warden'], rarity: [] },
  { family: 'mushroom', stages: ['Mushroom', 'Glowcap', 'Ancient Fungi Guardian', 'Mycelium Emperor'], rarity: ['common', 'uncommon', 'epic', 'legendary'] },
  { family: 'mushroom', stages: ['Fairy Spore', 'Lumina Mushroom Spirit', 'Enchanted Grove Keeper', 'Eternal Spore Titan', 'Spore Eternal Grove'], rarity: [] },
  { family: 'squishy', stages: ['Squishy', 'Squishy Sprite', 'Jelly Guardian', 'Squishmere', 'Squishiverse Sovereign'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'squishy', stages: ['Bubblegum Squish', 'Bubblegum Sprite', 'Bubblegum Guardian', 'Bubblegum Titan', 'Bubblegum Eternal'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'gummy', stages: ['Gummy Bear', 'Gummy Sprite', 'Gummy Guardian', 'Gummy Colossus', 'Gummyverse Sovereign'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'gummy', stages: ['Sour Gummy', 'Sour Sprite', 'Sour Guardian', 'Sour Emperor', 'Sourverse Sovereign'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'cosmic', stages: ['Nova Pup', 'Nova Sprite', 'Nova Guardian', 'Nova Titan', 'Nova Sovereign'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'crystal', stages: ['Geode Pup', 'Geode Sprite', 'Geode Guardian', 'Geode Titan', 'Geode Sovereign'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'nature', stages: ['Terra Seed', 'Terra Sprout', 'Terra Guardian', 'Terra Titan', 'Terra Worldheart'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'fire', stages: ['Solar Ember', 'Solar Sprite', 'Solar Guardian', 'Solar Titan', 'Solar Sovereign'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'dragon', stages: ['Dragonling', 'Crystal Dragon', 'Celestial Dragon', 'Prism Dragon Emperor'], rarity: ['rare', 'epic', 'legendary', 'mythic'] },
  { family: 'dragon', stages: ['Void Dragon', 'Star Dragon', 'Cosmic Dragon Sovereign', 'Eternal Dragon God', 'Dragon Eternal Void'], rarity: [] },
  { family: 'rainbow', stages: ['Rainbow', 'Aurora', 'Rainbow Eternity', 'Infinite Spectrum Monarch'], rarity: ['legendary', 'mythic', 'secret', 'ultra_secret'] },
  { family: 'rainbow', stages: ['Prismatic', 'Crystal Aurora Spirit', 'Celestial Prism Guardian', 'Infinite Spectrum Monarch', 'Spectrum Eternal Prism'], rarity: [] },
  { family: 'secret', stages: ['Creator Puffle', 'Sprite Hollow Prime', 'Ascended Prime', 'Cosmic Prime', 'Universal Prime'], rarity: ['secret', 'secret', 'ultra_secret', 'ultra_secret', 'ultra_secret'] },
  { family: 'secret', stages: ['Sprite Hollow Prime', 'Ascended Prime', 'Cosmic Prime', 'Universal Prime', 'Omniprime'], rarity: [] },
  { family: 'secret', stages: ['Hollow King', 'Ascended Hollow King', 'Celestial Hollow King', 'Eternal Hollow Emperor', 'Hollow Emperor Eternal'], rarity: [] },
  { family: 'secret', stages: ['Hollow Queen', 'Ascended Hollow Queen', 'Celestial Hollow Queen', 'Eternal Hollow Empress', 'Hollow Empress Eternal'], rarity: [] },
  { family: 'secret', stages: ['Cosmic Sprite Prime', 'Universal Sprite Prime', 'Multiverse Prime', 'Origin of All Puffles', 'Origin Beyond Origin'], rarity: [] },
  /* Everyday, beast, verdant and aether waves: five named forms each, all
     hatchable from their own type egg and registered by the same loop. */
  { family: 'normal', stages: ['Mugling', 'Mugguard', 'Hearthkeeper', 'Grand Hearth Titan', 'Everyday Eternal'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'normal', stages: ['Muffpuff', 'Softpuff', 'Cloudpillow', 'Dreamblanket Titan', 'Eternal Softness'], rarity: ['common', 'uncommon', 'rare', 'legendary', 'mythic'] },
  { family: 'beast', stages: ['Pupfluff', 'Loyal Hound', 'Moonhowl Warden', 'Fenrir Prime', 'Eternal Hunt'], rarity: ['common', 'uncommon', 'rare', 'epic', 'mythic'] },
  { family: 'beast', stages: ['Kitpaw', 'Whisker Scout', 'Shadowprowler', 'Saber Sovereign', 'Eternal Prowl'], rarity: ['common', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'verdant', stages: ['Seedpuff', 'Thornbud', 'Bramble Warden', 'Worldroot Colossus', 'Verdant Eternity'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'verdant', stages: ['Fernpuff', 'Sporeling', 'Grovekeeper', 'Elder Mycelia', 'Eternal Canopy'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'aether', stages: ['Glimmerling', 'Prism Mote', 'Aether Wisp', 'Starlight Seraph', 'Aether Eternal'], rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'] },
  { family: 'aether', stages: ['Riftling', 'Voidpetal', 'Dimension Warden', 'Cosmic Rift Titan', 'Eternal Rift'], rarity: ['epic', 'legendary', 'mythic', 'secret', 'ultra_secret'] },
  { family: 'fire', stages: ['Cinder Cub', 'Flaremane', 'Ashguard', 'Solar Pyre Titan', 'Eternal Flame'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'ice', stages: ['Snowbud', 'Frostkit', 'Glacier Warden', 'Aurora Colossus', 'Eternal Winterlight'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'electric', stages: ['Sparkit', 'Voltkit', 'Thunder Warden', 'Storm Emperor', 'Eternal Thunder'], rarity: ['common', 'uncommon', 'rare', 'epic', 'mythic'] },
  { family: 'water', stages: ['Ripple', 'Brooklet', 'Tidewarden', 'Abyss Colossus', 'Eternal Current'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'earth', stages: ['Claypuff', 'Stonebud', 'Canyon Warden', 'Continental Titan', 'Eternal Bedrock'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'wind', stages: ['Gustling', 'Zephyrkit', 'Skywarden', 'Cyclone Emperor', 'Eternal Gale'], rarity: ['common', 'uncommon', 'rare', 'epic', 'mythic'] },
  { family: 'moon', stages: ['Duskling', 'Moonkit', 'Lunar Warden', 'Eclipse Colossus', 'Eternal Moon'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'light', stages: ['Sunmote', 'Dawnkit', 'Lightwarden', 'Radiant Colossus', 'Eternal Dawn'], rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  { family: 'shadow', stages: ['Gloam', 'Shadekit', 'Umbra Warden', 'Void Colossus', 'Eternal Night'], rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'] },
  { family: 'crystal', stages: ['Shardling', 'Geodekit', 'Prism Warden', 'Crystal Colossus', 'Eternal Facet'], rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'] },
  { family: 'dragon', stages: ['Wyrmling', 'Scalebud', 'Drake Warden', 'Wyrm Emperor', 'Eternal Dragon'], rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'] },
  { family: 'cosmic', stages: ['Starwhisk', 'Novakit', 'Galaxy Warden', 'Cosmic Colossus', 'Eternal Cosmos'], rarity: ['rare', 'epic', 'legendary', 'mythic', 'secret'] },
  /* Vault wave: four lines whose first forms are sealed behind the new
     Guardian Vault doors. Their keys are listed in the secret-vault family in
     data-species-families.js just like every other first form. */
  vaultEvolutionLine('aether', ['Vault Glimmer', 'Vault Prism', 'Vault Warden', 'Vault Seraph', 'Vault Eternal']),
  vaultEvolutionLine('crystal', ['Vault Shard', 'Vault Geode', 'Vault Prism Warden', 'Vault Colossus', 'Vault Eternal Facet']),
  vaultEvolutionLine('ice', ['Vault Frost', 'Vault Rime', 'Vault Glacier Warden', 'Vault Aurora Colossus', 'Vault Eternal Winter']),
  vaultEvolutionLine('shadow', ['Vault Gloam', 'Vault Umbra', 'Vault Night Warden', 'Vault Void Colossus', 'Vault Eternal Night']),
];

window.PUFFLE_EVOLUTION_CHAINS = {};

function puffleEvolutionKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

(function registerPuffleEvolutionLines() {
  if (typeof ELEMENTS === 'undefined') return;

  /* Name lookup: an exact display name wins, then a "name without Puffle". */
  const byName = {};
  Object.keys(ELEMENTS).forEach((key) => {
    const name = String(ELEMENTS[key].name || '').trim().toLowerCase();
    if (name && !byName[name]) byName[name] = key;
    const short = name.replace(/\s+puffle$/, '');
    if (short && !byName[short]) byName[short] = key;
  });

  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;

  PUFFLE_EVOLUTION_LINES.forEach((entry) => {
    const stages = entry.stages;
    const familyKey = entry.family;
    const rarity = entry.rarity;
    const first = stages[0];
    const second = stages[1];
    const third = stages[2];
    const fourth = stages[3] || stages[2];
    const fifthName = stages[stages.length - 1];
    const family = PUFFLE_EVOLUTION_FAMILIES[familyKey] || PUFFLE_EVOLUTION_FAMILIES.nature;
    const lookup = String(first).trim().toLowerCase();
    let key = byName[lookup] || byName[lookup.replace(/\s+puffle$/, '')] || null;

    /* A chain's first form has to be hatchable, so an unknown root is added. */
    if (!key) {
      key = `evo_${puffleEvolutionKey(first)}`;
      if (!ELEMENTS[key]) {
        ELEMENTS[key] = {
          name: first,
          primary: family.body,
          light: family.wing,
          deep: family.deep,
          accent: family.eye,
          trait: `${familyKey.charAt(0).toUpperCase() + familyKey.slice(1)} blood — its line runs ${fifthName}.`,
          blurb: `${first} is the first form of the ${familyKey} evolution line, and grows all the way to ${fifthName}.`,
          greeting: 'I am small now. You should see what I become.',
          likes: family.likes,
          puffleStyle: key,
          puffleElement: familyKey.charAt(0).toUpperCase() + familyKey.slice(1),
        };
        if (table && !table[key]) {
          table[key] = {
            hidden: true,
            tier: familyKey === 'secret' ? 'secret' : familyKey === 'rainbow' || familyKey === 'dragon' ? 'mythic' : 'rare',
            name: `${first} Puffle`,
            theme: `First form of the ${familyKey} evolution line.`,
            primary: family.body,
            secondary: family.wing,
            belly: family.wing,
            ear: family.wing,
            iris: family.eye,
            leaf: family.deep,
            leafGlow: family.eye,
            pads: family.wing,
          };
        }
        GENE_POWERS[key] = family.gene;
        TITAN_NAMES[key] = fifthName;
        TYPE_EGG_BASE_PRICE[key] = family.price;
        TYPE_EGG_PRICE[key] = discountedEggPrice(family.price);
        NAME_START[key] = [String(first).split(' ')[0], 'Puffle', 'Puff', 'Tuft'];
        if (!ELEMENT_KEYS.includes(key)) ELEMENT_KEYS.push(key);
        if (typeof TYPE_EGG_SPECIES !== 'undefined' && !TYPE_EGG_SPECIES.includes(key)) TYPE_EGG_SPECIES.push(key);
        if (typeof WILD_SPECIES !== 'undefined' && !WILD_SPECIES.includes(key)) WILD_SPECIES.push(key);
        family.habitats.forEach((scene) => {
          if (SCENES[scene] && !SCENES[scene].species.includes(key)) SCENES[scene].species.push(key);
        });
      }
    }

    window.PUFFLE_EVOLUTION_CHAINS[key] = { key, family: familyKey, stages: stages.slice(), rarity: Array.isArray(rarity) && rarity.length ? rarity : null };
  });

  if (table && typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
})();

window.puffleEvolutionLine = function puffleEvolutionLine(elementKey) {
  return window.PUFFLE_EVOLUTION_CHAINS[elementKey] || null;
};

/* Which of the five named forms a life stage belongs to. The twelve age tiers
   split five ways: baby, then juvenile+sprite, then the three adult tiers, then
   elder+ancient+sensei, then the three ascensions. */
window.puffleEvolutionStageIndex = function puffleEvolutionStageIndex(stage) {
  const order = typeof STAGE_ORDER !== 'undefined' ? STAGE_ORDER : [];
  const index = order.indexOf(stage);
  if (index <= 0) return 0;
  if (index <= 2) return 1;
  if (index <= 5) return 2;
  if (index <= 8) return 3;
  return 4;
};
