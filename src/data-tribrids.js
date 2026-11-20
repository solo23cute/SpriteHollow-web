/* Tribrids: three-parent hybrids. A hybrid sprite merged with a third sprite whose element
   completes a recipe can produce a tribrid. The tribrid stores all three parents in
   hybridParents, and its name in hybrid, so the rest of the game reads it like any hybrid.
   Loaded after the species waves so every element key exists. */

const TRIBRID_RECIPES = [
  { parts: ['falcon', 'raven', 'volt'], name: 'Thunder Omen' },
  { parts: ['dragonfly', 'tide', 'firefang'], name: 'Tidefire Glasswing' },
  { parts: ['honeybee', 'ladybug', 'bluebird'], name: 'Meadow Chorus' },
  { parts: ['jellyfish', 'seahorse', 'pufferfish'], name: 'Abyss Lantern' },
  { parts: ['koi', 'owlet', 'tortoise'], name: 'Pond Sage' },
  { parts: ['firefang', 'tamer', 'elk'], name: 'Wild Herd' },
  { parts: ['moth', 'firefly', 'radiant'], name: 'Lantern Swarm' },
  { parts: ['badger', 'otter', 'rock'], name: 'Stone Burrow' },
  { parts: ['fox', 'hare', 'dusk'], name: 'Twilight Trickster' },
];

const TRIBRID_NAMES = {};
const TRIBRID_BY_KEY = {};
TRIBRID_RECIPES.forEach(({ parts, name }) => {
  const sorted = [...parts].sort();
  const key = sorted.join('+');
  TRIBRID_NAMES[key] = name;
  TRIBRID_BY_KEY[key] = { name, parents: sorted };
});

/* Returns { name, parents } when merging a and b completes a tribrid recipe, otherwise null.
   One parent must be a hybrid of exactly two elements; the other must be a plain sprite. */
function tribridFor(a, b) {
  const complete = (hybrid, plain) => {
    if (!hybrid?.hybridParents || hybrid.hybridParents.length !== 2) return null;
    if (plain?.hybridParents) return null;
    const parts = [...hybrid.hybridParents, plain.element];
    if (new Set(parts).size !== 3) return null;
    return TRIBRID_BY_KEY[[...parts].sort().join('+')] || null;
  };
  return complete(a, b) || complete(b, a);
}

/* Display text for every parent of a hybrid child: "A × B" or "A × B × C". */
function hybridParentsLabel(parents) {
  return parents.map((el) => ELEMENTS[el]?.name || el).join(' × ');
}
