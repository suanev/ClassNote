import React from 'react';
import {isDev} from '@constants/environment';

/**
 * DesignSystemScreen — renderiza o Storybook in-app.
 *
 * Acessível apenas em modo isDev via Ajustes → Design System.
 * O import do Storybook só é resolvido pelo bundler quando isDev é true.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StorybookUIRoot = isDev ? require('../../../.storybook/index').default : null;

const DesignSystemScreen = () => {
  if (!StorybookUIRoot) {
    return null;
  }
  return <StorybookUIRoot />;
};

export default DesignSystemScreen;
