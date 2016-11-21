import React from 'react';
import { Provider } from 'react-redux';

import store from '/client/redux/store';
import StandardsDataLoader from '../../containers/StandardsDataLoader';

const StandardsProvider = () => (
  <Provider store={store}>
    <StandardsDataLoader />
  </Provider>
);

export default StandardsProvider;
