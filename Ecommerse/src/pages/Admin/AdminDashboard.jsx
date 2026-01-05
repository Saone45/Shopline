import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../features/admin/adminSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const AdminDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const StatCard = ({ title, value, icon, color, growth }) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardLabel}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {growth && (
        <View style={styles.growthContainer}>
          <Text style={[styles.growthText, { color: growth.includes('+') ? '#10B981' : '#EF4444' }]}>
            {growth} <Text style={{color: '#9CA3AF', fontWeight: '400'}}>vs last month</Text>
          </Text>
        </View>
      )}
    </View>
  );

  if (loading && !stats) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#111827" /></View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchDashboardStats())} />}
      >
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.row}>
          <StatCard 
            title="Total Revenue" 
            value={`$${stats?.totalRevenueAllTime?.toLocaleString() || 0}`} 
            icon="dollar-sign" 
            color="#10B981" 
            growth={stats?.revenueGrowth}
          />
          <StatCard 
            title="Today's Sales" 
            value={`$${stats?.todayRevenue || 0}`} 
            icon="trending-up" 
            color="#6366F1" 
          />
        </View>

        <Text style={styles.sectionTitle}>Inventory & Users</Text>
        <View style={styles.row}>
          <StatCard 
            title="Total Customers" 
            value={stats?.totalUserCount || 0} 
            icon="users" 
            color="#F59E0B" 
          />
          <StatCard 
            title="Low Stock Alert" 
            value={stats?.lowStockProduct?.length || 0} 
            icon="alert-circle" 
            color="#EF4444" 
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Management</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManageProducts')}>
            <Icon name="box" size={24} color="#111827" />
            <Text style={styles.actionText}>Products</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManageOrders')}>
            <Icon name="shopping-bag" size={24} color="#111827" />
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManageUsers')}>
            <Icon name="users" size={24} color="#111827" />
            <Text style={styles.actionText}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManageReviews')}>
            <Icon name="message-square" size={24} color="#111827" />
            <Text style={styles.actionText}>Reviews</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Best Sellers</Text>
        <View style={styles.listCard}>
          {stats?.topSellingProduct?.length > 0 ? (
             stats.topSellingProduct.map((item, index) => (
                <View key={index} style={[styles.listItem, index === stats.topSellingProduct.length - 1 && { borderBottomWidth: 0 }]}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.category}</Text>
                  </View>
                  <Text style={styles.itemSold}>{item.total_sold} Sold</Text>
                </View>
              ))
          ) : (
            <Text style={{ padding: 20, textAlign: 'center', color: '#9CA3AF' }}>No sales data yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconCircle: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  cardValue: { fontSize: 18, fontWeight: '800', color: '#111827', marginVertical: 4 },
  growthContainer: { marginTop: 4 },
  growthText: { fontSize: 10, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { 
    backgroundColor: '#fff', 
    width: '23%', // Adjusted to fit 4 buttons in a row
    paddingVertical: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#F3F4F6',
    marginBottom: 10
  },
  actionText: { fontSize: 10, fontWeight: '700', color: '#111827', marginTop: 8 },
  listCard: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, marginBottom: 30 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  itemSub: { fontSize: 12, color: '#9CA3AF' },
  itemSold: { fontSize: 14, fontWeight: '800', color: '#6366F1' }
});

export default AdminDashboard;