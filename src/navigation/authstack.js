import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/loginscreen';
import RegisterScreen from '../screens/auth/registerscreen';
import TabNavigator from './tabnavigator'; // Ensure this points to your lowercase tabnavigator.js

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* FIX: Registered 'MainTabs' to prevent "NAVIGATE" errors. 
          This allows the navigation to resolve while the global auth state 
          switches the app to the Drawer Navigator.
      */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}