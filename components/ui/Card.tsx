import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Pressable,
  Animated,
} from 'react-native';
import { theme, ThemeShadow } from '../../constants/theme';

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Shadow elevation level */
  elevation?: ThemeShadow;
  /** Border radius size */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Show border */
  bordered?: boolean;
  /** Make card pressable */
  onPress?: () => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Disable press animation */
  noAnimation?: boolean;
}

export function Card({
  children,
  elevation = 'none',
  radius = 'lg',
  padding = 'md',
  bordered = true,
  onPress,
  style,
  noAnimation = false,
}: CardProps) {
  const paddingValue = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.lg,
    lg: theme.spacing.xl,
  }[padding];

  const cardStyle: ViewStyle[] = [
    styles.card,
    { borderRadius: theme.radius[radius] },
    { padding: paddingValue },
    bordered && styles.bordered,
    theme.shadows[elevation],
    style,
  ];

  if (onPress) {
    if (noAnimation) {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={cardStyle}
        >
          {children}
        </TouchableOpacity>
      );
    }

    return (
      <AnimatedCard onPress={onPress} style={cardStyle}>
        {children}
      </AnimatedCard>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// Animated pressable card with scale effect
function AnimatedCard({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style: ViewStyle[];
}) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Card Header subcomponent
interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Card.Header = function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
};

// Card Body subcomponent
interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Card.Body = function CardBody({ children, style }: CardBodyProps) {
  return <View style={[styles.body, style]}>{children}</View>;
};

// Card Footer subcomponent
interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Card.Footer = function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  body: {
    // Default body styles
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
});

export default Card;
