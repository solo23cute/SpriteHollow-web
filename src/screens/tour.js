/* First-run induction tour. Replayable from Studio. */

const TOUR_STEPS = [
  {
    key: 'hollow', icon: '🏡', kicker: 'YOUR HOLLOW',
    title: 'This is home base',
    text: 'This is your home base. Tap your active sprite to pet them, then use the care dock along the bottom to Feed, Play, Walk, Rub Belly, Throw Ball, Play Catch, Bathe, Nap, Bed, and Talk. Food, Rest, Joy, and Clean fade in real time, even while the app is closed.',
    points: [
      'A green “thriving here” message means the current habitat is boosting XP.',
      'When a need runs low, the sprite asks for the matching care action.',
    ],
    tip: 'Tap the sprite first. Petting is free, builds bond, and has a short cooldown.',
  },
  {
    key: 'care', icon: '🥾', kicker: 'CARE & TRAIL WALKS',
    title: 'Care first, then go wandering',
    text: 'Care is the daily loop: Feed, Play, Walk, Rub Belly, Throw Ball, Play Catch, Bathe, Nap, Bed, and Talk. Belly rubs build Joy and bond. Throw Ball and Play Catch open a five-catch fetch game that pays coins, XP, bond, and fills the Care Package meter. Bed opens the bedroom sheet for tuck-ins and the dream journal. Walk takes your active sprite outside to Jog, Run, and every route, while Activities has Slam Dunk and Goal Kick. Needs fade in real time, so check the four bars before a long activity.',
    points: [
      'Tap Walk, choose a trail, then tap glowing pawprints. Coins and gift tokens add extra steps; puddles trip you.',
      'Every walk, jog, or run pays coins and XP, restores Joy, and gives extra bond. Every third outing opens a Trail Gift with bonus coins and a snack.',
      'Hollow Stroll and Sunrise Jog are open immediately. Moonlit Stroll unlocks at 3 walks, Wind Sprint at 5, and Summit Scramble at 8.',
      'Slam Dunk and Goal Kick are in Activities: leap toward the rim and tap SLAM, or kick past the sliding keeper, and earn a guaranteed pantry food plus a sport gift every two games.',
      'Outings spend a little Food and Rest. Feed a snack and tuck in for a nap afterward; petting and talking are free.',
    ],
    tip: 'If a need is under 20, care for it before moving. Jog and Run are faster and pay more; both sports pay food and build toward gifts.',
  },
  {
    key: 'nest', icon: '🥚', kicker: 'THE NEST',
    title: 'Warm, hatch, and merge',
    text: 'Open the Nest to hatch, merge, or visit the Secret Vault. Tap an egg to warm it until the shell cracks, then hatch the baby into your collection. Type eggs always hatch one chosen species, while wild eggs roll a random element. The Vault button shows every unlocked secret and its possible children.',
    points: [
      'Merge two level 3 or higher sprites to blend elements, colours, patterns, and personality into a new egg.',
      'Merging costs 70 coins plus 25 per parent generation, and both parents rest for 60 seconds.',
      'Retired sprites are valid parents, and any two types can merge. Open the Vault to see combinations and preview a child with any species.',
    ],
    tip: 'Start with a 45-coin Wild Egg, or save for a type egg when you want an exact species.',
  },
  {
    key: 'growth', icon: '💛', kicker: 'SPRITES & GROWTH',
    title: 'Raise them to level 1,000',
    text: `Everything you do together grants XP. Feeding, games, chats, baths, naps, trails, and petting all count, and matching the habitat multiplies the gain. Sprites grow through the ${STAGE_ORDER.length} age tiers from Baby at level 1 to Sensei at level 1,000.`,
    points: [
      'Feeding builds the Hearty, Sweet, Eerie, and Wild diet affinities. World Kitchen dishes also build their region’s cuisine.',
      'Open a sprite to see a NEXT EVOLUTION card with its next stage, required level, XP left, and progress.',
      `At level 10, twelve points in one diet path or one World Kitchen cuisine unlocks one of ${EVOLUTION_FORM_KEYS.length} permanent forms, including all ${CP_PUFFLE_TYPE_COUNT} classic Club Penguin puffle colours and ${CP_PUFFLE_CREATURE_COUNT} Puffle Creatures.`,
      'The Bond Codex lists all six bond ranks, their passive bonuses, every stage, every diet evolution, and every World Kitchen form.',
      'The Gender Codex explains the ♀ / ♂ / ⚲ roll, and the Breeder Codex lists every named hybrid and parent type.',
      'Retirement unlocks at Elderly level 100. A Rebirth Meal at level 1,000 returns them to an egg with permanent rebirth bonuses.',
    ],
    tip: 'Retired sprites still count for Vault progress and can merge. A Rebirth Meal starts their next life with permanent bonuses.',
  },
  {
    key: 'collection', icon: '📚', kicker: 'COLLECTION & FOOD',
    title: 'Every species and every snack',
    text: 'Collection holds every species you have met, and Types is the full encyclopedia with type eggs, rarity, genes, and Titans. Food and Snacks lists the market, pantry, snacks, and every diet effect.',
    points: [
      'Buy food in the market, then feed it from the pantry to raise needs and build a diet path.',
      'The World Kitchen, Anime Kitchen, and Trainer pantry are all searchable guides.',
      'Ten candy items add Sugar. At three Sugar, the sprite transforms into a candy species.',
      `A ${DISNEY_TOTAL}-character Disney collection spans Mickey, classics, princesses, Pixar, villains, and modern favorites in the Wiki.`,
      `A ${CARE_BEAR_TOTAL}-character Care Bears & Cousins collection adds the classic bears, Cousins, and 15 extended-family favourites. Activate one and every 3 games, trails, or sports wraps a Care Package of coins, XP, pantry food, and a snack.`,
      `A ${FORTNITE_LEGACY_TOTAL}-sprite Fortnite Legacy roster adds multiple headliners from every past season, Chapter 1 through Chapter 5. A ${WWE_TOTAL}-superstar WWE locker room now spans the Golden, Attitude, Ruthless Aggression, PG, Women’s, Tag Team, and NXT eras.`,
      `A ${LEGEND_TOTAL}-character crossover legends pack adds curated families from FNAF, Mario, Spore, Tom and Jerry, Looney Tunes, Zelda, The Walking Dead, horror, and video games.`,
      `A ${NETFLIX_TOTAL}-character Netflix animation wing now sits under TV Legends: 10 Netflix Anime shows and 10 Netflix Toons shows with three characters each, show filters, and owned progress. A ${TV_FAMILY_TOTAL}-character TV family now spans both rosters.`,
      `A ${CATALOG_TOTAL}-sprite catalog adds PBS Kids, Monster Jam, Nickelodeon, Nick Jr., Nicktoons, Discovery, animated movies, comics, Disney Jr., Disney XD, and every video-game genre.`,
      `The Types Codex shows the full ${RARITY_TIER_ORDER.length}-tier ladder: ${RARITY_TIER_ORDER.length - RARITY_APEX_KEYS.length} base ranks plus the ${RARITY_APEX_PHRASE} apex ranks.`,
      'Open the Bond Codex from Types or the Wiki to read all six bond ranks and the complete evolution path.',
      'Eighteen world type variants and the Shortcut pathfinder are in the Wiki, each with a live species file.',
    ],
    tip: 'Use the search on Types to find a species, then open its card for its egg, habitat, and hybrids.',
  },
  {
    key: 'dock', icon: '🤲', kicker: 'CARE-DOCK GAMES',
    title: 'Rub, throw, and play catch',
    text: 'The care dock now has three more ways to connect. Rub Belly raises Joy and bond with a short cooldown. Throw Ball and Play Catch open a five-catch fetch game: tap the moving ball, watch the catch meter fill, and finish for coins, XP, bond, and credit toward games and Care Packages. Walk is still the trail button, and Play still opens the full Activities hub.',
    points: [
      'Rub Belly is free and has a short cooldown; it is perfect when Joy is low.',
      'Throw Ball and Play Catch both count as games for daily, weekly, and monthly tasks.',
      'The fetch game uses the active sprite, so a pony’s task and check-in bonuses stay active afterward.',
    ],
    tip: 'If the ball feels too fast, watch the yellow glow and tap anywhere on the ball. Every catch pauses it for a moment.',
  },
  {
    key: 'newcollections', icon: '🦄', kicker: 'NEW COLLECTIONS',
    title: 'Ponies, TV, medicine, four realms, and Keyblades',
    text: `Five new collections live in the Nest. There are ${PONY_TOTAL} My Little Pony friends, ${TV_LEGACY_TOTAL} TV Legends, ${MEDICAL_TOTAL} medical-TV signatures, ${REALM_TOTAL} horror/light/darkness sprites, and ${KH_TOTAL} Kingdom Hearts characters. The widening wave adds 50 background ponies, 10 royal leaders, 15 extended Care Bears, full-show TV casts, and the Disney worlds of Kingdom Hearts. Every one has a gene, Titan, type egg, habitat, named hybrid, Wiki file, and original procedural art.`,
    points: [
      'Ponies add bonus coins to check-ins and completed tasks while active. Background ponies, royal leaders, and the expanded Care family all use the same care systems.',
      'TV Legends now build full-show casts across prestige drama, sitcoms, sci-fi, fantasy, and animated shows, each with a show label.',
      `The medical wing adds ${GREYS_TOTAL} Grey’s Anatomy characters from all 23 seasons and ${SCRUBS_TOTAL} Scrubs characters from all nine seasons. The Medical TV roster tab filters by show and shows each character’s season range.`,
      'Netflix Anime and Netflix Toons each have their own roster tab, a filter for all 10 shows, and owned counts for the wing and every show.',
      'Horror, Dark Horror, Light, and Darkness each have their own eight-sprite family and realm aura.',
      'Kingdom Hearts covers Destiny Islands, all of Organization XIII, the Wayfinders, Seekers, Keyblade legacy, and 50 Disney-world characters.',
    ],
    tip: 'Open the Wiki Roster browser to filter ponies by family, TV by show, and Keyblade characters by world. Every card opens its species file.',
  },
  {
    key: 'forms', icon: '✨', kicker: 'FORMS, COSTUMES & VARIANTS',
    title: 'Every form has a home',
    text: `The roster now has ${BASE_ROSTER_KEYS.length} Base forms, ${TRICK_OR_TREAT_KEYS.length} Trick-or-Treat costumes, and ${VARIANT_KEYS.length.toLocaleString()} variant-tier sprites, including ${variantFamilyKeys('hacker').length} Hacker forms. Every one is a real type egg with its own gene, Titan, homes, and a place in the Wiki.`,
    points: [
      'Filter ◻️ Base in Types to see the original, unshined forms of the Fortune favorites.',
      'Trick-or-Treat costumes are Halloween species with a 🎃 gene and a permanent +10% XP bonus.',
      `Hacker forms glow with neon visors and circuit traces; ${SECRET_VARIANT_BASE_KEYS.length.toLocaleString()} Secret variants add a hidden form for every normal sprite.`,
      'The Gender Codex covers every family: each egg rolls its own ♀, ♂, or ⚲ gender before it hatches.',
      'The Breeder Codex and both atlases read the same live roster, so Base, costume, and variant parents are never left out.',
    ],
    tip: 'Search Types for Base, Trick or Treat, Hacker, or Secret, or open the Forms & variants guide in the Wiki.',
  },
  {
    key: 'biomes', icon: '🧭', kicker: 'TYPE BIOMES',
    title: 'Eighteen homes for eighteen types',
    text: 'Every one of the eighteen standard types has a dedicated biome with its own sky, ground, weather, and guardian. Studio now separates Core habitats, Type biomes, and Custom biomes so all 18 are visible and selectable. Matching species earn 50% more XP there, and visitors still get a small bonus.',
    points: [
      'Open Studio, then use the Type biomes group or the Biome Atlas button.',
      'The Biome Atlas shows all 18 guardians, species counts, and visited progress.',
      'The Biome Studio builds unlimited custom habitats with your own colours, emoji, and XP bonus.',
      'Custom biomes welcome every grown sprite with no resident cap.',
    ],
    tip: 'Switching habitats and climates is free. Try a new home whenever you like.',
  },
  {
    key: 'districts', icon: '🗺️', kicker: 'DISTRICT QUESTS & GUARDIANS',
    title: 'Short quests, quick guardian bouts',
    text: `Every GTA district and exotic biome has a three-step story line, and every step now takes one action. Travel is free, win one game, look after a sprite once, then face the guardian. The finale is a free 40-second duel: each Strike is powered by your sprite's Attack and Magic against the guardian's own stats, so most guardians yield in about four hits.`,
    points: [
      `${BIOME_QUEST_KEYS.length} district lines are live. Each one pays coins, XP, and bond on every step, with a 150-coin guardian bonus at the end.`,
      'The district sheet and Biome Atlas show the exact step, a one-action progress bar, and a direct Travel button.',
      'Every guardian win and every completed district adds 1 Season Charge. At 3 charges a random event or Admin egg is added automatically, already 40% warmed.',
      'Open the Guardian gallery from the district sheet to challenge any environment for free. Practice wins also add Season Charge, with unlimited retries.',
    ],
    tip: 'Open Today → District quests, or the quest card in the Biome Atlas. The guardian finale is free, so a timeout only means another round.',
  },
  {
    key: 'games', icon: '🎮', kicker: 'CLASSIC GAMES',
    title: 'Every game on the Play shelf',
    text: 'Play holds the whole game shelf: Hollow classics, Arcade challenges, trail activities, sports and pet games. Four classics are open from the start; Jog is open immediately, and the faster routes unlock as you walk. Every completed game pays coins and XP to your active sprite, plus joy and bond. Trails and sports can pay pantry food.',
    points: [
      'Classics: Treat Catch, Pulse Match, Sprite Says, Coin Dig and the rest of the shelf. Nectar Pop opens at four check-ins, Green Toss at six, Moon Match at twelve, Candy Crunch at fourteen and Holiday Lights at twenty.',
      'More classics: Star Lane, Portal Pairs, Word Sprout, Glimmer Grid and Ice Fishing use the same Play card.',
      'Trails: Hollow Stroll and Sunrise Jog from the start, then Moonlit Stroll, Wind Sprint, Summit Scramble and six more routes as you walk.',
      'Sports: Slam Dunk, Goal Kick, Tennis Rally, bowling, home run derby, volleyball, field goal, hockey, golf, cricket, ping-pong and archery.',
      'Pet games: Pet Spa Day, Flappy Pet, Egg Hunt, Nest Defense, Egg Decorator, Dragon Nest and the rest of the pet shelf.',
      'Every game pays coins, XP, joy and bond; trails and sports can add pantry food, and Arcade coins fill bonus gifts.',
    ],
    tip: 'Games pay more when the active sprite is rare. Star a favourite game to keep it at the top, use the ⛶ button for fullscreen, and every third trail opens a Trail Gift.',
  },
  {
    key: 'arcade', icon: '🏟️', kicker: 'ARCADE CHALLENGES',
    title: 'Arcade challenges with a bonus track',
    text: 'Arcade is its own shelf of always-open challenges. Their coins fill bonus gifts and the monthly prize track as well as your normal wallet.',
    points: [
      'Rune Slide: match the order strip and tap a rune beside the empty slot to slide it. Finish three boards in two minutes; green runes are already in place.',
      'Zombie Siege and Zombie Barrage: tap zombies before they reach the lantern, with three hearts and thirty seconds.',
      'Hollow Duel: press Strike when the marker is in the green centre for a perfect hit, and press Guard before the brute attacks.',
      'Rhythm and maze: Hollow Beat, Lantern Maze, Moon Tower and Hollow Grand Prix each keep their own score and gift track.',
      'Arcade originals: Pet Adventure, Paper.io Territory, Galaxia Starfighter, Cookie Run Classic, Dancing Road Color, Run Sausage Run! and Cart Surfer.',
      'Kitchen challenges: Hollow Kitchen, Smoothie Smash, Neon Beatway and Egg Arcade round out the shelf.',
    ],
    tip: 'Every 5,000 Arcade coins fills a bonus gift. Every third gift and the higher month tiers include a Starpath Feast that advances one growth stage.',
  },
  {
    key: 'today', icon: '📅', kicker: 'TODAY & WEATHER',
    title: 'Check in, quest, and collect',
    text: 'Today runs the Hollow calendar. Check in during the morning, afternoon, evening, and night windows for coins, snacks, and streak progress. Quests and goals pay extra for things you already do.',
    points: [
      'District quests now need one game and one care action; guardian finales are quick 40-second bouts, and every guardian win or completed district adds a Season Charge toward a free event or Admin egg.',
      'Every other day a type quiz appears at a random time, just for fun. The first Friday crate you open each month pays coins, stocks food, unlocks a new dish, and brings a free Secret Vault sprite of your choice.',
      'Fridays always give a free crate; later Friday crates that month still bring coins, snacks, and pantry food. Weekly and monthly tracks add bigger milestones and a yearly mythic reward.',
      'Weather follows the real date. Cold or wet weather drains needs faster, so use the wardrobe.',
    ],
    tip: 'The first check-in of the day keeps the daily streak alive and stocks a pantry food.',
  },
  {
    key: 'heroes', icon: '🦸', kicker: 'HEROES & VILLAINS',
    title: 'Sixty-one signatures from both multiverses',
    text: 'A sixty-one-character hero wave lives in the Nest: twenty-eight heroes, twenty-one villains, and twelve anti-heroes, split into thirty-two Marvel, twenty-two DC, and seven Beyond Marvel and DC characters. Deadpool and Gwenpool are in the Marvel set, and classic Spider-Man is listed alongside them.',
    points: [
      'Every signature has its own gene, Titan, type egg, habitat, and named hybrid.',
      'Open the Wiki and search Marvel or DC to filter the roster.',
      'The Heroes, villains and anti-heroes guide groups everyone by publisher, with role labels.',
    ],
    tip: 'Species articles show Publisher and Role in the infobox, plus a button back to the wave guide.',
  },
  {
    key: 'secrets', icon: '🔐', kicker: 'SECRETS & EXOTICS',
    title: 'Some doors are not in the Nest',
    text: `${SECRET_SPECIES.length} secret sprites are not sold in the Nest. Open the Vault from the Nest to see every unlocked keeper, its parent types, named hybrids, and a possible-child preview. Milestone doors, twelve monthly keepers, and eight twice-weekly relays are tracked there. Exotic guardians are different: they can hatch from their type eggs. A further ${SECRET_VARIANT_BASE_KEYS.length.toLocaleString()} Secret variants are purchasable type eggs; they do not need a Vault door.`,
    points: [
      'Finish this tour to earn the first secret, the Hollow Guide.',
      'Reach level 1,000, visit all eighteen biomes, reach 100 bond, hatch 25 eggs, and decode the Master name for the rest.',
      'Open the Vault during a monthly or Monday–Wednesday / Thursday–Sunday window, then claim the keeper before it rotates.',
      'Retired sprites still count for Vault progress and can be used as merge parents.',
      `Secret variants are a separate purchasable family (${SECRET_VARIANT_BASE_KEYS.length.toLocaleString()} forms), not additional Vault doors.`,
      'Collect 8 Fortnite Legacy species for the Season Keeper, or 6 WWE species for the Ring Keeper. Reach 16 Legacy or 12 WWE to earn the exotic Rift Champion or Grand Slam.',
      'The Elder Keeper unlocks when a sprite retires at Elderly level 100; this tour awards the Hollow Guide.',
      'The Master Cheat answers to the word MASTER once the tour is complete.',
    ],
    tip: 'The vault tracks every clue, so open it whenever a milestone feels close.',
  },
  {
    key: 'homeview', icon: '🏡', kicker: 'HOME VIEW & DECOR',
    title: 'Walk into your room and dress it in place',
    text: 'Home opens the room your active sprite lives in. Shared houses come first, and a solo sprite still gets a room of its own. The stage shows the scene, the room theme, every resident, and the furniture you own, with Home level and Comfort read from the live house.',
    points: [
      'Tap 🎨 Decor, then tap any piece to move it Left, Centre or Right, or hide it. Save up to eight 🗂️ layout presets and swap the whole arrangement back in one tap.',
      'A shared house can take a room tint from eight swatches or the colour wheel. Stage sets how strongly it reads, from 0 to 100, and applies to the room, hangouts and one-on-one visits.',
      'Tint and Stage belong to the house, not the sprite. A solo room waits until a second sprite moves in.',
      'The same room data drives Homes, visits and hangouts, so decorating here changes the room everywhere.',
    ],
    tip: 'Decor and tint are cosmetic and free. Open Wiki → Home View & Decor mode for the full walkthrough.',
  },
  {
    key: 'studio', icon: '🎨', kicker: 'STUDIO & PERSONALISER',
    title: 'Make the Hollow yours',
    text: 'Studio is where you paint a sprite and restyle the whole app. Pick any grown sprite, choose a body type, then shape its head, add a set of ears, and swap its eyes. Dye it with five colour fields or a preset, dress it in a named outfit, and finish with an accessory and pattern. Lower down, the personaliser changes the UI font and your own accent, second accent, backdrop, and panel colours.',
    points: [
      `Body: ${BREED_KEYS.length} breed silhouettes, ${HEAD_SHAPE_KEYS.length} head shapes, ${EAR_STYLE_KEYS.length} ear styles, and ${EYE_STYLE_KEYS.length} eye styles — all free and all saved per sprite.`,
      'Custom dye: set body, light, deep, accent, and belly separately, or tap a preset to fill all five from one hue. “Use natural colours” returns to the element palette.',
      'Clothes: the wardrobe makes unlimited named outfits in 14 styles, each with a main and trim colour. Wear, swap, edit, or delete any time.',
      `Personaliser: 6 font stacks and custom UI colours. They follow every screen, the loading screen, and bath bubbles.`,
      'Homes: tint each shared house from its decor panel and use the Stage slider to set how strong that colour reads on hangouts and one-on-one visits.',
      'Bathe any sprite to see real soap bubbles rise off them, and watch the loading screen pick up your theme colours.',
      'Custom biomes set their own colours, emoji, habitat label, and XP bonus, and the Wiki Make-it-yours guide lists every option.',
    ],
    tip: 'Everything in Studio is cosmetic and free. Custom colours and outfits never change XP, bond, rarity, or merge results.',
  },
  {
    key: 'ready', icon: '🏁', kicker: 'READY',
    title: 'That is the whole Hollow',
    text: 'That is the whole Hollow. Hatch a sprite, keep their needs happy, take them walking or to the sports court, rub a belly or play fetch, play the games, visit the Vault, check in daily, and fill the encyclopedia. The Wiki holds every rule and every species file if you forget a detail.',
    points: [
      'Start with the care dock in the Hollow, a Wild Egg in the Nest, or a trail walk from the Walk button.',
      'The induction tour can be replayed from Studio at any time.',
    ],
    tip: 'Finishing this step awards the first secret and opens the rest of the Secret Vault clues.',
  },
];

/* The tour reads the live game data, so new age tiers, biomes, and sprite waves
   appear here automatically with no hand-maintained counts. */
function tourLiveStep() {
  const tiers = STAGE_ORDER.map((stage) => `${STAGE_LABELS[stage]} ${STAGE_LEVEL[stage]}`).join(' · ');
  const waves = collectionWaves();
  return {
    key: 'live',
    icon: '🥋',
    kicker: 'EVOLUTION & CODEX',
    title: `${STAGE_ORDER.length} age tiers, ${ELEMENT_KEYS.length.toLocaleString()} sprites`,
    text: `Every sprite grows through ${tiers}. Crossing an age tier opens an evolution screen with the new stage, its bonus, and the full ladder, and the same screen appears when a diet path unlocks one of ${EVOLUTION_FORM_KEYS.length} permanent forms. The final tier is Sensei at level 1,000; retirement unlocks at Elderly level 100.`,
    points: [
      `${waves.length} collection waves are live, and the Codex, Wiki, and this tour rebuild their counts from the same data whenever new sprites are added.`,
      ...waves.slice(0, 7).map((wave) => `${wave.icon} ${wave.label} · ${wave.count()}`),
      `The Type encyclopedia lists all ${ELEMENT_KEYS.length.toLocaleString()} species, ${BIOME_KEYS.length} biomes, and every evolution path.`,
      'Weekends run an Admin Event: bonus XP, bonus coins, and one free Admin or special event egg.',
    ],
    tip: 'Open Codex → Type encyclopedia for the full list, or Wiki → Collection waves for live counts per wave.',
  };
}

(function syncTourGrowth() {
  const step = TOUR_STEPS.find((item) => item.kicker === 'SPRITES & GROWTH');
  if (!step) return;
  step.title = `Raise them to level ${MAX_LEVEL.toLocaleString()}`;
  step.text = step.text.replace(/Sprites grow through[^.]*\./, `Sprites grow through ${STAGE_ORDER.map((stage) => `${STAGE_LABELS[stage]} at level ${STAGE_LEVEL[stage]}`).join(', ')}.`);
})();

TOUR_STEPS.splice(Math.max(0, TOUR_STEPS.length - 1), 0, tourLiveStep());

/* Counts in the games card come from the same lists Play renders, so a new
   wave cannot leave the tour advertising a stale total. English only. */
(function syncTourGames() {
  const step = TOUR_STEPS.find((item) => item.kicker === 'CLASSIC GAMES');
  if (!step || typeof GAME_INFO === 'undefined') return;
  const has = (key) => !!GAME_INFO[key];
  const arcade = typeof ARCADE_GAME_KEYS !== 'undefined' ? ARCADE_GAME_KEYS.filter(has) : [];
  const trails = typeof WALK_GAME_KEYS !== 'undefined' ? WALK_GAME_KEYS.filter(has) : [];
  const sports = typeof SPORT_GAME_KEYS !== 'undefined' ? SPORT_GAME_KEYS.filter(has) : [];
  const pets = typeof PET_GAME_KEYS !== 'undefined' ? PET_GAME_KEYS.filter(has) : [];
  const classics = Object.keys(GAME_INFO).filter((key) => !arcade.includes(key) && !trails.includes(key) && !sports.includes(key) && !pets.includes(key));
  step.text = `Play holds ${classics.length} Hollow classics, ${arcade.length} Arcade challenges, ${trails.length} trail activities, ${sports.length} sports and ${pets.length} pet games. Most classics are open immediately, a few unlock with check-ins, and the faster routes unlock as you walk. Every completed game pays coins and XP to your active sprite, plus joy and bond. Trails and sports can pay pantry food.`;
})();

/* The newest systems get their own cards so a first-run or replayed tour
   actually explains paths, duels and the cue lab instead of stopping at the
   roster. Spliced before the closing step, like the growth card above. */
const TOUR_POWER_STEPS = [
  {
    key: 'paths', icon: '🌿', kicker: 'ABILITY PATHS',
    title: 'Three branches, one per element',
    text: 'Every element has a signature ability that branches three ways, and each branch evolves at level 40. Fire runs Fireball → Inferno Bomb, Scorch Mark → Wildfire, or Warmth Aura → Phoenix Blessing; Water heals, traps or surges; Electric chains, overcharges or shields. The first pick is free and a change costs 60 coins, so two Puffles of one species can be built differently.',
    points: [
      'Open a sprite and read the ABILITY PATH card: every branch shows its first form, its evolved form and the stats it adds.',
      'Legendary and above add a mastery, Secret Puffles mutate the ability, Celestial Puffles climb five Star Cores, and Creator Puffles pick one of three endgame paths.',
      'Branch mods feed the same numbers duels use, so a tank branch really does survive longer.',
    ],
    tip: 'Look at the level-40 line under the card: it tells you exactly what the branch becomes and how many levels are left.',
  },
  {
    key: 'status', icon: '☠️', kicker: 'STATUS EFFECTS IN DUELS',
    title: 'Burn, freeze, poison, shield, cleanse',
    text: 'Duels resolve a second layer on top of raw damage. Burn stacks tick for twice their count, poison ticks once per stack and fades, freeze costs the enemy a turn, shields soak a hit, regen restores resolve, reflect bounces damage and chain adds a flat bonus. Resistance can shrug a whole status off, and cleanse wipes your own burn, poison and freeze whenever you strike.',
    points: [
      'The duel picker lists each rival’s status effects, crit and dodge before you commit, so you can pick a target your build beats.',
      'In the Hollow duel, Guard just before the ⚠️ for a parry stun; strikes during the stun hit for double.',
      'Status chips sit under both health bars and the duel line names every tick, resist and cleanse as it happens.',
    ],
    tip: 'Metal and Crystal builds resist, Light and Water cleanse, Fire and Poison stack damage over time, and Ice and Wind freeze.',
  },
  {
    key: 'cues', icon: '🎼', kicker: 'SOUND & FULL SCREEN',
    title: 'Audition every rarity cue',
    text: 'Settings → Rarity sound cues plays all ten summon stings for free, with the exact length and theme beside each tier. Nothing is pulled and no coins are spent. A cue stops cleanly when results close or when you summon again, and a new tier replaces the old one without overlap.',
    points: [
      'Tap a rarity row to audition it, tap again or press Stop to silence it.',
      'Closing the Studio stops any cue that is still ringing.',
      'Every screen, sheet and menu fills the full device on phones, foldables and tablets, and sprite art scales to its card.',
    ],
    tip: 'If a cue overlaps a favourite moment, the results screen only starts a tier that is not already playing.',
  },
];
TOUR_STEPS.splice(Math.max(0, TOUR_STEPS.length - 1), 0, ...TOUR_POWER_STEPS);

/* Showcase steps. Each card renders live vector art from the real species data,
   so a new sprite wave updates the tour without hand-drawn screenshots. */
const TOUR_EXTRA_STEPS = [
  {
    key: 'minigames', icon: '🎯', kicker: 'REAL MINI-GAMES',
    title: 'Three games that play back',
    text: 'Treat Catch, Pulse Match, and Coin Dig are not tap-the-big-button counters any more. Each one has real controls, its own failure state, and a skill curve you can feel.',
    showcase: [
      { icon: '🧺', label: 'Treat Catch', text: 'A basket you slide under the falling snacks. Chain catches for ×2, ×3, and ×4.', controls: ['Drag', '◀ ▶', '← →'] },
      { icon: '🎯', label: 'Pulse Match', text: 'Shrinking rings with PERFECT!!, GREAT!, GOOD, and MISS windows. Combos stack multipliers.', controls: ['Tap', 'Space'] },
      { icon: '🪙', label: 'Coin Dig', text: 'A 4×4 dig with radar numbers, three hearts, and a Cash Out button that banks before a bomb.', controls: ['Tap', '💰'] },
    ],
    points: [
      'Missing a treat breaks the chain, so steady beats greedy.',
      'Pulse Match counts a perfect within eight pixels of the target ring.',
      'Coin Dig radar numbers count the bombs touching that tile: 0, 1, or 2.',
    ],
    tip: 'Every game still pays coins, XP, joy, and bond to your active sprite when you collect the result.',
  },
  {
    key: 'duels', icon: '⚔️', kicker: 'ARCADE & ACTION DUELS',
    title: 'Freeze, parry, and finish',
    text: 'The arcade challenges have spells and counters. Zombie Siege gives you a freeze spell and a cherry bomb; Hollow Duel gives you a telegraph, a parry stun, and a Super gauge.',
    showcase: [
      { icon: '❄️', label: 'Freeze', text: 'Zombie Siege: four seconds of frozen lanes, on an eight-second cooldown.', controls: ['F'] },
      { icon: '🍒', label: 'Cherry Bomb', text: 'Clears the lane holding the most zombies. One per run.', controls: ['B'] },
      { icon: '⚡', label: 'Perfect Parry', text: 'Guard within half a second of the ⚠️ and the foe is stunned for 2.2 seconds.', controls: ['Guard'] },
      { icon: '🌟', label: 'Ultimate', text: 'A full Super gauge unleashes 75 damage in one finisher.', controls: ['Super 100%'] },
    ],
    points: [
      'Strikes during a stun deal double damage, so parry first and swing second.',
      'Lanes fire with [1] [2] [3], and the frontmost zombie in that lane takes the hit.',
      'Zombie Siege pays extra for hearts you keep; Hollow Duel pays for perfects and parries.',
    ],
    tip: 'Open Play → Arcade, pick a card, and the controls are always written under the board.',
  },
  {
    key: 'fortnite', icon: '🪂', kicker: 'FORTNITE ACROSS ALL CHAPTERS',
    title: 'Five chapters, one family',
    text: `The Fortnite Legacy roster carries ${FORTNITE_LEGACY_TOTAL} headliners from Chapter 1 through Chapter 5 and the current pass. Every one has original vector art built from its palette, plus a gene, Titan, and type egg.`,
    showcase: [
      { element: 'fn_classicpeely', icon: '🍌', label: 'Peely', text: 'Chapter 1 · Season 8' },
      { element: 'fn_drift', icon: '🕶️', label: 'Drift', text: 'Chapter 1 · Season 5' },
      { element: 'fn_blackknight', icon: '🛡️', label: 'Black Knight', text: 'Chapter 1 · Season 2' },
      { element: 'fn_rippley', icon: '🫧', label: 'Rippley', text: 'Chapter 2 · Season 1' },
      { element: 'fn_peelverine', icon: '🍌', label: 'Peelverine', text: 'Chapter 5 · Season 4' },
    ],
    points: [
      'Chapter 2 brings the spy years: Skye, Brutus, Jules, Kit, and Mancake.',
      'Chapter 3 and 4 cross over with Doom Slayer, Geralt, Optimus Prime, and Peter Griffin.',
      'Chapter 5 is the mythic chapter: Zeus, Hades, Midas, Sub-Zero, Big Dill, and Peelverine.',
      'Collect eight Legacy species for the Season Keeper in the Secret Vault.',
    ],
    tip: 'Every card here is live art from the same roster the Nest sells, not an illustration.',
  },
  {
    key: 'screen', icon: '📐', kicker: 'FITS ANY SCREEN',
    title: 'From a small phone to a desktop',
    text: 'The layout is fluid. Cards reflow, the care dock stays reachable, and the same save works everywhere, from a 320-pixel phone to a wide desktop window.',
    showcase: [
      { icon: '📱', label: 'Compact phone', text: '320–430 px: single-column collection, stacked care dock, thumb-sized buttons.', device: true },
      { icon: '📲', label: 'Tablet & foldable', text: '680–860 px: wider card grids, two-up rosters, and room for the game board.', device: true },
      { icon: '🖥️', label: 'Desktop', text: '1024 px and up: auto-fill grids, centred sheets, and full keyboard control.', device: true },
    ],
    points: [
      'Collection and roster grids use auto-fill, so the column count follows the window.',
      'Every control is a real button, so Tab and Enter work on desktop and a screen reader can name it.',
      'Vector art scales without blurring on high-density displays.',
    ],
    tip: 'Rotate the device or resize the window; nothing is cut off and no control moves out of reach.',
  },
  {
    key: 'favorites', icon: '⭐', kicker: 'FAVORITES & CODEX',
    title: 'Keep the ones you love close',
    text: 'Mark favorites to keep them at the top of the collection, then read their full species file in the Codex and the Wiki. Every game, trail, and sport still pays the active sprite, so a favorite can be the one you raise.',
    points: [
      'Favorites sort first in Sprites, and the roster remembers the order you set.',
      'The Codex holds the 12-tier type ladder, genes, Titans, and every habitat.',
      'Wiki articles open from any card and link back to their wave guide.',
    ],
    tip: 'Search Sprites by name, element, secret, or exotic to find a favorite fast.',
  },
  {
    key: 'pufffamilies', icon: '🫧', kicker: 'PUFF FAMILIES',
    title: 'One tap, a whole family look',
    text: 'Puff families are round-bodied breeds with their own fur, temperament and favorite food. Studio now has one-tap presets: choose a family and the round body, breed, fur style and dye are applied together. Frozen puffs only warm under a cooling mode (Chill Stone or Frost Chill), and the Nest can also switch its heat off. Fire demon puffs and frost angel puffs are friendly, colourful and love company.',
    points: [
      'Presets sit above the body shape picker in Studio, and every slider stays editable afterwards.',
      'Frozen puff eggs need the Chill Stone or Frost Chill. Heat off is a free Nest button for any egg.',
      'Every breed has its own favorite food, likes, dislikes and behavior. The favorite food gives extra Joy and bond.',
      'The Gene Lab is free, and every formed dragon type from the Dragon Nest is kept in Collection permanently.',
    ],
    tip: 'Open any sprite to read its breed temperament card: behavior, favorite food, likes and dislikes.',
  },
];

(function insertShowcaseSteps() {
  const at = TOUR_STEPS.findIndex((step) => step.key === 'studio');
  const index = at >= 0 ? at : Math.max(0, TOUR_STEPS.length - 1);
  TOUR_STEPS.splice(index, 0, ...TOUR_EXTRA_STEPS);
})();

/* Features beside the main loop: the wheel, the sick bay, the coin bank, photo
   mode and the save tools. A new key, so the translated cards stay attached to
   the steps they already describe. */
const TOUR_EXTRAS_STEP = {
  key: 'dailyextras', icon: '🎡', kicker: 'DAILY EXTRAS & KEEPING SAFE',
  title: 'Wheel, clinic, photos and safe saves',
  text: 'A few systems sit beside the daily care loop and each one pays or protects something you already use.',
  points: [
    'Daily Wheel: one free spin a day plus two bonus spins that cost coins. Every prize is coins.',
    'Sick bay: a neglected sprite can catch a cold. Three medicine doses or one clinic visit settle it, and the thermometer and medicine marker show what is wrong.',
    'Coin bank: your wallet lives outside the save, so earned coins survive a reset or a rebuilt Hollow.',
    'Photo Mode: open a puffle’s family sheet and tap 📸 Photo to pose it against a scene and frame, then save the portrait.',
    'Save tools: Studio → Hollow slots holds separate saves, and Save backup &amp; restore gives you a save code, a downloaded file and the 📲 New phone handoff.',
  ],
  tip: 'The wheel, the clinic and the coin bank all work before your first fusion, so use them while the Hollow is small.',
};

(function insertExtrasStep() {
  const at = TOUR_STEPS.findIndex((step) => step.key === 'ready');
  TOUR_STEPS.splice(at >= 0 ? at : TOUR_STEPS.length, 0, TOUR_EXTRAS_STEP);
})();

/* The last card is startable: its primary button finishes the tour and opens
   First Flight, the guided tutorial, instead of ending on a summary. */
TOUR_STEPS.push({
  key: 'tutorial', icon: '🕊️', kicker: 'YOUR FIRST FLIGHT',
  title: 'Start the guided tutorial',
  text: 'First Flight is the guided tutorial that walks you from your starter egg to your first fusion. It reads your save, so every step you finish stays finished.',
  points: [
    'Hatch your starter, say hello with any care action, then take the free gift egg and hatch your second sprite.',
    'Raise both to level 3: task and game awards share XP with your merge partner. Your first merge has its fee waived and a hybrid guaranteed.',
    'The Hollow card keeps your place, and the Nest shows the completion card after your first fusion.',
    'Finish First Flight for its coin and snack reward.',
  ],
  tip: 'Press “Start the tutorial” to open First Flight. You can reopen it from the Hollow card at any time.',
  action: 'tutorial',
});

/* The induction tour covers the main loop; these cards close the remaining
   gaps so a curious player can find every system from one place. They are
   grouped into the chapters below after every step has been collected. */
const TOUR_TOPIC_STEPS = [
  {
    key: 'summon', icon: '🌟', kicker: 'MULTI-SUMMON',
    title: 'Bring down a sky of eggs',
    text: 'The Nest’s Multi-summon button opens the summoning banners. 1× Starfall is a single pull; 10×, 25×, 50× and 100× bring larger batches with higher rarity floors. Event banners rotate in with their own families, worlds or guaranteed tiers, and every banner shows its price, generation and mutation chance before you spend.',
    points: [
      'The rarest reveal lands last. A Creator or Celestial hit pauses the sequence so you can see it.',
      'Pity builds in the save, so a dry streak keeps counting toward the next jackpot even when the banner changes.',
      'Summoned eggs go straight to the Nest. Warm and hatch them like any other egg.',
      'Read the banner details first: a higher tier costs more, but guarantees a better floor.',
    ],
    tip: 'Multi-summon is optional. A single Starfall is the cheapest way to meet a new species.',
  },
  {
    key: 'hotel', icon: '🏨', kicker: 'PUFFLE HOTEL & GROOMING',
    title: 'A spa day for every guest',
    text: 'The Puffle Hotel is a separate lobby and spa. Open it from the 🏨 Puffle Hotel chip in the care dock or the hotel button in Home. Choose any grown guest, then use the Hair Salon, Tooth Spa, Floss & Polish, Mouthwash Bar, Bubble Bath, spa services or room service. Hair, Teeth and Breath each have their own meter.',
    points: [
      'The care dock also has Brush Hair, Brush Teeth, Floss, Mouthwash and the Spa Game, so quick grooming is always one tap away.',
      'Room service serves hotel-only meals, drinks and treats. Fluff & Dry, Pawdicure and the other spa services cost coins.',
      'Every hotel care moment fills a care-token track. Every third moment pays coins, XP and a hotel meal.',
      'Brush & Bliss is the hotel spa minigame: polish hair and teeth, earn a care bonus, and bring home a hotel treat or drink.',
    ],
    tip: 'The lobby, guest switching and meter checks are free. Grooming also keeps a sprite looking and feeling their best.',
  },
  {
    key: 'wardrobe', icon: '👗', kicker: 'WARDROBE & PHOTO MODE',
    title: 'Dress up, mix sets and take a portrait',
    text: 'The Wardrobe of Hollow Styles opens from Studio or a sprite’s wardrobe button. Its tabs cover Outfits, Puffle looks, Mix, Dye, Photo and saved Looks. Seasonal tabs hold matching Sprite and Puffle sets, and every set can be worn as a full look or split into individual pieces.',
    points: [
      'Outfits: browse seasonal sets, preview every piece and wear a complete look in one tap.',
      'Mix: combine a Sprite set with a Puffle set, then edit the individual pieces until the pair matches.',
      'Dye: choose set colours, special dyes and effects. Photo: pick a pose, filter, time, backdrop and weather, then save the portrait.',
      'Looks: save complete outfits and reload them later. Custom clothes from Studio live beside the built-in sets.',
    ],
    tip: 'Everything here is cosmetic. Wardrobe choices never change XP, rarity, bond or battle stats.',
  },
  {
    key: 'frame', icon: '🖼️', kicker: 'FRAME STUDIO',
    title: 'Give every screen a moving frame',
    text: 'Studio’s Frame studio colours the animated rim around the app, the Hollow stage and every clickable control. Daily auto follows the weekday and time; Custom colours gives you First, Second and Glow pickers. Entry, Loading and Menu frames each choose their own Sweep, Glow, Pulse or Still motion.',
    points: [
      'The preview strip shows the Entry, Loading and Menu frames before you commit, and Daily colours resets the palette.',
      'Custom colours apply across buttons, cards, chips, the stage and the app edge. The three frame colours travel around each rim.',
      'Motion is separate for each frame kind. Still keeps the colours but stops the movement; the accessibility motion setting can calm the rest of the app.',
      'Frame styling is cosmetic. It never changes a sprite’s stats, a pull, a hatch or a save.',
    ],
    tip: 'Start with Daily auto, then switch to Custom colours when you want a palette that matches your Hollow theme.',
  },
  {
    key: 'settings', icon: '⚙️', kicker: 'SETTINGS, SAVES & ACCESSIBILITY',
    title: 'Tune the Hollow and keep it safe',
    text: 'Studio is also the settings room. Scroll below the paint tools for sound, music, weather and summon volumes, voice choice, language, closed captions and motion. Lower down are the save tools: Hollow slots, save backup and restore, New phone handoff, Hollow Health and support diagnostics.',
    points: [
      'Language changes the navigation, settings, captions and tour. Closed captions describe sounds and spoken lines.',
      'Sound, music, weather and summon volumes are separate, and the voice picker changes the tour narrator.',
      'Hollow slots keep separate saves. Save backup & restore exports a code or file, and New phone handoff moves a Hollow to another device.',
      'Hollow Health checks saves, support diagnostics exports a report, and Start a brand-new Hollow resets sprites, eggs and streaks while keeping your coins.',
    ],
    tip: 'Open Studio from the top bar and scroll to the bottom. The tutorial handbook sits beside the tour replay button.',
  },
];
TOUR_STEPS.push(...TOUR_TOPIC_STEPS);

/* Chapters are the table of contents for the whole tutorial. They are ordered
   here, then the step array is rebuilt in chapter order so Next flows cleanly
   from Home to First Flight instead of following the order features shipped. */
const TOUR_CHAPTERS = [
  {
    key: 'start', icon: '🌱', label: 'Start here',
    desc: 'Home base, the care dock, fetch games, grooming and the Puffle Hotel.',
    keys: ['hollow', 'care', 'dock', 'hotel'],
  },
  {
    key: 'grow', icon: '🥚', label: 'Grow the Hollow',
    desc: 'Hatch, summon, merge, evolve and fill the collection.',
    keys: ['nest', 'summon', 'growth', 'collection', 'newcollections', 'forms', 'live'],
  },
  {
    key: 'explore', icon: '🎮', label: 'Explore & play',
    desc: 'Trails, games, arcade challenges, duels, biomes and district quests.',
    keys: ['biomes', 'games', 'arcade', 'minigames', 'duels', 'paths', 'status', 'districts', 'today'],
  },
  {
    key: 'discover', icon: '🔐', label: 'Discover',
    desc: 'Legends, secrets, favorites, the Codex and every screen size.',
    keys: ['heroes', 'fortnite', 'secrets', 'favorites', 'screen'],
  },
  {
    key: 'make', icon: '🎨', label: 'Make it yours',
    desc: 'Rooms, wardrobes, Puff families, Studio and rarity sound cues.',
    keys: ['homeview', 'wardrobe', 'frame', 'pufffamilies', 'studio', 'cues'],
  },
  {
    key: 'daily', icon: '📅', label: 'Daily & safe',
    desc: 'Wheel, clinic, coin bank, saves, settings and First Flight.',
    keys: ['dailyextras', 'settings', 'ready', 'tutorial'],
  },
];

function tourStepIndex(key) {
  return TOUR_STEPS.findIndex((step) => step.key === key);
}

function tourChapterEntries(chapter) {
  return (chapter ? chapter.keys : [])
    .map((key) => {
      const index = tourStepIndex(key);
      return index >= 0 ? { index, step: TOUR_STEPS[index] } : null;
    })
    .filter(Boolean);
}

function tourChapterStart(chapter) {
  const entries = tourChapterEntries(chapter);
  return entries.length ? entries[0].index : 0;
}

function tourChapterFor(key) {
  return TOUR_CHAPTERS.find((chapter) => chapter.keys.includes(key)) || TOUR_CHAPTERS[TOUR_CHAPTERS.length - 1];
}

(function orderTourByChapter() {
  const byKey = new Map(TOUR_STEPS.map((step) => [step.key, step]));
  const ordered = [];
  TOUR_CHAPTERS.forEach((chapter) => chapter.keys.forEach((key) => {
    const step = byKey.get(key);
    if (!step) return;
    ordered.push(step);
    byKey.delete(key);
  }));
  TOUR_STEPS.forEach((step) => {
    if (byKey.has(step.key)) {
      ordered.push(step);
      byKey.delete(step.key);
    }
  });
  TOUR_STEPS.splice(0, TOUR_STEPS.length, ...ordered);
})();

function tourSentenceParts(text) {
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function tourShowcaseArt(entry) {
  if (entry.element) {
    try {
      if (typeof ELEMENTS !== 'undefined' && ELEMENTS[entry.element] && typeof spriteSVG === 'function') {
        return `<span class="ts-art">${spriteSVG({ element: entry.element, stage: 'adult', level: 24, joy: 80 }, { expr: 'happy' })}</span>`;
      }
    } catch (err) { /* fall back to the emoji below */ }
  }
  return `<span class="ts-art ts-emoji">${entry.icon || '✦'}</span>`;
}

function tourShowcaseHTML(step) {
  if (!step.showcase || !step.showcase.length) return '';
  const cards = step.showcase.map((entry) => `<div class="ts-card${entry.device ? ' ts-device' : ''}">
      ${tourShowcaseArt(entry)}
      <b>${entry.label}</b>
      <span>${entry.text}</span>
      ${entry.controls ? `<em class="ts-controls">${entry.controls.map((key) => `<kbd>${key}</kbd>`).join('')}</em>` : ''}
    </div>`).join('');
  return `<div class="tour-showcase" role="list">${cards}</div>`;
}

/* One tutorial at a time. The induction tour owns the first-session screen, so
   the Hollow's First Flight card hides while it is open -- including a replay
   started from the Studio, where the tour is already marked seen. The event
   lets the card repaint on open and again once the sheet closes. */
let tourSheetOpen = false;

function tourSheetVisible() {
  return tourSheetOpen;
}

function setTourSheetVisible(open) {
  if (tourSheetOpen === !!open) return;
  tourSheetOpen = !!open;
  if (typeof document !== 'undefined' && typeof CustomEvent === 'function') {
    document.dispatchEvent(new CustomEvent('tour-visibility', { detail: { open: tourSheetOpen } }));
  }
}

/* The one gate for cards that would compete with the tour: hidden until the
   induction tour is seen, and hidden again while its sheet is open, which the
   save alone cannot tell apart because a Studio replay happens after seen. */
function onboardingTourBlocks() {
  if (typeof state === 'undefined' || !state.seen || !state.seen.tour) return true;
  return tourSheetVisible();
}

/* The tour ends by opening First Flight, the guided first-session tutorial.
   A new hollow has already begun it; a replay only reopens the same steps. */
function startFirstFlightTutorial() {
  if (typeof Actions !== 'undefined' && typeof Actions.flightBegin === 'function') Actions.flightBegin();
  if (typeof App !== 'undefined' && typeof App.go === 'function') App.go('hollow');
  setTimeout(() => {
    if (typeof openFlightSheet === 'function') openFlightSheet({ guide: true });
  }, 320);
}

/* Clamp the saved step for both the boot tour and Studio. A completed or
   skipped tour stores 0, so only a real mid-tour close reports resume: true. */
function tourSavedProgress() {
  const total = TOUR_STEPS.length;
  const raw = Math.floor(Number(typeof state !== 'undefined' ? state.tourStep : 0) || 0);
  const step = Math.max(0, Math.min(raw, total - 1));
  return { step, total, resume: step > 0 };
}

function startTour({ fromStudio = false, restart = false, startAt = null } = {}) {
  const saved = tourSavedProgress();
  const requested = startAt != null && Number.isFinite(Number(startAt)) ? Math.floor(Number(startAt)) : null;
  let index = requested != null
    ? Math.max(0, Math.min(requested, TOUR_STEPS.length - 1))
    : (!restart && saved.resume ? saved.step : 0);
  let settled = false;
  let speaking = false;
  let voiceWanted = typeof Voice !== 'undefined' && Voice.enabled();
  let voiceOverride = false;
  let speakToken = 0;
  const speechTimers = new Set();

  const { overlay, close } = openSheet({
    key: 'tour',
    title: t('tour.title'),
    sub: fromStudio ? t('tour.subReplay') : `${TOUR_STEPS.length} ${t('tour.sub')}`,
    body: '<div data-tour-body></div>',
    onClose: () => {
      stopSpeech();
      setTourSheetVisible(false);
      if (!settled) {
        settled = true;
        rememberStep();
        if (typeof Actions.markTourSeen === 'function') Actions.markTourSeen();
        if (index > 0) {
          toast(t('tour.paused', { step: index + 1, total: TOUR_STEPS.length }), '🧭');
        }
      }
    },
  });
  setTourSheetVisible(true);

  const body = overlay.querySelector('[data-tour-body]');

  function rememberStep() {
    if (typeof Actions !== 'undefined' && typeof Actions.setTourStep === 'function') Actions.setTourStep(index);
  }

  function updateVoiceButton() {
    const btn = body.querySelector('[data-tour-voice]');
    const note = body.querySelector('[data-tour-voice-note]');
    if (!btn || !note) return;
    const supported = typeof Voice !== 'undefined' && Voice.supported();
    btn.disabled = !supported;
    btn.textContent = speaking ? t('tour.stop') : t('tour.read');
    btn.setAttribute('aria-pressed', speaking ? 'true' : 'false');
    if (!supported) note.textContent = t('tour.voiceUnavailable');
    else if (!Voice.enabled() && !voiceOverride) note.textContent = t('tour.voiceOff');
    else if (speaking) note.textContent = t('tour.reading');
    else note.textContent = t('tour.tap');
  }

  function stopSpeech() {
    speakToken += 1;
    speechTimers.forEach((id) => clearTimeout(id));
    speechTimers.clear();
    speaking = false;
    if (typeof Voice !== 'undefined') Voice.stop();
    body.querySelectorAll('.tour-speaking').forEach((node) => node.classList.remove('tour-speaking'));
    updateVoiceButton();
  }

  function say(element, token, done) {
    if (token !== speakToken) return;
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      done();
      return;
    }
    body.querySelectorAll('.tour-speaking').forEach((node) => node.classList.remove('tour-speaking'));
    element.classList.add('tour-speaking');
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (typeof Voice !== 'undefined') {
      Voice.speak(text, { force: true, allowMuted: voiceOverride, rate: 0.94 });
    }
    const delay = Math.max(1600, Math.round(text.split(/\s+/).length * 390 + 550));
    const id = setTimeout(() => {
      speechTimers.delete(id);
      if (token === speakToken) done();
    }, delay);
    speechTimers.add(id);
  }

  function narrateCurrent() {
    stopSpeech();
    if (!voiceWanted) return;
    if (typeof Voice === 'undefined' || !Voice.supported()) return;
    const segments = [...body.querySelectorAll('[data-tour-say]')];
    if (!segments.length) return;
    speaking = true;
    updateVoiceButton();
    const token = speakToken;
    let cursor = 0;
    const next = () => {
      if (token !== speakToken) return;
      if (cursor >= segments.length) {
        speaking = false;
        body.querySelectorAll('.tour-speaking').forEach((node) => node.classList.remove('tour-speaking'));
        updateVoiceButton();
        return;
      }
      say(segments[cursor++], token, next);
    };
    next();
  }

  function paint() {
    stopSpeech();
    const step = tourStepText(TOUR_STEPS[index]);
    const chapter = tourChapterFor(TOUR_STEPS[index].key);
    const chapterEntries = tourChapterEntries(chapter);
    const last = index === TOUR_STEPS.length - 1;
    const sentences = tourSentenceParts(step.text);
    body.innerHTML = `<div class="tour-card">
      <div class="tour-top">
        <span class="tour-icon">${step.icon}</span>
        <span class="tour-kicker">${step.kicker}</span>
        <span class="tour-count">${index + 1} / ${TOUR_STEPS.length}</span>
      </div>
      <div class="tour-chapters" role="group" aria-label="Tutorial chapters">
        ${TOUR_CHAPTERS.map((entry) => `<button class="chip tour-chapter ${entry.key === chapter.key ? 'on' : ''}" type="button" data-tour-chapter="${entry.key}" aria-pressed="${entry.key === chapter.key}" title="${entry.desc}">${entry.icon} ${entry.label}</button>`).join('')}
      </div>
      <div class="tour-langs" role="group" aria-label="Tour language">
        <span>🌐 ${t('settings.language')}</span>
        ${I18N_LANGUAGE_ORDER.map((code) => `<button class="chip tour-lang ${uiLang() === code ? 'on' : ''}" data-tour-lang="${code}" aria-pressed="${uiLang() === code}">${I18N_LANGUAGES[code].native}</button>`).join('')}
      </div>
      <h3 data-tour-say>${step.title}</h3>
      <p class="tour-text">${sentences.map((sentence) => `<span class="tour-sentence" data-tour-say>${sentence}</span>`).join(' ')}</p>
      ${tourShowcaseHTML(step)}
      <div class="tour-points">${(step.points || []).map((point) => `<div class="tour-point"><span>✦</span><span data-tour-say>${point}</span></div>`).join('')}</div>
      <div class="tour-tip"><span>✦</span><span data-tour-say>${step.tip}</span></div>
      <div class="tour-voice">
        <button class="btn btn-soft btn-sm" type="button" data-tour-voice aria-pressed="false">${t('tour.read')}</button>
        <span class="tour-voice-note" data-tour-voice-note></span>
      </div>
      <div class="tour-dots" aria-label="${chapter.label} progress">${chapterEntries.map(({ index: dotIndex, step: dotStep }) => `<i class="${dotIndex === index ? 'on' : dotIndex < index ? 'done' : ''}" title="${dotStep.title}"></i>`).join('')}</div>
      <div class="tour-actions">
        <button class="btn btn-ghost btn-sm" data-tour-skip>${last ? t('tour.close') : t('tour.skip')}</button>
        <div class="row" style="gap:8px">
          ${index > 0 ? `<button class="btn btn-soft btn-sm" data-tour-back>${t('tour.back')}</button>` : ''}
          <button class="btn btn-primary btn-sm" data-tour-next>${last ? (step.action === 'tutorial' ? t('tour.startTutorial') : t('tour.start')) : t('tour.next')}</button>
        </div>
      </div>
      ${step.key === 'ready' ? `<p class="tiny muted" style="text-align:center;margin-top:10px">${t('tour.firstSecret')}</p>` : ''}
    </div>`;
    updateVoiceButton();
    body.querySelectorAll('[data-tour-chapter]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextChapter = TOUR_CHAPTERS.find((entry) => entry.key === button.dataset.tourChapter);
        if (!nextChapter) return;
        Sfx.click();
        stopSpeech();
        index = tourChapterStart(nextChapter);
        rememberStep();
        paint();
      });
    });
    body.querySelectorAll('[data-tour-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        Actions.setTheme({ language: button.dataset.tourLang });
        applyLanguage();
        stopSpeech();
        paint();
        Sfx.click();
      });
    });
    body.querySelector('[data-tour-voice]')?.addEventListener('click', () => {
      Sfx.click();
      if (speaking) {
        stopSpeech();
        return;
      }
      voiceWanted = true;
      voiceOverride = true;
      narrateCurrent();
    });
    body.querySelector('[data-tour-next]').addEventListener('click', () => {
      Sfx.click();
      stopSpeech();
      if (last) {
        settled = true;
        const unlocked = typeof Actions.completeTour === 'function' ? Actions.completeTour() : null;
        close();
        if (unlocked) toast(`${unlocked.name} joined your Hollow. Check the Secret Vault in Types.`, '🔐');
        else toast('Tour complete. The Hollow is yours.', '🧭');
        if (step.action === 'tutorial') startFirstFlightTutorial();
        return;
      }
      index += 1;
      rememberStep();
      paint();
    });
    body.querySelector('[data-tour-skip]').addEventListener('click', () => {
      Sfx.click();
      stopSpeech();
      settled = true;
      if (typeof Actions.clearTourStep === 'function') Actions.clearTourStep();
      if (typeof Actions.markTourSeen === 'function') Actions.markTourSeen();
      close();
    });
    body.querySelector('[data-tour-back]')?.addEventListener('click', () => {
      Sfx.click();
      stopSpeech();
      index = Math.max(0, index - 1);
      rememberStep();
      paint();
    });
    if (voiceWanted) narrateCurrent();
  }

  rememberStep();
  paint();
  return { close };
}

/* The handbook is the browse-from-anywhere version of the same tour. It does
   not replace the induction sequence: each chapter opens the tour at its first
   card, and First Flight remains the practical chapter at the end. */
function openTourHandbook() {
  const saved = tourSavedProgress();
  const chapters = TOUR_CHAPTERS.map((chapter) => {
    const entries = tourChapterEntries(chapter);
    const start = tourChapterStart(chapter);
    return `<button class="rowcard tour-hub-row" type="button" data-tour-open-chapter="${chapter.key}">
      <span class="th-icon">${chapter.icon}</span>
      <span class="th-copy"><b>${chapter.label}</b><small>${chapter.desc}</small><small>${entries.length} step${entries.length === 1 ? '' : 's'} · starts at step ${start + 1}</small></span>
      <span class="th-go">${t('tour.openChapter')} →</span>
    </button>`;
  }).join('');
  const finishedTour = !!(typeof state !== 'undefined' && state.seen && state.seen.tour);
  const body = `<div class="tour-hub">
    <div class="card tour-hub-head">
      <div class="between"><b>🧭 ${t('tour.handbook')}</b><span class="chip">${saved.step + 1}/${saved.total}</span></div>
      <p class="tiny muted" style="margin:7px 0 10px;line-height:1.5">${saved.resume ? `Paused at step ${saved.step + 1}. Resume where you left off, or open a chapter below.` : 'Start at the beginning, or jump straight to the chapter you need.'} Every chapter uses the same narrated induction cards.</p>
      <div class="row" style="gap:7px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" type="button" data-tour-hub-resume>${saved.resume ? t('tour.resume') : t('tour.start')}</button>
        <button class="btn btn-ghost btn-sm" type="button" data-tour-hub-restart>${t('tour.restartAll')}</button>
      </div>
    </div>
    ${chapters}
    <div class="card tour-hub-head">
      <div class="between"><b>🕊️ ${t('tour.flightCard')}</b><span class="chip">${finishedTour ? 'ready' : 'after the tour'}</span></div>
      <p class="tiny muted" style="margin:7px 0 10px;line-height:1.5">${t('tour.flightNote')}</p>
      <button class="btn btn-soft btn-block btn-sm" type="button" data-tour-hub-flight ${finishedTour ? '' : 'disabled'}>${finishedTour ? t('tour.flightOpen') : t('tour.flightLocked')}</button>
    </div>
  </div>`;
  return openSheet({
    key: 'tour-handbook',
    title: `📖 ${t('tour.handbook')}`,
    sub: t('tour.handbookSub'),
    body,
    onMount: (root, close) => {
      const leave = (fn) => {
        if (typeof Sfx !== 'undefined') Sfx.click();
        close();
        setTimeout(fn, 160);
      };
      root.querySelector('[data-tour-hub-resume]')?.addEventListener('click', () => {
        leave(() => startTour({ fromStudio: true }));
      });
      root.querySelector('[data-tour-hub-restart]')?.addEventListener('click', () => {
        leave(() => startTour({ fromStudio: true, restart: true }));
      });
      root.querySelectorAll('[data-tour-open-chapter]').forEach((button) => {
        button.addEventListener('click', () => {
          const chapter = TOUR_CHAPTERS.find((entry) => entry.key === button.dataset.tourOpenChapter);
          if (!chapter) return;
          leave(() => startTour({ fromStudio: true, startAt: tourChapterStart(chapter) }));
        });
      });
      root.querySelector('[data-tour-hub-flight]')?.addEventListener('click', () => {
        if (!finishedTour) return;
        leave(() => {
          if (typeof openFlightSheet === 'function') openFlightSheet({ guide: true });
          else startTour({ fromStudio: true, startAt: tourStepIndex('tutorial') });
        });
      });
    },
  });
}
