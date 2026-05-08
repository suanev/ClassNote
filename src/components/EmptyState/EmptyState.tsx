import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {
  ActionButton,
  ActionLabel,
  Description,
  EmptyCard,
  IconBadge,
  Title,
} from './styles';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <EmptyCard>
      <IconBadge>
        <Feather name="file-text" size={24} color={theme.colors.primary} />
      </IconBadge>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionLabel && onAction ? (
        <ActionButton onPress={onAction}>
          <ActionLabel>{actionLabel}</ActionLabel>
        </ActionButton>
      ) : null}
    </EmptyCard>
  );
};
