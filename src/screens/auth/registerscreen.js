import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authcontext'; 
import CricketLogo from '../../components/cricketlogo';

export default function RegisterScreen({ navigation }) {
  const { signup, isLoading } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if(fullName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      alert("Please fill all fields");
      return;
    }
    const success = await signup(fullName, email, password);
    if (success) { navigation.navigate('MainTabs'); }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <View style={styles.branding}>
             <CricketLogo size={130} />
             <Text style={styles.regTitle}>Score<Text style={styles.regTitlePlay}>Play</Text></Text>
             <Text style={styles.subtitle}>CREATE NEW ACCOUNT</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="FULL NAME" placeholderTextColor="#636e72" value={fullName} onChangeText={setFullName} />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="EMAIL" placeholderTextColor="#636e72" value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} placeholder="PASSWORD" placeholderTextColor="#636e72" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#b2bec3" />
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
  branding: { alignItems: 'center', marginBottom: 40 },
  regTitle: { color: '#FFF', fontSize: 36, fontWeight: '900', marginTop: 15 },
  regTitlePlay: { fontWeight: '400', color: '#A4D146' },
  subtitle: { color: '#444', fontSize: 10, letterSpacing: 6, marginTop: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2d3436', marginBottom: 25 },
  inputField: { flex: 1, color: '#FFF', paddingVertical: 12, fontSize: 14 },
  eyeIcon: { padding: 10 },
  regBtn: { backgroundColor: '#A4D146', padding: 18, borderRadius: 4, alignItems: 'center', marginBottom: 25, marginTop: 10 },
  regBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 },
  linkText: { color: '#636e72', textAlign: 'center', fontSize: 12 },
  linkAccent: { color: '#FFF', fontWeight: 'bold' }
});