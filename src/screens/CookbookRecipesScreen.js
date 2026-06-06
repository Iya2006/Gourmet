import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,
  Modal, TextInput, Animated, PanResponder, ScrollView, StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';
import { mockRecipes } from '../data/mockRecipes';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const formatLikes = (n) => {
  if (!n) return null;
  if (n >= 1000) return (n / 1000).toFixed(2).replace(/\.?0+$/, '') + 'K';
  return String(n);
};

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, visible }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7 }),
        Animated.delay(2000),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        toastStyles.container,
        {
          opacity: anim,
          transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
          }],
        },
      ]}
    >
      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
      <Text style={toastStyles.text}>{message}</Text>
    </Animated.View>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  text: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});

// ─── Draggable Bottom Sheet ───────────────────────────────────────────────────
function DraggableSheet({ visible, onClose, children, snapHeight }) {
  const translateY = useRef(new Animated.Value(snapHeight)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true, friction: 8, tension: 65,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: snapHeight, duration: 280, useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) {
          Animated.timing(translateY, { toValue: snapHeight, duration: 260, useNativeDriver: true }).start(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={sheetStyles.overlay}>
      <TouchableOpacity style={sheetStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View
        style={[
          sheetStyles.sheet,
          { paddingBottom: insets.bottom + 16, transform: [{ translateY }] },
        ]}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={sheetStyles.handleArea}>
          <View style={sheetStyles.handle} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

const sheetStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 0,
    maxHeight: height * 0.8,
  },
  handleArea: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  handle: {
    width: 44, height: 5, borderRadius: 3, backgroundColor: '#DDD',
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function CookbookRecipesScreen({ route, navigation }) {
  const { cookbookId, title } = route.params;
  const insets = useSafeAreaInsets();

  const {
    cookbooks, favorites, isFavorite, toggleFavorite,
    saveRecipeToCookbooks, getCookbooksForRecipe, createCookbook,
  } = useRecipeStore();

  const cookbook = cookbooks.find(c => c.id === cookbookId);
  const recipes = cookbookId === 'cb_favorites'
    ? favorites
    : (cookbook ? mockRecipes.filter(r => cookbook.recipeIds.includes(r.id)) : []);

  // Action sheet state
  const [actionVisible, setActionVisible] = useState(false);
  const selectedRecipe = useRef(null);

  // Move sheet state
  const [moveVisible, setMoveVisible] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [showNewInput, setShowNewInput] = useState(false);
  const [newBookName, setNewBookName] = useState('');

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(false);
    clearTimeout(toastTimer.current);
    setTimeout(() => {
      setToastVisible(true);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
    }, 50);
  };

  const openAction = (recipe) => {
    selectedRecipe.current = recipe;
    setActionVisible(true);
  };

  const openMove = () => {
    setActionVisible(false);
    setTimeout(() => {
      const ids = getCookbooksForRecipe(selectedRecipe.current?.id || '');
      // Auto-check current cookbook (since we're viewing it)
      const autoIds = ids.includes(cookbookId) ? ids : [...ids, cookbookId];
      setCheckedIds(autoIds);
      setMoveVisible(true);
    }, 320);
  };

  const handleDelete = () => {
    const recipe = selectedRecipe.current;
    setActionVisible(false);
    if (cookbookId === 'cb_favorites') {
      toggleFavorite(recipe);
    } else {
      const current = getCookbooksForRecipe(recipe.id).filter(id => id !== cookbookId);
      saveRecipeToCookbooks(recipe, current);
    }
    showToast('Recette supprimée du dossier');
  };

  const toggleCheck = (id) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    await saveRecipeToCookbooks(selectedRecipe.current, checkedIds);
    showToast('✓ Enregistré dans le cookbook !');
    // Don't close the modal — user sees live update and can drag to dismiss
  };

  const handleCreateBook = async () => {
    if (!newBookName.trim()) return;
    const newCb = await createCookbook(newBookName.trim());
    setCheckedIds(prev => [...prev, newCb.id]);
    setNewBookName('');
    setShowNewInput(false);
    showToast(`Cookbook "${newCb.title}" créé !`);
  };

  // Get last recipe image for a cookbook thumbnail
  const getCookbookThumb = (cb) => {
    if (cb.id === 'cb_favorites') {
      return favorites.length > 0 ? favorites[favorites.length - 1]?.image : null;
    }
    const ids = cb.recipeIds || [];
    if (ids.length === 0) return null;
    const last = mockRecipes.find(r => r.id === ids[ids.length - 1]);
    return last?.image || null;
  };

  const renderCard = ({ item }) => {
    const badge = item.tags?.find(t =>
      ['végétarien', 'vegan', 'Végétarien', 'Vegan', 'Vegetarian'].includes(t)
    );
    const likes = formatLikes(item.likes);
    const chefName = item.author?.name || 'Chef';
    const chefAvatar = item.author?.avatar;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Details', { recipe: item })}
        >
          <View style={styles.cardImageWrapper}>
            <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />

            {badge && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{badge}</Text>
              </View>
            )}

            {likes && (
              <View style={styles.likesChip}>
                <Ionicons name="heart" size={13} color={theme.colors.primary} />
                <Text style={styles.likesText}>{likes}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

        <View style={styles.chefRow}>
          {chefAvatar
            ? <Image source={{ uri: chefAvatar }} style={styles.chefAvatar} contentFit="cover" />
            : <View style={[styles.chefAvatar, styles.chefAvatarFallback]}>
                <Ionicons name="person" size={13} color="#AAA" />
              </View>
          }
          <Text style={styles.chefName} numberOfLines={1}>{chefName}</Text>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => openAction(item)}
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={{ width: 28 }} />
        </View>

        {recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Ce dossier est vide</Text>
            <Text style={styles.emptySubText}>Appuyez sur ❤️ sur n'importe quelle recette pour l'ajouter</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={item => item.id}
            renderItem={renderCard}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity style={[styles.fab, { bottom: Math.max(insets.bottom + 8, 24) }]} activeOpacity={0.9}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Action Sheet: Move / Delete ── */}
      <DraggableSheet
        visible={actionVisible}
        onClose={() => setActionVisible(false)}
        snapHeight={260}
      >
        <TouchableOpacity style={styles.actionRow} onPress={openMove}>
          <View style={styles.actionIconBox}>
            <Ionicons name="arrow-redo-outline" size={22} color="#333" />
          </View>
          <Text style={styles.actionText}>Move</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionRow} onPress={handleDelete}>
          <View style={[styles.actionIconBox, { backgroundColor: '#FFF0F0' }]}>
            <Ionicons name="trash-outline" size={22} color="#E53E3E" />
          </View>
          <Text style={[styles.actionText, { color: '#E53E3E' }]}>Delete</Text>
        </TouchableOpacity>
      </DraggableSheet>

      {/* ── Move / Cookbook Selector Sheet ── */}
      <DraggableSheet
        visible={moveVisible}
        onClose={() => { setMoveVisible(false); setShowNewInput(false); }}
        snapHeight={height * 0.75}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Save in new cookbook */}
          {showNewInput ? (
            <View style={styles.newBookRow}>
              <TextInput
                style={styles.newBookInput}
                placeholder="Nom du cookbook..."
                placeholderTextColor="#AAA"
                value={newBookName}
                onChangeText={setNewBookName}
                autoFocus
              />
              <TouchableOpacity style={styles.newBookOk} onPress={handleCreateBook}>
                <Ionicons name="checkmark" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.newBookCancel}
                onPress={() => { setShowNewInput(false); setNewBookName(''); }}
              >
                <Ionicons name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.newBookBtn} onPress={() => setShowNewInput(true)}>
              <View style={styles.newBookIconBox}>
                <Ionicons name="add" size={28} color="#333" />
              </View>
              <Text style={styles.newBookText}>Save in new cookbook</Text>
            </TouchableOpacity>
          )}

          {/* Cookbook list */}
          {cookbooks.map(cb => {
            const thumb = getCookbookThumb(cb);
            const count = cb.id === 'cb_favorites' ? favorites.length : (cb.recipeIds?.length || 0);
            const checked = checkedIds.includes(cb.id);
            return (
              <TouchableOpacity
                key={cb.id}
                style={styles.cbRow}
                onPress={() => toggleCheck(cb.id)}
              >
                {/* Thumbnail: last recipe image or icon */}
                <View style={[styles.cbThumb, { backgroundColor: cb.bgColor || '#FFF8F0' }]}>
                  {thumb
                    ? <Image source={{ uri: thumb }} style={styles.cbThumbImg} contentFit="cover" />
                    : cb.icon
                      ? <Ionicons name={cb.icon} size={22} color={cb.color || '#888'} />
                      : <View style={styles.cbThumbEmpty} />
                  }
                </View>
                <View style={styles.cbInfo}>
                  <Text style={styles.cbTitle}>{cb.title}</Text>
                  <Text style={styles.cbCount}>{count} {count === 1 ? 'recipe' : 'recipes'}</Text>
                </View>
                <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                  {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </DraggableSheet>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: '#FFF' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#1A1A1A' },

  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  row: { justifyContent: 'space-between', marginBottom: 24 },

  // Recipe Card
  card: { width: CARD_WIDTH },
  cardImageWrapper: {
    width: '100%', height: CARD_WIDTH,
    borderRadius: 16, overflow: 'hidden', position: 'relative',
  },
  cardImage: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(200,240,195,0.93)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  categoryBadgeText: { fontSize: 12, fontWeight: '700', color: '#1A5C1A' },
  likesChip: {
    position: 'absolute', bottom: 10, right: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.93)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12, gap: 4,
  },
  likesText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  cardTitle: {
    fontSize: 14, fontWeight: '700', color: '#1A1A1A',
    marginTop: 10, lineHeight: 20,
  },
  chefRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8, gap: 6,
  },
  chefAvatar: { width: 26, height: 26, borderRadius: 13 },
  chefAvatarFallback: { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  chefName: { flex: 1, fontSize: 13, fontWeight: '600', color: theme.colors.primary },

  // FAB
  fab: {
    position: 'absolute', right: 24,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },

  // Empty state
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: '700', color: '#555' },
  emptySubText: { marginTop: 8, fontSize: 14, color: '#999', textAlign: 'center', paddingHorizontal: 40 },

  // Action rows
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 16 },
  actionIconBox: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center',
  },
  actionText: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  actionDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },

  // New cookbook input
  newBookBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, gap: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 8,
  },
  newBookIconBox: {
    width: 52, height: 52, borderRadius: 14,
    borderWidth: 2, borderColor: '#DDD', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  newBookText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  newBookRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 8,
  },
  newBookInput: {
    flex: 1, height: 46, backgroundColor: '#F5F5F5',
    borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: '#1A1A1A',
  },
  newBookOk: {
    width: 46, height: 46, backgroundColor: '#2D8A4E',
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  newBookCancel: {
    width: 46, height: 46, backgroundColor: '#F0F0F0',
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },

  // Cookbook rows
  cbRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, gap: 14,
    borderBottomWidth: 1, borderBottomColor: '#F7F7F7',
  },
  cbThumb: {
    width: 52, height: 52, borderRadius: 12,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
  },
  cbThumbImg: { width: '100%', height: '100%' },
  cbThumbEmpty: { width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.1)' },
  cbInfo: { flex: 1 },
  cbTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  cbCount: { fontSize: 13, color: '#888', marginTop: 2 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: '#CCC',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#2D8A4E', borderColor: '#2D8A4E' },

  // Save button
  saveBtn: {
    backgroundColor: '#2D8A4E', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
});
