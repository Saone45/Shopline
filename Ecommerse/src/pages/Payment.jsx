import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useStripe } from '@stripe/stripe-react-native'; // Standard for Stripe Mobile
import { resetOrderState } from '../features/orders/orderSlice';
import Icon from 'react-native-vector-icons/Feather';

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get paymentIntent secret from your orderSlice
  const { paymentIntent, loading } = useSelector((state) => state.orders);

  const handleStripePayment = async () => {
    if (!paymentIntent) {
      Alert.alert("Error", "No active payment session found.");
      return;
    }

    setIsProcessing(true);

    // 1. Initialize the Payment Sheet
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent, // This is the client_secret from your backend
      merchantDisplayName: 'Shopline Mobile',
    });

    if (initError) {
      Alert.alert("Init Error", initError.message);
      setIsProcessing(false);
      return;
    }

    // 2. Present the Payment Sheet to the user
    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      Alert.alert("Payment Failed", presentError.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
      dispatch(resetOrderState()); // Clear the state after success
      navigation.navigate('OrdersHistory');
    }
    
    setIsProcessing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="shield" size={40} color="#10B981" />
        <Text style={styles.title}>Secure Checkout</Text>
        <Text style={styles.subtitle}>
          Your payment is processed securely via Stripe.
        </Text>

        <TouchableOpacity 
          style={[styles.payBtn, isProcessing && { opacity: 0.7 }]} 
          onPress={handleStripePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="credit-card" size={20} color="#fff" />
              <Text style={styles.payBtnText}>Pay Now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 24, alignItems: 'center', elevation: 4 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 15, color: '#111827' },
  subtitle: { textAlign: 'center', color: '#6B7280', marginTop: 10, lineHeight: 20 },
  payBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#111827', 
    width: '100%', 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30 
  },
  payBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});

export default PaymentScreen;