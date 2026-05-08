import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type NetworkState = {
  isOffline: boolean;
  isSyncing: boolean;
};

const networkSlice = createSlice({
  name: 'network',
  initialState: {isOffline: false, isSyncing: false} as NetworkState,
  reducers: {
    setOffline(state, action: PayloadAction<boolean>) {
      state.isOffline = action.payload;
    },
    setSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload;
    },
  },
});

export const {setOffline, setSyncing} = networkSlice.actions;
export const networkReducer = networkSlice.reducer;
