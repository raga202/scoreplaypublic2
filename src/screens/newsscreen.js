import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock Data - In production, this would be filtered by user context (favoriteTeams/Players)
const NEWS_DATA = [
  { id: '1', title: 'Kohli\'s Masterclass Leads India to Victory', team: 'India', time: '2h ago', image: 'https://example.com/kohli.png' },
  { id: '2', title: 'IPL 2026: GT Retains Key Core Players', team: 'GT', time: '5h ago', image: 'https://example.com/gt.png' },
  { id: '3', title: 'New Training Tech for English Bowlers', team: 'England', time: '1d ago', image: 'https://example.com/england.png' },
];

export default function NewsScreen() {
  const [news, setNews] = useState(NEWS_DATA);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.tagRow}>
          <Text style={styles.tagText}>{item.team.toUpperCase()}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PERSONALIZED FEED</Text>
      </View>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#111' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  list: { padding: 15 },
  card: { backgroundColor: '#111', borderRadius: 12, marginBottom: 20, overflow: 'hidden' },
  cardImage: { width: '100%', height: 180, backgroundColor: '#222' },
  cardContent: { padding: 15 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tagText: { color: '#A4D146', fontSize: 10, fontWeight: 'bold' },
  timeText: { color: '#666', fontSize: 10 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', lineHeight: 22 }
});