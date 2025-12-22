// Export all theme-related utilities
export * from './types';
export * from './colors';
export * from './breakpoints';
export * from './spacing';

// Re-export commonly used items
export { THEME_COLORS, CSS_VARIABLES, STATUS_COLORS } from './colors';
export { BREAKPOINTS, matchesBreakpoint } from './breakpoints';
export { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';
export type { ThemeMode, Theme, ThemeColors, ThemeConfig } from './types';
