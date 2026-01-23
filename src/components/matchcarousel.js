// save as src/components/matchcarousel.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: initialWidth } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = initialWidth * 0.85;
const SPACING = 15;
const LEADING_PADDING = 15; // matches contentContainerStyle paddingHorizontal
const AUTO_ADVANCE_MS = 4500;

// test data (replace with real matches later)
const LIVE_MATCHES = [
  { id: '1', series_name: 'IPL 2026', team_a: 'GT', team_b: 'PBKS', team_a_score: '192/9', team_b_score: '180/4', status: 'LIVE' },
  { id: '2', series_name: 'BBL 2026', team_a: 'SYD', team_b: 'MEL', team_a_score: '145/2', team_b_score: '0/0', status: 'LIVE' },
  { id: '3', series_name: 'T20 Series', team_a: 'RCB', team_b: 'CSK', team_a_score: '185/3', team_b_score: 'Yet to Bat', status: 'UPCOMING' },
];

export default function MatchCarousel() {
  const navigation = useNavigation();
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const [cardWidth, setCardWidth] = useState(DEFAULT_CARD_WIDTH);
  const [measured, setMeasured] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // measure container once (via onLayout on wrapper) and update cardWidth
  const onContainerLayout = (e) => {
    const w = e.nativeEvent.layout.width || initialWidth;
    const computed = Math.min(DEFAULT_CARD_WIDTH, w * 0.85);
    setCardWidth((prev) => (Math.abs(prev - computed) > 0.5 ? computed : prev));
    // mark ready after small delay so FlatList children layout
    setTimeout(() => setMeasured(true), 50);
  };

  // start auto-advance when measured
  useEffect(() => {
    if (!measured) return;
    if (!LIVE_MATCHES || LIVE_MATCHES.length <= 1) return;

    // set initial position (account for leading padding)
    try {
      const initialOffset = LEADING_PADDING + (cardWidth + SPACING) * indexRef.current;
      if (listRef.current && typeof listRef.current.scrollToOffset === 'function') {
        listRef.current.scrollToOffset({ offset: initialOffset, animated: false });
      }
    } catch (_) {}

    // clear any existing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      if (isUserInteracting) return;

      const next = (indexRef.current + 1) % LIVE_MATCHES.length;
      indexRef.current = next;
      const offset = LEADING_PADDING + (cardWidth + SPACING) * next;

      if (listRef.current && typeof listRef.current.scrollToOffset === 'function') {
        try {
          listRef.current.scrollToOffset({ offset, animated: true });
        } catch (e) {
          // fallback to scrollToIndex
          try { listRef.current.scrollToIndex({ index: next, animated: true }); } catch (_) {}
        }
      }
    }, AUTO_ADVANCE_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [measured, cardWidth, isUserInteracting]);

  const onMomentumScrollEnd = (ev) => {
    try {
      const x = ev.nativeEvent.contentOffset.x || 0;
      const raw = (x - LEADING_PADDING) / (cardWidth + SPACING);
      const idx = Math.round(raw);
      indexRef.current = Math.max(0, Math.min(idx, LIVE_MATCHES.length - 1));
    } catch (_) {}
    setTimeout(() => setIsUserInteracting(false), 200);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.9}
      onPress={() => {
        // navigate into Live stack where MatchDetail is registered
        try {
          navigation.navigate('Live', { screen: 'MatchDetail', params: { match: item } });
        } catch {
          let top = navigation;
          while (top && top.getParent && top.getParent()) top = top.getParent();
          if (top && typeof top.navigate === 'function') {
            top.navigate('MainTabs', { screen: 'More', params: { screen: 'MatchDetail', params: { match: item } } });
          }
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.series}>{item.series_name}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{item.status}</Text></View>
      </View>
      <View style={styles.teams}>
        <Text style={styles.team}>{item.team_a}</Text>
        <Text style={styles.score}>{item.team_a_score} - {item.team_b_score}</Text>
        <Text style={styles.team}>{item.team_b}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper} onLayout={onContainerLayout}>
      <FlatList
        ref={listRef}
        horizontal
        data={LIVE_MATCHES}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: LEADING_PADDING }}
        snapToInterval={cardWidth + SPACING}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.98}
        getItemLayout={(data, index) => ({ length: cardWidth + SPACING, offset: (cardWidth + SPACING) * index, index })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={() => setIsUserInteracting(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 10 },
  card: { backgroundColor: '#111', borderRadius: 12, padding: 14, marginRight: SPACING, borderWidth: 1, borderColor: '#222' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  series: { color: '#AAA', fontSize: 12 },
  badge: { backgroundColor: '#FF3B30', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  teams: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  team: { color: '#FFF', fontSize: 13, width: 60 },
  score: { color: '#A4D146', fontWeight: '900' },
});