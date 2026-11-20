/* Slam Dunk: a side-view basketball game. Leap from the court, tap SLAM near
   the rim, and the ball is pushed down through the net. Timing decides whether
   it is a clean dunk, a strong finish, or a miss. */

function openSlamDunkGame(kind = 'hoop') {
  const info = SPORT_GAMES[kind];
  if (!info) return;
  const s = activeSprite();
  if (!s) {
    toast('Hatch a sprite first to play sports together.', '🥚');
    return;
  }
  if (s.stage === 'egg') {
    toast('Hatch this egg before heading to the court.', '🥚');
    return;
  }
  Sfx.init();
  const shell = gameOverlayShell(kind);
  const { board } = shell;

  board.innerHTML = `<div class="slam-wrap">
      <div class="slam-crowd" aria-hidden="true"></div>
      <div class="slam-scoreboard">
        <span>Dunk <b data-slam-attempt>0 / ${info.shots}</b></span>
        <span>Score <b data-slam-score>0</b></span>
        <span>Streak <b data-slam-streak>0</b></span>
      </div>
      <div class="slam-hoop" data-slam-hoop>
        <div class="slam-board"><i></i></div>
        <div class="slam-rim" data-slam-rim></div>
        <div class="slam-net" data-slam-net></div>
      </div>
      <div class="slam-court"></div>
      <div class="slam-player" data-slam-player>${spriteSVG(s, { expr: 'happy' })}</div>
      <div class="slam-ball" data-slam-ball>🏀</div>
      <div class="slam-pop" data-slam-pop></div>
      <div class="slam-message" data-slam-message>Tap Jump, then tap SLAM at the rim.</div>
      <div class="slam-controls">
        <button class="slam-jump" type="button" data-slam-jump>Jump</button>
        <button class="slam-slam" type="button" data-slam-slam disabled>SLAM!</button>
      </div>
    </div>`;

  const wrap = board.querySelector('.slam-wrap');
  const player = board.querySelector('[data-slam-player]');
  const ball = board.querySelector('[data-slam-ball]');
  const hoop = board.querySelector('[data-slam-hoop]');
  const rim = board.querySelector('[data-slam-rim]');
  const net = board.querySelector('[data-slam-net]');
  const message = board.querySelector('[data-slam-message]');
  const pop = board.querySelector('[data-slam-pop]');
  const attemptEl = board.querySelector('[data-slam-attempt]');
  const scoreEl = board.querySelector('[data-slam-score]');
  const streakEl = board.querySelector('[data-slam-streak]');
  const jumpBtn = board.querySelector('[data-slam-jump]');
  const slamBtn = board.querySelector('[data-slam-slam]');

  const START_X = 16;
  const START_BOTTOM = 14;
  const BALL_DX = 2.4;
  const BALL_DY = 5.4;
  const FLIGHT_MS = 1250;
  const DUNK_WINDOW_START = 0.78;
  const FALLBACK_RIM_X = 82.5;
  const FALLBACK_RIM_Y = 48;
  let rimX = FALLBACK_RIM_X;
  let rimY = FALLBACK_RIM_Y;
  let endX = rimX - BALL_DX;
  let endBottom = rimY - BALL_DY;

  let running = true;
  let phase = 'idle';
  let attempts = 0;
  let made = 0;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let lastPoints = 0;
  let flight = 0;
  let flightStart = 0;
  let playerX = START_X;
  let playerBottom = START_BOTTOM;
  let ballX = START_X + BALL_DX;
  let ballY = START_BOTTOM + BALL_DY;
  let raf = 0;
  let lastFrame = 0;
  let attemptTimer = 0;
  let endTimer = 0;
  let observer = null;
  const startedAt = performance.now();

  function updateHud() {
    attemptEl.textContent = `${attempts} / ${info.shots}`;
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    shell.timerEl.textContent = `${Math.max(0, Math.ceil((info.duration - (performance.now() - startedAt)) / 1000))}s`;
    shell.timerBar.style.width = `${Math.max(0, 100 - ((performance.now() - startedAt) / info.duration) * 100)}%`;
  }

  function measureRim() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    /* The browser test frame reports a 1px layout while it boots. Keep the
       court's real CSS proportions as the fallback instead of dividing by it. */
    if (!w || !h || w < 80 || h < 120 || !hoop || !rim || !rim.offsetWidth || !rim.offsetHeight) {
      rimX = FALLBACK_RIM_X;
      rimY = FALLBACK_RIM_Y;
      endX = rimX - BALL_DX;
      endBottom = rimY - BALL_DY;
      return;
    }
    const x = hoop.offsetLeft + rim.offsetLeft + rim.offsetWidth / 2;
    const y = hoop.offsetTop + rim.offsetTop + rim.offsetHeight / 2;
    const measuredX = x / w * 100;
    const measuredY = (h - y) / h * 100;
    if (!Number.isFinite(measuredX) || !Number.isFinite(measuredY) || measuredX < 20 || measuredY < 10) {
      rimX = FALLBACK_RIM_X;
      rimY = FALLBACK_RIM_Y;
    } else {
      rimX = measuredX;
      rimY = measuredY;
    }
    endX = rimX - BALL_DX;
    endBottom = rimY - BALL_DY;
  }

  function setPositions(x, bottom) {
    playerX = x;
    playerBottom = bottom;
    player.style.left = `${x}%`;
    player.style.bottom = `${bottom}%`;
    ballX = x + BALL_DX;
    ballY = bottom + BALL_DY;
    ball.style.left = `${ballX}%`;
    ball.style.bottom = `${ballY}%`;
  }

  function clearSlamLook() {
    player.style.transition = '';
    ball.style.transition = '';
    ball.style.zIndex = '';
    ball.style.rotate = '';
    net.classList.remove('swish');
    pop.classList.remove('show');
  }

  function resetAttempt() {
    if (!running) return;
    clearTimeout(attemptTimer);
    if (attempts >= info.shots || performance.now() - startedAt >= info.duration) {
      finish();
      return;
    }
    phase = 'idle';
    flight = 0;
    clearSlamLook();
    setPositions(START_X, START_BOTTOM);
    jumpBtn.disabled = false;
    slamBtn.disabled = true;
    message.textContent = 'Tap Jump, then tap SLAM at the rim.';
    updateHud();
  }

  function startJump() {
    if (!running || phase !== 'idle') return;
    attempts += 1;
    phase = 'flight';
    flight = 0;
    flightStart = performance.now();
    jumpBtn.disabled = true;
    slamBtn.disabled = false;
    message.textContent = 'Rise to the rim…';
    updateHud();
    Sfx.pop();
  }

  function showPop(text, good) {
    pop.textContent = text;
    pop.style.color = good ? '#5ee0a0' : '#ff8a8a';
    pop.classList.remove('show');
    void pop.offsetWidth;
    pop.classList.add('show');
  }

  function missAttempt(reason) {
    if (phase !== 'flight' && phase !== 'slam') return;
    clearTimeout(attemptTimer);
    phase = 'miss';
    slamBtn.disabled = true;
    streak = 0;
    message.textContent = reason;
    showPop('MISS', false);
    if (typeof Sfx !== 'undefined') Sfx.error();
    updateHud();
    ball.style.transition = 'left .28s ease-out, bottom .34s ease-in';
    ball.style.left = `${ballX + 11}%`;
    ball.style.bottom = `${Math.max(4, ballY - 5)}%`;
    attemptTimer = setTimeout(resetAttempt, 850);
  }

  function slamAttempt() {
    if (!running || phase !== 'flight') return;
    slamBtn.disabled = true;
    /* Compare in court percentages, not screen pixels: the in-game layout can
       be measured before the panel has its final size, especially in tests. */
    const distance = Math.hypot(ballX - rimX, (ballY - rimY) * 0.75);
    const threshold = 13;
    if (distance > threshold) {
      missAttempt(distance < threshold * 1.7 ? 'Rimmed out!' : 'Too far from the hoop!');
      return;
    }

    lastPoints = distance < 5.5 ? 3 : 2;
    score += lastPoints;
    made += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    phase = 'slam';
    message.textContent = lastPoints === 3 ? 'POSTER SLAM! +3' : 'SLAM! +2';
    showPop(`+${lastPoints}`, true);
    updateHud();
    if (typeof Sfx !== 'undefined') Sfx.win();

    player.style.transition = 'left .11s linear, bottom .11s linear';
    player.style.left = `${rimX - 4.5}%`;
    player.style.bottom = `${rimY - 8}%`;
    ballX = rimX;
    ballY = rimY;
    ball.style.transition = 'left .12s linear, bottom .12s linear';
    ball.style.left = `${rimX}%`;
    ball.style.bottom = `${rimY}%`;
    clearTimeout(attemptTimer);
    attemptTimer = setTimeout(() => {
      if (!running) return;
      net.classList.add('swish');
      ball.style.zIndex = '1';
      ballY = rimY - 8;
      ball.style.transition = 'left .16s ease-in, bottom .3s ease-in';
      ball.style.left = `${rimX}%`;
      ball.style.bottom = `${rimY - 8}%`;
    }, 120);
    attemptTimer = setTimeout(() => {
      if (!running) return;
      net.classList.remove('swish');
      resetAttempt();
    }, 1000);
  }

  function finish() {
    if (!running) return;
    running = false;
    phase = 'result';
    cancelAnimationFrame(raf);
    clearTimeout(attemptTimer);
    clearTimeout(endTimer);
    if (observer) observer.disconnect();
    const coins = info.baseCoins + score * 4;
    const xp = info.baseXp + score * 2;
    const bond = info.baseBond + made;
    showSportResult(shell, { kind, score, made, coins, xp, bond });
  }

  function frame(now) {
    if (!running) return;
    if (!lastFrame) lastFrame = now;
    lastFrame = now;
    const left = Math.max(0, info.duration - (now - startedAt));
    shell.timerEl.textContent = `${Math.ceil(left / 1000)}s`;
    shell.timerBar.style.width = `${Math.max(0, (left / info.duration) * 100)}%`;
    if (left <= 0) {
      finish();
      return;
    }

    if (phase === 'flight') {
      flight = Math.min(1, (now - flightStart) / FLIGHT_MS);
      const x = START_X + (endX - START_X) * flight;
      const y = START_BOTTOM + (endBottom - START_BOTTOM) * flight + Math.sin(Math.PI * flight) * 14;
      setPositions(x, y);
      if (flight >= DUNK_WINDOW_START) message.textContent = 'NOW! Tap SLAM!';
      if (flight >= 0.995) missAttempt('Too late — the buzzer beat you!');
    }
    raf = requestAnimationFrame(frame);
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (phase === 'idle') startJump();
      else if (phase === 'flight') slamAttempt();
    } else if (event.key === 's' || event.key === 'S' || event.key === 'Enter') {
      event.preventDefault();
      slamAttempt();
    }
  }

  jumpBtn.addEventListener('click', startJump);
  slamBtn.addEventListener('click', slamAttempt);
  window.addEventListener('keydown', onKeyDown, { passive: false });
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => {
      measureRim();
      if (phase === 'idle') setPositions(START_X, START_BOTTOM);
    });
    observer.observe(board);
  }

  const debugApi = {
    state: () => ({
      phase,
      attempts,
      made,
      score,
      streak,
      bestStreak,
      lastPoints,
      flight,
      ball: { x: ballX, y: ballY },
      rim: { x: rimX, y: rimY },
    }),
    jump: startJump,
    slam: slamAttempt,
    finish,
  };
  window.__slamTest = debugApi;

  shell.hintEl.textContent = 'Basketball · leap, then slam at the rim';
  shell.timerEl.textContent = `${Math.ceil(info.duration / 1000)}s`;
  shell.timerBar.style.width = '100%';
  updateHud();
  measureRim();
  setPositions(START_X, START_BOTTOM);
  raf = requestAnimationFrame(frame);
  endTimer = setTimeout(finish, info.duration + 100);

  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(attemptTimer);
    clearTimeout(endTimer);
    window.removeEventListener('keydown', onKeyDown);
    if (observer) observer.disconnect();
    if (window.__slamTest === debugApi) delete window.__slamTest;
  });
}
