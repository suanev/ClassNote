import { createMMKV } from 'react-native-mmkv';

const APP_PREFIX = '@TeacherObservationsApp:';

export const storage = createMMKV({
  id: 'teacher-observations-storage',
});

export const storageKeys = {
  syncQueue: `${APP_PREFIX}/sync-queue`,
  favorites: `${APP_PREFIX}/favorites`,
  lastSync: `${APP_PREFIX}/last-sync`,
  theme: `${APP_PREFIX}/theme-preference`,
  filterPreferences: `${APP_PREFIX}/filter-preferences`,
  pendingUndo: `${APP_PREFIX}/pending-undo`,
  appIcon: `${APP_PREFIX}/app-icon`,
} as const;

export const getItem = async (key: string): Promise<string | null> =>
  storage.getString(key) ?? null;

export const setItem = async (key: string, value: string): Promise<void> => {
  storage.set(key, value);
};

export const removeItem = async (key: string): Promise<void> => {
  storage.remove(key);
};

export const getLastSync = (): Promise<string | null> => getItem(storageKeys.lastSync);

export const setLastSync = async (value: string): Promise<void> => {
  await setItem(storageKeys.lastSync, value);
};

export const touchLastSync = async (): Promise<string> => {
  const timestamp = new Date().toISOString();
  await setLastSync(timestamp);
  return timestamp;
};
