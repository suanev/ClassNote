import styled from 'styled-components/native';

export const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: ${({theme}) => theme.colors.surfaceAlt};
`;

export const ErrorTitle = styled.Text`
  font-size: ${({theme}) => theme.typography.size.xl}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 12px;
  text-align: center;
`;

export const ErrorDescription = styled.Text`
  font-size: ${({theme}) => theme.typography.size.md}px;
  color: ${({theme}) => theme.colors.textMuted};
  text-align: center;
  line-height: 22px;
  margin-bottom: 32px;
`;

export const RetryButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 28px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.radii.pill}px;
`;

export const RetryButtonLabel = styled.Text`
  color: ${({theme}) => theme.colors.onPrimary};
  font-weight: 600;
  font-size: ${({theme}) => theme.typography.size.md}px;
`;
