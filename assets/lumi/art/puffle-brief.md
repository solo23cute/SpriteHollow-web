# Sprite Puffle — art direction

Stored verbatim from the design brief. This is the reference every Lumi sheet is
drawn against: if a new kit or body type disagrees with it, the brief wins.

Sprite Puffle, original mascot creature for Sprite Hollow, ultra-cute anime fantasy companion, fluffy spherical body, soft emerald green and mint fur, oversized sparkling anime eyes, expressive face, adorable smile, fluffy leaf-shaped ears, large plush arms made of thick cloud-like fur, rounded fluffy paws, short powerful fluffy legs, oversized plush feet for clear animation silhouettes, soft leaf accents woven through fur, magical forest spirit aesthetic, premium collectible creature design.

CHARACTER TURNAROUND SHEET:
front view, 3/4 front view, left side view, back view, 3/4 rear view, right side view, perfectly consistent proportions, model sheet layout, professional game asset reference sheet.

POSES INCLUDED:
idle pose,
happy bounce pose,
walking pose,
running pose,
jump pose,
celebration pose,
attack pose,
casting magic pose,
surprised expression pose,
sleeping pose,
sitting pose.

ANIME STYLE:
high-end anime creature design,
Studio Ghibli inspired charm,
modern fantasy RPG mascot,
Pokémon-quality creature concept art,
clean linework,
beautiful cel shading,
soft painterly rendering,
expressive eyes,
charming personality,
family-friendly design,
high visual appeal.

DETAILS:
extremely fluffy fur,
soft layered fur texture,
cute paws,
visible toes,
highly expressive hands,
clear limb structure,
forest magic particles,
glowing leaf energy,
nature spirit companion,
vibrant colors,
professional concept art,
character design sheet,
video game mascot,
animation-ready proportions,
consistent anatomy across all poses.

LAYOUT:
full body visible in every pose,
organized turnaround sheet,
organized pose sheet,
white studio background,
concept art presentation,
game development reference sheet,
high resolution,
masterpiece quality,
no cropping,
no text,
no watermark,
no logos,
entire character visible.

Royal Sprite Puffle, legendary evolution, fluffy emerald and gold fur, giant plush arms, oversized magical paws, elegant fluffy feet, leaf crown made of enchanted crystal leaves, glowing emerald eyes, majestic anime creature, fantasy guardian spirit, premium RPG mascot, full turnaround sheet, front side back views, idle pose, run pose, attack pose, flying pose, magic casting pose, victory pose, highly detailed anime concept art, Studio Ghibli and Pokémon inspired, cinematic lighting, collectible game creature, masterpiece quality, no text, no watermark.

## How it maps onto the sheets

- Fluffy spherical body and layered fur rim: the body disc plus the 32 rim tufts.
- Oversized sparkling anime eyes: large sclera, oversized iris, twin highlights.
- Leaf-shaped ears: the `leaf` ear style.
- Plush cloud arms, rounded paws, visible toes: shoulder fluff, palm plus three fingers, paw pads.
- Oversized plush feet with toes: the big foot plates with three toe dots each.
- Leaf accents and glowing leaf energy: rim leaves and the sparkle pass.
- Royal Puffle: the Crystal leaf crown hat with a gold dye, plus the emerald palette.

## Sheet sizes

8192 x 8192 px
Transparent Background
512 x 512 per frame        128 x 128
64 x 64
32 x 32

All four sizes use the same 16 x 16 frame grid, so a frame index never moves
between resolutions. `tools/make_lumi_hi.py` writes the pack into
`assets/lumi/hi/`: the 8192 master at 512px per frame, then 2048 (128px per
frame), 1024 (64px) and 512 (32px).
