import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const QUICK_ACTIONS = [
  { id: 'scan', icon: 'scan-outline', label: 'Scan Product', route: '/(app)/barcode' },
  { id: 'routine', icon: 'sunny-outline', label: 'My Routine', route: '/(app)/routine' },
  { id: 'shop', icon: 'bag-outline', label: 'Shop', route: '/(app)/shop' },
];

const MORNING_ROUTINE = [
  { step: 1, name: 'Cleanser', done: true },
  { step: 2, name: 'Toner', done: true },
  { step: 3, name: 'Serum', done: false },
  { step: 4, name: 'Moisturizer', done: false },
  { step: 5, name: 'SPF', done: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const firstName = user?.user_metadata?.first_name
    || user?.email?.split('@')[0]
    || 'there';

  const completedSteps = MORNING_ROUTINE.filter(s => s.done).length;
  const totalSteps = MORNING_ROUTINE.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {firstName}</Text>
            <Text style={styles.subtitle}>Ready for your routine?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(app)/profile')}
          >
            <Ionicons name="person" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Today's Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTitleRow}>
              <View style={styles.sunIcon}>
                <Ionicons name="sunny" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.progressTitle}>Morning Routine</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>4 day streak</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>{completedSteps} of {totalSteps} steps</Text>
          </View>

          <View style={styles.stepsContainer}>
            {MORNING_ROUTINE.map((item) => (
              <TouchableOpacity
                key={item.step}
                style={[styles.stepItem, item.done && styles.stepItemDone]}
              >
                <View style={[styles.stepCheck, item.done && styles.stepCheckDone]}>
                  {item.done && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={[styles.stepName, item.done && styles.stepNameDone]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push('/(app)/routine')}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue Routine</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={24} color="#1F2937" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skin Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={20} color="#1F2937" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Daily Tip</Text>
            <Text style={styles.tipText}>
              Apply your products from thinnest to thickest consistency for best absorption.
            </Text>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyScans}>
            <Ionicons name="scan-outline" size={32} color="#D1D5DB" />
            <Text style={styles.emptyText}>No recent scans</Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push('/(app)/barcode')}
            >
              <Text style={styles.scanButtonText}>Scan a product</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Progress Card
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sunIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  streakBadge: {
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
  },
  stepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  stepItemDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  stepCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(17, 24, 39, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCheckDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepNameDone: {
    color: '#059669',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Quick Actions
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },

  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },

  // Recent Scans
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyScans: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 10,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});
