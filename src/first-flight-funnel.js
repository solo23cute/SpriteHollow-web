/* First Flight funnel: a tiny local event log.

   The save owns progress; this file only keeps a bounded ring of the ff_*
   events that explain how the first session went. Events never leave the
   browser. The debug sheet can copy or download the aggregate and raw events
   as JSON for inspection elsewhere. */

(function (root) {
  'use strict';

  const KEY = 'sprite-hollow.ff-funnel.v1';
  const MAX_EVENTS = 400;
  const EVENTS = Object.freeze({
    START: 'ff_start',
    STEP: 'ff_step',
    SKIP: 'ff_skip',
    CLAIM: 'ff_claim',
  });
  const FALLBACK_STEPS = Object.freeze([
    { id: 'hatch_starter', title: 'Hatch your starter' },
    { id: 'care_once', title: 'Say hello' },
    { id: 'gift_egg', title: 'Take your gift egg' },
    { id: 'hatch_second', title: 'Hatch your second sprite' },
    { id: 'level_pair', title: 'Get both to level 3' },
    { id: 'merge', title: 'Make your first fusion' },
    { id: 'hatch_fusion', title: 'Meet your fusion' },
  ]);

  let lastSyncFingerprint = '';

  function cleanEvent(event) {
    if (!event || typeof event !== 'object' || Array.isArray(event)) return null;
    const name = typeof event.name === 'string' ? event.name : '';
    if (!/^ff_[a-z0-9_]+$/.test(name)) return null;
    const clean = {
      name,
      at: Math.max(0, Math.floor(Number(event.at) || 0)),
    };
    if (typeof event.run === 'string' && event.run) clean.run = event.run.slice(0, 80);
    if (typeof event.step === 'string' && event.step) clean.step = event.step.slice(0, 40);
    return clean;
  }

  function sanitize(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(cleanEvent).filter(Boolean).slice(-MAX_EVENTS);
  }

  function read() {
    try {
      const raw = root.localStorage && root.localStorage.getItem(KEY);
      if (!raw) return [];
      return sanitize(JSON.parse(raw));
    } catch (err) {
      return [];
    }
  }

  function write(events) {
    try {
      root.localStorage.setItem(KEY, JSON.stringify(sanitize(events)));
      return true;
    } catch (err) {
      return false;
    }
  }

  function steps() {
    const source = root.FirstFlight && Array.isArray(root.FirstFlight.STEPS)
      ? root.FirstFlight.STEPS
      : FALLBACK_STEPS;
    return source.map((step) => ({ id: step.id, title: step.title }));
  }

  function record(name, data = {}, at = Date.now()) {
    const event = cleanEvent(Object.assign({ name, at }, data));
    if (!event) return false;
    const events = read();
    events.push(event);
    return write(events);
  }

  /* Called after state commits. A fingerprint avoids touching localStorage on
     every care tap or game tick; a write only happens when a step, the start,
     or the skip state actually changes. */
  function sync(save, at = Date.now()) {
    if (!root.FirstFlight || !save || !save.flight || typeof save.flight !== 'object') return false;
    const flight = save.flight;
    if (!flight.startedAt || flight.migrated) return false;
    const progress = root.FirstFlight.progressFromSave(save);
    if (!progress || !progress.started) return false;

    const run = String(flight.startedAt);
    const fingerprint = [
      run,
      flight.skipped ? 1 : 0,
      flight.claimed ? 1 : 0,
      progress.steps.map((step) => (step.done ? 1 : 0)).join(''),
    ].join('|');
    if (fingerprint === lastSyncFingerprint) return false;

    const events = read();
    let changed = false;
    const add = (name, step) => {
      if (events.some((event) => event.name === name && event.run === run && (event.step || '') === (step || ''))) return;
      const event = cleanEvent({ name, at, run, step });
      if (!event) return;
      events.push(event);
      changed = true;
    };

    add(EVENTS.START);
    progress.steps.forEach((step) => {
      if (step.done) add(EVENTS.STEP, step.id);
    });
    if (flight.skipped) add(EVENTS.SKIP);
    if (flight.claimed) add(EVENTS.CLAIM);

    if (!changed) {
      lastSyncFingerprint = fingerprint;
      return false;
    }
    const saved = write(events);
    if (saved) lastSyncFingerprint = fingerprint;
    return saved;
  }

  function aggregate(raw) {
    const events = sanitize(raw);
    const runs = new Map();
    events.forEach((event) => {
      const run = event.run || 'local';
      if (!runs.has(run)) runs.set(run, { start: null, steps: new Map(), skip: false, claim: false });
      const entry = runs.get(run);
      if (event.name === EVENTS.START) {
        entry.start = entry.start === null ? event.at : Math.min(entry.start, event.at);
      } else if (event.name === EVENTS.STEP && event.step) {
        const previous = entry.steps.get(event.step);
        if (previous === undefined || event.at < previous) entry.steps.set(event.step, event.at);
      } else if (event.name === EVENTS.SKIP) {
        entry.skip = true;
      } else if (event.name === EVENTS.CLAIM) {
        entry.claim = true;
      }
    });

    const stepList = steps();
    const ids = stepList.map((step) => step.id);
    const starts = [...runs.values()].filter((run) => run.start !== null);
    const skips = starts.filter((run) => run.skip).length;
    const claims = starts.filter((run) => run.claim).length;
    const stepStats = stepList.map((step) => {
      const index = ids.indexOf(step.id);
      let count = 0;
      let totalMs = 0;
      let timed = 0;
      starts.forEach((run) => {
        if (!run.steps.has(step.id)) return;
        count += 1;
        const at = run.steps.get(step.id);
        let previous = run.start;
        ids.slice(0, index).forEach((previousId) => {
          if (!run.steps.has(previousId)) return;
          const previousAt = run.steps.get(previousId);
          if (previousAt <= at) previous = Math.max(previous, previousAt);
        });
        const elapsed = at - previous;
        if (Number.isFinite(elapsed) && elapsed >= 0) {
          totalMs += elapsed;
          timed += 1;
        }
      });
      return {
        id: step.id,
        title: step.title,
        count,
        avgMs: timed ? Math.round(totalMs / timed) : 0,
        totalMs,
      };
    });

    return {
      starts: starts.length,
      skips,
      claims,
      skipRate: starts.length ? skips / starts.length : 0,
      events: events.length,
      steps: stepStats,
    };
  }

  function snapshot() {
    const events = read();
    return { aggregate: aggregate(events), events };
  }

  function exportJSON(events = read()) {
    const clean = sanitize(events);
    return JSON.stringify({
      app: 'sprite-hollow',
      kind: 'first-flight-funnel',
      exportedAt: new Date().toISOString(),
      aggregate: aggregate(clean),
      events: clean,
    }, null, 2);
  }

  function clear() {
    lastSyncFingerprint = '';
    try {
      root.localStorage.removeItem(KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  root.FirstFlightFunnel = Object.freeze({
    KEY,
    MAX_EVENTS,
    EVENTS,
    read,
    sync,
    aggregate,
    snapshot,
    exportJSON,
    clear,
    record,
  });
})(typeof window !== 'undefined' ? window : globalThis);
