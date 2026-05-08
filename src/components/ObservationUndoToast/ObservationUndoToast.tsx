import React from 'react';
import Reanimated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import {Portal} from 'react-native-paper';

import {
  ActionButton,
  ActionLabel,
  Message,
  ToastCard,
  ToastContainer,
} from './styles';

interface ObservationUndoToastProps {
  message: string;
  actionLabel?: string | null;
  onAction?: () => void;
}

export const ObservationUndoToast = ({
  message,
  actionLabel,
  onAction,
}: ObservationUndoToastProps) => {
  return (
    <Portal>
      <ToastContainer
        as={Reanimated.View}
        entering={FadeInDown.duration(220)}
        exiting={FadeOutDown.duration(180)}>
        <ToastCard>
          <Message>{message}</Message>
          {actionLabel && onAction ? (
            <ActionButton onPress={onAction}>
              <ActionLabel>{actionLabel}</ActionLabel>
            </ActionButton>
          ) : null}
        </ToastCard>
      </ToastContainer>
    </Portal>
  );
};
