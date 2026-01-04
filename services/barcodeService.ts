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

// -----------------------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------------------
const OPEN_BEAUTY_FACTS_API = 'https://world.openbeautyfacts.org/api/v0';

// User agent required by Open Beauty Facts API policy
const USER_AGENT = 'HanSkin - React Native - Version 1.0 - https://hanskin.app';

// -----------------------------------------------------------------------------
// Fetch Product from Open Beauty Facts
// -----------------------------------------------------------------------------
export async function fetchProductByBarcode(barcode: string): Promise<BarcodeScanResponse> {
  try {
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

    // Build product object
    const scannedProduct: ScannedProduct = {
      name: product.product_name || product.product_name_en || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
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
