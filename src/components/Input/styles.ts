import styled from 'styled-components/native';

export type InputVariant = 'default' | 'multiline';

interface InputWrapperProps {
  marginTop?: number;
  multiline?: boolean;
}

export const InputWrapper = styled.View<InputWrapperProps>`
  flex-direction: row;
  align-items: ${({multiline}) => (multiline ? 'flex-start' : 'center')};
  gap: ${({theme}) => theme.spacing[2]}px;
  margin-top: ${({marginTop = 0}) => marginTop}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  padding-vertical: ${({theme, multiline}) =>
    multiline ? theme.spacing[3] : 0}px;
  min-height: ${({multiline}) => (multiline ? 132 : 52)}px;
  border-radius: ${({theme}) => theme.radii.xl}px;
  background-color: ${({theme}) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const InputField = styled.TextInput`
  flex: 1;
  min-height: 24px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;
