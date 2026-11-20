# Sprite Hollow — animated world & biome atlas

Production brief for the 12 named biomes, their transitions, weather, day/night
and homes. Written against the scenes the game already ships, so every entry
says what exists and what would be new.

Existing anchors: `SCENES` in `src/data.js` (Sunny Grove, Moon Hollow, Tidepool,
Neon Den, Aurora Ridge, Crystal Caverns, Ember Forge, Sugar Kitchen, Dream
Conservatory, Coral Reef, Golden Savanna), plus the 18 typed biomes
(`biome-grass`, `biome-ice`, …) from `src/data-biomes.js`. Weather already has
11 keys in `WEATHERS`, including petals, leaves and breeze.

---

## 1. Biome map

| Brief biome | Built on | Status |
|-------------|----------|--------|
| Verdant Hollow | `grove` + `biome-grass` | Covered — needs density pass |
| Bloomwild Meadow | `grove`, `biome-fairy` | Partly — flower scale is new |
| Crystalbrook Springs | `tide`, `reef`, `crystal` | Covered — springs dress |
| Cloudtop Isles | `dream`, `biome-flying` | Partly — floating islands new |
| Frostveil Peaks | `aurora`, `biome-ice` | Covered — aurora is active |
| Embercore Valley | `ember`, `biome-fire` | Covered |
| Stormreach Cliffs | `biome-electric`, `aurora` | Partly — rotating rock islands new |
| Spiritshade Grove | `night`, `biome-ghost` | Covered |
| Galaxy Gardens | `night`, `biome-psychic` | Partly — orbit layer new |
| Dragonroot Wilds | `biome-dragon` | Partly — colossal roots new |
| Royal Blossom Kingdom | `sugar` palette, `biome-fairy` | Mostly new dressing |
| Creation Nexus | nothing | New scene |

Six biomes need only art dressing on existing scenes; four need a new
environmental layer; Creation Nexus needs a scene of its own.

### 1.1 Per-biome art notes

- **Verdant Hollow** — canopy light shafts, moss path, stump flowers, drifting
  leaves, fireflies at dusk. Landmarks: treehouse, acorn hut, mushroom cottage.
- **Bloomwild Meadow** — flowers taller than a Puffle, petal drift, bee and
  butterfly loops, rose garden and petal house.
- **Crystalbrook Springs** — layered waterfalls, lotus floats, ripple rings,
  rainbow mist, lily-pad homes and a crystal cove.
- **Cloudtop Isles** — parallax islands, cloud stair, rainbow bridge, bird
  flypasts, cloud castle and sky nest.
- **Frostveil Peaks** — snow forest, glacier keep, ice cave glow, aurora bands,
  frozen lake reflections.
- **Embercore Valley** — lava river with flow distortion, ember drift, volcano
  plume, heat shimmer, forge and phoenix perch.
- **Stormreach Cliffs** — cloud sea, lightning arcs between floating rocks, rain
  sheets, storm tower silhouette.
- **Spiritshade Grove** — fog layers, lantern wisps, ghost butterflies, shrine
  glow, moon rays through branches.
- **Galaxy Gardens** — nebula sky, slow planet orbit, constellation lines,
  shooting stars, observatory dome.
- **Dragonroot Wilds** — root arches larger than the frame, rune glow, dragon
  silhouettes crossing the moon, roost and rune hall.
- **Royal Blossom Kingdom** — gold filigree, blossom waterfall, floating flower
  islands, palace silhouette, crest in the sky.
- **Creation Nexus** — fractured sky, floating reality shards, cosmic river,
  glyph storms, temple and citadel silhouettes.

---

## 2. Transitions

Twelve links, each 1.2–1.8 s, skippable on tap, disabled into a 200 ms
cross-fade under reduced motion.

| From → To | Effect | Duration |
|-----------|--------|----------|
| Verdant → Bloomwild | sprouts underfoot, leaves become petals | 1.4 s |
| Bloomwild → Crystalbrook | petal waterfall becomes stream | 1.6 s |
| Crystalbrook → Cloudtop | water spirals up into cloud stairs | 1.8 s |
| Cloudtop → Frostveil | clouds crystallise, snow swirl | 1.6 s |
| Frostveil → Embercore | ice melts to steam, cracks glow | 1.5 s |
| Embercore → Stormreach | embers spiral, lightning ring | 1.5 s |
| Stormreach → Spiritshade | thunder fades to fog and lanterns | 1.6 s |
| Spiritshade → Galaxy | wisps become stars, nebula opens | 1.8 s |
| Galaxy → Dragonroot | constellations become dragons | 1.8 s |
| Dragonroot → Royal Blossom | roots bloom, crest forms | 1.6 s |
| Royal Blossom → Creation Nexus | crown cracks reality open | 2.0 s |
| Nexus → Verdant (loop) | gateway closes, grass regrows | 1.8 s |

Implementation: one overlay layer, three particle emitters maximum, no new
renderer. Each transition needs a start frame, a mid frame and an end frame, and
must not block input longer than its duration.

---

## 3. Weather

| Brief | Existing | Action |
|-------|----------|--------|
| Sunny | `sun` | Covered |
| Rain | `rain` | Covered |
| Snow | `snow`, `frost` | Covered |
| Storm | `storm` | Covered |
| Rainbow | — | New: adds arch, petals, butterfly spawn |
| Celestial | — | New: stars, moonbeams, constellation overlay |
| Genesis | — | New: reality tears, glyphs, cosmic particles |

New weathers should follow the `WEATHERS` shape (`key`, `name`, `icon`, `blurb`,
`chill`) so seasons, climate bias and the weather picker keep working.

---

## 4. Day/night

A four-phase cycle — sunrise, day, sunset, night — driving sky tint, ambient
light and particle colour. Night adds fireflies, lit windows and nocturnal
species. It should read from `state.world` and never override the player's
chosen scene tint; rooms keep their own palettes.

---

## 5. Homes per biome

The brief's homes map onto the existing decor system plus the facade layer from
`home-ui-wireframes.md` §21.5: one facade art piece per biome, all sharing the
same room, furniture and tint data.

| Biome | Facade | Backing room |
|-------|--------|--------------|
| Verdant | treehouse / acorn hut / mushroom cottage | `grove` |
| Bloomwild | flower castle / petal home | `grove` |
| Crystalbrook | pond retreat / lotus villa | `tide` |
| Cloudtop | cloud castle / sky nest | `dream` |
| Frostveil | ice palace / snow lodge | `aurora` |
| Embercore | ember forge / phoenix sanctuary | `ember` |
| Stormreach | thunder keep / storm fortress | `aurora` |
| Spiritshade | spirit shrine / moon temple | `night` |
| Galaxy | observatory mansion / nebula villa | `night` |
| Dragonroot | dragon roost / rune hall | `biome-dragon` |
| Royal Blossom | Bloom Queen Palace / blossom castle | `sugar` |
| Creation Nexus | Genesis Temple / Creator Citadel | new scene |

---

## 6. Special events

Rainbow After Rain, Blossom Festival, Crystal Rain, Falling Star Shower, Aurora
Festival, Meteor Shower, Grand Tempest, Spirit Moon Night, Cosmic Bloom, Dragon
Awakening, Pufflea Festival, Genesis Event.

Each is a weather + tint + particle preset with an event badge, not a separate
biome. Existing holiday events can host them without a new scheduler.

---

## 7. Technical guardrails

- No new scene keys for the six dressing-only biomes; reuse `SCENES` entries.
- Transitions are an overlay, not a router change: `App.tab` stays put.
- Cap particles at 60 on screen, 2 emitters per layer, pause off-screen.
- Reduced motion collapses every transition to a cross-fade and stops drifting
  particles.
- Honour `prefers-reduced-motion`, the in-game Motion setting and the Sound
  toggle; transitions get captions.
- Art stays in `assets/lumi/art/`; no generated text or watermarks in shipped
  assets.
