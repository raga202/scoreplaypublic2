import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Privacy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy</Text>
      <Text style={styles.note}>Privacy policy summary and links to the full policy (placeholder).</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flexGrow:1,backgroundColor:'#000',padding:24},
  title:{color:'#fff',fontSize:22,fontWeight:'700',marginBottom:12},
  note:{color:'#888',fontSize:14,lineHeight:20}
});