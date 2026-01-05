import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = ({ width, height, borderRadius = 10 }) => {
  const opacity = new Animated.Value(0.3);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ])
  ).start();

  return (
    <Animated.View 
      style={[{ width, height, borderRadius, backgroundColor: '#E5E7EB', opacity }]} 
    />
  );
};

export default SkeletonLoader;