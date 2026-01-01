import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GoalPillProps {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  tintColor?: string;
}

export function GoalPill({ label, icon, selected, onPress, tintColor = '#FFFFFF' }: GoalPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        { backgroundColor: tintColor },
        selected && styles.pillSelected,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F0EDEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pillSelected: {
    borderColor: '#A8C5C6',
    shadowColor: '#7A9E9F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  labelSelected: {
    color: '#5C7A7B',
    fontWeight: '600',
  },
});

export default GoalPill;
