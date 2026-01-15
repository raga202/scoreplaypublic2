import React, { useContext } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PointsContext } from '../context/pointscontext';

export default function MainHeader({ navigation, isProfileOpen, toggleProfile }) {
  const { points } = useContext(PointsContext); 

  return (
    <View style={styles.safeWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      <View style={styles.headerContainer}>
        
        {/* LEFT Section */}
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
            <Ionicons name="menu-outline" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerBrand}>
            Score<Text style={styles.brandAccent}>Play</Text>
          </Text>
        </View>

        {/* RIGHT Section with Toggle Logic */}
        <View style={styles.rightHeader}>
          {!isProfileOpen && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Search')} 
              style={styles.searchBtn}
            >
              <Ionicons name="search-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
          
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={toggleProfile}>
              <View style={[styles.profileCircle, isProfileOpen && styles.activeProfile]}>
                <Ionicons 
                  name={isProfileOpen ? "close" : "person"} 
                  size={18} 
                  color={isProfileOpen ? "#A4D146" : "#000"} 
                />
              </View>
            </TouchableOpacity>
            
            {!isProfileOpen && (
              <Text style={styles.pointsText}>{points || '12.5k'} pts</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeWrapper: { backgroundColor: '#111', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerContainer: { height: 75, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  headerBrand: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  brandAccent: { color: '#A4D146', fontWeight: '400' },
  rightHeader: { flexDirection: 'row', alignItems: 'center' },
  searchBtn: { marginRight: 15 },
  profileContainer: { alignItems: 'center', justifyContent: 'center', minWidth: 40 },
  profileCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#A4D146', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  activeProfile: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333' },
  pointsText: { color: '#A4D146', fontSize: 10, fontWeight: 'bold' }
});