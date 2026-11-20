/* Spoken greetings, goodbyes, return updates, and needs reminders.
   Uses the Android text-to-speech bridge when packaged, speechSynthesis in the browser. */
const Voice = {
  native: null,
  lastLine: '',
  lastAt: 0,
  reminderAt: 0,
  lastReminderKey: '',
  startedAt: 0,
  hiddenAt: 0,
  away: null,
  history: [],

  init() {
    this.startedAt = Date.now();
    if (typeof window !== 'undefined' && window.Voice && typeof window.Voice.speak === 'function') {
      this.native = window.Voice;
      if (typeof this.native.setType === 'function') this.native.setType(this.type());
    }
  },

  type() {
    return typeof state !== 'undefined' && state.theme && state.theme.voiceType === 'male' ? 'male' : 'female';
  },

  enabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.voice !== false;
  },

  supported() {
    /* Headless shells expose speechSynthesis without a working utterance
       constructor, so check both before promising a voice. */
    return !!this.native || (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function');
  },

  speak(text, opts = {}) {
    if (!text || (!this.enabled() && !opts.allowMuted)) return false;
    const now = Date.now();
    if (!opts.force && text === this.lastLine && now - this.lastAt < 4000) return false;
    this.lastLine = text;
    this.lastAt = now;
    this.history.push(text);
    if (this.history.length > 6) this.history.shift();
    if (typeof Captions !== 'undefined') Captions.speech(text);
    const type = opts.type === 'male' || opts.type === 'female' ? opts.type : this.type();
    try {
      if (this.native) {
        if (typeof this.native.setType === 'function') this.native.setType(type);
        this.native.speak(text);
        return true;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = (typeof I18N_LANGUAGES !== 'undefined' && I18N_LANGUAGES[uiLang()]?.tag) || 'en-US';
        utterance.rate = Number.isFinite(opts.rate) ? opts.rate : (type === 'male' ? 0.96 : 1.0);
        utterance.pitch = Number.isFinite(opts.pitch) ? opts.pitch : (type === 'male' ? 0.8 : 1.12);
        utterance.volume = 0.95;
        window.speechSynthesis.speak(utterance);
        return true;
      }
    } catch (err) {
      console.warn('Voice could not speak.', err);
    }
    return false;
  },

  stop() {
    try {
      if (this.native && this.native.stop) this.native.stop();
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch { /* ignore */ }
  },

  spriteEnabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.spriteVoice !== false;
  },

  /* Every sprite gets its own small voice: element sets the base pitch, the
     personality nudges rate and pitch, so two sprites never sound identical. */
  spriteTone(s) {
    const seedText = `${s?.element || 'bloom'}|${s?.personality || 'sunny'}`;
    let hash = 2166136261;
    for (let i = 0; i < seedText.length; i += 1) {
      hash ^= seedText.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const el = ELEMENTS[s?.element] || ELEMENTS.bloom;
    const luminance = (() => {
      const m = String(el?.primary || '').replace('#', '');
      if (!/^[0-9a-f]{6}$/i.test(m)) return 0.5;
      const n = parseInt(m, 16);
      return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    })();
    /* The element name carries most of the pitch so two species with similar
       palettes still sound apart; palette brightness only nudges it. */
    const nameSpread = ((hash >>> 7) % 100) / 100; // 0..1
    const base = 0.92 + nameSpread * 0.72 + (luminance - 0.5) * 0.18;
    const wobble = ((hash >>> 0) % 100) / 100; // 0..1
    const rate = { sunny: 1.08, grump: 0.94, shy: 1.02, bold: 1.06, goofy: 1.12, dreamy: 0.92, sassy: 1.04 }[s?.personality] || 1;
    return { pitch: Math.min(1.9, Math.max(0.7, base + wobble * 0.3)), rate: Math.min(1.2, Math.max(0.85, rate + (wobble - 0.5) * 0.06)) };
  },

  spriteSpeak(s, text, opts = {}) {
    if (!s || !text || !this.spriteEnabled() || !this.supported()) return false;
    const tone = this.spriteTone(s);
    return this.speak(text, { ...opts, pitch: tone.pitch, rate: tone.rate });
  },

  actionFor(need) {
    return {
      hunger: 'A snack would help.',
      energy: 'A nap would help.',
      joy: 'A little play would help.',
      clean: 'A bubble bath would help.',
    }[need] || '';
  },

  lowestNeed(s) {
    if (!s || !s.needs) return null;
    return ['hunger', 'energy', 'joy', 'clean']
      .map((key) => ({ key, value: Math.round(s.needs[key]) }))
      .sort((a, b) => a.value - b.value)[0];
  },

  needsLine(s) {
    if (!s) return '';
    const low = this.lowestNeed(s);
    if (!low) return '';
    if (low.value >= 40) return 'All their needs are in good shape.';
    return `${displayName(s)} is ${low.value} out of 100 on ${low.key}. ${this.actionFor(low.key)}`;
  },

  welcome(force = false) {
    if (!state.started || !this.supported()) return;
    const s = activeSprite() || grownSprites()[0];
    if (!s) return;
    const line = `Welcome to Sprite Hollow. ${displayName(s)} is happy you are here. ${this.needsLine(s)}`;
    this.speak(line, { force });
  },

  goodbye() {
    if (!state.started) return;
    const s = activeSprite() || grownSprites()[0];
    if (!s) return;
    this.speak(`Goodbye for now. ${displayName(s)} will keep the Hollow warm.`);
  },

  markHidden() {
    this.hiddenAt = Date.now();
    const s = activeSprite();
    this.away = s ? { id: s.id, name: displayName(s), needs: { ...s.needs } } : null;
  },

  returnSummary() {
    if (!this.hiddenAt || !state.started) return;
    const awayFor = Date.now() - this.hiddenAt;
    this.hiddenAt = 0;
    if (awayFor < 90000) return;
    const s = activeSprite();
    if (!s) return;
    const before = this.away && this.away.id === s.id ? this.away.needs : null;
    const drops = before
      ? ['hunger', 'energy', 'joy', 'clean']
        .map((key) => ({ key, drop: Math.round(before[key] - s.needs[key]) }))
        .filter((d) => d.drop >= 8)
        .sort((a, b) => b.drop - a.drop)
      : [];
    let line;
    if (drops.length) {
      const worst = drops[0];
      line = `Welcome back. While you were away, ${displayName(s)}'s ${worst.key} dropped to ${Math.round(s.needs[worst.key])}. ${this.actionFor(worst.key)}`;
    } else {
      line = `Welcome back. ${displayName(s)} kept the Hollow warm. ${this.needsLine(s)}`;
    }
    this.speak(line, { force: true });
    const toastLine = drops.length
      ? `${displayName(s)} missed you — ${this.lowestNeed(s).key} is ${Math.round(this.lowestNeed(s).value)}/100.`
      : `${displayName(s)} kept the Hollow warm while you were away.`;
    if (typeof toast === 'function') toast(toastLine, '🌅');
  },

  remind() {
    if (!state.started || document.hidden || !this.enabled() || !this.supported()) return;
    if (typeof overlayStack !== 'undefined' && overlayStack.length) return;
    if (document.querySelector('.game-overlay')) return;
    const now = Date.now();
    if (now - this.startedAt < 120000) return;
    if (now - this.reminderAt < 150000) return;
    const s = activeSprite();
    if (!s || s.asleep) return;
    const low = this.lowestNeed(s);
    if (!low || low.value >= 28) return;
    const key = `${s.id}:${low.key}`;
    if (key === this.lastReminderKey) return;
    this.lastReminderKey = key;
    this.reminderAt = now;
    const line = `A little reminder: ${displayName(s)} is ${low.key === 'clean' ? 'grubby' : low.key === 'energy' ? 'sleepy' : low.key === 'joy' ? 'bored' : 'hungry'}. ${this.actionFor(low.key)}`;
    this.speak(line);
    if (typeof toast === 'function') toast(`${displayName(s)} could use some care.`, '💛');
  },
};
