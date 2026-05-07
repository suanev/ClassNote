import {createSlice} from '@reduxjs/toolkit';

type FavoritesState = {
  observationIds: string[];
};

const initialState: FavoritesState = {
  observationIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
});

export const favoritesReducer = favoritesSlice.reducer;
