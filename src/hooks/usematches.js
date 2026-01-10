// src/hooks/usematches.js
import { useState, useEffect } from 'react';
import { fetchLiveScores } from '../services/cricketapi';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLiveScores();
    setMatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return { matches, loading, refresh: loadData };
};