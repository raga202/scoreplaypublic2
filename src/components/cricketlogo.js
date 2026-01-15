import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

export default function CricketLogo({ size = 150 }) {
  const charcoal = "#2C3E50"; 
  const limeGreen = "#A4D146"; 
  const skyBlue = "#3498DB";

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      {/* 1. Cricket Ball - High Definition Seams */}
      <G transform="translate(420, 370)">
        <Circle r="125" fill={charcoal} />
        {/* Triple-line seam for better detail */}
        <Path 
          d="M-90 -45 Q 0 -75 90 -45 M-90 0 Q 0 -30 90 0 M-90 45 Q 0 15 95 45" 
          stroke={skyBlue} 
          strokeWidth="16" 
          fill="none" 
        />
      </G>

      {/* 2. Central 'S' Path - Thicker for visual weight */}
      <Path 
        d="M480 480 C 820 480, 820 820, 480 820 C 310 820, 240 730, 190 620" 
        stroke={charcoal} 
        strokeWidth="105" 
        fill="none" 
        strokeLinecap="round" 
      />

      {/* 3. Refined Motion Trails - Separated to avoid blurring */}
      <G>
        <Path d="M170 580 Q 240 780 450 810" stroke={skyBlue} strokeWidth="30" fill="none" strokeLinecap="round" />
        <Path d="M120 540 Q 180 710 350 750" stroke={skyBlue} strokeWidth="24" fill="none" strokeLinecap="round" />
      </G>

      {/* 4. Wicket/Stumps - Scaled up for clarity at small sizes */}
      <G transform="translate(690, 380) rotate(12)">
        <Rect x="-65" y="0" width="45" height="220" rx="14" fill={charcoal} />
        <Rect x="0" y="0" width="45" height="220" rx="14" fill={charcoal} />
        <Rect x="65" y="0" width="45" height="220" rx="14" fill={charcoal} />
        {/* High-visibility Bails */}
        <Rect x="-75" y="-35" width="80" height="38" rx="8" fill={limeGreen} />
        <Rect x="45" y="-35" width="80" height="38" rx="8" fill={limeGreen} />
      </G>
    </Svg>
  );
}