import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const ScreenContainerView = styled(SafeAreaView).attrs<{
  $withBottom: boolean;
}>(({$withBottom}) => ({
  edges: $withBottom ? ['top', 'bottom'] : ['top'],
}))`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;
