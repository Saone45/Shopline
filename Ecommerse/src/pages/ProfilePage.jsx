import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { logoutUser } from '../features/auth/authSlice.js'; 

const ProfilePage = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const menuItems = [
    { title: 'My Orders', icon: 'package', screen: 'OrdersHistory' },
    { title: 'Shipping Address', icon: 'map-pin', screen: 'Address' },
    { title: 'Payment Methods', icon: 'credit-card', screen: 'Payment' },
    { title: 'Support', icon: 'headphones', screen: 'Support' },
    { title: 'Settings', icon: 'settings', screen: 'Settings' },
  ];

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => dispatch(logoutUser()) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isAuthenticated ? (
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              {user?.avatar?.url ? (
                <Image source={{ uri: user.avatar.url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Guest'}</Text>
          </View>
        ) : (
          <View style={styles.guestBanner}>
            <Text style={styles.guestTitle}>Welcome to SHOPLINE</Text>
            <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInBtnText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- ADMIN ACCESS CARD (CORRECTED) --- */}
        {isAuthenticated && user?.role === 'Admin' && (
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={styles.sectionLabel}>Administrator</Text>
            <TouchableOpacity 
              style={styles.adminCard} 
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <View style={styles.adminContent}>
                <View style={styles.adminIconBg}><Icon name="command" size={20} color="#fff" /></View>
                <View>
                  <Text style={styles.adminTitle}>Admin Dashboard</Text>
                  <Text style={styles.adminSub}>Manage products & analytics</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuBox}>
          <Text style={styles.sectionLabel}>Account Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
              <View style={styles.menuLeft}>
                <View style={styles.iconBg}><Icon name={item.icon} size={18} color="#111827" /></View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { alignItems: 'center', paddingVertical: 40 },
  avatarWrapper: { marginBottom: 15 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: 32, fontWeight: '800', color: '#111827' },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  userName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  userEmail: { fontSize: 14, color: '#9CA3AF' },
  // ADMIN CARD STYLES
  adminCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: 20, borderRadius: 15 },
  adminContent: { flexDirection: 'row', alignItems: 'center' },
  adminIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  adminTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  adminSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  // MENU STYLES
  menuBox: { paddingHorizontal: 20, marginTop: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginBottom: 10, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  logoutBtn: { marginTop: 20, padding: 20, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '800' },
  guestBanner: { padding: 40, alignItems: 'center' },
  signInBtn: { backgroundColor: '#111827', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  signInBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default ProfilePage;