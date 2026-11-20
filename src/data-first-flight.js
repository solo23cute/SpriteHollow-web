/* First Flight Phase 0 economy constants.
   Kept in one data object so the booted-frame regression and the runtime read
   the same numbers. These are deliberately conservative: a walk or game should
   pay roughly one care block, not the old flat 5,000. */
const FIRST_FLIGHT_RULES = Object.freeze({
  STARTING_COINS: 215,
  GAME_COIN_BASE: 100,
  GAME_COIN_SCORE_VALUE: 10,
  GAME_COIN_CAP: 200,
  BATH_XP: 8,
  BATH_COINS: 3,
  BATH_COOLDOWN_MS: 20000,
  WALK_TARGET_COINS: 200,
});
