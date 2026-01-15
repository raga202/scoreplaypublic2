import React from 'react'; 
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useMatches } from '../hooks/usematches';
import MatchCard from '../components/matchcard';
import { Colors } from '../constants/colors';

export default function LiveMatchesScreen({ navigation }) {
  const { matches, loading, refresh } = useMatches();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{color: '#888', marginTop: 10}}>Fetching Live Scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LIVE MATCHES</Text>
      <FlatList
        data={matches || []}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('More', { screen: 'MatchDetail', params: { matchId: item.id } })}>
            <MatchCard {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{color: '#555'}}>No live matches at the moment.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15, paddingTop: 20 },
  header: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});