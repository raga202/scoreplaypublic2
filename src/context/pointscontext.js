import React, { createContext, useState } from 'react';

// 1. Create the Context (Named Export)
export const PointsContext = createContext();

// 2. Create the Provider (Named Export)
// If you miss the word 'export' here, App.js will crash!
export const PointsProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000); 

  const addPoints = (amount) => {
    setBalance(prev => prev + amount);
  };

  const spendPoints = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    } else {
      return false;
    }
  };

  return (
    <PointsContext.Provider value={{ balance, addPoints, spendPoints }}>
      {children}
    </PointsContext.Provider>
  );
};