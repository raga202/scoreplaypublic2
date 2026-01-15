import 'react-native-gesture-handler';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View, ActivityIndicator, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthProvider, AuthContext } from './src/context/authcontext';
import { PointsProvider } from './src/context/pointscontext';
import AuthStack from './src/navigation/authstack';
import TabNavigator from './src/navigation/tabnavigator';

import MainHeader from './src/components/mainheader';
import ProfileScreen from './src/screens/profilescreen';
import SearchScreen from './src/screens/searchscreen';

const { width, height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

function RootNavigator() {
  const { isLoading, userToken } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Animation value for the "Genie" Effect
  const genieAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(genieAnim, {
      toValue: isProfileOpen ? 1 : 0,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1), 
      useNativeDriver: true,
    }).start();
  }, [isProfileOpen]);

  // Interpolations to move and scale toward the top-right icon
  const scale = genieAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, 1],
  });

  const translateX = genieAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width / 2 - 40, 0], 
  });

  const translateY = genieAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 2 + 50, 0], 
  });

  const opacity = genieAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4D146" />
      </View>
    );
  }

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#111" translucent={false} />
      
      {userToken == null ? (
        <AuthStack />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Drawer.Navigator
            initialRouteName="MainTabs"
            screenOptions={({ navigation }) => ({
              header: () => (
                <MainHeader 
                  navigation={navigation} 
                  isProfileOpen={isProfileOpen} 
                  toggleProfile={toggleProfile} 
                />
              ),
              drawerStyle: { backgroundColor: '#111', width: 280 },
              drawerActiveTintColor: '#A4D146',
              drawerInactiveTintColor: '#FFF',
              headerShown: true
            })}
          >
            <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen 
              name="Search" 
              component={SearchScreen} 
              options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} 
            />
          </Drawer.Navigator>

          {/* Genie Animated Profile Overlay */}
          <Animated.View 
            pointerEvents={isProfileOpen ? 'auto' : 'none'}
            style={[
              styles.profileOverlay, 
              { 
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { scale }
                ] 
              }
            ]}
          >
            <ProfileScreen toggleProfile={toggleProfile} />
          </Animated.View>
        </View>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AuthProvider>
        <PointsProvider>
          <RootNavigator />
        </PointsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  profileOverlay: {
    position: 'absolute',
    top: 75, 
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  }
});