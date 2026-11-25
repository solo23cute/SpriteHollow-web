/* Evolution theatre: a transformation sequence that plays while a sprite evolves,
   then reveals the new age tier or permanent diet form. */

const EVO_STAGE_ICONS = { baby: '🐣', juvenile: '🌱', sprite: '🎒', youngadult: '🧑', midadult: '🧑‍💼', highadult: '🧑‍🚀', elder: '🌳', ancient: '🗿', sensei: '🥋' };

const EVO_PHASES = [
  'Gathering pixie dust…',
  'Folding new wings…',
  'Reshaping the silhouette…',
  'Settling the new form…',
];

let evoBusy = false;
const evoQueue = [];

function stageBonusLine(stage) {
  return {
    baby: 'A brand-new Hollow resident.',
    juvenile: 'Grown enough to explore the Hollow on their own.',
    sprite: 'A teenager: more independence, a sharper personality, and a bigger world.',
    youngadult: 'A young adult: confident, curious, and ready to explore.',
    midadult: 'A mid-adult: settled, steady, and deeply bonded.',
    highadult: 'A high adult: experienced, calm, and full of stories.',
    elder: 'An elderly sprite: bigger art, calmer needs, and a wise bond.',
    ancient: 'An ancient form: rarer sparkle and stronger presence.',
    sensei: 'A Sensei — the final age tier at level 1,000. Retirement unlocks at Elderly level 100.',
  }[stage] || 'A new stage begins.';
}

function evolutionLadderHTML(current) {
  return `<div class="evo-pop-ladder">${STAGE_ORDER.map((stage) => {
    const index = STAGE_ORDER.indexOf(stage);
    const currentIndex = STAGE_ORDER.indexOf(current);
    const reached = currentIndex >= index;
    return `<div class="evo-pop-step ${reached ? 'reached' : ''} ${stage === current ? 'on' : ''}">
      <span class="evo-pop-ico">${EVO_STAGE_ICONS[stage] || '✨'}</span>
      <b>${STAGE_LABELS[stage]}</b>
      <span class="tiny muted">Lv ${STAGE_LEVEL[stage]}+</span>
    </div>`;
  }).join('')}</div>`;
}

function nextStageHint(s) {
  const info = stageEvolutionInfo(s);
  if (info.egg) return 'Warm the egg to meet your sprite.';
  if (info.final) return `This is the final age tier. Keep growing toward level ${MAX_LEVEL.toLocaleString()} and retire whenever you like.`;
  return `Next up: <b>${info.nextLabel}</b> at level ${info.required} — ${info.levelsLeft} level${info.levelsLeft === 1 ? '' : 's'} to go.`;
}

function stageResultHTML(s, to) {
  const el = ELEMENTS[s.element] || ELEMENTS.bloom;
  const toLabel = STAGE_LABELS[to] || 'Sprite';
  const tier = typeof spriteRarity === 'function' ? spriteRarity(s) : null;
  const ascended = to === 'sensei' || s.level >= MAX_LEVEL;
  const frameElement = typeof elementFrameKey === 'function' ? (elementFrameKey(s.element) || '') : '';
  const evoAnimation = typeof evolutionStageAnimationFor === 'function' ? evolutionStageAnimationFor(to) : null;
  return `<div class="evo-result-head">
      <span class="evo-result-kicker">Evolution complete</span>
      <h2>${esc(displayName(s))} is now a <b>${esc(toLabel)}</b>.</h2>
      <p class="sub">${esc(stageBonusLine(to))}</p>
    </div>
    <div class="evo-pop${ascended ? ' is-ascended' : ''}" data-rarity="${tier ? spriteRarityKey(s) : ''}" data-frame-element="${frameElement}" data-evo-anim="${evoAnimation ? evoAnimation.step : ''}" style="--evo-glow:${el.primary};--rarity:${tier ? tier.color : el.primary};--rarity-gradient:${tier ? (tier.gradient || tier.color) : el.primary};--rarity-glow:${tier ? (tier.frameGlow || tier.color) : el.primary}">
      <div class="evo-pop-art" style="--evo-glow:${el.primary}">
        <span class="evo-pop-burst">✨</span>
        ${spriteSVG(s, { expr: 'happy' })}
      </div>
      <div class="evo-pop-copy">
        <div class="row" style="flex-wrap:wrap;justify-content:center;gap:5px">
          <span class="chip">${EVO_STAGE_ICONS[to] || '✨'} ${esc(toLabel)}</span>
          <span class="chip">Level ${s.level}</span>
          <span class="chip">${esc(typeName(s))}</span>
        </div>
      </div>
      ${evoAnimation ? `<details class="rarity-frame-prompt" style="--rarity:${tier ? tier.color : el.primary}"><summary>🎬 ${evoAnimation.from} → ${evoAnimation.to} animation</summary><p>${esc(evoAnimation.animation)}</p><p>${esc(evoAnimation.prompt)}</p></details>` : ''}
      ${evolutionLadderHTML(to)}
      ${typeof puffleEvolutionCardHTML === 'function' ? puffleEvolutionCardHTML(s) : ''}
      <div class="evo-pop-note">${nextStageHint(s)}</div>
      <button class="btn btn-primary btn-block" data-evo-pop-ok style="margin-top:12px">Keep growing</button>
    </div>`;
}

function formResultHTML(sprite, form) {
  const el = ELEMENTS[sprite.element] || ELEMENTS.bloom;
  const power = form.power || { icon: '🧬', name: 'New form', desc: 'A permanent new shape.' };
  const tier = typeof spriteRarity === 'function' ? spriteRarity(sprite) : null;
  const ascended = sprite.level >= MAX_LEVEL || sprite.stage === 'sensei';
  const frameElement = typeof elementFrameKey === 'function' ? (elementFrameKey(sprite.element) || '') : '';
  return `<div class="evo-result-head">
      <span class="evo-result-kicker">Evolution complete</span>
      <h2>${form.icon || '🧬'} ${esc(cpCreatureLookName(sprite) || formName(sprite))}</h2>
      <p class="sub">${esc(form.desc)}</p>
    </div>
    <div class="evo-pop${ascended ? ' is-ascended' : ''}" data-rarity="${tier ? spriteRarityKey(sprite) : ''}" data-frame-element="${frameElement}" style="--evo-glow:${el.primary};--rarity:${tier ? tier.color : el.primary};--rarity-gradient:${tier ? (tier.gradient || tier.color) : el.primary};--rarity-glow:${tier ? (tier.frameGlow || tier.color) : el.primary}">
      <div class="evo-pop-art" style="--evo-glow:${el.primary}">
        <span class="evo-pop-burst">🧬</span>
        ${spriteSVG(sprite, { expr: 'happy' })}
      </div>
      <div class="evo-pop-copy">
        <div class="row" style="flex-wrap:wrap;justify-content:center;gap:5px">
          <span class="chip">${power.icon} ${esc(power.name)}</span>
          <span class="chip">${esc(power.desc)}</span>
          ${form.favorite && FOODS[form.favorite] ? `<span class="chip">💛 ${FOODS[form.favorite].emoji} favourite</span>` : ''}
          ${form.puffle ? `<span class="chip">🐧 Club Penguin puffle</span>` : ''}
          ${form.creature ? `<span class="chip">🐾 Puffle Creature</span>` : ''}
          <span class="chip">Permanent</span>
        </div>
      </div>
      ${typeof puffleEvolutionCardHTML === 'function' ? puffleEvolutionCardHTML(sprite) : ''}
      <button class="btn btn-primary btn-block" data-evo-pop-ok style="margin-top:12px">Amazing</button>
    </div>`;
}

/* The transformation itself: a progress screen with the old silhouette morphing
   into the new one, then the result panel in the same overlay. */
function runEvolutionSequence(opts) {
  const isStage = opts.kind === 'stage';
  const s = isStage ? findSprite(opts.spriteId) : (opts.sprite || findSprite(opts.spriteId));
  if (!s) {
    evoBusy = false;
    evoDrain();
    return;
  }
  const el = ELEMENTS[s.element] || ELEMENTS.bloom;
  const fromStage = isStage ? (opts.from || s.stage) : s.stage;
  const toStage = isStage ? (opts.to || s.stage) : s.stage;
  const fromLabel = STAGE_LABELS[fromStage] || 'Egg';
  const toLabel = isStage ? (STAGE_LABELS[toStage] || 'Sprite') : (formName(s) || 'New form');
  /* Growing is a life moment, so the sprite says something in its own voice. */
  const growLine = typeof window.puffleVoiceLine === 'function' ? window.puffleVoiceLine(s, 'grow') : null;
  const evoAnimation = isStage && typeof evolutionStageAnimationFor === 'function' ? evolutionStageAnimationFor(toStage) : null;
  const before = isStage ? { ...s, stage: fromStage } : { ...s, form: null };
  const after = isStage ? { ...s, stage: toStage } : s;
  const fast = document.body.classList.contains('reduce-motion');
  const duration = fast ? 420 : 2400;

  /* Motes are laid out in the JS so the golden-angle spread stays even at any
     screen size; CSS only animates them. */
  const motes = Array.from({ length: 14 }, (_, i) => {
    const angle = i * 137.508 * (Math.PI / 180);
    const radius = 28 + (i % 4) * 9;
    const x = (50 + Math.cos(angle) * radius).toFixed(1);
    const y = (52 + Math.sin(angle) * radius * 0.8).toFixed(1);
    return `<i style="--x:${x}%;--y:${y}%;--d:${(i * 149) % 1500}ms;--s:${(0.6 + (i % 5) * 0.16).toFixed(2)}"></i>`;
  }).join('');

  const inner = `<div class="evo-seq is-live${evoAnimation ? ` evo-anim-${evoAnimation.step}` : ''}" data-evo-anim="${evoAnimation ? evoAnimation.step : ''}" style="--evo-glow:${el.primary};--evo-duration:${duration}ms">
    <div class="evo-seq-aura" aria-hidden="true"></div>
    <div class="evo-seq-rays" aria-hidden="true"></div>
    <div class="evo-seq-motes" aria-hidden="true">${motes}</div>
    <div class="evo-seq-flash" aria-hidden="true"></div>
    <div class="evo-seq-kicker">Evolution in progress</div>
    <div class="evo-seq-art">
      <span class="evo-seq-halo" aria-hidden="true"></span>
      <span class="evo-seq-ring"></span>
      <span class="evo-seq-old" data-evo-old>${spriteSVG(before, { expr: 'idle' })}</span>
      <span class="evo-seq-new" data-evo-new>${spriteSVG(after, { expr: 'happy' })}</span>
    </div>
    <h2 class="evo-seq-title">${esc(displayName(s))}</h2>
    <div class="evo-seq-sub">${esc(fromLabel)} <b class="evo-arrow">→</b> <b>${esc(toLabel)}</b></div>
    ${growLine ? `<div class="evo-seq-quote" data-evo-quote style="margin-top:8px;font-size:12px;font-style:italic;opacity:.9;text-align:center">“${esc(growLine)}”</div>` : ''}
    <div class="evo-seq-bar"><i data-evo-fill></i></div>
    <div class="evo-seq-phase"><span data-evo-phase>${esc(EVO_PHASES[0])}</span><b data-evo-pct>0%</b></div>
    <button class="btn btn-ghost btn-block" data-evo-skip style="margin-top:10px">Skip animation</button>
  </div>`;

  const { overlay, close } = buildOverlay(inner, {
    center: true,
    dismissible: false,
    onClose: () => {
      evoBusy = false;
      setTimeout(evoDrain, 140);
    },
  });
  overlay.classList.add('overlay-evo');
  if (typeof Sfx !== 'undefined' && Sfx.evolution) Sfx.evolution(duration);
  const box = overlay.querySelector('.evo-seq');
  const fill = overlay.querySelector('[data-evo-fill]');
  const pctEl = overlay.querySelector('[data-evo-pct]');
  const phaseEl = overlay.querySelector('[data-evo-phase]');
  const start = Date.now();
  let timer = null;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    if (timer) clearTimeout(timer);
    /* Skipping cuts the rest of the cue; the result fanfare plays next. */
    if (typeof Sfx !== 'undefined' && Sfx.stopEvolution) Sfx.stopEvolution();
    if (!box) return close();
    box.classList.add('is-result');
    box.innerHTML = isStage ? stageResultHTML(s, toStage) : formResultHTML(s, opts.form);
    box.querySelector('[data-evo-pop-ok]')?.addEventListener('click', () => {
      close();
      if (typeof App !== 'undefined') App.refresh();
    });
    if (typeof Sfx !== 'undefined' && Sfx.win) Sfx.win();
  };

  const step = () => {
    if (finished) return;
    const t = Math.min(1, (Date.now() - start) / duration);
    if (fill) fill.style.width = `${Math.round(t * 100)}%`;
    if (pctEl) pctEl.textContent = `${Math.round(t * 100)}%`;
    if (phaseEl) phaseEl.textContent = EVO_PHASES[Math.min(EVO_PHASES.length - 1, Math.floor(t * EVO_PHASES.length))];
    if (box && t > 0.45) box.classList.add('is-morph');
    if (t >= 1) return finish();
    timer = setTimeout(step, 45);
  };

  overlay.querySelector('[data-evo-skip]')?.addEventListener('click', finish);
  timer = setTimeout(step, 45);
}

function evoDrain() {
  const next = evoQueue.shift();
  if (next) playEvolution(next);
}

function playEvolution(opts) {
  if (typeof buildOverlay !== 'function' || !document.getElementById('portal')) return;
  if (evoBusy) {
    evoQueue.push(opts);
    return;
  }
  evoBusy = true;
  try {
    runEvolutionSequence(opts);
  } catch (err) {
    evoBusy = false;
    console.error(err);
    evoDrain();
  }
}

function celebrateStageEvolution({ spriteId, from, to }) {
  playEvolution({ kind: 'stage', spriteId, from, to });
}

function celebrateFormEvolution(sprite, form) {
  if (!sprite || !form) return;
  playEvolution({ kind: 'form', spriteId: sprite.id, form });
}

/* Called by growth helpers when a level-up crosses a stage threshold. */
function announceStageEvolution(s, fromStage, toStage) {
  if (!s || fromStage === toStage) return;
  /* The Club Penguin line changes colour with the stage it reaches. */
  if (typeof syncCpPuffleEvolutionColour === 'function') syncCpPuffleEvolutionColour(s);
  try {
    setTimeout(() => celebrateStageEvolution({ spriteId: s.id, from: fromStage, to: toStage }), 260);
  } catch (err) { /* celebrations are cosmetic; never break growth */ }
}
