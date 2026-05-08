import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Observation} from '../../types/observations';

export const DEFAULT_OBSERVATION_SORT_ORDER = 'recent-first';

export type ObservationSortOrder = 'recent-first' | 'old-first' | 'favorites-first';
type ToastTone = 'success' | 'error';

type ObservationToastState = {
  visible: boolean;
  message: string;
  actionLabel: string | null;
  tone: ToastTone;
};

type ObservationsState = {
  filterByClass: string | null;
  filterByFavorites: boolean;
  sortOrder: ObservationSortOrder;
  isFilterSheetOpen: boolean;
  pendingDeletedObservation: Observation | null;
  undoStatus: 'idle' | 'pending';
  toast: ObservationToastState;
};

const initialState: ObservationsState = {
  filterByClass: null,
  filterByFavorites: false,
  sortOrder: DEFAULT_OBSERVATION_SORT_ORDER,
  isFilterSheetOpen: false,
  pendingDeletedObservation: null,
  undoStatus: 'idle',
  toast: {
    visible: false,
    message: '',
    actionLabel: null,
    tone: 'success',
  },
};

const observationsSlice = createSlice({
  name: 'observations',
  initialState,
  reducers: {
    openFilterSheet(state) {
      state.isFilterSheetOpen = true;
    },
    closeFilterSheet(state) {
      state.isFilterSheetOpen = false;
    },
    setClassFilter(state, action: PayloadAction<string | null>) {
      state.filterByClass = action.payload;
    },
    toggleFavoritesFilter(state) {
      state.filterByFavorites = !state.filterByFavorites;
    },
    setSortOrder(state, action: PayloadAction<ObservationSortOrder>) {
      state.sortOrder = action.payload;
    },
    resetFilters(state) {
      state.filterByClass = null;
      state.filterByFavorites = false;
      state.sortOrder = DEFAULT_OBSERVATION_SORT_ORDER;
    },
    queueDeletedObservation(state, action: PayloadAction<Observation>) {
      state.pendingDeletedObservation = action.payload;
      state.undoStatus = 'idle';
      state.toast = {
        visible: true,
        message: 'Observação apagada',
        actionLabel: 'Desfazer',
        tone: 'success',
      };
    },
    startUndoObservation(state) {
      state.undoStatus = 'pending';
    },
    finishUndoObservation(state) {
      state.undoStatus = 'idle';
      state.pendingDeletedObservation = null;
      state.toast.visible = false;
      state.toast.actionLabel = null;
      state.toast.message = '';
    },
    dismissObservationToast(state) {
      state.toast.visible = false;
      state.toast.actionLabel = null;
      state.toast.message = '';
      state.pendingDeletedObservation = null;
      state.undoStatus = 'idle';
    },
    showObservationToast(
      state,
      action: PayloadAction<{
        message: string;
        tone?: ToastTone;
        actionLabel?: string | null;
      }>,
    ) {
      state.toast = {
        visible: true,
        message: action.payload.message,
        actionLabel: action.payload.actionLabel ?? null,
        tone: action.payload.tone ?? 'success',
      };
    },
    restoreFilterPreferences(
      state,
      action: PayloadAction<{filterByClass: string | null; sortOrder: ObservationSortOrder}>,
    ) {
      state.filterByClass = action.payload.filterByClass;
      state.sortOrder = action.payload.sortOrder;
    },
    showObservationErrorToast(state, action: PayloadAction<string>) {
      state.toast = {
        visible: true,
        message: action.payload,
        actionLabel: null,
        tone: 'error',
      };
      state.pendingDeletedObservation = null;
      state.undoStatus = 'idle';
    },
  },
});

export const {
  closeFilterSheet,
  dismissObservationToast,
  finishUndoObservation,
  openFilterSheet,
  queueDeletedObservation,
  resetFilters,
  restoreFilterPreferences,
  setClassFilter,
  setSortOrder,
  showObservationToast,
  showObservationErrorToast,
  startUndoObservation,
  toggleFavoritesFilter,
} = observationsSlice.actions;

export const observationsReducer = observationsSlice.reducer;
