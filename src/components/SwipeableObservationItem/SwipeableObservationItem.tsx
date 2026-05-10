import React, {memo, useCallback, useRef} from 'react';
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RectButton} from 'react-native-gesture-handler';
import {FadeIn, FadeOutLeft, LinearTransition} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {ObservationListItem} from '@components/ObservationListItem';

import {DeleteAction, ItemContainer} from './styles';

interface SwipeableObservationItemProps {
  id: string;
  student: string;
  className: string;
  shift?: string;
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
  shift,
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
    <ItemContainer
      entering={FadeIn.duration(220)}
      exiting={FadeOutLeft.duration(200)}
      layout={LinearTransition.duration(200)}>
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
          <DeleteAction as={RectButton} onPress={handleDelete} testID={`delete-observation-swipe-${id}`}>
            <Feather name="trash-2" size={22} color={theme.colors.onPrimary} />
          </DeleteAction>
        )}>
        <ObservationListItem
          id={id}
          student={student}
          className={className}
          shift={shift}
          relativeTime={relativeTime}
          text={text}
          isFavorite={isFavorite}
          isDisabled={isDeleting}
          onPress={onPress}
          onToggleFavorite={onToggleFavorite}
        />
      </ReanimatedSwipeable>
    </ItemContainer>
  );
};

export const SwipeableObservationItem = memo(
  SwipeableObservationItemComponent,
  /* istanbul ignore next */
  (prev, next) =>
    prev.id === next.id &&
    prev.student === next.student &&
    prev.className === next.className &&
    prev.shift === next.shift &&
    prev.relativeTime === next.relativeTime &&
    prev.text === next.text &&
    prev.isFavorite === next.isFavorite &&
    prev.isDeleting === next.isDeleting &&
    prev.onPress === next.onPress &&
    prev.onDelete === next.onDelete &&
    prev.onToggleFavorite === next.onToggleFavorite,
);
