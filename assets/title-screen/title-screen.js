/* Void Crystal title / loading screen.

   Self-contained on purpose: the palette below is the icon pack's, the
   stylesheet beside this file owns the look, and nothing here reads app state
   until showBootLoading() is called. Load it before the app bundle so main.js
   finds the hook.

   One way in: Play. Escape leaves from anywhere, including while the copy is
   still loading. At readiness the copy clears, the puffle perks up once, and the
   button enables, so the screen is the logo cluster and the button, with the
   painted plate (or the vector scene) behind them. */

(function () {
  'use strict';

  const PACK = { crystal: '#7c5cff', glow: '#5ce1e6', gold: '#ffd166' };
  /* The entry frame changes with the local day and the part of the day. Each
     weekday owns the first colour; dawn, day, dusk and night own the second
     and the glow, so the same Tuesday looks different at breakfast and at
     night. Kept here because the splash paints before the app bundle loads. */
  const FRAME_DAYS = [
    { key: 'sun', name: 'Sunday', a: '#ffd166' },
    { key: 'mon', name: 'Monday', a: '#a78bfa' },
    { key: 'tue', name: 'Tuesday', a: '#5ce1e6' },
    { key: 'wed', name: 'Wednesday', a: '#86efac' },
    { key: 'thu', name: 'Thursday', a: '#ff9f43' },
    { key: 'fri', name: 'Friday', a: '#ff7ac8' },
    { key: 'sat', name: 'Saturday', a: '#6c8bff' },
  ];
  const FRAME_PHASES = {
    dawn: { name: 'dawn', a: '#ffb07a', c: '#ffe4b5' },
    day: { name: 'day', a: '#ffe08a', c: '#ffffff' },
    dusk: { name: 'dusk', a: '#c084fc', c: '#ff7a9c' },
    night: { name: 'night', a: '#5ce1e6', c: '#6c8bff' },
  };
  const FRAME_MOTIONS = {
    sweep: { name: 'Sweep' },
    breathe: { name: 'Glow' },
    pulse: { name: 'Pulse' },
    still: { name: 'Still' },
  };
  const FRAME_MOTION_KEYS = Object.keys(FRAME_MOTIONS);
  const FRAME_DEFAULTS = {
    mode: 'daily',
    a: '#ff9f43',
    b: '#5ce1e6',
    c: '#6c8bff',
    intensity: 1,
    entry: 'sweep',
    loading: 'sweep',
    menu: 'sweep',
  };
  const FRAME_HEX = /^#[0-9a-f]{6}$/i;
  const frameHex = (value, fallback) => (FRAME_HEX.test(String(value || '')) ? String(value).toLowerCase() : fallback);
  const frameMotion = (value) => (FRAME_MOTION_KEYS.includes(value) ? value : 'sweep');
  const frameIntensity = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return FRAME_DEFAULTS.intensity;
    return Math.min(1, Math.max(0.35, Math.round(number * 100) / 100));
  };

  /* The frame settings live in the same save as the rest of the Studio theme.
     They are read here because the splash paints before the app can install a
     second copy of these defaults. */
  function frameSettings() {
    const saved = typeof state !== 'undefined' && state.theme && state.theme.frame
      && typeof state.theme.frame === 'object' ? state.theme.frame : {};
    return {
      mode: saved.mode === 'custom' ? 'custom' : 'daily',
      a: frameHex(saved.a, FRAME_DEFAULTS.a),
      b: frameHex(saved.b, FRAME_DEFAULTS.b),
      c: frameHex(saved.c, FRAME_DEFAULTS.c),
      intensity: frameIntensity(saved.intensity),
      entry: frameMotion(saved.entry),
      loading: frameMotion(saved.loading),
      menu: frameMotion(saved.menu),
      presets: Array.isArray(saved.presets) ? saved.presets : [],
    };
  }
  const LOAD_LINES = [
    'Waking the Hollow…',
    'Lighting the crystal lanterns…',
    'Calling the puffles home…',
  ];
  /* What a keeper does inside the Hollow: the task list (TASK_POOL) and the
     care dock's own actions, in the order the loading screen shows them. The
     splash runs before that script, so this is the fallback copy; the app hands
     the splash the live list at boot, and the title contract test rebuilds both
     from src/data.js and src/screens/loading.js so they cannot drift. */
  const DO_LINES = [
    { icon: '🐣', label: 'Hatch an egg' },
    { icon: '🍓', label: 'Serve 3 snacks' },
    { icon: '🤲', label: 'Rub Belly' },
    { icon: '🎮', label: 'Play a sprite game' },
    { icon: '🎾', label: 'Throw Ball' },
    { icon: '🧤', label: 'Play Catch' },
    { icon: '🥾', label: 'Walk' },
    { icon: '💛', label: 'Pet your sprites' },
    { icon: '😴', label: 'Nap' },
    { icon: '🛏️', label: 'Bed' },
    { icon: '💬', label: 'Talk' },
    { icon: '🧬', label: 'Merge two sprites' },
    { icon: '🫧', label: 'Give a bubble bath' },
  ];
  /* The four things the Hollow is for. The loading card carries the same row,
     painted from this list through the scene object exported below, so the
     splash names the game's shape and neither screen owns a second copy. */
  const ACTIVITIES = [
    { icon: '🏡', label: 'Care' },
    { icon: '🎮', label: 'Play' },
    { icon: '🥚', label: 'Hatch' },
    { icon: '✨', label: 'Summon' },
  ];
  /* One action per beat while the Hollow wakes. */
  const DO_BEAT_MS = 900;
  const NAV_ICONS = ['ui-home', 'ui-codex', 'ui-adventure', 'ui-evolution', 'ui-summon', 'ui-shop'];
  const ICON_SHEET = 'assets/void-crystal/void-crystal-icons.svg';
  /* The painted title plate. Drop a file in beside this script under one of
     the names below and it replaces the vector scene; if none of them loads,
     the vector scene stays. No code change, no config.

     The most specific name wins: a seasonal orientation plate, the seasonal
     plate, the orientation plate, then the base plate. The winning file is
     remembered, so later boots ask for it first instead of re-probing every
     candidate. */
  const PLATE_DIR = 'assets/title-screen/';
  const PLATE_EXTS = ['webp', 'jpg', 'png'];
  const PLATE_MEMORY = 'sh-title-plate';
  const PLATE_MANIFEST = PLATE_DIR + 'key-art.manifest.json';

  /* One puffle for startup: the transparent art from the launcher icon, so the
     native splash, app icon and title all show the same character. The active
     starter belongs to the Hollow; first boot must not swap it in here. The
     drawn crest stays as the fallback if the image cannot load. */
  const MASCOT_SRC = 'assets/title-screen/puffle-mascot.png?v=2';
  function mascotMarkup() {
    return `<img class="sh-title__puffle" data-title-mascot src="${MASCOT_SRC}"
      alt="" width="384" height="384" decoding="async" fetchpriority="high">`;
  }

  function framePhaseKey(date) {
    /* The app's own phase accounts for the season's daylight length; the
       splash may run before it is defined, so keep a plain clock fallback. */
    if (typeof timePhase === 'function') {
      try { return timePhase(date).key; } catch (e) { /* use the clock fallback */ }
    }
    const hour = date.getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 18) return 'day';
    if (hour >= 18 && hour < 21) return 'dusk';
    return 'night';
  }

  function dailyFrame(date = new Date()) {
    const settings = frameSettings();
    if (settings.mode === 'custom') {
      return {
        id: 'custom',
        dayName: 'Custom',
        phase: 'custom',
        a: settings.a,
        b: settings.b,
        c: settings.c,
        intensity: settings.intensity,
      };
    }
    const day = FRAME_DAYS[date.getDay()] || FRAME_DAYS[0];
    const phaseKey = framePhaseKey(date);
    const phase = FRAME_PHASES[phaseKey] || FRAME_PHASES.day;
    return {
      id: `${day.key}-${phaseKey}`,
      dayName: day.name,
      phase: phase.name,
      a: day.a,
      b: phase.a,
      c: phase.c,
      intensity: settings.intensity,
    };
  }

  function frameMotionFor(kind) {
    const settings = frameSettings();
    return frameMotion(settings[kind] || 'sweep');
  }

  function applyDailyFrame(root, kind = 'entry') {
    const frame = dailyFrame();
    root.dataset.dayframe = frame.id;
    root.dataset.frameMotion = frameMotionFor(kind);
    root.style.setProperty('--sh-frame-a', frame.a);
    root.style.setProperty('--sh-frame-b', frame.b);
    root.style.setProperty('--sh-frame-c', frame.c);
    root.style.setProperty('--sh-frame-intensity', String(frame.intensity));
    return frame;
  }

  function dailyFrameEdges() {
    return `
      <span class="sh-dayframe__edge sh-dayframe__edge--top"></span>
      <span class="sh-dayframe__edge sh-dayframe__edge--right"></span>
      <span class="sh-dayframe__edge sh-dayframe__edge--bottom"></span>
      <span class="sh-dayframe__edge sh-dayframe__edge--left"></span>`;
  }

  function dailyFrameMarkup(kind = 'entry', extraClass = '', extraAttrs = '') {
    return `<div class="sh-dayframe${extraClass ? ` ${extraClass}` : ''}"${extraAttrs ? ` ${extraAttrs}` : ''} data-frame-kind="${kind}" data-frame-motion="${frameMotionFor(kind)}" aria-hidden="true">${dailyFrameEdges()}
    </div>`;
  }

  function plateSeason() {
    const month = new Date().getMonth();
    if (month === 11 || month <= 1) return 'winter';
    if (month <= 4) return 'spring';
    if (month <= 7) return 'summer';
    return 'autumn';
  }

  function plateCandidates() {
    const season = plateSeason();
    const wide = typeof window !== 'undefined' && window.innerWidth > window.innerHeight;
    const orientation = wide ? 'wide' : 'tall';
    const names = [
      `key-art-${season}-${orientation}`,
      `key-art-${season}`,
      `key-art-${orientation}`,
      'key-art',
    ];
    return names.flatMap((name) => PLATE_EXTS.map((ext) => `${PLATE_DIR}${name}.${ext}`));
  }

  /* The plate is backdrop art, never something the splash must have, so a
     metered or data-saver connection keeps the vector scene. */
  function plateAllowed(nav, media) {
    const connection = nav && (nav.connection || nav.mozConnection || nav.webkitConnection);
    if (connection && connection.saveData) return false;
    if (connection && /(^|-)(slow-)?2g$/.test(String(connection.effectiveType || ''))) return false;
    if (media && media('(prefers-reduced-data: reduce)').matches) return false;
    return true;
  }

  function rememberedPlate() {
    try { return localStorage.getItem(PLATE_MEMORY) || ''; } catch (e) { return ''; }
  }

  function rememberPlate(src) {
    try {
      if (src) localStorage.setItem(PLATE_MEMORY, src);
      else localStorage.removeItem(PLATE_MEMORY);
    } catch (e) { /* storage can be unavailable; the probe order still works */ }
  }

  /* The splash that is currently listening. A second preview must take the
     keys and timers from the first, or Escape and the safety timer would keep
     firing into a removed screen. */
  let dismissActive = null;

  /* The Android shell draws a native splash over the WebView until the page
     says it has something painted. The title screen is that something, so
     release it on the title's first frame instead of waiting for the app
     frame behind it (which would hide the title entirely). */
  function nativeSplashReady() {
    try {
      if (window.HollowSplash && typeof window.HollowSplash.ready === 'function') {
        window.HollowSplash.ready();
      }
    } catch (e) { /* the native splash also has its own timeout */ }
  }

  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  /* The wordmark, in the one form both screens paint: the last word takes the
     gold `<em>`. The splash and the card each split the title in their own copy
     of this before; a rule (the gold last word) with two implementations drifts
     the first time one of them changes. */
  function wordmark(raw) {
    const words = String(raw || '').trim().split(/\s+/).filter(Boolean);
    const last = words.length > 1 ? words.pop() : '';
    return `${esc(words.join(' '))}${last ? ` <em>${esc(last)}</em>` : ''}`;
  }

  /* The player's Studio backdrop as values, not markup: the splash paints them
     as classes and CSS variables on its root, the card as a class and one style
     string. Computed once here so "custom" cannot mean two things, and so the
     card cannot keep building a backdrop nobody styles (which is what it did). */
  function backdropFor(theme) {
    const mode = (theme && theme.titleBackdrop) || 'theme';
    const image = mode === 'image' ? String((theme && theme.titleImage) || '') : '';
    return {
      mode,
      image,
      custom: mode !== 'theme',
      c1: (theme && theme.titleColor1) || '#1b1740',
      c2: (theme && theme.titleColor2) || '#0b0a16',
      angle: Number(theme && theme.titleAngle) || 145,
      dim: Math.max(0, Math.min(90, Number(theme && theme.titleDim) || 45)) / 100,
    };
  }

  /* Mascot crest: Royal Hollow Puff, crystal crown, wings, pedestal. */
  const CREST = `
  <svg viewBox="0 0 160 160" aria-hidden="true">
    <defs>
      <linearGradient id="shv-fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f8faff"/><stop offset="1" stop-color="#c9d4e8"/>
      </linearGradient>
      <linearGradient id="shv-wing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${PACK.crystal}"/><stop offset="1" stop-color="${PACK.glow}"/>
      </linearGradient>
      <linearGradient id="shv-crown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#5b21b6"/>
      </linearGradient>
      <linearGradient id="shv-pedestal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PACK.glow}"/><stop offset="1" stop-color="#24123a"/>
      </linearGradient>
    </defs>
    <ellipse cx="80" cy="146" rx="52" ry="9" fill="#0b1020" opacity=".65"/>
    <circle cx="80" cy="86" r="52" fill="none" stroke="${PACK.glow}" stroke-opacity=".28" stroke-width="1.4"/>
    <path d="M40 74 14 62l20 26-22 6 30 8z" fill="url(#shv-wing)" stroke="${PACK.glow}" stroke-width="1.6" stroke-opacity=".8"/>
    <path d="M120 74l26-12-20 26 22 6-30 8z" fill="url(#shv-wing)" stroke="${PACK.glow}" stroke-width="1.6" stroke-opacity=".8"/>
    <path d="M62 128h36l-6 16H68z" fill="url(#shv-pedestal)" stroke="${PACK.glow}" stroke-width="2"/>
    <path d="M72 118l8-14 8 14z" fill="${PACK.glow}" opacity=".9"/>
    <circle cx="56" cy="72" r="13" fill="url(#shv-fur)"/>
    <circle cx="104" cy="72" r="13" fill="url(#shv-fur)"/>
    <path d="M80 44c22 0 38 17 38 38 0 20-17 34-38 34S42 102 42 82c0-21 16-38 38-38Z"
          fill="url(#shv-fur)" stroke="${PACK.crystal}" stroke-opacity=".45" stroke-width="2"/>
    <ellipse cx="66" cy="82" rx="6" ry="7.5" fill="${PACK.glow}"/>
    <ellipse cx="94" cy="82" rx="6" ry="7.5" fill="${PACK.glow}"/>
    <circle cx="66" cy="79.5" r="2" fill="#f8faff"/>
    <circle cx="94" cy="79.5" r="2" fill="#f8faff"/>
    <path d="M74 99c4 4 8 4 12 0" fill="none" stroke="${PACK.crystal}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M59 44 62 21l11 11 7-14 7 14 11-11 3 23z"
          fill="url(#shv-crown)" stroke="${PACK.gold}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="80" cy="26" r="3.4" fill="${PACK.glow}"/>
    <path d="M59 44h42" stroke="${PACK.gold}" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;

  /* Crystal world tree behind the title. The geometry is declared once: the
     solid branches and the dashed light that runs along them are two strokes
     of the same list, so a branch can never be added to only one of them. */
  const TREE_BRANCHES = [
    'M200 400V214',
    'M200 268c-26-10-44-34-52-62',
    'M200 246c30-12 52-36 60-70',
    'M158 236c-16-6-30-22-36-40',
    'M244 226c18-10 30-26 34-46',
    'M200 214c-18-22-22-48-14-74',
    'M200 214c20-20 26-46 18-72',
  ];
  const branchPaths = () => TREE_BRANCHES.map((d) => `<path d="${d}"/>`).join('');
  const TREE = `
  <svg viewBox="0 0 400 400" aria-hidden="true">
    <g class="sh-tree-branches" fill="none" stroke="${PACK.crystal}" stroke-opacity=".55" stroke-width="7" stroke-linecap="round">${branchPaths()}</g>
    <!-- The same branches, dashed: the dashes travel, so light runs up the
         tree instead of the canopy sitting still behind the copy. -->
    <g class="sh-tree-flow" fill="none" stroke="${PACK.glow}" stroke-width="3.2" stroke-linecap="round" opacity=".9">${branchPaths()}</g>
    <g class="sh-tree-leaves" fill="${PACK.glow}" opacity=".75">
      <path d="M148 206l10 20 20 10-20 10-10 20-10-20-20-10 20-10z"/>
      <path d="M252 180l8 16 16 8-16 8-8 16-8-16-16-8 16-8z"/>
      <path d="M200 140l9 18 18 9-18 9-9 18-9-18-18-9 18-9z"/>
      <path d="M124 196l6 12 12 6-12 6-6 12-6-12-12-6 12-6z"/>
      <path d="M276 176l6 12 12 6-12 6-6 12-6-12-12-6 12-6z"/>
    </g>
    <g class="sh-tree-crystals" fill="${PACK.crystal}" opacity=".22">
      <path d="M186 262l7 14 14 7-14 7-7 14-7-14-14-7 14-7z"/>
      <path d="M222 268l6 12 12 6-12 6-6 12-6-12-12-6 12-6z"/>
    </g>
  </svg>`;

  /* The grove around the world tree: eight smaller crystal trees at the foot of
     the scene, so the sky reads as the Hollow at dusk instead of one tree on an
     empty hill. A tree is a trunk, two branches and a spray of four-point
     leaves; every tree comes from this list, so another is one line. The card
     paints this same string, which is why it is exported beside the big tree. */
  const GROVE_TREES = [
    { x: 24, h: 84, r: 13 },
    { x: 58, h: 118, r: 17 },
    { x: 92, h: 66, r: 10 },
    { x: 128, h: 94, r: 13 },
    { x: 272, h: 88, r: 12 },
    { x: 310, h: 122, r: 17 },
    { x: 346, h: 70, r: 11 },
    { x: 380, h: 96, r: 14 },
  ];
  /* The four-point crystal leaf, the same diamond the world tree's canopy is
     built from, so a small tree and the big one are the same material. This has
     to emit the element, not the path data: a bare `M…z` in the group is a text
     node, which SVG lays out as nothing — the crowns were invisible on both
     screens, and the catch-the-light rule had no element to animate. */
  const spark = (cx, cy, r) => `<path d="M${cx} ${cy - r}l${r} ${r}-${r} ${r}-${r}-${r}z"/>`;
  const groveTree = (x, { h, r }) => {
    const top = 152 - h;
    const trunk = `<path d="M${x} 152V${top + r * 0.6}"/>`
      + `<path d="M${x} ${152 - h * 0.45}l${-r} ${-r * 0.85}"/>`
      + `<path d="M${x} ${152 - h * 0.62}l${r * 0.95} ${-r * 0.8}"/>`;
    const crown = [spark(x, top, r),
      spark(x - r * 1.3, top + r * 0.9, r * 0.6),
      spark(x + r * 1.3, top + r * 0.9, r * 0.6),
      spark(x - r * 0.1, top - r * 1.15, r * 0.45)].join('');
    return `<g class="sh-grove-tree">`
      + `<g class="sh-grove-trunks" fill="none" stroke="${PACK.crystal}" stroke-opacity=".62" stroke-width="3.4" stroke-linecap="round">${trunk}</g>`
      + `<g class="sh-grove-crowns" fill="${PACK.glow}" opacity=".8">${crown}</g>`
      + `</g>`;
  };
  const groveSvg = (width, cls, trees) =>
    `<svg class="sh-grove ${cls}" viewBox="0 0 ${width} 152" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${trees}</svg>`;
  /* One copy of the eight reaches only ~600px at the band's cap, so a wide
     window got a copse under the hero with bare foot either side. Wide screens
     paint three copies in one 1200-unit svg — built by the same groveTree, so a
     tree cannot differ between the copies — and hide the near one; a phone
     hides the wide one. Both ship in the one string the card paints, so the two
     screens cannot disagree about which treeline they are drawing. */
  /* Three copies of the same eight, so every window has a treeline that reaches
     both edges without the crowns changing size: one copy at the cap covers
     600px, two cover 1200, three 1800. A window picks the largest copy that
     still fits its width (CSS), and each switch is a width the previous copy
     has already run out of room at. */
  const GROVE = groveSvg(400, 'sh-grove--near',
    GROVE_TREES.map((tree) => groveTree(tree.x, tree)).join(''))
    + groveSvg(800, 'sh-grove--mid', [0, 1]
      .map((copy) => GROVE_TREES.map((tree) => groveTree(tree.x + copy * 400, tree)).join(''))
      .join(''))
    + groveSvg(1200, 'sh-grove--wide', [0, 1, 2]
      .map((copy) => GROVE_TREES.map((tree) => groveTree(tree.x + copy * 400, tree)).join(''))
      .join(''));

  const ISLE = `
  <svg viewBox="0 0 120 90" aria-hidden="true">
    <path d="M12 46c8-18 30-26 48-26s40 8 48 26c-6 14-18 20-30 22l-18 14-18-14C30 66 18 60 12 46Z"
          fill="#24123a" stroke="${PACK.glow}" stroke-opacity=".75" stroke-width="2.4"/>
    <ellipse cx="60" cy="44" rx="46" ry="12" fill="#151b31" stroke="${PACK.glow}" stroke-width="2"/>
    <path d="M60 12l12 22-12 10-12-10z" fill="${PACK.crystal}" stroke="#f8faff" stroke-opacity=".8" stroke-width="1.6"/>
    <path d="M30 26l7 14-7 7-7-7z" fill="${PACK.glow}"/>
  </svg>`;

  /* The icon pack is a plain SVG file, and <use href="#id"> only resolves
     inside the same document, so inline its symbols once. The row is
     decoration: if the fetch fails it is simply dropped. */
  function inlineIconSheet(root) {
    if (typeof fetch !== 'function') return;
    fetch(ICON_SHEET)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('sheet ' + res.status))))
      .then((svg) => {
        const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
        const defs = doc.querySelector('defs');
        const symbols = Array.from(doc.querySelectorAll('symbol'));
        if (!defs || !symbols.length) throw new Error('sheet has no symbols');
        const host = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        host.setAttribute('aria-hidden', 'true');
        host.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
        host.appendChild(document.importNode(defs, true));
        symbols.forEach((symbol) => host.appendChild(document.importNode(symbol, true)));
        root.appendChild(host);
      })
      .catch(() => {
        const nav = root.querySelector('.sh-title__nav');
        if (nav) nav.remove();
      });
  }

  /* Read the build's small plate manifest, then request only files it lists.
     This keeps the drop-in names and priority order, but an empty folder costs
     one manifest read instead of twelve 404 probes. The vector scene remains
     the fallback and the read starts after the first frame so it cannot compete
     with boot data. */
  function loadKeyArt(root, layer) {
    if (!plateAllowed(navigator, window.matchMedia ? window.matchMedia.bind(window) : null)) {
      root.dataset.plate = 'skipped';
      layer.remove();
      return;
    }
    const showPlate = (src) => {
      if (!root.isConnected) return;
      layer.src = src;
      layer.decoding = 'async';
      layer.dataset.plate = src.startsWith(PLATE_DIR) ? src.slice(PLATE_DIR.length) : src;
      root.dataset.plate = 'art';
      root.classList.add('has-art');
      rememberPlate(src);
    };
    const settle = () => {
      root.dataset.plate = 'none';
      layer.remove();
    };
    const remembered = rememberedPlate();
    const begin = () => {
      if (!root.isConnected) return;
      if (typeof fetch !== 'function') {
        settle();
        return;
      }
      fetch(PLATE_MANIFEST, { cache: 'no-store', priority: 'low' })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!root.isConnected) return;
          const available = new Set(Array.isArray(data && data.plates) ? data.plates : []);
          const queue = [];
          const seen = new Set();
          const push = (src) => {
            if (src && !seen.has(src)) { seen.add(src); queue.push(src); }
          };
          if (remembered && available.has(remembered)) push(remembered);
          else if (remembered) rememberPlate('');
          plateCandidates().filter((src) => available.has(src)).forEach(push);
          if (!queue.length) {
            settle();
            return;
          }
          let next = 0;
          const tryNext = () => {
            if (!root.isConnected) return;
            if (next >= queue.length) {
              settle();
              return;
            }
            const src = queue[next++];
            const probe = new Image();
            probe.fetchPriority = 'low';
            probe.onload = () => showPlate(src);
            probe.onerror = () => {
              /* A remembered plate that no longer exists is dropped, so the
                 next boot does not start on a stale miss. */
              if (src === rememberedPlate()) rememberPlate('');
              tryNext();
            };
            probe.src = src;
          };
          tryNext();
        })
        .catch(settle);
    };
    /* One small manifest read after the first frame is cheap; the twelve image
       candidates only exist if the manifest names them. */
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(begin, { timeout: 300 });
    } else {
      setTimeout(begin, 0);
    }
  }

  function showBootLoading(done, opts) {
    if (dismissActive) dismissActive();
    const hold = !!(opts && opts.hold);
    /* A supplied promise is the real boot signal (sprite data). Without one,
       the Studio preview and the focused splash regression keep the timed
       path. The progress reader is optional so a simple promise still works. */
    const readiness = opts && opts.ready;
    const progressFn = opts && typeof opts.progress === 'function' ? opts.progress : null;
    const hasReadiness = !!readiness;
    /* The app passes its live task + care list, so the splash and the loading
       card name the same things; the fallback above is for the standalone
       splash (tests, the first paint before the game scripts load). */
    const doActions = opts && Array.isArray(opts.actions) && opts.actions.length ? opts.actions : DO_LINES;
    const safetyGrace = opts && Number.isFinite(Number(opts.safetyMs))
      ? Math.max(0, Number(opts.safetyMs)) : 4000;
    const app = document.getElementById('app');
    if (!app) {
      if (typeof done === 'function') done();
      return;
    }
    /* Calm lands on <html> (applyTheme), while the OS preference is a media
       query. step() checks both while the splash is mounted, so a preference
       switched on mid-splash shortens the hold without a change listener. */
    const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const reducedMotion = () => (motionQuery && motionQuery.matches)
      || document.documentElement.classList.contains('reduce-motion');
    let minimum = reducedMotion() ? 420 : 1500;
    const pal = typeof themePalette === 'function' && typeof state !== 'undefined'
      ? themePalette(state.theme)
      : { accent: PACK.crystal, accent2: PACK.glow };
    const theme = (typeof state !== 'undefined' && state.theme) || {};
    const themeUI = typeof THEMES !== 'undefined' ? THEMES[theme.ui] : null;
    const themeFont = typeof UI_FONTS !== 'undefined' ? UI_FONTS[theme.font] : null;
    const themeGlow = typeof THEME_GLOWS !== 'undefined' ? THEME_GLOWS[theme.glow] : null;
    const titleHTML = wordmark(theme.title || 'Sprite Hollow');
    const backdrop = backdropFor(theme);
    /* The one data-saver verdict for this splash: the painted plate, the icon
       sheet and the mascot image all read it, so a metered boot skips the whole
       art budget instead of three quarters of it. */
    const dataSaver = !plateAllowed(navigator,
      window.matchMedia ? window.matchMedia.bind(window) : null);

    /* First run keeps the starter picker on this same screen instead of opening
       a second title page after Play. The picker markup comes from the game
       bundle, which owns the egg art and the starter data. */
    const introOpts = opts && opts.intro && opts.intro.markup ? opts.intro : null;
    const root = document.createElement('div');
    root.className = `boot-screen sh-title${introOpts ? ' has-intro' : ''}`;
    if (hold) root.dataset.hold = 'true';
    root.style.setProperty('--shv-crystal', pal.accent);
    root.style.setProperty('--shv-glow', pal.accent2);
    root.style.setProperty('--shv-bg', pal.bg);
    root.style.setProperty('--shv-bg2', pal.bg2);
    if (themeUI) {
      root.style.setProperty('--shv-text', themeUI.text);
      root.style.setProperty('--shv-muted', themeUI.muted);
    }
    if (themeFont && themeFont.stack) root.style.setProperty('--shv-font', themeFont.stack);
    if (themeGlow) root.style.setProperty('--shv-glow-strength', String(themeGlow.strength));
    root.style.setProperty('--load-accent', pal.accent);
    root.style.setProperty('--load-accent2', pal.accent2);
    root.style.setProperty('--load-glow', pal.accent2);
    root.style.setProperty('--load-bg', pal.bg2);
    applyDailyFrame(root);
    if (backdrop.custom) {
      root.classList.add('is-custom');
      root.style.setProperty('--boot-c1', backdrop.c1);
      root.style.setProperty('--boot-c2', backdrop.c2);
      root.style.setProperty('--boot-angle', `${backdrop.angle}deg`);
      root.style.setProperty('--boot-dim', String(backdrop.dim));
      if (backdrop.image) root.style.setProperty('--boot-image-layer', `url(${JSON.stringify(backdrop.image)})`);
    }
    const loaderLayer = !dataSaver && typeof themeLoaderHTML === 'function'
      ? `<span class="sh-title__loader" aria-hidden="true">${themeLoaderHTML(theme.loader, 14)}</span>`
      : '';
    root.innerHTML = `<div class="sh-title__sky" aria-hidden="true">
      <span class="sh-title__stars"></span>
      <span class="sh-title__stars sh-title__stars--far"></span>
      <span class="sh-title__stars sh-title__stars--near"></span>
      ${loaderLayer}
      <div class="sh-title__clouds">
        <span class="sh-cloud"></span><span class="sh-cloud"></span><span class="sh-cloud"></span><span class="sh-cloud"></span><span class="sh-cloud"></span>
      </div>
      <div class="sh-title__grove">${GROVE}</div>
      <div class="sh-title__tree">${TREE}</div>
      <div class="sh-title__isle sh-title__isle--l">${ISLE}</div>
      <div class="sh-title__isle sh-title__isle--r">${ISLE}</div>
      <span class="sh-title__shard sh-title__shard--a"></span>
      <span class="sh-title__shard sh-title__shard--b"></span>
      <span class="sh-title__shard sh-title__shard--c"></span>
      <span class="sh-title__fog"></span>
    </div>
    <img class="sh-title__art" alt="" decoding="async">
    <div class="sh-title__scrim" aria-hidden="true"></div>
    ${dailyFrameMarkup()}
    <div class="sh-title__inner">
      <div class="sh-title__crest" aria-hidden="true">${dataSaver ? CREST : mascotMarkup()}</div>
      <h1 class="sh-title__title">${titleHTML}</h1>
      <p class="sh-title__tag">${esc(theme.tagline || 'A tiny creature sanctuary')}</p>
      <div class="sh-title__nav" aria-hidden="true">
        ${NAV_ICONS.map((id) => `<span><svg viewBox="0 0 64 64"><use href="#${id}"/></svg></span>`).join('')}
      </div>
      <div class="sh-title__acts act-pills" aria-hidden="true">${ACTIVITIES.map((act) => `<span>${act.icon} ${esc(act.label)}</span>`).join('')}</div>
      <div class="sh-title__intro" data-boot-intro hidden></div>
      <div class="sh-title__line" data-boot-line role="status" aria-live="polite" aria-atomic="true">${esc(LOAD_LINES[0])}</div>
      <div class="sh-title__do" aria-hidden="true"><span data-boot-do>${doActions[0].icon} ${esc(doActions[0].label)}</span></div>
      <button type="button" class="sh-title__btn" data-boot-enter disabled>Play</button>
      <div class="sh-title__version">v${typeof APP_VERSION !== 'undefined' ? APP_VERSION : '3'}</div>
    </div>`;
    app.innerHTML = '';
    app.appendChild(root);
    /* The mascot is decorative, so a missing file quietly falls back to the
       drawn crest instead of leaving an empty character slot. */
    const mascot = root.querySelector('[data-title-mascot]');
    if (mascot) {
      const crestFallback = () => {
        if (mascot.isConnected) mascot.outerHTML = CREST;
      };
      mascot.addEventListener('error', crestFallback, { once: true });
      if (mascot.complete && !mascot.naturalWidth) crestFallback();
    }
    /* Two frames: one to mount, one to commit the title's first paint. If the
       splash was replaced before that paint, its successor owns the release. */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root.isConnected) nativeSplashReady();
    }));
    /* The icon row is decoration, so a metered or data-saver connection keeps
       the plain title instead of spending a request on it. */
    if (!dataSaver) {
      inlineIconSheet(root);
    } else {
      const nav = root.querySelector('.sh-title__nav');
      if (nav) nav.remove();
    }
    const artLayer = root.querySelector('.sh-title__art');
    /* A player's Studio backdrop already owns the background. */
    if (artLayer && root.classList.contains('is-custom')) artLayer.remove();
    else if (artLayer) loadKeyArt(root, artLayer);

    const lineEl = root.querySelector('[data-boot-line]');
    const doEl = root.querySelector('[data-boot-do]');
    let doIndex = 0;
    const enterBtn = root.querySelector('[data-boot-enter]');
    const introEl = root.querySelector('[data-boot-intro]');
    let selectedStarter = 0;
    let starterPicks = [];
    if (introOpts && introEl) {
      introEl.innerHTML = String(introOpts.markup);
      introEl.hidden = false;
      starterPicks = Array.from(introEl.querySelectorAll('[data-starter]'));
      const selectStarter = (index) => {
        selectedStarter = Math.max(0, Math.min(starterPicks.length - 1, Number(index) || 0));
        starterPicks.forEach((pick, i) => {
          const on = i === selectedStarter;
          pick.classList.toggle('is-selected', on);
          pick.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      };
      starterPicks.forEach((pick, index) => {
        pick.addEventListener('click', () => {
          selectStarter(index);
          launchIntro(index);
        });
      });
      if (starterPicks.length) selectStarter(0);
      const restore = introEl.querySelector('[data-intro-restore]');
      if (restore && typeof introOpts.restore === 'function') {
        restore.addEventListener('click', () => introOpts.restore());
      }
    }
    const start = Date.now();
    let finished = false;
    let released = false;
    /* How long the readiness perk-up gets before a non-held splash fades out. */
    const READY_BEAT_MS = 280;
    let beat = 0;
    let dataReady = !hasReadiness;
    let safety = 0;
    let leaving = 0;

    const readProgress = () => {
      /* Without a reader, leave the first line up until readiness clears it;
         there is no bar and no reason to claim a later phase. */
      if (!progressFn) return 0;
      try {
        const value = progressFn();
        const pct = typeof value === 'number' ? value : value && value.percent;
        if (Number.isFinite(pct)) return Math.max(0, Math.min(100, pct));
      } catch (e) { /* progress is a hint; readiness still releases the splash */ }
      return 0;
    };

    const setLine = (pct) => {
      if (!lineEl || pct >= 100) return;
      const index = Math.min(LOAD_LINES.length - 1,
        Math.floor((pct / 100) * LOAD_LINES.length));
      lineEl.textContent = LOAD_LINES[index];
    };

    /* Give up the keys and timers. A replacement splash calls this so the old
       one cannot finish into a screen that is no longer there. */
    const detach = () => {
      finished = true;
      clearTimeout(safety);
      clearTimeout(leaving);
      clearTimeout(beat);
      window.removeEventListener('keydown', onKey);
      if (dismissActive === detach) dismissActive = null;
    };
    dismissActive = detach;

    const finish = () => {
      if (finished) return;
      detach();
      root.classList.add('is-leaving');
      /* Matches the opacity transition on .sh-title, so the fade completes. */
      leaving = setTimeout(() => {
        root.remove();
        if (typeof done === 'function') done();
      }, reducedMotion() ? 80 : 420);
    };

    const ready = () => {
      if (finished || released) return;
      released = true;
      /* One perk-up, once: the class is the whole state, so the beat cannot
         restart and nothing loops afterwards. */
      root.classList.add('is-ready');
      /* The button says everything now; clear the copy so the screen does not
         announce "Ready" over the action. The line keeps its reserved height,
         so nothing jumps when the text goes. */
      if (lineEl) lineEl.textContent = '';
      /* Same rule as the copy: the hint clears too, so the ready screen is the
         logo cluster and the scene, with nothing left talking. */
      if (doEl) doEl.textContent = '';
      /* On a first run the starter grid is already on this screen. The egg is
         the action, so the screen never waits on an extra Play gate. */
      if (introOpts) {
        if (enterBtn) enterBtn.disabled = true;
        return;
      }
      if (enterBtn) {
        enterBtn.disabled = false;
        if (hold) {
          try { enterBtn.focus({ preventScroll: true }); } catch (e) { /* focus is optional */ }
        }
      }
      if (hold) return;
      /* Let the perk-up read before the fade. Without motion there is no beat
         to watch, so the splash keeps its immediate handoff. */
      if (reducedMotion()) finish();
      else beat = setTimeout(finish, READY_BEAT_MS);
    };

    const step = () => {
      /* Readiness ends the copy: a second frame loop (the ready promise and the
         mount both start one) must not repaint the line it just cleared. */
      if (finished || released) return;
      if (minimum > 420 && reducedMotion()) minimum = 420;
      const elapsed = Date.now() - start;
      /* The action line turns over on its own beat, on the bottom band with the
         loading copy and well clear of the icon row. */
      const wantedDo = Math.floor(elapsed / DO_BEAT_MS) % doActions.length;
      if (doEl && wantedDo !== doIndex) {
        doIndex = wantedDo;
        doEl.textContent = `${doActions[doIndex].icon} ${doActions[doIndex].label}`;
        doEl.classList.remove('is-swap');
        void doEl.offsetWidth;
        doEl.classList.add('is-swap');
      }
      if (!hasReadiness) {
        const t = Math.min(1, elapsed / minimum);
        const pct = Math.round(t * 100);
        setLine(pct);
        if (t >= 1) return ready();
        requestAnimationFrame(step);
        return;
      }
      /* The copy follows files actually loaded, capped at 99 until readiness
         and the minimum hold are both satisfied. A slow data load therefore
         looks slow instead of completing on a timer. */
      const pct = Math.min(99, Math.round(readProgress()));
      setLine(pct);
      if (dataReady && elapsed >= minimum) return ready();
      requestAnimationFrame(step);
    };

    /* A rejection still releases the splash: the loader records errors and
       resolves, but a broken or replaced boot signal must not strand the UI. */
    const settleReadiness = () => {
      dataReady = true;
      if (!finished) step();
    };
    if (hasReadiness) Promise.resolve(readiness).then(settleReadiness, settleReadiness);
    requestAnimationFrame(step);

    function onKey(event) {
      if (event.key !== 'Escape' || introOpts) return;
      event.preventDefault();
      finish();
    }
    const launchIntro = (index) => {
      if (!introOpts || typeof introOpts.start !== 'function' || finished) return;
      detach();
      root.classList.add('is-leaving');
      /* Let the fade complete before the shell replaces the title, so the
         chosen egg does not pop straight from one screen to the next. */
      leaving = setTimeout(() => {
        root.remove();
        introOpts.start(Number.isFinite(Number(index)) ? Number(index) : selectedStarter);
      }, reducedMotion() ? 0 : 220);
    };
    enterBtn.addEventListener('click', () => {
      if (introOpts) return launchIntro(selectedStarter);
      finish();
    });
    window.addEventListener('keydown', onKey);
    /* A splash must never hold the app hostage. If sprite data is still slow
       after the minimum hold plus the grace period, release the app anyway;
       App.ready queues tabs until the data arrives. A held preview waits for
       the player instead, because that is the thing it is previewing. */
    if (!hold) {
      safety = setTimeout(() => {
        if (!finished) ready();
      }, minimum + safetyGrace);
    }
  }

  window.showBootLoading = showBootLoading;
  /* The loading card paints this same world tree and its grove, so entering
     the Hollow looks like the title screen carrying on instead of a separate
     screen. */
  window.titleScreenScene = {
    tree: TREE,
    grove: GROVE,
    frame: dailyFrame,
    frameMarkup: dailyFrameMarkup,
    frameEdges: dailyFrameEdges,
    settings: frameSettings,
    motion: frameMotionFor,
    motions: FRAME_MOTIONS,
    activities: ACTIVITIES,
    wordmark,
    backdrop: backdropFor,
    /* A function, not the value: a stale remembered plate is cleared after the
       splash probes it, and the card must read what is true when it opens. */
    plate: rememberedPlate,
  };
})();
