import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface BudgetSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function BudgetSlider({ value, onValueChange }: BudgetSliderProps) {
  // Determine which tier based on value (0-100)
  const getTierInfo = () => {
    if (value < 33) {
      return { label: 'Affordable', price: '$0-30' };
    } else if (value < 66) {
      return { label: 'Balanced', price: '$30-70' };
    } else {
      return { label: 'Premium', price: '$70+' };
    }
  };

  const tierInfo = getTierInfo();

  return (
    <View style={styles.container}>
      {/* Current Selection */}
      <View style={styles.selectionRow}>
        <Text style={styles.tierLabel}>{tierInfo.label}</Text>
        <Text style={styles.priceLabel}>{tierInfo.price}</Text>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#7A9E9F"
          maximumTrackTintColor="#E5E2DE"
          thumbTintColor="#5C7A7B"
        />
      </View>

      {/* Labels */}
      <View style={styles.labels}>
        <Text style={[styles.label, value < 33 && styles.labelActive]}>Affordable</Text>
        <Text style={[styles.label, value >= 33 && value < 66 && styles.labelActive]}>Balanced</Text>
        <Text style={[styles.label, value >= 66 && styles.labelActive]}>Premium</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
    padding: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  priceLabel: {
    fontSize: 13,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -2,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  labelActive: {
    color: '#5C7A7B',
    fontWeight: '600',
  },
});

export default BudgetSlider;
