/* Signature looks for the Puffle Collection's 91 styles.

   Painted atlas frames and the procedural sprite share one puffle silhouette, so
   a collection style otherwise reads only as a colour swap. This module gives
   every style a headpiece and aura chosen from the chart — mushroom caps,
   petals, crystal shards, halos, horns, crowns, storms, stars, shells and the
   rest — plus a small element badge, varied per style by a stable hash.

   Everything is drawn in the sprite's 120x120 space, so the same markup works
   in spriteSVG and in the painted sheet's wear layer. */

(function registerPuffleStyleArt() {
  const RULES = [
    [/mushroom|toadstool/, 'mushroom'],
    [/acorn|chestnut/, 'acorn'],
    [/blossom|petal|orchid|tulip|lily|flower|floral|bloom/, 'petal'],
    [/crystal|amethyst|prism|quartz|shard|gem|jewel/, 'crystal'],
    [/ice|frost|blizzard|arctic|snow|rime/, 'ice'],
    [/flame|fire|ember|inferno|magma|phoenix/, 'flame'],
    [/bolt|electric|spark|volt|thunder/, 'bolt'],
    [/moon|lunar|eclipse|dusk/, 'moon'],
    [/halo|angel|divine|guardian|spirit|ghost|dream|soul|saint/, 'halo'],
    [/horn|unicorn|onicorn|dragon|leviathan|serpent/, 'horn'],
    [/crown|king|queen|royal|emperor|titan|prime|infinity|deity|lord/, 'crown'],
    [/cloud|breeze|wind|zephyr|mist|storm|tempest/, 'cloud'],
    [/rainbow|aurora/, 'rainbow'],
    [/water|tide|ocean|wave|drop|dew|coral|pearl|puddle|rain/, 'drop'],
    [/leaf|sprout|forest|meadow|clover|bamboo|cactus|moss|verdant|worldtree|nature|genesis|leafing|garden/, 'leaf'],
    [/sun|solar|sunny|dawn|sunbeam|golden/, 'sun'],
    [/music|melody|resonance|sound|song|tone/, 'music'],
    [/time|chrono|clock/, 'clock'],
    [/cat|moggy|whisker|purr/, 'cat'],
    [/bunny|rabbit|hare|hopper/, 'bunny'],
    [/shell|scallop/, 'shell'],
    [/pebble|stone|stony|sand|earth|rock|terra|pataos/, 'pebble'],
    [/star|galaxy|cosmic|nebula|astral|constellation|celestial/, 'star'],
    [/shadow|void|abyss|hollow|night/, 'wisp'],
  ];

  const ELEMENT_MOTIF = {
    nature: 'leaf', fire: 'flame', water: 'drop', ice: 'ice', electric: 'bolt',
    moon: 'moon', light: 'halo', cosmic: 'star', void: 'wisp', crystal: 'crystal',
    music: 'music', time: 'clock', earth: 'pebble', wind: 'cloud',
    shadow: 'wisp', rainbow: 'rainbow', spirit: 'halo',
  };

  const AURA_MOTIFS = ['halo', 'star', 'crystal', 'rainbow', 'sun', 'moon', 'wisp', 'ice'];

  /* Zodiac headpieces. Each sign gets its own small constellation-age mark so
     the twelve zodiac breeds stay distinct without new painted atlas frames. */
  const ZODIAC_MOTIFS = {
    aries: (p) => `<path d="M54 31c-9 0-14-7-11-13 3-5 10-3 10 2 0 4-5 5-7 2M66 31c9 0 14-7 11-13-3-5-10-3-10 2 0 4 5 5 7 2" fill="none" stroke="${p.accent}" stroke-width="3.4" stroke-linecap="round"/><path d="M56 30c2-4 6-4 8 0" fill="none" stroke="${p.light}" stroke-width="1.6" stroke-linecap="round"/>`,
    taurus: (p) => `<circle cx="60" cy="24" r="10" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><circle cx="60" cy="24" r="4" fill="${p.light}"/><path d="M46 17c-6-4-9-9-7-13 6 1 10 5 12 10M74 17c6-4 9-9 7-13-6 1-10 5-12 10" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/>`,
    gemini: (p) => `<path d="M51 8v25M69 8v25M44 11h14M62 11h14M47 30h8M65 30h8" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/><circle cx="51" cy="8" r="2.4" fill="${p.light}"/><circle cx="69" cy="8" r="2.4" fill="${p.light}"/>`,
    cancer: (p) => `<circle cx="60" cy="22" r="9" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><path d="M46 16c-5-4-11-2-10 3 1 3 5 3 7 0M74 16c5-4 11-2 10 3-1 3-5 3-7 0" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/><path d="M54 20c4-2 8-2 12 0M54 25c4 2 8 2 12 0" fill="none" stroke="${p.light}" stroke-width="1.3" stroke-linecap="round"/>`,
    leo: (p) => `<circle cx="60" cy="23" r="11" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><circle cx="60" cy="23" r="6" fill="${p.light}" opacity=".55"/><path d="M43 20l-7-4 2 9M77 20l7-4-2 9" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/><path d="M60 8v4M60 34v4M45 23h4M71 23h4" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>`,
    virgo: (p) => `<path d="M60 34V8" stroke="${p.deep}" stroke-width="2.4" stroke-linecap="round"/><path d="M60 13c-6-4-12-3-14 2 6 3 11 2 14-2ZM60 18c6-4 12-3 14 2-6 3-11 2-14-2ZM60 24c-5-3-10-2-12 2 5 3 9 2 12-2ZM60 29c5-3 10-2 12 2-5 3-9 2-12-2Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/>`,
    libra: (p) => `<path d="M60 7v20M38 13h44" stroke="${p.accent}" stroke-width="2.6" stroke-linecap="round"/><path d="M38 13l-7 13h14ZM82 13l-7 13h14Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/><circle cx="60" cy="7" r="2.6" fill="${p.light}"/>`,
    scorpio: (p) => `<path d="M42 30c0-11 8-18 18-18 8 0 14 4 16 10 2 5-1 9-6 8-3-1-4-4-2-6M72 21l8 2-5 7" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 30l-5 4M50 32l-2 5M58 33l1 5" stroke="${p.deep}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>`,
    sagittarius: (p) => `<path d="M44 8c-8 8-8 20 0 28" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/><path d="M40 22h34" stroke="${p.light}" stroke-width="2.4" stroke-linecap="round"/><path d="M74 22l-8-5v10Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1" stroke-linejoin="round"/><path d="M48 22h8" stroke="${p.deep}" stroke-width="1.4" opacity=".5"/>`,
    capricorn: (p) => `<path d="M44 26c-7-7-7-16 0-20 5-3 10 1 8 6-1 3-5 3-6 0" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/><path d="M61 14l13 7-13 7 3-7Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M80 15c6 4 6 10 0 14M84 18c4 3 4 7 0 9" fill="none" stroke="${p.accent}" stroke-width="2.2" stroke-linecap="round"/>`,
    aquarius: (p) => `<path d="M50 7h20l-4 11H54Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M55 10h10" stroke="${p.accent}" stroke-width="2"/><path d="M54 18c-4 4-7 8-8 14M66 18c4 4 7 8 8 14" fill="none" stroke="${p.accent}" stroke-width="2.6" stroke-linecap="round"/><path d="M42 31c3-2 6-2 9 0M69 31c3-2 6-2 9 0" fill="none" stroke="${p.light}" stroke-width="1.6" stroke-linecap="round"/>`,
    pisces: (p) => `<path d="M38 16c8-6 16-5 22 2-7 5-15 4-22-2ZM82 28c-8-6-16-5-22 2 7 5 15 4 22-2Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M38 16l-7-5 1 9ZM82 28l7 5-1-9" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/><circle cx="52" cy="16" r="1.4" fill="${p.deep}"/><circle cx="68" cy="28" r="1.4" fill="${p.deep}"/><path d="M60 19v6" stroke="${p.light}" stroke-width="1.4" stroke-dasharray="2 3"/>`,
  };

  function table() {
    return typeof window !== 'undefined' ? window.LUMI_PUFFLE_VARIANTS : null;
  }

  function hashOf(text) {
    let h = 2166136261;
    const s = String(text || '');
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function motifOf(styleKey, element) {
    const all = table();
    const meta = (all && all[styleKey]) || {};
    /* A style can pin its motif when its name is ambiguous (Storm Puffle must
       read as lightning, not the cloud rule that also matches "storm"). */
    if (meta.motif) return meta.motif;
    const hay = `${styleKey || ''} ${meta.name || ''}`.toLowerCase();
    for (let i = 0; i < RULES.length; i += 1) if (RULES[i][0].test(hay)) return RULES[i][1];
    return ELEMENT_MOTIF[String(element || '').toLowerCase()] || 'star';
  }

  function paletteOf(p) {
    const base = p || {};
    return {
      body: base.body || '#9FD8C4',
      light: base.light || '#E8FFF8',
      deep: base.deep || '#2F5C4C',
      accent: base.accent || base.gold || '#FFD166',
    };
  }

  function frontFor(motif, p, v, seed, bands) {
    if (motif.indexOf('zodiac-') === 0) {
      const mark = ZODIAC_MOTIFS[motif.slice(7)];
      return `<circle cx="60" cy="22" r="16" fill="${p.light}" opacity=".18"/>${mark ? mark(p) : ''}`;
    }
    if (motif === 'mushroom') {
      return `<path d="M34 30c0-13 11-21 26-21s26 8 26 21c0 4-3 6-7 6H41c-4 0-7-2-7-6Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><ellipse cx="48" cy="23" rx="4.4" ry="3" fill="${p.light}" opacity=".85"/><ellipse cx="66" cy="20" rx="3.2" ry="2.4" fill="${p.light}" opacity=".7"/><ellipse cx="73" cy="27" rx="2.6" ry="2" fill="${p.light}" opacity=".6"/><rect x="55" y="32" width="10" height="9" rx="4.5" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/>`;
    }
    if (motif === 'acorn') {
      return `<path d="M40 26c0-9 9-15 20-15s20 6 20 15c0 3-3 5-7 5H47c-4 0-7-2-7-5Z" fill="${p.deep}" stroke="${p.deep}" stroke-width="1"/><path d="M48 30h24l-3 6H51Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/><path d="M60 11v6" stroke="${p.deep}" stroke-width="2.4" stroke-linecap="round"/><path d="M45 22c5-3 10-4 15-4s10 1 15 4" stroke="${p.light}" stroke-width="1.2" fill="none" opacity=".55"/>`;
    }
    if (motif === 'petal') {
      const n = 5 + (v % 2);
      let petals = '';
      for (let i = 0; i < n; i += 1) {
        const angle = (360 / n) * i + v * 6;
        petals += `<ellipse cx="60" cy="18" rx="5.6" ry="9.2" fill="${i % 2 ? p.light : p.accent}" stroke="${p.deep}" stroke-width=".9" transform="rotate(${angle} 60 27)" opacity=".96"/>`;
      }
      return `${petals}<circle cx="60" cy="27" r="4.4" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/>`;
    }
    if (motif === 'crystal') {
      const lift = v * 1.4;
      return `<path d="M60 ${6 - lift}l8 18-8 6-8-6Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M46 14l6 13-6 4-6-4Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M74 16l6 12-6 4-6-4Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M60 ${10 - lift}l5 12-5 4-5-4Z" fill="${p.light}" opacity=".7"/>`;
    }
    if (motif === 'ice') {
      return `<path d="M46 10l5 20-5 4-5-4Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M60 6l6 24-6 5-6-5Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M74 12l4 18-4 4-5-4Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><circle cx="44" cy="22" r="1.4" fill="${p.accent}"/><circle cx="77" cy="26" r="1.1" fill="${p.accent}"/>`;
    }
    if (motif === 'flame') {
      return `<path d="M60 33c-10-5-12-15-6-24 1 7 4 9 6 10 0-7 2-12 7-17 0 9 9 13 9 21 0 6-7 11-16 10Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><path d="M60 32c-5-2-6-9-3-13 0 4 2 5 3 6 1-3 3-6 4-7 0 5 4 8 4 12 0 2-4 4-8 2Z" fill="${p.light}"/>`;
    }
    if (motif === 'bolt') {
      return `<path d="M63 5L47 25h9l-4 14 17-20h-9Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M61 10l-8 11h5l-2 7 8-10h-5Z" fill="${p.light}" opacity=".75"/>`;
    }
    if (motif === 'moon') {
      return `<path d="M69 9c-10 2-16 11-14 20 2 9 11 14 20 12-8-5-11-14-8-22 1-4 3-7 5-10Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1"/><path d="M49 18l1.8 4.4 4.6.5-3.5 3.3.9 4.6-3.8-2.4-3.8 2.4.9-4.6-3.5-3.3 4.6-.5Z" fill="${p.light}"/>`;
    }
    if (motif === 'halo') {
      return `<ellipse cx="60" cy="11" rx="19" ry="6" fill="none" stroke="${p.accent}" stroke-width="3.2"/><ellipse cx="60" cy="11" rx="19" ry="6" fill="none" stroke="${p.light}" stroke-width="1" opacity=".9"/><circle cx="60" cy="10" r="1.8" fill="${p.light}"/>`;
    }
    if (motif === 'horn') {
      return `<path d="M60 5c6 7 9 16 7 24-1 3-4 4-7 4s-6-1-7-4c-2-8 1-17 7-24Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1"/><path d="M53 18c4 1 10 1 14 0M55 24c3 1 7 1 10 0" stroke="${p.deep}" stroke-width="1" opacity=".4" fill="none"/>`;
    }
    if (motif === 'crown') {
      return `<path d="M39 31l4-15 9 8 8-13 8 13 9-8 4 15Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="60" cy="20" r="2.6" fill="${p.light}"/><circle cx="48" cy="25" r="1.8" fill="${p.light}"/><circle cx="72" cy="25" r="1.8" fill="${p.light}"/>`;
    }
    if (motif === 'cloud') {
      return `<g fill="${p.light}" stroke="${p.deep}" stroke-width="1"><circle cx="48" cy="27" r="8"/><circle cx="61" cy="21" r="10"/><circle cx="74" cy="27" r="7"/></g><path d="M40 33h40" stroke="${p.deep}" stroke-width="1" opacity=".3"/>`;
    }
    if (motif === 'rainbow') {
      const colors = Array.isArray(bands) && bands.length ? bands : [p.accent, p.light, p.deep];
      return `<g fill="none" stroke-linecap="round">${colors.map((color, i) => `<path d="M${36 + i * 3} 33c${4 - i} -${16 - i * 2} ${14 - i * 2} -${25 - i * 3} ${24 - i * 4} -${25 - i * 3}s${20 - i * 3} ${9 - i} ${24 - i * 4} ${25 - i * 3}" stroke="${color}" stroke-width="${(4.4 - i * 0.55).toFixed(2)}" opacity=".95"/>`).join('')}</g>`;
    }
    if (motif === 'propeller') {
      return `<g stroke-linejoin="round"><path d="M38 31c0-10 10-16 22-16s22 6 22 16Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><path d="M32 31h56" stroke="${p.deep}" stroke-width="2.2" stroke-linecap="round"/><rect x="58" y="5" width="4" height="11" rx="2" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/><path d="M34 10c8-5 17-6 23-1M66 9c6-5 15-4 21 1" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1"/><circle cx="60" cy="10" r="2.8" fill="${p.deep}"/></g>`;
    }
    if (motif === 'pirate') {
      return `<g stroke-linejoin="round"><path d="M31 31c4-14 14-21 29-21s25 7 29 21c-9-5-19-7-29-7s-20 2-29 7Z" fill="${p.deep}" stroke="${p.deep}" stroke-width="1.2"/><path d="M39 29c8-10 34-10 42 0" fill="none" stroke="${p.accent}" stroke-width="2"/><circle cx="60" cy="20" r="4.2" fill="${p.light}" opacity=".9"/><path d="M57 19h1.6M61.4 19h1.6M58 23c1.2.8 2.8.8 4 0" stroke="${p.deep}" stroke-width="1.1" stroke-linecap="round" fill="none"/></g>`;
    }
    if (motif === 'bow') {
      return `<g stroke-linejoin="round"><path d="M56 26c-9-8-19-7-19 2 0 8 10 9 20 2Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1"/><path d="M64 26c9-8 19-7 19 2 0 8-10 9-20 2Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1"/><path d="M43 22c4-1 8 1 12 5M77 22c-4-1-8 1-12 5" stroke="${p.light}" stroke-width="1.2" fill="none" opacity=".8"/><circle cx="60" cy="28" r="4.6" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1"/></g>`;
    }
    if (motif === 'beret') {
      return `<g stroke-linejoin="round"><ellipse cx="57" cy="24" rx="23" ry="9" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2" transform="rotate(-10 57 24)"/><path d="M37 28c10-3 31-3 41 1" fill="none" stroke="${p.deep}" stroke-width="1.5" stroke-linecap="round" opacity=".55"/><path d="M57 15c2-4 5-5 8-4" fill="none" stroke="${p.deep}" stroke-width="2" stroke-linecap="round"/><circle cx="56" cy="16" r="2.3" fill="${p.light}"/></g>`;
    }
    if (motif === 'clover') {
      return `<g stroke-linejoin="round"><path d="M60 34c0-5 0-9 1-13" fill="none" stroke="${p.deep}" stroke-width="2.2" stroke-linecap="round"/><g fill="${p.accent}" stroke="${p.deep}" stroke-width="1"><circle cx="53" cy="16" r="6.4"/><circle cx="67" cy="16" r="6.4"/><circle cx="53" cy="27" r="6.4"/><circle cx="67" cy="27" r="6.4"/></g><circle cx="60" cy="22" r="3.6" fill="${p.light}" stroke="${p.deep}" stroke-width=".9"/></g>`;
    }
    if (motif === 'goggles') {
      return `<g><path d="M34 25h10M76 25h10" stroke="${p.deep}" stroke-width="4.4" stroke-linecap="round"/><circle cx="48" cy="25" r="8.4" fill="${p.light}" fill-opacity=".38" stroke="${p.deep}" stroke-width="2.2"/><circle cx="72" cy="25" r="8.4" fill="${p.light}" fill-opacity=".38" stroke="${p.deep}" stroke-width="2.2"/><path d="M56.4 25h7.2" stroke="${p.deep}" stroke-width="2.2" stroke-linecap="round"/><circle cx="48" cy="25" r="3.2" fill="${p.accent}" opacity=".7"/><circle cx="72" cy="25" r="3.2" fill="${p.accent}" opacity=".7"/></g>`;
    }
    if (motif === 'orange') {
      return `<g stroke-linejoin="round"><circle cx="60" cy="21" r="13" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><circle cx="60" cy="21" r="9.6" fill="${p.light}" opacity=".9"/><path d="M60 11.4v19.2M50.4 21h19.2M53.2 14.2l13.6 13.6M66.8 14.2 53.2 27.8" stroke="${p.accent}" stroke-width="1.1" opacity=".75"/><circle cx="60" cy="21" r="2.6" fill="${p.light}"/><path d="M68 9c4-5 9-5 12-1-3 5-8 6-12 1Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".9"/></g>`;
    }
    if (motif === 'drop') {
      return `<path d="M60 7c6 8 10 14 10 19a10 10 0 0 1-20 0c0-5 4-11 10-19Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><path d="M60 14c3 4 5 8 4 11" stroke="${p.light}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M42 34c6 2 30 2 36 0" stroke="${p.deep}" opacity=".25" fill="none"/>`;
    }
    if (motif === 'leaf') {
      return `<path d="M60 34c0-9 0-15 2-21" stroke="${p.deep}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M62 16c6-8 16-6 18 3-8 4-15 3-18-3Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/><path d="M60 24c-7-6-16-3-17 6 8 3 14 0 17-6Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1"/>`;
    }
    if (motif === 'sun') {
      let rays = '';
      for (let i = 0; i < 8; i += 1) {
        const angle = i * 45;
        rays += `<rect x="59" y="6" width="2" height="6" rx="1" fill="${p.accent}" transform="rotate(${angle} 60 24)" opacity=".9"/>`;
      }
      return `${rays}<circle cx="60" cy="24" r="10" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.2"/><circle cx="60" cy="24" r="5" fill="${p.light}"/>`;
    }
    if (motif === 'music') {
      return `<ellipse cx="52" cy="30" rx="6" ry="4.6" fill="${p.accent}" stroke="${p.deep}" stroke-width="1" transform="rotate(-18 52 30)"/><rect x="56.4" y="10" width="2.8" height="19" rx="1.4" fill="${p.deep}"/><path d="M59 10c6-2 11 0 10 6" stroke="${p.deep}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    if (motif === 'clock') {
      return `<circle cx="60" cy="22" r="12" fill="${p.light}" stroke="${p.deep}" stroke-width="1.4"/><path d="M60 22V14M60 22l6 4" stroke="${p.deep}" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="60" cy="22" r="1.8" fill="${p.accent}"/>`;
    }
    if (motif === 'cat') {
      return `<path d="M35 32l4-15 11 8Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/><path d="M85 32l-4-15-11 8Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/><path d="M38 25l2-6 4 3Z" fill="${p.light}" opacity=".55"/><path d="M82 25l-2-6-4 3Z" fill="${p.light}" opacity=".55"/>`;
    }
    if (motif === 'bunny') {
      return `<ellipse cx="50" cy="16" rx="5.5" ry="15" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" transform="rotate(-8 50 16)"/><ellipse cx="70" cy="16" rx="5.5" ry="15" fill="${p.light}" stroke="${p.deep}" stroke-width="1.1" transform="rotate(8 70 16)"/><ellipse cx="50" cy="17" rx="2.4" ry="9" fill="${p.accent}" opacity=".35"/><ellipse cx="70" cy="17" rx="2.4" ry="9" fill="${p.accent}" opacity=".35"/>`;
    }
    if (motif === 'shell') {
      return `<path d="M42 30c0-11 8-19 18-19s18 8 18 19c0 4-8 6-18 6s-18-2-18-6Z" fill="${p.light}" stroke="${p.deep}" stroke-width="1.2"/><path d="M60 12v23M52 14l4 21M68 14l-4 21" stroke="${p.deep}" stroke-width="1" opacity=".35"/>`;
    }
    if (motif === 'pebble') {
      return `<path d="M39 30c0-8 9-13 21-13s21 5 21 13c0 4-5 6-11 6H50c-6 0-11-2-11-6Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1"/><circle cx="53" cy="24" r="2.2" fill="${p.light}"/><circle cx="67" cy="27" r="1.6" fill="${p.light}"/><path d="M46 33c4-2 24-2 28 0" stroke="${p.deep}" opacity=".3" fill="none"/>`;
    }
    if (motif === 'wisp') {
      return `<g fill="none" stroke="${p.accent}" stroke-width="2.4" stroke-linecap="round" opacity=".7"><path d="M42 36c-6-7-3-15 3-18"/><path d="M78 38c6-8 2-16-4-19"/></g><circle cx="60" cy="12" r="3" fill="${p.light}"/>`;
    }
    if (motif === 'star') {
      return `<path d="M60 4l3.8 9.4 10.2.8-7.8 6.6 2.4 10-8.6-5.6-8.6 5.6 2.4-10-7.8-6.6 10.2-.8Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1.1" stroke-linejoin="round"/><ellipse cx="60" cy="18" rx="26" ry="9" fill="none" stroke="${p.light}" stroke-width="1.4" opacity=".65" transform="rotate(${-12 + v * 4} 60 18)"/>`;
    }
    return `<path d="M60 6l2.4 6 6 .6-4.6 3.9 1.4 6-5.2-3.4-5.2 3.4 1.4-6L51.6 12.6l6-.6Z" fill="${p.accent}" stroke="${p.deep}" stroke-width="1"/>`;
  }

  function badgeOf(element, p, seed) {
    const key = String(element || '').toLowerCase();
    const glyphs = {
      nature: `<path d="M0 2c5-6 12-4 13 3-6 3-11 1-13-3Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".8"/>`,
      fire: `<path d="M6 -8c3 4 1 6 3 8 2-2 2-4 2-4 2 4 2 8-2 9-4 1-7-2-6-6 0-2 1-4 3-7Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".6"/>`,
      water: `<path d="M6 -8c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".7"/>`,
      ice: `<g stroke="${p.light}" stroke-width="1.3" stroke-linecap="round"><path d="M6 -7v14M0 -4l12 8M12 -4L0 4"/></g>`,
      electric: `<path d="M8 -9L1 2h5l-2 7 8-10H7Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".6"/>`,
      moon: `<path d="M10 -7c-6 1-9 6-7 11 1 5 6 7 11 6-4-3-6-7-4-12 0-2 0-3 0-5Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".6"/>`,
      light: `<path d="M6 -9l1.8 5.4L13 -2l-5.2 2L6 5 4.2 0 0 -2l5.2-1.6Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".6"/>`,
      cosmic: `<path d="M6 -8l1.6 4.4L12 -3l-4.4 1.6L6 3 4.4 -1.4 0 -3l4.4-.6Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".6"/>`,
      void: `<circle cx="6" cy="-2" r="5" fill="${p.deep}"/><circle cx="4" cy="-4" r="2" fill="${p.accent}" opacity=".5"/>`,
      crystal: `<path d="M6 -9l4 8-4 4-4-4Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".7"/>`,
      music: `<ellipse cx="2" cy="4" rx="3.4" ry="2.6" fill="${p.accent}" stroke="${p.deep}" stroke-width=".6"/><rect x="4.6" y="-8" width="1.6" height="12" fill="${p.deep}"/>`,
      time: `<circle cx="6" cy="-2" r="5.4" fill="${p.light}" stroke="${p.deep}" stroke-width=".8"/><path d="M6 -2v-3M6 -2l2 2" stroke="${p.deep}" stroke-width="1"/>`,
      earth: `<path d="M1 -3c0-4 3-6 6-6s6 2 6 6c0 2-2 3-5 3H5c-2 0-4-1-4-3Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".7"/>`,
      wind: `<g fill="none" stroke="${p.light}" stroke-width="1.4" stroke-linecap="round"><path d="M0 -2h8c3 0 3-3 0-3"/><path d="M0 3h10c4 0 4 4 0 4"/></g>`,
      shadow: `<path d="M10 -7c-6 1-9 6-7 11 1 5 6 7 11 6-4-3-6-7-4-12 0-2 0-3 0-5Z" fill="${p.deep}" stroke="${p.accent}" stroke-width=".5"/>`,
      rainbow: `<g fill="none" stroke-linecap="round"><path d="M0 4c1-6 5-9 6-9s5 3 6 9" stroke="${p.accent}" stroke-width="1.6"/><path d="M2 4c1-4 3-6 4-6s3 2 4 6" stroke="${p.light}" stroke-width="1.3"/></g>`,
      spirit: `<circle cx="6" cy="-2" r="3.4" fill="${p.light}" opacity=".8"/><circle cx="6" cy="-2" r="6" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".5"/>`,
      classic: `<path d="M6 4C2 1 0-1 0-4c0-4 5-5 6-1 1-4 6-3 6 1 0 3-2 5-6 8Z" fill="${p.light}" stroke="${p.deep}" stroke-width=".8"/>`,
      penguin: `<ellipse cx="6" cy="0" rx="4.4" ry="5.4" fill="${p.light}" stroke="${p.deep}" stroke-width=".8"/><ellipse cx="6" cy="-2.2" rx="2.5" ry="2.9" fill="${p.deep}"/><circle cx="5" cy="-2.7" r=".65" fill="${p.light}"/><circle cx="7" cy="-2.7" r=".65" fill="${p.light}"/><path d="M4.4 1.5h3.2L6 3Z" fill="${p.accent}" stroke="${p.deep}" stroke-width=".5"/>`,
    };
    const glyph = glyphs[key] || glyphs.light;
    const x = 92 + ((seed >>> 9) % 6);
    const y = 40 + ((seed >>> 13) % 10);
    const rot = (seed >>> 4) % 24 - 12;
    return `<g class="puffle-style-badge puffle-style-badge-${key || 'element'}" transform="translate(${x} ${y}) rotate(${rot}) scale(.62)" opacity=".95">${glyph}</g>`;
  }

  function backFor(motif, p, v, seed, dx) {
    const sparkles = [0, 1, 2].map((i) => {
      const x = 22 + ((seed >>> (i * 5 + 2)) % 76);
      const y = 8 + ((seed >>> (i * 7 + 3)) % 26);
      const r = 1.1 + ((seed >>> (i * 3)) % 3) * 0.4;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.light}" opacity=".7"/>`;
    }).join('');
    if (AURA_MOTIFS.indexOf(motif) >= 0) {
      const dash = motif === 'wisp' ? '3 7' : '4 6';
      return `<g class="puffle-style-aura" pointer-events="none" transform="translate(${dx} 0)"><ellipse cx="60" cy="62" rx="${43 + (v % 3)}" ry="${45 + (v % 4)}" fill="none" stroke="${p.accent}" stroke-width="1.6" stroke-dasharray="${dash}" opacity=".32"/>${sparkles}</g>`;
    }
    if (motif.indexOf('zodiac-') === 0) {
      return `<g class="puffle-style-aura puffle-style-zodiac" pointer-events="none" transform="translate(${dx} 0)"><ellipse cx="60" cy="62" rx="${43 + (v % 3)}" ry="${45 + (v % 4)}" fill="none" stroke="${p.accent}" stroke-width="1.4" stroke-dasharray="2 6" opacity=".38"/>${sparkles}</g>`;
    }
    if (motif === 'flame') {
      return `<g class="puffle-style-aura" pointer-events="none" transform="translate(${dx} 0)"><ellipse cx="60" cy="52" rx="34" ry="24" fill="${p.accent}" opacity=".16"/><ellipse cx="60" cy="92" rx="26" ry="6" fill="${p.accent}" opacity=".12"/>${sparkles}</g>`;
    }
    if (motif === 'leaf' || motif === 'petal' || motif === 'clover' || motif === 'orange' || motif === 'beret') {
      return `<g class="puffle-style-aura" pointer-events="none" transform="translate(${dx} 0)"><path d="M26 44c-6-4-6-10 0-13 4 4 4 9 0 13Z" fill="${p.light}" opacity=".55"/><path d="M95 58c6-4 6-10 0-13-4 4-4 9 0 13Z" fill="${p.light}" opacity=".45"/>${sparkles}</g>`;
    }
    return `<g class="puffle-style-aura" pointer-events="none" transform="translate(${dx} 0)">${sparkles}</g>`;
  }

  window.puffleStyleMotifOf = motifOf;

  window.puffleStyleArt = function puffleStyleArt(styleKey, palette, opts) {
    const options = opts || {};
    const p = paletteOf(palette);
    const element = String(options.element || '').toLowerCase();
    const motif = motifOf(styleKey, element);
    const meta = (table() && table()[styleKey]) || {};
    const bands = Array.isArray(meta.bands) ? meta.bands : null;
    const seed = hashOf(String(styleKey || motif));
    const v = seed % 5;
    const tilt = ((seed >>> 3) % 11) - 5;
    const scale = (0.92 + ((seed >>> 7) % 9) / 100).toFixed(2);
    const dx = options.view === 'side' ? 7 : 0;
    const head = `translate(60 26) rotate(${tilt}) scale(${scale}) translate(-60 -26)`;
    const front = `<g class="puffle-style puffle-style-${motif}" data-puffle-motif="${motif}" pointer-events="none" transform="translate(${dx} 0)"><g transform="${head}">${frontFor(motif, p, v, seed, bands)}${badgeOf(element, p, seed)}</g></g>`;
    return { motif, front, back: backFor(motif, p, v, seed, dx) };
  };
})();
