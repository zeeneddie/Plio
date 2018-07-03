import React from 'react';
import { Provider } from 'react-redux';

import store from '/imports/client/store';
import StandardsDataLoader from '../../containers/DataLoader';

const StandardsProvider = props => (
  <Provider store={store}>
    <StandardsDataLoader {...props} />
  </Provider>
);

export default StandardsProvider;
