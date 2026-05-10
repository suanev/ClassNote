/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ObservationsScreen} from '../ObservationsScreen';

jest.mock('@components/index', () => ({
  ...(() => {
    const React = require('react');
    const {Pressable, Text, View} = require('react-native');

    return {
      AppHeader: ({title, rightContent}: {title: string; rightContent?: React.ReactNode}) => (
        <View>
          <Text>{title}</Text>
          {rightContent}
        </View>
      ),
      Button: ({children, onPress}: {children: React.ReactNode; onPress: () => void}) => (
        <Pressable onPress={onPress}>
          <Text>{children}</Text>
        </Pressable>
      ),
      EmptyState: ({
        title,
        description,
        actionLabel,
        onAction,
      }: {
        title: string;
        description: string;
        actionLabel?: string;
        onAction?: () => void;
      }) => (
        <View>
          <Text>{title}</Text>
          <Text>{description}</Text>
          {actionLabel ? (
            <Pressable onPress={onAction}>
              <Text>{actionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ),
      FAB: ({onPress}: {onPress: () => void}) => (
        <Pressable onPress={onPress}>
          <Text>Criar</Text>
        </Pressable>
      ),
      FilterBottomSheet: ({
        isOpen,
        filterByClass,
        filterByFavorites,
      }: {
        isOpen: boolean;
        filterByClass: string | null;
        filterByFavorites: boolean;
        filterByShift?: string | null;
      }) => (
        <Text>
          {`${isOpen ? 'Aberto' : 'Fechado'}-${filterByClass ?? 'Todas'}-${filterByFavorites ? 'fav' : 'all'}`}
        </Text>
      ),
      IconButton: ({onPress, testID}: {onPress: () => void; testID?: string}) => (
        <Pressable onPress={onPress} testID={testID}>
          <Text>IconButton</Text>
        </Pressable>
      ),
      ObservationSkeleton: () => <Text>Skeleton</Text>,
      ObservationUndoToast: ({
        message,
        actionLabel,
        onAction,
      }: {
        message: string;
        actionLabel?: string | null;
        onAction?: () => void;
      }) => (
        <View>
          <Text>{message}</Text>
          {actionLabel ? (
            <Pressable onPress={onAction}>
              <Text>{actionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ),
      ScreenContainer: ({children}: {children: React.ReactNode}) => children,
      SyncStatusIcon: () => <Text>SyncIcon</Text>,
      SwipeableObservationItem: ({
        student,
        onPress,
        onToggleFavorite,
      }: {
        student: string;
        onPress: () => void;
        onToggleFavorite: () => void;
      }) => (
        <View>
          <Pressable onPress={onPress}>
            <Text>{student}</Text>
          </Pressable>
          <Pressable onPress={onToggleFavorite}>
            <Text>{`Fav-${student}`}</Text>
          </Pressable>
        </View>
      ),
    };
  })(),
}));

describe('ObservationsScreen view', () => {
  const baseProps = {
    availableClasses: [] as {id: string; name: string; shift: 'Manhã' | 'Tarde' | 'Noite' | 'Outro'}[],
    filteredObservationsCount: 1,
    filterByShift: null as null,
    filterByClass: null as string | null,
    filterByFavorites: false,
    filterCount: 0,
    hasAnyObservations: true,
    hasMore: false,
    isLoadingMore: false,
    isFilterSheetOpen: false,
    observations: [
      {
        id: 'obs-1',
        student: 'Ana Silva',
        className: '5º A',
        text: 'Texto',
        relativeTime: 'há 5 minutos',
        favorite: true,
      },
    ],
    deletePendingId: null,
    isLoading: false,
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
    onResetFilters: jest.fn(),
    onSelectShift: jest.fn(),
    onSelectClass: jest.fn(),
    onSelectSortOrder: jest.fn(),
    onToggleFavoritesFilter: jest.fn(),
    onToggleFavorite: jest.fn(),
    onCreateObservation: jest.fn(),
    onUndoDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the skeleton while the screen is loading', () => {
    renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        isLoading
      />,
    );

    expect(screen.getByText('Skeleton')).toBeOnTheScreen();
  });

  it('should render the list, open filters and trigger create', () => {
    renderWithProviders(<ObservationsScreen {...baseProps} />);

    expect(screen.getByText('Observações')).toBeOnTheScreen();
    expect(screen.getByText('Ana Silva')).toBeOnTheScreen();
    expect(screen.getByText('Fechado-Todas-all')).toBeOnTheScreen();
    expect(screen.getByText('1 registro')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('filters-trigger-button'));
    fireEvent.press(screen.getByText('Criar'));
    fireEvent.press(screen.getByText('Ana Silva'));
    fireEvent.press(screen.getByText('Fav-Ana Silva'));

    expect(baseProps.onOpenFilters).toHaveBeenCalledTimes(1);
    expect(baseProps.onCreateObservation).toHaveBeenCalledTimes(1);
    expect(baseProps.onEditObservation).toHaveBeenCalledWith('obs-1');
    expect(baseProps.onToggleFavorite).toHaveBeenCalledWith('obs-1');
  });

  it('should render the correct empty state for favorites and a specific class', () => {
    const favoritesProps = {
      ...baseProps,
      filterByFavorites: true,
      observations: [],
    };
    const classProps = {
      ...baseProps,
      filterByClass: '6º B',
      observations: [],
    };

    const {rerender} = renderWithProviders(
      <ObservationsScreen {...favoritesProps} />,
    );

    expect(
      screen.getByText(
        'Quando você marcar observações com estrela, elas vão aparecer aqui para acesso mais rápido.',
      ),
    ).toBeOnTheScreen();

    rerender(<ObservationsScreen {...classProps} />);

    expect(
      screen.getByText(
        'Ainda não há observações para essa turma. Você pode criar a primeira e começar o histórico.',
      ),
    ).toBeOnTheScreen();
  });

  it('should render the combined empty state when class and favorites filters are active', () => {
    renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        filterByClass="5º A"
        filterByFavorites
        observations={[]}
      />,
    );

    expect(screen.getByText('Nenhuma observação favorita para essa turma.')).toBeOnTheScreen();
  });

  it('should render the undo toast action when it is available', () => {
    renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        toastVisible
        toastMessage="Observação apagada"
        toastActionLabel="Desfazer"
      />,
    );

    fireEvent.press(screen.getByText('Desfazer'));

    expect(screen.getByText('Observação apagada')).toBeOnTheScreen();
    expect(baseProps.onUndoDelete).toHaveBeenCalledTimes(1);
  });

  it('should hide the toast action while undo is pending', () => {
    renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        hasMore
        toastVisible
        toastMessage="Observação apagada"
        toastActionLabel="Desfazer"
        undoPending
      />,
    );

    expect(screen.queryByText('Desfazer')).not.toBeOnTheScreen();
  });

  it('should render the loading more footer when fetching the next page', () => {
    const {UNSAFE_getByType} = renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        hasMore
        isLoadingMore
      />,
    );

    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('should hide the filter row and show only FAB when there are no observations', () => {
    renderWithProviders(
      <ObservationsScreen
        {...baseProps}
        hasAnyObservations={false}
        observations={[]}
      />,
    );

    expect(screen.queryByText('FILTROS')).not.toBeOnTheScreen();
    expect(screen.getByText('Criar')).toBeOnTheScreen();
  });

  it('should show the total observations count instead of only rendered items', () => {
    renderWithProviders(
        <ObservationsScreen
          {...baseProps}
          observations={baseProps.observations.slice(0, 1)}
          filteredObservationsCount={12}
        />,
      );

    expect(screen.getByText('12 registros')).toBeOnTheScreen();
  });
});
