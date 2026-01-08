// =============================================================================
// Barcode Service - Han Skin Open Beauty Facts Integration
// =============================================================================

import type {
  OpenBeautyFactsProduct,
  BarcodeScanResponse,
  ScannedProduct,
  UserSkinProfile,
  ProductAnalysisResponse,
} from '@/types/scanner';
import { scoreProduct } from './scoringService';
import { supabase } from '@/lib/supabase';

// -----------------------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------------------
const OPEN_BEAUTY_FACTS_API = 'https://world.openbeautyfacts.org/api/v0';

// User agent required by Open Beauty Facts API policy
const USER_AGENT = 'HanSkin - React Native - Version 1.0 - https://hanskin.app';

// -----------------------------------------------------------------------------
// Helper: Normalize text to Title Case for consistent display
// -----------------------------------------------------------------------------
function normalizeText(text: string | undefined | null): string {
  if (!text) return '';
  // Trim and normalize whitespace
  const cleaned = text.trim().replace(/\s+/g, ' ');
  // Convert to title case (capitalize first letter of each word)
  return cleaned
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// -----------------------------------------------------------------------------
// Helper: Normalize brand name (handle special cases like COSRX, SK-II)
// -----------------------------------------------------------------------------
function normalizeBrand(brand: string | undefined | null): string {
  if (!brand) return 'Unknown Brand';
  const cleaned = brand.trim();

  // Known brand casing (preserve original casing for these)
  const brandMap: Record<string, string> = {
    'cosrx': 'COSRX',
    'sk-ii': 'SK-II',
    'sk ii': 'SK-II',
    'iunik': 'iUNIK',
    'skin1004': 'SKIN1004',
    'cerave': 'CeraVe',
    'la roche-posay': 'La Roche-Posay',
    'la roche posay': 'La Roche-Posay',
    'dr. jart+': 'Dr. Jart+',
    'dr jart': 'Dr. Jart+',
  };

  const lowerBrand = cleaned.toLowerCase();
  if (brandMap[lowerBrand]) {
    return brandMap[lowerBrand];
  }

  // Default: title case
  return normalizeText(cleaned);
}

// -----------------------------------------------------------------------------
// Fetch Product from Database (preferred - has curated images)
// -----------------------------------------------------------------------------
async function fetchProductFromDatabase(barcode: string): Promise<{
  found: boolean;
  product: ScannedProduct | null;
  ingredientsText: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, brand, image_url, barcode, raw_inci_text')
      .eq('barcode', barcode)
      .single();

    if (error || !data) {
      return { found: false, product: null, ingredientsText: null };
    }

    return {
      found: true,
      product: {
        name: data.name || 'Unknown Product',
        brand: data.brand || 'Unknown Brand',
        imageUrl: data.image_url || null,
        barcode: barcode,
      },
      ingredientsText: data.raw_inci_text || null,
    };
  } catch {
    return { found: false, product: null, ingredientsText: null };
  }
}

// -----------------------------------------------------------------------------
// Fetch Product from Open Beauty Facts
// -----------------------------------------------------------------------------
export async function fetchProductByBarcode(barcode: string): Promise<BarcodeScanResponse> {
  try {
    // First, check our database for curated product data with better images
    const dbResult = await fetchProductFromDatabase(barcode);
    if (dbResult.found && dbResult.product) {
      return {
        found: true,
        product: dbResult.product,
        ingredientsText: dbResult.ingredientsText,
      };
    }

    // Fallback to Open Beauty Facts API
    const response = await fetch(
      `${OPEN_BEAUTY_FACTS_API}/product/${barcode}.json`,
      {
        method: 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: OpenBeautyFactsProduct = await response.json();

    // Check if product was found
    if (data.status === 0 || !data.product) {
      return {
        found: false,
        product: null,
        ingredientsText: null,
      };
    }

    const product = data.product;

    // Normalize the product name and brand from API (handles inconsistent casing)
    const rawName = product.product_name || product.product_name_en || '';
    const rawBrand = product.brands || '';

    // Build product object with normalized data
    const scannedProduct: ScannedProduct = {
      name: rawName ? normalizeText(rawName) : 'Unknown Product',
      brand: normalizeBrand(rawBrand),
      imageUrl: product.image_front_url || product.image_url || null,
      barcode: barcode,
    };

    // Get ingredients text (prefer English if available)
    const ingredientsText =
      product.ingredients_text_en || product.ingredients_text || null;

    return {
      found: true,
      product: scannedProduct,
      ingredientsText,
    };
  } catch (error) {
    console.error('Error fetching product from Open Beauty Facts:', error);
    throw error;
  }
}

// -----------------------------------------------------------------------------
// Analyze Product with User Profile
// -----------------------------------------------------------------------------
export async function analyzeProduct(
  barcode: string,
  ingredientsText: string,
  userProfile: UserSkinProfile,
  productInfo?: ScannedProduct | null
): Promise<ProductAnalysisResponse> {
  // Score the product
  const score = scoreProduct(ingredientsText, userProfile);

  // If we don't have product info, create a placeholder
  const product: ScannedProduct = productInfo || {
    name: 'Manual Entry',
    brand: 'Unknown',
    imageUrl: null,
    barcode,
  };

  return {
    product,
    score,
  };
}

// -----------------------------------------------------------------------------
// Complete Scan Flow (Fetch + Analyze)
// -----------------------------------------------------------------------------
export async function scanAndAnalyzeProduct(
  barcode: string,
  userProfile: UserSkinProfile
): Promise<{
  scanResult: BarcodeScanResponse;
  analysis: ProductAnalysisResponse | null;
}> {
  // Step 1: Fetch product info
  const scanResult = await fetchProductByBarcode(barcode);

  // Step 2: If we have ingredients, analyze them
  if (scanResult.found && scanResult.ingredientsText) {
    const analysis = await analyzeProduct(
      barcode,
      scanResult.ingredientsText,
      userProfile,
      scanResult.product
    );

    return { scanResult, analysis };
  }

  // No ingredients available - will need fallback flow
  return { scanResult, analysis: null };
}

// -----------------------------------------------------------------------------
// Example Response Payloads (for documentation)
// -----------------------------------------------------------------------------
export const EXAMPLE_RESPONSES = {
  // Successful scan with ingredients
  successfulScan: {
    scanResult: {
      found: true,
      product: {
        name: 'CeraVe Hydrating Cleanser',
        brand: 'CeraVe',
        imageUrl: 'https://images.openbeautyfacts.org/images/products/example.jpg',
        barcode: '3337875597197',
      },
      ingredientsText:
        'Aqua/Water, Glycerin, Cetearyl Alcohol, Phenoxyethanol, Stearyl Alcohol, Cetyl Alcohol, PEG-40 Stearate, Behentrimonium Methosulfate, Glyceryl Stearate, Polysorbate 20, Ethoxydiglycol, Potassium Phosphate, Disodium EDTA, Dipotassium Phosphate, Sodium Lauroyl Lactylate, Ceramide NP, Ceramide AP, Phytosphingosine, Cholesterol, Sodium Hyaluronate, Xanthan Gum, Carbomer, Tocopherol, Ceramide EOP',
    },
    analysis: {
      product: {
        name: 'CeraVe Hydrating Cleanser',
        brand: 'CeraVe',
        imageUrl: 'https://images.openbeautyfacts.org/images/products/example.jpg',
        barcode: '3337875597197',
      },
      score: {
        score: 9.5,
        label: 'Great',
        reasons: [
          { type: 'positive', text: 'Ceramides helps with barrier', ingredientName: 'Ceramides' },
          { type: 'positive', text: 'Hyaluronic Acid helps with hydrating', ingredientName: 'Sodium Hyaluronate' },
          { type: 'positive', text: 'No ingredients that conflict with your profile' },
        ],
        ingredientAnalysis: {
          good: [
            {
              name: 'Glycerin',
              category: 'good',
              reason: 'Humectant that draws moisture to skin',
              matchedBenefits: ['hydrating'],
              matchedRisks: [],
            },
            {
              name: 'Ceramides',
              category: 'good',
              reason: 'Lipids that strengthen skin barrier',
              matchedBenefits: ['barrier', 'hydrating'],
              matchedRisks: [],
            },
          ],
          caution: [],
          neutral: [],
        },
        totalIngredientsAnalyzed: 23,
      },
    },
  },

  // Product not found
  notFound: {
    scanResult: {
      found: false,
      product: null,
      ingredientsText: null,
    },
    analysis: null,
  },

  // Product found but no ingredients
  noIngredients: {
    scanResult: {
      found: true,
      product: {
        name: 'Some Moisturizer',
        brand: 'Brand X',
        imageUrl: null,
        barcode: '1234567890123',
      },
      ingredientsText: null,
    },
    analysis: null,
  },
};
