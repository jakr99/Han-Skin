import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  accent: '#1F2937',
  border: 'rgba(17, 24, 39, 0.08)',
  danger: '#DC2626',
};

export default function AccountScreen() {
  return (
    <ProfileSubScreen title="Account Settings">
      {/* Email Section */}
      <Text style={styles.sectionHeader}>Email</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Current email</Text>
          <Text style={styles.value}>anna@email.com</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change email</Text>
        </TouchableOpacity>
      </View>

      {/* Password Section */}
      <Text style={styles.sectionHeader}>Password</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change password</Text>
        </TouchableOpacity>
      </View>

      {/* Connected Accounts */}
      <Text style={styles.sectionHeader}>Connected Accounts</Text>
      <View style={styles.card}>
        <View style={styles.connectedRow}>
          <Ionicons name="logo-google" size={20} color={COLORS.primaryText} />
          <Text style={styles.connectedLabel}>Google</Text>
          <Text style={styles.connectedStatus}>Not connected</Text>
        </View>
        <View style={[styles.connectedRow, styles.connectedRowLast]}>
          <Ionicons name="logo-apple" size={20} color={COLORS.primaryText} />
          <Text style={styles.connectedLabel}>Apple</Text>
          <Text style={styles.connectedStatus}>Not connected</Text>
        </View>
      </View>

      {/* Danger Zone */}
      <Text style={styles.sectionHeader}>Danger Zone</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.accent,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  connectedRowLast: {
    borderBottomWidth: 0,
  },
  connectedLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primaryText,
  },
  connectedStatus: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  dangerButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.danger,
  },
});
