import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ value, onChangeText }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Ionicons 
          name="close-circle" 
          size={20} 
          color="#9CA3AF" 
          onPress={() => onChangeText('')}
          style={styles.clearIcon}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F0EB',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  clearIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
    fontWeight: '400',
  }
});
