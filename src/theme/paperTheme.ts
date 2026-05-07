import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import type {MD3Theme} from 'react-native-paper';

import {colors}     from './colors';
import {darkColors} from './darkColors';

export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary:          colors.primary,
    background:       colors.background,
    surface:          colors.surface,
    onSurface:        colors.text,
    onSurfaceVariant: colors.mutedText,
    outline:          colors.border,
    error:            colors.error,
  },
};

export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary:          darkColors.primary,
    background:       darkColors.background,
    surface:          darkColors.surface,
    onSurface:        darkColors.text,
    onSurfaceVariant: darkColors.mutedText,
    outline:          darkColors.border,
    error:            darkColors.error,
  },
};

export type AppPaperTheme = MD3Theme;
