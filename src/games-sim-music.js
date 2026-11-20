/* Sim & Rhythm Legends Mini-Games:
   1. Family Life Sim (lifesim - Life stages, careers, family choices)
   2. Magic Tiles Piano (magictiles - Rhythm piano tracks across Magic Tiles 1-3)
   3. Rolling Ball (rollingball - Slope rush ball balancer with ramps & gems)
   4. Tap Tiles Rush (taptiles - Triple stage speed reflex grid) */

const SIM_MUSIC_GAMES_INFO = {
  lifesim: { title: 'Family Life Sim', icon: '🏡', tag: 'Life Sim 3D', desc: 'Make life choices across generations: School, Career, Family, & Home!', g1: '#0284c7', g2: '#f59e0b' },
  magictiles: { title: 'Magic Tiles Piano', icon: '🎹', tag: 'Rhythm 1-3', desc: 'Tap black piano keys to the melody across Magic Tiles 1, 2, & 3 stages!', g1: '#6366f1', g2: '#ec4899' },
  rollingball: { title: 'Rolling Ball', icon: '🌀', tag: 'Slope Rush', desc: 'Steer the rolling ball down neon slopes, dodge hurdles, and hit jump ramps!', g1: '#10b981', g2: '#3b82f6' },
  taptiles: { title: 'Tap Tiles Rush', icon: '⚡', tag: 'Triple Stage', desc: 'Rapidly tap target tiles through Stage 1 (3x3), Stage 2 (4x4), and Stage 3 (Turbo)!', g1: '#f43f5e', g2: '#eab308' },
};

if (typeof GAME_INFO !== 'undefined') Object.assign(GAME_INFO, SIM_MUSIC_GAMES_INFO);

/* ---------------- 1. FAMILY LIFE SIM (lifesim) ---------------- */
function openLifeSimGame() {
  const shell = gameOverlayShell('lifesim');
  const { board } = shell;

  const LIFE_EVENTS = [
    {
      age: 6, stage: 'Childhood', title: 'First Day of Elementary School',
      blurb: 'The morning bell rings! What exciting activity will you dive into today?',
      choices: [
        { text: '🎹 Join the Music & Piano Club', hap: 18, gold: 15, wis: 14, log: 'Mastered your first piano chords.' },
        { text: '⚽ Captain the Playground Soccer Team', hap: 20, gold: 10, wis: 10, log: 'Scored the winning goal in recess.' },
        { text: '📚 Read Illustrated Sprite Lore', hap: 12, gold: 20, wis: 22, log: 'Discovered secret myths of Sprite Hollow.' },
      ]
    },
    {
      age: 11, stage: 'Childhood', title: 'Adopting a Family Companion',
      blurb: 'A sunny afternoon in the Hollow gardens. A tiny baby sprite needs a loving home!',
      choices: [
        { text: '🐶 Adopt a playful Golden Puppy', hap: 25, gold: 10, wis: 12, log: 'The pup became your best childhood pal.' },
        { text: '✨ Nurture a wild Woodland Fairy', hap: 22, gold: 25, wis: 18, log: 'Fairy magic blossomed in your backyard.' },
        { text: '🦉 Foster a wise Night Owl', hap: 15, gold: 15, wis: 25, log: 'Studied stargazing with the owl nightly.' },
      ]
    },
    {
      age: 15, stage: 'Teen Years', title: 'High School Passion Project',
      blurb: 'Your teachers announce the annual Innovation & Arts Exhibition.',
      choices: [
        { text: '💻 Program an Indie Mobile App', hap: 16, gold: 40, wis: 25, log: 'Your game reached top of the student store!' },
        { text: '🎨 Paint a Vibrant Community Mural', hap: 26, gold: 20, wis: 16, log: 'The town square cheered your art unveiling.' },
        { text: '🌿 Start an Organic Herb Garden', hap: 22, gold: 30, wis: 20, log: 'Harvested fresh mint and honey flowers.' },
      ]
    },
    {
      age: 18, stage: 'College & Ambition', title: 'Graduation & Life Path',
      blurb: 'You walk across the stage in your cap and gown. What will your next horizon be?',
      choices: [
        { text: '🎓 Starlight University Honors', hap: 18, gold: 35, wis: 30, log: 'Earned a degree in Ecological Architecture.' },
        { text: '🚀 Launch an Innovative Eco-Startup', hap: 20, gold: 60, wis: 22, log: 'Secured first round funding for your dream.' },
        { text: '🎒 Backpack Across the 10 Biomes', hap: 30, gold: 20, wis: 24, log: 'Experienced breathtaking wonders of the world.' },
      ]
    },
    {
      age: 26, stage: 'Career & Independence', title: 'Dream Career Milestone',
      blurb: 'Hard work pays off! An executive promotion and creative leadership call your name.',
      choices: [
        { text: '🏢 Become Chief Design Architect', hap: 20, gold: 80, wis: 25, log: 'Designed landmark community center plazas.' },
        { text: '🍰 Open an Artisan Sprite Bakery', hap: 30, gold: 50, wis: 20, log: 'Famous for Honeycomb Cakes and Star Pops.' },
        { text: '🔬 Lead Renewable Energy Research', hap: 18, gold: 70, wis: 32, log: 'Patented clean solar lantern grids.' },
      ]
    },
    {
      age: 32, stage: 'Family & Romance', title: 'Building Your Dream Home',
      blurb: 'You and your partner are ready to purchase your forever sanctuary.',
      choices: [
        { text: '🏡 Cozy Sunlit Hollow Cottage', hap: 32, gold: 40, wis: 18, log: 'Planted climbing roses and tea pergolas.' },
        { text: '🏙️ Modern Sky Penthouse with Views', hap: 22, gold: 90, wis: 20, log: 'Hosted glamorous rooftop family dinners.' },
        { text: '🌲 Woodland Eco-Estate Sanctuary', hap: 28, gold: 60, wis: 28, log: 'Surrounded by ancient redwoods and waterfalls.' },
      ]
    },
    {
      age: 40, stage: 'Generations', title: 'Welcoming the Next Generation',
      blurb: 'Your family is growing! The nursery is decorated with glowing mobile crystals.',
      choices: [
        { text: '👶 Celebrate Twins with a Grand Shower', hap: 35, gold: 40, wis: 20, log: 'Laughter filled every corner of the house.' },
        { text: '📚 Build a Magical Home Library', hap: 24, gold: 50, wis: 32, log: 'Nightly storybooks inspired young minds.' },
        { text: '🎡 Take an Epic World Family Vacation', hap: 32, gold: 35, wis: 25, log: 'Unforgettable memories across all horizons.' },
      ]
    },
    {
      age: 52, stage: 'Midlife Mastery', title: 'Community Leadership',
      blurb: 'As a respected pillar of the town, how will you enrich Sprite Hollow?',
      choices: [
        { text: '🌟 Endow a Public Sprite Sanctuary', hap: 30, gold: 70, wis: 30, log: 'Created a protected haven for rare species.' },
        { text: '🏟️ Build Youth Sports & Rhythm Stadium', hap: 28, gold: 65, wis: 25, log: 'Coached the next generation of champions.' },
        { text: '🎻 Sponsor the Hollow Philharmonic', hap: 26, gold: 60, wis: 35, log: 'Classical music echoed under starry skies.' },
      ]
    },
    {
      age: 65, stage: 'Golden Years', title: 'Celebrating Your Golden Legacy',
      blurb: 'Surrounded by children, grandchildren, and lifelong friends at your jubilee.',
      choices: [
        { text: '📖 Publish Memoir "Generations of Joy"', hap: 28, gold: 80, wis: 38, log: 'A bestseller that touched thousands of lives.' },
        { text: '🎁 Gift Heirloom Trust to Grandchildren', hap: 35, gold: 50, wis: 30, log: 'Passed down family wisdom and security.' },
        { text: '🌍 Embark on a Golden World Voyage', hap: 32, gold: 60, wis: 32, log: 'Sailed peaceful seas under northern lights.' },
      ]
    },
    {
      age: 75, stage: 'Legendary Legacy', title: 'Centennial Family Reunion',
      blurb: 'Three generations gather in your courtyard to toast your magnificent journey!',
      choices: [
        { text: '🥂 Toast to Lifelong Love & Harmony', hap: 40, gold: 60, wis: 40, log: 'Awarded the town Civic Laurel of Honor.' },
        { text: '🌳 Plant Centennial Grove of Light', hap: 38, gold: 70, wis: 42, log: 'Trees will shade generations for a century.' },
        { text: '📜 Sign the Family Crest & Heritage Code', hap: 35, gold: 75, wis: 45, log: 'A golden family legacy preserved forever.' },
      ]
    }
  ];

  let currentIdx = 0;
  let happiness = 70;
  let gold = 50;
  let wisdom = 30;
  let running = true;
  let logs = [];

  function renderEvent() {
    if (currentIdx >= LIFE_EVENTS.length) {
      finishLifeSim();
      return;
    }
    const ev = LIFE_EVENTS[currentIdx];
    shell.scoreEl.textContent = `${Math.round(happiness * 3 + gold + wisdom * 3)}`;
    shell.timerEl.textContent = `Event ${currentIdx + 1}/${LIFE_EVENTS.length}`;
    shell.timerBar.style.width = `${((currentIdx + 1) / LIFE_EVENTS.length) * 100}%`;

    board.innerHTML = `
      <div class="lifesim-wrap" style="padding:10px;height:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box">
        <!-- Status HUD -->
        <div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:13px">
          <div><b>🎂 Age ${ev.age}</b> <span class="muted">(${ev.stage})</span></div>
          <div style="display:flex;gap:10px">
            <span title="Happiness">💛 <b>${Math.min(100, Math.round(happiness))}%</b></span>
            <span title="Wealth">🪙 <b>${gold}</b></span>
            <span title="Wisdom">🧠 <b>${Math.min(100, Math.round(wisdom))}%</b></span>
          </div>
        </div>

        <!-- Event Card -->
        <div style="background:linear-gradient(135deg,rgba(2,132,199,0.18),rgba(245,158,11,0.18));border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:12px;margin:8px 0;text-align:center">
          <div style="font-size:28px;margin-bottom:4px">🏡</div>
          <h3 style="margin:0 0 6px 0;font-size:16px">${ev.title}</h3>
          <p class="small muted" style="margin:0;line-height:1.4">${ev.blurb}</p>
        </div>

        <!-- Choices -->
        <div class="lifesim-choices" style="display:flex;flex-direction:column;gap:8px">
          ${ev.choices.map((c, i) => `
            <button class="btn btn-outline btn-block" data-choice="${i}" style="text-align:left;padding:10px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:13px;font-weight:600">${c.text}</span>
              <span class="tiny muted" style="white-space:nowrap;margin-left:8px">+${c.hap}💛 +${c.gold}🪙</span>
            </button>
          `).join('')}
        </div>

        <!-- Recent Story Scrapbook -->
        <div class="tiny muted" style="margin-top:6px;max-height:45px;overflow:hidden;line-height:1.3;text-align:center">
          ${logs.length ? `📖 <i>"${logs[logs.length - 1]}"</i>` : '📖 <i>Your life journey begins now...</i>'}
        </div>
      </div>
      ${gameMiniSprite()}`;

    board.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (!running) return;
        const cIdx = Number(btn.getAttribute('data-choice'));
        const choice = ev.choices[cIdx];
        happiness = Math.min(100, happiness + choice.hap * 0.4);
        gold += choice.gold;
        wisdom = Math.min(100, wisdom + choice.wis * 0.4);
        logs.push(choice.log);
        Sfx.chime ? Sfx.chime() : Sfx.tone(523, 0.15, 'sine', 0.1);
        burstOn(btn, ['💛', '🪙', '✨'], 5);
        currentIdx++;
        setTimeout(renderEvent, 220);
      });
    });
  }

  function finishLifeSim() {
    running = false;
    const finalScore = Math.round(happiness * 3.5 + gold * 2 + wisdom * 3.5);
    let title = 'Beloved Generational Legend';
    if (gold >= 350) title = 'Visionary Tycoon & Loving Patriarch';
    else if (wisdom >= 80) title = 'Sage of Hollow Heritage';
    else if (happiness >= 85) title = 'Heartwarming Family Icon';

    showGameResult(shell, {
      kind: 'lifesim',
      score: finalScore,
      coins: Math.round(finalScore * 1.5),
      xp: 140,
      blurb: `Life Complete: ${title}!`,
    });
  }

  renderEvent();
  shell.addCleanup(() => { running = false; });
}

/* ---------------- 2. MAGIC TILES PIANO (magictiles) ---------------- */
function openMagicTilesGame() {
  const shell = gameOverlayShell('magictiles');
  const { board } = shell;

  const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

  board.innerHTML = `
    <div class="magictiles-container" style="position:relative;height:270px;background:#0d0d1a;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);user-select:none">
      <div style="position:absolute;top:6px;left:10px;font-size:12px;color:#ec4899;font-weight:700" data-stage-lbl>Magic Tiles 1: Allegro</div>
      <div style="position:absolute;top:6px;right:10px;font-size:12px;color:#a855f7;font-weight:700" data-combo-lbl>Combo: 0</div>

      <!-- 4 Piano Lanes -->
      <div class="mt-lanes" style="display:flex;height:100%;width:100%">
        ${[0, 1, 2, 3].map(i => `
          <div class="mt-lane" data-lane="${i}" style="flex:1;border-right:${i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none'};position:relative;cursor:pointer;background:rgba(255,255,255,0.02)">
            <div style="position:absolute;bottom:0;width:100%;height:45px;background:linear-gradient(180deg,transparent,rgba(99,102,241,0.25));border-top:2px solid #818cf8;pointer-events:none"></div>
          </div>
        `).join('')}
      </div>
      <div class="mt-feedback" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:18px;font-weight:800;color:#facc15;pointer-events:none;opacity:0;transition:opacity .15s"></div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Tap keys when they reach the bottom line. Perfect tempo builds huge combos!</span>
    </div>
    ${gameMiniSprite()}`;

  const container = board.querySelector('.magictiles-container');
  const stageLbl = board.querySelector('[data-stage-lbl]');
  const comboLbl = board.querySelector('[data-combo-lbl]');
  const feedbackEl = board.querySelector('.mt-feedback');
  const laneEls = board.querySelectorAll('.mt-lane');

  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let perfectCount = 0;
  let running = true;
  let tiles = [];
  let noteIndex = 0;
  let startedAt = performance.now();
  let lastSpawn = 0;
  let raf = null;
  const DURATION = 24000;

  function playPianoChime(step = 0) {
    if (typeof Sfx !== 'undefined') {
      Sfx.init();
      const freq = PENTATONIC[(noteIndex + step) % PENTATONIC.length];
      Sfx.tone(freq, 0.28, 'triangle', 0.16);
      noteIndex++;
    }
  }

  function showFeedback(text, color = '#facc15') {
    feedbackEl.textContent = text;
    feedbackEl.style.color = color;
    feedbackEl.style.opacity = '1';
    setTimeout(() => { feedbackEl.style.opacity = '0'; }, 300);
  }

  function spawnTile() {
    const lane = Math.floor(Math.random() * 4);
    const laneEl = laneEls[lane];
    const el = document.createElement('div');
    el.className = 'mt-tile';
    el.style.cssText = `position:absolute;top:-60px;left:6%;width:88%;height:52px;background:linear-gradient(180deg,#6366f1,#3730a3);border-radius:6px;border:1px solid #c7d2fe;box-shadow:0 0 10px rgba(99,102,241,0.5);pointer-events:none`;
    laneEl.appendChild(el);
    tiles.push({ el, lane, y: -60, dead: false });
  }

  // Tap handler per lane
  laneEls.forEach((lEl) => {
    lEl.addEventListener('pointerdown', (e) => {
      if (!running) return;
      const lane = Number(lEl.getAttribute('data-lane'));
      // Find lowest alive tile in this lane
      const cand = tiles.filter(t => !t.dead && t.lane === lane && t.y >= 120 && t.y <= 270)
                        .sort((a, b) => b.y - a.y)[0];
      if (cand) {
        cand.dead = true;
        cand.el.style.background = '#ec4899';
        cand.el.style.transform = 'scale(0.92)';
        setTimeout(() => cand.el.remove(), 100);

        const dist = Math.abs(cand.y - 200);
        if (dist < 32) {
          perfectCount++;
          combo++;
          score += 100 * Math.min(4, 1 + Math.floor(combo / 5));
          showFeedback('PERFECT!', '#facc15');
          burstOn(cand.el, ['✨', '⭐'], 4);
        } else {
          combo++;
          score += 50 * Math.min(4, 1 + Math.floor(combo / 5));
          showFeedback('GREAT!', '#38bdf8');
        }
        playPianoChime();
        maxCombo = Math.max(maxCombo, combo);
        comboLbl.textContent = `Combo: ${combo}`;
        shell.scoreEl.textContent = `${score}`;
      } else {
        // Strike miss
        combo = 0;
        comboLbl.textContent = `Combo: 0`;
        showFeedback('MISS', '#ef4444');
        if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
      }
    });
  });

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    // Stage progression
    let speed = 190;
    let spawnRate = 600;
    if (elapsed > 16000) {
      stageLbl.textContent = 'Stage 3: Magic Tiles 3 (Virtuoso Starlight)';
      stageLbl.style.color = '#f59e0b';
      speed = 280;
      spawnRate = 420;
    } else if (elapsed > 8000) {
      stageLbl.textContent = 'Stage 2: Magic Tiles 2 (Neon Vivace)';
      stageLbl.style.color = '#06b6d4';
      speed = 230;
      spawnRate = 500;
    }

    if (now - lastSpawn > spawnRate) {
      spawnTile();
      lastSpawn = now;
    }

    const dt = 0.016;
    tiles.forEach(t => {
      if (t.dead) return;
      t.y += speed * dt;
      t.el.style.top = `${t.y}px`;
      if (t.y > 275) {
        t.dead = true;
        t.el.remove();
        combo = 0;
        comboLbl.textContent = `Combo: 0`;
        showFeedback('MISSED', '#ef4444');
      }
    });
    tiles = tiles.filter(t => !t.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'magictiles',
        score,
        coins: Math.round(score * 1.4),
        xp: 130,
        perfect: perfectCount,
        blurb: maxCombo >= 15 ? 'Flawless Piano Virtuoso!' : 'Rhythm Master Run!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); tiles.forEach(t => t.el.remove()); });
}

/* ---------------- 3. ROLLING BALL (rollingball) ---------------- */
function openRollingBallGame() {
  const shell = gameOverlayShell('rollingball');
  const { board } = shell;

  board.innerHTML = `
    <div class="rb-wrap" style="position:relative;height:260px;background:radial-gradient(ellipse at bottom,#065f46 0%,#091e17 60%,#020b08 100%);border-radius:12px;overflow:hidden;border:1px solid rgba(16,185,129,0.3);user-select:none">
      <div style="position:absolute;top:8px;left:12px;font-size:12px;color:#34d399;font-weight:700">Slope Track · 5 Lanes</div>
      <div style="position:absolute;top:8px;right:12px;font-size:12px;color:#60a5fa;font-weight:700" data-speed-lbl>Speed: 140 km/h</div>

      <!-- Perspective Lane Lines -->
      <div style="position:absolute;inset:0;pointer-events:none;opacity:0.35;background-image:linear-gradient(to right,rgba(52,211,153,0.3) 1px,transparent 1px);background-size:20% 100%"></div>

      <!-- Player Ball -->
      <div class="rb-ball" style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#6ee7b7,#10b981 60%,#047857 100%);box-shadow:0 0 16px rgba(16,185,129,0.8),0 8px 12px rgba(0,0,0,0.6);transition:left .12s ease-out;display:flex;align-items:center;justify-content:center;font-size:18px">
        🌀
      </div>
      <div class="rb-shadow" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);width:32px;height:10px;background:rgba(0,0,0,0.5);border-radius:50%;transition:left .12s ease-out;pointer-events:none"></div>

      <!-- Touch Controls -->
      <div style="position:absolute;bottom:8px;left:8px;right:8px;display:flex;justify-content:space-between;pointer-events:none">
        <button class="btn btn-soft btn-sm" data-act="left" style="pointer-events:auto;font-size:16px;padding:6px 16px">◀️ Steer</button>
        <button class="btn btn-soft btn-sm" data-act="right" style="pointer-events:auto;font-size:16px;padding:6px 16px">Steer ▶️</button>
      </div>
    </div>
    <div class="row" style="margin-top:6px;justify-content:center;gap:6px">
      <span class="tiny muted">Hit 🚀 Jump Ramps to fly over hazards! Collect 💎 Starlight Gems!</span>
    </div>
    ${gameMiniSprite()}`;

  const ball = board.querySelector('.rb-ball');
  const shadow = board.querySelector('.rb-shadow');
  const speedLbl = board.querySelector('[data-speed-lbl]');
  const wrap = board.querySelector('.rb-wrap');

  const LANES_PCT = [12, 31, 50, 69, 88];
  let laneIdx = 2; // Middle lane
  let score = 0;
  let running = true;
  let isJumping = false;
  let items = [];
  let startedAt = performance.now();
  let lastSpawn = 0;
  let raf = null;
  const DURATION = 24000;

  function updateBallPos() {
    ball.style.left = `${LANES_PCT[laneIdx]}%`;
    shadow.style.left = `${LANES_PCT[laneIdx]}%`;
  }

  function moveLeft() {
    if (!running) return;
    if (laneIdx > 0) {
      laneIdx--;
      updateBallPos();
      if (typeof Sfx !== 'undefined') Sfx.tick();
    }
  }

  function moveRight() {
    if (!running) return;
    if (laneIdx < LANES_PCT.length - 1) {
      laneIdx++;
      updateBallPos();
      if (typeof Sfx !== 'undefined') Sfx.tick();
    }
  }

  board.querySelector('[data-act="left"]').addEventListener('click', moveLeft);
  board.querySelector('[data-act="right"]').addEventListener('click', moveRight);

  // Keyboard navigation
  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
  };
  window.addEventListener('keydown', onKey);

  function triggerJump() {
    if (isJumping) return;
    isJumping = true;
    ball.style.bottom = '85px';
    if (typeof Sfx !== 'undefined') Sfx.tone(650, 0.35, 'sine', 0.18, 0, 150);
    setTimeout(() => {
      ball.style.bottom = '22px';
      setTimeout(() => { isJumping = false; }, 180);
    }, 450);
  }

  function spawnItem() {
    const lane = Math.floor(Math.random() * 5);
    const r = Math.random();
    let type = 'gem'; // gem, ramp, barrier
    let icon = '💎';
    if (r < 0.35) {
      type = 'barrier';
      icon = '🚧';
    } else if (r < 0.6) {
      type = 'ramp';
      icon = '🚀';
    }

    const el = document.createElement('div');
    el.style.cssText = `position:absolute;top:-40px;left:${LANES_PCT[lane]}%;transform:translateX(-50%);font-size:24px;pointer-events:none`;
    el.textContent = icon;
    wrap.appendChild(el);
    items.push({ el, lane, y: -40, type, dead: false });
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    const speed = 140 + Math.floor((elapsed / DURATION) * 120);
    speedLbl.textContent = `Speed: ${speed} km/h`;
    score += 1;
    shell.scoreEl.textContent = `${score}`;

    if (now - lastSpawn > 580) {
      spawnItem();
      lastSpawn = now;
    }

    const dt = 0.016;
    items.forEach(it => {
      if (it.dead) return;
      it.y += speed * 1.5 * dt;
      it.el.style.top = `${it.y}px`;

      // Collision window
      if (it.y >= 195 && it.y <= 245 && it.lane === laneIdx) {
        if (it.type === 'gem') {
          it.dead = true;
          it.el.remove();
          score += 120;
          burstOn(ball, ['💎', '✨'], 5);
          if (typeof Sfx !== 'undefined') Sfx.pop();
        } else if (it.type === 'ramp') {
          it.dead = true;
          it.el.remove();
          score += 180;
          triggerJump();
          burstOn(ball, ['🚀', '⭐'], 6);
        } else if (it.type === 'barrier') {
          if (!isJumping) {
            it.dead = true;
            it.el.remove();
            score = Math.max(0, score - 60);
            if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
          }
        }
      }

      if (it.y > 270) {
        it.dead = true;
        it.el.remove();
      }
    });
    items = items.filter(it => !it.dead);

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'rollingball',
        score,
        coins: Math.round(score * 1.3),
        xp: 130,
        blurb: score >= 1600 ? 'Master Slope Balancer!' : 'Awesome Slope Run!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame((t) => { startedAt = t; lastSpawn = t; loop(t); });
  shell.addCleanup(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    items.forEach(it => it.el.remove());
  });
}

/* ---------------- 4. TAP TILES RUSH (taptiles) ---------------- */
function openTapTilesGame() {
  const shell = gameOverlayShell('taptiles');
  const { board } = shell;

  let stage = 1; // 1: 3x3 numbers, 2: 4x4 symbol match, 3: turbo frenzy
  let score = 0;
  let combo = 0;
  let running = true;
  let startedAt = performance.now();
  let raf = null;
  const DURATION = 24000;

  function renderStage() {
    if (!running) return;
    if (stage === 1) renderStage1();
    else if (stage === 2) renderStage2();
    else if (stage === 3) renderStage3();
  }

  // Stage 1: 3x3 Numbers 1..9
  function renderStage1() {
    let nextNum = 1;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    board.innerHTML = `
      <div style="padding:10px;height:100%;display:flex;flex-direction:column;justify-content:space-between">
        <div style="text-align:center">
          <div style="font-size:12px;color:#f43f5e;font-weight:800">STAGE 1: 3x3 NUMBERS</div>
          <div style="font-size:14px;font-weight:700" data-stage1-prompt>Tap Number 1 as fast as you can!</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:240px;margin:0 auto;width:100%">
          ${nums.map(n => `
            <button class="btn btn-outline" data-num="${n}" style="height:62px;font-size:22px;font-weight:800;border-radius:10px;background:rgba(255,255,255,0.06);border:2px solid #f43f5e">
              ${n}
            </button>
          `).join('')}
        </div>
        <div class="tiny muted" style="text-align:center">Tap tiles in order from 1 to 9!</div>
      </div>
      ${gameMiniSprite()}`;

    const promptEl = board.querySelector('[data-stage1-prompt]');
    board.querySelectorAll('[data-num]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!running || stage !== 1) return;
        const val = Number(btn.getAttribute('data-num'));
        if (val === nextNum) {
          btn.style.background = '#22c55e';
          btn.style.borderColor = '#86efac';
          btn.style.color = '#ffffff';
          btn.disabled = true;
          score += 150;
          shell.scoreEl.textContent = `${score}`;
          burstOn(btn, ['✨', '⭐'], 3);
          if (typeof Sfx !== 'undefined') Sfx.tone(300 + nextNum * 60, 0.12, 'triangle', 0.14);
          nextNum++;
          if (nextNum > 9) {
            stage = 2;
            toast('Stage 1 Cleared! Stage 2: Color Rush!', '⚡');
            setTimeout(renderStage, 250);
          } else {
            promptEl.textContent = `Tap Number ${nextNum}!`;
          }
        } else {
          btn.style.background = '#ef4444';
          setTimeout(() => { if (btn) btn.style.background = 'rgba(255,255,255,0.06)'; }, 180);
          if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
        }
      });
    });
  }

  // Stage 2: 4x4 Color & Symbol Match
  function renderStage2() {
    const TARGET = '💎';
    const OTHERS = ['🔥', '🍀', '🌟', '⚡'];
    let remaining = 6;
    const grid = [];
    for (let i = 0; i < remaining; i++) grid.push(TARGET);
    for (let i = 0; i < 10; i++) grid.push(OTHERS[Math.floor(Math.random() * OTHERS.length)]);
    grid.sort(() => Math.random() - 0.5);

    board.innerHTML = `
      <div style="padding:10px;height:100%;display:flex;flex-direction:column;justify-content:space-between">
        <div style="text-align:center">
          <div style="font-size:12px;color:#06b6d4;font-weight:800">STAGE 2: SAPPHIRE RUSH</div>
          <div style="font-size:14px;font-weight:700" data-stage2-prompt>Tap all ${TARGET} Sapphires! (${remaining} remaining)</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:260px;margin:0 auto;width:100%">
          ${grid.map((sym, i) => `
            <button class="btn btn-outline" data-sym="${sym}" style="height:48px;font-size:20px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid #06b6d4">
              ${sym}
            </button>
          `).join('')}
        </div>
        <div class="tiny muted" style="text-align:center">Tap only the target symbol!</div>
      </div>
      ${gameMiniSprite()}`;

    const promptEl = board.querySelector('[data-stage2-prompt]');
    board.querySelectorAll('[data-sym]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!running || stage !== 2) return;
        const sym = btn.getAttribute('data-sym');
        if (sym === TARGET) {
          btn.style.background = '#06b6d4';
          btn.disabled = true;
          remaining--;
          score += 180;
          shell.scoreEl.textContent = `${score}`;
          burstOn(btn, ['💎', '✨'], 4);
          if (typeof Sfx !== 'undefined') Sfx.pop();
          if (remaining <= 0) {
            stage = 3;
            toast('Stage 2 Cleared! Stage 3: Turbo Frenzy!', '⚡');
            setTimeout(renderStage, 250);
          } else {
            promptEl.textContent = `Tap all ${TARGET} Sapphires! (${remaining} remaining)`;
          }
        } else {
          btn.style.background = '#ef4444';
          setTimeout(() => { if (btn) btn.style.background = 'rgba(255,255,255,0.06)'; }, 180);
          if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
        }
      });
    });
  }

  // Stage 3: Turbo Frenzy
  function renderStage3() {
    board.innerHTML = `
      <div style="padding:10px;height:100%;display:flex;flex-direction:column;justify-content:space-between">
        <div style="text-align:center">
          <div style="font-size:12px;color:#eab308;font-weight:800">STAGE 3: TURBO FRENZY RUSH!</div>
          <div style="font-size:14px;font-weight:700">Tap Glowing Golden & Star Tiles!</div>
        </div>
        <div class="stage3-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:260px;margin:0 auto;width:100%">
          ${Array.from({ length: 16 }).map((_, i) => `
            <button class="btn btn-outline" data-tile="${i}" style="height:48px;font-size:18px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1)">
              ·
            </button>
          `).join('')}
        </div>
        <div class="tiny muted" style="text-align:center">Rapid fire! Tap glowing stars before time expires!</div>
      </div>
      ${gameMiniSprite()}`;

    const tileBtns = board.querySelectorAll('[data-tile]');
    let activeBonus = [];

    const cycleBonus = () => {
      if (!running || stage !== 3) return;
      tileBtns.forEach((b) => {
        b.textContent = '·';
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.setAttribute('data-bonus', 'false');
      });
      activeBonus = [];
      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * 16);
        const b = tileBtns[idx];
        b.textContent = '⭐';
        b.style.background = '#eab308';
        b.style.borderColor = '#fef08a';
        b.setAttribute('data-bonus', 'true');
        activeBonus.push(idx);
      }
    };

    tileBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!running || stage !== 3) return;
        const isBonus = btn.getAttribute('data-bonus') === 'true';
        if (isBonus) {
          btn.setAttribute('data-bonus', 'false');
          btn.textContent = '✨';
          btn.style.background = '#22c55e';
          combo++;
          score += 150 + combo * 10;
          shell.scoreEl.textContent = `${score}`;
          burstOn(btn, ['⭐', '✨'], 3);
          if (typeof Sfx !== 'undefined') Sfx.tone(480 + (combo % 8) * 40, 0.1, 'sine', 0.14);
        } else {
          combo = 0;
          if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
        }
      });
    });

    cycleBonus();
    const bonusInterval = setInterval(cycleBonus, 850);
    shell.addCleanup(() => clearInterval(bonusInterval));
  }

  function loop(now) {
    if (!running) return;
    const elapsed = now - startedAt;
    const left = Math.max(0, DURATION - elapsed);
    shell.timerEl.textContent = `${(left / 1000).toFixed(1)}s`;
    shell.timerBar.style.width = `${(left / DURATION) * 100}%`;

    if (left <= 0) {
      running = false;
      showGameResult(shell, {
        kind: 'taptiles',
        score,
        coins: Math.round(score * 1.4),
        xp: 140,
        blurb: score >= 2200 ? 'Unstoppable Speed Tap Legend!' : 'Lightning Quick Reflexes!',
      });
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  renderStage();
  raf = requestAnimationFrame((t) => { startedAt = t; loop(t); });
  shell.addCleanup(() => { running = false; cancelAnimationFrame(raf); });
}

/* Hook openGame so all 4 new mini-games launch seamlessly */
if (typeof openGame !== 'undefined') {
  const prevOpenGameSim = window.openGame;
  window.openGame = function (kind) {
    if (kind === 'lifesim') openLifeSimGame();
    else if (kind === 'magictiles') openMagicTilesGame();
    else if (kind === 'rollingball') openRollingBallGame();
    else if (kind === 'taptiles') openTapTilesGame();
    else if (typeof prevOpenGameSim === 'function') prevOpenGameSim(kind);
  };
}
