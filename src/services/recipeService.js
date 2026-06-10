import { doc, updateDoc, increment, collection, getDocs, query, where, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Increment views counter for a recipe in Firestore.
 * Only works for recipes stored in Firestore (has a firestoreId).
 */
export const incrementRecipeViews = async (recipeId) => {
  if (!recipeId) return;
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('__name__', '==', recipeId));
    // Try direct update
    await updateDoc(doc(db, 'recipes', recipeId), {
      views: increment(1)
    });
  } catch (e) {
    // Silently fail for mock recipes that don't exist in Firestore
    // console.log('incrementRecipeViews: recipe not in Firestore', recipeId);
  }
};

/**
 * Increment cooks counter for a recipe in Firestore.
 */
export const incrementRecipeCooks = async (recipeId) => {
  if (!recipeId) return;
  try {
    await updateDoc(doc(db, 'recipes', recipeId), {
      cooks: increment(1)
    });
  } catch (e) {
    // Silently fail for mock recipes
  }
};

/**
 * Increment likes counter for a recipe in Firestore.
 */
export const incrementRecipeLikes = async (recipeId, delta = 1) => {
  if (!recipeId) return;
  try {
    await updateDoc(doc(db, 'recipes', recipeId), {
      likes: increment(delta)
    });
  } catch (e) {
    // Silently fail for mock recipes
  }
};

/**
 * Add a review to a recipe in Firestore.
 */
export const addRecipeReview = async (recipeId, review) => {
  if (!recipeId) return;
  try {
    await updateDoc(doc(db, 'recipes', recipeId), {
      reviews: arrayUnion(review)
    });
  } catch (e) {
    console.error('addRecipeReview error', e);
  }
};

/**
 * Fetch all recipes from Firestore.
 */
export const fetchAllRecipes = async () => {
  try {
    const snap = await getDocs(collection(db, 'recipes'));
    return snap.docs.map(d => ({ id: d.id, ...d.data(), firestoreId: d.id }));
  } catch (e) {
    console.error('fetchAllRecipes error', e);
    return [];
  }
};

/**
 * Fetch all chefs (users with role 'chef') from Firestore.
 */
export const fetchAllChefs = async () => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'chef'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('fetchAllChefs error', e);
    return [];
  }
};

/**
 * Fetch top recipes sorted by likes (descending).
 */
export const fetchTopRecipes = async (count = 10) => {
  try {
    const snap = await getDocs(collection(db, 'recipes'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data(), firestoreId: d.id }));
    return all.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, count);
  } catch (e) {
    console.error('fetchTopRecipes error', e);
    return [];
  }
};
