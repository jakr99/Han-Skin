import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { RadioCard } from '@/components/ui/RadioCard';
import { Button } from '@/components/ui/Button';

const SKIN_TYPES = [
  { id: 'dry', icon: '💧', title: 'Dry', description: 'Feels tight or flaky' },
  { id: 'oily', icon: '💦', title: 'Oily', description: 'Shiny, prone to breakouts' },
  { id: 'combination', icon: '💧', title: 'Combination', description: 'Oily + dry areas' },
  { id: 'normal', icon: '⚖️', title: 'Normal', description: 'Balanced, rarely irritated' },
  { id: 'sensitive', icon: '❤️', title: 'Sensitive', description: 'Easily red or reactive' },
];

export default function SkinTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    // TODO: Store skin type in context/state
    router.push('/(auth)/onboarding/products');
  };

  return (
    <OnboardingContainer currentStep={5} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            How would you{'\n'}describe your skin?
          </Text>
        </View>

        {/* Skin Types List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {SKIN_TYPES.map((type) => (
            <RadioCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={selectedType === type.id}
              onPress={() => setSelectedType(type.id)}
            />
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedType}
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
