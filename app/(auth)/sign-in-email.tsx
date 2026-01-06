import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

export default function SignInEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }

    const metadata = data.user?.user_metadata ?? {};
    const hasProfileData =
      metadata.first_name ||
      metadata.last_name ||
      metadata.birthday ||
      metadata.onboarding;

    if (data.user?.id && hasProfileData) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email ?? trimmedEmail,
        first_name: metadata.first_name ?? null,
        last_name: metadata.last_name ?? null,
        birthday: metadata.birthday ?? null,
        onboarding: metadata.onboarding ?? null,
      });

      if (profileError) {
        Alert.alert('Profile update failed', profileError.message);
      }
    }

    router.replace('/(app)');
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Email required', 'Enter your email to reset your password.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }

    Alert.alert('Check your email', 'We sent a password reset link.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-10 pb-8">
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/sign-in')}
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#7A9E9F" />
          </TouchableOpacity>

          <View className="items-center">
            <Logo size="md" />
            <Text className="text-2xl font-semibold text-text-primary text-center mt-6">
              Sign in with email
            </Text>
            <Text className="text-sm text-text-secondary text-center mt-2 px-6">
              Welcome back! Enter your email and password.
            </Text>
          </View>

          <View className="mt-8 gap-4">
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

          <TouchableOpacity className="self-end mt-3" onPress={handleForgotPassword}>
            <Text className="text-text-secondary text-sm">Forgot password?</Text>
          </TouchableOpacity>

          <View className="mt-6">
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={!email.trim() || !password}
            />
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-text-secondary text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up-profile')}>
              <Text className="text-secondary font-medium text-sm">Create account</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center mt-6"
            onPress={() => router.replace('/(auth)/sign-in')}
          >
            <Text className="text-text-muted text-sm">Back to sign in options</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
