import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';

const Search = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.products);

  const handleSearch = (text) => {
    setQuery(text);
    dispatch(fetchProducts({ search: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Search products..." 
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBox: { padding: 20 },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 15, fontSize: 16 },
  resultItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  resultText: { fontWeight: '500' }
});

export default Search;