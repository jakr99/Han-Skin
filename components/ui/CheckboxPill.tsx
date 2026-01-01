import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CheckboxPill({ label, selected, onPress }: CheckboxPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        selected && styles.pillSelected,
      ]}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && (
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        )}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EDEA',
  },
  pillSelected: {
    backgroundColor: '#F5FAF9',
    borderColor: '#C5DADA',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#7A9E9F',
    borderColor: '#7A9E9F',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  labelSelected: {
    color: '#5C7A7B',
  },
});

export default CheckboxPill;
