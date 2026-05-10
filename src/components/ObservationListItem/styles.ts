import styled from 'styled-components/native';

export const CardInner = styled.View`
  gap: 0px;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const FavoriteButton = styled.Pressable`
  margin-left: ${({theme}) => theme.spacing[2]}px;
  margin-top: 2px;
`;

export const StudentName = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.lg}px;
  font-family: ${({theme}) => theme.typography.fonts.displayMedium};
  line-height: 24px;
`;

export const MetaText = styled.Text`
  margin-top: 4px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 18px;
`;

export const ObservationText = styled.Text`
  margin-top: 6px;
  color: ${({theme}) => theme.colors.textMutedStrong};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 22px;
`;

export const DashedSeparator = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  border-top-width: 1px;
  border-style: dashed;
  border-color: ${({theme}) => theme.colors.border};
`;

export const TimeText = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.mono};
  line-height: 14px;
  letter-spacing: 0.4px;
`;
