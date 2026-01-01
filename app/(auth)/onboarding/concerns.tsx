import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { CheckboxRow } from '@/components/ui/CheckboxRow';
import { Button } from '@/components/ui/Button';

const CONCERNS = [
  { id: 'acne_breakouts', label: 'Acne / breakouts' },
  { id: 'dark_spots', label: 'Dark spots' },
  { id: 'redness', label: 'Redness' },
  { id: 'texture', label: 'Texture' },
  { id: 'pores', label: 'Pores' },
  { id: 'uneven_tone', label: 'Uneven tone' },
  { id: 'fine_lines', label: 'Fine lines' },
];

export default function ConcernsScreen() {
  const router = useRouter();
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
    // TODO: Store concerns in context/state
    router.push('/(auth)/onboarding/skin-type');
  };

  return (
    <OnboardingContainer currentStep={4} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Any specific concerns{'\n'}you'd like to target?
          </Text>
          <Text style={styles.subtitle}>Select all that apply:</Text>
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
              selected={selectedConcerns.includes(concern.id)}
              onPress={() => toggleConcern(concern.id)}
            />
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
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
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A7A7A',
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
    paddingBottom: 32,
  },
  helperText: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 16,
  },
});
