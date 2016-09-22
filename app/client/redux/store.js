import { createStore, applyMiddleware } from "redux";
import { enableBatching } from 'redux-batched-actions';
import get from 'lodash.get';

import reducer from "./reducers";

const store = createStore(
  enableBatching(reducer)
);

export default store;

export const getState = path => get(store.getState(), path);
