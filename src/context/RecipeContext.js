/**
 * RecipeContext.js
 * 
 * Context API pour partager les recettes, favoris et filtres
 * entre tous les écrans de l'application.
 * 
 * Concepts démontrés (CDC §5.2) :
 * - createContext
 * - useContext
 * - Provider pattern
 * - État global partagé
 */

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { fetchAllRecipes } from '../services/recipeService';
import { useAuthStore } from '../store/authStore';

// 1. Créer le contexte
export const RecipeContext = createContext(null);

// 2. Hook personnalisé pour utiliser le contexte
export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext doit être utilisé à l\'intérieur de RecipeProvider');
  }
  return context;
}

// 3. Provider — enveloppe l'application et fournit les données
export function RecipeProvider({ children }) {
  // ── État local (CDC §5.1 useState) ──────────────────────────────
  const [recipes, setRecipes]                 = useState([]);
  const [search, setSearch]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Tous');
  const [selectedDuration, setSelectedDuration]     = useState('Tous'); // 'Tous' | '<15' | '<30' | '<60' | '60+'

  const preferences = useAuthStore(state => state.preferences);

  // ── Catégories disponibles (CDC §3 — inclus Africain, Healthy) ──
  const CATEGORIES = ['Tous', 'Africain', 'Healthy', 'Dessert', 'Végétarien', 'Rapide', 'Soupe', 'Pâtes'];
  const DIFFICULTIES = ['Tous', 'Facile', 'Moyen', 'Difficile'];
  const DURATIONS = ['Tous', '<15 min', '<30 min', '<60 min', '60+ min'];

  useEffect(() => {
    fetchAllRecipes().then((fetched) => {
      setRecipes(fetched);
    });
  }, []);

  // ── Recherche et filtrage dynamique (CDC §3 + §11) ──────────────
  // Normalise les accents pour comparer correctement (e.g. é = e)
  const normalize = (str) =>
    str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // Filtre par recherche intelligente (CDC §3)
    // Si l'utilisateur tape une recherche, on ignore les autres filtres pour chercher partout
    if (search.trim()) {
      const q = normalize(search.trim());
      const qLen = q.length;

      return recipes.filter(r => {
        const titleNorm = normalize(r.title);
        const catNorm = normalize(r.category);

        // Toujours chercher dans le titre
        if (titleNorm.includes(q)) return true;

        // Chercher dans les tags seulement si query >= 2 chars
        if (qLen >= 2 && r.tags?.some(t => normalize(t).includes(q))) return true;

        // Chercher dans la catégorie seulement si query >= 2 chars
        if (qLen >= 2 && catNorm.includes(q)) return true;

        // Chercher dans les ingrédients seulement si query >= 3 chars
        if (qLen >= 3 && r.ingredients?.some(i => normalize(i.name).includes(q))) return true;

        return false;
      });
    }

    // Filtre par catégorie (CDC §3)
    if (selectedCategory !== 'Tous') {
      result = result.filter(r =>
        r.category === selectedCategory ||
        r.tags?.some(t => t === selectedCategory)
      );
    }

    // Filtre par difficulté (CDC §3)
    if (selectedDifficulty !== 'Tous') {
      result = result.filter(r => r.difficulty === selectedDifficulty);
    }

    // Filtre par durée (CDC §3)
    if (selectedDuration !== 'Tous') {
      result = result.filter(r => {
        const prep = r.duration || r.times?.prep || 0;
        const bake = r.times?.bake || 0;
        const total = prep + bake;
        if (selectedDuration === '<15 min')  return total < 15;
        if (selectedDuration === '<30 min')  return total < 30;
        if (selectedDuration === '<60 min')  return total < 60;
        if (selectedDuration === '60+ min') return total >= 60;
        return true;
      });
    }

    // Filtre global par régimes (Profil de l'utilisateur)
    if (preferences?.diets && preferences.diets.length > 0) {
      result = result.filter(r => {
        if (!r.tags) return false;
        // La recette doit inclure au moins l'un des régimes sélectionnés, ou tous ?
        // Souvent, si on sélectionne "Vegan" et "Sans gluten", on veut voir les recettes qui sont soit vegan soit sans gluten.
        // Ou bien on veut les recettes qui sont à la fois vegan ET sans gluten.
        // Faisons une intersection stricte (ET) : une recette doit respecter TOUS les régimes cochés.
        return preferences.diets.every(diet => 
          r.tags.map(normalize).includes(normalize(diet))
        );
      });
    }

    // Filtre global par cuisines (Profil de l'utilisateur)
    if (preferences?.cuisines && preferences.cuisines.length > 0) {
      result = result.filter(r => {
        // La recette doit appartenir à l'une des cuisines sélectionnées (OU)
        return preferences.cuisines.some(cuisine => {
          const c = normalize(cuisine);
          return normalize(r.category) === c || (r.tags && r.tags.map(normalize).includes(c));
        });
      });
    }

    return result;
  }, [recipes, search, selectedCategory, selectedDifficulty, selectedDuration, preferences]);

  // ── Actions ──────────────────────────────────────────────────────
  const resetFilters = useCallback(() => {
    setSearch('');
    setSelectedCategory('Tous');
    setSelectedDifficulty('Tous');
    setSelectedDuration('Tous');
  }, []);

  // ── Valeur exposée au contexte ───────────────────────────────────
  const value = {
    // Données
    recipes,
    filteredRecipes,

    // Recherche
    search,
    setSearch,

    // Filtres
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedDuration,
    setSelectedDuration,

    // Options de filtres
    CATEGORIES,
    DIFFICULTIES,
    DURATIONS,

    // Actions
    resetFilters,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}
