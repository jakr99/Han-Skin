import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  tertiaryText: '#9CA3AF',
  accent: '#1F2937',
  accentLight: 'rgba(17, 24, 39, 0.04)',
  border: 'rgba(17, 24, 39, 0.08)',
};

// These would come from the database/context in the real app
const QUESTIONNAIRE_SECTIONS = [
  {
    id: 'skin-type',
    icon: 'water-outline',
    label: 'Skin Type',
    value: 'Combination',
    description: 'Your skin type classification'
  },
  {
    id: 'concerns',
    icon: 'alert-circle-outline',
    label: 'Skin Concerns',
    value: '3 selected',
    description: 'Issues you want to address'
  },
  {
    id: 'goals',
    icon: 'trophy-outline',
    label: 'Skin Goals',
    value: '2 selected',
    description: 'What you want to achieve'
  },
  {
    id: 'sensitivities',
    icon: 'medical-outline',
    label: 'Sensitivities',
    value: 'Fragrance-free',
    description: 'Ingredients to avoid'
  },
  {
    id: 'lifestyle',
    icon: 'sunny-outline',
    label: 'Lifestyle',
    value: 'Indoor / Low sun',
    description: 'Your daily environment'
  },
  {
    id: 'preferences',
    icon: 'options-outline',
    label: 'Preferences',
    value: 'Natural, cruelty-free',
    description: 'Product preferences'
  },
];

export default function SkinProfileScreen() {
  const router = useRouter();

  const handleEditSection = (sectionId: string) => {
    // Navigate to the edit screen for this section
    // This would re-use or link to the onboarding screens
    router.push(`/profile-screens/edit-questionnaire?section=${sectionId}`);
  };

  return (
    <ProfileSubScreen title="Edit Skin Profile">
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.accent} />
        <Text style={styles.infoText}>
          Tap any section to update your questionnaire answers. Changes will personalize your recommendations.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Your Profile</Text>
      <View style={styles.card}>
        {QUESTIONNAIRE_SECTIONS.map((section, index) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.sectionRow,
              index === QUESTIONNAIRE_SECTIONS.length - 1 && styles.sectionRowLast,
            ]}
            onPress={() => handleEditSection(section.id)}
          >
            <View style={styles.sectionIcon}>
              <Ionicons name={section.icon as any} size={18} color={COLORS.accent} />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
            <View style={styles.sectionRight}>
              <Text style={styles.sectionValue}>{section.value}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.retakeButton}>
        <Ionicons name="refresh-outline" size={18} color={COLORS.accent} />
        <Text style={styles.retakeButtonText}>Retake Full Questionnaire</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionRowLast: {
    borderBottomWidth: 0,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionValue: {
    fontSize: 13,
    color: COLORS.secondaryText,
    maxWidth: 100,
    textAlign: 'right',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  retakeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.accent,
  },
});
