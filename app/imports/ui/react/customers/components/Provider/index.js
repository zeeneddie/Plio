import React from 'react';
import { Provider } from 'react-redux';

import store from '/client/redux/store';
import CustomersDataLoader from '../../containers/DataLoader';

const CustomersProvider = (props) => (
  <Provider store={store}>
    <CustomersDataLoader {...props} />
  </Provider>
);

export default CustomersProvider;
