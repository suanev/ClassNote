import styled from 'styled-components/native';

interface InputWrapperProps {
  marginTop?: number;
  multiline?: boolean;
  focused?: boolean;
}

export const InputWrapper = styled.View<InputWrapperProps>`
  flex-direction: row;
  align-items: ${({multiline}) => (multiline ? 'flex-start' : 'center')};
  gap: ${({theme}) => theme.spacing[2]}px;
  margin-top: ${({marginTop = 0}) => marginTop}px;
  padding-horizontal: 14px;
  padding-vertical: ${({multiline}) => (multiline ? 12 : 0)}px;
  min-height: ${({multiline}) => (multiline ? 120 : 48)}px;
  border-radius: ${({theme}) => theme.radii.control}px;
  background-color: ${({theme}) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme, focused}) =>
    focused ? theme.colors.primary : theme.colors.border};
`;

export const InputField = styled.TextInput`
  flex: 1;
  min-height: 24px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;
