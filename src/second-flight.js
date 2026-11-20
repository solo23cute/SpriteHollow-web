/* Second Flight: the one-step choice that follows a claimed First Flight.

   Pure model only: no DOM, storage, clock or game-data access. The card is
   derived from the save, so the pick survives a reload and the one next action
   cannot be advanced by a stray click. */

(function (root) {
  'use strict';

  /* Four ways to keep playing. Each path measures itself from the save and
     offers exactly one next action, with no reward attached. */
  const PATHS = Object.freeze([
    Object.freeze({
      id: 'collector', icon: '🗂️', title: 'Collector',
      blurb: 'Grow the roster, element by element.',
      unit: 'elements', goal: 6,
      cta: 'Open the collection', target: 'collection',
    }),
    Object.freeze({
      id: 'caretaker', icon: '🫧', title: 'Caretaker',
      blurb: 'Keep the Hollow fed, clean, and happy.',
      unit: 'care moments', goal: 25,
      cta: 'Go to the Hollow', target: 'hollow',
    }),
    Object.freeze({
      id: 'challenger', icon: '⚔️', title: 'Challenger',
      blurb: 'Take on the games and come back with a score.',
      unit: 'games', goal: 10,
      cta: 'Play a game', target: 'play',
    }),
    Object.freeze({
      id: 'decorator', icon: '🎀', title: 'Decorator',
      blurb: 'Dress your sprites and make the Hollow yours.',
      unit: 'looks saved', goal: 2,
      cta: 'Open the Studio', target: 'studio',
    }),
  ]);

  /* Titles are per path so the card can show one concrete action rather than a
     generic "keep playing". */
  const ACTION_TITLE = Object.freeze({
    collector: 'Catch your next species',
    caretaker: 'Top up a need',
    challenger: 'Finish a sprite game',
    decorator: 'Dress one sprite',
  });

  function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function statsOf(save) {
    return save && typeof save.stats === 'object' && save.stats ? save.stats : {};
  }

  function flight2Of(save) {
    return save && typeof save.flight2 === 'object' && save.flight2 ? save.flight2 : {};
  }

  function spritesOf(save) {
    return save && Array.isArray(save.sprites) ? save.sprites : [];
  }

  function listLength(value) {
    return Array.isArray(value) ? value.length : 0;
  }

  function pathById(id) {
    return PATHS.find((path) => path.id === id) || null;
  }

  /* What each path counts. Kept tiny on purpose: one number per path, read
     straight from what the save already records. */
  function measure(save, pathId) {
    switch (pathId) {
      case 'collector': {
        const elements = new Set(spritesOf(save)
          .filter((s) => s && s.stage && s.stage !== 'egg' && !s.retired && typeof s.element === 'string')
          .map((s) => s.element));
        return elements.size;
      }
      case 'caretaker': {
        const stats = statsOf(save);
        return num(stats.pets) + num(stats.feeds) + num(stats.baths) + num(stats.chats) + num(stats.rubs);
      }
      case 'challenger':
        return num(statsOf(save).games);
      case 'decorator':
        return listLength(save && save.customClothes) + listLength(save && save.customScenes);
      default:
        return 0;
    }
  }

  /* The one action the Hollow shows for a chosen path. */
  function actionFor(save, path) {
    const have = Math.min(path.goal, measure(save, path.id));
    const done = have >= path.goal;
    return {
      id: path.id,
      title: done ? `${path.title} path walked` : ACTION_TITLE[path.id],
      blurb: done
        ? 'That is a full lap. Keep going, or pick another path.'
        : `${have} of ${path.goal} ${path.unit} so far.`,
      cta: path.cta,
      target: path.target,
      have,
      goal: path.goal,
      unit: path.unit,
      done,
    };
  }

  function progressFromSave(save) {
    const flight2 = flight2Of(save);
    const claimed = !!(save && save.flight && typeof save.flight === 'object' && save.flight.claimed);
    const path = claimed ? pathById(flight2.picked) : null;
    return {
      claimed,
      dismissed: claimed && !!flight2.dismissed,
      visible: claimed && !flight2.dismissed,
      path,
      picked: path ? path.id : null,
      paths: PATHS,
      action: path ? actionFor(save, path) : null,
    };
  }

  function sanitize(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return {
      picked: pathById(source.picked) ? source.picked : null,
      dismissed: !!source.dismissed,
      startedAt: Math.max(0, Math.floor(num(source.startedAt))),
    };
  }

  root.SecondFlight = Object.freeze({
    PATHS,
    pathById,
    measure,
    actionFor,
    progressFromSave,
    sanitize,
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
