import React from 'react';
import {List} from 'react-native-paper';

type ListIconSlotProps = {color: string; style?: React.ComponentProps<typeof List.Icon>['style']};

export const listIcon = (icon: string) => (props: ListIconSlotProps) =>
  <List.Icon {...props} icon={icon} />;
