import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function MatchCard({ teamA, teamB, scoreA, scoreB, status }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{teamA}</Text>
          <Text style={styles.scoreText}>{scoreA}</Text>
        </View>
        
        <Text style={styles.vsText}>VS</Text>

        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{teamB}</Text>
          <Text style={styles.scoreText}>{scoreB}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E', // Slightly lighter than background
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  liveBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  liveText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 5,
  },
  scoreText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  vsText: {
    color: '#555',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});