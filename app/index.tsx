import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session, initialized } = useAuth();
  const forceAuth = process.env.EXPO_PUBLIC_FORCE_AUTH === 'true';

  if (forceAuth) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#7A9E9F" />
      </View>
    );
  }

  return <Redirect href={session ? '/(app)' : '/(auth)'} />;
}
