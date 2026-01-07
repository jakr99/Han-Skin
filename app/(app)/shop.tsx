import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  base_safety_score: number | null;
  category: string;
  is_featured: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cleanser', label: 'Cleanser' },
  { id: 'toner', label: 'Toner' },
  { id: 'serum', label: 'Serum' },
  { id: 'essence', label: 'Essence' },
  { id: 'moisturizer', label: 'Moisturizer' },
  { id: 'sunscreen', label: 'Sunscreen' },
  { id: 'mask', label: 'Mask' },
  { id: 'eye_cream', label: 'Eye Care' },
];

const CATEGORY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  cleanser: { icon: 'water', bg: '#E0F2FE', color: '#0EA5E9' },
  toner: { icon: 'flask', bg: '#FCE7F3', color: '#EC4899' },
  serum: { icon: 'beaker', bg: '#FEF3C7', color: '#F59E0B' },
  essence: { icon: 'sparkles', bg: '#F3E8FF', color: '#A855F7' },
  moisturizer: { icon: 'color-fill', bg: '#DBEAFE', color: '#3B82F6' },
  sunscreen: { icon: 'sunny', bg: '#FEF9C3', color: '#EAB308' },
  mask: { icon: 'layers', bg: '#D1FAE5', color: '#10B981' },
  eye_cream: { icon: 'eye', bg: '#FEE2E2', color: '#EF4444' },
};

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  return 'Fair';
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#34D399';
  if (score >= 70) return '#FBBF24';
  return '#F97316';
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const categoryStyle = CATEGORY_ICONS[product.category] || { icon: 'cube', bg: '#F3F4F6', color: '#6B7280' };
  const score = product.base_safety_score || 0;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const hasSale = product.original_price && product.original_price > product.price;

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {/* Badge */}
      {product.is_featured && (
        <View style={[styles.badge, styles.badgeBestSeller]}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      )}
      {hasSale && !product.is_featured && (
        <View style={[styles.badge, styles.badgeSale]}>
          <Text style={[styles.badgeText, styles.badgeTextSale]}>Sale</Text>
        </View>
      )}

      {/* Product Image */}
      <View style={[styles.productImage, { backgroundColor: categoryStyle.bg }]}>
        <Ionicons name={categoryStyle.icon as any} size={36} color={categoryStyle.color} />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FBBF24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.review_count?.toLocaleString() || 0})</Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          {hasSale && (
            <Text style={styles.originalPrice}>${product.original_price}</Text>
          )}
        </View>

        {/* Ingredient Score */}
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { backgroundColor: `${scoreColor}15` }]}>
            <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {score} {scoreLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Ionicons name="heart-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, brand, name, price, original_price, rating, review_count, base_safety_score, category, is_featured')
        .order('review_count', { ascending: false });

      // Filter by category
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Shop</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Options */}
      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>
          {loading ? 'Loading...' : `${products.length} products`}
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Popularity</Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 120 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },

  // Categories
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryTabActive: {
    backgroundColor: '#111',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  // Sort
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },

  // Product Grid
  productGrid: {
    paddingHorizontal: 12,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    zIndex: 1,
  },
  badgeSale: {
    backgroundColor: '#FEE2E2',
  },
  badgeBestSeller: {
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  badgeTextSale: {
    color: '#DC2626',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
    lineHeight: 18,
    marginBottom: 8,
    height: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },
  reviewCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  originalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  scoreRow: {
    marginTop: 'auto',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '600',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
