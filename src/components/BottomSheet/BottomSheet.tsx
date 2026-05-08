import React, {PropsWithChildren, useCallback, useEffect, useRef} from 'react';
import {useWindowDimensions} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import {
  BottomSheetComponent,
  SheetContainer,
  SheetHandle,
  SheetHeader,
  SheetTitle,
} from './styles';

interface BottomSheetProps extends PropsWithChildren {
  headerAction?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const BottomSheet = ({
  headerAction,
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  const {height: windowHeight} = useWindowDimensions();
  const sheetRef = useRef<BottomSheetModal<unknown> | null>(null);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.present();
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    /* istanbul ignore next */
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <BottomSheetComponent
      ref={sheetRef}
      enableDynamicSizing
      maxDynamicContentSize={windowHeight * 0.85}
      enableContentPanningGesture={false}
      enablePanDownToClose
      enableDismissOnClose
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      stackBehavior="push"
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}>
      <BottomSheetView testID="bottom-sheet-content">
        <SheetContainer>
          <SheetHandle />
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
