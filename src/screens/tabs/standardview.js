import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';

export default function StandardView() {
  return (
    <ScrollView style={styles.container}>
      {/* Scoreboard Header */}
      <View style={styles.scoreCard}>
        <Text style={styles.teamName}>INDIA vs AUSTRALIA</Text>
        <Text style={styles.scoreMain}>324/4 <Text style={styles.overs}>(45.2 ov)</Text></Text>
        <Text style={styles.status}>India need 24 runs in 28 balls</Text>
      </View>

      {/* Recent Balls Commentary */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>RECENT BALLS</Text>
        <View style={styles.ballRow}>
          <Ball value="4" />
          <Ball value="1" />
          <Ball value="0" />
          <Ball value="6" />
          <Ball value="W" isWicket={true} />
        </View>
      </View>
    </ScrollView>
  );
}

// Small helper component for the balls
const Ball = ({ value, isWicket }) => (
  <View style={[styles.ballCircle, isWicket ? { backgroundColor: 'red' } : {}]}>
    <Text style={styles.ballText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scoreCard: { padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  teamName: { color: '#888', fontSize: 16, marginBottom: 10, letterSpacing: 2 },
  scoreMain: { color: Colors.text, fontSize: 42, fontWeight: 'bold' },
  overs: { fontSize: 20, color: '#666' },
  status: { color: Colors.primary, fontSize: 16, marginTop: 10, fontWeight: 'bold' },
  section: { padding: 20 },
  sectionHeader: { color: '#888', marginBottom: 15 },
  ballRow: { flexDirection: 'row', justifyContent: 'space-around' },
  ballCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  ballText: { color: '#fff', fontWeight: 'bold' }
});