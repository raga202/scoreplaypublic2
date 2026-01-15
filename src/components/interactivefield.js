import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Rect, G, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function InteractiveField() {
  const limeGreen = "#A4D146";
  const charcoal = "#2C3E50";

  return (
    <View style={styles.container}>
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 400 400">
        {/* Boundary (Outfield) */}
        <Circle cx="200" cy="200" r="180" fill="#78B931" />
        
        {/* 30-Yard Circle */}
        <Circle cx="200" cy="200" r="120" fill="#8BC34A" stroke="#FFF" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Central Pitch */}
        <Rect x="185" y="140" width="30" height="120" rx="4" fill="#E2D1A1" />
        
        {/* Batsman & Bowler Markers */}
        <Circle cx="200" cy="160" r="6" fill="#D63031" /> {/* Striker */}
        <Circle cx="200" cy="240" r="6" fill="#3498DB" /> {/* Bowler */}

        {/* Dynamic Ball Path (Example) */}
        <Line x1="200" y1="240" x2="280" y2="80" stroke="#FFF" strokeWidth="3" />
        <Circle cx="280" cy="80" r="8" fill="#FFF" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
});