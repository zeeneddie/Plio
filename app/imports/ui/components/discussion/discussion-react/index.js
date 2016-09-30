import './discussion-react.html';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import DiscussionContainer from './containers/DiscussionContainer';
import store from '/client/redux/store';

Template.Discussion_React.onRendered(function() {
  const { discussionId, organizationId, standard } = this.data;

  ReactDOM.render(
    <Provider store={store}>
      <DiscussionContainer discussionId={discussionId}
                           organizationId={organizationId}
                           standard={standard}/>
    </Provider>,
    this.$('#discussion')[0]
  );
});

Template.Discussion_React.onDestroyed(function() {
  ReactDOM.unmountComponentAtNode(this.$('#discussion')[0]);
});
