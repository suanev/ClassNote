import React from 'react';
import {isDev} from '@constants/environment';

const StorybookUIRoot = isDev ? React.lazy(() => import('../../../.storybook/index')) : null;

const DesignSystemScreen = () => {
  if (!StorybookUIRoot) {
    return null;
  }
  return (
    <React.Suspense fallback={null}>
      <StorybookUIRoot />
    </React.Suspense>
  );
};

export default DesignSystemScreen;
