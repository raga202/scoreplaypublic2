import React from 'react';
import Svg, { Path, Rect, G } from 'react-native-svg';

export default function ScoreLogo({ size = 100 }) {
  const charcoal = "#2C3E50"; //
  const limeGreen = "#A4D146"; //

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      {/* 1. Outer Rounded Square Frame */}
      <Rect 
        x="180" y="180" width="664" height="664" 
        rx="100" 
        stroke={charcoal} 
        strokeWidth="65" 
        fill="none" 
      />
      
      {/* 2. Central Geometric 'S' Path */}
      <Path 
        d="M400 380 C 350 380, 350 480, 512 512 C 674 544, 674 644, 624 644" 
        stroke={charcoal} 
        strokeWidth="75" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* 3. Lime Green Dynamic Slash & Arrowhead */}
      <G>
        <Path 
          d="M600 220 L 424 804" 
          stroke={limeGreen} 
          strokeWidth="50" 
          strokeLinecap="round" 
        />
        <Path 
          d="M440 520 L 512 470 L 512 570 Z" 
          fill={limeGreen} 
        />
      </G>
    </Svg>
  );
}