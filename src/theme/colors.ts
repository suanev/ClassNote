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

const neutralLight = {
  bg: '#e8ece7',
  surface: '#ffffff',
  surfaceAlt: '#f3f5f2',
  text: '#1f2922',
  textMuted: '#4d5e51',
  textSubtle: '#7a8a7c',
  border: '#cdd5cb',
  borderStrong: '#b4bfb2',
  overlay: 'rgba(34, 42, 35, 0.5)',
} as const;

const status = {
  success: '#4f7a4a',
  successSubtle: '#e6efe1',
  warning: '#b3852d',
  warningSubtle: '#f7ecd2',
  danger: '#b04a3f',
  dangerSubtle: '#f5dfdb',
  info: '#4a6f88',
  infoSubtle: '#dfe8ef',
} as const;

export const colors = {
  sage,

  primary: sage[600],
  primaryHover: sage[700],
  primaryActive: sage[800],
  primarySubtle: sage[100],
  primaryBorder: sage[300],
  onPrimary: '#ffffff',

  bg: neutralLight.bg,
  background: neutralLight.bg,
  surface: neutralLight.surface,
  surfaceAlt: neutralLight.surfaceAlt,
  text: neutralLight.text,
  textMuted: neutralLight.textMuted,
  mutedText: neutralLight.textMuted,
  textSubtle: neutralLight.textSubtle,
  border: neutralLight.border,
  borderStrong: neutralLight.borderStrong,
  overlay: neutralLight.overlay,

  ...status,
  error: status.danger,
  favorite: sage[500],
} as const;
