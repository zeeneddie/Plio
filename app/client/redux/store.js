import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import get from 'lodash.get';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import throttleActions from 'redux-throttle';

import reducer from './reducers';

const defaultWait = 300;
const defaultThrottleOptions = {
  leading: true,
  trailing: true,
};

let middlewares = [
  thunk,
  throttleActions(defaultWait, defaultThrottleOptions),
];

if (process.NODE_ENV !== 'production') {
  middlewares = middlewares.concat([logger()]);
}

const store = createStore(
  enableBatching(reducer),
  applyMiddleware(...middlewares)
);

export default store;

export const getState = path => !!path ? get(store.getState(), path) : store.getState();
