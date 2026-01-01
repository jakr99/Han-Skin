import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AppHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      Alert.alert('Sign out failed', error.message);
      return;
    }

    router.replace('/(auth)');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Logo size="md" />
      <Text className="text-text-primary text-2xl font-semibold mt-6">
        You're signed in
      </Text>
      {user?.email ? (
        <Text className="text-text-secondary mt-2">{user.email}</Text>
      ) : null}
      <View className="w-full mt-8">
        <Button title="Sign Out" onPress={handleSignOut} loading={loading} />
      </View>
    </View>
  );
}
