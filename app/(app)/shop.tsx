import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type FilterCategory = 'brightening' | 'barrier' | 'trending';

const EDITORS_PICKS = [
  {
    id: '1',
    brand: 'COSRX',
    name: 'The Vitamin C 13 Serum',
    price: 17,
    rating: 4.5,
    description: 'Brightens & evens skin tone',
    badge: 'Best Seller',
    badgeColor: '#FEF3E2',
    badgeTextColor: '#D4A574',
    store: 'Soko Glam',
    storeColor: '#E8A4A4',
    icon: 'flask',
    iconColor: '#E8A86D',
  },
  {
    id: '2',
    brand: 'Beauty of Joseon',
    name: 'Glow Serum: Propolis + Niacinamide',
    price: 17,
    rating: 4.5,
    description: 'Calms, brightens & refines pores',
    badge: 'Limited Stock',
    badgeColor: '#E8E8E8',
    badgeTextColor: '#6B7280',
    store: 'StyleKorean',
    storeColor: '#7A9E9F',
    icon: 'leaf',
    iconColor: '#7A9E9F',
  },
  {
    id: '3',
    brand: 'iUNIK',
    name: 'Tea Tree Relief Toner',
    price: 17,
    rating: 4.5,
    description: 'Soothes & controls breakouts',
    badge: 'On Sale',
    badgeColor: '#E8F5E9',
    badgeTextColor: '#4CAF50',
    store: 'Olive Young',
    storeColor: '#8BC34A',
    icon: 'water',
    iconColor: '#64B5F6',
  },
];

const DAILY_ESSENTIALS = [
  {
    id: '1',
    brand: 'Beauty of Joseon',
    name: 'Radiance Cleansing Balm',
    price: 19,
    rating: 4.5,
    icon: 'sparkles',
    iconColor: '#E8C547',
  },
  {
    id: '2',
    brand: 'COSRX',
    name: 'Advanced Snail Mucin',
    price: 25,
    rating: 4.8,
    icon: 'water-outline',
    iconColor: '#7A9E9F',
  },
  {
    id: '3',
    brand: 'Anua',
    name: 'Heartleaf 77% Toner',
    price: 20,
    rating: 4.7,
    icon: 'leaf',
    iconColor: '#81C784',
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterCategory | null>(null);

  const filters: { key: FilterCategory; label: string }[] = [
    { key: 'brightening', label: 'For Brightening' },
    { key: 'barrier', label: 'Barrier Repair' },
    { key: 'trending', label: 'Trending' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Top Korean Skincare Picks</Text>
          <Text style={styles.heroSubtitle}>
            Personalized recommendations for your skin concerns.
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterPill,
                activeFilter === filter.key && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter(
                activeFilter === filter.key ? null : filter.key
              )}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Editor's Picks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Editor's Picks for You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {EDITORS_PICKS.map((product) => (
              <View key={product.id} style={styles.productCard}>
                {product.badge && (
                  <View style={[styles.badge, { backgroundColor: product.badgeColor }]}>
                    <Text style={[styles.badgeText, { color: product.badgeTextColor }]}>
                      {product.badge}
                    </Text>
                  </View>
                )}
                <View style={styles.productImageContainer}>
                  <Ionicons
                    name={product.icon as any}
                    size={40}
                    color={product.iconColor}
                  />
                </View>
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingRow}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(product.rating) ? 'star' : 'star-outline'}
                      size={12}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={styles.productPrice}>${product.price}.00</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <TouchableOpacity
                  style={[styles.buyButton, { backgroundColor: product.storeColor }]}
                >
                  <Text style={styles.buyButtonText}>Buy on</Text>
                  <Text style={styles.buyButtonStore}>{product.store}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Daily Routine Essentials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Routine Essentials</Text>
            <TouchableOpacity>
              <Text style={styles.browseAllText}>Browse all {'>'}</Text>
            </TouchableOpacity>
          </View>

          {DAILY_ESSENTIALS.map((product) => (
            <TouchableOpacity key={product.id} style={styles.essentialItem}>
              <View style={styles.essentialImage}>
                <Ionicons
                  name={product.icon as any}
                  size={28}
                  color={product.iconColor}
                />
              </View>
              <View style={styles.essentialInfo}>
                <Text style={styles.essentialBrand}>{product.brand}</Text>
                <Text style={styles.essentialName}>{product.name}</Text>
                <View style={styles.essentialRating}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(product.rating) ? 'star' : 'star-outline'}
                      size={10}
                      color="#F59E0B"
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.essentialPrice}>${product.price}.00</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  browseAllText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  productsScroll: {
    gap: 12,
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  productImageContainer: {
    width: '100%',
    height: 90,
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 16,
    height: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 14,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyButtonText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  buyButtonStore: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  essentialImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  essentialInfo: {
    flex: 1,
  },
  essentialBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  essentialName: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  essentialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  essentialPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
});
