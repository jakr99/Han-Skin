import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
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
        className="flex-1"
      >
        <View className="flex-1 justify-between">
          <View className="items-center pt-8">
            <Logo size="md" />

            <Text className="text-2xl font-semibold text-text-primary text-center mt-8">
              What's your full name?
            </Text>

            <View className="w-full mt-8 gap-4">
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

            <View className="w-full mt-6">
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!firstName.trim() || !lastName.trim()}
              />
            </View>
          </View>

          <View className="items-center pb-8">
            <Logo size="sm" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </OnboardingContainer>
  );
}
