import styled from 'styled-components/native';

export const InputWrapper = styled.View<{$mt?: number}>`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[2]}px;
  margin-top: ${({$mt = 0}) => $mt}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  height: 52px;
  border-radius: ${({theme}) => theme.radii.xl}px;
  background-color: ${({theme}) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const InputField = styled.TextInput`
  flex: 1;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;
