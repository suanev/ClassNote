import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';

import {useClassesQuery} from '@hooks/useClasses';
import {usePagination} from '@hooks/usePagination';
import {monitoring, Events} from '@services/monitoring';
import {
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} from '@hooks/useObservations';
import {queryKeys} from '@constants/queryKeys';
import {ObservationsStackParamList} from '@navigation/types';
import {Observation} from '../../types/observations';
import {formatRelativeObservationTime} from '@utils/date';
import {sortObservations} from '@utils/sort';
import {AppDispatch, RootState} from '../../store';
import {
  closeFilterSheet,
  finishUndoObservation,
  ObservationSortOrder,
  openFilterSheet,
  queueDeletedObservation,
  resetFilters,
  setClassFilter,
  setSortOrder,
  showObservationErrorToast,
  showObservationToast,
  startUndoObservation,
  toggleFavoritesFilter,
} from '../../store/observations/slice';

type Navigation = StackNavigationProp<ObservationsStackParamList>;

export type ObservationItemView = {
  id: string;
  student: string;
  className: string;
  text: string;
  relativeTime: string;
  favorite: boolean;
};

export type ObservationsViewModel = {
  availableClasses: string[];
  filterByClass: string | null;
  filterByFavorites: boolean;
  isFilterSheetOpen: boolean;
  observations: ObservationItemView[];
  deletePendingId: string | null | undefined;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  sortOrder: ObservationSortOrder;
  toastVisible: boolean;
  toastMessage: string;
  toastActionLabel: string | null;
  undoPending: boolean;
  onCloseFilters: () => void;
  onDeleteObservation: (id: string) => void;
  onEditObservation: (id: string) => void;
  onLoadMore: () => void;
  onOpenFilters: () => void;
  onRefresh: () => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onSelectClass: (value: string | null) => void;
  onSelectSortOrder: (value: ObservationSortOrder) => void;
  onToggleFavoritesFilter: () => void;
  onToggleFavorite: (id: string) => void;
  onCreateObservation: () => void;
  onUndoDelete: () => void;
};

export function useObservationsViewModel(): ObservationsViewModel {
  const navigation = useNavigation<Navigation>();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const {
    filterByClass,
    filterByFavorites,
    isFilterSheetOpen,
    pendingDeletedObservation,
    sortOrder,
    toast,
    undoStatus,
  } = useSelector((state: RootState) => state.observations);

  const classesQuery = useClassesQuery();
  const observationsQuery = useObservationsQuery();
  const observations = useMemo(
    () => observationsQuery.data ?? [],
    [observationsQuery.data],
  );

  const availableClasses = useMemo(() => {
    const classesFromApi = (classesQuery.data ?? [])
      .map(item => item.name)
      .filter(Boolean);

    if (classesFromApi.length > 0) {
      return Array.from(new Set(classesFromApi));
    }

    return Array.from(
      new Set(observations.map(item => item.className).filter(Boolean)),
    );
  }, [classesQuery.data, observations]);

  const createObservationMutation = useCreateObservationMutation({
    onSuccess: () => {
      dispatch(finishUndoObservation());
      monitoring.logEvent(Events.UNDO_DELETE);
    },
    onError: error => {
      dispatch(showObservationErrorToast('Não foi possível desfazer a exclusão.'));
      monitoring.logError(error, {action: 'undo_delete'});
    },
  });

  const updateObservationMutation = useUpdateObservationMutation({
    onMutate: async ({id, payload}) => {
      await queryClient.cancelQueries({queryKey: queryKeys.observations});

      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];

      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        previousObservations.map(item =>
          item.id === id ? {...item, ...payload} : item,
        ),
      );

      return {previousObservations};
    },
    onError: error => {
      dispatch(showObservationErrorToast('Não foi possível atualizar a observação.'));
      monitoring.logError(error, {action: 'update_observation'});
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.observations});
    },
  });

  const deleteObservationMutation = useDeleteObservationMutation({
    onSuccess: (_data, _variables, context) => {
      if (context?.deletedObservation) {
        dispatch(queueDeletedObservation(context.deletedObservation));
      }
      monitoring.logEvent(Events.OBSERVATION_DELETED);
      monitoring.breadcrumb('observation_deleted');
    },
    onError: error => {
      dispatch(showObservationErrorToast('Não foi possível apagar a observação.'));
      monitoring.logError(error, {action: 'delete_observation'});
    },
  });

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const currentObservation = observations.find(item => item.id === id);
      if (!currentObservation) {
        return;
      }
      const willBeFavorite = !currentObservation.favorite;
      updateObservationMutation.mutate(
        {
          id,
          payload: {
            student: currentObservation.student,
            className: currentObservation.className,
            text: currentObservation.text,
            favorite: willBeFavorite,
          },
        },
        {
          onSuccess: () => {
            dispatch(
              showObservationToast({
                message: willBeFavorite
                  ? 'Observação favoritada'
                  : 'Observação removida dos favoritos',
              }),
            );
            monitoring.logEvent(Events.OBSERVATION_FAVORITED, {
              action: willBeFavorite ? 'add' : 'remove',
            });
          },
        },
      );
    },
    [dispatch, observations, updateObservationMutation],
  );

  const handleSelectClass = useCallback(
    (value: string | null) => {
      dispatch(setClassFilter(value));
      monitoring.logEvent(Events.FILTER_APPLIED, {
        type: 'class',
        value: value ?? 'all',
      });
    },
    [dispatch],
  );

  const handleToggleFavoritesFilter = useCallback(() => {
    dispatch(toggleFavoritesFilter());
    monitoring.logEvent(Events.FILTER_APPLIED, {type: 'favorites'});
  }, [dispatch]);

  const handleSelectSortOrder = useCallback(
    (value: ObservationSortOrder) => {
      dispatch(setSortOrder(value));
      monitoring.logEvent(Events.SORT_CHANGED, {sort_order: value});
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(showObservationToast({message: 'Filtros voltaram para o padrão'}));
  }, [dispatch]);

  const handleOpenFilters = useCallback(() => {
    dispatch(openFilterSheet());
  }, [dispatch]);

  const handleCloseFilters = useCallback(() => {
    dispatch(closeFilterSheet());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    observationsQuery.refetch();
  }, [observationsQuery]);

  const handleCreateObservation = useCallback(() => {
    navigation.navigate('ObservationForm', {mode: 'create'});
  }, [navigation]);

  const handleUndoDelete = useCallback(() => {
    if (!pendingDeletedObservation || createObservationMutation.isPending) {
      return;
    }
    dispatch(startUndoObservation());
    createObservationMutation.mutate(pendingDeletedObservation);
  }, [createObservationMutation, dispatch, pendingDeletedObservation]);

  const filteredObservations = useMemo(() => {
    let result = observations;
    if (filterByClass !== null) {
      result = result.filter(item => item.className === filterByClass);
    }
    if (filterByFavorites) {
      result = result.filter(item => item.favorite);
    }
    return sortObservations(result, sortOrder);
  }, [filterByClass, filterByFavorites, observations, sortOrder]);

  const {hasMore, loadMore, paginatedItems, reset: resetPagination} =
    usePagination(filteredObservations, 12);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    loadMoreTimerRef.current = setTimeout(() => {
      loadMore();
      setIsLoadingMore(false);
    }, 400);
  }, [hasMore, isLoadingMore, loadMore]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) {
        clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetPagination();
  }, [filteredObservations, resetPagination]);

  const handleDeleteObservation = useCallback(
    (id: string) => {
      deleteObservationMutation.mutate(id);
    },
    [deleteObservationMutation],
  );

  const handleEditObservation = useCallback(
    (id: string) => {
      navigation.navigate('ObservationForm', {mode: 'edit', observationId: id});
    },
    [navigation],
  );

  const observationItems = useMemo(
    () =>
      paginatedItems.map(item => ({
        ...item,
        relativeTime: formatRelativeObservationTime(item.createdAt),
      })),
    [paginatedItems],
  );

  return {
    availableClasses,
    filterByClass,
    filterByFavorites,
    isFilterSheetOpen,
    observations: observationItems,
    deletePendingId: deleteObservationMutation.isPending
      ? deleteObservationMutation.variables
      : null,
    hasMore,
    isLoadingMore,
    isLoading: observationsQuery.isLoading,
    isError: observationsQuery.isError,
    isRefreshing: observationsQuery.isRefetching,
    sortOrder,
    toastVisible: toast.visible,
    toastMessage: toast.message,
    toastActionLabel: toast.actionLabel,
    undoPending: undoStatus === 'pending',
    onCloseFilters: handleCloseFilters,
    onDeleteObservation: handleDeleteObservation,
    onEditObservation: handleEditObservation,
    onLoadMore: handleLoadMore,
    onOpenFilters: handleOpenFilters,
    onRefresh: handleRefresh,
    onRetry: () => observationsQuery.refetch(),
    onResetFilters: handleResetFilters,
    onSelectClass: handleSelectClass,
    onSelectSortOrder: handleSelectSortOrder,
    onToggleFavoritesFilter: handleToggleFavoritesFilter,
    onToggleFavorite: handleToggleFavorite,
    onCreateObservation: handleCreateObservation,
    onUndoDelete: handleUndoDelete,
  };
}
