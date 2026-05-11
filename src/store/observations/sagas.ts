import {call, delay, put, race, select, take, takeLatest} from 'redux-saga/effects';

import {queryKeys} from '@constants/queryKeys';
import {createClass, deleteClass} from '@services/classes';
import {
  createObservation,
  deleteObservation,
  updateObservation,
} from '@services/observations';
import {monitoring, Events} from '@services/monitoring';
import {syncQueue, SyncOperation} from '@services/syncQueue';
import {touchLastSync} from '@storage/index';
import {setStoredClasses, setStoredObservations} from '@storage/index';
import {sortObservations} from '@utils/sort';
import {SchoolClass} from '../../types/classes';
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

const persistObservations = (observations: Observation[]): Observation[] => {
  setStoredObservations(observations);
  return observations;
};

const persistClasses = (classes: SchoolClass[]): SchoolClass[] => {
  setStoredClasses(classes);
  return classes;
};

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
  if (op.entity === 'observation' && op.type === 'create') {
    const created: Observation = yield call(createObservation, op.payload);
    queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
      persistObservations(
        sortObservations(
          (current ?? []).map(item => (item.id === op.tempId ? created : item)),
        ),
      ),
    );
  } else if (op.entity === 'observation' && op.type === 'update') {
    const updated: Observation = yield call(updateObservation, op.id, op.payload);
    queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
      persistObservations(
        sortObservations(
          (current ?? []).map(item => (item.id === op.id ? updated : item)),
        ),
      ),
    );
  } else if (op.entity === 'observation' && op.type === 'delete') {
    yield call(deleteObservation, op.id);
  } else if (op.entity === 'class' && op.type === 'create') {
    const created: SchoolClass = yield call(createClass, op.payload);
    queryClient.setQueryData<SchoolClass[]>(queryKeys.classes, current =>
      persistClasses(
        (current ?? []).map(item => (item.id === op.tempId ? created : item)),
      ),
    );
    queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
      persistObservations(
        sortObservations(
          (current ?? []).map(item =>
            item.classId === op.tempId
              ? {...item, classId: created.id, className: created.name}
              : item,
          ),
        ),
      ),
    );
    syncQueue.replaceAll(
      syncQueue.getAll().map(queuedOperation => {
        if (queuedOperation.entity !== 'observation') {
          return queuedOperation;
        }

        if (queuedOperation.type === 'create') {
          return queuedOperation.payload.classId === op.tempId
            ? ({
                ...queuedOperation,
                payload: {
                  ...queuedOperation.payload,
                  classId: created.id,
                  className: created.name,
                },
              } satisfies SyncOperation)
            : queuedOperation;
        }

        if (queuedOperation.type === 'update') {
          return queuedOperation.payload.classId === op.tempId
            ? ({
                ...queuedOperation,
                payload: {
                  ...queuedOperation.payload,
                  classId: created.id,
                  className: created.name,
                },
              } satisfies SyncOperation)
            : queuedOperation;
        }

        return queuedOperation;
      }),
    );
  } else if (op.entity === 'class' && op.type === 'delete') {
    yield call(deleteClass, op.id);
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
    yield call(touchLastSync);
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
