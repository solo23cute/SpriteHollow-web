/* Lazy route chunks.
   The boot bundle carries only what the intro and a saved home need on first
   paint. Wiki/roster and Studio live in src/boot/route-*.min.js; these thin
   stubs load the chunk on first use and then hand off to the real function,
   which replaces the stub as a global declaration when the chunk runs. */
(function () {
  const routes = (typeof window !== 'undefined' && window.SH_ROUTES) || {};
  const loaded = {};
  window.shRouteLoaded = loaded;

  function ensureRoute(name) {
    if (!routes[name]) return Promise.resolve();
    if (loaded[name]) return loaded[name];
    loaded[name] = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = routes[name];
      el.onload = () => resolve();
      el.onerror = () => {
        delete loaded[name];
        reject(new Error('could not load the ' + name + ' chunk'));
      };
      document.head.appendChild(el);
    });
    return loaded[name];
  }
  window.ensureRoute = ensureRoute;

  function stub(name, route) {
    const fn = function () {
      const args = arguments;
      return ensureRoute(route).then(() => {
        const real = window[name];
        if (typeof real !== 'function' || real.shRouteStub) {
          throw new Error(name + ' is missing from the ' + route + ' chunk');
        }
        return real.apply(null, args);
      }).catch((err) => {
        if (typeof console !== 'undefined') console.error(err);
        if (typeof toast === 'function') toast('That section could not load.', '⚠️');
      });
    };
    fn.shRouteStub = true;
    window[name] = fn;
    return fn;
  }

  if (typeof window.openWikiGuide !== 'function') stub('openWikiGuide', 'codex');
  if (typeof window.openWikiArticle !== 'function') stub('openWikiArticle', 'codex');
  if (typeof window.openStudioSheet !== 'function') stub('openStudioSheet', 'studio');
})();
