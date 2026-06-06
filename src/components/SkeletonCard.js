import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function SkeletonCard() {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [animatedValue]);

  return (
    <Animated.View style={[styles.card, { opacity: animatedValue }]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.metaRow}>
          <View style={styles.metaPlaceholder} />
          <View style={styles.metaPlaceholder} />
          <View style={styles.badgePlaceholder} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 22,
    overflow: 'hidden',
    borderColor: '#F3F0EB',
    borderWidth: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 210,
    backgroundColor: '#E5E7EB',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  titlePlaceholder: {
    width: '60%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaPlaceholder: {
    width: 60,
    height: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 18,
  },
  badgePlaceholder: {
    marginLeft: 'auto',
    width: 70,
    height: 25,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  }
});
