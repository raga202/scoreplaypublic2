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

export default function LoginScreen({ navigation }) {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // static require so Metro bundles it; file should be at ./assets/logo-black.png
  let LOGO = null;
  try {
    LOGO = require('../../../assets/logo-black.png');
  } catch (e) {
    LOGO = null;
  }

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password');
      return;
    }
    const result = await login(email.trim(), password);
    if (!result?.success) {
      alert('Login failed');
    }
    // RootNavigatorContent will react to AuthProvider state change
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.formContainer}>
          <View style={styles.branding}>
            {LOGO ? (
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            ) : (
              <View style={styles.textLogo}>
                <Text style={styles.brandTitle}>
                  Score<Text style={styles.brandPlay}>Play</Text>
                </Text>
              </View>
            )}

            {/* Wordmark below — same visual style as splash / previous version */}
            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkPrimary}>Score</Text>
              <Text style={styles.wordmarkAccent}>Play</Text>
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="EMAIL ADDRESS"
              placeholderTextColor="#636e72"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="PASSWORD"
              placeholderTextColor="#636e72"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#b2bec3" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginText}>SIGN IN</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              DON'T HAVE AN ACCOUNT? <Text style={styles.linkAccent}>JOIN NOW</Text>
            </Text>
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

  // Branding: fixed height so enlarged logo does not push content below.
  branding: { alignItems: 'center', marginBottom: 30, height: 180, justifyContent: 'center' },

  // Logo enlarged, absolutely positioned inside branding so it doesn't affect flow
  logoImage: {
    position: 'absolute',
    top: 8,
    width: Math.min(360, Math.round(SCREEN_W * 0.78)),
    height: 120,
  },

  textLogo: { alignItems: 'center' },
  brandTitle: { fontSize: 36, fontWeight: '900', color: '#FFF' },
  brandPlay: { fontWeight: '900', color: '#A4D146' },

  // Wordmark below (kept at same position inside branding)
  wordmark: { position: 'absolute', bottom: 8, fontSize: 36, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  wordmarkPrimary: { color: '#fff' },
  wordmarkAccent: { color: '#A4D146' },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2d3436', marginBottom: 30 },
  inputField: { flex: 1, color: '#FFF', paddingVertical: 12, fontSize: 16 },
  eyeIcon: { padding: 10 },
  loginBtn: { backgroundColor: '#FFF', padding: 16, borderRadius: 4, alignItems: 'center', marginBottom: 30, marginTop: 8 },
  loginText: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 },
  linkText: { color: '#636e72', textAlign: 'center', fontSize: 11 },
  linkAccent: { color: '#FFF', fontWeight: 'bold' },
});