import styled from 'styled-components/native';

interface ChipButtonProps {
  $active: boolean;
  $dashed: boolean;
}

export const ChipButton = styled.Pressable<ChipButtonProps>`
  height: 36px;
  padding-horizontal: 14px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${({theme, $active}) =>
    $active ? theme.colors.primary : 'transparent'};
  border-color: ${({theme, $active, $dashed}) =>
    $dashed
      ? theme.colors.borderStrong
      : $active
        ? theme.colors.primary
        : theme.colors.border};
`;

interface ChipLabelProps {
  $active: boolean;
}

export const ChipLabel = styled.Text<ChipLabelProps>`
  font-size: 14px;
  line-height: 20px;
  color: ${({theme, $active}) =>
    $active ? theme.colors.surface : theme.colors.text};
  font-family: ${({theme}) =>
    theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui};
`;

export const ChipPlusIcon = styled.Text`
  font-size: 16px;
  line-height: 20px;
  margin-right: 2px;
  color: ${({theme}) => theme.colors.textMuted};
`;
