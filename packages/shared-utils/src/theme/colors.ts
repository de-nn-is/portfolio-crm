import type { ThemeConfig } from './types';

/**
 * Shared color palette for the CRM application
 * Using Tailwind color names for consistency
 */
export const THEME_COLORS: ThemeConfig = {
  light: {
    // Primary brand colors
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    accent: '#06b6d4', // cyan-500

    // Backgrounds
    background: '#ffffff', // white
    surface: '#f9fafb', // gray-50

    // Text colors
    text: {
      primary: '#111827', // gray-900
      secondary: '#6b7280', // gray-500
      disabled: '#9ca3af', // gray-400
    },

    // Borders
    border: '#e5e7eb', // gray-200

    // Status colors
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    success: '#10b981', // emerald-500
    info: '#3b82f6', // blue-500
  },
  dark: {
    // Primary brand colors (slightly adjusted for dark mode)
    primary: '#60a5fa', // blue-400
    secondary: '#a78bfa', // violet-400
    accent: '#22d3ee', // cyan-400

    // Backgrounds
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800

    // Text colors
    text: {
      primary: '#f8fafc', // slate-50
      secondary: '#cbd5e1', // slate-300
      disabled: '#64748b', // slate-500
    },

    // Borders
    border: '#334155', // slate-700

    // Status colors
    error: '#f87171', // red-400
    warning: '#fbbf24', // amber-400
    success: '#34d399', // emerald-400
    info: '#60a5fa', // blue-400
  },
};

/**
 * CSS variable names for theme colors
 * These will be used in the CSS and Tailwind config
 */
export const CSS_VARIABLES = {
  primary: '--color-primary',
  secondary: '--color-secondary',
  accent: '--color-accent',
  background: '--color-background',
  surface: '--color-surface',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textDisabled: '--color-text-disabled',
  border: '--color-border',
  error: '--color-error',
  warning: '--color-warning',
  success: '--color-success',
  info: '--color-info',
} as const;

/**
 * Status color mappings (same for both themes, just different shades)
 */
export const STATUS_COLORS = {
  customer: {
    ACTIVE: 'success',
    INACTIVE: 'disabled',
    LEAD: 'info',
  },
  deal: {
    LEAD: 'info',
    IN_PROGRESS: 'warning',
    WON: 'success',
    LOST: 'error',
  },
} as const;
