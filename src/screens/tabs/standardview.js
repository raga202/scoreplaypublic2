import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { fetchMatchDetail } from '../../services/cricketapi';

export default function StandardView({ matchId, navigation }) {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMatchDetail(matchId);
      setMatchData(data);
    };
    loadData();
  }, [matchId]);

  if (!matchData) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Score Header */}
        <View style={styles.scoreCard}>
            <Text style={styles.matchTitle}>{matchData.teamA} vs {matchData.teamB}</Text>
            <Text style={styles.score}>{matchData.scoreA}</Text>
            <Text style={styles.status}>{matchData.status}</Text>
        </View>

        {/* Basic Stats */}
        <View style={styles.statsContainer}>
            <Text style={styles.sectionHeader}>KEY STATS</Text>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Run Rate</Text>
                <Text style={styles.statValue}>7.42</Text>
            </View>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Projected Score</Text>
                <Text style={styles.statValue}>345</Text>
            </View>
        </View>
      </ScrollView>

      {/* FOOTER CTA: PREDICT & WIN */}
      <View style={styles.footerCTA}>
        <Text style={styles.footerText}>Think you know cricket?</Text>
        <TouchableOpacity 
            style={styles.predictBtn}
            // Navigate to the new Swipe Game
            onPress={() => navigation.navigate('PredictGame')}
        >
            <Text style={styles.predictBtnText}>PREDICT & WIN COINS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scoreCard: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#222' },
  matchTitle: { color: '#888', marginBottom: 10 },
  score: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  status: { color: Colors.primary, marginTop: 10 },
  
  statsContainer: { padding: 20 },
  sectionHeader: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statLabel: { color: '#ccc' },
  statValue: { color: '#fff', fontWeight: 'bold' },

  footerCTA: { padding: 20, backgroundColor: '#111', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center' },
  footerText: { color: '#888', marginBottom: 10, fontSize: 12 },
  predictBtn: { backgroundColor: Colors.primary, width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  predictBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});