import React from 'react';
import Reanimated, {FadeInDown, FadeOutUp} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Portal} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ToastLabel, ToastRow, ToastWrapper} from './styles';

const DEFAULT_MESSAGE =
  'Você está offline. Suas alterações ficam salvas no aparelho e serão enviadas para a nuvem assim que a conexão voltar.';

interface NetworkToastProps {
  message?: string;
}

export const NetworkToast = ({message = DEFAULT_MESSAGE}: NetworkToastProps) => {
  const {top} = useSafeAreaInsets();

  return (
    <Portal>
      <ToastWrapper
        as={Reanimated.View}
        entering={FadeInDown.duration(220)}
        exiting={FadeOutUp.duration(180)}
        safeTop={top}>
        <ToastRow>
          <MaterialCommunityIcons name="wifi-off" size={16} color="#ffffff" />
          <ToastLabel>{message}</ToastLabel>
        </ToastRow>
      </ToastWrapper>
    </Portal>
  );
};
