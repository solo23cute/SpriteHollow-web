# Puffle master sheet

`assets/lumi/art/puffle-master-sheet.png` — 1936 x 9040, RGBA, transparent
background, no text, no watermark. Built by `tools/make_master_sheet.py`; the
expression strip alone is `assets/lumi/art/expressions.png` from
`tools/make_expressions.py`.

## Layout

Five rarity blocks stacked (common, rare, epic, legendary, mythic). Every block
holds fourteen rows:

| Row | Content | Frames |
| --- | --- | --- |
| 1 | turnaround: front, front 3/4, left, back left 3/4, back, back right 3/4, right, front right 3/4 | 8 |
| 2 | expressions: happy, super happy, cute smile, laughing, excited, determined, focused, mischievous, blushing, surprised, confused, sleepy, sad, angry, victory | 15 |
| 3 | idle | 8 |
| 4 | walk | 8 |
| 5 | blink | 3 |
| 6 | celebrate | 10 |
| 7 | eat | 8 |
| 8 | wash | 8 |
| 9 | sleep | 6 |
| 10 | speak | 8 |
| 11 | run | 10 |
| 12 | jump | 10 |
| 13 | attack | 6 |
| 14 | magic cast | 8 |

116 frames per rarity, 580 in total.

## Colour

Every frame is rendered by the generator with a palette override, not recoloured
afterwards: body is `Primary Fur`, wings and tufts are `Secondary Fur`, iris is
`Eye Iris`, and the shading mixes come from `Eye Shadow`, so shading stays inside
the palette. The exact primary hex appears as literal pixels in all fifteen
expression cells of every block.

## Expressions

`EXPRESSIONS` in `tools/make_lumi_pack.py` holds the fifteen faces. Each is a
lid aperture, a mouth shape, an optional brow angle, and optional blush,
sparkles or sleep marks. `draw_lumi(..., expression='angry')` overrides the
face the animation set, so an expression can be applied to any pose; a lid
aperture of zero draws the closed `^ ^` eyes used by laughing and victory.

## What is not on it

- Battle stances (ready, defensive, critical hit, dash, guardian, ultimate).
- The Leaf Flutter special sequence.
- Evolution-stage bodies; rarity is colour, not a different anatomy.
- Garment variants; those live in the 84 kit sheets.

## Regenerate

    python tools/make_master_sheet.py
    python tools/make_expressions.py
