/* Small stories that arrive on their own and ask for one kind of care.

   A story is a tiny two-step errand: it picks a care action the player already
   has (pet, feed, bath, nap, game, talk), names it in character, and pays a
   small bond/coin reward when the action is done. The roll happens inside
   bump(), so every real care action is a chance for the Hollow to start one,
   and the same call advances the one that is running. Nothing here is saved
   as a rule: state.story is a transient little quest, so a reload never loses
   progress the player cannot see, and a stale story is simply replaced. */

const STORY_BEATS = [
  {
    key: 'lostbutton', icon: '🔘', title: 'The Lost Button',
    action: 'pets', goal: 2, verb: 'pet',
    line: 'I lost the button off my favourite blanket. It is small and round and I love it. Help me look?',
    nudge: 'Still looking. Pat me again, I check better when I am being patted.',
    done: 'Found it! It was under me the whole time. I am choosing not to think about that.',
    reward: { coins: 26, xp: 12, bond: 3 },
  },
  {
    key: 'kettlewatch', icon: '🫖', title: 'The Cold Kettle',
    action: 'feeds', goal: 2, verb: 'feed',
    line: 'The kettle went cold and the whole afternoon went with it. Two snacks would fix the timeline.',
    nudge: 'The kettle is still cold. One more snack and we can pretend this never happened.',
    done: 'Kettle hot, afternoon restored, nobody needs to know how.',
    reward: { coins: 30, xp: 12, bond: 2 },
  },
  {
    key: 'bubblerace', icon: '🫧', title: 'The Bubble Race',
    action: 'baths', goal: 1, verb: 'bathe',
    line: 'I have entered the bubble race. I cannot win it dirty. This is where you come in.',
    nudge: 'The race starts when I am clean. Please hurry.',
    done: 'I won the bubble race. I was the only entrant. I am still counting it.',
    reward: { coins: 28, xp: 12, bond: 4 },
  },
  {
    key: 'pillowfort', icon: '🛏️', title: 'The Pillow Fort',
    action: 'naps', goal: 1, verb: 'tuck in',
    line: 'I have drawn up plans for a pillow fort. It needs one resident and one tuck-in.',
    nudge: 'The fort is built. It is very empty. I am being brave about it.',
    done: 'Best fort in the Hollow. You may visit. Bring a blanket.',
    reward: { coins: 24, xp: 14, bond: 3 },
  },
  {
    key: 'marblematch', icon: '🪙', title: 'The Marble Match',
    action: 'games', goal: 1, verb: 'play a game with',
    line: 'A rival claims they are better at marbles. I have never played marbles. I need a warm-up.',
    nudge: 'The match is soon. I need one game of anything first.',
    done: 'I lost the marble match, but I won the warm-up, which is the one that counts.',
    reward: { coins: 36, xp: 18, bond: 2 },
  },
  {
    key: 'scavenger', icon: '🪶', title: 'The Scavenger Hunt',
    action: 'chats', goal: 2, verb: 'talk with',
    line: 'I am on a scavenger hunt and the list says “a good conversation”. I have been stuck on item one.',
    nudge: 'Still item one. Talk to me again — that counts, I checked the rules.',
    done: 'Item one: complete. Item two is “a nap”, which I am extremely qualified for.',
    reward: { coins: 22, xp: 12, bond: 3 },
  },
  {
    key: 'nightwatch', icon: '🌙', title: 'The Night Watch',
    action: 'pets', goal: 3, verb: 'pet',
    line: 'I am on night watch and the dark is very dark. Three pats and I will be brave for the whole shift.',
    nudge: 'Still on watch. Still brave. A pat would help me stay that way.',
    done: 'Shift over. Nothing got in. I would like this noted somewhere official.',
    reward: { coins: 34, xp: 16, bond: 4 },
  },
];

const STORY_CHANCE = 0.14;

function storyBeatFor(key) {
  return STORY_BEATS.find((beat) => beat.key === key) || null;
}

function activeStory() {
  const story = typeof state !== 'undefined' && state ? state.story : null;
  if (!story || !story.key || !storyBeatFor(story.key)) return null;
  return { ...story, beat: storyBeatFor(story.key) };
}

/* Called from every care action's bump(). A running story advances when the
   action it names happens; otherwise a new one may begin. */
function storyNote(stat) {
  const story = activeStory();
  if (!story) return null;
  const beat = story.beat;
  if (beat.action !== stat) return null;
  const step = (Number(story.step) || 0) + 1;
  if (step < beat.goal) {
    state.story = { ...story, beat: undefined, step };
    if (typeof toast === 'function') toast(`${beat.icon} ${beat.nudge}`, beat.icon);
    return { ...story, step, done: false };
  }
  const sprite = (typeof findSprite === 'function' && story.spriteId ? findSprite(story.spriteId) : null)
    || (typeof activeSprite === 'function' ? activeSprite() : null);
  const reward = beat.reward || {};
  if (reward.coins && typeof addCoinsRaw === 'function') addCoinsRaw(reward.coins);
  if (sprite) {
    if (reward.xp && typeof addXpRaw === 'function') addXpRaw(sprite, reward.xp);
    if (reward.bond && typeof addBondRaw === 'function') addBondRaw(sprite, reward.bond);
  }
  if (typeof state !== 'undefined' && state) {
    const entry = {
      id: typeof uid === 'function' ? uid('story') : `story-${Date.now()}`,
      spriteId: sprite ? sprite.id : null,
      spriteName: sprite && typeof displayName === 'function' ? displayName(sprite) : 'The Hollow',
      element: sprite ? sprite.element : 'bloom',
      text: beat.done,
      at: Date.now(),
      kind: 'story',
    };
    state.journal = [entry, ...(Array.isArray(state.journal) ? state.journal : [])].slice(0, 100);
    state.story = { key: null, step: 0, lastKey: beat.key, finishedAt: Date.now() };
  }
  if (typeof toast === 'function') {
    toast(`${beat.icon} ${beat.title} — complete! +${reward.coins || 0} coins`, beat.icon);
  }
  return { ...story, done: true };
}

function maybeStartStory() {
  if (typeof state === 'undefined' || !state || !state.started) return null;
  if (activeStory()) return null;
  if (typeof chance !== 'function' || !chance(STORY_CHANCE)) return null;
  const sprite = typeof activeSprite === 'function' ? activeSprite() : null;
  if (!sprite || sprite.stage === 'egg') return null;
  const lastKey = state.story && state.story.lastKey;
  const pool = STORY_BEATS.filter((beat) => beat.key !== lastKey);
  const beat = typeof pick === 'function' ? pick(pool.length ? pool : STORY_BEATS) : STORY_BEATS[0];
  state.story = { key: beat.key, step: 0, spriteId: sprite.id, startedAt: Date.now() };
  if (typeof toast === 'function') toast(`📖 ${beat.title} — ${beat.line}`, beat.icon);
  return beat;
}

/* One line the chat engine and idle text can quote while a story runs. */
function storyPrompt() {
  const story = activeStory();
  if (!story) return '';
  const left = Math.max(0, story.beat.goal - (Number(story.step) || 0));
  return `${story.beat.icon} ${story.beat.title} — ${story.beat.line} (${left} to go)`;
}

if (typeof globalThis !== 'undefined') {
  globalThis.STORY_BEATS = STORY_BEATS;
  globalThis.storyBeatFor = storyBeatFor;
  globalThis.activeStory = activeStory;
  globalThis.storyNote = storyNote;
  globalThis.maybeStartStory = maybeStartStory;
  globalThis.storyPrompt = storyPrompt;
}
