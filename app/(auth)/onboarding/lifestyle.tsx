import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

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
  const insets = useSafeAreaInsets();
  const { data, setLifestyle } = useOnboarding();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    // Use saved data if available, otherwise use defaults
    if (data.lifestyle.outdoor !== 'rarely' || data.lifestyle.climate !== 'dry') {
      return { ...data.lifestyle };
    }
    const defaults: Record<string, string> = {};
    LIFESTYLE_QUESTIONS.forEach((q) => {
      defaults[q.id] = q.default;
    });
    return defaults;
  });

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleContinue = () => {
    setLifestyle({
      outdoor: answers.outdoor,
      exercise: answers.exercise,
      climate: answers.climate,
      makeup: answers.makeup,
      pollution: answers.pollution,
    });
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
            <View key={question.id} style={styles.questionSection}>
              <Text style={styles.questionLabel}>{question.label}</Text>
              <View style={styles.optionsRow}>
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                      onPress={() => updateAnswer(question.id, option.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: isSmallDevice ? 18 : 22,
    paddingBottom: 8,
  },
  questionSection: {
    gap: 10,
  },
  questionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionPillSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  optionTextSelected: {
    color: '#FFFFFF',
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
