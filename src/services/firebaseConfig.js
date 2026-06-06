import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration Firebase via variables d'environnement (sécurisé)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialiser l'application Firebase (évite de l'initialiser deux fois)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialiser l'authentification avec la persistance locale (AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialiser Firestore (Base de données)
const db = getFirestore(app);

export { app, auth, db };
