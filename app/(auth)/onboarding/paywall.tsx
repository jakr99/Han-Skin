import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const FEATURES = [
  'Personalized AM & PM routine',
  'Ingredient safety analysis',
  'Progress tracking & adjustments',
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const handleContinue = () => {
    router.replace('/(app)');
  };

  const handleSkip = () => {
    router.replace('/(app)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={require('@/assets/images/paywall-hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(250, 250, 248, 0.4)', 'rgba(250, 250, 248, 0.9)', '#FAFAF8']}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.heroFade}
        />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Spacer for hero image area */}
        <View style={styles.heroSpacer} />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Your personalized routine is ready
          </Text>
          <Text style={styles.subtitle}>
            Start your tailored Korean skincare journey.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {/* Annual Plan */}
          <TouchableOpacity
            style={[styles.pricingCard, selectedPlan === 'annual' && styles.pricingCardSelected]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.7}
          >
            <View style={styles.pricingBadge}>
              <Text style={styles.pricingBadgeText}>Best Value</Text>
            </View>
            <View style={styles.pricingContent}>
              <View>
                <Text style={styles.pricingName}>Annual Plan</Text>
                <Text style={styles.pricingSubtitle}>~$2.08 / month</Text>
              </View>
              <View style={styles.pricingRight}>
                <Text style={styles.pricingPrice}>$24.99</Text>
                <Text style={styles.pricingPeriod}>/ year</Text>
              </View>
            </View>
            <View style={[styles.radio, selectedPlan === 'annual' && styles.radioSelected]}>
              {selectedPlan === 'annual' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[styles.pricingCard, selectedPlan === 'monthly' && styles.pricingCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <View style={styles.pricingContent}>
              <View>
                <Text style={styles.pricingName}>Monthly Plan</Text>
              </View>
              <View style={styles.pricingRight}>
                <Text style={styles.pricingPrice}>$7.99</Text>
                <Text style={styles.pricingPeriod}>/ month</Text>
              </View>
            </View>
            <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioSelected]}>
              {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          title="Try 3 Days Free"
          onPress={handleContinue}
        />
        <Text style={styles.disclaimer}>
          3-day free trial, then {selectedPlan === 'annual' ? '$24.99/year' : '$7.99/month'}.{'\n'}
          No charge today. Cancel anytime.
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
  heroContainer: {
    position: 'absolute',
    top: 0,
    right: -40,
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.85,
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
  skipButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  heroSpacer: {
    height: isSmallDevice ? SCREEN_WIDTH * 0.35 : SCREEN_WIDTH * 0.45,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: isSmallDevice ? 32 : 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#1F2937',
  },
  pricingContainer: {
    gap: 12,
    marginBottom: 16,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    padding: 16,
    position: 'relative',
  },
  pricingCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  pricingBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pricingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 36,
  },
  pricingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  pricingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  pricingRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pricingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  pricingPeriod: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 2,
  },
  radio: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -11,
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
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
});
