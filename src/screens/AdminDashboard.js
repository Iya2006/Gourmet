import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const { userProfile } = useAuthStore();
  const { colors, isDarkMode } = useAppTheme();

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalChefs: 0, totalRecipes: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'recipes'

  const fetchData = useCallback(async () => {
    try {
      const [usersSnap, recipesSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'recipes')),
      ]);
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const recipesData = recipesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      setUsers(usersData);
      setRecipes(recipesData);

      const chefCount = usersData.filter(u => u.role === 'chef').length;
      const totalLikes = recipesData.reduce((acc, r) => acc + (r.likes || 0), 0);
      setStats({ totalUsers: usersData.length, totalChefs: chefCount, totalRecipes: recipesData.length, totalLikes });
    } catch (e) {
      console.error('AdminDashboard fetchData error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleChangeRole = (userId, currentRole, userName) => {
    const { Alert } = require('react-native');
    const options = ['user', 'chef', 'admin'].filter(r => r !== currentRole);
    Alert.alert(
      `Rôle de ${userName}`,
      `Rôle actuel : ${currentRole.toUpperCase()}`,
      [
        ...options.map(role => ({
          text: `Promouvoir en ${role.toUpperCase()}`,
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', userId), { role });
              Alert.alert('Succès', `${userName} est maintenant ${role.toUpperCase()}`);
              fetchData();
            } catch (e) {
              Alert.alert('Erreur', 'Impossible de modifier le rôle.');
            }
          }
        })),
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const handleDeleteRecipe = (recipeId, recipeTitle) => {
    const { Alert } = require('react-native');
    Alert.alert(
      "Supprimer la recette",
      `Êtes-vous sûr de vouloir supprimer définitivement "${recipeTitle}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'recipes', recipeId));
              setRecipes(prev => prev.filter(r => r.id !== recipeId));
              setStats(s => ({ ...s, totalRecipes: s.totalRecipes - 1 }));
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
              Alert.alert("Erreur", "La suppression a échoué.");
            }
          }
        }
      ]
    );
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'admin') return '#EF4444';
    if (role === 'chef') return '#F59E0B';
    return '#6B7280';
  };

  const tabs = [
    { key: 'overview', label: 'Aperçu', icon: 'grid' },
    { key: 'users', label: 'Utilisateurs', icon: 'people' },
    { key: 'recipes', label: 'Recettes', icon: 'book' },
  ];

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerGreeting, { color: colors.textSecondary }]}>Tableau de Bord</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Administration</Text>
        </View>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        {[
          { label: 'Utilisateurs', value: stats.totalUsers, icon: 'people', color: '#3B82F6', bg: '#3B82F615' },
          { label: 'Chefs', value: stats.totalChefs, icon: 'restaurant', color: '#F59E0B', bg: '#F59E0B15' },
          { label: 'Recettes', value: stats.totalRecipes, icon: 'book', color: '#10B981', bg: '#10B98115' },
          { label: 'Total Likes', value: stats.totalLikes, icon: 'heart', color: '#EF4444', bg: '#EF444415' },
        ].map((stat, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && [styles.tabActive, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={activeTab === tab.key ? tab.icon : `${tab.icon}-outline`}
              size={18}
              color={activeTab === tab.key ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabLabel, { color: activeTab === tab.key ? colors.primary : colors.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <View>
            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions rapides</Text>
            {[
              { icon: 'add-circle', color: colors.primary, bg: colors.primary + '15', label: 'Ajouter une recette', desc: 'Alimenter le catalogue manuellement', onPress: () => navigation.navigate('AddRecipe') },
              { icon: 'people', color: '#3B82F6', bg: '#3B82F615', label: 'Gérer les utilisateurs', desc: 'Promouvoir en Chef ou Admin', onPress: () => setActiveTab('users') },
              { icon: 'book', color: '#10B981', bg: '#10B98115', label: 'Voir toutes les recettes', desc: `${stats.totalRecipes} recettes publiées`, onPress: () => setActiveTab('recipes') },
            ].map((action, i) => (
              <TouchableOpacity key={i} style={[styles.actionCard, { backgroundColor: colors.card }]} onPress={action.onPress} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon} size={26} color={action.color} />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
                  <Text style={styles.actionDesc}>{action.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}

            {/* Top 5 Recipes */}
            {recipes.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>Top recettes</Text>
                {[...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5).map((r, idx) => (
                  <View key={r.id} style={[styles.topRow, { backgroundColor: colors.card }]}>
                    <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? '#F59E0B20' : colors.background }]}>
                      <Text style={[styles.rankText, { color: idx === 0 ? '#F59E0B' : colors.textSecondary }]}>#{idx + 1}</Text>
                    </View>
                    <Image source={{ uri: r.image }} style={styles.topImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.topName, { color: colors.text }]} numberOfLines={1}>{r.title}</Text>
                      <Text style={styles.topAuthor}>Par {r.authorName || 'Inconnu'}</Text>
                    </View>
                    <View style={styles.likesBadge}>
                      <Ionicons name="heart" size={14} color="#EF4444" />
                      <Text style={styles.likesText}>{r.likes || 0}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tous les utilisateurs ({users.length})
            </Text>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Appuyez sur un utilisateur pour modifier son rôle
            </Text>
            {users.map(u => (
              <TouchableOpacity
                key={u.id}
                style={[styles.userCard, { backgroundColor: colors.card }]}
                onPress={() => handleChangeRole(u.id, u.role || 'user', u.name || u.email)}
                activeOpacity={0.8}
              >
                <View style={[styles.userAvatar, { backgroundColor: getRoleBadgeColor(u.role) + '20' }]}>
                  <Ionicons
                    name={u.role === 'admin' ? 'shield-checkmark' : u.role === 'chef' ? 'restaurant' : 'person'}
                    size={20}
                    color={getRoleBadgeColor(u.role)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                    {u.name || u.email?.split('@')[0] || 'Utilisateur'}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>{u.email}</Text>
                </View>
                <View style={[styles.rolePill, { backgroundColor: getRoleBadgeColor(u.role) + '15' }]}>
                  <Text style={[styles.rolePillText, { color: getRoleBadgeColor(u.role) }]}>
                    {(u.role || 'user').toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* RECIPES TAB */}
        {activeTab === 'recipes' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Toutes les recettes ({recipes.length})
            </Text>
            {recipes.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
                <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucune recette publiée pour le moment.</Text>
              </View>
            ) : (
              recipes.map(r => (
                <View key={r.id} style={[styles.recipeCard, { backgroundColor: colors.card }]}>
                  <Image source={{ uri: r.image }} style={styles.recipeImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={1}>{r.title}</Text>
                    <Text style={styles.recipeBy}>Par {r.authorName || 'Inconnu'}</Text>
                    <View style={styles.recipeStats}>
                      <Ionicons name="eye" size={13} color={colors.textSecondary} />
                      <Text style={styles.recipeStatText}>{r.views || 0}</Text>
                      <Ionicons name="heart" size={13} color="#EF4444" style={{ marginLeft: 10 }} />
                      <Text style={styles.recipeStatText}>{r.likes || 0}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={{ padding: 8, justifyContent: 'center' }}
                    onPress={() => handleDeleteRecipe(r.id, r.title)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerGreeting: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '900' },
  closeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  statsScroll: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  statCard: { width: 130, padding: 18, borderRadius: 18, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  statIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 20, borderRadius: 0 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: {},
  tabLabel: { fontSize: 13, fontWeight: '700' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  hint: { fontSize: 13, marginBottom: 14, fontStyle: 'italic' },

  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  actionIcon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  actionDesc: { fontSize: 13, color: '#9CA3AF' },

  topRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, gap: 12 },
  rankBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 14, fontWeight: '900' },
  topImg: { width: 44, height: 44, borderRadius: 12 },
  topName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  topAuthor: { fontSize: 12, color: '#9CA3AF' },
  likesBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EF444415', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  likesText: { fontSize: 13, color: '#EF4444', fontWeight: '700' },

  userCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10 },
  userAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  userEmail: { fontSize: 12, color: '#9CA3AF' },
  rolePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  rolePillText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  recipeCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, gap: 14 },
  recipeImg: { width: 56, height: 56, borderRadius: 14 },
  recipeName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  recipeBy: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  recipeStats: { flexDirection: 'row', alignItems: 'center' },
  recipeStatText: { fontSize: 12, color: '#9CA3AF', marginLeft: 4, fontWeight: '600' },

  emptyBox: { alignItems: 'center', padding: 40, borderRadius: 16, gap: 12 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
