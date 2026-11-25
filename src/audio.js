/* Tiny synthesized sound effects — no audio files needed. */

/* Every sprite gets a deterministic voice from its species, breed, hybrid and finish.
   Animal families are synthesized from short oscillator phrases, so the whole
   collection works offline without thousands of audio files. */
const CRY_LIBRARY = {
  meow: { type: 'triangle', base: 1.12, notes: [[0, .14, 1, .055, 1.35], [.12, .22, .9, .045, .7]] },
  yip: { type: 'sine', base: 1.25, notes: [[0, .08, 1.5, .045, 1.9], [.1, .09, 1.6, .04, 2]] },
  bark: { type: 'square', base: .85, notes: [[0, .09, .8, .05, .2], [.12, .08, .85, .04, .15]] },
  howl: { type: 'sine', base: .8, notes: [[0, .22, .7, .04, 1.3], [.18, .32, 1, .045, 1.35], [.46, .3, .95, .035, .8]] },
  growl: { type: 'sawtooth', base: .65, notes: [[0, .32, .55, .05, .7], [.05, .3, .58, .04, .68]] },
  roar: { type: 'sawtooth', base: .55, notes: [[0, .38, .45, .06, .8], [.04, .35, .5, .04, .7]] },
  chirp: { type: 'sine', base: 1.9, notes: [[0, .07, 1.9, .04, 2.6], [.09, .06, 2.2, .035, 2.8], [.17, .08, 1.8, .03, 2.2]] },
  hoot: { type: 'sine', base: .7, notes: [[0, .16, .6, .04, .7], [.2, .22, .55, .035, .6]] },
  croak: { type: 'square', base: .55, notes: [[0, .12, .45, .045, .4], [.16, .1, .5, .04, .35], [.3, .14, .42, .03, .3]] },
  moo: { type: 'triangle', base: .62, notes: [[0, .35, .5, .05, .4], [.12, .25, .55, .035, .5]] },
  oink: { type: 'sawtooth', base: .8, notes: [[0, .09, .7, .05, .55], [.11, .09, .75, .045, .6]] },
  squeak: { type: 'sine', base: 1.7, notes: [[0, .1, 2, .04, 2.5], [.11, .08, 2.4, .035, 2.8]] },
  hiss: { type: 'sawtooth', base: 1.5, notes: [[0, .2, 1.4, .035, .9], [.06, .18, 1.6, .03, 1.1]] },
  buzz: { type: 'square', base: 1.4, notes: [[0, .05, 1.6, .03, 1.8], [.06, .05, 1.55, .028, 1.75], [.12, .06, 1.7, .025, 1.9]] },
  clank: { type: 'triangle', base: 1.6, notes: [[0, .08, 2.2, .035, 2.4], [.07, .15, 1.7, .025, 1.4], [.15, .08, 2.6, .02, 2.2]] },
  chime: { type: 'triangle', base: 1.5, notes: [[0, .18, 1.4, .04, 1.8], [.12, .2, 1.8, .035, 2.2], [.24, .26, 2.1, .03, 2.4]] },
  wail: { type: 'sine', base: .8, notes: [[0, .26, .75, .04, 1.2], [.2, .32, 1.1, .038, 1.3], [.46, .28, .9, .03, .6]] },
  babble: { type: 'sine', base: 1.2, notes: [[0, .07, 1.2, .035, 1.4], [.09, .06, 1.5, .03, 1.7], [.16, .08, 1.1, .03, 1.3]] },
  splash: { type: 'sine', base: 1.1, notes: [[0, .1, 1.2, .04, 1.6], [.08, .14, 1.7, .035, 1.2], [.2, .1, 1.4, .03, 1.9]] },
  rumble: { type: 'sawtooth', base: .48, notes: [[0, .28, .5, .05, .65], [.08, .3, .45, .04, .55]] },
  spark: { type: 'triangle', base: 2, notes: [[0, .06, 2, .035, 2.4], [.07, .07, 2.4, .03, 2.7], [.14, .07, 2.8, .028, 3.2]] },
  neigh: { type: 'sawtooth', base: .9, notes: [[0, .2, .9, .045, 1.1], [.16, .18, .95, .04, .75], [.3, .14, .85, .035, 1.2]] },
  trumpet: { type: 'square', base: .85, notes: [[0, .12, .9, .05, 1.2], [.11, .22, .8, .045, 1]] },
};
const CRY_LABELS = {
  meow: 'meows', yip: 'yips', bark: 'barks', howl: 'howls', growl: 'growls', roar: 'roars',
  chirp: 'chirps', hoot: 'hoots', croak: 'croaks', moo: 'moos', oink: 'oinks', squeak: 'squeaks',
  hiss: 'hisses', buzz: 'buzzes', clank: 'clanks', chime: 'chimes', wail: 'wails', babble: 'babbles',
  splash: 'splashes', rumble: 'rumbles', spark: 'sparks', neigh: 'neighs', trumpet: 'trumpets',
};
const CRY_ANIMAL_RULES = [
  [/dragonfly/, 'buzz'],
  [/dragon|wyvern|drake|godzilla|kaiju|rex|raptor|saur|hydra|leviathan|behemoth/, 'roar'],
  [/wolf|werewolf|lycan|fenrir/, 'howl'],
  [/fox|yip|fenn/, 'yip'],
  [/lion|tiger|panther|leopard|jaguar|cheetah|sabre|saber/, 'roar'],
  [/bear|grizzly|ursa|panda/, 'growl'],
  [/dog|puppy|hound|terrier|pug|husky|balto|scooby/, 'bark'],
  [/cat|kitty|kitten|feline|meow|persian|siamese/, 'meow'],
  [/cow|bull|cattle|moo|buffalo|bison|yak/, 'moo'],
  [/pig|hog|boar|oink|piglet/, 'oink'],
  [/frog|toad|ribbit|croak|axolotl/, 'croak'],
  [/owl|hoot/, 'hoot'],
  [/horse|pony|unicorn|pegasus|zebra|donkey|mule/, 'neigh'],
  [/elephant|mammoth|trumpet/, 'trumpet'],
  [/monkey|ape|chimp|gorilla|baboon/, 'babble'],
  [/mouse|hamster|rat|bunny|rabbit|squirrel|chipmunk|ferret|hedgehog/, 'squeak'],
  [/bird|sparrow|robin|finch|parrot|penguin|duck|chicken|rooster|phoenix|eagle|hawk|raven|crow|swallow|humming/, 'chirp'],
  [/bee|wasp|hornet|bug|spider|moth|butterfly|ant|beetle|cricket|mantis|scorpion|worm/, 'buzz'],
  [/snake|serpent|viper|python|cobra|boa|naga/, 'hiss'],
  [/fish|shark|whale|dolphin|otter|seal|mermaid|squid|octopus|crab|turtle|narwhal/, 'splash'],
  [/ghost|spirit|phantom|wraith|specter|soul|haunt|boo/, 'wail'],
  [/robot|mech|android|cyborg|steel|metal|clank|gear|bot|automaton/, 'clank'],
];
const CRY_TYPE_FAMILY = {
  normal: 'babble', fire: 'roar', water: 'splash', electric: 'spark', grass: 'chirp', ice: 'chime',
  fighting: 'growl', poison: 'hiss', ground: 'rumble', flying: 'chirp', psychic: 'chime', bug: 'buzz',
  rock: 'rumble', ghost: 'wail', dragon: 'roar', dark: 'growl', steel: 'clank', fairy: 'chime',
};
function cryHash(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function crySeed(sprite) {
  const raw = [sprite.element, sprite.breed, sprite.hybrid, sprite.palette, sprite.pattern, sprite.finish, sprite.special, sprite.mutation, sprite.size, sprite.form]
    .map((value) => value == null ? '' : String(value)).join('|');
  return cryHash(raw || 'sprite');
}
function cryFamily(sprite) {
  const text = `${sprite.element || ''} ${sprite.name || ''} ${sprite.hybrid || ''}`.toLowerCase();
  for (const [pattern, family] of CRY_ANIMAL_RULES) {
    if (pattern.test(text)) return family;
  }
  const element = String(sprite.element || '');
  const type = (typeof POKEDEX_META !== 'undefined' && POKEDEX_META[element]?.types?.[0]) || element;
  if (CRY_TYPE_FAMILY[type]) return CRY_TYPE_FAMILY[type];
  return ['babble', 'chirp', 'squeak'][crySeed(sprite) % 3];
}
function cryName(sprite) {
  const name = sprite && (sprite.name || (typeof displayName === 'function' ? displayName(sprite) : ''));
  return name || 'Sprite';
}
/* Rarity cue sheets. Every tier is a small synthesized arrangement rather than a
   single blip, so the rarity is recognizable before the card finishes flipping.
   Each layer is [generator, startAt, options]; the length is the arrangement's
   full tail, read by the results screen and by tests. */
const SUMMON_CUE_SPECS = {
  common: {
    length: 0.8, theme: 'Cute · Friendly · Soft', layers: [
      ['bell', 0, { freq: 1046, dur: 0.42, vol: 0.028 }],
      ['sparkle', 0.16, { count: 3, base: 1568, vol: 0.012, step: 0.11 }],
      ['thump', 0.02, { freq: 220, dur: 0.16, vol: 0.012 }],
    ],
  },
  uncommon: {
    length: 1.2, theme: 'Nature · Discovery', layers: [
      ['bell', 0, { freq: 659, dur: 0.5, vol: 0.026 }],
      ['bell', 0.16, { freq: 880, dur: 0.5, vol: 0.024 }],
      ['noise', 0.02, { dur: 0.5, vol: 0.012, freq: 3200, q: 0.7 }],
      ['sparkle', 0.5, { count: 2, base: 1318, vol: 0.012, step: 0.14 }],
    ],
  },
  rare: {
    length: 1.8, theme: 'Crystal Discovery', layers: [
      ['bell', 0, { freq: 1318, dur: 0.9, vol: 0.026 }],
      ['bell', 0.28, { freq: 1760, dur: 0.8, vol: 0.02 }],
      ['sparkle', 0.5, { count: 4, base: 1760, vol: 0.01, step: 0.12 }],
      ['glide', 0.35, { from: 392, to: 988, dur: 1.2, type: 'triangle', vol: 0.016 }],
    ],
  },
  epic: {
    length: 2.5, theme: 'Power Awakening', layers: [
      ['thump', 0, { freq: 110, dur: 0.9, vol: 0.03 }],
      ['pad', 0.1, { freq: 196, dur: 2.2, vol: 0.014 }],
      ['bell', 0.5, { freq: 784, dur: 0.9, vol: 0.022 }],
      ['glide', 0.7, { from: 220, to: 784, dur: 1.5, type: 'sawtooth', vol: 0.016 }],
      ['sparkle', 1.4, { count: 4, base: 1174, vol: 0.011, step: 0.14 }],
    ],
  },
  legendary: {
    length: 4, theme: 'Hero Arrival', layers: [
      ['glide', 0, { from: 523, to: 659, dur: 0.5, type: 'sawtooth', vol: 0.02 }],
      ['bell', 0.35, { freq: 784, dur: 0.8, vol: 0.026 }],
      ['thump', 0.9, { freq: 82, dur: 1.1, vol: 0.04 }],
      ['pad', 0.9, { freq: 261, dur: 3, vol: 0.018 }],
      ['pad', 1, { freq: 329, dur: 2.9, vol: 0.014 }],
      ['pad', 1.1, { freq: 392, dur: 2.8, vol: 0.014 }],
      ['bell', 1.6, { freq: 1568, dur: 1.6, vol: 0.02 }],
      ['sparkle', 2.2, { count: 6, base: 1568, vol: 0.011, step: 0.16 }],
    ],
  },
  mythic: {
    length: 6, theme: 'World-Changing Event', layers: [
      ['thump', 0, { freq: 62, dur: 1.4, vol: 0.045 }],
      ['noise', 0.2, { dur: 2.4, vol: 0.022, freq: 220, q: 0.6 }],
      ['glide', 1.2, { from: 110, to: 220, dur: 2, type: 'sawtooth', vol: 0.018 }],
      ['pad', 2.2, { freq: 146, dur: 3.6, vol: 0.02 }],
      ['pad', 2.3, { freq: 220, dur: 3.5, vol: 0.016 }],
      ['bell', 3.2, { freq: 880, dur: 2.2, vol: 0.024 }],
      ['thump', 3.2, { freq: 74, dur: 1.2, vol: 0.035 }],
      ['sparkle', 4.2, { count: 5, base: 1174, vol: 0.012, step: 0.18 }],
    ],
  },
  ultra: {
    length: 7, theme: 'Signal Surge', layers: [
      ['glide', 0, { from: 174, to: 1388, dur: 1.8, type: 'square', vol: 0.014 }],
      ['noise', 0.3, { dur: 1.2, vol: 0.02, freq: 5200, q: 1.2 }],
      ['pad', 1.4, { freq: 349, dur: 4.6, vol: 0.017, detune: 6 }],
      ['pad', 1.5, { freq: 466, dur: 4.4, vol: 0.015, detune: 6 }],
      ['bell', 2.6, { freq: 1318, dur: 1.8, vol: 0.022 }],
      ['bell', 3.4, { freq: 1976, dur: 1.4, vol: 0.017 }],
      ['thump', 4.6, { freq: 88, dur: 1.3, vol: 0.036 }],
      ['sparkle', 5.4, { count: 6, base: 1760, vol: 0.011, step: 0.17 }],
    ],
  },
  divine: {
    length: 8, theme: 'Heavenly Arrival', layers: [
      ['pad', 0, { freq: 261, dur: 7.5, vol: 0.016, detune: 9 }],
      ['pad', 0.2, { freq: 329, dur: 7.2, vol: 0.013, detune: 9 }],
      ['pad', 0.4, { freq: 392, dur: 7, vol: 0.013, detune: 9 }],
      ['bell', 0.8, { freq: 1568, dur: 2.4, vol: 0.02 }],
      ['bell', 2.6, { freq: 2093, dur: 2.2, vol: 0.016 }],
      ['thump', 4.4, { freq: 98, dur: 1.2, vol: 0.03 }],
      ['pad', 4.4, { freq: 523, dur: 3.4, vol: 0.014 }],
      ['sparkle', 5.4, { count: 8, base: 1568, vol: 0.01, step: 0.2 }],
    ],
  },
  secret: {
    length: 10, theme: 'Impossible Luck', layers: [
      ['noise', 0, { dur: 1.6, vol: 0.014, freq: 5200, q: 3 }],
      ['glide', 0.1, { from: 262, to: 2093, dur: 4, type: 'sawtooth', vol: 0.016 }],
      ['bell', 1.2, { freq: 1244, dur: 1.4, vol: 0.02 }],
      ['thump', 4.2, { freq: 88, dur: 1.4, vol: 0.04 }],
      ['noise', 4.2, { dur: 1.2, vol: 0.024, freq: 1800, q: 1.2 }],
      ['pad', 4.4, { freq: 294, dur: 5, vol: 0.016 }],
      ['pad', 4.5, { freq: 440, dur: 4.9, vol: 0.014 }],
      ['shimmer', 5.6, { count: 8, base: 1318, vol: 0.011, step: 0.45 }],
    ],
  },
  exotic: {
    length: 6, theme: 'Wandering Star', layers: [
      ['bell', 0, { freq: 988, dur: 1.2, vol: 0.022 }],
      ['glide', 0.3, { from: 494, to: 1480, dur: 2.4, type: 'triangle', vol: 0.015 }],
      ['sparkle', 1.6, { count: 6, base: 1568, vol: 0.01, step: 0.22 }],
      ['pad', 2.4, { freq: 261, dur: 3.4, vol: 0.014 }],
      ['bell', 3.2, { freq: 1244, dur: 1.6, vol: 0.018 }],
    ],
  },
  master: {
    length: 9, theme: 'Mastery', layers: [
      ['thump', 0, { freq: 58, dur: 1.8, vol: 0.04 }],
      ['pad', 0.2, { freq: 130.8, dur: 7.6, vol: 0.018, detune: 6 }],
      ['pad', 0.4, { freq: 196, dur: 7.2, vol: 0.014 }],
      ['bell', 1, { freq: 1046, dur: 2, vol: 0.02 }],
      ['bell', 2.8, { freq: 1568, dur: 1.8, vol: 0.016 }],
      ['shimmer', 4.6, { count: 8, base: 1318, vol: 0.011, step: 0.35 }],
      ['thump', 6, { freq: 73, dur: 1.4, vol: 0.03 }],
    ],
  },
  ancient: {
    length: 11, theme: 'Ancient Echo', layers: [
      ['noise', 0, { dur: 5, vol: 0.008, freq: 900, q: 0.6 }],
      ['pad', 0, { freq: 49, dur: 10.5, vol: 0.02, detune: 4 }],
      ['bell', 1.4, { freq: 587, dur: 2.6, vol: 0.016 }],
      ['bell', 3.6, { freq: 880, dur: 2.4, vol: 0.014 }],
      ['pad', 5, { freq: 98, dur: 6, vol: 0.016 }],
      ['thump', 8.2, { freq: 44, dur: 2, vol: 0.03 }],
      ['shimmer', 8.6, { count: 6, base: 784, vol: 0.009, step: 0.5 }],
    ],
  },
  celestial: {
    length: 12, theme: 'Cosmic Wonder', layers: [
      ['pad', 0, { freq: 65, dur: 11.5, vol: 0.02, detune: 5 }],
      ['noise', 0, { dur: 10, vol: 0.006, freq: 6000, q: 0.5 }],
      ['bell', 0.6, { freq: 1046, dur: 2.4, vol: 0.018 }],
      ['bell', 2.4, { freq: 1318, dur: 2.2, vol: 0.016 }],
      ['bell', 4.2, { freq: 1568, dur: 2.4, vol: 0.018 }],
      ['pad', 3, { freq: 196, dur: 8, vol: 0.014 }],
      ['pad', 3.2, { freq: 261, dur: 7.6, vol: 0.012 }],
      ['thump', 7.4, { freq: 72, dur: 1.6, vol: 0.035 }],
      ['sparkle', 8, { count: 10, base: 1318, vol: 0.01, step: 0.28 }],
    ],
  },
  eternal: {
    length: 14, theme: 'Eternity', layers: [
      ['pad', 0, { freq: 65, dur: 13, vol: 0.018, detune: 7 }],
      ['pad', 0.4, { freq: 98, dur: 12.6, vol: 0.014 }],
      ['pad', 0.8, { freq: 130.8, dur: 12, vol: 0.012 }],
      ['bell', 2, { freq: 1318, dur: 3, vol: 0.018 }],
      ['bell', 4.6, { freq: 1760, dur: 2.6, vol: 0.015 }],
      ['glide', 6, { from: 174, to: 523, dur: 6, type: 'triangle', vol: 0.012 }],
      ['thump', 9, { freq: 55, dur: 2.2, vol: 0.032 }],
      ['shimmer', 10, { count: 12, base: 1568, vol: 0.01, step: 0.3 }],
      ['sparkle', 11.5, { count: 6, base: 2093, vol: 0.009, step: 0.18 }],
    ],
  },
  creator: {
    length: 15, theme: 'Universe Creation', layers: [
      ['thump', 0, { freq: 55, dur: 1.6, vol: 0.04 }],
      ['thump', 0.9, { freq: 49, dur: 1.6, vol: 0.036 }],
      ['thump', 1.8, { freq: 55, dur: 1.8, vol: 0.04 }],
      ['pad', 0, { freq: 65, dur: 14, vol: 0.018, detune: 4 }],
      ['glide', 2.4, { from: 82, to: 523, dur: 6, type: 'sawtooth', vol: 0.014 }],
      ['bell', 3.4, { freq: 784, dur: 3, vol: 0.016 }],
      ['pad', 5.2, { freq: 130, dur: 9, vol: 0.016 }],
      ['pad', 5.4, { freq: 196, dur: 8.6, vol: 0.014 }],
      ['pad', 5.6, { freq: 261, dur: 8.2, vol: 0.014 }],
      ['thump', 6.4, { freq: 65, dur: 2, vol: 0.045 }],
      ['noise', 6.4, { dur: 1.6, vol: 0.026, freq: 900, q: 0.8 }],
      ['sparkle', 8.6, { count: 12, base: 1046, vol: 0.01, step: 0.34 }],
      ['pad', 10, { freq: 523, dur: 4.6, vol: 0.014 }],
      ['bell', 12, { freq: 1568, dur: 2.8, vol: 0.018 }],
    ],
  },
  god: {
    length: 18, theme: 'Godlight Ascension', layers: [
      ['thump', 0, { freq: 42, dur: 2.4, vol: 0.05 }],
      ['pad', 0, { freq: 55, dur: 17, vol: 0.02, detune: 3 }],
      ['pad', 0.6, { freq: 82.4, dur: 16, vol: 0.016 }],
      ['pad', 1.2, { freq: 110, dur: 15, vol: 0.014, detune: 5 }],
      ['glide', 2, { from: 55, to: 880, dur: 8, type: 'sawtooth', vol: 0.016 }],
      ['bell', 4, { freq: 1760, dur: 3.6, vol: 0.02 }],
      ['bell', 7.2, { freq: 2093, dur: 3.2, vol: 0.016 }],
      ['thump', 8.4, { freq: 49, dur: 2.4, vol: 0.045 }],
      ['noise', 8.4, { dur: 2.4, vol: 0.022, freq: 700, q: 0.7 }],
      ['shimmer', 10, { count: 16, base: 2093, vol: 0.01, step: 0.32 }],
      ['pad', 12, { freq: 659, dur: 6, vol: 0.014 }],
      ['sparkle', 14, { count: 10, base: 1568, vol: 0.009, step: 0.22 }],
    ],
  },
};

/* Furniture cues, from the home UI wireframes (§17 recipes, §18 timings).
   Every layer is a synthesized primitive and every volume is an absolute gain
   at master 1.0, so re-mixing never means re-synthesizing. */
const FURNITURE_CUES = {
  locked: {
    length: 0.6, caption: 'locked furniture hums',
    layers: [['pad', 0, { freq: 130, dur: 0.6, vol: 0.012 }], ['noise', 0, { dur: 0.3, vol: 0.006, freq: 700, q: 0.8 }]],
  },
  hover: {
    length: 0.3, caption: 'locked furniture chimes',
    layers: [['bell', 0, { freq: 1046, dur: 0.2, vol: 0.01 }]],
  },
  'unlock-common': {
    length: 0.6, caption: 'common furniture discovered', cinematic: true,
    layers: [['bell', 0, { freq: 1046, dur: 0.3, vol: 0.02 }], ['sparkle', 0, { count: 3, base: 1568, vol: 0.01, step: 0.06 }]],
  },
  'unlock-uncommon': {
    length: 0.7, caption: 'uncommon furniture discovered', cinematic: true,
    layers: [['bell', 0, { freq: 880, dur: 0.34, vol: 0.02 }], ['bell', 0.1, { freq: 1174, dur: 0.34, vol: 0.018 }]],
  },
  'unlock-rare': {
    length: 0.8, caption: 'rare furniture discovered', cinematic: true,
    layers: [['noise', 0, { dur: 0.35, vol: 0.014, freq: 1800, q: 1.2 }], ['glide', 0, { from: 440, to: 1320, dur: 0.3, type: 'triangle', vol: 0.018 }], ['bell', 0.26, { freq: 1568, dur: 0.4, vol: 0.016 }]],
  },
  'unlock-epic': {
    length: 0.8, caption: 'epic furniture discovered', cinematic: true,
    layers: [['bell', 0, { freq: 1318, dur: 0.5, vol: 0.018 }], ['bell', 0.05, { freq: 1568, dur: 0.5, vol: 0.016 }], ['bell', 0.1, { freq: 1976, dur: 0.5, vol: 0.014 }]],
  },
  'unlock-legendary': {
    length: 1, caption: 'legendary furniture discovered', cinematic: true,
    layers: [
      ['glide', 0, { from: 523, to: 1046, dur: 0.5, type: 'triangle', vol: 0.018 }],
      ['pad', 0.2, { freq: 784, dur: 0.6, vol: 0.012 }],
      ['pad', 0.2, { freq: 988, dur: 0.6, vol: 0.011 }],
      ['pad', 0.2, { freq: 1174, dur: 0.6, vol: 0.011 }],
      ['thump', 0.7, { freq: 90, dur: 0.3, vol: 0.024 }],
    ],
  },
  'unlock-mythic': {
    length: 1.2, caption: 'mythic furniture discovered', cinematic: true,
    layers: [['sparkle', 0, { count: 6, base: 1568, vol: 0.011, step: 0.07 }], ['bell', 0.5, { freq: 2637, dur: 0.5, vol: 0.011 }], ['thump', 0.9, { freq: 70, dur: 0.4, vol: 0.018 }]],
  },
  'unlock-secret': {
    length: 1.6, caption: 'secret relic discovered', cinematic: true,
    layers: [
      ['noise', 0, { dur: 0.8, vol: 0.014, freq: 900, q: 0.8 }],
      ['glide', 0.2, { from: 80, to: 520, dur: 0.7, type: 'sine', vol: 0.02 }],
      ['thump', 0.9, { freq: 60, dur: 0.8, vol: 0.028 }],
      ['bell', 1.2, { freq: 1568, dur: 0.6, vol: 0.012 }],
    ],
  },
  'upgrade-ready': {
    length: 0.2, caption: 'upgrade ready',
    layers: [['bell', 0, { freq: 1568, dur: 0.2, vol: 0.012 }]],
  },
  craft: {
    length: 1.2, caption: 'upgrading furniture', cinematic: true,
    layers: [
      ['tone', 0, { freq: 1200, dur: 0.04, type: 'square', vol: 0.008 }],
      ['tone', 0.12, { freq: 1200, dur: 0.04, type: 'square', vol: 0.008 }],
      ['tone', 0.24, { freq: 1200, dur: 0.04, type: 'square', vol: 0.008 }],
      ['tone', 0.36, { freq: 1200, dur: 0.04, type: 'square', vol: 0.008 }],
      ['bell', 0.5, { freq: 1046, dur: 0.5, vol: 0.016 }],
    ],
  },
  'max-level': {
    length: 0.8, caption: 'max level furniture', cinematic: true,
    layers: [
      ['tone', 0, { freq: 523, dur: 0.16, type: 'triangle', vol: 0.02 }],
      ['tone', 0.09, { freq: 659, dur: 0.16, type: 'triangle', vol: 0.02 }],
      ['tone', 0.18, { freq: 784, dur: 0.16, type: 'triangle', vol: 0.02 }],
      ['tone', 0.27, { freq: 1046, dur: 0.16, type: 'triangle', vol: 0.02 }],
      ['bell', 0.36, { freq: 1568, dur: 0.4, vol: 0.016 }],
    ],
  },
  fusion: {
    length: 1.3, caption: 'furniture fused', cinematic: true,
    layers: [
      ['glide', 0, { from: 392, to: 784, dur: 0.3, type: 'triangle', vol: 0.016 }],
      ['noise', 0.1, { dur: 0.4, vol: 0.012, freq: 2200, q: 1 }],
      ['thump', 0.35, { freq: 70, dur: 0.6, vol: 0.024 }],
      ['bell', 0.5, { freq: 1568, dur: 0.5, vol: 0.014 }],
    ],
  },
  collection: {
    length: 1, caption: 'collection complete', cinematic: true,
    layers: [
      ['tone', 0, { freq: 659, dur: 0.14, type: 'triangle', vol: 0.016 }],
      ['tone', 0.08, { freq: 784, dur: 0.14, type: 'triangle', vol: 0.016 }],
      ['tone', 0.16, { freq: 988, dur: 0.14, type: 'triangle', vol: 0.016 }],
      ['tone', 0.24, { freq: 1174, dur: 0.14, type: 'triangle', vol: 0.016 }],
      ['tone', 0.32, { freq: 1568, dur: 0.18, type: 'triangle', vol: 0.016 }],
      ['sparkle', 0.44, { count: 3, base: 1568, vol: 0.008, step: 0.06 }],
    ],
  },
  'secret-upgrade': {
    length: 2.4, caption: 'secret relic transformed', cinematic: true,
    layers: [
      ['thump', 0, { freq: 55, dur: 1.4, vol: 0.026 }],
      ['noise', 0, { dur: 0.9, vol: 0.01, freq: 700, q: 0.8 }],
      ['glide', 0.2, { from: 65, to: 523, dur: 1.2, type: 'sine', vol: 0.016 }],
      ['pad', 1.8, { freq: 523, dur: 0.6, vol: 0.01 }],
      ['pad', 1.8, { freq: 659, dur: 0.6, vol: 0.01 }],
      ['pad', 1.8, { freq: 784, dur: 0.6, vol: 0.01 }],
    ],
  },
  favorite: {
    length: 0.24, caption: 'furniture favorited',
    layers: [['tone', 0, { freq: 1568, dur: 0.12, type: 'sine', vol: 0.014 }], ['sparkle', 0.04, { count: 2, base: 2093, vol: 0.008, step: 0.05 }]],
  },
  placed: {
    length: 0.28, caption: 'furniture placed',
    layers: [['tone', 0, { freq: 320, dur: 0.12, type: 'sine', vol: 0.02 }], ['noise', 0, { dur: 0.1, vol: 0.006, freq: 400, q: 0.9 }]],
  },
  stow: {
    length: 0.24, caption: 'furniture tucked away',
    layers: [['glide', 0, { from: 320, to: 180, dur: 0.18, type: 'sine', vol: 0.012 }]],
  },
  material: {
    length: 0.1, caption: 'materials zipped',
    layers: [['tone', 0, { freq: 1200, dur: 0.04, type: 'square', vol: 0.008 }]],
  },
};

/* §19.3 throttles: same cue 400 ms, upgrade-ready once per 8 s. */
const FURNITURE_CUE_GAP = 400;
const FURNITURE_UPGRADE_GAP = 8000;

const Sfx = {
  ctx: null,
  enabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.sound !== false;
  },
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    } catch { /* no audio */ }
  },
  tone(freq = 440, dur = 0.12, type = 'sine', vol = 0.05, delay = 0, glide = 0) {
    if (!this.enabled() || !this.ctx) return;
    try {
      const t0 = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + glide), t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(this.ctx.destination);
      if (this._capture) this._capture.push({ osc, gain });
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
      this._lastAt = Date.now();
    } catch { /* ignore */ }
  },
  cry(sprite, opts = {}) {
    if (!sprite || sprite.stage === 'egg' || !this.enabled()) return;
    const now = Date.now();
    if (!opts.force && now - (this._lastCry || 0) < 140) return;
    this.init();
    if (!this.ctx) return;
    const family = cryFamily(sprite);
    const voice = CRY_LIBRARY[family] || CRY_LIBRARY.babble;
    const seed = crySeed(sprite);
    const base = (140 + (seed % 180)) * voice.base;
    const volume = (opts.soft ? 0.62 : 1) * (Number.isFinite(opts.volume) ? opts.volume : 1);
    const start = Number.isFinite(opts.delay) ? opts.delay : 0;
    voice.notes.forEach(([at, dur, mult, vol, end]) => {
      const freq = base * mult;
      this.tone(freq, dur, voice.type, vol * volume, start + at, freq * (end - 1));
    });
    this._lastCry = now;
    if (typeof Captions !== 'undefined') Captions.sound(`${cryName(sprite)} ${CRY_LABELS[family] || 'babbles'}`);
  },
  spriteCry(sprite, opts = {}) { this.cry(sprite, opts); },
  spriteBabble(sprite, opts = {}) { this.cry(sprite, { ...opts, soft: true }); },
  click() { this.tone(520, 0.06, 'triangle', 0.035); },
  pop() { this.tone(660, 0.09, 'sine', 0.05, 0, 220); },
  coin() { this.tone(880, 0.07, 'triangle', 0.04); this.tone(1320, 0.1, 'triangle', 0.03, 0.06); if (typeof Captions !== 'undefined') Captions.sound('coins chime'); },
  level() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.045, i * 0.09));
    if (typeof Captions !== 'undefined') Captions.sound('level-up fanfare');
  },
  purr() {
    this.tone(340, 0.14, 'sine', 0.035, 0, 90);
    this.tone(300, 0.2, 'sine', 0.03, 0.1, 60);
    if (typeof Captions !== 'undefined') Captions.sound('contented purr');
  },
  eat() {
    [420, 360, 400].forEach((f, i) => this.tone(f, 0.08, 'square', 0.02, i * 0.11));
    this.spriteMotion('eat');
    if (typeof Captions !== 'undefined') Captions.sound('happy munching');
  },
  sip() {
    [300, 260, 320].forEach((f, i) => this.tone(f, 0.1, 'sine', 0.02, i * 0.12, 60));
    this.spriteMotion('drink');
    if (typeof Captions !== 'undefined') Captions.sound('little sips');
  },
  /* Drives the CSS eat/drink animations on the selected sprite. */
  spriteMotion(kind) {
    if (typeof document === 'undefined' || !document.body) return;
    const attr = kind === 'drink' ? 'spriteDrink' : 'spriteEat';
    document.body.dataset[attr] = String(Date.now());
    clearTimeout(this['_' + attr]);
    this['_' + attr] = setTimeout(() => { delete document.body.dataset[attr]; }, 1500);
  },
  bath() { [720, 980, 840].forEach((f, i) => this.tone(f, 0.1, 'sine', 0.025, i * 0.07)); if (typeof Captions !== 'undefined') Captions.sound('bubbles and splashing'); },
  sleep() { this.tone(330, 0.4, 'sine', 0.025, 0, -120); if (typeof Captions !== 'undefined') Captions.sound('soft sleepy hum'); },
  hatch() {
    [392, 523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.04, i * 0.11));
    if (typeof Captions !== 'undefined') Captions.sound('egg cracking and hatching fanfare');
  },
  /* A shell that already sparkles gets its own sound: a high, quick arpeggio
     with a shimmer tail, deliberately brighter than the normal hatch fanfare
     so a shiny egg is recognizable before the hatch screen even opens. */
  shinyEgg() {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    [784, 1046, 1318, 1568, 2093].forEach((f, i) => this.tone(f, 0.17, 'triangle', 0.034, i * 0.075));
    this.tone(2637, 0.3, 'sine', 0.022, 0.3, 620);
    this.tone(392, 0.32, 'sine', 0.016, 0.04, 140);
    if (typeof Captions !== 'undefined') Captions.sound('shiny egg discovery shimmer');
  },
  error() { this.tone(190, 0.15, 'sawtooth', 0.025); if (typeof Captions !== 'undefined') Captions.sound('gentle error buzz'); },
  win() { [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone(f, 0.24, 'sine', 0.045, i * 0.11)); if (typeof Captions !== 'undefined') Captions.sound('victory fanfare'); },
  tick() { this.tone(1200, 0.03, 'square', 0.015); },
  /* Evolution cue: a soft rising gather, a shimmer that tightens and climbs,
     a rising swell, then an impact chord exactly on the morph beat (45% of the
     sequence) and sparkles resolving into the result panel. All synthesized, so
     it stays tiny and works offline. */
  evolution(durationMs = 2400) {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    /* A new evolution replaces any cue still scheduled, and the nodes are kept
       so skipping the animation can cut the rest instead of letting the
       impact and sparkles land over the result screen. */
    this.stopEvolution();
    const nodes = [];
    this._capture = nodes;
    const total = Math.max(0.3, durationMs / 1000);
    const morph = total * 0.45;
    /* Gather: three soft notes opening up. */
    [262, 330, 392].forEach((freq, i) => this.tone(freq, 0.34, 'sine', 0.02, i * Math.min(0.16, morph * 0.18), 14));
    /* Charge: ticks that quicken and climb toward the beat. */
    let at = Math.min(0.1, morph * 0.2);
    let gap = 0.15;
    for (let i = 0; i < 22 && at < morph - 0.06; i += 1) {
      const progress = Math.min(1, at / Math.max(0.01, morph));
      this.tone(760 + progress * 940, 0.05, 'triangle', 0.011 + progress * 0.01, at, 130);
      at += gap;
      gap = Math.max(0.05, gap * 0.87);
    }
    /* Swell under the last third, so the beat has something to land on. */
    this.tone(138, morph * 0.82, 'sine', 0.045, 0.02, 190);
    /* Impact: sub drop plus a bright chord on the morph. */
    this.tone(320, Math.min(0.6, total * 0.3), 'sawtooth', 0.028, morph, -250);
    [523, 659, 784, 1046].forEach((freq, i) => this.tone(freq, 0.32, 'triangle', 0.03, morph + i * 0.014));
    /* Resolution: sparkles climbing into the result panel. */
    const tail = Math.max(0.24, total - morph);
    [0.16, 0.32, 0.48, 0.64].forEach((portion, i) => {
      this.tone(1046 + i * 150, 0.22, 'sine', 0.018, morph + tail * portion, 45);
    });
    this._capture = null;
    this._evolutionNodes = nodes;
    if (typeof Captions !== 'undefined') Captions.sound('evolution builds to a bright chord');
  },
  /* Fade out and stop whatever is left of the evolution cue. Safe to call when
     nothing is playing, and safe to call twice. */
  stopEvolution() {
    this._capture = null;
    const nodes = this._evolutionNodes || [];
    this._evolutionNodes = null;
    if (!nodes.length || !this.ctx) return;
    const now = this.ctx.currentTime;
    nodes.forEach(({ osc, gain }) => {
      try {
        if (gain && gain.gain) {
          const level = Math.max(0.0001, gain.gain.value || 0.0001);
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(level, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        }
        if (osc) osc.stop(now + 0.05);
      } catch { /* the node already finished */ }
    });
  },
  /* Soft bubble pop — the blip any button makes when nothing louder fired. */
  tap() {
    this.tone(360, 0.05, 'sine', 0.03, 0, 240);
    this.tone(560, 0.045, 'triangle', 0.016, 0.02, 90);
  },
  /* Bright bell for finishing a game or claiming a result. */
  chime() {
    [1046, 1318, 1568].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.03, i * 0.055));
    this.tone(2093, 0.24, 'sine', 0.012, 0.12);
    if (typeof Captions !== 'undefined') Captions.sound('completion chime');
  },
  summonOpen(count = 10) {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    const steps = count >= 100 ? 8 : count >= 50 ? 6 : count >= 25 ? 4 : 3;
    for (let i = 0; i < steps; i += 1) this.tone(98 + i * 26, 0.3, 'sine', 0.016 + i * 0.002, i * 0.15, 34);
    [523, 659, 784].forEach((freq, i) => this.tone(freq, 0.18, 'triangle', 0.02, 0.1 + i * 0.09));
    if (typeof Captions !== 'undefined') Captions.sound('summoning gate opens');
  },
  /* ---------- rarity cue voices ----------
     Each generator is one audible layer of a cue sheet. They keep their nodes in
     this._capture, so a skipped reveal can cut the tail instead of letting a
     Creator chord play over the next screen. */
  noiseBuffer() {
    if (this._noiseBuf) return this._noiseBuf;
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    this._noiseBuf = buffer;
    return buffer;
  },
  noise(at = 0, dur = 0.4, vol = 0.02, freq = 1400, q = 1) {
    if (!this.enabled() || !this.ctx) return;
    try {
      const ctx = this.ctx;
      const t0 = ctx.currentTime + at;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer();
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, t0);
      filter.Q.setValueAtTime(q, t0);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.09, dur * 0.3));
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filter).connect(gain).connect(ctx.destination);
      if (this._capture) this._capture.push({ osc: src, gain });
      src.start(t0);
      src.stop(t0 + dur + 0.02);
      this._lastAt = Date.now();
    } catch { /* ignore */ }
  },
  bell(freq = 880, dur = 0.5, vol = 0.03, at = 0) {
    this.tone(freq, dur, 'sine', vol, at);
    this.tone(freq * 2.01, dur * 0.6, 'sine', vol * 0.42, at + 0.004);
    this.tone(freq * 2.99, dur * 0.34, 'sine', vol * 0.18, at + 0.008);
  },
  pad(freq = 262, dur = 2, vol = 0.016, at = 0, detune = 7) {
    [-detune, 0, detune].forEach((cents) => {
      if (!this.enabled() || !this.ctx) return;
      try {
        const ctx = this.ctx;
        const t0 = ctx.currentTime + at;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        osc.detune.setValueAtTime(cents, t0);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.7, dur * 0.35));
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(gain).connect(ctx.destination);
        if (this._capture) this._capture.push({ osc, gain });
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
        this._lastAt = Date.now();
      } catch { /* ignore */ }
    });
  },
  sparkle(at = 0, count = 3, base = 1568, vol = 0.012, step = 0.09) {
    for (let i = 0; i < count; i += 1) {
      this.tone(base * Math.pow(1.122, i), 0.1, 'sine', vol, at + i * step, 30);
    }
  },
  thump(freq = 90, dur = 0.7, vol = 0.035, at = 0) {
    this.tone(freq, dur, 'sine', vol, at, -freq * 0.6);
    this.noise(at, Math.min(0.5, dur), vol * 0.7, 180, 0.8);
  },
  glide(from = 220, to = 880, dur = 1, type = 'sawtooth', vol = 0.02, at = 0) {
    if (!this.enabled() || !this.ctx) return;
    try {
      const ctx = this.ctx;
      const t0 = ctx.currentTime + at;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.2, dur * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      if (this._capture) this._capture.push({ osc, gain });
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
      this._lastAt = Date.now();
    } catch { /* ignore */ }
  },
  cueLayer(type, at, opts = {}) {
    switch (type) {
      case 'bell': this.bell(opts.freq || 880, opts.dur || 0.5, opts.vol || 0.03, at); break;
      case 'pad': this.pad(opts.freq || 262, opts.dur || 2, opts.vol || 0.016, at, opts.detune || 7); break;
      case 'sparkle': this.sparkle(at, opts.count || 3, opts.base || 1568, opts.vol || 0.012, opts.step || 0.09); break;
      case 'noise': this.noise(at, opts.dur || 0.4, opts.vol || 0.02, opts.freq || 1400, opts.q || 1); break;
      case 'thump': this.thump(opts.freq || 90, opts.dur || 0.7, opts.vol || 0.035, at); break;
      case 'glide': this.glide(opts.from || 220, opts.to || 880, opts.dur || 1, opts.type || 'sawtooth', opts.vol || 0.02, at); break;
      case 'tone': this.tone(opts.freq || 1200, opts.dur || 0.04, opts.type || 'square', opts.vol || 0.008, at, opts.glide || 0); break;
      case 'shimmer': {
        for (let i = 0; i < (opts.count || 5); i += 1) {
          this.tone((opts.base || 1568) * (1 + i * 0.19), 0.18, 'triangle', opts.vol || 0.009, at + i * (opts.step || 0.22), 24);
        }
        break;
      }
      default: break;
    }
  },
  /* The full rarity arrangement. A new cue replaces whatever is still ringing,
     so a results screen never carries two tiers at once. */
  /* Every cue gets a generation. A results screen that closes late, or a
     second summon that starts while the first is still ringing, can only
     release its own generation, never the cue that replaced it. */
  /* The Studio slider is a 0-100 preference; every layer scales by it. */
  summonVolume() {
    const raw = typeof state !== 'undefined' && state.theme ? state.theme.summonVolume : 100;
    return Math.max(0, Math.min(1, (Number.isFinite(raw) ? raw : 100) / 100));
  },
  _startCue(key) {
    this._summonCueGen = (this._summonCueGen || 0) + 1;
    this._summonCueKey = key;
    return this._summonCueGen;
  },
  summonCue(rarityKey = 'common') {
    if (!this.enabled()) return 0;
    this.init();
    if (!this.ctx) return 0;
    this._releaseSummonCue(this._summonCueNodes, 0.12);
    this._summonCueNodes = null;
    const key = SUMMON_CUE_SPECS[rarityKey] ? rarityKey : 'common';
    const spec = SUMMON_CUE_SPECS[key];
    const master = this.summonVolume();
    const nodes = [];
    this._capture = nodes;
    spec.layers.forEach(([type, at, opts]) => {
      const layer = opts || {};
      const vol = (Number.isFinite(layer.vol) ? layer.vol : 0.03) * master;
      this.cueLayer(type, at, Object.assign({}, layer, { vol }));
    });
    this._capture = null;
    this._summonCueNodes = nodes;
    this._startCue(key);
    if (typeof Captions !== 'undefined') Captions.sound(`${spec.theme} ${String(key).replace(/_/g, ' ')} summon cue`);
    return this._summonCueGen;
  },
  /* Opening hit: only the tier's earliest layer, trimmed under a second, so a
     cue-lab row tap auditions the first strike without the whole arrangement. */
  summonCueOpening(rarityKey = 'common') {
    if (!this.enabled()) return 0;
    this.init();
    if (!this.ctx) return 0;
    this._releaseSummonCue(this._summonCueNodes, 0.1);
    this._summonCueNodes = null;
    const key = SUMMON_CUE_SPECS[rarityKey] ? rarityKey : 'common';
    const spec = SUMMON_CUE_SPECS[key];
    const first = spec.layers.reduce((best, layer) => (!best || layer[1] < best[1] ? layer : best), null);
    if (!first) return 0;
    const nodes = [];
    this._capture = nodes;
    const type = first[0];
    const opts = first[2] || {};
    const hit = Object.assign({}, opts, { vol: (Number.isFinite(opts.vol) ? opts.vol : 0.03) * this.summonVolume() });
    if (Number.isFinite(hit.dur)) hit.dur = Math.min(hit.dur, 0.9);
    if (Number.isFinite(hit.step)) hit.step = Math.min(hit.step, 0.09);
    this.cueLayer(type, 0, hit);
    this._capture = null;
    this._summonCueNodes = nodes;
    this._startCue(key);
    if (typeof Captions !== 'undefined') Captions.sound(`${spec.theme} opening hit`);
    return this._summonCueGen;
  },
  summonCueOpeningLength(rarityKey = 'common') {
    const spec = SUMMON_CUE_SPECS[rarityKey] || SUMMON_CUE_SPECS.common;
    const first = spec.layers.reduce((best, layer) => (!best || layer[1] < best[1] ? layer : best), null);
    const opts = (first && first[2]) || {};
    const raw = Number.isFinite(opts.dur) ? opts.dur : 0.5;
    return Math.round(Math.min(0.9, Math.max(0.3, raw)) * 10) / 10;
  },
  summonCuePlaying(rarityKey = null) {
    if (!this._summonCueNodes || !this._summonCueNodes.length) return false;
    return rarityKey ? this._summonCueKey === rarityKey : true;
  },
  /* A soft release instead of a cut: each voice fades over `fade` seconds and
     disconnects after its tail, so stopping and restarting never clicks. */
  _releaseSummonCue(nodes, fade = 0.14) {
    if (!nodes || !nodes.length || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const span = Math.max(0.02, Number(fade) || 0.14);
    nodes.forEach(({ osc, gain }) => {
      try {
        if (gain && gain.gain) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value || 0.0001), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + span);
        }
        /* Setting stop before a layer's scheduled start simply cancels it, so
           the long tails of the higher tiers stop with the rest. */
        if (osc && osc.stop) osc.stop(now + span + 0.03);
      } catch { /* the node already finished */ }
    });
    setTimeout(() => {
      nodes.forEach(({ osc }) => { try { if (osc && osc.disconnect) osc.disconnect(); } catch { /* already gone */ } });
    }, Math.ceil(span * 1000) + 90);
  },
  summonCueLength(rarityKey = 'common') {
    const spec = SUMMON_CUE_SPECS[rarityKey] || SUMMON_CUE_SPECS.common;
    return spec.length;
  },
  /* Pass the generation returned by summonCue to release only that cue. With
     no argument every current cue is released, which is what dismissing the
     results screen wants. */
  stopSummonCue(gen) {
    this._capture = null;
    if (gen !== undefined && gen !== null && this._summonCueGen && gen !== this._summonCueGen) return;
    const nodes = this._summonCueNodes || [];
    this._summonCueNodes = null;
    this._summonCueKey = null;
    this._releaseSummonCue(nodes, 0.18);
  },
  /* One short, distinct voice per duel status, so a burn, a freeze and a
     cleanse are told apart by ear as well as by the battle log. */
  duelStatus(kind = 'burn', delay = 0) {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    /* Studio can mute duel feedback while the rest of the game keeps its sound. */
    if (typeof state !== 'undefined' && state.theme && state.theme.duelSounds === false) return;
    switch (kind) {
      case 'burn':
        this.noise(delay, 0.24, 0.018, 1250, 0.6);
        this.tone(260, 0.2, 'sawtooth', 0.02, delay, -150);
        break;
      case 'poison':
        this.tone(300, 0.09, 'square', 0.016, delay, -60);
        this.tone(236, 0.11, 'square', 0.015, delay + 0.1, -50);
        break;
      case 'freeze':
        this.bell(2093, 0.26, 0.02, delay);
        this.noise(delay, 0.16, 0.008, 5200, 2.4);
        break;
      case 'shield':
        this.tone(1760, 0.12, 'triangle', 0.022, delay);
        this.tone(2637, 0.16, 'triangle', 0.012, delay + 0.03);
        break;
      case 'regen':
        [523, 659, 784].forEach((freq, i) => this.tone(freq, 0.14, 'sine', 0.018, delay + i * 0.06));
        break;
      case 'reflect':
        this.tone(1568, 0.1, 'triangle', 0.016, delay);
        this.tone(1046, 0.16, 'triangle', 0.012, delay + 0.05, -300);
        break;
      case 'resist':
        this.tone(1318, 0.14, 'sine', 0.018, delay);
        this.tone(1760, 0.22, 'sine', 0.01, delay + 0.05);
        break;
      case 'cleanse':
        this.glide(659, 2093, 0.32, 'triangle', 0.016, delay);
        [1568, 2093].forEach((freq, i) => this.tone(freq, 0.16, 'sine', 0.01, delay + 0.12 + i * 0.07));
        break;
      default: break;
    }
    if (typeof Captions !== 'undefined') {
      const captions = {
        burn: 'burn crackles', poison: 'poison hisses', freeze: 'freeze locks in',
        shield: 'shield raised', regen: 'regen pulses', reflect: 'reflect glints',
        resist: 'statuses resisted', cleanse: 'cleanse sweeps the statuses away',
      };
      Captions.sound(captions[kind] || 'duel status');
    }
  },
  summonPity() {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    this.tone(92, 0.42, 'sawtooth', 0.018, 0, 40);
    [523, 659, 784, 1046].forEach((freq, i) => this.tone(freq, 0.16, 'square', 0.018, 0.12 + i * 0.08));
    if (typeof Captions !== 'undefined') Captions.sound('pity meter breaks into a jackpot');
  },
  summonResults() {
    if (!this.enabled()) return;
    this.init();
    if (!this.ctx) return;
    [523, 659, 784, 1046, 1318].forEach((freq, i) => this.tone(freq, 0.22, 'triangle', 0.03, i * 0.08));
    this.tone(1568, 0.36, 'sine', 0.018, 0.36);
    if (typeof Captions !== 'undefined') Captions.sound('summon results settle into a bright chord');
  },
  /* ---------- furniture (wireframe §17–19) ----------
     One entry point for every furniture sound. Throttles match the spec: the
     same cue cannot retrigger inside 400 ms, "upgrade ready" pings at most
     once per 8 s, a new cinematic releases the previous tail over 120 ms, and
     nothing plays while the tab is hidden. Every cue emits a caption. */
  furniture(kind = 'locked', opts = {}) {
    const spec = FURNITURE_CUES[kind];
    if (!spec || !this.enabled()) return 0;
    if (typeof document !== 'undefined' && document.hidden) return 0;
    this.init();
    if (!this.ctx) return 0;
    const now = Date.now();
    const gap = kind === 'upgrade-ready' ? FURNITURE_UPGRADE_GAP : FURNITURE_CUE_GAP;
    this._furnitureAt = this._furnitureAt || {};
    if (!opts.force && now - (this._furnitureAt[kind] || 0) < gap) return 0;
    this._furnitureAt[kind] = now;
    if (spec.cinematic) this.stopFurniture();
    this._furnitureGen = (this._furnitureGen || 0) + 1;
    const gen = this._furnitureGen;
    const nodes = [];
    this._capture = nodes;
    spec.layers.forEach(([type, at, layer]) => this.cueLayer(type, at, layer || {}));
    this._capture = null;
    this._furnitureNodes = nodes;
    if (spec.caption && typeof Captions !== 'undefined') Captions.sound(spec.caption);
    return gen;
  },
  /* Release only the generation passed in, so a card that closes late cannot
     cut a newer cue. With no argument every furniture cue is released. */
  stopFurniture(gen) {
    this._capture = null;
    if (gen !== undefined && gen !== null && this._furnitureGen && gen !== this._furnitureGen) return;
    const nodes = this._furnitureNodes || [];
    this._furnitureNodes = null;
    this._releaseSummonCue(nodes, 0.12);
  },
  furniturePlaying() {
    return !!(this._furnitureNodes && this._furnitureNodes.length);
  },
  furnitureLength(kind = 'locked') {
    return (FURNITURE_CUES[kind] || FURNITURE_CUES.locked).length;
  },
  /* One delegated listener turns every button press into a short blip, and the
     first real gesture is what unlocks the AudioContext (browsers block audio
     until then). A handler that already played its own sound wins: tone()
     stamps _lastAt, so the generic blip is skipped instead of stacking. */
  bindInteractions(root = document) {
    if (this._uiBound) return;
    this._uiBound = true;
    root.addEventListener('click', (event) => {
      const node = event.target instanceof Element ? event.target : null;
      const control = node && node.closest('button, [role="button"], summary, input[type="checkbox"], input[type="radio"], a.btn');
      if (!control || control.disabled || control.getAttribute('aria-disabled') === 'true') return;
      if (!this.enabled()) return;
      this.init();
      const now = Date.now();
      if (now - (this._lastAt || 0) < 60) return;
      if (now - (this._lastTap || 0) < 40) return;
      this._lastTap = now;
      this.tap();
    }, { passive: true });
  },
};
