import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Support = ({ navigation }) => {
  const options = [
    { title: 'Return Items', icon: 'package', color: '#8B5CF6', bg: '#F5F3FF', desc: 'Start a return' },
    { title: 'Address Info', icon: 'map-pin', color: '#3B82F6', bg: '#EFF6FF', desc: 'Change delivery' },
    { title: 'Payments', icon: 'credit-card', color: '#10B981', bg: '#ECFDF5', desc: 'Billing issues' },
    { title: 'Live Chat', icon: 'headphones', color: '#F59E0B', bg: '#FFFBEB', desc: 'Talk to an agent' },
  ];

  const handleEmail = () => {
    Linking.openURL('mailto:support@shopline.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 25 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#0A1121" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>What can we help you with today?</Text>

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.supportCard} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: opt.bg }]}>
                <Icon name={opt.icon} size={24} color={opt.color} />
              </View>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionHeader}>Common Questions</Text>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqText}>How do I track my order?</Text>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqText}>What is your refund policy?</Text>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Contact Footer */}
        <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
          <View style={styles.emailIcon}>
            <Icon name="mail" size={20} color="#111827" />
          </View>
          <View>
            <Text style={styles.contactLabel}>Email our Support Team</Text>
            <Text style={styles.contactEmail}>support@shopline.com</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { marginBottom: 20, marginLeft: -10 },
  title: { fontSize: 32, fontWeight: '800', color: '#0A1121' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 5, marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  supportCard: { 
    width: '48%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 28, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Subtle Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: { width: 50, height: 50, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontWeight: '800', fontSize: 15, color: '#0A1121' },
  cardDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  faqSection: { marginTop: 25 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#0A1121', marginBottom: 15 },
  faqItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F9FAFB' 
  },
  faqText: { fontSize: 15, color: '#4B5563', fontWeight: '500' },
  contactBtn: { 
    marginTop: 40, 
    backgroundColor: '#F9FAFB', 
    padding: 20, 
    borderRadius: 24, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  emailIcon: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  contactEmail: { fontSize: 15, fontWeight: '700', color: '#111827' }
});

export default Support;