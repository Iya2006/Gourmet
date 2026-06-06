import { useThemeStore } from './store/themeStore';

const lightColors = {
  primary: '#FF6B00',
  secondary: '#145941',
  background: '#FFFFFF',
  backgroundSecondary: '#FFF5E6',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#EAEAEA',
  star: '#FF6B00',
  lightGray: '#F5F5F5',
  cardSoft: '#FDFBF7'
};

const darkColors = {
  primary: '#FF6B00',
  secondary: '#145941',
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#2C2C2C',
  star: '#FFB84D',
  lightGray: '#2A2A2A',
  cardSoft: '#181818'
};

const fonts = {
  regular: 'System',
  bold: 'System',
  serif: 'Georgia'
};

// Export static fallback for non-component files if needed
export const theme = {
  colors: lightColors,
  fonts
};

// Hook for dynamic theming inside components
export function useAppTheme() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  return {
    colors: isDarkMode ? darkColors : lightColors,
    fonts,
    isDarkMode
  };
}
