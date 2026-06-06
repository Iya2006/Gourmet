import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function FavoriteButton({ isFavorite, onPress, style }) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.button, isFavorite ? styles.buttonActive : styles.buttonInactive, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={20} 
        color={isFavorite ? "#E07A5F" : "#6B7280"} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonActive: {
    backgroundColor: '#FFF5F3',
  },
  buttonInactive: {
    backgroundColor: '#FFFFFF',
  },
});
