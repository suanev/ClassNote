import React from 'react';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Hint} from '../Hint';

describe('Hint', () => {
  it('renders children', () => {
    renderWithProviders(<Hint>Texto de ajuda</Hint>);
    expect(screen.getByText('Texto de ajuda')).toBeOnTheScreen();
  });

  it('forwards testID', () => {
    renderWithProviders(<Hint testID="my-hint">Texto</Hint>);
    expect(screen.getByTestId('my-hint')).toBeOnTheScreen();
  });
});
