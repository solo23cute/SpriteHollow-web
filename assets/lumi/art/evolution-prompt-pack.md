# Puffle evolution art — prompt pack

One prompt per family, written for a text-to-image model. Each produces a
four-stage evolution lineup that matches the chains registered in
`src/data-evolution-lines.js`, so the art, the Codex and the evolution strip all
tell the same story.

Regenerate one family at a time: the models keep a line more consistent per call
than across a 100-creature roster.

## How to use this pack

1. Start every prompt with the **Style DNA** line below.
2. Follow it with the family prompt.
3. Append the **Roundness clause** so the body reads as a circle rather than a
   pear or a standing animal.
4. Paste the **Universal negative prompt** into the negative field.

## Style DNA (prepend to every prompt)

Sprite Hollow character style, adorable perfectly round fluffy Puffle, circular
silhouette as wide as it is tall, oversized sparkling eyes, tiny paws, short
muzzle, soft fox-rabbit ears, thick luxurious fur, glowing forehead crystal,
magical elemental aura, chibi fantasy mascot proportions, highly expressive
face, soft gradient colours, luminous highlights, fluffy round tail, thick fur
shading, collectible mobile game creature, Pixar-inspired finish, polished
fantasy RPG style, vibrant magical particles, clean centred composition,
professional creature roster artwork, premium mobile game mascot.

## Roundness clause (append to every prompt)

perfectly round spherical body, circular silhouette, dense fluffy fur, plush
fur texture, chubby cheeks, stubby round limbs, soft fur rim catching the
rim light, round fluffy tail, no visible neck, no straight edges.

## Universal negative prompt

blurry, low quality, realistic animal, human, horror, scary, aggressive,
deformed anatomy, extra limbs, duplicate creature, cropped character,
watermark, signature, text, logo, UI clutter, empty eyes, dull colours, low
detail, messy composition, pear-shaped body, long neck, skinny legs, angular
silhouette, flat fur, bald patches, jpeg artifacts.

## 🌿 Nature

Forest Sprout Puffle → Ancient Grove Form → Worldtree Guardian → Eternal Nature
Sovereign, growing leaves, flowers, vines, tree antlers, emerald magic,
enchanted forest energy, magical particles, vibrant greens, evolution chart
left to right, four forms at equal scale.

## 🔥 Fire

Ember Puffle → Flameheart Form → Phoenix Guardian → Inferno King, blazing
flames, molten crystals, fiery wings, lava seams, glowing ember fur, fantasy
creature progression, vibrant orange and red, AAA mobile RPG finish.

## ❄️ Ice

Frost Puffle → Glacier Form → Frostcrown Form → Eternal Winter Monarch,
crystal ice armour, snowflakes, frozen wings, aurora ribbons, icy blue magical
energy, magical winter creature, highly detailed fur.

## ⚡ Electric

Spark Puffle → Thundercloud Form → Stormbringer Form → Tempest Emperor, lightning
horns, electric wings, storm clouds, glowing energy trails, yellow and blue
sparks, fantasy creature evolution, game mascot finish.

## 💧 Water

Dewdrop Puffle → Tideline Form → Ocean Guardian → Leviathan Emperor, magical waves,
coral crystals, sea glass, water aura, sparkling droplets, aquatic fantasy
energy, vibrant blues.

## 🌎 Earth

Pebble Puffle → Mosswreath Form → Mountain Titan Form → Earth Sovereign,
living stone armour, moss, roots, floating rocks, crystal veins, earthy greens
and warm browns, magical earth energy.

## 🌪️ Wind

Breeze Puffle → Cloudcurl Form → Sky Dancer Form → Hurricane Guardian, floating
clouds, wind ribbons, feather wings, sky magic, bright white and sky blues,
buoyant floating pose.

## 🌙 Moon

Moonlight Puffle → Crescent Spirit Form → Lunar Guardian → Lunar Queen, floating
moons, silver fur, celestial glow, star motes, magical lunar energy,
collection-card finish.

## ☀️ Light

Dawn Puffle → Sunflare Form → Celestial Sun Guardian → Divine Light Emperor,
golden wings, radiant halos, celestial armour, glowing sunlight, holy energy,
masterpiece polish.

## 🌑 Shadow

Shadow Puffle → Nightmare Form → Abyss Guardian → Abyss Lord, dark crystals,
purple flames, glowing crimson eyes, floating shadow shards, mystical darkness
aura, detailed fantasy creature.

## 🌌 Cosmic

Galaxy Puffle → Nebula Form → Starforge Guardian → Celestial Hollow Puffle,
galaxies inside the fur, orbiting planets, constellation patterns, cosmic dust,
violet and deep blue palette.

## 💎 Crystal

Crystal Puffle → Sapphire Guardian Form → Prism Spirit → Infinity Crystal
Puffle, gemstone wings, faceted crystal growth, rainbow refractions, magical
crystal energy, collectible creature design.

## 🐉 Dragon

Dragonling Puffle → Crystal Dragon Form → Celestial Dragon → Prism Dragon
Emperor, dragon wings, crystal scales, rainbow energy, adorable dragon mascot,
fantasy RPG roster art.

## 👻 Spirit

Spirit Guardian Puffle → Astral Wanderer Form → Soulfire Protector → Elder Sprite
Ascendant, ghostly wings, blue spirit flames, floating runes, ethereal soul
energy, elegant progression.

## 🍄 Mushroom

Mushroom Puffle → Glowcap Form → Ancient Fungi Guardian → Mycelium Emperor,
glowing mushrooms, fairy spores, enchanted forest magic, bioluminescent
highlights, colourful fantasy creature.

## 🎵 Music

Melody Puffle → Symphony Form → Harmony Guardian → Harmony Prime, musical notes,
rhythm waves, sound rings, headphones, neon magenta and cyan, fantasy mascot
design.

## ⏳ Time

Hourglass Puffle → Chronowisp Form → Timekeeper Guardian → Infinity Puffle, floating
clocks, gears, golden hourglasses, temporal rings, magical timeline energy,
ultra detailed fantasy art.

## 🌈 Rainbow

Rainbow Puffle → Auroralight Form → Prism Eternity → Rainbow Creator Spirit,
rainbow crystal wings, prismatic fur, celestial colours, sparkling refractions,
collectible creature design.

## 👑 Secret / Creator

Sprite Hollow Prime → Ascended Prime → Cosmic Prime → Universal Prime, gigantic
crystal wings, galaxy core, rainbow halo, celestial crown, floating
constellations, creator deity energy, legendary mascot, masterpiece quality.

## Pipeline notes

- Every name here matches a registered species key, so a finished sheet can be
  dropped under `assets/lumi/` and pointed at from the species' hidden puffle
  style.
- Keep the four forms on one row at equal height; the app renders one creature
  per card, so the sheet is a reference board rather than a runtime asset.
- Every stage name in the archive is now unique: *Starfall Sovereign* closes the
  Comet line instead of reusing the *Cosmic Sprite Prime* species, and *Rainbow
  Creator Spirit* matches the Rainbow chain while *Infinite Spectrum Monarch*
  belongs to the Prismatic line alone.
- Early and mid-stage forms were renamed wherever they matched a standalone
  species: Thundercloud, Stormbringer, Frostcrown, Tideline, Mosswreath,
  Cloudcurl, Chronowisp, Auroralight, Prism Eternity and Magma Whelp. The only
  shared names left are roots that carry their own species' name (Blossom,
  Crystal, Mushroom), which is how a chain's first form is meant to read.- The roundness clause is the one to keep when a model drifts toward a
  standing animal: "perfectly round spherical body, no visible neck, stubby round
  limbs" pulls the silhouette back to the Puffle shape.

## Master key art (the whole encyclopedia in one image)

Use the Style DNA and Roundness clause above, then this brief. It is written for
one wide key-art sheet: 19 families across the frame, each as a full chain, with
the rarity ladder and stat bars legible at thumbnail size. Expect to generate it
several times and composite the best family strips.

Sprite Hollow Universe, massive fantasy mobile RPG creature encyclopedia
featuring over 100 unique collectible Puffles organised into rarity tiers and
evolution paths. Consistent Sprite Hollow art style across all creatures:
adorable fluffy fantasy mascots, round chibi bodies, oversized sparkling eyes,
tiny paws, fox-rabbit ears, glowing forehead crystals, luxurious fur, magical
elemental auras, Pixar-inspired quality, AAA fantasy RPG artwork.

Display all elemental families: Nature, Fire, Water, Ice, Electric, Earth, Wind,
Moon, Light, Shadow, Cosmic, Crystal, Dragon, Spirit, Mushroom, Music, Time,
Rainbow and Creator. Each family is a complete evolution chain — Baby → Advanced
→ Rare → Epic → Legendary → Mythic → Secret → Ultra Secret — connected by glowing
evolution arrows, transformation effects, rarity upgrades, crystal growth, wing
evolution, magical armour progression, elemental awakenings, celestial ascensions
and divine forms.

Rarity tiers with badges: Common (Silver Crystal), Uncommon (Emerald Gem), Rare
(Sapphire Crystal), Epic (Arcane Crown), Legendary (Golden Star), Mythic (Mythic
Crest), Secret (Rainbow Crown), Ultra Secret (Cosmic Throne).

Featured creatures: Forest Sprout, Blossom, Worldtree Guardian, Eternal Nature
Sovereign, Ember, Flameheart, Phoenix Guardian, Inferno King, Dewdrop, Leviathan
Emperor, Frost, Eternal Winter Monarch, Spark, Tempest Emperor, Moonlight, Lunar
Queen, Dawn, Divine Light Emperor, Shadow, Abyss Lord, Galaxy, Celestial Hollow,
Infinity Crystal, Prism Dragon Emperor, Harmony Prime, Infinity, Rainbow
Eternity, Creator, Sprite Hollow Prime, Hollow King, Hollow Queen,
Cosmic Sprite Prime and Universal Prime.

Stat bars beneath creatures: HP, Attack, Magic, Defense, Resistance, Speed,
Critical Rate. Rarity power scaling from Common 1★ to Ultra Secret 8★. Hollow
Coins, Spirit Gems, Stardust, Nature Essence, Moon Shards, Ancient Crowns and
Rainbow Crystals appear as currency glyphs.

Background: the complete Sprite Hollow Kingdom — floating islands, crystal
forests, celestial temples, magical waterfalls, glowing mushrooms, rainbow skies,
dragon sanctuaries, summon portals, cosmic gateways, ancient ruins, legendary
shrines, the world tree, the moon palace and the creator throne. Premium gacha
RPG presentation, collectible card screen, evolution archive, fantasy bestiary,
vibrant colours, cinematic lighting, ultra detailed fur, magical particles,
no text, no watermark, no logos, 8K AAA fantasy key art.

Reminder for this brief: "no text" conflicts with the request for legible rarity
labels and stat bars. Generate the art without lettering and add the badges in
engine — the Codex already draws them from `data-rarity.js` and `data-stats.js`.

## Universe poster — v2 brief (elemental families + powers)

Paste this whole block as one prompt when generating the master roster poster. It
supersedes the v1 universe brief above; the only engine conflict stays the same:
generate art with no lettering, and let the Codex draw badges, percentages and
stat bars from `data-rarity.js`, `data-stats.js` and `data-matchups.js`.

SPRITE HOLLOW UNIVERSE, massive fantasy mobile RPG creature encyclopedia and
collector roster featuring 100+ unique collectible Sprite Hollow Puffles, all
sharing the same art style: adorable fluffy fantasy mascots, round chibi bodies,
oversized sparkling eyes, glowing forehead crystals, soft fox-rabbit ears, fluffy
tails, vibrant magical auras, bear ears, dog ears and cat ears, luxurious detailed
fur, collectible mobile game mascot design, Pixar-inspired quality, AAA fantasy
RPG artwork, colourful elemental effects, premium creature roster presentation.

Family master lines (each arrow is a glowing evolution path):

🌿 Nature: Forest Sprout → Blossom → Ancient Grove → Worldtree Guardian → Eternal Nature Sovereign
🔥 Fire: Ember → Flameheart → Phoenix Guardian → Magma Emperor → Inferno King
💧 Water: Dewdrop → Tide → Ocean Guardian → Sea Sovereign → Leviathan Emperor
❄️ Ice: Frost → Glacier → Arctic Crown → Frozen Celestial Guardian → Eternal Winter Monarch
⚡ Electric: Spark → Thunder → Stormcaller → Tempest Emperor → Cosmic Voltage King
🌎 Earth: Pebble → Moss Guardian → Mountain Titan → Earth Sovereign
🌪️ Wind: Breeze → Cloud Puff → Sky Dancer → Hurricane Guardian
🌙 Moon: Moonlight → Crescent Spirit → Lunar Guardian → Moon Warden → Lunar Queen
☀️ Light: Dawn → Sunflare → Celestial Sun Guardian → Holy Star Sovereign → Divine Light Emperor
🌑 Shadow: Shadow → Nightmare → Abyss Guardian → Void Walker → Abyss Lord
🌌 Cosmic: Galaxy → Nebula → Starforge Guardian → Celestial Hollow → Cosmic Sprite Prime
💎 Crystal: Crystal → Sapphire Guardian → Prism Spirit → Infinity Crystal
🐉 Dragon: Dragonling → Crystal Dragon → Celestial Dragon → Prism Dragon Emperor
👻 Spirit: Spirit Guardian → Astral Wanderer → Soulfire Protector → Elder Sprite Ascendant
🍄 Mushroom: Mushroom → Glowcap → Ancient Fungi Guardian → Mycelium Emperor
🎵 Music: Melody → Symphony → Harmony Guardian → Harmony Prime
⏳ Time: Hourglass → Chrono → Timekeeper Guardian → Infinity
🌈 Rainbow: Rainbow → Aurora → Rainbow Eternity → Infinite Spectrum Monarch
👑 Creator: Creator → Sprite Hollow Prime → Ascended Prime → Cosmic Prime → Universal Prime

Show complete evolution trees connected by glowing magical evolution arrows,
crystal upgrades, wing growth, elemental ascensions, divine transformations,
rarity upgrades, magical armour progression, celestial crowns, floating halos,
rune circles, constellation effects and legendary awakenings.

Rarity tiers: ⚪ Common ◇ Silver Crystal · 🟢 Uncommon ◆ Emerald Gem · 🔵 Rare
💎 Sapphire Crystal · 🟣 Epic 👑 Arcane Crown · 🟠 Legendary ⭐ Golden Star ·
🔴 Mythic ✨ Mythic Crest · 🌈 Secret 🌈 Rainbow Crown · 👑 Ultra Secret
👑 Cosmic Throne / 💕 Heart Throne.

Combat classes: Tank, Guardian, Mage, Bruiser, Assassin, Healer, Support,
Controller, Summoner.

Elemental powers to depict: Nature healing vines and regeneration, Fire burns and
phoenix flames, Water tidal magic and barriers, Ice freezing storms and crystal
armour, Electric chain lightning and speed boosts, Earth seismic attacks and stone
armour, Wind tornadoes and evasion, Moon blessings and healing, Light holy magic
and radiant shields, Shadow curses and lifesteal, Cosmic gravity and meteors,
Crystal prism beams and reflective barriers, Dragon breath attacks and brute
strength, Spirit soul magic and astral powers, Mushroom spores and poison clouds,
Music rhythm energy and team buffs, Time manipulation and extra turns, Rainbow
adaptive spectrum magic, Creator reality-bending universal energy.

Stat bars beneath many creatures: HP, Attack, Magic, Defense, Resistance, Speed,
Critical Rate. Currencies as glyphs: Hollow Coins, Spirit Gems, Stardust, Nature
Essence, Moon Shards, Ancient Crowns, Rainbow Crystals.

Background: Sprite Hollow Kingdom, gigantic World Tree, floating islands, crystal
forests, glowing waterfalls, moon temples, celestial palaces, dragon sanctuaries,
enchanted mushroom groves, rainbow skies, ancient ruins, summon portals, cosmic
gateways, creator throne, magical lanterns, legendary shrines, fantasy RPG world
map atmosphere. Creature encyclopedia UI, monster collection book, gacha roster
screen, premium fantasy RPG presentation, collectible card gallery, evolution
archive, completion tracker, vibrant colours, cinematic lighting, magical
particles everywhere, highly detailed fur textures, ultra-polished rendering,
masterpiece composition, no empty space, no text, no watermark, no logos, no UI
glitches, full roster visible, 8K, AAA mobile game key art, ultimate Sprite
Hollow universe poster.

### Engine status (updated)

- Five-stage chains are live: each line registers its own stage list and its own
  per-stage rarity ladder, so the encyclopedia's names and rarity bands above are
  what the Codex draws. Four-stage families (Crystal, Dragon, Spirit, Mushroom,
  Music, Time, Rainbow) keep four chips on purpose.
- Tide, Arctic Crown, Stormcaller, Stone Warden, Tempest Sovereign, Magma Emperor,
  Sea Sovereign, Moon Warden and Universal Prime are all real chain stages now.
- Heart Throne is the second Ultra Secret badge (15% of Ultra Secret rolls).
- Remaining art gap: the fifth form is drawn from the shared sheet plus an
  engine halo/rim treatment; distinct painted ascension silhouettes are still a
  generator job.


## 25-form production art (Sprite Puffle elemental collection)

One image per form beats one giant lineup; image models lose detail past ~8
creatures. Prepending the style block and swapping the element line gives a
consistent official set.

STYLE BLOCK (prepend to every prompt):
Sprite Hollow Sprite Puffle, premium production artwork, official mascot
creature, ultra-cute anime fantasy forest spirit, fluffy round body, giant
expressive anime eyes, oversized plush arms, three-finger paws, oversized fluffy
feet, leaf-shaped ears, glowing leaf tuft, layered fur, Pokémon-quality creature
design, Studio Ghibli charm, collectible RPG companion, AAA concept art, soft
cinematic lighting, clean cel shading, character spotlight composition, full body
visible, no text, no watermark, no logo, 8K.

ELEMENT LINES:
Ember (Fire) ember-orange fur, molten leaf tuft, cinders, flame aura.
Bloom (Grass) emerald fur, blossoms, vines, petals, forest glow.
Tideflit (Water) seafoam fur, waves, bubbles, coral accents.
Whisp (Air) cloud fur, feathers, wind currents, floating pose.
Volt (Electric) golden fur, lightning leaf tuft, crackling sparks.
Frost (Ice) snowy fur, crystal growths, snowflakes, winter air.
Terra (Earth) moss-stone fur, roots, floating crystals.
Venom (Poison) purple-green fur, glowing spores, luminous mushrooms, mist.
Alloy (Metal) silver alloy fur, armour plating, glowing core, metal leaves.
Shadow (Dark) black-violet fur, magenta eyes, void flames, eclipse aura.
Celestial (Light) radiant white fur, stars, halo, divine glow.
Mystic (Arcane) floating runes, glyph rings, enchanted violet energy.
Spirit (Ghost) translucent fur, spirit flames, spectral particles.
Crystal gemstone armour, rainbow crystal formations, prism reflections.
Storm (Storm) thunderclouds, rain particles, wind, electric sky.
Lunar (Moon) silver-white fur, crescent markings, moonlight.
Solar (Sun) golden fur, sunbeams, solar flares.
Floral (Flower) blossom petals, floral crown, spring magic.
Sand (Desert) sandstone fur, dust swirls, ancient runes.
Magma (Lava) obsidian fur, molten cracks, volcanic glow.
Cosmic (Space) galaxy fur, nebulae, orbiting stars.
Time (Clock) floating clocks, hourglasses, golden trails.
Dream pastel clouds, floating stars, dream particles.
Sound glowing notes, rhythm waves, sonic colour.
Primal (Legendary) world-tree spirit, bark armour, sacred leaves, runes.
Aether (Mythic) pure elemental energy, rainbow aura, crystal shards, cosmic nature magic.

SHEET GROUPINGS for lineup boards: core (Ember, Bloom, Tideflit, Whisp, Volt),
advanced (Frost, Terra, Venom, Alloy, Storm), realms (Shadow, Celestial, Mystic,
Spirit, Crystal), cosmic (Lunar, Solar, Cosmic, Time, Dream), legendary (Floral,
Sand, Magma, Sound, Aether).

Engine note: the app draws these as engine effects today — fire, vine, bubble and
spark particle layers keyed by family (`lumiElementFx`), not repainted sheets.
Repainting the 84 kit sheets and the 512 atlas needs the sheet generator, not
this codebase.

---

## Personality & Trait System (character lore for image generation)

Every Sprite Hollow puffle is born with **one primary and one secondary trait**.
The pair decides how it carries itself, how it is drawn, and what it is good at.
Traits are rolled per puffle and never change, so a companion keeps the same
character for life.

### Core traits

| Trait | Bonus | Character note |
| --- | --- | --- |
| Brave | +10% Attack, +5% Critical Chance | Loves adventure |
| Caring | +10% Healing, +5% Team Support | Protects weaker puffles |
| Curious | +10% Experience Gain | Constantly discovers secrets |
| Loyal | +10% Bond Growth, stronger team synergies | Never abandons allies |
| Playful | +10% Speed, bonus dodge chance | Loves games and mischief |
| Wise | +10% Magic, better status effects | Ancient knowledge |
| Energetic | +15% Stamina, faster skill cooldowns | Always moving |
| Gentle | +10% Defense, increased shield power | Friendly and peaceful |
| Mischievous | +10% Debuff Success, trickster abilities | Loves practical jokes |
| Noble | +15% Leadership Aura, team stat buffs | Natural rulers |

### Family personality, likes and signature behaviour

- **Nature** — Kind, Protective, Patient, Loyal · likes forests, flowers, gardening, friends · protects younger puffles and restores damaged habitats.
- **Fire** — Bold, Competitive, Courageous, Passionate · likes challenges, racing, combat training, volcanoes · never backs down from a challenge.
- **Water** — Calm, Friendly, Adaptable, Caring · likes swimming, rain, oceans, teamwork · senses emotions through magical water currents.
- **Ice** — Quiet, Intelligent, Observant, Elegant · likes snow, moonlight, reading, meditation · thinks before acting and rarely makes mistakes.
- **Electric** — Hyperactive, Adventurous, Impulsive, Fun-loving · likes racing, flying, speed competitions, exploration · constantly surrounded by tiny sparks.
- **Earth** — Reliable, Honest, Hardworking, Protective · likes building, mining, crystals, crafting · protector of ancient ruins.
- **Wind** — Free-spirited, Cheerful, Curious, Social · likes travel, heights, flying, new friends · rarely stays in one place for long.
- **Moon** — Gentle, Empathetic, Caring, Mystical · likes stars, dreams, healing, storytelling · assists lost travellers at night.
- **Light** — Noble, Honest, Courageous, Inspirational · likes helping others, leadership, justice, harmony · natural leaders of communities.
- **Shadow** — Independent, Clever, Secretive, Resourceful · likes mysteries, puzzles, exploration, hidden areas · often misunderstood but fiercely loyal.
- **Cosmic** — Wise, Curious, Visionary, Calm · likes stars, space, knowledge, ancient secrets · sees traces of future possibilities.
- **Crystal** — Disciplined, Elegant, Patient, Refined · likes gemstones, craftsmanship, beauty, collection · maintains balance among elemental families.
- **Dragon** — Proud, Brave, Powerful, Protective · likes treasure, training, adventure, competition · strong guardians of Sprite Hollow.
- **Spirit** — Mysterious, Wise, Compassionate, Observant · likes ancient knowledge, memories, dreams, history · guides wandering souls safely home.
- **Mushroom** — Quirky, Cheerful, Creative, Helpful · likes gardening, music, community, forest festivals · creates magical spores that help other puffles grow.
- **Music** — Outgoing, Entertaining, Creative, Friendly · likes performing, dance, celebrations, festivals · communicates emotions through magical music.
- **Time** — Thoughtful, Wise, Calm, Responsible · likes history, knowledge, research, ancient ruins · remembers stories from generations past.
- **Rainbow** — Optimistic, Energetic, Compassionate, Imaginative · likes creativity, friendship, discovery, art · brings harmony between elemental families.
- **Creator** — four rulers rather than one:
  - *Sprite Hollow Prime* — Wise, Compassionate, Mysterious, Eternal · first puffle and guardian of balance.
  - *Hollow King* — Brave, Noble, Protective, Determined · defender of the Sprite Hollow Kingdom.
  - *Hollow Queen* — Elegant, Intelligent, Caring, Diplomatic · keeper of knowledge and harmony.
  - *Universal Prime* — Omniscient, Timeless, Benevolent, Infinite · embodiment of all Sprite Hollow life and magic.

### Art direction

Every puffle's personality must be **visible**, not just annotated:

- **Posture** — Fire leans forward with its chest out; Ice stands still and composed; Wind hovers slightly off the ground; Earth plants wide and low; Shadow shifts its weight back and turns half out of the light.
- **Expression** — Gentle puffles keep a soft half-lidded smile, Playful ones a wide open grin, Wise ones a level considering gaze, Shadow ones a single bright eye catching the light.
- **Accessories and aura** — Electric crackles sparks off fur tips, Moon carries a soft glow, Cosmic floats star freckles, Crystal shows faceted highlights, Rainbow bleeds prismatic colour between fur patches.
- **Body language** — Caring puffles curl their tail around smaller companions, Noble ones stand upright with an open chest, Mischievous ones tilt their head with one ear cocked.

Keep the unified Sprite Hollow mascot style: round fluffy fur, circle-based bodies,
soft rim light, big expressive eyes, and a palette drawn from the family colourway.
Personality changes the pose, face and aura — never the established shape language.
