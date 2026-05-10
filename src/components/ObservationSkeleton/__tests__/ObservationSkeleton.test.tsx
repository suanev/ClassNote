/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ObservationSkeleton} from '../ObservationSkeleton';

jest.mock('@components/index', () => {
  const React = require('react');
  const {Pressable, Text} = require('react-native');

  return {
    FAB: ({
      disabled,
      onPress,
    }: {
      disabled?: boolean;
      onPress: () => void;
    }) => (
      <Pressable disabled={disabled} onPress={onPress} testID="floating-action-button">
        <Text>FAB</Text>
      </Pressable>
    ),
    ScreenContainer: ({children}: {children: React.ReactNode}) => children,
    Skeleton: () => <Text>Skeleton Block</Text>,
  };
});

describe('ObservationSkeleton', () => {
  it('should render the loading skeleton with a disabled fab', () => {
    renderWithProviders(<ObservationSkeleton />);

    expect(screen.getByTestId('floating-action-button')).toBeDisabled();
  });
});
