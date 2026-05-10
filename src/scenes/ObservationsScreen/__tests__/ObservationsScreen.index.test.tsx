import React from 'react';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';

const mockUseObservationsViewModel = jest.fn();
const mockObservationsScreenView = jest.fn();

jest.mock('../useObservationsViewModel', () => ({
  useObservationsViewModel: () => mockUseObservationsViewModel(),
}));

jest.mock('../ObservationsScreen', () => ({
  ObservationsScreen: (props: unknown) => {
    const React = jest.requireActual('react');
    const {Text} = jest.requireActual('react-native');
    mockObservationsScreenView(props);
    return <Text>Observations container view</Text>;
  },
}));

import {ObservationsScreen} from '../index';

describe('ObservationsScreen (index)', () => {
  it('should pass the view model props to the screen view', () => {
    const viewModel = {
      availableClasses: ['5º A'],
      filterByClass: null,
      filterByFavorites: false,
      hasMore: false,
      isLoadingMore: false,
      isFilterSheetOpen: false,
      observations: [],
      deletePendingId: null,
      isLoading: false,
      isError: false,
      isRefreshing: false,
      sortOrder: 'recent-first' as const,
      toastVisible: false,
      toastMessage: '',
      toastActionLabel: null,
      undoPending: false,
      onCloseFilters: jest.fn(),
      onDeleteObservation: jest.fn(),
      onEditObservation: jest.fn(),
      onLoadMore: jest.fn(),
      onOpenFilters: jest.fn(),
      onRefresh: jest.fn(),
      onRetry: jest.fn(),
      onResetFilters: jest.fn(),
      onSelectClass: jest.fn(),
      onSelectSortOrder: jest.fn(),
      onToggleFavoritesFilter: jest.fn(),
      onToggleFavorite: jest.fn(),
      onCreateObservation: jest.fn(),
      onUndoDelete: jest.fn(),
    };

    mockUseObservationsViewModel.mockReturnValue(viewModel);

    renderWithProviders(<ObservationsScreen />);

    expect(screen.getByText('Observations container view')).toBeOnTheScreen();
    expect(mockObservationsScreenView).toHaveBeenCalledWith(viewModel);
  });
});
