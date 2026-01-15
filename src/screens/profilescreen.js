import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authcontext';
import { PointsContext } from '../context/pointscontext';

export default function ProfileScreen() {
  const { logout, user } = useContext(AuthContext);
  const { points } = useContext(PointsContext);

  const ProfileOption = ({ icon, title, value }) => (
    <TouchableOpacity style={styles.optionRow}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={22} color="#A4D146" />
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#333" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile Section */}
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <View style={styles.profilePlaceholder}>
             <Ionicons name="person" size={50} color="#000" />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.email || 'Cricket Fan'}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsLabel}>{points || '12.5k'} TOTAL PTS</Text>
        </View>
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
        <ProfileOption icon="person-outline" title="Personal Information" />
        <ProfileOption icon="notifications-outline" title="Notifications" value="On" />
        <ProfileOption icon="shield-checkmark-outline" title="Privacy & Security" />
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>REWARDS & ANALYTICS</Text>
        <ProfileOption icon="trophy-outline" title="Prediction History" />
        <ProfileOption icon="stats-chart-outline" title="Win Rate" value="64%" />
        <ProfileOption icon="gift-outline" title="Redeem Points" />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>SIGN OUT</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderBottomColor: '#111' },
  imageContainer: { position: 'relative', marginBottom: 15 },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A4D146', // App Theme
    justifyContent: 'center',
    alignItems: 'center'
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000'
  },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  pointsBadge: {
    backgroundColor: 'rgba(164, 209, 70, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A4D146'
  },
  pointsLabel: { color: '#A4D146', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { color: '#444', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    padding: 18,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#111'
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: { color: '#DDD', fontSize: 14, marginLeft: 15, fontWeight: '500' },
  optionRight: { flexDirection: 'row', alignItems: 'center' },
  optionValue: { color: '#666', fontSize: 13, marginRight: 10 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 20
  },
  logoutText: { color: '#FF3B30', fontWeight: 'bold', marginLeft: 10, fontSize: 14, letterSpacing: 1 }
});