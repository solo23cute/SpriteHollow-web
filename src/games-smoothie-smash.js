/* Smoothie Smash: a side-view kitchen game. Your sprite hops between the
   counter and the fruit, stomping each ingredient into the blender. Finish a
   recipe and the exact food it makes is added to the result card. */

Object.assign(GAME_INFO, {
  smoothie: {
    title: 'Smoothie Smash', icon: '🥤', tag: 'Jump & blend',
    desc: 'Stomp fruit and coffee ingredients, fill the blender, then serve the order.',
    g1: '#7fe0a0', g2: '#56c8e8',
  },
});

const SMASH_INGREDIENTS = {
  mango: { name: 'Mango', emoji: '🥭' },
  pineapple: { name: 'Pineapple', emoji: '🍍' },
  coconut: { name: 'Coconut', emoji: '🥥' },
  coffee: { name: 'Coffee', emoji: '☕' },
  milk: { name: 'Milk', emoji: '🥛' },
  ice: { name: 'Ice', emoji: '🧊' },
  strawberry: { name: 'Strawberry', emoji: '🍓' },
  banana: { name: 'Banana', emoji: '🍌' },
  apple: { name: 'Apple', emoji: '🍎' },
};

const SMASH_RECIPES = [
  {
    key: 'tropical', name: 'Tropical Smoothie', icon: '🥤',
    ingredients: ['mango', 'pineapple', 'coconut'],
    foods: ['mango', 'coconut'],
  },
  {
    key: 'coffee', name: 'Coffee Cooler', icon: '☕',
    ingredients: ['coffee', 'milk', 'ice'],
    foods: ['espresso', 'horchata'],
  },
  {
    key: 'snack', name: 'Fruit Snack', icon: '🍓',
    ingredients: ['strawberry', 'banana', 'apple'],
    foods: ['starfruit', 'peach'],
  },
];

function openSmoothieSmashGame() {
  const s = activeSprite();
  if (!s) {
    toast('Hatch a sprite first to run the smoothie bar.', '🥤');
    return;
  }
  if (s.stage === 'egg') {
    toast('Hatch this egg before stepping behind the blender.', '🥚');
    return;
  }
  Sfx.init();
  const shell = gameOverlayShell('smoothie');
  const { board } = shell;

  board.innerHTML = `<div class="smash-wrap" data-smash-wrap>
      <div class="smash-wall" aria-hidden="true"></div>
      <div class="smash-counter" aria-hidden="true"></div>
      <div class="smash-hud">
        <span>Order <b data-smash-order>1 / 3</b></span>
        <span>Score <b data-smash-score>0</b></span>
      </div>
      <div class="smash-recipe">
        <div class="smash-recipe-head">
          <span class="smash-recipe-icon" data-smash-recipe-icon>🥤</span>
          <div>
            <b data-smash-recipe-name>Tropical Smoothie</b>
            <span class="smash-recipe-sub" data-smash-reward>Reward: 🥭 Mango + 🥥 Coconut</span>
          </div>
        </div>
        <div class="smash-needs" data-smash-needs></div>
      </div>
      <div class="smash-blender" aria-hidden="true">
        <div class="smash-cup"><i data-smash-fill></i><b data-smash-cup-icon>🥤</b></div>
        <span>Blender</span>
      </div>
      <div class="smash-stage" data-smash-stage>
        <div class="smash-player" data-smash-player>${spriteSVG(s, { expr: 'happy' })}</div>
      </div>
      <div class="smash-msg" data-smash-msg>Jump on every ingredient!</div>
      <div class="smash-controls">
        <button type="button" data-smash-left aria-label="Move left">◀</button>
        <button type="button" class="smash-jump" data-smash-jump>Jump</button>
        <button type="button" data-smash-right aria-label="Move right">▶</button>
      </div>
    </div>`;

  const wrap = board.querySelector('[data-smash-wrap]');
  const stage = board.querySelector('[data-smash-stage]');
  const playerEl = board.querySelector('[data-smash-player]');
  const orderEl = board.querySelector('[data-smash-order]');
  const scoreDisplay = board.querySelector('[data-smash-score]');
  const recipeIcon = board.querySelector('[data-smash-recipe-icon]');
  const recipeName = board.querySelector('[data-smash-recipe-name]');
  const rewardEl = board.querySelector('[data-smash-reward]');
  const needsEl = board.querySelector('[data-smash-needs]');
  const fillEl = board.querySelector('[data-smash-fill]');
  const cupIcon = board.querySelector('[data-smash-cup-icon]');
  const messageEl = board.querySelector('[data-smash-msg]');
  const leftBtn = board.querySelector('[data-smash-left]');
  const rightBtn = board.querySelector('[data-smash-right]');
  const jumpBtn = board.querySelector('[data-smash-jump]');

  const FLOOR = 15;
  const GRAVITY = 210;
  const JUMP_SPEED = 118;
  const PLAYER_HALF = 8;
  const FRUIT_TOP = 10;
  const ORDER_COUNT = 3;

  let running = true;
  let phase = 'play';
  let px = 50;
  let py = FLOOR;
  let vy = 0;
  let left = false;
  let right = false;
  let score = 0;
  let served = 0;
  let orderIndex = 0;
  let recipe = null;
  let collected = [];
  let rewardFoods = [];
  let fruits = [];
  let raf = 0;
  let lastFrame = performance.now();
  let blendTimer = 0;
  let timerCtl = null;
  const respawnTimers = new Set();
  const queue = kShuffle(SMASH_RECIPES).slice(0, ORDER_COUNT);

  function ingredient(key) {
    return SMASH_INGREDIENTS[key] || { name: key, emoji: '🍽️' };
  }

  function updateHud() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (shell.scoreEl) shell.scoreEl.textContent = score.toLocaleString('en-US');
    if (orderEl) orderEl.textContent = `${Math.min(served + 1, ORDER_COUNT)} / ${ORDER_COUNT}`;
    if (fillEl) fillEl.style.height = `${Math.min(100, (collected.length / 3) * 100)}%`;
    if (cupIcon && recipe) cupIcon.textContent = recipe.icon;
  }

  function renderRecipe() {
    if (!recipe) return;
    wrap.dataset.recipe = recipe.key;
    recipeIcon.textContent = recipe.icon;
    recipeName.textContent = recipe.name;
    const rewardNames = recipe.foods
      .filter((key) => typeof FOODS !== 'undefined' && FOODS[key])
      .map((key) => `${FOODS[key].emoji} ${FOODS[key].name}`)
      .join(' + ');
    rewardEl.textContent = rewardNames ? `Reward: ${rewardNames}` : 'Reward: pantry food';
    needsEl.innerHTML = recipe.ingredients.map((key) => {
      const ing = ingredient(key);
      const done = collected.includes(key);
      return `<span class="smash-need ${done ? 'done' : ''}"><b>${done ? '✓' : ing.emoji}</b>${ing.name}</span>`;
    }).join('');
    updateHud();
  }

  function showFloat(text, x, y, cls = '') {
    const node = document.createElement('span');
    node.className = `smash-float ${cls}`.trim();
    node.textContent = text;
    node.style.left = `${x}%`;
    node.style.bottom = `${y}%`;
    stage.appendChild(node);
    setTimeout(() => node.remove(), 900);
  }

  function clearFruits() {
    respawnTimers.forEach((timer) => clearTimeout(timer));
    respawnTimers.clear();
    fruits.forEach((fruit) => fruit.el.remove());
    fruits = [];
  }

  function spawnFruit(key, x, y) {
    const ing = ingredient(key);
    const el = document.createElement('div');
    el.className = 'smash-fruit';
    el.dataset.key = key;
    el.setAttribute('aria-label', ing.name);
    el.innerHTML = `<span>${ing.emoji}</span>`;
    el.style.left = `${x}%`;
    el.style.bottom = `${y}%`;
    stage.insertBefore(el, playerEl);
    const fruit = {
      key, x, y, el, active: true,
      dir: Math.random() < 0.5 ? -1 : 1,
      speed: 8 + Math.random() * 12,
    };
    fruits.push(fruit);
    return fruit;
  }

  function placeFruit(key, x, y) {
    const safeX = Math.max(12, Math.min(88, Number(x) || 50));
    const safeY = Math.max(18, Math.min(36, Number(y) || 28));
    return spawnFruit(key, safeX, safeY);
  }

  function loadRecipe() {
    if (!running) return;
    if (orderIndex >= queue.length) {
      finish();
      return;
    }
    recipe = queue[orderIndex];
    collected = [];
    phase = 'play';
    clearFruits();
    /* Put every needed ingredient on the counter, plus one duplicate so a
       missed stomp never soft-locks the order. */
    const keys = recipe.ingredients.concat([recipe.ingredients[Math.floor(Math.random() * recipe.ingredients.length)]]);
    const xs = [16, 30, 44, 58, 72, 86];
    keys.forEach((key, index) => {
      placeFruit(key, xs[index % xs.length], 21 + Math.random() * 13);
    });
    playerEl.style.left = `${px}%`;
    playerEl.style.bottom = `${py}%`;
    messageEl.textContent = `Stomp the ${recipe.ingredients.map((key) => ingredient(key).name).join(', ')}!`;
    renderRecipe();
  }

  function collectIngredient(key) {
    if (!running || phase !== 'play' || !recipe) return false;
    if (!recipe.ingredients.includes(key)) return false;
    if (collected.includes(key)) {
      score += 2;
      showFloat('+2 bonus', px, py + 10, 'bonus');
      updateHud();
      return true;
    }
    collected.push(key);
    score += 15;
    Sfx.chime();
    showFloat(`+${ingredient(key).emoji}`, px, py + 10, 'good');
    renderRecipe();
    if (collected.length >= recipe.ingredients.length) completeOrder();
    else messageEl.textContent = `${collected.length} / ${recipe.ingredients.length} ingredients in the blender.`;
    return true;
  }

  function completeOrder() {
    if (phase !== 'play' || !recipe) return;
    phase = 'blend';
    Sfx.pop();
    wrap.classList.add('is-blending');
    messageEl.textContent = `Blending ${recipe.name}…`;
    updateHud();
    blendTimer = setTimeout(() => {
      if (!running) return;
      wrap.classList.remove('is-blending');
      served += 1;
      score += 60;
      recipe.foods.forEach((key) => {
        if (!rewardFoods.includes(key)) rewardFoods.push(key);
      });
      showFloat(`${recipe.icon} Order up!`, 50, 52, 'order');
      const finishedRecipe = recipe;
      messageEl.textContent = `${finishedRecipe.name} served!`;
      updateHud();
      orderIndex += 1;
      if (orderIndex >= queue.length) {
        setTimeout(() => { if (running) finish(); }, 620);
      } else {
        setTimeout(() => { if (running) loadRecipe(); }, 620);
      }
    }, 1100);
  }

  function jump() {
    if (!running || phase !== 'play') return false;
    if (py > FLOOR + 0.6) return false;
    vy = JUMP_SPEED;
    Sfx.pop();
    return true;
  }

  function squashFruit(fruit) {
    if (!fruit || !fruit.active) return;
    fruit.active = false;
    fruit.el.classList.add('smashed');
    const timer = setTimeout(() => {
      respawnTimers.delete(timer);
      if (!running || !fruits.includes(fruit)) return;
      fruit.active = true;
      fruit.el.classList.remove('smashed');
      fruit.x = 14 + Math.random() * 72;
      fruit.y = 20 + Math.random() * 14;
      fruit.dir = Math.random() < 0.5 ? -1 : 1;
      fruit.speed = 8 + Math.random() * 12;
      fruit.el.style.left = `${fruit.x}%`;
      fruit.el.style.bottom = `${fruit.y}%`;
    }, 850);
    respawnTimers.add(timer);
  }

  function checkStomps() {
    if (vy >= 0) return;
    for (const fruit of fruits) {
      if (!fruit.active) continue;
      const top = fruit.y + FRUIT_TOP;
      if (py < fruit.y - 2 || py > top + 5) continue;
      if (Math.abs(px - fruit.x) > PLAYER_HALF + 4) continue;
      squashFruit(fruit);
      if (collectIngredient(fruit.key)) {
        vy = 64;
        break;
      }
    }
  }

  function finish() {
    if (!running) return;
    running = false;
    phase = 'over';
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (timerCtl) timerCtl.stop();
    if (blendTimer) clearTimeout(blendTimer);
    clearFruits();
    const blurb = served >= ORDER_COUNT
      ? 'Three orders served — the café is proud!'
      : served > 0
        ? `${served} order${served === 1 ? '' : 's'} served!`
        : 'The blender stayed empty this time.';
    shell.hintEl.textContent = 'Smoothie Smash · recipe foods go straight to your pantry';
    showGameResult(shell, {
      kind: 'smoothie',
      score,
      coins: 24 + score + served * 12,
      xp: 35 + served * 12,
      blurb,
      foodKeys: rewardFoods,
    });
  }

  function setMove(direction, on) {
    if (direction < 0) left = on;
    else right = on;
    leftBtn.classList.toggle('is-down', left);
    rightBtn.classList.toggle('is-down', right);
  }

  const onKeyDown = (event) => {
    if (!running) return;
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      setMove(-1, true);
      event.preventDefault();
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      setMove(1, true);
      event.preventDefault();
    } else if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      jump();
      event.preventDefault();
    }
  };
  const onKeyUp = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') setMove(-1, false);
    if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') setMove(1, false);
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  leftBtn.addEventListener('pointerdown', (event) => { event.preventDefault(); setMove(-1, true); });
  rightBtn.addEventListener('pointerdown', (event) => { event.preventDefault(); setMove(1, true); });
  [leftBtn, rightBtn].forEach((button) => {
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => {
      button.addEventListener(name, () => setMove(button === leftBtn ? -1 : 1, false));
    });
  });
  jumpBtn.addEventListener('pointerdown', (event) => { event.preventDefault(); jump(); });

  const frame = (now) => {
    if (!running) return;
    const dt = Math.min(0.034, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (phase === 'play') {
      const move = (right ? 1 : 0) - (left ? 1 : 0);
      px = Math.max(9, Math.min(91, px + move * 58 * dt));
      vy -= GRAVITY * dt;
      py += vy * dt;
      if (py <= FLOOR) {
        py = FLOOR;
        vy = 0;
      }
      if (vy < 0) checkStomps();
    }
    for (const fruit of fruits) {
      if (!fruit.active) continue;
      fruit.x += fruit.dir * fruit.speed * dt;
      if (fruit.x < 10 || fruit.x > 90) {
        fruit.dir *= -1;
        fruit.x = Math.max(10, Math.min(90, fruit.x));
      }
      fruit.el.style.left = `${fruit.x}%`;
    }
    playerEl.style.left = `${px}%`;
    playerEl.style.bottom = `${py}%`;
    playerEl.classList.toggle('is-jumping', py > FLOOR + 0.5);
    raf = requestAnimationFrame(frame);
  };

  const testApi = {
    state: () => ({
      running,
      phase,
      order: Math.min(served + 1, ORDER_COUNT),
      served,
      score,
      recipe: recipe ? recipe.key : null,
      ingredients: recipe ? recipe.ingredients.slice() : [],
      collected: collected.slice(),
      rewards: rewardFoods.slice(),
      player: { x: px, y: py, vy },
      fruits: fruits.map((fruit) => ({ key: fruit.key, x: fruit.x, y: fruit.y, active: fruit.active })),
    }),
    collect: (key) => collectIngredient(key),
    place: (key, x, y) => placeFruit(key, x, y),
    jump: () => jump(),
    finish: () => finish(),
  };
  window.__smoothieSmashTest = testApi;

  shell.addCleanup(() => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (blendTimer) clearTimeout(blendTimer);
    if (timerCtl) timerCtl.stop();
    respawnTimers.forEach((timer) => clearTimeout(timer));
    respawnTimers.clear();
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (window.__smoothieSmashTest === testApi) delete window.__smoothieSmashTest;
  });

  loadRecipe();
  timerCtl = kCountdown(shell, 52, null, finish);
  raf = requestAnimationFrame((now) => {
    lastFrame = now;
    frame(now);
  });
}
