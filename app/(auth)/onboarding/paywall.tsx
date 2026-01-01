import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { PricingCard } from '@/components/ui/PricingCard';
import { Button } from '@/components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURES = [
  'Personalized AM & PM routine',
  'Ingredient safety analysis',
  'Progress tracking & adjustments',
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const handleContinue = () => {
    // TODO: Implement subscription logic
    router.push('/(auth)/onboarding/complete');
  };

  const handleSkip = () => {
    // Skip paywall for now
    router.push('/(auth)/onboarding/complete');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDF5F0', '#F5F0F5', '#F0F5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Hero Image - Positioned absolutely at top right */}
        <Image
          source={require('@/assets/images/paywall-hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Fade overlay for smooth blend */}
        <LinearGradient
          colors={['transparent', 'rgba(253, 245, 240, 0.3)', 'rgba(253, 245, 240, 0.8)', '#FDF5F0']}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.heroFade}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
            </TouchableOpacity>

            <ProgressDots total={8} current={8} />

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
                  <Ionicons name="checkmark" size={18} color="#7A9E9F" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Pricing Cards */}
            <View style={styles.pricingContainer}>
              <PricingCard
                planName="Annual Plan"
                price="$24.99"
                period="/ year"
                subtitle="~$2.08 / month"
                badge="Best Value"
                selected={selectedPlan === 'annual'}
                onPress={() => setSelectedPlan('annual')}
              />
              <PricingCard
                planName="Monthly Plan"
                price="$7.99"
                period="/ month"
                selected={selectedPlan === 'monthly'}
                onPress={() => setSelectedPlan('monthly')}
              />
            </View>
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Button
              title="Try 3 Days Free"
              onPress={handleContinue}
            />
            <Text style={styles.disclaimer}>
              3-day free trial, then {selectedPlan === 'annual' ? '$24.99/year' : '$7.99/month'}.{'\n'}
              No charge today. Cancel anytime.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    right: -40,
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.85,
    zIndex: 1,
  },
  heroFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: SCREEN_WIDTH * 0.9,
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    zIndex: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#7A7A7A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  heroSpacer: {
    height: SCREEN_WIDTH * 0.45,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D3D3D',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 8,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#3D3D3D',
    marginLeft: 10,
  },
  pricingContainer: {
    marginBottom: 16,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  disclaimer: {
    fontSize: 11,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});
