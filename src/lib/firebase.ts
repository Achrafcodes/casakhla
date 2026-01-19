import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDENEG_YSA4b8Z-_atsiTNkHcchUhrPbfg",
  authDomain: "casak7la.firebaseapp.com",
  projectId: "casak7la",
  storageBucket: "casak7la.firebasestorage.app",
  messagingSenderId: "592031155248",
  appId: "1:592031155248:web:e8968baef484cb846699f5",
  measurementId: "G-ZH9QW4JPMT"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
