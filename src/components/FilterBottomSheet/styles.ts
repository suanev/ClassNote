import styled from 'styled-components/native';

export type FilterVariant = 'active' | 'default';

interface ChipPressableProps {
  active: boolean;
}

export const Section = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[5]}px;
`;

export const SectionTitle = styled.Text`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing[3]}px;
`;

export const ChipPressable = styled.Pressable<ChipPressableProps>`
  flex-direction: row;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing[2]}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme, active}) =>
    active ? theme.colors.successSubtle : theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme, active}) =>
    active ? theme.colors.success : theme.colors.borderStrong};
`;

export const ChipLabel = styled.Text<ChipPressableProps>`
  color: ${({theme, active}) => (active ? theme.colors.success : theme.colors.text)};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const SortOption = styled.Pressable<ChipPressableProps>`
  min-height: 48px;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  border-radius: ${({theme}) => theme.radii.xl}px;
  background-color: ${({theme, active}) =>
    active ? theme.colors.successSubtle : theme.colors.surfaceAlt};
  border-width: ${({active}) => (active ? 2 : 1)}px;
  border-color: ${({theme, active}) =>
    active ? theme.colors.success : theme.colors.border};
`;

export const SortOptionLabel = styled.Text<ChipPressableProps>`
  color: ${({theme, active}) => (active ? theme.colors.success : theme.colors.text)};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme, active}) =>
    active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.medium};
`;

export const HeaderResetAction = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[1]}px;
  min-height: 32px;
  padding-horizontal: ${({theme}) => theme.spacing[2]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme}) => theme.colors.dangerSubtle};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.danger};
`;

export const HeaderResetLabel = styled.Text`
  color: ${({theme}) => theme.colors.danger};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;
