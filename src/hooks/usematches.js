import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLiveScores } from '../services/cricketapi';

/**
 * Enhanced useMatches Hook
 * Synchronized with ScorePlay "Precision Analytics" Branding
 */
export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  const loadData = useCallback(async (isSilentUpdate = false) => {
    try {
      // Only show the primary loading state on initial load to maintain "ARENA" feel
      if (isFirstLoad.current && !isSilentUpdate) {
        setLoading(true);
      }
      setError(null);
      
      const data = await fetchLiveScores();
      
      // Robust array check: ensures FlatList never receives null
      if (data && Array.isArray(data)) {
        setMatches(data);
      } else {
        console.warn("API returned non-array data:", data);
        setMatches([]);
      }
      
      isFirstLoad.current = false;
    } catch (err) {
      console.error("ScorePlay Data Error:", err);
      setError("Unable to sync live scores.");
      // Keep existing matches on silent error, otherwise clear them
      if (!isSilentUpdate) setMatches([]); 
    } finally {
      setLoading(false); // Critical: ensures loading screen clears even on failure
    }
  }, []);

  useEffect(() => {
    // Initial fetch for "ARENA" experience
    loadData();

    // Background sync every 30 seconds to match live ticker speed
    const interval = setInterval(() => loadData(true), 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  return { 
    matches, 
    loading, 
    error, 
    refresh: () => loadData(false) 
  };
};