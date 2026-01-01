// Han-Skin Design Tokens - Typography

export const typography = {
  // Font families
  fonts: {
    sans: 'System', // Will use Inter when loaded
    script: 'System', // For "Skin" in logo - can swap for custom font
  },

  // Font sizes (in pixels, converted to RN units)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 4,
  },
} as const;
