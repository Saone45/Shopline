import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

const AddressScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  // Assuming your backend stores address in user.shippingInfo
  const address = user?.shippingInfo;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Default Shipping Address</Text>
        
        {address ? (
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Icon name="map-pin" size={20} color="#111827" />
              <Text style={styles.addressType}>Home</Text>
            </View>
            <Text style={styles.addressName}>{user?.name}</Text>
            <Text style={styles.addressText}>{address.address}</Text>
            <Text style={styles.addressText}>{`${address.city}, ${address.state} ${address.pinCode}`}</Text>
            <Text style={styles.addressText}>{address.country}</Text>
            <Text style={styles.phoneText}>Phone: {address.phoneNo}</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="map" size={50} color="#D1D5DB" />
            <Text style={styles.emptyText}>No address found</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => console.log("Navigate to Add Address form")}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 15 },
  addressCard: { 
    padding: 20, 
    borderRadius: 20, 
    backgroundColor: '#F9FAFB', 
    borderWidth: 1, 
    borderColor: '#F3F4F6' 
  },
  addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  addressType: { fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  addressName: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  addressText: { color: '#4B5563', lineHeight: 22 },
  phoneText: { marginTop: 10, fontWeight: '500' },
  addBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#111827', 
    padding: 18, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20 
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#9CA3AF' }
});

export default AddressScreen;