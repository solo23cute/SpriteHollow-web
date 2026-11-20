/* Android system reminders. The WebView keeps no state while the app is
   closed, so the summary is written on the way out and posted by a native
   alarm a couple of hours later. Falls back silently in a plain browser. */

const Notifier = {
  native() {
    return typeof window !== 'undefined'
      && window.Notifier
      && typeof window.Notifier.schedule === 'function'
      ? window.Notifier
      : null;
  },

  enabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.reminders !== false;
  },

  /* The Studio offers these; 2 hours stays the default. */
  delays: [30, 60, 120, 240, 480],

  delay() {
    const v = typeof state !== 'undefined' && state.theme ? Number(state.theme.reminderMinutes) : NaN;
    return this.delays.includes(v) ? v : 120;
  },

  /* A check-in reminder reads differently from a hungry-sprite reminder, and
     a notification that needs both says so. */
  summary() {
    let win = null;
    if (typeof currentCheckinSlot === 'function') {
      const slot = currentCheckinSlot();
      if (slot && !slot.claimed) win = slot;
    }
    const words = { hunger: 'hungry', energy: 'sleepy', joy: 'bored', clean: 'grubby' };
    const needy = (typeof grownSprites === 'function' ? grownSprites() : [])
      .filter((s) => s && !s.asleep && s.needs)
      .map((s) => {
        const low = typeof Voice !== 'undefined' && Voice.lowestNeed ? Voice.lowestNeed(s) : null;
        return low && low.value < 30
          ? { name: displayName(s), word: words[low.key] || 'needs care', value: low.value }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.value - b.value);
    const careParts = needy.slice(0, 3).map((n) => `${n.name} is ${n.word}`);
    if (needy.length > 3) careParts.push(`and ${needy.length - 3} more`);
    const careText = careParts.join(' · ');
    if (!win && !careText) return null;
    if (win && !careText) {
      return {
        title: `${win.label} check-in is open`,
        body: `Tap to check in before the ${String(win.label).toLowerCase()} window closes.`,
      };
    }
    if (!win) {
      return {
        title: 'Your sprites need you',
        body: `${careText}. Tap to look after them.`,
      };
    }
    return {
      title: `${win.label} check-in · sprites need care`,
      body: `The ${String(win.label).toLowerCase()} check-in is open. ${careText}.`,
    };
  },

  /* One alarm for the start of each upcoming check-in window, skipping any
     window already claimed today. Four is enough to cover tomorrow. */
  checkinPlan() {
    if (typeof CHECKIN_WINDOWS === 'undefined') return [];
    const today = typeof dayKey === 'function' ? dayKey() : '';
    const claimed = state && state.checkin && state.checkin.slotsDate === today ? (state.checkin.slots || []) : [];
    const plan = [];
    const nowMs = Date.now();
    for (let day = 0; day <= 2 && plan.length < 4; day += 1) {
      CHECKIN_WINDOWS.forEach((w) => {
        if (plan.length >= 4) return;
        if (day === 0 && claimed.includes(w.id)) return;
        const at = new Date();
        at.setDate(at.getDate() + day);
        at.setHours(w.from, 0, 0, 0);
        if (at.getTime() <= nowMs + 60000) return;
        plan.push({
          at: at.getTime(),
          title: `${w.label} check-in is open`,
          body: `Tap to claim the ${String(w.label).toLowerCase()} check-in before the window closes.`,
        });
      });
    }
    return plan.slice(0, 4);
  },

  arm() {
    if (!this.enabled()) return false;
    const n = this.native();
    if (!n) return false;
    const s = this.summary();
    try {
      if (s) n.schedule(s.title, s.body, this.delay());
      else n.cancel();
      if (typeof n.scheduleCheckins === 'function') n.scheduleCheckins(JSON.stringify(this.checkinPlan()));
    } catch { return false; }
    return !!s;
  },

  /* A one-off alarm with its own ids, so a test never replaces the real one. */
  testIn(minutes = 1) {
    const n = this.native();
    if (!n || typeof n.testIn !== 'function') return false;
    try { n.testIn(minutes); return true; } catch { return false; }
  },

  /* Claiming a window drops its pending alarm without touching the care one. */
  refreshCheckins() {
    const n = this.native();
    if (!n || typeof n.scheduleCheckins !== 'function') return;
    try { n.scheduleCheckins(JSON.stringify(this.checkinPlan())); } catch { /* ignore */ }
  },

  clear() {
    const n = this.native();
    if (!n || typeof n.cancel !== 'function') return;
    try { n.cancel(); } catch { /* nothing pending */ }
  },

  ask() {
    const n = this.native();
    if (!n || typeof n.ask !== 'function') return;
    try { n.ask(); } catch { /* permission dialog unavailable */ }
  },
};
