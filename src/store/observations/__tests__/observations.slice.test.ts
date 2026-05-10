import {
  DEFAULT_OBSERVATION_SORT_ORDER,
  closeFilterSheet,
  dismissObservationToast,
  observationsReducer,
  openFilterSheet,
  queueDeletedObservation,
  resetFilters,
  restoreFilterPreferences,
  setClassFilter,
  setSortOrder,
  showObservationErrorToast,
  showObservationToast,
  startUndoObservation,
  finishUndoObservation,
  toggleFavoritesFilter,
} from '../slice';
import {Observation} from '../../../types/observations';

const observation: Observation = {
  id: 'obs-1',
  student: 'Ana Silva',
  className: '5º A',
  text: 'Texto da observação',
  createdAt: '2026-05-07T12:00:00.000Z',
  updatedAt: '2026-05-07T12:00:00.000Z',
  favorite: true,
};

describe('observations slice', () => {
  it('should open and close the filter sheet', () => {
    const openedState = observationsReducer(undefined, openFilterSheet());
    const closedState = observationsReducer(openedState, closeFilterSheet());

    expect(openedState.isFilterSheetOpen).toBe(true);
    expect(closedState.isFilterSheetOpen).toBe(false);
  });

  it('should set class filter and sort order independently', () => {
    const filteredState = observationsReducer(undefined, setClassFilter('5º A'));
    const sortedState = observationsReducer(filteredState, setSortOrder('old-first'));

    expect(filteredState.filterByClass).toBe('5º A');
    expect(filteredState.filterByFavorites).toBe(false);
    expect(sortedState.sortOrder).toBe('old-first');
  });

  it('should toggle the favorites filter on and off', () => {
    const onState = observationsReducer(undefined, toggleFavoritesFilter());
    const offState = observationsReducer(onState, toggleFavoritesFilter());

    expect(onState.filterByFavorites).toBe(true);
    expect(offState.filterByFavorites).toBe(false);
  });

  it('should combine class and favorites filters independently', () => {
    const withClass = observationsReducer(undefined, setClassFilter('6º B'));
    const withBoth = observationsReducer(withClass, toggleFavoritesFilter());

    expect(withBoth.filterByClass).toBe('6º B');
    expect(withBoth.filterByFavorites).toBe(true);
  });

  it('should reset all filters back to the default state', () => {
    let state = observationsReducer(undefined, setClassFilter('7º C'));
    state = observationsReducer(state, toggleFavoritesFilter());
    state = observationsReducer(state, setSortOrder('favorites-first'));
    const resetState = observationsReducer(state, resetFilters());

    expect(resetState.filterByClass).toBeNull();
    expect(resetState.filterByFavorites).toBe(false);
    expect(resetState.sortOrder).toBe(DEFAULT_OBSERVATION_SORT_ORDER);
  });

  it('should restore persisted filter preferences', () => {
    const restoredState = observationsReducer(
      undefined,
      restoreFilterPreferences({
        filterByClass: '5º A',
        sortOrder: 'favorites-first',
      }),
    );

    expect(restoredState.filterByClass).toBe('5º A');
    expect(restoredState.sortOrder).toBe('favorites-first');
  });

  it('should queue a deleted observation and prepare the undo flow', () => {
    const queuedState = observationsReducer(undefined, queueDeletedObservation(observation));
    const pendingState = observationsReducer(queuedState, startUndoObservation());
    const finishedState = observationsReducer(pendingState, finishUndoObservation());

    expect(queuedState.pendingDeletedObservation).toEqual(observation);
    expect(queuedState.toast.message).toBe('Observação apagada');
    expect(queuedState.toast.actionLabel).toBe('Desfazer');
    expect(pendingState.undoStatus).toBe('pending');
    expect(finishedState.pendingDeletedObservation).toBeNull();
    expect(finishedState.toast.visible).toBe(false);
  });

  it('should show and dismiss success and error toasts', () => {
    const toastState = observationsReducer(
      undefined,
      showObservationToast({message: 'Observação favoritada'}),
    );
    const dismissedState = observationsReducer(toastState, dismissObservationToast());
    const errorState = observationsReducer(
      toastState,
      showObservationErrorToast('Não foi possível atualizar a observação.'),
    );

    expect(toastState.toast.visible).toBe(true);
    expect(toastState.toast.message).toBe('Observação favoritada');
    expect(dismissedState.toast.visible).toBe(false);
    expect(errorState.toast.tone).toBe('error');
    expect(errorState.toast.message).toBe('Não foi possível atualizar a observação.');
  });
});
