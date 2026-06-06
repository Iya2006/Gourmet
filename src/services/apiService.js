import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fonction pour transformer le format complexe de TheMealDB vers notre format simple
const transformMeal = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
    }
  }

  const randomDuration = [15, 20, 30, 45, 60][Math.floor(Math.random() * 5)] + ' min';
  const difficulties = ["Très Facile", "Facile", "Moyen", "Difficile"];
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

  // Convertir le lien youtube standard en lien d'intégration (embed)
  let videoId = null;
  if (meal.strYoutube && meal.strYoutube.includes('v=')) {
    videoId = meal.strYoutube.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory,
    duration: randomDuration,
    difficulty: randomDifficulty,
    image: meal.strMealThumb,
    videoUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
    ingredients: ingredients,
    instructions: meal.strInstructions ? meal.strInstructions.split('\r\n').filter(i => i.trim() !== '') : [],
  };
};

export const fetchRecipes = async (searchQuery = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${searchQuery}`);
    if (response.data.meals) {
      return response.data.meals.map(transformMeal);
    }
    return [];
  } catch (error) {
    console.error('Erreur API TheMealDB:', error);
    return [];
  }
};

// Fonction de "Scraping" pour l'admin : récupère toutes les recettes commençant par une lettre
export const scrapeRecipesByLetter = async (letter) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
    if (response.data.meals) {
      return response.data.meals.map(transformMeal);
    }
    return [];
  } catch (error) {
    console.error(`Erreur scraping TheMealDB pour ${letter}:`, error);
    return [];
  }
};
