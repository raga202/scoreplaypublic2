// App.js
import 'react-native-gesture-handler';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as NavigationBar from 'expo-navigation-bar';

import { AuthProvider, AuthContext } from './src/context/authcontext';
import { PointsProvider } from './src/context/pointscontext';
import useSyncFavorites from './src/hooks/useSyncFavorites';
import AuthStack from './src/navigation/authstack';
import OnboardingStack from './src/navigation/onboardingstack';
import TabNavigator from './src/navigation/tabnavigator';

import SplashScreen from './src/screens/splashscreen';
import MainHeader from './src/components/mainheader';
import ProfileScreen from './src/screens/profilescreen';
import SearchScreen from './src/screens/searchscreen';

const { width, height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// Minimum additional time (ms) to keep splash visible after its animation callback
const MIN_SPLASH_AFTER_ANIM_MS = 700;
// Maximum total wait (ms) for auth bootstrap before we force-show the app (dev safety)
const MAX_SPLASH_WAIT = 8000;

function RootNavigatorContent() {
  // Use auth context to decide what to show (auth, onboarding, or app)
  const { isLoading, userToken, user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ensures we don't immediately dismiss the splash if the animation is very short
  const [animationDone, setAnimationDone] = useState(false);
  const splashFinishedAtRef = useRef(0);

  // If auth bootstrap takes too long, this timer will allow the app to continue
  const [splashTimeoutExpired, setSplashTimeoutExpired] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setSplashTimeoutExpired(true);
      // eslint-disable-next-line no-console
      console.warn(`[RootNavigator] splash timeout expired after ${MAX_SPLASH_WAIT}ms — proceeding (dev only).`);
    }, MAX_SPLASH_WAIT);
    return () => clearTimeout(t);
  }, []);

  // Run background sync for pending favorites (keeps existing behavior)
  useSyncFavorites();

  // Genie animation for profile overlay (unchanged)
  const genieAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(genieAnim, {
      toValue: isProfileOpen ? 1 : 0,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isProfileOpen, genieAnim]);

  const scale = genieAnim.interpolate({ inputRange: [0, 1], outputRange: [0.01, 1] });
  const translateX = genieAnim.interpolate({ inputRange: [0, 1], outputRange: [width / 2 - 40, 0] });
  const translateY = genieAnim.interpolate({ inputRange: [0, 1], outputRange: [-height / 2 + 50, 0] });
  const opacity = genieAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] });

  // SplashScreen completion handler: record timestamp and ensure we wait a minimum extra time
  const onSplashAnimationFinish = () => {
    splashFinishedAtRef.current = Date.now();
    // keep splash visible at least MIN_SPLASH_AFTER_ANIM_MS more
    setTimeout(() => setAnimationDone(true), MIN_SPLASH_AFTER_ANIM_MS);
  };

  // Keep showing splash until both animation finished (plus minimum delay) and auth bootstrap done
  // If splashTimeoutExpired becomes true (MAX_SPLASH_WAIT passed) we will proceed even if isLoading is still true,
  // so you can see the AuthStack and inspect logs. This is a developer safety only.
  if ((!animationDone || isLoading) && !splashTimeoutExpired) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <SplashScreen onAnimationFinish={onSplashAnimationFinish} />
      </>
    );
  }

  // debug: log auth state so you can inspect why app jumps to Home (remove in production)
  // Typical reason you see Home immediately is a stored token in AsyncStorage (persisted login).
  // To test the login flow, clear token/user from AsyncStorage (instructions below).
  // eslint-disable-next-line no-console
  console.log('[RootNavigator] auth', { isLoading, userToken: !!userToken, userName: user?.name || null, splashTimeoutExpired });

  const toggleProfile = () => setIsProfileOpen((s) => !s);

  // If not authenticated, show AuthStack (login / register)
  if (!userToken) {
    return <AuthStack />;
  }

  // If authenticated but onboarding favorites not completed, show Onboarding stack
  if (user && !user.onboarding?.favoritesCompleted) {
    return <OnboardingStack />;
  }

  // Otherwise show main app drawer
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Drawer.Navigator
        initialRouteName="MainTabs"
        screenOptions={({ navigation }) => ({
          header: () => <MainHeader navigation={navigation} isProfileOpen={isProfileOpen} toggleProfile={toggleProfile} />,
          drawerStyle: { backgroundColor: '#111', width: 280 },
          drawerActiveTintColor: '#A4D146',
          drawerInactiveTintColor: '#FFF',
          headerShown: true,
        })}
      >
        <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="Search" component={SearchScreen} options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      </Drawer.Navigator>

      <Animated.View pointerEvents={isProfileOpen ? 'auto' : 'none'} style={[styles.profileOverlay, { opacity, transform: [{ translateX }, { translateY }, { scale }] }]}>
        <ProfileScreen toggleProfile={toggleProfile} />
      </Animated.View>
    </View>
  );
}

export default function App() {
  // Set Android navigation bar color and button style (Expo)
  useEffect(() => {
    // prefer fully black nav bar to match app
    NavigationBar.setBackgroundColorAsync('#000').catch((e) => console.warn('NavigationBar.setBackgroundColorAsync failed', e));
    NavigationBar.setButtonStyleAsync('light').catch((e) => console.warn('NavigationBar.setButtonStyleAsync failed', e));
  }, []);

  // SafeAreaProvider styling ensures the system background won't flash white during startup
  return (
    <SafeAreaProvider style={{ backgroundColor: '#111' }}>
      <AuthProvider>
        <PointsProvider>
          <NavigationContainer>
            <RootNavigatorContent />
          </NavigationContainer>
        </PointsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  profileOverlay: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
});