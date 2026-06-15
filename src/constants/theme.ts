/**
 * Raw theme values for contexts that cannot consume Tailwind classes:
 * navigation themes, status bar, gradients, vector-icon colors, etc.
 * Keep these in sync with the design tokens in tailwind.config.js.
 */
export const Colors = {
  background: '#0F0F0F',
  surface: '#121212',
  elevated: '#1A1A1A',
  primary: '#E50914',
  primaryDark: '#B00710',
  accent: '#F5C518',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#262626',
} as const;

/** Cinematic top→bottom fade used over hero/backdrop imagery. */
export const HeroGradient = [
  'transparent',
  'rgba(15,15,15,0.35)',
  'rgba(15,15,15,0.85)',
  '#0F0F0F',
] as const;

/** Subtle bottom fade for poster cards so overlaid text stays legible. */
export const CardGradient = ['transparent', 'rgba(0,0,0,0.85)'] as const;
