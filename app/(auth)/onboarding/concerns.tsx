import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { CheckboxRow } from '@/components/ui/CheckboxRow';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

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
  const { concerns, setConcerns } = useOnboarding();

  const toggleConcern = (concernId: string) => {
    setConcerns((prev) => {
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
          <Text style={styles.title}>
            Primary skin concerns
          </Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        {/* Concerns List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {CONCERNS.map((concern) => (
            <CheckboxRow
              key={concern.id}
              label={concern.label}
              selected={concerns.includes(concern.id)}
              onPress={() => toggleConcern(concern.id)}
            />
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={concerns.length === 0}
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
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 40,
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
