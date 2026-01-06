import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Warm Minimal Color Palette
const COLORS = {
  background: '#FBF8F4',     // warm cream
  card: '#FFFFFF',           // white
  primaryText: '#1F2937',    // dark gray
  secondaryText: '#6B7280',  // medium gray
  tertiaryText: '#9CA3AF',   // light gray
  accent: '#D4A574',         // warm tan/gold
  accentLight: '#FEF3E6',    // light tan
  success: '#4CAF50',        // green
  successLight: '#E8F5E9',   // light green
  border: '#E8E4DF',         // warm gray border
};

// SKIN_TAGS is now generated dynamically based on user's onboarding data

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

// ACCOUNT_ITEMS is now generated dynamically in the component

const SUBSCRIPTION_ITEMS = [
  { id: 'plan', icon: 'diamond-outline', label: 'Current plan', value: 'Free' },
  { id: 'upgrade', icon: 'arrow-up-circle-outline', label: 'Upgrade to Premium' },
  { id: 'billing', icon: 'card-outline', label: 'Billing' },
];

const HELP_ITEMS = [
  { id: 'faq', icon: 'help-circle-outline', label: 'FAQ' },
  { id: 'contact', icon: 'chatbubble-outline', label: 'Contact support' },
  { id: 'feedback', icon: 'chatbubbles-outline', label: 'Send feedback' },
];

const ABOUT_ITEMS = [
  { id: 'version', icon: 'information-circle-outline', label: 'App version', value: '1.0.0' },
  { id: 'terms', icon: 'document-text-outline', label: 'Terms of service' },
  { id: 'privacy-policy', icon: 'shield-checkmark-outline', label: 'Privacy policy' },
  { id: 'credits', icon: 'heart-outline', label: 'Credits' },
];

// Reusable menu item component
interface MenuItemProps {
  icon: string;
  label: string;
  value?: string;
  danger?: boolean;
  isLast?: boolean;
  onPress?: () => void;
}

function MenuItem({ icon, label, value, danger, isLast, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={onPress}
    >
      <View style={styles.menuItemIcon}>
        <Ionicons
          name={icon as any}
          size={18}
          color={danger ? '#DC2626' : COLORS.accent}
        />
      </View>
      <Text style={[styles.menuItemLabel, danger && styles.menuItemDanger]}>
        {label}
      </Text>
      {value && <Text style={styles.menuItemValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  // Get user data from auth
  const userData = useMemo(() => {
    const metadata = user?.user_metadata || {};
    const firstName = metadata.first_name || '';
    const lastName = metadata.last_name || '';
    const email = user?.email || '';
    const onboarding = metadata.onboarding || {};

    // Build full name
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'User';

    // Get skin profile from onboarding data
    const skinType = onboarding.skinType || 'Not set';
    const concerns = onboarding.concerns || [];
    const sensitivities = onboarding.sensitivities || [];
    const goals = onboarding.goals || [];

    return {
      fullName,
      firstName: firstName || email.split('@')[0] || 'User',
      email,
      skinType,
      concerns,
      sensitivities,
      goals,
    };
  }, [user]);

  // Dynamic skin tags based on user's onboarding data
  const skinTags = useMemo(() => {
    const tags: { label: string; color: string; textColor: string }[] = [];

    // Add skin type
    if (userData.skinType && userData.skinType !== 'Not set') {
      tags.push({ label: userData.skinType, color: '#F3E8FF', textColor: '#9333EA' });
    }

    // Add concerns (limit to 3)
    const concernColors = [
      { color: '#FEF3E2', textColor: '#D4A574' },
      { color: '#E8F5E9', textColor: '#4CAF50' },
      { color: '#FFEBEE', textColor: '#E57373' },
    ];
    userData.concerns.slice(0, 3).forEach((concern: string, index: number) => {
      tags.push({
        label: concern,
        ...concernColors[index % concernColors.length],
      });
    });

    // Fallback if no tags
    if (tags.length === 0) {
      tags.push({ label: 'Complete your profile', color: '#F3F4F6', textColor: '#6B7280' });
    }

    return tags;
  }, [userData]);

  // Dynamic account items with user's email
  const accountItems = useMemo(() => [
    { id: 'email', icon: 'mail-outline', label: 'Email', value: userData.email || 'Not set' },
    { id: 'password', icon: 'key-outline', label: 'Change password' },
    { id: 'connected', icon: 'link-outline', label: 'Connected accounts' },
    { id: 'signout', icon: 'log-out-outline', label: 'Sign out', danger: true },
  ], [userData.email]);

  // Navigation handlers for menu items
  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      // Account items
      case 'email':
      case 'password':
      case 'connected':
        router.push('/profile-screens/account');
        break;
      case 'signout':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: async () => {
                await supabase.auth.signOut();
                router.replace('/(auth)/sign-in');
              },
            },
          ]
        );
        break;
      // Subscription items
      case 'plan':
      case 'upgrade':
      case 'billing':
        router.push('/profile-screens/subscription');
        break;
      // Help items
      case 'faq':
      case 'contact':
      case 'feedback':
        router.push('/profile-screens/help');
        break;
      // About items
      case 'version':
      case 'terms':
      case 'privacy-policy':
      case 'credits':
        router.push('/profile-screens/about');
        break;
      default:
        console.log(`Item ${itemId} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
      >
        {/* Header with Back Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Info - Avatar Left, Name Right */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={COLORS.accent} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.userName}>{userData.fullName}</Text>
              <Text style={styles.userSubtitle}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* Skin Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>Your Skin Overview</Text>
            <View style={styles.tagsContainer}>
              {skinTags.map((tag, index) => (
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
            <TouchableOpacity
              style={styles.editProfileLink}
              onPress={() => router.push('/profile-screens/skin-profile')}
            >
              <Text style={styles.editProfileText}>Edit skin profile</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.accent} />
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
          <TouchableOpacity
            style={styles.viewHistoryLink}
            onPress={() => router.push('/profile-screens/skin-history')}
          >
            <Text style={styles.viewHistoryText}>View skin history</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesGrid}>
            {PREFERENCES.map((pref) => (
              <TouchableOpacity
                key={pref.id}
                style={styles.preferenceItem}
                onPress={() => router.push(`/profile-screens/preferences?type=${pref.id}`)}
              >
                <Ionicons name={pref.icon as any} size={18} color={COLORS.accent} />
                <Text style={styles.preferenceLabel}>{pref.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Library Section */}
        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Your Library</Text>
          {LIBRARY_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.libraryItem}>
              <Ionicons name={item.icon as any} size={18} color={COLORS.accent} />
              <Text style={styles.libraryLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account & Security Section */}
        <Text style={styles.sectionHeader}>Account & Security</Text>
        <View style={styles.sectionContainer}>
          {accountItems.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              value={item.value}
              danger={item.danger}
              isLast={index === accountItems.length - 1}
              onPress={() => handleMenuPress(item.id)}
            />
          ))}
        </View>

        {/* Subscription Section */}
        <Text style={styles.sectionHeader}>Subscription</Text>
        <View style={styles.sectionContainer}>
          {SUBSCRIPTION_ITEMS.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              value={item.value}
              isLast={index === SUBSCRIPTION_ITEMS.length - 1}
              onPress={() => handleMenuPress(item.id)}
            />
          ))}
        </View>

        {/* Help & Support Section */}
        <Text style={styles.sectionHeader}>Help & Support</Text>
        <View style={styles.sectionContainer}>
          {HELP_ITEMS.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isLast={index === HELP_ITEMS.length - 1}
              onPress={() => handleMenuPress(item.id)}
            />
          ))}
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.sectionContainer}>
          {ABOUT_ITEMS.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              value={item.value}
              isLast={index === ABOUT_ITEMS.length - 1}
              onPress={() => handleMenuPress(item.id)}
            />
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  userSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  overviewContent: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
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
    color: COLORS.accent,
    fontWeight: '500',
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
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
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
    borderRadius: 12,
    backgroundColor: '#F5F3F0',
  },
  progressTagActive: {
    backgroundColor: COLORS.successLight,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  progressTagText: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  progressTagTextActive: {
    color: COLORS.success,
    fontWeight: '500',
  },
  viewHistoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewHistoryText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '500',
  },
  preferencesSection: {
    marginBottom: 24,
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
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  preferenceLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primaryText,
  },
  // Section container for grouped menu items
  sectionContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primaryText,
  },
  menuItemValue: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginRight: 4,
  },
  menuItemDanger: {
    color: '#DC2626',
  },
  librarySection: {
    marginBottom: 20,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  libraryLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primaryText,
  },
});
