import React, {memo, useCallback, useRef} from 'react';
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RectButton} from 'react-native-gesture-handler';
import Reanimated, {FadeIn, FadeOutLeft, LinearTransition} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {ObservationListItem} from '@components/ObservationListItem';

import {DeleteAction, DeleteActionLabel, DeleteActionText} from './styles';

interface SwipeableObservationItemProps {
  id: string;
  student: string;
  className: string;
  relativeTime: string;
  text: string;
  isFavorite: boolean;
  isDeleting?: boolean;
  onPress: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: () => void;
}

const SwipeableObservationItemComponent = ({
  id,
  student,
  className,
  relativeTime,
  text,
  isFavorite,
  isDeleting = false,
  onPress,
  onDelete,
  onToggleFavorite,
}: SwipeableObservationItemProps) => {
  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <Reanimated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOutLeft.duration(200)}
      layout={LinearTransition.duration(200)}
      style={{marginBottom: theme.spacing[2]}}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={2}
        overshootRight={false}
        rightThreshold={64}
        /* istanbul ignore next */
        onSwipeableOpen={direction => {
          if (direction === SwipeDirection.RIGHT) {
            handleDelete();
          }
        }}
        renderRightActions={() => (
          <DeleteAction as={RectButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color={theme.colors.onPrimary} />
            <DeleteActionLabel>
              <DeleteActionText>Apagar</DeleteActionText>
            </DeleteActionLabel>
          </DeleteAction>
        )}>
        <ObservationListItem
          student={student}
          className={className}
          relativeTime={relativeTime}
          text={text}
          isFavorite={isFavorite}
          isDisabled={isDeleting}
          onPress={onPress}
          onToggleFavorite={onToggleFavorite}
        />
      </ReanimatedSwipeable>
    </Reanimated.View>
  );
};

export const SwipeableObservationItem = memo(
  SwipeableObservationItemComponent,
  /* istanbul ignore next */
  (prev, next) =>
    prev.id === next.id &&
    prev.student === next.student &&
    prev.className === next.className &&
    prev.relativeTime === next.relativeTime &&
    prev.text === next.text &&
    prev.isFavorite === next.isFavorite &&
    prev.isDeleting === next.isDeleting &&
    prev.onPress === next.onPress &&
    prev.onDelete === next.onDelete &&
    prev.onToggleFavorite === next.onToggleFavorite,
);
