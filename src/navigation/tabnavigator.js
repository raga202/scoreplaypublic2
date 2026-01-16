import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/homescreen';
import NewsScreen from '../screens/newsscreen';
import PredictGame from '../screens/predictgame'; 
import ProView from '../screens/tabs/proview'; // Corrected path
import ShortsScreen from '../screens/shortsscreen';

const Tab = createBottomTabNavigator();

const ScoreplayTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.middleButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.middleButton}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoS}>S</Text>
        <Text style={styles.logoP}>P</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            height: 65 + insets.bottom, 
            paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 5 
          }
        ],
        tabBarActiveTintColor: '#A4D146',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="newspaper-outline" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Scoreplay" 
        component={PredictGame} 
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <ScoreplayTabBarButton {...props} />
        }}
      />
      <Tab.Screen 
        name="Pro" 
        component={ProView} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="flash-outline" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Shorts" 
        component={ShortsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="play-circle-outline" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    position: 'absolute',
    elevation: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middleButtonContainer: { top: -25, justifyContent: 'center', alignItems: 'center' },
  middleButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#A4D146',
    elevation: 10,
    shadowColor: '#A4D146',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: { flexDirection: 'row', alignItems: 'center' },
  logoS: { color: '#000', fontSize: 24, fontWeight: '900' },
  logoP: { color: '#FFF', fontSize: 24, fontWeight: '900', marginLeft: -2 }
});