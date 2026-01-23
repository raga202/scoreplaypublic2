import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authcontext';

const { width: SCREEN_W } = require('react-native').Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const { signup, isLoading } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // static require for logo; file should be at ./assets/logo-black.png
  let LOGO = null;
  try {
    LOGO = require('../../../assets/logo-black.png');
  } catch (e) {
    LOGO = null;
  }

  const handleRegister = async () => {
    if (fullName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      alert('Please fill all fields');
      return;
    }
    const result = await signup(fullName.trim(), email.trim(), password);
    if (!result || !result.success) {
      alert('Registration failed. Please try again.');
    }
    // AuthProvider will update app state and RootNavigatorContent will route on success
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <View style={styles.branding}>
            {LOGO ? (
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            ) : (
              <View style={styles.textLogo}>
                <Text style={styles.regTitle}>
                  Score<Text style={styles.regTitlePlay}>Play</Text>
                </Text>
              </View>
            )}

            {/* Wordmark below */}
            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkPrimary}>Score</Text>
              <Text style={styles.wordmarkAccent}>Play</Text>
            </Text>

            <Text style={styles.tagline}>PRECISION ANALYTICS</Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="FULL NAME" placeholderTextColor="#636e72" value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="EMAIL" placeholderTextColor="#636e72" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="PASSWORD" placeholderTextColor="#636e72" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#b2bec3" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.regBtn} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.regBtnText}>START JOURNEY</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>ALREADY REGISTERED? <Text style={styles.linkAccent}>LOG IN</Text></Text>
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

  // Branding container with fixed height so enlarged logo doesn't push text down
  branding: { alignItems: 'center', marginBottom: 30, height: 200, justifyContent: 'center' },

  // Larger logo, absolutely positioned
  logoImage: {
    position: 'absolute',
    top: 6,
    width: Math.min(380, Math.round(SCREEN_W * 0.8)),
    height: 120,
  },

  textLogo: { alignItems: 'center' },
  regTitle: { fontSize: 36, fontWeight: '900', color: '#FFF' },
  regTitlePlay: { fontWeight: '900', color: '#A4D146' },

  // Wordmark below (kept stable)
  wordmark: { position: 'absolute', bottom: 34, fontSize: 36, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  wordmarkPrimary: { color: '#fff' },
  wordmarkAccent: { color: '#A4D146' },

  tagline: { color: '#555', fontSize: 11, letterSpacing: 6, marginTop: 6 },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2d3436', marginBottom: 18 },
  inputField: { flex: 1, color: '#FFF', paddingVertical: 12, fontSize: 14 },
  eyeIcon: { padding: 10 },
  regBtn: { backgroundColor: '#A4D146', padding: 16, borderRadius: 4, alignItems: 'center', marginBottom: 18, marginTop: 8 },
  regBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 },
  linkText: { color: '#636e72', textAlign: 'center', fontSize: 11 },
  linkAccent: { color: '#FFF', fontWeight: 'bold' },
});