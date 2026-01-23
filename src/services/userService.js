// src/services/userService.js
// User service with a mock API mode and AsyncStorage fallback.
// - When MOCK_API = true the service returns sample teams/players and simulates saveFavorites.
// - When MOCK_API = false it will attempt to call the real backend via apiFetch (if configured).
//
// The functions:
// - fetchTeams(): Promise<team[]>
// - fetchPlayers(): Promise<player[]>
// - saveFavorites(userId, payload): Promise<updatedUser>
// - syncPendingFavoritesIfAny(): Promise<boolean>

const MOCK_API = true; // set to false to use real API (and implement BASE_URL in src/services/api.js)
const STORAGE_KEY_FAVORITES_PENDING = '@scoreplay:pending_favorites';
const STORAGE_KEY_USER = '@scoreplay:user';

let AsyncStorage = null;
try {
  // eslint-disable-next-line global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // fallback in-memory store if AsyncStorage not available (non-persistent)
  // Useful for quick dev without installing native module.
  // Note: in-memory store will be cleared on app restart.
  const _mem = {};
  AsyncStorage = {
    getItem: async (k) => (_mem[k] === undefined ? null : _mem[k]),
    setItem: async (k, v) => {
      _mem[k] = v;
      return null;
    },
    removeItem: async (k) => {
      delete _mem[k];
      return null;
    },
  };
}

// If you have a real API, import apiFetch and set MOCK_API = false
let apiFetch = null;
if (!MOCK_API) {
  try {
    // eslint-disable-next-line global-require
    apiFetch = require('./api').apiFetch;
  } catch (e) {
    console.warn('[userService] apiFetch not found. Keep MOCK_API=true or add src/services/api.js');
    apiFetch = null;
  }
}

/* ---------------------------
   Sample mock data (teams & players)
   --------------------------- */
const SAMPLE_TEAMS = [
  { id: 'team-eng-1', name: 'England', short_code: 'ENG', logo_url: '' },
  { id: 'team-ind-1', name: 'India', short_code: 'IND', logo_url: '' },
  { id: 'team-aus-1', name: 'Australia', short_code: 'AUS', logo_url: '' },
  { id: 'team-sa-1', name: 'South Africa', short_code: 'SA', logo_url: '' },
  { id: 'team-nz-1', name: 'New Zealand', short_code: 'NZ', logo_url: '' },
  { id: 'team-pak-1', name: 'Pakistan', short_code: 'PAK', logo_url: '' },
  { id: 'team-sri-1', name: 'Sri Lanka', short_code: 'SL', logo_url: '' },
  { id: 'team-ban-1', name: 'Bangladesh', short_code: 'BAN', logo_url: '' },
  { id: 'team-wi-1', name: 'West Indies', short_code: 'WI', logo_url: '' },
  { id: 'team-afg-1', name: 'Afghanistan', short_code: 'AFG', logo_url: '' },
  { id: 'team-zim-1', name: 'Zimbabwe', short_code: 'ZIM', logo_url: '' },
  { id: 'team-ire-1', name: 'Ireland', short_code: 'IRE', logo_url: '' },
];

const SAMPLE_PLAYERS = [
  { id: 'player-001', name: 'Virat Kohli', short_name: 'Kohli', team_id: 'team-ind-1', avatar_url: '' },
  { id: 'player-002', name: 'Joe Root', short_name: 'Root', team_id: 'team-eng-1', avatar_url: '' },
  { id: 'player-003', name: 'Babar Azam', short_name: 'Babar', team_id: 'team-pak-1', avatar_url: '' },
  { id: 'player-004', name: 'Steve Smith', short_name: 'Smith', team_id: 'team-aus-1', avatar_url: '' },
  { id: 'player-005', name: 'Kane Williamson', short_name: 'Williamson', team_id: 'team-nz-1', avatar_url: '' },
  { id: 'player-006', name: 'Jasprit Bumrah', short_name: 'Bumrah', team_id: 'team-ind-1', avatar_url: '' },
  { id: 'player-007', name: 'Rohit Sharma', short_name: 'Rohit', team_id: 'team-ind-1', avatar_url: '' },
  { id: 'player-008', name: 'AB de Villiers', short_name: 'AB', team_id: 'team-sa-1', avatar_url: '' },
  { id: 'player-009', name: 'Shakib Al Hasan', short_name: 'Shakib', team_id: 'team-ban-1', avatar_url: '' },
  { id: 'player-010', name: 'Trent Boult', short_name: 'Boult', team_id: 'team-nz-1', avatar_url: '' },
  { id: 'player-011', name: 'Rashid Khan', short_name: 'Rashid', team_id: 'team-afg-1', avatar_url: '' },
  { id: 'player-012', name: 'Ben Stokes', short_name: 'Stokes', team_id: 'team-eng-1', avatar_url: '' },
];

/* ---------------------------
   Exposed functions
   --------------------------- */

/**
 * fetchTeams
 * Returns an array of team objects.
 */
export async function fetchTeams() {
  if (MOCK_API) {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 260));
    return SAMPLE_TEAMS;
  }

  if (!apiFetch) return [];
  try {
    const res = await apiFetch('/catalog/teams?popular=true&limit=200');
    if (res && res.ok && Array.isArray(res.data)) return res.data;
  } catch (e) {
    console.warn('[userService] fetchTeams error', e);
  }
  return [];
}

/**
 * fetchPlayers
 * Returns an array of player objects.
 */
export async function fetchPlayers() {
  if (MOCK_API) {
    await new Promise((r) => setTimeout(r, 320));
    return SAMPLE_PLAYERS;
  }

  if (!apiFetch) return [];
  try {
    const res = await apiFetch('/catalog/players?popular=true&limit=500');
    if (res && res.ok && Array.isArray(res.data)) return res.data;
  } catch (e) {
    console.warn('[userService] fetchPlayers error', e);
  }
  return [];
}

/**
 * saveFavorites
 * Attempts to POST favorites to backend. If backend unavailable, stores pending favorites locally.
 * Returns an "updatedUser" object (for optimistic update) with favorites and onboarding flag set.
 *
 * payload: { teams: [teamId], players: [playerId] }
 */
export async function saveFavorites(userId, payload) {
  // basic validation & dedupe
  const teams = Array.from(new Set((payload.teams || []).slice(0, 10))); // enforce max 10
  const players = Array.from(new Set((payload.players || []).slice(0, 10))); // enforce max 10
  const finalPayload = { teams, players };

  if (MOCK_API) {
    // persist into AsyncStorage user object if present
    try {
      const rawUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
      let userObj = rawUser ? JSON.parse(rawUser) : null;
      if (!userObj) {
        // create a minimal user object
        userObj = { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
      } else {
        userObj = { ...userObj, favorites: finalPayload, onboarding: { ...(userObj.onboarding || {}), favoritesCompleted: true } };
      }
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userObj));
      // remove any pending
      await AsyncStorage.removeItem(STORAGE_KEY_FAVORITES_PENDING);
      // simulate network latency
      await new Promise((r) => setTimeout(r, 450));
      return userObj;
    } catch (e) {
      console.warn('[userService] saveFavorites (mock) failed to persist', e);
      // still return optimistic object
      return { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
    }
  }

  // Real API flow
  if (!apiFetch) {
    // no API available - store pending locally
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES_PENDING, JSON.stringify({ userId, payload: finalPayload, ts: Date.now() }));
    } catch (e) {
      console.warn('[userService] failed to persist pending favorites', e);
    }
    return { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
  }

  try {
    const res = await apiFetch(`/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify(finalPayload),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res && res.ok) {
      // clear any pending record
      await AsyncStorage.removeItem(STORAGE_KEY_FAVORITES_PENDING);
      // if backend returns updated user, return it; otherwise construct
      if (res.data && res.data.id) return res.data;
      return { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
    }
    // non-ok response -> store locally
    await AsyncStorage.setItem(STORAGE_KEY_FAVORITES_PENDING, JSON.stringify({ userId, payload: finalPayload, ts: Date.now() }));
    return { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
  } catch (e) {
    console.warn('[userService] saveFavorites error', e);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES_PENDING, JSON.stringify({ userId, payload: finalPayload, ts: Date.now() }));
    } catch (e2) {
      console.warn('[userService] persist pending failed', e2);
    }
    return { id: userId || `user-${Date.now()}`, favorites: finalPayload, onboarding: { favoritesCompleted: true } };
  }
}

/**
 * syncPendingFavoritesIfAny
 * Called on boot or when network is available. Tries to POST any locally stored pending favorites.
 */
export async function syncPendingFavoritesIfAny() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES_PENDING);
    if (!raw) return false;
    if (MOCK_API) {
      // In mock mode we simply clear it because saveFavorites already persisted into user storage
      await AsyncStorage.removeItem(STORAGE_KEY_FAVORITES_PENDING);
      return true;
    }
    if (!apiFetch) return false;
    const { userId, payload } = JSON.parse(raw);
    const res = await apiFetch(`/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res && res.ok) {
      await AsyncStorage.removeItem(STORAGE_KEY_FAVORITES_PENDING);
      return true;
    }
  } catch (e) {
    console.warn('[userService] syncPendingFavoritesIfAny error', e);
  }
  return false;
}

export default {
  fetchTeams,
  fetchPlayers,
  saveFavorites,
  syncPendingFavoritesIfAny,
};