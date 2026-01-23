import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Highlights() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highlights</Text>
      <Text style={styles.note}>Video highlights and clips (placeholder).</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},
  title:{color:'#fff',fontSize:22,fontWeight:'700'},
  note:{color:'#888',marginTop:8}
});