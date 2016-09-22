import { createStore, applyMiddleware } from "redux";
import { enableBatching } from 'redux-batched-actions';
import logger from 'redux-logger';
import get from 'lodash.get';

import reducer from "./reducers";

const store = createStore(
  enableBatching(reducer),
  applyMiddleware(logger())
);

export default store;

export const getState = path => get(store.getState(), path);
