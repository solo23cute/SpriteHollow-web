/* More Virtual Pet mini-games:
   1. Fetch Frenzy (tap the hopping toy)
   2. Fluff & Brush (tap away every muddy patch)
   3. Dance Party (tap the pad that lights up) */

const PET_MORE_GAMES_INFO = {
  petfetch: { title: 'Fetch Frenzy', icon: '🎾', tag: 'Fetch & Dash', desc: 'Tap the toy every time it hops before the clock runs out.', g1: '#ffb347', g2: '#7ee787' },
  petgroom: { title: 'Fluff & Brush', icon: '🧽', tag: 'Groom & Glow', desc: 'Tap every muddy patch to brush your sprite fluffy again.', g1: '#8be9ff', g2: '#ff9ec7' },
  pufflegroom: { title: 'Brush & Bliss', icon: '🪮', tag: 'Puffle Hotel Spa', desc: 'Brush every hair tangle and tooth sparkle before the spa bell rings.', g1: '#ff9ec7', g2: '#ffd166' },
  petdance: { title: 'Dance Party', icon: '💃', tag: 'Rhythm Paws', desc: 'Tap the pad that lights up before it fades away.', g1: '#c084fc', g2: '#f472b6' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, PET_MORE_GAMES_INFO);

function petGameCountdown(shell, seconds, onEnd) {
  const total = seconds * 1000;
  const startedAt = performance.now();
  const tick = setInterval(() => {
    const left = Math.max(0, total - (performance.now() - startedAt));
    shell.timerEl.textContent = `${Math.ceil(left / 1000)}s`;
    shell.timerBar.style.width = `${Math.max(0, (left / total) * 100)}%`;
    if (left <= 0) onEnd();
  }, 100);
  shell.addCleanup(() => clearInterval(tick));
  return tick;
}

/* ---------------- 1. FETCH FRENZY ---------------- */
function openFetchGame() {
  const shell = gameOverlayShell('petfetch');
  const { board } = shell;
  const s = activeSprite();
  let score = 0;
  let hits = 0;
  let running = true;
  let finished = false;

  board.innerHTML = `<div style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#14351f,#1f5230 62%,#2c6b3c)">
      ${s ? `<div style="position:absolute;left:8%;bottom:16%;width:62px">${spriteSVG(s, { expr: 'happy' })}</div>` : ''}
      <button data-toy style="position:absolute;left:45%;top:40%;font-size:36px;line-height:1;background:none;border:0;cursor:pointer;touch-action:manipulation;transition:left .16s ease,top .16s ease">🎾</button>
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:8%;color:#fff;text-align:center">Tap the toy each time it hops.</div>
    </div>`;

  const toy = board.querySelector('[data-toy]');

  function hop() {
    if (!running) return;
    toy.style.left = `${8 + Math.random() * 76}%`;
    toy.style.top = `${12 + Math.random() * 60}%`;
  }

  const hopper = setInterval(hop, 900);

  toy.addEventListener('click', () => {
    if (!running) return;
    score += 2;
    hits += 1;
    shell.scoreEl.textContent = score;
    Sfx.coin();
    burstOn(toy, ['🎾', '✨'], 3);
    hop();
  });

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    clearInterval(hopper);
    showGameResult(shell, {
      kind: 'petfetch',
      score,
      coins: Math.min(90, 12 + score * 4),
      xp: 12 + score * 2,
      blurb: hits >= 12 ? 'Best fetch session ever!' : hits >= 6 ? 'A very good game of fetch.' : 'They chased every single hop.',
    });
  }

  petGameCountdown(shell, 20, finish);
  shell.addCleanup(() => {
    running = false;
    clearInterval(hopper);
  });
}

/* ---------------- 2. FLUFF & BRUSH ---------------- */
function openGroomGame() {
  const shell = gameOverlayShell('petgroom');
  const { board } = shell;
  const s = activeSprite();
  let score = 0;
  let cleaned = 0;
  let running = true;
  let finished = false;
  const spots = Array.from({ length: 10 }, () => ({
    left: 10 + Math.random() * 72,
    top: 12 + Math.random() * 58,
  }));

  board.innerHTML = `<div style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#123047,#1d4a63 62%,#2b6b7d)">
      <div style="position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);width:96px">${s ? spriteSVG(s, { expr: 'idle' }) : '🐾'}</div>
      ${spots.map((p, i) => `<button data-spot="${i}" style="position:absolute;left:${p.left}%;top:${p.top}%;width:44px;height:44px;font-size:18px;line-height:1;border-radius:50%;border:2px solid rgba(255,255,255,.5);background:rgba(120,84,52,.9);cursor:pointer;touch-action:manipulation">🫧</button>`).join('')}
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:7%;color:#fff;text-align:center">Tap every muddy patch to brush it away.</div>
    </div>`;

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    showGameResult(shell, {
      kind: 'petgroom',
      score,
      coins: Math.min(90, 12 + score * 4),
      xp: 12 + score * 2,
      blurb: cleaned >= 10 ? 'Squeaky clean and glowing!' : cleaned >= 5 ? 'Much fluffier now.' : 'A quick tidy up.',
    });
  }

  board.querySelectorAll('[data-spot]').forEach((spot) => {
    spot.addEventListener('click', () => {
      if (!running || spot.disabled) return;
      spot.disabled = true;
      spot.style.opacity = '0';
      cleaned += 1;
      score += 2;
      shell.scoreEl.textContent = score;
      Sfx.pop();
      burstOn(spot, ['🫧', '✨'], 3);
      if (cleaned >= spots.length) setTimeout(finish, 300);
    });
  });

  petGameCountdown(shell, 20, finish);
  shell.addCleanup(() => { running = false; });
}

/* ---------------- 3. PUFFLE HOTEL SPA ---------------- */
function openPuffleSpaGame() {
  const shell = gameOverlayShell('pufflegroom');
  const { board } = shell;
  const s = activeSprite();
  if (!s || s.stage === 'egg') {
    toast('Hatch a sprite first to book a spa day.', '🪮');
    shell.close();
    return;
  }
  const hairSlots = [
    [31, 15], [45, 11], [60, 16], [25, 28], [40, 25], [58, 30], [70, 25],
  ];
  const teethSlots = [
    [35, 55], [46, 51], [57, 55], [31, 65], [43, 61], [55, 66], [66, 60],
  ];
  const targets = [
    ...hairSlots.map(([left, top], index) => ({ kind: 'hair', index, left, top })),
    ...teethSlots.map(([left, top], index) => ({ kind: 'teeth', index, left, top })),
  ];
  let score = 0;
  let hair = 0;
  let teeth = 0;
  let running = true;
  let finished = false;

  board.innerHTML = `<div class="spa-salon">
      <span class="spa-lamp a" aria-hidden="true"></span><span class="spa-lamp b" aria-hidden="true"></span>
      <span class="spa-mirror" aria-hidden="true"></span>
      <div class="spa-puffle">${spriteSVG(s, { expr: 'happy' })}</div>
      <span class="spa-zone hair" aria-hidden="true">HAIR</span>
      <span class="spa-zone teeth" aria-hidden="true">TEETH</span>
      ${targets.map((target) => `<button class="spa-target is-${target.kind}" type="button" data-spa-target data-kind="${target.kind}" style="left:${target.left}%;top:${target.top}%" aria-label="Brush ${target.kind} spot ${target.index + 1}">${target.kind === 'hair' ? '🌀' : '✨'}</button>`).join('')}
      <div class="spa-caption">Brush the tangles and sparkles. Everything else is a very good hair day.</div>
    </div>`;

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    showGameResult(shell, {
      kind: 'pufflegroom',
      score,
      coins: 180,
      xp: 18 + score * 2,
      perfect: hair + teeth,
      blurb: hair >= 7 && teeth >= 7 ? 'Perfect fluff and a dazzling smile!' : hair + teeth >= 10 ? 'Spa day, sorted.' : 'A lovely little pamper session.',
      rewardHtml: `
        <span class="chip" style="background:#fce7f3;color:#9d174d">🪮 Hair ${hair}/7</span>
        <span class="chip" style="background:#e0f2fe;color:#075985">🪥 Teeth ${teeth}/7</span>
        <span class="chip" style="background:#fef3c7;color:#92400e">🍽️ +1 Hotel treat or drink</span>
        <span class="chip" style="background:#dcfce7;color:#166534">🏨 +1 Care Bonus moment</span>
        <span class="chip">💗 +bond</span>`,
      collect: () => Actions.finishGroomGame({ score, hair, teeth, perfect: hair + teeth }),
      onCollected: (res) => {
        if (!res || !res.ok) {
          toast('The spa could not save that visit. Try again from the hotel.', '🏨');
          return;
        }
        const item = res.foodKey && FOODS[res.foodKey] ? `${FOODS[res.foodKey].emoji} ${FOODS[res.foodKey].name}` : 'a hotel treat';
        toast(`+${res.coins} coins · +${res.xp} XP · ${item}`, '🪮');
        if (res.careGift) toast(`🏨 Hotel Care Bonus: +${res.careGift.coins} coins · +${res.careGift.xp} XP`, '🏨');
      },
    });
  }

  board.querySelectorAll('[data-spa-target]').forEach((target) => {
    target.addEventListener('click', (event) => {
      if (!running || target.disabled) return;
      target.disabled = true;
      target.classList.add('is-cleaned');
      const kind = target.dataset.kind;
      if (kind === 'hair') hair += 1;
      else teeth += 1;
      score += 4;
      shell.scoreEl.textContent = score;
      Sfx.pop();
      burstOn(target, kind === 'hair' ? ['🪮', '✨', '🫧'] : ['🪥', '✨', '💙'], 4);
      if (hair + teeth >= targets.length) setTimeout(finish, 260);
    });
  });

  petGameCountdown(shell, 22, finish);
  shell.addCleanup(() => { running = false; });
}

/* ---------------- 4. DANCE PARTY ---------------- */
function openDanceGame() {
  const shell = gameOverlayShell('petdance');
  const { board } = shell;
  const s = activeSprite();
  const PADS = ['🎵', '🎶', '💫', '⭐'];
  let score = 0;
  let hits = 0;
  let lit = -1;
  let running = true;
  let finished = false;

  board.innerHTML = `<div style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#2a1140,#4c1d6b 62%,#7a2a8c)">
      ${s ? `<div style="position:absolute;left:50%;top:14%;transform:translateX(-50%);width:72px">${spriteSVG(s, { expr: 'happy' })}</div>` : ''}
      <div style="position:absolute;left:8%;right:8%;bottom:14%;display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${PADS.map((icon, i) => `<button data-pad="${i}" style="padding:18px 0;font-size:26px;line-height:1;border-radius:16px;border:2px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;touch-action:manipulation">${icon}</button>`).join('')}
      </div>
      <div class="tiny" style="position:absolute;left:0;right:0;bottom:6%;color:#fff;text-align:center">Tap the pad that lights up.</div>
    </div>`;

  const pads = [...board.querySelectorAll('[data-pad]')];

  function paintPads() {
    pads.forEach((pad, i) => {
      pad.style.background = i === lit ? 'rgba(255,209,102,.9)' : 'rgba(255,255,255,.08)';
      pad.style.color = i === lit ? '#20122b' : '#fff';
    });
  }

  function lightPad() {
    if (!running) return;
    lit = Math.floor(Math.random() * pads.length);
    paintPads();
    setTimeout(() => {
      if (!running || lit < 0) return;
      lit = -1;
      paintPads();
    }, 780);
  }

  const lighter = setInterval(lightPad, 1000);

  pads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
      if (!running) return;
      if (i === lit) {
        score += 2;
        hits += 1;
        lit = -1;
        paintPads();
        shell.scoreEl.textContent = score;
        Sfx.coin();
        burstOn(pad, ['🎵', '✨'], 3);
      } else {
        Sfx.error();
      }
    });
  });

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    clearInterval(lighter);
    showGameResult(shell, {
      kind: 'petdance',
      score,
      coins: Math.min(90, 12 + score * 4),
      xp: 12 + score * 2,
      blurb: hits >= 10 ? 'The whole Hollow is dancing!' : hits >= 5 ? 'Great rhythm!' : 'A wobbly little dance.',
    });
  }

  lightPad();
  petGameCountdown(shell, 20, finish);
  shell.addCleanup(() => {
    running = false;
    clearInterval(lighter);
  });
}

/* Hook openGame so the new pet games launch from the Activities menu. */
if (typeof openGame !== 'undefined') {
  const prevOpenGamePetMore = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'petfetch') return openFetchGame();
    if (kind === 'petgroom') return openGroomGame();
    if (kind === 'pufflegroom') return openPuffleSpaGame();
    if (kind === 'petdance') return openDanceGame();
    return prevOpenGamePetMore(kind);
  };
}
