import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import get from 'lodash.get';
import thunk from 'redux-thunk';
import throttleActions from 'redux-throttle';

import reducer from './reducers';

const DEFAULT_WAIT = 300;
const DEFAULT_THROTTLE_OPTIONS = {
  leading: true,
  trailing: true,
};

const middlewares = [
  thunk,
  throttleActions(DEFAULT_WAIT, DEFAULT_THROTTLE_OPTIONS),
];

const processedMiddlewares = process.env.NODE_ENV !== 'production' &&
  require('redux-devtools-extension').composeWithDevTools(applyMiddleware(...middlewares)) ||
  applyMiddleware(...middlewares);

const store = createStore(
  enableBatching(reducer),
  processedMiddlewares,
);

export default store;

export const getState = path => (path ? get(store.getState(), path) : store.getState());
