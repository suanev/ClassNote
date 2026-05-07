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
  bg: '#fafaf7',
  surface: '#ffffff',
  surfaceAlt: '#f5f6f2',
  text: '#1f2922',
  textMuted: '#5b665e',
  textSubtle: '#8a948c',
  border: '#e3e5e0',
  borderStrong: '#cfd3cb',
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

  primary: sage[500],
  primaryHover: sage[600],
  primaryActive: sage[700],
  primarySubtle: sage[50],
  primaryBorder: sage[200],
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
