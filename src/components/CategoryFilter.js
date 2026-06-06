import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const { t } = useTranslation();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((categoryKey) => {
        const isSelected = selectedCategory === categoryKey;
        return (
          <TouchableOpacity
            key={categoryKey}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelectCategory(categoryKey)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {t(`categories.${categoryKey}`, categoryKey) !== `categories.${categoryKey}` 
                ? t(`categories.${categoryKey}`) 
                : t(`difficulties.${categoryKey}`, categoryKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    minHeight: 50,
    marginBottom: 15,
  },
  contentContainer: {
    paddingRight: 15,
    alignItems: 'center', // Centers vertically
  },
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: '#E07A5F', // Premium Terracotta
    borderColor: '#E07A5F',
  },
  text: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
  textSelected: {
    color: '#FFFFFF',
  },
});
