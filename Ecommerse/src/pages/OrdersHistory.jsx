import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/orders/orderSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const OrdersHistory = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Mapping 'list' from your orderSlice
  const { list, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return { color: '#10B981', bg: '#ECFDF5' };
    if (s === 'processing' || s === 'pending') return { color: '#3B82F6', bg: '#EFF6FF' };
    if (s === 'shipped') return { color: '#8B5CF6', bg: '#F5F3FF' };
    if (s === 'cancelled') return { color: '#EF4444', bg: '#FEF2F2' };
    return { color: '#6B7280', bg: '#F9FAFB' };
  };

  const renderOrderItem = ({ item }) => {
    // Note: Using item.orderStatus and item._id to match typical MERN backend
    const statusStyle = getStatusStyle(item.orderStatus);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        // Navigate to a details page if you have one, else Home
        onPress={() => navigation.navigate('Home')} 
      >
        <View style={styles.cardHeader}>
          <View>
            {/* Using _id from MongoDB and slicing for readability */}
            <Text style={styles.orderId}>Order #{item._id?.slice(-6).toUpperCase()}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.orderStatus || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.itemPreview}>
            <Icon name="package" size={16} color="#9CA3AF" />
            <Text style={styles.itemCount}> {item.orderItems?.length || 0} Items</Text>
          </View>
          <Text style={styles.price}>${item.totalPrice?.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item._id} // Using MongoDB _id
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}><Icon name="clipboard" size={40} color="#D1D5DB" /></View>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySub}>Your order history is currently empty.</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.shopBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { padding: 5, marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontWeight: '800', color: '#111827', fontSize: 16 },
  orderDate: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPreview: { flexDirection: 'row', alignItems: 'center' },
  itemCount: { fontSize: 14, color: '#6B7280' },
  price: { fontWeight: '900', color: '#111827', fontSize: 18 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  emptySub: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
  shopBtn: { marginTop: 25, backgroundColor: '#111827', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 16 },
  shopBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default OrdersHistory;