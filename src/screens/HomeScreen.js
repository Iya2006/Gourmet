import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, RefreshControl, StyleSheet as RN, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import FloatingImportButton from '../components/FloatingImportButton';
import { fetchAllRecipes, fetchAllChefs } from '../services/recipeService';
import {
  mockRecipes, mockChefs, mockQuickLinks,
  categoryAirFryer, categoryAsparagus, categoryTonight, categoryLatest
} from '../data/mockRecipes';
import { useRecipeStore } from '../store/recipeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Carrousel paginé avec points ────────────────────────────────────────────
const PaginatedCarousel = ({ data, renderItem, colors }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 16 }}
        removeClippedSubviews={Platform.OS !== 'web'}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
      {data.length > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
          {data.map((_, i) => (
            <View key={i} style={[{
              width: 8, height: 8, borderRadius: 4, marginHorizontal: 4,
              backgroundColor: i === activeIndex ? colors.primary : colors.border
            }, i === activeIndex && { width: 24 }]} />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Écran principal ──────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { colors, fonts, isDarkMode } = useAppTheme();
  const styles = getStyles(colors, fonts, isDarkMode);
  const { isFavorite, toggleFavorite } = useRecipeStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [recipesData, chefsData] = await Promise.all([
        fetchAllRecipes(),
        fetchAllChefs()
      ]);
      setRecipes(recipesData);
      setChefs(chefsData);
    } catch (error) {
      console.error('HomeScreen loadData error:', error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  // ── Données calculées ──────────────────────────────────────────────────────
  const heroRecipes = recipes.length >= 2
    ? [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 2)
    : recipes.length === 1
      ? [recipes[0], mockRecipes[4]]
      : [mockRecipes[0], mockRecipes[4]];

  const mappedChefs = [
    ...chefs.map(item => ({
      ...item,
      avatar: item.avatar || 'https://i.pravatar.cc/150?u=' + item.id,
      name: item.name || (item.email ? item.email.split('@')[0] : 'Chef')
    })),
    ...mockChefs
  ];

  const combinedLatest = [...recipes, ...categoryLatest].reduce((acc, curr) => {
    if (!acc.find(item => item.id === curr.id)) acc.push(curr);
    return acc;
  }, []);

  // ── Extension IA Culinaire (Mock) ──────────────────────────────────────────
  const aiRecommendations = [...recipes, ...mockRecipes]
    .filter(r => r.category === 'Africaine' || r.difficulty === 'Moyen')
    .slice(0, 3);

  // ── Animation header disparaît au scroll ──────────────────────────────────
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp'
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatLikes = (likes) => {
    if (likes >= 1000) return (likes / 1000).toFixed(1) + 'K';
    return likes;
  };

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderSmallCard = ({ item }) => {
    const currentLikes = (item.likes || 0) + (isFavorite(item.id) ? 1 : 0);
    // Build a meaningful tag: prefer category, fall back to difficulty
    const primaryTag = item.category || item.tags?.[0] || '';
    const diffTag = item.difficulty || '';
    return (
      <TouchableOpacity
        style={styles.smallCard}
        onPress={() => navigation.navigate('Details', { recipe: item })}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.smallCardImage} contentFit="cover" />

        <View style={styles.smallCardTagsRow}>
          {primaryTag ? (
            <View style={styles.smallCardTag}>
              <Text style={styles.smallCardTagText}>{primaryTag}</Text>
            </View>
          ) : null}
          {diffTag && diffTag !== primaryTag ? (
            <View style={[styles.smallCardTag, styles.smallCardTagVeg]}>
              <Text style={styles.smallCardTagText}>{diffTag}</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.smallCardLikeBtn}
          onPress={() => toggleFavorite(item)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite(item.id) ? colors.primary : colors.text}
          />
          <Text style={styles.smallCardLikeText}>{formatLikes(currentLikes)}</Text>
        </TouchableOpacity>

        <Text style={styles.smallCardTitle} numberOfLines={2}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderChef = ({ item }) => (
    <TouchableOpacity
      style={styles.chefContainer}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChefProfile', { chef: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.chefAvatar} contentFit="cover" />
      <Text style={styles.chefName} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderQuickLink = ({ item }) => (
    <TouchableOpacity style={styles.quickLinkContainer} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.quickLinkImage} contentFit="cover" />
      <View style={styles.quickLinkOverlay}>
        <Text style={styles.quickLinkText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeroCard = ({ item, isTopHero = false }) => {
    const currentLikes = (item.likes || 0) + (isFavorite(item.id) ? 1 : 0);
    return (
      <View style={{ width: SCREEN_WIDTH }}>
        <TouchableOpacity
          style={styles.heroInnerContainer}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Details', { recipe: item })}
        >
          <Animated.View style={[StyleSheet.absoluteFill, isTopHero && {
            transform: [
              { translateY: scrollY.interpolate({ inputRange: [0, 500], outputRange: [0, 500], extrapolate: 'clamp' }) },
              { scale: scrollY.interpolate({ inputRange: [-100, 0], outputRange: [1.2, 1], extrapolateLeft: 'extend', extrapolateRight: 'clamp' }) }
            ]
          }]}>
            <Image source={{ uri: item.image }} style={styles.heroImageInline} contentFit="cover" />
          </Animated.View>
          <View style={styles.heroCard}>
            <Text style={styles.heroTag}>Recette du jour</Text>
            <Text style={styles.heroTitle}>{item.title}</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroAuthor}>{item.authorName || item.author?.name || 'Chef'}</Text>
              <TouchableOpacity
                style={styles.heroLikes}
                onPress={() => toggleFavorite(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                  size={16}
                  color={isFavorite(item.id) ? colors.primary : colors.text}
                />
                <Text style={styles.heroLikesText}>{formatLikes(currentLikes)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header animé — disparaît au scroll */}
      <Animated.View style={[styles.topTabsContainer, { transform: [{ translateY: headerTranslateY }] }]}>
        <SafeAreaView edges={['top']} />
        <View style={styles.topTabs}>
          <Text style={[styles.topTabText, styles.topTabTextActive]}>Choix de l'éditeur</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.heroSection}>
          <PaginatedCarousel data={heroRecipes} renderItem={(props) => renderHeroCard({ ...props, isTopHero: true })} colors={colors} />
        </View>

        <View style={styles.mainContentBackground}>

          {/* Extension IA Culinaire : Recommandé pour vous */}
          {aiRecommendations.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>✨ Recommandé pour vous (IA)</Text>
              </View>
              <Text style={{ paddingHorizontal: 20, marginBottom: 12, color: colors.textSecondary, fontSize: 13 }}>
                Basé sur vos préférences pour les plats épicés et africains.
              </Text>
              <FlatList
                data={aiRecommendations}
                keyExtractor={item => item.id + '-ai'}
                renderItem={renderSmallCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                snapToInterval={SCREEN_WIDTH * 0.7 + 16}
                decelerationRate="fast"
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={3}
                removeClippedSubviews={Platform.OS !== 'web'}
              />
            </View>
          )}

          {/* Nos dernières recettes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nos dernières recettes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={combinedLatest}
              keyExtractor={item => item.id}
              renderItem={renderSmallCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={SCREEN_WIDTH * 0.7 + 16}
              decelerationRate="fast"
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={Platform.OS !== 'web'}
            />
          </View>

          {/* Explorez les meilleurs chefs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explorez les meilleurs chefs</Text>
            </View>
            <FlatList
              data={mappedChefs}
              keyExtractor={item => item.id}
              renderItem={renderChef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={Platform.OS !== 'web'}
            />
          </View>

          {/* 5 salades pour l'été */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>5 recettes de salades pour l'été</Text>
            </View>
            <PaginatedCarousel data={[mockRecipes[4]]} renderItem={(props) => renderHeroCard({ ...props, isTopHero: false })} colors={colors} />
          </View>

          {/* Saison des asperges */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profitez de la saison des asperges</Text>
            </View>
            <FlatList
              data={categoryAsparagus}
              keyExtractor={item => item.id}
              renderItem={renderSmallCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={SCREEN_WIDTH * 0.7 + 16}
              decelerationRate="fast"
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          </View>

          {/* Que cuisiner ce soir */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Que cuisiner ce soir</Text>
            </View>
            <FlatList
              data={categoryTonight}
              keyExtractor={item => item.id}
              renderItem={renderSmallCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={SCREEN_WIDTH * 0.7 + 16}
              decelerationRate="fast"
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          </View>

          {/* Recettes Air Fryer pour débutants */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recettes Air Fryer pour débutants</Text>
            </View>
            <FlatList
              data={categoryAirFryer}
              keyExtractor={item => item.id}
              renderItem={renderSmallCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={SCREEN_WIDTH * 0.7 + 16}
              decelerationRate="fast"
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          </View>

          {/* Liens rapides pour vous */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Liens rapides pour vous</Text>
            </View>
            <FlatList
              data={mockQuickLinks}
              keyExtractor={item => item.id}
              renderItem={renderQuickLink}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={160 + 16}
              decelerationRate="fast"
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={Platform.OS !== 'web'}
            />
          </View>

        </View>
      </Animated.ScrollView>

      <FloatingImportButton />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (colors, fonts, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  topTabsContainer: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: isDarkMode ? 'rgba(18,18,18,0.97)' : 'rgba(255,255,255,0.97)',
    zIndex: 100, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topTabs: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 },
  topTabText: { fontSize: 18, fontWeight: 'bold', color: colors.textSecondary },
  topTabTextActive: { color: colors.primary, fontSize: 18, fontWeight: '800' },

  scrollContent: { paddingBottom: 80, paddingTop: 80 },

  heroSection: { marginBottom: 40 },

  heroInnerContainer: {
    width: SCREEN_WIDTH, height: 500,
    position: 'relative', overflow: 'hidden',
  },
  heroImageInline: { width: '100%', height: '100%' },
  heroCard: {
    position: 'absolute', bottom: -30, left: 20, right: 20,
    backgroundColor: isDarkMode ? '#2C2518' : '#FFF6EC',
    borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 8,
  },
  heroTag: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8 },
  heroTitle: {
    fontSize: 28, fontFamily: fonts?.serif, fontWeight: 'bold',
    color: colors.text, marginBottom: 16, lineHeight: 32,
  },
  heroFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroAuthor: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
  heroLikes: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20,
  },
  heroLikesText: { marginLeft: 6, fontWeight: 'bold', fontSize: 14, color: colors.text },

  mainContentBackground: { backgroundColor: colors.background },

  section: { marginBottom: 40 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 16,
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: colors.text, flex: 1, marginRight: 10 },
  seeAllText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },

  horizontalList: { paddingLeft: 20, paddingRight: 4 },

  smallCard: { width: SCREEN_WIDTH * 0.7, marginRight: 16 },
  smallCardImage: { width: '100%', height: 250, borderRadius: 16, marginBottom: 12 },
  smallCardTagsRow: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  smallCardTag: { backgroundColor: '#FFF3CA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  smallCardTagVeg: { backgroundColor: '#E0F2E9' },
  smallCardTagText: { fontWeight: 'bold', fontSize: 12, color: '#1A1A1A' },
  smallCardLikeBtn: {
    position: 'absolute', bottom: 50, right: 12,
    backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  smallCardLikeText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12, color: colors.text },
  smallCardTitle: { fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 22 },

  chefContainer: { alignItems: 'center', width: 80, marginRight: 16 },
  chefAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  chefName: { fontSize: 14, fontWeight: 'bold', color: colors.text, textAlign: 'center' },

  quickLinkContainer: { width: 160, height: 200, marginRight: 16, borderRadius: 16, overflow: 'hidden' },
  quickLinkImage: { width: '100%', height: '100%' },
  quickLinkOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '50%', justifyContent: 'flex-end', padding: 16,
  },
  quickLinkText: {
    color: '#FFF', fontSize: 18, fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },
});
