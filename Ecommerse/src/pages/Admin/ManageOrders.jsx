import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../features/admin/adminSlice';
import Icon from 'react-native-vector-icons/Feather';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#10B981';
      case 'shipped': return '#6366F1';
      case 'processing': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const handleUpdate = (status) => {
    dispatch(updateOrderStatus({ orderId: selectedOrder._id, status }));
    setSelectedOrder(null);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>ID: #{item._id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.order_status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.order_status) }]}>{item.order_status}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {item.order_items?.map((prod, idx) => (
          <Text key={idx} style={styles.itemText}>• {prod.name} (x{prod.quantity})</Text>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.price}>${item.total_price}</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => setSelectedOrder(item)}
        >
          <Text style={styles.actionBtnText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && !orders.length ? (
        <ActivityIndicator size="large" color="#111827" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
        />
      )}

      <Modal visible={!!selectedOrder} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Order Status</Text>
            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <TouchableOpacity 
                key={status} 
                style={styles.statusOption} 
                onPress={() => handleUpdate(status)}
              >
                <Text style={styles.statusOptionText}>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.cancelBtn}>
              <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  orderCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: '800', color: '#111827' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  itemsList: { marginVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  itemText: { fontSize: 13, color: '#4B5563', marginBottom: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  label: { fontSize: 11, color: '#9CA3AF' },
  price: { fontSize: 16, fontWeight: '800', color: '#111827' },
  actionBtn: { backgroundColor: '#111827', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  statusOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  statusOptionText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  cancelBtn: { marginTop: 20, alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' }
});

export default ManageOrders;