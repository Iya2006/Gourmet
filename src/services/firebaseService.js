import { collection, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { mockRecipes } from '../data/mockRecipes';

// Vérifie si l'utilisateur a configuré Firebase
const isFirebaseConfigured = () => {
  return db && db.app.options.apiKey !== "VOTRE_API_KEY" && db.app.options.apiKey;
};

/**
 * Récupère toutes les recettes depuis Firestore.
 * Si Firebase n'est pas configuré, renvoie les fausses données (mockRecipes).
 */
export const fetchRecipesFromFirebase = async () => {
  if (!isFirebaseConfigured()) {
    console.log("Firebase n'est pas configuré. Utilisation des données locales (mock).");
    return mockRecipes;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    
    // Si la base est vide sur Firebase, on peut proposer de la remplir (seed)
    if (recipes.length === 0) {
      console.log("Firestore est vide. Lancez seedFirebaseDatabase() pour la remplir.");
      return mockRecipes; // Fallback pour ne pas avoir un écran vide
    }
    
    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes: ", error);
    return mockRecipes;
  }
};

/**
 * Met à jour le compteur de likes d'une recette dans Firestore.
 */
export const updateRecipeLikes = async (recipeId, incrementValue) => {
  if (!isFirebaseConfigured()) return; // Ignorer si Firebase n'est pas configuré

  try {
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, {
      likes: increment(incrementValue)
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des likes: ", error);
  }
};

/**
 * Utilitaire pour remplir la base de données Firebase avec toutes les données locales (mockRecipes).
 * À exécuter une seule fois par l'admin.
 */
export const seedFirebaseDatabase = async () => {
  if (!isFirebaseConfigured()) {
    alert("Veuillez d'abord configurer vos clés Firebase dans firebaseConfig.js");
    return;
  }

  try {
    console.log("Début de l'importation vers Firebase...");
    for (const recipe of mockRecipes) {
      const recipeRef = doc(db, "recipes", recipe.id);
      await setDoc(recipeRef, recipe);
    }
    console.log("Importation terminée avec succès !");
    alert("Base de données Firebase remplie avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding de la BDD: ", error);
    alert("Erreur: " + error.message);
  }
};
