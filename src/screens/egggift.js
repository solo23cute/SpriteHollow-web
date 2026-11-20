/* Egg gift picker: search every sprite and choose the egg you want as a gift. */

function eggGiftTypeLabel(key) {
  const el = ELEMENTS[key] || {};
  if (el.biomeType) return `${PDX_TYPES[el.biomeType]?.name || el.biomeType} type · biome guardian`;
  if (typeof POKEDEX_META !== 'undefined' && POKEDEX_META[key]) return `${POKEDEX_META[key].types.map((t) => PDX_TYPES[t]?.name || t).join(' / ')} type`;
  if (el.secret) return 'Secret Vault keeper';
  if (el.exotic) return 'Exotic signature';
  if (el.meme) return 'Meme legend';
  return el.trait ? el.trait.split('—')[0].trim() : 'Hollow species';
}

function openEggGiftPicker(onPick) {
  const pool = dailyEggPool();
  const matchLabel = (n) => `${n.toLocaleString()} match${n === 1 ? '' : 'es'}`;
  const poolSearch = new Map(pool.map((key) => {
    const el = ELEMENTS[key] || {};
    const text = [el.name, el.trait, el.blurb, eggGiftTypeLabel(key)].filter(Boolean).join(' ').toLowerCase();
    return [key, text];
  }));
  let picker = null;
  const row = (key) => {
    const el = ELEMENTS[key] || ELEMENTS.bloom;
    return `<button class="egg-picker-row" type="button" data-egg-pick="${key}">
      <span class="ep-dot" style="background:${el.primary}"></span>
      <span style="flex:1;min-width:0"><b>${esc(el.name)}</b><br><span>${esc(eggGiftTypeLabel(key))}</span></span>
      <span class="tiny muted">${TYPE_EGG_PRICE[key] ? `${TYPE_EGG_PRICE[key]}🪙 value` : ''}</span>
    </button>`;
  };
  const { close } = openSheet({
    key: 'egg-gift',
    title: '🥚 Choose any sprite egg',
    sub: 'Search all species. Your gift egg arrives warm and ready to hatch in the Nest.',
    body: `<input id="egg-gift-search" class="egg-picker-search" placeholder="Search name, meme, or type" aria-label="Search sprites">
      <div class="row" style="gap:5px;flex-wrap:wrap;margin:8px 0"><span class="chip">${pool.length.toLocaleString()} species</span><span class="chip" data-egg-gift-count aria-live="polite">${matchLabel(pool.length)}</span></div>
      <div class="egg-picker-list" data-egg-picker-list></div>
      <p class="tiny muted" data-egg-gift-empty role="status" hidden>No sprite matches that search.</p>`,
    onClose: () => { picker?.clear(); picker = null; },
    onMount: (sheet, closeSheet) => {
      const search = sheet.querySelector('#egg-gift-search');
      const list = sheet.querySelector('[data-egg-picker-list]');
      const count = sheet.querySelector('[data-egg-gift-count]');
      const empty = sheet.querySelector('[data-egg-gift-empty]');
      picker = createPickerGrid({
        container: list,
        options: { batchSize: 60, rootMargin: '700px 0px', virtual: true, windowSize: 240, key: (key) => key },
        renderItem: row,
        count,
        empty,
      });
      const paint = () => {
        const q = String(search.value || '').trim().toLowerCase();
        const rows = !q ? pool : pool.filter((key) => (poolSearch.get(key) || '').includes(q));
        const emptyText = q
          ? `No sprite matches “${search.value.trim()}”.`
          : 'No gift-eligible sprites are available right now.';
        picker.update(rows, matchLabel(rows.length), emptyText);
      };
      list.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-egg-pick]');
        if (!btn) return;
        const key = btn.dataset.eggPick;
        closeSheet();
        if (typeof onPick === 'function') onPick(key);
      });
      search.addEventListener('input', paint);
      paint();
    },
  });
  return { close };
}

function openDailyEggGift() {
  openEggGiftPicker((key) => {
    const res = Actions.claimDailyEgg(key);
    if (!res.ok) {
      toast(res.reason === 'claimed' ? 'Today’s gift egg is already claimed. Come back tomorrow.' : 'The gift egg could not be delivered.', '🥚');
      App.refresh();
      return;
    }
    toast(res.egg.shiny
      ? `✨ Shiny gift egg: ${ELEMENTS[res.element].name} · warm and waiting in the Nest.`
      : `Gift egg: ${ELEMENTS[res.element].name} · warm and waiting in the Nest.`, res.egg.shiny ? '✨' : '🥚');
    App.refresh();
  });
}
