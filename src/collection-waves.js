/* Collection wave registry. Every wave registers itself here, and the Tour, Wiki,
   and Codex read the registry live so new sprites appear the moment they load. */

const COLLECTION_WAVES = [];

function registerCollectionWave(entry) {
  if (!entry || !entry.key) return;
  const existing = COLLECTION_WAVES.findIndex((wave) => wave.key === entry.key);
  if (existing >= 0) COLLECTION_WAVES[existing] = entry;
  else COLLECTION_WAVES.push(entry);
}

registerCollectionWave({ key: 'ahs', label: 'American Horror Story', icon: '🎬', group: 'TV & film', note: 'Every season, from the Murder House to Provincetown.', count: () => (typeof AHS_KEYS !== 'undefined' ? AHS_KEYS.length : 0) });
registerCollectionWave({ key: 'memes', label: 'Internet memes', icon: '🌐', group: 'Internet', note: 'Forty-five legends with genes, Titans, and Meme Core homes.', count: () => (typeof MEME_KEYS !== 'undefined' ? MEME_KEYS.length : 0) });
registerCollectionWave({ key: 'themeshowcase', label: 'Games, TV & pets', icon: '🕹️', group: 'Crossover', note: 'Video-game icons, TV families, meme friends, and virtual pets with genes and Titan names.', count: () => (typeof SHOWCASE_THEME_KEYS !== 'undefined' ? SHOWCASE_THEME_KEYS.length : 0) });
registerCollectionWave({ key: 'retrowave', label: 'Retro, emotes & legendary pets', icon: '👾', group: 'Crossover', note: 'Arcade-era icons, Fortnite emotes, cartoon and anime archetypes, and six legendary pets.', count: () => (typeof RETRO_THEME_KEYS !== 'undefined' ? RETRO_THEME_KEYS.length : 0) });
registerCollectionWave({ key: 'event', label: 'Special event sprites', icon: '☄️', group: 'Events', note: 'Weekend-only visitors that arrive with an event egg.', count: () => (typeof EVENT_KEYS !== 'undefined' ? EVENT_KEYS.length : 0) });
registerCollectionWave({ key: 'admin', label: 'Admin sprites', icon: '🛠️', group: 'Events', note: 'The weekend Admin Event team, complete with root access.', count: () => (typeof ADMIN_KEYS !== 'undefined' ? ADMIN_KEYS.length : 0) });
registerCollectionWave({ key: 'seasonal', label: 'Seasonal gift sprites', icon: '🍂', group: 'Events', note: 'Holiday-only eggs from the seasonal gift pool.', count: () => (typeof SEASONAL_KEYS !== 'undefined' ? SEASONAL_KEYS.length : 0) });
registerCollectionWave({ key: 'heroes', label: 'Heroes & villains', icon: '🦸', group: 'Comics', note: 'Marvel, DC, and beyond, with publisher and role filters.', count: () => (typeof HERO_SPECIES !== 'undefined' ? HERO_SPECIES.length : 0) });
registerCollectionWave({ key: 'disney', label: 'Disney', icon: '🏰', group: 'Animation', note: 'Classics, princesses, Pixar, villains, and modern favorites.', count: () => (typeof DISNEY_TOTAL === 'number' ? DISNEY_TOTAL : 0) });
registerCollectionWave({ key: 'fairies', label: 'Pixie Hollow fairies', icon: '🧚', group: 'Animation', note: 'Every Tinker Bell film fairy, season minister, and fairy friend from other cartoons.', count: () => (typeof FAIRY_KEYS !== 'undefined' ? FAIRY_KEYS.length : 0) });
registerCollectionWave({ key: 'neverland', label: 'Neverland & Peter Pan', icon: '🏴‍☠️', group: 'Animation', note: 'Peter, Wendy, the Lost Boys, pirates, mermaids, and the crocodile.', count: () => (typeof NEVERLAND_KEYS !== 'undefined' ? NEVERLAND_KEYS.length : 0) });
registerCollectionWave({ key: 'adultswim', label: 'Adult Swim', icon: '📡', group: 'TV & film', note: 'Late-night cartoons, from Rick and Morty to Smiling Friends.', count: () => (typeof ADULTSWIM_KEYS !== 'undefined' ? ADULTSWIM_KEYS.length : 0) });
registerCollectionWave({ key: 'babylooney', label: 'Baby Looney Tunes', icon: '🍼', group: 'Animation', note: 'The nursery years: Bugs, Daffy, Tweety, Lola, Taz, and friends.', count: () => (typeof BABY_LOONEY_KEYS !== 'undefined' ? BABY_LOONEY_KEYS.length : 0) });
registerCollectionWave({ key: 'carebears', label: 'Care Bears & Cousins', icon: '🌈', group: 'Animation', note: 'Classic bears, Cousins, and extended family.', count: () => (typeof CARE_BEAR_TOTAL === 'number' ? CARE_BEAR_TOTAL : 0) });
registerCollectionWave({ key: 'netflix', label: 'Netflix Anime & Toons', icon: '📺', group: 'Animation', note: 'Twenty shows with three characters each.', count: () => (typeof NETFLIX_TOTAL === 'number' ? NETFLIX_TOTAL : 0) });
registerCollectionWave({ key: 'fortnite', label: 'Fortnite Legacy', icon: '🪂', group: 'Games', note: 'Headliners from every chapter and season.', count: () => (typeof FORTNITE_LEGACY_TOTAL === 'number' ? FORTNITE_LEGACY_TOTAL : 0) });
registerCollectionWave({ key: 'gta', label: 'Grand Theft Auto', icon: '🚗', group: 'Games', note: 'Every district, from Liberty City to Los Santos, with its own biome home.', count: () => (typeof GTA_TOTAL === 'number' ? GTA_TOTAL : 0) });
registerCollectionWave({ key: 'gamegenres', label: 'Video Game Genres', icon: '🎮', group: 'Games', note: '14 game genre sprites: Arcade, RPG, Shooter, Brawler, Racer, Jumper, Puzzle, Strategy, Sim, Voxel, Rhythm, Cards, Horror, and Sports.', count: () => (typeof GAME_SPRITE_SPECIES !== 'undefined' ? Object.keys(GAME_SPRITE_SPECIES).length : 0) });
registerCollectionWave({ key: 'petclassics', label: 'Virtual Pet Legends', icon: '🐾', group: 'Games', note: 'Talking Tom, Pou, Om Nom, Tamagotchi, OviPets Dragon, Talking Ginger, Subway Surfer, and My Boo.', count: () => (typeof PET_CLASSICS_SPECIES !== 'undefined' ? Object.keys(PET_CLASSICS_SPECIES).length : 0) });
registerCollectionWave({ key: 'mobileclassics', label: 'Mobile Game Classics', icon: '📱', group: 'Games', note: 'Temple Run 1&2, 8 Ball Pool, Mario Run, Jumanji, Tom Candy Run, Merge Dragons, Dragon City, Monster Legends, Snake.io, UNO, Angry Birds 2, PvZ, Fruit Ninja 2, Angry Gran.', count: () => (typeof MOBILE_CLASSICS_SPECIES !== 'undefined' ? Object.keys(MOBILE_CLASSICS_SPECIES).length : 0) });
registerCollectionWave({ key: 'simmusic', label: 'Sim & Rhythm Legends', icon: '🎶', group: 'Games', note: 'Family Life Sim 3D, Magic Tiles 1-3 Piano Maestro, Rolling Ball Balancer, and Tap Tiles Speedster.', count: () => (typeof SIM_MUSIC_SPECIES !== 'undefined' ? Object.keys(SIM_MUSIC_SPECIES).length : 0) });
registerCollectionWave({ key: 'wwe', label: 'WWE locker room', icon: '🤼', group: 'Sports', note: 'Golden, Attitude, Ruthless Aggression, PG, Women’s, Tag, and NXT eras.', count: () => (typeof WWE_TOTAL === 'number' ? WWE_TOTAL : 0) });
registerCollectionWave({ key: 'catalog', label: 'Cross-media catalog', icon: '🗂️', group: 'Animation', note: 'PBS Kids, Nickelodeon, Discovery, comics, and game genres.', count: () => (typeof CATALOG_TOTAL === 'number' ? CATALOG_TOTAL : 0) });
registerCollectionWave({ key: 'legends', label: 'Crossover legends', icon: '🌟', group: 'Crossover', note: 'FNAF, Mario, Zelda, horror, and video-game icons.', count: () => (typeof LEGEND_TOTAL === 'number' ? LEGEND_TOTAL : 0) });
registerCollectionWave({ key: 'vault', label: 'Secret Vault', icon: '🔐', group: 'Secrets', note: 'Not sold in the Nest; opened by milestones and codes.', count: () => (typeof SECRET_SPECIES !== 'undefined' ? SECRET_SPECIES.length : 0) });

function collectionWaves() {
  return COLLECTION_WAVES.filter((wave) => wave.count() > 0);
}

function collectionWaveTotal(label) {
  return collectionWaves().reduce((sum, wave) => sum + wave.count(), 0);
}

function collectionWaveRowsHTML() {
  return collectionWaves().map((wave) => `<div class="wiki-habitat-row">
      <span class="wh-emoji">${wave.icon}</span>
      <span class="wh-copy"><b>${esc(wave.label)} · ${wave.count()}</b><span>${esc(wave.note)}</span></span>
    </div>`).join('');
}

function collectionWaveChipsHTML() {
  return collectionWaves().map((wave) => `<span class="chip">${wave.icon} ${esc(wave.label)} · ${wave.count()}</span>`).join('');
}
