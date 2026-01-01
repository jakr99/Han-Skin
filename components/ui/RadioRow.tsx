import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface RadioRowProps {
  icon?: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioRow({ icon, label, selected, onPress }: RadioRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.row,
        selected && styles.rowSelected,
      ]}
    >
      {icon && (
        <Text style={styles.icon}>{icon}</Text>
      )}
      {!icon && (
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
      )}
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
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#7A9E9F',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7A9E9F',
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

export default RadioRow;
