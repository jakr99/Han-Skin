import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session, initialized } = useAuth();

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#7A9E9F" />
      </View>
    );
  }

  return <Redirect href={session ? '/(app)' : '/(auth)'} />;
}
