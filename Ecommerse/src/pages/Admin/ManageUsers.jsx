import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserRole, deleteUser, clearAdminError } from '../../features/admin/adminSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const ManageUsers = () => {
  const dispatch = useDispatch();
  // Pulling state from the admin slice
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handle errors if they occur
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(clearAdminError());
    }
  }, [error]);

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    Alert.alert(
      "Change Permissions", 
      `Are you sure you want to change this user to ${newRole}?`, 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Change", 
          onPress: () => dispatch(updateUserRole({ userId, role: newRole })) 
        }
      ]
    );
  };

  const handleDeleteUser = (id) => {
    Alert.alert(
      "Delete User", 
      "This action is permanent. The user will be removed from the database.", 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Forever", 
          style: 'destructive', 
          onPress: () => dispatch(deleteUser(id)) 
        }
      ]
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userIconBg}>
        <Text style={styles.userLetter}>
          {item.name ? item.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
        <View style={[
          styles.roleBadge, 
          { backgroundColor: item.role === 'Admin' ? '#EEF2FF' : '#F3F4F6' }
        ]}>
          <Text style={[
            styles.roleText, 
            { color: item.role === 'Admin' ? '#4F46E5' : '#6B7280' }
          ]}>
            {item.role}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => handleRoleChange(item._id, item.role)} 
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Icon name="shield" size={20} color="#6366F1" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleDeleteUser(item._id)} 
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Icon name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Show loader only on first mount if no users exist */}
      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Fetching Users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={() => dispatch(getAllUsers())} 
              colors={['#111827']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="users" size={50} color="#D1D5DB" />
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingBottom: 40 },
  userCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12, 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2 
  },
  userIconBg: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  userLetter: { fontSize: 18, fontWeight: '800', color: '#111827' },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  userEmail: { fontSize: 13, color: '#9CA3AF', marginBottom: 6 },
  roleBadge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6 
  },
  roleText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { 
    marginLeft: 10, 
    padding: 8, 
    backgroundColor: '#F9FAFB', 
    borderRadius: 10 
  },
  loadingText: { marginTop: 10, color: '#6B7280', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#9CA3AF', fontSize: 16 }
});

export default ManageUsers;