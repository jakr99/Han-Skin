import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const SENSITIVITIES = [
  { id: 'fragrance', icon: '🧴', title: 'Fragrance', description: 'React or have sensitivity?' },
  { id: 'acids', icon: '🧪', title: 'Acids', description: 'React or have sensitivity?' },
  { id: 'retinol', icon: '✨', title: 'Retinol', description: 'React or have sensitivity?' },
  { id: 'essential_oils', icon: '🌿', title: 'Essential oils', description: 'React or have sensitivity?' },
];

export default function SensitivitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    fragrance: false,
    acids: false,
    retinol: false,
    essential_oils: false,
  });
  const [otherSensitivities, setOtherSensitivities] = useState('');

  const updateToggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
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
            <View key={item.id} style={styles.toggleCard}>
              <View style={styles.toggleIconContainer}>
                <Text style={styles.toggleIcon}>{item.icon}</Text>
              </View>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>{item.title}</Text>
                <Text style={styles.toggleDescription}>{item.description}</Text>
              </View>
              <Switch
                value={toggles[item.id]}
                onValueChange={(value) => updateToggle(item.id, value)}
                trackColor={{ false: 'rgba(17, 24, 39, 0.08)', true: '#1F2937' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="rgba(17, 24, 39, 0.08)"
              />
            </View>
          ))}

          {/* Other Sensitivities */}
          <View style={styles.otherSection}>
            <Text style={styles.otherLabel}>Other sensitivities</Text>
            <TextInput
              style={styles.otherInput}
              placeholder="Please specify other sensitivities..."
              placeholderTextColor="#9CA3AF"
              value={otherSensitivities}
              onChangeText={setOtherSensitivities}
              multiline
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
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
    paddingTop: isSmallDevice ? 12 : 20,
    marginBottom: isSmallDevice ? 16 : 24,
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
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 8,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  toggleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleIcon: {
    fontSize: 22,
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  otherSection: {
    marginTop: 16,
  },
  otherLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 10,
  },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
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
