import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { useUserProfile } from '../../../context/UserProfileContext';
import { parseInciList } from '../../../lib/scoring/engine';
import { getProductByBarcode } from '../../../lib/openBeautyFacts';

interface Product {
  id: string;
  brand: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number;
  review_count: number | null;
  base_safety_score: number;
  raw_inci_text: string | null;
  buy_url: string | null;
  store: string | null;
  is_featured: boolean;
}

interface SkinMatchResult {
  score: number;
  label: string;
  color: string;
  reasons: {
    positive: string[];
    negative: string[];
  };
}

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useUserProfile();

  const [product, setProduct] = useState<Product | null>(null);
  const [skinMatch, setSkinMatch] = useState<SkinMatchResult | null>(null);
  const [parsedIngredients, setParsedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Calculate skin match based on base_safety_score and user profile
  const calculateMatch = (productData: Product): SkinMatchResult => {
    let score = productData.base_safety_score || 50;
    const positive: string[] = [];
    const negative: string[] = [];

    // Start with base safety score contribution
    if (score >= 80) {
      positive.push('High ingredient safety rating');
    } else if (score >= 60) {
      positive.push('Good ingredient safety profile');
    } else if (score < 50) {
      negative.push('Contains some potentially irritating ingredients');
    }

    // Adjust based on user's skin type and category match
    if (profile?.skin_type) {
      const categoryBoosts: Record<string, string[]> = {
        dry: ['moisturizer', 'essence', 'serum'],
        oily: ['cleanser', 'toner', 'serum'],
        combination: ['toner', 'serum', 'moisturizer'],
        sensitive: ['moisturizer', 'essence', 'serum'],
        normal: ['serum', 'moisturizer', 'sunscreen'],
      };

      const boostedCategories = categoryBoosts[profile.skin_type] || [];
      if (boostedCategories.includes(productData.category)) {
        score += 10;
        positive.push(`Great for ${profile.skin_type} skin`);
      }
    }

    // Sunscreen always gets a boost for skin health
    if (productData.category === 'sunscreen') {
      score += 5;
      positive.push('Essential for skin protection');
    }

    // Clamp score
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Determine label and color
    let label: string;
    let color: string;
    if (score >= 85) {
      label = 'Excellent Match';
      color = '#10B981';
    } else if (score >= 70) {
      label = 'Great Match';
      color = '#34D399';
    } else if (score >= 55) {
      label = 'Good Match';
      color = '#FBBF24';
    } else if (score >= 40) {
      label = 'Fair Match';
      color = '#F97316';
    } else {
      label = 'Poor Match';
      color = '#EF4444';
    }

    return { score, label, color, reasons: { positive, negative } };
  };

  const fetchProduct = async () => {
    if (!id) return;

    try {
      // Check if this is an Open Beauty Facts product (prefixed with obf_)
      if (id.startsWith('obf_')) {
        const barcode = id.replace('obf_', '');
        const obfResult = await getProductByBarcode(barcode);

        if (obfResult.product) {
          const obfProduct = obfResult.product;
          const productData: Product = {
            id: id,
            brand: obfProduct.brands || 'Unknown Brand',
            name: obfProduct.product_name || 'Unknown Product',
            description: obfProduct.categories || null,
            category: 'serum', // Default category
            price: 0,
            original_price: null,
            image_url: obfProduct.image_front_url || obfProduct.image_url || null,
            rating: 4.5,
            review_count: null,
            base_safety_score: 75,
            raw_inci_text: obfProduct.ingredients_text_en || obfProduct.ingredients_text || null,
            buy_url: null,
            store: obfProduct.stores || null,
            is_featured: false,
          };

          setProduct(productData);

          if (productData.raw_inci_text) {
            const parsed = parseInciList(productData.raw_inci_text);
            setParsedIngredients(parsed.map(i => i.raw_name));
          }

          const match = calculateMatch(productData);
          setSkinMatch(match);
        }
      } else {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const productData: Product = {
            id: data.id,
            brand: data.brand,
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            original_price: data.original_price,
            image_url: data.image_url,
            rating: data.rating,
            review_count: data.review_count,
            base_safety_score: data.base_safety_score ?? 50,
            raw_inci_text: data.raw_inci_text,
            buy_url: data.buy_url,
            store: data.store,
            is_featured: data.is_featured,
          };

          setProduct(productData);

          if (data.raw_inci_text) {
            const parsed = parseInciList(data.raw_inci_text);
            setParsedIngredients(parsed.map(i => i.raw_name));
          }

          const match = calculateMatch(productData);
          setSkinMatch(match);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#34D399';
    if (score >= 70) return '#FBBF24';
    return '#F97316';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      cleanser: 'water',
      toner: 'flask',
      serum: 'beaker',
      moisturizer: 'color-fill',
      sunscreen: 'sunny',
      mask: 'layers',
      'eye-care': 'eye',
      treatment: 'medkit',
    };
    return icons[category] || 'cube';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsSaved(!isSaved)}
          style={styles.headerButton}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={24}
            color={isSaved ? "#EF4444" : "#111"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name={getCategoryIcon(product.category) as any}
                size={64}
                color="#9CA3AF"
              />
            </View>
          )}
          {product.is_featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FBBF24" />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.review_count?.toLocaleString()} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.original_price && (
              <Text style={styles.originalPrice}>${product.original_price}</Text>
            )}
            {product.store && (
              <View style={styles.storeBadge}>
                <Text style={styles.storeText}>{product.store}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}
        </View>

        {/* Skin Match Section */}
        {skinMatch && (
          <View style={styles.matchSection}>
            <Text style={styles.sectionTitle}>Skin Match Analysis</Text>

            <View style={styles.matchCard}>
              {/* Score Circle */}
              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: skinMatch.color }]}>
                  <Text style={[styles.scoreNumber, { color: skinMatch.color }]}>
                    {skinMatch.score}
                  </Text>
                </View>
                <Text style={[styles.scoreLabel, { color: skinMatch.color }]}>
                  {skinMatch.label}
                </Text>
              </View>

              {/* Match Reasons */}
              <View style={styles.reasonsContainer}>
                {skinMatch.reasons.positive.map((reason, index) => (
                  <View key={`pos-${index}`} style={styles.reasonRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
                {skinMatch.reasons.negative.map((reason, index) => (
                  <View key={`neg-${index}`} style={styles.reasonRow}>
                    <Ionicons name="alert-circle" size={18} color="#F97316" />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Ingredient Score */}
        <View style={styles.ingredientSection}>
          <Text style={styles.sectionTitle}>Ingredient Safety</Text>

          <View style={styles.ingredientScoreCard}>
            <View style={styles.ingredientScoreRow}>
              <Text style={styles.ingredientScoreLabel}>Overall Score</Text>
              <View style={[
                styles.ingredientScoreBadge,
                { backgroundColor: `${getScoreColor(product.base_safety_score)}15` }
              ]}>
                <View style={[
                  styles.ingredientScoreDot,
                  { backgroundColor: getScoreColor(product.base_safety_score) }
                ]} />
                <Text style={[
                  styles.ingredientScoreValue,
                  { color: getScoreColor(product.base_safety_score) }
                ]}>
                  {product.base_safety_score}/100
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ingredients List */}
        {parsedIngredients.length > 0 && (
          <View style={styles.ingredientSection}>
            <Text style={styles.sectionTitle}>Ingredients ({parsedIngredients.length})</Text>
            <View style={styles.ingredientListCard}>
              <Text style={styles.ingredientListText}>
                {parsedIngredients.slice(0, 10).join(', ')}
                {parsedIngredients.length > 10 && (
                  <Text style={styles.ingredientMoreText}>
                    {` +${parsedIngredients.length - 10} more`}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Buy Button */}
      <View style={[styles.buyButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            // In production, open buy_url or add to cart
            console.log('Buy product:', product.id);
          }}
        >
          <Text style={styles.buyButtonText}>
            Buy Now - ${product.price}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  infoSection: {
    padding: 20,
  },
  brand: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    lineHeight: 28,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  reviewCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  storeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  storeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  matchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  matchCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  reasonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reasonText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  ingredientSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ingredientScoreCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  ingredientScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientScoreLabel: {
    fontSize: 14,
    color: '#374151',
  },
  ingredientScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  ingredientScoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ingredientScoreValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ingredientTagText: {
    fontSize: 13,
    color: '#374151',
  },
  ingredientListCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  ingredientListText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  ingredientMoreText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  avoidTag: {
    backgroundColor: '#FEF2F2',
  },
  avoidTagText: {
    color: '#DC2626',
  },
  skinTypeTag: {
    backgroundColor: '#ECFDF5',
  },
  skinTypeText: {
    color: '#059669',
  },
  buyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  buyButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
