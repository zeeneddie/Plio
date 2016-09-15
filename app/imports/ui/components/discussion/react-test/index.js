import './react-test.html';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Discussion from './components/Discussion';
import store from '/client/redux/store';

Template.React_Test.onRendered(function() {
  const { discussionId, organizationId } = this.data;
  
  ReactDOM.render(
    <Provider store={store}>
      <Discussion discussionId={discussionId}
                  organizationId={organizationId} />
    </Provider>,
    this.$('#discussion')[0]
  );
});
