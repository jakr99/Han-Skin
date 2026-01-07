// Han-Skin Unified Design System
// Single source of truth for all design tokens

export const theme = {
  // ─────────────────────────────────────────────────────────────
  // COLORS
  // ─────────────────────────────────────────────────────────────
  colors: {
    // Core palette
    primary: '#111111',           // Primary buttons, active states
    background: '#FAFAF8',        // App background
    card: '#FFFFFF',              // Card surfaces

    // Text hierarchy
    text: {
      primary: '#1F2937',         // Headings, primary content
      secondary: '#6B7280',       // Descriptions, labels
      muted: '#9CA3AF',           // Placeholders, disabled
      inverse: '#FFFFFF',         // Text on dark backgrounds
    },

    // Borders & dividers
    border: {
      default: 'rgba(17, 24, 39, 0.08)',
      strong: 'rgba(17, 24, 39, 0.12)',
      input: '#E5E2DE',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(17, 24, 39, 0.04)',
      pressed: 'rgba(17, 24, 39, 0.08)',
      disabled: 'rgba(17, 24, 39, 0.04)',
    },

    // Status colors
    status: {
      success: '#10B981',
      successBg: '#ECFDF5',
      warning: '#F59E0B',
      warningBg: '#FFFBEB',
      error: '#EF4444',
      errorBg: '#FEF2F2',
      info: '#3B82F6',
      infoBg: '#EFF6FF',
    },

    // Score colors (for ingredient safety)
    score: {
      excellent: '#10B981',       // 90-100
      good: '#34D399',            // 70-89
      moderate: '#FBBF24',        // 50-69
      poor: '#F97316',            // 30-49
      bad: '#EF4444',             // 0-29
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYPOGRAPHY
  // ─────────────────────────────────────────────────────────────
  typography: {
    // Font sizes (limited to 5 for consistency)
    size: {
      xs: 12,
      sm: 13,
      base: 15,
      lg: 17,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
    },

    // Font weights (limited to 3)
    weight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },

    // Letter spacing
    tracking: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },

    // Line heights
    leading: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // SPACING
  // ─────────────────────────────────────────────────────────────
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },

  // ─────────────────────────────────────────────────────────────
  // BORDER RADIUS
  // ─────────────────────────────────────────────────────────────
  radius: {
    sm: 8,
    md: 12,
    lg: 14,
    xl: 18,
    '2xl': 24,
    full: 9999,
  },

  // ─────────────────────────────────────────────────────────────
  // SHADOWS
  // ─────────────────────────────────────────────────────────────
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.10,
      shadowRadius: 20,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
      elevation: 8,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // COMPONENT SIZES
  // ─────────────────────────────────────────────────────────────
  components: {
    // Button heights
    button: {
      sm: 40,
      md: 48,
      lg: 56,
    },

    // Input heights
    input: {
      sm: 40,
      md: 48,
      lg: 56,
    },

    // Icon sizes
    icon: {
      xs: 16,
      sm: 18,
      md: 20,
      lg: 24,
      xl: 28,
      '2xl': 32,
    },

    // Avatar sizes
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },

    // Header height
    header: 56,

    // Tab bar height
    tabBar: 80,
  },

  // ─────────────────────────────────────────────────────────────
  // ANIMATION
  // ─────────────────────────────────────────────────────────────
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeShadow = keyof typeof theme.shadows;
export type ThemeRadius = keyof typeof theme.radius;
export type ThemeSpacing = keyof typeof theme.spacing;
