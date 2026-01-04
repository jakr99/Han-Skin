import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function ManualIngredientsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    barcode: string;
    productName: string;
    productBrand: string;
  }>();

  const [ingredientsText, setIngredientsText] = useState('');

  // Example ingredients for reference
  const exampleText = `Water, Glycerin, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin`;

  const handleAnalyze = () => {
    const trimmed = ingredientsText.trim();
    if (trimmed.length < 10) {
      Alert.alert(
        'Ingredients Too Short',
        'Please paste the complete ingredients list from the product.'
      );
      return;
    }

    // Navigate to result screen with manual ingredients
    router.push({
      pathname: '/(app)/scan-result',
      params: {
        barcode: params.barcode || 'manual-entry',
        found: 'true',
        product: JSON.stringify({
          name: params.productName || 'Manual Entry',
          brand: params.productBrand || 'Unknown Brand',
          imageUrl: null,
          barcode: params.barcode || 'manual-entry',
        }),
        ingredientsText: trimmed,
      },
    } as any);
  };

  const handlePasteExample = () => {
    setIngredientsText(exampleText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Ingredients</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product Info */}
        {params.productName && (
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{params.productName}</Text>
            {params.productBrand && (
              <Text style={styles.productBrand}>{params.productBrand}</Text>
            )}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color="#7A9E9F" />
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>How to find ingredients</Text>
            <Text style={styles.instructionsText}>
              1. Look at the product packaging or box{'\n'}
              2. Find the "Ingredients" or "INCI" list{'\n'}
              3. Copy and paste the entire list below
            </Text>
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Paste Ingredients List</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Paste ingredients here...

Example:
Water, Glycerin, Niacinamide, Hyaluronic Acid..."
            placeholderTextColor="#9CA3AF"
            value={ingredientsText}
            onChangeText={setIngredientsText}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>
              {ingredientsText.length} characters
            </Text>
            <TouchableOpacity onPress={handlePasteExample}>
              <Text style={styles.exampleLink}>Use example</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.tipText}>
              Include the complete list, not just some ingredients
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.tipText}>
              Commas between ingredients work best
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.tipText}>
              You can copy from the brand's website too
            </Text>
          </View>
        </View>

        {/* OCR Stub */}
        <TouchableOpacity style={styles.ocrButton} disabled>
          <Ionicons name="camera-outline" size={20} color="#9CA3AF" />
          <Text style={styles.ocrButtonText}>
            Scan ingredient label with camera (coming soon)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Analyze Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            ingredientsText.length < 10 && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={ingredientsText.length < 10}
        >
          <LinearGradient
            colors={
              ingredientsText.length >= 10
                ? ['#A8C5C6', '#7A9E9F']
                : ['#D1D5DB', '#9CA3AF']
            }
            style={styles.analyzeButtonGradient}
          >
            <Ionicons name="flask" size={20} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>Analyze Ingredients</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },

  // Product Info
  productInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Instructions
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 20,
  },

  // Input
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DE',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 180,
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  exampleLink: {
    fontSize: 12,
    color: '#7A9E9F',
    fontWeight: '500',
  },

  // Tips
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },

  // OCR Stub
  ocrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    opacity: 0.7,
  },
  ocrButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  analyzeButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
