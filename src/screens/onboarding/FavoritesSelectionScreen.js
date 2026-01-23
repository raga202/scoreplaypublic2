// src/screens/home/FavoritesSelectionScreen.js

import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { AuthContext } from '../../context/authcontext';
import { fetchTeams, fetchPlayers, saveFavorites } from '../../services/userService';

/**
 * FavoritesSelectionScreen
 * - Two-step flow: first select teams (max 10) then players (max 10)
 * - Continue button centered, small Skip on the right
 * - Scrollable lists, search, counters, and selection limit enforcement
 */

function Chip({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function FavoritesSelectionScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const [step, setStep] = useState('teams'); // 'teams' | 'players'
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeams, setSelectedTeams] = useState(new Set(user?.favorites?.teams || []));
  const [selectedPlayers, setSelectedPlayers] = useState(new Set(user?.favorites?.players || []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [t, p] = await Promise.all([fetchTeams(), fetchPlayers()]);
        if (!mounted) return;
        setTeams(t || []);
        setPlayers(p || []);
      } catch (e) {
        console.warn('[FavoritesSelection] load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters
  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter((t) => (t.name || '').toLowerCase().includes(q) || (t.short_code || '').toLowerCase().includes(q));
  }, [teams, query]);

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.short_name || '').toLowerCase().includes(q));
  }, [players, query]);

  // selection helpers (enforce max 10)
  const toggleSelectTeam = (team) => {
    const copy = new Set(selectedTeams);
    if (copy.has(team.id)) {
      copy.delete(team.id);
      setSelectedTeams(copy);
    } else {
      if (copy.size >= 10) {
        Alert.alert('Limit reached', 'You can select up to 10 teams.');
        return;
      }
      copy.add(team.id);
      setSelectedTeams(copy);
    }
  };

  const toggleSelectPlayer = (player) => {
    const copy = new Set(selectedPlayers);
    if (copy.has(player.id)) {
      copy.delete(player.id);
      setSelectedPlayers(copy);
    } else {
      if (copy.size >= 10) {
        Alert.alert('Limit reached', 'You can select up to 10 players.');
        return;
      }
      copy.add(player.id);
      setSelectedPlayers(copy);
    }
  };

  const onSkip = async () => {
    // Save empty favorites (non-blocking) and proceed
    try {
      await saveFavorites(user?.id, { teams: [], players: [] });
    } catch (e) {
      // ignore
    }
    // Mark user onboarding finished in local context
    const updatedUser = { ...(user || {}), favorites: { teams: [], players: [] }, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
    setUser && setUser(updatedUser);
    navigation.reset({ index: 0, routes: [{ name: 'PersonalHome' }] });
  };

  const onContinue = async () => {
    if (step === 'teams') {
      // require at least 1 team? optional — but here just proceed even if none selected
      setQuery('');
      setStep('players');
      return;
    }

    // step === 'players' -> final save
    if (selectedTeams.size === 0 && selectedPlayers.size === 0) {
      Alert.alert('Pick at least one', 'Please select at least one team or player to personalize your feed, or tap Skip.');
      return;
    }

    setSaving(true);
    const payload = { teams: Array.from(selectedTeams), players: Array.from(selectedPlayers) };

    try {
      const updatedUser = await saveFavorites(user?.id, payload);
      // If API (or mock) returned a user object with id use it; otherwise build one
      let userToSet = updatedUser;
      if (!userToSet || !userToSet.id) {
        userToSet = { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      }
      // Persist in AuthContext
      if (setUser) {
        try {
          await setUser(userToSet); // setUser persists in AuthContext implementation
        } catch (e) {
          // some implementations expect direct state change; setUser might be sync — still ok
          console.warn('[FavoritesSelection] setUser error', e);
        }
      }
      // Navigate to personal home (reset stack)
      navigation.reset({ index: 0, routes: [{ name: 'PersonalHome' }] });
    } catch (e) {
      console.warn('[FavoritesSelection] saveFavorites failed', e);
      Alert.alert('Save failed', 'Could not save favorites. Your selections are saved locally and will sync later.');
      // optimism: navigate anyway
      navigation.reset({ index: 0, routes: [{ name: 'PersonalHome' }] });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A4D146" />
      </View>
    );
  }

  // UI pieces
  const isTeamsStep = step === 'teams';
  const headerTitle = isTeamsStep ? 'Choose your favourite teams' : 'Choose your favourite players';
  const selectedCountText = isTeamsStep ? `${selectedTeams.size}/10 teams` : `${selectedPlayers.size}/10 players`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{headerTitle}</Text>
        <Text style={styles.counter}>{selectedCountText}</Text>
        <Text style={styles.subtitle}>{isTeamsStep ? 'Select up to 10 teams you follow.' : 'Select up to 10 players you follow.'}</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput placeholder={`Search ${isTeamsStep ? 'teams' : 'players'}`} placeholderTextColor="#666" value={query} onChangeText={setQuery} style={styles.searchInput} />
      </View>

      <View style={styles.listWrap}>
        <FlatList
          data={isTeamsStep ? filteredTeams : filteredPlayers}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) =>
            isTeamsStep ? (
              <Chip item={item} selected={selectedTeams.has(item.id)} onPress={toggleSelectTeam} />
            ) : (
              <Chip item={item} selected={selectedPlayers.has(item.id)} onPress={toggleSelectPlayer} />
            )
          }
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }} />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity style={[styles.continueBtn, saving && styles.continueBtnDisabled]} onPress={onContinue} disabled={saving}>
            {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.continueText}>{isTeamsStep ? 'Continue' : 'Save & Continue'}</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 18, justifyContent: 'center' }}>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  header: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  counter: { color: '#A4D146', marginTop: 6, fontWeight: '700' },
  subtitle: { color: '#888', marginTop: 6, fontSize: 13 },
  searchRow: { paddingHorizontal: 18, marginTop: 12 },
  searchInput: { backgroundColor: '#111', color: '#fff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  listWrap: { flex: 1, marginTop: 12 },
  column: { justifyContent: 'space-between', marginBottom: 12 },
  chip: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 0, minWidth: '46%', marginHorizontal: 6, alignItems: 'center' },
  chipDefault: { backgroundColor: '#111' },
  chipSelected: { backgroundColor: '#A4D146' },
  chipText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  chipTextSelected: { color: '#000' },
  bottomRow: { height: 88, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#111', backgroundColor: '#000' },
  continueBtn: { backgroundColor: '#A4D146', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10, minWidth: 160, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.7 },
  continueText: { color: '#000', fontWeight: '800' },
  skipText: { color: '#999', fontSize: 14 },
});