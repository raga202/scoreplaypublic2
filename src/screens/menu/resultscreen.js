import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Results() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.note}>Past match results (placeholder).</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},
  title:{color:'#fff',fontSize:22,fontWeight:'700'},
  note:{color:'#888',marginTop:8}
});