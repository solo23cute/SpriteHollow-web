/* Hollow Compass UI: builds the Home strip from live game globals and turns a
   card into the matching in-app deep link. The planner itself stays pure in
   src/hollow-compass.js; this file is the only place that touches the app. */

const HOLLOW_COMPASS_TRACKS = Object.freeze({
  collection: { label: 'Collect', icon: '✨' },
  care: { label: 'Care', icon: '💗' },
  discovery: { label: 'Discover', icon: '🧭' },
});

const HOLLOW_COMPASS_CTAS = Object.freeze({
  constellation: 'Open chart',
  care: 'Open care',
  biome: 'Open atlas',
  vault: 'View door',
});

function hollowCompassEnv() {
  const scenes = typeof SCENES !== 'undefined' && SCENES ? SCENES : {};
  const biomes = typeof BIOME_KEYS !== 'undefined' && typeof TYPE_BIOMES !== 'undefined'
    ? BIOME_KEYS.map((type) => {
      const biome = TYPE_BIOMES[type] || {};
      return {
        type,
        scene: biome.key,
        label: biome.name || (typeof ELEMENTS !== 'undefined' && ELEMENTS[type] && ELEMENTS[type].name) || type,
      };
    }).filter((biome) => !!biome.scene)
    : [];

  return {
    priceOf: (key) => (typeof TYPE_EGG_PRICE !== 'undefined' && TYPE_EGG_PRICE[key] !== undefined
      ? TYPE_EGG_PRICE[key]
      : null),
    nameOf: (key) => (typeof ELEMENTS !== 'undefined' && ELEMENTS[key] && ELEMENTS[key].name) || key,
    displayNameOf: (sprite) => (typeof displayName === 'function' ? displayName(sprite) : sprite && sprite.name) || 'your sprite',
    constellations: typeof Constellations !== 'undefined' ? Constellations : null,
    scenes,
    biomes,
    vaultDoors: typeof GUARDIAN_VAULT_DOORS !== 'undefined' ? GUARDIAN_VAULT_DOORS : [],
    travels: typeof guardianVaultTravels === 'function' ? guardianVaultTravels() : 0,
  };
}

function hollowCompassCards() {
  if (typeof HollowCompass === 'undefined' || typeof state === 'undefined') return [];
  const built = HollowCompass.build(state, hollowCompassEnv());
  return Array.isArray(built.cards) ? built.cards.slice(0, 3) : [];
}

function hollowCompassStripHtml() {
  const cards = hollowCompassCards();
  if (!cards.length) return '';
  return `<section class="hc-strip" data-hollow-compass aria-label="Hollow Compass — next three">
    <div class="hc-strip-head">
      <div><div class="eyebrow">🧭 Hollow Compass</div><h2>Next 3</h2></div>
      <span class="tiny muted">Collect · Care · Discover</span>
    </div>
    <div class="hc-cards">${cards.map((card) => {
      const track = HOLLOW_COMPASS_TRACKS[card.track] || HOLLOW_COMPASS_TRACKS.discovery;
      return `<button class="hc-card hc-${esc(card.track)}" type="button" data-compass-track="${esc(card.track)}" data-compass-target="${esc(JSON.stringify(card.target))}" aria-label="${esc(card.title)}">
        <span class="hc-card-top"><span class="hc-icon" aria-hidden="true">${track.icon}</span><span class="hc-kicker">${esc(track.label)}</span></span>
        <b class="hc-title">${esc(card.title)}</b>
        <span class="hc-meta">${esc(card.meta)}</span>
        <span class="hc-note">${esc(card.note || '')}</span>
        <span class="hc-cta">${esc(HOLLOW_COMPASS_CTAS[card.kind] || 'Open')} <span aria-hidden="true">→</span></span>
      </button>`;
    }).join('')}</div>
  </section>`;
}

function openHollowCompassTarget(target) {
  if (!target || typeof target !== 'object') return false;
  if (target.type === 'care' && target.spriteId) {
    const sprite = typeof findSprite === 'function' ? findSprite(target.spriteId) : null;
    if (!sprite || sprite.stage === 'egg' || sprite.retired || sprite.atHome) return false;
    if (typeof Actions !== 'undefined' && Actions.setActive) Actions.setActive(sprite.id);
    if (typeof App !== 'undefined' && App.tab !== 'hollow') App.go('hollow');
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
    return true;
  }
  if (target.type === 'constellation' && target.seedId) {
    if (typeof App !== 'undefined' && App.tab !== 'collection') App.go('collection');
    if (typeof openConstellationSheet !== 'function') return false;
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
    openConstellationSheet(target.seedId);
    return true;
  }
  if (target.type === 'biome' && target.scene) {
    if (typeof openBiomeAtlas !== 'function') return false;
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
    openBiomeAtlas(target.scene);
    return true;
  }
  if (target.type === 'vault' && target.doorId) {
    if (typeof openGuardianGallery !== 'function') return false;
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
    openGuardianGallery(null, { focusDoor: target.doorId });
    return true;
  }
  return false;
}

function wireHollowCompass(root) {
  if (!root || root.dataset.hollowCompassWired === '1') return () => {};
  root.dataset.hollowCompassWired = '1';
  const onClick = (event) => {
    const card = event.target.closest('[data-compass-target]');
    if (!card) return;
    let target = null;
    try {
      target = JSON.parse(card.dataset.compassTarget || 'null');
    } catch (err) {
      return;
    }
    if (openHollowCompassTarget(target)) event.preventDefault();
  };
  root.addEventListener('click', onClick);
  return () => {
    root.removeEventListener('click', onClick);
    if (root.dataset) delete root.dataset.hollowCompassWired;
  };
}
