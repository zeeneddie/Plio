import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import uniqBy from 'lodash.uniqby';

import MessagesList from '../../components/MessagesList';
import { Messages } from '/imports/api/messages/messages.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';
import { setMessages, setLoading } from '/client/redux/actions/discussionActions';
import store from '/client/redux/store';
import { getState } from '/client/redux/store';

const getDiscussionState = () => getState('discussion');

const onPropsChange = (props, onData) => {
  const {
    discussionId,
    dispatch,
    limit = 50,
    sort = { createdAt: -1 },
    at = null
  } = props;

  const subscription = Meteor.subscribe('messages', discussionId, { limit, sort, at });

  dispatch(setLoading(true));

  const state = getDiscussionState();

  if (state.messages.length) {
    onData(null, state);
  }

  if (subscription.ready()) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();
    const newMessages = ((() => {
      if (at) {
        const allMessages = getDiscussionState().messages.concat(messages);
        const uniqMessages = uniqBy(allMessages, '_id');
        const sorter = ({ createdAt:c1 }, { createdAt:c2 }) => c1 - c2;
        const sortedMessages = uniqMessages.sort(sorter);

        return sortedMessages;
      }

      return messages;
    })());

    dispatch(setLoading(false));
    dispatch(setMessages(newMessages));

    onData(null, getDiscussionState());
  }

  return () => subscription.stop();
};

export default composeAll(
  composeWithTracker(onPropsChange),
  connect(store => _.pick(store.discussion, 'limit', 'sort', 'at'))
)(MessagesList);
