# Sprite Puffle master sheet, 64 px edition

`assets/lumi/art/puffle-master-sheet-64.png` — 1024 x 1024, RGBA, transparent,
16 columns x 16 rows, 64 px cells, 256 slots. Built by
`tools/make_puffle_master_sheet.py`.

The art is one base body. The eleven breeds share it; their exact colours live
in `assets/lumi/puffle-master-palettes.json` and their particle choice lives in
`fxOverrides` in `assets/lumi/puffle-master-sheet.json`. There is no per-breed
copy of the atlas.

## Layout

The brief's row names are conceptual. The slot numbers pack eyes and mouths
into row 14 and let the FX clips span rows 15-16, which is what the 16 x 16 grid
allows:

| Slots | Sheet rows | Content |
| --- | --- | --- |
| 1-16 | 1 | Idle 1-8, Blink 1-4, Look Around 1-4 |
| 17-48 | 2-3 | Pet Reaction, Belly Rub |
| 49-80 | 4-5 | Feed, Movement |
| 81-112 | 6-7 | Play, Sleep |
| 113-144 | 8-9 | Greeting, Mood States |
| 145-176 | 10-11 | Level Up, Fluff Overload |
| 177-192 | 12 | Photo Mode poses |
| 193-208 | 13 | Tail layer |
| 209-216 | 14, left half | Eye layer, eight states |
| 217-224 | 14, right half | Mouth layer, eight states |
| 225-256 | 15-16 | FX layer, eight four-frame clips |

Every clip in the manifest carries both its 0-based `frames` (for arithmetic)
and its 1-based `slots` (the numbers in the brief).

## Runtime

`src/puffle-master-sheet.js` loads the manifest once, then exposes:

```js
const sheet = window.PuffleMasterSheet;
await sheet.load();
sheet.clip('squish');                  // frames, slots, fps, loop
sheet.palette('sp_frost');             // exact family colours
sheet.fx('sp_forest');                 // clip, motif, tint
sheet.frameRect(176);                  // 0-based frame -> x/y/w/h
sheet.slotRect(177);                   // 1-based slot -> x/y/w/h
sheet.play(canvasEl, 'victorySpin', { loop: false });
```

`play` paints the correct background cell on any element. Size the element
yourself; the helper only swaps the cell, so a tail, eye or mouth layer can
share the same frame or animate independently.

## Regenerate

```
python tools/make_puffle_master_sheet.py
python -m unittest tests.test_puffle_master_sheet
```

The generator asserts that the 75 clips cover all 256 slots exactly once, so a
shifted row fails the build instead of silently misaligning the atlas.
