import { Template } from 'meteor/templating';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from '/client/redux/store';
import DiscussionContainer from '/imports/ui/react/discussion/containers/DiscussionContainer';

Template.Discussion_Card_Inner.viewmodel({
  doc: '',
  discussionId: '',
  organizationId: '',
  onRendered(template) {
    const { discussionId, organizationId, doc } = template.data;

    ReactDOM.render(
      <Provider store={store}>
        <DiscussionContainer discussionId={discussionId}
                             organizationId={organizationId}
                             doc={doc} />
      </Provider>,
      _.first(this.discussionDOMContainer)
    );
  },
  onDestroyed(template) {
    ReactDOM.unmountComponentAtNode(_.first(this.discussionDOMContainer));
  }
});
