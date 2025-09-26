// Script to create an admin user
// Run this with: node create-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtXaG2s7SU6qAo1rAfyfJPYEVhsKRHTNw",
  authDomain: "tarzancarriescc.firebaseapp.com",
  projectId: "tarzancarriescc",
  storageBucket: "tarzancarriescc.firebasestorage.app",
  messagingSenderId: "355757760068",
  appId: "1:355757760068:web:c935a38ebeeccf94d26611"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create user with email and password
    const { user } = await createUserWithEmailAndPassword(
      auth,
      'admin@artificialinsemination.com',
      'AdminPass123!'
    );

    // Update user profile
    await updateProfile(user, {
      displayName: 'Admin User'
    });

    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      firstName: 'Admin',
      lastName: 'User',
      organization: 'Artificial Insemination Academy',
      role: 'admin',
      created_at: new Date().toISOString()
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@artificialinsemination.com');
    console.log('Password: AdminPass123!');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();
