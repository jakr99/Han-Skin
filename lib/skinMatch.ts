// ─────────────────────────────────────────────────────────────
// SKIN MATCH ALGORITHM & MAPPING FUNCTIONS
// ─────────────────────────────────────────────────────────────

// User profile from questionnaire
export interface UserSkinProfile {
  skinType: string | null;           // 'dry', 'oily', 'combination', 'normal', 'sensitive'
  concerns: string[];                 // From concerns questionnaire
  sensitivities: string[];            // From sensitivities questionnaire (ingredients to avoid)
  goals: string[];                    // From goals questionnaire
  preferences: {
    fragrance: boolean;
    vegan: boolean;
    crueltyFree: boolean;
  };
}

// Product from database
export interface Product {
  id: string;
  brand: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number;
  review_count: number;
  skin_types: string[];
  skin_concerns: string[];
  key_ingredients: string[];
  avoid_ingredients: string[];
  ingredient_score: number;
  buy_url: string | null;
  store: string | null;
  is_featured: boolean;
}

// ─────────────────────────────────────────────────────────────
// MAPPING: Questionnaire Values → Database Values
// ─────────────────────────────────────────────────────────────

// Maps questionnaire concern IDs to database skin_concerns values
export const CONCERNS_MAP: Record<string, string[]> = {
  'redness_flushing': ['redness', 'sensitivity', 'irritation'],
  'dark_spots': ['dark-spots', 'hyperpigmentation', 'uneven-tone'],
  'uneven_texture': ['texture', 'roughness', 'bumpy'],
  'visible_pores': ['pores', 'oiliness', 'blackheads'],
  'dehydration': ['dehydration', 'dryness', 'fine-lines'],
  'puffiness': ['puffiness', 'inflammation', 'swelling'],
  'acne': ['acne', 'breakouts', 'blemishes'],
  'aging': ['aging', 'wrinkles', 'firmness', 'fine-lines'],
  'dullness': ['dullness', 'radiance', 'glow'],
  'oiliness': ['oiliness', 'shine', 'sebum'],
  'scarring': ['scarring', 'acne-marks', 'post-acne'],
};

// Maps questionnaire sensitivity IDs to ingredient names to avoid
export const SENSITIVITIES_MAP: Record<string, string[]> = {
  'fragrance': ['fragrance', 'parfum', 'synthetic fragrance', 'artificial fragrance'],
  'acids': ['aha', 'bha', 'glycolic acid', 'salicylic acid', 'lactic acid'],
  'retinol': ['retinol', 'retinoid', 'vitamin a', 'tretinoin', 'adapalene'],
  'essential_oils': ['essential oils', 'lavender oil', 'tea tree oil', 'citrus oils'],
  'alcohol': ['alcohol', 'denatured alcohol', 'ethanol', 'isopropyl alcohol'],
  'sulfates': ['sulfates', 'sls', 'sles', 'sodium lauryl sulfate'],
  'parabens': ['parabens', 'methylparaben', 'propylparaben'],
};

// Maps skin type to database values (already aligned, but for consistency)
export const SKIN_TYPE_MAP: Record<string, string> = {
  'dry': 'dry',
  'oily': 'oily',
  'combination': 'combination',
  'normal': 'normal',
  'sensitive': 'sensitive',
};

// ─────────────────────────────────────────────────────────────
// MAPPING FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Converts user's questionnaire concerns to database-compatible values
 */
export function mapConcernsToDb(userConcerns: string[]): string[] {
  const dbConcerns: string[] = [];

  userConcerns.forEach(concern => {
    const mapped = CONCERNS_MAP[concern];
    if (mapped) {
      dbConcerns.push(...mapped);
    } else {
      // If no mapping, use the original value
      dbConcerns.push(concern.toLowerCase().replace(/_/g, '-'));
    }
  });

  return [...new Set(dbConcerns)]; // Remove duplicates
}

/**
 * Converts user's sensitivities to ingredient names to avoid
 */
export function mapSensitivitiesToIngredients(userSensitivities: string[]): string[] {
  const ingredientsToAvoid: string[] = [];

  userSensitivities.forEach(sensitivity => {
    const mapped = SENSITIVITIES_MAP[sensitivity];
    if (mapped) {
      ingredientsToAvoid.push(...mapped);
    } else {
      ingredientsToAvoid.push(sensitivity.toLowerCase());
    }
  });

  return [...new Set(ingredientsToAvoid)];
}

// ─────────────────────────────────────────────────────────────
// SKIN MATCH SCORE CALCULATION
// ─────────────────────────────────────────────────────────────

export interface SkinMatchResult {
  score: number;              // 0-100
  label: string;              // 'Excellent', 'Great', 'Good', 'Fair', 'Poor'
  color: string;              // Color for UI
  reasons: {
    positive: string[];       // Why it's good for you
    negative: string[];       // Why it might not be ideal
  };
}

/**
 * Calculates how well a product matches a user's skin profile
 */
export function calculateSkinMatch(
  product: Product,
  userProfile: UserSkinProfile
): SkinMatchResult {
  let score = 50; // Start at neutral
  const positive: string[] = [];
  const negative: string[] = [];

  // ─────────────────────────────────────────────────────────────
  // 1. SKIN TYPE MATCH (up to +25 or -15 points)
  // ─────────────────────────────────────────────────────────────
  if (userProfile.skinType) {
    const userSkinType = SKIN_TYPE_MAP[userProfile.skinType] || userProfile.skinType;

    if (product.skin_types.includes(userSkinType)) {
      score += 25;
      positive.push(`Great for ${userProfile.skinType} skin`);
    } else if (product.skin_types.includes('all')) {
      score += 15;
      positive.push('Suitable for all skin types');
    } else {
      score -= 15;
      negative.push(`May not be ideal for ${userProfile.skinType} skin`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CONCERNS MATCH (up to +30 points)
  // ─────────────────────────────────────────────────────────────
  if (userProfile.concerns.length > 0) {
    const userDbConcerns = mapConcernsToDb(userProfile.concerns);
    const matchingConcerns = product.skin_concerns.filter(c =>
      userDbConcerns.some(uc => c.includes(uc) || uc.includes(c))
    );

    if (matchingConcerns.length > 0) {
      const concernScore = Math.min(30, matchingConcerns.length * 10);
      score += concernScore;

      // Add readable concern names
      const concernLabels = matchingConcerns.slice(0, 2).map(c =>
        c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
      positive.push(`Targets ${concernLabels.join(' & ')}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. SENSITIVITY CHECK (up to -30 points)
  // ─────────────────────────────────────────────────────────────
  if (userProfile.sensitivities.length > 0) {
    const ingredientsToAvoid = mapSensitivitiesToIngredients(userProfile.sensitivities);

    // Check if product contains ingredients user wants to avoid
    const hasAvoidedIngredients = product.key_ingredients.some(ingredient =>
      ingredientsToAvoid.some(avoid =>
        ingredient.toLowerCase().includes(avoid.toLowerCase())
      )
    );

    // Check product's own avoid list
    const productHasWarnings = product.avoid_ingredients.length > 0;

    if (hasAvoidedIngredients) {
      score -= 30;
      negative.push('Contains ingredients you prefer to avoid');
    } else {
      score += 10;
      positive.push('Free of your sensitivity triggers');
    }

    if (productHasWarnings && userProfile.skinType === 'sensitive') {
      score -= 10;
      negative.push('May cause irritation for sensitive skin');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. INGREDIENT SAFETY SCORE (+/- 10 points)
  // ─────────────────────────────────────────────────────────────
  if (product.ingredient_score >= 90) {
    score += 10;
    positive.push('Excellent ingredient safety');
  } else if (product.ingredient_score >= 80) {
    score += 5;
  } else if (product.ingredient_score < 70) {
    score -= 5;
    negative.push('Some ingredients may be concerning');
  }

  // ─────────────────────────────────────────────────────────────
  // 5. FRAGRANCE PREFERENCE
  // ─────────────────────────────────────────────────────────────
  if (userProfile.preferences?.fragrance === false) {
    const hasFragrance = product.key_ingredients.some(i =>
      i.toLowerCase().includes('fragrance') || i.toLowerCase().includes('parfum')
    );

    if (hasFragrance) {
      score -= 10;
      negative.push('Contains fragrance');
    } else {
      score += 5;
      positive.push('Fragrance-free');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // CLAMP SCORE & DETERMINE LABEL
  // ─────────────────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  let label: string;
  let color: string;

  if (score >= 85) {
    label = 'Excellent Match';
    color = '#10B981'; // green
  } else if (score >= 70) {
    label = 'Great Match';
    color = '#34D399'; // light green
  } else if (score >= 55) {
    label = 'Good Match';
    color = '#FBBF24'; // yellow
  } else if (score >= 40) {
    label = 'Fair Match';
    color = '#F97316'; // orange
  } else {
    label = 'Poor Match';
    color = '#EF4444'; // red
  }

  return {
    score,
    label,
    color,
    reasons: {
      positive: positive.slice(0, 3), // Max 3 positive reasons
      negative: negative.slice(0, 2), // Max 2 negative reasons
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SORT PRODUCTS BY SKIN MATCH
// ─────────────────────────────────────────────────────────────

export function sortProductsBySkinMatch(
  products: Product[],
  userProfile: UserSkinProfile
): (Product & { skinMatch: SkinMatchResult })[] {
  return products
    .map(product => ({
      ...product,
      skinMatch: calculateSkinMatch(product, userProfile),
    }))
    .sort((a, b) => b.skinMatch.score - a.skinMatch.score);
}

// ─────────────────────────────────────────────────────────────
// INGREDIENT SAFETY RATINGS
// ─────────────────────────────────────────────────────────────

export type IngredientSafety = 'good' | 'okay' | 'caution';

export interface IngredientInfo {
  name: string;
  safety: IngredientSafety;
  score: number;        // 1-10 (1=safest, 10=avoid)
  color: string;
  description?: string;
}

export function getIngredientSafetyColor(safety: IngredientSafety): string {
  switch (safety) {
    case 'good':
      return '#10B981'; // green
    case 'okay':
      return '#FBBF24'; // yellow
    case 'caution':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
}

export function getIngredientSafetyFromScore(score: number): IngredientSafety {
  if (score <= 3) return 'good';
  if (score <= 6) return 'okay';
  return 'caution';
}
