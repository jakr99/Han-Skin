// ============================================================================
// HAN-SKIN SCORING ENGINE
// Filter → Score → Explain Pipeline
// ============================================================================

import {
  ScoringRule,
  RuleCondition,
  CompoundCondition,
  RuleAction,
  CautionFlag,
  ScaleValue,
} from '../rules/schema';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  skin_type: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';
  concerns: { type: string; severity: number }[];
  sensitivities: { type: string; confirmed: boolean }[];
  hard_blocks: { ingredient_id?: string; pattern?: string }[];
  preferences: {
    fragrance_free: boolean;
    vegan: boolean;
    cruelty_free: boolean;
  };
  weight_adjustments: Map<string, number>; // tag_type -> weight delta
}

export interface ProductIngredient {
  ingredient_id: string;
  name: string;
  position: number;
  concentration_tier: 'high' | 'medium' | 'low' | 'trace';
  tags: Map<string, { value: ScaleValue | boolean; confidence: number }>;
  is_unknown: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: ProductIngredient[];
  base_safety_score: number;
  unknown_ingredient_count: number;
}

export interface FiredRule {
  rule_id: string;
  rule_name: string;
  action: RuleAction['action'];
  score_delta: number;
  ingredient_name?: string;
  ingredient_position?: number;
  explanation: string;
  short_explanation: string;
}

export interface ScoringResult {
  product_id: string;

  // Did it pass hard filters?
  is_blocked: boolean;
  block_reason?: string;

  // Match score (0-100)
  match_score: number;
  match_label: 'Excellent Match' | 'Great Match' | 'Good Match' | 'Fair Match' | 'Poor Match' | 'Not Recommended';
  match_color: string;

  // Confidence in our assessment
  confidence: number; // 0-1
  confidence_label: 'High' | 'Medium' | 'Low';

  // Caution flags
  caution_flags: CautionFlag[];

  // Explanations
  positive_reasons: string[];
  negative_reasons: string[];

  // Audit trail
  rules_fired: FiredRule[];

  // Timing
  computed_at: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE VALUE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const SCALE_ORDER: ScaleValue[] = ['none', 'low', 'medium', 'high', 'very_high'];

function scaleToNumber(scale: ScaleValue): number {
  return SCALE_ORDER.indexOf(scale);
}

function compareScale(actual: ScaleValue, operator: string, threshold: ScaleValue): boolean {
  const actualNum = scaleToNumber(actual);
  const thresholdNum = scaleToNumber(threshold);

  switch (operator) {
    case 'eq': return actualNum === thresholdNum;
    case 'neq': return actualNum !== thresholdNum;
    case 'gte': return actualNum >= thresholdNum;
    case 'lte': return actualNum <= thresholdNum;
    case 'gt': return actualNum > thresholdNum;
    case 'lt': return actualNum < thresholdNum;
    default: return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONDITION EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

interface EvaluationContext {
  user: UserProfile;
  product: Product;
  currentIngredient?: ProductIngredient;
}

function evaluateCondition(condition: RuleCondition, ctx: EvaluationContext): boolean {
  switch (condition.type) {
    case 'user_trait':
      return evaluateUserTrait(condition, ctx.user);

    case 'user_concern':
      return evaluateUserConcern(condition, ctx.user);

    case 'user_sensitivity':
      return evaluateUserSensitivity(condition, ctx.user);

    case 'ingredient_tag':
      return evaluateIngredientTag(condition, ctx.currentIngredient);

    case 'product_category':
      return evaluateProductCategory(condition, ctx.product);

    case 'ingredient_position':
      return evaluateIngredientPosition(condition, ctx.currentIngredient);

    case 'ingredient_count':
      return evaluateIngredientCount(condition, ctx.product);

    default:
      console.warn(`Unknown condition type: ${(condition as any).type}`);
      return false;
  }
}

function evaluateUserTrait(condition: RuleCondition, user: UserProfile): boolean {
  const trait = condition.trait;
  if (!trait) return false;

  let actualValue: any;
  switch (trait) {
    case 'skin_type':
      actualValue = user.skin_type;
      break;
    case 'prefers_fragrance_free':
      actualValue = user.preferences.fragrance_free;
      break;
    case 'prefers_vegan':
      actualValue = user.preferences.vegan;
      break;
    default:
      return false;
  }

  return compareValues(actualValue, condition.operator, condition.value);
}

function evaluateUserConcern(condition: RuleCondition, user: UserProfile): boolean {
  const concern = user.concerns.find(c => c.type === condition.concern);

  if (condition.operator === 'exists') {
    return concern !== undefined;
  }

  if (!concern) return false;

  if (condition.min_severity) {
    return concern.severity >= condition.min_severity;
  }

  return compareValues(concern.severity, condition.operator, condition.value);
}

function evaluateUserSensitivity(condition: RuleCondition, user: UserProfile): boolean {
  if (condition.sensitivity === 'any') {
    return user.sensitivities.length > 0;
  }

  const sensitivity = user.sensitivities.find(s => s.type === condition.sensitivity);

  if (condition.operator === 'exists') {
    return sensitivity !== undefined;
  }

  return sensitivity !== undefined;
}

function evaluateIngredientTag(
  condition: RuleCondition,
  ingredient?: ProductIngredient
): boolean {
  if (!ingredient || !condition.tag) return false;

  const tag = ingredient.tags.get(condition.tag);
  if (!tag) {
    // Tag doesn't exist on this ingredient
    return condition.operator === 'not_exists';
  }

  if (condition.operator === 'exists') {
    return true;
  }

  // Handle boolean tags
  if (typeof tag.value === 'boolean') {
    return compareValues(tag.value, condition.operator, condition.value);
  }

  // Handle scale tags
  return compareScale(tag.value as ScaleValue, condition.operator, condition.value as ScaleValue);
}

function evaluateProductCategory(condition: RuleCondition, product: Product): boolean {
  const categories = Array.isArray(condition.value) ? condition.value : [condition.value];

  switch (condition.operator) {
    case 'eq':
    case 'in':
      return categories.includes(product.category);
    case 'neq':
    case 'not_in':
      return !categories.includes(product.category);
    default:
      return false;
  }
}

function evaluateIngredientPosition(
  condition: RuleCondition,
  ingredient?: ProductIngredient
): boolean {
  if (!ingredient) return false;

  const position = ingredient.position;
  const maxPosition = condition.position_max || (condition.value as number);

  switch (condition.operator) {
    case 'lte':
      return position <= maxPosition;
    case 'lt':
      return position < maxPosition;
    case 'gte':
      return position >= maxPosition;
    case 'gt':
      return position > maxPosition;
    case 'eq':
      return position === maxPosition;
    default:
      return false;
  }
}

function evaluateIngredientCount(condition: RuleCondition, product: Product): boolean {
  const count = product.unknown_ingredient_count;

  if (condition.count_min !== undefined && count < condition.count_min) return false;
  if (condition.count_max !== undefined && count > condition.count_max) return false;

  return true;
}

function compareValues(actual: any, operator: string, expected: any): boolean {
  switch (operator) {
    case 'eq':
      return actual === expected;
    case 'neq':
      return actual !== expected;
    case 'in':
      return Array.isArray(expected) && expected.includes(actual);
    case 'not_in':
      return Array.isArray(expected) && !expected.includes(actual);
    case 'contains':
      return typeof actual === 'string' && actual.includes(expected);
    case 'gte':
      return actual >= expected;
    case 'lte':
      return actual <= expected;
    case 'gt':
      return actual > expected;
    case 'lt':
      return actual < expected;
    case 'exists':
      return actual !== undefined && actual !== null;
    case 'not_exists':
      return actual === undefined || actual === null;
    default:
      return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOUND CONDITION EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

function evaluateCompoundCondition(
  compound: CompoundCondition,
  ctx: EvaluationContext
): boolean {
  const results = compound.conditions.map(cond => {
    if ('operator' in cond && 'conditions' in cond) {
      // Nested compound condition
      return evaluateCompoundCondition(cond as CompoundCondition, ctx);
    } else {
      // Simple condition
      return evaluateCondition(cond as RuleCondition, ctx);
    }
  });

  if (compound.operator === 'AND') {
    return results.every(r => r);
  } else {
    return results.some(r => r);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export class SkinMatchEngine {
  private rules: ScoringRule[];

  constructor(rules: ScoringRule[]) {
    // Sort by priority (lower = first)
    this.rules = [...rules].sort((a, b) => a.priority - b.priority);
  }

  /**
   * Main entry point: Score a product for a user
   */
  scoreProduct(user: UserProfile, product: Product): ScoringResult {
    const startTime = Date.now();

    // Initialize result
    const result: ScoringResult = {
      product_id: product.id,
      is_blocked: false,
      match_score: 50, // Start at neutral
      match_label: 'Good Match',
      match_color: '#FBBF24',
      confidence: 1.0,
      confidence_label: 'High',
      caution_flags: [],
      positive_reasons: [],
      negative_reasons: [],
      rules_fired: [],
      computed_at: new Date(),
    };

    // Track penalties per rule for capping
    const penaltiesByRule = new Map<string, number>();
    const instancesByRule = new Map<string, number>();

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1: Check hard blocks (user's allergens)
    // ─────────────────────────────────────────────────────────────────────────
    for (const block of user.hard_blocks) {
      for (const ingredient of product.ingredients) {
        let matches = false;

        if (block.ingredient_id && ingredient.ingredient_id === block.ingredient_id) {
          matches = true;
        }

        if (block.pattern) {
          const regex = new RegExp(block.pattern.replace(/%/g, '.*'), 'i');
          if (regex.test(ingredient.name)) {
            matches = true;
          }
        }

        if (matches) {
          result.is_blocked = true;
          result.block_reason = 'allergen';
          result.match_score = 0;
          result.match_label = 'Not Recommended';
          result.match_color = '#EF4444';
          result.caution_flags.push({
            type: 'allergen',
            severity: 'critical',
            confidence: 'high',
            message: `Contains ${ingredient.name} which you've marked as an allergen`,
          });
          result.negative_reasons.push(
            `Contains ${ingredient.name}, an ingredient you need to avoid`
          );
          return result; // Stop processing
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 2: Evaluate rules for each ingredient
    // ─────────────────────────────────────────────────────────────────────────
    for (const ingredient of product.ingredients) {
      const ctx: EvaluationContext = {
        user,
        product,
        currentIngredient: ingredient,
      };

      for (const rule of this.rules) {
        if (!rule.is_active) continue;

        // Check if rule conditions are met
        const matches = evaluateCompoundCondition(rule.conditions, ctx);
        if (!matches) continue;

        // Rule fired! Process actions
        const firedRule = this.processRuleAction(
          rule,
          ingredient,
          result,
          penaltiesByRule,
          instancesByRule,
          user
        );

        if (firedRule) {
          result.rules_fired.push(firedRule);

          // Handle blocking
          if (rule.rule_type === 'hard_filter' && rule.actions.action === 'block') {
            result.is_blocked = true;
            result.block_reason = rule.actions.block_reason || 'rule_blocked';
            result.match_score = 0;
            result.match_label = 'Not Recommended';
            result.match_color = '#EF4444';
            return result; // Stop processing
          }
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3: Evaluate product-level rules (no ingredient context)
    // ─────────────────────────────────────────────────────────────────────────
    const productCtx: EvaluationContext = { user, product };

    for (const rule of this.rules) {
      if (!rule.is_active) continue;

      // Skip ingredient-specific rules
      const hasIngredientCondition = this.hasIngredientCondition(rule.conditions);
      if (hasIngredientCondition) continue;

      const matches = evaluateCompoundCondition(rule.conditions, productCtx);
      if (!matches) continue;

      const firedRule = this.processRuleAction(
        rule,
        undefined,
        result,
        penaltiesByRule,
        instancesByRule,
        user
      );

      if (firedRule) {
        result.rules_fired.push(firedRule);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 4: Adjust confidence based on unknown ingredients
    // ─────────────────────────────────────────────────────────────────────────
    const unknownRatio = product.unknown_ingredient_count / product.ingredients.length;
    if (unknownRatio > 0.3) {
      result.confidence = 0.5;
      result.confidence_label = 'Low';
      result.caution_flags.push({
        type: 'incomplete_data',
        severity: 'info',
        confidence: 'high',
        message: `${product.unknown_ingredient_count} ingredients could not be analyzed`,
      });
    } else if (unknownRatio > 0.1) {
      result.confidence = 0.7;
      result.confidence_label = 'Medium';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 5: Clamp score and determine label
    // ─────────────────────────────────────────────────────────────────────────
    result.match_score = Math.max(0, Math.min(100, result.match_score));

    if (result.match_score >= 85) {
      result.match_label = 'Excellent Match';
      result.match_color = '#10B981';
    } else if (result.match_score >= 70) {
      result.match_label = 'Great Match';
      result.match_color = '#34D399';
    } else if (result.match_score >= 55) {
      result.match_label = 'Good Match';
      result.match_color = '#FBBF24';
    } else if (result.match_score >= 40) {
      result.match_label = 'Fair Match';
      result.match_color = '#F97316';
    } else {
      result.match_label = 'Poor Match';
      result.match_color = '#EF4444';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 6: Deduplicate and limit explanations
    // ─────────────────────────────────────────────────────────────────────────
    result.positive_reasons = [...new Set(result.positive_reasons)].slice(0, 4);
    result.negative_reasons = [...new Set(result.negative_reasons)].slice(0, 3);

    return result;
  }

  /**
   * Process a rule's action and update result
   */
  private processRuleAction(
    rule: ScoringRule,
    ingredient: ProductIngredient | undefined,
    result: ScoringResult,
    penaltiesByRule: Map<string, number>,
    instancesByRule: Map<string, number>,
    user: UserProfile
  ): FiredRule | null {
    const action = rule.actions;

    // Check instance cap
    const instanceCount = instancesByRule.get(rule.id) || 0;
    if (action.max_instances && instanceCount >= action.max_instances) {
      return null;
    }

    // Check penalty cap
    const currentPenalty = penaltiesByRule.get(rule.id) || 0;
    if (action.max_penalty_per_product && currentPenalty <= action.max_penalty_per_product) {
      return null; // Already at max penalty
    }

    // Calculate score delta (with user weight adjustments)
    let scoreDelta = action.score_delta || 0;

    // Apply user-specific weight adjustments
    // (In real implementation, this would look up by tag type)

    // Apply cap
    if (action.max_penalty_per_product && scoreDelta < 0) {
      const newTotal = currentPenalty + scoreDelta;
      if (newTotal < action.max_penalty_per_product) {
        scoreDelta = action.max_penalty_per_product - currentPenalty;
      }
    }

    // Update score
    result.match_score += scoreDelta;

    // Track penalties
    if (scoreDelta < 0) {
      penaltiesByRule.set(rule.id, currentPenalty + scoreDelta);
    }
    instancesByRule.set(rule.id, instanceCount + 1);

    // Add caution flag
    if (action.caution_flag) {
      // Check if we already have this flag type
      const existingFlag = result.caution_flags.find(f => f.type === action.caution_flag!.type);
      if (!existingFlag) {
        result.caution_flags.push({
          ...action.caution_flag,
          message: action.caution_flag.message || rule.short_explanation,
        });
      }
    }

    // Generate explanation
    const explanation = this.interpolateTemplate(
      rule.explanation_template,
      ingredient?.name || 'an ingredient'
    );

    // Add to reasons
    if (scoreDelta > 0) {
      result.positive_reasons.push(explanation);
    } else if (scoreDelta < 0) {
      result.negative_reasons.push(explanation);
    }

    return {
      rule_id: rule.id,
      rule_name: rule.name,
      action: action.action,
      score_delta: scoreDelta,
      ingredient_name: ingredient?.name,
      ingredient_position: ingredient?.position,
      explanation,
      short_explanation: rule.short_explanation,
    };
  }

  /**
   * Check if a compound condition has ingredient-specific conditions
   */
  private hasIngredientCondition(compound: CompoundCondition): boolean {
    for (const cond of compound.conditions) {
      if ('operator' in cond && 'conditions' in cond) {
        if (this.hasIngredientCondition(cond as CompoundCondition)) return true;
      } else {
        const simple = cond as RuleCondition;
        if (simple.type === 'ingredient_tag' || simple.type === 'ingredient_position') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Interpolate template with ingredient name
   */
  private interpolateTemplate(template: string, ingredientName: string): string {
    return template
      .replace('{ingredient_name}', ingredientName)
      .replace('{unknown_count}', '?');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK PROCESSOR
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedbackEvent {
  user_id: string;
  product_id: string;
  feedback_type: 'too_greasy' | 'too_drying' | 'irritation' | 'breakout' | 'loved_it' | 'good_results';
  intensity: number; // 1-5
}

export interface WeightAdjustment {
  tag_type: string;
  delta: number;
  reason: string;
}

/**
 * Process user feedback to adjust their personal weights
 */
export function processUserFeedback(
  feedback: FeedbackEvent,
  productIngredients: ProductIngredient[]
): WeightAdjustment[] {
  const adjustments: WeightAdjustment[] = [];

  // Define which tags to adjust based on feedback type
  const TAG_ADJUSTMENTS: Record<string, { tags: string[]; direction: number }> = {
    'too_greasy': {
      tags: ['occlusive_heavy', 'emollient_heavy'],
      direction: -1, // Increase penalty
    },
    'too_drying': {
      tags: ['drying', 'astringent', 'surfactant_harsh'],
      direction: -1,
    },
    'irritation': {
      tags: ['irritant_potential', 'fragrance', 'essential_oil'],
      direction: -1,
    },
    'breakout': {
      tags: ['comedogenic_risk', 'occlusive_heavy'],
      direction: -1,
    },
    'loved_it': {
      tags: [], // Will boost all positive tags in product
      direction: 1,
    },
    'good_results': {
      tags: [],
      direction: 1,
    },
  };

  const adjustment = TAG_ADJUSTMENTS[feedback.feedback_type];
  if (!adjustment) return [];

  // Calculate delta based on intensity (1-5 -> 0.1-0.5)
  const baseDelta = (feedback.intensity / 10) * adjustment.direction;

  // Find relevant ingredients that have these tags
  for (const ingredient of productIngredients) {
    for (const tagType of adjustment.tags) {
      if (ingredient.tags.has(tagType)) {
        // Higher weight for ingredients higher in the list
        const positionMultiplier = ingredient.position <= 5 ? 1.5 : 1.0;

        adjustments.push({
          tag_type: tagType,
          delta: baseDelta * positionMultiplier,
          reason: `${feedback.feedback_type} feedback on product containing ${ingredient.name}`,
        });
      }
    }
  }

  return adjustments;
}

// ─────────────────────────────────────────────────────────────────────────────
// INCI PARSER (Simplified)
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedIngredient {
  raw_name: string;
  normalized_name: string;
  position: number;
  concentration_tier: 'high' | 'medium' | 'low' | 'trace';
}

/**
 * Parse an INCI list string into individual ingredients
 */
export function parseInciList(inciText: string): ParsedIngredient[] {
  if (!inciText) return [];

  const ingredients: ParsedIngredient[] = [];

  // Split by comma, handling parentheses
  const parts = inciText
    .replace(/\s+/g, ' ')
    .split(/,(?![^()]*\))/) // Don't split inside parentheses
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (let i = 0; i < parts.length; i++) {
    const raw = parts[i];
    const normalized = raw
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim();

    // Determine concentration tier based on position
    let tier: ParsedIngredient['concentration_tier'];
    if (i < 5) {
      tier = 'high';
    } else if (i < 15) {
      tier = 'medium';
    } else {
      tier = 'low';
    }

    // Check for "may contain" or common trace indicators
    if (raw.toLowerCase().includes('may contain') ||
        raw.toLowerCase().includes('ci ') ||
        i > 25) {
      tier = 'trace';
    }

    ingredients.push({
      raw_name: raw,
      normalized_name: normalized,
      position: i + 1,
      concentration_tier: tier,
    });
  }

  return ingredients;
}
