import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface BudgetSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function BudgetSlider({ value, onValueChange }: BudgetSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#A8C5C6"
          maximumTrackTintColor="#E5E2DE"
          thumbTintColor="#7A9E9F"
        />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, value === 0 && styles.labelActive]}>Low</Text>
        <Text style={[styles.label, value === 1 && styles.labelActive]}>No preference</Text>
        <Text style={[styles.label, value === 2 && styles.labelActive]}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  labelActive: {
    color: '#5C7A7B',
    fontWeight: '500',
  },
});

export default BudgetSlider;
