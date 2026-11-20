/* App shell, routing, and boot. */

/* Screens that live in a lazy route chunk (see src/boot-routes.js). */
const LAZY_TAB_ROUTES = { wiki: 'codex', roster: 'codex' };

/* The native shell asks for notification permission here, after the player has
   actually touched Home or Play. Asking during startup covers the title/first
   screen; asking once on either destination keeps it tied to a real action. */
const ReminderPermission = {
  asked: false,
  ask() {
    if (this.asked) return;
    this.asked = true;
    if (typeof Notifier !== 'undefined') Notifier.ask();
  },
  bind(tab, screen) {
    if (this.asked || !screen || (tab !== 'hollow' && tab !== 'play')) return null;
    const askAfterTap = () => {
      if (this.asked) return;
      /* Let the tap's own action run before the system dialog takes focus. */
      setTimeout(() => this.ask(), 0);
    };
    screen.addEventListener('click', askAfterTap, { once: true });
    return () => screen.removeEventListener('click', askAfterTap);
  },
};

const App = {
  tab: 'hollow',
  cleanup: null,
  /* The shell can paint before sprite/wiki data has finished loading. Tabs
     queue their destination instead of mounting a screen against empty data. */
  ready: false,
  pendingTab: null,
  go(tab) {
    if (!state.started) return;
    /* The codex chunk carries wiki and roster. Load it before mounting, or the
       screen function would not exist yet. */
    const route = LAZY_TAB_ROUTES[tab];
    if (route && typeof ensureRoute === 'function'
        && !(window.shRouteLoaded || {})[route]) {
      this.setTabWaiting(true);
      ensureRoute(route).then(() => {
        this.setTabWaiting(false);
        this.go(tab);
      }, () => {
        this.setTabWaiting(false);
        if (typeof toast === 'function') toast('That section could not load.', '⚠️');
      });
      return;
    }
    /* An explicit navigation supersedes a tab tap that was waiting on data. */
    this.pendingTab = null;
    closeChat();
    closeAllOverlays();
    const from = this.tab;
    this.tab = tab;
    this.mount();
    if (tab === 'hollow' && from !== 'hollow' && typeof showHollowLoading === 'function') showHollowLoading();
    Sfx.click();
  },
  requestTab(tab) {
    if (!state.started || !tab) return;
    if (!this.ready) {
      this.pendingTab = tab;
      this.setTabWaiting(true);
      return;
    }
    this.go(tab);
  },
  markReady() {
    if (this.ready) return;
    this.ready = true;
    this.setTabWaiting(false);
    const pending = this.pendingTab;
    this.pendingTab = null;
    if (pending && pending !== this.tab) this.go(pending);
  },
  setTabWaiting(waiting) {
    const tabbar = document.querySelector('.tabbar');
    if (!tabbar) return;
    tabbar.classList.toggle('is-waiting', waiting);
    tabbar.setAttribute('aria-busy', waiting ? 'true' : 'false');
  },
  refresh() {
    if (!state.started) return;
    this.mount();
  },
  mount() {
    const screen = document.getElementById('screen');
    if (!screen) return;
    if (this.cleanup) {
      try { this.cleanup(); } catch (err) { console.error(err); }
      this.cleanup = null;
    }
    screen.innerHTML = '';
    screen.className = `screen${this.tab === 'hollow' ? ' is-hollow' : ''}`;
    screen.scrollTop = 0;
    /* Names, not values: a lazy chunk's screen does not exist until it loads,
       and touching the identifier here would throw before that. */
    const screens = {
      hollow: 'hollowScreen',
      collection: 'collectionScreen',
      foods: 'foodsScreen',
      codex: 'codexScreen',
      wiki: 'wikiScreen',
      roster: 'rosterScreen',
      nest: 'nestScreen',
      summon: 'summonScreen',
      play: 'playScreen',
      senthome: 'sentHomeScreen',
      home: 'homeScreen',
      hotel: 'hotelScreen',
      inventory: 'furnitureScreen',
      today: 'todayScreen',
    };
    const name = screens[this.tab] || 'hollowScreen';
    const fn = typeof window[name] === 'function' ? window[name] : hollowScreen;
    const screenCleanup = fn(screen) || null;
    const reminderCleanup = ReminderPermission.bind(this.tab, screen);
    const cleanups = [screenCleanup, reminderCleanup].filter((cleanup) => typeof cleanup === 'function');
    this.cleanup = cleanups.length ? () => cleanups.forEach((cleanup) => cleanup()) : null;
    if (typeof startBiomeAmbience === 'function') {
      if (this.tab === 'hollow') startBiomeAmbience(state.theme.scene);
      else if (typeof stopBiomeAmbience === 'function') stopBiomeAmbience();
    }
    document.querySelectorAll('.tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === (this.tab === 'wiki' || this.tab === 'roster' ? 'codex' : this.tab));
    });
    syncAppDayFrame(this.tab);
    updateBadges();
    if (typeof mountAppLayoutDebug === 'function') mountAppLayoutDebug();
  },
  startGame(kind) {
    openGame(kind);
  },
  openChat(id) {
    closeChat();
    openChatView(id);
  },
  openDetail(id) {
    closeAllOverlays();
    openSpriteDetail(id);
  },
  openStudio(opts) {
    closeAllOverlays();
    openStudioSheet(opts || {});
  },
  openHatch(id, opts) {
    openHatchFlow(id, opts || {});
  },
};

let previousCoins = state.coins;

function updateTopbar(detail = {}) {
  const coinsEl = document.querySelector('[data-coins]');
  if (coinsEl) coinsEl.textContent = state.coins;
  const sub = document.querySelector('[data-hollow-sub]');
  if (sub) sub.textContent = state.hollowName;
  const pill = document.querySelector('[data-coin-pill]');
  if (pill && previousCoins !== state.coins) {
    if (state.coins > previousCoins) {
      pill.classList.remove('bump');
      void pill.offsetWidth;
      pill.classList.add('bump');
    }
    previousCoins = state.coins;
  }
  updateBadges();
}

function updateBadges() {
  ensureQuests();
  const slot = currentCheckinSlot();
  const claimable = [
    ...(state.daily?.tasks || []).map((t) => ({ t, period: 'daily' })),
    ...(state.weekly?.tasks || []).map((t) => ({ t, period: 'weekly' })),
    ...(state.monthly?.tasks || []).map((t) => ({ t, period: 'monthly' })),
  ].some(({ t, period }) => !t.claimed && periodCounter(t, period) >= t.goal);
  const today = document.querySelector('[data-badge="today"]');
  if (today) today.hidden = !(!slot.claimed || claimable);
  const hollow = document.querySelector('[data-badge="hollow"]');
  if (hollow) hollow.hidden = !giftReady();
  const nest = document.querySelector('[data-badge="nest"]');
  if (nest) nest.hidden = !eggs().some((e) => e.hatch >= 100);
}

/* The frame palette is shared by the screen edge and every control rim, so a
   custom Frame studio choice repaints both in the same pass. */
function paintAppFramePalette(daily, motion) {
  if (!daily) return;
  const root = document.documentElement;
  root.style.setProperty('--sh-frame-a', daily.a);
  root.style.setProperty('--sh-frame-b', daily.b);
  root.style.setProperty('--sh-frame-c', daily.c);
  root.style.setProperty('--sh-frame-intensity', String(daily.intensity == null ? 1 : daily.intensity));
  if (motion) root.dataset.frameMotion = motion;
}

/* Every menu page shares the entry frame. Painting it once in the shell keeps
   the edge fixed between the top bar and the nav while a page scrolls, and
   gives every tab — including Today and its check-ins — the same weekday and
   phase colours as the splash. */
function menuFrameMarkup() {
  const scene = typeof window !== 'undefined' ? window.titleScreenScene : null;
  if (!scene || typeof scene.frameMarkup !== 'function') return '';
  const daily = typeof scene.frame === 'function' ? scene.frame() : null;
  const motion = typeof scene.motion === 'function' ? scene.motion('menu') : null;
  paintAppFramePalette(daily, motion);
  return scene.frameMarkup('menu', 'app-dayframe', 'data-app-frame');
}

/* The frame is already mounted, so a page change only refreshes its colours
   and replays the short entrance. A refresh of the same page must not restart
   it: mount() is called after routine actions too. */
function syncAppDayFrame(tab) {
  const scene = typeof window !== 'undefined' ? window.titleScreenScene : null;
  const daily = scene && typeof scene.frame === 'function' ? scene.frame() : null;
  const motion = scene && typeof scene.motion === 'function' ? scene.motion('menu') : null;
  paintAppFramePalette(daily, motion);
  const frame = document.querySelector('[data-app-frame]');
  if (!frame) return null;
  if (daily) {
    frame.dataset.dayframe = daily.id;
    frame.style.setProperty('--sh-frame-a', daily.a);
    frame.style.setProperty('--sh-frame-b', daily.b);
    frame.style.setProperty('--sh-frame-c', daily.c);
    frame.style.setProperty('--sh-frame-intensity', String(daily.intensity == null ? 1 : daily.intensity));
    if (motion) frame.dataset.frameMotion = motion;
  }
  const stamp = `${tab || 'menu'}:${daily ? daily.id : 'none'}`;
  if (frame.dataset.frameStamp === stamp) return daily;
  frame.dataset.frameStamp = stamp;
  frame.classList.remove('is-entering');
  void frame.offsetWidth;
  frame.classList.add('is-entering');
  return daily;
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">${icon('sparkle')}</div>
          <div class="brand-text">
            <div class="brand-name">Sprite Hollow <span class="brand-version">v${APP_VERSION}</span></div>
            <div class="brand-sub" data-hollow-sub>${esc(state.hollowName)}</div>
          </div>
        </div>
        <div class="top-actions">
          <div class="coin-pill" data-coin-pill>${icon('coin')}<span data-coins>${state.coins}</span></div>
          <button class="icon-btn layout-toggle" data-layout-app-toggle aria-label="Layout debug" title="Layout debug">⤢</button>
          <button class="icon-btn" data-compass-search aria-label="Search the Hollow" title="Hollow Compass search">${icon('search')}</button>
          <button class="icon-btn" data-studio-btn aria-label="Open Studio">${icon('palette')}</button>
        </div>
      </header>
      <main class="screen is-hollow" id="screen"></main>
      ${menuFrameMarkup()}
      <div class="cc-bar" data-cc-bar hidden aria-live="polite" aria-atomic="true"></div>
      <nav class="tabbar" aria-label="Main navigation">
        <button class="tab active" data-tab="hollow">${icon('hollow')}<span>${t('tab.hollow')}</span><span class="tab-badge" data-badge="hollow" hidden></span></button>
        <button class="tab" data-tab="collection">${icon('sprites')}<span>${t('tab.collection')}</span></button>
        <button class="tab" data-tab="codex">${icon('types')}<span>${t('tab.codex')}</span></button>
        <button class="tab" data-tab="nest">${icon('nest')}<span>${t('tab.nest')}</span><span class="tab-badge" data-badge="nest" hidden></span></button>
        <button class="tab" data-tab="play">${icon('play')}<span>${t('tab.play')}</span></button>
        <button class="tab" data-tab="today">${icon('today')}<span>${t('tab.today')}</span><span class="tab-badge" data-badge="today" hidden></span></button>
        <button class="tab" data-settings-btn aria-label="Open settings">${icon('settings')}<span>${t('tab.settings')}</span></button>
      </nav>
    </div>`;

  app.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      App.requestTab(tab);
      if (tab === 'hollow' || tab === 'play') ReminderPermission.ask();
    });
  });
  App.setTabWaiting(!App.ready);
  app.querySelector('[data-layout-app-toggle]').addEventListener('click', () => toggleLayoutDebug());
  app.querySelector('[data-compass-search]').addEventListener('click', () => openHollowCompassSearch());
  app.querySelector('[data-studio-btn]').addEventListener('click', () => App.openStudio());
  if (typeof setLayoutDebug === 'function') setLayoutDebug(layoutDebugEnabled());
  app.querySelector('[data-settings-btn]').addEventListener('click', () => App.openStudio());
  applyLanguage();
  Captions.mount();
  previousCoins = state.coins;
  updateTopbar();
  if (typeof refreshSaveBlockedNotice === 'function') refreshSaveBlockedNotice();
}

/* The induction tour is a full-screen overlay with its own art and motion, so
   it waits for the startup render budget instead of firing while the first
   frame is still being painted. */
function scheduleBootTour(delay) {
  ShBootBudget.after(() => {
    const open = () => { if (!state.seen.tour) startTour(); };
    setTimeout(() => {
      /* A tab that boots in the background would otherwise drop the only
         automatic tour, and the First Flight card waits on seen.tour. */
      if (document.visibilityState === 'hidden') {
        document.addEventListener('visibilitychange', function retry() {
          if (document.visibilityState === 'hidden') return;
          document.removeEventListener('visibilitychange', retry);
          open();
        });
        return;
      }
      open();
    }, delay);
  });
}

function startFromIntro(element, breed) {
  const egg = Actions.startGame(element, breed);
  renderShell();
  App.tab = 'hollow';
  App.mount();
  openHatchFlow(egg.id, {
    starter: true,
    onDone: () => {
      App.tab = 'hollow';
      App.mount();
      if (typeof showHollowLoading === 'function') showHollowLoading();
      toast('Your Hollow is alive. Tap your sprite to say hello.', '🌱');
      setTimeout(() => Voice.welcome(true), 500);
      scheduleBootTour(1300);
    },
  });
}

/* Native touch momentum is device-controlled, so add a small passive boost to
   vertical swipes and a faster wheel step for trackpads/desktops. */
function bindFastScroll() {
  let touch = null;
  document.addEventListener('touchstart', (event) => {
    const scroller = event.target.closest?.('.screen');
    if (!scroller || event.touches.length !== 1 || event.target.closest('.stage, .game-board, input, textarea, select')) {
      touch = null;
      return;
    }
    const point = event.touches[0];
    touch = { scroller, x: point.clientX, y: point.clientY };
  }, { passive: true });
  document.addEventListener('touchmove', (event) => {
    if (!touch || event.touches.length !== 1) return;
    const point = event.touches[0];
    const dx = point.clientX - touch.x;
    const dy = touch.y - point.clientY;
    touch.x = point.clientX;
    touch.y = point.clientY;
    if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 1) return;
    const max = touch.scroller.scrollHeight - touch.scroller.clientHeight;
    if (max <= 0) return;
    touch.scroller.scrollTop = Math.max(0, Math.min(max, touch.scroller.scrollTop + dy * 0.55));
  }, { passive: true });
  const endTouch = () => { touch = null; };
  document.addEventListener('touchend', endTouch, { passive: true });
  document.addEventListener('touchcancel', endTouch, { passive: true });
  document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return;
    const scroller = event.target.closest?.('.screen, .sheet, .modal');
    if (!scroller) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (max <= 0) return;
    event.preventDefault();
    scroller.scrollTop = Math.max(0, Math.min(max, scroller.scrollTop + event.deltaY * 1.45));
  }, { passive: false });
}

function bindGlobal() {
  bindFastScroll();
  document.addEventListener('pointerdown', () => {
    Sfx.init();
    Voice.init();
    if (typeof Music !== 'undefined') Music.start();
  }, { once: true });
  if (typeof Sfx !== 'undefined' && Sfx.bindInteractions) Sfx.bindInteractions();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (typeof activeChatClose !== 'undefined' && activeChatClose) {
      closeChat();
      return;
    }
    if (overlayStack.length) closeTopOverlay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      Voice.markHidden();
      tick();
      saveState(true);
      Voice.goodbye();
      if (typeof Notifier !== 'undefined') Notifier.arm();
    } else {
      tick(true);
      Voice.returnSummary();
      if (typeof Notifier !== 'undefined') Notifier.clear();
    }
  });
  window.addEventListener('pagehide', () => {
    Voice.goodbye();
    saveState(true);
    if (typeof Notifier !== 'undefined') Notifier.arm();
  });
  window.addEventListener('beforeunload', () => saveState(true));

  // Android WebView back button calls this.
  window.closeTopLayer = () => {
    if (typeof activeChatClose !== 'undefined' && activeChatClose) {
      closeChat();
      return true;
    }
    const gameQuit = document.querySelector('.game-overlay [data-quit]');
    if (gameQuit) {
      gameQuit.click();
      return true;
    }
    if (overlayStack.length) {
      closeTopOverlay();
      return true;
    }
    if (App.tab === 'roster') {
      App.go(App.rosterReturn || 'wiki');
      return true;
    }
    return false;
  };

  let last = Date.now();
  setInterval(() => {
    tick();
    const now = Date.now();
    if (now - last > 12000) {
      last = now;
      updateTopbar();
    }
    Voice.remind();
  }, 1000);
}

/* Some later data waves register a priced species after TYPE_EGG_SPECIES was
   first built. Fill that roster from the live price table at boot so every
   buyable species appears in the Nest, tier filters, and type-egg counts. */
function ensureTypeEggRoster() {
  if (typeof TYPE_EGG_SPECIES === 'undefined' || typeof TYPE_EGG_BASE_PRICE === 'undefined') return;
  ELEMENT_KEYS.forEach((key) => {
    if (!TYPE_EGG_BASE_PRICE[key] || TYPE_EGG_SPECIES.includes(key)) return;
    if (key === MASTER_CHEAT_SPECIES) return;
    if (typeof isSecretSpecies === 'function' && isSecretSpecies(key)) return;
    TYPE_EGG_SPECIES.push(key);
  });
  const unique = [...new Set(TYPE_EGG_SPECIES)];
  TYPE_EGG_SPECIES.length = 0;
  TYPE_EGG_SPECIES.push(...unique);
}

async function boot() {
  /* Recovery candidates now live in IndexedDB. Wait for the archive to open,
     migrate legacy keys, and hydrate its cache before deciding whether a
     missing live save is a first run or a recovery. */
  if (typeof SaveArchive !== 'undefined' && typeof SaveArchive.ready === 'function') {
    try { await SaveArchive.ready(); } catch (err) { /* fall back to legacy storage */ }
  }
  /* The state module inspected an empty live key before that await. Re-inspect
     now that archived copies are visible; a backup means recovery, not a new
     Hollow. A readable live save was already hydrated and needs no second look. */
  let bootInspection = bootSaveInspection;
  if (bootInspection && bootInspection.empty && typeof inspectStoredSave === 'function') {
    const refreshed = inspectStoredSave();
    if (!refreshed.ok) bootInspection = refreshed;
  }
  /* A marker left by an earlier successful archive means cold copies should be
     on this device. If IndexedDB could not open now, recover rather than let a
     fresh Hollow overwrite the only path back. */
  if (bootInspection && bootInspection.empty
      && typeof SaveArchive !== 'undefined'
      && typeof SaveArchive.expected === 'function'
      && SaveArchive.expected()
      && SaveArchive.readyState() !== 'ready') {
    bootInspection = Object.assign({}, bootSaveInspection, {
      ok: false,
      status: 'missing-live-save',
      message: 'Recovery copies are stored on this device, but the recovery archive could not be opened. Retry after freeing storage.',
    });
  }
  /* If those bytes are unreadable, show the recovery screen and stop here: boot
     must not run its first save over the save the player is trying to recover. */
  if (bootInspection && !bootInspection.ok) {
    if (typeof lockSaves === 'function') lockSaves();
    if (typeof showSaveRecovery === 'function') showSaveRecovery(bootInspection);
    else if (document.getElementById('app')) {
      document.getElementById('app').textContent = 'Hollow Health could not open the recovery screen.';
    }
    return;
  }

  /* Local saves name their title image by content address. Resolve it before
     the boot splash or the shell paints, and migrate an older inline image
     into the same store so the first save writes the short reference. */
  if (state && state.theme && typeof TitleImageStore !== 'undefined'
      && (TitleImageStore.isReference(state.theme.titleImage)
        || TitleImageStore.isDataUrl(state.theme.titleImage))) {
    try {
      await TitleImageStore.ready();
      await TitleImageStore.resolveTheme(state.theme);
    } catch (err) {
      if (typeof TitleImageStore.dropReference === 'function') TitleImageStore.dropReference(state.theme);
      console.warn('Title image storage is unavailable; using the inline copy.', err);
    }
  }
  /* Older saves and their archived copies may still contain the inline image.
     Move those copies onto the same reference in one best-effort pass. */
  if (typeof TitleImageStore !== 'undefined' && typeof TitleImageStore.migrateLocalSaves === 'function') {
    try { await TitleImageStore.migrateLocalSaves(); } catch (err) { /* keep inline copies */ }
  }

  ensureTypeEggRoster();
  /* Voice only has to exist once something speaks. The boot budget runs this
     after the first frame instead of holding startup for the speech bridge. */
  ShBootBudget.after(() => Voice.init());
  if (bootInspection && !bootInspection.empty && typeof SaveIntegrity !== 'undefined') {
    SaveIntegrity.setLastLoad({
      status: 'ok',
      message: '',
      warnings: bootInspection.warnings || [],
    });
  }
  applyTheme();
  ensureDaily();
  ensureQuests();
  ensureCheckinPeriods();
  ensureArcadePeriods();
  tick(true);
  saveState(true);
  bindGlobal();

  subscribeState((detail) => {
    updateTopbar(detail);
    if (detail.type === 'theme') {
      applyTheme();
    }
  });

  /* The wiki and sprite loader starts in sprite-data.js before this script.
     Wait for that shared promise (and an optional deferred-screen bundle)
     before enabling tab navigation and before the splash reaches Ready. A
     failed load still resolves the promise and records its errors, so a bad
     asset cannot lock the shell forever. */
  const readyWaits = [];
  const spriteReady = typeof spriteDataLoad === 'function' ? spriteDataLoad() : null;
  if (spriteReady) readyWaits.push(spriteReady);
  if (typeof window !== 'undefined' && window.DEFERRED_SCREENS_READY
      && typeof window.DEFERRED_SCREENS_READY.then === 'function') {
    readyWaits.push(window.DEFERRED_SCREENS_READY);
  }
  /* One readiness promise for both the shell's tab gate and the splash. It
     settles only when sprite data and every deferred screen wait have settled;
     a rejected wait still counts as settled so one bad asset cannot lock boot. */
  const bootReady = Promise.all(readyWaits.map((wait) => Promise.resolve(wait).catch(() => null)));
  bootReady.then(() => App.markReady());

  const enterApp = () => {
    if (!state.started) {
      introScreen(document.getElementById('app'), startFromIntro);
    } else {
      renderShell();
      App.mount();
    }
    ShBootBudget.commit();
    if (state.started) {
      setTimeout(() => Voice.welcome(), 900);
      scheduleBootTour(1200);
    }
    window.App = App;
    if (typeof coinBankRestored !== 'undefined' && coinBankRestored > 0) {
      const banked = coinBankRestored;
      coinBankRestored = 0;
      setTimeout(() => {
        if (typeof toast === 'function') toast(`Your coin bank survived the reset: ${banked.toLocaleString()} coins are still yours.`, '🏦');
      }, 900);
    }
    if (typeof titleImageDropped !== 'undefined' && titleImageDropped) {
      titleImageDropped = false;
      const limit = typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.titleImageLimit === 'function'
        ? `${Math.round(SaveIntegrity.titleImageLimit().maxBytes / 1024)} KB`
        : 'the device limit';
      setTimeout(() => {
        if (typeof toast === 'function') toast(`Your title image was larger than the ${limit} save limit, so it was removed. Choose a new one in Studio.`, '🖼️');
      }, 700);
    }
  };

  if (typeof showBootLoading === 'function') {
    /* A first run has no saved Hollow yet. Keep the starter picker on the same
       title/loading screen, so choosing an egg starts it instead of opening a
       second title page after the loading bar. Returning players keep the
       normal automatic hand-over. */
    const bootIntro = !state.started && typeof introPickerMarkup === 'function'
      ? {
        markup: introPickerMarkup(),
        start: (index) => {
          const starters = typeof STARTERS !== 'undefined' ? STARTERS : [];
          const starter = starters[index] || starters[0];
          if (starter) startFromIntro(starter.element, starter.breed);
        },
        restore: () => {
          if (typeof openSaveBackup === 'function') openSaveBackup();
        },
      }
      : null;
    showBootLoading(enterApp, {
      ready: bootReady,
      progress: typeof spriteDataProgress === 'function' ? spriteDataProgress : null,
      actions: typeof hollowLoadActions === 'function' ? hollowLoadActions() : null,
      intro: bootIntro,
      hold: !!bootIntro,
    });
  }
  else enterApp();
}

boot();
