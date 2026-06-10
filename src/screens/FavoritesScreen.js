import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAppTheme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// Returns up to 3 recipe images for a cookbook
function getCookbookImages(cookbook, favorites, allRecipes) {
  let recipes = [];
  if (cookbook.id === 'cb_favorites') {
    recipes = favorites;
  } else {
    recipes = allRecipes.filter(r => (cookbook.recipeIds || []).includes(r.id));
  }
  return recipes.slice(0, 3).map(r => r.image).filter(Boolean);
}

// Collage preview of recipe photos (like screenshot: big top + 2 bottom cells)
function CookbookCollage({ images, bgColor, isDarkMode }) {
  const [img0, img1, img2] = images;
  const safeBgColor = isDarkMode ? '#2A2A2A' : (bgColor || '#FFF8F0');
  const emptyCellColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[collageStyles.container, { backgroundColor: safeBgColor }]}>
      {/* Top big image */}
      <View style={collageStyles.topCell}>
        {img0
          ? <Image source={{ uri: img0 }} style={collageStyles.img} contentFit="cover" />
          : <View style={[collageStyles.emptyCell, { backgroundColor: emptyCellColor }]} />
        }
      </View>
      {/* Bottom 2 cells */}
      <View style={collageStyles.bottomRow}>
        <View style={collageStyles.bottomCell}>
          {img1
            ? <Image source={{ uri: img1 }} style={collageStyles.img} contentFit="cover" />
            : <View style={[collageStyles.emptyCell, { borderRadius: 0, backgroundColor: emptyCellColor }]} />
          }
        </View>
        <View style={[collageStyles.bottomCell, { marginLeft: 3 }]}>
          {img2
            ? <Image source={{ uri: img2 }} style={collageStyles.img} contentFit="cover" />
            : <View style={[collageStyles.emptyCell, { backgroundColor: safeBgColor, borderRadius: 0 }]} />
          }
        </View>
      </View>
    </View>
  );
}

const collageStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    borderRadius: 18,
    overflow: 'hidden',
    gap: 3,
  },
  topCell: { flex: 1.4 },
  img: { width: '100%', height: '100%' },
  emptyCell: {
    width: '100%', height: '100%',
    borderRadius: 4,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomCell: { flex: 1 },
});

export default function FavoritesScreen({ navigation }) {
  const { colors, isDarkMode } = useAppTheme();
  const styles = getStyles(colors, isDarkMode);
  
  const { cookbooks, favorites, createCookbook } = useRecipeStore();
  const insets = useSafeAreaInsets();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const displayCookbooks = useMemo(() =>
    cookbooks.map(cb => ({
      ...cb,
      displayCount: cb.id === 'cb_favorites' ? favorites.length : (cb.recipeIds?.length || 0),
      images: getCookbookImages(cb, favorites, favorites),
    })),
    [cookbooks, favorites]
  );

  const handleCreateCookbook = async () => {
    if (!newTitle.trim()) return;
    await createCookbook(newTitle.trim());
    setNewTitle('');
    setCreateModalVisible(false);
  };

  const renderCookbook = ({ item }) => {
    const hasImages = item.images && item.images.length > 0;
    const showIcon = !hasImages && item.icon;
    const safeBgColor = isDarkMode ? '#2A2A2A' : (item.bgColor || '#FFF8F0');

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.82}
        onPress={() => navigation.navigate('CookbookRecipes', { cookbookId: item.id, title: item.title })}
      >
        {/* Card top: collage or icon */}
        {hasImages ? (
          <CookbookCollage images={item.images} bgColor={item.bgColor} isDarkMode={isDarkMode} />
        ) : (
          <View style={[styles.cardTop, { backgroundColor: safeBgColor }]}>
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
            {showIcon ? (
              <Ionicons name={item.icon} size={38} color={item.color || (isDarkMode ? '#FFF' : '#333')} />
            ) : (
              /* Empty grid placeholders */
              <View style={styles.emptyGridPreview}>
                <View style={[styles.emptyGridTop, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]} />
                <View style={styles.emptyGridBottom}>
                  <View style={[styles.emptyGridCell, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]} />
                  <View style={[styles.emptyGridCell, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]} />
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.cardBottom}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.displayCount} {item.displayCount === 1 ? 'recipe' : 'recipes'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Recipes</Text>
      </View>

      <FlatList
        data={displayCookbooks}
        keyExtractor={item => item.id}
        renderItem={renderCookbook}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: Math.max(insets.bottom + 8, 24) }]}
        activeOpacity={0.9}
        onPress={() => setCreateModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Create Cookbook Bottom Sheet */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCreateModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <View
              style={[styles.createSheet, { paddingBottom: Math.max(insets.bottom + 10, 24) }]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.sheetHandle} />
              <Text style={styles.createTitle}>Nouveau Cookbook</Text>
              <TextInput
                style={styles.createInput}
                placeholder="Nom du cookbook..."
                placeholderTextColor={colors.textSecondary}
                value={newTitle}
                onChangeText={setNewTitle}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCreateCookbook}
              />
              <TouchableOpacity
                style={[styles.createBtn, !newTitle.trim() && { opacity: 0.45 }]}
                onPress={handleCreateCookbook}
                disabled={!newTitle.trim()}
              >
                <Text style={styles.createBtnText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  row: { justifyContent: 'space-between', marginBottom: 20 },

  card: { width: CARD_WIDTH },
  cardTop: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  badge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  emptyGridPreview: { width: '72%', height: '72%', gap: 4 },
  emptyGridTop: {
    flex: 1, 
    borderRadius: 8, marginBottom: 4,
  },
  emptyGridBottom: { flex: 1, flexDirection: 'row', gap: 4 },
  emptyGridCell: { flex: 1, borderRadius: 8 },

  cardBottom: { marginTop: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, fontWeight: '600' },

  fab: {
    position: 'absolute', right: 24,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'flex-end' },
  createSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 12,
  },
  sheetHandle: {
    width: 44, height: 5, borderRadius: 3,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20,
  },
  createTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 16 },
  createInput: {
    height: 52, backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5', borderRadius: 14,
    paddingHorizontal: 16, fontSize: 16, color: colors.text, marginBottom: 16,
  },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: 30, paddingVertical: 15, alignItems: 'center',
  },
  createBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
});
