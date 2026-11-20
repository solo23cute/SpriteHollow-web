# Sprite Puffle collection — what exists today

Read against `puffle-collection-brief.md`. "Drawn" means the procedural
generator paints it into every frame; "missing" means it needs art the
generator does not produce yet.

## Body design — drawn

| Brief line | Where |
| --- | --- |
| Round fluffy body, dense layered fur | body discs, 32 rim tufts, crest puffs |
| Leaf-shaped ears | forced for every kit since the Puffle pass |
| Glowing leaf tuft on head | topknot / hair style, drawn in the sheet |
| Massive cloud-like arms | three shoulder fur tufts over a jointed arm |
| Large paws with visible fingers | palm plus three fingers, three paw pads |
| Plush oversized feet, toes, short legs | two-segment leg with knee and three-toe foot |
| Oversized sparkling eyes | large sclera, oversized iris, twin highlights |
| Leaf accents in the fur | four rim leaves |

## Rarity variants — colour only

Green, teal, violet, gold and cyan exist as colours the renderer can produce
(hue shift per breed, palette dye, per-breed eye colour, crown hat for the
royal look). They are **not** separate art: crystal leaf accents, arcane
particles, a crown leaf formation and floating leaves are drawn only in the
weakest form (rim leaves and the sparkle pass).

## Turnarounds — missing

Every frame is a single front-facing 2D drawing; the generator has no side or
back geometry. Eight consistent angles would mean eight new drawings per frame
set, i.e. eight new sheet families.

## Expression sheet — 3 of 15

Drawn today: happy (mouth open), blink (eyes closed), sleep (closed eyes).
Missing: super happy, excited, laughing, determined, focused, surprised, angry,
sleepy, sad, confused, victory, cute smile, blushing, mischievous.

## Animation poses — 14 clips

idle, walk, fly, blink, celebrate, eat, drink, wash, sleep, catch, throw,
relax, bow, speak. The brief's idle bounce, run start/middle/landing, jump
start/airborne/landing, attack windup/strike/recovery and magic
charge/cast/release map onto these but are not separate authored cycles.

## Battle poses — missing

Ready stance, defensive stance, critical hit, dash attack, special ability,
forest guardian and ultimate skill are not drawn. Catch and throw are the
closest existing frames.

## Leaf flutter special — partial

Sparkles and rim leaves exist; a swirl of leaves with raised paws, green
energy, forest particles and nature runes is not authored.

## Evolution variants — one body, five looks

Baby, standard, royal, ancient and mythic all render from the same 105-frame
body. Royal is a crystal leaf crown hat plus a gold dye; there is no separate
ancient or celestial art.

## Sheet organisation — one grid, not three sections

107 frames in a 6 x 18 grid at 128px per cell (plus 64, 32, and 512 tiers).
There is no turnaround section, no expression strip and no labelled rows.

## Output

Transparent background: yes, alpha 0 in every cell. Full body, no cropping for
every audited frame: yes. 8K: the 8192 master exists for three kit slots
(`round-0`, `dragon-0`, `flower-0`), not all 84.

## What the rest would cost

- Expressions (12 missing) at one frame each: 12 frames, trivial.
- Authored cycles (run, jump, attack, magic) at eight frames each: ~40 frames.
- Battle stances (7): 7 frames.
- Rarity art (5 sets including particles and crystal leaves): 5 sheet families.
- Turnaround (8 angles): 8 sheet families, the largest job.
- All 84 kit garments at 8192: roughly 750 MB and eight hours of rendering.
