/* The coin bank lives outside the save.

   Deleting the save file (clearing app data, starting over, or recovering from
   a damaged save) is meant to wipe the Hollow: sprites, eggs, unlocks, streaks
   and the journal all go. The coins a keeper already earned do not. Keeping a
   tiny wallet record under its own key means a fresh Hollow opens with the old
   balance instead of the starter 215, whatever happened to the save bytes. */

const COIN_BANK_KEY = 'sprite-hollow.coin-bank.v1';

const CoinBank = {
  /* The last balance that was written. A missing or unreadable record is 0. */
  read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(COIN_BANK_KEY) || 'null');
      return Math.max(0, Math.floor(Number(parsed && parsed.coins) || 0));
    } catch { return 0; }
  },

  /* Store the wallet. Never throws: a full device keeps the last value. */
  keep(coins) {
    const value = Math.max(0, Math.floor(Number(coins) || 0));
    try {
      localStorage.setItem(COIN_BANK_KEY, JSON.stringify({ coins: value, at: Date.now() }));
    } catch { /* a blocked store keeps the previous record */ }
  },

  /* A brand-new Hollow that really should start from zero clears the wallet
     first; otherwise the bank would hand the old balance to the new save. */
  clear() {
    try { localStorage.removeItem(COIN_BANK_KEY); } catch { /* a blocked store keeps the record */ }
  },

  /* Coins a fresh or rebuilt Hollow should open with: the larger of the banked
     wallet and whatever the new state already holds. */
  openingCoins(freshCoins = 0) {
    return Math.max(CoinBank.read(), Math.max(0, Math.floor(Number(freshCoins) || 0)));
  },
};
