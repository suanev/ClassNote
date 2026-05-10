import React, {memo} from 'react';
import {Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {Card} from '@components/Card';

import {
  CardInner,
  DashedSeparator,
  FavoriteButton,
  MetaText,
  ObservationText,
  StudentName,
  TimeText,
  TopRow,
} from './styles';

interface ObservationListItemProps {
  id: string;
  student: string;
  className: string;
  shift?: string;
  relativeTime: string;
  text: string;
  isFavorite: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  onToggleFavorite: () => void;
}

const ObservationListItemComponent = ({
  id,
  student,
  className,
  shift,
  relativeTime,
  text,
  isFavorite,
  isDisabled = false,
  onPress,
  onToggleFavorite,
}: ObservationListItemProps) => {
  const theme = useTheme();

  const metaLabel = shift ? `${className} · ${shift}` : className;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Observação de ${student}`}
      accessibilityState={{disabled: isDisabled}}
      disabled={isDisabled}
      onPress={onPress}
      testID={`observation-card-${id}`}>
      <Card variant="default" padding={16}>
        <CardInner>
          <TopRow>
            <StudentName>{student}</StudentName>
            <FavoriteButton
              hitSlop={8}
              testID={`favorite-button-${id}`}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              accessibilityState={{checked: isFavorite}}
              onPress={event => {
                event?.stopPropagation?.();
                onToggleFavorite();
              }}>
              {({pressed}) => (
                <MaterialCommunityIcons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={18}
                  /* istanbul ignore next -- pressed color feedback is purely visual */
                  color={
                    isFavorite
                      ? theme.colors.favorite
                      : pressed
                      ? theme.colors.textMuted
                      : theme.colors.textSubtle
                  }
                />
              )}
            </FavoriteButton>
          </TopRow>
          <MetaText>{metaLabel}</MetaText>
          <ObservationText numberOfLines={2}>{text}</ObservationText>
          <DashedSeparator />
          <TimeText>{relativeTime}</TimeText>
        </CardInner>
      </Card>
    </Pressable>
  );
};

export const ObservationListItem = memo(
  ObservationListItemComponent,
  /* istanbul ignore next */
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id &&
    prevProps.student === nextProps.student &&
    prevProps.className === nextProps.className &&
    prevProps.shift === nextProps.shift &&
    prevProps.relativeTime === nextProps.relativeTime &&
    prevProps.text === nextProps.text &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onToggleFavorite === nextProps.onToggleFavorite,
);
