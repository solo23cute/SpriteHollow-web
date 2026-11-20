/* Loader and player for the 16 x 16 Sprite Puffle master sheet.

   The manifest keeps frame indices 0-based for arithmetic and slot numbers
   1-based for the layout brief. Every body clip shares one 1024 px atlas; the
   eleven breeds resolve their colours and FX from the palette file and the
   `fxOverrides` table instead of shipping eleven copies of the art. */

(function () {
  'use strict';

  const MANIFEST_PATH = 'assets/lumi/puffle-master-sheet.json';
  const state = {
    manifest: null,
    loading: null,
    error: null,
  };

  function absolute(path) {
    try {
      return new URL(path, document.baseURI).href;
    } catch (error) {
      return path;
    }
  }

  async function readJSON(path) {
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Puffle sheet: ${response.status} ${path}`);
    return response.json();
  }

  function frameRectFor(index, manifest) {
    const frame = Number(index);
    if (!Number.isInteger(frame) || frame < 0 || frame >= manifest.slots) return null;
    const width = Number(manifest.cell && manifest.cell.width) || 64;
    const height = Number(manifest.cell && manifest.cell.height) || 64;
    const columns = Number(manifest.columns) || 16;
    return {
      index: frame,
      slot: frame + 1,
      column: frame % columns,
      row: Math.floor(frame / columns),
      x: (frame % columns) * width,
      y: Math.floor(frame / columns) * height,
      width,
      height,
    };
  }

  function normalize(data, paletteData) {
    const clips = {};
    Object.keys(data.clips || {}).forEach((key) => {
      const clip = data.clips[key];
      clips[key] = Object.freeze({
        ...clip,
        key,
        rects: (clip.frames || []).map((index) => frameRectFor(index, data)),
      });
    });
    return Object.freeze({
      ...data,
      imageUrl: absolute(data.image),
      imagePath: data.image,
      clips: Object.freeze(clips),
      palettes: Object.freeze((paletteData && paletteData.palettes) || {}),
      paletteMeta: paletteData || null,
    });
  }

  function load() {
    if (state.manifest) return Promise.resolve(state.manifest);
    if (state.loading) return state.loading;
    state.loading = readJSON(MANIFEST_PATH)
      .then(async (data) => {
        const paletteData = data.paletteFile ? await readJSON(data.paletteFile) : null;
        state.manifest = normalize(data, paletteData);
        state.error = null;
        return state.manifest;
      })
      .catch((error) => {
        state.error = error;
        state.loading = null;
        throw error;
      });
    return state.loading;
  }

  function clip(name) {
    return (state.manifest && state.manifest.clips[name]) || null;
  }

  function palette(breed) {
    if (!state.manifest) return null;
    const key = String(breed || 'sp_sprite');
    return state.manifest.palettes[key] || state.manifest.palettes.sp_sprite || null;
  }

  function fx(breed) {
    if (!state.manifest) return null;
    const key = String(breed || 'sp_sprite');
    return state.manifest.fxOverrides[key] || state.manifest.fxOverrides.sp_sprite || null;
  }

  function styleFor(index, options) {
    const opts = options || {};
    const manifest = state.manifest;
    if (!manifest) return null;
    const rect = frameRectFor(index, manifest);
    if (!rect) return null;
    const scale = Math.max(0.05, Number(opts.scale) || 1);
    return {
      rect,
      backgroundImage: `url("${manifest.imageUrl}")`,
      backgroundSize: `${manifest.size.width * scale}px ${manifest.size.height * scale}px`,
      backgroundPosition: `${-rect.x * scale}px ${-rect.y * scale}px`,
      backgroundRepeat: 'no-repeat',
      imageRendering: opts.pixelated ? 'pixelated' : 'auto',
      width: `${rect.width * scale}px`,
      height: `${rect.height * scale}px`,
    };
  }

  function paint(el, index, options) {
    const style = styleFor(index, options);
    if (!el || !style) return null;
    el.style.backgroundImage = style.backgroundImage;
    el.style.backgroundSize = style.backgroundSize;
    el.style.backgroundPosition = style.backgroundPosition;
    el.style.backgroundRepeat = style.backgroundRepeat;
    el.style.imageRendering = style.imageRendering;
    el.dataset.puffleFrame = String(style.rect.index + 1);
    return style.rect;
  }

  /* Play one clip on any element. The caller owns the element's size; this only
     swaps the background cell, so it composes with a tail/eyes/mouth layer. */
  function play(el, name, options) {
    const opts = options || {};
    let stopped = false;
    let timer = 0;
    let cursor = 0;
    const controller = {
      clip: name,
      ready: null,
      done: false,
      stop() {
        stopped = true;
        if (timer) clearTimeout(timer);
        timer = 0;
      },
    };
    const start = (manifest) => {
      const entry = manifest.clips[name];
      if (!entry || !entry.frames.length) {
        controller.done = true;
        return controller;
      }
      const fps = Math.max(1, Number(opts.fps) || Number(entry.fps) || 8);
      const delay = 1000 / fps;
      const loop = opts.loop == null ? !!entry.loop : !!opts.loop;
      const step = () => {
        if (stopped) return;
        const frame = entry.frames[cursor];
        paint(el, frame, opts);
        el.dataset.puffleClip = name;
        if (cursor + 1 >= entry.frames.length) {
          if (!loop) {
            controller.done = true;
            return;
          }
          cursor = 0;
        } else {
          cursor += 1;
        }
        timer = setTimeout(step, delay);
      };
      step();
      return controller;
    };
    controller.ready = load().then(start).catch((error) => {
      controller.done = true;
      if (typeof console !== 'undefined' && console.warn) console.warn('Puffle master sheet:', error);
      return controller;
    });
    return controller;
  }

  const api = {
    path: MANIFEST_PATH,
    get manifest() { return state.manifest; },
    get error() { return state.error; },
    load,
    clip,
    palette,
    fx,
    frameRect(index) {
      return state.manifest ? frameRectFor(index, state.manifest) : null;
    },
    slotRect(slot) {
      return state.manifest ? frameRectFor(Number(slot) - 1, state.manifest) : null;
    },
    styleFor,
    paint,
    play,
  };

  window.PuffleMasterSheet = api;
  window.puffleMasterSheet = api;
})();
