import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressDots } from '@/components/ui/ProgressDots';

interface OnboardingContainerProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
}

export function OnboardingContainer({
  children,
  currentStep,
  totalSteps,
  showBackButton = true,
}: OnboardingContainerProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FDF5F0', '#F5F0F5', '#F0F5F5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}

          <ProgressDots total={totalSteps} current={currentStep} />

          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default OnboardingContainer;
