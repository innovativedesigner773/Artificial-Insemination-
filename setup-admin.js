// Setup script to create admin user
// Run this with: node setup-admin.js

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

async function setupAdminUser() {
  try {
    console.log('🚀 Initializing Firebase...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('📧 Creating admin user...');
    
    // Create user with email and password
    const { user } = await createUserWithEmailAndPassword(
      auth,
      'admin@artificialinsemination.com',
      'AdminPass123!'
    );

    console.log('👤 Updating user profile...');
    
    // Update user profile
    await updateProfile(user, {
      displayName: 'Admin User'
    });

    console.log('💾 Creating user document in Firestore...');
    
    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      firstName: 'Admin',
      lastName: 'User',
      organization: 'Artificial Insemination Academy',
      role: 'admin',
      created_at: new Date().toISOString()
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 ADMIN CREDENTIALS:');
    console.log('   Email: admin@artificialinsemination.com');
    console.log('   Password: AdminPass123!');
    console.log('   Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 You can now login with these credentials!');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Admin user already exists!');
      console.log('🔑 You can login with:');
      console.log('   Email: admin@artificialinsemination.com');
      console.log('   Password: AdminPass123!');
    } else {
      console.error('❌ Error creating admin user:', error.message);
      console.error('Full error:', error);
    }
  }
}

setupAdminUser();
