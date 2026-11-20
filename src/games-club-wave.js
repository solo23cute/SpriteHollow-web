/* Club-style arcade wave: pizza orders, puffle rescue, and a jetpack run.
   These are original rules and art, built on the shared game shell. */

Object.assign(GAME_INFO, {
  pizzaparlor: {
    title: 'Pizza Parlor',
    icon: '🍕',
    tag: 'Cooking',
    desc: 'Build each ticket in order. A wrong topping costs points.',
    g1: '#ff8a4c',
    g2: '#ffd166',
    medals: [
      { id: 'bronze', label: 'Bronze', icon: '🥉', at: 40 },
      { id: 'silver', label: 'Silver', icon: '🥈', at: 70 },
      { id: 'gold', label: 'Gold', icon: '🥇', at: 100 },
    ],
  },
  pufflepatrol: {
    title: 'Puffle Patrol',
    icon: '🐾',
    tag: 'Rescue',
    desc: 'Guide the rescue puffle around the ice, collect three friends, then reach the door.',
    g1: '#8be9ff',
    g2: '#b69cff',
    medals: [
      { id: 'bronze', label: 'Bronze', icon: '🥉', at: 20 },
      { id: 'silver', label: 'Silver', icon: '🥈', at: 35 },
      { id: 'gold', label: 'Gold', icon: '🥇', at: 50 },
    ],
  },
  jetpackjaunt: {
    title: 'Jetpack Jaunt',
    icon: '🚀',
    tag: 'Action',
    desc: 'Hold to rise and release to fall. Collect coins and dodge the rocks.',
    g1: '#ff9a5a',
    g2: '#8b7bff',
    medals: [
      { id: 'bronze', label: 'Bronze', icon: '🥉', at: 20 },
      { id: 'silver', label: 'Silver', icon: '🥈', at: 50 },
      { id: 'gold', label: 'Gold', icon: '🥇', at: 80 },
    ],
  },
});

/* Shared Club-wave plumbing: mount the board, render a countdown, and clean
   up listeners with the overlay. */
function clubGameShell(kind, hint, body) {
  const shell = gameOverlayShell(kind);
  shell.hintEl.textContent = hint;
  shell.board.innerHTML = `${body}${gameMiniSprite()}`;
  return shell;
}

function clubGameEvents(shell, bindings) {
  bindings.forEach(([target, type, handler, options]) => {
    target.addEventListener(type, handler, options);
    shell.addCleanup(() => target.removeEventListener(type, handler, options));
  });
}

function clubGameTimer(shell, seconds) {
  let remaining = seconds;
  const render = () => {
    shell.timerEl.textContent = `${Math.ceil(remaining)}s`;
    shell.timerBar.style.width = `${(remaining / seconds) * 100}%`;
  };
  const timer = {
    get remaining() { return remaining; },
    tick(delta) {
      remaining = Math.max(0, remaining - delta);
      render();
      return remaining <= 0;
    },
  };
  render();
  return timer;
}

function clubGameCountdown(shell, seconds, onEnd) {
  const timer = clubGameTimer(shell, seconds);
  let stopped = false;
  const clock = setInterval(() => {
    if (stopped) return;
    if (!timer.tick(0.1)) return;
    stopped = true;
    clearInterval(clock);
    onEnd();
  }, 100);
  const stop = () => {
    if (stopped) return;
    stopped = true;
    clearInterval(clock);
  };
  shell.addCleanup(stop);
  return {
    get remaining() { return timer.remaining; },
    stop,
  };
}

/* ---------------- PIZZA PARLOR ---------------- */

const PIZZA_TOPS = [
  { key: 'cheese', name: 'Cheese', icon: '🧀' },
  { key: 'tomato', name: 'Tomato', icon: '🍅' },
  { key: 'mushroom', name: 'Mushroom', icon: '🍄' },
  { key: 'pepper', name: 'Pepper', icon: '🌶️' },
  { key: 'olive', name: 'Olive', icon: '🫒' },
  { key: 'herb', name: 'Herb', icon: '🌿' },
  { key: 'pineapple', name: 'Pineapple', icon: '🍍' },
  { key: 'fish', name: 'Fish', icon: '🐟' },
];

function openPizzaParlorGame() {
  const shell = clubGameShell('pizzaparlor', 'Tap the toppings in ticket order. Finish pizzas before the oven timer runs out.', `<div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;padding:14px;overflow:auto">
      <div class="between" style="align-items:flex-start">
        <div>
          <div class="tiny muted" style="font-weight:800;letter-spacing:.1em">TICKET</div>
          <div data-pizza-order style="font-size:24px;letter-spacing:5px;min-height:32px"></div>
        </div>
        <span class="chip" data-pizza-served>0 served</span>
      </div>
      <div data-pizza-pan style="min-height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:4px;background:radial-gradient(circle,#ffd166,#e08a35);border:5px solid #b65c2a;box-shadow:inset 0 0 0 5px rgba(255,255,255,.14);font-size:24px"></div>
      <div data-pizza-tops style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px"></div>
      <div class="tiny muted" data-pizza-note style="text-align:center">Tap the first topping.</div>
    </div>`);
  const { board } = shell;
  const orderEl = board.querySelector('[data-pizza-order]');
  const pan = board.querySelector('[data-pizza-pan]');
  const topsEl = board.querySelector('[data-pizza-tops]');
  const servedEl = board.querySelector('[data-pizza-served]');
  const note = board.querySelector('[data-pizza-note]');
  let order = [];
  let step = 0;
  let score = 0;
  let served = 0;
  let running = true;
  let locked = false;

  topsEl.innerHTML = PIZZA_TOPS.map((top, index) => `<button class="chip" data-pizza-top="${index}" type="button" style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 4px;font-size:20px"><span>${top.icon}</span><span style="font-size:9px">${top.name}</span></button>`).join('');

  function setNote(text) {
    note.textContent = text;
  }

  function nextOrder() {
    order = PIZZA_TOPS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    step = 0;
    locked = false;
    orderEl.innerHTML = order.map((top, index) => `<span data-order-step="${index}" style="opacity:.35;transition:opacity .15s">${top.icon}</span>`).join('');
    pan.innerHTML = '';
    servedEl.textContent = `${served} served`;
    setNote(`Start with ${order[0].name}.`);
  }

  function tapTopping(index) {
    if (!running || locked) return;
    const top = PIZZA_TOPS[index];
    if (!top) return;
    if (top.key !== order[step].key) {
      score = Math.max(0, score - 2);
      shell.scoreEl.textContent = score;
      Sfx.error();
      setNote(`That is ${top.name}. The ticket wants ${order[step].name}.`);
      return;
    }
    const orderStep = orderEl.querySelector(`[data-order-step="${step}"]`);
    if (orderStep) orderStep.style.opacity = '1';
    const topping = document.createElement('span');
    topping.textContent = top.icon;
    topping.style.fontSize = '24px';
    pan.appendChild(topping);
    step += 1;
    Sfx.pop();
    if (step < order.length) {
      setNote(`Next: ${order[step].name}.`);
      return;
    }
    locked = true;
    served += 1;
    score += 10 + Math.ceil(countdown.remaining / 8);
    shell.scoreEl.textContent = score;
    servedEl.textContent = `${served} served`;
    Sfx.win();
    burstOn(pan, ['🍕', '✨'], 8);
    setNote('Order up! Next ticket coming in.');
    setTimeout(() => {
      if (running) nextOrder();
    }, 420);
  }

  topsEl.querySelectorAll('[data-pizza-top]').forEach((btn) => {
    btn.addEventListener('click', () => tapTopping(Number(btn.dataset.pizzaTop)));
  });

  nextOrder();
  const countdown = clubGameCountdown(shell, 32, finish);

  function finish() {
    if (!running) return;
    running = false;
    locked = true;
    countdown.stop();
    const coins = Math.min(120, 16 + score);
    const xp = Math.min(70, 14 + Math.round(score / 2));
    showGameResult(shell, {
      kind: 'pizzaparlor', score, coins, xp,
      blurb: served >= 8 ? 'The parlor is running like clockwork!' : served >= 4 ? 'A solid dinner rush!' : 'The oven is still warming up.',
    });
  }
}

/* ---------------- PUFFLE PATROL ---------------- */

const PATROL_SIZE = 5;
const PATROL_TIME = 30;

function openPufflePatrolGame() {
  const shell = clubGameShell('pufflepatrol', 'Tap a neighbouring tile or use the arrows. Collect all three puffles, then reach the door.', `<div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:9px;padding:12px;overflow:auto">
      <div class="between"><span class="tiny muted">Rescue three puffles from the ice</span><span class="chip" data-patrol-found>0 / 3</span></div>
      <div data-patrol-grid style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;flex:1;min-height:190px"></div>
      <div data-patrol-pad style="display:grid;grid-template-columns:repeat(3,42px);gap:6px;justify-content:center">
        <span></span><button class="chip" data-patrol-move="up" type="button" aria-label="Move up">▲</button><span></span>
        <button class="chip" data-patrol-move="left" type="button" aria-label="Move left">◀</button>
        <button class="chip" data-patrol-move="down" type="button" aria-label="Move down">▼</button>
        <button class="chip" data-patrol-move="right" type="button" aria-label="Move right">▶</button>
      </div>
      <div class="tiny muted" data-patrol-note style="text-align:center">The puffles are hiding in the ice.</div>
    </div>`);
  const { board } = shell;
  const grid = board.querySelector('[data-patrol-grid]');
  const foundEl = board.querySelector('[data-patrol-found]');
  const note = board.querySelector('[data-patrol-note]');
  const cells = Array.from({ length: PATROL_SIZE * PATROL_SIZE }, () => ({ kind: 'ice' }));
  const spots = Array.from({ length: PATROL_SIZE * PATROL_SIZE - 2 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, 7);
  spots.slice(0, 3).forEach((index) => { cells[index].kind = 'puffle'; });
  spots.slice(3).forEach((index) => { cells[index].kind = 'hazard'; });
  cells[PATROL_SIZE * PATROL_SIZE - 1].kind = 'exit';
  let player = { x: 0, y: 0 };
  let found = 0;
  let score = 0;
  let running = true;

  function tileIcon(cell, index) {
    if (player.y * PATROL_SIZE + player.x === index) return '🐾';
    if (cell.kind === 'puffle') return '🐹';
    if (cell.kind === 'hazard') return '🌊';
    if (cell.kind === 'exit') return '🚪';
    return '❄️';
  }

  function paint() {
    grid.innerHTML = cells.map((cell, index) => {
      const here = player.y * PATROL_SIZE + player.x === index;
      const tone = cell.kind === 'hazard' ? 'rgba(139,123,255,.24)' : cell.kind === 'exit' ? 'rgba(255,209,102,.22)' : 'rgba(255,255,255,.08)';
      return `<button type="button" data-patrol-cell="${index}" aria-label="Ice tile ${index + 1}" style="min-height:34px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:${here ? 'rgba(255,255,255,.24)' : tone};font-size:19px;line-height:1">${tileIcon(cell, index)}</button>`;
    }).join('');
    foundEl.textContent = `${found} / 3`;
    shell.scoreEl.textContent = Math.floor(score);
  }

  function move(dx, dy) {
    if (!running) return;
    const nextX = Math.max(0, Math.min(PATROL_SIZE - 1, player.x + dx));
    const nextY = Math.max(0, Math.min(PATROL_SIZE - 1, player.y + dy));
    if (nextX === player.x && nextY === player.y) return;
    player = { x: nextX, y: nextY };
    const cell = cells[player.y * PATROL_SIZE + player.x];
    if (cell.kind === 'puffle') {
      cell.kind = 'ice';
      found += 1;
      score += 10;
      Sfx.win();
      burstOn(grid, ['🐹', '✨', '💗'], 7);
      note.textContent = found >= 3 ? 'All three found. Head for the door!' : `${3 - found} puffle${3 - found === 1 ? '' : 's'} still lost.`;
    } else if (cell.kind === 'hazard') {
      score = Math.max(0, score - 3);
      Sfx.error();
      note.textContent = 'Splash! The cold water costs points.';
    } else if (cell.kind === 'exit') {
      if (found >= 3) {
        finish();
        return;
      }
      note.textContent = 'The door is frozen until all three puffles are found.';
    } else {
      Sfx.tick();
    }
    paint();
  }

  grid.addEventListener('click', (event) => {
    const tile = event.target instanceof Element ? event.target.closest('[data-patrol-cell]') : null;
    if (!tile) return;
    const index = Number(tile.dataset.patrolCell);
    const x = index % PATROL_SIZE;
    const y = Math.floor(index / PATROL_SIZE);
    if (Math.abs(x - player.x) + Math.abs(y - player.y) === 1) move(x - player.x, y - player.y);
  });
  const directions = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  board.querySelectorAll('[data-patrol-move]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const direction = directions[btn.dataset.patrolMove];
      if (direction) move(direction[0], direction[1]);
    });
  });
  const onKey = (event) => {
    if (event.key === 'ArrowUp') { event.preventDefault(); move(0, -1); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); move(0, 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1, 0); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); move(1, 0); }
  };
  clubGameEvents(shell, [[document, 'keydown', onKey]]);

  function finish() {
    if (!running) return;
    running = false;
    countdown.stop();
    const total = Math.floor(score + countdown.remaining);
    const coins = Math.min(120, 16 + total);
    const xp = Math.min(75, 12 + Math.round(total / 2));
    showGameResult(shell, {
      kind: 'pufflepatrol', score: total, coins, xp,
      blurb: found >= 3 ? 'Every puffle made it home!' : `${found} puffle${found === 1 ? '' : 's'} rescued before the ice closed in.`,
    });
  }

  const countdown = clubGameCountdown(shell, PATROL_TIME, finish);
  paint();
}

/* ---------------- JETPACK JAUNT ---------------- */

function openJetpackJauntGame() {
  const shell = clubGameShell('jetpackjaunt', 'Hold anywhere on the sky to rise, release to fall. Collect coins and dodge the rocks.', `<div data-jet-track style="position:absolute;inset:0;overflow:hidden;border-radius:14px;background:linear-gradient(180deg,#211b46,#4d3a7a 45%,#f09a7a 100%);touch-action:none">
      <div aria-hidden="true" style="position:absolute;inset:0;opacity:.55;background-image:radial-gradient(#fff 1px,transparent 1px),radial-gradient(#fff 1px,transparent 1px);background-size:43px 53px,71px 67px;background-position:0 0,21px 17px"></div>
      <div data-jet-items></div>
      <span data-jet-player style="position:absolute;left:20%;top:50%;transform:translate(-50%,-50%);font-size:32px;filter:drop-shadow(0 0 8px rgba(255,209,102,.8));z-index:2">🚀</span>
      <div class="tiny muted" style="position:absolute;left:0;right:0;bottom:8px;text-align:center;color:#fff;text-shadow:0 1px 3px #000;pointer-events:none">Hold to fly · release to fall</div>
    </div>`);
  const { board } = shell;
  const track = board.querySelector('[data-jet-track]');
  const playerEl = board.querySelector('[data-jet-player]');
  const itemsEl = board.querySelector('[data-jet-items]');
  const items = [];
  let y = 50;
  let vy = 0;
  let thrust = false;
  let score = 0;
  let running = true;
  const timer = clubGameTimer(shell, 30);
  let invulnerable = 0;
  let last = performance.now();
  let raf = 0;

  function spawn() {
    if (!running) return;
    const type = Math.random() < 0.34 ? 'coin' : 'rock';
    const itemY = 14 + Math.random() * 72;
    const el = document.createElement('span');
    el.textContent = type === 'coin' ? '🪙' : '🪨';
    el.style.cssText = `position:absolute;left:105%;top:${itemY}%;transform:translate(-50%,-50%);font-size:${type === 'coin' ? '22px' : '28px'};z-index:1`;
    itemsEl.appendChild(el);
    items.push({ el, x: 105, y: itemY, type, dead: false });
  }

  function removeItem(item) {
    item.dead = true;
    item.el.remove();
  }

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    clearInterval(spawnTimer);
    items.splice(0).forEach((item) => item.el.remove());
  };

  function finish() {
    if (!running) return;
    stop();
    const coins = Math.min(130, 18 + Math.floor(score));
    const xp = Math.min(80, 14 + Math.round(score / 2));
    showGameResult(shell, {
      kind: 'jetpackjaunt', score: Math.floor(score), coins, xp: xp,
      blurb: score >= 80 ? 'Sky-high flying!' : score >= 35 ? 'A smooth flight through the clouds.' : 'The jetpack is still warming up.',
    });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    timer.tick(dt);
    if (invulnerable > 0) invulnerable = Math.max(0, invulnerable - dt);
    vy += (thrust ? -118 : 104) * dt;
    vy = Math.max(-54, Math.min(56, vy));
    y += vy * dt;
    if (y < 8) { y = 8; vy = 0; }
    if (y > 92) { y = 92; vy = 0; }
    playerEl.style.top = `${y}%`;
    score += dt * 1.7;
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const item = items[i];
      if (item.dead) { items.splice(i, 1); continue; }
      item.x -= 34 * dt;
      item.el.style.left = `${item.x}%`;
      if (item.x < -8) { removeItem(item); items.splice(i, 1); continue; }
      if (Math.abs(item.x - 20) < 6 && Math.abs(item.y - y) < 8) {
        if (item.type === 'coin') {
          score += 10;
          Sfx.coin();
          burstOn(track, ['🪙', '✨'], 4);
        } else if (invulnerable <= 0) {
          score = Math.max(0, score - 4);
          invulnerable = 0.9;
          Sfx.error();
          if (track.animate) track.animate([{ filter: 'brightness(2)' }, { filter: 'brightness(1)' }], { duration: 220 });
        }
        removeItem(item);
        items.splice(i, 1);
      }
    }
    shell.scoreEl.textContent = Math.floor(score);
    if (timer.remaining <= 0) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  const setThrust = (value) => {
    thrust = value;
    track.style.filter = value ? 'brightness(1.08)' : '';
  };
  const pointerDown = (event) => { event.preventDefault(); setThrust(true); };
  const pointerUp = () => setThrust(false);
  const isThrustKey = (event) => event.code === 'Space' || event.key === ' ';
  const keyDown = (event) => {
    if (isThrustKey(event)) { event.preventDefault(); setThrust(true); }
  };
  const keyUp = (event) => {
    if (isThrustKey(event)) setThrust(false);
  };
  clubGameEvents(shell, [
    [track, 'pointerdown', pointerDown],
    [window, 'pointerup', pointerUp],
    [window, 'pointercancel', pointerUp],
    [document, 'keydown', keyDown],
    [document, 'keyup', keyUp],
  ]);
  const spawnTimer = setInterval(spawn, 780);

  raf = requestAnimationFrame((now) => { last = now; frame(now); });
  shell.addCleanup(stop);
}

const CLUB_GAME_OPENERS = {
  pizzaparlor: openPizzaParlorGame,
  pufflepatrol: openPufflePatrolGame,
  jetpackjaunt: openJetpackJauntGame,
};

if (typeof openGame !== 'undefined') {
  const prevOpenGameClub = window.openGame;
  window.openGame = function (kind) {
    return Object.prototype.hasOwnProperty.call(CLUB_GAME_OPENERS, kind)
      ? CLUB_GAME_OPENERS[kind]()
      : prevOpenGameClub(kind);
  };
}
