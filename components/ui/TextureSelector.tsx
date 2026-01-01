import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TextureOption {
  id: string;
  label: string;
  icon: string;
}

interface TextureSelectorProps {
  options: TextureOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TextureSelector({ options, selectedId, onSelect }: TextureSelectorProps) {
  return (
    <View style={styles.container}>
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
          <Text style={styles.icon}>{option.icon}</Text>
          <Text style={[
            styles.label,
            selectedId === option.id && styles.labelSelected,
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EDEA',
  },
  optionSelected: {
    backgroundColor: '#F5FAF9',
    borderColor: '#A8C5C6',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#7A7A7A',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#5C7A7B',
    fontWeight: '500',
  },
});

export default TextureSelector;
