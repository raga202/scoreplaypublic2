import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, StatusBar, Image } from 'react-native';
import MatchCarousel from '../components/matchcarousel'; 
import MatchCard from '../components/matchcard';
import { fetchLiveMatches } from '../services/cricketapi';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40; 

const BANNERS = [
  { id: '1', title: 'Champions Trophy 2026', subtitle: 'Official Schedule Announced', tag: 'TOURNAMENT', brand_color: '#0f2027', tournament_logo: 'https://example.com/ct_logo.png', image: 'https://example.com/player_photo.png' },
  { id: '2', title: 'IPL Mega Auction', subtitle: 'Bidding Wars Begin Tomorrow', tag: 'EVENT', brand_color: '#240b36', tournament_logo: 'https://example.com/ipl_logo.png', image: 'https://example.com/auction_photo.png' }
];

export default function HomeScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchLiveMatches();
        setMatches(data);
    };
    loadData();
  }, []);

  // --- STABLE AUTO-ROTATE LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => {
        const next = prev >= BANNERS.length - 1 ? 0 : prev + 1;
        if (bannerRef.current) {
          bannerRef.current.scrollToIndex({ index: next, animated: true });
        }
        return next;
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

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
            getItemLayout={(data, index) => ({
              length: BANNER_WIDTH,
              offset: BANNER_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
                <View style={[styles.banner, { backgroundColor: item.brand_color }]}>
                    <View style={styles.bannerContent}>
                        <View style={styles.textSection}>
                            <View style={styles.tagBadge}><Text style={styles.tagText}>• {item.tag}</Text></View>
                            <Text style={styles.bannerTitle}>{item.title}</Text>
                            <Text style={styles.bannerSub}>{item.subtitle}</Text>
                        </View>
                        <View style={styles.imageSection}>
                            <Image source={{ uri: item.tournament_logo }} style={styles.tourneyLogo} />
                            <Image source={{ uri: item.image }} style={styles.playerImg} />
                        </View>
                    </View>
                </View>
            )}
        />
        <View style={styles.dotContainer}>
            {BANNERS.map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i === bannerIndex ? '#A4D146' : '#333', width: i === bannerIndex ? 25 : 6 }]} />
            ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>LIVE MATCH CENTRE</Text>
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
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('MatchDetail', { match: item })}>
            <MatchCard {...item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerContainer: { paddingVertical: 20 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20, letterSpacing: 1 },
  banner: { width: BANNER_WIDTH, height: 180, borderRadius: 16, marginHorizontal: 20, padding: 20, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  bannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textSection: { flex: 1.5 },
  tagBadge: { backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, marginBottom: 8 },
  tagText: { color: '#A4D146', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', lineHeight: 24 },
  bannerSub: { color: '#ccc', marginTop: 5, fontSize: 12 },
  imageSection: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  tourneyLogo: { width: 35, height: 35, resizeMode: 'contain', marginBottom: 10 },
  playerImg: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#222' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 4 }
});