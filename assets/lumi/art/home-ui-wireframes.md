# Sprite Hollow — Home Customization UI wireframes

Design pack for the home customization system. Wireframes are text-first so they
can be implemented screen by screen; measurements are mobile-first and scale up.

Companion references: `src/screens/homes.js` (neighbourhood, room windows),
`src/screens/senthome.js` (`HOME_UPGRADES`, decor pieces, house tint), `SCENES`
(biomes). Existing saves store `state.homes`, `state.homeUpgrades` and
`state.roomLayout`; this UI must read and write those shapes rather than
introduce a parallel store.

---

## 1. Screen map

```
Hollow  ──►  Homes (neighbourhood)
                └──►  Home View  ──┬──►  Build        (upgrade ladder)
                                    ├──►  Decor        ──►  Placement mode
                                    │                     └──►  Inventory
                                    ├──►  Pets         ──►  Interaction wheel
                                    ├──►  Storage
                                    ├──►  Effects
                                    ├──►  Rating
                                    ├──►  Photo mode
                                    └──►  More  ──►  Theme presets · Day/night · Fusion
```

Everything is a full-height sheet on phones (the existing `.sheet` fills the
viewport) and a centered card on tablets. No screen may depend on hover.

---

## 2. Home View

```
┌─────────────────────────────────┐
│ ‹   🏠 Bloom Queen Palace    ⋯  │  header: back, name, overflow
├─────────────────────────────────┤
│ ⭐ Home Level 25                │  progression strip
│ 💖 Comfort 8,420   🏡 S-Rank    │
├─────────────────────────────────┤
│                                 │
│        HOME VIEW (canvas)       │  tap targets inside the scene:
│   🌸      🐾        🦋          │  puffle → interaction wheel
│      🏡        ✨               │  station → its activity
│                                 │  decor piece → select
│                                 │
├─────────────────────────────────┤
│ 🏗️ Build  🎨 Decor  🐾 Pets     │  two-row dock, 48px targets
│ 📦 Storage ✨ Effects ⚙️ More   │
└─────────────────────────────────┘
```

States: `idle`, `decor-placing` (dock hides, toolbar appears), `photo` (all
chrome hides), `locked` (unlock banner replaces dock).

Home Level bar: `xp / nextXp`, with a small "what raises this" link opening the
rating screen. Comfort and rank are read-only here.

---

## 3. Decor mode and placement

### 3.1 Decor menu

```
┌───────────────────────────┐
│ 🎨 Decoration             │
├───────────────────────────┤
│ 🪑 Furniture         72   │
│ 🌸 Plants            34   │
│ 💡 Lighting          21   │
│ 🖼️ Decorations       45   │
│ 🏞️ Environment       12   │
│ 🎡 Attractions        9   │
│ ✨ Effects           14   │
└───────────────────────────┘
Each row: owned / total, e.g. "🪑 Furniture 41/72"
```

### 3.2 Placement mode

```
┌─────────────────────────────────┐
│ ✕  Place: Moss Path             │  cancel returns item to inventory
│                                 │
│        ╭──────╮                 │
│        │ item │  ghost at 60%   │  green outline = valid
│        ╰──────╯  opacity        │  red outline = blocked / out of bounds
│                                 │
├─────────────────────────────────┤
│ ⟲ Rotate  ⤢ Resize  ⧉ Stack    │
│ #️⃣ Grid   ✋ Free    ⤺ Undo     │
│              [ Place ]          │
└─────────────────────────────────┘
```

Rules:
- Drag places freely; **tap-to-place** is the accessibility equivalent and must
  exist for every item (choose slot → confirm).
- Rotate: 45° steps for most items, 90° for structural pieces.
- Resize: only flagged `resizable` items, 0.75×–1.5× in 0.25 steps.
- Stack: an item with `stackable` may sit on another; show a small "on: Rug"
  label so the relationship is never colour-only.
- Grid snap is on by default for furniture; free placement is a toggle that
  persists per player.
- Out of bounds, over capacity, or overlapping a non-stackable item → the Place
  button disables and the reason is announced, not just coloured red.

---

## 4. Furniture inventory

The inventory is a magical backpack plus catalogue: search and filters at the
top, a collectible card grid in the middle, capacity at the bottom, and no
dead-end menus. Everything here is reachable from **Decor → Inventory**.

### 4.1 Main layout

```
┌────────────────────────────────┐
│ 📦 Furniture Inventory         │
│ 🔍 Search…                     │
├────────────────────────────────┤
│ ⭐Favorites 🆕New              │
│ 🏡Indoor 🌿Outdoor             │
│ 🪑Furniture 🌸Nature           │
│ 💡Lighting ✨Effects           │
│ 🎡Attractions 👑Premium        │
├────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  🌺  │ │  🪑  │ │  💎  │    │
│  │ Rose │ │ Leaf │ │Prism │    │
│  │Bench │ │Chair │ │Lamp  │    │
│  └──────┘ └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  🌌  │ │  👑  │ │  🐉  │    │
│  └──────┘ └──────┘ └──────┘    │
├────────────────────────────────┤
│ Storage 1,245 / 2,000   [🛒]   │
└────────────────────────────────┘
```

- Three columns on phones, five on tablets, fixed card height so the grid never
  reflows under a finger.
- Filter chips wrap to two rows; the active chip is marked with a check, not
  colour alone.
- Capacity meter turns amber at 90% and explains what to do when full.
- The shop button opens §4.12 without leaving the inventory.

### 4.2 Item cards

```
┌─────────────┐
│     🌺      │
│ Rose Bench  │
│ ⭐ Legendary│
│ Comfort +25 │
│ Owned ×2    │
└─────────────┘
```

Each card shows preview art, name, rarity (icon + word), category, stat bonuses
and quantity owned. A heart badge marks favourites; a small dot marks "new".
Locked items show how to unlock instead of a price, and never appear in the
placeable grid until owned.

### 4.3 Placement flow

```
Select item ─► ghost preview ─► position ─► confirm
                    │              │           │
                    │              │           ├─ ✓ Place
                    │              │           ├─ ↻ Rotate
                    │              │           ├─ 📏 Resize (if allowed)
                    │              │           └─ ✕ Cancel
                    │              └─ green outline = valid
                    │                 red outline = blocked
                    └─ item name + conflict reason shown in the toolbar
```

1. **Select** — card lifts into a compact tray at the bottom; the grid dims.
2. **Ghost** — placed at the room centre, 60% opacity, with a validity outline.
3. **Position** — drag, or tap a slot then confirm (the accessible equivalent).
4. **Adjust** — rotate in 45° steps (90° for structural pieces), resize only on
   flagged items, stack only on `stackable` items with an "on: Rug" label.
5. **Confirm** — writes to `state.roomLayout`; the toast offers Undo.

Blocked states explain themselves: "No room here", "That spot is taken",
"Storage full — sell or store an item". Cancel returns the item with no change.

### 4.4 Quick decor wheel

Long-press (or press-and-hold with a keyboard, or use the ⋯ button) on placed
furniture:

```
        ⭐ Favorite
   🎨 Paint      ↻ Rotate
      📦 Store   ⬆ Upgrade
        💰 Sell
```

- Radial on tablets; on phones it becomes a labelled 2×3 sheet so every option
  is reachable one-handed.
- The ⋯ button is the always-visible alternative to the gesture, so no action
  depends on a long-press.
- Sell is the only destructive option: it confirms with the refund amount and is
  never adjacent to Store.

### 4.5 Smart collections and progress

```
Nature Collection
 74 / 100 Collected
 ████████░░  74%

Reward track
 25%  🪙 500 coins       ✓
 50%  💎 20 gems         ✓
 75%  🥚 Nature Egg
 100% 👑 Home title "Grove Keeper"
```

Collections: Nature, Crystal, Rainbow, Galaxy, Royal, Secret. Each has a fixed
item list, a progress bar and four reward steps. The collection view reuses the
same grid with a "missing" overlay, and tapping a missing card shows where it
comes from (shop rotation, event, fusion recipe).

### 4.6 Puffle furniture preferences

```
┌────────────────────────────────┐
│ Leaf Puffle                    │
│ Loves  🌳 Trees · 🌿 Plants    │
│        🪵 Wood furniture       │
│ Love bonus  +20 Happiness      │
└────────────────────────────────┘
```

Each Puffle family has three preferred tags and a +20 bonus to its signature
need (Happiness, Friendship or Magic). The inventory marks matching items with
a paw badge and a "Leaf Puffle loves this" line on the detail card. Placing a
loved item near that Puffle plays the inspect reaction in §4.13.

### 4.7 Furniture upgrades

```
Leaf Chair
  └─ Leaf Chair+            🍃 20 · 🪙 400
      └─ Enchanted Leaf     🍃 60 · ✨ 10
          └─ Guardian Throne 🍃 120 · 💎 25 · 🪙 2,000
```

- The ladder is linear and previewed on the item card; the next step shows exact
  materials and where to get them.
- Materials: Nature Essence, Crystal Shards, Magic Dust, Coins.
- Upgrading keeps the item's placement and collection progress; the visual
  changes immediately with a short transform.
- Upgrades are reversible only for the same-tier swap, never a downgrade.

### 4.8 Storage vault

```
Storage Categories
🌿 Nature   💎 Crystal   🌈 Rainbow
🌌 Galaxy   👑 Royal     ⚫ Secret

Sort: Recent · A–Z · Rarity · Theme · Favorites
```

Nothing is permanently lost: selling returns materials, storing frees a room
slot, and the vault has no capacity of its own. Removed items keep their
favourite flag and upgrade tier.

### 4.9 Search and filters

Typing `flower` returns Flower Pot, Flower Bench, Flower Arch and Blossom Tree.
Search matches name, collection, tag and Puffle preference. Advanced filters
combine: rarity (with icon), indoor/outdoor, stat boost (Comfort, Beauty, Magic,
Friendship, Energy) and owned/locked. Clearing filters is a single visible
action, and the result count is announced.

### 4.10 Room presets

```
Preset slots
1️⃣ Forest Retreat      [Apply] [⋯]
2️⃣ Crystal Palace      [Apply] [⋯]
3️⃣ Rainbow Garden       [Apply] [⋯]
4️⃣ Galaxy Observatory   [Apply] [⋯]
5️⃣ Empty Slot           [Save current]
```

Saving a preset stores the full layout (items, positions, rotation, theme,
effect). Applying swaps the design in one confirm; the previous layout is kept
as "Undo apply" for the session. Presets are per home, not global.

### 4.11 Furniture fusion

```
🌺 Rose Bench  +  🌌 Star Lamp
        =  🌹✨ Celestial Rose Bench

🌳 Nature Fountain + 💎 Crystal Fountain
        =  🌿💎 Crystal Grove Fountain
```

Fusion consumes one duplicate of each ingredient and produces a unique piece
that counts toward both parent collections. Recipes are discoverable: an
incomplete pair shows a silhouette and the missing ingredient, and fusing is
confirmed with the exact items removed.

### 4.12 Shop flow

```
Daily shop
├─ Common      ×4   refresh 24h
├─ Rare        ×3
├─ Epic        ×2
├─ Legendary   ×1
└─ Secret      rotation

Themed shops
Spring Bloom · Frostveil Winter · Galaxy Week
Dragon Festival · Pufflea Celebration
```

- Daily stock is deterministic per day and shows a countdown to refresh.
- Themed shops replace the Legendary/Secret rows during their event and are
  labelled with the event name and end date.
- Owned items show "Owned" instead of a buy button, so duplicates are a
  deliberate purchase for fusion.

### 4.13 Placement feedback loop

```
Place item
   ├─ nearby Puffles run over and inspect
   ├─ happiness hearts float up
   ├─ home score counts up live
   ├─ ambient effect for the collection activates
   └─ collection progress advances with a small chime
```

Feedback is capped: at most three Puffles react per placement, hearts last under
a second, and score changes animate as a count-up rather than a flash. With
Motion set to Calm, the reaction becomes a static heart badge and the count-up
is instant. All feedback also emits a caption ("Rose Bench placed, Comfort
+25") so it is available without sound or animation.

### 4.14 Furniture card states

Fifteen states, computed from one function (`furnitureCardState(item, home)`)
so every screen renders the same truth. Each state is icon **plus** text; the
animation is decoration, never the only signal.

| # | State | Card shows | Visual | Tap action |
|---|-------|------------|--------|------------|
| 1 | Locked | silhouette, "Unknown Item", 🔒 Locked | darkened card, slow lock pulse | View source · Wishlist |
| 2 | Newly discovered | 🌸 NEW!, name, rarity | one-time gold glow, confetti | Dismiss / open |
| 3 | Owned | name, ×qty, rarity, stat line | clean card, rarity border | Place |
| 4 | Favorited | ⭐ name, "Favorite Item" | corner star, soft trail | Place · unfavorite |
| 5 | Placed | ✅ In Home ×3 | green tag | Jump to home list |
| 6 | Upgrade ready | ⬆ Upgrade Ready | pulsing border, arrow glow | Upgrade |
| 7 | Upgrading | "Crafting…" + progress bar | particles, hammer ticks | View queue |
| 8 | Max level | 👑 name, MAX LEVEL | animated legendary border | Place |
| 9 | Set complete | Set Complete | ribbon + theme aura | Open collection |
| 10 | Fusion eligible | 🧬 Fusion Ready | energy ring | Open recipe |
| 11 | Fusion furniture | dual-rarity border, exclusive badge | unique background | Place |
| 12 | Event exclusive | 🎪 Event Exclusive + event name | event palette | View event |
| 13 | Premium | 💎 Premium | diamond corner badge | View shop |
| 14 | Legendary artifact | 👑 Legendary Artifact | animated frame, aura, custom sound | Place |
| 15 | Secret relic | ⚫ Secret Relic | black-gold border, runes | Place |

**Precedence when several apply** (highest first): Upgrading → Upgrade ready →
Fusion eligible → Fusion furniture → Secret relic → Legendary artifact →
Premium → Event exclusive → Set complete → Max level → Placed → Favorited →
Newly discovered → Owned → Locked. The card shows the top state as its primary
label and at most two others as small overlay badges.

**Transitions**

```
Locked ──acquire──► New ──seen──► Owned
Owned ──place──► Placed ──remove──► Owned
Owned ──materials──► Upgrade ready ──craft──► Upgrading ──finish──► Owned / Max level
Owned + Owned ──recipe──► Fusion eligible ──fuse──► Fusion furniture
```

New is a one-shot: it clears when the card is opened or the inventory closes,
and it never re-fires for a duplicate of the same item.

**Reduced motion and low-power**: pulsing borders, confetti, particles and
shimmer collapse to a static badge or border. "Upgrading" keeps its text and
progress bar because it carries information, not just decoration.

**Screen-reader text** leads with state then stats:
`"Rose Bench, placed in three homes, favourited, Comfort 25. Upgrade ready."`

### 4.15 Rarity frames and overlay badges

```
⚪ Common      wooden frame
🟢 Uncommon    silverbrook frame
🔵 Rare        elemental vanguard frame
🟣 Epic        arcane prism frame
🟡 Legendary   guardian crown frame
🔴 Mythic      celestial ascendant frame
⚫ Secret      origin relic frame
```

Frames are drawn by the existing rarity tokens (`data-rarity-colors.js`), so a
frame change never needs per-item art. Overlay badges stack on top of the frame:

```
⭐ Favorite    ✅ Placed    ⬆ Upgrade Ready    🔨 Upgrading
🧬 Fusion Ready   👑 Max Level   🎪 Event   💎 Premium   🏆 Set Complete
```

Rules:
- **Maximum three overlays**; the rest live on the detail card so a grid card
  never turns into icon soup.
- Badges sit in fixed corners: status top-left, ownership top-right, collection
  bottom-left. Position never changes with state.
- Every badge carries a text label in the detail view and an `aria-label` on the
  card; none is colour- or symbol-only.
- Frames keep 3:1 contrast against the card background, and the card's content
  area stays a flat panel so text remains AA on top of any frame.
- Legendary artifact and Secret relic animations pause when the card is off
  screen or motion is reduced.

## 5. Theme presets

```
┌─────────────────────────────────┐
│ 🏞️ Theme presets                │
├─────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐     │  live thumbnail per preset
│ │  Nature   │ │  Crystal  │     │
│ │ giant     │ │ gem paths │     │
│ │ flowers   │ │ prisms    │     │
│ └───────────┘ └───────────┘     │
│ ┌───────────┐ ┌───────────┐     │
│ │  Rainbow  │ │ Celestial │     │
│ └───────────┘ └───────────┘     │
│ ┌───────────┐ ┌───────────┐     │
│ │  Dragon   │ │  Creator  │     │
│ └───────────┘ └───────────┘     │
├─────────────────────────────────┤
│ Preview:  ☀️ Day  🌙 Night      │
│           [ Apply theme ]       │
└─────────────────────────────────┘
```

Applying a preset is reversible: "Revert to previous theme" stays available for
the session, and the confirm sheet lists which placed items will be hidden (not
deleted).

---

## 6. Activity zones

```
┌─────────────────────────────────┐
│ 🐾 Activity stations            │
├─────────────────────────────────┤
│ 🌱 Garden     Lv 4   [ Tend ]   │
│     grows seeds · ready in 2h   │
│ 💤 Sleep      Lv 2   [ Rest ]   │
│ 🎮 Play       Lv 5   [ Play ]   │
│ 🥋 Training   Lv 3   [ Train ]  │
│ 🧵 Crafting   Lv 1   [ Craft ]  │
└─────────────────────────────────┘
```

Each row: station, level, one primary action, a status line. Cooldowns render as
text ("ready in 2h") plus a progress bar; no action is hidden while on cooldown,
it is disabled with the reason announced.

---

## 7. Day / night control

```
┌─────────────────────────────────┐
│ ☀️ Day  🌅 Sunset  🌙 Night     │  segmented control, 44px min
│ ✨ Festival  ❄️ Winter          │
│ 🎃 Spooky  🎄 Holiday           │
├─────────────────────────────────┤
│      live scene preview         │
└─────────────────────────────────┘
```

Changing the preview never changes saved state until "Set as home time" is
pressed. Respect `prefers-reduced-motion` and the in-game Motion toggle.

---

## 8. Effects menu

```
┌─────────────────────────────────┐
│ ✨ Ambient effect               │
├─────────────────────────────────┤
│ ○ None                          │
│ ○ 🍃 Falling leaves    Common   │
│ ○ 🫧 Floating bubbles  Uncommon │
│ ○ 🔥 Floating embers   Rare     │
│ ○ 💎 Crystal sparkles  Epic     │
│ ○ 🌸 Blossom storm     Legendary│
│ ○ 🌌 Nebula drift      Mythic   │
│ ○ ✨ Reality fractures Secret   │
├─────────────────────────────────┤
│ Intensity  ▁▂▃▄▅  (Low–High)    │
│ [ Apply ]                       │
└─────────────────────────────────┘
```

Rarity is shown as text **and** icon, never colour alone. A "Reduce flashing"
switch forces low intensity for every effect.

---

## 9. Home rating

```
┌─────────────────────────────────┐
│ 🏆 Home rating                  │
├─────────────────────────────────┤
│ Comfort     ⭐⭐⭐⭐⭐   2,140     │
│ Beauty      ⭐⭐⭐⭐     1,860     │
│ Magic       ⭐⭐⭐⭐⭐   2,200     │
│ Friendship  ⭐⭐⭐⭐     1,410     │
│ Creativity  ⭐⭐⭐⭐⭐   1,940     │
├─────────────────────────────────┤
│ 🏡 Home Power 9,550             │
│ 👑 A-Rank Estate → S at 12,000  │
├─────────────────────────────────┤
│ Next unlocks                    │
│ • S-Rank: Crystal Arch          │
│ • Rare visitors at 10,000       │
└─────────────────────────────────┘
```

Stars also carry the numeric score, and rank letters are spelled out
("A-Rank", not only a crown).

---

## 10. Puffle interaction wheel

Long-press or tap a puffle in the home view:

```
        💖 Hug
   🎁 Gift     🍪 Feed
      💤 Rest   🎮 Play
        📸 Photo
```

- Radial on tablets, a 3×2 grid bottom sheet on phones (one-handed reach).
- Every action has a text label; icons are never the only cue.
- Escape / swipe-down closes without acting.
- Cooldown actions show remaining time on the button label.

---

## 11. Photo mode

```
┌─────────────────────────────────┐
│ ✕  Photo                        │
│                                 │
│         live scene              │
│      (chrome hidden)            │
│                                 │
├─────────────────────────────────┤
│ 👁 Hide UI   🐾 Pose  🌦 Weather│
│ 🕐 Time      🏷 Sticker  ✨ FX   │
│              [ Save ]           │
└─────────────────────────────────┘
```

Save writes a PNG through the existing photo-mode module; a "Copy settings"
button lets players reuse a shot's weather/time without the overlay.

---

## 12. Fusion homes

```
┌─────────────────────────────────┐
│ 🔮 Fusion Homestead             │
├─────────────────────────────────┤
│ Pick two fully upgraded homes   │
│ [🌿 Treehouse ▾]  +  [💧 Pond ▾]│
│                                 │
│ ➡️ River Grove Manor            │
│    preview art + bonuses        │
├─────────────────────────────────┤
│ Requires: both at Lv 5, 2,500 💎│
│ [ Fuse ]        (destructive)   │
└─────────────────────────────────┘
```

Fusion is destructive, so the confirm sheet lists exactly what changes, requires
typed confirmation on desktop and a long-press on touch, and keeps the two
source homes' decor in storage.

---

## 13. Accessibility baseline

**Visual**
- WCAG AA contrast for all text (4.5:1 body, 3:1 large) including on scene art;
  a semi-opaque panel behind labels over busy backgrounds.
- Never colour-only: rarity uses icon + label; validity uses icon + text.
- Text scaling 100–150% without clipping; layouts reflow, no fixed heights.
- Colour-blind-safe rarity chips (pattern/icon, not hue alone).
- "Reduce flashing" switch lowers all effect intensity and caps strobe rates
  below 3 Hz.

**Motor**
- Minimum 44×44 px targets; 8 px spacing between adjacent actions.
- Tap-to-place alternative for every drag interaction; rotate/resize have
  button equivalents.
- No timed interactions; cooldowns pause while a sheet is open.
- Single-tap undo within the toast window; destructive actions are never
  double-tap confirmations.

**Cognitive**
- One primary action per screen; consistent dock order across homes.
- Plain-language errors ("No room here — move the rug first").
- Optional "simple decor" mode that hides advanced tools (resize, stacking,
  grid/free toggle).
- Progress and costs always visible before committing.

**Audio / captions**
- Effect and interaction sounds respect the existing Sound toggle and the duel
  sound toggle precedent; ambient effects have their own switch.
- Captions announce placement, errors, and puffle reactions via `Captions.sound`.

**Screen reader and keyboard**
- Logical focus order: header → canvas → dock; focus is trapped in sheets and
  restored to the invoking control on close.
- Canvas items are a list for assistive tech: each decor piece is a focusable
  `aria-label="Moss Path, centre slot, Comfort 40"` with arrow-key movement when
  in placement mode.
- `aria-live="polite"` announcements for placement, undo, and errors.
- Visible focus ring on every control; no hover-only affordances.

**Motion**
- Honour `prefers-reduced-motion` and the in-game Motion/Calm setting: ambient
  effects reduce to a static tint, scene transitions cross-fade.

---

## 14. Data model sketch

```
home: {
  id, sceneKey, level, xp,
  themeId, dayPhase, effectId, effectIntensity,
  slots: [{ itemId, x, y, rot, scale, spot, hidden }],
  stations: { garden: {level, readyAt}, sleep: {...}, ... },
}
inventory: { itemId: ownedCount }
fusion: { id, sourceHomes: [a, b], createdAt }
```

Existing shapes to keep: `state.homes[spriteId]`, `state.homeUpgrades[id]`,
`state.roomLayout[pieceId]`. New data lives beside them and migrates on load
with defaults, so old saves open with zero migration prompts.

---

## 15. Furniture motion spec

### 15.1 Principles

- **Respond first, decorate second.** Any tap gets visible acknowledgement
  within 120 ms; the fancy sequence starts after that.
- **Never block input.** A reveal or craft animation can be skipped by tapping;
  the resulting state is applied immediately.
- **One loop per card.** Only `Locked`, `Upgrade Ready` and `Max Level` loop,
  and only while the card is on screen.
- **Cap the cinema.** A full unlock sequence is 0.5–1.4 s depending on rarity,
  never longer. A player opening twenty cards must not wait through twenty
  cinematics.
- **Transform and opacity only.** No animated width, height, top or box-shadow
  on large elements; particles are transform-only. Target 60 fps on a mid-range
  phone, ≤ 40 particles per card, ≤ 2 emitters.
- **Off-screen means paused.** IntersectionObserver pauses loops and particles;
  the inventory closing cancels everything.
- **Colour is never the message.** Motion and sound duplicate text already
  present on the card.

### 15.2 Duration and easing tokens

| Token | Duration | Use |
|-------|----------|-----|
| `instant` | 0 ms | state swap when reduced motion is on |
| `micro` | 90 ms | flash, tap acknowledgement |
| `quick` | 160 ms | card scale, badge pop |
| `base` | 240 ms | cross-fade, slide, toolbar |
| `slow` | 420 ms | reveal of the item body |
| `epic` | 900 ms | rarity flourish |
| `cinematic` | 1400 ms | Secret Relic sequence |

Easings: `standard` = `cubic-bezier(.2,.7,.3,1)`, `overshoot` =
`cubic-bezier(.2,1.2,.3,1)` for badge pops, `linear` only for rotating fog and
orbits. Loops are 2.4–3.2 s.

### 15.3 Interruption rules

```
new state arrives ─► cancel current animation ─► apply end state ─► start new
unlock + upgrade on same item ─► unlock plays, upgrade queues (max 1)
inventory closes ─► cancel loops, finish transitions instantly
reduced motion toggled on ─► cancel loops, jump to end states
```

State is authoritative; animation never gates the data write.

### 15.4 Reduced motion and low power

| Animation | Reduced-motion equivalent |
|-----------|---------------------------|
| Locked mist loop | static fog, no glimpse |
| Unlock sequence | 120 ms cross-fade + rarity badge pop |
| Upgrade ready pulse | static ⬆ badge |
| Craft sequence | progress bar only, instant finish |
| Max-level aura | static crown badge |
| Fusion chamber | 160 ms cross-fade |
| Collection completion | badge appears, no particles |
| Secret relic sequence | 240 ms cross-fade, static black-gold frame |

Flashing is capped below 3 Hz everywhere; "Reduce flashing" forces the same
static path regardless of the Motion setting.

---

## 16. Animation timing tables

### 16.1 Locked card loop

| Phase | Start | Duration | Easing | Property |
|-------|-------|----------|--------|----------|
| Mist swirl | 0 | 3000 loop | linear | rotate 0→360° |
| Shadow flicker | 200 | 1200 loop | standard | opacity .5↔.8 |
| Question pulse | 0 | 2400 loop | standard | scale 1→1.06→1 |
| Sparkle escape | 800 | 4000 loop | standard | translateY 0→-18, fade |
| Secret glimpse | 3000 | 600 every 6 s | standard | silhouette opacity 0→.25→0 |

Secret relics swap the mist for slow rune drift and a 1 px shimmer, same timings.

### 16.2 Unlock sequence (shared skeleton)

| Phase | Duration | Easing | Notes |
|-------|----------|--------|-------|
| Shake | 120 ms | standard | ±2° rotation, 3 cycles |
| Cracks | 180 ms | standard | stroke reveal, 4 shards |
| Flash | 90 ms | linear | white at 70%, one flash only |
| Item reveal | 260 ms | overshoot | scale .8→1, opacity 0→1 |
| Rarity flourish | 500–1100 ms | standard | see 16.3 |
| Badge settle | 160 ms | overshoot | NEW badge pops |

Total: 1.15 s (Common) to 1.75 s (Secret). Skip on tap applies the end state.

### 16.3 Rarity flourish

| Rarity | Duration | Motion |
|--------|----------|--------|
| Common | 500 ms | 6 leaf particles, 24 px rise |
| Uncommon | 600 ms | 8 bubbles, 1.2 s swirl |
| Rare | 700 ms | 10 elemental sparks, radial burst |
| Epic | 800 ms | 6 crystal shards, 30° fan |
| Legendary | 900 ms | 3 gold rays, translateY -40 px |
| Mythic | 1100 ms | 7 stars connect, 120 ms stagger |
| Secret | 1400 ms | portal iris 0→1, gold glyphs 4, 60 ms stagger |

### 16.4 Upgrade ready loop

| Phase | Start | Duration | Easing |
|-------|-------|----------|--------|
| Border glow | 0 | 2800 loop | standard |
| Arrow float | 0 | 2800 loop | standard (translateY ±3 px) |
| Sparkle | 600 | 2800 loop | linear |

Only one upgrade-ready card pulses at a time in a grid; the rest show the static
badge, chosen by first visible.

### 16.5 Upgrade craft sequence

| Phase | Duration | Delay | Easing |
|-------|----------|-------|--------|
| Magic circle | 200 ms | 0 | standard |
| Materials fly in | 300 ms | 120 | standard, 60 ms stagger |
| Item floats | 320 ms | 300 | standard (translateY -12) |
| Crystal cocoon | 380 ms | 420 | overshoot |
| Flash | 90 ms | 780 | linear |
| New item appears | 300 ms | 840 | overshoot |
| Progress bar | spans whole | 0 | linear |

Total ≈ 1.15 s plus 0.15 s per tier above the first.

### 16.6 Max-level sequence

| Phase | Duration | Delay |
|-------|----------|-------|
| Petals spiral | 600 ms | 0 |
| Crown forms | 400 ms | 200 |
| Burst | 200 ms | 600 |
| Gem orbit (loop) | 4000 ms | 800 |
| Permanent aura | — | 800 |

Aura is static under reduced motion; orbit pauses off-screen.

### 16.7 Fusion sequence

| Phase | Duration | Delay | Easing |
|-------|----------|-------|--------|
| Cards slide together | 260 ms | 0 | standard |
| Chamber forms | 300 ms | 200 | overshoot |
| Energy combine | 400 ms | 460 | linear |
| Flash | 90 ms | 820 | linear |
| New item emerges | 360 ms | 880 | overshoot |
| Background shift | 240 ms | 1000 | standard |

Total ≈ 1.25 s. Fusion is destructive, so the result stays on screen until
acknowledged.

### 16.8 Collection completion

| Phase | Duration | Delay |
|-------|----------|-------|
| Book opens | 300 ms | 0 |
| Missing slot lights | 200 ms | 240 |
| Set aura | 400 ms | 400 |
| Celebration particles | 800 ms | 500 |
| Badge appears | 240 ms | 900 |

Celebration fires once per set; revisiting the collection shows only the badge.

### 16.9 Secret Relic upgrade

| Phase | Duration | Delay | Notes |
|-------|----------|-------|-------|
| Reality fractures | 500 ms | 0 | 3 cracks, no flash |
| Screen darkens | 300 ms | 400 | to 60% |
| Glyphs appear | 500 ms | 650 | 4 glyphs, 80 ms stagger |
| Item levitates | 400 ms | 1100 | translateY -20 |
| Creation energy | 600 ms | 1400 | radial glow |
| Reveal | 500 ms | 1900 | cross-fade |
| Permanent aura | — | 2200 | static |

Total 2.4 s, the only sequence allowed past 2 s. Skips straight to reveal on tap.

---

## 17. Furniture audio spec

All sounds are synthesized with the existing primitives (`tone`, `bell`,
`noise`, `glide`, `sparkle`), so no audio files are added. Levels are absolute
gains at master volume; every sound emits a caption through `Captions.sound`
and respects the Sound toggle. Wire these through one `Sfx.furniture(kind)`
entry point with a generation guard, so a dismissed card cannot leave a tail.

| State | Sound | Recipe | Length | Level | Caption |
|-------|-------|--------|--------|-------|---------|
| Locked tap | mystery hum | `pad(130, .6, .012)` + `noise(0, .3, .006, 700, .8)` | 0.6 s | low | "locked furniture hums" |
| Unlock — Common | soft leaf | `bell(1046, .3, .02)` + `sparkle(0, 3, 1568, .01)` | 0.6 s | low | "common furniture discovered" |
| Unlock — Uncommon | two-note | `bell(880)`, `bell(1174, delay .1)` | 0.7 s | low | "uncommon furniture discovered" |
| Unlock — Rare | elemental burst | `noise(0, .35, .01, 1800, 1.2)` + `glide(440, 1320, .3)` | 0.8 s | mid | "rare furniture discovered" |
| Unlock — Epic | prism chime | 3 bells 1318/1568/1976, 50 ms apart | 0.8 s | mid | "epic furniture discovered" |
| Unlock — Legendary | crown beam | `glide(523, 1046, .5)` + chord 784/988/1174 + `thump(90)` | 1.0 s | mid | "legendary furniture discovered" |
| Unlock — Mythic | constellation | 6 sparkles 1568→2637, 70 ms apart | 1.2 s | mid | "mythic furniture discovered" |
| Unlock — Secret | portal | `noise` swell 0.8 + `glide(80, 520, .7)` + `thump(60, 1)` | 1.6 s | high | "secret relic discovered" |
| Upgrade ready | soft ping | `bell(1568, .2, .012)` | 0.2 s | low | "upgrade ready" |
| Upgrade craft | craft ticks | 4 short `tone(1200, .04, 'square', .008)`, 120 ms apart, then `bell(1046)` | 1.2 s | low | "upgrading furniture" |
| Max level | short fanfare | 523/659/784/1046, 90 ms apart + `bell(1568)` | 0.8 s | mid | "max level furniture" |
| Fusion | combine | `glide(392, 784, .3)` + `noise(0, .4, .012, 2200)` + `thump(70)` | 1.3 s | mid | "furniture fused" |
| Collection complete | chime run | 5 tones 659→1568, 80 ms apart + `sparkle` | 1.0 s | mid | "collection complete" |
| Secret upgrade | cinematic | `thump(55, 1.4)` + `noise` 0.9 + `glide(65, 523, 1.2)` + chord at 1.8 s | 2.4 s | high | "secret relic transformed" |

Mix rules:
- **Throttle duplicates.** The same state sound cannot retrigger within 400 ms,
  and "upgrade ready" pings at most once per 8 s globally, so a grid of cards
  never turns into a slot machine.
- **One cinematic at a time.** Starting a new unlock or fusion releases the
  previous tail with a 0.12 s fade, the same pattern the summon cues use.
- **Duck, don't stack.** While a cinematic is playing, ambient home and weather
  beds drop 6 dB rather than stopping.
- **Silent when hidden.** No sound when the tab is backgrounded or the inventory
  is closed.
- **Captions always.** Every entry above is spoken through `Captions.sound`,
  and the caption is the source of truth for players who mute audio.

## 18. Furniture audio timing sheet

Times are milliseconds from the triggering tap. `attack` is the audible onset,
`body` the sustained or sequenced middle, `tail` the release before silence.
All cues are mono-compatible and end below -60 dBFS so nothing smears into the
next action.

| Cue | Trigger | Attack | Body | Tail | Total | Loop | Ducks ambience |
|-----|---------|--------|------|------|-------|------|----------------|
| Locked tap | tap on locked card | 0 | 220 | 380 | 600 | no | no |
| Locked ambience | inventory open, ≥1 locked card | 400 | 2400 | 600 | 3400 | yes | no |
| Unknown hover | focus locked card | 0 | 120 | 180 | 300 | no | no |
| Unlock crack | unlock phase 1 | 0 | 120 | 40 | 160 | no | −3 dB |
| Unlock swell | unlock phase 2 | 0 | 180 | 60 | 240 | no | −3 dB |
| Common unlock | reveal, then bell | 0 | 260 | 340 | 600 | no | −3 dB |
| Uncommon unlock | reveal, two bells | 0 | 400 | 300 | 700 | no | −3 dB |
| Rare unlock | burst then impact | 0 | 450 | 350 | 800 | no | −6 dB |
| Epic unlock | prism cluster | 0 | 500 | 300 | 800 | no | −6 dB |
| Legendary unlock | swell, chord, thump | 0 | 700 | 300 | 1000 | no | −6 dB |
| Mythic unlock | star run | 0 | 800 | 400 | 1200 | no | −6 dB |
| Secret unlock | swell, sub, chord | 0 | 1200 | 400 | 1600 | no | −9 dB |
| Favorite on | heart toggle | 0 | 120 | 120 | 240 | no | no |
| Favorite loop | favourited card on screen | 300 | 1600 | 400 | 2300 | yes | no |
| Placed pop | placement commit | 0 | 120 | 160 | 280 | no | no |
| Puffle chirps | placed, Puffle reacts | 120 | 280 | 200 | 600 | no | no |
| Upgrade ready | first visible ready card | 0 | 120 | 80 | 200 | every 8 s | no |
| Material zip | per material, 60 ms stagger | 0 | 40 | 60 | 100 | no | no |
| Craft hum | craft loop | 0 | 1000 | 200 | 1200 | yes (craft) | −3 dB |
| Craft release | craft finish | 0 | 260 | 340 | 600 | no | −6 dB |
| Max level | crown + brass | 0 | 500 | 300 | 800 | no | −6 dB |
| Fusion start | chamber forms | 0 | 300 | 120 | 420 | no | −6 dB |
| Fusion combine | energy merge | 0 | 300 | 100 | 400 | no | −6 dB |
| Fusion complete | emerge | 0 | 600 | 400 | 1000 | no | −9 dB |
| Collection complete | last item of set | 0 | 700 | 300 | 1000 | no | −6 dB |
| Premium inspect | open premium card | 0 | 300 | 180 | 480 | no | no |
| Event ambience | event home open | 500 | 3000 | 800 | 4300 | yes | no |
| Material leaf | inspect leaf item | 0 | 140 | 160 | 300 | no | no |
| Material moss | inspect moss item | 0 | 120 | 180 | 300 | no | no |
| Material flower | inspect flower item | 0 | 100 | 120 | 220 | no | no |
| Material crystal | inspect crystal item | 0 | 220 | 280 | 500 | no | no |
| Material rainbow | inspect rainbow item | 0 | 260 | 240 | 500 | no | no |
| Material galaxy | inspect galaxy item | 0 | 400 | 300 | 700 | no | no |
| Relic ambience | secret relic home | 600 | 3600 | 800 | 5000 | yes | no |

**Layering example — Legendary unlock (1.0 s)**

```
0 ms     crack: crystal tick ×3 (60 ms apart)
60 ms    swell: rising noise 0→0.5 over 300 ms
360 ms   choir pad: 784/988/1174, 400 ms
400 ms   crown beam: glide 523→1046, 500 ms
760 ms   thump: 90 Hz, 120 ms
900 ms   badge pop: 160 ms closing off the cue
```

**Loop discipline**: loops cross-fade over 300 ms, never restart on re-render,
and are cancelled within 120 ms of the card leaving the viewport or the sheet
closing. The craft hum runs only while the progress bar is visible.

---

## 19. Volume and mixing rules

### 19.1 Bus budget

| Bus | Target | Peak ceiling | Notes |
|-----|--------|--------------|-------|
| Master out | — | −1 dBTP | single limiter, no clipping |
| Music | −12 LUFS | −6 dBFS | ducked, never muted by UI |
| Ambience | −22 LUFS | −12 dBFS | homes, weather, events |
| UI / furniture | −18 LUFS short-term | −12 dBFS | all cues in §17–18 |
| Cinematics | −14 LUFS | −6 dBFS | unlock, fusion, relic |
| Dialogue / captions | — | — | captions carry meaning, not levels |

Per-cue gains live in a table next to `Sfx.furniture`, expressed as linear gain
at master 1.0, so changing the mix never means re-synthesizing sounds.

### 19.2 Ducking

| Trigger | Music | Ambience | Attack | Release |
|---------|-------|----------|--------|---------|
| Common/Uncommon unlock | 0 dB | −3 dB | 80 ms | 300 ms |
| Rare/Epic unlock | −2 dB | −6 dB | 80 ms | 400 ms |
| Legendary/Mythic | −3 dB | −6 dB | 60 ms | 500 ms |
| Secret / fusion / max level | −4 dB | −9 dB | 60 ms | 700 ms |
| Craft loop | −2 dB | −3 dB | 120 ms | 300 ms |

Ducking is a gain ramp, never a hard mute, and always releases even if the cue
is interrupted.

### 19.3 Voice management

- **Polyphony cap: 8.** Priority order: cinematic > unlock > placement >
  favourite/UI > ambience. When the cap is hit, steal the quietest non-looping
  voice, then the oldest.
- **One cinematic at a time.** A new unlock, fusion or relic sequence releases
  the previous tail with a 120 ms fade — the same guard the summon cues use.
- **Throttles.** Same cue cannot retrigger within 400 ms. "Upgrade ready" pings
  at most once per 8 s globally, regardless of visible cards.
- **State, not spam.** Locked ambience plays once while any locked card is
  visible; it does not restart per card.

### 19.4 Content and device rules

- **Mono-safe.** No cue relies on stereo position for meaning; fold-down must
  not cancel the body.
- **No audio-only information.** Every sound is paired with a caption and a
  visible badge, so muting loses nothing.
- **Toggle behaviour.** Furniture audio follows the existing Sound toggle
  only; the separate duel-sound preference must not mute the house.
- **Hidden tab = silence.** Suspend the audio context and stop loops when the
  page is not visible; resume on return without replaying queued cues.
- **Reduce motion does not mean mute**, and vice versa — the two preferences
  are independent.
- **Headroom for events.** Leave 3 dB above the bus budget so limited-time
  event beds can be layered in without a remix.

---

## 20. SFX generation prompts

The running game synthesizes these cues, so the prompts are for producing
sample versions if the project later ships audio files. Each assumes mono,
48 kHz/24-bit, delivered trimmed to the stated length with a 5 ms fade-in and
25 ms fade-out, normalized to the bus target in §19.1.

**Shared style string (append to every prompt)**

```
cozy fantasy mobile game SFX, warm acoustic instruments, soft transients,
clean tail, no distortion, no clipping, mono, 48 kHz, no reverb longer than
the stated tail, family-friendly
```

**Shared negative prompt**

```
harsh EDM, dubstep, airhorn, speech, vocals, sirens, distorted guitar,
lo-fi hiss, long cinematic reverb, stereo panning, clipping
```

| Cue | Prompt |
|-----|--------|
| Locked tap | `soft wooden knock then tiny glass shimmer, 0.6 s, muffled, mysterious, close-mic` |
| Locked ambience | `faint magical whispers over a low crystal hum, 3.4 s seamless loop, airy, unsettling but gentle` |
| Unknown hover | `single glass bell, slight upward pitch bend, question-like, 0.3 s` |
| Common unlock | `small nature bell ding with one leaf rustle, 0.6 s, simple reward` |
| Uncommon unlock | `two crystal chimes a step apart with a tiny water drop, 0.7 s` |
| Rare unlock | `elemental whoosh into a bright crystal impact, 0.8 s, energetic but warm` |
| Epic unlock | `layered prism bells resonating, harmonic shimmer, 0.8 s, magical echo under 200 ms` |
| Legendary unlock | `rising golden swell into a three-note choir chord and soft brass hit, 1.0 s, heroic` |
| Mythic unlock | `deep cosmic boom then six rising star chimes, constellation sparkle, 1.2 s` |
| Secret unlock | `reality crack, brief cosmic silence, then a divine chime and deep sub swell, 1.6 s, awe` |
| Favorite on | `single heart sparkle plink, 0.24 s, affectionate` |
| Placed pop | `soft furniture settle pop with a cushion thud, 0.28 s` |
| Puffle chirps | `two tiny friendly creature chirps, 0.6 s, cute, non-verbal` |
| Upgrade ready | `gentle golden bell ting, 0.2 s, calm attention cue` |
| Upgrade craft | `magic circle hum with four quick material zips, 1.2 s, building energy` |
| Max level | `short royal brass hit with golden sparkle tail, 0.8 s, triumphant` |
| Fusion | `reactor hum into a crystal boom-shimmer, 1.0 s, powerful magic` |
| Collection complete | `five-note achievement fanfare with sparkles, 1.0 s, celebratory` |
| Premium inspect | `three luxury crystal notes, 0.48 s, refined` |
| Halloween event | `cute ghost giggle over soft theremin, 4 s loop, playful not scary` |
| Winter event | `sleigh bells and soft choir pad, 4 s loop, cozy` |
| Galaxy event | `twinkling star arpeggio over low space drone, 4 s loop` |
| Dragon event | `friendly low dragon call with warm rumble, 4 s loop, not aggressive` |
| Leaf material | `dry leaf rustle, 0.3 s, close` |
| Moss material | `soft mossy puff, 0.3 s, muted` |
| Flower material | `tiny blossom pop with petal flutter, 0.22 s` |
| Crystal material | `resonating gemstone ting with short tail, 0.5 s` |
| Rainbow material | `prismatic sweep upward, airy, 0.5 s` |
| Galaxy material | `orbital hum with stellar wind, 0.7 s` |
| Relic ambience | `universe breathing, soft reality hum, distant creation choir, 5 s seamless loop` |

**Naming and delivery**

```
sfx_furni_<state>_<variant>.wav     e.g. sfx_furni_unlock_legendary.wav
loops use _loop and must have matching start/end sample values
```

Deliver a `cues.json` alongside the files mapping cue id → file, bus, gain, and
loop points, so the mixer table in §19 stays the single source of truth.

## 21. Species homes: re-skin vs new buildings

**Decision (recorded 10 November 2026): re-skin the existing rooms.**
Species homes are a theme layer, tier ladder and interaction module applied to
the room each sprite already owns. Standalone buildings are rejected for this
milestone.

- **Status:** accepted.
- **Why:** it keeps every save, decor arrangement, tint, hangout and visit
  working, and the Leaf Puffle slice already shipped this way without migration.
- **Consequences:** no `state.buildings`, no second decor coordinate system;
  species content is additive data, and `state.homes`, `state.roomLayout`,
  `state.houseTints` and `state.homeUpgrades` stay authoritative.
- **Revisit only if:** exterior buildings become a hard requirement and the
  facade layer in 21.5 cannot satisfy it. Any such change needs a migration plan
  before it touches saves.

Two viable architectures for the eleven-species home programme. Both can deliver
the brief's tiers and taps; they differ in what they disturb.

### 21.1 What exists today

- `state.homes[spriteId]` assigns each sprite a **biome scene** (18 options); the
  Homes screen renders it as a window per sprite.
- `state.houses[houseId]` groups 2–3 sprites with bond, hangouts and tint.
- `state.roomLayout[pieceId]` and `state.homeUpgrades` are **global**: decor is
  placed once and appears in every room, card, hangout stage and visit.
- `HOME_ROOM_THEMES` / `homeRoomThemeStyle()` already provide a room-wide
  visual layer (wall, floor, glow) that every surface consumes.
- The Leaf Puffle slice proved the additive path: three tiers and two cooldown
  taps in ~120 lines, with `state.leafHomes` as a new sibling key and no
  migration.

### 21.2 Option A — re-skin the existing rooms

Species home = a **theme layer + tier ladder + interaction module** applied to
the room a sprite already owns.

```
state.homes[spriteId]        unchanged (biome scene)
homeRoomThemeStyle()    ──►  species theme (wall, floor, light, facade icon)
state.speciesHomes[spriteId]  { tier, lastTapA, lastTapB }
Homes card                   existing window art + species badge
Decor / tint / visitors      unchanged, shared globally
```

- **Saves:** no migration. Unknown keys default to the neutral theme, exactly
  like `leafHomes` does today.
- **Decor:** every piece, spot and hide flag keeps working, because placement
  stays global and the room still renders it.
- **Content cost per species:** one theme entry, one tier table, one interaction
  table. No new render surface.
- **Fidelity:** themed interiors and a facade badge, not a literal exterior
  building. The brief's "Leaf Puffle home" reads as a room that is unmistakably
  that Puffle's, rather than a separate structure on a map.
- **Risk:** low. Worst case a new species theme looks wrong; nothing else moves.

### 21.3 Option B — new buildings

Species home = its own entity with its own art, placement grid and screen.

```
state.buildings[id]  { species, tier, decor: [{ x, y, rot }], visitors }
new render surface, new entry point, new decor coordinates
```

- **Saves:** every existing sprite needs a building created on load, or a
  fallback path; `state.roomLayout` and `homeUpgrades` no longer describe what
  the player sees, so two decor systems coexist.
- **Decor:** needs a second placement model (x/y/rotation), which duplicates
  the spot Left/Centre/Right logic, the tint and Stage slider, and the "tap the
  room to decorate" affordances.
- **Surfaces to duplicate:** Homes windows, Homes sheet, sent-home cards, shared
  house rooms, hangout stage, one-on-one visits, collection's home button.
- **Content cost per species:** building art (exterior + interior), placement
  bounds, lighting variants, plus the theme and tiers.
- **Fidelity:** highest. Literal exteriors, bigger canvases, room presets and
  drag placement from the inventory spec.
- **Risk:** high. A save-shape change touching the most-used screen, with two
  decor systems to keep in sync.

### 21.4 Comparison

| Dimension | Re-skin | New buildings |
|-----------|---------|---------------|
| Old saves load unchanged | Yes | Only with migration + fallback |
| Existing decor keeps working | Yes | No — second decor model |
| Render surfaces to build | 1 theme layer | 6+ duplicated |
| Content per species | Theme + tiers + taps | Those plus exterior/interior art |
| Brief fidelity | Themed interiors, facade badge | Literal buildings and grids |
| Time to first playable slice | Days | Weeks |
| Risk to current players | Low | High |
| Reversible | Yes, delete the theme | Hard once saves reference buildings |

### 21.5 Recommendation

**Re-skin the existing rooms.** It is the only option that preserves every
save, every decor arrangement and every surface the Hollow already renders, and
it is already proven by the Leaf Puffle slice.

Sequence:

1. Generalise the leaf slice into `speciesHomes` with a shared tier/tap schema
   and keep `leafHomes` readable as a legacy fallback.
2. Add one theme per species to `HOME_ROOM_THEMES` (palette, floor, glow,
   facade icon) and a species badge on the Homes window.
3. Populate tier tables and two taps per species; reuse the cooldown helper.
4. Only then consider a **facade layer**: an optional exterior card drawn in the
   Homes neighbourhood that links to the same room data. That gives the brief's
   building silhouettes without a second decor system or a save migration.

Hard guardrails: `state.homes`, `state.roomLayout`, `state.houseTints` and
`state.homeUpgrades` stay authoritative; no new coordinate system; each species
is additive data, never a migration.

## 22. Open questions

1. Are species homes new buildings, or re-skins of today's shared houses?
2. Do decor items have one global inventory, or per-home storage?
3. Is Comfort a display score only, or does it gate gameplay?
4. Should fusion be reversible for a fee, or one-way?
5. Does the rating system use existing coins, or a new decoration currency?
