/* One shared table for every ability the sprite species files name.
   `mods` uses the keys BREEDS already understands (bondMod, xpMod, joyMod,
   hungerMod, cleanMod, energyMod), so a species breed perks automatically in
   the existing care math. `aura` names the sprite-sheet effect it paints. */

const ABILITY_TABLE = {
  /* the ten species shipped before the lists existed */
  float: { name: 'Float', icon: '🪶', blurb: 'Hovers a thumb above the floor, so hunger fades slower.', aura: 'wingGlow', mods: { hungerMod: 0.94 } },
  sparkle: { name: 'Sparkle', icon: '✨', blurb: 'Leaves tiny sparks that keep the mood warm.', aura: 'sparkles', mods: { joyMod: 0.94 } },
  cute_blink: { name: 'Cute Blink', icon: '😊', blurb: 'Blinks slowly at you until your bond grows faster.', aura: 'sparkles', mods: { bondMod: 1.06 } },
  tiny_jump: { name: 'Tiny Jump', icon: '🐣', blurb: 'Hops in place, spending less energy than it looks.', aura: 'trailEffect', mods: { energyMod: 0.94 } },
  royal_glow: { name: 'Royal Glow', icon: '👑', blurb: 'Wears its light like a crown and learns faster for it.', aura: 'wingGlow', mods: { xpMod: 1.06 } },
  crown_spark: { name: 'Crown Spark', icon: '💫', blurb: 'A spark above the brow that makes every hello warmer.', aura: 'sparkles', mods: { bondMod: 1.08 } },
  dark_dash: { name: 'Dark Dash', icon: '🌑', blurb: 'Crosses the room in one shadow and gains XP doing it.', aura: 'shadowAura', mods: { xpMod: 1.08 } },
  shadow_blink: { name: 'Shadow Blink', icon: '🕶️', blurb: 'Vanishes for a blink and comes back calmer than it left.', aura: 'shadowAura', mods: { joyMod: 0.92 } },
  star_trail: { name: 'Star Trail', icon: '🌠', blurb: 'Drags a line of stars that brightens every lesson.', aura: 'trailEffect', mods: { xpMod: 1.07 } },
  supernova: { name: 'Supernova', icon: '💥', blurb: 'Flare-ups that turn ordinary care into real progress.', aura: 'sparkles', mods: { xpMod: 1.1 } },
  glitch_hop: { name: 'Glitch Hop', icon: '📺', blurb: 'Skips a frame between hops, so it spends less energy getting anywhere.', aura: 'lightningAura', mods: { energyMod: 0.92 } },
  patch_stitch: { name: 'Patch Stitch', icon: '🧵', blurb: 'Re-stitches its own seams and sheds dust while it works.', aura: 'sparkles', mods: { cleanMod: 0.9 } },
  crystal_shield: { name: 'Crystal Shield', icon: '🛡️', blurb: 'A clear shell that keeps dust and grime off.', aura: 'wingGlow', mods: { cleanMod: 0.9 } },
  gem_burst: { name: 'Gem Burst', icon: '💎', blurb: 'Sheds cut facets when it is happy to see you.', aura: 'sparkles', mods: { bondMod: 1.07 } },
  lightning_dash: { name: 'Lightning Dash', icon: '⚡', blurb: 'Runs on static and barely tires.', aura: 'lightningAura', mods: { energyMod: 0.9 } },
  thunder_wings: { name: 'Thunder Wings', icon: '🌩️', blurb: 'Wings that rumble softly and push it to learn faster.', aura: 'lightningAura', mods: { xpMod: 1.09 } },
  fire_trail: { name: 'Fire Trail', icon: '🔥', blurb: 'Warm footprints that keep it fed longer.', aura: 'fireAura', mods: { hungerMod: 0.9 } },
  phoenix_jump: { name: 'Phoenix Jump', icon: '🐦‍🔥', blurb: 'Leaps and re-forms brighter every time.', aura: 'fireAura', mods: { joyMod: 0.9 } },
  ice_wings: { name: 'Ice Wings', icon: '🧊', blurb: 'Cold wings that hold energy in longer.', aura: 'snowAura', mods: { energyMod: 0.92 } },
  snow_burst: { name: 'Snow Burst', icon: '❄️', blurb: 'A puff of clean snow that settles the dust.', aura: 'snowAura', mods: { cleanMod: 0.9 } },
  vine_heal: { name: 'Vine Heal', icon: '🌿', blurb: 'Green threads that mend a mood quickly.', aura: 'sparkles', mods: { bondMod: 1.09 } },
  leaf_storm: { name: 'Leaf Storm', icon: '🍃', blurb: 'A swirl of leaves that keeps it cheerful.', aura: 'sparkles', mods: { joyMod: 0.9 } },

  /* seasonal species */
  spooky_glow: { name: 'Spooky Glow', icon: '🎃', blurb: 'A lantern glow that never quite goes out.', aura: 'shadowAura', mods: { joyMod: 0.92 } },
  treat_rush: { name: 'Treat Rush', icon: '🍬', blurb: 'First to the snack bowl: 4 extra game coins and 2 extra on every pet.', aura: 'sparkles', mods: { bondMod: 1.08 }, effect: { gameCoins: 4, petCoins: 2 } },
  frost_gift: { name: 'Frost Gift', icon: '🎁', blurb: 'Wraps small presents in window frost.', aura: 'snowAura', mods: { bondMod: 1.1 } },
  jingle_dash: { name: 'Jingle Dash', icon: '🔔', blurb: 'Runs on bells and never seems to tire.', aura: 'snowAura', mods: { energyMod: 0.9 } },
  heart_aura: { name: 'Heart Aura', icon: '💗', blurb: 'Fills the room with pink haze: petting pays 3 extra coins and bonds 12% faster.', aura: 'sparkles', mods: { bondMod: 1.12 }, effect: { petCoins: 3, petBond: 1.12 } },
  cupid_shot: { name: 'Cupid Shot', icon: '🏹', blurb: 'A tiny arrow of affection that teaches fast.', aura: 'trailEffect', mods: { xpMod: 1.08 } },
  sunbeam: { name: 'Sunbeam', icon: '☀️', blurb: 'Burns energy slower and banks 8 extra coins in daytime games.', aura: 'sparkles', mods: { energyMod: 0.9 }, effect: { dayCoins: 8 } },
  wave_dash: { name: 'Wave Dash', icon: '🌊', blurb: 'Rides an invisible wave and works up less hunger.', aura: 'trailEffect', mods: { hungerMod: 0.92 } },
  blossom_burst: { name: 'Blossom Burst', icon: '🌸', blurb: 'Petals every time it is pleased.', aura: 'sparkles', mods: { joyMod: 0.9 } },
  petal_dance: { name: 'Petal Dance', icon: '🌷', blurb: 'Dances in a slow circle and stays close.', aura: 'trailEffect', mods: { bondMod: 1.07 } },

  /* variant species */
  neon_glow: { name: 'Neon Glow', icon: '🟣', blurb: 'Buzzing outline that lights up the lesson.', aura: 'wingGlow', mods: { xpMod: 1.08 } },
  light_beam: { name: 'Light Beam', icon: '🔆', blurb: 'Fires a clean line of light and keeps going.', aura: 'rainbowAura', mods: { energyMod: 0.9 } },
  data_spike: { name: 'Data Spike', icon: '📈', blurb: 'Runs numbers in its head and learns faster.', aura: 'lightningAura', mods: { xpMod: 1.1 } },
  cyber_cloak: { name: 'Cyber Cloak', icon: '🖥️', blurb: 'A mesh coat that sheds dust and rain.', aura: 'shadowAura', mods: { cleanMod: 0.88 } },
  gold_rush: { name: 'Gold Rush', icon: '🪙', blurb: 'Games pay 10 extra coins, and 3 more while the sun is up.', aura: 'sparkles', mods: { xpMod: 1.12 }, effect: { gameCoins: 10, dayCoins: 3 } },
  gilded_aura: { name: 'Gilded Aura', icon: '🏆', blurb: 'A warm gold halo that makes visits feel valuable.', aura: 'wingGlow', mods: { bondMod: 1.1 } },
  prism_cut: { name: 'Prism Cut', icon: '🔷', blurb: 'Splits light into colour and turns it into 14 extra coins per game.', aura: 'rainbowAura', mods: { xpMod: 1.14 }, effect: { gameCoins: 14 } },
  hard_shine: { name: 'Hard Shine', icon: '✨', blurb: 'Nothing sticks to a surface that polished.', aura: 'wingGlow', mods: { cleanMod: 0.86 } },
  rainbow_beam: { name: 'Rainbow Beam', icon: '🌈', blurb: 'Bends a rainbow wherever it walks.', aura: 'rainbowAura', mods: { joyMod: 0.86 } },
  color_burst: { name: 'Colour Burst', icon: '🎨', blurb: 'A splash of new colour on every good day.', aura: 'rainbowAura', mods: { xpMod: 1.12 } },

  /* creature species */
  crystal_shard: { name: 'Crystal Shard', icon: '🔮', blurb: 'Keeps a splinter of home in its pocket and remembers you by it.', aura: 'wingGlow', mods: { bondMod: 1.05 } },
  glint_step: { name: 'Glint Step', icon: '🫧', blurb: 'Each step leaves a fleck of light.', aura: 'sparkles', mods: { energyMod: 0.94 } },
  ember_breath: { name: 'Ember Breath', icon: '🐲', blurb: 'Warm breath that keeps its belly full longer.', aura: 'fireAura', mods: { hungerMod: 0.88 } },
  wing_flap: { name: 'Wing Flap', icon: '🪽', blurb: 'Flaps once and coasts on the lift.', aura: 'wingGlow', mods: { energyMod: 0.88 } },
  cloud_hop: { name: 'Cloud Hop', icon: '☁️', blurb: 'Hops between cushions of its own weather.', aura: 'trailEffect', mods: { joyMod: 0.92 } },
  fluff_puff: { name: 'Fluff Puff', icon: '🫧', blurb: 'A puff of down that softens every landing.', aura: 'sparkles', mods: { bondMod: 1.06 } },
  star_pounce: { name: 'Star Pounce', icon: '⭐', blurb: 'Pounces at the first glint: 6 extra coins per game, 2 more at night.', aura: 'trailEffect', mods: { xpMod: 1.08 }, effect: { gameCoins: 6, nightCoins: 2 } },
  tail_glow: { name: 'Tail Glow', icon: '🦊', blurb: 'A tail tip that lights the way home.', aura: 'sparkles', mods: { bondMod: 1.07 } },
  spooky_wail: { name: 'Spooky Wail', icon: '👻', blurb: 'A long soft note that settles the room.', aura: 'shadowAura', mods: { joyMod: 0.9 } },
  phase_step: { name: 'Phase Step', icon: '💨', blurb: 'Steps through walls and saves its energy.', aura: 'shadowAura', mods: { energyMod: 0.9 } },
  void_purr: { name: 'Void Purr', icon: '🌌', blurb: 'A purr from far away: night games pay 5 more and petting bonds 10% faster.', aura: 'shadowAura', mods: { bondMod: 1.12 }, effect: { nightCoins: 5, petBond: 1.1 } },
  comet_nap: { name: 'Comet Nap', icon: '☄️', blurb: 'Sleeps in an orbit and wakes up rested.', aura: 'trailEffect', mods: { energyMod: 0.86 } },
  moon_glide: { name: 'Moon Glide', icon: '🌙', blurb: 'Glides on moonlight and earns 8 extra coins in night games.', aura: 'wingGlow', mods: { energyMod: 0.88 }, effect: { nightCoins: 8 } },
  night_eye: { name: 'Night Eye', icon: '🦉', blurb: 'Sees in the dark and remembers every detail.', aura: 'shadowAura', mods: { xpMod: 1.08 } },
  static_peck: { name: 'Static Peck', icon: '🐤', blurb: 'A tiny zap that sharpens its attention.', aura: 'lightningAura', mods: { xpMod: 1.06 } },
  thunder_cheep: { name: 'Thunder Cheep', icon: '⛈️', blurb: 'A cheep loud enough to scare off rain.', aura: 'lightningAura', mods: { hungerMod: 0.92 } },

  /* Lumi outfit abilities: one per kit family, so every breed in a family can
     carry a different perk without inventing anything impossible to test. */
  dew_step: { name: 'Dew Step', icon: '💧', blurb: 'Leaves cool footprints that keep it fresh.', aura: 'snowAura', mods: { cleanMod: 0.93 } },
  moss_patch: { name: 'Moss Patch', icon: '🌱', blurb: 'Grows a soft green patch to rest on.', aura: 'sparkles', mods: { energyMod: 0.93 } },
  amber_spark: { name: 'Amber Spark', icon: '🟠', blurb: 'A warm spark that keeps the mood steady.', aura: 'fireAura', mods: { joyMod: 0.93 } },
  hush_wing: { name: 'Hush Wing', icon: '🪶', blurb: 'Moves without a sound and never startles.', aura: 'wingGlow', mods: { bondMod: 1.05 } },
  tide_turn: { name: 'Tide Turn', icon: '🌊', blurb: 'Turns with the tide and works up less hunger.', aura: 'trailEffect', mods: { hungerMod: 0.93 } },
  pearl_gleam: { name: 'Pearl Gleam', icon: '🫧', blurb: 'A pearl shine that pays 3 extra coins per game.', aura: 'wingGlow', mods: { xpMod: 1.05 }, effect: { gameCoins: 3 } },
  dusk_veil: { name: 'Dusk Veil', icon: '🌆', blurb: 'A soft veil that soothes after a long day.', aura: 'shadowAura', mods: { joyMod: 0.91 } },
  lark_song: { name: 'Lark Song', icon: '🎵', blurb: 'Sings the room into a better mood.', aura: 'trailEffect', mods: { joyMod: 0.9 } },
  pebble_roll: { name: 'Pebble Roll', icon: '🪨', blurb: 'Trundles along and barely tires.', aura: 'trailEffect', mods: { energyMod: 0.92 } },
  willow_sway: { name: 'Willow Sway', icon: '🌿', blurb: 'Sways gently and keeps its coat tidy.', aura: 'sparkles', mods: { cleanMod: 0.92 } },
  moonbeam: { name: 'Moonbeam', icon: '🌙', blurb: 'A narrow beam that pays 5 extra coins at night.', aura: 'wingGlow', mods: { xpMod: 1.06 }, effect: { nightCoins: 5 } },
  sun_spot: { name: 'Sun Spot', icon: '☀️', blurb: 'Finds the warmest patch and naps better there.', aura: 'sparkles', mods: { energyMod: 0.91 } },
  frost_petal: { name: 'Frost Petal', icon: '❄️', blurb: 'A cold petal that keeps dust from settling.', aura: 'snowAura', mods: { cleanMod: 0.91 } },
  ember_dance: { name: 'Ember Dance', icon: '🔥', blurb: 'Dances in place and stays cheerful.', aura: 'fireAura', mods: { joyMod: 0.89 } },
  prism_shine: { name: 'Prism Shine', icon: '🔷', blurb: 'Splits light and turns it into 4 game coins.', aura: 'rainbowAura', mods: { xpMod: 1.05 }, effect: { gameCoins: 4 } },
  reed_wave: { name: 'Reed Wave', icon: '🌾', blurb: 'Bends with the wind and keeps steady.', aura: 'trailEffect', mods: { hungerMod: 0.9 } },
  thistle_tuft: { name: 'Thistle Tuft', icon: '🌵', blurb: 'A prickly tuft nobody can ignore.', aura: 'lightningAura', mods: { bondMod: 1.04 } },
  honey_drop: { name: 'Honey Drop', icon: '🍯', blurb: 'Naps check-ins pay 4 extra coins.', aura: 'sparkles', mods: { bondMod: 1.05 }, effect: { checkinCoins: 4 } },
  cinder_puff: { name: 'Cinder Puff', icon: '💨', blurb: 'A puff of warm ash that softens every landing.', aura: 'fireAura', mods: { energyMod: 0.9 } },
  star_leap: { name: 'Star Leap', icon: '🌟', blurb: 'Leaps once and learns from the view.', aura: 'trailEffect', mods: { xpMod: 1.07 } },
  mist_step: { name: 'Mist Step', icon: '🌫️', blurb: 'Steps out of a little fog and back in.', aura: 'shadowAura', mods: { energyMod: 0.91 } },
  bloom_burst: { name: 'Bloom Burst', icon: '🌺', blurb: 'Flowers open wherever it sits.', aura: 'sparkles', mods: { joyMod: 0.91 } },
  spark_kick: { name: 'Spark Kick', icon: '⚡', blurb: 'A static kick that sharpens the mind.', aura: 'lightningAura', mods: { xpMod: 1.04 } },
  glitter_hop: { name: 'Glitter Hop', icon: '✨', blurb: 'Hops in a trail of glitter, bonding faster.', aura: 'sparkles', mods: { bondMod: 1.06 } },
  cloud_drift: { name: 'Cloud Drift', icon: '☁️', blurb: 'Drifts a thumb above the ground.', aura: 'trailEffect', mods: { hungerMod: 0.91 } },
  twig_snaps: { name: 'Twig Snap', icon: '🪵', blurb: 'Alert ears that hear you coming.', aura: 'wingGlow', mods: { bondMod: 1.04 } },
  night_lantern: { name: 'Night Lantern', icon: '🏮', blurb: 'Lights the room and pays 4 extra night coins.', aura: 'shadowAura', mods: { joyMod: 0.92 }, effect: { nightCoins: 4 } },
  day_glow: { name: 'Day Glow', icon: '🔆', blurb: 'Brightens the morning: 4 extra day coins.', aura: 'rainbowAura', mods: { xpMod: 1.04 }, effect: { dayCoins: 4 } },
  petal_rain: { name: 'Petal Rain', icon: '🌸', blurb: 'Petals fall and the coat stays clean.', aura: 'sparkles', mods: { cleanMod: 0.89 } },
  tide_belly: { name: 'Tide Belly', icon: '🐚', blurb: 'A shell belly that holds food longer.', aura: 'wingGlow', mods: { hungerMod: 0.89 } },
  wind_fluff: { name: 'Wind Fluff', icon: '🌬️', blurb: 'Fluff that cushions every nap.', aura: 'trailEffect', mods: { energyMod: 0.89 } },
  warm_paw: { name: 'Warm Paw', icon: '🐾', blurb: 'Warm paws that bond 7% faster.', aura: 'fireAura', mods: { bondMod: 1.07 } },
};

const ABILITY_KEYS = Object.keys(ABILITY_TABLE);
const SPRITE_EFFECT_KEYS = ['sparkles', 'wingGlow', 'trailEffect', 'shadowAura', 'lightningAura', 'snowAura', 'fireAura', 'rainbowAura'];

function abilityInfo(name) {
  return ABILITY_TABLE[name] || null;
}

function abilityAura(name) {
  const info = ABILITY_TABLE[name];
  return info && info.aura ? info.aura : null;
}

function abilityLabel(name) {
  const info = ABILITY_TABLE[name];
  return info ? `${info.icon} ${info.name}` : String(name || '');
}

function abilitySummary(names) {
  return (Array.isArray(names) ? names : [])
    .map((name) => abilityLabel(name))
    .filter(Boolean)
    .join(' · ');
}

/* Unknown ability names are a data bug, so report them instead of guessing. */
function abilityUnknown(names) {
  return (Array.isArray(names) ? names : []).filter((name) => !ABILITY_TABLE[name]);
}
