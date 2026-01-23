import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import homescreen from '../screens/homescreen';
import livestack from './livestack';
import newscreen from '../screens/newsscreen';
import predictgame from '../screens/predictgame'; // center action
import shortsscreen from '../screens/shortsscreen';

const Tab = createBottomTabNavigator();

// Small bulge-style center button: subtle rise and smaller size
const ScoreplayTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.middleButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.middleButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  // Compute tab bar height including bottom inset
  const TAB_BAR_HEIGHT = 64;
  const tabBarHeightWithInset = TAB_BAR_HEIGHT + (insets.bottom || (Platform.OS === 'android' ? 8 : 0));

  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: [{ ...styles.tabBar, height: tabBarHeightWithInset, paddingBottom: insets.bottom || (Platform.OS === 'android' ? 8 : 0) }],
        tabBarActiveTintColor: '#A4D146',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      })}
    >
      <Tab.Screen name="Home" component={homescreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />

      <Tab.Screen name="Live" component={livestack} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }} />

      <Tab.Screen
        name="Scoreplay"
        component={predictgame}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => <Ionicons name="sparkles" size={18} color={focused ? "#000" : "#FFF"} />,
          tabBarButton: (props) => <ScoreplayTabBarButton {...props} />
        }}
      />

      <Tab.Screen name="News" component={newscreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} /> }} />

      <Tab.Screen name="Shorts" component={shortsscreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  middleButtonContainer: {
    top: -8, // very small bulge
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleButton: {
    width: 40, // smaller
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A4D146',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});