import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to auth flow on app start
  // Later this will check auth state and redirect accordingly
  return <Redirect href="/(auth)" />;
}