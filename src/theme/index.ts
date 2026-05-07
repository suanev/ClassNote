import {animations} from './animations';
import {colors}     from './colors';
import {darkColors} from './darkColors';
import {shadowsLight, shadowsDark} from './shadows';
import {spacing}    from './spacing';
import {typography} from './typography';

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  pill: 9999,
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  shadows: shadowsLight,
  animations,
  radii,
  breakpoints,
  zIndex,
};

export const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  shadows: shadowsDark,
  animations,
  radii,
  breakpoints,
  zIndex,
};

type WidenLiterals<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends readonly unknown[] ? {[K in keyof T]: WidenLiterals<T[K]>} :
  T extends object ? {[K in keyof T]: WidenLiterals<T[K]>} :
  T;

export type AppTheme = WidenLiterals<typeof theme>;
export type DarkAppTheme = WidenLiterals<typeof darkTheme>;
