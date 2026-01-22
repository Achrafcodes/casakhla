import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isAdmin: boolean;
  createdAt: string;
}

// Check if email contains "admin"
const isAdminEmail = (email: string): boolean => {
  return email.toLowerCase().includes('admin');
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    if (firstName || lastName) {
      await updateProfile(user, {
        displayName: `${firstName || ''} ${lastName || ''}`.trim()
      });
    }

    // Create user document in Firestore
    const userData: UserData = {
      email: user.email!,
      firstName,
      lastName,
      phoneNumber,
      isAdmin: isAdminEmail(user.email!),
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return { user, userData };
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    let userData: UserData;
    if (userDoc.exists()) {
      userData = userDoc.data() as UserData;
    } else {
      // Create user document if it doesn't exist (for existing auth users)
      userData = {
        email: user.email!,
        isAdmin: isAdminEmail(user.email!),
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }

    return { user, userData };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: UserData;
    if (userDoc.exists()) {
      userData = userDoc.data() as UserData;
    } else {
      // Create new user document
      const nameParts = user.displayName?.split(' ') || [];
      userData = {
        email: user.email!,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        isAdmin: isAdminEmail(user.email!),
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userData);
    }

    return { user, userData };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Get current user data
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};