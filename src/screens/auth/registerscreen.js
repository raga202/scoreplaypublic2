import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Entypo } from '@expo/vector-icons'; // Standard Icon Library

// 1. IMPORT THE KEY
import { AuthContext } from '../../context/authcontext';

export default function RegisterScreen({ navigation }) {
  // 2. STATE VARIABLES
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Toggle for the "Eye" functionality
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 3. GET THE SIGN-UP FUNCTION
  const { signUp } = useContext(AuthContext);

  const handleRegister = () => {
    if (fullName.length === 0 || email.length === 0 || password.length === 0) {
      Alert.alert("Missing Details", "Please fill in all fields to join the league.");
      return;
    }
    // Triggers the login flow
    signUp(); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>JOIN THE LEAGUE</Text>
        <Text style={styles.subHeader}>
          Get <Text style={{color: Colors.primary}}>100 Free Coins</Text> on Sign Up!
        </Text>

        {/* Full Name Input */}
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Full Name" 
            placeholderTextColor="#666"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input with EYE ICON */}
        <View style={[styles.inputWrapper, styles.passwordContainer]}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Create Password" 
            placeholderTextColor="#666" 
            secureTextEntry={!isPasswordVisible} // Logic to hide/show
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {/* Swaps between Eye and Eye-with-line */}
            <Entypo 
              name={isPasswordVisible ? "eye" : "eye-with-line"} 
              size={20} 
              color="#888" 
            />
          </TouchableOpacity>
        </View>
        
        {/* The Active Register Button */}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.btnText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 15}}>
          <Text style={styles.link}>Already have an account? <Text style={{color: Colors.primary}}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
  subHeader: { color: '#ccc', marginBottom: 40, fontSize: 16 },
  
  inputWrapper: { marginBottom: 15 },
  input: { 
    backgroundColor: '#111', 
    color: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  
  // Special Style for Password Row
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1, // Takes up remaining space
    color: '#fff',
    padding: 15,
  },
  eyeIcon: {
    padding: 15,
  },

  registerBtn: { 
    backgroundColor: Colors.primary, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  link: { color: '#888', textAlign: 'center' }
});