import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const ContentContainer = styled.View`
  padding-bottom: ${({theme}) => theme.spacing[4]}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[1]}px;
`;

export const CaptionText = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 1px;
`;

export const TitleText = styled.Text`
  margin-top: ${({theme}) => theme.spacing[3]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size['4xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.display};
  line-height: 42px;
`;

export const GreetingText = styled.Text`
  margin-top: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;

export const GreetingAccent = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
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

export const ChipsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[3]}px;
  margin-top: ${({theme}) => theme.spacing[5]}px;
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

export const BodyText = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 24px;
`;
