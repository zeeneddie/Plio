import { createStore, applyMiddleware } from "redux";
import { enableBatching } from 'redux-batched-actions';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import get from 'lodash.get';

import reducer from "./reducers";

const middlewares = [
  logger(),
  thunk
]

const store = createStore(
  enableBatching(reducer),
  applyMiddleware(...middlewares)
);

export default store;

export const getState = path => get(store.getState(), path);
