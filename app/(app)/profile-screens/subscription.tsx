import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  accent: '#D4A574',
  border: '#E8E4DF',
};

export default function SubscriptionScreen() {
  return (
    <ProfileSubScreen title="Subscription">
      {/* Current Plan */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>Free Plan</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Current</Text>
          </View>
        </View>
        <Text style={styles.planDescription}>
          Basic features with limited scans and recommendations.
        </Text>
      </View>

      {/* Premium Plan */}
      <View style={styles.premiumCard}>
        <View style={styles.planHeader}>
          <Text style={styles.premiumTitle}>Premium</Text>
          <Text style={styles.price}>$9.99/mo</Text>
        </View>
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
            <Text style={styles.featureText}>Unlimited product scans</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
            <Text style={styles.featureText}>Personalized recommendations</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
            <Text style={styles.featureText}>Skin progress tracking</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
            <Text style={styles.featureText}>Priority support</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>

      {/* Billing */}
      <Text style={styles.sectionHeader}>Billing</Text>
      <View style={styles.card}>
        <Text style={styles.noPaymentText}>
          No payment method on file
        </Text>
        <TouchableOpacity style={styles.addPaymentButton}>
          <Text style={styles.addPaymentText}>Add payment method</Text>
        </TouchableOpacity>
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  planBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  planDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  premiumCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginBottom: 24,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.accent,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  features: {
    marginVertical: 16,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.primaryText,
  },
  upgradeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noPaymentText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 12,
  },
  addPaymentButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F3F0',
  },
  addPaymentText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.accent,
  },
});
