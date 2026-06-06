import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { incrementRecipeLikes } from '../services/recipeService';

const STORAGE_KEY = 'recipe-favorites';
const RATINGS_KEY = 'recipe-ratings';
const SHOPPING_KEY = 'recipe-shopping-list';
const COOKBOOKS_KEY = 'recipe-cookbooks';

const DEFAULT_COOKBOOKS = [
  { id: 'cb_imported', title: 'Imported recipes', icon: 'globe-outline', color: '#6A1B9A', bgColor: '#FDF2F8', badge: 'New', recipeIds: [] },
  { id: 'cb_favorites', title: 'My favourite recipes', icon: 'heart', color: '#FF6B35', bgColor: '#FFF3E0', recipeIds: [] },
  { id: 'cb_test', title: 'Test', icon: null, color: '#333', bgColor: '#FFF8F0', recipeIds: [] },
];

export const useRecipeStore = create((set, get) => ({
  userId: null,
  favorites: [],
  ratings: {},
  shoppingList: [],
  cookbooks: DEFAULT_COOKBOOKS,
  
  // --- SYNC ENGINE (Firebase Firestore) ---
  syncFromCloud: async (userId) => {
    set({ userId });
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          favorites: data.favorites || [],
          ratings: data.ratings || {},
          shoppingList: data.shoppingList || [],
          cookbooks: data.cookbooks && data.cookbooks.length > 0 ? data.cookbooks : DEFAULT_COOKBOOKS
        });
        
        // Save to local storage for offline use
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.favorites || []));
        AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(data.ratings || {}));
        AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(data.shoppingList || []));
        AsyncStorage.setItem(COOKBOOKS_KEY, JSON.stringify(data.cookbooks || DEFAULT_COOKBOOKS));
      } else {
        // If document doesn't exist, upload local data to Firestore
        get().syncToCloud();
      }
    } catch (e) {
      console.error('Erreur syncFromCloud', e);
      // Fallback to local storage if network fails
      get().loadLocalData();
    }
  },

  syncToCloud: async () => {
    const { userId, favorites, ratings, shoppingList, cookbooks } = get();
    if (!userId) return; // Only sync if logged in

    try {
      await setDoc(doc(db, "users", userId), {
        favorites,
        ratings,
        shoppingList,
        cookbooks
      }, { merge: true }); // Use merge to prevent overwriting other future fields
    } catch (e) {
      console.error('Erreur syncToCloud', e);
    }
  },

  clearData: () => {
    set({
      userId: null,
      favorites: [],
      ratings: {},
      shoppingList: [],
      cookbooks: DEFAULT_COOKBOOKS
    });
  },

  loadLocalData: async () => {
    try {
      const storedFavs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFavs) set({ favorites: JSON.parse(storedFavs) });
      
      const storedRatings = await AsyncStorage.getItem(RATINGS_KEY);
      if (storedRatings) set({ ratings: JSON.parse(storedRatings) });

      const storedShopping = await AsyncStorage.getItem(SHOPPING_KEY);
      if (storedShopping) set({ shoppingList: JSON.parse(storedShopping) });

      const storedCookbooks = await AsyncStorage.getItem(COOKBOOKS_KEY);
      if (storedCookbooks) set({ cookbooks: JSON.parse(storedCookbooks) });
    } catch (e) {
      console.error('Erreur chargement données locales', e);
    }
  },

  // --- ACTIONS (with cloud sync) ---
  
  // Favorites
  loadFavorites: async () => { get().loadLocalData(); }, 
  isFavorite: (id) => get().favorites.some(recipe => recipe.id === id),
  toggleFavorite: async (recipe) => {
    const currentFavorites = get().favorites;
    const isAlreadyFavorite = currentFavorites.some(item => item.id === recipe.id);
    const newFavorites = isAlreadyFavorite 
      ? currentFavorites.filter(item => item.id !== recipe.id)
      : [...currentFavorites, recipe];
    
    set({ favorites: newFavorites });
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites)); } catch (e) {}
    get().syncToCloud();

    // Increment or decrement likes in Firestore
    if (recipe.id) {
      incrementRecipeLikes(recipe.id, isAlreadyFavorite ? -1 : 1);
    }
  },

  // Ratings
  getRating: (id) => get().ratings[id] || 0,
  setRating: async (id, rating) => {
    const newRatings = { ...get().ratings, [id]: rating };
    set({ ratings: newRatings });
    try { await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings)); } catch (e) {}
    get().syncToCloud();
  },

  // Shopping List
  isInShoppingList: (id) => get().shoppingList.some(item => item.recipe.id === id),
  addRecipeToShoppingList: async (recipe, calculatedIngredients) => {
    const currentList = [...get().shoppingList];
    const existingIndex = currentList.findIndex(item => item.recipe.id === recipe.id);
    const ingredientsToAdd = calculatedIngredients.map(ing => ({ ...ing, checked: false }));

    if (existingIndex >= 0) {
      currentList[existingIndex].ingredients = ingredientsToAdd;
    } else {
      currentList.push({
        recipe: { id: recipe.id, title: recipe.title, image: recipe.image },
        ingredients: ingredientsToAdd
      });
    }

    set({ shoppingList: currentList });
    try { await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(currentList)); } catch (e) {}
    get().syncToCloud();
  },

  removeRecipeFromShoppingList: async (recipeId) => {
    const newList = get().shoppingList.filter(item => item.recipe.id !== recipeId);
    set({ shoppingList: newList });
    try { await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(newList)); } catch (e) {}
    get().syncToCloud();
  },

  toggleIngredientCheck: async (recipeId, ingredientId) => {
    const currentList = [...get().shoppingList];
    const recipeIndex = currentList.findIndex(item => item.recipe.id === recipeId);
    if (recipeIndex >= 0) {
      const ingIndex = currentList[recipeIndex].ingredients.findIndex(ing => ing.id === ingredientId);
      if (ingIndex >= 0) {
        currentList[recipeIndex].ingredients[ingIndex].checked = !currentList[recipeIndex].ingredients[ingIndex].checked;
        set({ shoppingList: currentList });
        try { await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(currentList)); } catch (e) {}
        get().syncToCloud();
      }
    }
  },

  unmarkAllItems: async () => {
    const currentList = get().shoppingList.map(item => ({
      ...item,
      ingredients: item.ingredients.map(ing => ({ ...ing, checked: false }))
    }));
    set({ shoppingList: currentList });
    try { await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(currentList)); } catch (e) {}
    get().syncToCloud();
  },

  // Cookbooks
  createCookbook: async (title) => {
    const newCookbook = {
      id: `cb_${Date.now()}`,
      title,
      icon: null,
      color: '#333',
      bgColor: '#FFF8F0',
      recipeIds: [],
    };
    const newCookbooks = [...get().cookbooks, newCookbook];
    set({ cookbooks: newCookbooks });
    try { await AsyncStorage.setItem(COOKBOOKS_KEY, JSON.stringify(newCookbooks)); } catch (e) {}
    get().syncToCloud();
    return newCookbook;
  },

  saveRecipeToCookbooks: async (recipe, checkedCookbookIds) => {
    const currentCookbooks = get().cookbooks;
    const newCookbooks = currentCookbooks.map(cb => {
      const shouldBeIn = checkedCookbookIds.includes(cb.id);
      const isCurrentlyIn = cb.recipeIds.includes(recipe.id);
      if (shouldBeIn && !isCurrentlyIn) {
        return { ...cb, recipeIds: [...cb.recipeIds, recipe.id] };
      } else if (!shouldBeIn && isCurrentlyIn) {
        return { ...cb, recipeIds: cb.recipeIds.filter(id => id !== recipe.id) };
      }
      return cb;
    });
    set({ cookbooks: newCookbooks });
    try { await AsyncStorage.setItem(COOKBOOKS_KEY, JSON.stringify(newCookbooks)); } catch (e) {}
    get().syncToCloud();
  },

  getCookbooksForRecipe: (recipeId) => {
    return get().cookbooks.filter(cb => cb.recipeIds.includes(recipeId)).map(cb => cb.id);
  },

  getRecipesInCookbook: (cookbookId, allRecipes) => {
    const cb = get().cookbooks.find(c => c.id === cookbookId);
    if (!cb) return [];
    return allRecipes.filter(r => cb.recipeIds.includes(r.id));
  },
}));
