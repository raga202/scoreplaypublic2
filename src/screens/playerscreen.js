import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function PlayerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Player Rankings & Stats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.text, fontSize: 18 }
});