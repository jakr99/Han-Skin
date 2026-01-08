import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

type Step = {
  id: string;
  name: string;
  product: string;
  description: string;
  done: boolean;
  icon: string;
};

const MORNING_STEPS: Step[] = [
  { id: '1', name: 'Cleanser', product: 'COSRX Low pH Cleanser', description: 'Gently cleanse', done: true, icon: 'water-outline' },
  { id: '2', name: 'Toner', product: 'Anua Heartleaf Toner', description: 'Hydrate & prep', done: true, icon: 'flask-outline' },
  { id: '3', name: 'Serum', product: 'COSRX Vitamin C Serum', description: 'Brighten skin', done: false, icon: 'sunny-outline' },
  { id: '4', name: 'Moisturizer', product: 'Illiyoon Ceramide Cream', description: 'Lock in hydration', done: false, icon: 'leaf-outline' },
  { id: '5', name: 'Sunscreen', product: 'Beauty of Joseon SPF50+', description: 'Protect from UV', done: false, icon: 'shield-outline' },
];

const NIGHT_STEPS: Step[] = [
  { id: '1', name: 'Oil Cleanser', product: 'Heimish All Clean Balm', description: 'Remove makeup', done: false, icon: 'water-outline' },
  { id: '2', name: 'Water Cleanser', product: 'COSRX Low pH Cleanser', description: 'Deep cleanse', done: false, icon: 'water' },
  { id: '3', name: 'Toner', product: 'Anua Heartleaf Toner', description: 'Balance skin', done: false, icon: 'flask-outline' },
  { id: '4', name: 'Treatment', product: "Paula's Choice BHA", description: 'Exfoliate pores', done: false, icon: 'sparkles-outline' },
  { id: '5', name: 'Night Cream', product: 'Laneige Sleeping Mask', description: 'Overnight repair', done: false, icon: 'moon-outline' },
];

export default function RoutineScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  const [steps, setSteps] = useState({ morning: MORNING_STEPS, night: NIGHT_STEPS });

  const currentSteps = steps[activeTab];
  const completedCount = currentSteps.filter(s => s.done).length;
  const totalCount = currentSteps.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const toggleStep = (stepId: string) => {
    setSteps(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(step =>
        step.id === stepId ? { ...step, done: !step.done } : step
      ),
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>My Routine</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'morning' && styles.tabActive]}
          onPress={() => setActiveTab('morning')}
        >
          <Ionicons
            name="sunny"
            size={18}
            color={activeTab === 'morning' ? '#F59E0B' : '#9CA3AF'}
          />
          <Text style={[styles.tabText, activeTab === 'morning' && styles.tabTextActive]}>
            Morning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'night' && styles.tabActive]}
          onPress={() => setActiveTab('night')}
        >
          <Ionicons
            name="moon"
            size={18}
            color={activeTab === 'night' ? '#6366F1' : '#9CA3AF'}
          />
          <Text style={[styles.tabText, activeTab === 'night' && styles.tabTextActive]}>
            Evening
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedCount} of {totalCount} steps completed</Text>
      </View>

      {/* Routine List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentSteps.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.routineItem, item.done && styles.routineItemDone]}
            onPress={() => toggleStep(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.stepIndicator}>
              <View style={[styles.stepNumber, item.done && styles.stepNumberDone]}>
                {item.done ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>{item.id}</Text>
                )}
              </View>
              {index < currentSteps.length - 1 && (
                <View style={[styles.stepLine, item.done && styles.stepLineDone]} />
              )}
            </View>

            <View style={styles.itemContent}>
              <Text style={[styles.itemName, item.done && styles.itemNameDone]}>{item.name}</Text>
              <Text style={styles.itemProduct}>{item.product}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>

            <View style={styles.itemRight}>
              <View style={styles.itemIcon}>
                <Ionicons name={item.icon as any} size={22} color={item.done ? '#10B981' : '#1F2937'} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={18} color="#1F2937" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tip</Text>
            <Text style={styles.tipText}>
              {activeTab === 'morning'
                ? 'Apply Vitamin C before sunscreen for best results.'
                : 'Wait 20 minutes after applying retinol before moisturizer.'}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.completeButton} activeOpacity={0.9}>
          <Text style={styles.completeButtonText}>
            {completedCount === totalCount ? 'Routine Complete!' : 'Mark All Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  routineItemDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberDone: {
    backgroundColor: '#10B981',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    marginTop: 6,
  },
  stepLineDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  itemContent: {
    flex: 1,
    paddingTop: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemNameDone: {
    color: '#059669',
  },
  itemProduct: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  itemRight: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    gap: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
  bottomAction: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#FAFAF8',
  },
  completeButton: {
    backgroundColor: '#111111',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
