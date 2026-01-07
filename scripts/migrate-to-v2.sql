-- ============================================================================
-- HAN-SKIN DATABASE V2 SETUP (COMPLETE)
-- Compatible with existing 'profiles' table
-- Run this in Supabase SQL Editor
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- STEP 1: ADD SKIN PROFILE COLUMNS TO EXISTING PROFILES TABLE
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skin_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS climate TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_range TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prefers_fragrance_free BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prefers_vegan BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prefers_cruelty_free BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- STEP 2: USER TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_concerns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    concern_type TEXT NOT NULL,
    severity SMALLINT NOT NULL DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
    priority SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, concern_type)
);

CREATE TABLE IF NOT EXISTS user_sensitivities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sensitivity_type TEXT NOT NULL,
    reaction_type TEXT,
    severity SMALLINT DEFAULT 3,
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, sensitivity_type)
);

CREATE TABLE IF NOT EXISTS user_hard_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ingredient_id UUID,
    ingredient_name_pattern TEXT,
    reason TEXT NOT NULL DEFAULT 'personal_preference',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: INGREDIENTS TABLE
-- ============================================================================

DROP TABLE IF EXISTS product_ingredients CASCADE;
DROP TABLE IF EXISTS ingredient_tags CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;

CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inci_name TEXT NOT NULL UNIQUE,
    inci_name_normalized TEXT NOT NULL,
    common_name TEXT,
    cas_number TEXT,
    function_primary TEXT,
    is_fragrance BOOLEAN DEFAULT false,
    is_preservative BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT false,
    is_common_allergen BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: TAG TYPES TABLE
-- ============================================================================

DROP TABLE IF EXISTS tag_types CASCADE;

CREATE TABLE tag_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    value_type TEXT NOT NULL,
    default_weight DECIMAL(4,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: INGREDIENT TAGS TABLE
-- ============================================================================

CREATE TABLE ingredient_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    tag_type_id UUID NOT NULL REFERENCES tag_types(id),
    value_boolean BOOLEAN,
    value_scale TEXT,
    confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    assigned_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ingredient_id, tag_type_id)
);

-- ============================================================================
-- STEP 6: PRODUCTS TABLE
-- ============================================================================

DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barcode TEXT,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    raw_inci_text TEXT,
    ingredient_count INTEGER,
    has_fragrance BOOLEAN DEFAULT false,
    base_safety_score INTEGER,
    image_url TEXT,
    buy_url TEXT,
    store TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 7: PRODUCT INGREDIENTS TABLE
-- ============================================================================

CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),
    raw_ingredient_name TEXT,
    position INTEGER NOT NULL,
    concentration_tier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, position)
);

-- ============================================================================
-- STEP 8: USER INTERACTION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    scan_type TEXT NOT NULL DEFAULT 'manual_search',
    match_score INTEGER,
    match_label TEXT,
    caution_flags JSONB,
    positive_reasons JSONB,
    negative_reasons JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    feedback_type TEXT NOT NULL,
    intensity SMALLINT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    rule_type TEXT NOT NULL,
    priority INTEGER DEFAULT 100,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    explanation_template TEXT NOT NULL,
    short_explanation TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 9: INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_concerns_user ON user_concerns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sensitivities_user ON user_sensitivities(user_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_normalized ON ingredients(inci_name_normalized);
CREATE INDEX IF NOT EXISTS idx_ingredients_trgm ON ingredients USING gin(inci_name_normalized gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ingredient_tags_ingredient ON ingredient_tags(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_ingredients_product ON product_ingredients(product_id);

-- ============================================================================
-- STEP 10: ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sensitivities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hard_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own concerns" ON user_concerns;
DROP POLICY IF EXISTS "Users manage own sensitivities" ON user_sensitivities;
DROP POLICY IF EXISTS "Users manage own blocks" ON user_hard_blocks;
DROP POLICY IF EXISTS "Users manage own scans" ON user_scans;
DROP POLICY IF EXISTS "Users manage own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read ingredients" ON ingredients;
DROP POLICY IF EXISTS "Public read tag types" ON tag_types;
DROP POLICY IF EXISTS "Public read ingredient tags" ON ingredient_tags;
DROP POLICY IF EXISTS "Public read product ingredients" ON product_ingredients;
DROP POLICY IF EXISTS "Public read scoring rules" ON scoring_rules;

CREATE POLICY "Users manage own concerns" ON user_concerns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sensitivities" ON user_sensitivities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own blocks" ON user_hard_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own scans" ON user_scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own feedback" ON user_feedback FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read ingredients" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Public read tag types" ON tag_types FOR SELECT USING (true);
CREATE POLICY "Public read ingredient tags" ON ingredient_tags FOR SELECT USING (true);
CREATE POLICY "Public read product ingredients" ON product_ingredients FOR SELECT USING (true);
CREATE POLICY "Public read scoring rules" ON scoring_rules FOR SELECT USING (is_active = true);

-- ============================================================================
-- STEP 11: SEED ALL 28 TAG TYPES
-- ============================================================================

INSERT INTO tag_types (name, display_name, category, description, value_type, default_weight) VALUES
('occlusive_heavy', 'Heavy Occlusive', 'texture_weight', 'Thick barrier (petrolatum, mineral oil)', 'boolean', 1.0),
('occlusive_light', 'Light Occlusive', 'texture_weight', 'Light barrier (dimethicone, squalane)', 'boolean', 1.0),
('emollient_heavy', 'Heavy Emollient', 'texture_weight', 'Rich emollient (shea butter)', 'boolean', 1.0),
('emollient_light', 'Light Emollient', 'texture_weight', 'Lightweight emollient', 'boolean', 1.0),
('humectant', 'Humectant', 'texture_weight', 'Attracts water (glycerin, HA)', 'boolean', 1.0),
('astringent', 'Astringent', 'texture_weight', 'Tightens skin', 'boolean', 1.0),
('comedogenic_risk', 'Pore-Clogging Risk', 'risk_marker', 'May clog pores', 'scale', 1.5),
('irritant_potential', 'Irritation Potential', 'risk_marker', 'May irritate', 'scale', 1.5),
('sensitizer', 'Known Sensitizer', 'risk_marker', 'Can cause sensitization', 'scale', 1.5),
('photosensitizing', 'Photosensitizing', 'risk_marker', 'Increases sun sensitivity', 'boolean', 1.2),
('drying', 'Drying', 'risk_marker', 'Can dry skin', 'scale', 1.0),
('barrier_supportive', 'Barrier Support', 'benefit_marker', 'Strengthens barrier', 'boolean', 1.0),
('anti_inflammatory', 'Anti-Inflammatory', 'benefit_marker', 'Reduces inflammation', 'boolean', 1.0),
('antioxidant', 'Antioxidant', 'benefit_marker', 'Antioxidant protection', 'boolean', 1.0),
('brightening', 'Brightening', 'benefit_marker', 'Helps pigmentation', 'boolean', 1.0),
('anti_acne', 'Anti-Acne', 'benefit_marker', 'Helps acne', 'boolean', 1.0),
('hydrating', 'Hydrating', 'benefit_marker', 'Provides hydration', 'boolean', 1.0),
('soothing', 'Soothing', 'benefit_marker', 'Calms skin', 'boolean', 1.0),
('exfoliating', 'Exfoliating', 'benefit_marker', 'Exfoliates', 'scale', 1.0),
('anti_aging', 'Anti-Aging', 'benefit_marker', 'Anti-aging benefits', 'boolean', 1.0),
('sebum_regulating', 'Sebum Regulating', 'benefit_marker', 'Controls oil', 'boolean', 1.0),
('fragrance', 'Fragrance', 'allergen_restriction', 'Contains fragrance', 'boolean', 1.5),
('essential_oil', 'Essential Oil', 'allergen_restriction', 'Contains essential oils', 'boolean', 1.3),
('common_allergen', 'Common Allergen', 'allergen_restriction', 'Known allergen', 'boolean', 1.5),
('eu_26_allergen', 'EU 26 Fragrance Allergen', 'allergen_restriction', 'EU regulated allergen', 'boolean', 1.2),
('pregnancy_caution', 'Pregnancy Caution', 'allergen_restriction', 'Caution during pregnancy', 'boolean', 1.0),
('surfactant_harsh', 'Harsh Surfactant', 'function', 'Strong cleanser (SLS)', 'boolean', 1.0),
('surfactant_gentle', 'Gentle Surfactant', 'function', 'Mild cleanser', 'boolean', 1.0);

-- ============================================================================
-- STEP 12: SEED ALL 100+ INGREDIENTS
-- ============================================================================

INSERT INTO ingredients (inci_name, inci_name_normalized, common_name, function_primary, is_fragrance, is_active, is_preservative, description) VALUES
-- WATER/BASE
('WATER', 'water', 'Water', 'solvent', false, false, false, 'Base of most skincare'),
('AQUA', 'aqua', 'Water', 'solvent', false, false, false, 'Water (EU naming)'),

-- HUMECTANTS
('GLYCERIN', 'glycerin', 'Glycerin', 'humectant', false, false, false, 'Draws water to skin'),
('BUTYLENE GLYCOL', 'butylene glycol', 'Butylene Glycol', 'humectant', false, false, false, 'Lightweight humectant'),
('PROPYLENE GLYCOL', 'propylene glycol', 'Propylene Glycol', 'humectant', false, false, false, 'Penetration enhancer'),
('HYALURONIC ACID', 'hyaluronic acid', 'Hyaluronic Acid', 'humectant', false, true, false, 'Holds 1000x weight in water'),
('SODIUM HYALURONATE', 'sodium hyaluronate', 'Sodium Hyaluronate', 'humectant', false, true, false, 'HA salt form, smaller molecule'),
('PENTYLENE GLYCOL', 'pentylene glycol', 'Pentylene Glycol', 'humectant', false, false, false, 'Antimicrobial humectant'),
('1,2-HEXANEDIOL', '1,2-hexanediol', 'Hexanediol', 'humectant', false, false, false, 'Preservative-boosting humectant'),
('BETAINE', 'betaine', 'Betaine', 'humectant', false, false, false, 'From sugar beets'),
('SORBITOL', 'sorbitol', 'Sorbitol', 'humectant', false, false, false, 'Sugar alcohol humectant'),
('UREA', 'urea', 'Urea', 'humectant', false, true, false, 'Natural moisturizing factor'),

-- EMOLLIENTS - LIGHT
('SQUALANE', 'squalane', 'Squalane', 'emollient', false, false, false, 'Mimics natural sebum'),
('CAPRYLIC/CAPRIC TRIGLYCERIDE', 'caprylic/capric triglyceride', 'MCT Oil', 'emollient', false, false, false, 'Light coconut-derived emollient'),
('ISONONYL ISONONANOATE', 'isononyl isononanoate', 'Isononyl Isononanoate', 'emollient', false, false, false, 'Light dry-touch emollient'),
('ETHYLHEXYL PALMITATE', 'ethylhexyl palmitate', 'Ethylhexyl Palmitate', 'emollient', false, false, false, 'Light emollient ester'),
('DICAPRYLYL CARBONATE', 'dicaprylyl carbonate', 'Dicaprylyl Carbonate', 'emollient', false, false, false, 'Light spreading emollient'),

-- EMOLLIENTS - HEAVY
('SHEA BUTTER', 'shea butter', 'Shea Butter', 'emollient', false, false, false, 'Rich butter'),
('BUTYROSPERMUM PARKII BUTTER', 'butyrospermum parkii butter', 'Shea Butter', 'emollient', false, false, false, 'Shea butter INCI'),
('COCOA BUTTER', 'cocoa butter', 'Cocoa Butter', 'emollient', false, false, false, 'Rich chocolate butter'),
('THEOBROMA CACAO SEED BUTTER', 'theobroma cacao seed butter', 'Cocoa Butter', 'emollient', false, false, false, 'Cocoa butter INCI'),
('MANGO BUTTER', 'mango butter', 'Mango Butter', 'emollient', false, false, false, 'Rich tropical butter'),
('MANGIFERA INDICA SEED BUTTER', 'mangifera indica seed butter', 'Mango Butter', 'emollient', false, false, false, 'Mango butter INCI'),

-- OILS
('JOJOBA OIL', 'jojoba oil', 'Jojoba Oil', 'emollient', false, false, false, 'Similar to sebum'),
('SIMMONDSIA CHINENSIS SEED OIL', 'simmondsia chinensis seed oil', 'Jojoba Oil', 'emollient', false, false, false, 'Jojoba INCI'),
('COCONUT OIL', 'coconut oil', 'Coconut Oil', 'emollient', false, false, false, 'Can clog pores'),
('COCOS NUCIFERA OIL', 'cocos nucifera oil', 'Coconut Oil', 'emollient', false, false, false, 'Coconut INCI'),
('ARGAN OIL', 'argan oil', 'Argan Oil', 'emollient', false, false, false, 'Moroccan oil'),
('ARGANIA SPINOSA KERNEL OIL', 'argania spinosa kernel oil', 'Argan Oil', 'emollient', false, false, false, 'Argan INCI'),
('ROSEHIP OIL', 'rosehip oil', 'Rosehip Oil', 'emollient', false, true, false, 'Rich in vitamin A'),
('ROSA CANINA SEED OIL', 'rosa canina seed oil', 'Rosehip Oil', 'emollient', false, true, false, 'Rosehip INCI'),
('MARULA OIL', 'marula oil', 'Marula Oil', 'emollient', false, false, false, 'African oil'),
('SCLEROCARYA BIRREA SEED OIL', 'sclerocarya birrea seed oil', 'Marula Oil', 'emollient', false, false, false, 'Marula INCI'),
('SUNFLOWER OIL', 'sunflower oil', 'Sunflower Oil', 'emollient', false, false, false, 'Light plant oil'),
('HELIANTHUS ANNUUS SEED OIL', 'helianthus annuus seed oil', 'Sunflower Oil', 'emollient', false, false, false, 'Sunflower INCI'),
('OLIVE OIL', 'olive oil', 'Olive Oil', 'emollient', false, false, false, 'Mediterranean oil'),
('OLEA EUROPAEA FRUIT OIL', 'olea europaea fruit oil', 'Olive Oil', 'emollient', false, false, false, 'Olive INCI'),

-- OCCLUSIVES
('DIMETHICONE', 'dimethicone', 'Dimethicone', 'occlusive', false, false, false, 'Silicone barrier'),
('CYCLOPENTASILOXANE', 'cyclopentasiloxane', 'Cyclopentasiloxane', 'emollient', false, false, false, 'Volatile silicone'),
('CYCLOHEXASILOXANE', 'cyclohexasiloxane', 'Cyclohexasiloxane', 'emollient', false, false, false, 'Volatile silicone'),
('PETROLATUM', 'petrolatum', 'Petrolatum', 'occlusive', false, false, false, 'Heavy occlusive'),
('MINERAL OIL', 'mineral oil', 'Mineral Oil', 'occlusive', false, false, false, 'Petroleum-derived occlusive'),
('PARAFFINUM LIQUIDUM', 'paraffinum liquidum', 'Mineral Oil', 'occlusive', false, false, false, 'Mineral oil EU'),
('LANOLIN', 'lanolin', 'Lanolin', 'occlusive', false, false, false, 'From sheep wool'),
('BEESWAX', 'beeswax', 'Beeswax', 'occlusive', false, false, false, 'Natural wax'),
('CERA ALBA', 'cera alba', 'Beeswax', 'occlusive', false, false, false, 'Beeswax INCI'),

-- FATTY ALCOHOLS
('CETYL ALCOHOL', 'cetyl alcohol', 'Cetyl Alcohol', 'emollient', false, false, false, 'Fatty alcohol, not drying'),
('CETEARYL ALCOHOL', 'cetearyl alcohol', 'Cetearyl Alcohol', 'emollient', false, false, false, 'Fatty alcohol mix'),
('STEARYL ALCOHOL', 'stearyl alcohol', 'Stearyl Alcohol', 'emollient', false, false, false, 'Fatty alcohol'),
('BEHENYL ALCOHOL', 'behenyl alcohol', 'Behenyl Alcohol', 'emollient', false, false, false, 'Long-chain fatty alcohol'),

-- COMEDOGENIC CONCERNS
('ISOPROPYL MYRISTATE', 'isopropyl myristate', 'Isopropyl Myristate', 'emollient', false, false, false, 'Highly comedogenic'),
('ISOPROPYL PALMITATE', 'isopropyl palmitate', 'Isopropyl Palmitate', 'emollient', false, false, false, 'Can clog pores'),
('MYRISTYL MYRISTATE', 'myristyl myristate', 'Myristyl Myristate', 'emollient', false, false, false, 'Comedogenic ester'),

-- ACTIVES - BRIGHTENING
('NIACINAMIDE', 'niacinamide', 'Niacinamide', 'active', false, true, false, 'Vitamin B3, multi-benefit'),
('ASCORBIC ACID', 'ascorbic acid', 'Vitamin C', 'active', false, true, false, 'Pure vitamin C'),
('ASCORBYL GLUCOSIDE', 'ascorbyl glucoside', 'Vitamin C Derivative', 'active', false, true, false, 'Stable vitamin C'),
('SODIUM ASCORBYL PHOSPHATE', 'sodium ascorbyl phosphate', 'SAP', 'active', false, true, false, 'Water-soluble vitamin C'),
('ASCORBYL TETRAISOPALMITATE', 'ascorbyl tetraisopalmitate', 'Vitamin C Derivative', 'active', false, true, false, 'Oil-soluble vitamin C'),
('ALPHA-ARBUTIN', 'alpha-arbutin', 'Alpha Arbutin', 'active', false, true, false, 'From bearberry'),
('TRANEXAMIC ACID', 'tranexamic acid', 'Tranexamic Acid', 'active', false, true, false, 'For stubborn pigmentation'),
('KOJIC ACID', 'kojic acid', 'Kojic Acid', 'active', false, true, false, 'Fermentation-derived brightener'),
('LICORICE ROOT EXTRACT', 'licorice root extract', 'Licorice Extract', 'active', false, true, false, 'Natural brightener'),
('GLYCYRRHIZA GLABRA ROOT EXTRACT', 'glycyrrhiza glabra root extract', 'Licorice Extract', 'active', false, true, false, 'Licorice INCI'),
('GALACTOMYCES FERMENT FILTRATE', 'galactomyces ferment filtrate', 'Galactomyces', 'active', false, true, false, 'Fermented for glow'),

-- ACTIVES - ANTI-AGING
('RETINOL', 'retinol', 'Retinol', 'active', false, true, false, 'Vitamin A gold standard'),
('RETINAL', 'retinal', 'Retinal', 'active', false, true, false, 'Retinaldehyde'),
('RETINYL PALMITATE', 'retinyl palmitate', 'Retinyl Palmitate', 'active', false, true, false, 'Gentle vitamin A'),
('BAKUCHIOL', 'bakuchiol', 'Bakuchiol', 'active', false, true, false, 'Natural retinol alternative'),
('ADENOSINE', 'adenosine', 'Adenosine', 'active', false, true, false, 'K-beauty anti-wrinkle'),
('PEPTIDES', 'peptides', 'Peptides', 'active', false, true, false, 'Skin repair signals'),
('PALMITOYL TRIPEPTIDE-1', 'palmitoyl tripeptide-1', 'Matrixyl', 'active', false, true, false, 'Collagen peptide'),
('PALMITOYL TETRAPEPTIDE-7', 'palmitoyl tetrapeptide-7', 'Matrixyl', 'active', false, true, false, 'Anti-inflammatory peptide'),
('COPPER PEPTIDES', 'copper peptides', 'Copper Peptides', 'active', false, true, false, 'Wound healing'),
('ARGIRELINE', 'argireline', 'Argireline', 'active', false, true, false, 'Expression line peptide'),
('ACETYL HEXAPEPTIDE-8', 'acetyl hexapeptide-8', 'Argireline', 'active', false, true, false, 'Argireline INCI'),
('COENZYME Q10', 'coenzyme q10', 'CoQ10', 'antioxidant', false, true, false, 'Cellular energy'),
('UBIQUINONE', 'ubiquinone', 'CoQ10', 'antioxidant', false, true, false, 'CoQ10 INCI'),

-- ACTIVES - EXFOLIANTS
('GLYCOLIC ACID', 'glycolic acid', 'Glycolic Acid', 'exfoliant', false, true, false, 'Strongest AHA'),
('LACTIC ACID', 'lactic acid', 'Lactic Acid', 'exfoliant', false, true, false, 'Gentle hydrating AHA'),
('MANDELIC ACID', 'mandelic acid', 'Mandelic Acid', 'exfoliant', false, true, false, 'Large molecule gentle AHA'),
('SALICYLIC ACID', 'salicylic acid', 'Salicylic Acid', 'exfoliant', false, true, false, 'BHA penetrates pores'),
('AZELAIC ACID', 'azelaic acid', 'Azelaic Acid', 'active', false, true, false, 'Anti-acne and brightening'),
('GLUCONOLACTONE', 'gluconolactone', 'Gluconolactone', 'exfoliant', false, true, false, 'PHA very gentle'),
('LACTOBIONIC ACID', 'lactobionic acid', 'Lactobionic Acid', 'exfoliant', false, true, false, 'PHA antioxidant'),
('POLYHYDROXY ACIDS', 'polyhydroxy acids', 'PHA', 'exfoliant', false, true, false, 'Gentle exfoliant class'),

-- SOOTHING
('CENTELLA ASIATICA EXTRACT', 'centella asiatica extract', 'Centella', 'active', false, true, false, 'Cica healing'),
('MADECASSOSIDE', 'madecassoside', 'Madecassoside', 'active', false, true, false, 'Centella active'),
('ASIATICOSIDE', 'asiaticoside', 'Asiaticoside', 'active', false, true, false, 'Centella healing'),
('MADECASSIC ACID', 'madecassic acid', 'Madecassic Acid', 'active', false, true, false, 'Centella component'),
('ALLANTOIN', 'allantoin', 'Allantoin', 'conditioning', false, false, false, 'Soothing and healing'),
('PANTHENOL', 'panthenol', 'Pro-Vitamin B5', 'conditioning', false, false, false, 'Healing vitamin'),
('BISABOLOL', 'bisabolol', 'Bisabolol', 'conditioning', false, false, false, 'From chamomile'),
('ALOE VERA', 'aloe vera', 'Aloe Vera', 'conditioning', false, false, false, 'Soothing plant'),
('ALOE BARBADENSIS LEAF EXTRACT', 'aloe barbadensis leaf extract', 'Aloe Vera', 'conditioning', false, false, false, 'Aloe INCI'),
('CHAMOMILE EXTRACT', 'chamomile extract', 'Chamomile', 'conditioning', false, false, false, 'Anti-inflammatory'),
('MATRICARIA CHAMOMILLA EXTRACT', 'matricaria chamomilla extract', 'Chamomile', 'conditioning', false, false, false, 'Chamomile INCI'),
('CALENDULA EXTRACT', 'calendula extract', 'Calendula', 'conditioning', false, false, false, 'Healing flower'),
('CALENDULA OFFICINALIS EXTRACT', 'calendula officinalis extract', 'Calendula', 'conditioning', false, false, false, 'Calendula INCI'),
('BETA-GLUCAN', 'beta-glucan', 'Beta Glucan', 'conditioning', false, false, false, 'Soothing polysaccharide'),

-- ANTIOXIDANTS
('GREEN TEA EXTRACT', 'green tea extract', 'Green Tea', 'antioxidant', false, true, false, 'Powerful antioxidant'),
('CAMELLIA SINENSIS LEAF EXTRACT', 'camellia sinensis leaf extract', 'Green Tea', 'antioxidant', false, true, false, 'Green tea INCI'),
('TOCOPHEROL', 'tocopherol', 'Vitamin E', 'antioxidant', false, false, false, 'Natural antioxidant'),
('TOCOPHERYL ACETATE', 'tocopheryl acetate', 'Vitamin E Acetate', 'antioxidant', false, false, false, 'Stable vitamin E'),
('FERULIC ACID', 'ferulic acid', 'Ferulic Acid', 'antioxidant', false, true, false, 'Boosts vitamin C'),
('RESVERATROL', 'resveratrol', 'Resveratrol', 'antioxidant', false, true, false, 'From grapes'),

-- BARRIER SUPPORT
('CERAMIDE NP', 'ceramide np', 'Ceramide NP', 'emollient', false, true, false, 'Barrier lipid'),
('CERAMIDE AP', 'ceramide ap', 'Ceramide AP', 'emollient', false, true, false, 'Barrier lipid'),
('CERAMIDE EOP', 'ceramide eop', 'Ceramide EOP', 'emollient', false, true, false, 'Barrier lipid'),
('CHOLESTEROL', 'cholesterol', 'Cholesterol', 'emollient', false, false, false, 'Barrier lipid'),
('PHYTOSPHINGOSINE', 'phytosphingosine', 'Phytosphingosine', 'conditioning', false, false, false, 'Ceramide precursor'),
('FATTY ACIDS', 'fatty acids', 'Fatty Acids', 'emollient', false, false, false, 'Barrier support'),

-- SURFACTANTS
('SODIUM LAURYL SULFATE', 'sodium lauryl sulfate', 'SLS', 'surfactant', false, false, false, 'Harsh cleanser'),
('SODIUM LAURETH SULFATE', 'sodium laureth sulfate', 'SLES', 'surfactant', false, false, false, 'Milder than SLS'),
('COCAMIDOPROPYL BETAINE', 'cocamidopropyl betaine', 'Cocamidopropyl Betaine', 'surfactant', false, false, false, 'Gentle coconut cleanser'),
('SODIUM COCOYL ISETHIONATE', 'sodium cocoyl isethionate', 'SCI', 'surfactant', false, false, false, 'Very gentle solid'),
('DECYL GLUCOSIDE', 'decyl glucoside', 'Decyl Glucoside', 'surfactant', false, false, false, 'Sugar-based gentle'),
('LAURYL GLUCOSIDE', 'lauryl glucoside', 'Lauryl Glucoside', 'surfactant', false, false, false, 'Gentle cleanser'),
('COCO-GLUCOSIDE', 'coco-glucoside', 'Coco Glucoside', 'surfactant', false, false, false, 'Mild coconut cleanser'),

-- PRESERVATIVES
('PHENOXYETHANOL', 'phenoxyethanol', 'Phenoxyethanol', 'preservative', false, false, true, 'Common preservative'),
('ETHYLHEXYLGLYCERIN', 'ethylhexylglycerin', 'Ethylhexylglycerin', 'preservative', false, false, true, 'Preservative booster'),
('BENZYL ALCOHOL', 'benzyl alcohol', 'Benzyl Alcohol', 'preservative', false, false, true, 'Can sensitize'),
('SODIUM BENZOATE', 'sodium benzoate', 'Sodium Benzoate', 'preservative', false, false, true, 'Food-grade'),
('POTASSIUM SORBATE', 'potassium sorbate', 'Potassium Sorbate', 'preservative', false, false, true, 'Gentle preservative'),
('METHYLPARABEN', 'methylparaben', 'Methylparaben', 'preservative', false, false, true, 'Paraben'),
('PROPYLPARABEN', 'propylparaben', 'Propylparaben', 'preservative', false, false, true, 'Paraben'),
('CHLORPHENESIN', 'chlorphenesin', 'Chlorphenesin', 'preservative', false, false, true, 'Preservative'),

-- FRAGRANCE & ESSENTIAL OILS
('PARFUM', 'parfum', 'Fragrance', 'fragrance', true, false, false, 'Fragrance blend'),
('FRAGRANCE', 'fragrance', 'Fragrance', 'fragrance', true, false, false, 'Fragrance US'),
('LAVENDER OIL', 'lavender oil', 'Lavender Oil', 'fragrance', true, false, false, 'Essential oil'),
('LAVANDULA ANGUSTIFOLIA OIL', 'lavandula angustifolia oil', 'Lavender Oil', 'fragrance', true, false, false, 'Lavender INCI'),
('TEA TREE OIL', 'tea tree oil', 'Tea Tree Oil', 'active', true, true, false, 'Antibacterial EO'),
('MELALEUCA ALTERNIFOLIA LEAF OIL', 'melaleuca alternifolia leaf oil', 'Tea Tree Oil', 'active', true, true, false, 'Tea tree INCI'),
('EUCALYPTUS OIL', 'eucalyptus oil', 'Eucalyptus Oil', 'fragrance', true, false, false, 'Can irritate'),
('PEPPERMINT OIL', 'peppermint oil', 'Peppermint Oil', 'fragrance', true, false, false, 'Cooling but irritating'),
('MENTHA PIPERITA OIL', 'mentha piperita oil', 'Peppermint Oil', 'fragrance', true, false, false, 'Peppermint INCI'),
('ROSEMARY OIL', 'rosemary oil', 'Rosemary Oil', 'fragrance', true, false, false, 'Herbal EO'),
('CITRUS OILS', 'citrus oils', 'Citrus Oils', 'fragrance', true, false, false, 'Photosensitizing'),

-- EU 26 FRAGRANCE ALLERGENS
('LINALOOL', 'linalool', 'Linalool', 'fragrance', true, false, false, 'EU allergen'),
('LIMONENE', 'limonene', 'Limonene', 'fragrance', true, false, false, 'EU allergen'),
('CITRONELLOL', 'citronellol', 'Citronellol', 'fragrance', true, false, false, 'EU allergen'),
('GERANIOL', 'geraniol', 'Geraniol', 'fragrance', true, false, false, 'EU allergen'),
('EUGENOL', 'eugenol', 'Eugenol', 'fragrance', true, false, false, 'EU allergen'),
('COUMARIN', 'coumarin', 'Coumarin', 'fragrance', true, false, false, 'EU allergen'),
('CITRAL', 'citral', 'Citral', 'fragrance', true, false, false, 'EU allergen'),
('BENZYL BENZOATE', 'benzyl benzoate', 'Benzyl Benzoate', 'fragrance', true, false, false, 'EU allergen'),
('BENZYL SALICYLATE', 'benzyl salicylate', 'Benzyl Salicylate', 'fragrance', true, false, false, 'EU allergen'),

-- SUNSCREEN FILTERS
('ZINC OXIDE', 'zinc oxide', 'Zinc Oxide', 'uv_filter', false, true, false, 'Physical broad spectrum'),
('TITANIUM DIOXIDE', 'titanium dioxide', 'Titanium Dioxide', 'uv_filter', false, true, false, 'Physical UVB'),
('AVOBENZONE', 'avobenzone', 'Avobenzone', 'uv_filter', false, true, false, 'Chemical UVA'),
('BUTYL METHOXYDIBENZOYLMETHANE', 'butyl methoxydibenzoylmethane', 'Avobenzone', 'uv_filter', false, true, false, 'Avobenzone INCI'),
('OCTINOXATE', 'octinoxate', 'Octinoxate', 'uv_filter', false, true, false, 'Chemical UVB'),
('ETHYLHEXYL METHOXYCINNAMATE', 'ethylhexyl methoxycinnamate', 'Octinoxate', 'uv_filter', false, true, false, 'Octinoxate INCI'),
('HOMOSALATE', 'homosalate', 'Homosalate', 'uv_filter', false, true, false, 'Chemical UVB'),
('OCTOCRYLENE', 'octocrylene', 'Octocrylene', 'uv_filter', false, true, false, 'Chemical filter'),
('OCTISALATE', 'octisalate', 'Octisalate', 'uv_filter', false, true, false, 'Chemical UVB'),
('ETHYLHEXYL SALICYLATE', 'ethylhexyl salicylate', 'Octisalate', 'uv_filter', false, true, false, 'Octisalate INCI'),
('ENSULIZOLE', 'ensulizole', 'Ensulizole', 'uv_filter', false, true, false, 'Water-soluble UVB'),
('TINOSORB S', 'tinosorb s', 'Tinosorb S', 'uv_filter', false, true, false, 'Modern broad spectrum'),
('TINOSORB M', 'tinosorb m', 'Tinosorb M', 'uv_filter', false, true, false, 'Modern broad spectrum'),
('UVINUL A PLUS', 'uvinul a plus', 'Uvinul A Plus', 'uv_filter', false, true, false, 'Photostable UVA'),

-- MISC COMMON
('STEARIC ACID', 'stearic acid', 'Stearic Acid', 'emollient', false, false, false, 'Fatty acid'),
('PALMITIC ACID', 'palmitic acid', 'Palmitic Acid', 'emollient', false, false, false, 'Fatty acid'),
('CARBOMER', 'carbomer', 'Carbomer', 'viscosity_modifier', false, false, false, 'Thickener'),
('XANTHAN GUM', 'xanthan gum', 'Xanthan Gum', 'viscosity_modifier', false, false, false, 'Natural thickener'),
('SODIUM HYDROXIDE', 'sodium hydroxide', 'Sodium Hydroxide', 'ph_adjuster', false, false, false, 'pH adjuster'),
('CITRIC ACID', 'citric acid', 'Citric Acid', 'ph_adjuster', false, false, false, 'pH adjuster'),
('DISODIUM EDTA', 'disodium edta', 'EDTA', 'chelating', false, false, false, 'Chelating agent'),
('ALCOHOL DENAT', 'alcohol denat', 'Denatured Alcohol', 'solvent', false, false, false, 'Can be drying');

-- ============================================================================
-- STEP 13: SEED INGREDIENT TAGS (LINKING INGREDIENTS TO TAG TYPES)
-- ============================================================================

-- Humectants
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.95 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('glycerin', 'butylene glycol', 'propylene glycol', 'hyaluronic acid', 'sodium hyaluronate', 'pentylene glycol', '1,2-hexanediol', 'betaine', 'sorbitol', 'urea') AND t.name = 'humectant';

INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('glycerin', 'hyaluronic acid', 'sodium hyaluronate', 'urea') AND t.name = 'hydrating';

-- Light Emollients
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('squalane', 'caprylic/capric triglyceride', 'isononyl isononanoate', 'ethylhexyl palmitate', 'dicaprylyl carbonate', 'simmondsia chinensis seed oil', 'jojoba oil') AND t.name = 'emollient_light';

-- Heavy Emollients
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('shea butter', 'butyrospermum parkii butter', 'cocoa butter', 'theobroma cacao seed butter', 'mango butter', 'mangifera indica seed butter', 'cocos nucifera oil', 'coconut oil') AND t.name = 'emollient_heavy';

-- Light Occlusives
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('dimethicone', 'cyclopentasiloxane', 'cyclohexasiloxane', 'squalane') AND t.name = 'occlusive_light';

-- Heavy Occlusives
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.95 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('petrolatum', 'mineral oil', 'paraffinum liquidum', 'lanolin', 'beeswax', 'cera alba') AND t.name = 'occlusive_heavy';

-- Comedogenic Risk - Very High
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'very_high', 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('isopropyl myristate', 'isopropyl palmitate', 'myristyl myristate') AND t.name = 'comedogenic_risk';

-- Comedogenic Risk - High
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'high', 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('cocos nucifera oil', 'coconut oil', 'cocoa butter', 'theobroma cacao seed butter') AND t.name = 'comedogenic_risk';

-- Comedogenic Risk - Medium
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'medium', 0.70 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('mineral oil', 'paraffinum liquidum', 'lanolin', 'olea europaea fruit oil', 'olive oil') AND t.name = 'comedogenic_risk';

-- Comedogenic Risk - Low
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'low', 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('squalane', 'shea butter', 'butyrospermum parkii butter', 'argan oil', 'argania spinosa kernel oil', 'helianthus annuus seed oil', 'sunflower oil') AND t.name = 'comedogenic_risk';

-- Anti-Inflammatory
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('niacinamide', 'centella asiatica extract', 'madecassoside', 'asiaticoside', 'madecassic acid', 'allantoin', 'panthenol', 'bisabolol', 'aloe vera', 'aloe barbadensis leaf extract', 'chamomile extract', 'matricaria chamomilla extract', 'calendula extract', 'calendula officinalis extract', 'beta-glucan', 'azelaic acid') AND t.name = 'anti_inflammatory';

-- Soothing
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('centella asiatica extract', 'madecassoside', 'asiaticoside', 'allantoin', 'panthenol', 'bisabolol', 'aloe vera', 'aloe barbadensis leaf extract', 'chamomile extract', 'matricaria chamomilla extract', 'calendula extract', 'calendula officinalis extract', 'beta-glucan') AND t.name = 'soothing';

-- Barrier Supportive
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('ceramide np', 'ceramide ap', 'ceramide eop', 'cholesterol', 'phytosphingosine', 'fatty acids', 'niacinamide', 'panthenol', 'squalane') AND t.name = 'barrier_supportive';

-- Brightening
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('niacinamide', 'ascorbic acid', 'ascorbyl glucoside', 'sodium ascorbyl phosphate', 'ascorbyl tetraisopalmitate', 'alpha-arbutin', 'tranexamic acid', 'kojic acid', 'licorice root extract', 'glycyrrhiza glabra root extract', 'galactomyces ferment filtrate', 'azelaic acid') AND t.name = 'brightening';

-- Antioxidant
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('ascorbic acid', 'ascorbyl glucoside', 'sodium ascorbyl phosphate', 'ascorbyl tetraisopalmitate', 'tocopherol', 'tocopheryl acetate', 'ferulic acid', 'resveratrol', 'green tea extract', 'camellia sinensis leaf extract', 'coenzyme q10', 'ubiquinone', 'niacinamide') AND t.name = 'antioxidant';

-- Anti-Aging
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('retinol', 'retinal', 'retinyl palmitate', 'bakuchiol', 'adenosine', 'peptides', 'palmitoyl tripeptide-1', 'palmitoyl tetrapeptide-7', 'copper peptides', 'argireline', 'acetyl hexapeptide-8', 'coenzyme q10', 'ubiquinone', 'ascorbic acid', 'niacinamide') AND t.name = 'anti_aging';

-- Sebum Regulating
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('niacinamide', 'salicylic acid', 'azelaic acid', 'zinc oxide') AND t.name = 'sebum_regulating';

-- Anti-Acne
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('salicylic acid', 'azelaic acid', 'niacinamide', 'tea tree oil', 'melaleuca alternifolia leaf oil', 'benzoyl peroxide') AND t.name = 'anti_acne';

-- Exfoliating - High
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'high', 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('glycolic acid', 'salicylic acid') AND t.name = 'exfoliating';

-- Exfoliating - Medium
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'medium', 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('lactic acid', 'mandelic acid', 'azelaic acid') AND t.name = 'exfoliating';

-- Exfoliating - Low
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'low', 0.80 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('gluconolactone', 'lactobionic acid', 'polyhydroxy acids') AND t.name = 'exfoliating';

-- Fragrance
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 1.0 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('parfum', 'fragrance', 'lavender oil', 'lavandula angustifolia oil', 'tea tree oil', 'melaleuca alternifolia leaf oil', 'eucalyptus oil', 'peppermint oil', 'mentha piperita oil', 'rosemary oil', 'citrus oils', 'linalool', 'limonene', 'citronellol', 'geraniol', 'eugenol', 'coumarin', 'citral', 'benzyl benzoate', 'benzyl salicylate') AND t.name = 'fragrance';

-- Essential Oil
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 1.0 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('lavender oil', 'lavandula angustifolia oil', 'tea tree oil', 'melaleuca alternifolia leaf oil', 'eucalyptus oil', 'peppermint oil', 'mentha piperita oil', 'rosemary oil', 'citrus oils') AND t.name = 'essential_oil';

-- EU 26 Allergen
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 1.0 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('linalool', 'limonene', 'citronellol', 'geraniol', 'eugenol', 'coumarin', 'citral', 'benzyl benzoate', 'benzyl salicylate') AND t.name = 'eu_26_allergen';

-- Common Allergen
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('lanolin', 'parfum', 'fragrance', 'benzyl alcohol') AND t.name = 'common_allergen';

-- Irritant Potential - High
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'high', 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('sodium lauryl sulfate', 'alcohol denat', 'peppermint oil', 'mentha piperita oil', 'eucalyptus oil') AND t.name = 'irritant_potential';

-- Irritant Potential - Medium
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'medium', 0.75 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('parfum', 'fragrance', 'lavender oil', 'lavandula angustifolia oil', 'glycolic acid', 'retinol', 'retinal', 'propylene glycol') AND t.name = 'irritant_potential';

-- Irritant Potential - Low
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'low', 0.70 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('lactic acid', 'sodium laureth sulfate', 'ascorbic acid') AND t.name = 'irritant_potential';

-- Sensitizer
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'medium', 0.80 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('benzyl alcohol', 'parfum', 'fragrance') AND t.name = 'sensitizer';

-- Photosensitizing
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('retinol', 'retinal', 'retinyl palmitate', 'citrus oils', 'glycolic acid', 'lactic acid') AND t.name = 'photosensitizing';

-- Drying - High
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'high', 0.85 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('alcohol denat', 'sodium lauryl sulfate') AND t.name = 'drying';

-- Drying - Medium
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_scale, confidence)
SELECT i.id, t.id, 'medium', 0.70 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('glycolic acid', 'salicylic acid', 'retinol') AND t.name = 'drying';

-- Harsh Surfactant
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('sodium lauryl sulfate') AND t.name = 'surfactant_harsh';

-- Gentle Surfactant
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.90 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('cocamidopropyl betaine', 'sodium cocoyl isethionate', 'decyl glucoside', 'lauryl glucoside', 'coco-glucoside') AND t.name = 'surfactant_gentle';

-- Astringent
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.80 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('alcohol denat', 'witch hazel', 'salicylic acid') AND t.name = 'astringent';

-- Pregnancy Caution
INSERT INTO ingredient_tags (ingredient_id, tag_type_id, value_boolean, confidence)
SELECT i.id, t.id, true, 0.95 FROM ingredients i, tag_types t
WHERE i.inci_name_normalized IN ('retinol', 'retinal', 'retinyl palmitate', 'salicylic acid') AND t.name = 'pregnancy_caution';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

SELECT
    'tag_types' as table_name, COUNT(*) as count FROM tag_types
UNION ALL
SELECT 'ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'ingredient_tags', COUNT(*) FROM ingredient_tags;
