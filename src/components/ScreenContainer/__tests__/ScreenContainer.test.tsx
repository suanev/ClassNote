import React from 'react';
import {Text} from 'react-native';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ScreenContainer} from '../ScreenContainer';

describe('ScreenContainer', () => {
  it('should render children without bottom inset by default', () => {
    renderWithProviders(
      <ScreenContainer>
        <Text>Test content</Text>
      </ScreenContainer>,
    );

    expect(screen.getByText('Test content')).toBeOnTheScreen();
  });

  it('should render children with bottom inset enabled', () => {
    renderWithProviders(
      <ScreenContainer withBottom>
        <Text>Bottom content</Text>
      </ScreenContainer>,
    );

    expect(screen.getByText('Bottom content')).toBeOnTheScreen();
  });
});
