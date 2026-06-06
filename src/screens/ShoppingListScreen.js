import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import FloatingImportButton from '../components/FloatingImportButton';
import { useRecipeStore } from '../store/recipeStore';

export default function ShoppingListScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Recipes'); // 'Recipes' or 'All items'
  const { shoppingList, toggleIngredientCheck, unmarkAllItems, removeRecipeFromShoppingList } = useRecipeStore();

  const allItemsFlattened = useMemo(() => {
    const map = new Map();
    shoppingList.forEach(item => {
      item.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (map.has(key)) {
          const existing = map.get(key);
          existing.amount += ing.amount;
        } else {
          map.set(key, { ...ing, recipeId: item.recipe.id });
        }
      });
    });
    return Array.from(map.values());
  }, [shoppingList]);

  const renderIngredient = (ing, recipeId) => (
    <TouchableOpacity 
      key={ing.id} 
      style={styles.ingredientRow}
      onPress={() => toggleIngredientCheck(recipeId, ing.id)}
    >
      <View style={[styles.checkbox, ing.checked && styles.checkboxChecked]}>
        {ing.checked && <Ionicons name="checkmark" size={16} color="#FFF" />}
      </View>
      <Text style={[styles.ingredientText, ing.checked && styles.ingredientTextChecked]}>
        {ing.amount > 0 ? ing.amount : ''} {ing.unit} {ing.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste de courses</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Recipes' && styles.activeTab]}
          onPress={() => setActiveTab('Recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'Recipes' && styles.activeTabText]}>
            Recettes ({shoppingList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'All items' && styles.activeTab]}
          onPress={() => setActiveTab('All items')}
        >
          <Text style={[styles.tabText, activeTab === 'All items' && styles.activeTabText]}>
            Tous les articles
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {shoppingList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>Ta liste de courses est vide.</Text>
          </View>
        ) : (
          <>
            {activeTab === 'Recipes' && shoppingList.map(item => {
              const missingItems = item.ingredients.filter(i => !i.checked);
              const checkedItems = item.ingredients.filter(i => i.checked);
              const totalCount = item.ingredients.length;
              const isAllChecked = checkedItems.length === totalCount;
              
              return (
                <View key={item.recipe.id} style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.recipeTitle, isAllChecked && {color: '#888'}]}>
                        {item.recipe.title}
                      </Text>
                      <Text style={[styles.missingText, isAllChecked && {color: theme.colors.secondary}]}>
                        {isAllChecked 
                          ? "Tous les ingrédients obtenus !" 
                          : `${missingItems.length} sur ${totalCount} articles manquants`}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeRecipeFromShoppingList(item.recipe.id)}>
                      <Ionicons name="trash-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  {/* Missing Items */}
                  <View style={styles.ingredientList}>
                    {missingItems.map(ing => renderIngredient(ing, item.recipe.id))}
                  </View>

                  {/* Checked Items Section (Got it!) */}
                  {checkedItems.length > 0 && (
                    <View style={styles.checkedSection}>
                      <Text style={styles.checkedSectionTitle}>Obtenus ({checkedItems.length})</Text>
                      {checkedItems.map(ing => renderIngredient(ing, item.recipe.id))}
                    </View>
                  )}
                </View>
              );
            })}

            {activeTab === 'All items' && (
              <View style={styles.allItemsContainer}>
                {/* Missing items */}
                {allItemsFlattened.filter(i => !i.checked).map((ing, idx) => 
                  renderIngredient(ing, ing.recipeId)
                )}

                {/* Checked items */}
                {allItemsFlattened.filter(i => i.checked).length > 0 && (
                  <View style={styles.checkedSection}>
                    <Text style={styles.checkedSectionTitle}>Obtenus</Text>
                    {allItemsFlattened.filter(i => i.checked).map((ing, idx) => 
                      renderIngredient(ing, ing.recipeId)
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {shoppingList.length > 0 && (
        <TouchableOpacity style={styles.unmarkBtn} onPress={unmarkAllItems}>
          <Text style={styles.unmarkBtnText}>Tout décocher</Text>
        </TouchableOpacity>
      )}
      <FloatingImportButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
  recipeCard: {
    marginBottom: 32,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  missingText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
  ingredientList: {
    backgroundColor: '#FFF',
  },
  checkedSection: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkedSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  allItemsContainer: {
    backgroundColor: '#FFF',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  ingredientText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
  unmarkBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  unmarkBtnText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  }
});
