import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../theme';
import { useRecipeContext } from '../context/RecipeContext';
import { useRecipeStore } from '../store/recipeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function CategoryListScreen({ route, navigation }) {
  const { category } = route.params;
  const { isFavorite, toggleFavorite } = useRecipeStore();

  const { filteredRecipes: allRecipes } = useRecipeContext();

  // Filter recipes matching this category by tag name
  const recipes = useMemo(() => {
    const tag = category.tag.toLowerCase();
    return allRecipes.filter(r =>
      r.tags?.some(t => t.toLowerCase().includes(tag)) ||
      r.title?.toLowerCase().includes(tag) ||
      r.ingredients?.some(i => i.name?.toLowerCase().includes(tag))
    );
  }, [category, allRecipes]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Details', { recipe: item })}
    >
      <View style={styles.cardImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons
            name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite(item.id) ? theme.colors.primary : '#FFF'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardMeta}>
        {item.times ? `${item.times.prep + item.times.bake} min` : ''}{item.difficulty ? ` · ${item.difficulty}` : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>{category.emoji}</Text>
        <Text style={styles.title}>{category.label}</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.subtitle}>{recipes.length} recette{recipes.length !== 1 ? 's' : ''}</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{category.emoji}</Text>
          <Text style={styles.emptyText}>Aucune recette dans cette catégorie pour l'instant.</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerEmoji: { fontSize: 22 },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: { justifyContent: 'space-between', marginBottom: 20 },
  card: { width: CARD_WIDTH },
  cardImageWrapper: {
    position: 'relative',
    width: '100%', height: CARD_WIDTH,
    borderRadius: 14, overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16,
    padding: 5,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginTop: 8, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', paddingHorizontal: 40 },
});
