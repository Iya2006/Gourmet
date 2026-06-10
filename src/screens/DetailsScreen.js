import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Share, Animated, TextInput, Linking } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import React, { useState, useMemo, useRef } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';
import { useRecipeContext } from '../context/RecipeContext';
import { incrementRecipeViews } from '../services/recipeService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Circular Timer (Inline for the detail page) ─────────────────────
const DetailCircularTimer = ({ time, label }) => {
  // Calculate arc progress: assume 60 min = full circle for visual
  const maxTime = 60;
  const progress = Math.min(time / maxTime, 1);
  const hasProgress = time > 0;

  return (
    <View style={timerStyles.container}>
      <View style={[
        timerStyles.circle,
        hasProgress && timerStyles.circleActive
      ]}>
        <Text style={timerStyles.timeText}>{time} min</Text>
      </View>
      <Text style={timerStyles.labelText}>{label}</Text>
    </View>
  );
};

const timerStyles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1 },
  circle: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: '#E8E8E8',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  circleActive: {
    borderTopColor: theme.colors.primary,
    borderRightColor: theme.colors.primary,
  },
  timeText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  labelText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
});

// ─── Star Rating Component ────────────────────────────────────────────
const StarRating = ({ rating, size = 18 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Ionicons key={i} name="star" size={size} color={theme.colors.primary} />);
    } else if (i - rating < 1 && i - rating > 0) {
      stars.push(<Ionicons key={i} name="star-half" size={size} color={theme.colors.primary} />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={size} color={theme.colors.primary} />);
    }
  }
  return <View style={{ flexDirection: 'row', gap: 2 }}>{stars}</View>;
};

// ─── Separator ────────────────────────────────────────────────────────
const Separator = () => <View style={styles.separator} />;

// ─── Main Screen ──────────────────────────────────────────────────────
export default function DetailsScreen({ route, navigation }) {
  const { recipe } = route.params;
  const insets = useSafeAreaInsets();
  
  const [servings, setServings] = useState(recipe.baseServings || 2);
  const [descExpanded, setDescExpanded] = useState(false);
  const { isFavorite, toggleFavorite, addRecipeToShoppingList, isInShoppingList } = useRecipeStore();

  const isFav = isFavorite(recipe.id);
  const inList = isInShoppingList(recipe.id);

  // Increment views on mount
  React.useEffect(() => {
    if (recipe.id) {
      incrementRecipeViews(recipe.id);
    }
  }, [recipe.id]);

  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;

  // --- State for Video ---
  const [showVideo, setShowVideo] = useState(false);
  
  const youtubeId = useMemo(() => {
    if (!recipe.youtubeUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = recipe.youtubeUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [recipe.youtubeUrl]);

  // Header Animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Footer Animation (Slide up from bottom)
  const footerTranslateY = scrollY.interpolate({
    inputRange: [150, 300],
    outputRange: [100, 0], // Starts 100px below (hidden), moves to 0 (visible)
    extrapolate: 'clamp',
  });

  const formatLikes = (likes) => {
    if (likes >= 1000) return (likes / 1000).toFixed(2) + 'K';
    return likes;
  };

  const currentLikes = (recipe.likes || 0) + (isFav ? 1 : 0);

  // Recalculate ingredients based on servings
  const calculatedIngredients = useMemo(() => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return [];
    return recipe.ingredients.map(ing => {
      const newAmount = (ing.amount / (recipe.baseServings || 2)) * servings;
      const roundedAmount = Math.round(newAmount * 10) / 10;
      return { ...ing, amount: roundedAmount };
    });
  }, [recipe.ingredients, recipe.baseServings, servings]);

  const handleAddToShoppingList = () => {
    if (inList) {
      navigation.navigate('ShoppingList');
    } else {
      addRecipeToShoppingList(recipe, calculatedIngredients);
    }
  };

  const handleStartCooking = () => {
    navigation.navigate('CookingMode', { recipe, calculatedIngredients });
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Découvre cette recette : ${recipe.title}` });
    } catch (e) {}
  };

  // Author description (mock if not present)
  const authorDescription = recipe.author?.description || recipe.authorBio ||
    "Passionné(e) de cuisine africaine, je partage mes meilleures recettes authentiques pour vous faire voyager à travers les saveurs de notre continent.";

  // Suggested recipes (other recipes from the same category, excluding this one)
  const { filteredRecipes: allRecipes } = useRecipeContext();
  const suggestedRecipes = useMemo(() => {
    return allRecipes.filter(r => r.id !== recipe.id).slice(0, 4);
  }, [recipe.id, allRecipes]);

  // Combine local and remote reviews
  const { myReviews } = useRecipeStore();
  const localReviews = myReviews[recipe.id] || [];
  const combinedReviews = useMemo(() => {
    const map = new Map();
    (recipe.reviews || []).forEach(r => map.set(r.id, r));
    localReviews.forEach(r => map.set(r.id, r));
    return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [recipe.reviews, localReviews]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        
        {/* ════════════ HERO IMAGE / VIDEO ════════════ */}
        <View style={styles.imageContainer}>
          {showVideo && youtubeId ? (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#000', paddingTop: Math.max(insets.top, 0) }}>
              <YoutubePlayer
                height={300}
                play={true}
                videoId={youtubeId}
                initialPlayerParams={{
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  fs: 1,
                  iv_load_policy: 3
                }}
                onChangeState={(state) => {
                  if (state === 'ended') setShowVideo(false);
                }}
              />
            </View>
          ) : (
            <>
              <Image source={{ uri: recipe.image }} style={styles.heroImage} contentFit="cover" />
              
              {/* Youtube Play Button Overlay */}
              {youtubeId && (
                <TouchableOpacity 
                  style={styles.youtubePlayOverlay} 
                  onPress={() => setShowVideo(true)}
                >
                  <View style={styles.youtubePlayCircle}>
                    <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Back Button on the image - always visible */}
          <TouchableOpacity 
            style={[styles.backBtnOnImage, { top: Math.max(insets.top, 12), zIndex: 10 }]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* ════════════ TITLE & RATING ════════════ */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          <>
            <View style={styles.ratingRow}>
              <StarRating rating={recipe.rating || 0} />
            </View>
            {recipe.reviewsCount > 0 ? (
              <Text style={styles.ratingSubtext}>
                Basé sur {recipe.reviewsCount} évaluation{recipe.reviewsCount > 1 ? 's' : ''}
              </Text>
            ) : (
              <Text style={styles.ratingSubtext}>
                Aucune évaluation pour le moment
              </Text>
            )}
          </>

          {/* Share & Like buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionCircle} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCircle, isFav && styles.actionCircleFav]} 
              onPress={() => toggleFavorite(recipe)}
            >
              <Ionicons 
                name={isFav ? "heart" : "heart-outline"} 
                size={22} 
                color={isFav ? "#FFF" : theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Likes count badge */}
          <View style={styles.likesBadge}>
            <Ionicons name="heart" size={14} color={theme.colors.primary} />
            <Text style={styles.likesBadgeText}>{formatLikes(currentLikes)}</Text>
          </View>
        </View>

        {/* ════════════ STICKY HEADER (Share & Like) ════════════ */}
        {/* The sticky header is handled by the scroll itself — 
            on iOS the navigation bar would handle it. We simulate it. */}

        <Separator />

        {/* ════════════ AUTHOR SECTION ════════════ */}
        <View style={styles.authorSection}>
          <View style={styles.authorRow}>
            <Image 
              source={{ uri: recipe.authorAvatar || recipe.author?.avatar || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&q=80' }} 
              style={styles.authorAvatar} 
              contentFit="cover" 
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{recipe.authorName || recipe.author?.name || 'Chef Gourmet'}</Text>
              <Text style={styles.authorRole}>Chef Cuistot</Text>
              <Text style={styles.authorLink}>Découvrir son profil</Text>
            </View>
          </View>
          
          <Text style={styles.authorDesc} numberOfLines={descExpanded ? undefined : 4}>
            {authorDescription}
          </Text>
          {!descExpanded && (
            <TouchableOpacity onPress={() => setDescExpanded(true)}>
              <Text style={styles.readMore}>Lire la suite</Text>
            </TouchableOpacity>
          )}
        </View>

        <Separator />

        {/* ════════════ REVIEWS SECTION ════════════ */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <View style={styles.reviewScoreBox}>
              <Text style={styles.reviewScoreNum}>{recipe.rating > 0 ? recipe.rating.toFixed(1) : '0.0'}</Text>
              <Text style={styles.reviewTotal}>({combinedReviews.length} avis)</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews', { recipe, reviews: combinedReviews })}>
              <Text style={styles.readLink}>Lire ou Ajouter</Text>
            </TouchableOpacity>
          </View>
          
          {/* Review thumbnails */}
          {combinedReviews.filter(r => r.photo).length > 0 && (
            <View style={styles.reviewThumbnails}>
              {combinedReviews.filter(r => r.photo).slice(0, 4).map((r, idx, arr) => (
                <View key={idx} style={styles.reviewThumbContainer}>
                  <Image source={{ uri: r.photo }} style={styles.reviewThumb} contentFit="cover" />
                  {idx === 3 && arr.length > 4 && (
                    <View style={styles.reviewThumbOverlay}>
                      <Text style={styles.reviewThumbMore}>+{arr.length - 4}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <Separator />

        {/* ════════════ DIFFICULTY ════════════ */}
        <View style={styles.difficultySection}>
          <Text style={styles.sectionTitle}>
            Difficulté : <Text style={styles.difficultyValue}>{recipe.difficulty || 'Facile'} 👌</Text>
          </Text>
        </View>

        <Separator />

        {/* ════════════ TIMERS ════════════ */}
        <View style={styles.timersSection}>
          <DetailCircularTimer time={recipe.prepTime || recipe.times?.prep || recipe.duration || 25} label="Préparation" />
          <DetailCircularTimer time={recipe.cookTime || recipe.times?.bake || 12} label="Cuisson" />
          <DetailCircularTimer time={recipe.restTime || recipe.times?.rest || 0} label="Repos" />
        </View>

        <Separator />

        {/* ════════════ INGREDIENTS ════════════ */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          
          {/* Servings Adjuster */}
          <View style={styles.servingsRow}>
            <Text style={styles.servingsLabel}>{servings} Portions</Text>
            <View style={styles.servingsControls}>
              <TouchableOpacity 
                style={styles.servingsBtn} 
                onPress={() => setServings(s => Math.max(1, s - 1))}
              >
                <Ionicons name="remove" size={20} color={servings <= 1 ? '#CCC' : '#1A1A1A'} />
              </TouchableOpacity>
              <Text style={styles.servingsValue}>{servings}</Text>
              <TouchableOpacity 
                style={[styles.servingsBtn, styles.servingsBtnPlus]} 
                onPress={() => setServings(s => s + 1)}
              >
                <Ionicons name="add" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredient Rows */}
          {calculatedIngredients.length > 0 ? (
            calculatedIngredients.map((ing) => (
              <View key={ing.id} style={styles.ingredientRow}>
                <Text style={styles.ingredientAmount}>
                  {ing.amount > 0 ? ing.amount : ''} {ing.unit}
                </Text>
                <Text style={styles.ingredientName}>{ing.name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noIngredients}>
              <Text style={styles.noIngredientsText}>
                Les ingrédients seront ajoutés prochainement.
              </Text>
            </View>
          )}

          {/* Add to Shopping List */}
          <TouchableOpacity 
            style={[styles.addToListBtn, inList && styles.inListBtn]} 
            onPress={handleAddToShoppingList}
          >
            {inList ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#145941" style={{ marginRight: 8 }} />
                <Text style={styles.inListText}>Dans ta liste → Acheter maintenant</Text>
              </>
            ) : (
              <>
                <Ionicons name="cart-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.addToListText}>Ajouter à la liste de courses</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Separator />

        {/* ════════════ UTENSILS ════════════ */}
        {recipe.source !== 'themealdb' && (
          <>
            <View style={styles.utensilsSection}>
              <Text style={styles.sectionTitle}>Ustensiles</Text>
              <Text style={styles.utensilsText}>
                {recipe.utensils && recipe.utensils.length > 0 
                  ? recipe.utensils.join(', ')
                  : 'bol, passoire, 2 cuillères en bois, batteur à main, cuillère à glace, plaque de cuisson, papier sulfurisé'
                }
              </Text>
            </View>
            <Separator />
          </>
        )}

        {/* ════════════ NUTRITION ════════════ */}
        {recipe.nutrition && (
          <>
            <View style={styles.nutritionSection}>
              <Text style={styles.sectionTitle}>Valeurs nutritionnelles par portion</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Cal</Text>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.calories || recipe.nutrition.cal || '—'}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Prot.</Text>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.protein ? `${recipe.nutrition.protein} g` : '—'}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Lipides</Text>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.fat ? `${recipe.nutrition.fat} g` : '—'}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Glucides</Text>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.carbs ? `${recipe.nutrition.carbs} g` : '—'}</Text>
                </View>
              </View>
            </View>
            <Separator />
          </>
        )}

        <Separator />

        {/* ════════════ ALL STEPS ════════════ */}
        <View style={styles.stepsPreviewSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
            Préparation ({recipe.steps?.length || 0} étapes)
          </Text>
          
          {recipe.steps && recipe.steps.map((step, index) => (
            <View key={step.id || index} style={styles.stepContainer}>
              <Text style={styles.stepNumberTitle}>Étape {index + 1}/{recipe.steps.length}</Text>
              
              {/* Step Image */}
              {step.image ? (
                <View style={styles.stepPreviewCard}>
                  <Image source={typeof step.image === 'string' ? { uri: step.image } : step.image} style={styles.stepPreviewImage} contentFit="cover" />
                </View>
              ) : null}

              {/* Step Ingredients (Optional: list them if provided in data) */}
              {step.ingredients && step.ingredients.length > 0 && (
                <Text style={styles.stepIngredientsText}>
                  Ingrédients : {
                    step.ingredients.map(ingId => {
                      const ing = calculatedIngredients.find(i => i.id === ingId);
                      return ing ? `${ing.name}` : '';
                    }).filter(Boolean).join(', ')
                  }
                </Text>
              )}
              
              {/* Step Instruction */}
              <Text style={styles.stepInstructionText}>{step.instruction || step.title}</Text>
            </View>
          ))}
        </View>

        {/* Bottom spacer for the sticky button */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* ════════════ STICKY HEADER (appears on scroll) ════════════ */}
      <Animated.View style={[styles.stickyHeader, { 
        paddingTop: Math.max(insets.top, 8), 
        opacity: headerOpacity,
        backgroundColor: theme.colors.card,
        borderBottomColor: theme.colors.border
      }]}>
        <TouchableOpacity style={[styles.stickyHeaderBtn, { backgroundColor: theme.colors.background }]} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.stickyHeaderRight}>
          <TouchableOpacity style={[styles.stickyHeaderBtn, { backgroundColor: theme.colors.background }]} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.stickyHeaderBtn, isFav && { backgroundColor: theme.colors.primary }]} 
            onPress={() => toggleFavorite(recipe)}
          >
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#FFF" : theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ════════════ STICKY FOOTER (Start Cooking) ════════════ */}
      <Animated.View style={[
        styles.stickyFooter, 
        { 
          paddingBottom: Math.max(insets.bottom, 16),
          transform: [{ translateY: footerTranslateY }]
        }
      ]}>
        <TouchableOpacity style={styles.startCookingBtn} onPress={handleStartCooking}>
          <Text style={styles.startCookingText}>Commencer la cuisson !</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 0,
  },

  // ── Hero Image ──
  imageContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 1.15,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backBtnOnImage: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubePlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  youtubePlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  // ── Sticky Header ──
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.97)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stickyHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(240,240,240,0.8)',
  },
  stickyHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Title Section ──
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 28,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  ratingRow: {
    marginBottom: 6,
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleFav: {
    backgroundColor: theme.colors.primary,
  },
  likesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },

  // ── Separator ──
  separator: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 20,
  },

  // ── Author Section ──
  authorSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  authorLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  authorDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  readMore: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 6,
    fontSize: 15,
  },

  // ── Reviews Section ──
  reviewsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reviewsSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  readLink: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  reviewThumbnails: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewThumbContainer: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
  },
  reviewThumb: {
    width: '100%',
    height: '100%',
  },
  reviewThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewThumbMore: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // ── Difficulty ──
  difficultySection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  difficultyValue: {
    fontWeight: '800',
  },

  // ── Timers ──
  timersSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  // ── Ingredients ──
  ingredientsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  servingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  servingsLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsBtnPlus: {
    backgroundColor: '#FFF5E6',
    borderColor: '#FFF5E6',
  },
  servingsValue: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 14,
    minWidth: 24,
    textAlign: 'center',
  },
  ingredientRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  ingredientAmount: {
    width: 80,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  noIngredients: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noIngredientsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  addToListBtn: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
  },
  addToListText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inListBtn: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  inListText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ── Utensils ──
  utensilsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  utensilsText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    marginTop: 12,
  },

  // ── Nutrition ──
  nutritionSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nutritionItem: {
    alignItems: 'flex-start',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // ── Steps ──
  stepsPreviewSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  stepContainer: {
    marginBottom: 32,
  },
  stepNumberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  stepPreviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    marginBottom: 16,
  },
  stepPreviewImage: {
    width: '100%',
    height: '100%',
  },
  stepInstructionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  stepIngredientsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },

  // ── Section Title ──
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  // ── Sticky Footer ──
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  startCookingBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  startCookingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ── Reviews ──
  reviewsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewsRatingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewsRatingNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addCommentBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  addCommentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  addCommentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  commentInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  commentSubmitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
  },
  commentSubmitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewCard: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  reviewCardInfo: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
    marginBottom: 10,
  },
  reviewPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },

  // ── More Ideas ──
  moreIdeasSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  moreIdeasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moreIdeaCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  moreIdeaImage: {
    width: '100%',
    height: '100%',
  },
  moreIdeaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  moreIdeaTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  moreIdeaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreIdeaMetaText: {
    color: '#DDD',
    fontSize: 11,
  },

  // ── Tags ──
  tagsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  tagChipGreen: {
    backgroundColor: '#E8F5E9',
  },
  tagTextGreen: {
    color: theme.colors.secondary,
  },
});
