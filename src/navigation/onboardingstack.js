// src/navigation/onboardingstack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamSelectionScreen from '../screens/onboarding/TeamSelectionScreen';
import PlayerSelectionScreen from '../screens/onboarding/PlayerSelectionScreen';

const Stack = createStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} />
      <Stack.Screen name="PlayerSelection" component={PlayerSelectionScreen} />
    </Stack.Navigator>
  );
}