import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset New Password

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Icon name={step === 1 ? "mail" : "shield"} size={40} color="#111827" />
        </View>

        <Text style={styles.title}>{step === 1 ? 'Forgot Password?' : 'Reset Password'}</Text>
        <Text style={styles.subtitle}>
          {step === 1 
            ? "Enter your email and we'll send you instructions to reset your password." 
            : "Choose a strong password for your account."}
        </Text>

        {step === 1 ? (
          <View style={styles.inputWrap}>
            <Icon name="mail" size={20} color="#9CA3AF" />
            <TextInput placeholder="Email Address" style={styles.input} />
          </View>
        ) : (
          <>
            <View style={styles.inputWrap}>
              <Icon name="lock" size={20} color="#9CA3AF" />
              <TextInput placeholder="New Password" style={styles.input} secureTextEntry />
            </View>
            <View style={styles.inputWrap}>
              <Icon name="check-circle" size={20} color="#9CA3AF" />
              <TextInput placeholder="Confirm New Password" style={styles.input} secureTextEntry />
            </View>
          </>
        )}

        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={() => step === 1 ? setStep(2) : navigation.navigate('Login')}
        >
          <Text style={styles.mainBtnText}>{step === 1 ? 'Send Reset Link' : 'Update Password'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... reuse styles from LoginScreen + adjustments
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 30 },
  backBtn: { marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 10, marginBottom: 40, lineHeight: 24 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 18, paddingHorizontal: 20, marginBottom: 15, height: 60 },
  input: { flex: 1, marginLeft: 15, fontSize: 16 },
  mainBtn: { backgroundColor: '#111827', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ForgotPassword;