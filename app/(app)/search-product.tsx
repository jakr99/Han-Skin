import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { POPULAR_KBEAUTY_BRANDS } from '../../lib/openBeautyFacts';

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Sanitize search input to prevent PostgREST query injection
function sanitizeSearchQuery(input: string): string {
  // Remove PostgREST reserved characters that could be used for injection
  return input.replace(/[,.:()]/g, '');
}

interface SearchResult {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  category: string | null;
}

export default function SearchProductScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Search when debounced value changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      performSearch(debouncedSearch);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [debouncedSearch]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      // Sanitize query to prevent PostgREST injection
      const sanitized = sanitizeSearchQuery(query);

      // Search products in Supabase using ilike for case-insensitive partial match
      const { data, error } = await supabase
        .from('products')
        .select('id, barcode, name, brand, image_url, category')
        .or(`name.ilike.%${sanitized}%,brand.ilike.%${sanitized}%`)
        .limit(20);

      if (error) {
        console.error('Supabase search error:', error);
        setResults([]);
        return;
      }

      const searchResults: SearchResult[] = (data || []).map((p) => ({
        id: p.id,
        barcode: p.barcode || p.id,
        name: p.name || 'Unknown Product',
        brand: p.brand || 'Unknown Brand',
        imageUrl: p.image_url || null,
        category: p.category || null,
      }));

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: SearchResult) => {
    Keyboard.dismiss();
    // Navigate to product detail with Supabase product ID
    router.push(`/product/${product.id}`);
  };

  const handleQuickSearch = (brand: string) => {
    setSearchQuery(brand);
  };

  const renderProduct = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultImageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.resultImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.resultImagePlaceholder}>
            <Ionicons name="cube-outline" size={24} color="#9CA3AF" />
          </View>
        )}
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.resultName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.category && (
          <Text style={styles.resultCategory} numberOfLines={1}>
            {item.category}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Product</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product or brand name..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Search Tags */}
      {!hasSearched && (
        <View style={styles.quickSearchContainer}>
          <Text style={styles.quickSearchTitle}>Popular K-Beauty Brands</Text>
          <View style={styles.quickSearchTags}>
            {POPULAR_KBEAUTY_BRANDS.slice(0, 8).map((brand) => (
              <TouchableOpacity
                key={brand}
                style={styles.quickSearchTag}
                onPress={() => handleQuickSearch(brand)}
              >
                <Text style={styles.quickSearchTagText}>{brand}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.resultsList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search term or brand name
              </Text>
            </View>
          }
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultsCount}>
                {results.length} product{results.length !== 1 ? 's' : ''} found
              </Text>
            ) : null
          }
        />
      )}

      {/* Manual Entry Option */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => router.push('/(app)/manual-ingredients')}
        >
          <Ionicons name="create-outline" size={20} color="#6B7280" />
          <Text style={styles.manualButtonText}>
            Can't find it? Enter ingredients manually
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 44,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },

  // Quick Search
  quickSearchContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  quickSearchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  quickSearchTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickSearchTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  quickSearchTagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  // Results
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resultsCount: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.06)',
  },
  resultImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  resultBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
    lineHeight: 20,
  },
  resultCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FAFAF8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 24, 39, 0.06)',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 14,
  },
  manualButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
