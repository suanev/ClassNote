import styled from 'styled-components/native';

type CardVariant = 'default' | 'dark';

export const CardContainer = styled.View<{$variant: CardVariant; $padding?: number}>`
  background-color: ${({theme, $variant}) =>
    $variant === 'dark' ? theme.colors.primary : theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme, $variant}) =>
    $variant === 'dark' ? theme.colors.primary : theme.colors.border};
  border-radius: ${({theme}) => theme.radii['2xl']}px;
  padding: ${({theme, $padding}) => $padding ?? theme.spacing[4]}px;
  ${({theme, $variant}) => ($variant === 'dark' ? theme.shadows.md : theme.shadows.sm)};
`;
