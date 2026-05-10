import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const ContentContainer = styled.View`
  padding-bottom: 8px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const SectionLabel = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
  letter-spacing: 1.1px;
`;

export const CountLabel = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.mono};
  letter-spacing: 0.4px;
`;

export const EmptyStateWrapper = styled.View`
  padding-top: 40px;
  padding-bottom: ${({theme}) => theme.spacing[10]}px;
`;

export const HeaderActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-right: 4px;
`;

export const FilterGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const LoadingFooter = styled.View`
  padding-vertical: 24px;
  align-items: center;
`;

export const listContentStyle = {
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 140,
} as const;
