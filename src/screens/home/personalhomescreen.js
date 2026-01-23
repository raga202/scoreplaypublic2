import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { AuthContext } from '../../context/authcontext';

/**
 * PersonalHomeScreen
 * - Shows a simple personalized view using favorites from AuthContext.
 * - This is a scaffold: wire your real tickers, news, shorts feeds here using favorites.
 */
export default function PersonalHomeScreen() {
  const { user } = useContext(AuthContext);
  const favoriteTeams = user?.favorites?.teams || [];
  const favoritePlayers = user?.favorites?.players || [];

  // placeholder data representation
  const sections = [
    { id: 'tickers', title: 'Tickers', items: favoriteTeams.length ? favoriteTeams : ['All Teams'] },
    { id: 'news', title: 'News for you', items: favoriteTeams.length ? favoriteTeams : ['Top Stories'] },
    { id: 'shorts', title: 'Shorts', items: favoritePlayers.length ? favoritePlayers : ['Trending Clips'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</Text>

      <FlatList
        data={sections}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.items}
              keyExtractor={(i, idx) => `${item.id}-${String(i)}-${idx}`}
              horizontal
              renderItem={({ item: it }) => (
                <View style={styles.card}>
                  {/* If you store logos, show them; otherwise show text */}
                  {typeof it === 'string' ? <Text style={styles.cardText}>{it}</Text> : <Image source={{ uri: it.logo_url }} style={styles.logo} />}
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 16 },
  header: { color: '#fff', fontSize: 22, fontWeight: '800', paddingHorizontal: 16, marginBottom: 12 },
  section: { marginBottom: 18 },
  sectionTitle: { color: '#ccc', paddingHorizontal: 16, marginBottom: 8, fontSize: 14, fontWeight: '700' },
  card: {
    width: 140,
    height: 90,
    backgroundColor: '#111',
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { color: '#fff', fontWeight: '700', textAlign: 'center', paddingHorizontal: 6 },
  logo: { width: 80, height: 40, resizeMode: 'contain' },
});