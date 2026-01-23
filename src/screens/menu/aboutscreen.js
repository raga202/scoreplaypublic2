import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.note}>ScorePlay • v1.0</Text>
      <Text style={[styles.note, { marginTop: 12 }]}>This is the About placeholder. Add app description, credits, and legal links here.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flexGrow:1,backgroundColor:'#000',padding:24},
  title:{color:'#fff',fontSize:22,fontWeight:'700',marginBottom:8},
  note:{color:'#888',fontSize:14,lineHeight:20}
});