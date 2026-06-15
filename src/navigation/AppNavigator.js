import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import * as Notifications from 'expo-notifications';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CookingModeScreen from '../screens/CookingModeScreen';
import AdminDashboard from '../screens/AdminDashboard';
import ChefDashboard from '../screens/ChefDashboard';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import CookbookRecipesScreen from '../screens/CookbookRecipesScreen';
import SearchActiveScreen from '../screens/SearchActiveScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import SearchByIngredientsScreen from '../screens/SearchByIngredientsScreen';
import ChefProfileScreen from '../screens/ChefProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef();

function TabNavigator() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: Platform.OS === 'web' ? 75 : 60,
          paddingBottom: Platform.OS === 'web' ? 15 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'web' ? 10 : 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'FavoritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ShoppingListTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} options={{ tabBarLabel: 'Favorites' }} />
      <Tab.Screen name="ShoppingListTab" component={ShoppingListScreen} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, userProfile, isLoading, initAuthListener } = useAuthStore();
  const { colors } = useAppTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [lastNotificationResponse, setLastNotificationResponse] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        setLastNotificationResponse(response);
      }
    }).catch(() => {});

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      setLastNotificationResponse(response);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.recipeId &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const recipeTitle = lastNotificationResponse.notification.request.content.data.recipeId;
      // Navigate when navigation container is ready
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('Details', { recipeTitle });
        }
      }, 100); // Small delay to ensure auth state and navigators are mounted
    }
  }, [lastNotificationResponse]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Determine initial route based on role
  let initialRoute = user ? 'MainTabs' : 'Login';
  if (user && userProfile?.role === 'admin') {
    initialRoute = 'AdminDashboard';
  } else if (user && userProfile?.role === 'chef') {
    initialRoute = 'ChefDashboard';
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {user ? (
          // User is signed in
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen} 
              options={{ headerShown: false, presentation: 'card' }}
            />
            <Stack.Screen 
              name="CookingMode" 
              component={CookingModeScreen} 
              options={{ presentation: 'fullScreenModal', headerShown: false }}
            />
            <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CookbookRecipes" component={CookbookRecipesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchActive" component={SearchActiveScreen} options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="CategoryList" component={CategoryListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchByIngredients" component={SearchByIngredientsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="ChefDashboard" component={ChefDashboard} />
            <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
            <Stack.Screen name="ChefProfile" component={ChefProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
          </>

        ) : (
          // User is NOT signed in
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
