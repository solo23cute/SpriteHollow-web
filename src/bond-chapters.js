/* Bond chapters: the three household story milestones.

   Every shared house writes its own copy of a chapter when its bond crosses
   150, 300 or 450. A chapter carries a keepsake and uses one of the reusable
   tone templates below. The shelf is a global, additive save list so a house
   can split without taking its stories with it.

   This file is pure: no DOM, storage, clock or randomness. The caller supplies
   names and a timestamp when it turns a house into a shelf entry. */

(function (root) {
  'use strict';

  const TONES = Object.freeze({
    hearthside: Object.freeze({
      id: 'hearthside',
      name: 'Hearthside',
      icon: '🔥',
      template: 'On a rain-soft evening, {members} pulled their chairs into one small circle. In {house}, the kettle found its voice and the {keepsake} found its place on the shelf. No one had to say it: this was home.',
    }),
    supper: Object.freeze({
      id: 'supper',
      name: 'Supper',
      icon: '🥣',
      template: '{members} built a meal out of leftovers and stubbornness. In {house}, the {keepsake} passed from paw to paw until everyone had a sip. The table was too small; the evening was not.',
    }),
    openroad: Object.freeze({
      id: 'openroad',
      name: 'Open Road',
      icon: '🧭',
      template: 'By the time {members} had filled three shelves in {house}, the front door learned to stay open. The {keepsake} hangs beside it now — not a lock, but a promise that leaving is always followed by coming back.',
    }),
  });

  const CHAPTERS = Object.freeze([
    Object.freeze({
      id: 'first-hearth',
      threshold: 150,
      name: 'The First Hearth',
      icon: '🕯️',
      tone: 'hearthside',
      keepsake: Object.freeze({
        id: 'hearthstone',
        name: 'Warm Hearthstone',
        icon: '🪵',
        blurb: 'A smooth stone from the first evening everyone chose to stay in.',
      }),
    }),
    Object.freeze({
      id: 'long-table',
      threshold: 300,
      name: 'The Long Table',
      icon: '🍲',
      tone: 'supper',
      keepsake: Object.freeze({
        id: 'chipped-teacup',
        name: 'Chipped Tea Cup',
        icon: '🍵',
        blurb: 'One chip, two handles, and an unreasonable number of refills.',
      }),
    }),
    Object.freeze({
      id: 'open-door',
      threshold: 450,
      name: 'The Open Door',
      icon: '🚪',
      tone: 'openroad',
      keepsake: Object.freeze({
        id: 'brass-door-key',
        name: 'Brass Door Key',
        icon: '🗝️',
        blurb: 'It opens the front door, and every door after it.',
      }),
    }),
  ]);

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function chapterById(id) {
    return CHAPTERS.find((chapter) => chapter.id === id) || null;
  }

  function unlockedAt(bond) {
    const value = Math.max(0, Number(bond) || 0);
    return CHAPTERS.filter((chapter) => value >= chapter.threshold);
  }

  function nextAt(bond) {
    const value = Math.max(0, Number(bond) || 0);
    return CHAPTERS.find((chapter) => value < chapter.threshold) || null;
  }

  /* Readable alias used by the screen-facing API. */
  function nextChapter(bond) {
    return nextAt(bond);
  }

  function houseLabel(house, members) {
    return text(object(house) && house.houseName)
      || text(object(house) && house.name)
      || members.join(' & ')
      || 'the shared house';
  }

  function makeEntry(house, chapter, at) {
    if (!object(house) || !object(chapter) || !text(house.houseId)) return null;
    const members = (Array.isArray(house.members) ? house.members : [])
      .map((name) => text(name))
      .filter(Boolean)
      .slice(0, 4);
    const tone = TONES[chapter.tone];
    if (!tone) return null;
    const houseName = houseLabel(house, members);
    return {
      key: `${house.houseId}:${chapter.id}`,
      houseId: text(house.houseId),
      houseName,
      chapterId: chapter.id,
      chapterName: chapter.name,
      chapterIcon: chapter.icon,
      threshold: chapter.threshold,
      keepsake: chapter.keepsake,
      tone,
      members,
      at: Math.max(0, Number(at) || 0),
    };
  }

  function normalizeShelf(raw) {
    const list = Array.isArray(raw) ? raw : [];
    const seen = new Set();
    return list.reduce((shelf, candidate) => {
      if (!object(candidate)) return shelf;
      const chapter = chapterById(candidate.chapterId);
      if (!chapter) return shelf;
      const houseId = text(candidate.houseId);
      if (!houseId || seen.has(`${houseId}:${chapter.id}`)) return shelf;
      const entry = makeEntry({
        houseId,
        houseName: candidate.houseName,
        members: Array.isArray(candidate.members) ? candidate.members : [],
      }, chapter, candidate.at);
      if (!entry) return shelf;
      seen.add(entry.key);
      shelf.push(entry);
      return shelf;
    }, []);
  }

  /* Return the full shelf plus any chapter this house has crossed but not yet
     recorded. Existing entries are never mutated, so calling this repeatedly
     is idempotent and old saves can be backfilled safely. */
  function mergeEntries(shelf, house, at) {
    const next = normalizeShelf(shelf);
    if (!object(house) || !text(house.houseId)) return next;
    const seen = new Set(next.map((entry) => entry.key));
    unlockedAt(house.bond).forEach((chapter) => {
      const entry = makeEntry(house, chapter, at);
      if (!entry || seen.has(entry.key)) return;
      seen.add(entry.key);
      next.push(entry);
    });
    return next;
  }

  function shelfForHouse(shelf, houseId) {
    return normalizeShelf(shelf).filter((entry) => entry.houseId === houseId);
  }

  function keepsakes(shelf) {
    return normalizeShelf(shelf).map((entry) => entry.keepsake);
  }

  function renderTone(toneId, context) {
    const tone = TONES[toneId] || null;
    if (!tone) return '';
    const source = object(context) || {};
    const members = (Array.isArray(source.members) ? source.members : [])
      .map((name) => text(name))
      .filter(Boolean);
    const values = {
      house: text(source.houseName) || 'the shared house',
      members: members.join(' & ') || 'the housemates',
      keepsake: text(source.keepsakeName) || 'keepsake',
    };
    return tone.template.replace(/\{(house|members|keepsake)\}/g, (match, key) => values[key] || match);
  }

  function renderEntry(entry) {
    if (!object(entry) || !text(entry.tone && entry.tone.id)) return '';
    return renderTone(entry.tone.id, {
      houseName: entry.houseName,
      members: entry.members,
      keepsakeName: entry.keepsake && entry.keepsake.name,
    });
  }

  root.BondChapters = Object.freeze({
    TONES,
    CHAPTERS,
    chapterById,
    unlockedAt,
    nextAt,
    nextChapter,
    makeEntry,
    normalizeShelf,
    mergeEntries,
    shelfForHouse,
    keepsakes,
    renderTone,
    renderEntry,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
