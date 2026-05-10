import styled from 'styled-components/native';

export const EmptyWrapper = styled.View`
  align-items: center;
  padding: 32px 24px;
  margin-top: 12px;
`;

export const IconBadge = styled.View`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primarySubtle};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const Title = styled.Text`
  margin-top: 20px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.lg}px;
  font-family: ${({theme}) => theme.typography.fonts.displayMedium};
  line-height: 24px;
  text-align: center;
`;

export const ActionWrapper = styled.View`
  margin-top: 24px;
  align-self: stretch;
`;

export const Description = styled.Text`
  margin-top: 8px;
  color: ${({theme}) => theme.colors.textMutedStrong};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 22px;
  text-align: center;
`;
