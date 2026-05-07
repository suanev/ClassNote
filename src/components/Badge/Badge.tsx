import React, {PropsWithChildren} from 'react';

import {BadgeLabel, BadgeWrapper} from './styles';

type BadgeVariant = 'success' | 'default';

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant;
}

export const Badge = ({children, variant = 'default'}: BadgeProps) => {
  return (
    <BadgeWrapper $variant={variant}>
      <BadgeLabel $variant={variant}>{children}</BadgeLabel>
    </BadgeWrapper>
  );
};
