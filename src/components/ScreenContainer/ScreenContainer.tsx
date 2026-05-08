import React, {PropsWithChildren} from 'react';

import {ScreenContainerView} from './styles';

interface ScreenContainerProps extends PropsWithChildren {
  withBottom?: boolean;
}

export const ScreenContainer = ({
  children,
  withBottom = false,
}: ScreenContainerProps) => {
  return <ScreenContainerView $withBottom={withBottom}>{children}</ScreenContainerView>;
};
