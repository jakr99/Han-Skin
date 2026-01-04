import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  tertiaryText: '#9CA3AF',
  accent: '#D4A574',
  border: '#E8E4DF',
};

export default function AboutScreen() {
  return (
    <ProfileSubScreen title="About">
      {/* App Info */}
      <View style={styles.appInfoCard}>
        <View style={styles.appIcon}>
          <Ionicons name="leaf" size={32} color={COLORS.accent} />
        </View>
        <Text style={styles.appName}>Han Skin</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appTagline}>Your personalized skincare companion</Text>
      </View>

      {/* Legal */}
      <Text style={styles.sectionHeader}>Legal</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.linkRow}>
          <Ionicons name="document-text-outline" size={18} color={COLORS.accent} />
          <Text style={styles.linkText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkRow, styles.linkRowLast]}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.accent} />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
        </TouchableOpacity>
      </View>

      {/* Credits */}
      <Text style={styles.sectionHeader}>Credits</Text>
      <View style={styles.card}>
        <Text style={styles.creditsText}>
          Built with love by the Han Skin team.
        </Text>
        <Text style={styles.creditsSubtext}>
          Icons by Ionicons. Powered by React Native & Expo.
        </Text>
      </View>

      {/* Social */}
      <Text style={styles.sectionHeader}>Follow Us</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-instagram" size={22} color={COLORS.primaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-twitter" size={22} color={COLORS.primaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-tiktok" size={22} color={COLORS.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>
        © 2025 Han Skin. All rights reserved.
      </Text>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  appInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: 8,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FEF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primaryText,
  },
  creditsText: {
    fontSize: 15,
    color: COLORS.primaryText,
    padding: 16,
    paddingBottom: 4,
  },
  creditsSubtext: {
    fontSize: 13,
    color: COLORS.secondaryText,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyright: {
    fontSize: 12,
    color: COLORS.tertiaryText,
    textAlign: 'center',
  },
});
