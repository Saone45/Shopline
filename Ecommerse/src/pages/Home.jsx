import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, clearSelectedProduct } from '../features/products/productSlice.js';
import Icon from 'react-native-vector-icons/Feather';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  // Using 'items' from your productSlice state
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductPress = (productId) => {
    // 1. Immediately clear old product details to prevent "ghost" data/buffering issues
    dispatch(clearSelectedProduct());
    // 2. Navigate passing only the ID as expected by ProductPage
    navigation.navigate('ProductDetails', { id: productId });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleProductPress(item._id)}
    >
      <View style={styles.imageBox}>
        <Image 
          source={{ uri: item.images?.[0]?.url || item.image }} 
          style={styles.img} 
          resizeMode="contain" 
        />
        <TouchableOpacity style={styles.heartBtn}>
          <Icon name="heart" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand || 'PREMIUM'}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>${item.price?.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.sectionHeader}>
              <View style={styles.flashRow}>
                <Text style={styles.title}>Flash Sale</Text>
                <View style={styles.timer}><Text style={styles.timerText}>02:45:12</Text></View>
              </View>
              <Text style={styles.seeAll}>See All</Text>
            </View>

            {/* Horizontal Categories */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[...new Set(items?.map(i => i.category))]}
              renderItem={({ item }) => (
                <View style={styles.catItem}>
                  <TouchableOpacity style={styles.circle}>
                    <Icon name="tag" size={20} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.catText}>{item || 'General'}</Text>
                </View>
              )}
              style={{ marginBottom: 20 }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        }
        data={items}
        renderItem={renderProduct}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  flashRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  timer: { backgroundColor: '#111827', padding: 5, borderRadius: 6, marginLeft: 10 },
  timerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  seeAll: { color: '#9CA3AF', fontWeight: '600' },
  catItem: { alignItems: 'center', marginRight: 20 },
  circle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  catText: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginTop: 8 },
  card: { flex: 0.5, margin: 10 },
  imageBox: { backgroundColor: '#F3F4F6', borderRadius: 28, height: 180, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  img: { width: '80%', height: '80%' },
  heartBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', padding: 6, borderRadius: 20 },
  info: { paddingVertical: 10 },
  brand: { fontSize: 10, color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' },
  name: { fontSize: 15, fontWeight: '600', color: '#111827', marginTop: 2 },
  price: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 4 }
});

export default Home;