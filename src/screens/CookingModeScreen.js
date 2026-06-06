import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Alert, Share, Platform, Animated
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { incrementRecipeCooks } from '../services/recipeService';
import { useRecipeStore } from '../store/recipeStore';

const { width } = Dimensions.get('window');

// ── Star Rating ──────────────────────────────────────────────────────
const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<Ionicons key={i} name="star" size={size} color={theme.colors.primary} />);
    else if (i - rating < 1) stars.push(<Ionicons key={i} name="star-half" size={size} color={theme.colors.primary} />);
    else stars.push(<Ionicons key={i} name="star-outline" size={size} color={theme.colors.primary} />);
  }
  return <View style={{ flexDirection: 'row', gap: 2 }}>{stars}</View>;
};

// ── Toast Notification ───────────────────────────────────────────────
const Toast = ({ visible, message, slideAnim }) => {
  if (!visible) return null;
  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.toastContent}>
        <Ionicons name="checkmark-circle" size={22} color="#FFF" />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function CookingModeScreen({ route, navigation }) {
  const { recipe, calculatedIngredients } = route.params;
  const insets = useSafeAreaInsets();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastSlideAnim = useRef(new Animated.Value(-100)).current;

  // Zustand store for real favorites
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const isAlreadyFav = isFavorite(recipe.id);

  const steps = recipe.steps || [];
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex >= totalSteps;
  const currentStep = !isLastStep ? steps[currentStepIndex] : null;

  // Show toast with slide-in animation
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    toastSlideAnim.setValue(-100);
    Animated.sequence([
      Animated.spring(toastSlideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastSlideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  // Get full ingredient string with calculated amounts
  const getFullIngredientString = (ingId) => {
    const sourceIngredients = calculatedIngredients || recipe.ingredients;
    const ing = sourceIngredients?.find(i => i.id === ingId);
    if (!ing) return '';
    return `${ing.amount > 0 ? ing.amount : ''} ${ing.unit} ${ing.name}`.trim();
  };

  // Timer string helper
  const getStepTime = (step) => {
    if (step?.duration) return `${step.duration} min`;
    const words = (step?.instruction || '').split(' ').length;
    if (words > 60) return '15–20 min';
    if (words > 30) return '5–10 min';
    return '2–5 min';
  };

  // Open camera / photo library at final step
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin d\'accéder à votre caméra pour prendre une photo de votre plat.',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handlePickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à votre galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    const shareMessage = `J'ai cuisiné "${recipe.title}" avec l'app Gourmet ! 🍽️✨`;
    try {
      if (Platform.OS === 'web') {
        // Web: use native Web Share API if available, else copy to clipboard
        if (navigator.share) {
          await navigator.share({ title: recipe.title, text: shareMessage });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareMessage);
          showToast('Message copié dans le presse-papiers !');
        } else {
          Alert.alert('Partager', shareMessage);
        }
      } else {
        await Share.share({
          message: shareMessage,
          url: capturedPhoto || '',
        });
      }
    } catch (e) {
      // User cancelled or error
    }
  };

  const handleNextStep = () => {
    setCurrentStepIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex === totalSteps && recipe.id) {
        incrementRecipeCooks(recipe.id);
      }
      return nextIndex;
    });
  };

  const handleAddToFavorites = async () => {
    await toggleFavorite(recipe);
    if (!isAlreadyFav) {
      showToast('✅ Ajouté aux favoris avec succès !');
    } else {
      showToast('Retiré des favoris');
    }
  };

  const imageSource = isLastStep
    ? (capturedPhoto ? { uri: capturedPhoto } : (typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image))
    : (currentStep?.image
        ? (typeof currentStep.image === 'string' ? { uri: currentStep.image } : currentStep.image)
        : (typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image));

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      {/* Toast Notification */}
      <Toast visible={toastVisible} message={toastMessage} slideAnim={toastSlideAnim} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero Image ─────────────────────────────── */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} contentFit="cover" />

          {/* Gradient overlay */}
          <View style={styles.imageGradient} />

          {/* Top bar */}
          <View style={[styles.topActions, { top: Math.max(insets.top, 20) }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.recipeTitle} numberOfLines={1}>{recipe.title}</Text>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Step badge on image */}
          {!isLastStep && (
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Étape {currentStepIndex + 1}/{totalSteps}</Text>
            </View>
          )}
        </View>

        {/* ── Content ────────────────────────────────── */}
        <View style={styles.contentContainer}>

          {isLastStep ? (
            /* ── FINAL STEP ── */
            <View style={styles.finalStepContainer}>
              <Text style={styles.finalEmoji}>🎉</Text>
              <Text style={styles.finalTitle}>Votre plat est prêt !</Text>
              <Text style={styles.finalSubtitle}>
                {recipe.title} — est-il aussi beau que bon ?{'\n'}Prenez une photo et partagez votre création !
              </Text>

              {/* Photo preview */}
              {capturedPhoto && (
                <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} contentFit="cover" />
              )}

              {/* Action buttons */}
              <TouchableOpacity style={styles.cameraBtn} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={22} color="#FFF" />
                <Text style={styles.cameraBtnText}>Prendre une photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.libraryBtn} onPress={handlePickFromLibrary}>
                <Ionicons name="images-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.libraryBtnText}>Choisir depuis la galerie</Text>
              </TouchableOpacity>

              {capturedPhoto && (
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={20} color="#FFF" />
                  <Text style={styles.shareBtnText}>Partager ma création</Text>
                </TouchableOpacity>
              )}

              {/* Favorite button — styled as a proper button, not just underlined text */}
              <TouchableOpacity style={[styles.favBtn, isAlreadyFav && styles.favBtnActive]} onPress={handleAddToFavorites}>
                <Ionicons name={isAlreadyFav ? "heart" : "heart-outline"} size={20} color={isAlreadyFav ? "#FFF" : theme.colors.primary} />
                <Text style={[styles.favBtnText, isAlreadyFav && styles.favBtnTextActive]}>
                  {isAlreadyFav ? 'Déjà dans les favoris ♥' : 'Ajouter aux favoris'}
                </Text>
              </TouchableOpacity>

              {/* Rating final */}
              <View style={styles.finalRatingBox}>
                <Text style={styles.finalRatingLabel}>Notez cette recette :</Text>
                <StarRating rating={recipe.rating || 4.5} size={28} />
              </View>
            </View>

          ) : (
            /* ── STEP CONTENT ── */
            <>
              {/* Step title */}
              <Text style={styles.stepTitle}>{currentStep.title}</Text>

              {/* Duration */}
              <View style={styles.durationRow}>
                <Ionicons name="time-outline" size={16} color={theme.colors.secondary} />
                <Text style={styles.durationText}>{getStepTime(currentStep)}</Text>
              </View>

              {/* Requirements box: Ingredients + Utensils */}
              {((currentStep.ingredients && currentStep.ingredients.length > 0) ||
                (currentStep.utensils && currentStep.utensils.length > 0)) && (
                <View style={styles.requirementsBox}>
                  {currentStep.ingredients && currentStep.ingredients.length > 0 && (
                    <View style={styles.reqRow}>
                      <View style={styles.reqIconBox}>
                        <Ionicons name="basket-outline" size={20} color={theme.colors.primary} />
                      </View>
                      <View style={styles.reqContent}>
                        <Text style={styles.reqLabel}>Ingrédients</Text>
                        <Text style={styles.reqText}>
                          {currentStep.ingredients.map(id => getFullIngredientString(id)).filter(Boolean).join('  ·  ')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {currentStep.utensils && currentStep.utensils.length > 0 && (
                    <View style={[styles.reqRow, { marginTop: 14 }]}>
                      <View style={styles.reqIconBox}>
                        <Ionicons name="restaurant-outline" size={20} color={theme.colors.primary} />
                      </View>
                      <View style={styles.reqContent}>
                        <Text style={styles.reqLabel}>Ustensiles</Text>
                        <Text style={styles.reqText}>
                          {currentStep.utensils.join('  ·  ')}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Instruction */}
              <Text style={styles.stepInstruction}>{currentStep.instruction || currentStep.title}</Text>

              {/* Navigation buttons */}
              <View style={styles.navButtons}>
                {currentStepIndex > 0 && (
                  <TouchableOpacity
                    style={styles.prevBtn}
                    onPress={() => setCurrentStepIndex(prev => prev - 1)}
                  >
                    <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
                    <Text style={styles.prevBtnText}>Précédent</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.nextBtn, currentStepIndex === 0 && { flex: 1 }]}
                  onPress={handleNextStep}
                >
                  <Text style={styles.nextBtnText}>
                    {currentStepIndex === totalSteps - 1 ? 'Terminer !' : 'Étape suivante'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Segmented Progress Bar ─────────────────── */}
      <View style={[styles.progressBarContainer, { paddingBottom: Math.max(insets.bottom, 0) }]}>
        {steps.map((_, index) => {
          const isActive = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.progressSegment,
                isActive && styles.progressSegmentDone,
                isCurrent && styles.progressSegmentCurrent,
              ]}
              onPress={() => setCurrentStepIndex(index)}
            >
              <Text style={[
                styles.progressText,
                (isActive || isCurrent) && styles.progressTextActive
              ]}>
                {(index + 1).toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Final flag segment */}
        <TouchableOpacity
          style={[styles.progressSegment, isLastStep && styles.progressSegmentCurrent]}
          onPress={() => setCurrentStepIndex(totalSteps)}
        >
          <Ionicons
            name="flag"
            size={18}
            color={isLastStep ? '#FFF' : '#A0A0A0'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 80,
  },

  // ── Toast ──
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Image ──
  imageContainer: {
    width: '100%',
    height: width * 0.9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  topActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepBadgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Content ──
  contentContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  durationText: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontWeight: '600',
  },

  // ── Requirements ──
  requirementsBox: {
    backgroundColor: '#F7F9F7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reqIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reqContent: {
    flex: 1,
  },
  reqLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  reqText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },

  // ── Instruction ──
  stepInstruction: {
    fontSize: 17,
    color: '#333',
    lineHeight: 28,
    marginBottom: 28,
  },

  // ── Nav Buttons ──
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 4,
  },
  prevBtnText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 6,
  },
  nextBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Final Step ──
  finalStepContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  finalEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  finalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  finalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  capturedPhoto: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    marginBottom: 20,
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    gap: 10,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  cameraBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  libraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    gap: 10,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  libraryBtnText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    gap: 10,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  shareBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 32,
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  favBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  favBtnText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  favBtnTextActive: {
    color: '#FFF',
  },
  finalRatingBox: {
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  finalRatingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },

  // ── Progress Bar ──
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#D0D0D0',
    minHeight: 52,
  },
  progressSegment: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },
  progressSegmentDone: {
    backgroundColor: theme.colors.secondary,
  },
  progressSegmentCurrent: {
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    color: '#E8E8E8',
    fontWeight: '700',
    fontSize: 15,
  },
  progressTextActive: {
    color: '#FFF',
  },
});
