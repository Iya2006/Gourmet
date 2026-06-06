import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function ServingsAdjuster({ servings, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{servings} Servings</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={onDecrease} disabled={servings <= 1}>
          <Ionicons name="remove" size={20} color={servings <= 1 ? '#CCC' : theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.value}>{servings}</Text>
        
        <TouchableOpacity style={styles.button} onPress={onIncrease}>
          <Ionicons name="add" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary, // Beige background
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  button: {
    padding: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  }
});
