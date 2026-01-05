import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useStripePayment } from '../components/checkout/StripeNative.js';
import { clearCart } from '../features/cart/cartSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const CheckoutPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // DYNAMIC DATA FROM REDUX
  const { cartItems, totalAmount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { initializePayment, openPaymentSheet } = useStripePayment();

  // CALCULATIONS (Not hardcoded)
  const shipping = totalAmount > 500 ? 0 : 25;
  const tax = totalAmount * 0.08; // 8% Tax
  const finalTotal = totalAmount + shipping + tax;

  useEffect(() => {
    const setup = async () => {
      if (totalAmount > 0) {
        const { error } = await initializePayment(Math.round(finalTotal * 100)); // Stripe expects cents
        if (error) Alert.alert('Payment Error', 'Stripe could not be initialized.');
      }
    };
    setup();
  }, [finalTotal]);

  const handlePay = async () => {
    setIsProcessing(true);
    const { error } = await openPaymentSheet();
    
    if (error) {
      Alert.alert(`Payment Failed`, error.message);
      setIsProcessing(false);
    } else {
      dispatch(clearCart());
      navigation.navigate('OrderSuccess'); // Use the professional success page we built
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#0A1121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Order</Text>

        {/* DYNAMIC SHIPPING CARD */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Shipping To</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Address')}>
            <Text style={styles.editText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.iconCircle}>
            <Icon name="map-pin" size={20} color="#0A1121" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.userName}>{user?.name || 'Valued Customer'}</Text>
            <Text style={styles.addressText}>{user?.address || 'No address saved in profile.'}</Text>
          </View>
        </View>

        {/* PRICE BREAKDOWN */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionLabel}>Payment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>${totalAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Tax</Text>
              <Text style={styles.value}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Shipping</Text>
              <Text style={styles.value}>{shipping === 0 ? 'FREE' : `$${shipping}`}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>${finalTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* DYNAMIC BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.payBtn, isProcessing && styles.disabledBtn]} 
          onPress={handlePay}
          disabled={isProcessing || !user?.address}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payText}>Confirm & Pay ${finalTotal.toLocaleString()}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: { padding: 25 },
  backBtn: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0A1121', marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#0A1121' },
  editText: { color: '#3B82F6', fontWeight: 'bold' },
  addressCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#F9FAFB', borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  addressInfo: { marginLeft: 15, flex: 1 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#0A1121' },
  addressText: { color: '#6B7280', fontSize: 13, marginTop: 4, lineHeight: 18 },
  summaryContainer: { marginTop: 30 },
  summaryCard: { padding: 20, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#9CA3AF', fontSize: 15 },
  value: { color: '#0A1121', fontWeight: '700', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#0A1121' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#0A1121' },
  footer: { padding: 25, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  payBtn: { backgroundColor: '#0A1121', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  disabledBtn: { backgroundColor: '#9CA3AF' },
  payText: { color: '#fff', fontWeight: '800', fontSize: 18 }
});

export default CheckoutPage;