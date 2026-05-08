import {call, put, select, takeEvery} from 'redux-saga/effects';

import {getItem, setItem, storageKeys} from '@storage/index';
import type {RootState} from '../index';
import {
  ObservationSortOrder,
  resetFilters,
  restoreFilterPreferences,
  setClassFilter,
  setSortOrder,
} from '../observations/slice';

type FilterPreferences = {
  filterByClass: string | null;
  sortOrder: ObservationSortOrder;
};

function* saveFilterPreferences() {
  const filterByClass: string | null = yield select(
    (state: RootState) => state.observations.filterByClass,
  );
  const sortOrder: ObservationSortOrder = yield select(
    (state: RootState) => state.observations.sortOrder,
  );
  const prefs: FilterPreferences = {filterByClass, sortOrder};
  yield call(setItem, storageKeys.filterPreferences, JSON.stringify(prefs));
}

function* loadFilterPreferences() {
  const stored: string | null = yield call(getItem, storageKeys.filterPreferences);
  if (!stored) {
    return;
  }
  const prefs: FilterPreferences = JSON.parse(stored);
  yield put(restoreFilterPreferences(prefs));
}

export function* classesSaga() {
  yield call(loadFilterPreferences);
  yield takeEvery(
    [setClassFilter.type, setSortOrder.type, resetFilters.type],
    saveFilterPreferences,
  );
}
