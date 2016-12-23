import store, { getState } from '/client/redux/store';

export default {
  store,
  getState,
  dispatch: store.dispatch,
};
