import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type RoutineTime = 'morning' | 'night';

type Step = {
  id: string;
  name: string;
  product: string;
  description: string;
  duration: string | null;
  completed: boolean;
  isBestSeller?: boolean;
  icon: string;
};

// Product alternatives for each step type
const PRODUCT_ALTERNATIVES: Record<string, { name: string; description: string; price: string; rating: number }[]> = {
  'Cleanser': [
    { name: 'Banila Co Clean Cleansing Balm', description: 'Gently removes makeup and impurities', price: '$23', rating: 4.8 },
    { name: 'COSRX Low pH Good Morning Cleanser', description: 'Gentle daily cleanser', price: '$12', rating: 4.6 },
    { name: 'Beauty of Joseon Radiance Cleansing Balm', description: 'Rice bran cleansing balm', price: '$19', rating: 4.7 },
    { name: 'Heimish All Clean Balm', description: 'Sherbet texture cleanser', price: '$18', rating: 4.5 },
  ],
  'Toner': [
    { name: "I'm From Rice Toner", description: 'Hydrates and soothes', price: '$25', rating: 4.8 },
    { name: 'Anua Heartleaf 77% Soothing Toner', description: 'Calms sensitive skin', price: '$20', rating: 4.9 },
    { name: 'COSRX AHA/BHA Clarifying Treatment Toner', description: 'Gentle exfoliating toner', price: '$15', rating: 4.5 },
    { name: 'Klairs Supple Preparation Toner', description: 'Deep hydration', price: '$22', rating: 4.7 },
  ],
  'Vitamin C': [
    { name: 'COSRX The Vitamin C 13 Serum', description: 'Brightens and evens skin tone', price: '$21', rating: 4.8 },
    { name: 'Beauty of Joseon Glow Serum', description: 'Propolis + Niacinamide', price: '$17', rating: 4.9 },
    { name: 'Klairs Freshly Juiced Vitamin Drop', description: '5% Vitamin C serum', price: '$23', rating: 4.6 },
    { name: 'Some By Mi Galactomyces Serum', description: 'Brightening & hydrating', price: '$18', rating: 4.5 },
  ],
  'Moisturizer': [
    { name: 'Laneige Water Bank Gel Cream', description: 'Hydrates and balances', price: '$35', rating: 4.7 },
    { name: 'COSRX Oil-Free Moisturizing Lotion', description: 'Lightweight daily moisturizer', price: '$16', rating: 4.6 },
    { name: 'Belif True Cream Aqua Bomb', description: 'Burst of hydration', price: '$38', rating: 4.8 },
    { name: 'Etude House Soon Jung 2x Barrier', description: 'For sensitive skin', price: '$15', rating: 4.7 },
  ],
  'Sunscreen': [
    { name: 'Beauty of Joseon Relief Sun SPF 50+', description: 'Rice + Probiotics sunscreen', price: '$18', rating: 4.9 },
    { name: 'COSRX Aloe Soothing Sun Cream', description: 'Lightweight SPF 50', price: '$15', rating: 4.5 },
    { name: 'Isntree Hyaluronic Acid Watery Sun Gel', description: 'No white cast', price: '$17', rating: 4.7 },
    { name: 'Round Lab Birch Juice Sun Cream', description: 'Moisturizing sunscreen', price: '$20', rating: 4.6 },
  ],
  'Oil Cleanser': [
    { name: 'DHC Deep Cleansing Oil', description: 'Removes sunscreen and makeup', price: '$28', rating: 4.7 },
    { name: 'Banila Co Clean It Zero', description: 'Sherbet cleansing balm', price: '$23', rating: 4.8 },
    { name: 'Kose Softymo Speedy Cleansing Oil', description: 'Quick makeup remover', price: '$12', rating: 4.5 },
    { name: 'Hada Labo Cleansing Oil', description: 'Gentle oil cleanser', price: '$15', rating: 4.6 },
  ],
  'Water Cleanser': [
    { name: 'CeraVe Foaming Cleanser', description: 'Deep cleans pores', price: '$15', rating: 4.6 },
    { name: 'La Roche-Posay Toleriane Cleanser', description: 'For sensitive skin', price: '$15', rating: 4.7 },
    { name: 'COSRX Low pH Good Morning Cleanser', description: 'Tea tree cleanser', price: '$12', rating: 4.6 },
    { name: 'Vanicream Gentle Cleanser', description: 'Fragrance-free', price: '$10', rating: 4.5 },
  ],
  'Treatment': [
    { name: "Paula's Choice 2% BHA", description: 'Exfoliates and unclogs pores', price: '$32', rating: 4.8 },
    { name: 'COSRX BHA Blackhead Power Liquid', description: 'Blackhead treatment', price: '$18', rating: 4.6 },
    { name: 'The Ordinary Niacinamide 10%', description: 'Pore minimizing', price: '$6', rating: 4.5 },
    { name: 'Some By Mi AHA BHA PHA Toner', description: '30 days miracle', price: '$15', rating: 4.7 },
  ],
  'Night Cream': [
    { name: 'Laneige Water Sleeping Mask', description: 'Intensive overnight hydration', price: '$28', rating: 4.8 },
    { name: 'COSRX Ultimate Nourishing Rice Mask', description: 'Rice overnight mask', price: '$18', rating: 4.7 },
    { name: 'Glow Recipe Watermelon Mask', description: 'Hydrating sleeping mask', price: '$45', rating: 4.6 },
    { name: 'Innisfree Green Tea Sleeping Mask', description: 'Antioxidant overnight care', price: '$22', rating: 4.5 },
  ],
};

const MORNING_STEPS: Step[] = [
  {
    id: '1',
    name: 'Cleanser',
    product: 'Banila Co Clean Cleansing Balm',
    description: 'Gently removes makeup and impurities',
    duration: '1 min',
    completed: true,
    icon: 'water-outline',
  },
  {
    id: '2',
    name: 'Toner',
    product: "I'm From Rice Toner",
    description: 'Hydrates and soothes',
    duration: '2 min',
    completed: true,
    icon: 'flask-outline',
  },
  {
    id: '3',
    name: 'Vitamin C',
    product: 'COSRX The Vitamin C 13 Serum',
    description: 'Brightens and evens skin tone',
    duration: null,
    completed: true,
    isBestSeller: true,
    icon: 'sunny-outline',
  },
  {
    id: '4',
    name: 'Moisturizer',
    product: 'Laneige Water Bank Gel Cream',
    description: 'Hydrates and balances',
    duration: '1 min',
    completed: false,
    icon: 'leaf-outline',
  },
  {
    id: '5',
    name: 'Sunscreen',
    product: 'Beauty of Joseon Relief Sun SPF 50+',
    description: 'Apply 15 minutes before sun exposure',
    duration: null,
    completed: false,
    icon: 'shield-outline',
  },
];

const NIGHT_STEPS: Step[] = [
  {
    id: '1',
    name: 'Oil Cleanser',
    product: 'DHC Deep Cleansing Oil',
    description: 'Removes sunscreen and makeup',
    duration: '2 min',
    completed: false,
    icon: 'water-outline',
  },
  {
    id: '2',
    name: 'Water Cleanser',
    product: 'CeraVe Foaming Cleanser',
    description: 'Deep cleans pores',
    duration: '1 min',
    completed: false,
    icon: 'water',
  },
  {
    id: '3',
    name: 'Toner',
    product: "I'm From Rice Toner",
    description: 'Preps skin for treatment',
    duration: '1 min',
    completed: false,
    icon: 'flask-outline',
  },
  {
    id: '4',
    name: 'Treatment',
    product: "Paula's Choice 2% BHA",
    description: 'Exfoliates and unclogs pores',
    duration: null,
    completed: false,
    icon: 'sparkles-outline',
  },
  {
    id: '5',
    name: 'Night Cream',
    product: 'Laneige Water Sleeping Mask',
    description: 'Intensive overnight hydration',
    duration: null,
    completed: false,
    icon: 'moon-outline',
  },
];

export default function RoutineScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RoutineTime>('morning');
  const [steps, setSteps] = useState({
    morning: MORNING_STEPS,
    night: NIGHT_STEPS,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const currentSteps = steps[activeTab];
  const completedCount = currentSteps.filter(s => s.completed).length;
  const totalCount = currentSteps.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const toggleStep = (stepId: string) => {
    setSteps(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      ),
    }));
  };

  const markAllDone = () => {
    setSteps(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(step => ({ ...step, completed: true })),
    }));
  };

  const openProductPicker = (step: Step) => {
    setSelectedStep(step);
    setModalVisible(true);
  };

  const selectProduct = (productName: string, description: string) => {
    if (!selectedStep) return;

    setSteps(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(step =>
        step.id === selectedStep.id
          ? { ...step, product: productName, description: description }
          : step
      ),
    }));
    setModalVisible(false);
    setSelectedStep(null);
  };

  const getAlternatives = () => {
    if (!selectedStep) return [];
    return PRODUCT_ALTERNATIVES[selectedStep.name] || [];
  };

  const backgroundColors = activeTab === 'night'
    ? ['#2D1B4E', '#1E1333', '#150D24', '#0D0815']
    : ['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0'];

  const textColor = activeTab === 'night' ? '#FFFFFF' : '#1F2937';
  const subtitleColor = activeTab === 'night' ? '#C4B5D4' : '#6B7280';
  const cardBg = activeTab === 'night' ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF';
  const cardBorder = activeTab === 'night' ? 'rgba(183, 148, 246, 0.2)' : 'transparent';
  const accentColor = activeTab === 'night' ? '#B794F6' : '#7A9E9F';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Routine</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Morning/Night Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'morning' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('morning')}
        >
          <Ionicons
            name="sunny"
            size={16}
            color={activeTab === 'morning' ? '#E8B86D' : '#9CA3AF'}
          />
          <Text style={[styles.toggleText, activeTab === 'morning' && styles.toggleTextActive]}>
            Morning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'night' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('night')}
        >
          <Ionicons
            name="moon"
            size={16}
            color={activeTab === 'night' ? '#7A9E9F' : '#9CA3AF'}
          />
          <Text style={[styles.toggleText, activeTab === 'night' && styles.toggleTextActive]}>
            Night
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Routine Header */}
        <View style={styles.routineHeader}>
          <View style={styles.routineTitleRow}>
            <Ionicons
              name={activeTab === 'morning' ? 'sunny' : 'moon'}
              size={24}
              color={activeTab === 'morning' ? '#E8B86D' : '#B794F6'}
            />
            <Text style={[styles.routineTitle, { color: textColor }]}>
              {activeTab === 'morning' ? 'Morning' : 'Night'} Routine
            </Text>
          </View>
          <Text style={[styles.routineSubtitle, { color: subtitleColor }]}>
            {activeTab === 'morning'
              ? 'Recommended steps to start your day.'
              : 'Wind down with your evening skincare.'}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={[styles.progressText, { color: subtitleColor }]}>{completedCount} out of {totalCount} completed</Text>
          <View style={[styles.progressBar, { backgroundColor: activeTab === 'night' ? 'rgba(255,255,255,0.2)' : '#E5E7EB' }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: accentColor }]} />
          </View>
        </View>

        {/* Steps List */}
        <View style={styles.stepsList}>
          {currentSteps.map((step) => (
            <View
              key={step.id}
              style={[
                styles.stepItem,
                { backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder },
                step.completed && activeTab === 'morning' && styles.stepItemCompleted,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  step.completed && { backgroundColor: accentColor, borderColor: accentColor },
                  { borderColor: activeTab === 'night' ? 'rgba(255,255,255,0.3)' : '#D1D5DB' },
                ]}
                onPress={() => toggleStep(step.id)}
              >
                {step.completed && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={[
                    styles.stepName,
                    { color: textColor },
                    step.completed && { color: subtitleColor },
                  ]}>
                    {step.name}
                  </Text>
                  {step.isBestSeller && (
                    <View style={styles.bestSellerBadge}>
                      <Text style={styles.bestSellerText}>Best Seller</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.stepProduct, { color: activeTab === 'night' ? '#E0D4F0' : '#4B5563' }]}>{step.product}</Text>
                <Text style={[styles.stepDescription, { color: subtitleColor }]}>{step.description}</Text>

                {/* Change Product Button */}
                <TouchableOpacity
                  style={styles.changeProductButton}
                  onPress={() => openProductPicker(step)}
                >
                  <Ionicons name="swap-horizontal" size={14} color={accentColor} />
                  <Text style={[styles.changeProductText, { color: accentColor }]}>Change product</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.stepRight}>
                {step.duration && (
                  <View style={[styles.durationBadge, { backgroundColor: activeTab === 'night' ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]}>
                    <Ionicons name="time-outline" size={12} color={subtitleColor} />
                    <Text style={[styles.durationText, { color: subtitleColor }]}>{step.duration}</Text>
                  </View>
                )}
                <View style={[styles.stepIconContainer, { backgroundColor: activeTab === 'night' ? 'rgba(183, 148, 246, 0.15)' : '#F5F9F8' }]}>
                  <Ionicons name={step.icon as any} size={24} color={accentColor} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={[
          styles.tipsSection,
          { backgroundColor: activeTab === 'night' ? 'rgba(183, 148, 246, 0.15)' : '#FFFBEB' }
        ]}>
          <View style={[styles.tipIcon, { backgroundColor: activeTab === 'night' ? 'rgba(183, 148, 246, 0.3)' : '#FEF3C7' }]}>
            <Text style={styles.tipEmoji}>💡</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipLabel, { color: activeTab === 'night' ? '#D4B8F8' : '#92400E' }]}>Tip:</Text>
            <Text style={[styles.tipText, { color: activeTab === 'night' ? '#C4B5D4' : '#A16207' }]}>
              {activeTab === 'morning'
                ? 'Apply Vitamin C before sunscreen for best results.'
                : 'Wait 20 minutes after applying retinol before moisturizer.'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.markAllButton,
              {
                backgroundColor: activeTab === 'night' ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                borderColor: activeTab === 'night' ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
              }
            ]}
            onPress={markAllDone}
          >
            <Ionicons name="checkmark-done" size={18} color={subtitleColor} />
            <Text style={[styles.markAllText, { color: subtitleColor }]}>Mark All as Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.addStepButton, { backgroundColor: accentColor }]}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addStepText}>Add Step</Text>
          </TouchableOpacity>
        </View>

        {/* Completion Message */}
        {completedCount === totalCount && (
          <View style={styles.completionMessage}>
            <Text style={styles.completionEmoji}>✨</Text>
            <Text style={[styles.completionText, { color: accentColor }]}>
              Great job! Your skin is ready for the {activeTab === 'morning' ? 'day' : 'night'}.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Product Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Choose {selectedStep?.name}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {getAlternatives().map((product, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.productOption,
                    selectedStep?.product === product.name && styles.productOptionSelected,
                  ]}
                  onPress={() => selectProduct(product.name, product.description)}
                >
                  <View style={styles.productOptionContent}>
                    <Text style={styles.productOptionName}>{product.name}</Text>
                    <Text style={styles.productOptionDescription}>{product.description}</Text>
                    <View style={styles.productOptionMeta}>
                      <Text style={styles.productOptionPrice}>{product.price}</Text>
                      <View style={styles.productOptionRating}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.productOptionRatingText}>{product.rating}</Text>
                      </View>
                    </View>
                  </View>
                  {selectedStep?.product === product.name && (
                    <Ionicons name="checkmark-circle" size={24} color="#7A9E9F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#EAEAEA',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  routineHeader: {
    marginBottom: 16,
  },
  routineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routineTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  routineSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7A9E9F',
    borderRadius: 3,
  },
  stepsList: {
    gap: 12,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stepItemCompleted: {
    backgroundColor: '#F9FAFB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#7A9E9F',
    borderColor: '#7A9E9F',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  stepNameCompleted: {
    color: '#9CA3AF',
  },
  bestSellerBadge: {
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestSellerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D4A574',
  },
  stepProduct: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  changeProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  changeProductText: {
    fontSize: 12,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  stepRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F9F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipEmoji: {
    fontSize: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: '#A16207',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  markAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  addStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#7A9E9F',
  },
  addStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  completionEmoji: {
    fontSize: 16,
  },
  completionText: {
    fontSize: 14,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  productOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productOptionSelected: {
    borderColor: '#7A9E9F',
    backgroundColor: '#F0F9F8',
  },
  productOptionContent: {
    flex: 1,
  },
  productOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productOptionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  productOptionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productOptionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  productOptionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productOptionRatingText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
