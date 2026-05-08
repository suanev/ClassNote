import styled from 'styled-components/native';

export const SkeletonBlock = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceAlt};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;
