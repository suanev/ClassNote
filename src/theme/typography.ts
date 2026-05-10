export const typography = {
  fontFamily: {
    display: 'Newsreader-Medium',  // titulares, nomes de aluno
    ui: 'Geist-Regular',           // corpo, botões, labels
    mono: 'GeistMono-Regular',     // tempos, timestamps, versão
  },
  // Named font variants for direct use in styled-components
  fonts: {
    displayRegular: 'Newsreader-Regular',
    displayMedium: 'Newsreader-Medium',
    displaySemiBold: 'Newsreader-SemiBold',
    uiRegular: 'Geist-Regular',
    uiMedium: 'Geist-Medium',
    uiSemiBold: 'Geist-SemiBold',
    mono: 'GeistMono-Regular',
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: -0.3,   // -0.01em at ~30px
    normal: 0,
    wide: 0.4,     // 0.04em at ~11px (mono)
    section: 1.1,  // 0.10em at 11px (section labels)
  },
} as const;
