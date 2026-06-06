import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useAuthStore } from '../store/authStore';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { colors, fonts, isDarkMode } = useAppTheme();
  const { user } = useAuthStore();

  // Animation Values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence d'animation (Apparition du logo puis du texte)
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirection automatique après l'animation
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[
        styles.logoContainer, 
        { 
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          shadowColor: colors.primary,
        }
      ]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <Ionicons name="restaurant" size={50} color="#FFFFFF" />
        </View>
      </Animated.View>
      
      <Animated.Text style={[
        styles.title, 
        { color: colors.text, opacity: textOpacity }
      ]}>
        Gourmet
      </Animated.Text>
      
      <Animated.Text style={[
        styles.subtitle, 
        { color: colors.textSecondary, opacity: textOpacity }
      ]}>
        L'excellence culinaire
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  }
});
