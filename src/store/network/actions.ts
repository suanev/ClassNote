import {createAction} from '@reduxjs/toolkit';

export {setOffline, setSyncing} from './slice';
export const flushSyncQueue = createAction('network/flushSyncQueue');
