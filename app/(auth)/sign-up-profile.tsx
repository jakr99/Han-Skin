import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { useOnboarding } from '@/context/OnboardingContext';

export default function SignUpProfileScreen() {
  const router = useRouter();
  const { firstName, lastName, setFirstName, setLastName } = useOnboarding();

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    router.push('/(auth)/birthday');
  };

  return (
    <OnboardingContainer currentStep={1} totalSteps={11}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
            <Logo size="md" />

            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>
              We'll use this to personalize your experience
            </Text>

            <View style={styles.inputsContainer}>
              <Input
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!firstName.trim() || !lastName.trim()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  inputsContainer: {
    width: '100%',
    marginTop: 32,
    gap: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});
