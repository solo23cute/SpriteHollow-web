/* Egg warming and hatch reveal. */

function firstFlightFusionHatch(s) {
  if (typeof FirstFlight === 'undefined' || !s || !state.flight || state.flight.fusionId !== s.id || state.flight.claimed) return false;
  const progress = FirstFlight.progressFromSave(state);
  return !!progress && progress.eligible && progress.done;
}

function openHatchFlow(spriteId, opts = {}) {
  let sprite = findSprite(spriteId);
  if (!sprite || sprite.stage !== 'egg') {
    toast('That egg is already hatched.', '🐣');
    return;
  }

  const { overlay, close } = buildOverlay(`<div class="modal"></div>`, { center: true, dismissible: false, key: 'hatch-flow' });
  const modal = overlay.querySelector('.modal');
  let finished = false;
  /* The hatchling's first line in its own voice, shown on the hatch card. */
  let firstWordsShown = '';
  let mythicRevealed = false;

  function render() {
    sprite = findSprite(spriteId) || sprite;
    const ready = sprite.hatch >= 100;
    const hatched = sprite.stage !== 'egg';
    /* Frozen breeds only warm under a cooling incubator. The modal explains that
       up front instead of leaving the player to discover it from a failed tap. */
    const incubator = typeof activeIncubator === 'function' ? activeIncubator() : null;
    const coldBreed = typeof coldHatchEnabled === 'function' && coldHatchEnabled()
      && typeof COLD_HATCH_BREEDS !== 'undefined' && COLD_HATCH_BREEDS.includes(sprite.breed);
    const coldBlocked = !!coldBreed && !!incubator
      && !(typeof incubatorAllowsCold === 'function' ? incubatorAllowsCold(incubator) : (incubator.key === 'chill' || incubator.key === 'frostchill'));
    const lavaFrozen = typeof eggIsLavaFrozen === 'function' && eggIsLavaFrozen(sprite);
    const chillTarget = typeof coolingIncubatorKey === 'function' ? coolingIncubatorKey(sprite) : 'chill';
    const breedName = (typeof BREEDS !== 'undefined' && BREEDS[sprite.breed] && BREEDS[sprite.breed].name) || 'Frost-bred';
    if (hatched) {
      renderHatched();
      return;
    }
    if (sprite.eggLabel === 'Mythic Egg' && ready && !mythicRevealed) {
      renderMythicReveal();
      return;
    }
    modal.innerHTML = `
      <div class="between" style="align-items:flex-start;margin-bottom:2px">
        <div style="text-align:left">
          <div class="eyebrow">${opts.starter ? 'Your first friend' : 'In the nest'}</div>
          <h2 style="font-size:20px;margin-top:3px">${opts.starter ? 'Say hello to your egg' : esc(displayName(sprite))}</h2>
        </div>
        <button class="icon-btn" data-later aria-label="Close">${icon('close')}</button>
      </div>
      <div class="hatch-stage">
        <button class="egg-big" data-warm aria-label="Warm the egg" style="border:0;background:none;padding:0">
          ${eggSVG(sprite, { progress: sprite.hatch })}
        </button>
      </div>
      ${sprite.shiny ? '<div class="hatch-shiny" role="status">✨ Shiny egg · this hatch is guaranteed to sparkle</div>' : ''}
      <div class="bar" style="height:9px"><i style="width:${sprite.hatch}%;background:linear-gradient(90deg,var(--gold),#ff9f43)"></i></div>
      <div class="hatch-hint">${coldBlocked && !ready
        ? 'The shell is cold to the touch — it will not warm under this incubator.'
        : ready
          ? 'Cracks are glowing. It’s ready!'
          : sprite.hatch > 0
            ? `Keep tapping the shell — ${Math.max(1, Math.ceil((100 - sprite.hatch) / 9))} more taps`
            : 'Tap the egg to warm it. Eggs hatch when they’re ready.'}</div>
      ${coldBlocked && !ready ? `<div class="hatch-cold" role="note">
        <span class="hatch-cold-icon" aria-hidden="true">❄️</span>
        <div><b>${esc(breedName)} eggs need a cooling incubator</b>
          <p>${lavaFrozen ? 'This is a lava-frozen egg: Ember heat inside a frozen shell. ' : ''}It only warms under the ❄️ Chill Stone or 🧊 Frost Chill. The ${esc(incubator.name)} keeps it too warm, so taps do nothing until the Nest is switched.</p>
          <button class="btn btn-soft btn-block" data-chill style="margin-top:8px">${chillTarget === 'frostchill' ? '🧊 Switch the Nest to Frost Chill' : '❄️ Switch the Nest to the Chill Stone'}</button>
        </div>
      </div>` : ''}
      <button class="btn ${ready ? 'btn-gold' : 'btn-soft'} btn-block" data-hatch ${ready ? '' : 'disabled'} style="margin-top:12px">
        ${ready ? 'Hatch the egg' : coldBlocked ? '❄️ Needs a cooling mode' : `Warm · ${Math.round(sprite.hatch)}%`}
      </button>
      <button class="btn btn-ghost btn-block" data-later style="margin-top:8px">Later — keep it cozy</button>
    `;
    /* Shell feedback is state-driven, so the egg keeps breathing, wobbling or
       glowing even before the next tap. */
    const eggBig = modal.querySelector('.egg-big');
    if (eggBig) {
      eggBig.classList.toggle('egg-ready', ready);
      eggBig.classList.toggle('egg-cracking', !ready && sprite.hatch >= 70);
    }
    modal.querySelectorAll('[data-later]').forEach((b) => b.addEventListener('click', close));
    modal.querySelector('[data-warm]').addEventListener('click', warm);
    modal.querySelector('[data-hatch]').addEventListener('click', hatch);
    const chillBtn = modal.querySelector('[data-chill]');
    if (chillBtn) chillBtn.addEventListener('click', () => {
      if (typeof Actions !== 'undefined' && Actions.setIncubator) Actions.setIncubator(chillTarget);
      Sfx.click();
      toast('The Nest is cooling this egg — it will warm now.', chillTarget === 'frostchill' ? '🧊' : '❄️');
      render();
    });
  }

  function warm(ev) {
    if (sprite.hatch >= 100) {
      hatch();
      return;
    }
    /* The modal already explains the Chill Stone rule; skip the duplicate toast. */
    const inc = typeof activeIncubator === 'function' ? activeIncubator() : null;
    if (typeof coldHatchEnabled === 'function' && coldHatchEnabled()
        && typeof COLD_HATCH_BREEDS !== 'undefined' && COLD_HATCH_BREEDS.includes(sprite.breed)
        && inc && !(typeof incubatorAllowsCold === 'function' ? incubatorAllowsCold(inc) : (inc.key === 'chill' || inc.key === 'frostchill'))) {
      render();
      return;
    }
    const before = sprite.hatch;
    Actions.warmEgg(sprite.id);
    sprite = findSprite(sprite.id);
    Sfx.init();
    Sfx.pop();
    tapHaptic(10);
    if (sprite.hatch >= 100 && before < 100) {
      Sfx.level();
      const r = modal.querySelector('.hatch-stage')?.getBoundingClientRect();
      if (r) burstAt(r.left + r.width / 2, r.top + r.height / 2, ['✨', '💛', '🌟'], 10);
      render();
      return;
    }
    render();
    /* Re-render first, then animate the fresh shell: animating the old node
       before render() replaced it meant the wobble was never seen. */
    const egg = modal.querySelector('.egg-big');
    if (egg) {
      egg.classList.add('egg-peek');
      setTimeout(() => egg.classList.remove('egg-peek'), 520);
    }
  }

  function renderMythicReveal() {
    const rarity = spriteRarity(sprite);
    modal.innerHTML = `
      <div class="between" style="align-items:flex-start;margin-bottom:2px">
        <div style="text-align:left">
          <div class="eyebrow">Mythic egg</div>
          <h2 style="font-size:21px;margin-top:3px">Something ancient is stirring</h2>
        </div>
        <button class="icon-btn" data-later aria-label="Close">${icon('close')}</button>
      </div>
      <div class="hatch-stage mythic-stage">
        <div class="mythic-aura"></div>
        ${eggSVG(sprite, { progress: 100 })}
      </div>
      ${sprite.shiny ? '<div class="hatch-shiny" role="status">✨ Shiny egg · this mythic is guaranteed to sparkle</div>' : ''}
      <div class="mythic-rarity" style="--rarity:${rarity.color}">✦ ${rarity.name} fate</div>
      <p class="hatch-hint">The shell is holding a ${rarity.name.toLowerCase()}-rarity legend. Reveal it before you break the shell.</p>
      <button class="btn btn-gold btn-block" data-reveal style="margin-top:12px">Reveal the mythic</button>
      <button class="btn btn-ghost btn-block" data-later style="margin-top:8px">Later — keep it sealed</button>
    `;
    modal.querySelectorAll('[data-later]').forEach((b) => b.addEventListener('click', close));
    modal.querySelector('[data-reveal]').addEventListener('click', () => {
      mythicRevealed = true;
      Sfx.init();
      Sfx.level();
      tapHaptic(18);
      playMythicRarityReveal();
    });
  }

  function playMythicRarityReveal() {
    playSummonReveal(spriteRarity(sprite), spriteRarityKey(sprite), renderMythicType, 900);
  }

  function playSummonReveal(rarity, rarityKey, onDone, delay = 1000) {
    const steps = rarity.summonSequence || [];
    const caption = steps.length ? steps[steps.length - 1] : `A ${rarity.name.toLowerCase()} legend answers`;
    const summonMotes = Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
    modal.innerHTML = `
      <div class="mythic-rarity-reveal summon-reveal summon-${rarityKey}" data-summon-rarity="${rarityKey}" style="--rarity:${rarity.color};--rarity-glow:${rarity.frameGlow || rarity.color}">
        <div class="summon-portal" aria-hidden="true"></div>
        <div class="summon-motes" aria-hidden="true">${summonMotes}</div>
        <div class="mythic-rarity-rings"></div>
        <div class="mythic-rarity-word">${rarity.name}</div>
        <div class="mythic-rarity-sub">${esc(caption)}</div>
      </div>`;
    const r = modal.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, ['✨', '🌌', '🌟', '💫'], 24);
    setTimeout(() => {
      if (!document.body.contains(modal)) return;
      onDone();
    }, delay);
  }

  function renderMythicType() {
    const s = findSprite(spriteId) || sprite;
    const type = typeName(s);
    const rarity = spriteRarity(s);
    const power = GENE_POWERS[s.element];
    const finish = finishOf(s);
    modal.innerHTML = `
      <div class="eyebrow" style="text-align:center">Mythic reveal</div>
      <h2 style="font-size:25px;margin-top:4px;text-align:center">It’s ${article(type)} ${type}!</h2>
      <div class="hatch-stage mythic-stage">
        <div class="mythic-aura"></div>
        <div class="mythic-pop">${spriteSVG({ ...s, stage: 'adult' }, { expr: 'love' })}</div>
      </div>
      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px">
        <span class="rarity-pill" style="--rarity:${rarity.color}">${rarity.name}</span>
        <span class="chip">${power.icon} ${esc(power.name)}</span>
        ${finish ? `<span class="chip chip-mut">${finish.icon} ${esc(finish.name)} finish</span>` : ''}
      </div>
      <p class="sub" style="text-align:center;margin-top:9px">${ELEMENTS[s.element].blurb}</p>
      <button class="btn btn-gold btn-block" data-break style="margin-top:14px">Break the shell</button>
      <button class="btn btn-ghost btn-block" data-later style="margin-top:8px">Later</button>
    `;
    modal.querySelectorAll('[data-later]').forEach((b) => b.addEventListener('click', close));
    modal.querySelector('[data-break]').addEventListener('click', hatch);
  }

  function hatch() {
    sprite = findSprite(spriteId) || sprite;
    if (sprite.hatch < 100 || sprite.stage !== 'egg') return;
    const wasMythicEgg = sprite.eggLabel === 'Mythic Egg';
    const res = Actions.hatchEgg(sprite.id);
    if (!res.ok) return;
    finished = true;
    sprite = res.sprite;
    firstWordsShown = res.firstWords || '';
    const completeHatch = () => {
      renderHatched();
      /* The hatch celebration runs for exactly as long as the manifest's
         celebrate animation, so the sheet timing drives the moment. */
      const hatchedArt = modal.querySelector('.hatched');
      if (hatchedArt && typeof spriteAnimationDuration === 'function') {
        hatchedArt.style.animationDuration = `${spriteAnimationDuration('celebrate', 700)}ms`;
      }
      const stage = modal.querySelector('.hatch-stage');
      if (stage) {
        const r = stage.getBoundingClientRect();
        const flightFinal = firstFlightFusionHatch(res.sprite);
        burstAt(r.left + r.width / 2, r.top + r.height / 2, res.sprite.shiny ? ['✨', '🌟', '💎', '💛'] : ['🎉', '✨', '💛', '🌟'], res.sprite.shiny ? 22 : 14);
        if (flightFinal) {
          burstAt(r.left + r.width / 2, r.top + r.height / 2, ['🕊️', '✨', '🎉'], 8);
          Sfx.win();
          toast('First Flight complete — your first fusion is hatched.', '🕊️');
        }
      }
      if (res.sprite.shiny) toast(`${displayName(res.sprite)} hatched shiny!`, '✨');
      Sfx.hatch();
      Sfx.spriteCry(res.sprite, { delay: 0.38 });
      tapHaptic(24);
    };
    if (wasMythicEgg) completeHatch();
    else playSummonReveal(spriteRarity(sprite), spriteRarityKey(sprite), completeHatch);
  }

  function renderHatched() {
    const s = findSprite(spriteId) || sprite;
    const type = typeName(s);
    const finish = finishOf(s);
    const shiny = !!s.shiny;
    const flightFinal = firstFlightFusionHatch(s);
    modal.innerHTML = `
      <div class="eyebrow" style="text-align:center">${opts.starter ? 'Welcome home' : shiny ? '✨ A shiny hatch!' : 'It hatched!'}</div>
      <h2 style="font-size:24px;margin-top:4px;text-align:center">${shiny ? `It’s a shiny ${type}!` : `It’s ${article(type)} ${type}!`}</h2>
      <div class="hatch-stage">
        <div class="hatched">${spriteSVG(s, { expr: 'happy' })}</div>
      </div>
      ${firstWordsShown ? `<div class="card" data-first-words style="padding:10px;margin-top:10px;text-align:center;border-color:rgba(255,209,102,.35);background:rgba(255,209,102,.06)">
        <b>First words</b>
        <p class="tiny" style="margin:4px 0 0;font-style:italic">“${esc(firstWordsShown)}”</p>
      </div>` : ''}
      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:5px">
        <span class="chip">${BREEDS[s.breed]?.name || 'Puff'} breed</span>
        <span class="chip gender-chip" style="color:${genderOf(s).color}">${genderOf(s).symbol} ${esc(genderOf(s).name)}</span>
        <span class="chip">${PERSONALITIES[s.personality]?.name || 'Sunny'} soul</span>
        <span class="chip">${PATTERNS[s.pattern]?.name || 'Plain'}</span>
        <span class="chip">${SIZES[s.size]?.name || 'Standard'} size</span>
        ${shiny ? '<span class="chip chip-shine">✨ Shiny</span>' : ''}
        ${finish ? `<span class="chip chip-mut">${finish.icon} ${esc(finish.name)} finish</span>` : ''}
        ${s.special ? `<span class="chip chip-mut">✦ ${esc(COMBOS.find((c) => c.id === s.special)?.name || 'Special combo')}</span>` : s.mutation ? `<span class="chip chip-mut">✦ ${esc(s.mutation)}</span>` : ''}
      </div>
      ${flightFinal ? `<div class="card" data-flight-hatch-cheer style="padding:10px;margin-top:10px;text-align:center;border-color:rgba(120,220,255,.35);background:linear-gradient(135deg,rgba(120,220,255,.10),rgba(255,209,102,.08))">
        <b>🕊️ First Flight complete</b>
        <p class="tiny muted" style="margin:3px 0 0">Your first fusion is hatched. Claim the reward in the Nest.</p>
      </div>` : ''}
      <p class="sub" style="text-align:center;margin-top:9px">${ELEMENTS[s.element].blurb}</p>
      <div class="row" style="gap:7px;margin-top:14px">
        <input id="hatch-name" maxlength="16" value="${esc(s.name || '')}" placeholder="Name your sprite" style="flex:1;min-width:0;padding:12px 14px;border-radius:13px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--text);outline:none;font-size:14px;font-weight:800">
        <button class="icon-btn" data-reroll aria-label="Random name" style="width:43px;height:43px;border-radius:13px">${icon('dice')}</button>
      </div>
      <button class="btn btn-gold btn-block" data-adopt style="margin-top:12px">Adopt ${esc(s.name || 'sprite')}</button>
      <button class="btn btn-ghost btn-block" data-later style="margin-top:8px">Later</button>
    `;
    modal.querySelector('[data-later]').addEventListener('click', () => {
      close();
      if (opts.onDone) opts.onDone(s);
      else App.go('hollow');
    });
    modal.querySelector('[data-reroll]').addEventListener('click', () => {
      modal.querySelector('#hatch-name').value = makeName(s.element);
      Sfx.pop();
    });
    modal.querySelector('[data-adopt]').addEventListener('click', () => {
      const adopted = Actions.adoptHatch(s.id, modal.querySelector('#hatch-name').value);
      if (!adopted.ok) return;
      Sfx.win();
      close();
      toast(`${esc(displayName(adopted.sprite))} joined the Hollow!`, '🎉');
      if (opts.onDone) opts.onDone(adopted.sprite);
      else App.go('hollow');
    });
    const input = modal.querySelector('#hatch-name');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') modal.querySelector('[data-adopt]').click();
    });
  }

  render();
  return { close, overlay };
}
