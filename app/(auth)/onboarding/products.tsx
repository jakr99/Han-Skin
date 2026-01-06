import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const ROUTINE_OPTIONS = [
  { id: 'full', icon: '🧴', label: 'Yes, a full routine' },
  { id: 'basics', icon: '✨', label: 'A few basics' },
  { id: 'not_yet', icon: '🌱', label: 'Not yet' },
];

const PRODUCT_TYPES = [
  { id: 'cleanser', label: 'Cleanser' },
  { id: 'moisturizer', label: 'Moisturizer' },
  { id: 'spf', label: 'SPF' },
  { id: 'serums', label: 'Serums / treatments' },
];

export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [routineLevel, setRoutineLevel] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleContinue = () => {
    router.push('/(auth)/onboarding/lifestyle');
  };

  const showProductTypes = routineLevel === 'full' || routineLevel === 'basics';

  return (
    <OnboardingContainer currentStep={6} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Do you currently{'\n'}use skincare products?
          </Text>
        </View>

        {/* Routine Options */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {ROUTINE_OPTIONS.map((option) => {
            const isSelected = routineLevel === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setRoutineLevel(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Product Types */}
          {showProductTypes && (
            <View style={styles.productSection}>
              <Text style={styles.sectionTitle}>Which products do you use?</Text>
              <View style={styles.productGrid}>
                {PRODUCT_TYPES.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[styles.productPill, isSelected && styles.productPillSelected]}
                      onPress={() => toggleProduct(product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.productLabel, isSelected && styles.productLabelSelected]}>
                        {product.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" style={styles.productCheck} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!routineLevel}
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
    paddingTop: isSmallDevice ? 16 : 24,
    marginBottom: isSmallDevice ? 20 : 28,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 32 : 38,
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionIcon: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(17, 24, 39, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#1F2937',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F2937',
  },
  productSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 14,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  productPillSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  productLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  productLabelSelected: {
    color: '#FFFFFF',
  },
  productCheck: {
    marginLeft: 6,
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
