import { useRecipeStore } from '../store/recipeStore';

/**
 * Service IA Simulé - Recommandation Intelligente
 * Dans une vraie application, cela appellerait une API de Machine Learning (TensorFlow, OpenAI, etc.)
 */
export const getAIRecommendation = (recipes) => {
  if (!recipes || recipes.length === 0) return null;

  const store = useRecipeStore.getState();
  const favorites = store.favorites;
  const ratings = store.ratings;

  // Si l'utilisateur n'a pas de favoris ou de notes, on recommande le plat le mieux noté globalement 
  // (ou un plat aléatoire pour la démo)
  if (favorites.length === 0 && Object.keys(ratings).length === 0) {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    return {
      recipe: randomRecipe,
      message: `Découvrez notre plat du jour : ${randomRecipe.title} !`
    };
  }

  // Extraire les catégories préférées
  const preferredCategories = {};
  
  favorites.forEach(fav => {
    preferredCategories[fav.category] = (preferredCategories[fav.category] || 0) + 2; // Favoris = +2 points
  });

  Object.entries(ratings).forEach(([recipeId, rating]) => {
    if (rating >= 4) {
      const ratedRecipe = recipes.find(r => r.id === recipeId);
      if (ratedRecipe) {
        preferredCategories[ratedRecipe.category] = (preferredCategories[ratedRecipe.category] || 0) + 1; // Bonne note = +1 point
      }
    }
  });

  // Trouver la catégorie avec le plus de points
  let topCategory = null;
  let maxScore = 0;
  
  Object.entries(preferredCategories).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topCategory = category;
    }
  });

  if (!topCategory) {
    return null;
  }

  // Trouver une recette de cette catégorie qui n'est ni dans les favoris ni déjà notée
  const recommendations = recipes.filter(r => 
    r.category === topCategory && 
    !favorites.some(f => f.id === r.id) &&
    !ratings[r.id]
  );

  if (recommendations.length > 0) {
    const rec = recommendations[Math.floor(Math.random() * recommendations.length)];
    return {
      recipe: rec,
      message: `Vous aimez les plats de type ${topCategory} ? Essayez le ${rec.title} !`
    };
  }

  return null;
};
