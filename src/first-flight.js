/* First Flight: the guided first session.

   Pure model only: no DOM, storage, clock or game-data access. The screen
   layer renders what this file derives, and state.js owns persistence. Every
   step is derived from the save, so progress survives reloads and cannot be
   advanced by a stray click. */

/* The merge gate, shared with state.js: the merge action, the XP partner and
   this model all read the same number. */
const MERGE_LEVEL = 3;

(function (root) {
  'use strict';

  const GIFT_EGG_HATCH = 40;
  const REWARD = Object.freeze({ coins: 250, snacks: 1 });

  /* Seven steps, each completed by a system that already exists. The gift egg
     supplies the second sprite so the first fusion never depends on coins. */
  const STEPS = Object.freeze([
    Object.freeze({
      id: 'hatch_starter', index: 0, title: 'Hatch your starter',
      blurb: 'Warm the egg in the Nest until the shell cracks open.',
      cta: 'Open the Nest', target: 'nest',
    }),
    Object.freeze({
      id: 'care_once', index: 1, title: 'Say hello',
      blurb: 'Pet, feed, bathe, chat, or tuck your sprite in for the night.',
      cta: 'Go to the Hollow', target: 'hollow',
    }),
    Object.freeze({
      id: 'gift_egg', index: 2, title: 'Take your gift egg',
      blurb: 'A second egg is waiting for you. It is free, and it only needs a few taps.',
      cta: 'Take the gift egg', target: 'gift',
    }),
    Object.freeze({
      id: 'hatch_second', index: 3, title: 'Hatch your second sprite',
      blurb: 'Two sprites are the start of every fusion.',
      cta: 'Warm the gift egg', target: 'nest',
    }),
    Object.freeze({
      id: 'level_pair', index: 4, title: `Get both to level ${MERGE_LEVEL}`,
      blurb: `Care XP goes to one sprite. Task and game XP is shared with your merge partner, so both reach level ${MERGE_LEVEL} together.`,
      cta: 'Play a sprite game', target: 'play',
    }),
    Object.freeze({
      id: 'merge', index: 5, title: 'Make your first fusion',
      blurb: 'Your first merge fee is waived, and a hybrid is guaranteed.',
      cta: 'Fuse in the Nest', target: 'nest',
    }),
    Object.freeze({
      id: 'hatch_fusion', index: 6, title: 'Meet your fusion',
      blurb: 'Hatch the egg your first fusion made. Your first flight ends with a new friend.',
      cta: 'Hatch the fusion egg', target: 'hatch',
    }),
  ]);

  function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function statsOf(save) {
    return save && typeof save.stats === 'object' ? save.stats : {};
  }

  function flightOf(save) {
    return save && typeof save.flight === 'object' && save.flight ? save.flight : {};
  }

  function spritesOf(save) {
    return save && Array.isArray(save.sprites) ? save.sprites : [];
  }

  function grownSprites(save) {
    return spritesOf(save).filter((s) => s && typeof s.stage === 'string' && s.stage !== 'egg' && !s.retired);
  }

  function careCount(stats) {
    return num(stats.pets) + num(stats.feeds) + num(stats.baths) + num(stats.chats)
      + num(stats.rubs) + num(stats.naps);
  }

  /* The first pair that can merge: two grown sprites at the gate or better. */
  function mergePair(save) {
    const ready = grownSprites(save).filter((s) => num(s.level) >= MERGE_LEVEL);
    return ready.length >= 2 ? ready.slice(0, 2) : null;
  }

  /* Closest to the merge gate first: level, then XP. state.js sorts its XP
     partner with this too, so the partner and the pair chips cannot disagree. */
  function gateOrder(a, b) {
    return num(b.level) - num(a.level) || num(b.xp) - num(a.xp);
  }

  /* The two sprites closest to the merge gate, for the pair step's progress
     chips. Grown sprites only; level, then XP, decide the order. */
  function pairProgress(save) {
    return grownSprites(save)
      .slice()
      .sort(gateOrder)
      .slice(0, 2)
      .map((s) => ({
        id: s.id,
        name: typeof s.name === 'string' ? s.name : '',
        element: s.element,
        level: num(s.level),
        xp: num(s.xp),
      }));
  }

  function stepDone(save, id) {
    const stats = statsOf(save);
    const flight = flightOf(save);
    switch (id) {
      case 'hatch_starter': return num(stats.hatches) >= 1;
      case 'care_once': return careCount(stats) >= 1;
      case 'gift_egg': return !!flight.giftClaimed;
      case 'hatch_second': return num(stats.hatches) >= 2;
      case 'level_pair': return !!mergePair(save);
      case 'merge': return num(stats.merges) >= 1;
      case 'hatch_fusion': {
        const child = flight.fusionId ? spritesOf(save).find((s) => s.id === flight.fusionId) : null;
        if (child) return child.stage !== 'egg';
        /* A save that merged before the hatch step existed has no child id;
           three hatches is the old path's best available fallback. */
        return num(stats.merges) >= 1 && num(stats.hatches) >= 3;
      }
      default: return false;
    }
  }

  function progressFromSave(save) {
    const flight = flightOf(save);
    const steps = STEPS.map((step) => Object.assign({}, step, { done: stepDone(save, step.id) }));
    const nextIndex = steps.findIndex((step) => !step.done);
    const done = nextIndex === -1;
    const eligible = !!save && !!save.started && !flight.migrated && !flight.skipped && num(statsOf(save).merges) < 2;
    return {
      eligible,
      started: !!flight.startedAt,
      done,
      steps,
      next: done ? null : steps[nextIndex],
      nextIndex,
      completed: steps.filter((step) => step.done).length,
      total: steps.length,
      reward: REWARD,
      visible: eligible && !flight.claimed,
    };
  }

  /* The sheet reveals completed steps and the current one; the tail is hidden
     behind a count so the first session is not a wall of instructions. */
  function revealedSteps(progress) {
    if (!progress || !Array.isArray(progress.steps)) return [];
    return progress.done ? progress.steps.slice() : progress.steps.slice(0, progress.nextIndex + 1);
  }

  function sanitize(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return {
      startedAt: Math.max(0, Math.floor(num(source.startedAt))),
      claimed: !!source.claimed,
      skipped: !!source.skipped,
      migrated: !!source.migrated,
      /* Older saves stored the egg id instead of the boolean flag. */
      giftClaimed: !!source.giftClaimed || (typeof source.giftEggId === 'string' && !!source.giftEggId),
      fusionId: typeof source.fusionId === 'string' && source.fusionId ? source.fusionId : null,
      waiverUsed: !!source.waiverUsed,
    };
  }

  root.FirstFlight = Object.freeze({
    GIFT_EGG_HATCH,
    MERGE_LEVEL,
    STEPS,
    REWARD,
    mergePair,
    gateOrder,
    pairProgress,
    progressFromSave,
    revealedSteps,
    sanitize,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
