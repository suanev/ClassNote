import styled from 'styled-components/native';

export const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const FavoriteButton = styled.Pressable`
  margin-left: ${({theme}) => theme.spacing[2]}px;
`;

export const StudentName = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const MetaText = styled.Text`
  margin-top: ${({theme}) => theme.spacing[1]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;

export const ObservationText = styled.Text`
  margin-top: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 24px;
`;
