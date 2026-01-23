// src/screens/onboarding/PlayerSelectionScreen.js
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
import { fetchPlayers, saveFavorites } from '../../services/userService';

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

export default function PlayerSelectionScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const incomingTeams = route?.params?.teams || []; // array of team ids selected on previous screen

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState(new Set(user?.favorites?.players || []));
  const [selectedTeams, setSelectedTeams] = useState(new Set(incomingTeams || []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const p = await fetchPlayers();
        if (!mounted) return;
        setPlayers(p || []);
      } catch (e) {
        console.warn('[PlayerSelection] load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.short_name || '').toLowerCase().includes(q));
  }, [players, query]);

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

  const onSave = async () => {
    if (selectedTeams.size === 0 && selectedPlayers.size === 0) {
      Alert.alert('Pick at least one', 'Please select at least one team or player to personalize your feed, or tap Skip.');
      return;
    }

    setSaving(true);
    const payload = { teams: Array.from(selectedTeams), players: Array.from(selectedPlayers) };
    try {
      const updatedUser = await saveFavorites(user?.id, payload);
      const userToSet = updatedUser && updatedUser.id
        ? updatedUser
        : { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) await setUser(userToSet);
    } catch (e) {
      console.warn('[PlayerSelection] saveFavorites failed', e);
      Alert.alert('Save failed', 'Could not save favorites. Your selections are saved locally and will sync later.');
      // still update local user
      const userToSet = { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) setUser(userToSet);
    } finally {
      setSaving(false);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  const onSkip = async () => {
    setSaving(true);
    const payload = { teams: Array.from(selectedTeams), players: Array.from(selectedPlayers) };
    try {
      const updatedUser = await saveFavorites(user?.id, payload);
      const userToSet = updatedUser && updatedUser.id
        ? updatedUser
        : { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) await setUser(userToSet);
    } catch (e) {
      console.warn('[PlayerSelection] skip save failed', e);
      const userToSet = { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) setUser(userToSet);
    } finally {
      setSaving(false);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A4D146" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your favourite players</Text>
        <Text style={styles.counter}>{`${selectedPlayers.size}/10 players`}</Text>
        <Text style={styles.subtitle}>Select up to 10 players you follow.</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput placeholder="Search players" placeholderTextColor="#666" value={query} onChangeText={setQuery} style={styles.searchInput} />
      </View>

      <View style={styles.listWrap}>
        <FlatList
          data={filteredPlayers}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Chip item={item} selected={selectedPlayers.has(item.id)} onPress={toggleSelectPlayer} />}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }} />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity style={[styles.continueBtn, saving && styles.continueBtnDisabled]} onPress={onSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.continueText}>Save & Continue</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 18, justifyContent: 'center' }}>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>{saving ? 'Saving...' : 'Skip'}</Text>
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