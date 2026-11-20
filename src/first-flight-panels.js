/* First Flight: the guided first-session card and sheet.

   Progress is derived by src/first-flight.js from the save; this file renders
   it, reveals one step at a time, and routes into the screen that completes
   the current step. The card lives in the Hollow, and the Nest reuses it in
   completion-only mode after the first fusion. */

function flightPanelProgress() {
  /* The induction tour owns the first-session screen. onboardingTourBlocks()
     covers both an unseen tour and a replayed tour whose sheet is open. */
  if (onboardingTourBlocks()) return null;
  return typeof FirstFlight !== 'undefined' ? FirstFlight.progressFromSave(state) : null;
}

function flightDotsHTML(progress) {
  return progress.steps.map((step) => {
    const cls = step.done ? 'is-done' : progress.next && step.id === progress.next.id ? 'is-now' : '';
    return `<i class="${cls}" title="${esc(step.title)}"></i>`;
  }).join('');
}

function flightRailHTML(progress) {
  const current = progress.done ? progress.total : Math.min(progress.nextIndex + 1, progress.total);
  return `<div class="flight-rail" role="img" aria-label="Step ${current} of ${progress.total}">${flightDotsHTML(progress)}</div>`;
}

function flightPairHintHTML() {
  const pair = typeof FirstFlight !== 'undefined' && typeof FirstFlight.pairProgress === 'function'
    ? FirstFlight.pairProgress(state)
    : [];
  if (!pair.length) return '';
  return `<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:7px">${pair.map((s) => {
    const name = s.name || (ELEMENTS[s.element] && ELEMENTS[s.element].name) || 'Sprite';
    return `<span class="chip">${esc(name)} Lv ${s.level}</span>`;
  }).join('')}</div>`;
}

function flightCardBodyHTML(progress) {
  const next = progress.next;
  const complete = !next;
  const reward = progress.reward;
  return `<div class="flight-card${complete ? ' is-complete' : ''}">
    <div class="between">
      <span class="flight-eyebrow">🕊️ First flight</span>
      <span class="flight-count">${complete ? progress.total : progress.completed}/${progress.total}</span>
    </div>
    <b class="flight-title">${complete ? 'First Flight complete' : esc(next.title)}</b>
    <p class="flight-blurb">${complete ? `Claim ${reward.coins} coins${reward.snacks ? ' and a snack' : ''} for your first fusion.` : esc(next.blurb)}</p>
    ${!complete && next.id === 'level_pair' ? flightPairHintHTML() : ''}
    ${flightRailHTML(progress)}
    <div class="row" style="gap:8px;margin-top:10px">
      ${complete
        ? `<button class="btn btn-primary btn-sm" data-flight-claim-card>Claim ${reward.coins} coins</button>`
        : `<button class="btn btn-primary btn-sm" data-flight-go="${esc(next.target)}">${esc(next.cta)}</button>`}
      <button class="btn btn-ghost btn-sm" data-flight-sheet>Details</button>
    </div>
  </div>`;
}

function claimFlight(close) {
  const res = Actions.flightClaim();
  if (!res.ok) {
    toast(res.reason === 'claimed' ? 'Already claimed.' : 'Finish every step first.', '🕊️');
    return;
  }
  if (close) close();
  App.refresh();
}

function goToFlightStep(step, close) {
  if (!step) return;
  if (step.target === 'gift') {
    const res = Actions.flightGiftEgg();
    if (!res.ok) {
      toast(res.reason === 'claimed' ? 'Your gift egg is already in the Nest.' : 'The gift egg is not ready yet.', '🎁');
      return;
    }
    toast(res.egg.shiny ? '✨ Shiny gift egg added to the Nest.' : 'Gift egg added to the Nest.', res.egg.shiny ? '✨' : '🎁');
    if (close) close();
    App.go('nest');
    return;
  }
  if (step.target === 'hatch') {
    const fusionId = state.flight && state.flight.fusionId;
    if (close) close();
    if (fusionId && typeof App.openHatch === 'function') App.openHatch(fusionId);
    else App.go('nest');
    return;
  }
  if (close) close();
  App.go(step.target);
}

/* Mounts into a [data-flight-card] host and repaints on every state change, so
   hatching, claiming the gift, and leveling all advance the card in place. */
function mountFlightCard(root, { completionOnly = false } = {}) {
  const host = root ? root.querySelector('[data-flight-card]') : null;
  if (!host) return () => {};
  const paint = () => {
    const progress = flightPanelProgress();
    const show = !!progress && progress.visible && (!completionOnly || progress.done);
    host.innerHTML = show ? flightCardBodyHTML(progress) : '';
    if (!show) return;
    host.querySelector('[data-flight-sheet]')?.addEventListener('click', () => {
      Sfx.click();
      openFlightSheet();
    });
    host.querySelector('[data-flight-claim-card]')?.addEventListener('click', () => claimFlight());
    host.querySelector('[data-flight-go]')?.addEventListener('click', () => goToFlightStep(progress.next));
  };
  paint();
  const unsubscribe = subscribeState(paint);
  /* Opening or closing the tour does not always commit state (a replay leaves
     the save untouched), so the card follows the tour's own event. */
  const onTourVisibility = () => paint();
  if (typeof document !== 'undefined') document.addEventListener('tour-visibility', onTourVisibility);
  return () => {
    unsubscribe();
    if (typeof document !== 'undefined') document.removeEventListener('tour-visibility', onTourVisibility);
  };
}

function flightStepRowHTML(step, progress) {
  const isNext = progress.next && progress.next.id === step.id;
  return `<div class="flight-step ${step.done ? 'is-done' : ''} ${isNext ? 'is-now' : ''}">
    <div class="fs-mark">${step.done ? '✓' : step.index + 1}</div>
    <div class="fs-body">
      <b>${esc(step.title)}</b>
      <span>${esc(step.blurb)}</span>
      ${isNext && step.id === 'level_pair' ? flightPairHintHTML() : ''}
      ${isNext ? `<button class="btn ${step.target === 'gift' ? 'btn-primary' : 'btn-soft'} btn-sm" style="margin-top:7px"
        data-flight-step-go="${esc(step.id)}">${esc(step.cta)}</button>` : ''}
      ${step.done ? '<em>Done</em>' : ''}
    </div>
  </div>`;
}

function flightRewardHTML(progress) {
  const reward = progress.reward;
  return `<div class="flight-reward">
    <b>🕊️ First Flight complete</b>
    <p>${reward.coins} coins${reward.snacks ? ` and ${reward.snacks} snack` : ''} for your first fusion.</p>
    <button class="btn btn-primary" data-flight-claim>Claim ${reward.coins} coins</button>
  </div>`;
}

/* `guide` opens the same sheet from the induction tour, which runs after a
   replay too. A replay can no longer be eligible, so the guide shows every
   step and drops the skip/claim-only affordances instead of refusing to open. */
function openFlightSheet({ guide = false } = {}) {
  const progress = flightPanelProgress();
  if (!progress) return { close() {} };
  if (!progress.visible && !guide) return { close() {} };
  const revealed = guide ? progress.steps : FirstFlight.revealedSteps(progress);
  const locked = progress.steps.length - revealed.length;
  const body = `
    <div class="flight-head">
      <p class="flight-sub">${guide ? 'The guided first session, all seven steps. The Hollow card keeps your place.' : 'Your first session, one step at a time. Steps unlock as you finish them.'}</p>
      ${flightRailHTML(progress)}
    </div>
    <div class="flight-steps">${revealed.map((step) => flightStepRowHTML(step, progress)).join('')}</div>
    ${locked > 0 ? `<p class="flight-locked">${locked} more step${locked === 1 ? '' : 's'} unlock as you go.</p>` : ''}
    ${progress.done && progress.visible ? flightRewardHTML(progress) : ''}
    <div class="between" style="margin-top:12px">
      <div class="row" style="gap:6px;flex-wrap:wrap">
        ${guide ? '' : `<button class="btn btn-ghost btn-sm" data-flight-skip ${progress.done ? 'hidden' : ''}>Skip First Flight</button>
        <button class="btn btn-ghost btn-sm" data-flight-funnel>Funnel debug</button>`}
      </div>
      <span class="tiny muted">${progress.done ? 'Flight complete' : `Step ${Math.min(progress.nextIndex + 1, progress.steps.length)} of ${progress.steps.length}`}</span>
    </div>`;
  return openSheet({
    title: 'First Flight',
    sub: guide ? 'Every step, in one place' : progress.started ? `${progress.completed} of ${progress.total} steps done` : 'A short guided start',
    body,
    onMount: (root, close) => {
      root.querySelector('[data-flight-skip]')?.addEventListener('click', () => {
        const res = Actions.flightSkip();
        if (!res.ok) return;
        toast('First Flight hidden — the Hollow is yours.', '🕊️');
        close();
        App.refresh();
      });
      root.querySelector('[data-flight-funnel]')?.addEventListener('click', () => {
        close();
        openFirstFlightFunnel();
      });
      root.querySelector('[data-flight-claim]')?.addEventListener('click', () => claimFlight(close));
      root.querySelectorAll('[data-flight-step-go]').forEach((button) => {
        const step = revealed.find((entry) => entry.id === button.dataset.flightStepGo);
        button.addEventListener('click', () => goToFlightStep(step, close));
      });
    },
  });
}

function flightFunnelDuration(ms) {
  const value = Math.max(0, Number(ms) || 0);
  if (!value) return '—';
  if (value < 1000) return `${Math.round(value)} ms`;
  const seconds = Math.round(value / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`;
}

function flightFunnelRate(value) {
  return `${Math.round(Math.max(0, Number(value) || 0) * 100)}%`;
}

function flightFunnelWhen(at) {
  const when = Number(at) || 0;
  return when ? new Date(when).toLocaleString() : 'never';
}

/* A small, read-only view over the local ff_* event ring. The JSON export is
   the hand-off point; this panel never sends anything over the network. */
function openFirstFlightFunnel() {
  if (typeof FirstFlightFunnel === 'undefined') {
    toast('The First Flight funnel is not available in this build.', '⚠️');
    return { close() {} };
  }
  const sheet = openSheet({
    key: 'first-flight-funnel',
    title: '🕊️ First Flight funnel',
    sub: 'Local events only — nothing is uploaded.',
    body: '<div data-ff-funnel-body></div>',
    onMount: (overlay) => {
      const body = overlay.querySelector('[data-ff-funnel-body]');
      const paint = () => {
        const data = FirstFlightFunnel.snapshot();
        const aggregate = data.aggregate;
        const last = data.events.length ? data.events[data.events.length - 1] : null;
        const rows = aggregate.steps.map((step, index) => `
          <div class="health-row">
            <div class="health-row-main">
              <b>${index + 1}. ${esc(step.title)}</b>
              <span class="tiny muted">${step.count} reached${aggregate.starts ? ` · ${flightFunnelRate(step.count / aggregate.starts)}` : ''}</span>
            </div>
            <span class="chip">${flightFunnelDuration(step.avgMs)} avg</span>
          </div>`).join('');
        body.innerHTML = `
          <div class="health-stats">
            <div><b>${aggregate.starts}</b><span>starts</span></div>
            <div><b>${aggregate.skips}</b><span>skips</span></div>
            <div><b>${aggregate.claims}</b><span>claims</span></div>
            <div><b>${flightFunnelRate(aggregate.skipRate)}</b><span>skip rate</span></div>
          </div>
          <p class="tiny muted" style="margin:8px 2px 0;line-height:1.5">${data.events.length} local events${last ? ` · last ${esc(last.name)}${last.step ? ` (${esc(last.step)})` : ''} at ${flightFunnelWhen(last.at)}` : ''}.</p>
          <div class="section-title"><h2>Steps</h2><span>reached / average time</span></div>
          <div class="health-list">${rows}</div>
          <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:12px">
            <button class="btn btn-soft btn-sm" data-ff-copy>Copy JSON</button>
            <button class="btn btn-ghost btn-sm" data-ff-download>Download JSON</button>
          </div>
          <p class="tiny muted" style="margin:8px 2px 0;line-height:1.5">Events live in this browser only. Export the JSON to compare runs or inspect the raw ff_* sequence.</p>`;
      };

      body.addEventListener('click', (event) => {
        if (event.target.closest('[data-ff-copy]')) {
          const text = FirstFlightFunnel.exportJSON();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(
              () => toast('Funnel JSON copied.', '📋'),
              () => toast('Clipboard is unavailable. Use Download JSON.', '⚠️'),
            );
          } else {
            toast('Clipboard is unavailable. Use Download JSON.', '⚠️');
          }
          return;
        }
        if (event.target.closest('[data-ff-download]')) {
          try {
            const blob = new Blob([FirstFlightFunnel.exportJSON()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `sprite-hollow-first-flight-funnel-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast('Funnel JSON downloaded.', '📥');
          } catch (err) {
            toast('This device could not save the JSON file.', '⚠️');
          }
        }
      });
      paint();
    },
  });
  return sheet;
}
