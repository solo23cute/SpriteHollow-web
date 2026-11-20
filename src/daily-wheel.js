/* The Daily Wheel: a coin wheel you can spin once a day for free, plus a couple
   of paid spins while the day lasts. Every prize is Hollow coins.

   Progress lives on the save (state.wheel), so starting a new Hollow hands over
   a new wheel; the coins it pays follow the same wallet rules as every other
   payout. The wheel sheet and the Activities card share one source of truth,
   wheelInfo(), so the card can never promise a spin the sheet refuses. */

const WHEEL_PRIZES = [
  { label: '10', coins: 10, color: '#ff9a5a' },
  { label: '25', coins: 25, color: '#56c8e8' },
  { label: '5', coins: 5, color: 'var(--accent)' },
  { label: '100', coins: 100, color: '#ffd84d' },
  { label: '15', coins: 15, color: '#7ee787' },
  { label: 'Dud', coins: 0, color: '#574f7a' },
  { label: '50', coins: 50, color: '#ff5e8a' },
  { label: '20', coins: 20, color: '#38bdf8' },
  { label: '75', coins: 75, color: '#f2a23c' },
  { label: '10', coins: 10, color: '#c084fc' },
  { label: '250', coins: 250, color: 'var(--gold)' },
  { label: '15', coins: 15, color: '#34d399' },
];
const WHEEL_PAID_COST = 60;
const WHEEL_PAID_LIMIT = 2;
const WHEEL_SPIN_MS = 3400;
const WHEEL_SLICE = 360 / WHEEL_PRIZES.length;

function emptyWheelState() {
  return { day: null, free: false, paid: 0, won: 0, lifetime: 0 };
}

/* Today's wheel. A new day clears the free spin, the paid allowance and today's
   winnings, but keeps the lifetime total so the card can show what it paid. */
function wheelInfo() {
  if (!state.wheel || typeof state.wheel !== 'object' || Array.isArray(state.wheel)) {
    state.wheel = emptyWheelState();
  }
  if (state.wheel.day !== dayKey()) {
    state.wheel = {
      day: dayKey(),
      free: false,
      paid: 0,
      won: 0,
      lifetime: Math.max(0, Math.floor(Number(state.wheel.lifetime) || 0)),
    };
  }
  const wheel = state.wheel;
  const paid = Math.max(0, Math.floor(Number(wheel.paid) || 0));
  return {
    free: !!wheel.free,
    paid,
    paidLeft: Math.max(0, WHEEL_PAID_LIMIT - paid),
    won: Math.max(0, Math.floor(Number(wheel.won) || 0)),
    lifetime: Math.max(0, Math.floor(Number(wheel.lifetime) || 0)),
  };
}

function wheelGradient() {
  return WHEEL_PRIZES
    .map((prize, i) => `${prize.color} ${i * WHEEL_SLICE}deg ${(i + 1) * WHEEL_SLICE}deg`)
    .join(',');
}

function wheelLabels() {
  return WHEEL_PRIZES
    .map((prize, i) => `<span style="position:absolute;left:calc(50% - 20px);top:0;width:40px;height:50%;transform-origin:50% 100%;transform:rotate(${i * WHEEL_SLICE + WHEEL_SLICE / 2}deg);display:flex;justify-content:center;padding-top:16px;font-size:11px;font-weight:800;color:#170c26;text-shadow:0 1px 0 rgba(255,255,255,.4)">${prize.label}</span>`)
    .join('');
}

function wheelMiniHTML() {
  return `<span aria-hidden="true" style="display:inline-block;width:52px;height:52px;border-radius:50%;background:conic-gradient(${wheelGradient()});border:2px solid rgba(255,255,255,.7);box-shadow:inset 0 0 0 7px rgba(22,12,38,.55)"></span>`;
}

/* The Activities card: today's spins at a glance, with the wheel one tap away. */
function wheelHubHTML() {
  const info = wheelInfo();
  const free = !info.free;
  const status = free
    ? 'Free spin ready'
    : info.paidLeft > 0
      ? `${info.paidLeft} bonus spin${info.paidLeft === 1 ? '' : 's'} left · ${WHEEL_PAID_COST} coins each`
      : 'Wheel rested until tomorrow';
  return `<div class="card wheel-hub" style="padding:14px;margin-bottom:16px;display:flex;gap:12px;align-items:center;border-color:rgba(255,216,77,.34);background:linear-gradient(135deg,rgba(255,216,77,.10),rgba(255,94,138,.06))">
    ${wheelMiniHTML()}
    <span style="flex:1;min-width:0">
      <div class="arcade-kicker">📅 Daily bonus</div>
      <b style="font-size:13px">🎡 Daily Wheel</b>
      <div class="tiny muted" style="line-height:1.5;margin-top:2px">${status}${info.won ? ` · ${info.won.toLocaleString()} coins won today` : ''}</div>
      <div class="row" style="gap:5px;flex-wrap:wrap;margin-top:6px">
        <span class="chip">🎁 ${free ? '1 free' : '0 free'}</span>
        <span class="chip">🪙 ${WHEEL_PAID_COST} bonus</span>
        <span class="chip">🏆 ${info.lifetime.toLocaleString()} lifetime</span>
      </div>
    </span>
    <button class="btn ${free ? 'btn-gold' : 'btn-soft'} btn-sm" data-open-wheel>${free ? 'Spin' : 'Open'}</button>
  </div>`;
}

function openWheelSheet() {
  let spinning = false;
  let angle = 0;
  let settleTimer = 0;

  const body = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:4px 0 2px">
    <div style="position:relative;width:min(70vw,264px);height:min(70vw,264px)">
      <div style="position:absolute;left:50%;top:-6px;transform:translateX(-50%);z-index:3;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:22px solid #fff;filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))"></div>
      <div data-wheel style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(${wheelGradient()});border:4px solid rgba(255,255,255,.88);box-shadow:0 12px 34px rgba(0,0,0,.4)">${wheelLabels()}</div>
      <span data-wheel-hub style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:#170c26;border:2px solid rgba(255,255,255,.8)">🎡</span>
    </div>
    <div class="tiny muted" data-wheel-msg style="text-align:center;min-height:32px;line-height:1.5">Spin the wheel for coins. Every stop pays something except the dud.</div>
    <div class="row" style="width:100%;gap:8px;max-width:340px">
      <button class="btn btn-gold" data-wheel-spin style="flex:1">🎁 Free spin</button>
      <button class="btn btn-soft" data-wheel-paid style="flex:1">🪙 ${WHEEL_PAID_COST}</button>
    </div>
    <div class="tiny muted" data-wheel-status style="text-align:center"></div>
    <div class="row" style="gap:5px;flex-wrap:wrap;justify-content:center">
      ${WHEEL_PRIZES.filter((prize) => prize.coins > 0).map((prize) => `<span class="chip">${prize.label} 🪙</span>`).join('')}
    </div>
  </div>`;

  const { overlay, close } = openSheet({
    title: '🎡 Daily Wheel',
    sub: 'One free spin a day, plus two bonus spins. Every prize is coins.',
    body,
    onClose: () => clearTimeout(settleTimer),
    onMount: (root) => {
      const wheel = root.querySelector('[data-wheel]');
      const msg = root.querySelector('[data-wheel-msg]');
      const status = root.querySelector('[data-wheel-status]');
      const spinBtn = root.querySelector('[data-wheel-spin]');
      const paidBtn = root.querySelector('[data-wheel-paid]');

      function paint() {
        const info = wheelInfo();
        const free = !info.free;
        spinBtn.disabled = spinning || !free;
        spinBtn.textContent = free ? '🎁 Free spin' : 'Free spin used';
        paidBtn.disabled = spinning || info.paidLeft <= 0 || Math.max(0, Number(state.coins) || 0) < WHEEL_PAID_COST;
        paidBtn.textContent = info.paidLeft > 0 ? `🪙 ${WHEEL_PAID_COST}` : 'No bonus spins';
        status.textContent = `${free ? '1 free spin ready' : 'Free spin used'} · ${info.paidLeft}/${WHEEL_PAID_LIMIT} bonus spins · ${info.won.toLocaleString()} coins today · ${info.lifetime.toLocaleString()} lifetime`;
      }

      function spin(paid) {
        if (spinning) return;
        const res = Actions.spinWheel({ paid });
        if (!res.ok) {
          if (res.reason === 'coins') toast(`The wheel needs ${WHEEL_PAID_COST} coins for a bonus spin.`, '🪙');
          else if (res.reason === 'limit') toast('Both bonus spins are used. Come back tomorrow.', '🎡');
          else toast('The free spin is already used today.', '🎡');
          paint();
          return;
        }
        spinning = true;
        spinBtn.disabled = true;
        paidBtn.disabled = true;
        msg.textContent = paid ? 'A bonus spin…' : 'Spinning…';
        const center = res.index * WHEEL_SLICE + WHEEL_SLICE / 2;
        angle = Math.ceil(angle / 360) * 360 + 360 * 5 + (360 - center);
        wheel.style.transition = `transform ${WHEEL_SPIN_MS}ms cubic-bezier(.12,.72,.08,1)`;
        wheel.style.transform = `rotate(${angle}deg)`;
        Sfx.tick();
        settleTimer = setTimeout(() => {
          spinning = false;
          const prize = res.prize;
          msg.textContent = prize.coins
            ? `${prize.label} coins!${paid ? ` That bonus spin cost ${WHEEL_PAID_COST}.` : ' Banked straight into your wallet.'}`
            : paid
              ? 'The dud stop. That bonus spin did not pay this time.'
              : 'The dud stop this time. There is always tomorrow.';
          if (prize.coins) { Sfx.coin(); burstOn(wheel, ['🪙', '✨'], 8); } else Sfx.error();
          paint();
          if (typeof App !== 'undefined' && App.refresh) App.refresh();
        }, WHEEL_SPIN_MS + 80);
      }

      spinBtn.addEventListener('click', () => spin(false));
      paidBtn.addEventListener('click', () => spin(true));
      paint();
    },
  });
  return { overlay, close };
}

/* The action that actually moves the wallet. Committed once per spin so the
   save, the cloud copy and the coin bank all see the new balance together. */
Object.assign(Actions, {
  spinWheel({ paid = false } = {}) {
    const info = wheelInfo();
    if (paid) {
      if (info.paidLeft <= 0) return { ok: false, reason: 'limit' };
      if (Math.max(0, Number(state.coins) || 0) < WHEEL_PAID_COST) return { ok: false, reason: 'coins' };
      addCoinsRaw(-WHEEL_PAID_COST);
      state.wheel.paid = info.paid + 1;
    } else {
      if (info.free) return { ok: false, reason: 'used' };
      state.wheel.free = true;
    }
    const index = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[index];
    if (prize.coins > 0) addCoinsRaw(prize.coins);
    state.wheel.won = info.won + prize.coins;
    state.wheel.lifetime = info.lifetime + prize.coins;
    commit('wheel', { paid, coins: prize.coins, index });
    return { ok: true, index, prize, coins: prize.coins, cost: paid ? WHEEL_PAID_COST : 0, paid };
  },
});
