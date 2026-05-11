import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import {Platform, useWindowDimensions} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  BottomSheetComponent,
  SheetContainer,
  SheetHandle,
  SheetHeader,
  SheetTitle,
} from './styles';

interface BottomSheetProps extends PropsWithChildren {
  disableClose?: boolean;
  headerAction?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const BottomSheet = ({
  disableClose = false,
  headerAction,
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  const {height: windowHeight} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal<unknown> | null>(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const contentBottomInset = Math.max(bottom, 12);
  const shouldRender = isMounted || isOpen;

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    if (isOpen) {
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [isOpen, shouldRender]);

  const renderBackdrop = useCallback(
    /* istanbul ignore next */
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={disableClose ? 'none' : 'close'}
        opacity={0.4}
      />
    ),
    [disableClose],
  );

  const handleDismiss = useCallback(() => {
    setIsMounted(false);
    onClose();
  }, [onClose]);

  /* istanbul ignore next -- gorhom modal ref is mocked in unit tests */
  const handleDismissPress = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <BottomSheetComponent
      ref={sheetRef}
      enableDynamicSizing
      maxDynamicContentSize={windowHeight * 0.85}
      enableContentPanningGesture={false}
      enablePanDownToClose={!disableClose}
      enableDismissOnClose={!disableClose}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'fillParent'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      stackBehavior="push"
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}>
      <BottomSheetView testID="bottom-sheet-content">
        <SheetContainer $bottomInset={contentBottomInset}>
          <SheetHandle
            onPress={disableClose ? undefined : handleDismissPress}
            disabled={disableClose}
            testID="bottom-sheet-dismiss"
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
          />
          {title ? (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              {headerAction}
            </SheetHeader>
          ) : null}
          {children}
        </SheetContainer>
      </BottomSheetView>
    </BottomSheetComponent>
  );
};
