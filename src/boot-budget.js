/* Startup render budget.

   The first painted frame should carry no entrance motion, no ambient
   particles and no heavy filters. index.html puts `sh-boot-budget` on <html>
   before any stylesheet loads, so the very first style pass already has them
   off; this module removes the class once the app's first frame is committed
   and hands deferred work to the browser's idle time.

   Reduced motion is untouched: the budget only delays decorative work, and the
   existing reduce-motion rules decide what runs once the class is gone. */

const ShBootBudget = (() => {
  const CLASS = 'sh-boot-budget';
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const queue = [];
  let released = false;
  let safety = null;

  function active() {
    return !released && !!root && root.classList.contains(CLASS);
  }

  function run(fn) {
    try {
      fn();
    } catch (err) {
      if (typeof console !== 'undefined') console.error(err);
    }
  }

  function release() {
    if (released) return;
    released = true;
    if (safety) {
      clearTimeout(safety);
      safety = null;
    }
    if (root) root.classList.remove(CLASS);
    /* The Android shell keeps its own static splash over the WebView until the
       app's first frame is committed. Browsers have no such bridge, so this is
       a no-op there. */
    if (typeof window !== 'undefined' && window.HollowSplash
        && typeof window.HollowSplash.ready === 'function') {
      try {
        window.HollowSplash.ready();
      } catch (err) { /* the splash also has a native timeout */ }
    }
    const jobs = queue.splice(0, queue.length);
    if (!jobs.length) return;
    const flush = () => jobs.forEach(run);
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(flush, { timeout: 400 });
    } else {
      setTimeout(flush, 0);
    }
  }

  /* Run fn now, or after the budget is released. Deferred work must re-check
     its own DOM nodes: the screen it was built for may be gone by then. */
  function after(fn) {
    if (typeof fn !== 'function') return;
    if (released || !active()) {
      run(fn);
      return;
    }
    queue.push(fn);
  }

  /* Two frames: the first callback runs before the first paint, the second
     runs once that paint is on screen, so the effects start after it. The
     queued work waits for an idle slot, which also lets the window's focus
     handshake finish first. */
  function commit() {
    if (released) return;
    let frames = 0;
    let guard = null;
    const done = () => {
      if (guard) {
        clearTimeout(guard);
        guard = null;
      }
      release();
    };
    const step = () => {
      frames += 1;
      if (frames >= 2) done();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    /* A backgrounded or occluded WebView can defer rAF indefinitely; the
       budget still has to end once the mount has had time to paint. */
    guard = setTimeout(done, 400);
  }

  /* If boot never reaches commit (recovery screen, a thrown boot, a bundle
     that takes very long to parse), decorative motion must not stay off for
     good. Long enough that a slow cold start still commits on its own. */
  if (typeof setTimeout === 'function') safety = setTimeout(release, 8000);

  return { CLASS, active, after, commit, release };
})();
if (typeof window !== 'undefined') window.ShBootBudget = ShBootBudget;
