import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const CONCERNS = [
  { id: 'redness_flushing', label: 'Redness & flushing' },
  { id: 'dark_spots', label: 'Dark spots & hyperpigmentation' },
  { id: 'uneven_texture', label: 'Uneven texture' },
  { id: 'visible_pores', label: 'Visible pores' },
  { id: 'dehydration', label: 'Dehydration' },
  { id: 'puffiness', label: 'Puffiness & inflammation' },
];

export default function ConcernsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) => {
      if (prev.includes(concernId)) {
        return prev.filter((id) => id !== concernId);
      }
      return [...prev, concernId];
    });
  };

  const handleContinue = () => {
    router.push('/(auth)/onboarding/skin-type');
  };

  return (
    <OnboardingContainer currentStep={4} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Primary skin concerns</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        {/* Concerns List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {CONCERNS.map((concern) => {
            const isSelected = selectedConcerns.includes(concern.id);
            return (
              <TouchableOpacity
                key={concern.id}
                style={[styles.concernRow, isSelected && styles.concernRowSelected]}
                onPress={() => toggleConcern(concern.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.concernLabel, isSelected && styles.concernLabelSelected]}>
                  {concern.label}
                </Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={selectedConcerns.length === 0}
          />
          <Text style={styles.helperText}>
            You can change this anytime.
          </Text>
        </View>
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: isSmallDevice ? 16 : 24,
    marginBottom: isSmallDevice ? 20 : 28,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
  },
  concernRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  concernRowSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  concernLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '400',
  },
  concernLabelSelected: {
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(17, 24, 39, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
