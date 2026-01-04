// =============================================================================
// Scanner Flow Types - Han Skin Barcode Scanner
// =============================================================================

// -----------------------------------------------------------------------------
// User Profile Types (for scoring context)
// -----------------------------------------------------------------------------
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal';

export interface UserSkinProfile {
  skinType: SkinType;
  concerns: string[]; // e.g., ['acne', 'uneven tone', 'redness', 'aging', 'dark spots']
  sensitivities: string[]; // e.g., ['fragrance', 'denatured alcohol', 'essential oils']
}

// -----------------------------------------------------------------------------
// Open Beauty Facts API Response Types
// -----------------------------------------------------------------------------
export interface OpenBeautyFactsProduct {
  code: string;
  status: number; // 1 = found, 0 = not found
  status_verbose: string;
  product?: {
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
    categories?: string;
  };
}

// -----------------------------------------------------------------------------
// Product Types
// -----------------------------------------------------------------------------
export interface ScannedProduct {
  name: string;
  brand: string;
  imageUrl: string | null;
  barcode: string;
}

export interface BarcodeScanResponse {
  found: boolean;
  product: ScannedProduct | null;
  ingredientsText: string | null;
}

// -----------------------------------------------------------------------------
// Ingredient Intelligence Types
// -----------------------------------------------------------------------------
export type IngredientBenefit =
  | 'hydrating'
  | 'soothing'
  | 'brightening'
  | 'acne'
  | 'barrier'
  | 'anti-aging'
  | 'exfoliating'
  | 'antioxidant';

export type IngredientRisk =
  | 'irritant'
  | 'comedogenic'
  | 'drying'
  | 'fragrance'
  | 'essential_oil'
  | 'sensitizing'
  | 'photosensitizing';

export interface IngredientProfile {
  canonicalName: string;
  aliases?: string[]; // Alternative names for matching
  benefits: IngredientBenefit[];
  risks: IngredientRisk[];
  description?: string;
}

export interface IngredientIntelligenceMap {
  [key: string]: IngredientProfile;
}

// -----------------------------------------------------------------------------
// Scoring Types
// -----------------------------------------------------------------------------
export type ScoreLabel = 'Great' | 'Okay' | 'Bad';

export interface IngredientAnalysis {
  name: string;
  category: 'good' | 'caution' | 'neutral';
  reason: string;
  matchedBenefits: IngredientBenefit[];
  matchedRisks: IngredientRisk[];
}

export interface ScoringReason {
  type: 'positive' | 'caution';
  text: string;
  ingredientName?: string;
}

export interface ProductScore {
  score: number; // 0-10
  label: ScoreLabel;
  reasons: ScoringReason[];
  ingredientAnalysis: {
    good: IngredientAnalysis[];
    caution: IngredientAnalysis[];
    neutral: IngredientAnalysis[];
  };
  totalIngredientsAnalyzed: number;
}

// -----------------------------------------------------------------------------
// API Request/Response Types
// -----------------------------------------------------------------------------
export interface BarcodeScanRequest {
  barcode: string;
  userId: string;
}

export interface ProductAnalysisRequest {
  barcode: string;
  ingredientsText: string;
  userProfile: UserSkinProfile;
}

export interface ProductAnalysisResponse {
  product: ScannedProduct;
  score: ProductScore;
}

// -----------------------------------------------------------------------------
// Fallback Flow Types
// -----------------------------------------------------------------------------
export type FallbackOption = 'paste' | 'ocr';

export interface ManualIngredientsInput {
  barcode: string;
  ingredientsText: string;
  source: 'manual_paste' | 'ocr';
}
