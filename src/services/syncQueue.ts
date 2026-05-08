import {storage, storageKeys} from '@storage/index';
import {ObservationCreatePayload, ObservationUpsertPayload} from '../types/observations';

export type SyncOperation =
  | {type: 'create'; tempId: string; payload: ObservationCreatePayload}
  | {type: 'update'; id: string; payload: ObservationUpsertPayload}
  | {type: 'delete'; id: string};

const read = (): SyncOperation[] => {
  const raw = storage.getString(storageKeys.syncQueue);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SyncOperation[];
  } catch {
    return [];
  }
};

const write = (queue: SyncOperation[]): void => {
  storage.set(storageKeys.syncQueue, JSON.stringify(queue));
};

export const syncQueue = {
  getAll: (): SyncOperation[] => read(),
  isEmpty: (): boolean => read().length === 0,
  push: (op: SyncOperation): void => write([...read(), op]),
  shift: (): SyncOperation | undefined => {
    const queue = read();
    if (queue.length === 0) return undefined;
    const [first, ...rest] = queue;
    write(rest);
    return first;
  },
  clear: (): void => write([]),
};
