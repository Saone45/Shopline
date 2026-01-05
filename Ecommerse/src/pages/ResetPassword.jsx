import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ResetPassword = ({ navigation }) => {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleReset = () => {
    if (pass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if (pass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    Alert.alert("Success", "Password updated successfully!", [
      { text: "Login Now", onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="lock" size={40} color="#111827" />
        </View>
        
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>Please enter a new password for your account.</Text>

        <View style={styles.inputWrap}>
          <Icon name="key" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="New Password" 
            style={styles.input} 
            secureTextEntry 
            onChangeText={setPass}
          />
        </View>

        <View style={styles.inputWrap}>
          <Icon name="check-circle" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Confirm Password" 
            style={styles.input} 
            secureTextEntry 
            onChangeText={setConfirmPass}
          />
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={handleReset}>
          <Text style={styles.mainBtnText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 30, flex: 1, justifyContent: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 10, marginBottom: 40 },
  inputWrap: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', 
    borderRadius: 18, paddingHorizontal: 20, marginBottom: 15, height: 65,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  input: { flex: 1, marginLeft: 15, fontSize: 16 },
  mainBtn: { backgroundColor: '#111827', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ResetPassword;