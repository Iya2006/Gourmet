import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { useRecipeStore } from '../store/recipeStore';

const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<Ionicons key={i} name="star" size={size} color={theme.colors.primary} />);
    else if (i - rating < 1) stars.push(<Ionicons key={i} name="star-half" size={size} color={theme.colors.primary} />);
    else stars.push(<Ionicons key={i} name="star-outline" size={size} color={theme.colors.primary} />);
  }
  return <View style={{ flexDirection: 'row', gap: 2 }}>{stars}</View>;
};

export default function ReviewsScreen({ route, navigation }) {
  const { recipe, reviews: initialReviews } = route.params;
  const insets = useSafeAreaInsets();
  
  const { myReviews, addReview } = useRecipeStore();
  const storedReviews = myReviews[recipe.id] || [];
  
  // Combine stored reviews with initial reviews, filtering duplicates
  const allReviewsMap = new Map();
  (initialReviews || []).forEach(r => allReviewsMap.set(r.id, r));
  storedReviews.forEach(r => allReviewsMap.set(r.id, r));
  const allReviews = Array.from(allReviewsMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Nous avons besoin d\'accès à votre galerie pour ajouter une photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleAddReview = () => {
    if (!newComment.trim() && userRating === 0) {
      Alert.alert('Erreur', 'Veuillez au moins donner une note ou laisser un commentaire.');
      return;
    }
    
    const review = {
      id: `r_user_${Date.now()}`,
      author: 'Vous',
      avatar: 'https://i.pravatar.cc/80?img=10', // mock user avatar
      rating: userRating || 5,
      text: newComment.trim(),
      date: new Date().toISOString(),
      photo: selectedPhoto,
    };
    
    addReview(recipe.id, review);
    setNewComment('');
    setUserRating(0);
    setSelectedPhoto(null);
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewCardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} contentFit="cover" />
        <View style={styles.reviewCardInfo}>
          <Text style={styles.reviewAuthor}>{item.author}</Text>
          <View style={styles.reviewStarsRow}>
            <StarRating rating={item.rating} size={13} />
            <Text style={styles.reviewDate}>
              {item.date && item.date.includes('T') ? new Date(item.date).toLocaleDateString('fr-FR') : item.date}
            </Text>
          </View>
        </View>
      </View>
      {item.text ? <Text style={styles.reviewText}>{item.text}</Text> : null}
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.reviewPhoto} contentFit="cover" />
      )}
    </View>
  );

  const listHeaderElement = (
    <View style={styles.headerBox}>
      <Text style={styles.title}>Avis sur {recipe.title}</Text>
      <View style={styles.ratingSummary}>
        <Text style={styles.ratingNum}>{recipe.rating > 0 ? recipe.rating.toFixed(1) : '0.0'}</Text>
        <StarRating rating={recipe.rating || 0} size={20} />
        <Text style={styles.reviewsCount}>({allReviews.length} avis)</Text>
      </View>

      {/* Add Review Form */}
      <View style={styles.addCommentBox}>
        <Text style={styles.addCommentTitle}>Rédiger un avis</Text>
        
        <View style={styles.addCommentRating}>
          <Text style={styles.addCommentLabel}>Votre note :</Text>
          <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <Ionicons
                  name={star <= userRating ? 'star' : 'star-outline'}
                  size={26}
                  color={theme.colors.primary}
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Partagez votre expérience avec cette recette..."
          placeholderTextColor="#AAA"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />

        {selectedPhoto && (
          <View style={styles.selectedPhotoContainer}>
            <Image source={{ uri: selectedPhoto }} style={styles.selectedPhotoPreview} contentFit="cover" />
            <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setSelectedPhoto(null)}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
            <Ionicons name="camera-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.photoBtnText}>{selectedPhoto ? 'Changer de photo' : 'Ajouter une photo'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitBtn} onPress={handleAddReview}>
            <Text style={styles.submitBtnText}>Publier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Avis & Commentaires</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={allReviews}
        keyExtractor={item => item.id}
        renderItem={renderReview}
        ListHeaderComponent={listHeaderElement}
        contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listContent: {
    padding: 20,
  },
  headerBox: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  ratingNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  reviewsCount: {
    fontSize: 15,
    color: '#666',
    marginLeft: 4,
  },

  // Form
  addCommentBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  addCommentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  addCommentRating: {
    marginBottom: 16,
  },
  addCommentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  selectedPhotoContainer: {
    position: 'relative',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  selectedPhotoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  photoBtnText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },

  // Review Items
  reviewCard: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 13,
    color: '#999',
  },
  reviewText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});
