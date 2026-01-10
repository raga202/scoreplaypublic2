import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/colors';

// Import all your screens here
import MoreScreen from '../screens/morescreen';
import PlayerScreen from '../screens/playerscreen';
import MatchDetailScreen from '../screens/matchdetail'; 
// import ProMode from '../screens/promode'; // Uncomment this once you create the file

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#222' },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1 },
        headerBackTitleVisible: false, // Hides the "Back" text on iOS for a cleaner look
      }}
    >
      {/* The Main Menu */}
      <Stack.Screen 
        name="MoreMenu" 
        component={MoreScreen} 
        options={{ title: 'MENU' }} 
      />

      {/* The Sub Pages */}
      <Stack.Screen 
        name="Players" 
        component={PlayerScreen} 
        options={{ title: 'PLAYER STATS' }} 
      />

      <Stack.Screen 
        name="MatchDetail" 
        component={MatchDetailScreen} 
        options={{ title: 'MATCH CENTRE' }} 
      />

      {/* <Stack.Screen 
        name="ProMode" 
        component={ProMode} 
        options={{ title: 'PRO SIMULATION' }} 
      /> 
      */}
      
    </Stack.Navigator>
  );
}