import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  tertiaryText: '#9CA3AF',
  accent: '#D4A574',
  accentLight: '#FEF3E6',
  border: '#E8E4DF',
};

// Preference configurations that map to questionnaire data
// In the real app, current values would come from the database
const PREFERENCE_CONFIG: Record<string, {
  title: string;
  description: string;
  options: { label: string; selected?: boolean }[];
  multiSelect?: boolean;
}> = {
  budget: {
    title: 'Budget Range',
    description: 'Set your preferred price range for product recommendations. This helps us suggest products that fit your budget.',
    options: [
      { label: 'Under $25', selected: false },
      { label: '$25 - $50', selected: true },
      { label: '$50 - $100', selected: false },
      { label: 'Over $100', selected: false },
      { label: 'No preference', selected: false },
    ],
  },
  ingredients: {
    title: 'Ingredient Preferences',
    description: 'Select ingredients you prefer in your skincare products. We\'ll prioritize products with these ingredients.',
    multiSelect: true,
    options: [
      { label: 'Hyaluronic Acid', selected: true },
      { label: 'Vitamin C', selected: true },
      { label: 'Retinol', selected: false },
      { label: 'Niacinamide', selected: true },
      { label: 'Salicylic Acid', selected: false },
      { label: 'Ceramides', selected: false },
      { label: 'Peptides', selected: false },
      { label: 'AHA/BHA', selected: false },
    ],
  },
  avoid: {
    title: 'Ingredients to Avoid',
    description: 'Select ingredients you want to avoid. We\'ll filter out products containing these.',
    multiSelect: true,
    options: [
      { label: 'Fragrance', selected: true },
      { label: 'Alcohol (Denat.)', selected: true },
      { label: 'Parabens', selected: false },
      { label: 'Sulfates', selected: false },
      { label: 'Silicones', selected: false },
      { label: 'Essential Oils', selected: false },
      { label: 'Mineral Oil', selected: false },
    ],
  },
  depth: {
    title: 'Routine Depth',
    description: 'How many steps do you prefer in your skincare routine? This helps us create a routine that fits your lifestyle.',
    options: [
      { label: 'Minimal (2-3 steps)', selected: false },
      { label: 'Standard (4-5 steps)', selected: true },
      { label: 'Comprehensive (6+ steps)', selected: false },
    ],
  },
};

export default function PreferencesScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const config = PREFERENCE_CONFIG[type] || PREFERENCE_CONFIG.budget;

  // In the real app, this would update the database
  const handleSave = () => {
    // Save to database
    router.back();
  };

  return (
    <ProfileSubScreen title={config.title}>
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.accent} />
        <Text style={styles.infoText}>{config.description}</Text>
      </View>

      <Text style={styles.sectionHeader}>
        {config.multiSelect ? 'Select all that apply' : 'Choose one'}
      </Text>
      <View style={styles.optionsCard}>
        {config.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionRow,
              index === config.options.length - 1 && styles.optionRowLast,
              option.selected && styles.optionRowSelected,
            ]}
          >
            <Text style={[
              styles.optionText,
              option.selected && styles.optionTextSelected,
            ]}>
              {option.label}
            </Text>
            {config.multiSelect ? (
              <View style={[styles.checkbox, option.selected && styles.checkboxSelected]}>
                {option.selected && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            ) : (
              <View style={[styles.radioOuter, option.selected && styles.radioOuterSelected]}>
                {option.selected && <View style={styles.radioInner} />}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Changes will update your personalized recommendations.
      </Text>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primaryText,
    lineHeight: 18,
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
  optionsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionRowSelected: {
    backgroundColor: COLORS.accentLight,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primaryText,
  },
  optionTextSelected: {
    fontWeight: '500',
    color: COLORS.accent,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.tertiaryText,
    textAlign: 'center',
    marginTop: 12,
  },
});
