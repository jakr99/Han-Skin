import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { useOnboarding } from '@/context/OnboardingContext';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const { firstName, lastName, reset } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          first_name: trimmedFirstName || undefined,
          last_name: trimmedLastName || undefined,
        },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }

    if (!data.session) {
      reset();
      Alert.alert('Check your email', 'Confirm your email to finish signing up.');
      router.replace('/(auth)/sign-in');
      return;
    }

    const userId = data.session.user.id;
    const profilePayload = {
      id: userId,
      email: data.session.user.email ?? trimmedEmail,
      first_name: trimmedFirstName || null,
      last_name: trimmedLastName || null,
    };
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload);

    if (profileError) {
      Alert.alert('Profile update failed', profileError.message);
    }

    reset();
    router.replace('/(auth)/onboarding/complete');
  };

  return (
    <OnboardingContainer currentStep={10} totalSteps={11}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-between">
          <View className="items-center pt-8">
            <Logo size="md" />
            <Text className="text-2xl font-semibold text-text-primary text-center mt-8">
              Create your account
            </Text>

            <View className="w-full mt-8 gap-4">
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                secureTextEntry
              />
            </View>

            <View className="w-full mt-6">
              <Button
                title="Continue"
                onPress={handleContinue}
                loading={loading}
                disabled={!email.trim() || !password}
              />
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className="text-text-secondary text-sm">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                <Text className="text-secondary font-medium text-sm">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </OnboardingContainer>
  );
}
