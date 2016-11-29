import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { composeWithDevTools } from 'redux-devtools-extension';
import get from 'lodash.get';
import thunk from 'redux-thunk';
import throttleActions from 'redux-throttle';

import reducer from './reducers';

const defaultWait = 300;
const defaultThrottleOptions = {
  leading: true,
  trailing: true,
};

const middlewares = [
  thunk,
  throttleActions(defaultWait, defaultThrottleOptions),
];

const processedMiddlewares = process.NODE_ENV !== 'production'
  ? composeWithDevTools(applyMiddleware(...middlewares))
  : applyMiddleware(...middlewares);

const store = createStore(
  enableBatching(reducer),
  processedMiddlewares
);

export default store;

export const getState = path => (!!path ? get(store.getState(), path) : store.getState());
