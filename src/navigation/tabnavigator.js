import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/homescreen';
import LiveMatchesScreen from '../screens/LiveMatchesScreen'; 
import PredictGame from '../screens/predictgame';
import MoreStack from './morestack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { 
          backgroundColor: '#111', 
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom,
          borderTopColor: '#222'
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}/> }} />
      <Tab.Screen name="Live" component={LiveMatchesScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="trophy" size={24} color={color}/> }} />
      <Tab.Screen name="Predict" component={PredictGame} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="game-controller" size={24} color={color}/> }} />
      <Tab.Screen name="More" component={MoreStack} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="menu" size={24} color={color}/> }} />
    </Tab.Navigator>
  );
}