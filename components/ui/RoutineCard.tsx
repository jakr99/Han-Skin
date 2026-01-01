import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface RoutineStep {
  number: number;
  name: string;
}

interface RoutineCardProps {
  title: string;
  icon: string;
  steps: RoutineStep[];
  badge?: string;
  locked?: boolean;
}

export function RoutineCard({ title, icon, steps, badge, locked = true }: RoutineCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step) => (
          <View key={step.number} style={styles.stepRow}>
            <Text style={styles.stepNumber}>Step {step.number}</Text>
            <View style={styles.stepNameContainer}>
              {locked ? (
                <LinearGradient
                  colors={['#E5E2DE', '#D0D0D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.blurredText}
                />
              ) : (
                <Text style={styles.stepName}>{step.name}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Lock Message */}
      {locked && (
        <View style={styles.lockMessage}>
          <Ionicons name="lock-closed" size={14} color="#7A9E9F" />
          <Text style={styles.lockText}>Unlock to see your products</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EDEA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D3D3D',
    flex: 1,
  },
  badge: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  stepsContainer: {
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 13,
    color: '#7A7A7A',
    width: 50,
  },
  stepNameContainer: {
    flex: 1,
  },
  stepName: {
    fontSize: 14,
    color: '#3D3D3D',
  },
  blurredText: {
    height: 16,
    borderRadius: 8,
    width: '70%',
  },
  lockMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  lockText: {
    fontSize: 12,
    color: '#7A9E9F',
    marginLeft: 6,
  },
});

export default RoutineCard;
