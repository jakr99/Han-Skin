// ============================================================================
// HAN-SKIN RULES ENGINE - TYPE DEFINITIONS & JSON SCHEMA
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// CONDITION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ConditionOperator = 'eq' | 'neq' | 'in' | 'not_in' | 'contains' | 'gte' | 'lte' | 'gt' | 'lt' | 'exists' | 'not_exists';
export type LogicalOperator = 'AND' | 'OR';
export type ScaleValue = 'none' | 'low' | 'medium' | 'high' | 'very_high';

// Individual condition
export interface RuleCondition {
  type: 'user_trait' | 'user_concern' | 'user_sensitivity' | 'ingredient_tag' | 'product_category' | 'ingredient_position' | 'ingredient_count';

  // For user_trait conditions
  trait?: 'skin_type' | 'climate' | 'age_range' | 'prefers_fragrance_free' | 'prefers_vegan';

  // For user_concern conditions
  concern?: string;
  min_severity?: number;

  // For user_sensitivity conditions
  sensitivity?: string;

  // For ingredient_tag conditions
  tag?: string;
  tag_value?: ScaleValue | boolean;

  // For product_category conditions
  category?: string | string[];

  // For ingredient_position conditions
  position_max?: number; // ingredient must be in top N positions

  // For ingredient_count conditions
  count_min?: number;
  count_max?: number;

  // The comparison operator
  operator: ConditionOperator;

  // The value to compare against
  value: string | number | boolean | string[];
}

// Compound condition (AND/OR of multiple conditions)
export interface CompoundCondition {
  operator: LogicalOperator;
  conditions: (RuleCondition | CompoundCondition)[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type RuleActionType = 'block' | 'penalty' | 'bonus' | 'flag';
export type CautionSeverity = 'info' | 'warning' | 'critical';
export type CautionConfidence = 'low' | 'medium' | 'high';

export interface CautionFlag {
  type: string; // e.g., 'clog_risk', 'irritation', 'fragrance', 'allergen'
  severity: CautionSeverity;
  confidence: CautionConfidence;
  message?: string;
}

export interface RuleAction {
  action: RuleActionType;

  // For penalty/bonus actions
  score_delta?: number; // Points to add/subtract (negative for penalties)

  // Caps to prevent runaway penalties
  max_penalty_per_product?: number; // Max total penalty from this rule type
  max_instances?: number; // Max times this rule can fire per product

  // For flag actions
  caution_flag?: CautionFlag;

  // For block actions
  block_reason?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE RULE TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type RuleType = 'hard_filter' | 'scoring' | 'bonus' | 'caution_flag';

export interface ScoringRule {
  id: string;
  name: string;
  description: string;

  rule_type: RuleType;
  priority: number; // Lower = evaluated first

  // The logic
  conditions: CompoundCondition;
  actions: RuleAction;

  // Human-readable explanations
  explanation_template: string; // With {placeholders}
  short_explanation: string;

  // UI hints
  icon?: string;

  // Status
  is_active: boolean;
  version: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON SCHEMA (for validation)
// ─────────────────────────────────────────────────────────────────────────────

export const RULES_JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HanSkin Scoring Rule",
  "type": "object",
  "required": ["id", "name", "rule_type", "priority", "conditions", "actions", "explanation_template", "short_explanation", "is_active", "version"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "description": { "type": "string", "maxLength": 500 },
    "rule_type": { "type": "string", "enum": ["hard_filter", "scoring", "bonus", "caution_flag"] },
    "priority": { "type": "integer", "minimum": 1, "maximum": 1000 },
    "conditions": { "$ref": "#/definitions/compoundCondition" },
    "actions": { "$ref": "#/definitions/ruleAction" },
    "explanation_template": { "type": "string" },
    "short_explanation": { "type": "string", "maxLength": 100 },
    "icon": { "type": "string" },
    "is_active": { "type": "boolean" },
    "version": { "type": "integer", "minimum": 1 }
  },
  "definitions": {
    "conditionOperator": {
      "type": "string",
      "enum": ["eq", "neq", "in", "not_in", "contains", "gte", "lte", "gt", "lt", "exists", "not_exists"]
    },
    "scaleValue": {
      "type": "string",
      "enum": ["none", "low", "medium", "high", "very_high"]
    },
    "ruleCondition": {
      "type": "object",
      "required": ["type", "operator", "value"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["user_trait", "user_concern", "user_sensitivity", "ingredient_tag", "product_category", "ingredient_position", "ingredient_count"]
        },
        "trait": { "type": "string" },
        "concern": { "type": "string" },
        "min_severity": { "type": "integer", "minimum": 1, "maximum": 5 },
        "sensitivity": { "type": "string" },
        "tag": { "type": "string" },
        "tag_value": { "oneOf": [{ "$ref": "#/definitions/scaleValue" }, { "type": "boolean" }] },
        "category": { "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }] },
        "position_max": { "type": "integer", "minimum": 1 },
        "count_min": { "type": "integer", "minimum": 0 },
        "count_max": { "type": "integer", "minimum": 0 },
        "operator": { "$ref": "#/definitions/conditionOperator" },
        "value": { "oneOf": [{ "type": "string" }, { "type": "number" }, { "type": "boolean" }, { "type": "array", "items": { "type": "string" } }] }
      }
    },
    "compoundCondition": {
      "type": "object",
      "required": ["operator", "conditions"],
      "properties": {
        "operator": { "type": "string", "enum": ["AND", "OR"] },
        "conditions": {
          "type": "array",
          "items": {
            "oneOf": [
              { "$ref": "#/definitions/ruleCondition" },
              { "$ref": "#/definitions/compoundCondition" }
            ]
          },
          "minItems": 1
        }
      }
    },
    "cautionFlag": {
      "type": "object",
      "required": ["type", "severity", "confidence"],
      "properties": {
        "type": { "type": "string" },
        "severity": { "type": "string", "enum": ["info", "warning", "critical"] },
        "confidence": { "type": "string", "enum": ["low", "medium", "high"] },
        "message": { "type": "string" }
      }
    },
    "ruleAction": {
      "type": "object",
      "required": ["action"],
      "properties": {
        "action": { "type": "string", "enum": ["block", "penalty", "bonus", "flag"] },
        "score_delta": { "type": "integer", "minimum": -50, "maximum": 50 },
        "max_penalty_per_product": { "type": "integer", "minimum": -100, "maximum": 0 },
        "max_instances": { "type": "integer", "minimum": 1 },
        "caution_flag": { "$ref": "#/definitions/cautionFlag" },
        "block_reason": { "type": "string" }
      }
    }
  }
};
