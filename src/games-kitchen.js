/* Food & rhythm wave: Hollow Kitchen, Smoothie Smash and Neon Beatway.
   All three run inside the shared game shell, so rewards, the timer bar and
   the fullscreen button behave exactly like the rest of the arcade. */

Object.assign(GAME_INFO, {
  kitchen: {
    title: 'Hollow Kitchen', icon: '🍳', tag: 'Cooking',
    desc: 'Flip in the green band, then build the ticket.', g1: '#ffb347', g2: '#ff6b6b',
  },
  smoothie: {
    title: 'Smoothie Smash', icon: '🥤', tag: 'Jump & blend',
    desc: 'Stomp fruit and coffee ingredients, fill the blender, then serve the order.', g1: '#7fe0a0', g2: '#56c8e8',
  },
  musicjam: {
    title: 'Neon Beatway', icon: '🎹', tag: 'Rhythm',
    desc: 'Tap the lanes as the tiles cross the line.', g1: '#b06bff', g2: '#ff5ea8',
  },
});

function kNode(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

function kRand(min, max) {
  return min + Math.random() * (max - min);
}

function kShuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function kFloatText(host, text, cls) {
  const node = kNode('span', `kf-float ${cls || ''}`, text);
  node.style.left = `${38 + Math.random() * 24}%`;
  host.appendChild(node);
  setTimeout(() => node.remove(), 820);
}

/* One countdown per game: drives the shell's timer text and bar. */
function kCountdown(shell, seconds, onTick, onEnd) {
  const total = seconds * 1000;
  const started = performance.now();
  let raf = 0;
  const step = (now) => {
    const left = Math.max(0, total - (now - started));
    shell.timerEl.textContent = `${Math.ceil(left / 1000)}s`;
    shell.timerBar.style.width = `${(left / total) * 100}%`;
    if (onTick) onTick(left, now);
    if (left <= 0) {
      raf = 0;
      if (onEnd) onEnd();
      return;
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  shell.addCleanup(stop);
  return { stop };
}

/* ---------------- HOLLOW KITCHEN ---------------- */

const KITCHEN_MENU = [
  { name: 'Hollow Ramen', emoji: '🍜', tops: ['🥬', '🍄', '🧅'] },
  { name: 'Nest Pizza', emoji: '🍕', tops: ['🍅', '🧀', '🌿'] },
  { name: 'Moon Tacos', emoji: '🌮', tops: ['🍅', '🧅', '🌶️'] },
  { name: 'Ember Curry', emoji: '🍛', tops: ['🧅', '🌶️', '🥬'] },
  { name: 'Cloud Pancakes', emoji: '🥞', tops: ['🍓', '🍯', '🥒'] },
  { name: 'Tide Sushi', emoji: '🍣', tops: ['🥒', '🥑', '🌿'] },
  { name: 'Forge Burger', emoji: '🍔', tops: ['🧀', '🥬', '🍅'] },
  { name: 'Star Pasta', emoji: '🍝', tops: ['🍅', '🧀', '🌿'] },
];
const KITCHEN_TOPS = ['🍅', '🧀', '🥬', '🍄', '🧅', '🌶️', '🥒', '🥑', '🍓', '🍯', '🌿'];

function openKitchenGame() {
  const shell = gameOverlayShell('kitchen');
  shell.hintEl.textContent = 'Flip inside the green band, then tap the toppings in ticket order.';
  let score = 0;
  let combo = 0;
  let misses = 0;
  let served = 0;
  let ticket = 0;
  let phase = 'grill';
  let toppingAt = 0;
  let pointer = 0;
  let dir = 1;
  let zoneStart = 30;
  let zoneWidth = 24;
  let menu = KITCHEN_MENU[0];
  let raf = 0;
  let stopped = false;

  shell.board.innerHTML = '';
  const wrap = kNode('div', 'kf');
  wrap.innerHTML =
    '<div class="kf-ticket"><span class="kf-emoji" data-dish-emoji>🍜</span>' +
    '<span class="kf-ticket-text"><b data-dish-name>Hollow Ramen</b><i data-dish-steps>grill the base</i></span>' +
    '<span class="kf-served" data-served>0 served</span></div>' +
    '<div class="kf-grill"><div class="kf-pan">🍳<span class="kf-bubble"></span><span class="kf-bubble b2"></span></div>' +
    '<div class="kf-meter"><span class="kf-zone" data-zone></span><i data-pointer></i></div>' +
    '<button class="btn btn-gold btn-block" data-flip>Flip</button></div>' +
    '<div class="kf-tops" data-tops></div>' +
    '<div class="kf-plate">🍽️<span class="kf-plated" data-plated></span></div>' +
    '<button class="btn btn-block" data-serve disabled>Serve the plate</button>' +
    '<div class="kf-status" data-status>Ticket 1 · grill the base</div>';
  shell.board.appendChild(wrap);

  const pointerEl = wrap.querySelector('[data-pointer]');
  const zoneEl = wrap.querySelector('[data-zone]');
  const topsEl = wrap.querySelector('[data-tops]');
  const serveBtn = wrap.querySelector('[data-serve]');
  const statusEl = wrap.querySelector('[data-status]');
  const plateEl = wrap.querySelector('[data-plated]');
  const dishName = wrap.querySelector('[data-dish-name]');
  const dishEmoji = wrap.querySelector('[data-dish-emoji]');
  const dishSteps = wrap.querySelector('[data-dish-steps]');
  const servedEl = wrap.querySelector('[data-served]');

  const setScore = () => {
    shell.scoreEl.textContent = String(score);
    servedEl.textContent = `${served} served`;
  };

  const renderTops = () => {
    const need = menu.tops.slice();
    const extra = kShuffle(KITCHEN_TOPS.filter((t) => !need.includes(t))).slice(0, 3);
    const all = kShuffle(need.concat(extra));
    topsEl.innerHTML = all.map((t) => `<button class="kf-top" data-top="${t}">${t}</button>`).join('');
  };

  const setTicket = () => {
    menu = KITCHEN_MENU[Math.floor(Math.random() * KITCHEN_MENU.length)];
    ticket += 1;
    phase = 'grill';
    toppingAt = 0;
    zoneWidth = Math.max(16, 26 - served * 1.4);
    zoneStart = kRand(12, 88 - zoneWidth);
    zoneEl.style.left = `${zoneStart}%`;
    zoneEl.style.width = `${zoneWidth}%`;
    dishName.textContent = menu.name;
    dishEmoji.textContent = menu.emoji;
    dishSteps.textContent = `needs ${menu.tops.join(' ')}`;
    serveBtn.disabled = true;
    plateEl.textContent = '';
    renderTops();
    statusEl.textContent = `Ticket ${ticket} · grill the base`;
    statusEl.classList.remove('good');
  };

  const loop = () => {
    if (stopped) return;
    pointer += dir * (0.75 + served * 0.1);
    if (pointer >= 100) { pointer = 100; dir = -1; }
    if (pointer <= 0) { pointer = 0; dir = 1; }
    pointerEl.style.left = `${pointer}%`;
    raf = requestAnimationFrame(loop);
  };

  const finish = () => {
    if (stopped) return;
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    showGameResult(shell, {
      kind: 'kitchen',
      score,
      coins: 18 + served * 6 + score,
      xp: 30 + served * 8,
      blurb: served ? `${served} plate${served > 1 ? 's' : ''} served!` : 'The kitchen won this round.',
    });
  };

  wrap.querySelector('[data-flip]').addEventListener('click', () => {
    if (stopped || phase !== 'grill') return;
    const inZone = pointer >= zoneStart && pointer <= zoneStart + zoneWidth;
    if (inZone) {
      Sfx.pop();
      score += 8 + combo * 2;
      combo += 1;
      kFloatText(wrap, 'perfect flip', 'good');
      phase = 'toppings';
      serveBtn.disabled = true;
      statusEl.textContent = `Ticket ${ticket} · tap ${menu.tops.join(' ')} in order`;
      statusEl.classList.add('good');
    } else {
      Sfx.error();
      combo = 0;
      misses += 1;
      kFloatText(wrap, 'burnt!', 'bad');
      if (misses >= 3) return finish();
    }
    setScore();
  });

  topsEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-top]');
    if (!btn || stopped || phase !== 'toppings') return;
    const top = btn.dataset.top;
    if (top === menu.tops[toppingAt]) {
      toppingAt += 1;
      score += 4;
      Sfx.tap();
      btn.classList.add('ok');
      plateEl.textContent = menu.tops.slice(0, toppingAt).join(' ');
      if (toppingAt >= menu.tops.length) {
        phase = 'serve';
        serveBtn.disabled = false;
        statusEl.textContent = `Ticket ${ticket} · plate it!`;
      }
    } else {
      Sfx.error();
      combo = 0;
      misses += 1;
      toppingAt = 0;
      plateEl.textContent = '';
      btn.classList.add('bad');
      setTimeout(() => btn.classList.remove('bad'), 280);
      kFloatText(wrap, 'wrong order', 'bad');
      if (misses >= 3) return finish();
    }
    setScore();
  });

  serveBtn.addEventListener('click', () => {
    if (stopped || phase !== 'serve') return;
    phase = 'plated';
    served += 1;
    score += 20 + combo * 3;
    Sfx.chime();
    kFloatText(wrap, 'served!', 'good');
    setScore();
    setTicket();
  });

  setTicket();
  setScore();
  raf = requestAnimationFrame(loop);
  kCountdown(shell, 45, null, finish);
  shell.addCleanup(() => { stopped = true; if (raf) cancelAnimationFrame(raf); });
}

/* ---------------- SMOOTHIE BAR ---------------- */

const SMOOTHIE_FRUIT = [
  { key: 'strawberry', emoji: '🍓', name: 'Strawberry' },
  { key: 'banana', emoji: '🍌', name: 'Banana' },
  { key: 'mango', emoji: '🥭', name: 'Mango' },
  { key: 'blueberry', emoji: '🫐', name: 'Blueberry' },
  { key: 'kiwi', emoji: '🥝', name: 'Kiwi' },
  { key: 'pineapple', emoji: '🍍', name: 'Pineapple' },
  { key: 'peach', emoji: '🍑', name: 'Peach' },
  { key: 'coconut', emoji: '🥥', name: 'Coconut' },
];

function openSmoothieGame() {
  /* Smoothie Smash replaced the old drag-and-blend bar. Keep this fallback so
     an older cached bundle can still open a playable smoothie game. */
  if (typeof openSmoothieSmashGame === 'function') return openSmoothieSmashGame();
  const shell = gameOverlayShell('smoothie');
  shell.hintEl.textContent = 'Drag or flick a fruit into the cup — three per order, then hold Blend.';
  let score = 0;
  let served = 0;
  let misses = 0;
  let order = [];
  let made = [];
  let blending = false;
  let blend = 0;
  let stopped = false;
  let drag = null;
  let raf = 0;
  let last = performance.now();
  const bodies = [];

  shell.board.innerHTML = '';
  const wrap = kNode('div', 'sb');
  wrap.innerHTML =
    '<div class="sb-order" data-order></div>' +
    '<div class="sb-stage" data-stage>' +
    '<div class="sb-cup" data-cup>🥤<span class="sb-fill" data-fill></span><span class="sb-cup-top"></span></div>' +
    '</div>' +
    '<div class="sb-bins" data-bins></div>' +
    '<button class="btn btn-gold btn-block" data-blend disabled>Hold to blend</button>' +
    '<div class="kf-status" data-status>Drag a fruit into the cup</div>';
  shell.board.appendChild(wrap);

  const orderEl = wrap.querySelector('[data-order]');
  const stage = wrap.querySelector('[data-stage]');
  const cup = wrap.querySelector('[data-cup]');
  const fill = wrap.querySelector('[data-fill]');
  const bins = wrap.querySelector('[data-bins]');
  const blendBtn = wrap.querySelector('[data-blend]');
  const statusEl = wrap.querySelector('[data-status]');

  const setScore = () => { shell.scoreEl.textContent = String(score); };

  const cupBox = () => {
    const stageRect = stage.getBoundingClientRect();
    const cupRect = cup.getBoundingClientRect();
    return {
      cx: cupRect.left + cupRect.width / 2 - stageRect.left,
      top: cupRect.top - stageRect.top,
      width: cupRect.width,
    };
  };

  const renderOrder = () => {
    orderEl.innerHTML = order.map((fruit) => {
      const done = made.includes(fruit.key);
      return `<span class="sb-need${done ? ' done' : ''}">${fruit.emoji}<i>${fruit.name}</i></span>`;
    }).join('');
    fill.style.height = `${(made.length / 3) * 74}%`;
  };

  const newOrder = () => {
    order = kShuffle(SMOOTHIE_FRUIT).slice(0, 3);
    made = [];
    blend = 0;
    blendBtn.disabled = true;
    blendBtn.classList.remove('charging');
    statusEl.textContent = 'Drag a fruit into the cup';
    statusEl.classList.remove('good');
    renderOrder();
  };

  const finish = () => {
    if (stopped) return;
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    bodies.slice().forEach((b) => b.el.remove());
    showGameResult(shell, {
      kind: 'smoothie',
      score,
      coins: 16 + served * 7 + score,
      xp: 28 + served * 8,
      blurb: served ? `${served} smoothie${served > 1 ? 's' : ''} blended!` : 'The blender stayed cold.',
    });
  };

  const collect = (key) => {
    const wanted = order.some((f) => f.key === key) && !made.includes(key);
    if (wanted) {
      made.push(key);
      score += 6;
      Sfx.sip();
      kFloatText(wrap, '+6', 'good');
      if (made.length >= order.length) {
        blendBtn.disabled = false;
        statusEl.textContent = 'Hold Blend to finish the order';
        statusEl.classList.add('good');
      }
    } else {
      misses += 1;
      score = Math.max(0, score - 3);
      Sfx.error();
      kFloatText(wrap, 'not in order', 'bad');
    }
    setScore();
    renderOrder();
  };

  const makeBody = (key, x, y, vx, vy) => {
    const fruit = SMOOTHIE_FRUIT.find((f) => f.key === key);
    if (!fruit) return;
    const el = kNode('span', 'sb-fruit', fruit.emoji);
    stage.appendChild(el);
    el.style.transform = `translate(${x}px, ${y}px)`;
    bodies.push({ el, key, x, y, vx, vy, bounces: 0 });
  };

  const step = (now) => {
    if (stopped) return;
    const dt = Math.min(40, now - last) / 1000;
    last = now;
    const box = cupBox();
    const height = stage.clientHeight;
    for (let i = bodies.length - 1; i >= 0; i -= 1) {
      const b = bodies[i];
      b.vy += 1600 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y > height - 16) {
        b.y = height - 16;
        b.vy *= -0.42;
        b.vx *= 0.82;
        b.bounces += 1;
      }
      if (b.x < 14) { b.x = 14; b.vx = Math.abs(b.vx) * 0.6; }
      if (b.x > stage.clientWidth - 14) { b.x = stage.clientWidth - 14; b.vx = -Math.abs(b.vx) * 0.6; }
      b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      const nearCup = b.y > box.top && Math.abs(b.x - box.cx) < box.width / 2 + 8;
      if (nearCup) {
        b.el.classList.add('in');
        setTimeout(() => b.el.remove(), 180);
        bodies.splice(i, 1);
        collect(b.key);
      } else if (b.bounces > 2 || b.y > height + 40) {
        b.el.remove();
        bodies.splice(i, 1);
      }
    }
    raf = requestAnimationFrame(step);
  };

  const overCup = (clientX, clientY) => {
    const rect = cup.getBoundingClientRect();
    return clientX >= rect.left - 18 && clientX <= rect.right + 18
      && clientY >= rect.top - 14 && clientY <= rect.bottom + 10;
  };

  bins.innerHTML = SMOOTHIE_FRUIT.map((f) => `<button class="sb-bin" data-fruit="${f.key}">${f.emoji}<i>${f.name}</i></button>`).join('');

  bins.addEventListener('pointerdown', (event) => {
    const btn = event.target.closest('[data-fruit]');
    if (!btn || stopped) return;
    event.preventDefault();
    const stageRect = stage.getBoundingClientRect();
    const el = kNode('span', 'sb-fruit drag', SMOOTHIE_FRUIT.find((f) => f.key === btn.dataset.fruit).emoji);
    stage.appendChild(el);
    drag = {
      el,
      key: btn.dataset.fruit,
      x: event.clientX - stageRect.left,
      y: event.clientY - stageRect.top,
      lastX: event.clientX,
      lastY: event.clientY,
      at: performance.now(),
    };
    el.style.transform = `translate(${drag.x}px, ${drag.y}px)`;
  });

  const onMove = (event) => {
    if (!drag) return;
    const stageRect = stage.getBoundingClientRect();
    drag.x = event.clientX - stageRect.left;
    drag.y = event.clientY - stageRect.top;
    drag.el.style.transform = `translate(${drag.x}px, ${drag.y}px)`;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  };

  const onUp = (event) => {
    if (!drag) return;
    const held = drag;
    drag = null;
    if (overCup(event.clientX, event.clientY)) {
      held.el.classList.add('in');
      setTimeout(() => held.el.remove(), 160);
      collect(held.key);
      return;
    }
    const dt = Math.max(0.05, (performance.now() - held.at) / 1000);
    const vx = Math.max(-900, Math.min(900, (event.clientX - held.lastX) / dt * 0.6));
    const vy = Math.min(400, (event.clientY - held.lastY) / dt * 0.4);
    held.el.remove();
    makeBody(held.key, held.x, held.y, vx, vy + 120);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  shell.addCleanup(() => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  });

  let blendRaf = 0;
  const blendStep = () => {
    if (!blending) return;
    blend = Math.min(1, blend + 0.026);
    fill.style.height = `${(made.length / 3) * 74 * (0.55 + blend * 0.45)}%`;
    blendBtn.style.setProperty('--charge', `${Math.round(blend * 100)}%`);
    if (blend >= 1) {
      blending = false;
      blendBtn.classList.remove('charging');
      blendBtn.disabled = true;
      served += 1;
      score += 24 + (misses === 0 ? 10 : 0);
      misses = 0;
      Sfx.chime();
      kFloatText(wrap, 'order up!', 'good');
      setScore();
      newOrder();
      return;
    }
    blendRaf = requestAnimationFrame(blendStep);
  };

  const startBlend = () => {
    if (stopped || blendBtn.disabled || made.length < order.length) return;
    blending = true;
    Sfx.tap();
    blendBtn.classList.add('charging');
    blendRaf = requestAnimationFrame(blendStep);
  };
  const stopBlend = () => {
    if (!blending) return;
    blending = false;
    blendBtn.classList.remove('charging');
    if (blendRaf) cancelAnimationFrame(blendRaf);
    if (blend < 1) {
      blend = Math.max(0, blend - 0.25);
      statusEl.textContent = 'Hold the button until the cup is full';
      statusEl.classList.remove('good');
    }
  };

  blendBtn.addEventListener('pointerdown', startBlend);
  blendBtn.addEventListener('pointerup', stopBlend);
  blendBtn.addEventListener('pointerleave', stopBlend);
  blendBtn.addEventListener('pointercancel', stopBlend);
  shell.addCleanup(() => { if (blendRaf) cancelAnimationFrame(blendRaf); });

  newOrder();
  setScore();
  raf = requestAnimationFrame(step);
  kCountdown(shell, 45, null, finish);
  shell.addCleanup(() => { stopped = true; if (raf) cancelAnimationFrame(raf); });
}

/* ---------------- NEON BEATWAY ---------------- */

const BEAT_SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

function openMusicJamGame() {
  const shell = gameOverlayShell('musicjam');
  shell.hintEl.textContent = 'Tap the lane (or press A S D F) as each tile crosses the line.';
  let score = 0;
  let chain = 0;
  let best = 0;
  let perfects = 0;
  let missed = 0;
  let stopped = false;
  let raf = 0;
  let last = performance.now();
  let spawnIn = 0;
  let speed = 52;
  const notes = [];
  const lanes = [];

  shell.board.innerHTML = '';
  const wrap = kNode('div', 'beat');
  wrap.innerHTML = '<div class="beat-hud"><span data-chain>Chain 0</span><span data-perfect>0 perfect</span></div>' +
    '<div class="beat-lanes">' +
    [0, 1, 2, 3].map((i) => `<div class="beat-lane" data-lane="${i}"><span class="beat-keys">${'ASDF'[i]}</span></div>`).join('') +
    '</div>' +
    '<div class="beat-line"></div>';
  shell.board.appendChild(wrap);

  const lanesEl = wrap.querySelector('.beat-lanes');
  const chainEl = wrap.querySelector('[data-chain]');
  const perfectEl = wrap.querySelector('[data-perfect]');
  Array.from(wrap.querySelectorAll('.beat-lane')).forEach((el) => lanes.push(el));

  const setScore = () => { shell.scoreEl.textContent = String(score); };

  const finish = () => {
    if (stopped) return;
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    notes.forEach((n) => n.el.remove());
    if (typeof Music !== 'undefined' && Music.stopHype) Music.stopHype();
    if (typeof Music !== 'undefined' && Music.start) Music.start();
    showGameResult(shell, {
      kind: 'musicjam',
      score,
      coins: 20 + perfects * 4 + score,
      xp: 34 + best * 6,
      perfect: perfects,
      blurb: best ? `Best chain ${best}!` : 'The beat got away.',
    });
  };

  const hitLane = (lane) => {
    if (stopped) return;
    const laneNotes = notes.filter((n) => n.lane === lane && !n.done);
    let target = null;
    let closest = 999;
    laneNotes.forEach((n) => {
      const distance = Math.abs(n.y - 88);
      if (n.y > 74 && n.y < 106 && distance < closest) {
        closest = distance;
        target = n;
      }
    });
    if (!target) {
      chain = 0;
      chainEl.textContent = 'Chain 0';
      lanes[lane].classList.add('miss');
      setTimeout(() => lanes[lane].classList.remove('miss'), 160);
      return;
    }
    target.done = true;
    target.el.classList.add('hit');
    setTimeout(() => target.el.remove(), 220);
    const perfect = Math.abs(target.y - 88) < 6;
    chain += 1;
    best = Math.max(best, chain);
    if (perfect) {
      perfects += 1;
      score += 12 + Math.min(10, chain);
      Sfx.tone(BEAT_SCALE[(lane + 4) % BEAT_SCALE.length] * 2, 0.09, 'triangle', 0.04);
    } else {
      score += 6 + Math.min(6, chain);
      Sfx.tone(BEAT_SCALE[lane], 0.08, 'triangle', 0.03);
    }
    chainEl.textContent = `Chain ${chain}`;
    perfectEl.textContent = `${perfects} perfect`;
    lanes[lane].classList.add('lit');
    setTimeout(() => lanes[lane].classList.remove('lit'), 90);
    setScore();
  };

  const spawn = () => {
    const lane = Math.floor(Math.random() * 4);
    const el = kNode('span', 'beat-note', '');
    lanes[lane].appendChild(el);
    notes.push({ lane, y: -6, el, done: false });
  };

  const step = (now) => {
    if (stopped) return;
    const dt = Math.min(40, now - last) / 1000;
    last = now;
    speed = Math.min(110, 52 + perfects * 0.9);
    spawnIn -= dt * 1000;
    if (spawnIn <= 0) {
      spawnIn = Math.max(240, 420 - perfects * 4);
      spawn();
    }
    for (let i = notes.length - 1; i >= 0; i -= 1) {
      const note = notes[i];
      if (note.done) { notes.splice(i, 1); continue; }
      note.y += speed * dt;
      note.el.style.top = `${note.y}%`;
      if (note.y > 108) {
        note.el.remove();
        notes.splice(i, 1);
        missed += 1;
        chain = 0;
        chainEl.textContent = 'Chain 0';
        Sfx.error();
      }
    }
    raf = requestAnimationFrame(step);
  };

  lanesEl.addEventListener('click', (event) => {
    const lane = event.target.closest('[data-lane]');
    if (lane) hitLane(Number(lane.dataset.lane));
  });

  const onKey = (event) => {
    if (stopped) return;
    const key = String(event.key || '').toLowerCase();
    const index = 'asdf'.indexOf(key);
    if (index >= 0) {
      event.preventDefault();
      hitLane(index);
    }
  };
  window.addEventListener('keydown', onKey);
  shell.addCleanup(() => window.removeEventListener('keydown', onKey));

  if (typeof Music !== 'undefined' && Music.startHype) Music.startHype();
  setScore();
  raf = requestAnimationFrame(step);
  kCountdown(shell, 35, null, finish);
  shell.addCleanup(() => { stopped = true; if (raf) cancelAnimationFrame(raf); });
}
