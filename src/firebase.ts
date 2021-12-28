import { initializeApp } from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Sign in anonymously
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    return signInAnonymously(auth).catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));
