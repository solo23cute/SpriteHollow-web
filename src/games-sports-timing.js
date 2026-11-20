/* Extra sport types: Field Goal, Slap Shot, Birdie Putt, Boundary Hit, Table
   Rally, and Bullseye Draw. Each one runs on this shared timing-meter engine
   and pays out through the same sport result screen, food, gift, and bond
   track as the original sports. */

function openTimingSport(kind) {
  const info = SPORT_GAMES[kind];
  if (!info) return;
  const s = activeSprite();
  if (!s) {
    toast('Hatch a sprite first to play sports together.', '🥚');
    return;
  }
  if (s.stage === 'egg') {
    toast('Hatch this egg before heading out to play.', '🥚');
    return;
  }
  Sfx.init();
  const shell = gameOverlayShell(kind);
  const { board } = shell;
  const gold = Array.isArray(info.band) ? info.band : [0.43, 0.57];
  const clean = [Math.max(0.05, gold[0] - 0.13), Math.min(0.95, gold[1] + 0.13)];
  const speed = Number(info.speed) || 0.6;
  const unit = info.unit || 'play';
  const actionLabel = info.action || 'Play';
  let running = true;
  let finished = false;
  let attempts = 0;
  let made = 0;
  let score = 0;
  let position = 0.1;
  let direction = 1;
  let last = performance.now();
  let raf = 0;
  let endTimer = 0;
  let tick = 0;

  board.innerHTML = `<div style="position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,${info.g2},#1b2038 58%,${info.g1} 59%,rgba(6,10,20,.55))">
      <div style="position:absolute;left:9%;top:12%;width:58px">${spriteSVG(s, { expr: 'happy' })}</div>
      <div style="position:absolute;right:10%;top:11%;font-size:44px;filter:drop-shadow(0 8px 12px rgba(0,0,0,.35))">${info.icon}</div>
      <div style="position:absolute;left:12%;right:12%;bottom:31%;height:24px;border-radius:12px;background:rgba(8,12,24,.62);border:1px solid rgba(255,255,255,.2);overflow:hidden">
        <div style="position:absolute;left:${clean[0] * 100}%;top:0;width:${(clean[1] - clean[0]) * 100}%;height:100%;background:rgba(255,255,255,.16)"></div>
        <div style="position:absolute;left:${gold[0] * 100}%;top:0;width:${(gold[1] - gold[0]) * 100}%;height:100%;background:rgba(255,209,102,.45);border-left:1px solid rgba(255,209,102,.8);border-right:1px solid rgba(255,209,102,.8)"></div>
        <div data-sport-marker style="position:absolute;left:10%;top:-4px;width:7px;height:30px;border-radius:4px;background:#fff;box-shadow:0 0 12px rgba(255,255,255,.75)"></div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:14%;display:flex;flex-direction:column;align-items:center;gap:7px">
        <button class="btn btn-gold" data-sport-action style="min-width:180px">${actionLabel}</button>
        <div class="tiny" data-sport-message style="font-weight:750;color:#fff;text-align:center;max-width:290px">Tap ${actionLabel} inside the gold window.</div>
        <div class="tiny muted" data-sport-count>0 / ${info.shots} ${unit}s · 0 points</div>
      </div>
    </div>`;

  const marker = board.querySelector('[data-sport-marker]');
  const message = board.querySelector('[data-sport-message]');
  const count = board.querySelector('[data-sport-count]');
  const actionBtn = board.querySelector('[data-sport-action]');

  sportShellSetup(shell, kind, `${info.tag} · ${actionLabel.toLowerCase()} in the gold window`);

  const paintMeter = () => {
    marker.style.left = `${Math.max(1, Math.min(99, position * 100))}%`;
  };

  const paintCount = () => {
    count.textContent = `${attempts} / ${info.shots} ${unit}s · ${score} points`;
    shell.scoreEl.textContent = score;
  };

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(endTimer);
    clearInterval(tick);
    showSportResult(shell, {
      kind,
      score,
      made,
      coins: info.baseCoins + score * 4,
      xp: info.baseXp + score * 2,
      bond: info.baseBond + made,
      joy: 14,
    });
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    position += direction * speed * dt;
    if (position >= 0.96) {
      position = 0.96;
      direction = -1;
    }
    if (position <= 0.04) {
      position = 0.04;
      direction = 1;
    }
    paintMeter();
    raf = requestAnimationFrame(loop);
  }

  function attempt() {
    if (!running) return;
    attempts += 1;
    const perfect = position >= gold[0] && position <= gold[1];
    const good = position >= clean[0] && position <= clean[1];
    if (perfect) {
      score += 3;
      made += 1;
      message.textContent = `Perfect ${unit}! +3 points.`;
      Sfx.win();
    } else if (good) {
      score += 2;
      made += 1;
      message.textContent = `Clean ${unit}! +2 points.`;
      Sfx.coin();
    } else {
      message.textContent = `Not this time. Wait for the gold window.`;
      Sfx.error();
    }
    burstOn(actionBtn, [info.icon, '✨'], 4);
    paintCount();
    if (attempts >= info.shots) endTimer = setTimeout(finish, 520);
  }

  actionBtn.addEventListener('click', attempt);
  paintMeter();
  paintCount();
  raf = requestAnimationFrame(loop);
  tick = sportCountdown(shell, info, finish);
  endTimer = setTimeout(finish, info.duration + 100);
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(endTimer);
    clearInterval(tick);
  });
}
