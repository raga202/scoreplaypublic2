// src/screens/onboarding/TeamSelectionScreen.js
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
import { fetchTeams, saveFavorites } from '../../services/userService';

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

export default function TeamSelectionScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeams, setSelectedTeams] = useState(new Set(user?.favorites?.teams || []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const t = await fetchTeams();
        if (!mounted) return;
        setTeams(t || []);
      } catch (e) {
        console.warn('[TeamSelection] load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter((t) => (t.name || '').toLowerCase().includes(q) || (t.short_code || '').toLowerCase().includes(q));
  }, [teams, query]);

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

  const onContinue = () => {
    // navigate to PlayerSelection and pass selected teams
    navigation.navigate('PlayerSelection', { teams: Array.from(selectedTeams) });
  };

  const onSkip = async () => {
    setSaving(true);
    const payload = { teams: Array.from(selectedTeams), players: [] };
    try {
      const updatedUser = await saveFavorites(user?.id, payload);
      const userToSet = updatedUser && updatedUser.id
        ? updatedUser
        : { ...(user || {}), favorites: payload, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) await setUser(userToSet);
    } catch (e) {
      console.warn('[TeamSelection] skip save failed', e);
      // still update local user
      const userToSet = { ...(user || {}), favorites: { teams: Array.from(selectedTeams), players: [] }, onboarding: { ...(user?.onboarding || {}), favoritesCompleted: true } };
      if (setUser) setUser(userToSet);
    } finally {
      setSaving(false);
      // navigate to app root (MainTabs)
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
        <Text style={styles.title}>Choose your favourite teams</Text>
        <Text style={styles.counter}>{`${selectedTeams.size}/10 teams`}</Text>
        <Text style={styles.subtitle}>Select up to 10 teams you follow.</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput placeholder="Search teams" placeholderTextColor="#666" value={query} onChangeText={setQuery} style={styles.searchInput} />
      </View>

      <View style={styles.listWrap}>
        <FlatList
          data={filteredTeams}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Chip item={item} selected={selectedTeams.has(item.id)} onPress={toggleSelectTeam} />}
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
            <Text style={styles.continueText}>Continue</Text>
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