import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'recipe-theme-preference';

export const useThemeStore = create((set, get) => ({
  isDarkMode: false,

  loadTheme: async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (storedTheme !== null) {
        set({ isDarkMode: JSON.parse(storedTheme) });
      }
    } catch (e) {
      console.error('Erreur chargement theme', e);
    }
  },

  toggleTheme: async () => {
    const newTheme = !get().isDarkMode;
    set({ isDarkMode: newTheme });
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newTheme));
    } catch (e) {
      console.error('Erreur sauvegarde theme', e);
    }
  }
}));
