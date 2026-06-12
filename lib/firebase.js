import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Fallback check to prevent build crash
if (!firebaseConfig.apiKey) {
  console.warn("⚠️ Firebase API Key is missing. Deployment will likely fail to connect to services.");
}

const app = (!getApps().length && firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined")
  ? initializeApp(firebaseConfig)
  : (getApps().length > 0 ? getApp() : null);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

// Initialize App Check for production security
if (typeof window !== "undefined" && app) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "AIzaSy_PLACEHOLDER_KEY"),
    isTokenAutoRefreshEnabled: true,
  });
}

export default app;
