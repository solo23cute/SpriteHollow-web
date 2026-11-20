/* Vault puffle wave: four Vault doors whose keepers are Sprite Puffles.

   These are ordinary Secret Vault species (not type eggs), registered through
   the same SECRET_SPECIES_META table the rest of the Vault uses. Each one also
   carries a puffleStyle and a LUMI_PUFFLE_VARIANTS row, so it keeps the rounded
   puffle body and gets its own signature headpiece from puffle-style-art.js.
   The doors extend the existing travel-milestone shelf. */

const VAULT_PROGRESS_WAVE = [
  {
    key: 'vaultwanderer',
    name: 'Vault Wanderer',
    title: 'One hundred roads, one door',
    clue: 'Complete 100 travels.',
    palette: ['#8be9ff', '#effeff', '#1f5f70', '#ffd166'],
    trait: 'Wayfaring — knows every shortcut in the Hollow and still takes the scenic one.',
    blurb: 'A Vault sprite who appears after a keeper has walked a hundred roads and finally notices the door that was always there.',
    greeting: 'A hundred roads. You stopped counting before I did.',
    likes: 'Trail Mix',
    gene: ['Long Road', '🧭', '+20% XP and gifts arrive 22% sooner.', { xp: 1.2, giftSpeed: 1.22 }],
    titan: 'Wayfarer Titan',
  },
  {
    key: 'vaultchampion',
    name: 'Vault Champion',
    title: 'Every guardian remembers a good bout',
    clue: 'Win 25 Guardian duels.',
    palette: ['#ffd166', '#fff8d0', '#6b4b00', '#b51f1f'],
    trait: 'Proven — keeps a tally of every guardian who gave a fair fight.',
    blurb: 'A Vault sprite who steps out of the champion door after twenty-five guardian bouts, still looking for a worthy rematch.',
    greeting: 'Twenty-five bouts. You learned the rhythm. Now we can talk.',
    likes: 'Ember Steak',
    gene: ['Champion’s Round', '🏆', 'Games pay +6 coins and needs fade 10% slower.', { gameCoins: 6, decay: 0.9 }],
    titan: 'Champion Titan',
  },
];

const VAULT_PUFFLE_WAVE = [
  {
    key: 'vaultpuff_lantern',
    name: 'Lantern Vault Puffle',
    title: 'A small light kept for the long halls',
    clue: 'Open the Lantern Door with 55 travels.',
    door: { id: 'gv-9', name: 'Lantern Door', icon: '🏮', travels: 55, coins: 700 },
    palette: ['#ffd166', '#fff8d0', '#6b4b00', '#ff9ec7'],
    style: { primary: '#ffd166', secondary: '#fff1b8', belly: '#fffbe6', ear: '#ffe6a3', iris: '#e09a00', eyeShadow: '#6b4b00', leaf: '#ffcf4d', leafGlow: '#fff3b0', pads: '#ffd9e6' },
    puffleElement: 'Spirit',
    motif: 'star',
    trait: 'Guiding — carries a lantern that only lights the next safe step.',
    blurb: 'A Vault puffle who tends the lanterns along the oldest corridor and refuses to let a keeper walk it alone.',
    greeting: 'The hall is long, but I brought a light for both of us.',
    likes: 'Honey Tea',
    gene: ['Vault Lantern', '🏮', '+18% XP and gifts arrive 20% sooner.', { xp: 1.18, giftSpeed: 1.2 }],
    titan: 'Lantern Vault Titan',
  },
  {
    key: 'vaultpuff_frost',
    name: 'Frost Vault Puffle',
    title: 'The cold room keeps its own time',
    clue: 'Open the Frost Door with 65 travels.',
    door: { id: 'gv-10', name: 'Frost Door', icon: '❄️', travels: 65, coins: 800 },
    palette: ['#a9e4ff', '#f2fbff', '#1f6e9b', '#8be9ff'],
    style: { primary: '#a9e4ff', secondary: '#ddf4ff', belly: '#f7ffff', ear: '#c8eeff', iris: '#5fd8ff', eyeShadow: '#1f6e9b', leaf: '#8bd9f2', leafGlow: '#d6f6ff', pads: '#ffd9ef' },
    puffleElement: 'Ice',
    motif: 'ice',
    trait: 'Preserving — keeps one perfect snowflake from every winter the Vault has seen.',
    blurb: 'A Vault puffle who lives beside the frost door and catalogs snowflakes in a book that never melts.',
    greeting: 'Mind the ice. It remembers every footstep, including yours.',
    likes: 'Warm Soup',
    gene: ['Cold Storage', '❄️', 'All needs fade 12% slower and energy fades 15% slower.', { decay: 0.88, energyDecay: 0.85 }],
    titan: 'Frost Vault Titan',
  },
  {
    key: 'vaultpuff_dream',
    name: 'Dream Vault Puffle',
    title: 'A door that opens only while asleep',
    clue: 'Open the Dream Door with 78 travels.',
    door: { id: 'gv-11', name: 'Dream Door', icon: '💭', travels: 78, coins: 950 },
    palette: ['#b18cff', '#f3e8ff', '#3a1b6b', '#ffd1f0'],
    style: { primary: '#b18cff', secondary: '#e0c9ff', belly: '#f8f0ff', ear: '#d6b8ff', iris: '#8c5cff', eyeShadow: '#3a1b6b', leaf: '#a27bff', leafGlow: '#e8d6ff', pads: '#ffd9ef' },
    puffleElement: 'Dream',
    motif: 'halo',
    trait: 'Dreaming — files every visitor’s wish under a sky that only exists at night.',
    blurb: 'A Vault puffle who sleeps beside the dream door and wakes when someone needs a better ending.',
    greeting: 'You are early. The dream has not started yet, but I saved you a seat.',
    likes: 'Moon Cake',
    gene: ['Dream Ledger', '💭', 'Night games pay +4 coins and pets build 22% more bond.', { nightCoins: 4, petBond: 1.22 }],
    titan: 'Dream Vault Titan',
  },
  {
    key: 'vaultpuff_crown',
    name: 'Crown Vault Puffle',
    title: 'The last door keeps the first crown',
    clue: 'Open the Crown Door with 92 travels.',
    door: { id: 'gv-12', name: 'Crown Door', icon: '👑', travels: 92, coins: 1200 },
    palette: ['#d9a441', '#fff3c4', '#6b4a00', '#ff9ec7'],
    style: { primary: '#d9a441', secondary: '#ffe6a3', belly: '#fff8d9', ear: '#f0c96a', iris: '#b8860b', eyeShadow: '#6b4a00', leaf: '#c9a227', leafGlow: '#ffe9a8', pads: '#ffd9e6' },
    puffleElement: 'Light',
    motif: 'crown',
    trait: 'Royal — wears a tiny crown that belonged to every keeper who came before.',
    blurb: 'A Vault puffle who guards the final door and decides which keepers have earned the old crown.',
    greeting: 'Ninety-two roads. The crown was waiting for someone who kept walking.',
    likes: 'Star Cookie',
    gene: ['Old Crown', '👑', 'Games pay +5 coins, +16% XP, and gifts arrive 18% sooner.', { gameCoins: 5, xp: 1.16, giftSpeed: 1.18 }],
    titan: 'Crown Vault Titan',
  },
];

(function registerVaultWave() {
  if (typeof ELEMENTS === 'undefined' || typeof SECRET_SPECIES_META === 'undefined') return;
  const table = typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;

  const register = (def, puffle = false) => {
    const [primary, light, deep, accent] = def.palette;
    const meta = {
      name: def.name,
      title: def.title,
      clue: def.clue,
      palette: def.palette,
      trait: def.trait,
      blurb: def.blurb,
      greeting: def.greeting,
      likes: def.likes,
      gene: def.gene,
      titan: def.titan,
    };
    if (puffle) meta.vaultPuffle = true;
    SECRET_SPECIES_META[def.key] = meta;
    if (!SECRET_SPECIES.includes(def.key)) SECRET_SPECIES.push(def.key);

    const element = {
      name: def.name,
      primary,
      light,
      deep,
      accent,
      trait: def.trait,
      blurb: def.blurb,
      greeting: def.greeting,
      likes: def.likes,
      secret: true,
    };
    if (puffle) {
      element.puffleStyle = def.key;
      element.puffleElement = def.puffleElement;
      element.collectionTier = 'secret';
      element.collectionTierName = 'Secret';
      element.rarity = 'secret';
      element.eggRarity = 'secret';
    }
    ELEMENTS[def.key] = element;
    GENE_POWERS[def.key] = { name: def.gene[0], icon: def.gene[1], desc: def.gene[2], effect: def.gene[3] };
    TITAN_NAMES[def.key] = def.titan;
    if (!ELEMENT_KEYS.includes(def.key)) ELEMENT_KEYS.push(def.key);
    NAME_START[def.key] = [def.name.split(' ')[0], 'Vault', puffle ? 'Puff' : 'Ward', puffle ? 'Lantern' : 'Echo'];

    if (!puffle) return;
    if (table && !table[def.key]) {
      table[def.key] = {
        hidden: true,
        tier: 'secret',
        name: def.name,
        theme: `A Vault puffle sealed behind the ${def.door.name}.`,
        motif: def.motif,
        ...def.style,
      };
    }
    if (typeof GUARDIAN_VAULT_DOORS !== 'undefined' && !GUARDIAN_VAULT_DOORS.some((door) => door.id === def.door.id)) {
      GUARDIAN_VAULT_DOORS.push({ ...def.door, secret: def.key });
    }
  };

  VAULT_PUFFLE_WAVE.forEach((def) => register(def, true));
  VAULT_PROGRESS_WAVE.forEach((def) => register(def));
  if (table && typeof window.lumiPuffleSortKeys === 'function') window.LUMI_PUFFLE_VARIANT_KEYS = window.lumiPuffleSortKeys();
})();
