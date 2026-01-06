import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'secondary';
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
        activeOpacity={0.9}
        style={[
          styles.primaryButton,
          fullWidth && styles.fullWidth,
          isDisabled && styles.primaryButtonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.primaryText}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          styles.secondaryButton,
          fullWidth && styles.fullWidth,
          isDisabled && styles.secondaryButtonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#1F2937" />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.secondaryText}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Outline variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.outlineButton,
        fullWidth && styles.fullWidth,
        isDisabled && styles.outlineButtonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#6B7280" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.outlineText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  primaryButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: '#111111',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.10)',
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '500',
  },
  outlineButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: 'transparent',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonDisabled: {
    opacity: 0.5,
  },
  outlineText: {
    color: '#6B7280',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default Button;
