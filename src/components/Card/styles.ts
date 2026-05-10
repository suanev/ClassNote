import styled from 'styled-components/native';

export type CardVariant = 'default' | 'elevated';

interface CardContainerProps {
  variant: CardVariant;
  padding?: number;
}

export const CardContainer = styled.View<CardContainerProps>`
  background-color: ${({theme}) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radii.card}px;
  padding: ${({theme, padding}) => padding ?? theme.spacing[4]}px;
`;
