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
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const redirectUrl = Linking.createURL('auth-callback');

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
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
        email: data.user.email ?? email.trim(),
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
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter your email to reset your password.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }

    Alert.alert('Check your email', 'We sent a password reset link.');
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    if (oauthLoading) {
      return;
    }

    setOauthLoading(true);
    try {
      const redirectTo = redirectUrl;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert('Sign in failed', error.message);
        return;
      }

      if (!data?.url) {
        Alert.alert('Sign in failed', 'Missing OAuth redirect URL.');
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const code = queryParams?.code;
        const authCode = typeof code === 'string' ? code : null;

        if (!authCode) {
          Alert.alert('Sign in failed', 'Missing OAuth confirmation code.');
          return;
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
        if (exchangeError) {
          Alert.alert('Sign in failed', exchangeError.message);
          return;
        }

        router.replace('/(app)');
      }
    } finally {
      setOauthLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    handleOAuthSignIn('google');
  };

  const handleAppleSignIn = () => {
    handleOAuthSignIn('apple');
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
        <View className="flex-1 px-6 pt-12 pb-8">
          {/* Logo */}
          <View className="items-center mt-4">
            <Logo size="md" />
          </View>

          {/* Tagline */}
          <View className="items-center mt-6">
            <Text className="text-2xl font-semibold text-text-primary text-center">
              Achieve Radiant, Glass Skin
            </Text>
            <Text className="text-sm text-text-secondary text-center mt-2 px-4">
              Personalized Korean skincare routines{'\n'}tailored for your skin.
            </Text>
          </View>

          {/* Sign In Form */}
          <View className="mt-8">
            <Text className="text-xl font-semibold text-text-primary text-center mb-6">
              Sign In
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                secureTextEntry
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mb-6" onPress={handleForgotPassword}>
              <Text className="text-text-secondary text-sm">Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={!email.trim() || !password}
            />
            <Text className="text-[11px] text-text-muted mt-3 text-center">
              Redirect URL: {redirectUrl}
            </Text>

            {/* Or Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-text-muted text-sm">or</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Social Sign In */}
            <View className="gap-3">
              <Button
                title="Sign in with Google"
                onPress={handleGoogleSignIn}
                variant="social"
                disabled={oauthLoading}
                icon={<Text style={{ fontSize: 18, fontWeight: '600' }}>G</Text>}
              />
              <Button
                title="Sign in with Apple"
                onPress={handleAppleSignIn}
                variant="social"
                disabled={oauthLoading}
                icon={<Ionicons name="logo-apple" size={20} color="#3D3D3D" />}
              />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-text-secondary text-sm">Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/sign-up-profile')}
              >
                <Text className="text-secondary font-medium text-sm">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
