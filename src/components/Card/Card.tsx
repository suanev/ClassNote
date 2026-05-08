import React, {PropsWithChildren} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {CardContainer, CardVariant} from './styles';

interface CardProps extends PropsWithChildren {
  variant?: CardVariant;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({
  children,
  variant = 'default',
  padding,
  style,
}: CardProps) => {
  return (
    <CardContainer variant={variant} padding={padding} style={style}>
      {children}
    </CardContainer>
  );
};
