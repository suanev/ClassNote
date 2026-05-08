import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.primarySubtle};
`;

export const ContentContainer = styled.View`
  padding-bottom: ${({theme}) => theme.spacing[4]}px;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleText = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size['4xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.display};
  line-height: 42px;
`;

export const SectionLabel = styled.Text`
  margin-top: ${({theme}) => theme.spacing[5]}px;
  margin-bottom: ${({theme}) => theme.spacing[3]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 1px;
`;

export const BodyText = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 24px;
`;

export const EmptyStateWrapper = styled.View`
  padding-bottom: ${({theme}) => theme.spacing[10]}px;
`;
