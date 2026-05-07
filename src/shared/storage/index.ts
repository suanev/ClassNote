import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_PREFIX = '@TeacherObservationsApp:';

export const storageKeys = {
  syncQueue:    `${APP_PREFIX}/sync-queue`,
  favorites:    `${APP_PREFIX}/favorites`,
  lastSync:     `${APP_PREFIX}/last-sync`,
  theme:        `${APP_PREFIX}/theme-preference`,
} as const;

export const getLastSync = (): Promise<string | null> =>
  AsyncStorage.getItem(storageKeys.lastSync);

export const clearAppCache = async (): Promise<void> => {
  const allKeys = await AsyncStorage.getAllKeys();
  const appKeys = allKeys.filter(k => k.startsWith(APP_PREFIX));
  await AsyncStorage.multiRemove(appKeys);
};

