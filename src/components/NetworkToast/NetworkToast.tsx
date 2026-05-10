import React from 'react';
import {Pressable} from 'react-native';
import Reanimated, {FadeInDown, FadeOutUp} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Portal} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {isDev} from '@constants/environment';
import {ToastLabel, ToastRow, ToastWrapper} from './styles';

const DEFAULT_MESSAGES = {
  offline:
    'Você está offline. Suas alterações ficam salvas no aparelho e serão enviadas para a nuvem assim que a conexão voltar.',
  restored: 'Conexão restaurada. Sincronizando suas alterações...',
};

const DEVELOPMENT_MESSAGES = {
  offline:
    'Você está offline. Suas alterações continuam salvas no aparelho. No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
  restored:
    'Conexão restaurada. No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
};

const ICONS = {
  offline: 'wifi-off',
  restored: 'wifi',
};

interface NetworkToastProps {
  status: 'offline' | 'restored';
  onDismiss?: () => void;
}

export const NetworkToast = ({status, onDismiss}: NetworkToastProps) => {
  const {top} = useSafeAreaInsets();
  const messages = isDev ? DEVELOPMENT_MESSAGES : DEFAULT_MESSAGES;

  return (
    <Portal>
      <ToastWrapper
        testID="network-toast"
        as={Reanimated.View}
        entering={FadeInDown.duration(220)}
        exiting={FadeOutUp.duration(180)}
        safeTop={top}>
        <ToastRow status={status}>
          <MaterialCommunityIcons
            name={ICONS[status]}
            size={16}
            color="#ffffff"
            accessibilityLabel={status === 'offline' ? 'Sem conexão' : 'Conexão restaurada'}
          />
          <ToastLabel>{messages[status]}</ToastLabel>
          {onDismiss ? (
            <Pressable
              onPress={onDismiss}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Fechar aviso">
              <MaterialCommunityIcons name="close" size={16} color="#ffffff" />
            </Pressable>
          ) : null}
        </ToastRow>
      </ToastWrapper>
    </Portal>
  );
};
