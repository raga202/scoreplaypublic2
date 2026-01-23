import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TournamentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournaments</Text>
      <Text style={styles.note}>Tournaments listing placeholder.</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}, title:{color:'#fff',fontSize:22,fontWeight:'700'}, note:{color:'#888',marginTop:8} });