import {createMMKV} from 'react-native-mmkv';

const APP_PREFIX = '@TeacherObservationsApp:';

export const storage = createMMKV({
  id: 'teacher-observations-storage',
});

export const storageKeys = {
  syncQueue:    `${APP_PREFIX}/sync-queue`,
  favorites:    `${APP_PREFIX}/favorites`,
  lastSync:     `${APP_PREFIX}/last-sync`,
  theme:        `${APP_PREFIX}/theme-preference`,
} as const;

export const getItem = async (key: string): Promise<string | null> =>
  storage.getString(key) ?? null;

export const setItem = async (key: string, value: string): Promise<void> => {
  storage.set(key, value);
};

export const removeItem = async (key: string): Promise<void> => {
  storage.remove(key);
};

export const getLastSync = (): Promise<string | null> =>
  getItem(storageKeys.lastSync);

export const clearAppCache = async (): Promise<void> => {
  const allKeys = storage.getAllKeys();
  const appKeys = allKeys.filter((key: string) => key.startsWith(APP_PREFIX));

  appKeys.forEach((key: string) => {
    storage.remove(key);
  });
};
