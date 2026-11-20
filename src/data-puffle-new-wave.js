/* Gold shells for the new named Sprite Puffle arrivals and every Fortune
   favorite.

   The base breeds live in data-sprite-puffle-family.js and data-base.js. Gold
   shells reuse the normal variant registrar, which now copies puffleStyle and
   puffleElement from the base so the finish layers over the puffle silhouette
   instead of replacing it with the ordinary sprite body.

   Fortune coverage comes from VARIANT_FORTUNE so adding a Fortune favorite
   cannot leave its Gold shell behind. */

const GOLD_SHELL_BASE_KEYS = [
  'sp_minimiku',
  'sp_squiplash',
  'sp_siroscar',
  'sp_zee',
  'sp_liluzi',
  ...VARIANT_FORTUNE.map((entry) => entry.key),
];

(function registerGoldShells() {
  if (typeof ELEMENTS === 'undefined' || typeof registerVariantSpecies !== 'function') return;
  GOLD_SHELL_BASE_KEYS.forEach((baseKey) => {
    const base = ELEMENTS[baseKey];
    if (base) registerVariantSpecies('gold', baseKey, base.name);
  });
})();
