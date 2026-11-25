/* Static game data: elements, breeds, palettes, genetics, goods, tasks, themes. */

const ELEMENTS = {
  ember: {
    name: 'Ember', primary: '#ff9a5a', light: '#ffd6a5', deep: '#a63516', accent: '#ffcf3f',
    trait: 'Toasty — loves warmth and spicy snacks.',
    blurb: 'A cinder-hearted spark that never sits still.',
    greeting: 'I’m basically a campfire with legs!',
    likes: 'Sun Nectar',
  },
  tide: {
    name: 'Tide', primary: '#56c8e8', light: '#c8f4ff', deep: '#15607d', accent: '#7cf0d0',
    trait: 'Tidal — feels every mood like a wave.',
    blurb: 'A pocket ocean with a very loud splash.',
    greeting: 'Everything feels better with a little splash.',
    likes: 'Moon Berry',
  },
  gale: {
    name: 'Gale', primary: '#a8e6cf', light: '#e4fff5', deep: '#2f7a63', accent: '#7fd1ff',
    trait: 'Breezy — drifts off mid-sentence.',
    blurb: 'A soft gust that collects clouds and secrets.',
    greeting: 'I followed a leaf here. Good leaf.',
    likes: 'Cloud Feast',
  },
  bloom: {
    name: 'Bloom', primary: '#8fe07a', light: '#e5ffc9', deep: '#357a2e', accent: '#ffd166',
    trait: 'Verdant — grows a little happier in sunshine.',
    blurb: 'A tiny meadow that walks around on its own.',
    greeting: 'Did you know moss makes a great pillow?',
    likes: 'Moon Berry',
  },
  volt: {
    name: 'Volt', primary: '#ffd84d', light: '#fff4b8', deep: '#8a5a00', accent: '#ff9f1c',
    trait: 'Charged — extra bouncy after a good snack.',
    blurb: 'A walking spark with zero volume control.',
    greeting: 'I have SO much to tell you and it’s all one word!',
    likes: 'Star Pop',
  },
  frost: {
    name: 'Frost', primary: '#bfe6ff', light: '#f2fbff', deep: '#3a6b86', accent: '#9ad7ff',
    trait: 'Glacial — cool-headed, warm-hearted.',
    blurb: 'A snowflake that refused to melt.',
    greeting: 'I saved you a snowflake. Don’t breathe on it.',
    likes: 'Warm Soup',
  },
  dusk: {
    name: 'Dusk', primary: '#b79cff', light: '#e8dcff', deep: '#4a2a7a', accent: '#ff8ad8',
    trait: 'Nocturnal — blooms after dark.',
    blurb: 'A little shadow that hums when nobody’s looking.',
    greeting: 'The moon and I have an understanding.',
    likes: 'Warm Soup',
  },
  radiant: {
    name: 'Radiant', primary: '#ffe3a3', light: '#fff8e0', deep: '#8a5a00', accent: '#ffb3d9',
    trait: 'Luminous — glows brighter around friends.',
    blurb: 'A pocket sunrise with a sweet tooth.',
    greeting: 'You look like a good moment. I’m keeping you.',
    likes: 'Sun Nectar',
  },
  demon: {
    name: 'Demon', primary: '#c9455c', light: '#ffc2cc', deep: '#4d1024', accent: '#ff9f1c',
    trait: 'Infernal — runs hot and holds a grudge for exactly four seconds.',
    blurb: 'A little troublemaker with a very soft spot for you.',
    greeting: 'I broke something. You should be proud.',
    likes: 'Warm Soup',
  },
  angel: {
    name: 'Angel', primary: '#ffe9c9', light: '#fffdf5', deep: '#a98b63', accent: '#ffe066',
    trait: 'Guardian — hovers nearby when you are having a day.',
    blurb: 'A pocket choir with feathers in its hair.',
    greeting: 'I saved you a seat on my cloud.',
    likes: 'Cloud Feast',
  },
  air: {
    name: 'Air', primary: '#cfe9f7', light: '#f7fdff', deep: '#5d7f92', accent: '#a8e6cf',
    trait: 'Weightless — drifts three steps ahead of itself.',
    blurb: 'A friendly breeze that forgot to land.',
    greeting: 'I brought you a gust. It’s shaped like you.',
    likes: 'Star Pop',
  },
  water: {
    name: 'Water', primary: '#4fa8f0', light: '#d6efff', deep: '#144a7a', accent: '#8be9ff',
    trait: 'Fluid — changes shape to fit the mood of the room.',
    blurb: 'Cool, clear, and impossible to hold for long.',
    greeting: 'Let it flow. That’s my whole philosophy.',
    likes: 'Moon Berry',
  },
  earth: {
    name: 'Earth', primary: '#b08a5a', light: '#e8d3b0', deep: '#5c4225', accent: '#8fe07a',
    trait: 'Grounded — the steadiest friend in the Hollow.',
    blurb: 'A warm handful of soil with a garden growing on it.',
    greeting: 'Sit. Stay a while. Everything grows better rested.',
    likes: 'Warm Soup',
  },
  honey: {
    name: 'Honey', primary: '#f2b23c', light: '#ffe9b0', deep: '#8a5410', accent: '#ffd166',
    trait: 'Sweet — sticky fingers, sweeter intentions.',
    blurb: 'A golden little daydream that buzzes when happy.',
    greeting: 'You smell like a flower. That’s a compliment.',
    likes: 'Sun Nectar',
  },
  pond: {
    name: 'Pond', primary: '#5fbf9a', light: '#d7f7e8', deep: '#1f5c47', accent: '#ff9ec7',
    trait: 'Still — calm on top, a whole world underneath.',
    blurb: 'A lily pad with a heartbeat and a lot of tiny secrets.',
    greeting: 'I have frogs. Do you want to meet them?',
    likes: 'Moon Berry',
  },
  hero: {
    name: 'Superhero', primary: '#5a7bff', light: '#dbe4ff', deep: '#23307a', accent: '#ffd166',
    trait: 'Valiant — strikes a pose before every nap.',
    blurb: 'A caped defender of snacks and bedtime.',
    greeting: 'Never fear! I am already here. Mostly.',
    likes: 'Star Pop',
  },
  ants: {
    name: 'Ants', primary: '#8a5a3c', light: '#e0b48c', deep: '#3f2415', accent: '#ffd166',
    trait: 'Colonial — never goes anywhere without the crew.',
    blurb: 'One sprite, many legs, unshakable teamwork.',
    greeting: 'We carried a crumb all the way here. For you.',
    likes: 'Honey Drop',
  },
  fire: {
    name: 'Fire', primary: '#ff6b3d', light: '#ffd6a5', deep: '#7a1e0a', accent: '#ffe066',
    trait: 'Blazing — loud, warm, and always up for a race.',
    blurb: 'A campfire with opinions and very fast feet.',
    greeting: 'I’m not too hot! You’re just too far away.',
    likes: 'Warm Soup',
  },
  splash: {
    name: 'Splash', primary: '#67d5e8', light: '#e0fbff', deep: '#1c6070', accent: '#b69cff',
    trait: 'Bubbly — arrives with a splash and leaves with one.',
    blurb: 'A rainbow trapped in a very excited puddle.',
    greeting: 'Surprise! You’re wet now. You’re welcome.',
    likes: 'Dew Fizz',
  },
  slime: {
    name: 'Slime', primary: '#a4e857', light: '#eaffc7', deep: '#4a7a1e', accent: '#7affd8',
    trait: 'Squishy — a hug that hugs back.',
    blurb: 'A wobbly green friend with a talent for relaxing.',
    greeting: 'Sit in the puddle with me. It’s nice down here.',
    likes: 'Dew Fizz',
  },
  rock: {
    name: 'Rock', primary: '#9aa0ad', light: '#e3e6ee', deep: '#4a4f5c', accent: '#c9a26b',
    trait: 'Sturdy — will not be moved. Will be bribed with snacks.',
    blurb: 'A boulder that decided it wanted a name.',
    greeting: 'I have been here a long time. I like it here.',
    likes: 'Warm Soup',
  },
  stone: {
    name: 'Stone', primary: '#c9b79a', light: '#f2e8d8', deep: '#6b5c46', accent: '#9aa0ad',
    trait: 'Ancient — carries old runes and older jokes.',
    blurb: 'A carved little relic that hums when no one is listening.',
    greeting: 'I remember when this Hollow was a field. I was a nicer rock.',
    likes: 'Honey Drop',
  },
  bug: {
    name: 'Bug', primary: '#b8d94a', light: '#f0ffc2', deep: '#4a5c14', accent: '#ff5e8a',
    trait: 'Curious — six legs, zero sense of danger.',
    blurb: 'A garden explorer with a shell full of spots.',
    greeting: 'I found a leaf! It’s the best leaf!',
    likes: 'Moon Berry',
  },
  bunny: {
    name: 'Bunny', primary: '#f7d9e3', light: '#fff3f8', deep: '#8a5a72', accent: '#ffb3d1',
    trait: 'Hoppy — naps in the sun, zooms at dusk.',
    blurb: 'A soft-eared speedster with a cotton tail.',
    greeting: 'I heard a snack wrapper. I came as fast as I could.',
    likes: 'Sun Nectar',
  },
  cloud: {
    name: 'Cloud', primary: '#dfe9ff', light: '#ffffff', deep: '#6a7ba8', accent: '#bfe6ff',
    trait: 'Floaty — made of fog and daydreams.',
    blurb: 'A fat little cumulus with a rainy-day heart.',
    greeting: 'I made it rain on myself. Worth it.',
    likes: 'Dew Fizz',
  },
  crystal: {
    name: 'Crystal', primary: '#c9a6ff', light: '#f0e6ff', deep: '#4a2a7a', accent: '#7affd8',
    trait: 'Faceted — refracts feelings into colors.',
    blurb: 'A geode with a very glittery personality.',
    greeting: 'Light me up and I’ll show you a rainbow.',
    likes: 'Moon Cake',
  },
  mushroom: {
    name: 'Mushroom', primary: '#e88a8a', light: '#ffe4dd', deep: '#7a2f2f', accent: '#fff3d6',
    trait: 'Sporey — grows little friends wherever it sits.',
    blurb: 'A damp, cozy cap with a secret mycelium network.',
    greeting: 'Wanna hear a secret? The whole forest is listening.',
    likes: 'Warm Soup',
  },
  candy: {
    name: 'Candy', primary: '#ffb3d1', light: '#fff0f6', deep: '#a13b63', accent: '#8be9ff',
    trait: 'Sugared — a tiny sugar rush with a lollipop hobby.',
    blurb: 'A wrapped sweet that decided to walk around.',
    greeting: 'I’m made of sugar and extremely good ideas.',
    likes: 'Star Cookie',
  },
  wolf: {
    name: 'Wolf', primary: '#8b9bb4', light: '#e6edf7', deep: '#3c4a63', accent: '#ffe066',
    trait: 'Loyal — howls at the moon and at good news.',
    blurb: 'A silver-coated pack of one, waiting for its person.',
    greeting: 'I saved you a spot in the pack. It’s the best spot.',
    likes: 'Warm Soup',
  },
  tiger: {
    name: 'Tiger', primary: '#f2a23c', light: '#ffe1b0', deep: '#7a3b0a', accent: '#2f2a33',
    trait: 'Fierce — pounces first, apologizes adorably.',
    blurb: 'A striped little hunter with a purr like a motor.',
    greeting: 'I am the apex predator of this blanket.',
    likes: 'Cloud Feast',
  },
  bear: {
    name: 'Bear', primary: '#a97b52', light: '#e8cbaa', deep: '#4f331d', accent: '#ffd166',
    trait: 'Cozy — hibernates through every boring part.',
    blurb: 'A warm, round friend with a honey habit.',
    greeting: 'I brought you a berry. I ate two. Sorry.',
    likes: 'Sun Nectar',
  },
  frog: {
    name: 'Frog', primary: '#7fd15a', light: '#dcffc4', deep: '#2f6b1e', accent: '#ffe066',
    trait: 'Bouncy — cannot sit still for a whole story.',
    blurb: 'A pond-green hopper with a very long tongue.',
    greeting: 'Ribbit means hello. It also means snack.',
    likes: 'Dew Fizz',
  },
  pig: {
    name: 'Pig', primary: '#ffa8bf', light: '#ffe0ea', deep: '#a13b5b', accent: '#ffd166',
    trait: 'Snuffly — finds the best snacks by smell.',
    blurb: 'A round pink optimist with a curly tail.',
    greeting: 'I found a truffle! I don’t know what it is!',
    likes: 'Honey Drop',
  },
  cat: {
    name: 'Cat', primary: '#f0c48a', light: '#fff2dc', deep: '#8a5a2b', accent: '#ff8fb2',
    trait: 'Independent — loves you on a strict schedule.',
    blurb: 'A whiskered little monarch with a soft side.',
    greeting: 'You may pet me. Once. Then again.',
    likes: 'Sun Nectar',
  },
  cow: {
    name: 'Cow', primary: '#f2efe8', light: '#ffffff', deep: '#6b6455', accent: '#ffb3d1',
    trait: 'Gentle — gives the best sleepy hugs.',
    blurb: 'A black-and-white sweetheart with a bell.',
    greeting: 'Moo. That means I saved you a flower.',
    likes: 'Moon Berry',
  },
  fish: {
    name: 'Fish', primary: '#5ec8d8', light: '#d6fbff', deep: '#1f5f70', accent: '#ffd166',
    trait: 'Dreamy — forgets things after three seconds.',
    blurb: 'A glassy little swimmer in a bubble of its own.',
    greeting: 'I found a shiny rock! Wait. Where am I?',
    likes: 'Dew Fizz',
  },
  bat: {
    name: 'Bat', primary: '#8f7ac9', light: '#e0d6ff', deep: '#3c2a66', accent: '#ff8ad8',
    trait: 'Nocturnal — wide awake when the house is quiet.',
    blurb: 'A tiny night flyer with a squeaky laugh.',
    greeting: 'I can hear your heartbeat. It’s a good one.',
    likes: 'Moon Cake',
  },
  butterfly: {
    name: 'Butterfly', primary: '#ffb3d1', light: '#fff0f6', deep: '#a13b63', accent: '#8be9ff',
    trait: 'Fluttery — lands on the nicest thing in the room.',
    blurb: 'A pocket garden that learned to fly.',
    greeting: 'I picked you. Out of everyone. Good choice, me.',
    likes: 'Sun Nectar',
  },
  pillow: {
    name: 'Pillow', primary: '#e8e4ff', light: '#ffffff', deep: '#7a74a8', accent: '#b69cff',
    trait: 'Sleepy — a professional napper.',
    blurb: 'A soft little lump that dreams in pastel.',
    greeting: 'Five more minutes. Or five more hours.',
    likes: 'Moon Cake',
  },
  dreameater: {
    name: 'Dream Eater', primary: '#6b5bb5', light: '#cfc0ff', deep: '#241a4a', accent: '#ffe066',
    trait: 'Mysterious — snacks on nightmares, shares good dreams.',
    blurb: 'A quiet shadow with a sky full of stars inside.',
    greeting: 'Bad dream? I already ate it. Tasted like static.',
    likes: 'Moon Cake',
  },
  lucky: {
    name: 'Lucky', primary: '#ffd166', light: '#fff6cc', deep: '#8a5a00', accent: '#8fe07a',
    trait: 'Fortunate — finds coins in the strangest places.',
    blurb: 'A golden charm with a four-leaf clover and a wink.',
    greeting: 'Today’s a good day. I checked twice.',
    likes: 'Star Cookie',
  },
  banana: {
    name: 'Banana', primary: '#ffe066', light: '#fff6b0', deep: '#b8860b', accent: '#8fe07a',
    trait: 'Slippery — leaves a peel wherever it goes.',
    blurb: 'A cheerful yellow crescent with big snack energy.',
    greeting: 'I am technically a berry. Please respect that.',
    likes: 'Cloud Feast',
  },
  apple: {
    name: 'Apple', primary: '#e8574a', light: '#ffc2b8', deep: '#7a1e1a', accent: '#8fe07a',
    trait: 'Crisp — keeps the doctor away and the friends close.',
    blurb: 'A shiny red sweetheart with a leaf behind one ear.',
    greeting: 'I brought you a snack. It’s me. I’m the snack.',
    likes: 'Sun Nectar',
  },
  ice: {
    name: 'Ice', primary: '#bfe9ff', light: '#f0fcff', deep: '#3a6b86', accent: '#e8fbff',
    trait: 'Chilly — cool under pressure, colder without a hug.',
    blurb: 'A little glacier with a sparkle in every facet.',
    greeting: 'I’m not cold. You’re just warm-blooded.',
    likes: 'Dew Fizz',
  },
  cherry: {
    name: 'Cherry', primary: '#e8425e', light: '#ffc2cf', deep: '#7a1430', accent: '#8fe07a',
    trait: 'Sweet — two of a kind and twice the trouble.',
    blurb: 'A pair of ruby twins sharing one stem.',
    greeting: 'We came as a set. You get both of us.',
    likes: 'Star Cookie',
  },
  cocoa: {
    name: 'Hot Cocoa', primary: '#a9714b', light: '#f3d7bd', deep: '#4a2a1a', accent: '#ffb3d1',
    trait: 'Comforting — warms up any room it enters.',
    blurb: 'A steamy little mug with marshmallows on top.',
    greeting: 'Sit down. I made you a mug. It’s mostly marshmallows.',
    likes: 'Warm Soup',
  },
  pizza: {
    name: 'Pizza', primary: '#f2b23c', light: '#ffe9b0', deep: '#a33b16', accent: '#d94a3a',
    trait: 'Generous — always saves you a slice.',
    blurb: 'A walking deep-dish with extra everything.',
    greeting: 'I saved you a slice! It was warm. Earlier.',
    likes: 'Cloud Feast',
  },
  fishy: {
    name: 'Fishy', primary: '#4fc3d9', light: '#d9fbff', deep: '#155a6b', accent: '#ffb86b',
    trait: 'Bubbly — narrates everything it does with a splash.',
    blurb: 'A round little swimmer with a heart-shaped bubble and no sense of direction.',
    greeting: 'I found a puddle! It’s my house now.',
    likes: 'Dew Fizz',
  },
  striker: {
    name: 'Striker', primary: '#ff7a45', light: '#ffd9c2', deep: '#7a2a0a', accent: '#2f2a33',
    trait: 'Competitive — turns every snack into a tournament.',
    blurb: 'A tiny forward with a football at its feet and a headband of pure focus.',
    greeting: 'One-on-one. You and me. For the last cookie.',
    likes: 'Star Pop',
  },
  aura: {
    name: 'Aura', primary: '#c9a6ff', light: '#f2e8ff', deep: '#4a2a7a', accent: '#7affd8',
    trait: 'Radiant — glows a little brighter when you’re near.',
    blurb: 'A quiet ring of light with a soft spot for quiet mornings.',
    greeting: 'I brought you some calm. It’s in my pocket.',
    likes: 'Honey Tea',
  },
  six: {
    name: 'Six', primary: '#e8574a', light: '#ffd0c9', deep: '#5c1410', accent: '#ffe066',
    trait: 'Numerical — counts everything, twice.',
    blurb: 'A lucky little digit with a hexagon halo and a sixth sense for snacks.',
    greeting: 'I counted your footsteps. Sixteen. Nice.',
    likes: 'Star Cookie',
  },
  seven: {
    name: 'Seven', primary: '#ffd166', light: '#fff6cc', deep: '#8a5a00', accent: '#38bdf8',
    trait: 'Fortunate — finds luck in the oddest places.',
    blurb: 'A golden numeral that insists seven is the best number.',
    greeting: 'Seven is lucky. I’m seven. Therefore, snack.',
    likes: 'Honey Drop',
  },
  king: {
    name: 'King', primary: '#ffcf3f', light: '#fff3b8', deep: '#7a4a00', accent: '#b69cff',
    trait: 'Regal — rules the Hollow from a pile of blankets.',
    blurb: 'A tiny monarch with a heavy crown and a heavier nap schedule.',
    greeting: 'You may approach. Bring grapes.',
    likes: 'Cloud Feast',
  },
  queen: {
    name: 'Queen', primary: '#ff9ec7', light: '#ffe3f0', deep: '#8a2a52', accent: '#ffd166',
    trait: 'Sovereign — kind, commanding, and always right.',
    blurb: 'A rose-gold royal with a tiara and a talent for gentle orders.',
    greeting: 'The court is in session. The agenda is snacks.',
    likes: 'Sun Nectar',
  },
  ghost: {
    name: 'Ghost', primary: '#cfe9f7', light: '#ffffff', deep: '#5d7f92', accent: '#b69cff',
    trait: 'Spectral — walks through doors, apologizes after.',
    blurb: 'A soft little haunt that just wants to be included.',
    greeting: 'I’m not scary! I’m just cold and see-through.',
    likes: 'Moon Cake',
  },
  skull: {
    name: 'Skull', primary: '#e8e6d8', light: '#fffdf2', deep: '#6b6455', accent: '#9aa0ad',
    trait: 'Bony — rattles when it laughs.',
    blurb: 'A cheerful bag of bones with a grin that never quits.',
    greeting: 'I’ve been dead for ages and I still love snacks.',
    likes: 'Warm Soup',
  },
  death: {
    name: 'Death', primary: '#6b5b7a', light: '#cfc4dd', deep: '#241a33', accent: '#8fe07a',
    trait: 'Inevitable — patient, polite, and surprisingly warm.',
    blurb: 'A tiny reaper with a scythe and a soft spot for goodbyes.',
    greeting: 'No rush. I brought a blanket.',
    likes: 'Warm Soup',
  },
  lootllama: {
    name: 'Lootin’ Llama', primary: '#f2d9a3', light: '#fff6e0', deep: '#8a6a2b', accent: '#4fc3d9',
    trait: 'Generous — carries gifts for everyone.',
    blurb: 'A woolly piñata with saddlebags full of surprises.',
    greeting: 'I brought you loot! It’s mostly crumbs. Still loot.',
    likes: 'Cloud Feast',
  },
  duck: {
    name: 'Duck', primary: '#ffd84d', light: '#fff6b8', deep: '#a35f00', accent: '#ff9f1c',
    trait: 'Paddly — follows you in a perfect line.',
    blurb: 'A bright little duck with a bill made for snacking.',
    greeting: 'Quack. That’s a compliment where I’m from.',
    likes: 'Dew Fizz',
  },
  peely: {
    name: 'Peeky Peely', primary: '#ffe066', light: '#fff8c2', deep: '#a86a00', accent: '#8a5a2b',
    trait: 'Peeky — always finds the best hiding spot.',
    blurb: 'A banana-headed legend with a peel crown and a talent for peekaboo.',
    greeting: 'I’m the whole bunch. The whole bunch is me.',
    likes: 'Sun Nectar',
  },
  dream: {
    name: 'Dream', primary: '#b8a6ff', light: '#eee6ff', deep: '#3f2a7a', accent: '#7affd8',
    trait: 'Sleepy — half here, half in a cloud.',
    blurb: 'A lavender daydream with a halo of Zzz and a pocket full of stars.',
    greeting: 'I saved you a dream. It has a tiny you in it.',
    likes: 'Moon Cake',
  },
  zeropoint: {
    name: 'Zero Point', primary: '#4a7bff', light: '#c2d6ff', deep: '#0a1a5c', accent: '#7affd8',
    trait: 'Infinite — a quiet center of everything.',
    blurb: 'A shard of the void with orbit rings and a very calm expression.',
    greeting: 'Everything comes from here. Even breakfast.',
    likes: 'Star Cookie',
  },
  punk: {
    name: 'Punk', primary: '#ff5e8a', light: '#ffd0dc', deep: '#7a1430', accent: '#2f2a33',
    trait: 'Loud — turns every nap into a mosh pit.',
    blurb: 'A hot-pink rebel with a mohawk and a studded collar.',
    greeting: 'Rules are just suggestions with better PR.',
    likes: 'Berry Fizz',
  },
  batman: {
    name: 'Batman', primary: '#3a3a4a', light: '#9aa0b4', deep: '#14141c', accent: '#ffd166',
    trait: 'Brooding — protects the Hollow after dark.',
    blurb: 'A caped cowl with pointed ears and a very serious bedtime.',
    greeting: 'The night is quiet. I am not. I’m hungry.',
    likes: 'Warm Soup',
  },
  superman: {
    name: 'Superman', primary: '#3a6bff', light: '#c2d6ff', deep: '#142a8a', accent: '#e8574a',
    trait: 'Heroic — helps first, poses second.',
    blurb: 'A blue-and-red defender with a cape and a helping hand.',
    greeting: 'Never fear. I already saved you a seat.',
    likes: 'Cloud Feast',
  },
  ironmouse: {
    name: 'Ironmouse', primary: '#ffb3d1', light: '#fff0f6', deep: '#a13b63', accent: '#e8e6f0',
    trait: 'Fierce — small voice, enormous heart.',
    blurb: 'A pink mouse with a headset and a will of iron.',
    greeting: 'I’m streaming this. Say hi to chat.',
    likes: 'Star Cookie',
  },
  bullet: {
    name: 'Bullet', primary: '#d9a34a', light: '#ffe9b0', deep: '#6b4510', accent: '#e8574a',
    trait: 'Fast — gone before the echo.',
    blurb: 'A brass little speedster shaped like a very good idea.',
    greeting: 'I’m already there. You’re just late.',
    likes: 'Star Pop',
  },
  burntpb: {
    name: 'TheBurntPeanut', primary: '#b07a4a', light: '#e8cbaa', deep: '#3f2415', accent: '#2f2a33',
    trait: 'Crispy — a kitchen accident with a heart of gold.',
    blurb: 'A smoky little toast with burnt edges and peanut-butter dreams.',
    greeting: 'I’m not burnt. I’m caramelized.',
    likes: 'Sun Nectar',
  },
  headshot: {
    name: 'Headshot', primary: '#e8574a', light: '#ffc2b8', deep: '#5c1410', accent: '#ffffff',
    trait: 'Precise — never misses a snack.',
    blurb: 'A little sharpshooter with a crosshair halo and perfect aim.',
    greeting: 'You’re in my sights. In a friendly way.',
    likes: 'Star Pop',
  },
  cube: {
    name: 'Cube', primary: '#a06bff', light: '#e6d6ff', deep: '#3a1a7a', accent: '#7affd8',
    trait: 'Blocky — thinks in right angles.',
    blurb: 'A floating box with pixel corners and a very square outlook.',
    greeting: 'I contain multitudes. Mostly snacks.',
    likes: 'Star Cookie',
  },
  bombjr: {
    name: 'Bomb Jr.', primary: '#4a4a5c', light: '#b8b8c9', deep: '#14141c', accent: '#ff9f1c',
    trait: 'Explosive — a tiny firecracker with a short fuse.',
    blurb: 'A round little bomb with a spark on top and a big laugh.',
    greeting: 'I’m stable. Probably. Run.',
    likes: 'Honey Drop',
  },
  grim: {
    name: 'Grim Reaper', primary: '#5a7a5a', light: '#c9e0c2', deep: '#1f2f1f', accent: '#8fe07a',
    trait: 'Patient — harvests only what is ready.',
    blurb: 'A hooded reaper with a scythe and a soft spot for fallen leaves.',
    greeting: 'Your time is not up. Your snack time is.',
    likes: 'Warm Soup',
  },
  squibbly: {
    name: 'Squibbly', primary: '#7fa85a', light: '#e0f2c2', deep: '#3f5a1e', accent: '#c9a26b',
    trait: 'Rooted — grows on you, literally.',
    blurb: 'A tiny willow with a trunk full of feelings and leaves full of secrets.',
    greeting: 'I grew you a leaf. It’s shaped like a heart.',
    likes: 'Moon Berry',
  },
  onewish: {
    name: 'One Wish Willow', primary: '#a8d982', light: '#efffdc', deep: '#3f5a1e', accent: '#ffe066',
    trait: 'Wishful — grants one small wish per day.',
    blurb: 'A mythic willow with a single star and a patient heart.',
    greeting: 'Make it a good one. I’m listening.',
    likes: 'Moon Cake',
  },
  klombo: {
    name: 'Klombo', primary: '#7fb8d9', light: '#dcf4ff', deep: '#2b5f7a', accent: '#ffb3d1',
    trait: 'Ancient — big feet, bigger heart.',
    blurb: 'A gentle dino with a frill and a stomp you can feel in your chest.',
    greeting: 'I stomped a path to your door. You’re welcome.',
    likes: 'Cloud Feast',
  },
  crown: {
    name: 'Crown', primary: '#ffd166', light: '#fff6cc', deep: '#8a5a00', accent: '#b69cff',
    trait: 'Royal — the crown chose the sprite.',
    blurb: 'A living crown with jewels, sparkle, and a need to be admired.',
    greeting: 'Heavy is the head. Lucky for you, I have no head.',
    likes: 'Star Cookie',
  },
  spookydash: {
    name: 'Spooky Dash', primary: '#b8a6ff', light: '#f0e8ff', deep: '#3f2a7a', accent: '#ff8ad8',
    trait: 'Fast — a ghost with somewhere to be.',
    blurb: 'A speedy specter that leaves a trail of purple afterimages.',
    greeting: 'Boo! Sorry. Habit. Also, race you.',
    likes: 'Berry Fizz',
  },
  jazz: {
    name: 'Jazz Jackrabbit', primary: '#5ec86b', light: '#dcffd6', deep: '#1f5c2b', accent: '#ffd166',
    trait: 'Jazzy — moves like music.',
    blurb: 'A green hare with long ears, goggles, and a soundtrack.',
    greeting: 'Everything’s better with a saxophone. Even breakfast.',
    likes: 'Sun Nectar',
  },
  crash: {
    name: 'Crash Bandicoot', primary: '#e88a3c', light: '#ffd6a5', deep: '#7a3b0a', accent: '#ffd166',
    trait: 'Spinning — chaos with a smile.',
    blurb: 'An orange bandicoot with wild ears and a talent for trouble.',
    greeting: 'I spun into a wall. Worth it.',
    likes: 'Cloud Feast',
  },
  blinky: {
    name: 'Blinky', primary: '#ff7a9c', light: '#ffd6e2', deep: '#7a1e3c', accent: '#38bdf8',
    trait: 'Flickery — here, then not.',
    blurb: 'A pink ghost with a pixel trail and a blink-and-miss-it laugh.',
    greeting: 'Did you see me? I was there. Then I wasn’t.',
    likes: 'Star Cookie',
  },
  deer: {
    name: 'The Deer', primary: '#c9a26b', light: '#f2e0c2', deep: '#5c4225', accent: '#8fe07a',
    trait: 'Graceful — quiet steps, deep roots.',
    blurb: 'A forest monarch with branching antlers and gentle eyes.',
    greeting: 'The forest says hello. I translated.',
    likes: 'Moon Berry',
  },
  sonic: {
    name: 'Sonic', primary: '#3a7bff', light: '#c2d6ff', deep: '#0a2a8a', accent: '#ffd166',
    trait: 'Speedy — cannot sit still for one second.',
    blurb: 'A blue blur with swept-back quills and red shoes.',
    greeting: 'Gotta go. But first, snack.',
    likes: 'Star Pop',
  },
  honeypot: {
    name: 'Honey Pot', primary: '#f2b23c', light: '#ffe9b0', deep: '#8a5410', accent: '#ff8ad8',
    trait: 'Sticky — sweet and impossible to put down.',
    blurb: 'A golden pot of honey with a bee friend and a dripping rim.',
    greeting: 'I brought honey. It’s everywhere now.',
    likes: 'Sun Nectar',
  },
  dumpster: {
    name: 'Dumpster Dive', primary: '#8a9ba8', light: '#d6e0e8', deep: '#3c4a55', accent: '#ffd166',
    trait: 'Scrappy — finds treasure in other people’s trash.',
    blurb: 'A raccoon with a lid, a mask, and a nose for loot.',
    greeting: 'One man’s trash is my whole personality.',
    likes: 'Star Cookie',
  },
  tails: {
    name: 'Tails', primary: '#f2a23c', light: '#ffe1b0', deep: '#7a3b0a', accent: '#ffffff',
    trait: 'Clever — two tails, twice the ideas.',
    blurb: 'A twin-tailed fox with a big brain and a bigger heart.',
    greeting: 'I built you something! It’s mostly tape.',
    likes: 'Cloud Feast',
  },
  shadow: {
    name: 'Shadow', primary: '#2f2a3a', light: '#8a8aa8', deep: '#0a0a12', accent: '#e8574a',
    trait: 'Edgy — broods with style.',
    blurb: 'A dark hedgehog with red streaks and a chaos emerald.',
    greeting: 'I’m not angry. This is just my face.',
    likes: 'Warm Soup',
  },
  killswitch: {
    name: 'Killswitch', primary: '#e8574a', light: '#ffc2b8', deep: '#5c1410', accent: '#2f2a33',
    trait: 'Locked — one tap and the game changes.',
    blurb: 'A red reticle with a switch and a very final vibe.',
    greeting: 'I have one setting. It’s on.',
    likes: 'Star Pop',
  },
  morgana: {
    name: 'Morgana', primary: '#6b5b8a', light: '#d6c9e8', deep: '#241a3a', accent: '#ff8ad8',
    trait: 'Sly — a panther in a cat’s clothes.',
    blurb: 'A dusk-colored feline with a mask and a heart-tipped tail.',
    greeting: 'You may pet me. I may allow it.',
    likes: 'Moon Cake',
  },
  vampire: {
    name: 'Vampire', primary: '#8a5a7a', light: '#e8c9dd', deep: '#3a1430', accent: '#e8574a',
    trait: 'Nocturnal — up all night, sleeps all day.',
    blurb: 'A little count with a high collar and very polite fangs.',
    greeting: 'I don’t bite. Unless it’s a snack.',
    likes: 'Moon Cake',
  },
  onigiri: {
    name: 'Onigiri', primary: '#f2efe8', light: '#ffffff', deep: '#6b6455', accent: '#2f3a2a',
    trait: 'Snacky — a rice ball with a dream.',
    blurb: 'A warm little rice triangle wrapped in nori and good intentions.',
    greeting: 'I’m the snack. Please don’t eat me. Please do.',
    likes: 'Moon Berry',
  },
  bushranger: {
    name: 'Bush Ranger', primary: '#6b8a4a', light: '#d9e8c2', deep: '#2f3f1e', accent: '#ffd166',
    trait: 'Stealthy — hides in plain sight, mostly in hedges.',
    blurb: 'A leafy ranger with a slouch hat and a nose for trails.',
    greeting: 'I found a trail! It leads to the kitchen.',
    likes: 'Moon Berry',
  },
  jonesy: {
    name: 'Jonesy', primary: '#ffd166', light: '#fff6cc', deep: '#8a5a00', accent: '#38bdf8',
    trait: 'Default — the friendliest face in the Hollow.',
    blurb: 'A cap-wearing buddy with a backpack and a dance emote.',
    greeting: 'New here? Me too. Let’s be bad at this together.',
    likes: 'Cloud Feast',
  },
  blaster: {
    name: '8-Bit Blaster', primary: '#7a5cff', light: '#d6ccff', deep: '#2a1a7a', accent: '#7affd8',
    trait: 'Retro — everything is better in 8 bits.',
    blurb: 'A pixelated pal with an antenna and a tiny blaster.',
    greeting: 'Press start. I’m already playing.',
    likes: 'Star Pop',
  },
  adventure: {
    name: 'Adventure', primary: '#c9a26b', light: '#f2e0c2', deep: '#5c4225', accent: '#38bdf8',
    trait: 'Curious — every walk is an expedition.',
    blurb: 'A little explorer with a compass and a map to nowhere.',
    greeting: 'I brought a map. We’re already lost. It’s great.',
    likes: 'Sun Nectar',
  },
  stormscout: {
    name: 'Storm Scout', primary: '#6b5b9a', light: '#d6c9e8', deep: '#241a4a', accent: '#ffd166',
    trait: 'Stormy — arrives with thunder and leaves with rain.',
    blurb: 'A hooded scout with a personal storm cloud overhead.',
    greeting: 'Forecast says snacks. I checked.',
    likes: 'Warm Soup',
  },
  overshield: {
    name: 'Overshield', primary: '#5ec8d8', light: '#d6fbff', deep: '#1f5f70', accent: '#8be9ff',
    trait: 'Protective — a bubble of calm in a loud world.',
    blurb: 'A shimmering guardian wrapped in its own shield.',
    greeting: 'You’re safe with me. I checked the perimeter.',
    likes: 'Cloud Feast',
  },
  megaman: {
    name: 'Mega Man', primary: '#4a8aff', light: '#c2dcff', deep: '#143a8a', accent: '#8be9ff',
    trait: 'Upgraded — built for fighting, wired for friendship.',
    blurb: 'A blue robot with a helmet fin and a buster arm.',
    greeting: 'Mega Buster online. Hug mode engaged.',
    likes: 'Star Cookie',
  },
  birthday: {
    name: 'Birthday', primary: '#ff8ad8', light: '#ffe0f4', deep: '#7a1e5c', accent: '#ffd166',
    trait: 'Festive — every day is a party.',
    blurb: 'A confetti-covered little cake with a party hat and one candle.',
    greeting: 'Surprise! It’s your birthday. I checked. It is.',
    likes: 'Star Cookie',
  },
  meowscles: {
    name: 'Meowscles', primary: '#e8c9a3', light: '#fff0dc', deep: '#7a5a2b', accent: '#ff8ad8',
    trait: 'Swole — a cat with a fitness routine.',
    blurb: 'A buff feline with a headband and a very serious stretching regimen.',
    greeting: 'Never skip snack day.',
    likes: 'Cloud Feast',
  },
  boss: {
    name: 'Boss', primary: '#3a3a4a', light: '#c9c9d6', deep: '#14141c', accent: '#ffd166',
    trait: 'Commanding — runs the Hollow like a very small corporation.',
    blurb: 'A sharp little executive with a gold chain and a corner office in your pocket.',
    greeting: 'I called a meeting. It’s about snacks.',
    likes: 'Cloud Feast',
  },
  vini: {
    name: 'Vini Jr.', primary: '#ffd166', light: '#fff6cc', deep: '#1f6b3a', accent: '#2f8a4a',
    trait: 'Playful — celebrates every little win with a dance.',
    blurb: 'A golden forward with quick feet and a brighter smile.',
    greeting: 'Goooal! Oh, that was just a snack. Still counts.',
    likes: 'Sun Nectar',
  },
  pollo: {
    name: 'Pollo', primary: '#f2efe8', light: '#ffffff', deep: '#a35f00', accent: '#e8574a',
    trait: 'Clucky — has an opinion about everything.',
    blurb: 'A fluffy chicken with a red comb and a talent for drama.',
    greeting: 'I’m not chicken. I’m poultry with confidence.',
    likes: 'Moon Berry',
  },
  wick: {
    name: 'John Wick', primary: '#2f2a33', light: '#b8b4c8', deep: '#0a0a12', accent: '#e8574a',
    trait: 'Focused — calm, quiet, and very good at fetch.',
    blurb: 'A sharp-suited legend with a soft spot for a certain puppy.',
    greeting: 'I’m retired. Unless you have a ball.',
    likes: 'Warm Soup',
  },
  pumpkin: {
    name: 'Pumpkin', primary: '#f28a2c', light: '#ffd9a8', deep: '#7a3b0a', accent: '#5f8a3c',
    trait: 'Carved — always in a spooky mood.',
    blurb: 'A round harvest gourd with a candle glow and a crooked grin.',
    greeting: 'I’m not scary. I’m festive.',
    likes: 'Moon Cake',
  },
  santa: {
    name: 'Santa', primary: '#e8574a', light: '#ffe0dc', deep: '#7a1e1a', accent: '#ffffff',
    trait: 'Generous — arrives with a sack of snacks.',
    blurb: 'A jolly little gift-giver with a beard and a bottomless bag.',
    greeting: 'Ho ho ho! You’ve been nice. Mostly.',
    likes: 'Star Cookie',
  },
  cupid: {
    name: 'Cupid', primary: '#ff9ec7', light: '#ffe3f0', deep: '#8a2a52', accent: '#ffd166',
    trait: 'Romantic — matches everyone with everyone.',
    blurb: 'A tiny matchmaker with a bow, wings, and excellent aim.',
    greeting: 'I already paired you with three sprites. You’re welcome.',
    likes: 'Star Cookie',
  },
  charm: {
    name: 'Charm', primary: '#7affd8', light: '#e6fffa', deep: '#1f6b5a', accent: '#c9a6ff',
    trait: 'Lucky — collects little trinkets that hum.',
    blurb: 'A sparkling charm bracelet with a mind of its own.',
    greeting: 'Found a charm! It’s yours. Probably.',
    likes: 'Honey Drop',
  },
  snow: {
    name: 'Snow', primary: '#e4f3ff', light: '#ffffff', deep: '#5c7fa6', accent: '#7fc9ff',
    trait: 'Frosty — happiest when the weather turns cold.',
    blurb: 'A freshly fallen snowball with coal buttons and a carrot nose.',
    greeting: 'I brought the weather with me. You’re welcome.',
    likes: 'Hot Cocoa',
  },
  zombie: {
    name: 'Zombie', primary: '#8fbf6a', light: '#e2ffcf', deep: '#355b28', accent: '#b06bff',
    trait: 'Shambly — slow, sweet, and always hungry.',
    blurb: 'A mossy little shuffler with a bandage and a very big heart.',
    greeting: 'Brains? No thanks. Snacks? Yes please.',
    likes: 'Hearty Stew',
  },
  undead: {
    name: 'Undead', primary: '#c9c3e8', light: '#f4f0ff', deep: '#3a2f55', accent: '#7affd8',
    trait: 'Restless — flickers between here and somewhere else.',
    blurb: 'A drifting soul with a broken halo and a tail of mist.',
    greeting: 'I’m not gone. I’m just practicing.',
    likes: 'Moon Cake',
  },
  starfish: {
    name: 'Starfish', primary: '#ff9f7a', light: '#ffe0cc', deep: '#8a3b2a', accent: '#ffd166',
    trait: 'Tidepool — five arms and zero personal space.',
    blurb: 'A five-armed hug that walked out of the sea.',
    greeting: 'Five arms. So many hugs. Prepare yourself.',
    likes: 'River Fillet',
  },
  pika: {
    name: 'Pika', primary: '#ffe45e', light: '#fffbd0', deep: '#8a5a00', accent: '#ff6b4a',
    trait: 'Charged — cheeks crackle when excited.',
    blurb: 'A yellow pocket bolt with a lightning-bolt tail.',
    greeting: 'Pika-pi! That means hello, probably.',
    likes: 'Star Pop',
  },
  unicorn: {
    name: 'Unicorn', primary: '#fff4fb', light: '#ffffff', deep: '#7a4f83', accent: '#ff9ecb',
    trait: 'Wishful — grants tiny wishes, mostly snack-related.',
    blurb: 'A pastel dream with a golden horn and a mane full of starlight.',
    greeting: 'Make a wish. No pressure. I’m very good at this.',
    likes: 'Star Pop',
  },
  devil: {
    name: 'Devil', primary: '#e0574f', light: '#ffb3a1', deep: '#4a1218', accent: '#2b2440',
    trait: 'Bargainer — every favor comes with fine print.',
    blurb: 'A little red troublemaker with a spade tail and a crooked grin.',
    greeting: 'I made you a deal. You already agreed. Probably.',
    likes: 'Hot Cocoa',
  },
  yoga: {
    name: 'Yoga', primary: '#bfe3c0', light: '#f4fff1', deep: '#3f6b4f', accent: '#ffb3d1',
    trait: 'Centered — breathes through conflict, snacks, and Mondays.',
    blurb: 'A serene little soul sitting in lotus pose with a third eye for calm.',
    greeting: 'Breathe in. Breathe out. Now pass the snacks. Mindfully.',
    likes: 'Moon Berry',
  },
  shark: {
    name: 'Shark', primary: '#7fa8c9', light: '#dfefff', deep: '#2c4a66', accent: '#9fe8ff',
    trait: 'Toothy — friendly, but always circling the pantry.',
    blurb: 'A sleek blue fin with a big grin and an even bigger appetite.',
    greeting: 'I smelled snacks. I have a very good nose for snacks.',
    likes: 'River Fillet',
  },
  whitewhale: {
    name: 'White Whale', primary: '#f4fbff', light: '#ffffff', deep: '#4a6b8a', accent: '#9fd8ff',
    trait: 'Songful — hums the deep ocean into your Hollow.',
    blurb: 'A pale giant with a misty spout and a song you feel in your ribs.',
    greeting: 'I brought you a song from the bottom of the sea.',
    likes: 'Dew Fizz',
  },
  dragon: {
    name: 'Dragon', primary: '#6fd6a8', light: '#d8fff0', deep: '#1e5a48', accent: '#ffd166',
    trait: 'Hoarding — collects shiny things and naps on them.',
    blurb: 'A little emerald wyrm with golden horns and wings too big for their body.',
    greeting: 'I’m not hoarding. I’m curating.',
    likes: 'Hearty Stew',
  },
  darkjoker: {
    name: 'Darker Joker', primary: '#6b4a9e', light: '#e6d6ff', deep: '#241436', accent: '#8fe07a',
    trait: 'Wildcard — never plays the same trick twice.',
    blurb: 'A grinning trickster in a three-pointed hat with a deck up their sleeve.',
    greeting: 'Pick a card. Any card. No, that one was mine.',
    likes: 'Star Pop',
  },
  jackskull: {
    name: 'Jack Skull', primary: '#f2e6c8', light: '#fffaf0', deep: '#3a2a1a', accent: '#ff9f43',
    trait: 'Hollow — laughs at the dark, mostly because it lives there.',
    blurb: 'A cheerful bonehead with a bow tie and a crown of pumpkin fire.',
    greeting: 'Boo! …Too much? I’ve been practicing.',
    likes: 'Moon Cake',
  },
  sally: {
    name: 'Sally', primary: '#bfe6e0', light: '#f4fffb', deep: '#2f5a55', accent: '#e8574a',
    trait: 'Stitched — held together by thread and stubborn hope.',
    blurb: 'A soft ragdoll with yarn hair, patchwork seams, and a heart that won’t quit.',
    greeting: 'I sewed myself back together. Again. Worth it.',
    likes: 'Moon Berry',
  },
  keke: {
    name: 'Keke', primary: '#ffb3d1', light: '#fff0f7', deep: '#8a3b63', accent: '#ffd166',
    trait: 'Sparkly — arrives with glitter and a plan.',
    blurb: 'A bow-wearing little superstar with a wand and no indoor voice.',
    greeting: 'Hiiii! I brought glitter. It’s already everywhere.',
    likes: 'Star Pop',
  },
  bestie: {
    name: 'Bestie', primary: '#ff9f7a', light: '#ffe6d6', deep: '#8a3b2a', accent: '#ffd166',
    trait: 'Loyal — your name is already in their phone as “bestie”.',
    blurb: 'A heart-shaped hug with a friendship bracelet and a balloon.',
    greeting: 'Bestie! I saved you a seat. And a snack.',
    likes: 'Sun Nectar',
  },
  dog: {
    name: 'Dog', primary: '#d9a066', light: '#ffe7c2', deep: '#5a3818', accent: '#7fc9ff',
    trait: 'Good — sits, stays, and forgives you for stepping on their paw.',
    blurb: 'A floppy-eared pup with a collar and a tail that never stops.',
    greeting: 'You’re home! I only cried a little.',
    likes: 'River Fillet',
  },
  karen: {
    name: 'Karen', primary: '#c9a6ff', light: '#f0e6ff', deep: '#3a2a5a', accent: '#ffd166',
    trait: 'Assertive — has a strong opinion about the music volume.',
    blurb: 'A bob-haired sprite with hoop earrings and a very sensible handbag.',
    greeting: 'Excuse me. I’d like to speak to whoever is in charge of snacks.',
    likes: 'Hot Cocoa',
  },
  motherearth: {
    name: 'Mother Earth', primary: '#7fc9a3', light: '#e6fff2', deep: '#1e5a48', accent: '#8be9ff',
    trait: 'Nurturing — everything they touch grows a little greener.',
    blurb: 'A gentle green giant with a crown of leaves and a world in their belly.',
    greeting: 'Hello, little one. The garden missed you.',
    likes: 'Moon Berry',
  },
  werewolf: {
    name: 'Werewolf', primary: '#8d93a8', light: '#e6e9f4', deep: '#333849', accent: '#ffd166',
    trait: 'Moonbound — gets a little wild when the moon is out.',
    blurb: 'A shaggy howler with silver fur, a moonlit grin, and a torn ear.',
    greeting: 'Awooo! …Sorry. Reflex.',
    likes: 'Juicy Drumstick',
  },
  normal: {
    name: 'Normal', primary: '#c9c3b6', light: '#f6f2e9', deep: '#5a544a', accent: '#8be9ff',
    trait: 'Unremarkable — and completely fine with that.',
    blurb: 'A perfectly ordinary little friend with a sensible face and a favorite mug.',
    greeting: 'Hi. I’m Normal. That’s the whole bit.',
    likes: 'Warm Soup',
  },
  gummybear: {
    name: 'Gummy Bear', primary: '#ff8fb2', light: '#ffd9e6', deep: '#8a2f4e', accent: '#8fe07a',
    trait: 'Squishy — bounces back from everything, slightly sticky.',
    blurb: 'A translucent little bear with sugar sparkle and a wobble in every step.',
    greeting: 'Squish! I’m made of snacks. Please don’t eat me.',
    likes: 'Star Pop',
  },
  muddy: {
    name: 'Muddy', primary: '#9c6b43', light: '#e6c9a5', deep: '#3f2a1a', accent: '#7fbf6a',
    trait: 'Mucky — happiest when there is a puddle to sit in.',
    blurb: 'A soft brown splodge with a mossy tuft, a drippy grin, and absolutely no regrets.',
    greeting: 'I found a puddle. It’s mine now.',
    likes: 'Hearty Stew',
  },
  spot: {
    name: 'Spot', primary: '#f0d6b3', light: '#fff5e3', deep: '#4a3327', accent: '#b96a4b',
    trait: 'Patchy — follows you around and sits exactly where you are walking.',
    blurb: 'A round little pup covered in spots, with one ear that never quite stands up.',
    greeting: 'You stepped on my tail. I forgive you. Mostly.',
    likes: 'Juicy Drumstick',
  },
  frozen: {
    name: 'Frozen', primary: '#a8e6f5', light: '#f0feff', deep: '#245a7a', accent: '#bff0ff',
    trait: 'Cryogenic — takes naps in the freezer and wakes up refreshed.',
    blurb: 'A shivery little sprite with icicle horns and a permanent cloud of frost around its cheeks.',
    greeting: 'C-c-cold? I’m not cold. You’re cold.',
    likes: 'Hot Cocoa',
  },
  sixtyseven: {
    name: '67', primary: '#ff9f43', light: '#ffe3b0', deep: '#3a2410', accent: '#ff4d6d',
    trait: 'Clutch — shows up in the last second and somehow saves the run.',
    blurb: 'A loud little mascot with a scoreboard, a jersey, and a number it will not stop saying.',
    greeting: 'Six! Seven! …Sixty-seven. That’s me.',
    likes: 'Star Pop',
  },
  creeper: {
    name: 'Creeper', primary: '#6fbf5a', light: '#c8f5a8', deep: '#1f3d1a', accent: '#a8e063',
    trait: 'Hissy — startles easily and apologizes immediately after.',
    blurb: 'A blocky little ambush artist with a square face and a very short fuse.',
    greeting: 'Sssss… just kidding. Probably.',
    likes: 'Cloud Feast',
  },
  lion: {
    name: 'Lion', primary: '#f2b84b', light: '#ffe6a8', deep: '#6b3d12', accent: '#d97a2b',
    trait: 'Regal — expects a sunbeam and a snack, in that order.',
    blurb: 'A golden cub with a fluffy mane and a roar that is still mostly a squeak.',
    greeting: 'The sun is mine. You can share it.',
    likes: 'Juicy Drumstick',
  },
  panda: {
    name: 'Panda', primary: '#e8e6e0', light: '#fffdf7', deep: '#2b2b33', accent: '#8fe07a',
    trait: 'Chill — eats bamboo, naps, repeats.',
    blurb: 'A round black-and-white friend with a bamboo leaf and a permanent snack.',
    greeting: 'I’m not lazy. I’m conserving friendship.',
    likes: 'Leafy Greens',
  },
  penguin: {
    name: 'Penguin', primary: '#3f5c78', light: '#d6ecff', deep: '#182736', accent: '#ffd166',
    trait: 'Waddly — slides everywhere and calls it flying.',
    blurb: 'A tiny tuxedo bird with orange feet and a very serious waddle.',
    greeting: 'I can fly. Just not upward.',
    likes: 'River Fillet',
  },
  owl: {
    name: 'Owl', primary: '#a97a52', light: '#ecd6b8', deep: '#4a2f1e', accent: '#ffd166',
    trait: 'Nocturnal — asks who, then answers itself.',
    blurb: 'A fluff-feathered night scholar with huge eyes and a very quiet opinion.',
    greeting: 'Who? …Yes, exactly.',
    likes: 'Moon Cake',
  },
  snake: {
    name: 'Snake', primary: '#7fbf6a', light: '#d9ffc9', deep: '#2e5a2a', accent: '#ffd166',
    trait: 'Slinky — sheds a little every season.',
    blurb: 'A long green noodle with a forked tongue and a suspiciously innocent smile.',
    greeting: 'I’m not sneaking. I’m arriving quietly.',
    likes: 'Cloud Dumplings',
  },
  spider: {
    name: 'Spider', primary: '#6d5a8a', light: '#d8cde8', deep: '#241a3a', accent: '#ff8ad8',
    trait: 'Webby — knits friendships and traps.',
    blurb: 'A fuzzy little weaver with six bright eyes and eight busy legs.',
    greeting: 'Don’t mind the webs. They’re load-bearing.',
    likes: 'Star Pop',
  },
  crab: {
    name: 'Crab', primary: '#f16f5c', light: '#ffd2c9', deep: '#7a2a22', accent: '#ffd166',
    trait: 'Pinchy — sidesteps every problem.',
    blurb: 'A little red rock-pool scuttler with two very important claws.',
    greeting: 'I’m not pinching. I’m holding your hand. Hard.',
    likes: 'River Fillet',
  },
  dolphin: {
    name: 'Dolphin', primary: '#6fb6d9', light: '#d6f2ff', deep: '#20506b', accent: '#8be9ff',
    trait: 'Bubbly — chats in clicks and squeaks.',
    blurb: 'A sleek blue leaper with a permanent grin and a splashy tail.',
    greeting: 'Race you to the horizon! …Or the puddle.',
    likes: 'Berry Fizz',
  },
  sheep: {
    name: 'Sheep', primary: '#e8e2d4', light: '#fffdf6', deep: '#6b6255', accent: '#ffb3d1',
    trait: 'Woolly — counts themself to sleep and loses track every time.',
    blurb: 'A cloud with legs, a pink bow, and a secret talent for napping anywhere.',
    greeting: 'Baa. That means I missed you.',
    likes: 'Leafy Greens',
  },
  bull: {
    name: 'Bull', primary: '#b8644a', light: '#ffd9c2', deep: '#4a2418', accent: '#ffd166',
    trait: 'Stubborn — will not move until snacks are discussed.',
    blurb: 'A broad-shouldered sweetheart with curved horns and a tiny gold nose ring.',
    greeting: 'I’m not angry. This is just my face.',
    likes: 'Hearty Stew',
  },
  bossbaby: {
    name: 'Boss Baby', primary: '#3f5c78', light: '#d6ecff', deep: '#182736', accent: '#ffd166',
    trait: 'Executive — schedules meetings about nap time.',
    blurb: 'A very small boss in a very sharp suit, with a briefcase and a pacifier.',
    greeting: 'Your performance this quarter has been… adequate.',
    likes: 'Cloud Feast',
  },
  hero6: {
    name: 'Hero6', primary: '#4f89c9', light: '#c9e8ff', deep: '#1c3b63', accent: '#ffd166',
    trait: 'Heroic — answers every call, even the snack ones.',
    blurb: 'A caped defender with a six-point emblem and a chin built for dramatic poses.',
    greeting: 'Never fear! Hero6 is… also a little hungry.',
    likes: 'Golden Curry',
  },
  wrixel: {
    name: 'Wrixel', primary: '#7affc7', light: '#e6fff4', deep: '#1f6b52', accent: '#b69cff',
    trait: 'Glitchy — flickers between frames when excited.',
    blurb: 'A walking sprite sheet that escaped its own game.',
    greeting: 'I’m not lagging. I’m buffering dramatically.',
    likes: 'Star Pop',
  },
  phantom: {
    name: 'Phantom', primary: '#8a8ab8', light: '#dedeff', deep: '#2a2a4a', accent: '#7affd8',
    trait: 'Unseen — steps through walls, apologizes after.',
    blurb: 'A masked drifter with a coat full of quiet static.',
    greeting: 'You didn’t see me. That was the whole point.',
    likes: 'Moon Cake',
  },
  mali: {
    name: 'Mali', primary: '#f2a45a', light: '#ffe0bd', deep: '#7a3b12', accent: '#8be9ff',
    trait: 'Sunforged — happiest with sand underfoot.',
    blurb: 'A dune runner with a bright sash and brighter aim.',
    greeting: 'The sun and I have a deal. You get the shade.',
    likes: 'Sun Nectar',
  },
  bastian: {
    name: 'Bastian', primary: '#8fb3d9', light: '#e6f3ff', deep: '#33506b', accent: '#ffd166',
    trait: 'Steadfast — stands between you and the weather.',
    blurb: 'A little knight with a borrowed shield and enormous conviction.',
    greeting: 'Nothing gets past me. Except snacks. Snacks get past.',
    likes: 'Hearty Stew',
  },
  k1ttyw1ns: {
    name: 'K1TTYW1NS', primary: '#ffb3d1', light: '#fff0f6', deep: '#a13b63', accent: '#8be9ff',
    trait: 'Broadcasting — narrates its own naps to an audience.',
    blurb: 'A pink cat with a headset, a following, and no indoor voice.',
    greeting: 'Chat says you’re nice. Chat is usually right.',
    likes: 'Star Cookie',
  },
  gracecrowne: {
    name: 'Grace Crowne', primary: '#c9a6ff', light: '#f0e6ff', deep: '#4a2a7a', accent: '#ffd166',
    trait: 'Regal — accepts tribute in the form of snacks.',
    blurb: 'A crowned diplomat who rules a very small, very polite court.',
    greeting: 'You may sit. The throne is mostly cushions anyway.',
    likes: 'Honey Tea',
  },
  geno: {
    name: 'Geno', primary: '#c9455c', light: '#ffd0d8', deep: '#3a0f1a', accent: '#ffd166',
    trait: 'Overriding — rewrites the rules, then complains about them.',
    blurb: 'A masked architect of the season, wrapped in red static.',
    greeting: 'I wrote this encounter. You’re doing better than I planned.',
    likes: 'Star Pop',
  },
  nicorobin: {
    name: 'Nico Robin', primary: '#7a5ca8', light: '#e6d9f5', deep: '#2f1f4a', accent: '#ffb86b',
    trait: 'Scholarly — reads ruins like bedtime stories.',
    blurb: 'An archaeologist who finds history in every brick.',
    greeting: 'This place has a past. I’ve already read it.',
    likes: 'Honey Tea',
  },
  ace: {
    name: 'Portgas D. Ace', primary: '#ff7a45', light: '#ffd6b8', deep: '#7a2a0a', accent: '#ffd166',
    trait: 'Blazing — runs hot and grins through it.',
    blurb: 'A flame-hearted traveler with a hat full of fire.',
    greeting: 'I brought the heat. And a snack. Priorities.',
    likes: 'Juicy Drumstick',
  },
  cuddle: {
    name: 'Cuddle Team Leader', primary: '#ff9ec7', light: '#ffe3f0', deep: '#a13b63', accent: '#ffd166',
    trait: 'Supportive — leads every charge with a group hug.',
    blurb: 'A pink bear commander with a heart patch and a plan.',
    greeting: 'Team huddle! You’re already in it. No takebacks.',
    likes: 'Star Cookie',
  },
  charlotte: {
    name: 'Charlotte', primary: '#ff8fb2', light: '#ffe0ea', deep: '#8a2a52', accent: '#7affd8',
    trait: 'Remixed — never plays the same riff twice.',
    blurb: 'A bow-wearing remix with a soundtrack and a wink.',
    greeting: 'New verse, same me. Mostly.',
    likes: 'Berry Fizz',
  },
  captainx: {
    name: 'Captain X', primary: '#3f5c78', light: '#d6ecff', deep: '#182736', accent: '#ffd166',
    trait: 'Nautical — navigates by snacks alone.',
    blurb: 'A tricorn-hatted captain with a treasure map to the pantry.',
    greeting: 'X marks the spot. The spot is the kitchen.',
    likes: 'River Fillet',
  },
  kirby: {
    name: 'Kirby', primary: '#ffb3d1', light: '#ffe6f0', deep: '#a13b63', accent: '#ff5e8a',
    trait: 'Inhaling — copies whatever it likes, snacks included.',
    blurb: 'A round pink friend with a bottomless appetite and a star for a heart.',
    greeting: 'Poyo! That means hello. It also means snack.',
    likes: 'Star Cookie',
  },
};
const ELEMENT_KEYS = Object.keys(ELEMENTS);

const BREEDS = {
  puff: {
    name: 'Puff', kicker: 'Cuddle breed', icon: '●', perk: 'Bond grows 25% faster', bondMod: 1.25,
    desc: 'Round, soft, and built for holding.',
  },
  sprig: {
    name: 'Sprig', kicker: 'Leaf breed', icon: '🌱', perk: 'Earns 15% more XP', xpMod: 1.15,
    desc: 'Tall ears, leafy habits, excellent listener.',
  },
  flit: {
    name: 'Flit', kicker: 'Wing breed', icon: '🪽', perk: 'Joy fades 30% slower', joyMod: 0.7,
    desc: 'Tiny wings, big opinions about weather.',
  },
  horn: {
    name: 'Horn', kicker: 'Horn breed', icon: '🌙', perk: 'Hunger fades 25% slower', hungerMod: 0.75,
    desc: 'A stubborn little tank with a gentle streak.',
  },
  blob: {
    name: 'Blob', kicker: 'Goo breed', icon: '🫧', perk: 'Stays clean 40% longer', cleanMod: 0.6,
    desc: 'Wobbly, squishy, and weirdly good at hugs.',
  },
  wisp: {
    name: 'Wisp', kicker: 'Dream breed', icon: '✨', perk: 'Energy fades 35% slower', energyMod: 0.65,
    desc: 'Floats a thumb above the ground. Nobody knows why.',
  },
  bun: {
    name: 'Bun', kicker: 'Cloud breed', icon: '🐰', perk: 'Joy fades 20% slower', joyMod: 0.8,
    desc: 'Tall ears, soft hops, and a talent for finding the sunniest spot.',
  },
  fin: {
    name: 'Fin', kicker: 'Reef breed', icon: '🐟', perk: 'Hunger fades 20% slower', hungerMod: 0.8,
    desc: 'A sleek little swimmer with a tail that never stops wagging.',
  },
  shell: {
    name: 'Shell', kicker: 'Stone breed', icon: '🐚', perk: 'Stays clean 30% longer', cleanMod: 0.7,
    desc: 'A sturdy spiral shell with a very soft centre.',
  },
  star: {
    name: 'Star', kicker: 'Spark breed', icon: '⭐', perk: 'Earns 12% more XP', xpMod: 1.12,
    desc: 'A bright little constellation with a pointy grin.',
  },
  orb: {
    name: 'Orb', kicker: 'Pebble breed', icon: '⚪', perk: 'Bond grows 20% faster', bondMod: 1.2,
    desc: 'Almost a perfect circle, with a very serious face.',
  },
  lanky: {
    name: 'Lanky', kicker: 'Reed breed', icon: '🌾', perk: 'Energy fades 25% slower', energyMod: 0.75,
    desc: 'Tall, narrow, and always slightly leaning somewhere.',
  },
  chonk: {
    name: 'Chonk', kicker: 'Pudding breed', icon: '🍮', perk: 'Stays clean 25% longer', cleanMod: 0.75,
    desc: 'Wide at the middle and proud of every gram of it.',
  },
  tuft: {
    name: 'Tuft', kicker: 'Thistle breed', icon: '🪶', perk: 'Joy fades 25% slower', joyMod: 0.75,
    desc: 'A soft body with three unruly tufts on top.',
  },
  wedge: {
    name: 'Wedge', kicker: 'Peak breed', icon: '⛰️', perk: 'Hunger fades 30% slower', hungerMod: 0.7,
    desc: 'A tall peak with a summit for a head and weather of its own.',
  },
  pear: {
    name: 'Pear', kicker: 'Orchard breed', icon: '🍐', perk: 'Bond grows 18% faster', bondMod: 1.18,
    desc: 'Narrow at the shoulders, generous at the hips, sweet all over.',
  },
  pill: {
    name: 'Pill', kicker: 'Capsule breed', icon: '💊', perk: 'Energy fades 28% slower', energyMod: 0.72,
    desc: 'A neat rounded column that never seems to run out of charge.',
  },
  bean: {
    name: 'Bean', kicker: 'Seed breed', icon: '🫘', perk: 'Joy fades 28% slower', joyMod: 0.72,
    desc: 'A curled little seed that hums when it is content.',
  },
  diamond: {
    name: 'Diamond', kicker: 'Facet breed', icon: '💎', perk: 'Stays clean 26% longer', cleanMod: 0.74,
    desc: 'Cut corners, sharp shoulders, and a very polished attitude.',
  },
  drop: {
    name: 'Drop', kicker: 'Dew breed', icon: '💧', perk: 'Earns 9% more XP', xpMod: 1.09,
    desc: 'A teardrop that decided gravity was optional.',
  },

  mochi: {
    name: 'Mochi', kicker: 'Rice-cake breed', icon: '🍡',
    desc: 'A soft wide cushion that jiggles happily when picked up.',
  },
  gem: {
    name: 'Gem', kicker: 'Crystal breed', icon: '💠',
    desc: 'Cut corners, polished sides, and a very serious sparkle.',
  },
  tower: {
    name: 'Tower', kicker: 'Spire breed', icon: '🗼',
    desc: 'Tall and steady, built like a lighthouse with opinions.',
  },
  petal: {
    name: 'Petal', kicker: 'Bloom breed', icon: '🌷',
    desc: 'Narrow at the top and flared at the bottom, always in bloom.',
  },
  cone: {
    name: 'Cone', kicker: 'Pine breed', icon: '🌲',
    desc: 'A pointy little evergreen that smells faintly of forest.',
  },
  pillow: {
    name: 'Pillow', kicker: 'Plush breed', icon: '🛏️',
    desc: 'Wide, squashy, and made for a nap at any hour.',
  },
};
Object.assign(BREEDS, {
  cushion: {
    name: 'Cushion', kicker: 'Sofa breed', icon: '🛋️', perk: 'Bond grows 30% faster', bondMod: 1.3,
    desc: 'Wide, soft and shaped for two: the Hollow’s favourite place to sit.',
  },
  urchin: {
    name: 'Urchin', kicker: 'Reef breed', icon: '🌊', perk: 'Energy fades 30% slower', energyMod: 0.7,
    desc: 'Round with a hedge of soft spikes and a very calm opinion about tides.',
  },
  lantern: {
    name: 'Lantern', kicker: 'Hearth breed', icon: '🏮', perk: 'Earns 14% more XP', xpMod: 1.14,
    desc: 'A hanging little lamp-body that glows brighter the happier it gets.',
  },
  caterpillar: {
    name: 'Caterpillar', kicker: 'Meadow breed', icon: '🐛', perk: 'Hunger fades 28% slower', hungerMod: 0.72,
    desc: 'A long, patient stack of segments that moves in one happy ripple.',
  },
  cloudlet: {
    name: 'Cloudlet', kicker: 'Sky breed', icon: '☁️', perk: 'Joy fades 30% slower', joyMod: 0.7,
    desc: 'A small weather system that decided to be a pet instead.',
  },
  floof: {
    name: 'Floof', kicker: 'Fluff breed', icon: '🫧', perk: 'Joy fades 30% slower', joyMod: 0.7,
    desc: 'A round, tufty ball of softness with a curl on top and feet you can barely see.',
  },
  ragfluff: {
    name: 'Ragfluff', kicker: 'Ragged breed', icon: '🧵', perk: 'Joy fades 26% slower', joyMod: 0.74,
    desc: 'A round fluff with a raggedy crown of tufts and soft stripes brushed through its coat.',
  },
  /* Round puff breeds: same round fluff body, different temperaments. */
  werewolfpuff: {
    name: 'Werewolf Puff', kicker: 'Howl breed', icon: '🐺', perk: 'Energy fades 28% slower', energyMod: 0.72,
    desc: 'A round puff with tufted wolf ears and a moonlit howl it practises at dusk.',
  },
  zombiepuff: {
    name: 'Zombie Puff', kicker: 'Stitched breed', icon: '🧟', perk: 'Hunger fades 30% slower', hungerMod: 0.7,
    desc: 'A round puff held together by tidy stitches, always shuffling toward a snack.',
  },
  vampirepuff: {
    name: 'Vampire Puff', kicker: 'Velvet breed', icon: '🧛', perk: 'Bond grows 24% faster', bondMod: 1.24,
    desc: 'A round puff in a velvet collar with two small fangs and impeccable manners.',
  },
  demonpuff: {
    name: 'Demon Puff', kicker: 'Ember breed', icon: '😈', perk: 'Earns 12% more XP', xpMod: 1.12,
    desc: 'A round puff with warm little horns and a tail that flicks when it is pleased.',
  },
  angelpuff: {
    name: 'Angel Puff', kicker: 'Halo breed', icon: '😇', perk: 'Joy fades 32% slower', joyMod: 0.68,
    desc: 'A round puff under a floating halo, with soft wings it only uses for naps.',
  },
  frozenpuff: {
    name: 'Frozen Puff', kicker: 'Rime breed', icon: '🧊', perk: 'Energy fades 30% slower', energyMod: 0.7,
    desc: 'A round puff of packed frost that only warms under a cooling incubator.',
  },
  firedemonpuff: {
    name: 'Fire Demon Puff', kicker: 'Hearth demon breed', icon: '🔥', perk: 'Earns 14% more XP', xpMod: 1.14,
    desc: 'A friendly ember puff with soft horns and a warm glow it shares on cold nights.',
  },
  frozenangelpuff: {
    name: 'Frost Angel Puff', kicker: 'Glacier choir breed', icon: '❄️', perk: 'Joy fades 34% slower', joyMod: 0.66,
    desc: 'A gentle frost puff with ice-clear wings and a halo of hanging snowflakes.',
  },
  pufflet: {
    name: 'Pufflet', kicker: 'Down breed', icon: '🫧', perk: 'Bond grows 20% faster', bondMod: 1.2,
    desc: 'A palm-sized round puff that follows footsteps and hums to itself.',
  },
  mudpuff: {
    name: 'Mudpuff', kicker: 'Marsh breed', icon: '🪴', perk: 'Hunger fades 26% slower', hungerMod: 0.74,
    desc: 'A round puff with damp fur and a small sprout that grows when it is happy.',
  },
  sparkpuff: {
    name: 'Sparkpuff', kicker: 'Static breed', icon: '⚡', perk: 'Earns 10% more XP', xpMod: 1.1,
    desc: 'A round puff that crackles softly and lights up when someone walks in.',
  },
  /* The classic Club Penguin silhouette, kept as a breed of its own so every
     colour style and every evolution form can be worn on one familiar body. */
  cp_puffle: {
    name: 'Club Penguin Puffle', kicker: 'Classic breed', icon: '🐧',
    perk: 'Bond grows 25% faster and earns 8% more XP', bondMod: 1.25, xpMod: 1.08,
    /* The body type carries the classic Club Penguin silhouette and the twelve
       classic colours, so the breed looks right the moment it hatches. */
    bodyShape: 'cp_classic',
    desc: 'The round, soft classic from Club Penguin — a little propeller cap, a pocketful of colours, and room for every evolution.',
  },
});
/* A breed's grown weight in pounds. The clinic scale adds the stage and size
   multipliers from PuffleWeight, so a baby Puff is lighter than an elder Chonk
   but the breed still sets the shape of the number. */
const BREED_WEIGHTS = {
  puff: 3.2,
  sprig: 3.8,
  flit: 1.6,
  horn: 5.8,
  blob: 4.4,
  wisp: 0.8,
  bun: 2.4,
  fin: 2.0,
  shell: 6.2,
  star: 1.1,
  orb: 4.0,
  lanky: 3.0,
  chonk: 9.5,
  tuft: 2.6,
  wedge: 7.6,
  pear: 5.2,
  pill: 3.4,
  bean: 2.2,
  diamond: 6.8,
  drop: 1.4,
  mochi: 4.8,
  gem: 7.2,
  tower: 8.4,
  petal: 2.8,
  cone: 5.6,
  pillow: 6.0,
  cushion: 7.0,
  urchin: 5.4,
  lantern: 3.6,
  caterpillar: 4.2,
  cloudlet: 0.6,
  floof: 1.8,
  ragfluff: 2.1,
  werewolfpuff: 4.6,
  zombiepuff: 4.9,
  vampirepuff: 2.9,
  demonpuff: 3.1,
  angelpuff: 2.3,
  frozenpuff: 5.1,
  firedemonpuff: 3.3,
  frozenangelpuff: 2.5,
  pufflet: 0.9,
  mudpuff: 3.9,
  sparkpuff: 1.9,
  cp_puffle: 3.0,
};
/* Grown weight is the midadult baseline; the stage carries it up or down from
   there. Keep this beside the breed table so a new stage is added in one place. */
const WEIGHT_STAGE_MULT = {
  egg: 0.12,
  baby: 0.55,
  juvenile: 0.68,
  sprite: 0.82,
  youngadult: 0.92,
  midadult: 1,
  highadult: 1.08,
  elder: 1.16,
  ancient: 1.3,
  sensei: 1.45,
  apex: 1.6,
  omni: 1.8,
  celestial: 2,
};
const BREED_KEYS = Object.keys(BREEDS);

/* Puffs that only warm under a cooling incubator (Chill Stone or Frost Chill)
   instead of a heat source. */
const COLD_HATCH_BREEDS = ['frozenpuff', 'frozenangelpuff'];
/* Studio → Game feel can switch the Chill Stone requirement off, so frozen
   eggs then warm under any incubator. Existing saves default to on. */
function coldHatchEnabled() {
  return !(typeof state !== 'undefined' && state.theme && state.theme.coldHatch === false);
}

/* The six dragon types the Dragon Nest can form; saved in the collection. */
const DRAGON_NEST_TYPES = [
  { key: 'ember', icon: '🔥', name: 'Ember Dragon' },
  { key: 'tide', icon: '💧', name: 'Tide Dragon' },
  { key: 'bloom', icon: '🌿', name: 'Bloom Dragon' },
  { key: 'dusk', icon: '🌙', name: 'Dusk Dragon' },
  { key: 'spark', icon: '⚡', name: 'Spark Dragon' },
  { key: 'frost', icon: '❄️', name: 'Frost Dragon' },
];

/* What each puff family likes, avoids, eats first, and how it behaves. */
const BREED_TRAITS = {
  floof: { favorite: 'pop', likes: 'warm laps, sunbeams', dislikes: 'cold floors, loud rooms', behavior: 'Settles on whoever is sitting still and purrs in their lap.' },
  ragfluff: { favorite: 'soup', likes: 'soft blankets, quiet corners', dislikes: 'brushes, baths', behavior: 'Drags one blanket everywhere and arranges it into a nest.' },
  werewolfpuff: { favorite: 'drumstick', likes: 'moonlight, howling', dislikes: 'baths, closed doors', behavior: 'Circles the Hollow at dusk and howls at the moon.' },
  zombiepuff: { favorite: 'feast', likes: 'slow shuffles, snacks', dislikes: 'fast music, alarms', behavior: 'Shuffles toward the pantry and forgets why it went there.' },
  vampirepuff: { favorite: 'feast', likes: 'velvet, night air', dislikes: 'garlic, bright sun', behavior: 'Bows politely, then naps upside down for hours.' },
  demonpuff: { favorite: 'drumstick', likes: 'campfires, warm stones', dislikes: 'rain, cold baths', behavior: 'Sits as close to the fire as it can and gloats about it.' },
  angelpuff: { favorite: 'nectar', likes: 'clouds, quiet singing', dislikes: 'mud, shouting', behavior: 'Hovers just above the ground and hums to nervous sprites.' },
  frozenpuff: { favorite: 'nectar', likes: 'snow, window frost', dislikes: 'heat lamps, sand', behavior: 'Leaves tiny frost footprints and naps wherever it is coldest.' },
  firedemonpuff: { favorite: 'drumstick', likes: 'warm hearths, friends', dislikes: 'cold nights, swimming', behavior: 'Friendly to everyone and warms cold hands without being asked.' },
  frozenangelpuff: { favorite: 'nectar', likes: 'snowfall, calm friends', dislikes: 'fog, loud storms', behavior: 'Drifts down beside anyone who is upset and leaves a snowflake.' },
  pufflet: { favorite: 'pop', likes: 'following feet, songs', dislikes: 'being alone, rain', behavior: 'Follows one step behind and hums the whole way.' },
  mudpuff: { favorite: 'berry', likes: 'puddles, sprouting', dislikes: 'dry air, baths', behavior: 'Sits in puddles and grows a new sprout when it is happy.' },
  sparkpuff: { favorite: 'pop', likes: 'storms, tin roofs', dislikes: 'still air, plastic', behavior: 'Crackles when it is excited and lights the room at night.' },
  cp_puffle: { favorite: 'pop', likes: 'propeller caps, snowy days, new colours', dislikes: 'being left out, grey afternoons', behavior: 'Tries on every colour in the Studio, then proudly keeps the favourite for a week.' },
};

const PALETTES = {
  puffcloud: { name: 'Sprite Puffle', body: '#F6F1E7', light: '#EAF6FF', deep: '#BDB6CF', accent: '#D9C7F2', belly: '#E7FBF2' },
  dreamcloud: { name: 'Dream nebula', body: '#F7F1E6', light: '#FDF8FF', deep: '#9A86C8', accent: '#C9F0E2', belly: '#E9FBFF' },
  native: { name: 'Native', body: null, light: null, deep: null, accent: null, belly: null },
  aurora: { name: 'Aurora', body: '#8be9ff', light: '#d6f6ff', deep: '#2b5f7a', accent: '#b69cff', belly: '#eafcff' },
  candy: { name: 'Candyfloss', body: '#ffb3d1', light: '#ffe0ee', deep: '#a13b63', accent: '#ffd166', belly: '#fff0f6' },
  matcha: { name: 'Matcha', body: '#a8d982', light: '#e8ffd1', deep: '#4b7135', accent: '#ffd166', belly: '#f2ffe6' },
  ember: { name: 'Emberglow', body: '#ff9f68', light: '#ffd9b8', deep: '#a33e1a', accent: '#ffe066', belly: '#ffeade' },
  deepsea: { name: 'Deepsea', body: '#4db8d8', light: '#c2f0ff', deep: '#0f4d66', accent: '#6fffe0', belly: '#e0fbff' },
  midnight: { name: 'Midnight', body: '#6d6aa8', light: '#c9c6ff', deep: '#2a2750', accent: '#ff8ad8', belly: '#e6e4ff' },
  sunset: { name: 'Sunset', body: '#ff8fa3', light: '#ffd6c9', deep: '#8f3b4e', accent: '#ffd166', belly: '#ffe9e2' },
  mono: { name: 'Bonewhite', body: '#e8e6f0', light: '#ffffff', deep: '#5a5668', accent: '#b8b4c8', belly: '#faf9ff' },
  prism: { name: 'Prism', body: '#c9a6ff', light: '#e9ddff', deep: '#5b3b8a', accent: '#7affd8', belly: '#f6efff' },
  peach: { name: 'Peach Fizz', body: '#ffb38a', light: '#ffe3d1', deep: '#8a4a32', accent: '#ffd166', belly: '#fff0e8' },
  ocean: { name: 'Ocean', body: '#4fa8c9', light: '#c9f0ff', deep: '#1c4e63', accent: '#7affd8', belly: '#e6faff' },
  lavender: { name: 'Lavender Haze', body: '#b8a6e8', light: '#e9e2ff', deep: '#5a467a', accent: '#ffb3d1', belly: '#f6f1ff' },
  charcoal: { name: 'Charcoal', body: '#5a5668', light: '#b8b4c8', deep: '#22202c', accent: '#8be9ff', belly: '#e8e6f0' },
  rosegold: { name: 'Rose Gold', body: '#e8a58f', light: '#ffe3d8', deep: '#8a4a3a', accent: '#ffd166', belly: '#fff1ea' },
  glacier: { name: 'Glacier', body: '#b8e6f0', light: '#eafcff', deep: '#3a6a7a', accent: '#8be9ff', belly: '#f7ffff' },
  hellfire: { name: 'Hellfire', body: '#ff6b4a', light: '#ffc7a8', deep: '#7a1f12', accent: '#ffd166', belly: '#ffe4d6' },
  vineglow: { name: 'Vineglow', body: '#6fbf73', light: '#d8ffd6', deep: '#27502c', accent: '#e9ff6b', belly: '#f0fff0' },
  stormgrey: { name: 'Storm Grey', body: '#8a93a8', light: '#d6dbe8', deep: '#394050', accent: '#8be9ff', belly: '#eef1f7' },
  quartzrose: { name: 'Quartz Rose', body: '#efc0d2', light: '#fff0f6', deep: '#7a3f57', accent: '#b69cff', belly: '#fff7fa' },
  abyssal: { name: 'Abyssal', body: '#3a3f78', light: '#8f96d8', deep: '#15162e', accent: '#7affd8', belly: '#c9ceed' },
  mintchip: { name: 'Mint Chip', body: '#8fe0c0', light: '#e2fff4', deep: '#2f6b56', accent: '#ff9ec7', belly: '#f2fffa' },
  bubblegum: { name: 'Bubblegum', body: '#ff9ec7', light: '#ffe6f2', deep: '#8a2f56', accent: '#8be9ff', belly: '#fff2f8' },
  warmsand: { name: 'Warm Sand', body: '#e0c48f', light: '#fff3d6', deep: '#7a5a2a', accent: '#5ad6b8', belly: '#fffaf0' },
  deepforest: { name: 'Deep Forest', body: '#5f9e6a', light: '#d6f2d9', deep: '#244a2c', accent: '#ffd166', belly: '#eefaf0' },
  neonlime: { name: 'Neon Lime', body: '#b6ff5a', light: '#f0ffd6', deep: '#3a5a0a', accent: '#ff4fd8', belly: '#f8ffe8' },
  galaxy: { name: 'Galaxy', body: '#7a6ad8', light: '#dcd6ff', deep: '#2a1f5a', accent: '#5ad6ff', belly: '#efeaff' },
  frost: { name: 'Frost', body: '#c2e8f5', light: '#f0fbff', deep: '#4a7a8a', accent: '#b69cff', belly: '#faffff' },
  coralreef: { name: 'Coral Reef', body: '#ff8f7a', light: '#ffe0d6', deep: '#8a3a2a', accent: '#5ad6b8', belly: '#fff0ea' },
  goldleaf: { name: 'Goldleaf', body: '#e8c46a', light: '#fff6d6', deep: '#7a5a14', accent: '#8be9ff', belly: '#fffbee' },
  blueberry: { name: 'Blueberry', body: '#6c7bd9', light: '#c9d2ff', deep: '#2e3570', accent: '#8be9ff', belly: '#eef1ff' },
  strawberry: { name: 'Strawberry', body: '#f2687e', light: '#ffd0d8', deep: '#8a2233', accent: '#ffd166', belly: '#fff0f3' },
  sunbeam: { name: 'Sunbeam', body: '#ffd166', light: '#fff3c9', deep: '#a8752a', accent: '#ff8fa3', belly: '#fffaea' },
  seafoam: { name: 'Seafoam', body: '#7fe0c8', light: '#dcfff4', deep: '#2f7a68', accent: '#ffd166', belly: '#f1fffb' },
  plum: { name: 'Plum', body: '#8b5fbf', light: '#dcc6f2', deep: '#472a6b', accent: '#ffb3d1', belly: '#f5ecff' },
  tangerine: { name: 'Tangerine', body: '#ff8a3d', light: '#ffd6b8', deep: '#8a3b12', accent: '#8be9ff', belly: '#fff0e4' },
  graphite: { name: 'Graphite', body: '#4a4d5c', light: '#aeb2c4', deep: '#1b1d26', accent: '#8be9ff', belly: '#e8eaf2' },
  honey: { name: 'Honey', body: '#f0b429', light: '#ffe9a8', deep: '#8a5a0a', accent: '#ff8fa3', belly: '#fff8e1' },
  godlight: { name: 'Godlight', body: '#ffe9b0', light: '#fffbe6', deep: '#8a6a14', accent: '#ffffff', belly: '#fffdf5' },
  nebularose: { name: 'Nebula Rose', body: '#7a5cc8', light: '#cfc2ff', deep: '#2a1b54', accent: '#ff8fd6', belly: '#efe8ff' },
  emberglass: { name: 'Emberglass', body: '#ff9e6b', light: '#ffd8be', deep: '#7a2a12', accent: '#ffe066', belly: '#ffede0' },
  tidefrost: { name: 'Tidefrost', body: '#8fd8e8', light: '#e2faff', deep: '#2a5f73', accent: '#b9a8ff', belly: '#f2feff' },
  mossveil: { name: 'Mossveil', body: '#9fcb8a', light: '#e8ffd8', deep: '#36521f', accent: '#ffe08a', belly: '#f5ffee' },
  crownrose: { name: 'Crown Rose', body: '#e8a8c8', light: '#ffe2f0', deep: '#7a2f55', accent: '#ffd166', belly: '#fff2f8' },
};
const PALETTE_KEYS = Object.keys(PALETTES);

const PATTERNS = {
  plain: { name: 'Plain', icon: '○' },
  spots: { name: 'Dappled', icon: '••' },
  stripes: { name: 'Striped', icon: '≋' },
  belly: { name: 'Soft belly', icon: '◒' },
  freckles: { name: 'Freckles', icon: '⁘' },
  star: { name: 'Starry', icon: '✦' },
  hearts: { name: 'Lovestruck', icon: '♥' },
  clouds: { name: 'Cloudy', icon: '☁' },
  swirls: { name: 'Swirled', icon: '◎' },
  flame: { name: 'Emberfade', icon: '🔥' },
  patch: { name: 'Patched', icon: '▦' },
  sparkle: { name: 'Sparkled', icon: '✧' },
  checkers: { name: 'Checkered', icon: '▚' },
  ripple: { name: 'Rippled', icon: '≈' },
  petals: { name: 'Petal fall', icon: '❀' },
  snow: { name: 'Snowfall', icon: '❄' },
  zigzag: { name: 'Zigzag', icon: '⌁' },
  glitter: { name: 'Glitter', icon: '✺' },
};
const PATTERN_KEYS = Object.keys(PATTERNS);

const ACCESSORIES = {
  none: { name: 'None', icon: '—' },
  crown: { name: 'Crown', icon: '♛' },
  bow: { name: 'Bow', icon: '🎀' },
  scarf: { name: 'Scarf', icon: '🧣', warm: 1 },
  glasses: { name: 'Glasses', icon: '👓' },
  leaf: { name: 'Leaf', icon: '🍃' },
  flower: { name: 'Flower', icon: '🌸' },
  headphones: { name: 'Headphones', icon: '🎧' },
  partyhat: { name: 'Party Hat', icon: '🎉' },
  flowercrown: { name: 'Flower Crown', icon: '🌼' },
  beret: { name: 'Beret', icon: '🎨' },
  bellcollar: { name: 'Bell Collar', icon: '🔔' },
  sunglasses: { name: 'Sunny Shades', icon: '😎', price: 30 },
  overalls: { name: 'Denim Overalls', icon: '👖', price: 50 },
  raincoat: { name: 'Raincoat', icon: '🧥', warm: 1, price: 55 },
  boots: { name: 'Rain Boots', icon: '🥾', warm: 1, price: 35 },
  cape: { name: 'Hero Cape', icon: '🦸', price: 65 },
  backpack: { name: 'Adventure Pack', icon: '🎒', price: 45 },
  wizardhat: { name: 'Wizard Hat', icon: '🧙', price: 60 },
  beanie: { name: 'Wool Beanie', icon: '🧢', warm: 2, price: 45 },
  mittens: { name: 'Mittens', icon: '🧤', warm: 2, price: 35 },
  parka: { name: 'Snow Parka', icon: '🧥', warm: 3, price: 80 },
  tophat: { name: 'Top Hat', icon: '🎩', price: 40 },
  halo: { name: 'Halo', icon: '😇', price: 70 },
  medal: { name: 'Prize Medal', icon: '🏅', price: 25 },
  cowboyhat: { name: 'Cowboy Hat', icon: '🤠', price: 50 },
  snorkel: { name: 'Snorkel', icon: '🤿', price: 45 },
  monocle: { name: 'Monocle', icon: '🧐', price: 35 },
  bandana: { name: 'Bandana', icon: '🔺' },
  bowtie: { name: 'Bow Tie', icon: '🎀' },
  starclip: { name: 'Star Clip', icon: '⭐' },
  sproutclip: { name: 'Sprout Clip', icon: '🌱' },
  earmuffs: { name: 'Earmuffs', icon: '🎧', price: 40 },
  goggles: { name: 'Goggles', icon: '🥽', price: 35 },
};
const ACCESSORY_KEYS = Object.keys(ACCESSORIES);
const FREE_ACCESSORY_KEYS = ACCESSORY_KEYS.filter((k) => !ACCESSORIES[k].price);

const GENDERS = {
  female: { key: 'female', name: 'Female', symbol: '♀', color: '#ff8fc7', blurb: 'She / her. Rolled once and kept for life.' },
  male: { key: 'male', name: 'Male', symbol: '♂', color: '#7cc4ff', blurb: 'He / him. Rolled once and kept for life.' },
  neutral: { key: 'neutral', name: 'Neutral', symbol: '⚲', color: '#c9a6ff', blurb: 'They / them. Rolled once and kept for life.' },
};
const GENDER_KEYS = Object.keys(GENDERS);

const PERSONALITIES = {
  sunny: { name: 'Sunny', desc: 'Everything is the best thing ever.' },
  grump: { name: 'Grumpy', desc: 'Secretly soft. Publicly unimpressed.' },
  shy: { name: 'Shy', desc: 'Warms up slowly, loves hard.' },
  bold: { name: 'Bold', desc: 'First into the puddle, last to leave.' },
  goofy: { name: 'Goofy', desc: 'Professional nonsense maker.' },
  dreamy: { name: 'Dreamy', desc: 'Half here, half in a cloud.' },
  sassy: { name: 'Sassy', desc: 'Will roast you, will also share snacks.' },
};
const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

const pairKey = (a, b) => [a, b].sort().join('+');

/* Hybrid element names for every pair of elements. */
const HYBRID_NAMES = {
  'ember+tide': 'Steam',
  'ember+gale': 'Smoke',
  'bloom+ember': 'Ash',
  'ember+volt': 'Plasma',
  'ember+frost': 'Thaw',
  'dusk+ember': 'Eclipse',
  'ember+radiant': 'Sunspot',
  'gale+tide': 'Mist',
  'bloom+tide': 'Marsh',
  'tide+volt': 'Storm',
  'frost+tide': 'Glacier',
  'dusk+tide': 'Abyss',
  'radiant+tide': 'Opal',
  'bloom+gale': 'Petal',
  'gale+volt': 'Static',
  'frost+gale': 'Blizzard',
  'dusk+gale': 'Phantom',
  'gale+radiant': 'Halo',
  'bloom+volt': 'Spark',
  'bloom+frost': 'Tundra',
  'bloom+dusk': 'Bramble',
  'bloom+radiant': 'Solstice',
  'frost+volt': 'Arc',
  'dusk+volt': 'Neon',
  'radiant+volt': 'Nova',
  'dusk+frost': 'Shiver',
  'frost+radiant': 'Diamond',
  'dusk+radiant': 'Twilight',
  'angel+demon': 'Fallen Halo',
  'angel+frost': 'Snowfall',
  'angel+radiant': 'Choir',
  'air+cloud': 'Skydrift',
  'air+gale': 'Whisper',
  'bloom+bug': 'Pollinator',
  'bloom+bunny': 'Clover',
  'bloom+candy': 'Sherbet',
  'bloom+honey': 'Meadow',
  'bloom+slime': 'Mossgoo',
  'ants+bug': 'Swarm',
  'bunny+radiant': 'Moonhare',
  'cloud+volt': 'Thunderhead',
  'crystal+dusk': 'Geode',
  'crystal+frost': 'Hailstone',
  'demon+dusk': 'Nightmare',
  'demon+fire': 'Hellfire',
  'earth+fire': 'Magma',
  'earth+rock': 'Badlands',
  'fire+water': 'Boil',
  'hero+radiant': 'Paragon',
  'honey+pond': 'Lilyhive',
  'dusk+mushroom': 'Toadstool',
  'pond+tide': 'Reedwater',
  'rock+stone': 'Quarry',
  'splash+tide': 'Wavebreak',
  'bat+dusk': 'Moonbat',
  'bat+fire': 'Emberwing',
  'bear+bloom': 'Berrybear',
  'bear+frost': 'Polar',
  'bloom+butterfly': 'Garden',
  'bloom+cow': 'Meadowmoo',
  'butterfly+crystal': 'Prismwing',
  'cat+dusk': 'Shadowcat',
  'cat+radiant': 'Sunbask',
  'cloud+pillow': 'Daydream',
  'dreameater+dusk': 'Somnia',
  'dreameater+radiant': 'Lucid',
  'dusk+pillow': 'Lullaby',
  'ember+tiger': 'Cinderclaw',
  'frog+pond': 'Lilypad',
  'frog+tide': 'Bog',
  'frost+wolf': 'Snowfang',
  'honey+pig': 'Truffle',
  'lucky+radiant': 'Sunluck',
  'candy+lucky': 'Jackpot',
  'dusk+wolf': 'Moonfang',
  'radiant+wolf': 'Sunfang',
  'fish+tide': 'Reef',
  'fish+water': 'Deepfin',
  'tiger+volt': 'Thunderclaw',
  'apple+bloom': 'Orchard',
  'apple+candy': 'Caramel',
  'banana+bloom': 'Tropics',
  'banana+cloud': 'Sundae',
  'banana+volt': 'Zest',
  'candy+cherry': 'Cordial',
  'cherry+ember': 'Bake',
  'cocoa+frost': 'Mocha',
  'cocoa+pillow': 'Nightcap',
  'frost+ice': 'Hail',
  'ice+tide': 'Slush',
  'ember+pizza': 'Brick Oven',
  'duck+fishy': 'Quackfin',
  'fishy+tide': 'Finfriend',
  'fishy+water': 'Bubblebuddy',
  'aura+radiant': 'Halo Light',
  'aura+dusk': 'Gloaming',
  'seven+six': 'Lucky Thirteen',
  'king+queen': 'Royal Pair',
  'crown+king': 'Sovereign',
  'crown+queen': 'Diadem',
  'dusk+ghost': 'Poltergeist',
  'frost+ghost': 'Cold Spot',
  'dusk+skull': 'Bonechill',
  'death+grim': 'Last Rites',
  'death+dusk': 'Requiem',
  'duck+pond': 'Duckpond',
  'banana+peely': 'Peel Party',
  'dream+pillow': 'Slumber',
  'dream+dreameater': 'Lucid Dream',
  'punk+volt': 'Feedback',
  'fire+punk': 'Mosh',
  'batman+dusk': 'Dark Knight',
  'batman+hero': 'Caped Crusader',
  'hero+superman': 'Man of Tomorrow',
  'radiant+superman': 'Solar Cape',
  'hero+ironmouse': 'Ironheart',
  'blaster+bullet': 'Rapid Fire',
  'burntpb+pizza': 'Lunchbox',
  'headshot+killswitch': 'Crossfire',
  'crystal+cube': 'Hypercube',
  'bombjr+fire': 'Firecracker',
  'grim+mushroom': 'Gravecap',
  'bloom+squibbly': 'Grovekeeper',
  'onewish+radiant': 'Wishlight',
  'earth+klombo': 'Ancient Stomp',
  'ghost+spookydash': 'Speed Spook',
  'bunny+jazz': 'Hare Trigger',
  'crash+tiger': 'Spin Claw',
  'blinky+ghost': 'Blink Boo',
  'bloom+deer': 'Grove Stag',
  'sonic+volt': 'Speedster',
  'sonic+tails': 'Best Friends',
  'honey+honeypot': 'Sticky Sweet',
  'ants+dumpster': 'Scrap Crew',
  'tails+wolf': 'Foxpack',
  'dusk+shadow': 'Chaos Shade',
  'killswitch+tiger': 'Deadlock',
  'cat+morgana': 'Panther Purr',
  'bat+vampire': 'Crimson Night',
  'duck+onigiri': 'Snack Wrap',
  'bloom+bushranger': 'Thicket',
  'hero+jonesy': 'Default Hero',
  'adventure+air': 'Wanderlust',
  'gale+stormscout': 'Stormfront',
  'overshield+rock': 'Bulwark',
  'megaman+volt': 'Mega Volt',
  'birthday+candy': 'Party Favor',
  'cat+meowscles': 'Purr Muscle',
  'bloom+pumpkin': 'Harvest',
  'pumpkin+radiant': 'Jack-o-Lantern',
  'dusk+pumpkin': 'Hallow',
  'frost+santa': 'Snow Gift',
  'radiant+santa': 'Yule',
  'candy+santa': 'Sugarplum',
  'angel+cupid': 'Lovebird',
  'cupid+radiant': 'Sunheart',
  'cherry+cupid': 'Sweetheart',
  'charm+lucky': 'Talisman',
  'charm+radiant': 'Glimmer',
  'charm+dusk': 'Hex Charm',
  'frost+snow': 'Blizzard',
  'snow+tide': 'Slush',
  'bloom+snow': 'Snowdrop',
  'ember+snow': 'Steam Puff',
  'cupid+snow': 'Snow Angel',
  'pumpkin+snow': 'Frostbite',
  'bloom+zombie': 'Overgrowth',
  'undead+zombie': 'Graveborn',
  'pumpkin+zombie': 'Harvest Rot',
  'ghost+undead': 'Soul Wisp',
  'dusk+undead': 'Twilight Shade',
  'starfish+tide': 'Tide Star',
  'ice+starfish': 'Frost Star',
  'starfish+water': 'Reef Crawler',
  'pika+volt': 'Thunderbolt',
  'pika+sonic': 'Speed Spark',
  'cupid+pika': 'Love Spark',
  'radiant+unicorn': 'Sunmane',
  'angel+unicorn': 'Hallowhorn',
  'dream+unicorn': 'Moonmane',
  'devil+ember': 'Hellfire',
  'demon+devil': 'Infernal Pact',
  'devil+grim': 'Soul Debt',
  'bloom+yoga': 'Lotus Breath',
  'pillow+yoga': 'Still Mind',
  'aura+yoga': 'Inner Glow',
  'shark+tide': 'Reef Fang',
  'fishy+shark': 'Frenzy',
  'shark+water': 'Deep Bite',
  'tide+whitewhale': 'Whalesong',
  'frost+whitewhale': 'Iceberg',
  'cloud+whitewhale': 'Skywhale',
  'dragon+ember': 'Wyrmfire',
  'dragon+frost': 'Frostwyrm',
  'dragon+gale': 'Stormwyrm',
  'darkjoker+demon': 'Infernal Jest',
  'darkjoker+dusk': 'Midnight Jest',
  'charm+darkjoker': 'Wild Card',
  'grim+jackskull': 'Grim Grin',
  'jackskull+pumpkin': 'Hallowed Crown',
  'ember+jackskull': 'Bonfire Skull',
  'ghost+sally': 'Ghost Ragdoll',
  'charm+sally': 'Stitched Charm',
  'pillow+sally': 'Dream Doll',
  'cupid+keke': 'Love Keke',
  'charm+keke': 'Keke Charm',
  'candy+keke': 'Sugar Keke',
  'bestie+cupid': 'Bestie Love',
  'bestie+radiant': 'Sunny Bestie',
  'bestie+bloom': 'Buddy Bloom',
  'bunny+dog': 'Hop Pup',
  'dog+wolf': 'Pack Pals',
  'dog+hero': 'Super Pup',
  'cat+karen': 'Neighborhood Watch',
  'bat+karen': 'Night Manager',
  'crystal+karen': 'Crystal Karen',
  'bloom+motherearth': 'Gaia Bloom',
  'earth+motherearth': 'Terra Mater',
  'motherearth+tide': 'Ocean Mother',
  'werewolf+wolf': 'Alpha Moon',
  'dog+werewolf': 'Moon Hound',
  'dusk+werewolf': 'Night Howl',
  'bloom+normal': 'Everyday Bloom',
  'cat+normal': 'House Cat',
  'dog+normal': 'House Dog',
  'bear+gummybear': 'Gummy Cub',
  'gummybear+honey': 'Honey Gummy',
  'candy+gummybear': 'Candy Cub',
  'earth+muddy': 'Mudpack',
  'muddy+tide': 'Silt Surge',
  'bloom+muddy': 'Mossmuck',
  'frog+muddy': 'Puddlehop',
  'dog+spot': 'Spot Hound',
  'cat+spot': 'Copycat',
  'bunny+spot': 'Hop Dot',
  'cow+spot': 'Moo Spot',
  'frost+frozen': 'Deep Freeze',
  'frozen+ice': 'Black Ice',
  'frozen+water': 'Icebound',
  'frozen+tide': 'Glacier Heart',
  'six+sixtyseven': 'Sixty Seven',
  'seven+sixtyseven': 'Lucky Sixty-Seven',
  'sixtyseven+volt': 'High Score',
  'creeper+slime': 'Boom Slime',
  'creeper+earth': 'Dirt Bomb',
  'creeper+volt': 'Detonator',
  'creeper+rock': 'Bedrock Blast',
  'ember+lion': 'Cinder Mane',
  'king+lion': 'Beast Monarch',
  'lion+radiant': 'Solar Pride',
  'lion+wolf': 'Pride Pack',
  'bloom+panda': 'Bamboo Bloom',
  'frost+panda': 'Snow Panda',
  'panda+pillow': 'Nap Panda',
  'dream+panda': 'Dream Bamboo',
  'frost+penguin': 'Ice Waddle',
  'penguin+tide': 'Tuxedo Tide',
  'duck+penguin': 'Cold Duck',
  'ice+penguin': 'Glacier Waddle',
  'dusk+owl': 'Moon Owl',
  'dream+owl': 'Dreamwise',
  'ghost+owl': 'Silent Flight',
  'owl+radiant': 'Sunwing',
  'slime+snake': 'Slippery',
  'devil+snake': 'Serpent’s Deal',
  'frog+snake': 'Lily Lurker',
  'rock+snake': 'Basilisk',
  'bug+spider': 'Webbed',
  'ghost+spider': 'Phantom Web',
  'ants+spider': 'Colony Web',
  'dusk+spider': 'Moon Weaver',
  'crab+tide': 'King Crab',
  'crab+starfish': 'Rock Pool',
  'crab+splash': 'Snap Spray',
  'crab+water': 'Reef Pinch',
  'dolphin+tide': 'Wave Rider',
  'dolphin+fish': 'Pod Pal',
  'dolphin+whitewhale': 'Blue Pod',
  'cloud+dolphin': 'Sky Leap',
  'cloud+sheep': 'Cloudwool',
  'sheep+wolf': 'Sheepdog',
  'bunny+sheep': 'Lamb Hop',
  'pillow+sheep': 'Counting Sheep',
  'bull+ember': 'Cinder Horn',
  'bull+earth': 'Terra Bull',
  'bull+rock': 'Boulder Charge',
  'bull+king': 'Crowned Bull',
  'batman+bossbaby': 'Board Meeting',
  'bossbaby+karen': 'HR Department',
  'bossbaby+cat': 'Purrfect Boss',
  'bossbaby+hero': 'CEO of Heroics',
  'hero+hero6': 'Hero Six',
  'hero6+volt': 'Sixth Spark',
  'hero6+six': 'Double Six',
  'batman+hero6': 'Gotham Six',
  'hero6+ironmouse': 'Stream Team',
  'volt+wrixel': 'Glitchwire',
  'bloom+wrixel': 'Pixel Bloom',
  'dusk+phantom': 'Nightmask',
  'ghost+phantom': 'Hollow Shade',
  'ember+mali': 'Dune Fire',
  'mali+stone': 'Sandstone',
  'bastian+frost': 'Frostguard',
  'bastian+radiant': 'Oathlight',
  'k1ttyw1ns+volt': 'Purrbolt',
  'candy+k1ttyw1ns': 'Sugar Stream',
  'gracecrowne+radiant': 'Sun Crown',
  'dusk+gracecrowne': 'Night Court',
  'demon+geno': 'Redline',
  'geno+shadow': 'Blackout',
  'nicorobin+tide': 'Tidewright',
  'dusk+nicorobin': 'Relic',
  'ace+ember': 'Flare Fist',
  'ace+tide': 'Steam Fist',
  'candy+cuddle': 'Gummy Hug',
  'bear+cuddle': 'Team Bear',
  'candy+charlotte': 'Pop Remix',
  'charlotte+volt': 'Neon Note',
  'captainx+tide': 'High Tide',
  'captainx+stone': 'Anchor',
};

function hybridFor(a, b) {
  if (!a || !b || a === b) return null;
  /* pairKey sorts the pair, but wave data is hand-written, so accept a pair
     stored in either order rather than silently dropping the hybrid. */
  return HYBRID_NAMES[pairKey(a, b)] || HYBRID_NAMES[`${a}+${b}`] || HYBRID_NAMES[`${b}+${a}`] || null;
}

const MUTATIONS = [
  { id: 'aurora', name: 'Aurora', palette: 'aurora', desc: 'A shimmering, rare colorway.' },
  { id: 'prism', name: 'Prism', palette: 'prism', desc: 'Refracts light into little rainbows.' },
  { id: 'midnight', name: 'Midnight', palette: 'midnight', desc: 'Born during the quiet hours.' },
  { id: 'sunset', name: 'Sunset', palette: 'sunset', desc: 'Warm as the last light of day.' },
  { id: 'mono', name: 'Frostbone', palette: 'mono', desc: 'A pale, storybook mutation.' },
];

/* Rare finishes applied on top of any type. Each tints the whole sprite and adds a bonus. */
const FINISHES = {
  gold: {
    name: 'Gold', icon: '🥇', body: '#ffd166', light: '#fff6cc', deep: '#8a5a00', accent: '#ffb86b', belly: '#fff3c4',
    desc: 'A polished gold shell that catches every bit of light.', effect: { gameCoins: 2 },
    bonus: 'Games pay +2 coins.',
  },
  gummy: {
    name: 'Gummy', icon: '🍬', body: '#ff8fc7', light: '#ffe0f0', deep: '#a13b63', accent: '#7affd8', belly: '#fff0f8',
    desc: 'Squishy, translucent, and faintly fruit-flavored.', effect: { snackXp: 1.25, joyDecay: 0.9 },
    bonus: 'Snacks give +25% XP and joy fades slower.',
  },
  galaxy: {
    name: 'Galaxy', icon: '🌌', body: '#3a2a6b', light: '#b8a6ff', deep: '#120a2a', accent: '#7affd8', belly: '#2a1a4a',
    desc: 'A pocket of night sky with stars caught inside.', effect: { xp: 1.15, nightCoins: 2 },
    bonus: '+15% XP and night games pay +2.',
  },
  holofoil: {
    name: 'Holofoil', icon: '🌈', body: '#8be9ff', light: '#ffffff', deep: '#4a5c8a', accent: '#ffb3d1', belly: '#e6f9ff',
    desc: 'A rainbow sheen that shifts when you tilt your head.', effect: { giftSpeed: 1.2, xp: 1.05 },
    bonus: 'Gifts arrive 20% sooner and +5% XP.',
  },
  cube: {
    name: 'Cube', icon: '🧊', body: '#7a5cff', light: '#d6ccff', deep: '#2a1a7a', accent: '#7affd8', belly: '#c2b8ff',
    desc: 'A blocky overlay that hums with quiet geometry.', effect: { cleanDecay: 0.8 },
    bonus: 'Clean fades 20% slower.',
  },
  quack: {
    name: 'Quack', icon: '🦆', body: '#ffe066', light: '#fff6b8', deep: '#a35f00', accent: '#ff9f1c', belly: '#fff8cc',
    desc: 'A waddly little overlay with an unmistakable bill.', effect: { petBond: 1.2, petCoins: 1 },
    bonus: 'Pets pay +1 coin and build +20% bond.',
  },
  gem: {
    name: 'Gem', icon: '💎', body: '#7affd8', light: '#e6fffa', deep: '#1f6b5a', accent: '#c9a6ff', belly: '#d6fff5',
    desc: 'A faceted crystal shell with a thousand tiny edges.', effect: { decay: 0.92 },
    bonus: 'All needs fade 8% slower.',
  },
  cheat: {
    name: 'Cheat Master', icon: '🕹️', body: '#2a3a2a', light: '#d8ffe8', deep: '#0a140a', accent: '#7dffb0', belly: '#1a2a1a',
    desc: 'A glitch-green shell that remembers every shortcut.', effect: { xp: 1.2, gameCoins: 2 },
    bonus: '+20% XP and games pay +2 coins.',
  },
  hacker: {
    name: 'Loot Hacker', icon: '💻', body: '#1f2a44', light: '#b8fff0', deep: '#0a1020', accent: '#ff5ad8', belly: '#2a3a5a',
    desc: 'A neon-wired shell with a visor full of falling code.', effect: { gameCoins: 4, giftSpeed: 1.1 },
    bonus: 'Games pay +4 coins and gifts arrive 10% sooner.',
  },
  hunter: {
    name: 'Bounty Hunter', icon: '🎯', body: '#6b4a2a', light: '#ffe8c2', deep: '#2a1a0a', accent: '#ff9f43', belly: '#8a6a4a',
    desc: 'A weathered hunter’s shell with a scope that never blinks.', effect: { nightCoins: 3, petBond: 1.1 },
    bonus: 'Night games pay +3 coins and pets build +10% bond.',
  },
  trick: {
    name: 'Trick or Treat', icon: '🎃', body: '#3a1f4a', light: '#ffd8a8', deep: '#1a0a24', accent: '#ff8a3a', belly: '#5a2a6a',
    desc: 'A candy-dark shell that smells faintly of pumpkin.', effect: { xp: 1.1, joyDecay: 0.9 },
    bonus: '+10% XP and joy fades 10% slower.',
  },
  fortune: {
    name: 'Fortune', icon: '🍀', body: '#8a1f2a', light: '#ffe6b8', deep: '#3a0a10', accent: '#ffd166', belly: '#b83a3a',
    desc: 'A lucky red shell with a coin that always lands heads.', effect: { gameCoins: 3, giftSpeed: 1.1 },
    bonus: 'Games pay +3 coins and gifts arrive 10% sooner.',
  },
  cursed: {
    name: 'Cursed', icon: '🕯️', body: '#2a1f3a', light: '#b8ffd8', deep: '#0a0510', accent: '#7affd8', belly: '#3a2a4a',
    desc: 'A hollow-eyed shell wrapped in cold green flame.', effect: { decay: 0.9, xp: 1.15 },
    bonus: 'All needs fade 10% slower and +15% XP.',
  },
};
const FINISH_KEYS = Object.keys(FINISHES);
const FINISH_WEIGHTS = { gold: 21, gummy: 17, galaxy: 14, holofoil: 11, cube: 8, quack: 8, gem: 6, cheat: 3, hacker: 3, hunter: 3, trick: 3, fortune: 2, cursed: 1 };
function rollFinish(rate = 0.15) {
  if (Math.random() >= rate) return null;
  let roll = Math.random() * 100;
  for (const key of FINISH_KEYS) {
    roll -= FINISH_WEIGHTS[key] || 10;
    if (roll < 0) return key;
  }
  return FINISH_KEYS[0];
}
function finishOf(s) {
  return s?.variant ? FINISHES[s.variant] || null : null;
}

const FOODS = {
  berry: { id: 'berry', name: 'Moon Berry', emoji: '🍓', price: 4, hunger: 22, joy: 4, xp: 4, desc: '+22 food · +4 joy', cat: 'produce' },
  nectar: { id: 'nectar', name: 'Sun Nectar', emoji: '🍯', price: 7, hunger: 18, energy: 12, joy: 6, xp: 6, desc: '+18 food · +12 energy', cat: 'produce' },
  soup: { id: 'soup', name: 'Warm Soup', emoji: '🍲', price: 9, hunger: 32, energy: 10, joy: 3, clean: -6, xp: 7, desc: '+32 food · messy', cat: 'meal' },
  feast: { id: 'feast', name: 'Cloud Feast', emoji: '🍰', price: 13, hunger: 48, joy: 10, xp: 12, desc: '+48 food · +10 joy', cat: 'meal' },
  pop: { id: 'pop', name: 'Star Pop', emoji: '🍭', price: 5, hunger: 4, joy: 18, bond: 2, xp: 5, desc: '+18 joy · +bond', cat: 'treat' },
  drumstick: { id: 'drumstick', name: 'Juicy Drumstick', emoji: '🍗', price: 13, hunger: 40, joy: 4, xp: 9, desc: '+40 food · +4 joy', cat: 'meat' },
  fillet: { id: 'fillet', name: 'River Fillet', emoji: '🐟', price: 11, hunger: 32, energy: 10, clean: 2, xp: 8, desc: '+32 food · +10 rest', cat: 'meat' },
  carrot: { id: 'carrot', name: 'Carrot Crunch', emoji: '🥕', price: 7, hunger: 20, joy: 6, xp: 6, desc: '+20 food · +6 joy', cat: 'veg' },
  greens: { id: 'greens', name: 'Leafy Greens', emoji: '🥬', price: 6, hunger: 16, energy: 8, clean: 6, xp: 6, desc: '+16 food · +6 clean', cat: 'veg' },
  berryfizz: { id: 'berryfizz', name: 'Berry Fizz', emoji: '🥤', price: 8, energy: 26, joy: 10, xp: 7, desc: '+26 rest · +10 joy', cat: 'drink' },
  tea: { id: 'tea', name: 'Honey Tea', emoji: '🍵', price: 7, energy: 18, joy: 10, clean: 4, xp: 7, desc: '+18 rest · +10 joy', cat: 'drink' },
  stew: { id: 'stew', name: 'Hearty Stew', emoji: '🍲', price: 19, hunger: 55, energy: 12, joy: 8, clean: -4, xp: 15, desc: '+55 food · +12 rest', cat: 'meal' },
  picnic: { id: 'picnic', name: 'Picnic Plate', emoji: '🍱', price: 22, hunger: 60, joy: 14, bond: 2, xp: 18, desc: '+60 food · +14 joy', cat: 'meal' },
  mango: { id: 'mango', name: 'Mango Slice', emoji: '🥭', price: 5, hunger: 24, joy: 6, xp: 5, desc: '+24 food · +6 joy', cat: 'produce' },
  peach: { id: 'peach', name: 'Peach Puff', emoji: '🍑', price: 5, hunger: 20, joy: 8, xp: 5, desc: '+20 food · +8 joy', cat: 'produce' },
  skewer: { id: 'skewer', name: 'Grilled Skewer', emoji: '🍢', price: 12, hunger: 42, joy: 6, xp: 10, desc: '+42 food · +6 joy', cat: 'meat' },
  meatpie: { id: 'meatpie', name: 'Savory Pie', emoji: '🥧', price: 15, hunger: 46, energy: 8, joy: 4, xp: 11, desc: '+46 food · +8 rest', cat: 'meal' },
  pumpkinmash: { id: 'pumpkinmash', name: 'Pumpkin Mash', emoji: '🎃', price: 8, hunger: 26, energy: 8, joy: 4, xp: 7, desc: '+26 food · +8 rest', cat: 'veg' },
  corn: { id: 'corn', name: 'Golden Corn', emoji: '🌽', price: 6, hunger: 18, joy: 6, xp: 6, desc: '+18 food · +6 joy', cat: 'veg' },
  lassi: { id: 'lassi', name: 'Mango Lassi', emoji: '🥤', price: 8, energy: 28, joy: 12, xp: 8, desc: '+28 rest · +12 joy', cat: 'drink' },
  boba: { id: 'boba', name: 'Boba Tea', emoji: '🧋', price: 9, energy: 24, joy: 16, xp: 9, desc: '+24 rest · +16 joy', cat: 'drink' },
  lemonade: { id: 'lemonade', name: 'Lemonade', emoji: '🍋', price: 6, energy: 16, joy: 14, clean: 2, xp: 6, desc: '+16 rest · +14 joy', cat: 'drink' },
  hotcocoa: { id: 'hotcocoa', name: 'Hot Cocoa', emoji: '☕', price: 8, energy: 22, joy: 14, xp: 8, desc: '+22 rest · +14 joy', cat: 'drink' },
  smoothie: { id: 'smoothie', name: 'Berry Smoothie', emoji: '🍓', price: 9, energy: 20, hunger: 10, joy: 10, xp: 9, desc: '+20 rest · +10 food', cat: 'drink' },
  cheesecake: { id: 'cheesecake', name: 'Berry Cheesecake', emoji: '🍰', price: 11, hunger: 24, joy: 24, xp: 12, desc: '+24 food · +24 joy', cat: 'dessert' },
  pudding: { id: 'pudding', name: 'Honey Pudding', emoji: '🍮', price: 8, hunger: 14, joy: 22, bond: 1, xp: 10, desc: '+14 food · +22 joy', cat: 'dessert' },
  moonpie: { id: 'moonpie', name: 'Moon Pie', emoji: '🌙', price: 9, hunger: 18, joy: 20, xp: 10, desc: '+18 food · +20 joy', cat: 'dessert' },
  cinnamon: { id: 'cinnamon', name: 'Cinnamon Roll', emoji: '🥐', price: 10, hunger: 22, joy: 20, xp: 11, desc: '+22 food · +20 joy', cat: 'dessert' },
  sundae: { id: 'sundae', name: 'Ice Cream Sundae', emoji: '🍨', price: 12, hunger: 20, joy: 28, xp: 13, desc: '+20 food · +28 joy', cat: 'dessert' },
  ramen: { id: 'ramen', name: 'Moon Ramen', emoji: '🍜', price: 15, hunger: 50, energy: 10, joy: 8, xp: 15, desc: '+50 food · +10 rest', cat: 'meal' },
  dumplings: { id: 'dumplings', name: 'Cloud Dumplings', emoji: '🥟', price: 14, hunger: 40, joy: 12, xp: 13, desc: '+40 food · +12 joy', cat: 'meal' },
  curry: { id: 'curry', name: 'Golden Curry', emoji: '🍛', price: 17, hunger: 54, energy: 12, joy: 8, xp: 16, desc: '+54 food · +12 rest', cat: 'meal' },
  starfruit: { id: 'starfruit', name: 'Star Fruit', emoji: '⭐', price: 5, hunger: 20, joy: 8, xp: 6, desc: '+20 food · +8 joy', cat: 'produce' },
  pear: { id: 'pear', name: 'Moon Pear', emoji: '🍐', price: 4, hunger: 18, energy: 4, joy: 4, xp: 5, desc: '+18 food · +4 rest', cat: 'produce' },
  jerky: { id: 'jerky', name: 'Trail Jerky', emoji: '🥩', price: 7, hunger: 24, joy: 3, xp: 6, desc: '+24 food · pocket-sized', cat: 'meat' },
  turkey: { id: 'turkey', name: 'Roast Turkey', emoji: '🍗', price: 12, hunger: 38, energy: 8, xp: 10, desc: '+38 food · +8 rest', cat: 'meat' },
  broccoli: { id: 'broccoli', name: 'Little Trees', emoji: '🥦', price: 5, hunger: 18, clean: 4, xp: 6, desc: '+18 food · +4 clean', cat: 'veg' },
  beet: { id: 'beet', name: 'Ruby Beet', emoji: '🟣', price: 6, hunger: 22, energy: 6, xp: 7, desc: '+22 food · +6 rest', cat: 'veg' },
  horchata: { id: 'horchata', name: 'Cinnamon Horchata', emoji: '🥛', price: 7, energy: 22, joy: 12, xp: 7, desc: '+22 rest · +12 joy', cat: 'drink' },
  milkshake: { id: 'milkshake', name: 'Berry Shake', emoji: '🥤', price: 9, hunger: 10, energy: 20, joy: 18, xp: 9, desc: '+20 rest · +18 joy', cat: 'drink' },
  lemontea: { id: 'lemontea', name: 'Sun Lemon Tea', emoji: '🧉', price: 6, energy: 18, joy: 10, clean: 4, xp: 6, desc: '+18 rest · +10 joy', cat: 'drink' },
  coconut: { id: 'coconut', name: 'Coconut Water', emoji: '🥥', price: 7, energy: 20, clean: 6, xp: 6, desc: '+20 rest · +6 clean', cat: 'drink' },
  churro: { id: 'churro', name: 'Cinnamon Churro', emoji: '🥨', price: 7, hunger: 18, joy: 18, xp: 9, desc: '+18 food · +18 joy', cat: 'dessert' },
  macaron: { id: 'macaron', name: 'Cloud Macaron', emoji: '🍬', price: 6, hunger: 10, joy: 20, xp: 8, desc: '+10 food · +20 joy', cat: 'dessert' },
  tresleches: { id: 'tresleches', name: 'Three-Milk Cake', emoji: '🍰', price: 11, hunger: 26, joy: 24, xp: 12, desc: '+26 food · +24 joy', cat: 'dessert' },
  smores: { id: 'smores', name: 'Campfire S’mores', emoji: '🍫', price: 8, hunger: 20, joy: 20, xp: 10, desc: '+20 food · +20 joy', cat: 'dessert' },
  toastie: { id: 'toastie', name: 'Melted Toastie', emoji: '🥪', price: 9, hunger: 32, energy: 8, joy: 6, xp: 9, desc: '+32 food · +8 rest', cat: 'meal' },
  bao: { id: 'bao', name: 'Fluffy Bao', emoji: '🥟', price: 8, hunger: 28, joy: 10, xp: 8, desc: '+28 food · +10 joy', cat: 'meal' },
  noodlebowl: { id: 'noodlebowl', name: 'Slurp Noodles', emoji: '🍜', price: 12, hunger: 42, energy: 10, joy: 8, xp: 11, desc: '+42 food · +10 rest', cat: 'meal' },
  potpie: { id: 'potpie', name: 'Hearth Pot Pie', emoji: '🥧', price: 13, hunger: 46, energy: 8, joy: 6, xp: 12, desc: '+46 food · +8 rest', cat: 'meal' },
  honeycake: { id: 'honeycake', name: 'Honeycomb Cake', emoji: '🍯', price: 16, hunger: 30, joy: 26, xp: 14, desc: '+30 food · +26 joy', cat: 'dessert', monthly: true },
  moonshake: { id: 'moonshake', name: 'Moonberry Shake', emoji: '🥤', price: 14, energy: 30, joy: 20, xp: 12, desc: '+30 rest · +20 joy', cat: 'drink', monthly: true },
  starpie: { id: 'starpie', name: 'Starfruit Pie', emoji: '🥧', price: 15, hunger: 26, joy: 24, xp: 13, desc: '+26 food · +24 joy', cat: 'dessert', monthly: true },
  dumplingboat: { id: 'dumplingboat', name: 'Dumpling Boat', emoji: '🥟', price: 20, hunger: 52, energy: 10, xp: 16, desc: '+52 food · +10 rest', cat: 'meal', monthly: true },
  lagoonstew: { id: 'lagoonstew', name: 'Lagoon Stew', emoji: '🍲', price: 19, hunger: 48, clean: 4, xp: 15, desc: '+48 food · +4 clean', cat: 'meal', monthly: true },
  aurorabun: { id: 'aurorabun', name: 'Aurora Bun', emoji: '🥐', price: 13, hunger: 18, joy: 22, xp: 12, desc: '+18 food · +22 joy', cat: 'dessert', monthly: true },
  solarcurry: { id: 'solarcurry', name: 'Solar Curry', emoji: '🍛', price: 21, hunger: 55, energy: 12, joy: 6, xp: 17, desc: '+55 food · +12 rest', cat: 'meal', monthly: true },
  cloudsorbet: { id: 'cloudsorbet', name: 'Cloud Sorbet', emoji: '🍨', price: 15, hunger: 16, joy: 30, xp: 14, desc: '+16 food · +30 joy', cat: 'dessert', monthly: true },
  rebirthmeal: { id: 'rebirthmeal', name: 'Rebirth Meal', emoji: '🌱', price: 600, hunger: 0, energy: 0, joy: 40, bond: 4, xp: 0, desc: 'MAX only · returns a retired sprite to an egg with permanent rebirth bonuses', cat: 'meal', rebirth: true },
};
const FOOD_KEYS = Object.keys(FOODS);
const MONTHLY_FOOD_KEYS = FOOD_KEYS.filter((k) => FOODS[k].monthly);
const FOOD_CATEGORIES = {
  produce: { name: 'Produce', icon: '🍓' },
  meat: { name: 'Meat', icon: '🍖' },
  veg: { name: 'Vegetables', icon: '🥕' },
  drink: { name: 'Drinks', icon: '🥤' },
  dessert: { name: 'Desserts', icon: '🍰' },
  meal: { name: 'Meals', icon: '🍲' },
  treat: { name: 'Treats', icon: '🍭' },
};

/* Free snacks live in the pantry. They are earned from check-ins and gifts. */
const SNACKS = {
  honey: { id: 'honey', name: 'Honey Drop', emoji: '🍬', hunger: 10, joy: 12, xp: 8, desc: '+10 food · +12 joy' },
  mooncake: { id: 'mooncake', name: 'Moon Cake', emoji: '🥮', hunger: 20, energy: 10, joy: 5, xp: 10, desc: '+20 food · +10 rest' },
  cookie: { id: 'cookie', name: 'Star Cookie', emoji: '🍪', hunger: 12, joy: 9, bond: 2, xp: 12, desc: '+12 food · +bond' },
  fizz: { id: 'fizz', name: 'Dew Fizz', emoji: '🥤', energy: 24, joy: 8, clean: 4, xp: 8, desc: '+24 rest · +8 joy' },
};
const SNACK_KEYS = Object.keys(SNACKS);

/* Size is a heritable trait that changes how much room a sprite takes up. */
const SIZES = {
  small: { name: 'Small', scale: 0.85, desc: 'Pocket-sized and proud of it.' },
  standard: { name: 'Standard', scale: 1, desc: 'Classic, huggable proportions.' },
  large: { name: 'Large', scale: 1.16, desc: 'A whole armful of sprite.' },
};
const SIZE_KEYS = Object.keys(SIZES);

/* Element genes grant one active power; breed habits grant a second, quieter one. */
const GENE_POWERS = {
  ember: { name: 'Ember Spark', icon: '🔥', desc: 'Games pay +2 coins.', effect: { gameCoins: 2 } },
  tide: { name: 'Tide Song', icon: '🌊', desc: 'Chats pay +1 bonus coin.', effect: { chatCoins: 1 } },
  gale: { name: 'Tailwind', icon: '🍃', desc: 'Gifts arrive 20% sooner.', effect: { giftSpeed: 1.2 } },
  bloom: { name: 'Everbloom', icon: '🌱', desc: 'Snacks give +25% XP.', effect: { snackXp: 1.25 } },
  volt: { name: 'Live Wire', icon: '⚡', desc: 'Pets pay +1 extra coin.', effect: { petCoins: 1 } },
  frost: { name: 'Stillwater', icon: '❄️', desc: 'All needs fade 10% slower.', effect: { decay: 0.9 } },
  dusk: { name: 'Moonglow', icon: '🌙', desc: 'Night games pay +3 coins.', effect: { nightCoins: 3 } },
  radiant: { name: 'Daybreak', icon: '☀️', desc: 'Day games pay +3 coins.', effect: { dayCoins: 3 } },
  demon: { name: 'Infernal Pact', icon: '😈', desc: 'Games pay +3 coins and needs fade 8% slower.', effect: { gameCoins: 3, decay: 0.92 } },
  angel: { name: 'Guardian Halo', icon: '😇', desc: 'Pets build +35% more bond and pay +1 coin.', effect: { petBond: 1.35, petCoins: 1 } },
  air: { name: 'Updraft', icon: '🌬️', desc: 'Gifts arrive 25% sooner.', effect: { giftSpeed: 1.25 } },
  water: { name: 'Riptide', icon: '💧', desc: 'Chats pay +2 coins.', effect: { chatCoins: 2 } },
  earth: { name: 'Bedrock', icon: '🌍', desc: 'All needs fade 12% slower.', effect: { decay: 0.88 } },
  honey: { name: 'Sweet Bait', icon: '🍯', desc: 'Snacks give +40% XP.', effect: { snackXp: 1.4 } },
  pond: { name: 'Still Pond', icon: '🪷', desc: 'Joy fades 25% slower.', effect: { joyDecay: 0.75 } },
  hero: { name: 'Power Pose', icon: '🦸', desc: '+15% XP and +2 game coins.', effect: { xp: 1.15, gameCoins: 2 } },
  ants: { name: 'Colony Carry', icon: '🐜', desc: 'Pets pay +2 coins and +10% XP.', effect: { petCoins: 2, xp: 1.1 } },
  fire: { name: 'Wildfire', icon: '🔥', desc: '+20% XP and +3 game coins.', effect: { xp: 1.2, gameCoins: 3 } },
  splash: { name: 'Rainbow Arc', icon: '💦', desc: 'Day games pay +3 coins and gifts come sooner.', effect: { dayCoins: 3, giftSpeed: 1.15 } },
  slime: { name: 'Slippery', icon: '🫧', desc: 'Clean fades 30% slower and hunger 10% slower.', effect: { cleanDecay: 0.7, hungerDecay: 0.9 } },
  rock: { name: 'Stonehide', icon: '🪨', desc: 'Hunger fades 25% slower.', effect: { hungerDecay: 0.75 } },
  stone: { name: 'Old Runes', icon: '🧱', desc: '+10% XP and +1 coin per pet.', effect: { xp: 1.1, petCoins: 1 } },
  bug: { name: 'Sixth Sense', icon: '🐛', desc: 'Gifts come 20% sooner and chats pay +1 coin.', effect: { giftSpeed: 1.2, chatCoins: 1 } },
  bunny: { name: 'Soft Hop', icon: '🐰', desc: 'Pets build +40% more bond.', effect: { petBond: 1.4 } },
  cloud: { name: 'Drift', icon: '☁️', desc: 'Energy fades 30% slower.', effect: { energyDecay: 0.7 } },
  crystal: { name: 'Refraction', icon: '💎', desc: '+15% XP and night games pay +2 coins.', effect: { xp: 1.15, nightCoins: 2 } },
  mushroom: { name: 'Spore Bloom', icon: '🍄', desc: 'Snacks give +25% XP and joy fades 15% slower.', effect: { snackXp: 1.25, joyDecay: 0.85 } },
  candy: { name: 'Sugar Rush', icon: '🍬', desc: 'Games pay +2 coins and +10% XP.', effect: { gameCoins: 2, xp: 1.1 } },
  wolf: { name: 'Pack Howl', icon: '🐺', desc: 'Pets pay +2 coins and +10% XP.', effect: { petCoins: 2, xp: 1.1 } },
  tiger: { name: 'Pounce', icon: '🐯', desc: 'Games pay +3 coins and +15% XP.', effect: { gameCoins: 3, xp: 1.15 } },
  bear: { name: 'Hibernate', icon: '🐻', desc: 'Energy fades 30% slower and hunger 10% slower.', effect: { energyDecay: 0.7, hungerDecay: 0.9 } },
  frog: { name: 'Lily Leap', icon: '🐸', desc: 'Joy fades 25% slower.', effect: { joyDecay: 0.75 } },
  pig: { name: 'Lucky Snout', icon: '🐷', desc: 'Snacks give +30% XP.', effect: { snackXp: 1.3 } },
  cat: { name: 'Nine Lives', icon: '🐱', desc: 'All needs fade 10% slower and pets pay +1 coin.', effect: { decay: 0.9, petCoins: 1 } },
  cow: { name: 'Milk & Honey', icon: '🐮', desc: 'Snacks give +25% XP and joy fades 15% slower.', effect: { snackXp: 1.25, joyDecay: 0.85 } },
  fish: { name: 'Deep Current', icon: '🐟', desc: 'Chats pay +2 coins and energy fades 15% slower.', effect: { chatCoins: 2, energyDecay: 0.85 } },
  bat: { name: 'Echo', icon: '🦇', desc: 'Night games pay +4 coins.', effect: { nightCoins: 4 } },
  butterfly: { name: 'Wingdust', icon: '🦋', desc: 'Gifts come 25% sooner and +10% XP.', effect: { giftSpeed: 1.25, xp: 1.1 } },
  pillow: { name: 'Soft Landing', icon: '🛏️', desc: 'Energy fades 35% slower.', effect: { energyDecay: 0.65 } },
  dreameater: { name: 'Dream Feast', icon: '🌌', desc: 'Night games pay +5 coins and +10% XP.', effect: { nightCoins: 5, xp: 1.1 } },
  lucky: { name: 'Four-Leaf Fortune', icon: '🍀', desc: 'Games pay +4 coins and gifts come sooner.', effect: { gameCoins: 4, giftSpeed: 1.2 } },
  banana: { name: 'Peel Out', icon: '🍌', desc: '+20% XP and energy fades 15% slower.', effect: { xp: 1.2, energyDecay: 0.85 } },
  apple: { name: 'An Apple a Day', icon: '🍎', desc: 'All needs fade 12% slower.', effect: { decay: 0.88 } },
  ice: { name: 'Deep Freeze', icon: '🧊', desc: 'Night games pay +3 coins and hunger fades 20% slower.', effect: { nightCoins: 3, hungerDecay: 0.8 } },
  cherry: { name: 'Double Trouble', icon: '🍒', desc: 'Pets pay +2 coins and +10% XP.', effect: { petCoins: 2, xp: 1.1 } },
  cocoa: { name: 'Warm Mug', icon: '☕', desc: 'Joy fades 25% slower and snacks give +20% XP.', effect: { joyDecay: 0.75, snackXp: 1.2 } },
  pizza: { name: 'Perfect Slice', icon: '🍕', desc: 'Games pay +3 coins and gifts come 15% sooner.', effect: { gameCoins: 3, giftSpeed: 1.15 } },
  fishy: { name: 'Fishy Business', icon: '🐟', desc: 'Chats pay +2 coins and energy fades 10% slower.', effect: { chatCoins: 2, energyDecay: 0.9 } },
  striker: { name: 'Hat Trick', icon: '⚽', desc: 'Games pay +3 coins and +10% XP.', effect: { gameCoins: 3, xp: 1.1 } },
  aura: { name: 'Aura Field', icon: '✨', desc: 'All needs fade 12% slower and pets build +20% bond.', effect: { decay: 0.88, petBond: 1.2 } },
  six: { name: 'Sixth Sense', icon: '🎲', desc: 'Pets pay +2 coins and chats pay +1 coin.', effect: { petCoins: 2, chatCoins: 1 } },
  seven: { name: 'Lucky Seven', icon: '🎰', desc: 'Games pay +4 coins and gifts come sooner.', effect: { gameCoins: 4, giftSpeed: 1.15 } },
  king: { name: 'Royal Decree', icon: '👑', desc: 'Pets pay +3 coins and build +50% more bond.', effect: { petCoins: 3, petBond: 1.5 } },
  queen: { name: 'Queen’s Grace', icon: '♛', desc: 'Joy fades 30% slower and gifts come 20% sooner.', effect: { joyDecay: 0.7, giftSpeed: 1.2 } },
  ghost: { name: 'Phase', icon: '👻', desc: 'Night games pay +4 coins and needs fade slower.', effect: { nightCoins: 4, decay: 0.92 } },
  skull: { name: 'Bone Rattle', icon: '💀', desc: 'Night games pay +4 coins and +10% XP.', effect: { nightCoins: 4, xp: 1.1 } },
  death: { name: 'Final Toll', icon: '⏳', desc: 'Night games pay +5 coins and games pay +2 more.', effect: { nightCoins: 5, gameCoins: 2 } },
  lootllama: { name: 'Loot Drop', icon: '🎁', desc: 'Gifts arrive 40% sooner and games pay +2 coins.', effect: { giftSpeed: 1.4, gameCoins: 2 } },
  duck: { name: 'Duck Duck', icon: '🦆', desc: 'Joy fades 25% slower and pets pay +1 coin.', effect: { joyDecay: 0.75, petCoins: 1 } },
  peely: { name: 'Peely Power', icon: '🍌', desc: '+20% XP and energy fades 15% slower.', effect: { xp: 1.2, energyDecay: 0.85 } },
  dream: { name: 'Sweet Dreams', icon: '💤', desc: 'Energy fades 35% slower and night games pay +2.', effect: { energyDecay: 0.65, nightCoins: 2 } },
  zeropoint: { name: 'Zero Point', icon: '🌌', desc: 'Games and night games pay +3 coins, and +20% XP.', effect: { gameCoins: 3, nightCoins: 3, xp: 1.2 } },
  punk: { name: 'Mosh Pit', icon: '🎸', desc: 'Games pay +3 coins and joy fades 15% slower.', effect: { gameCoins: 3, joyDecay: 0.85 } },
  batman: { name: 'Dark Knight', icon: '🦇', desc: 'Night games pay +5 coins and needs fade slower.', effect: { nightCoins: 5, decay: 0.92 } },
  superman: { name: 'Man of Steel', icon: '🦸', desc: 'Games pay +3 coins and all needs fade 10% slower.', effect: { gameCoins: 3, decay: 0.9 } },
  ironmouse: { name: 'Iron Will', icon: '🎤', desc: 'Pets build +40% more bond and pay +2 coins.', effect: { petBond: 1.4, petCoins: 2 } },
  bullet: { name: 'Quickdraw', icon: '🎯', desc: 'Games pay +4 coins.', effect: { gameCoins: 4 } },
  burntpb: { name: 'Crispy', icon: '🍞', desc: 'Snacks give +30% XP and hunger fades slower.', effect: { snackXp: 1.3, hungerDecay: 0.9 } },
  headshot: { name: 'Bullseye', icon: '🎯', desc: 'Games pay +5 coins.', effect: { gameCoins: 5 } },
  cube: { name: 'Block Party', icon: '🧊', desc: 'Clean fades 40% slower and +10% XP.', effect: { cleanDecay: 0.6, xp: 1.1 } },
  bombjr: { name: 'Short Fuse', icon: '💣', desc: 'Games pay +4 coins and joy fades 15% slower.', effect: { gameCoins: 4, joyDecay: 0.85 } },
  grim: { name: 'Harvest', icon: '🌾', desc: 'Night games pay +5 coins and snacks give +25% XP.', effect: { nightCoins: 5, snackXp: 1.25 } },
  squibbly: { name: 'Tree Hug', icon: '🌳', desc: 'All needs fade 15% slower and pets build +30% bond.', effect: { decay: 0.85, petBond: 1.3 } },
  onewish: { name: 'One Wish', icon: '🌠', desc: '+25% XP, gifts 35% sooner, and +50% pet bond.', effect: { xp: 1.25, giftSpeed: 1.35, petBond: 1.5 } },
  klombo: { name: 'Klombo Stomp', icon: '🦕', desc: 'Games pay +4, hunger fades 25% slower, +15% XP.', effect: { gameCoins: 4, hungerDecay: 0.75, xp: 1.15 } },
  crown: { name: 'Crown Jewel', icon: '👑', desc: 'Pets pay +3 and build +50% bond; gifts come sooner.', effect: { petCoins: 3, petBond: 1.5, giftSpeed: 1.2 } },
  spookydash: { name: 'Spooky Dash', icon: '💨', desc: 'Night games +5, games +3, joy fades 20% slower.', effect: { nightCoins: 5, gameCoins: 3, joyDecay: 0.8 } },
  jazz: { name: 'Jazz Hands', icon: '🎷', desc: 'Games pay +4 coins and +15% XP.', effect: { gameCoins: 4, xp: 1.15 } },
  crash: { name: 'Spin Cycle', icon: '🌀', desc: 'Games pay +4 coins and joy fades 20% slower.', effect: { gameCoins: 4, joyDecay: 0.8 } },
  blinky: { name: 'Blink', icon: '👁️', desc: 'Gifts arrive 45% sooner and games pay +2.', effect: { giftSpeed: 1.45, gameCoins: 2 } },
  deer: { name: 'Forest Grace', icon: '🦌', desc: 'All needs fade 15% slower and +35% pet bond.', effect: { decay: 0.85, petBond: 1.35 } },
  sonic: { name: 'Spin Dash', icon: '💫', desc: 'Games pay +4 coins and +10% XP.', effect: { gameCoins: 4, xp: 1.1 } },
  honeypot: { name: 'Sweet Dip', icon: '🍯', desc: 'Snacks give +35% XP and hunger fades slower.', effect: { snackXp: 1.35, hungerDecay: 0.9 } },
  dumpster: { name: 'Scavenge', icon: '🗑️', desc: 'Gifts arrive 35% sooner and games pay +2.', effect: { giftSpeed: 1.35, gameCoins: 2 } },
  tails: { name: 'Twin Tails', icon: '🦊', desc: 'Games pay +3 coins and gifts come 25% sooner.', effect: { gameCoins: 3, giftSpeed: 1.25 } },
  shadow: { name: 'Chaos Control', icon: '🌑', desc: 'Night games pay +5 coins and +15% XP.', effect: { nightCoins: 5, xp: 1.15 } },
  killswitch: { name: 'Killswitch', icon: '🔴', desc: 'Games pay +5 coins.', effect: { gameCoins: 5 } },
  morgana: { name: 'Panther Pounce', icon: '🐈‍⬛', desc: 'Night games pay +4 coins and +30% pet bond.', effect: { nightCoins: 4, petBond: 1.3 } },
  vampire: { name: 'Night Bite', icon: '🧛', desc: 'Night games pay +5 coins and hunger fades slower.', effect: { nightCoins: 5, hungerDecay: 0.85 } },
  onigiri: { name: 'Rice Ball', icon: '🍙', desc: 'Hunger fades 20% slower and snacks give +20% XP.', effect: { hungerDecay: 0.8, snackXp: 1.2 } },
  bushranger: { name: 'Camouflage', icon: '🌿', desc: 'Gifts arrive 30% sooner and needs fade 10% slower.', effect: { giftSpeed: 1.3, decay: 0.9 } },
  jonesy: { name: 'Default Dance', icon: '🕺', desc: 'Games pay +2 coins and joy fades 20% slower.', effect: { gameCoins: 2, joyDecay: 0.8 } },
  blaster: { name: 'Pixel Shot', icon: '👾', desc: 'Games pay +3 coins and +10% XP.', effect: { gameCoins: 3, xp: 1.1 } },
  adventure: { name: 'Trailblazer', icon: '🧭', desc: 'Gifts arrive 25% sooner and games pay +2 coins.', effect: { giftSpeed: 1.25, gameCoins: 2 } },
  stormscout: { name: 'Storm Eye', icon: '🌩️', desc: 'Night games and day games pay +3 coins.', effect: { nightCoins: 3, dayCoins: 3 } },
  overshield: { name: 'Overshield', icon: '🛡️', desc: 'All needs fade 15% slower.', effect: { decay: 0.85 } },
  megaman: { name: 'Mega Buster', icon: '🤖', desc: 'Games pay +4 coins.', effect: { gameCoins: 4 } },
  birthday: { name: 'Party Time', icon: '🎂', desc: 'Joy fades 30% slower and gifts come 20% sooner.', effect: { joyDecay: 0.7, giftSpeed: 1.2 } },
  meowscles: { name: 'Flex', icon: '💪', desc: 'Pets pay +2 coins and build +35% more bond.', effect: { petCoins: 2, petBond: 1.35 } },
  boss: { name: 'Executive Order', icon: '👔', desc: 'Pets pay +2 coins and all needs fade 10% slower.', effect: { petCoins: 2, decay: 0.9 } },
  vini: { name: 'Samba Step', icon: '⚽', desc: 'Games pay +4 coins and joy fades 15% slower.', effect: { gameCoins: 4, joyDecay: 0.85 } },
  pollo: { name: 'Poultry Power', icon: '🐔', desc: 'Snacks give +30% XP and hunger fades 15% slower.', effect: { snackXp: 1.3, hungerDecay: 0.85 } },
  wick: { name: 'Baba Yaga', icon: '🐶', desc: 'Games pay +3 coins and all needs fade 12% slower.', effect: { gameCoins: 3, decay: 0.88 } },
  pumpkin: { name: 'Candle Glow', icon: '🎃', desc: 'Night games pay +3 coins and joy fades 10% slower.', effect: { nightCoins: 3, joyDecay: 0.9 } },
  santa: { name: 'Nice List', icon: '🎅', desc: 'Gifts arrive 40% sooner and +20% pet bond.', effect: { giftSpeed: 1.4, petBond: 1.2 } },
  cupid: { name: 'Love Arrow', icon: '💘', desc: 'Pets build +50% more bond and pay +1 coin.', effect: { petBond: 1.5, petCoins: 1 } },
  charm: { name: 'Charmed', icon: '🧿', desc: 'Gifts arrive 25% sooner and games pay +2 coins.', effect: { giftSpeed: 1.25, gameCoins: 2 } },
  snow: { name: 'Snowfall', icon: '❄️', desc: 'Cold weather is cozy: +3 game coins and joy fades 12% slower.', effect: { gameCoins: 3, joyDecay: 0.88 } },
  zombie: { name: 'Grave Digger', icon: '🧟', desc: 'Gifts arrive 25% sooner and hunger fades 15% slower.', effect: { giftSpeed: 1.25, hungerDecay: 0.85 } },
  undead: { name: 'Second Wind', icon: '👻', desc: 'Night games pay +3 coins and energy fades 20% slower.', effect: { nightCoins: 3, energyDecay: 0.8 } },
  starfish: { name: 'Five Arm Hug', icon: '⭐', desc: 'Pets build +40% more bond and pay +1 coin.', effect: { petBond: 1.4, petCoins: 1 } },
  pika: { name: 'Static Cheeks', icon: '⚡', desc: 'Games pay +3 coins and +10% XP.', effect: { gameCoins: 3, xp: 1.1 } },
  unicorn: { name: 'Wish Horn', icon: '🦄', desc: 'Daytime games pay +3 coins and pets build +30% more bond.', effect: { dayCoins: 3, petBond: 1.3 } },
  devil: { name: 'Fine Print', icon: '😈', desc: 'Night games pay +4 coins and games pay +1 more.', effect: { nightCoins: 4, gameCoins: 1 } },
  yoga: { name: 'Inner Calm', icon: '🧘', desc: 'All needs fade 15% slower and +10% XP.', effect: { decay: 0.85, xp: 1.1 } },
  shark: { name: 'Feeding Frenzy', icon: '🦈', desc: 'Games pay +4 coins and energy fades 10% slower.', effect: { gameCoins: 4, energyDecay: 0.9 } },
  whitewhale: { name: 'Deep Song', icon: '🐋', desc: 'Gifts arrive 20% sooner and +15% XP.', effect: { giftSpeed: 1.2, xp: 1.15 } },
  dragon: { name: 'Dragonfire', icon: '🐉', desc: 'Games pay +5 coins and +15% XP.', effect: { gameCoins: 5, xp: 1.15 } },
  darkjoker: { name: 'Wildcard', icon: '🃏', desc: 'Games pay +3 coins and gifts arrive 25% sooner.', effect: { gameCoins: 3, giftSpeed: 1.25 } },
  jackskull: { name: 'Halloween King', icon: '🎃', desc: 'Night games pay +5 coins and gifts arrive 20% sooner.', effect: { nightCoins: 5, giftSpeed: 1.2 } },
  sally: { name: 'Patchwork Heart', icon: '🧵', desc: 'Pets build +35% more bond and all needs fade 5% slower.', effect: { petBond: 1.35, decay: 0.95 } },
  keke: { name: 'Keke Sparkle', icon: '🎀', desc: '+15% XP and pets pay +1 coin.', effect: { xp: 1.15, petCoins: 1 } },
  bestie: { name: 'Best Friends', icon: '💖', desc: 'Pets build +45% more bond and chats pay +2 coins.', effect: { petBond: 1.45, chatCoins: 2 } },
  dog: { name: 'Good Dog', icon: '🐶', desc: 'Pets pay +2 coins and build +20% more bond.', effect: { petCoins: 2, petBond: 1.2 } },
  karen: { name: 'Speak to the Manager', icon: '💇', desc: 'Chats pay +4 coins and needs fade 3% slower.', effect: { chatCoins: 4, decay: 0.97 } },
  motherearth: { name: 'Gaia', icon: '🌍', desc: 'All needs fade 20% slower and +20% XP.', effect: { decay: 0.8, xp: 1.2 } },
  werewolf: { name: 'Full Moon', icon: '🌕', desc: 'Night games pay +5 coins and +15% XP.', effect: { nightCoins: 5, xp: 1.15 } },
  normal: { name: 'Perfectly Normal', icon: '🙂', desc: 'All needs fade 10% slower and games pay +1 coin.', effect: { decay: 0.9, gameCoins: 1 } },
  gummybear: { name: 'Gummy Bounce', icon: '🐻', desc: 'Joy fades 30% slower and snacks give +20% XP.', effect: { joyDecay: 0.7, snackXp: 1.2 } },
  muddy: { name: 'Mudslide', icon: '🟤', desc: 'Games pay +2 coins and clean fades 20% slower.', effect: { gameCoins: 2, cleanDecay: 0.8 } },
  spot: { name: 'Lucky Paw', icon: '🐾', desc: 'Pets pay +2 coins and build +30% more bond.', effect: { petCoins: 2, petBond: 1.3 } },
  frozen: { name: 'Permafrost', icon: '🧊', desc: '+12% XP and hunger fades 25% slower.', effect: { xp: 1.12, hungerDecay: 0.75 } },
  sixtyseven: { name: 'Clutch Play', icon: '🎮', desc: 'Games pay +4 coins and +10% XP.', effect: { gameCoins: 4, xp: 1.1 } },
  creeper: { name: 'Short Fuse', icon: '💥', desc: 'Games pay +4 coins and +10% XP.', effect: { gameCoins: 4, xp: 1.1 } },
  lion: { name: 'Pride Roar', icon: '🦁', desc: 'Pets build +40% more bond and games pay +2 coins.', effect: { petBond: 1.4, gameCoins: 2 } },
  panda: { name: 'Bamboo Chill', icon: '🎋', desc: 'Energy fades 30% slower and snacks give +20% XP.', effect: { energyDecay: 0.7, snackXp: 1.2 } },
  penguin: { name: 'Ice Slide', icon: '🧊', desc: 'Night games pay +3 coins and clean fades 20% slower.', effect: { nightCoins: 3, cleanDecay: 0.8 } },
  owl: { name: 'Night Vision', icon: '🌙', desc: 'Night games pay +4 coins and +10% XP.', effect: { nightCoins: 4, xp: 1.1 } },
  snake: { name: 'Shed Skin', icon: '🐍', desc: 'Clean fades 25% slower and gifts arrive 20% sooner.', effect: { cleanDecay: 0.75, giftSpeed: 1.2 } },
  spider: { name: 'Web Trap', icon: '🕸️', desc: 'Gifts arrive 25% sooner and pets pay +1 coin.', effect: { giftSpeed: 1.25, petCoins: 1 } },
  crab: { name: 'Pinch', icon: '🦀', desc: 'Games pay +3 coins and hunger fades 15% slower.', effect: { gameCoins: 3, hungerDecay: 0.85 } },
  dolphin: { name: 'Echo Leap', icon: '🐬', desc: 'Chats pay +3 coins and joy fades 20% slower.', effect: { chatCoins: 3, joyDecay: 0.8 } },
  sheep: { name: 'Woolly Hug', icon: '🐑', desc: 'Pets pay +2 coins and energy fades 20% slower.', effect: { petCoins: 2, energyDecay: 0.8 } },
  bull: { name: 'Bull Rush', icon: '🐂', desc: 'Games pay +3 coins and hunger fades 10% slower.', effect: { gameCoins: 3, hungerDecay: 0.9 } },
  bossbaby: { name: 'Synergy', icon: '💼', desc: '+15% XP and gifts arrive 15% sooner.', effect: { xp: 1.15, giftSpeed: 1.15 } },
  hero6: { name: 'Sixth Sense', icon: '🦸', desc: 'Games pay +3 coins and +12% XP.', effect: { gameCoins: 3, xp: 1.12 } },
  wrixel: { name: 'Pixel Shift', icon: '🟩', desc: '+15% XP and gifts arrive 15% sooner.', effect: { xp: 1.15, giftSpeed: 1.15 } },
  phantom: { name: 'Phase Step', icon: '🌫️', desc: 'Night games pay +3 coins and joy fades 20% slower.', effect: { nightCoins: 3, joyDecay: 0.8 } },
  mali: { name: 'Dune Dash', icon: '🏜️', desc: 'Games pay +3 coins and hunger fades 15% slower.', effect: { gameCoins: 3, hungerDecay: 0.85 } },
  bastian: { name: 'Bulwark', icon: '🛡️', desc: 'All needs fade 15% slower and pets pay +1 coin.', effect: { decay: 0.85, petCoins: 1 } },
  k1ttyw1ns: { name: 'Meow Streak', icon: '🎙️', desc: 'Pets pay +2 coins and +10% XP.', effect: { petCoins: 2, xp: 1.1 } },
  gracecrowne: { name: 'Royal Levy', icon: '👑', desc: 'Chats pay +2 coins and gifts come 20% sooner.', effect: { chatCoins: 2, giftSpeed: 1.2 } },
  geno: { name: 'Override Protocol', icon: '🟥', desc: 'Games pay +4 coins and +10% XP.', effect: { gameCoins: 4, xp: 1.1 } },
  nicorobin: { name: 'Poneglyph', icon: '📜', desc: 'Chats pay +2 coins and +10% XP.', effect: { chatCoins: 2, xp: 1.1 } },
  ace: { name: 'Flame Fist', icon: '🔥', desc: 'Games pay +4 coins and +15% XP.', effect: { gameCoins: 4, xp: 1.15 } },
  cuddle: { name: 'Team Hug', icon: '💗', desc: 'Pets pay +2 coins and build +35% more bond.', effect: { petCoins: 2, petBond: 1.35 } },
  charlotte: { name: 'Remix', icon: '🎵', desc: 'Chats pay +1 coin and joy fades 25% slower.', effect: { chatCoins: 1, joyDecay: 0.75 } },
  captainx: { name: 'Captain’s Due', icon: '⚓', desc: 'Games pay +3 coins and night games pay +2.', effect: { gameCoins: 3, nightCoins: 2 } },
  kirby: { name: 'Copy Ability', icon: '⭐', desc: '+20% XP and +1 coin per pet.', effect: { xp: 1.2, petCoins: 1 } },
};

const HABITS = {
  puff: { name: 'Snuggle', icon: '💗', desc: 'Pets build +50% more bond.', effect: { petBond: 1.5 } },
  sprig: { name: 'Sunroot', icon: '🌿', desc: '+10% XP from all care.', effect: { xp: 1.1 } },
  flit: { name: 'Lightwing', icon: '🪽', desc: 'Joy fades 15% slower.', effect: { joyDecay: 0.85 } },
  horn: { name: 'Steady', icon: '🛡️', desc: 'Hunger fades 15% slower.', effect: { hungerDecay: 0.85 } },
  blob: { name: 'Slick', icon: '🫧', desc: 'Clean fades 20% slower.', effect: { cleanDecay: 0.8 } },
  wisp: { name: 'Dreamer', icon: '✨', desc: 'Energy fades 20% slower.', effect: { energyDecay: 0.8 } },
  bun: { name: 'Softstep', icon: '🐰', desc: 'Joy fades 15% slower.', effect: { joyDecay: 0.85 } },
  fin: { name: 'Tidebound', icon: '🐟', desc: 'Hunger fades 15% slower.', effect: { hungerDecay: 0.85 } },
  shell: { name: 'Tuck', icon: '🐚', desc: 'Clean fades 20% slower.', effect: { cleanDecay: 0.8 } },
  star: { name: 'Starglow', icon: '⭐', desc: '+10% XP from all care.', effect: { xp: 1.1 } },
  orb: { name: 'Pebble', icon: '⚪', desc: 'Pets build +40% more bond.', effect: { petBond: 1.4 } },
  lanky: { name: 'Reed', icon: '🌾', desc: 'Energy fades 20% slower.', effect: { energyDecay: 0.8 } },
  chonk: { name: 'Pudding', icon: '🍮', desc: 'Clean fades 20% slower.', effect: { cleanDecay: 0.8 } },
  tuft: { name: 'Thistle', icon: '🪶', desc: 'Joy fades 15% slower.', effect: { joyDecay: 0.85 } },
  bean: { name: 'Seedling', icon: '🫘', desc: 'Joy fades 15% slower.', effect: { joyDecay: 0.85 } },
  diamond: { name: 'Facet', icon: '💎', desc: 'Clean fades 20% slower.', effect: { cleanDecay: 0.8 } },
  drop: { name: 'Dewfall', icon: '💧', desc: 'Pets build +40% more bond.', effect: { petBond: 1.4 } },
  wedge: { name: 'Peak', icon: '⛰️', desc: '+10% XP from all care.', effect: { xp: 1.1 } },
  pear: { name: 'Orchard', icon: '🍐', desc: 'Hunger fades 15% slower.', effect: { hungerDecay: 0.85 } },
  pill: { name: 'Capsule', icon: '💊', desc: 'Energy fades 20% slower.', effect: { energyDecay: 0.8 } },
  cp_puffle: { name: 'Puffle Parade', icon: '🐧', desc: 'Pets build +35% more bond and care gives +8% XP.', effect: { petBond: 1.35, xp: 1.08 } },
};

/* Special breeding combos: pair-specific fusions with their own signature power. */
const COMBOS = [
  { id: 'steam-sovereign', name: 'Steam Sovereign', pair: ['ember', 'tide'], palette: 'candy', pattern: 'star', accessory: 'crown', power: { name: 'Steam Crown', icon: '♨️', desc: 'Games pay +4 coins and needs fade 10% slower.', effect: { gameCoins: 4, decay: 0.9 } } },
  { id: 'eclipse-crown', name: 'Eclipse Crown', pair: ['dusk', 'ember'], palette: 'midnight', pattern: 'star', accessory: 'crown', power: { name: 'Eclipse Veil', icon: '🌘', desc: 'Night games pay +5 coins and gifts come sooner.', effect: { nightCoins: 5, giftSpeed: 1.25 } } },
  { id: 'twilight-halo', name: 'Twilight Halo', pair: ['dusk', 'radiant'], palette: 'prism', pattern: 'star', accessory: 'flower', power: { name: 'Twilight Halo', icon: '🌗', desc: 'All XP +20% and pets build extra bond.', effect: { xp: 1.2, petBond: 1.4 } } },
  { id: 'storm-chime', name: 'Storm Chime', pair: ['tide', 'volt'], palette: 'deepsea', pattern: 'stripes', accessory: 'headphones', power: { name: 'Storm Chime', icon: '🌩️', desc: 'Games pay +3 coins and +15% XP.', effect: { gameCoins: 3, xp: 1.15 } } },
  { id: 'glacier-bloom', name: 'Glacier Bloom', pair: ['frost', 'tide'], palette: 'aurora', pattern: 'star', accessory: 'crown', power: { name: 'Glacier Bloom', icon: '🧊', desc: 'All needs fade 20% slower.', effect: { decay: 0.8 } } },
  { id: 'solstice-song', name: 'Solstice Song', pair: ['bloom', 'radiant'], palette: 'matcha', pattern: 'freckles', accessory: 'flower', power: { name: 'Solstice Song', icon: '🌻', desc: 'Snacks give +40% XP and pets pay +1 coin.', effect: { snackXp: 1.4, petCoins: 1 } } },
  { id: 'prismheart', name: 'Prismheart', pair: ['crystal', 'radiant'], palette: 'prism', pattern: 'star', accessory: 'bow', power: { name: 'Prismheart', icon: '💠', desc: '+15% XP, +2 game coins, and gifts come sooner.', effect: { xp: 1.15, gameCoins: 2, giftSpeed: 1.15 } } },
  { id: 'steam-fist', name: 'Steam Fist', pair: ['ace', 'tide'], palette: 'deepsea', pattern: 'stripes', accessory: 'headphones', power: { name: 'Steam Fist', icon: '♨️', desc: 'Games pay +4 coins and +15% XP.', effect: { gameCoins: 4, xp: 1.15 } } },
  { id: 'team-hug', name: 'Team Hug', pair: ['cuddle', 'bear'], palette: 'candy', pattern: 'spots', accessory: 'bow', power: { name: 'Team Hug', icon: '💗', desc: 'Pets pay +3 coins and build +50% more bond.', effect: { petCoins: 3, petBond: 1.5 } } },
  { id: 'high-tide', name: 'High Tide', pair: ['captainx', 'tide'], palette: 'ocean', pattern: 'stripes', accessory: 'none', power: { name: 'High Tide', icon: '⚓', desc: 'Games pay +3 coins and gifts come 20% sooner.', effect: { gameCoins: 3, giftSpeed: 1.2 } } },
  { id: 'blackout', name: 'Blackout', pair: ['geno', 'shadow'], palette: 'midnight', pattern: 'star', accessory: 'headphones', power: { name: 'Blackout', icon: '🟥', desc: 'Night games pay +5 coins and +10% XP.', effect: { nightCoins: 5, xp: 1.1 } } },
];

/* Four check-ins per day, one per window. */
const CHECKIN_WINDOWS = [
  { id: 'morning', label: 'Morning', icon: '🌅', from: 5, to: 11 },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', from: 11, to: 17 },
  { id: 'evening', label: 'Evening', icon: '🌇', from: 17, to: 23 },
  { id: 'night', label: 'Night', icon: '🌙', from: 23, to: 5 },
];

const WEEK_MILESTONES = [
  { id: 'snack-stash', n: 4, label: 'Snack stash', icon: '🍬', kind: 'snacks', amount: 3 },
  { id: 'wild-visitor', n: 8, label: 'Wild sprite', icon: '🌟', kind: 'wild' },
  { id: 'rare-visitor', n: 16, label: 'Rare elderly sprite', icon: '💎', kind: 'rare' },
];

const MONTH_MILESTONES = [
  { id: 'monthly-wild', n: 24, label: 'Monthly wild friend', icon: '🌟', kind: 'wild' },
  { id: 'monthly-rare', n: 48, label: 'Monthly rare elderly sprite', icon: '💎', kind: 'rare' },
];

const YEAR_MILESTONE = { id: 'yearly-mythic', n: 150, label: 'Mythic elderly sprite', icon: '👑', kind: 'mythic' };

/* Food builds evolution affinity. At level 10, enough affinity unlocks a form. */
const DIET_PATHS = {
  hearty: { label: 'Hearty', icon: '🍲', desc: 'Warm, filling food. Grows dragons, leviathans, and big bodies.' },
  sweet: { label: 'Sweet', icon: '🍯', desc: 'Nectar and treats. Grows fairies, seraphs, and bright magic.' },
  eerie: { label: 'Eerie', icon: '🌙', desc: 'Moon berries and midnight snacks. Grows ghouls and wraiths.' },
  wild: { label: 'Wild', icon: '🌿', desc: 'Fizzy, untamed snacks. Grows elemental titans and golems.' },
};

/* World Kitchen dishes build a second evolution track. Every region has its own
   cuisine affinity, so the dish a sprite grows up on decides which regional
   form it takes. */
const CUISINE_PATHS = {
  africa: { label: 'Africa', icon: '🦁', desc: 'Slow stews, spiced rice, and fire-roasted feasts.' },
  asia: { label: 'Asia', icon: '🥢', desc: 'Noodles, rice bowls, dumplings, and tea-house sweets.' },
  middleeast: { label: 'Middle East', icon: '🕌', desc: 'Grilled meats, sesame, herbs, and syrup-soaked pastries.' },
  europe: { label: 'Europe', icon: '🏰', desc: 'Mediterranean comfort, alpine boards, and northern bakes.' },
  latin: { label: 'Latin America', icon: '🌎', desc: 'Corn, beans, bright citrus, and fire-grilled plates.' },
  northamerica: { label: 'North America', icon: '🍁', desc: 'Diner comfort, coastal seafood, and smokehouse barbecue.' },
  caribbean: { label: 'Caribbean', icon: '🌴', desc: 'Pepper, plantain, coconut, and food made for sharing.' },
  oceania: { label: 'Oceania', icon: '🐚', desc: 'Coastal seafood, earth ovens, and picnic sweets.' },
};

const FOOD_DIET = {
  berry: { path: 'eerie', gain: 1 },
  nectar: { path: 'sweet', gain: 1 },
  soup: { path: 'hearty', gain: 2 },
  feast: { path: 'hearty', gain: 2 },
  pop: { path: 'sweet', gain: 1 },
  honey: { path: 'sweet', gain: 1 },
  mooncake: { path: 'eerie', gain: 2 },
  cookie: { path: 'sweet', gain: 1 },
  fizz: { path: 'wild', gain: 2 },
  drumstick: { path: 'hearty', gain: 2 },
  fillet: { path: 'hearty', gain: 2 },
  carrot: { path: 'hearty', gain: 1 },
  greens: { path: 'wild', gain: 2 },
  berryfizz: { path: 'sweet', gain: 2 },
  tea: { path: 'sweet', gain: 1 },
  stew: { path: 'hearty', gain: 2 },
  picnic: { path: 'hearty', gain: 2 },
  mango: { path: 'sweet', gain: 1 },
  peach: { path: 'sweet', gain: 1 },
  skewer: { path: 'hearty', gain: 2 },
  meatpie: { path: 'hearty', gain: 2 },
  pumpkinmash: { path: 'hearty', gain: 1 },
  corn: { path: 'hearty', gain: 1 },
  lassi: { path: 'sweet', gain: 1 },
  boba: { path: 'sweet', gain: 1 },
  lemonade: { path: 'sweet', gain: 1 },
  hotcocoa: { path: 'sweet', gain: 1 },
  smoothie: { path: 'sweet', gain: 1 },
  cheesecake: { path: 'sweet', gain: 2 },
  pudding: { path: 'sweet', gain: 2 },
  moonpie: { path: 'sweet', gain: 2 },
  cinnamon: { path: 'sweet', gain: 2 },
  sundae: { path: 'sweet', gain: 2 },
  ramen: { path: 'hearty', gain: 2 },
  dumplings: { path: 'hearty', gain: 2 },
  curry: { path: 'hearty', gain: 2 },
  starfruit: { path: 'sweet', gain: 1 },
  pear: { path: 'sweet', gain: 1 },
  jerky: { path: 'hearty', gain: 1 },
  turkey: { path: 'hearty', gain: 2 },
  broccoli: { path: 'wild', gain: 1 },
  beet: { path: 'hearty', gain: 1 },
  horchata: { path: 'sweet', gain: 1 },
  milkshake: { path: 'sweet', gain: 2 },
  lemontea: { path: 'sweet', gain: 1 },
  coconut: { path: 'wild', gain: 1 },
  churro: { path: 'sweet', gain: 2 },
  macaron: { path: 'sweet', gain: 2 },
  tresleches: { path: 'sweet', gain: 2 },
  smores: { path: 'sweet', gain: 2 },
  toastie: { path: 'hearty', gain: 1 },
  bao: { path: 'hearty', gain: 1 },
  noodlebowl: { path: 'hearty', gain: 2 },
  potpie: { path: 'hearty', gain: 2 },
  honeycake: { path: 'sweet', gain: 2 },
  moonshake: { path: 'sweet', gain: 1 },
  starpie: { path: 'sweet', gain: 2 },
  dumplingboat: { path: 'hearty', gain: 2 },
  lagoonstew: { path: 'hearty', gain: 2 },
  aurorabun: { path: 'sweet', gain: 2 },
  solarcurry: { path: 'hearty', gain: 2 },
  cloudsorbet: { path: 'sweet', gain: 2 },
};

/* Club Penguin's twelve classic puffle colours. Each one is a permanent diet
   form, so the food path a sprite follows can lead to a familiar little
   puffle instead of one of the older fantasy shapes. */
const CP_PUFFLE_TYPES = {
  blue: {
    label: 'Blue Puffle', icon: '🔵', diet: 'hearty', size: 'standard',
    primary: '#4A9FF5', light: '#A9D6FF', deep: '#1E5FA8', belly: '#E8F5FF',
    desc: 'A loyal little teammate with a propeller cap and a heart for everyone.',
    personality: ['Loyal', 'Content', 'Team player'],
    ability: { name: 'Big Bounce', icon: '⚪', desc: 'Bounces higher than any other puffle and lands it with a grin.', effect: { energyDecay: 0.94 } },
    skill: { name: 'Puffle Rescue', icon: '🛟', desc: 'Blows up the raft and keeps a panicking team in one piece.', effect: { petBond: 1.08 } },
    wild: 'Rallying teams together and eating its weight in cookies.',
    toy: 'Ball and snowballs', snack: 'Pretzels', likesFood: 'berry',
    habitat: { label: 'The Snow Forts', biomes: ['aurora', 'grove'] },
    power: { name: 'Team Cheer', icon: '🔵', desc: '+15% XP, pets build more bond, and gifts arrive sooner.', effect: { xp: 1.15, petBond: 1.15, giftSpeed: 1.1 } },
  },
  red: {
    label: 'Red Puffle', icon: '🔴', diet: 'wild', size: 'standard',
    primary: '#E84B4B', light: '#FF9A8F', deep: '#8F1F25', belly: '#FFE1D9',
    desc: 'A fearless adventurer with a pirate grin and a surfboard close by.',
    personality: ['Adventurous', 'Extreme'],
    ability: { name: 'Cannonball', icon: '🎇', desc: 'Fires itself out of a cannon and lands the trick every time.', effect: { gameCoins: 2 } },
    skill: { name: 'Catchin’ Waves', icon: '🏄', desc: 'Surfs the cove break and only falls off when it means to.', effect: { xp: 1.06 } },
    wild: 'Hunting for buried treasure across Rockhopper Island.',
    toy: 'Bowling pins and cannon', snack: 'Stinky cheese', likesFood: 'fillet',
    habitat: { label: 'Rockhopper Island', biomes: ['tide', 'reef'] },
    power: { name: 'Adventure Rush', icon: '🏴‍☠️', desc: '+20% XP, +4 game coins, and energy fades slower.', effect: { xp: 1.2, gameCoins: 4, energyDecay: 0.9 } },
  },
  pink: {
    label: 'Pink Puffle', icon: '🩷', diet: 'sweet', size: 'standard',
    primary: '#F27FBF', light: '#FFC2E1', deep: '#9C3A6B', belly: '#FFF0F7',
    desc: 'A cheerful athlete who turns every stretch into a dance.',
    personality: ['Athletic', 'Cheery'],
    ability: { name: 'Bubblegum Float', icon: '🩷', desc: 'Floats on bubblegum and out-swims every other puffle.', effect: { energyDecay: 0.93 } },
    skill: { name: 'Aqua Grabber', icon: '🌊', desc: 'Dives the iceberg caves and comes back with the treasure.', effect: { hungerDecay: 0.94 } },
    wild: 'Using bubblegum to float across the cove.',
    toy: 'Skipping rope, snorkel and trampoline', snack: 'Watermelon', likesFood: 'mango',
    habitat: { label: 'The Iceberg', biomes: ['tide', 'reef'] },
    power: { name: 'Poolside Pep', icon: '🎀', desc: '+3 game coins, joy fades slower, and gifts arrive sooner.', effect: { gameCoins: 3, joyDecay: 0.9, giftSpeed: 1.12 } },
  },
  black: {
    label: 'Black Puffle', icon: '⚫', diet: 'eerie', size: 'standard',
    primary: '#35313A', light: '#6D6575', deep: '#17151B', belly: '#7A7284', accent: '#FF9A4C',
    desc: 'A strong, silent shadow with a warm ember at the core.',
    personality: ['Intense', 'Strong'],
    ability: { name: 'Fireball', icon: '🔥', desc: 'Bursts into flame and flies as a fireball when it is truly annoyed.', effect: { nightCoins: 2 } },
    skill: { name: 'Cart Surfer', icon: '🛹', desc: 'Owns every rail in the mine on a skateboard.', effect: { xp: 1.07 } },
    wild: 'Bursting into flames after eating Puffle O’s.',
    toy: 'Skateboard', snack: 'Fish burger', likesFood: 'fillet',
    habitat: { label: 'The Puffle Wild', biomes: ['ember', 'neon'] },
    power: { name: 'Ember Quiet', icon: '🔥', desc: 'Night games pay +4 coins and all needs fade slower.', effect: { nightCoins: 4, decay: 0.9 } },
  },
  green: {
    label: 'Green Puffle', icon: '🟢', diet: 'wild', size: 'standard',
    primary: '#55C85A', light: '#A7EE9E', deep: '#1F6B2C', belly: '#E4FFD8',
    desc: 'A giggling stunt puffle who is always first to the unicycle.',
    personality: ['Playful', 'Funny'],
    ability: { name: 'Propeller Spin', icon: '🚁', desc: 'Straps on a propeller cap and hovers out of reach, giggling.', effect: { energyDecay: 0.92 } },
    skill: { name: 'Jet Pack Adventure', icon: '🚀', desc: 'Threads the caves on a jet pack without spilling a cookie.', effect: { xp: 1.07 } },
    wild: 'Vacuuming up cookies with its mouth.',
    toy: 'Propeller cap and unicycle', snack: 'Tacos', likesFood: 'feast',
    habitat: { label: 'The Wilderness', biomes: ['grove', 'sugar'] },
    power: { name: 'Stunt Spree', icon: '🛴', desc: '+20% XP, +3 game coins, and energy fades slower.', effect: { xp: 1.2, gameCoins: 3, energyDecay: 0.88 } },
  },
  purple: {
    label: 'Purple Puffle', icon: '🟣', diet: 'sweet', size: 'standard',
    primary: '#A774F0', light: '#D4B6FF', deep: '#5B2E99', belly: '#F1E4FF',
    desc: 'A fabulous showstopper who never leaves the dressing room without a spotlight.',
    personality: ['Fabulous', 'Particular'],
    ability: { name: 'Spotlight Dance', icon: '🪩', desc: 'Steps under a disco ball and starts a dance floor that will not stop.', effect: { chatCoins: 1 } },
    skill: { name: 'Dance Contest', icon: '💃', desc: 'Wins every dance-off, then judges the outfits.', effect: { joyDecay: 0.93 } },
    wild: 'Choosing just the right outfit for just the right occasion.',
    toy: 'Disco ball and bubble wand', snack: 'Hummus and pita', likesFood: 'pop',
    habitat: { label: 'The Dance Club', biomes: ['neon', 'sugar'] },
    power: { name: 'Spotlight', icon: '🌟', desc: 'Chats pay +2 coins, gifts arrive sooner, and joy fades slower.', effect: { chatCoins: 2, giftSpeed: 1.15, joyDecay: 0.9 } },
  },
  yellow: {
    label: 'Yellow Puffle', icon: '🟡', diet: 'sweet', size: 'standard',
    primary: '#F4D64B', light: '#FFF2A6', deep: '#947A18', belly: '#FFFAD8', accent: '#E86A8A',
    desc: 'A paint-splattered dreamer with a beret and a brand-new idea.',
    personality: ['Creative', 'Spontaneous'],
    ability: { name: 'Living Paint', icon: '🖌️', desc: 'Sculpts a snow copy of anything it is shown a picture of.', effect: { joyDecay: 0.94 } },
    skill: { name: 'DJ3K', icon: '🎧', desc: 'Mixes a set that gets the whole room dancing.', effect: { xp: 1.06 } },
    wild: 'Making music that gets everyone dancing.',
    toy: 'Paintbrush and easel', snack: 'Popcorn', likesFood: 'pop',
    habitat: { label: 'The Stage', biomes: ['sugar', 'grove'] },
    power: { name: 'Artistic Spark', icon: '🎨', desc: '+18% XP, gifts arrive sooner, and joy fades slower.', effect: { xp: 1.18, giftSpeed: 1.18, joyDecay: 0.88 } },
  },
  white: {
    label: 'White Puffle', icon: '⚪', diet: 'hearty', size: 'standard',
    primary: '#F4F7FF', light: '#FFFFFF', deep: '#8B9AB8', belly: '#FFFFFF', accent: '#5FD8FF',
    desc: 'A shy snow spirit who leaves tiny frostprints wherever it tiptoes.',
    personality: ['Shy', 'Powerful', 'Gentle'],
    ability: { name: 'Freezing Breath', icon: '❄️', desc: 'Freezes liquid — and most other things — with one breath.', effect: { cleanDecay: 0.92 } },
    skill: { name: 'Ice Sculpting', icon: '🧊', desc: 'Carves a perfect rink out of a puddle in an afternoon.', effect: { energyDecay: 0.94 } },
    wild: 'Freezing liquid at will, then looking embarrassed about it.',
    toy: 'Ice skates and snowflakes', snack: 'Yogurt parfait', likesFood: 'tea',
    habitat: { label: 'The Dojo Courtyard', biomes: ['aurora', 'crystal'] },
    power: { name: 'Snowfall', icon: '❄️', desc: 'Energy, hunger, and grime all fade slower.', effect: { energyDecay: 0.85, hungerDecay: 0.92, cleanDecay: 0.88 } },
  },
  orange: {
    label: 'Orange Puffle', icon: '🟠', diet: 'wild', size: 'standard',
    primary: '#F59A3C', light: '#FFCE8A', deep: '#A85B12', belly: '#FFF0DA',
    desc: 'A goofy little explorer with buck teeth and an appetite for everything.',
    personality: ['Curious', 'Zany'],
    ability: { name: 'Bottomless Appetite', icon: '🍽️', desc: 'Eats almost anything, including the box it arrived in.', effect: { hungerDecay: 0.88 } },
    skill: { name: 'Puffle Launch', icon: '🎯', desc: 'Hurls itself from a launcher and lands in exactly one piece.', effect: { gameCoins: 2 } },
    wild: 'Making quick decisions and eating the evidence.',
    toy: 'Box, wagon and truck', snack: 'Socks', likesFood: 'stew',
    habitat: { label: 'The Ski Lodge', biomes: ['savanna', 'grove'] },
    power: { name: 'Zany Appetite', icon: '🍊', desc: '+12% XP, +3 game coins, and hunger fades slower.', effect: { xp: 1.12, gameCoins: 3, hungerDecay: 0.88 } },
  },
  brown: {
    label: 'Brown Puffle', icon: '🟤', diet: 'eerie', size: 'standard',
    primary: '#9B6B45', light: '#D8B089', deep: '#5D3A22', belly: '#F1DDC7',
    desc: 'A goggle-wearing inventor with graph-paper dreams and a rocket in progress.',
    personality: ['Super smart', 'Inventive'],
    ability: { name: 'Gadget Genius', icon: '🔧', desc: 'Builds a working machine out of a beaker, a rocket and a rainy afternoon.', effect: { xp: 1.07 } },
    skill: { name: 'Contraption Lab', icon: '🧪', desc: 'Prototypes a new invention between breakfast and lunch.', effect: { giftSpeed: 1.08 } },
    wild: 'Superior machine-building skills and a lot of graph paper.',
    toy: 'Beakers and rockets', snack: 'Astronaut ice cream', likesFood: 'nectar',
    habitat: { label: 'The Inventor’s Workshop', biomes: ['crystal', 'neon'] },
    power: { name: 'Inventor’s Focus', icon: '🔭', desc: '+18% XP, gifts arrive sooner, and grime fades slower.', effect: { xp: 1.18, giftSpeed: 1.2, cleanDecay: 0.92 } },
  },
  rainbow: {
    label: 'Rainbow Puffle', icon: '🌈', diet: 'eerie', size: 'standard',
    primary: '#B785FF', light: '#FFD1F0', deep: '#6D3AA8', belly: '#FFFFFF',
    bands: ['#FF6B6B', '#FFC857', '#5BD6A2', '#5B9DFF', '#B785FF'],
    desc: 'A regal, colour-shifting puffle that trails stardust and impossible weather.',
    personality: ['Confident', 'Regal'],
    ability: { name: 'Cloud Surf', icon: '☁️', desc: 'Surfs a cloud and rides a rainbow down to the pier.', effect: { giftSpeed: 1.09 } },
    skill: { name: 'Rainbow Ride', icon: '🌈', desc: 'Picks the one cloud that goes exactly where it wants.', effect: { joyDecay: 0.92 } },
    wild: 'Cloud surfing and riding down rainbows.',
    toy: 'A cloud of its own', snack: 'Rainbow lollipop', likesFood: 'feast',
    habitat: { label: 'The Rainbow Cloud', biomes: ['dream', 'aurora'] },
    power: { name: 'Prism Trail', icon: '🌈', desc: '+20% XP, +4 game coins, and gifts arrive sooner.', effect: { xp: 1.2, gameCoins: 4, giftSpeed: 1.15 } },
  },
  gold: {
    label: 'Gold Puffle', icon: '🪙', diet: 'hearty', size: 'standard',
    primary: '#F7C948', light: '#FFF0A8', deep: '#A87812', belly: '#FFF8D6',
    desc: 'A lucky golden digger with a jackhammer and a nose for treasure.',
    personality: ['Lucky', 'Energetic'],
    ability: { name: 'Treasure Dig', icon: '⛏️', desc: 'Digs up gold and gems wherever the ground looks interesting.', effect: { taskCoins: 1 } },
    skill: { name: 'Puffle Digging', icon: '🪙', desc: 'Finds buried coins in places nobody has ever dug.', effect: { gameCoins: 3 } },
    wild: 'Getting distracted by golden objects mid-dig.',
    toy: 'Jackhammer', snack: 'Chocolate coins', likesFood: 'picnic',
    habitat: { label: 'The Gold Mine', biomes: ['crystal', 'ember'] },
    power: { name: 'Golden Dig', icon: '🪙', desc: '+5 game coins, night games pay +3 more, and gifts arrive sooner.', effect: { gameCoins: 5, nightCoins: 3, giftSpeed: 1.1 } },
  },
};

/* Plain-language copy for an effect bag, shared by the card and the power list
   so a colour's numbers are never written out twice. */
function cpPuffleEffectText(effect) {
  if (!effect) return '';
  const parts = [];
  const pct = (value) => `${Math.round((Number(value) - 1) * 100)}%`;
  const slower = (key, label) => {
    const value = Number(effect[key]);
    if (!isFinite(value) || value >= 1) return;
    parts.push(`${label} drains ${Math.round((1 - value) * 100)}% slower`);
  };
  if (effect.xp) parts.push(`+${pct(effect.xp)} XP`);
  if (effect.petBond) parts.push(`+${pct(effect.petBond)} bond from petting`);
  if (effect.giftSpeed) parts.push(`gifts arrive ${pct(effect.giftSpeed)} sooner`);
  slower('energyDecay', 'energy');
  slower('hungerDecay', 'hunger');
  slower('joyDecay', 'joy');
  slower('cleanDecay', 'grime');
  const coins = (value, where) => `${value} coin${Number(value) === 1 ? '' : 's'} ${where}`;
  if (effect.gameCoins) parts.push(`+${coins(effect.gameCoins, 'per game')}`);
  if (effect.nightCoins) parts.push(`+${coins(effect.nightCoins, 'in night games')}`);
  if (effect.chatCoins) parts.push(`+${coins(effect.chatCoins, 'per chat')}`);
  if (effect.taskCoins) parts.push(`+${coins(effect.taskCoins, 'per task')}`);
  return parts.join(' · ');
}

/* The Club Penguin family's body type. Every classic puffle colour carries the
   silhouette it wears in Club Penguin, so a Club Penguin Puffle hatches on a
   Club Penguin body instead of borrowing the Studio's shape picker. The shape
   keys themselves are the CP_PUFFLE_SHAPE_KEYS bodies drawn in sprites.js. */
const CP_PUFFLE_BODY_SHAPES = {
  blue: 'cp_classic',
  red: 'cp_pup',
  pink: 'cp_bunny',
  black: 'cp_ghost',
  green: 'cp_bean',
  purple: 'cp_tall',
  yellow: 'cp_fluff',
  white: 'cp_snow',
  orange: 'cp_chubby',
  brown: 'cp_alien',
  rainbow: 'cp_kitty',
  gold: 'cp_dino',
};

/* Every classic colour lives in the breed's own body type, so the family keeps
   its palette with its silhouette. Set after CP_PUFFLE_TYPES exists. */
if (BREEDS.cp_puffle) BREEDS.cp_puffle.bodyColors = CP_PUFFLE_TYPES;

/* The colour name inside a classic colourway key: 'cp_color_blue' -> 'blue'. */
function cpPuffleColourOfStyle(styleKey) {
  const match = /^cp_color_([a-z0-9]+)$/.exec(String(styleKey || ''));
  return match ? match[1] : null;
}

/* A Club Penguin family sprite is any of the classic breeds: the Club Penguin
   Puffle itself or one of the ten Penguin Puffles. */
function cpPuffleBreedKey(sprite) {
  const breed = String((sprite && sprite.breed) || '');
  return breed === 'cp_puffle' || breed.startsWith('cp_penguin_') ? breed : null;
}

/* The stage colour of the Club Penguin line: blue, green, purple, rainbow, then
   gold as the puffle grows. */
function cpPuffleStageStyle(stage) {
  return typeof window !== 'undefined' && typeof window.puffleEvolutionColour === 'function'
    ? window.puffleEvolutionColour('cp_puffle', stage)
    : null;
}

/* A Club Penguin puffle's colour is rolled when its egg is laid or it is
   caught, never chosen for it. The four friendly coats dominate, green through
   yellow are the middle of the bell, and gold and rainbow are the ones a player
   remembers. Every colour keeps a weight above zero so all twelve stay
   reachable. */
const CP_PUFFLE_COLOUR_WEIGHTS = {
  blue: 26, red: 20, pink: 16, brown: 12,
  green: 8, purple: 6, white: 4, black: 3,
  orange: 2, yellow: 1.5, gold: 1, rainbow: 0.5,
};

/* Weighted roll over CP_PUFFLE_COLOUR_WEIGHTS. Takes an optional random source
   so a test can walk the whole curve instead of gambling on it. */
function cpPuffleColourRoll(rng) {
  const random = typeof rng === 'function' ? rng : Math.random;
  const entries = Object.entries(CP_PUFFLE_COLOUR_WEIGHTS);
  const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0);
  let roll = Math.max(0, Math.min(0.999999, Number(random()) || 0)) * total;
  for (const [colour, weight] of entries) {
    roll -= Number(weight);
    if (roll < 0) return colour;
  }
  return entries[entries.length - 1][0];
}

function cpPuffleRollStyle(rng) {
  return `cp_color_${cpPuffleColourRoll(rng)}`;
}

/* Which classic colourway a Club Penguin puffle wears: the colour its evolved
   form chose, the colour it rolled, or the line colour for a sprite that has
   neither. */
function cpPuffleStyleForSprite(sprite) {
  if (!cpPuffleBreedKey(sprite)) return null;
  const form = sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  if (form && form.puffle) return `cp_color_${form.puffle}`;
  const own = cpPuffleColourOfStyle(sprite.puffleVariant);
  if (own) return `cp_color_${own}`;
  const stageStyle = cpPuffleStageStyle(sprite.stage);
  if (stageStyle) return stageStyle;
  const element = typeof ELEMENTS !== 'undefined' ? ELEMENTS[sprite.element] : null;
  return element && cpPuffleColourOfStyle(element.puffleStyle) ? element.puffleStyle : null;
}

/* The Club Penguin silhouette that belongs to that colourway. */
function cpPuffleShapeForSprite(sprite) {
  const colour = cpPuffleColourOfStyle(cpPuffleStyleForSprite(sprite));
  return colour ? CP_PUFFLE_BODY_SHAPES[colour] || null : null;
}

/* The canon Club Penguin kit that arrives with a colour: the ability the colour
   is known for, the discipline it practises, its temperament, its snack and the
   habitat it was observed in. The colour follows this family's evolution line,
   so a puffle's profile grows with the form it has reached, exactly as its coat
   and silhouette do. */
function cpPuffleProfileForSprite(sprite) {
  const colour = cpPuffleColourOfStyle(cpPuffleStyleForSprite(sprite));
  const type = colour ? CP_PUFFLE_TYPES[colour] : null;
  if (!type) return null;
  const shape = CP_PUFFLE_BODY_SHAPES[colour] || 'cp_classic';
  const body = typeof BODY_SHAPES !== 'undefined' ? BODY_SHAPES[shape] : null;
  /* Only what the type cannot answer itself: the colour, the coat's body, and
     the habitat fallback. Everything else is read from `type` by the caller. */
  return {
    colour,
    type,
    bodyName: body ? body.name : 'Classic Puffle',
    bodyIcon: body ? body.icon : '🔵',
    habitat: type.habitat || { label: 'The Puffle Wild', biomes: [] },
  };
}

/* A Club Penguin puffle keeps the colour it rolled: the stage line follows that
   coat instead of repainting it every stage. Called when a stage changes and
   when a save loads, this only fills in a colour for an old save that never
   rolled one, and adopts the colour of an evolved form. */
function syncCpPuffleEvolutionColour(sprite) {
  if (!sprite || String(sprite.breed || '') !== 'cp_puffle') return null;
  const form = sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  if (form && form.puffle) {
    sprite.puffleVariant = `cp_color_${form.puffle}`;
    return sprite.puffleVariant;
  }
  /* A creature wears a colourway of its own species; only an old save that has
     none gets one filled in, so a rolled coat is never repainted. */
  if (form && form.creature) {
    if (cpCreatureColourwayFor(sprite)) return null;
    const rolled = cpCreatureColourwayRoll(form.creature);
    if (!rolled) return null;
    sprite.puffleVariant = rolled;
    return rolled;
  }
  if (cpPuffleColourOfStyle(sprite.puffleVariant)) return null;
  const stageStyle = cpPuffleStageStyle(sprite.stage);
  if (!stageStyle) return null;
  sprite.puffleVariant = stageStyle;
  return stageStyle;
}

const CP_PUFFLE_FORMS = Object.fromEntries(Object.entries(CP_PUFFLE_TYPES).map(([key, type]) => [`cp_${key}`, {
  id: `cp_${key}`, label: type.label, icon: type.icon, diet: type.diet, size: type.size,
  puffle: key, desc: type.desc, power: type.power,
}]));

/* Club Penguin's later Puffle Creatures, gathered from every corner of the
   island's world: the pet shop's cats and dogs, the Puffle Wild (deer, raccoon,
   rabbit, unicorn), Prehistoric Party dinosaurs, Operation: Crustacean's alien
   visitors and the Holiday Party's snowman. They are a separate evolution set
   from the twelve classic colours, and every diet path carries at least two. */
const CP_PUFFLE_CREATURES = {
  cat: {
    label: 'Cat Puffle', icon: '🐱', diet: 'sweet', size: 'standard', favorite: 'fillet',
    primary: '#E7ECF3', light: '#FFFFFF', deep: '#7D8797', belly: '#FFFFFF', accent: '#F3A9C2',
    desc: 'A curious white cat puffle with soft whiskers and a talent for finding sunny spots.',
    power: { name: 'Nine Lives', icon: '🐱', desc: '+3 game coins, joy fades slower, and gifts arrive sooner.', effect: { gameCoins: 3, joyDecay: 0.9, giftSpeed: 1.12 } },
  },
  dog: {
    label: 'Dog Puffle', icon: '🐶', diet: 'hearty', size: 'standard', favorite: 'meatpie',
    primary: '#B97B47', light: '#E9B67F', deep: '#6B3E20', belly: '#F7E4CD', accent: '#F2C14E',
    desc: 'A loyal brown dog puffle who greets every morning like a reunion.',
    power: { name: 'Loyal Heart', icon: '💛', desc: '+15% XP, pets build +35% more bond, and gifts arrive sooner.', effect: { xp: 1.15, petBond: 1.35, giftSpeed: 1.1 } },
  },
  dragon: {
    label: 'Dragon Puffle', icon: '🐉', diet: 'wild', size: 'large', favorite: 'turkey',
    primary: '#5B9CE8', light: '#A9D2FF', deep: '#2B5C99', belly: '#DDF0FF', accent: '#F2C14E',
    desc: 'A small dragon puffle from the Medieval Party, all folded wings and a proud little snout.',
    power: { name: 'Sky Soar', icon: '🐉', desc: '+25% XP, +3 task coins, and joy fades slower.', effect: { xp: 1.25, taskCoins: 3, joyDecay: 0.92 } },
  },
  crystal: {
    label: 'Crystal Puffle', icon: '💎', diet: 'eerie', size: 'standard', favorite: 'starfruit',
    primary: '#BFE3FF', light: '#F0FAFF', deep: '#6C93B5', belly: '#FFFFFF', accent: '#8FE3FF',
    desc: 'A puffle grown from cave crystal, cool to the touch and full of quiet light.',
    power: { name: 'Prism Focus', icon: '💎', desc: '+4 check-in coins, chats pay +2, and all needs fade slower.', effect: { checkinCoins: 4, chatCoins: 2, decay: 0.9 } },
  },
  ghost: {
    label: 'Ghost Puffle', icon: '👻', diet: 'eerie', size: 'standard', favorite: 'moonpie',
    primary: '#D9DBFF', light: '#F7F5FF', deep: '#7C7FC4', belly: '#FFFFFF', accent: '#B8F5FF',
    desc: 'A gentle translucent puffle that drifts through walls and hums at midnight.',
    power: { name: 'Soft Haunt', icon: '👻', desc: 'Night games pay +4 coins, chats pay +1, and all needs fade slower.', effect: { nightCoins: 4, chatCoins: 1, decay: 0.9 } },
  },
  raccoon: {
    label: 'Raccoon Puffle', icon: '🦝', diet: 'eerie', size: 'standard', favorite: 'dumplings',
    primary: '#8D919C', light: '#CDD1D9', deep: '#4A4E58', belly: '#E9E5DE', accent: '#2E3038',
    desc: 'A clever masked puffle with a striped tail and a pocket full of stolen snacks.',
    power: { name: 'Night Forage', icon: '🦝', desc: 'Night games pay +5 coins, games pay +2, and grime fades slower.', effect: { nightCoins: 5, gameCoins: 2, cleanDecay: 0.9 } },
  },
  deer: {
    label: 'Deer Puffle', icon: '🦌', diet: 'wild', size: 'large', favorite: 'greens',
    primary: '#C99763', light: '#EBC79B', deep: '#79512E', belly: '#F8E8D2', accent: '#8B5E3C',
    desc: 'A gentle forest puffle with branching antlers and a quiet step.',
    power: { name: 'Forest Grace', icon: '🦌', desc: '+15% XP, energy fades slower, and gifts arrive sooner.', effect: { xp: 1.15, energyDecay: 0.86, giftSpeed: 1.15 } },
  },
  rabbit: {
    label: 'Rabbit Puffle', icon: '🐰', diet: 'hearty', size: 'standard', favorite: 'carrot',
    primary: '#F3D6DE', light: '#FFF6F8', deep: '#B98A99', belly: '#FFFFFF', accent: '#F2A7C0',
    desc: 'A springy little puffle with long ears and a lucky hop.',
    power: { name: 'Lucky Hop', icon: '🍀', desc: '+3 game coins, gifts arrive sooner, and joy fades slower.', effect: { gameCoins: 3, giftSpeed: 1.2, joyDecay: 0.9 } },
  },
  unicorn: {
    label: 'Unicorn Puffle', icon: '🦄', diet: 'sweet', size: 'standard', favorite: 'cheesecake',
    primary: '#FFF4FB', light: '#FFFFFF', deep: '#B49AC9', belly: '#FFF0F8', accent: '#FFD166',
    bands: ['#FF6B6B', '#FFC857', '#5BD6A2', '#5B9DFF', '#B785FF'],
    desc: 'A dreamy puffle with a rainbow horn and a mane full of wishes.',
    power: { name: 'Wishlight', icon: '🦄', desc: '+20% XP, +3 game coins, and gifts arrive sooner.', effect: { xp: 1.2, gameCoins: 3, giftSpeed: 1.15 } },
  },
  alien: {
    label: 'Alien Puffle', icon: '👽', diet: 'eerie', size: 'standard', favorite: 'boba',
    primary: '#7ED957', light: '#C9FFB4', deep: '#2F7A2A', belly: '#E9FFDE', accent: '#B8F5FF',
    desc: 'A tiny green visitor from Operation: Crustacean, antennae twitching at weather no Hollow puffle can feel.',
    power: { name: 'Crop Circle', icon: '🛸', desc: '+3 game coins, night games pay +3, and gifts arrive 12% sooner.', effect: { gameCoins: 3, nightCoins: 3, giftSpeed: 1.12 } },
  },
  snowman: {
    label: 'Snowman Puffle', icon: '⛄', diet: 'sweet', size: 'standard', favorite: 'sundae',
    primary: '#F2F7FF', light: '#FFFFFF', deep: '#8FB3D9', belly: '#FFFFFF', accent: '#FF8A3D',
    desc: 'A puff of packed snow with a carrot nose, coal buttons and a scarf that never comes off.',
    power: { name: 'Snow Day', icon: '❄️', desc: 'Snacks give +25% XP, grime fades 12% slower, and gifts arrive 10% sooner.', effect: { snackXp: 1.25, cleanDecay: 0.88, giftSpeed: 1.1 } },
  },
  trex: {
    label: 'T-Rex Puffle', icon: '🦖', diet: 'wild', size: 'large', favorite: 'drumstick',
    primary: '#3F3F4C', light: '#8E8FA3', deep: '#1B1B22', belly: '#C9CAD6', accent: '#F4D64B',
    desc: 'A prehistoric tyrant the size of a football, with a roar that empties the snack drawer.',
    power: { name: 'Tiny Tyrant', icon: '🦖', desc: 'Day games pay +4 coins, games pay +3, and hunger fades slower.', effect: { dayCoins: 4, gameCoins: 3, hungerDecay: 0.92 } },
  },
  triceratops: {
    label: 'Triceratops Puffle', icon: '🦕', diet: 'wild', size: 'large', favorite: 'pumpkinmash',
    primary: '#5AA9E6', light: '#B6DBFF', deep: '#255C8C', belly: '#E6F4FF', accent: '#F2C14E',
    desc: 'A three-horned grazer with a bony frill, happiest when it is digging up something ancient.',
    power: { name: 'Three Horns', icon: '🦕', desc: 'Tasks pay +2 coins, pets build +30% more bond, and energy fades slower.', effect: { taskCoins: 2, petBond: 1.3, energyDecay: 0.9 } },
  },
  stegosaurus: {
    label: 'Stegosaurus Puffle', icon: '🦎', diet: 'wild', size: 'large', favorite: 'broccoli',
    primary: '#F27FA5', light: '#FFC2D6', deep: '#A63F63', belly: '#FFE7EF', accent: '#7ED0A0',
    desc: 'A plated puffle with a spiked tail, sunning itself on warm stones for hours.',
    power: { name: 'Sun Plates', icon: '🌞', desc: 'Check-ins pay +2 coins, +14% XP, and joy fades slower.', effect: { checkinCoins: 2, xp: 1.14, joyDecay: 0.9 } },
  },
  collie: {
    label: 'Border Collie Puffle', icon: '🐕', diet: 'hearty', size: 'standard', favorite: 'stew',
    primary: '#6E7F95', light: '#DCE6F2', deep: '#33404F', belly: '#FFFFFF', accent: '#F2C14E',
    desc: 'A herding puffle from the pet shop, always first to the door and last to sit down.',
    power: { name: 'Round Up', icon: '🐕', desc: 'Pets pay +2 coins, chats pay +1, and every need fades slower.', effect: { petCoins: 2, chatCoins: 1, decay: 0.94 } },
  },
};

const CP_PUFFLE_CREATURE_FORMS = Object.fromEntries(Object.entries(CP_PUFFLE_CREATURES).map(([key, type]) => [`pc_${key}`, {
  id: `pc_${key}`, label: type.label, icon: type.icon, diet: type.diet, size: type.size,
  creature: key, favorite: type.favorite, desc: type.desc, power: type.power,
}]));

/* The retired generic 'pc_dinosaur' form is replaced by the three named
   species. A save that still carries it lands on the T-Rex, the closest match,
   instead of silently losing the form. */
const LEGACY_EVOLUTION_FORMS = { pc_dinosaur: 'pc_trex' };

/* Every canon puffle-creature coat. A bare colour name is a classic Club
   Penguin colour the species wears; the pet shop's pedigree coats add their own
   key, name and fur. A species' base look stays the hand-tuned palette on its
   CP_PUFFLE_CREATURES entry, so nothing here repeats it. */
/* The Prehistoric Party shipped its dinosaurs in six skins, so every dinosaur
   species wears the same six rather than one signature colour. */
const CP_DINO_SKINS = ['green', 'blue', 'red', 'yellow', 'purple', 'orange'];

const CP_CREATURE_COLOURWAYS = {
  /* The pet shop's cat came in pedigree breeds, not only colours. */
  cat: ['black', { key: 'orange_tabby', color: 'orange', label: 'Orange Tabby Cat Puffle' },
    { key: 'munchkin', color: 'brown', label: 'Munchkin Cat Puffle' },
    { key: 'russian_blue', color: 'blue', label: 'Russian Blue Cat Puffle' },
    { key: 'siamese', label: 'Siamese Cat Puffle', palette: { primary: '#F0DFC0', light: '#FFF6E6', deep: '#6B4A2E', belly: '#FFFBF2', accent: '#4C3A2A' } },
    { key: 'calico', label: 'Calico Cat Puffle', palette: { primary: '#FFFDF8', light: '#FFFFFF', deep: '#3A2A22', belly: '#FFFFFF', accent: '#F58A3C' } }],
  dog: ['black', { key: 'golden', color: 'yellow', label: 'Golden Retriever Puffle' },
    { key: 'husky', color: 'white', label: 'Husky Puffle' }],
  ghost: ['white', 'purple', 'green'],
  raccoon: ['green', 'orange', 'pink', 'blue', 'white', 'purple'],
  deer: ['blue', 'black', 'red', 'purple', 'white', 'green'],
  rabbit: ['green', 'white', 'red', 'blue', 'black', 'orange'],
  unicorn: ['black', 'white', 'pink'],
  alien: ['purple', 'blue', 'orange', 'yellow'],
  snowman: ['blue', 'red', 'green'],
  collie: ['black', 'white', 'brown'],
  trex: CP_DINO_SKINS,
  triceratops: CP_DINO_SKINS,
  stegosaurus: CP_DINO_SKINS,
  dragon: ['blue', 'green', 'red'],
  crystal: ['blue', 'purple', 'pink'],
};

/* One row shape for everything downstream: a bare colour string becomes a coat
   whose key is its own colour name. */
function cpCreatureCoats(creature) {
  return (CP_CREATURE_COLOURWAYS[creature] || []).map((coat) => (typeof coat === 'string' ? { key: coat, color: coat } : coat));
}

/* The five colours a coat paints with, or null when its colour is unknown. */
function cpCreatureCoatPalette(coat) {
  if (!coat) return null;
  if (coat.palette) return coat.palette;
  const classic = CP_PUFFLE_TYPES[coat.color];
  return classic
    ? { primary: classic.primary, light: classic.light, deep: classic.deep, belly: classic.belly, accent: classic.accent }
    : null;
}

/* The coat a creature wears, read off the style key it saved. null means the
   species' own palette. */
function cpCreatureColourwayFor(sprite) {
  const form = sprite && sprite.form && typeof EVOLUTION_FORMS !== 'undefined' ? EVOLUTION_FORMS[sprite.form] : null;
  if (!form || !form.creature) return null;
  const style = String(sprite.puffleVariant || '');
  const prefix = `pc_${form.creature}_`;
  if (!style.startsWith(prefix)) return null;
  return cpCreatureCoats(form.creature).find((coat) => coat.key === style.slice(prefix.length)) || null;
}

/* The five colours the creature art paints with, or null for the species coat. */
function cpCreatureArtPalette(sprite) {
  return cpCreatureCoatPalette(cpCreatureColourwayFor(sprite));
}

/* A style key a creature may wear: its own pc_<species> coat or one of the
   species' canon coats. Anything else returns null. */
function cpCreatureStyleKey(form, key) {
  const creature = form && typeof EVOLUTION_FORMS !== 'undefined' && EVOLUTION_FORMS[form] ? EVOLUTION_FORMS[form].creature : null;
  const style = String(key || '');
  if (!creature || !style.startsWith(`pc_${creature}`)) return null;
  if (style === `pc_${creature}`) return style;
  return cpCreatureCoats(creature).some((coat) => `pc_${creature}_${coat.key}` === style) ? style : null;
}

/* A colourway style key in the shape the Sprite Puffle renderer reads from
   LUMI_PUFFLE_VARIANTS. */
function cpCreatureStyleLook(name, pal) {
  return {
    classic: true, creatureStyle: true, name,
    primary: pal.primary, secondary: pal.light, belly: pal.belly, ear: pal.light,
    iris: pal.deep, eyeShadow: pal.deep, leaf: pal.accent, leafGlow: pal.accent, pads: pal.light,
    /* Fur deco reads `accent`, and a species' gold or pink accent blended into
       its own light colour turns muddy (a khaki dragon). The style accent is a
       coat tint instead; the species accent still paints horns, prisms and
       sparkles, which the creature markup draws from the palette itself. */
    accent: typeof mix === 'function' ? mix(pal.light, pal.primary, 0.42) : pal.light,
  };
}

function cpCreatureStylePalette(key) {
  const match = /^pc_([a-z]+)(?:_(.+))?$/.exec(String(key || ''));
  const creature = match && typeof CP_PUFFLE_CREATURES !== 'undefined' ? CP_PUFFLE_CREATURES[match[1]] : null;
  if (!creature) return null;
  /* pc_<species> is the species' own hand-tuned coat. */
  if (!match[2]) return cpCreatureStyleLook(creature.label, creature);
  const coat = cpCreatureCoats(match[1]).find((entry) => entry.key === match[2]);
  const pal = cpCreatureCoatPalette(coat);
  if (!pal) return null;
  /* A pedigree coat keeps its own breed name ("Golden Retriever Puffle"); a
     plain colour coat is "<Colour> <Species> Puffle". The suffix is stripped
     from both labels and added once, so a colourway cannot lose its "Puffle"
     to a species label that leaves it out. */
  const classic = CP_PUFFLE_TYPES[coat.color];
  const colour = classic ? classic.label.replace(/ Puffle$/, '') : '';
  const speciesName = creature.label.replace(/ Puffle$/, '');
  const name = coat.label || `${colour} ${speciesName} Puffle`.replace(/\s+/g, ' ').trim();
  return cpCreatureStyleLook(name, pal);
}

/* A creature meets its coat when it evolves: one of the species' canon
   colourways, the species' own coat included. */
function cpCreatureColourwayRoll(creature, rng) {
  const list = cpCreatureCoats(creature);
  if (!list.length) return '';
  const roll = typeof rng === 'function' ? rng() : Math.random();
  const index = Math.max(0, Math.min(list.length - 1, Math.floor(roll * list.length)));
  return `pc_${creature}_${list[index].key}`;
}

const CP_PUFFLE_TYPE_COUNT = Object.keys(CP_PUFFLE_TYPES).length;
const CP_PUFFLE_CREATURE_COUNT = Object.keys(CP_PUFFLE_CREATURES).length;

/* Every classic Club Penguin penguin colour, rebuilt as a puffle breed of its
   own. Each row carries the Club Penguin skill that colour is known for, the
   rarity it hatches at, and its own habitats. The breed records are registered
   below; data-puffles.js turns the same rows into playable type eggs. */
const CP_PENGUIN_PUFFLES = [
  {
    color: 'blue', label: 'Blue', breedName: 'Blue Penguin Puffle', icon: '🔵',
    rarity: 'common', price: 70, habitats: ['grove', 'tide'], likes: 'Moon Berry',
    perk: 'Bond grows 20% faster', mods: { bondMod: 1.2 },
    skill: { name: 'Puffle Care', icon: '🫧', desc: 'Pets build +35% more bond and gifts arrive 12% sooner.', effect: { petBond: 1.35, giftSpeed: 1.12 } },
    habit: { name: 'Soft Landing', icon: '🪶', desc: 'Pets build +20% more bond.', effect: { petBond: 1.2 } },
    favorite: 'pop', traitsLikes: 'puffle snacks, snowy days', dislikes: 'empty snack pouches',
    trait: 'Puffle Whisperer — knows exactly which treat cheers a puffle up.',
    blurb: 'A sky-blue penguin-shaped puffle in a propeller cap, carrying a pouch of snacks for every friend.',
    greeting: 'I packed snacks for the whole igloo. And one for you.',
    behavior: 'Patrols the Hollow with a snack pouch and checks on every puffle.',
    titan: 'Blue Crew Captain',
  },
  {
    color: 'green', label: 'Green', breedName: 'Green Penguin Puffle', icon: '🟢',
    rarity: 'common', price: 72, habitats: ['grove', 'sugar'], likes: 'Cloud Feast',
    perk: 'Hunger fades 15% slower', mods: { hungerMod: 0.85 },
    skill: { name: 'Pizza Chef', icon: '🍕', desc: 'Hunger fades 12% slower and games pay +2 coins.', effect: { hungerDecay: 0.88, gameCoins: 2 } },
    habit: { name: 'Snack Prep', icon: '🧀', desc: 'Hunger fades 10% slower.', effect: { hungerDecay: 0.9 } },
    favorite: 'feast', traitsLikes: 'warm ovens, shared slices', dislikes: 'burnt crusts',
    trait: 'Pizza Chef — can feed a whole igloo with one oven and a lot of confidence.',
    blurb: 'A spring-green penguin puffle with flour on its flippers and a pizza box balanced on its head.',
    greeting: 'One large everything. That is for us. I already started.',
    behavior: 'Runs the Hollow’s tiny pizza oven and never lets a plate go empty.',
    titan: 'Pizzeria Prime',
  },
  {
    color: 'pink', label: 'Pink', breedName: 'Pink Penguin Puffle', icon: '🩷',
    rarity: 'uncommon', price: 82, habitats: ['sugar', 'aurora'], likes: 'Star Pop',
    perk: 'Joy fades 15% slower', mods: { joyMod: 0.85 },
    skill: { name: 'Dance Floor', icon: '💃', desc: 'Joy fades 15% slower and chats pay +2 coins.', effect: { joyDecay: 0.85, chatCoins: 2 } },
    habit: { name: 'Encore', icon: '🎵', desc: 'Joy fades 15% slower.', effect: { joyDecay: 0.85 } },
    favorite: 'pop', traitsLikes: 'dance floors, bright bows', dislikes: 'sitting still',
    trait: 'Dance Floor — turns any room into a party the moment the music starts.',
    blurb: 'A bright pink penguin puffle with a bouncy bow and a dance move for every occasion.',
    greeting: 'The beat dropped. You are already dancing. Perfect.',
    behavior: 'Practises new routines on the dock and teaches them to anyone nearby.',
    titan: 'Dancefloor Diva',
  },
  {
    color: 'black', label: 'Black', breedName: 'Black Penguin Puffle', icon: '⚫',
    rarity: 'uncommon', price: 90, habitats: ['night', 'aurora'], likes: 'Warm Soup',
    perk: 'Earns 10% more XP', mods: { xpMod: 1.1 },
    skill: { name: 'Card-Jitsu', icon: '🥋', desc: 'Games pay +4 coins, night games pay +2, and XP gains +8%.', effect: { gameCoins: 4, nightCoins: 2, xp: 1.08 } },
    habit: { name: 'Dojo Focus', icon: '🎴', desc: 'Earns 8% more XP.', effect: { xp: 1.08 } },
    favorite: 'feast', traitsLikes: 'quiet dojos, fire cards', dislikes: 'loud boasts',
    trait: 'Card-Jitsu — calm hands, sharp instincts, and a deck full of fire.',
    blurb: 'A smoky black penguin puffle with a flame-coloured crest and the patience of a dojo master.',
    greeting: 'Draw. I already know which card you are hoping for.',
    behavior: 'Practises card moves in the quiet corner and bows after every match.',
    titan: 'Dojo Shadow Master',
  },
  {
    color: 'red', label: 'Red', breedName: 'Red Penguin Puffle', icon: '🔴',
    rarity: 'rare', price: 105, habitats: ['tide', 'savanna'], likes: 'Juicy Drumstick',
    perk: 'Energy fades 15% slower', mods: { energyMod: 0.85 },
    skill: { name: 'Surf Rider', icon: '🏄', desc: 'Games pay +3 coins and energy fades 15% slower.', effect: { gameCoins: 3, energyDecay: 0.85 } },
    habit: { name: 'Wave Dash', icon: '🌊', desc: 'Energy fades 15% slower.', effect: { energyDecay: 0.85 } },
    favorite: 'drumstick', traitsLikes: 'big waves, pirate hats', dislikes: 'flat water',
    trait: 'Surf Rider — reads a wave the way other puffles read a snack label.',
    blurb: 'A fearless red penguin puffle in a pirate hat, always carrying a surfboard twice its size.',
    greeting: 'The tide is perfect. Grab a board. Or just watch me.',
    behavior: 'Rides the shoreline at dawn and drags its board back for one more run.',
    titan: 'Crimson Wave Captain',
  },
  {
    color: 'orange', label: 'Orange', breedName: 'Orange Penguin Puffle', icon: '🟠',
    rarity: 'rare', price: 112, habitats: ['aurora', 'ember'], likes: 'Cloud Feast',
    perk: 'Bond grows 15% faster', mods: { bondMod: 1.15 },
    skill: { name: 'Snowball Showdown', icon: '❄️', desc: 'Day games pay +3 coins and all games pay +3.', effect: { dayCoins: 3, gameCoins: 3 } },
    habit: { name: 'Snow Fort', icon: '🏰', desc: 'Games pay +2 coins.', effect: { gameCoins: 2 } },
    favorite: 'feast', traitsLikes: 'snow forts, friendly ambushes', dislikes: 'wet mittens',
    trait: 'Snowball Showdown — builds a fort first, then starts the friendliest war in the Hollow.',
    blurb: 'A goofy orange penguin puffle with a snowball in each flipper and excellent fort-building opinions.',
    greeting: 'I built a fort. You are allowed in. Bring snowballs.',
    behavior: 'Recruits everyone for snowball games, then shares cocoa after.',
    titan: 'Snowfort General',
  },
  {
    color: 'purple', label: 'Purple', breedName: 'Purple Penguin Puffle', icon: '🟣',
    rarity: 'epic', price: 125, habitats: ['night', 'crystal'], likes: 'Honey Tea',
    perk: 'Earns 12% more XP', mods: { xpMod: 1.12 },
    skill: { name: 'EPF Agent', icon: '🕶️', desc: 'Night games pay +4 coins and gifts arrive 15% sooner.', effect: { nightCoins: 4, giftSpeed: 1.15 } },
    habit: { name: 'Night Watch', icon: '🔭', desc: 'Night games pay +2 coins.', effect: { nightCoins: 2 } },
    favorite: 'tea', traitsLikes: 'secret passages, tiny gadgets', dislikes: 'blown covers',
    trait: 'EPF Agent — notices everything, reports half of it, and always has a gadget.',
    blurb: 'A violet penguin puffle in sunglasses with a spyphone, a secret base, and a very serious salute.',
    greeting: 'This conversation is classified. The snack is not. Share it.',
    behavior: 'Sweeps the Hollow for clues and files extremely thorough snack reports.',
    titan: 'Elite Puffle Director',
  },
  {
    color: 'brown', label: 'Brown', breedName: 'Brown Penguin Puffle', icon: '🟤',
    rarity: 'epic', price: 145, habitats: ['crystal', 'ember'], likes: 'Warm Soup',
    perk: 'Earns 15% more XP', mods: { xpMod: 1.15 },
    skill: { name: 'Inventor’s Workshop', icon: '🔧', desc: 'XP gains +18% and gifts arrive 15% sooner.', effect: { xp: 1.18, giftSpeed: 1.15 } },
    habit: { name: 'Prototype', icon: '⚙️', desc: 'Gifts arrive 10% sooner.', effect: { giftSpeed: 1.1 } },
    favorite: 'soup', traitsLikes: 'blueprints, spare gears', dislikes: 'missing screws',
    trait: 'Inventor’s Workshop — builds a machine for every problem, including problems that did not exist.',
    blurb: 'A goggle-wearing brown penguin puffle with graph-paper wings and a rocket that is almost finished.',
    greeting: 'Stand back. This is either a breakthrough or a very shiny mistake.',
    behavior: 'Tinkers beside the workshop bench and labels every invention twice.',
    titan: 'Workshop Grandmaster',
  },
  {
    color: 'white', label: 'White', breedName: 'White Penguin Puffle', icon: '⚪',
    rarity: 'legendary', price: 175, habitats: ['aurora', 'crystal'], likes: 'Warm Soup',
    perk: 'Stays clean 20% longer', mods: { cleanMod: 0.8 },
    skill: { name: 'Arctic Expedition', icon: '🧭', desc: 'All needs fade 10% slower and XP gains +10%.', effect: { decay: 0.9, xp: 1.1 } },
    habit: { name: 'Snow Trail', icon: '👣', desc: 'Stays clean 20% longer.', effect: { cleanDecay: 0.8 } },
    favorite: 'soup', traitsLikes: 'fresh snow, quiet horizons', dislikes: 'muddy trails',
    trait: 'Arctic Explorer — follows a compass, a hunch, and the prettiest snowdrift.',
    blurb: 'A snowy white penguin puffle with an explorer’s scarf and frostprints that never quite melt.',
    greeting: 'The trail is fresh. I brought a map and three kinds of soup.',
    behavior: 'Maps new paths through the snow and leaves markers for the way home.',
    titan: 'Northstar Expedition',
  },
  {
    color: 'yellow', label: 'Yellow', breedName: 'Yellow Penguin Puffle', icon: '🟡',
    rarity: 'mythic', price: 230, habitats: ['crystal', 'savanna'], likes: 'Juicy Drumstick',
    perk: 'Earns 20% more XP', mods: { xpMod: 1.2 },
    skill: { name: 'Golden Mining', icon: '⛏️', desc: 'Games pay +5 coins and night games pay +3.', effect: { gameCoins: 5, nightCoins: 3 } },
    habit: { name: 'Deep Vein', icon: '💛', desc: 'Day games pay +2 coins.', effect: { dayCoins: 2 } },
    favorite: 'stew', traitsLikes: 'sparkling seams, sturdy picks', dislikes: 'empty minecarts',
    trait: 'Golden Mining — hears a treasure seam through solid rock and follows it home.',
    blurb: 'A golden-yellow penguin puffle in a miner’s helmet with a headlamp that finds every last gem.',
    greeting: 'I found something shiny. It is ours now. Grab a pick.',
    behavior: 'Mines the crystal caves and shares every find with the Hollow.',
    titan: 'Golden Seam Sovereign',
  },
];

const CP_PENGUIN_PUFFLE_KEYS = CP_PENGUIN_PUFFLES.map((row) => `cp_penguin_${row.color}`);

(function registerCpPenguinBreeds() {
  CP_PENGUIN_PUFFLES.forEach((row) => {
    const key = `cp_penguin_${row.color}`;
    if (!BREEDS[key]) {
      BREEDS[key] = {
        name: row.breedName,
        kicker: `${row.rarity.charAt(0).toUpperCase()}${row.rarity.slice(1)} penguin breed`,
        icon: row.icon,
        perk: row.perk,
        ...row.mods,
        desc: row.blurb,
        rarity: row.rarity,
        bodyShape: CP_PUFFLE_BODY_SHAPES[row.color] || 'cp_classic',
        bodyColors: CP_PUFFLE_TYPES,
        skill: row.skill.name,
      };
    }
    if (!BREED_KEYS.includes(key)) BREED_KEYS.push(key);
    if (!BREED_TRAITS[key]) {
      BREED_TRAITS[key] = {
        favorite: row.favorite,
        likes: row.traitsLikes,
        dislikes: row.dislikes,
        behavior: row.behavior,
      };
    }
    if (!HABITS[key]) HABITS[key] = row.habit;
  });
})();

const EVOLUTION_FORMS = {
  dragon: {
    id: 'dragon', label: 'Dragon', icon: '🐉', diet: 'hearty', size: 'large',
    desc: 'Horned, winged, and enormous. A hearth with a heartbeat.',
    power: { name: 'Dragonheart', icon: '🔥', desc: '+25% XP, +3 game coins, and hunger fades slower.', effect: { xp: 1.25, gameCoins: 3, hungerDecay: 0.85 } },
  },
  fairy: {
    id: 'fairy', label: 'Fairy', icon: '🧚', diet: 'sweet', size: 'standard',
    desc: 'Glass wings, a pollen halo, and a talent for making friends.',
    power: { name: 'Fae Charm', icon: '✨', desc: 'Pets and chats build extra bond and gifts arrive sooner.', effect: { petBond: 1.5, chatCoins: 1, giftSpeed: 1.25 } },
  },
  ghoul: {
    id: 'ghoul', label: 'Ghoul', icon: '👻', diet: 'eerie', size: 'standard',
    desc: 'A soft little haunt. Glows at the seams after dark.',
    power: { name: 'Grave Song', icon: '🌙', desc: 'Night games pay +4 coins and all needs fade slower.', effect: { nightCoins: 4, decay: 0.9 } },
  },
  titan: {
    id: 'titan', label: 'Titan', icon: '⚡', diet: 'wild', size: 'large',
    desc: 'An adult elemental, crackling with the raw stuff of its gene.',
    power: { name: 'Awakened Core', icon: '💥', desc: '+20% XP, +4 game coins, and +1 coin per pet.', effect: { xp: 1.2, gameCoins: 4, petCoins: 1 } },
  },
  leviathan: {
    id: 'leviathan', label: 'Leviathan', icon: '🐋', diet: 'hearty', size: 'large',
    desc: 'Deep-current armour, a sweeping tail, and a song that settles storms.',
    power: { name: 'Deepwell', icon: '🌊', desc: '+20% XP, +3 game coins, and energy fades slower.', effect: { xp: 1.2, gameCoins: 3, energyDecay: 0.85 } },
  },
  seraph: {
    id: 'seraph', label: 'Seraph', icon: '😇', diet: 'sweet', size: 'standard',
    desc: 'Six soft wings, a warm halo, and a voice that makes the Hollow glow.',
    power: { name: 'Halo Song', icon: '🌟', desc: 'Pets and chats build extra bond, and gifts arrive sooner.', effect: { petBond: 1.45, chatCoins: 1, giftSpeed: 1.2 } },
  },
  wraith: {
    id: 'wraith', label: 'Wraith', icon: '🌫️', diet: 'eerie', size: 'standard',
    desc: 'A ribbon of night with bright eyes and a whisper for a tail.',
    power: { name: 'Nightveil', icon: '🌑', desc: 'Night games pay +5 coins and joy fades slower.', effect: { nightCoins: 5, joyDecay: 0.85 } },
  },
  golem: {
    id: 'golem', label: 'Golem', icon: '🗿', diet: 'wild', size: 'large',
    desc: 'Living stone laced with wild growth, steady as a hill.',
    power: { name: 'Runebound', icon: '🪨', desc: '+15% XP, +3 game coins, and all needs fade slower.', effect: { xp: 1.15, gameCoins: 3, decay: 0.9 } },
  },

  /* World Kitchen forms. Each one is tied to a regional cuisine instead of a
     diet path, so the food a puffle eats from around the world changes the
     creature it becomes. */
  savanna: {
    id: 'savanna', label: 'Sunmane', icon: '🦁', cuisine: 'africa', size: 'large', favorite: 'moambe',
    desc: 'A broad savanna guardian with a sunburst mane and a feast-day appetite.',
    power: { name: 'Sunmane Roar', icon: '🌅', desc: '+18% XP, +3 game coins, and joy fades slower.', effect: { xp: 1.18, gameCoins: 3, joyDecay: 0.9 } },
  },
  koi: {
    id: 'koi', label: 'Moon Koi', icon: '🐟', cuisine: 'asia', size: 'standard', favorite: 'rendang',
    desc: 'A ribbon-tailed river spirit that carries tea-house luck in its fins.',
    power: { name: 'Tide Dance', icon: '🌊', desc: '+20% XP, energy fades slower, and gifts arrive sooner.', effect: { xp: 1.2, energyDecay: 0.85, giftSpeed: 1.12 } },
  },
  dune: {
    id: 'dune', label: 'Dune Fox', icon: '🦊', cuisine: 'middleeast', size: 'standard', favorite: 'maqluba',
    desc: 'A wide-eared desert forager wrapped in a scarf of spice-market colours.',
    power: { name: 'Caravan Call', icon: '🐪', desc: '+4 game coins, gifts arrive sooner, and grime fades slower.', effect: { gameCoins: 4, giftSpeed: 1.18, cleanDecay: 0.9 } },
  },
  stag: {
    id: 'stag', label: 'Alpine Stag', icon: '🦌', cuisine: 'europe', size: 'large', favorite: 'fondue',
    desc: 'A sure-footed mountain wanderer with a crown of branching antlers.',
    power: { name: 'Alpine Grace', icon: '🏔️', desc: '+18% XP, pets build more bond, and energy fades slower.', effect: { xp: 1.18, petBond: 1.15, energyDecay: 0.88 } },
  },
  jaguar: {
    id: 'jaguar', label: 'Jungle Jaguar', icon: '🐆', cuisine: 'latin', size: 'large', favorite: 'moqueca',
    desc: 'A spotted night hunter with a long tail and a taste for fiesta food.',
    power: { name: 'Jungle Pounce', icon: '🌙', desc: '+20% XP, +3 game coins, and night games pay +3 more.', effect: { xp: 1.2, gameCoins: 3, nightCoins: 3 } },
  },
  bison: {
    id: 'bison', label: 'Prairie Bison', icon: '🦬', cuisine: 'northamerica', size: 'large', favorite: 'lobsterroll',
    desc: 'A shaggy prairie friend with a broad hump and a patient herd heart.',
    power: { name: 'Prairie Heart', icon: '🌾', desc: '+15% XP, hunger fades slower, and pets build more bond.', effect: { xp: 1.15, hungerDecay: 0.85, petBond: 1.18 } },
  },
  parrot: {
    id: 'parrot', label: 'Coral Parrot', icon: '🦜', cuisine: 'caribbean', size: 'standard', favorite: 'currygoat',
    desc: 'A bright island chatterbox with a crest of coral and a gift for gossip.',
    power: { name: 'Carnival Call', icon: '🎉', desc: '+3 game coins, chats pay +2, and gifts arrive sooner.', effect: { gameCoins: 3, chatCoins: 2, giftSpeed: 1.15 } },
  },
  manta: {
    id: 'manta', label: 'Reef Manta', icon: '🐋', cuisine: 'oceania', size: 'large', favorite: 'lovo',
    desc: 'A wide-winged reef drifter that glides through island picnics like a tide.',
    power: { name: 'Reef Drift', icon: '🌊', desc: '+18% XP, energy fades slower, and clean fades slower.', effect: { xp: 1.18, energyDecay: 0.85, cleanDecay: 0.9 } },
  },

  /* The twelve Club Penguin puffle forms share the four diet paths. */
  ...CP_PUFFLE_FORMS,

  /* The later Puffle Creatures form a second, separate set. */
  ...CP_PUFFLE_CREATURE_FORMS,
};
const EVOLUTION_FORM_KEYS = Object.keys(EVOLUTION_FORMS);

function cuisineEvolutionForms(region) {
  return Object.values(EVOLUTION_FORMS).filter((form) => form.cuisine === region);
}

const TITAN_NAMES = {
  ember: 'Inferno Titan',
  tide: 'Leviathan',
  gale: 'Sky Serpent',
  bloom: 'Worldroot Titan',
  volt: 'Storm Titan',
  frost: 'Glacier Titan',
  dusk: 'Nightmare Titan',
  radiant: 'Seraph Titan',
  demon: 'Archdemon',
  angel: 'Empyrean',
  air: 'Skycolossus',
  water: 'Tsunami Titan',
  earth: 'Continental',
  honey: 'Hive Empress',
  pond: 'Lotus Leviathan',
  hero: 'Apex Guardian',
  ants: 'Hive Mind',
  fire: 'Pyre Colossus',
  splash: 'Rainbow Titan',
  slime: 'Ooze Sovereign',
  rock: 'Monolith',
  stone: 'Runestone Titan',
  bug: 'Swarm Titan',
  bunny: 'Moonhare',
  cloud: 'Stormhead',
  crystal: 'Geode Titan',
  mushroom: 'Mycelium Titan',
  candy: 'Sugar Titan',
  wolf: 'Fenrir',
  tiger: 'Sabertooth',
  bear: 'Ursa Major',
  frog: 'Pond Sovereign',
  pig: 'Boar King',
  cat: 'Nekomata',
  cow: 'Aurochs',
  fish: 'Abyssai',
  bat: 'Nightwing',
  butterfly: 'Morpho',
  pillow: 'Cloud Bed',
  dreameater: 'Morpheus',
  lucky: 'Fortune Titan',
  banana: 'Peel Colossus',
  apple: 'Orchard Titan',
  ice: 'Absolute Zero',
  cherry: 'Cherry Bomb',
  cocoa: 'Cocoa Sovereign',
  pizza: 'Deep Dish Titan',
  fishy: 'Big Fishy',
  striker: 'Golden Boot',
  aura: 'Aurelia',
  six: 'Sixfold',
  seven: 'Seventh Wonder',
  king: 'High King',
  queen: 'High Queen',
  ghost: 'Wraith',
  skull: 'Ossuary',
  death: 'Thanatos',
  lootllama: 'Piñata Colossus',
  duck: 'Mallard King',
  peely: 'Peel Prime',
  dream: 'Dreamweaver',
  zeropoint: 'The Nothing',
  punk: 'Anarchy',
  batman: 'Bat Titan',
  superman: 'Super Titan',
  ironmouse: 'Iron Matriarch',
  bullet: 'Railgun',
  burntpb: 'Kitchen Disaster',
  headshot: 'Deadeye',
  cube: 'Hypercube',
  bombjr: 'Bombzilla',
  grim: 'The Last Harvest',
  squibbly: 'Elder Squib',
  onewish: 'Wishroot',
  klombo: 'Klombo Rex',
  crown: 'Crown Colossus',
  spookydash: 'Dash Phantom',
  jazz: 'Jazz Titan',
  crash: 'Bandicoot King',
  blinky: 'Blink King',
  deer: 'Forest Monarch',
  sonic: 'Super Sonic',
  honeypot: 'Honeypot Titan',
  dumpster: 'Trash King',
  tails: 'Nine Tails',
  shadow: 'Shadow Titan',
  killswitch: 'Deadswitch',
  morgana: 'Morgana Prime',
  vampire: 'Vampire Lord',
  onigiri: 'Onigiri Mountain',
  bushranger: 'Bushmaster',
  jonesy: 'Jonesy Prime',
  blaster: 'Mega Blaster',
  adventure: 'Great Explorer',
  stormscout: 'Storm Sovereign',
  overshield: 'Aegis',
  megaman: 'Mega Titan',
  birthday: 'Birthday Behemoth',
  meowscles: 'Meowscles Max',
  boss: 'The Chairman',
  vini: 'Samba Sovereign',
  pollo: 'Pollo Supremo',
  wick: 'Baba Yaga',
  pumpkin: 'Great Pumpkin',
  santa: 'Kringle Colossus',
  cupid: 'Cupid Prime',
  charm: 'Charm Sovereign',
  snow: 'Snow Sovereign',
  zombie: 'Zombie Colossus',
  undead: 'Eternal Sovereign',
  starfish: 'Star Sovereign',
  pika: 'Thunder Titan',
  unicorn: 'Prismhorn Titan',
  devil: 'Infernal Sovereign',
  yoga: 'Zen Sovereign',
  shark: 'Megalodon',
  whitewhale: 'Pale Leviathan',
  dragon: 'Elder Dragon',
  darkjoker: 'Jester Prime',
  jackskull: 'Pumpkin King',
  sally: 'Ragdoll Queen',
  keke: 'Keke Supreme',
  bestie: 'Bestie Titan',
  dog: 'Goodest Titan',
  karen: 'Manager Sovereign',
  motherearth: 'Gaia Titan',
  werewolf: 'Lunar Alpha',
  normal: 'Absolutely Normal',
  gummybear: 'Gummy Colossus',
  muddy: 'Silt Sovereign',
  spot: 'Patchwork Titan',
  frozen: 'Permafrost Titan',
  sixtyseven: 'Clutch Titan',
  creeper: 'Creeper Colossus',
  lion: 'Sunmane Sovereign',
  panda: 'Bamboo Titan',
  penguin: 'Emperor Titan',
  owl: 'Moon Sage',
  snake: 'World Serpent',
  spider: 'Weaver Titan',
  crab: 'Tidepinch Titan',
  dolphin: 'Wavecaller',
  sheep: 'Cloudwool Titan',
  bull: 'Taurus Titan',
  bossbaby: 'Chief Executive Titan',
  hero6: 'Sixth Sentinel',
  wrixel: 'Source Code',
  phantom: 'The Unseen',
  mali: 'Dune Sovereign',
  bastian: 'Bastion Eternal',
  k1ttyw1ns: 'K1TTY PR1ME',
  gracecrowne: 'Grace Eternal',
  geno: 'The Override',
  nicorobin: 'Devil Child',
  ace: 'Flame Emperor',
  cuddle: 'Cuddle Colossus',
  charlotte: 'Remix Queen',
  captainx: 'Admiral X',
  kirby: 'Star Warrior',
};

const EVOLUTION_LEVEL = 10;
const EVOLUTION_AFFINITY = 12;

/* Bedtime: two sleep cycles, or a quick 30-second nap. */
const NAP_MS = 30 * 1000;
const SLEEP_CYCLE_MS = 90 * 1000;
const SLEEP_CYCLES = 2;
const DREAM_LINES = [
  'a moonlit meadow with a very large moon',
  'a mountain made of warm pancakes',
  'flying over the Hollow on a leaf',
  'a tiny tea party with the stars',
  'chasing fireflies through the fog',
  'a snowball fight that nobody lost',
  'an ocean made of honey',
  'a bed with even more pillows',
  'dancing with the mushrooms after rain',
  'a very important meeting about snacks',
];

const EGG_TIERS = {
  common: { id: 'common', name: 'Meadow Egg', price: 45, emoji: '🥚', desc: 'A wild egg from the meadow. One random element.', mutation: 0.06, gen: 0 },
  wild: { id: 'wild', name: 'Wild Egg', price: 85, emoji: '🌿', desc: 'Rougher shell, wilder colors. Better mutation odds.', mutation: 0.2, gen: 1 },
  prism: { id: 'prism', name: 'Prism Egg', price: 135, emoji: '🔮', desc: 'Crackles with color. High mutation chance.', mutation: 0.45, gen: 2 },
  mythic: { id: 'mythic', name: 'Mythic Egg', price: 210, emoji: '🌌', desc: 'A storm-wrapped relic. Always hatches a Legendary or Mythic type.', mutation: 0.55, gen: 2 },
  puffle: { id: 'puffle', name: 'Puffle Egg', price: 260, emoji: '🐾', desc: 'A soft puffle-only shell. Always hatches a Puffle family species.', mutation: 0.5, gen: 2 },
  monthly: { id: 'monthly', name: 'Monthly Challenge Egg', price: 240, emoji: '📅', desc: 'A rotating challenge pool that changes on the first of each month. Always Rare or better.', mutation: 0.5, gen: 2 },
};
const EGG_KEYS = Object.keys(EGG_TIERS);

/* Every element is also sold as its own egg, so you can chase a specific look.
   Base prices anchor rarity; the shop price is the base minus the global egg discount. */
const TYPE_EGG_BASE_PRICE = {
  ember: 90, tide: 95, gale: 100, bloom: 90, volt: 105, frost: 95, dusk: 110, radiant: 115,
  demon: 130, angel: 135, air: 85, water: 85, earth: 80, honey: 95, pond: 85, hero: 120,
  ants: 75, fire: 100, splash: 85, slime: 75, rock: 70, stone: 80, bug: 70, bunny: 75,
  cloud: 80, crystal: 125, mushroom: 70, candy: 75,
  wolf: 120, tiger: 130, bear: 115, frog: 85, pig: 85, cat: 90, cow: 85, fish: 80,
  bat: 100, butterfly: 95, pillow: 75, dreameater: 140, lucky: 145,
  banana: 85, apple: 85, ice: 105, cherry: 100, cocoa: 90, pizza: 95,
  fishy: 95, striker: 95, aura: 90, six: 95, seven: 95, king: 180, queen: 180, ghost: 130,
  skull: 130, death: 190, lootllama: 140, duck: 100, peely: 130, dream: 130,
  zeropoint: 260, punk: 110, batman: 145, superman: 145, ironmouse: 135, bullet: 105,
  burntpb: 110, headshot: 125, cube: 115, bombjr: 130, grim: 195, squibbly: 130,
  onewish: 250, klombo: 250, crown: 230, spookydash: 240, jazz: 200, crash: 195,
  blinky: 190, deer: 185, sonic: 145, honeypot: 135, dumpster: 130, tails: 140,
  shadow: 145, killswitch: 140, morgana: 135, vampire: 145, onigiri: 110,
  bushranger: 115, jonesy: 105, blaster: 115, adventure: 110, stormscout: 130,
  overshield: 110, megaman: 145, birthday: 110, meowscles: 140,
  boss: 200, vini: 250, pollo: 250, wick: 260,
  pumpkin: 115, santa: 185, cupid: 175, charm: 145, snow: 120,
  zombie: 110, undead: 135, starfish: 100, pika: 150,
  unicorn: 175, devil: 160, yoga: 105, shark: 135, whitewhale: 210,
  dragon: 220, darkjoker: 185, jackskull: 165, sally: 150, keke: 120,
  bestie: 140, dog: 100, karen: 130, motherearth: 230,
  werewolf: 170, normal: 60, gummybear: 155,
  muddy: 85, spot: 90, frozen: 125, sixtyseven: 110, creeper: 105,
  lion: 165, panda: 125, penguin: 100, owl: 105, snake: 120, spider: 100, crab: 75, dolphin: 125,
  sheep: 80, bull: 105, bossbaby: 150, hero6: 135,
  wrixel: 135, phantom: 140, mali: 150, bastian: 145, k1ttyw1ns: 135,
  gracecrowne: 165, geno: 215, nicorobin: 205, ace: 200, cuddle: 160,
  charlotte: 120, captainx: 175, kirby: 175,
};
/* The shelf discount every species egg carries off its base price. Base prices
   are untouched: they are what typeEggRarity() reads, so a sale price can move
   without a species changing band. The tier eggs took a quarter off their own
   ladder, so this takes the same quarter off the species shelf — 0.65 x 0.75.
   The sprite-sheet species divide a tier price by this to get a base, so the
   two cuts cancel there and their eggs land on the new tier price. */
const TYPE_EGG_DISCOUNT = 0.4875;
function discountedEggPrice(price, step = 5) {
  return Math.max(step, Math.round((price * TYPE_EGG_DISCOUNT) / step) * step);
}
const TYPE_EGG_PRICE = {};
Object.keys(TYPE_EGG_BASE_PRICE).forEach((key) => {
  TYPE_EGG_PRICE[key] = discountedEggPrice(TYPE_EGG_BASE_PRICE[key]);
});
/* Every tier reads the official palette from data-rarity-colors.js. */
const TYPE_EGG_RARITIES = Object.fromEntries(
  Object.entries(RARITY_TIER_STYLES).map(([key, style]) => [key, { ...style, key }]),
);
/* The boost ladder and the economy read the spec, so a rank is added in one place. */
const RARITY_TIER_ORDER = RARITY_SPEC_KEYS.filter((key) => RARITY_SPEC[key].boostable !== false);
const RARITY_RANK_STEP = 10;
const RARITY_TIER_RANKS = RARITY_TIER_ORDER.map((key) => ({ key, rank: RARITY_SPEC[key].rank }));
const RARITY_APEX_KEYS = RARITY_SPEC_KEYS.filter((key) => RARITY_SPEC[key].apex);
/* Copy that names the apex ranks reads the spec, so a new apex rank is one
   entry here and nowhere else. */
function rarityNamePhrase(keys) {
  const names = keys.map((key) => RARITY_SPEC[key] && RARITY_SPEC[key].name).filter(Boolean);
  if (names.length < 2) return names[0] || '';
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}
const RARITY_APEX_PHRASE = rarityNamePhrase(RARITY_APEX_KEYS);

/* Tier eggs: one egg for every rank of the ladder. A tier egg hatches a random
   species from the type roster raised to that exact rank with a rarity boost,
   so the whole ladder is buyable without selling Vault keepers or the Master. */
const TIER_EGG_META = Object.fromEntries(RARITY_SPEC_KEYS
  .filter((key) => Number(RARITY_SPEC[key].price) > 0)
  .map((key) => [key, {
    name: `${RARITY_SPEC[key].name} Tier Egg`,
    price: RARITY_SPEC[key].price,
    mutation: RARITY_SPEC[key].mutation,
    gen: RARITY_SPEC[key].gen,
    desc: RARITY_SPEC[key].desc,
  }]));
const RARITY_BOOST_MAX = RARITY_TIER_ORDER.length - 1;

/* Bond ranks are earned by care, play, trails, and time together. */
/* Their effects are passive while the sprite is in the Hollow. */
const BOND_RANKS = [
  { key: 'new', name: 'New Friend', min: 0, icon: '🌱', blurb: 'A fresh hello. Every pet, snack, and shared trail starts here.', effect: {} },
  { key: 'warming', name: 'Warming Up', min: 20, icon: '🌤️', blurb: 'They know your voice and come running when you tap.', effect: { xp: 1.04 } },
  { key: 'friendly', name: 'Friendly', min: 45, icon: '💛', blurb: 'Meals, games, and quiet company feel easy now.', effect: { xp: 1.08, giftSpeed: 1.03 } },
  { key: 'close', name: 'Close', min: 70, icon: '💞', blurb: 'They save you the warm spot and check on your mood.', effect: { xp: 1.12, giftSpeed: 1.06, gameCoins: 1 } },
  { key: 'inseparable', name: 'Inseparable', min: 90, icon: '💖', blurb: 'Two shadows, one path. Gifts and games come easier.', effect: { xp: 1.18, giftSpeed: 1.1, gameCoins: 2, decay: 0.97 } },
  { key: 'heartbound', name: 'Heartbound', min: 100, icon: '💗', blurb: 'A bond with no ceiling. The Hollow feels brighter together.', effect: { xp: 1.25, giftSpeed: 1.15, gameCoins: 3, decay: 0.95 } },
];
function bondRankFor(value) {
  const bond = Math.max(0, Math.min(100, Number(value) || 0));
  for (let i = BOND_RANKS.length - 1; i >= 0; i--) if (bond >= BOND_RANKS[i].min) return BOND_RANKS[i];
  return BOND_RANKS[0];
}
function baseTypeEggRarity(key) {
  const price = TYPE_EGG_BASE_PRICE[key] || 90;
  if (price >= 210) return 'mythic';
  if (price >= 165) return 'legendary';
  if (price >= 117) return 'epic';
  if (price >= 98) return 'rare';
  if (price >= 75) return 'uncommon';
  return 'common';
}
function typeEggRarity(key) {
  if (typeof MASTER_CHEAT_SPECIES !== 'undefined' && key === MASTER_CHEAT_SPECIES) return 'master';
  /* A species can pin its own egg band (the Divine Ancient Celestial does),
     so its identity outranks the price-derived default. */
  if (ELEMENTS[key]?.eggRarity) return ELEMENTS[key].eggRarity;
  if (ELEMENTS[key]?.secretVariant) return 'secret';
  /* Vault keepers outrank Exotic, including the two exotic-class secrets. */
  if (typeof isSecretSpecies === 'function' && isSecretSpecies(key)) return 'secret';
  if (ELEMENTS[key]?.masterTier) return 'master';
  if (typeof isExoticSpecies === 'function' && isExoticSpecies(key)) return 'exotic';
  return baseTypeEggRarity(key);
}
/* Apex type eggs: the same species egg, sold at an apex rank instead of its
   base band. The premium is what buys the trail-only ranks. */
const TYPE_EGG_APEX_PREMIUM = Object.fromEntries(RARITY_SPEC_KEYS
  .filter((key) => Number(RARITY_SPEC[key].apexPremium) > 0)
  .map((key) => [key, RARITY_SPEC[key].apexPremium]));
const WISHLIST_LIMIT = 12;
function typeEggApexPrice(key, rank) {
  const premium = TYPE_EGG_APEX_PREMIUM[rank];
  const base = TYPE_EGG_PRICE[key] || TYPE_EGG_BASE_PRICE[key] || 90;
  return premium ? base + premium : base;
}
/* The species a band egg may hatch: exactly those whose own rank is the band.
   One definition, read by the shop, the purchase and the audit, so the odds a
   card prints are the odds the roll uses. */
function tierEggBandPool(tierKey) {
  const guardians = typeof CUSTOM_GUARDIANS !== 'undefined' && Array.isArray(CUSTOM_GUARDIANS)
    ? CUSTOM_GUARDIANS.map((guardian) => guardian && guardian.key).filter(Boolean) : [];
  /* TYPE_EGG_SPECIES is a snapshot taken when the data files load, and later
     registration waves leave species out of it for good. Read the live roster
     so a species that registers late still has a band to hatch from. */
  const roster = typeof ELEMENT_KEYS !== 'undefined' && Array.isArray(ELEMENT_KEYS)
    ? ELEMENT_KEYS.filter((key) => key && !guardians.includes(key))
    : (typeof TYPE_EGG_SPECIES !== 'undefined' ? TYPE_EGG_SPECIES : WILD_SPECIES);
  /* ELEMENT_KEYS can list a key twice when two data files register it, and a
     duplicate would sit in the band twice and draw at double weight. */
  return [...new Set(roster)].filter((key) => ELEMENTS[key]
    && !(typeof isSecretSpecies === 'function' && isSecretSpecies(key))
    && typeEggRarity(key) === tierKey);
}
/* A band of thousands cannot price a named species at one egg: 1,425 coins
   against 3,763 secrets is 5.4M for the one you want. Each deep band sells a
   window of this many species instead, so one named species costs at most
   price x window, and the window rotates daily so every species comes round. */
const TIER_BAND_FEATURED = 32;
/* The most a named species may cost in band eggs. Bands under it sell their
   whole pool; deeper ones sell a window. */
const TIER_BAND_NAMED_BUDGET = 120000;
/* `pinned` is the species the player asked to see. It takes one of the window's
   slots instead of adding one, so pinning never widens the window and never
   moves the ceiling on what a named species costs. The pin is read through
   bandPinFor when the save has one, and dropped when it is no longer a member
   of the band, so a stale pin cannot sell a species the band does not own. */
function tierEggFeaturedPool(tierKey, date = new Date(),
  pinned = (typeof bandPinFor === 'function' ? bandPinFor(tierKey) : null)) {
  const pool = typeof tierEggBandPool === 'function' ? tierEggBandPool(tierKey) : [];
  const price = Number(typeof TIER_EGG_META !== 'undefined' && TIER_EGG_META[tierKey]
    ? TIER_EGG_META[tierKey].price : 0);
  if (pool.length <= TIER_BAND_FEATURED || price * pool.length <= TIER_BAND_NAMED_BUDGET) return pool;
  const seed = `band-${tierKey}-${typeof dayKey === 'function' ? dayKey(date) : 'today'}`;
  const rnd = typeof seedRandom === 'function' ? seedRandom(seed) : Math.random;
  const order = pool.slice();
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const window = order.slice(0, TIER_BAND_FEATURED);
  const pin = pinned && pool.includes(pinned) && !window.includes(pinned) ? pinned : null;
  if (!pin) return window;
  return [pin, ...order.filter((key) => key !== pin).slice(0, TIER_BAND_FEATURED - 1)];
}
/* What one named species costs in a band right now: the expected number of eggs
   it takes to roll it out of what is left. The band egg fills the window's
   unowned species before repeating, so the pinned species is equally likely to
   be any one of the `left` that are missing and the expected draw is
   (left + 1) / 2 — 16.5 eggs from a full window, one egg when it is all that is
   missing. A pin keeps a species on sale every day but does not weight the
   draw, so this is what buying it outright costs: the same coins as rolling for
   it on average, with none of the variance and none of the other species. It
   tops out at the empty-window price, which is the band's ceiling. */
function tierBandNamedPrice(tierKey) {
  const meta = TIER_EGG_META[tierKey];
  if (!meta) return 0;
  const window = tierEggFeaturedPool(tierKey);
  const sprites = typeof state !== 'undefined' ? state.sprites : [];
  const owned = new Set(sprites.map((sprite) => sprite.element).filter(Boolean));
  const left = Math.max(1, window.reduce((count, key) => count + (owned.has(key) ? 0 : 1), 0));
  return Math.round(Number(meta.price) * (left + 1) / 2);
}


function typeEggRarityBoost(key, rank) {
  if (!TYPE_EGG_APEX_PREMIUM[rank]) return 0;
  const target = RARITY_TIER_ORDER.indexOf(rank);
  const base = RARITY_TIER_ORDER.indexOf(typeEggRarity(key));
  return Math.max(0, target - Math.max(0, base));
}
/* Apex bundles: several random apex type eggs at one price. The bundle price
   follows the roster's average apex price, so the discount is the same or
   better than buying any five (or ten) named eggs separately. */
const TYPE_EGG_BULK_DEALS = [
  { size: 5, off: 0.12 },
  { size: 10, off: 0.2 },
];
function typeEggAverageApexPrice(rank) {
  const roster = typeof TYPE_EGG_SPECIES !== 'undefined' ? TYPE_EGG_SPECIES : [];
  if (!roster.length) return typeEggApexPrice('ember', rank);
  const total = roster.reduce((sum, key) => sum + typeEggApexPrice(key, rank), 0);
  return total / roster.length;
}
function typeEggBulkPrice(rank, size) {
  const deal = TYPE_EGG_BULK_DEALS.find((d) => d.size === size);
  if (!deal || !TYPE_EGG_APEX_PREMIUM[rank]) return 0;
  return Math.round((typeEggAverageApexPrice(rank) * size * (1 - deal.off)) / 5) * 5;
}
/* Listed coin bonuses: strictly up the ladder, so no two rungs tie. Uncommon
   used to share common's 1,500; raising it to 2,000 fills the gap to rare
   without touching what a Common earns. */
const RARITY_COIN_BONUS = Object.fromEntries(RARITY_SPEC_KEYS
  .filter((key) => Number(RARITY_SPEC[key].coinBonus) > 0)
  .map((key) => [key, RARITY_SPEC[key].coinBonus]));
/* Boosts resolve against each tier's stable rank, not its array index. A tier
   inserted later takes a fresh rank number between two existing ones, so every
   already-stored boost still lands on the tier it always did; renumbering the
   ladder instead is what silently rewrote saved sprites. */
function rarityResolveByRank(tiers, baseKey, boost = 0) {
  const base = tiers.find((tier) => tier.key === baseKey) || tiers[0];
  if (!base) return null;
  const step = Math.max(0, Math.floor(Number(boost) || 0));
  const target = base.rank + step * RARITY_RANK_STEP;
  let chosen = base;
  tiers.forEach((tier) => {
    if (tier.rank <= target && tier.rank >= chosen.rank) chosen = tier;
  });
  return chosen.key;
}
function rarityTierWithBoost(key, boost = 0) {
  return rarityResolveByRank(RARITY_TIER_RANKS, typeEggRarity(key), boost);
}
window.rarityResolveByRank = rarityResolveByRank;
window.RARITY_TIER_RANKS = RARITY_TIER_RANKS;
function rarityCoinBonus(key, boost = 0) {
  return RARITY_COIN_BONUS[rarityTierWithBoost(key, boost)] || 0;
}

/* The Mythic Egg pools only the top two rarity bands, with Dragon and Mother Earth featured. */
const MYTHIC_EGG_MYTHIC_POOL = ELEMENT_KEYS.filter((key) => baseTypeEggRarity(key) === 'mythic');
const MYTHIC_EGG_LEGENDARY_POOL = ELEMENT_KEYS.filter((key) => baseTypeEggRarity(key) === 'legendary');
const MYTHIC_EGG_POOL = Array.from(new Set(['dragon', 'motherearth', ...MYTHIC_EGG_MYTHIC_POOL, ...MYTHIC_EGG_LEGENDARY_POOL]));
function rollMythicEggElement() {
  return chance(0.65) ? pick(MYTHIC_EGG_MYTHIC_POOL) : pick(MYTHIC_EGG_LEGENDARY_POOL);
}

/* A puffle-only pool. The painted puffle waves register after this file, so the
   roster is read when the egg is bought instead of when data.js loads. */
function puffleEggPool() {
  const pool = ELEMENT_KEYS.filter((key) => key.startsWith('puffle_') && ELEMENTS[key]);
  return pool.length ? pool : WILD_SPECIES;
}
function rollPuffleEggElement() {
  return pick(puffleEggPool());
}

/* The Monthly Challenge Egg rotates its theme on the first of each month.
   Every listed key is filtered against today's live roster, so a holiday that
   is not loaded yet cannot leave the pool empty. */
const MONTHLY_EGG_THEMES = [
  { name: 'Frostfall', icon: '❄️', keys: ['frost', 'ice', 'snow', 'aurora', 'frozen', 'crystal', 'penguin'] },
  { name: 'Sweetheart', icon: '💗', keys: ['cupid', 'charm', 'bestie', 'cuddle', 'candy', 'rose'] },
  { name: 'Bloomtide', icon: '🌸', keys: ['bloom', 'bunny', 'springchick', 'floral', 'butterfly', 'honeybee'] },
  { name: 'Egg Hunt', icon: '🥚', keys: ['egghunt', 'bunny', 'springchick', 'charm', 'holly', 'floral'] },
  { name: 'Garden Party', icon: '🌷', keys: ['floral', 'bloom', 'butterfly', 'honeybee', 'mushroom', 'garden'] },
  { name: 'Sunset Shore', icon: '🌅', keys: ['tide', 'water', 'splash', 'sunspark', 'beachball', 'dolphin'] },
  { name: 'Solar Foundry', icon: '☀️', keys: ['solar', 'sunspark', 'fire', 'ember', 'beachball', 'shark'] },
  { name: 'Deep Current', icon: '🌊', keys: ['tide', 'shark', 'dolphin', 'whitewhale', 'jellyfish', 'seahorse'] },
  { name: 'Harvest Moon', icon: '🌾', keys: ['harvest', 'apple', 'scarecrow', 'pumpkin', 'honey', 'gingerbread'] },
  { name: 'Hollow Haunt', icon: '🎃', keys: ['pumpkin', 'witch', 'ghost', 'scarecrow', 'blackcat', 'mummy'] },
  { name: 'Golden Gather', icon: '🍂', keys: ['harvest', 'apple', 'honey', 'gingerbread', 'scarecrow', 'cocoa'] },
  { name: 'Snowfall', icon: '🎄', keys: ['santa', 'reindeer', 'elf', 'gingerbread', 'snowman', 'holly', 'cocoa'] },
];
function currentMonthlyEggTheme(date = new Date()) {
  return MONTHLY_EGG_THEMES[((date.getMonth() % 12) + 12) % 12];
}
function monthlyEggPool(date = new Date()) {
  const theme = currentMonthlyEggTheme(date);
  const pool = theme.keys.filter((key) => {
    if (!ELEMENTS[key]) return false;
    const secret = typeof isSecretSpecies === 'function' && isSecretSpecies(key);
    return !secret;
  });
  return pool.length ? pool : MYTHIC_EGG_POOL;
}
function rollMonthlyEggElement(date = new Date()) {
  return pick(monthlyEggPool(date));
}

const TASK_POOL = [
  { id: 'pets', icon: '💛', label: 'Pet your sprites', stat: 'pets', goal: 8, reward: 30, xp: 18 },
  { id: 'feeds', icon: '🍓', label: 'Serve 3 snacks', stat: 'feeds', goal: 3, reward: 32, xp: 20 },
  { id: 'chats', icon: '💬', label: 'Talk with a sprite', stat: 'chats', goal: 2, reward: 28, xp: 18 },
  { id: 'baths', icon: '🫧', label: 'Give a bubble bath', stat: 'baths', goal: 1, reward: 26, xp: 16 },
  { id: 'naps', icon: '😴', label: 'Tuck a sprite in', stat: 'naps', goal: 1, reward: 26, xp: 16 },
  { id: 'games', icon: '🎮', label: 'Play a sprite game', stat: 'games', goal: 1, reward: 38, xp: 24 },
  { id: 'warms', icon: '🥚', label: 'Warm an egg 6 times', stat: 'warms', goal: 6, reward: 22, xp: 14 },
  { id: 'hatches', icon: '🐣', label: 'Hatch an egg', stat: 'hatches', goal: 1, reward: 48, xp: 30 },
  { id: 'merges', icon: '🧬', label: 'Merge two sprites', stat: 'merges', goal: 1, reward: 60, xp: 36 },
];

/* The brand identity, in one place. CSS mirrors this with --accent,
   --accent-2 and --gold (styles.css :root); JS takes these values wherever a
   real colour string is needed (colour inputs, palettes, canvas). Change the
   palette here and in styles.css together. */
const BRAND = Object.freeze({ accent: '#7c5cff', accent2: '#5ce1e6', gold: '#ffd166' });

const THEMES = {
  prism: { name: 'Prism', accent: BRAND.accent, accent2: BRAND.accent2, bg: '#0b0a16', bg2: '#14112b', text: '#f4f1ff', muted: '#a49ec4', swatch: ['#7c5cff', '#5ce1e6'] },
  bloom: { name: 'Bloom', accent: '#4ade80', accent2: '#a3e635', bg: '#07130d', bg2: '#0e2017', text: '#f0fff6', muted: '#94b8a4', swatch: ['#34d399', '#a3e635'] },
  candy: { name: 'Candy', accent: '#ff6bc1', accent2: '#ffb86b', bg: '#160b18', bg2: '#25102a', text: '#fff4fb', muted: '#c29bb9', swatch: ['#ff6bc1', '#ffb86b'] },
  tide: { name: 'Tide', accent: '#38bdf8', accent2: '#2dd4bf', bg: '#04111a', bg2: '#08202e', text: '#effbff', muted: '#8fb3c4', swatch: ['#38bdf8', '#2dd4bf'] },
  sunset: { name: 'Sunset', accent: '#f97362', accent2: '#fbbf24', bg: '#150a0c', bg2: '#241216', text: '#fff3ec', muted: '#c7a49b', swatch: ['#f97362', '#fbbf24'] },
  ember: { name: 'Ember', accent: '#ff7a3d', accent2: '#ffd166', bg: '#140a06', bg2: '#24130b', text: '#fff5ea', muted: '#c9a48a', swatch: ['#ff7a3d', '#ffd166'] },
  lagoon: { name: 'Lagoon', accent: '#22d3ee', accent2: '#818cf8', bg: '#05121a', bg2: '#0a2030', text: '#ecfeff', muted: '#8ab4c4', swatch: ['#22d3ee', '#818cf8'] },
  orchid: { name: 'Orchid', accent: '#c084fc', accent2: '#f472b6', bg: '#120a1c', bg2: '#201230', text: '#faf5ff', muted: '#b6a2ce', swatch: ['#c084fc', '#f472b6'] },
  meadow: { name: 'Meadow', accent: '#84cc16', accent2: '#22c55e', bg: '#0a1207', bg2: '#14220d', text: '#f7fee7', muted: '#a8bf92', swatch: ['#84cc16', '#22c55e'] },
  midnight: { name: 'Midnight', accent: '#60a5fa', accent2: '#a78bfa', bg: '#070b18', bg2: '#0f1730', text: '#eff6ff', muted: '#93a4c8', swatch: ['#60a5fa', '#a78bfa'] },
  rose: { name: 'Rose', accent: '#fb7185', accent2: '#fda4af', bg: '#170a0e', bg2: '#281118', text: '#fff1f2', muted: '#c9a3ac', swatch: ['#fb7185', '#fda4af'] },
};
const THEME_KEYS = Object.keys(THEMES);

const SCENES = {
  grove: {
    name: 'Sunny Grove', unlocked: true, habitat: 'Meadow', emoji: '🌿', bonus: 0.4,
    blurb: 'Open grass, warm sun, and room to grow.',
    species: ['bloom', 'normal', 'earth', 'honey', 'honeypot', 'bunny', 'frog', 'pig', 'cow', 'cat', 'dog', 'wolf', 'tiger', 'bear', 'deer', 'butterfly', 'bug', 'ants', 'mushroom', 'bestie', 'yoga', 'motherearth', 'karen', 'pollo', 'lootllama', 'meowscles', 'bushranger', 'adventure', 'jonesy', 'squibbly', 'peely', 'dumpster', 'muddy', 'spot', 'creeper', 'lion', 'panda', 'sheep', 'bull', 'cuddle', 'bastian'],
  },
  night: {
    name: 'Moon Hollow', unlocked: true, habitat: 'Moonlit', emoji: '🌙', bonus: 0.4,
    blurb: 'Quiet shadows, silver light, and room for a good howl.',
    species: ['dusk', 'ghost', 'skull', 'death', 'grim', 'undead', 'zombie', 'vampire', 'werewolf', 'bat', 'dream', 'dreameater', 'pillow', 'spookydash', 'morgana', 'jackskull', 'pumpkin', 'darkjoker', 'owl', 'spider', 'phantom', 'geno'],
  },
  tide: {
    name: 'Tidepool', unlocked: true, habitat: 'Tidal', emoji: '🌊', bonus: 0.4,
    blurb: 'Salt spray, shallow pools, and a horizon to swim toward.',
    species: ['tide', 'water', 'fishy', 'fish', 'shark', 'whitewhale', 'duck', 'pond', 'splash', 'starfish', 'frog', 'muddy', 'frozen', 'penguin', 'crab', 'dolphin', 'nicorobin', 'captainx'],
  },
  neon: {
    name: 'Neon Den', unlocked: true, habitat: 'Arcade', emoji: '🕹️', bonus: 0.4,
    blurb: 'Humming lights, arcade noise, and a little friendly chaos.',
    species: ['volt', 'pika', 'blaster', 'sonic', 'tails', 'shadow', 'killswitch', 'megaman', 'batman', 'superman', 'ironmouse', 'six', 'seven', 'aura', 'striker', 'bullet', 'headshot', 'crash', 'jazz', 'blinky', 'boss', 'vini', 'wick', 'stormscout', 'overshield', 'punk', 'hero', 'sixtyseven', 'bossbaby', 'hero6', 'wrixel', 'k1ttyw1ns', 'charlotte'],
  },
  aurora: {
    name: 'Aurora Ridge', unlocked: false, gift: true, habitat: 'Aurora', emoji: '❄️', bonus: 0.5,
    blurb: 'Cold air, singing ice, and a sky that keeps changing its mind.',
    species: ['frost', 'ice', 'snow', 'air', 'gale', 'cloud', 'radiant', 'angel', 'unicorn', 'lucky', 'onewish', 'klombo', 'crown', 'santa', 'zeropoint', 'adventure', 'frozen', 'penguin', 'gracecrowne'],
  },
  crystal: {
    name: 'Crystal Caverns', unlocked: false, gift: true, habitat: 'Cavern', emoji: '💎', bonus: 0.5,
    blurb: 'Glittering stone, deep echoes, and a throne for a tiny royal.',
    species: ['rock', 'stone', 'crystal', 'cube', 'slime', 'bug', 'ants', 'king', 'queen', 'klombo', 'creeper', 'spider', 'snake'],
  },
  ember: {
    name: 'Ember Forge', unlocked: true, habitat: 'Ember', emoji: '🔥', bonus: 0.5,
    blurb: 'Crackling heat, flying sparks, and a floor that remembers fire.',
    species: ['ember', 'fire', 'demon', 'devil', 'dragon', 'bombjr', 'burntpb', 'jackskull', 'pumpkin', 'mali', 'ace'],
  },
  sugar: {
    name: 'Sugar Kitchen', unlocked: true, habitat: 'Sugar', emoji: '🍬', bonus: 0.45,
    blurb: 'Warm ovens, sticky counters, and sprinkles in every corner.',
    species: ['candy', 'gummybear', 'cocoa', 'cherry', 'apple', 'banana', 'ice', 'pizza', 'birthday', 'cupid', 'charm', 'honey', 'honeypot', 'onigiri', 'keke', 'sally', 'peely', 'kirby'],
  },
  dream: {
    name: 'Dream Conservatory', unlocked: true, habitat: 'Dream', emoji: '💭', bonus: 0.45,
    blurb: 'Drifting clouds, soft chimes, and a nap waiting in the glass.',
    species: ['dream', 'dreameater', 'pillow', 'angel', 'unicorn', 'sally', 'charm', 'onewish', 'klombo', 'squibbly', 'lucky', 'keke', 'panda', 'owl'],
  },
  reef: {
    name: 'Coral Reef', unlocked: false, gift: true, habitat: 'Reef', emoji: '🪸', bonus: 0.5,
    blurb: 'Warm shallows, bright coral, and a tide that never stops moving.',
    species: ['tide', 'water', 'fishy', 'fish', 'shark', 'whitewhale', 'starfish', 'crab', 'dolphin', 'splash', 'pond', 'duck', 'nicorobin', 'captainx'],
  },
  savanna: {
    name: 'Golden Savanna', unlocked: false, gift: true, habitat: 'Savanna', emoji: '🦒', bonus: 0.5,
    blurb: 'Tall gold grass, acacia shade, and a horizon that goes on forever.',
    species: ['lion', 'tiger', 'deer', 'bull', 'sheep', 'mali', 'ace', 'vini', 'striker', 'ants', 'bug', 'snake', 'panda', 'cuddle'],
  },

  /* The twelve regions of Sprite Hollow. Each lists its elemental species, so
     the travel map and the family roster describe the same world. */
  bloomroot: {
    name: 'Bloomroot Valley', unlocked: true, habitat: 'Valley', emoji: '🌿', bonus: 0.5,
    blurb: 'Warm green light, shallow roots of the Worldheart, and a path that smells of rain and pollen.',
    species: ['bloom', 'earth', 'honey', 'honeypot', 'bunny', 'butterfly', 'deer', 'frog', 'mushroom', 'sp_nature', 'sp_bloomlight', 'sp_titanroot'],
  },
  emberpeak: {
    name: 'Emberpeak Highlands', unlocked: true, habitat: 'Highlands', emoji: '🌋', bonus: 0.52,
    blurb: 'Black ridges seamed with glowing rock, where the wind carries sparks uphill.',
    species: ['ember', 'fire', 'demon', 'devil', 'dragon', 'bombjr', 'burntpb', 'sp_fire', 'sp_plasma'],
  },
  crystaltide: {
    name: 'Crystal Tide Coast', unlocked: true, habitat: 'Coast', emoji: '🌊', bonus: 0.5,
    blurb: 'Long glassy surf, tide pools full of light, and a horizon that keeps its promises.',
    species: ['tide', 'water', 'fishy', 'fish', 'shark', 'whitewhale', 'starfish', 'crab', 'dolphin', 'sp_water', 'sp_frostwave', 'sp_abyssal'],
  },
  auroraglacier: {
    name: 'Aurora Glacier', unlocked: true, habitat: 'Glacier', emoji: '❄️', bonus: 0.52,
    blurb: 'Blue ice a hundred winters deep, and a sky that keeps changing its mind above it.',
    species: ['frost', 'ice', 'snow', 'frozen', 'penguin', 'sp_ice', 'sp_frostwave'],
  },
  thundercloud: {
    name: 'Thundercloud Heights', unlocked: true, habitat: 'Storm', emoji: '⚡', bonus: 0.52,
    blurb: 'Anvils of cloud stacked like stairs, and a charge in the air that lifts your fur.',
    species: ['volt', 'pika', 'stormscout', 'sp_lightning', 'sp_plasma'],
  },
  whisperwind: {
    name: 'Whisperwind Plains', unlocked: true, habitat: 'Sky', emoji: '🌪️', bonus: 0.48,
    blurb: 'Pale grass bent one way forever, and a breeze that seems to be going somewhere important.',
    species: ['air', 'gale', 'cloud', 'unicorn', 'sp_air'],
  },
  stoneheart: {
    name: 'Stoneheart Canyon', unlocked: true, habitat: 'Canyon', emoji: '🪨', bonus: 0.5,
    blurb: 'Red walls, patient echoes, and a river that has been carving its argument for centuries.',
    species: ['rock', 'stone', 'earth', 'cube', 'ants', 'bug', 'sp_earth'],
  },
  celestial: {
    name: 'Celestial Meadows', unlocked: true, habitat: 'Radiant', emoji: '☀️', bonus: 0.52,
    blurb: 'Gold grass under a wide bright sky, where the light stays a little longer than it should.',
    species: ['radiant', 'angel', 'unicorn', 'onewish', 'gracecrowne', 'sp_light', 'sp_celestialprism'],
  },
  shadowveil: {
    name: 'Shadowveil Woods', unlocked: true, habitat: 'Shadow', emoji: '🌑', bonus: 0.52,
    blurb: 'Violet trunks and quiet footsteps, with lantern-glow only where someone has been kind.',
    species: ['dusk', 'shadow', 'phantom', 'spider', 'bat', 'sp_shadow', 'sp_voidcrystal'],
  },
  prismcaverns: {
    name: 'Prism Caverns', unlocked: true, habitat: 'Cavern', emoji: '💎', bonus: 0.52,
    blurb: 'Halls of clear stone that split a single lamp into every colour it knows.',
    species: ['crystal', 'cube', 'slime', 'king', 'queen', 'sp_crystal', 'sp_voidcrystal'],
  },
  worldheart: {
    name: 'Worldheart Tree', unlocked: false, gift: true, habitat: 'Sacred', emoji: '🌳', bonus: 0.54,
    blurb: 'The great tree at the centre of everything, its roots running out under every region at once.',
    species: ['klombo', 'motherearth', 'gracecrowne', 'sp_nature', 'sp_light', 'sp_lifeheart'],
  },
  genesiscore: {
    name: 'Genesis Core', unlocked: false, gift: true, habitat: 'Void', emoji: '🌌', bonus: 0.55,
    blurb: 'The old room under the roots, where the first elements were named and left running.',
    species: ['zeropoint', 'onewish', 'crown', 'sp_omnitype', 'sp_celestialprism'],
  },
};
const SCENE_KEYS = Object.keys(SCENES);
const GIFT_SCENES = SCENE_KEYS.filter((k) => SCENES[k].gift);

/* ---------- seasons, weather & climate ---------- */

const SEASONS = {
  spring: { key: 'spring', name: 'Spring', icon: '🌸', months: [2, 3, 4], blurb: 'Blossoms, breezes, and soft rain.', weather: ['clear', 'petals', 'blossomwind', 'breeze', 'rain', 'drizzle', 'sunshower'] },
  summer: { key: 'summer', name: 'Summer', icon: '☀️', months: [5, 6, 7], blurb: 'Long light, warm grass, and sudden storms.', weather: ['sun', 'clear', 'heat', 'storm', 'fireflies', 'sunshower', 'starfall'] },
  autumn: { key: 'autumn', name: 'Autumn', icon: '🍂', months: [8, 9, 10], blurb: 'Gold leaves, cool air, and early dusk.', weather: ['clear', 'leaves', 'fog', 'rain', 'mist', 'starfall'] },
  winter: { key: 'winter', name: 'Winter', icon: '❄️', months: [11, 0, 1], blurb: 'Short days, frost, and settling snow.', weather: ['snow', 'frost', 'thundersnow', 'clear', 'fog', 'hail'] },

  /* ---- custom seasons ---- */
  /* Chosen in the weather sheet, never by the calendar: CALENDAR_SEASONS below
     lists the four that follow the real months, and these carry no months. */
  aurora: { key: 'aurora', name: 'Auroral', icon: '🌌', blurb: 'Green light over the snow and a sky that never quite darkens.', weather: ['aurora', 'starfall', 'frost', 'clear', 'mist'] },
  emberfall: { key: 'emberfall', name: 'Emberfall', icon: '🔥', blurb: 'Warm ash drifts like leaves and the horizon glows after dark.', weather: ['ashfall', 'heat', 'meteor', 'storm', 'sun'] },
  monsoon: { key: 'monsoon', name: 'Monsoon', icon: '🌧️', blurb: 'Rain arrives in sheets, then the whole Hollow steams.', weather: ['rain', 'drizzle', 'storm', 'fog', 'sunshower'] },
  starfall: { key: 'starfall', name: 'Starfall', icon: '🌠', blurb: 'Meteors cross a clear sky and the fireflies come out to watch.', weather: ['starfall', 'meteor', 'fireflies', 'clear', 'celestial'] },
  harvestmoon: { key: 'harvestmoon', name: 'Harvest Moon', icon: '🌕', blurb: 'Low gold light, early mist, and a moon that fills the field.', weather: ['clear', 'leaves', 'mist', 'fireflies', 'starfall'] },
  frostfair: { key: 'frostfair', name: 'Frost Fair', icon: '⛸️', blurb: 'Hard frost, lantern light, and snow packed down into paths.', weather: ['snow', 'frost', 'hail', 'thundersnow', 'clear'] },
  festival: { key: 'festival', name: 'Festival', icon: '🎊', blurb: 'Bunting between the trees, lantern light, and a sky that keeps dropping confetti.', weather: ['sunshower', 'rainbow', 'petals', 'fireflies', 'clear'] },
};
const SEASON_KEYS = Object.keys(SEASONS);
/* The pause switch at the end of the season picker. Deliberately not in
   SEASONS: it has no months and no place in any loop that walks seasons, but
   seasonOf() returns it so the light and the sky hold still. */
const SEASON_OFF = { key: 'off', name: 'No season', icon: '🚫', blurb: 'The calendar is paused. The Hollow keeps a plain, even light.', weather: ['clear'] };
/* The four seasons the real calendar can pick; the rest are manual only. */
const CALENDAR_SEASONS = ['spring', 'summer', 'autumn', 'winter'].map((key) => SEASONS[key]);

const CLIMATES = {
  temperate: { key: 'temperate', name: 'Temperate', icon: '🌤️', blurb: 'Four even seasons and gentle weather.', bias: { clear: 1.5, sun: 1.1 } },
  tropical: { key: 'tropical', name: 'Tropical', icon: '🌴', blurb: 'Warm rain, heavy air, and no real winter.', bias: { rain: 2, storm: 1.8, heat: 1.4, sun: 1.2, snow: 0, frost: 0 }, extra: { rain: 0.8 } },
  arid: { key: 'arid', name: 'Arid', icon: '🏜️', blurb: 'Dry heat by day, cold dust by night.', bias: { sun: 1.8, heat: 2, rain: 0.5, fog: 0.4, snow: 0 } },
  arctic: { key: 'arctic', name: 'Arctic', icon: '🧊', blurb: 'Long snows, deep frost, and pale light.', bias: { snow: 1.5, frost: 1.4, fog: 1.2, sun: 0.6, heat: 0 }, extra: { snow: 1.5, frost: 1.2 } },
  highland: { key: 'highland', name: 'Highland', icon: '⛰️', blurb: 'Thin air, fast weather, and misty mornings.', bias: { fog: 2, breeze: 1.8, storm: 1.2 }, extra: { snow: 1.2, fog: 1.2 } },
  coastal: { key: 'coastal', name: 'Coastal', icon: '🌊', blurb: 'Salt air, sea breeze, and weather that rolls in fast.', bias: { clear: 1.3, breeze: 1.9, rain: 1.5, storm: 1.3, fog: 1.1, snow: 0.3 } },
  savanna: { key: 'savanna', name: 'Savanna', icon: '🦒', blurb: 'Wide grass, hard sun, and storms that arrive all at once.', bias: { sun: 1.6, heat: 1.5, clear: 1.3, storm: 0.9, snow: 0, frost: 0.2 } },
  monsoon: { key: 'monsoon', name: 'Monsoon', icon: '🌧️', blurb: 'Heavy air and rain that arrives like a season of its own.', bias: { rain: 2.4, storm: 1.9, heat: 1.1, fog: 1.2, snow: 0, frost: 0 }, extra: { rain: 1.2, storm: 0.6 } },
  mediterranean: { key: 'mediterranean', name: 'Mediterranean', icon: '🫒', blurb: 'Warm dry summers, mild wet winters, and a reliable sea breeze.', bias: { sun: 1.6, clear: 1.5, heat: 1.2, rain: 0.7, storm: 0.6, snow: 0, frost: 0 }, extra: { drizzle: 0.5 } },
  tundra: { key: 'tundra', name: 'Tundra', icon: '🐻‍❄️', blurb: 'Frozen ground, long twilight, and weather that bites.', bias: { snow: 2, frost: 1.8, fog: 1.2, hail: 1.1, sun: 0.7, heat: 0, rain: 0.3 }, extra: { hail: 1.4, aurora: 0.5 } },
  volcanic: { key: 'volcanic', name: 'Volcanic', icon: '🌋', blurb: 'Ash on the wind, warm stone, and sudden electrical storms.', bias: { ashfall: 2.2, heat: 2, storm: 1.2, sun: 0.9, rain: 0.2, snow: 0, frost: 0 }, extra: { meteor: 0.45 } },
  swamp: { key: 'swamp', name: 'Swamp', icon: '🐸', blurb: 'Still water, low mist, and a chorus of fireflies after dark.', bias: { mist: 2, rain: 1.8, storm: 1.3, fog: 1.4, heat: 0.8, snow: 0, frost: 0 }, extra: { fireflies: 1 } },
  jungle: { key: 'jungle', name: 'Jungle', icon: '🌿', blurb: 'Hot green shade, heavy rain, and blossom drifting through the canopy.', bias: { rain: 2.2, storm: 1.6, heat: 1.4, petals: 0.8, mist: 0.9, snow: 0, frost: 0 }, extra: { drizzle: 0.8 } },
  steppe: { key: 'steppe', name: 'Steppe', icon: '🌾', blurb: 'Open grass, endless wind, and dust that travels for miles.', bias: { breeze: 1.8, sun: 1.5, sandstorm: 1.4, clear: 1.1, rain: 0.6, snow: 0.3 }, extra: { sandstorm: 1.1 } },
  reefglass: { key: 'reefglass', name: 'Reefglass', icon: '🪸', blurb: 'Clear shallows, salt light, and rain that arrives with the tide.', bias: { sun: 1.5, breeze: 1.7, rain: 1.4, sunshower: 1.6, storm: 0.8, snow: 0 }, extra: { drizzle: 0.7 } },
  clockwork: { key: 'clockwork', name: 'Clockwork', icon: '⚙️', blurb: 'Ordered weather, brass skies, and a breeze that keeps perfect time.', bias: { clear: 1.8, fog: 1.4, breeze: 1.3, rain: 0.6, storm: 0.5, snow: 0.2 }, extra: { starfall: 0.35 } },
  ashen: { key: 'ashen', name: 'Ashen', icon: '🌋', blurb: 'Warm ash, dry lightning, and a horizon that glows at night.', bias: { ashfall: 2, heat: 1.6, storm: 1.5, sunshower: 0.3, snow: 0, frost: 0 }, extra: { meteor: 0.5 } },
  moonlit: { key: 'moonlit', name: 'Moonlit', icon: '🌙', blurb: 'Long blue evenings, quiet mist, and stars that seem close enough to touch.', bias: { aurora: 1.6, mist: 1.5, fireflies: 1.4, clear: 1.2, starfall: 1.7, sun: 0.5, heat: 0 }, extra: { meteor: 0.4 } },
};
const CLIMATE_KEYS = Object.keys(CLIMATES);

const WEATHERS = {
  clear: { key: 'clear', name: 'Clear', icon: '🌤️', blurb: 'Soft light and easy air.', chill: 0 },
  sun: { key: 'sun', name: 'Sunny', icon: '☀️', blurb: 'Bright and warm. Everyone bounces a little higher.', chill: -1, sunny: true, seasonBoost: { summer: 1.3, winter: 0.7 } },
  heat: { key: 'heat', name: 'Heatwave', icon: '🥵', blurb: 'The air shimmers. Keep water close.', chill: -1, hot: true, seasonBoost: { summer: 1.4, spring: 0.2, autumn: 0, winter: 0 } },
  rain: { key: 'rain', name: 'Rain', icon: '🌧️', blurb: 'Steady rain. Puddles everywhere.', chill: 1, wet: true, seasonBoost: { spring: 1.3, autumn: 1.2, winter: 0.7 } },
  storm: { key: 'storm', name: 'Storm', icon: '⛈️', blurb: 'Thunder rolls across the Hollow.', chill: 2, wet: true, storm: true, seasonBoost: { summer: 1.2, autumn: 0.9, winter: 0.4 } },
  snow: { key: 'snow', name: 'Snow', icon: '🌨️', blurb: 'Snow settles over everything.', chill: 2, wet: true, seasonBoost: { winter: 2.2, autumn: 0.7, spring: 0.35, summer: 0.12 } },
  frost: { key: 'frost', name: 'Frost', icon: '❄️', blurb: 'A brittle, glittering cold.', chill: 2, seasonBoost: { winter: 1.6, autumn: 0.8, spring: 0.4, summer: 0 } },
  fog: { key: 'fog', name: 'Fog', icon: '🌫️', blurb: 'The hills have gone soft and grey.', chill: 1, seasonBoost: { autumn: 1.3 } },
  petals: { key: 'petals', name: 'Petals', icon: '🌸', blurb: 'Blossom on the wind.', chill: 0 },
  leaves: { key: 'leaves', name: 'Leaves', icon: '🍂', blurb: 'Leaves skitter over the grass.', chill: 1 },
  breeze: { key: 'breeze', name: 'Breeze', icon: '🍃', blurb: 'A light wind, good for daydreaming.', chill: 0 },
  drizzle: { key: 'drizzle', name: 'Drizzle', icon: '🌦️', blurb: 'Fine rain that softens every edge.', chill: 1, wet: true, seasonBoost: { spring: 1.3, autumn: 1.1, winter: 0.6 } },
  hail: { key: 'hail', name: 'Hail', icon: '🧊', blurb: 'Small ice stones tap against the roofs.', chill: 2, wet: true, storm: true, seasonBoost: { winter: 1.8, spring: 0.8, autumn: 0.5, summer: 0.1 } },
  sandstorm: { key: 'sandstorm', name: 'Sandstorm', icon: '🌪️', blurb: 'A dry wind carries the desert with it.', chill: 0, hot: true, dusty: true, seasonBoost: { summer: 1.8, spring: 0.6, autumn: 0.3, winter: 0 } },
  mist: { key: 'mist', name: 'Mist', icon: '🌁', blurb: 'A soft grey veil hangs over the ground.', chill: 1, seasonBoost: { autumn: 1.5, spring: 0.9 } },
  aurora: { key: 'aurora', name: 'Aurora', icon: '🌌', blurb: 'Ribbons of light move above the cold horizon.', chill: 1, celestial: true, seasonBoost: { winter: 1.8, autumn: 0.6, spring: 0.3, summer: 0.1 } },
  ashfall: { key: 'ashfall', name: 'Ashfall', icon: '🌫️', blurb: 'Warm grey flakes drift down from a distant peak.', chill: 1, hot: true, dusty: true, seasonBoost: { summer: 1.2, spring: 0.7 } },
  fireflies: { key: 'fireflies', name: 'Fireflies', icon: '🪲', blurb: 'Tiny lights blink on and off in the warm dark.', chill: 0, seasonBoost: { summer: 1.7, spring: 0.7 } },
  meteor: { key: 'meteor', name: 'Meteor Shower', icon: '☄️', blurb: 'Quick silver streaks cross a clear night sky.', chill: 0, celestial: true, seasonBoost: { summer: 1.2, winter: 0.8 } },
  sunshower: { key: 'sunshower', name: 'Sunshower', icon: '🌦️', blurb: 'Warm rain falls through bright sun, and a low rainbow hangs over the path.', chill: 0, wet: true, sunny: true, rainbow: true, seasonBoost: { spring: 1.5, summer: 1.3, autumn: 0.6, winter: 0.1 } },
  thundersnow: { key: 'thundersnow', name: 'Thundersnow', icon: '🌨️', blurb: 'Snow comes down while thunder rolls somewhere behind the white.', chill: 2, wet: true, storm: true, seasonBoost: { winter: 2, autumn: 0.5, spring: 0.2, summer: 0 } },
  blossomwind: { key: 'blossomwind', name: 'Blossom Wind', icon: '🌸', blurb: 'Petals and warm air race each other across the Hollow.', chill: 0, seasonBoost: { spring: 2, summer: 0.8, autumn: 0.2, winter: 0 } },
  starfall: { key: 'starfall', name: 'Starfall', icon: '🌠', blurb: 'Stars loosen from the sky and drift down in slow silver threads.', chill: 0, celestial: true, seasonBoost: { summer: 1.5, autumn: 1.3, winter: 0.7, spring: 0.4 } },
  /* Event weather: chosen by hand or by an event preset, never by Auto, so an
     ordinary day keeps the character of its season. */
  rainbow: { key: 'rainbow', name: 'Rainbow', icon: '🌈', blurb: 'A bright arch after the rain. Petals and butterflies ride the light.', chill: 0, rainbow: true },
  celestial: { key: 'celestial', name: 'Celestial', icon: '✨', blurb: 'Stars lean close and the moon lays a pale path across the Hollow.', chill: 0, celestial: true },
  genesis: { key: 'genesis', name: 'Genesis', icon: '🌱', blurb: 'First light on new ground — the Hollow remembers how to begin.', chill: 0, genesis: true },
};
const WEATHER_KEYS = Object.keys(WEATHERS);

/* Event presets: one press sets the sky, the stage tint and the badge that
   names the moment. They only use the three event skies, so an ordinary day
   never picks one by itself. Keys stay stable so saved badges keep resolving.
   A preset's name is the moment's own name, which is not always its badge:
   Starlight Vigil is kept under the Celestial badge and First Light under the
   Genesis badge. Those names are product decisions the table records, not a
   typo, so nothing should "fix" them to match their badges again. */
const EVENT_PRESETS = {
  prismatic: {
    key: 'prismatic', name: 'Prismatic Procession', icon: '🌈', badge: 'Prismatic',
    weather: 'rainbow', tint: '#ff9ec7', tint2: '#5ad6ff',
    blurb: 'A rainbow arch, petals on the wind, and butterflies over every biome.',
    mote: '🌸',
    vigilBlurb: 'Petals ride the arch tonight. Tap each one while it glows, and the procession keeps its light.',
  },
  starlight: {
    key: 'starlight', name: 'Starlight Vigil', icon: '✨', badge: 'Celestial',
    weather: 'celestial', tint: '#8fb6ff', tint2: '#b69cff',
    blurb: 'Stars lean close and moonbeams pool across the Hollow.',
    mote: '✨',
    vigilBlurb: 'Stars lean close for the vigil. Tap each mote of starlight while it glows to keep it.',
  },
  firstlight: {
    key: 'firstlight', name: 'First Light', icon: '🌱', badge: 'Genesis',
    weather: 'genesis', tint: '#8fe07a', tint2: '#ffd166',
    blurb: 'New ground, fresh sprouts, and light that has never been used.',
    mote: '🌱',
    vigilBlurb: 'New sprouts break the first light. Tap each one as it surfaces.',
  },
};
const EVENT_PRESET_KEYS = Object.keys(EVENT_PRESETS);

/* A preset is a sky and a keepsake until it is played. The vigil is that play:
   a short tap game where the live event's own motes surface, and reaching the
   target keeps the badge for the day. One duration and one target for every
   event, so a new preset only has to name what its vigil catches. */
const EVENT_VIGIL = Object.freeze({ duration: 30, target: 18 });

/* ---------- names ---------- */
const NAME_START = {
  ember: ['Cind', 'Ash', 'Pyro', 'Sol', 'Kin', 'Brim', 'Torch', 'Embi'],
  tide: ['Miri', 'Tib', 'Cor', 'Nori', 'Lumi', 'Brin', 'Rill', 'Puddle'],
  gale: ['Zeph', 'Wisp', 'Aer', 'Flo', 'Sky', 'Gust', 'Cloud', 'Bree'],
  bloom: ['Bud', 'Moss', 'Fern', 'Pip', 'Bloom', 'Clov', 'Sprout', 'Hazel'],
  volt: ['Zap', 'Volt', 'Spark', 'Jolt', 'Buzz', 'Fizz', 'Zig', 'Amp'],
  frost: ['Niv', 'Glint', 'Yuki', 'Chill', 'Frost', 'Sleet', 'Snow', 'Brum'],
  dusk: ['Noct', 'Vex', 'Murk', 'Umbra', 'Dre', 'Shade', 'Moth', 'Sable'],
  radiant: ['Lux', 'Sola', 'Glim', 'Aura', 'Radi', 'Halo', 'Dawn', 'Bask'],
  demon: ['Imp', 'Mal', 'Hex', 'Vex', 'Ash', 'Grim', 'Brim', 'Tart'],
  angel: ['Ser', 'Fae', 'Chor', 'Halo', 'Glor', 'Ami', 'Ely', 'Pal'],
  air: ['Zeph', 'Sky', 'Bree', 'Gust', 'Aer', 'Flo', 'Wisp', 'Cirr'],
  water: ['Aqua', 'Rill', 'Wave', 'Miri', 'Brin', 'Lumi', 'Tidal', 'Puddle'],
  earth: ['Terr', 'Cob', 'Clay', 'Dune', 'Loam', 'Peb', 'Moss', 'Grot'],
  honey: ['Buz', 'Hive', 'Mel', 'Comb', 'Swe', 'Nect', 'Gol', 'Sticky'],
  pond: ['Lily', 'Pad', 'Fen', 'Reed', 'Frog', 'Pon', 'Mire', 'Duck'],
  hero: ['Ace', 'Cap', 'Val', 'Zap', 'Bolt', 'Star', 'Max', 'Jus'],
  ants: ['Ant', 'Pip', 'Crum', 'Tiny', 'Colo', 'Six', 'March', 'Nib'],
  fire: ['Flam', 'Pyro', 'Kin', 'Blaz', 'Cind', 'Torch', 'Sear', 'Flick'],
  splash: ['Splo', 'Drip', 'Pudd', 'Bub', 'Rain', 'Mis', 'Wake', 'Plo'],
  slime: ['Glo', 'Goo', 'Squish', 'Wobb', 'Slur', 'Jel', 'Blor', 'Ooze'],
  rock: ['Boul', 'Gran', 'Cragg', 'Peb', 'Flint', 'Slab', 'Roc', 'Nub'],
  stone: ['Rune', 'Carve', 'Old', 'Mono', 'Cairn', 'Stel', 'Relic', 'Grave'],
  bug: ['Bugg', 'Leaf', 'Lad', 'Spot', 'Chir', 'Weev', 'Moth', 'Beet'],
  bunny: ['Hop', 'Cot', 'Bun', 'Clov', 'Thump', 'Mallow', 'Fluff', 'Ear'],
  cloud: ['Cumu', 'Mist', 'Nimb', 'Puff', 'Haze', 'Cirr', 'Driz', 'Fluff'],
  crystal: ['Geod', 'Facet', 'Shim', 'Quart', 'Prism', 'Glint', 'Spark', 'Cut'],
  mushroom: ['Shroom', 'Cap', 'Spore', 'Myc', 'Toad', 'Fung', 'Moss', 'Umbra'],
  candy: ['Gum', 'Sweet', 'Lolli', 'Sugar', 'Taffy', 'Mint', 'Wrapp', 'Jell'],
  wolf: ['Lup', 'Fen', 'Howl', 'Grey', 'Fang', 'Moon', 'Prowl', 'Wol'],
  tiger: ['Tig', 'Strip', 'Raja', 'Claw', 'Amber', 'Paw', 'Beng', 'Saber'],
  bear: ['Brun', 'Honey', 'Grizz', 'Mish', 'Cub', 'Bear', 'Bramble', 'Urs'],
  frog: ['Frog', 'Rib', 'Pond', 'Lily', 'Croak', 'Bog', 'Hop', 'Tad'],
  pig: ['Pig', 'Snout', 'Truff', 'Oink', 'Trot', 'Mud', 'Curly', 'Ham'],
  cat: ['Kit', 'Mew', 'Purr', 'Tab', 'Whisk', 'Claw', 'Mog', 'Nyan'],
  cow: ['Moo', 'Daisy', 'Clov', 'Butter', 'Herd', 'Milk', 'Bess', 'Cow'],
  fish: ['Fin', 'Bub', 'Coral', 'Scale', 'Gill', 'Splash', 'Marlin', 'Koi'],
  bat: ['Bat', 'Echo', 'Ves', 'Night', 'Fang', 'Flit', 'Squeak', 'Noct'],
  butterfly: ['Flutter', 'Marip', 'Wing', 'Pollen', 'Morpho', 'Flit', 'Silk', 'Bloom'],
  pillow: ['Pill', 'Plush', 'Fluff', 'Snooze', 'Doz', 'Dream', 'Cloud', 'Soft'],
  dreameater: ['Morphe', 'Nox', 'Dream', 'Lull', 'Eater', 'Night', 'Void', 'Somnia'],
  lucky: ['Luck', 'Clover', 'Fortune', 'Charm', 'Jack', 'Pot', 'Gold', 'Penny'],
  banana: ['Ban', 'Peel', 'Nana', 'Yellow', 'Chiq', 'Mush', 'Sun', 'Bunch'],
  apple: ['App', 'Pom', 'Crisp', 'Orch', 'Red', 'Cider', 'Seed', 'Fuji'],
  ice: ['Ice', 'Frost', 'Glac', 'Sleet', 'Chill', 'Berg', 'Cube', 'Rime'],
  cherry: ['Cher', 'Berry', 'Pit', 'Bloss', 'Ruby', 'Stem', 'Tart', 'Duo'],
  cocoa: ['Coco', 'Marsh', 'Mug', 'Steam', 'Choc', 'Warm', 'Cup', 'Sip'],
  pizza: ['Piz', 'Slice', 'Dough', 'Cheese', 'Pepp', 'Crust', 'Sauce', 'Oven'],
  fishy: ['Fishy', 'Fin', 'Bub', 'Gill'],
  striker: ['Strik', 'Goal', 'Boot', 'Kick'],
  aura: ['Aur', 'Glow', 'Halo', 'Lumi'],
  six: ['Six', 'Hex', 'Sixth', 'Sext'],
  seven: ['Sev', 'Hept', 'Lucky', 'Seven'],
  king: ['King', 'Regal', 'Roy', 'Crown'],
  queen: ['Queen', 'Regi', 'Roy', 'Jewel'],
  ghost: ['Boo', 'Phan', 'Spook', 'Wisp'],
  skull: ['Skull', 'Bone', 'Cran', 'Osse'],
  death: ['Mort', 'Grim', 'Than', 'End'],
  lootllama: ['Loot', 'Llam', 'Piña', 'Hoard'],
  duck: ['Quack', 'Bill', 'Waddle', 'Pond'],
  peely: ['Peel', 'Nana', 'Ban', 'Chiq'],
  dream: ['Dream', 'Somn', 'Lull', 'Reve'],
  zeropoint: ['Zero', 'Void', 'Null', 'Point'],
  punk: ['Punk', 'Riot', 'Anar', 'Spike'],
  batman: ['Bat', 'Night', 'Cowl', 'Goth'],
  superman: ['Sup', 'Steel', 'Krypt', 'Hero'],
  ironmouse: ['Iron', 'Mouse', 'Squeak', 'Chu'],
  bullet: ['Bull', 'Rico', 'Trigger', 'Zing'],
  burntpb: ['Burnt', 'Toast', 'Crisp', 'Smok'],
  headshot: ['Head', 'Scope', 'Aim', 'Bull'],
  cube: ['Cube', 'Block', 'Vox', 'Box'],
  bombjr: ['Bomb', 'Fuse', 'Boom', 'Spark'],
  grim: ['Grim', 'Reap', 'Scythe', 'Hollow'],
  squibbly: ['Squib', 'Tree', 'Willow', 'Leaf'],
  onewish: ['Wish', 'Willow', 'Hope', 'Star'],
  klombo: ['Klom', 'Rex', 'Stomp', 'Dino'],
  crown: ['Crown', 'Regal', 'Jewel', 'Sovereign'],
  spookydash: ['Spook', 'Dash', 'Zoom', 'Boo'],
  jazz: ['Jazz', 'Hare', 'Hop', 'Rabbit'],
  crash: ['Crash', 'Band', 'Spin', 'Coot'],
  blinky: ['Blink', 'Ghost', 'Boo', 'Flicker'],
  deer: ['Deer', 'Fawn', 'Antler', 'Stag'],
  sonic: ['Sonic', 'Dash', 'Zoom', 'Blue'],
  honeypot: ['Honey', 'Pot', 'Drip', 'Bee'],
  dumpster: ['Dump', 'Trash', 'Rascal', 'Scav'],
  tails: ['Tails', 'Fox', 'Twin', 'Kit'],
  shadow: ['Shad', 'Dark', 'Chaos', 'Edge'],
  killswitch: ['Kill', 'Switch', 'Dead', 'Aim'],
  morgana: ['Morg', 'Panther', 'Hex', 'Cat'],
  vampire: ['Vamp', 'Bat', 'Fang', 'Count'],
  onigiri: ['Oni', 'Rice', 'Nori', 'Ball'],
  bushranger: ['Bush', 'Ranger', 'Fern', 'Scout'],
  jonesy: ['Jones', 'Default', 'Cap', 'Buddy'],
  blaster: ['Blast', 'Pixel', 'Byte', 'Chip'],
  adventure: ['Advent', 'Compass', 'Trail', 'Quest'],
  stormscout: ['Storm', 'Scout', 'Cyclone', 'Gale'],
  overshield: ['Shield', 'Aegis', 'Guard', 'Bastion'],
  megaman: ['Mega', 'Buster', 'Blue', 'Bolt'],
  birthday: ['Birth', 'Party', 'Cake', 'Candle'],
  meowscles: ['Meow', 'Flex', 'Muscle', 'Cat'],
  boss: ['Boss', 'Chief', 'Exec', 'Suit'],
  vini: ['Vini', 'Goal', 'Samba', 'Flick'],
  pollo: ['Pollo', 'Cluck', 'Comb', 'Wing'],
  wick: ['Wick', 'John', 'Baba', 'Suit'],
  pumpkin: ['Pump', 'Gourd', 'Jack', 'Squash'],
  santa: ['Sant', 'Kringle', 'Jolly', 'Nick'],
  cupid: ['Cupid', 'Arrow', 'Heart', 'Amor'],
  charm: ['Charm', 'Trinket', 'Lucky', 'Bangle'],
  zombie: ['Zom', 'Shamb', 'Moss', 'Rot', 'Stitch', 'Ghoul', 'Grave', 'Lurch'],
  undead: ['Wisp', 'Soul', 'Halo', 'Reven', 'Ether', 'Spect', 'Wraithe', 'Morrow'],
  starfish: ['Star', 'Reef', 'Coral', 'Tide', 'Five', 'Sun', 'Aster', 'Brine'],
  pika: ['Pika', 'Spark', 'Zap', 'Cheek', 'Bolt', 'Volt', 'Chu', 'Fizz'],
  unicorn: ['Uni', 'Horn', 'Mane', 'Prism', 'Glint', 'Aurora', 'Sparkle', 'Clover'],
  devil: ['Dev', 'Infer', 'Brim', 'Hex', 'Fang', 'Ember', 'Vex', 'Pact'],
  yoga: ['Zen', 'Calm', 'Lotus', 'Breath', 'Om', 'Seren', 'Still', 'Hush'],
  shark: ['Fin', 'Jaw', 'Chomp', 'Reef', 'Gill', 'Tide', 'Bite', 'Mako'],
  whitewhale: ['Moby', 'Pale', 'Song', 'Whale', 'Deep', 'Frost', 'Pearl', 'Hymn'],
  dragon: ['Drak', 'Ember', 'Wyrm', 'Scale', 'Fang', 'Cinder', 'Jade', 'Roar'],
  darkjoker: ['Jest', 'Joker', 'Wild', 'Trick', 'Grin', 'Card', 'Ruse', 'Mirth'],
  jackskull: ['Jack', 'Skull', 'Bone', 'Pump', 'Hollow', 'Rattle', 'Grin', 'Noct'],
  sally: ['Sall', 'Stitch', 'Rag', 'Button', 'Thread', 'Patch', 'Seam', 'Mend'],
  keke: ['Keke', 'Glitz', 'Bow', 'Star', 'Fifi', 'Lulu', 'Blink', 'Pose'],
  bestie: ['Best', 'Buddy', 'Pals', 'Heart', 'Sunny', 'Biff', 'Honey', 'Squad'],
  dog: ['Pup', 'Bark', 'Wag', 'Fetch', 'Biscuit', 'Ruff', 'Mutt', 'Paw'],
  karen: ['Karen', 'Bob', 'Mana', 'Karen', 'Chat', 'Receipt', 'Karen', 'Perm'],
  motherearth: ['Gaia', 'Terra', 'Moth', 'Verd', 'Bloom', 'Earthy', 'Moss', 'Harvest'],
  werewolf: ['Fang', 'Luna', 'Howl', 'Shag', 'Moon', 'Growl', 'Claw', 'Bramble'],
  normal: ['Norm', 'Norma', 'Plain', 'Average', 'Standard', 'Mild', 'Basic', 'Ordinary'],
  gummybear: ['Gum', 'Gummy', 'Jelly', 'Wobble', 'Sugar', 'Bounce', 'Berry', 'Squish'],
  muddy: ['Mud', 'Muck', 'Silt', 'Puddle', 'Bog', 'Clay', 'Marsh', 'Gloop'],
  spot: ['Spot', 'Dot', 'Patch', 'Freckle', 'Pip', 'Mottle', 'Speck', 'Blot'],
  frozen: ['Froze', 'Chill', 'Ice', 'Brumal', 'Shiver', 'Rime', 'Glac', 'Frost'],
  sixtyseven: ['Six', 'Seven', 'Score', 'Jersey', 'Arcade', 'Clutch', 'Sixty', 'Buzzer'],
  creeper: ['Cree', 'Hiss', 'Fuse', 'Boom', 'Moss', 'Brick', 'Blast', 'Snap'],
  lion: ['Leo', 'Mane', 'Sun', 'Roar', 'Gold', 'Cub', 'Pride', 'Lio'],
  panda: ['Pan', 'Bam', 'Boo', 'Mochi', 'Panda', 'Bamboo', 'Snow', 'Chub'],
  penguin: ['Pen', 'Wad', 'Tux', 'Ice', 'Pip', 'Flipper', 'Snow', 'Bumble'],
  owl: ['Ow', 'Hoot', 'Moon', 'Sage', 'Night', 'Feather', 'Who', 'Glide'],
  snake: ['Sly', 'Sss', 'Cob', 'Viper', 'Noodle', 'Moss', 'Fang', 'Coil'],
  spider: ['Web', 'Spin', 'Silk', 'Dot', 'Legs', 'Weave', 'Fuzz', 'Arach'],
  crab: ['Crab', 'Pinch', 'Snip', 'Coral', 'Rock', 'Scut', 'Claw', 'Tide'],
  dolphin: ['Dol', 'Fin', 'Echo', 'Splash', 'Wave', 'Click', 'Blue', 'Pod'],
  sheep: ['Wool', 'Baa', 'Lamb', 'Fluff', 'Cloud', 'Meri', 'Snug', 'Ewe'],
  bull: ['Taur', 'Brun', 'Bul', 'Horn', 'Rus', 'Doz', 'Bram', 'Ox'],
  bossbaby: ['Boss', 'Exec', 'Suit', 'Mini', 'Vee', 'Chief', 'Ty', 'Corp'],
  hero6: ['Hex', 'Six', 'Ace', 'Nova', 'Val', 'Ultra', 'Star', 'Max'],
  snow: ['Snow', 'Flake', 'Frost', 'Niv', 'Puff', 'Drift', 'Chill', 'White'],
};
const NAME_END = ['a', 'o', 'y', 'ix', 'ling', 'bit', 'kin', 'puff', 'mochi', 'bean', 'wee', 'zy'];

function makeName(element) {
  const starts = NAME_START[element] || NAME_START.bloom;
  const s = starts[Math.floor(Math.random() * starts.length)];
  const e = NAME_END[Math.floor(Math.random() * NAME_END.length)];
  return `${s}${e}`;
}

const ALL_ELEMENTS = ELEMENT_KEYS;
