const sage = {
  50: '#f3f5f2',
  100: '#e4e9e3',
  200: '#c8d2c6',
  300: '#a6b4a4',
  400: '#869584',
  500: '#6b7d6e',
  600: '#566656',
  700: '#445244',
  800: '#343f35',
  900: '#222a23',
} as const;

const neutralDark = {
  bg: '#161a17',
  surface: '#1d2220',
  surfaceAlt: '#262c28',
  text: '#eef1ec',
  textMuted: '#a8b2a9',
  textSubtle: '#7a847c',
  border: '#2f3631',
  borderStrong: '#404843',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const darkColors = {
  sage,

  primary: sage[300],
  primaryHover: sage[200],
  primaryActive: sage[100],
  primarySubtle: sage[800],
  primaryBorder: sage[700],
  onPrimary: sage[900],

  bg: neutralDark.bg,
  background: neutralDark.bg,
  surface: neutralDark.surface,
  surfaceAlt: neutralDark.surfaceAlt,
  text: neutralDark.text,
  textMuted: neutralDark.textMuted,
  mutedText: neutralDark.textMuted,
  textSubtle: neutralDark.textSubtle,
  border: neutralDark.border,
  borderStrong: neutralDark.borderStrong,
  overlay: neutralDark.overlay,

  success: '#86b07f',
  successSubtle: '#27331f',
  warning: '#d6ac5c',
  warningSubtle: '#3a2e15',
  danger: '#d77c70',
  dangerSubtle: '#3a1e1a',
  info: '#85a8c0',
  infoSubtle: '#1d2c36',
  error: '#d77c70',
  favorite: sage[300],
} as const;
