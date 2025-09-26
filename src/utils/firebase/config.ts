// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase project configuration
// Follow the setup guide in FIREBASE_SETUP.md
const firebaseConfig = {
  apiKey: "AIzaSyAtXaG2s7SU6qAo1rAfyfJPYEVhsKRHTNw",
  authDomain: "tarzancarriescc.firebaseapp.com",
  projectId: "tarzancarriescc",
  storageBucket: "tarzancarriescc.firebasestorage.app",
  messagingSenderId: "355757760068",
  appId: "1:355757760068:web:c935a38ebeeccf94d26611"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Auth Domain:', firebaseConfig.authDomain);
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.error('Please check your Firebase configuration and ensure:');
  console.error('1. The project exists in Firebase Console');
  console.error('2. Authentication is enabled');
  console.error('3. The configuration keys are correct');
  throw error;
}

export { auth, db, storage };
export default app;
