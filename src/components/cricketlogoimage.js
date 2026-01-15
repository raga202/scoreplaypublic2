import React from 'react';
import { Image, View } from 'react-native';

export default function CricketLogo({ size = 150 }) {
  return (
    <View style={{ width: size, height: size }}>
      <Image 
        // Save your logo image as logo.png in your assets folder
        source={require('../../assets/logo.png')} 
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </View>
  );
}