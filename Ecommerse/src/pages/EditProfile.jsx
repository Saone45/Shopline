import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  // Local state initialized with current user data from Redux
  const [name, setName] = useState(user?.name || '');

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Name field cannot be empty");
      return;
    }

    // Call the Redux update action
    const result = await dispatch(updateProfile({ name: name.trim() }));

    if (updateProfile.fulfilled.match(result)) {
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Automatically updates ProfilePage because it listens to Redux
    } else {
      Alert.alert("Update Failed", result.payload || "Could not update profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrap}>
          <Icon name="user" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
          onPress={handleUpdate} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  backBtn: { padding: 5 },
  form: { padding: 25 },
  label: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 10 },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30
  },
  input: { flex: 1, marginLeft: 15, fontSize: 16, color: '#111827' },
  saveBtn: { 
    backgroundColor: '#111827', 
    height: 60, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default EditProfileScreen;