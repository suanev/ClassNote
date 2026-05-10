import React from 'react';
import {TextProps} from 'react-native';
import {HintText} from './styles';

interface HintProps extends Pick<TextProps, 'testID'> {
  children: React.ReactNode;
}

export function Hint({children, testID}: HintProps) {
  return <HintText testID={testID}>{children}</HintText>;
}
