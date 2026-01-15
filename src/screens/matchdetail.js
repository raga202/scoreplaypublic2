import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Switch,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WagonWheel from '../components/wagonwheel'; 

// Import the sub-views - Ensure these files exist in your tabs folder
import StandardView from './tabs/standardview';
import ProView from './tabs/proview';

export default function MatchDetailScreen({ navigation, route }) {
  // Safe destructuring with multiple fallback levels
  const { match } = route.params || {};
  const safeMatch = match || {}; 
  
  // State to handle the mode toggle
  const [isProMode, setIsProMode] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />

      {/* --- MODE TOGGLE BAR --- */}
      <View style={styles.toggleBar}>
          <Text style={styles.modeText}>PRO MODE</Text>
          <Switch
              trackColor={{ false: "#333", true: "#A4D146" }}
              thumbColor={isProMode ? "#FFF" : "#888"}
              onValueChange={() => setIsProMode(!isProMode)}
              value={isProMode}
          />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        
        {/* --- DYNAMIC SCOREBOARD SECTION --- */}
        <View style={styles.scoreSection}>
          <Text style={styles.seriesLabel}>{safeMatch.series_name || 'LIVE MATCH'}</Text>
          <View style={styles.scoreRow}>
            <View style={styles.teamBox}>
               <Text style={styles.teamName}>{safeMatch.team_a || 'TEAM A'}</Text>
               <Text style={styles.scoreText}>{safeMatch.team_a_score || '0/0'}</Text>
            </View>
            
            <Text style={styles.vsText}>VS</Text>
            
            <View style={styles.teamBox}>
               <Text style={styles.teamName}>{safeMatch.team_b || 'TEAM B'}</Text>
               <Text style={styles.scoreText}>{safeMatch.team_b_score || '0/0'}</Text>
            </View>
          </View>
          <Text style={styles.matchStatus}>IN PROGRESS</Text>
        </View>

        {/* --- CONDITIONAL CONTENT BASED ON MODE --- */}
        {isProMode ? (
          <View>
            {/* PRO MODE: Visualizer + Pro Stats */}
            <View style={styles.visualizerContainer}>
              <Text style={styles.visualizerLabel}>LIVE WAGON WHEEL</Text>
              <WagonWheel /> 
            </View>
            <ProView match={safeMatch} />
          </View>
        ) : (
          /* STANDARD MODE: Traditional Scorecard/Commentary */
          <StandardView match={safeMatch} navigation={navigation} />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1 },
  toggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  modeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  scoreSection: { 
    padding: 25, 
    alignItems: 'center', 
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  seriesLabel: { color: '#666', fontSize: 10, letterSpacing: 2, marginBottom: 15, textTransform: 'uppercase' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  teamBox: { alignItems: 'center', flex: 1 },
  teamName: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  scoreText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  vsText: { color: '#A4D146', marginHorizontal: 20, fontWeight: '900', fontSize: 18 },
  matchStatus: { color: '#A4D146', fontSize: 10, fontWeight: 'bold', marginTop: 15, letterSpacing: 1 },
  visualizerContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#000' },
  visualizerLabel: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 25, letterSpacing: 1.5 }
});