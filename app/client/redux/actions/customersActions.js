import { SET_CUSTOMERS_INITIALIZING } from './types';

export function setInitializing(initializing) {
  return {
    type: SET_CUSTOMERS_INITIALIZING,
    payload: { initializing },
  };
}
