// ============================================================================
// HAN-SKIN DEFAULT SCORING RULES
// These rules can be edited and stored in DB without redeploying
// ============================================================================

import { ScoringRule } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// HARD FILTER RULES (Block products entirely)
// Priority 1-20: Evaluated first, stops processing if triggered
// ─────────────────────────────────────────────────────────────────────────────

export const HARD_FILTER_RULES: ScoringRule[] = [
  {
    id: 'hf-001',
    name: 'user_allergy_block',
    description: 'Block products containing ingredients user has marked as allergies',
    rule_type: 'hard_filter',
    priority: 1,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_sensitivity', sensitivity: 'any', operator: 'exists', value: true },
        { type: 'ingredient_tag', tag: 'user_blocked', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'block',
      block_reason: 'allergy',
      caution_flag: {
        type: 'allergen',
        severity: 'critical',
        confidence: 'high',
        message: 'Contains an ingredient you\'ve marked as an allergen'
      }
    },
    explanation_template: 'Contains {ingredient_name} which you\'ve identified as causing allergic reactions.',
    short_explanation: 'Contains your allergen',
    icon: 'alert-circle',
    is_active: true,
    version: 1
  },
  {
    id: 'hf-002',
    name: 'sensitive_strong_irritant_block',
    description: 'Block strong irritants for users with sensitive skin and severity 4+',
    rule_type: 'hard_filter',
    priority: 5,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'user_concern', concern: 'sensitivity', min_severity: 4, operator: 'gte', value: 4 },
        { type: 'ingredient_tag', tag: 'irritant_potential', operator: 'gte', value: 'high' },
        { type: 'ingredient_position', position_max: 15, operator: 'lte', value: 15 }
      ]
    },
    actions: {
      action: 'block',
      block_reason: 'irritant_risk',
      caution_flag: {
        type: 'irritation',
        severity: 'critical',
        confidence: 'high'
      }
    },
    explanation_template: 'Contains {ingredient_name} which has high irritation potential. Given your sensitive skin, this may cause a reaction.',
    short_explanation: 'High irritation risk',
    icon: 'flame',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RULES - OILY SKIN
// Priority 21-40
// ─────────────────────────────────────────────────────────────────────────────

export const OILY_SKIN_RULES: ScoringRule[] = [
  {
    id: 'oily-001',
    name: 'oily_heavy_occlusive_penalty',
    description: 'Penalize heavy occlusives for oily skin',
    rule_type: 'scoring',
    priority: 25,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'oily' },
        { type: 'ingredient_tag', tag: 'occlusive_heavy', operator: 'eq', value: true },
        { type: 'ingredient_position', position_max: 10, operator: 'lte', value: 10 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -12,
      max_penalty_per_product: -25,
      max_instances: 3,
      caution_flag: {
        type: 'heaviness',
        severity: 'warning',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name}, a heavy occlusive that may feel too rich for oily skin.',
    short_explanation: 'Heavy for oily skin',
    icon: 'water',
    is_active: true,
    version: 1
  },
  {
    id: 'oily-002',
    name: 'oily_high_comedogenic_penalty',
    description: 'Penalize high comedogenic ingredients for oily skin',
    rule_type: 'scoring',
    priority: 22,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'oily' },
        { type: 'ingredient_tag', tag: 'comedogenic_risk', operator: 'gte', value: 'high' },
        { type: 'ingredient_position', position_max: 15, operator: 'lte', value: 15 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -15,
      max_penalty_per_product: -30,
      max_instances: 3,
      caution_flag: {
        type: 'clog_risk',
        severity: 'warning',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name} which has high pore-clogging potential. May not be ideal for oily skin.',
    short_explanation: 'Pore-clogging risk',
    icon: 'ellipse',
    is_active: true,
    version: 1
  },
  {
    id: 'oily-003',
    name: 'oily_lightweight_emollient_bonus',
    description: 'Bonus for lightweight emollients for oily skin',
    rule_type: 'bonus',
    priority: 30,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'oily' },
        { type: 'ingredient_tag', tag: 'emollient_light', operator: 'eq', value: true },
        { type: 'ingredient_position', position_max: 10, operator: 'lte', value: 10 }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 8,
      max_instances: 2
    },
    explanation_template: 'Contains {ingredient_name}, a lightweight emollient that hydrates without heaviness.',
    short_explanation: 'Lightweight hydration',
    icon: 'leaf',
    is_active: true,
    version: 1
  },
  {
    id: 'oily-004',
    name: 'oily_niacinamide_bonus',
    description: 'Bonus for niacinamide for oily skin (sebum regulation)',
    rule_type: 'bonus',
    priority: 28,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'oily' },
        { type: 'ingredient_tag', tag: 'sebum_regulating', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 10
    },
    explanation_template: 'Contains {ingredient_name} which helps regulate oil production.',
    short_explanation: 'Controls oil',
    icon: 'sparkles',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RULES - DRY SKIN
// Priority 41-60
// ─────────────────────────────────────────────────────────────────────────────

export const DRY_SKIN_RULES: ScoringRule[] = [
  {
    id: 'dry-001',
    name: 'dry_occlusive_bonus',
    description: 'Bonus for occlusives for dry skin',
    rule_type: 'bonus',
    priority: 45,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'dry' },
        {
          operator: 'OR',
          conditions: [
            { type: 'ingredient_tag', tag: 'occlusive_heavy', operator: 'eq', value: true },
            { type: 'ingredient_tag', tag: 'occlusive_light', operator: 'eq', value: true }
          ]
        },
        { type: 'ingredient_position', position_max: 10, operator: 'lte', value: 10 }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 12,
      max_instances: 2
    },
    explanation_template: 'Contains {ingredient_name} which helps seal in moisture - excellent for dry skin.',
    short_explanation: 'Locks in moisture',
    icon: 'shield',
    is_active: true,
    version: 1
  },
  {
    id: 'dry-002',
    name: 'dry_ceramides_bonus',
    description: 'Bonus for ceramides/barrier support for dry skin',
    rule_type: 'bonus',
    priority: 42,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'dry' },
        { type: 'ingredient_tag', tag: 'barrier_supportive', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 15
    },
    explanation_template: 'Contains {ingredient_name} which strengthens the skin barrier - great for dry skin.',
    short_explanation: 'Barrier support',
    icon: 'shield-checkmark',
    is_active: true,
    version: 1
  },
  {
    id: 'dry-003',
    name: 'dry_humectant_bonus',
    description: 'Bonus for humectants for dry skin',
    rule_type: 'bonus',
    priority: 48,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'dry' },
        { type: 'ingredient_tag', tag: 'humectant', operator: 'eq', value: true },
        { type: 'ingredient_position', position_max: 8, operator: 'lte', value: 8 }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 10,
      max_instances: 2
    },
    explanation_template: 'Contains {ingredient_name}, a humectant that draws moisture into skin.',
    short_explanation: 'Attracts moisture',
    icon: 'water',
    is_active: true,
    version: 1
  },
  {
    id: 'dry-004',
    name: 'dry_drying_alcohol_penalty',
    description: 'Penalize drying alcohols for dry skin',
    rule_type: 'scoring',
    priority: 43,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'dry' },
        { type: 'ingredient_tag', tag: 'drying', operator: 'gte', value: 'medium' },
        { type: 'ingredient_position', position_max: 10, operator: 'lte', value: 10 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -15,
      max_penalty_per_product: -25,
      caution_flag: {
        type: 'drying',
        severity: 'warning',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name} which can be drying. May worsen dryness.',
    short_explanation: 'May be drying',
    icon: 'alert',
    is_active: true,
    version: 1
  },
  {
    id: 'dry-005',
    name: 'dry_harsh_surfactant_penalty',
    description: 'Penalize harsh surfactants for dry skin',
    rule_type: 'scoring',
    priority: 44,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'dry' },
        { type: 'ingredient_tag', tag: 'surfactant_harsh', operator: 'eq', value: true },
        { type: 'product_category', category: 'cleanser', operator: 'eq', value: 'cleanser' }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -18,
      caution_flag: {
        type: 'stripping',
        severity: 'warning',
        confidence: 'high'
      }
    },
    explanation_template: 'Contains {ingredient_name}, a harsh surfactant that may strip natural oils from dry skin.',
    short_explanation: 'May strip skin',
    icon: 'warning',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RULES - ACNE-PRONE SKIN
// Priority 61-80
// ─────────────────────────────────────────────────────────────────────────────

export const ACNE_PRONE_RULES: ScoringRule[] = [
  {
    id: 'acne-001',
    name: 'acne_high_comedogenic_penalty',
    description: 'Strong penalty for high comedogenic ingredients for acne-prone skin',
    rule_type: 'scoring',
    priority: 62,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_concern', concern: 'acne', min_severity: 2, operator: 'gte', value: 2 },
        { type: 'ingredient_tag', tag: 'comedogenic_risk', operator: 'gte', value: 'high' },
        { type: 'ingredient_position', position_max: 15, operator: 'lte', value: 15 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -20,
      max_penalty_per_product: -40,
      max_instances: 3,
      caution_flag: {
        type: 'clog_risk',
        severity: 'warning',
        confidence: 'high'
      }
    },
    explanation_template: 'Contains {ingredient_name} which is known to clog pores. May trigger breakouts.',
    short_explanation: 'Pore-clogging',
    icon: 'close-circle',
    is_active: true,
    version: 1
  },
  {
    id: 'acne-002',
    name: 'acne_bha_bonus',
    description: 'Bonus for BHA/salicylic acid for acne-prone skin',
    rule_type: 'bonus',
    priority: 65,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_concern', concern: 'acne', operator: 'exists', value: true },
        { type: 'ingredient_tag', tag: 'anti_acne', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 12
    },
    explanation_template: 'Contains {ingredient_name} which helps fight acne and clear pores.',
    short_explanation: 'Fights acne',
    icon: 'checkmark-circle',
    is_active: true,
    version: 1
  },
  {
    id: 'acne-003',
    name: 'acne_heavy_oil_penalty',
    description: 'Penalize heavy oils for acne-prone skin',
    rule_type: 'scoring',
    priority: 68,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_concern', concern: 'acne', min_severity: 3, operator: 'gte', value: 3 },
        { type: 'ingredient_tag', tag: 'emollient_heavy', operator: 'eq', value: true },
        { type: 'ingredient_position', position_max: 8, operator: 'lte', value: 8 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -10,
      max_penalty_per_product: -20,
      caution_flag: {
        type: 'heaviness',
        severity: 'info',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name}, a heavy emollient that may be too rich for acne-prone skin.',
    short_explanation: 'May be too heavy',
    icon: 'information-circle',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RULES - SENSITIVE SKIN
// Priority 81-100
// ─────────────────────────────────────────────────────────────────────────────

export const SENSITIVE_SKIN_RULES: ScoringRule[] = [
  {
    id: 'sens-001',
    name: 'sensitive_fragrance_penalty',
    description: 'Penalize fragrance for sensitive skin',
    rule_type: 'scoring',
    priority: 82,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'ingredient_tag', tag: 'fragrance', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -15,
      caution_flag: {
        type: 'fragrance',
        severity: 'warning',
        confidence: 'high'
      }
    },
    explanation_template: 'Contains fragrance ({ingredient_name}) which may irritate sensitive skin.',
    short_explanation: 'Contains fragrance',
    icon: 'flower',
    is_active: true,
    version: 1
  },
  {
    id: 'sens-002',
    name: 'sensitive_essential_oil_penalty',
    description: 'Penalize essential oils for sensitive skin',
    rule_type: 'scoring',
    priority: 83,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'ingredient_tag', tag: 'essential_oil', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -12,
      max_penalty_per_product: -20,
      caution_flag: {
        type: 'essential_oil',
        severity: 'warning',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name}, an essential oil that may cause sensitivity.',
    short_explanation: 'Essential oil',
    icon: 'leaf',
    is_active: true,
    version: 1
  },
  {
    id: 'sens-003',
    name: 'sensitive_irritant_penalty',
    description: 'Penalize known irritants for sensitive skin',
    rule_type: 'scoring',
    priority: 81,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'ingredient_tag', tag: 'irritant_potential', operator: 'gte', value: 'medium' },
        { type: 'ingredient_position', position_max: 15, operator: 'lte', value: 15 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -12,
      max_penalty_per_product: -30,
      caution_flag: {
        type: 'irritation',
        severity: 'warning',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name} which has irritation potential. May not be suitable for sensitive skin.',
    short_explanation: 'May irritate',
    icon: 'alert',
    is_active: true,
    version: 1
  },
  {
    id: 'sens-004',
    name: 'sensitive_soothing_bonus',
    description: 'Bonus for soothing ingredients for sensitive skin',
    rule_type: 'bonus',
    priority: 88,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'ingredient_tag', tag: 'soothing', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 10
    },
    explanation_template: 'Contains {ingredient_name} which helps calm and soothe sensitive skin.',
    short_explanation: 'Calming',
    icon: 'heart',
    is_active: true,
    version: 1
  },
  {
    id: 'sens-005',
    name: 'sensitive_barrier_bonus',
    description: 'Bonus for barrier-supportive ingredients for sensitive skin',
    rule_type: 'bonus',
    priority: 85,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'sensitive' },
        { type: 'ingredient_tag', tag: 'barrier_supportive', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 12
    },
    explanation_template: 'Contains {ingredient_name} which helps strengthen and protect the skin barrier.',
    short_explanation: 'Barrier support',
    icon: 'shield',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RULES - COMBINATION SKIN
// Priority 101-120
// ─────────────────────────────────────────────────────────────────────────────

export const COMBINATION_SKIN_RULES: ScoringRule[] = [
  {
    id: 'combo-001',
    name: 'combo_heavy_occlusive_mild_penalty',
    description: 'Mild penalty for heavy occlusives for combination skin',
    rule_type: 'scoring',
    priority: 105,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'combination' },
        { type: 'ingredient_tag', tag: 'occlusive_heavy', operator: 'eq', value: true },
        { type: 'ingredient_position', position_max: 5, operator: 'lte', value: 5 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -8,
      max_penalty_per_product: -15,
      caution_flag: {
        type: 'heaviness',
        severity: 'info',
        confidence: 'low'
      }
    },
    explanation_template: 'Contains {ingredient_name}. May feel heavy on oily areas of combination skin.',
    short_explanation: 'May feel heavy',
    icon: 'information',
    is_active: true,
    version: 1
  },
  {
    id: 'combo-002',
    name: 'combo_balancing_bonus',
    description: 'Bonus for balancing ingredients for combination skin',
    rule_type: 'bonus',
    priority: 108,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'combination' },
        {
          operator: 'OR',
          conditions: [
            { type: 'ingredient_tag', tag: 'sebum_regulating', operator: 'eq', value: true },
            { type: 'ingredient_tag', tag: 'humectant', operator: 'eq', value: true }
          ]
        }
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 8
    },
    explanation_template: 'Contains {ingredient_name} which helps balance combination skin.',
    short_explanation: 'Balancing',
    icon: 'sync',
    is_active: true,
    version: 1
  },
  {
    id: 'combo-003',
    name: 'combo_moderate_comedogenic_penalty',
    description: 'Moderate penalty for comedogenic ingredients for combination skin',
    rule_type: 'scoring',
    priority: 103,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'skin_type', operator: 'eq', value: 'combination' },
        { type: 'ingredient_tag', tag: 'comedogenic_risk', operator: 'gte', value: 'high' },
        { type: 'ingredient_position', position_max: 10, operator: 'lte', value: 10 }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -10,
      max_penalty_per_product: -20,
      caution_flag: {
        type: 'clog_risk',
        severity: 'info',
        confidence: 'medium'
      }
    },
    explanation_template: 'Contains {ingredient_name} which may clog pores in oily areas.',
    short_explanation: 'Watch oily zones',
    icon: 'eye',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL RULES (Apply to all users)
// Priority 200+
// ─────────────────────────────────────────────────────────────────────────────

export const UNIVERSAL_RULES: ScoringRule[] = [
  {
    id: 'univ-001',
    name: 'fragrance_free_preference_penalty',
    description: 'Penalize fragrance when user prefers fragrance-free',
    rule_type: 'scoring',
    priority: 200,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'user_trait', trait: 'prefers_fragrance_free', operator: 'eq', value: true },
        { type: 'ingredient_tag', tag: 'fragrance', operator: 'eq', value: true }
      ]
    },
    actions: {
      action: 'penalty',
      score_delta: -10,
      caution_flag: {
        type: 'fragrance',
        severity: 'info',
        confidence: 'high'
      }
    },
    explanation_template: 'Contains fragrance, but you prefer fragrance-free products.',
    short_explanation: 'Has fragrance',
    icon: 'flower',
    is_active: true,
    version: 1
  },
  {
    id: 'univ-002',
    name: 'high_safety_score_bonus',
    description: 'Bonus for products with excellent ingredient safety',
    rule_type: 'bonus',
    priority: 220,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'ingredient_count', count_max: 2, operator: 'lte', value: 2 } // Placeholder: actual check is on product safety score
      ]
    },
    actions: {
      action: 'bonus',
      score_delta: 8
    },
    explanation_template: 'Excellent overall ingredient safety profile.',
    short_explanation: 'Safe ingredients',
    icon: 'checkmark-shield',
    is_active: true,
    version: 1
  },
  {
    id: 'univ-003',
    name: 'unknown_ingredient_caution',
    description: 'Flag when product has unknown ingredients',
    rule_type: 'caution_flag',
    priority: 250,
    conditions: {
      operator: 'AND',
      conditions: [
        { type: 'ingredient_count', count_min: 3, operator: 'gte', value: 3 } // Placeholder for unknown count
      ]
    },
    actions: {
      action: 'flag',
      caution_flag: {
        type: 'incomplete_data',
        severity: 'info',
        confidence: 'high',
        message: 'Some ingredients could not be analyzed'
      }
    },
    explanation_template: 'We couldn\'t analyze {unknown_count} ingredients. Our assessment may be incomplete.',
    short_explanation: 'Incomplete analysis',
    icon: 'help-circle',
    is_active: true,
    version: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL RULES
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_DEFAULT_RULES: ScoringRule[] = [
  ...HARD_FILTER_RULES,
  ...OILY_SKIN_RULES,
  ...DRY_SKIN_RULES,
  ...ACNE_PRONE_RULES,
  ...SENSITIVE_SKIN_RULES,
  ...COMBINATION_SKIN_RULES,
  ...UNIVERSAL_RULES
];

// Sorted by priority for execution
export const RULES_BY_PRIORITY = [...ALL_DEFAULT_RULES].sort((a, b) => a.priority - b.priority);
