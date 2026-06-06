import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { RecipeProvider } from './src/context/RecipeContext';
import './src/i18n'; // Initialiser i18n

export default function App() {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.appContainer}>
        <SafeAreaProvider>
          {/* RecipeProvider — Context API (CDC §5.2) */}
          <RecipeProvider>
            <AppNavigator />
          </RecipeProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 450 : '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 30px rgba(0,0,0,0.1)',
        height: '100vh',
      },
      default: {},
    }),
  }
});
