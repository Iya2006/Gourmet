import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Dimensions, Keyboard, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../theme';
import { mockRecipes } from '../data/mockRecipes';
import { useRecipeStore } from '../store/recipeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// Collect all unique ingredients from all recipes
const getAllIngredients = () => {
  const set = new Set();
  mockRecipes.forEach(r => {
    r.ingredients?.forEach(i => {
      if (i.name) set.add(i.name);
    });
  });
  return Array.from(set).sort();
};

const ALL_INGREDIENTS = getAllIngredients();

export default function SearchByIngredientsScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const { isFavorite, toggleFavorite } = useRecipeStore();

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return ALL_INGREDIENTS.slice(0, 20);
    return ALL_INGREDIENTS.filter(i => i.toLowerCase().includes(query.toLowerCase())).slice(0, 20);
  }, [query]);

  const toggleIngredient = (name) => {
    setSelectedIngredients(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const results = useMemo(() => {
    if (selectedIngredients.length === 0) return [];
    return mockRecipes.filter(r =>
      selectedIngredients.every(sel =>
        r.ingredients?.some(i => i.name?.toLowerCase().includes(sel.toLowerCase()))
      )
    );
  }, [selectedIngredients]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Details', { recipe: item })}
    >
      <View style={styles.cardImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item)}>
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
        <Text style={styles.title}>By Ingredients</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Ingredient Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Chercher un ingrédient..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Ingredients Pills */}
      {selectedIngredients.length > 0 && (
        <View style={styles.selectedSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedScroll}>
            {selectedIngredients.map(name => (
              <TouchableOpacity
                key={name}
                style={styles.selectedPill}
                onPress={() => toggleIngredient(name)}
              >
                <Text style={styles.selectedPillText}>{name}</Text>
                <Ionicons name="close" size={14} color="#FFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Ingredient Suggestions */}
      {results.length === 0 && (
        <>
          <Text style={styles.sectionLabel}>
            {selectedIngredients.length > 0 ? 'Ajouter d\'autres ingrédients' : 'Ingrédients populaires'}
          </Text>
          <View style={styles.suggestionsWrap}>
            {filteredSuggestions.map(name => (
              <TouchableOpacity
                key={name}
                style={[styles.suggestionChip, selectedIngredients.includes(name) && styles.suggestionChipActive]}
                onPress={() => toggleIngredient(name)}
              >
                <Text style={[styles.suggestionText, selectedIngredients.includes(name) && styles.suggestionTextActive]}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>{results.length} recette{results.length !== 1 ? 's' : ''} trouvée{results.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity onPress={() => setSelectedIngredients([])}>
              <Text style={styles.clearText}>Effacer</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            numColumns={2}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, gap: 8,
  },
  backBtn: { padding: 4 },
  title: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#1A1A1A' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5', borderRadius: 14,
    marginHorizontal: 16, marginBottom: 16,
    paddingHorizontal: 14, height: 50,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1A1A1A' },

  selectedSection: { marginHorizontal: 16, marginBottom: 12 },
  selectedScroll: { gap: 8 },
  selectedPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
  },
  selectedPillText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  sectionLabel: {
    marginHorizontal: 16, marginBottom: 12,
    fontSize: 16, fontWeight: '700', color: '#333',
  },
  suggestionsWrap: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#F5F5F5', borderRadius: 20,
  },
  suggestionChipActive: { backgroundColor: theme.colors.primary },
  suggestionText: { fontSize: 14, fontWeight: '600', color: '#444' },
  suggestionTextActive: { color: '#FFF' },

  resultsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  resultsCount: { fontSize: 14, color: '#888', fontWeight: '600' },
  clearText: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },

  gridContent: { paddingHorizontal: 20, paddingBottom: 40 },
  gridRow: { justifyContent: 'space-between', marginBottom: 20 },
  card: { width: CARD_WIDTH },
  cardImageWrapper: {
    position: 'relative', width: '100%', height: CARD_WIDTH,
    borderRadius: 14, overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 5,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginTop: 8, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: '#999', marginTop: 2 },
});
