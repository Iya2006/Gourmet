import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function CircularTimer({ time, label }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        {/* We use border colors to simulate the progress arc. For a perfect arc, react-native-svg would be needed */}
        <Text style={styles.timeText}>{time} min</Text>
      </View>
      {label && <Text style={styles.labelText}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    borderTopColor: theme.colors.primary, // Simulates the progress
    borderRightColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  }
});
