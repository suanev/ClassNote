import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import type {MD3Theme} from 'react-native-paper';

import {colors}     from './colors';
import {darkColors} from './darkColors';

export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primarySubtle,
    onPrimaryContainer: colors.primaryActive,
    background: colors.bg,
    surface: colors.surface,
    surfaceVariant: colors.surfaceAlt,
    onSurface: colors.text,
    onSurfaceVariant: colors.textMuted,
    outline: colors.border,
    outlineVariant: colors.borderStrong,
    error: colors.danger,
    errorContainer: colors.dangerSubtle,
    secondary: colors.info,
    secondaryContainer: colors.infoSubtle,
    tertiary: colors.success,
    tertiaryContainer: colors.successSubtle,
  },
};

export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primarySubtle,
    onPrimaryContainer: darkColors.primaryHover,
    background: darkColors.bg,
    surface: darkColors.surface,
    surfaceVariant: darkColors.surfaceAlt,
    onSurface: darkColors.text,
    onSurfaceVariant: darkColors.textMuted,
    outline: darkColors.border,
    outlineVariant: darkColors.borderStrong,
    error: darkColors.danger,
    errorContainer: darkColors.dangerSubtle,
    secondary: darkColors.info,
    secondaryContainer: darkColors.infoSubtle,
    tertiary: darkColors.success,
    tertiaryContainer: darkColors.successSubtle,
  },
};

export type AppPaperTheme = MD3Theme;
