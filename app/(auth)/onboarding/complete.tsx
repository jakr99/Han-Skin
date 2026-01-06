import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const MORNING_STEPS = [
  { number: 1, name: 'Cleanser' },
  { number: 2, name: 'Serum' },
  { number: 3, name: 'Moisturizer' },
];

const EVENING_STEPS = [
  { number: 1, name: 'Cleanser' },
  { number: 2, name: 'Serum' },
  { number: 3, name: 'Moisturizer' },
];

export default function CompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleUnlock = () => {
    router.push('/(auth)/onboarding/paywall');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.title}>Congratulations!</Text>
        </View>
        <Text style={styles.subtitle}>
          Your personalized skincare routine is ready!
        </Text>

        {/* Morning Routine */}
        <View style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View style={styles.routineIconContainer}>
              <Text style={styles.routineIcon}>🌅</Text>
            </View>
            <Text style={styles.routineTitle}>Your Morning Routine</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>4 day streak!</Text>
            </View>
          </View>
          <View style={styles.routineSteps}>
            {MORNING_STEPS.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepName}>{step.name}</Text>
                <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
              </View>
            ))}
          </View>
        </View>

        {/* Evening Routine */}
        <View style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View style={styles.routineIconContainer}>
              <Text style={styles.routineIcon}>🌙</Text>
            </View>
            <Text style={styles.routineTitle}>Your Evening Routine</Text>
          </View>
          <View style={styles.routineSteps}>
            {EVENING_STEPS.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepName}>{step.name}</Text>
                <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
              </View>
            ))}
          </View>
        </View>

        {/* Track Your Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Track Your Progress</Text>

          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>Timeline of Results</Text>
              <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
            </View>

            {/* Timeline labels */}
            <View style={styles.timelineLabels}>
              <Text style={styles.timelineLabel}>1 week</Text>
              <Text style={styles.timelineLabel}>4 weeks</Text>
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphContainer}>
              <View style={styles.graphLine} />
              <View style={styles.graphDots}>
                {[10, 30, 50, 70, 90].map((left) => (
                  <View key={left} style={[styles.graphDot, { left: `${left}%` }]} />
                ))}
              </View>
              <View style={styles.lockOverlay}>
                <Text style={styles.lockOverlayText}>Unlock your path</Text>
              </View>
            </View>
          </View>

          {/* Unlock message */}
          <View style={styles.unlockMessage}>
            <Ionicons name="lock-closed" size={14} color="#1F2937" />
            <Text style={styles.unlockMessageText}>
              Unlock your detailed skin report!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          title="Unlock Full Routine"
          onPress={handleUnlock}
        />
        <Text style={styles.disclaimer}>
          Reveal your full skincare routine &{'\n'}detailed skin report.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sparkle: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  routineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routineIcon: {
    fontSize: 18,
  },
  routineTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  streakBadge: {
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },
  routineSteps: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.03)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepName: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  progressSection: {
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    padding: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  graphContainer: {
    height: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  graphLine: {
    height: 3,
    borderRadius: 2,
    width: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
  },
  graphDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  graphDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(17, 24, 39, 0.15)',
    top: '50%',
    marginTop: -4,
  },
  lockOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  lockOverlayText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  unlockMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  unlockMessageText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  disclaimer: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
});
