import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { icon: 48, han: 16, skin: 14 },
  md: { icon: 80, han: 24, skin: 20 },
  lg: { icon: 120, han: 32, skin: 28 },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = sizes[size];

  return (
    <View className="items-center">
      {/* Logo Icon */}
      <LogoIcon size={dimensions.icon} />

      {/* Text */}
      {showText && (
        <View className="items-center mt-2">
          <Text
            style={{
              fontSize: dimensions.han,
              fontWeight: '600',
              letterSpacing: 4,
              color: '#7A9E9F',
            }}
          >
            HAN
          </Text>
          <Text
            style={{
              fontSize: dimensions.skin,
              fontStyle: 'italic',
              color: '#7A9E9F',
              marginTop: -4,
            }}
          >
            Skin
          </Text>
        </View>
      )}
    </View>
  );
}

interface LogoIconProps {
  size: number;
}

function LogoIcon({ size }: LogoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        {/* Gradient for waves */}
        <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#A8C5C6" stopOpacity={0.8} />
          <Stop offset="100%" stopColor="#7A9E9F" stopOpacity={1} />
        </LinearGradient>

        {/* Gradient for drop */}
        <LinearGradient id="dropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F5D0B5" stopOpacity={1} />
          <Stop offset="100%" stopColor="#E8A87C" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {/* Outer circle */}
      <Circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#E5E2DE"
        strokeWidth="1.5"
      />

      {/* Waves at bottom */}
      <G>
        {/* Wave 1 - back */}
        <Path
          d="M10 65 Q25 58, 40 65 T70 65 T100 65 L100 100 L0 100 Z"
          fill="url(#waveGradient)"
          opacity={0.5}
        />
        {/* Wave 2 - middle */}
        <Path
          d="M0 72 Q20 65, 40 72 T80 72 T100 72 L100 100 L0 100 Z"
          fill="url(#waveGradient)"
          opacity={0.7}
        />
        {/* Wave 3 - front */}
        <Path
          d="M0 78 Q15 72, 35 78 T70 78 T100 78 L100 100 L0 100 Z"
          fill="url(#waveGradient)"
          opacity={0.9}
        />
      </G>

      {/* Clip waves to circle */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#FBF9F7"
        strokeWidth="10"
      />

      {/* Water drop */}
      <Path
        d="M50 20
           C50 20, 38 35, 38 45
           C38 52, 43 58, 50 58
           C57 58, 62 52, 62 45
           C62 35, 50 20, 50 20 Z"
        fill="url(#dropGradient)"
      />

      {/* Sparkle */}
      <G transform="translate(58, 28)">
        {/* Vertical line */}
        <Path
          d="M0 -6 L0 6"
          stroke="#E8C87C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Horizontal line */}
        <Path
          d="M-6 0 L6 0"
          stroke="#E8C87C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Diagonal lines */}
        <Path
          d="M-4 -4 L4 4"
          stroke="#E8C87C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M4 -4 L-4 4"
          stroke="#E8C87C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export default Logo;
