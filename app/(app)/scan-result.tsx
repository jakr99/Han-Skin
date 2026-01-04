import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeProduct } from '@/services/barcodeService';
import { useUserProfile, MOCK_USER_PROFILE } from '@/context/UserProfileContext';
import type { ScannedProduct, ProductScore, IngredientAnalysis } from '@/types/scanner';

// -----------------------------------------------------------------------------
// Score Colors
// -----------------------------------------------------------------------------
const SCORE_COLORS = {
  Great: { primary: '#10B981', secondary: '#D1FAE5', text: '#065F46' },
  Okay: { primary: '#F59E0B', secondary: '#FEF3C7', text: '#92400E' },
  Bad: { primary: '#EF4444', secondary: '#FEE2E2', text: '#991B1B' },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    barcode: string;
    found: string;
    product: string;
    ingredientsText: string;
  }>();

  // Try to use context, fall back to mock for development
  let userProfile = MOCK_USER_PROFILE;
  try {
    const context = useUserProfile();
    userProfile = context.profile;
  } catch {
    // Context not available, use mock
  }

  // Parse params
  const barcode = params.barcode || '';
  const found = params.found === 'true';
  const product: ScannedProduct | null = params.product
    ? JSON.parse(params.product)
    : null;
  const ingredientsText = params.ingredientsText || '';

  // State
  const [score, setScore] = useState<ProductScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullIngredients, setShowFullIngredients] = useState(false);

  // Analyze product on mount
  useEffect(() => {
    const analyze = async () => {
      if (ingredientsText) {
        try {
          const result = await analyzeProduct(
            barcode,
            ingredientsText,
            userProfile,
            product
          );
          setScore(result.score);
        } catch (error) {
          console.error('Error analyzing product:', error);
        }
      }
      setLoading(false);
    };

    analyze();
  }, [barcode, ingredientsText, userProfile, product]);

  // Get score styling
  const scoreStyle = useMemo(() => {
    if (!score) return SCORE_COLORS.Okay;
    return SCORE_COLORS[score.label];
  }, [score]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7A9E9F" />
          <Text style={styles.loadingText}>Analyzing ingredients...</Text>
        </View>
      </View>
    );
  }

  // Not found or no ingredients - show fallback
  if (!found || !ingredientsText) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Not Found</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIcon}>
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.notFoundTitle}>
            {!found
              ? "We couldn't find this product"
              : "We couldn't find ingredients for this product"}
          </Text>
          <Text style={styles.notFoundSubtitle}>
            {product?.name && `Looking for: ${product.name}`}
          </Text>
          <Text style={styles.notFoundBarcode}>Barcode: {barcode}</Text>

          <View style={styles.fallbackOptions}>
            <TouchableOpacity
              style={styles.fallbackButton}
              onPress={() =>
                router.push({
                  pathname: '/(app)/manual-ingredients',
                  params: {
                    barcode,
                    productName: product?.name || '',
                    productBrand: product?.brand || '',
                  },
                } as any)
              }
            >
              <Ionicons name="clipboard-outline" size={24} color="#7A9E9F" />
              <View style={styles.fallbackButtonContent}>
                <Text style={styles.fallbackButtonTitle}>Paste Ingredients</Text>
                <Text style={styles.fallbackButtonSubtitle}>
                  Copy from product or website
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fallbackButton, styles.fallbackButtonDisabled]}>
              <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
              <View style={styles.fallbackButtonContent}>
                <Text style={[styles.fallbackButtonTitle, { color: '#9CA3AF' }]}>
                  Scan Ingredient Label
                </Text>
                <Text style={styles.fallbackButtonSubtitle}>Coming soon</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.scanAgainButton} onPress={() => router.back()}>
            <Text style={styles.scanAgainText}>Scan Another Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main result view
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Info */}
        <View style={styles.productCard}>
          {product?.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="cube-outline" size={40} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product?.name || 'Unknown Product'}
            </Text>
            <Text style={styles.productBrand}>{product?.brand || 'Unknown Brand'}</Text>
          </View>
        </View>

        {/* Score Display */}
        {score && (
          <View style={[styles.scoreCard, { backgroundColor: scoreStyle.secondary }]}>
            <View style={styles.scoreMain}>
              <Text style={[styles.scoreNumber, { color: scoreStyle.primary }]}>
                {score.score.toFixed(1)}
              </Text>
              <Text style={styles.scoreOutOf}>/10</Text>
            </View>
            <View
              style={[styles.scoreLabelBadge, { backgroundColor: scoreStyle.primary }]}
            >
              <Text style={styles.scoreLabelText}>{score.label}</Text>
            </View>
            <Text style={[styles.scoreSubtext, { color: scoreStyle.text }]}>
              Based on your skin profile
            </Text>
          </View>
        )}

        {/* Reasons */}
        {score && score.reasons.length > 0 && (
          <View style={styles.reasonsCard}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            {score.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <View
                  style={[
                    styles.reasonIcon,
                    {
                      backgroundColor:
                        reason.type === 'positive' ? '#D1FAE5' : '#FEF3C7',
                    },
                  ]}
                >
                  <Ionicons
                    name={reason.type === 'positive' ? 'checkmark' : 'alert'}
                    size={16}
                    color={reason.type === 'positive' ? '#10B981' : '#F59E0B'}
                  />
                </View>
                <Text style={styles.reasonText}>{reason.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Good Ingredients */}
        {score && score.ingredientAnalysis.good.length > 0 && (
          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="heart" size={16} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Good for You</Text>
              <Text style={styles.sectionCount}>
                {score.ingredientAnalysis.good.length}
              </Text>
            </View>
            <View style={styles.ingredientsList}>
              {score.ingredientAnalysis.good.slice(0, 5).map((ing, index) => (
                <IngredientPill key={index} ingredient={ing} type="good" />
              ))}
              {score.ingredientAnalysis.good.length > 5 && (
                <View style={styles.morePill}>
                  <Text style={styles.morePillText}>
                    +{score.ingredientAnalysis.good.length - 5} more
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Caution Ingredients */}
        {score && score.ingredientAnalysis.caution.length > 0 && (
          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="warning" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Potential Issues</Text>
              <Text style={styles.sectionCount}>
                {score.ingredientAnalysis.caution.length}
              </Text>
            </View>
            <View style={styles.ingredientsList}>
              {score.ingredientAnalysis.caution.map((ing, index) => (
                <IngredientPill key={index} ingredient={ing} type="caution" />
              ))}
            </View>
          </View>
        )}

        {/* Full Ingredients List */}
        <TouchableOpacity
          style={styles.fullIngredientsToggle}
          onPress={() => setShowFullIngredients(!showFullIngredients)}
        >
          <Text style={styles.fullIngredientsTitle}>Full Ingredients List</Text>
          <Ionicons
            name={showFullIngredients ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {showFullIngredients && (
          <View style={styles.fullIngredientsList}>
            <Text style={styles.fullIngredientsText}>{ingredientsText}</Text>
          </View>
        )}

        {/* Scan Again Button */}
        <TouchableOpacity style={styles.scanAgainButtonPrimary} onPress={() => router.back()}>
          <LinearGradient
            colors={['#A8C5C6', '#7A9E9F']}
            style={styles.scanAgainGradient}
          >
            <Ionicons name="barcode-outline" size={20} color="#FFFFFF" />
            <Text style={styles.scanAgainButtonText}>Scan Another Product</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

// -----------------------------------------------------------------------------
// Ingredient Pill Component
// -----------------------------------------------------------------------------
function IngredientPill({
  ingredient,
  type,
}: {
  ingredient: IngredientAnalysis;
  type: 'good' | 'caution';
}) {
  const bgColor = type === 'good' ? '#ECFDF5' : '#FFFBEB';
  const textColor = type === 'good' ? '#065F46' : '#92400E';

  return (
    <View style={[styles.ingredientPill, { backgroundColor: bgColor }]}>
      <Text style={[styles.ingredientPillText, { color: textColor }]}>
        {ingredient.name}
      </Text>
    </View>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Product Card
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Score Card
  scoreCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '700',
  },
  scoreOutOf: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  scoreLabelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  scoreLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreSubtext: {
    fontSize: 14,
    marginTop: 8,
  },

  // Reasons Card
  reasonsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  reasonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },

  // Ingredients Sections
  ingredientsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  morePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  morePillText: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Full Ingredients
  fullIngredientsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  fullIngredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  fullIngredientsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  fullIngredientsText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Not Found State
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  notFoundIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  notFoundBarcode: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    marginBottom: 32,
  },
  fallbackOptions: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  fallbackButtonDisabled: {
    opacity: 0.6,
  },
  fallbackButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  fallbackButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  fallbackButtonSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  scanAgainButton: {
    paddingVertical: 12,
  },
  scanAgainText: {
    fontSize: 16,
    color: '#7A9E9F',
    fontWeight: '600',
  },

  // Scan Again Primary
  scanAgainButtonPrimary: {
    marginTop: 8,
    marginBottom: 16,
  },
  scanAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  scanAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
