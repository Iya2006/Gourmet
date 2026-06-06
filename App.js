import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { RecipeProvider } from './src/context/RecipeContext';
import './src/i18n'; // Initialiser i18n

export default function App() {
  return (
    <SafeAreaProvider>
      {/* RecipeProvider — Context API (CDC §5.2) */}
      <RecipeProvider>
        <AppNavigator />
      </RecipeProvider>
    </SafeAreaProvider>
  );
}
