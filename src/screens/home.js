/* Home view and decor mode: the wireframed room screen built on the shared
   house data, the global decor layout and the existing room tints. */

let homeDecorMode = false;
let homePickedPiece = null;

function homeViewRoom() {
  const active = typeof activeSprite === 'function' ? activeSprite() : null;
  const houses = typeof housesList === 'function' ? housesList() : [];
  const house = (active && houses.find((h) => h.members.some((m) => m.id === active.id))) || houses[0] || null;
  if (house) {
    const members = house.members;
    const key = houseScene(house);
    return {
      house,
      members,
      houseId: house.id,
      name: house.name || members.map((m) => displayName(m)).join(' & '),
      sceneKey: key,
      bond: Number(house.bond) || 0,
      tint: sceneTint(key),
    };
  }
  const solo = (active && active.stage !== 'egg' && !active.retired)
    ? active
    : (typeof sentHomeSprites === 'function' ? sentHomeSprites()[0] : null);
  if (!solo) return null;
  const key = homeSceneFor(solo);
  return {
    house: null,
    members: [solo],
    houseId: null,
    name: displayName(solo),
    sceneKey: key,
    bond: Number(solo.bond) || 0,
    tint: sceneTint(key),
  };
}

function homeViewComfort(room) {
  const joy = room.members.reduce((sum, m) => sum + Math.round(Number(m.needs && m.needs.joy) || 0), 0);
  const pieces = typeof homeUpgradeOwnedList === 'function' ? homeUpgradeOwnedList().length : 0;
  return Math.round(room.bond + joy + pieces * 60);
}

function homeViewLevel(room) {
  const best = room.members.reduce((max, m) => Math.max(max, Number(m.level) || 1), 1);
  return Math.max(1, Math.round(room.bond / 100) + best);
}

function homeViewStage(room, decor) {
  const tint = room.tint;
  const theme = typeof homeRoomThemeStyle === 'function' ? homeRoomThemeStyle() : '';
  const tintVars = room.houseId ? houseTintVars(room.houseId) : '';
  return `<div class="hv-stage ${decor ? 'is-decor' : ''}" style="background:linear-gradient(180deg, ${tint.b2}, ${tint.b1});${theme};${tintVars}">
    <span class="room-wash" aria-hidden="true"></span>
    ${room.houseId && typeof houseTint === 'function' && houseTint(room.houseId) ? '<span class="house-tint-wash" aria-hidden="true"></span>' : ''}
    <div class="scene-decor">${typeof buildSceneDecor === 'function' ? buildSceneDecor(room.sceneKey) : ''}</div>
    ${homeDecorLayer(decor)}
    ${room.members.map((m, i) => `<span class="hv-sprite" style="left:${18 + i * 28}%">${spriteSVG(m, { expr: m.asleep ? 'sleep' : expressionFor(m) })}</span>`).join('')}
  </div>`;
}

function homeViewToolbar(room) {
  if (!homePickedPiece) {
    return `<p class="tiny muted hv-hint">Tap a piece of furniture in the room to move it, tuck it away, or pick a new spot. Everything here is shared with your other rooms.</p>`;
  }
  const id = homePickedPiece;
  const spot = homeDecorSpot(id);
  const hidden = homeDecorHidden(id);
  const tint = room.houseId ? houseTint(room.houseId).toLowerCase() : '';
  const strength = room.houseId ? houseTintStrength(room.houseId) : 72;
  return `<div class="hv-tool" role="group" aria-label="${esc(decorPieceName(id))} options">
    <div class="hv-tool-head"><b>${esc(decorPieceName(id))}</b><span class="tiny muted">${['Left wall', 'Centre', 'Right wall'][spot]}${hidden ? ' · tucked away' : ''}</span><button class="icon-btn" type="button" data-hv-close-tool aria-label="Close furniture options">✕</button></div>
    <div class="hv-tool-row">
      ${['Left', 'Centre', 'Right'].map((label, index) => `<button class="btn btn-sm ${index === spot ? 'btn-gold' : 'btn-ghost'}" type="button" data-hv-spot="${index}" aria-pressed="${index === spot}">${label}</button>`).join('')}
      <button class="btn btn-soft btn-sm" type="button" data-hv-hide>${hidden ? 'Show' : 'Hide'}</button>
    </div>
    ${room.houseId ? `<div class="hv-tool-row hv-tint-row">
      <span class="tiny muted">Room tint</span>
      <input type="color" data-hv-tint-input value="${tint || BRAND.gold}" aria-label="Pick a room tint">
      ${tint ? '<button class="btn btn-ghost btn-sm" type="button" data-hv-tint-clear>Clear</button>' : ''}
      <div class="hv-tint-dots">${[BRAND.gold, '#8fe0c0', '#b69cff', '#ff9ec7', '#5ad6ff', '#8fe07a', '#ff9a3c', '#e8e6f0'].map((color) => `<button class="sh-tint-dot ${tint === color ? 'on' : ''}" type="button" style="background:${color}" data-hv-tint="${color}" aria-label="Tint this room ${color}" aria-pressed="${tint === color}"></button>`).join('')}</div>
      <label class="hv-stage-slider"><span class="tiny muted">Stage</span><input type="range" min="0" max="100" step="5" value="${strength}" data-hv-tint-strength ${tint ? '' : 'disabled'} aria-label="How strong the tint reads"><b data-hv-strength-out>${strength}%</b></label>
    </div>` : '<p class="tiny muted">Shared houses have a room tint. Send a friend home and share a house to unlock it.</p>'}
  </div>`;
}

function homeDock() {
  const items = [
    ['build', '🏗️', 'Build'], ['decor', '🎨', 'Decor'], ['pets', '🐾', 'Pets'],
    ['storage', '📦', 'Storage'], ['effects', '✨', 'Effects'], ['more', '⚙️', 'More'],
  ];
  return `<div class="hv-dock">${items.map(([id, icon, label]) => `<button class="hv-dock-btn" type="button" data-hv="${id}"><span aria-hidden="true">${icon}</span><b>${label}</b></button>`).join('')}</div>`;
}

function homePresetBar() {
  const presets = Array.isArray(state.roomPresets) ? state.roomPresets : [];
  return `<div class="hv-presets">
    <div class="between"><span class="tiny muted">🗂️ Layout presets</span><button class="btn btn-soft btn-sm" type="button" data-hv-preset-save>💾 Save layout</button></div>
    ${presets.length
      ? `<div class="hv-preset-row" role="group" aria-label="Saved room layouts">${presets.map((preset) => `<span class="hv-preset-chip"><button class="hv-preset-apply" type="button" data-hv-preset-apply="${preset.id}">${esc(preset.name)}</button><button class="hv-preset-edit" type="button" data-hv-preset-edit="${preset.id}" aria-label="Rename or overwrite ${esc(preset.name)}">✎</button><button class="hv-preset-del" type="button" data-hv-preset-del="${preset.id}" aria-label="Delete ${esc(preset.name)}">✕</button></span>`).join('')}</div>`
      : '<p class="tiny muted">Save where everything sits now, then swap the whole room back in one tap.</p>'}
  </div>`;
}

function homeViewBody() {
  const room = homeViewRoom();
  if (!room) {
    return `<div class="card empty-state"><div style="font-size:36px">🏡</div><h3 style="font-size:15px;margin:8px 0 4px">No home yet</h3><p class="small muted">Hatch a sprite and send them home to open their room.</p></div>
      ${typeof hollowCompassStripHtml === 'function' ? hollowCompassStripHtml() : ''}`;
  }
  const comfort = homeViewComfort(room);
  const level = homeViewLevel(room);
  const scene = SCENES[room.sceneKey] || SCENES.grove;
  const bondTier = typeof houseBondTier === 'function' ? houseBondTier(room.bond) : { icon: '💞', name: 'Bond' };
  return `<section class="hv-head">
      <div class="between"><span class="eyebrow">${scene.emoji} ${esc(scene.name)}</span><span class="chip">${bondTier.icon} ${bondTier.name}</span></div>
      <h2 class="hv-title">${esc(room.name)}</h2>
      <div class="hv-stats"><span>⭐ Home level ${level}</span><span>💖 Comfort ${comfort.toLocaleString()}</span><span>🐾 ${room.members.length} resident${room.members.length === 1 ? '' : 's'}</span></div>
    </section>
    ${typeof hollowCompassStripHtml === 'function' ? hollowCompassStripHtml() : ''}
    ${homeViewStage(room, homeDecorMode)}
    ${homeDecorMode
      ? `<div class="hv-decor-panel">
          <div class="between"><b>🎨 Decor mode</b><button class="btn btn-soft btn-sm" type="button" data-hv-furniture>📦 Full furniture list</button></div>
          ${homeViewToolbar(room)}
          ${homePresetBar()}
          <button class="btn btn-primary btn-block" type="button" data-hv-done>Done decorating</button>
        </div>`
      : homeDock()}
    <p class="tiny muted hv-foot">The room, furniture and tint are the same ones your sprites use in Homes, shared houses, hangouts and visits.</p>`;
}

function homeScreen(root) {
  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Your place</div><h1>Home</h1><p>Walk into the room, then decorate it in place.</p></div>
      <div class="row" style="gap:6px">
        <button class="icon-btn" data-hv-hotel aria-label="Visit the Puffle Hotel" title="Puffle Hotel">🏨</button>
        <button class="icon-btn" data-hv-homes aria-label="Open Homes">🏠</button>
      </div>
    </div>
    <div data-hv-body>${homeViewBody()}</div>`;
  const body = root.querySelector('[data-hv-body]');
  const repaint = () => { body.innerHTML = homeViewBody(); };
  const stopCompass = typeof wireHollowCompass === 'function' ? wireHollowCompass(root) : () => {};

  const sheetRoot = (overlay) => overlay.querySelector('.sheet') || overlay;

  const openBuild = () => {
    openSheet({
      title: '🏗️ Build & upgrades',
      sub: 'Permanent furniture and perks for every room you own.',
      body: `<div class="sh-upgrades">${typeof homeUpgradeCards === 'function' ? homeUpgradeCards() : ''}</div>`,
      onMount: (overlay) => {
        sheetRoot(overlay).addEventListener('click', (event) => {
          const buy = event.target.closest('[data-sh-buy]');
          if (!buy) return;
          const res = Actions.buyHomeUpgrade(buy.dataset.shBuy);
          if (!res.ok) {
            toast(res.reason === 'coins' ? `You need ${(res.need || 0).toLocaleString()} more coins.` : 'That upgrade is not available yet.', '🛠️');
            Sfx.error();
          } else {
            Sfx.level();
            toast(`${res.upgrade.name} installed.`, '🛠️');
          }
          repaint();
          const list = overlay.querySelector('.sh-upgrades');
          if (list && typeof homeUpgradeCards === 'function') list.innerHTML = homeUpgradeCards();
        });
      },
    });
  };

  const openPets = () => {
    const room = homeViewRoom();
    if (!room) return;
    openSheet({
      title: '🐾 Residents',
      sub: 'Care for everyone who lives here without leaving the room.',
      body: `<div class="hv-pets">${room.members.map((m) => `<div class="hv-pet-row">
        <span class="hv-pet-art">${spriteSVG(m, { expr: expressionFor(m) })}</span>
        <span class="hv-pet-copy"><b>${esc(displayName(m))}</b><span class="tiny muted">Lv ${m.level} · 💗 ${Math.round(Number(m.bond) || 0)} · Joy ${Math.round(Number(m.needs && m.needs.joy) || 0)}</span></span>
        <span class="hv-pet-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-hv-care="rub" data-hv-id="${m.id}" title="Belly rub">🤲</button>
          <button class="btn btn-ghost btn-sm" type="button" data-hv-care="feed" data-hv-id="${m.id}" title="Feed">🍎</button>
          <button class="btn btn-ghost btn-sm" type="button" data-hv-care="bath" data-hv-id="${m.id}" title="Bath">🛁</button>
          <button class="btn btn-soft btn-sm" type="button" data-hv-visit="${m.id}">💞 Visit</button>
        </span>
      </div>`).join('')}</div>`,
      onMount: (overlay) => {
        sheetRoot(overlay).addEventListener('click', (event) => {
          const care = event.target.closest('[data-hv-care]');
          const visit = event.target.closest('[data-hv-visit]');
          if (care && typeof sentHomeCare === 'function') {
            sentHomeCare(care.dataset.hvId, care.dataset.hvCare, repaint);
            return;
          }
          if (visit && typeof openOneOnOne === 'function') {
            openOneOnOne(visit.dataset.hvVisit, repaint);
          }
        });
      },
    });
  };

  const openPresetEditor = (id) => {
    const preset = (Array.isArray(state.roomPresets) ? state.roomPresets : []).find((entry) => entry && entry.id === id);
    if (!preset) { toast('That layout is gone.', '🗂️'); Sfx.error(); return; }
    openSheet({
      title: `✎ ${preset.name}`,
      sub: 'Rename this layout, or overwrite it with the room as it is now.',
      body: `<label class="hv-preset-name"><span class="tiny muted">Layout name</span><input type="text" maxlength="24" data-hv-preset-name value="${esc(preset.name)}" aria-label="Layout name"></label>
        <div class="hv-preset-actions"><button class="btn btn-primary btn-block" type="button" data-hv-preset-rename-save="${preset.id}">Save name</button>
        <button class="btn btn-soft btn-block" type="button" data-hv-preset-overwrite="${preset.id}">💾 Overwrite with this room</button></div>`,
      onMount: (overlay) => {
        const sheet = sheetRoot(overlay);
        sheet.addEventListener('click', (event) => {
          const saveName = event.target.closest('[data-hv-preset-rename-save]');
          const overwrite = event.target.closest('[data-hv-preset-overwrite]');
          if (saveName) {
            const input = sheet.querySelector('[data-hv-preset-name]');
            const res = Actions.renameRoomPreset(saveName.dataset.hvPresetRenameSave, input ? input.value : '');
            if (!res.ok) { toast('Give the layout a name first.', '🗂️'); Sfx.error(); return; }
            Sfx.level();
            toast(`Renamed to ${res.preset.name}.`, '🗂️');
            if (typeof closeAllOverlays === 'function') closeAllOverlays();
            repaint();
            return;
          }
          if (overwrite) {
            const target = overwrite.dataset.hvPresetOverwrite;
            const res = Actions.saveRoomPreset(preset.name, { overwriteId: target });
            if (!res.ok) {
              toast(res.reason === 'empty' ? 'Arrange a piece first, then overwrite the layout.' : res.reason === 'full' ? 'That is eight layouts — overwrite one, or delete one first.' : 'That layout is gone.', '🗂️');
              Sfx.error();
              return;
            }
            Sfx.level();
            toast(`${res.preset.name} overwritten with this room.`, '🗂️');
            if (typeof closeAllOverlays === 'function') closeAllOverlays();
            repaint();
          }
        });
      },
    });
  };

  const openEffects = () => {
    const themes = typeof HOME_ROOM_THEMES !== 'undefined' ? Object.entries(HOME_ROOM_THEMES) : [];
    openSheet({
      title: '✨ Room effects',
      sub: 'Room colours apply to every home you own, free of charge.',
      body: `<div class="theme-swatches hv-themes">${themes.map(([key, theme]) => `<button class="theme-swatch ${state.roomTheme === key ? 'on' : ''}" type="button" data-hv-theme="${key}" title="${esc(theme.name)}">
        <span class="theme-dot" style="background:${theme.glow};box-shadow:inset 0 0 0 6px ${theme.wall}"></span>
        <span class="tiny">${esc(theme.name)}</span>
      </button>`).join('')}</div>`,
      onMount: (overlay) => {
        sheetRoot(overlay).addEventListener('click', (event) => {
          const pick = event.target.closest('[data-hv-theme]');
          if (!pick) return;
          Actions.setRoomTheme(pick.dataset.hvTheme);
          Sfx.click();
          repaint();
          overlay.querySelectorAll('[data-hv-theme]').forEach((b) => b.classList.toggle('on', b.dataset.hvTheme === pick.dataset.hvTheme));
        });
      },
    });
  };

  const onClick = (event) => {
    if (event.target.closest('[data-hv-hotel]')) { Sfx.click(); App.go('hotel'); return; }
    if (event.target.closest('[data-hv-homes]')) { Sfx.click(); if (typeof openHomesSheet === 'function') openHomesSheet(); return; }
    const dock = event.target.closest('[data-hv]');
    if (dock) {
      const id = dock.dataset.hv;
      Sfx.click();
      if (id === 'decor') { homeDecorMode = true; repaint(); return; }
      if (id === 'build') { openBuild(); return; }
      if (id === 'pets') { openPets(); return; }
      if (id === 'storage') { App.go('inventory'); return; }
      if (id === 'effects') { openEffects(); return; }
      if (id === 'more') { App.go('senthome'); return; }
    }
    if (event.target.closest('[data-hv-done]')) { homeDecorMode = false; homePickedPiece = null; Sfx.click(); repaint(); return; }
    if (event.target.closest('[data-hv-furniture]')) { App.go('inventory'); return; }
    if (event.target.closest('[data-hv-preset-save]')) {
      const res = Actions.saveRoomPreset();
      if (!res.ok) {
        toast(res.reason === 'full' ? 'That is eight layouts — tap ✎ on one to overwrite it, or delete one first.' : 'Arrange a piece first, then save the layout.', '🗂️');
        Sfx.error();
      } else {
        Sfx.level();
        toast(`${res.preset.name} saved.`, '🗂️');
      }
      repaint();
      return;
    }
    const presetApply = event.target.closest('[data-hv-preset-apply]');
    if (presetApply) {
      const res = Actions.applyRoomPreset(presetApply.dataset.hvPresetApply);
      if (!res.ok) { toast('That layout is gone.', '🗂️'); Sfx.error(); }
      else { homePickedPiece = null; Sfx.click(); toast(`${res.preset.name} applied.`, '🗂️'); }
      repaint();
      return;
    }
    const presetEdit = event.target.closest('[data-hv-preset-edit]');
    if (presetEdit) { Sfx.click(); openPresetEditor(presetEdit.dataset.hvPresetEdit); return; }
    const presetDel = event.target.closest('[data-hv-preset-del]');
    if (presetDel) {
      const res = Actions.deleteRoomPreset(presetDel.dataset.hvPresetDel);
      if (res.ok) { Sfx.pop(); toast('Layout deleted.', '🗂️'); }
      repaint();
      return;
    }
    if (event.target.closest('[data-hv-close-tool]')) { homePickedPiece = null; Sfx.click(); repaint(); return; }
    const piece = event.target.closest('[data-sh-decor-piece]');
    if (piece) { homePickedPiece = piece.dataset.shDecorPiece; Sfx.click(); repaint(); return; }
    const spot = event.target.closest('[data-hv-spot]');
    if (spot && homePickedPiece) { Actions.setRoomPiece(homePickedPiece, { spot: Number(spot.dataset.hvSpot) }); Sfx.click(); repaint(); return; }
    if (event.target.closest('[data-hv-hide]') && homePickedPiece) { Actions.setRoomPiece(homePickedPiece, { hidden: !homeDecorHidden(homePickedPiece) }); Sfx.pop(); repaint(); return; }
    const tint = event.target.closest('[data-hv-tint]');
    if (tint) {
      const room = homeViewRoom();
      if (room && room.houseId) { Actions.setHouseTint(room.houseId, tint.dataset.hvTint); Sfx.click(); repaint(); }
      return;
    }
    if (event.target.closest('[data-hv-tint-clear]')) {
      const room = homeViewRoom();
      if (room && room.houseId) { Actions.setHouseTint(room.houseId, null); Sfx.pop(); repaint(); }
    }
  };

  const onInput = (event) => {
    const input = event.target.closest('[data-hv-tint-input]');
    if (input) {
      const room = homeViewRoom();
      const inner = root.querySelector('.hv-stage');
      if (room && room.houseId && inner) {
        inner.style.setProperty('--house-tint', input.value);
        /* Preview at the strength this house already saved, so releasing the
           picker does not jump the wash to the CSS default. */
        inner.style.setProperty('--house-tint-strength', (houseTintStrength(room.houseId) / 100).toFixed(2));
        /* The wash only exists once a tint is saved, so create it for the
           live preview instead of waiting for the change event to repaint. */
        if (!inner.querySelector('.house-tint-wash')) {
          const wash = document.createElement('span');
          wash.className = 'house-tint-wash';
          wash.setAttribute('aria-hidden', 'true');
          inner.insertBefore(wash, inner.firstChild);
        }
      }
      return;
    }
    const strength = event.target.closest('[data-hv-tint-strength]');
    if (strength) {
      const out = root.querySelector('[data-hv-strength-out]');
      if (out) out.textContent = `${strength.value}%`;
      const room = homeViewRoom();
      const inner = root.querySelector('.hv-stage');
      if (room && room.houseId && inner) {
        inner.style.setProperty('--house-tint-strength', (Number(strength.value) / 100).toFixed(2));
      }
    }
  };

  const onChange = (event) => {
    const input = event.target.closest('[data-hv-tint-input]');
    const room = homeViewRoom();
    if (input && room && room.houseId) { Actions.setHouseTint(room.houseId, input.value); Sfx.click(); repaint(); return; }
    const strength = event.target.closest('[data-hv-tint-strength]');
    if (strength && room && room.houseId) { Actions.setHouseTintStrength(room.houseId, strength.value); Sfx.click(); repaint(); }
  };

  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('change', onChange);
  return () => {
    stopCompass();
    root.removeEventListener('click', onClick);
    root.removeEventListener('input', onInput);
    root.removeEventListener('change', onChange);
  };
}
