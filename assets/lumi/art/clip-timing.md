# Lumi sheet clip timings

Stored verbatim from the animation spec. The table below says what the shipped
105-frame sheet can honour and what it cannot.

IDLE
8 Frames
10 FPS

WALK
8 Frames
12 FPS

RUN
10 Frames
16 FPS

JUMP
10 Frames
14 FPS

ATTACK
6 Frames
12 FPS

MAGIC CAST
8 Frames
10 FPS

CELEBRATE
10 Frames
12 FPS

SLEEP
6 Frames
4 FPS

## Against the shipped clips

| Spec clip | Frames in sheet | Frame count | FPS after this change |
| --- | --- | --- | --- |
| Idle | 0-7 | 8 of 8 | 8 → **10** |
| Walk | 8-15 | 8 of 8 | 12 (already) |
| Run | — | none | — |
| Jump | — | none | — |
| Attack | — | none | — |
| Magic cast | — | none | — |
| Celebrate | 27-36 | 10 of 10 | 12 |
| Sleep | 61-66 | 6 of 6 | 4 |

Run, jump, attack and magic cast have no frames in the sheet layout, so they
cannot be retimed here: they would need new frames, and the sheet is a fixed
6 x 18 grid of 105 cells that every kit garment is baked against. Adding them
means re-laying out and repainting all 84 kit sheets.

Celebrate and sleep now match the spec's frame count and speed: ten frames at
12 fps and six at 4 fps, both repainted into every kit. The clip map after them
shifted by four cells, and the sheet is 107 frames on the same 6 x 18 grid.

Run, jump, attack and magic cast still have no cells; the closest stand-ins are
fly (8 frames, 14 fps) for jump, catch (8 frames, 12 fps) for attack and speak
(8 frames, 8 fps) for magic cast.
