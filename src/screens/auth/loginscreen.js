import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Entypo } from '@expo/vector-icons'; // Import Icon
import { AuthContext } from '../../context/authcontext'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Eye State
  
  const { signIn } = useContext(AuthContext);

  const handleLogin = () => {
    if(email.length === 0 || password.length === 0) {
       Alert.alert("Error", "Please enter your credentials.");
       return;
    }
    signIn(); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>SCORE<Text style={{color: Colors.primary}}>PLAY</Text></Text>
        <Text style={styles.tagline}>The Future of Cricket Analytics</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
             style={styles.input} 
             placeholder="fan@cricket.com" 
             placeholderTextColor="#666" 
             onChangeText={setEmail}
             value={email}
             autoCapitalize="none"
          />
          
          <Text style={styles.label}>Password</Text>
          {/* PASSWORD ROW WITH EYE */}
          <View style={styles.passwordRow}>
            <TextInput 
               style={styles.passInput} 
               placeholder="••••••" 
               placeholderTextColor="#666" 
               secureTextEntry={!isPasswordVisible} 
               onChangeText={setPassword}
               value={password}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeBtn}>
               <Entypo name={isPasswordVisible ? "eye" : "eye-with-line"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>
            New User? <Text style={{color: Colors.primary, fontWeight: 'bold'}}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  logoText: { fontSize: 40, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  tagline: { color: '#888', textAlign: 'center', marginBottom: 50 },
  inputContainer: { marginBottom: 30 },
  label: { color: '#ccc', marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: '#111', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  
  // Password Row Styles
  passwordRow: { 
    flexDirection: 'row', 
    backgroundColor: '#111', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#333', 
    marginBottom: 20,
    alignItems: 'center'
  },
  passInput: { flex: 1, color: '#fff', padding: 15 },
  eyeBtn: { padding: 15 },

  loginBtn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold' },
  footerText: { color: '#888', textAlign: 'center', marginTop: 20 }
});