import {animations} from './animations';
import {colors}     from './colors';
import {shadows}    from './shadows';
import {spacing}    from './spacing';
import {typography} from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  animations,
};

// ColorPalette descreve a forma compartilhada pelas paletas claro e escuro.
// Mapeamento sobre as chaves do tema claro garante compatibilidade estrutural
// sem travar nos valores literais de cor.
export type ColorPalette = {
  [K in keyof typeof colors]: string;
};

export type AppTheme = {
  colors:     ColorPalette;
  typography: typeof typography;
  spacing:    typeof spacing;
  shadows:    typeof shadows;
  animations: typeof animations;
};
