import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.xl}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.bold};
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
`;

export const Description = styled.Text`
  color: ${({theme}) => theme.colors.mutedText};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  line-height: 22px;
`;
