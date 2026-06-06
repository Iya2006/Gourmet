import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export default function RecipeCard({ recipe, onPress, onFavoritePress, isFavorite }) {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.image }} 
          style={styles.image} 
          contentFit="cover"
          transition={300}
        />
        
        {/* Floating Tags Top Left */}
        <View style={styles.tagsContainer}>
          <View style={styles.timeTag}>
            <Text style={styles.timeText}>{recipe.times.prep + recipe.times.bake} min.</Text>
          </View>
          {/* Example of optional vegetarian tag */}
          {recipe.nutrition.fat < 20 && (
            <View style={styles.vegTag}>
              <Text style={styles.vegText}>Vegetarian</Text>
            </View>
          )}
        </View>

        {/* Floating Heart Bottom Right */}
        <TouchableOpacity style={styles.heartButton} onPress={onFavoritePress}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavorite ? theme.colors.primary : "#1A1A1A"} 
          />
          {recipe.reviewsCount && <Text style={styles.heartText}>{recipe.reviewsCount}</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        
        <View style={styles.authorContainer}>
          {recipe.author?.avatar && (
            <Image source={{ uri: recipe.author.avatar }} style={styles.avatar} contentFit="cover" />
          )}
          <Text style={styles.authorName}>{recipe.authorName || recipe.author?.name || 'Chef'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.85,
    marginRight: 16,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.lightGray,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagsContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  timeTag: {
    backgroundColor: '#FFF1D0', // Pale yellow from benchmark
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  vegTag: {
    backgroundColor: '#E6F4EA', // Pale green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vegText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  heartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 4,
  },
  heartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 24,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  }
});
