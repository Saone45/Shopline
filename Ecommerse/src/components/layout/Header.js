import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, showBack = true }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : <View style={{width: 20}} />}
      
      <Text style={styles.title}>{title}</Text>
      <View style={{width: 20}} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0A1121' },
  backArrow: { fontSize: 24, color: '#0A1121' }
});

export default Header;