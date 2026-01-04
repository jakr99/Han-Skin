import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const LIFESTYLE_QUESTIONS = [
  {
    id: 'outdoor',
    label: 'Outdoor exposure',
    options: [
      { id: 'rarely', label: 'Rarely' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'often', label: 'Often' },
      { id: 'very_often', label: 'Very often' },
    ],
    default: 'rarely',
  },
  {
    id: 'exercise',
    label: 'Do you exercise?',
    options: [
      { id: 'no', label: 'No' },
      { id: 'light', label: 'Light' },
      { id: 'moderate', label: 'Moderate' },
      { id: 'frequent', label: 'Frequent' },
    ],
    default: 'no',
  },
  {
    id: 'climate',
    label: "What's the climate like where you live?",
    options: [
      { id: 'dry', label: 'Dry' },
      { id: 'humid', label: 'Humid' },
      { id: 'balanced', label: 'Balanced' },
    ],
    default: 'dry',
  },
  {
    id: 'makeup',
    label: 'How often do you wear makeup?',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'occasionally', label: 'Occasionally' },
      { id: 'rarely_never', label: 'Rarely / Never' },
    ],
    default: 'daily',
  },
  {
    id: 'pollution',
    label: "What's your pollution exposure?",
    options: [
      { id: 'low', label: 'Low' },
      { id: 'moderate', label: 'Moderate' },
      { id: 'high', label: 'High' },
      { id: 'not_sure', label: 'Not sure' },
    ],
    default: 'low',
  },
];

export default function LifestyleScreen() {
  const router = useRouter();
  const { lifestyle, setLifestyle } = useOnboarding();

  const updateAnswer = (questionId: string, value: string) => {
    setLifestyle((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleContinue = () => {
    router.push('/(auth)/onboarding/sensitivities');
  };

  return (
    <OnboardingContainer currentStep={7} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lifestyle & environment</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your routine.
          </Text>
        </View>

        {/* Questions */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {LIFESTYLE_QUESTIONS.map((question) => (
            <SegmentedControl
              key={question.id}
              label={question.label}
              options={question.options}
              selectedId={lifestyle[question.id] ?? question.default}
              onSelect={(value) => updateAnswer(question.id, value)}
            />
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
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
