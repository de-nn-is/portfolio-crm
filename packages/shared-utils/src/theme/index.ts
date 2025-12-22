// Export all theme-related utilities
export * from './types.js';
export * from './colors.js';
export * from './breakpoints.js';
export * from './spacing.js';

// Re-export commonly used items
export { THEME_COLORS, CSS_VARIABLES, STATUS_COLORS } from './colors.js';
export { BREAKPOINTS, matchesBreakpoint } from './breakpoints.js';
export { SPACING, BORDER_RADIUS, SHADOWS } from './spacing.js';
export type { ThemeMode, Theme, ThemeColors, ThemeConfig } from './types.js';
