/* Gene Lab sheet: pick two donors, edit the spliced genes, name the species
   and keep it. Everything it saves goes through gene-lab.js, which owns the
   species registration and the save record. */

function geneLabDonorOptions(selected) {
  return (typeof ELEMENT_KEYS !== 'undefined' ? ELEMENT_KEYS : [])
    .filter((key) => ELEMENTS[key])
    .map((key) => `<option value="${key}"${key === selected ? ' selected' : ''}>${esc(ELEMENTS[key].name)}${ELEMENTS[key].geneLab ? ' · gene' : ''}</option>`)
    .join('');
}

function openGeneLab() {
  if (!state.started) return;
  const owned = state.sprites.filter((sprite) => sprite.stage !== 'egg' && ELEMENTS[sprite.element]);
  let donorA = owned[0]?.element || 'bloom';
  let donorB = owned.find((sprite) => sprite.element !== donorA)?.element || null;
  if (!donorB) {
    donorB = (typeof ELEMENT_KEYS !== 'undefined' ? ELEMENT_KEYS : [])
      .find((key) => key !== donorA && ELEMENTS[key] && !ELEMENTS[key].geneLab) || donorA;
  }
  let nonce = 0;
  let draft = geneLabSpliceDraft(donorA, donorB, nonce);

  const SLOTS = [
    { field: 'breed', label: 'Body', keys: () => BREED_KEYS, name: (key) => BREEDS[key].name, icon: (key) => BREEDS[key].icon || '●' },
    { field: 'head', label: 'Head', keys: () => HEAD_SHAPE_KEYS, name: (key) => HEAD_SHAPES[key].name, icon: () => '🧢' },
    { field: 'ears', label: 'Ears', keys: () => EAR_STYLE_KEYS, name: (key) => EAR_STYLES[key].name, icon: (key) => EAR_STYLES[key].icon || '👂' },
    { field: 'eyes', label: 'Eyes', keys: () => EYE_STYLE_KEYS, name: (key) => EYE_STYLES[key].name, icon: (key) => EYE_STYLES[key].icon || '👀' },
    { field: 'nose', label: 'Nose', keys: () => NOSE_STYLE_KEYS, name: (key) => NOSE_STYLES[key].name, icon: (key) => NOSE_STYLES[key].icon || '•' },
    { field: 'arms', label: 'Arms', keys: () => ARM_STYLE_KEYS, name: (key) => ARM_STYLES[key].name, icon: (key) => ARM_STYLES[key].icon || '🫧' },
    { field: 'legs', label: 'Feet', keys: () => LEG_STYLE_KEYS, name: (key) => LEG_STYLES[key].name, icon: (key) => LEG_STYLES[key].icon || '🦶' },
    { field: 'pattern', label: 'Markings', keys: () => PATTERN_KEYS, name: (key) => PATTERNS[key].name, icon: (key) => PATTERNS[key].icon || '○' },
    { field: 'accessory', label: 'Accessory', keys: () => ACCESSORY_KEYS, name: (key) => ACCESSORIES[key].name, icon: (key) => ACCESSORIES[key].icon || '—' },
    { field: 'size', label: 'Size', keys: () => Object.keys(SIZES), name: (key) => SIZES[key].name || key, icon: () => '📏' },
  ];
  const COLOR_FIELDS = ['body', 'light', 'deep', 'accent'];

  const body = `
    <div class="gene-preview" data-gene-preview></div>
    <div class="gene-parents">
      <label>Gene donor A<select data-gene-donor="a" aria-label="First gene donor"></select></label>
      <label>Gene donor B<select data-gene-donor="b" aria-label="Second gene donor"></select></label>
    </div>
    <button class="btn btn-soft btn-block btn-sm" type="button" data-gene-splice style="margin-top:8px">🧬 Splice the donors again</button>

    <div class="section-title" style="margin-top:14px"><h2>Genes</h2><span>tap to swap a piece</span></div>
    <div data-gene-slots></div>

    <div class="section-title"><h2>Colours</h2><span>drawn from both donors</span></div>
    <div class="gene-colors">
      ${COLOR_FIELDS.map((field) => `<label class="gene-color">${field}<input type="color" data-gene-color="${field}" aria-label="${field} colour"></label>`).join('')}
    </div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="btn btn-ghost btn-sm" type="button" data-gene-blend>Blend donors</button>
      <button class="btn btn-ghost btn-sm" type="button" data-gene-take="a">Donor A colours</button>
      <button class="btn btn-ghost btn-sm" type="button" data-gene-take="b">Donor B colours</button>
    </div>

    <div class="section-title"><h2>Name</h2><span>this becomes the species name</span></div>
    <input class="gene-name" data-gene-name maxlength="${GENE_NAME_MAX}" placeholder="Name this species" aria-label="Species name" autocomplete="off">

    <div class="gene-cost"><span class="tiny muted" data-gene-cost-note></span><span class="chip" data-gene-coins></span></div>
    <button class="btn btn-primary btn-block" type="button" data-gene-create></button>

    <div class="section-title" style="margin-top:16px"><h2>Saved gene species</h2><span data-gene-saved-note></span></div>
    <div data-gene-saved></div>
  `;

  openSheet({
    key: 'gene-lab',
    title: '🧬 Gene Lab',
    sub: 'Splice two species into one and keep it. Splicing is free, and a new species is saved with your Hollow, so it is still yours after a reload or a save export.',
    body,
    onMount: (root, closeSheet) => {
      const slotsWrap = root.querySelector('[data-gene-slots]');
      const savedWrap = root.querySelector('[data-gene-saved]');
      const nameInput = root.querySelector('[data-gene-name]');
      /* openSheet stops clicks on .sheet from bubbling to the overlay, so the
         delegated listeners have to live on the sheet itself. */
      const panel = root.querySelector('.sheet') || root;

      const paint = (syncInputs = true) => {
        const baseName = ELEMENTS[draft.base]?.name || 'Bloom';
        const power = typeof GENE_POWERS !== 'undefined' ? GENE_POWERS[draft.base] : null;
        root.querySelector('[data-gene-preview]').innerHTML = `
          <div class="gene-preview-art">${spriteSVG(geneLabPreviewSprite(draft, { id: 'gene-lab-preview' }), { expr: 'happy' })}</div>
          <div class="gene-preview-name">${esc(draft.name || 'Unnamed splice')}</div>
          <div class="tiny muted">${esc(baseName)} ancestry${power ? ` · ${esc(power.name)}` : ''}</div>`;

        root.querySelector('[data-gene-donor="a"]').innerHTML = geneLabDonorOptions(donorA);
        root.querySelector('[data-gene-donor="b"]').innerHTML = geneLabDonorOptions(donorB);

        slotsWrap.innerHTML = SLOTS.map((slot) => {
          const active = draft[slot.field];
          return `<div class="gene-slot">
            <div class="gene-slot-label">${slot.label}<span>${esc(String(slot.name(active)))}</span></div>
            <div class="gene-slot-row">${slot.keys().map((key) => `<button class="gene-chip${active === key ? ' on' : ''}" type="button" data-gene-field="${slot.field}" data-gene-value="${key}" title="${esc(slot.name(key))}" aria-label="${esc(slot.name(key))}">${slot.icon(key)}</button>`).join('')}</div>
          </div>`;
        }).join('');

        if (syncInputs) {
          COLOR_FIELDS.forEach((field) => {
            const input = root.querySelector(`[data-gene-color="${field}"]`);
            if (input) input.value = draft.colors[field];
          });
          if (document.activeElement !== nameInput) nameInput.value = draft.name || '';
        }

        const limitReached = (state.geneDesigns || []).length >= GENE_DESIGN_LIMIT;
        const createBtn = root.querySelector('[data-gene-create]');
        createBtn.textContent = 'Create species · Free';
        createBtn.disabled = limitReached;
        root.querySelector('[data-gene-coins]').textContent = `${state.coins} 🪙`;
        root.querySelector('[data-gene-cost-note]').textContent = limitReached
          ? `The lab is full (${GENE_DESIGN_LIMIT} species). Forget one below to make room.`
          : 'Free to splice · saved to this Hollow · appears in Collection, Nest and breeding like any species.';

        const designs = state.geneDesigns || [];
        root.querySelector('[data-gene-saved-note]').textContent = `${designs.length} of ${GENE_DESIGN_LIMIT} kept`;
        savedWrap.innerHTML = designs.length
          ? designs.map((design) => {
            const used = state.sprites.filter((sprite) => sprite.element === design.key).length;
            const art = spriteSVG(geneLabPreviewSprite(design, { id: `gene-saved-${design.key}` }), { expr: 'happy' });
            return `<article class="gene-saved-card">
              <div class="gene-saved-art">${art}</div>
              <div class="gene-saved-copy">
                <b>${esc(design.name)}</b>
                <span class="tiny muted">${esc(ELEMENTS[design.base]?.name || design.base)} genes · ${used} in the Hollow</span>
                <span class="row" style="gap:5px;margin-top:6px;flex-wrap:wrap">
                  <button class="btn btn-soft btn-sm" type="button" data-gene-summon="${design.key}">Summon another · ${GENE_RESUMMON_COST ? `${GENE_RESUMMON_COST} 🪙` : 'Free'}</button>
                  ${used ? '' : `<button class="btn btn-ghost btn-sm" type="button" data-gene-forget="${design.key}">Forget</button>`}
                </span>
              </div>
            </article>`;
          }).join('')
          : '<p class="tiny muted" style="margin:6px 2px 0;line-height:1.55">No gene species yet. Splice one above and it will be listed here, along with every copy you grow.</p>';
      };

      panel.addEventListener('change', (event) => {
        const select = event.target.closest('[data-gene-donor]');
        if (!select) return;
        if (select.dataset.geneDonor === 'a') donorA = select.value;
        else donorB = select.value;
        draft = geneLabSpliceDraft(donorA, donorB, nonce);
        Sfx.click();
        paint();
      });

      panel.addEventListener('input', (event) => {
        const colorInput = event.target.closest('[data-gene-color]');
        if (colorInput) {
          draft.colors[colorInput.dataset.geneColor] = colorInput.value;
          paint(false);
          return;
        }
        const typed = event.target.closest('[data-gene-name]');
        if (typed) {
          draft.name = typed.value.slice(0, GENE_NAME_MAX);
          paint(false);
        }
      });

      panel.addEventListener('click', async (event) => {
        const chip = event.target.closest('[data-gene-field]');
        if (chip) {
          draft[chip.dataset.geneField] = chip.dataset.geneValue;
          Sfx.click();
          paint();
          return;
        }
        if (event.target.closest('[data-gene-splice]')) {
          nonce += 1;
          draft = geneLabSpliceDraft(donorA, donorB, nonce);
          Sfx.click();
          paint();
          return;
        }
        if (event.target.closest('[data-gene-blend]')) {
          draft.colors = geneLabSpliceDraft(donorA, donorB, nonce).colors;
          Sfx.click();
          paint();
          return;
        }
        const take = event.target.closest('[data-gene-take]');
        if (take) {
          draft.colors = { ...geneColorsFor(take.dataset.geneTake === 'a' ? donorA : donorB) };
          Sfx.click();
          paint();
          return;
        }
        if (event.target.closest('[data-gene-create]')) {
          const result = geneLabCreate(draft);
          if (!result.ok) return;
          closeSheet();
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
          setTimeout(() => { if (typeof App !== 'undefined' && App.openDetail) App.openDetail(result.sprite.id); }, 140);
          return;
        }
        const summon = event.target.closest('[data-gene-summon]');
        if (summon) {
          const result = geneLabSummon(summon.dataset.geneSummon);
          if (result.ok) {
            paint();
            if (typeof App !== 'undefined' && App.refresh) App.refresh();
          }
          return;
        }
        const forget = event.target.closest('[data-gene-forget]');
        if (forget) {
          const sure = await confirmModal('Forget this gene species?', 'No sprite uses it right now, so the lab can drop it. Splicing it again later costs another blueprint.', 'Forget species', { danger: true });
          if (!sure) return;
          const result = geneLabForget(forget.dataset.geneForget);
          if (result.ok) paint();
        }
      });

      paint();
    },
  });
}
