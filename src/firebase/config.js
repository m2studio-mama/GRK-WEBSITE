import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if valid Firebase configuration is provided
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId;

let app;
let auth;
let db;
let storage;
let mockMode = true;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    if (firebaseConfig.measurementId) {
      getAnalytics(app);
    }
    mockMode = false;
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization failed, falling back to Mock Mode.', error);
    mockMode = true;
  }
} else {
  console.log('Firebase environment variables missing. Running in Mock Mode with LocalStorage fallback.');
  mockMode = true;
}

export { app, auth, db, storage, mockMode };
export default firebaseConfig;
