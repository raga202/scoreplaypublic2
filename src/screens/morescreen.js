import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '../constants/colors';

const MENU_DATA = [
  { id: '1', title: 'Player Rankings', target: 'Players' },
  { id: '2', title: 'Upcoming Fixtures', target: 'Fixtures' },
  { id: '3', title: 'Points Table', target: 'Table' },
  { id: '4', title: 'Venues', target: 'Venues' },
  { id: '5', title: 'History', target: 'History' },
  { id: '6', title: 'Settings', target: 'Settings' },
];

export default function MoreScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={MENU_DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate(item.target)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={{color: Colors.primary}}> {'>'} </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222' 
  },
  menuText: { color: Colors.text, fontSize: 18 }
});