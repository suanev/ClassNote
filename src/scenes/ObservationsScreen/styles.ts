import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.lg}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
`;

export const Description = styled.Text`
  color: ${({theme}) => theme.colors.mutedText};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  line-height: 22px;
`;
