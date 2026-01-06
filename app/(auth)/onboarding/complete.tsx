import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RoutineCard } from '@/components/ui/RoutineCard';

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

  const handleUnlock = () => {
    router.push('/(auth)/onboarding/paywall');
  };

  return (
    <LinearGradient
      colors={['#FDF8F5', '#F5F0F5', '#F0F5F5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
          <RoutineCard
            title="Your Morning Routine"
            icon="🌅"
            steps={MORNING_STEPS}
            badge="4 day streak!"
            locked={true}
          />

          {/* Evening Routine */}
          <RoutineCard
            title="Your Evening Routine"
            icon="🌙"
            steps={EVENING_STEPS}
            locked={true}
          />

          {/* Track Your Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Track Your Progress</Text>

            <View style={styles.timelineCard}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Timeline of Results</Text>
                <Ionicons name="lock-closed" size={14} color="#A0A0A0" />
              </View>

              {/* Timeline labels */}
              <View style={styles.timelineLabels}>
                <Text style={styles.timelineLabel}>1 week</Text>
                <Text style={styles.timelineLabel}>4 weeks</Text>
              </View>

              {/* Blurred graph placeholder */}
              <View style={styles.graphContainer}>
                <LinearGradient
                  colors={['#E8F0F0', '#D8E8E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.graphLine}
                />
                <View style={styles.graphDots}>
                  <View style={[styles.graphDot, { left: '10%' }]} />
                  <View style={[styles.graphDot, { left: '30%' }]} />
                  <View style={[styles.graphDot, { left: '50%' }]} />
                  <View style={[styles.graphDot, { left: '70%' }]} />
                  <View style={[styles.graphDot, { left: '90%' }]} />
                </View>
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockOverlayText}>Lock your path</Text>
                </View>
              </View>
            </View>

            {/* Unlock message */}
            <View style={styles.unlockMessage}>
              <Ionicons name="lock-closed" size={14} color="#7A9E9F" />
              <Text style={styles.unlockMessageText}>
                Unlock your detailed skin report!
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={handleUnlock}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#7A9E9F', '#6B8E8F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.unlockButton}
            >
              <Text style={styles.unlockButtonText}>Unlock Full Routine</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            Reveal your full skincare routine &{'\n'}detailed skin report.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sparkle: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D3D3D',
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressSection: {
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D3D3D',
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EDEA',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 11,
    color: '#A0A0A0',
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
    backgroundColor: '#C8D8D8',
    top: '50%',
    marginTop: -4,
  },
  lockOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  lockOverlayText: {
    fontSize: 10,
    color: '#B0B0B0',
    fontStyle: 'italic',
  },
  unlockMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  unlockMessageText: {
    fontSize: 13,
    color: '#7A9E9F',
    marginLeft: 6,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  unlockButton: {
    width: '100%',
    minWidth: 320,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
});
