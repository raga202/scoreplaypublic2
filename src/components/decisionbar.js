import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DecisionBar({ onPredict }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => onPredict('OFF_SIDE')}
      >
        <Text style={styles.btnText}>PLAY OFF SIDE</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, styles.legBtn]} 
        onPress={() => onPredict('LEG_SIDE')}
      >
        <Text style={styles.btnText}>PLAY LEG SIDE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#000', // Matching our dark theme
  },
  btn: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#D63031', // Red accent from Arena
    width: '48%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  legBtn: {
    borderColor: '#A4D146', // ScorePlay's Lime Green
  },
  btnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
});