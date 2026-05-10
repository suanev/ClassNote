import styled from 'styled-components/native';

export const HintText = styled.Text`
  margin: 4px 0 16px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;
