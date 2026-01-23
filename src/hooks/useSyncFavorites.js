// src/hooks/useSyncFavorites.js
import { useEffect } from 'react';
import { syncPendingFavoritesIfAny } from '../services/userService';

/**
 * useSyncFavorites
 * - Attempts to sync any locally-stored pending favorites on app boot.
 * - Also listens for network online events using @react-native-community/netinfo if available.
 * - Safe: if NetInfo is not installed, it will not crash and will just run a one-off sync on boot.
 */

export default function useSyncFavorites() {
  useEffect(() => {
    let unsub = null;

    // Always try a one-time sync on boot
    syncPendingFavoritesIfAny().catch(() => { /* ignore */ });

    // Try to add an online listener if NetInfo is available
    try {
      // require() used so bundler won't throw if package is absent
      // (dynamic require still needs the package present at runtime if used,
      // but wrapping in try/catch prevents startup crash)
      // Note: if you installed via Expo use `expo install @react-native-community/netinfo`
      // then require will succeed.
      // eslint-disable-next-line global-require
      const NetInfo = require('@react-native-community/netinfo');

      if (NetInfo && typeof NetInfo.addEventListener === 'function') {
        unsub = NetInfo.addEventListener((state) => {
          if (state && state.isConnected) {
            syncPendingFavoritesIfAny().catch(() => { /* ignore */ });
          }
        });
      }
    } catch (e) {
      // NetInfo not installed — that's fine, we already ran a one-time sync on boot.
      // console.debug('[useSyncFavorites] NetInfo not available, skipping connectivity listener');
    }

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);
}