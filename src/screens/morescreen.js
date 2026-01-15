import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { AuthContext } from '../context/authcontext';
// We use Ionicons for the arrow icons
import { Ionicons } from '@expo/vector-icons'; 

// 1. Menu Items Configuration
// The 'target' must match the 'name' in morestacks.js
const MENU_DATA = [
  { id: '1', title: 'Rewards Store', target: 'Rewards', icon: 'gift-outline' },
  { id: '2', title: 'Player Stats & Profiles', target: 'Players', icon: 'person-outline' },
  { id: '3', title: 'Upcoming Fixtures', target: 'Fixtures', icon: 'calendar-outline' },
  { id: '4', title: 'Points Table', target: 'Table', icon: 'list-outline' },
  { id: '5', title: 'App Settings', target: 'Settings', icon: 'settings-outline' },
];

export default function MoreScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const handleNavigation = (target) => {
    // Check if we have built this screen yet
    const availableRoutes = ['Rewards', 'Players'];
    
    if (availableRoutes.includes(target)) {
        navigation.navigate(target); 
    } else {
        Alert.alert("Coming Soon", "This feature is currently under development.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to exit the stadium?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: logout }
      ]
    );
  };

  // Header Component (Profile Summary)
  const renderHeader = () => (
    <View style={styles.header}>
       <View style={styles.avatar}>
         <Text style={styles.avatarText}>JD</Text>
       </View>
       <View>
         <Text style={styles.userName}>John Doe</Text>
         <Text style={styles.userStatus}>Premium Member • 1,250 Pts</Text>
       </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={MENU_DATA}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleNavigation(item.target)}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* Icon for each item */}
                <Ionicons name={item.icon} size={22} color="#888" style={{marginRight: 15}} />
                <Text style={styles.menuText}>{item.title}</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        // Logout Button at the bottom
        ListFooterComponent={
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 10
  },
  avatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#333', justifyContent: 'center', alignItems: 'center',
    marginRight: 15, borderWidth: 1, borderColor: Colors.primary
  },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  userStatus: { color: Colors.primary, fontSize: 12, marginTop: 4 },

  // List Styles
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1a1a1a',
    backgroundColor: '#121212'
  },
  menuText: { color: '#FFF', fontSize: 16 },

  // Logout Styles
  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3131',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 49, 49, 0.05)'
  },
  logoutText: { color: '#FF3131', fontWeight: 'bold', letterSpacing: 1 }
});