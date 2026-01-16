import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function ShortsScreen() {
  const shortsData = [{ id: '1' }, { id: '2' }, { id: '3' }];

  return (
    <View style={styles.container}>
      <FlatList
        data={shortsData}
        pagingEnabled // Snaps to full screen
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={() => (
          <View style={styles.videoPlaceholder}>
             {/* Future: Video Player Component here */}
            <Text style={styles.videoText}>Personalized Video Feed</Text>
            <Text style={styles.subText}>Focusing on your favorite teams & players</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoPlaceholder: { 
    height: height, 
    width: width, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#050505'
  },
  videoText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  subText: { color: '#A4D146', fontSize: 14, marginTop: 10, fontWeight: 'bold' }
});