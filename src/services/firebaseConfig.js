import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration Firebase récupérée depuis la console
const firebaseConfig = {
  apiKey: "AIzaSyBE3zPlW6aEwcbKsAPOWla_hCzTq394PeQ",
  authDomain: "recipeapp-19a28.firebaseapp.com",
  projectId: "recipeapp-19a28",
  storageBucket: "recipeapp-19a28.firebasestorage.app",
  messagingSenderId: "804395318097",
  appId: "1:804395318097:web:26e666891bc7f71f843170"
};

// Initialiser l'application Firebase (évite de l'initialiser deux fois)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialiser l'authentification avec la persistance locale (AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialiser Firestore (Base de données)
const db = getFirestore(app);

export { app, auth, db };
