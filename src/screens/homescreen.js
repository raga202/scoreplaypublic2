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
import MatchCarousel from '../components/matchcarousel';
import MatchCard from '../components/matchcard';
import { fetchLiveMatches } from '../services/cricketapi';

const { width: initialWidth } = Dimensions.get('window');

const BANNERS = [
  { id: '1', title: 'Champions Trophy 2026', subtitle: 'Schedule', tag: 'TOURNAMENT', brand_color: '#0f2027', tournament_logo: '', image: '' },
  { id: '2', title: 'IPL Mega Auction', subtitle: 'Auction Day', tag: 'EVENT', brand_color: '#240b36', tournament_logo: '', image: '' },
];

export default function HomeScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const [bannerWidth, setBannerWidth] = useState(initialWidth - 40);

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

  // helper to find top/root navigator (Drawer)
  const findRootNav = (nav) => {
    let root = nav;
    while (root && typeof root.getParent === 'function') {
      const parent = root.getParent();
      if (!parent) break;
      root = parent;
    }
    return root || nav;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => {
        const next = prev >= BANNERS.length - 1 ? 0 : prev + 1;
        if (bannerRef.current && BANNERS.length > 0) {
          // try scrollToIndex then fallback to offset
          try {
            bannerRef.current.scrollToIndex({ index: next, animated: true });
          } catch (e) {
            try {
              bannerRef.current.scrollToOffset({ offset: bannerWidth * next, animated: true });
            } catch (_) { /* ignore */ }
          }
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerWidth]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionTitle}>TRENDING NOW</Text>
      <FlatList
        ref={bannerRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          // compute banner width based on container (maintain margin)
          setBannerWidth(w - 40);
        }}
        getItemLayout={(data, index) => ({
          length: bannerWidth,
          offset: bannerWidth * index,
          index,
        })}
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
        onScrollToIndexFailed={() => {}}
      />
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

  if (!Array.isArray(matches)) {
    return (
      <View style={styles.centerFallback}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <Text style={{ color: '#fff' }}>Home (loading)</Text>
      </View>
    );
  }

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
              // navigate robustly to the MatchDetail inside the More stack
              const root = findRootNav(navigation);
              // top-level drawer uses MainTabs -> (Tab navigator) -> More -> MatchDetail
              if (root && typeof root.navigate === 'function') {
                root.navigate('MainTabs', { screen: 'More', params: { screen: 'MatchDetail', params: { match: item } } });
              } else {
                // fallback: try local navigate
                navigation.navigate('More', { screen: 'MatchDetail', params: { match: item } });
              }
            }}
          >
            <MatchCard {...item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerFallback: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
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