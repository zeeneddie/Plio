import { Template } from 'meteor/templating';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

import store from '/imports/client/store';
import { setUrlItemId, setUserId } from '/imports/client/store/actions/globalActions';
import { setOrgId } from '/imports/client/store/actions/organizationsActions';
import DiscussionContainer from '/imports/client/react/discussion/containers/DiscussionContainer';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOrganizations,
  setUsers,
  setUsersByOrgIds,
} from '/imports/client/store/actions/collectionsActions';

Template.Discussion_Card_Inner.viewmodel({
  doc: '',
  discussionId: '',
  organizationId: '',
  onRendered(template) {
    template.autorun(this.loadStore.bind(this));

    const { discussionId, organizationId, doc } = template.data;

    ReactDOM.render(
      <Provider {...{ store }}>
        <DiscussionContainer {...{ discussionId, organizationId, doc }} />
      </Provider>,
      _.first(this.discussionDOMContainer),
    );
  },
  onDestroyed() {
    ReactDOM.unmountComponentAtNode(_.first(this.discussionDOMContainer));
  },
  loadStore() {
    const { organizationId, doc } = this.data();
    const userId = Meteor.userId();
    const users = Meteor.users.find().fetch();
    const organization = Organizations.findOne({ _id: organizationId });

    store.dispatch(batchActions([
      setUrlItemId(doc._id),
      setOrgId(organizationId),
      setUserId(userId),
      setOrganizations([organization]),
      setUsers([...users]),
      setUsersByOrgIds(true),
    ]));
  },
});
