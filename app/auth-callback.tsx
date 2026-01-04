import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authCode = typeof code === 'string' ? code : null;

    if (!authCode) {
      setLoading(false);
      Alert.alert('Authentication failed', 'Missing confirmation code.');
      router.replace('/(auth)/sign-in');
      return;
    }

    let isMounted = true;
    const exchange = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

      if (!isMounted) {
        return;
      }

      setLoading(false);
      if (error) {
        Alert.alert('Authentication failed', error.message);
        router.replace('/(auth)/sign-in');
        return;
      }

      const resolvedUser = data?.user ?? data?.session?.user;
      let user = resolvedUser;

      if (!user) {
        const { data: userData } = await supabase.auth.getUser();
        user = userData.user ?? null;
      }

      if (user) {
        const metadata = user.user_metadata ?? {};
        const profilePayload = {
          id: user.id,
          email: user.email ?? null,
          first_name: metadata.first_name ?? null,
          last_name: metadata.last_name ?? null,
          birthday: metadata.birthday ?? null,
          onboarding: metadata.onboarding ?? null,
        };
        const hasProfileData =
          profilePayload.first_name ||
          profilePayload.last_name ||
          profilePayload.birthday ||
          profilePayload.onboarding;

        if (hasProfileData) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profilePayload);
          if (profileError) {
            Alert.alert('Profile update failed', profileError.message);
          }
        }
      }

      router.replace('/(app)');
    };

    exchange();

    return () => {
      isMounted = false;
    };
  }, [code, router]);

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <ActivityIndicator color="#7A9E9F" />
      <Text className="mt-4 text-text-secondary text-center">
        {loading ? 'Confirming your account…' : 'Redirecting…'}
      </Text>
    </View>
  );
}
