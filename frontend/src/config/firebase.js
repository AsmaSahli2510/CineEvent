import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const getEnvOrFallback = (envValue, fallbackValue) =>
  envValue && String(envValue).trim() ? envValue : fallbackValue;

const firebaseConfig = {
  apiKey: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_API_KEY,
    "AIzaSyBjvb4nQAe8xKqdBHf8asQrX55dienhTpg",
  ),
  authDomain: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    "cineevent-1a246.firebaseapp.com",
  ),
  projectId: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    "cineevent-1a246",
  ),
  storageBucket: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    "cineevent-1a246.firebasestorage.app",
  ),
  messagingSenderId: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    "20576254243",
  ),
  appId: getEnvOrFallback(
    import.meta.env.VITE_FIREBASE_APP_ID,
    "1:20576254243:web:8f82a576490760c4e0b496",
  ),
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
