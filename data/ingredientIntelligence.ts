// =============================================================================
// Ingredient Intelligence Map - Han Skin
// A starter database of common skincare ingredients with benefits and risks
// =============================================================================

import type {
  IngredientIntelligenceMap,
  IngredientBenefit,
  IngredientRisk,
} from '@/types/scanner';

export const INGREDIENT_INTELLIGENCE: IngredientIntelligenceMap = {
  // ---------------------------------------------------------------------------
  // HYDRATING INGREDIENTS
  // ---------------------------------------------------------------------------
  'hyaluronic acid': {
    canonicalName: 'Hyaluronic Acid',
    aliases: ['sodium hyaluronate', 'ha', 'hyaluronan'],
    benefits: ['hydrating', 'barrier'],
    risks: [],
    description: 'Powerful humectant that holds up to 1000x its weight in water',
  },
  glycerin: {
    canonicalName: 'Glycerin',
    aliases: ['glycerine', 'vegetable glycerin'],
    benefits: ['hydrating', 'barrier'],
    risks: [],
    description: 'Humectant that draws moisture to skin',
  },
  squalane: {
    canonicalName: 'Squalane',
    aliases: ['squalene'],
    benefits: ['hydrating', 'barrier', 'soothing'],
    risks: [],
    description: 'Lightweight oil that mimics skin natural sebum',
  },
  'panthenol': {
    canonicalName: 'Panthenol',
    aliases: ['pro-vitamin b5', 'vitamin b5', 'd-panthenol'],
    benefits: ['hydrating', 'soothing', 'barrier'],
    risks: [],
    description: 'Provitamin that deeply moisturizes and soothes',
  },
  ceramides: {
    canonicalName: 'Ceramides',
    aliases: ['ceramide np', 'ceramide ap', 'ceramide eop'],
    benefits: ['barrier', 'hydrating'],
    risks: [],
    description: 'Lipids that strengthen skin barrier',
  },

  // ---------------------------------------------------------------------------
  // SOOTHING INGREDIENTS
  // ---------------------------------------------------------------------------
  'aloe vera': {
    canonicalName: 'Aloe Vera',
    aliases: ['aloe barbadensis', 'aloe barbadensis leaf juice', 'aloe'],
    benefits: ['soothing', 'hydrating'],
    risks: [],
    description: 'Natural soothing and hydrating plant extract',
  },
  centella: {
    canonicalName: 'Centella Asiatica',
    aliases: ['cica', 'gotu kola', 'centella asiatica extract', 'madecassoside'],
    benefits: ['soothing', 'barrier', 'anti-aging'],
    risks: [],
    description: 'Powerful soothing ingredient that repairs skin barrier',
  },
  allantoin: {
    canonicalName: 'Allantoin',
    aliases: [],
    benefits: ['soothing', 'hydrating'],
    risks: [],
    description: 'Gentle soothing compound derived from comfrey',
  },
  'bisabolol': {
    canonicalName: 'Bisabolol',
    aliases: ['alpha-bisabolol'],
    benefits: ['soothing', 'anti-aging'],
    risks: [],
    description: 'Chamomile-derived soothing agent',
  },
  'oat extract': {
    canonicalName: 'Oat Extract',
    aliases: ['avena sativa', 'colloidal oatmeal'],
    benefits: ['soothing', 'barrier'],
    risks: [],
    description: 'Natural anti-inflammatory from oats',
  },

  // ---------------------------------------------------------------------------
  // BRIGHTENING INGREDIENTS
  // ---------------------------------------------------------------------------
  niacinamide: {
    canonicalName: 'Niacinamide',
    aliases: ['vitamin b3', 'nicotinamide'],
    benefits: ['brightening', 'barrier', 'acne'],
    risks: [],
    description: 'Multi-tasking vitamin that brightens and balances skin',
  },
  'vitamin c': {
    canonicalName: 'Vitamin C',
    aliases: [
      'ascorbic acid',
      'l-ascorbic acid',
      'sodium ascorbyl phosphate',
      'ascorbyl glucoside',
      'ethyl ascorbic acid',
    ],
    benefits: ['brightening', 'antioxidant', 'anti-aging'],
    risks: ['sensitizing'],
    description: 'Potent antioxidant that brightens and protects',
  },
  'alpha arbutin': {
    canonicalName: 'Alpha Arbutin',
    aliases: ['arbutin'],
    benefits: ['brightening'],
    risks: [],
    description: 'Gentle brightening agent from bearberry plant',
  },
  'tranexamic acid': {
    canonicalName: 'Tranexamic Acid',
    aliases: [],
    benefits: ['brightening'],
    risks: [],
    description: 'Targets hyperpigmentation and dark spots',
  },
  'kojic acid': {
    canonicalName: 'Kojic Acid',
    aliases: [],
    benefits: ['brightening'],
    risks: ['sensitizing'],
    description: 'Fermentation-derived brightening agent',
  },
  'licorice root': {
    canonicalName: 'Licorice Root Extract',
    aliases: ['glycyrrhiza glabra', 'licorice extract'],
    benefits: ['brightening', 'soothing'],
    risks: [],
    description: 'Natural brightening and anti-inflammatory',
  },

  // ---------------------------------------------------------------------------
  // ACNE-FIGHTING INGREDIENTS
  // ---------------------------------------------------------------------------
  'salicylic acid': {
    canonicalName: 'Salicylic Acid',
    aliases: ['bha', 'beta hydroxy acid'],
    benefits: ['acne', 'exfoliating'],
    risks: ['drying'],
    description: 'Oil-soluble acid that unclogs pores',
  },
  'benzoyl peroxide': {
    canonicalName: 'Benzoyl Peroxide',
    aliases: ['bp'],
    benefits: ['acne'],
    risks: ['drying', 'irritant'],
    description: 'Antibacterial acne treatment',
  },
  'tea tree oil': {
    canonicalName: 'Tea Tree Oil',
    aliases: ['melaleuca alternifolia', 'tea tree'],
    benefits: ['acne'],
    risks: ['essential_oil', 'irritant'],
    description: 'Natural antibacterial essential oil',
  },
  'zinc': {
    canonicalName: 'Zinc',
    aliases: ['zinc oxide', 'zinc pca'],
    benefits: ['acne', 'soothing'],
    risks: [],
    description: 'Sebum-regulating mineral',
  },
  'azelaic acid': {
    canonicalName: 'Azelaic Acid',
    aliases: [],
    benefits: ['acne', 'brightening'],
    risks: [],
    description: 'Multi-purpose acid for acne and dark spots',
  },

  // ---------------------------------------------------------------------------
  // ANTI-AGING INGREDIENTS
  // ---------------------------------------------------------------------------
  retinol: {
    canonicalName: 'Retinol',
    aliases: ['vitamin a', 'retinyl palmitate', 'retinaldehyde', 'retinoic acid'],
    benefits: ['anti-aging', 'acne', 'exfoliating'],
    risks: ['irritant', 'sensitizing', 'photosensitizing'],
    description: 'Gold standard anti-aging ingredient',
  },
  peptides: {
    canonicalName: 'Peptides',
    aliases: [
      'matrixyl',
      'argireline',
      'copper peptides',
      'palmitoyl tripeptide',
      'acetyl hexapeptide',
    ],
    benefits: ['anti-aging', 'barrier'],
    risks: [],
    description: 'Amino acid chains that signal collagen production',
  },
  bakuchiol: {
    canonicalName: 'Bakuchiol',
    aliases: [],
    benefits: ['anti-aging', 'soothing'],
    risks: [],
    description: 'Plant-based retinol alternative',
  },
  'coenzyme q10': {
    canonicalName: 'Coenzyme Q10',
    aliases: ['coq10', 'ubiquinone'],
    benefits: ['anti-aging', 'antioxidant'],
    risks: [],
    description: 'Antioxidant that supports cellular energy',
  },

  // ---------------------------------------------------------------------------
  // EXFOLIATING INGREDIENTS
  // ---------------------------------------------------------------------------
  'glycolic acid': {
    canonicalName: 'Glycolic Acid',
    aliases: ['aha', 'alpha hydroxy acid'],
    benefits: ['exfoliating', 'brightening', 'anti-aging'],
    risks: ['irritant', 'sensitizing', 'photosensitizing'],
    description: 'Smallest AHA for effective exfoliation',
  },
  'lactic acid': {
    canonicalName: 'Lactic Acid',
    aliases: [],
    benefits: ['exfoliating', 'hydrating', 'brightening'],
    risks: ['sensitizing', 'photosensitizing'],
    description: 'Gentle AHA with hydrating properties',
  },
  'mandelic acid': {
    canonicalName: 'Mandelic Acid',
    aliases: [],
    benefits: ['exfoliating', 'acne', 'brightening'],
    risks: ['photosensitizing'],
    description: 'Large-molecule AHA, gentler on sensitive skin',
  },
  'pha': {
    canonicalName: 'Polyhydroxy Acids',
    aliases: ['gluconolactone', 'lactobionic acid'],
    benefits: ['exfoliating', 'hydrating'],
    risks: [],
    description: 'Gentle exfoliation with hydrating benefits',
  },

  // ---------------------------------------------------------------------------
  // POTENTIALLY PROBLEMATIC INGREDIENTS
  // ---------------------------------------------------------------------------
  fragrance: {
    canonicalName: 'Fragrance',
    aliases: ['parfum', 'perfume', 'aroma'],
    benefits: [],
    risks: ['fragrance', 'irritant', 'sensitizing'],
    description: 'Can cause irritation and sensitization',
  },
  'denatured alcohol': {
    canonicalName: 'Denatured Alcohol',
    aliases: ['alcohol denat', 'sd alcohol', 'ethanol'],
    benefits: [],
    risks: ['drying', 'irritant'],
    description: 'Can strip natural oils and irritate skin',
  },
  'essential oils': {
    canonicalName: 'Essential Oils',
    aliases: [
      'lavender oil',
      'eucalyptus oil',
      'peppermint oil',
      'citrus oil',
      'lemon oil',
      'orange oil',
      'bergamot oil',
    ],
    benefits: [],
    risks: ['essential_oil', 'irritant', 'sensitizing', 'photosensitizing'],
    description: 'Can cause irritation and photosensitivity',
  },
  'sodium lauryl sulfate': {
    canonicalName: 'Sodium Lauryl Sulfate',
    aliases: ['sls'],
    benefits: [],
    risks: ['irritant', 'drying'],
    description: 'Harsh surfactant that can strip skin',
  },
  'coconut oil': {
    canonicalName: 'Coconut Oil',
    aliases: ['cocos nucifera oil'],
    benefits: ['hydrating'],
    risks: ['comedogenic'],
    description: 'Highly comedogenic for acne-prone skin',
  },
  'isopropyl myristate': {
    canonicalName: 'Isopropyl Myristate',
    aliases: [],
    benefits: [],
    risks: ['comedogenic'],
    description: 'Known pore-clogging ingredient',
  },
  'lanolin': {
    canonicalName: 'Lanolin',
    aliases: [],
    benefits: ['hydrating', 'barrier'],
    risks: ['comedogenic'],
    description: 'Rich emollient but can clog pores',
  },
  'mineral oil': {
    canonicalName: 'Mineral Oil',
    aliases: ['paraffinum liquidum', 'petrolatum'],
    benefits: ['barrier'],
    risks: ['comedogenic'],
    description: 'Occlusive that may trap debris in pores',
  },
};

// ---------------------------------------------------------------------------
// HELPER: Concern to Benefit Mapping
// Maps user concerns to ingredient benefits that help address them
// ---------------------------------------------------------------------------
export const CONCERN_TO_BENEFIT_MAP: Record<string, IngredientBenefit[]> = {
  acne: ['acne', 'exfoliating'],
  'uneven tone': ['brightening'],
  'dark spots': ['brightening'],
  hyperpigmentation: ['brightening'],
  redness: ['soothing'],
  sensitivity: ['soothing', 'barrier'],
  dryness: ['hydrating', 'barrier'],
  dehydration: ['hydrating'],
  aging: ['anti-aging', 'antioxidant'],
  'fine lines': ['anti-aging'],
  wrinkles: ['anti-aging'],
  dullness: ['brightening', 'exfoliating'],
  'large pores': ['acne', 'exfoliating'],
  oiliness: ['acne'],
};

// ---------------------------------------------------------------------------
// HELPER: Sensitivity Keywords
// Common sensitivity triggers and their variations
// ---------------------------------------------------------------------------
export const SENSITIVITY_KEYWORDS: Record<string, string[]> = {
  fragrance: ['fragrance', 'parfum', 'perfume', 'aroma'],
  'denatured alcohol': ['alcohol denat', 'sd alcohol', 'denatured alcohol', 'ethanol'],
  'essential oils': [
    'essential oil',
    'lavender oil',
    'eucalyptus oil',
    'peppermint oil',
    'citrus oil',
    'lemon oil',
    'orange oil',
    'bergamot oil',
    'tea tree oil',
    'rosemary oil',
  ],
  sulfates: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles'],
  parabens: ['paraben', 'methylparaben', 'propylparaben', 'butylparaben'],
};
