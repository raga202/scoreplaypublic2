import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  // Start as true to show the splash/loading state initially
  const [isLoading, setIsLoading] = useState(true);

  // Initial Check: This resolves the "stuck loading" issue
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Simulate checking for a saved session
        setTimeout(() => {
          setIsLoading(false); // Transitions the app to the Login screen
        }, 1500);
      } catch (e) {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const login = (email, password) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setUserToken('dummy-token');
        setIsLoading(false);
        resolve(true); 
      }, 1000);
    });
  };

  const signup = (fullName, email, password) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setUserToken('dummy-token');
        setIsLoading(false);
        resolve(true); 
      }, 1000);
    });
  };

  const logout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUserToken(null);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ login, signup, logout, userToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};