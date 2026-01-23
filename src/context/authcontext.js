
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const STORAGE_KEY_USER = '@scoreplay:user';
const STORAGE_KEY_TOKEN = '@scoreplay:token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // bootstrap: load any saved user/token
  useEffect(() => {
    let mounted = true;
    const bootstrapAsync = async () => {
      try {
        // Small delay helps visually on very fast devices so the splash is visible briefly
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_TOKEN),
          AsyncStorage.getItem(STORAGE_KEY_USER),
        ]);
        if (!mounted) return;
        if (storedToken) setUserToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Auth bootstrap failed', e);
      } finally {
        // Ensure we flip loading to false once bootstrap finishes
        if (mounted) setIsLoading(false);
      }
    };
    bootstrapAsync();
    return () => (mounted = false);
  }, []);

  // helper to persist user/token
  const persistSession = async (token, userObj) => {
    try {
      if (token) await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
      else await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
      if (userObj) await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userObj));
      else await AsyncStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.warn('Failed to persist session', e);
    }
  };

  // Simulated login - replace with real API call
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate network latency
      await new Promise((res) => setTimeout(res, 900));
      const token = 'token-' + Date.now();
      const userObj = {
        id: 'user-' + Date.now(),
        name: 'Demo User',
        email,
        favorites: { teams: [], players: [] },
        onboarding: { favoritesCompleted: false },
      };
      setUserToken(token);
      setUser(userObj);
      await persistSession(token, userObj);
      return { success: true, user: userObj };
    } catch (e) {
      console.warn('login error', e);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated signup - replace with real API call
  const signup = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      const token = 'token-' + Date.now();
      const userObj = {
        id: 'user-' + Date.now(),
        name: fullName,
        email,
        favorites: { teams: [], players: [] },
        onboarding: { favoritesCompleted: false },
      };
      setUserToken(token);
      setUser(userObj);
      await persistSession(token, userObj);
      return { success: true, user: userObj };
    } catch (e) {
      console.warn('signup error', e);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 400));
      setUserToken(null);
      setUser(null);
      await persistSession(null, null);
    } catch (e) {
      console.warn('logout failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose setUser to allow updates (e.g., after saving favorites)
  const updateUser = async (updatedUser) => {
    setUser(updatedUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to persist updated user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        userToken,
        setUserToken,
        user,
        setUser: updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};