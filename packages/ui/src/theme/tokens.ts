export const tokens = {
  colors: {
    bg: '#0A0A0A',
    surface: '#141414',
    surface2: '#1C1C1C',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#FF6B35',
    accentDim: 'rgba(255, 107, 53, 0.15)',
    text: '#F0EEE9',
    textMuted: '#8A8880',
    textSubtle: '#4A4845',
    success: '#3D8B5F',
    destructive: '#DC2626',
  },
  fonts: {
    display: "'Bricolage Grotesque', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
} as const;

export type Tokens = typeof tokens;
