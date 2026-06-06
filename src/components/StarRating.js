import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StarRating({ rating, onRatingChange }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => onRatingChange(star)}
          activeOpacity={0.7}
          style={styles.starBtn}
        >
          <Ionicons 
            name={star <= rating ? "star" : "star-outline"} 
            size={24} 
            color="#D4AF37" 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  starBtn: {
    marginRight: 8,
  }
});
