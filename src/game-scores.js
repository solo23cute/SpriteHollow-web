/* Per-game score records.

   Every mini game in the manifest ends through Actions.finishGame, so one
   record here covers all of them: the game shell shows the best score while you
   play, and the result card says whether the run beat it. Records are per game
   and per save, never global, and only best/plays/last are stored — enough to
   rank a run, nothing a hand-edited save could inflate into rewards. */

(function (root) {
  'use strict';

  const MAX_GAMES = 80;

  function cleanScore(value) {
    const score = Math.floor(Number(value));
    return Number.isFinite(score) && score > 0 ? score : 0;
  }

  function sanitize(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    Object.keys(raw).slice(0, MAX_GAMES).forEach((key) => {
      if (!/^[a-z0-9_-]{1,32}$/i.test(key)) return;
      const row = raw[key];
      if (!row || typeof row !== 'object' || Array.isArray(row)) return;
      out[key] = {
        best: cleanScore(row.best),
        plays: Math.max(0, Math.floor(Number(row.plays) || 0)),
        last: cleanScore(row.last),
      };
    });
    return out;
  }

  function rowOf(save, key) {
    const table = save && save.gameScores && typeof save.gameScores === 'object' ? save.gameScores : null;
    return table && key ? table[key] || null : null;
  }

  function best(save, key) {
    const row = rowOf(save, key);
    return row ? cleanScore(row.best) : 0;
  }

  function plays(save, key) {
    const row = rowOf(save, key);
    return row ? Math.max(0, Math.floor(Number(row.plays) || 0)) : 0;
  }

  /* The most recent run, which every row stores and the records sheet shows. */
  function last(save, key) {
    const row = rowOf(save, key);
    return row ? cleanScore(row.last) : 0;
  }

  /* Raises the best and counts the run. Returns the previous best so the result
     card can say "new best" without reading the save twice. */
  function record(save, key, score) {
    const value = cleanScore(score);
    if (!save || !key) return { best: value, isBest: false, plays: 0, last: value };
    const table = save.gameScores && typeof save.gameScores === 'object' ? save.gameScores : {};
    const previous = table[key] ? cleanScore(table[key].best) : 0;
    const row = {
      best: Math.max(previous, value),
      plays: Math.max(0, Math.floor(Number(table[key] && table[key].plays) || 0)) + 1,
      last: value,
    };
    save.gameScores = Object.assign({}, table, { [key]: row });
    return { best: row.best, isBest: value > previous, plays: row.plays, last: value };
  }

  /* The best line every result panel shows: the record read *before* the run is
     collected, so the card can name the best the run is about to set. One
     function rather than one formula per panel — the arcade card, the sports
     panels and the trail summary all end a run and would otherwise drift.
     `key` is the same string the matching action passes to `record`. */
  function card(save, key, score) {
    const before = best(save, key);
    const run = cleanScore(score);
    return {
      bestLine: Math.max(before, run).toLocaleString('en-US'),
      isBest: run > before,
    };
  }

  /* What a record pays: small, capped, and derived from the score alone so the
     result card can quote it before the run is collected. */
  function bonus(score) {
    const value = cleanScore(score);
    return value >= 3 ? Math.min(150, 15 + Math.round(value / 5)) : 0;
  }

  root.GameScores = Object.freeze({ MAX_GAMES, sanitize, best, plays, last, record, cleanScore, bonus, card });
})(typeof globalThis !== 'undefined' ? globalThis : window);
