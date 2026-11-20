/* Sugar Swap: a Candy Crush-style match-3 puzzle. Swap two neighbouring candies to line up
   three or more. Chains cascade for bonus points. Rewards are in-game coins only. */

Object.assign(GAME_INFO, {
  candyswap: { title: 'Sugar Swap', icon: '🍬', tag: 'Puzzle', desc: 'Swap neighbours to line up three or more. Chain for bonus points. 20 moves.', g1: '#ff8fc8', g2: '#ffd166' },
});

const SWAP_CANDIES = ['🍬', '🍭', '🍫', '🍩', '🍡'];
const SWAP_COLS = 7;
const SWAP_ROWS = 7;
const SWAP_MOVES = 20;

function swapRandom() {
  return SWAP_CANDIES[Math.floor(Math.random() * SWAP_CANDIES.length)];
}

/* Every cell that sits in a horizontal or vertical run of three or more. */
function swapFindMatches(grid) {
  const hit = new Set();
  for (let r = 0; r < SWAP_ROWS; r++) {
    let c = 0;
    while (c < SWAP_COLS) {
      let end = c;
      while (end + 1 < SWAP_COLS && grid[r][end + 1] && grid[r][end + 1] === grid[r][c]) end++;
      if (grid[r][c] && end - c + 1 >= 3) for (let k = c; k <= end; k++) hit.add(`${r},${k}`);
      c = end + 1;
    }
  }
  for (let c = 0; c < SWAP_COLS; c++) {
    let r = 0;
    while (r < SWAP_ROWS) {
      let end = r;
      while (end + 1 < SWAP_ROWS && grid[end + 1][c] && grid[end + 1][c] === grid[r][c]) end++;
      if (grid[r][c] && end - r + 1 >= 3) for (let k = r; k <= end; k++) hit.add(`${k},${c}`);
      r = end + 1;
    }
  }
  return [...hit].map((key) => key.split(',').map(Number));
}

function swapCells(grid, [r1, c1], [r2, c2]) {
  const tmp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = tmp;
}

/* True when at least one neighbouring swap would create a match. */
function swapHasMove(grid) {
  for (let r = 0; r < SWAP_ROWS; r++) {
    for (let c = 0; c < SWAP_COLS; c++) {
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= SWAP_ROWS || nc >= SWAP_COLS) continue;
        swapCells(grid, [r, c], [nr, nc]);
        const ok = swapFindMatches(grid).length > 0;
        swapCells(grid, [r, c], [nr, nc]);
        if (ok) return true;
      }
    }
  }
  return false;
}

function swapMakeBoard() {
  let grid;
  do {
    grid = Array.from({ length: SWAP_ROWS }, () => Array.from({ length: SWAP_COLS }, swapRandom));
  } while (swapFindMatches(grid).length || !swapHasMove(grid));
  return grid;
}

/* Drop candies down each column and refill the top from random. */
function swapFillGaps(grid) {
  for (let c = 0; c < SWAP_COLS; c++) {
    const column = [];
    for (let r = SWAP_ROWS - 1; r >= 0; r--) if (grid[r][c]) column.push(grid[r][c]);
    for (let r = SWAP_ROWS - 1; r >= 0; r--) grid[r][c] = column.length ? column.shift() : swapRandom();
  }
}

/* Clear matches, drop, repeat until the board settles. Returns points and the longest chain. */
function swapResolve(grid) {
  let points = 0;
  let chain = 0;
  for (;;) {
    const matches = swapFindMatches(grid);
    if (!matches.length) break;
    chain += 1;
    points += matches.length * 10 * chain;
    matches.forEach(([r, c]) => { grid[r][c] = null; });
    swapFillGaps(grid);
  }
  return { points, chain };
}

function openCandySwapGame() {
  const shell = gameOverlayShell('candyswap');
  const { board } = shell;
  board.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px">
      <div data-grid style="display:grid;grid-template-columns:repeat(${SWAP_COLS},1fr);gap:4px;width:min(94%,360px)"></div>
      <div class="tiny muted" data-msg>Tap a candy, then a neighbour to swap.</div>
    </div>${gameMiniSprite()}`;

  const gridEl = board.querySelector('[data-grid]');
  const msgEl = board.querySelector('[data-msg]');
  let grid = swapMakeBoard();
  let selected = null;
  let moves = SWAP_MOVES;
  let score = 0;
  let running = true;
  const timers = [];

  function refreshHud() {
    shell.timerEl.textContent = `Moves ${moves}`;
    shell.timerBar.style.width = `${(moves / SWAP_MOVES) * 100}%`;
    shell.scoreEl.textContent = score;
  }

  function render() {
    gridEl.innerHTML = grid
      .flatMap((row, r) => row.map((candy, c) => {
        const picked = selected && selected.r === r && selected.c === c;
        return `<button data-r="${r}" data-c="${c}" style="aspect-ratio:1;font-size:clamp(18px,6vw,26px);line-height:1;border-radius:10px;border:2px solid ${picked ? '#ffd84d' : 'var(--line)'};background:${picked ? 'rgba(255,216,77,.22)' : 'rgba(255,255,255,.07)'};padding:0;cursor:pointer">${candy}</button>`;
      }))
      .join('');
  }

  function attemptSwap(a, b) {
    swapCells(grid, [a.r, a.c], [b.r, b.c]);
    if (!swapFindMatches(grid).length) {
      swapCells(grid, [a.r, a.c], [b.r, b.c]);
      msgEl.textContent = 'No match there. Try another swap.';
      Sfx.error();
      return;
    }
    moves -= 1;
    const { points, chain } = swapResolve(grid);
    score += points;
    if (!swapHasMove(grid)) {
      grid = swapMakeBoard();
      msgEl.textContent = 'No moves left, so the board reshuffled!';
    } else {
      msgEl.textContent = chain > 1 ? `Chain x${chain}! +${points}` : `+${points}`;
    }
    Sfx.pop();
    burstOn(gridEl, ['✨', '🍬'], chain > 1 ? 8 : 4);
    refreshHud();
    if (moves <= 0) {
      running = false;
      timers.push(setTimeout(finish, 500));
    }
  }

  gridEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn || !running) return;
    const cell = { r: Number(btn.dataset.r), c: Number(btn.dataset.c) };
    if (!selected) {
      selected = cell;
    } else if (selected.r === cell.r && selected.c === cell.c) {
      selected = null;
    } else if (Math.abs(selected.r - cell.r) + Math.abs(selected.c - cell.c) === 1) {
      const from = selected;
      selected = null;
      attemptSwap(from, cell);
    } else {
      selected = cell;
    }
    render();
  });

  function finish() {
    if (shell.isClosed()) return;
    showGameResult(shell, {
      kind: 'candyswap',
      score,
      coins: Math.min(160, Math.round(score / 10)),
      xp: Math.min(60, 8 + Math.round(score / 25)),
      blurb: score >= 800 ? 'Sugar champion!' : score >= 400 ? 'Sweet chains!' : score > 0 ? 'A tasty little run.' : 'The candies stayed stuck.',
    });
  }

  shell.addCleanup(() => { running = false; timers.forEach(clearTimeout); });
  refreshHud();
  render();
}
