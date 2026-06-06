import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { collection, getDocs, query, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';

export default function ChefDashboard({ navigation }) {
  const { user, userProfile } = useAuthStore();
  const { colors, isDarkMode } = useAppTheme();

  const [myRecipes, setMyRecipes] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalCooks: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Profile Editor Modal
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchMyRecipes = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'recipes'), where('authorId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyRecipes(data);

      const totalViews = data.reduce((acc, r) => acc + (r.views || 0), 0);
      const totalLikes = data.reduce((acc, r) => acc + (r.likes || 0), 0);
      const totalCooks = data.reduce((acc, r) => acc + (r.cooks || 0), 0);
      setStats({ totalViews, totalLikes, totalCooks });

      // Load Profile if existing
      const userRef = doc(db, 'users', user.uid);
      const uSnap = await getDoc(userRef);
      if (uSnap.exists()) {
        const uData = uSnap.data();
        setBio(uData.bio || '');
        setAvatarUrl(uData.avatar || '');
      }

    } catch (e) {
      console.error('ChefDashboard fetchMyRecipes error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyRecipes();
  }, [fetchMyRecipes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyRecipes();
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        bio: bio.trim(),
        avatar: avatarUrl.trim()
      });
      // Optionally update recipes with new avatar
      Alert.alert("Succès", "Profil mis à jour avec succès");
      setEditProfileVisible(false);
      fetchMyRecipes(); // refresh
    } catch (e) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Chef {userProfile?.name || 'Inconnu'} ✨</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={[styles.appBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Bio Section */}
        <TouchableOpacity style={[styles.bioCard, { backgroundColor: colors.card }]} onPress={() => setEditProfileVisible(true)} activeOpacity={0.8}>
          <View style={styles.bioHeader}>
            <Text style={[styles.bioTitle, { color: colors.text }]}>Ma Biographie</Text>
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.bioText, { color: bio ? colors.textSecondary : '#9CA3AF' }]} numberOfLines={3}>
            {bio || "Ajoutez une biographie pour vous présenter à votre audience..."}
          </Text>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="eye" size={24} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalViews}</Text>
            <Text style={styles.statLabel}>Vues</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="heart" size={24} color="#EF4444" style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalLikes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="restaurant" size={24} color="#10B981" style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalCooks}</Text>
            <Text style={styles.statLabel}>Cuisinées</Text>
          </View>
        </View>

        {/* Action Add Recipe */}
        <TouchableOpacity 
          style={[styles.addRecipeBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Ionicons name="add" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.addRecipeText}>Publier une nouvelle recette</Text>
        </TouchableOpacity>

        {/* My Recipes */}
        <View style={styles.sectionContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Vos recettes publiées ({myRecipes.length})
          </Text>

          {myRecipes.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
              <Ionicons name="book-outline" size={48} color={colors.textSecondary} style={{ marginBottom: 15 }} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Vous n'avez pas encore publié de recettes. Lancez-vous !
              </Text>
            </View>
          ) : (
            myRecipes.map(recipe => (
              <View key={recipe.id} style={[styles.recipeRow, { backgroundColor: colors.card }]}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImg} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recipeName, { color: colors.text }]} numberOfLines={1}>{recipe.title}</Text>
                  <Text style={styles.recipeDate}>
                    {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString('fr-FR') : ''}
                  </Text>
                  <View style={styles.recipeStatsRow}>
                    <View style={styles.miniStat}>
                      <Ionicons name="heart" size={14} color="#EF4444" />
                      <Text style={styles.miniStatText}>{recipe.likes || 0}</Text>
                    </View>
                    <View style={styles.miniStat}>
                      <Ionicons name="chatbubble" size={14} color="#3B82F6" />
                      <Text style={styles.miniStatText}>{recipe.reviews?.length || 0}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.recipeEditBtn}>
                  <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Editor Modal */}
      <Modal visible={editProfileVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Modifier mon Profil</Text>
            
            <Text style={[styles.label, { color: colors.textSecondary }]}>URL de la photo de profil</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              value={avatarUrl}
              onChangeText={setAvatarUrl}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Biographie</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Parlez de votre passion..."
              placeholderTextColor={colors.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.background }]} onPress={() => setEditProfileVisible(false)}>
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Enregistrer</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 2, fontWeight: '500' },
  appBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bioCard: { marginHorizontal: 20, padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  bioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bioTitle: { fontSize: 16, fontWeight: '700' },
  bioText: { fontSize: 14, lineHeight: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  statCard: { flex: 1, marginHorizontal: 6, paddingVertical: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statIcon: { marginBottom: 8 },
  statNumber: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '600', textTransform: 'uppercase' },
  addRecipeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, paddingVertical: 18, borderRadius: 16, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  addRecipeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  sectionContent: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 15 },
  emptyBox: { alignItems: 'center', padding: 40, borderRadius: 16 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  recipeRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 12 },
  recipeImg: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
  recipeName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  recipeDate: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  recipeStatsRow: { flexDirection: 'row', gap: 15 },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniStatText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  recipeEditBtn: { padding: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 15 },
  modalBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  modalBtnText: { fontSize: 16, fontWeight: 'bold' }
});
