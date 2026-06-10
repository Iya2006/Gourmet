import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, ActivityIndicator, Dimensions, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAppTheme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';



const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function ChefProfileScreen({ route, navigation }) {
  const { chef } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const { isFavorite, toggleFavorite } = useRecipeStore();

  const [chefProfile, setChefProfile] = useState(chef);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch enriched chef profile from Firestore
      if (chef.id) {
        const userRef = doc(db, 'users', chef.id);
        const uSnap = await getDoc(userRef);
        if (uSnap.exists()) {
          setChefProfile({ ...chef, ...uSnap.data() });
        }
      }

      // Fetch all recipes by this chef
      const q = query(collection(db, 'recipes'), where('authorId', '==', chef.id));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setRecipes(data.sort((a, b) => (b.likes || 0) - (a.likes || 0)));
    } catch (e) {
      console.log('ChefProfileScreen fetchData error', e);
      
      // Offline fallback — no data available
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [chef]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalLikes = recipes.reduce((acc, r) => acc + (r.likes || 0), 0);
  const totalViews = recipes.reduce((acc, r) => acc + (r.views || 0), 0);

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Details', { recipe: item })}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800' }}
        style={styles.cardImage}
        contentFit="cover"
      />
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggleFavorite(item)}
      >
        <Ionicons
          name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
          size={18}
          color={isFavorite(item.id) ? '#EF4444' : '#FFF'}
        />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.cardMetaText, { color: colors.textSecondary }]}>{item.duration || 0} min</Text>
          <View style={styles.dot} />
          <Text style={[styles.cardMetaText, { color: colors.textSecondary }]}>{item.difficulty || 'Facile'}</Text>
        </View>
        <View style={styles.cardStats}>
          <Ionicons name="heart" size={13} color="#EF4444" />
          <Text style={styles.cardStatText}>{item.likes || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: chefProfile.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800' }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <SafeAreaView edges={['top']} style={styles.heroTop}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.heroContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: chefProfile.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400' }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.chefName}>{chefProfile.name || 'Chef Inconnu'}</Text>
            <View style={styles.chefRoleBadge}>
              <Ionicons name="restaurant" size={14} color={colors.primary} />
              <Text style={[styles.chefRole, { color: colors.primary }]}>Chef Cuisinier</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.text }]}>{recipes.length}</Text>
            <Text style={styles.statLbl}>Recettes</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.text }]}>{totalLikes}</Text>
            <Text style={styles.statLbl}>Likes</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.text }]}>{totalViews}</Text>
            <Text style={styles.statLbl}>Vues</Text>
          </View>
        </View>

        {/* Bio */}
        {chefProfile.bio ? (
          <View style={[styles.bioSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.bioLabel, { color: colors.primary }]}>À propos</Text>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>{chefProfile.bio}</Text>
          </View>
        ) : null}

        {/* Recipes Grid */}
        <View style={styles.recipesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Créations du Chef ({recipes.length})
          </Text>
          {recipes.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
              <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Ce chef n'a pas encore publié de recettes.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {recipes.map(item => (
                <View key={item.id} style={styles.gridItem}>
                  {renderRecipeCard({ item })}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Hero
  heroBanner: { height: 320, position: 'relative' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  heroTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    margin: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: '#FFF',
    overflow: 'hidden', marginBottom: 12,
  },
  avatar: { width: '100%', height: '100%' },
  chefName: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  chefRoleBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, gap: 6,
  },
  chefRole: { fontSize: 13, fontWeight: '700' },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: -20,
    borderRadius: 16, paddingVertical: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLbl: { fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 36 },

  // Bio
  bioSection: {
    marginHorizontal: 20, marginTop: 20,
    padding: 20, borderRadius: 16,
  },
  bioLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  bioText: { fontSize: 15, lineHeight: 24 },

  // Recipes
  recipesSection: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  emptyBox: { alignItems: 'center', padding: 40, borderRadius: 16, gap: 16 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: { width: CARD_WIDTH },

  // Card
  card: { borderRadius: 16, overflow: 'hidden' },
  cardImage: { width: '100%', height: CARD_WIDTH * 0.9 },
  heartBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  cardMetaText: { fontSize: 12 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#9CA3AF' },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardStatText: { fontSize: 12, color: '#EF4444', fontWeight: '600' },
});
