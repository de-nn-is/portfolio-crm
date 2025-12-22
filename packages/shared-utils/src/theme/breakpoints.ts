/**
 * Shared responsive breakpoints
 * Matches Tailwind's default breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Helper to check if screen width matches a breakpoint
 * Usage: if (matchesBreakpoint('md')) { ... }
 */
export const matchesBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  const width = parseInt(BREAKPOINTS[breakpoint]);
  return window.matchMedia(`(min-width: ${width}px)`).matches;
};
