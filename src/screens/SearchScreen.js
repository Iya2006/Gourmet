/**
 * SearchScreen.js
 * Recherche dynamique avec filtres avancés — CDC §3, §11, §15
 * Interface premium redesignée.
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Dimensions, ScrollView, ActivityIndicator,
  Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAppTheme } from '../theme';
import { useRecipeContext } from '../context/RecipeContext';
import { useRecipeStore } from '../store/recipeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

// ─── Chip de filtre ──────────────────────────────────────────────────────────
function FilterChip({ label, active, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles_chip.chip,
        { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.card }
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles_chip.chipText, { color: active ? '#FFF' : colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
const styles_chip = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '700' }
});

// ─── Carte en grille (2 colonnes) ──────────────────────────────────────────
function GridCard({ item, onPress, isFav, onToggleFav, colors }) {
  const total = item.duration || (item.times?.prep || 0) + (item.times?.bake || 0);
  return (
    <TouchableOpacity style={[styles_grid.card, { backgroundColor: colors.card, width: CARD_WIDTH }]} onPress={onPress} activeOpacity={0.88}>
      <View style={styles_grid.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles_grid.image} contentFit="cover" />
        {item.source === 'themealdb' && (
          <View style={styles_grid.badge}>
            <Text style={styles_grid.badgeText}>🌐 Web</Text>
          </View>
        )}
        <TouchableOpacity style={styles_grid.heartBtn} onPress={onToggleFav} activeOpacity={0.8}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={17} color={isFav ? colors.primary : '#FFF'} />
        </TouchableOpacity>
      </View>
      <View style={styles_grid.info}>
        <Text style={[styles_grid.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles_grid.meta}>
          {item.category ? (
            <View style={[styles_grid.catBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles_grid.catText, { color: colors.primary }]}>{item.category}</Text>
            </View>
          ) : null}
          {total > 0 ? (
            <View style={styles_grid.timeBadge}>
              <Ionicons name="time-outline" size={11} color={colors.textSecondary} />
              <Text style={[styles_grid.timeText, { color: colors.textSecondary }]}>{total}m</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles_grid = StyleSheet.create({
  card: {
    borderRadius: 18, marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  imageWrapper: { width: '100%', height: CARD_WIDTH, position: 'relative' },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3
  },
  badgeText: { fontSize: 10, color: '#FFF', fontWeight: '700' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 6,
  },
  info: { padding: 12 },
  title: { fontSize: 13, fontWeight: '700', lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  catBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  catText: { fontSize: 10, fontWeight: '700' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 10, fontWeight: '600' },
});

// ─── Carte en liste ──────────────────────────────────────────────────────────
function ListCard({ item, onPress, isFav, onToggleFav, colors }) {
  const total = item.duration || (item.times?.prep || 0) + (item.times?.bake || 0);
  return (
    <TouchableOpacity
      style={[styles_list.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles_list.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles_list.image} contentFit="cover" />
        {item.source === 'themealdb' && (
          <View style={styles_list.badge}>
            <Text style={styles_list.badgeText}>🌐</Text>
          </View>
        )}
      </View>
      <View style={styles_list.content}>
        <Text style={[styles_list.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles_list.metaRow}>
          {item.category ? (
            <View style={[styles_list.catBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles_list.catText, { color: colors.primary }]}>{item.category}</Text>
            </View>
          ) : null}
          {item.difficulty ? (
            <Text style={[styles_list.diffText, { color: colors.textSecondary }]}>{item.difficulty}</Text>
          ) : null}
          {total > 0 ? (
            <View style={styles_list.timeBadge}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles_list.timeText, { color: colors.textSecondary }]}>{total} min</Text>
            </View>
          ) : null}
        </View>
      </View>
      <TouchableOpacity onPress={onToggleFav} style={styles_list.favBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? colors.primary : colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
const styles_list = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  imageWrapper: { position: 'relative' },
  image: { width: 96, height: 96, borderRadius: 12, margin: 10 },
  badge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2
  },
  badgeText: { fontSize: 10 },
  content: { flex: 1, paddingVertical: 12, paddingRight: 4 },
  title: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  catBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  catText: { fontSize: 11, fontWeight: '700' },
  diffText: { fontSize: 12, fontWeight: '500' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 12, fontWeight: '500' },
  favBtn: { paddingRight: 14 },
});

// ─── Écran principal ──────────────────────────────────────────────────────────
export default function SearchScreen({ navigation }) {
  const { colors, isDarkMode } = useAppTheme();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const {
    search, setSearch,
    filteredRecipes,
    selectedCategory, setSelectedCategory,
    selectedDifficulty, setSelectedDifficulty,
    selectedDuration, setSelectedDuration,
    CATEGORIES, DIFFICULTIES, DURATIONS,
    resetFilters,
  } = useRecipeContext();

  const { isFavorite, toggleFavorite } = useRecipeStore();
  const [onlineResults, setOnlineResults] = useState(null);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const inputRef = useRef(null);

  // Clear online results when search changes
  React.useEffect(() => {
    setOnlineResults(null);
  }, [search]);

  const searchOnline = async () => {
    if (!search.trim()) return;
    setLoadingOnline(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.meals) {
        const mapped = data.meals.map(m => {
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const name = m[`strIngredient${i}`];
            const measure = m[`strMeasure${i}`];
            if (name && name.trim()) {
              ingredients.push({ id: `ing_${i}`, name: name.trim(), amount: measure ? measure.trim() : '', unit: '' });
            }
          }
          const instructions = m.strInstructions || '';
          const steps = instructions
            .split(/\r?\n/)
            .filter(s => s.trim().length > 0)
            .map((step, idx) => ({ id: `step_${idx}`, instruction: step.trim() }));

          return {
            id: 'mealdb_' + m.idMeal,
            title: m.strMeal,
            image: m.strMealThumb,
            category: m.strCategory,
            difficulty: 'Moyen',
            times: { prep: 10, bake: 20 },
            source: 'themealdb',
            ingredients,
            steps,
          };
        });
        setOnlineResults(mapped);
      } else {
        setOnlineResults([]);
      }
    } catch (e) {
      setOnlineResults([]);
    } finally {
      setLoadingOnline(false);
    }
  };

  const hasActiveFilters =
    selectedCategory !== 'Tous' ||
    selectedDifficulty !== 'Tous' ||
    selectedDuration !== 'Tous';

  const displayedRecipes = onlineResults && filteredRecipes.length === 0
    ? onlineResults
    : filteredRecipes;

  const renderItem = ({ item, index }) => {
    const isFav = isFavorite(item.id);
    const onPress = () => navigation.navigate('Details', { recipe: item });
    const onToggleFav = () => toggleFavorite(item);

    if (viewMode === 'grid') {
      return (
        <GridCard
          item={item}
          onPress={onPress}
          isFav={isFav}
          onToggleFav={onToggleFav}
          colors={colors}
        />
      );
    }
    return (
      <ListCard
        item={item}
        onPress={onPress}
        isFav={isFav}
        onToggleFav={onToggleFav}
        colors={colors}
      />
    );
  };

  const showOnlineBtn = search.trim() && filteredRecipes.length === 0 && !onlineResults && !loadingOnline;
  const totalResults = displayedRecipes.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>

        {/* ── HEADER ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: colors.text, letterSpacing: -0.5 }}>Recherche</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500', marginTop: 1 }}>
              {totalResults > 0 ? `${totalResults} recette${totalResults > 1 ? 's' : ''} trouvée${totalResults > 1 ? 's' : ''}` : 'Trouvez votre recette idéale'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Vue grille/liste */}
            <TouchableOpacity
              style={{ padding: 8, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            >
              <Ionicons name={viewMode === 'grid' ? 'list' : 'grid'} size={20} color={colors.text} />
            </TouchableOpacity>
            {hasActiveFilters && (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.primary + '15', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 }}
                onPress={resetFilters}
              >
                <Ionicons name="refresh-outline" size={15} color={colors.primary} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── BARRE DE RECHERCHE ── */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={{
            flexDirection: 'row', alignItems: 'center',
            marginHorizontal: 20, marginTop: 12, marginBottom: 14,
            backgroundColor: isDarkMode ? '#2A2A2A' : '#F2F2F7',
            borderRadius: 18,
            paddingHorizontal: 16, height: 52,
            borderWidth: 1.5,
            borderColor: search.length > 0 ? colors.primary : 'transparent',
          }}
        >
          <Ionicons name="search" size={20} color={search.length > 0 ? colors.primary : colors.textSecondary} style={{ marginRight: 10 }} />
          <TextInput
            ref={inputRef}
            style={{ flex: 1, fontSize: 16, color: colors.text, fontWeight: '500' }}
            placeholder="Pizza, poulet, ingrédient..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={searchOnline}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setOnlineResults(null); }}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* ── FILTRES CATEGORIE ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 0, alignItems: 'center' }}
          style={{ flexGrow: 0, flexShrink: 0, marginBottom: 10 }}
        >
          {CATEGORIES.map(cat => (
            <FilterChip key={cat} label={cat} active={selectedCategory === cat} onPress={() => setSelectedCategory(cat)} colors={colors} />
          ))}
        </ScrollView>

        {/* ── FILTRES DIFFICULTE + DUREE ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}
          style={{ flexGrow: 0, flexShrink: 0, marginBottom: 14 }}
        >
          {DIFFICULTIES.map(d => (
            <FilterChip key={d} label={d === 'Tous' ? '🎯 Difficulté' : d} active={selectedDifficulty === d} onPress={() => setSelectedDifficulty(d)} colors={colors} />
          ))}
          <View style={{ width: 1, height: 22, backgroundColor: colors.border, marginHorizontal: 6 }} />
          {DURATIONS.map(dur => (
            <FilterChip key={dur} label={dur === 'Tous' ? '⏱ Durée' : dur} active={selectedDuration === dur} onPress={() => setSelectedDuration(dur)} colors={colors} />
          ))}
        </ScrollView>

        {/* ── CONTENU PRINCIPAL ── */}
        {loadingOnline ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 14 }}>Recherche sur TheMealDB…</Text>
          </View>
        ) : displayedRecipes.length > 0 ? (
          <FlatList
            key={viewMode}
            data={displayedRecipes}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            numColumns={viewMode === 'grid' ? 2 : 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 60,
              columnGap: viewMode === 'grid' ? 12 : 0,
            }}
            columnWrapperStyle={viewMode === 'grid' ? { gap: 12 } : undefined}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              onlineResults ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingTop: 4 }}>
                  <Ionicons name="globe-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>Résultats TheMealDB</Text>
                  <TouchableOpacity onPress={() => setOnlineResults(null)} style={{ marginLeft: 'auto' }}>
                    <Ionicons name="close-circle-outline" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        ) : (
          /* ── ÉTAT VIDE ── */
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 }}>
            {search.length > 0 ? (
              <>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Ionicons name="search-outline" size={40} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                  Pas de résultat local
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
                  Aucune recette locale pour «{' '}
                  <Text style={{ fontWeight: '700', color: colors.text }}>{search}</Text>
                  {' '}». Cherchez en ligne sur TheMealDB ?
                </Text>
                {showOnlineBtn && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 8,
                      backgroundColor: colors.primary,
                      paddingHorizontal: 28, paddingVertical: 14,
                      borderRadius: 30, shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8
                    }}
                    onPress={searchOnline}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="globe-outline" size={20} color="#FFF" />
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Chercher sur TheMealDB</Text>
                  </TouchableOpacity>
                )}
                {onlineResults && onlineResults.length === 0 && (
                  <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
                    Aucun résultat sur TheMealDB non plus.{'\n'}Essayez un autre mot-clé.
                  </Text>
                )}
              </>
            ) : (
              <>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Ionicons name="restaurant-outline" size={40} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                  Cherchez une recette
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
                  Tapez un nom de plat, un ingrédient ou sélectionnez une catégorie
                </Text>
              </>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
