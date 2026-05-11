import React from 'react';
import {act, renderHook} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import {queryKeys} from '../../../constants/queryKeys';
import {rootReducer} from '../../../store/rootReducer';
import {rootSaga} from '../../../store/rootSaga';
import {useObservationsViewModel} from '../useObservationsViewModel';
import {Observation} from '../../../types/observations';

const mockNavigate = jest.fn();
const mockRefetch = jest.fn(() => Promise.resolve());
const mockLoadMore = jest.fn();
const mockResetPagination = jest.fn();
const mockCreateMutate = jest.fn();
const mockUpdateMutate = jest.fn();
const mockDeleteMutate = jest.fn();
const mockLogEvent = jest.fn();
const mockLogError = jest.fn();
const mockBreadcrumb = jest.fn();

let latestCreateOptions: {
  onSuccess?: () => void;
  onError?: () => void;
} | undefined;
let latestUpdateOptions: {
  onMutate?: (variables: {
    id: string;
    payload: Partial<Observation>;
  }) => Promise<{previousObservations: Observation[]}>;
  onError?: () => void;
  onSettled?: () => void;
} | undefined;
let latestDeleteOptions: {
  onSuccess?: (
    data: void,
    variables: string,
    context: {
      deletedObservation: Observation | null;
      previousObservations: Observation[];
    },
  ) => void;
  onError?: () => void;
} | undefined;

const mockObservations: Observation[] = [
  {
    id: 'obs-1',
    student: 'Ana Silva',
    className: '5º A',
    text: 'Primeira observação',
    createdAt: '2026-05-07T12:00:00.000Z',
    updatedAt: '2026-05-07T12:00:00.000Z',
    favorite: true,
  },
  {
    id: 'obs-2',
    student: 'Pedro Lima',
    className: '6º B',
    text: 'Segunda observação',
    createdAt: '2026-05-06T12:00:00.000Z',
    updatedAt: '2026-05-06T12:00:00.000Z',
    favorite: false,
  },
  {
    id: 'obs-3',
    student: 'Júlia Costa',
    className: '7º C',
    text: 'Terceira observação',
    createdAt: '2026-05-05T12:00:00.000Z',
    updatedAt: '2026-05-05T12:00:00.000Z',
    favorite: true,
  },
];

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({navigate: mockNavigate}),
  };
});

jest.mock('@hooks/useClasses', () => ({useClassesQuery: jest.fn()}));

jest.mock('@hooks/useObservations', () => ({
  useObservationsQuery: jest.fn(),
  useCreateObservationMutation: jest.fn(),
  useUpdateObservationMutation: jest.fn(),
  useDeleteObservationMutation: jest.fn(),
}));

jest.mock('@hooks/usePagination', () => ({usePagination: jest.fn()}));

jest.mock('@services/monitoring', () => ({
  monitoring: {
    logEvent: (...args: unknown[]) => mockLogEvent(...args),
    logError: (...args: unknown[]) => mockLogError(...args),
    breadcrumb: (...args: unknown[]) => mockBreadcrumb(...args),
  },
  Events: {
    UNDO_DELETE: 'UNDO_DELETE',
    OBSERVATION_DELETED: 'OBSERVATION_DELETED',
    OBSERVATION_FAVORITED: 'OBSERVATION_FAVORITED',
    FILTER_APPLIED: 'FILTER_APPLIED',
    SORT_CHANGED: 'SORT_CHANGED',
  },
}));

const {useClassesQuery} = jest.requireMock('@hooks/useClasses');
const {
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} = jest.requireMock('@hooks/useObservations');
const {usePagination} = jest.requireMock('@hooks/usePagination');

function renderViewModel(
  preloadedState?: Partial<ReturnType<typeof rootReducer>>,
  setupQueryClient?: (queryClient: QueryClient) => void,
) {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({serializableCheck: false}).concat(sagaMiddleware),
  });
  sagaMiddleware.run(rootSaga);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {retry: false, gcTime: Infinity},
      mutations: {retry: false, gcTime: Infinity},
    },
  });
  setupQueryClient?.(queryClient);

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer>{children}</NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );

  const {result} = renderHook(useObservationsViewModel, {wrapper});

  return {result, queryClient, store};
}

describe('useObservationsViewModel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    latestCreateOptions = undefined;
    latestUpdateOptions = undefined;
    latestDeleteOptions = undefined;

    useClassesQuery.mockReturnValue({
      data: [
        {id: 'class-1', name: '5º A', shift: 'Manhã'},
        {id: 'class-2', name: '6º B', shift: 'Tarde'},
        {id: 'class-3', name: '7º C', shift: 'Noite'},
      ],
    });
    useObservationsQuery.mockReturnValue({
      data: mockObservations,
      isLoading: false,
      isFetching: false,
      isRefetching: false,
      isError: false,
      refetch: mockRefetch,
    });
    usePagination.mockImplementation((items: Observation[]) => ({
      hasMore: true,
      loadMore: mockLoadMore,
      paginatedItems: items,
      reset: mockResetPagination,
    }));
    useCreateObservationMutation.mockImplementation(
      (options: typeof latestCreateOptions) => {
        latestCreateOptions = options;
        return {isPending: false, mutate: mockCreateMutate};
      },
    );
    useUpdateObservationMutation.mockImplementation(
      (options: typeof latestUpdateOptions) => {
        latestUpdateOptions = options;
        return {
          isPending: false,
          mutate: mockUpdateMutate.mockImplementation(
            (_variables: unknown, callbacks?: {onSuccess?: () => void}) =>
              callbacks?.onSuccess?.(),
          ),
        };
      },
    );
    useDeleteObservationMutation.mockImplementation(
      (options: typeof latestDeleteOptions) => {
        latestDeleteOptions = options;
        return {
          isPending: false,
          variables: null,
          mutate: mockDeleteMutate.mockImplementation((id: string) => {
            const deletedObservation =
              mockObservations.find(item => item.id === id) ?? null;
            options?.onSuccess?.(undefined, id, {
              deletedObservation,
              previousObservations: mockObservations,
            });
          }),
        };
      },
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should derive classes from the API and pass formatted observations to the view', () => {
    const {result} = renderViewModel();

    expect(result.current.availableClasses).toEqual([
      {id: 'class-1', name: '5º A', shift: 'Manhã'},
      {id: 'class-2', name: '6º B', shift: 'Tarde'},
      {id: 'class-3', name: '7º C', shift: 'Noite'},
    ]);
    expect(result.current.filterByClass).toBeNull();
    expect(result.current.filterByFavorites).toBe(false);
    expect(result.current.filteredObservationsCount).toBe(3);
    expect(result.current.observations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'obs-1',
          student: 'Ana Silva',
          relativeTime: expect.any(String),
        }),
      ]),
    );
  });

  it('should resolve class metadata through classId when it is available', () => {
    useObservationsQuery.mockReturnValue({
      data: [
        {
          ...mockObservations[0],
          classId: 'class-1',
        },
      ],
      isLoading: false,
      isRefetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    const {result} = renderViewModel();

    expect(result.current.observations[0]).toEqual(
      expect.objectContaining({
        className: '5º A',
        shift: 'Manhã',
      }),
    );
  });

  it('should use observations as a fallback when the classes API has no data', () => {
    useClassesQuery.mockReturnValue({data: []});
    const {result} = renderViewModel();
    expect(result.current.availableClasses).toEqual([]);
  });

  it('should keep the list empty when neither observations nor classes are available', () => {
    useClassesQuery.mockReturnValue({data: undefined});
    useObservationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isRefetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    const {result} = renderViewModel();
    expect(result.current.availableClasses).toEqual([]);
    expect(result.current.observations).toEqual([]);
    expect(result.current.filteredObservationsCount).toBe(0);
    expect(result.current.hasAnyObservations).toBe(false);
  });

  it('should expose the filtered count instead of the raw total', () => {
    const {result} = renderViewModel({
      observations: {
        filterByShift: null,
        filterByClass: null,
        filterByFavorites: true,
        isFilterSheetOpen: false,
        pendingDeletedObservation: null,
        sortOrder: 'recent-first',
        toast: {visible: false, message: '', actionLabel: null, tone: 'success'},
        undoStatus: 'idle',
      },
    });

    expect(result.current.filteredObservationsCount).toBe(2);
  });

  it('should keep rendering cached observations when offline refetch fails', () => {
    useClassesQuery.mockReturnValue({data: undefined});
    useObservationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isRefetching: false,
      isError: true,
      error: {isAxiosError: true, response: undefined},
      refetch: mockRefetch,
    });

    const {result} = renderViewModel(undefined, queryClient => {
      queryClient.setQueryData(queryKeys.observations, mockObservations);
    });

    expect(result.current.observations).toHaveLength(3);
    expect(result.current.hasAnyObservations).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should show empty observations list when offline with no local cache', () => {
    useClassesQuery.mockReturnValue({data: undefined});
    useObservationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isRefetching: false,
      isError: false,
      error: undefined,
      refetch: mockRefetch,
    });

    const {result} = renderViewModel({
      network: {isOffline: true, isSyncing: false},
    });

    expect(result.current.observations).toEqual([]);
    expect(result.current.hasAnyObservations).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should filter only favorites when filterByFavorites is true', () => {
    const {result} = renderViewModel({
      observations: {
        filterByShift: null,
        filterByClass: null,
        filterByFavorites: true,
        isFilterSheetOpen: false,
        pendingDeletedObservation: null,
        sortOrder: 'recent-first',
        toast: {visible: false, message: '', actionLabel: null, tone: 'success'},
        undoStatus: 'idle',
      },
    });

    const ids = result.current.observations.map(o => o.id);
    expect(ids).toContain('obs-1');
    expect(ids).toContain('obs-3');
    expect(ids).not.toContain('obs-2');
  });

  it('should keep the skeleton visible during the first fetch when there is no cached data', () => {
    useObservationsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: true,
      isRefetching: true,
      isError: false,
      refetch: mockRefetch,
    });

    const {result} = renderViewModel();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasAnyObservations).toBe(false);
  });

  it('should filter by class only when filterByClass is set', () => {
    const {result} = renderViewModel({
      observations: {
        filterByShift: null,
        filterByClass: '5º A',
        filterByFavorites: false,
        isFilterSheetOpen: false,
        pendingDeletedObservation: null,
        sortOrder: 'recent-first',
        toast: {visible: false, message: '', actionLabel: null, tone: 'success'},
        undoStatus: 'idle',
      },
    });

    const ids = result.current.observations.map(o => o.id);
    expect(ids).toEqual(['obs-1']);
  });

  it('should filter observations and available classes by shift', () => {
    const {result, store} = renderViewModel();

    act(() => {
      result.current.onSelectShift('Tarde');
    });

    expect(store.getState().observations.filterByShift).toBe('Tarde');
    expect(result.current.availableClasses).toEqual([
      {id: 'class-2', name: '6º B', shift: 'Tarde'},
    ]);
    expect(result.current.observations.map(item => item.id)).toEqual(['obs-2']);
  });

  it('should combine class and favorites filters independently', () => {
    const {result} = renderViewModel({
      observations: {
        filterByShift: null,
        filterByClass: '5º A',
        filterByFavorites: true,
        isFilterSheetOpen: false,
        pendingDeletedObservation: null,
        sortOrder: 'recent-first',
        toast: {visible: false, message: '', actionLabel: null, tone: 'success'},
        undoStatus: 'idle',
      },
    });

    const ids = result.current.observations.map(o => o.id);
    expect(ids).toEqual(['obs-1']);
  });

  it('should open, close and reset filters with an automatic toast', async () => {
    const {result, store} = renderViewModel({
      observations: {
        filterByShift: null,
        filterByClass: '6º B',
        filterByFavorites: true,
        isFilterSheetOpen: false,
        pendingDeletedObservation: null,
        sortOrder: 'old-first',
        toast: {visible: false, message: '', actionLabel: null, tone: 'success'},
        undoStatus: 'idle',
      },
    });

    act(() => { result.current.onOpenFilters(); });
    expect(store.getState().observations.isFilterSheetOpen).toBe(true);

    act(() => { result.current.onCloseFilters(); });
    expect(store.getState().observations.isFilterSheetOpen).toBe(false);

    act(() => { result.current.onResetFilters(); });
    expect(store.getState().observations.filterByClass).toBeNull();
    expect(store.getState().observations.filterByFavorites).toBe(false);
    expect(store.getState().observations.sortOrder).toBe('recent-first');
    expect(store.getState().observations.toast.message).toBe(
      'Filtros voltaram para o padrão',
    );

    await act(async () => {
      jest.advanceTimersByTime(4000);
      await Promise.resolve();
    });
    expect(store.getState().observations.toast.visible).toBe(false);
  });

  it('should trigger refresh, pagination, navigation, class filter and sort order', async () => {
    const {result, store} = renderViewModel();

    await act(async () => {
      result.current.onRefresh();
      result.current.onLoadMore();
      result.current.onSelectClass('7º C');
      result.current.onSelectSortOrder('favorites-first');
      result.current.onCreateObservation();
      result.current.onEditObservation('obs-2');
      await Promise.resolve();
    });

    act(() => { jest.advanceTimersByTime(400); });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
    expect(mockResetPagination).toHaveBeenCalled();
    expect(store.getState().observations.filterByClass).toBe('7º C');
    expect(store.getState().observations.sortOrder).toBe('favorites-first');
    expect(mockNavigate).toHaveBeenCalledWith('ObservationForm', {mode: 'create'});
    expect(mockNavigate).toHaveBeenCalledWith('ObservationForm', {
      mode: 'edit',
      observationId: 'obs-2',
    });
  });

  it('should log class filter selection with "all" when clearing the filter', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onSelectClass(null);
    });

    expect(mockLogEvent).toHaveBeenCalledWith('FILTER_APPLIED', {
      type: 'class',
      value: 'all',
    });
  });

  it('should not load more when there are no more items', () => {
    usePagination.mockImplementation((items: Observation[]) => ({
      hasMore: false,
      loadMore: mockLoadMore,
      paginatedItems: items,
      reset: mockResetPagination,
    }));

    const {result} = renderViewModel();

    act(() => {
      result.current.onLoadMore();
    });

    expect(mockLoadMore).not.toHaveBeenCalled();
  });

  it('should toggle favorites filter on and off', () => {
    const {result, store} = renderViewModel();

    act(() => { result.current.onToggleFavoritesFilter(); });
    expect(store.getState().observations.filterByFavorites).toBe(true);

    act(() => { result.current.onToggleFavoritesFilter(); });
    expect(store.getState().observations.filterByFavorites).toBe(false);
  });

  it('should update favorites and show a success toast', () => {
    const {result, store} = renderViewModel();

    act(() => { result.current.onToggleFavorite('obs-2'); });

    expect(mockUpdateMutate).toHaveBeenCalledWith(
      {
        id: 'obs-2',
        payload: {
          student: 'Pedro Lima',
          className: '6º B',
          text: 'Segunda observação',
          favorite: true,
        },
      },
      expect.any(Object),
    );
    expect(store.getState().observations.toast.message).toBe(
      'Observação favoritada',
    );
  });

  it('should remove the favorite flag when the observation was already starred', () => {
    const {result, store} = renderViewModel();

    act(() => { result.current.onToggleFavorite('obs-1'); });

    expect(store.getState().observations.toast.message).toBe(
      'Observação removida dos favoritos',
    );
  });

  it('should not try to favorite an observation that does not exist', () => {
    const {result} = renderViewModel();

    act(() => { result.current.onToggleFavorite('missing-id'); });

    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it('should delete an observation and restore it through undo', () => {
    const {result, store} = renderViewModel();

    act(() => { result.current.onDeleteObservation('obs-2'); });

    expect(mockDeleteMutate).toHaveBeenCalledWith('obs-2');
    expect(store.getState().observations.pendingDeletedObservation?.id).toBe(
      'obs-2',
    );
    expect(store.getState().observations.toast.actionLabel).toBe('Desfazer');

    act(() => { result.current.onUndoDelete(); });

    expect(mockCreateMutate).toHaveBeenCalledWith(
      expect.objectContaining({id: 'obs-2', student: 'Pedro Lima'}),
    );
    expect(store.getState().observations.undoStatus).toBe('pending');

    act(() => { latestCreateOptions?.onSuccess?.(); });
    expect(store.getState().observations.pendingDeletedObservation).toBeNull();
  });

  it('should ignore delete success when there is no deleted observation in context', () => {
    const {store} = renderViewModel();

    act(() => {
      latestDeleteOptions?.onSuccess?.(undefined, 'obs-x', {
        deletedObservation: null,
        previousObservations: [],
      });
    });

    expect(store.getState().observations.pendingDeletedObservation).toBeNull();
  });

  it('should handle mutation callbacks and error branches', async () => {
    const {queryClient, store} = renderViewModel();

    queryClient.setQueryData(queryKeys.observations, mockObservations);

    await latestUpdateOptions?.onMutate?.({id: 'obs-1', payload: {favorite: false}});
    queryClient.removeQueries({queryKey: queryKeys.observations});
    await latestUpdateOptions?.onMutate?.({id: 'obs-2', payload: {favorite: true}});

    act(() => {
      latestUpdateOptions?.onError?.();
      latestUpdateOptions?.onSettled?.();
      latestDeleteOptions?.onError?.();
      latestCreateOptions?.onError?.();
    });

    expect(store.getState().observations.toast.message).toBe(
      'Não foi possível desfazer a exclusão.',
    );
  });

  it('should not undo when there is no pending deleted observation', () => {
    const {result} = renderViewModel();

    act(() => { result.current.onUndoDelete(); });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });

  it('should expose deletePendingId while the delete mutation is pending', () => {
    useDeleteObservationMutation.mockImplementation(() => ({
      isPending: true,
      variables: 'obs-3',
      mutate: mockDeleteMutate,
    }));

    const {result} = renderViewModel();

    expect(result.current.deletePendingId).toBe('obs-3');
  });

  it('should expose loading when the first observations request is still pending', () => {
    useObservationsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isRefetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    const {result} = renderViewModel();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.observations).toEqual([]);
  });
});
