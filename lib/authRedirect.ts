import * as Linking from 'expo-linking';

export const getAuthRedirectUrl = () => {
  const override = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
  if (override && override.trim().length > 0) {
    return override.trim();
  }

  return Linking.createURL('auth-callback');
};
