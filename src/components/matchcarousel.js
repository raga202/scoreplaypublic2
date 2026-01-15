import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = 15;

const LIVE_MATCHES = [
  { 
    id: '1', 
    series_name: 'IPL 2026', 
    tournament_logo: 'https://example.com/ipl_logo.png',
    team_a: 'GT', team_a_logo: 'https://example.com/gt_logo.png',
    team_b: 'PBKS', team_b_logo: 'https://example.com/pbks_logo.png',
    team_a_score: '192/9', team_b_score: '180/4', 
    overs: '18.2', status: 'LIVE'
  },
  { 
    id: '2', 
    series_name: 'BBL 2026', 
    tournament_logo: 'https://example.com/bbl_logo.png',
    team_a: 'SYD', team_a_logo: 'https://example.com/sixers_logo.png',
    team_b: 'MEL', team_b_logo: 'https://example.com/stars_logo.png',
    team_a_score: '145/2', team_b_score: '0/0', 
    overs: '14.1', status: 'LIVE'
  }
];

export default function MatchCarousel() {
  const navigation = useNavigation();
  const [matchIndex, setMatchIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchIndex((prev) => {
        const next = prev >= LIVE_MATCHES.length - 1 ? 0 : prev + 1;
        if (carouselRef.current) {
          carouselRef.current.scrollToIndex({ index: next, animated: true });
        }
        return next;
      });
    }, 5000); // 5s Rotation
    return () => clearInterval(interval);
  }, []);

  const renderMatchCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} // Fixed background
      activeOpacity={0.9}
      onPress={() => navigation.navigate('MatchDetail', { match: item })}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.tournament_logo }} style={styles.tournamentLogo} />
        <View style={styles.liveBadge}><Text style={styles.liveText}>{item.status}</Text></View>
      </View>

      <View style={styles.teamsDisplay}>
        <View style={styles.teamInfo}>
          <Image source={{ uri: item.team_a_logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{item.team_a}</Text>
        </View>
        <View style={styles.scoreCenter}>
          <Text style={styles.mainScore}>{item.team_a_score} - {item.team_b_score}</Text>
          <Text style={styles.oversText}>{item.overs} OV</Text>
        </View>
        <View style={styles.teamInfo}>
          <Image source={{ uri: item.team_b_logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{item.team_b}</Text>
        </View>
      </View>

      <View style={styles.predictionRow}>
        <TouchableOpacity style={styles.predBtn}><Text style={styles.predBtnText}>1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.predBtn}><Text style={styles.predBtnText}>X</Text></TouchableOpacity>
        <TouchableOpacity style={styles.predBtn}><Text style={styles.predBtnText}>2</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={carouselRef}
        data={LIVE_MATCHES}
        renderItem={renderMatchCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listPadding}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
        onScrollToIndexFailed={() => {}} // Prevents crash if scroll fires too early
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  listPadding: { paddingHorizontal: 15 },
  card: { backgroundColor: '#111', width: CARD_WIDTH, borderRadius: 20, padding: 20, marginRight: SPACING, borderWidth: 1, borderColor: '#222' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  tournamentLogo: { width: 35, height: 35, resizeMode: 'contain' },
  liveBadge: { backgroundColor: '#FF3B30', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  liveText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  teamsDisplay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  teamInfo: { alignItems: 'center', flex: 1 },
  teamLogo: { width: 45, height: 45, resizeMode: 'contain', marginBottom: 5 },
  teamName: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  scoreCenter: { alignItems: 'center', flex: 1.5 },
  mainScore: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  oversText: { color: '#A4D146', fontSize: 11, fontWeight: 'bold' },
  predictionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  predBtn: { backgroundColor: '#222', flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  predBtnText: { color: '#FFF', fontWeight: 'bold' }
});