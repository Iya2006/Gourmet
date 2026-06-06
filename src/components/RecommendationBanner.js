import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export default function RecommendationBanner({ recommendation, onPress }) {
  if (!recommendation) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="sparkles" size={16} color="#D4AF37" />
          <Text style={styles.title}>Recommandation IA</Text>
        </View>
        <Text style={styles.message}>{recommendation.message}</Text>
      </View>
      <Image
        source={{ uri: recommendation.recipe.image }}
        style={styles.image}
        contentFit="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1F2937', // Dark slate for premium contrast
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  title: {
    color: '#D4AF37', // Gold
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  image: {
    width: 100,
    height: '100%',
  }
});
