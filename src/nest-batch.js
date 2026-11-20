/* Pure egg-queue and batch-hatch summary helpers.

   The Nest screen uses these for the warm-all/hatch-all-ready counts, the
   waiting IDs it passes to Actions, and the duplicate-labelled result summary.
   They contain no DOM, storage, clock, randomness or sprite mutation, so the
   queue rules can be tested without booting the game. */

(function (root) {
  'use strict';

  const READY_AT = 100;

  function hatchValue(egg) {
    const value = Number(egg && egg.hatch);
    return Number.isFinite(value) ? value : 0;
  }

  function isEgg(egg) {
    return !!egg && egg.stage === 'egg';
  }

  function isReady(egg) {
    return isEgg(egg) && hatchValue(egg) >= READY_AT;
  }

  function isWaiting(egg) {
    return isEgg(egg) && hatchValue(egg) < READY_AT;
  }

  /* Keep the caller's order so the queue and result summary read in the same
     order as the Nest cards. Non-egg sprites are ignored. */
  function queueFor(eggs) {
    const list = Array.isArray(eggs) ? eggs.filter(Boolean) : [];
    const ready = list.filter(isReady);
    const waiting = list.filter(isWaiting);
    return {
      ready,
      waiting,
      readyIds: ready.map((egg) => egg.id),
      waitingIds: waiting.map((egg) => egg.id),
      readyCount: ready.length,
      waitingCount: waiting.length,
      total: ready.length + waiting.length,
    };
  }

  function labelOf(sprite, labelFor) {
    let label = '';
    if (typeof labelFor === 'function') label = labelFor(sprite);
    else if (sprite) label = sprite.name;
    return String(label || '').trim() || 'Hatchling';
  }

  function groupHatched(hatched, labelFor) {
    const groups = new Map();
    (Array.isArray(hatched) ? hatched : []).filter(Boolean).forEach((sprite) => {
      const label = labelOf(sprite, labelFor);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(sprite);
    });
    return [...groups.entries()].map(([label, list]) => ({ label, list, count: list.length }));
  }

  function summarize(hatched, skipped, labelFor) {
    const list = (Array.isArray(hatched) ? hatched : []).filter(Boolean);
    const rows = groupHatched(list, labelFor);
    const duplicateLabels = rows.filter((row) => row.count > 1).map((row) => row.label);
    return {
      hatchedCount: list.length,
      skippedCount: (Array.isArray(skipped) ? skipped : []).length,
      /* Batch hatch deliberately skips one reveal per successfully hatched egg. */
      skippedReveals: list.length,
      shinyCount: list.filter((sprite) => !!sprite.shiny).length,
      rows,
      duplicateLabels,
      duplicateCount: duplicateLabels.length,
    };
  }

  root.NestBatch = Object.freeze({
    READY_AT,
    isEgg,
    isReady,
    isWaiting,
    queueFor,
    groupHatched,
    summarize,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
