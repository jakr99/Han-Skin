// =============================================================================
// Scoring Service - Han Skin Product Scoring Algorithm
// =============================================================================

import type {
  UserSkinProfile,
  ProductScore,
  ScoreLabel,
  IngredientAnalysis,
  ScoringReason,
  IngredientBenefit,
  IngredientRisk,
} from '@/types/scanner';
import {
  INGREDIENT_INTELLIGENCE,
  CONCERN_TO_BENEFIT_MAP,
  SENSITIVITY_KEYWORDS,
} from '@/data/ingredientIntelligence';

// -----------------------------------------------------------------------------
// Scoring Constants
// -----------------------------------------------------------------------------
const SCORING_CONFIG = {
  BASE_SCORE: 10,
  SENSITIVITY_PENALTY: 3,
  MAX_SENSITIVITY_PENALTY: 6, // Cap so score doesn't instantly zero
  COMEDOGENIC_ACNE_PENALTY: 2,
  DRYING_DRY_SKIN_PENALTY: 2,
  IRRITANT_PENALTY: 1.5,
  BENEFIT_BONUS: 0.5,
  MAX_BENEFIT_BONUS: 2,
  MIN_SCORE: 0,
  MAX_SCORE: 10,
};

// -----------------------------------------------------------------------------
// Label Thresholds
// -----------------------------------------------------------------------------
function getScoreLabel(score: number): ScoreLabel {
  if (score >= 8.0) return 'Great';
  if (score >= 5.0) return 'Okay';
  return 'Bad';
}

// -----------------------------------------------------------------------------
// Parse Ingredients Text into Array
// -----------------------------------------------------------------------------
export function parseIngredientsText(ingredientsText: string): string[] {
  // INCI lists are typically comma-separated
  // Handle various formats: commas, line breaks, numbered lists
  const cleaned = ingredientsText
    .toLowerCase()
    .replace(/\d+\.\s*/g, '') // Remove numbered list markers
    .replace(/\n/g, ',') // Convert line breaks to commas
    .replace(/;/g, ',') // Convert semicolons to commas
    .replace(/\s+/g, ' '); // Normalize whitespace

  return cleaned
    .split(',')
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0);
}

// -----------------------------------------------------------------------------
// Find Ingredient in Intelligence Map
// -----------------------------------------------------------------------------
function findIngredientMatch(ingredientName: string) {
  const normalized = ingredientName.toLowerCase().trim();

  // Direct match
  if (INGREDIENT_INTELLIGENCE[normalized]) {
    return { key: normalized, profile: INGREDIENT_INTELLIGENCE[normalized] };
  }

  // Check aliases
  for (const [key, profile] of Object.entries(INGREDIENT_INTELLIGENCE)) {
    if (profile.aliases?.some((alias) => normalized.includes(alias) || alias.includes(normalized))) {
      return { key, profile };
    }
    // Partial match on canonical name
    if (normalized.includes(key) || key.includes(normalized)) {
      return { key, profile };
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// Check if Ingredient Matches User Sensitivities
// -----------------------------------------------------------------------------
function checkSensitivityMatch(
  ingredientName: string,
  userSensitivities: string[]
): string | null {
  const normalized = ingredientName.toLowerCase();

  for (const sensitivity of userSensitivities) {
    const keywords = SENSITIVITY_KEYWORDS[sensitivity.toLowerCase()] || [
      sensitivity.toLowerCase(),
    ];

    for (const keyword of keywords) {
      if (normalized.includes(keyword) || keyword.includes(normalized)) {
        return sensitivity;
      }
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// Get Benefits That Match User Concerns
// -----------------------------------------------------------------------------
function getMatchingBenefits(
  ingredientBenefits: IngredientBenefit[],
  userConcerns: string[]
): IngredientBenefit[] {
  const matchingBenefits: IngredientBenefit[] = [];

  for (const concern of userConcerns) {
    const benefitsForConcern = CONCERN_TO_BENEFIT_MAP[concern.toLowerCase()] || [];

    for (const benefit of ingredientBenefits) {
      if (benefitsForConcern.includes(benefit) && !matchingBenefits.includes(benefit)) {
        matchingBenefits.push(benefit);
      }
    }
  }

  return matchingBenefits;
}

// -----------------------------------------------------------------------------
// Main Scoring Function
// -----------------------------------------------------------------------------
export function scoreProduct(
  ingredientsText: string,
  userProfile: UserSkinProfile
): ProductScore {
  const ingredients = parseIngredientsText(ingredientsText);
  let score = SCORING_CONFIG.BASE_SCORE;

  // Track penalties and bonuses
  let totalSensitivityPenalty = 0;
  let totalBenefitBonus = 0;

  // Track ingredient analysis
  const goodIngredients: IngredientAnalysis[] = [];
  const cautionIngredients: IngredientAnalysis[] = [];
  const neutralIngredients: IngredientAnalysis[] = [];

  // Track reasons
  const positiveReasons: ScoringReason[] = [];
  const cautionReasons: ScoringReason[] = [];

  for (const ingredientName of ingredients) {
    const match = findIngredientMatch(ingredientName);
    const sensitivityMatch = checkSensitivityMatch(ingredientName, userProfile.sensitivities);

    // Check for sensitivity match (highest priority penalty)
    if (sensitivityMatch) {
      const penalty = Math.min(
        SCORING_CONFIG.SENSITIVITY_PENALTY,
        SCORING_CONFIG.MAX_SENSITIVITY_PENALTY - totalSensitivityPenalty
      );
      if (penalty > 0) {
        totalSensitivityPenalty += penalty;
        score -= penalty;

        cautionIngredients.push({
          name: ingredientName,
          category: 'caution',
          reason: `Matches your sensitivity: ${sensitivityMatch}`,
          matchedBenefits: [],
          matchedRisks: ['sensitizing'],
        });

        cautionReasons.push({
          type: 'caution',
          text: `Contains ${sensitivityMatch} (your sensitivity)`,
          ingredientName,
        });
      }
      continue;
    }

    if (!match) {
      // Unknown ingredient - neutral
      neutralIngredients.push({
        name: ingredientName,
        category: 'neutral',
        reason: 'Not in our database',
        matchedBenefits: [],
        matchedRisks: [],
      });
      continue;
    }

    const { profile } = match;
    const matchingBenefits = getMatchingBenefits(profile.benefits, userProfile.concerns);
    const hasRisks = profile.risks.length > 0;
    let ingredientPenalty = 0;
    let ingredientBonus = 0;
    const ingredientRisks: IngredientRisk[] = [];
    const reasons: string[] = [];

    // Check for comedogenic + acne concern
    if (
      profile.risks.includes('comedogenic') &&
      userProfile.concerns.some((c) => c.toLowerCase().includes('acne'))
    ) {
      ingredientPenalty += SCORING_CONFIG.COMEDOGENIC_ACNE_PENALTY;
      ingredientRisks.push('comedogenic');
      reasons.push('Comedogenic (may clog pores)');
    }

    // Check for drying + dry skin
    if (
      profile.risks.includes('drying') &&
      userProfile.skinType === 'dry'
    ) {
      ingredientPenalty += SCORING_CONFIG.DRYING_DRY_SKIN_PENALTY;
      ingredientRisks.push('drying');
      reasons.push('May be too drying for your skin type');
    }

    // Check for irritant risk
    if (profile.risks.includes('irritant')) {
      ingredientPenalty += SCORING_CONFIG.IRRITANT_PENALTY;
      ingredientRisks.push('irritant');
      if (!reasons.some((r) => r.includes('irritat'))) {
        reasons.push('Potential irritant');
      }
    }

    // Check for fragrance/essential oil risks
    if (profile.risks.includes('fragrance') || profile.risks.includes('essential_oil')) {
      ingredientRisks.push(...profile.risks.filter(r => r === 'fragrance' || r === 'essential_oil'));
      reasons.push('Contains fragrance/essential oils');
    }

    // Apply benefit bonuses
    if (matchingBenefits.length > 0) {
      const bonus = Math.min(
        matchingBenefits.length * SCORING_CONFIG.BENEFIT_BONUS,
        SCORING_CONFIG.MAX_BENEFIT_BONUS - totalBenefitBonus
      );
      if (bonus > 0) {
        ingredientBonus = bonus;
        totalBenefitBonus += bonus;
      }
    }

    // Net score adjustment
    score -= ingredientPenalty;
    score += ingredientBonus;

    // Categorize ingredient
    if (ingredientPenalty > 0 || ingredientRisks.length > 0) {
      cautionIngredients.push({
        name: profile.canonicalName,
        category: 'caution',
        reason: reasons.join('; ') || 'May not suit your skin',
        matchedBenefits: matchingBenefits,
        matchedRisks: ingredientRisks,
      });

      if (cautionReasons.length < 3) {
        cautionReasons.push({
          type: 'caution',
          text: reasons[0] || `Contains ${profile.canonicalName}`,
          ingredientName: profile.canonicalName,
        });
      }
    } else if (matchingBenefits.length > 0) {
      goodIngredients.push({
        name: profile.canonicalName,
        category: 'good',
        reason: profile.description || `Provides ${matchingBenefits.join(', ')}`,
        matchedBenefits: matchingBenefits,
        matchedRisks: [],
      });

      if (positiveReasons.length < 3) {
        positiveReasons.push({
          type: 'positive',
          text: `${profile.canonicalName} helps with ${matchingBenefits.join(' & ')}`,
          ingredientName: profile.canonicalName,
        });
      }
    } else if (profile.benefits.length > 0) {
      // Has general benefits but doesn't match specific concerns
      goodIngredients.push({
        name: profile.canonicalName,
        category: 'good',
        reason: profile.description || `Provides ${profile.benefits.join(', ')}`,
        matchedBenefits: profile.benefits,
        matchedRisks: [],
      });
    } else {
      neutralIngredients.push({
        name: profile.canonicalName,
        category: 'neutral',
        reason: 'Neutral ingredient',
        matchedBenefits: [],
        matchedRisks: [],
      });
    }
  }

  // Clamp score
  score = Math.max(SCORING_CONFIG.MIN_SCORE, Math.min(SCORING_CONFIG.MAX_SCORE, score));

  // Build final reasons array (2 positive, 1 caution as specified)
  const finalReasons: ScoringReason[] = [
    ...positiveReasons.slice(0, 2),
    ...cautionReasons.slice(0, 1),
  ];

  // If we don't have enough reasons, add generic ones
  if (positiveReasons.length === 0 && goodIngredients.length > 0) {
    finalReasons.unshift({
      type: 'positive',
      text: `Contains ${goodIngredients.length} beneficial ingredient(s)`,
    });
  }

  if (cautionReasons.length === 0 && cautionIngredients.length === 0) {
    finalReasons.push({
      type: 'positive',
      text: 'No ingredients that conflict with your profile',
    });
  }

  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    label: getScoreLabel(score),
    reasons: finalReasons,
    ingredientAnalysis: {
      good: goodIngredients,
      caution: cautionIngredients,
      neutral: neutralIngredients,
    },
    totalIngredientsAnalyzed: ingredients.length,
  };
}

// -----------------------------------------------------------------------------
// Example Usage (for testing)
// -----------------------------------------------------------------------------
export function exampleScoring() {
  const testProfile: UserSkinProfile = {
    skinType: 'oily',
    concerns: ['acne', 'dark spots'],
    sensitivities: ['fragrance'],
  };

  const testIngredients = `
    Water, Glycerin, Niacinamide, Hyaluronic Acid, Salicylic Acid,
    Parfum, Coconut Oil, Vitamin C, Centella Asiatica Extract
  `;

  return scoreProduct(testIngredients, testProfile);
}
