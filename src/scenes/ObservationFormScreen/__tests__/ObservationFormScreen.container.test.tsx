/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import ObservationFormContainer from '../index';

jest.mock('@components/ObservationSkeleton', () => ({
  ObservationSkeleton: () => {
    const React = require('react');
    const {Text} = require('react-native');
    return React.createElement(Text, null, 'Skeleton');
  },
}));

jest.mock('../useObservationFormViewModel', () => ({
  useObservationFormViewModel: jest.fn(),
}));

jest.mock('../ObservationFormScreen', () => ({
  __esModule: true,
  default: (props: {student: string}) => {
    const React = require('react');
    const {Text} = require('react-native');
    return React.createElement(Text, null, props.student);
  },
}));

const {useObservationFormViewModel} = jest.requireMock('../useObservationFormViewModel');

describe('ObservationFormScreen (container)', () => {
  it('should render the skeleton while the route data is loading', () => {
    useObservationFormViewModel.mockReturnValue({
      isRouteLoading: true,
    });

    renderWithProviders(<ObservationFormContainer />);

    expect(screen.getByText('Skeleton')).toBeOnTheScreen();
  });

  it('should pass the view model props to the screen when loading is complete', () => {
    useObservationFormViewModel.mockReturnValue({
      isRouteLoading: false,
      mode: 'create',
      student: 'Ana Souza',
      className: '5º Ano A',
      text: '',
      classOptions: ['5º Ano A'],
      isFavorite: false,
      isLoading: false,
      isDeleting: false,
      onBackPress: jest.fn(),
      onChangeStudent: jest.fn(),
      onChangeClass: jest.fn(),
      onChangeText: jest.fn(),
      onToggleFavorite: jest.fn(),
      onSave: jest.fn(),
    });

    renderWithProviders(<ObservationFormContainer />);

    expect(screen.getByText('Ana Souza')).toBeOnTheScreen();
  });
});
