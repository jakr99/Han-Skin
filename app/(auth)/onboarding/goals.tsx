import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { GoalCard } from '@/components/ui/GoalCard';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

// Ordered by most common goals - more saturated tints
const GOALS = [
  { id: 'acne', label: 'Acne', icon: '💧', tint: '#E3F2F2' },
  { id: 'even_tone', label: 'Even tone', icon: '🌙', tint: '#EDE8F5' },
  { id: 'glow_hydration', label: 'Glow + hydration', icon: '✨', tint: '#FFF5E0' },
  { id: 'healthy_aging', label: 'Healthy aging', icon: '🌿', tint: '#E8F5E8' },
  { id: 'sun_protection', label: 'Sun protection', icon: '☀️', tint: '#FFF8E6' },
  { id: 'skin_barrier', label: 'Skin barrier', icon: '🛡️', tint: '#E8EEF5' },
];

const MAX_SELECTIONS = 2;

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, setGoals } = useOnboarding();

  const toggleGoal = (goalId: string) => {
    setGoals((prev) => {
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

          {/* Counter chip */}
          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Choose up to 2</Text>
            <View style={styles.counterChip}>
              <Text style={styles.counterText}>
                {goals.length} / {MAX_SELECTIONS}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals Grid - 2 columns x 3 rows */}
        <View style={styles.goalsGrid}>
          <View style={styles.row}>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[0].label} icon={GOALS[0].icon} tintColor={GOALS[0].tint} selected={goals.includes(GOALS[0].id)} onPress={() => toggleGoal(GOALS[0].id)} />
            </View>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[1].label} icon={GOALS[1].icon} tintColor={GOALS[1].tint} selected={goals.includes(GOALS[1].id)} onPress={() => toggleGoal(GOALS[1].id)} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[2].label} icon={GOALS[2].icon} tintColor={GOALS[2].tint} selected={goals.includes(GOALS[2].id)} onPress={() => toggleGoal(GOALS[2].id)} />
            </View>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[3].label} icon={GOALS[3].icon} tintColor={GOALS[3].tint} selected={goals.includes(GOALS[3].id)} onPress={() => toggleGoal(GOALS[3].id)} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[4].label} icon={GOALS[4].icon} tintColor={GOALS[4].tint} selected={goals.includes(GOALS[4].id)} onPress={() => toggleGoal(GOALS[4].id)} />
            </View>
            <View style={styles.goalItem}>
              <GoalCard label={GOALS[5].label} icon={GOALS[5].icon} tintColor={GOALS[5].tint} selected={goals.includes(GOALS[5].id)} onPress={() => toggleGoal(GOALS[5].id)} />
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={goals.length < MAX_SELECTIONS}
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
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
    fontWeight: '500',
  },
  counterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(122, 158, 159, 0.12)',
    borderRadius: 14,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A9E9F',
  },
  goalsGrid: {
    marginTop: 28,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  goalItem: {
    flex: 1,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 16,
  },
});
