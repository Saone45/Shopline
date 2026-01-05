import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, deleteProduct, clearAdminError } from '../../features/admin/adminSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const ManageProducts = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Select from admin state
  const { products, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const handleDelete = (id) => {
    Alert.alert("Delete Product", "Are you sure you want to remove this item permanently?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          dispatch(deleteProduct(id));
        } 
      }
    ]);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/150' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.stockRow}>
          <Text style={[
            styles.stockText, 
            item.Stock < 10 ? {color: '#EF4444'} : {color: '#10B981'}
          ]}>
            Stock: {item.Stock}
          </Text>
        </View>
      </View>
      <View style={styles.actionColumn}>
        <TouchableOpacity 
          style={styles.editBtn} 
          onPress={() => navigation.navigate('EditProduct', { id: item._id })}
        >
          <Icon name="edit-2" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
          <Icon name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>{products?.length || 0} Products Total</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => navigation.navigate('CreateProduct')}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Products Found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  count: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  addBtn: { 
    backgroundColor: '#111827', 
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  addBtnText: { color: '#fff', marginLeft: 5, fontWeight: '800' },
  productCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 12, 
    marginBottom: 12, 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F3F4F6' },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  productPrice: { fontSize: 14, color: '#6366F1', fontWeight: '800', marginTop: 2 },
  stockRow: { marginTop: 4 },
  stockText: { fontSize: 12, fontWeight: '600' },
  actionColumn: { justifyContent: 'space-between', height: 60, paddingLeft: 10 },
  editBtn: { padding: 5 },
  deleteBtn: { padding: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF' }
});

export default ManageProducts;