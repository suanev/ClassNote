import {createSlice} from '@reduxjs/toolkit';

type ObservationsState = {
  ids: string[];
};

const initialState: ObservationsState = {
  ids: [],
};

const observationsSlice = createSlice({
  name: 'observations',
  initialState,
  reducers: {},
});

export const observationsReducer = observationsSlice.reducer;
