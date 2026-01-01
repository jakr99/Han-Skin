import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Option {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  label: string;
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SegmentedControl({ label, options, selectedId, onSelect }: SegmentedControlProps) {
  const selectedLabel = options.find(o => o.id === selectedId)?.label || '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{selectedLabel} {'>'}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.7}
            style={[
              styles.option,
              selectedId === option.id && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedId === option.id && styles.optionTextSelected,
              ]}
              numberOfLines={1}
            >
              {selectedId === option.id ? `✓ ${option.label}` : option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  value: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  optionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0EDEA',
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#F5FAF9',
  },
  optionText: {
    fontSize: 12,
    color: '#7A7A7A',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#5C7A7B',
    fontWeight: '500',
  },
});

export default SegmentedControl;
