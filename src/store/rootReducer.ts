import {combineReducers} from '@reduxjs/toolkit';

import {classesReducer} from './classes/slice';
import {favoritesReducer} from './favorites/slice';
import {observationsReducer} from './observations/slice';

export const rootReducer = combineReducers({
  classes: classesReducer,
  observations: observationsReducer,
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
