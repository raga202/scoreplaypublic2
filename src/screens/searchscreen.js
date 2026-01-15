import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Segmented tabs based on the Arena search layout
  const tabs = ['All', 'Matches', 'Players', 'Teams'];

  // Mock data for search results
  const results = [
    { id: '1', type: 'Match', teamA: 'Gujarat Titans', teamB: 'Punjab Kings', scoreA: '192/9', scoreB: '180/4', status: '21:00 IST' },
    { id: '2', type: 'Team', name: 'Rajasthan Royals', country: 'India', icon: 'shield-outline' },
    { id: '3', type: 'Player', name: 'Dhoni', country: 'India', icon: 'person-outline' },
    { id: '4', type: 'Player', name: 'Prithvi', country: 'India', icon: 'person-outline' },
  ];

  const filteredResults = results.filter(item => 
    activeTab === 'All' || item.type === activeTab.slice(0, -1) || (activeTab === 'Matches' && item.type === 'Match')
  );

  const renderItem = ({ item }) => {
    if (item.type === 'Match') {
      return (
        <View style={styles.matchItem}>
          <View style={styles.matchTime}>
            <Text style={styles.timeText}>{item.status}</Text>
          </View>
          <View style={styles.matchDetails}>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>{item.teamA}</Text>
              <Text style={styles.teamScore}>{item.scoreA}</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>{item.teamB}</Text>
              <Text style={styles.teamScore}>{item.scoreB}</Text>
            </View>
          </View>
          <Ionicons name="star-outline" size={18} color="#666" />
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <View style={styles.iconBox}>
          <Ionicons name={item.icon} size={20} color="#A4D146" />
        </View>
        <View style={styles.listText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSub}>{item.country}</Text>
        </View>
        <Ionicons name="star-outline" size={18} color="#666" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search Teams, Players..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Segmented Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList 
        data={filteredResults}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingTop: 10,
    paddingBottom: 20
  },
  backBtn: { marginRight: 10 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45
  },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10, fontSize: 14 },
  tabBar: { 
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222',
    marginBottom: 10
  },
  tab: { paddingVertical: 12, marginRight: 25 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#A4D146' },
  tabText: { color: '#666', fontSize: 13, fontWeight: 'bold' },
  activeTabText: { color: '#FFF' },
  listContent: { paddingHorizontal: 15, paddingBottom: 50 },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },
  matchTime: { width: 60, borderRightWidth: 1, borderRightColor: '#222', marginRight: 15 },
  timeText: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  matchDetails: { flex: 1 },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  teamName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  teamScore: { color: '#A4D146', fontSize: 14, fontWeight: '900' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },
  iconBox: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#161616', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  listText: { flex: 1 },
  itemName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  itemSub: { color: '#666', fontSize: 12, marginTop: 2 }
});