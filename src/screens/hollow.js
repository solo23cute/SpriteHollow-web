/* The Hollow: a living room for your whole collection. */

function buildSceneDecor(scene) {
  const el = (cls, style = '') => `<span class="${cls}" style="${style}"></span>`;
  const sceneMeta = SCENES[scene];
  if (sceneMeta?.custom) {
    const motes = Array.from({ length: 12 }, (_, i) => `<span class="biome-mote" style="left:${rand(4, 96)}%;top:${rand(18, 80)}%;animation-delay:${rand(0, 5)}s;color:${sceneMeta.accent}">${sceneMeta.emoji}</span>`).join('');
    return `<span class="sun" style="background:radial-gradient(circle, #fff8dc, ${sceneMeta.accent} 62%, transparent 72%);box-shadow:0 0 54px ${sceneMeta.accent}77"></span>
      <span class="hill h1" style="background:${sceneMeta.sky};opacity:.8"></span>
      <span class="hill h2" style="background:${sceneMeta.accent};opacity:.35"></span>
      <span class="ground" style="background:radial-gradient(120% 100% at 50% 0%, ${sceneMeta.ground}, ${sceneMeta.sky} 90%)"></span>
      ${motes}`;
  }
  if (sceneMeta?.biome) {
    const tint = sceneTint(scene);
    const palette = PDX_TYPES[sceneMeta.type] || { light: tint.b3, primary: tint.b1, deep: tint.b2 };
    const motes = Array.from({ length: 12 }, () => `<span class="biome-mote" style="left:${rand(4, 96)}%;top:${rand(18, 78)}%;animation-delay:${rand(0, 5)}s;color:${palette.light}">${sceneMeta.emoji}</span>`).join('');
    return `<span class="sun" style="background:radial-gradient(circle, ${palette.light}, ${palette.primary} 62%, transparent 72%);box-shadow:0 0 54px ${palette.primary}77"></span>
      <span class="hill h1" style="background:${palette.deep};opacity:.7"></span><span class="hill h2" style="background:${palette.primary};opacity:.45"></span><span class="ground" style="background:${palette.deep}"></span>
      ${motes}`;
  }
  if (sceneMeta?.exoticBiome || sceneMeta?.gtaBiome || sceneMeta?.extraBiome) {
    const tint = sceneTint(scene);
    const motes = Array.from({ length: 12 }, () => `<span class="biome-mote" style="left:${rand(4, 96)}%;top:${rand(18, 78)}%;animation-delay:${rand(0, 5)}s;color:${tint.b3}">${sceneMeta.emoji}</span>`).join('');
    return `<span class="sun" style="background:radial-gradient(circle, ${tint.b3}, ${tint.b1} 62%, transparent 72%);box-shadow:0 0 54px ${tint.b1}77"></span>
      <span class="hill h1" style="background:${tint.b2};opacity:.75"></span><span class="hill h2" style="background:${tint.b1};opacity:.5"></span><span class="ground" style="background:${tint.b2}"></span>
      ${motes}${typeof buildBiomeExtras === 'function' ? buildBiomeExtras(scene) : ''}`;
  }
  if (scene === 'night' || scene === 'neon') {
    const stars = Array.from({ length: 16 }, () => el('star', `left:${rand(3, 97)}%;top:${rand(4, 48)}%;animation-delay:${rand(0, 4)}s;opacity:${rand(0.3, 0.9)}`)).join('');
    return `${el('sun')}${stars}<span class="hill h1"></span><span class="hill h2"></span><span class="ground"></span>
      ${scene === 'neon' ? '<span class="grid-floor"></span>' : ''}
      ${Array.from({ length: 5 }, () => el('firefly', `left:${rand(6, 94)}%;top:${rand(40, 88)}%;animation-delay:${rand(0, 4)}s`)).join('')}`;
  }
  if (scene === 'aurora') {
    const stars = Array.from({ length: 20 }, () => el('star', `left:${rand(3, 97)}%;top:${rand(3, 50)}%;animation-delay:${rand(0, 4)}s;opacity:${rand(0.3, 0.9)}`)).join('');
    return `${el('sun')}${stars}
      <span class="aurora-ribbon a1"></span><span class="aurora-ribbon a2"></span>
      <span class="hill h1" style="background:#4f7fa3;opacity:.65"></span><span class="hill h2" style="background:#6d8fb5;opacity:.5"></span><span class="ground"></span>
      ${Array.from({ length: 5 }, () => el('firefly', `left:${rand(6, 94)}%;top:${rand(42, 84)}%;animation-delay:${rand(0, 4)}s`)).join('')}`;
  }
  if (scene === 'crystal') {
    const shards = Array.from({ length: 8 }, (_, i) => `<span class="crystal-shard" style="left:${8 + i * 12}%;bottom:${8 + rand(0, 8)}%;height:${rand(18, 52)}px;animation-delay:${rand(0, 3)}s"></span>`).join('');
    return `${el('sun')}<span class="hill h1" style="background:#4b3b70;opacity:.7"></span><span class="hill h2" style="background:#3d315f;opacity:.6"></span><span class="ground"></span>
      ${shards}
      ${Array.from({ length: 8 }, () => el('firefly', `left:${rand(5, 95)}%;top:${rand(30, 80)}%;animation-delay:${rand(0, 4)}s`)).join('')}`;
  }
  if (scene === 'ember') {
    const sparks = Array.from({ length: 14 }, () => el('ember-spark', `left:${rand(4, 96)}%;bottom:${rand(8, 46)}%;animation-delay:${rand(-4, 0)}s;animation-duration:${rand(2.4, 5)}s`)).join('');
    return `${el('sun')}<span class="hill h1" style="background:#5a241e;opacity:.8"></span><span class="hill h2" style="background:#43191a;opacity:.7"></span><span class="ground"></span>${sparks}`;
  }
  if (scene === 'sugar') {
    const candies = Array.from({ length: 12 }, (_, i) => el('candy-dot', `left:${5 + i * 8}%;bottom:${rand(8, 30)}%;width:${rand(8, 16)}px;height:${rand(8, 16)}px;background:${['#ff8fb2', '#8fe07a', BRAND.gold, '#8be9ff'][i % 4]};animation-delay:${rand(0, 3)}s`)).join('');
    return `${el('sun')}<span class="hill h1" style="background:#f4a6c8;opacity:.8"></span><span class="hill h2" style="background:#d98bb5;opacity:.7"></span><span class="ground"></span>${candies}`;
  }
  if (scene === 'dream') {
    const clouds = Array.from({ length: 5 }, () => el('dream-puff', `left:${rand(4, 86)}%;top:${rand(20, 52)}%;width:${rand(38, 78)}px;opacity:${rand(0.18, 0.38)};animation-delay:${rand(-8, 0)}s`)).join('');
    const stars = Array.from({ length: 10 }, () => el('star', `left:${rand(4, 96)}%;top:${rand(6, 36)}%;animation-delay:${rand(0, 4)}s`)).join('');
    return `${el('sun')}${stars}${clouds}<span class="hill h1" style="background:#5b4d9c;opacity:.65"></span><span class="hill h2" style="background:#43397e;opacity:.6"></span><span class="ground"></span>`;
  }
  if (scene === 'tide') {
    return `${el('sun')}<span class="hill h1" style="background:#7fc7a3;opacity:.5"></span><span class="hill h2" style="background:#6bb69a;opacity:.4"></span>
      <span class="wave" style="top:52%;animation:floaty 5s ease-in-out infinite"></span>
      <span class="wave" style="top:57%;opacity:.6"></span>
      <span class="ground"></span>
      <span class="mushroom" style="left:12%;bottom:10%;background:#ffd6a5"></span>
      <span class="mushroom" style="left:80%;bottom:16%;width:12px;height:10px;background:#ffb3d9"></span>
      <span class="firefly" style="left:70%;top:44%"></span>`;
  }
  /* The Grove habitat's sky is the one that loaded it: the splash and the
     loading card draw their treeline from titleScreenScene.grove, so the stage
     paints that same exported string instead of a second drawing. It goes in
     after the ground and before the actors — the scene's own floor, then the
     treeline, then the sprites the player walks in front of it. */
  const groveArt = scene === 'grove' && typeof window !== 'undefined'
    && window.titleScreenScene && window.titleScreenScene.grove
    ? window.titleScreenScene.grove : '';
  return `${el('sun')}<span class="hill h1"></span><span class="hill h2"></span><span class="ground"></span>
    ${groveArt ? `<span class="stage-grove" aria-hidden="true">${groveArt}</span>` : ''}
    ${Array.from({ length: 6 }, () => el('firefly', `left:${rand(5, 95)}%;top:${rand(40, 84)}%;animation-delay:${rand(0, 4)}s`)).join('')}
    <span class="mushroom" style="left:9%;bottom:9%"></span>
    <span class="mushroom" style="left:84%;bottom:14%;background:var(--gold)"></span>
    <span class="mushroom" style="left:72%;bottom:6%;width:11px;height:9px;background:#b79cff"></span>`;
}

/* Weather particles layered over the scene, under the sprites. */
function buildWeatherFx(key) {
  const span = (cls, style, text = '') => `<span class="${cls}" style="${style}">${text}</span>`;
  const many = (count, build) => Array.from({ length: count }, (_, i) => build(i)).join('');
  const flakes = (count, durationMin, durationMax, delayMin, delayMax, driftMin, driftMax) => many(count,
    () => span('flake', `left:${rand(0, 100)}%;width:${rand(2, 5)}px;height:${rand(2, 5)}px;animation-duration:${rand(durationMin, durationMax)}s;animation-delay:${rand(delayMin, delayMax)}s;--drift:${rand(driftMin, driftMax)}px;opacity:${rand(0.45, 0.95)}`));
  const raindrops = (count, cls, durationMin, durationMax, delayMin, delayMax, opacityMin, opacityMax) => many(count,
    () => span(cls, `left:${rand(0, 100)}%;animation-duration:${rand(durationMin, durationMax)}s;animation-delay:${rand(delayMin, delayMax)}s;opacity:${rand(opacityMin, opacityMax)}`));
  const stars = (count, topMax, opacityMin, opacityMax) => many(count,
    () => span('celestial-star', `left:${rand(2, 98)}%;top:${rand(2, topMax)}%;animation-delay:${rand(0, 5)}s;opacity:${rand(opacityMin, opacityMax)}`));
  switch (key) {
    case 'snow':
      return flakes(30, 6, 12, -12, 0, -28, 28);
    case 'rain':
    case 'storm':
      return raindrops(26, 'raindrop', 0.55, 1.1, -1.2, 0, 0.35, 0.75)
        + (key === 'storm' ? '<span class="storm-flash"></span>' : '');
    case 'petals':
      return many(14, () => span('petal', `left:${rand(0, 100)}%;animation-duration:${rand(7, 13)}s;animation-delay:${rand(-13, 0)}s;--drift:${rand(-50, 50)}px`, '🌸'));
    case 'leaves':
      return many(14, () => span('petal leaf', `left:${rand(0, 100)}%;animation-duration:${rand(7, 14)}s;animation-delay:${rand(-14, 0)}s;--drift:${rand(-60, 60)}px`, '🍂'));
    case 'fog':
      return many(5, () => span('fog-band', `top:${rand(20, 72)}%;animation-duration:${rand(16, 28)}s;animation-delay:${rand(-20, 0)}s;opacity:${rand(0.22, 0.5)}`));
    case 'heat':
      return span('sun-haze', '') + many(4, () => span('heat-band', `top:${rand(30, 80)}%;animation-delay:${rand(0, 4)}s`));
    case 'frost':
      return many(12, () => span('frost-spark', `left:${rand(4, 96)}%;top:${rand(40, 92)}%;animation-delay:${rand(0, 3)}s`));
    case 'breeze':
      return many(10, () => span('breeze-dot', `left:${rand(0, 100)}%;top:${rand(20, 80)}%;animation-delay:${rand(0, 5)}s;animation-duration:${rand(4, 8)}s`));
    case 'rainbow':
      return '<span class="rainbow-arch"></span>'
        + many(10, () => span('petal', `left:${rand(0, 100)}%;animation-duration:${rand(8, 14)}s;animation-delay:${rand(-14, 0)}s;--drift:${rand(-40, 40)}px`, '🌸'))
        + many(5, () => span('butterfly', `left:${rand(6, 90)}%;top:${rand(28, 62)}%;animation-delay:${rand(0, 5)}s;animation-duration:${rand(6, 9)}s`, '🦋'));
    case 'celestial':
      return '<span class="constellation"></span>'
        + stars(22, 52, 0.4, 1)
        + many(3, (i) => span('moonbeam', `left:${12 + i * 34}%;animation-delay:${rand(0, 3)}s;opacity:${rand(0.16, 0.3)}`));
    case 'genesis':
      return '<span class="genesis-glow"></span>'
        + many(9, (i) => span('genesis-sprout', `left:${6 + i * 10}%;bottom:${rand(4, 12)}%;animation-delay:${rand(0, 2)}s`, '🌱'))
        + many(14, () => span('genesis-mote', `left:${rand(2, 98)}%;bottom:${rand(4, 60)}%;animation-delay:${rand(0, 4)}s;animation-duration:${rand(4, 8)}s`));
    case 'drizzle':
      return raindrops(16, 'raindrop drizzle-drop', 1.1, 1.9, -2, 0, 0.18, 0.42);
    case 'hail':
      return many(20, () => span('hailstone', `left:${rand(0, 100)}%;animation-duration:${rand(0.8, 1.5)}s;animation-delay:${rand(-1.5, 0)}s;--drift:${rand(-10, 10)}px`))
        + '<span class="hail-haze"></span>';
    case 'sandstorm':
      return '<span class="sand-haze"></span>'
        + many(30, () => span('sand-grain', `left:${rand(0, 100)}%;top:${rand(8, 90)}%;animation-duration:${rand(0.7, 1.8)}s;animation-delay:${rand(-2, 0)}s;opacity:${rand(0.2, 0.6)}`));
    case 'mist':
      return many(5, () => span('fog-band mist-band', `top:${rand(42, 82)}%;animation-duration:${rand(20, 34)}s;animation-delay:${rand(-24, 0)}s;opacity:${rand(0.3, 0.62)}`));
    case 'aurora':
      return many(4, (i) => span('aurora-ribbon', `left:${8 + i * 24}%;top:${rand(8, 24)}%;animation-delay:${rand(0, 4)}s;animation-duration:${rand(7, 12)}s;--hue:${[145, 175, 265, 315][i]}`))
        + stars(18, 40, 0.35, 0.95);
    case 'ashfall':
      return '<span class="ash-haze"></span>'
        + many(22, () => span('ash-fleck', `left:${rand(0, 100)}%;animation-duration:${rand(6, 12)}s;animation-delay:${rand(-12, 0)}s;--drift:${rand(-34, 34)}px;opacity:${rand(0.25, 0.7)}`));
    case 'fireflies':
      return many(18, () => span('firefly-spark', `left:${rand(2, 98)}%;top:${rand(28, 88)}%;animation-delay:${rand(0, 5)}s;animation-duration:${rand(2.8, 6)}s`));
    case 'meteor':
      return stars(16, 46, 0.35, 0.9)
        + many(7, () => span('meteor-streak', `left:${rand(6, 92)}%;top:${rand(4, 38)}%;animation-delay:${rand(0, 7)}s;animation-duration:${rand(1.4, 2.8)}s`));
    case 'sunshower':
      return '<span class="rainbow-arch"></span>'
        + raindrops(18, 'raindrop drizzle-drop', 1, 1.8, -2, 0, 0.2, 0.5)
        + many(6, () => span('breeze-dot', `left:${rand(0, 100)}%;top:${rand(20, 70)}%;animation-delay:${rand(0, 4)}s`));
    case 'thundersnow':
      return flakes(26, 5, 10, -10, 0, -24, 24)
        + '<span class="storm-flash"></span>';
    case 'blossomwind':
      return many(18, () => span('petal', `left:${rand(0, 100)}%;animation-duration:${rand(5, 10)}s;animation-delay:${rand(-10, 0)}s;--drift:${rand(-60, 60)}px`, '🌸'))
        + many(8, () => span('breeze-dot', `left:${rand(0, 100)}%;top:${rand(18, 80)}%;animation-delay:${rand(0, 5)}s;animation-duration:${rand(3, 6)}s`));
    case 'starfall':
      return stars(20, 46, 0.4, 1)
        + many(9, () => span('meteor-streak', `left:${rand(6, 92)}%;top:${rand(4, 44)}%;animation-delay:${rand(0, 8)}s;animation-duration:${rand(2, 4)}s`));
    default:
      return '';
  }
}

function currentEventPreset() {
  const key = state.world && state.world.eventPreset;
  return key && typeof EVENT_PRESETS !== 'undefined' ? EVENT_PRESETS[key] || null : null;
}

function openWeatherSheet() {
  const selected = state.world?.weather || 'auto';
  const seasonSel = state.world?.season || 'auto';
  const wx = currentWeather();
  const seasonOptions = [
    `<button class="style-opt ${seasonSel === 'auto' ? 'on' : ''}" data-season-key="auto"><span class="sw acc">🔄</span>Auto</button>`,
    ...SEASON_KEYS.map((key) => {
      const season = SEASONS[key];
      const skies = season.weather.map((k) => WEATHERS[k]).filter(Boolean);
      return `<button class="style-opt ${seasonSel === key ? 'on' : ''}" data-season-key="${key}" title="${esc(skies.map((w) => w.name).join(' · '))}"><span class="sw acc">${season.icon}</span>${season.name}${skies.length ? `<span class="tiny" style="opacity:.65;letter-spacing:1px">${skies.map((w) => w.icon).join('')}</span>` : ''}</button>`;
    }),
    `<button class="style-opt ${seasonSel === 'off' ? 'on' : ''}" data-season-key="off" title="Pause the calendar and keep a plain light"><span class="sw acc">${SEASON_OFF.icon}</span>${SEASON_OFF.name}</button>`,
  ].join('');
  /* World days are ordinary calendar observances rather than Hollow festivals:
     national days and international days with fixed dates, led by today's. */
  const worldDays = typeof upcomingObservances === 'function' ? upcomingObservances(6) : [];
  /* The shelf keeps every preset the Hollow has ever hosted. Empty slots stay
     visible so it reads as a collection rather than a list of missed names. */
  const shelfBadges = Array.isArray(state.world?.badges) ? state.world.badges : [];
  const badgeShelf = EVENT_PRESET_KEYS.map((key) => {
    const preset = EVENT_PRESETS[key];
    const entry = shelfBadges.find((badge) => badge && badge.key === key);
    const live = state.world?.eventPreset === key;
    const last = entry && entry.last ? new Date(entry.last).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    return `<div class="event-shelf-badge ${entry ? 'is-earned' : 'is-empty'}${live ? ' is-live' : ''}" style="--badge:${preset.tint};--badge2:${preset.tint2}" data-shelf-badge="${key}">
      <span class="esb-icon" aria-hidden="true">${entry ? preset.icon : '·'}</span>
      <span class="esb-copy"><b>${esc(preset.badge)}</b><small>${entry ? `${esc(preset.name)} · ${entry.count}×` : 'Not collected yet'}</small>${last ? `<small>Last seen ${esc(last)}</small>` : ''}</span>
      ${live ? '<span class="esb-live">LIVE</span>' : ''}
    </div>`;
  }).join('');
  const options = [
    `<button class="style-opt weather-off-opt ${selected === 'off' ? 'on' : ''}" data-weather-key="off"><span class="sw acc">🚫</span>Off</button>`,
    `<button class="style-opt ${selected === 'auto' ? 'on' : ''}" data-weather-key="auto"><span class="sw acc">🔄</span>Auto</button>`,
    ...WEATHER_KEYS.map((key) => {
      const weather = WEATHERS[key];
      return `<button class="style-opt ${selected === key ? 'on' : ''}" data-weather-key="${key}"><span class="sw acc">${weather.icon}</span>${weather.name}</button>`;
    }),
  ].join('');
  const { close } = openSheet({
    title: 'Hollow sky',
    sub: 'Change the season and weather for free. Auto follows the real calendar and climate.',
    body: `<div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:2px 2px 6px">SEASON</div>
      <div class="style-picker weather-picker" data-season-picker>${seasonOptions}</div>
      <p class="tiny muted" style="margin:7px 2px 12px;line-height:1.5">Manual seasons change the light, day length, and which weather Auto picks. <b style="color:var(--text)">No season</b> at the end pauses the calendar and leaves the Hollow in plain light.</p>
      <div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:2px 2px 6px">WEATHER</div>
      <div class="style-picker weather-picker">${options}</div>
      <p class="tiny muted" style="margin:7px 2px 0;line-height:1.5"><b style="color:var(--text)">Off</b> hides every weather effect and pauses weather needs modifiers, while leaving the season and climate light alone.</p>
      <div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:12px 2px 6px">EVENT PRESETS</div>
      <div class="style-picker weather-picker" data-event-picker>${EVENT_PRESET_KEYS.map((key) => {
        const preset = EVENT_PRESETS[key];
        const on = state.world?.eventPreset === key;
        return `<button class="style-opt ${on ? 'on' : ''}" data-event-preset="${key}"><span class="sw acc">${preset.icon}</span>${esc(preset.name)}</button>`;
      }).join('')}</div>
      <div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:12px 2px 6px">BADGE SHELF</div>
      <div class="event-shelf" data-event-shelf>${badgeShelf}</div>
      <p class="tiny muted" style="margin:5px 2px 10px;line-height:1.5">Badges stay on the shelf after a preset ends, so a past Prismatic, Celestial or Genesis moment is never lost.</p>
      <div class="tiny muted" style="font-weight:800;letter-spacing:.08em;margin:12px 2px 6px">WORLD DAYS</div>
      <div class="event-shelf" data-world-days>${worldDays.map((day) => {
        const when = day.days == null || day.days === 0 ? 'Today' : `${day.days} day${day.days === 1 ? '' : 's'}`;
        const live = day.days == null || day.days === 0;
        return `<div class="event-shelf-badge ${live ? 'is-live' : 'is-earned'}" style="--badge:${day.color};--badge2:${day.color}" data-world-day="${esc(day.key)}">
          <span class="esb-icon" aria-hidden="true">${day.icon}</span>
          <span class="esb-copy"><b>${esc(day.name)}</b><small>${esc(day.region || 'World')} · ${when}</small></span>
          ${live ? '<span class="esb-live">LIVE</span>' : ''}
        </div>`;
      }).join('')}</div>
      <p class="tiny muted" style="margin:5px 2px 10px;line-height:1.5">National days and international observances on fixed dates. Lunar and astronomical holidays move each year, so they keep their own festivals instead of a wrong date here.</p>
      <div class="card" style="padding:11px;margin-top:10px;font-size:11px;line-height:1.55;color:var(--muted)">
        <b style="color:var(--text)">${wx.icon} ${wx.name}</b> — ${wx.blurb}
        <div class="tiny" style="margin-top:5px">Manual weather overrides each biome's local ambience until you choose Auto.</div>
      </div>`,
    onMount: (root) => {
      root.querySelectorAll('[data-season-key]').forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.seasonKey;
          Actions.setSeason(key === 'auto' ? null : key);
          Sfx.click();
          close();
          const season = key === 'auto' ? seasonOf() : key === 'off' ? SEASON_OFF : SEASONS[key];
          toast(key === 'auto' ? 'Seasons follow the calendar again.'
            : key === 'off' ? '🚫 The calendar is paused. The Hollow keeps its even light.'
            : `${season.icon} ${season.name} — the Hollow turns to a new season.`, season.icon);
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
        });
      });
      root.querySelectorAll('[data-event-preset]').forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.eventPreset;
          const res = Actions.applyEventPreset(key);
          Sfx.click();
          close();
          if (!res.ok) { toast('That event is not available.', '✨'); Sfx.error(); return; }
          toast(`${res.preset.icon} ${res.preset.name} — ${res.preset.badge} badge on the Hollow.`, res.preset.icon);
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
        });
      });
      root.querySelectorAll('[data-weather-key]').forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.weatherKey;
          Actions.setWeather(key === 'auto' ? null : key);
          Sfx.click();
          close();
          if (key === 'off') toast('Weather effects are off. The climate and season still shape the light.', '🚫');
          else if (key === 'auto') toast('Weather is following the season again.', '🔄');
          else toast(`${WEATHERS[key].icon} ${WEATHERS[key].name} — the Hollow sky changes now.`, WEATHERS[key].icon);
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
        });
      });
    },
  });
}

function spriteSize(stage, size = 'standard') {
  const base = { baby: 132, juvenile: 146, sprite: 160, youngadult: 166, midadult: 170, highadult: 172, elder: 174, ancient: 184, sensei: 192 }[stage] || 132;
  // Wide layouts enlarge actors through --sprite-scale in CSS, so resizing the
  // window re-scales them without waiting for a re-render.
  return Math.round(base * (SIZES[size]?.scale || 1));
}

/* One transition per adjacent scene pair. Scenes are a ring in SCENE_KEYS, so
   each neighbour pair is described once and both directions are generated:
   every travel between touching biomes gets its own overlay, title and motif. */
const SCENE_TRANSITION_MOTIFS = {
  grove: 'sprout', night: 'star', tide: 'foam', neon: 'spark', aurora: 'flake',
  crystal: 'shard', ember: 'ember', sugar: 'sprinkle', dream: 'mote', reef: 'bubble', savanna: 'grass',
};
const SCENE_TRANSITION_COLOURS = {
  grove: '#8fe07a', night: '#4a4f9e', tide: '#5ad6ff', neon: '#b967ff', aurora: '#bde8ff',
  crystal: '#a78bfa', ember: '#ff9a3c', sugar: '#ff9ec7', dream: '#c7b8ff', reef: '#ff9a8c', savanna: BRAND.gold,
};
const SCENE_TRANSITIONS = {};

function buildSceneTransition(a, b) {
  const A = SCENES[a];
  const B = SCENES[b];
  if (!A || !B) return null;
  return {
    key: `${a}-${b}`,
    motif: SCENE_TRANSITION_MOTIFS[b] || 'mote',
    washFrom: SCENE_TRANSITION_COLOURS[a] || A.accent || '#ffffff',
    washTo: SCENE_TRANSITION_COLOURS[b] || B.accent || '#ffffff',
    title: `${A.name} gives way to ${B.name}`,
    caption: B.blurb,
  };
}

/* Scenes form a ring, so each neighbour pair is generated in both directions.
   Runtime scenes (custom biomes) join the ring, so this re-runs and fills only
   the pairs that do not exist yet instead of rebuilding the whole map. */
function syncSceneTransitions() {
  SCENE_KEYS.forEach((from, i) => {
    const to = SCENE_KEYS[(i + 1) % SCENE_KEYS.length];
    [[from, to], [to, from]].forEach(([a, b]) => {
      const key = `${a}>${b}`;
      if (SCENE_TRANSITIONS[key]) return;
      const def = buildSceneTransition(a, b);
      if (def) SCENE_TRANSITIONS[key] = def;
    });
  });
  return SCENE_TRANSITIONS;
}
syncSceneTransitions();
let pendingSceneTransition = null;

function queueSceneTransition(from, to) {
  syncSceneTransitions();
  const def = SCENE_TRANSITIONS[`${from}>${to}`];
  if (!def) return false;
  pendingSceneTransition = { ...def, from, to };
  if (typeof document !== 'undefined' && document.body) mountSceneTransition(document.body);
  return true;
}

function mountSceneTransition(host) {
  const def = pendingSceneTransition;
  if (!def || !host) return;
  pendingSceneTransition = null;
  host.querySelectorAll('.scene-transition').forEach((old) => old.remove());
  const el = document.createElement('div');
  el.className = `scene-transition st-${def.key}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-label', def.title);
  /* The queued record carries scene ids in from/to, so the wash keeps its own
     colour fields rather than being overwritten by the pair. */
  el.style.setProperty('--st-from', def.washFrom || '#ffffff');
  el.style.setProperty('--st-to', def.washTo || '#ffffff');
  el.innerHTML = `<span class="st-wash" aria-hidden="true"></span>
    <span class="st-motif" aria-hidden="true">${Array.from({ length: 16 }, () => `<i class="st-mote st-mote-${def.motif}" style="left:${rand(4, 96)}%;animation-delay:${rand(0, 0.7)}s"></i>`).join('')}</span>
    <span class="st-caption"><b>${esc(def.title)}</b><span>${esc(def.caption)} · tap to skip</span></span>`;
  host.appendChild(el);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.classList.add('is-done');
    setTimeout(() => el.remove(), 240);
  };
  el.addEventListener('click', finish);
  el.addEventListener('animationend', (event) => { if (event.target === el) finish(); });
  setTimeout(finish, 1900);
}

function hollowScreen(root) {
  ensureDaily();
  const active = activeSprite();
  const outside = typeof hollowSprites === 'function' ? hollowSprites() : awakeSprites();
  const s0 = active && active.stage !== 'egg' && !active.retired && !active.atHome ? active : outside[0];
  const atHomeCount = state.sprites.filter((s) => s.stage !== 'egg' && s.atHome).length;

  if (!s0) {
    const homeCopy = atHomeCount ? 'Everyone is home' : 'Your Hollow is quiet';
    const bodyCopy = atHomeCount
      ? `${atHomeCount} sprite${atHomeCount === 1 ? ' is' : 's are'} resting in their own biome. Call someone back, or visit a room to spend time together.`
      : 'Hatch your first egg in the Nest, then come back and say hello.';
    root.innerHTML = `<div class="screen-head"><div><div class="eyebrow">Your hollow</div><h1>${esc(state.hollowName)}</h1></div></div>
      <div data-flight-card></div>
      <div data-flight2-card></div>
      <div data-handoff-nudge></div>
      <div class="card empty-state">
        <div style="font-size:38px">${atHomeCount ? '🏡' : '🥚'}</div>
        <h3 style="font-size:16px;margin:8px 0 4px">${homeCopy}</h3>
        <p>${bodyCopy}</p>
        <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px">
          ${atHomeCount ? '<button class="btn btn-primary" data-go-homes>Open Homes</button>' : ''}
          <button class="btn ${atHomeCount ? 'btn-soft' : 'btn-primary'}" data-go-nest>${atHomeCount ? 'Visit the Nest' : 'Go to the Nest'}</button>
        </div>
      </div>`;
    root.querySelector('[data-go-nest]').onclick = () => App.go('nest');
    root.querySelector('[data-go-homes]')?.addEventListener('click', () => { Sfx.click(); openHomesSheet(); });
    const stopFlightCard = typeof mountFlightCard === 'function' ? mountFlightCard(root) : () => {};
    const stopSecondFlightCard = typeof mountSecondFlightCard === 'function' ? mountSecondFlightCard(root) : () => {};
    const stopHandoffNudge = typeof mountHandoffNudge === 'function' ? mountHandoffNudge(root) : () => {};
    return () => { stopFlightCard(); stopSecondFlightCard(); stopHandoffNudge(); };
  }

  const hab0 = habitatFor(s0);

  /* Hoisted once so the stage class and the badge chip read the same preset. */
  const eventPreset = currentEventPreset();
  const eventBadges = Array.isArray(state.world?.badges) ? state.world.badges : [];
  /* Built as a list rather than inline interpolations: the stage carries the
     travel class, weather and event in one predictable string. */
  const stageClass = [
    'stage',
    `scene-${state.theme.scene}`,
    `phase-${timePhase().key}`,
    `season-${seasonOf().key}`,
    `weather-${currentWeather().key}`,
    eventPreset ? `event-${eventPreset.key}` : '',
  ].filter(Boolean).join(' ');
  const activeScene = SCENES[state.theme.scene] || SCENES.grove;
  const customSceneStyle = activeScene.custom
    ? ` style="background:linear-gradient(180deg, ${activeScene.sky} 0%, ${activeScene.sky} 55%, ${activeScene.ground} 56%, ${activeScene.ground} 100%)"`
    : '';

  root.innerHTML = `
    <div class="hollow-top">
      <div class="hollow-id">
        <div class="avatar-chip" data-avatar>${spriteSVG(s0, { expr: expressionFor(s0) })}</div>
        <div style="min-width:0;flex:1">
          <h2><span data-name>${esc(displayName(s0))}</span><span data-mood>${moodChip(s0)}</span></h2>
          <div class="meta" data-meta>${spriteSubtitle(s0)} · Lv ${s0.level}${s0.level >= MAX_LEVEL ? ' · MAX' : ''}</div>
        </div>
        <button class="icon-btn" data-open-detail aria-label="Sprite details">${icon('chevron')}</button>
      </div>
      <div class="hollow-quick">
        <button class="chip" type="button" data-find-resident title="Search residents by name, family, habitat or home status">🔍 Find</button>
        <button class="chip health-chip" type="button" data-health title="Temperature, medicine and the clinic">
          <span data-health-label>${typeof healthChipText === 'function' ? healthChipText(s0) : ''}</span>
          <span class="sick-badge" data-sick-count${typeof sicknessSickBadge === 'function' && sicknessSickBadge() ? '' : ' hidden'}>${typeof sicknessSickBadge === 'function' ? sicknessSickBadge() : ''}</span>
        </button>
        <button class="chip" type="button" data-world title="Change the season and weather">${seasonOf().icon} ${esc(seasonLabel(seasonOf(), state.world?.climate))} · ${esc(CLIMATES[state.world?.climate]?.name || 'Temperate')} · change</button>
        <button class="chip weather-chip" type="button" data-weather title="Change the Hollow weather">${currentWeather().icon} ${currentWeather().name} · change</button>
        <button class="chip badge-shelf-chip" type="button" data-badge-shelf title="Every event badge the Hollow has hosted" ${eventBadges.length ? '' : 'hidden'}>🏅 ${eventBadges.length} event badge${eventBadges.length === 1 ? '' : 's'}</button>
        ${eventPreset ? `<button class="chip event-chip" type="button" data-event-chip title="${esc(eventPreset.blurb)}">${eventPreset.icon} ${esc(eventPreset.badge)} · ${esc(eventPreset.name)}</button>` : ''}
        <button class="chip habitat-chip" type="button" data-habitat title="${esc(hab0.scene.habitat)} habitat — ${hab0.scene.name}">${hab0.scene.emoji} ${esc(hab0.scene.habitat)} · +${hab0.percent}% XP</button>
        <button class="chip" type="button" data-warm title="Warm clothes" hidden></button>
        <span class="chip" data-phase>${timePhase().icon} ${timePhase().label}</span>
        <span class="chip" data-size-chip>${SIZES[s0.size]?.name || 'Standard'} ${formName(s0) ? `· ${esc(formName(s0))}` : ''}</span>
        <button class="chip bedroom-chip" type="button" data-bedroom>🛏️ Bedroom</button>
        <button class="chip homes-chip" type="button" data-homes title="Every sprite in its own biome window">🪟 Homes${atHomeCount ? ` · ${atHomeCount} home` : ''}</button>
        <button class="chip" type="button" data-senthome-link title="Visit the room where sprites rest and earn">🏠 Home</button>
        <button class="chip" type="button" data-send-all-home title="Send every awake sprite home to rest">🏠 All home</button>
        ${typeof Actions.canUndoSendAllHome === 'function' && Actions.canUndoSendAllHome() ? '<button class="chip" type="button" data-undo-home title="Put everyone the last send moved back out">↩ Undo</button>' : ''}
        <button class="chip guardians-chip" type="button" data-guardians-link title="Every biome has guardians — challenge as many as you like">⚔️ Guardians</button>
        <button class="chip duel-chip" type="button" data-duel-link title="Spar with another sprite in your Hollow">⚔️ Duel</button>
        <button class="chip gift-chip" data-gift-chip>🎁 Gift</button>
        <button class="chip hotel-chip" type="button" data-hotel-link title="Visit the Puffle Hotel spa and snack bar">🏨 Puffle Hotel</button>
      </div>
      ${typeof questTrackHtml === 'function' ? questTrackHtml() : ''}
      <div data-flight-card></div>
      <div data-flight2-card></div>
      <div data-handoff-nudge></div>
      <div class="needs-strip" data-needs>
        ${['hunger', 'energy', 'joy', 'clean'].map((k) => `<div class="need"><div class="need-label"><span>${k === 'hunger' ? 'Food' : k === 'energy' ? 'Rest' : k === 'joy' ? 'Joy' : 'Clean'}</span><b data-need-val="${k}">0</b></div><div class="bar ${k}"><i data-need-bar="${k}" style="width:0%"></i></div></div>`).join('')}
      </div>
    </div>
    <div class="stage-wrap">
      <div class="${stageClass}"${customSceneStyle} data-stage>
        <div class="sky-orb" data-sky>${timePhase().key === 'night' ? '🌙' : timePhase().key === 'day' ? '☀️' : timePhase().key === 'dawn' ? '🌅' : '🌇'}</div>
        <div class="season-wash"></div>
        <div class="time-tint"></div>
        <div class="event-wash" aria-hidden="true"></div>
        <div class="scene-decor" data-decor>${buildSceneDecor(state.theme.scene)}</div>
        <div class="weather-fx" data-weather-fx></div>
        <div data-actors></div>
        <div class="hollow-hint">Tap a sprite to pet · hold still and they’ll come say hi</div>
      </div>
      <div class="hollow-pager" data-pager hidden aria-label="Hollow pages">
        <button class="hollow-page-btn" type="button" data-page-prev aria-label="Previous Hollow page">‹</button>
        <select class="hollow-page-select" data-page-select aria-label="Jump to a Hollow page"></select>
        <span class="hollow-page-range" data-page-range></span>
        <button class="hollow-page-btn" type="button" data-page-next aria-label="Next Hollow page">›</button>
      </div>
      <div class="whisper">${icon('sparkle')}<span data-whisper>${esc(idleLine(s0))}</span></div>
    </div>
    <div class="care-dock" role="group" aria-label="Care and play actions" tabindex="0">
      <div class="dock-group">
        <span class="dock-label">Care</span>
        <div class="dock-row">
          <button class="care-btn feed" data-care="feed"><span class="cb-ico">${icon('food')}</span><span class="cb-label">Feed</span></button>
          <button class="care-btn care-rub" data-care="rub"><span class="cb-ico">🤲</span><span class="cb-label">Rub Belly</span></button>
          <button class="care-btn bath" data-care="bath"><span class="cb-ico">${icon('bath')}</span><span class="cb-label">Bath</span></button>
          <button class="care-btn nap" data-care="nap"><span class="cb-ico">${icon('moon')}</span><span class="cb-label" data-nap-label>Nap</span></button>
          <button class="care-btn care-bed" data-care="bed"><span class="cb-ico">🛏️</span><span class="cb-label">Bed</span></button>
        </div>
      </div>
      <div class="dock-group">
        <span class="dock-label">Grooming</span>
        <div class="dock-row">
          <button class="care-btn care-hair" data-care="hair"><span class="cb-ico">🪮</span><span class="cb-label">Brush Hair</span></button>
          <button class="care-btn care-teeth" data-care="teeth"><span class="cb-ico">🪥</span><span class="cb-label">Brush Teeth</span></button>
          <button class="care-btn care-floss" data-care="floss"><span class="cb-ico">🦷</span><span class="cb-label">Floss</span></button>
          <button class="care-btn care-mouthwash" data-care="mouthwash"><span class="cb-ico">🧴</span><span class="cb-label">Mouthwash</span></button>
          <button class="care-btn care-spa" data-care="spa"><span class="cb-ico">✨</span><span class="cb-label">Spa Game</span></button>
        </div>
      </div>
      <div class="dock-group">
        <span class="dock-label">Play &amp; social</span>
        <div class="dock-row">
          <button class="care-btn play" data-care="play"><span class="cb-ico">${icon('play')}</span><span class="cb-label">Play</span></button>
          <button class="care-btn walk" data-care="walk"><span class="cb-ico">🥾</span><span class="cb-label">Walk</span></button>
          <button class="care-btn care-throw" data-care="throw"><span class="cb-ico">🎾</span><span class="cb-label">Throw Ball</span></button>
          <button class="care-btn care-catch" data-care="catch"><span class="cb-ico">🧤</span><span class="cb-label">Play Catch</span></button>
          <button class="care-btn chat" data-care="chat"><span class="cb-ico">${icon('chat')}</span><span class="cb-label">Talk</span></button>
        </div>
      </div>
    </div>
    <aside class="hollow-summary" data-hollow-summary></aside>`;

  root.querySelector('[data-world]')?.addEventListener('click', () => { Sfx.click(); openWeatherSheet(); });
  root.querySelector('[data-weather]')?.addEventListener('click', () => { Sfx.click(); openWeatherSheet(); });
  root.querySelector('[data-badge-shelf]')?.addEventListener('click', () => { Sfx.click(); openWeatherSheet(); });
  root.querySelector('[data-habitat]')?.addEventListener('click', () => { Sfx.click(); openStudioSheet(); });
  root.querySelector('[data-warm]')?.addEventListener('click', () => { Sfx.click(); openStudioSheet(); });
  root.querySelector('[data-bedroom]')?.addEventListener('click', () => { Sfx.click(); openBedroomSheet(); });
  root.querySelector('[data-homes]')?.addEventListener('click', () => { Sfx.click(); openHomesSheet(); });
  root.querySelector('[data-find-resident]')?.addEventListener('click', () => { Sfx.click(); openResidentFinder(); });
  root.querySelector('[data-senthome-link]')?.addEventListener('click', () => { Sfx.click(); App.go('senthome'); });
  root.querySelector('[data-undo-home]')?.addEventListener('click', () => {
    Sfx.click();
    const res = Actions.undoSendAllHome();
    if (!res.ok) { toast('Nothing left to undo.', '↩'); return; }
    Sfx.chime();
    toast(`${res.restored} sprite${res.restored === 1 ? '' : 's'} came back out.`, '↩');
    if (typeof App !== 'undefined' && App.refresh) App.refresh();
  });
  root.querySelector('[data-send-all-home]')?.addEventListener('click', () => {
    Sfx.click();
    const res = Actions.sendAllHome();
    if (!res || !res.sent) {
      toast('Everyone is already home for the day.', '🏠');
      return;
    }
    Sfx.chime();
    toast(`${res.sent} sprite${res.sent === 1 ? '' : 's'} went home to rest.`, '🏠');
    if (typeof App !== 'undefined' && App.refresh) App.refresh();
  });
  root.querySelector('[data-quest-tracker]')?.addEventListener('click', () => { Sfx.click(); if (typeof openDistrictQuests === 'function') openDistrictQuests(); });
  root.querySelector('[data-guardians-link]')?.addEventListener('click', () => { Sfx.click(); if (typeof openGuardianGallery === 'function') openGuardianGallery(); });
  root.querySelector('[data-duel-link]')?.addEventListener('click', () => { Sfx.click(); if (typeof openHollowDuelGame === 'function') openHollowDuelGame(); });

  const stageEl = root.querySelector('[data-stage]');
  /* Applied straight to the rendered stage: the tint class and its two colours
     drive the event wash, and rebuilding the screen clears them with the DOM. */
  if (stageEl && eventPreset) {
    stageEl.classList.add(`event-${eventPreset.key}`);
    stageEl.style.setProperty('--event-tint', eventPreset.tint);
    stageEl.style.setProperty('--event-tint-2', eventPreset.tint2);
  }
  if (stageEl && sceneUsesTint(state.theme.scene) && !SCENES[state.theme.scene]?.custom) {
    const tint = sceneTint(state.theme.scene);
    stageEl.style.background = `linear-gradient(180deg, ${tint.b2} 0%, ${tint.b1} 58%, ${tint.b2} 100%)`;
  }
  const decorEl = root.querySelector('[data-decor]');
  const actorsEl = root.querySelector('[data-actors]');
  const whisperEl = root.querySelector('[data-whisper]');
  const avatarEl = root.querySelector('[data-avatar]');
  const actors = new Map();
  let rosterSignature = '';
  let visualSignatures = new Map();
  let lastWhisper = 0;

  const setWhisper = (text) => {
    whisperEl.textContent = text;
    lastWhisper = Date.now();
  };

  function roster() {
    return typeof hollowSprites === 'function' ? hollowSprites() : awakeSprites();
  }
  /* Each sprite is a large inline SVG, so only one page of friends is mounted
     at a time. Every non-egg, non-retired sprite outside a home stays in this
     roster and can be reached with the pager. */
  const HOLLOW_PAGE_SIZE = 20;
  let hollowPage = 0;
  let pagerPages = 1;
  let lastPageActiveId = null;

  function pageCount(full) {
    return Math.max(1, Math.ceil(full.length / HOLLOW_PAGE_SIZE));
  }

  function visibleRoster(full = roster()) {
    const pages = pageCount(full);
    hollowPage = Math.max(0, Math.min(pages - 1, hollowPage));
    const start = hollowPage * HOLLOW_PAGE_SIZE;
    return full.slice(start, start + HOLLOW_PAGE_SIZE);
  }

  function currentSprite() {
    const current = activeSprite();
    if (current && current.stage !== 'egg' && !current.retired && !current.atHome) return current;
    return roster()[0] || null;
  }

  function resetPageToActive() {
    const full = roster();
    const active = currentSprite();
    const index = active ? full.findIndex((s) => s.id === active.id) : -1;
    hollowPage = index >= 0 ? Math.floor(index / HOLLOW_PAGE_SIZE) : 0;
    lastPageActiveId = active?.id || null;
  }

  function ensurePageForActive(active) {
    if (!active || active.id === lastPageActiveId) return;
    lastPageActiveId = active.id;
    const full = roster();
    const index = full.findIndex((s) => s.id === active.id);
    const page = index >= 0 ? Math.floor(index / HOLLOW_PAGE_SIZE) : 0;
    if (page !== hollowPage) {
      hollowPage = page;
      renderRoster();
    }
  }

  function goToPage(index) {
    const next = Math.max(0, Math.min(pageCount(roster()) - 1, Number(index) || 0));
    if (next === hollowPage) return;
    hollowPage = next;
    renderRoster();
    paint();
  }

  function paintPager(full) {
    const pager = root.querySelector('[data-pager]');
    if (!pager) return;
    const pages = pageCount(full);
    pagerPages = pages;
    pager.hidden = pages <= 1;
    if (pager.hidden) return;
    const start = hollowPage * HOLLOW_PAGE_SIZE;
    const first = start + 1;
    const last = Math.min(full.length, start + HOLLOW_PAGE_SIZE);
    const select = pager.querySelector('[data-page-select]');
    const range = pager.querySelector('[data-page-range]');
    const prev = pager.querySelector('[data-page-prev]');
    const next = pager.querySelector('[data-page-next]');
    if (select) {
      select.innerHTML = Array.from({ length: pages }, (_, i) => `<option value="${i}">Page ${i + 1} of ${pages}</option>`).join('');
      select.value = String(hollowPage);
    }
    if (range) range.textContent = `${first}–${last} of ${full.length}`;
    if (prev) prev.disabled = hollowPage <= 0;
    if (next) next.disabled = hollowPage >= pages - 1;
  }

  function renderRoster() {
    const full = roster();
    const list = visibleRoster(full);
    paintPager(full);
    const sig = list.map((s) => s.id).join('|');
    const activeId = currentSprite()?.id;
    if (sig === rosterSignature) {
      // update active highlight and tags only
      actors.forEach((node, id) => {
        node.classList.toggle('active', id === activeId);
      });
      return;
    }
    rosterSignature = sig;
    actorsEl.innerHTML = '';
    actors.clear();
    visualSignatures.clear();
    const placed = [];
    list.forEach((sprite, index) => {
      const actor = document.createElement('button');
      actor.type = 'button';
      actor.className = `sprite-actor${sprite.id === activeId ? ' active' : ''}${sprite.asleep ? ' sleeping' : ''}${sprite.form ? ` form-${sprite.form}` : ''}`;
      actor.dataset.id = sprite.id;
      actor.style.setProperty('--w', `${spriteSize(sprite.stage, sprite.size)}px`);
      let cx;
      let cy;
      if (index === 0) {
        cx = 50;
        cy = 62;
      } else {
        let best = { x: 50, y: 60 };
        let bestDist = -1;
        for (let attempt = 0; attempt < 8; attempt++) {
          const px = rand(14, 86);
          const py = rand(38, 82);
          const dist = placed.length
            ? Math.min(...placed.map((p) => Math.hypot(p.x - px, p.y - py)))
            : 99;
          if (dist > bestDist) {
            bestDist = dist;
            best = { x: px, y: py };
          }
        }
        cx = best.x;
        cy = best.y;
      }
      placed.push({ x: cx, y: cy });
      actor.style.left = `${cx}%`;
      actor.style.top = `${cy}%`;
      const giftHere = state.gift && state.gift.spriteId === sprite.id && giftReady();
      actor.innerHTML = `<span class="ground-shadow"></span>
        <div class="sprite-body">${stageBodyMarkup(sprite)}</div>
        <span class="sprite-tag">${esc(displayName(sprite))}${sprite.asleep ? ' 💤' : ''}</span>
        ${sprite.asleep ? '<span class="sprite-zzz">💤</span>' : ''}
        ${giftHere ? '<span class="gift-bubble">🎁</span>' : ''}`;
      const bodyEl = actor.querySelector('.sprite-body');
      if (bodyEl) {
        const fpsVar = typeof spriteAnimationFps === 'function' ? spriteAnimationFps('idle', 10) : 10;
        bodyEl.style.animationDuration = `${(26 / Math.max(1, fpsVar)).toFixed(2)}s`;
        const aura = typeof spriteAuraFor === 'function' ? spriteAuraFor(sprite) : null;
        if (aura) actor.dataset.aura = aura;
      }
      actor.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const fresh = findSprite(sprite.id);
        if (!fresh) return;
        if (giftReady() && state.gift?.spriteId === fresh.id) {
          openGiftModal();
          return;
        }
        if (fresh.asleep) {
          Actions.wake(fresh.id);
          napPropFade(actor);
          Sfx.spriteBabble(fresh);
          setWhisper(`${displayName(fresh)} stretches and blinks awake.`);
          paint();
          /* paint() may rebuild the body for the new mood, so flash afterwards. */
          familyAtlasFlash(actor, 'curious', 1200);
          return;
        }
        if (activeSprite()?.id !== fresh.id) Actions.setActive(fresh.id);
        const result = Actions.pet(fresh.id);
        Sfx.spriteCry(fresh);
        const rect = actor.getBoundingClientRect();
        burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, ['💛', '💗', '✨'], 5);
        if (result.coins) coinFly(actor, 1);
        actor.classList.remove('react-hop');
        void actor.offsetWidth;
        actor.classList.add('react-hop');
        setTimeout(() => actor.classList.remove('react-hop'), 720);
        setWhisper(reactionLine(fresh, 'pet'));
        paint();
        familyAtlasPlay(actor, 'jumpStart');
      });
      actorsEl.appendChild(actor);
      actors.set(sprite.id, actor);
      visualSignatures.set(sprite.id, stageSig(sprite));
    });
    /* Dream-coated sprites leave starlight behind them as they move. */
    startDreamTrails(actorsEl);
  }

  /* Use the same renderer as the gallery, roster and every card. The old
     family-atlas fallback painted a static PNG in the Hollow only, so the same
     pet changed skin when it moved between the Hollow and the collection. */
  function stageBodyMarkup(s) {
    if (typeof spriteSVG === 'function') return spriteSVG(s, { expr: expressionFor(s) });
    return typeof familyAtlasBody === 'function' ? familyAtlasBody(s, { expr: expressionFor(s) }) : '';
  }

  function stageSig(s) {
    return [s.stage, s.element, s.hybrid, s.breed, s.palette, s.garment, s.puffleVariant, s.pattern, s.arms, s.legs, s.accessory, s.outfit, s.custom?.body, s.size, s.form, s.special, s.skin, s.asleep, moodOf(s).key].join(',');
  }

  function refreshActor(s) {
    const node = actors.get(s.id);
    if (!node) return;
    node.classList.toggle('sleeping', s.asleep);
    const sig = stageSig(s);
    if (visualSignatures.get(s.id) !== sig) {
      visualSignatures.set(s.id, sig);
      const body = node.querySelector('.sprite-body');
      body.innerHTML = stageBodyMarkup(s);
      const tag = node.querySelector('.sprite-tag');
      tag.textContent = `${displayName(s)}${s.asleep ? ' 💤' : ''}`;
      let zzz = node.querySelector('.sprite-zzz');
      if (s.asleep && !zzz) {
        zzz = document.createElement('span');
        zzz.className = 'sprite-zzz';
        zzz.textContent = '💤';
        node.appendChild(zzz);
      } else if (!s.asleep && zzz) {
        zzz.remove();
      }
      node.style.setProperty('--w', `${spriteSize(s.stage, s.size)}px`);
    }
    node.classList.toggle('form-dragon', s.form === 'dragon');
    node.classList.toggle('form-fairy', s.form === 'fairy');
    node.classList.toggle('form-ghoul', s.form === 'ghoul');
    node.classList.toggle('form-titan', s.form === 'titan');
    const shouldGift = state.gift && state.gift.spriteId === s.id && giftReady();
    let bubble = node.querySelector('.gift-bubble');
    if (shouldGift && !bubble) {
      bubble = document.createElement('span');
      bubble.className = 'gift-bubble';
      bubble.textContent = '🎁';
      node.appendChild(bubble);
    } else if (!shouldGift && bubble) {
      bubble.remove();
    }
  }

  function paintGiftChip() {
    const chip = root.querySelector('[data-gift-chip]');
    if (!chip) return;
    const phase = timePhase();
    const phaseEl = root.querySelector('[data-phase]');
    if (phaseEl) phaseEl.textContent = `${phase.icon} ${phase.label}`;
    if (!state.gift) {
      chip.classList.remove('ready');
      chip.textContent = '🎁 Wrapping…';
      return;
    }
    if (giftReady()) {
      chip.classList.add('ready');
      chip.textContent = '🎁 Gift ready!';
    } else {
      chip.classList.remove('ready');
      chip.textContent = `🎁 ${fmtTime(state.gift.readyAt - Date.now())}`;
    }
  }

  let lastWorldSig = '';
  function applyStageLook() {
    if (!stageEl) return;
    /* The update loop runs after every render, so the event tint is
       re-asserted here instead of relying on one template evaluation. */
    const liveEvent = currentEventPreset();
    /* The stage class is rebuilt below, so the event class is appended to
       that string instead of being toggled separately (a separate toggle
       was erased one line later). */
    const eventClass = liveEvent ? ` event-${liveEvent.key}` : '';
    if (liveEvent) {
      stageEl.style.setProperty('--event-tint', liveEvent.tint);
      stageEl.style.setProperty('--event-tint-2', liveEvent.tint2);
    } else {
      stageEl.style.removeProperty('--event-tint');
      stageEl.style.removeProperty('--event-tint-2');
    }
    const phase = timePhase();
    const season = seasonOf();
    const wx = currentWeather();
    const localWeather = state.world?.weather ? null : (typeof sceneWeatherKey === 'function' ? sceneWeatherKey(state.theme.scene) : null);
    const wxKey = localWeather || wx.key;
    const climate = state.world?.climate || 'temperate';
    stageEl.className = `stage scene-${state.theme.scene} phase-${phase.key} season-${season.key} weather-${wxKey}${eventClass}`;
    const scene = SCENES[state.theme.scene];
    stageEl.style.background = scene?.custom
      ? `linear-gradient(180deg, ${scene.sky} 0%, ${scene.sky} 55%, ${scene.ground} 56%, ${scene.ground} 100%)`
      : '';
    if (scene && !scene.custom && sceneUsesTint(state.theme.scene)) {
      const tint = sceneTint(state.theme.scene);
      stageEl.style.background = `linear-gradient(180deg, ${tint.b2} 0%, ${tint.b1} 58%, ${tint.b2} 100%)`;
    }
    const sky = root.querySelector('[data-sky]');
    if (sky) sky.textContent = phase.key === 'night' ? '🌙' : phase.key === 'day' ? '☀️' : phase.key === 'dawn' ? '🌅' : '🌇';
    const worldChip = root.querySelector('[data-world]');
    if (worldChip) {
      worldChip.textContent = `${season.icon} ${seasonLabel(season, climate)} · ${CLIMATES[climate]?.name || 'Temperate'} · change`;
      worldChip.title = `Change the season and weather. ${CLIMATES[climate]?.blurb || ''}`;
    }
    const weatherChip = root.querySelector('[data-weather]');
    if (weatherChip) {
      weatherChip.textContent = `${wx.icon} ${wx.name}${wx.off ? ' · off' : state.world?.weather ? ' · set' : ' · change'}`;
      weatherChip.title = `${wx.blurb} ${wx.off ? 'Tap to turn weather back on.' : state.world?.weather ? 'Tap to change it or return to Auto.' : 'Tap to change the weather.'}`;
    }
    /* The badge chip has to exist even when the preset is applied while the
       screen is already mounted, so it is created on demand here. */
    let eventChip = root.querySelector('[data-event-chip]');
    if (liveEvent) {
      if (!eventChip) {
        eventChip = document.createElement('button');
        eventChip.type = 'button';
        eventChip.className = 'chip event-chip';
        eventChip.dataset.eventChip = '';
        eventChip.addEventListener('click', () => openWeatherSheet());
        const weatherAnchor = root.querySelector('[data-weather]');
        if (weatherAnchor && weatherAnchor.parentNode) weatherAnchor.parentNode.insertBefore(eventChip, weatherAnchor.nextSibling);
      }
      eventChip.textContent = `${liveEvent.icon} ${liveEvent.badge} · ${liveEvent.name}`;
      eventChip.title = liveEvent.blurb;
    } else if (eventChip) {
      eventChip.remove();
    }
    const badgeChip = root.querySelector('[data-badge-shelf]');
    if (badgeChip) {
      const badges = Array.isArray(state.world?.badges) ? state.world.badges : [];
      badgeChip.hidden = !badges.length;
      badgeChip.textContent = `🏅 ${badges.length} event badge${badges.length === 1 ? '' : 's'}`;
    }
    const warmChip = root.querySelector('[data-warm]');
    if (warmChip) {
      const warm = warmScore(activeSprite());
      if (wx.chill > 0) {
        warmChip.hidden = false;
        warmChip.textContent = warm >= 2 ? '🧣 Cozy' : warm === 1 ? '🧣 Warm-ish' : '🥶 Chilly';
        warmChip.title = warm >= 2
          ? 'Warm clothes keep the cold from draining energy and joy.'
          : 'Cold weather drains energy and joy faster. Try a scarf, beanie, mittens or parka in the Studio.';
      } else {
        warmChip.hidden = true;
      }
    }
    const sig = `${season.key}:${wxKey}:${state.theme.scene}`;
    const weatherEl = root.querySelector('[data-weather-fx]');
    if (weatherEl && sig !== lastWorldSig) {
      lastWorldSig = sig;
      /* The weather particles are built with the screen; the startup render
         budget keeps their motion off until the first frame is committed.
         Building them later would only move that work into the window where
         Android is handing the app focus. */
      weatherEl.innerHTML = buildWeatherFx(wxKey);
      if (typeof WeatherSound !== 'undefined') WeatherSound.set(wxKey);
    }
  }

  function questResetIn() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const mins = Math.max(0, Math.round((next - now) / 60000));
    const hours = Math.floor(mins / 60);
    return hours ? `${hours}h ${mins % 60}m` : `${mins}m`;
  }

  function localDayKey(d) {
    const t = d || new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }

  function streakDays() {
    const c = (typeof state !== 'undefined' && state.checkin) || {};
    const n = Number(c.streak) || 0;
    if (!n || !c.last) return 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return c.last === localDayKey() || c.last === localDayKey(yesterday) ? n : 0;
  }

  function paintSummary(s) {
    const el = root.querySelector('[data-hollow-summary]');
    if (!el || !s) return;
    const pct = s.level >= MAX_LEVEL ? 1 : Math.min(1, (s.xp || 0) / xpNeeded(s.level));
    const need = Math.max(0, Math.ceil(xpNeeded(s.level) - (s.xp || 0)));
    const qKey = typeof activeQuestKey === 'function' ? activeQuestKey() : null;
    const qDef = qKey && typeof BIOME_QUESTS !== 'undefined' ? BIOME_QUESTS[qKey] : null;
    const qStep = qKey && typeof biomeQuestStep === 'function' ? biomeQuestStep(qKey) : null;
    const qProg = qKey && typeof biomeQuestProgress === 'function' ? biomeQuestProgress(qKey) : null;
    const quest = qDef && qStep && qProg
      ? `<div class="hs-quest"><span class="hs-q-icon">${qDef.icon}</span><span class="hs-q-copy"><b>${esc(qDef.title)}</b><span>${esc(qStep.step.text)}</span></span><span class="hs-q-prog">${qProg.have}/${qProg.need}</span></div>`
      : '<div class="hs-quest done">🏆 Every district quest line is complete.</div>';
    el.innerHTML = `<div class="hs-head"><div class="hs-id"><b>${esc(displayName(s))}</b><span>Lv ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}</span></div>${moodChip(s)}</div>
      <div class="hs-xp">
        <div class="hs-xp-label"><span>${s.level >= MAX_LEVEL ? 'Max level' : `XP to Lv ${s.level + 1}`}</span><b>${Math.round(pct * 100)}%</b></div>
        <div class="hs-xp-bar"><i style="width:${Math.round(pct * 100)}%"></i></div>
        <div class="hs-xp-note">${s.level >= MAX_LEVEL ? 'Every level earned.' : `${need.toLocaleString()} XP to go`}</div>
      </div>
      <div class="hs-stats">
        <span class="hs-stat"><b>🔥 ${streakDays()}</b> day streak</span>
        <span class="hs-stat"><b>⏳ ${questResetIn()}</b> to daily reset</span>
      </div>
      ${quest}`;
  }

  function paint() {
    const s = currentSprite();
    if (!s) return;
    /* paint() can run after the screen has been replaced (an overlay closed, a
       route changed), so missing nodes mean "this root is stale" — bail out
       instead of dereferencing null. */
    const nameEl = root.querySelector('[data-name]');
    if (!nameEl) return;
    ensurePageForActive(s);
    nameEl.textContent = displayName(s);
    const moodEl = root.querySelector('[data-mood]');
    if (moodEl) moodEl.innerHTML = moodChip(s);
    const healthEl = root.querySelector('[data-health]');
    if (healthEl && typeof healthChipText === 'function') {
      const label = healthEl.querySelector('[data-health-label]');
      if (label) label.textContent = healthChipText(s);
      healthEl.classList.toggle('is-sick', typeof Sickness !== 'undefined' && Sickness.isSick(s));
      const sickBadge = healthEl.querySelector('[data-sick-count]');
      if (sickBadge) {
        const badge = typeof sicknessSickBadge === 'function' ? sicknessSickBadge() : '';
        sickBadge.textContent = badge;
        sickBadge.hidden = !badge;
      }
    }
    const metaEl = root.querySelector('[data-meta]');
    if (metaEl) metaEl.textContent = `${spriteSubtitle(s)} · Lv ${s.level}${s.level >= MAX_LEVEL ? ' · MAX' : ''}`;
    const sizeChip = root.querySelector('[data-size-chip]');
    if (sizeChip) sizeChip.textContent = `${SIZES[s.size]?.name || 'Standard'}${formName(s) ? ` · ${formName(s)}` : ''}`;
    const habitatChip = root.querySelector('[data-habitat]');
    if (habitatChip) {
      const habitat = habitatFor(s);
      habitatChip.textContent = `${habitat.scene.emoji} ${habitat.scene.habitat} · +${habitat.percent}% XP`;
      habitatChip.title = `${habitat.scene.habitat} habitat — ${habitat.scene.name}${habitat.match ? ' · thriving' : ' · visitor bonus'}`;
    }
    ['hunger', 'energy', 'joy', 'clean'].forEach((k) => {
      const v = Math.round(s.needs[k]);
      root.querySelector(`[data-need-val="${k}"]`).textContent = v;
      const bar = root.querySelector(`[data-need-bar="${k}"]`);
      if (bar) bar.style.width = `${v}%`;
    });
    paintSummary(s);
    const napLabel = root.querySelector('[data-nap-label]');
    if (napLabel) napLabel.textContent = s.asleep ? 'Wake' : 'Nap';
    if (avatarEl.dataset.sig !== stageSig(s)) {
      avatarEl.dataset.sig = stageSig(s);
      avatarEl.innerHTML = spriteSVG(s, { expr: expressionFor(s) });
    }
    visibleRoster().forEach(refreshActor);
    actors.forEach((node, id) => node.classList.toggle('active', id === s.id));
    paintGiftChip();
  }

  function moveSprites() {
    const list = visibleRoster().filter((s) => !s.asleep);
    if (!list.length) return;
    list.forEach((s) => {
      const node = actors.get(s.id);
      if (!node) return;
      if (chance(0.35)) return;
      let best = null;
      let bestDist = -1;
      for (let i = 0; i < 4; i++) {
        const x = rand(14, 86);
        const y = rand(36, 80);
        let nearest = 999;
        list.forEach((o) => {
          if (o.id === s.id) return;
          const on = actors.get(o.id);
          if (!on) return;
          const ox = parseFloat(on.style.left);
          const oy = parseFloat(on.style.top);
          nearest = Math.min(nearest, Math.hypot(ox - x, oy - y));
        });
        if (nearest > bestDist) {
          bestDist = nearest;
          best = { x, y };
        }
      }
      if (best && bestDist > 22) {
        const oldX = parseFloat(node.style.left);
        node.style.setProperty('--flip', best.x < oldX ? '-1' : '1');
        node.style.left = `${best.x}%`;
        node.style.top = `${best.y}%`;
      }
    });
  }

  function emote(id, char) {
    const node = actors.get(id);
    if (!node) return;
    const span = document.createElement('span');
    span.className = 'emote';
    span.textContent = char;
    node.appendChild(span);
    setTimeout(() => span.remove(), 1800);
  }

  function ambientInteraction() {
    const list = visibleRoster().filter((s) => !s.asleep);
    if (list.length < 2) return;
    const a = pick(list);
    const b = pick(list.filter((s) => s.id !== a.id));
    if (!b) return;
    const na = actors.get(a.id);
    const nb = actors.get(b.id);
    if (!na || !nb) return;
    const dist = Math.hypot(parseFloat(na.style.left) - parseFloat(nb.style.left), parseFloat(na.style.top) - parseFloat(nb.style.top));
    if (dist > 30) {
      // sidle up beside them rather than through them
      const nbX = parseFloat(nb.style.left);
      const nbY = parseFloat(nb.style.top);
      const naX = parseFloat(na.style.left);
      const nx = clamp(nbX + (naX < nbX ? -30 : 30), 14, 86);
      const ny = clamp(nbY + rand(8, 15), 38, 82);
      na.style.setProperty('--flip', nx < naX ? '-1' : '1');
      na.style.left = `${nx}%`;
      na.style.top = `${ny}%`;
      return;
    }
    const kind = pick(['💛', '✨', '🎵', '💫', '🌸']);
    emote(a.id, kind);
    setTimeout(() => emote(b.id, kind), 240);
    Actions.ambientBond([a.id, b.id], 0.5);
    const lines = [
      `${displayName(a)} and ${displayName(b)} bumped noses. That’s legally a friendship now.`,
      `${displayName(a)} showed ${displayName(b)} a really good leaf.`,
      `${displayName(a)} and ${displayName(b)} are having a stare-off. Nobody is winning.`,
      `${displayName(a)} chased ${displayName(b)} in a circle for no reason.`,
      `${displayName(b)} shared a snack with ${displayName(a)}. A whole snack.`,
      `${displayName(a)} and ${displayName(b)} are doing a tiny dance.`,
    ];
    setWhisper(pick(lines));
  }

  function ambientWhisper() {
    if (Date.now() - lastWhisper < 9000) return;
    const s = currentSprite();
    if (!s) return;
    const line = idleLine(pick(visibleRoster()));
    setWhisper(line);
  }

  // caretakers
  root.querySelector('[data-care="feed"]').addEventListener('click', openFeedSheet);
  root.querySelector('[data-care="play"]').addEventListener('click', () => App.go('play'));
  root.querySelector('[data-care="walk"]').addEventListener('click', () => openWalkSheet());
  root.querySelector('[data-care="rub"]').addEventListener('click', () => {
    const s = currentSprite();
    if (!s) return;
    const res = Actions.rubBelly(s.id);
    if (res.cooled) {
      setWhisper(`${displayName(s)} is still blissed out from the last belly rub. Give them a second.`);
      return;
    }
    const node = actors.get(s.id);
    if (node) {
      const r = node.getBoundingClientRect();
      burstAt(r.left + r.width / 2, r.top + r.height / 2, ['💗', '✨', '💛'], 8);
      node.classList.remove('react-hop');
      void node.offsetWidth;
      node.classList.add('react-hop');
      setTimeout(() => node.classList.remove('react-hop'), 720);
      fluffShed(node, s, 'rub');
      wagTail(node, s);
    }
    emote(s.id, '💗');
    Sfx.purr();
    if (typeof lumiPlayClip === 'function') lumiPlayClip(actors.get(s.id), 'relax', 1700);
    setWhisper(`${displayName(s)} flops over for a belly rub. Ten out of ten.`);
    paint();
  });
  root.querySelector('[data-hotel-link]')?.addEventListener('click', () => { Sfx.click(); App.go('hotel'); });
  root.querySelector('[data-care="hair"]').addEventListener('click', () => openGroomCareModal('hair', currentSprite()?.id));
  root.querySelector('[data-care="teeth"]').addEventListener('click', () => openGroomCareModal('teeth', currentSprite()?.id));
  root.querySelector('[data-care="floss"]').addEventListener('click', () => openGroomCareModal('floss', currentSprite()?.id));
  root.querySelector('[data-care="mouthwash"]').addEventListener('click', () => openMouthwashSheet(currentSprite()?.id));
  root.querySelector('[data-care="spa"]').addEventListener('click', () => { if (typeof openPuffleSpaGame === 'function') openPuffleSpaGame(); });
  root.querySelector('[data-care="throw"]').addEventListener('click', () => openFetchGame('throw'));
  root.querySelector('[data-care="catch"]').addEventListener('click', () => openFetchGame('catch'));
  root.querySelector('[data-care="bath"]').addEventListener('click', openBathModal);
  root.querySelector('[data-care="nap"]').addEventListener('click', () => {
    const s = currentSprite();
    if (!s) return;
    if (s.asleep) {
      Actions.wake(s.id);
      napPropFade(actors.get(s.id));
      setWhisper(`${displayName(s)} blinks awake and stretches.`);
      Sfx.pop();
    } else {
      Actions.nap(s.id);
      setWhisper('Shhh. Thirty seconds of the best nap ever.');
      emote(s.id, '💤');
    }
    paint();
  });
  root.querySelector('[data-care="bed"]').addEventListener('click', () => {
    Sfx.click();
    openBedroomSheet();
  });
  root.querySelector('[data-care="chat"]').addEventListener('click', () => {
    const s = currentSprite();
    if (s) {
      if (typeof lumiPlayClip === 'function') lumiPlayClip(actors.get(s.id), 'speak', 3200);
      App.openChat(s.id);
    }
  });
  /* The sick bay: a temperature sheet, a spoonful game and the clinic run. */
  root.querySelector('[data-health]').addEventListener('click', () => {
    const s = currentSprite();
    if (!s) return;
    Sfx.click();
    if (typeof openSicknessSheet === 'function') openSicknessSheet(s.id, { read: true });
  });
  root.querySelector('[data-open-detail]').addEventListener('click', () => {
    const s = currentSprite();
    if (s) App.openDetail(s.id);
  });
  root.querySelector('[data-gift-chip]').addEventListener('click', () => {
    if (giftReady()) openGiftModal();
    else if (state.gift) {
      const s = findSprite(state.gift.spriteId);
      toast(`${s ? displayName(s) : 'Someone'} is still wrapping it — ${fmtTime(state.gift.readyAt - Date.now())} to go.`, '🎁');
    } else {
      toast('No gift is being wrapped right now. Pet a sprite and check back soon.', '🎁');
    }
  });

  function openResidentFinder() {
    /* One row per living resident, whatever its home status. Build the search
       and filter data once so typing never re-derives it for every sprite. */
    let picker = null;
    const pool = state.sprites.filter((s) => s.stage !== 'egg' && !s.retired);
    const familyLabel = (key) => speciesFamilyLabel(key) || key;
    const residents = pool.map((s) => {
      const name = displayName(s);
      const species = (ELEMENTS[s.element] || {}).name || s.element;
      const family = typeof speciesFamilyFor === 'function' ? speciesFamilyFor(s.element) : null;
      const sceneKey = homeSceneFor(s);
      const scene = SCENES[sceneKey] || SCENES.grove;
      return {
        sprite: s,
        name,
        species,
        family: family ? family.id : 'hollow',
        familyName: family ? family.label || family.id : 'hollow',
        scene,
        habitat: scene.habitat || 'Elsewhere',
        atHome: !!s.atHome,
        search: `${name} ${species}`.toLowerCase(),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const families = [...new Set(residents.map((r) => r.family))]
      .sort((a, b) => familyLabel(a).localeCompare(familyLabel(b)));
    const habitats = [...new Set(residents.map((r) => r.habitat))].sort((a, b) => a.localeCompare(b));
    const counts = { all: residents.length, hollow: 0, home: 0 };
    residents.forEach((r) => { counts[r.atHome ? 'home' : 'hollow'] += 1; });
    let query = '';
    let family = 'all';
    let habitat = 'all';
    let home = 'all';

    const filtered = () => residents.filter((r) => (
      (home === 'all' || (home === 'home' ? r.atHome : !r.atHome))
      && (family === 'all' || r.family === family)
      && (habitat === 'all' || r.habitat === habitat)
      && (!query || r.search.includes(query))
    ));

    const rowHTML = (r) => `<button class="resident-row${r.sprite.id === state.activeId ? ' is-active' : ''}${r.atHome ? ' is-home' : ''}" type="button" data-resident-id="${r.sprite.id}">
        <span class="resident-mark" aria-hidden="true">${r.scene.emoji || '🐾'}</span>
        <span class="resident-copy"><b>${esc(r.name)}</b><small>${esc(r.species)} · ${esc(r.familyName)}</small></span>
        <span class="resident-where">${r.scene.emoji || ''} ${esc(r.habitat)}<small>${r.atHome ? '🏡 At home' : '🐾 In Hollow'}</small></span>
        <span class="resident-go" aria-hidden="true">›</span>
      </button>`;

    const { close } = openSheet({
      title: 'Find a resident',
      sub: 'Search every living sprite, then jump to their Hollow page or open their room.',
      body: `<div class="resident-finder">
        <label class="resident-search"><span aria-hidden="true">🔍</span><input type="search" data-resident-name placeholder="Search by name or species…" aria-label="Search residents by name"></label>
        <div class="resident-filter-row">
          <label class="resident-field"><span>Family</span><select data-resident-family aria-label="Filter residents by family"><option value="all">All families</option>${families.map((key) => `<option value="${esc(key)}">${esc(familyLabel(key))}</option>`).join('')}</select></label>
          <label class="resident-field"><span>Habitat</span><select data-resident-habitat aria-label="Filter residents by habitat"><option value="all">All habitats</option>${habitats.map((key) => `<option value="${esc(key)}">${esc(key)}</option>`).join('')}</select></label>
        </div>
        <div class="resident-home-filter" data-resident-home role="group" aria-label="Filter residents by home status">
          <button class="chip on" type="button" data-home-status="all">🪟 All · ${counts.all}</button>
          <button class="chip" type="button" data-home-status="hollow">🐾 Hollow · ${counts.hollow}</button>
          <button class="chip" type="button" data-home-status="home">🏡 Home · ${counts.home}</button>
        </div>
        <div class="resident-count" data-resident-count aria-live="polite"></div>
        <div class="resident-results" data-resident-results></div>
        <div class="resident-empty" data-resident-empty role="status" hidden></div>
      </div>`,
      onClose: () => { picker?.clear(); picker = null; },
      onMount: (sheet) => {
        const input = sheet.querySelector('[data-resident-name]');
        const familySelect = sheet.querySelector('[data-resident-family]');
        const habitatSelect = sheet.querySelector('[data-resident-habitat]');
        const count = sheet.querySelector('[data-resident-count]');
        const empty = sheet.querySelector('[data-resident-empty]');
        const results = sheet.querySelector('[data-resident-results]');
        picker = createPickerGrid({
          container: results,
          options: { batchSize: 80, rootMargin: '500px 0px', virtual: true, windowSize: 320 },
          renderItem: rowHTML,
          count,
          empty,
        });
        const draw = () => {
          const rows = filtered();
          const where = home === 'all' ? '' : home === 'home' ? ' at home' : ' in the Hollow';
          const countText = `${rows.length.toLocaleString()} resident${rows.length === 1 ? '' : 's'}${where}`;
          const emptyText = residents.length
            ? (query ? `No residents match “${input.value.trim()}”.` : 'No residents match those filters.')
            : 'No living residents yet. Hatch an egg in the Nest to meet your first friend.';
          picker.update(rows, countText, emptyText);
        };
        input.addEventListener('input', () => { query = input.value.trim().toLowerCase(); draw(); });
        familySelect.addEventListener('change', () => { family = familySelect.value; draw(); });
        habitatSelect.addEventListener('change', () => { habitat = habitatSelect.value; draw(); });
        sheet.querySelectorAll('[data-home-status]').forEach((button) => {
          button.addEventListener('click', () => {
            home = button.dataset.homeStatus;
            sheet.querySelectorAll('[data-home-status]').forEach((other) => other.classList.toggle('on', other === button));
            draw();
          });
        });
        results.addEventListener('click', (event) => {
          const row = event.target.closest('[data-resident-id]');
          if (!row) return;
          const s = findSprite(row.dataset.residentId);
          if (!s) return;
          Sfx.click();
          close();
          if (s.atHome) {
            App.openDetail(s.id);
            return;
          }
          Actions.setActive(s.id);
          resetPageToActive();
          renderRoster();
          paint();
        });
        draw();
      },
    });
  }

  function openFeedSheet() {
    const s = currentSprite();
    if (!s) return;
    const dietLine = dietInfo(s).filter((d) => d.points > 0)
      .map((d) => `${d.icon} ${d.points}/${d.need}`).join(' · ');
    const cuisineLine = cuisineInfo(s).filter((d) => d.points > 0)
      .map((d) => `${d.icon} ${d.points}/${d.need}`).join(' · ');
    const dietTag = (key) => {
      const diet = FOOD_DIET[key];
      return diet ? ` · ${DIET_PATHS[diet.path].icon} ${DIET_PATHS[diet.path].label}` : '';
    };
    const cuisineTag = (key) => FOODS[key]?.region ? ' · 🌍 World Kitchen' : '';
    const feedSuccess = (res) => {
      close();
      const item = res.food || res.snack;
      const node = actors.get(s.id);
      if (node) {
        const r = node.getBoundingClientRect();
        burstAt(r.left + r.width / 2, r.top + r.height / 2, [item.emoji, '✨', '💛'], 7);
        node.classList.add('react-hop');
        setTimeout(() => node.classList.remove('react-hop'), 720);
        if (typeof lumiPlayClip === 'function') lumiPlayClip(node, item.cat === 'drink' ? 'drink' : 'eat', 1900);
        emote(s.id, item.emoji);
        fluffShed(node, s, 'feed');
        wagTail(node, s);
      }
      setWhisper(reactionLine(s, 'feed'));
      toast(`${displayName(s)} loved the ${item.name}`, item.emoji);
      paint();
    };

    function pantryHTML() {
      const foodKeys = FOOD_KEYS.filter((key) => foodCount(key) > 0);
      const snackKeys = SNACK_KEYS.filter((key) => snackCount(key) > 0);
      const rows = [
        ...foodKeys.map((key) => {
          const f = FOODS[key];
          return `<button class="food-card" data-stock-feed="${key}">
            <span class="food-emoji">${f.emoji}</span>
            <span style="flex:1"><h4>${f.name}</h4><p>${f.desc}${dietTag(key)}${cuisineTag(key)}</p></span>
            <span class="price snack-count">×${foodCount(key)}</span>
          </button>`;
        }),
        ...snackKeys.map((key) => {
          const snack = SNACKS[key];
          return `<button class="food-card" data-snack="${key}">
            <span class="food-emoji">${snack.emoji}</span>
            <span style="flex:1"><h4>${snack.name}</h4><p>${snack.desc}${dietTag(key)}</p></span>
            <span class="price snack-count">×${snackCount(key)}</span>
          </button>`;
        }),
      ];
      const total = foodTotal() + snackTotal();
      return `<div class="section-title" style="margin-top:4px"><h2>Pantry</h2><span>${total} item${total === 1 ? '' : 's'}</span></div>
        ${rows.length
          ? `<div class="list-gap">${rows.join('')}</div>`
          : '<div class="tiny muted">The pantry is empty. Stock food from the market or earn snacks from check-ins.</div>'}`;
    }

    function marketHTML() {
      const groups = Object.entries(FOOD_CATEGORIES).map(([id, cat]) => {
        const keys = FOOD_KEYS.filter((key) => !FOODS[key].giftOnly && FOODS[key].cat === id && (!FOODS[key].monthly || (state.foodUnlocks || []).includes(key)));
        if (!keys.length) return '';
        const rows = keys.map((key) => {
          const f = FOODS[key];
          const recipe = typeof cafeRecipeForFood === 'function' ? cafeRecipeForFood(key) : null;
          const recipeLocked = !!recipe && !cafeRecipeUnlocked(key);
          return `<button class="food-card" ${recipeLocked ? `data-recipe-hint="${key}"` : `data-buy-food="${key}"`} ${!recipeLocked && state.coins < f.price ? 'disabled style="opacity:.5"' : ''}>
            <span class="food-emoji">${f.emoji}</span>
            <span style="flex:1"><h4>${f.name}</h4><p>${f.desc}${dietTag(key)}${cuisineTag(key)}${recipeLocked ? ` · ☕ ${recipe.title} recipe` : ''}</p></span>
            <span class="price">${recipeLocked ? '🔒 recipe' : `${icon('coin')}${f.price}`}</span>
          </button>`;
        }).join('');
        return `<div class="food-cat">${cat.icon} ${cat.name}</div><div class="list-gap">${rows}</div>`;
      }).join('');
      const lockedMonthly = MONTHLY_FOOD_KEYS.filter((k) => !(state.foodUnlocks || []).includes(k)).length;
      return `<div class="section-title"><h2>Market</h2><span>stock your pantry</span></div>${groups}
        ${lockedMonthly ? `<div class="tiny muted" style="margin-top:10px;line-height:1.5">${lockedMonthly} monthly food${lockedMonthly === 1 ? '' : 's'} still locked. Open the first Friday crate of the month on Today to unlock one each month.</div>` : ''}
        <div class="between" style="margin-top:12px"><span class="tiny muted">You have <b>${state.coins}</b> coins</span>
        <button class="btn btn-sm btn-soft" data-earn>Earn coins</button></div>`;
    }

    const { close } = openSheet({
      title: `Feed ${displayName(s)}`,
      sub: `Food ${Math.round(s.needs.hunger)}/100 · Joy ${Math.round(s.needs.joy)}/100.${dietLine ? ` Diet: ${dietLine}` : ''}${cuisineLine ? ` · Cuisine: ${cuisineLine}` : ''}`,
      body: '<div data-feed-body></div>',
      onMount: (overlay) => {
        const body = overlay.querySelector('[data-feed-body]');
        const draw = () => {
          body.innerHTML = pantryHTML() + marketHTML();
          body.querySelectorAll('[data-stock-feed]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const res = Actions.feedStock(s.id, btn.dataset.stockFeed);
              if (res.ok) feedSuccess(res);
            });
          });
          body.querySelectorAll('[data-snack]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const res = Actions.feedSnack(s.id, btn.dataset.snack);
              if (res.ok) feedSuccess(res);
            });
          });
          body.querySelectorAll('[data-buy-food]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const res = Actions.buyFoodStock(btn.dataset.buyFood);
              if (res.ok) {
                Sfx.coin();
                toast(`${res.food.name} stocked in the pantry.`, '🧺');
                draw();
              } else if (res.reason === 'recipe' && res.recipe) {
                toast(`Finish one ${res.recipe.title} run to unlock ${FOODS[res.recipe.food].name}.`, '☕');
              }
            });
          });
          body.querySelectorAll('[data-recipe-hint]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const recipe = typeof cafeRecipeForFood === 'function' ? cafeRecipeForFood(btn.dataset.recipeHint) : null;
              if (recipe) toast(`Finish one ${recipe.title} run to unlock ${FOODS[recipe.food].name}.`, '☕');
            });
          });
          body.querySelector('[data-earn]').addEventListener('click', () => {
            close();
            App.go('play');
          });
        };
        draw();
      },
    });
  }

  function openGiftModal() {
    if (!giftReady()) {
      toast('Not quite ready yet — the wrapping is still rustling.', '🎁');
      return;
    }
    const giver = findSprite(state.gift?.spriteId) || activeSprite();
    if (!giver) return;
    openModal({
      title: `A gift from ${displayName(giver)}`,
      sub: 'They wrapped this themself. Mostly.',
      body: `<div style="text-align:center;padding:14px 0 4px">
          <div style="font-size:64px;line-height:1;filter:drop-shadow(0 8px 24px rgba(255,209,102,.35))">🎁</div>
          <div class="tiny muted" style="margin-top:10px">Saved up over the last little while.</div>
        </div>
        <button class="btn btn-gold btn-block" data-open-gift style="margin-top:12px">Open the gift</button>`,
      onMount: (root, close) => {
        root.querySelector('[data-open-gift]').addEventListener('click', (e) => {
          const res = Actions.claimGift();
          if (!res.ok) {
            close();
            paint();
            return;
          }
          const body = root.querySelector('.modal-body');
          const giftKind = /^(scene|snack|xp|coins)$/.test(res.reward.kind) ? res.reward.kind : 'snack';
          body.innerHTML = `<div class="gift-reward gift-reward--${giftKind}" data-gift-kind="${giftKind}">
            <span class="gift-reward__halo" aria-hidden="true"></span>
            <div class="gr-emoji">${res.reward.icon}</div>
            <h3>${esc(res.reward.title)}</h3>
            <p class="muted small">${esc(res.reward.text)}</p>
            <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap;margin-top:10px">
              <span class="chip">from ${esc(displayName(res.sprite))}</span>
              <span class="chip">next gift wraps soon</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" data-gift-done style="margin-top:12px">Lovely</button>`;
          burstOn(e.currentTarget, ['🎁', '✨', '💛'], 10);
          body.querySelector('[data-gift-done]').addEventListener('click', () => {
            close();
            paint();
            App.refresh();
          });
          paint();
        });
      },
    });
  }

  function openBathModal() {
    const s = currentSprite();
    if (!s) return;
    let scrubs = 0;
    const total = 8;
    const { close } = openModal({
      title: 'Bubble bath',
      sub: `Rub the bubbles into ${displayName(s)}. Eight good scrubs.`,
      dismissible: true,
      body: `<div class="hatch-stage" data-scrub style="min-height:150px;cursor:pointer">
          <div class="hatched" data-bath-sprite style="width:150px;height:150px">${spriteSVG(s, { expr: 'happy' })}</div>
        </div>
        <div class="bar clean" style="height:9px"><i data-scrub-bar style="width:0%"></i></div>
        <div class="hatch-hint" data-scrub-hint>0 / ${total} scrubs</div>`,
      onMount: (overlay) => {
        const target = overlay.querySelector('[data-scrub]');
        const bar = overlay.querySelector('[data-scrub-bar]');
        const hint = overlay.querySelector('[data-scrub-hint]');
        if (typeof lumiPlayClip === 'function') lumiPlayClip(overlay.querySelector('[data-bath-sprite]'), 'wash', 8000);
        target.addEventListener('pointerdown', (e) => {
          if (scrubs >= total) return;
          scrubs++;
          bar.style.width = `${(scrubs / total) * 100}%`;
          hint.textContent = `${scrubs} / ${total} scrubs`;
          burstAt(e.clientX, e.clientY, ['🫧', '✨', '💙'], 3);
          if (scrubs % 2 === 0) Sfx.bath();
          if (scrubs >= total) {
            const bath = Actions.bathe(s.id);
            if (bath && bath.cooled) {
              toast(`${displayName(s)} is still fresh from the last bath.`, '🫧');
            } else {
              soapBubbles(target, 16);
              toast(`${displayName(s)} is squeaky clean!`, '🫧');
              fluffShed(actors.get(s.id), s, 'bath');
              Sfx.win();
              const rect = target.getBoundingClientRect();
              burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, ['🫧', '✨', '💛'], 10);
              setWhisper(reactionLine(s, 'bath'));
              paint();
            }
            setTimeout(close, 550);
          }
        });
      },
    });
  }

  function openFetchGame(mode) {
    const s = currentSprite();
    if (!s) return;
    /* Sheet pets throw on the throw round and catch on the catch round. */
    queueMicrotask(() => {
      if (typeof lumiPlayClip === 'function') lumiPlayClip(document.querySelector('.fetch-sprite'), mode === 'catch' ? 'catch' : 'throw', 8000);
    });
    if (s.asleep) Actions.wake(s.id);
    const total = 5;
    const isCatch = mode === 'catch';
    let caught = 0;
    let finished = false;
    const { close } = openModal({
      title: isCatch ? `Play catch with ${displayName(s)}` : `Throw ball with ${displayName(s)}`,
      sub: isCatch ? 'Tap the ball as it comes back. Five clean catches.' : 'Tap the ball to send it flying. Five good throws.',
      dismissible: true,
      body: `<div class="fetch-stage" data-fetch-stage>
          <div class="fetch-sun"></div>
          <div class="fetch-sprite">${spriteSVG(s, { expr: 'happy' })}</div>
          <button class="fetch-ball" type="button" data-fetch-ball aria-label="Catch the ball">🎾</button>
          <span class="fetch-spark a">✨</span><span class="fetch-spark b">✨</span>
        </div>
        <div class="bar joy" style="height:9px"><i data-fetch-bar style="width:0%"></i></div>
        <div class="hatch-hint" data-fetch-hint>0 / ${total} ${isCatch ? 'catches' : 'throws'}</div>`,
      onMount: (overlay) => {
        const ball = overlay.querySelector('[data-fetch-ball]');
        const bar = overlay.querySelector('[data-fetch-bar]');
        const hint = overlay.querySelector('[data-fetch-hint]');
        const body = overlay.querySelector('.modal-body');
        const tap = (e) => {
          if (finished) return;
          caught += 1;
          bar.style.width = `${(caught / total) * 100}%`;
          hint.textContent = `${caught} / ${total} ${isCatch ? 'catches' : 'throws'}`;
          burstAt(e.clientX, e.clientY, ['🎾', '✨', '💛'], 5);
          Sfx.pop();
          ball.style.animationPlayState = 'paused';
          setTimeout(() => { if (!finished) ball.style.animationPlayState = 'running'; }, 180);
          if (caught >= total) {
            finished = true;
            ball.disabled = true;
            const res = Actions.playCatch(s.id, mode, total);
            if (!res.ok) {
              close();
              return;
            }
            body.innerHTML = `<div class="gift-reward" style="text-align:center">
              <div class="gr-emoji">${isCatch ? '🧤' : '🎾'}</div>
              <h3>${isCatch ? 'Five clean catches!' : 'Five good throws!'}</h3>
              <p class="muted small">${esc(displayName(s))} is delighted${res.careGift ? ' — and the Care Package is full!' : '.'}</p>
              <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap;margin-top:10px">
                <span class="chip">🪙 +${res.coins}</span><span class="chip">⭐ +${res.xp} XP</span><span class="chip">💗 bond</span>
              </div>
            </div>
            <button class="btn btn-primary btn-block" data-fetch-done style="margin-top:12px">Lovely</button>`;
            body.querySelector('[data-fetch-done]').addEventListener('click', () => {
              close();
              setWhisper(`${displayName(s)} is ready for another round whenever you are.`);
              paint();
            });
            setWhisper(`${displayName(s)} brings the ball back with a very proud expression.`);
            paint();
          }
        };
        ball.addEventListener('pointerdown', tap);
      },
    });
    return close;
  }

  root.querySelector('[data-page-prev]')?.addEventListener('click', () => {
    Sfx.click();
    goToPage(hollowPage - 1);
  });
  root.querySelector('[data-page-next]')?.addEventListener('click', () => {
    Sfx.click();
    goToPage(hollowPage + 1);
  });
  root.querySelector('[data-page-select]')?.addEventListener('change', (event) => {
    Sfx.click();
    goToPage(Number(event.target.value));
  });

  applyStageLook();
  resetPageToActive();
  renderRoster();
  paint();

  const unsub = subscribeState((detail) => {
    if (detail.type === 'ambient') return;
    const full = roster();
    const ids = visibleRoster(full).map((s) => s.id).join('|');
    if (ids !== rosterSignature || pageCount(full) !== pagerPages) renderRoster();
    paint();
    if (detail.type === 'world') applyStageLook();
  });

  const moveTimer = setInterval(() => { moveSprites(); paint(); }, 3000);
  const ambientTimer = setInterval(ambientInteraction, 9000);
  const whisperTimer = setInterval(ambientWhisper, 12000);
  const sceneSig = () => state.theme.scene;
  let lastScene = sceneSig();
  const sceneTimer = setInterval(() => {
    if (sceneSig() !== lastScene) {
      lastScene = sceneSig();
      applyStageLook();
      decorEl.innerHTML = buildSceneDecor(lastScene);
    }
  }, 800);
  const clockTimer = setInterval(() => {
    applyStageLook();
    paintGiftChip();
  }, 1000);

  const stopFlightCard = typeof mountFlightCard === 'function' ? mountFlightCard(root) : () => {};

  const stopSecondFlightCard = typeof mountSecondFlightCard === 'function' ? mountSecondFlightCard(root) : () => {};

  const stopHandoffNudge = typeof mountHandoffNudge === 'function' ? mountHandoffNudge(root) : () => {};

  const cleanup = () => {
    stopFlightCard();
    stopSecondFlightCard();
    stopHandoffNudge();
    unsub();
    clearInterval(moveTimer);
    clearInterval(ambientTimer);
    clearInterval(whisperTimer);
    clearInterval(sceneTimer);
    clearInterval(clockTimer);
  };
  return cleanup;
}

/* ---------------- Puffle Hotel ---------------- */

/* The quick care-dock version of the salon: six strokes with the right tool,
   then the same state action the hotel and spa game use. */
function openGroomCareModal(part = 'hair', spriteId = null) {
  const s = (spriteId && typeof findSprite === 'function' ? findSprite(spriteId) : null) || activeSprite();
  if (!s || s.stage === 'egg') {
    toast('Hatch a sprite first, then bring them to the salon.', '🪮');
    return;
  }
  const isHair = part === 'hair';
  const isFloss = part === 'floss';
  const total = 6;
  let strokes = 0;
  let finished = false;
  const { close } = openModal({
    title: isHair ? `Brush ${displayName(s)}'s hair` : isFloss ? `Floss ${displayName(s)}'s teeth` : `Brush ${displayName(s)}'s teeth`,
    sub: isHair ? 'Tap and sweep the brush through the fluff. Six good strokes.' : isFloss ? 'Slide the floss between every sparkle. Six gentle passes.' : 'Tap the brush over every little sparkle. Six bright strokes.',
    dismissible: true,
    body: `<div class="groom-stage ${isHair ? 'is-hair' : isFloss ? 'is-floss' : 'is-teeth'}" data-groom-stage>
        <span class="groom-glow" aria-hidden="true"></span>
        <span class="groom-spark a" aria-hidden="true">✨</span>
        <span class="groom-spark b" aria-hidden="true">✨</span>
        <div class="groom-sprite" data-groom-sprite>${spriteSVG(s, { expr: 'happy' })}</div>
        <button class="groom-brush" type="button" data-groom-brush aria-label="${isHair ? 'Brush hair' : isFloss ? 'Floss teeth' : 'Brush teeth'}">${isHair ? '🪮' : isFloss ? '🦷' : '🪥'}</button>
        <div class="groom-bubbles" aria-hidden="true"><i>🫧</i><i>🫧</i><i>✨</i></div>
      </div>
      <div class="bar clean" style="height:9px;margin-top:10px"><i data-groom-bar style="width:0%"></i></div>
      <div class="hatch-hint" data-groom-hint>0 / ${total} ${isFloss ? 'passes' : 'strokes'}</div>`,
    onMount: (overlay) => {
      const stage = overlay.querySelector('[data-groom-stage]');
      const brush = overlay.querySelector('[data-groom-brush]');
      const bar = overlay.querySelector('[data-groom-bar]');
      const hint = overlay.querySelector('[data-groom-hint]');
      const stroke = (event) => {
        if (finished) return;
        const rect = stage.getBoundingClientRect();
        brush.style.left = `${Math.max(8, Math.min(rect.width - 50, event.clientX - rect.left - 24))}px`;
        brush.style.top = `${Math.max(8, Math.min(rect.height - 56, event.clientY - rect.top - 28))}px`;
        brush.classList.remove('is-brushing');
        void brush.offsetWidth;
        brush.classList.add('is-brushing');
        strokes += 1;
        bar.style.width = `${(strokes / total) * 100}%`;
        hint.textContent = `${strokes} / ${total} ${isFloss ? 'passes' : 'strokes'}`;
        burstAt(event.clientX, event.clientY, isHair ? ['🪮', '✨', '🫧'] : isFloss ? ['🦷', '✨', '💙'] : ['🪥', '✨', '💙'], 3);
        Sfx.pop();
        if (strokes >= total) {
          finished = true;
          stage.classList.add('is-done');
          const res = isHair ? Actions.brushHair(s.id) : isFloss ? Actions.flossTeeth(s.id) : Actions.brushTeeth(s.id);
          if (res.cooled) {
            hint.textContent = 'Still fresh from the last clean — give it a moment.';
            toast(`${displayName(s)} is already looking polished.`, isHair ? '🪮' : isFloss ? '🦷' : '🪥');
          } else {
            hint.textContent = isHair ? 'Fluff brushed, shine restored!' : isFloss ? 'Flossed, polished and gleaming!' : 'Teeth brushed, smile sparkling!';
            toast(`${displayName(s)} loves the ${isHair ? 'hair brush' : isFloss ? 'floss' : 'tooth brush'}!`, isHair ? '🪮' : isFloss ? '🦷' : '🪥');
            if (res.careGift) toast(`🏨 Hotel Care Bonus: +${res.careGift.coins} coins · +${res.careGift.xp} XP`, '🏨');
            Sfx.win();
          }
          setTimeout(() => {
            close();
            if (typeof App !== 'undefined' && App.refresh) App.refresh();
          }, 820);
        }
      };
      stage.addEventListener('pointerdown', stroke);
    },
  });
}

function openMouthwashSheet(spriteId = null) {
  const s = (spriteId && typeof findSprite === 'function' ? findSprite(spriteId) : null) || activeSprite();
  if (!s || s.stage === 'egg') {
    toast('Hatch a sprite first, then visit the Mouthwash Bar.', '🧴');
    return;
  }
  const hyg = hygieneOf(s);
  const flavors = Object.values(HOTEL_FLAVORS);
  const { close } = openSheet({
    title: '🧴 Mouthwash Bar',
    sub: `${displayName(s)} · Breath ${Math.round(hyg.breath)}/100. Pick a flavour for a fresh rinse.`,
    body: `<div class="hotel-flavor-grid">${flavors.map((flavor) => `
        <button class="hotel-flavor" type="button" data-flavor="${flavor.key}" style="--flavor:${flavor.color}">
          <span class="hf-icon">${flavor.emoji}</span>
          <span class="hf-copy"><b>${esc(flavor.name)}</b><small>${esc(flavor.desc)}</small></span>
        </button>`).join('')}</div>
      <p class="tiny muted" style="margin:8px 2px 0;line-height:1.5">Every flavour rinses breath and teeth, and the little bonuses vary. The bar is free for hotel guests.</p>`,
    onMount: (overlay) => {
      overlay.querySelectorAll('[data-flavor]').forEach((button) => {
        button.addEventListener('click', () => {
          const flavor = HOTEL_FLAVORS[button.dataset.flavor];
          const res = Actions.mouthwash(s.id, button.dataset.flavor);
          if (!res.ok) { toast('That flavour is not on the shelf.', '🧴'); return; }
          if (res.cooled) {
            toast(`${displayName(s)} is still minty from the last rinse.`, '🧴');
            return;
          }
          Sfx.bath();
          burstOn(button, [flavor.emoji, '✨', '🫧'], 8);
          close();
          toast(`${displayName(s)} swishes ${flavor.name} and grins. Breath ${Math.round(res.hygiene.breath)}/100!`, flavor.emoji);
          if (res.careGift) toast(`🏨 Hotel Care Bonus: +${res.careGift.coins} coins · +${res.careGift.xp} XP`, '🏨');
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
        });
      });
    },
  });
}

function hotelStat(label, value, tone) {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  return `<div class="hotel-stat"><span>${label}</span><div class="bar ${tone}"><i style="width:${pct}%"></i></div><b>${pct}</b></div>`;
}

function hotelScreen(root) {
  const guests = state.sprites.filter((s) => s && s.stage !== 'egg' && !s.retired);
  const active = activeSprite();
  const guest = (active && active.stage !== 'egg' && !active.retired ? active : guests[0]) || null;
  if (!guest) {
    root.innerHTML = `<div class="screen-head"><div><div class="eyebrow">Puffle Hotel</div><h1>Lobby & Spa</h1><p>Every guest gets the full care treatment.</p></div></div>
      <div class="card empty-state"><div style="font-size:38px">🏨</div><h3 style="font-size:16px;margin:8px 0 4px">The lobby is quiet</h3><p>Hatch a sprite first, then check in for a spa day.</p><button class="btn btn-primary" type="button" data-hotel-back style="margin-top:12px">Back to the Hollow</button></div>`;
    root.querySelector('[data-hotel-back]')?.addEventListener('click', () => App.go('hollow'));
    return null;
  }
  const hyg = hygieneOf(guest);
  const tokens = Math.max(0, Number(state.hotel?.careTokens) || 0);
  const careIn = typeof hotelCareIn === 'function' ? hotelCareIn() : 3;
  const careGifts = Math.max(0, Number(state.hotel?.careGifts) || 0);
  const serviceStations = Object.values(HOTEL_SERVICES).map((service) => `
    <button class="hotel-station" type="button" data-hotel-service="${service.key}">
      <span class="hs-icon">${service.icon}</span>
      <span class="hs-copy"><b>${esc(service.name)}</b><small>${esc(service.desc)}</small></span>
      <span class="hs-price">${icon('coin')}${service.price}</span>
    </button>`).join('');
  const menu = (typeof HOTEL_CARE_KEYS !== 'undefined' ? HOTEL_CARE_KEYS : [])
    .filter((key) => FOODS[key]).map((key) => {
      const item = FOODS[key];
      const kindLabel = item.hotelKind === 'meal' ? 'Meal' : item.hotelKind === 'drink' ? 'Drink' : 'Treat';
      return `<button class="food-card hotel-food" type="button" data-hotel-order="${key}">
        <span class="food-emoji">${item.emoji}</span>
        <span style="flex:1"><h4>${esc(item.name)} <span class="hotel-kind">${kindLabel}</span></h4><p>${esc(item.desc)}</p></span>
        <span class="price">${icon('coin')}${item.price}</span>
      </button>`;
    }).join('');

  root.innerHTML = `
    <div class="hotel-page">
      <div class="screen-head hotel-head">
        <div><div class="eyebrow">🏨 Puffle Hotel</div><h1>Lobby & Spa</h1><p>A whole floor of fluffy care: salon, tooth spa, mouthwash bar, warm towels and room service.</p></div>
        <button class="icon-btn" type="button" data-hotel-back aria-label="Back to the Hollow">←</button>
      </div>
      <section class="hotel-hero">
        <span class="hotel-sky" aria-hidden="true"><i>✦</i><i>🫧</i><i>✦</i><i>🫧</i></span>
        <div class="hotel-bell" aria-hidden="true">🛎️</div>
        <div class="hotel-guest-art">${spriteSVG(guest, { expr: guest.asleep ? 'sleep' : 'happy' })}</div>
        <div class="hotel-guest-copy">
          <span class="eyebrow">In residence</span>
          <h2>${esc(displayName(guest))}</h2>
          <p class="tiny muted">Lv ${guest.level} · ${esc((ELEMENTS[guest.element] || {}).name || 'Sprite')} · Room ${String((guests.indexOf(guest) % 9) + 1).padStart(2, '0')}</p>
          <div class="hotel-stats">
            ${hotelStat('Hair', hyg.hair, 'hotel-hair')}
            ${hotelStat('Teeth', hyg.teeth, 'hotel-teeth')}
            ${hotelStat('Breath', hyg.breath, 'hotel-breath')}
          </div>
        </div>
      </section>
      <div class="hotel-guests" role="group" aria-label="Choose a hotel guest">${guests.slice(0, 18).map((s) => `<button class="hotel-guest-chip ${s.id === guest.id ? 'on' : ''}" type="button" data-hotel-guest="${s.id}">${esc(displayName(s))}</button>`).join('')}</div>
      <button class="hotel-spa-banner" type="button" data-hotel-spa>
        <span class="hsb-icon">✨🪮🪥</span>
        <span class="hsb-copy"><b>Brush &amp; Bliss</b><small>Play the salon mini-game to brush hair and teeth, earn a care bonus, and bring home a hotel treat, drink or meal.</small></span>
        <span class="hsb-go">Play →</span>
      </button>
      <div class="hotel-grid">
        <button class="hotel-station" type="button" data-hotel-hair>
          <span class="hs-icon">🪮</span><span class="hs-copy"><b>Hair Salon</b><small>Six sweeping strokes through the fluff.</small></span><span class="hs-price">Free</span>
        </button>
        <button class="hotel-station" type="button" data-hotel-teeth>
          <span class="hs-icon">🪥</span><span class="hs-copy"><b>Tooth Spa</b><small>Brush and polish the tiny smile.</small></span><span class="hs-price">Free</span>
        </button>
        <button class="hotel-station" type="button" data-hotel-floss>
          <span class="hs-icon">🦷</span><span class="hs-copy"><b>Floss &amp; Polish</b><small>Six gentle passes for the pearly whites.</small></span><span class="hs-price">Free</span>
        </button>
        <button class="hotel-station" type="button" data-hotel-mouthwash>
          <span class="hs-icon">🧴</span><span class="hs-copy"><b>Mouthwash Bar</b><small>Six flavours, one very fresh finish.</small></span><span class="hs-price">Free</span>
        </button>
        <button class="hotel-station" type="button" data-hotel-bath>
          <span class="hs-icon">🛁</span><span class="hs-copy"><b>Bubble Bath</b><small>Warm suds and a cloud of fluff.</small></span><span class="hs-price">Free</span>
        </button>
        ${serviceStations}
      </div>
      <div class="card hotel-bonus-card">
        <div class="between"><span class="eyebrow">🏨 Care Bonus</span><span class="chip">${careGifts} claimed</span></div>
        <h3>${careIn === 1 ? 'One more care moment' : `${careIn} more care moments`} until the next Hotel Care Bonus.</h3>
        <p class="tiny muted">Brushing, rinsing, spa services and room service all count. The bonus wraps coins, XP and a hotel meal; every spa run also brings home a treat or drink.</p>
        <div class="bar clean" style="height:8px;margin-top:9px"><i style="width:${((tokens % 3) / 3) * 100}%"></i></div>
        <div class="tiny muted" style="margin-top:5px">${tokens} care moment${tokens === 1 ? '' : 's'} completed</div>
      </div>
      <div class="section-title" id="hotel-menu" style="scroll-margin-top:12px"><h2>🍽️ Room Service</h2><span>hotel-only treats, drinks and meals</span></div>
      <div class="list-gap">${menu || '<div class="tiny muted">The kitchen is still warming up.</div>'}</div>
      <button class="btn btn-soft btn-block" type="button" data-hotel-back style="margin-top:12px">Back to the Hollow</button>
    </div>`;

  root.querySelectorAll('[data-hotel-back]').forEach((button) => button.addEventListener('click', () => App.go('hollow')));
  root.querySelectorAll('[data-hotel-guest]').forEach((button) => button.addEventListener('click', () => {
    Actions.setActive(button.dataset.hotelGuest);
    Sfx.click();
    App.refresh();
  }));
  root.querySelector('[data-hotel-spa]')?.addEventListener('click', () => {
    Sfx.click();
    if (typeof openPuffleSpaGame === 'function') openPuffleSpaGame();
  });
  root.querySelector('[data-hotel-hair]')?.addEventListener('click', () => openGroomCareModal('hair', guest.id));
  root.querySelector('[data-hotel-teeth]')?.addEventListener('click', () => openGroomCareModal('teeth', guest.id));
  root.querySelector('[data-hotel-floss]')?.addEventListener('click', () => openGroomCareModal('floss', guest.id));
  root.querySelector('[data-hotel-mouthwash]')?.addEventListener('click', () => openMouthwashSheet(guest.id));
  root.querySelector('[data-hotel-bath]')?.addEventListener('click', () => {
    const res = Actions.bathe(guest.id);
    if (res.cooled) { toast(`${displayName(guest)} is still fresh from the last bath.`, '🛁'); return; }
    Sfx.bath();
    toast(`${displayName(guest)} sinks into the bubbles. Squeaky clean!`, '🛁');
    App.refresh();
  });
  root.querySelectorAll('[data-hotel-service]').forEach((button) => button.addEventListener('click', () => {
    const res = Actions.hotelCare(guest.id, button.dataset.hotelService);
    if (!res.ok) {
      toast(res.reason === 'coins' ? `You need ${res.need || 0} more coins for that service.` : 'That service is unavailable right now.', '🏨');
      Sfx.error();
      return;
    }
    Sfx.win();
    toast(`${res.service.icon} ${res.service.name} for ${displayName(guest)}!`, res.service.icon);
    if (res.careGift) toast(`🏨 Hotel Care Bonus: +${res.careGift.coins} coins · +${res.careGift.xp} XP`, '🏨');
    App.refresh();
  }));
  root.querySelectorAll('[data-hotel-order]').forEach((button) => button.addEventListener('click', () => {
    const res = Actions.orderHotelFood(guest.id, button.dataset.hotelOrder);
    if (!res.ok) {
      if (res.reason === 'coins') toast(`You need ${res.need || 0} more coins for that order.`, '🪙');
      else if (res.reason === 'full') toast(`${displayName(guest)} is too full for room service.`, '😅');
      else toast('The kitchen could not send that order.', '🍽️');
      Sfx.error();
      return;
    }
    Sfx.eat();
    toast(`${displayName(guest)} enjoys ${res.food.emoji} ${res.food.name} in the room-service nook.`, res.food.emoji);
    if (res.careGift) toast(`🏨 Hotel Care Bonus: +${res.careGift.coins} coins · +${res.careGift.xp} XP`, '🏨');
    App.refresh();
  }));
  return null;
}
