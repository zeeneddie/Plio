import React from 'react';
import { Provider } from 'react-redux';

import store from '/client/redux/store';
import StandardsDataLoader from '../../containers/StandardsDataLoader';

const StandardsProvider = (props) => (
  <Provider store={store}>
    <StandardsDataLoader {...props} />
  </Provider>
);

export default StandardsProvider;
