import Reanimated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const ItemContainer = styled(Reanimated.View)`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
`;

export const DeleteAction = styled.View`
  width: 80px;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: ${({theme}) => theme.radii.card}px;
  background-color: ${({theme}) => theme.colors.danger};
`;
