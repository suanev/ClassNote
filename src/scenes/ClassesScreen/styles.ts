import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SectionLabel = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const PageTitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing[3]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size['4xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.display};
`;

export const SegmentsRow = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing[3]}px;
  margin-top: ${({theme}) => theme.spacing[5]}px;
`;

export const SegmentButton = styled.Pressable<{$active: boolean}>`
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme, $active}) =>
    $active ? theme.colors.primarySubtle : theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme, $active}) =>
    $active ? theme.colors.primary : theme.colors.borderStrong};
`;

export const SegmentLabel = styled.Text<{$active: boolean}>`
  color: ${({theme, $active}) => ($active ? theme.colors.primaryActive : theme.colors.text)};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const SummaryRow = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing[3]}px;
  margin-top: ${({theme}) => theme.spacing[5]}px;
  margin-bottom: ${({theme}) => theme.spacing[1]}px;
`;

export const StatValue = styled.Text<{$inverse?: boolean}>`
  color: ${({theme, $inverse}) => ($inverse ? theme.colors.onPrimary : theme.colors.text)};
  font-size: ${({theme}) => theme.typography.size['3xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.bold};
`;

export const StatText = styled.Text<{$inverse?: boolean; muted?: boolean}>`
  margin-top: ${({theme}) => theme.spacing[1]}px;
  color: ${({theme, $inverse, muted}) =>
    $inverse
      ? theme.colors.onPrimary
      : muted
        ? theme.colors.textSubtle
        : theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 20px;
`;

export const CardTitle = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.lg}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  flex: 1;
  margin-right: ${({theme}) => theme.spacing[2]}px;
`;

export const CardMeta = styled.Text`
  margin-top: ${({theme}) => theme.spacing[1]}px;
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textSubtle};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;

export const EmptyStateWrapper = styled.View`
  padding-top: ${({theme}) => theme.spacing[10]}px;
`;
