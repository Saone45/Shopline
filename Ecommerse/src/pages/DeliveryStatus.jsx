import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

const DeliveryStatus = ({ route, navigation }) => {
  // 1. Get real order data from Redux
  const { orderId } = route.params || {};
  const order = useSelector(state => 
    state.orders.list.find(o => o.id === orderId)
  );

  // 2. Define business status sequence
  const statusSequence = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  
  // 3. Logic to determine if a step is finished based on order.status
  const currentStatusIndex = statusSequence.indexOf(order?.status || 'Confirmed');

  const steps = statusSequence.map((step, index) => ({
    title: step,
    // If current status is 'Shipped', index 0 and 1 are completed
    completed: index <= currentStatusIndex,
    time: index <= currentStatusIndex ? (order?.updatedAt || 'Recently') : 'Pending',
    isCurrent: index === currentStatusIndex
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#0A1121" />
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 25 }}>
        {/* Order ID Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoValue}>#{orderId?.slice(-8).toUpperCase() || 'N/A'}</Text>
        </View>

        <View style={styles.trackingContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.lineColumn}>
                {/* Dot with "Current" Pulse effect */}
                <View style={[
                  styles.circle, 
                  step.completed ? styles.circleActive : styles.circleInactive,
                  step.isCurrent && styles.circleCurrent
                ]}>
                  {step.completed && !step.isCurrent && <Icon name="check" size={10} color="#fff" />}
                </View>
                
                {/* Line - Colors change if the next step is also completed */}
                {index !== steps.length - 1 && (
                  <View style={[
                    styles.line, 
                    steps[index + 1].completed ? styles.lineActive : styles.lineInactive
                  ]} />
                )}
              </View>

              <View style={styles.contentColumn}>
                <Text style={[
                  styles.stepTitle, 
                  !step.completed && styles.textInactive,
                  step.isCurrent && { color: '#0A1121' }
                ]}>
                  {step.title}
                </Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Dynamic Help Section */}
        <TouchableOpacity style={styles.helpBtn} onPress={() => navigation.navigate('Support')}>
          <Icon name="help-circle" size={20} color="#6B7280" />
          <Text style={styles.helpText}>Need help with this delivery?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { padding: 10, marginLeft: -10 },
  title: { fontSize: 24, fontWeight: '800', color: '#0A1121', marginLeft: 10 },
  infoCard: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 20, marginBottom: 40, marginTop: 20 },
  infoLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 18, fontWeight: '800', color: '#0A1121', marginTop: 4 },
  trackingContainer: { paddingLeft: 10 },
  stepRow: { flexDirection: 'row', height: 90 }, // Increased height for better line visibility
  lineColumn: { alignItems: 'center', width: 24 },
  circle: { width: 24, height: 24, borderRadius: 12, zIndex: 2, justifyContent: 'center', alignItems: 'center' },
  circleActive: { backgroundColor: '#0A1121' },
  circleInactive: { backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: '#E5E7EB' },
  circleCurrent: { backgroundColor: '#0A1121', borderWidth: 4, borderColor: '#D1FAE5' }, // Visual indicator of current step
  line: { width: 3, position: 'absolute', top: 24, bottom: -10, zIndex: 1 },
  lineActive: { backgroundColor: '#0A1121' },
  lineInactive: { backgroundColor: '#F3F4F6' },
  contentColumn: { marginLeft: 25, paddingTop: 2 },
  stepTitle: { fontWeight: '800', fontSize: 17, color: '#0A1121' },
  textInactive: { color: '#D1D5DB' },
  stepTime: { color: '#9CA3AF', fontSize: 13, marginTop: 5, fontWeight: '500' },
  helpBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  helpText: { marginLeft: 10, color: '#6B7280', fontWeight: '600' }
});

export default DeliveryStatus;