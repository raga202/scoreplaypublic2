import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authcontext'; 
import CricketLogo from '../../components/cricketlogo';

export default function LoginScreen({ navigation }) {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if(email.trim().length === 0 || password.trim().length === 0) {
      alert("Please enter credentials");
      return;
    }
    const success = await login(email, password);
    if (success) { navigation.navigate('MainTabs'); }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <View style={styles.branding}>
            <CricketLogo size={180} />
            <Text style={styles.brandTitle}>Score<Text style={styles.brandPlay}>Play</Text></Text>
            <Text style={styles.tagline}>PRECISION ANALYTICS</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="EMAIL ADDRESS" placeholderTextColor="#636e72" value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="PASSWORD" placeholderTextColor="#636e72" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#b2bec3" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginText}>SIGN IN</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>DON'T HAVE AN ACCOUNT? <Text style={styles.linkAccent}>JOIN NOW</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  keyboardView: { flex: 1, justifyContent: 'center' },
  formContainer: { padding: 45 },
  branding: { alignItems: 'center', marginBottom: 50 },
  brandTitle: { fontSize: 48, fontWeight: '900', color: '#FFF', marginTop: 15 },
  brandPlay: { fontWeight: '400', color: '#A4D146' },
  tagline: { color: '#555', fontSize: 11, letterSpacing: 6, marginTop: -5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2d3436', marginBottom: 30 },
  inputField: { flex: 1, color: '#FFF', paddingVertical: 15, fontSize: 16 },
  eyeIcon: { padding: 10 },
  loginBtn: { backgroundColor: '#FFF', padding: 18, borderRadius: 4, alignItems: 'center', marginBottom: 30, marginTop: 20 },
  loginText: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 },
  linkText: { color: '#636e72', textAlign: 'center', fontSize: 11 },
  linkAccent: { color: '#FFF', fontWeight: 'bold' }
});