import React from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

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
  const insets = useSafeAreaInsets();

  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default OnboardingContainer;
