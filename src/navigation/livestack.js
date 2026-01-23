import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import livematchesscreen from '../screens/livematchesscreen';
import predictgame from '../screens/predictgame';
import matchdetail from '../screens/matchdetail';
import proview from '../screens/tabs/proview';

const Stack = createStackNavigator();

export default function LiveStack() {
  return (
    <Stack.Navigator initialRouteName="LiveMain" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveMain" component={livematchesscreen} />
      <Stack.Screen name="PredictGame" component={predictgame} />
      <Stack.Screen name="ProMode" component={proview} />
      <Stack.Screen name="MatchDetail" component={matchdetail} />
    </Stack.Navigator>
  );
}