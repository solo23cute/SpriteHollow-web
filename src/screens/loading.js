/* Loading screen: a short pixie-dust transition that plays while your sprite is
   loaded into the Hollow. */

const HOLLOW_LOAD_LINES = [
  'Sweeping the meadow…',
  'Warming the lanterns…',
  'Shaking out the pixie dust…',
  'Calling your sprite home…',
];

/* The things a keeper does once the Hollow opens: the Today tasks and the care
   dock's own actions, alternating so the wait shows care as well as goals.
   Decorative — the card already announces the status line — and every line is
   the game's own wording, so nothing here promises an action the Hollow does
   not offer. The title splash paints this exact list at boot. */
const HOLLOW_LOAD_STRIP = [
  ['task', 'hatches'], ['task', 'feeds'], ['care', 'rub'], ['task', 'games'],
  ['care', 'throw'], ['care', 'catch'], ['care', 'walk'], ['task', 'pets'],
  ['care', 'nap'], ['care', 'bed'], ['care', 'talk'], ['task', 'merges'],
  ['task', 'baths'],
];

/* The care dock's labels and icons (src/screens/hollow.js). */
const HOLLOW_LOAD_CARE = {
  rub: { icon: '🤲', label: 'Rub Belly' },
  throw: { icon: '🎾', label: 'Throw Ball' },
  catch: { icon: '🧤', label: 'Play Catch' },
  walk: { icon: '🥾', label: 'Walk' },
  nap: { icon: '😴', label: 'Nap' },
  bed: { icon: '🛏️', label: 'Bed' },
  talk: { icon: '💬', label: 'Talk' },
};

function hollowLoadActions() {
  const tasks = typeof TASK_POOL !== 'undefined' && Array.isArray(TASK_POOL) ? TASK_POOL : [];
  return HOLLOW_LOAD_STRIP
    .map(([kind, id]) => {
      if (kind === 'care') return HOLLOW_LOAD_CARE[id];
      const task = tasks.find((item) => item.id === id);
      return task ? { icon: task.icon, label: task.label } : null;
    })
    .filter(Boolean);
}

function showHollowLoading(opts = {}) {
  if (typeof buildOverlay !== 'function' || !document.getElementById('portal')) return null;
  /* Calm keeps the card. The animation-off rules already quiet it — the same
     `body.reduce-motion *` squeeze the rest of the app uses — so a keeper who
     turned motion down still gets the same hand-over as everyone else. */
  const s = opts.sprite || (typeof activeSprite === 'function' ? activeSprite() : null) || (typeof grownSprites === 'function' ? grownSprites()[0] : null);
  if (!s) return null;

  const name = displayName(s);
  /* A fever waiting on the Hollow screen matters more than sweeping the meadow,
     and the status line is the only copy that changes during the hand-over, so
     an unwell sprite takes it for the whole card. Empty when the sprite is
     well, which keeps the cycling lines exactly as they were. */
  const sickLine = typeof Sickness !== 'undefined' && Sickness.cardLine ? Sickness.cardLine(s) : '';
  const actions = hollowLoadActions();
  const scene = SCENES[state.theme.scene] || SCENES.grove;
  const ui = THEMES[state.theme.ui] || THEMES.prism;
  const custom = state.theme.custom && typeof state.theme.custom === 'object' ? state.theme.custom : {};
  const themeHex = (v, fb) => (/^#[0-9a-f]{6}$/i.test(String(v || '')) ? v : fb);
  const loadBg = themeHex(custom.bg, ui.bg);
  const loadBg2 = themeHex(custom.bg2, ui.bg2);
  const loadAccent = themeHex(custom.accent, ui.accent);
  const loadAccent2 = themeHex(custom.accent2, ui.accent2);
  const sky = typeof themeLoaderHTML === 'function' ? themeLoaderHTML(state.theme.loader, 26) : '';
  const themeTitle = state.theme.title || 'Sprite Hollow';
  const themeTagline = state.theme.tagline || 'A tiny creature sanctuary';
  /* One read of the splash's scene object, so the wordmark, the backdrop, the
     plate and the art all come through the same door. */
  const sceneArt = typeof window !== 'undefined' ? window.titleScreenScene : null;
  /* The player's Studio backdrop, from the splash's own definition: the card
     used to build the class and the variables itself and nothing styled them. */
  const backdrop = sceneArt && typeof sceneArt.backdrop === 'function'
    ? sceneArt.backdrop(state.theme)
    : { custom: false, image: '', c1: '', c2: '', angle: 145, dim: 0.45 };
  const backdropClass = backdrop.custom ? ` boot-custom${backdrop.image ? ' has-image' : ''}` : '';
  const backdropStyle = backdrop.custom
    ? `;--boot-c1:${backdrop.c1};--boot-c2:${backdrop.c2};--boot-angle:${backdrop.angle}deg;--boot-dim:${backdrop.dim}${backdrop.image ? `;--boot-image-layer:url(${JSON.stringify(backdrop.image)})` : ''}`
    : '';
  /* The plate the splash actually painted, carried on by the card. A custom
     backdrop owns the background instead, so the two never stack. */
  const plate = !backdrop.custom && sceneArt && typeof sceneArt.plate === 'function'
    ? String(sceneArt.plate() || '') : '';
  const plateClass = plate ? ' has-plate' : '';
  const plateStyle = plate ? `;--load-plate:url(${JSON.stringify(plate)})` : '';
  /* The entry frame keeps its weekday/phase colours from the splash through
     this card, so the opening does not change colour halfway in. */
  const frame = sceneArt && typeof sceneArt.frame === 'function' ? sceneArt.frame() : null;
  const frameStyle = frame
    ? `;--sh-frame-a:${frame.a};--sh-frame-b:${frame.b};--sh-frame-c:${frame.c}`
    : '';
  const frameMarkup = sceneArt && typeof sceneArt.frameMarkup === 'function'
    ? sceneArt.frameMarkup('loading') : '';
  /* A custom image is written as url("data:…"); escape the whole style
     attribute so those quotes cannot close it before the rest of the vars. */
  const screenStyle = `--load-bg:${loadBg};--load-bg2:${loadBg2};--load-accent:${loadAccent};--load-accent2:${loadAccent2};--load-glow:${scene.accent || loadAccent}${backdropStyle}${plateStyle}${frameStyle}`;
  /* The wordmark comes from the splash, gold last word included. */
  const titleHTML = sceneArt && typeof sceneArt.wordmark === 'function'
    ? sceneArt.wordmark(themeTitle) : esc(themeTitle);
  /* Same world tree as the title splash, painted behind the card so entering
     the Hollow is the title screen carrying on rather than a second screen. */
  const treeArt = sceneArt && sceneArt.tree ? sceneArt.tree : '';
  /* The splash's own treeline, from the same scene object, so the card is the
     title screen still arriving rather than a second drawing of a grove. It is
     dropped in before the world tree below, which is the splash's own stacking:
     small trees behind the trunk, never in front of it. */
  const groveArt = sceneArt && sceneArt.grove ? sceneArt.grove : '';
  /* The four things the Hollow is for, painted from the splash's own list so the
     two rows cannot drift apart instead of being held equal by a test. A splash
     that never loaded leaves the row off; it is decoration, and the card reads
     fine without it. */
  const activities = sceneArt && Array.isArray(sceneArt.activities)
    ? sceneArt.activities.filter((act) => act && act.icon && act.label)
    : [];
  const activityPills = activities
    .map((act) => `<span>${esc(act.icon)} ${esc(act.label)}</span>`).join('');
  const inner = `<div class="load-screen${backdropClass}${plateClass}" role="status" aria-live="polite"${frame ? ` data-dayframe="${esc(frame.id)}"` : ''} style="${esc(screenStyle)}">
    <div class="load-sky" aria-hidden="true">${sky}<span class="load-stars"></span><span class="load-stars far"></span><span class="load-cloud c1"></span><span class="load-cloud c2"></span><span class="load-cloud c3"></span><span class="load-cloud c4"></span><span class="load-cloud c5"></span><span class="load-cloud c6"></span><span class="load-cloud c7"></span><span class="load-cloud c8"></span></div>
    <div class="load-scrim" aria-hidden="true"></div>
    ${frameMarkup}
    <div class="load-art" style="--load-glow:${scene.accent || 'var(--accent)'}">
      <span class="load-mote m1">✦</span><span class="load-mote m2">✧</span><span class="load-mote m3">✦</span>
      ${spriteSVG(s, { expr: typeof expressionFor === 'function' ? expressionFor(s) : 'happy' })}
    </div>
    <h2 class="load-title">${titleHTML}</h2>
    <p class="load-tagline">${scene.emoji || '🌿'} ${esc(scene.name || 'Your Hollow')} · Loading ${esc(name)} · ${esc(themeTagline)}</p>
    <div class="load-line" data-load-line>${esc(sickLine || HOLLOW_LOAD_LINES[0])}</div>
    ${actions.length ? `<div class="load-actions" data-load-actions aria-hidden="true"><span data-load-action>${actions[0].icon} ${esc(actions[0].label)}</span></div>` : ''}
    ${activityPills ? `<div class="load-nav act-pills" aria-hidden="true">${activityPills}</div>` : ''}
    ${treeArt ? `<div class="load-tree" aria-hidden="true">${groveArt}${treeArt}</div>` : ''}
  </div>`;

  /* One loading screen at a time: the key closes any card already up, so a
     second call replaces it instead of stacking a duplicate nobody can reach. */
  /* The teardown is the overlay's own onClose, so the delayed close, a tap,
     Escape, the close this returns and closeAllOverlays() all run the same
     cleanup instead of only the finish path. */
  const { overlay, close } = buildOverlay(inner, {
    center: true,
    dismissible: false,
    key: 'hollow-loading',
    onClose: () => cleanup(),
  });
  /* The loading screen is the whole screen, so size it from the overlay box
     inline; no sheet or card rule can shrink it. */
  const screen = overlay.querySelector('.load-screen');
  /* The loading screen covers the whole screen at every size, and re-fits
     itself when the device is rotated mid-load. */
  const fitToViewport = () => {
    if (!screen) return;
    overlay.style.padding = '0';
    overlay.style.background = 'transparent';
    screen.style.position = 'fixed';
    screen.style.inset = '0';
    screen.style.width = '100%';
    screen.style.height = '100%';
    screen.style.maxWidth = 'none';
    screen.style.maxHeight = 'none';
    screen.style.margin = '0';
    screen.style.border = '0';
    screen.style.borderRadius = '0';
    screen.classList.toggle('is-wide', window.innerWidth > window.innerHeight);
    screen.classList.toggle('is-short', window.innerHeight < 470);
  };
  fitToViewport();
  window.addEventListener('resize', fitToViewport);
  window.addEventListener('orientationchange', fitToViewport);
  if (screen) screen.addEventListener('click', () => finish());

  /* The card covers the whole screen and a tap ends it early, so the keyboard
     needs the same exit: Escape does not leave a keyboard player sitting
     through a wait everybody else can skip. */
  const onKey = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    finish();
  };
  window.addEventListener('keydown', onKey);

  const lineEl = overlay.querySelector('[data-load-line]');
  const actionEl = overlay.querySelector('[data-load-action]');
  const actionsEl = overlay.querySelector('[data-load-actions]');
  let actionIndex = 0;
  /* Every repaint is a swap: the card starts on the first action in its markup
     and only ever paints here when the beat moves on. */
  const paintAction = (index) => {
    if (!actionEl || !actions.length) return;
    actionIndex = index;
    const action = actions[index % actions.length];
    actionEl.textContent = `${action.icon} ${action.label}`;
    actionEl.classList.remove('is-swap');
    void actionEl.offsetWidth;
    actionEl.classList.add('is-swap');
  };
  const hold = !!opts.hold;
  const duration = opts.duration || 1250;
  /* One action per beat, and only as many beats as the card can hold: a wait
     shorter than two beats shows a single hint instead of flashing the next one
     for whatever happens to be left. Derived from the elapsed clock, so a slow
     frame delays a swap rather than stacking one. */
  const ACTION_BEAT_MS = 900;
  const actionBeats = Math.max(1, Math.floor(duration / ACTION_BEAT_MS));
  const start = Date.now();
  let timer = null;
  let done = false;
  let cleaned = false;

  /* Every way out of the card runs this once. Removing the overlay alone used
     to leave the key and resize handlers bound to the window for the rest of
     the session whenever the card was closed through the close it returns. */
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    done = true;
    if (timer) clearTimeout(timer);
    window.removeEventListener('resize', fitToViewport);
    window.removeEventListener('orientationchange', fitToViewport);
    window.removeEventListener('keydown', onKey);
  }

  const finish = () => {
    if (done) return;
    cleanup();
    if (lineEl) lineEl.textContent = 'Ready!';
    if (actionsEl) actionsEl.classList.add('is-done');
    overlay.classList.add('is-leaving');
    setTimeout(close, 240);
  };

  const step = () => {
    if (done) return;
    const elapsed = Date.now() - start;
    const t = Math.min(1, elapsed / duration);
    if (lineEl && !sickLine) {
      const nextLine = HOLLOW_LOAD_LINES[Math.min(HOLLOW_LOAD_LINES.length - 1, Math.floor(t * HOLLOW_LOAD_LINES.length))];
      /* This runs every 40ms: writing the same string again is a layout pass
         for nothing, so only touch the DOM when the line actually changes. */
      if (lineEl.textContent !== nextLine) lineEl.textContent = nextLine;
    }
    if (actions.length) {
      const wanted = Math.min(actionBeats - 1, Math.floor(elapsed / ACTION_BEAT_MS)) % actions.length;
      if (wanted !== actionIndex) paintAction(wanted);
    }
    if (t >= 1) {
      if (hold) {
        if (lineEl) lineEl.textContent = sickLine || 'Ready — tap anywhere to continue';
        return;
      }
      return finish();
    }
    timer = setTimeout(step, 40);
  };
  timer = setTimeout(step, 40);
  return close;
}
