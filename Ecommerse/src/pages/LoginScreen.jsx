import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
// Import the thunk and error clearer from your slice
import { loginUser, clearAuthError } from '../features/auth/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  
  // Get loading and error state directly from Redux
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Clear errors when the component unmounts or email changes
  useEffect(() => {
    dispatch(clearAuthError());
  }, [email, dispatch]);

  const handleAuth = async () => {
    // 1. Basic Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Required", "Please enter both email and password.");
      return;
    }

    // 2. Dispatch the real loginUser Thunk
    // This calls authService.login internally
    const result = await dispatch(loginUser({ 
      email: email.trim(), 
      password: password 
    }));

    // 3. Handle result using Redux Toolkit's matchers
    if (loginUser.fulfilled.match(result)) {
      // The state.isAuthenticated is now true, so redirect to Main
      navigation.replace('Main');
    } else if (loginUser.rejected.match(result)) {
      // result.payload contains the error message from authService
      Alert.alert("Login Failed", result.payload || "Invalid email or password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>

          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputWrap}>
              <Icon name="mail" size={20} color="#9CA3AF" />
              <TextInput 
                placeholder="Email Address" 
                style={styles.input} 
                keyboardType="email-address" 
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrap}>
              <Icon name="lock" size={20} color="#9CA3AF" />
              <TextInput 
                placeholder="Password" 
                style={styles.input} 
                secureTextEntry={!showPass} 
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Icon name={showPass ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainBtn, loading && { opacity: 0.7 }]} 
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.mainBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.toggleText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 30, flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 10, marginBottom: 40 },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 18, 
    paddingHorizontal: 20, 
    marginBottom: 15, 
    height: 60,
    borderWidth: 1, 
    borderColor: '#F3F4F6'
  },
  input: { flex: 1, marginLeft: 15, fontSize: 16, color: '#111827' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#3B82F6', fontWeight: '700', fontSize: 14 },
  mainBtn: { 
    backgroundColor: '#111827', 
    height: 65, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#6B7280' },
  toggleText: { color: '#111827', fontWeight: 'bold' }
});

export default LoginScreen;