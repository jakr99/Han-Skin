import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const SENSITIVITIES = [
  { id: 'fragrance', icon: '🧴', title: 'Fragrance', description: 'React or have sensitivity?' },
  { id: 'acids', icon: '🧪', title: 'Acids', description: 'React or have sensitivity?' },
  { id: 'retinol', icon: '🧴', title: 'Retinol', description: 'React or have sensitivity?' },
  { id: 'essential_oils', icon: '🌿', title: 'Essential oils', description: 'React or have sensitivity?' },
];

export default function SensitivitiesScreen() {
  const router = useRouter();
  const {
    sensitivities,
    setSensitivities,
    sensitivitiesOther,
    setSensitivitiesOther,
  } = useOnboarding();

  const updateToggle = (id: string, value: boolean) => {
    setSensitivities((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    router.push('/(auth)/onboarding/preferences');
  };

  return (
    <OnboardingContainer currentStep={8} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Important Sensitivities</Text>
          <Text style={styles.subtitle}>
            For your safety, let us know if you have{'\n'}any of the following.
          </Text>
        </View>

        {/* Toggles */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {SENSITIVITIES.map((item) => (
            <ToggleRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              value={sensitivities[item.id]}
              onValueChange={(value) => updateToggle(item.id, value)}
            />
          ))}

          {/* Other Sensitivities */}
          <View style={styles.otherSection}>
            <Text style={styles.otherLabel}>Other sensitivities</Text>
            <TextInput
              style={styles.otherInput}
              placeholder="Please specify other sensitivities..."
              placeholderTextColor="#A0A0A0"
              value={sensitivitiesOther}
              onChangeText={setSensitivitiesOther}
              multiline
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
          />
          <Text style={styles.helperText}>
            You can always change this later.
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
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  otherSection: {
    marginTop: 16,
  },
  otherLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D3D3D',
    marginBottom: 8,
  },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#3D3D3D',
    minHeight: 50,
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
