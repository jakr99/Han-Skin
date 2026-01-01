import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CheckboxRow({ label, selected, onPress }: CheckboxRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.row,
        selected && styles.rowSelected,
      ]}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        )}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EDEA',
    marginBottom: 10,
  },
  rowSelected: {
    backgroundColor: '#F8FAFA',
    borderColor: '#D4E5E5',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#7A9E9F',
    borderColor: '#7A9E9F',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  labelSelected: {
    color: '#3D3D3D',
  },
});

export default CheckboxRow;
