import styled from 'styled-components/native';

type BadgeVariant = 'success' | 'default';

export const BadgeWrapper = styled.View<{$variant: BadgeVariant}>`
  align-self: flex-start;
  padding-vertical: ${({theme}) => theme.spacing[1]}px;
  padding-horizontal: ${({theme}) => theme.spacing[2]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme, $variant}) =>
    $variant === 'success' ? theme.colors.successSubtle : theme.colors.surfaceAlt};
  border-width: 1px;
  border-color: ${({theme, $variant}) =>
    $variant === 'success' ? theme.colors.success : theme.colors.border};
`;

export const BadgeLabel = styled.Text<{$variant: BadgeVariant}>`
  color: ${({theme, $variant}) =>
    $variant === 'success' ? theme.colors.success : theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;
