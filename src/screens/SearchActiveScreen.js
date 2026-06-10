import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Dimensions, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';
import { useRecipeContext } from '../context/RecipeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const QUICK_TAGS = [
  { id: 'popular',  label: '🔥 Most popular', filter: (r) => r.likes > 3000 || r.reviewsCount > 200 },
  { id: 'trending', label: '📈 Trending',      filter: (r) => r.likes > 2000 },
  { id: 'lowcarb',  label: '🥦 Low carb',      filter: (r) => (r.nutrition?.carb || 99) < 20 },
  { id: 'vegan',    label: '🌿 Easy vegan',    filter: (r) => r.difficulty === 'Facile' },
  { id: 'chicken',  label: '🍗 Chicken',       filter: (r) => r.title?.toLowerCase().includes('poule') || r.ingredients?.some(i => i.name?.toLowerCase().includes('poulet') || i.name?.toLowerCase().includes('chicken')) },
  { id: 'salmon',   label: '🐟 Salmon',        filter: (r) => r.title?.toLowerCase().includes('saumon') || r.ingredients?.some(i => i.name?.toLowerCase().includes('saumon') || i.name?.toLowerCase().includes('salmon')) },
];

export default function SearchActiveScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const inputRef = useRef(null);
  const { isFavorite, toggleFavorite } = useRecipeStore();

  useEffect(() => {
    // Focus the input when the screen opens
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const { filteredRecipes: allRecipes } = useRecipeContext();

  const results = useMemo(() => {
    if (activeTag) {
      const tag = QUICK_TAGS.find(t => t.id === activeTag);
      return tag ? allRecipes.filter(tag.filter) : [];
    }
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allRecipes.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.ingredients?.some(i => i.name?.toLowerCase().includes(q)) ||
      r.tags?.some(t => t?.toLowerCase().includes(q))
    );
  }, [query, activeTag, allRecipes]);

  const showResults = activeTag || query.trim().length > 0;

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
      {/* Search Bar Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Hungry?"
            placeholderTextColor="#999"
            value={query}
            onChangeText={(t) => { setQuery(t); setActiveTag(null); }}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => { Keyboard.dismiss(); navigation.goBack(); }}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Tags */}
      {!showResults && (
        <View style={styles.tagsSection}>
          <Text style={styles.tagsTitle}>Suggestions</Text>
          <View style={styles.tagsWrap}>
            {QUICK_TAGS.map(tag => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tagChip, activeTag === tag.id && styles.tagChipActive]}
                onPress={() => { setActiveTag(tag.id); setQuery(''); Keyboard.dismiss(); }}
              >
                <Text style={[styles.tagText, activeTag === tag.id && styles.tagTextActive]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Active Tag Chips when showing results */}
      {showResults && (
        <View style={styles.activeTagsRow}>
          {QUICK_TAGS.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tagChipSmall, activeTag === tag.id && styles.tagChipActive]}
              onPress={() => { setActiveTag(activeTag === tag.id ? null : tag.id); setQuery(''); Keyboard.dismiss(); }}
            >
              <Text style={[styles.tagTextSmall, activeTag === tag.id && styles.tagTextActive]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {showResults && (
        <>
          <Text style={styles.resultsCount}>{results.length} recette{results.length !== 1 ? 's' : ''} trouvée{results.length !== 1 ? 's' : ''}</Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            numColumns={2}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Aucun résultat pour "{query || activeTag}"</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  // Search row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  cancelBtn: { paddingHorizontal: 4, paddingVertical: 6 },
  cancelText: { fontSize: 15, color: theme.colors.primary, fontWeight: '600' },

  // Quick Tags
  tagsSection: { paddingHorizontal: 16, paddingTop: 8 },
  tagsTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#F5F5F5', borderRadius: 24,
  },
  tagChipActive: { backgroundColor: theme.colors.primary },
  tagText: { fontSize: 15, fontWeight: '600', color: '#444' },
  tagTextActive: { color: '#FFF' },

  // Active tag row when results shown
  activeTagsRow: {
    flexDirection: 'row', flexWrap: 'nowrap',
    paddingHorizontal: 16, paddingBottom: 8,
    gap: 8,
  },
  tagChipSmall: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#F5F5F5', borderRadius: 20,
  },
  tagTextSmall: { fontSize: 13, fontWeight: '600', color: '#444' },

  // Results
  resultsCount: {
    paddingHorizontal: 16, paddingBottom: 8,
    fontSize: 14, color: '#888', fontWeight: '600',
  },
  gridContent: { paddingHorizontal: 20, paddingBottom: 40 },
  gridRow: { justifyContent: 'space-between', marginBottom: 20 },

  card: { width: CARD_WIDTH },
  cardImageWrapper: { position: 'relative', width: '100%', height: CARD_WIDTH, borderRadius: 14, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16,
    padding: 5,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginTop: 8, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: '#999', marginTop: 2 },

  emptyBox: { flex: 1, alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 16, color: '#999' },
});
