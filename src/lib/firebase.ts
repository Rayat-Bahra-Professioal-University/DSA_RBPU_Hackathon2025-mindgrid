import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0gwwplo1kyAmak8vH8_qmFbe5WVknKm8",
  authDomain: "pothole-watch.firebaseapp.com",
  projectId: "pothole-watch",
  storageBucket: "pothole-watch.appspot.com",
  messagingSenderId: "3775813143",
  appId: "1:3775813143:web:dc1b9d043ec7a42a936e52",
};

// Initialize Firebase with a named app to avoid HMR duplicate/stale configs
const APP_NAME = "pothole-watch-app";
const existingApp = getApps().find((a) => a.name === APP_NAME);
const app = existingApp ?? initializeApp(firebaseConfig, APP_NAME);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
