import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { UserProfileProvider } from '@/context/UserProfileContext';
import './global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <UserProfileProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FBF9F7' },
            }}
          />
        </UserProfileProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
