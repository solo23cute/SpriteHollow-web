/* Sprite detail tiers.
   The sprite SVG has no size of its own in most screens, so a CSS container
   query would collapse any sprite that relies on max-width. Instead, measure
   the rendered width and tag the SVG, which only toggles detail classes. */
(() => {
  const CHIP_MAX = 48;
  /* The 1.4-unit sole stripe is still sub-pixel until a sprite is 86px. */
  const SMALL_MAX = 86;
  const PET_MAX = 128;
  const seen = new WeakSet();
  const observer = typeof ResizeObserver === 'function'
    ? new ResizeObserver((entries) => {
        for (const entry of entries) applyTier(entry.target);
      })
    : null;

  function tierForWidth(width) {
    const chip = width <= CHIP_MAX;
    const small = width <= SMALL_MAX;
    const pet = !chip && width <= PET_MAX;
    return { chip, small, pet };
  }

  /* QA reads this exact helper, so the test cannot drift from the observer's
     thresholds. */
  window.spriteDetailTierForWidth = tierForWidth;

  /* getBoundingClientRect includes transforms, and the idle motions rotate the
     sprite, so a rotated box measures wider than the box the tier boundaries
     are defined against: a 48px sprite read 49-50px and flipped to the small
     tier mid-animation. The computed width is the untransformed layout box. */
  function layoutWidth(el) {
    const width = parseFloat(getComputedStyle(el).width);
    return Number.isFinite(width) ? width : el.getBoundingClientRect().width;
  }

  function applyTier(el) {
    const width = layoutWidth(el);
    if (!width) return;
    const { chip, small, pet } = tierForWidth(width);
    if (el.classList.contains('boot-detail-chip') !== chip) el.classList.toggle('boot-detail-chip', chip);
    if (el.classList.contains('boot-detail-small') !== small) el.classList.toggle('boot-detail-small', small);
    if (el.classList.contains('boot-detail-pet') !== pet) el.classList.toggle('boot-detail-pet', pet);
  }

  function watch(el) {
    if (!el || seen.has(el)) return;
    if (!el.classList || !el.classList.contains('sprite-motion')) return;
    seen.add(el);
    if (observer) observer.observe(el);
    applyTier(el);
  }

  function scan(root) {
    if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
    if (root.nodeType === 1 && root.matches && root.matches('svg.sprite-motion')) watch(root);
    if (root.querySelectorAll) root.querySelectorAll('svg.sprite-motion').forEach(watch);
  }

  function start() {
    scan(document);
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) scan(node);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
