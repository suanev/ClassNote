import {animations} from './animations';
import {colors} from './colors';
import {shadows} from './shadows';
import {spacing} from './spacing';
import {typography} from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  animations,
};

// ColorPalette describes the shape shared by both light and dark palettes.
// Using a mapped type over the light palette keys ensures both palettes
// are structurally compatible without locking to literal color values.
export type ColorPalette = {
  [K in keyof typeof colors]: string;
};

export type AppTheme = {
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  shadows: typeof shadows;
  animations: typeof animations;
};
