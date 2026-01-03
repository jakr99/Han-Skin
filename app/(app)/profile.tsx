import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SKIN_TAGS = [
  { label: 'Combination', color: '#F3E8FF', textColor: '#9333EA' },
  { label: 'Glow', color: '#FEF3E2', textColor: '#D4A574' },
  { label: 'Even Tone', color: '#E8F5E9', textColor: '#4CAF50' },
  { label: 'Sensitive', color: '#FFEBEE', textColor: '#E57373' },
];

const PROGRESS_TAGS = [
  { label: 'Combination', active: true },
  { label: 'Glow', active: false },
  { label: 'Even Tone', active: false },
  { label: 'Humid', active: false },
];

const PREFERENCES = [
  { id: 'budget', icon: 'wallet-outline', label: 'Budget range' },
  { id: 'ingredients', icon: 'flask-outline', label: 'Ingredient preferences' },
  { id: 'avoid', icon: 'close-circle-outline', label: 'Ingredients to avoid' },
  { id: 'depth', icon: 'layers-outline', label: 'Routine depth' },
];

const LIBRARY_ITEMS = [
  { id: 'notifications', icon: 'heart-outline', label: 'Notifications' },
  { id: 'privacy', icon: 'lock-closed-outline', label: 'Privacy & data' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F8', '#FFF0F5', '#FFE8F0', '#FCE0E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View>
              <Text style={styles.userName}>Anna Lee</Text>
              <Text style={styles.userSubtitle}>Skin Profile · Updated today</Text>
              <View style={styles.journeyBadge}>
                <Ionicons name="sparkles" size={14} color="#D4A574" />
                <Text style={styles.journeyText}>Glass Skin Journey: Day 12</Text>
              </View>
            </View>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#D4A574" />
              </View>
            </View>
          </View>
        </View>

        {/* Skin Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>Your Skin Overview</Text>
            <View style={styles.tagsContainer}>
              {SKIN_TAGS.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.skinTag, { backgroundColor: tag.color }]}
                >
                  <Text style={[styles.skinTagText, { color: tag.textColor }]}>
                    {tag.label}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.editProfileLink}>
              <Text style={styles.editProfileText}>Edit skin profile</Text>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.overviewIllustration}>
            <View style={styles.illustrationCircle}>
              <Ionicons name="sunny" size={24} color="#E8B86D" />
            </View>
            <View style={[styles.productIcon, { top: 10, right: 20 }]}>
              <Ionicons name="flask-outline" size={16} color="#7A9E9F" />
            </View>
            <View style={[styles.productIcon, { bottom: 10, right: 10 }]}>
              <Ionicons name="water-outline" size={16} color="#64B5F6" />
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressTags}>
            {PROGRESS_TAGS.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.progressTag,
                  tag.active && styles.progressTagActive,
                ]}
              >
                {tag.active && (
                  <View style={styles.progressDot} />
                )}
                <Text
                  style={[
                    styles.progressTagText,
                    tag.active && styles.progressTagTextActive,
                  ]}
                >
                  {tag.label}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.viewHistoryLink}>
            <Text style={styles.viewHistoryText}>View skin history</Text>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesGrid}>
            {PREFERENCES.map((pref) => (
              <TouchableOpacity key={pref.id} style={styles.preferenceItem}>
                <Ionicons name={pref.icon as any} size={20} color="#9CA3AF" />
                <Text style={styles.preferenceLabel}>{pref.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Library Section */}
        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Your Library</Text>
          {LIBRARY_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.libraryItem}>
              <Ionicons name={item.icon as any} size={20} color="#9CA3AF" />
              <Text style={styles.libraryLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  journeyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF9F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  journeyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D4A574',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F5E6D3',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewContent: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skinTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  skinTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editProfileText: {
    fontSize: 13,
    color: '#6B7280',
  },
  overviewIllustration: {
    width: 80,
    height: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF9F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productIcon: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 14,
  },
  progressTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  progressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  progressTagActive: {
    backgroundColor: '#E8F5E9',
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  progressTagText: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressTagTextActive: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  viewHistoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewHistoryText: {
    fontSize: 13,
    color: '#6B7280',
  },
  preferencesSection: {
    marginBottom: 20,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preferenceItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  preferenceLabel: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },
  librarySection: {
    marginBottom: 20,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  libraryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
});
