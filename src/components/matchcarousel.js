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

const { width: initialWidth } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = initialWidth * 0.85;
const SPACING = 15;

const LIVE_MATCHES = [
  {
    id: '1',
    series_name: 'IPL 2026',
    tournament_logo: '',
    team_a: 'GT', team_a_logo: '',
    team_b: 'PBKS', team_b_logo: '',
    team_a_score: '192/9', team_b_score: '180/4',
    overs: '18.2', status: 'LIVE'
  },
  {
    id: '2',
    series_name: 'BBL 2026',
    tournament_logo: '',
    team_a: 'SYD', team_a_logo: '',
    team_b: 'MEL', team_b_logo: '',
    team_a_score: '145/2', team_b_score: '0/0',
    overs: '14.1', status: 'LIVE'
  }
];

export default function MatchCarousel() {
  const navigation = useNavigation();
  const [matchIndex, setMatchIndex] = useState(0);
  const carouselRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(DEFAULT_CARD_WIDTH);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchIndex((prev) => {
        const next = prev >= LIVE_MATCHES.length - 1 ? 0 : prev + 1;
        if (carouselRef.current && LIVE_MATCHES.length > 0) {
          try {
            carouselRef.current.scrollToIndex({ index: next, animated: true });
          } catch (e) {
            try {
              carouselRef.current.scrollToOffset({ offset: (cardWidth + SPACING) * next, animated: true });
            } catch (_) { /* ignore */ }
          }
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [cardWidth]);

  const renderMatchCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.9}
      onPress={() => {
        // robust navigation to MatchDetail inside More stack
        const root = navigation && navigation.getParent ? navigation.getParent() : null;
        // climb to top-level if needed
        let top = navigation;
        while (top.getParent && top.getParent()) top = top.getParent();
        if (top && typeof top.navigate === 'function') {
          top.navigate('MainTabs', { screen: 'More', params: { screen: 'MatchDetail', params: { match: item } } });
        } else {
          navigation.navigate('More', { screen: 'MatchDetail', params: { match: item } });
        }
      }}
    >
      <View style={styles.cardHeader}>
        {item.tournament_logo ? <Image source={{ uri: item.tournament_logo }} style={styles.tournamentLogo} /> : <View style={[styles.tournamentLogo, { backgroundColor: '#222' }]} />}
        <View style={styles.liveBadge}><Text style={styles.liveText}>{item.status}</Text></View>
      </View>

      <View style={styles.teamsDisplay}>
        <View style={styles.teamInfo}>
          {item.team_a_logo ? <Image source={{ uri: item.team_a_logo }} style={styles.teamLogo} /> : <View style={[styles.teamLogo, { backgroundColor: '#222' }]} />}
          <Text style={styles.teamName}>{item.team_a}</Text>
        </View>
        <View style={styles.scoreCenter}>
          <Text style={styles.mainScore}>{item.team_a_score} - {item.team_b_score}</Text>
          <Text style={styles.oversText}>{item.overs} OV</Text>
        </View>
        <View style={styles.teamInfo}>
          {item.team_b_logo ? <Image source={{ uri: item.team_b_logo }} style={styles.teamLogo} /> : <View style={[styles.teamLogo, { backgroundColor: '#222' }]} />}
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
    <View style={styles.container} onLayout={(e) => {
      const w = e.nativeEvent.layout.width;
      const newCardWidth = Math.max(DEFAULT_CARD_WIDTH, w * 0.85);
      setCardWidth(newCardWidth);
    }}>
      <FlatList
        ref={carouselRef}
        data={LIVE_MATCHES}
        renderItem={renderMatchCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listPadding}
        getItemLayout={(data, index) => ({
          length: cardWidth + SPACING,
          offset: (cardWidth + SPACING) * index,
          index,
        })}
        onScrollToIndexFailed={() => { /* ignore until layout */ }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  listPadding: { paddingHorizontal: 15 },
  card: { backgroundColor: '#111', borderRadius: 20, padding: 20, marginRight: SPACING, borderWidth: 1, borderColor: '#222' },
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