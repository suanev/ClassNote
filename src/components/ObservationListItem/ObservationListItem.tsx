import React from 'react';
import {Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
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
  onToggleFavorite: () => void;
}

export const ObservationListItem = ({
  student,
  className,
  relativeTime,
  text,
  isFavorite,
  onToggleFavorite,
}: ObservationListItemProps) => {
  const theme = useTheme();

  return (
    <Card variant="default" padding={16} style={{marginBottom: 10}}>
      <Row>
        <StudentName>{student}</StudentName>
        <FavoriteButton as={Pressable} onPress={onToggleFavorite}>
          {({pressed}) => (
            <Feather
              name="star"
              size={20}
              color={
                isFavorite
                  ? theme.colors.primary
                  : pressed
                    ? theme.colors.textMuted
                    : theme.colors.textSubtle
              }
            />
          )}
        </FavoriteButton>
      </Row>
      <MetaText>
        {className} · {relativeTime}
      </MetaText>
      <ObservationText numberOfLines={2}>{text}</ObservationText>
    </Card>
  );
};
