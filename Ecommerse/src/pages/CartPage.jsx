import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../features/cart/cartSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const CartPage = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // ✅ FIX 1: Add fallback '[]' to prevent mapping over undefined during store hydration
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
    } else {
      // Ensure 'OrderSuccess' exists in your AppNavigator or change to your checkout screen
      navigation.navigate('OrderSuccess'); 
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.imgBg}>
        <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="contain" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand || 'Premium'}</Text>
        <Text style={styles.itemPrice}>${item.price.toLocaleString()} x {item.quantity || 1}</Text>
      </View>
      <TouchableOpacity 
        // ✅ FIX 2: Ensure the ID passed matches what your slice expects (id vs _id)
        onPress={() => dispatch(removeFromCart({ id: item._id || item.id }))}
        style={styles.removeBtn}
      >
        <Icon name="trash-2" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping Bag</Text>
          <Text style={styles.itemCount}>{cartItems.length} Items</Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        // ✅ FIX 3: Robust Key Extractor to avoid the "Unique Key" console error
        keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
        contentContainerStyle={cartItems.length === 0 ? styles.emptyList : { padding: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="shopping-bag" size={40} color="#111827" />
            </View>
            <Text style={styles.emptyText}>Your bag is empty</Text>
            <Text style={styles.emptySubtext}>Looks like you haven't added anything yet.</Text>
            <TouchableOpacity style={styles.goShop} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.goShopText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 10, marginBottom: 15 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.checkoutBtn, 
              !isAuthenticated && { backgroundColor: '#3B82F6' } 
            ]}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutText}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  itemCount: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  cartCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' },
  imgBg: { width: 90, height: 90, backgroundColor: '#F9FAFB', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  thumb: { width: '75%', height: '75%' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  itemBrand: { fontSize: 12, color: '#9CA3AF', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginTop: 5 },
  removeBtn: { padding: 10 },
  footer: { 
    padding: 25, 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6', 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -10 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 5 
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#9CA3AF', fontSize: 14, fontWeight: '500' },
  summaryValue: { color: '#111827', fontWeight: '700' },
  totalLabel: { fontSize: 20, fontWeight: '900', color: '#111827' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#111827' },
  checkoutBtn: { backgroundColor: '#111827', height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyList: { flex: 1, justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', paddingHorizontal: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyText: { fontSize: 22, color: '#111827', fontWeight: '800' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  goShop: { marginTop: 30, backgroundColor: '#111827', paddingHorizontal: 35, paddingVertical: 18, borderRadius: 20, width: '100%', alignItems: 'center' },
  goShopText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CartPage;