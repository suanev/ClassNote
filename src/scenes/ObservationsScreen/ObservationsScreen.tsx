import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, FlatList, Platform, RefreshControl, View} from 'react-native';
import {useTheme} from 'styled-components/native';

import {
  Button,
  EmptyState,
  FAB,
  FilterBottomSheet,
  ObservationSkeleton,
  ObservationUndoToast,
  ScreenContainer,
  SwipeableObservationItem,
  SyncStatusIcon,
} from '@components/index';
import {ObservationSortOrder} from '@store/observations/slice';

import {
  EmptyStateWrapper,
  ContentContainer,
  SectionHeaderRow,
  Screen,
  SectionLabel,
  TitleRow,
  TitleText,
} from './styles';

type ObservationItemView = {
  id: string;
  student: string;
  className: string;
  text: string;
  relativeTime: string;
  favorite: boolean;
};

interface ObservationsScreenProps {
  availableClasses: string[];
  filterByClass: string | null;
  filterByFavorites: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  isFilterSheetOpen: boolean;
  observations: ObservationItemView[];
  deletePendingId: string | null | undefined;
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
}

export function ObservationsScreen({
  availableClasses,
  filterByClass,
  filterByFavorites,
  hasMore,
  isLoadingMore,
  isFilterSheetOpen,
  observations,
  deletePendingId,
  isLoading,
  isError,
  isRefreshing,
  sortOrder,
  toastVisible,
  toastMessage,
  toastActionLabel,
  undoPending,
  onCloseFilters,
  onDeleteObservation,
  onEditObservation,
  onLoadMore,
  onOpenFilters,
  onRefresh,
  onRetry,
  onResetFilters,
  onSelectClass,
  onSelectSortOrder,
  onToggleFavoritesFilter,
  onToggleFavorite,
  onCreateObservation,
  onUndoDelete,
}: ObservationsScreenProps): React.JSX.Element {
  const theme = useTheme();

  const emptyStateDescription = useMemo(() => {
    if (filterByFavorites && filterByClass) {
      return `Nenhuma observação favorita para ${filterByClass}.`;
    }
    if (filterByFavorites) {
      return 'Quando você marcar observações com estrela, elas vão aparecer aqui para acesso mais rápido.';
    }
    if (filterByClass) {
      return `Ainda não há observações para ${filterByClass}. Você pode criar a primeira e começar o histórico dessa turma.`;
    }
    return 'Quando você registrar novas observações, elas vão aparecer aqui com destaque e contexto da turma.';
  }, [filterByClass, filterByFavorites]);

  const keyExtractor = useCallback((item: ObservationItemView) => item.id, []);

  const renderItem = useCallback(
    ({item}: {item: ObservationItemView}) => (
      <SwipeableObservationItem
        id={item.id}
        student={item.student}
        className={item.className}
        relativeTime={item.relativeTime}
        text={item.text}
        isFavorite={item.favorite}
        isDeleting={deletePendingId === item.id}
        onPress={() => onEditObservation(item.id)}
        onDelete={onDeleteObservation}
        onToggleFavorite={() => onToggleFavorite(item.id)}
      />
    ),
    [deletePendingId, onDeleteObservation, onEditObservation, onToggleFavorite],
  );

  if (isLoading) {
    return <ObservationSkeleton />;
  }

  if (isError) {
    return (
      <ScreenContainer>
        <EmptyStateWrapper>
          <EmptyState
            title="Erro ao carregar"
            description="Não foi possível buscar as observações. Verifique sua conexão e tente novamente."
            actionLabel="Tentar novamente"
            onAction={onRetry}
          />
        </EmptyStateWrapper>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Screen>
        <FlatList
          data={observations}
          keyExtractor={keyExtractor}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          onEndReached={hasMore ? onLoadMore : undefined}
          onEndReachedThreshold={0.4}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 12, paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={renderItem}
          ListHeaderComponent={
            <ContentContainer>
              <TitleRow>
                <TitleText>Observações</TitleText>
                <SyncStatusIcon />
              </TitleRow>
              <SectionHeaderRow>
                <SectionLabel>RECENTES</SectionLabel>
                <Button
                  icon="tune"
                  minWidth={128}
                  onPress={onOpenFilters}
                  testID="open-filters-button"
                  accessibilityLabel="Abrir filtros"
                  variant="outline">
                  Filtros
                </Button>
              </SectionHeaderRow>
            </ContentContainer>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{paddingVertical: 24, alignItems: 'center'}}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyStateWrapper>
              <EmptyState
                title="Nenhuma observação por aqui"
                description={emptyStateDescription}
                actionLabel="Criar observação"
                onAction={onCreateObservation}
              />
            </EmptyStateWrapper>
          }
        />

        <FAB
          onPress={onCreateObservation}
          testID="create-observation-button"
          accessibilityLabel="Criar observação"
        />

        {toastVisible ? (
          <ObservationUndoToast
            message={toastMessage}
            actionLabel={undoPending ? null : toastActionLabel}
            onAction={onUndoDelete}
          />
        ) : null}

        <FilterBottomSheet
          filterByClass={filterByClass}
          filterByFavorites={filterByFavorites}
          availableClasses={availableClasses}
          isOpen={isFilterSheetOpen}
          sortOrder={sortOrder}
          onClose={onCloseFilters}
          onReset={onResetFilters}
          onSelectClass={onSelectClass}
          onToggleFavorites={onToggleFavoritesFilter}
          onSelectSortOrder={onSelectSortOrder}
        />
      </Screen>
    </ScreenContainer>
  );
}
