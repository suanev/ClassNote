import {combineReducers} from '@reduxjs/toolkit';

import {classesReducer} from './classes/slice';
import {favoritesReducer} from './favorites/slice';
import {networkReducer} from './network/slice';
import {observationsReducer} from './observations/slice';

export const rootReducer = combineReducers({
  classes: classesReducer,
  network: networkReducer,
  observations: observationsReducer,
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
