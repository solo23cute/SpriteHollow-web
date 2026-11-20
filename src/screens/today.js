/* Today: check-ins, streaks, period goals, and the weekly reward track. */

function todayScreen(root) {
  ensureDaily();
  ensureQuests();
  ensureCheckinPeriods();
  let newFriendId = null;
  let lastDay = dayKey();

  root.innerHTML = `
    <div class="screen-head">
      <div><div class="eyebrow">Small habits, big sprites</div><h1>Today</h1><p data-today-date></p></div>
      <span class="chip">${icon('star')} <span data-streak-chip>0</span> day streak</span>
    </div>
    <div data-new-friend></div>
    <div data-reminders></div>
    <div data-checkin></div>
    <div data-week-track></div>
    <div data-weekly-event></div>
    <div data-egg-gift></div>
    <div data-weekend-event></div>
    <div data-random-quiz></div>
    <div data-holiday-card></div>
    <div class="section-title"><h2>Streaks</h2><span>daily · weekly · monthly · yearly</span></div>
    <div class="stat-tiles" data-streaks></div>
    <div data-long-game></div>
    <div class="section-title" style="margin-top:18px"><h2>Daily tasks</h2><span>resets at midnight</span></div>
    <div data-tasks-daily></div>
    <div class="section-title"><h2>Weekly goals</h2><span>resets Monday</span></div>
    <div data-tasks-weekly></div>
    <div class="section-title"><h2>Monthly quests</h2><span>slow and steady</span></div>
    <div data-tasks-monthly></div>
    <div class="section-title"><h2>Hollow stats</h2></div>
    <div class="stat-tiles" data-stats></div>
    <div class="card" style="padding:13px;margin-top:12px;font-size:11.5px;line-height:1.65;color:var(--muted)">
      <b style="color:var(--text)">How check-ins work</b><br>
      There are four check-in windows each day: morning, afternoon, evening, and night. Each one pays coins, and the first check-in of the day keeps your daily streak alive. Check in often enough in a week to earn snacks, a wild sprite, and a rare elderly sprite. Longer streaks unlock monthly and yearly rewards.
      <br><br><b style="color:var(--text)">Weekly events</b><br>
      Every day brings a different free event: Monday XP, Tuesday meals, Wednesday desserts, Thursday drinks, Friday free crates, Saturday unclaimed crates, and Sunday a grand feast. Claim each event once per week. The first Friday crate you open each month also brings a free Secret Vault sprite.
      <br><br><b style="color:var(--text)">Growing up</b><br>
      XP comes from petting, feeding, baths, chats, tasks and games. The age tiers are ${STAGE_ORDER.map((stage) => `${STAGE_LABELS[stage]} ${STAGE_LEVEL[stage]}`).join(', ')} — crossing one opens an evolution screen. Sensei is the final tier at level 1,000; retirement unlocks at Elderly level 100. At level 10, diet affinity or a World Kitchen cuisine can evolve a sprite into one of ${EVOLUTION_FORM_KEYS.length} permanent forms, including the ${CP_PUFFLE_TYPE_COUNT} classic Club Penguin puffle colours and ${CP_PUFFLE_CREATURE_COUNT} Puffle Creatures.
    </div>`;

  const dateEl = root.querySelector('[data-today-date]');
  dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  function milestoneRows(milestones, count, claims) {
    return milestones.map((m) => {
      const done = claims.includes(m.id);
      const near = !done && count >= m.n;
      return `<div class="milestone ${done ? 'done' : ''} ${near ? 'near' : ''}">
        <span class="ms-ico">${m.icon}</span>
        <span class="ms-main"><b>${m.label}</b><span>${m.n} check-ins</span></span>
        <span class="chip">${done ? '✓ claimed' : near ? 'auto next check-in' : `${count}/${m.n}`}</span>
      </div>`;
    }).join('');
  }

  function taskHTML(tasks, period) {
    return (tasks || []).map((t) => {
      const count = Math.min(periodCounter(t, period), t.goal);
      const complete = count >= t.goal;
      const claimed = t.claimed;
      return `<div class="task ${complete ? 'done' : ''} ${claimed ? 'claimed' : ''}">
        <span class="task-ico">${t.icon}</span>
        <span class="task-main">
          <h4>${taskLabel(t)}</h4>
          <span class="task-prog"><span class="bar"><i style="width:${(count / t.goal) * 100}%;background:${complete ? 'linear-gradient(90deg,#5ee0a0,#9affc4)' : 'linear-gradient(90deg,var(--accent),var(--accent-2))'}"></i></span><span>${count}/${t.goal}</span></span>
        </span>
        ${claimed
          ? '<span class="chip" style="color:var(--good)">✓ claimed</span>'
          : `<button class="btn btn-sm ${complete ? 'btn-gold' : 'btn-ghost'}" data-claim="${t.id}" data-period="${period}" ${complete ? '' : 'disabled'}>${icon('coin')} +${t.reward}</button>`}
      </div>`;
    }).join('');
  }

  /* A small type question about a sprite the player already owns. It is a
     standalone every-other-day event now, not a gate on the monthly secret. */
  function makeQuizQuestion() {
    const norm = (value) => String(value || '').trim().toLowerCase();
    const owned = (state.sprites || []).filter((sprite) => sprite.stage !== 'egg' && ELEMENTS[sprite.element]);
    /* A Vault sprite is named after its own type, so asking "What type is
       Hollow Guide?" answers itself. Only ask about sprites whose display
       name differs from the type name. */
    const askable = owned.filter((sprite) => norm(displayName(sprite)) !== norm(ELEMENTS[sprite.element].name));
    const subject = askable.length ? askable[Math.floor(Math.random() * askable.length)] : null;
    if (!subject) {
      toast(owned.length ? t('quiz.needNamedSprite') : t('quiz.needSprite'), '📦');
      return null;
    }
    const answer = typeLabel(subject.element);
    /* Three distinct type names, standard types first so the wrong answers
       still read as types rather than random species. The subject's own name
       is excluded too: a sprite called Ember must not sit beside an Ember
       type option while the answer is Ember Puffle. */
    const taken = new Set([norm(answer), norm(displayName(subject))]);
    const names = [answer];
    const baseKeys = ELEMENT_KEYS.slice(0, 18).filter((key) => key !== subject.element && ELEMENTS[key]);
    const restKeys = ELEMENT_KEYS.filter((key) => key !== subject.element && ELEMENTS[key] && !baseKeys.includes(key));
    for (const key of baseKeys.concat(restKeys)) {
      const name = typeLabel(key);
      if (!name || taken.has(norm(name))) continue;
      taken.add(norm(name));
      names.push(name);
      if (names.length >= 3) break;
    }
    return {
      answer,
      options: names.sort(() => Math.random() - 0.5),
      question: t('quiz.question', { name: displayName(subject) }),
    };
  }

  function openTypeQuiz() {
    const question = makeQuizQuestion();
    if (!question) return;
    const body = `<div class="monthly-quiz random-quiz">
      <p class="tiny muted" style="line-height:1.6">${esc(t('quiz.intro'))}</p>
      <b style="display:block;margin:10px 0 7px">${esc(question.question)}</b>
      <div class="row" style="gap:6px;flex-wrap:wrap" data-quiz-options>${question.options.map((name) => `<button class="btn btn-soft btn-sm" data-quiz-answer="${esc(name)}">${esc(name)}</button>`).join('')}</div>
      <div data-quiz-result style="margin-top:10px"></div>
    </div>`;
    const { overlay, close } = openSheet({ key: 'type-quiz', title: esc(t('quiz.title')), sub: esc(t('quiz.sub')), body });
    const panel = overlay.querySelector('.random-quiz');

    panel.addEventListener('click', (event) => {
      if (event.target.closest('[data-quiz-close]')) {
        close();
        return;
      }
      const option = event.target.closest('[data-quiz-answer]');
      if (!option) return;
      if (option.dataset.quizAnswer !== question.answer) {
        toast(t('quiz.wrong'), '📦');
        Sfx.error();
        return;
      }
      const result = panel.querySelector('[data-quiz-result]');
      panel.querySelector('[data-quiz-options]')?.remove();
      const saved = Actions.finishQuiz();
      if (!saved.ok) {
        toast(t('quiz.claimed'), '📦');
        close();
        paint();
        return;
      }
      Sfx.win();
      burstOn(option, ['✨', '🧠', '💛'], 9);
      result.innerHTML = `<p class="tiny" style="color:var(--good);margin-bottom:9px">${esc(t('quiz.correct', { answer: question.answer }))}</p>
        <button class="btn btn-gold btn-block" data-quiz-close>${esc(t('quiz.close'))}</button>`;
      paint();
    });
  }

  /* The first Friday crate opened each month carries one free Secret Vault
     sprite. Choosing it and opening the crate are one claim, so a stale sheet
     can never unlock a secret without consuming the Friday event. */
  function openFridaySecretCrate() {
    const norm = (value) => String(value || '').trim().toLowerCase();
    const locked = SECRET_SPECIES.filter((key) => !(state.secretUnlocks || []).includes(key));
    const body = `<div class="monthly-quiz friday-crate">
      <p class="tiny muted" style="line-height:1.6">${esc(t('friday.pickerIntro'))}</p>
      ${locked.length ? `
        <input class="type-search monthly-secret-filter" type="search" data-secret-filter placeholder="${esc(t('friday.filterPlaceholder'))}" aria-label="${esc(t('friday.filterPlaceholder'))}" autocomplete="off">
        <div class="tiny muted monthly-secret-count" data-secret-count>${esc(t('friday.lockedCount', { count: locked.length }))}</div>
        <div class="secret-picker" data-secret-picker>${locked.map((key) => `<button class="btn btn-soft btn-sm" data-secret-pick="${key}" title="${esc(SECRET_SPECIES_META[key]?.gene?.[0] || '')}">${esc(secretName(key))}</button>`).join('')}</div>
        <p class="tiny muted" data-secret-nomatch hidden>${esc(t('friday.noMatches'))}</p>
        <div data-secret-detail hidden></div>` : `
        <p class="tiny muted" style="margin-top:10px">${esc(t('friday.empty'))}</p>
        <button class="btn btn-gold btn-block" data-secret-pick="" style="margin-top:8px">${esc(t('friday.claimEmpty'))}</button>`}
    </div>`;
    const { overlay, close } = openSheet({ key: 'friday-crate', title: esc(t('friday.title')), sub: esc(t('friday.sub')), body });
    const panel = overlay.querySelector('.friday-crate');

    function claimSecret(key, source) {
      const res = Actions.claimFridayCrate(key);
      if (!res.ok) {
        toast(res.reason === 'claimed' ? t('friday.alreadyClaimed') : t('friday.secretUnavailable'), '📦');
        close();
        paint();
        return;
      }
      Sfx.win();
      burstOn(source || panel, ['📦', '🔐', '🪙'], 9);
      toast(res.secret
        ? t('friday.rewardSecret', { coins: res.coins, name: secretName(res.secret.element) })
        : t('friday.reward', { coins: res.coins }), '📦');
      paint();
      close();
    }

    function filterSecrets() {
      const input = panel.querySelector('[data-secret-filter]');
      const count = panel.querySelector('[data-secret-count]');
      const empty = panel.querySelector('[data-secret-nomatch]');
      const q = norm(input ? input.value : '');
      let shown = 0;
      panel.querySelectorAll('[data-secret-pick]').forEach((button) => {
        const key = button.dataset.secretPick;
        if (!key) return;
        const meta = SECRET_SPECIES_META[key] || {};
        const hay = [meta.name, secretName(key), key, meta.title, meta.trait, meta.clue, meta.gene?.[0], meta.gene?.[2]].join(' ');
        const match = !q || norm(hay).includes(q);
        button.hidden = !match;
        if (match) shown += 1;
      });
      if (count) {
        count.textContent = q
          ? t('friday.matches', { shown, count: locked.length })
          : t('friday.lockedCount', { count: locked.length });
      }
      if (empty) empty.hidden = shown > 0;
    }

    function showSecretList() {
      const list = panel.querySelector('[data-secret-list]');
      const detail = panel.querySelector('[data-secret-detail]');
      if (list) list.hidden = false;
      if (detail) {
        detail.hidden = true;
        detail.innerHTML = '';
      }
      panel.querySelector('[data-secret-filter]')?.focus();
    }

    function showSecretPreview(key) {
      const meta = SECRET_SPECIES_META[key] || {};
      const gene = Array.isArray(meta.gene) ? meta.gene : [];
      const list = panel.querySelector('[data-secret-list]');
      const detail = panel.querySelector('[data-secret-detail]');
      if (!detail) return;
      if (list) list.hidden = true;
      let art = '<span class="secret-preview-emoji">🔐</span>';
      try {
        if (typeof spriteSVG === 'function') {
          art = spriteSVG({ element: key, stage: 'adult', level: 24, joy: 80 }, { expr: 'happy' });
        }
      } catch (err) { /* keep the lock fallback */ }
      detail.hidden = false;
      detail.innerHTML = `<div class="secret-preview" data-secret-preview>
        <div class="secret-preview-art">${art}</div>
        <div class="secret-preview-copy">
          <h4>${esc(secretName(key))}</h4>
          ${meta.title ? `<p class="secret-preview-title tiny muted">${esc(meta.title)}</p>` : ''}
          ${meta.trait ? `<p class="secret-preview-trait">${esc(meta.trait)}</p>` : ''}
          ${gene.length ? `<div class="secret-gene"><span class="secret-gene-icon">${esc(gene[1] || '✦')}</span><span><b>${esc(gene[0] || '')}</b><span>${esc(gene[2] || '')}</span></span></div>` : ''}
          <div class="secret-preview-actions">
            <button class="btn btn-gold btn-sm" data-secret-confirm="${esc(key)}">${esc(t('friday.claimSecret', { name: secretName(key) }))}</button>
            <button class="btn btn-ghost btn-sm" data-secret-back>${esc(t('friday.chooseAnother'))}</button>
          </div>
        </div>
      </div>`;
      detail.querySelector('.secret-preview')?.scrollIntoView({ block: 'nearest' });
    }

    panel.addEventListener('click', (event) => {
      const pickSecret = event.target.closest('[data-secret-pick]');
      const confirmSecret = event.target.closest('[data-secret-confirm]');
      const backSecret = event.target.closest('[data-secret-back]');
      if (confirmSecret) {
        claimSecret(confirmSecret.dataset.secretConfirm, confirmSecret);
        return;
      }
      if (backSecret) {
        showSecretList();
        return;
      }
      if (!pickSecret) return;
      const key = pickSecret.dataset.secretPick;
      if (!key) {
        claimSecret('', pickSecret);
        return;
      }
      showSecretPreview(key);
    });

    panel.querySelector('[data-secret-filter]')?.addEventListener('input', filterSecrets);
  }

  function paint() {
    ensureDaily();
    ensureQuests();
    ensureCheckinPeriods();
    ensureWeeklyEvents();
    const c = state.checkin;
    const streak = c.streak || 0;
    const slots = c.slots || [];
    const win = currentCheckinSlot();
    const doneToday = slots.length >= CHECKIN_WINDOWS.length;
    const activePony = activeSprite();
    const ponyBonus = activePony ? (spriteEffects(activePony).checkinCoins || 0) : 0;
    const preview = (slots.length === 0 ? 20 + Math.min(streak, 7) * 5 : 8 + Math.min(streak, 7) * 2) + ponyBonus;
    const nextWin = CHECKIN_WINDOWS[(CHECKIN_WINDOWS.findIndex((w) => w.id === win.id) + 1) % CHECKIN_WINDOWS.length];
    const snackCountText = snackTotal() ? `${snackTotal()} snack${snackTotal() === 1 ? '' : 's'} in the pantry` : 'no pantry snacks yet';

    root.querySelector('[data-streak-chip]').textContent = streak;

    const friend = newFriendId ? findSprite(newFriendId) : null;
    root.querySelector('[data-new-friend]').innerHTML = friend ? `<button class="rowcard new-friend-card" data-meet-sprite="${friend.id}">
      <span class="rc-art">${spriteSVG(friend, { expr: 'happy' })}</span>
      <span style="flex:1;min-width:0;text-align:left">
        <b style="font-size:12.5px">New friend: ${esc(displayName(friend))}</b><br>
        <span class="tiny muted">${formName(friend) || typeName(friend)} · ${SIZES[friend.size]?.name || 'Standard'} · ${stageLabel(friend)}</span>
      </span>
      <span class="go">${icon('chevron')}</span>
    </button>` : '';

    root.querySelector('[data-checkin]').innerHTML = `
      <div class="checkin-card">
        <div class="between" style="align-items:flex-start">
          <div><h2>${doneToday ? 'All checked in ✓' : 'Check in'}</h2>
            <p>${doneToday ? 'Four windows claimed. The next set opens at midnight.' : `${win.label} window · ${win.claimed ? `come back in the ${nextWin.label.toLowerCase()} for another` : 'one check-in available now'}`}</p>
          </div>
          <span class="chip">${win.icon} ${win.label}</span>
        </div>
        <div class="checkin-slots">
          ${CHECKIN_WINDOWS.map((w) => `<span class="checkin-slot ${slots.includes(w.id) ? 'done' : ''} ${w.id === win.id && !slots.includes(w.id) ? 'current' : ''}">
            <i>${w.icon}</i><b>${w.label}</b><span>${slots.includes(w.id) ? '✓' : w.id === win.id ? 'open' : 'later'}</span>
          </span>`).join('')}
        </div>
        <div class="streak-dots">${Array.from({ length: 7 }, (_, i) => `<i class="${i < Math.min(streak, 7) ? 'on' : ''}"></i>`).join('')}</div>
        <button class="btn ${win.claimed ? 'btn-ghost' : 'btn-gold'} btn-block" data-checkin ${win.claimed ? 'disabled' : ''} style="margin-top:12px">
          ${win.claimed ? `Next window: ${nextWin.label} ${nextWin.icon}` : `Check in · +${preview} coins${ponyBonus ? ` · pony +${ponyBonus}` : ''}`}
        </button>
        <div class="tiny muted" style="text-align:center;margin-top:7px">${win.claimed ? `Streak ${streak} days · ${snackCountText}` : `45% chance of a pantry snack · ${snackCountText}`}</div>
      </div>`;

    /* One list for everything still owed today: the open check-in window and
       every awake sprite that has dropped below a comfortable need. */
    const careWords = { hunger: 'is hungry', energy: 'is sleepy', joy: 'is bored', clean: 'is grubby' };
    const needy = grownSprites()
      .filter((s) => s && !s.asleep && s.needs)
      .map((s) => {
        const low = typeof Voice !== 'undefined' && Voice.lowestNeed ? Voice.lowestNeed(s) : null;
        return low && low.value < 30 ? { s, low } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.low.value - b.low.value);
    const reminderRows = [];
    if (!win.claimed) {
      reminderRows.push(`<button class="reminder-row" data-reminder-checkin>
        <span class="reminder-ico">${win.icon}</span>
        <span class="reminder-main"><b>Check in now</b><span>${win.label} window · +${preview} coins</span></span>
        <span class="go">${icon('chevron')}</span></button>`);
    }
    needy.slice(0, 4).forEach(({ s, low }) => {
      reminderRows.push(`<button class="reminder-row" data-reminder-care="${s.id}">
        <span class="reminder-ico">${s.asleep ? '💤' : '💛'}</span>
        <span class="reminder-main"><b>${esc(displayName(s))} ${careWords[low.key] || 'needs care'}</b><span>${low.key} ${low.value}/100</span></span>
        <span class="go">${icon('chevron')}</span></button>`);
    });
    if (needy.length > 4) {
      reminderRows.push(`<div class="tiny muted" style="text-align:center">and ${needy.length - 4} more sprite${needy.length - 4 === 1 ? '' : 's'} need care</div>`);
    }
    root.querySelector('[data-reminders]').innerHTML = reminderRows.length
      ? `<div class="card reminder-card">
          <div class="between"><div><div class="eyebrow">Notifications</div><b style="font-size:13px">🛎️ Reminders</b></div>
          <span class="chip">${reminderRows.length} to do</span></div>
          <div class="reminder-list">${reminderRows.join('')}</div>
        </div>`
      : `<div class="card reminder-card all-done"><b style="font-size:12.5px">🛎️ All caught up</b><span class="tiny muted">Every sprite is fed, rested, happy and clean, and every check-in is claimed.</span></div>`;

    const weekSlots = c.weekSlots || 0;
    root.querySelector('[data-week-track]').innerHTML = `
      <div class="card" style="padding:13px;margin-top:12px">
        <div class="between"><b style="font-size:12.5px">This week · ${weekSlots} check-ins</b><span class="tiny muted">resets Monday</span></div>
        <div class="bar" style="height:8px;margin:8px 0 10px"><i style="width:${Math.min(100, (weekSlots / 16) * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div>
        <div class="milestone-list">${milestoneRows(WEEK_MILESTONES, weekSlots, c.weekClaims || [])}</div>
      </div>`;

    const weekly = activeWeeklyEvent();
    const weeklyDone = weeklyEventClaimed(weekly);
    const weeklyFoodCount = weeklyEventFoodKeys(weekly).length;
    const weeklyVaultCount = weeklyEventMissingVaultKeys().length;
    const weeklyCrates = weeklyEventMissingCrates(weekly);
    const fridayCrate = weekly?.reward?.kind === 'friday-crate';
    const fridaySecretDue = fridayCrate && c.monthCrateKey !== monthKey();
    const fridayLockedCount = fridayCrate
      ? SECRET_SPECIES.filter((key) => !(state.secretUnlocks || []).includes(key)).length
      : 0;
    const weeklyBits = [];
    if (weekly?.effects?.xp) weeklyBits.push(`⚡ +${Math.round((weekly.effects.xp - 1) * 100)}% XP`);
    if (weekly?.effects?.coins) weeklyBits.push(`🪙 +${Math.round((weekly.effects.coins - 1) * 100)}% coins`);
    if (weekly?.effects?.giftSpeed) weeklyBits.push(`🎁 gifts ${Math.round((weekly.effects.giftSpeed - 1) * 100)}% sooner`);
    if (weekly?.effects?.bond) weeklyBits.push(`💞 +${Math.round((weekly.effects.bond - 1) * 100)}% bond`);
    let weeklyReward = 'A small event crate.';
    if (weekly?.reward?.kind === 'vault') weeklyReward = weeklyVaultCount ? `${weeklyVaultCount} missing Vault sprite${weeklyVaultCount === 1 ? '' : 's'} come home.` : 'Vault already complete — take the coin crown instead.';
    else if (weekly?.reward?.kind === 'crates') weeklyReward = `${weeklyCrates} unclaimed crate${weeklyCrates === 1 ? '' : 's'} this week.`;
    else if (fridayCrate) weeklyReward = weeklyDone
      ? t('friday.cardSecretDone')
      : fridaySecretDue ? t('friday.cardSecretReady') : t('friday.cardReward');
    else if (weekly?.reward?.foodCats?.length) {
      const cats = weekly.reward.foodCats;
      const catName = cats.length === 1 ? ({ meal: 'meal', dessert: 'dessert', drink: 'drink', treat: 'treat' }[cats[0]] || 'food') : 'meal, dessert, and drink';
      weeklyReward = `${weeklyFoodCount} free ${catName} item${weeklyFoodCount === 1 ? '' : 's'} for the pantry.`;
    }
    const weeklyButton = weeklyDone ? (fridayCrate ? t('friday.claimed') : '✓ Claimed this week') : weekly?.reward?.kind === 'vault' ? (weeklyVaultCount ? `Rescue ${weeklyVaultCount} Vault sprites` : 'Claim Vault crown') : weekly?.reward?.kind === 'crates' ? `Open ${weeklyCrates} catch-up crate${weeklyCrates === 1 ? '' : 's'}` : fridayCrate ? (fridaySecretDue && fridayLockedCount ? t('friday.chooseSecret') : t('friday.claim')) : weekly?.reward?.foodCats?.length ? `Claim ${weeklyFoodCount} free food${weeklyFoodCount === 1 ? '' : 's'}` : 'Claim event crate';
    root.querySelector('[data-weekly-event]').innerHTML = `
      <div class="card weekly-event-card" style="border-color:color-mix(in srgb, ${weekly?.color || 'var(--gold)'} 33%, transparent)">
        <div class="between" style="align-items:flex-start">
          <div><div class="eyebrow">Weekly event · ${esc(weekly?.dayLabel || 'Today')}</div><b style="font-size:13px">${weekly?.icon || '🎉'} ${esc(weekly?.name || 'Hollow event')}</b></div>
          <span class="chip" style="color:${weekly?.color || 'var(--gold)'}">${weeklyDone ? '✓ claimed' : 'one claim'}</span>
        </div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.55">${esc(weekly?.blurb || 'A special Hollow day.')}</p>
        <div class="weekly-day-strip">${WEEKLY_EVENTS.map((event) => `<div class="weekly-day ${event.key === weekly?.key ? 'on' : ''} ${weeklyEventClaimed(event) ? 'done' : ''}"><span>${event.dayLabel.slice(0, 3)}</span><b>${event.icon}</b><i>${weeklyEventClaimed(event) ? '✓' : event.key === weekly?.key ? 'now' : ''}</i></div>`).join('')}</div>
        ${weeklyBits.length ? `<div class="row" style="gap:4px;flex-wrap:wrap;margin-top:8px">${weeklyBits.map((bit) => `<span class="chip">${bit}</span>`).join('')}</div>` : ''}
        <div class="weekly-event-reward"><b>${esc(weeklyReward)}</b>${weekly?.reward?.coins ? `<span>+${weekly.reward.coins} coins</span>` : ''}</div>
        <button class="btn ${weeklyDone ? 'btn-ghost' : 'btn-gold'} btn-block" data-weekly-claim ${weeklyDone ? 'disabled' : ''} style="margin-top:9px">${weeklyButton}</button>
        <p class="tiny muted" style="text-align:center;margin-top:6px">Events rotate every day. One claim per event, per week.</p>
      </div>`;

    const eggDone = dailyEggClaimed();
    const featuredKey = dailyEggFeatured();
    const featured = ELEMENTS[featuredKey] || ELEMENTS.bloom;
    const lastGiftKey = dailyEggClaimedKey();
    root.querySelector('[data-egg-gift]').innerHTML = `
      <div class="card egg-gift-card" style="padding:13px;margin-top:12px">
        <div class="between" style="align-items:flex-start">
          <div><div class="eyebrow">Daily event</div><b style="font-size:13px">🥚 Daily Egg Gift</b></div>
          <span class="chip">${eggDone ? '✓ claimed today' : 'one per day'}</span>
        </div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.55">Every day the Hollow leaves one wrapped egg on the doorstep, and you pick the sprite inside. Featured today: <b style="color:var(--text)">${esc(featured.name)}</b>.</p>
        <div class="row" style="gap:5px;flex-wrap:wrap;margin-bottom:9px"><span class="chip">${dailyEggPool().length.toLocaleString()} species</span><span class="chip">🎁 free egg</span><span class="chip">🔥 arrives 40% warmed</span></div>
        <div class="egg-gift-actions">
          <button class="btn ${eggDone ? 'btn-ghost' : 'btn-gold'}" data-egg-gift-claim ${eggDone ? 'disabled' : ''}>${eggDone ? 'Claimed — back tomorrow' : 'Claim today’s gift egg'}</button>
          <button class="btn btn-soft" data-egg-gift-choose ${eggDone ? 'disabled' : ''}>Choose any sprite</button>
        </div>
        ${eggDone && lastGiftKey && ELEMENTS[lastGiftKey] ? `<p class="tiny muted" style="margin:7px 0 0;text-align:center">Today’s gift: <b style="color:var(--text)">${esc(ELEMENTS[lastGiftKey].name)}</b> egg, warming in the Nest.</p>` : ''}
      </div>`;

    const weekEvent = typeof weekendAdminEvent === 'function' ? weekendAdminEvent() : null;
    const weekendActive = typeof weekendAdminActive === 'function' && weekendAdminActive();
    const weekendDone = typeof weekendAdminClaimed === 'function' && weekendAdminClaimed();
    const weekendHint = weekendActive
      ? (weekendDone ? 'The Admin team has already handed over this weekend’s egg.' : 'The Admin Event is live all weekend. One claim per weekend.')
      : 'The Admin Event returns on Saturday. Special event sprites and Admin sprites only arrive during the weekend.';
    root.querySelector('[data-weekend-event]').innerHTML = `
      <div class="card weekly-event-card" style="padding:13px;margin-top:12px;border-color:${weekEvent?.color || '#8be9ff'}66">
        <div class="between" style="align-items:flex-start">
          <div><div class="eyebrow">Admin event · weekends</div><b style="font-size:13px">${weekEvent?.icon || '🛠️'} ${esc(weekEvent?.name || 'Admin Event')}</b></div>
          <span class="chip">${weekendDone ? '✓ claimed' : weekendActive ? 'live now' : 'Sat & Sun'}</span>
        </div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.55">${esc(weekEvent?.blurb || 'The admin team opens the console every weekend with bonus XP, coins, and an egg.')}</p>
        <div class="row" style="gap:5px;flex-wrap:wrap;margin-bottom:9px">
          <span class="chip">⚡ +${Math.round(((weekEvent?.xpMult || 1) - 1) * 100)}% XP</span>
          <span class="chip">🪙 +${weekEvent?.coins || 0} coins</span>
          <span class="chip">🥚 ${ELEMENTS[weekEvent?.egg]?.name || 'Admin'} egg</span>
          <span class="chip">🛠️ ${(typeof ADMIN_KEYS !== 'undefined' ? ADMIN_KEYS.length : 0) + (typeof EVENT_KEYS !== 'undefined' ? EVENT_KEYS.length : 0)} event &amp; admin sprites</span>
        </div>
        <button class="btn ${weekendDone ? 'btn-ghost' : weekendActive ? 'btn-gold' : 'btn-soft'} btn-block" data-weekend-claim ${weekendActive && !weekendDone ? '' : 'disabled'}>${weekendDone ? 'Claimed this weekend' : weekendActive ? 'Claim the weekend event gift' : 'Back on Saturday'}</button>
        <p class="tiny muted" style="text-align:center;margin-top:6px;line-height:1.45">${esc(weekendHint)}</p>
      </div>`;

    const quiz = quizStatus();
    const nextQuizText = new Date(quiz.next).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    const quizReadyText = quiz.readyAt
      ? new Date(quiz.readyAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      : '';
    const quizDone = quiz.done;
    const quizReady = quiz.ready;
    const quizCopy = quizDone
      ? t('quiz.cardDone', { day: nextQuizText })
      : !quiz.eligible ? t('quiz.cardOff', { day: nextQuizText })
      : !quizReady ? t('quiz.cardWaiting', { time: quizReadyText })
      : t('quiz.cardReady');
    const quizChip = quizDone ? t('quiz.solved') : !quiz.eligible ? t('quiz.restDay') : !quizReady ? t('quiz.laterToday') : t('quiz.readyNow');
    const quizButton = quizDone ? t('quiz.solved')
      : !quiz.eligible ? t('quiz.next', { day: nextQuizText })
      : !quizReady ? t('quiz.notYet', { time: quizReadyText })
      : t('quiz.take');
    root.querySelector('[data-random-quiz]').innerHTML = `
      <div class="card" style="padding:13px;margin-top:12px;border-color:rgba(124,92,255,.3)">
        <div class="between"><div><div class="eyebrow">${esc(t('quiz.eyebrow'))}</div><b style="font-size:13px">${esc(t('quiz.cardTitle'))}</b></div><span class="chip">${quizDone ? '✓' : '🧠'} ${esc(quizChip)}</span></div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.55">${esc(quizCopy)}</p>
        <button class="btn ${quizReady ? 'btn-gold' : 'btn-ghost'} btn-block" data-quiz-start ${quizReady ? '' : 'disabled'}>${esc(quizButton)}</button>
      </div>`;

    const holiday = typeof activeHoliday === 'function' ? activeHoliday() : null;
    const nextHol = !holiday && typeof nextHoliday === 'function' ? nextHoliday() : null;
    const holidayCard = root.querySelector('[data-holiday-card]');
    if (holiday) {
      const daysLeft = typeof holidayDaysLeft === 'function' ? holidayDaysLeft(holiday) : 0;
      const treat = FOODS[holiday.treat];
      const seasonEggs = holidayEggPool(holiday);
      const giftDone = holidayGiftClaimed(holiday);
      holidayCard.innerHTML = `<div class="card" style="padding:13px;margin-top:12px;border-color:${holiday.color}66">
        <div class="between"><div><div class="eyebrow">Holiday event</div><b style="font-size:13px">${holiday.icon} ${esc(holiday.name)}</b></div><span class="chip">${daysLeft} day${daysLeft === 1 ? '' : 's'} left</span></div>
        <p class="tiny muted" style="margin:6px 0 8px;line-height:1.55">${esc(holiday.blurb)}</p>
        <div class="row" style="gap:5px;flex-wrap:wrap"><span class="chip">🪙 +${Math.round((holiday.coinMult - 1) * 100)}% coins</span><span class="chip">🎁 +${Math.round((holiday.giftSpeed - 1) * 100)}% gifts</span><span class="chip">⚡ +${Math.round(((holiday.xpMult || 1) - 1) * 100)}% XP</span>${treat ? `<span class="chip">🍬 daily treat: ${treat.emoji} ${esc(treat.name)}</span>` : ''}</div>
        <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:7px">${seasonEggs.slice(0, 5).map((key) => `<span class="chip" style="border-color:${ELEMENTS[key].primary}55">${esc(ELEMENTS[key].name)} egg</span>`).join('')}${seasonEggs.length > 5 ? `<span class="chip">+${seasonEggs.length - 5} more</span>` : ''}</div>
        <button class="btn ${giftDone ? 'btn-ghost' : 'btn-gold'} btn-block" data-holiday-gift ${giftDone ? 'disabled' : ''} style="margin-top:9px">${giftDone ? 'Season gift claimed today' : 'Claim season gift egg + bonus coins'}</button>
      </div>`;
    } else if (nextHol) {
      holidayCard.innerHTML = `<div class="card" style="padding:12px;margin-top:12px;border-color:${nextHol.color}44">
        <div class="between"><div><div class="eyebrow">Next holiday</div><b style="font-size:12.5px">${nextHol.icon} ${esc(nextHol.name)}</b></div><span class="chip">in ${nextHol.days} day${nextHol.days === 1 ? '' : 's'}</span></div>
        <p class="tiny muted" style="margin:5px 0 0;line-height:1.5">${esc(nextHol.blurb)}</p>
      </div>`;
    } else {
      holidayCard.innerHTML = '';
    }

    root.querySelector('[data-streaks]').innerHTML = `
      <div class="stat-tile"><b>${streak}</b><span>Day streak</span></div>
      <div class="stat-tile"><b>${c.weekStreak || 0}</b><span>Week streak</span></div>
      <div class="stat-tile"><b>${c.monthStreak || 0}</b><span>Month streak</span></div>
      <div class="stat-tile"><b>${c.yearStreak || 0}</b><span>Year streak</span></div>`;

    const monthCount = c.monthSlots || 0;
    const yearCount = c.yearSlots || 0;
    root.querySelector('[data-long-game]').innerHTML = `
      <div class="card" style="padding:13px;margin-top:10px">
        <div class="between"><b style="font-size:12.5px">This month · ${monthCount} check-ins</b><span class="tiny muted">${c.monthDays || 0} days</span></div>
        <div class="bar" style="height:7px;margin:8px 0 9px"><i style="width:${Math.min(100, (monthCount / 48) * 100)}%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></i></div>
        <div class="milestone-list">${milestoneRows(MONTH_MILESTONES, monthCount, c.monthClaims || [])}</div>
        <div class="divider" style="margin:12px 0"></div>
        <div class="between"><b style="font-size:12.5px">This year · ${yearCount} check-ins</b><span class="tiny muted">${c.yearDays || 0} days</span></div>
        <div class="bar" style="height:7px;margin:8px 0 9px"><i style="width:${Math.min(100, (yearCount / YEAR_MILESTONE.n) * 100)}%;background:linear-gradient(90deg,var(--gold),#ff9f43)"></i></div>
        <div class="milestone-list">${milestoneRows([YEAR_MILESTONE], yearCount, c.yearClaims || [])}</div>
        <div class="tiny muted" style="margin-top:8px;line-height:1.55">A week streak counts weeks with 7+ check-ins. Month streaks need 12+ check-in days; year streaks need 120+ days. Period rewards claim automatically.</div>
      </div>`;

    root.querySelector('[data-tasks-daily]').innerHTML = taskHTML(state.daily?.tasks, 'daily');
    root.querySelector('[data-tasks-weekly]').innerHTML = taskHTML(state.weekly?.tasks, 'weekly');
    root.querySelector('[data-tasks-monthly]').innerHTML = taskHTML(state.monthly?.tasks, 'monthly');

    const st = state.stats;
    root.querySelector('[data-stats]').innerHTML = `
      <div class="stat-tile"><b>${grownSprites().length}</b><span>Sprites</span></div>
      <div class="stat-tile"><b>${st.checkins || 0}</b><span>Check-ins</span></div>
      <div class="stat-tile"><b>${st.hatches || 0}</b><span>Hatches</span></div>
      <div class="stat-tile"><b>${st.merges || 0}</b><span>Merges</span></div>
      <div class="stat-tile"><b>${st.evolves || 0}</b><span>Evolutions</span></div>
      <div class="stat-tile"><b>${Math.max(st.bestStreak || 0, streak)}</b><span>Best streak</span></div>`;
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-reminder-checkin]')) {
      const real = root.querySelector('button[data-checkin]');
      if (real && !real.disabled) real.click();
      return;
    }
    const reminderCare = e.target.closest('[data-reminder-care]');
    if (reminderCare) { App.openDetail(reminderCare.dataset.reminderCare); return; }
    const checkin = e.target.closest('[data-checkin]');
    if (checkin && !checkin.disabled) {
      const res = Actions.checkIn();
      if (!res.ok) {
        toast(res.reason === 'window' ? 'That window is already claimed. Come back later!' : 'Could not check in right now.', '📅');
        paint();
        return;
      }
      Sfx.coin();
      burstOn(checkin, ['🪙', '✨', '💛'], 9);
      let message = `+${res.reward} coins · ${res.weekSlots} check-ins this week`;
      if (res.snackKey) message += ` · ${SNACKS[res.snackKey].emoji} ${SNACKS[res.snackKey].name}`;
      if (res.foodKey) message += ` · ${FOODS[res.foodKey].emoji} ${FOODS[res.foodKey].name}`;
      if (res.holidayFood) message += ` · ${FOODS[res.holidayFood].emoji} ${FOODS[res.holidayFood].name}`;
      toast(message, '📅');
      if (res.snackKey) Sfx.pop();
      res.milestones.forEach((m, i) => {
        setTimeout(() => toast(`${m.title}: ${m.text}`, m.icon), 450 + i * 600);
        if (m.spriteId) newFriendId = m.spriteId;
      });
      paint();
      return;
    }

    const weeklyClaim = e.target.closest('[data-weekly-claim]');
    if (weeklyClaim && !weeklyClaim.disabled) {
      const res = Actions.claimWeeklyEvent();
      if (!res.ok) {
        if (res.reason === 'secret') { openFridaySecretCrate(); return; }
        toast(res.reason === 'claimed' ? 'That event is already claimed this week.' : 'No event is active right now.', '🎉');
        paint();
        return;
      }
      Sfx.win();
      burstOn(weeklyClaim, ['🎉', '✨', '🪙'], 9);
      let msg = `${res.event.icon} ${res.event.name}`;
      if (res.fridayCrate) msg += ' · free Friday crate';
      if (res.secret) msg += ` · ${secretName(res.secret.element)} joined your Hollow`;
      else if (res.monthly) msg += ' · monthly food unlocked';
      if (res.foods.length) msg += ` · +${res.foods.length} pantry foods`;
      if (!res.fridayCrate && res.crates) msg += ` · +${res.crates} catch-up crates`;
      if (res.coins) msg += ` · +${res.coins} coins`;
      toast(msg, res.event.icon);
      paint();
      return;
    }

    const quizStart = e.target.closest('[data-quiz-start]');
    if (quizStart && !quizStart.disabled) {
      const status = quizStatus();
      if (!status.ready) { toast(t('quiz.notReady'), '🧠'); paint(); return; }
      openTypeQuiz();
      return;
    }

    const eggGiftClaim = e.target.closest('[data-egg-gift-claim]');
    if (eggGiftClaim && !eggGiftClaim.disabled) {
      const res = Actions.claimDailyEgg();
      if (!res.ok) { toast('Today’s gift egg is already claimed. Come back tomorrow.', '🥚'); paint(); return; }
      burstOn(eggGiftClaim, ['🥚', '✨', '🎁'], 9);
      toast(res.egg.shiny
        ? `✨ Shiny daily gift egg: ${ELEMENTS[res.element].name} · warm in the Nest.`
        : `Daily gift egg: ${ELEMENTS[res.element].name} · warm in the Nest.`, res.egg.shiny ? '✨' : '🥚');
      paint();
      return;
    }

    const eggGiftChoose = e.target.closest('[data-egg-gift-choose]');
    if (eggGiftChoose && !eggGiftChoose.disabled) {
      openDailyEggGift();
      return;
    }

    const holidayGift = e.target.closest('[data-holiday-gift]');
    if (holidayGift && !holidayGift.disabled) {
      const res = Actions.claimHolidayGift();
      if (!res.ok) {
        toast(res.reason === 'claimed' ? 'Today’s season gift is already claimed.' : 'No holiday is active right now.', '🎁');
        paint();
        return;
      }
      burstOn(holidayGift, ['🎁', '🥚', '🪙'], 9);
      toast(`${res.holiday.icon} ${res.holiday.name}: ${res.egg.shiny ? '✨ shiny ' : ''}${ELEMENTS[res.element].name} egg + ${res.coins} coins`, res.holiday.icon);
      paint();
      return;
    }

    const weekendClaim = e.target.closest('[data-weekend-claim]');
    if (weekendClaim && !weekendClaim.disabled) {
      const res = Actions.claimWeekendGift();
      if (!res.ok) {
        toast(res.reason === 'claimed' ? 'This weekend’s Admin gift is already claimed.' : 'The Admin Event runs on Saturday and Sunday only.', '🛠️');
        paint();
        return;
      }
      burstOn(weekendClaim, ['🛠️', '🥚', '✨'], 9);
      toast(`${res.event.icon} ${res.event.name}: ${res.egg.shiny ? '✨ shiny ' : ''}${ELEMENTS[res.element].name} egg + ${res.coins} coins`, res.event.icon);
      paint();
      return;
    }

    const claim = e.target.closest('[data-claim]');
    if (claim && !claim.disabled) {
      const res = Actions.claimTask(claim.dataset.claim, claim.dataset.period || 'daily');
      if (res.ok) {
        burstOn(claim, ['🪙', '✅', '✨'], 7);
        paint();
      }
      return;
    }

    const meet = e.target.closest('[data-meet-sprite]');
    if (meet) App.openDetail(meet.dataset.meetSprite);
  });

  const unsub = subscribeState(() => paint());
  const clock = setInterval(() => {
    if (lastDay !== dayKey()) {
      lastDay = dayKey();
      paint();
    }
  }, 60000);
  paint();
  return () => {
    unsub();
    clearInterval(clock);
  };
}
