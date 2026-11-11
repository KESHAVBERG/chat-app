import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
// };
const firebaseConfig = {
  apiKey: "AIzaSyBcBS32PxPTdX3DCFJQscojs-dmXib0I2w",
  authDomain: "webapps-224c8.firebaseapp.com",
  databaseURL: "https://webapps-224c8.firebaseio.com",
  projectId: "webapps-224c8",
  storageBucket: "webapps-224c8.appspot.com",
  messagingSenderId: "47874462184",
  appId: "1:47874462184:web:bf035c747847381c88545d",
  measurementId: "G-J0686JSSDG"
};

// Check if valid Firebase configuration has been supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
}

export { app, db, firebaseConfig };
