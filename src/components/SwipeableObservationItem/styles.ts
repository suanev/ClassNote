import styled from 'styled-components/native';

export const SwipeableContainer = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
`;

export const DeleteAction = styled.View`
  width: 104px;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: ${({theme}) => theme.radii['2xl']}px;
  background-color: ${({theme}) => theme.colors.danger};
`;

export const DeleteActionLabel = styled.View`
  margin-top: ${({theme}) => theme.spacing[1]}px;
`;

export const DeleteActionText = styled.Text`
  color: ${({theme}) => theme.colors.onPrimary};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;
