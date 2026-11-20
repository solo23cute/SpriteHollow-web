/* Studio: customize the whole game and every sprite's look. */

const DYE_PRESETS = [
  '#ffb3d1', '#ff9f68', BRAND.gold, '#a8d982', '#8fe0c0', '#5ad6ff', '#8be9ff', '#b69cff', '#ff7ac8', '#e8e6f0',
  '#c9a227', '#1d1734', '#6c7bd9', '#f2687e', '#7fe0c8', '#8b5fbf', '#ff8a3d', '#f0b429', '#4a4d5c', '#7affd8',
];

/* The sprite colour wheel works in HSL while dyes are stored as hex, so these
   convert between the two. Kept local to Studio rather than in util.js. */
function wheelHslRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lum = Math.min(100, Math.max(0, l)) / 100;
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n) => {
    const k = (n + hue / 30) % 12;
    return lum - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 };
}
function wheelHslHex(h, s, l) {
  return rgbToHex(wheelHslRgb(h, s, l));
}
function wheelHexHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
  }
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  return { h, s: s * 100, l: l * 100 };
}

/* Rim contrast guard. The frame is a visual boundary, so it uses the 3:1
   graphical-object threshold rather than the 4.5:1 text threshold. It is
   checked against both the page backdrop and the panel colour because the rim
   travels over both. */
const FRAME_CONTRAST_MIN = 3;
const FRAME_CONTRAST_FIX = 3.15;
const FRAME_COLOR_LABELS = { a: 'First', b: 'Second', c: 'Glow' };

function frameRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function frameContrastRatio(a, b) {
  const x = frameRelativeLuminance(a);
  const y = frameRelativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function frameBackdrops() {
  const fallback = typeof THEMES !== 'undefined' ? (THEMES[state?.theme?.ui] || THEMES.prism) : { bg: '#0b0a16', bg2: '#14112b' };
  const css = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const pick = (name, key) => {
    const value = css ? String(css.getPropertyValue(name) || '').trim() : '';
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback[key];
  };
  return [pick('--bg', 'bg'), pick('--bg-2', 'bg2')];
}

function frameContrastFloor(hex, backgrounds) {
  return Math.min(...backgrounds.map((background) => frameContrastRatio(hex, background)));
}

function frameHighContrastColor(hex, backgrounds) {
  if (!/^#[0-9a-f]{6}$/i.test(String(hex || ''))) return hex;
  if (frameContrastFloor(hex, backgrounds) >= FRAME_CONTRAST_FIX) return hex;
  const white = frameContrastFloor('#ffffff', backgrounds);
  const black = frameContrastFloor('#000000', backgrounds);
  const target = white >= black ? '#ffffff' : '#000000';
  for (let step = 0.04; step <= 1; step += 0.04) {
    const candidate = mix(hex, target, step);
    if (frameContrastFloor(candidate, backgrounds) >= FRAME_CONTRAST_FIX) return candidate;
  }
  return target;
}

let studioSpriteQuery = '';
let studioTypeFilter = '';

function openStudioSheet(opts = {}) {
  let targetId = opts.spriteId || state.activeId || grownSprites()[0]?.id || null;
  const tourResume = typeof tourSavedProgress === 'function' ? tourSavedProgress() : { step: 0, total: 0, resume: false };
  let unsub = null;
  let skipNextCustomizePaint = false;
  const imageLimit = typeof SaveIntegrity !== 'undefined' && typeof SaveIntegrity.titleImageLimit === 'function'
    ? SaveIntegrity.titleImageLimit()
    : null;
  const maxImageBytes = imageLimit ? imageLimit.maxBytes : 96 * 1024;
  const maxImageLabel = `${Math.round(maxImageBytes / 1024)} KB`;

  const body = `
    <div data-preview-wrap></div>
    <div class="card gene-lab-entry">
      <div>
        <b>👗 Seasonal Wardrobe</b>
        <span class="tiny muted" style="display:block;margin-top:2px">Matching Sprite and Puffle sets, dyes, effects and saved looks.</span>
      </div>
      <button class="btn btn-primary btn-sm" type="button" data-wardrobe-open data-sprite-id="${targetId || ''}">Open wardrobe</button>
    </div>
    <div class="card gene-lab-entry">
      <div>
        <b>🧬 Gene Lab</b>
        <span class="tiny muted" style="display:block;margin-top:2px">Splice two species into a brand-new one and keep it in your Hollow.</span>
      </div>
      <button class="btn btn-primary btn-sm" type="button" data-gene-lab>Open lab</button>
    </div>
    <div class="studio-sprite-search">
      <input class="type-search" type="search" data-studio-search placeholder="Find a sprite by name or type…" aria-label="Find a sprite" autocomplete="off">
      <button class="studio-search-clear" type="button" data-studio-clear aria-label="Clear search" hidden>${icon('close')}</button>
    </div>
    <div class="studio-type-chips" data-studio-types></div>
    <div class="style-picker" data-sprite-picker style="margin-top:6px"></div>

    <div class="section-title"><h2>Body</h2><span>breed shape</span></div>
    <div class="style-picker" data-bodies></div>

    <div class="section-title"><h2>Colors</h2><span>dye job</span></div>
    <div class="style-picker" data-palettes></div>

    <div class="section-title"><h2>Pattern</h2></div>
    <div class="style-picker" data-patterns></div>

    <div class="section-title"><h2>Head shape</h2><span>silhouette</span></div>
    <div class="style-picker" data-heads></div>

    <div class="section-title"><h2>Puffle shape</h2><span>Club Penguin silhouettes</span></div>
    <div class="style-picker" data-shapes></div>

    <div class="section-title"><h2>Fur</h2><span>the puffle coat</span></div>
    <div class="style-picker" data-furs></div>
    <div class="fur-strip" data-fur-strip aria-label="Fur coat preview strip"></div>
    <div class="fur-locks" data-fur-locks aria-label="Earned coat progress"></div>
    <div class="card" style="margin:6px 0 10px;padding:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <input type="range" min="0" max="100" step="5" value="65" data-fur-cover aria-label="Fur coverage" style="flex:1 1 auto;min-width:0">
        <b data-fur-cover-readout style="min-width:44px;text-align:right;font-size:12px">65%</b>
      </div>
      <p class="tiny muted" style="margin:6px 2px 0">Light coat to shaggy — how much of the body the fur fills.</p>
    </div>
    <div class="custom-maker-row" style="margin:8px 0 12px;align-items:center">
      <label class="color-field"><input type="color" data-fur-tip><span class="cf-meta"><b>Fur tip</b><i data-fur-tip-hex></i></span></label>
      <label class="color-field"><input type="color" data-fur-accent><span class="cf-meta"><b>Fur accent</b><i data-fur-accent-hex></i></span></label>
      <button class="btn btn-ghost btn-sm" type="button" data-fur-reset>Palette fur</button>
    </div>

    <div class="section-title"><h2>Hue</h2><span>turn the whole colourway</span></div>
    <div class="card custom-maker" style="padding:12px">
      <div class="custom-maker-row" style="align-items:center">
        <input type="range" min="0" max="359" step="1" value="0" data-hue-slider aria-label="Sprite hue" style="flex:1 1 auto;min-width:0">
        <b data-hue-readout style="min-width:54px;text-align:right;font-size:12px">0°</b>
      </div>
      <p class="tiny muted" style="margin:6px 2px 0">Rotates every colour on this sprite, so its own palette and any custom dye both follow.</p>
      <button class="btn btn-ghost btn-sm btn-block" type="button" data-hue-reset style="margin-top:8px">Reset hue</button>
    </div>

    <div class="section-title"><h2>Hair</h2><span>wavy, curly or raggedy</span></div>
    <div class="style-picker" data-hair></div>

    <div class="section-title"><h2>Hats &amp; crowns</h2><span>worn over the hair</span></div>
    <div class="style-picker" data-hats></div>

    <div class="section-title"><h2>Scarves &amp; bows</h2><span>around the neck</span></div>
    <div class="style-picker" data-scarves></div>

    <div class="section-title"><h2>Ears</h2><span>an extra set, on top of the breed</span></div>
    <div class="style-picker" data-ears></div>

    <div class="section-title"><h2>Wings</h2><span>round wings · your own colour</span></div>
    <div class="style-picker" data-wings></div>
    <div class="custom-maker-row" style="margin:8px 0 12px;align-items:center">
      <label class="color-field"><input type="color" data-wing-color><span class="cf-meta"><b>Wing colour</b><i data-wing-color-hex></i></span></label>
      <button class="btn btn-ghost btn-sm" type="button" data-wing-reset>Palette wings</button>
    </div>

    <div class="section-title"><h2>Eyes</h2><span>shape, iris colour, or the rolled face</span></div>
    <div class="style-picker" data-eyes></div>
    <div class="style-picker" data-iris-presets style="margin:0 0 10px"></div>
    <div class="custom-maker-row" style="margin:2px 0 12px;align-items:center">
      <label class="color-field"><input type="color" data-iris><span class="cf-meta"><b>Iris</b><i data-iris-hex></i></span></label>
      <button class="btn btn-ghost btn-sm" type="button" data-face-reset>\u{1F3B2} Rolled face</button>
    </div>

    <div class="section-title"><h2>Mouth</h2><span>expression you choose</span></div>
    <div class="style-picker" data-mouths></div>

    <div class="section-title"><h2>Lumi sheet</h2><span>animated sprite-sheet skin</span></div>
    <div class="style-picker" data-lumi-skins></div>

    <div class="section-title"><h2>Nose</h2><span>between the eyes and the mouth</span></div>
    <div class="style-picker" data-noses></div>

    <div class="section-title"><h2>Arms</h2><span>little limbs · all animated</span></div>
    <div class="style-picker" data-arms></div>

    <div class="section-title"><h2>Legs</h2><span>how they stand</span></div>
    <div class="style-picker" data-legs></div>

    <div class="section-title"><h2>Custom dye</h2><span>all five colours</span></div>
    <div class="card custom-maker">
      <div class="dye-presets" data-dye-presets></div>
      <div class="custom-maker-row dye-fields">
        <label class="color-field"><input type="color" data-dye="body"><span class="cf-meta"><b>Body</b><i data-dye-hex="body"></i></span></label>
        <label class="color-field"><input type="color" data-dye="light"><span class="cf-meta"><b>Light</b><i data-dye-hex="light"></i></span></label>
        <label class="color-field"><input type="color" data-dye="deep"><span class="cf-meta"><b>Deep</b><i data-dye-hex="deep"></i></span></label>
        <label class="color-field"><input type="color" data-dye="accent"><span class="cf-meta"><b>Accent</b><i data-dye-hex="accent"></i></span></label>
        <label class="color-field"><input type="color" data-dye="belly"><span class="cf-meta"><b>Belly</b><i data-dye-hex="belly"></i></span></label>
      </div>
      <button class="btn btn-ghost btn-sm btn-block" type="button" data-dye-natural style="margin-top:8px">Use natural colours</button>
    </div>

    <div class="section-title"><h2>Accessory</h2></div>
    <div class="style-picker" data-accessories></div>

    <div class="section-title"><h2>Egg decorator</h2><span data-egg-note>paint a waiting shell</span></div>
    <div class="card egg-decor-card">
      <div class="egg-decor-art" data-egg-preview></div>
      <div class="egg-strip" data-egg-choices></div>
      <div class="tiny muted studio-mini-title">Shell pattern</div>
      <div class="egg-pattern-grid" data-egg-patterns></div>
      <div class="tiny muted studio-mini-title">Shell colour<span class="egg-palette-name" data-egg-palette-name></span></div>
      <div class="decor-palettes" data-egg-palettes></div>
    </div>

    <div class="section-title"><h2>Custom clothes</h2><span>unlimited · saved on this device</span></div>
    <div class="card custom-maker cloth-maker">
      <div class="cloth-edit-note" data-cloth-edit-note hidden></div>
      <div class="cloth-preview" data-cloth-preview></div>
      <div class="custom-maker-grid">
        <input id="cloth-name" maxlength="24" placeholder="Outfit name" aria-label="Outfit name">
        <select id="cloth-style" aria-label="Outfit style">
          ${CUSTOM_CLOTH_STYLE_KEYS.map((key) => `<option value="${key}">${CUSTOM_CLOTH_STYLES[key].icon} ${CUSTOM_CLOTH_STYLES[key].name}</option>`).join('')}
        </select>
        <select id="cloth-pattern" aria-label="Outfit pattern">
          ${CUSTOM_CLOTH_PATTERN_KEYS.map((key) => `<option value="${key}">${CUSTOM_CLOTH_PATTERNS[key]}</option>`).join('')}
        </select>
        <select id="cloth-stitch" aria-label="Stitch size">
          ${CUSTOM_CLOTH_SIZE_KEYS.map((key) => `<option value="${key}"${key === 'medium' ? ' selected' : ''}>${CUSTOM_CLOTH_SIZES[key].name} stitch</option>`).join('')}
        </select>
      </div>
      <div class="custom-maker-row">
        <label class="color-field">Main <input type="color" id="cloth-primary" value="${BRAND.accent}"></label>
        <label class="color-field">Trim <input type="color" id="cloth-secondary" value="${BRAND.gold}"></label>
        <button class="btn btn-sm btn-primary" data-add-cloth>${icon('plus')} Add clothes</button>
      </div>
    </div>
    <div class="custom-list" data-custom-clothes></div>

    <button class="btn btn-soft btn-block" data-randomize style="margin-top:10px">${icon('dice')} Surprise me</button>

    <div class="divider" style="margin:20px 0 14px"></div>
    <div class="section-title" style="margin-top:0"><h2>Your Hollow</h2></div>
    <div class="row" style="gap:8px">
      <input id="hollow-name" maxlength="22" value="${esc(state.hollowName)}" placeholder="Name your hollow" style="flex:1;min-width:0;padding:12px 14px;border-radius:13px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--text);outline:none;font-size:13px;font-weight:800">
      <button class="btn btn-sm btn-primary" data-save-name>Save</button>
    </div>

    <div class="section-title"><h2>UI theme</h2><span>colours & glow</span></div>
    <div class="theme-grid" data-themes></div>

    <div class="section-title"><h2>Frame studio</h2><span>colours &amp; motion</span></div>
    <div class="card frame-studio" data-frame-studio>
      <div class="frame-studio-preview" data-frame-preview aria-hidden="true"></div>
      <div class="frame-preview-context" data-frame-context-preview aria-hidden="true"></div>
      <div class="frame-mode-row" role="group" aria-label="Frame colour source">
        <button class="style-opt" type="button" data-frame-mode="daily" aria-pressed="false">Daily auto</button>
        <button class="style-opt" type="button" data-frame-mode="custom" aria-pressed="false">Custom colours</button>
      </div>
      <div class="custom-maker-row frame-color-row">
        <label class="color-field"><input type="color" data-frame-color="a" aria-label="First frame colour"><span class="cf-meta"><b>First</b><i data-frame-hex="a"></i></span></label>
        <label class="color-field"><input type="color" data-frame-color="b" aria-label="Second frame colour"><span class="cf-meta"><b>Second</b><i data-frame-hex="b"></i></span></label>
        <label class="color-field"><input type="color" data-frame-color="c" aria-label="Frame glow colour"><span class="cf-meta"><b>Glow</b><i data-frame-hex="c"></i></span></label>
      </div>
      <label class="frame-intensity">
        <span class="frame-intensity-head"><b>Rim intensity</b><i data-frame-intensity-readout>100%</i></span>
        <input type="range" min="35" max="100" step="1" value="100" data-frame-intensity aria-label="Frame rim intensity">
        <span class="frame-intensity-scale"><span>Faint</span><span>Full</span></span>
      </label>
      <div class="frame-contrast" data-frame-contrast hidden>
        <span class="frame-contrast-icon" aria-hidden="true">⚠️</span>
        <span class="frame-contrast-copy"><b>Hard to see</b><span data-frame-contrast-text role="status" aria-live="polite"></span></span>
        <button class="btn btn-soft btn-sm" type="button" data-frame-contrast-fix>Fix contrast</button>
      </div>
      <div class="frame-motion-list" data-frame-motions></div>
      <div class="frame-presets" data-frame-presets>
        <div class="frame-presets-head">
          <div><b>Saved palettes</b><span class="tiny muted" data-frame-preset-count></span></div>
          <span class="tiny muted">Daily auto stays automatic</span>
        </div>
        <div class="frame-preset-save">
          <input class="type-search" type="text" maxlength="24" data-frame-preset-name placeholder="Name this palette" aria-label="Name this frame palette" autocomplete="off">
          <button class="btn btn-primary btn-sm" type="button" data-frame-preset-save>Save palette</button>
        </div>
        <div class="frame-preset-list" data-frame-preset-list></div>
        <p class="tiny muted frame-preset-hint">A saved palette keeps the visible colours and motion. Using one switches to Custom colours; Daily auto is untouched.</p>
        <div class="frame-preset-import">
          <input class="type-search" type="text" data-frame-import-code placeholder="Paste a share code" aria-label="Paste a frame share code" autocomplete="off" spellcheck="false">
          <button class="btn btn-soft btn-sm" type="button" data-frame-import>Import</button>
        </div>
        <p class="tiny muted frame-preset-status" data-frame-preset-status role="status" aria-live="polite"></p>
      </div>
      <div class="between frame-studio-foot">
        <span class="tiny muted" data-frame-note></span>
        <button class="btn btn-ghost btn-sm" type="button" id="frame-reset">Daily colours</button>
      </div>
    </div>

    <div class="section-title"><h2>Personaliser</h2><span>sprite colours, fonts &amp; UI colours</span></div>
    <div class="card custom-maker personaliser-card">
      <div class="font-picker" data-fonts></div>
      <div class="wheel-block" data-wheel-block>
        <div class="tiny muted studio-mini-title">Sprite colours<span class="wheel-slot-name" data-wheel-slot-name></span></div>
        <div class="wheel-row">
          <div class="wheel-wrap">
            <canvas class="color-wheel" data-color-wheel width="132" height="132" tabindex="0" role="slider"
              aria-label="Sprite colour wheel — arrow keys pick a colour, Enter applies it"></canvas>
            <span class="wheel-dot" data-wheel-dot></span>
          </div>
          <div class="wheel-side">
            <div class="wheel-slots" data-wheel-slots></div>
            <label class="wheel-light"><span>Light</span><input type="range" min="10" max="90" step="1" value="58" data-wheel-light aria-label="Colour lightness"></label>
            <div class="wheel-readout"><span class="wheel-chip" data-wheel-chip></span><b data-wheel-hex></b></div>
            <label class="wheel-hex"><span>Hex</span><input type="text" spellcheck="false" autocomplete="off" maxlength="80" placeholder="#RRGGBB or pasted colourway" data-wheel-input aria-label="Paste a hex colour or a copied colourway"></label>
            <button class="btn btn-ghost btn-sm btn-block" type="button" data-wheel-all aria-pressed="false">Dye all five: off</button>
          </div>
        </div>
      </div>
      <div class="custom-maker-row dye-fields" style="margin-top:9px">
        <label class="color-field"><input type="color" data-ui-color="accent"><span class="cf-meta"><b>Accent</b><i data-ui-hex="accent"></i></span></label>
        <label class="color-field"><input type="color" data-ui-color="accent2"><span class="cf-meta"><b>Second</b><i data-ui-hex="accent2"></i></span></label>
        <label class="color-field"><input type="color" data-ui-color="bg"><span class="cf-meta"><b>Backdrop</b><i data-ui-hex="bg"></i></span></label>
        <label class="color-field"><input type="color" data-ui-color="bg2"><span class="cf-meta"><b>Panel</b><i data-ui-hex="bg2"></i></span></label>
      </div>
      <div class="ui-preview" data-ui-preview aria-live="polite"></div>
      <button type="button" class="tiny uip-warn" data-ui-warn hidden></button>
      <div class="dye-presets" data-ui-presets style="margin-top:9px"></div>
      <div class="row personaliser-actions" style="gap:7px;margin-top:8px">
        <button class="btn btn-primary btn-sm" type="button" data-ui-apply style="flex:1">Apply to the app</button>
        <button class="btn btn-ghost btn-sm" type="button" data-ui-reset style="flex:0 0 auto">Reset</button>
      </div>
      <p class="tiny muted" data-ui-status style="margin:8px 2px 0;line-height:1.5">Both samples are live. Nothing changes in the app until you press Apply.</p>
      <button class="btn btn-ghost btn-sm btn-block" type="button" data-ui-compact title="Also turns on automatically on short screens" aria-pressed="false" style="margin-top:7px">Compact layout: off</button>
    </div>

    <div class="section-title"><h2>Core habitats</h2><span>starter &amp; gift scenes</span></div>
    <div class="scene-grid" data-scenes></div>
    <div class="section-title"><h2>Biomes &amp; habitats</h2><span>18 type biomes + 8 biome habitats · +50% XP for matches</span></div>
    <button class="btn btn-sm btn-soft btn-block" data-open-biome-atlas style="margin-bottom:8px">🧭 Open the Biome Atlas</button>
    <div class="biome-scene-grid" data-biome-scenes></div>
    <div class="habitat-info" data-habitat-info></div>

    <div class="section-title"><h2>Custom biomes</h2><span>unlimited habitats · no sprite cap</span></div>
    <div class="card custom-maker">
      <div class="custom-maker-grid custom-scene-fields">
        <input id="scene-name" maxlength="28" placeholder="Biome name" aria-label="Custom biome name">
        <input id="scene-habitat" maxlength="20" placeholder="Habitat label" aria-label="Custom habitat label">
        <input id="scene-emoji" maxlength="4" value="🌍" aria-label="Custom biome emoji">
        <select id="scene-bonus" aria-label="Custom biome XP bonus">
          <option value="0.5">+50% XP</option>
          <option value="0.45">+45% XP</option>
          <option value="0.4">+40% XP</option>
        </select>
      </div>
      <div class="custom-maker-row">
        <label class="color-field">Sky <input type="color" id="scene-sky" value="#3b2f6b"></label>
        <label class="color-field">Ground <input type="color" id="scene-ground" value="#35603d"></label>
        <label class="color-field">Glow <input type="color" id="scene-accent" value="${BRAND.gold}"></label>
      </div>
      <button class="btn btn-sm btn-primary btn-block" data-add-scene style="margin-top:8px">${icon('plus')} Create &amp; visit biomes</button>
      <p class="tiny muted" style="margin:7px 2px 0;line-height:1.5">Every custom biome welcomes every species, and all of your grown sprites can appear in it at once — there is no resident limit.</p>
    </div>
    <div class="custom-list" data-custom-scenes></div>

    <div class="section-title"><h2>Climate</h2><span>free to switch · season &amp; weather</span></div>
    <div class="style-picker" data-climates></div>
    <p class="tiny muted" data-world-note style="margin-top:8px"></p>

    <div class="section-title"><h2>Game feel</h2></div>
    <div>
      <div class="toggle-row"><div><h4>Sound effects</h4><p>Little synths for pets, coins and games.</p></div><button class="switch" data-toggle="sound" aria-label="Toggle sound"></button></div>
      <div class="toggle-row"><div><h4>Cold hatching</h4><p>Frozen and lava-frozen eggs need a cooling mode (❄️ Chill Stone or 🧊 Frost Chill). Turn this off to let any incubator warm them.</p></div><button class="switch" data-toggle="coldHatch" aria-label="Toggle cold hatching"></button></div>
      <div class="toggle-row"><div><h4>Duel status sounds</h4><p>Burn, poison, freeze, shields and cleanses call out during fights. <b data-duel-sound-note>On</b></p></div><span style="display:flex;gap:5px;align-items:center"><button class="btn btn-ghost btn-sm" type="button" data-duel-sound-test>Test</button><button class="switch" data-toggle="duelSounds" aria-label="Toggle duel status sounds"></button></span></div>
      <div class="toggle-row"><div><h4>Sprite voices</h4><p>Give each sprite its own small voice in chats, pitched by type and personality.</p></div><button class="switch" data-toggle="spriteVoice" aria-label="Toggle sprite voices"></button></div>
      <div class="toggle-row"><div><h4>Music volume</h4><p>The Hollow's slow chord loop. <b data-vol-val="musicVolume">${Number.isFinite(state.theme.musicVolume) ? state.theme.musicVolume : 65}%</b></p></div><input class="vol-slider" type="range" min="0" max="100" step="5" value="${Number.isFinite(state.theme.musicVolume) ? state.theme.musicVolume : 65}" data-vol="musicVolume" aria-label="Music volume"></div>
      <div class="toggle-row"><div><h4>Weather volume</h4><p>Rain, wind and snow beds. <b data-vol-val="weatherVolume">${Number.isFinite(state.theme.weatherVolume) ? state.theme.weatherVolume : 45}%</b></p></div><input class="vol-slider" type="range" min="0" max="100" step="5" value="${Number.isFinite(state.theme.weatherVolume) ? state.theme.weatherVolume : 45}" data-vol="weatherVolume" aria-label="Weather volume"></div>
      <div class="toggle-row"><div><h4>Summon cue volume</h4><p>Rarity fanfares when a summon lands. <b data-vol-val="summonVolume">${Number.isFinite(state.theme.summonVolume) ? state.theme.summonVolume : 100}%</b></p></div><input class="vol-slider" type="range" min="0" max="100" step="5" value="${Number.isFinite(state.theme.summonVolume) ? state.theme.summonVolume : 100}" data-vol="summonVolume" aria-label="Summon cue volume"></div>
      <div class="toggle-row"><div><h4>System reminders</h4><p>Care and check-in nudges while the app is closed.</p></div><button class="switch" data-toggle="reminders" aria-label="Toggle system reminders"></button></div>
      <div class="style-picker" data-reminder-delay style="margin-top:8px"></div>
      <p class="tiny muted" data-reminder-note style="margin-top:6px"></p>
      <div class="reminder-preview" data-reminder-preview></div>
      <button class="btn btn-soft btn-block" data-reminder-preview-btn style="margin-top:8px">🔔 Preview reminder</button>
      <button class="btn btn-ghost btn-block" data-reminder-test style="margin-top:6px">⏱️ Test in 1 minute</button>
      <div class="toggle-row"><div><h4>Motion</h4><p>Idle bouncing, particles and pops.</p></div><button class="switch" data-toggle="motion" aria-label="Toggle motion"></button></div>
      <div class="toggle-row"><div><h4>Haptics</h4><p>Gentle vibration on touch, where supported.</p></div><button class="switch" data-toggle="haptics" aria-label="Toggle haptics"></button></div>
      <div class="toggle-row"><div><h4>Fur rim</h4><p>The soft, rounded fur edge on every sprite. Off is flattest and cheapest to paint.</p></div><span style="display:flex;gap:4px;flex:0 0 auto"><button class="chip" data-fluff="off">Off</button><button class="chip" data-fluff="soft">Soft</button><button class="chip" data-fluff="strong">Strong</button></span></div>
      <div class="toggle-row"><div><h4>Element effects</h4><p>The fire, vine, bubble and spark particles that float around elemental sprites.</p></div><span style="display:flex;gap:4px;flex:0 0 auto"><button class="chip" data-fx-level="off">Off</button><button class="chip" data-fx-level="soft">Soft</button><button class="chip" data-fx-level="full">Full</button></span></div>
      <div class="toggle-row"><div><h4>Idle motion</h4><p>Calm stops the sprite bob, the floating motes and the drifting particles. Everything else keeps working.</p></div><span style="display:flex;gap:4px;flex:0 0 auto"><button class="chip" data-motion="full">Full</button><button class="chip" data-motion="calm">Calm</button></span></div>
    </div>

    <div class="section-title"><h2>Summon results</h2><span>how a big pull lands</span></div>
    <div class="toggle-row"><div><h4>Tap-to-reveal big pulls</h4><p>25×, 50× and 100× pulls on phones start face down, so each card is turned over with a tap or the Reveal all button.</p></div><button class="switch" data-toggle="summonCovers" aria-label="Toggle tap-to-reveal covers"></button></div>
    <div class="section-title"><h2>Rarity sound cues</h2><span>audition, free</span></div>
    <p class="tiny muted" style="margin:-2px 2px 8px;line-height:1.5">Every summon tier has its own layered sting. Tap a row for just its opening hit, or ▶ Full to hear the whole arrangement. Nothing is pulled and no coins are spent.</p>
    <div class="cue-lab" data-cue-lab></div>

    <div class="section-title"><h2>Voice</h2><span>spoken lines</span></div>
    <div class="style-picker" data-voice-picker></div>
    <p class="tiny muted" data-voice-note style="margin-top:6px"></p>

    <div class="section-title"><h2>${t('settings.language')}</h2><span>app, captions &amp; tour</span></div>
    <div class="style-picker" data-language-picker></div>
    <p class="tiny muted" data-language-note style="margin-top:6px"></p>

    <div class="section-title"><h2>Accessibility</h2><span>hearing support</span></div>
    <div class="toggle-row"><div><h4>${t('settings.captions')}</h4><p>${t('settings.captionsNote')}</p></div><button class="switch" data-toggle="captions" aria-label="Toggle closed captions"></button></div>

    <div class="divider" style="margin:18px 0"></div>
    <button class="btn btn-soft btn-block" data-tour-replay style="margin-bottom:10px">🧭 ${tourResume.resume ? `${t('tour.resume')} · ${tourResume.step + 1}/${tourResume.total}` : t('tour.replay')}</button>
    <button class="btn btn-ghost btn-block" data-tour-handbook style="margin-bottom:10px">📖 ${t('tour.handbook')}</button>
    ${tourResume.resume ? `<button class="btn btn-ghost btn-block" data-tour-restart style="margin-bottom:10px">↺ ${t('tour.restart')}</button>` : ''}
    <button class="btn btn-soft btn-block" data-save-backup style="margin-bottom:10px">💾 Save backup &amp; restore</button>
    <button class="btn btn-soft btn-block" data-save-slots style="margin-bottom:10px">🗂️ Hollow slots · switch saves</button>
    <button class="btn btn-soft btn-block" data-studio-health style="margin-bottom:10px">🩺 Hollow Health · check saves</button>
    <button class="btn btn-soft btn-block" data-diagnostics style="margin-bottom:10px">🧰 Support diagnostics · export</button>
    <button class="btn btn-ghost btn-block" data-reset style="color:var(--bad);border-color:color-mix(in srgb, var(--bad) 35%, transparent)">
      ${icon('trash')} Start a brand-new Hollow
    </button>
    <p class="tiny muted" style="text-align:center;margin-top:8px">This sends every sprite, egg and streak back to the start. Your coins stay with you.</p>
    <p class="tiny muted" style="text-align:center;margin-top:6px">Want to keep this Hollow and begin a fresh one beside it? Use 🗂️ Hollow slots above to start a new Hollow in its own slot.</p>
    <p class="tiny muted" style="text-align:center;margin-top:16px">Sprite Hollow v${APP_VERSION} · offline save on this device</p>
  `;

  const { overlay, close } = openSheet({
    key: 'studio',
    title: 'Studio',
    sub: 'Paint a sprite, change the mood of the whole game, name your little world.',
    onClose: () => { if (typeof Sfx !== 'undefined' && typeof Sfx.stopSummonCue === 'function') Sfx.stopSummonCue(); },
    body,
    onMount: (root, close) => {
      const getTarget = () => (targetId ? findSprite(targetId) : activeSprite());
      /* Cue lab: audition every rarity sting without pulling. The buttons own
         the same engine the results screen uses, including the clean release. */
      const cueLab = root.querySelector('[data-cue-lab]');
      if (cueLab && typeof Sfx !== 'undefined' && typeof SUMMON_CUE_SPECS !== 'undefined') {
        /* The ladder is the order, filtered to the tiers that have a cue. */
        const cueOrder = (typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER : Object.keys(SUMMON_CUE_SPECS))
          .filter((key) => SUMMON_CUE_SPECS[key]);
        const cueTier = (key) => (typeof TYPE_EGG_RARITIES !== 'undefined' && TYPE_EGG_RARITIES[key] ? TYPE_EGG_RARITIES[key] : null);
        cueLab.innerHTML = cueOrder.map((key) => {
          const spec = SUMMON_CUE_SPECS[key];
          const tier = cueTier(key);
          const color = tier && tier.color ? tier.color : '#c9cdd2';
          /* The row itself auditions only the opening hit; the Full button owns
             the whole arrangement, so the two never fight over one tap. */
          return `<div class="cue-lab-row" style="--rarity:${color}">
            <button class="cue-lab-btn" type="button" data-cue-play="${key}" title="Opening hit only">
              <span class="cl-icon">${tier && tier.icon ? tier.icon : '🎵'}</span>
              <span class="cl-copy"><b>${esc(tier && tier.name ? tier.name : key)}</b><small>${spec.length}s · ${esc(spec.theme)}</small></span>
              <span class="cl-play" aria-hidden="true">▶</span>
            </button>
            <button class="cue-full-btn" type="button" data-cue-full="${key}" aria-label="Play the full ${esc(key)} cue">▶ Full</button>
          </div>`;
        }).join('') + '<button class="btn btn-ghost btn-block" type="button" data-cue-stop style="margin-top:8px">⏹ Stop the cue</button>';
        let playing = null;
        const paintCue = (next) => {
          playing = next;
          cueLab.querySelectorAll('[data-cue-play]').forEach((button) => {
            const on = !!next && next.mode === 'hit' && button.dataset.cuePlay === next.key;
            button.classList.toggle('is-playing', on);
            const mark = button.querySelector('.cl-play');
            if (mark) mark.textContent = on ? '❚❚' : '▶';
          });
          cueLab.querySelectorAll('[data-cue-full]').forEach((button) => {
            const on = !!next && next.mode === 'full' && button.dataset.cueFull === next.key;
            button.classList.toggle('is-playing', on);
            button.textContent = on ? '❚❚ Full' : '▶ Full';
          });
        };
        const audition = (key, mode) => {
          if (playing && playing.key === key && playing.mode === mode) {
            Sfx.stopSummonCue();
            paintCue(null);
            return;
          }
          if (mode === 'hit' && typeof Sfx.summonCueOpening === 'function') Sfx.summonCueOpening(key);
          else Sfx.summonCue(key);
          paintCue({ key, mode });
          const tier = cueTier(key);
          const name = tier && tier.name ? tier.name : key;
          const secs = mode === 'hit' && typeof Sfx.summonCueOpeningLength === 'function'
            ? Sfx.summonCueOpeningLength(key)
            : Sfx.summonCueLength(key);
          toast(`${name} ${mode === 'hit' ? 'opening hit' : 'full cue'} · ${secs}s`, tier && tier.icon ? tier.icon : '🎵');
        };
        cueLab.querySelectorAll('[data-cue-play]').forEach((button) => {
          button.addEventListener('click', () => audition(button.dataset.cuePlay, 'hit'));
        });
        cueLab.querySelectorAll('[data-cue-full]').forEach((button) => {
          button.addEventListener('click', () => audition(button.dataset.cueFull, 'full'));
        });
        /* closeAllOverlays() removes the sheet without running onClose, so the
           lab watches its own root and silences the cue when the sheet goes. */
        const cueWatch = new MutationObserver(() => {
          if (!document.body.contains(root)) {
            if (typeof Sfx !== 'undefined') Sfx.stopSummonCue();
            cueWatch.disconnect();
          }
        });
        cueWatch.observe(document.body, { childList: true, subtree: true });
        cueLab.querySelector('[data-cue-stop]')?.addEventListener('click', () => {
          Sfx.stopSummonCue();
          paintCue(null);
        });
      }
      /* Duel status sounds have their own switch and a one-tap audition, so the
         calls can be muted without losing pet, coin or menu sounds. */
      const paintDuelSoundNote = () => {
        const on = !state.theme || state.theme.duelSounds !== false;
        root.querySelectorAll('[data-duel-sound-note]').forEach((note) => { note.textContent = on ? 'On' : 'Off'; });
        const test = root.querySelector('[data-duel-sound-test]');
        if (test) test.disabled = !on;
      };
      root.querySelector('[data-duel-sound-test]')?.addEventListener('click', () => {
        if (typeof Sfx === 'undefined' || typeof Sfx.duelStatus !== 'function') return;
        ['burn', 'freeze', 'poison', 'shield', 'cleanse'].forEach((kind, i) => setTimeout(() => Sfx.duelStatus(kind), i * 380));
        toast('Status calls: burn, freeze, poison, shield, cleanse.', '🔊');
      });
      root.querySelector('[data-toggle="duelSounds"]')?.addEventListener('click', () => setTimeout(paintDuelSoundNote, 0));
      paintDuelSoundNote();
      root.querySelector('[data-gene-lab]')?.addEventListener('click', () => {
        close();
        setTimeout(() => { if (typeof openGeneLab === 'function') openGeneLab(); }, 60);
      });
      /* The id of the wardrobe outfit loaded into the maker, or null while it is
         making a new one. */
      let editingClothId = null;
      const ownsGear = (k) => !ACCESSORIES[k].price || state.wardrobe.includes(k);
      let pendingFont = state.theme.font || 'rounded';
      let pendingCustom = { ...(state.theme.custom || {}) };
      const pendingDirty = () => pendingFont !== (state.theme.font || 'rounded')
        || JSON.stringify(pendingCustom) !== JSON.stringify(state.theme.custom || {});
      const lumOf = (hex) => {
        const { r, g, b } = hexToRgb(hex);
        const ch = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
        return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
      };
      const contrastOf = (a, b) => {
        const A = lumOf(a);
        const B = lumOf(b);
        return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
      };
      // Keep a picked colour recognisable but nudge it away from the button text
      // until the pair clears 4.5:1, so no accent can make the sample unreadable.
      const legible = (hex, on) => {
        const away = on === '#ffffff' ? '#0d0a18' : '#ffffff';
        let out = hex;
        for (let t = 0.08; t <= 1 && contrastOf(out, on) < 4.5; t += 0.08) out = mix(hex, away, t);
        return out;
      };
      // The Ghost and Chip pills are an 18%/22% tint of the accent over the sample
      // surface, so a pick close to the card colour melts them into it.
      const surfaceOf = (bgHex, panelHex) => mix(mix('#16122e', panelHex, 0.26), mix('#0a0817', bgHex, 0.22), 0.5);
      const fadedPills = (accentHex, accent2Hex, surface) => {
        const ghostFill = mix(surface, accentHex, 0.18);
        const chipFill = mix(surface, accent2Hex, 0.22);
        const faded = [];
        if (contrastOf(ghostFill, surface) < 1.2 || contrastOf('#ffffff', ghostFill) < 4.5) faded.push('Ghost');
        if (contrastOf(chipFill, surface) < 1.2 || contrastOf('#ffffff', chipFill) < 4.5) faded.push('Chip');
        return faded;
      };
      const themeSurface = () => {
        const t = THEMES[state.theme.ui] || THEMES.prism;
        return surfaceOf(themeDarken(pendingCustom.bg || t.bg, 0.02), themeDarken(pendingCustom.bg2 || t.bg2, 0.04));
      };
      // Walk the accent toward white until its pill separates from the card again.
      const liftAccent = (hex, surface) => {
        if (!fadedPills(hex, hex, surface).length) return hex;
        let out = hex;
        for (let t = 0.1; t <= 1; t += 0.1) {
          out = mix(hex, '#ffffff', t);
          if (!fadedPills(out, out, surface).length) break;
        }
        return out;
      };
      const paintPreview = () => {
        const wrap = root.querySelector('[data-ui-preview]');
        if (!wrap) return;
        const ui = THEMES[state.theme.ui] || THEMES.prism;
        const accent = pendingCustom.accent || ui.accent;
        const accent2 = pendingCustom.accent2 || ui.accent2;
        // Same ceilings setThemeVars applies, so the samples promise exactly the
        // backdrop and panel the app will paint.
        const bg = themeDarken(pendingCustom.bg || ui.bg, 0.02);
        const panel = themeDarken(pendingCustom.bg2 || ui.bg2, 0.04);
        const faded = fadedPills(accent, accent2, surfaceOf(bg, panel));
        const font = UI_FONTS[pendingFont] || UI_FONTS.rounded;
        const sample = getTarget();
        const onAccent = lumOf(mix(accent, accent2, 0.5)) > 0.42 ? '#0d0a18' : '#ffffff';
        const style = `font-family:${font.stack.replace(/"/g, '&quot;')};--uip-accent:${accent};--uip-accent2:${accent2};--uip-bg:${bg};--uip-panel:${panel};--uip-btn-1:${legible(accent, onAccent)};--uip-btn-2:${legible(accent2, onAccent)};--uip-on-accent:${onAccent}`;
        const art = sample ? spriteSVG(sample, { expr: 'happy' }) : '<b style="font-size:22px">🎨</b>';
        const card = (mode) => `<span class="uip-card ${mode}" style="${style}">
            <span class="uip-art">${art}</span>
            <span class="uip-body">
              <b>${esc(state.hollowName || 'Your Hollow')}</b>
              <span class="uip-line">Cards, captions and buttons will read like this.</span>
              <span class="uip-actions"><span class="uip-btn primary">Primary</span><span class="uip-btn ghost">Ghost</span><span class="uip-chip">Chip</span></span>
            </span>
          </span>`;
        wrap.innerHTML = `<span class="uip-pair">
            <span class="uip-col"><span class="uip-label">Dark sample</span>${card('is-dark')}</span>
            <span class="uip-col"><span class="uip-label">Light sample</span>${card('is-light')}</span>
          </span>`;
        const warn = root.querySelector('[data-ui-warn]');
        if (warn) {
          warn.hidden = !faded.length;
          warn.textContent = faded.length
            ? `${faded.join(' and ')} ${faded.length === 1 ? 'blurs' : 'blur'} into the sample — the accent is too close to the backdrop and panel colours to show a pill. Tap to brighten it.`
            : '';
        }
        const status = root.querySelector('[data-ui-status]');
        if (status) status.textContent = pendingDirty()
          ? 'Preview only — press Apply to use these colours and font everywhere.'
          : `Live: ${UI_FONTS[pendingFont]?.name || 'Rounded'} · ${Object.keys(pendingCustom).length ? 'custom colours' : 'theme colours'}.`;
      };
      const renderPersonaliser = () => {
        const fontWrap = root.querySelector('[data-fonts]');
        if (!fontWrap) return;
        fontWrap.innerHTML = Object.entries(UI_FONTS).map(([key, font]) => `<button class="style-opt ${pendingFont === key ? 'on' : ''}" data-font="${key}" style="font-family:${font.stack.replace(/"/g, '&quot;')}">${font.name}</button>`).join('');
        fontWrap.querySelectorAll('[data-font]').forEach((b) => {
          b.addEventListener('click', () => { pendingFont = b.dataset.font; renderPersonaliser(); Sfx.click(); });
        });
        const ui = THEMES[state.theme.ui] || THEMES.prism;
        root.querySelectorAll('[data-ui-color]').forEach((input) => {
          const key = input.dataset.uiColor;
          const hexOut = root.querySelector(`[data-ui-hex="${key}"]`);
          // Backdrop and Panel are dimmed on the way into the app, so their
          // readout shows the colour that is actually drawn, not the raw pick.
          const capLum = key === 'bg' ? 0.02 : key === 'bg2' ? 0.04 : 0;
          const syncHex = () => {
            if (!hexOut) return;
            const picked = String(input.value).toUpperCase();
            if (!capLum) {
              hexOut.textContent = picked;
              hexOut.removeAttribute('title');
              hexOut.classList.remove('is-capped');
              return;
            }
            const shown = themeDarken(input.value, capLum).toUpperCase();
            const capped = shown !== picked;
            hexOut.textContent = capped ? `${shown} · capped` : shown;
            hexOut.classList.toggle('is-capped', capped);
            hexOut.title = capped
              ? `Picked ${picked} — drawn as ${shown} so a bright colour can't wash out the screen.`
              : `Drawn as ${shown}.`;
          };
          input.value = pendingCustom[key] || ui[key];
          syncHex();
          const stage = () => { pendingCustom[key] = input.value; syncHex(); paintPreview(); };
          input.oninput = stage;
          input.onchange = stage;
        });
        const warnBtn = root.querySelector('[data-ui-warn]');
        if (warnBtn) {
          warnBtn.onclick = () => {
            const t = THEMES[state.theme.ui] || THEMES.prism;
            const surface = themeSurface();
            pendingCustom = {
              ...pendingCustom,
              accent: liftAccent(pendingCustom.accent || t.accent, surface),
              accent2: liftAccent(pendingCustom.accent2 || t.accent2, surface),
            };
            renderPersonaliser();
            Sfx.pop();
          };
        }
        const presetWrap = root.querySelector('[data-ui-presets]');
        presetWrap.innerHTML = UI_PRESET_COLOURS.map((hex) => `<button class="sh-tint-dot" type="button" style="background:${hex}" data-ui-preset="${hex}" aria-label="Use ${hex} as the accent"></button>`).join('');
        presetWrap.querySelectorAll('[data-ui-preset]').forEach((b) => {
          b.addEventListener('click', () => {
            const hex = b.dataset.uiPreset;
            pendingCustom = { ...pendingCustom, accent: hex, accent2: hex };
            renderPersonaliser();
            Sfx.pop();
          });
        });
        root.querySelector('[data-ui-apply]').onclick = () => {
          Actions.setTheme({ font: pendingFont, custom: Object.keys(pendingCustom).length ? pendingCustom : null });
          applyTheme();
          renderPersonaliser();
          paint();
          Sfx.win();
          toast('Personaliser applied to the whole app.', '🎨');
        };
        root.querySelector('[data-ui-reset]').onclick = () => {
          pendingFont = 'rounded';
          pendingCustom = {};
          Actions.setTheme({ font: 'rounded', custom: null });
          applyTheme();
          renderPersonaliser();
          paint();
          Sfx.pop();
        };
        const compactBtn = root.querySelector('[data-ui-compact]');
        if (compactBtn) {
          const shortMQ = window.matchMedia('(max-height: 640px)');
          const syncCompact = () => {
            const manual = state.theme.compact === true;
            const auto = shortMQ.matches && !manual;
            root.querySelector('.personaliser-card')?.classList.toggle('is-compact', manual);
            compactBtn.setAttribute('aria-pressed', String(manual || auto));
            compactBtn.textContent = auto ? 'Compact layout: auto' : (manual ? 'Compact layout: on' : 'Compact layout: off');
          };
          syncCompact();
          if (!compactBtn.dataset.autoBound) {
            shortMQ.addEventListener?.('change', syncCompact);
            window.addEventListener('resize', syncCompact);
            compactBtn.dataset.autoBound = '1';
          }
          compactBtn.onclick = () => {
            Actions.setTheme({ compact: state.theme.compact !== true });
            syncCompact();
            Sfx.click();
          };
        }
        paintPreview();
      };
      /* Frame studio: one palette plus the motion of each kind of frame. The
         entry and loading frames only paint when they next open, so the note
         says that plainly; the menu frame updates live behind this sheet. */
      const FRAME_KINDS = [['entry', 'Entry'], ['loading', 'Loading'], ['menu', 'Menus']];
      const frameScene = typeof window !== 'undefined' ? window.titleScreenScene : null;
      const frameMotionNames = frameScene && frameScene.motions
        ? frameScene.motions
        : { sweep: { name: 'Sweep' }, breathe: { name: 'Glow' }, pulse: { name: 'Pulse' }, still: { name: 'Still' } };
      const frameCfg = () => (frameScene && typeof frameScene.settings === 'function'
        ? frameScene.settings()
        : { mode: 'daily', a: '#ff9f43', b: BRAND.accent2, c: '#6c8bff', intensity: 1, entry: 'sweep', loading: 'sweep', menu: 'sweep', presets: [] });
      const frameToday = () => (frameScene && typeof frameScene.frame === 'function'
        ? frameScene.frame()
        : frameCfg());
      const frameCard = root.querySelector('[data-frame-studio]');
      const framePreview = root.querySelector('[data-frame-preview]');
      const frameContext = root.querySelector('[data-frame-context-preview]');
      const frameNote = root.querySelector('[data-frame-note]');
      /* These are the real shell component classes, not custom swatches. The
         surfaces only swap the local text/panel tokens so the same frame can be
         judged against a dark and a light backdrop before saving. */
      const frameSurfaceMarkup = (tone, label) => `<div class="frame-preview-surface is-${tone}">
        <span class="frame-preview-surface-label">${label}</span>
        <div class="frame-preview-example-row">
          <button class="btn btn-ghost frame-preview-btn" type="button" tabindex="-1">Button</button>
          <span class="chip frame-preview-chip">Chip</span>
        </div>
        <div class="frame-preview-cards">
          <button class="egg-card frame-preview-egg" type="button" tabindex="-1">
            <span class="frame-preview-emoji" aria-hidden="true">🥚</span>
            <span class="ec-name">Egg</span>
            <span class="ec-sub">Ready</span>
          </button>
          <button class="type-card frame-preview-type" type="button" tabindex="-1">
            <span class="tc-art frame-preview-emoji" aria-hidden="true">🌿</span>
            <span class="tc-top"><b>Bloom</b><i class="te-dot"></i></span>
            <span class="tc-power">Growth</span>
          </button>
        </div>
        <div class="frame-preview-stage-wrap">
          <span class="frame-preview-stage-label">Stage rim</span>
          <div class="stage frame-preview-stage scene-grove"><span class="ground"></span></div>
        </div>
      </div>`;
      const paintFrameContext = () => {
        if (!frameContext) return;
        frameContext.innerHTML = `<div class="frame-preview-context-head">
          <b>In context</b><span>same rim, light &amp; dark</span>
        </div>
        <div class="frame-preview-context-grid">
          ${frameSurfaceMarkup('dark', 'On dark')}
          ${frameSurfaceMarkup('light', 'On light')}
        </div>`;
      };
      const frameColors = () => {
        const cfg = frameCfg();
        const today = frameToday();
        return cfg.mode === 'custom' ? cfg : today;
      };
      const paintFramePalette = (palette) => {
        if (!frameCard) return;
        frameCard.style.setProperty('--sh-frame-a', palette.a);
        frameCard.style.setProperty('--sh-frame-b', palette.b);
        frameCard.style.setProperty('--sh-frame-c', palette.c);
      };
      const paintFrameIntensity = (value) => {
        if (!frameCard) return;
        const intensity = normalizeFrameIntensity(value);
        frameCard.style.setProperty('--sh-frame-intensity', String(intensity));
        const input = root.querySelector('[data-frame-intensity]');
        const readout = root.querySelector('[data-frame-intensity-readout]');
        if (input) input.value = String(Math.round(intensity * 100));
        if (readout) readout.textContent = `${Math.round(intensity * 100)}%`;
        return intensity;
      };
      const paintFrameContrast = (palette) => {
        const box = root.querySelector('[data-frame-contrast]');
        const text = root.querySelector('[data-frame-contrast-text]');
        const custom = frameCfg().mode === 'custom';
        const backgrounds = custom ? frameBackdrops() : [];
        const low = custom
          ? ['a', 'b', 'c'].filter((key) => frameContrastFloor(palette[key], backgrounds) < FRAME_CONTRAST_MIN)
          : [];
        root.querySelectorAll('[data-frame-color]').forEach((input) => {
          const bad = low.includes(input.dataset.frameColor);
          input.closest('.color-field')?.classList.toggle('is-low-contrast', bad);
          input.setAttribute('aria-invalid', String(bad));
          if (bad) input.title = `${FRAME_COLOR_LABELS[input.dataset.frameColor]} rim is below 3:1 on this theme.`;
          else input.removeAttribute('title');
        });
        if (!box || !text) return;
        box.hidden = !low.length;
        if (!low.length) {
          text.textContent = '';
          return;
        }
        const themeName = typeof THEMES !== 'undefined'
          ? (THEMES[state?.theme?.ui] || THEMES.prism).name
          : 'current';
        const names = low.map((key) => FRAME_COLOR_LABELS[key]);
        const subject = names.length === 3
          ? 'All three rim colours'
          : names.length === 2
            ? `${names[0]} and ${names[1]} rim colours`
            : `${names[0]} rim colour`;
        text.textContent = `${subject} ${names.length === 1 ? 'is' : 'are'} below 3:1 on the ${themeName} backdrop.`;
      };
      const saveFrame = (patch) => {
        const next = { ...frameCfg(), ...patch };
        const res = Actions.setTheme({ frame: next });
        if (res && res.ok === false) return res;
        if (typeof applyTheme === 'function') applyTheme();
        if (typeof syncAppDayFrame === 'function') {
          syncAppDayFrame((typeof App !== 'undefined' && App.tab) || 'menu');
        }
        renderFrameStudio();
        return res;
      };

      /* Share codes are intentionally short and self-contained. The prefix lets
         the import box explain a bad paste without trying to parse arbitrary
         JSON, and the payload only carries what a preset needs. */
      const FRAME_SHARE_PREFIX = 'SHF1-';
      const FRAME_PRESET_HEX = /^#[0-9a-f]{6}$/i;
      const framePresetLimit = typeof FRAME_PRESET_LIMIT === 'number' ? FRAME_PRESET_LIMIT : 24;
      const frameMotionLabel = (key) => (frameMotionNames[key] && frameMotionNames[key].name) || key;
      const framePresetIntensity = (preset) => normalizeFrameIntensity(preset && preset.intensity);
      const framePresetLowContrast = (preset) => {
        const backgrounds = frameBackdrops();
        return ['a', 'b', 'c'].filter((key) => frameContrastFloor(preset[key], backgrounds) < FRAME_CONTRAST_MIN);
      };
      const frameBase64Url = (text) => {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
          binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + 0x8000));
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      };
      const frameShareCode = (preset) => FRAME_SHARE_PREFIX + frameBase64Url(JSON.stringify({
        v: 1,
        n: preset.name,
        a: preset.a,
        b: preset.b,
        c: preset.c,
        i: framePresetIntensity(preset),
        e: preset.entry,
        l: preset.loading,
        m: preset.menu,
      }));
      const parseFrameShareCode = (raw) => {
        const clean = String(raw || '').trim().replace(/\s+/g, '');
        if (!clean.startsWith(FRAME_SHARE_PREFIX)) return null;
        const body = clean.slice(FRAME_SHARE_PREFIX.length).replace(/-/g, '+').replace(/_/g, '/');
        let payload = null;
        try {
          const binary = atob(body + '='.repeat((4 - (body.length % 4)) % 4));
          const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
          payload = JSON.parse(new TextDecoder().decode(bytes));
        } catch (error) {
          return null;
        }
        if (!payload || payload.v !== 1
          || !FRAME_PRESET_HEX.test(String(payload.a || ''))
          || !FRAME_PRESET_HEX.test(String(payload.b || ''))
          || !FRAME_PRESET_HEX.test(String(payload.c || ''))) return null;
        return {
          name: String(payload.n || '').trim().slice(0, 24) || 'Imported frame',
          a: payload.a,
          b: payload.b,
          c: payload.c,
          intensity: normalizeFrameIntensity(payload.i),
          entry: payload.e,
          loading: payload.l,
          menu: payload.m,
        };
      };
      const framePresetName = (base) => {
        const clean = String(base || '').trim().slice(0, 24) || 'Imported frame';
        const taken = new Set((frameCfg().presets || []).map((preset) => String(preset.name).toLowerCase()));
        if (!taken.has(clean.toLowerCase())) return clean;
        for (let number = 2; number < 100; number += 1) {
          const suffix = ` (${number})`;
          const candidate = clean.slice(0, 24 - suffix.length).trimEnd() + suffix;
          if (!taken.has(candidate.toLowerCase())) return candidate;
        }
        return 'Imported frame';
      };
      const setFramePresetStatus = (message) => {
        const status = root.querySelector('[data-frame-preset-status]');
        if (status) status.textContent = message || '';
      };
      const applyFramePreset = (preset, announce = true) => {
        saveFrame({
          mode: 'custom',
          a: preset.a,
          b: preset.b,
          c: preset.c,
          intensity: framePresetIntensity(preset),
          entry: preset.entry,
          loading: preset.loading,
          menu: preset.menu,
        });
        if (announce) {
          Sfx.click();
          toast(`“${preset.name}” is now the frame palette.`, '🖼️');
          setFramePresetStatus(`Using “${preset.name}”.`);
        }
      };
      const paintFramePresets = () => {
        if (!frameCard) return;
        const presets = Array.isArray(frameCfg().presets) ? frameCfg().presets : [];
        const count = root.querySelector('[data-frame-preset-count]');
        if (count) count.textContent = presets.length
          ? `${presets.length}/${framePresetLimit} saved`
          : 'None yet';
        const list = root.querySelector('[data-frame-preset-list]');
        if (!list) return;
        if (!presets.length) {
          list.innerHTML = '<p class="tiny muted">Save a palette here to keep it for another day.</p>';
          return;
        }
        list.innerHTML = presets.map((preset) => {
          const id = esc(preset.id);
          const name = esc(preset.name);
          const label = `${Math.round(framePresetIntensity(preset) * 100)}% · ${frameMotionLabel(preset.entry)}, ${frameMotionLabel(preset.loading)}, ${frameMotionLabel(preset.menu)}`;
          const low = framePresetLowContrast(preset);
          const warning = low.length
            ? `<span class="frame-preset-contrast" title="${FRAME_COLOR_LABELS[low[0]]} ${low.length === 1 ? 'rim is' : 'rims are'} below 3:1 on this theme.">Low contrast</span>`
            : '';
          return `<div class="custom-item frame-preset-row">
            <button class="custom-item-main" type="button" data-frame-preset-apply="${id}" aria-label="Use ${name}">
              <span class="custom-swatch" style="background:linear-gradient(135deg, ${preset.a}, ${preset.b}, ${preset.c})">🎨</span>
              <span class="custom-item-copy"><b>${name}</b><span>${label}</span>${warning}</span>
            </button>
            <button class="icon-btn custom-edit" type="button" data-frame-preset-edit="${id}" aria-label="Rename or copy ${name}">${icon('pencil')}</button>
            <button class="btn btn-ghost btn-sm" type="button" data-frame-preset-share="${id}" aria-label="Show the share code for ${name}">Code</button>
            <button class="icon-btn custom-delete" type="button" data-frame-preset-delete="${id}" aria-label="Delete ${name}">${icon('trash')}</button>
          </div>`;
        }).join('');
        const byId = (id) => presets.find((preset) => preset.id === id);
        list.querySelectorAll('[data-frame-preset-apply]').forEach((button) => {
          button.onclick = () => {
            const preset = byId(button.dataset.framePresetApply);
            if (preset) applyFramePreset(preset);
          };
        });
        list.querySelectorAll('[data-frame-preset-share]').forEach((button) => {
          button.onclick = () => {
            const preset = byId(button.dataset.framePresetShare);
            if (!preset) return;
            const code = frameShareCode(preset);
            const modal = openModal({
              title: `Share “${esc(preset.name)}”`,
              sub: 'Paste this code into Frame studio on another Hollow to bring the palette across.',
              body: `<textarea class="frame-share-code" readonly data-frame-share-code aria-label="Frame share code">${esc(code)}</textarea>
                <div class="actions" style="display:flex;gap:8px;margin-top:12px">
                  <button class="btn btn-primary" type="button" data-copy-frame-code>Copy code</button>
                </div>`,
              onMount: (modalRoot) => {
                const field = modalRoot.querySelector('[data-frame-share-code]');
                const copy = async () => {
                  try {
                    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw new Error('clipboard');
                    await navigator.clipboard.writeText(code);
                    toast('Frame share code copied.', '📋');
                  } catch (error) {
                    if (field) { field.focus(); field.select(); }
                    toast('Code selected — copy it with your keyboard.', '📋');
                  }
                };
                modalRoot.querySelector('[data-copy-frame-code]').onclick = copy;
                setTimeout(() => { if (field) { field.focus(); field.select(); } }, 30);
              },
            });
            Sfx.click();
            return modal;
          };
        });
        list.querySelectorAll('[data-frame-preset-edit]').forEach((button) => {
          button.onclick = () => {
            const preset = byId(button.dataset.framePresetEdit);
            if (!preset) return;
            const modal = openModal({
              title: `Edit “${esc(preset.name)}”`,
              sub: 'Rename this palette or save another copy with its own name.',
              body: `<label class="frame-rename-field"><span>Palette name</span>
                  <input class="type-search" type="text" maxlength="24" value="${esc(preset.name)}" data-frame-rename-input autocomplete="off">
                </label>
                <p class="frame-rename-status" data-frame-rename-status role="status" aria-live="polite"></p>
                <div class="actions" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
                  <button class="btn btn-ghost" type="button" data-frame-rename-cancel>Cancel</button>
                  <button class="btn btn-soft" type="button" data-frame-rename-copy>Save a copy</button>
                  <button class="btn btn-primary" type="button" data-frame-rename-save>Save name</button>
                </div>`,
              onMount: (modalRoot, close) => {
                const field = modalRoot.querySelector('[data-frame-rename-input]');
                const note = modalRoot.querySelector('[data-frame-rename-status]');
                const explain = (result) => {
                  if (result.reason === 'duplicate') return 'Another palette already uses that name.';
                  if (result.reason === 'limit') return `You can keep ${framePresetLimit} palettes at once.`;
                  return 'That palette name could not be saved.';
                };
                const saveName = () => {
                  const result = Actions.renameFramePreset(preset.id, field ? field.value : '');
                  if (!result.ok) { if (note) note.textContent = explain(result); return; }
                  close();
                  renderFrameStudio();
                  setFramePresetStatus(`Renamed to “${result.preset.name}”.`);
                  toast(`Palette renamed to “${result.preset.name}”.`, '🖼️');
                  Sfx.click();
                };
                const saveCopy = () => {
                  const base = field && field.value.trim() ? field.value : `${preset.name} copy`;
                  const result = Actions.saveFramePreset({ ...preset, name: framePresetName(base) });
                  if (!result.ok) { if (note) note.textContent = explain(result); return; }
                  close();
                  renderFrameStudio();
                  setFramePresetStatus(`Saved a copy as “${result.preset.name}”.`);
                  toast(`Saved a copy as “${result.preset.name}”.`, '📋');
                  Sfx.pop();
                };
                if (field) {
                  field.focus();
                  field.select();
                  field.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') { event.preventDefault(); saveName(); }
                  });
                }
                modalRoot.querySelector('[data-frame-rename-save]').onclick = saveName;
                modalRoot.querySelector('[data-frame-rename-copy]').onclick = saveCopy;
                modalRoot.querySelector('[data-frame-rename-cancel]').onclick = close;
              },
            });
            Sfx.click();
            return modal;
          };
        });
        list.querySelectorAll('[data-frame-preset-delete]').forEach((button) => {
          button.onclick = async () => {
            const preset = byId(button.dataset.framePresetDelete);
            if (!preset) return;
            const yes = await confirmModal(
              'Delete this palette?',
              `“${preset.name}” will be removed. The active frame and other saved palettes stay.`,
              'Delete palette',
              { danger: true },
            );
            if (!yes) return;
            const result = Actions.deleteFramePreset(preset.id);
            if (!result.ok) { setFramePresetStatus('That palette was already gone.'); return; }
            setFramePresetStatus(`Deleted “${preset.name}”.`);
            renderFrameStudio();
            Sfx.pop();
          };
        });
      };
      const paintFrameStudio = () => {
        if (!frameCard) return;
        const cfg = frameCfg();
        const palette = frameColors();
        paintFramePalette(palette);
        paintFrameIntensity(cfg.intensity);
        paintFrameContrast(palette);
        root.querySelectorAll('[data-frame-mode]').forEach((button) => {
          const on = button.dataset.frameMode === cfg.mode;
          button.classList.toggle('on', on);
          button.setAttribute('aria-pressed', String(on));
        });
        root.querySelectorAll('[data-frame-color]').forEach((input) => {
          const key = input.dataset.frameColor;
          input.value = palette[key] || '#ffffff';
          input.disabled = cfg.mode !== 'custom';
          const hex = root.querySelector(`[data-frame-hex="${key}"]`);
          if (hex) hex.textContent = String(input.value).toUpperCase();
        });
        if (framePreview && frameScene && typeof frameScene.frameMarkup === 'function') {
          framePreview.innerHTML = FRAME_KINDS.map(([kind, label]) => `<div class="frame-preview-item">
            <span class="frame-preview-label">${label}</span>
            <span class="frame-preview-stage">${frameScene.frameMarkup(kind)}</span>
          </div>`).join('');
        }
        paintFrameContext();
        const motions = root.querySelector('[data-frame-motions]');
        if (motions) {
          motions.innerHTML = FRAME_KINDS.map(([kind, label]) => `<div class="frame-motion-row">
            <span class="frame-motion-label">${label} frame</span>
            <span class="frame-motion-btns" role="group" aria-label="${label} frame motion">${Object.entries(frameMotionNames).map(([key, motion]) => `<button class="chip ${cfg[kind] === key ? 'on' : ''}" type="button" data-frame-motion-kind="${kind}" data-frame-motion-value="${key}" aria-pressed="${cfg[kind] === key}">${motion.name}</button>`).join('')}</span>
          </div>`).join('');
          motions.querySelectorAll('[data-frame-motion-kind]').forEach((button) => {
            button.onclick = () => {
              const kind = button.dataset.frameMotionKind;
              const value = button.dataset.frameMotionValue;
              if (frameCfg()[kind] === value) return;
              saveFrame({ [kind]: value });
              Sfx.click();
            };
          });
        }
        paintFramePresets();
        if (frameNote) {
          frameNote.textContent = cfg.mode === 'custom'
            ? 'Custom colours are fixed across the app. Entry and loading update the next time they open.'
            : 'Following today’s weekday and time. Pick Custom colours to fix your own palette.';
        }
      };
      const renderFrameStudio = paintFrameStudio;
      root.querySelectorAll('[data-frame-mode]').forEach((button) => {
        button.onclick = () => {
          const mode = button.dataset.frameMode;
          if (frameCfg().mode === mode) return;
          const today = frameToday();
          saveFrame(mode === 'custom'
            ? { mode, a: today.a, b: today.b, c: today.c }
            : { mode });
          Sfx.click();
        };
      });
      root.querySelectorAll('[data-frame-color]').forEach((input) => {
        input.oninput = () => {
          const palette = frameColors();
          palette[input.dataset.frameColor] = input.value;
          paintFramePalette(palette);
          paintFrameContrast(palette);
          const hex = root.querySelector(`[data-frame-hex="${input.dataset.frameColor}"]`);
          if (hex) hex.textContent = String(input.value).toUpperCase();
        };
        input.onchange = () => {
          saveFrame({ mode: 'custom', [input.dataset.frameColor]: input.value });
        };
      });
      const intensityInput = root.querySelector('[data-frame-intensity]');
      if (intensityInput) {
        intensityInput.oninput = () => {
          paintFrameIntensity(Number(intensityInput.value) / 100);
        };
        intensityInput.onchange = () => {
          saveFrame({ intensity: paintFrameIntensity(Number(intensityInput.value) / 100) });
        };
      }
      const resetFrame = root.querySelector('#frame-reset');
      if (resetFrame) resetFrame.onclick = () => { saveFrame({ mode: 'daily' }); Sfx.pop(); };
      const frameContrastFix = root.querySelector('[data-frame-contrast-fix]');
      if (frameContrastFix) frameContrastFix.onclick = () => {
        const saved = frameColors();
        const backgrounds = frameBackdrops();
        const corrected = { mode: 'custom' };
        ['a', 'b', 'c'].forEach((key) => {
          const input = root.querySelector(`[data-frame-color="${key}"]`);
          corrected[key] = frameHighContrastColor(input ? input.value : saved[key], backgrounds);
        });
        saveFrame(corrected);
        Sfx.win();
        toast('Rim colours lifted for this theme.', '✨');
      };
      paintFrameStudio();

      const presetNameInput = root.querySelector('[data-frame-preset-name]');
      const savePresetButton = root.querySelector('[data-frame-preset-save]');
      const savePreset = () => {
        const name = String(presetNameInput ? presetNameInput.value : '').trim();
        if (!name) {
          setFramePresetStatus('Give the palette a name first.');
          if (presetNameInput) presetNameInput.focus();
          toast('Name the palette before saving it.', '🖼️');
          return;
        }
        const cfg = frameCfg();
        const palette = frameColors();
        const result = Actions.saveFramePreset({
          name,
          a: palette.a,
          b: palette.b,
          c: palette.c,
          intensity: normalizeFrameIntensity(cfg.intensity),
          entry: cfg.entry,
          loading: cfg.loading,
          menu: cfg.menu,
        });
        if (!result.ok) {
          const reason = result.reason === 'duplicate'
            ? 'A palette already uses that name.'
            : result.reason === 'limit'
              ? `You can keep ${framePresetLimit} palettes at once.`
              : 'That palette could not be saved.';
          setFramePresetStatus(reason);
          toast(reason, '⚠️');
          return;
        }
        if (presetNameInput) presetNameInput.value = '';
        setFramePresetStatus(`Saved “${result.preset.name}”.`);
        renderFrameStudio();
        Sfx.win();
      };
      if (savePresetButton) savePresetButton.onclick = savePreset;
      if (presetNameInput) {
        presetNameInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') { event.preventDefault(); savePreset(); }
        });
      }

      const importCodeInput = root.querySelector('[data-frame-import-code]');
      const importPresetButton = root.querySelector('[data-frame-import]');
      const importPreset = () => {
        const parsed = parseFrameShareCode(importCodeInput ? importCodeInput.value : '');
        if (!parsed) {
          setFramePresetStatus('That is not a Sprite Hollow frame share code.');
          toast('Paste a valid frame share code.', '⚠️');
          if (importCodeInput) importCodeInput.focus();
          return;
        }
        const name = framePresetName(parsed.name);
        const result = Actions.saveFramePreset({ ...parsed, name });
        if (!result.ok) {
          const reason = result.reason === 'limit'
            ? `You can keep ${framePresetLimit} palettes at once.`
            : 'That palette could not be imported.';
          setFramePresetStatus(reason);
          toast(reason, '⚠️');
          return;
        }
        if (importCodeInput) importCodeInput.value = '';
        applyFramePreset(result.preset);
        setFramePresetStatus(`Imported and applied “${result.preset.name}”.`);
      };
      if (importPresetButton) importPresetButton.onclick = importPreset;
      if (importCodeInput) {
        importCodeInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') { event.preventDefault(); importPreset(); }
        });
      }

      // --- Sprite colour wheel -------------------------------------------------
      // The personaliser edits the same five dye colours as the Custom dye row,
      // but with a hue/saturation wheel: pick a slot, point at a colour, release.
      const WHEEL_SLOTS = [['body', 'Body'], ['light', 'Light'], ['deep', 'Deep'], ['accent', 'Accent'], ['belly', 'Belly']];
      let wheelSlot = 'body';
      let wheelAll = false;
      let wheelHue = 280;
      let wheelSat = 55;
      let wheelLight = 58;
      let wheelTargetId = null;
      let wheelDrawnLight = null;
      let wheelTimer = 0;
      /* Set only by the hex field: the exact pasted value, so the wheel's rounded
         HSL state can't drift the colour a shade off what was typed. */
      let wheelExact = null;

      const wheelTarget = () => {
        const look = getTarget();
        return look && look.stage !== 'egg' ? look : null;
      };

      const drawWheel = () => {
        const canvas = root.querySelector('[data-color-wheel]');
        if (!canvas || wheelDrawnLight === wheelLight) return;
        wheelDrawnLight = wheelLight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const px = Math.round(132 * dpr);
        if (canvas.width !== px) { canvas.width = px; canvas.height = px; }
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const R = px / 2;
        const img = ctx.createImageData(px, px);
        for (let y = 0; y < px; y += 1) {
          for (let x = 0; x < px; x += 1) {
            const dx = x - R + 0.5;
            const dy = y - R + 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const i = (y * px + x) * 4;
            if (dist > R - 0.5) { img.data[i + 3] = 0; continue; }
            const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
            const rgb = wheelHslRgb(hue, Math.min(1, dist / R) * 100, wheelLight);
            img.data[i] = rgb.r;
            img.data[i + 1] = rgb.g;
            img.data[i + 2] = rgb.b;
            img.data[i + 3] = 255;
          }
        }
        ctx.putImageData(img, 0, 0);
      };

      const wheelHex = () => wheelHslHex(wheelHue, wheelSat, wheelLight);

      // One hue can fill all five slots using the same ramp as the dye presets.
      const wheelPatch = (hex) => (wheelAll
        ? {
          body: hex,
          light: mix(hex, '#ffffff', 0.62),
          deep: mix(hex, '#000000', 0.42),
          accent: mix(hex, BRAND.gold, 0.5),
          belly: mix(hex, '#ffffff', 0.8),
        }
        : { [wheelSlot]: hex });

      const commitWheel = () => {
        const look = wheelTarget();
        if (!look || !root.isConnected) return;
        Actions.customize(look.id, {
          palette: 'custom',
          // Merge from the stored colours, not resolvePalette: that one lifts
          // dark shades for display, so writing it back would recolour the
          // slots the pick was not meant to touch.
          custom: { ...basePalette(look), ...wheelPatch(wheelHex()) },
        });
        paint();
      };

      const queueWheel = () => {
        if (wheelTimer) return;
        wheelTimer = setTimeout(() => { wheelTimer = 0; commitWheel(); }, 120);
      };

      const paintWheel = () => {
        const look = wheelTarget();
        const pal = look ? resolvePalette(look) : null;
        /* A pasted hex — or a whole copied colourway like
           "body #FD5D40 light #FDA353 …" — applies straight to the active slot. */
        const hexInput = root.querySelector('[data-wheel-input]');
        if (hexInput && !hexInput.dataset.bound) {
          hexInput.dataset.bound = '1';
          const applyHex = () => {
            const raw = String(hexInput.value || '');
            const SLOT_ORDER = ['body', 'light', 'deep', 'accent', 'belly'];
            const norm = (h) => (h.charAt(0) === '#' ? h : `#${h}`).toLowerCase();
            const all = [...raw.matchAll(/#?([0-9a-f]{6}|[0-9a-f]{3})\b/gi)].map((m) => norm(m[0]));
            if (!all.length) { toast('Type a hex like #FF6B35.', '🎨'); return; }
            const look = wheelTarget();
            if (!look) { toast('Hatch a grown sprite first, then dye it.', '🎨'); return; }
            /* A copied colourway arrives as "body #FD5D40 light #FDA353 …", so
               labelled pairs let one paste dye every slot it names. */
            const patch = {};
            const labelled = [...raw.matchAll(/\b(body|light|deep|accent|belly)\b\s*[:=]?\s*(#?[0-9a-f]{6}|#?[0-9a-f]{3})\b/gi)];
            if (labelled.length >= 2) {
              labelled.forEach(([, slot, hex]) => { patch[slot.toLowerCase()] = norm(hex); });
            } else if (all.length >= 2) {
              all.slice(0, SLOT_ORDER.length).forEach((hex, i) => { patch[SLOT_ORDER[i]] = hex; });
            }
            const hex = all[0];
            const hsl = wheelHexHsl(hex);
            wheelHue = hsl.h;
            wheelSat = clamp(hsl.s, 0, 100);
            wheelLight = Math.round(clamp(hsl.l, 10, 90));
            wheelExact = hex;
            drawWheel();
            paintWheel();
            clearTimeout(wheelTimer);
            wheelTimer = 0;
            /* Commit the hexes as given: an HSL round trip rounds lightness and
               would store a shade the player never asked for. */
            Actions.customize(look.id, {
              palette: 'custom',
              custom: { ...basePalette(look), ...(Object.keys(patch).length ? patch : wheelPatch(hex)) },
            });
            paint();
            Sfx.click();
            const count = Object.keys(patch).length;
            toast(count > 1 ? `${count} slots dyed from the pasted colourway.` : `${hex.toUpperCase()} applied to ${wheelSlot}.`, '🎨');
          };
          hexInput.addEventListener('change', applyHex);
          hexInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { event.preventDefault(); applyHex(); }
          });
        }
        if (look && look.id !== wheelTargetId) {
          wheelTargetId = look.id;
          const hsl = wheelHexHsl(pal.body);
          wheelHue = hsl.h;
          wheelSat = clamp(hsl.s, 0, 100);
          wheelLight = Math.round(clamp(hsl.l, 10, 90));
          drawWheel();
        }
        const hex = wheelHex();
        const slots = root.querySelector('[data-wheel-slots]');
        if (slots) {
          slots.innerHTML = WHEEL_SLOTS.map(([key, label]) => `
            <button class="wheel-slot ${wheelSlot === key ? 'on' : ''}" type="button" data-wheel-slot="${key}"
              aria-pressed="${wheelSlot === key}"><span class="wheel-swatch" style="background:${pal ? pal[key] : '#4a4d5c'}"></span>${label}</button>`).join('');
          slots.querySelectorAll('[data-wheel-slot]').forEach((b) => {
            b.addEventListener('click', () => {
              wheelExact = null;
              wheelSlot = b.dataset.wheelSlot;
              const look = wheelTarget();
              if (look) {
                const hsl = wheelHexHsl(resolvePalette(look)[wheelSlot] || BRAND.accent);
                wheelHue = hsl.h;
                wheelSat = clamp(hsl.s, 0, 100);
                wheelLight = Math.round(clamp(hsl.l, 10, 90));
                drawWheel();
              }
              paintWheel();
              Sfx.click();
            });
          });
        }
        const name = root.querySelector('[data-wheel-slot-name]');
        if (name) name.textContent = wheelAll ? ' · all five' : ` · ${WHEEL_SLOTS.find((s) => s[0] === wheelSlot)[1]}`;
        const light = root.querySelector('[data-wheel-light]');
        if (light && Number(light.value) !== wheelLight) light.value = String(wheelLight);
        const chip = root.querySelector('[data-wheel-chip]');
        if (chip) chip.style.background = hex;
        const out = root.querySelector('[data-wheel-hex]');
        if (out) out.textContent = look ? hex.toUpperCase() : 'Pick a grown sprite';
        /* Keep the field in step with the wheel, but never fight someone typing. */
        if (hexInput && document.activeElement !== hexInput) hexInput.value = look ? (wheelExact || hex).toUpperCase() : '';
        const dot = root.querySelector('[data-wheel-dot]');
        const wrapEl = root.querySelector('.wheel-wrap');
        if (dot && wrapEl) {
          const R = wrapEl.getBoundingClientRect().width / 2;
          const rad = (wheelHue * Math.PI) / 180;
          const dist = (wheelSat / 100) * R;
          dot.style.left = `${R + Math.cos(rad) * dist}px`;
          dot.style.top = `${R + Math.sin(rad) * dist}px`;
          dot.style.background = hex;
        }
        const all = root.querySelector('[data-wheel-all]');
        if (all) {
          all.setAttribute('aria-pressed', String(wheelAll));
          all.textContent = wheelAll ? 'Dye all five: on' : 'Dye all five: off';
          all.classList.toggle('on', wheelAll);
        }
        const canvas = root.querySelector('[data-color-wheel]');
        if (canvas) canvas.setAttribute('aria-valuetext', look ? `${hex} for the ${wheelSlot} colour` : 'No grown sprite selected');
      };

      const bindWheel = () => {
        const canvas = root.querySelector('[data-color-wheel]');
        if (!canvas || canvas.dataset.bound) return;
        canvas.dataset.bound = '1';
        drawWheel();
        const pick = (event) => {
          const b = canvas.getBoundingClientRect();
          const R = b.width / 2;
          if (!R) return;
          const dx = event.clientX - b.left - R;
          const dy = event.clientY - b.top - R;
          const dist = Math.min(R, Math.sqrt(dx * dx + dy * dy));
          wheelExact = null;
          wheelHue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
          wheelSat = (dist / R) * 100;
          paintWheel();
          queueWheel();
        };
        canvas.addEventListener('pointerdown', (event) => {
          if (event.button) return;
          if (!wheelTarget()) return;
          try { canvas.setPointerCapture?.(event.pointerId); } catch (err) { /* pointer already gone */ }
          pick(event);
        });
        canvas.addEventListener('pointermove', (event) => {
          if (!canvas.hasPointerCapture?.(event.pointerId)) return;
          pick(event);
        });
        canvas.addEventListener('pointerup', (event) => {
          if (!canvas.hasPointerCapture?.(event.pointerId)) return;
          try { canvas.releasePointerCapture?.(event.pointerId); } catch (err) { /* already released */ }
          pick(event);
          clearTimeout(wheelTimer);
          wheelTimer = 0;
          commitWheel();
        });
        canvas.addEventListener('keydown', (event) => {
          const step = event.shiftKey ? 10 : 3;
          let handled = true;
          if (event.key === 'ArrowLeft') wheelHue = (wheelHue - step + 360) % 360;
          else if (event.key === 'ArrowRight') wheelHue = (wheelHue + step) % 360;
          else if (event.key === 'ArrowUp') wheelSat = Math.min(100, wheelSat + step);
          else if (event.key === 'ArrowDown') wheelSat = Math.max(0, wheelSat - step);
          else handled = false;
          if (!handled) return;
          event.preventDefault();
          paintWheel();
          queueWheel();
        });
        const light = root.querySelector('[data-wheel-light]');
        if (light) {
          light.addEventListener('input', () => {
            wheelExact = null;
            wheelLight = Number(light.value);
            drawWheel();
            paintWheel();
            queueWheel();
          });
          light.addEventListener('change', () => {
            clearTimeout(wheelTimer);
            wheelTimer = 0;
            commitWheel();
          });
        }
        const all = root.querySelector('[data-wheel-all]');
        if (all) {
          all.addEventListener('click', () => {
            wheelExact = null;
            wheelAll = !wheelAll;
            paintWheel();
            Sfx.click();
          });
        }
        canvas.addEventListener('blur', () => {
          clearTimeout(wheelTimer);
          wheelTimer = 0;
        });
      };

      const paintCustomSections = () => {
        const t = getTarget();
        const clothWrap = root.querySelector('[data-custom-clothes]');
        if (clothWrap) {
          const clothes = state.customClothes || [];
          clothWrap.innerHTML = `${t ? `<button class="custom-wear-none ${!t.outfit ? 'on' : ''}" data-outfit-none>No custom outfit</button>` : ''}
            ${clothes.length ? clothes.map((cloth) => `
              <div class="custom-item ${t?.outfit === cloth.id ? 'on' : ''}">
                <button class="custom-item-main" data-wear-cloth="${cloth.id}">
                  <span class="custom-swatch" style="background:linear-gradient(135deg, ${cloth.primary}, ${cloth.secondary})">${CUSTOM_CLOTH_STYLES[cloth.style].icon}</span>
                  <span class="custom-item-copy"><b>${esc(cloth.name)}</b><span>${CUSTOM_CLOTH_STYLES[cloth.style].name}${cloth.pattern && cloth.pattern !== 'plain' ? ` · ${CUSTOM_CLOTH_PATTERNS[cloth.pattern]} · ${(CUSTOM_CLOTH_SIZES[cloth.stitch] || CUSTOM_CLOTH_SIZES.medium).name}` : ''}</span></span>
                </button>
                <button class="icon-btn custom-copy" data-copy-cloth="${cloth.id}" aria-label="Copy ${esc(cloth.name)}">${icon('copy')}</button>
                <button class="icon-btn custom-edit" data-edit-cloth="${cloth.id}" aria-label="Restyle ${esc(cloth.name)}">${icon('pencil')}</button>
                <button class="icon-btn custom-delete" data-delete-cloth="${cloth.id}" aria-label="Delete ${esc(cloth.name)}">${icon('trash')}</button>
              </div>`).join('') : '<p class="tiny muted custom-empty">No custom clothes yet. Name an outfit above and add it to the unlimited wardrobe.</p>'}`;
          clothWrap.querySelectorAll('[data-wear-cloth]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const target = getTarget();
              if (!target) { toast('Hatch a sprite first, then pick an outfit.', '🧵'); return; }
              Actions.wearCustomClothes(target.id, btn.dataset.wearCloth);
              paint();
              Sfx.pop();
            });
          });
          clothWrap.querySelector('[data-outfit-none]')?.addEventListener('click', () => {
            const target = getTarget();
            if (!target) return;
            Actions.wearCustomClothes(target.id, null);
            paint();
            Sfx.click();
          });
          /* Copying saves the duplicate straight away and opens it for
             restyling, so a variation starts from the finished design. */
          clothWrap.querySelectorAll('[data-copy-cloth]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const made = Actions.duplicateCustomClothes(btn.dataset.copyCloth);
              if (!made.ok) return;
              editingClothId = made.cloth.id;
              applyClothFields(made.cloth);
              syncClothEditor();
              paintClothPreview();
              paint();
              root.querySelector('[data-cloth-preview]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
              toast(`${made.cloth.name} copied — adjust it, then press Save changes.`, '🧵');
              Sfx.pop();
            });
          });
          clothWrap.querySelectorAll('[data-edit-cloth]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const cloth = (state.customClothes || []).find((item) => item.id === btn.dataset.editCloth);
              if (!cloth) return;
              editingClothId = cloth.id;
              applyClothFields(cloth);
              syncClothEditor();
              paintClothPreview();
              root.querySelector('[data-cloth-preview]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
              Sfx.click();
            });
          });
          clothWrap.querySelectorAll('[data-delete-cloth]').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
              e.stopPropagation();
              const cloth = (state.customClothes || []).find((item) => item.id === btn.dataset.deleteCloth);
              if (!cloth) return;
              const yes = await confirmModal('Delete these clothes?', `“${cloth.name}” will be removed from every sprite wearing it.`, 'Delete clothes', { danger: true });
              if (!yes) return;
              Actions.deleteCustomClothes(cloth.id);
              if (editingClothId === cloth.id) resetClothEditor();
              paint();
            });
          });
        }
        const scenesWrap = root.querySelector('[data-custom-scenes]');
        if (scenesWrap) {
          const scenes = state.customScenes || [];
          scenesWrap.innerHTML = scenes.length ? scenes.map((scene) => `
            <div class="custom-scene-item ${state.theme.scene === scene.id ? 'on' : ''}">
              <button class="custom-scene-main" data-custom-scene="${scene.id}">
                <span class="custom-scene-art" style="background:linear-gradient(160deg, ${scene.sky}, ${scene.ground});color:${scene.accent}">${scene.emoji}</span>
                <span class="custom-item-copy"><b>${esc(scene.name)}</b><span>${esc(scene.habitat)} · +${Math.round((scene.bonus || 0.5) * 100)}% XP · ∞ sprites</span></span>
              </button>
              <button class="icon-btn custom-delete" data-delete-scene="${scene.id}" aria-label="Delete ${esc(scene.name)}">${icon('trash')}</button>
            </div>`).join('') : '<p class="tiny muted custom-empty">No custom biomes yet. Build one above and every sprite can move in.</p>';
          scenesWrap.querySelectorAll('[data-custom-scene]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const scene = (state.customScenes || []).find((item) => item.id === btn.dataset.customScene);
              if (!scene) return;
              const trip = Actions.setTheme({ scene: scene.id });
              toast(`${scene.emoji} ${scene.name} · every sprite is welcome here${trip && trip.coins ? ` · +${trip.coins} coins` : ''}.`, scene.emoji);
              paint();
              Sfx.click();
            });
          });
          scenesWrap.querySelectorAll('[data-delete-scene]').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
              e.stopPropagation();
              const scene = (state.customScenes || []).find((item) => item.id === btn.dataset.deleteScene);
              if (!scene) return;
              const yes = await confirmModal('Delete this biome?', `“${scene.name}” and its colors will be removed. Your sprites stay safe in the Hollow.`, 'Delete biome', { danger: true });
              if (!yes) return;
              Actions.deleteCustomScene(scene.id);
              paint();
            });
          });
        }
      };
      const eggState = { id: null };

      const paintSpritePicker = () => {
        const input = root.querySelector('[data-studio-search]');
        const clearBtn = root.querySelector('[data-studio-clear]');
        const typeBox = root.querySelector('[data-studio-types]');
        const box = root.querySelector('[data-sprite-picker]');
        if (input && !input.dataset.bound) {
          input.dataset.bound = '1';
          input.value = studioSpriteQuery;
          input.addEventListener('input', () => { studioSpriteQuery = input.value; paintSpritePicker(); });
        }
        if (clearBtn && !clearBtn.dataset.bound) {
          clearBtn.dataset.bound = '1';
          clearBtn.addEventListener('click', () => {
            studioSpriteQuery = '';
            studioTypeFilter = '';
            const field = root.querySelector('[data-studio-search]');
            if (field) { field.value = ''; field.focus(); }
            paintSpritePicker();
            Sfx.click();
          });
        }
        if (!box) return;
        const target = getTarget();
        const q = studioSpriteQuery.trim().toLowerCase();
        const eggs = state.sprites.filter((s) => s.stage === 'egg');
        const hit = (s) => (!studioTypeFilter || s.element === studioTypeFilter)
          && (!q || `${displayName(s)} ${typeName(s)} ${s.breed} ${s.element}`.toLowerCase().includes(q));
        const grownList = grownSprites().filter(hit);
        const eggList = (q || studioTypeFilter) ? eggs.filter(hit) : [];
        const filtering = !!(q || studioTypeFilter);
        if (clearBtn) clearBtn.hidden = !filtering;
        if (typeBox) {
          const typeCounts = new Map();
          grownSprites().concat(eggs).forEach((s) => {
            if (ELEMENTS[s.element]) typeCounts.set(s.element, (typeCounts.get(s.element) || 0) + 1);
          });
          /* Your most common sprite type is the most likely one to edit. */
          const types = [...typeCounts.keys()]
            .sort((a, b) => (typeCounts.get(b) || 0) - (typeCounts.get(a) || 0)
              || ELEMENTS[a].name.localeCompare(ELEMENTS[b].name));
          typeBox.innerHTML = `<button class="studio-type ${studioTypeFilter ? '' : 'on'}" data-studio-type="">All</button>`
            + types.map((k) => `<button class="studio-type ${studioTypeFilter === k ? 'on' : ''}" data-studio-type="${k}">${ELEMENTS[k].icon || '●'} ${ELEMENTS[k].name}</button>`).join('');
          typeBox.querySelectorAll('[data-studio-type]').forEach((b) => {
            b.addEventListener('click', () => {
              studioTypeFilter = b.dataset.studioType || '';
              paintSpritePicker();
              Sfx.click();
            });
          });
        }
        const grownChips = grownList.map((s) => `
          <button class="style-opt ${s.id === (target && target.id) ? 'on' : ''}" data-target="${s.id}">
            <span class="sw" style="background:${resolvePalette(s).body}"></span>${esc(displayName(s))}
          </button>`).join('');
        const eggChips = eggList.map((e) => `
          <button class="style-opt egg-chip ${e.id === eggState.id ? 'on' : ''}" data-target-egg="${e.id}">
            <span class="sw acc">🥚</span>${esc(displayName(e))}
          </button>`).join('');
        box.innerHTML = (grownChips + eggChips) || `<p class="tiny muted" style="padding:8px 2px;margin:0">${filtering ? 'Nothing matches that filter yet.' : 'No sprites yet.'}</p>`;
        box.querySelectorAll('[data-target]').forEach((b) => {
          b.addEventListener('click', () => { targetId = b.dataset.target; paint(); });
        });
        box.querySelectorAll('[data-target-egg]').forEach((b) => {
          b.addEventListener('click', () => {
            eggState.id = b.dataset.targetEgg;
            paint();
            root.querySelector('[data-egg-preview]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            Sfx.click();
          });
        });
      };

      const waitingEggs = () => state.sprites.filter((s) => s.stage === 'egg');

      const paintEggDecor = () => {
        const art = root.querySelector('[data-egg-preview]');
        const choices = root.querySelector('[data-egg-choices]');
        const pats = root.querySelector('[data-egg-patterns]');
        const pals = root.querySelector('[data-egg-palettes]');
        const note = root.querySelector('[data-egg-note]');
        if (!art) return;
        const list = waitingEggs();
        if (!list.length) {
          if (note) note.textContent = 'no waiting eggs';
          art.innerHTML = '<p class="tiny muted" style="margin:0">No waiting eggs. Buy or merge one in the Nest and it appears here.</p>';
          choices.innerHTML = '';
          pats.innerHTML = '';
          pals.innerHTML = '';
          return;
        }
        if (!list.some((e) => e.id === eggState.id)) eggState.id = list[0].id;
        const egg = list.find((e) => e.id === eggState.id) || list[0];
        const pattern = egg.pattern || 'spots';
        const palette = egg.palette || 'native';
        if (note) note.textContent = '40 coins per repaint';
        const paletteName = root.querySelector('[data-egg-palette-name]');
        if (paletteName) paletteName.textContent = PALETTES[palette]?.name || 'Native';
        art.innerHTML = `
          <div class="egg-stage">${eggSVG({ ...egg, pattern, palette }, { progress: egg.hatch || 20 })}</div>
          <div class="egg-caption">
            <b>${esc(displayName(egg))}</b>
            <span class="egg-caption-dot">·</span><span>${Math.round(egg.hatch || 0)}%</span>
            <span class="egg-caption-dot">·</span><span>${esc(PATTERNS[pattern].name)}</span>
            <span class="egg-caption-dot">·</span><span>${esc(PALETTES[palette]?.name || 'Native')}</span>
          </div>`;
        // Thumbnails of the actual shells, so ten waiting eggs read at a glance
        // instead of ten identical cards with a long name each.
        choices.innerHTML = list.map((e) => `
          <button class="egg-tile ${e.id === egg.id ? 'on' : ''}" data-egg-choice="${e.id}"
            title="${esc(displayName(e))}" aria-pressed="${e.id === egg.id}">
            <span class="egg-tile-art">${eggSVG({ ...e, id: e.id + '-tile' }, { progress: e.hatch || 0 })}</span>
            <span class="egg-tile-name">${esc(displayName(e))}</span>
          </button>`).join('');
        pats.innerHTML = PATTERN_KEYS.map((k) => `
          <button class="egg-pattern ${pattern === k ? 'on' : ''}" data-egg-pattern="${k}"
            title="${esc(PATTERNS[k].name)}" aria-pressed="${pattern === k}">
            <span class="egg-pattern-art">${eggSVG({ ...egg, id: egg.id + '-p-' + k, pattern: k, palette }, { progress: 0 })}</span>
            <span class="egg-pattern-name">${esc(PATTERNS[k].name)}</span>
          </button>`).join('');
        pals.innerHTML = PALETTE_KEYS.map((k) => `
          <button class="decor-swatch ${palette === k ? 'on' : ''}" data-egg-palette="${k}"
            aria-label="${esc(PALETTES[k]?.name || k)}" aria-pressed="${palette === k}"
            title="${esc(PALETTES[k]?.name || k)}" style="--sw:${resolvePalette({ ...egg, palette: k }).body}"></button>`).join('');

        const repaint = (patchIn) => {
          const res = Actions.decorateEgg(egg.id, patchIn);
          if (!res.ok && res.reason === 'coins') toast('Decorating a shell costs 40 coins.', '🪙');
          if (res.ok && !res.unchanged) Sfx.coin();
          paint();
        };
        choices.querySelectorAll('[data-egg-choice]').forEach((b) => {
          b.addEventListener('click', () => { eggState.id = b.dataset.eggChoice; paint(); Sfx.click(); });
        });
        pats.querySelectorAll('[data-egg-pattern]').forEach((b) => {
          b.addEventListener('click', () => repaint({ pattern: b.dataset.eggPattern, palette }));
        });
        pals.querySelectorAll('[data-egg-palette]').forEach((b) => {
          b.addEventListener('click', () => repaint({ pattern, palette: b.dataset.eggPalette }));
        });
      };

      const paint = () => {
        paintCustomSections();
        bindWheel();
        paintWheel();
        root.querySelectorAll('[data-climate]').forEach((b) => b.classList.toggle('on', b.dataset.climate === (state.world?.climate || 'temperate')));
        const voiceKey = state.theme.voice === false ? 'off' : (state.theme.voiceType === 'male' ? 'male' : 'female');
        root.querySelectorAll('[data-voice]').forEach((b) => b.classList.toggle('on', b.dataset.voice === voiceKey));
        root.querySelectorAll('[data-language]').forEach((b) => b.classList.toggle('on', b.dataset.language === uiLang()));
        const languageNote = root.querySelector('[data-language-note]');
        if (languageNote) languageNote.textContent = `${I18N_LANGUAGES[uiLang()].native} · ${I18N[uiLang()]['settings.languageNote']}`;
        const voiceNote = root.querySelector('[data-voice-note]');
        if (voiceNote) {
          voiceNote.textContent = voiceKey === 'off'
            ? 'Voice is off — no greetings, goodnights, return updates, or needs reminders.'
            : `Spoken greetings, goodnights, and needs reminders use a ${voiceKey} voice.`;
        }
        const note = root.querySelector('[data-world-note]');
        if (note) {
          const climate = CLIMATES[state.world?.climate] || CLIMATES.temperate;
          const season = seasonOf();
          const wx = currentWeather();
          note.textContent = `${season.icon} ${seasonLabel(season, climate.key)} · ${wx.icon} ${wx.name}. ${wx.blurb} ${climate.blurb} Switching climates is free.`;
        }
        const chosenScene = SCENES[state.theme.scene] || SCENES.grove;
        const chosenTarget = getTarget();
        const habitatInfo = root.querySelector('[data-habitat-info]');
        if (habitatInfo) {
          const names = chosenScene.custom
            ? 'Every species is welcome here — no resident limit.'
            : chosenScene.species.slice(0, 6).map((k) => ELEMENTS[k].name).join(' · ');
          const extra = chosenScene.custom ? 0 : chosenScene.species.length - 6;
          const targetHabitat = chosenTarget ? habitatFor(chosenTarget) : null;
          habitatInfo.innerHTML = `<div class="between"><b>${chosenScene.emoji} ${chosenScene.habitat} habitat</b><span class="chip habitat-bonus">+${Math.round((chosenScene.bonus || 0.4) * 100)}% XP</span></div>
            <p>${chosenScene.custom ? `${chosenScene.name} is your custom environment. Every sprite gets the full habitat bonus, and all grown sprites can share it at once.` : `${chosenScene.name} helps ${chosenScene.habitat.toLowerCase()} species grow faster. Visitors still get +10% XP.`}</p>
            <p class="tiny muted">${names}${extra > 0 ? ` · +${extra} more` : ''}</p>
            ${chosenTarget ? `<p class="tiny ${targetHabitat.match ? 'habitat-match' : 'muted'}">${targetHabitat.match ? `${esc(displayName(chosenTarget))} is thriving here.` : `${esc(displayName(chosenTarget))} gets the visitor bonus here.`}</p>` : ''}`;
        }
        const t = chosenTarget;
        paintPreview();
        const wrap = root.querySelector('[data-preview-wrap]');
        paintEggDecor();
        if (!t) {
          wrap.innerHTML = `<div class="card empty-state" style="padding:18px">Hatch a sprite to customize their look.</div>`;
          root.querySelector('[data-bodies]').innerHTML = '';
          root.querySelector('[data-palettes]').innerHTML = '';
          root.querySelector('[data-patterns]').innerHTML = '';
          root.querySelector('[data-shapes]').innerHTML = '';
          root.querySelector('[data-accessories]').innerHTML = '';
          root.querySelector('[data-arms]').innerHTML = '';
          root.querySelector('[data-noses]').innerHTML = '';
          root.querySelector('[data-legs]').innerHTML = '';
          return;
        }
        wrap.innerHTML = `<div class="preview-box" style="position:relative">
          <div style="position:absolute;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle, ${resolvePalette(t).body}55, transparent 65%);filter:blur(12px)"></div>
          ${spriteSVG(t, { expr: 'happy' })}
          <div class="row" style="flex-wrap:wrap;justify-content:center;gap:4px">
            <span class="chip">${esc(displayName(t))}</span>
            <span class="chip">${typeName(t)}</span>
            <span class="chip">Lv ${t.level}${t.level >= MAX_LEVEL ? ' · MAX' : ''}</span>
            ${t.mutation ? `<span class="chip chip-mut">✦ ${esc(t.mutation)}</span>` : ''}
          </div>
        </div>`;

        paintSpritePicker();

        root.querySelector('[data-bodies]').innerHTML = BREED_KEYS.map((k) => `
          <button class="style-opt ${t.breed === k ? 'on' : ''}" data-breed="${k}">
            <span class="sw acc">${BREEDS[k].icon || '●'}</span>${BREEDS[k].name}
          </button>`).join('');
        root.querySelectorAll('[data-breed]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { breed: b.dataset.breed }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-palettes]').innerHTML = PALETTE_KEYS.map((k) => {
          const colors = k === 'native' ? ELEMENTS[t.element] : PALETTES[k];
          const bg = k === 'native'
            ? `linear-gradient(135deg, ${ELEMENTS[t.element].primary}, ${ELEMENTS[t.element].accent})`
            : `linear-gradient(135deg, ${PALETTES[k].body}, ${PALETTES[k].accent})`;
          return `<button class="style-opt ${t.palette === k ? 'on' : ''}" data-palette="${k}">
            <span class="sw" style="background:${bg}"></span>${k === 'native' ? 'Native' : PALETTES[k].name}
          </button>`;
        }).join('');
        root.querySelectorAll('[data-palette]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { palette: b.dataset.palette }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-patterns]').innerHTML = PATTERN_KEYS.map((k) => `
          <button class="style-opt ${t.pattern === k ? 'on' : ''}" data-pattern="${k}">
            <span class="sw acc">${PATTERNS[k].icon}</span>${PATTERNS[k].name}
          </button>`).join('');
        root.querySelectorAll('[data-pattern]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { pattern: b.dataset.pattern }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-accessories]').innerHTML = ACCESSORY_KEYS.map((k) => {
          const owned = ownsGear(k);
          return `<button class="style-opt ${t.accessory === k ? 'on' : ''} ${owned ? '' : 'locked-gear'}" data-acc="${k}">
            <span class="sw acc">${ACCESSORIES[k].icon}</span>${ACCESSORIES[k].name}${owned ? '' : ` · ${ACCESSORIES[k].price}🪙`}
          </button>`;
        }).join('');
        root.querySelectorAll('[data-acc]').forEach((b) => {
          b.addEventListener('click', () => {
            const key = b.dataset.acc;
            const bought = ownsGear(key) || Actions.buyGear(key).ok;
            if (bought) Actions.customize(t.id, { accessory: key });
            paint();
            Sfx.pop();
          });
        });

        root.querySelector('[data-heads]').innerHTML = HEAD_SHAPE_KEYS.map((k) => `
          <button class="style-opt ${(t.head || 'breed') === k ? 'on' : ''}" data-head="${k}">${HEAD_SHAPES[k].name}</button>`).join('');
        root.querySelectorAll('[data-head]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { head: b.dataset.head }); paint(); Sfx.pop(); });
        });

        /* One tap sets the round puff body, a puff breed and a matching fur
           style together, so a whole family look takes a single press. */
        const PUFF_PRESETS = [
          { key: 'classic', label: 'Classic puff', icon: '🫧', breed: 'floof', hair: 'crest', palette: 'native' },
          { key: 'ragfluff', label: 'Rag fluff', icon: '🧸', breed: 'ragfluff', hair: 'tufts', palette: 'native' },
          { key: 'frozen', label: 'Frozen puff', icon: '🧊', breed: 'frozenpuff', hair: 'tufts', palette: 'glacier' },
          { key: 'firedemon', label: 'Fire demon', icon: '🔥', breed: 'firedemonpuff', hair: 'crest', palette: 'hellfire' },
          { key: 'frostangel', label: 'Frost angel', icon: '❄️', breed: 'frozenangelpuff', hair: 'topknot', palette: 'quartzrose' },
          { key: 'moonpuff', label: 'Moon puff', icon: '🌙', breed: 'angelpuff', hair: 'topknot', palette: 'abyssal' },
          { key: 'marsh', label: 'Marsh puff', icon: '🪴', breed: 'mudpuff', hair: 'crest', palette: 'vineglow' },
          { key: 'spark', label: 'Spark puff', icon: '⚡', breed: 'sparkpuff', hair: 'tufts', palette: 'stormgrey' },
          { key: 'spritepuffle', label: 'Sprite Puffle', icon: '☁️', breed: 'floof', hair: 'tufts', palette: 'puffcloud', fur: 'puffle', furCover: 100 },
          { key: 'ultrafluff', label: 'Ultra fluff', icon: '🌥️', breed: 'floof', hair: 'tufts', palette: 'puffcloud', fur: 'ultra', furCover: 100 },
          { key: 'ancientdream', label: 'Ancient Dream', icon: '🌌', breed: 'floof', hair: 'topknot', palette: 'dreamcloud', fur: 'dream', furCover: 100 },
          /* One preset per species file, so every sprite in the assets data is
             one tap from being worn by the sprite in the Studio. */
          ...(typeof spriteSpeciesPresets === 'function' ? spriteSpeciesPresets() : []),
        ];
        let presetBox = root.querySelector('[data-puff-presets]');
        if (!presetBox) {
          presetBox = document.createElement('div');
          presetBox.className = 'style-picker';
          presetBox.setAttribute('data-puff-presets', '1');
          presetBox.style.marginBottom = '8px';
          const shapes = root.querySelector('[data-shapes]');
          if (shapes && shapes.parentNode) shapes.parentNode.insertBefore(presetBox, shapes);
        }
        if (presetBox) {
          presetBox.innerHTML = PUFF_PRESETS.map((p) => {
            const lock = p.fur ? (typeof furUnlockInfo === 'function' ? furUnlockInfo(p.fur) : { unlocked: true, have: 0, need: 0, blurb: '' }) : { unlocked: true };
            return `<button class="style-opt${lock.unlocked ? '' : ' locked'}" data-puff-preset="${p.key}"${lock.unlocked ? '' : ` data-locked="1" title="${lock.blurb} · ${lock.have}/${lock.need}"`}><span class="sw acc">${lock.unlocked ? p.icon : '🔒'}</span>${p.label}</button>`;
          }).join('');
          presetBox.querySelectorAll('[data-puff-preset]').forEach((b) => {
            b.addEventListener('click', () => {
              const p = PUFF_PRESETS.find((x) => x.key === b.dataset.puffPreset);
              if (!p) return;
              const lock = p.fur ? (typeof furUnlockInfo === 'function' ? furUnlockInfo(p.fur) : { unlocked: true }) : { unlocked: true };
              if (!lock.unlocked) {
                toast(`${p.label} is earned: ${lock.blurb} first (${lock.have}/${lock.need}).`, '🔒');
                Sfx.pop();
                return;
              }
              Actions.customize(t.id, { shape: p.shape || 'round', breed: p.breed, hair: p.hair, palette: p.palette, fur: p.fur, furCover: p.furCover });
              paint();
              Sfx.pop();
              toast(`${p.icon} ${p.label} preset applied.`, p.icon);
            });
          });
        }

        const activeShape = t.shape && CP_PUFFLE_SHAPE_KEYS.includes(t.shape) ? t.shape : 'cp_classic';
        root.querySelector('[data-shapes]').innerHTML = CP_PUFFLE_SHAPE_KEYS.map((k) => {
          const shape = BODY_SHAPES[k];
          return `<button class="style-opt ${activeShape === k ? 'on' : ''}" type="button" data-body-shape="${k}" title="${esc(shape.name)} silhouette"><span class="sw acc"><svg viewBox="0 0 120 120" width="18" height="18" aria-hidden="true"><path d="${shape.path}" fill="currentColor"/></svg></span>${esc(shape.name)}</button>`;
        }).join('') + `<p class="tiny muted" style="grid-column:1/-1;margin:2px 0 0;line-height:1.45">Original Club Penguin-style puffle silhouettes. Pick a body, then keep customising ears, hair, fur, colours and markings.</p>`;
        root.querySelectorAll('[data-body-shape]').forEach((b) => {
          b.addEventListener('click', () => {
            if (!BODY_SHAPES[b.dataset.bodyShape]) return;
            skipNextCustomizePaint = true;
            Actions.customize(t.id, { shape: b.dataset.bodyShape });
            skipNextCustomizePaint = false;
            /* Shape only changes the body outline and this preview. Rebuilding
               every Studio section here made picking a silhouette feel like a
               page reload, so swap the one SVG and the selected rim instead. */
            const box = root.querySelector('.preview-box');
            const oldSvg = box?.querySelector('svg');
            const freshSvg = oldSvg ? spriteSVG(t, { expr: 'happy' }) : null;
            if (oldSvg && freshSvg) oldSvg.outerHTML = freshSvg;
            root.querySelectorAll('[data-body-shape]').forEach((entry) => {
              entry.classList.toggle('on', entry === b);
            });
            Sfx.pop();
          });
        });

        /* Ultra and Ancient Dream are earned coats: locked buttons show the
           requirement instead of styling the pet. */
        const furLock = (k) => (typeof furUnlockInfo === 'function' ? furUnlockInfo(k) : { unlocked: true, have: 0, need: 0, blurb: '' });
        root.querySelector('[data-furs]').innerHTML = FUR_STYLE_KEYS.map((k) => {
          const lock = furLock(k);
          return `<button class="style-opt${lock.unlocked ? '' : ' locked'} ${(t.fur || 'puffle') === k ? 'on' : ''}" data-fur-style="${k}"${lock.unlocked ? '' : ` data-locked="1" title="${lock.blurb} · ${lock.have}/${lock.need}"`}><span class="sw acc">${lock.unlocked ? FUR_STYLES[k].icon : '🔒'}</span>${FUR_STYLES[k].name}</button>`;
        }).join('');
        root.querySelectorAll('[data-fur-style]').forEach((b) => {
          b.addEventListener('click', () => {
            const info = furLock(b.dataset.furStyle);
            if (!info.unlocked) {
              toast(`${FUR_STYLES[b.dataset.furStyle].name} is earned: ${info.blurb} first (${info.have}/${info.need}).`, '🔒');
              Sfx.pop();
              return;
            }
            Actions.customize(t.id, { fur: b.dataset.furStyle }); paint(); Sfx.pop();
          });
        });

        const furStrip = root.querySelector('[data-fur-strip]');
        if (furStrip) {
          furStrip.innerHTML = FUR_STYLE_KEYS.map((k) => {
            const lock = furLock(k);
            return `<button class="fur-thumb${lock.unlocked ? '' : ' locked'} ${(t.fur || 'puffle') === k ? 'on' : ''}" type="button" data-fur-thumb="${k}" aria-label="${FUR_STYLES[k].name} fur" aria-pressed="${(t.fur || 'puffle') === k}"${lock.unlocked ? '' : ` data-locked="1" title="${lock.blurb} · ${lock.have}/${lock.need}"`}>
              <span class="fur-thumb-art">${spriteSVG({ ...t, id: `${t.id}-fur-${k}`, fur: k }, { expr: 'happy', still: true })}</span>
              <b>${lock.unlocked ? FUR_STYLES[k].name : `🔒 ${FUR_STYLES[k].name}`}</b>
            </button>`;
          }).join('');
          furStrip.querySelectorAll('[data-fur-thumb]').forEach((b) => {
            b.addEventListener('click', () => {
              const info = furLock(b.dataset.furThumb);
              if (!info.unlocked) {
                toast(`${FUR_STYLES[b.dataset.furThumb].name} is earned: ${info.blurb} first (${info.have}/${info.need}).`, '🔒');
                Sfx.pop();
                return;
              }
              Actions.customize(t.id, { fur: b.dataset.furThumb }); paint(); Sfx.pop();
            });
          });
        }

        /* Locked coats show how close the player is, using the same care
           counters that grant them, so the goal sits where the coat lives
           instead of only appearing in a toast. */
        const furLocks = root.querySelector('[data-fur-locks]');
        if (furLocks) {
          const lockMeta = {
            ultra: { icon: '☁️', unit: 'belly rub' },
            dream: { icon: '🌌', unit: 'nap' },
          };
          const lockRows = ['ultra', 'dream']
            .filter((k) => !furLock(k).unlocked)
            .map((k) => {
              const info = furLock(k);
              const meta = lockMeta[k] || { icon: '🔒', unit: 'care action' };
              const pct = Math.max(0, Math.min(100, Math.round((info.have / Math.max(1, info.need)) * 100)));
              const unit = `${meta.unit}${meta.unit.endsWith('s') ? '' : 's'}`;
              return `<div class="fur-lock-row" data-fur-lock="${k}">
                  <span class="fur-lock-icon" aria-hidden="true">${meta.icon}</span>
                  <div class="fur-lock-main">
                    <div class="fur-lock-head"><b>${FUR_STYLES[k].name}</b><span>${info.have} / ${info.need} ${unit}</span></div>
                    <div class="fur-lock-track" role="progressbar" aria-valuemin="0" aria-valuemax="${info.need}" aria-valuenow="${Math.min(info.have, info.need)}" aria-label="${FUR_STYLES[k].name} progress"><i style="width:${pct}%"></i></div>
                    <span class="fur-lock-left">${Math.max(0, info.need - info.have)} more ${unit} to unlock</span>
                  </div>
                </div>`;
            });
          furLocks.innerHTML = lockRows.join('');
          furLocks.hidden = !lockRows.length;
        }

        const furTipInput = root.querySelector('[data-fur-tip]');
        const furTipHex = root.querySelector('[data-fur-tip-hex]');
        const furAccentInput = root.querySelector('[data-fur-accent]');
        const furAccentHex = root.querySelector('[data-fur-accent-hex]');
        if (furTipInput) {
          const pal = resolvePalette(t);
          const tipValue = t.furTip || mix(pal.light, '#ffffff', 0.5);
          const accentValue = t.furAccent || mix(pal.accent, pal.light, 0.38);
          furTipInput.value = tipValue;
          furAccentInput.value = accentValue;
          if (furTipHex) furTipHex.textContent = String(tipValue).toUpperCase();
          if (furAccentHex) furAccentHex.textContent = String(accentValue).toUpperCase();
          furTipInput.onchange = () => { Actions.customize(t.id, { furTip: furTipInput.value }); paint(); Sfx.pop(); };
          furAccentInput.onchange = () => { Actions.customize(t.id, { furAccent: furAccentInput.value }); paint(); Sfx.pop(); };
        }
        const furReset = root.querySelector('[data-fur-reset]');
        if (furReset) furReset.onclick = () => { Actions.customize(t.id, { furTip: null, furAccent: null }); paint(); Sfx.pop(); };

        const coverSlider = root.querySelector('[data-fur-cover]');
        const coverOut = root.querySelector('[data-fur-cover-readout]');
        if (coverSlider) {
          const coverDefault = typeof FUR_COVER_DEFAULT !== 'undefined' ? FUR_COVER_DEFAULT : 65;
          const coverValue = Number.isFinite(Number(t.furCover)) ? Number(t.furCover) : coverDefault;
          coverSlider.value = String(coverValue);
          const showCover = () => { if (coverOut) coverOut.textContent = `${coverSlider.value}%`; };
          showCover();
          /* Repaint only the artwork while dragging: the preview and the strip
             thumbs are swapped in place, so the slider never leaves the finger
             and the save is still written once, on release. */
          let coverFrame = 0;
          const liveCover = () => {
            coverFrame = 0;
            const value = Number(coverSlider.value);
            const live = { ...t, furCover: value };
            const previewWrap = root.querySelector('[data-preview-wrap]');
            const oldSvg = previewWrap ? previewWrap.querySelector('svg') : null;
            if (oldSvg) {
              const holder = document.createElement('div');
              holder.innerHTML = spriteSVG(live, { expr: 'happy' });
              const next = holder.firstElementChild;
              if (next) oldSvg.replaceWith(next);
            }
          };
          coverSlider.oninput = () => {
            showCover();
            if (!coverFrame) coverFrame = requestAnimationFrame(liveCover);
          };
          coverSlider.onchange = () => {
            if (coverFrame) { cancelAnimationFrame(coverFrame); coverFrame = 0; }
            Actions.customize(t.id, { furCover: Number(coverSlider.value) });
            paint();
            Sfx.pop();
          };
        }

        const hueSlider = root.querySelector('[data-hue-slider]');
        const hueOut = root.querySelector('[data-hue-readout]');
        if (hueSlider) {
          hueSlider.value = String(Number(t.hue) || 0);
          const showHue = () => { if (hueOut) hueOut.textContent = `${hueSlider.value}°`; };
          showHue();
          /* Same live pattern as fur coverage: swap the preview art each frame,
             keep the slider node, and write the save once on release. */
          let hueFrame = 0;
          const liveHue = () => {
            hueFrame = 0;
            const wrap = root.querySelector('[data-preview-wrap]');
            const oldSvg = wrap ? wrap.querySelector('svg') : null;
            if (!oldSvg) return;
            const holder = document.createElement('div');
            holder.innerHTML = spriteSVG({ ...t, hue: Number(hueSlider.value) }, { expr: 'happy' });
            const next = holder.firstElementChild;
            if (next) oldSvg.replaceWith(next);
          };
          hueSlider.oninput = () => {
            showHue();
            if (!hueFrame) hueFrame = requestAnimationFrame(liveHue);
          };
          hueSlider.onchange = () => {
            if (hueFrame) { cancelAnimationFrame(hueFrame); hueFrame = 0; }
            Actions.customize(t.id, { hue: Number(hueSlider.value) });
            paint();
            Sfx.pop();
          };
        }
        const hueReset = root.querySelector('[data-hue-reset]');
        if (hueReset) hueReset.onclick = () => { Actions.customize(t.id, { hue: 0 }); paint(); Sfx.pop(); };

        root.querySelector('[data-hair]').innerHTML = HAIR_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.hair || 'none') === k ? 'on' : ''}" data-hair-style="${k}"><span class="sw acc">${HAIR_STYLES[k].icon}</span>${HAIR_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-hair-style]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { hair: b.dataset.hairStyle }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-hats]').innerHTML = HAT_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.hat || 'none') === k ? 'on' : ''}" data-hat-key="${k}"><span class="sw acc">${HAT_STYLES[k].icon}</span>${HAT_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-hat-key]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { hat: b.dataset.hatKey }); paint(); Sfx.pop(); });
        });

        /* Lumi wardrobe: the garment is baked into the pet's sheet, so a pick
           here swaps the sheet the sprite animates from. */
        let garmentBox = root.querySelector('[data-lumi-garments]');
        if (!garmentBox) {
          garmentBox = document.createElement('div');
          garmentBox.className = 'style-picker';
          garmentBox.setAttribute('data-lumi-garments', '1');
          garmentBox.style.marginBottom = '8px';
          const hats = root.querySelector('[data-hats]');
          if (hats && hats.parentNode) hats.parentNode.insertBefore(garmentBox, hats.nextSibling);
        }
        if (garmentBox) {
          /* Slot names come from the generated wardrobe list, so a kit's six
             garments are labelled with the clothes actually baked into them. */
          const kitName = typeof lumiKitFor === 'function' ? lumiKitFor(t) : 'round';
          const plan = (window.LUMI_WARDROBE && window.LUMI_WARDROBE[kitName]) || [
            { slot: 0, name: 'Family look', icon: '🧵' },
          ];
          garmentBox.innerHTML = plan.map((g) => `
            <button class="style-opt ${((t.garment | 0) === g.slot) ? 'on' : ''}" data-lumi-garment="${g.slot}"><span class="sw acc">${g.icon}</span>${g.name}</button>`).join('');
          garmentBox.querySelectorAll('[data-lumi-garment]').forEach((b) => {
            b.addEventListener('click', () => {
              Actions.customize(t.id, { garment: Number(b.dataset.lumiGarment) });
              paint();
              Sfx.pop();
            });
          });
        }

        /* Puffle palettes: the exact colours from the art reference. */
        let variantBox = root.querySelector('[data-puffle-variants]');
        if (!variantBox) {
          variantBox = document.createElement('div');
          variantBox.className = 'style-picker';
          variantBox.setAttribute('data-puffle-variants', '1');
          variantBox.style.marginBottom = '8px';
          const host = root.querySelector('[data-lumi-garments]');
          if (host && host.parentNode) host.parentNode.insertBefore(variantBox, host.nextSibling);
        }
        if (variantBox && window.LUMI_PUFFLE_VARIANTS) {
          const currentVariant = String((typeof window.lumiPuffleStyleOfSprite === 'function' ? window.lumiPuffleStyleOfSprite(t) : t.puffleVariant) || 'common');
          const tierOf = (key) => (typeof window.lumiPuffleTierOf === 'function' ? window.lumiPuffleTierOf(key) : null);
          variantBox.innerHTML = window.LUMI_PUFFLE_VARIANT_KEYS.map((key) => {
            const v = window.LUMI_PUFFLE_VARIANTS[key];
            const tier = tierOf(key);
            const tip = tier ? `${v.name} · ${tier.name} — ${tier.motto}` : v.name;
            const ring = tier ? `box-shadow:0 0 0 2px ${tier.color}66` : '';
            return `<button class="style-opt ${currentVariant === key ? 'on' : ''}" data-puffle-variant="${key}" title="${esc(tip)}"><span class="sw" style="background:linear-gradient(135deg, ${v.primary}, ${v.secondary});${ring}"></span>${v.name.replace(' Puffle', '')}</button>`;
          }).join('');
          variantBox.querySelectorAll('[data-puffle-variant]').forEach((b) => {
            b.addEventListener('click', () => {
              Actions.customize(t.id, { puffleVariant: b.dataset.puffleVariant });
              paint();
              Sfx.pop();
            });
          });
        }

        root.querySelector('[data-scarves]').innerHTML = SCARF_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.scarf || 'none') === k ? 'on' : ''}" data-scarf-key="${k}"><span class="sw acc">${SCARF_STYLES[k].icon}</span>${SCARF_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-scarf-key]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { scarf: b.dataset.scarfKey }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-ears]').innerHTML = EAR_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.ears || 'breed') === k ? 'on' : ''}" data-ear-style="${k}"><span class="sw acc">${EAR_STYLES[k].icon}</span>${EAR_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-ear-style]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { ears: b.dataset.earStyle }); paint(); Sfx.pop(); });
        });

        const chosenWings = t.wings && WING_STYLES[t.wings] ? t.wings : ((typeof starlitHasWings === 'function' ? starlitHasWings(t) : true) ? 'round' : 'none');
        const wingBox = root.querySelector('[data-wings]');
        if (wingBox) {
          wingBox.innerHTML = WING_STYLE_KEYS.map((k) => `
            <button class="style-opt ${chosenWings === k ? 'on' : ''}" data-wing-style="${k}"><span class="sw acc">${WING_STYLES[k].icon}</span>${WING_STYLES[k].name}</button>`).join('');
          wingBox.querySelectorAll('[data-wing-style]').forEach((b) => {
            b.addEventListener('click', () => {
              Actions.customize(t.id, { wings: b.dataset.wingStyle });
              paint();
              Sfx.pop();
            });
          });
        }
        const wingColorInput = root.querySelector('[data-wing-color]');
        const wingColorHex = root.querySelector('[data-wing-color-hex]');
        if (wingColorInput) {
          const pal = resolvePalette(t);
          const currentWing = t.wingColor || pal.light;
          wingColorInput.value = currentWing;
          if (wingColorHex) wingColorHex.textContent = String(currentWing).toUpperCase();
          wingColorInput.onchange = () => { Actions.customize(t.id, { wingColor: wingColorInput.value }); paint(); Sfx.pop(); };
        }
        const wingReset = root.querySelector('[data-wing-reset]');
        if (wingReset) wingReset.onclick = () => { Actions.customize(t.id, { wingColor: null }); paint(); Sfx.pop(); };

        const chosenEyes = t.eyes && EYE_STYLES[t.eyes] ? t.eyes : 'breed';
        root.querySelector('[data-eyes]').innerHTML = `<button class="style-opt ${chosenEyes === 'breed' ? 'on' : ''}" data-eye-style="breed"><span class="sw acc">\u{1F3B2}</span>Rolled</button>` + EYE_STYLE_KEYS.map((k) => `
          <button class="style-opt ${chosenEyes === k ? 'on' : ''}" data-eye-style="${k}"><span class="sw acc">${EYE_STYLES[k].icon}</span>${EYE_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-eye-style]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { eyes: b.dataset.eyeStyle }); paint(); Sfx.pop(); });
        });
        /* Iris colour is its own choice, so a custom face survives a dye job. */
        const faceRoll = spriteTraits(t);
        const irisInput = root.querySelector('[data-iris]');
        const irisHexOut = root.querySelector('[data-iris-hex]');
        if (irisInput) {
          irisInput.value = faceRoll.iris;
          if (irisHexOut) irisHexOut.textContent = String(faceRoll.iris).toUpperCase();
          irisInput.onchange = () => { Actions.customize(t.id, { iris: irisInput.value }); paint(); Sfx.pop(); };
        }
        const irisPresets = root.querySelector('[data-iris-presets]');
        if (irisPresets) {
          const swatches = ['#F2A33C', '#4FC3F7', '#8BC34A', '#FF6B9D', '#B388FF', BRAND.gold, '#26C6DA', '#FF5252', '#66BB6A', '#AB47BC', '#FFA726', '#42A5F5'];
          irisPresets.innerHTML = swatches.map((col) => `<button class="style-opt ${String(faceRoll.iris).toLowerCase() === col.toLowerCase() ? 'on' : ''}" data-iris-preset="${col}" title="Iris ${col}"><span class="sw" style="background:${col}"></span>${col.slice(1, 4)}</button>`).join('');
          irisPresets.querySelectorAll('[data-iris-preset]').forEach((b) => {
            b.addEventListener('click', () => { Actions.customize(t.id, { iris: b.dataset.irisPreset }); paint(); Sfx.pop(); });
          });
        }

        const chosenMouth = t.mouth && MOUTH_STYLES[t.mouth] ? t.mouth : 'breed';
        root.querySelector('[data-mouths]').innerHTML = MOUTH_STYLE_KEYS.map((k) => `
          <button class="style-opt ${chosenMouth === k ? 'on' : ''}" data-mouth-style="${k}"><span class="sw acc">${MOUTH_STYLES[k].icon}</span>${MOUTH_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-mouth-style]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { mouth: b.dataset.mouthStyle }); paint(); Sfx.pop(); });
        });
        root.querySelector('[data-face-reset]').addEventListener('click', () => {
          Actions.customize(t.id, { eyes: 'breed', mouth: 'breed', iris: null });
          paint();
          Sfx.pop();
        });

        // Lumi sheet skins: the pet animates from the pack's frame indices.
        const lumiWrap = root.querySelector('[data-lumi-skins]');
        if (lumiWrap && typeof SPRITE_SHEET !== 'undefined') {
          const currentSkin = String(t.skin || '');
          lumiWrap.innerHTML = `<button class="style-opt ${!currentSkin ? 'on' : ''}" data-lumi-skin="none"><span class="sw acc">✦</span>No sheet</button>` +
            SPRITE_SHEET.keys.map((k) => `<button class="style-opt ${currentSkin === 'lumi:' + k ? 'on' : ''}" data-lumi-skin="lumi:${k}"><span class="sw acc">${SPRITE_SHEET.forms[k].icon}</span>${SPRITE_SHEET.forms[k].name}</button>`).join('');
          lumiWrap.querySelectorAll('[data-lumi-skin]').forEach((b) => {
            b.addEventListener('click', () => {
              Actions.customize(t.id, { skin: b.dataset.lumiSkin === 'none' ? null : b.dataset.lumiSkin });
              paint();
              Sfx.pop();
            });
          });
        }

        root.querySelector('[data-noses]').innerHTML = NOSE_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.nose || 'none') === k ? 'on' : ''}" data-nose-style="${k}"><span class="sw acc">${NOSE_STYLES[k].icon}</span>${NOSE_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-nose-style]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { nose: b.dataset.noseStyle }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-arms]').innerHTML = ARM_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.arms || 'nub') === k ? 'on' : ''}" data-arms-key="${k}"><span class="sw acc">${ARM_STYLES[k].icon}</span>${ARM_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-arms-key]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { arms: b.dataset.armsKey }); paint(); Sfx.pop(); });
        });

        root.querySelector('[data-legs]').innerHTML = LEG_STYLE_KEYS.map((k) => `
          <button class="style-opt ${(t.legs || 'breed') === k ? 'on' : ''}" data-legs-key="${k}"><span class="sw acc">${LEG_STYLES[k].icon}</span>${LEG_STYLES[k].name}</button>`).join('');
        root.querySelectorAll('[data-legs-key]').forEach((b) => {
          b.addEventListener('click', () => { Actions.customize(t.id, { legs: b.dataset.legsKey }); paint(); Sfx.pop(); });
        });


        const dyePalette = resolvePalette(t);
        root.querySelectorAll('[data-dye]').forEach((input) => {
          const key = input.dataset.dye;
          const hexOut = root.querySelector(`[data-dye-hex="${key}"]`);
          const syncHex = () => { if (hexOut) hexOut.textContent = String(input.value).toUpperCase(); };
          input.value = dyePalette[key] || BRAND.accent;
          syncHex();
          input.onchange = () => {
            const custom = {};
            root.querySelectorAll('[data-dye]').forEach((field) => { custom[field.dataset.dye] = field.value; });
            Actions.customize(t.id, { palette: 'custom', custom });
            paint();
            Sfx.pop();
          };
        });
        root.querySelector('[data-dye-presets]').innerHTML = DYE_PRESETS.map((hex) => `<button class="sh-tint-dot" type="button" style="background:linear-gradient(135deg,${hex},${mix(hex, '#ffffff', 0.5)})" data-dye-preset="${hex}" aria-label="Dye this sprite ${hex}"></button>`).join('');
        root.querySelectorAll('[data-dye-preset]').forEach((b) => {
          b.addEventListener('click', () => {
            const hex = b.dataset.dyePreset;
            Actions.customize(t.id, { palette: 'custom', custom: { body: hex, light: mix(hex, '#ffffff', 0.62), deep: mix(hex, '#000000', 0.42), accent: mix(hex, BRAND.gold, 0.5), belly: mix(hex, '#ffffff', 0.8) } });
            paint();
            Sfx.pop();
          });
        });
        root.querySelector('[data-dye-natural]').onclick = () => { Actions.customize(t.id, { palette: 'native' }); paint(); Sfx.pop(); };

        root.querySelectorAll('[data-toggle]').forEach((b) => {
          const on = b.dataset.toggle === 'summonCovers' ? state.theme.summonCovers === true : state.theme[b.dataset.toggle] !== false;
          b.classList.toggle('on', on);
        });
        root.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('on', b.dataset.theme === state.theme.ui));
        root.querySelectorAll('[data-fluff]').forEach((b) => b.classList.toggle('on', (state.theme.fluff || 'soft') === b.dataset.fluff));
        root.querySelectorAll('[data-fx-level]').forEach((b) => b.classList.toggle('on', (state.theme.elementFx || 'soft') === b.dataset.fxLevel));
        root.querySelectorAll('[data-motion]').forEach((b) => b.classList.toggle('on', (state.theme.motion || 'full') === b.dataset.motion));
        root.querySelectorAll('[data-scene]').forEach((b) => b.classList.toggle('on', b.dataset.scene === state.theme.scene));
      };

      root.querySelector('[data-themes]').innerHTML = THEME_KEYS.map((k) => `
        <button class="theme-swatch ${state.theme.ui === k ? 'on' : ''}" data-theme="${k}" style="background:linear-gradient(135deg, ${THEMES[k].swatch[0]}, ${THEMES[k].swatch[1]})" aria-label="${THEMES[k].name} theme">
          <span>${THEMES[k].name}</span>
        </button>`).join('');
      renderPersonaliser();

      const sceneLocked = (scene, k) => !(scene.unlocked || state.unlockedScenes.includes(k));
      const sceneUnlock = (k) => (typeof sceneUnlockProgress === 'function' ? sceneUnlockProgress(k) : null);
      const coreSceneButton = (k) => {
        const scene = SCENES[k];
        const locked = sceneLocked(scene, k);
        const unlock = locked ? sceneUnlock(k) : null;
        const boost = Math.round((scene.bonus || 0.4) * 100);
        const tint = sceneTint(k);
        const count = (scene.species || []).length;
        return `<button class="biome-scene-swatch ${state.theme.scene === k ? 'on' : ''} ${locked ? 'locked' : ''}" data-scene="${k}" title="${esc(scene.habitat)} habitat · +${boost}% XP · ${count} species" ${locked && !unlock ? 'disabled' : ''} style="--b1:${tint.b1};--b2:${tint.b2};--b3:${tint.b3};background:linear-gradient(135deg, ${tint.b1}, ${tint.b2})">
          <span class="bs-icon">${scene.emoji}</span>
          <span class="bs-copy"><b>${esc(scene.name)}</b><span>${esc(scene.habitat)} · +${boost}% XP · ${count} species${locked ? unlock ? ` · 🔒 ${unlock.have}/${unlock.need}` : ' · locked' : ''}</span></span>
        </button>`;
      };
      root.querySelector('[data-scenes]').innerHTML = SCENE_KEYS
        .filter((k) => !SCENES[k].custom && !SCENES[k].biome)
        .map(coreSceneButton)
        .join('');
      root.querySelector('[data-biome-scenes]').innerHTML = SCENE_KEYS
        .filter((k) => SCENES[k].biome)
        .map((k) => {
          const scene = SCENES[k];
          const tint = sceneTint(k);
          const count = (scene.species || []).length;
          const locked = sceneLocked(scene, k);
          const boost = Math.round((scene.bonus || 0.5) * 100);
          return `<button class="biome-scene-swatch ${state.theme.scene === k ? 'on' : ''} ${locked ? 'locked' : ''}" data-scene="${k}" title="${esc(scene.habitat)} biome · +${boost}% XP · ${count} species" ${locked ? 'disabled' : ''} style="--b1:${tint.b1};--b2:${tint.b2};--b3:${tint.b3};background:linear-gradient(135deg, ${tint.b1}, ${tint.b2})">
            <span class="bs-icon">${scene.emoji}</span>
            <span class="bs-copy"><b>${esc(scene.name)}</b><span>${esc(scene.habitat)} · +${boost}% XP · ${count} species</span></span>
          </button>`;
        }).join('');

      root.querySelector('[data-open-biome-atlas]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openBiomeAtlas(), 160);
      });
      root.querySelectorAll('[data-theme]').forEach((b) => {
        b.addEventListener('click', () => {
          pendingCustom = {};
          Actions.setTheme({ ui: b.dataset.theme });
          applyTheme();
          paint();
          renderPersonaliser();
          Sfx.click();
        });
      });
      const ensureThemeExtras = () => {
        const grid = root.querySelector('[data-themes]');
        if (!grid || root.querySelector('.theme-extra')) return;
        const extras = document.createElement('div');
        extras.className = 'theme-extra';
        extras.innerHTML = `<div class="style-picker" data-glows aria-label="Glow style"></div><div class="style-picker" data-loaders aria-label="Loading pattern"></div><button class="btn btn-soft btn-sm btn-block" type="button" data-theme-surprise style="margin-top:8px">🎲 Surprise me</button>
          <div class="studio-title-fields">
            <label>Title screen text<input class="type-search" type="text" maxlength="24" data-title-text value="${esc(state.theme.title || 'Sprite Hollow')}" aria-label="Title screen text"></label>
            <label>Tagline<input class="type-search" type="text" maxlength="40" data-tagline-text value="${esc(state.theme.tagline || 'A tiny creature sanctuary')}" aria-label="Title screen tagline"></label>
          </div>
          <div class="studio-backdrop">
            <span class="studio-mini-title">Title backdrop</span>
            <div class="style-picker" data-backdrops aria-label="Title screen backdrop"></div>
            <div data-backdrop-panel></div>
            <p class="tiny muted" data-title-image-limit>Max ${maxImageLabel} title image. The cap leaves room for the live save, slots, backups, restore points and quarantine.</p>
          </div>
          <div class="preview-row"><span class="preview-row-label">Title + loading screen</span><div class="preview-actions"><button class="btn btn-ghost btn-sm" type="button" data-title-preview aria-label="Preview the title and loading screens together">🖥 Preview both</button></div></div>
          <p class="tiny muted" style="margin:6px 2px 0;line-height:1.5">Both screens use the Frame studio colours, Personaliser colours and font, chosen backdrop, and loading pattern.</p>`;
        grid.insertAdjacentElement('afterend', extras);
      };
      const paintThemeExtras = () => {
        ensureThemeExtras();
        const glowWrap = root.querySelector('[data-glows]');
        const loaderWrap = root.querySelector('[data-loaders]');
        if (glowWrap) {
          glowWrap.innerHTML = Object.entries(THEME_GLOWS).map(([key, glow]) => `<button class="style-opt ${(state.theme.glow || 'soft') === key ? 'on' : ''}" data-glow="${key}">${glow.name}</button>`).join('');
          glowWrap.querySelectorAll('[data-glow]').forEach((b) => b.addEventListener('click', () => {
            Actions.setTheme({ glow: b.dataset.glow });
            applyTheme();
            paintThemeExtras();
            Sfx.click();
          }));
        }
        if (loaderWrap) {
          loaderWrap.innerHTML = Object.entries(THEME_LOADERS).map(([key, loader]) => `<button class="style-opt load-opt ${(state.theme.loader || 'stars') === key ? 'on' : ''}" data-loader="${key}" title="${loader.name}"><span class="load-mini" aria-hidden="true"><span class="load-mini-sky">${themeLoaderHTML(key, key === 'orbit' || key === 'pulse' ? 6 : 8)}</span></span><span class="load-opt-name">${loader.icon} ${loader.name}</span></button>`).join('');
          loaderWrap.querySelectorAll('[data-loader]').forEach((b) => b.addEventListener('click', () => {
            Actions.setTheme({ loader: b.dataset.loader });
            applyTheme();
            paintThemeExtras();
            if (typeof showHollowLoading === 'function') showHollowLoading({ duration: 1400 });
            Sfx.click();
          }));
        }
        const surprise = root.querySelector('[data-theme-surprise]');
        if (surprise) {
          surprise.onclick = () => {
            surpriseTheme();
            pendingFont = state.theme.font || 'rounded';
            pendingCustom = { ...(state.theme.custom || {}) };
            root.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('on', b.dataset.theme === state.theme.ui));
        root.querySelectorAll('[data-fluff]').forEach((b) => b.classList.toggle('on', (state.theme.fluff || 'soft') === b.dataset.fluff));
        root.querySelectorAll('[data-fx-level]').forEach((b) => b.classList.toggle('on', (state.theme.elementFx || 'soft') === b.dataset.fxLevel));
            renderPersonaliser();
            paintThemeExtras();
            paint();
            Sfx.win();
          };
        }
        root.querySelectorAll('[data-title-text], [data-tagline-text]').forEach((input) => {
          input.onchange = () => {
            const key = input.hasAttribute('data-title-text') ? 'title' : 'tagline';
            const fallback = key === 'title' ? 'Sprite Hollow' : 'A tiny creature sanctuary';
            const value = String(input.value || '').trim() || fallback;
            input.value = value;
            Actions.setTheme({ [key]: value });
            applyTheme();
            Sfx.click();
          };
        });
        const backdropWrap = root.querySelector('[data-backdrops]');
        const backdropPanel = root.querySelector('[data-backdrop-panel]');
        const backdropMode = state.theme.titleBackdrop || 'theme';
        const saveTheme = (patch) => {
          try {
            const result = Actions.setTheme(patch);
            if (result && result.ok === false && result.reason === 'title-image-too-large') {
              if (typeof toast === 'function') toast(`That image is over the ${maxImageLabel} saved-image limit. Choose a smaller one.`, '🖼️');
              return false;
            }
            return result;
          } catch (e) {
            if (typeof toast === 'function') toast('That backdrop is too large to save on this device.', '🖼️');
            return false;
          }
        };
        if (backdropWrap) {
          backdropWrap.innerHTML = [['theme', 'Theme'], ['gradient', 'Gradient'], ['image', 'Image']]
            .map(([key, name]) => `<button class="style-opt ${backdropMode === key ? 'on' : ''}" data-backdrop="${key}" type="button">${name}</button>`).join('');
          backdropWrap.querySelectorAll('[data-backdrop]').forEach((b) => {
            b.addEventListener('click', () => {
              saveTheme({ titleBackdrop: b.dataset.backdrop });
              paintThemeExtras();
              Sfx.click();
            });
          });
        }
        if (backdropPanel && backdropMode === 'gradient') {
          backdropPanel.innerHTML = `<div class="backdrop-row">
            <label>From<input type="color" data-tc1 value="${state.theme.titleColor1 || '#1b1740'}" aria-label="Gradient start colour"></label>
            <label>To<input type="color" data-tc2 value="${state.theme.titleColor2 || '#0b0a16'}" aria-label="Gradient end colour"></label>
            <label>Angle<input type="number" min="0" max="360" step="5" data-tangle value="${Number(state.theme.titleAngle) || 145}" aria-label="Gradient angle"></label>
          </div>`;
          const applyGradient = () => {
            saveTheme({
              titleColor1: backdropPanel.querySelector('[data-tc1]').value,
              titleColor2: backdropPanel.querySelector('[data-tc2]').value,
              titleAngle: clamp(Number(backdropPanel.querySelector('[data-tangle]').value) || 145, 0, 360),
            });
            Sfx.click();
          };
          backdropPanel.querySelectorAll('input').forEach((input) => { input.onchange = applyGradient; });
        } else if (backdropPanel && backdropMode === 'image') {
          backdropPanel.innerHTML = `<div class="backdrop-row">
            <label class="btn btn-ghost btn-sm" style="min-height:38px">Choose image<input type="file" accept="image/*" data-timage hidden></label>
            <button class="btn btn-ghost btn-sm" type="button" data-timage-clear>Clear image</button>
          </div>
          <label class="backdrop-dim">Darken <input type="range" min="0" max="90" step="5" value="${Number(state.theme.titleDim) || 45}" data-tdim aria-label="Darken the title image"></label>
          ${state.theme.titleImage ? `<div class="backdrop-thumb" style="background-image:url(${JSON.stringify(state.theme.titleImage)})"></div>` : ''}`;
          const file = backdropPanel.querySelector('[data-timage]');
          if (file) file.onchange = () => {
            const picked = file.files && file.files[0];
            if (!picked) return;
            if (picked.size > maxImageBytes) { toast(`Pick an image under ${maxImageLabel} so every saved copy fits on this device.`, '🖼️'); return; }
            const reader = new FileReader();
            reader.onload = async () => {
              const dataUrl = String(reader.result || '');
              if (imageLimit && dataUrl.length > imageLimit.maxStoredChars) {
                toast(`That image is over the ${maxImageLabel} saved-image limit after encoding.`, '🖼️');
                return;
              }
              /* Land the image before committing, so the first save already
                 names it by content instead of embedding another copy. */
              if (typeof TitleImageStore !== 'undefined' && typeof TitleImageStore.put === 'function') {
                try { await TitleImageStore.put(dataUrl); } catch (err) { /* inline fallback */ }
              }
              if (saveTheme({ titleImage: dataUrl, titleBackdrop: 'image' }) === false) return;
              paintThemeExtras();
              Sfx.click();
            };
            reader.readAsDataURL(picked);
          };
          const clearImage = backdropPanel.querySelector('[data-timage-clear]');
          if (clearImage) clearImage.onclick = () => { saveTheme({ titleImage: '' }); paintThemeExtras(); Sfx.click(); };
          const dim = backdropPanel.querySelector('[data-tdim]');
          if (dim) dim.onchange = () => saveTheme({ titleDim: clamp(Number(dim.value) || 0, 0, 90) });
        } else if (backdropPanel) {
          backdropPanel.innerHTML = '<p class="tiny muted">The title screen follows your UI theme colours.</p>';
        }
        const titlePreview = root.querySelector('[data-title-preview]');
        if (titlePreview) {
          titlePreview.onclick = () => {
            if (typeof showBootLoading !== 'function') return;
            Sfx.click();
            /* This button is inside the studio sheet, so close it for real —
               hiding overlays left an invisible copy of the studio behind. */
            close();
            /* One run through the opening: the title splash hands over to the
               Hollow loading screen, exactly as the app opens. */
            showBootLoading(() => {
              try {
                if (typeof renderShell === 'function') renderShell();
                /* This button owns the loading screen, so stand on the tab first:
                   App.go replays it on a tab change and would stack a second card
                   under the held one. */
                App.tab = 'hollow';
                App.go('hollow');
              } catch (e) {
                if (typeof renderShell === 'function') renderShell();
              }
              setTimeout(() => {
                if (typeof showHollowLoading !== 'function') return;
                const card = showHollowLoading({ hold: true });
                if (!card && typeof toast === 'function') toast('The loading screen needs an active sprite.', '💫');
              }, 420);
            }, { hold: true });
          };
        }
      };
      paintThemeExtras();
      root.querySelectorAll('[data-scene]').forEach((b) => {
        b.addEventListener('click', () => {
          if (b.disabled) {
            toast('That environment is a gift from your sprites. Keep an eye on their gift bubbles.', '🎁');
            return;
          }
          const unlockKey = b.dataset.scene;
          if (SCENES[unlockKey] && sceneLocked(SCENES[unlockKey], unlockKey)) {
            const attempt = typeof tryUnlockScene === 'function' ? tryUnlockScene(unlockKey) : { ok: false };
            if (!attempt.ok) {
              const need = attempt.progress;
              toast(need ? `${need.name} opens when you own ${need.need} ${need.hint} (${need.have}/${need.need}).` : 'That environment is a gift from your sprites.', '🔒');
              return;
            }
            toast(`${SCENES[unlockKey].emoji} ${SCENES[unlockKey].name} is open!`, '🎉');
            paint();
          }
          const trip = Actions.setTheme({ scene: b.dataset.scene });
          const scene = SCENES[b.dataset.scene];
          if (scene) toast(`${scene.emoji} ${scene.name} · +${Math.round((scene.bonus || 0.4) * 100)}% XP for ${scene.habitat.toLowerCase()} species${trip && trip.coins ? ` · +${trip.coins} coins` : ''}.`, scene.emoji);
          paint();
          Sfx.click();
        });
      });
      /* The maker draws the outfit on the sprite as it is being designed, so a
         style, pattern, stitch size or colour can be judged before adding it. */
      const clothDraft = () => ({
        id: 'studio-cloth-preview',
        name: root.querySelector('#cloth-name')?.value.trim() || 'Preview',
        style: root.querySelector('#cloth-style')?.value || 'cape',
        pattern: root.querySelector('#cloth-pattern')?.value || 'plain',
        stitch: root.querySelector('#cloth-stitch')?.value || 'medium',
        primary: root.querySelector('#cloth-primary')?.value || BRAND.accent,
        secondary: root.querySelector('#cloth-secondary')?.value || BRAND.gold,
      });
      const paintClothPreview = () => {
        const host = root.querySelector('[data-cloth-preview]');
        if (!host) return;
        const target = getTarget();
        if (!target) {
          host.innerHTML = '<span class="tiny muted">Hatch a sprite to preview an outfit.</span>';
          return;
        }
        const draft = clothDraft();
        const wearing = { ...target, id: `${target.id}-cloth-preview`, outfit: draft.id, outfitPreview: draft };
        host.innerHTML = `<span class="cloth-preview-art">${spriteSVG(wearing, { expr: 'happy' })}</span>
          <span class="cloth-preview-copy">
            <b>${esc(draft.name)}</b>
            <span>${CUSTOM_CLOTH_STYLES[draft.style].name} · ${CUSTOM_CLOTH_PATTERNS[draft.pattern]} · ${CUSTOM_CLOTH_SIZES[draft.stitch].name}</span>
            <i class="tiny muted">Preview only — press ${editingClothId ? 'Save changes' : 'Add clothes'} to ${editingClothId ? 'apply it' : 'keep it'}</i>
          </span>`;
      };
      const CLOTH_FIELDS = {
        name: '#cloth-name', style: '#cloth-style', pattern: '#cloth-pattern',
        stitch: '#cloth-stitch', primary: '#cloth-primary', secondary: '#cloth-secondary',
      };
      function applyClothFields(cloth) {
        if (!cloth) return;
        Object.entries(CLOTH_FIELDS).forEach(([key, sel]) => {
          const el = root.querySelector(sel);
          if (el && cloth[key] != null) el.value = cloth[key];
        });
      }
      /* Restyling reuses the same id, so the note stays visible across repaints
         and every sprite already wearing the outfit inherits the change. */
      function syncClothEditor() {
        const editing = editingClothId ? (state.customClothes || []).find((cloth) => cloth.id === editingClothId) : null;
        if (!editing) editingClothId = null;
        const note = root.querySelector('[data-cloth-edit-note]');
        if (note) {
          note.hidden = !editing;
          note.innerHTML = editing
            ? `<span class="cloth-edit-copy">${icon('pencil')} Restyling <b>${esc(editing.name)}</b></span><button class="btn btn-sm btn-ghost" type="button" data-cancel-cloth>Cancel</button>`
            : '';
          const cancel = note.querySelector('[data-cancel-cloth]');
          if (cancel) cancel.onclick = () => resetClothEditor();
        }
        const addBtn = root.querySelector('[data-add-cloth]');
        if (addBtn) addBtn.innerHTML = editing ? `${icon('pencil')} Save changes` : `${icon('plus')} Add clothes`;
        root.querySelector('.cloth-maker')?.classList.toggle('is-editing', !!editing);
      }
      function resetClothEditor() {
        editingClothId = null;
        const nameEl = root.querySelector('#cloth-name');
        if (nameEl) nameEl.value = '';
        syncClothEditor();
        paintClothPreview();
        Sfx.click();
      }
      ['#cloth-name', '#cloth-style', '#cloth-pattern', '#cloth-stitch', '#cloth-primary', '#cloth-secondary'].forEach((sel) => {
        const el = root.querySelector(sel);
        if (!el) return;
        el.addEventListener('input', paintClothPreview);
        el.addEventListener('change', paintClothPreview);
      });
      paintClothPreview();
      syncClothEditor();
      root.querySelector('[data-add-cloth]').addEventListener('click', () => {
        const nameEl = root.querySelector('#cloth-name');
        const name = nameEl.value.trim();
        if (!name) {
          toast('Give the outfit a name first.', '🧵');
          nameEl.focus();
          return;
        }
        const payload = {
          name,
          style: root.querySelector('#cloth-style').value,
          pattern: root.querySelector('#cloth-pattern')?.value || 'plain',
          stitch: root.querySelector('#cloth-stitch')?.value || 'medium',
          primary: root.querySelector('#cloth-primary').value,
          secondary: root.querySelector('#cloth-secondary').value,
        };
        if (editingClothId) {
          const updated = Actions.updateCustomClothes(editingClothId, payload);
          if (!updated.ok) {
            toast(updated.reason === 'name' ? 'Give the outfit a name first.' : 'That outfit is gone — it can be added as a new one.', '🧵');
            return;
          }
          editingClothId = null;
          nameEl.value = '';
          syncClothEditor();
          paintClothPreview();
          paint();
          toast(`${updated.cloth.name} restyled — every sprite wearing it changed too.`, '🧵');
          return;
        }
        const result = Actions.addCustomClothes(payload);
        if (!result.ok) return;
        const target = getTarget();
        if (target) Actions.wearCustomClothes(target.id, result.cloth.id);
        nameEl.value = '';
        paint();
        toast(`${result.cloth.name} added to the unlimited wardrobe.`, '🧵');
      });
      root.querySelector('[data-add-scene]').addEventListener('click', () => {
        const nameEl = root.querySelector('#scene-name');
        const habitatEl = root.querySelector('#scene-habitat');
        const name = nameEl.value.trim();
        if (!name) {
          toast('Give your biome a name first.', '🌍');
          nameEl.focus();
          return;
        }
        const result = Actions.addCustomScene({
          name,
          habitat: habitatEl.value.trim() || 'Custom',
          emoji: root.querySelector('#scene-emoji').value || '🌍',
          sky: root.querySelector('#scene-sky').value,
          ground: root.querySelector('#scene-ground').value,
          accent: root.querySelector('#scene-accent').value,
          bonus: Number(root.querySelector('#scene-bonus').value),
          travel: true,
        });
        if (!result.ok) return;
        nameEl.value = '';
        habitatEl.value = '';
        paint();
        toast(`${result.scene.emoji} ${result.scene.name} created. Every sprite can live here.`, '🌍');
      });
      root.querySelector('[data-climates]').innerHTML = CLIMATE_KEYS.map((k) => `
        <button class="style-opt ${state.world?.climate === k ? 'on' : ''}" data-climate="${k}">
          <span class="sw acc">${CLIMATES[k].icon}</span>${CLIMATES[k].name}
        </button>`).join('');
      root.querySelectorAll('[data-climate]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setClimate(b.dataset.climate);
          paint();
          Sfx.click();
          toast(`${CLIMATES[b.dataset.climate].name} climate. Free to switch. Weather will follow.`, CLIMATES[b.dataset.climate].icon);
        });
      });
      root.querySelector('[data-voice-picker]').innerHTML = [
        { key: 'off', icon: '🔇', label: 'Off' },
        { key: 'female', icon: '👩', label: 'Female' },
        { key: 'male', icon: '👨', label: 'Male' },
      ].map((o) => `<button class="style-opt" data-voice="${o.key}">
        <span class="sw acc">${o.icon}</span>${o.label}
      </button>`).join('');
      root.querySelector('[data-language-picker]').innerHTML = I18N_LANGUAGE_ORDER.map((code) => `
        <button class="style-opt" data-language="${code}">
          <span class="sw acc">🌐</span>${I18N_LANGUAGES[code].native}
        </button>`).join('');
      root.querySelectorAll('[data-language]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setTheme({ language: b.dataset.language });
          applyLanguage();
          paint();
          Sfx.click();
          toast(`${I18N_LANGUAGES[uiLang()].native} · ${t('settings.languageNote')}`, '🌐');
        });
      });
      root.querySelectorAll('[data-voice]').forEach((b) => {
        b.addEventListener('click', () => {
          const key = b.dataset.voice;
          if (key === 'off') {
            Actions.setTheme({ voice: false });
            Voice.stop();
            toast('Voice off. The Hollow is quiet.', '🔇');
          } else {
            Actions.setTheme({ voice: true, voiceType: key });
            Voice.stop();
            Voice.init();
            const line = key === 'male'
              ? 'Voice set to male. I will keep you company in the Hollow.'
              : 'Voice set to female. I will keep you company in the Hollow.';
            Voice.speak(line, { force: true, type: key });
            toast(`${key === 'male' ? 'Male' : 'Female'} voice on.`, key === 'male' ? '👨' : '👩');
          }
          paint();
          Sfx.click();
        });
      });
      root.querySelectorAll('[data-fluff]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setTheme({ fluff: b.dataset.fluff });
          applyTheme();
          paint();
          Sfx.click();
          toast(`Fur rim ${b.dataset.fluff === 'off' ? 'off' : b.dataset.fluff}.`, '🧸');
        });
      });
      root.querySelectorAll('[data-fx-level]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setTheme({ elementFx: b.dataset.fxLevel });
          applyTheme();
          paint();
          Sfx.click();
          toast(b.dataset.fxLevel === 'off' ? 'Element effects off.' : `Element effects ${b.dataset.fxLevel}.`, '✨');
        });
      });
      root.querySelectorAll('[data-motion]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setTheme({ motion: b.dataset.motion });
          applyTheme();
          paint();
          Sfx.click();
          toast(b.dataset.motion === 'calm' ? 'Calm: idle motion stopped.' : 'Full motion.', '🌙');
        });
      });
      root.querySelectorAll('[data-toggle]').forEach((b) => {
        b.addEventListener('click', () => {
          const key = b.dataset.toggle;
          const next = key === 'summonCovers' ? state.theme[key] !== true : !(state.theme[key] !== false);
          Actions.setTheme({ [key]: next });
          applyTheme();
          paint();
          if (key === 'captions' && typeof Captions !== 'undefined') {
            Captions.refresh();
            if (next) Captions.say('Captions are on. Sound effects and spoken lines will appear here.', { kind: 'speech', sticky: true });
          }
          if (key === 'sound' && next) { Sfx.init(); Sfx.coin(); }
          if (key === 'reminders' && typeof Notifier !== 'undefined') {
            if (next) Notifier.ask();
            else Notifier.clear();
          }
        });
      });
      const reminderChoices = [
        { minutes: 30, label: '30 minutes' },
        { minutes: 60, label: '1 hour' },
        { minutes: 120, label: '2 hours' },
        { minutes: 240, label: '4 hours' },
        { minutes: 480, label: '8 hours' },
      ];
      const reminderDelay = () => (typeof Notifier !== 'undefined' ? Notifier.delay() : 120);
      const reminderLabel = (minutes) => (reminderChoices.find((c) => c.minutes === minutes) || reminderChoices[2]).label;
      const paintReminderDelay = () => {
        const current = reminderDelay();
        root.querySelectorAll('[data-reminder-minutes]').forEach((b) => {
          b.classList.toggle('on', Number(b.dataset.reminderMinutes) === current);
        });
        const note = root.querySelector('[data-reminder-note]');
        if (note) {
          note.textContent = `One notification ${reminderLabel(current)} after you leave, covering the open check-in and any sprite that needs care.`;
        }
      };
      root.querySelector('[data-reminder-delay]').innerHTML = reminderChoices.map((c) => `
        <button class="style-opt" data-reminder-minutes="${c.minutes}">
          <span class="sw acc">⏰</span>${c.label}
        </button>`).join('');
      const remindText = (value) => String(value == null ? '' : value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
      const remindWhen = (ms) => new Date(ms).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
      const paintReminderPreview = () => {
        const box = root.querySelector('[data-reminder-preview]');
        if (!box) return;
        const s = typeof Notifier !== 'undefined' ? Notifier.summary() : null;
        const plan = typeof Notifier !== 'undefined' && Notifier.checkinPlan ? Notifier.checkinPlan() : [];
        box.innerHTML = '<span class="rp-label">Next notification</span>'
          + (s ? `<b>${remindText(s.title)}</b><p>${remindText(s.body)}</p>` : '<b>Nothing pending</b><p>No check-in or care reminder is due right now.</p>')
          + (plan.length ? `<div class="reminder-plan">Check-in alarms · ${plan.map((p) => remindText(remindWhen(p.at))).join(' · ')}</div>` : '');
      };
      root.querySelectorAll('[data-reminder-minutes]').forEach((b) => {
        b.addEventListener('click', () => {
          Actions.setTheme({ reminderMinutes: Number(b.dataset.reminderMinutes) });
          paintReminderDelay();
          paintReminderPreview();
          Sfx.click();
          toast(`Reminders arrive ${reminderLabel(Number(b.dataset.reminderMinutes))} after you leave.`, '⏰');
        });
      });
      paintReminderDelay();
      paintReminderPreview();
      root.querySelector('[data-reminder-test]')?.addEventListener('click', () => {
        if (typeof Notifier === 'undefined' || !Notifier.testIn(1)) {
          toast('System notifications only work in the installed app.', '🔔');
          return;
        }
        Sfx.click();
        toast('Test notification in 1 minute. Leave the app or lock the phone to see it.', '⏱️');
      });
      root.querySelector('[data-reminder-preview-btn]').addEventListener('click', () => {
        const s = typeof Notifier !== 'undefined' ? Notifier.summary() : null;
        const plan = typeof Notifier !== 'undefined' && Notifier.checkinPlan ? Notifier.checkinPlan() : [];
        openModal({
          title: '🔔 Notification preview',
          body: '<div class="reminder-preview" style="text-align:left"><span class="rp-label">System notification</span>'
            + (s ? `<b>${remindText(s.title)}</b><p>${remindText(s.body)}</p>` : '<b>Nothing pending</b><p>No reminder would be sent right now.</p>')
            + '</div>'
            + `<p class="tiny muted" style="text-align:left;margin-top:8px">Arrives ${remindText(reminderLabel(reminderDelay()))} after you leave the app.</p>`
            + (plan.length ? `<p class="tiny muted" style="text-align:left">Check-in alarms · ${plan.map((p) => remindText(remindWhen(p.at))).join(' · ')}</p>` : '')
            + '<div class="actions"><button class="btn btn-soft" data-close>Close</button></div>',
        });
      });
      root.querySelectorAll('[data-vol]').forEach((el) => {
        el.addEventListener('input', () => {
          Actions.setTheme({ [el.dataset.vol]: Number(el.value) });
          const out = root.querySelector(`[data-vol-val="${el.dataset.vol}"]`);
          if (out) out.textContent = `${el.value}%`;
          if (el.dataset.vol === 'weatherVolume' && typeof WeatherSound !== 'undefined') WeatherSound.refresh();
        });
      });
      root.querySelector('[data-randomize]').addEventListener('click', () => {
        const t = getTarget();
        if (!t) return;
        const palettes = PALETTE_KEYS.filter((k) => k !== 'native');
        Actions.customize(t.id, {
          palette: chance(0.35) ? 'native' : pick(palettes),
          pattern: pick(PATTERN_KEYS),
          accessory: pick(FREE_ACCESSORY_KEYS),
          breed: pick(BREED_KEYS),
          fur: pick(FUR_STYLE_KEYS),
          hue: pick([0, 0, 0, 30, 60, 90, 150, 210, 270, 330]),
        });
        paint();
        burstOn(root.querySelector('[data-randomize]'), ['🎨', '✨', '💛'], 6);
        Sfx.pop();
        toast('Fresh look, who dis?', '🎨');
      });
      root.querySelector('[data-save-name]').addEventListener('click', () => {
        Actions.setHollowName(root.querySelector('#hollow-name').value);
        toast('Hollow renamed.', '🏡');
      });
      root.querySelector('[data-tour-replay]').addEventListener('click', () => {
        close();
        setTimeout(() => startTour({ fromStudio: true }), 180);
      });
      root.querySelector('[data-tour-handbook]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openTourHandbook(), 180);
      });
      root.querySelector('[data-tour-restart]')?.addEventListener('click', () => {
        close();
        setTimeout(() => startTour({ fromStudio: true, restart: true }), 180);
      });
      root.querySelector('[data-save-backup]').addEventListener('click', () => {
        close();
        setTimeout(() => openSaveBackup(), 180);
      });
      root.querySelector('[data-studio-health]').addEventListener('click', () => {
        close();
        if (typeof openHollowHealth === 'function') setTimeout(() => openHollowHealth(), 180);
      });
      root.querySelector('[data-diagnostics]').addEventListener('click', () => {
        close();
        if (typeof openDiagnosticsSheet === 'function') setTimeout(() => openDiagnosticsSheet(), 180);
      });
      root.querySelector('[data-reset]').addEventListener('click', async () => {
        const banked = Math.max(0, Math.floor(Number(state.coins) || 0));
        const yes = await confirmModal('Start over?', `Every sprite, egg, unlock, streak and journal entry will be erased, and you will pick a new starter egg. Your ${banked.toLocaleString()} coins stay in your pocket. This cannot be undone.`, `Restart with ${banked.toLocaleString()} coins`, { danger: true });
        if (yes) Actions.reset();
      });

      unsub = subscribeState((d) => {
        if (d.type === 'theme') return;
        if (skipNextCustomizePaint && d.type === 'customize') { skipNextCustomizePaint = false; return; }
        paint();
      });
      paint();
    },
    onClose: () => { if (unsub) unsub(); },
  });
  return { overlay, close };
}
