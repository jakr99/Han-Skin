import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    if (oauthLoading) return;

    setOauthLoading(true);
    try {
      const redirectTo = Linking.createURL('auth-callback');
      console.log('OAuth redirect URL:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error) {
        console.error('OAuth error:', error);
        Alert.alert('Sign in failed', error.message);
        return;
      }

      if (!data?.url) {
        Alert.alert('Sign in failed', 'Missing OAuth redirect URL.');
        return;
      }

      console.log('Opening OAuth URL:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log('OAuth result:', result);

      if (result.type === 'success' && result.url) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
        if (exchangeError) {
          console.error('Exchange error:', exchangeError);
          Alert.alert('Sign in failed', exchangeError.message);
          return;
        }
        router.replace('/(app)');
      }
    } catch (err) {
      console.error('OAuth exception:', err);
      Alert.alert('Sign in failed', 'Could not connect to authentication server. Please check your internet connection.');
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={require('../../assets/images/hero-model.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={[
            'rgba(250, 250, 248, 0)',
            'rgba(250, 250, 248, 0.35)',
            'rgba(250, 250, 248, 0.95)',
          ]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />

      </View>

      {/* Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 8 }]}>
        {/* Headline */}
        <Text style={styles.headline}>
          Clear skin, without{'\n'}the confusion.
        </Text>

        {/* Subcopy */}
        <Text style={styles.subcopy}>
          Scan products and build your glass skin routine.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Apple Button */}
          <TouchableOpacity
            onPress={() => handleOAuthSignIn('apple')}
            disabled={oauthLoading}
            activeOpacity={0.9}
            style={styles.appleButton}
          >
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            <Text style={styles.appleButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            onPress={() => handleOAuthSignIn('google')}
            disabled={oauthLoading}
            activeOpacity={0.9}
            style={styles.googleButton}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Email link */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/email-sign-in')}
          style={styles.emailLinkContainer}
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={styles.emailLink}>Sign in with email</Text>
        </TouchableOpacity>

        {/* Create account */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>New here? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up-profile')}>
            <Text style={styles.createAccountLink}>Create account</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <Text style={styles.legal}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },

  // Hero
  heroContainer: {
    height: isSmallDevice ? SCREEN_HEIGHT * 0.38 : SCREEN_HEIGHT * 0.42,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    position: 'absolute',
    top: 0,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Typography
  headline: {
    fontSize: isSmallDevice ? 27 : 32,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: isSmallDevice ? 34 : 40,
    marginTop: isSmallDevice ? 16 : 24,
  },
  subcopy: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 20 : 22,
    marginTop: 12,
    paddingHorizontal: 16,
  },

  // Buttons
  buttonContainer: {
    marginTop: isSmallDevice ? 18 : 24,
    gap: isSmallDevice ? 10 : 12,
  },
  appleButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: '#111111',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  googleButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.10)',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '500',
  },

  // Links
  emailLinkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  emailLink: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  createAccountText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(17, 24, 39, 0.55)',
  },
  createAccountLink: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(17, 24, 39, 0.70)',
  },

  // Legal
  legal: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: 'rgba(17, 24, 39, 0.45)',
    textAlign: 'center',
    marginTop: 14,
  },
});
