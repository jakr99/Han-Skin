import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E8E4DF',
};

export default function SkinHistoryScreen() {
  return (
    <ProfileSubScreen title="Skin History">
      <View style={styles.card}>
        <Text style={styles.placeholder}>
          Skin history coming soon...
        </Text>
        <Text style={styles.hint}>
          Track your skin's progress over time with photos and notes.
        </Text>
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
});
