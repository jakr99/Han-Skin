-- ============================================================================
-- HAN-SKIN DATABASE SCHEMA v2.0
-- A defensible, explainable skincare recommendation engine
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- ============================================================================
-- SECTION 1: CORE USER DOMAIN
-- ============================================================================

-- Main users table (minimal, auth handled by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    onboarding_completed_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ
);

-- User's skin profile from questionnaire
CREATE TABLE user_skin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Core skin attributes
    skin_type TEXT CHECK (skin_type IN ('dry', 'oily', 'combination', 'normal', 'sensitive')),
    skin_type_confidence SMALLINT CHECK (skin_type_confidence BETWEEN 1 AND 5), -- self-reported certainty

    -- Environmental factors
    climate TEXT CHECK (climate IN ('humid_hot', 'humid_temperate', 'dry_hot', 'dry_cold', 'temperate', 'variable')),
    sun_exposure TEXT CHECK (sun_exposure IN ('minimal', 'moderate', 'high')),
    pollution_level TEXT CHECK (pollution_level IN ('low', 'moderate', 'high')),

    -- Demographics (optional, for research)
    age_range TEXT CHECK (age_range IN ('teens', '20s', '30s', '40s', '50s', '60+')),

    -- Routine info
    routine_frequency TEXT CHECK (routine_frequency IN ('minimal', 'basic', 'moderate', 'extensive')),
    prefers_fragrance_free BOOLEAN DEFAULT false,
    prefers_vegan BOOLEAN DEFAULT false,
    prefers_cruelty_free BOOLEAN DEFAULT false,

    -- Metadata
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)  -- One profile per user
);

-- User skin concerns with severity
CREATE TABLE user_concerns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    concern_type TEXT NOT NULL CHECK (concern_type IN (
        'acne', 'blackheads', 'whiteheads', 'cystic_acne',
        'dryness', 'dehydration', 'flakiness',
        'oiliness', 'shine', 'enlarged_pores',
        'redness', 'rosacea', 'sensitivity', 'irritation',
        'hyperpigmentation', 'dark_spots', 'uneven_tone', 'melasma',
        'fine_lines', 'wrinkles', 'loss_of_firmness', 'dullness',
        'texture', 'scarring', 'keratosis_pilaris',
        'eczema', 'psoriasis', 'dermatitis'
    )),

    severity SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 5), -- 1=mild, 5=severe
    priority SMALLINT DEFAULT 1, -- user's ranking of importance
    body_area TEXT DEFAULT 'face' CHECK (body_area IN ('face', 'body', 'both')),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, concern_type, body_area)
);

-- User sensitivities (things that have caused reactions)
CREATE TABLE user_sensitivities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    sensitivity_type TEXT NOT NULL CHECK (sensitivity_type IN (
        'fragrance', 'essential_oils', 'alcohol', 'retinoids',
        'aha', 'bha', 'vitamin_c', 'niacinamide', 'benzoyl_peroxide',
        'sulfates', 'silicones', 'coconut_derivatives',
        'lanolin', 'propylene_glycol', 'formaldehyde_releasers',
        'parabens', 'phenoxyethanol', 'dyes', 'other'
    )),

    reaction_type TEXT CHECK (reaction_type IN (
        'irritation', 'redness', 'burning', 'breakout',
        'allergy', 'dryness', 'unknown'
    )),

    severity SMALLINT CHECK (severity BETWEEN 1 AND 5),
    confirmed BOOLEAN DEFAULT false, -- true if verified by testing
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, sensitivity_type)
);

-- Hard blocks: specific ingredients user MUST avoid (allergies, confirmed bad reactions)
CREATE TABLE user_hard_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),

    -- Can also block by name if ingredient not in DB yet
    ingredient_name_pattern TEXT, -- e.g., '%coconut%' for all coconut derivatives

    reason TEXT NOT NULL CHECK (reason IN (
        'allergy', 'confirmed_reaction', 'medical_advice',
        'pregnancy', 'personal_preference', 'other'
    )),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK (ingredient_id IS NOT NULL OR ingredient_name_pattern IS NOT NULL)
);

-- User-specific weight adjustments (learned from feedback)
CREATE TABLE user_weight_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_type_id UUID NOT NULL REFERENCES tag_types(id),

    -- Adjustment to base scoring weight
    weight_delta DECIMAL(4,2) DEFAULT 0, -- e.g., +0.5 means 50% more penalty/bonus

    -- Tracking
    positive_feedback_count INTEGER DEFAULT 0,
    negative_feedback_count INTEGER DEFAULT 0,
    last_feedback_at TIMESTAMPTZ,

    -- Decay/caps
    decay_applied_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, tag_type_id)
);

-- ============================================================================
-- SECTION 2: INGREDIENT DOMAIN
-- ============================================================================

-- Canonical ingredients table
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identifiers
    inci_name TEXT NOT NULL UNIQUE, -- Official INCI name (uppercase)
    inci_name_normalized TEXT NOT NULL, -- Lowercase, trimmed for matching
    common_name TEXT,
    cas_number TEXT, -- Chemical Abstracts Service number
    ec_number TEXT, -- European Community number

    -- Classification
    function_primary TEXT CHECK (function_primary IN (
        'surfactant', 'emollient', 'humectant', 'occlusive',
        'emulsifier', 'preservative', 'antioxidant', 'chelating',
        'ph_adjuster', 'viscosity_modifier', 'solvent', 'fragrance',
        'colorant', 'uv_filter', 'active', 'film_former',
        'exfoliant', 'antimicrobial', 'conditioning', 'other'
    )),
    functions_secondary TEXT[], -- Additional functions

    -- Quick reference fields (denormalized from tags for performance)
    is_fragrance BOOLEAN DEFAULT false,
    is_preservative BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT false,
    is_common_allergen BOOLEAN DEFAULT false,

    -- Metadata
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by TEXT
);

-- Ingredient synonyms for INCI parsing
CREATE TABLE ingredient_synonyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,

    synonym TEXT NOT NULL,
    synonym_normalized TEXT NOT NULL, -- Lowercase for matching
    synonym_type TEXT CHECK (synonym_type IN (
        'inci_variant', 'trade_name', 'common_name',
        'abbreviation', 'misspelling', 'translation'
    )),
    language TEXT DEFAULT 'en',

    UNIQUE(synonym_normalized)
);

-- ============================================================================
-- SECTION 3: TAG SYSTEM (The Heart of the Algorithm)
-- ============================================================================

-- Tag type definitions (versioned)
CREATE TABLE tag_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL, -- e.g., 'comedogenic_risk'
    display_name TEXT NOT NULL, -- e.g., 'Pore-Clogging Risk'
    category TEXT NOT NULL CHECK (category IN (
        'texture_weight', 'risk_marker', 'benefit_marker',
        'allergen_restriction', 'function'
    )),

    description TEXT,

    -- How this tag affects scoring
    value_type TEXT NOT NULL CHECK (value_type IN (
        'boolean', -- has or doesn't have
        'scale', -- low/medium/high
        'numeric' -- actual number (e.g., SPF)
    )),

    -- Default scoring weights (can be overridden by rules)
    default_weight DECIMAL(4,2) DEFAULT 1.0, -- multiplier

    -- UI
    icon TEXT,
    color TEXT,

    -- Versioning
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(name, version)
);

-- Ingredient tags (the actual assignments)
CREATE TABLE ingredient_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    tag_type_id UUID NOT NULL REFERENCES tag_types(id),

    -- Value based on tag_type.value_type
    value_boolean BOOLEAN,
    value_scale TEXT CHECK (value_scale IN ('none', 'low', 'medium', 'high', 'very_high')),
    value_numeric DECIMAL(8,2),

    -- Our confidence in this tag assignment (0.0 - 1.0)
    confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,

    -- Context-dependent tags
    context_conditions JSONB, -- e.g., {"concentration_above": 5, "with_ingredients": ["alcohol"]}

    -- Versioning for audit trail
    version INTEGER DEFAULT 1,

    -- Metadata
    notes TEXT,
    assigned_by TEXT, -- 'system', 'expert', 'community'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(ingredient_id, tag_type_id, version)
);

-- Evidence supporting tag assignments
CREATE TABLE tag_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_tag_id UUID NOT NULL REFERENCES ingredient_tags(id) ON DELETE CASCADE,

    source_type TEXT NOT NULL CHECK (source_type IN (
        'peer_reviewed', -- Published scientific study
        'regulatory', -- FDA, EU, Health Canada, etc.
        'industry', -- CIR (Cosmetic Ingredient Review)
        'watchlist', -- EWG, Think Dirty, etc. (evidence, not gospel)
        'clinical', -- Dermatologist/clinical observation
        'community', -- Aggregated user reports
        'internal' -- Our own analysis
    )),

    -- Citation details
    source_name TEXT NOT NULL, -- Organization or journal
    source_title TEXT, -- Study title or document name
    source_url TEXT,
    source_year INTEGER,
    source_notes TEXT,

    -- How strong is this evidence?
    evidence_strength TEXT NOT NULL CHECK (evidence_strength IN (
        'strong', -- Multiple peer-reviewed studies
        'moderate', -- Single study or regulatory consensus
        'weak', -- Limited data, watchlist only
        'anecdotal' -- Community reports only
    )),

    -- What does this evidence support?
    supports_value TEXT, -- The value this evidence supports

    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by TEXT
);

-- ============================================================================
-- SECTION 4: PRODUCT DOMAIN
-- ============================================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identifiers
    barcode TEXT, -- EAN/UPC/GTIN
    brand TEXT NOT NULL,
    name TEXT NOT NULL,

    -- Classification
    category TEXT NOT NULL CHECK (category IN (
        'cleanser', 'toner', 'essence', 'serum', 'ampoule',
        'moisturizer', 'eye_cream', 'sunscreen', 'mask',
        'exfoliant', 'treatment', 'oil', 'mist', 'lip_care',
        'body_care', 'hand_care', 'hair_care', 'other'
    )),
    subcategory TEXT,

    -- Product details
    description TEXT,
    size_ml DECIMAL(8,2),
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',

    -- The raw INCI list as provided
    raw_inci_text TEXT,
    inci_source TEXT, -- Where we got the INCI from

    -- Computed/cached fields
    ingredient_count INTEGER,
    has_fragrance BOOLEAN,
    has_actives BOOLEAN,

    -- Our calculated safety score (cached, recomputed periodically)
    base_safety_score INTEGER CHECK (base_safety_score BETWEEN 0 AND 100),
    base_safety_score_confidence DECIMAL(3,2),
    safety_score_computed_at TIMESTAMPTZ,

    -- External references
    image_url TEXT,
    buy_url TEXT,
    store TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Partial unique (barcode can be null for custom entries)
    UNIQUE NULLS NOT DISTINCT (barcode)
);

-- Product-ingredient junction with position (order matters!)
CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),

    -- If ingredient not in our DB yet, store raw name
    raw_ingredient_name TEXT,

    -- Position in INCI list (1 = highest concentration)
    position INTEGER NOT NULL,

    -- Estimated concentration tier based on position
    concentration_tier TEXT CHECK (concentration_tier IN (
        'high', -- Positions 1-5: typically >5%
        'medium', -- Positions 6-15: typically 1-5%
        'low', -- Positions 16+: typically <1%
        'trace' -- After preservatives or "may contain"
    )),

    -- Parsing metadata
    parse_confidence DECIMAL(3,2) DEFAULT 1.0,
    is_controversial BOOLEAN DEFAULT false, -- Flagged for review

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(product_id, position),
    CHECK (ingredient_id IS NOT NULL OR raw_ingredient_name IS NOT NULL)
);

-- Unknown ingredients queue for review
CREATE TABLE unknown_ingredients_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,

    first_seen_in_product_id UUID REFERENCES products(id),
    occurrence_count INTEGER DEFAULT 1,

    -- Review status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_review', 'mapped', 'new_ingredient', 'invalid'
    )),
    mapped_to_ingredient_id UUID REFERENCES ingredients(id),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(normalized_name)
);

-- ============================================================================
-- SECTION 5: RULES ENGINE
-- ============================================================================

-- Scoring rules table (the brain of the algorithm)
CREATE TABLE scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identification
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    -- Rule classification
    rule_type TEXT NOT NULL CHECK (rule_type IN (
        'hard_filter', -- Blocks product entirely
        'scoring', -- Adds/subtracts from match score
        'bonus', -- Only adds positive points
        'caution_flag' -- Adds a warning without blocking
    )),

    -- Priority (lower = evaluated first, important for hard filters)
    priority INTEGER DEFAULT 100,

    -- The rule logic (JSONB for flexibility)
    conditions JSONB NOT NULL,
    /*
    Example conditions:
    {
        "operator": "AND",  // AND, OR
        "conditions": [
            {"type": "user_trait", "trait": "skin_type", "operator": "eq", "value": "oily"},
            {"type": "user_trait", "trait": "concern", "operator": "contains", "value": "acne"},
            {"type": "ingredient_tag", "tag": "comedogenic_risk", "operator": "gte", "value": "high"},
            {"type": "product_category", "operator": "in", "value": ["moisturizer", "sunscreen"]},
            {"type": "ingredient_position", "operator": "lte", "value": 10}  // In top 10
        ]
    }
    */

    -- What happens when rule fires
    actions JSONB NOT NULL,
    /*
    Example actions:
    {
        "action": "block" | "penalty" | "bonus" | "flag",
        "score_delta": -20,  // For penalty/bonus
        "max_penalty_per_product": -40,  // Cap if multiple ingredients trigger
        "caution_flag": {
            "type": "clog_risk",
            "confidence": "high",
            "severity": "warning"  // info, warning, critical
        }
    }
    */

    -- Human-readable explanation templates
    explanation_template TEXT NOT NULL,
    /*
    Example: "Contains {ingredient_name} which has high pore-clogging risk -
              may not be ideal for oily/acne-prone skin"
    */

    -- For UI display
    short_explanation TEXT, -- "High clog risk ingredient"
    icon TEXT,

    -- Rule metadata
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,

    -- Audit
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rule audit log (track all changes)
CREATE TABLE scoring_rules_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID NOT NULL REFERENCES scoring_rules(id),

    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'deactivate', 'reactivate')),
    old_values JSONB,
    new_values JSONB,

    changed_by TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);

-- ============================================================================
-- SECTION 6: USER INTERACTIONS & FEEDBACK
-- ============================================================================

-- User product scans/views (with computed results for analysis)
CREATE TABLE user_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),

    scan_type TEXT NOT NULL CHECK (scan_type IN (
        'barcode', 'inci_photo', 'manual_search', 'recommendation', 'routine'
    )),

    -- Results at time of scan (snapshot)
    match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
    match_label TEXT,
    confidence DECIMAL(3,2),

    -- Which rules fired
    rules_fired JSONB, -- Array of {rule_id, rule_name, action, explanation}
    caution_flags JSONB, -- Array of {type, confidence, explanation}

    -- Positive reasons
    positive_reasons JSONB, -- Array of explanation strings
    negative_reasons JSONB,

    -- User action
    user_action TEXT CHECK (user_action IN (
        'dismissed', 'saved', 'added_to_routine', 'clicked_buy', 'shared'
    )),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User feedback on products (the learning signal)
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),

    -- When in their journey
    scan_id UUID REFERENCES user_scans(id), -- Link to original scan

    feedback_type TEXT NOT NULL CHECK (feedback_type IN (
        -- Negative outcomes
        'too_greasy', 'too_drying', 'irritation', 'burning',
        'breakout', 'clogged_pores', 'allergic_reaction',
        'no_effect', 'made_worse',
        -- Positive outcomes
        'loved_it', 'good_results', 'repurchase',
        -- Neutral
        'just_ok', 'returned_it'
    )),

    intensity SMALLINT CHECK (intensity BETWEEN 1 AND 5), -- How bad/good

    -- Context
    usage_duration_days INTEGER, -- How long they used it
    usage_frequency TEXT CHECK (usage_frequency IN ('once', 'few_times', 'week', 'month', 'ongoing')),

    -- Details
    notes TEXT,

    -- Has this feedback been processed for weight adjustments?
    processed_at TIMESTAMPTZ,
    weight_adjustments_applied JSONB, -- What changes were made

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User routine (what they're currently using)
CREATE TABLE user_routine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),

    step_order INTEGER NOT NULL,
    time_of_day TEXT NOT NULL CHECK (time_of_day IN ('am', 'pm', 'both')),
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN (
        'daily', 'every_other_day', 'weekly', 'as_needed'
    )),

    -- Routine compatibility tracking
    started_at TIMESTAMPTZ DEFAULT NOW(),
    discontinued_at TIMESTAMPTZ,
    discontinue_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, product_id, time_of_day)
);

-- ============================================================================
-- SECTION 7: VERSIONING & AUDIT
-- ============================================================================

-- Schema version tracking
CREATE TABLE schema_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT NOT NULL UNIQUE,
    description TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    applied_by TEXT
);

-- Ingredient mapping updates (audit trail)
CREATE TABLE ingredient_mapping_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    action_type TEXT NOT NULL CHECK (action_type IN (
        'synonym_added', 'synonym_removed', 'tag_updated',
        'ingredient_merged', 'ingredient_split'
    )),

    ingredient_id UUID REFERENCES ingredients(id),
    details JSONB,

    performed_by TEXT,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);

-- ============================================================================
-- SECTION 8: INDEXES
-- ============================================================================

-- User lookups
CREATE INDEX idx_user_skin_profiles_user ON user_skin_profiles(user_id);
CREATE INDEX idx_user_concerns_user ON user_concerns(user_id);
CREATE INDEX idx_user_concerns_type ON user_concerns(concern_type);
CREATE INDEX idx_user_sensitivities_user ON user_sensitivities(user_id);
CREATE INDEX idx_user_hard_blocks_user ON user_hard_blocks(user_id);
CREATE INDEX idx_user_weight_adj_user ON user_weight_adjustments(user_id);

-- Ingredient lookups (critical for INCI parsing)
CREATE INDEX idx_ingredients_inci_normalized ON ingredients(inci_name_normalized);
CREATE INDEX idx_ingredients_inci_trgm ON ingredients USING gin(inci_name_normalized gin_trgm_ops);
CREATE INDEX idx_ingredient_synonyms_normalized ON ingredient_synonyms(synonym_normalized);
CREATE INDEX idx_ingredient_synonyms_trgm ON ingredient_synonyms USING gin(synonym_normalized gin_trgm_ops);

-- Tag lookups
CREATE INDEX idx_ingredient_tags_ingredient ON ingredient_tags(ingredient_id);
CREATE INDEX idx_ingredient_tags_type ON ingredient_tags(tag_type_id);
CREATE INDEX idx_ingredient_tags_composite ON ingredient_tags(ingredient_id, tag_type_id);
CREATE INDEX idx_tag_evidence_tag ON tag_evidence(ingredient_tag_id);

-- Product lookups
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand_name ON products(brand, name);
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- Product ingredients
CREATE INDEX idx_product_ingredients_product ON product_ingredients(product_id);
CREATE INDEX idx_product_ingredients_ingredient ON product_ingredients(ingredient_id);
CREATE INDEX idx_product_ingredients_position ON product_ingredients(product_id, position);

-- Rules
CREATE INDEX idx_scoring_rules_type ON scoring_rules(rule_type) WHERE is_active = true;
CREATE INDEX idx_scoring_rules_priority ON scoring_rules(priority) WHERE is_active = true;

-- User interactions
CREATE INDEX idx_user_scans_user ON user_scans(user_id);
CREATE INDEX idx_user_scans_product ON user_scans(product_id);
CREATE INDEX idx_user_scans_created ON user_scans(created_at DESC);
CREATE INDEX idx_user_feedback_user ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_product ON user_feedback(product_id);
CREATE INDEX idx_user_feedback_unprocessed ON user_feedback(user_id) WHERE processed_at IS NULL;
CREATE INDEX idx_user_routine_user ON user_routine(user_id);

-- Unknown ingredients queue
CREATE INDEX idx_unknown_ingredients_status ON unknown_ingredients_queue(status) WHERE status = 'pending';
CREATE INDEX idx_unknown_ingredients_count ON unknown_ingredients_queue(occurrence_count DESC);

-- ============================================================================
-- SECTION 9: INITIAL TAG TYPES SEED DATA
-- ============================================================================

INSERT INTO tag_types (name, display_name, category, description, value_type, default_weight) VALUES
-- Texture/Weight tags
('occlusive_heavy', 'Heavy Occlusive', 'texture_weight', 'Forms a thick barrier on skin (petrolatum, mineral oil)', 'boolean', 1.0),
('occlusive_light', 'Light Occlusive', 'texture_weight', 'Forms a light barrier (dimethicone, squalane)', 'boolean', 1.0),
('emollient_heavy', 'Heavy Emollient', 'texture_weight', 'Rich, heavy emollient (shea butter, cocoa butter)', 'boolean', 1.0),
('emollient_light', 'Light Emollient', 'texture_weight', 'Lightweight emollient (caprylic triglyceride)', 'boolean', 1.0),
('humectant', 'Humectant', 'texture_weight', 'Attracts water to skin (glycerin, hyaluronic acid)', 'boolean', 1.0),
('astringent', 'Astringent', 'texture_weight', 'Tightens/constricts skin (witch hazel, alcohol)', 'boolean', 1.0),

-- Risk marker tags
('comedogenic_risk', 'Pore-Clogging Risk', 'risk_marker', 'Potential to clog pores based on comedogenicity research', 'scale', 1.5),
('irritant_potential', 'Irritation Potential', 'risk_marker', 'May cause irritation, especially for sensitive skin', 'scale', 1.5),
('sensitizer', 'Known Sensitizer', 'risk_marker', 'Can cause allergic sensitization over time', 'scale', 1.5),
('photosensitizing', 'Photosensitizing', 'risk_marker', 'Increases sun sensitivity', 'boolean', 1.2),
('drying', 'Drying', 'risk_marker', 'Can be drying to skin', 'scale', 1.0),

-- Benefit marker tags
('barrier_supportive', 'Barrier Support', 'benefit_marker', 'Helps strengthen skin barrier (ceramides, fatty acids)', 'boolean', 1.0),
('anti_inflammatory', 'Anti-Inflammatory', 'benefit_marker', 'Reduces inflammation (niacinamide, centella)', 'boolean', 1.0),
('antioxidant', 'Antioxidant', 'benefit_marker', 'Provides antioxidant protection', 'boolean', 1.0),
('brightening', 'Brightening', 'benefit_marker', 'Helps with hyperpigmentation (vitamin C, arbutin)', 'boolean', 1.0),
('anti_acne', 'Anti-Acne', 'benefit_marker', 'Helps with acne (BHA, benzoyl peroxide)', 'boolean', 1.0),
('hydrating', 'Hydrating', 'benefit_marker', 'Provides hydration to skin', 'boolean', 1.0),
('soothing', 'Soothing', 'benefit_marker', 'Calms and soothes skin', 'boolean', 1.0),
('exfoliating', 'Exfoliating', 'benefit_marker', 'Provides chemical or physical exfoliation', 'scale', 1.0),
('anti_aging', 'Anti-Aging', 'benefit_marker', 'Addresses signs of aging (retinoids, peptides)', 'boolean', 1.0),

-- Allergen/Restriction tags
('fragrance', 'Fragrance', 'allergen_restriction', 'Contains fragrance (synthetic or natural)', 'boolean', 1.5),
('essential_oil', 'Essential Oil', 'allergen_restriction', 'Contains essential oils', 'boolean', 1.3),
('common_allergen', 'Common Allergen', 'allergen_restriction', 'Known to commonly cause allergic reactions', 'boolean', 1.5),
('eu_26_allergen', 'EU 26 Fragrance Allergen', 'allergen_restriction', 'One of 26 EU-regulated fragrance allergens', 'boolean', 1.2),
('pregnancy_caution', 'Pregnancy Caution', 'allergen_restriction', 'May not be recommended during pregnancy', 'boolean', 1.0),

-- Function tags
('surfactant_harsh', 'Harsh Surfactant', 'function', 'Strong surfactant (SLS, SLES)', 'boolean', 1.0),
('surfactant_gentle', 'Gentle Surfactant', 'function', 'Mild surfactant (cocamidopropyl betaine)', 'boolean', 1.0),
('preservative', 'Preservative', 'function', 'Preservative ingredient', 'boolean', 0.5),
('ph_dependent_active', 'pH-Dependent Active', 'function', 'Effectiveness depends on product pH', 'boolean', 0.8),
('concentration_dependent', 'Concentration-Dependent', 'function', 'Effects vary significantly by concentration', 'boolean', 0.8);

-- Record schema version
INSERT INTO schema_versions (version, description)
VALUES ('2.0.0', 'Initial v2 schema with rules engine and evidence layer');

-- ============================================================================
-- SECTION 10: ROW LEVEL SECURITY (for Supabase)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sensitivities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hard_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weight_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routine ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own skin profile" ON user_skin_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own concerns" ON user_concerns
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sensitivities" ON user_sensitivities
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own blocks" ON user_hard_blocks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own weight adjustments" ON user_weight_adjustments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own scans" ON user_scans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own feedback" ON user_feedback
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own routine" ON user_routine
    FOR ALL USING (auth.uid() = user_id);

-- Public read access for products, ingredients, rules
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_synonyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read ingredients" ON ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read synonyms" ON ingredient_synonyms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read tag types" ON tag_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read ingredient tags" ON ingredient_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read evidence" ON tag_evidence FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read rules" ON scoring_rules FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Public read product ingredients" ON product_ingredients FOR SELECT TO authenticated USING (true);
