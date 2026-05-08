import {call, put, takeEvery} from 'redux-saga/effects';

import {getItem, removeItem, setItem, storageKeys} from '@storage/index';
import type {Observation} from '../../types/observations';
import {
  dismissObservationToast,
  finishUndoObservation,
  queueDeletedObservation,
} from '../observations/slice';

function* persistPendingUndo({
  payload,
}: ReturnType<typeof queueDeletedObservation>) {
  yield call(setItem, storageKeys.pendingUndo, JSON.stringify(payload));
}

function* clearPendingUndo() {
  yield call(removeItem, storageKeys.pendingUndo);
}

function* restorePendingUndo() {
  const stored: string | null = yield call(getItem, storageKeys.pendingUndo);
  if (!stored) {
    return;
  }
  const observation: Observation = JSON.parse(stored);
  yield call(removeItem, storageKeys.pendingUndo);
  yield put(queueDeletedObservation(observation));
}

export function* favoritesSaga() {
  yield call(restorePendingUndo);
  yield takeEvery(queueDeletedObservation.type, persistPendingUndo);
  yield takeEvery(
    [dismissObservationToast.type, finishUndoObservation.type],
    clearPendingUndo,
  );
}
