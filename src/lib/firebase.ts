import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0gwwplo1kyAmak8vH8_qmFbe5WVknKm8",
  authDomain: "pothole-watch.firebaseapp.com",
  projectId: "pothole-watch",
  storageBucket: "pothole-watch.firebasestorage.app",
  messagingSenderId: "3775813143",
  appId: "1:3775813143:web:dc1b9d043ec7a42a936e52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
