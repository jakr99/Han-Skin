import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface ScoreRingProps {
  /** Score value (0-100) */
  score: number;
  /** Ring size */
  size?: number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Label text (defaults to score%) */
  label?: string;
  /** Animate on mount */
  animated?: boolean;
  /** Custom container style */
  style?: ViewStyle;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function getScoreColor(score: number): string {
  if (score >= 90) return theme.colors.score.excellent;
  if (score >= 70) return theme.colors.score.good;
  if (score >= 50) return theme.colors.score.moderate;
  if (score >= 30) return theme.colors.score.poor;
  return theme.colors.score.bad;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Fair';
  return 'Poor';
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  label,
  animated = true,
  style,
}: ScoreRingProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const clampedScore = Math.min(100, Math.max(0, score));
  const scoreColor = getScoreColor(clampedScore);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedScore,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(clampedScore);
    }
  }, [clampedScore, animated]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.border.default}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>
            {clampedScore}
          </Text>
          <Text style={styles.labelText}>
            {label || getScoreLabel(clampedScore)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.bold,
  },
  labelText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});

export default ScoreRing;
