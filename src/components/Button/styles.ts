import type {ComponentProps} from 'react';
import {Button as PaperButton} from 'react-native-paper';
import type {AppTheme} from '@theme/index';
import styled from 'styled-components/native';

export type ButtonVariant = 'fill' | 'outline' | 'text' | 'danger';
type PaperButtonMode = ComponentProps<typeof PaperButton>['mode'];

const buttonModeByVariant: Record<ButtonVariant, PaperButtonMode> = {
  fill: 'contained',
  outline: 'outlined',
  text: 'text',
  danger: 'contained',
};

const buttonColor = (theme: AppTheme, variant: ButtonVariant) => {
  if (variant === 'fill') return theme.colors.primary;
  if (variant === 'danger') return theme.colors.danger;
  return 'transparent';
};

const textColor = (theme: AppTheme, variant: ButtonVariant) => {
  if (variant === 'fill' || variant === 'danger') return '#ffffff';
  return theme.colors.primary;
};

export const ButtonComponent = styled(PaperButton).attrs<{
  variant: ButtonVariant;
}>(({theme, variant}) => ({
  compact: false,
  mode: buttonModeByVariant[variant],
  buttonColor: buttonColor(theme, variant),
  textColor: textColor(theme, variant),
  contentStyle: {
    minHeight: 40,
    paddingHorizontal: 4,
  },
  labelStyle: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamily.ui,
    fontWeight: '600',
  },
}))<{minWidth?: number}>`
  ${({minWidth}) => (minWidth ? `min-width: ${minWidth}px;` : '')}
`;
