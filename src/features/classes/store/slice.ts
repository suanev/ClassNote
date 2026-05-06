import {createSlice} from '@reduxjs/toolkit';

type ClassesState = {
  ids: string[];
};

const initialState: ClassesState = {
  ids: [],
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
});

export const classesReducer = classesSlice.reducer;
