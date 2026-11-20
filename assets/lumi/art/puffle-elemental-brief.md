# Sprite Puffle elemental collection — source brief

Pasted by the project owner as the target for the species roster and its sprite
sheet. Kept verbatim in substance so the art direction is not lost; the palettes
are the authoritative fifth field each variant should be painted from.

## Shared anatomy

Fluffy round body, giant sparkling anime eyes, oversized plush arms,
three-finger paws, short fluffy legs, oversized fluffy feet, leaf-shaped ears,
glowing leaf tuft, soft layered fur, cute mascot proportions, strong readable
silhouette. Cute anime fantasy mascot, Pokémon-quality design, Studio Ghibli
charm, clean cel shading, game-ready, consistent anatomy and proportions.

## Layout requested

Transparent background, uniform sprite atlas grid, even spacing, no overlapping
sprites. Per puffle: front, front 3/4, left side, back, plus idle, attack and
special-ability poses. Lineup sheet: full-body front views at identical
proportions and scale, elemental effects around each, no text, no logos, no
watermark.

## Variants (palette as given)

| Puffle | Element | Palette |
| --- | --- | --- |
| Ember | Fire — ember fur, lava glow, molten leaf tuft | `#FF6B35` `#FF8C42` `#FFB347` `#FFD166` |
| Bloom | Grass — flowers, vines, petals | `#7FD36C` `#A6E887` `#4CAF50` `#B9F19F` |
| Tideflit | Water — waves, bubbles, seafoam fur | `#00CFFF` `#4ADFFF` `#A0F6FF` `#0077B6` |
| Whisp | Air — clouds, feathers, wind currents | `#FFFFFF` `#DDF7FF` `#AEEBFF` `#89DBFF` |
| Volt | Electric — lightning, golden fur, aura | `#FFE600` `#FFF066` `#FFD000` `#FFB700` |
| Frost | Ice — snowflakes, crystal growths | `#FFFFFF` `#DDF7FF` `#BDEFFF` `#8FD3FF` |
| Terra | Earth — stone fur, roots, moss, floating rock | `#6B8E23` `#8FBC8F` `#A67B5B` `#D2B48C` |
| Venom | Poison — spores, glowing mushrooms, mist | `#8A2BE2` `#7FFF00` `#BA55D3` `#ADFF2F` |
| Alloy | Metal — silver armour fur, alloy leaf, energy core | `#C0C0C0` `#E5E4E2` `#A8B5C3` `#5DADEC` |
| Shadow | Dark — void aura, magenta eyes, shadow flames | `#1F1F2E` `#363650` `#8F00FF` `#FF006A` |
| Celestial | Light — stars, divine glow | `#FFFFFF` `#F4F7FF` `#6EF5FF` `#E8FFFF` |

## Second wave (described, palette not supplied)

Mystic (arcane runes, purple magic circles), Spirit (translucent fur, wispy
tail, spirit flames), Crystal (gemstone growths, rainbow facets), Storm
(thunderclouds, rain, electric wind), Lunar (silver-white, moon glow, crescent
leaf tuft), Solar (golden, radiant flares), Nature (tree blossoms, glowing
sprouts), Hollow (black-hole energy, fractured reality), Dream (pastel, floating
stars, clouds), Cosmic (galaxies, nebula fur, orbiting planets), Time (clocks,
hourglass motes), Sound (sound waves, rhythm particles), Floral (oversized
blossoms), Sand (sandstone fur, ancient runes), Magma (volcanic rock, magma
cracks), Toxic Bloom (bioluminescent flowers, venom vines), Steam (mist, steam
bursts), Aurora (aurora ribbons, rainbow frost), Primal (ancient markings,
world-tree energy).

Storing palettes for the second wave needs the owner's hexes before any of them
can be painted; the first wave above is complete.

## Current state of the art pipeline

`tools/puffle_body.py` draws the shared werewolfpuff anatomy. Palettes are painted with the
`palette=` override in `draw_lumi`, so fur, tuft, wings and iris are literal
hexes, and shading mixes come from the palette's own dark tone. The sheet grid
(6 x 18, 128 px cells, 107 frames) has no cells for the attack or special poses
yet; the master sheet carries the turnaround, expressions and the eight sheet
cycles.

## Built: elemental atlas

`tools/make_elemental_atlas.py` renders every variant in `tools/puffle_elements.py`
as one row of seven frames — front, front 3/4, side, back, idle, attack and
special — at 128 px cells.

- `assets/lumi/art/puffle-elemental-atlas.png` — 1024 x 3072, 24 rows, 168 frames,
  transparent, no text.
- `assets/lumi/art/puffle-elemental-lineup.png` — 1536 x 256, all twenty-four
  front views at identical scale, twelve per row.

Each row is painted from the variant's own hexes through the `palette=` override,
and the element's aura and particles come from `draw_effects`, so the wolf-eared
body is identical across the roster and only colour and motif change. Side and back
views come from the same `yaw` rig as the turnaround. The puffle and guardian
stages share these rows, keeping both forms on one silhouette.

The game now reads this atlas. Puffle species resolve their `puffleStyle` or
`puffleElement` to an atlas row and draw that row directly instead of
hue-rotating a kit sheet; `special` plays the element's own final column. The 84
kit sheets remain for breeds outside the puffle roster and for the wardrobe.

Each element has its own special-attack pose: `tools/make_elemental_atlas.py`
chooses an attack or magic-cast frame and yaw per row, so the final column is no
longer one shared magic-cast cycle.

### Five-frame collection sheet

`assets/lumi/art/puffle-elemental-sheet.png` is the layout asked for in the
collection prompt: 640 x 3200, one row per variant, five 128 px cells holding
front view, side view, idle, attack and special. It is generated by the same
script as the seven-frame atlas, which keeps the extra three-quarter and back
angles.

### Aether, the twenty-fifth

Aether is the mythic form: white fur with a cyan tuft, gold world-tree spark,
floating crystals and rainbow arcs, using `#FFFFFF` `#A8FFFF` `#E6D5FF` `#FFD700`
`#00FFF7` `#FF71CE`. Adding it brought every elemental artefact to twenty-five
rows:

- `puffle-elemental-sheet.png` — 640 x 3328, 26 rows x 5 frames.
- `puffle-elemental-atlas.png` — 1024 x 3328, 26 rows x 7 frames.
- `puffle-elemental-roster.png` — 2048 x 1024, all 26 at 256 px, eight across.
- `puffle-elemental-lineup.png` — 1664 x 256, thirteen per row.

### Hollow, the void form

Hollow arrived without hexes, so it is painted from the project's existing Void
palette (`#150C2E` fur, `#3A2A66` tuft, `#8F00FF` iris, `#0B0618` deep) rather
than invented colour, with a collapsing dark core, fractured arcs and magenta
motes. Every elemental artwork now carries twenty-six rows.
