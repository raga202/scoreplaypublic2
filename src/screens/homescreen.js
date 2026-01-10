import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import MatchCard from '../components/matchcard';
import { fetchLiveMatches } from '../services/cricketapi';

export default function HomeScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLiveMatches();
        setMatches(data);
      } catch (e) {
        console.error("Failed to load matches", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Function to handle clicking a match card
  const handleMatchPress = (matchId) => {
    // Navigates to the 'More' tab, then finds the 'MatchDetail' screen inside it
    navigation.navigate('More', { 
      screen: 'MatchDetail',
      params: { matchId: matchId } // We pass the ID so we know which match to show
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Live Scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>LIVE MATCHES</Text>
      
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => handleMatchPress(item.id)}
          >
            <MatchCard 
              teamA={item.teamA}
              scoreA={item.scoreA}
              teamB={item.teamB}
              scoreB={item.scoreB}
              status={item.status}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 15 },
  headerTitle: { 
    color: Colors.primary, 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 40, 
    marginBottom: 20, 
    letterSpacing: 1 
  },
  loadingContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 10 }
});