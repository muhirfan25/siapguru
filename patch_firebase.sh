cat << 'INNER_EOF' > firebase_update.ts
// Determine which config to use (Vercel ENV vars or AI Studio Local fallback)
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// If VITE_FIREBASE_API_KEY exists in Env, use it. Otherwise, use local config.
const isUsingEnv = Boolean(envConfig.apiKey);
const firebaseConfig = isUsingEnv ? envConfig : firebaseConfigData;

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use default database for Env (Vercel) or specific ID for AI Studio
const dbId = isUsingEnv ? "(default)" : (firebaseConfigData.firestoreDatabaseId || "(default)");
export const firestore = getFirestore(app, dbId);
INNER_EOF

# Replace lines 26 to 33 with the new config block
sed -i -e '26,33c\' -e "$(cat firebase_update.ts | sed 's/$/\\/')" src/lib/firebase.ts
# Remove trailing backslash added by the last sed trick
sed -i 's/\\$//' src/lib/firebase.ts
