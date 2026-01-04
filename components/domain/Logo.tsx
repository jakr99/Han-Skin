import React from 'react';
import { View, Image } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: 100,
  md: 160,
  lg: 220,
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimension = sizes[size];

  return (
    <View className="items-center">
      <Image
        source={require('../../assets/images/han-logo.png')}
        style={{ width: dimension, height: dimension }}
        resizeMode="contain"
      />
    </View>
  );
}

export default Logo;
