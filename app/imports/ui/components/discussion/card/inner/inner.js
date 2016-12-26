import { Template } from 'meteor/templating';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import store from '/imports/client/store';
import { setUrlItemId } from '/imports/client/store/actions/globalActions';
import { setOrgId } from '/imports/client/store/actions/organizationsActions';
import DiscussionContainer from '/imports/ui/react/discussion/containers/DiscussionContainer';

Template.Discussion_Card_Inner.viewmodel({
  doc: '',
  discussionId: '',
  organizationId: '',
  onRendered(template) {
    const { discussionId, organizationId, doc } = template.data;

    store.dispatch(batchActions([
      setUrlItemId(doc._id),
      setOrgId(organizationId),
    ]));

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
