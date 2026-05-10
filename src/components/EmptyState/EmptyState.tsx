import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {Button} from '@components/Button';

import {
  ActionWrapper,
  Description,
  EmptyWrapper,
  IconBadge,
  Title,
} from './styles';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon = 'file-text',
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <EmptyWrapper>
      <IconBadge>
        <Feather name={icon} size={56} color={theme.colors.primary} />
      </IconBadge>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionLabel && onAction ? (
        <ActionWrapper>
          <Button variant="secondary" onPress={onAction}>
            {actionLabel}
          </Button>
        </ActionWrapper>
      ) : null}
    </EmptyWrapper>
  );
};
