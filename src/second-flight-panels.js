/* Second Flight: one inline card in the Hollow.

   No sheet and no modal: the path picker is part of the card, a chosen path
   shows one next action, and the whole thing can be put away with one tap. The
   card repaints from the save like the First Flight card does. */

function secondFlightPanelProgress() {
  /* The same tour gate as the First Flight card, so a replay cannot sit under
     the Second Flight card either. */
  if (onboardingTourBlocks()) return null;
  return typeof SecondFlight !== 'undefined' ? SecondFlight.progressFromSave(state) : null;
}

function secondFlightPickerHTML(progress) {
  return `<div class="flight-card">
    <div class="between">
      <span class="flight-eyebrow">🕊️ Second flight</span>
      <button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:10px" data-flight2-dismiss>Not now</button>
    </div>
    <b class="flight-title">What next?</b>
    <p class="flight-blurb">Pick how you want to play. The Hollow will show one next action for that path.</p>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:2px">
      ${progress.paths.map((path) => `<button class="btn btn-soft btn-sm" data-flight2-pick="${esc(path.id)}" title="${esc(path.blurb)}">${path.icon} ${esc(path.title)}</button>`).join('')}
    </div>
  </div>`;
}

function secondFlightActionHTML(progress) {
  const action = progress.action;
  return `<div class="flight-card">
    <div class="between">
      <span class="flight-eyebrow">🕊️ Second flight · ${progress.path.icon} ${esc(progress.path.title)}</span>
      <button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:10px" data-flight2-dismiss>Not now</button>
    </div>
    <b class="flight-title">${esc(action.title)}</b>
    <p class="flight-blurb">${esc(action.blurb)}</p>
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:2px">
      <button class="btn btn-primary btn-sm" data-flight2-go>${esc(action.cta)}</button>
      <button class="btn btn-ghost btn-sm" data-flight2-change>Change path</button>
    </div>
  </div>`;
}

function goToSecondFlightAction(action) {
  if (!action) return;
  if (action.target === 'studio' && typeof App.openStudio === 'function') {
    App.openStudio();
    return;
  }
  App.go(action.target);
}

/* Mounts into a [data-flight2-card] host. Listeners are delegated once, so a
   repaint never stacks handlers on the buttons. */
function mountSecondFlightCard(root) {
  const host = root ? root.querySelector('[data-flight2-card]') : null;
  if (!host) return () => {};

  const paint = () => {
    const progress = secondFlightPanelProgress();
    const show = !!progress && progress.visible;
    host.innerHTML = !show ? '' : progress.picked ? secondFlightActionHTML(progress) : secondFlightPickerHTML(progress);
  };

  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const pick = target.closest('[data-flight2-pick]');
    if (pick) {
      Sfx.click();
      Actions.flight2Pick(pick.dataset.flight2Pick);
      return;
    }
    if (target.closest('[data-flight2-change]')) {
      Sfx.click();
      Actions.flight2Clear();
      return;
    }
    if (target.closest('[data-flight2-go]')) {
      Sfx.click();
      goToSecondFlightAction(secondFlightPanelProgress()?.action);
      return;
    }
    if (target.closest('[data-flight2-dismiss]')) {
      const progress = secondFlightPanelProgress();
      if (!progress || !Actions.flight2Dismiss().ok) return;
      toast('Second flight put away. It stays off until you ask for it.', '🕊️');
      App.refresh();
    }
  };

  host.addEventListener('click', onClick);
  paint();
  const unsubscribe = subscribeState(paint);
  const onTourVisibility = () => paint();
  if (typeof document !== 'undefined') document.addEventListener('tour-visibility', onTourVisibility);

  return () => {
    host.removeEventListener('click', onClick);
    unsubscribe();
    if (typeof document !== 'undefined') document.removeEventListener('tour-visibility', onTourVisibility);
  };
}
