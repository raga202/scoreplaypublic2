// src/screens/splashscreen.js
// Black-only splash that shows your logo image (logo-black.png) and the ScorePlay wordmark below.
// Animation: fade/scale in the logo+wordmark, hold, then gently diminish (fade out + scale down)
// - Uses only static require() calls so Metro can bundle assets.
// - Place your transparent/appropriate logo at ./assets/logo-black.png
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
} from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const BLACK = '#111111';
const ACCENT = '#A4D146';

// Static require for the image you named
let LOGO_IMAGE = null;
try {
  LOGO_IMAGE = require('../../assets/logo-black.png');
} catch (e) {
  LOGO_IMAGE = null;
  // If asset missing we'll fall back to text-only rendering
}

export default function SplashScreen({ onAnimationFinish = () => {} }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    // Sequence:
    // 1) fade+scale in logo + text
    // 2) hold briefly
    // 3) diminish: fade out + slightly scale down
    const fadeInDuration = 600;
    const holdDuration = 380;
    const diminishDuration = 520;

    const fadeIn = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: fadeInDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1.02,
        duration: fadeInDuration,
        easing: Easing.out(Easing.back(0.9)),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: fadeInDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1.02,
        duration: fadeInDuration,
        easing: Easing.out(Easing.back(0.9)),
        useNativeDriver: true,
      }),
    ]);

    const diminish = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: diminishDuration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 0.92,
        duration: diminishDuration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: diminishDuration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 0.96,
        duration: diminishDuration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([
      Animated.delay(80),
      fadeIn,
      Animated.delay(holdDuration),
      diminish,
      Animated.delay(40),
    ]).start(() => {
      // allow tiny buffer for next screen to mount
      setTimeout(() => {
        try {
          onAnimationFinish();
        } catch (_) {
          // ignore
        }
      }, 40);
    });

    return () => {
      logoOpacity.stopAnimation();
      logoScale.stopAnimation();
      textOpacity.stopAnimation();
      textScale.stopAnimation();
    };
  }, [logoOpacity, logoScale, textOpacity, textScale, onAnimationFinish]);

  const logoStyle = {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
  };
  const textStyle = {
    opacity: textOpacity,
    transform: [{ scale: textScale }],
  };

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="light-content" backgroundColor={BLACK} />
      <View style={styles.center}>
        {LOGO_IMAGE ? (
          <Animated.Image
            source={LOGO_IMAGE}
            style={[styles.logoImage, logoStyle]}
            resizeMode="contain"
          />
        ) : (
          <Animated.View style={[{ alignItems: 'center' }, logoStyle]}>
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Animated.Text style={[styles.brandScore, { opacity: logoOpacity }]}>Score</Animated.Text>
              <Animated.Text style={[styles.brandPlay, { opacity: logoOpacity }]}>Play</Animated.Text>
            </Animated.View>
          </Animated.View>
        )}

        {/* Wordmark below using same visual style as your login screen:
            brandTitle: fontSize 48, fontWeight 900; brandPlay colored ACCENT.
            Adjust fontSize if it appears too large on small devices. */}
        <Animated.View style={[{ marginTop: 10, alignItems: 'center' }, textStyle]}>
          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkPrimary}>Score</Text>
            <Text style={styles.wordmarkAccent}>Play</Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoImage: {
    width: Math.min(360, Math.round(SCREEN_W * 0.72)),
    height: Math.min(140, Math.round(SCREEN_H * 0.18)),
    marginBottom: 8,
  },

  // fallback inline brand (if image missing)
  brandScore: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
  },
  brandPlay: {
    color: ACCENT,
    fontSize: 34,
    fontWeight: '900',
    marginLeft: 8,
  },

  // wordmark below (matches login screen font and color)
  wordmark: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 52,
  },
  wordmarkPrimary: {
    color: '#fff',
  },
  wordmarkAccent: {
    color: ACCENT,
  },
});