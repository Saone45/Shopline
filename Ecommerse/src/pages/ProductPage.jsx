import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../features/products/productSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const ProductPage = ({ route, navigation }) => {
  const { id } = route.params; 
  const dispatch = useDispatch();
  
  // Accessing state from productSlice
  const { selectedItem: product, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    // Reset state and fetch fresh data
    dispatch(clearSelectedProduct());
    dispatch(fetchProductById(id));

    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  // STOPS THE INFINITE BUFFERING
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{marginTop: 10}}>Loading Product Details...</Text>
      </View>
    );
  }

  // SHOWS ERROR INSTEAD OF BLANK SCREEN
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{color: 'red', textAlign: 'center', padding: 20}}>
          {typeof error === 'string' ? error : "Error loading product"}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontWeight: 'bold', color: '#111827'}}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <Icon name="heart" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images?.[0]?.url || product.image }} 
            style={styles.image} 
            resizeMode="contain" 
          />
        </View>
        
        <View style={styles.details}>
          <Text style={styles.brand}>{product.brand || 'Premium Selection'}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price?.toLocaleString()}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.desc}>{product.description || 'No description available for this item.'}</Text>
          
          {/* Reviews Section Placeholder - Optional based on your backend response */}
          {product.reviews && product.reviews.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Reviews ({product.reviews.length})</Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* Persistent Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartBtnText}>Add to Bag</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  imageContainer: { backgroundColor: '#F3F4F6', marginHorizontal: 20, borderRadius: 20, height: 350, justifyContent: 'center' },
  image: { width: '100%', height: '80%' },
  details: { padding: 20 },
  brand: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 10 },
  price: { fontSize: 22, color: '#111827', fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  desc: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  cartBtn: { backgroundColor: '#111827', padding: 18, borderRadius: 15, alignItems: 'center' },
  cartBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});

export default ProductPage;