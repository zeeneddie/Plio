import React from 'react';
import { Provider } from 'react-redux';

import store from '/client/redux/store';
import HelpsDataLoader from '../../containers/HelpsDataLoader';

const HelpsProvider = () => (
  <Provider store={store}>
    <HelpsDataLoader />
  </Provider>
);

export default HelpsProvider;
