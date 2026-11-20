/* Sprite Hollow — Cloud Sync configuration.

   Cloud Sync uses a free Firebase project (Google sign-in + Firestore).
   Firebase web API keys are public by design, so this file can ship with
   the app; your saves are protected by Firestore security rules, not by
   hiding the key.

   Two-minute setup:
   1. Create a project at https://console.firebase.google.com
   2. Authentication → Sign-in method → enable Google.
   3. Authentication → Settings → Authorised domains → add every host you
      open the game from (e.g. localhost, your GitHub Pages domain, and the
      domain you serve the APK's web build from).
   4. Project settings → Your apps → add a Web app → copy the config object
      below and paste real values over the placeholders.
   5. Firestore Database → create a database, then use these rules so each
      account can only read and write its own save:

        match /hollow_saves/{uid} {
          allow read, write: if request.auth != null && request.auth.uid == uid;
        }

   Until a config is filled in, the Save backup screen explains that Cloud
   Sync is not set up and save codes keep working as before.

   The Android app signs in natively (Google blocks its web popup inside a
   WebView), so it also needs googleClientId: the Web client ID shown under
   Authentication -> Google -> Web SDK configuration. Browsers ignore it.
*/

window.SPRITE_HOLLOW_FIREBASE = null;

/*
window.SPRITE_HOLLOW_FIREBASE = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  // Android app only: Authentication -> Google -> Web SDK configuration.
  googleClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
};
*/
