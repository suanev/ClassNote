import {storage, storageKeys} from '@storage/index';
import {SchoolClassCreatePayload} from '../types/classes';
import {ObservationCreatePayload, ObservationUpsertPayload} from '../types/observations';

export type SyncOperation =
  | {
      entity: 'observation';
      type: 'create';
      tempId: string;
      payload: ObservationCreatePayload;
    }
  | {
      entity: 'observation';
      type: 'update';
      id: string;
      payload: ObservationUpsertPayload;
    }
  | {
      entity: 'observation';
      type: 'delete';
      id: string;
    }
  | {
      entity: 'class';
      type: 'create';
      tempId: string;
      payload: SchoolClassCreatePayload;
    }
  | {
      entity: 'class';
      type: 'delete';
      id: string;
    };

type LegacySyncOperation =
  | {type: 'create'; tempId: string; payload: ObservationCreatePayload}
  | {type: 'update'; id: string; payload: ObservationUpsertPayload}
  | {type: 'delete'; id: string};

const isObservationCreatePayload = (
  payload: unknown,
): payload is ObservationCreatePayload => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  return (
    typeof candidate.student === 'string' &&
    typeof candidate.className === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.favorite === 'boolean'
  );
};

const normalizeOperation = (operation: unknown): SyncOperation | null => {
  if (!operation || typeof operation !== 'object') {
    return null;
  }

  const candidate = operation as Partial<SyncOperation & LegacySyncOperation>;

  if (candidate.entity === 'observation') {
    if (candidate.type === 'create' && candidate.tempId && candidate.payload) {
      return candidate as SyncOperation;
    }
    if (candidate.type === 'update' && candidate.id && candidate.payload) {
      return candidate as SyncOperation;
    }
    if (candidate.type === 'delete' && candidate.id) {
      return candidate as SyncOperation;
    }
  }

  if (candidate.entity === 'class') {
    if (candidate.type === 'create' && candidate.tempId && candidate.payload) {
      return candidate as SyncOperation;
    }
    if (candidate.type === 'delete' && candidate.id) {
      return candidate as SyncOperation;
    }
  }

  if (candidate.type === 'create' && candidate.tempId && isObservationCreatePayload(candidate.payload)) {
    return {
      entity: 'observation',
      type: 'create',
      tempId: candidate.tempId,
      payload: candidate.payload,
    };
  }

  if (candidate.type === 'update' && candidate.id && candidate.payload) {
    return {
      entity: 'observation',
      type: 'update',
      id: candidate.id,
      payload: candidate.payload,
    };
  }

  if (candidate.type === 'delete' && candidate.id) {
    return {
      entity: 'observation',
      type: 'delete',
      id: candidate.id,
    };
  }

  return null;
};

const read = (): SyncOperation[] => {
  const raw = storage.getString(storageKeys.syncQueue);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map(normalizeOperation)
      .filter((operation): operation is SyncOperation => operation !== null);
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
  replaceAll: (queue: SyncOperation[]): void => write(queue),
  shift: (): SyncOperation | undefined => {
    const queue = read();
    if (queue.length === 0) return undefined;
    const [first, ...rest] = queue;
    write(rest);
    return first;
  },
  clear: (): void => write([]),
};
