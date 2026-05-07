import {all} from 'redux-saga/effects';

import {classesSaga} from './classes/sagas';
import {favoritesSaga} from './favorites/sagas';
import {observationsSaga} from './observations/sagas';

export function* rootSaga() {
  yield all([classesSaga(), observationsSaga(), favoritesSaga()]);
}
