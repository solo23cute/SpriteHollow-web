/* Sprite Hollow personality system.
   Every puffle is born with one primary and one secondary personality trait,
   rolled from its own id so a puffle keeps the same character for life. Each
   trait carries the mechanical bonus its card promises, and each element family
   carries the personality, likes and signature behaviour of the design bible. */

window.PUFFLE_PERSONALITY_TRAITS = {
  brave: { key: 'brave', name: 'Brave', icon: '🔥', color: '#FF6B35', bonus: '+10% Attack · +5% Critical Chance', blurb: 'Loves adventure', effect: { atk: 1.1, crit: 0.05 } },
  caring: { key: 'caring', name: 'Caring', icon: '💗', color: '#FF8FB2', bonus: '+10% Healing · +5% Team Support', blurb: 'Protects weaker puffles', effect: { heal: 1.1, support: 0.05 } },
  curious: { key: 'curious', name: 'Curious', icon: '🔍', color: '#FFD166', bonus: '+10% Experience Gain', blurb: 'Constantly discovers secrets', effect: { xp: 1.1 } },
  loyal: { key: 'loyal', name: 'Loyal', icon: '🤝', color: '#7FB3FF', bonus: '+10% Bond Growth · stronger team synergies', blurb: 'Never abandons allies', effect: { bond: 1.1, synergy: 0.1 } },
  playful: { key: 'playful', name: 'Playful', icon: '🎾', color: '#8BE9FF', bonus: '+10% Speed · bonus dodge chance', blurb: 'Loves games and mischief', effect: { spd: 1.1, dodge: 0.05 } },
  wise: { key: 'wise', name: 'Wise', icon: '📖', color: '#B388FF', bonus: '+10% Magic · better status effects', blurb: 'Ancient knowledge', effect: { mag: 1.1, status: 0.1 } },
  energetic: { key: 'energetic', name: 'Energetic', icon: '⚡', color: '#FFE600', bonus: '+15% Stamina · faster skill cooldowns', blurb: 'Always moving', effect: { stamina: 1.15, cooldown: 0.9 } },
  gentle: { key: 'gentle', name: 'Gentle', icon: '🛡️', color: '#9CCC65', bonus: '+10% Defense · increased shield power', blurb: 'Friendly and peaceful', effect: { def: 1.1, shield: 0.1 } },
  mischievous: { key: 'mischievous', name: 'Mischievous', icon: '😈', color: '#AB47BC', bonus: '+10% Debuff Success · trickster abilities', blurb: 'Loves practical jokes', effect: { debuff: 0.1, trick: 0.1 } },
  noble: { key: 'noble', name: 'Noble', icon: '👑', color: '#D4AF37', bonus: '+15% Leadership Aura · team stat buffs', blurb: 'A natural ruler', effect: { aura: 0.15, team: 0.1 } },
};

window.PUFFLE_PERSONALITY_KEYS = Object.keys(window.PUFFLE_PERSONALITY_TRAITS);

window.PUFFLE_FAMILY_LORE = {
  nature: { name: 'Nature', personality: ['Kind', 'Protective', 'Patient', 'Loyal'], likes: ['Forests', 'Flowers', 'Gardening', 'Friends'], signature: 'Protects younger puffles and restores damaged habitats.', look: 'Leaning forward on soft paws, leaf tufts up, eyes half-closed in a patient smile.' },
  fire: { name: 'Fire', personality: ['Bold', 'Competitive', 'Courageous', 'Passionate'], likes: ['Challenges', 'Racing', 'Combat training', 'Volcanoes'], signature: 'Never backs down from a challenge.', look: 'Chest out, chin up, ears swept back like a sprinter at the line.' },
  water: { name: 'Water', personality: ['Calm', 'Friendly', 'Adaptable', 'Caring'], likes: ['Swimming', 'Rain', 'Oceans', 'Teamwork'], signature: 'Can sense emotions through magical water currents.', look: 'Fluid, slow-blinking, fins drifting as if underwater.' },
  ice: { name: 'Ice', personality: ['Quiet', 'Intelligent', 'Observant', 'Elegant'], likes: ['Snow', 'Moonlight', 'Reading', 'Meditation'], signature: 'Thinks before acting and rarely makes mistakes.', look: 'Still and composed, breath fogging, gaze slightly off-centre like it is calculating.' },
  electric: { name: 'Electric', personality: ['Hyperactive', 'Adventurous', 'Impulsive', 'Fun-loving'], likes: ['Racing', 'Flying', 'Speed competitions', 'Exploration'], signature: 'Constantly surrounded by tiny electrical sparks.', look: 'Mid-bounce, ears up, sparks crackling off the fur tips.' },
  earth: { name: 'Earth', personality: ['Reliable', 'Honest', 'Hardworking', 'Protective'], likes: ['Building', 'Mining', 'Crystals', 'Crafting'], signature: 'Serves as protector of ancient ruins.', look: 'Planted wide and low, heavy paws, steady warm eyes.' },
  wind: { name: 'Wind', personality: ['Free-spirited', 'Cheerful', 'Curious', 'Social'], likes: ['Travel', 'Heights', 'Flying', 'New friends'], signature: 'Rarely stays in one place for long.', look: 'Hovering a little off the ground, fur and scarf trailing sideways.' },
  moon: { name: 'Moon', personality: ['Gentle', 'Empathetic', 'Caring', 'Mystical'], likes: ['Stars', 'Dreams', 'Healing', 'Storytelling'], signature: 'Assists lost travellers during the night.', look: 'Soft glow behind it, sleepy lids, tail curled protectively.' },
  light: { name: 'Light', personality: ['Noble', 'Honest', 'Courageous', 'Inspirational'], likes: ['Helping others', 'Leadership', 'Justice', 'Harmony'], signature: 'Natural leaders among Sprite Hollow communities.', look: 'Upright and radiant, halo-warm rim light, confident open smile.' },
  shadow: { name: 'Shadow', personality: ['Independent', 'Clever', 'Secretive', 'Resourceful'], likes: ['Mysteries', 'Puzzles', 'Exploration', 'Hidden areas'], signature: 'Often misunderstood but fiercely loyal.', look: 'Half-lit, one bright eye catching the light, weight shifted back.' },
  cosmic: { name: 'Cosmic', personality: ['Wise', 'Curious', 'Visionary', 'Calm'], likes: ['Stars', 'Space', 'Knowledge', 'Ancient secrets'], signature: 'Can see traces of future possibilities.', look: 'Floating, star freckles, gaze fixed just past the viewer.' },
  crystal: { name: 'Crystal', personality: ['Disciplined', 'Elegant', 'Patient', 'Refined'], likes: ['Gemstones', 'Craftsmanship', 'Beauty', 'Collection'], signature: 'Maintains balance among elemental families.', look: 'Faceted highlights, still posture, perfectly symmetrical stance.' },
  dragon: { name: 'Dragon', personality: ['Proud', 'Brave', 'Powerful', 'Protective'], likes: ['Treasure', 'Training', 'Adventure', 'Competition'], signature: 'Strong guardians of Sprite Hollow.', look: 'Wings half-spread, claws planted, smoke curling from the nostrils.' },
  spirit: { name: 'Spirit', personality: ['Mysterious', 'Wise', 'Compassionate', 'Observant'], likes: ['Ancient knowledge', 'Memories', 'Dreams', 'History'], signature: 'Guides wandering souls safely home.', look: 'Semi-transparent edges, drifting upward, calm downward gaze.' },
  mushroom: { name: 'Mushroom', personality: ['Quirky', 'Cheerful', 'Creative', 'Helpful'], likes: ['Gardening', 'Music', 'Community', 'Forest festivals'], signature: 'Creates magical spores that help other puffles grow.', look: 'Cap tilted, spore dust in the air, delighted little grin.' },
  poison: { name: 'Poison', personality: ['Clever', 'Patient', 'Misunderstood', 'Loyal'], likes: ['Mycelium', 'Green apples', 'Quiet corners', 'Alchemy'], signature: 'Turns decay into new growth and protects the mycelium paths.', look: 'Half-lidded, a faint spore halo, one paw resting on a glowing mushroom.' },
  metal: { name: 'Metal', personality: ['Steady', 'Disciplined', 'Protective', 'Curious'], likes: ['Crystals', 'Gears', 'Crafting', 'Ancient machines'], signature: 'Repairs broken relics and remembers the shape of old machines.', look: 'Polished plates catching the light, ears up, stance planted like a small guardian.' },
  music: { name: 'Music', personality: ['Outgoing', 'Entertaining', 'Creative', 'Friendly'], likes: ['Performing', 'Dance', 'Celebrations', 'Festivals'], signature: 'Can communicate emotions through magical music.', look: 'Mid-sway with visible rhythm, notes curling out of the fur.' },
  time: { name: 'Time', personality: ['Thoughtful', 'Wise', 'Calm', 'Responsible'], likes: ['History', 'Knowledge', 'Research', 'Ancient ruins'], signature: 'Remembers stories from generations past.', look: 'Poised and unhurried, clockwork motes orbiting slowly.' },
  rainbow: { name: 'Rainbow', personality: ['Optimistic', 'Energetic', 'Compassionate', 'Imaginative'], likes: ['Creativity', 'Friendship', 'Discovery', 'Art'], signature: 'Brings harmony between different elemental families.', look: 'Bright prismatic rim, open arms, colours bleeding between fur patches.' },
  creator: { name: 'Creator', personality: ['Wise', 'Compassionate', 'Mysterious', 'Eternal'], likes: ['Balance', 'Creation', 'The Hollow itself'], signature: 'First puffle and guardian of balance.', look: 'Immense and serene, geometry orbiting the body, eyes holding whole constellations.' },
  secret: { name: 'Secret', personality: ['Mysterious', 'Powerful', 'Wise', 'Curious'], likes: ['Hidden places', 'Old magic', 'Constellations', 'Rare friends'], signature: 'Keeps the Hollow’s oldest secrets and shares them only with trusted friends.', look: 'A quiet shimmer at the edges, one knowing glance, colours that never sit still.' },
  classic: { name: 'Classic', personality: ['Cheerful', 'Loyal', 'Playful', 'Adventurous'], likes: ['Propeller caps', 'Snowy days', 'New colours', 'Puffle parades'], signature: 'Wears a different classic colour at every stage and never loses its grin.', look: 'Round and bright, a little cap on top, fur shifting through the classic palette.' },
};

/* The four Creator forms read as four different rulers rather than one god. */
window.PUFFLE_CREATOR_FORMS = {
  prime: { name: 'Sprite Hollow Prime', personality: ['Wise', 'Compassionate', 'Mysterious', 'Eternal'], signature: 'First puffle and guardian of balance.' },
  king: { name: 'Hollow King', personality: ['Brave', 'Noble', 'Protective', 'Determined'], signature: 'Defender of the Sprite Hollow Kingdom.' },
  queen: { name: 'Hollow Queen', personality: ['Elegant', 'Intelligent', 'Caring', 'Diplomatic'], signature: 'Keeper of knowledge and harmony.' },
  universal: { name: 'Universal Prime', personality: ['Omniscient', 'Timeless', 'Benevolent', 'Infinite'], signature: 'Embodiment of all Sprite Hollow life and magic.' },
};

/* Every family rolls from its own four-trait pool, so a Fire Puffle is always
   some mix of bold, restless, proud and loyal while a Moon Puffle leans gentle,
   caring, wise and steadfast. The labels above describe the family; these keys
   are the mechanical traits that actually fight, grow and bond. */
window.PUFFLE_FAMILY_TRAIT_POOLS = {
  nature: ['caring', 'gentle', 'wise', 'loyal'],
  fire: ['brave', 'energetic', 'noble', 'loyal'],
  water: ['wise', 'caring', 'playful', 'gentle'],
  ice: ['wise', 'curious', 'gentle', 'noble'],
  electric: ['energetic', 'brave', 'mischievous', 'playful'],
  earth: ['loyal', 'noble', 'gentle', 'wise'],
  wind: ['playful', 'curious', 'caring', 'energetic'],
  moon: ['gentle', 'caring', 'wise', 'loyal'],
  light: ['noble', 'loyal', 'brave', 'caring'],
  shadow: ['mischievous', 'curious', 'wise', 'loyal'],
  cosmic: ['wise', 'curious', 'noble', 'gentle'],
  crystal: ['noble', 'wise', 'gentle', 'loyal'],
  dragon: ['noble', 'brave', 'gentle', 'loyal'],
  spirit: ['wise', 'caring', 'curious', 'gentle'],
  mushroom: ['playful', 'energetic', 'curious', 'caring'],
  poison: ['mischievous', 'wise', 'gentle', 'loyal'],
  metal: ['loyal', 'noble', 'gentle', 'curious'],
  music: ['playful', 'energetic', 'caring', 'mischievous'],
  time: ['wise', 'gentle', 'loyal', 'noble'],
  rainbow: ['playful', 'energetic', 'caring', 'curious'],
  creator: ['wise', 'caring', 'curious', 'noble'],
  secret: ['curious', 'brave', 'wise', 'mischievous'],
  classic: ['playful', 'loyal', 'caring', 'brave'],
};

window.PUFFLE_CREATOR_TRAIT_POOLS = {
  prime: ['wise', 'caring', 'curious', 'noble'],
  king: ['brave', 'noble', 'gentle', 'loyal'],
  queen: ['wise', 'caring', 'noble', 'gentle'],
  universal: ['noble', 'wise', 'curious', 'energetic'],
};

/* Skills are rolled from a family pool too. Each family keeps a handful that
   suit its element, so two Puffles of one species still differ but never feel
   like they wandered in from another biome. TRAIT_SKILLS owns the art and copy;
   these names only pick from it. */
window.PUFFLE_FAMILY_SKILL_POOLS = {
  nature: ['Quick Nose', 'Root Guard', 'Songbird', 'Spore Bloom'],
  classic: ['Quick Nose', 'Lucky Tuft', 'Soft Step', 'Songbird'],
  fire: ['Ember Dash', 'Keen Eye', 'Sturdy Puff', 'Lucky Tuft'],
  water: ['Riptide Roll', 'Soft Step', 'Songbird', 'Deep Nap'],
  ice: ['Frost Focus', 'Deep Nap', 'Sturdy Puff', 'Keen Eye'],
  electric: ['Static Pounce', 'Soft Step', 'Lucky Tuft', 'Keen Eye'],
  earth: ['Root Guard', 'Sturdy Puff', 'Gear Tinker', 'Quick Nose'],
  wind: ['Gale Glide', 'Soft Step', 'Lucky Tuft', 'Keen Eye'],
  moon: ['Moonbeam Mend', 'Songbird', 'Deep Nap', 'Warm Glow'],
  light: ['Prism Flash', 'Songbird', 'Lucky Tuft', 'Sturdy Puff'],
  shadow: ['Shade Step', 'Soft Step', 'Keen Eye', 'Lucky Tuft'],
  cosmic: ['Star Song', 'Warm Glow', 'Deep Nap', 'Keen Eye'],
  crystal: ['Prism Flash', 'Frost Focus', 'Sturdy Puff', 'Keen Eye'],
  dragon: ['Dragon Guard', 'Ember Dash', 'Sturdy Puff', 'Keen Eye'],
  spirit: ['Star Song', 'Moonbeam Mend', 'Soft Step', 'Songbird'],
  mushroom: ['Spore Bloom', 'Songbird', 'Quick Nose', 'Lucky Tuft'],
  poison: ['Spore Bloom', 'Shade Step', 'Soft Step', 'Keen Eye'],
  metal: ['Gear Tinker', 'Sturdy Puff', 'Frost Focus', 'Deep Nap'],
  music: ['Encore', 'Songbird', 'Prism Flash', 'Lucky Tuft'],
  time: ['Star Song', 'Deep Nap', 'Frost Focus', 'Keen Eye'],
  rainbow: ['Prism Flash', 'Lucky Tuft', 'Songbird', 'Gale Glide'],
  creator: ['Star Song', 'Prism Flash', 'Dragon Guard', 'Warm Glow'],
  secret: ['Star Song', 'Prism Flash', 'Shade Step', 'Keen Eye'],
};

/* A theme is the little visual story a Puffle is born with: the colours its
   fur seems to catch and the scenery that follows it around. Themes are cosmetic
   identity, rolled once per sprite and then fixed, like its face. */
window.PUFFLE_THEMES = {
  grove: { key: 'grove', name: 'Grove', icon: '🌿', colors: ['#5FC24B', '#9BE07A', '#2F6B31'], desc: 'Mossy greens, drifting pollen and the hush of old trees.' },
  blossom: { key: 'blossom', name: 'Blossom', icon: '🌸', colors: ['#FF9BC2', '#FFD1E3', '#8E4A6B'], desc: 'Petal pinks and a warm spring breeze.' },
  honey: { key: 'honey', name: 'Honey', icon: '🍯', colors: ['#FFC64B', '#FFE4A3', '#9A5B12'], desc: 'Golden light, slow afternoons and a faint sweetness.' },
  mist: { key: 'mist', name: 'Mist', icon: '🌫️', colors: ['#B9D6D8', '#E8F5F4', '#55787C'], desc: 'Soft grey-blue fog that softens every edge.' },
  ember: { key: 'ember', name: 'Ember', icon: '🔥', colors: ['#FF7A3D', '#FFC46B', '#8F2D0F'], desc: 'Warm cinders and a glow that never quite goes out.' },
  ashen: { key: 'ashen', name: 'Ashen', icon: '🌋', colors: ['#7C7A78', '#B9B3AC', '#3B3432'], desc: 'Cool ash, dark stone and a smouldering quiet.' },
  forge: { key: 'forge', name: 'Forge', icon: '⚒️', colors: ['#E0A34A', '#F7D08A', '#6B3A16'], desc: 'Hammered copper and the smell of a workshop.' },
  carnival: { key: 'carnival', name: 'Carnival', icon: '🎪', colors: ['#FF5C8A', '#FFD166', '#5B2A86'], desc: 'Bright tents, confetti and a tune you almost remember.' },
  tide: { key: 'tide', name: 'Tide', icon: '🌊', colors: ['#3FB8D9', '#A8E8F5', '#155A73'], desc: 'Cool aqua, moving light and a long shoreline breath.' },
  coral: { key: 'coral', name: 'Coral', icon: '🪸', colors: ['#FF7F6B', '#FFC2A8', '#8F3A3A'], desc: 'Reef oranges and pinks with a little salt in the air.' },
  storm: { key: 'storm', name: 'Storm', icon: '⛈️', colors: ['#5C6BC0', '#AAB6FF', '#2A2D5E'], desc: 'Rain-dark blue and the charge before thunder.' },
  frost: { key: 'frost', name: 'Frost', icon: '❄️', colors: ['#9AD7FF', '#E8F8FF', '#3A6B86'], desc: 'Pale ice, crisp air and a faint crystal shine.' },
  aurora: { key: 'aurora', name: 'Aurora', icon: '🌌', colors: ['#6FE3C1', '#A98CFF', '#1E3A5F'], desc: 'Ribbons of green and violet across a night sky.' },
  crystal: { key: 'crystal', name: 'Crystal', icon: '💎', colors: ['#9FB8FF', '#E3ECFF', '#4A5B9E'], desc: 'Faceted blues and a clean, ringing stillness.' },
  neon: { key: 'neon', name: 'Neon', icon: '💡', colors: ['#FF4FD8', '#5CF2FF', '#2A1240'], desc: 'Electric pink and cyan buzzing after dark.' },
  sky: { key: 'sky', name: 'Sky', icon: '🕊️', colors: ['#8FD3FF', '#E6F6FF', '#3D7EA6'], desc: 'Open blue, high clouds and room to move.' },
  dream: { key: 'dream', name: 'Dream', icon: '💤', colors: ['#B79CFF', '#E8DCFF', '#4A2A7A'], desc: 'Lavender haze and the feeling of a half-remembered dream.' },
  starlight: { key: 'starlight', name: 'Starlight', icon: '⭐', colors: ['#FFE58A', '#FFF6C9', '#5A4A8A'], desc: 'Tiny gold stars caught in deep indigo.' },
  dawn: { key: 'dawn', name: 'Dawn', icon: '🌅', colors: ['#FFB36B', '#FFE1C2', '#7A4A8F'], desc: 'Peach light and the first warm minute of the day.' },
  dusk: { key: 'dusk', name: 'Dusk', icon: '🌆', colors: ['#C77DFF', '#FFB3D9', '#3B1F5C'], desc: 'Violet shadows and the last pink of sunset.' },
  shadow: { key: 'shadow', name: 'Shadow', icon: '🌑', colors: ['#6B5B95', '#B3A6D9', '#201A33'], desc: 'Deep violet dusk and quiet footsteps.' },
  prism: { key: 'prism', name: 'Prism', icon: '🌈', colors: ['#FF6B8A', '#6BE3FF', '#FFE58A'], desc: 'Split light scattering every colour at once.' },
  nebula: { key: 'nebula', name: 'Nebula', icon: '🌠', colors: ['#8B5CF6', '#FF6FA8', '#1B1440'], desc: 'Star clouds, comet dust and impossible distances.' },
  spore: { key: 'spore', name: 'Spore', icon: '🍄', colors: ['#C77DBA', '#E8C7E3', '#5E3A63'], desc: 'Soft violet caps and drifting mushroom dust.' },
  clockwork: { key: 'clockwork', name: 'Clockwork', icon: '⚙️', colors: ['#C9A66B', '#EFDDB8', '#5C4326'], desc: 'Brass gears, patient ticking and old stories.' },
};
window.PUFFLE_THEME_KEYS = Object.keys(window.PUFFLE_THEMES);

window.PUFFLE_FAMILY_THEME_POOLS = {
  nature: ['grove', 'blossom', 'honey', 'mist'],
  classic: ['frost', 'carnival', 'neon', 'sky'],
  fire: ['ember', 'ashen', 'forge', 'carnival'],
  water: ['tide', 'mist', 'coral', 'storm'],
  ice: ['frost', 'aurora', 'crystal', 'mist'],
  electric: ['storm', 'neon', 'carnival', 'aurora'],
  earth: ['grove', 'forge', 'crystal', 'ashen'],
  wind: ['sky', 'mist', 'storm', 'blossom'],
  moon: ['dream', 'starlight', 'mist', 'tide'],
  light: ['dawn', 'aurora', 'starlight', 'prism'],
  shadow: ['dusk', 'shadow', 'neon', 'ashen'],
  cosmic: ['starlight', 'nebula', 'aurora', 'dream'],
  crystal: ['crystal', 'prism', 'frost', 'dawn'],
  dragon: ['ember', 'forge', 'storm', 'ashen'],
  spirit: ['mist', 'dream', 'dusk', 'starlight'],
  mushroom: ['spore', 'grove', 'honey', 'blossom'],
  poison: ['spore', 'ashen', 'shadow', 'mist'],
  metal: ['forge', 'clockwork', 'crystal', 'storm'],
  music: ['carnival', 'neon', 'dawn', 'dream'],
  time: ['clockwork', 'starlight', 'dusk', 'crystal'],
  rainbow: ['prism', 'aurora', 'carnival', 'dawn'],
  creator: ['nebula', 'dawn', 'prism', 'starlight'],
  secret: ['nebula', 'prism', 'aurora', 'shadow'],
};

/* Two traits per puffle: the roll is seeded from the id so it never changes, and
   the second pick skips the first so a puffle is never "brave and brave". */
/* Family resolution is deliberately forgiving: the element may map directly, or
   only its evolution chain may know the family, and creator forms are recognised
   by name so the four rulers are reachable. */
function personalityFamilyKey(sprite) {
  const el = sprite && sprite.element;
  const chain = typeof window.puffleEvolutionLine === 'function' ? window.puffleEvolutionLine(el) : null;
  let key = typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(el) : null;
  if (!key && chain) key = chain.family;
  if (chain && chain.family === 'creator') key = 'creator';
  const label = `${el || ''} ${(chain && chain.family) || ''} ${(chain && chain.key) || ''}`;
  if (/creator|universal|prime/i.test(label)) key = 'creator';
  return key;
}
window.personalityFamilyKey = personalityFamilyKey;

function puffleTraitPool(familyKey) {
  const pools = window.PUFFLE_FAMILY_TRAIT_POOLS || {};
  const traits = window.PUFFLE_PERSONALITY_TRAITS || {};
  const pool = (pools[familyKey] || window.PUFFLE_PERSONALITY_KEYS || [])
    .filter((key) => !!traits[key]);
  return pool.length ? pool : (window.PUFFLE_PERSONALITY_KEYS || []);
}

window.pufflePersonalityFor = function pufflePersonalityFor(sprite) {
  const traits = window.PUFFLE_PERSONALITY_TRAITS;
  const keys = window.PUFFLE_PERSONALITY_KEYS;
  const familyKey = personalityFamilyKey(sprite) || 'nature';
  const family = window.PUFFLE_FAMILY_LORE[familyKey] || window.PUFFLE_FAMILY_LORE.nature;
  let h = 2166136261;
  const text = String((sprite && sprite.id) || 'puffle');
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const form = sprite && sprite.stage ? window.puffleEvolutionStageIndex(sprite.stage) : 0;
  let pool = puffleTraitPool(familyKey);
  let ruler = null;
  if (familyKey === 'creator') {
    const stageKey = form >= 4 ? 'universal' : form >= 1 ? ((h >>> 5) % 2 ? 'king' : 'queen') : 'prime';
    const rulerForm = window.PUFFLE_CREATOR_FORMS[stageKey];
    ruler = rulerForm.name;
    pool = (window.PUFFLE_CREATOR_TRAIT_POOLS[stageKey] || pool).filter((key) => !!traits[key]);
    const primary = traits[pool[h % pool.length]] || traits[keys[h % keys.length]];
    const rest = pool.filter((k) => k !== primary.key);
    const secondary = traits[rest[(h >>> 9) % rest.length]] || traits[keys.filter((k) => k !== primary.key)[(h >>> 9) % (keys.length - 1)]];
    return { primary, secondary, familyKey, pool, lore: { ...family, name: rulerForm.name, personality: rulerForm.personality, signature: rulerForm.signature }, ruler };
  }
  const primary = traits[pool[h % pool.length]] || traits[keys[h % keys.length]];
  const rest = pool.filter((k) => k !== primary.key);
  const fallback = keys.filter((k) => k !== primary.key);
  const secondary = traits[rest[(h >>> 9) % rest.length]] || traits[fallback[(h >>> 9) % fallback.length]];
  return { primary, secondary, familyKey, pool, lore: family };
};

/* Themes roll from their own hash, so a Puffle's coat story is independent of
   its personality roll instead of always moving in lockstep with it. */
function puffleThemeKeyFromText(text, familyKey) {
  const themes = window.PUFFLE_THEMES || {};
  const pools = window.PUFFLE_FAMILY_THEME_POOLS || {};
  const pool = (pools[familyKey] || window.PUFFLE_THEME_KEYS || []).filter((key) => !!themes[key]);
  const candidates = pool.length ? pool : (window.PUFFLE_THEME_KEYS || []);
  if (!candidates.length) return null;
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return candidates[(h >>> 7) % candidates.length];
}

window.puffleThemeKeyFor = function puffleThemeKeyFor(element, id) {
  const sprite = { element, id: id || 'puffle' };
  const familyKey = personalityFamilyKey(sprite) || 'nature';
  return puffleThemeKeyFromText(`${id || 'puffle'}|theme|${element || ''}`, familyKey);
};

window.puffleThemeFor = function puffleThemeFor(sprite) {
  const themes = window.PUFFLE_THEMES || {};
  const familyKey = personalityFamilyKey(sprite) || 'nature';
  const stored = sprite && typeof sprite.theme === 'string' ? sprite.theme : null;
  const key = stored && themes[stored]
    ? stored
    : puffleThemeKeyFromText(`${(sprite && sprite.id) || 'puffle'}|theme|${(sprite && sprite.element) || ''}`, familyKey);
  const theme = themes[key] || Object.values(themes)[0];
  if (!theme) return null;
  const family = window.PUFFLE_FAMILY_LORE[familyKey];
  return { ...theme, familyKey, familyName: family ? family.name : 'Sprite Hollow' };
};


/* One combined multiplier set for a sprite: both personality traits plus its
   rolled skill, in the same shape spriteEffects understands. XP, need decay,
   coins and bond all read that object, so these numbers change real outcomes. */
window.spriteTraitMods = function spriteTraitMods(sprite) {
  const mods = {
    xp: 1, petBond: 1, hungerDecay: 1, energyDecay: 1, joyDecay: 1, cleanDecay: 1,
    atk: 1, mag: 1, def: 1, spd: 1, crit: 0, winChance: 0,
  };
  const merge = (effect) => {
    if (!effect) return;
    if (effect.xp) mods.xp *= effect.xp;
    if (effect.bond) mods.petBond *= effect.bond;
    if (effect.petBond) mods.petBond *= effect.petBond;
    if (effect.hungerDecay) mods.hungerDecay *= effect.hungerDecay;
    if (effect.energyDecay) mods.energyDecay *= effect.energyDecay;
    if (effect.joyDecay) mods.joyDecay *= effect.joyDecay;
    if (effect.cleanDecay) mods.cleanDecay *= effect.cleanDecay;
    if (effect.atk) mods.atk *= effect.atk;
    if (effect.mag) mods.mag *= effect.mag;
    if (effect.def) mods.def *= effect.def;
    if (effect.spd) mods.spd *= effect.spd;
    if (effect.crit) mods.crit += effect.crit;
    if (effect.winChance) mods.winChance += effect.winChance;
    if (effect.dodge) mods.dodge = (mods.dodge || 0) + effect.dodge;
  };
  const personality = window.pufflePersonalityFor(sprite);
  [personality.primary, personality.secondary].forEach((trait) => merge(trait && trait.effect));
  if (typeof spriteTraits === 'function') {
    const face = spriteTraits(sprite);
    const skill = face && face.ability && window.PUFFLE_SKILL_EFFECTS ? window.PUFFLE_SKILL_EFFECTS[face.ability.name] : null;
    merge(skill);
  }
  /* The chosen ability branch (and any mastery layered on it) fights here too,
     so two Puffles of one species can be genuinely different builds. */
  if (typeof window.abilityPathMods === 'function') merge(window.abilityPathMods(sprite));
  return mods;
};

/* ---------------- Sprite Hollow voices ----------------
   Eight role personalities give every Sprite Puffle a spoken voice: how it greets
   you, what it mutters while it works, and what it says once it trusts you. The
   mechanical traits pick the voice, four families lean creative by nature, and
   every line is chosen from an id hash so one puffle keeps its own greeting. */

window.PUFFLE_VOICE_TYPES = {
  cheerful: {
    key: 'cheerful', name: 'Cheerful', icon: '🌟',
    loves: ['making friends', 'giving gifts', 'parties'],
    lines: {
      greet: ["Hi friend! Isn't today amazing? Let's go explore together!", 'You came! I planned our whole day. It is mostly snacks.'],
      idle: ['I made a party in my head and you are invited.', 'I counted the clouds today. There were eleven. Then twelve.'],
      friend: ['You came back! I saved you the best spot.', 'I told everyone you were coming. Everyone.'],
      best: ['Best friends forever! I already told the whole village.', 'Being near you is my favourite hobby.'],
      quest: ['Ooh, a quest! I already packed snacks.', 'We are going to be so good at this. Probably!'],
      hatch: ["Hi! Is this the world? I love it already.", "Oh! You are my person? Excellent choice, both of us."],
      grow: ["Look at me! I grew! Do I look taller? I feel taller!", "Every stage is my favourite stage. This one especially."],
    },
  },
  clever: {
    key: 'clever', name: 'Clever', icon: '🧠',
    loves: ['puzzles', 'inventing gadgets', 'discovering secrets'],
    lines: {
      greet: ["Hmm... I think there's a hidden switch somewhere nearby.", 'Wait. Stand there. No — there. Perfect. You stepped on it.'],
      idle: ['I am counting something. Do not distract me. Okay, distract me.', 'There is a pattern in the wind today. It is very inefficient.'],
      friend: ['I solved it. Four seconds. I counted.', 'I built you a thing. It only sparks a little. Mostly.'],
      best: ['I trust you with my prototypes. That is the highest honour I have.', 'Together we could take this whole valley apart and improve it.'],
      quest: ['I read the whole quest board. Twice. There is a shortcut.', 'Give me a minute. I am solving it in my head first.'],
      hatch: ["Fascinating. The air out here has texture.", "I have arrived. I have opinions about the nest already."],
      grow: ["More of me to think with. Dangerous, honestly.", "Growth is just data in a nicer shape. Look at my data."],
    },
  },
  brave: {
    key: 'brave', name: 'Brave', icon: '🛡️',
    loves: ['charging into danger', 'protecting others', 'leading adventures'],
    lines: {
      greet: ["Don't worry! I'll keep everyone safe.", 'Good. You are here. I was about to do something reckless alone.'],
      idle: ['I scouted the path ahead. Twice. It is still there.', 'I am not scared. I am prepared. There is a difference.'],
      friend: ['Stand behind me. I mean it.', 'If anything comes through that door, it deals with me first.'],
      best: ['Wherever you go, I go first.', 'I would take a hit for you. I have, actually. You were asleep.'],
      quest: ['Then we go. I will stand in front.', 'A guardian? Good. I was getting bored.'],
      hatch: ["I am ready. Whatever it is, I am ready.", "The shell is gone. Good. It was getting tight."],
      grow: ["Bigger. Stronger. Still not scared of anything.", "I grew into the job. I hope the job is ready."],
    },
  },
  kind: {
    key: 'kind', name: 'Kind', icon: '🌸',
    loves: ['helping injured Puffles', 'gardening', 'encouragement'],
    lines: {
      greet: ['Every Puffle deserves a chance to grow and shine.', 'Come in. You look like you have been carrying something heavy.'],
      idle: ['The garden is doing better today. So am I.', 'I left water out for the little ones. They know where it is.'],
      friend: ['You look tired. Sit down, I will bring you something.', 'You did well today. You do not have to be told, but you did.'],
      best: ['You are my favourite thing to take care of.', 'When you are happy, the whole valley looks greener to me.'],
      quest: ['Someone needs help. That is all I needed to hear.', 'We will be gentle, and we will still win.'],
      hatch: ["Hello. You look kind. I am glad it is you.", "I hope I am not too small for all this. I will grow."],
      grow: ["I grew. I hope I grew kinder too.", "There is more of me now. More room for everyone."],
    },
  },
  creative: {
    key: 'creative', name: 'Creative', icon: '🎨',
    loves: ['decorating homes', 'creating artwork', 'designing festivals'],
    lines: {
      greet: ['Imagine how beautiful this village could become!', 'I redid the square last night. Do not ask where the old bench went.'],
      idle: ['I had an idea. It is mostly ribbons. It is perfect.', 'The colours are wrong today. I am fixing them. Politely.'],
      friend: ['I made you something. Do not look at the back.', 'You are very good at standing still while I decorate you.'],
      best: ['Everything I make has a little bit of you in it now.', 'One day I will design a festival just for you. It will have lanterns.'],
      quest: ['I have an idea. It involves ribbons and possibly fire.', 'The plan is a work in progress. The confidence is final.'],
      hatch: ["Oh, the colours out here! I have ideas already.", "I hatched with a whole song in my head. Give me a minute."],
      grow: ["New shape, new colours, new ideas. This is my best work yet.", "I grew into a slightly better version of the song."],
    },
  },
  playful: {
    key: 'playful', name: 'Playful', icon: '🤪',
    loves: ['pranks', 'starting games', 'making everyone laugh'],
    lines: {
      greet: ['Race you to the waterfall! Last one there buys berry juice!', 'I hid your favourite thing. You will find it. Eventually. Probably.'],
      idle: ['Tag! You are it! No take-backs!', 'I put a tiny hat on something. You will see it later and laugh.'],
      friend: ['You are my favourite person to annoy.', 'I saved you the seat next to the mud pit. On purpose.'],
      best: ['You laugh at my worst jokes. That is real friendship.', 'Best friends get first pick of the pranks. You get the good ones.'],
      quest: ['Last one to the guardian is a rotten berry!', 'I hid a shortcut somewhere. Possibly behind me.'],
      hatch: ["Hello hello hello! What are we playing?", "I am out! Now what is the first game?"],
      grow: ["I am bigger! Now I can win at even more games!", "New size, same nonsense. Some things never change."],
    },
  },
  mysterious: {
    key: 'mysterious', name: 'Mysterious', icon: '🌙',
    loves: ['riddles', 'hidden lore', 'appearing unexpectedly'],
    lines: {
      greet: ['The shadows hide many secrets... if you know where to look.', 'I was here before you arrived. I may still be here after.'],
      idle: ['Some doors only open when nobody is watching. So: look away.', 'The old stories are true. The new ones are truer.'],
      friend: ['There is something I could tell you. Not today.', 'You ask better questions than you did last season.'],
      best: ['You have earned the truth. Ask me anything.', 'I will tell you the last secret when the tree blooms again.'],
      quest: ['The path already knows us. Walk quietly.', 'Some doors only open for the patient.'],
      hatch: ["So this is the Hollow. It has been expecting me.", "I remember light. I do not remember anything else. Yet."],
      grow: ["The Hollow gave me another shape. It keeps its secrets.", "I remember more now. I am not telling yet."],
    },
  },
  noble: {
    key: 'noble', name: 'Noble', icon: '👑',
    loves: ['protecting villages', 'inspiring others', 'leadership'],
    lines: {
      greet: ['Together we stand stronger than any storm.', 'You arrive at a good moment. The village needs steady paws.'],
      idle: ['The village is quiet. Good. Let it stay that way.', 'A leader listens first. I am practising.'],
      friend: ['You have my word, and my shield.', 'Stand with me at the gate tonight. I would like the company.'],
      best: ['When the story is told, your name stands beside mine.', 'Whatever the Hollow asks of us, we answer together.'],
      quest: ['The Hollow asked. We answer.', 'Steady. We finish what we start.'],
      hatch: ["I arrive. You may announce me. Or just hug me, that works.", "A fitting nest for someone of my potential, I think."],
      grow: ["A new form suits me. I have decided.", "Growth is simply the world catching up to me."],
    },
  },
};
window.PUFFLE_VOICE_KEYS = Object.keys(window.PUFFLE_VOICE_TYPES);

/* Mechanical traits speak as the role they resemble. */
window.PUFFLE_VOICE_BY_TRAIT = {
  brave: 'brave', energetic: 'cheerful', caring: 'kind', gentle: 'kind',
  curious: 'clever', wise: 'mysterious', noble: 'noble', loyal: 'noble',
  playful: 'playful', mischievous: 'playful',
};

/* Families whose whole craft is making things speak in the creative voice
   before any trait is consulted. */
window.PUFFLE_VOICE_FAMILIES = { music: 'creative', crystal: 'creative', rainbow: 'creative', mushroom: 'creative', aether: 'creative' };

function puffleVoiceHash(seed) {
  let h = 2166136261;
  const text = String(seed == null ? '' : seed);
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

window.puffleVoiceOf = function puffleVoiceOf(sprite) {
  const element = sprite && sprite.element;
  const family = typeof window.puffleFamilyOf === 'function' ? window.puffleFamilyOf(element) : null;
  const familyVoice = family && window.PUFFLE_VOICE_FAMILIES[family];
  if (familyVoice && window.PUFFLE_VOICE_TYPES[familyVoice]) return window.PUFFLE_VOICE_TYPES[familyVoice];
  const rolled = typeof window.pufflePersonalityFor === 'function' ? window.pufflePersonalityFor(sprite) : null;
  const traits = [rolled && rolled.primary && rolled.primary.key, rolled && rolled.secondary && rolled.secondary.key]
    .filter(Boolean);
  for (let i = 0; i < traits.length; i += 1) {
    const voice = window.PUFFLE_VOICE_BY_TRAIT[traits[i]];
    if (voice && window.PUFFLE_VOICE_TYPES[voice]) return window.PUFFLE_VOICE_TYPES[voice];
  }
  return window.PUFFLE_VOICE_TYPES.cheerful;
};

window.puffleVoiceLine = function puffleVoiceLine(sprite, beat) {
  const voice = window.puffleVoiceOf(sprite);
  const lines = voice && voice.lines && voice.lines[beat || 'greet'];
  if (!Array.isArray(lines) || !lines.length) return null;
  const seed = `${(sprite && sprite.id) || (sprite && sprite.element) || 'puffle'}:${beat || 'greet'}`;
  return lines[puffleVoiceHash(seed) % lines.length];
};

/* Relationship ladder. Bond runs 0-100 on a sprite, so each rung is a real
   threshold a player can see move. */
window.PUFFLE_RELATIONSHIP_TIERS = [
  { key: 'stranger', name: 'Stranger', min: 0, line: 'Hello.' },
  { key: 'acquaintance', name: 'Acquaintance', min: 10, line: 'Nice to see you again.' },
  { key: 'friend', name: 'Friend', min: 25, line: "Let's hang out together!" },
  { key: 'close', name: 'Close Friend', min: 45, line: "I'm always happy when you're around." },
  { key: 'best', name: 'Best Friend', min: 70, line: "You'll always have a place beside me." },
  { key: 'partner', name: 'Partner', min: 88, line: 'No adventure would be complete without you.' },
  { key: 'family', name: 'Family', min: 97, line: 'Home is wherever we are together.' },
];

window.relationshipTierFor = function relationshipTierFor(bond) {
  const value = Math.max(0, Math.min(100, Number(bond) || 0));
  const tiers = window.PUFFLE_RELATIONSHIP_TIERS;
  let tier = tiers[0];
  tiers.forEach((entry) => { if (value >= entry.min) tier = entry; });
  return tier;
};

/* The bond ladder in its own words. A puffle that has known you long enough
   says so unprompted, so a tier chip is something the sprite can talk about
   rather than a number only the sheet knows. */
/* A trait is mechanical, but it should also be audible: two puffles sharing one
   role voice still speak differently if their personalities differ. */
window.PUFFLE_QUIRK_LINES = {
  brave: ["I am not scared. I am just very awake.", "Stand behind me. Actually, stand beside me. We are both brave."],
  caring: ["Did you eat? You always ask me that, so I am asking you.", "I kept a warm spot for you in case you came back."],
  curious: ["I have three questions. The first one is about you.", "I found a new path today. It goes somewhere. That is all I know."],
  loyal: ["I would follow you into the mycelium. I have said it before and I mean it.", "You came back. I never doubted it. I doubted it a little."],
  playful: ["I hid something of yours. You will find it. Eventually. It is a game.", "Race you to the next sentence."],
  wise: ["Every Hollow has an oldest story. I am still deciding which one is mine.", "Patience is just a very slow kind of speed."],
  energetic: ["I have been awake for a while and I have SO much to say.", "Let us do three things at once. I will do the fourth."],
  gentle: ["Mind the little ones today. They are smaller than they look.", "I am glad nothing is wrong. I like it when nothing is wrong."],
  mischievous: ["Something moved. It was me. I am not sorry.", "I have a plan. You will like it. Probably."],
  noble: ["A keeper should walk like the Hollow is watching. It is.", "I have decided we are doing great. The decision is final."],
};

window.puffleQuirkLine = function puffleQuirkLine(sprite) {
  const p = typeof window.pufflePersonalityFor === 'function' ? window.pufflePersonalityFor(sprite) : null;
  const key = p && p.primary && p.primary.key;
  const bank = key && window.PUFFLE_QUIRK_LINES[key];
  if (!Array.isArray(bank) || !bank.length) return null;
  const seed = `${(sprite && sprite.id) || 'puffle'}:quirk:${key}`;
  return bank[puffleVoiceHash(seed) % bank.length];
};
window.PUFFLE_TIER_LINES = {
  stranger: ["You're the keeper, right? I have seen you around. I am watching. Politely.", 'I do not know you yet. Give it time. I am worth it.'],
  acquaintance: ["Oh, it's you. Hello again.", 'I remembered your face. That is a good sign, I think.'],
  friend: ['Hey! I was hoping you would come by.', 'Friends check on friends. You are doing great at it.'],
  close: ['You are back. The day just got better.', 'I saved you a spot. I always save you a spot.'],
  best: ['There you are, my favourite person.', 'You know me better than anyone. That is a big deal to me.'],
  partner: ['No adventure is complete without you. I checked.', 'Where you go, I go. I made that a rule.'],
  family: ['Home is wherever we are together.', 'You are not just my keeper. You are my family.'],
};

window.puffleTierLine = function puffleTierLine(sprite, tierKey) {
  const key = tierKey
    || (typeof window.relationshipTierFor === 'function' ? window.relationshipTierFor(sprite && sprite.bond).key : 'stranger');
  const bank = window.PUFFLE_TIER_LINES[key];
  if (!Array.isArray(bank) || !bank.length) return null;
  const seed = `${(sprite && sprite.id) || 'puffle'}:tier:${key}`;
  return bank[puffleVoiceHash(seed) % bank.length];
};

/* What a puffle says about what you have done together, the weather and the
   hour. Context is picked by the caller, the line by a stable hash. */
window.PUFFLE_VOICE_CONTEXT = {
  helped: ['Thank you for helping our village yesterday!', 'You did not have to help. You did anyway. I noticed.'],
  gifts: ['I still treasure the gift you gave me.', 'I keep it by my bed. Do not tell the others.'],
  ignored: ["Oh... hello again. It's been a while.", "I saved you a seat. It got cold. I saved it anyway."],
  festival: ['This is my favorite day of the year!', 'Festival day! I have been practising my parade walk.'],
  rain: ['Perfect weather for puddle jumping!', 'Rain means the gardens are drinking. Listen to them.'],
  snow: ["Let's build a snow-puffle!", 'Snow day. My paws are cold. I do not care.'],
};

window.contextVoiceLine = function contextVoiceLine(kind, seed) {
  const lines = window.PUFFLE_VOICE_CONTEXT[kind];
  if (!Array.isArray(lines) || !lines.length) return null;
  return lines[puffleVoiceHash(`${seed || 'puffle'}:${kind}`) % lines.length];
};

/* The named cast of Sprite Hollow. `region` ties each voice to a travel scene, so
   a region's leader speaks on that region's species pages. `leader` marks the
   voice that speaks for a region; enemies carry encounter/defeated beats, and
   both are read through voiceLeaderForScene and voiceEnemiesForScene. */
window.SPRITE_HOLLOW_VOICES = [
  {
    id: 'lumora', name: 'Grand Guardian Lumora', icon: '👑', leader: true,
    role: 'Keeper of the Worldheart Tree', region: 'worldheart', species: 'Omnitype Sprite Puffle', voice: 'noble',
    about: 'Wise, gentle, ancient, loving.',
    beats: {
      greet: 'Welcome, little Sprite Keeper. The Worldheart has been expecting you.',
      quest: 'Balance grows from kindness, courage, and friendship. Your journey begins now.',
      friend: 'You are no longer a visitor to Sprite Hollow. You are family.',
      final: 'Even the smallest spark can illuminate an entire world.',
    },
  },
  {
    id: 'thornroot', name: 'Elder Thornroot', icon: '🌳', leader: true, role: 'Leader of Bloomroot Valley',
    region: 'bloomroot', species: 'Titanroot Puffle', voice: 'noble', about: 'Slow, rooted, patient.', companion: '{name} listens to the roots already. The Hollow notices that.',
    beats: {
      greet: 'Slow down, young one. Even mighty trees start as tiny seeds.',
      done: 'Patience has rewarded your efforts.',
    },
  },
  {
    id: 'emberflare', name: 'Queen Emberflare', icon: '🔥', leader: true, role: 'Leader of Emberpeak Highlands',
    region: 'emberpeak', species: 'Fire Puffle', voice: 'noble', about: 'Fierce, proud, protective.', companion: 'A {family} at your side, {name}? Then the mountain will behave.',
    beats: {
      greet: 'Show me your courage!',
      challenge: 'True strength comes from protecting others.',
    },
  },
  {
    id: 'tidewhisk', name: 'Captain Tidewhisk', icon: '🌊', leader: true, role: 'Leader of Crystal Tide Coast',
    region: 'crystaltide', species: 'Water Puffle', voice: 'kind', about: 'Steady, welcoming, salt-worn.', companion: '{name} keeps a steady tide. Do not lose that.',
    beats: {
      greet: 'Welcome, traveler. The tides have brought you here for a reason.',
      done: 'Smooth sailing from here.',
    },
  },
  {
    id: 'aurorafrost', name: 'Lady Aurorafrost', icon: '❄️', leader: true, role: 'Leader of Aurora Glacier',
    region: 'auroraglacier', species: 'Ice Puffle', voice: 'mysterious', about: 'Calm, precise, cold-voiced.', companion: 'Patience is a cold art. {name} is learning it.',
    beats: {
      greet: 'A calm mind sees what others miss.',
      friend: 'Wisdom grows slowly, like ice crystals.',
    },
  },
  {
    id: 'stormbolt', name: 'Stormbolt Junior', icon: '⚡', leader: true, role: 'Leader of Thundercloud Heights',
    region: 'thundercloud', species: 'Lightning Puffle', voice: 'cheerful', about: 'Fast-talking and always mid-race.', companion: 'Race you both to the ridge! {name} looks fast.',
    beats: {
      greet: 'Adventure waits for nobody!',
      race: 'Ready, set, GO!',
    },
  },
  {
    id: 'breezetail', name: 'Breezetail', icon: '🌪️', leader: true, role: 'Leader of Whisperwind Plains',
    region: 'whisperwind', species: 'Air Puffle', voice: 'playful', about: 'Light, curious, impossible to pin down.', companion: '{name} has the wind in their fur. I can tell.',
    beats: {
      greet: 'Have you ever chased a cloud?',
      friend: 'Every breeze carries a new possibility.',
    },
  },
  {
    id: 'sunpetal', name: 'Sunpetal', icon: '☀️', leader: true, role: 'Leader of Celestial Meadows',
    region: 'celestial', species: 'Light Puffle', voice: 'kind', about: 'Warm, hopeful, quietly certain.', companion: 'Keep {name} close. Some lights are meant to be shared.',
    beats: {
      greet: 'May today shine brightly for you.',
      friend: 'Hope is the strongest light.',
    },
  },
  {
    id: 'umbrix', name: 'Umbrix', icon: '🌑', leader: true, role: 'Leader of Shadowveil Woods',
    region: 'shadowveil', species: 'Shadow Puffle', voice: 'mysterious', about: 'Soft-spoken, watchful, kind under it.', companion: 'The dark does not frighten {name}. Good.',
    beats: {
      greet: 'Do not fear the shadows. Not all darkness is evil.',
      friend: 'Thank you for seeing the good beneath the surface.',
    },
  },
  {
    id: 'prismatic', name: 'Princess Prismatic', icon: '💎', leader: true, role: 'Leader of Prism Caverns',
    region: 'prismcaverns', species: 'Crystal Puffle', voice: 'creative', about: 'Bright, artistic, delighted by everything.', companion: '{name} has a facet I have not seen before. Lovely.',
    beats: {
      greet: 'Welcome to Prism Caverns, where every gem sparkles with possibility.',
      friend: "Creativity is its own kind of magic.",
    },
  },
  {
    id: 'shadowwisp', name: 'Shadow Wisp', icon: '🌑', enemy: true, role: 'Hollow Eclipse', region: 'shadowveil', voice: 'mysterious', element: 'sp_shadow',
    about: 'A shadow that only wanted to be seen.',
    beats: { encounter: 'The Eclipse spreads...', defeated: 'Thank you... for freeing me...' },
  },
  {
    id: 'cinderbeast', name: 'Cinder Beast', icon: '🔥', enemy: true, role: 'Hollow Eclipse', region: 'emberpeak', voice: 'brave', element: 'sp_fire',
    about: 'A furnace wearing a temper.',
    beats: { encounter: 'Burn... consume...', defeated: 'The fire feels warm again...' },
  },
  {
    id: 'frostspecter', name: 'Frost Specter', icon: '❄️', enemy: true, role: 'Hollow Eclipse', region: 'auroraglacier', voice: 'mysterious', element: 'sp_ice',
    about: 'A cold that forgot how to stop.',
    beats: { encounter: 'Forever frozen...', defeated: 'The cold no longer controls me...' },
  },
  {
    id: 'stormphantom', name: 'Storm Phantom', icon: '⚡', enemy: true, role: 'Hollow Eclipse', region: 'thundercloud', voice: 'cheerful', element: 'sp_lightning',
    about: 'A storm with nowhere to put its noise.',
    beats: { encounter: 'Chaos... chaos everywhere!', defeated: 'The storm has passed...' },
  },
];

window.SPRITE_HOLLOW_FINAL_LINES = [
  'You have crossed every biome, befriended every element, restored every heart, and protected every generation of Sprite Hollow.',
  'The power that saved this world was never magic.',
  'It was kindness.',
  'Welcome home, Sprite Keeper.',
];

/* The leader who speaks for a scene, so a species page can quote its region. */
window.voiceLeaderForScene = function voiceLeaderForScene(sceneKey) {
  if (!sceneKey) return null;
  return window.SPRITE_HOLLOW_VOICES.find((voice) => voice.leader && voice.region === sceneKey) || null;
};

window.voiceEnemiesForScene = function voiceEnemiesForScene(sceneKey) {
  if (!sceneKey) return [];
  return window.SPRITE_HOLLOW_VOICES.filter((voice) => voice.enemy && voice.region === sceneKey);
};
