import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/domain/Logo';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to sign-in after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/sign-in');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Logo size="lg" />
    </View>
  );
}
