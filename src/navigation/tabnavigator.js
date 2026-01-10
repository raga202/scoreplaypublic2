import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homescreen';
import MoreStack from './morestack';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.background, borderTopColor: '#333' },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Live" component={HomeScreen} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}