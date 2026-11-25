/* Wardrobe of Hollow Styles: hub, collection cards, item detail, puffle
   wardrobe, matching builder, dye workshop, photo studio and saved looks.
   Data lives in data-fashion-sets.js; this file is the sheet and its state. */

const WARDROBE_DEFAULT_COLORS = { primary: '#ffb3d1', secondary: BRAND.gold, glow: '#bde8ff', particle: '#ffe58a' };

const WARDROBE_PHOTO_FILTERS = {
  'Soft glow': 'saturate(1.05) brightness(1.05)',
  'Warm bloom': 'sepia(.18) saturate(1.2) brightness(1.06)',
  'Cool moon': 'hue-rotate(-12deg) saturate(.9) brightness(.96)',
  'Prism pop': 'saturate(1.45) contrast(1.05)',
  'Dreamy haze': 'blur(.4px) saturate(1.1) brightness(1.08)',
};

const WARDROBE_PHOTO_BACKDROPS = {
  'Verdant Hollow': 'radial-gradient(120% 90% at 50% 0%, #7fe0c8, #2c5a44 70%)',
  'Crystalbrook Springs': 'radial-gradient(120% 90% at 50% 0%, #9fe8ff, #24406b 70%)',
  'Galaxy Gardens': 'radial-gradient(120% 90% at 50% 0%, #b18cff, #16102e 70%)',
  'Royal Blossom Kingdom': 'radial-gradient(120% 90% at 50% 0%, #ffd3ea, #6a2a52 70%)',
  'Creation Nexus': 'radial-gradient(120% 90% at 50% 0%, #fff4c4, #3a2a5c 70%)',
};

const WARDROBE_WEATHER_TINTS = {
  '☀️ Clear': 'rgba(255, 226, 160, .12)',
  '🌧️ Rain': 'rgba(120, 150, 200, .26)',
  '❄️ Snow': 'rgba(220, 240, 255, .24)',
  '🌈 Rainbow': 'rgba(255, 180, 230, .18)',
  '⚡ Storm': 'rgba(60, 70, 110, .3)',
  '🌌 Galaxy': 'rgba(40, 24, 70, .34)',
};

const WARDROBE_RARITY_RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, ultra: 6, secret: 7, celestial: 8, exotic: 7, master: 8, ancient: 5, divine: 9, eternal: 9, ultra_secret: 10, creator: 10 };

const WARDROBE_NAV = [
  ['outfits', '👕', 'Outfits'],
  ['puffle', '🐾', 'Puffle'],
  ['match', '💖', 'Match'],
  ['dye', '🎨', 'Dye'],
  ['photo', '📸', 'Photo'],
  ['looks', '💾', 'Looks'],
];

function wardrobeTab(id) {
  return (typeof FASHION_TABS !== 'undefined' ? FASHION_TABS : []).find((tab) => tab.id === id) || (typeof FASHION_TABS !== 'undefined' ? FASHION_TABS[0] : null);
}

function wardrobeSetFor(id) {
  return (typeof FASHION_COLLECTIONS !== 'undefined' ? FASHION_COLLECTIONS : []).find((set) => set.id === id) || null;
}

/* Each set falls back to the cape silhouette when the garment map has no entry. */
function wardrobeGarment(set) {
  return (typeof FASHION_GARMENTS !== 'undefined' && FASHION_GARMENTS[set.id]) || set.garment || 'cape';
}

function wardrobeBond(set) {
  if (!set) return 0;
  return set.group === 'secret' ? 25 : set.group === 'pufflea' ? 15 : 10;
}

/* A collection's frame comes from the same rarity palette the game already
   uses for creature cards, so the wardrobe reads as part of the collection. */
function wardrobeFrame(set) {
  const tier = (typeof FASHION_SET_RARITY !== 'undefined' && FASHION_SET_RARITY[set.id]) || 'common';
  const style = typeof RARITY_TIER_STYLES !== 'undefined' ? RARITY_TIER_STYLES[tier] : null;
  return {
    tier,
    name: style ? style.name : tier,
    color: style ? style.color : '#C9CDD2',
    gradient: style ? style.gradient : 'linear-gradient(135deg, #F7F8FA, #C9CDD2)',
  };
}

function wardrobeBestRank() {
  const sprites = typeof state !== 'undefined' && Array.isArray(state.sprites) ? state.sprites : [];
  return sprites.reduce((best, sprite) => Math.max(best, WARDROBE_RARITY_RANK[sprite.rarity] ?? 0), 0);
}

/* Seasonal collections are always open. The legendary Pufflea sets ask for a
   legendary sprite, the secret sets for a secret one, so the vault means
   something without inventing a currency. */
function wardrobeSetUnlocked(set) {
  if (!set) return false;
  if (set.group === 'pufflea') return wardrobeBestRank() >= 4;
  if (set.group === 'secret') return wardrobeBestRank() >= 6;
  return true;
}

/* Both the Studio button and the wiki guide open the sheet through this
   delegated listener, so neither file has to know the wardrobe exists.
   Capture phase matters: openSheet stops clicks from bubbling out of a sheet,
   which would otherwise swallow the sprite detail sheet's seasonal card. */
document.addEventListener('click', (event) => {
  const trigger = event.target.closest?.('[data-wardrobe-open]');
  if (!trigger) return;
  event.preventDefault();
  openWardrobeSheet({
    spriteId: trigger.dataset.spriteId || null,
    tab: trigger.dataset.wardrobeTab || null,
    set: trigger.dataset.wardrobeSet || null,
  });
}, true);

function openWardrobeSheet(opts = {}) {
  const grown = typeof grownSprites === 'function' ? grownSprites() : [];
  const sprite = (typeof findSprite === 'function' ? findSprite(opts.spriteId) : null) || (typeof activeSprite === 'function' ? activeSprite() : null) || grown[0] || null;
  if (!sprite) {
    if (typeof toast === 'function') toast('Hatch a sprite first — the wardrobe needs someone to dress.', '👗');
    return null;
  }
  const baseTabs = typeof FASHION_TABS !== 'undefined' ? FASHION_TABS : [];
  const currentSeason = typeof seasonOf === 'function' ? seasonOf().key : null;
  /* The season in play is the shelf most people open first; keep the data
     order for every other tab. */
  const tabs = [...baseTabs].sort((a, b) => (b.id === currentSeason) - (a.id === currentSeason));
  const sets = typeof FASHION_COLLECTIONS !== 'undefined' ? FASHION_COLLECTIONS : [];
  const backdrops = typeof FASHION_BACKDROPS !== 'undefined' ? FASHION_BACKDROPS : Object.keys(WARDROBE_PHOTO_BACKDROPS);
  const filters = typeof FASHION_FILTERS !== 'undefined' ? FASHION_FILTERS : Object.keys(WARDROBE_PHOTO_FILTERS);
  const poses = typeof FASHION_POSES !== 'undefined' ? FASHION_POSES : ['Happy', 'Sleepy', 'Proud'];
  const times = typeof FASHION_TIMES !== 'undefined' ? FASHION_TIMES : ['Dawn', 'Golden hour', 'Night'];
  const weathers = typeof FASHION_WEATHERS !== 'undefined' ? FASHION_WEATHERS : Object.keys(WARDROBE_WEATHER_TINTS);
  const specials = typeof FASHION_SPECIAL_DYES !== 'undefined' ? FASHION_SPECIAL_DYES : [];

  /* A card can open the sheet right on one collection; otherwise the first
     shelf of the chosen (or default) tab is selected. */
  const seedSet = opts.set ? wardrobeSetFor(opts.set) : null;
  const seedTab = seedSet ? tabs.find((tab) => (tab.sets || []).includes(seedSet.id)) : null;
  let screen = seedSet ? 'item' : 'outfits';
  let tabId = opts.tab || (seedTab ? seedTab.id : null) || (tabs[0] ? tabs[0].id : 'spring');
  let setId = seedSet ? seedSet.id : ((wardrobeTab(tabId)?.sets || [])[0] || (sets[0] ? sets[0].id : null));
  let colors = { ...WARDROBE_DEFAULT_COLORS };
  let photo = { pose: poses[0], filter: filters[0], time: times[1] || times[0], background: backdrops[0], weather: weathers[0] };
  let offEffects = {};
  let draftName = '';
  let builder = { spriteSet: sets[0] ? sets[0].id : null, puffleSet: sets[0] ? sets[0].id : null };
  /* The builder's combination. A worn mixed look reopens as the starting
     point, so editing it feels like editing the outfit, not starting over. */
  let mix = {
    sprite: sprite.wardrobeLook && sprite.wardrobeLook.setId === 'mixed' && Array.isArray(sprite.wardrobeLook.pieces) ? sprite.wardrobeLook.pieces.slice() : [],
    puffle: sprite.puffleWardrobeLook && sprite.puffleWardrobeLook.setId === 'mixed' && Array.isArray(sprite.puffleWardrobeLook.pieces) ? sprite.puffleWardrobeLook.pieces.slice() : [],
  };
  /* Set by Surprise me so the builder can name the palette/season it picked.
     Any manual slot edit clears it, because the roll no longer describes the mix. */
  let surpriseTheme = null;

  const sheet = typeof openSheet === 'function'
    ? openSheet({ title: '👗 Wardrobe of Hollow Styles', sub: `Sprite: ${esc(sprite.name)} ✨ · Companion: 🌸 Pufflea`, body: '<div data-wardrobe-body></div>', key: 'wardrobe' })
    : null;
  if (!sheet) return null;
  const root = sheet.overlay;
  const box = root.querySelector('[data-wardrobe-body]');

  const currentSet = () => wardrobeSetFor(setId) || sets[0];
  const enabledEffects = () => currentSet().effects.filter((effect) => !offEffects[effect]);
  const savedLooks = () => (typeof state !== 'undefined' && Array.isArray(state.looks) ? state.looks : []);
  const bond = Number(sprite.bond && (sprite.bond.level ?? sprite.bond)) || 0;

  function previewCloth() {
    const set = currentSet();
    return { id: 'wardrobe-preview', name: `${set.name} look`, style: wardrobeGarment(set), primary: colors.primary, secondary: colors.secondary, pattern: set.pattern || 'plain', stitch: 'medium' };
  }

  /* The companion half of the preview: the same set cut for the Puffle, with
     the two dye channels swapped so the pair reads as one outfit. */
  function pufflePreviewCloth() {
    const set = currentSet();
    return { id: 'wardrobe-puffle-preview', name: `${set.name} puffle look`, style: wardrobeGarment(set), primary: colors.secondary, secondary: colors.primary, pattern: set.pattern || 'plain', stitch: 'medium' };
  }

  const puffleLook = () => (sprite.puffleWardrobeLook && typeof sprite.puffleWardrobeLook === 'object' ? sprite.puffleWardrobeLook : null);
  const wornBy = (set) => ({
    sprite: !!(sprite.wardrobeLook && sprite.wardrobeLook.setId === set.id),
    puffle: !!(puffleLook() && puffleLook().setId === set.id),
  });

  function setStatus(set) {
    const worn = wornBy(set);
    if (worn.sprite && worn.puffle) return { key: 'worn', label: 'BOTH WORN', worn };
    if (worn.sprite) return { key: 'worn', label: 'SPRITE', worn, partial: true };
    if (worn.puffle) return { key: 'worn', label: 'PUFFLE', worn, partial: true };
    const owned = (state.customClothes || []).some((cloth) => cloth.name === `${set.name} look`) || savedLooks().some((look) => look.setId === set.id);
    if (!wardrobeSetUnlocked(set)) return { key: 'locked', label: '🔒 LOCKED', worn };
    return { key: owned ? 'owned' : 'new', label: owned ? 'OWNED ✅' : 'NEW ✨', worn };
  }

  function previewHTML() {
    const mixing = screen === 'match' && mix.sprite.length > 0;
    const mixData = mixing ? mixLook() : null;
    const set = mixData ? mixData.base : currentSet();
    const tone = mixData ? mixData.base.tone : set.tone;
    const frame = wardrobeFrame(set);
    const cloth = mixData
      ? { id: 'wardrobe-preview', name: 'Mixed look', style: wardrobeGarment(mixData.base), primary: mixData.primary, secondary: mixData.secondary, pattern: mixData.base.pattern || 'plain', stitch: 'medium' }
      : previewCloth();
    const wearing = { ...sprite, outfit: cloth.id, outfitPreview: cloth };
    const puffleCloth = mixData
      ? { id: 'wardrobe-puffle-preview', name: 'Mixed puffle look', style: wardrobeGarment(mixData.puffleBase), primary: mixData.secondary, secondary: mixData.primary, pattern: mixData.puffleBase.pattern || 'plain', stitch: 'medium' }
      : pufflePreviewCloth();
    const face = photo.pose === 'Sleepy' ? 'sleepy' : photo.pose === 'Proud' || photo.pose === 'Royal' ? 'proud' : 'happy';
    const art = typeof spriteSVG === 'function' ? spriteSVG(wearing, { expr: face }) : '';
    const mini = typeof spriteSVG === 'function' ? spriteSVG({ ...wearing, id: `${sprite.id}-companion`, outfit: puffleCloth.id, outfitPreview: puffleCloth }, { expr: face }) : '';
    const backdrop = WARDROBE_PHOTO_BACKDROPS[photo.background] || WARDROBE_PHOTO_BACKDROPS['Verdant Hollow'];
    const filter = WARDROBE_PHOTO_FILTERS[photo.filter] || 'none';
    const shade = WARDROBE_WEATHER_TINTS[photo.weather] || 'rgba(255, 226, 160, .12)';
    const effects = mixData ? mixData.effects : set.effects;
    return `<div class="wd-preview" style="--wd-tone:${tone};--wd-frame:${frame.gradient};--wd-frame-color:${frame.color}">
      <div class="wd-preview-bg" style="background:${backdrop}"></div>
      <div class="wd-preview-shade" style="background:${shade}"></div>
      <div class="wd-preview-stage" style="filter:${filter}">
        <div class="wd-sprite" aria-hidden="true">${art}</div>
        <div class="wd-puffle" aria-hidden="true">${mini}</div>
      </div>
      <div class="wd-preview-label"><b>${mixData ? 'Mixed look' : esc(set.name)}</b><span>${mixData ? `${mixData.info.score}% harmony \u00b7 ${esc(photo.background)} \u00b7 ${esc(photo.weather)}` : `${esc(frame.name)} \u00b7 ${esc(photo.background)} \u00b7 ${esc(photo.weather)}`}</span></div>
      <div class="wd-effects">${effects.map((effect) => `<button type="button" class="wd-effect${offEffects[effect] ? ' off' : ''}" data-wd-effect="${esc(effect)}">${fashionEffectIcon(effect)} ${esc(effect)}</button>`).join('')}</div>
    </div>`;
  }

  /* The same pair renderer feeds the collection cards, saved-look thumbnails
     and the large "judge before wearing" sheet. */
  function pairArtFor(owner, cloth, puffleCloth, { still = false } = {}) {
    if (typeof spriteSVG !== 'function') return { art: '', companion: '' };
    const hero = { ...owner, outfit: cloth ? cloth.id : null, outfitPreview: cloth || null };
    const companion = {
      ...owner,
      id: `${owner.id}-pair-puffle`,
      outfit: puffleCloth ? puffleCloth.id : null,
      outfitPreview: puffleCloth || null,
    };
    return {
      art: spriteSVG(hero, { expr: 'happy', still }),
      companion: spriteSVG(companion, { expr: 'happy', still }),
    };
  }

  function pairPreviewHTML({ label, sub, art, companion, tone, frame, effects, actions }) {
    const effectChips = (effects || []).map((effect) => `<span class="wd-effect static">${fashionEffectIcon(effect)} ${esc(effect)}</span>`).join('');
    return `<div class="wd-pair-preview" style="--wd-tone:${tone};--wd-frame:${frame ? frame.gradient : 'linear-gradient(135deg, #b18cff, var(--gold))'};--wd-frame-color:${frame ? frame.color : tone}">
      <div class="wd-pair-stage"><div class="wd-pair-sprite" aria-hidden="true">${art}</div><div class="wd-pair-puffle" aria-hidden="true">${companion}</div></div>
      <div class="wd-pair-label"><b>${esc(label)}</b><span>${esc(sub)}</span></div>
      ${effectChips ? `<div class="wd-effects">${effectChips}</div>` : ''}
      <div class="wd-pair-actions">${actions}</div>
    </div>`;
  }

  function openPairPreview({ label, sub, art, companion, tone, frame, effects, actions }) {
    const returnFocus = document.activeElement;
    let removeKeys = null;
    const restoreFocus = () => {
      if (removeKeys) removeKeys();
      if (returnFocus && returnFocus.isConnected && typeof returnFocus.focus === 'function') {
        try { returnFocus.focus({ preventScroll: true }); } catch (err) { returnFocus.focus(); }
      }
    };
    const preview = typeof openSheet === 'function'
      ? openSheet({
        title: `Preview · ${esc(label)}`,
        sub,
        body: pairPreviewHTML({ label, sub, art, companion, tone, frame, effects, actions }),
        key: 'wardrobe-pair-preview',
        onClose: restoreFocus,
      })
      : null;
    if (!preview) return null;

    /* The shared sheet only supplies a close button. The pair preview is a
       modal judgement step, so it also owns initial focus, a Tab loop, Escape,
       and returning the reader to the card or saved look that opened it. */
    const sheet = preview.overlay.querySelector('.sheet');
    const title = sheet && sheet.querySelector('h2');
    if (sheet) {
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.tabIndex = -1;
      if (title) {
        title.id = 'wd-pair-preview-title';
        sheet.setAttribute('aria-labelledby', title.id);
      }
    }
    const focusables = () => [...preview.overlay.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.getClientRects().length > 0);
    const firstAction = preview.overlay.querySelector('[data-wd-pair-action]');
    const initialFocus = firstAction || preview.overlay.querySelector('[data-close]') || sheet;
    if (initialFocus) {
      try { initialFocus.focus({ preventScroll: true }); } catch (err) { initialFocus.focus(); }
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        preview.close();
        return;
      }
      if (event.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) {
        event.preventDefault();
        if (sheet) sheet.focus();
        return;
      }
      const index = list.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        list[list.length - 1].focus();
      } else if (!event.shiftKey && (index === -1 || index === list.length - 1)) {
        event.preventDefault();
        list[0].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    removeKeys = () => document.removeEventListener('keydown', onKey, true);

    preview.overlay.querySelectorAll('[data-wd-pair-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.wdPairAction;
        if (action === 'close') {
          preview.close();
        } else if (action === 'wear') {
          if (wear({ target: button.dataset.wdPairTarget || 'both' })) {
            preview.close();
            paint();
          }
        } else if (action === 'apply') {
          if (applySavedLook(button.dataset.wdPairLook)) preview.close();
        }
      });
    });
    return preview;
  }

  /* The worn pair is the combination the player actually has on, which is not
     necessarily a saved look or a collection card. Build its two cloths from
     the recorded halves so the preview reflects mixed and recoloured looks. */
  function openPairPreviewForWorn() {
    const wornSprite = sprite.wardrobeLook && sprite.wardrobeLook.setId ? sprite.wardrobeLook : null;
    const wornPuffle = puffleLook();
    if (!wornSprite || !wornPuffle || !wornPuffle.setId) {
      toast('Wear both halves of a pair before previewing it.', '👗');
      return null;
    }
    const set = wornSprite.setId === wornPuffle.setId ? wardrobeSetFor(wornSprite.setId) : null;
    const data = lookPreviewCloths({
      id: 'worn-pair',
      name: set ? set.name : `${sprite.name} + Pufflea`,
      setId: wornSprite.setId,
      style: wornSprite.style,
      pattern: wornSprite.pattern,
      colors: wornSprite.colors,
      effects: wornSprite.effects,
      puffle: wornPuffle,
    });
    const pair = pairArtFor(sprite, data.spriteCloth, data.puffleCloth);
    const frame = set
      ? wardrobeFrame(set)
      : { name: 'Mixed pair', gradient: 'linear-gradient(135deg, #b18cff, var(--gold))', color: '#b18cff' };
    const effects = [...new Set([
      ...(Array.isArray(wornSprite.effects) ? wornSprite.effects : []),
      ...(Array.isArray(wornPuffle.effects) ? wornPuffle.effects : []),
    ])].slice(0, 3);
    openPairPreview({
      label: set ? set.name : `${sprite.name} + Pufflea`,
      sub: `Worn pair · ${frame.name} · ${effects.length} effect${effects.length === 1 ? '' : 's'}`,
      art: pair.art,
      companion: pair.companion,
      tone: set ? set.tone : data.tone,
      frame,
      effects,
      actions: '<button type="button" class="btn btn-ghost btn-sm" data-wd-pair-action="close">Done</button>',
    });
    return data;
  }

  function openPairPreviewForSet(set) {
    setId = set.id;
    const frame = wardrobeFrame(set);
    const spriteCloth = { id: `wd-pair-${set.id}`, name: `${set.name} look`, style: wardrobeGarment(set), primary: colors.primary, secondary: colors.secondary, pattern: set.pattern || 'plain', stitch: 'medium' };
    const puffleCloth = { id: `wd-pair-${set.id}-puffle`, name: `${set.name} puffle look`, style: wardrobeGarment(set), primary: colors.secondary, secondary: colors.primary, pattern: set.pattern || 'plain', stitch: 'medium' };
    const pair = pairArtFor(sprite, spriteCloth, puffleCloth);
    openPairPreview({
      label: set.name,
      sub: `${frame.name} collection · ${set.sprite.length + set.puffle.length} pieces · Sprite + Pufflea`,
      art: pair.art,
      companion: pair.companion,
      tone: set.tone,
      frame,
      effects: set.effects,
      actions: `<button type="button" class="btn btn-primary btn-sm" data-wd-pair-action="wear" data-wd-pair-target="both">Wear both</button><button type="button" class="btn btn-ghost btn-sm" data-wd-pair-action="wear" data-wd-pair-target="sprite">Sprite only</button><button type="button" class="btn btn-ghost btn-sm" data-wd-pair-action="wear" data-wd-pair-target="puffle">Pufflea only</button>`,
    });
  }

  function lookPreviewCloths(look) {
    const set = wardrobeSetFor(look.setId);
    const lookColors = look.colors || {};
    const spriteCloth = {
      id: `wd-look-${look.id}-sprite`,
      name: `${look.name} look`,
      style: look.style || (set ? wardrobeGarment(set) : 'cape'),
      pattern: look.pattern || (set ? set.pattern : 'plain') || 'plain',
      primary: lookColors.primary || (set ? set.tone : '#ffb3d1'),
      secondary: lookColors.secondary || BRAND.gold,
      stitch: 'medium',
    };
    const p = look.puffle;
    const puffleCloth = p ? {
      id: `wd-look-${look.id}-puffle`,
      name: p.name || `${look.name} Pufflea`,
      style: p.style || spriteCloth.style,
      pattern: p.pattern || spriteCloth.pattern,
      primary: (p.colors && p.colors.primary) || spriteCloth.secondary,
      secondary: (p.colors && p.colors.secondary) || spriteCloth.primary,
      stitch: 'medium',
    } : null;
    return {
      set,
      spriteCloth,
      puffleCloth,
      owner: (typeof findSprite === 'function' ? findSprite(look.spriteId) : null) || sprite,
      tone: set ? set.tone : (p && p.colors && p.colors.primary) || lookColors.primary || '#b18cff',
    };
  }

  function lookPreviewMarkup(look) {
    const data = lookPreviewCloths(look);
    const pair = pairArtFor(data.owner, data.spriteCloth, data.puffleCloth, { still: true });
    return `<button type="button" class="wd-look-preview" data-wd-look-preview="${look.id}" aria-label="Preview ${esc(look.name)}" style="--wd-tone:${data.tone}"><span class="wd-look-preview-art">${pair.art}</span><span class="wd-look-preview-puffle">${pair.companion}</span><span class="wd-look-preview-hint">Preview pair</span></button>`;
  }

  function openPairPreviewForLook(look) {
    const data = lookPreviewCloths(look);
    const pair = pairArtFor(data.owner, data.spriteCloth, data.puffleCloth);
    const frame = data.set ? wardrobeFrame(data.set) : { name: 'Mixed look', gradient: 'linear-gradient(135deg, #b18cff, var(--gold))', color: '#b18cff' };
    openPairPreview({
      label: look.name,
      sub: `${look.setId === 'mixed' ? 'Mixed look' : data.set ? data.set.name : 'Custom look'} · ${look.puffle ? 'Sprite + Pufflea' : 'Sprite'} · ${(look.effects || []).length} effects`,
      art: pair.art,
      companion: pair.companion,
      tone: data.tone,
      frame,
      effects: look.effects,
      actions: `<button type="button" class="btn btn-primary btn-sm" data-wd-pair-action="apply" data-wd-pair-look="${look.id}">Load look</button>`,
    });
  }

  function seasonTabsHTML() {
    return `<div class="wd-tabs-shell">
      <div class="wd-tabs" id="wd-season-tabs" role="tablist" data-wd-tabs>
        ${tabs.map((tab) => `<button type="button" class="wd-tab${screen === 'outfits' && tab.id === tabId ? ' on' : ''}" role="tab" aria-selected="${screen === 'outfits' && tab.id === tabId}" data-wd-tab="${tab.id}">${tab.icon} ${esc(tab.name)}</button>`).join('')}
        <button type="button" class="wd-tab${screen === 'looks' ? ' on' : ''}" data-wd-nav="looks">💖 Favorites</button>
      </div>
      <button type="button" class="wd-tabs-next" data-wd-tabs-next aria-controls="wd-season-tabs" aria-label="Show Legendary and Secret collections" title="More collections">›</button>
    </div>`;
  }

  /* The fade hints at more tabs; the chevron makes it a real target and hides
     once the row has reached its last collection. */
  function syncTabsEdge() {
    const strip = box.querySelector('[data-wd-tabs]');
    const next = box.querySelector('[data-wd-tabs-next]');
    if (!strip || !next) return;
    const remaining = strip.scrollWidth - strip.clientWidth - strip.scrollLeft;
    next.classList.toggle('is-hidden', remaining <= 2);
  }

  function itemCardHTML(set) {
    const frame = wardrobeFrame(set);
    const status = setStatus(set);
    /* Both halves of the collection dressed on the card, so the pairing can be
       judged before "Wear both" commits it. The Puffle wears the set cut for
       its side, with the two dye channels swapped exactly as the preview does. */
    const spriteCloth = { id: `wd-card-${set.id}`, name: `${set.name} look`, style: wardrobeGarment(set), primary: colors.primary, secondary: colors.secondary, pattern: set.pattern || 'plain', stitch: 'medium' };
    const puffleCloth = { id: `wd-card-${set.id}-puffle`, name: `${set.name} puffle look`, style: wardrobeGarment(set), primary: colors.secondary, secondary: colors.primary, pattern: set.pattern || 'plain', stitch: 'medium' };
    const dressed = { ...sprite, outfit: spriteCloth.id, outfitPreview: spriteCloth };
    const art = typeof spriteSVG === 'function' ? spriteSVG(dressed, { expr: 'happy', still: true }) : '';
    const companion = typeof spriteSVG === 'function'
      ? spriteSVG({ ...dressed, id: `${sprite.id}-${set.id}-card-puffle`, outfit: puffleCloth.id, outfitPreview: puffleCloth }, { expr: 'happy', still: true })
      : '';
    const seasonChips = status.key === 'worn' && typeof fashionSeasonModChips === 'function'
      ? fashionSeasonModChips(set, sprite)
      : '';
    return `<button type="button" class="wd-item${status.key === 'worn' ? ' is-worn' : ''}" data-wd-card="${set.id}" style="--wd-tone:${set.tone};--wd-frame:${frame.gradient};--wd-frame-color:${frame.color}">
      <span class="wd-item-art" data-wd-card-preview="${set.id}" title="Preview this pair larger" aria-hidden="true"><span class="wd-item-sprite">${art}</span><span class="wd-item-puffle">${companion}</span></span>
      <span class="wd-item-name">${set.icon} ${esc(set.name)}</span>
      <span class="wd-item-sub">${set.sprite.length + set.puffle.length} pieces · ${esc(frame.name)}</span>
      ${seasonChips ? `<span class="wd-item-season">${seasonChips}</span>` : ''}
      <span class="wd-badge ${status.key}">${status.label}</span>
    </button>`;
  }

  /* A piece is ticked by the half that is actually wearing the set, so the
     wardrobe doubles as the pair's outfit list. */
  function piecesHTML(set) {
    const worn = wornBy(set);
    const row = (piece, isWorn) => `<li class="${isWorn ? 'is-worn' : ''}"><span class="wd-tick">${isWorn ? '✓' : '·'}</span>${esc(piece)}</li>`;
    return `<div class="wd-pieces">
      <div><h4>Sprite set${worn.sprite ? ' · worn' : ''}</h4><ul>${set.sprite.map((piece) => row(piece, worn.sprite)).join('')}</ul></div>
      <div><h4>Puffle set${worn.puffle ? ' · worn' : ''}</h4><ul>${set.puffle.map((piece) => row(piece, worn.puffle)).join('')}</ul></div>
    </div>`;
  }

  function outfitsView() {
    const tab = wardrobeTab(tabId);
    const list = (tab?.sets || []).map(wardrobeSetFor).filter(Boolean);
    const bonuses = tab?.bonuses || [];
    const live = typeof fashionSeasonBonusActive === 'function' && fashionSeasonBonusActive(tabId, sprite);
    const worn = typeof fashionWornSet === 'function' ? fashionWornSet(sprite) : null;
    const seasonMods = typeof fashionSeasonModChipsFor === 'function' ? fashionSeasonModChipsFor(tabId, live) : '';
    const puffleBannerSet = !live && typeof puffleWornSet === 'function' ? puffleWornSet() : null;
    const puffleHasSeason = !!(puffleBannerSet && (tab?.sets || []).includes(puffleBannerSet.id));
    const bannerNote = live
      ? `${esc(worn ? worn.name : '')} is on · these apply now`
      : puffleHasSeason
        ? `Pufflea is wearing ${esc(puffleBannerSet.name)} · the bonus follows ${esc(sprite.name)}`
        : `Wear a ${esc(tab.name)} set to switch them on`;
    /* Both halves list their worn pieces here, so the pair's wardrobe is visible
       without opening every collection card. Mixed looks read from their stored
       piece lists; a whole collection reads from the set itself. */
    const wornLook = sprite.wardrobeLook && sprite.wardrobeLook.setId ? sprite.wardrobeLook : null;
    const wornPuffle = sprite.puffleWardrobeLook && sprite.puffleWardrobeLook.setId ? sprite.puffleWardrobeLook : null;
    const setFor = (id) => (id && id !== 'mixed' ? wardrobeSetFor(id) : null);
    const spriteSet = setFor(wornLook?.setId);
    const puffleSet = setFor(wornPuffle?.setId);
    const spritePieces = wornLook ? (wornLook.setId === 'mixed' ? (wornLook.pieces || []) : (spriteSet ? spriteSet.sprite : [])) : [];
    const pufflePieces = wornPuffle ? (wornPuffle.setId === 'mixed' ? (wornPuffle.pieces || []) : (puffleSet ? puffleSet.puffle : [])) : [];
    return `<div class="wd-view">
      ${bonuses.length ? `<div class="wd-bonus${live ? ' is-live' : ''}"><b>Seasonal bonus${live ? ' · active' : ''}</b>${seasonMods || bonuses.map((bonus) => `<span>${esc(bonus)}</span>`).join('')}<small>${bannerNote}</small></div>` : ''}
      ${spritePieces.length || pufflePieces.length ? `<div class="wd-worn">
        <div class="wd-worn-side"><h4>${esc(sprite.name)}'s wardrobe <span>${spritePieces.length}</span></h4><div class="wd-effects">${spritePieces.map((piece) => `<span class="wd-effect static">✓ ${esc(piece)}</span>`).join('')}</div></div>
        <div class="wd-worn-side"><h4>Pufflea's wardrobe <span>${pufflePieces.length}</span></h4><div class="wd-effects">${pufflePieces.map((piece) => `<span class="wd-effect static">✓ ${esc(piece)}</span>`).join('')}</div></div>
      </div>` : `<p class="tiny muted" style="margin:0 2px 8px">Nothing worn yet — pick a set below and both wardrobes fill in.</p>`}
      ${wornLook && wornPuffle ? `<button type="button" class="btn btn-ghost btn-block" data-wd-worn-preview style="margin:0 0 8px">Preview worn pair</button>` : ''}
      <div class="wd-item-grid">${list.map(itemCardHTML).join('')}</div>
      <button type="button" class="btn btn-primary btn-block" data-wd-wear="both" style="margin-top:8px">Wear ${esc(currentSet().name)} — Sprite + Pufflea</button>
    </div>`;
  }

  function detailView() {
    const set = currentSet();
    const frame = wardrobeFrame(set);
    const status = setStatus(set);
    return `<div class="wd-view">
      <button type="button" class="wd-back" data-wd-nav="outfits">‹ Collections</button>
      <div class="wd-detail" style="--wd-tone:${set.tone};--wd-frame:${frame.gradient};--wd-frame-color:${frame.color}">
        <div class="wd-detail-head"><span class="wd-set-badge">${set.icon}</span><div><b>${esc(set.name)}</b><small>${esc(frame.name)} collection · ${esc(set.season)}</small></div><span class="wd-badge ${status.key}">${status.label}</span></div>
        ${piecesHTML(set)}
        <div class="wd-detail-meta"><span>Effect · ${fashionEffectIcon(set.effects[0])} ${esc(set.effects[0])}</span><span>Bond bonus · +${wardrobeBond(set)} friendship</span></div>
        ${status.key === 'worn' && typeof fashionSeasonModChips === 'function' ? `<div class="wd-season-mods">${fashionSeasonModChips(set, sprite)}</div>` : ''}
        <div class="wd-detail-actions">
          <button type="button" class="btn btn-primary btn-sm" data-wd-wear="both">Wear both</button>
          <button type="button" class="btn btn-ghost btn-sm" data-wd-wear="sprite">Sprite only</button>
          <button type="button" class="btn btn-ghost btn-sm" data-wd-wear="puffle">Pufflea only</button>
        </div>
      </div>
    </div>`;
  }

  /* The pieces the Puffle is wearing right now, from its recorded look. */
  function puffleWornSet() {
    const look = puffleLook();
    if (!look || !look.setId) return null;
    return wardrobeSetFor(look.setId);
  }

  function puffleWornPieces() {
    const look = puffleLook();
    const set = puffleWornSet();
    const list = look && Array.isArray(look.pieces) && look.pieces.length ? look.pieces : (set ? set.puffle : []);
    return new Set(list.map((piece) => String(piece).toLowerCase()));
  }

  function puffleCategories() {
    const slots = (typeof FASHION_PUFFLE_SLOTS !== 'undefined' ? FASHION_PUFFLE_SLOTS : []).map((slot) => ({ ...slot, items: [] }));
    const worn = puffleWornPieces();
    const seen = new Set();
    sets.forEach((set) => set.puffle.forEach((piece) => {
      const key = piece.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      /* Whole-word match: "cap" must not swallow "cape". */
      const words = key.split(/[^a-z]+/).filter(Boolean);
      const slot = slots.find((entry) => entry.words.some((word) => words.includes(word))) || slots[slots.length - 1];
      if (slot) slot.items.push({ name: piece, worn: worn.has(key) });
    }));
    return slots.filter((slot) => slot.items.length);
  }

  function puffleView() {
    const slots = puffleCategories();
    const total = slots.reduce((sum, slot) => sum + slot.items.length, 0);
    const look = puffleLook();
    const set = puffleWornSet();
    const mixed = !!look && look.setId === 'mixed';
    const wornPieces = puffleWornPieces();
    const current = currentSet();
    const pieces = look && Array.isArray(look.pieces) && look.pieces.length ? look.pieces : (set ? set.puffle : []);
    const tone = set ? set.tone : mixed && look.colors ? look.colors.primary : '#b18cff';
    const title = set ? esc(set.name) : mixed ? 'Mixed look' : 'Nothing worn yet';
    const subtitle = set
      ? `${pieces.length} pieces \u00b7 ${(look.effects || []).length} effects`
      : mixed
        ? `${pieces.length} mixed pieces \u00b7 ${(look.effects || []).length} effects`
        : 'Pick a set to dress the pair';
    return `<div class="wd-view">
      <div class="section-title" style="margin-top:0"><h2>\u{1F338} Pufflea's wardrobe</h2><span>${total} pieces</span></div>
      <div class="wd-puff-look" style="--wd-tone:${tone}">
        <div class="wd-puff-look-head"><span class="wd-set-badge">${set ? set.icon : mixed ? '\u{1F9E9}' : '\u{1F43E}'}</span><div><b>${title}</b><small>${subtitle}</small></div></div>
        ${pieces.length ? `<div class="wd-effects">${pieces.map((piece) => `<span class="wd-effect static">\u2713 ${esc(piece)}</span>`).join('')}</div>` : ''}
      </div>
      <button type="button" class="btn btn-primary btn-block" data-wd-wear="puffle" style="margin-bottom:8px"${wardrobeSetUnlocked(current) ? '' : ' disabled'}>Wear ${esc(current.name)} on Pufflea</button>
      <div class="wd-cats">${slots.map((slot) => `<div class="wd-cat">
        <div class="wd-cat-head"><span>${slot.icon}</span><b>${esc(slot.name)}</b><i>${slot.items.length}</i></div>
        <p>${slot.items.slice(0, 4).map((item) => `${item.worn ? '\u2713 ' : ''}${esc(item.name)}`).join(' \u00b7 ')}${slot.items.length > 4 ? ' \u2026' : ''}</p>
      </div>`).join('')}</div>
      <p class="tiny muted" style="margin:8px 2px 0">${wornPieces.size ? `${wornPieces.size} ticked pieces are in Pufflea's wardrobe now.` : 'Wear a set to fill Pufflea\'s wardrobe.'}</p>
    </div>`;
  }

  function matchScore(a, b) {
    if (!a || !b) return 0;
    if (a.id === b.id) return 100;
    const shared = a.effects.filter((effect) => b.effects.includes(effect)).length;
    return Math.min(95, 40 + (a.season === b.season ? 25 : 0) + shared * 15);
  }

  function mixSlotFor(side, name) {
    if (side === 'puffle') return typeof fashionPuffleSlot === 'function' ? fashionPuffleSlot(name) : null;
    return typeof fashionSpriteSlot === 'function' ? fashionSpriteSlot(name) : null;
  }

  function mixPickedIn(side, slot) {
    return mix[side].find((name) => {
      const found = mixSlotFor(side, name);
      return found && found.name === slot.name;
    }) || '';
  }

  function mixOptions(side, slot) {
    const options = [];
    const seen = new Set();
    sets.filter(wardrobeSetUnlocked).forEach((set) => {
      set[side].forEach((name) => {
        const found = mixSlotFor(side, name);
        if (!found || found.name !== slot.name || seen.has(name)) return;
        seen.add(name);
        options.push({ name, set });
      });
    });
    return options;
  }

  function mixLook() {
    const info = typeof fashionMixInfo === 'function'
      ? fashionMixInfo(mix.sprite, mix.puffle)
      : { score: 0, palette: 0, seasonScore: 0, effectScore: 0, pairingScore: 0, season: null, sets: [], effects: [] };
    const entries = typeof fashionMixEntries === 'function' ? fashionMixEntries(mix.sprite, mix.puffle) : [];
    const bodyEntry = entries.find((entry) => entry.side === 'sprite' && entry.slot.key === 'body');
    const headEntry = entries.find((entry) => entry.side === 'sprite' && entry.slot.key === 'head');
    const puffleEntry = entries.find((entry) => entry.side === 'puffle');
    const base = (bodyEntry && bodyEntry.set) || (entries[0] && entries[0].set) || currentSet();
    const head = (headEntry && headEntry.set) || base;
    const puffleBase = (puffleEntry && puffleEntry.set) || base;
    const effects = [...new Set(entries.flatMap((entry) => entry.set.effects))].slice(0, 3);
    return { info, entries, base, head, puffleBase, effects, primary: head.tone, secondary: base.tone };
  }

  function mixSlotField(side, slot, index) {
    const options = mixOptions(side, slot);
    if (!options.length) return '';
    const picked = mixPickedIn(side, slot);
    return `<label class="wd-field wd-mix-slot"><span>${slot.icon} ${esc(slot.name)}</span><select data-wd-mix="${side}:${index}">
      <option value="">\u2014 none \u2014</option>
      ${options.map((option) => `<option value="${esc(option.name)}"${option.name === picked ? ' selected' : ''}>${esc(option.name)} \u00b7 ${esc(option.set.name)}</option>`).join('')}
    </select></label>`;
  }

  /* Surprise me hands the search to the data layer so the same exhaustive
     roll can be regression-tested without opening the wardrobe. */
  function surpriseMix() {
    const unlocked = sets.filter(wardrobeSetUnlocked);
    if (!unlocked.length) {
      toast('Unlock a collection first — the builder needs pieces to mix.', '\u{1F3B2}');
      return;
    }
    if (unlocked.length < 2) {
      toast('Unlock a second collection first — Surprise me needs a cross-collection mix.', '\u{1F3B2}');
      return;
    }
    const result = typeof fashionSurpriseMix === 'function'
      ? fashionSurpriseMix({ sets: unlocked, currentSeason })
      : null;
    if (!result) {
      toast('No cross-collection mix can reach 80% harmony with the collections you own yet.', '\u{1F3B2}');
      return;
    }
    mix = { sprite: result.sprite, puffle: result.puffle };
    surpriseTheme = { ...result.theme };
    paint();
    const theme = result.info.season
      ? `${result.info.season} season · ${result.info.palette}/35 palette`
      : `balanced palette · ${result.info.palette}/35`;
    toast(`Surprise theme — ${theme} · ${result.info.score}% harmony across ${result.collections} collections.`, '\u{1F3B2}');
  }

  function matchView() {
    const spriteSet = wardrobeSetFor(builder.spriteSet) || sets[0];
    const puffleSet = wardrobeSetFor(builder.puffleSet) || sets[0];
    const mixing = mix.sprite.length > 0;
    const data = mixing ? mixLook() : null;
    const info = data ? data.info : null;
    const score = mixing ? info.score : matchScore(spriteSet, puffleSet);
    const harmony = typeof FASHION_MIX_HARMONY !== 'undefined' ? FASHION_MIX_HARMONY : 80;
    const fits = mixing && score >= harmony;
    const theme = surpriseTheme || { season: info?.season || '', palette: info?.palette || 0 };
    return `<div class="wd-view">
      <div class="section-title" style="margin-top:0"><h2>\u{1F496} Matching builder</h2><span>score the combination</span></div>
      <label class="wd-field"><span>Sprite outfit</span><select data-wd-builder="spriteSet">${sets.map((set) => `<option value="${set.id}"${set.id === spriteSet.id ? ' selected' : ''}>${set.icon} ${esc(set.name)}</option>`).join('')}</select></label>
      <label class="wd-field" style="margin-top:6px"><span>Puffle outfit</span><select data-wd-builder="puffleSet">${sets.map((set) => `<option value="${set.id}"${set.id === puffleSet.id ? ' selected' : ''}>${set.icon} ${esc(set.name)}</option>`).join('')}</select></label>
      <button type="button" class="btn btn-soft btn-block" data-wd-mix-surprise style="margin-top:8px">\u{1F3B2} Surprise me</button>
      <div class="wd-score" style="--wd-tone:${data ? data.base.tone : puffleSet.tone}">
        <div class="wd-score-bar"><span style="width:${score}%"></span></div>
        <div class="wd-score-row"><b>${score}%</b><span>${fits ? 'HARMONISED \u00b7 BONUS ON' : mixing ? `${Math.max(0, harmony - score)}% TO HARMONISE` : score === 100 ? 'PERFECT SET BONUS' : score >= 65 ? 'Strong match' : 'Mix &amp; match'}</span></div>
        ${mixing ? `<div class="wd-score-meta"><span>Palette ${info.palette}</span><span>Season ${info.seasonScore}</span><span>Effects ${info.effectScore}</span><span>Pairing ${info.pairingScore}</span></div>` : ''}
      </div>
      ${mixing ? `<div class="row" style="gap:5px;margin:0 0 8px"><span class="chip" data-wd-mix-theme data-theme-season="${esc(theme.season || '')}" data-theme-palette="${Number(theme.palette) || 0}" data-theme-collections="${Number(theme.collections) || 0}">${surpriseTheme ? '🎲 Surprise theme' : '🎨 Theme'} · ${theme.season ? `${esc(theme.season)} · ` : 'Balanced · '}${Number(theme.palette) || 0}/35 palette${Number(theme.collections) ? ` · ${Number(theme.collections)} collections` : ''}</span></div>` : ''}
      <div class="row" style="gap:6px;margin-bottom:8px">
        <button type="button" class="btn btn-soft btn-sm" data-wd-mix-fill style="flex:1">Use ${esc(spriteSet.name)} + ${esc(puffleSet.name)}</button>
        <button type="button" class="btn btn-ghost btn-sm" data-wd-mix-clear${mixing ? '' : ' disabled'}>Clear mix</button>
      </div>
      <div class="wd-mix-grid">
        ${(typeof FASHION_SPRITE_SLOTS !== 'undefined' ? FASHION_SPRITE_SLOTS : []).map((slot, index) => mixSlotField('sprite', slot, index)).join('')}
        ${(typeof FASHION_PUFFLE_SLOTS !== 'undefined' ? FASHION_PUFFLE_SLOTS : []).map((slot, index) => mixSlotField('puffle', slot, index)).join('')}
      </div>
      <p class="tiny muted" style="margin:8px 2px 0">${mixing ? `${info.sets.length} collection${info.sets.length === 1 ? '' : 's'} \u00b7 ${info.season || 'no clear season'} \u00b7 ${fits ? 'seasonal bonus on' : `harmonise to ${harmony}% for the season bonus`}` : 'Pick a piece in any slot to start scoring a combination.'}</p>
      <button type="button" class="btn btn-primary btn-block" data-wd-mix-wear style="margin-top:8px"${mixing ? '' : ' disabled'}>Wear this mix</button>
    </div>`;
  }

  function wearMix() {
    if (!mix.sprite.length) {
      toast('Pick a sprite piece first \u2014 a mix needs at least one.', '\u{1F9E9}');
      return false;
    }
    const data = mixLook();
    const liveEffects = data.effects.filter((effect) => !offEffects[effect]);
    const res = Actions.wearLook({
      spriteId: sprite.id,
      name: 'Mixed look',
      setId: 'mixed',
      pieces: mix.sprite,
      style: wardrobeGarment(data.base),
      pattern: data.base.pattern || 'plain',
      primary: data.primary,
      secondary: data.secondary,
      glow: colors.glow,
      particle: colors.particle,
      effects: liveEffects,
      photo: { ...photo },
      /* A mixed look is worn as a pair. Even with no Pufflea slots filled it
         replaces the Pufflea's previous look, so a whole set's pieces cannot
         linger in the companion wardrobe after the mix goes on. */
      target: 'both',
      puffle: {
        setId: 'mixed',
        name: 'Mixed Pufflea',
        style: wardrobeGarment(data.puffleBase),
        pattern: data.puffleBase.pattern || 'plain',
        primary: data.secondary,
        secondary: data.primary,
        effects: liveEffects,
        pieces: mix.puffle,
      },
    });
    if (!res || !res.ok) {
      toast('That mix needs a grown sprite to wear it.', '\u{1F9E9}');
      return false;
    }
    const harmony = typeof FASHION_MIX_HARMONY !== 'undefined' ? FASHION_MIX_HARMONY : 80;
    toast(`Mixed look on \u2014 ${data.info.score}% harmony${data.info.score >= harmony ? ', seasonal bonus on' : ''}.`, '\u{1F9E9}');
    return true;
  }

  function dyeView() {
    const fields = [['primary', 'Primary colour'], ['secondary', 'Secondary colour'], ['glow', 'Glow colour'], ['particle', 'Particle colour']];
    return `<div class="wd-view">
      <div class="section-title" style="margin-top:0"><h2>🎨 Dye workshop</h2><span>four channels</span></div>
      <div class="wd-colors">${fields.map(([key, label]) => `<label class="wd-color"><input type="color" value="${colors[key]}" data-wd-color="${key}" aria-label="${label}"><span><b>${label}</b><i>${colors[key]}</i></span></label>`).join('')}</div>
      <div class="section-title" style="margin-top:10px"><h2>Special colours</h2><span>one tap</span></div>
      <div class="wd-specials">${specials.map((dye) => `<button type="button" class="wd-special" data-wd-dye="${dye.id}" style="--wd-swatch:linear-gradient(135deg, ${dye.primary}, ${dye.secondary})"><span class="wd-swatch"></span>${esc(dye.name)}</button>`).join('')}</div>
      <button type="button" class="btn btn-primary btn-block" data-wd-wear style="margin-top:8px">Apply dye</button>
    </div>`;
  }

  function photoView() {
    return `<div class="wd-view">
      <div class="section-title" style="margin-top:0"><h2>📸 Photo studio</h2><span>${esc(photo.background)}</span></div>
      <p class="tiny muted" style="margin:0 0 4px">Background</p>
      <div class="wd-photo-chips">${backdrops.map((bg) => `<button type="button" class="wd-chip${bg === photo.background ? ' on' : ''}" data-wd-photo-set="background" data-wd-value="${esc(bg)}">${bg === 'Verdant Hollow' ? '🌳' : bg === 'Royal Blossom Kingdom' ? '🌸' : bg === 'Galaxy Gardens' ? '🌌' : bg === 'Creation Nexus' ? '⚫' : '💧'} ${esc(bg)}</button>`).join('')}</div>
      <p class="tiny muted" style="margin:8px 0 4px">Weather</p>
      <div class="wd-photo-chips">${weathers.map((weather) => `<button type="button" class="wd-chip${weather === photo.weather ? ' on' : ''}" data-wd-photo-set="weather" data-wd-value="${esc(weather)}">${esc(weather)}</button>`).join('')}</div>
      <p class="tiny muted" style="margin:8px 0 4px">Pose</p>
      <div class="wd-photo-chips">${poses.map((pose) => `<button type="button" class="wd-chip${pose === photo.pose ? ' on' : ''}" data-wd-photo-set="pose" data-wd-value="${esc(pose)}">${esc(pose)}</button>`).join('')}</div>
      <p class="tiny muted" style="margin:8px 0 4px">Filter</p>
      <div class="wd-photo-chips">${filters.map((filter) => `<button type="button" class="wd-chip${filter === photo.filter ? ' on' : ''}" data-wd-photo-set="filter" data-wd-value="${esc(filter)}">${esc(filter)}</button>`).join('')}</div>
      <button type="button" class="btn btn-primary btn-block" data-wd-photo-take style="margin-top:10px">Take photo</button>
    </div>`;
  }

  /* A saved look stores its own pieces, so a mix's harmony can be scored here
     again rather than re-worn first. A whole collection is a perfect match. */
  function lookPieces(look) {
    const set = wardrobeSetFor(look.setId);
    const mixed = look.setId === 'mixed';
    return {
      sprite: mixed ? (Array.isArray(look.pieces) ? look.pieces : []) : (set ? set.sprite : []),
      puffle: mixed
        ? (look.puffle && Array.isArray(look.puffle.pieces) ? look.puffle.pieces : [])
        : (look.puffle && set ? set.puffle : []),
    };
  }

  function lookScore(look) {
    if (look.setId !== 'mixed') return 100;
    const pieces = lookPieces(look);
    if (!pieces.sprite.length && !pieces.puffle.length) return null;
    const info = typeof fashionMixInfo === 'function' ? fashionMixInfo(pieces.sprite, pieces.puffle) : null;
    return info ? info.score : null;
  }

  function applySavedLook(id) {
    const res = Actions.applyLook(id);
    if (!res || !res.ok) {
      toast('That look could not be applied.', '👗');
      return false;
    }
    const look = savedLooks().find((entry) => entry.id === id);
    if (look) {
      setId = look.setId || setId;
      colors = look.colors ? { ...colors, ...look.colors } : colors;
      photo = look.photo ? { ...photo, ...look.photo } : photo;
      offEffects = {};
      if (look.setId === 'mixed') {
        mix = {
          sprite: Array.isArray(look.pieces) ? look.pieces.slice() : [],
          puffle: look.puffle && Array.isArray(look.puffle.pieces) ? look.puffle.pieces.slice() : [],
        };
        surpriseTheme = null;
        screen = 'match';
      }
    }
    toast(`${look ? look.name : 'Look'} applied.`, '💖');
    paint();
    return true;
  }

  function looksView() {
    const looks = savedLooks();
    return `<div class="wd-view">
      <div class="section-title" style="margin-top:0"><h2>💾 Saved looks</h2><span>${looks.length}</span></div>
      ${looks.length ? `<div class="wd-look-grid">${looks.map((look) => {
        const set = wardrobeSetFor(look.setId);
        const pieces = lookPieces(look);
        const score = lookScore(look);
        const allPieces = [...pieces.sprite, ...pieces.puffle];
        return `<div class="wd-look" style="--wd-tone:${set ? set.tone : '#b18cff'}">
          <div class="wd-look-head"><span class="wd-set-badge">${set ? set.icon : '👗'}</span><div><b>${esc(look.name)}</b><small>${esc(look.setId === 'mixed' ? 'Mixed look' : set ? set.name : 'Custom look')} · ${look.puffle ? 'Sprite + Pufflea' : 'Sprite'} · ${look.effects.length} effects</small></div></div>
          ${lookPreviewMarkup(look)}
          <div class="wd-score-row" style="margin-top:7px"><b>${score === null ? '—' : `${score}%`}</b> <span>${score === null ? 'no pieces saved' : `${look.setId === 'mixed' ? 'harmony' : 'whole set'} · ${allPieces.length} pieces`}</span></div>
          ${score === null ? '' : `<div class="wd-score-bar"><span style="width:${score}%"></span></div>`}
          ${allPieces.length ? `<div class="wd-effects">${allPieces.map((piece) => `<span class="wd-effect static">✓ ${esc(piece)}</span>`).join('')}</div>` : ''}
          <div class="wd-look-actions">
            <button type="button" class="btn btn-primary btn-sm" data-wd-apply="${look.id}">Apply</button>
            <button type="button" class="icon-btn" data-wd-delete="${look.id}" aria-label="Delete ${esc(look.name)}">${icon('trash')}</button>
          </div>
        </div>`;
      }).join('')}</div>` : '<p class="tiny muted" style="margin:8px 2px">No saved looks yet. Dress a set, then save it from this tab.</p>'}
      <label class="wd-field" style="margin-top:10px"><span>Save this look as</span><input data-wd-name maxlength="28" placeholder="${esc(currentSet().name)} look" value="${esc(draftName)}"></label>
      <button type="button" class="btn btn-primary btn-block" data-wd-save style="margin-top:6px">Save look</button>
    </div>`;
  }

  function navHTML() {
    return `<nav class="wd-nav" aria-label="Wardrobe sections">${WARDROBE_NAV.map(([id, icon, label]) => `<button type="button" class="wd-nav-btn${screen === id ? ' on' : ''}" data-wd-nav="${id}"><span>${icon}</span>${label}</button>`).join('')}</nav>`;
  }

  function paint() {
    box.innerHTML = `<div class="wd-head">
        <div class="wd-head-row"><b>👗 Wardrobe of Hollow Styles</b><span class="wd-bond">❤️ Bond ${bond}</span></div>
        <div class="wd-who"><span>👤 ${esc(sprite.name)}</span><span>🌸 Pufflea</span></div>
      </div>
      ${seasonTabsHTML()}
      ${previewHTML()}
      ${screen === 'outfits' ? outfitsView() : screen === 'item' ? detailView() : screen === 'puffle' ? puffleView() : screen === 'match' ? matchView() : screen === 'dye' ? dyeView() : screen === 'photo' ? photoView() : looksView()}
      ${navHTML()}`;
    const strip = box.querySelector('[data-wd-tabs]');
    if (strip) {
      strip.addEventListener('scroll', syncTabsEdge, { passive: true });
      syncTabsEdge();
      /* Web fonts can change the tab widths after this first measurement. If
         the row ends up fitting, a visible chevron would look tappable but
         have nowhere to scroll, so re-check after layout and font loading. */
      requestAnimationFrame(() => {
        syncTabsEdge();
        requestAnimationFrame(syncTabsEdge);
      });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncTabsEdge).catch(() => {});
      }
    }
  }

  function pufflePayloadFor(set, prefix = '') {
    return {
      setId: set.id,
      /* "Pufflea Spring Queen" already carries the word, so the prefix is dropped
         to keep every cloth name inside the 24-character cap. */
      name: `${prefix}${set.name.replace(/^Pufflea\s+/, '')} Pufflea`,

      style: wardrobeGarment(set),
      pattern: set.pattern || 'plain',
      primary: colors.secondary,
      secondary: colors.primary,
      effects: enabledEffects(),
      pieces: set.puffle,
    };
  }

  function wear(extra = {}) {
    const set = currentSet();
    if (!wardrobeSetUnlocked(set)) {
      toast(`${set.name} needs a ${set.group === 'pufflea' ? 'legendary' : 'secret'} sprite in your Hollow.`, '🔒');
      return false;
    }
    const target = extra.target === 'puffle' || extra.target === 'sprite' ? extra.target : 'both';
    const name = extra.name || `${set.name} look`;
    const res = Actions.wearLook({
      spriteId: sprite.id,
      name,
      setId: set.id,
      style: wardrobeGarment(set),
      pattern: set.pattern || 'plain',
      primary: colors.primary,
      secondary: colors.secondary,
      glow: colors.glow,
      particle: colors.particle,
      effects: enabledEffects(),
      photo: { ...photo },
      target,
      /* The Sprite half records the pieces it put on, so its wardrobe can list
         them after the sheet closes. The Puffle payload carries its own. */
      pieces: set.sprite,
      puffle: pufflePayloadFor(set),
      ...extra,
    });
    if (!res || !res.ok) {
      toast('That look needs a grown sprite to wear it.', '👗');
      return false;
    }
    toast(target === 'puffle'
      ? `${set.name} is on Pufflea.`
      : target === 'sprite'
        ? `${set.name} is on ${sprite.name}.`
        : `${set.name} is on — ${sprite.name} and Pufflea match.`, '👗');
    return true;
  }

  box.addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-wd-tabs-next], [data-wd-tab], [data-wd-nav], [data-wd-card], [data-wd-look-preview], [data-wd-worn-preview], [data-wd-effect], [data-wd-dye], [data-wd-wear], [data-wd-apply], [data-wd-delete], [data-wd-save], [data-wd-photo-set], [data-wd-photo-take], [data-wd-match-wear], [data-wd-mix-fill], [data-wd-mix-clear], [data-wd-mix-surprise], [data-wd-mix-wear]');
    if (!target) return;
    const data = target.dataset;
    if (data.wdTabsNext !== undefined) {
      const strip = box.querySelector('[data-wd-tabs]');
      if (strip) {
        const step = Math.max(120, Math.round(strip.clientWidth * 0.8));
        /* Move immediately: the smoke gate freezes CSS animations, and a
           smooth scroll can be swallowed entirely in that state. */
        strip.scrollLeft += step;
      }
    } else if (data.wdTab) {
      tabId = data.wdTab;
      screen = 'outfits';
      setId = (wardrobeTab(tabId)?.sets || [])[0] || setId;
      offEffects = {};
      paint();
    } else if (data.wdNav) {
      screen = data.wdNav;
      if (screen === 'outfits' && tabId === 'favorites') tabId = tabs[0]?.id || tabId;
      paint();
    } else if (data.wdCard) {
      if (event.target.closest?.('[data-wd-card-preview]')) {
        const set = wardrobeSetFor(data.wdCard);
        if (set) openPairPreviewForSet(set);
        return;
      }
      setId = data.wdCard;
      screen = 'item';
      offEffects = {};
      paint();
    } else if (data.wdLookPreview) {
      const look = savedLooks().find((entry) => entry.id === data.wdLookPreview);
      if (look) openPairPreviewForLook(look);
    } else if (data.wdWornPreview !== undefined) {
      openPairPreviewForWorn();
    } else if (data.wdEffect) {
      offEffects[data.wdEffect] = !offEffects[data.wdEffect];
      paint();
    } else if (data.wdDye) {
      const dye = specials.find((entry) => entry.id === data.wdDye);
      if (dye) {
        colors = { primary: dye.primary, secondary: dye.secondary, glow: dye.glow, particle: dye.particle };
        paint();
      }
    } else if (data.wdWear !== undefined) {
      if (wear({ target: data.wdWear || 'both' })) paint();
    } else if (data.wdMatchWear) {
      setId = builder.spriteSet;
      const pairSet = wardrobeSetFor(builder.spriteSet) || currentSet();
      if (wear({ name: `${pairSet.name} pairing`, puffle: pufflePayloadFor(pairSet) })) paint();
    } else if (data.wdMixFill !== undefined) {
      const pairSprite = wardrobeSetFor(builder.spriteSet) || sets[0];
      const pairPuffle = wardrobeSetFor(builder.puffleSet) || sets[0];
      mix = { sprite: pairSprite.sprite.slice(), puffle: pairPuffle.puffle.slice() };
      surpriseTheme = null;
      offEffects = {};
      paint();
    } else if (data.wdMixClear !== undefined) {
      mix = { sprite: [], puffle: [] };
      surpriseTheme = null;
      paint();
    } else if (data.wdMixSurprise !== undefined) {
      surpriseMix();
    } else if (data.wdMixWear !== undefined) {
      if (wearMix()) paint();
    } else if (data.wdApply) {
      applySavedLook(data.wdApply);
    } else if (data.wdDelete) {
      Actions.deleteLook(data.wdDelete);
      paint();
    } else if (data.wdSave !== undefined) {
      const mixing = screen === 'match' && mix.sprite.length > 0;
      const mixData = mixing ? mixLook() : null;
      const baseSet = mixData ? mixData.base : currentSet();
      const name = (draftName || (mixing ? 'Mixed look' : `${currentSet().name} look`)).trim().slice(0, 28);
      const liveEffects = mixData ? mixData.effects.filter((effect) => !offEffects[effect]) : enabledEffects();
      const saved = Actions.saveLook({
        spriteId: sprite.id,
        name,
        setId: mixing ? 'mixed' : currentSet().id,
        style: wardrobeGarment(baseSet),
        pattern: baseSet.pattern || 'plain',
        colors: { ...colors },
        effects: liveEffects,
        scene: state.theme.scene,
        weather: state.world.weather || null,
        photo: { ...photo },
        pieces: mixing ? mix.sprite.slice() : [],
        puffle: mixing ? (mix.puffle.length ? {
          setId: 'mixed',
          name: `${name} Pufflea`,
          style: wardrobeGarment(mixData.puffleBase),
          pattern: mixData.puffleBase.pattern || 'plain',
          primary: colors.secondary,
          secondary: colors.primary,
          effects: liveEffects,
          pieces: mix.puffle.slice(),
        } : null) : pufflePayloadFor(currentSet()),
      });
      if (saved && saved.ok) {
        if (mixing) wearMix(); else wear({ name });
        toast(`Saved "${name}".`, '\u{1F4BE}');
        draftName = '';
        paint();
      } else {
        toast('Name the look first.', '\u{1F4BE}');
      }
    } else if (data.wdPhotoSet) {
      photo[data.wdPhotoSet] = data.wdValue;
      paint();
    } else if (data.wdPhotoTake !== undefined) {
      const frameEl = box.querySelector('.wd-preview');
      if (frameEl) {
        frameEl.classList.add('flash');
        setTimeout(() => frameEl.classList.remove('flash'), 700);
      }
      toast('Framing set. Save the look to keep this photo.', '📸');
    }
  });

  box.addEventListener('input', (event) => {
    const color = event.target.closest?.('[data-wd-color]');
    if (color) {
      colors[color.dataset.wdColor] = color.value;
      const readout = color.closest('.wd-color')?.querySelector('i');
      if (readout) readout.textContent = color.value;
      const preview = box.querySelector('.wd-preview');
      if (preview) preview.outerHTML = previewHTML();
      return;
    }
    const nameInput = event.target.closest?.('[data-wd-name]');
    if (nameInput) draftName = nameInput.value;
  });

  box.addEventListener('change', (event) => {
    const mixField = event.target.closest?.('[data-wd-mix]');
    if (mixField) {
      const [side, rawIndex] = String(mixField.dataset.wdMix || '').split(':');
      const list = side === 'puffle'
        ? (typeof FASHION_PUFFLE_SLOTS !== 'undefined' ? FASHION_PUFFLE_SLOTS : [])
        : (typeof FASHION_SPRITE_SLOTS !== 'undefined' ? FASHION_SPRITE_SLOTS : []);
      const slot = list[Number(rawIndex)];
      if (slot) {
        const rest = mix[side].filter((name) => {
          const found = mixSlotFor(side, name);
          return !found || found.name !== slot.name;
        });
        if (mixField.value) rest.push(mixField.value);
        mix[side] = rest;
        surpriseTheme = null;
        paint();
      }
      return;
    }
    const builderField = event.target.closest?.('[data-wd-builder]');
    if (builderField) {
      builder[builderField.dataset.wdBuilder] = builderField.value;
      paint();
      return;
    }
    const photoField = event.target.closest?.('[data-wd-photo]');
    if (!photoField) return;
    photo[photoField.dataset.wdPhoto] = photoField.value;
    const preview = box.querySelector('.wd-preview');
    if (preview) preview.outerHTML = previewHTML();
  });

  paint();
  return sheet;
}
