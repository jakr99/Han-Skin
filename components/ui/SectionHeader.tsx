import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional action text (e.g., "See all") */
  actionText?: string;
  /** Action press handler */
  onAction?: () => void;
  /** Show chevron with action */
  showChevron?: boolean;
  /** Use uppercase styling */
  uppercase?: boolean;
  /** Custom container style */
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  actionText,
  onAction,
  showChevron = true,
  uppercase = false,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, uppercase && styles.uppercase]}>
        {title}
      </Text>

      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={styles.action}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          {showChevron && (
            <Ionicons
              name="chevron-forward"
              size={theme.components.icon.sm}
              color={theme.colors.text.secondary}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.tracking.tight,
  },
  uppercase: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.secondary,
  },
});

export default SectionHeader;
