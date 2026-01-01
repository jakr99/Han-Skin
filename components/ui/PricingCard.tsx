import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface PricingCardProps {
  planName: string;
  price: string;
  period: string;
  subtitle?: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
}

export function PricingCard({
  planName,
  price,
  period,
  subtitle,
  badge,
  selected,
  onPress,
}: PricingCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        selected && styles.cardSelected,
      ]}
    >
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.leftSection}>
        <Text style={[styles.planName, selected && styles.planNameSelected]}>
          {planName}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.price, selected && styles.priceSelected]}>
          {price}
        </Text>
        <Text style={styles.period}>{period}</Text>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0EDEA',
    marginBottom: 12,
    position: 'relative',
  },
  cardSelected: {
    backgroundColor: '#F8FAFA',
    borderColor: '#7A9E9F',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#E8A87C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  leftSection: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D3D3D',
  },
  planNameSelected: {
    color: '#5C7A7B',
  },
  subtitle: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D3D3D',
  },
  priceSelected: {
    color: '#5C7A7B',
  },
  period: {
    fontSize: 12,
    color: '#7A7A7A',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#7A9E9F',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7A9E9F',
  },
});

export default PricingCard;
