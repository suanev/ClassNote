import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const Header = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[5]}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;

export const BackLabel = styled.Text`
  margin-left: ${({theme}) => theme.spacing[1]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const HeaderTitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing[4]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size['3xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.display};
`;

export const Section = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[5]}px;
`;

export const Label = styled.Text`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[3]}px;
`;

export const ChipPressable = styled.Pressable<{$active: boolean}>`
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

export const ChipLabel = styled.Text<{$active: boolean}>`
  color: ${({theme, $active}) => ($active ? theme.colors.primaryActive : theme.colors.text)};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[3]}px;
`;


export const SheetBody = styled.View`
  padding-top: ${({theme}) => theme.spacing[2]}px;
  padding-bottom: ${({theme}) => theme.spacing[6]}px;
`;

export const SheetDescription = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 22px;
  margin-bottom: ${({theme}) => theme.spacing[5]}px;
`;

export const SheetActions = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing[3]}px;
`;
