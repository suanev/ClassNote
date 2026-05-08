import type {AppTheme} from '@theme/index';
import styled from 'styled-components/native';

export type BadgeVariant = 'success' | 'neutral' | 'default';

interface BadgeWrapperProps {
  variant: BadgeVariant;
}

const bgColor = (theme: AppTheme, variant: BadgeVariant) => {
  if (variant === 'success') return theme.colors.successSubtle;
  if (variant === 'neutral') return theme.colors.surfaceAlt;
  return theme.colors.surfaceAlt;
};

const borderColor = (theme: AppTheme, variant: BadgeVariant) => {
  if (variant === 'success') return theme.colors.success;
  if (variant === 'neutral') return theme.colors.borderStrong;
  return theme.colors.border;
};

const textColor = (theme: AppTheme, variant: BadgeVariant) => {
  if (variant === 'success') return theme.colors.success;
  if (variant === 'neutral') return theme.colors.textSubtle;
  return theme.colors.text;
};

export const BadgeWrapper = styled.View<BadgeWrapperProps>`
  align-self: flex-start;
  padding-vertical: ${({theme}) => theme.spacing[1]}px;
  padding-horizontal: ${({theme}) => theme.spacing[2]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme, variant}) => bgColor(theme, variant)};
  border-width: 1px;
  border-color: ${({theme, variant}) => borderColor(theme, variant)};
`;

export const BadgeLabel = styled.Text<BadgeWrapperProps>`
  color: ${({theme, variant}) => textColor(theme, variant)};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;
