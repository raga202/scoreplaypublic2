import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';

export default function WagonWheel() {
  // Animation value for player dots
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Svg width="300" height="300" viewBox="0 0 300 300">
        {/* Ground Outfield Boundary */}
        <Circle cx="150" cy="150" r="140" fill="#2d3436" stroke="#444" strokeWidth="2" />
        
        {/* 30-Yard Circle */}
        <Circle cx="150" cy="150" r="85" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="5,5" />
        
        {/* Pitch Area */}
        <Line x1="150" y1="130" x2="150" y2="170" stroke="#A4D146" strokeWidth="12" strokeLinecap="round" />

        {/* Animated Player Dots (Wagon Wheel Lines) */}
        <G opacity={fadeAnim}>
          <Line x1="150" y1="150" x2="250" y2="80" stroke="#A4D146" strokeWidth="2" strokeDasharray="2,2" />
          <Circle cx="250" cy="80" r="4" fill="#A4D146" />
          
          <Line x1="150" y1="150" x2="60" y2="100" stroke="#3498db" strokeWidth="2" strokeDasharray="2,2" />
          <Circle cx="60" cy="100" r="4" fill="#3498db" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 }
});