import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /** Badge text */
  label: string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: theme.colors.interactive.hover,
    text: theme.colors.text.primary,
  },
  success: {
    bg: theme.colors.status.successBg,
    text: theme.colors.status.success,
  },
  warning: {
    bg: theme.colors.status.warningBg,
    text: theme.colors.status.warning,
  },
  error: {
    bg: theme.colors.status.errorBg,
    text: theme.colors.status.error,
  },
  info: {
    bg: theme.colors.status.infoBg,
    text: theme.colors.status.info,
  },
};

export function Badge({
  label,
  variant = 'default',
  size = 'sm',
  style,
  textStyle,
}: BadgeProps) {
  const colors = variantStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        size === 'md' && styles.badgeMd,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'md' && styles.textMd,
          { color: colors.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  text: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold,
  },
  textMd: {
    fontSize: theme.typography.size.sm,
  },
});

export default Badge;
