/* The sick bay: a temperature sheet, a medicine mini game, and the clinic run.

   The Hollow screen's Health dock opens this sheet for the active sprite. The
   sheet reads the thermometer (no cost), pours a spoonful (the medicine game),
   or sends the sprite to the clinic (the doctor game). Both games end in one
   Actions call, so the game can be closed halfway without ever half-charging
   the player: nothing is spent until the run finishes. */

/* The Hollow's always-visible health chip: a normal temperature when well, the
   illness and reading when not. */
function healthChipText(sprite) {
  if (!sprite) return '🌡️ —';
  if (sprite.stage === 'egg') return '🌡️ Egg';
  const temp = tempText(Sickness.temperature(sprite));
  const info = Sickness.info(sprite);
  return info ? `${info.icon} ${temp} · Sick` : `🌡️ ${temp}`;
}

function sicknessThermoFill(temp) {
  /* 36°C reads empty-ish and 41°C reads full; the normal line sits ~30%. */
  const t = Math.max(36, Math.min(41, Number(temp) || 37));
  return Math.round(((t - 36) / 5) * 100);
}

/* The counters the simulation has been writing to the save all along — illnesses
   caught, illnesses cured, thermometers read, doses poured, clinics paid. They
   were never shown anywhere, which made a season of treating colds leave no mark
   the player could see. This is the one line that reads them. */
function sicknessRecordLine() {
  const stats = (typeof state !== 'undefined' && state.stats) || {};
  const count = (value) => Number(value) || 0;
  const caught = count(stats.colds);
  const cured = count(stats.cured);
  const readings = count(stats.temps);
  const doses = count(stats.medicines);
  const visits = count(stats.doctorVisits);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  if (!caught && !cured && !readings && !doses && !visits) {
    return 'No illnesses yet — the record here starts with the first sniffle.';
  }
  return `${plural(caught, 'illness', 'illnesses')} caught · ${cured} cured · `
    + `${plural(readings, 'reading', 'readings')} · ${plural(doses, 'dose', 'doses')} · `
    + `${plural(visits, 'clinic visit', 'clinic visits')}`;
}

/* The season explains the dice: winter fills the sick bay, summer empties it. */
function sicknessSeasonNote() {
  if (typeof seasonOf !== 'function' || typeof Sickness === 'undefined' || !Sickness.seasonRisk) return '';
  const season = seasonOf();
  const risk = Sickness.seasonRisk(season.key);
  const air = risk > 1.05 ? 'illnesses spread faster in this air' : risk < 0.95 ? 'the warm months are gentle on little noses' : 'a steady season for illness';
  return `${season.icon} ${season.name} — ${air}.`;
}

/* The dock is the only place that sees the whole Hollow, so it is where a
   spreading cold shows up before it reaches the sprite on screen. */
function sicknessSickBadge() {
  const sick = typeof Sickness !== 'undefined' && typeof Sickness.sickCount === 'function'
    ? Sickness.sickCount()
    : 0;
  return sick > 1 ? `${sick} sick` : '';
}

/* A cold in the Hollow is a cold going round: same air, same toys, same napping
   basket. Shown in the sheet so a second sniffle explains the sudden risk. */
function sicknessContagionNote(sprite) {
  if (typeof Sickness === 'undefined' || typeof Sickness.sickCount !== 'function') return '';
  const others = Sickness.sickCount(sprite && sprite.id);
  if (!others) return '';
  return `🤧 ${others} other sprite${others === 1 ? ' is' : 's are'} sick — illnesses spread in the Hollow. `
    + 'Sprites sent home stay out of it.';
}

function sicknessDosePips(s) {
  const done = Sickness.isSick(s) ? Math.min(SICKNESS_RULES.CURE_DOSES, Number(s.illness.doses) || 0) : SICKNESS_RULES.CURE_DOSES;
  return Array.from({ length: SICKNESS_RULES.CURE_DOSES }, (_, i) => (
    `<span class="dose-pip${i < done ? ' on' : ''}" aria-hidden="true">${i < done ? '💊' : '○'}</span>`
  )).join('');
}

function openSicknessSheet(id, opts = {}) {
  const s = findSprite(id || state.activeId);
  if (!s || s.stage === 'egg') {
    toast('Eggs do not catch illnesses — they are still waiting to hatch.', '🥚');
    return null;
  }
  const sheet = openSheet({
    key: 'sickness',
    title: `🩺 ${esc(displayName(s))} · health`,
    sub: 'Temperature, medicine and the clinic, all in one place.',
    body: '<div data-sick-body></div>',
    onMount: (overlay, close) => {
      const body = overlay.querySelector('[data-sick-body]');

      const paint = (flash) => {
        const sick = Sickness.isSick(s);
        const info = Sickness.info(s);
        const temp = Sickness.temperature(s);
        const reading = Sickness.reading(s);
        const pips = sicknessDosePips(s);
        const seasonNote = sicknessSeasonNote();
        const spreadNote = sicknessContagionNote(s);
        body.innerHTML = `
          <div class="sick-stage${sick ? ' is-sick' : ' is-well'}">
            <div class="sick-art">${spriteSVG(s, { expr: sick ? 'grump' : 'happy' })}</div>
            <div class="sick-copy">
              <b class="sick-illness">${sick ? `${info.icon} ${esc(info.name)}` : '🌿 Feeling fine'}</b>
              <p class="tiny muted">${sick ? esc(info.symptom) : 'Normal temperature, bright eyes, ready for anything.'}</p>
              <div class="sick-temp">
                <span class="sick-temp-value" data-sick-temp>${tempText(temp)}</span>
                <span class="chip sick-tone ${reading.tone}">${reading.label}</span>
                ${typeof PuffleWeight !== 'undefined' ? `<span class="chip" data-sick-weight>⚖️ ${PuffleWeight.forSprite(s).lb.toFixed(1)} lb</span>` : ''}
              </div>
            </div>
            <div class="thermo" aria-hidden="true">
              <span class="thermo-tube"><i class="thermo-fill ${reading.tone}" style="height:${sicknessThermoFill(temp)}%"></i></span>
              <span class="thermo-bulb ${reading.tone}"></span>
            </div>
          </div>
          <p class="tiny muted sick-record" data-sick-record>${esc(sicknessRecordLine())}</p>
          ${seasonNote ? `<p class="tiny muted sick-season" data-sick-season>${esc(seasonNote)}</p>` : ''}
          ${spreadNote ? `<p class="tiny muted sick-spread" data-sick-spread>${esc(spreadNote)}</p>` : ''}
          ${sick ? `<p class="tiny muted sick-blurb">${esc(info.blurb)}</p>
          <div class="sick-dose-row"><span class="tiny muted">Doses given</span><span class="sick-doses" data-sick-doses>${pips}</span>
            <span class="tiny muted">${Sickness.dosesLeft(s)} to go</span></div>` : ''}
          <div class="sick-actions">
            <button class="btn btn-soft" type="button" data-sick-read>🌡️ Read thermometer</button>
            <button class="btn btn-primary" type="button" data-sick-med${sick ? '' : ' disabled'}>
              💊 Spoonful <span class="tiny">· ${SICKNESS_RULES.MEDICINE_COST}🪙</span></button>
            <button class="btn btn-soft" type="button" data-sick-doc${sick ? '' : ' disabled'}>
              🩺 Clinic run <span class="tiny">· ${SICKNESS_RULES.DOCTOR_COST}🪙</span></button>
            <button class="btn btn-soft" type="button" data-sick-weigh>⚖️ Weigh on the clinic scale</button>
          </div>
          <p class="tiny muted sick-note" data-sick-note>${flash || (sick
            ? 'A spoonful lowers the fever a little; three doses or a clinic visit settle it. Resting at home also helps.'
            : 'Food and weather can make a sprite ill, especially when food, rest, joy or clean run low. Keep an eye on the needs strip.')}</p>`;
      };

      const refresh = () => {
        paint();
        if (typeof App !== 'undefined' && App.refresh) App.refresh();
      };

      body.addEventListener('click', (event) => {
        const read = event.target.closest('[data-sick-read]');
        if (read) {
          const result = Actions.checkTemperature(s.id);
          if (result.cooled) {
            paint(`Give the thermometer a moment — ${Math.ceil(result.cooldown / 1000)}s.`);
            return;
          }
          Sfx.pop();
          paint(result.sick
            ? `${tempText(result.temp)} — ${result.reading.label.toLowerCase()} (${result.info.name}). ${result.dosesLeft} dose${result.dosesLeft === 1 ? '' : 's'} to go.`
            : `${tempText(result.temp)} — normal. Nothing to treat.`);
          return;
        }
        if (event.target.closest('[data-sick-med]')) {
          close();
          openMedicineGame(s.id, { onDone: refresh });
          return;
        }
        if (event.target.closest('[data-sick-weigh]')) {
          close();
          openWeighGame(s.id, { onDone: () => openSicknessSheet(s.id) });
          return;
        }
        if (event.target.closest('[data-sick-doc]')) {
          close();
          openDoctorGame(s.id, { onDone: refresh });
        }
      });

      paint();
      if (opts.read) {
        const result = Actions.checkTemperature(s.id);
        if (result.ok && !result.cooled) {
          paint(result.sick
            ? `${tempText(result.temp)} — ${result.reading.label.toLowerCase()} (${result.info.name}).`
            : `${tempText(result.temp)} — normal. Nothing to treat.`);
        }
      }
    },
  });
  return sheet;
}

/* --------------------------------------------------------------- weigh game */
/* The clinic scale: put the sprite on one pan and slide the counterweight
   until the beam levels. The exact breed-weighted number is revealed only
   when it balances, so the scale is something to play with rather than a
   static stat. A Show exact button is there for anyone who would rather skip
   the balancing. */
function openWeighGame(id, opts = {}) {
  const s = findSprite(id);
  if (!s) {
    toast('That sprite is not in the Hollow right now.', '⚖️');
    if (opts.onDone) opts.onDone();
    return null;
  }
  const weight = PuffleWeight.forSprite(s);
  const range = PuffleWeight.range(s);
  /* A fixed 6 lb sweep leaves a Cloudlet in the first tenth of the slider.
     Half the sprite's weight either side keeps the counterweight useful at
     every size, with a small floor so the lightest pupa still has a range. */
  const span = Math.max(0.5, Math.min(3, weight.lb * 0.5));
  const min = Math.max(0, Math.round((weight.lb - span) * 10) / 10);
  const max = Math.round((weight.lb + span) * 10) / 10;
  const art = s.stage === 'egg'
    ? eggSVG(s, { progress: s.hatch })
    : spriteSVG(s, { expr: 'happy' });
  let placed = false;
  let announced = false;

  const modal = openModal({
    title: `⚖️ Weighing ${esc(displayName(s))}`,
    sub: 'Slide the counterweight until the beam levels.',
    dismissible: true,
    body: `
      <div class="weigh-scene" data-weigh-scene>
        <div class="weigh-beam" data-weigh-beam>
          <span class="weigh-pan weigh-pan--patient">
            <span class="weigh-patient-art" data-weigh-patient-art aria-hidden="true">🐾</span>
            <small>patient</small>
          </span>
          <span class="weigh-pivot" aria-hidden="true"></span>
          <span class="weigh-pan weigh-pan--weights">
            <b data-weigh-mass>${min.toFixed(1)}</b>
            <small>lb</small>
          </span>
        </div>
        <span class="weigh-stand" aria-hidden="true"><i></i></span>
        <span class="weigh-base" aria-hidden="true"></span>
      </div>
      <div class="weigh-readout" data-weigh-readout aria-live="polite">—</div>
      <p class="weigh-status" data-weigh-status>Lift ${esc(displayName(s))} onto the patient pan.</p>
      <label class="weigh-slider-label" for="weigh-counterweight">Counterweight <b data-weigh-counter>${min.toFixed(1)} lb</b></label>
      <input id="weigh-counterweight" class="weigh-slider" data-weigh-slider type="range" min="${min}" max="${max}" step="0.1" value="${min}" disabled>
      <p class="tiny muted weigh-hint" data-weigh-hint>${esc(weight.breedName)} · ${esc(weight.stageName)} · ${esc(weight.sizeName)}. Usually ${range.low.toFixed(1)}–${range.high.toFixed(1)} lb.</p>
      <div class="actions">
        <button class="btn btn-primary" type="button" data-weigh-place>⬆️ Put on scale</button>
        <button class="btn btn-soft" type="button" data-weigh-reveal>Show exact</button>
      </div>
      <button class="btn btn-primary btn-block" data-weigh-done style="margin-top:10px">Back to health</button>`,
    onMount: (overlay) => {
      const beam = overlay.querySelector('[data-weigh-beam]');
      const patientArt = overlay.querySelector('[data-weigh-patient-art]');
      const mass = overlay.querySelector('[data-weigh-mass]');
      const counter = overlay.querySelector('[data-weigh-counter]');
      const slider = overlay.querySelector('[data-weigh-slider]');
      const readout = overlay.querySelector('[data-weigh-readout]');
      const status = overlay.querySelector('[data-weigh-status]');
      const place = overlay.querySelector('[data-weigh-place]');

      const update = () => {
        const value = Number(slider.value) || 0;
        const diff = weight.lb - value;
        mass.textContent = value.toFixed(1);
        counter.textContent = `${value.toFixed(1)} lb`;
        beam.style.transform = `rotate(${Math.max(-9, Math.min(9, diff * 2.4)).toFixed(1)}deg)`;
        if (!placed) {
          readout.textContent = '—';
          status.textContent = `Lift ${displayName(s)} onto the patient pan.`;
          return;
        }
        if (Math.abs(diff) <= 0.15) {
          readout.textContent = `${weight.lb.toFixed(1)} lb`;
          readout.classList.add('is-balanced');
          status.textContent = `${displayName(s)} weighs ${weight.lb.toFixed(1)} lb (${weight.kg.toFixed(1)} kg). Balanced!`;
          if (!announced) {
            announced = true;
            Sfx.chime();
            if (typeof burstOn === 'function') burstOn(readout, ['⚖️', '✨', '💛'], 7);
          }
        } else {
          readout.textContent = '—';
          readout.classList.remove('is-balanced');
          status.textContent = diff > 0
            ? 'The patient pan is heavier — slide the counterweight up.'
            : 'The counterweight is heavier — slide it back down.';
        }
      };

      const putOnScale = () => {
        if (placed) return;
        placed = true;
        place.disabled = true;
        slider.disabled = false;
        patientArt.classList.add('is-on-scale');
        patientArt.innerHTML = art;
        Sfx.pop();
        update();
      };

      place.addEventListener('click', putOnScale);
      overlay.querySelector('[data-weigh-reveal]').addEventListener('click', () => {
        putOnScale();
        slider.value = weight.lb.toFixed(1);
        update();
      });
      slider.addEventListener('input', update);
      overlay.querySelector('[data-weigh-done]').addEventListener('click', () => {
        modal.close();
        if (opts.onDone) opts.onDone();
      });
      update();
    },
  });
  return modal.close;
}

/* ---------------------------------------------------------------- medicine */
/* Three pours, each one a tap timed inside the green band. The band drifts a
   little each round, so a run is never a metronome. Every pour that lands
   spends a dose on its own, which means quitting after one still counted. */
function openMedicineGame(id, opts = {}) {
  const s = findSprite(id);
  if (!s || !Sickness.isSick(s)) {
    toast('Nobody needs medicine right now.', '💊');
    if (opts.onDone) opts.onDone();
    return null;
  }
  const info = Sickness.info(s);
  const total = SICKNESS_RULES.CURE_DOSES;
  let poured = 0;
  let spent = 0;
  let gainedXp = 0;
  let gainedBond = 0;
  let finished = false;

  const modal = openModal({
    title: `A spoonful for ${esc(displayName(s))}`,
    sub: 'Tap when the syrup crosses the green band. Three spoonfuls settle a fever.',
    dismissible: true,
    body: `
      <div class="med-patient"><div class="med-patient-art">${spriteSVG(s, { expr: 'grump' })}</div>
        <div><b>${esc(info.name)}</b><div class="tiny muted" data-med-temp>${tempText(Sickness.temperature(s))}</div></div>
        <span class="med-pours" data-med-pours>0 / ${total}</span></div>
      <div class="med-stage">
        <span class="med-bottle" aria-hidden="true">🧪</span>
        <div class="med-gauge" data-med-gauge>
          <span class="med-band" data-med-band></span>
          <span class="med-marker" data-med-marker></span>
        </div>
        <button class="med-tap" type="button" data-med-tap aria-label="Stop the pour">💧</button>
      </div>
      <div class="hatch-hint" data-med-hint>0 / ${total} spoonfuls · ${SICKNESS_RULES.MEDICINE_COST}🪙 each</div>`,
    onMount: (overlay) => {
      const gauge = overlay.querySelector('[data-med-gauge]');
      const band = overlay.querySelector('[data-med-band]');
      const marker = overlay.querySelector('[data-med-marker]');
      const hint = overlay.querySelector('[data-med-hint]');
      const poursEl = overlay.querySelector('[data-med-pours]');
      const tempEl = overlay.querySelector('[data-med-temp]');
      const tap = overlay.querySelector('[data-med-tap]');

      /* Each round shifts the band and speeds the marker up a touch. The band
         only sits where the marker's own sweep can land, so no strip of the
         green zone is a dead tap. Two definitions, one each side: the CSS
         variables name the sweep, this reads them. */
      const retarget = () => {
        /* clientHeight, not getBoundingClientRect: the modal is still scaling
           in when the game mounts, and a transformed box measures short. */
        const height = gauge.clientHeight;
        const css = getComputedStyle(gauge);
        const sweepStart = (parseFloat(css.getPropertyValue('--med-sweep-start')) || 6) / 100;
        const sweepEnd = (parseFloat(css.getPropertyValue('--med-sweep-end')) || 88) / 100;
        const markerH = marker.offsetHeight || 10;
        const bandH = Math.max(46, Math.round(height * (poured === 0 ? 0.3 : 0.24)));
        const minTop = height * sweepStart + markerH / 2 + 2;
        const maxTop = height * sweepEnd + markerH / 2 - bandH - 2;
        const top = minTop + Math.random() * Math.max(0, maxTop - minTop);
        band.style.height = `${bandH}px`;
        band.style.top = `${top}px`;
        marker.style.animationDuration = `${Math.max(0.9, 1.7 - poured * 0.18).toFixed(2)}s`;
      };

      retarget();

      tap.addEventListener('click', () => {
        if (finished) return;
        const bandRect = band.getBoundingClientRect();
        const markRect = marker.getBoundingClientRect();
        const centre = markRect.top + markRect.height / 2;
        const inside = centre >= bandRect.top && centre <= bandRect.bottom;
        const near = Math.abs(centre - (bandRect.top + bandRect.bottom) / 2) < bandRect.height;
        const pour = inside ? 1 : near ? 0.6 : 0.25;
        const result = Actions.medicine(s.id, pour);
        if (!result.ok) {
          finished = true;
          hint.textContent = result.reason === 'coins'
            ? `Not enough coins for another spoonful (${SICKNESS_RULES.MEDICINE_COST}🪙).`
            : 'The dose did not go down this time.';
          Sfx.error();
          return;
        }
        spent += result.cost;
        gainedXp += Number(result.xp) || 0;
        gainedBond += Number(result.bond) || 0;
        poured += 1;
        tempEl.textContent = tempText(result.temp);
        poursEl.textContent = `${poured} / ${total}`;
        hint.textContent = inside ? 'Perfect spoonful!' : near ? 'Mostly in — a little dribbled.' : 'That went everywhere. Try again.';
        if (poured >= total || result.cured) finishRun(result);
        else retarget();
      });

      const finishRun = (last) => {
        if (finished) return;
        finished = true;
        tap.disabled = true;
        const body = overlay.querySelector('.modal-body');
        body.innerHTML = `<div class="gift-reward" style="text-align:center">
          <div class="gr-emoji">${last.cured ? '🌈' : '💊'}</div>
          <h3>${last.cured ? 'All better!' : 'Fever coming down'}</h3>
          <p class="muted small">${last.cured
            ? `${esc(displayName(s))} is back to a normal temperature.`
            : `${esc(displayName(s))} is at ${tempText(last.temp)} — ${last.dosesLeft} more dose${last.dosesLeft === 1 ? '' : 's'} or a clinic visit.`}</p>
          <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap;margin-top:10px">
            <span class="chip">💊 ${poured} dose${poured === 1 ? '' : 's'}</span>
            <span class="chip">🪙 -${spent}</span>
            <span class="chip">⭐ +${gainedXp} XP</span>
            <span class="chip">💗 +${gainedBond.toFixed(1)}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block" data-med-done style="margin-top:12px">Tuck them in</button>`;
        body.querySelector('[data-med-done]').addEventListener('click', () => {
          modal.close();
          if (opts.onDone) opts.onDone();
        });
        Sfx.chime();
      };

      /* A quick tap on the bottle also counts, so a small phone has two ways. */
      overlay.querySelector('.med-bottle').addEventListener('click', () => tap.click());
    },
  });
  return modal.close;
}

/* ------------------------------------------------------------------ clinic */
/* The sprite walks to the clinic, then three treatment rounds. Every round
   offers the illness's own remedies plus two decoys; a wrong pick is a stumble,
   not a failure. The visit is charged once, when the run ends. */
function shuffled(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function openDoctorGame(id, opts = {}) {
  const s = findSprite(id);
  if (!s || !Sickness.isSick(s)) {
    toast('Nobody needs the clinic right now.', '🩺');
    if (opts.onDone) opts.onDone();
    return null;
  }
  const info = Sickness.info(s);
  const steps = 5;
  const rounds = 3;
  let walked = 0;
  let round = 0;
  let right = 0;
  let finished = false;
  let pending = null;

  /* One timer at a time (the walk, then each treatment's settle). Closing the
     sheet cancels it, so a treatment still resolving can never land a charged
     visit after the player has walked away. */
  const later = (fn, ms) => {
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => { pending = null; fn(); }, ms);
  };

  const modal = openModal({
    title: `Clinic run with ${esc(displayName(s))}`,
    sub: 'Walk them over, then help the doctor with three treatments.',
    dismissible: true,
    body: '<div data-clinic-body></div>',
    onClose: () => {
      finished = true;
      if (pending) clearTimeout(pending);
      pending = null;
    },
    onMount: (overlay) => {
      const body = overlay.querySelector('[data-clinic-body]');

      const travel = () => {
        body.innerHTML = `
          <div class="clinic-stage">
            <div class="clinic-sky"></div>
            <div class="clinic-track" data-clinic-track>
              ${Array.from({ length: steps }, (_, i) => `<span class="clinic-paw" data-clinic-paw="${i}" aria-hidden="true">🐾</span>`).join('')}
              <span class="clinic-runner" data-clinic-runner>${spriteSVG(s, { expr: 'sad' })}</span>
              <span class="clinic-door" aria-hidden="true">🏥</span>
            </div>
            <div class="clinic-progress"><i data-clinic-bar style="width:0%"></i></div>
          </div>
          <div class="hatch-hint" data-clinic-hint>Tap the paws to walk — 0 / ${steps}</div>
          <button class="btn btn-primary btn-block" data-clinic-walk style="margin-top:10px">Take a step</button>`;
        const runner = body.querySelector('[data-clinic-runner]');
        const bar = body.querySelector('[data-clinic-bar]');
        const hint = body.querySelector('[data-clinic-hint]');
        const walk = body.querySelector('[data-clinic-walk]');
        const step = () => {
          if (finished || walked >= steps) return;
          walked += 1;
          const progress = walked / steps;
          /* Ends on the last paw rather than past it, which used to put the
             sprite over the clinic door on a 320px phone. */
          runner.style.left = `${6 + progress * 50}%`;
          bar.style.width = `${progress * 100}%`;
          const paw = body.querySelector(`[data-clinic-paw="${walked - 1}"]`);
          if (paw) paw.classList.add('lit');
          hint.textContent = walked >= steps
            ? 'Made it to the clinic!'
            : `Tap the paws to walk — ${walked} / ${steps}`;
          Sfx.click();
          if (walked >= steps) later(treat, 260);
        };
        walk.addEventListener('click', step);
        body.querySelectorAll('[data-clinic-paw]').forEach((paw) => paw.addEventListener('click', step));
        return step;
      };

      const treat = () => {
        if (finished) return;
        if (round >= rounds) return result();
        const correct = info.remedies[round % info.remedies.length];
        const options = shuffled([correct, ...shuffled(info.decoys).slice(0, 2)]);
        body.innerHTML = `
          <div class="clinic-stage clinic-room">
            <div class="clinic-doctor" aria-hidden="true">🩺</div>
            <div class="clinic-patient">${spriteSVG(s, { expr: 'grump' })}</div>
          </div>
          <p class="clinic-prompt"><b>Treatment ${round + 1} of ${rounds}:</b> ${esc(info.symptom)}. What helps?</p>
          <div class="clinic-options">${options.map((label) => `
            <button class="clinic-option" type="button" data-clinic-option="${esc(label)}">${esc(label)}</button>`).join('')}</div>
          <div class="clinic-hearts" data-clinic-hearts>${Array.from({ length: rounds }, (_, i) => (i < right ? '💗' : '🤍')).join('')}</div>`;
        body.querySelectorAll('[data-clinic-option]').forEach((button) => {
          button.addEventListener('click', () => {
            if (finished) return;
            const good = button.dataset.clinicOption === correct;
            if (good) {
              right += 1;
              button.classList.add('good');
              Sfx.pop();
            } else {
              button.classList.add('bad');
              Sfx.error();
            }
            round += 1;
            later(() => { if (!finished) treat(); }, good ? 380 : 620);
          });
        });
      };

      const result = () => {
        if (finished) return;
        finished = true;
        const quality = right / rounds;
        const visit = Actions.doctorVisit(s.id, quality);
        if (!visit.ok) {
          body.innerHTML = `<div class="gift-reward" style="text-align:center">
            <div class="gr-emoji">🩺</div><h3>${visit.reason === 'cooled' ? 'The clinic needs a moment' : 'The clinic could not take the visit'}</h3>
            <p class="muted small">${visit.reason === 'coins'
              ? `A visit costs ${SICKNESS_RULES.DOCTOR_COST}🪙 and the Hollow has ${state.coins}🪙.`
              : visit.reason === 'cooled'
                ? `The doctor is still with them — try again in ${Math.max(1, Math.ceil((visit.cooldown || 0) / 1000))}s.`
                : 'They are already feeling better.'}</p>
            <button class="btn btn-primary btn-block" data-clinic-done style="margin-top:12px">Home again</button></div>`;
        } else {
          body.innerHTML = `<div class="gift-reward" style="text-align:center">
            <div class="gr-emoji">🌈</div>
            <h3>Home and healthy</h3>
            <p class="muted small">${esc(displayName(s))} was treated for ${esc(visit.info.name)} and walked home with a normal temperature.</p>
            <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap;margin-top:10px">
              <span class="chip">🩺 ${right} / ${rounds} treatments</span>
              <span class="chip">🪙 -${visit.cost}</span>
              <span class="chip">⭐ +${visit.xp} XP</span>
              <span class="chip">💗 +${visit.bond}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" data-clinic-done style="margin-top:12px">Tuck them in</button>`;
        }
        body.querySelector('[data-clinic-done]').addEventListener('click', () => {
          modal.close();
          if (opts.onDone) opts.onDone();
        });
        if (visit.ok) Sfx.chime();
      };

      travel();
    },
  });
  return modal.close;
}

/* The page tests read these from the window; the sheet and games are otherwise
   reached through the Hollow screen's Health dock. */
if (typeof window !== 'undefined') {
  window.HealthCare = { openSicknessSheet, openMedicineGame, openDoctorGame, openWeighGame };
}
