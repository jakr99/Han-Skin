# Han-Skin Database Architecture & Algorithm Specification

## Table of Contents
1. [ERD Overview](#erd-overview)
2. [Database Schema DDL](#database-schema-ddl)
3. [Rules Engine Schema](#rules-engine-schema)
4. [Scoring Algorithm](#scoring-algorithm)
5. [Implementation Plan](#implementation-plan)

---

## ERD Overview

### Core Domain Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER DOMAIN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌───────────────────┐     ┌──────────────────────┐   │
│  │    users     │────<│ user_skin_profile │     │ user_hard_blocks     │   │
│  │              │     │                   │     │ (allergies/absolutes)│   │
│  │ id (PK)      │     │ skin_type         │     │                      │   │
│  │ email        │     │ climate           │     │ user_id (FK)         │   │
│  │ created_at   │     │ age_range         │     │ ingredient_id (FK)   │   │
│  └──────────────┘     │ routine_frequency │     │ reason               │   │
│         │             └───────────────────┘     └──────────────────────┘   │
│         │                                                                   │
│         │             ┌───────────────────┐     ┌──────────────────────┐   │
│         └────────────<│ user_concerns     │     │ user_weight_adj      │   │
│                       │                   │     │ (personalization)    │   │
│                       │ concern_type      │     │                      │   │
│                       │ severity (1-5)    │     │ tag_id (FK)          │   │
│                       └───────────────────┘     │ weight_delta         │   │
│                                                 │ feedback_count       │   │
│                                                 └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRODUCT DOMAIN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌─────────────────────┐                           │
│  │     products     │────<│ product_ingredients │                           │
│  │                  │     │                     │                           │
│  │ id (PK)          │     │ product_id (FK)     │                           │
│  │ barcode/gtin     │     │ ingredient_id (FK)  │                           │
│  │ brand            │     │ position (1=first)  │                           │
│  │ name             │     │ concentration_est   │                           │
│  │ category         │     └─────────────────────┘                           │
│  │ subcategory      │              │                                        │
│  │ raw_inci_text    │              │                                        │
│  │ verified_at      │              ▼                                        │
│  └──────────────────┘     ┌─────────────────────┐                           │
│                           │    ingredients      │                           │
│                           │                     │                           │
│                           │ id (PK)             │                           │
│                           │ inci_name (unique)  │                           │
│                           │ common_name         │                           │
│                           │ cas_number          │                           │
│                           │ function_primary    │                           │
│                           └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           INGREDIENT TAGS & EVIDENCE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐ │
│  │   tag_types     │────<│  ingredient_tags     │────>│   ingredients    │ │
│  │                 │     │                      │     │                  │ │
│  │ id (PK)         │     │ ingredient_id (FK)   │     └──────────────────┘ │
│  │ name            │     │ tag_type_id (FK)     │                          │
│  │ category        │     │ value (low/med/high) │                          │
│  │ description     │     │ confidence (0-1)     │                          │
│  │ version         │     │ version              │                          │
│  └─────────────────┘     └──────────────────────┘                          │
│                                   │                                         │
│                                   ▼                                         │
│                          ┌──────────────────────┐                          │
│                          │  tag_evidence        │                          │
│                          │                      │                          │
│                          │ ingredient_tag_id    │                          │
│                          │ source_type          │                          │
│                          │ source_name          │                          │
│                          │ citation             │                          │
│                          │ evidence_strength    │                          │
│                          │ year                 │                          │
│                          └──────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RULES ENGINE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                           scoring_rules                               │  │
│  │                                                                       │  │
│  │ id (PK)                                                               │  │
│  │ rule_type (hard_filter | scoring | bonus)                            │  │
│  │ name                                                                  │  │
│  │ description                                                           │  │
│  │ priority (for ordering)                                               │  │
│  │ conditions (JSONB) ──────────────────────────────────────────────┐   │  │
│  │ actions (JSONB) ─────────────────────────────────────────────────┤   │  │
│  │ explanation_template                                              │   │  │
│  │ is_active                                                         │   │  │
│  │ version                                                           │   │  │
│  └───────────────────────────────────────────────────────────────────┘  │  │
│                                                                          │  │
│  Conditions JSON Example:                                                │  │
│  {                                                                       │  │
│    "user_traits": ["skin_type:oily", "concern:acne"],                   │  │
│    "ingredient_tags": ["comedogenic:high"],                             │  │
│    "product_category": ["moisturizer", "sunscreen"]                     │  │
│  }                                                                       │  │
│                                                                          │  │
│  Actions JSON Example:                                                   │  │
│  {                                                                       │  │
│    "action": "block" | "penalty" | "bonus",                             │  │
│    "score_delta": -15,                                                  │  │
│    "caution_flag": "clog_risk",                                         │  │
│    "confidence": "high"                                                 │  │
│  }                                                                       │  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS & FEEDBACK                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐     ┌─────────────────────┐                        │
│  │   user_scans       │     │  user_feedback      │                        │
│  │                    │     │                     │                        │
│  │ user_id (FK)       │     │ user_id (FK)        │                        │
│  │ product_id (FK)    │     │ product_id (FK)     │                        │
│  │ scan_type          │     │ feedback_type       │                        │
│  │ match_score        │     │ (greasy/irritation/ │                        │
│  │ caution_flags      │     │  breakout/dryness/  │                        │
│  │ rules_fired        │     │  loved_it)          │                        │
│  │ created_at         │     │ intensity (1-5)     │                        │
│  └────────────────────┘     │ notes               │                        │
│                             │ usage_duration_days │                        │
│                             │ created_at          │                        │
│                             └─────────────────────┘                        │
│                                                                              │
│  ┌────────────────────┐                                                     │
│  │  user_routine      │                                                     │
│  │                    │                                                     │
│  │ user_id (FK)       │                                                     │
│  │ product_id (FK)    │                                                     │
│  │ step_order         │                                                     │
│  │ time_of_day        │                                                     │
│  │ frequency          │                                                     │
│  └────────────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tag Categories (for ingredient_tags)

| Category | Tag Types |
|----------|-----------|
| **Texture/Weight** | `occlusive_heavy`, `occlusive_light`, `emollient_heavy`, `emollient_light`, `humectant`, `astringent` |
| **Risk Markers** | `comedogenic_risk`, `irritant_potential`, `sensitizer`, `photosensitizing`, `drying` |
| **Benefit Markers** | `barrier_supportive`, `anti_inflammatory`, `antioxidant`, `brightening`, `anti_acne`, `hydrating`, `soothing` |
| **Allergen/Restriction** | `fragrance`, `essential_oil`, `common_allergen`, `eu_restricted`, `pregnancy_caution` |
| **Function** | `surfactant`, `preservative`, `ph_adjuster`, `solvent`, `active`, `film_former` |

---

## Database Schema DDL

See `scripts/schema-v2.sql` for the complete DDL.

---

## Rules Engine Schema

See `lib/rules/schema.ts` for TypeScript types and JSON schema.
See `lib/rules/default-rules.ts` for example rules.

---

## Scoring Algorithm

See `lib/scoring/engine.ts` for the complete implementation.
See `lib/scoring/examples.ts` for example inputs/outputs.

### Algorithm Overview (Pseudocode)

```
FUNCTION scoreProduct(user, product):
    result = {
        match_score: 50,  // Start neutral
        is_blocked: false,
        caution_flags: [],
        rules_fired: []
    }

    // ──────────────────────────────────────────────
    // PHASE 1: Hard Blocks (User Allergens)
    // ──────────────────────────────────────────────
    FOR EACH block IN user.hard_blocks:
        FOR EACH ingredient IN product.ingredients:
            IF ingredient MATCHES block.pattern:
                result.is_blocked = true
                result.block_reason = 'allergen'
                result.match_score = 0
                result.caution_flags.ADD({type: 'allergen', severity: 'critical'})
                RETURN result  // Stop processing

    // ──────────────────────────────────────────────
    // PHASE 2: Evaluate Rules Per Ingredient
    // ──────────────────────────────────────────────
    penalties_by_rule = {}
    instances_by_rule = {}

    FOR EACH ingredient IN product.ingredients:
        FOR EACH rule IN rules SORTED BY priority:
            IF NOT rule.is_active: CONTINUE

            context = {user, product, ingredient}

            IF evaluateConditions(rule.conditions, context):
                // Check caps
                IF rule.max_instances AND instances_by_rule[rule.id] >= max_instances:
                    CONTINUE
                IF rule.max_penalty AND penalties_by_rule[rule.id] <= max_penalty:
                    CONTINUE

                // Apply score delta with user weight adjustments
                delta = rule.actions.score_delta
                IF user.weight_adjustments[rule.related_tag]:
                    delta *= (1 + user.weight_adjustments[rule.related_tag])

                result.match_score += delta

                // Track for caps
                IF delta < 0:
                    penalties_by_rule[rule.id] += delta
                instances_by_rule[rule.id] += 1

                // Add caution flag (deduplicated)
                IF rule.actions.caution_flag:
                    IF NOT result.caution_flags.has(rule.actions.caution_flag.type):
                        result.caution_flags.ADD(rule.actions.caution_flag)

                // Add explanation
                explanation = interpolate(rule.explanation_template, ingredient.name)
                IF delta > 0:
                    result.positive_reasons.ADD(explanation)
                ELSE IF delta < 0:
                    result.negative_reasons.ADD(explanation)

                // Record for audit
                result.rules_fired.ADD({rule_id, rule_name, delta, explanation})

                // Handle hard filter blocks
                IF rule.rule_type == 'hard_filter' AND rule.actions.action == 'block':
                    result.is_blocked = true
                    result.match_score = 0
                    RETURN result

    // ──────────────────────────────────────────────
    // PHASE 3: Confidence Adjustment
    // ──────────────────────────────────────────────
    unknown_ratio = product.unknown_count / product.ingredient_count

    IF unknown_ratio > 0.3:
        result.confidence = 'low'
        result.caution_flags.ADD({type: 'incomplete_data', severity: 'info'})
    ELSE IF unknown_ratio > 0.1:
        result.confidence = 'medium'
    ELSE:
        result.confidence = 'high'

    // ──────────────────────────────────────────────
    // PHASE 4: Finalize Score
    // ──────────────────────────────────────────────
    result.match_score = CLAMP(result.match_score, 0, 100)
    result.match_label = getLabel(result.match_score)
    result.match_color = getColor(result.match_score)

    // Deduplicate and limit explanations
    result.positive_reasons = UNIQUE(result.positive_reasons).SLICE(0, 4)
    result.negative_reasons = UNIQUE(result.negative_reasons).SLICE(0, 3)

    RETURN result

// ──────────────────────────────────────────────
// CONDITION EVALUATION
// ──────────────────────────────────────────────
FUNCTION evaluateConditions(compound, context):
    results = []
    FOR EACH condition IN compound.conditions:
        IF condition IS CompoundCondition:
            results.ADD(evaluateConditions(condition, context))
        ELSE:
            results.ADD(evaluateSingleCondition(condition, context))

    IF compound.operator == 'AND':
        RETURN ALL(results)
    ELSE:
        RETURN ANY(results)

FUNCTION evaluateSingleCondition(condition, context):
    SWITCH condition.type:
        CASE 'user_trait':
            RETURN compare(context.user[condition.trait], condition.operator, condition.value)
        CASE 'user_concern':
            concern = context.user.concerns.find(condition.concern)
            RETURN concern EXISTS AND concern.severity >= condition.min_severity
        CASE 'ingredient_tag':
            tag = context.ingredient.tags[condition.tag]
            RETURN tag EXISTS AND compare(tag.value, condition.operator, condition.value)
        CASE 'ingredient_position':
            RETURN context.ingredient.position <= condition.position_max
        // ... etc
```

---

## Implementation Plan

### Phase 1: Database Foundation (Ship First)

- [ ] **1.1 Run schema-v2.sql in Supabase**
  - Create all tables, indexes, RLS policies
  - Verify with test queries

- [ ] **1.2 Seed Tag Types**
  - Insert all tag_types from schema (already included in SQL)
  - Verify with: `SELECT * FROM tag_types`

- [ ] **1.3 Seed Core Ingredients (Start with ~500)**
  - Focus on most common INCI ingredients
  - Data sources:
    - Paula's Choice ingredient dictionary
    - INCIDecoder
    - CIR (Cosmetic Ingredient Review) reports
  - Minimum fields: inci_name, function_primary, common_name

- [ ] **1.4 Seed Ingredient Tags (Critical)**
  - Prioritize tags used by rules:
    - `comedogenic_risk` (high/medium/low)
    - `irritant_potential`
    - `fragrance`, `essential_oil`
    - `occlusive_heavy`, `emollient_light`
    - `humectant`, `barrier_supportive`
    - `anti_acne`, `soothing`
  - Add evidence citations (even if just source_type + source_name)

- [ ] **1.5 Seed Scoring Rules**
  - Insert rules from `default-rules.ts`
  - Start with subset: oily, dry, sensitive, acne rules

### Phase 2: Core Engine Integration

- [ ] **2.1 Migrate `lib/skinMatch.ts` to new engine**
  - Replace current algorithm with `lib/scoring/engine.ts`
  - Keep backward-compatible API

- [ ] **2.2 Update Product Detail Screen**
  - Fetch ingredient tags from DB
  - Show caution flags with proper confidence
  - Show "why recommended" / "why not" reasons

- [ ] **2.3 INCI Parser Integration**
  - On product scan, parse INCI text
  - Match to ingredients table (fuzzy matching)
  - Queue unknown ingredients for review

- [ ] **2.4 Unknown Ingredient Handling**
  - UI: Show "X ingredients couldn't be analyzed"
  - Admin: Create review queue page

### Phase 3: User Personalization

- [ ] **3.1 Hard Blocks UI**
  - Let users mark specific ingredients as allergens
  - Store in `user_hard_blocks`

- [ ] **3.2 Scan History**
  - Log all scans to `user_scans`
  - Include rules_fired for debugging

- [ ] **3.3 Feedback Collection**
  - After N days, prompt for feedback
  - Store in `user_feedback`

- [ ] **3.4 Weight Adjustment Processing**
  - On feedback, run `processUserFeedback()`
  - Update `user_weight_adjustments`
  - Cap adjustments (-0.5 to +0.5)

### Phase 4: Data Quality & Scale

- [ ] **4.1 Ingredient Synonym Expansion**
  - Add trade names, common misspellings
  - Enable fuzzy INCI matching

- [ ] **4.2 Evidence Layer**
  - Add citations to tag_evidence
  - Show "based on X studies" in UI

- [ ] **4.3 Product Verification Pipeline**
  - Manual review queue for products
  - Flag products with many unknown ingredients

- [ ] **4.4 Rule Tuning**
  - Analyze scan results vs feedback
  - Adjust rule weights based on outcomes

### Seed Data Strategy

```
PRIORITY ORDER:
1. Tag Types (included in SQL) ✓
2. Top 200 Ingredients (most common in skincare)
   - Water, Glycerin, Butylene Glycol, Niacinamide, etc.
3. Ingredient Tags for those 200
   - At minimum: function, comedogenic_risk, irritant_potential
4. Scoring Rules (from default-rules.ts)
5. Expand to 1000+ ingredients over time
```

**Handling Missing Ingredients:**
```
WHEN parsing INCI and ingredient not found:
1. Normalize name (lowercase, remove special chars)
2. Check synonyms table
3. Fuzzy match with pg_trgm (similarity > 0.7)
4. If still not found:
   - Add to unknown_ingredients_queue
   - Mark product_ingredient as is_unknown = true
   - Lower confidence in scoring result
5. Admin reviews queue weekly, maps or creates ingredients
```

### Quick Win Checklist

1. [ ] Run schema-v2.sql
2. [ ] Copy 200 common ingredients from old data
3. [ ] Add basic tags (comedogenic, fragrance, etc.)
4. [ ] Insert default rules
5. [ ] Wire up scoring engine to product detail
6. [ ] Show match score + top 2 reasons

---

## UI Copy Guidelines

### DO Say
- "May not be ideal for your skin type"
- "Contains ingredients some find pore-clogging"
- "Great match for your skin profile"
- "Contains ingredients that support your skin goals"

### DON'T Say
- "Toxic"
- "Dangerous"
- "Bad ingredient"
- "Unsafe"
- "Harmful"

### Confidence Disclaimers
- **High confidence**: (no disclaimer needed)
- **Medium**: "Some ingredients had limited data. Our assessment may be approximate."
- **Low**: "Many ingredients couldn't be fully analyzed. Consider patch testing."

### General Disclaimers
- "Ingredient presence doesn't guarantee a reaction. Everyone's skin is different."
- "When trying new products, patch testing is always recommended."
- "This is not medical advice. Consult a dermatologist for skin concerns."

