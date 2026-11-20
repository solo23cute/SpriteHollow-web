/* In-app music and weather beds, synthesized with WebAudio so no audio files
   ship with the app. Music follows the sound setting; weather beds follow the
   sky in the Hollow. */

const Music = {
  timer: null,
  step: 0,
  /* A slow four-chord loop: the Hollow's background hum. */
  chords: [
    [261.63, 329.63, 392.0],
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66],
  ],
  enabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.sound !== false;
  },
  /* The Studio slider is a 0-100 preference; the beds scale their own gains. */
  volume() {
    const v = typeof state !== 'undefined' && state.theme ? state.theme.musicVolume : 65;
    return Math.max(0, Math.min(1, (Number.isFinite(v) ? v : 65) / 100));
  },
  start() {
    if (this.timer || !this.enabled()) return;
    if (typeof Sfx === 'undefined' || typeof Sfx.tone !== 'function') return;
    Sfx.init();
    if (!Sfx.ctx) return;
    const play = () => {
      if (!this.enabled()) return this.stop();
      const chord = this.chords[this.step++ % this.chords.length];
      const vol = this.volume();
      chord.forEach((freq, i) => Sfx.tone(freq, 1.7, 'sine', 0.011 * vol, i * 0.07));
      Sfx.tone(chord[2] * 2, 1.1, 'triangle', 0.007 * vol, 0.55);
      Sfx.tone(chord[0] / 2, 1.9, 'sine', 0.009 * vol, 0.2);
    };
    play();
    this.timer = setInterval(play, 4400);
  },
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  },
};

const WEATHER_SOUND = {
  rain: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.032 },
  storm: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.05 },
  breeze: { filter: 'bandpass', freq: 900, q: 0.9, level: 0.016 },
  fog: { filter: 'bandpass', freq: 420, q: 0.4, level: 0.016 },
  snow: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.012 },
  frost: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.012 },
  drizzle: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.018 },
  hail: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.032 },
  sandstorm: { filter: 'highpass', freq: 1200, q: 0.4, level: 0.026 },
  mist: { filter: 'bandpass', freq: 420, q: 0.4, level: 0.012 },
  aurora: { filter: 'bandpass', freq: 900, q: 0.4, level: 0.008 },
  ashfall: { filter: 'highpass', freq: 1800, q: 0.4, level: 0.016 },
};

const WeatherSound = {
  key: null,
  nodes: null,
  enabled() {
    return typeof state === 'undefined' || !state.theme || state.theme.sound !== false;
  },
  volume() {
    const v = typeof state !== 'undefined' && state.theme ? state.theme.weatherVolume : 45;
    return Math.max(0, Math.min(1, (Number.isFinite(v) ? v : 45) / 100));
  },
  /* Rain is filtered noise; breeze is a slow swept band; storm adds a low rumble. */
  build(key) {
    const ctx = Sfx.ctx;
    const seconds = 2;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const sample = WEATHER_SOUND[key] || WEATHER_SOUND.rain;
    filter.type = sample.filter;
    filter.frequency.value = sample.freq;
    filter.Q.value = sample.q;
    const gain = ctx.createGain();
    const base = sample.level;
    this.baseLevel = base;
    gain.gain.value = base * this.volume();
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    return { src, gain };
  },
  set(key) {
    if (key === this.key) return;
    this.stop();
    this.key = key || null;
    if (!this.key || !this.enabled()) return;
    if (!WEATHER_SOUND[this.key]) return;
    if (typeof Sfx === 'undefined' || typeof Sfx.tone !== 'function') return;
    Sfx.init();
    if (!Sfx.ctx) return;
    try {
      this.nodes = this.build(this.key);
      if (this.key === 'storm') this.rumble = Sfx.tone(58, 2.4, 'sine', 0.02);
    } catch { this.nodes = null; }
  },
  /* The Studio slider changes the live bed without restarting the noise. */
  refresh() {
    if (!this.nodes) return;
    try { this.nodes.gain.gain.value = (this.baseLevel || 0) * this.volume(); } catch { /* gone */ }
  },
  stop() {
    if (this.nodes) {
      try { this.nodes.src.stop(); } catch { /* already stopped */ }
      try { this.nodes.gain.disconnect(); } catch { /* already gone */ }
    }
    this.nodes = null;
    this.key = null;
  },
};
/* The arcade bed: a fast pentatonic arpeggio over a pumping bass, started while
   a rhythm game runs. Synthesized, so it ships no audio files. */
Object.assign(Music, {
  hypeTimer: null,
  hypeStep: 0,
  startHype() {
    if (this.hypeTimer || !this.enabled()) return;
    if (typeof Sfx === 'undefined' || typeof Sfx.tone !== 'function') return;
    Sfx.init();
    if (!Sfx.ctx) return;
    this.stop();
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
    const bass = [130.81, 146.83, 164.81, 196];
    const play = () => {
      if (!this.enabled()) return this.stopHype();
      const vol = Math.max(0.4, this.volume());
      const step = this.hypeStep++;
      const note = scale[(step * 3) % scale.length];
      Sfx.tone(note, 0.14, 'triangle', 0.03 * vol);
      Sfx.tone(note / 2, 0.1, 'square', 0.008 * vol, 0.02);
      Sfx.tone(bass[Math.floor(step / 4) % bass.length], 0.24, 'sawtooth', 0.014 * vol);
      if (step % 4 === 0) Sfx.tone(64, 0.16, 'sine', 0.05 * vol);
      if (step % 4 === 2) Sfx.tone(2400, 0.04, 'square', 0.012 * vol);
    };
    play();
    this.hypeTimer = setInterval(play, 200);
  },
  stopHype() {
    if (this.hypeTimer) clearInterval(this.hypeTimer);
    this.hypeTimer = null;
  },
});
