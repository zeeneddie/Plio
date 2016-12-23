import store, { getState } from '/imports/client/store';

export default {
  store,
  getState,
  dispatch: store.dispatch,
};
