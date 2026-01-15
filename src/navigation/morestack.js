import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/colors';

// Screens
import MoreScreen from '../screens/morescreen';
import PlayerScreen from '../screens/playerscreen';
import MatchDetailScreen from '../screens/matchdetail';
import RewardsScreen from '../screens/rewardsscreen';
import PredictGame from '../screens/predictgame'; // Ensure this file exists!

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: '#222' },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'MENU' }} />
      <Stack.Screen name="Players" component={PlayerScreen} options={{ title: 'PLAYER STATS' }} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'REDEEM POINTS' }} />
      
      {/* If PredictGame is undefined (file missing), this line causes a crash */}
      <Stack.Screen name="PredictGame" component={PredictGame} options={{ title: 'PREDICTION ZONE' }} />

    </Stack.Navigator>
  );
}