# Eternal Harmony Turtle — card prompt kit

Original vector art for the in-game card lives in `src/eternal-harmony-card.js`
and the standalone gallery in `assets/cards/eternal-harmony-turtle.html`.
These prompts are for generating painterly cover art to composite behind the
HTML card text; they are not traced from any existing creature art.

## Consistency sheet

- **Creature:** chibi guardian turtle, round fluffy cream body, oversized
  galaxy eyes, tiny flippers, soft plush silhouette.
- **Shell:** one enormous world-shell split into eight clear elemental regions:
  Nature forest, Fire volcano, Ice glacier, Water reef, Earth crystal mountain,
  Lightning storm, Dark eclipse, Light sun.
- **Core:** a diamond-shaped Elemental Core Crystal at the exact centre of the
  shell, white-cyan with a rainbow rim.
- **Orbit:** three thin elemental rings and floating crystal shards around the
  body; gold crown above the head.
- **Palette:** cream `#FFF3DC`, shell rim gold `#FFD166`, core cyan `#C8FBFF`,
  nature `#4F9B63`, fire `#D9562E`, ice `#6FC9E8`, water `#2F86C9`,
  earth `#9C7A4C`, lightning `#D8A72E`, dark `#4B3370`, light `#D8B04A`.
- **Mood:** warm, wondrous, premium collectible; readable at card size.

## 1. Standard Legendary Fusion art

Vertical 2:3 trading-card artwork, no text, no frame, no logos. A premium
fantasy creature illustration of the Eternal Harmony Turtle: an adorable chibi
guardian turtle with a round fluffy cream body, huge sparkling galaxy eyes, tiny
soft flippers, and a small gold crown. Its massive world-shell is divided into
eight vivid elemental regions that blend seamlessly: an enchanted forest, a
molten volcano, a frozen glacier, a coral reef, crystal mountains, a lightning
storm, a shadow eclipse, and a radiant sun. A diamond-shaped Elemental Core
Crystal glows at the centre of the shell, sending rainbow light through the
plates. Three thin elemental rings orbit the body with floating crystals,
guardian runes, and drifting sparks. Cinematic magical lighting, rich painterly
textures, soft rim light, deep cosmic background, centered composition, sharp
focus, premium mobile-game collectible art, masterpiece quality, 8K.

## 2. Secret Rare art

Vertical 2:3 trading-card artwork, no text, no frame, no logos. The same Eternal
Harmony Turtle reimagined as a Secret Rare chase card: black-rainbow
holographic atmosphere, iridescent cosmic foil, a night-sky shell with eight
elemental regions glowing like stained glass, and the Elemental Core Crystal
burning white at its centre. Eight stylized elemental dragons spiral around the
shell, their bodies made of forest light, flame, ice, water, stone, lightning,
shadow, and sunlight. Floating crowns, prismatic particles, deep galaxy
background, dramatic rainbow reflections, luxurious collector presentation,
ultra-detailed painterly game art, centered composition, 8K.

## 3. Ultimate chase art — Omniverse Turtle EX

Vertical 2:3 trading-card artwork, no text, no frame, no logos. The Omniverse
Turtle EX, a transcendent chibi guardian deity: the familiar fluffy cream turtle
silhouette, now carrying an entire omniverse inside its shell. Miniature
galaxies, oceans, volcanoes, forests, crystal continents, storm systems,
eclipses, and celestial suns are visible through the translucent world-shell,
with the Elemental Core Crystal blazing at the centre like a newborn star.
Black-gold holographic aura, floating elemental crowns, divine rainbow energy,
orbiting planets and crystal shards, cosmic scale with a cute readable face.
Luxury ultimate-chase card art, cinematic lighting, ultra-detailed textures,
centered composition, masterpiece quality, 8K.

## Negative prompt

```
text, watermark, logo, signature, frame, border, UI, card template, low quality,
blurry, flat colors, muddy palette, extra heads, extra limbs, deformed shell,
asymmetric eyes, clipped crown, cropped creature, busy background, horror,
realistic turtle, photorealistic animal, traced art, existing game character
```

## Card copy blocks

### Standard

- **Name:** Eternal Harmony Turtle
- **Rarity:** Legendary Fusion
- **Element:** Omni Element
- **Class:** Guardian Titan
- **Stage:** Fusion Mythic
- **Collection:** Sprite Hollow Origins
- **Card number:** #001-LF
- **Power rating:** ★★★★★★★★★☆ · 4,950
- **Passive:** Harmony Core
- **Basic:** Element Burst · 250
- **Special:** Harmony Nova · 650 · 3-turn cooldown
- **Ultimate:** Worldshell Cataclysm · 1,800 · 8-turn cooldown
- **Trait:** Guardian of Balance
- **Secret ultimate:** Omniverse Genesis · 3,000
- **Finish:** Rainbow galaxy holo
- **Edition:** First Guardian Print
- **Pull rate:** 1 in 5,000 packs
- **Collector score:** SSS+

### Secret Rare

- **Name:** Eternal Harmony Turtle
- **Rarity:** Secret Rare
- **Frame:** Black rainbow holographic
- **Art:** Eight elemental dragons spiralling around the world-shell
- **Finish:** Animated cosmic foil
- **Edition:** Limited chase print
- **Pull rate:** 1 in 25,000 packs

### Ultimate chase

- **Name:** Omniverse Turtle EX
- **Rarity:** Secret Mythic
- **Frame:** Black-gold holographic
- **Art:** An entire omniverse inside the world-shell
- **Signature:** Omniverse Genesis
- **Edition:** Ultimate chase · one print
- **Pull rate:** 1 in 100,000 packs

## Production notes

1. Generate the art at 1024×1536 or larger with the creature centered and the
   shell fully visible; leave safe space at the top for the crown and at the
   bottom for the flippers.
2. Keep all typography out of the generated image. Composite the card text in
   HTML/CSS so it stays sharp, accessible, and editable.
3. For the in-game card, use the original SVG in
   `src/eternal-harmony-card.js`; for the standalone gallery, the same geometry
   is embedded in `assets/cards/eternal-harmony-turtle.html`.
