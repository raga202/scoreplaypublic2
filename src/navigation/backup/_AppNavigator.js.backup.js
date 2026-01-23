// src/navigation/AppNavigator.js
// App navigator that registers all menu/screens so MainHeader navigation works.
// Make sure you have installed react-navigation dependencies:
//   npm install @react-navigation/native @react-navigation/native-stack
//   expo install react-native-screens react-native-safe-area-context
//
// This file uses the navigationRef from src/navigation/RootNavigation so MainHeader can
// navigate reliably via the root ref as a fallback.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from './RootNavigation'; // src/navigation/RootNavigation.js
import MainHeader from '../components/mainheader';

// Core screens (your existing files)
import PersonalHome from '../screens/personalhomescreen';
import LiveMatches from '../screens/livematchesscreen';
import News from '../screens/newsscreen';
import Profile from '../screens/profilescreen';

// Menu screens (placed in src/screens/menu/)
import Fixtures from '../screens/menu/fixturescreen';
import Results from '../screens/menu/resultscreen';
import Highlights from '../screens/menu/highlightsscreen';
import Stats from '../screens/menu/statsscreen';
import Tournaments from '../screens/menu/tournamentsscreen';
import MyTeams from '../screens/menu/myteamsscreen';
import Predictions from '../screens/menu/predictionsscreen';
import Leaderboards from '../screens/menu/leaderboardscreen';
import Settings from '../screens/menu/settingsscreen';
import Privacy from '../screens/menu/privacyscreen';
import Help from '../screens/menu/helpscreen';
import Feedback from '../screens/menu/feedbackscreen';
import About from '../screens/menu/aboutscreen';

// Onboarding entry (My Players)
import OnboardingEntry from '../screens/onboarding';

// Optional utility screens — create these if you don't already have them.
import Notifications from '../screens/notificationscreen';
import Search from '../screens/searchscreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="PersonalHome"
        screenOptions={{
          // Use MainHeader as the header for every screen so the menu is available everywhere.
          header: ({ navigation, route, options, back }) => <MainHeader navigation={navigation} />,
          // App global background
          contentStyle: { backgroundColor: '#000' },
        }}
      >
        {/* Core app screens */}
        <Stack.Screen name="PersonalHome" component={PersonalHome} />
        <Stack.Screen name="LiveMatches" component={LiveMatches} />
        <Stack.Screen name="News" component={News} />
        <Stack.Screen name="Profile" component={Profile} />

        {/* Menu / Discover / My Stuff */}
        <Stack.Screen name="Fixtures" component={Fixtures} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="Highlights" component={Highlights} />
        <Stack.Screen name="Stats" component={Stats} />
        <Stack.Screen name="Tournaments" component={Tournaments} />

        <Stack.Screen name="MyTeams" component={MyTeams} />
        <Stack.Screen name="Onboarding" component={OnboardingEntry} />
        <Stack.Screen name="Predictions" component={Predictions} />
        <Stack.Screen name="Leaderboards" component={Leaderboards} />

        {/* More */}
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="About" component={About} />

        {/* Utility screens (Notifications, Search) */}
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}