import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const GOALS = [
  { id: 'acne', label: 'Acne', icon: '💧' },
  { id: 'even_tone', label: 'Even tone', icon: '🌙' },
  { id: 'glow_hydration', label: 'Glow + hydration', icon: '✨' },
  { id: 'healthy_aging', label: 'Healthy aging', icon: '🌿' },
  { id: 'sun_protection', label: 'Sun protection', icon: '☀️' },
  { id: 'skin_barrier', label: 'Skin barrier', icon: '🛡️' },
];

const MAX_SELECTIONS = 2;

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, setGoals } = useOnboarding();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    setGoals(selectedGoals);
    router.push('/(auth)/onboarding/concerns');
  };

  return (
    <OnboardingContainer currentStep={3} totalSteps={11}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            What are you hoping{'\n'}to improve most?
          </Text>

          {/* Counter */}
          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Choose up to 2</Text>
            <View style={styles.counterChip}>
              <Text style={styles.counterText}>
                {selectedGoals.length} / {MAX_SELECTIONS}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {[0, 1, 2].map((rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {GOALS.slice(rowIndex * 2, rowIndex * 2 + 2).map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    selectedGoals.includes(goal.id) && styles.goalCardSelected,
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[
                    styles.goalLabel,
                    selectedGoals.includes(goal.id) && styles.goalLabelSelected,
                  ]}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
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
  header: {
    alignItems: 'center',
    paddingTop: isSmallDevice ? 16 : 24,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 32 : 38,
    letterSpacing: -0.5,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  counterLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  counterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    borderRadius: 14,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  goalsGrid: {
    marginTop: isSmallDevice ? 24 : 32,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  goalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: isSmallDevice ? 18 : 22,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  goalIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  goalLabelSelected: {
    fontWeight: '600',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
