import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { GoalPill } from '@/components/ui/GoalPill';
import { Button } from '@/components/ui/Button';

const GOALS = [
  { id: 'glow_hydration', label: 'Glow & hydration', icon: '✨', tint: '#F0F7F7' },
  { id: 'clear_breakouts', label: 'Clear breakouts', icon: '🧴', tint: '#FDF5F3' },
  { id: 'even_tone', label: 'Even skin tone', icon: '🌙', tint: '#F5F3F8' },
  { id: 'fine_lines', label: 'Fine lines & aging', icon: '⏳', tint: '#F5F5F5' },
  { id: 'sun_protection', label: 'Sun protection', icon: '☀️', tint: '#FFFBF5' },
  { id: 'calm_sensitive', label: 'Calm sensitive skin', icon: '❤️', tint: '#FDF5F5' },
];

const MAX_SELECTIONS = 2;

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

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
    // TODO: Store goals in context/state
    router.push('/(auth)/onboarding/concerns');
  };

  return (
    <OnboardingContainer currentStep={3} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            What are you hoping{'\n'}to improve most?
          </Text>
          <Text style={styles.subtitle}>Pick up to 2 goals:</Text>
        </View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {GOALS.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <GoalPill
                label={goal.label}
                icon={goal.icon}
                selected={selectedGoals.includes(goal.id)}
                onPress={() => toggleGoal(goal.id)}
                tintColor={goal.tint}
              />
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
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
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 24,
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
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 32,
    paddingHorizontal: 8,
  },
  goalItem: {
    width: '47%',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  helperText: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 16,
  },
});
