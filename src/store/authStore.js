import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { useRecipeStore } from './recipeStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null, // Holds the firestore document with role
  isLoading: true, // true by default while waiting for initial auth state
  error: null,

  // Initialize the auth listener
  initAuthListener: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile (role, name) from Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        let profile = { role: 'user' }; // default fallback
        if (docSnap.exists()) {
          profile = docSnap.data();
        }
        
        set({ user, userProfile: profile, isLoading: false, error: null });

        // Fetch user data (favorites, etc) from Firestore and sync locally
        await useRecipeStore.getState().syncFromCloud(user.uid);
      } else {
        // Clear local sensitive data if user signs out
        set({ user: null, userProfile: null, isLoading: false, error: null });
        useRecipeStore.getState().clearData();
      }
    });
  },

  // Login
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Auto-assign role for demo purposes based on email
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('chef')) {
        const { doc, setDoc } = await import('firebase/firestore');
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'chef';
        await setDoc(doc(db, "users", cred.user.uid), { role }, { merge: true });
      }
      
      // The onAuthStateChanged listener will automatically update the user state
    } catch (error) {
      console.error("Sign in error:", error);
      let errorMessage = "Erreur de connexion";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Format d'email invalide";
      }
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Register
  signUp: async (email, password, name = '') => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Auto-assign role for demo purposes
      const role = email.toLowerCase().includes('admin') ? 'admin' : (email.toLowerCase().includes('chef') ? 'chef' : 'user');

      // Create user document in Firestore with role
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name || user.email.split('@')[0],
        role: role, // Role is assigned based on email

        createdAt: new Date().toISOString()
      }, { merge: true });

      // The onAuthStateChanged listener will automatically update the user state
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMessage = "Erreur d'inscription";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Cet email est déjà utilisé";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Le mot de passe doit faire au moins 6 caractères";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Format d'email invalide";
      }
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Logout
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      set({ error: "Erreur lors de la déconnexion", isLoading: false });
    }
  },

  // Clear errors
  clearError: () => set({ error: null })
}));
