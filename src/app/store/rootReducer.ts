import {combineReducers} from '@reduxjs/toolkit';

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  app: placeholderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
