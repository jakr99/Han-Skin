// ============================================================================
// EXAMPLE SCORING OUTPUTS
// Demonstrating how the engine works for different scenarios
// ============================================================================

import { UserProfile, Product, ProductIngredient, ScoringResult } from './engine';

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE USER: Oily, Acne-Prone, Sensitive to Fragrance
// ─────────────────────────────────────────────────────────────────────────────

export const EXAMPLE_USER: UserProfile = {
  id: 'user-123',
  skin_type: 'oily',
  concerns: [
    { type: 'acne', severity: 4 },
    { type: 'oiliness', severity: 3 },
    { type: 'enlarged_pores', severity: 2 },
  ],
  sensitivities: [
    { type: 'fragrance', confirmed: true },
  ],
  hard_blocks: [
    { pattern: '%lanolin%' }, // Allergic to lanolin
  ],
  preferences: {
    fragrance_free: true,
    vegan: false,
    cruelty_free: true,
  },
  weight_adjustments: new Map(),
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE PRODUCT 1: RECOMMENDED (Lightweight, Non-Comedogenic Moisturizer)
// ─────────────────────────────────────────────────────────────────────────────

export const EXAMPLE_PRODUCT_RECOMMENDED: Product = {
  id: 'prod-good-01',
  name: 'Oil-Free Hydrating Gel',
  brand: 'COSRX',
  category: 'moisturizer',
  base_safety_score: 92,
  unknown_ingredient_count: 0,
  ingredients: [
    {
      ingredient_id: 'ing-001',
      name: 'Water',
      position: 1,
      concentration_tier: 'high',
      tags: new Map(),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-002',
      name: 'Glycerin',
      position: 2,
      concentration_tier: 'high',
      tags: new Map([
        ['humectant', { value: true, confidence: 1.0 }],
        ['hydrating', { value: true, confidence: 1.0 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-003',
      name: 'Niacinamide',
      position: 3,
      concentration_tier: 'high',
      tags: new Map([
        ['sebum_regulating', { value: true, confidence: 0.9 }],
        ['anti_inflammatory', { value: true, confidence: 0.9 }],
        ['barrier_supportive', { value: true, confidence: 0.8 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-004',
      name: 'Squalane',
      position: 4,
      concentration_tier: 'high',
      tags: new Map([
        ['emollient_light', { value: true, confidence: 1.0 }],
        ['comedogenic_risk', { value: 'low' as const, confidence: 0.9 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-005',
      name: 'Centella Asiatica Extract',
      position: 5,
      concentration_tier: 'high',
      tags: new Map([
        ['soothing', { value: true, confidence: 0.9 }],
        ['anti_inflammatory', { value: true, confidence: 0.9 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-006',
      name: 'Hyaluronic Acid',
      position: 6,
      concentration_tier: 'medium',
      tags: new Map([
        ['humectant', { value: true, confidence: 1.0 }],
        ['hydrating', { value: true, confidence: 1.0 }],
      ]),
      is_unknown: false,
    },
  ],
};

/**
 * EXPECTED OUTPUT for EXAMPLE_PRODUCT_RECOMMENDED:
 */
export const EXPECTED_RESULT_RECOMMENDED: ScoringResult = {
  product_id: 'prod-good-01',
  is_blocked: false,
  block_reason: undefined,

  match_score: 88,
  match_label: 'Excellent Match',
  match_color: '#10B981',

  confidence: 1.0,
  confidence_label: 'High',

  caution_flags: [],

  positive_reasons: [
    'Contains Niacinamide which helps regulate oil production.',
    'Contains Squalane, a lightweight emollient that hydrates without heaviness.',
    'Contains Glycerin, a humectant that draws moisture into skin.',
    'Fragrance-free formula.',
  ],

  negative_reasons: [],

  rules_fired: [
    {
      rule_id: 'oily-004',
      rule_name: 'oily_niacinamide_bonus',
      action: 'bonus',
      score_delta: 10,
      ingredient_name: 'Niacinamide',
      ingredient_position: 3,
      explanation: 'Contains Niacinamide which helps regulate oil production.',
      short_explanation: 'Controls oil',
    },
    {
      rule_id: 'oily-003',
      rule_name: 'oily_lightweight_emollient_bonus',
      action: 'bonus',
      score_delta: 8,
      ingredient_name: 'Squalane',
      ingredient_position: 4,
      explanation: 'Contains Squalane, a lightweight emollient that hydrates without heaviness.',
      short_explanation: 'Lightweight hydration',
    },
    // ... more rules
  ],

  computed_at: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE PRODUCT 2: BLOCKED (Contains Allergen)
// ─────────────────────────────────────────────────────────────────────────────

export const EXAMPLE_PRODUCT_BLOCKED: Product = {
  id: 'prod-bad-01',
  name: 'Rich Night Cream',
  brand: 'Some Brand',
  category: 'moisturizer',
  base_safety_score: 78,
  unknown_ingredient_count: 1,
  ingredients: [
    {
      ingredient_id: 'ing-101',
      name: 'Water',
      position: 1,
      concentration_tier: 'high',
      tags: new Map(),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-102',
      name: 'Lanolin',
      position: 2,
      concentration_tier: 'high',
      tags: new Map([
        ['occlusive_heavy', { value: true, confidence: 1.0 }],
        ['common_allergen', { value: true, confidence: 0.9 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-103',
      name: 'Mineral Oil',
      position: 3,
      concentration_tier: 'high',
      tags: new Map([
        ['occlusive_heavy', { value: true, confidence: 1.0 }],
        ['comedogenic_risk', { value: 'medium' as const, confidence: 0.7 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-104',
      name: 'Isopropyl Myristate',
      position: 4,
      concentration_tier: 'high',
      tags: new Map([
        ['comedogenic_risk', { value: 'very_high' as const, confidence: 0.95 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-105',
      name: 'Parfum',
      position: 8,
      concentration_tier: 'medium',
      tags: new Map([
        ['fragrance', { value: true, confidence: 1.0 }],
        ['irritant_potential', { value: 'medium' as const, confidence: 0.8 }],
      ]),
      is_unknown: false,
    },
  ],
};

/**
 * EXPECTED OUTPUT for EXAMPLE_PRODUCT_BLOCKED:
 */
export const EXPECTED_RESULT_BLOCKED: ScoringResult = {
  product_id: 'prod-bad-01',
  is_blocked: true,
  block_reason: 'allergen',

  match_score: 0,
  match_label: 'Not Recommended',
  match_color: '#EF4444',

  confidence: 1.0,
  confidence_label: 'High',

  caution_flags: [
    {
      type: 'allergen',
      severity: 'critical',
      confidence: 'high',
      message: "Contains Lanolin which you've marked as an allergen",
    },
  ],

  positive_reasons: [],

  negative_reasons: [
    'Contains Lanolin, an ingredient you need to avoid',
  ],

  rules_fired: [],

  computed_at: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE PRODUCT 3: FAIR MATCH (Has Issues But Not Blocked)
// ─────────────────────────────────────────────────────────────────────────────

export const EXAMPLE_PRODUCT_FAIR: Product = {
  id: 'prod-fair-01',
  name: 'Coconut Oil Moisturizer',
  brand: 'Natural Brand',
  category: 'moisturizer',
  base_safety_score: 85,
  unknown_ingredient_count: 0,
  ingredients: [
    {
      ingredient_id: 'ing-201',
      name: 'Cocos Nucifera Oil',
      position: 1,
      concentration_tier: 'high',
      tags: new Map([
        ['occlusive_heavy', { value: true, confidence: 1.0 }],
        ['comedogenic_risk', { value: 'high' as const, confidence: 0.85 }],
        ['emollient_heavy', { value: true, confidence: 1.0 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-202',
      name: 'Shea Butter',
      position: 2,
      concentration_tier: 'high',
      tags: new Map([
        ['occlusive_heavy', { value: true, confidence: 0.9 }],
        ['emollient_heavy', { value: true, confidence: 1.0 }],
        ['barrier_supportive', { value: true, confidence: 0.8 }],
        ['comedogenic_risk', { value: 'low' as const, confidence: 0.7 }],
      ]),
      is_unknown: false,
    },
    {
      ingredient_id: 'ing-203',
      name: 'Lavender Oil',
      position: 5,
      concentration_tier: 'high',
      tags: new Map([
        ['essential_oil', { value: true, confidence: 1.0 }],
        ['fragrance', { value: true, confidence: 1.0 }],
        ['irritant_potential', { value: 'medium' as const, confidence: 0.7 }],
      ]),
      is_unknown: false,
    },
  ],
};

/**
 * EXPECTED OUTPUT for EXAMPLE_PRODUCT_FAIR:
 */
export const EXPECTED_RESULT_FAIR: ScoringResult = {
  product_id: 'prod-fair-01',
  is_blocked: false,

  match_score: 35,
  match_label: 'Poor Match',
  match_color: '#EF4444',

  confidence: 1.0,
  confidence_label: 'High',

  caution_flags: [
    {
      type: 'clog_risk',
      severity: 'warning',
      confidence: 'medium',
    },
    {
      type: 'heaviness',
      severity: 'warning',
      confidence: 'medium',
    },
    {
      type: 'fragrance',
      severity: 'info',
      confidence: 'high',
    },
  ],

  positive_reasons: [],

  negative_reasons: [
    'Contains Cocos Nucifera Oil which is known to clog pores. May trigger breakouts.',
    'Contains Cocos Nucifera Oil, a heavy occlusive that may feel too rich for oily skin.',
    'Contains fragrance, but you prefer fragrance-free products.',
    'Contains Lavender Oil, an essential oil that may cause sensitivity.',
  ],

  rules_fired: [
    {
      rule_id: 'acne-001',
      rule_name: 'acne_high_comedogenic_penalty',
      action: 'penalty',
      score_delta: -20,
      ingredient_name: 'Cocos Nucifera Oil',
      ingredient_position: 1,
      explanation: 'Contains Cocos Nucifera Oil which is known to clog pores. May trigger breakouts.',
      short_explanation: 'Pore-clogging',
    },
    {
      rule_id: 'oily-001',
      rule_name: 'oily_heavy_occlusive_penalty',
      action: 'penalty',
      score_delta: -12,
      ingredient_name: 'Cocos Nucifera Oil',
      ingredient_position: 1,
      explanation: 'Contains Cocos Nucifera Oil, a heavy occlusive that may feel too rich for oily skin.',
      short_explanation: 'Heavy for oily skin',
    },
    {
      rule_id: 'univ-001',
      rule_name: 'fragrance_free_preference_penalty',
      action: 'penalty',
      score_delta: -10,
      ingredient_name: 'Lavender Oil',
      ingredient_position: 5,
      explanation: 'Contains fragrance, but you prefer fragrance-free products.',
      short_explanation: 'Has fragrance',
    },
  ],

  computed_at: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
// UI COPY EXAMPLES (Trust-Building Language)
// ─────────────────────────────────────────────────────────────────────────────

export const UI_COPY_GUIDELINES = {
  // Match score labels
  labels: {
    excellent: 'Excellent Match',
    great: 'Great Match',
    good: 'Good Match',
    fair: 'Fair Match',
    poor: 'Not the Best Fit', // NOT "Poor Match" or "Bad"
    blocked: 'Not Recommended',
  },

  // Caution flag wording
  caution_wording: {
    clog_risk: {
      high: 'May not be ideal for clog-prone skin',
      medium: 'Contains ingredients some find pore-clogging',
    },
    irritation: {
      high: 'May cause sensitivity for some skin types',
      medium: 'Contains potentially irritating ingredients',
    },
    fragrance: 'Contains fragrance (not ideal if sensitive)',
    drying: 'May be drying for some skin types',
    heaviness: 'May feel heavy on oily skin',
    allergen: 'Contains an ingredient you need to avoid',
    incomplete_data: 'Some ingredients couldn\'t be analyzed',
  },

  // Confidence disclaimers
  confidence_disclaimers: {
    high: null, // No disclaimer needed
    medium: 'Some ingredients had limited data. Our assessment may be approximate.',
    low: 'Many ingredients couldn\'t be fully analyzed. Consider patch testing.',
  },

  // General disclaimers
  disclaimers: {
    main: 'Ingredient presence doesn\'t guarantee a reaction. Everyone\'s skin is different.',
    patch_test: 'When trying new products, patch testing is always recommended.',
    not_medical: 'This is not medical advice. Consult a dermatologist for skin concerns.',
  },

  // NEVER use these words
  banned_words: [
    'toxic',
    'dangerous',
    'harmful',
    'bad',
    'terrible',
    'unsafe',
    'poison',
    'cancer',
    'carcinogen',
    'deadly',
  ],

  // Preferred alternatives
  preferred_alternatives: {
    'toxic': 'may not be ideal',
    'dangerous': 'use with caution',
    'harmful': 'potentially sensitizing',
    'bad ingredient': 'ingredient some prefer to avoid',
    'unsafe': 'may cause sensitivity',
  },
};
