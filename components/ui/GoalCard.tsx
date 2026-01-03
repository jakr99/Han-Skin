import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface GoalCardProps {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  tintColor?: string;
}

export function GoalCard({ label, icon, selected, onPress, tintColor = '#FFFFFF' }: GoalCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: tintColor }, selected && styles.cardSelected]}
    >
      {/* Checkmark - absolute positioned */}
      {selected && (
        <View style={styles.checkContainer}>
          <Ionicons name="checkmark" size={16} color="#7A9E9F" />
        </View>
      )}

      {/* Centered content */}
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E2DE',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#7A9E9F',
    borderWidth: 2,
    backgroundColor: 'rgba(122, 158, 159, 0.06)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  labelSelected: {
    color: '#5C7A7B',
    fontWeight: '600',
  },
  checkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(122, 158, 159, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GoalCard;
