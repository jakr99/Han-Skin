import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'social';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          fullWidth && styles.fullWidth,
          !isDisabled && styles.activeButtonShadow,
        ]}
      >
        <LinearGradient
          colors={isDisabled ? ['#D1DEDE', '#C4D4D4'] : ['#6B9293', '#4A7A7B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.primaryButton,
            isDisabled && styles.primaryButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[
              styles.primaryText,
              isDisabled && styles.primaryTextDisabled,
            ]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'social') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[styles.socialButton, fullWidth && styles.fullWidth]}
      >
        {icon && <View style={styles.socialIcon}>{icon}</View>}
        <Text style={styles.socialText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Outline variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.outlineButton, fullWidth && styles.fullWidth]}
    >
      {loading ? (
        <ActivityIndicator color="#7A9E9F" />
      ) : (
        <Text style={styles.outlineText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  activeButtonShadow: {
    shadowColor: '#4A7A7B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryTextDisabled: {
    opacity: 0.8,
  },
  outlineButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E5E2DE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineText: {
    color: '#7A9E9F',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E2DE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialText: {
    color: '#3D3D3D',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Button;
