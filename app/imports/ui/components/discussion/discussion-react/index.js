import './discussion-react.html';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import DiscussionContainer from './containers/DiscussionContainer';
import store from '/client/redux/store';

Template.Discussion_React.viewmodel({
  onRendered(template) {
    const { discussionId, organizationId, standard } = template.data;

    ReactDOM.render(
      <Provider store={store}>
        <DiscussionContainer discussionId={discussionId}
                             organizationId={organizationId}
                             standard={standard} />
      </Provider>,
      template.$('#discussion')[0]
    );
  },
  onDestroyed(template) {
    ReactDOM.unmountComponentAtNode(template.$('#discussion')[0]);
  }
});
