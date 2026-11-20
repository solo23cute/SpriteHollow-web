/* Cloud Sync: Firebase Authentication + Cloud Firestore for Sprite Hollow saves.
   The web app config can come from src/firebase-config.js
   (window.SPRITE_HOLLOW_FIREBASE) or from the in-app Cloud setup screen,
   which stores it on this device under CLOUD_CONFIG_KEY.
   Firebase's web API key is public; protect data with the Firestore rules
   documented in src/firebase-config.js. */

const CLOUD_SDK_VERSION = '10.12.5';
const CLOUD_SDK_BASE = `https://www.gstatic.com/firebasejs/${CLOUD_SDK_VERSION}/`;
const CLOUD_CONFIG_KEY = 'sprite-hollow.cloud-config.v1';

let cloudUser = null;
let cloudInit = null;
let cloudAuthHooked = false;
let cloudListeners = [];

function cloudStoredConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw);
    return cfg && typeof cfg === 'object' ? cfg : null;
  } catch (err) {
    console.warn('Cloud config could not be read', err);
    return null;
  }
}

function cloudNormalizeConfig(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Paste the Firebase web config object.' };
  if (raw.firebaseConfig && typeof raw.firebaseConfig === 'object') raw = raw.firebaseConfig;
  const cfg = {
    apiKey: raw.apiKey,
    authDomain: raw.authDomain,
    projectId: raw.projectId,
    appId: raw.appId,
    storageBucket: raw.storageBucket,
    messagingSenderId: raw.messagingSenderId,
    // Only used by the Android shell's native Google sign-in.
    googleClientId: raw.googleClientId
  };
  const missing = ['apiKey', 'authDomain', 'projectId', 'appId'].filter((key) => typeof cfg[key] !== 'string' || !cfg[key].trim());
  if (missing.length) return { error: `That config is missing ${missing.join(', ')}. Paste the whole firebaseConfig block from Firebase.` };
  if (!/^[a-z0-9.-]+$/i.test(cfg.authDomain)) return { error: 'authDomain should look like your-project.firebaseapp.com.' };
  Object.keys(cfg).forEach((key) => { if (typeof cfg[key] === 'string') cfg[key] = cfg[key].trim(); });
  return { config: cfg };
}

function parseCloudConfigText(text) {
  const src = String(text || '').trim();
  if (!src) return { error: 'Paste your Firebase web config first.' };
  const start = src.indexOf('{');
  const end = src.lastIndexOf('}');
  if (start < 0 || end <= start) return { error: 'That does not look like a Firebase config object.' };
  const body = src.slice(start, end + 1);
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (jsonErr) {
    try {
      obj = Function('"use strict";return (' + body + ');')();
    } catch (evalErr) {
      return { error: 'Could not read that config. Paste it exactly as Firebase shows it — the const firebaseConfig = { ... } block is fine.' };
    }
  }
  return cloudNormalizeConfig(obj);
}

function saveCloudConfig(config) {
  const normalized = cloudNormalizeConfig(config);
  if (normalized.error) throw new Error(normalized.error);
  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(normalized.config));
  cloudResetRuntime();
  document.dispatchEvent(new CustomEvent('cloud-config-changed'));
  return normalized.config;
}

function removeCloudConfig() {
  try { localStorage.removeItem(CLOUD_CONFIG_KEY); } catch (err) { console.warn(err); }
  cloudResetRuntime();
  document.dispatchEvent(new CustomEvent('cloud-config-changed'));
}

function cloudResetRuntime() {
  cloudUser = null;
  cloudInit = null;
  cloudAuthHooked = false;
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
    try { firebase.app().delete(); } catch (err) { console.warn('Cloud app reset', err); }
  }
  cloudListeners.slice().forEach((fn) => {
    try { fn(null); } catch (err) { console.error(err); }
  });
}

function cloudConfig() {
  const cfg = cloudStoredConfig() || window.SPRITE_HOLLOW_FIREBASE;
  if (!cfg || typeof cfg !== 'object') return null;
  return cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId ? cfg : null;
}

function cloudConfigSource() {
  if (cloudStoredConfig()) return 'device';
  return window.SPRITE_HOLLOW_FIREBASE ? 'file' : null;
}

function cloudConfigured() {
  return !!cloudConfig();
}

function cloudConfigText() {
  const cfg = cloudConfig();
  return cfg ? JSON.stringify(cfg, null, 2) : '';
}

function cloudEmbeddedBrowser() {
  const ua = navigator.userAgent || '';
  if (/\bwv\b/.test(ua) || /; wv\)/.test(ua)) return true;
  if (/Android/.test(ua) && /Version\/[\d.]+ Chrome\/[\d.]+ Mobile Safari/.test(ua)) return true;
  if (/FBAN|FBAV|Instagram|Line\/|Twitter/.test(ua)) return true;
  return false;
}

function cloudLoadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-cloud-sdk="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') { resolve(); return; }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error('Could not load the cloud sync library. Check your internet connection.')), { once: true });
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.dataset.cloudSdk = src;
    el.onload = () => { el.dataset.loaded = '1'; resolve(); };
    el.onerror = () => {
      el.remove();
      reject(new Error('Could not load the cloud sync library. Check your internet connection.'));
    };
    document.head.appendChild(el);
  });
}

function cloudFriendlyError(err) {
  const code = (err && err.code) || '';
  const host = location.hostname || 'this site';
  const map = {
    'auth/unauthorized-domain': `Google sign-in is not allowed from ${host}. Add it under Firebase → Authentication → Settings → Authorised domains.`,
    'auth/configuration-not-found': 'Google sign-in is not enabled for this Firebase project. Enable it under Authentication → Sign-in method.',
    'auth/invalid-api-key': 'The Firebase web API key is not valid. Recheck the config you pasted.',
    'auth/network-request-failed': 'Could not reach Firebase. Check your internet connection and try again.',
    'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before it finished.',
    'auth/cancelled-popup-request': 'Google sign-in was interrupted. Try again.',
    'auth/operation-not-supported-in-this-environment': 'Google blocks sign-in in this embedded browser. Open Sprite Hollow in Chrome or Safari.',
    'auth/web-storage-unsupported': 'This browser blocks the storage Cloud Sync needs. Leave private mode or allow site storage.',
    'auth/quota-exceeded': 'Firebase sign-in quota reached. Try again later.'
  };
  return map[code] || (err && err.message) || 'Cloud sign-in failed.';
}

async function ensureCloudSdk() {
  if (typeof firebase !== 'undefined' && firebase.auth && firebase.firestore && firebase.apps.length) return;
  const cfg = cloudConfig();
  if (!cfg) {
    throw new Error('Cloud Sync is not set up yet. Open Cloud setup and paste your Firebase web config.');
  }
  await cloudLoadScript(CLOUD_SDK_BASE + 'firebase-app-compat.js');
  await cloudLoadScript(CLOUD_SDK_BASE + 'firebase-auth-compat.js');
  await cloudLoadScript(CLOUD_SDK_BASE + 'firebase-firestore-compat.js');
  if (typeof firebase === 'undefined') {
    throw new Error('The cloud sync library did not start. Check your internet connection and reload the game.');
  }
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  if (!cloudAuthHooked) {
    cloudAuthHooked = true;
    firebase.auth().onAuthStateChanged((user) => {
      cloudUser = user || null;
      cloudListeners.slice().forEach((fn) => {
        try { fn(cloudUser); } catch (err) { console.error(err); }
      });
    });
  }
  try {
    try {
      await firebase.firestore().enablePersistence({ synchronizeTabs: true });
    } catch (err) {
      /* Already enabled, or another tab owns the cache: offline writes still queue. */
    }
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  } catch (err) {
    console.warn('Cloud persistence unavailable', err);
  }
}

async function initCloudSync() {
  if (!cloudInit) {
    cloudInit = ensureCloudSdk()
      .then(async () => {
        // Completes a signInWithRedirect flow on the page reload.
        try { await firebase.auth().getRedirectResult(); }
        catch (err) { console.warn('Cloud redirect result', err); }
        return true;
      })
      .catch((err) => {
        cloudInit = null;
        throw err;
      });
  }
  return cloudInit;
}

function getCloudUser() {
  return cloudUser;
}

function onCloudAuthChange(fn) {
  cloudListeners.push(fn);
  if (cloudUser) {
    try { fn(cloudUser); } catch (err) { console.error(err); }
  }
  return () => { cloudListeners = cloudListeners.filter((listener) => listener !== fn); };
}

/* The Android shell exposes HollowAuth because Google refuses its JS popup in a
   WebView. Native sign-in returns a Google ID token, which Firebase exchanges
   for a normal session, so everything after sign-in is unchanged. */
function cloudNativeAuth() {
  try {
    if (typeof window.HollowAuth !== 'undefined' && window.HollowAuth && typeof window.HollowAuth.signIn === 'function') {
      return window.HollowAuth;
    }
  } catch (err) {
    console.warn('Native sign-in bridge unavailable', err);
  }
  return null;
}

function cloudGoogleClientId() {
  const cfg = cloudConfig() || {};
  return String(cfg.googleClientId || window.SPRITE_HOLLOW_GOOGLE_CLIENT_ID || '').trim();
}

function nativeGoogleIdToken(clientId) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, token) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { delete window.__hollowAuthResult; } catch (err) { /* ignore */ }
      if (error) reject(new Error(error));
      else if (!token) reject(new Error('Google sign-in did not return a token.'));
      else resolve(token);
    };
    const timer = setTimeout(() => finish('Google sign-in timed out. Try again.'), 180000);
    window.__hollowAuthResult = (token, error) => finish(error || '', String(token || ''));
    try {
      window.HollowAuth.signIn(clientId);
    } catch (err) {
      finish('Could not start Google sign-in on this device.');
    }
  });
}

async function signInCloudUser() {
  await initCloudSync();
  if (cloudNativeAuth()) {
    const clientId = cloudGoogleClientId();
    if (!clientId) {
      throw new Error('Add the Web client ID from Firebase → Authentication → Google → Web SDK configuration to your cloud config, then try again.');
    }
    const idToken = await nativeGoogleIdToken(clientId);
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const result = await firebase.auth().signInWithCredential(credential);
      cloudUser = (result && result.user) || firebase.auth().currentUser;
      return cloudUser;
    } catch (err) {
      console.error('Cloud sign-in with the Google token failed', err);
      throw new Error(cloudFriendlyError(err));
    }
  }
  if (cloudEmbeddedBrowser()) {
    throw new Error('Google blocks sign-in inside embedded app browsers. Open Sprite Hollow in Chrome or Safari — or move your Hollow with a save code.');
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    cloudUser = (result && result.user) || firebase.auth().currentUser;
    return cloudUser;
  } catch (err) {
    const code = (err && err.code) || '';
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      await firebase.auth().signInWithRedirect(provider);
      return null;
    }
    console.error('Cloud sign-in failed', err);
    throw new Error(cloudFriendlyError(err));
  }
}

async function signOutCloudUser() {
  try {
    await initCloudSync();
    await firebase.auth().signOut();
    cloudUser = null;
    return true;
  } catch (err) {
    console.error('Cloud sign-out failed', err);
    return false;
  }
}

async function uploadSaveToCloud(saveData) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  await initCloudSync();
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('Please sign in with Google first to sync to cloud.');
  cloudUser = user;
  /* Cloud copies must remain portable, so carry the image rather than this
     device's short content reference. */
  const portable = typeof TitleImageStore !== 'undefined' && typeof TitleImageStore.exportSave === 'function'
    ? await TitleImageStore.exportSave(saveData)
    : saveData;
  await firebase.firestore().collection('hollow_saves').doc(user.uid).set({
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    saveData: JSON.stringify(portable),
    email: user.email || '',
    name: user.displayName || '',
    version: typeof APP_VERSION === 'string' ? APP_VERSION : '',
    updatedAtLocal: new Date(Number(state && state.savedAt) || Date.now()).toISOString()
  }, { merge: true });
  return true;
}

async function downloadSaveFromCloud() {
  await initCloudSync();
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('Please sign in with Google first to restore from cloud.');
  const doc = await firebase.firestore().collection('hollow_saves').doc(user.uid).get();
  if (!doc.exists) throw new Error('No cloud save found for this account yet — press Sync to Cloud first.');
  const data = doc.data() || {};
  if (!data.saveData) throw new Error('That cloud save is empty.');
  return JSON.parse(data.saveData);
}

/* ---------- offline-first automatic backup ----------
   Every local save marks the Hollow dirty and a debounced upload follows. A
   failed upload (offline, tab hidden, flaky network) stays pending and is
   retried when connectivity, visibility, or sign-in returns. Firestore's own
   persistence keeps the write queued even if the tab closes first. */
const CLOUD_AUTO_KEY = 'sprite-hollow.cloud-auto.v1';
const CLOUD_PENDING_KEY = 'sprite-hollow.cloud-pending.v1';
let cloudBackupTimer = 0;
let cloudSyncing = false;

function cloudAutoEnabled() {
  try { return localStorage.getItem(CLOUD_AUTO_KEY) !== 'off'; } catch (err) { return true; }
}

function setCloudAuto(on) {
  try { localStorage.setItem(CLOUD_AUTO_KEY, on ? 'on' : 'off'); } catch (err) { console.warn(err); }
}

function cloudHasPending() {
  try { return localStorage.getItem(CLOUD_PENDING_KEY) === '1'; } catch (err) { return false; }
}

function setCloudPending(on) {
  try {
    if (on) localStorage.setItem(CLOUD_PENDING_KEY, '1');
    else localStorage.removeItem(CLOUD_PENDING_KEY);
  } catch (err) { console.warn(err); }
  document.dispatchEvent(new CustomEvent('cloud-pending-changed'));
}

function scheduleCloudBackup() {
  if (typeof savesLocked === 'function' && savesLocked()) return;
  if (!cloudAutoEnabled() || !cloudConfigured() || !getCloudUser()) return;
  setCloudPending(true);
  clearTimeout(cloudBackupTimer);
  cloudBackupTimer = setTimeout(() => { flushCloudBackup(); }, 2500);
}

async function flushCloudBackup(force = false) {
  if (typeof savesLocked === 'function' && savesLocked()) return false;
  if (cloudSyncing) return false;
  if (!cloudConfigured() || !getCloudUser()) return false;
  if (!force && typeof navigator !== 'undefined' && navigator.onLine === false) {
    setCloudPending(true);
    return false;
  }
  cloudSyncing = true;
  try {
    await uploadSaveToCloud(state);
    setCloudPending(false);
    document.dispatchEvent(new CustomEvent('cloud-synced', { detail: { at: Date.now() } }));
    return true;
  } catch (err) {
    console.warn('Cloud backup failed — queued for the next connection', err);
    setCloudPending(true);
    return false;
  } finally {
    cloudSyncing = false;
  }
}

/* When the chooser is present, divergent saves are shown before either side is
   replaced. Without it, newest still wins and the losing copy becomes a normal
   restore point so Hollow Health can show it inside the same recovery budget. */
function writeCloudRestoreSafetyCopy() {
  const current = typeof saveStorageString === 'function' ? saveStorageString(state) : JSON.stringify(state);
  const made = typeof SaveIntegrity !== 'undefined'
    && SaveIntegrity.createRestorePoint(current, 'before cloud restore');
  if (made) return true;
  const message = 'the local safety copy could not be written';
  console.warn('Cloud restore stopped: local safety copy failed');
  if (typeof setSaveBlocked === 'function') setSaveBlocked('cloud-restore-blocked', message);
  else if (typeof SaveIntegrity !== 'undefined') {
    SaveIntegrity.setLastLoad({ status: 'cloud-restore-blocked', message });
    if (typeof refreshSaveBlockedNotice === 'function') refreshSaveBlockedNotice();
  }
  return false;
}

async function cloudSyncNow() {
  if (typeof savesLocked === 'function' && savesLocked()) return { action: 'locked' };
  await initCloudSync();
  const user = getCloudUser() || (typeof firebase !== 'undefined' ? firebase.auth().currentUser : null);
  if (!user) return { action: 'signed-out' };
  const local = Number(state && state.savedAt) || 0;
  const doc = await firebase.firestore().collection('hollow_saves').doc(user.uid).get();
  if (!doc.exists) {
    const ok = await flushCloudBackup(true);
    return { action: ok ? 'uploaded' : 'failed' };
  }
  const data = doc.data() || {};
  const remoteStamp = Date.parse(data.updatedAtLocal || '') || 0;
  if (data.saveData && typeof openSaveConflictChooser === 'function' && typeof SaveCompare !== 'undefined') {
    let parsed = null;
    try { parsed = JSON.parse(data.saveData); } catch (err) { parsed = null; }
    if (parsed && typeof parsed === 'object') {
      const comparison = SaveCompare.compare(state, parsed);
      const divergent = comparison.sprites.onlyLeft.length || comparison.sprites.onlyRight.length
        || comparison.sprites.betterLeft || comparison.sprites.betterRight
        || comparison.coins.delta !== 0
        || comparison.unlocks.groups.some((group) => group.onlyLeft.length || group.onlyRight.length);
      if (divergent) {
        const applied = await openSaveConflictChooser(parsed, { source: 'cloud save' });
        if (applied) {
          if (typeof clearSaveBlocked === 'function') clearSaveBlocked('cloud-restore-blocked');
          setCloudPending(false);
          return { action: 'restored', remoteStamp };
        }
        return { action: 'kept-local', remoteStamp };
      }
    }
  }
  if (remoteStamp > local + 1500 && data.saveData) {
    /* Restoring replaces the live save. Do not touch it unless the losing
       local copy is safely on disk first. */
    if (!writeCloudRestoreSafetyCopy()) return { action: 'safety-copy-failed' };
    const parsed = JSON.parse(data.saveData);
    const applied = typeof applySaveCode === 'function' ? await applySaveCode(parsed) : false;
    if (applied) {
      if (typeof clearSaveBlocked === 'function') clearSaveBlocked('cloud-restore-blocked');
      setCloudPending(false);
      return { action: 'restored', remoteStamp };
    }
    return { action: 'conflict' };
  }
  if (local > remoteStamp + 1500 || !data.saveData) {
    const ok = await flushCloudBackup(true);
    return { action: ok ? 'uploaded' : 'failed' };
  }
  setCloudPending(false);
  return { action: 'in-sync' };
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { if (cloudHasPending()) flushCloudBackup(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && cloudHasPending()) flushCloudBackup();
  });
  onCloudAuthChange((user) => { if (user && cloudHasPending()) flushCloudBackup(); });
}
