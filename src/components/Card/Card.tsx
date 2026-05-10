import React, {PropsWithChildren} from 'react';
import {Pressable, StyleProp, ViewStyle} from 'react-native';

import {CardContainer, CardVariant} from './styles';

interface CardProps extends PropsWithChildren {
  variant?: CardVariant;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card = ({
  children,
  variant = 'default',
  padding,
  style,
  onPress,
}: CardProps) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
        <CardContainer variant={variant} padding={padding} style={style}>
          {children}
        </CardContainer>
      </Pressable>
    );
  }
  return (
    <CardContainer variant={variant} padding={padding} style={style}>
      {children}
    </CardContainer>
  );
};
