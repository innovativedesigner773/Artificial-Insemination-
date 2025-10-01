import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { User, SignUpData, SignInData } from '../../types';

// Convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    role: userData?.role || 'student',
    organization: userData?.organization,
    selectedPlan: userData?.selectedPlan,
    created_at: userData?.created_at,
    accessExpiresAt: userData?.accessExpiresAt,
    accessDuration: userData?.accessDuration
  };
};

// Auth helper functions
export const authHelpers = {
  async signUp(data: SignUpData) {
    try {
      // Create user with Firebase Auth
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: `${data.firstName} ${data.lastName}`
      });

      // Determine role based on selected plan
      // If a plan is selected, user is a paying customer and should be 'instructor'
      // Otherwise, default to 'student' or use provided role
      let userRole: 'student' | 'instructor' | 'admin' = 'student';
      if (data.selectedPlan) {
        userRole = 'instructor'; // Paying customers get instructor access
      } else if (data.role) {
        userRole = data.role; // Use explicitly provided role
      }

      // Create user document in Firestore
      const userData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        role: userRole,
        selectedPlan: data.selectedPlan,
        created_at: new Date().toISOString()
      };

      // Add access duration fields if provided
      if (data.accessExpiresAt) {
        userData.accessExpiresAt = data.accessExpiresAt;
      }
      if (data.accessDuration !== undefined) {
        userData.accessDuration = data.accessDuration;
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Convert to our User type
      const user = await convertFirebaseUser(firebaseUser);

      // If this is batch creation (has accessExpiresAt), sign out the new user immediately
      // This prevents auto-login during batch user creation
      if (data.accessExpiresAt) {
        await signOut(auth);
        // Note: The admin stays signed in because Firebase manages sessions
      }
      
      return { data: { user }, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async signIn(data: SignInData) {
    try {
      console.log('Attempting to sign in with:', data.email);
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      console.log('Firebase user signed in:', firebaseUser.uid);
      const user = await convertFirebaseUser(firebaseUser);
      return { data: { user }, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return { user: null, error: null };
      }
      
      const user = await convertFirebaseUser(firebaseUser);
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async getSession() {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return { session: null, error: null };
      }
      
      const user = await convertFirebaseUser(firebaseUser);
      return { session: { user }, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await convertFirebaseUser(firebaseUser);
          callback(user);
        } catch (error) {
          console.error('Error converting user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};

// Types for authentication
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    organization?: string;
  };
}
