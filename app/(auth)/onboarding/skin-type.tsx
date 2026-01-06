import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const SKIN_TYPES = [
  { id: 'dry', icon: '💧', title: 'Dry', description: 'Feels tight or flaky' },
  { id: 'oily', icon: '💦', title: 'Oily', description: 'Shiny, prone to breakouts' },
  { id: 'combination', icon: '⚖️', title: 'Combination', description: 'Oily + dry areas' },
  { id: 'normal', icon: '✨', title: 'Normal', description: 'Balanced, rarely irritated' },
  { id: 'sensitive', icon: '🌸', title: 'Sensitive', description: 'Easily red or reactive' },
];

export default function SkinTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    router.push('/(auth)/onboarding/products');
  };

  return (
    <OnboardingContainer currentStep={5} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            How would you{'\n'}describe your skin?
          </Text>
        </View>

        {/* Skin Types List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {SKIN_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                <View style={styles.typeIconContainer}>
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                </View>
                <View style={styles.typeContent}>
                  <Text style={[styles.typeTitle, isSelected && styles.typeTitleSelected]}>
                    {type.title}
                  </Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedType}
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
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typeCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  typeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  typeIcon: {
    fontSize: 22,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  typeTitleSelected: {
    fontWeight: '600',
  },
  typeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
