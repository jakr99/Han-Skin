import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleContinue = () => {
    // TODO: Store name in context/state
    router.push('/(auth)/birthday');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
        </TouchableOpacity>

        <View className="flex-1 px-6 justify-between">
          {/* Top Section */}
          <View className="items-center pt-8">
            {/* Logo */}
            <Logo size="md" />

            {/* Question */}
            <Text className="text-2xl font-semibold text-text-primary text-center mt-8">
              What's your full name?
            </Text>

            {/* Inputs */}
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

            {/* Continue Button */}
            <View className="w-full mt-6">
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!firstName.trim() || !lastName.trim()}
              />
            </View>
          </View>

          {/* Bottom Logo */}
          <View className="items-center pb-8">
            <Logo size="sm" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
