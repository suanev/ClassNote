import styled from 'styled-components/native';

interface ActiveProps {
  active: boolean;
}

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  margin-bottom: 10px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
  letter-spacing: 1.1px;
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SortOption = styled.Pressable`
  min-height: 48px;
  justify-content: center;
  margin-bottom: 4px;
`;

export const SortOptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const RadioOuter = styled.View<ActiveProps>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({theme, active}) =>
    active ? theme.colors.primary : theme.colors.borderStrong};
  align-items: center;
  justify-content: center;
`;

export const RadioDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const SortOptionLabel = styled.Text<ActiveProps>`
  color: ${({theme, active}) => (active ? theme.colors.text : theme.colors.textMutedStrong)};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({active}) => (active ? '500' : '400')};
`;

export const HeaderResetAction = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding-horizontal: 10px;
  border-radius: 6px;
  background-color: ${({theme}) => theme.colors.dangerSubtle};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.danger};
`;

export const HeaderResetLabel = styled.Text`
  color: ${({theme}) => theme.colors.danger};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
`;
