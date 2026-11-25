/* A tiny personality engine so every sprite can talk back. */

const CHAT_QUICK = [
  'How are you?',
  'I love you',
  'Tell me a joke',
  'What should we do?',
  'Are you hungry?',
  'You look cute',
  'Tell me a story',
  'What do you dream about?',
  'Sing me something',
  'What is your favourite food?',
  'What do you need?',
  'Favourite toy?',
  'Boop',
  'Any world days today?',
  'What is your favourite game?',
  'Do you have a story for me?',
  'Happy holidays!',
  'Are you cozy?',
];

/* One flavour line per element, so a splice or a rare species has its own
   voice even when the personality bank runs dry. */
const ELEMENT_CHATTER = {
  bloom: 'I keep finding petals in my ears. I’m not removing them. They’re mine now.',
  ember: 'I sneezed and melted a snowman. We don’t talk about it.',
  tide: 'I hum when I’m happy. It sounds like a kettle. A nice kettle.',
  gale: 'I tried to hold a leaf. The leaf had other plans.',
  frost: 'I am not cold. Everyone else is just alarmingly warm.',
  volt: 'I static-shocked myself twice today. Both times were funny.',
  dusk: 'I like the bit of the evening when everything goes quiet and purple.',
  radiant: 'I was told I glow. I’ve decided to believe it.',
};

function elementChatter(s) {
  const el = s && s.element;
  if (!el) return '';
  if (ELEMENT_CHATTER[el]) return ELEMENT_CHATTER[el];
  const base = ELEMENTS[el]?.geneBase;
  if (base && ELEMENT_CHATTER[base]) return ELEMENT_CHATTER[base];
  return '';
}

function nameOf(s) { return displayName(s); }

function personalityName(s) {
  return PERSONALITIES[s.personality]?.name || 'Sunny';
}

const PERSONA_TONE = {
  sunny: {
    joke: ['Why did the sprite bring a ladder to the meadow? To reach the high notes!', 'What do you call a sleepy Ember? A smoulder!', 'I told my shadow a joke and it cracked up. Get it? Cracked?'],
    end: ['Come back soon, okay?', 'I’ll be right here being happy!'],
  },
  grump: {
    joke: ['My joke is that I’m awake. Hilarious, right?', 'Why did the Grump cross the meadow? To avoid talking to you. …That was a joke. Mostly.', 'Knock knock. No. Go away. …Okay, come back.'],
    end: ['Leave. …Actually, stay a bit. Only a bit.', 'Bye. I’m not watching you leave. I absolutely am.'],
  },
  shy: {
    joke: ['I know a joke but I might say it wrong… Why did the Sprig stay in the shade? Because it was a little… shy-dy? …I’ll stop.', 'Knock knock. Who’s there? …I forgot. Sorry.', 'I had a joke and then I saw you and it left.'],
    end: ['Come back when you can… please.', 'I’ll be here. Quietly.'],
  },
  bold: {
    joke: ['I’m not funny, I’m cool. But here goes: why did the Volt cross the road? Because it was a live wire!', 'What’s a bold sprite’s favourite snack? Anything it can steal from a bigger sprite.', 'My jokes are dangerous. You’re welcome.'],
    end: ['Don’t wander off too far! Or do — I’ll find you.', 'Adventure waits for neither of us!'],
  },
  goofy: {
    joke: ['What do you call a Blob who does math? A calc-y-lump!', 'I tried to tell my shadow a joke but it just nodded. Rude.', 'Why did the Gale get kicked out of the library? Too much wind-bending. …Bending. I’ll see myself out.'],
    end: ['Bye! Don’t step on any bees! Unless they’re nice!', 'I’ll be doing goofy things. Come join!'],
  },
  dreamy: {
    joke: ['A dream told me a joke. I forgot the joke but the feeling was hilarious.', 'What does a Wisp eat for breakfast? Nothing. It just watches the sun and feels things.', 'I know a joke. It’s in a cloud. I’ll remember it when it rains.'],
    end: ['Float gently. Come back soon.', 'I’ll be here, half in a cloud.'],
  },
  sassy: {
    joke: ['Why did the Tide sprite break up with the shore? It needed space. Too much space. It was a whole thing.', 'My mirror told me a joke. It was actually about you.', 'I only tell jokes that make me look good, so: why are you so lucky? Because you know me.'],
    end: ['Go on, go. I’ll be here being the best one.', 'Bye, favourite. Try not to miss me too much.'],
  },
};

/* ---------------- Sprite Hollow voices ----------------
   The eight role voices in data-personality.js own greet, idle, friend and best,
   and their context table owns being helped, gifted, ignored, festival and
   weather. The old tone banks only answer beats the voices do not cover
   (jokes, goodbyes), so a puffle speaks in its own voice rather than a tone. */
const VOICE_BEATS = { greet: 'greet', love: 'best', agree: 'friend' };

/* Asks the puffle's role voice for its own line. */
function spriteVoiceBeat(s, beat) {
  if (typeof window.puffleVoiceLine !== 'function') return null;
  try { return window.puffleVoiceLine(s, beat); } catch (e) { return null; }
}

function voiceContext(s, kind) {
  if (typeof window.contextVoiceLine !== 'function') return null;
  try { return window.contextVoiceLine(kind, (s && (s.id || s.element)) || 'puffle'); } catch (e) { return null; }
}

const EMPTY_VOICE_STATE = Object.freeze({ at: 0, giftAt: 0, quests: 0, topic: null, topicAt: 0 });

function puffleVoiceState(s) {
  if (!s.voice || typeof s.voice !== 'object') s.voice = { ...EMPTY_VOICE_STATE };
  return s.voice;
}

/* The last thing this puffle was actually asked about, so the next hello can
   pick the conversation back up instead of starting from nothing. */
function chatTopicOf(text) {
  const t = String(text || '').toLowerCase();
  if (/\b(who('s| is) your (best )?friend|your friends?|who do you (like|hang out with))\b/.test(t)) return 'friends';
  if (/\b(foods?|snacks?|eat|hungry|berries|berry|feed)\b/.test(t)) return 'food';
  if (/\b(games?|play|fun|toys?)\b/.test(t)) return 'play';
  if (/\b(sleep|naps?|tired|bed)\b/.test(t)) return 'sleep';
  if (/\b(baths?|clean|wash|dirty)\b/.test(t)) return 'bath';
  if (/\b(how are you|feel|mood|sad|happy)\b/.test(t)) return 'feelings';
  if (/\b(quest|doing|story)\b/.test(t)) return 'quest';
  if (/\b(egg|baby|family|merge|hatch)\b/.test(t)) return 'family';
  return null;
}

const TOPIC_CALLBACKS = Object.freeze({
  food: ['Earlier you asked about snacks. I have thought about little else since.', 'You asked what I like to eat. I have been hungry ever since. Coincidence?'],
  play: ['We talked about games earlier. I have been practising. Quietly. In secret.'],
  sleep: ['You asked about naps earlier. I took one. It was magnificent.'],
  bath: ['After we talked about baths, I found three more puddles. Impressive, honestly.'],
  feelings: ['You asked how I was doing. I am still good. Better now, actually.'],
  quest: ['You asked what I was doing. Still on it. Very heroically.'],
  family: ['You asked about eggs and family. I have been thinking about tiny feet.'],
  friends: ['You asked about my friends. I have been making a list. You are on it.'],
});

function topicCallbackLine(topic, at) {
  const bank = topic && TOPIC_CALLBACKS[topic];
  if (!Array.isArray(bank) || !at) return '';
  if (Date.now() - Number(at) > 48 * 60 * 60 * 1000) return '';
  return one(bank);
}

/* Which voices have spoken to the keeper, so the wiki's voice guide can show
   the eight voices as a collection of their own. */
function recordVoiceHeard(s) {
  const voice = typeof window.puffleVoiceOf === 'function' ? window.puffleVoiceOf(s) : null;
  const key = voice && voice.key;
  if (!key || typeof state === 'undefined' || !state.stats) return;
  if (!state.stats.voiceHeard || typeof state.stats.voiceHeard !== 'object') state.stats.voiceHeard = {};
  if (state.stats.voiceHeard[key]) return;
  state.stats.voiceHeard[key] = Date.now();
  if (typeof commit === 'function') commit('voice-heard');
  else if (typeof saveState === 'function') saveState();
}

/* Every claimed quest step, across every region. A three-step line counts one
   per step here, so helping with a single step is worth a thank-you even when
   the chain is far from finished (stats.quests only counts finished lines). */
function questStepsDone() {
  const map = (typeof state !== 'undefined' && state.biomeQuests) || {};
  let total = 0;
  Object.keys(map).forEach((key) => {
    const q = map[key];
    if (!q || typeof q !== 'object') return;
    total += Math.max(0, Number(q.step) || 0);
  });
  return total;
}

/* A holiday runs for weeks, so its greeting is for the first day only — after
   that it surfaces now and then instead of on every hello. */
function festivalStartsToday(festival) {
  const start = festival && Array.isArray(festival.start) ? festival.start : null;
  if (!start) return false;
  const now = new Date();
  return start[0] === now.getMonth() && start[1] === now.getDate();
}

/* What has happened since this puffle last heard from you: a finished quest
   counts as being helped, a claimed gift as being gifted, a long silence as
   being ignored, then today's festival or the Hollow's own weather. */
function chatContextFor(s) {
  const seen = puffleVoiceState(s);
  const steps = questStepsDone();
  const away = seen.at ? Date.now() - seen.at : 0;
  /* Only the puffle that handed over the gift carries giftAt, so a gift to one
     sprite no longer makes the whole roster say thank you. */
  const gifted = (Number(seen.giftAt) || 0) > (Number(seen.at) || 0);
  const festival = typeof observancesForDate === 'function' ? observancesForDate()[0] : null;
  const weather = (typeof state !== 'undefined' && state.world) ? state.world.weather : null;
  let kind = null;
  if (steps > (Number(seen.quests) || 0)) kind = 'helped';
  else if (gifted) kind = 'gifts';
  else if (seen.at && away > 3 * 60 * 60 * 1000) kind = 'ignored';
  /* A holiday lasts weeks; its line is guaranteed on the first day and only
     rolled for when nothing more specific has happened. */
  else if (festival && (festivalStartsToday(festival) || chance(0.25))) kind = 'festival';
  else if (weather === 'rain' || weather === 'storm') kind = 'rain';
  else if (weather === 'snow' || weather === 'frost') kind = 'snow';
  return { kind, steps };
}

function rememberChat(s, ctx) {
  const seen = puffleVoiceState(s);
  seen.at = Date.now();
  if (!ctx) return;
  seen.quests = ctx.steps;
  if (ctx.topic) {
    seen.topic = ctx.topic;
    seen.topicAt = Date.now();
  }
}

function weatherVoiceKind(text) {
  const t = String(text || '').toLowerCase();
  const weather = (typeof state !== 'undefined' && state.world) ? state.world.weather : null;
  if (/rain|storm|wet/.test(t) || weather === 'rain' || weather === 'storm') return 'rain';
  if (/snow|frost|winter|cold/.test(t) || weather === 'snow' || weather === 'frost') return 'snow';
  return null;
}

function storyLine(s) {
  const el = elementOf(s);
  return one([
    `Once, before the Hollow had paths, a ${el.name.toLowerCase()} sprite found a door in a tree. It opened it. Inside was another tree. I think about that a lot.`,
    `I was a very small egg in a very big nest. Then you showed up. That’s the whole story. It’s a good one.`,
    `There was a storm, and a lantern, and a stranger who turned out to be three sprites in a coat. Classic.`,
    `I once followed a beetle for a whole afternoon. It went nowhere. Best day of my life.`,
  ]);
}

function dreamLine(s) {
  return one([
    'Floating sandwiches. Always sandwiches. Sometimes a hat.',
    'I dream I’m a very large cloud and everyone naps on me.',
    'A doorway made of warm light. I never go through. I just like it.',
    'I dream in smells. Mostly honey. Some moss.',
  ]);
}

/* Voices own greeting, affection and agreement; the persona banks keep only the
   beats a role voice does not have — jokes and goodbyes. */
function toneLine(s, key) {
  const beat = VOICE_BEATS[key];
  if (beat) {
    const line = spriteVoiceBeat(s, beat);
    if (line) return line;
  }
  const bank = (PERSONA_TONE[s.personality] || {})[key] || PERSONA_TONE.sunny[key];
  return Array.isArray(bank) && bank.length ? one(bank) : '…';
}

function one(arr) { return pick(arr); }

/* The favourite things this puffle actually wants, plus its lowest need, said
   plainly enough that the keeper knows exactly what to get. Shared by chat and
   the Hollow so both name the same snack and toy. */
function puffleGuideText(s) {
  if (!s || s.stage === 'egg' || !s.needs) return '';
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const snack = comforts ? comforts.food.name.toLowerCase() : 'a snack';
  const toy = comforts ? comforts.toy.name.toLowerCase() : 'a toy';
  const low = typeof Voice !== 'undefined' && Voice.lowestNeed ? Voice.lowestNeed(s) : null;
  const needWord = { hunger: 'hungry', energy: 'sleepy', joy: 'bored', clean: 'grubby' }[low && low.key] || 'cozy';
  const fix = {
    hunger: `a ${snack} would fix that`,
    energy: 'a nap would fix that',
    joy: `playing with my ${toy} would fix that`,
    clean: 'a bubble bath would fix that',
  }[low && low.key] || 'nothing needs fixing right now';
  const needSummary = low
    ? `Right now I’m ${needWord} — ${low.key} is ${Math.round(low.value)} out of 100 — so ${fix}.`
    : '';
  /* No name prefix: the puffle is speaking in its own bubble and voice, and the
     line reads the same whether it is typed in chat or said in the Hollow. */
  return `“My favourite snack is ${snack} and my favourite toy is the ${toy}. ${needSummary}”`.replace(/\s+/g, ' ').trim();
}

function needsNote(s) {
  const n = s.needs;
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const snack = comforts ? comforts.food.name.toLowerCase() : 'a berry';
  if (n.hunger < 22) return one([
    `Also, I am approximately one hundred percent empty. ${snack[0].toUpperCase()}${snack.slice(1)}?`,
    `My tummy is making whale noises. A ${snack} would help a sprite out?`,
    `I’m not saying I’m starving, but a ${snack} would be very appreciated.`,
  ]);
  if (n.energy < 22) return one([
    'Also my eyelids are doing the slow blink. Nap soon?',
    'I’m so sleepy I just yawned in my own mouth.',
  ]);
  if (n.clean < 22) return one([
    'Also, I found dirt. Then I became the dirt. Bath?',
    'I may be a little stinky. Please do the bubbles.',
  ]);
  if (n.joy < 22) return one([
    'Also I’m feeling a bit flat. Can we play something?',
    'I need a little fun. A tiny fun. A snack-sized fun.',
  ]);
  return '';
}

function jokeFor(s) {
  return toneLine(s, 'joke');
}

function chatReply(s, text) {
  const t = String(text || '').toLowerCase().trim();
  const el = elementOf(s);
  const mood = moodOf(s);
  const name = nameOf(s);
  const hungry = s.needs.hunger < 30;
  const sleepy = s.needs.energy < 25;
  const grubby = s.needs.clean < 25;
  const sad = s.needs.joy < 25;
  const note = needsNote(s);
  /* The sheet names this puffle's own comforts, so chat has to answer with them
     instead of the element's generic taste or the player's starred game. */
  const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
  const favFood = comforts ? comforts.food.name : el.likes;
  /* Snapshot the context before this reply counts as having heard from you. */
  const voiceCtx = chatContextFor(s);
  rememberChat(s, { ...voiceCtx, topic: chatTopicOf(t) });
  recordVoiceHeard(s);

  if (!t) return one(['…You okay? You opened your mouth and nothing came out.', 'I’m listening. Mostly.']);

  if (/\b(joke|funny|make me laugh)\b/.test(t)) {
    return jokeFor(s) + (note && chance(0.4) ? ` ${note}` : '');
  }
  if (/\b(i love you|love you|ily|love ya)\b/.test(t)) {
    addBondOnChat(s);
    const tier = typeof relationshipTierFor === 'function' ? relationshipTierFor(s.bond) : null;
    const warm = tier && (tier.key === 'partner' || tier.key === 'family') ? ` ${tier.line}` : '';
    return toneLine(s, 'love') + warm + (s.bond > 75 ? ' I mean it.' : '');
  }
  if (/\b(hungry|starving|foods?|eat|snacks?|berries|berry|feed)\b/.test(t)) {
    if (/\b(favourite|favorite|best)\b/.test(t)) return `That’s easy: ${favFood}. If you ever want to be my favourite person forever, that’s the currency.`;
    if (hungry) return one([
      `YES. Please. Anything. A berry, a cloud, a nice rock. I’m not picky.`,
      `I’m so hungry I could eat a whole sunbeam. Do you have ${favFood}?`,
      `Finally someone noticed! ${favFood}, please and thank you.`,
    ]);
    if (s.needs.hunger > 90) return one(['I’m stuffed. I couldn’t eat another bite. Ask me again in a bit.']);
    return one([
      `I could nibble something. ${favFood} are my favourite.`,
      `Not starving, but I never say no to a snack.`,
      `Treats? For me? You shouldn’t have. You absolutely should have.`,
    ]);
  }
  if (/\b(sleep|nap|tired|sleepy|bed)\b/.test(t)) {
    if (s.asleep) return 'Zzz… …huh? Sorry, I was in the middle of a really good dream.';
    if (sleepy) return one(['A nap would be perfect right now. Wake me in a bit?', 'My eyes are closing on their own. Tuck me in?']);
    return one(['I’m not sleepy. …Okay, maybe a tiny nap.', 'I could curl up for a bit. Only if you stay close.']);
  }
  if (/\b(bath|clean|wash|dirty|smell|stink|bubble)\b/.test(t)) {
    if (grubby) return one(['Yes. Please. The bubbles. I’ll be so shiny after.', 'I may have rolled in something. I regret nothing. But yes, bath.']);
    return one(['A bath? I’m already basically a masterpiece.', 'Bubbles are my favourite shape.']);
  }
  /* The direct question gets the whole answer: favourite snack, favourite toy
     and the need that actually wants fixing, with its number. */
  if (/\b(what do you need|what do you want|what should i (get|give|feed|buy)|how can i help|how do i help|what('s| is) wrong|favourite snack|favorite snack)\b/.test(t)) {
    return puffleGuideText(s);
  }
  if (/\b(toy|toys|plaything)\b/.test(t)) {
    return comforts
      ? one([`${comforts.toy.name}. Obviously. ${comforts.toy.icon} I would not trade it for a hundred snacks. Maybe twenty.`, `My ${comforts.toy.name.toLowerCase()}! It goes everywhere with me.`])
      : one(['Anything I can bat across the floor counts.']);
  }
  if (/\b(play|game|fun|activity|catch|pulse|copycat)\b/.test(t)) {
    /* The play branch catches the word "game" first, so the favourite question
       is answered here rather than in the branch further down. */
    if (/\b(favou?rite|best|which)\b/.test(t) && comforts) {
      return one([`${comforts.game.name}. ${comforts.game.icon} I am unbeaten, mostly because nobody else plays it.`, `That would be ${comforts.game.name}. Ask me again and I will say the same thing.`]);
    }
    if (sad || sleepy) return sleepy
      ? 'I’m too sleepy for games. Rain check? …Or a nap game. I win those.'
      : one(['I’d love to. My fun tank is a little low, so yes. Please.', 'A game would fix me. Probably literally.']);
    if (comforts) return one([`Yes! ${comforts.game.name}. ${comforts.game.icon} I’m incredible at it. Mostly.`, `I only really play ${comforts.game.name}, but I play it a lot.`, `Games? For me? Let’s go!`]);
    return one(['Yes! The Treat Catch one. I’m incredible at catching. Mostly with my face.', 'I’m so ready. Do the pulse one, I have excellent timing. Allegedly.', 'Games? For me? Let’s go!']);
  }
  if (/\b(merge|egg|baby|family|parents|breed|hatch)\b/.test(t)) {
    return one([
      `You mean making a new little egg friend? I’m a little nervous. A good nervous.`,
      `I was an egg once. Now I’m this. Glow-up, honestly.`,
      `If our baby gets my good looks and your patience, they’ll be unstoppable.`,
    ]);
  }
  if (/\b(favou?rite game|best game|which game)\b/.test(t)) {
    const favs = typeof favoriteGames === 'function' ? favoriteGames() : [];
    const star = favs.length && typeof GAME_INFO !== 'undefined' ? GAME_INFO[favs[favs.length - 1]] : null;
    return star
      ? `You starred ${star.title}. I have been telling everyone, whether or not they asked.`
      : 'You have not starred one yet. Tap the little star in a game and I will have an official favourite.';
  }
  if (/\b(holiday|festival|world day|national day|celebrat)\b/.test(t)) {
    const day = typeof observancesForDate === 'function' ? observancesForDate()[0] : null;
    if (day) return `${day.icon} ${day.name}${day.region ? ` — ${day.region}` : ''}. ${day.blurb}`;
    return 'No world day today. The Hollow still finds reasons to celebrate, mostly snacks.';
  }
  if (/\b(how are you|how you doing|you okay|feeling|mood)\b/.test(t)) {
    const lines = {
      pampered: [`Pampered. Suspiciously pampered. Do not stop.`, `Every need full and a warm blanket. I am basically royalty now.`],
      giddy: [`Giddy! My joy is doing somersaults and taking me with it.`, `I am so happy I keep forgetting what I was doing. It was snacks. It is still snacks.`],
      cozy: [`Cozy. Warm gear, warm Hollow, warm everything.`, `I have achieved maximum blanket. This is the peak.`],
      lonely: [`A bit lonely, honestly. You have been busy. Pat me?`, `I have been talking to Gerald the rock. He is not you.`],
      peckish: [`Peckish. Not starving. Just thinking about snacks with my whole heart.`, `A little hungry. A small snack would be a big event.`],
      muddy: [`Muddy. I found the one puddle in the Hollow. It found me back.`, `I am wearing the garden. A bath would be kind.`],
      radiant: [`Radiant! I’m practically vibrating. In a nice way.`, `So good. The sun is warm and you’re here.`],
      happy: [`Happy! My whole day is better now.`, `Pretty great. I found a good stick earlier.`],
      content: [`Content. Cozy. Could go for a snack, but when could I not.`, `I’m okay. The world is soft today.`],
      restless: [`A bit restless. My fun tank is low.`, `I’m fine… mostly. Could use some attention.`],
      grumpy: [`Everything is itchy and I want a snack and a nap.`, `Grumpy. But you being here helps. A little.`],
      starving: [`Hungry. Very hungry. Hungry enough to be dramatic about it.`, `I keep looking at my own tail like it’s a snack.`],
      filthy: [`I’m covered in mystery dirt. I’m not proud of it.`, `I smell like the inside of a shoe. Help.`],
      exhausted: [`Sleepy. So sleepy.`, `I’m running on fumes and one good memory.`],
      bonded: [`Honestly? Perfect. I’m with my favourite person.`, `Like the warm part of a sunbeam.`],
      sleep: ['Mmm… good. Dreaming about floating sandwiches.'],
      egg: ['It’s dark in here. Also warm. Also I’m an egg.'],
    };
    const bank = lines[mood.key] || lines.content;
    return one(bank) + (note && !hungry && !sleepy ? ` ${note}` : '');
  }
  /* This has to run before the identity branch: "what are you doing" would
     otherwise answer with the puffle's name instead of its quest. */
  if (/\b(what are you doing|what doing|doing|story|quest|errand)\b/.test(t)) {
    /* The active region quest is what the puffle is actually doing, so answer in
       its own quest beat and name the real step instead of a generic line. */
    const questKey = typeof BIOME_QUEST_KEYS !== 'undefined'
      ? BIOME_QUEST_KEYS.find((key) => typeof biomeQuestStep === 'function' && biomeQuestStep(key))
      : null;
    if (questKey) {
      const info = biomeQuestStep(questKey);
      const line = spriteVoiceBeat(s, 'quest');
      if (info) return [line, `${info.def.title}: ${info.step.text}.`].filter(Boolean).join(' ');
    }
    const quest = typeof storyPrompt === 'function' ? storyPrompt() : '';
    if (quest) return quest;
    return one([
      'Existing. Spectacularly.',
      'Thinking about a snack. Then I got distracted by you. Then I remembered the snack.',
      'Watching a bug. It’s a good bug. We’re friends now.',
    ]);
  }
  /* The bond ladder answers for itself: this is the question the tier chip on
     the collection sheet cannot answer on its own. */
  if (/\b(do you like me|do you love me|love me|are we (friends|best friends|close)|our bond|relationship|what do you think of me|how close are we)\b/.test(t)) {
    const tier = typeof relationshipTierFor === 'function' ? relationshipTierFor(s.bond) : null;
    const line = typeof puffleTierLine === 'function' ? puffleTierLine(s) : null;
    return [line || toneLine(s, 'love'), tier ? `The book says ${tier.name} · bond ${Math.round(Number(s.bond) || 0)}/100.` : ''].filter(Boolean).join(' ');
  }
  /* A puffle has opinions about the rest of the roster, not just about you. */
  if (/\b(who('s| is) your (best )?friend|your friends?|who do you (like|hang out with))\b/.test(t)) {
    const others = (typeof grownSprites === 'function' ? grownSprites() : (state.sprites || []))
      .filter((o) => o && o.id !== s.id && o.stage !== 'egg');
    if (!others.length) return 'You. Obviously. There is no competition, there is only you.';
    const score = (o) => (Number(o.bond) || 0) + (o.element === s.element ? 8 : 0);
    const pal = others.slice().sort((a, b) => score(b) - score(a))[0];
    const same = pal.element === s.element;
    return one([
      `${displayName(pal)}. ${same ? 'Same element, same nonsense. We understand each other.' : 'Different element, same nonsense. It works.'}`,
      `Probably ${displayName(pal)}. We trade snacks and secrets. Mostly snacks.`,
      `${displayName(pal)}, if you must know. We have a whole thing.`,
    ]);
  }
  if (/\b(who are you|what are you|your name|name)\b/.test(t)) {
    return `I’m ${name}! A ${typeName(s)} ${BREEDS[s.breed]?.name || 'Puff'}. I’m ${personalityName(s).toLowerCase()}, apparently. The paperwork says so.`;
  }
  if (/\b(hi|hello|hey|yo|hey there|good morning|good evening|howdy)\b/.test(t)) {
    const greet = toneLine(s, 'greet');
    if (voiceCtx.kind === 'ignored') {
      const regret = voiceContext(s, 'ignored');
      if (regret) return regret;
    }
    const extra = voiceCtx.kind && voiceCtx.kind !== 'ignored' ? voiceContext(s, voiceCtx.kind) : '';
    /* A callback is used once and then forgotten, so the next hello can move on. */
    const seen = puffleVoiceState(s);
    const callback = topicCallbackLine(seen.topic, seen.topicAt);
    if (callback) {
      seen.topic = null;
      seen.topicAt = 0;
    }
    const tierLine = typeof puffleTierLine === 'function' && Number(s.bond) >= 45 && chance(0.6) ? puffleTierLine(s) : '';
    /* Two puffles can share a role voice and still speak differently, because
       their rolled personality gets its own aside. */
    const quirk = !callback && typeof puffleQuirkLine === 'function' && chance(0.3) ? puffleQuirkLine(s) : '';
    const hungryNote = hungry && chance(0.55) ? note : '';
    return [greet, callback || extra, quirk, tierLine, hungryNote].filter(Boolean).join(' ');
  }
  if (/\b(bye|goodbye|goodnight|night|see you|cya|later)\b/.test(t)) {
    if (hungry || sleepy) return `${toneLine(s, 'end')} Also, needs. Please.`;
    return toneLine(s, 'end');
  }
  if (/\b(thank|thanks|ty|appreciate)\b/.test(t)) {
    return one(['Anytime. That’s literally my whole thing.', 'You’re welcome! I accept payment in snacks.', 'Aww. You’re nice. I’m keeping you.']);
  }
  if (/\b(sad|bad day|upset|cry|lonely)\b/.test(t)) {
    addBondOnChat(s);
    return one([
      'Hey. I’m here. We can just sit together for a bit if you want.',
      'That sounds heavy. Want to hold my tiny hand? It’s very small but it’s warm.',
      'I’m not great with words, but I’m excellent at sitting next to you.',
    ]);
  }
  if (/\b(cute|pretty|beautiful|handsome|adorable|good)\b/.test(t)) {
    return one([
      'Stop it. No, keep going. I’m listening.',
      'I know. But it’s nice to hear. …I’m blushing, aren’t I.',
      'You’re not so bad yourself. For a giant.',
    ]);
  }
  if (/\b(dance|sing|song|music)\b/.test(t)) {
    if (/\b(sing|hum|note|voice)\b/.test(t)) {
      const sung = one(['*hums four notes with tremendous confidence* Okay. That’s the whole song.', 'My song is one note long. It has a bridge. The bridge is also the note.', 'I only know the chorus. I have been singing it for nine months.']);
      if (typeof Voice !== 'undefined' && Voice.spriteSpeak) Voice.spriteSpeak(s, sung);
      return sung;
    }
    return one([
      `The ${el.name.toLowerCase()} dance is mostly wiggling with confidence. I can teach you.`,
      'I sing one note. It’s the best note. You’ll love it. You may also hate it.',
    ]);
  }
  if (/\b(help|what can you do|how do i|tip)\b/.test(t)) {
    return 'You can feed me, pet me, give me a bath, tuck me in, play games, or talk to me. I personally recommend all of them, in that order, repeatedly.';
  }
  if (/\b(no|nope|nah)\b/.test(t)) return one(['Okay. Fine. I’ll remember this.', 'Fine. But I’m making a face.']);
  if (/\b(yes|yeah|yep|sure|okay|ok)\b/.test(t)) {
    return toneLine(s, 'agree') + (hungry ? ' Does that mean snack? Please say it means snack.' : '');
  }
  if (/\b(where are we|hollow|home)\b/.test(t)) {
    return `This is ${state.hollowName}. It’s ours. The moss is very good moss.`;
  }

  addBondOnChat(s);
  if (/\b(story|tale|once upon|tell me about the old days)\b/.test(t)) {
    addBondOnChat(s);
    return storyLine(s);
  }
  if (/\b(dream|dreams|dreaming)\b/.test(t)) {
    return s.asleep ? 'I’m in one right now. It’s got you in it. And a sandwich.' : dreamLine(s);
  }
  if (/\b(favourite food|favorite food|what do you eat|best food)\b/.test(t)) {
    return `That’s easy: ${el.likes}. If you ever want to be my favourite person forever, that’s the currency.`;
  }
  if (/\b(boop|poke|tap)\b/.test(t)) {
    addBondOnChat(s);
    return one(['…boop received. Boop returned, with interest.', 'I have been booped. I am changed. Do it again.', 'You booped the snoot. That’s legally a promise now.']);
  }
  if (/\b(high five|high-five|fist bump|hug)\b/.test(t)) {
    addBondOnChat(s);
    return one(['*tiny hand, enormous commitment* — got it.', 'Hug accepted. Hold on, I’m not done. …Okay, now I’m done.', 'Up top! I had to jump. Worth it.']);
  }
  if (/\b(secret|tell me a secret|confess)\b/.test(t)) {
    return one([
      'I sometimes sit in your chair when you’re gone. It smells like you.',
      'I named a rock. Its name is Gerald. Gerald is doing well.',
      'I’m a little scared of the dark, so I sing. Badly. It helps.',
    ]);
  }
  if (/\b(what should we name|name a|name it)\b/.test(t)) {
    const ideas = ['Moss', 'Pip', 'Juniper', 'Biscuit', 'Wren', 'Tansy', 'Nook', 'Sprout', 'Comet', 'Mallow'];
    return `Ooh. ${pick(ideas)}. Or ${pick(ideas)}. I’m very good at this.`;
  }
  if (/\b(weather|rain|snow|sunny|storm|season)\b/.test(t)) {
    const kind = weatherVoiceKind(t);
    const voiced = kind ? voiceContext(s, kind) : null;
    if (voiced) return voiced;
    return one([
      `I like ${state.world?.weather || 'the quiet weather'}. It makes the Hollow feel like it’s breathing.`,
      'When it rains I sit by the window and judge the drops. Some are faster. They know.',
      'Snow is just cold confetti if you think about it. I think about it a lot.',
    ]);
  }
  if (/\b(sing|hum|note|voice)\b/.test(t)) {
    if (typeof Voice !== 'undefined' && Voice.spriteSpeak) Voice.spriteSpeak(s, 'Mmm-hmm-hm. That is the song. That is all of the song.');
    return one(['*hums four notes with tremendous confidence*', 'My song is one note long. It has a bridge. The bridge is also the note.']);
  }
  if (/\b(friend|lonely|together|play with me)\b/.test(t)) {
    addBondOnChat(s);
    return one(['You’re my favourite. The others are also my favourite. Don’t tell them I said that first.', 'I have a rock friend named Gerald, but you’re better. Slightly better. Don’t tell Gerald.']);
  }
  const fallback = [
    `Huh. I don’t know that one. Tell me more?`,
    `I’m going to nod like I understood that. …Okay, I didn’t.`,
    `My brain is mostly snacks and affection, but I’m trying.`,
    `That’s a big thought. Can I think about it while we sit?`,
    `Interesting! I also have no idea. But I’m interested.`,
  ];
  const flavour = elementChatter(s);
  return one(fallback) + (flavour && chance(0.45) ? ` ${flavour}` : '') + (note && chance(0.5) ? ` ${note}` : '');
}

function addBondOnChat(s) {
  s.bond = clamp(s.bond + 0.6);
}

function idleLine(s) {
  if (!s) return '';
  if (s.stage === 'egg') return 'The egg wiggles a little. Something in there is dreaming.';
  if (s.asleep) return `${nameOf(s)} is dreaming. Their tail twitches.`;
  if (s.needs.hunger < 25) {
    const comforts = typeof puffleComfortsFor === 'function' ? puffleComfortsFor(s) : null;
    const snack = comforts ? comforts.food.name.toLowerCase() : 'a snack';
    return `${nameOf(s)}: “I could really go for ${snack} right now.”`;
  }
  if (s.needs.clean < 25) return `${nameOf(s)} is leaving little dirt prints. “I found a puddle.”`;
  if (s.needs.energy < 25) return `${nameOf(s)} yawns so widely they almost fall over.`;
  if (s.needs.joy < 25) return `${nameOf(s)} is trying to get your attention by being dramatically bored.`;
  if (typeof storyPrompt === 'function' && storyPrompt()) return `${nameOf(s)}: “${storyPrompt()}”`;
  const voiceIdle = spriteVoiceBeat(s, 'idle');
  if (voiceIdle && chance(0.5)) return `${nameOf(s)}: “${voiceIdle}”`;
  const personal = {
    sunny: 'practices the same happy spin for no reason.',
    grump: 'sits facing away, then scoots three inches closer.',
    shy: 'peeks at you, then pretends to inspect a leaf.',
    bold: 'is attempting to climb the tallest thing in the Hollow.',
    goofy: 'is having a very serious conversation with a mushroom.',
    dreamy: 'is watching dust float like it’s a fireworks show.',
    sassy: 'is judging a bug, and the bug knows it.',
  }[s.personality] || 'is wandering with purpose, probably.';
  return `${nameOf(s)} ${personal}`;
}

function reactionLine(s, kind) {
  if (!s) return '';
  const name = nameOf(s);
  if (kind === 'feed') return one([`${name} munches happily.`, `${name} does a little food dance.`, `${name} says “mmm” with their whole body.`]);
  if (kind === 'pet') return one([`${name} melts into a puddle of happy.`, `${name} leans into your hand.`, `${name} purrs — the purr is mostly a rumble.`]);
  if (kind === 'bath') return one([`${name} is now 20% more sparkly.`, `${name} blows a heroic bubble.`, `${name} smells like a flower that has opinions.`]);
  if (kind === 'nap') return `${name} curls up and is out in three seconds.`;
  if (kind === 'game') return one([`${name} wins and insists it was skill. It was mostly luck.`, `${name} does a victory lap of the whole Hollow.`]);
  if (kind === 'chat') return one([`${name} talks with their whole body until the story is done.`, `${name} leans in, listening hard.`]);
  if (kind === 'merge') return `The nest glows. A new egg clicks into place.`;
  return '';
}
