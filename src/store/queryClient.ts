import {QueryClient} from '@tanstack/react-query';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {storage} from '@storage/index';

const CACHE_KEY = 'rq-cache';
// 7 days — professores precisam ver dados offline por dias
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      // gcTime precisa ser >= maxAge do persister para o cache não ser descartado
      gcTime: CACHE_MAX_AGE,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const mmkvPersister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => storage.getString(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.remove(key),
  },
  key: CACHE_KEY,
});
