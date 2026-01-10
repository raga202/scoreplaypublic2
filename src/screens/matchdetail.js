import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

// Import the two modes
import StandardView from './tabs/standardview';
import ProView from './tabs/proview';

export default function MatchDetailScreen({ navigation, route }) {
  const { matchId } = route.params || {};
  const [isProMode, setIsProMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. THE CONTROL HEADER */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'< BACK'}</Text>
        </TouchableOpacity>

        {/* The USP Toggle Switch */}
        <View style={styles.toggleContainer}>
          <Text style={[styles.label, { color: isProMode ? '#666' : Colors.primary }]}>LIVE</Text>
          <Switch
            trackColor={{ false: "#333", true: Colors.primary }}
            thumbColor="#fff"
            onValueChange={() => setIsProMode(!isProMode)}
            value={isProMode}
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} 
          />
          <Text style={[styles.label, { color: isProMode ? Colors.primary : '#666' }]}>PRO</Text>
        </View>
      </View>

      {/* 2. THE CONTENT AREA */}
      <View style={styles.content}>
        {isProMode ? (
          <ProView matchId={matchId} />
        ) : (
          <StandardView matchId={matchId} />
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: { padding: 10 },
  backText: { color: Colors.primary, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center' },
  label: { fontWeight: 'bold', marginHorizontal: 8, fontSize: 12 },
  content: { flex: 1 }
});