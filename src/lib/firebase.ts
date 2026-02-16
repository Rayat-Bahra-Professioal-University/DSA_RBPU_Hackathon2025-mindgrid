import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAK4tn44JKDBQTrvVZbSyyJGDcWa0e0hGU",
  authDomain: "city-care-mind-grid.firebaseapp.com",
  projectId: "city-care-mind-grid",
  storageBucket: "city-care-mind-grid.firebasestorage.app",
  messagingSenderId: "751500345687",
  appId: "1:751500345687:web:fae20c693dd80308a0fe12",
  measurementId: "G-MGRT3TTF8N"
};

// Initialize Firebase - reuse existing app during HMR
let app;
try {
  app = getApp(); // Try to get existing default app
} catch {
  app = initializeApp(firebaseConfig); // Initialize if doesn't exist
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
