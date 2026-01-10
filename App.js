import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 1. IMPORT THE NEW CONTEXT FILE
import { AuthContext } from './src/context/authcontext'; 

import TabNavigator from './src/navigation/tabnavigator';
import AuthStack from './src/navigation/authstack';

export default function App() {
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(() => ({
    signIn: () => setUserToken('valid-token'), // Grants access
    signOut: () => setUserToken(null),         // Revokes access
    signUp: () => setUserToken('valid-token'),
  }), []);

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {userToken ? <TabNavigator /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}