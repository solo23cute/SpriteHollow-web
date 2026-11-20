# Title screen key art — art brief

Stored verbatim from the master prompt. This is the direction for the painted
plate behind the title, Play button and loading copy, and the composition the
splash's layout reserves space for.

SPRITE HOLLOW - TITLE SCREEN + LOADING SCREEN MASTER PROMPT

Epic fantasy creature collector mobile game title screen fused with loading screen, Sprite Hollow universe, giant glowing crystal world tree rising into the sky at the center of an enchanted magical forest, massive crystal roots spreading across the landscape, floating islands suspended among glowing clouds, sparkling waterfalls cascading from the sky, ancient crystal ruins hidden throughout the environment.

Royal Hollow Puff mascot standing heroically on a glowing crystal pedestal in the foreground, fluffy white fur, oversized glossy cyan eyes, elegant purple crystal crown, floating crystal wings, magical aura radiating around the character, cute yet legendary fantasy mascot design.

Surrounding the mascot are dozens of unique puffle families from every element and biome: flower puffles blooming with petals and leaves, bee honey puffles covered in golden nectar, mushroom puffles glowing with spores, electric puffles crackling with lightning, coral ocean puffles floating in magical water bubbles, magma puffles surrounded by ember particles, rainbow prism puffles made of colorful crystal light, butterfly puffles with shimmering wings, cloud puffles drifting through the air, gear puffles with steampunk mechanisms, candy puffles made of sweet magical treats, galaxy puffles containing miniature stars and nebulae, celestial puffles glowing with divine light, shadow puffles emerging from purple mist, and rare Hollowborn puffles forged from black crystal and cosmic void energy.

The giant crystal world tree glows with flowing cyan magical energy moving through crystal veins, crystal branches forming a magnificent canopy overhead. Crystal butterflies flutter around the tree, magical fireflies drift through the forest, floating crystal shards slowly rotate in midair, sparkling dust particles catch magical light throughout the scene.

Integrated loading screen effects visible within the artwork: magical energy flowing through the roots and branches, floating crystal fragments gently rotating, glowing mushrooms softly pulsing with light, magical fireflies leaving shimmering trails, tiny puffles running and playing around the foreground, some chasing each other, some waving at the viewer, some carrying glowing crystals.

A subtle crystal-lit lower band where the live loading copy sits, formed from glowing crystal growth and magical energy, decorated with tiny running puffles and sparkling particles.

Premium fantasy mobile game UI style integrated into composition: crystal buttons, magical menu panels, glowing navigation icons, rarity badges, fantasy card frames, Spirit Crystal currency icons, Dream Spore currency icons, Celestial Seed currency icons, all matching the Sprite Hollow aesthetic.

Color palette dominated by vibrant crystal purple, glowing cyan, celestial gold, magical pink highlights, emerald fantasy greens, and radiant rainbow magical effects. Dark Hollowborn crystals create contrast with glowing cyan fractures and mysterious void energy.

Cinematic composition, front-facing mascot focus, world tree centerpiece, floating islands and fantasy sky in background, welcoming adventure atmosphere mixed with magical mystery, AAA mobile game quality, polished collectible creature RPG artwork, concept art masterpiece, highly detailed fantasy environment, vibrant cinematic lighting, magical volumetric glow, premium game splash screen, premium title screen, premium loading screen, fantasy mobile game marketing artwork, professional studio quality, ultra detailed, sharp focus, colorful, whimsical, cozy yet epic fantasy atmosphere.

logo space at top center, play button space near lower center, loading copy space at bottom, no text, no watermark, no user interface labels, no empty space, complete full-screen composition, masterpiece quality, professional game key art.

## How it lands in the splash

- Save the plate under one of the names below; no code change is needed. The
  splash reads `assets/title-screen/key-art.manifest.json` instead of probing
  every candidate, so refresh the manifest with the normal build
  (`python tools/boot-bundle.py`) or `python tools/title_plate_manifest.py`.
  It asks for the most specific listed name first and replaces the vector scene
  with the first file that decodes:
  1. `key-art-<season>-<orientation>`
  2. `key-art-<season>`
  3. `key-art-<orientation>`
  4. `key-art`
  Each name is tried as `.webp`, then `.jpg`, then `.png`. Seasons are
  `winter` (Dec–Feb), `spring` (Mar–May), `summer` (Jun–Aug) and `autumn`
  (Sep–Nov); orientations are `tall` (portrait viewport) and `wide` (landscape).
  So `key-art-winter-tall.webp` is the most specific winter phone plate.
- The winning file is remembered in `localStorage` (`sh-title-plate`) and asked
  for first on later boots; a remembered file that has been removed is dropped
  automatically.
- An empty plate folder produces an empty manifest, so boot reads one small
  file and makes no image probes at all. Only manifest-listed images are
  requested; the manifest is generated from the drop-in filenames.
- A metered connection (Save-Data, `prefers-reduced-data`, or a 2G effective
  type) keeps the vector scene and skips the plate entirely.
- Plates must be still images. An animated WebP keeps moving under reduced
  motion, because CSS cannot pause it; the splash only stops what it draws.
- It is used as a cover plate from a 50% / 30% focal point on tall screens and
  50% / 44% on wide ones, so a tall image keeps its sky and logo band when a
  wider window crops it.
- Portrait plates: 1080 × 1920 (9:16). Wide plates: 1920 × 1080 (16:9). Keep
  each under ~350 KB as WebP; the splash is the first paint, not a gallery.
- Painted safe bands, in plate percentages: logo cluster 0–22%, mascot and
  puffle cast 22–70%, Play and loading copy 70–100%. The live title, tagline,
  button and loading line sit on top of the plate, so leave the logo and footer
  bands free of focal detail.
- The layout reserves the bands the prompt describes — logo cluster at the top,
  Play above the foot, loading copy at the bottom edge, and an empty middle. The
  drawn mascot crest and icon row are hidden while a plate is present, because
  the painting carries its own; the splash adds no second live puffle.
- The title, tagline, loading line and button stay live DOM on top of the
  plate, so the prompt's "no text, no watermark, no user interface labels" is
  what the artwork should provide: the words are drawn by the app.
- A top band and a bottom band of scrim keep those live elements legible; the
  middle is left clear for the painted mascot.
