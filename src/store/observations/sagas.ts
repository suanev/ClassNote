import {call, delay, put, race, select, take, takeLatest} from 'redux-saga/effects';

import {queryKeys} from '@constants/queryKeys';
import {
  createObservation,
  deleteObservation,
  updateObservation,
} from '@services/observations';
import {monitoring, Events} from '@services/monitoring';
import {syncQueue, SyncOperation} from '@services/syncQueue';
import {sortObservations} from '@utils/sort';
import {Observation} from '../../types/observations';
import {queryClient} from '../queryClient';
import {flushSyncQueue, setSyncing} from '../network/actions';
import type {RootState} from '../index';
import {
  dismissObservationToast,
  queueDeletedObservation,
  showObservationErrorToast,
  showObservationToast,
  startUndoObservation,
} from './slice';

const TOAST_DURATION_MS = 4000;

function* handleToastAutoDismiss() {
  const undoStatus: string = yield select(
    (state: RootState) => state.observations.undoStatus,
  );
  if (undoStatus === 'pending') {
    return;
  }

  const {timeout}: {timeout?: true} = yield race({
    timeout: delay(TOAST_DURATION_MS),
    interrupted: take([
      startUndoObservation.type,
      dismissObservationToast.type,
    ]),
  });

  if (timeout) {
    yield put(dismissObservationToast());
  }
}

function* processOperation(op: SyncOperation) {
  if (op.type === 'create') {
    const created: Observation = yield call(createObservation, op.payload);
    queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
      sortObservations(
        (current ?? []).map(item => (item.id === op.tempId ? created : item)),
      ),
    );
  } else if (op.type === 'update') {
    const updated: Observation = yield call(updateObservation, op.id, op.payload);
    queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
      sortObservations(
        (current ?? []).map(item => (item.id === op.id ? updated : item)),
      ),
    );
  } else if (op.type === 'delete') {
    yield call(deleteObservation, op.id);
  }
}

function* handleSyncQueueFlush() {
  if (syncQueue.isEmpty()) {
    return;
  }

  yield put(setSyncing(true));

  let synced = 0;
  let failed = 0;

  while (!syncQueue.isEmpty()) {
    const op = syncQueue.shift();
    if (!op) break;

    try {
      yield call(processOperation, op);
      synced++;
    } catch {
      syncQueue.push(op);
      failed++;
      break;
    }
  }

  yield put(setSyncing(false));


  if (synced > 0 && failed === 0) {
    monitoring.logEvent(Events.SYNC_COMPLETED, {synced_count: synced});
    yield put(
      showObservationToast({
        message: `${synced} ${synced === 1 ? 'operação sincronizada' : 'operações sincronizadas'}`,
      }),
    );
  } else if (failed > 0) {
    monitoring.logEvent(Events.SYNC_FAILED, {synced_count: synced, failed_count: failed});
    yield put(
      showObservationErrorToast('Algumas operações não puderam ser sincronizadas.'),
    );
  }
}

export function* observationsSaga() {
  yield takeLatest(
    [
      showObservationToast.type,
      showObservationErrorToast.type,
      queueDeletedObservation.type,
    ],
    handleToastAutoDismiss,
  );
  yield takeLatest(flushSyncQueue.type, handleSyncQueueFlush);
}
