import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function Feedback() {
  const [message, setMessage] = useState('');

  const submitFeedback = () => {
    if (!message.trim()) {
      Alert.alert('Please enter your feedback before submitting.');
      return;
    }
    Alert.alert('Thanks!', 'Your feedback has been recorded.');
    setMessage('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.note}>Tell us about bugs, suggestions, or ideas.</Text>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={6}
        placeholder="Write your feedback here..."
        placeholderTextColor="#555"
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.btn} onPress={submitFeedback} activeOpacity={0.8}>
        <Text style={styles.btnText}>Send Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flexGrow:1,backgroundColor:'#000',padding:24},
  title:{color:'#fff',fontSize:22,fontWeight:'700',marginBottom:8},
  note:{color:'#888',fontSize:14,marginBottom:16},
  input:{backgroundColor:'#0a0a0a',borderColor:'#222',borderWidth:1,color:'#fff',padding:12,borderRadius:8,textAlignVertical:'top'},
  btn:{marginTop:16,backgroundColor:'#A4D146',paddingVertical:12,borderRadius:8,alignItems:'center'},
  btnText:{color:'#000',fontWeight:'700'}
});