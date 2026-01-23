import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchCarousel from '../components/matchcarousel';
import MatchCard from '../components/matchcard';
import { fetchLiveMatches } from '../services/cricketapi';

const { width: initialWidth } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 64; // keep in sync with tab navigator

const BANNERS = [
  { id: '1', title: 'Champions Trophy 2026', subtitle: 'Schedule', tag: 'TOURNAMENT', brand_color: '#0f2027', tournament_logo: '', image: '' },
  { id: '2', title: 'IPL Mega Auction', subtitle: 'Auction Day', tag: 'EVENT', brand_color: '#240b36', tournament_logo: '', image: '' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const bannerIndexRef = useRef(0);
  const intervalRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const bannerWidth = containerWidth ? Math.max(200, containerWidth - 40) : 0;
  const [ready, setReady] = useState(false);

  // load matches (stubbed service)
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const data = await fetchLiveMatches();
        if (mounted && Array.isArray(data)) setMatches(data);
      } catch (e) {
        if (mounted) setMatches([]);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // start banner ready timer once we have a measured width
  useEffect(() => {
    if (!bannerWidth || BANNERS.length === 0) return;
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, [bannerWidth]);

  // banner auto-rotate interval
  useEffect(() => {
    if (!ready) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (bannerIndexRef.current + 1) % BANNERS.length;
      bannerIndexRef.current = next;
      setBannerIndex(next);

      if (bannerRef.current) {
        const offset = bannerWidth * next;
        requestAnimationFrame(() => {
          try {
            bannerRef.current.scrollToOffset({ offset, animated: true });
          } catch (e) {
            try {
              bannerRef.current.scrollToIndex({ index: next, animated: true });
            } catch (_) { /* ignore */ }
          }
        });
      }
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [ready, bannerWidth]);

  const onBannerContainerLayout = (e) => {
    const w = e.nativeEvent.layout.width || initialWidth;
    setContainerWidth(w);
  };

  const onBannerMomentumEnd = (ev) => {
    try {
      const x = ev.nativeEvent.contentOffset.x || 0;
      const idx = Math.round(x / bannerWidth);
      bannerIndexRef.current = Math.max(0, Math.min(idx, BANNERS.length - 1));
      setBannerIndex(bannerIndexRef.current);
    } catch (_) {}
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionTitle}>TRENDING NOW</Text>

      <View onLayout={onBannerContainerLayout}>
        <FlatList
          ref={bannerRef}
          data={BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          getItemLayout={() => ({ length: bannerWidth, offset: 0, index: 0 })}
          renderItem={({ item }) => (
            <View style={[styles.banner, { width: bannerWidth, backgroundColor: item.brand_color || '#222' }]}>
              <View style={styles.bannerContent}>
                <View style={styles.textSection}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSub}>{item.subtitle}</Text>
                </View>
                <View style={styles.imageSection}>
                  {item.tournament_logo ? (
                    <Image source={{ uri: item.tournament_logo }} style={styles.tourneyLogo} />
                  ) : (
                    <View style={[styles.tourneyLogo, { backgroundColor: '#222' }]} />
                  )}
                </View>
              </View>
            </View>
          )}
          onScrollToIndexFailed={(info) => {
            const idx = info.index || 0;
            const offset = bannerWidth * idx;
            if (bannerRef.current) {
              try { bannerRef.current.scrollToOffset({ offset, animated: true }); } catch (_) {}
            }
          }}
          onMomentumScrollEnd={onBannerMomentumEnd}
          scrollEnabled={ready}
        />
      </View>

      <View style={styles.dotContainer}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === bannerIndex ? '#A4D146' : '#333', width: i === bannerIndex ? 25 : 6 }]} />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>LIVE MATCH CENTRE</Text>
      <MatchCarousel />
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>UPCOMING SERIES</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // Navigate into the Live tab's MatchDetail (ensure LiveStack registers MatchDetail)
              navigation.navigate('Live', { screen: 'MatchDetail', params: { match: item } });
            }}
          >
            <MatchCard {...item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerContainer: { paddingVertical: 20 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20, letterSpacing: 1 },
  banner: { height: 160, borderRadius: 12, marginHorizontal: 20, padding: 16, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  bannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textSection: { flex: 1.5 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: '#ccc', marginTop: 6, fontSize: 12 },
  imageSection: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  tourneyLogo: { width: 40, height: 40, borderRadius: 8, resizeMode: 'contain' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 4 },
});