import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
// Import the register thunk from your slice
import { registerUser } from '../features/auth/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [agree, setAgree] = useState(false);

  const dispatch = useDispatch();
  
  // Get loading state from Redux (handled by your slice matcher)
  const { loading } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    // 1. Validation
    const { name, email, password } = formData;
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    
    if (!agree) {
      Alert.alert("Terms", "Please agree to the Terms and Conditions.");
      return;
    }

    // 2. Dispatch the real registration action
    const result = await dispatch(registerUser(formData));

    // 3. Handle Result
    if (registerUser.fulfilled.match(result)) {
      // Success: Matcher sets isAuthenticated to true, redirect to 'Main'
      // navigation.replace ensures user can't go back to registration
      navigation.replace('Main');
    } else if (registerUser.rejected.match(result)) {
      // Show the error message returned from your authService/Backend
      Alert.alert("Registration Failed", result.payload || "Could not create account.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our premium community to start shopping.</Text>

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputWrap}>
            <Icon name="user" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Full Name" 
              style={styles.input} 
              editable={!loading}
              onChangeText={(val) => setFormData({...formData, name: val})}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrap}>
            <Icon name="mail" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Email Address" 
              style={styles.input} 
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              onChangeText={(val) => setFormData({...formData, email: val})}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrap}>
            <Icon name="lock" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Password" 
              style={styles.input} 
              secureTextEntry 
              editable={!loading}
              onChangeText={(val) => setFormData({...formData, password: val})}
            />
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity 
            style={styles.termsRow} 
            onPress={() => setAgree(!agree)}
            disabled={loading}
          >
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <Icon name="check" size={12} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.mainBtn, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mainBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.toggleText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... Your styles were perfect, I kept them identical ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 30 },
  backBtn: { marginBottom: 30, marginLeft: -10, padding: 10 },
  title: { fontSize: 32, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 10, marginBottom: 40 },
  inputWrap: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', 
    borderRadius: 18, paddingHorizontal: 20, marginBottom: 15, height: 65,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  input: { flex: 1, marginLeft: 15, fontSize: 16, color: '#111827' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#E5E7EB', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#111827', borderColor: '#111827' },
  termsText: { color: '#6B7280', fontSize: 14 },
  link: { color: '#111827', fontWeight: 'bold' },
  mainBtn: { backgroundColor: '#111827', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: '#6B7280' },
  toggleText: { color: '#111827', fontWeight: 'bold' }
});

export default RegisterScreen;