import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function predictgame() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predict Game</Text>
      <Text style={styles.sub}>This is the Predict Game screen (placeholder).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  sub: { color: '#888', marginTop: 8 }
});