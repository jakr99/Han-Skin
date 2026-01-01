import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { RadioRow } from '@/components/ui/RadioRow';
import { CheckboxPill } from '@/components/ui/CheckboxPill';
import { Button } from '@/components/ui/Button';

const ROUTINE_OPTIONS = [
  { id: 'full', icon: '🧴', label: 'Yes, a full routine' },
  { id: 'basics', icon: '🧴', label: 'A few basics' },
  { id: 'not_yet', icon: '', label: 'Not yet' },
];

const PRODUCT_TYPES = [
  { id: 'cleanser', label: 'Cleanser' },
  { id: 'moisturizer', label: 'Moisturizer' },
  { id: 'spf', label: 'SPF' },
  { id: 'serums', label: 'Serums / treatments' },
];

export default function ProductsScreen() {
  const router = useRouter();
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
    // TODO: Store products in context/state
    router.push('/(auth)/onboarding/lifestyle');
  };

  const showProductTypes = routineLevel === 'full' || routineLevel === 'basics';

  return (
    <OnboardingContainer currentStep={4} totalSteps={7}>
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
          {ROUTINE_OPTIONS.map((option) => (
            <RadioRow
              key={option.id}
              icon={option.icon || undefined}
              label={option.label}
              selected={routineLevel === option.id}
              onPress={() => setRoutineLevel(option.id)}
            />
          ))}

          {/* Product Types */}
          {showProductTypes && (
            <View style={styles.productSection}>
              <Text style={styles.sectionTitle}>Which products do you use?</Text>
              <View style={styles.productGrid}>
                {PRODUCT_TYPES.map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <CheckboxPill
                      label={product.label}
                      selected={selectedProducts.includes(product.id)}
                      onPress={() => toggleProduct(product.id)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
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
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  productSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7A7A7A',
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productItem: {
    width: '48%',
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  helperText: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 16,
  },
});
