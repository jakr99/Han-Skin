import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface HeaderProps {
  /** Title displayed in the center */
  title?: string;
  /** Show back button (defaults to true if onBack provided or can go back) */
  showBack?: boolean;
  /** Custom back handler (defaults to router.back) */
  onBack?: () => void;
  /** Right side action element */
  rightAction?: React.ReactNode;
  /** Left side action element (replaces back button) */
  leftAction?: React.ReactNode;
  /** Whether header has a border bottom */
  bordered?: boolean;
  /** Background color variant */
  variant?: 'default' | 'transparent';
  /** Custom container style */
  style?: ViewStyle;
  /** Custom title style */
  titleStyle?: TextStyle;
}

export function Header({
  title,
  showBack = true,
  onBack,
  rightAction,
  leftAction,
  bordered = false,
  variant = 'default',
  style,
  titleStyle,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        variant === 'transparent' && styles.transparent,
        bordered && styles.bordered,
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Left side */}
        <View style={styles.leftContainer}>
          {leftAction ? (
            leftAction
          ) : showBack ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={theme.components.icon.lg}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Center - Title */}
        <View style={styles.centerContainer}>
          {title && (
            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* Right side */}
        <View style={styles.rightContainer}>
          {rightAction || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  content: {
    height: theme.components.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.interactive.hover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.tracking.tight,
  },
});

export default Header;
