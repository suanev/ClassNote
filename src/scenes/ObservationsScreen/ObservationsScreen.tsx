import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  RefreshControl,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from 'styled-components/native';

import {
  AppHeader,
  EmptyState,
  FAB as Fab,
  FilterBottomSheet,
  IconButton,
  ObservationSkeleton,
  ObservationUndoToast,
  ScreenContainer,
  SwipeableObservationItem,
  SyncStatusIcon,
} from '@components/index';
import {RootStackParamList} from '@navigation/types';
import {ClassShift, SchoolClass} from '../../types/classes';
import {ObservationSortOrder} from '@store/observations/slice';

import {
  ContentContainer,
  CountLabel,
  EmptyStateWrapper,
  FilterGroup,
  FilterRow,
  HeaderActionsRow,
  listContentStyle,
  LoadingFooter,
  Screen,
  SectionLabel,
} from './styles';

type ObservationItemView = {
  id: string;
  student: string;
  className: string;
  shift?: string;
  text: string;
  relativeTime: string;
  favorite: boolean;
};

interface ObservationsScreenProps {
  readonly availableClasses: readonly SchoolClass[];
  readonly filteredObservationsCount: number;
  readonly filterByShift: ClassShift | null;
  readonly filterByClass: string | null;
  readonly filterByFavorites: boolean;
  readonly filterCount: number;
  readonly hasAnyObservations: boolean;
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly isFilterSheetOpen: boolean;
  readonly observations: readonly ObservationItemView[];
  readonly deletePendingId: string | null | undefined;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly sortOrder: ObservationSortOrder;
  readonly toastVisible: boolean;
  readonly toastMessage: string;
  readonly toastActionLabel: string | null;
  readonly undoPending: boolean;
  readonly onCloseFilters: () => void;
  readonly onDeleteObservation: (id: string) => void;
  readonly onEditObservation: (id: string) => void;
  readonly onLoadMore: () => void;
  readonly onOpenFilters: () => void;
  readonly onRefresh: () => void;
  readonly onResetFilters: () => void;
  readonly onSelectShift: (value: ClassShift | null) => void;
  readonly onSelectClass: (value: string | null) => void;
  readonly onSelectSortOrder: (value: ObservationSortOrder) => void;
  readonly onToggleFavoritesFilter: () => void;
  readonly onToggleFavorite: (id: string) => void;
  readonly onCreateObservation: () => void;
  readonly onUndoDelete: () => void;
}

export function ObservationsScreen({
  availableClasses,
  filteredObservationsCount,
  filterByShift,
  filterByClass,
  filterByFavorites,
  filterCount,
  hasAnyObservations,
  hasMore,
  isLoadingMore,
  isFilterSheetOpen,
  observations,
  deletePendingId,
  isLoading,
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
  onResetFilters,
  onSelectShift,
  onSelectClass,
  onSelectSortOrder,
  onToggleFavoritesFilter,
  onToggleFavorite,
  onCreateObservation,
  onUndoDelete,
}: ObservationsScreenProps): React.JSX.Element {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const emptyStateDescription = useMemo(() => {
    if (filterByFavorites && filterByClass) {
      return 'Nenhuma observação favorita para essa turma.';
    }
    if (filterByFavorites) {
      return 'Quando você marcar observações com estrela, elas vão aparecer aqui para acesso mais rápido.';
    }
    if (filterByClass) {
      return 'Ainda não há observações para essa turma. Você pode criar a primeira e começar o histórico.';
    }
    return 'Quando você registrar novas observações, elas vão aparecer aqui com destaque e contexto da turma.';
  }, [filterByClass, filterByFavorites]);

  const keyExtractor = useCallback((item: ObservationItemView) => item.id, []);

  const renderItem = useCallback<ListRenderItem<ObservationItemView>>(
    ({item}) => (
      <SwipeableObservationItem
        id={item.id}
        student={item.student}
        className={item.className}
        shift={item.shift}
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

  return (
    <ScreenContainer>
      <Screen>
        <AppHeader
          mode="home"
          title="Observações"
          rightContent={
            <HeaderActionsRow>
              <SyncStatusIcon />
              <IconButton
                icon="settings"
                onPress={() => navigation.navigate('Settings')}
                accessibilityLabel="Abrir ajustes"
                testID="settings-button"
              />
            </HeaderActionsRow>
          }
        />
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
          contentContainerStyle={listContentStyle}
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
            hasAnyObservations ? (
            <ContentContainer>
              <FilterRow>
                <FilterGroup>
                  <Pressable
                    onPress={onOpenFilters}
                    testID="filters-trigger-button"
                    accessibilityRole="button"
                    accessibilityLabel="Abrir filtros"
                    style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <IconButton
                      icon="filter-variant"
                      iconLibrary="material-community"
                      badgeCount={filterCount}
                      disabled
                    />
                    <SectionLabel>FILTROS</SectionLabel>
                  </Pressable>
                </FilterGroup>
                <CountLabel>
                  {filteredObservationsCount} {filteredObservationsCount === 1 ? 'registro' : 'registros'}
                </CountLabel>
              </FilterRow>
            </ContentContainer>
            ) : null}
          ListFooterComponent={
            isLoadingMore ? (
              <LoadingFooter>
                <ActivityIndicator color={theme.colors.primary} />
              </LoadingFooter>
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

        <Fab
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
          filterByShift={filterByShift}
          filterByClass={filterByClass}
          filterByFavorites={filterByFavorites}
          availableClasses={availableClasses as SchoolClass[]}
          isOpen={isFilterSheetOpen}
          sortOrder={sortOrder}
          onClose={onCloseFilters}
          onReset={onResetFilters}
          onSelectShift={onSelectShift}
          onSelectClass={onSelectClass}
          onToggleFavorites={onToggleFavoritesFilter}
          onSelectSortOrder={onSelectSortOrder}
        />
      </Screen>
    </ScreenContainer>
  );
}
