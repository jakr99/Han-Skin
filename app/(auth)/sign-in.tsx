import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    // TODO: Implement actual sign in with Appwrite
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app after sign in
      // router.replace('/(tabs)/home');
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign in');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple sign in');
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
            <TouchableOpacity className="self-end mb-6">
              <Text className="text-text-secondary text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={!email || !password}
            />

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
                icon={
                  <Text style={{ fontSize: 18, fontWeight: '600' }}>G</Text>
                }
              />
              <Button
                title="Sign in with Apple"
                onPress={handleAppleSignIn}
                variant="social"
                icon={
                  <Ionicons name="logo-apple" size={20} color="#3D3D3D" />
                }
              />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-text-secondary text-sm">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                <Text className="text-secondary font-medium text-sm">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
