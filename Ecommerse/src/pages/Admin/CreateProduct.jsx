import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, resetAdminStatus } from '../../features/admin/adminSlice.js';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';

const CreateProduct = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const { loading, isSuccess, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert("Success", "Product Created Successfully!");
      dispatch(resetAdminStatus());
      navigation.goBack();
    }
    if (error) {
      Alert.alert("Error", error);
      dispatch(resetAdminStatus());
    }
  }, [isSuccess, error]);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.assets) setImage(response.assets[0]);
    });
  };

  const handleSubmit = () => {
    if (!name || !price || !image) return Alert.alert("Required", "Please fill core fields and pick an image");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('images', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    dispatch(createProduct(formData));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="camera" size={30} color="#9CA3AF" />
            <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Upload Product Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Nike Air Max" />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="99.99" />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Shoes, Electronics, etc." />

      <Text style={styles.label}>Stock Quantity</Text>
      <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="50" />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        value={description} 
        onChangeText={setDescription} 
        multiline 
        placeholder="Enter product details..."
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Product</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagePicker: { width: '100%', height: 200, borderRadius: 15, backgroundColor: '#F9FAFB', borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  previewImage: { width: '100%', height: '100%', borderRadius: 15 },
  placeholder: { alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 15, marginBottom: 15, borderWeight: 1, borderColor: '#F3F4F6' },
  submitBtn: { backgroundColor: '#111827', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});

export default CreateProduct;