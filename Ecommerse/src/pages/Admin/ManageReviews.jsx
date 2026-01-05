import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, deleteReview } from '../../features/admin/adminSlice';
import Icon from 'react-native-vector-icons/Feather';

const ManageReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleDelete = (reviewId, productId) => {
    Alert.alert("Delete Review", "Remove this review from the product?", [
      { text: "Cancel" },
      { 
        text: "Delete", 
        style: 'destructive', 
        onPress: () => dispatch(deleteReview({ reviewId, productId })) 
      }
    ]);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon key={i} name="star" size={12} color={i < rating ? "#F59E0B" : "#D1D5DB"} solid={i < rating} />
    ));
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.starRow}>{renderStars(item.rating)}</View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id, item.productId)} style={styles.deleteBtn}>
          <Icon name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.productRef}>Product ID: {item.productId?.slice(-6).toUpperCase()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !reviews.length ? (
        <ActivityIndicator size="large" color="#111827" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={renderReview}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No reviews to moderate.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  reviewCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userName: { fontWeight: '700', fontSize: 14, color: '#111827' },
  starRow: { flexDirection: 'row', marginTop: 4 },
  comment: { marginTop: 10, color: '#4B5563', fontSize: 13, lineHeight: 18 },
  productRef: { marginTop: 10, fontSize: 10, color: '#9CA3AF', fontStyle: 'italic' },
  empty: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' }
});

export default ManageReviews;