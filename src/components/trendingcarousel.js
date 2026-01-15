import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Image 
} from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

// Dynamic Data with Tournament Logos and Player Photos
const BANNERS = [
  { 
    id: '1', 
    title: 'Champions Trophy 2026', 
    subtitle: 'Official Schedule Announced', 
    tag: 'TOURNAMENT', 
    brand_color: '#0f2027', // Matching team/jersey color
    tournament_logo: 'https://example.com/ct_logo.png', // Logo of the tournament
    player_image: 'https://example.com/player_photo.png' // Picture of player/news subject
  },
  { 
    id: '2', 
    title: 'IPL Mega Auction', 
    subtitle: 'Bidding Wars Begin Tomorrow', 
    tag: 'EVENT', 
    brand_color: '#240b36', 
    tournament_logo: 'https://example.com/ipl_logo.png',
    player_image: 'https://example.com/auction_photo.png'
  }
];

export default function TrendingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // --- AUTO-ROTATE LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      
      // Loop back to start if at the end
      if (nextIndex >= BANNERS.length) {
        nextIndex = 0;
      }

      setCurrentIndex(nextIndex);

      // Programmatically scroll the FlatList
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 4000); // 4-second interval

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderBanner = ({ item }) => (
    <View style={[styles.banner, { backgroundColor: item.brand_color }]}>
      <View style={styles.bannerContent}>
        <View style={styles.textSection}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>• {item.tag}</Text>
          </View>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSub}>{item.subtitle}</Text>
        </View>
        
        {/* Tournament Logo and Player/News Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: item.tournament_logo }} style={styles.tourneyLogo} />
          <Image source={{ uri: item.player_image }} style={styles.playerImg} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
          setCurrentIndex(index);
        }}
      />
      {/* Dot Indicators */}
      <View style={styles.dotContainer}>
        {BANNERS.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              { 
                backgroundColor: i === currentIndex ? '#A4D146' : '#333',
                width: i === currentIndex ? 25 : 6 
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  banner: { 
    width: BANNER_WIDTH, 
    height: 180, 
    borderRadius: 16, 
    marginHorizontal: 20, 
    padding: 20, 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  bannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textSection: { flex: 1.5 },
  tagBadge: { backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, marginBottom: 8 },
  tagText: { color: '#A4D146', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', lineHeight: 24 },
  bannerSub: { color: '#ccc', marginTop: 5, fontSize: 12 },
  imageSection: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  tourneyLogo: { width: 35, height: 35, resizeMode: 'contain', marginBottom: 10 },
  playerImg: { width: 75, height: 75, borderRadius: 40, backgroundColor: '#222', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 4 }
});