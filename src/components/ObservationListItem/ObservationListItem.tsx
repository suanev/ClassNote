import React, {memo} from 'react';
import {Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {Card} from '@components/Card';

import {
  FavoriteButton,
  MetaText,
  ObservationText,
  Row,
  StudentName,
} from './styles';

interface ObservationListItemProps {
  student: string;
  className: string;
  relativeTime: string;
  text: string;
  isFavorite: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  onToggleFavorite: () => void;
}

const ObservationListItemComponent = ({
  student,
  className,
  relativeTime,
  text,
  isFavorite,
  isDisabled = false,
  onPress,
  onToggleFavorite,
}: ObservationListItemProps) => {
  const theme = useTheme();
  /* istanbul ignore next */
  const favoriteIconColor = (pressed: boolean) =>
    isFavorite
      ? theme.colors.primary
      : pressed
        ? theme.colors.textMuted
        : theme.colors.textSubtle;
  /* istanbul ignore next */
  const stopFavoritePressPropagation = (event?: {stopPropagation?: () => void}) => {
    event?.stopPropagation?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Observação de ${student}`}
      accessibilityState={{disabled: isDisabled}}
      disabled={isDisabled}
      onPress={onPress}
      testID="observation-card">
      <Card variant="default" padding={16}>
      <Row>
        <StudentName>{student}</StudentName>
        <FavoriteButton
          hitSlop={8}
          testID="favorite-button"
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          accessibilityState={{checked: isFavorite}}
          onPress={event => {
            stopFavoritePressPropagation(event);
            onToggleFavorite();
          }}>
          {({pressed}) => (
            <MaterialCommunityIcons
              name={isFavorite ? 'star' : 'star-outline'}
              size={20}
              color={favoriteIconColor(pressed)}
            />
          )}
        </FavoriteButton>
      </Row>
      <MetaText>
        {className} · {relativeTime}
      </MetaText>
      <ObservationText numberOfLines={2}>{text}</ObservationText>
      </Card>
    </Pressable>
  );
};

export const ObservationListItem = memo(
  ObservationListItemComponent,
  /* istanbul ignore next */
  (prevProps, nextProps) =>
    prevProps.student === nextProps.student &&
    prevProps.className === nextProps.className &&
    prevProps.relativeTime === nextProps.relativeTime &&
    prevProps.text === nextProps.text &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onToggleFavorite === nextProps.onToggleFavorite,
);
