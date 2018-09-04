import React from 'react';
import { Provider } from 'react-redux';

import store from '/imports/client/store';
import HelpDocsDataLoader from '../../containers/HelpDocsDataLoader';

const HelpDocsProvider = () => (
  <Provider store={store}>
    <HelpDocsDataLoader />
  </Provider>
);

export default HelpDocsProvider;
